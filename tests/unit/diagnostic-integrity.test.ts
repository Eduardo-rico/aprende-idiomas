import { describe, it, expect } from 'vitest';
import diag from '@/lib/data/languages/pt/diagnostic.json';
import concepts from '@/lib/data/languages/pt/concepts.json';

const conceptIds = new Set((concepts as { id: string }[]).map((c) => c.id));

describe('diagnostic integrity', () => {
  for (const q of (diag as any).questions) {
    it(`${q.id}: options unique, correctIndex valid, conceptId known`, () => {
      expect(new Set(q.options).size).toBe(q.options.length);            // no dup options
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(conceptIds.has(q.conceptId)).toBe(true);                    // valid concept
    });
  }
});
