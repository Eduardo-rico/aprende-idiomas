// lib/db/repository.ts
import { db, type Card, type CardId, type Rating, type AnswerEvent, type GenericEvent, type Session, type StoryProgressRow, type LessonView, type UserProfile, type UiStateRow, type TelemetryEvent, type DailyGoalRow } from "./schema";
import { newCard, schedule } from "../srs/fsrs";
import { buildDueQueue, type DueQueueOptions } from "../srs/review-queue";
import { FSRS_CONFIG } from "../srs/config";
import { resetLeech, isLeech } from "../srs/leeches";
import { recordAnswerForConcepts } from "../mastery/concept";
import { currentStreak, didStudyToday, isStreakAlive } from "@/lib/streak/streak";
import { levelFromXp } from "@/lib/xp/calculator";
import { RULES, type AppState } from "@/lib/achievements/rules";
import { DEFAULT_LANGUAGE, type LanguageId } from "@/lib/locales";
import { type VariantKey, legacyVariantToKey } from "@/lib/data/variant";

export async function getOrCreateCard(id: CardId, blockId: number, lessonId: string): Promise<Card> {
  const existing = await db.cards.get(id);
  if (existing) return existing;
  const fresh = newCard(id, blockId, lessonId);
  await db.cards.add(fresh);
  return fresh;
}

export interface GetDueCardsOptions {
  /** Maximum total cards in the returned queue. Defaults to `limit`. */
  cap?: number;
  /** Maximum brand-new (state === 0) cards included. Defaults to 0. */
  newCardsPerDay?: number;
}

/** Returns due cards ordered review-first, then new, capped at `cap` and
 *  with at most `newCardsPerDay` brand-new cards. Backward compatible: if
 *  no `options` is provided, behaves as before (just trim to `limit`). */
export async function getDueCards(now: Date, limit: number, options: GetDueCardsOptions = {}): Promise<Card[]> {
  const all = await db.cards
    .where("nextReviewAt")
    .belowOrEqual(now)
    .toArray();
  const cap = options.cap ?? limit;
  const newPerDay = options.newCardsPerDay ?? 0;
  // If no per-day cap is requested, fall back to the legacy behavior so
  // existing callers (e.g. block-page counters) keep their semantics.
  if (newPerDay === 0) {
    return all.slice(0, cap);
  }
  const { review, newCards } = buildDueQueue(all, { cap, newCardsPerDay: newPerDay, newCardsFloor: FSRS_CONFIG.new_cards_floor } satisfies DueQueueOptions);
  return [...review, ...newCards];
}

/** Get due cards matching ANY of the given tags (multi-tag OR semantics).
 *  Uses the `*tags` multiEntry index added in schema v5. If `tags` is empty
 *  or the user passes `["all"]`, falls through to the existing
 *  `getDueCards` so the unfiltered behavior is preserved.
 *
 *  Note: the date range (`belowOrEqual(now)`) and the tag filter are
 *  intersected in memory — Dexie doesn't support multi-index intersection
 *  and `[*tags+nextReviewAt]` is illegal (no multiEntry compounds). The
 *  tag index keeps the initial scan small (only cards with that tag),
 *  and the date filter is cheap. */
export async function getDueCardsByTag(
  tags: string[],
  now: Date,
  limit: number,
  options: GetDueCardsOptions = {},
): Promise<Card[]> {
  if (tags.length === 0) {
    return getDueCards(now, limit, options);
  }
  const tagged = await db.cards
    .where("tags")
    .anyOf(tags)
    .toArray();
  const due = tagged.filter((c) => c.nextReviewAt.getTime() <= now.getTime());
  // Reuse the same review-first / new-cap ordering as getDueCards.
  const cap = options.cap ?? limit;
  const newPerDay = options.newCardsPerDay ?? 0;
  if (newPerDay === 0) {
    return due.slice(0, cap);
  }
  const { review, newCards } = buildDueQueue(due, { cap, newCardsPerDay: newPerDay, newCardsFloor: FSRS_CONFIG.new_cards_floor } satisfies DueQueueOptions);
  return [...review, ...newCards];
}

