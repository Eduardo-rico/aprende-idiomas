// components/cards/MediationCard.tsx
// Mediación (Ola B2C2-PT): fuente real (biblioteca de la Ola L) +
// consigna con destinatario + producción libre + AUTOEVALUACIÓN contra
// rúbrica. La corrección v1 es honesta: el alumno coteja su texto
// criterio a criterio contra la rúbrica y la respuesta modelo — no hay
// juez LLM fingido (esa es una decisión de producto aparte). «Correcto»
// = todos los criterios marcados; el grade de 4 botones del runner
// sigue después, como en todos los tipos.
"use client";
import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }

const ETIQUETA: Record<string, string> = {
  summarise: "Resumir",
  relay: "Transmitir",
  explain_concept: "Explicar un concepto",
  reformulate_register: "Cambiar el registro",
  cross_variety: "Entre variantes",
  synthesise_sources: "Sintetizar fuentes",
};

export function MediationCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant) as {
    sourceText: string; sourceRef?: string; mediationType: string;
    audience: string; instructionsEs: string;
    wordRange: { min: number; max: number };
    rubric: string[]; modelAnswer?: string;
  };
  const [texto, setTexto] = useState("");
  const [fase, setFase] = useState<"escribir" | "cotejar">("escribir");
  const [checks, setChecks] = useState<boolean[]>(() => data.rubric.map(() => false));

  const palabras = useMemo(() => texto.split(/\s+/).filter(Boolean).length, [texto]);
  const enRango = palabras >= data.wordRange.min && palabras <= data.wordRange.max;

  const terminarCotejo = () => {
    onSubmit(texto, checks.every(Boolean));
  };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-5">
      <div className="text-sm text-muted-foreground text-center">
        Mediación · {ETIQUETA[data.mediationType] ?? data.mediationType} · para: {data.audience}
      </div>
      <blockquote className="border-l-2 border-border pl-4 text-[15px] leading-relaxed max-h-64 overflow-y-auto">
        {data.sourceText}
      </blockquote>
      <div className="text-sm">{data.instructionsEs}</div>

      {fase === "escribir" ? (
        <>
          <textarea
            autoFocus
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            className="w-full border-2 border-border rounded-md px-3 py-2 bg-background text-[15px]"
            placeholder="Escribe aquí tu texto…"
          />
          <div className="flex items-center justify-between text-sm">
            <span className={enRango ? "text-green-600" : "text-muted-foreground"}>
              {palabras} palabras (pide {data.wordRange.min}–{data.wordRange.max})
            </span>
            <button
              onClick={() => setFase("cotejar")}
              disabled={palabras < data.wordRange.min}
              className="px-4 py-2 bg-primary rounded-md font-medium disabled:opacity-50"
            >
              Cotejar con la rúbrica
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="border-2 border-border rounded-md p-3 text-[15px] whitespace-pre-line">
            {texto}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Coteja tu texto, criterio a criterio:</div>
            {data.rubric.map((criterio, i) => (
              <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
                  className="mt-0.5"
                />
                <span>{criterio}</span>
              </label>
            ))}
          </div>
          {data.modelAnswer && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground">Ver una respuesta modelo</summary>
              <div className="mt-2 border-l-2 border-border pl-3 whitespace-pre-line">{data.modelAnswer}</div>
            </details>
          )}
          <button
            onClick={terminarCotejo}
            className="px-4 py-2 bg-primary rounded-md font-medium"
          >
            Terminar ({checks.filter(Boolean).length}/{data.rubric.length} criterios)
          </button>
        </div>
      )}
    </div>
  );
}
