// components/cards/TranslationCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { answersMatchCard } from "@/lib/exercises/normalize";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function TranslationCard({ ex, onSubmit }: Props) {
  // CRITICAL FIX (C7): static import, no require() wrapper.
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const target = data.target ?? "";
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  // Comparaba en crudo: `target.toLowerCase() === value.trim().toLowerCase()`.
  // Tres agujeros en una línea, y los tres cobran fallos falsos que entran
  // en el FSRS:
  //   · no normalizaba a NFC, así que un acento descompuesto —lo que
  //     escribe media configuración de teclado— no casaba nunca;
  //   · no recortaba el `target`, así que un espacio en el JSON suspendía
  //     a todo el mundo;
  //   · exigía el SIGNO FINAL, y **560 de estas traducciones lo llevan**:
  //     quien traducía perfecto y no ponía el punto quedaba suspendido.
  // `answersMatchCard` cierra los tres, y hace opcional sólo el signo que
  // la clave lleva — no cualquiera, porque en una pregunta el «?» es
  // parte de la respuesta.
  const check = (value: string) =>
    answersMatchCard(value, target) ||
    (data.acceptedAlternatives?.some((a) => answersMatchCard(value, a)) ?? false);

  const submit = () => {
    setRevealed(true);
    onSubmit(input, check(input));
  };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xs text-muted uppercase">{(data.sourceLang ?? "?").toUpperCase()} → {(data.targetLang ?? "?").toUpperCase()}</div>
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
