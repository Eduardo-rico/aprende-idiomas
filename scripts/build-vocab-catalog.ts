// scripts/build-vocab-catalog.ts
// Derives lib/data/vocab-catalog.json from existing stories. Idempotent —
// re-running with the same stories produces an identical catalog (sorted, no
// duplicate keys). No LLM/TTS calls; this is pure consolidation.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { dataDir } from '@/lib/data/registry';
import { parseLangArgs, noopForLang } from './lib/cli';
import { loadAllStories } from '../lib/data/loaders';

const VocabCatalogItemSchema = z.object({
  word: z.string().min(1),
  ptWord: z.string().optional(),
  meaning: z.string().min(1),
  audioHash: z.object({ br: z.string().min(1), pt: z.string().min(1) }),
  conceptIds: z.array(z.string()),
  storyIds: z.array(z.string()),
});

const VocabCatalogSchema = z.array(VocabCatalogItemSchema);

type VocabCatalogItem = z.infer<typeof VocabCatalogItemSchema>;

interface RawStory {
  id: string;
  conceptIds: string[];
  vocab: Array<{
    word: string;
    ptWord?: string;
    meaning: string;
    audioHash: { br: string; pt: string };
  }>;
}

async function readStoriesFromDisk(lang: 'pt'): Promise<RawStory[]> {
  // Reuse the public loaders for schema validation, then read the raw JSONs
  // for stable, sorted output.
  const dir = path.join(dataDir(lang), 'stories');
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  const jsonFiles = entries.filter((f) => /^b\d+-s\d+-.+\.json$/.test(f)).sort();
  return Promise.all(
    jsonFiles.map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8');
      return JSON.parse(raw) as RawStory;
    }),
  );
}

function buildCatalog(stories: RawStory[]): VocabCatalogItem[] {
  const byWord = new Map<string, VocabCatalogItem>();
  for (const story of stories) {
    for (const v of story.vocab) {
      const key = v.word.toLowerCase();
      const existing = byWord.get(key);
      if (existing) {
        if (!existing.storyIds.includes(story.id)) existing.storyIds.push(story.id);
        for (const c of story.conceptIds) {
          if (!existing.conceptIds.includes(c)) existing.conceptIds.push(c);
        }
      } else {
        byWord.set(key, {
          word: v.word,
          ptWord: v.ptWord,
          meaning: v.meaning,
          audioHash: v.audioHash,
          conceptIds: [...story.conceptIds],
          storyIds: [story.id],
        });
      }
    }
  }
  return Array.from(byWord.values()).sort((a, b) => a.word.localeCompare(b.word));
}

async function main() {
  const { lang } = parseLangArgs();
  // Phase 5: build-vocab-catalog solo corre para PT (los scaffolds
  // vacíos no tienen stories de las que derivar vocab).
  if (lang !== 'pt') {
    console.log(noopForLang(lang, 'build-vocab-catalog'));
    return;
  }

  // Validate that the existing stories parse (fail fast if zod is out of sync).
  const validated = await loadAllStories(lang);

  // Use the raw JSON for stable ordering — loaders return zod-validated
  // objects whose `vocab` arrays preserve file order, but the schema strips
  // unknown keys, so this is safer than relying on the validated shape.
  const stories = await readStoriesFromDisk(lang);
  if (stories.length !== validated.length) {
    throw new Error(
      `Mismatch: ${stories.length} story files on disk vs ${validated.length} validated. ` +
        'Check that lib/data/loaders.ts agrees with the JSON shape.',
    );
  }

  const catalog = buildCatalog(stories);
  VocabCatalogSchema.parse(catalog);

  const outFile = path.join(dataDir(lang), 'vocab-catalog.json');
  const json = JSON.stringify(catalog, null, 2) + '\n';

  // Idempotency: skip write if the file already has identical content.
  let existing: string | null = null;
  try {
    existing = await fs.readFile(outFile, 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }
  if (existing === json) {
    console.log(`✓ vocab-catalog.json: ${catalog.length} entries (unchanged)`);
    return;
  }
  await fs.writeFile(outFile, json);
  console.log(`✓ vocab-catalog.json: ${catalog.length} unique words from ${stories.length} stories`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
