// components/gamification/StreakRing.tsx
"use client";
import { useStreakStatus } from "@/lib/hooks/useStreakStatus";

export function StreakRing() {
  const { currentStreak, isStreakAlive } = useStreakStatus();
  const flame = currentStreak >= 3;

  return (
    <div className="flex items-center gap-2">
      <span className="text-3xl" aria-label={`streak ${currentStreak}`}>
        {flame ? "🔥" : "○"}
      </span>
      <div>
        <div className="text-2xl font-display font-semibold">{currentStreak}</div>
        <div className="text-xs text-muted">{isStreakAlive ? "días" : "sin racha"}</div>
      </div>
    </div>
  );
}
