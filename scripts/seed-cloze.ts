// scripts/seed-cloze.ts
// Genera cloze-seeds.json a partir de las historias existentes.
// No requiere API — solo lee los archivos JSON del proyecto.
// Invocar: npx tsx scripts/seed-cloze.ts

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STORIES_DIR = "lib/data/languages/pt/stories";

interface Story {
  id: string;
  blockId: number;
  variants: { br: { text: string }; pt: { text: string } };
}

interface ClozeSeed {
  storyId: string;
  blockId: number;
  text: string;       // "Vou _____ ao mercado."
  answer: string;     // "ir"
  distractors: string[];
  variant: "br" | "pt";
}

function isContentWord(token: string): boolean {
  const clean = token.replace(/[.,;:!?"""''()[\]]/g, "").toLowerCase();
  if (clean.length < 4) return false;
  const stopWords = new Set(["para", "como", "mais", "também", "muito", "pelo", "pela", "esse", "essa", "este", "esta", "isso", "aqui", "onde", "quando", "agora", "ainda", "sempre", "depois", "antes", "entre", "sobre"]);
  return !stopWords.has(clean);
}

const seeds: ClozeSeed[] = [];
const allTokens: string[] = [];

const files = readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const story = JSON.parse(readFileSync(join(STORIES_DIR, file), "utf-8")) as Story;

  for (const variant of ["br", "pt"] as const) {
    const text = story.variants[variant].text;
    const tokens = text.split(/\s+/);
    allTokens.push(...tokens.map((t) => t.replace(/[.,;:!?"""''()[\]]/g, "").toLowerCase()).filter((t) => t.length >= 4));

    const candidates = tokens
      .map((t, i) => ({ token: t, idx: i }))
      .filter(({ token }) => isContentWord(token));

    // Pick every 8th candidate to avoid cluttering the same sentence
    for (let ci = 0; ci < candidates.length; ci += 8) {
      const { token, idx } = candidates[ci]!;
      const answer = token.replace(/[.,;:!?"""''()[\]]/g, "");
      const blanked = tokens.map((t, i) => (i === idx ? "_____" : t)).join(" ");
      seeds.push({ storyId: story.id, blockId: story.blockId, text: blanked, answer, distractors: [], variant });
    }
  }
}

// Build distractors: pick 3 random content words of similar length from the corpus
const corpusWords = [...new Set(allTokens.filter((t) => t.length >= 4))];

for (const seed of seeds) {
  const answerLen = seed.answer.length;
  const similar = corpusWords
    .filter((w) => Math.abs(w.length - answerLen) <= 2 && w !== seed.answer.toLowerCase())
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  seed.distractors = similar.length >= 3 ? similar : ["não", "sim", "era"];
}

const output = seeds.slice(0, 60);
writeFileSync("lib/data/languages/pt/cloze-seeds.json", JSON.stringify(output, null, 2));
console.log(`✓ ${output.length} cloze seeds written to lib/data/languages/pt/cloze-seeds.json`);
