// components/ConceptMastery.tsx
"use client";
import { useEffect, useState } from "react";
import type { ConceptMastery as CM } from "@/lib/db/schema";
import { getConceptMastery } from "@/lib/mastery/concept";

export function ConceptMastery({ conceptId }: { conceptId: string }) {
  const [m, setM] = useState<CM | undefined>(undefined);
  useEffect(() => { getConceptMastery(conceptId).then(setM); }, [conceptId]);
  if (!m) return <div className="text-sm text-muted">Concepto {conceptId}</div>;
  const color = m.masteryPct >= 85 ? "bg-accent" : m.masteryPct >= 60 ? "bg-primary" : "bg-error";
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-mono text-xs text-muted">{conceptId}</span>
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${m.masteryPct}%` }} />
      </div>
      <span className="font-mono text-xs w-10 text-right">{m.masteryPct}%</span>
    </div>
  );
}
