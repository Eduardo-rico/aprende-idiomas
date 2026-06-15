// components/stats/ConceptMasteryChart.tsx
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
import type { ConceptMastery } from '@/lib/db/schema';

interface Props { data: ConceptMastery[]; title: string; }

export function ConceptMasteryChart({ data, title }: Props) {
  const arr = data.slice(0, 10).map((c) => ({
    name: c.conceptId.replace(/^b\d+-/, ''),
    mastery: c.masteryPct,
  }));
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={arr} layout="vertical">
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            width={80}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Bar dataKey="mastery" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
