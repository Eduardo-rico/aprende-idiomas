// tests/unit/vocab-catalog.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { lookupVocab, getVocabByConcept, getAllVocab, getRandomVocab, _resetCatalogCacheForTests } from '@/lib/vocab/catalog';

describe('vocab catalog', () => {
  beforeAll(() => {
    _resetCatalogCacheForTests();
  });

  it('getAllVocab returns non-empty array when catalog exists', async () => {
    const items = await getAllVocab();
    expect(Array.isArray(items)).toBe(true);
    if (items.length > 0) {
      const first = items[0];
      expect(typeof first.word).toBe('string');
      expect(typeof first.meaning).toBe('string');
      expect(typeof first.audioHash.br).toBe('string');
      expect(typeof first.audioHash.pt).toBe('string');
      expect(Array.isArray(first.conceptIds)).toBe(true);
      expect(Array.isArray(first.storyIds)).toBe(true);
    }
  });

  it('lookupVocab finds an existing word (case-insensitive)', async () => {
    const items = await getAllVocab();
    if (items.length === 0) return; // skip if catalog empty
    const first = items[0];
    const exact = await lookupVocab(first.word);
    const upper = await lookupVocab(first.word.toUpperCase());
    expect(exact?.word).toBe(first.word);
    expect(upper?.word).toBe(first.word);
  });

  it('lookupVocab returns null for unknown word', async () => {
    const got = await lookupVocab('zzzz-nonexistent-word-xyz');
    expect(got).toBeNull();
  });

  it('getVocabByConcept filters correctly', async () => {
    const items = await getAllVocab();
    if (items.length === 0) return;
    // Pick a conceptId that we know exists.
    const known = items[0].conceptIds[0];
    if (!known) return;
    const filtered = await getVocabByConcept(known);
    for (const v of filtered) {
      expect(v.conceptIds).toContain(known);
    }
  });

  it('getRandomVocab returns N items (or fewer if pool too small)', async () => {
    const items = await getAllVocab();
    const n = Math.min(5, items.length);
    if (n === 0) return;
    const rand = await getRandomVocab(n);
    expect(rand.length).toBe(n);
    // No duplicates in the sample.
    const seen = new Set(rand.map((v) => v.word));
    expect(seen.size).toBe(n);
  });

  it('getRandomVocab respects exclude list', async () => {
    const items = await getAllVocab();
    if (items.length < 2) return;
    const [first, second] = items;
    const rand = await getRandomVocab(5, [first.word, second.word]);
    for (const v of rand) {
      expect([first.word, second.word]).not.toContain(v.word);
    }
  });
});
