// tests/unit/xp-award.test.ts
import { describe, it, expect } from 'vitest';
import { xpForRating } from '@/lib/xp/calculator';
import type { Rating } from '@/lib/db/schema';

describe('xp decoupled from FSRS rating (E12)', () => {
  it('Hard, Good, Easy award the same XP', () => {
    expect(xpForRating(2 as Rating)).toBe(xpForRating(3 as Rating));
    expect(xpForRating(3 as Rating)).toBe(xpForRating(4 as Rating));
  });
  it('Again (1) awards no more than a correct grade', () => {
    expect(xpForRating(1 as Rating)).toBeLessThanOrEqual(xpForRating(3 as Rating));
  });
});
