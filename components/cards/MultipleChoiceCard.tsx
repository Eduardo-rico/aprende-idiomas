// components/cards/MultipleChoiceCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { OptionsGrid } from "./OptionsGrid";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function MultipleChoiceCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { question: string; options: string[]; correctIndex: number; explanationEs: string };
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => { if (picked !== null) return; setPicked(i); onSubmit(d.options[i] ?? "", i === d.correctIndex); };
  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xl text-center">{d.question}</div>
      <OptionsGrid options={d.options} onPick={pick} disabled={picked !== null} />
      {picked !== null && (
        <div className="text-center text-sm text-muted-foreground">{d.explanationEs}</div>
      )}
    </div>
  );
}
