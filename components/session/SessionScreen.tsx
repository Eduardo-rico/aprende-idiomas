// components/session/SessionScreen.tsx
// Orchestrator for the SRS session: wires the chrome (TopBar + Head +
// CardDisplay + GradePanel + Footer), manages the card index + reveal
// state + counters, and connects useSessionTimer + useGradeKeyboard.
// For A.3 the session tracks reviewed/correct totals and writes them
// to Dexie at session close (handled by the page). Per-card FSRS
// grading (submitAnswer) lands in a follow-up; the existing
// ExerciseRunner keeps owning that machinery elsewhere. See
// task-A.3-report.md concerns.
"use client";
import { useCallback, useState } from "react";
import type { Exercise } from "@/lib/data/zod-schemas";
import type { LanguageId } from "@/lib/locales";
import { useSessionTimer } from "@/lib/hooks/useSessionTimer";
import { useGradeKeyboard, type GradeRating } from "@/lib/hooks/useGradeKeyboard";
import { SessionTopBar } from "./SessionTopBar";
import { ExerciseHead } from "./ExerciseHead";
import { SessionCardDisplay } from "./SessionCardDisplay";
import { GradePanel } from "./GradePanel";
import { SessionFooter } from "./SessionFooter";

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

// Placeholder intervals shown in the grade panel BEFORE grading. After
// grade, the parent page rewrites the row in Dexie via submitAnswer
// (per-card FSRS writes land in a follow-up). These are the values
// shown while the user is staring at the card.
const PLACEHOLDER_INTERVALS_MS = {
  again: 60_000,
  hard: 2 * 86_400_000,
  good: 4 * 86_400_000,
  easy: 9 * 86_400_000,
};

export function SessionScreen({
  exercises,
  onFinish,
  onClose,
  lang,
}: {
  exercises: Exercise[];
  onFinish: (stats: { reviewed: number; correct: number }) => void;
  onClose: () => void;
  lang: LanguageId;
}) {
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { label: timerLabel } = useSessionTimer(Date.now());

  const ex = exercises[idx];
  const total = exercises.length;
  const remaining = Math.max(0, total - idx - (reveal ? 0 : 1));

  const handleGrade = useCallback(
    (rating: GradeRating) => {
      if (!ex) return;
      const wasCorrect = rating >= 3;
      const nextReviewed = reviewed + 1;
      const nextCorrect = correct + (wasCorrect ? 1 : 0);
      setReveal(false);
      setReviewed(nextReviewed);
      setCorrect(nextCorrect);
      const next = idx + 1;
      if (next >= total) {
        onFinish({ reviewed: nextReviewed, correct: nextCorrect });
        return;
      }
      setIdx(next);
    },
    [ex, idx, total, reviewed, correct, onFinish],
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
          intervals={PLACEHOLDER_INTERVALS_MS}
        />
      </main>
      <SessionFooter remaining={remaining} />
    </div>
  );
}
