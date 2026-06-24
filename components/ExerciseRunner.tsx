// components/ExerciseRunner.tsx
"use client";
import { useState, useEffect } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { FlashcardCard } from "./cards/FlashcardCard";
import { FillBlankCard } from "./cards/FillBlankCard";
import { ListeningCard } from "./cards/ListeningCard";
import { TranslationCard } from "./cards/TranslationCard";
import { VerbPrepositionCard } from "./cards/VerbPrepositionCard";
import { ErrorCorrectionCard } from "./cards/ErrorCorrectionCard";
import { ConjugationCard } from "./cards/ConjugationCard";
import { MultipleChoiceCard } from "./cards/MultipleChoiceCard";
import { LessonStep } from "./lessons/LessonStep";
import { submitAnswer, getCardById, resetLeechCard } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";
import { useSession } from "@/lib/stores/session";
import confetti from "canvas-confetti";
import { RATING, type Card } from "@/lib/db/schema";
import { nextIntervalMs, formatInterval } from "@/lib/srs/intervals";
import { isLeech } from "@/lib/srs/leeches";

interface Props {
  exercises: Exercise[];
  blockId: number;
  lessonId: string;
  onFinish: (stats: { reviewed: number; correct: number }) => void;
  /** Target language for any lesson-type exercises rendered inside the
   *  runner. Required when `exercises` includes a `lesson` type entry —
   *  the runner pipes this through to <LessonStep> so the standalone
   *  lesson navigation matches the URL the user is on. Optional for
   *  runners that never see lesson exercises (daily review). */
  lang?: import("@/lib/locales").LanguageId;
}

/** Local view-state: the user has answered a non-flashcard exercise and is
 *  being asked to grade themselves on a 4-button scale. The runner does NOT
 *  auto-advance after a correct/incorrect answer — it waits for the grade. */
interface PendingGrade {
  correct: boolean;
}

