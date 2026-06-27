// app/[lang]/blocks/page.tsx
"use client";
import type { Block } from "@/lib/data/curriculum-types";
import { BlockCard } from "@/components/BlockCard";
import { EmptyState } from "../_empty-state";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { hasLocale, LANG_LABELS, LANG_FLAGS, type LanguageId } from "@/lib/locales";
import { getConceptMastery } from "@/lib/mastery/concept";

export default function BlocksPage() {
  const params = useParams<{ lang: string }>();
  const lang: LanguageId = hasLocale(params.lang) ? params.lang : "pt";
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [masteryByBlock, setMasteryByBlock] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/curriculum?lang=${lang}`);
      if (!res.ok) { if (!cancelled) setLoading(false); return; }
      const { blocks: b } = (await res.json()) as { blocks: Block[] };
      if (!cancelled) { setBlocks(b); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  useEffect(() => {
    (async () => {
      const out: Record<number, number> = {};
      for (const b of blocks) {
        const concepts = b.lessons.flatMap(l => l.conceptIds);
        if (concepts.length === 0) { out[b.id] = 0; continue; }
        const mastered = await Promise.all(concepts.map(c => getConceptMastery(c).then(m => m?.isMastered ?? false)));
        out[b.id] = Math.round((mastered.filter(Boolean).length / concepts.length) * 100);
      }
      setMasteryByBlock(out);
    })();
  }, [blocks]);

  // Phase 5: idioma sin contenido → empty state.
  if (!loading && blocks.length === 0) {
    return <EmptyState lang={lang} page="blocos" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <header>
        <h1 className="font-display text-4xl">Blocos</h1>
        <p className="text-muted mt-1">
          {blocks.length} bloques del currículo de {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blocks.map((b) => (
          <BlockCard
            key={b.id}
            block={b}
            masteryPct={masteryByBlock[b.id] ?? 0}
            isUnlocked={b.prereqs.every(p => (masteryByBlock[p] ?? 0) >= 80) || b.id === 1}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}
