// tests/unit/srs-snapshot.test.ts
// @vitest-environment jsdom
// E.3 — Snapshot regressions for FSRS-5 scheduling and XP level mapping.
// Ensures the core scheduling + leveling contracts don't drift silently.
import { describe, it, expect } from "vitest";
import "fake-indexeddb/auto";

describe("SRS snapshot regression", () => {
  it("schedule FSRS-5 para rating Good produce nextReviewAt en el futuro", async () => {
    const { newCard, schedule } = await import("@/lib/srs/fsrs");
    const { RATING } = await import("@/lib/db/schema");
    const now = new Date();
    const card = newCard("e3-snapshot-c1", 1, "l1");
    const result = schedule(card, RATING.Good, now);
    // nextReviewAt must be strictly after `now`
    expect(result.nextReviewAt.getTime()).toBeGreaterThan(now.getTime());
    // reps must increment
    expect(result.reps).toBeGreaterThan(card.reps);
  });

  it("schedule FSRS-5 para rating Again no avanza nextReviewAt infinitamente", async () => {
    const { newCard, schedule } = await import("@/lib/srs/fsrs");
    const { RATING } = await import("@/lib/db/schema");
    const now = new Date();
    const card = newCard("e3-snapshot-c2", 1, "l1");
    const result = schedule(card, RATING.Again, now);
    // Even an Again must produce a future review date (short re-learning step)
    expect(result.nextReviewAt.getTime()).toBeGreaterThanOrEqual(now.getTime());
    // Lapses do NOT increment from a new card (FSRS-5 semantics: only Review→Again)
    expect(result.lapses).toBe(0);
  });

  it("levelFromXp mapping estable — contratos numéricos", async () => {
    // levelFromXp returns a numeric level (0, 1, 2, …), NOT a CEFR string.
    // The thresholds are: level 0 = <100 XP, level 1 = 100-499, level 2 = 500-1399, level 3 = 1400-2999
    const { levelFromXp } = await import("@/lib/xp/calculator");
    expect(levelFromXp(0)).toBe(0);      // below 100 XP → level 0
    expect(levelFromXp(99)).toBe(0);     // still level 0
    expect(levelFromXp(100)).toBe(1);    // level 1 starts at 100 XP
    expect(levelFromXp(500)).toBe(2);    // level 2 starts at 500 XP
    expect(levelFromXp(2500)).toBe(3);   // level 3 starts at 1400 XP
    // Monotone: higher XP never maps to a lower level
    expect(levelFromXp(5000)).toBeGreaterThanOrEqual(levelFromXp(2500));
  });
});
