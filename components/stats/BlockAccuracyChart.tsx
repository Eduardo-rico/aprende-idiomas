// components/stats/BlockAccuracyChart.tsx
'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function BlockAccuracyChart({ data }: { data: Record<number, number> }) {
  const arr = Object.entries(data)
    .map(([blockId, acc]) => ({ name: `B${blockId}`, accuracy: Math.round(acc * 100) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={arr}>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
        />
        <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
