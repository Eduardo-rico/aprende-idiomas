// components/progreso/BalanceBars.tsx
// "Producción vs Reconocimiento" horizontal bars. Matches
// design-mockups/progreso.html:73-78 / 112-115.
//
// Recognition: --info (blue). Production: --lesson (green). Bar fills the
// track to the rounded percentage and shows the pct label inside. Values
// are clamped 0..1 so callers can pass raw accuracy without worrying about
// NaN slipping through when the underlying aggregation returned 0/0.
"use client";

interface Props {
  recognition: number; // 0..1
  production: number;  // 0..1
  note?: string;
}

export function BalanceBars({ recognition, production, note }: Props) {
  const recPct = Math.round(Math.max(0, Math.min(1, recognition)) * 100);
  const prodPct = Math.round(Math.max(0, Math.min(1, production)) * 100);
  return (
    <div
      className="rounded-[10px] border border-rule bg-paper-raised p-6 shadow-[var(--shadow-xs)]"
      data-testid="balance-bars"
    >
      <Bar label="Reconoces (PT→ES)" pct={recPct} color="var(--info)" />
      <Bar label="Produces (ES→PT)" pct={prodPct} color="var(--lesson)" />
      {note && (
        <p className="mt-1.5 font-display text-[13px] italic text-ink-muted">
          {note}
        </p>
      )}
    </div>
  );
}

function Bar({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3.5 last:mb-0">
      <span className="w-[120px] text-[14px] text-ink-muted">{label}</span>
      <div className="h-6 flex-1 overflow-hidden rounded-md bg-paper-sunken">
        <div
          className="flex h-full items-center pl-2.5 font-mono text-[12px] font-semibold text-white"
          style={{ width: `${pct}%`, backgroundColor: color }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}
