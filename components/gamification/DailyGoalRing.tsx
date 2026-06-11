// components/gamification/DailyGoalRing.tsx
"use client";
import { useStreakStatus } from "@/lib/hooks/useStreakStatus";
import { useSettings } from "@/lib/stores/settings";

export function DailyGoalRing() {
  const { todayMinutes } = useStreakStatus();
  const { dailyGoalMinutes } = useSettings();
  const pct = Math.min(1, todayMinutes / dailyGoalMinutes);
  const C = 2 * Math.PI * 28;

  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle
          cx="32" cy="32" r="28" fill="none"
          stroke="var(--color-primary)" strokeWidth="6"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
          strokeLinecap="round"
        />
      </svg>
      <div>
        <div className="text-sm font-medium">{Math.round(todayMinutes)} / {dailyGoalMinutes} min</div>
        <div className="text-xs text-muted">Meta diaria</div>
      </div>
    </div>
  );
}
