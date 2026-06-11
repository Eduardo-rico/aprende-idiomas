// components/gamification/XpBar.tsx
"use client";
import { useXpStatus } from "@/lib/hooks/useXpStatus";

export function XpBar() {
  const { progress, total, level } = useXpStatus();
  const pct = Math.min(100, Math.max(0, progress.pct * 100));
  return (
    <div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-muted mt-1">{total} XP · nivel {level}</div>
    </div>
  );
}
