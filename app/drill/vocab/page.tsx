// app/drill/vocab/page.tsx
import { loadVocabCatalog } from '@/lib/vocab/catalog-server';
import { initCatalog } from '@/lib/vocab/catalog';
import { VocabDrill } from '@/components/vocab/VocabDrill';

export default async function VocabDrillPage() {
  const items = await loadVocabCatalog();
  // Seed the client-side cache so VocabDrill (a client component) can use
  // the synchronous lookup helpers without a fetch round-trip.
  initCatalog(items);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="font-display text-3xl">Vocab drill</h1>
        <p className="text-sm text-muted-foreground">
          Repaso de vocabulario global derivado de las historias ({items.length} palabras).
        </p>
      </header>
      <VocabDrill />
    </div>
  );
}
