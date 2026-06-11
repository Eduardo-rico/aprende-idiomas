import { promises as fs } from "fs";
import path from "path";
import { Story, StorySchema } from "@/lib/data/zod-schemas";

const STORIES_DIR = path.join(process.cwd(), "lib/data/stories");
const VOCAB_CATALOG = path.join(process.cwd(), "lib/data/vocab-catalog.json");

export async function loadAllStories(): Promise<Story[]> {
  try {
    const files = await fs.readdir(STORIES_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
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
