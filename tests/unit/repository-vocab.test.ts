// tests/unit/repository-vocab.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '@/lib/db/schema';
import { getOrCreateVocabCard, getDueVocabCards, getDueCardsCount } from '@/lib/db/repository';

describe('vocab card repository', () => {
  beforeEach(async () => {
    await db.cards.clear();
  });

  it('creates a new vocab card with vocab-{lang}- prefix in id (Phase 4)', async () => {
    const card = await getOrCreateVocabCard('padaria', 'panadería', 'b1-alfabeto');
    expect(card.id).toBe('vocab-pt-padaria');
    expect(card.blockId).toBe(0); // vocab is cross-block
    expect(card.language).toBe('pt');
    expect(card.tags).toContain('vocab');
    expect(card.tags).toContain('lang:pt');
  });

  it('returns the same card on a second call (idempotent)', async () => {
    const c1 = await getOrCreateVocabCard('café', 'café', 'b1-alfabeto');
    const c2 = await getOrCreateVocabCard('CAFÉ', 'café', 'b1-alfabeto'); // case-insensitive lookup
    expect(c1.id).toBe(c2.id);
  });

  it('getDueVocabCards returns only vocab-prefixed cards', async () => {
    // Add a vocab card.
    await getOrCreateVocabCard('moça', 'chica', 'b1-alfabeto');
    // Add a non-vocab card directly.
    await db.cards.add({
      id: 'exercise-b1-l1-1',
      blockId: 1,
      lessonId: 'b1-l1',
      contentHash: 'x',
      fsrs: { due: new Date(), stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0, reps: 0, lapses: 0, state: 0, last_review: undefined } as any,
      nextReviewAt: new Date(),
      state: 0,
      reps: 0,
      lapses: 0,
      introducedAt: new Date(),
    });
    const due = await getDueVocabCards(10);
    expect(due.length).toBe(1);
    expect(due[0]?.id).toBe('vocab-pt-moça');
  });

  it('getDueVocabCards respects limit', async () => {
    await getOrCreateVocabCard('a', 'a', 'b1');
    await getOrCreateVocabCard('b', 'b', 'b1');
    await getOrCreateVocabCard('c', 'c', 'b1');
    const due = await getDueVocabCards(2);
    expect(due.length).toBe(2);
  });

  it('getDueCardsCount counts all due cards (vocab + exercise)', async () => {
    await getOrCreateVocabCard('padaria', 'p', 'b1');
    await db.cards.add({
      id: 'exercise-x',
      blockId: 1,
      lessonId: 'b1',
      contentHash: 'x',
      fsrs: {} as any,
      nextReviewAt: new Date(),
      state: 0,
      reps: 0,
      lapses: 0,
      introducedAt: new Date(),
    });
    const count = await getDueCardsCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
