// app/[lang]/(learn)/libro/[chapter]/[section]/page.tsx
// Manual Lusitano lección page — 2-column editorial layout matching
// mockup design-mockups/leccion.html. Server component (Next 16 +
// Turbopack): streams the editorial scaffold immediately, then
// embeds the lesson's MDX slot for the full prose body.
//
// URL convention: `/[lang]/libro/{chapter}/{section}` where
// `chapter` is the blockId (1..10) and `section` is the lesson
// slug — the part after `b{N}-l{N}-` in the canonical lessonId.
//
// Components used are local to `components/lessons/`:
//   - <DropCap>           wraps the first paragraph
//   - <ConjugationTable>  optional paradigm (6-per-row)
//   - <PullQuote>         italic display quote with cite
//   - <MarginNotesColumn> right column of editorial notes
//
// Audio is rendered with two `<LessonAudioChip>`s (PT-BR / PT-PT)
// sourced from the audioRefs sidecar. The audio preloader from
// Task 0.9 is imported so the LRU warms the first example on mount.
import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadLesson } from "@/lib/data/loaders";
import { DropCap } from "@/components/lessons/DropCap";
import { ConjugationTable } from "@/components/lessons/ConjugationTable";
import { PullQuote } from "@/components/lessons/PullQuote";
import {
  MarginNotesColumn,
  type MarginNoteEntry,
} from "@/components/lessons/MarginNotesColumn";
import { LessonAudioChip } from "@/components/lessons/LessonAudioChip";
import { preloadNextAudio } from "@/lib/audio/preloader";
import { Eyebrow } from "@/components/ui";

// Force dynamic so a freshly-authored lesson shows up without a
// rebuild (matches the home page behavior).
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lang: string; chapter: string; section: string }>;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
function romanize(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

export default async function LessonPage({ params }: PageProps) {
  const { lang: rawLang, chapter, section } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang: LanguageId = rawLang;
  const lesson = await loadLesson(lang, chapter, section);
  if (!lesson || lesson.blockId !== Number(chapter)) notFound();

  const marginNotes: MarginNoteEntry[] = lesson.marginNotes ?? [];
  const brAudio = lesson.audioRefs["pt-br"][0]?.url;
  const ptAudio = lesson.audioRefs["pt-pt"][0]?.url;

  // Pre-warm the LRU with the first example for both variants so the
  // user's first click is instant. Only runs on the server pass;
  // preloader is a no-op server-side (checks `typeof window`).
  preloadNextAudio([brAudio, ptAudio].filter((u): u is string => !!u));

  return (
    <>
      <div className="max-w-[1080px] mx-auto px-6 pt-5 font-display italic text-sm text-ink-faint flex justify-between">
        <span>
          Capítulo {romanize(Number(chapter))} — {lesson.blockName}
        </span>
        <span className="font-mono not-italic text-xs">p. {lesson.pageNumber}</span>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-2 pb-24 grid grid-cols-[1fr_248px] gap-14 max-md:grid-cols-1 max-md:gap-0">
        <article>
          <Eyebrow accentClass="bg-lesson" className="[&_div:first-child]:text-lesson">
            Capítulo {romanize(Number(chapter))} · Lección {lesson.lessonNumber}
          </Eyebrow>
          <h1 className="font-display text-[42px] leading-[1.05] mb-3.5">
            {lesson.title}
          </h1>
          <p className="text-sm text-ink-muted mb-0">
            {lesson.conceptCount} conceitos · {lesson.estimatedMinutes} min ·
            audio nativo BR + PT
          </p>
          <hr className="border-rule my-10" />

          <div className="text-[18px] leading-[1.7] text-ink max-w-[62ch]">
            <DropCap>{lesson.firstParagraph}</DropCap>

            {lesson.conjugation.length > 0 && (
              <ConjugationTable rows={lesson.conjugation} />
            )}

            <p>{lesson.bodyParagraph}</p>

            <PullQuote cite={lesson.quoteCite}>{lesson.quoteText}</PullQuote>

            <p>Ouça as duas variantes e note a diferença de cadência:</p>
            <div className="my-2 flex flex-wrap gap-2">
              <LessonAudioChip
                label={`"${lesson.quoteText}" — PT-BR`}
                audioUrl={brAudio}
                variant="br"
              />
              <LessonAudioChip
                label={`"${lesson.quoteText}" — PT-PT`}
                audioUrl={ptAudio}
                variant="pt"
              />
            </div>

            <Link
              href={`/${lang}/practicar/${chapter}/${section}`}
              className="inline-flex items-center gap-2 bg-lesson text-paper font-medium rounded-lg px-5 py-3 mt-8 no-underline"
            >
              Continuar a exercícios →
            </Link>

            <div className="text-center text-ink-faint font-display mt-12">
              <p className="italic text-[15px] text-ink-muted mb-4">
                Continua na p. {lesson.pageNumber + 1} →
              </p>
              <div className="text-[18px]">❦</div>
            </div>
          </div>
        </article>

        <MarginNotesColumn notes={marginNotes} />
      </div>
    </>
  );
}
