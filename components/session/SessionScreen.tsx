// components/session/SessionScreen.tsx
// Orchestrator for the SRS session: wires the chrome (TopBar + Head +
// CardDisplay + GradePanel + Footer), manages the card index + reveal
// state + counters, and connects useSessionTimer + useGradeKeyboard.
//
// Ola 1 (2026-07-28): la calificación por tarjeta YA SE GUARDA. Hasta
// ahora este componente sólo llevaba los totales y el comentario decía
// que el FSRS por tarjeta «lands in a follow-up» — el resultado era que
// nada de lo que el alumno respondía en el repaso diario se recordaba:
// ni intervalos, ni eventos, ni maestría por concepto, ni /progreso.
// El componente sigue siendo presentacional: recibe `onGrade` y el
// padre (PracticarSrsInner) es quien escribe en Dexie vía submitAnswer.
//
// D.9: exercises whose tags include "shadowing", "cloze", or "production"
// are dispatched to their dedicated card components which handle grading
// internally (no reveal/GradePanel step for those types).
"use client";
import { useCallback, useRef, useState } from "react";
import type { Exercise } from "@/lib/data/zod-schemas";
import type { LanguageId } from "@/lib/locales";
import { useSessionTimer } from "@/lib/hooks/useSessionTimer";
import { useGradeKeyboard, type GradeRating } from "@/lib/hooks/useGradeKeyboard";
import { useSettings } from "@/lib/stores/settings";
import { SessionTopBar } from "./SessionTopBar";
import { ExerciseHead } from "./ExerciseHead";
import { SessionCardDisplay } from "./SessionCardDisplay";
import { GradePanel } from "./GradePanel";
import { SessionFooter } from "./SessionFooter";
import { ShadowingCard } from "@/components/cards/ShadowingCard";
import { ClozeCard } from "@/components/cards/ClozeCard";
import { ProductionCard } from "@/components/cards/ProductionCard";
import clozeSeedsRaw from "@/lib/data/languages/pt/cloze-seeds.json";

const TYPE_LABEL: Record<string, string> = {
  flashcard: "Flashcard · recordar",
  listening: "Listening",
  fill_blank: "Completar",
  translation: "Traducción",
  conjugation: "Conjugación",
  error_correction: "Corrección",
  matching: "Emparejar",
  multiple_choice: "Opción múltiple",
  shadowing: "Shadowing",
  verb_preposition: "Verbo + preposición",
};

const TYPE_ACCENT: Record<string, "lesson" | "info"> = {
  shadowing: "info",
};

// Intervalos de reserva: sólo se usan si el padre no sabe calcular los
// reales (p. ej. una tarjeta que no está en Dexie todavía). Los de verdad
// llegan por `intervalsFor`, que consulta `previewIntervalMs` con el
// estado FSRS real de la tarjeta. Enseñar 1 min / 2 d / 4 d / 9 d a todo
// el mundo y para toda tarjeta convertía los cuatro botones en decoración:
// el alumno no puede calificarse con honestidad si el número que le
// enseñas no es el que va a pasar.
const INTERVALOS_DE_RESERVA = {
  again: 60_000,
  hard: 2 * 86_400_000,
  good: 4 * 86_400_000,
  easy: 9 * 86_400_000,
};

// ─── D.9: Cloze-seeds distractor lookup ────────────────────────
// Match by exact text so the correct distractors are surfaced for
// known cloze exercises. Returns [] for unknown / other-language cards.
type ClozeSeed = {
  storyId: string;
  blockId: number;
  text: string;
  answer: string;
  distractors: string[];
  variant: string;
};
const clozeSeeds = clozeSeedsRaw as ClozeSeed[];

function getClozeDistractors(text: string): string[] {
  const seed = clozeSeeds.find((s) => s.text === text);
  return seed?.distractors ?? [];
}

// ─── D.9: Safe data accessor for non-schema exercise types ─────
// Exercises with "cloze" or "production" tags do not have their own
// discriminated-union type in the schema yet; we cast data to a loose
// shape so TypeScript doesn't reject field accesses.
type LooseData = {
  text?: string;
  sentence?: string;
  front?: string;
  answer?: string;
  blanks?: Array<{ position: number; answer: string }>;
  prompt?: string;
};

export type IntervalsMs = { again: number; hard: number; good: number; easy: number };

