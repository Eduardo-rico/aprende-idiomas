// tests/unit/fsrs.test.ts
import { describe, it, expect } from "vitest";
import { newCard, schedule, isNewCard } from "@/lib/srs/fsrs";
import { RATING } from "@/lib/db/schema";

describe("FSRS wrapper", () => {
  it("creates a new card with state 0", () => {
    const c = newCard("abc12345", 1, "b1-l1");
    expect(c.state).toBe(0);
    expect(isNewCard(c)).toBe(true);
  });

  it("Good on a new card moves to state 1 and pushes due out", () => {
    const c0 = newCard("abc12345", 1, "b1-l1");
    const c1 = schedule(c0, RATING.Good);
    expect(c1.state).toBe(1);
    expect(c1.nextReviewAt.getTime()).toBeGreaterThan(c0.nextReviewAt.getTime());
    expect(c1.reps).toBe(1);
  });

  it("Again from Learning keeps lapses at 0; Again from Review increments lapses (FSRS-5 semantics)", () => {
    // PLAN FIX: ts-fsrs 5.4 only counts a lapse when a Review-state card fails.
    // Again from the Learning state does NOT add a lapse (it just reschedules).
    const c0 = newCard("abc12345", 1, "b1-l1");
    const c1 = schedule(c0, RATING.Good); // Learning (state 1)
    const c2 = schedule(c1, RATING.Again); // still Learning, no lapse
    expect(c2.lapses).toBe(0);

    // Drive a card into Review state, then fail it → lapse increments.
    let r = newCard("def67890", 1, "b1-l1");
    r = schedule(r, RATING.Good); // Learning
    r = schedule(r, RATING.Good); // Review (state 2)
    expect(r.state).toBe(2);
    const failed = schedule(r, RATING.Again);
    expect(failed.lapses).toBe(1);
  });

  it("schedule is deterministic: same (card, rating, now) → same nextReviewAt for any card", () => {
    // CRITICAL FIX: original test was a tautology (schedule(c0, ..., fixed) === schedule(c0, ..., fixed)).
    // Real invariant: any two cards with same (now, rating) get same delta.
    const fixed = new Date("2026-06-08T12:00:00Z");
    const a0 = newCard("a1b2c3d4", 1, "b1-l1");
    const b0 = newCard("x9y8z7w6", 2, "b1-l2");
    const a1 = schedule(a0, RATING.Good, fixed);
    const b1 = schedule(b0, RATING.Good, fixed);
    const aDelta = a1.nextReviewAt.getTime() - a0.nextReviewAt.getTime();
    const bDelta = b1.nextReviewAt.getTime() - b0.nextReviewAt.getTime();
    expect(aDelta).toBe(bDelta);
  });
});
