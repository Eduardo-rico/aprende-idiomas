// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDueCards } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";
import { VariantToggle } from "@/components/VariantToggle";

export default function Home() {
  const { dailyGoalMinutes, variant } = useSettings();
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const due = await getDueCards(new Date(), 100);
      setDueCount(due.length);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="font-display text-5xl mb-2">Aprende Português</h1>
        <p className="text-muted">Português brasileiro + europeu para hispanohablantes</p>
        <div className="mt-4"><VariantToggle /></div>
      </header>

      <section className="grid grid-cols-3 gap-4">
        <Card title="Due cards" value={loading ? "…" : String(dueCount)} accent="primary" />
        <Card title="Meta diária" value={`${dailyGoalMinutes} min`} accent="accent" />
        <Card title="Variante" value={variant.toUpperCase()} accent="info" />
      </section>

      <section>
        <Link
          href="/learn"
          className="block p-6 border-2 border-primary rounded-xl hover:bg-primary/5 transition-colors text-center"
        >
          <div className="font-display text-2xl">Continuar aprendiendo →</div>
          <div className="text-sm text-muted mt-1">Sesión guiada con daily mix</div>
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Link href="/blocks" className="p-4 border border-border rounded-lg hover:bg-muted/5">
          <div className="font-medium">📚 Blocos</div>
          <div className="text-sm text-muted">10 bloques curriculares</div>
        </Link>
        <Link href="/settings" className="p-4 border border-border rounded-lg hover:bg-muted/5">
          <div className="font-medium">⚙️ Settings</div>
          <div className="text-sm text-muted">Voz, tema, daily goal</div>
        </Link>
      </section>
    </div>
  );
}

function Card({ title, value, accent }: { title: string; value: string; accent: "primary" | "accent" | "info" }) {
  const c = { primary: "border-primary", accent: "border-accent", info: "border-info" }[accent];
  return (
    <div className={`p-4 border-2 ${c} rounded-xl`}>
      <div className="text-xs text-muted uppercase">{title}</div>
      <div className="text-3xl font-display mt-1">{value}</div>
    </div>
  );
}
