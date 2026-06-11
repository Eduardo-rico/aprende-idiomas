// components/gamification/LevelBadge.tsx
"use client";
import { useXpStatus } from "@/lib/hooks/useXpStatus";

export function LevelBadge() {
  const { level } = useXpStatus();
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md">
      <span className="text-xs text-muted">Lv</span>
      <span className="text-sm font-display font-semibold">{level}</span>
    </div>
  );
}
