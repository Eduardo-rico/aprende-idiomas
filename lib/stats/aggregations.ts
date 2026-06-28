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

import type { AppEvent, AnswerEvent, ConceptId, ConceptMastery } from "@/lib/db/schema";

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

// ─── Mode classification (production vs recognition) ──────────────────────────
//
// The Progreso page reports a balance between two skill families. We can't
// rely on AnswerEvent.exerciseType (the field doesn't exist), so we infer the
// bucket from session.mode — a proxy that works for the data the app emits
// today without a schema migration.
//
//   Production (free recall): drill, review_errors
//   Recognition (cued):       lesson, review, daily
//   Neutral / excluded:       story
//
// Story sessions don't grade knowledge — they exercise listening. Including
// them in either bucket would skew the balance and add noise to vocabProduces.

export const PRODUCTION_MODES: ReadonlySet<string> = new Set([
  "drill",
  "review_errors",
]);

export const RECOGNITION_MODES: ReadonlySet<string> = new Set([
  "lesson",
  "review",
  "daily",
]);

export function isProductionMode(mode: string): boolean {
  return PRODUCTION_MODES.has(mode);
}

export function isRecognitionMode(mode: string): boolean {
  return RECOGNITION_MODES.has(mode);
}

// ─── Window helper ───────────────────────────────────────────────────────────

/**
 * Inclusive lower bound (UTC midnight, ms-precision) for "the last N days".
 * now is parameterised so the helpers stay testable with fixed clocks.
 */
