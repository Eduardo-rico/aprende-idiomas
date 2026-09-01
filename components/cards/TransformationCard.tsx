// components/cards/TransformationCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { answersMatchFinal } from "@/lib/exercises/normalize";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }

/** TRANSFORMACIÓN: se da una frase y se pide la otra.
 *
 *  Tres decisiones que vienen de cicatrices de esta ola, y por eso van
 *  escritas aquí:
 *
 *  1. Pasa por `answersMatchFinal`, no por `===`. `FillBlankCard` y
 *     `TranslationCard` no lo hacen, y 563 de 1.121 respuestas del corpus
 *     exigen un diacrítico: comparar en crudo suspende a quien escribe
 *     bien sin acento en un teclado que no lo pone fácil. Y el signo
 *     FINAL de la clave es opcional: cuando la respuesta es una frase
 *     entera, el punto no es lengua — pero sólo ese signo, porque en una
 *     transformación a interrogativa el «?» sí es la respuesta.
 *  2. Acepta `alternatives`. Cuando la instrucción admite dos salidas
 *     igual de buenas, el ítem las declara — y el gate del lote obliga a
 *     que sean de verdad equivalentes.
 *  3. Al revelar, MUESTRA la respuesta y las alternativas aceptadas. El
 *     61 % del corpus no enseña su respuesta al revelarla, y un ejercicio
 *     que dice «incorrecto» sin decir qué era no enseña nada. */
export function TransformationCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as {
    source: string; instructionEs: string; answer: string;
    alternatives?: string[]; hintEs?: string;
  };
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const aceptadas = [d.answer, ...(d.alternatives ?? [])];

  const submit = () => {
    const ok = aceptadas.some((a) => answersMatchFinal(input, a));
    setRevealed(true);
    onSubmit(input, ok);
  };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <p className="text-center text-sm text-muted-foreground" data-testid="instruccion">
        {d.instructionEs}
      </p>
      <p className="text-xl text-center leading-relaxed" data-testid="fuente">{d.source}</p>
      {d.hintEs && (
        <p data-testid="pista" className="text-center text-sm text-muted-foreground italic">
          {d.hintEs}
        </p>
      )}
      {!revealed ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) submit(); }}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background"
            placeholder="Escribe la frase transformada"
          />
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="px-4 py-2 bg-primary rounded-md font-medium"
          >
            OK
          </button>
        </div>
      ) : (
        <div className="text-center text-sm space-y-1" data-testid="solucion">
          <div>Correcto: <span className="font-medium">{d.answer}</span></div>
          {(d.alternatives ?? []).length > 0 && (
            <div className="text-muted-foreground">
              También vale: {(d.alternatives ?? []).join(" · ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
