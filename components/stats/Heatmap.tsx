// components/stats/Heatmap.tsx
// GitHub-style year heatmap. 7 rows (days of week) × N columns (weeks).
// Pure SVG/CSS — no chart library needed for this size.
'use client';
import { useMemo } from 'react';

interface DayCell { date: string; count: number; }

export function Heatmap({ data, year }: { data: DayCell[]; year: number }) {
  const cells = useMemo(() => {
    const start = new Date(`${year}-01-01T00:00:00`);
    const end = new Date(`${year}-12-31T00:00:00`);
    const byDate = new Map(data.map((d) => [d.date, d.count]));
    const out: Array<{ date: string; count: number; month: number; dayOfWeek: number }> = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().slice(0, 10);
      out.push({
        date,
        count: byDate.get(date) ?? 0,
        month: d.getMonth(),
        dayOfWeek: d.getDay(),
      });
    }
    return out;
  }, [data, year]);

  const max = Math.max(1, ...cells.map((c) => c.count));

  const color = (count: number): string => {
    if (count === 0) return 'hsl(var(--muted))';
    const intensity = count / max;
    if (intensity < 0.25) return 'hsl(var(--primary) / 0.3)';
    if (intensity < 0.5) return 'hsl(var(--primary) / 0.6)';
    if (intensity < 0.75) return 'hsl(var(--primary) / 0.85)';
    return 'hsl(var(--primary))';
  };

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-1"
        style={{ gridTemplateRows: 'repeat(7, 12px)', gridAutoFlow: 'column' }}
      >
        {cells.map((c) => (
          <div
            key={c.date}
            title={`${c.date}: ${c.count} cards`}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color(c.count) }}
          />
        ))}
      </div>
    </div>
  );
}
