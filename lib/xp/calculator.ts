// lib/xp/calculator.ts
import type { Rating } from "@/lib/db/schema";

const RATING_XP: Record<Rating, number> = {
  1: 0, 2: 0, 3: 1, 4: 5,
};

const EVENT_XP: Record<string, number> = {
  answer: 0,
  lesson_complete: 30,
  session_complete: 0,
  story_started: 0,
  story_completed: 10,
  streak_day: 20,
  level_up: 0,
  achievement_unlocked: 100,
  diagnostic_completed: 0,
};

export function xpForRating(r: Rating): number {
  return RATING_XP[r];
}

export function xpForEvent(type: string): number {
  return EVENT_XP[type] ?? 0;
}

/**
 * Cumulative XP needed to complete level n (i.e. total XP at the start of level n+1).
 * Formula: 100 * n(n+1)(2n+1)/6
 * cumulative(0) = 0, cumulative(1) = 100, cumulative(2) = 500,
 * cumulative(3) = 1400, cumulative(4) = 3000, cumulative(5) = 5500
 */
function cumulativeXpForLevel(n: number): number {
  return Math.round((100 * n * (n + 1) * (2 * n + 1)) / 6);
}

export function levelFromXp(total: number): number {
  if (total < 100) return 0;
  let n = 1;
  while (cumulativeXpForLevel(n + 1) <= total) n++;
  return n;
}

/**
 * Returns progress within the current level.
 * - current: the level the user is on
 * - start: cumulative XP at the START of the current level (= cumulativeXpForLevel(current - 1))
 *          This is 0 for level 1 (since level 0 ends at 0 XP).
 * - end: cumulative XP at the END of the current level (= cumulativeXpForLevel(current + 1))
 *        This is 500 for level 1.
 * - pct: fraction of the current level completed, using the actual range within this level:
 *        (total - cumulativeXpForLevel(current)) / (cumulativeXpForLevel(current+1) - cumulativeXpForLevel(current))
 *        Note: start != the lower bound of pct; start is the absolute XP floor of this level tier.
 */
export function levelProgress(total: number): { current: number; start: number; end: number; pct: number } {
  const current = levelFromXp(total);
  // start: cumulative XP floor of the PREVIOUS level tier (0 at level ≤1). It is NOT
  // the lower bound of pct — UI must use pct directly, never (total-start)/(end-start).
  const start = current === 0 ? 0 : cumulativeXpForLevel(current - 1);
  // end: absolute XP threshold that ends this level (= cumulative of next level)
  const end = cumulativeXpForLevel(current + 1);
  // pct: progress within the current level band [cumulative(current), cumulative(current+1)]
  const levelFloor = cumulativeXpForLevel(current);
  const levelCeil = cumulativeXpForLevel(current + 1);
  const pct = current === 0 ? total / levelCeil : (total - levelFloor) / (levelCeil - levelFloor);
  return { current, start, end, pct };
}
