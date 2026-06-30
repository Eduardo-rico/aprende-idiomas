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

// Chinese block U+4E00–U+9FFF
const NO_CHINESE = /[一-鿿]/;

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
  ].filter((f) => f.endsWith(".json"));

  it.each(allFiles)("%s — no strings prohibidas", (file) => {
    const content = readFileSync(file, "utf-8");
    for (const re of FORBIDDEN) {
      expect(content, `${file} contiene '${re.source}'`).not.toMatch(re);
    }
  });

  it.each(allFiles)("%s — sin caracteres chinos", (file) => {
    const content = readFileSync(file, "utf-8");
    expect(content, `${file} contiene chars chinos`).not.toMatch(NO_CHINESE);
  });
});
