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

  const [exercises, setExercises] = useState<Exercise[] | null>(null);
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
        const cards = await Promise.all(
          raw.map(async (e) => {
            await getOrCreateCard(e.id, e.blockId, e.lessonId);
            return ExerciseSchema.parse(e);
          })
        );
        setExercises(cards);

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
  }, [lessonId, blockId]);

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

  return <ExerciseRunner exercises={exercises} blockId={blockId} lessonId={lessonId} onFinish={setDone} />;
}
