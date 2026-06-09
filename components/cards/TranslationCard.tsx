// components/cards/TranslationCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function TranslationCard({ ex, onSubmit }: Props) {
  // CRITICAL FIX (C7): static import, no require() wrapper.
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const target = data.target ?? "";
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  const check = (value: string) =>
    target.toLowerCase() === value.trim().toLowerCase() ||
    (data.acceptedAlternatives?.some(a => a.toLowerCase() === value.trim().toLowerCase()) ?? false);

  const submit = () => {
    setRevealed(true);
    onSubmit(input, check(input));
  };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xs text-muted uppercase">{ex.type === "translation_es_pt" ? "ES → PT" : "PT → ES"}</div>
      <div className="text-xl text-center font-mono">{data.source}</div>
      {!revealed ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) submit(); }}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background"
            placeholder="Traducción"
          />
          <button onClick={submit} disabled={!input.trim()} className="px-4 py-2 bg-primary rounded-md font-medium">OK</button>
        </div>
      ) : (
        <div className="text-center text-sm">Correcta: <span className="font-mono">{target}</span></div>
      )}
    </div>
  );
}
