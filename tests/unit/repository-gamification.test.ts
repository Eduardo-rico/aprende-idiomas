// tests/unit/repository-gamification.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db, type AnswerEvent } from "@/lib/db/schema";
import {
  addXp,
  emitStreakDayIfQualified,
  getStreakStatus,
  getTotalXp,
  unlockAchievement,
  getUnlockedAchievements,
  checkAndUnlockAchievements,
  recordSessionEnd,
} from "@/lib/db/repository";

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Local ISO date string for today / offset by ±days */
function localDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function seedStreakDay(date: string, minutes: number, xpEarned = 0) {
  await db.streak.put({ date, minutesStudied: minutes, cardsReviewed: 0, xpEarned });
}

// ─── addXp ────────────────────────────────────────────────────────────────────

describe("addXp", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("starts at 0 and accumulates", async () => {
    const r1 = await addXp(50);
    expect(r1.before).toBe(0);
    expect(r1.after).toBe(50);
    expect(r1.leveledUp).toBe(false);

    const r2 = await addXp(60);
    expect(r2.before).toBe(50);
    expect(r2.after).toBe(110);
    // 0→50: level 0; 50→110: crosses 100 → level 1
    expect(r2.leveledUp).toBe(true);
  });

  it("emits one level_up event per level crossed (0→600 crosses levels 1 and 2)", async () => {
    // levelFromXp: 0→0, 100→1, 500→2
    // 0 + 600 = 600 XP → level 2, so 2 level_up events
    const result = await addXp(600);
    expect(result.leveledUp).toBe(true);

    const events = await db.events.filter((e) => e.type === "level_up").toArray();
    expect(events.length).toBe(2);
    // payloads should be level 1 and level 2
    const levels = events.map((e) => (e as { payload: { level: number } } & typeof e).payload.level as number).sort();
    expect(levels).toEqual([1, 2]);
  });

  it("does not emit level_up when no level boundary crossed", async () => {
    await addXp(600); // reaches level 2, emits 2 events
    // Clear events for clarity
    await db.events.clear();
    // Add 10 more (stays at level 2)
    const r = await addXp(10);
    expect(r.leveledUp).toBe(false);
    const events = await db.events.filter((e) => e.type === "level_up").toArray();
    expect(events.length).toBe(0);
  });

  it("getTotalXp returns accumulated value", async () => {
    await addXp(40);
    await addXp(60);
    expect(await getTotalXp()).toBe(100);
  });
});

// ─── emitStreakDayIfQualified ─────────────────────────────────────────────────

describe("emitStreakDayIfQualified", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("returns false when today has no streak row", async () => {
    const result = await emitStreakDayIfQualified(15);
    expect(result).toBe(false);
    const events = await db.events.filter((e) => e.type === "streak_day").toArray();
    expect(events.length).toBe(0);
  });

  it("returns false when today is below goal", async () => {
    await seedStreakDay(localDate(), 10); // below 15
    const result = await emitStreakDayIfQualified(15);
    expect(result).toBe(false);
  });

  it("returns true, emits streak_day event, and adds 20 XP when today qualifies", async () => {
    await seedStreakDay(localDate(), 20); // 20 >= 15
    const result = await emitStreakDayIfQualified(15);
    expect(result).toBe(true);

    const events = await db.events.filter((e) => e.type === "streak_day").toArray();
    expect(events.length).toBe(1);

    const totalXp = await getTotalXp();
    expect(totalXp).toBe(20);
  });

  it("is idempotent — second call same day returns false and does not double-count XP or events", async () => {
    await seedStreakDay(localDate(), 20);
    await emitStreakDayIfQualified(15);
    const second = await emitStreakDayIfQualified(15);
    expect(second).toBe(false);

    const events = await db.events.filter((e) => e.type === "streak_day").toArray();
    expect(events.length).toBe(1);

    const totalXp = await getTotalXp();
    expect(totalXp).toBe(20); // not 40
  });
});

// ─── getStreakStatus (alive-yesterday semantic) ───────────────────────────────

describe("getStreakStatus", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("returns 0 and isStreakAlive=false when no data", async () => {
    const status = await getStreakStatus(15);
    expect(status.currentStreak).toBe(0);
    expect(status.isStreakAlive).toBe(false);
    expect(status.todayMinutes).toBe(0);
  });

  it("returns streak when today qualifies", async () => {
    await seedStreakDay(localDate(), 20);
    const status = await getStreakStatus(15);
    expect(status.currentStreak).toBe(1);
    expect(status.isStreakAlive).toBe(true);
  });

  /**
   * KEY SEMANTIC FIX (from task spec point 2):
   * Yesterday qualified, today is empty → streak is still alive (can still earn today),
   * and the displayed streak should be yesterday's count (1), not 0.
   */
  it("shows yesterday's streak count when today is empty but streak is alive", async () => {
    await seedStreakDay(localDate(-1), 20); // yesterday qualified
    // today: no row at all
    const status = await getStreakStatus(15);
    expect(status.currentStreak).toBe(1); // shows yesterday's chain
    expect(status.isStreakAlive).toBe(true); // still alive (can study today)
    expect(status.todayMinutes).toBe(0);
  });

  it("returns 0 when streak is broken (2+ days ago, today empty)", async () => {
    await seedStreakDay(localDate(-2), 20);
    // isStreakAlive should be false, currentStreak should be 0
    const status = await getStreakStatus(15);
    expect(status.currentStreak).toBe(0);
    expect(status.isStreakAlive).toBe(false);
  });
});

