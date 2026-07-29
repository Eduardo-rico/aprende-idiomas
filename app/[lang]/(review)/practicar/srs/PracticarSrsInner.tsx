// app/[lang]/practicar/srs/PracticarSrsInner.tsx
// Client island for the /practicar/srs route. Loads the SRS queue
// (same logic as /review: getDueCards → interleave → resolve to
// Exercise[]), opens a Dexie session row, and renders <SessionScreen>.
// On finish: closes the session row, navigates to a "Sesión completa"
// summary card. Mirrors the data-fetching half of /review/page.tsx so
// we don't duplicate the FSRS-cap logic.
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/db/schema";
import { getDueCards, getDueCardsByTag, submitAnswer } from "@/lib/db/repository";
import { FSRS_CONFIG } from "@/lib/srs/config";
import { interleave } from "@/lib/srs/interleave";
import { previewIntervalMs } from "@/lib/srs/fsrs";
import { useSession } from "@/lib/stores/session";
import { useSettings } from "@/lib/stores/settings";
import type { Exercise } from "@/lib/data/zod-schemas";
import { SessionScreen } from "@/components/session/SessionScreen";
import type { GradeRating } from "@/lib/hooks/useGradeKeyboard";
import type { Card } from "@/lib/db/schema";
import type { LanguageId } from "@/lib/locales";
import { SessionResultCard } from "@/components/session/SessionResultCard";

