"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui";

interface Props {
  text: string;       // "Vou _____ dinheiro para a viagem."
  answer: string;     // "poupar"
  distractors: string[]; // ["popar", "podar", "pular"]
  hint?: string;
  onGrade: (rating: 1 | 2 | 3 | 4) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function ClozeCard({ text, answer, distractors, hint, onGrade }: Props) {
  const [guess, setGuess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const options = useMemo(
    () => shuffle([answer, ...distractors]).slice(0, 4),
    [answer, distractors],
  );
  const correct = guess.trim().toLowerCase() === answer.toLowerCase();

  const parts = text.split("_____");
  const before = parts[0] ?? "";
  const after = parts[1] ?? "";

  return (
    <div className="bg-paper-raised border border-rule rounded-xl p-8">
      <div className="text-xs uppercase tracking-[0.07em] text-lesson bg-lesson-soft px-3 py-1.5 rounded-full inline-block mb-6 font-semibold">
        Cloze
      </div>
      <p className="font-display text-[24px] mb-6 leading-snug">
        {before}
        <span className={`inline-block min-w-[80px] border-b-2 text-center px-1 ${submitted ? (correct ? "border-lesson text-lesson" : "border-error text-error") : "border-ink-muted"}`}>
          {submitted ? (correct ? guess : answer) : (guess || " ")}
        </span>
        {after}
      </p>
      {hint && !submitted && (
        <p className="text-sm text-ink-faint mb-4 italic">{hint}</p>
      )}
      {!submitted ? (
        <div className="grid grid-cols-2 gap-2">
          {options.map((o) => (
            <Button
              key={o}
              variant="secondary"
              onClick={() => {
                setGuess(o);
                setSubmitted(true);
              }}
            >
              {o}
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className={`font-display text-2xl mb-4 ${correct ? "text-lesson" : "text-error"}`}>
            {correct ? "✓ Correcto" : `Era "${answer}"`}
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => onGrade(1)}>Otra vez</Button>
            <Button variant="secondary" onClick={() => onGrade(3)}>Bien</Button>
            {correct && <Button variant="primary" onClick={() => onGrade(4)}>Fácil</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
