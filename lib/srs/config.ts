// lib/srs/config.ts
import type { StepUnit } from "ts-fsrs";

//
// Central FSRS-5 + daily queue configuration. Change values here to retune
// scheduling behavior; everything downstream (fsrs.ts, review-queue.ts,
// repository.ts, UI pages) reads from this single source of truth.
//
// Defaults chosen to match the Anki "kind" preset: target retention 90 %,
// 2 short learning steps, 1 relearning step, fuzz enabled so a 10-day
// review doesn't land on the exact same minute across cards.
//
// Daily cap and new-cards-per-day are conservative — a user can scale them
// up by editing this file, and a future settings page can expose them.
export const FSRS_CONFIG = {
  /** Target probability of recall on a graded card. ts-fsrs uses this to
   *  invert the desired interval from the card's stability. 0.9 = Anki default. */
  request_retention: 0.9,

  /** Add ±5 % jitter to intervals so users don't see every card on the same
   *  day. Recommended by ts-fsrs authors. */
  enable_fuzz: true,

  /** Cap any single interval at 1 year. Without this, a long-stable card
   *  would schedule itself years out and effectively disappear. */
  maximum_interval: 365,

  /** Steps (in minutes) for a brand-new card before it graduates to Review.
   *  A "Good" answer advances one step; an "Again" resets to the first step. */
  learning_steps: ["1m", "10m"] as readonly StepUnit[],

  /** Steps (in minutes) for a card that was "Again" in Review. After all
   *  steps pass with Good, the card returns to Review with reduced stability. */
  relearning_steps: ["10m"] as readonly StepUnit[],

  /** Maximum review cards (state > 0, due) shown in a single /review session.
   *  Prevents an overflow on a return-from-vacation day. */
  daily_review_cap: 100,

  /** Maximum brand-new cards (state === 0) introduced in a single /review
   *  session. Limits the cognitive load on a busy day. */
  new_cards_per_day: 10,

  /** A card is flagged as a "leech" once it has been lapsed this many times.
   *  UI surfaces a reset action; the algorithm otherwise treats it normally. */
  leech_lapses_threshold: 8,
} as const;

export type FsrsConfig = typeof FSRS_CONFIG;
