// tests/unit/repository-cap.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db, type Card, type AnswerEvent } from "@/lib/db/schema";
import { getOrCreateCard, getDueCards, getReviewedCountToday, getNewCardCountToday } from "@/lib/db/repository";
import { newCard } from "@/lib/srs/fsrs";
import { FSRS_CONFIG } from "@/lib/srs/config";

/** Helper: seed a card directly in the cards table with a custom state and
 *  `nextReviewAt`. Bypasses getOrCreateCard so we can set up the exact
 *  mix of (review, new, future, non-due) the test needs. */
async function seedCard(
  id: string,
  state: number,
  nextReviewAt: Date,
  introducedAt: Date = new Date("2025-01-01T00:00:00Z"),
): Promise<Card> {
  const base = newCard(id, 1, "b1-l1");
  const card: Card = { ...base, state, nextReviewAt, introducedAt };
  await db.cards.put(card);
  return card;
}

describe("repository cap + daily mix (T3.4)", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("getDueCards with newCardsPerDay=0 falls back to legacy trim behavior", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    await seedCard("a", 2, new Date(now.getTime() - 1000));
    await seedCard("b", 2, new Date(now.getTime() - 2000));
    await seedCard("c", 2, new Date(now.getTime() - 3000));
    const out = await getDueCards(now, 2); // no options
    expect(out.length).toBe(2);
  });

  it("getDueCards with cap+newCardsPerDay returns at most `cap` total", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    // 3 review cards and 5 new cards, all due.
    for (let i = 0; i < 3; i++) {
      await seedCard(`r${i}`, 2, new Date(now.getTime() - (i + 1) * 1000));
    }
    for (let i = 0; i < 5; i++) {
      await seedCard(`n${i}`, 0, now, new Date(now.getTime() - (i + 1) * 60_000));
    }
    const out = await getDueCards(now, 100, { cap: 4, newCardsPerDay: 10 });
    expect(out.length).toBeLessThanOrEqual(4);
  });

  it("getDueCards review-first ordering: overdue review comes before new", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    await seedCard("n1", 0, now, new Date(now.getTime() - 1000));
    await seedCard("r1", 2, new Date(now.getTime() - 2000));
    await seedCard("r2", 2, new Date(now.getTime() - 3000));
    const out = await getDueCards(now, 100, { cap: 100, newCardsPerDay: 10 });
    // First two cards must be the review cards (most overdue first).
    expect(out[0]!.id).toBe("r2");
    expect(out[1]!.id).toBe("r1");
    // New cards come after the reviews.
    expect(out[2]!.id).toBe("n1");
  });

  it("getDueCards: newCardsPerDay cap limits the new slice even when more are due", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    // 0 reviews, 12 brand-new cards all due.
    for (let i = 0; i < 12; i++) {
      await seedCard(`n${i}`, 0, now, new Date(now.getTime() - (i + 1) * 1000));
    }
    const out = await getDueCards(now, 100, { cap: 100, newCardsPerDay: 3 });
    expect(out.length).toBe(3);
  });

  it("getDueCards: review cards take precedence over new cards when filling cap", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    // 4 reviews and 4 new cards, cap=5.
    for (let i = 0; i < 4; i++) {
      await seedCard(`r${i}`, 2, new Date(now.getTime() - (i + 1) * 1000));
    }
    for (let i = 0; i < 4; i++) {
      await seedCard(`n${i}`, 0, now, new Date(now.getTime() - (i + 1) * 1000));
    }
    const out = await getDueCards(now, 100, { cap: 5, newCardsPerDay: 3 });
    // 4 reviews fill 4 slots, leaving 1 slot for a new card.
    expect(out.length).toBe(5);
    const reviewCount = out.filter((c) => c.state > 0).length;
    const newCount = out.filter((c) => c.state === 0).length;
    expect(reviewCount).toBe(4);
    expect(newCount).toBe(1);
  });

  it("getNewCardCountToday: counts cards introduced since local midnight", async () => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const yesterday = new Date(midnight.getTime() - 1000);
    // Brand-new card, introduced earlier today.
    await seedCard("today1", 0, new Date(), new Date(midnight.getTime() + 1000));
    // Card introduced yesterday.
    await seedCard("yest1", 0, new Date(), yesterday);
    const count = await getNewCardCountToday();
    expect(count).toBe(1);
  });

  it("getReviewedCountToday: counts answer events since local midnight", async () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    // Ensure at least one card exists for the FK target.
    const card = await getOrCreateCard("rev-count", 1, "b1-l1");
    // Add 2 answer events today and 1 yesterday.
    const events: AnswerEvent[] = [
      {
        ts: new Date(midnight.getTime() + 60_000),
        type: "answer",
        cardId: card.id,
        rating: 3,
        correct: true,
        responseMs: 1000,
        mode: "lesson",
        conceptIds: [],
        variant: "br",
      },
      {
        ts: new Date(midnight.getTime() + 120_000),
        type: "answer",
        cardId: card.id,
        rating: 3,
        correct: true,
        responseMs: 1000,
        mode: "lesson",
        conceptIds: [],
        variant: "br",
      },
      {
        ts: new Date(midnight.getTime() - 60_000),
        type: "answer",
        cardId: card.id,
        rating: 3,
        correct: true,
        responseMs: 1000,
        mode: "lesson",
        conceptIds: [],
        variant: "br",
      },
    ];
    await db.events.bulkAdd(events);
    const count = await getReviewedCountToday();
    expect(count).toBe(2);
  });
});
