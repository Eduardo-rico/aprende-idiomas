// tests/unit/stats-aggregations.test.ts
import { describe, it, expect } from "vitest";
import {
  aggregateByDay,
  accuracyByBlock,
  weakestConcepts,
  strongestConcepts,
  fsrsRetention,
  brVsPtSplit,
  retention7d,
  responseTimeAvg,
  masteredCount,
  productionVsRecognition,
  vocabProduces,
  masteryRows,
} from "@/lib/stats/aggregations";
import type { AppEvent, ConceptMastery } from "@/lib/db/schema";

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

// Richer builder for the new aggregations — accepts mode/rating/conceptIds.
function makeAnswerFull(
  opts: {
    ts?: Date;
    correct?: boolean;
    rating?: 1 | 2 | 3 | 4;
    mode?: string;
    conceptIds?: string[];
    responseMs?: number;
  } = {},
): AppEvent {
  const rating = (opts.rating ?? (opts.correct ? 3 : 1)) as 1 | 2 | 3 | 4;
  return {
    ts: opts.ts ?? new Date("2026-06-27T12:00:00Z"),
    type: "answer",
    cardId: "c1",
    rating,
    correct: opts.correct ?? rating >= 3,
    responseMs: opts.responseMs ?? 500,
    mode: opts.mode ?? "daily",
    conceptIds: opts.conceptIds ?? [],
    variant: "pt-br",
  };
}

const NOW = new Date("2026-06-27T12:00:00Z");

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

// ─── retention7d ──────────────────────────────────────────────────────────────

describe("retention7d", () => {
  it("returns 0 when no answer events", () => {
    expect(retention7d([], NOW)).toBe(0);
  });

  it("returns 0 when all events are outside the 7-day window", () => {
    const events = [
      makeAnswerFull({ ts: new Date("2026-06-01T12:00:00Z"), correct: true }),
    ];
    expect(retention7d(events, NOW)).toBe(0);
  });

  it("computes accuracy over the last 7 days inclusive", () => {
    const events = [
      makeAnswerFull({ ts: new Date("2026-06-26T12:00:00Z"), correct: true }),
      makeAnswerFull({ ts: new Date("2026-06-26T13:00:00Z"), correct: true }),
      makeAnswerFull({ ts: new Date("2026-06-25T12:00:00Z"), correct: false }),
      // Outside the window (>7 days ago).
      makeAnswerFull({ ts: new Date("2026-06-19T12:00:00Z"), correct: true }),
    ];
    expect(retention7d(events, NOW)).toBeCloseTo(2 / 3, 2);
  });

  it("ignores non-answer events", () => {
    const events: AppEvent[] = [
      { ts: new Date("2026-06-26T12:00:00Z"), type: "lesson_complete", payload: {} },
    ];
    expect(retention7d(events, NOW)).toBe(0);
  });
});

// ─── responseTimeAvg ─────────────────────────────────────────────────────────

describe("responseTimeAvg", () => {
  it("returns 0 when no answer events in window", () => {
    expect(responseTimeAvg([], NOW)).toBe(0);
  });

  it("returns the mean response time in seconds", () => {
    const events = [
      makeAnswerFull({ ts: new Date("2026-06-26T12:00:00Z"), responseMs: 4_000 }),
      makeAnswerFull({ ts: new Date("2026-06-26T13:00:00Z"), responseMs: 12_000 }),
    ];
    expect(responseTimeAvg(events, NOW)).toBeCloseTo(8, 2);
  });

  it("only counts events inside the 7-day window", () => {
    const events = [
      makeAnswerFull({ ts: new Date("2026-06-26T12:00:00Z"), responseMs: 10_000 }),
      makeAnswerFull({ ts: new Date("2026-06-01T12:00:00Z"), responseMs: 1_000_000 }),
    ];
    expect(responseTimeAvg(events, NOW)).toBeCloseTo(10, 2);
  });
});

// ─── masteredCount ───────────────────────────────────────────────────────────

describe("masteredCount", () => {
  it("returns 0/0 for empty input", () => {
    expect(masteredCount([])).toEqual({ mastered: 0, total: 0 });
  });

  it("excludes concepts with exposureCount === 0", () => {
    const m = [
      { conceptId: "a", blockId: 1, accuracy: 0.9, exposureCount: 10, correctCount: 9, masteryPct: 90, isMastered: true, updatedAt: NOW },
      { conceptId: "b", blockId: 1, accuracy: 0, exposureCount: 0, correctCount: 0, masteryPct: 0, isMastered: false, updatedAt: NOW },
    ] as ConceptMastery[];
    expect(masteredCount(m)).toEqual({ mastered: 1, total: 1 });
  });

  it("counts isMastered true across exposed concepts", () => {
    const m = [
      { conceptId: "a", blockId: 1, accuracy: 0.9, exposureCount: 10, correctCount: 9, masteryPct: 90, isMastered: true, updatedAt: NOW },
      { conceptId: "b", blockId: 1, accuracy: 0.8, exposureCount: 5, correctCount: 4, masteryPct: 80, isMastered: true, updatedAt: NOW },
      { conceptId: "c", blockId: 1, accuracy: 0.4, exposureCount: 8, correctCount: 3, masteryPct: 40, isMastered: false, updatedAt: NOW },
    ] as ConceptMastery[];
    expect(masteredCount(m)).toEqual({ mastered: 2, total: 3 });
  });
});

// ─── productionVsRecognition ─────────────────────────────────────────────────

