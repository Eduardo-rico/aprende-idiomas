// tests/unit/vocab-catalog.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import {
  initCatalog,
  lookupVocab, getVocabByConcept, getAllVocab, getRandomVocab,
  _resetCatalogCacheForTests,
} from '@/lib/vocab/catalog';
import { loadVocabCatalog } from '@/lib/vocab/catalog-server';
import type { VocabCatalogItem } from '@/lib/vocab/catalog-types';

describe('vocab catalog', () => {
  let items: VocabCatalogItem[] = [];

  beforeAll(async () => {
    _resetCatalogCacheForTests();
    items = await loadVocabCatalog();
    initCatalog(items);
  });

  it('catalog loads from disk', () => {
    expect(items.length).toBeGreaterThan(0);
    const first = items[0]!;
    expect(typeof first.word).toBe('string');
    expect(typeof first.meaning).toBe('string');
    expect(typeof first.audioHash.br).toBe('string');
    expect(typeof first.audioHash.pt).toBe('string');
    expect(Array.isArray(first.conceptIds)).toBe(true);
    expect(Array.isArray(first.storyIds)).toBe(true);
  });

  it('getAllVocab returns the same array reference as the loaded catalog', () => {
    const got = getAllVocab();
    expect(got).toBe(items);
  });

  it('lookupVocab finds an existing word (case-insensitive)', () => {
    const first = items[0]!;
    const exact = lookupVocab(first.word);
    const upper = lookupVocab(first.word.toUpperCase());
    expect(exact?.word).toBe(first.word);
    expect(upper?.word).toBe(first.word);
  });

  it('lookupVocab returns null for unknown word', () => {
    expect(lookupVocab('zzzz-nonexistent-word-xyz')).toBeNull();
  });

  it('getVocabByConcept filters correctly', () => {
    const first = items[0]!;
    const known = first.conceptIds[0];
    if (!known) return;
    const filtered = getVocabByConcept(known);
    for (const v of filtered) {
      expect(v.conceptIds).toContain(known);
    }
  });

  it('getRandomVocab returns N items (or fewer if pool too small)', () => {
    const n = Math.min(5, items.length);
    if (n === 0) return;
    const rand = getRandomVocab(n);
    expect(rand.length).toBe(n);
    const seen = new Set(rand.map((v) => v.word));
    expect(seen.size).toBe(n);
  });

  it('getRandomVocab respects exclude list', () => {
    if (items.length < 2) return;
    const first = items[0]!;
    const second = items[1]!;
    const rand = getRandomVocab(5, [first.word, second.word]);
    for (const v of rand) {
      expect([first.word, second.word]).not.toContain(v.word);
    }
  });
});
