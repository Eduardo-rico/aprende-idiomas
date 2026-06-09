// components/cards/ListeningCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData, resolveAudioHash } from "@/lib/exercise-resolver";
import { AudioButton } from "@/components/AudioButton";
import { audioUrl } from "@/lib/audio/resolve";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ListeningCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const [answer, setAnswer] = useState<string | null>(null);
  const hash = resolveAudioHash(ex, variant);

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6 text-center">
      <div className="text-xs text-muted uppercase">Escucha y responde</div>
      <div className="flex justify-center"><AudioButton src={audioUrl(hash)} size="lg" /></div>
      <p className="text-lg">{data.question}</p>
      {data.options && (
        <div className="grid grid-cols-2 gap-2">
          {data.options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setAnswer(opt); onSubmit(opt, opt === data.answer); }}
              className={`p-3 border-2 rounded-md text-left ${answer === opt ? (opt === data.answer ? "border-accent bg-accent/10" : "border-error bg-error/10") : "border-border hover:border-primary"}`}
              disabled={answer !== null}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
