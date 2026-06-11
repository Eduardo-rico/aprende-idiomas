// scripts/generate-stories.ts
// Phase 1: generate stories for block 1 only (--block=N to target a specific block).
// Does NOT run API calls by itself — it writes to lib/data/stories/<storyId>.json.
// Run via: bash scripts/with-env.sh tsx scripts/generate-stories.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import pLimit from 'p-limit';
import {
  DATA_DIR, LLM_CACHE, VOICES, DEFAULT_VOICE, TTS_CONCURRENCY, TTS_DELAY_MS,
} from './config';
import { callLlm, extractJson } from './lib/minimax-llm';
import { generateTts } from './lib/minimax-tts';
import { readCache, writeCache } from './lib/cache';
import { renderTemplate } from './lib/prompt-runner';
import { StorySchema } from './lib/zod-schemas';

// ─── LLM schema version — bump when StoryOutputSchema changes ──────
const STORY_SCHEMA_VERSION = 1;

// ─── Block definitions (Phase 1: b1 only) ──────────────────────
const BLOCKS: Array<{ id: number; theme: string; concepts: string[] }> = [
  { id: 1, theme: 'O dia a dia de João na padaria', concepts: ['alfabeto', 'acentos', 'vogais nasais', 'sílabas'] },
  { id: 2, theme: 'A família de Maria em Lisboa', concepts: ['gênero', 'número', 'artigos', 'possessivos'] },
  { id: 3, theme: 'Pedro vai ao restaurante', concepts: ['presente', 'verbos irregulares', 'pronomes', 'há/tem'] },
  { id: 4, theme: 'Ana conta suas férias no Brasil', concepts: ['pretérito perfeito', 'imperfeito', 'mais-que-perfeito'] },
  { id: 5, theme: 'Os planos de Carlos para o futuro', concepts: ['futuro do presente', 'futuro composto', 'condicional'] },
  { id: 6, theme: 'Esperança e dúvida na vida de Sofia', concepts: ['presente do subjuntivo', 'imperfeito do subjuntivo', 'futuro do subjuntivo'] },
  { id: 7, theme: 'Um dia comum de Miguel', concepts: ['infinitivo', 'gerúndio', 'particípio', 'infinitivo pessoal'] },
  { id: 8, theme: 'O debate entre amigos no café', concepts: ['conectores', 'orações subordinadas', 'colocação pronominal'] },
  { id: 9, theme: 'Cores, sabores e sons do Brasil', concepts: ['léxico temático', 'expressões idiomáticas', 'falsos amigos', 'regência'] },
  { id: 10, theme: 'Cartas e e-mails entre Portugal e Brasil', concepts: ['registro formal', 'registro informal', 'variação diatópica'] },
];

// ─── LLM output schema (before audio enrichment) ───────────────
const StoryOutputSchema = z.object({
  title: z.string().min(3).max(80),
  br: z.object({ text: z.string().min(50) }),
  pt: z.object({ text: z.string().min(50) }),
  vocab: z.array(z.object({
    word: z.string().min(1),
    ptWord: z.string().min(1).optional(),
    meaning: z.string().min(1),
  })).min(5).max(12),
});

// ─── Helpers ────────────────────────────────────────────────────
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
}

const PROJECT_ROOT = process.cwd();
const PROMPTS_DIR = path.join(PROJECT_ROOT, 'scripts', 'prompts');
const STORIES_DIR = path.join(DATA_DIR, 'stories');

// ─── Global TTS limiter + done counter (shared across all blocks/stories) ──
const ttsLimit = pLimit(Math.min(4, Math.max(1, TTS_CONCURRENCY)));
let ttsDone = 0;

async function loadPrompt(name: string): Promise<string> {
  return fs.readFile(path.join(PROMPTS_DIR, `${name}.md`), 'utf8');
}

