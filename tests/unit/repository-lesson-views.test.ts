// tests/unit/repository-lesson-views.test.ts
// Unit tests for the lessonViews repository helpers (L4.2 of the
// lessons-before-exercises plan). Uses fake-indexeddb (already in
// devDeps) so Dexie runs in-process without a browser.
//
// The `lessonViews` table was added in schema v7; the schema bump
// runs lazily when the DB is first opened, so we just need
// `await db.open()` in `beforeEach` after a `db.delete()` reset.
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db } from "@/lib/db/schema";
import {
  recordLessonView,
  getLessonViewsForLanguage,
  getLastLessonView,
} from "@/lib/db/repository";

describe("lesson views repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("recordLessonView: returns id matching lessonview-{lang}-{lessonId}-{ts} and persists", async () => {
    const before = Date.now();
    const id = await recordLessonView("b1-l1-foo", "pt");
    const after = Date.now();

    // Id shape: prefix + lang + lessonId + Date.now() timestamp.
    expect(id.startsWith("lessonview-pt-b1-l1-foo-")).toBe(true);
    const ts = Number(id.split("-").pop());
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);

    // The row is in the table with the expected shape.
    const row = await db.lessonViews.get(id);
    expect(row).toBeDefined();
    expect(row?.lessonId).toBe("b1-l1-foo");
    expect(row?.language).toBe("pt");
    expect(row?.viewedAt).toBe(ts);
  });

  it("getLessonViewsForLanguage: returns views for the language sorted by viewedAt DESC", async () => {
    await recordLessonView("b1-l1-a", "pt");
    // Tiny sleeps so the timestamps are distinct (Date.now() is ms-grain
    // but rapid back-to-back calls can share the same tick on fast CI).
    await new Promise((r) => setTimeout(r, 2));
    await recordLessonView("b1-l1-b", "pt");
    await new Promise((r) => setTimeout(r, 2));
    await recordLessonView("b1-l1-c", "pt");

    const views = await getLessonViewsForLanguage("pt");
    expect(views).toHaveLength(3);
    // Newest first: c, b, a
    expect(views.map((v) => v.lessonId)).toEqual(["b1-l1-c", "b1-l1-b", "b1-l1-a"]);
  });

  it("getLastLessonView: returns the most recent view for the lesson, or undefined", async () => {
    // No view yet → undefined
    expect(await getLastLessonView("b1-l1-x", "pt")).toBeUndefined();

    await recordLessonView("b1-l1-x", "pt");
    await new Promise((r) => setTimeout(r, 2));
    await recordLessonView("b1-l1-x", "pt");
    await new Promise((r) => setTimeout(r, 2));
    const lastId = await recordLessonView("b1-l1-x", "pt");

    const last = await getLastLessonView("b1-l1-x", "pt");
    expect(last?.id).toBe(lastId);
    expect(last?.lessonId).toBe("b1-l1-x");
  });

  it("different languages do not collide (per-language isolation)", async () => {
    // We only have PT content, but the index should still isolate
    // by language — a view in `pt` must not show up under `ru`
    // queries (and vice versa).
    const ptId = await recordLessonView("b1-l1-z", "pt");
    // Skip RU — not in the LANGUAGES tuple, so we cast through unknown
    // to exercise the same code path with a different value.
    const ruId = await recordLessonView("b1-l1-z", "ru" as unknown as "pt");

    expect(ptId).not.toBe(ruId);

    const ptViews = await getLessonViewsForLanguage("pt");
    const ruViews = await getLessonViewsForLanguage("ru" as unknown as "pt");
    expect(ptViews.map((v) => v.id)).toContain(ptId);
    expect(ptViews.map((v) => v.id)).not.toContain(ruId);
    expect(ruViews.map((v) => v.id)).toContain(ruId);
    expect(ruViews.map((v) => v.id)).not.toContain(ptId);

    // getLastLessonView also isolates by lang.
    const ptLast = await getLastLessonView("b1-l1-z", "pt");
    const ruLast = await getLastLessonView("b1-l1-z", "ru" as unknown as "pt");
    expect(ptLast?.id).toBe(ptId);
    expect(ruLast?.id).toBe(ruId);
  });
});