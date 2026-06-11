// components/gamification/AchievementCard.tsx
"use client";
import type { Rule } from "@/lib/achievements/rules";

export function AchievementCard({ rule, unlocked, unlockedAt }: { rule: Rule; unlocked: boolean; unlockedAt?: Date }) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        unlocked ? "border-primary bg-primary/5" : "border-border bg-muted/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{unlocked ? "🏆" : "🔒"}</div>
        <div className="flex-1">
          <h3 className="font-medium">{rule.name}</h3>
          <p className="text-sm text-muted">{rule.description}</p>
          {unlocked && unlockedAt && (
            <p className="text-xs text-muted mt-1">
              Desbloqueado: {unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
