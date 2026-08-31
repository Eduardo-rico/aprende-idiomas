// components/cards/FillBlankCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }

/** Un hueco se acepta por su respuesta o por una de SUS alternativas —
 *  nunca por la de otro hueco. La v1 validaba con `blanks.some(...)`
 *  sobre un único input, así que en un ejercicio de tres huecos bastaba
 *  acertar el más fácil para puntuar correcto: 33 ejercicios del corpus
 *  tienen más de uno. No era cosmético — el acierto entra en el FSRS y
 *  subía el mastery de un punto que el alumno no había demostrado. */
const aciertaHueco = (b: { answer: string; alternatives?: string[] }, valor: string) => {
  const v = valor.trim().toLowerCase();
  return b.answer.toLowerCase() === v || (b.alternatives ?? []).some((a) => a.toLowerCase() === v);
};

export function FillBlankCard({ ex, onSubmit }: Props) {
  // CRITICAL FIX: import useSettings directly, no require() wrapper.
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const blanks = data.blanks ?? [];
  const [valores, setValores] = useState<string[]>(() => blanks.map(() => ""));
  const [revealed, setRevealed] = useState(false);

  // La frase se parte por los «___» para intercalar un input en cada
  // posición: así el alumno ve QUÉ hueco está rellenando, que con un solo
  // input tampoco se sabía.
  const trozos = String(data.sentence ?? "").split("___");
  const completo = blanks.length > 0 && valores.every((v) => v.trim().length > 0);

  const submit = () => {
    if (!completo) return;
    const ok = blanks.every((b, i) => aciertaHueco(b, valores[i] ?? ""));
    setRevealed(true);
    onSubmit(valores.join(" · "), ok);
  };

  const set = (i: number, v: string) => setValores((prev) => prev.map((x, j) => (j === i ? v : x)));

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xl text-center font-mono leading-loose">
        {trozos.map((t, i) => (
          <span key={i}>
            {t}
            {i < trozos.length - 1 && (
              revealed
                ? <span className="px-1 underline underline-offset-4">{blanks[i]?.answer ?? "___"}</span>
                : <input
                    autoFocus={i === 0}
                    aria-label={`Hueco ${i + 1} de ${trozos.length - 1}`}
                    value={valores[i] ?? ""}
                    onChange={(e) => set(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && completo) submit(); }}
                    size={Math.max(6, (blanks[i]?.answer ?? "").length)}
                    className="mx-1 border-b-2 border-border bg-background text-center focus:border-primary focus:outline-none"
                  />
            )}
          </span>
        ))}
      </div>
      {!revealed ? (
        <button onClick={submit} className="w-full px-4 py-2 bg-primary rounded-md font-medium" disabled={!completo}>OK</button>
      ) : (
        <div className="text-center text-sm">
          {blanks.length > 1 ? "Respuestas correctas: " : "Respuesta correcta: "}
          <span className="font-mono">{blanks.map((b) => b.answer).join(" · ")}</span>
        </div>
      )}
    </div>
  );
}
