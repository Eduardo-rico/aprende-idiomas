// tests/unit/achievements-rules.test.ts
import { describe, it, expect } from "vitest";
import { RULES, checkAndUnlock, AppState } from "@/lib/achievements/rules";

function state(overrides: Partial<AppState> = {}): AppState {
  return {
    totalAnswers: 0,
    currentStreak: 0,
    completedBlocks: [],
    perfectLessons: 0,
    storiesRead: 0,
    vocabCardsLearned: 0,
    conceptsMastery80: 0,
    diagnosticCount: 0,
    variantsUsed: new Set(),
    ...overrides,
  };
}

describe("RULES", () => {
  it("has at least 18 rules", () => {
    expect(RULES.length).toBeGreaterThanOrEqual(18);
  });

  it("every rule has id, name, description, check", () => {
    for (const r of RULES) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.description).toBeTruthy();
      expect(typeof r.check).toBe("function");
    }
  });

  it("rule ids are unique", () => {
    const ids = new Set(RULES.map((r) => r.id));
    expect(ids.size).toBe(RULES.length);
  });
});

describe("specific rules", () => {
  it("first-card", () => {
    const r = RULES.find((r) => r.id === "first-card")!;
    expect(r.check(state({ totalAnswers: 0 }))).toBe(false);
    expect(r.check(state({ totalAnswers: 1 }))).toBe(true);
  });

  it("streak-7", () => {
    const r = RULES.find((r) => r.id === "streak-7")!;
    expect(r.check(state({ currentStreak: 6 }))).toBe(false);
    expect(r.check(state({ currentStreak: 7 }))).toBe(true);
  });

  it("block-1-complete", () => {
    const r = RULES.find((r) => r.id === "block-1-complete")!;
    expect(r.check(state({ completedBlocks: [] }))).toBe(false);
    expect(r.check(state({ completedBlocks: [1] }))).toBe(true);
  });

  it("br-explorer dispara con 'pt-br' canónico", () => {
    const r = RULES.find((r) => r.id === "br-explorer")!;
    expect(r.check(state({ variantsUsed: new Set(["pt-br"]) }))).toBe(true);
    // belt-and-suspenders: legacy "br" también dispara
    expect(r.check(state({ variantsUsed: new Set(["br"]) }))).toBe(true);
  });

  it("pt-explorer dispara con 'pt-pt' canónico", () => {
    const r = RULES.find((r) => r.id === "pt-explorer")!;
    expect(r.check(state({ variantsUsed: new Set(["pt-pt"]) }))).toBe(true);
    // belt-and-suspenders: legacy "pt" también dispara
    expect(r.check(state({ variantsUsed: new Set(["pt"]) }))).toBe(true);
  });

  it("br-explorer y pt-explorer son mutuamente excluyentes", () => {
    const br = RULES.find((r) => r.id === "br-explorer")!;
    const pt = RULES.find((r) => r.id === "pt-explorer")!;
    // Solo pt-br → br-explorer, NO pt-explorer
    expect(br.check(state({ variantsUsed: new Set(["pt-br"]) }))).toBe(true);
    expect(pt.check(state({ variantsUsed: new Set(["pt-br"]) }))).toBe(false);
    // Solo pt-pt → pt-explorer, NO br-explorer
    expect(br.check(state({ variantsUsed: new Set(["pt-pt"]) }))).toBe(false);
    expect(pt.check(state({ variantsUsed: new Set(["pt-pt"]) }))).toBe(true);
  });
});

describe("checkAndUnlock", () => {
  it("returns newly unlocked rules", () => {
    const s = state({ totalAnswers: 1 });
    const newUnlocks = checkAndUnlock(new Set(), s);
    expect(newUnlocks.map((r) => r.id)).toContain("first-card");
  });

  it("does not return already-unlocked", () => {
    const s = state({ totalAnswers: 1 });
    const newUnlocks = checkAndUnlock(new Set(["first-card"]), s);
    expect(newUnlocks.map((r) => r.id)).not.toContain("first-card");
  });

  it("returns [] when nothing new", () => {
    const allIds = new Set(RULES.map((r) => r.id));
    const newUnlocks = checkAndUnlock(allIds, state({}));
    expect(newUnlocks).toEqual([]);
  });
});
