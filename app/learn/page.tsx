// app/learn/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDueCards, getDueCardsByTag } from "@/lib/db/repository";
import { FSRS_CONFIG } from "@/lib/srs/config";
import type { Exercise } from "@/lib/data/zod-schemas";
import { TagFilterBar } from "@/components/tags/TagFilterBar";
import b1Data from "@/lib/data/blocks/b1.json";
import b2Data from "@/lib/data/blocks/b2.json";
import b3Data from "@/lib/data/blocks/b3.json";
import b4Data from "@/lib/data/blocks/b4.json";
import b5Data from "@/lib/data/blocks/b5.json";
import b6Data from "@/lib/data/blocks/b6.json";
import b7Data from "@/lib/data/blocks/b7.json";
import b8Data from "@/lib/data/blocks/b8.json";
import b10Data from "@/lib/data/blocks/b10.json";

interface DueCounts { review: number; newCards: number; }

export default function LearnPage() {
  const [counts, setCounts] = useState<DueCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  // The bar shows whatever known tags have at least 1 card. We derive this
  // from a fixed set: "vocab" + a few popular story/block tags. The
  // counts next to each chip are computed on load.
  const [availableTags, setAvailableTags] = useState<string[]>(["vocab"]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
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
    if (due.length === 0) { router.push("/blocks"); return; }
    // CRITICAL FIX (I6): single in-memory lookup, no N+1 dynamic imports.
    const allExercises: Exercise[] = [
      ...(b1Data as Exercise[]),
      ...(b2Data as Exercise[]),
      ...(b3Data as Exercise[]),
      ...(b4Data as Exercise[]),
      ...(b5Data as Exercise[]),
      ...(b6Data as Exercise[]),
      ...(b7Data as Exercise[]),
      ...(b8Data as Exercise[]),
      ...(b10Data as Exercise[]),
    ];
    const byId = new Map(allExercises.map((e) => [e.id, e]));
    const first = due.map((card) => byId.get(card.id)).find(Boolean);
    if (!first) { router.push("/blocks"); return; }
    // When a tag filter is active, go to /review so the popover can show
    // the active filter; otherwise reuse the original lesson-scoped path
    // (faster, no popover).
    if (activeTags.size > 0) {
      router.push("/review");
    } else {
      router.push(`/practice/${first.lessonId}`);
    }
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
