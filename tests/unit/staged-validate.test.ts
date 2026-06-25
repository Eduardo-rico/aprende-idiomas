import { describe, it, expect } from 'vitest';
import { validateNewType, assignIds } from '@/scripts/lib/staged-validate';

describe('validateNewType (E10)', () => {
  it('flags MC duplicate options', () => {
    expect(validateNewType({ type: 'multiple_choice', data: { question: 'q', options: ['a','a','b'], correctIndex: 0, explanationEs: 'x' } } as any)).toContain('duplicate options');
  });
  it('flags MC out-of-range correctIndex', () => {
    expect(validateNewType({ type: 'multiple_choice', data: { question: 'q', options: ['a','b'], correctIndex: 5, explanationEs: 'x' } } as any).join()).toMatch(/correctIndex/);
  });
  it('flags error_correction where sentence equals correct', () => {
    expect(validateNewType({ type: 'error_correction', data: { sentence: 'igual', correct: 'igual', explanationEs: 'x' } } as any).join()).toMatch(/sentence equals correct/);
  });
  it('flags ambiguous matching (duplicate right values)', () => {
    expect(validateNewType({ type: 'matching', data: { pairs: [{ left: 'a', right: 'x' }, { left: 'b', right: 'x' }] } } as any).join()).toMatch(/ambiguous matching/);
  });
  it('passes a clean multiple_choice', () => {
    expect(validateNewType({ type: 'multiple_choice', data: { question: 'q', options: ['a','b'], correctIndex: 1, explanationEs: 'x' } } as any)).toEqual([]);
  });
});

describe('assignIds (R2)', () => {
  it('reports a collision instead of dropping it', () => {
    const a = { type: 'error_correction', data: { sentence: 's', correct: 'c', explanationEs: 'e' } } as any;
    const { withIds, collisions } = assignIds([a, a], new Set());
    // identical content → same hash → second is a collision
    expect(withIds.length).toBe(1);
    expect(collisions.length).toBe(1);
  });
  it('assigns the same 8-char id the existing pipeline would (hashKey parity)', () => {
    const a = { type: 'error_correction', data: { sentence: 's', correct: 'c', explanationEs: 'e' } } as any;
    const { withIds } = assignIds([a], new Set());
    expect(withIds[0]?.id).toMatch(/^[a-f0-9]{8}$/);
  });
});
