// tests/unit/stats-aggregations.test.ts
import { describe, it, expect } from "vitest";
import {
  aggregateByDay,
  accuracyByBlock,
  weakestConcepts,
  strongestConcepts,
  fsrsRetention,
  brVsPtSplit,
} from "@/lib/stats/aggregations";
import type { AppEvent } from "@/lib/db/schema";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeAnswer(
  ts: Date,
  correct: boolean,
  cardId = "c1",
  variant: "br" | "pt" = "br",
): AppEvent {
  return {
    ts,
    type: "answer",
    cardId,
    rating: correct ? 3 : 1,
    correct,
    responseMs: 500,
    mode: "daily",
    conceptIds: [],
    variant,
  };
}

// ─── aggregateByDay ───────────────────────────────────────────────────────────

describe("aggregateByDay", () => {
  it("returns empty for no events", () => {
    expect(aggregateByDay([])).toEqual([]);
  });

  it("groups events by UTC day, sorted ascending", () => {
    const events: AppEvent[] = [
      makeAnswer(new Date("2026-06-09T10:00:00Z"), true),
      makeAnswer(new Date("2026-06-09T15:00:00Z"), false),
      makeAnswer(new Date("2026-06-08T10:00:00Z"), true),
    ];
    const byDay = aggregateByDay(events);
    expect(byDay).toHaveLength(2);
    expect(byDay[0]?.date).toBe("2026-06-08");
    expect(byDay[0]?.count).toBe(1);
    expect(byDay[0]?.correct).toBe(1);
    expect(byDay[1]?.date).toBe("2026-06-09");
    expect(byDay[1]?.count).toBe(2);
    expect(byDay[1]?.correct).toBe(1); // only 1 correct on the 9th
  });

  it("counts non-answer events in total but not in correct", () => {
    const events: AppEvent[] = [
      makeAnswer(new Date("2026-06-10T08:00:00Z"), true),
      {
        ts: new Date("2026-06-10T09:00:00Z"),
        type: "lesson_complete",
        payload: { blockId: 1 },
      },
    ];
    const byDay = aggregateByDay(events);
    expect(byDay).toHaveLength(1);
    expect(byDay[0]?.count).toBe(2);
    expect(byDay[0]?.correct).toBe(1);
  });
});

// ─── accuracyByBlock ──────────────────────────────────────────────────────────
// AnswerEvent has NO blockId — callers must supply a cardId→blockId resolver map.

describe("accuracyByBlock", () => {
  it("returns empty record for no events", () => {
    expect(accuracyByBlock([], new Map())).toEqual({});
  });

  it("computes accuracy per block using the resolver map", () => {
    const cardBlockIndex = new Map<string, number>([
      ["card-a", 1],
      ["card-b", 1],
      ["card-c", 1],
      ["card-d", 2],
    ]);
    const events: AppEvent[] = [
      makeAnswer(new Date(), true, "card-a"),
      makeAnswer(new Date(), true, "card-b"),
      makeAnswer(new Date(), false, "card-c"),
      makeAnswer(new Date(), true, "card-d"),
    ];
    const acc = accuracyByBlock(events, cardBlockIndex);
    expect(acc[1]).toBeCloseTo(2 / 3, 2);
    expect(acc[2]).toBe(1);
  });

  it("skips answer events whose cardId is absent from the resolver map", () => {
    const cardBlockIndex = new Map<string, number>([["card-known", 1]]);
    const events: AppEvent[] = [
      makeAnswer(new Date(), true, "card-known"),
      makeAnswer(new Date(), false, "card-unknown"),
    ];
    const acc = accuracyByBlock(events, cardBlockIndex);
    expect(acc[1]).toBe(1);
    expect(Object.keys(acc)).toHaveLength(1);
  });

  it("ignores non-answer events entirely", () => {
    const cardBlockIndex = new Map<string, number>([["card-a", 1]]);
    const events: AppEvent[] = [
      makeAnswer(new Date(), true, "card-a"),
      {
        ts: new Date(),
        type: "lesson_complete",
        payload: { blockId: 1 },
      },
    ];
    const acc = accuracyByBlock(events, cardBlockIndex);
    expect(acc[1]).toBe(1);
    expect(Object.keys(acc)).toHaveLength(1);
  });
});

// ─── weakestConcepts / strongestConcepts ─────────────────────────────────────

