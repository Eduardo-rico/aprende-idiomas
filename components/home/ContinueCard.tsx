// components/home/ContinueCard.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDueCardsCount } from '@/lib/db/repository';

export function ContinueCard() {
  const [dueCount, setDueCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDueCardsCount()
      .then((n) => {
        if (!cancelled) setDueCount(n);
      })
      .catch(() => {
        if (!cancelled) setDueCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (dueCount === null) {
    return (
      <section className="border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-1">🔁 Repaso</div>
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </section>
    );
  }

  if (dueCount === 0) {
    return (
      <section className="border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-1">📚 Continuar</div>
        <p className="text-sm">No hay cards listas para repaso.</p>
        <Link
          href="/blocks"
          className="text-sm text-primary underline mt-2 inline-block"
        >
          Ver bloques
        </Link>
      </section>
    );
  }

  return (
    <section className="border border-border rounded-lg p-4">
      <div className="text-xs text-muted-foreground mb-1">🔁 Repaso</div>
      <h3 className="font-display text-xl mb-2">{dueCount} cards listas</h3>
      <Link
        href="/learn"
        className="inline-block px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
      >
        Repasar ahora
      </Link>
    </section>
  );
}
