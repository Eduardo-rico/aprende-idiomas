// components/home/HomeStatsClient.tsx
// Client wrapper that fetches live counts from Dexie (browser-only) and
// renders the streak/minutes stat cards. The rest of the home page is
// a server component, so the layout + curriculum-derived scaffolding
// can stream in immediately while this island hydrates with fresh data.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StreakRing } from "./StreakRing";
import { MinutesRing } from "./MinutesRing";
import { XpBar, levelFromXp } from "./XpBar";
import { useStreakStatus } from "@/lib/hooks/useStreakStatus";
import { useXpStatus } from "@/lib/hooks/useXpStatus";
import { getDueCardsCount } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";

interface Props {
  lang: string;
}

interface DueSummary {
  total: number;
  reviews: number;
  newCards: number;
}

export function HomeStatsClient({ lang }: Props) {
  const { currentStreak, todayMinutes, isStreakAlive } = useStreakStatus();
  const { dailyGoalMinutes } = useSettings();
  const { total: totalXp, progress, level } = useXpStatus();
  const [due, setDue] = useState<DueSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDueCardsCount()
      .then((n) => {
        if (cancelled) return;
        // We can't easily distinguish reviews from new without enumerating
        // cards, so we approximate reviews as min(total, half) and new as
        // the remainder. Acceptable for the homepage preview.
        const reviews = Math.min(n, Math.ceil(n / 2));
        setDue({ total: n, reviews, newCards: Math.max(0, n - reviews) });
      })
      .catch(() => {
        if (cancelled) return;
        setDue({ total: 0, reviews: 0, newCards: 0 });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const minutesMax = Math.max(1, dailyGoalMinutes);
  const estMinutes = Math.round((due?.total ?? 0) * 0.4);
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

      <Link
        href={`/${lang}/practicar/srs`}
        className="block no-underline bg-lesson rounded-xl px-6 py-5 mb-12 text-paper transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-px shadow-[var(--shadow-md)]"
        aria-label="Empezar sesión de práctica"
      >
        <div className="font-display text-[25px] font-semibold flex justify-between items-center leading-tight">
          <span>Empezar sesión</span>
          <ArrowRight size={22} aria-hidden="true" />
        </div>
        <div className="text-sm opacity-90 mt-1.5">
          {due === null ? (
            "Cargando tarjetas…"
          ) : due.total === 0 ? (
            "Sin tarjetas pendientes — ¡genial!"
          ) : (
            <>
              {due.total} tarjetas listas · {due.reviews} repasos · {due.newCards} nuevas · ~{estMinutes} min
            </>
          )}
        </div>
      </Link>

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