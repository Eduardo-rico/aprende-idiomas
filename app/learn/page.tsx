// app/learn/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDueCards } from "@/lib/db/repository";
import type { Exercise } from "@/lib/data/zod-schemas";
import b1Data from "@/lib/data/blocks/b1.json";
import b2Data from "@/lib/data/blocks/b2.json";
import b3Data from "@/lib/data/blocks/b3.json";
import b4Data from "@/lib/data/blocks/b4.json";
import b5Data from "@/lib/data/blocks/b5.json";
import b6Data from "@/lib/data/blocks/b6.json";
import b7Data from "@/lib/data/blocks/b7.json";
import b8Data from "@/lib/data/blocks/b8.json";
import b10Data from "@/lib/data/blocks/b10.json";

export default function LearnPage() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const due = await getDueCards(new Date(), 20);
      setCount(due.length);
      setLoading(false);
    })();
  }, []);

  const startDailyMix = async () => {
    const due = await getDueCards(new Date(), 20);
    if (due.length === 0) { router.push("/blocks"); return; }
    // CRITICAL FIX (I6): single in-memory lookup, no N+1 dynamic imports.
    const allExercises: Exercise[] = [
      ...(b1Data as Exercise[]),
      ...(b2Data as Exercise[]),
      ...(b3Data as Exercise[]),
      ...(b4Data as Exercise[]),
      ...(b5Data as Exercise[]),
      ...(b6Data as Exercise[]),
      ...(b7Data as Exercise[]),
      ...(b8Data as Exercise[]),
      ...(b10Data as Exercise[]),
    ];
    const byId = new Map(allExercises.map((e) => [e.id, e]));
    const first = due.map((card) => byId.get(card.id)).find(Boolean);
    if (!first) { router.push("/blocks"); return; }
    router.push(`/practice/${first.lessonId}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 text-center">
      <h1 className="font-display text-4xl">Sesión de estudio</h1>
      <div className="text-6xl font-display">{loading ? "…" : count}</div>
      <p className="text-muted">tarjetas listas para revisar</p>
      <button
        onClick={startDailyMix}
        disabled={loading || count === 0}
        className="w-full p-4 bg-primary text-fg rounded-xl font-medium disabled:opacity-50"
      >
        Empezar sesión →
      </button>
    </div>
  );
}
