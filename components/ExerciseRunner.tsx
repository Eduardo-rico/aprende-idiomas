// components/ExerciseRunner.tsx
"use client";
import { useState, useEffect } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { FlashcardCard } from "./cards/FlashcardCard";
import { FillBlankCard } from "./cards/FillBlankCard";
import { ListeningCard } from "./cards/ListeningCard";
import { TranslationCard } from "./cards/TranslationCard";
import { VerbPrepositionCard } from "./cards/VerbPrepositionCard";
import { submitAnswer } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";
import { useSession } from "@/lib/stores/session";
import confetti from "canvas-confetti";
import { RATING } from "@/lib/db/schema";

interface Props {
  exercises: Exercise[];
  blockId: number;
  lessonId: string;
  onFinish: (stats: { reviewed: number; correct: number }) => void;
}

export function ExerciseRunner({ exercises, blockId, lessonId, onFinish }: Props) {
  const { variant } = useSettings();
  const { sessionId, mode, incrCorrect } = useSession();
  const [idx, setIdx] = useState(0);
  const [shownAt, setShownAt] = useState<number>(Date.now());
  const [stats, setStats] = useState({ reviewed: 0, correct: 0 });
  const ex = exercises[idx];

  useEffect(() => {
    if (!ex) return;
    setShownAt(Date.now());
  }, [ex?.id]);

  // CRITICAL FIX (C8): onFinish in useEffect, not in render (side-effect in
  // render causes infinite loop with parent setState).
  useEffect(() => {
    if (!ex && exercises.length > 0) {
      onFinish(stats);
    }
  }, [ex, exercises.length, stats, onFinish]);

  if (!ex) return null;

  // CRITICAL FIX (C9): sessionId must be valid — caller (PracticePage)
  // guarantees it, but we fail loudly instead of silently dropping answers.
  const submit = async (rating: 1 | 2 | 3 | 4) => {
    if (!sessionId) {
      console.error("ExerciseRunner: no sessionId — answer dropped. PracticePage must create session before render.");
      return;
    }
    await submitAnswer({
      cardId: ex.id, rating, responseMs: Date.now() - shownAt,
      mode: mode || "lesson", variant, conceptIds: ex.concepts, blockId, sessionId,
    });
    const correct = rating >= 3;
    incrCorrect(correct);
    setStats(s => ({ reviewed: s.reviewed + 1, correct: s.correct + (correct ? 1 : 0) }));
    if (correct) confetti({ particleCount: 50, spread: 70 });
    setIdx(i => i + 1);
  };

  const handleAnswer = (_answer: string, correct: boolean) =>
    submit(correct ? RATING.Good : RATING.Again);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <div className="text-sm text-muted">{idx + 1} / {exercises.length}</div>
      {ex.type === "flashcard" && <FlashcardWithGrades ex={ex} onGrade={submit} />}
      {ex.type === "fill_blank" && <FillBlankCard ex={ex} onSubmit={handleAnswer} />}
      {ex.type === "listening" && <ListeningCard ex={ex} onSubmit={handleAnswer} />}
      {(ex.type === "translation_es_pt" || ex.type === "translation_pt_es") && <TranslationCard ex={ex} onSubmit={handleAnswer} />}
      {ex.type === "verb_preposition" && <VerbPrepositionCard ex={ex} onSubmit={handleAnswer} />}
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
      )}
    </div>
  );
}
