// components/stats/LineChart.tsx
// Recharts wrapper. Recharts is client-only — keeps the wrapper in a 'use
// client' module so the page can render it without an extra boundary.
'use client';
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Props {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xKey: string;
  color?: string;
}

export function LineChart({ data, dataKey, xKey, color = 'hsl(var(--primary))' }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RLineChart data={data}>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
        />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </RLineChart>
    </ResponsiveContainer>
  );
}