describe("productionVsRecognition", () => {
  it("returns 0/0 when no answer events", () => {
    expect(productionVsRecognition([])).toEqual({ recognition: 0, production: 0 });
  });

  it("computes accuracy per bucket independently", () => {
    const events = [
      makeAnswerFull({ mode: "lesson", correct: true }),
      makeAnswerFull({ mode: "lesson", correct: true }),
      makeAnswerFull({ mode: "daily", correct: true }),
      makeAnswerFull({ mode: "drill", correct: true }),
      makeAnswerFull({ mode: "drill", correct: false }),
      makeAnswerFull({ mode: "review_errors", correct: false }),
    ];
    expect(productionVsRecognition(events)).toEqual({
      recognition: 1,
      production: 1 / 3,
    });
  });

  it("excludes story mode from both buckets", () => {
    const events = [
      makeAnswerFull({ mode: "story", correct: true }),
      makeAnswerFull({ mode: "lesson", correct: false }),
    ];
    expect(productionVsRecognition(events)).toEqual({ recognition: 0, production: 0 });
  });
});

// ─── vocabProduces ───────────────────────────────────────────────────────────

describe("vocabProduces", () => {
  it("returns 0 when no production-mode events", () => {
    expect(vocabProduces([makeAnswerFull({ mode: "lesson", conceptIds: ["c1"] })], NOW)).toBe(0);
  });

  it("counts unique conceptIds across drill and review_errors with rating >= 3", () => {
    const events = [
      makeAnswerFull({ mode: "drill", rating: 3, conceptIds: ["c1", "c2"] }),
      makeAnswerFull({ mode: "drill", rating: 4, conceptIds: ["c2", "c3"] }),
      makeAnswerFull({ mode: "drill", rating: 1, conceptIds: ["c4"] }), // dropped (rating < 3)
      makeAnswerFull({ mode: "review_errors", rating: 3, conceptIds: ["c5"] }),
    ];
    expect(vocabProduces(events, NOW)).toBe(4); // c1, c2, c3, c5
  });

  it("only counts events inside the 30-day window", () => {
    const events = [
      makeAnswerFull({ ts: new Date("2026-06-26T12:00:00Z"), mode: "drill", rating: 3, conceptIds: ["c1"] }),
      makeAnswerFull({ ts: new Date("2026-05-01T12:00:00Z"), mode: "drill", rating: 3, conceptIds: ["c9"] }),
    ];
    expect(vocabProduces(events, NOW)).toBe(1);
  });
});

// ─── masteryRows + decay detection ───────────────────────────────────────────

describe("masteryRows", () => {
  const exp = (
    id: string,
    masteryPct: number,
    exposureCount: number,
    isMastered = false,
    lastReviewed?: Date,
  ): ConceptMastery => ({
    conceptId: id,
    blockId: 1,
    accuracy: masteryPct / 100,
    exposureCount,
    correctCount: Math.round((masteryPct / 100) * exposureCount),
    masteryPct,
    isMastered,
    lastReviewed,
    updatedAt: NOW,
  });

  it("sorts by masteryPct descending and drops unexposed concepts", () => {
    const rows = masteryRows({
      mastery: [exp("a", 90, 10, true), exp("z", 0, 0), exp("b", 50, 5)],
      events: [],
      now: NOW,
    });
    expect(rows.map((r) => r.conceptId)).toEqual(["a", "b"]);
  });

  it("flags a concept as decaying when last-week acc drops >= 0.08 vs previous week", () => {
    // NOW = 2026-06-27T12:00:00Z → last7 cutoff = 2026-06-20T12:00:00Z,
    // prev7 cutoff = 2026-06-13T12:00:00Z. Last-week events must be in
    // [2026-06-20, 2026-06-27]; prev-week events must be in
    // [2026-06-13, 2026-06-20) — anything earlier than 2026-06-13 falls
    // outside both windows and isn't counted.
    const events: AppEvent[] = [];
    for (let i = 0; i < 5; i++) {
      events.push(
        makeAnswerFull({
          ts: new Date("2026-06-26T10:00:00Z"),
          conceptIds: ["a"],
          correct: false,
        }),
      );
    }
    for (let i = 0; i < 5; i++) {
      events.push(
        makeAnswerFull({
          ts: new Date("2026-06-18T10:00:00Z"),
          conceptIds: ["a"],
          correct: true,
        }),
      );
    }
    const rows = masteryRows({
      mastery: [exp("a", 60, 20, false)],
      events,
      now: NOW,
    });
    expect(rows[0]?.decay).toBe("decaying");
  });

  it("flags low mastery + stale lastReviewed as review-soon", () => {
    const stale = new Date("2026-06-01T12:00:00Z");
    const rows = masteryRows({
      mastery: [exp("a", 30, 5, false, stale)],
      events: [],
      now: NOW,
    });
    expect(rows[0]?.decay).toBe("review-soon");
  });

  it("returns null decay for healthy concepts", () => {
    const rows = masteryRows({
      mastery: [exp("a", 90, 10, true, NOW)],
      events: [],
      now: NOW,
    });
    expect(rows[0]?.decay).toBeNull();
  });

  it("uses resolveName callback when provided", () => {
    const rows = masteryRows({
      mastery: [exp("a", 80, 10, true)],
      events: [],
      now: NOW,
      resolveName: (id) => `Pretty ${id}`,
    });
    expect(rows[0]?.name).toBe("Pretty a");
  });
});
