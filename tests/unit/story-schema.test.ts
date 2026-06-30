import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { storySchema } from "@/lib/data/languages/pt/story-schema";

const STORIES_DIR = resolve(__dirname, "../../lib/data/languages/pt/stories");

describe("story-schema", () => {
  const storyFiles = readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));

  it.each(storyFiles)("%s valida contra storySchema", (file) => {
    const raw = readFileSync(resolve(STORIES_DIR, file), "utf-8");
    const data = JSON.parse(raw) as unknown;
    expect(() => storySchema.parse(data)).not.toThrow();
  });

  it("al menos 5 historias tienen variantHighlights", () => {
    let count = 0;
    for (const file of storyFiles) {
      const raw = readFileSync(resolve(STORIES_DIR, file), "utf-8");
      const data = JSON.parse(raw) as { variantHighlights?: string[] };
      if (Array.isArray(data.variantHighlights) && data.variantHighlights.length > 0) {
        count++;
      }
    }
    expect(count).toBeGreaterThanOrEqual(5);
  });
});
