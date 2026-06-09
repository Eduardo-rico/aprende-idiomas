// lib/srs/fsrs.ts
import { fsrs, createEmptyCard, Rating as FsrsRating, generatorParameters } from "ts-fsrs";
import { type Card, type CardId, type Rating, RATING } from "../db/schema";

const scheduler = fsrs(generatorParameters({ request_retention: 0.9 }));

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
  const fsrsRating =
    rating === RATING.Again ? FsrsRating.Again
    : rating === RATING.Hard  ? FsrsRating.Hard
    : rating === RATING.Good  ? FsrsRating.Good
                              : FsrsRating.Easy;

  const result = scheduler.next(card.fsrs, now, fsrsRating);
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

export function isNewCard(card: Card): boolean {
  return card.state === 0;
}
