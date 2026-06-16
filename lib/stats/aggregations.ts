// lib/stats/aggregations.ts
//
// Pure aggregation functions — no DB imports. Callers (e.g. the /stats page)
// must fetch data from the DB and pass it in.
//
// DECISION — accuracyByBlock:
//   AnswerEvent (schema.ts) has NO blockId field. The blockId passed to
//   submitAnswer() is stored on the Card, not on the event. Therefore,
//   accuracyByBlock() cannot derive block membership from events alone.
//   It accepts a `cardBlockIndex: Map<string, number>` resolver built by the
//   caller from db.cards (cardId → blockId). Events whose cardId is absent
//   from the map are silently skipped.

import type { AppEvent, AnswerEvent, ConceptMastery } from "@/lib/db/schema";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DayAgg {
  date: string;   // "YYYY-MM-DD" UTC
  count: number;  // all events on that day
  correct: number; // answer events with correct === true
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isAnswer(e: AppEvent): e is AnswerEvent {
  return e.type === "answer";
}

// ─── aggregateByDay ───────────────────────────────────────────────────────────

/**
 * Bucket all events by UTC calendar day.
 * Returns an array sorted ascending by date string.
 */
export function aggregateByDay(events: AppEvent[]): DayAgg[] {
  const byDate = new Map<string, DayAgg>();
  for (const e of events) {
    const date = e.ts.toISOString().slice(0, 10);
    const existing = byDate.get(date);
    if (existing === undefined) {
      byDate.set(date, { date, count: 1, correct: isAnswer(e) && e.correct ? 1 : 0 });
    } else {
      existing.count++;
      if (isAnswer(e) && e.correct) existing.correct++;
    }
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// ─── accuracyByBlock ──────────────────────────────────────────────────────────

/**
 * Compute fraction of correct answers per block number.
 *
 * Because AnswerEvent stores only cardId (not blockId), the caller must supply
 * a cardBlockIndex map (cardId → blockId) built from db.cards. Answer events
 * whose cardId is absent from the map are silently ignored.
 */
export function accuracyByBlock(
  events: AppEvent[],
  cardBlockIndex: Map<string, number>,
): Record<number, number> {
  const byBlock = new Map<number, { correct: number; total: number }>();
  for (const e of events) {
    if (!isAnswer(e)) continue;
    const blockId = cardBlockIndex.get(e.cardId);
    if (blockId === undefined) continue;
    const existing = byBlock.get(blockId);
    if (existing === undefined) {
      byBlock.set(blockId, { correct: e.correct ? 1 : 0, total: 1 });
    } else {
      existing.total++;
      if (e.correct) existing.correct++;
    }
  }
  const out: Record<number, number> = {};
  for (const [blockId, { correct, total }] of byBlock) {
    out[blockId] = total > 0 ? correct / total : 0;
  }
  return out;
}

// ─── weakestConcepts / strongestConcepts ─────────────────────────────────────

/**
 * Return the N concepts with the lowest masteryPct, sorted ascending.
 * Uses the ConceptMastery type from the schema directly.
 */
export function weakestConcepts(mastery: ConceptMastery[], n: number): ConceptMastery[] {
  return [...mastery].sort((a, b) => a.masteryPct - b.masteryPct).slice(0, n);
}

/**
 * Return the N concepts with the highest masteryPct, sorted descending.
 */
export function strongestConcepts(mastery: ConceptMastery[], n: number): ConceptMastery[] {
  return [...mastery].sort((a, b) => b.masteryPct - a.masteryPct).slice(0, n);
}

// ─── fsrsRetention ────────────────────────────────────────────────────────────

/**
 * Fraction of cards currently in the FSRS Review state (state === 2).
 * ts-fsrs State enum: New=0, Learning=1, Review=2, Relearning=3.
 * Returns 0 for an empty card list.
 */
export function fsrsRetention(cards: Array<{ state: number }>): number {
  if (cards.length === 0) return 0;
  const REVIEW_STATE = 2;
  const retained = cards.filter((c) => c.state === REVIEW_STATE).length;
  return retained / cards.length;
}

// ─── brVsPtSplit ─────────────────────────────────────────────────────────────

/**
 * Fraction of BR vs PT among answer events (ignores non-answer events).
 * Returns { br: 0, pt: 0 } when there are no answer events.
 */
export function brVsPtSplit(events: AppEvent[]): { br: number; pt: number } {
  let br = 0;
  let pt = 0;
  for (const e of events) {
    if (!isAnswer(e)) continue;
    if (e.variant === "br") br++;
    else if (e.variant === "pt") pt++;
  }
  const total = br + pt;
  if (total === 0) return { br: 0, pt: 0 };
  return { br: br / total, pt: pt / total };
}
