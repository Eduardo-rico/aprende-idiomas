// app/blocks/[id]/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getBlock } from "@/lib/data/curriculum";
import { LessonCard } from "@/components/LessonCard";
import { getDueInLesson } from "@/lib/db/repository";

export default function BlockPage({ params }: { params: Promise<{ id: string }> }) {
  // CRITICAL FIX (C5): use React.use() in client pages, not params.then + useState (flash bug).
  const { id } = use(params);
  const blockId = Number(id);
  const block = getBlock(blockId);
  const router = useRouter();

  // notFound from useEffect cannot throw — redirect instead.
  useEffect(() => {
    if (block.lessons.length === 0) router.push("/blocks");
  }, [block.lessons.length, router]);

  const [dueByLesson, setDueByLesson] = useState<Record<string, number>>({});
  const [blockDueSplit, setBlockDueSplit] = useState<{ review: number; newCards: number } | null>(null);
  useEffect(() => {
    (async () => {
      const out: Record<string, number> = {};
      const now = new Date();
      let totalReview = 0;
      let totalNew = 0;
      for (const lesson of block.lessons) {
        const due = await getDueInLesson(lesson.id, now, 100);
        out[lesson.id] = due.length;
        for (const c of due) {
          if (c.state === 0) totalNew++;
          else totalReview++;
        }
      }
      setDueByLesson(out);
      setBlockDueSplit({ review: totalReview, newCards: totalNew });
    })();
  }, [block]);

  const blockDueTotal = blockDueSplit ? blockDueSplit.review + blockDueSplit.newCards : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <header>
        <div className="text-xs text-muted">Bloque {block.id}</div>
        <h1 className="font-display text-4xl">{block.name}</h1>
        <p className="text-muted mt-2">{block.description}</p>
      </header>
      {blockDueSplit && blockDueTotal > 0 && (
        <button
          onClick={() => router.push("/review")}
          className="w-full p-4 border-2 border-primary rounded-xl text-left space-y-1 hover:bg-primary/5"
        >
          <div className="font-display text-lg">Repaso diario →</div>
          <div className="text-sm text-muted">
            <span className="font-medium text-foreground">{blockDueSplit.review}</span> repasos
            <span className="mx-2">·</span>
            <span className="font-medium text-foreground">{blockDueSplit.newCards}</span> nuevas
            <span className="mx-2">·</span>
            en todos los bloques
          </div>
        </button>
      )}
      <section className="space-y-2">
        <h2 className="font-display text-2xl">Lecciones</h2>
        {block.lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            dueCount={dueByLesson[lesson.id] ?? 0}
            blockId={block.id}
          />
        ))}
      </section>
    </div>
  );
}