export function ExerciseRunner({ exercises, blockId, lessonId, onFinish, lang }: Props) {
  const { variant } = useSettings();
  const { sessionId, mode, incrCorrect } = useSession();
  const [idx, setIdx] = useState(0);
  const [shownAt, setShownAt] = useState<number>(Date.now());
  const [stats, setStats] = useState({ reviewed: 0, correct: 0 });
  // Set after each grade so the runner can show "Próxima: en 3 días".
  // Cleared when the next card is shown.
  const [lastInterval, setLastInterval] = useState<string | null>(null);
  // For non-flashcard exercises: holds the answer result while the user is
  // picking a 4-button grade. null = no pending grade, advance immediately.
  const [pending, setPending] = useState<PendingGrade | null>(null);
  // Leech state for the current card: when the underlying row is a leech
  // (lapses >= threshold) we render a "🐛 Leech" badge that the user can
  // tap to reset the card.
  const [leechCard, setLeechCard] = useState<Card | null>(null);
  const [showLeechModal, setShowLeechModal] = useState(false);
  const ex = exercises[idx];

  useEffect(() => {
    if (!ex) return;
    setShownAt(Date.now());
    setLastInterval(null);
    setPending(null);
    let cancelled = false;
    (async () => {
      const card = await getCardById(ex.id);
      if (cancelled) return;
      setLeechCard(card && isLeech(card) ? card : null);
    })();
    return () => { cancelled = true; };
  }, [ex?.id]);

  // CRITICAL FIX (C8): onFinish in useEffect, not in render (side-effect in
  // render causes infinite loop with parent setState).
  useEffect(() => {
    if (!ex && exercises.length > 0) {
      onFinish(stats);
    }
  }, [ex, exercises.length, stats, onFinish]);

  // Grade-panel keyboard: 1/2/3/4 maps to Again/Hard/Good/Easy. We use the
  // same numeric keys as the flashcard branch so the user has one muscle
  // memory for the whole app.
  useEffect(() => {
    if (!pending) return;
    const handler = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        grade(Number(e.key) as 1 | 2 | 3 | 4);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // grade() closes over ex/sessionId/stats; depending on it would re-bind
    // the listener on every keystroke. The runner re-renders rarely enough
    // that excluding it is safe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  if (!ex) return null;

  // CRITICAL FIX (C9): sessionId must be valid — caller (PracticePage)
  // guarantees it, but we fail loudly instead of silently dropping answers.
  const grade = async (rating: 1 | 2 | 3 | 4) => {
    if (!sessionId) {
      console.error("ExerciseRunner: no sessionId — answer dropped. PracticePage must create session before render.");
      return;
    }
    const now = Date.now();
    const updated = await submitAnswer({
      cardId: ex.id, rating, responseMs: now - shownAt,
      mode: mode || "lesson", variant, conceptIds: ex.concepts, blockId, sessionId,
    });
    const correct = rating >= 3;
    incrCorrect(correct);
    setStats(s => ({ reviewed: s.reviewed + 1, correct: s.correct + (correct ? 1 : 0) }));
    setLastInterval(formatInterval(nextIntervalMs(updated, new Date(now))));
    // If the grade pushed the card into leech territory, surface the badge
    // so the user can decide to reset on the next card.
    if (isLeech(updated)) setLeechCard(updated);
    if (correct) confetti({ particleCount: 50, spread: 70 });
    setPending(null);
    setIdx(i => i + 1);
  };

  // Non-flashcard flow: capture the answer, show 4 buttons, wait for grade.
  const handleAnswer = (_answer: string, correct: boolean) => {
    setPending({ correct });
  };

  const onConfirmReset = async () => {
    if (!leechCard) return;
    await resetLeechCard(leechCard.id);
    setLeechCard(null);
    setShowLeechModal(false);
  };

  const isFlashcard = ex.type === "flashcard";
  const isLesson = ex.type === "lesson";

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{idx + 1} / {exercises.length}</span>
        <div className="flex items-center gap-3">
          {lastInterval && <span>Próxima: {lastInterval}</span>}
          {leechCard && (
            <button
              onClick={() => setShowLeechModal(true)}
              className="px-2 py-1 text-xs border border-destructive text-destructive rounded-md hover:bg-destructive/10"
              title={`Esta tarjeta se te resiste (${leechCard.lapses} lapses). Toca para resetear.`}
            >
              🐛 Leech
            </button>
          )}
        </div>
      </div>
      {isLesson
        ? (
          // Lesson exercises render the MDX content + "Continuar a
          // ejercicios →" button via LessonStep. The button navigates
          // to /practice/:lang/:lessonId; once we land there the
          // runner picks up at idx+1 (the lesson counts toward the
          // total but doesn't require a grade). The grade path is
          // never entered for a lesson.
          //
          // L5: lang is now plumbed in as a prop instead of being
          // hardcoded — the runner is reused by /review (which doesn't
          // hit the lesson branch, but the prop keeps the type honest)
          // and by /practice which DOES.
          <LessonStep
            lessonId={ex.data.lessonId}
            mdxPath={ex.data.mdxPath}
            lang={lang ?? ("pt" as import("@/lib/locales").LanguageId)}
          />
        )
        : isFlashcard
          ? <FlashcardWithGrades ex={ex} onGrade={grade} />
          : (
            <div className="space-y-4">
              <AnswerableCard ex={ex} onAnswer={handleAnswer} />
              {pending && <GradePanel pending={pending} onGrade={grade} />}
            </div>
          )
      }
      {showLeechModal && leechCard && (
        <LeechResetModal
          lapses={leechCard.lapses}
          onCancel={() => setShowLeechModal(false)}
          onConfirm={onConfirmReset}
        />
      )}
    </div>
  );
}

function FlashcardWithGrades({ ex, onGrade }: { ex: Exercise; onGrade: (r: 1 | 2 | 3 | 4) => void }) {
  const [revealed, setRevealed] = useState(false);

  // CRITICAL FIX (C5): keyboard handler lives here with direct state access —
  // no DOM getElementById lookup, no isPending key mismatch.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " && !revealed) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        onGrade(Number(e.key) as 1 | 2 | 3 | 4);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [revealed, onGrade]);

  // Reset reveal state when exercise changes.
  useEffect(() => { setRevealed(false); }, [ex.id]);

  return (
    <div className="space-y-4">
      <FlashcardCard ex={ex} revealed={revealed} onReveal={() => setRevealed(true)} />
      {revealed && (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-sm">
            {([["Otra vez", 1], ["Difícil", 2], ["Bien", 3], ["Fácil", 4]] as [string, 1 | 2 | 3 | 4][]).map(([label, rating]) => (
              <button
                key={rating}
                onClick={() => onGrade(rating)}
                className="p-3 border-2 border-border rounded-md hover:border-primary"
              >
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted">[{rating}]</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted text-center">Espacio para mostrar · 1/2/3/4 para calificar</p>
        </div>
      )}
    </div>
  );
}

/** Renders the right card by exercise type and routes the user's typed
 *  answer back to the runner. Flashcards are NOT routed through this —
 *  they keep their "reveal → 4 buttons" flow because there is no typed
 *  answer to grade. */
function AnswerableCard({
  ex,
  onAnswer,
}: {
  ex: Exercise;
  onAnswer: (answer: string, correct: boolean) => void;
}) {
  if (ex.type === "fill_blank") return <FillBlankCard ex={ex} onSubmit={onAnswer} />;
  if (ex.type === "listening") return <ListeningCard ex={ex} onSubmit={onAnswer} />;
  if (ex.type === "translation")
    return <TranslationCard ex={ex} onSubmit={onAnswer} />;
  if (ex.type === "verb_preposition") return <VerbPrepositionCard ex={ex} onSubmit={onAnswer} />;
  if (ex.type === "error_correction") return <ErrorCorrectionCard ex={ex} onSubmit={onAnswer} />;
  if (ex.type === "conjugation") return <ConjugationCard ex={ex} onSubmit={onAnswer} />;
  if (ex.type === "multiple_choice") return <MultipleChoiceCard ex={ex} onSubmit={onAnswer} />;
  return null;
}

/** The 4-button grade panel shown after a non-flashcard answer. Shows
 *  ✓ Correcto / ✗ Incorrecto so the user knows the runner caught their
 *  answer correctly, and then asks them to grade how EASY/HARD it felt. */
function GradePanel({
  pending,
  onGrade,
}: {
  pending: PendingGrade;
  onGrade: (r: 1 | 2 | 3 | 4) => void;
}) {
  return (
    <div className="space-y-2">
      <div className={`text-center font-medium ${pending.correct ? "text-green-600" : "text-destructive"}`}>
        {pending.correct ? "✓ Correcto" : "✗ Incorrecto"}
      </div>
      <p className="text-xs text-muted text-center">Califica qué tan fácil fue</p>
      <div className="grid grid-cols-4 gap-2 text-sm">
        {([["Otra vez", 1], ["Difícil", 2], ["Bien", 3], ["Fácil", 4]] as [string, 1 | 2 | 3 | 4][]).map(([label, rating]) => (
          <button
            key={rating}
            onClick={() => onGrade(rating)}
            className="p-3 border-2 border-border rounded-md hover:border-primary"
          >
            <div className="font-medium">{label}</div>
            <div className="text-xs text-muted">[{rating}]</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LeechResetModal({
  lapses,
  onCancel,
  onConfirm,
}: {
  lapses: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-background border border-border rounded-xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl">🐛 Tarjeta difícil</h2>
        <p className="text-sm text-muted">
          Esta tarjeta se te resiste ({lapses} veces fallida en repaso).
          ¿Quieres resetearla y volver a aprenderla desde cero?
        </p>
        <p className="text-xs text-muted">
          Tus contadores vuelven a 0, pero el progreso de conceptos y racha se conserva.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-md text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-destructive text-fg rounded-md text-sm"
          >
            Resetear
          </button>
        </div>
      </div>
    </div>
  );
}
