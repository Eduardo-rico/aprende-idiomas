// components/vocab/VocabDrill.tsx
// Self-contained vocab drill — does NOT reuse ExerciseRunner because vocab
// cards have a different shape (word→meaning, single direction, audio from
// the catalog hash, not from an exercise audio ref). Building it standalone
// keeps the session/conceptIds/audio wiring aligned with how vocab works
// rather than forcing vocab into the exercise pipeline.
'use client';
import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getAllVocab, lookupVocab, type VocabCatalogItem } from '@/lib/vocab/catalog';
import {
  getOrCreateVocabCard,
  getDueVocabCards,
  submitAnswer,
  recordSessionEnd,
  addXp,
  checkAndUnlockAchievements,
} from '@/lib/db/repository';
import { xpForRating } from '@/lib/xp/calculator';
import { useSettings } from '@/lib/stores/settings';
import { useSession } from '@/lib/stores/session';
import { db, RATING, type Card } from '@/lib/db/schema';

interface VocabCard { card: Card; item: VocabCatalogItem; }

const BOOTSTRAP_SIZE = 10;
const DAILY_LIMIT = 20;

export function VocabDrill() {
  const { variant, dailyGoalMinutes } = useSettings();
  const { beginSession, endSession, sessionId } = useSession();
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startedAt] = useState(() => new Date());

  // Bootstrap: ensure BOOTSTRAP_SIZE vocab cards exist, then load due cards.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await getAllVocab();
      if (all.length === 0) {
        setLoading(false);
        return;
      }
      // Ensure at least 10 cards exist (creates FSRS rows for new words).
      for (const v of all.slice(0, BOOTSTRAP_SIZE)) {
        const conceptId = v.conceptIds[0] ?? 'general';
        await getOrCreateVocabCard(v.word, v.meaning, conceptId);
      }
      const dueCards = await getDueVocabCards(DAILY_LIMIT);
      // Resolve each Card back to its catalog item (catalog is the source of
      // truth for word/meaning/audioHash).
      const enriched: VocabCard[] = [];
      for (const c of dueCards) {
        const word = c.id.replace(/^vocab-/, '');
        const item = await lookupVocab(word);
        if (item) enriched.push({ card: c, item });
      }
      if (cancelled) return;
      setQueue(enriched);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Begin a session when we have cards; end on unmount.
  useEffect(() => {
    if (queue.length === 0 || sessionId) return;
    (async () => {
      const id = await db.sessions.add({
        startedAt: new Date(),
        blockId: 0,
        lessonId: 'vocab-drill',
        mode: 'drill',
        cardsReviewed: 0,
        correctCount: 0,
        durationMs: 0,
      });
      beginSession(id as number, 'drill');
    })();
  }, [queue.length, sessionId, beginSession]);

  const current = queue[idx];

  const onRate = useCallback(async (rating: 1 | 2 | 3 | 4) => {
    if (!current || !sessionId) return;
    await submitAnswer({
      cardId: current.card.id,
      rating: rating as 1 | 2 | 3 | 4,
      responseMs: Date.now() - startedAt.getTime(),
      mode: 'drill',
      variant,
      conceptIds: current.item.conceptIds,
      blockId: 0,
      sessionId,
    });
    const correct = rating >= RATING.Good;
    if (correct) confetti({ particleCount: 30, spread: 60 });
    const xp = xpForRating(rating as 1 | 2 | 3 | 4);
    if (xp > 0) await addXp(xp);
    setReviewed((n) => n + 1);
    setCorrectCount((n) => n + (correct ? 1 : 0));
    setRevealed(false);
    setIdx((i) => i + 1);
  }, [current, sessionId, variant, startedAt]);

  // End the session once we run out of cards.
  useEffect(() => {
    if (queue.length > 0 && idx >= queue.length) {
      const minutes = Math.max(1, Math.round((Date.now() - startedAt.getTime()) / 60_000));
      (async () => {
        if (sessionId) {
          await recordSessionEnd(sessionId, variant, minutes, reviewed);
        }
        await checkAndUnlockAchievements(dailyGoalMinutes);
        endSession();
      })();
    }
  }, [idx, queue.length, reviewed, sessionId, variant, startedAt, dailyGoalMinutes, endSession]);

  if (loading) {
    return <p className="text-muted-foreground p-8">Cargando vocab…</p>;
  }
  if (queue.length === 0) {
    return (
      <p className="text-muted-foreground p-8">
        No hay vocab para repasar. Lee más historias para ampliar el catálogo.
      </p>
    );
  }
  if (idx >= queue.length) {
    return (
      <div className="p-8 space-y-2 text-center">
        <p className="text-2xl font-display">¡Sesión completa!</p>
        <p className="text-muted-foreground">{correctCount} / {reviewed} correctas</p>
      </div>
    );
  }

  const audioHash = variant === 'br' ? current!.item.audioHash.br : current!.item.audioHash.pt;
  const audioSrc = `/audio/${audioHash}.mp3`;

  return (
    <div className="space-y-6">
      <div className="text-xs text-muted-foreground uppercase">
        {idx + 1} / {queue.length}
      </div>
      <div className="p-8 border-2 border-border rounded-2xl text-center space-y-6">
        <div className="text-xs text-muted uppercase">
          {revealed ? 'Significado' : 'Traduce al español'}
        </div>
        <div className="text-4xl font-display">
          {revealed ? current!.item.meaning : current!.item.word}
        </div>
        <div className="flex justify-center">
          <audio controls src={audioSrc} className="w-full max-w-xs" />
        </div>
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="text-sm text-muted hover:text-foreground"
          >
            [Espacio] para revelar
          </button>
        )}
      </div>
      {revealed && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { r: RATING.Again, label: 'Otra vez', key: '1' },
            { r: RATING.Hard, label: 'Difícil', key: '2' },
            { r: RATING.Good, label: 'Bien', key: '3' },
            { r: RATING.Easy, label: 'Fácil', key: '4' },
          ].map((b) => (
            <button
              key={b.key}
              onClick={() => onRate(b.r)}
              className="px-3 py-2 border border-border rounded-md text-sm hover:bg-muted/30"
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
