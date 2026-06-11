// lib/streak/streak.ts
import type { StreakDay } from "@/lib/db/schema";

function dateDiffDays(a: string, b: string): number {
  const ad = new Date(a + "T00:00:00").getTime();
  const bd = new Date(b + "T00:00:00").getTime();
  return Math.round((bd - ad) / 86400000);
}

function dateOffset(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function currentStreak(streak: StreakDay[], today: string, goalMin: number): number {
  const sorted = [...streak].sort((a, b) => a.date.localeCompare(b.date));
  let count = 0;
  let cursor = today;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const entry = sorted[i];
    if (entry === undefined) break;
    if (entry.date !== cursor) {
      const diff = dateDiffDays(entry.date, cursor);
      if (diff > 0) break;
      if (diff < 0) continue;
    }
    if (entry.minutesStudied >= goalMin) {
      count++;
      cursor = dateOffset(cursor, -1);
    } else {
      break;
    }
  }
  return count;
}

export function didStudyToday(streak: StreakDay[], today: string, goalMin: number): boolean {
  const todayRow = streak.find((s) => s.date === today);
  if (!todayRow) return false;
  return todayRow.minutesStudied >= goalMin;
}

export function isStreakAlive(streak: StreakDay[], today: string): boolean {
  if (streak.length === 0) return false;
  const sorted = [...streak].sort((a, b) => a.date.localeCompare(b.date));
  const lastEntry = sorted[sorted.length - 1];
  if (lastEntry === undefined) return false;
  const last = lastEntry.date;
  const diff = dateDiffDays(last, today);
  return diff === 0 || diff === 1;
}
