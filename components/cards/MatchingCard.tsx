// components/cards/MatchingCard.tsx
"use client";
import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function MatchingCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { pairs: { left: string; right: string }[] };
  const rights = useMemo(() => [...d.pairs.map(p => p.right)].sort(() => Math.random() - 0.5), [d]);
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [conn, setConn] = useState<Record<string, string>>({}); // left -> right
  const [done, setDone] = useState(false);

  const connect = (right: string) => {
    if (activeLeft === null || done) return;
    const next = { ...conn, [activeLeft]: right };
    setConn(next); setActiveLeft(null);
    if (Object.keys(next).length === d.pairs.length) {
      const allCorrect = d.pairs.every(p => next[p.left] === p.right);
      setDone(true);
      onSubmit(JSON.stringify(next), allCorrect);
    }
  };
  return (
    <div className="p-8 border-2 border-border rounded-2xl">
      <div className="text-sm text-muted-foreground text-center mb-4">Empareja:</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {d.pairs.map(p => (
            <button key={p.left} disabled={done || p.left in conn} onClick={() => setActiveLeft(p.left)}
              className={`w-full border-2 rounded-md px-3 py-2 ${activeLeft === p.left ? 'border-primary' : 'border-border'} ${p.left in conn ? (conn[p.left] === p.right ? 'bg-accent/10 border-accent' : 'bg-error/10 border-error') : ''}`}>
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map(r => (
            <button key={r} disabled={done || Object.values(conn).includes(r)} onClick={() => connect(r)}
              className="w-full border-2 border-border rounded-md px-3 py-2 disabled:opacity-50">{r}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
