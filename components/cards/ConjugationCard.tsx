// components/cards/ConjugationCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { answersMatch } from "@/lib/exercises/normalize";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ConjugationCard({ ex, onSubmit }: Props) {
  // E9: variant-aware — a pt-pt form (e.g. `falas`) lives in
  // variantOverrides["pt-pt"].answer and resolveExerciseData picks it up.
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { infinitive: string; person: string; tense: string; answer: string; hintEs: string };
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const submit = () => { const ok = answersMatch(input, d.answer); setRevealed(true); onSubmit(input, ok); };
  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-center space-y-1">
        <div className="text-2xl font-medium">{d.infinitive}</div>
        <div className="text-sm text-muted-foreground">{d.person} · {d.tense}</div>
        <div className="text-xs text-muted-foreground">({d.hintEs})</div>
      </div>
      {!revealed ? (
        <div className="flex gap-2">
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) submit(); }}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background" placeholder="Forma conjugada" />
          <button onClick={submit} disabled={!input.trim()} className="px-4 py-2 bg-primary rounded-md font-medium">OK</button>
        </div>
      ) : (
        <div className="text-center text-sm">Correcto: <span className="font-medium">{d.answer}</span></div>
      )}
    </div>
  );
}
