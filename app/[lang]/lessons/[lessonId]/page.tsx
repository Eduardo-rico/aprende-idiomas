// app/[lang]/lessons/[lessonId]/page.tsx
// Standalone "Repasar lección" page — manual review entry point.
//
// Used by:
//   1. The "Ver lección →" panel on /blocks/[id]/lessons/[lid]
//   2. The "Repasar lección" card on /review (recent views)
//
// Unlike /practice/[lessonId], this page does NOT consult the
// `LessonGate` — it's a free-form review surface where the user
// can read the lesson content, browse, and then choose to practice.
//
// Renders the same `LessonRenderer` used by the LessonStep inside
// the runner, but in a "no continuation required" layout: the
// "Continuar a ejercicios →" link at the bottom is a regular
// `<Link>` rather than a Dexie-write button.
import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadCurriculum, loadLessonsAudioRefs } from "@/lib/data/loaders";
import { LessonRenderer } from "@/components/lessons/LessonRenderer";
import { BloqueBreadcrumb } from "@/components/bloque/BloqueBreadcrumb";

export default async function StandaloneLessonPage({
  params,
}: {
  params: Promise<{ lang: string; lessonId: string }>;
}) {
  const { lang: rawLang, lessonId } = await params;
  if (!hasLocale(rawLang)) {
    notFound();
  }
  const lang: LanguageId = rawLang;

  // Solo PT tiene contenido de lecciones en este momento (los scaffolds
  // RU/RO/CS están vacíos). Para idiomas no-PT devolvemos 404 — el
  // link de "Repasar lección" solo aparece en /review si la lección
  // existe, así que este 404 es alcanzable solo si el usuario hace
  // copy-paste de una URL con un lang distinto.
  if (lang !== "pt") {
    notFound();
  }

  const curriculum = await loadCurriculum(lang);
  const lesson = curriculum.BLOCKS
    .flatMap((b) => b.lessons)
    .find((l) => l.id === lessonId);
  if (!lesson) {
    notFound();
  }

  const audioRefsMap = await loadLessonsAudioRefs(lang);
  const audioRefs = audioRefsMap[lessonId]?.audioRefs ?? {};

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <BloqueBreadcrumb blockId={lesson.blockId} suffix="lesson-before" />
      <h1 className="font-display text-4xl">{lesson.name}</h1>

      <LessonRenderer
        lessonId={lesson.id}
        mdxPath={lesson.conceptNotesPath}
        lang={lang}
        audioRefs={audioRefs}
      />

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <Link
          href={`/${lang}/blocks/${lesson.blockId}/lessons/${lesson.id}`}
          className="text-sm text-muted hover:text-foreground"
        >
          ← Volver a la lección
        </Link>
        <Link
          href={`/${lang}/practice/${lesson.id}`}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
        >
          Continuar a ejercicios →
        </Link>
      </div>
    </div>
  );
}