// ─── Core generator ─────────────────────────────────────────────
async function generateStoryForBlock(
  block: { id: number; theme: string; concepts: string[] },
  storyIndex: 1 | 2,
): Promise<void> {
  const storyId = `b${block.id}-s${storyIndex}-${slugify(block.theme)}`;
  const outFile = path.join(STORIES_DIR, `${storyId}.json`);

  // Idempotent: skip if already generated.
  try {
    await fs.access(outFile);
    console.log(`✓ exists, skipping: ${storyId}`);
    return;
  } catch {
    // not cached on disk — continue
  }

  const level: 1 | 2 | 3 = storyIndex === 1 ? 1 : 2;
  console.log(`→ generating story ${storyId} (level ${level})`);

  // Load prompt templates up front.
  const [template, system] = await Promise.all([
    loadPrompt('story'),
    loadPrompt('system'),
  ]);
  const user = renderTemplate(template, {
    blockId: block.id,
    level,
    theme: block.theme,
    concepts: block.concepts.join(', '),
  });

  // Build LLM cache key (deterministic, mirrors generate-content pattern).
  // schemaVersion ensures stale cache is invalidated on StoryOutputSchema bumps.
  const cacheKey = { schemaVersion: STORY_SCHEMA_VERSION, storyId, level, user, system };

  // Try LLM cache first.
  let llmText: string;
  const cachedText = await readCache<string>(LLM_CACHE, cacheKey);
  if (cachedText) {
    console.log(`  ↳ LLM cache hit`);
    llmText = cachedText;
  } else {
    const result = await callLlm({ system, user, maxTokens: 2000 });
    llmText = result.text;
    await writeCache(LLM_CACHE, cacheKey, llmText);
  }

  // Parse LLM output.
  const raw = extractJson(llmText);
  const parsed = StoryOutputSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `StoryOutputSchema failed for ${storyId}: ` +
      parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    );
  }
  const llmStory = parsed.data;

  // ─── TTS (global p-limit, shared across all blocks/stories) ───────
  const brVoice = VOICES.br[DEFAULT_VOICE];
  const ptVoice = VOICES.pt[DEFAULT_VOICE];

  async function tts(text: string, variant: 'br' | 'pt', voiceId: string): Promise<string> {
    return ttsLimit(async () => {
      if (TTS_DELAY_MS > 0 && ttsDone > 0) {
        await new Promise<void>(r => setTimeout(r, TTS_DELAY_MS));
      }
      ttsDone++;
      const result = await generateTts({ text, voiceId, variant });
      if (!result.cached) {
        console.log(`  ↳ TTS ${variant}: ${text.slice(0, 40)}...`);
      }
      return result.hash;
    });
  }

  // Full BR text, full PT text — run together.
  const [brAudioHash, ptAudioHash] = await Promise.all([
    tts(llmStory.br.text, 'br', brVoice),
    tts(llmStory.pt.text, 'pt', ptVoice),
  ]);

  // Vocab words: each BR word, each PT word (ptWord ?? word).
  const vocabAudioHashes = await Promise.all(
    llmStory.vocab.map(async v => {
      const [brHash, ptHash] = await Promise.all([
        tts(v.word, 'br', brVoice),
        tts(v.ptWord ?? v.word, 'pt', ptVoice),
      ]);
      return { br: brHash, pt: ptHash };
    })
  );

  // ─── Assemble final Story object ────────────────────────────────
  const storyObj = {
    id: storyId,
    blockId: block.id,
    lessonIds: [] as string[],
    title: llmStory.title,
    level,
    conceptIds: block.concepts,
    variants: {
      br: { text: llmStory.br.text, audioHash: brAudioHash },
      pt: { text: llmStory.pt.text, audioHash: ptAudioHash },
    },
    vocab: llmStory.vocab.map((v, i) => ({
      word: v.word,
      ...(v.ptWord !== undefined ? { ptWord: v.ptWord } : {}),
      meaning: v.meaning,
      audioHash: vocabAudioHashes[i]!,
    })),
  };

  // Validate against canonical StorySchema before writing.
  const validated = StorySchema.safeParse(storyObj);
  if (!validated.success) {
    throw new Error(
      `StorySchema validation failed for ${storyId}: ` +
      validated.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    );
  }

  // Write atomically.
  await fs.mkdir(STORIES_DIR, { recursive: true });
  const tmp = `${outFile}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(validated.data, null, 2) + '\n', 'utf8');
  await fs.rename(tmp, outFile);
  console.log(`✓ wrote ${path.relative(PROJECT_ROOT, outFile)}`);
}

// ─── CLI ─────────────────────────────────────────────────────────
function parseArgs(): { blockFilter?: number } {
  const args = process.argv.slice(2);
  let blockFilter: number | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    let raw: string | undefined;
    if (a !== undefined && a.startsWith('--block=')) {
      raw = a.slice('--block='.length);
    } else if (a === '--block' && args[i + 1] !== undefined) {
      raw = args[++i];
    }
    if (raw !== undefined) {
      const n = Number(raw);
      if (Number.isNaN(n)) {
        console.error(`Error: --block value "${raw}" is not a valid number.`);
        process.exit(1);
      }
      blockFilter = n;
    }
  }
  return { blockFilter };
}

async function main(): Promise<void> {
  const { blockFilter } = parseArgs();
  const targets = blockFilter !== undefined
    ? BLOCKS.filter(b => b.id === blockFilter)
    : BLOCKS; // Phase 2: all 10 blocks by default

  if (targets.length === 0) {
    console.error(`No block found for --block=${blockFilter}`);
    process.exit(1);
  }

  for (const block of targets) {
    console.log(`\n=== Block ${block.id}: ${block.theme} ===`);
    await generateStoryForBlock(block, 1);
    await generateStoryForBlock(block, 2);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
