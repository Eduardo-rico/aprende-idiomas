// tests/unit/story-progress.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db, StoryProgressRow } from "@/lib/db/schema";

describe("storyProgress table", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("stores a story progress row", async () => {
    const row: StoryProgressRow = {
      storyId: "b1-s1-bom-dia",
      startedAt: new Date(),
      completedAt: null,
      lastVariant: "br",
    };
    await db.storyProgress.put(row);
    const got = await db.storyProgress.get("b1-s1-bom-dia");
    expect(got?.lastVariant).toBe("br");
  });

  it("updates completion", async () => {
    const now = new Date();
    await db.storyProgress.put({ storyId: "b1-s1-x", startedAt: now, completedAt: null, lastVariant: "br" });
    await db.storyProgress.update("b1-s1-x", { completedAt: now });
    const got = await db.storyProgress.get("b1-s1-x");
    expect(got?.completedAt).toEqual(now);
  });
});
