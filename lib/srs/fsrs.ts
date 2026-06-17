// lib/srs/fsrs.ts
import { createEmptyCard, Rating as FsrsRating, type Grade } from "ts-fsrs";
import { type Card, type CardId, type Rating, RATING } from "../db/schema";
import { getScheduler } from "./scheduler";

function toGrade(rating: Rating): Grade {
  switch (rating) {
    case RATING.Again: return FsrsRating.Again;
    case RATING.Hard:  return FsrsRating.Hard;
    case RATING.Good:  return FsrsRating.Good;
    case RATING.Easy:  return FsrsRating.Easy;
  }
}

export function newCard(id: CardId, blockId: number, lessonId: string): Card {
  const empty = createEmptyCard(new Date());
  return {
    id,
    blockId,
    lessonId,
    contentHash: id,
    fsrs: empty,
    nextReviewAt: empty.due,
    state: empty.state,
    reps: empty.reps,
    lapses: empty.lapses,
    introducedAt: new Date(),
  };
}

export function schedule(card: Card, rating: Rating, now = new Date()): Card {
  // Resolved per call so changes to the 5 generatorParameters fields
  // (request_retention, enable_fuzz, maximum_interval, learning_steps,
  // relearning_steps) take effect on the next grade, not on the next
  // page load. See lib/srs/scheduler.ts for the cache/rebuild logic.
  const scheduler = getScheduler();
  const result = scheduler.next(card.fsrs, now, toGrade(rating));
  return {
    ...card,
    fsrs: result.card,
    nextReviewAt: result.card.due,
    state: result.card.state,
    reps: result.card.reps,
    lapses: result.card.lapses,
    lastRating: rating,
    lastReviewedAt: now,
  };
}

/** Preview the interval a card would receive for a given rating, without
 *  mutating the card. Used by the runner to show "Próxima: en 3 días" the
 *  moment the user grades — the actual write happens in `schedule()`. */
export function previewIntervalMs(card: Card, rating: Rating, now = new Date()): number {
  const scheduler = getScheduler();
  const result = scheduler.next(card.fsrs, now, toGrade(rating));
  return Math.max(0, result.card.due.getTime() - now.getTime());
}

export function isNewCard(card: Card): boolean {
  return card.state === 0;
}
