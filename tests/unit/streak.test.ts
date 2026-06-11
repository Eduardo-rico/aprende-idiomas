// tests/unit/streak.test.ts
import { describe, it, expect } from "vitest";
import { currentStreak, didStudyToday, isStreakAlive } from "@/lib/streak/streak";
import type { StreakDay } from "@/lib/db/schema";

function day(date: string, minutes: number): StreakDay {
  return { date, minutesStudied: minutes, cardsReviewed: 0, xpEarned: 0 };
}

describe("currentStreak", () => {
  it("returns 0 for empty", () => {
    expect(currentStreak([], "2026-06-09", 15)).toBe(0);
  });

  it("returns 1 if today qualifies", () => {
    expect(currentStreak([day("2026-06-09", 20)], "2026-06-09", 15)).toBe(1);
  });

  it("returns 3 for 3 consecutive qualifying days", () => {
    expect(currentStreak(
      [day("2026-06-07", 20), day("2026-06-08", 20), day("2026-06-09", 20)],
      "2026-06-09", 15
    )).toBe(3);
  });

  it("breaks streak on day below goal", () => {
    expect(currentStreak(
      [day("2026-06-07", 20), day("2026-06-08", 10), day("2026-06-09", 20)],
      "2026-06-09", 15
    )).toBe(1);
  });

  it("stops counting at gap", () => {
    expect(currentStreak(
      [day("2026-06-05", 20), day("2026-06-06", 20), day("2026-06-09", 20)],
      "2026-06-09", 15
    )).toBe(1);
  });
});

describe("didStudyToday", () => {
  it("true if minutes >= goal", () => {
    expect(didStudyToday([day("2026-06-09", 20)], "2026-06-09", 15)).toBe(true);
  });
  it("false if minutes < goal", () => {
    expect(didStudyToday([day("2026-06-09", 10)], "2026-06-09", 15)).toBe(false);
  });
  it("false if no data for today", () => {
    expect(didStudyToday([], "2026-06-09", 15)).toBe(false);
  });
});

describe("isStreakAlive", () => {
  it("true if last day was today or yesterday", () => {
    expect(isStreakAlive([day("2026-06-09", 20)], "2026-06-09")).toBe(true);
    expect(isStreakAlive([day("2026-06-08", 20), day("2026-06-09", 20)], "2026-06-09")).toBe(true);
  });
  it("false if last day was 3+ days ago", () => {
    expect(isStreakAlive([day("2026-06-06", 20)], "2026-06-09")).toBe(false);
  });
});
