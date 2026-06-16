// tests/unit/diagnostic-scorer.test.ts
import { describe, it, expect } from 'vitest';
import { computeRecommendation } from '@/lib/diagnostic/scorer';
import type { DiagnosticQuestion } from '@/lib/data/zod-schemas';

const questions: DiagnosticQuestion[] = [
  { id: 'q1', blockId: 1, correctIndex: 0, prompt: '', options: ['a', 'b', 'c', 'd'], conceptId: 'b1-a' },
  { id: 'q2', blockId: 1, correctIndex: 1, prompt: '', options: ['a', 'b', 'c', 'd'], conceptId: 'b1-b' },
  { id: 'q3', blockId: 2, correctIndex: 2, prompt: '', options: ['a', 'b', 'c', 'd'], conceptId: 'b2-a' },
  { id: 'q4', blockId: 2, correctIndex: 3, prompt: '', options: ['a', 'b', 'c', 'd'], conceptId: 'b2-b' },
  { id: 'q5', blockId: 3, correctIndex: 0, prompt: '', options: ['a', 'b', 'c', 'd'], conceptId: 'b3-a' },
];

describe('computeRecommendation', () => {
  it('all correct → recommends B1 (you can start at the beginning)', () => {
    const rec = computeRecommendation(questions, [0, 1, 2, 3, 0]);
    expect(rec.recommendedStart).toBe(1);
  });

  it('0% in B1, 100% in B2, B3 → recommends B1 (must review)', () => {
    const rec = computeRecommendation(questions, [9, 9, 2, 3, 0]);
    expect(rec.recommendedStart).toBe(1);
  });

  it('100% B1, 0% B2, 100% B3 → recommends B2 (lowest failing)', () => {
    // q1=0 (B1, correct=0) → B1: 1/1 = 100%
    // q2=1 (B1, correct=1) → B1: 2/2 = 100%
    // q3=9 (B2, wrong=2) → B2: 0/1 = 0%
    // q4=9 (B2, wrong=3) → B2: 0/2 = 0%
    // q5=0 (B3, correct=0) → B3: 1/1 = 100%
    const rec = computeRecommendation(questions, [0, 1, 9, 9, 0]);
    expect(rec.recommendedStart).toBe(2);
  });

  it('all correct → score = 100', () => {
    const rec = computeRecommendation(questions, [0, 1, 2, 3, 0]);
    expect(rec.score).toBe(100);
  });

  it('empty answers → fallback B1', () => {
    const rec = computeRecommendation(questions, []);
    expect(rec.recommendedStart).toBe(1);
  });

  it('weak concepts are listed', () => {
    // q1=9 (B1-a, wrong), q2=9 (B1-b, wrong), q3=9 (B2-a, wrong), q4=3 (B2-b, correct), q5=0 (B3-a, correct)
    const rec = computeRecommendation(questions, [9, 9, 9, 3, 0]);
    expect(rec.weakConceptIds).toContain('b1-a');
    expect(rec.weakConceptIds).toContain('b1-b');
    expect(rec.weakConceptIds).toContain('b2-a');
    expect(rec.weakConceptIds).not.toContain('b2-b');
    expect(rec.weakConceptIds).not.toContain('b3-a');
  });

  it('blockScores reflects per-block accuracy', () => {
    const rec = computeRecommendation(questions, [0, 9, 2, 3, 0]);
    expect(rec.blockScores[1]).toBeCloseTo(0.5, 5);
    expect(rec.blockScores[2]).toBe(1);
    expect(rec.blockScores[3]).toBe(1);
  });
});
