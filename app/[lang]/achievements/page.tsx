// app/[lang]/achievements/page.tsx
// Achievements are global; lang is accepted to satisfy the route shape but
// not read.
"use client";
import { useEffect, useState } from "react";
import { RULES } from "@/lib/achievements/rules";
import { checkAndUnlockAchievements } from "@/lib/db/repository";
import { db } from "@/lib/db/schema";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { useSettings } from "@/lib/stores/settings";

export default function AchievementsPage({
  params: _params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { dailyGoalMinutes } = useSettings();
  const [unlocked, setUnlocked] = useState<Map<string, Date>>(new Map());

  useEffect(() => {
    async function load() {
      await checkAndUnlockAchievements(dailyGoalMinutes);
      const rows = await db.achievements.toArray();
      setUnlocked(new Map(rows.map((r) => [r.id, r.unlockedAt])));
    }
    load();
  }, [dailyGoalMinutes]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl mb-2">Logros</h1>
      <p className="text-muted mb-8">
        {unlocked.size} de {RULES.length} desbloqueados
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RULES.map((r) => (
          <AchievementCard
            key={r.id}
            rule={r}
            unlocked={unlocked.has(r.id)}
            unlockedAt={unlocked.get(r.id)}
          />
        ))}
      </div>
    </div>
  );
}
