// app/practice/[lessonId]/page.tsx
"use client";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLesson } from "@/lib/data/curriculum";
import { getOrCreateCard } from "@/lib/db/repository";
import { db } from "@/lib/db/schema";
import { ExerciseRunner } from "@/components/ExerciseRunner";
// CRITICAL FIX (I1): static imports — no dynamic import() of modules already in the graph.
import { ExerciseSchema, type Exercise } from "@/lib/data/zod-schemas";
import { useSession } from "@/lib/stores/session";
import { useSettings } from "@/lib/stores/settings";
// CRITICAL FIX (I-Turbopack): static JSON import — template-literal dynamic
// import of JSON breaks under Turbopack production builds.
import b1Data from "@/lib/data/blocks/b1.json";
import b2Data from "@/lib/data/blocks/b2.json";
import b3Data from "@/lib/data/blocks/b3.json";
import b4Data from "@/lib/data/blocks/b4.json";
import b5Data from "@/lib/data/blocks/b5.json";
import b6Data from "@/lib/data/blocks/b6.json";
import b7Data from "@/lib/data/blocks/b7.json";
import b8Data from "@/lib/data/blocks/b8.json";
import b10Data from "@/lib/data/blocks/b10.json";

const BLOCK_DATA: Record<number, unknown[]> = {
  1: b1Data as unknown[],
  2: b2Data as unknown[],
  3: b3Data as unknown[],
  4: b4Data as unknown[],
  5: b5Data as unknown[],
  6: b6Data as unknown[],
  7: b7Data as unknown[],
  8: b8Data as unknown[],
  10: b10Data as unknown[],
};

export default function PracticePage({ params }: { params: Promise<{ lessonId: string }> }) {
  // CRITICAL FIX (C5-pattern): React.use(params), not params.then + useState.
  const { lessonId: rawLessonId } = use(params);
  const lesson = getLesson(rawLessonId);
  const lessonId = lesson.id;
  const blockId = lesson.blockId;
  const { localPracticeFilter } = useSettings();

  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reviewed: number; correct: number } | null>(null);
  const router = useRouter();
  // Guard against React 19 StrictMode double-running this effect in dev,
  // which would create two sessions.
  const sessionCreated = useRef(false);

  useEffect(() => {
    if (sessionCreated.current) return;
    sessionCreated.current = true;
    (async () => {
      try {
        const blockData = BLOCK_DATA[blockId];
        if (!blockData) throw new Error(`No data for block ${blockId} (B9 is freeDrill — see /drill/vocab).)`);
        const raw = (blockData as Exercise[]).filter((e) => e.lessonId === lessonId);
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
  }, [lessonId, blockId, localPracticeFilter]);

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
        <button onClick={() => router.push("/blocks")} className="px-4 py-2 border border-border rounded-md">Volver a bloques</button>
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
          <button onClick={() => router.push("/blocks")} className="px-4 py-2 border border-border rounded-md">Volver a bloques</button>
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-primary rounded-md">Inicio</button>
        </div>
      </div>
    );
  }

  if (!exercises || !sessionId || !lessonId || blockId === null) {
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
      <ExerciseRunner exercises={exercises} blockId={blockId} lessonId={lessonId} onFinish={setDone} />
    </div>
  );
}
