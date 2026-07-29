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
import { XpBar } from "./XpBar";
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

      {/* Ola 2: aquí se anunciaba «Nivel actual C2» a los lectores de
          pantalla, derivado del XP a 500 puntos por escalón. Era la misma
          mentira que la barra, pero dicha en voz alta a quien no puede
          verificarla mirando. El nivel MCER real se mide por descriptores
          demostrados (lib/data/cefr.ts) y se anunciará aquí cuando haya
          evidencias que contar; hasta entonces no se afirma nada. */}
      <span className="sr-only" data-testid="user-xp" data-xp={totalXp}>
        {totalXp.toLocaleString("es")} XP de trabajo acumulado
      </span>
      {/* Level numeric for in-app hooks (0..5); not rendered visually. */}
      <span className="sr-only" data-testid="user-level-numeric" data-level={level}>
        {level}
      </span>
    </>
  );
}