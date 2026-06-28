// components/progreso/ProgresoShell.tsx
// Manual Lusitano Progreso page. Replaces the legacy shadcn stats page.
// Matches design-mockups/progreso.html.
//
// Layout: eyebrow + h1 + sub, then a 2-tab segmented control
// (Aprendizaje | Logros), then 4 metric tiles, the 90-day heatmap,
// the production/recognition bars, and the mastery list. The "Logros"
// tab does NOT embed — it links to /[lang]/achievements; Aprendizaje is
// the only tab rendered inline.
//
// Aggregations live in lib/stats/aggregations.ts and are pure — this shell
// is the only Dexie touchpoint.
//
// DELTAS: we compare the last 7 days to the 7 days before that (week-over-
// week). The mockup shows "vs mes pasado" but true monthly windows need a
// 28-day trailing comparator; week-over-week reads naturally for new users
// with sparse data and the mockup copy adapts ("semana previa" instead of
// "mes pasado") so we stay honest about the window.
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/db/schema";
import type { AppEvent, ConceptMastery } from "@/lib/db/schema";
import {
  aggregateByDay,
  retention7d,
  responseTimeAvg,
  masteredCount,
  productionVsRecognition,
  vocabProduces,
  masteryRows,
} from "@/lib/stats/aggregations";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MetricCard } from "./MetricCard";
import { Heatmap90 } from "./Heatmap90";
import { BalanceBars } from "./BalanceBars";
import { MasteryList } from "./MasteryList";

type Tab = "aprendizaje" | "logros";

interface ProgresoData {
  retention: number;
  retentionPrev: number;
  speedSec: number;
  speedPrevSec: number;
  mastered: { mastered: number; total: number };
  masteredWeeklyDelta: number;
  vocabProduces: number;
  byDay90: Array<{ date: string; count: number }>;
  balance: { recognition: number; production: number };
  balancePrev: { recognition: number; production: number };
  mastery: ReturnType<typeof masteryRows>;
}

function pct(n: number): number {
  return Math.round(Math.max(0, Math.min(1, n)) * 100);
}

interface Props {
  lang: string;
}

