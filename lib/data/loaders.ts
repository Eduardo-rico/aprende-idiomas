import { promises as fs } from "fs";
import path from "path";
import { Story, StorySchema, Diagnostic, DiagnosticSchema } from "@/lib/data/zod-schemas";

const STORIES_DIR = path.join(process.cwd(), "lib/data/stories");
const DIAGNOSTIC_FILE = path.join(process.cwd(), "lib/data/diagnostic.json");

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

// Returns the diagnostic test questions, or null if the file is missing.
// The file is checked in to git; if you want to regenerate, edit by hand
// (the LLM version proved too unreliable for the strict schema).
export async function loadDiagnostic(): Promise<Diagnostic | null> {
  try {
    const raw = await fs.readFile(DIAGNOSTIC_FILE, "utf-8");
    return DiagnosticSchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}
