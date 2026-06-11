// tests/unit/xp-calculator.test.ts
import { describe, it, expect } from "vitest";
import { xpForRating, xpForEvent, levelFromXp, levelProgress } from "@/lib/xp/calculator";
import type { Rating } from "@/lib/db/schema";

describe("xpForRating", () => {
  it("Again (1) = 0", () => expect(xpForRating(1 as Rating)).toBe(0));
  it("Hard (2) = 0", () => expect(xpForRating(2 as Rating)).toBe(0));
  it("Good (3) = 1", () => expect(xpForRating(3 as Rating)).toBe(1));
  it("Easy (4) = 5", () => expect(xpForRating(4 as Rating)).toBe(5));
});

describe("xpForEvent", () => {
  it("lesson_complete = 30", () => expect(xpForEvent("lesson_complete")).toBe(30));
  it("streak_day = 20", () => expect(xpForEvent("streak_day")).toBe(20));
  it("achievement_unlocked = 100", () => expect(xpForEvent("achievement_unlocked")).toBe(100));
  it("story_completed = 10", () => expect(xpForEvent("story_completed")).toBe(10));
  it("level_up = 0", () => expect(xpForEvent("level_up")).toBe(0));
});

describe("levelFromXp", () => {
  it("0 → 0", () => expect(levelFromXp(0)).toBe(0));
  it("99 → 0", () => expect(levelFromXp(99)).toBe(0));
  it("100 → 1", () => expect(levelFromXp(100)).toBe(1));
  it("500 → 2", () => expect(levelFromXp(500)).toBe(2));
  it("1400 → 3", () => expect(levelFromXp(1400)).toBe(3));
  it("3000 → 4", () => expect(levelFromXp(3000)).toBe(4));
  it("5500 → 5", () => expect(levelFromXp(5500)).toBe(5));
});

describe("levelProgress", () => {
  it("at start of level", () => {
    const p = levelProgress(100);
    expect(p.current).toBe(1);
    expect(p.start).toBe(0);
    expect(p.end).toBe(500);
    expect(p.pct).toBe(0);
  });
  it("midway", () => {
    const p = levelProgress(250);
    expect(p.pct).toBeCloseTo((250 - 100) / (500 - 100), 2);
  });
});
