// tests/unit/fsrs-state.test.ts
import { describe, it, expect } from "vitest";
import { newCard, schedule, previewIntervalMs } from "@/lib/srs/fsrs";
import { RATING } from "@/lib/db/schema";
import { FSRS_CONFIG } from "@/lib/srs/config";

/** Walk a card through Good ratings until it graduates to Review (state 2).
 *  With the configured `learning_steps: ["1m", "10m"]`, two Good answers
 *  are required. */
function graduateToReview(now = new Date("2026-01-01T00:00:00Z")) {
  let card = newCard("grad-test", 1, "b1-l1");
  card = schedule(card, RATING.Good, now);
  expect(card.state).toBe(1); // Learning
  card = schedule(card, RATING.Good, new Date(now.getTime() + 2 * 60_000));
  expect(card.state).toBe(2); // Review
  return card;
}

describe("FSRS state machine (T3.3)", () => {
  it("New + Good → Learning (state 1)", () => {
    const c = schedule(newCard("st-new-good", 1, "b1-l1"), RATING.Good);
    expect(c.state).toBe(1);
    expect(c.reps).toBe(1);
  });

  it("Learning + 2 Goods → Review (state 2) with a non-zero graduating interval", () => {
    const t0 = new Date("2026-01-01T00:00:00Z");
    const t1 = new Date("2026-01-01T00:02:00Z");
    let card = newCard("grad-2", 1, "b1-l1");
    card = schedule(card, RATING.Good, t0);
    const review = schedule(card, RATING.Good, t1);
    expect(review.state).toBe(2);
    // Interval is measured from the last grade's `now`, not from test start.
    const intervalMs = review.nextReviewAt.getTime() - t1.getTime();
    expect(intervalMs).toBeGreaterThan(0);
  });

  it("Review + Again → Relearning (state 3), lapses increments by 1", () => {
    const review = graduateToReview();
    const failed = schedule(review, RATING.Again);
    expect(failed.state).toBe(3);
    expect(failed.lapses).toBe(1);
  });

  it("Relearning + Good → Review (state 2) after relearning step passes", () => {
    const review = graduateToReview();
    const relearning = schedule(review, RATING.Again);
    expect(relearning.state).toBe(3);
    // Relearning step is 10m — wait 11m before grading Good.
    const recovered = schedule(relearning, RATING.Good, new Date(Date.now() + 11 * 60_000));
    expect(recovered.state).toBe(2);
  });

  it("Learning + Again keeps the card in Learning and does NOT count a lapse", () => {
    let card = newCard("st-learning-again", 1, "b1-l1");
    card = schedule(card, RATING.Good);
    expect(card.state).toBe(1);
    const again = schedule(card, RATING.Again);
    expect(again.state).toBe(1); // still Learning
    expect(again.lapses).toBe(0); // FSRS-5: no lapse in Learning
  });

  it("fuzz never produces an interval longer than the configured maximum", () => {
    // Simulate 5 successful reviews (each Good) — stability grows exponentially.
    let card = graduateToReview();
    const t0 = new Date("2026-01-01T00:00:00Z");
    let lastNow = t0;
    for (let i = 0; i < 5; i++) {
      // Push the clock 30 days into the future each step so the scheduler
      // produces a large next interval (capped at 365 days).
      lastNow = new Date(t0.getTime() + (i + 1) * 30 * 24 * 60 * 60 * 1000);
      card = schedule(card, RATING.Good, lastNow);
    }
    // The next interval is the delta from the last grade's `now`, not from
    // test start (which is 150 days earlier).
    const intervalDays = (card.nextReviewAt.getTime() - lastNow.getTime()) / (24 * 60 * 60 * 1000);
    expect(intervalDays).toBeLessThanOrEqual(FSRS_CONFIG.maximum_interval);
  });

  it("previewIntervalMs matches schedule(card, rating).nextReviewAt - now", () => {
    // preview is the runner's "Próxima: en 3 días" helper; it must agree with
    // the actual schedule() result, otherwise the user sees a different
    // interval than the algorithm picked.
    const c = newCard("st-preview", 1, "b1-l1");
    const now = new Date("2026-03-01T00:00:00Z");
    const preview = previewIntervalMs(c, RATING.Good, now);
    const actual = schedule(c, RATING.Good, now);
    const realDelta = actual.nextReviewAt.getTime() - now.getTime();
    expect(preview).toBe(realDelta);
  });
});
