// app/[lang]/page.tsx
// Manual Lusitano portada. Server component: streams the layout
// scaffold (heading, subline, TOC, continue lesson, footer note)
// immediately, then a small client island (`HomeStatsClient`) hydrates
// with live SRS counts from Dexie (browser-only IndexedDB).
//
// Server-side we only resolve the curriculum (filesystem-backed TS/JSON
// modules). Dexie lives client-side; the previous home page already
// followed this hybrid pattern with `TodaySummary`/`ContinueCard`.
//
// Per Next 16: `params` is a Promise; we await it. `hasLocale` rejects
// unknown langs (defense-in-depth — the lang layout has already
// validated it, but we re-check defensively).
import { Eyebrow } from "@/components/ui";
import { TocBook, type TocEntry } from "@/components/home/TocBook";
import { ContinueLessonCard } from "@/components/home/ContinueLessonCard";
import { QuickReviewCard } from "@/components/home/QuickReviewCard";
import { StoryOfTheBlockCardNew } from "@/components/home/StoryOfTheBlockCardNew";
import { HomeStatsClient } from "@/components/home/HomeStatsClient";
import { loadCurriculum, loadAllStories } from "@/lib/data/loaders";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { EmptyState } from "./_empty-state";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lang: string }>;
}

// Derive a coarse "mastery" percentage per block from its lessons'
// prereq depth. Without live SRS mastery, this is the best server-side
// signal: a block whose prereqs are all from earlier blocks is "in
// progress"; one with no prereqs is "available". Locking rule: blocks
// that have not yet been authored (`lessons.length === 0`) are locked.
function chaptersFromCurriculum(BLOCKS: Awaited<ReturnType<typeof loadCurriculum>>["BLOCKS"]): TocEntry[] {
  const maxAuthored = BLOCKS.reduce(
    (acc, b) => (b.lessons.length > 0 ? Math.max(acc, b.id) : acc),
    0,
  );
  const currentChapter = maxAuthored;
  return BLOCKS.map((b) => {
    const hasContent = b.lessons.length > 0;
    const locked = !hasContent;
    // Synthetic progress: blocks with content get a stepped estimate
    // based on their position relative to the most recent authored
    // block. The first authored block is 100%, the most recent is
    // "current" (~62%), intermediates interpolate. This matches the
    // mockup's TOC visual without claiming false precision.
    let progressPct = 0;
    let current = false;
    if (hasContent) {
      if (b.id === currentChapter) {
        progressPct = 62;
        current = true;
      } else if (b.id < currentChapter) {
        const steps = currentChapter - 1;
        const stepPct = (currentChapter - b.id) / Math.max(steps, 1);
        progressPct = Math.round(100 - stepPct * 38); // 100% → 62%
      } else {
        progressPct = 0;
      }
    }
    return {
      chapterNum: b.id,
      name: b.name,
      progressPct,
      locked,
      current,
    };
  });
}

export default async function LangHomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang: LanguageId = rawLang;

  // Scaffold language without authored content → empty state. Matches
  // the existing fallback in the legacy home page.
  const { BLOCKS } = await loadCurriculum(lang);
  if (BLOCKS.length === 0) {
    return <EmptyState lang={lang} page="la página de inicio" />;
  }

  const chapters = chaptersFromCurriculum(BLOCKS);
  const currentChapter =
    chapters.find((c) => c.current) ?? chapters.find((c) => !c.locked) ?? chapters[0]!;

  // Pick the first available chapter's first lesson as the "continue
  // reading" target. Once the user has a real `lastLesson` in uiState
  // we will swap this for a read from Dexie (browser-only).
  const firstBlock = BLOCKS.find((b) => b.id === currentChapter.chapterNum);
  const firstLesson = firstBlock?.lessons[0];
  const lastLessonTitle =
    firstLesson?.name ?? chapters[currentChapter.chapterNum - 1]?.name ?? "Lección";

  // Historia real del capítulo actual.
  //
  // Antes esta tarjeta era el mockup transliterado: enlazaba a
  // `stories/b{N}-s1` —un id corto que `loadStory` rechaza por su patrón
  // `/^b\d+-s\d+-.+$/`, o sea un 404 garantizado— y anunciaba «"O Café da
  // Manhã" · Nivel 2 · 12 frases», una historia que no existe en el
  // corpus. Ahora sale de los datos, y si el capítulo no tiene historia
  // la tarjeta no se enseña.
  const historias = await loadAllStories(lang);
  const historia =
    historias.find((s) => s.blockId === currentChapter.chapterNum) ?? null;
  const palabrasHistoria = historia
    ? (historia.variants.pt?.text ?? historia.variants.br?.text ?? "")
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  return (
    <>
    <NavBar />
    <main className="max-w-[760px] mx-auto px-6 py-14 pb-24">
      <Eyebrow>Hoje</Eyebrow>

      <h1 className="font-display text-[39px] mb-2 leading-[1.1]">
        Bom dia, Edu.
      </h1>
      <p className="text-[18px] text-ink-muted mb-7">
        {currentChapter.locked ? (
          <>Estás en el <strong>Capítulo {currentChapter.chapterNum}</strong></>
        ) : (
          <>
            Estás en el{" "}
            <strong>
              Capítulo {romanize(currentChapter.chapterNum)} — {currentChapter.name}
            </strong>
          </>
        )}
      </p>

      <HomeStatsClient lang={lang} />

      <ContinueLessonCard
        lang={lang}
        chapterNum={currentChapter.chapterNum}
        sectionTitle={lastLessonTitle}
        progressPct={currentChapter.progressPct}
      />

      <TocBook lang={lang} chapters={chapters} />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Eyebrow>Repaso rápido</Eyebrow>
          <QuickReviewCard
            lang={lang}
            href="drill/vocab"
            title="Vocabulario"
            meta="Drill libre, sin calendario"
            badgeText="⚡ Sin plan"
            badgeClass="text-review"
          />
        </div>
        {historia && (
          <div>
            <Eyebrow>História do bloco</Eyebrow>
            <StoryOfTheBlockCardNew
              lang={lang}
              href={`stories/${historia.id}`}
              title={historia.title}
              meta={`${palabrasHistoria} palabras · ~${Math.max(1, Math.round(palabrasHistoria / 90))} min`}
              badgeText="🇵🇹 PT-PT"
              badgeClass="text-pt"
            />
          </div>
        )}
      </div>

      <p className="text-center text-ink-faint italic font-display text-sm mt-12">
        — Manual Lusitano · folio 1 · papel, serifa, ritmo —
      </p>
    </main>
    </>
  );
}

function romanize(n: number): string {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] ?? String(n);
}