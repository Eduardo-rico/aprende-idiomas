// components/home/HomeStatsClient.tsx
// Client wrapper that fetches live counts from Dexie (browser-only) and
// renders the streak/minutes stat cards. The rest of the home page is
// a server component, so the layout + curriculum-derived scaffolding
// can stream in immediately while this island hydrates with fresh data.
//
// The CTA (diagnostic vs session) is delegated to OnboardingCtaClient
// so it can read from db independently and be unit-tested in isolation.
"use client";
import { StreakRing } from "./StreakRing";
import { MinutesRing } from "./MinutesRing";
import { XpBar, levelFromXp } from "./XpBar";
import { OnboardingCtaClient } from "./OnboardingCtaClient";
import { useStreakStatus } from "@/lib/hooks/useStreakStatus";
import { useXpStatus } from "@/lib/hooks/useXpStatus";
import { useSettings } from "@/lib/stores/settings";

interface Props {
  lang: string;
}

export function HomeStatsClient({ lang }: Props) {
  const { currentStreak, todayMinutes, isStreakAlive } = useStreakStatus();
  const { dailyGoalMinutes } = useSettings();
  const { total: totalXp, progress, level } = useXpStatus();

  const minutesMax = Math.max(1, dailyGoalMinutes);
  // XpBar progress: derive the band's xp span from levelProgress.
  const xpCurrent = Math.round(progress.pct * Math.max(progress.end - progress.start, 1));
  const xpNext = Math.max(progress.end - progress.start, 1);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-paper-raised border border-rule rounded-[10px] p-4 flex items-center gap-4 shadow-[var(--shadow-xs)]">
          <StreakRing value={currentStreak} max={30} />
          <div>
            <div className="font-display text-[25px] font-semibold leading-none">
              {currentStreak} días
            </div>
            <div className="text-[13px] text-ink-muted mt-1">
              {isStreakAlive ? "de racha viva" : "racha por empezar"}
            </div>
          </div>
        </div>
        <div className="bg-paper-raised border border-rule rounded-[10px] p-4 flex items-center gap-4 shadow-[var(--shadow-xs)]">
          <MinutesRing value={todayMinutes} max={minutesMax} />
          <div>
            <div className="font-display text-[25px] font-semibold leading-none">
              {Math.round(todayMinutes)} / {dailyGoalMinutes}
            </div>
            <div className="text-[13px] text-ink-muted mt-1">minutos de hoy</div>
          </div>
        </div>
      </div>

      {/* XpBar accepts current/nextLevel/totalXp; fall back to 0 until hooks hydrate. */}
      <XpBar current={xpCurrent} nextLevel={xpNext} totalXp={totalXp || 0} />

      {/* CTA switches between diagnostic (new users) and session (returning users).
          Extracted into a client island that reads db independently. */}
      <OnboardingCtaClient lang={lang} />

      {/* Hidden marker for tests + a11y — exposes the current level so
          screen readers can announce it without scraping the bar. */}
      <span className="sr-only" data-testid="user-level" data-level={levelFromXp(totalXp)}>
        Nivel actual {levelFromXp(totalXp)}
      </span>
      {/* Level numeric for in-app hooks (0..5); not rendered visually. */}
      <span className="sr-only" data-testid="user-level-numeric" data-level={level}>
        {level}
      </span>
    </>
  );
}