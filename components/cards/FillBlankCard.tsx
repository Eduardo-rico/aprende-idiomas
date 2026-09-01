// components/cards/FillBlankCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { answersMatchCard } from "@/lib/exercises/normalize";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }

/** Un hueco se acepta por su respuesta o por una de SUS alternativas —
 *  nunca por la de otro hueco. La v1 validaba con `blanks.some(...)`
 *  sobre un único input, así que en un ejercicio de tres huecos bastaba
 *  acertar el más fácil para puntuar correcto: 33 ejercicios del corpus
 *  tienen más de uno. No era cosmético — el acierto entra en el FSRS y
 *  subía el mastery de un punto que el alumno no había demostrado. */
const aciertaHueco = (b: { answer: string; alternatives?: string[] }, valor: string) =>
  // Comparaba en crudo. Aquí el signo final no aparece —las respuestas de
  // hueco son palabras— pero sí faltaban la normalización NFC y el
  // recorte de la CLAVE: un acento descompuesto o un espacio sobrante en
  // el JSON suspendían a quien había acertado. Es el mismo agujero que
  // `TranslationCard` tenía en 560 ítems.
  answersMatchCard(valor, b.answer) ||
  (b.alternatives ?? []).some((a) => answersMatchCard(valor, a));

/** El ancho del input es CONSTANTE a propósito. Estaba calculado sobre
 *  `answer.length`, así que la caja se ensanchaba con la respuesta y
 *  filtraba cuántas letras tiene: un atajo del runner, no del contenido —
 *  el alumno que no sabe la forma puede descartar candidatas por el
 *  tamaño de la caja. */
const ANCHO_INPUT = 12;

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
  // LA PISTA. El esquema la acepta desde siempre y la tarjeta no la
  // pintaba nunca: de los 417 `fill_blank` publicados, CERO usan
  // `hintEs`, porque la convención de facto acabó siendo meterla entre
  // paréntesis dentro de la frase. Un campo que el esquema valida, que
  // un autor rellena de buena fe y que el alumno no ve, no es una
  // funcionalidad a medias: es una que no existe, y en silencio.
  const pista = typeof data.hintEs === "string" ? data.hintEs.trim() : "";
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
                    size={ANCHO_INPUT}
                    className="mx-1 border-b-2 border-border bg-background text-center focus:border-primary focus:outline-none"
                  />
            )}
          </span>
        ))}
      </div>
      {pista && (
        <p data-testid="pista" className="text-center text-sm text-muted-foreground italic">
          {pista}
        </p>
      )}
      {!revealed ? (
        <button onClick={submit} className="w-full px-4 py-2 bg-primary rounded-md font-medium" disabled={!completo}>OK</button>
      ) : (
        <div className="text-center text-sm">
          {blanks.length > 1 ? "Respuestas correctas: " : "Respuesta correcta: "}
          <span className="font-mono">{blanks.map((b) => b.answer).join(" · ")}</span>
          {/* Si el alumno acertó con una ALTERNATIVA declarada, la
              tarjeta le enseñaba otra palabra distinta de la que había
              escrito y que también era buena: puntuaba bien y explicaba
              mal. */}
          {blanks.some((b) => (b.alternatives ?? []).length > 0) && (
            <span className="block text-xs text-muted-foreground">
              También válido:{" "}
              <span className="font-mono">
                {blanks.flatMap((b) => b.alternatives ?? []).join(" · ")}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
