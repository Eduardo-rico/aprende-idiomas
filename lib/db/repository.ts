// lib/db/repository.ts
import { db, type Card, type CardId, type Rating, type AnswerEvent, type GenericEvent, type Session, type Variant, type StoryProgressRow } from "./schema";
import { newCard, schedule } from "../srs/fsrs";
import { recordAnswerForConcepts } from "../mastery/concept";
import { currentStreak, didStudyToday, isStreakAlive } from "@/lib/streak/streak";
import { levelFromXp } from "@/lib/xp/calculator";
import { RULES, type AppState } from "@/lib/achievements/rules";

export async function getOrCreateCard(id: CardId, blockId: number, lessonId: string): Promise<Card> {
  const existing = await db.cards.get(id);
  if (existing) return existing;
  const fresh = newCard(id, blockId, lessonId);
  await db.cards.add(fresh);
  return fresh;
}

export async function getDueCards(now: Date, limit: number): Promise<Card[]> {
  return db.cards
    .where("nextReviewAt")
    .belowOrEqual(now)
    .limit(limit)
    .toArray();
}

export async function getDueInBlock(blockId: number, now: Date, limit: number): Promise<Card[]> {
  return db.cards
    .where("[blockId+nextReviewAt]")
    .between([blockId, new Date(0)], [blockId, now])
    .limit(limit)
    .toArray();
}

export async function getDueInLesson(lessonId: string, now: Date, limit: number): Promise<Card[]> {
  return db.cards
    .where("[lessonId+nextReviewAt]")
    .between([lessonId, new Date(0)], [lessonId, now])
    .limit(limit)
    .toArray();
}

export async function getCardById(id: CardId): Promise<Card | undefined> {
  return db.cards.get(id);
}

export interface SubmitAnswerParams {
  cardId: CardId;
  rating: Rating;
  responseMs: number;
  mode: Session["mode"];
  variant: Variant;
  conceptIds: string[];
  blockId: number;
  sessionId?: number;
}

export async function submitAnswer(p: SubmitAnswerParams): Promise<void> {
  await db.transaction("rw", db.cards, db.events, db.conceptMastery, db.sessions, async () => {
    const card = await db.cards.get(p.cardId);
    if (!card) throw new Error(`Card not found: ${p.cardId}`);
    const updated = schedule(card, p.rating);
    await db.cards.put(updated);

    const event: AnswerEvent = {
      ts: new Date(),
      type: "answer",
      cardId: p.cardId,
      sessionId: p.sessionId,
      rating: p.rating,
      correct: p.rating >= 3,
      responseMs: p.responseMs,
      mode: p.mode,
      conceptIds: p.conceptIds,
      variant: p.variant,
    };
    await db.events.add(event);

    await recordAnswerForConcepts(p.conceptIds, p.blockId, p.rating >= 3);

    if (p.sessionId) {
      // CRITICAL FIX (I8): original had broken parens — `?? 0 + 1` parsed as `?? 1`.
      const sess = await db.sessions.get(p.sessionId);
      await db.sessions.update(p.sessionId, {
        cardsReviewed: (sess?.cardsReviewed ?? 0) + 1,
        correctCount: (sess?.correctCount ?? 0) + (p.rating >= 3 ? 1 : 0),
      });
    }
  });
}

export async function getOrCreateStoryProgress(
  storyId: string,
  variant: Variant,
): Promise<StoryProgressRow> {
  const existing = await db.storyProgress.get(storyId);
  if (existing) {
    // Update lastVariant if it changed and return the merged row
    if (existing.lastVariant !== variant) {
      await db.storyProgress.update(storyId, { lastVariant: variant });
      return { ...existing, lastVariant: variant };
    }
    return existing;
  }
  const now = new Date();
  const row: StoryProgressRow = {
    storyId,
    startedAt: now,
    completedAt: null,
    lastVariant: variant,
  };
  await db.storyProgress.put(row);
  const event: GenericEvent = { ts: now, type: "story_started", payload: { storyId, variant } };
  await db.events.add(event);
  return row;
}

export async function markStoryCompleted(storyId: string): Promise<void> {
  const row = await db.storyProgress.get(storyId);
  if (!row) throw new Error(`StoryProgress not found: ${storyId}`);
  // Idempotency: if already completed, do nothing (no double event)
  if (row.completedAt !== null) return;
  const now = new Date();
  await db.storyProgress.update(storyId, { completedAt: now });
  const event: GenericEvent = { ts: now, type: "story_completed", payload: { storyId } };
  await db.events.add(event);
}

export async function getCompletedStories(): Promise<string[]> {
  // Use .filter() because null keys are not indexed in IndexedDB,
  // making .where("completedAt").above(new Date(0)) unreliable with fake-indexeddb.
  const rows = await db.storyProgress
    .filter((row) => row.completedAt !== null)
    .toArray();
  return rows.map((row) => row.storyId);
}

// ─── Streak / XP / Achievement helpers ────────────────────────────────────────

export async function recordSessionEnd(
  sessionId: number,
  variant: Variant,
  minutesStudied: number,
  cardsReviewed: number,
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const existing = await db.streak.get(today);
  const newMinutes = (existing?.minutesStudied ?? 0) + minutesStudied;
  const newCards = (existing?.cardsReviewed ?? 0) + cardsReviewed;
  await db.streak.put({
    date: today,
    minutesStudied: newMinutes,
    cardsReviewed: newCards,
    xpEarned: existing?.xpEarned ?? 0,
  });
  const event: GenericEvent = {
    ts: new Date(),
    type: "session_complete",
    payload: { sessionId, variant, minutes: minutesStudied, cards: cardsReviewed },
  };
  await db.events.add(event);
}

