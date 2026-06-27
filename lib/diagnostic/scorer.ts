// lib/diagnostic/scorer.ts
// Computes a recommendation from diagnostic answers: which block to start
// reviewing, an overall score, per-block accuracy, and a list of weak
// concepts. Pure function — no side effects, no DB access.
import type { DiagnosticQuestion } from '@/lib/data/zod-schemas';

export interface Recommendation {
  /** Block to start at (1-indexed). When no block fails, this is the
   *  highest tested block (a strong learner is placed forward, not at 1).
   *  Falls back to 1 only when there are no answers. */
  recommendedStart: number;
  /** Overall accuracy as an integer percentage 0-100. */
  score: number;
  /** Per-block accuracy as a fraction 0-1. */
  blockScores: Record<number, number>;
  /** Concept IDs whose accuracy is below threshold. */
  weakConceptIds: string[];
}

const ACCURACY_THRESHOLD = 0.7;

interface BlockStats { correct: number; total: number; }
interface ConceptStats { correct: number; total: number; }

export function computeRecommendation(
  questions: DiagnosticQuestion[],
  answers: number[],
): Recommendation {
  if (answers.length === 0) {
    return { recommendedStart: 1, score: 0, blockScores: {}, weakConceptIds: [] };
  }

  const byBlock: Record<number, BlockStats> = {};
  const byConcept: Record<string, ConceptStats> = {};
  let totalCorrect = 0;

  for (let i = 0; i < answers.length; i++) {
    const q = questions[i];
    if (!q) continue; // Defensive: out-of-range answer
    const correct = answers[i] === q.correctIndex;
    if (correct) totalCorrect++;

    const bs = byBlock[q.blockId] ??= { correct: 0, total: 0 };
    bs.total++;
    if (correct) bs.correct++;

    const cs = byConcept[q.conceptId] ??= { correct: 0, total: 0 };
    cs.total++;
    if (correct) cs.correct++;
  }

  const blockScores: Record<number, number> = {};
  for (const [b, a] of Object.entries(byBlock)) {
    blockScores[Number(b)] = a.total > 0 ? a.correct / a.total : 0;
  }

  const weakConceptIds: string[] = [];
  for (const [c, a] of Object.entries(byConcept)) {
    if (a.total > 0 && a.correct / a.total < ACCURACY_THRESHOLD) {
      weakConceptIds.push(c);
    }
  }

  // Find the lowest block (numerically) whose accuracy is below the
  // threshold — that's where the learner needs to start reviewing.
  const sortedBlocks = Object.entries(blockScores).sort(([a], [b]) => Number(a) - Number(b));
  const failingBlock = sortedBlocks.find(([, acc]) => acc < ACCURACY_THRESHOLD);
  // When no block fails, the learner has shown mastery of everything the
  // diagnostic covers, so place them at the HIGHEST tested block instead of
  // sending them back to block 1. (We stop at the highest tested block
  // rather than +1 because the next block may be the freeDrill block or
  // beyond the curriculum.)
  const testedBlocks = Object.keys(blockScores).map(Number);
  const recommendedStart = failingBlock
    ? Number(failingBlock[0])
    : (testedBlocks.length ? Math.max(...testedBlocks) : 1);

  return {
    recommendedStart,
    score: Math.round((totalCorrect / answers.length) * 100),
    blockScores,
    weakConceptIds,
  };
}
