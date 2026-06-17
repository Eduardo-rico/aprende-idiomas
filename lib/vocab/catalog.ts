// lib/vocab/catalog.ts
// Client-safe vocab library. The catalog data is loaded by the server
// component (see lib/vocab/catalog-server.ts) and passed in via
// `initCatalog(items, lang)`. The lookup helpers below are pure (no fs)
// and safe to import from client components.
//
// Phase 2 (multi-idioma): el cache está keyed por `lang` para que PT y
// RU no se mezclen al cambiar idioma via NavBar.
import type { LanguageId } from "@/lib/locales";
import type { VocabCatalogItem } from "./catalog-types";

export type { VocabCatalogItem };

const cache: Partial<Record<LanguageId, VocabCatalogItem[]>> = {};

/** Initialize the in-memory cache for a specific language.
 *  Call once from a server component before the client renders, or
 *  from a client effect after navigating to a new language. */
export function initCatalog(items: VocabCatalogItem[], lang: LanguageId = "pt"): void {
  cache[lang] = items;
}

function ensureCache(lang: LanguageId): VocabCatalogItem[] {
  const items = cache[lang];
  if (!items) {
    throw new Error(
      `Vocab catalog not initialized for lang "${lang}". ` +
      `Call initCatalog(items, "${lang}") in the server component.`
    );
  }
  return items;
}

/** Default lang (PT) helpers — kept for the api route's pre-Phase-2 callers. */
export function getAllVocab(): VocabCatalogItem[] {
  return ensureCache("pt");
}

export function lookupVocab(word: string): VocabCatalogItem | null {
  return lookupVocabInLang(word, "pt");
}

export function lookupVocabInLang(word: string, lang: LanguageId): VocabCatalogItem | null {
  const items = ensureCache(lang);
  return items.find((v) => v.word.toLowerCase() === word.toLowerCase()) ?? null;
}

export function getVocabByConcept(conceptId: string): VocabCatalogItem[] {
  return ensureCache("pt").filter((v) => v.conceptIds.includes(conceptId));
}

export function getRandomVocab(n: number, exclude: string[] = []): VocabCatalogItem[] {
  const items = ensureCache("pt");
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
  for (const k of Object.keys(cache)) delete cache[k as LanguageId];
}
