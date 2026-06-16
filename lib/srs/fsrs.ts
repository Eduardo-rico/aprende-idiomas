// lib/srs/fsrs.ts
import { fsrs, createEmptyCard, Rating as FsrsRating, generatorParameters, type Grade, type StepUnit } from "ts-fsrs";
import { type Card, type CardId, type Rating, RATING } from "../db/schema";
import { FSRS_CONFIG } from "./config";

// ts-fsrs types `learning_steps` and `relearning_steps` as `StepUnit[]`
// where `StepUnit` is a template literal like `${number}m`. We declare
// the config tuples as that exact type so the values flow through without
// a cast.
const scheduler = fsrs(generatorParameters({
  request_retention: FSRS_CONFIG.request_retention,
  enable_fuzz: FSRS_CONFIG.enable_fuzz,
  maximum_interval: FSRS_CONFIG.maximum_interval,
  learning_steps: FSRS_CONFIG.learning_steps as readonly StepUnit[] as StepUnit[],
  relearning_steps: FSRS_CONFIG.relearning_steps as readonly StepUnit[] as StepUnit[],
}));

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
  const result = scheduler.next(card.fsrs, now, toGrade(rating));
  return Math.max(0, result.card.due.getTime() - now.getTime());
}

export function isNewCard(card: Card): boolean {
  return card.state === 0;
}