/** Count of cards that have the given tag. Cheap (O(log N)) via the
 *  `*tags` multiEntry index. Used by the filter bar to render
 *  "Vocab (47)" next to each chip. */
export async function getCardsByTagCount(tag: string): Promise<number> {
  return db.cards.where("tags").equals(tag).count();
}

export async function getDueInBlock(blockId: number, now: Date, limit: number): Promise<Card[]> {
  return db.cards
    .where("[blockId+nextReviewAt]")
    .between([blockId, new Date(0)], [blockId, now])
    .limit(limit)
    .toArray();
}

function startOfDay(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Count of `answer` events recorded since local midnight. Drives the
 *  "X repasos" display on /learn and /review. */
export async function getReviewedCountToday(now: Date = new Date()): Promise<number> {
  return db.events
    .where("ts")
    .above(startOfDay(now))
    .filter((e): e is AnswerEvent => e.type === "answer")
    .count();
}

/** Count of brand-new cards introduced since local midnight. With the v4
 *  `introducedAt` index this is an indexed count; without it, the call
 *  would fall back to a full table scan. The index is mandatory for the
 *  daily queue to be fast on large collections. */
export async function getNewCardCountToday(now: Date = new Date()): Promise<number> {
  return db.cards
    .where("introducedAt")
    .above(startOfDay(now))
    .count();
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

/** Reset a leech card: rebuild FSRS state to New while keeping id, blockId,
 *  lessonId, contentHash, and the original introducedAt. Returns the
 *  updated card. Caller should re-read the card into the runner so the user
 *  sees the freshly-reset state on the next render. */
export async function resetLeechCard(id: CardId, now: Date = new Date()): Promise<Card> {
  const card = await db.cards.get(id);
  if (!card) throw new Error(`resetLeechCard: card ${id} not found`);
  if (!isLeech(card)) {
    // Idempotent / safe: if the user double-taps the reset we don't double-reset.
    return card;
  }
  const fresh = resetLeech(card, now);
  await db.cards.put(fresh);
  return fresh;
}

export interface SubmitAnswerParams {
  cardId: CardId;
  rating: Rating;
  responseMs: number;
  mode: Session["mode"];
  variant: VariantKey;
  conceptIds: string[];
  blockId: number;
  sessionId?: number;
}

export async function submitAnswer(p: SubmitAnswerParams): Promise<Card> {
  let updated: Card | undefined;
  await db.transaction("rw", db.cards, db.events, db.conceptMastery, db.sessions, async () => {
    const card = await db.cards.get(p.cardId);
    if (!card) throw new Error(`Card not found: ${p.cardId}`);
    updated = schedule(card, p.rating);
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
  if (!updated) throw new Error(`submitAnswer: card ${p.cardId} disappeared mid-transaction`);
  return updated;
}

export async function getOrCreateStoryProgress(
  storyId: string,
  variant: VariantKey,
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

// ─── Vocab card helpers ──────────────────────────────────────────────────────
// Vocab cards live in the same `cards` table as exercise cards (FSRS-managed)
// but are identified by an `id` prefix of `vocab-{lang}-`. Phase 4 added
// the lang segment so the same word in two different target languages
// doesn't collide (e.g. `vocab-pt-bom` vs `vocab-ru-bom`).
//
// Schema v5 added a real `tags?: string[]` field; we now stamp
// `["vocab", "lang:{lang}", ...]` on every vocab card (with an optional
// `story:{storyId}` from the Story Reader) so the filter bar on /learn
// and the `vocab-50` achievement work without scanning the id prefix.
//
// Migration on first touch: pre-Phase-4 rows have the legacy id
// `vocab-{word}` (no lang). On the first lookup we find that row by
// scanning the `vocab-` prefix and rename it to `vocab-{lang}-{word}`.
// Migration only runs for `lang === "pt"` (the only language with
// content); for empty scaffolds the caller creates a fresh row.
const VOCAB_ID_PREFIX = 'vocab-';

export interface GetOrCreateVocabCardOpts {
  /** When provided, the card is tagged with `story:{storyId}` in addition
   *  to the standard `vocab` tag. Used by the Story Reader to mark which
   *  story introduced a given word. */
  storyId?: string;
  /** Phase 4: the target language the word belongs to. Used both as the
   *  id segment (so different langs don't collide) and as the
   *  `language` field on the Card row (so per-language queries via the
   *  schema v6 index work). Defaults to "pt" for back-compat. */
  language?: LanguageId;
}

export async function getOrCreateVocabCard(
  word: string,
  meaning: string,
  conceptId: string,
  opts: GetOrCreateVocabCardOpts = {},
): Promise<Card> {
  const language: LanguageId = opts.language ?? DEFAULT_LANGUAGE;
  const wordKey = word.toLowerCase();
  const newId = `${VOCAB_ID_PREFIX}${language}-${wordKey}`;
  const desiredTags = [
    "vocab",
    `lang:${language}`,
    ...(opts.storyId ? [`story:${opts.storyId}`] : []),
  ];
  // Read + write in one transaction so two concurrent callers don't
  // race past the getOrCreate guard and create duplicate cards.
  return db.transaction("rw", db.cards, async () => {
    const existing = await db.cards.get(newId);
    if (existing) {
      // Append any new tags from `desiredTags` (de-dup) and stamp the
      // language field if it's missing. Existing tags are preserved so
      // we don't clobber a tag the user previously earned.
      const existingTags = existing.tags ?? [];
      const mergedTags = Array.from(new Set([...existingTags, ...desiredTags]));
      const needsLanguageStamp = !existing.language;
      if (mergedTags.length !== existingTags.length || needsLanguageStamp) {
        const updated: Card = {
          ...existing,
          tags: mergedTags,
          ...(needsLanguageStamp ? { language } : {}),
        };
        await db.cards.put(updated);
        return updated;
      }
      return existing;
    }
    // First-touch migration: a pre-Phase-4 row with the legacy id
    // `vocab-{wordKey}` (no lang segment) might still exist. Find it by
    // scanning the `vocab-` prefix and rename it to the new id. Only
    // for "pt" — the empty scaffolds have no rows to migrate.
    if (language === "pt") {
      const legacyId = `${VOCAB_ID_PREFIX}${wordKey}`;
      if (legacyId !== newId) {
        const legacy = await db.cards.get(legacyId);
        if (legacy) {
          const renamed: Card = {
            ...legacy,
            id: newId,
            tags: Array.from(new Set([...(legacy.tags ?? []), ...desiredTags])),
            language,
          };
          await db.cards.delete(legacyId);
          await db.cards.put(renamed);
          return renamed;
        }
      }
    }
    const fresh = newCard(newId, 0, `vocab-${conceptId}`);
    fresh.tags = desiredTags;
    fresh.language = language;
    // The Card schema doesn't store the meaning/word directly — those live
    // in the vocab-catalog.json and are looked up by the UI from the id. We
    // do not duplicate them on the Card row (avoids sync drift).
    await db.cards.add(fresh);
    return fresh;
  });
}

export async function getDueVocabCards(limit: number, now: Date = new Date()): Promise<Card[]> {
  // .filter() (not .where) because the prefix isn't indexed. We still hit the
  // nextReviewAt index first by reading all due cards, then narrowing to vocab.
  const due = await db.cards
    .where('nextReviewAt')
    .belowOrEqual(now)
    .toArray();
  return due.filter((c) => c.id.startsWith(VOCAB_ID_PREFIX)).slice(0, limit);
}

export async function getDueCardsCount(now: Date = new Date()): Promise<number> {
  return db.cards.where('nextReviewAt').belowOrEqual(now).count();
}


export async function recordSessionEnd(
  sessionId: number,
  variant: VariantKey,
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
  // Translate any legacy "br"/"pt" values to canonical "pt-br"/"pt-pt" so the
  // achievement rules in lib/achievements/rules.ts (which key on canonical
  // names) actually fire on pre-Phase-4 data. See lib/data/variant.ts.
  const answerEvents = events.filter((e): e is AnswerEvent => e.type === "answer");
  const variantsUsed = new Set(
    answerEvents.map((e) => legacyVariantToKey(e.variant)).filter(Boolean),
  );

  const genericEvents = events.filter((e): e is GenericEvent => e.type !== "answer");
  const lessonsCompleted = genericEvents.filter((e) => e.type === "lesson_complete");
  const diagnosticEvents = genericEvents.filter((e) => e.type === "diagnostic_completed");

  // Count vocab cards via the `*tags` multiEntry index added in schema v5.
  // This is O(log N) and reflects the "vocab-50" achievement rule
  // (lib/achievements/rules.ts:38), which fires at >= 50. Note: pre-v5
  // vocab cards (created with the `vocab-` id prefix but no tag) don't
  // count here until the user touches them in VocabDrill or the Story
  // Reader — see plan "no backfill."
  const vocabCardsLearned = await db.cards.where("tags").equals("vocab").count();

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

// ─── Lesson views (L4: lessons-before-exercises) ────────────────
//
// One row per "user saw this lesson content". Written by `LessonStep`
// when the user clicks "Continuar a ejercicios →". Read by `LessonGate`
// to decide whether to re-show the lesson or skip straight to practice,
// and by the future `/review` "Repasar lección" feature.
//
// Schema: see `LessonView` in lib/db/schema.ts (v7).

/** Record that a user has seen a lesson's content page. Returns the
 *  new row's id so callers can correlate it with their own UI state.
 *
 *  The id is `lessonview-{language}-{lessonId}-{ts}` where `ts` is
 *  `Date.now()`. The `ts` suffix guarantees uniqueness even if the
 *  user double-taps the "Continuar" button within the same millisecond
 *  (rare but possible — the button does no debounce). */
export async function recordLessonView(
  lessonId: string,
  language: LanguageId,
): Promise<string> {
  // One Date.now() for BOTH the id suffix and viewedAt — two separate calls
  // can straddle a millisecond boundary, leaving the id's timestamp ≠
  // viewedAt (an occasional flake, and a real inconsistency in the data).
  const now = Date.now();
  const id = `lessonview-${language}-${lessonId}-${now}`;
  const row: LessonView = {
    id,
    lessonId,
    language,
    viewedAt: now,
  };
  await db.lessonViews.add(row);
  return id;
}

/** All views for a language, newest first. Used by /review "Repasar
 *  lección" to surface recently-seen lessons. Uses the
 *  `[language+viewedAt]` compound index added in schema v7. */
export async function getLessonViewsForLanguage(
  language: LanguageId,
): Promise<LessonView[]> {
  const rows = await db.lessonViews
    .where("[language+viewedAt]")
    .between([language, 0], [language, Number.MAX_SAFE_INTEGER])
    .toArray();
  return rows.sort((a, b) => b.viewedAt - a.viewedAt);
}

/** The most recent view of a specific lesson in a specific language,
 *  or `undefined` if the user has never seen it. Used by `LessonGate`
 *  to decide between "show the lesson again" and "skip straight to
 *  practice". */
export async function getLastLessonView(
  lessonId: string,
  language: LanguageId,
): Promise<LessonView | undefined> {
  const rows = await db.lessonViews
    .where("[language+viewedAt]")
    .between([language, 0], [language, Number.MAX_SAFE_INTEGER])
    .toArray();
  const matching = rows.filter((r) => r.lessonId === lessonId);
  if (matching.length === 0) return undefined;
  return matching.reduce((acc, r) => (r.viewedAt > acc.viewedAt ? r : acc));
}

// ─── v8 helpers ───────────────────────────────────────────────────────────────

// v8 helpers
export async function getUiState<T = unknown>(key: string): Promise<T | undefined> {
  const row = await db.uiState.get(key);
  return row?.value as T | undefined;
}
export async function setUiState(key: string, value: unknown): Promise<void> {
  await db.uiState.put({ key, value, updatedAt: new Date() });
}
export async function logTelemetry(level: "warn" | "error", source: string, message: string, context?: Record<string, unknown>): Promise<void> {
  // Ring buffer: si > 1000 filas, borra las 200 más antiguas.
  const count = await db.telemetry.count();
  if (count > 1000) {
    const old = await db.telemetry.orderBy("ts").limit(200).primaryKeys();
    await db.telemetry.bulkDelete(old);
  }
  await db.telemetry.add({ ts: new Date(), level, source, message, context });
}
export async function getUserProfile(): Promise<UserProfile | undefined> {
  return db.userProfile.get("me");
}
