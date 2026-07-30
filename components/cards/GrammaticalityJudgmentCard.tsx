// components/cards/GrammaticalityJudgmentCard.tsx
// Juicio de gramaticalidad (Ola B2C2-PT): ¿esta frase es portugués
// bien formado? El instrumento del anti-calco — *vais a poupar*,
// *embora festejas* — donde el hueco léxico no llega. Determinista:
// la respuesta es el verdict del ítem.
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }

export function GrammaticalityJudgmentCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant) as {
    sentence: string; verdict: boolean; repair?: string; explanationEs: string;
  };
  const [choice, setChoice] = useState<boolean | null>(null);

  const judge = (v: boolean) => {
    if (choice !== null) return;
    setChoice(v);
    onSubmit(v ? "bem formada" : "mal formada", v === data.verdict);
  };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-sm text-muted-foreground text-center">
        ¿Esta frase es portugués bien formado?
      </div>
      <div className="text-xl text-center font-medium">{data.sentence}</div>
      {choice === null ? (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => judge(true)}
            className="px-5 py-2 rounded-md border-2 border-border font-medium hover:border-primary"
          >
            ✓ Está bem
          </button>
          <button
            onClick={() => judge(false)}
            className="px-5 py-2 rounded-md border-2 border-border font-medium hover:border-primary"
          >
            ✗ Está mal
          </button>
        </div>
      ) : (
        <div className="text-center text-sm space-y-2">
          <div className={choice === data.verdict ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
            {choice === data.verdict ? "Correcto" : "No —"}{" "}
            la frase está {data.verdict ? "bien formada" : "mal formada"}.
          </div>
          {!data.verdict && data.repair && (
            <div>
              Forma correcta: <span className="font-medium">{data.repair}</span>
            </div>
          )}
          <div className="text-muted-foreground">{data.explanationEs}</div>
        </div>
      )}
    </div>
  );
}