export async function addXp(
  amount: number,
): Promise<{ before: number; after: number; leveledUp: boolean }> {
  const before = (await db.xp.get("total"))?.value ?? 0;
  const after = before + amount;
  await db.xp.put({ key: "total", value: after, updatedAt: new Date() });
  const levelBefore = levelFromXp(before);
  const levelAfter = levelFromXp(after);
  const leveledUp = levelAfter > levelBefore;
  if (leveledUp) {
    for (let lv = levelBefore + 1; lv <= levelAfter; lv++) {
      const ev: GenericEvent = { ts: new Date(), type: "level_up", payload: { level: lv } };
      await db.events.add(ev);
    }
  }
  return { before, after, leveledUp };
}

export async function emitStreakDayIfQualified(goalMin: number): Promise<boolean> {
  const all = await db.streak.toArray();
  const today = new Date().toISOString().slice(0, 10);
  if (!didStudyToday(all, today, goalMin)) return false;
  const todayRow = all.find((s) => s.date === today);
  if (!todayRow || todayRow.xpEarned > 0) return false;
  await db.streak.update(today, { xpEarned: 20 });
  const event: GenericEvent = { ts: new Date(), type: "streak_day", payload: { date: today } };
  await db.events.add(event);
  await addXp(20);
  return true;
}

export async function getStreakStatus(
  goalMin: number,
): Promise<{ currentStreak: number; todayMinutes: number; isStreakAlive: boolean }> {
  const all = await db.streak.toArray();
  const today = new Date().toISOString().slice(0, 10);
  // Semantic fix: if today hasn't qualified yet but yesterday's chain is alive,
  // show the alive chain length rather than 0 (so Home never shows "0 días" with a 🔥).
  const base = currentStreak(all, today, goalMin);
  let streakCount: number;
  if (base > 0) {
    streakCount = base;
  } else {
    const alive = isStreakAlive(all, today);
    if (alive) {
      // Compute yesterday's date offset
      const d = new Date(today + "T00:00:00");
      d.setDate(d.getDate() - 1);
      const yesterdayISO = d.toISOString().slice(0, 10);
      streakCount = currentStreak(all, yesterdayISO, goalMin);
    } else {
      streakCount = 0;
    }
  }
  return {
    currentStreak: streakCount,
    todayMinutes: all.find((s) => s.date === today)?.minutesStudied ?? 0,
    isStreakAlive: isStreakAlive(all, today),
  };
}

export async function getTotalXp(): Promise<number> {
  return (await db.xp.get("total"))?.value ?? 0;
}

export async function getUnlockedAchievements(): Promise<Set<string>> {
  const rows = await db.achievements.toArray();
  return new Set(rows.map((r) => r.id));
}

export async function unlockAchievement(ruleId: string): Promise<boolean> {
  const existing = await db.achievements.get(ruleId);
  if (existing) return false;
  await db.achievements.put({ id: ruleId, unlockedAt: new Date() });
  const event: GenericEvent = {
    ts: new Date(),
    type: "achievement_unlocked",
    payload: { ruleId },
  };
  await db.events.add(event);
  await addXp(100);
  return true;
}

export async function getAppState(goalMin: number): Promise<AppState> {
  const events = await db.events.toArray();
  const mastery = await db.conceptMastery.toArray();

  // Use .filter() for completedAt — same reason as getCompletedStories (null keys unreliable).
  const completedStories = await db.storyProgress
    .filter((row) => row.completedAt !== null)
    .count();

  // AnswerEvent rows are the discriminated union branch with flat `variant` field.
  const answerEvents = events.filter((e): e is AnswerEvent => e.type === "answer");
  const variantsUsed = new Set(answerEvents.map((e) => e.variant).filter(Boolean));

  const genericEvents = events.filter((e): e is GenericEvent => e.type !== "answer");
  const lessonsCompleted = genericEvents.filter((e) => e.type === "lesson_complete");
  const diagnosticEvents = genericEvents.filter((e) => e.type === "diagnostic_completed");

  // Cards in DB (lib/db/schema.ts Card) do not have a tags field — vocabCardsLearned
  // cannot be derived from the cards table with the current schema.
  // Return 0 as a safe default; will be wired up when the schema gains a tags column.
  const vocabCardsLearned = 0;

  const streakStatus = await getStreakStatus(goalMin);

  // Build completedBlocks: blockId appears in >= 5 lesson_complete events
  const lessonsByBlock: Record<number, number> = {};
  for (const ev of lessonsCompleted) {
    const blockId = ev.payload.blockId;
    if (typeof blockId === "number") {
      lessonsByBlock[blockId] = (lessonsByBlock[blockId] ?? 0) + 1;
    }
  }
  const completedBlocks = Object.entries(lessonsByBlock)
    .filter(([, n]) => n >= 5)
    .map(([b]) => Number(b));

  return {
    totalAnswers: answerEvents.length,
    currentStreak: streakStatus.currentStreak,
    completedBlocks,
    perfectLessons: lessonsCompleted.length,
    storiesRead: completedStories,
    vocabCardsLearned,
    conceptsMastery80: mastery.filter((m) => m.masteryPct >= 80).length,
    diagnosticCount: diagnosticEvents.length,
    variantsUsed,
  };
}

export async function checkAndUnlockAchievements(goalMin: number): Promise<string[]> {
  const state = await getAppState(goalMin);
  const prev = await getUnlockedAchievements();
  const newRules = RULES.filter((r) => !prev.has(r.id) && r.check(state));
  for (const r of newRules) {
    await unlockAchievement(r.id);
  }
  return newRules.map((r) => r.id);
}