export function ProgresoShell({ lang }: Props) {
  const [tab, setTab] = useState<Tab>("aprendizaje");
  const [data, setData] = useState<ProgresoData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const allEvents: AppEvent[] = await db.events.toArray();
      const mastery: ConceptMastery[] = await db.conceptMastery.toArray();
      if (cancelled) return;

      const now = new Date();
      const day7 = new Date(now);
      day7.setUTCDate(day7.getUTCDate() - 7);
      const day8 = new Date(now);
      day8.setUTCDate(day8.getUTCDate() - 8);
      const day30 = new Date(now);
      day30.setUTCDate(day30.getUTCDate() - 30);
      const day90 = new Date(now);
      day90.setUTCDate(day90.getUTCDate() - 90);

      const events7 = allEvents.filter((e) => e.ts >= day7);
      const eventsPrev = allEvents.filter(
        (e) => e.ts >= day8 && e.ts < day7,
      );
      const events30 = allEvents.filter((e) => e.ts >= day30);
      const events90 = allEvents.filter((e) => e.ts >= day90);

      const retention = retention7d(events7, now);
      const retentionPrev = retention7d(eventsPrev, now);
      const speedSec = responseTimeAvg(events7, now);
      const speedPrevSec = responseTimeAvg(eventsPrev, now);

      const mastered = masteredCount(mastery);

      // "Conceptos dominados" delta: count unique conceptIds touched in
      // the last 7 days that were NOT touched in the previous 7 days —
      // a directional signal of "new ground covered this week", not a
      // true masteryPct change. Cheaper than re-deriving isMastered
      // transitions and faithful to the mockup's "+3 esta semana".
      const lastIds = new Set<string>();
      for (const e of events7) {
        if (e.type === "answer") {
          for (const c of e.conceptIds) lastIds.add(c);
        }
      }
      const prevIds = new Set<string>();
      for (const e of eventsPrev) {
        if (e.type === "answer") {
          for (const c of e.conceptIds) prevIds.add(c);
        }
      }
      const masteredWeeklyDelta = Math.max(
        0,
        Array.from(lastIds).filter((id) => !prevIds.has(id)).length,
      );

      const vocab = vocabProduces(events30, now);
      const byDay90 = aggregateByDay(events90).map((d) => ({
        date: d.date,
        count: d.count,
      }));
      const balance = productionVsRecognition(events7);
      const balancePrev = productionVsRecognition(eventsPrev);
      const rows = masteryRows({ mastery, events: events30, now });

      setData({
        retention,
        retentionPrev,
        speedSec,
        speedPrevSec,
        mastered,
        masteredWeeklyDelta,
        vocabProduces: vocab,
        byDay90,
        balance,
        balancePrev,
        mastery: rows,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const retentionDeltaPts = useMemo(
    () =>
      data ? Math.round((data.retention - data.retentionPrev) * 100) : null,
    [data],
  );
  const speedDeltaSec = useMemo(
    () =>
      data
        ? Math.round((data.speedPrevSec - data.speedSec) * 10) / 10
        : null,
    [data],
  );
  const balanceNote = useMemo(() => {
    if (!data) return "";
    const gap = Math.round(
      (data.balance.recognition - data.balance.production) * 100,
    );
    const prevGap = Math.round(
      (data.balancePrev.recognition - data.balancePrev.production) * 100,
    );
    return gap <= prevGap
      ? `Brecha de ${gap} pts — sana. Las Production Sessions están cerrándola: hace una semana era ${prevGap} pts.`
      : `Brecha de ${gap} pts — Production Sessions ayudan a cerrarla.`;
  }, [data]);

  if (!data) {
    return (
      <div
        className="p-12 text-center text-ink-muted"
        data-testid="progreso-loading"
      >
        Cargando progreso…
      </div>
    );
  }

  return (
    <main
      className="mx-auto max-w-[920px] px-6 pb-24 pt-12"
      data-testid="progreso-shell"
    >
      <Eyebrow>Tu avance</Eyebrow>
      <h1 className="mb-1.5 font-display text-[39px] font-medium tracking-[-.02em]">
        Progresso
      </h1>
      <p className="mb-10 text-[17px] text-ink-muted">
        Lo que de verdad importa: no cuántas tarjetas hiciste, sino cuánto
        retienes y produces.
      </p>

      <div
        role="tablist"
        aria-label="Vistas de progreso"
        className="mb-9 inline-flex overflow-hidden rounded-lg border border-rule-strong"
      >
        <button
          role="tab"
          aria-selected={tab === "aprendizaje"}
          onClick={() => setTab("aprendizaje")}
          className={
            tab === "aprendizaje"
              ? "bg-ink px-[18px] py-2 text-[14px] font-medium text-paper"
              : "bg-transparent px-[18px] py-2 text-[14px] font-medium text-ink-muted"
          }
          data-testid="tab-aprendizaje"
        >
          Aprendizaje
        </button>
        <button
          role="tab"
          aria-selected={tab === "logros"}
          onClick={() => setTab("logros")}
          className={
            tab === "logros"
              ? "bg-ink px-[18px] py-2 text-[14px] font-medium text-paper"
              : "bg-transparent px-[18px] py-2 text-[14px] font-medium text-ink-muted"
          }
          data-testid="tab-logros"
        >
          Logros
        </button>
      </div>

      {tab === "logros" ? (
        <div className="rounded-[10px] border border-rule bg-paper-raised p-6 text-center text-ink-muted shadow-[var(--shadow-xs)]">
          <p className="mb-3">Tus logros viven en su propia página.</p>
          <Link
            href={`/${lang}/achievements`}
            className="inline-block rounded-md border border-rule-strong bg-paper-raised px-4 py-2 text-[14px] font-medium text-ink hover:bg-paper-sunken"
            data-testid="logros-link"
          >
            Abrir Logros →
          </Link>
        </div>
      ) : (
        <>
          <Eyebrow>Resultados de aprendizaje</Eyebrow>
          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Retención a 7 días"
              value={`${pct(data.retention)}`}
              unit="%"
              delta={
                retentionDeltaPts === null
                  ? undefined
                  : `${retentionDeltaPts >= 0 ? "▲" : "▼"} ${retentionDeltaPts >= 0 ? "+" : ""}${retentionDeltaPts}% vs semana previa`
              }
              trend={
                retentionDeltaPts === null
                  ? "flat"
                  : retentionDeltaPts >= 0
                    ? "up"
                    : "down"
              }
              testId="metric-retention"
            />
            <MetricCard
              label="Velocidad de respuesta media"
              value={data.speedSec.toFixed(1)}
              unit="s"
              delta={
                speedDeltaSec === null
                  ? undefined
                  : `▼ de ${data.speedPrevSec.toFixed(0)}s (más automático)`
              }
              trend="up"
              testId="metric-speed"
            />
            <MetricCard
              label="Conceptos dominados"
              value={`${data.mastered.mastered}`}
              unit={`/${data.mastered.total}`}
              delta={`▲ +${data.masteredWeeklyDelta} esta semana`}
              trend="up"
              testId="metric-mastered"
            />
            <MetricCard
              label="Vocab que produces"
              value={`${data.vocabProduces}`}
              delta="▲ activo, no solo pasivo"
              trend="up"
              testId="metric-vocab"
            />
          </div>

          <div className="mt-10">
            <Eyebrow>Constancia · últimos 90 días</Eyebrow>
            <div className="mt-5">
              <Heatmap90 data={data.byDay90} endDate={new Date()} />
            </div>
          </div>

          <div className="mt-10">
            <Eyebrow>Producción vs Reconocimiento</Eyebrow>
            <div className="mt-5">
              <BalanceBars
                recognition={data.balance.recognition}
                production={data.balance.production}
                note={balanceNote}
              />
            </div>
          </div>

          <div className="mt-10">
            <Eyebrow>Maestría por concepto</Eyebrow>
            <div className="mt-5">
              <MasteryList rows={data.mastery} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
