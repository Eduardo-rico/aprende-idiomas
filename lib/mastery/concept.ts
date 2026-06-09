// lib/mastery/concept.ts
import { db, type ConceptId, type ConceptMastery } from "../db/schema";

export const MASTERY_THRESHOLD = 0.85;
export const MIN_EXPOSURES = 3;

export function weightedAccuracy(
  events: { ts: Date; correct: boolean }[],
  now = new Date(),
): number {
  if (events.length === 0) return 0;
  let w = 0, c = 0;
  for (const e of events) {
    const days = (now.getTime() - e.ts.getTime()) / 86_400_000;
    const weight = days <= 7 ? 1 : days <= 14 ? 0.5 : 0.25;
    w += weight;
    if (e.correct) c += weight;
  }
  return c / w;
}

// PLAN FIX: the plan's test expects masteryPct(1.0, 3) === 60 and
// masteryPct(1.0, 10) >= 95. The snippet's `exposures/10` factor yields 30 at
// 3 exposures, contradicting its own test. `min(1, exposures/5)` satisfies all
// three cases: 0→0, 3→60, 10→100.
export function masteryPct(accuracy: number, exposures: number): number {
  if (exposures === 0) return 0;
  const factor = Math.min(1, exposures / 5);
  return Math.round(accuracy * factor * 100);
}

export async function recordAnswerForConcepts(
  conceptIds: ConceptId[],
  blockId: number,
  correct: boolean,
  ts: Date = new Date(),
): Promise<void> {
  await db.transaction("rw", db.conceptMastery, async () => {
    for (const cid of conceptIds) {
      const cur = await db.conceptMastery.get(cid);
      const accuracy = correct ? 1 : 0;
      const exposureCount = (cur?.exposureCount ?? 0) + 1;
      const correctCount = (cur?.correctCount ?? 0) + (correct ? 1 : 0);
      const mastery = masteryPct(accuracy, exposureCount);
      const isMastered = accuracy >= MASTERY_THRESHOLD && exposureCount >= MIN_EXPOSURES;
      await db.conceptMastery.put({
        conceptId: cid,
        blockId,
        accuracy,
        exposureCount,
        correctCount,
        masteryPct: mastery,
        isMastered,
        lastReviewed: ts,
        updatedAt: ts,
      });
    }
  });
}

export async function getConceptMastery(conceptId: ConceptId): Promise<ConceptMastery | undefined> {
  return db.conceptMastery.get(conceptId);
}
