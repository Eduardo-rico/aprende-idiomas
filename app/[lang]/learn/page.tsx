// app/[lang]/learn/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDueCards, getDueCardsByTag } from "@/lib/db/repository";
import { FSRS_CONFIG } from "@/lib/srs/config";
import type { Exercise } from "@/lib/data/zod-schemas";
import { TagFilterBar } from "@/components/tags/TagFilterBar";

interface DueCounts { review: number; newCards: number; }

export default function LearnPage() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const [counts, setCounts] = useState<DueCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  // The bar shows whatever known tags have at least 1 card. We derive this
  // from a fixed set: "vocab" + a few popular story/block tags. The
  // counts next to each chip are computed on load.
  const [availableTags, setAvailableTags] = useState<string[]>(["vocab"]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [byId, setById] = useState<Map<string, Exercise>>(new Map());
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Always show "vocab" if it has any cards. Other families (story:X,
      // block:N) are shown only if they have at least 1 card.
      const vocabCount = await import("@/lib/db/repository").then((m) => m.getCardsByTagCount("vocab"));
      const next: Record<string, number> = { vocab: vocabCount };
      const avail: string[] = [];
      if (vocabCount > 0) avail.push("vocab");
      setTagCounts(next);
      setAvailableTags(avail);
      setLoading(false);
    })();
  }, []);

  // Carga todos los blocks del idioma activo y construye el Map id→exercise.
  // Se cachea en el state — solo se vuelve a fetch cuando cambia el lang.
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/blocks?lang=${lang}`);
      if (!res.ok) return;
      const { exercises } = (await res.json()) as { exercises: Exercise[] };
      setById(new Map(exercises.map((e) => [e.id, e])));
    })();
  }, [lang]);

  useEffect(() => {
    (async () => {
      const options = { cap: FSRS_CONFIG.daily_review_cap, newCardsPerDay: FSRS_CONFIG.new_cards_per_day };
      const due = activeTags.size === 0
        ? await getDueCards(new Date(), FSRS_CONFIG.daily_review_cap, options)
        : await getDueCardsByTag(Array.from(activeTags), new Date(), FSRS_CONFIG.daily_review_cap, options);
      const review = due.filter((c) => c.state > 0).length;
      const newCards = due.filter((c) => c.state === 0).length;
      setCounts({ review, newCards });
    })();
  }, [activeTags]);

  const startDailyMix = async () => {
    const options = { cap: FSRS_CONFIG.daily_review_cap, newCardsPerDay: FSRS_CONFIG.new_cards_per_day };
    const due = activeTags.size === 0
      ? await getDueCards(new Date(), FSRS_CONFIG.daily_review_cap, options)
      : await getDueCardsByTag(Array.from(activeTags), new Date(), FSRS_CONFIG.daily_review_cap, options);
    if (due.length === 0) { router.push(`/${lang}/blocks`); return; }
    const first = due.map((card) => byId.get(card.id)).find(Boolean);
    if (!first) { router.push(`/${lang}/blocks`); return; }
    // E6: the daily mix always goes to the multi-card /review session,
    // which interleaves reviews + new cards across concepts/types. (It
    // used to route the no-filter case to a single lesson's /practice,
    // which defeated interleaving.)
    router.push(`/${lang}/review`);
  };

  const total = counts ? counts.review + counts.newCards : 0;

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 text-center">
      <h1 className="font-display text-4xl">Sesión de estudio</h1>
      <div className="text-6xl font-display">{loading ? "…" : total}</div>
      <p className="text-muted">tarjetas listas para revisar</p>
      {counts && (
        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">{counts.review}</span> repasos
          <span className="mx-2">·</span>
          <span className="font-medium text-foreground">{counts.newCards}</span> nuevas
        </p>
      )}
      <TagFilterBar
        available={availableTags}
        selected={activeTags}
        counts={tagCounts}
        onChange={setActiveTags}
      />
      <button
        onClick={startDailyMix}
        disabled={loading || total === 0}
        className="w-full p-4 bg-primary text-fg rounded-xl font-medium disabled:opacity-50"
      >
        Empezar sesión →
      </button>
    </div>
  );
}
