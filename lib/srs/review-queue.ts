// lib/srs/review-queue.ts
import type { Card } from "../db/schema";

export interface DueQueueOptions {
  /** Maximum total cards returned. */
  cap: number;
  /** Maximum brand-new (state === 0) cards included. */
  newCardsPerDay: number;
}

export interface DueQueue {
  review: Card[];
  newCards: Card[];
}

/** Pure queue builder. Takes a flat list of "due" cards (already filtered
 *  by `nextReviewAt <= now`) and returns a review-first, capped, ordered
 *  queue. Extracted from `repository.getDueCards` so it can be unit-tested
 *  without a fake IndexedDB.
 *
 *  Ordering rules:
 *    - All review cards (state > 0) come first, sorted by due time ascending
 *      (most overdue first).
 *    - New cards (state === 0) come after, sorted by introducedAt ascending
 *      (oldest introduction first), capped at `newCardsPerDay`.
 *    - The total is capped at `cap`. `newCardsPerDay` is a HARD MAX (not a
 *      forced minimum) — if overdue reviews fill the cap, new cards get
 *      zero slots that day. Symmetrically, if there are no reviews, all
 *      `cap` slots can be filled with new cards. */
export function buildDueQueue(
  cardsDue: Card[],
  options: DueQueueOptions,
): DueQueue {
  const reviewAll = cardsDue
    .filter((c) => c.state > 0)
    .sort((a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime());

  const newAll = cardsDue
    .filter((c) => c.state === 0)
    .sort((a, b) => a.introducedAt.getTime() - b.introducedAt.getTime());

  // Reviews first, capped so review+new never exceeds the total cap.
  const reviewCap = Math.max(0, options.cap);
  const review = reviewAll.slice(0, reviewCap);

  // Whatever slots the reviews didn't claim are available for new cards,
  // but never more than `newCardsPerDay`.
  const newSlots = Math.max(0, options.cap - review.length);
  const newCards = newAll.slice(0, Math.min(options.newCardsPerDay, newSlots));

  return { review, newCards };
}
