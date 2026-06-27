// tests/unit/interleave.test.ts
import { describe, it, expect } from 'vitest';
import { interleave } from '@/lib/srs/interleave';

const card = (id: string) => ({ id } as any);
const concept: Record<string, string> = { a1: 'c1', a2: 'c1', a3: 'c1', b1: 'c2', b2: 'c2', d1: 'c3' };
const type: Record<string, string> = { a1: 'flashcard', a2: 'flashcard', a3: 'flashcard', b1: 'translation', b2: 'translation', d1: 'fill_blank' };

describe('interleave', () => {
  it('avoids consecutive same-concept cards when alternatives exist', () => {
    const out = interleave([card('a1'), card('a2'), card('a3'), card('b1'), card('b2'), card('d1')],
      (id) => concept[id], (id) => type[id]);
    let consecutiveSameConcept = 0;
    for (let i = 1; i < out.length; i++) if (concept[out[i]!.id] === concept[out[i - 1]!.id]) consecutiveSameConcept++;
    expect(consecutiveSameConcept).toBeLessThan(2); // far fewer than the 3 in the blocked input
    expect(out.length).toBe(6); // no card lost
  });
});
