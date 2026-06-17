// app/api/curriculum/route.ts
// GET /api/curriculum?lang=pt
// Returns the curriculum for the active language: BLOCKS, ALL_CONCEPTS,
// and a `lessons` map keyed by lessonId. The client pages can't import
// `lib/data/languages/pt/curriculum.ts` directly (that's a Node module);
// they fetch from this route and cache client-side.
//
// Phase 3 will move pages to `app/[lang]/...` and pass `lang` as a prop
// from the lang layout; for now pages hard-code `lang = "pt"`.
import { NextResponse } from "next/server";
import { loadCurriculum } from "@/lib/data/loaders";
import { hasLocale, type LanguageId } from "@/lib/locales";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const langParam = url.searchParams.get("lang") ?? "pt";
  const lang: LanguageId = hasLocale(langParam) ? langParam : "pt";
  const { BLOCKS, ALL_CONCEPTS, getLesson } = await loadCurriculum(lang);
  const lessons: Record<string, unknown> = {};
  for (const b of BLOCKS) {
    for (const l of b.lessons) {
      try { lessons[l.id] = getLesson(l.id); } catch { /* lesson lookup tolerant */ }
    }
  }
  return NextResponse.json({ lang, blocks: BLOCKS, concepts: ALL_CONCEPTS, lessons });
}