export function cutoffDaysAgo(now: Date, days: number): Date {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

// ─── retention7d ─────────────────────────────────────────────────────────────

/**
 * Accuracy (correct / total) of answer events in the last 7 days,
 * inclusive of `now`. Returns 0 when no answer events land in the window.
 */
export function retention7d(events: AppEvent[], now: Date = new Date()): number {
  const cutoff = cutoffDaysAgo(now, 7);
  let correct = 0;
  let total = 0;
  for (const e of events) {
    if (!isAnswer(e)) continue;
    if (e.ts < cutoff) continue;
    total++;
    if (e.correct) correct++;
  }
  return total > 0 ? correct / total : 0;
}

// ─── responseTimeAvg ──────────────────────────────────────────────────────────

/**
 * Mean responseMs (in seconds) of answer events in the last 7 days.
 * Returns 0 when no answer events land in the window.
 */
export function responseTimeAvg(events: AppEvent[], now: Date = new Date()): number {
  const cutoff = cutoffDaysAgo(now, 7);
  let sum = 0;
  let total = 0;
  for (const e of events) {
    if (!isAnswer(e)) continue;
    if (e.ts < cutoff) continue;
    sum += e.responseMs;
    total++;
  }
  if (total === 0) return 0;
  return sum / total / 1000; // ms → seconds
}

// ─── masteredCount ────────────────────────────────────────────────────────────

/**
 * { mastered, total } counts over a ConceptMastery[] slice.
 *
 * Concepts with exposureCount === 0 are unexposed placeholders the user has
 * never seen. They're dropped from `total` so the "X/Y" tile doesn't claim
 * 34/200 when really the user has only been quizzed on 50.
 */
export function masteredCount(mastery: ConceptMastery[]): { mastered: number; total: number } {
  const exposed = mastery.filter((m) => m.exposureCount > 0);
  const mastered = exposed.filter((m) => m.isMastered).length;
  return { mastered, total: exposed.length };
}

// ─── productionVsRecognition ──────────────────────────────────────────────────

export interface Balance {
  recognition: number; // 0..1
  production: number;  // 0..1
}

/**
 * Returns fraction of correct events per mode bucket. Each bucket is
 * independent — they sum to >1 when a user over-performs in both. The
 * caller decides whether to multiply by 100 for display.
 *
 * Events whose mode is neither production nor recognition (e.g. story) are
 * silently ignored.
 */
export function productionVsRecognition(events: AppEvent[]): Balance {
  let recCorrect = 0;
  let recTotal = 0;
  let prodCorrect = 0;
  let prodTotal = 0;
  for (const e of events) {
    if (!isAnswer(e)) continue;
    if (isRecognitionMode(e.mode)) {
      recTotal++;
      if (e.correct) recCorrect++;
    } else if (isProductionMode(e.mode)) {
      prodTotal++;
      if (e.correct) prodCorrect++;
    }
  }
  return {
    recognition: recTotal > 0 ? recCorrect / recTotal : 0,
    production: prodTotal > 0 ? prodCorrect / prodTotal : 0,
  };
}

// ─── vocabProduces ────────────────────────────────────────────────────────────

/**
 * Unique conceptIds from production-mode events in the last 30 days where
 * rating >= 3 (Good or Easy). The "actively produces" signal: the user can
 * recall this concept in free-recall drills, not just recognise it.
 */
export function vocabProduces(events: AppEvent[], now: Date = new Date()): number {
  const cutoff = cutoffDaysAgo(now, 30);
  const set = new Set<ConceptId>();
  for (const e of events) {
    if (!isAnswer(e)) continue;
    if (e.ts < cutoff) continue;
    if (!isProductionMode(e.mode)) continue;
    if (e.rating < 3) continue;
    for (const cid of e.conceptIds) set.add(cid);
  }
  return set.size;
}

// ─── masteryRows + decay detection ────────────────────────────────────────────

export type DecayFlag = "decaying" | "review-soon" | null;

export interface MasteryRow {
  conceptId: ConceptId;
  name: string;
  masteryPct: number;
  decay: DecayFlag;
}

interface MasteryRowInput {
  mastery: ConceptMastery[];
  events: AppEvent[];
  now?: Date;
  /** Resolves conceptId → human-readable name. Optional; falls back to the
   *  raw conceptId if not provided (matches the mockup small text). */
  resolveName?: (conceptId: ConceptId) => string | undefined;
}

/**
 * Produces a mastery list ready for the Progreso page. Sorts descending by
 * masteryPct, drops unexposed concepts, and attaches a decay flag to rows
 * that need attention.
 *
 * Decay rules (applied in order):
 *   1. `decaying` — at least 4 exposures in BOTH the last 7 days and the
 *      previous 7 days, AND accuracy dropped ≥ 8 percentage points
 *      (prev - last ≥ 0.08).
 *   2. `review-soon` — masteryPct < 50 AND lastReviewed is missing or older
 *      than 7 days.
 *   3. `null` — healthy concept, no flag.
 */
export function masteryRows({
  mastery,
  events,
  now = new Date(),
  resolveName,
}: MasteryRowInput): MasteryRow[] {
  const exposed = mastery.filter((m) => m.exposureCount > 0);
  const sorted = [...exposed].sort((a, b) => b.masteryPct - a.masteryPct);

  const last7 = cutoffDaysAgo(now, 7);
  const prev7 = cutoffDaysAgo(now, 14);
  const byConcept = new Map<
    ConceptId,
    { lastC: number; lastT: number; prevC: number; prevT: number }
  >();
  for (const e of events) {
    if (!isAnswer(e)) continue;
    for (const cid of e.conceptIds) {
      const acc = byConcept.get(cid) ?? { lastC: 0, lastT: 0, prevC: 0, prevT: 0 };
      if (e.ts >= last7) {
        acc.lastT++;
        if (e.correct) acc.lastC++;
      } else if (e.ts >= prev7) {
        acc.prevT++;
        if (e.correct) acc.prevC++;
      }
      byConcept.set(cid, acc);
    }
  }

  const sevenDaysMs = 7 * 86_400_000;

  return sorted.map<MasteryRow>((m) => {
    let decay: DecayFlag = null;
    const acc = byConcept.get(m.conceptId);
    if (acc && acc.lastT >= 4 && acc.prevT >= 4) {
      const last = acc.lastC / acc.lastT;
      const prev = acc.prevC / acc.prevT;
      if (prev - last >= 0.08) decay = "decaying";
    }
    if (
      decay === null &&
      m.masteryPct < 50 &&
      (!m.lastReviewed || now.getTime() - m.lastReviewed.getTime() > sevenDaysMs)
    ) {
      decay = "review-soon";
    }
    const name = resolveName?.(m.conceptId) ?? m.conceptId;
    return { conceptId: m.conceptId, name, masteryPct: m.masteryPct, decay };
  });
}
