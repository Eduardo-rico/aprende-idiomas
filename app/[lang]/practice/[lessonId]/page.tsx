// app/[lang]/practice/[lessonId]/page.tsx
"use client";
import { use, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrCreateCard } from "@/lib/db/repository";
import { db } from "@/lib/db/schema";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { LessonGate } from "@/components/lessons/LessonGate";
import { ExerciseSchema, type Exercise } from "@/lib/data/zod-schemas";
import { useSession } from "@/lib/stores/session";
import { useSettings } from "@/lib/stores/settings";
import type { Lesson } from "@/lib/data/curriculum-types";
import { hasLocale, type LanguageId } from "@/lib/locales";

export default function PracticePage({ params }: { params: Promise<{ lang: string; lessonId: string }> }) {
  const { lang: rawLang, lessonId: rawLessonId } = use(params);
  // The lang layout validated the param via hasLocale before this page
  // mounted. The fallback to "pt" is defensive only — if the lang
  // doesn't exist, the layout would have already redirected.
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : "pt";
  const router = useRouter();
  const { localPracticeFilter } = useSettings();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reviewed: number; correct: number } | null>(null);
  // Guard against React 19 StrictMode double-running this effect in dev,
  // which would create two sessions.
  const sessionCreated = useRef(false);

  // Resuelve la lección via /api/curriculum.
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/curriculum?lang=${lang}`);
      if (!res.ok) return;
      const { lessons } = (await res.json()) as { lessons: Record<string, Lesson> };
      setLesson(lessons[rawLessonId] ?? null);
    })();
  }, [lang, rawLessonId]);

  useEffect(() => {
    if (!lesson) return;
    if (sessionCreated.current) return;
    sessionCreated.current = true;
    (async () => {
      try {
        const blockId = lesson.blockId;
        const lessonId = lesson.id;
        const blockRes = await fetch(`/api/blocks?lang=${lang}&blockId=${blockId}`);
        if (!blockRes.ok) {
          throw new Error(`No data for block ${blockId} (B9 is freeDrill — see /drill/vocab).)`);
        }
        const { exercises: blockExercises } = (await blockRes.json()) as { exercises: Exercise[] };
        const raw = blockExercises.filter((e) => e.lessonId === lessonId);
        // Ensure every card row exists so we can read its state / nextReviewAt.
        for (const e of raw) {
          await getOrCreateCard(e.id, e.blockId, e.lessonId);
        }
        // If the feature flag is on, drop cards that are not due (state>0 and
        // nextReviewAt > now). Brand-new cards (state===0) and overdue review
        // cards stay in the queue. Cards scheduled for the future are hidden
        // and counted for the "X más disponibles más tarde" hint.
        let playable: Exercise[] = raw;
        let hidden = 0;
        if (localPracticeFilter) {
          const now = new Date();
          // Batch read all card rows in one IndexedDB round-trip, then filter
          // in memory — avoids an N+1 sequence of getCardById awaits.
          const ids = raw.map((e) => e.id);
          const cards = await db.cards.bulkGet(ids);
          const byId = new Map(ids.map((id, i) => [id, cards[i]]));
          const kept: Exercise[] = [];
          for (const e of raw) {
            const card = byId.get(e.id);
            if (!card) { kept.push(e); continue; }
            if (card.state === 0 || card.nextReviewAt.getTime() <= now.getTime()) {
              kept.push(e);
            } else {
              hidden++;
            }
          }
          playable = kept;
        }
        const validated = playable.map((e) => ExerciseSchema.parse(e));
        setExercises(validated);
        setHiddenCount(hidden);

        // CRITICAL FIX (C9): if session creation fails, surface it — never run
        // the session with sessionId undefined (answers would be dropped).
        const sid = await db.sessions.add({
          startedAt: new Date(), blockId, lessonId, mode: "lesson", cardsReviewed: 0, correctCount: 0, durationMs: 0,
        });
        setSessionId(sid as number);
        useSession.getState().beginSession(sid as number, "lesson");
      } catch (err) {
        setSessionError(err instanceof Error ? err.message : String(err));
      }
    })();
  }, [lesson, lang, localPracticeFilter]);

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
        <button onClick={() => router.push(`/${lang}/blocks`)} className="px-4 py-2 border border-border rounded-md">Volver a bloques</button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((done.correct / Math.max(done.reviewed, 1)) * 100);
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-4xl">¡Sesión completa!</h1>
        <div className="text-6xl font-display">{pct}%</div>
        <p className="text-muted">{done.correct} de {done.reviewed} correctas</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => router.push(`/${lang}/blocks`)} className="px-4 py-2 border border-border rounded-md">Volver a bloques</button>
          <button onClick={() => router.push(`/${lang}`)} className="px-4 py-2 bg-primary rounded-md">Inicio</button>
        </div>
      </div>
    );
  }

  if (!exercises || !sessionId || !lesson) {
    return <div className="p-12 text-center text-muted">Cargando...</div>;
  }

  return (
    <div>
      {localPracticeFilter && hiddenCount > 0 && (
        <div className="max-w-xl mx-auto px-4 pt-6">
          <p className="text-xs text-muted">
            {hiddenCount} tarjeta{hiddenCount === 1 ? "" : "s"} más disponible{hiddenCount === 1 ? "" : "s"} más tarde
          </p>
        </div>
      )}
      {/* L5: LessonGate decides whether to show the lesson (first time
          or last view > 1h ago) or skip straight to practice. The gate
          accepts `children` once it has decided the user is "fresh";
          we wrap the ExerciseRunner so the gate renders the lesson
          step OR the runner — never both. */}
      <LessonGate
        lessonId={lesson.id}
        mdxPath={lesson.conceptNotesPath}
        lang={lang}
      >
        <ExerciseRunner
          exercises={exercises}
          blockId={lesson.blockId}
          lessonId={lesson.id}
          onFinish={setDone}
          lang={lang}
        />
      </LessonGate>
    </div>
  );
}