export function PracticarSrsInner({ lang }: { lang: LanguageId }) {
  const router = useRouter();
  const search = useSearchParams();
  const showFatigue = useSession((s) => s.showFatigueCheck());
  const ackFatigue = useSession((s) => s.acknowledgeFatigue);
  const endSession = useSession((s) => s.endSession);
  const activeTags = (search.get("tags") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const variant = useSettings((s) => s.variant);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [done, setDone] = useState<{ reviewed: number; correct: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // Cola vacía. Antes esto hacía router.replace('/learn'), y como /learn
  // redirige a /practicar/srs con un 308, el resultado era un bucle
  // infinito — y era el estado POR DEFECTO de todo usuario nuevo, porque
  // una Dexie recién creada no tiene ninguna tarjeta vencida.
  const [sinCola, setSinCola] = useState(false);
  // Las Card de Dexie, para poder calcular los intervalos FSRS reales
  // que se enseñan en los cuatro botones.
  const cards = useRef<Map<string, Card>>(new Map());
  // Guard against React 19 StrictMode double-running this effect in dev.
  const sessionCreated = useRef(false);

  useEffect(() => {
    if (sessionCreated.current) return;
    sessionCreated.current = true;
    (async () => {
      try {
        const now = new Date();
        const options = {
          cap: FSRS_CONFIG.daily_review_cap,
          newCardsPerDay: FSRS_CONFIG.new_cards_per_day,
        };
        const due =
          activeTags.length === 0
            ? await getDueCards(now, FSRS_CONFIG.daily_review_cap, options)
            : await getDueCardsByTag(
                activeTags,
                now,
                FSRS_CONFIG.daily_review_cap,
                options,
              );
        if (due.length === 0) {
          setSinCola(true);
          return;
        }
        cards.current = new Map(due.map((c) => [c.id, c]));
        const allRes = await fetch(`/api/blocks?lang=${lang}`);
        if (!allRes.ok) throw new Error("No se pudo cargar el currículo");
        const { exercises: all } = (await allRes.json()) as {
          exercises: Exercise[];
        };
        const byId = new Map(all.map((e) => [e.id, e]));
        // Build a Map keyed by card id for O(1) lookups in the interleave callbacks.
        const cardById = new Map(due.map((c) => [c.id, c]));
        const mixed = interleave(
          due,
          (id) => cardById.get(id)?.lessonId,          // concept proxy: cards from same lesson share concepts
          (id) => cardById.get(id)?.tags?.[0] ?? "flashcard", // type proxy: first tag drives diversity
        );
        const ordered: Exercise[] = [];
        for (const c of mixed) {
          const ex = byId.get(c.id);
          if (ex) ordered.push(ex);
        }
        if (ordered.length === 0) {
          setSinCola(true);
          return;
        }
        setExercises(ordered);
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
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [router, lang, activeTags.length, activeTags.join(",")]);

  useEffect(() => {
    if (!done || !sessionId) return;
    useSession.getState().endSession();
    db.sessions.update(sessionId, {
      endedAt: new Date(),
      cardsReviewed: done.reviewed,
      correctCount: done.correct,
    });
  }, [done, sessionId]);

  // Persiste la calificación. Esto es lo que faltaba: sin ello, FSRS, los
  // eventos, la maestría por concepto y /progreso se quedaban congelados.
  const persistirGrade = useCallback(
    async (ex: Exercise, rating: GradeRating, responseMs: number) => {
      await submitAnswer({
        cardId: ex.id,
        rating,
        responseMs,
        mode: "review",
        variant,
        conceptIds: ex.concepts ?? [],
        blockId: ex.blockId,
        sessionId: sessionId ?? undefined,
      });
    },
    [variant, sessionId],
  );

  // Los intervalos REALES de esta tarjeta, no los de adorno.
  const intervalsFor = useCallback((ex: Exercise) => {
    const card = cards.current.get(ex.id);
    if (!card) return null;
    return {
      again: previewIntervalMs(card, 1),
      hard: previewIntervalMs(card, 2),
      good: previewIntervalMs(card, 3),
      easy: previewIntervalMs(card, 4),
    };
  }, []);

  if (err) {
    return (
      <SessionResultCard variant="error" message={err} />
    );
  }
  if (sinCola) {
    return (
      <SessionResultCard
        variant="empty"
        headline="Hoy no tienes nada pendiente"
        message="No hay tarjetas vencidas. Puedes seguir avanzando en el libro o dejarlo por hoy — el repaso vuelve cuando toque."
        actions={
          <>
            <button
              onClick={() => router.push(`/${lang}`)}
              className="rounded-md border border-rule-strong px-4 py-2"
            >
              Inicio
            </button>
            <button
              onClick={() => router.push(`/${lang}/libro`)}
              className="rounded-md bg-lesson px-4 py-2 text-white"
            >
              Ir al libro
            </button>
          </>
        }
      />
    );
  }
  if (done) {
    const pct = Math.round((done.correct / Math.max(done.reviewed, 1)) * 100);
    return (
      <SessionResultCard
        variant="done"
        headline="¡Sesión completa!"
        pct={pct}
        correct={done.correct}
        reviewed={done.reviewed}
        actions={
          <>
            <button
              onClick={() => router.push(`/${lang}`)}
              className="rounded-md border border-rule-strong px-4 py-2"
            >
              Inicio
            </button>
            <button
              onClick={() => router.push(`/${lang}/libro`)}
              className="rounded-md bg-lesson px-4 py-2 text-white"
            >
              Libro
            </button>
          </>
        }
      />
    );
  }
  if (!exercises) {
    return (
      <div className="p-12 text-center text-ink-muted" data-testid="session-loading">
        Cargando sesión…
      </div>
    );
  }
  return (
    <>
      {showFatigue && (
        <div className="fixed inset-x-0 top-0 z-50 bg-review text-paper px-4 py-3 text-center text-sm">
          Llevas 18 min · los intervalos ya están guardados ·{" "}
          <button
            className="underline mr-2"
            onClick={() => {
              endSession();
              router.push(`/${lang}`);
            }}
          >
            Terminar
          </button>
          <button className="underline" onClick={ackFatigue}>
            Seguir
          </button>
        </div>
      )}
      <SessionScreen
        exercises={exercises}
        onGrade={persistirGrade}
        intervalsFor={intervalsFor}
        onFinish={setDone}
        onClose={() => router.push(`/${lang}`)}
        lang={lang}
      />
    </>
  );
}
