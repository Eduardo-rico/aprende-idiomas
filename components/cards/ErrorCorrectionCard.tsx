// components/cards/ErrorCorrectionCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { answersMatchFinal } from "@/lib/exercises/normalize";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ErrorCorrectionCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant) as { sentence: string; correct: string; explanationEs: string };
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const submit = () => { // `answersMatchFinal`: su `correct` es una FRASE ENTERA, así que
    // tenía el mismo agujero del punto final que las otras tres tarjetas.
    const ok = answersMatchFinal(input, data.correct); setRevealed(true); onSubmit(input, ok); };
  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-sm text-muted-foreground text-center">Corrige el error:</div>
      <div className="text-xl text-center">{data.sentence}</div>
      {!revealed ? (
        <div className="flex gap-2">
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) submit(); }}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background" placeholder="Frase corregida" />
          <button onClick={submit} disabled={!input.trim()} className="px-4 py-2 bg-primary rounded-md font-medium">OK</button>
        </div>
      ) : (
        <div className="text-center text-sm space-y-1">
          <div>Correcto: <span className="font-medium">{data.correct}</span></div>
          <div className="text-muted-foreground">{data.explanationEs}</div>
        </div>
      )}
    </div>
  );
}
