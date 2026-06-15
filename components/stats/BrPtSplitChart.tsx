// components/stats/BrPtSplitChart.tsx
'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function BrPtSplitChart({ data }: { data: { br: number; pt: number } }) {
  const arr = [
    { name: 'BR', value: Math.round(data.br * 100), color: 'hsl(var(--primary))' },
    { name: 'PT', value: Math.round(data.pt * 100), color: 'hsl(var(--accent))' },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={arr} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
          {arr.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
