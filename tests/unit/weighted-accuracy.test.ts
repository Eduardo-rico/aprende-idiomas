import { describe, it, expect } from "vitest";
import { weightedAccuracy, masteryPct } from "@/lib/mastery/concept";

describe("weightedAccuracy (time-decay)", () => {
  const now = new Date("2024-01-15T12:00:00Z");

  it("empty events → 0", () => {
    expect(weightedAccuracy([], now)).toBe(0);
  });

  it("recent correct event → high accuracy", () => {
    const events = [{ ts: new Date("2024-01-15T10:00:00Z"), correct: true }];
    expect(weightedAccuracy(events, now)).toBe(1);
  });

  it("recent incorrect event → 0", () => {
    const events = [{ ts: new Date("2024-01-15T10:00:00Z"), correct: false }];
    expect(weightedAccuracy(events, now)).toBe(0);
  });

  it("mix of correct and incorrect → between 0 and 1", () => {
    const events = [
      { ts: new Date("2024-01-15T10:00:00Z"), correct: true },
      { ts: new Date("2024-01-15T11:00:00Z"), correct: false },
    ];
    const acc = weightedAccuracy(events, now);
    expect(acc).toBeGreaterThan(0);
    expect(acc).toBeLessThan(1);
  });

  it("old events (>14 days) have lower weight than recent ones", () => {
    // Both correct, but old gets 0.25 weight so same-correct ratio is 1.0 for both.
    // The key: mixing old incorrect with recent correct should differ from same-age mix.
    const mixed = [
      { ts: new Date("2024-01-15T10:00:00Z"), correct: true },
      { ts: new Date("2023-12-25T10:00:00Z"), correct: false },
    ];
    const mixedAcc = weightedAccuracy(mixed, now);
    expect(mixedAcc).toBeGreaterThan(0.5); // recent correct outweighs old incorrect
  });
});

describe("masteryPct", () => {
  it("0 exposures → 0", () => expect(masteryPct(1.0, 0)).toBe(0));
  it("3 exposures 100% → ~60%", () => expect(masteryPct(1.0, 3)).toBeGreaterThanOrEqual(55));
  it("10 exposures 100% → ~100%", () => expect(masteryPct(1.0, 10)).toBeGreaterThanOrEqual(95));
  it("50% accuracy → half of exposures-based", () => {
    expect(masteryPct(0.5, 10)).toBeCloseTo(50, 0);
  });
});
