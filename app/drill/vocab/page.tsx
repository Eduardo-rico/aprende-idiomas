// app/drill/vocab/page.tsx
import { VocabDrill } from '@/components/vocab/VocabDrill';

export default function VocabDrillPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="font-display text-3xl">Vocab drill</h1>
        <p className="text-sm text-muted-foreground">Repaso de vocabulario global derivado de las historias.</p>
      </header>
      <VocabDrill />
    </div>
  );
}
