// lib/db/repository.ts
import { db, type Card, type CardId, type Rating, type AnswerEvent, type GenericEvent, type Session, type Variant, type StoryProgressRow } from "./schema";
import { newCard, schedule } from "../srs/fsrs";
import { recordAnswerForConcepts } from "../mastery/concept";

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
