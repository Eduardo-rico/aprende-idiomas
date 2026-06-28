// components/progreso/MasteryList.tsx
// Concept mastery list with bar + decay flag. Matches
// design-mockups/progreso.html:62-70 / 120-125.
//
// Each row: concept name (large) + conceptId mono + optional decay label
// (review color), then a 120px bar with a 3-color threshold
// (≥75% lesson / ≥50% review / <50% error), then the percentage.
// Empty state mirrors the spec copy when no concept has been exposed yet.
"use client";
import type { MasteryRow } from "@/lib/stats/aggregations";

function decayLabel(d: MasteryRow["decay"]): string | null {
  if (d === "decaying") return "↓ decayendo";
  if (d === "review-soon") return "↓ repasar pronto";
  return null;
}

function barColor(pct: number): string {
  if (pct >= 75) return "var(--lesson)";
  if (pct >= 50) return "var(--review)";
  return "var(--error)";
}

interface Props {
  rows: MasteryRow[];
}

export function MasteryList({ rows }: Props) {
  return (
    <div
      className="overflow-hidden rounded-[10px] border border-rule bg-paper-raised shadow-[var(--shadow-xs)]"
      data-testid="mastery-list"
    >
      {rows.length === 0 && (
        <div className="px-5 py-4 text-[13px] text-ink-muted">
          Sin conceptos expuestos todavía.
        </div>
      )}
      {rows.map((r) => {
        const flag = decayLabel(r.decay);
        const pct = Math.round(Math.max(0, Math.min(100, r.masteryPct)));
        return (
          <div
            key={r.conceptId}
            className="flex items-center gap-4 border-b border-rule px-5 py-[13px] last:border-b-0"
            data-testid="mastery-row"
          >
            <div className="flex-1 text-[15px]">
              {r.name}
              <div className="mt-0.5 font-mono text-[11px] text-ink-faint">
                {r.conceptId}
                {flag && (
                  <span className="ml-1 text-review">· {flag}</span>
                )}
              </div>
            </div>
            <div className="h-1.5 w-[120px] overflow-hidden rounded-full bg-rule">
              <div
                className="block h-full"
                style={{ width: `${pct}%`, backgroundColor: barColor(pct) }}
              />
            </div>
            <span className="w-10 text-right font-mono text-[12px] text-ink-muted">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
