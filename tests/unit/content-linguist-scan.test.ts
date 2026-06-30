import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const STORIES_DIR = "lib/data/languages/pt/stories";
const LESSONS_DIR = "lib/data/languages/pt/lessons";
const BLOCKS_DIR = "lib/data/languages/pt/blocks";

const FORBIDDEN = [
  /\bpresently\b/i,
  /\bintentar\b/i,
  /\bpoujado\b/i,
  /\bdetelefone\b/i,
  /\baterrou no hotel\b/i,
];

const NO_CHINESE = /[一-鿿]/;

// Fields that contain Portuguese text (not Spanish glosses or meta fields)
const TEXT_FIELDS = new Set(["text", "title", "name", "objective", "explanation", "sentence", "question", "answer", "hint"]);

function extractTextValues(obj: unknown, results: string[] = []): string[] {
  if (typeof obj === "string") {
    results.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) extractTextValues(item, results);
  } else if (obj !== null && typeof obj === "object") {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      // Skip meta/gloss fields — these contain Spanish/English on purpose
      if (["meaning", "note", "esContrast", "translations", "conceptIds", "audioHash", "lessonIds", "conceptIds"].includes(key)) continue;
      extractTextValues(val, results);
    }
  }
  return results;
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)],
  );
}

describe("content linguist scan", () => {
  const allFiles = [
    ...walk(STORIES_DIR),
    ...walk(LESSONS_DIR),
    ...walk(BLOCKS_DIR),
  ].filter(
    (f) => f.endsWith(".json") && !f.includes(".audio-failures.") && !f.includes(".rejected.")
  );

  it.each(allFiles)("%s — no strings prohibidas en texto PT", (file) => {
    const raw = readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    const texts = extractTextValues(parsed);
    for (const text of texts) {
      for (const re of FORBIDDEN) {
        expect(text, `${file}: encontrado '${re.source}' en: "${text.slice(0, 80)}"`).not.toMatch(re);
      }
    }
  });

  it.each(allFiles)("%s — sin caracteres chinos", (file) => {
    const content = readFileSync(file, "utf-8");
    expect(content, `${file} contiene chars chinos`).not.toMatch(NO_CHINESE);
  });
});
