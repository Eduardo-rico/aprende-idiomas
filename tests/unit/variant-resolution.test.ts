// tests/unit/variant-resolution.test.ts
import { describe, it, expect } from 'vitest';
import { resolveExerciseData } from '@/lib/exercise-resolver';

// An exercise whose only override is the legacy European text under "pt-br".
const ex = {
  id: 'x', type: 'flashcard', blockId: 7, lessonId: 'b7-l1', difficulty: 1, concepts: [], tags: [],
  data: { front: 'estoy hablando', back: 'estou falando' }, // BR base
  variantOverrides: { 'pt-br': { back: 'estou a falar' } },  // legacy European, mislabeled
} as any;

describe('variant resolution (E1)', () => {
  it('pt-pt user gets the European override', () => {
    expect((resolveExerciseData(ex, 'pt-pt') as any).back).toBe('estou a falar');
  });
  it('pt-br user gets the BR base, NOT the European override', () => {
    expect((resolveExerciseData(ex, 'pt-br') as any).back).toBe('estou falando');
  });
  it('legacy "pt" alias still maps to European', () => {
    expect((resolveExerciseData(ex, 'pt') as any).back).toBe('estou a falar');
  });
});
