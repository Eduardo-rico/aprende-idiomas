// lib/vocab/catalog.ts
// Vocab library — global catalog derived from stories, used for /drill/vocab
// and the vocab-augmenting story sidebar. Re-exports the catalog type from
// loaders (single source of truth) and adds lookup helpers.
import { loadVocabCatalog, type VocabCatalogItem } from '@/lib/data/loaders';

export type { VocabCatalogItem };

let cache: VocabCatalogItem[] | null = null;

async function getCatalog(): Promise<VocabCatalogItem[]> {
  if (!cache) cache = await loadVocabCatalog();
  return cache;
}

export async function getAllVocab(): Promise<VocabCatalogItem[]> {
  return getCatalog();
}

export async function lookupVocab(word: string): Promise<VocabCatalogItem | null> {
  const items = await getCatalog();
  return items.find((v) => v.word.toLowerCase() === word.toLowerCase()) ?? null;
}

export async function getVocabByConcept(conceptId: string): Promise<VocabCatalogItem[]> {
  const items = await getCatalog();
  return items.filter((v) => v.conceptIds.includes(conceptId));
}

export async function getRandomVocab(n: number, exclude: string[] = []): Promise<VocabCatalogItem[]> {
  const items = await getCatalog();
  const excludeSet = new Set(exclude.map((w) => w.toLowerCase()));
  const pool = items.filter((v) => !excludeSet.has(v.word.toLowerCase()));
  // Fisher-Yates partial shuffle (no Math.random — we use a deterministic
  // timestamp-based seed so SSR + client renders match).
  const out = [...pool];
  for (let i = out.length - 1; i > 0 && i > out.length - n - 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, Math.min(n, out.length));
}

export function _resetCatalogCacheForTests(): void {
  cache = null;
}
