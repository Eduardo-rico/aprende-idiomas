// tests/unit/repository-story.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db } from "@/lib/db/schema";
import {
  getOrCreateStoryProgress,
  markStoryCompleted,
  getCompletedStories,
} from "@/lib/db/repository";

describe("storyProgress repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("getOrCreateStoryProgress creates a new row", async () => {
    const row = await getOrCreateStoryProgress("b1-s1-x", "br");
    expect(row.storyId).toBe("b1-s1-x");
    expect(row.completedAt).toBeNull();
    expect(row.lastVariant).toBe("br");
  });

  it("markStoryCompleted sets completedAt and emits event", async () => {
    await getOrCreateStoryProgress("b1-s1-y", "br");
    await markStoryCompleted("b1-s1-y");
    const row = await db.storyProgress.get("b1-s1-y");
    expect(row?.completedAt).not.toBeNull();
    // events table stores ReviewEvent but story events are cast to fit — check via unknown
    const events = await db.events
      .filter((e) => (e as unknown as Record<string, unknown>)["type"] === "story_completed")
      .toArray();
    expect(events.length).toBe(1);
  });

  it("getCompletedStories returns completed storyIds only", async () => {
    await getOrCreateStoryProgress("b1-s1-a", "br");
    await getOrCreateStoryProgress("b1-s1-b", "br");
    await markStoryCompleted("b1-s1-a");
    const completed = await getCompletedStories();
    expect(completed).toEqual(["b1-s1-a"]);
  });

  it("markStoryCompleted is idempotent (no double events)", async () => {
    await getOrCreateStoryProgress("b1-s1-idempotent", "pt");
    await markStoryCompleted("b1-s1-idempotent");
    await markStoryCompleted("b1-s1-idempotent");
    const events = await db.events
      .filter((e) => (e as unknown as Record<string, unknown>)["type"] === "story_completed")
      .toArray();
    expect(events.length).toBe(1);
  });
});
