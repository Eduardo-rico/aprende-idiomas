// app/diagnostic/page.tsx
import { loadDiagnostic } from '@/lib/data/loaders';
import { DiagnosticRunner } from '@/components/diagnostic/DiagnosticRunner';

export default async function DiagnosticPage() {
  const diagnostic = await loadDiagnostic();

  if (!diagnostic) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl mb-2">Test diagnóstico</h1>
        <p className="text-sm text-muted-foreground">
          El test diagnóstico no está disponible. Asegurate de que
          <code className="px-1 mx-1 rounded bg-muted">lib/data/diagnostic.json</code>
          exista en el build.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-xl mx-auto px-4 mb-4">
        <h1 className="font-display text-3xl">Test diagnóstico</h1>
        <p className="text-sm text-muted-foreground">
          {diagnostic.questions.length} preguntas · ~5 minutos · sin bloqueante
        </p>
      </div>
      <DiagnosticRunner questions={diagnostic.questions} />
    </div>
  );
}
