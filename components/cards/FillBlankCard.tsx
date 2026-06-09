// components/cards/FillBlankCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function FillBlankCard({ ex, onSubmit }: Props) {
  // CRITICAL FIX: import useSettings directly, no require() wrapper.
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const blanks = data.blanks ?? [];
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  const check = (value: string) =>
    blanks.some(b =>
      b.answer.toLowerCase() === value.trim().toLowerCase() ||
      b.alternatives?.some(a => a.toLowerCase() === value.trim().toLowerCase()),
    );

  const submit = () => {
    const ok = check(input);
    setRevealed(true);
    onSubmit(input, ok);
  };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xl text-center font-mono">{data.sentence}</div>
      {!revealed ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) submit(); }}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background"
            placeholder="Resposta"
          />
          <button onClick={submit} className="px-4 py-2 bg-primary rounded-md font-medium" disabled={!input.trim()}>OK</button>
        </div>
      ) : (
        <div className="text-center text-sm">
          Respuesta correcta: <span className="font-mono">{blanks[0]?.answer}</span>
        </div>
      )}
    </div>
  );
}
