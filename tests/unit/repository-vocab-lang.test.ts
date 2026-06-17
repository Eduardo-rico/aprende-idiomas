// tests/unit/repository-vocab-lang.test.ts
// Phase 4: getOrCreateVocabCard now keys the card id by language so
// different target languages don't collide. Verifies:
//   1. Default `language` is "pt" (back-compat with the 3-arg form).
//   2. A new call with `language: "ru"` creates a separate row from "pt".
//   3. Tags include `lang:{lang}` and `vocab`.
//   4. First-touch migration: a pre-Phase-4 row with the legacy id
//      `vocab-{word}` (no lang) is renamed to `vocab-pt-{word}` on
//      the first call with the new id.
//   5. Re-calling `getOrCreateVocabCard` for the same word+lang does
//      not duplicate.
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db } from "@/lib/db/schema";
import { getOrCreateVocabCard } from "@/lib/db/repository";

describe("getOrCreateVocabCard (Phase 4: language-scoped)", () => {
  beforeEach(async () => {
    await db.cards.clear();
  });

  it("defaults language to 'pt' (back-compat with the 3-arg form)", async () => {
    const card = await getOrCreateVocabCard("bom", "bueno", "b1");
    expect(card.id).toBe("vocab-pt-bom");
    expect(card.language).toBe("pt");
    expect(card.tags).toEqual(expect.arrayContaining(["vocab", "lang:pt"]));
  });

  it("uses an explicit language: 'ru' to create a separate row", async () => {
    const pt = await getOrCreateVocabCard("bom", "bueno", "b1", { language: "pt" });
    const ru = await getOrCreateVocabCard("bom", "хорошо", "b1", { language: "ru" });
    expect(pt.id).toBe("vocab-pt-bom");
    expect(ru.id).toBe("vocab-ru-bom");
    expect(pt.language).toBe("pt");
    expect(ru.language).toBe("ru");
    // Both rows coexist.
    const all = await db.cards.toArray();
    expect(all.length).toBe(2);
  });

  it("stamps story:{storyId} alongside lang:{lang}", async () => {
    const card = await getOrCreateVocabCard("padaria", "panadería", "story", {
      storyId: "b1-s1-joao",
      language: "pt",
    });
    expect(card.tags).toEqual(
      expect.arrayContaining(["vocab", "lang:pt", "story:b1-s1-joao"]),
    );
  });

  it("first-touch migration: renames legacy 'vocab-pão' to 'vocab-pt-pão'", async () => {
    // Pre-Phase-4 row — no lang segment in the id.
    await db.cards.add({
      id: "vocab-pão",
      blockId: 0,
      lessonId: "vocab-b1-alfabeto",
      contentHash: "x",
      fsrs: { due: new Date(), stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0, reps: 0, lapses: 0, state: 0, last_review: undefined } as never,
      nextReviewAt: new Date(),
      state: 0,
      reps: 0,
      lapses: 0,
      introducedAt: new Date(),
      tags: ["vocab"],
    });
    // Caller with the new id triggers the migration.
    const card = await getOrCreateVocabCard("pão", "pan", "b1-alfabeto");
    expect(card.id).toBe("vocab-pt-pão");
    expect(card.language).toBe("pt");
    expect(card.tags).toEqual(expect.arrayContaining(["vocab", "lang:pt"]));
    // The legacy row is gone.
    const legacy = await db.cards.get("vocab-pão");
    expect(legacy).toBeUndefined();
  });

  it("re-calling for the same word+lang does not duplicate", async () => {
    const c1 = await getOrCreateVocabCard("casa", "house", "b1", { language: "pt" });
    const c2 = await getOrCreateVocabCard("CASA", "house", "b1", { language: "pt" });
    expect(c1.id).toBe(c2.id);
    const all = await db.cards.toArray();
    expect(all.length).toBe(1);
  });

  it("back-compat: existing callers without `language` still resolve to 'pt'", async () => {
    // No opts — should default to "pt".
    const c = await getOrCreateVocabCard("livro", "libro", "b1");
    expect(c.id).toBe("vocab-pt-livro");
    expect(c.language).toBe("pt");
  });
});
