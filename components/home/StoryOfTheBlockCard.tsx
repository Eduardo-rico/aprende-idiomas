// components/home/StoryOfTheBlockCard.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCompletedStories } from '@/lib/db/repository';
import { useSettings } from '@/lib/stores/settings';
import { useLang } from '@/lib/stores/lang-context';
import type { Story } from '@/lib/data/zod-schemas';

export function StoryOfTheBlockCard({ stories }: { stories: Story[] }) {
  const lang = useLang();
  const { variant } = useSettings();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCompletedStories()
      .then((done) => {
        if (cancelled) return;
        setCompleted(new Set(done));
        setHydrated(true);
      })
      .catch(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (stories.length === 0) {
    return (
      <section className="border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-1">📖 Historia del Bloque</div>
        <p className="text-sm text-muted-foreground">
          Aún no hay historias generadas. Corré <code className="px-1 rounded bg-muted">npm run generate:stories</code>.
        </p>
      </section>
    );
  }

  // Pick first unread story of block 1; fall back to any first story.
  const story = stories.find((s) => s.blockId === 1 && !completed.has(s.id)) ?? stories[0]!;

  return (
    <section className="border border-border rounded-lg p-4">
      <div className="text-xs text-muted-foreground mb-1">
        📖 Historia del Bloque {story.blockId} · variante {variant.toUpperCase()}
      </div>
      <h3 className="font-display text-xl mb-1">{story.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Nivel {story.level} · {story.vocab.length} vocab · ~3 min
        {hydrated && completed.has(story.id) && ' · ✓ ya leída'}
      </p>
      <Link
        href={`/${lang}/stories/${story.id}`}
        className="inline-block px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
      >
        {hydrated && completed.has(story.id) ? 'Releer' : 'Empezar'}
      </Link>
    </section>
  );
}
