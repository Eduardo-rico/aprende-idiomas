// components/diagnostic/DiagnosticResults.tsx
'use client';
import Link from 'next/link';
import type { Recommendation } from '@/lib/diagnostic/scorer';

export type { Recommendation };

export function DiagnosticResults({ result }: { result: Recommendation }) {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="font-display text-3xl">Resultados</h2>
      <div className="border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground">Score</div>
        <div className="text-4xl font-display font-semibold">{result.score}%</div>
      </div>
      <div className="border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Recomendación</div>
        <div className="text-2xl font-display font-semibold mb-2">
          Empezá por el Bloque {result.recommendedStart}
        </div>
        <Link
          href={`/blocks/${result.recommendedStart}`}
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Ir al Bloque {result.recommendedStart} →
        </Link>
      </div>
      {result.weakConceptIds.length > 0 && (
        <div className="border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">Conceptos a reforzar</div>
          <ul className="text-sm space-y-1">
            {result.weakConceptIds.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
