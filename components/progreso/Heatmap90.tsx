// components/progreso/Heatmap90.tsx
// 90-day heatmap with 5 intensity levels. Pure CSS flexbox + raw hex
// colours from the mockup (NOT theme tokens — the mockup uses a fixed
// scale #CDE6D6 → #2E8B57 + the empty `--rule` for zeros). Matches
// design-mockups/progreso.html:57-59.
//
// Layout: cells laid out left→right, oldest→newest. Wrapping is `flex-wrap`
// so the heatmap collapses gracefully on narrow viewports instead of forcing
// horizontal scroll. endDate is parameterised so tests can pin time.
"use client";

interface Heatmap90Day {
  date: string; // YYYY-MM-DD (UTC)
  count: number;
}

// Intensity levels per mockup CSS:
const L1 = "#CDE6D6";
const L2 = "#8FCBA8";
const L3 = "#5AAE7C";
const L4 = "#2E8B57";

interface Props {
  data: Heatmap90Day[];
  endDate: Date;
}

export function Heatmap90({ data, endDate }: Props) {
  const byDate = new Map(data.map((d) => [d.date, d.count]));
  const cells: Array<{ date: string; count: number }> = [];
  const today = new Date(endDate);
  today.setUTCHours(0, 0, 0, 0);
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cells.push({ date: iso, count: byDate.get(iso) ?? 0 });
  }
  const max = Math.max(1, ...cells.map((c) => c.count));

  const fill = (count: number): string => {
    if (count === 0) return "var(--rule)";
    const intensity = count / max;
    if (intensity < 0.25) return L1;
    if (intensity < 0.5) return L2;
    if (intensity < 0.75) return L3;
    return L4;
  };

  return (
    <div
      className="flex flex-wrap gap-1 rounded-[10px] border border-rule bg-paper-raised p-5 shadow-[var(--shadow-xs)]"
      data-testid="heatmap-90"
    >
      {cells.map((c) => (
        <div
          key={c.date}
          title={`${c.date}: ${c.count} tarjetas`}
          className="h-[15px] w-[15px] rounded-[3px]"
          style={{ backgroundColor: fill(c.count) }}
        />
      ))}
    </div>
  );
}
