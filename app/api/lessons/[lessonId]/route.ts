// app/api/lessons/[lessonId]/route.ts
// GET /api/lessons/:lessonId
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
//   404 — lessonId no está en el curriculum
//   200 — ok; audioRefs puede ser `{}` si no hay entrada en audio-refs.json
//
// Note: la app solo soporta PT (`pt`); el segmento `[lang]` se eliminó
// (Task 0.7). Next 16 marca `params` como Promise (verificado en
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md).
import { NextResponse } from "next/server";
import { loadCurriculum, loadLessonsAudioRefs } from "@/lib/data/loaders";

const LANG = "pt" as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;

  const curriculum = await loadCurriculum(LANG);
  const lesson = curriculum.BLOCKS
    .flatMap((b) => b.lessons)
    .find((l) => l.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const audioRefsMap = await loadLessonsAudioRefs(LANG);
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
