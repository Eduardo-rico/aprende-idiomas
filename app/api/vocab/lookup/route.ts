// app/api/vocab/lookup/route.ts
// GET /api/vocab/lookup?w=foo
// Returns the catalog entry for a single word, or a fallback dictionary
// match, or 404. The full catalog is ~120 KB — we don't ship it on every
// story page load, so the reader fetches on demand per tap.
//
// Lookup order:
//   1. Audio-backed catalog (`lib/data/vocab-catalog.json`).
//   2. Static fallback dictionary (`lib/vocab/fallback-dictionary.ts`).
//   3. `null` (caller renders the "no está en el diccionario" message).
import { NextResponse } from "next/server";
import { lookupVocab } from "@/lib/vocab/catalog";
import { loadVocabCatalog } from "@/lib/vocab/catalog-server";
import { FALLBACK_DICTIONARY } from "@/lib/vocab/fallback-dictionary";

// One-time lazy init for the catalog. The server keeps it warm across
// requests within a single Node process; on cold start we load from disk
// on the first call.
let initialized = false;
async function ensureCatalog(): Promise<void> {
  if (initialized) return;
  const items = await loadVocabCatalog();
  // Use the public init so the same in-memory cache is shared with other
  // server-side lookups (e.g. the diagnostic quiz).
  const { initCatalog } = await import("@/lib/vocab/catalog");
  initCatalog(items);
  initialized = true;
}

export async function GET(req: Request) {
  await ensureCatalog();
  const url = new URL(req.url);
  const w = url.searchParams.get("w");
  if (!w) {
    return NextResponse.json({ error: "missing ?w=…" }, { status: 400 });
  }
  // Defensive cap: don't return a huge JSON blob if the caller asks for
  // a blank word or something pathological.
  if (w.length > 64) {
    return NextResponse.json({ error: "word too long" }, { status: 400 });
  }
  // Normalize for lookup. The tokenizer lowercases `norm` already, so
  // the request will arrive lowercase, but be defensive in case the
  // caller ever sends mixed case.
  const key = w.toLowerCase().trim();

  const item = lookupVocab(key);
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
  const meaning = FALLBACK_DICTIONARY[key];
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