describe("weakestConcepts", () => {
  it("returns empty for empty input", () => {
    expect(weakestConcepts([], 3)).toEqual([]);
  });

  it("returns N lowest-mastery concepts sorted ascending", () => {
    const mastery = [
      { conceptId: "a", masteryPct: 90, blockId: 1, accuracy: 0.9, exposureCount: 10, correctCount: 9, masteryPct2: 90, isMastered: true, updatedAt: new Date() },
      { conceptId: "b", masteryPct: 30, blockId: 1, accuracy: 0.3, exposureCount: 10, correctCount: 3, isMastered: false, updatedAt: new Date() },
      { conceptId: "c", masteryPct: 50, blockId: 1, accuracy: 0.5, exposureCount: 10, correctCount: 5, isMastered: false, updatedAt: new Date() },
      { conceptId: "d", masteryPct: 10, blockId: 1, accuracy: 0.1, exposureCount: 10, correctCount: 1, isMastered: false, updatedAt: new Date() },
    ];
    const weak = weakestConcepts(mastery, 2);
    expect(weak.map((c) => c.conceptId)).toEqual(["d", "b"]);
  });

  it("returns all items when n > length", () => {
    const mastery = [
      { conceptId: "x", masteryPct: 50, blockId: 1, accuracy: 0.5, exposureCount: 5, correctCount: 2, isMastered: false, updatedAt: new Date() },
    ];
    expect(weakestConcepts(mastery, 10)).toHaveLength(1);
  });
});

describe("strongestConcepts", () => {
  it("returns N highest-mastery concepts sorted descending", () => {
    const mastery = [
      { conceptId: "a", masteryPct: 90, blockId: 1, accuracy: 0.9, exposureCount: 10, correctCount: 9, isMastered: true, updatedAt: new Date() },
      { conceptId: "b", masteryPct: 30, blockId: 1, accuracy: 0.3, exposureCount: 10, correctCount: 3, isMastered: false, updatedAt: new Date() },
      { conceptId: "c", masteryPct: 70, blockId: 1, accuracy: 0.7, exposureCount: 10, correctCount: 7, isMastered: false, updatedAt: new Date() },
    ];
    const strong = strongestConcepts(mastery, 2);
    expect(strong.map((c) => c.conceptId)).toEqual(["a", "c"]);
  });
});

// ─── fsrsRetention ────────────────────────────────────────────────────────────

describe("fsrsRetention", () => {
  it("returns 0 for empty card list", () => {
    expect(fsrsRetention([])).toBe(0);
  });

  it("counts Review state (2) cards as retained", () => {
    const cards = [
      { state: 2 as number }, // Review
      { state: 1 as number }, // Learning
      { state: 2 as number }, // Review
    ];
    expect(fsrsRetention(cards)).toBeCloseTo(2 / 3, 2);
  });

  it("returns 0 when no Review-state cards", () => {
    const cards = [{ state: 0 as number }, { state: 1 as number }];
    expect(fsrsRetention(cards)).toBe(0);
  });

  it("returns 1 when all cards are in Review state", () => {
    const cards = [{ state: 2 as number }, { state: 2 as number }];
    expect(fsrsRetention(cards)).toBe(1);
  });
});

// ─── brVsPtSplit ─────────────────────────────────────────────────────────────

describe("brVsPtSplit", () => {
  it("returns zeros when no answer events exist", () => {
    expect(brVsPtSplit([])).toEqual({ br: 0, pt: 0 });
  });

  it("returns zeros when events are all non-answer", () => {
    const events: AppEvent[] = [
      { ts: new Date(), type: "lesson_complete", payload: {} },
    ];
    expect(brVsPtSplit(events)).toEqual({ br: 0, pt: 0 });
  });

  it("computes fraction of BR vs PT answer events", () => {
    const events: AppEvent[] = [
      makeAnswer(new Date(), true, "c1", "br"),
      makeAnswer(new Date(), true, "c2", "br"),
      makeAnswer(new Date(), false, "c3", "pt"),
    ];
    const split = brVsPtSplit(events);
    expect(split.br).toBeCloseTo(2 / 3, 2);
    expect(split.pt).toBeCloseTo(1 / 3, 2);
  });

  it("handles all-BR correctly", () => {
    const events: AppEvent[] = [
      makeAnswer(new Date(), true, "c1", "br"),
      makeAnswer(new Date(), false, "c2", "br"),
    ];
    const split = brVsPtSplit(events);
    expect(split.br).toBe(1);
    expect(split.pt).toBe(0);
  });
});
