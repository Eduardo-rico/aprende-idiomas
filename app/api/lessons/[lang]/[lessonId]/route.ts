// app/api/lessons/[lang]/[lessonId]/route.ts
// GET /api/lessons/:lang/:lessonId
// Devuelve los metadatos que la LessonGate / LessonStep (L3+) necesita
// para renderizar una lección antes de su primera ejercitación.
//
// Shape del 200 (estable, L3+ lo consume):
//   {
//     lessonId:    string  // id de la lección
//     blockId:     number  // bloque curricular
//     mdxPath:     string  // ruta MDX relativa a lib/data/languages/pt/mdx/
//     audioRefs:   Record<VariantKey, LessonAudioRef[]>  // [] por variante si no hay audio
//     exampleCount: number
//     title:       string  // title del audio-refs entry, fallback lesson.name
//   }
//
// Códigos:
//   400 — idioma desconocido (no en LANGUAGES)
//   400 — idioma scaffolded pero sin contenido de lecciones (RU/RO/CS por ahora)
//   404 — lessonId no está en el curriculum del idioma
//   200 — ok; audioRefs puede ser `{}` si no hay entrada en audio-refs.json
//
// Note: Next 16 marca `params` como Promise (verificado en
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md).
import { NextResponse } from "next/server";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadCurriculum, loadLessonsAudioRefs } from "@/lib/data/loaders";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; lessonId: string }> }
) {
  const { lang: rawLang, lessonId } = await params;

  if (!hasLocale(rawLang)) {
    return NextResponse.json({ error: "Unknown language" }, { status: 400 });
  }
  const lang: LanguageId = rawLang;

  // RU/RO/CS scaffolds tienen curriculum vacío y sin audio-refs; no
  // devolvemos 404 porque el cliente puede mostrar "lección no
  // disponible en este idioma" sin distinguir del 404 de lessonId.
  if (lang !== "pt") {
    return NextResponse.json(
      { error: "No lessons for this language" },
      { status: 400 }
    );
  }

  const curriculum = await loadCurriculum(lang);
  const lesson = curriculum.BLOCKS
    .flatMap((b) => b.lessons)
    .find((l) => l.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const audioRefsMap = await loadLessonsAudioRefs(lang);
  const entry = audioRefsMap[lessonId];

  return NextResponse.json({
    lessonId: lesson.id,
    blockId: lesson.blockId,
    // Reutiliza el campo curriculum existente — el MDX vive en
    // `lib/data/languages/pt/mdx/{conceptNotesPath}` (L0).
    mdxPath: lesson.conceptNotesPath,
    audioRefs: entry?.audioRefs ?? {},
    exampleCount: entry?.exampleCount ?? 0,
    title: entry?.title ?? lesson.name,
  });
}
