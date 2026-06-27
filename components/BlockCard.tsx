// components/BlockCard.tsx
"use client";
import Link from "next/link";
import type { Block } from "@/lib/data/curriculum-types";

interface Props { block: Block; masteryPct: number; isUnlocked: boolean; lang: string; }

export function BlockCard({ block, masteryPct, isUnlocked, lang }: Props) {
  const accent = ["border-primary", "border-accent", "border-info", "border-error"][block.id % 4];
  return (
    <Link
      // href MUST be lang-scoped — all routes live under app/[lang]/…, so
      // `/blocks/${id}` (without /${lang}) 404s.
      href={isUnlocked ? `/${lang}/blocks/${block.id}` : "#"}
      className={`block p-5 border-2 ${isUnlocked ? accent : "border-border opacity-50"} rounded-xl ${isUnlocked ? "hover:bg-muted/5" : "cursor-not-allowed"} transition-all`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted">Bloque {block.id}</span>
        {!isUnlocked && <span className="text-xs">🔒</span>}
      </div>
      <h3 className="font-display text-xl mb-1">{block.name}</h3>
      <p className="text-sm text-muted mb-3">{block.description.slice(0, 100)}{block.description.length > 100 ? "…" : ""}</p>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${masteryPct}%` }} />
        </div>
        <span className="font-mono text-muted">{masteryPct}%</span>
      </div>
    </Link>
  );
}
