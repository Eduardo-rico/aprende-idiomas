// components/cards/VerbPrepositionCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function VerbPrepositionCard({ ex, onSubmit }: Props) {
  // CRITICAL FIX (C7): static import, no require() wrapper.
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const options = data.options ?? [];
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6 text-center">
      <div className="text-xs text-muted uppercase">Régimen preposicional</div>
      <div className="text-sm text-muted">Verbo: <span className="font-mono">{data.verb}</span></div>
      <div className="text-xl font-mono">{data.sentence}</div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => { setAnswer(opt); onSubmit(opt, opt === data.answer); }}
            className={`p-3 border-2 rounded-md ${answer === opt ? (opt === data.answer ? "border-accent bg-accent/10" : "border-error bg-error/10") : "border-border hover:border-primary"}`}
            disabled={answer !== null}
          >
            {opt === "—" ? "(sin preposición)" : opt}
          </button>
        ))}
      </div>
    </div>
  );
}
