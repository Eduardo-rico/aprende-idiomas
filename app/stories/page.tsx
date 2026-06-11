import { loadAllStories } from "@/lib/data/loaders";
import Link from "next/link";

export default async function StoriesPage() {
  const stories = await loadAllStories();
  const byBlock = stories.reduce<Record<number, typeof stories>>((acc, s) => {
    (acc[s.blockId] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl mb-8">Histórias</h1>
      {Object.entries(byBlock).map(([blockId, blockStories]) => (
        <section key={blockId} className="mb-8">
          <h2 className="font-medium text-xl mb-3">Bloque {blockId}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {blockStories.map((s) => (
              <Link
                key={s.id}
                href={`/stories/${s.id}`}
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <h3 className="font-medium mb-1">{s.title}</h3>
                <p className="text-sm text-muted">
                  Nivel {s.level} · {s.vocab.length} vocab
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {stories.length === 0 && (
        <p className="text-muted">
          No hay historias todavía. Ejecuta{" "}
          <code>npm run generate:stories</code>.
        </p>
      )}
    </div>
  );
}
