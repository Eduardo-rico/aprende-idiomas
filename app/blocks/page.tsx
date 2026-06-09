// app/blocks/page.tsx
"use client";
import { BLOCKS } from "@/lib/data/curriculum";
import { BlockCard } from "@/components/BlockCard";
import { useEffect, useState } from "react";
import { getConceptMastery } from "@/lib/mastery/concept";

export default function BlocksPage() {
  const [masteryByBlock, setMasteryByBlock] = useState<Record<number, number>>({});

  useEffect(() => {
    (async () => {
      const out: Record<number, number> = {};
      for (const b of BLOCKS) {
        const concepts = b.lessons.flatMap(l => l.conceptIds);
        if (concepts.length === 0) { out[b.id] = 0; continue; }
        const mastered = await Promise.all(concepts.map(c => getConceptMastery(c).then(m => m?.isMastered ?? false)));
        out[b.id] = Math.round((mastered.filter(Boolean).length / concepts.length) * 100);
      }
      setMasteryByBlock(out);
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <header>
        <h1 className="font-display text-4xl">Blocos</h1>
        <p className="text-muted mt-1">10 bloques del currículo completo</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BLOCKS.map((b) => (
          <BlockCard
            key={b.id}
            block={b}
            masteryPct={masteryByBlock[b.id] ?? 0}
            isUnlocked={b.prereqs.every(p => (masteryByBlock[p] ?? 0) >= 80) || b.id === 1}
          />
        ))}
      </div>
    </div>
  );
}
