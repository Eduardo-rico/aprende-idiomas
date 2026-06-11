// tests/unit/repository.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db, type AnswerEvent } from "@/lib/db/schema";
import { getOrCreateCard, getDueCards } from "@/lib/db/repository";

describe("repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("getOrCreateCard: returns existing or creates new", async () => {
    const a = await getOrCreateCard("id1", 1, "b1-l1");
    const b = await getOrCreateCard("id1", 1, "b1-l1");
    expect(a.id).toBe(b.id);
    expect(a.introducedAt).toEqual(b.introducedAt);
  });

  it("getDueCards: returns cards due now or earlier", async () => {
    await getOrCreateCard("due1", 1, "b1-l1");
    await getOrCreateCard("due2", 1, "b1-l1");
    await getOrCreateCard("future", 1, "b1-l1");
    await db.cards.update("due1", { nextReviewAt: new Date(Date.now() - 1000) });
    await db.cards.update("due2", { nextReviewAt: new Date(Date.now() - 500) });
    await db.cards.update("future", { nextReviewAt: new Date(Date.now() + 100000) });
    const due = await getDueCards(new Date(), 10);
    expect(due.map(c => c.id).sort()).toEqual(["due1", "due2"]);
  });

  it("submitAnswer: atomic transaction across cards, events, mastery, sessions (C4)", async () => {
    await getOrCreateCard("ans1", 1, "b1-l1");
    const sid = (await db.sessions.add({
      startedAt: new Date(), blockId: 1, lessonId: "b1-l1", mode: "lesson", cardsReviewed: 0, correctCount: 0, durationMs: 0,
    })) as number;

    const { submitAnswer } = await import("@/lib/db/repository");
    await submitAnswer({
      cardId: "ans1", rating: 3, responseMs: 1200, mode: "lesson", variant: "br", conceptIds: ["b1-fonema-vogais"], blockId: 1, sessionId: sid,
    });

    // All 4 stores updated
    const updatedCard = await db.cards.get("ans1");
    expect(updatedCard?.reps).toBe(1);
    expect(updatedCard?.state).toBeGreaterThan(0);

    const events = await db.events.toArray();
    expect(events).toHaveLength(1);
    expect((events[0] as AnswerEvent)?.conceptIds).toEqual(["b1-fonema-vogais"]);

    const mastery = await db.conceptMastery.get("b1-fonema-vogais");
    expect(mastery?.exposureCount).toBe(1);
    expect(mastery?.correctCount).toBe(1);

    const session = await db.sessions.get(sid);
    expect(session?.cardsReviewed).toBe(1);
    expect(session?.correctCount).toBe(1);
  });
});
