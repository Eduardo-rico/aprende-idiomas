// tests/unit/leeches.test.ts
import { describe, it, expect } from "vitest";
import { isLeech, resetLeech } from "@/lib/srs/leeches";
import { FSRS_CONFIG } from "@/lib/srs/config";
import { newCard } from "@/lib/srs/fsrs";
import { type Card } from "@/lib/db/schema";

function makeCard(lapses: number, overrides: Partial<Card> = {}): Card {
  const base = newCard("leech-test", 1, "b1-l1");
  return { ...base, lapses, ...overrides };
}

describe("leeches (T3.5)", () => {
  it("isLeech: false below the threshold", () => {
    expect(isLeech(makeCard(0))).toBe(false);
    expect(isLeech(makeCard(FSRS_CONFIG.leech_lapses_threshold - 1))).toBe(false);
  });

  it("isLeech: true at or above the threshold", () => {
    expect(isLeech(makeCard(FSRS_CONFIG.leech_lapses_threshold))).toBe(true);
    expect(isLeech(makeCard(FSRS_CONFIG.leech_lapses_threshold + 5))).toBe(true);
  });

  it("resetLeech: returns a New-state card with lapses and reps zeroed", () => {
    const original = makeCard(FSRS_CONFIG.leech_lapses_threshold + 3, {
      state: 2,
      reps: 12,
      lastRating: 1,
      lastReviewedAt: new Date("2026-01-01T00:00:00Z"),
    });
    const fixedNow = new Date("2026-06-16T12:00:00Z");
    const reset = resetLeech(original, fixedNow);

    expect(reset.state).toBe(0);
    expect(reset.lapses).toBe(0);
    expect(reset.reps).toBe(0);
    expect(reset.lastRating).toBeUndefined();
    expect(reset.lastReviewedAt).toEqual(fixedNow);
    // nextReviewAt is whatever createEmptyCard(now).due produced — at or
    // before `now` is fine; we just assert it's a real Date.
    expect(reset.nextReviewAt).toBeInstanceOf(Date);
  });

  it("resetLeech: preserves identity (id, blockId, lessonId, contentHash, introducedAt)", () => {
    const originalIntroduced = new Date("2025-09-01T00:00:00Z");
    const original = makeCard(20, {
      contentHash: "abc123",
      introducedAt: originalIntroduced,
    });
    const reset = resetLeech(original, new Date("2026-06-16T00:00:00Z"));

    expect(reset.id).toBe(original.id);
    expect(reset.blockId).toBe(original.blockId);
    expect(reset.lessonId).toBe(original.lessonId);
    expect(reset.contentHash).toBe(original.contentHash);
    // Critical: the original introducedAt is preserved so the card does NOT
    // re-enter the "new cards today" pool after the reset.
    expect(reset.introducedAt).toEqual(originalIntroduced);
  });
});
