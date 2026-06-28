// components/progreso/MetricCard.tsx
// One of the four "Resultados de aprendizaje" tiles. Pure presentational.
// Matches design-mockups/progreso.html:50-54 / 100-103.
//
//   label    — short metric name, multi-line safe (min-height 32px)
//   value    — big display-serif number (Fraunces 30px)
//   unit     — optional smaller unit suffix (% / s / /N)
//   delta    — optional sub-line in mono (▲/▼ + description)
//   trend    — colors the delta: lesson (up) / error (down) / muted (flat)
"use client";
import { cn } from "@/lib/utils";

export type MetricTrend = "up" | "down" | "flat";

interface Props {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: MetricTrend;
  testId?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  trend = "flat",
  testId,
}: Props) {
  const trendClass =
    trend === "up"
      ? "text-lesson"
      : trend === "down"
      ? "text-error"
      : "text-ink-muted";
  return (
    <div
      className="rounded-[10px] border border-rule bg-paper-raised p-[18px] shadow-[var(--shadow-xs)]"
      data-testid={testId ?? "metric-card"}
    >
      <div className="mb-2.5 min-h-8 text-[12px] leading-tight text-ink-muted">
        {label}
      </div>
      <div className="font-display text-[30px] font-semibold leading-none">
        {value}
        {unit && (
          <span className="ml-1 text-[16px] font-medium">{unit}</span>
        )}
      </div>
      {delta && (
        <div className={cn("mt-1.5 font-mono text-[12px]", trendClass)}>
          {delta}
        </div>
      )}
    </div>
  );
}
