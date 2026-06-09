// tests/unit/mastery.test.ts
import { describe, it, expect } from "vitest";
import { weightedAccuracy, masteryPct } from "@/lib/mastery/concept";

describe("weightedAccuracy", () => {
  it("empty events returns 0", () => {
    expect(weightedAccuracy([])).toBe(0);
  });

  it("all correct recent (0-7d) returns 1", () => {
    const now = new Date("2026-06-08");
    const events = Array.from({ length: 5 }, () => ({ ts: new Date("2026-06-05"), correct: true }));
    expect(weightedAccuracy(events, now)).toBe(1);
  });

  it("weights recency: 1 recent wrong > 1 old correct", () => {
    const now = new Date("2026-06-08");
    const old = [{ ts: new Date("2026-05-01"), correct: true }];
    const recent = [{ ts: new Date("2026-06-08"), correct: false }];
    expect(weightedAccuracy(old, now)).toBeGreaterThan(weightedAccuracy(recent, now));
  });
});

describe("masteryPct", () => {
  it("0 exposures → 0%", () => {
    expect(masteryPct(1.0, 0)).toBe(0);
  });

  it("3 exposures at 100% accuracy → ~60%", () => {
    expect(masteryPct(1.0, 3)).toBe(60);
  });

  it("10+ exposures at 100% → 95-100%", () => {
    expect(masteryPct(1.0, 10)).toBeGreaterThanOrEqual(95);
  });
});
