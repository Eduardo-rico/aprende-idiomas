// components/home/OnboardingCtaClient.tsx
// Client island: checks IndexedDB onboarding state and card count,
// then renders either the diagnostic CTA (first-time users) or the
// session CTA (returning users). Extracted from HomeStatsClient so it
// can be unit-tested in isolation with a mocked db.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db/schema";
import { getDueCardsCount } from "@/lib/db/repository";

interface Props {
  lang: string;
}

interface DueSummary {
  total: number;
  reviews: number;
  newCards: number;
}

export function OnboardingCtaClient({ lang }: Props) {
  const [showDiagnosticCta, setShowDiagnosticCta] = useState<boolean | null>(null);
  const [due, setDue] = useState<DueSummary | null>(null);

  useEffect(() => {
    async function checkOnboarding() {
      const [onboardingDone, cardCount] = await Promise.all([
        db.settings.get("onboardingDone").then((r) => r?.value === true),
        db.cards.count(),
      ]);
      setShowDiagnosticCta(!onboardingDone || cardCount === 0);
    }
    checkOnboarding().catch(() => setShowDiagnosticCta(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    getDueCardsCount()
      .then((n) => {
        if (cancelled) return;
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

  const estMinutes = Math.round((due?.total ?? 0) * 0.4);

  if (showDiagnosticCta === null) return null;

  if (showDiagnosticCta) {
    return (
      <Link
        href={`/${lang}/diagnostic`}
        className="block no-underline bg-diagnostic text-paper rounded-xl px-6 py-5 mb-12 shadow-[var(--shadow-md)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-px"
      >
        <div className="font-display text-[25px] font-semibold flex justify-between items-center leading-tight">
          <span>Hacé el diagnóstico</span>
          <ArrowRight size={22} aria-hidden="true" />
        </div>
        <div className="text-sm opacity-90 mt-1.5">
          15 preguntas · ~5 min · empezamos desde donde estás
        </div>
      </Link>
    );
  }

  return (
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
  );
}
