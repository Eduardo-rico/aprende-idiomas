// components/diagnostic/DiagnosticRunner.tsx
'use client';
import { useState } from 'react';
import type { DiagnosticQuestion } from '@/lib/data/zod-schemas';
import { db, type GenericEvent } from '@/lib/db/schema';
import { computeRecommendation } from '@/lib/diagnostic/scorer';
import { DiagnosticResults } from './DiagnosticResults';

export function DiagnosticRunner({ questions, lang }: { questions: DiagnosticQuestion[]; lang: string }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ReturnType<typeof computeRecommendation> | null>(null);

  if (result) return <DiagnosticResults result={result} lang={lang} />;

  const q = questions[idx];
  if (!q) return <p className="p-8 text-muted-foreground">No hay preguntas.</p>;

  const answer = (i: number) => {
    const newAnswers = [...answers, i];
    setAnswers(newAnswers);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      return;
    }
    // Final question — score, persist, render results.
    const r = computeRecommendation(questions, newAnswers);
    setResult(r);
    void db.diagnosticResults.add({
      takenAt: new Date(),
      completed: true,
      answers: newAnswers,
      recommendedStart: r.recommendedStart,
      score: r.score,
    });
    const event: GenericEvent = {
      ts: new Date(),
      type: 'diagnostic_completed',
      payload: { score: r.score, recommendedStart: r.recommendedStart },
    };
    void db.events.add(event);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="text-sm text-muted-foreground mb-2">
        Pregunta {idx + 1} de {questions.length}
      </div>
      <h2 className="text-xl font-medium mb-4">{q.prompt}</h2>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            className="w-full text-left p-3 border border-border rounded-md hover:border-primary"
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
