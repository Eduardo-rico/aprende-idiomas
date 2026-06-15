import { promises as fs } from "fs";
import path from "path";
import { Story, StorySchema } from "@/lib/data/zod-schemas";

const STORIES_DIR = path.join(process.cwd(), "lib/data/stories");
const VOCAB_CATALOG = path.join(process.cwd(), "lib/data/vocab-catalog.json");

export async function loadAllStories(): Promise<Story[]> {
  try {
    const files = await fs.readdir(STORIES_DIR);
    // Only files matching the story id pattern (b{N}-s{N}-{slug}.json). This
    // excludes sidecar files like `generation-failures.json` whose shape is
    // an array, not a Story, and would crash StorySchema.parse().
    const jsonFiles = files.filter((f) => /^b\d+-s\d+-.+\.json$/.test(f));
    const stories = await Promise.all(
      jsonFiles.map(async (f) => {
        const raw = await fs.readFile(path.join(STORIES_DIR, f), "utf-8");
        return StorySchema.parse(JSON.parse(raw));
      })
    );
    return stories.sort((a, b) => a.id.localeCompare(b.id));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export async function loadStory(id: string): Promise<Story | null> {
  try {
    // Defensive: only allow story id filenames, not sidecar JSON like
    // `generation-failures.json` (which would pass the .endsWith check but
    // fail StorySchema.parse and trigger the ENOENT branch incorrectly).
    if (!/^b\d+-s\d+-.+$/.test(id)) return null;
    const file = path.join(STORIES_DIR, `${id}.json`);
    const raw = await fs.readFile(file, "utf-8");
    return StorySchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export type VocabCatalogItem = {
  word: string;
  ptWord?: string;
  meaning: string;
  audioHash: { br: string; pt: string };
  conceptIds: string[];
  storyIds: string[];
};

export async function loadVocabCatalog(): Promise<VocabCatalogItem[]> {
  try {
    const raw = await fs.readFile(VOCAB_CATALOG, "utf-8");
    return JSON.parse(raw) as VocabCatalogItem[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}
