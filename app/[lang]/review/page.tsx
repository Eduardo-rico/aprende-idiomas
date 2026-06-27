// app/[lang]/review/page.tsx
// Daily Review — the real cross-card session. Pulls due cards via
// getDueCards(now, cap, { cap, newCardsPerDay }), resolves each to its
// Exercise (so the runner can render any type — flashcard, fill_blank, …),
// and plays a mixed review across all blocks/lessons. Distinct from
// /practice/[lessonId] which is lesson-scoped and lesson-ordered.
//
// When the user arrived from /learn with a tag filter active, the filter
// set is encoded in the `?tags=vocab,story:b1-...` query string. We honor
// that here so the session reflects the filter the user picked.
"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getDueCards, getDueCardsByTag, getLessonViewsForLanguage } from "@/lib/db/repository";
import { db } from "@/lib/db/schema";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import type { Exercise } from "@/lib/data/zod-schemas";
import { FSRS_CONFIG } from "@/lib/srs/config";
import { interleave } from "@/lib/srs/interleave";
import { useSession } from "@/lib/stores/session";
import { tagLabel } from "@/lib/db/tags";
import type { Lesson } from "@/lib/data/curriculum-types";
import { hasLocale, type LanguageId } from "@/lib/locales";
import type { LessonView } from "@/lib/db/schema";

