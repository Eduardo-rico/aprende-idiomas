// app/[lang]/stats/page.tsx
// Stats are language-agnostic (events are global). We accept the lang segment
// so the URL is well-formed, but we don't read from it.
'use client';
import { useEffect, useState } from 'react';
import { db, type AppEvent, type Card, type ConceptMastery } from '@/lib/db/schema';
import {
  aggregateByDay,
  accuracyByBlock,
  weakestConcepts,
  strongestConcepts,
  fsrsRetention,
  brVsPtSplit,
} from '@/lib/stats/aggregations';
import { Heatmap } from '@/components/stats/Heatmap';
import { LineChart } from '@/components/stats/LineChart';
import { BlockAccuracyChart } from '@/components/stats/BlockAccuracyChart';
import { ConceptMasteryChart } from '@/components/stats/ConceptMasteryChart';
import { BrPtSplitChart } from '@/components/stats/BrPtSplitChart';
import { FsrsRetentionCard } from '@/components/stats/FsrsRetentionCard';

type Range = 7 | 30 | 90;

interface StatsData {
  byDay: ReturnType<typeof aggregateByDay>;
  byBlock: Record<number, number>;
  weak: ConceptMastery[];
  strong: ConceptMastery[];
  retention: number;
  retentionByBlock: Record<number, number>;
  split: { br: number; pt: number };
  heatmapData: Array<{ date: string; count: number }>;
  year: number;
}

export default function StatsPage() {
  const [range, setRange] = useState<Range>(30);
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const allEvents: AppEvent[] = await db.events.toArray();
      const cards: Card[] = await db.cards.toArray();
      const mastery: ConceptMastery[] = await db.conceptMastery.toArray();

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - range);
      const events = allEvents.filter((e) => e.ts >= cutoff);

      // Card → blockId map (resolves block membership for accuracyByBlock).
      const cardBlockIndex = new Map(cards.map((c) => [c.id, c.blockId] as const));
      const byDay = aggregateByDay(events);
      const byBlock = accuracyByBlock(allEvents, cardBlockIndex);
      const weak = weakestConcepts(mastery.filter((m) => m.exposureCount > 0), 10);
      const strong = strongestConcepts(mastery.filter((m) => m.exposureCount > 0), 10);
      const retention = fsrsRetention(cards);

      // Per-block retention: only meaningful when the schema has blockId on
      // the Card — we use the same index map. Groups cards by blockId and
      // reports fsrsRetention per group.
      const cardsByBlock = new Map<number, Card[]>();
      for (const c of cards) {
        const arr = cardsByBlock.get(c.blockId) ?? [];
        arr.push(c);
        cardsByBlock.set(c.blockId, arr);
      }
      const retentionByBlock: Record<number, number> = {};
      for (const [blockId, blockCards] of cardsByBlock) {
        retentionByBlock[blockId] = fsrsRetention(blockCards);
      }
      const split = brVsPtSplit(allEvents);

      // Year heatmap (current year).
      const year = new Date().getFullYear();
      const yearEvents = allEvents.filter((e) => e.ts.getFullYear() === year);
      const heatmapData = aggregateByDay(yearEvents).map((d) => ({
        date: d.date,
        count: d.count,
      }));

      if (cancelled) return;
      setData({ byDay, byBlock, weak, strong, retention, retentionByBlock, split, heatmapData, year });
    })();
    return () => { cancelled = true; };
  }, [range]);

  if (!data) return <p className="p-8 text-muted-foreground">Cargando…</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Stats</h1>
        <div className="flex gap-1">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-3 py-1 text-sm rounded ${
                range === d ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <section className="border border-border rounded-lg p-4">
        <h2 className="text-sm font-medium mb-3">Tiempo total ({range}d)</h2>
        <LineChart
          data={data.byDay.map((d) => ({ date: d.date.slice(5), count: d.count }))}
          dataKey="count"
          xKey="date"
        />
      </section>

      <section className="border border-border rounded-lg p-4">
        <h2 className="text-sm font-medium mb-3">Heatmap {data.year}</h2>
        <Heatmap data={data.heatmapData} year={data.year} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-3">Accuracy por bloque</h2>
          <BlockAccuracyChart data={data.byBlock} />
        </section>
        <section className="border border-border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-3">BR vs PT</h2>
          <BrPtSplitChart data={data.split} />
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-border rounded-lg p-4">
          <ConceptMasteryChart data={data.weak} title="Conceptos más débiles" />
        </section>
        <section className="border border-border rounded-lg p-4">
          <ConceptMasteryChart data={data.strong} title="Conceptos más fuertes" />
        </section>
      </div>

      <FsrsRetentionCard data={data.retentionByBlock} />
    </div>
  );
}
