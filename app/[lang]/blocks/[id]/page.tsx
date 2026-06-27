// app/[lang]/blocks/[id]/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import type { Block, Lesson } from "@/lib/data/curriculum-types";
import { LessonCard } from "@/components/LessonCard";
import { getDueInLesson } from "@/lib/db/repository";

export default function BlockPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = use(params);
  const blockId = Number(id);
  const router = useRouter();

  const [block, setBlock] = useState<Block | null>(null);
  const [dueByLesson, setDueByLesson] = useState<Record<string, number>>({});
  const [blockDueSplit, setBlockDueSplit] = useState<{ review: number; newCards: number } | null>(null);

  // Carga el curriculum una sola vez; el blockId se filtra client-side.
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/curriculum?lang=${lang}`);
      if (!res.ok) return;
      const { blocks } = (await res.json()) as { blocks: Block[] };
      setBlock(blocks.find((b) => b.id === blockId) ?? null);
    })();
  }, [lang, blockId]);

  // notFound from useEffect cannot throw — redirect instead.
  useEffect(() => {
    if (block && block.lessons.length === 0) router.push(`/${lang}/blocks`);
  }, [block, lang, router]);

  useEffect(() => {
    if (!block) return;
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

  if (!block) {
    return <div className="p-12 text-center text-muted">Cargando...</div>;
  }

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
          onClick={() => router.push(`/${lang}/review`)}
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
        {block.lessons.map((lesson: Lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            dueCount={dueByLesson[lesson.id] ?? 0}
            blockId={block.id}
            lang={lang}
          />
        ))}
      </section>
    </div>
  );
}