export function SessionScreen({
  exercises,
  onFinish,
  onClose,
  lang,
  onGrade,
  intervalsFor,
}: {
  exercises: Exercise[];
  onFinish: (stats: { reviewed: number; correct: number }) => void;
  onClose: () => void;
  lang: LanguageId;
  /** Persiste la calificación. El padre lo implementa con submitAnswer().
   *  Se llama ANTES de avanzar de tarjeta, y si falla no se pierde la
   *  sesión: se registra y se sigue, porque perder la tarjeta siguiente
   *  por un error de escritura es peor que perder un intervalo. */
  onGrade?: (ex: Exercise, rating: GradeRating, responseMs: number) => void | Promise<void>;
  /** Intervalos FSRS reales de esta tarjeta. Sin esto se enseñan los de reserva. */
  intervalsFor?: (ex: Exercise) => IntervalsMs | null;
}) {
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { label: timerLabel } = useSessionTimer(Date.now());
  const { variant: settingsVariant } = useSettings();
  // Cuándo se mostró la tarjeta actual, para medir el tiempo de respuesta
  // que alimenta la métrica de automatización de /progreso.
  const shownAt = useRef<number>(Date.now());

  const ex = exercises[idx];
  const total = exercises.length;
  const remaining = Math.max(0, total - idx - (reveal ? 0 : 1));

  const handleGrade = useCallback(
    (rating: GradeRating) => {
      if (!ex) return;
      const responseMs = Math.max(0, Date.now() - shownAt.current);
      // Se dispara sin await a propósito: la escritura en Dexie no debe
      // meter latencia entre que calificas y ves la tarjeta siguiente.
      void Promise.resolve(onGrade?.(ex, rating, responseMs)).catch((e) => {
        console.error("[sesión] no se pudo guardar la calificación", ex.id, e);
      });
      const wasCorrect = rating >= 3;
      const nextReviewed = reviewed + 1;
      const nextCorrect = correct + (wasCorrect ? 1 : 0);
      setReveal(false);
      setReviewed(nextReviewed);
      setCorrect(nextCorrect);
      const next = idx + 1;
      shownAt.current = Date.now();
      if (next >= total) {
        onFinish({ reviewed: nextReviewed, correct: nextCorrect });
        return;
      }
      setIdx(next);
    },
    [ex, idx, total, reviewed, correct, onFinish, onGrade],
  );

  useGradeKeyboard({ enabled: reveal, onGrade: handleGrade });

  if (!ex) {
    return (
      <div className="p-12 text-center text-ink-muted" data-testid="session-empty">
        Sesión vacía.
      </div>
    );
  }

  const typeLabel = TYPE_LABEL[ex.type] ?? ex.type;
  const accent = TYPE_ACCENT[ex.type] ?? "lesson";
  const conceptId = ex.concepts?.[0] ?? ex.lessonId ?? ex.id;

  // ─── D.9: card type dispatch ────────────────────────────────
  // Shadowing is a first-class schema type — TypeScript narrows here.
  // Cloze and production are tag-based (no schema type yet), so we
  // cast data to LooseData to access their fields without type errors.
  const tags = ex.tags;

  let cardArea: React.ReactNode;

  if (ex.type === "shadowing") {
    // ShadowingCard owns its own audio + record + self-eval flow;
    // it calls onSubmit when the user is done grading themselves.
    cardArea = (
      <ShadowingCard
        ex={ex}
        onSubmit={(_answer: string, wasCorrect: boolean) =>
          handleGrade(wasCorrect ? 3 : 1)
        }
      />
    );
  } else if (tags.includes("cloze")) {
    const d = ex.data as unknown as LooseData;
    const clozeText = d.text ?? d.sentence ?? d.front ?? "";
    const clozeAnswer = d.answer ?? d.blanks?.[0]?.answer ?? "";
    cardArea = (
      <ClozeCard
        text={clozeText}
        answer={clozeAnswer}
        distractors={getClozeDistractors(clozeText)}
        onGrade={handleGrade}
      />
    );
  } else if (tags.includes("production")) {
    const d = ex.data as unknown as LooseData;
    const topic = d.prompt ?? d.front ?? d.text ?? d.sentence ?? "";
    // ProductionCard variant is "pt-br" | "pt-pt"; VariantKey is a string alias.
    const safeVariant: "pt-br" | "pt-pt" =
      settingsVariant === "pt-pt" ? "pt-pt" : "pt-br";
    cardArea = (
      <ProductionCard
        topic={topic}
        blockId={ex.blockId}
        variant={safeVariant}
        onDone={() => handleGrade(3)}
      />
    );
  } else {
    // Default: existing reveal-then-grade flow with SessionCardDisplay + GradePanel.
    cardArea = (
      <>
        <SessionCardDisplay
          exercise={ex}
          reveal={reveal}
          onReveal={() => setReveal(true)}
          onPlayAudio={() => {
            /* hook into AudioButton in a follow-up */
          }}
          lang={lang}
        />
        <GradePanel
          disabled={!reveal}
          onGrade={handleGrade}
          intervals={intervalsFor?.(ex) ?? INTERVALOS_DE_RESERVA}
        />
      </>
    );
  }

  return (
    <div data-testid="session-screen">
      <SessionTopBar
        progress={idx / Math.max(total, 1)}
        countLabel={`${idx + 1} / ${total}`}
        timerLabel={timerLabel}
        onClose={onClose}
      />
      <main className="mx-auto max-w-[720px] px-6 pb-10 pt-12">
        <ExerciseHead typeLabel={typeLabel} typeAccent={accent} conceptId={conceptId} />
        {cardArea}
      </main>
      <SessionFooter remaining={remaining} />
    </div>
  );
}
