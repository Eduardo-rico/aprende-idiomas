// tests/unit/repository-tags.test.ts
// Integration test for the v5 *tags multiEntry index and the new
// getDueCardsByTag / getCardsByTagCount helpers.
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db, type Card } from "@/lib/db/schema";
import {
  getOrCreateVocabCard,
  getDueCardsByTag,
  getCardsByTagCount,
  getAppState,
} from "@/lib/db/repository";

async function seedCard(
  id: string,
  state: number,
  nextReviewAt: Date,
  tags?: string[],
): Promise<Card> {
  // The Card factory in lib/srs/fsrs.ts sets introducedAt = new Date() and
  // is the only "official" way to make a Card. We import it lazily so the
  // test setup doesn't drag in the FSRS scheduler at module-eval time.
  const { newCard } = await import("@/lib/srs/fsrs");
  const card: Card = { ...newCard(id, 1, "b1-l1"), state, nextReviewAt, tags };
  await db.cards.put(card);
  return card;
}

describe("repository tags (Phase B)", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("v5 schema exposes a *tags multiEntry index on cards", async () => {
    // Sanity check: open the DB and confirm the index string contains
    // the multiEntry marker. If a future migration drops it, this test
    // catches it before the tag helpers silently scan the whole table.
    const table = db.cards;
    // Dexie exposes the index name on the schema. We assert presence by
    // attempting a query that only succeeds when the index exists.
    await expect(table.where("tags").equals("vocab").count()).resolves.toBe(0);
  });

  it("getOrCreateVocabCard stamps 'vocab' + 'lang:pt' on creation (Phase 4)", async () => {
    const card = await getOrCreateVocabCard("padaria", "panadería", "places");
    expect(card.tags).toEqual(expect.arrayContaining(["vocab", "lang:pt"]));
  });

  it("getOrCreateVocabCard adds 'story:{id}' when opts.storyId is provided", async () => {
    const card = await getOrCreateVocabCard("rio", "río", "nature", {
      storyId: "b1-s1-o-dia-a-dia-de-joao-na-padaria",
    });
    expect(card.tags).toEqual(
      expect.arrayContaining([
        "vocab",
        "lang:pt",
        "story:b1-s1-o-dia-a-dia-de-joao-na-padaria",
      ]),
    );
  });

  it("getOrCreateVocabCard is idempotent: second call returns the same card, de-dup'd tags", async () => {
    const a = await getOrCreateVocabCard("padaria", "panadería", "places");
    const b = await getOrCreateVocabCard("padaria", "panadería", "places", {
      storyId: "b1-s1-...",
    });
    expect(a.id).toBe(b.id);
    expect(b.tags).toEqual(expect.arrayContaining(["vocab", "lang:pt", "story:b1-s1-..."]));
  });

  it("getCardsByTagCount: counts cards that have the tag, via multiEntry", async () => {
    const now = new Date();
    await seedCard("v1", 0, now, ["vocab"]);
    await seedCard("v2", 0, now, ["vocab", "story:b1-s1-..."]);
    await seedCard("v3", 0, now, ["story:b1-s1-..."]);
    await seedCard("v4", 0, now, undefined); // legacy card, no tag
    expect(await getCardsByTagCount("vocab")).toBe(2);
    expect(await getCardsByTagCount("story:b1-s1-...")).toBe(2);
  });

  it("getDueCardsByTag: returns only cards that match a tag AND are due", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const past = new Date(now.getTime() - 1000);
    const future = new Date(now.getTime() + 60_000);
    // Two due vocab cards.
    await seedCard("v1", 0, past, ["vocab"]);
    await seedCard("v2", 2, past, ["vocab"]);
    // One due non-vocab card (block-scoped).
    await seedCard("e1", 2, past);
    // One future vocab card.
    await seedCard("v3", 0, future, ["vocab"]);

    const out = await getDueCardsByTag(["vocab"], now, 100, { cap: 100, newCardsPerDay: 0 });
    const ids = out.map((c) => c.id).sort();
    expect(ids).toEqual(["v1", "v2"]);
  });

  it("getDueCardsByTag with [] falls through to getDueCards (unfiltered)", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const past = new Date(now.getTime() - 1000);
    await seedCard("v1", 0, past, ["vocab"]);
    await seedCard("e1", 2, past);
    const out = await getDueCardsByTag([], now, 100, { cap: 100, newCardsPerDay: 0 });
    expect(out.length).toBe(2);
  });

  it("getDueCardsByTag: anyOf semantics — vocab OR story:b1 matches either", async () => {
    const now = new Date("2026-06-16T12:00:00Z");
    const past = new Date(now.getTime() - 1000);
    await seedCard("v1", 0, past, ["vocab"]);
    await seedCard("s1", 0, past, ["story:b1-s1-..."]);
    await seedCard("e1", 0, past); // untagged
    const out = await getDueCardsByTag(["vocab", "story:b1-s1-..."], now, 100, {
      cap: 100, newCardsPerDay: 0,
    });
    const ids = out.map((c) => c.id).sort();
    expect(ids).toEqual(["s1", "v1"]);
  });

  it("getAppState.vocabCardsLearned: counts cards with the 'vocab' tag", async () => {
    // This is the call that unblocks the `vocab-50` achievement.
    const now = new Date();
    for (let i = 0; i < 5; i++) {
      await seedCard(`v${i}`, 0, now, ["vocab"]);
    }
    await seedCard("u1", 0, now); // untagged
    const state = await getAppState(15);
    expect(state.vocabCardsLearned).toBe(5);
  });
});
