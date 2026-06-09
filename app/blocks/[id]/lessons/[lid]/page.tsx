// app/blocks/[id]/lessons/[lid]/page.tsx
// CRITICAL FIX (C6): original was "use client" + async function. That doesn't compile.
// This is a server component that reads params synchronously and passes
// data to a client ConceptMastery component.
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlock } from "@/lib/data/curriculum";
import { ConceptMastery } from "@/components/ConceptMastery";

export default async function LessonIntro({
  params,
}: {
  params: Promise<{ id: string; lid: string }>;
}) {
  const { id, lid } = await params;
  const block = getBlock(Number(id));
  const lesson = block.lessons.find(l => l.id === lid);
  // Guard before dereferencing: getLesson would throw on a bad id; notFound()
  // renders the 404 boundary instead.
  if (!lesson) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="text-xs text-muted">Bloque {block.id} · Lección</div>
      <h1 className="font-display text-4xl">{lesson.name}</h1>
      <p className="text-muted">Objetivos: {lesson.objectives.join(" · ")}</p>

      <section>
        <h2 className="font-display text-2xl mb-3">Conceptos cubiertos</h2>
        <div className="space-y-2">
          {lesson.conceptIds.map(cid => <ConceptMastery key={cid} conceptId={cid} />)}
        </div>
      </section>

      <Link
        href={`/practice/${lesson.id}`}
        className="block p-6 border-2 border-primary rounded-xl text-center hover:bg-primary/5"
      >
        <div className="font-display text-2xl">Practicar esta lección →</div>
        <div className="text-sm text-muted mt-1">Sesión de práctica con SRS</div>
      </Link>
    </div>
  );
}
