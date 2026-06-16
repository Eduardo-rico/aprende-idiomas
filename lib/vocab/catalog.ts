// lib/vocab/catalog.ts
// Client-safe vocab library. The catalog data is loaded by the server
// component (see lib/vocab/catalog-server.ts) and passed in as a prop or
// stored in a module-level cache by an init function. The lookup helpers
// below are pure (no fs) and safe to import from client components.
import type { VocabCatalogItem } from "./catalog-types";

export type { VocabCatalogItem };

let cache: VocabCatalogItem[] | null = null;

/** Initialize the in-memory cache. Call once from a server component
 *  before the client renders, or from a client effect. */
export function initCatalog(items: VocabCatalogItem[]): void {
  cache = items;
}

function ensureCache(): VocabCatalogItem[] {
  if (!cache) {
    throw new Error('Vocab catalog not initialized. Call initCatalog() in the server component.');
  }
  return cache;
}

export function getAllVocab(): VocabCatalogItem[] {
  return ensureCache();
}

export function lookupVocab(word: string): VocabCatalogItem | null {
  const items = ensureCache();
  return items.find((v) => v.word.toLowerCase() === word.toLowerCase()) ?? null;
}

export function getVocabByConcept(conceptId: string): VocabCatalogItem[] {
  return ensureCache().filter((v) => v.conceptIds.includes(conceptId));
}

export function getRandomVocab(n: number, exclude: string[] = []): VocabCatalogItem[] {
  const items = ensureCache();
  const excludeSet = new Set(exclude.map((w) => w.toLowerCase()));
  const pool = items.filter((v) => !excludeSet.has(v.word.toLowerCase()));
  // Fisher-Yates partial shuffle (only shuffle the n cards we need).
  const out = [...pool];
  for (let i = out.length - 1; i > 0 && i > out.length - n - 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i]!;
    const b = out[j]!;
    out[i] = b;
    out[j] = a;
  }
  return out.slice(0, Math.min(n, out.length));
}

export function _resetCatalogCacheForTests(): void {
  cache = null;
}
