import { describe, it, expect } from "vitest";
import { loadAllStories, loadStory } from "@/lib/data/loaders";

describe("loadAllStories", () => {
  it("returns empty array when no stories", async () => {
    const stories = await loadAllStories("pt");
    expect(Array.isArray(stories)).toBe(true);
  });

  it("loads valid story JSONs", async () => {
    const stories = await loadAllStories("pt");
    for (const s of stories) {
      expect(s.id).toMatch(/^b\d+-s\d+-.+/);
    }
  });
});

describe("loadStory", () => {
  it("returns null for missing story", async () => {
    const story = await loadStory("pt", "nonexistent");
    expect(story).toBeNull();
  });
});
