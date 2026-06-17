// app/review/page.tsx
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
import { useRouter, useSearchParams } from "next/navigation";
import { getDueCards, getDueCardsByTag } from "@/lib/db/repository";
import { db } from "@/lib/db/schema";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import type { Exercise } from "@/lib/data/zod-schemas";
import { FSRS_CONFIG } from "@/lib/srs/config";
import { useSession } from "@/lib/stores/session";
import { tagLabel } from "@/lib/db/tags";
import b1Data from "@/lib/data/blocks/b1.json";
import b2Data from "@/lib/data/blocks/b2.json";
import b3Data from "@/lib/data/blocks/b3.json";
import b4Data from "@/lib/data/blocks/b4.json";
import b5Data from "@/lib/data/blocks/b5.json";
import b6Data from "@/lib/data/blocks/b6.json";
import b7Data from "@/lib/data/blocks/b7.json";
import b8Data from "@/lib/data/blocks/b8.json";
import b10Data from "@/lib/data/blocks/b10.json";

const ALL_BLOCK_DATA: unknown[] = [
  ...(b1Data as unknown[]),
  ...(b2Data as unknown[]),
  ...(b3Data as unknown[]),
  ...(b4Data as unknown[]),
  ...(b5Data as unknown[]),
  ...(b6Data as unknown[]),
  ...(b7Data as unknown[]),
  ...(b8Data as unknown[]),
  ...(b10Data as unknown[]),
];

// Next.js 16 requires useSearchParams() to be wrapped in a Suspense boundary
// for the page to remain prerenderable. We split the page into an inner
// component (the only consumer of useSearchParams) and a thin outer wrapper
// that exports the Suspense shell. See:
// node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md
function ReviewPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const activeTags = (search.get("tags") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [split, setSplit] = useState<{ review: number; newCards: number } | null>(null);
  const [done, setDone] = useState<{ reviewed: number; correct: number } | null>(null);
  // Guard against React 19 StrictMode double-running this effect in dev.
  const sessionCreated = useRef(false);

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
          router.replace("/learn");
          return;
        }

        const byId = new Map((ALL_BLOCK_DATA as Exercise[]).map((e) => [e.id, e]));
        const ordered: Exercise[] = [];
        for (const card of due) {
          const ex = byId.get(card.id);
          if (ex) ordered.push(ex);
        }
        if (ordered.length === 0) {
          router.replace("/learn");
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
  }, [router, activeTags.length, activeTags.join(",")]);

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
        <button onClick={() => router.push("/learn")} className="px-4 py-2 border border-border rounded-md">
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
          <button onClick={() => router.push("/blocks")} className="px-4 py-2 border border-border rounded-md">
            Ver bloques
          </button>
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-primary text-fg rounded-md">
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
      <ExerciseRunner
        exercises={exercises}
        blockId={0}
        lessonId="daily-review"
        onFinish={setDone}
      />
    </div>
  );
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
