// components/home/TodaySummary.tsx
'use client';
import { StreakRing } from '@/components/gamification/StreakRing';
import { DailyGoalRing } from '@/components/gamification/DailyGoalRing';
import { XpBar } from '@/components/gamification/XpBar';
import { LevelBadge } from '@/components/gamification/LevelBadge';

export function TodaySummary() {
  return (
    <section className="border border-border rounded-lg p-4">
      <h2 className="text-sm font-medium mb-4">Hoy</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
        <StreakRing />
        <DailyGoalRing />
        <div className="col-span-2 sm:col-span-2">
          <XpBar />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <LevelBadge />
        <span className="text-xs text-muted-foreground">Tu nivel</span>
      </div>
    </section>
  );
}