// Next.js 16 requires useSearchParams() to be wrapped in a Suspense boundary
// for the page to remain prerenderable. We split the page into an inner
// component (the only consumer of useSearchParams) and a thin outer wrapper
// that exports the Suspense shell. See:
// node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md
function ReviewPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const params = useParams<{ lang: string }>();
  const rawLang = params.lang;
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : "pt";
  const activeTags = (search.get("tags") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [split, setSplit] = useState<{ review: number; newCards: number } | null>(null);
  const [done, setDone] = useState<{ reviewed: number; correct: number } | null>(null);
  const [byId, setById] = useState<Map<string, Exercise>>(new Map());
  // L5: "Repasar lección" surfaces the user's most-recent lesson views.
  // Stored as a list so we can sort/limit client-side if Dexie's index
  // ordering changes. We resolve lesson titles from the curriculum
  // (fetched alongside the exercises) so the card shows a real name
  // instead of just `b1-l1-alfabeto-acentos`.
  const [recentLessonViews, setRecentLessonViews] = useState<LessonView[]>([]);
  const [lessonTitleById, setLessonTitleById] = useState<Map<string, string>>(new Map());
  // Guard against React 19 StrictMode double-running this effect in dev.
  const sessionCreated = useRef(false);

  // Carga todos los blocks del idioma activo una sola vez.
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/blocks?lang=${lang}`);
      if (!res.ok) return;
      const { exercises: all } = (await res.json()) as { exercises: Exercise[] };
      setById(new Map(all.map((e) => [e.id, e])));
    })();
  }, [lang]);

  // L5: load curriculum + recent lesson views in parallel so the
  // "Repasar lección" cards can show a friendly lesson title instead
  // of the raw lessonId. We don't need to wait for either before
  // showing the daily review — both fetches are independent of the
  // SRS queue.
  useEffect(() => {
    (async () => {
      try {
        const [views, curRes] = await Promise.all([
          getLessonViewsForLanguage(lang),
          fetch(`/api/curriculum?lang=${lang}`),
        ]);
        // Sort by viewedAt DESC (the repo already sorts, but be defensive
        // in case a future schema bump drops the index) and cap at 10.
        const sorted = [...views]
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .slice(0, 10);
        setRecentLessonViews(sorted);
        if (curRes.ok) {
          const { lessons } = (await curRes.json()) as { lessons: Record<string, Lesson> };
          setLessonTitleById(new Map(Object.entries(lessons).map(([id, l]) => [id, l.name])));
        }
      } catch (err) {
        // Don't break the review session if the lesson-views table
        // doesn't exist yet (Dexie upgrade in flight) — just hide the
        // section.
        console.error("ReviewPage: failed to load recent lesson views", err);
      }
    })();
  }, [lang]);

  useEffect(() => {
    if (sessionCreated.current) return;
    sessionCreated.current = true;
    (async () => {
      try {
        const now = new Date();
        const options = { cap: FSRS_CONFIG.daily_review_cap, newCardsPerDay: FSRS_CONFIG.new_cards_per_day };
        const due = activeTags.length === 0
          ? await getDueCards(now, FSRS_CONFIG.daily_review_cap, options)
          : await getDueCardsByTag(activeTags, now, FSRS_CONFIG.daily_review_cap, options);
        const review = due.filter((c) => c.state > 0).length;
        const newCards = due.filter((c) => c.state === 0).length;
        setSplit({ review, newCards });

        if (due.length === 0) {
          router.replace(`/${lang}/learn`);
          return;
        }

        // E6: interleave so consecutive cards rarely share a concept/type
        // (otherwise reviews and new cards run as two same-concept blocks).
        const mixed = interleave(
          due,
          (id) => byId.get(id)?.concepts?.[0],
          (id) => byId.get(id)?.type,
        );
        const ordered: Exercise[] = [];
        for (const card of mixed) {
          const ex = byId.get(card.id);
          if (ex) ordered.push(ex);
        }
        if (ordered.length === 0) {
          router.replace(`/${lang}/learn`);
          return;
        }
        setExercises(ordered);

        // Daily review is mixed-lesson, so blockId/lessonId are nominal —
        // record the session under a sentinel so /stats can group it.
        const sid = await db.sessions.add({
          startedAt: new Date(),
          blockId: 0,
          lessonId: "daily-review",
          mode: "review",
          cardsReviewed: 0,
          correctCount: 0,
          durationMs: 0,
        });
        setSessionId(sid as number);
        useSession.getState().beginSession(sid as number, "review");
      } catch (err) {
        setSessionError(err instanceof Error ? err.message : String(err));
      }
    })();
  }, [router, lang, activeTags.length, activeTags.join(","), byId]);

  useEffect(() => {
    if (!done) return;
    useSession.getState().endSession();
    if (sessionId) {
      db.sessions.update(sessionId, { endedAt: new Date(), cardsReviewed: done.reviewed, correctCount: done.correct });
    }
  }, [done, sessionId]);

  if (sessionError) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl">No se pudo iniciar la sesión</h1>
        <p className="text-muted text-sm">{sessionError}</p>
        <button onClick={() => router.push(`/${lang}/learn`)} className="px-4 py-2 border border-border rounded-md">
          Volver
        </button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((done.correct / Math.max(done.reviewed, 1)) * 100);
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-4xl">¡Repaso completo!</h1>
        <div className="text-6xl font-display">{pct}%</div>
        <p className="text-muted">
          {done.correct} de {done.reviewed} correctas
        </p>
        {split && (
          <p className="text-sm text-muted">
            {split.review} repasos · {split.newCards} nuevas
          </p>
        )}
        <div className="flex gap-2 justify-center">
          <button onClick={() => router.push(`/${lang}/blocks`)} className="px-4 py-2 border border-border rounded-md">
            Ver bloques
          </button>
          <button onClick={() => router.push(`/${lang}`)} className="px-4 py-2 bg-primary text-fg rounded-md">
            Inicio
          </button>
        </div>
      </div>
    );
  }

  if (!exercises || !sessionId) {
    return <div className="p-12 text-center text-muted">Cargando repaso diario…</div>;
  }

  return (
    <div>
      <div className="max-w-xl mx-auto px-4 pt-6 flex items-center justify-between text-xs text-muted uppercase tracking-wide">
        <span>Repaso diario</span>
        {activeTags.length > 0 && (
          <span className="normal-case tracking-normal">
            Filtrando por: {activeTags.map(tagLabel).join(", ")}
          </span>
        )}
      </div>

      {/* L5: "Repasar lección" — quick links back to the standalone lesson
          page for any lesson the user has seen recently. Sourced from
          Dexie's lessonViews table; rendered above the runner so the
          user can jump into a lesson review without losing the daily
          session. The empty state mirrors the "No has visto ninguna
          lección todavía" copy from the spec. */}
      {recentLessonViews.length > 0 && (
        <section className="max-w-xl mx-auto px-4 mt-6">
          <h2 className="font-display text-xl mb-2">Repasar lección</h2>
          <p className="text-xs text-muted mb-3">
            Lecciones que viste recientemente. Ábrelas para releer la explicación.
          </p>
          <ul className="space-y-2">
            {recentLessonViews.map((view) => (
              <li
                key={view.id}
                className="flex items-center justify-between rounded-md border border-border px-4 py-3 bg-card"
              >
                <div>
                  <div className="font-medium text-sm">
                    {lessonTitleById.get(view.lessonId) ?? view.lessonId}
                  </div>
                  <div className="text-xs text-muted">
                    Vista por última vez {formatRelativeTime(view.viewedAt)}
                  </div>
                </div>
                <Link
                  href={`/${lang}/lessons/${view.lessonId}`}
                  className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent"
                >
                  Repasar lección →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ExerciseRunner
        exercises={exercises}
        blockId={0}
        lessonId="daily-review"
        onFinish={setDone}
        lang={lang}
      />
    </div>
  );
}

/** Compact "hace X" / "ayer" / date label for a viewedAt timestamp.
 *  Kept local to this file because the only caller is the
 *  "Repasar lección" section above — no other page needs it. */
function formatRelativeTime(ts: number): string {
  const now = Date.now();
  const diffMs = now - ts;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "hace un momento";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;
  return new Date(ts).toLocaleDateString();
}

export default function ReviewPage() {
  // The fallback matches the rest of the loading state (matches the "Cargando"
  // message the inner component shows when `exercises` is null), so the
  // prerendered HTML and the hydrated state look identical.
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Cargando repaso diario…</div>}>
      <ReviewPageInner />
    </Suspense>
  );
}
