// app/api/blocks/route.ts
// GET /api/blocks?lang=pt[&blockId=1]
// Returns all exercises for the language (or a single block). The data
// is the canonical pre-validated JSON files under
// `lib/data/languages/{lang}/blocks/`. Client pages use this to resolve
// card.id → exercise without bundling the full JSON map per-page.
//
// Note: loadAllBlocks returns the raw JSON arrays; we forward them as-is.
// The schema validation happens on the server side via Zod only at write
// time (scripts/generate-content) — the read path trusts the canonical
// files because they're checked into git and verified by verify:content.
import { NextResponse } from "next/server";
import { loadAllBlocks, loadBlock } from "@/lib/data/loaders";
import { hasLocale, type LanguageId } from "@/lib/locales";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const langParam = url.searchParams.get("lang") ?? "pt";
  const lang: LanguageId = hasLocale(langParam) ? langParam : "pt";
  const blockIdParam = url.searchParams.get("blockId");
  if (blockIdParam !== null) {
    const blockId = Number(blockIdParam);
    if (!Number.isFinite(blockId) || blockId < 1) {
      return NextResponse.json({ error: "invalid blockId" }, { status: 400 });
    }
    const exercises = await loadBlock(lang, blockId);
    if (exercises === null) {
      return NextResponse.json({ error: "block not found" }, { status: 404 });
    }
    return NextResponse.json({ lang, blockId, exercises });
  }
  const exercises = await loadAllBlocks(lang);
  return NextResponse.json({ lang, exercises });
}
