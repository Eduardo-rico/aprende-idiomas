// app/[lang]/drill/vocab/page.tsx
import { loadVocabCatalog } from "@/lib/vocab/catalog-server";
import { initCatalog } from "@/lib/vocab/catalog";
import { VocabDrill } from "@/components/vocab/VocabDrill";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { EmptyState } from "../../_empty-state";

export default async function VocabDrillPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : "pt";
  const items = await loadVocabCatalog(lang);
  // Phase 5: idioma sin contenido → empty state.
  if (items.length === 0) {
    return <EmptyState lang={lang} page="vocabulário" />;
  }
  // Seed the client-side cache so VocabDrill (a client component) can use
  // the synchronous lookup helpers without a fetch round-trip.
  initCatalog(items, lang);

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
