// app/api/vocab/lookup/route.ts
// GET /api/vocab/lookup?w=foo[&lang=pt]
// Returns the catalog entry for a single word, or a fallback dictionary
// match, or null. The full catalog is ~120 KB — we don't ship it on every
// story page load, so the reader fetches on demand per tap.
//
// Phase 2 (multi-idioma): acepta `?lang=` (default "pt" para back-compat).
// El catalog y el fallback dictionary se cargan por idioma, así que la
// misma URL sirve para PT, RU, RO, CS — los scaffolds vacíos retornan
// `null` porque su catalog es `[]` y su fallback es `{}`.
//
// Lookup order:
//   1. Audio-backed catalog (`lib/data/languages/{lang}/vocab-catalog.json`).
//   2. Static fallback dictionary (`lib/data/languages/{lang}/fallback-dictionary.ts`).
//   3. `null` (caller renders the "no está en el diccionario" message).
import { NextResponse } from "next/server";
import { lookupVocabInLang, initCatalog } from "@/lib/vocab/catalog";
import { loadVocabCatalog } from "@/lib/vocab/catalog-server";
import { loadFallbackDict } from "@/lib/data/loaders";
import { hasLocale, type LanguageId } from "@/lib/locales";

// One-time lazy init per language. The server keeps each catalog warm
// across requests within a single Node process; on cold start we load
// from disk on the first call for that language.
const initialized = new Set<LanguageId>();
async function ensureCatalog(lang: LanguageId): Promise<void> {
  if (initialized.has(lang)) return;
  const [items, fallback] = await Promise.all([
    loadVocabCatalog(lang),
    loadFallbackDict(lang),
  ]);
  initCatalog(items, lang);
  initialized.add(lang);
  void fallback; // loadFallbackDict garantiza que el dict existe; catalog.ts es el source of truth en runtime
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const w = url.searchParams.get("w");
  const langParam = url.searchParams.get("lang") ?? "pt";
  const lang: LanguageId = hasLocale(langParam) ? langParam : "pt";
  if (!w) {
    return NextResponse.json({ error: "missing ?w=…" }, { status: 400 });
  }
  // Defensive cap: don't return a huge JSON blob if the caller asks for
  // a blank word or something pathological.
  if (w.length > 64) {
    return NextResponse.json({ error: "word too long" }, { status: 400 });
  }
  await ensureCatalog(lang);

  // Normalize for lookup. The tokenizer lowercases `norm` already, so
  // the request will arrive lowercase, but be defensive in case the
  // caller ever sends mixed case.
  const key = w.toLowerCase().trim();

  const item = lookupVocabInLang(key, lang);
  if (item) {
    // Avoid leaking the full `storyIds` array — the client only needs
    // the word, meaning, and audio hash. (storyIds is content metadata
    // we don't need on the reader surface.)
    return NextResponse.json({
      word: item.word,
      ptWord: item.ptWord,
      meaning: item.meaning,
      audioHash: item.audioHash,
      source: "catalog",
    });
  }

  // Fallback: static dictionary (text-only, no audio). The popover uses
  // `source === "fallback"` to suppress the audio button and the
  // "agregar al vocabulario" action — those need a TTS hash and a
  // canonical conceptId, neither of which we have for fallback entries.
  const fallback = await loadFallbackDict(lang);
  const meaning = fallback[key];
  if (meaning) {
    return NextResponse.json({
      word: key,
      meaning,
      source: "fallback",
    });
  }

  // 200 with null so the client doesn't have to handle 404 specially;
  // it already differentiates "no catalog entry" from "real error".
  return NextResponse.json({ word: key, item: null });
}