// ─── unlockAchievement ────────────────────────────────────────────────────────

describe("unlockAchievement", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("unlocks a new achievement: returns true, emits event, adds 100 XP", async () => {
    const result = await unlockAchievement("first-card");
    expect(result).toBe(true);

    const ach = await db.achievements.get("first-card");
    expect(ach).toBeDefined();

    const events = await db.events.filter((e) => e.type === "achievement_unlocked").toArray();
    expect(events.length).toBe(1);

    expect(await getTotalXp()).toBe(100);
  });

  it("is idempotent — unlocking again returns false, no double event or XP", async () => {
    await unlockAchievement("first-card");
    await db.events.clear(); // reset events
    await db.xp.clear();     // reset xp

    const second = await unlockAchievement("first-card");
    expect(second).toBe(false);

    const events = await db.events.filter((e) => e.type === "achievement_unlocked").toArray();
    expect(events.length).toBe(0);
    expect(await getTotalXp()).toBe(0);
  });

  it("getUnlockedAchievements returns a Set of ids", async () => {
    await unlockAchievement("first-card");
    await unlockAchievement("100-cards");
    const set = await getUnlockedAchievements();
    expect(set.has("first-card")).toBe(true);
    expect(set.has("100-cards")).toBe(true);
    expect(set.size).toBe(2);
  });
});

// ─── checkAndUnlockAchievements ───────────────────────────────────────────────

describe("checkAndUnlockAchievements", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("unlocks first-card after one answer event exists", async () => {
    // Insert an AnswerEvent directly (simulating a card answer)
    const answerEvent: AnswerEvent = {
      ts: new Date(),
      type: "answer",
      cardId: "c1",
      rating: 3,
      correct: true,
      responseMs: 500,
      mode: "lesson",
      conceptIds: [],
      variant: "br",
    };
    await db.events.add(answerEvent);

    const newlyUnlocked = await checkAndUnlockAchievements(15);
    expect(newlyUnlocked).toContain("first-card");
  });

  it("does not re-unlock already unlocked achievements", async () => {
    const answerEvent: AnswerEvent = {
      ts: new Date(),
      type: "answer",
      cardId: "c2",
      rating: 4,
      correct: true,
      responseMs: 300,
      mode: "daily",
      conceptIds: [],
      variant: "pt",
    };
    await db.events.add(answerEvent);

    const first = await checkAndUnlockAchievements(15);
    expect(first).toContain("first-card");

    // second call: first-card already unlocked, should not appear again
    const second = await checkAndUnlockAchievements(15);
    expect(second).not.toContain("first-card");
  });
});

// ─── recordSessionEnd ─────────────────────────────────────────────────────────

describe("recordSessionEnd", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("creates a streak row for today on first call", async () => {
    await recordSessionEnd(1, "br", 10, 5);
    const row = await db.streak.get(localDate());
    expect(row).toBeDefined();
    expect(row?.minutesStudied).toBe(10);
    expect(row?.cardsReviewed).toBe(5);
    expect(row?.xpEarned).toBe(0);
  });

  it("accumulates two sessions on the same day", async () => {
    await recordSessionEnd(1, "br", 10, 5);
    await recordSessionEnd(2, "br", 8, 3);
    const row = await db.streak.get(localDate());
    expect(row?.minutesStudied).toBe(18);
    expect(row?.cardsReviewed).toBe(8);
  });

  it("preserves xpEarned across session accumulation", async () => {
    // Manually set xpEarned on today's row first
    await db.streak.put({ date: localDate(), minutesStudied: 5, cardsReviewed: 2, xpEarned: 20 });
    await recordSessionEnd(3, "pt", 10, 4);
    const row = await db.streak.get(localDate());
    expect(row?.xpEarned).toBe(20); // not overwritten
    expect(row?.minutesStudied).toBe(15);
  });

  it("emits a session_complete event", async () => {
    await recordSessionEnd(42, "pt", 5, 3);
    const events = await db.events.filter((e) => e.type === "session_complete").toArray();
    expect(events.length).toBe(1);
  });
});
