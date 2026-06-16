// tests/unit/review-queue.test.ts
import { describe, it, expect } from "vitest";
import { buildDueQueue } from "@/lib/srs/review-queue";
import { type Card } from "@/lib/db/schema";
import { newCard } from "@/lib/srs/fsrs";

function makeCard(
  id: string,
  state: number,
  nextReviewAt: Date,
  introducedAt: Date = new Date("2025-01-01T00:00:00Z"),
): Card {
  const base = newCard(id, 1, "b1-l1");
  return { ...base, state, nextReviewAt, introducedAt };
}

describe("buildDueQueue (T3.8)", () => {
  it("empty input returns two empty arrays", () => {
    const out = buildDueQueue([], { cap: 10, newCardsPerDay: 5 });
    expect(out.review).toEqual([]);
    expect(out.newCards).toEqual([]);
  });

  it("reviews only: cap limits review slice", () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const cards: Card[] = [
      makeCard("r0", 2, new Date(now.getTime() - 5000)),
      makeCard("r1", 2, new Date(now.getTime() - 4000)),
      makeCard("r2", 2, new Date(now.getTime() - 3000)),
      makeCard("r3", 2, new Date(now.getTime() - 2000)),
    ];
    const out = buildDueQueue(cards, { cap: 2, newCardsPerDay: 5 });
    expect(out.review.length).toBe(2);
    // Most overdue first.
    expect(out.review[0]!.id).toBe("r0");
    expect(out.review[1]!.id).toBe("r1");
    expect(out.newCards).toEqual([]);
  });

  it("new only: newCardsPerDay limits the new slice", () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const cards: Card[] = [
      makeCard("n0", 0, now, new Date(now.getTime() - 5000)),
      makeCard("n1", 0, now, new Date(now.getTime() - 4000)),
      makeCard("n2", 0, now, new Date(now.getTime() - 3000)),
    ];
    const out = buildDueQueue(cards, { cap: 100, newCardsPerDay: 2 });
    expect(out.newCards.length).toBe(2);
    expect(out.newCards[0]!.id).toBe("n0");
    expect(out.newCards[1]!.id).toBe("n1");
    expect(out.review).toEqual([]);
  });

  it("mixed: review cards take precedence over new cards when filling cap", () => {
    const now = new Date("2026-06-16T12:00:00Z");
    // 4 reviews (most overdue first → r0 first) + 4 new (oldest introduction first → n0 first).
    const cards: Card[] = [
      makeCard("r0", 2, new Date(now.getTime() - 1000)),
      makeCard("r1", 2, new Date(now.getTime() - 2000)),
      makeCard("r2", 2, new Date(now.getTime() - 3000)),
      makeCard("r3", 2, new Date(now.getTime() - 4000)),
      makeCard("n0", 0, now, new Date(now.getTime() - 1000)),
      makeCard("n1", 0, now, new Date(now.getTime() - 2000)),
      makeCard("n2", 0, now, new Date(now.getTime() - 3000)),
      makeCard("n3", 0, now, new Date(now.getTime() - 4000)),
    ];
    // cap=5, newCardsPerDay=3: reviews fill 4 slots (most overdue first),
    // 1 slot left for the oldest new card.
    const out = buildDueQueue(cards, { cap: 5, newCardsPerDay: 3 });
    expect(out.review.length).toBe(4);
    expect(out.review.map((c) => c.id)).toEqual(["r3", "r2", "r1", "r0"]);
    expect(out.newCards.length).toBe(1);
    expect(out.newCards[0]!.id).toBe("n3");
  });

  it("newCardsPerDay is a HARD MAX, not a forced minimum: many reviews → 0 new", () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const cards: Card[] = [
      ...[1000, 2000, 3000, 4000, 5000].map((offset, i) =>
        makeCard(`r${i}`, 2, new Date(now.getTime() - offset)),
      ),
      makeCard("n0", 0, now, new Date(now.getTime() - 1000)),
    ];
    // cap=3 → all 3 slots go to reviews, none left for new (even though
    // newCardsPerDay=10 would allow 10 new cards).
    const out = buildDueQueue(cards, { cap: 3, newCardsPerDay: 10 });
    expect(out.review.length).toBe(3);
    expect(out.newCards.length).toBe(0);
  });

  it("no reviews: new cards fill the cap up to newCardsPerDay", () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const cards: Card[] = [
      makeCard("n0", 0, now, new Date(now.getTime() - 1000)),
      makeCard("n1", 0, now, new Date(now.getTime() - 2000)),
      makeCard("n2", 0, now, new Date(now.getTime() - 3000)),
      makeCard("n3", 0, now, new Date(now.getTime() - 4000)),
    ];
    const out = buildDueQueue(cards, { cap: 100, newCardsPerDay: 3 });
    expect(out.newCards.length).toBe(3);
    expect(out.review.length).toBe(0);
  });

  it("zero cap: nothing is returned", () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const cards: Card[] = [
      makeCard("r0", 2, new Date(now.getTime() - 1000)),
      makeCard("n0", 0, now, new Date(now.getTime() - 1000)),
    ];
    const out = buildDueQueue(cards, { cap: 0, newCardsPerDay: 5 });
    expect(out.review).toEqual([]);
    expect(out.newCards).toEqual([]);
  });
});
