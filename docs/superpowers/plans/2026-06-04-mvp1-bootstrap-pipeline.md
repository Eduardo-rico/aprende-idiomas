# Aprende Português — MVP Plan #1: Bootstrap + Pipeline + Bloque 1 generado

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the Next.js project, build the content generation pipeline (MiniMax LLM + TTS with idempotent hash-based cache), define the curriculum for the 10 blocks, and produce real content (JSONs + MP3s) for Block 1 (Phonetics) end-to-end.

**Architecture:** Next.js 16 + TypeScript + Tailwind v4 + Dexie + ts-fsrs. Generation scripts run as `tsx` invocations, call MiniMax APIs via SDK Anthropic + raw fetch, write deterministic hash-named files to disk. Cache prevents any re-call when input is unchanged. Pipeline is verifiable by running `npm run generate:all -- --block 1` and inspecting `lib/data/blocks/b1.json` + `public/audio/*.mp3`.

**Tech Stack:** Next.js 16, TypeScript 5, Tailwind v4, shadcn/ui, Dexie 4, ts-fsrs, Zustand, Recharts, framer-motion, MDX, Zod, p-limit, tsx, vitest, playwright, `@anthropic-ai/sdk`.

**Prerequisites before starting:**
- Node 20+ installed
- `MINIMAX_API_KEY` available (Edu has it). Set in `.env.local`.
- Working dir: `/Users/lalo/idiomas/portugues-app` (already created with git init + design doc committed)

**Out of scope for this plan (deferred to Plan #2+):** Any UI beyond the default Next.js scaffold. Dexie wiring to UI. FSRS runtime usage. ExerciseRunner. All visual styling beyond defaults.

---

## File Structure (planned for this plan)

```
portugues-app/
├── app/
│   ├── layout.tsx              # default root layout (touched only to add fonts)
│   ├── page.tsx                # placeholder "hello world" — UI in Plan #2
│   └── globals.css             # tailwind directives + paleta
├── lib/
│   └── data/
│       ├── curriculum.ts       # BLOCKS + LESSONS + CONCEPTS (curated)
│       ├── concepts.json       # generated from curriculum.ts on first run
│       ├── blocks/
│       │   └── b1.json         # generated for Block 1
│       ├── stories/            # (empty for Plan #1)
│       └── manifest.json       # generated
├── public/
│   └── audio/                  # MP3s (generated)
├── scripts/
│   ├── generate-curriculum.ts  # writes lib/data/concepts.json from curriculum.ts
│   ├── generate-content.ts     # main orchestrator
│   ├── generate-audio.ts       # TTS orchestrator
│   ├── verify-content.ts       # post-validation
│   ├── config.ts               # voices, models, concurrency, N per type
│   ├── lib/
│   │   ├── cache.ts            # sha256 + atomic read/write
│   │   ├── minimax-llm.ts      # SDK Anthropic wrapper
│   │   ├── minimax-tts.ts      # REST wrapper
│   │   ├── prompt-runner.ts    # render template + call + parse + validate
│   │   ├── zod-schemas.ts      # Exercise + ExerciseData discriminated unions
│   │   └── audio-collector.ts  # walks exercises and emits TTS jobs
│   └── prompts/
│       ├── system.md           # shared system prompt
│       ├── flashcard.md
│       ├── fill_blank.md
│       ├── listening.md
│       ├── translation.md
│       └── verb_preposition.md
├── tests/
│   └── unit/
│       ├── cache.test.ts
│       ├── prompt-runner.test.ts
│       ├── zod-schemas.test.ts
│       └── audio-collector.test.ts
├── .env.local.example
├── .gitignore                  # already exists, will be appended
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── vitest.config.ts
└── README.md
```

---

## Milestone 1 — Project Bootstrap

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `postcss.config.mjs`, `eslint.config.mjs`

- [ ] **Step 1: Run create-next-app**

```bash
cd /Users/lalo/idiomas
npx create-next-app@latest portugues-app \
  --typescript --tailwind --eslint --app \
  --src-dir=false --import-alias="@/*" --use-npm \
  --skip-install --turbopack
```

Expected: Files scaffolded inside existing dir. Confirms when prompted (the dir already exists with git init + docs/). If create-next-app refuses, do it in a temp dir and copy files manually preserving `docs/` and `.gitignore`.

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/lalo/idiomas/portugues-app
npm install
```

Expected: `node_modules/` populated, no errors.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev -- --port 3002
```

Expected: Next dev server starts on http://localhost:3002. Visit in browser to confirm. Kill with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: bootstrap Next.js 16 + TS + Tailwind"
```

---

### Task 2: Install runtime dependencies

**Files:** `package.json`

- [ ] **Step 1: Install deps**

```bash
npm install dexie@^4 ts-fsrs zustand framer-motion recharts canvas-confetti \
  @anthropic-ai/sdk zod p-limit
```

- [ ] **Step 2: Install dev deps**

```bash
npm install -D tsx vitest @vitest/ui @testing-library/react @testing-library/jest-dom \
  jsdom @playwright/test @types/canvas-confetti
```

- [ ] **Step 3: Verify imports compile**

Create `scratch.ts` at root:

```ts
import Dexie from 'dexie';
import { fsrs } from 'ts-fsrs';
import { create } from 'zustand';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import pLimit from 'p-limit';
import confetti from 'canvas-confetti';
console.log(typeof Dexie, typeof fsrs, typeof create, typeof Anthropic, typeof z, typeof pLimit, typeof confetti);
```

Run: `npx tsc --noEmit scratch.ts`
Expected: No errors. Delete `scratch.ts` after.

```bash
rm scratch.ts
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install runtime + dev deps"
```

---

### Task 3: Configure TypeScript strict + path aliases

**Files:** Modify `tsconfig.json`

- [ ] **Step 1: Update tsconfig.json**

Replace `tsconfig.json` contents with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run lint
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: stricter TS config (noUncheckedIndexedAccess)"
```

---

### Task 4: Setup vitest

**Files:** Create `vitest.config.ts`, `tests/setup.ts`. Modify `package.json`.

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 2: Create tests/setup.ts**

```ts
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
});
```

- [ ] **Step 3: Add test scripts to package.json**

Edit `package.json` `scripts` section to include:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Smoke test vitest**

Create `tests/unit/sanity.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
describe('sanity', () => {
  it('runs', () => { expect(1 + 1).toBe(2); });
});
```

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts tests/unit/sanity.test.ts package.json
git commit -m "test: setup vitest with sanity test"
```

---

### Task 5: Add .env.local.example

**Files:** Create `.env.local.example`. Modify `.gitignore`.

- [ ] **Step 1: Create .env.local.example**

```
# MiniMax — used by generation scripts (build-time only).
# Same key works for LLM (Anthropic-compatible endpoint) and TTS REST endpoint.
MINIMAX_API_KEY=sk-...

# Optional: override default models
# MINIMAX_LLM_MODEL=MiniMax-M2.5-highspeed
# MINIMAX_TTS_MODEL=speech-2.8-hd
```

- [ ] **Step 2: Verify .gitignore already ignores .env.local**

```bash
grep -E '\.env\.local|\.env$' .gitignore
```

Expected: matches.

- [ ] **Step 3: Commit**

```bash
git add .env.local.example
git commit -m "chore: add .env.local.example"
```

- [ ] **Step 4: Manually create .env.local with real key (NOT committed)**

```bash
cp .env.local.example .env.local
# Edit .env.local and paste real MINIMAX_API_KEY
```

---

## Milestone 2 — Generation Pipeline

### Task 6: Cache module (TDD)

**Files:**
- Create: `scripts/lib/cache.ts`
- Test: `tests/unit/cache.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/cache.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { hashKey, readCache, writeCache } from '@/scripts/lib/cache';

describe('cache', () => {
  let tmpDir: string;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-test-'));
  });
  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('hashKey is deterministic and order-independent for objects', () => {
    const a = hashKey({ a: 1, b: 2 });
    const b = hashKey({ b: 2, a: 1 });
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it('hashKey differs when inputs differ', () => {
    expect(hashKey({ a: 1 })).not.toBe(hashKey({ a: 2 }));
  });

  it('writeCache then readCache returns same value', async () => {
    const key = { type: 'test', n: 5 };
    await writeCache(tmpDir, key, { value: 'hello' });
    const got = await readCache<{ value: string }>(tmpDir, key);
    expect(got).toEqual({ value: 'hello' });
  });

  it('readCache returns null when miss', async () => {
    const got = await readCache(tmpDir, { unseen: true });
    expect(got).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- cache
```

Expected: FAIL — `Cannot find module '@/scripts/lib/cache'`.

- [ ] **Step 3: Implement cache.ts**

```ts
// scripts/lib/cache.ts
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

export function hashKey(key: unknown): string {
  return crypto.createHash('sha256').update(stableStringify(key)).digest('hex');
}

export async function readCache<T>(dir: string, key: unknown): Promise<T | null> {
  const file = path.join(dir, `${hashKey(key)}.json`);
  try {
    const txt = await fs.readFile(file, 'utf8');
    return JSON.parse(txt) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function writeCache(dir: string, key: unknown, value: unknown): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `${hashKey(key)}.json`);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(tmp, file); // atomic
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
npm test -- cache
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/cache.ts tests/unit/cache.test.ts
git commit -m "feat(scripts): deterministic hash-based cache module"
```

---

### Task 7: Generation config

**Files:** Create `scripts/config.ts`.

- [ ] **Step 1: Create config**

```ts
// scripts/config.ts
import path from 'node:path';

export const PROJECT_ROOT = path.resolve(__dirname, '..');

export const CACHE_DIR  = path.join(PROJECT_ROOT, 'scripts', '.cache');
export const LLM_CACHE  = path.join(CACHE_DIR, 'llm');
export const TTS_OUTPUT = path.join(PROJECT_ROOT, 'public', 'audio');
export const DATA_DIR   = path.join(PROJECT_ROOT, 'lib', 'data');
export const BLOCKS_DIR = path.join(DATA_DIR, 'blocks');

export const LLM_MODEL = process.env.MINIMAX_LLM_MODEL ?? 'MiniMax-M2.5-highspeed';
export const TTS_MODEL = process.env.MINIMAX_TTS_MODEL ?? 'speech-2.8-hd';

export const LLM_BASE_URL = 'https://api.minimax.io/anthropic';
export const TTS_URL      = 'https://api.minimax.io/v1/t2a_v2';

// Concurrency
export const LLM_CONCURRENCY = 8;
export const TTS_CONCURRENCY = 4;

// Voices — placeholders, confirm with MiniMax API listing on first run.
// Each variant has a female + male voice. Default to female unless overridden.
export const VOICES = {
  br: { f: 'Portuguese_Brazil_FemaleA', m: 'Portuguese_Brazil_MaleA' },
  pt: { f: 'Portuguese_Portugal_FemaleA', m: 'Portuguese_Portugal_MaleA' },
} as const;

export const DEFAULT_VOICE: 'f' | 'm' = 'f';

// How many exercises to ask the LLM to produce per (lesson × type).
// Tweak per block size; conservative defaults.
export const EXERCISES_PER_LESSON: Record<string, number> = {
  flashcard: 15,
  fill_blank: 10,
  listening: 5,
  translation_es_pt: 8,
  translation_pt_es: 8,
  verb_preposition: 5,
  sentence_construction: 5,
  chunk: 5,
};

// Bumping this invalidates LLM cache for that type (e.g. if prompt structure changes meaningfully).
export const SCHEMA_VERSION = 1;
```

- [ ] **Step 2: Add `MINIMAX_API_KEY` accessor (fails loudly if missing)**

Append to `scripts/config.ts`:

```ts
export function requireApiKey(): string {
  const key = process.env.MINIMAX_API_KEY;
  if (!key) {
    throw new Error('MINIMAX_API_KEY is not set. Add it to .env.local.');
  }
  return key;
}
```

- [ ] **Step 3: Commit**

```bash
git add scripts/config.ts
git commit -m "feat(scripts): config module (paths, models, concurrency, voices)"
```

---

### Task 8: Zod schemas (TDD)

**Files:**
- Create: `scripts/lib/zod-schemas.ts`
- Test: `tests/unit/zod-schemas.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/zod-schemas.test.ts
import { describe, it, expect } from 'vitest';
import { ExerciseSchema, FlashcardDataSchema } from '@/scripts/lib/zod-schemas';

describe('zod schemas', () => {
  it('valid flashcard exercise parses', () => {
    const ok = ExerciseSchema.safeParse({
      id: 'b1-fc-001',
      blockId: 1,
      lessonId: 'b1-l1-alfabeto',
      type: 'flashcard',
      difficulty: 1,
      concepts: ['b1-fonema-vogais'],
      tags: [],
      data: { front: 'a', back: 'a (vogal aberta)', example: 'casa' },
    });
    expect(ok.success).toBe(true);
  });

  it('rejects exercise with unknown type', () => {
    const bad = ExerciseSchema.safeParse({
      id: 'x', blockId: 1, lessonId: 'l', type: 'mystery',
      difficulty: 1, concepts: [], tags: [], data: {},
    });
    expect(bad.success).toBe(false);
  });

  it('flashcard data requires front and back', () => {
    const bad = FlashcardDataSchema.safeParse({ front: 'a' });
    expect(bad.success).toBe(false);
  });

  it('allows ptOverrides partial', () => {
    const ok = ExerciseSchema.safeParse({
      id: 'b1-fc-002',
      blockId: 1,
      lessonId: 'b1-l1',
      type: 'flashcard',
      difficulty: 1,
      concepts: [],
      tags: [],
      data: { front: 'autocarro', back: 'ônibus' },
      ptOverrides: { back: 'autocarro' },
    });
    expect(ok.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- zod-schemas
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement zod-schemas.ts**

```ts
// scripts/lib/zod-schemas.ts
import { z } from 'zod';

export const ExerciseTypeEnum = z.enum([
  'flashcard',
  'fill_blank',
  'listening',
  'translation_es_pt',
  'translation_pt_es',
  'verb_preposition',
  'sentence_construction',
  'chunk',
]);
export type ExerciseType = z.infer<typeof ExerciseTypeEnum>;

export const FlashcardDataSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  example: z.string().optional(),
});

export const FillBlankDataSchema = z.object({
  sentence: z.string().min(1),
  blanks: z.array(z.object({
    position: z.number().int().nonnegative(),
    answer: z.string().min(1),
    alternatives: z.array(z.string()).optional(),
  })).min(1),
});

export const ListeningDataSchema = z.object({
  audioText: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).min(2).optional(),
  answer: z.string().min(1),
});

export const TranslationDataSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  acceptedAlternatives: z.array(z.string()).optional(),
});

export const VerbPrepositionDataSchema = z.object({
  verb: z.string().min(1),
  sentence: z.string().min(1),
  options: z.array(z.string()).min(2),
  answer: z.string().min(1),
});

export const SentenceConstructionDataSchema = z.object({
  words: z.array(z.string()).min(2),
  answer: z.array(z.string()).min(2),
  translation: z.string().optional(),
});

export const ChunkDataSchema = z.object({
  chunk: z.string().min(1),
  meaning: z.string().min(1),
  examples: z.array(z.object({
    sentence: z.string().min(1),
    gloss: z.string().optional(),
  })).min(1),
});

export const ExerciseDataSchema = z.union([
  FlashcardDataSchema,
  FillBlankDataSchema,
  ListeningDataSchema,
  TranslationDataSchema,
  VerbPrepositionDataSchema,
  SentenceConstructionDataSchema,
  ChunkDataSchema,
]);

export const ExerciseSchema = z.object({
  id: z.string().min(1),
  blockId: z.number().int().positive(),
  lessonId: z.string().min(1),
  type: ExerciseTypeEnum,
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  concepts: z.array(z.string()),
  tags: z.array(z.string()),
  contentHash: z.string().optional(), // filled after generation
  data: ExerciseDataSchema,
  ptOverrides: ExerciseDataSchema.partial().optional(),
  esContrast: z.string().optional(),
  audio: z.object({
    br: z.object({ hash: z.string(), voice: z.string() }),
    pt: z.object({ hash: z.string(), voice: z.string() }),
  }).optional(),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

// LLM batch output: an array of exercises (the LLM produces N at a time per type).
export const ExerciseBatchSchema = z.array(ExerciseSchema.omit({
  id: true, blockId: true, lessonId: true, contentHash: true, audio: true,
}).extend({
  // The LLM returns these fields; the script attaches id/blockId/lessonId/contentHash.
  type: ExerciseTypeEnum,
}));
export type ExerciseBatchItem = z.infer<typeof ExerciseBatchSchema>[number];
```

- [ ] **Step 4: Run test**

```bash
npm test -- zod-schemas
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/zod-schemas.ts tests/unit/zod-schemas.test.ts
git commit -m "feat(scripts): Zod schemas for Exercise + variants"
```

---

### Task 9: MiniMax LLM wrapper

**Files:** Create `scripts/lib/minimax-llm.ts`.

- [ ] **Step 1: Implement wrapper**

```ts
// scripts/lib/minimax-llm.ts
import Anthropic from '@anthropic-ai/sdk';
import { LLM_BASE_URL, LLM_MODEL, requireApiKey } from '@/scripts/config';

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      baseURL: LLM_BASE_URL,
      apiKey: requireApiKey(),
    });
  }
  return _client;
}

export interface LlmCallParams {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

export async function callLlm(params: LlmCallParams): Promise<string> {
  const res = await client().messages.create({
    model: LLM_MODEL,
    max_tokens: params.maxTokens ?? 4000,
    temperature: params.temperature ?? 0.4,
    system: params.system,
    messages: [{ role: 'user', content: params.user }],
  });
  // Concatenate all text blocks, ignore thinking blocks.
  const parts: string[] = [];
  for (const block of res.content) {
    if (block.type === 'text') parts.push(block.text);
  }
  return parts.join('\n').trim();
}

// Used by prompt-runner; exported for testing.
export function extractJson(raw: string): unknown {
  // Strip markdown code fences if present.
  const stripped = raw.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '').trim();
  // Find first '[' or '{' to be lenient about surrounding prose.
  const i = stripped.search(/[\[{]/);
  const j = Math.max(stripped.lastIndexOf(']'), stripped.lastIndexOf('}'));
  if (i === -1 || j === -1 || j < i) {
    throw new Error(`No JSON found in LLM response. Raw: ${raw.slice(0, 200)}`);
  }
  return JSON.parse(stripped.slice(i, j + 1));
}
```

- [ ] **Step 2: Smoke test it exists**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/minimax-llm.ts
git commit -m "feat(scripts): MiniMax LLM wrapper (SDK Anthropic compatible)"
```

---

### Task 10: MiniMax TTS wrapper (TDD shape, integration deferred)

**Files:** Create `scripts/lib/minimax-tts.ts`.

- [ ] **Step 1: Implement**

```ts
// scripts/lib/minimax-tts.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { TTS_MODEL, TTS_URL, TTS_OUTPUT, requireApiKey } from '@/scripts/config';
import { hashKey } from './cache';

export interface TtsRequest {
  text: string;
  voiceId: string;
  variant: 'br' | 'pt';
  speed?: number;
}

export interface TtsResult {
  hash: string;
  filePath: string;
  cached: boolean;
}

export function ttsHash(req: TtsRequest): string {
  return hashKey({
    text: req.text,
    voiceId: req.voiceId,
    variant: req.variant,
    speed: req.speed ?? 1,
    model: TTS_MODEL,
  });
}

export async function generateTts(req: TtsRequest): Promise<TtsResult> {
  const hash = ttsHash(req);
  const filePath = path.join(TTS_OUTPUT, `${hash}.mp3`);

  try {
    await fs.access(filePath);
    return { hash, filePath, cached: true };
  } catch {
    // not cached — fall through to fetch
  }

  const body = {
    model: TTS_MODEL,
    text: req.text,
    stream: false,
    voice_setting: {
      voice_id: req.voiceId,
      speed: req.speed ?? 1,
      vol: 1,
      pitch: 0,
    },
    audio_setting: {
      sample_rate: 32000,
      bitrate: 128000,
      format: 'mp3',
      channel: 1,
    },
    language_boost: 'Portuguese',
    output_format: 'hex',
  };

  const res = await fetch(TTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`TTS failed (${res.status}): ${await res.text()}`);
  }
  const json = await res.json() as { data?: { audio?: string }; base_resp?: { status_msg?: string } };
  const hex = json.data?.audio;
  if (!hex) {
    throw new Error(`TTS missing audio in response: ${JSON.stringify(json.base_resp ?? json).slice(0, 300)}`);
  }

  const buf = Buffer.from(hex, 'hex');
  await fs.mkdir(TTS_OUTPUT, { recursive: true });
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, filePath);

  return { hash, filePath, cached: false };
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/minimax-tts.ts
git commit -m "feat(scripts): MiniMax TTS wrapper with hash cache"
```

---

### Task 11: Prompt templates

**Files:** Create `scripts/prompts/system.md` + one file per exercise type.

- [ ] **Step 1: Create system prompt**

```markdown
<!-- scripts/prompts/system.md -->
Eres un profesor experto de portugués (variantes brasileña y europea) para estudiantes hispanohablantes nativos. Tu tarea es generar ejercicios pedagógicos rigurosos, idiomáticos y culturalmente auténticos.

Reglas estrictas:
- Devuelves ÚNICAMENTE JSON válido, sin texto adicional, sin markdown, sin explicaciones.
- El JSON es un array con exactamente el número de items solicitado.
- Cada item debe ser pedagógicamente útil (sin trivialidades, sin repeticiones cosméticas).
- Cuando una palabra/frase difiere entre PT-BR y PT-PT, usa `data` para la versión brasileña y `ptOverrides` para los campos que cambian en europea. Si son idénticas, omite `ptOverrides`.
- Cuando la diferencia con el español sea fuente común de error, incluye `esContrast` con una pista breve (max 120 caracteres) que ayude al hispanohablante.
- `concepts` debe contener únicamente IDs de la lista que te paso. No inventes IDs.
- `difficulty`: 1 = principiante, 2 = intermedio, 3 = avanzado.
- `tags`: opcionales; usa "falso-amigo", "irregular", "regional", "formal", "coloquial" cuando apliquen.
```

- [ ] **Step 2: Flashcard prompt**

```markdown
<!-- scripts/prompts/flashcard.md -->
Genera {{N}} flashcards para la lección "{{lessonName}}" del bloque "{{blockName}}" del curso de portugués.

Conceptos cubiertos en esta lección (úsalos en `concepts`):
{{conceptsList}}

Variante principal: PT-BR. Marca diferencias con PT-PT solo cuando existan.

Formato JSON por item:
{
  "type": "flashcard",
  "difficulty": <1|2|3>,
  "concepts": ["<concept-id>", ...],
  "tags": [...],
  "data": { "front": "<palabra/frase en español o pregunta>", "back": "<respuesta en portugués brasileño>", "example": "<oración ejemplo opcional>" },
  "ptOverrides": { "back": "<solo si difiere>" } | undefined,
  "esContrast": "<pista hispanohablante opcional>"
}

Recordatorio: solo el array JSON, nada más.
```

- [ ] **Step 3: Fill blank prompt**

```markdown
<!-- scripts/prompts/fill_blank.md -->
Genera {{N}} ejercicios de "completar el espacio" para la lección "{{lessonName}}" del bloque "{{blockName}}".

Conceptos: {{conceptsList}}

Formato JSON por item:
{
  "type": "fill_blank",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": {
    "sentence": "Eu ___ um café todas as manhãs.",
    "blanks": [{ "position": 0, "answer": "tomo", "alternatives": ["bebo"] }]
  },
  "ptOverrides": { "sentence": "...se difiere...", "blanks": [...] } | undefined,
  "esContrast": "..."
}

`position` es el índice del blank en la oración (0-based). `alternatives` son respuestas también aceptadas.
Solo el array JSON.
```

- [ ] **Step 4: Listening prompt**

```markdown
<!-- scripts/prompts/listening.md -->
Genera {{N}} ejercicios de comprensión auditiva para la lección "{{lessonName}}" del bloque "{{blockName}}".

Conceptos: {{conceptsList}}

Cada ejercicio tendrá audio (generado por TTS desde `audioText`). El usuario escucha y responde.

Formato JSON por item:
{
  "type": "listening",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": {
    "audioText": "<frase en portugués brasileño, máx 25 palabras>",
    "question": "<pregunta en español sobre el contenido>",
    "options": ["...", "...", "...", "..."],
    "answer": "<exactamente uno de options>"
  },
  "ptOverrides": { "audioText": "<solo si difiere>", "options": [...], "answer": "..." } | undefined,
  "esContrast": "..."
}

Solo el array JSON.
```

- [ ] **Step 5: Translation prompt**

```markdown
<!-- scripts/prompts/translation.md -->
Genera {{N}} ejercicios de traducción {{direction}} para la lección "{{lessonName}}" del bloque "{{blockName}}".

Conceptos: {{conceptsList}}

Direction "es_pt": el usuario traduce de español a portugués.
Direction "pt_es": el usuario traduce de portugués a español.

Formato JSON por item:
{
  "type": "{{type}}",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": { "source": "<frase origen>", "target": "<traducción modelo>", "acceptedAlternatives": ["..."] },
  "ptOverrides": { "target": "<solo si difiere>", "acceptedAlternatives": [...] } | undefined,
  "esContrast": "..."
}

Solo el array JSON.
```

- [ ] **Step 6: Verb-preposition prompt**

```markdown
<!-- scripts/prompts/verb_preposition.md -->
Genera {{N}} ejercicios de régimen preposicional para la lección "{{lessonName}}" del bloque "{{blockName}}". Foco: errores comunes ES→PT (gostar DE, precisar DE, pensar EM, etc.).

Conceptos: {{conceptsList}}

Formato JSON por item:
{
  "type": "verb_preposition",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": {
    "verb": "gostar",
    "sentence": "Eu gosto ___ café.",
    "options": ["de", "a", "em", "—"],
    "answer": "de"
  },
  "ptOverrides": undefined,
  "esContrast": "En español 'gustar' no lleva prep, en PT 'gostar' rige DE."
}

Solo el array JSON.
```

- [ ] **Step 7: Commit**

```bash
git add scripts/prompts/
git commit -m "feat(scripts): prompt templates for 5 exercise types"
```

---

### Task 12: Prompt runner (TDD)

**Files:**
- Create: `scripts/lib/prompt-runner.ts`
- Test: `tests/unit/prompt-runner.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/prompt-runner.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderTemplate, runPromptGeneration } from '@/scripts/lib/prompt-runner';

describe('renderTemplate', () => {
  it('replaces {{var}} placeholders', () => {
    const out = renderTemplate('Hello {{name}}, you have {{n}} items.', { name: 'Edu', n: 5 });
    expect(out).toBe('Hello Edu, you have 5 items.');
  });

  it('replaces conceptsList from arrays', () => {
    const out = renderTemplate('Concepts:\n{{conceptsList}}', { conceptsList: '- a\n- b' });
    expect(out).toContain('- a');
  });
});

describe('runPromptGeneration', () => {
  it('uses cache on second call (no LLM hit)', async () => {
    const { hashKey } = await import('@/scripts/lib/cache');
    void hashKey;
    const callLlm = vi.fn().mockResolvedValue('[{"type":"flashcard","difficulty":1,"concepts":[],"tags":[],"data":{"front":"x","back":"y"}}]');
    const tmp = await (await import('node:fs/promises')).mkdtemp('/tmp/pr-');
    const params = {
      cacheDir: tmp,
      systemPrompt: 'sys',
      template: 'gen {{N}}',
      vars: { N: 1 },
      schemaVersion: 1,
      lessonId: 'l1',
      type: 'flashcard' as const,
      conceptIds: [],
      callLlm,
    };
    const a = await runPromptGeneration(params);
    const b = await runPromptGeneration(params);
    expect(callLlm).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
  });
});
```

- [ ] **Step 2: Run to fail**

```bash
npm test -- prompt-runner
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// scripts/lib/prompt-runner.ts
import { ExerciseBatchSchema, type ExerciseBatchItem, type ExerciseType } from './zod-schemas';
import { readCache, writeCache } from './cache';
import { extractJson } from './minimax-llm';

export function renderTemplate(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = vars[k];
    if (v === undefined) throw new Error(`Template var missing: ${k}`);
    return String(v);
  });
}

export interface PromptGenerationParams {
  cacheDir: string;
  systemPrompt: string;
  template: string;
  vars: Record<string, string | number>;
  schemaVersion: number;
  lessonId: string;
  type: ExerciseType;
  conceptIds: string[];
  callLlm: (args: { system: string; user: string }) => Promise<string>;
}

export async function runPromptGeneration(p: PromptGenerationParams): Promise<ExerciseBatchItem[]> {
  const user = renderTemplate(p.template, p.vars);
  const cacheKey = {
    schemaVersion: p.schemaVersion,
    lessonId: p.lessonId,
    type: p.type,
    conceptIds: [...p.conceptIds].sort(),
    user,
    system: p.systemPrompt,
  };

  const hit = await readCache<ExerciseBatchItem[]>(p.cacheDir, cacheKey);
  if (hit) return hit;

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await p.callLlm({ system: p.systemPrompt, user });
      const parsed = extractJson(raw);
      const validated = ExerciseBatchSchema.parse(parsed);
      await writeCache(p.cacheDir, cacheKey, validated);
      return validated;
    } catch (err) {
      lastErr = err;
      console.warn(`[runPromptGeneration] attempt ${attempt} failed for ${p.lessonId}/${p.type}:`, (err as Error).message);
    }
  }
  throw lastErr;
}
```

- [ ] **Step 4: Run test to pass**

```bash
npm test -- prompt-runner
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/prompt-runner.ts tests/unit/prompt-runner.test.ts
git commit -m "feat(scripts): prompt runner with cache + Zod validation + retry"
```

---

### Task 13: Audio collector (TDD)

**Files:**
- Create: `scripts/lib/audio-collector.ts`
- Test: `tests/unit/audio-collector.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/audio-collector.test.ts
import { describe, it, expect } from 'vitest';
import { collectAudioJobs } from '@/scripts/lib/audio-collector';
import type { Exercise } from '@/scripts/lib/zod-schemas';

const ex = (over: Partial<Exercise> = {}): Exercise => ({
  id: 'x', blockId: 1, lessonId: 'l',
  type: 'flashcard', difficulty: 1, concepts: [], tags: [],
  data: { front: 'q', back: 'resposta' } as any,
  ...over,
});

describe('collectAudioJobs', () => {
  it('emits br + pt jobs for flashcard.back', () => {
    const jobs = collectAudioJobs([ex()]);
    expect(jobs).toHaveLength(2);
    expect(jobs.map(j => j.variant).sort()).toEqual(['br', 'pt']);
    expect(jobs.every(j => j.text === 'resposta')).toBe(true);
  });

  it('uses ptOverrides.back when present for pt variant', () => {
    const jobs = collectAudioJobs([ex({
      data: { front: 'ônibus', back: 'ônibus' } as any,
      ptOverrides: { back: 'autocarro' } as any,
    })]);
    const pt = jobs.find(j => j.variant === 'pt')!;
    expect(pt.text).toBe('autocarro');
  });

  it('emits audioText for listening exercises', () => {
    const jobs = collectAudioJobs([ex({
      type: 'listening',
      data: { audioText: 'Bom dia.', question: 'q', answer: 'a' } as any,
    })]);
    expect(jobs).toHaveLength(2);
    expect(jobs[0].text).toBe('Bom dia.');
  });

  it('deduplicates identical (text, variant) jobs across exercises', () => {
    const jobs = collectAudioJobs([
      ex({ id: 'a', data: { front: 'q', back: 'mesma palavra' } as any }),
      ex({ id: 'b', data: { front: 'q', back: 'mesma palavra' } as any }),
    ]);
    expect(jobs).toHaveLength(2); // not 4
  });
});
```

- [ ] **Step 2: Run to fail**

```bash
npm test -- audio-collector
```

- [ ] **Step 3: Implement**

```ts
// scripts/lib/audio-collector.ts
import type { Exercise, ExerciseType } from './zod-schemas';

export interface AudioJob {
  text: string;
  variant: 'br' | 'pt';
}

function textsFor(ex: Exercise, variant: 'br' | 'pt'): string[] {
  const data: any = variant === 'pt' && ex.ptOverrides
    ? { ...ex.data, ...ex.ptOverrides }
    : ex.data;
  const t: ExerciseType = ex.type;
  switch (t) {
    case 'flashcard':
      return [data.back].filter(Boolean);
    case 'listening':
      return [data.audioText].filter(Boolean);
    case 'translation_es_pt':
      return [data.target].filter(Boolean);
    case 'translation_pt_es':
      return [data.source].filter(Boolean);
    case 'sentence_construction':
      return [data.answer?.join(' ')].filter(Boolean);
    case 'chunk':
      return [data.chunk].filter(Boolean);
    case 'fill_blank':
    case 'verb_preposition':
      return []; // no audio by default
  }
}

export function collectAudioJobs(exercises: Exercise[]): AudioJob[] {
  const seen = new Set<string>();
  const jobs: AudioJob[] = [];
  for (const ex of exercises) {
    for (const variant of ['br', 'pt'] as const) {
      for (const text of textsFor(ex, variant)) {
        const key = `${variant}::${text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        jobs.push({ text, variant });
      }
    }
  }
  return jobs;
}
```

- [ ] **Step 4: Run to pass**

```bash
npm test -- audio-collector
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/audio-collector.ts tests/unit/audio-collector.test.ts
git commit -m "feat(scripts): audio job collector with variant-aware dedup"
```

---

## Milestone 3 — Curriculum + Block 1

### Task 14: Curriculum module

**Files:** Create `lib/data/curriculum.ts`.

- [ ] **Step 1: Define types and Block 1 fully, blocks 2-10 as skeletons**

```ts
// lib/data/curriculum.ts

export type ConceptId = string;
export type LessonId = string;

export interface Concept {
  id: ConceptId;
  name: string;
  blockId: number;
  description: string;
  prereqs: ConceptId[];
}

export interface Lesson {
  id: LessonId;
  blockId: number;
  name: string;
  objectives: string[];
  conceptIds: ConceptId[];
  // Pre-teaching vocab: list of "front" strings the LLM will turn into flashcards explicitly.
  vocabKeySeeds: string[];
}

export interface Block {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationWeeks: number | null;
  prereqs: number[];
  freeDrill: boolean;
  lessons: Lesson[];
}

// --- Block 1: Fonética e ortografia ---
const B1_CONCEPTS: Concept[] = [
  { id: 'b1-alfabeto', name: 'Alfabeto portugués', blockId: 1, description: 'Letras y nombres en portugués', prereqs: [] },
  { id: 'b1-acentos', name: 'Acentos diacríticos', blockId: 1, description: 'Agudo, grave, circunflejo, tilde, cedilha', prereqs: [] },
  { id: 'b1-silaba-tonica', name: 'Sílaba tónica', blockId: 1, description: 'Reglas de acentuación tónica', prereqs: ['b1-acentos'] },
  { id: 'b1-corresp-on-ao', name: 'Correspondencia -ón → -ão', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-corresp-ll-lh', name: 'Correspondencia -ll- → -lh-', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-corresp-nh-ny', name: 'Correspondencia -ñ → -nh-', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-h-muda', name: 'H muda', blockId: 1, description: 'H inicial siempre muda', prereqs: [] },
  { id: 'b1-vogais-nasais', name: 'Vocales nasales', blockId: 1, description: 'ã, õ, am, em, im, om, um', prereqs: [] },
  { id: 'b1-pron-rr-r', name: 'Pronunciación rr/r inicial', blockId: 1, description: 'En BR como /h/; en PT vibrante', prereqs: [] },
  { id: 'b1-pron-s-final', name: 'Pronunciación de "s" final', blockId: 1, description: 'BR /s/; PT /ʃ/', prereqs: [] },
];

const B1_LESSONS: Lesson[] = [
  {
    id: 'b1-l1-alfabeto-acentos',
    blockId: 1,
    name: 'Alfabeto y acentos',
    objectives: [
      'Reconocer todas las letras del alfabeto portugués',
      'Identificar y nombrar los acentos (´ ` ^ ~ ¸)',
    ],
    conceptIds: ['b1-alfabeto', 'b1-acentos'],
    vocabKeySeeds: ['a', 'e', 'i', 'o', 'u', 'á', 'à', 'â', 'ã', 'ç'],
  },
  {
    id: 'b1-l2-silaba-tonica',
    blockId: 1,
    name: 'Sílaba tónica y reglas de acentuación',
    objectives: [
      'Identificar la sílaba tónica en cualquier palabra',
      'Aplicar reglas de acentuación gráfica',
    ],
    conceptIds: ['b1-silaba-tonica'],
    vocabKeySeeds: ['fácil', 'difícil', 'café', 'avó', 'avô', 'táxi', 'lápis'],
  },
  {
    id: 'b1-l3-correspondencias-es-pt',
    blockId: 1,
    name: 'Correspondencias sistemáticas español → portugués',
    objectives: [
      'Aplicar las reglas -ón→-ão, -ll-→-lh-, -ñ-→-nh-',
      'Reconocer h muda',
    ],
    conceptIds: ['b1-corresp-on-ao', 'b1-corresp-ll-lh', 'b1-corresp-nh-ny', 'b1-h-muda'],
    vocabKeySeeds: ['coração', 'canção', 'mulher', 'olho', 'manhã', 'banho', 'hotel', 'hora'],
  },
  {
    id: 'b1-l4-vogais-nasais',
    blockId: 1,
    name: 'Vocales nasales',
    objectives: [
      'Reconocer y producir vocales nasales',
      'Distinguir vocal nasal de vocal + n/m',
    ],
    conceptIds: ['b1-vogais-nasais'],
    vocabKeySeeds: ['mãe', 'pão', 'cão', 'irmão', 'bem', 'bom', 'ruim', 'um'],
  },
  {
    id: 'b1-l5-pron-rr-s',
    blockId: 1,
    name: 'Pronunciación de rr/r y s final (BR vs PT)',
    objectives: [
      'Reconocer pronunciación de rr/r inicial en BR vs PT',
      'Reconocer "s" final en BR vs PT',
    ],
    conceptIds: ['b1-pron-rr-r', 'b1-pron-s-final'],
    vocabKeySeeds: ['rato', 'carro', 'rua', 'dois', 'mais', 'meses', 'olhos'],
  },
];

const B1: Block = {
  id: 1,
  slug: 'fonetica',
  name: 'Sistema fonético y ortográfico',
  description: 'Alfabeto, acentos, sílaba tónica, correspondencias sistemáticas ES→PT, h muda, vocales nasales, diferencias clave de pronunciación BR vs PT.',
  durationWeeks: 2,
  prereqs: [],
  freeDrill: false,
  lessons: B1_LESSONS,
};

// --- Skeleton blocks 2-10 ---
function skeleton(id: number, slug: string, name: string, weeks: number | null, prereqs: number[], freeDrill = false): Block {
  return { id, slug, name, description: '', durationWeeks: weeks, prereqs, freeDrill, lessons: [] };
}

const B2  = skeleton(2,  'morfologia-nominal',     'Morfología nominal', 4, [1]);
const B3  = skeleton(3,  'presente-imperativo',    'Verbal: presente e imperativo', 4, [2]);
const B4  = skeleton(4,  'pasados',                'Verbal: pasados', 6, [3]);
const B5  = skeleton(5,  'futuros-condicional',    'Verbal: futuros y condicional', 3, [4]);
const B6  = skeleton(6,  'subjuntivo',             'Subjuntivo', 8, [5]);
const B7  = skeleton(7,  'formas-no-personales',   'Formas no personales', 3, [6]);
const B8  = skeleton(8,  'sintaxis-conectores',    'Sintaxis y conectores', 4, [7]);
const B9  = skeleton(9,  'lexico',                 'Léxico por campos', null, [], true);
const B10 = skeleton(10, 'registros-variacion',    'Registros y variación', 2, [8]);

export const BLOCKS: Block[] = [B1, B2, B3, B4, B5, B6, B7, B8, B9, B10];

export const ALL_CONCEPTS: Concept[] = [...B1_CONCEPTS];

export function getBlock(id: number): Block {
  const b = BLOCKS.find(b => b.id === id);
  if (!b) throw new Error(`Block ${id} not found`);
  return b;
}

export function getLesson(id: LessonId): Lesson {
  for (const b of BLOCKS) {
    const l = b.lessons.find(l => l.id === id);
    if (l) return l;
  }
  throw new Error(`Lesson ${id} not found`);
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  return ids.map(id => {
    const c = ALL_CONCEPTS.find(c => c.id === id);
    if (!c) throw new Error(`Concept ${id} not found`);
    return c;
  });
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/data/curriculum.ts
git commit -m "feat(data): curriculum with full Block 1 + skeleton blocks 2-10"
```

---

### Task 15: generate-curriculum script (writes concepts.json)

**Files:** Create `scripts/generate-curriculum.ts`. Modify `package.json`.

- [ ] **Step 1: Implement**

```ts
// scripts/generate-curriculum.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { ALL_CONCEPTS } from '@/lib/data/curriculum';
import { DATA_DIR } from './config';

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, 'concepts.json');
  const sorted = [...ALL_CONCEPTS].sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${sorted.length} concepts → ${path.relative(process.cwd(), file)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Add script to package.json**

```json
{
  "scripts": {
    "generate:curriculum": "tsx scripts/generate-curriculum.ts"
  }
}
```

(Merge with existing scripts.)

- [ ] **Step 3: Run it**

```bash
npm run generate:curriculum
```

Expected: `Wrote 10 concepts → lib/data/concepts.json`. File exists and is valid JSON.

- [ ] **Step 4: Verify rerun is identical**

```bash
npm run generate:curriculum
git diff lib/data/concepts.json
```

Expected: No diff.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-curriculum.ts package.json lib/data/concepts.json
git commit -m "feat(scripts): generate-curriculum (writes concepts.json)"
```

---

### Task 16: generate-content orchestrator

**Files:** Create `scripts/generate-content.ts`. Modify `package.json`.

- [ ] **Step 1: Implement**

```ts
// scripts/generate-content.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';
import { BLOCKS, getBlock, getConceptsByIds, type Lesson } from '@/lib/data/curriculum';
import {
  BLOCKS_DIR, LLM_CACHE, LLM_CONCURRENCY, SCHEMA_VERSION,
  EXERCISES_PER_LESSON,
} from './config';
import { hashKey } from './lib/cache';
import { callLlm } from './lib/minimax-llm';
import { runPromptGeneration } from './lib/prompt-runner';
import type { ExerciseType, Exercise } from './lib/zod-schemas';
import { ExerciseSchema } from './lib/zod-schemas';

const PROMPTS_DIR = path.join(__dirname, 'prompts');

async function loadPrompt(name: string): Promise<string> {
  return fs.readFile(path.join(PROMPTS_DIR, `${name}.md`), 'utf8');
}

interface CliArgs { block?: number; force: boolean; }
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let block: number | undefined;
  let force = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--block') { block = Number(args[++i]); }
    else if (args[i] === '--force') { force = true; }
  }
  return { block, force };
}

const TYPE_TO_TEMPLATE: Record<ExerciseType, string | null> = {
  flashcard: 'flashcard',
  fill_blank: 'fill_blank',
  listening: 'listening',
  translation_es_pt: 'translation',
  translation_pt_es: 'translation',
  verb_preposition: 'verb_preposition',
  sentence_construction: null, // skip for MVP1 — defer to later plan
  chunk: null,                 // skip for MVP1
};

function templateVars(lesson: Lesson, blockName: string, type: ExerciseType, n: number): Record<string, string | number> {
  const concepts = getConceptsByIds(lesson.conceptIds);
  const conceptsList = concepts.map(c => `- ${c.id}: ${c.name} — ${c.description}`).join('\n');
  const base = { N: n, lessonName: lesson.name, blockName, conceptsList };
  if (type === 'translation_es_pt') return { ...base, direction: 'es_pt', type };
  if (type === 'translation_pt_es') return { ...base, direction: 'pt_es', type };
  return base;
}

async function main() {
  const { block, force } = parseArgs();
  const targets = block ? [getBlock(block)] : BLOCKS;
  const system = await loadPrompt('system');
  const limit = pLimit(LLM_CONCURRENCY);

  for (const b of targets) {
    if (b.lessons.length === 0) {
      console.log(`Block ${b.id} (${b.slug}) has no lessons defined yet — skipping.`);
      continue;
    }

    const out: Exercise[] = [];
    console.log(`\n=== Block ${b.id}: ${b.name} ===`);

    const jobs: Array<() => Promise<void>> = [];

    for (const lesson of b.lessons) {
      for (const [type, n] of Object.entries(EXERCISES_PER_LESSON) as [ExerciseType, number][]) {
        const templateName = TYPE_TO_TEMPLATE[type];
        if (!templateName) continue;

        jobs.push(() => limit(async () => {
          const template = await loadPrompt(templateName);
          const vars = templateVars(lesson, b.name, type, n);
          console.log(`  → ${lesson.id} / ${type} (n=${n})`);

          const cacheDir = force ? path.join(LLM_CACHE, 'never-hit-' + Date.now()) : LLM_CACHE;
          const items = await runPromptGeneration({
            cacheDir,
            systemPrompt: system,
            template,
            vars,
            schemaVersion: SCHEMA_VERSION,
            lessonId: lesson.id,
            type,
            conceptIds: lesson.conceptIds,
            callLlm,
          });

          items.forEach((item, i) => {
            const id = `${lesson.id}-${type}-${String(i + 1).padStart(3, '0')}`;
            const ex: Exercise = {
              id,
              blockId: b.id,
              lessonId: lesson.id,
              type: item.type,
              difficulty: item.difficulty,
              concepts: item.concepts,
              tags: item.tags,
              data: item.data,
              ...(item.ptOverrides ? { ptOverrides: item.ptOverrides } : {}),
              ...(item.esContrast ? { esContrast: item.esContrast } : {}),
            };
            ex.contentHash = hashKey({
              type: ex.type, data: ex.data, ptOverrides: ex.ptOverrides, esContrast: ex.esContrast,
            });
            const parsed = ExerciseSchema.safeParse(ex);
            if (!parsed.success) {
              console.warn(`  ⚠ Skipping invalid item ${id}:`, parsed.error.issues[0]?.message);
              return;
            }
            out.push(parsed.data);
          });
        }));
      }
    }

    await Promise.all(jobs.map(j => j()));

    out.sort((a, b) => a.id.localeCompare(b.id));
    await fs.mkdir(BLOCKS_DIR, { recursive: true });
    const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
    await fs.writeFile(file, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log(`Wrote ${out.length} exercises → ${path.relative(process.cwd(), file)}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Add script to package.json**

```json
{
  "scripts": {
    "generate:content": "tsx scripts/generate-content.ts"
  }
}
```

- [ ] **Step 3: Dry-run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit (run actual generation in next task)**

```bash
git add scripts/generate-content.ts package.json
git commit -m "feat(scripts): generate-content orchestrator for exercises"
```

---

### Task 17: Run content generation for Block 1

**Files:** Will produce `lib/data/blocks/b1.json` + `scripts/.cache/llm/*.json` (cache gitignored).

- [ ] **Step 1: Verify env**

```bash
test -f .env.local && grep -q MINIMAX_API_KEY .env.local && echo "ok" || echo "MISSING"
```

Expected: `ok`. If MISSING, copy from example and paste real key before continuing.

- [ ] **Step 2: Load env and run for Block 1**

```bash
set -a; source .env.local; set +a
npm run generate:content -- --block 1
```

Expected output: progress logs per lesson/type, ending with `Wrote N exercises → lib/data/blocks/b1.json` (N ≈ 5 lessons × 6 types × ~5-15 items = ~150-450 depending on LLM yield).

- [ ] **Step 3: Sanity inspect output**

```bash
node -e "const a=require('./lib/data/blocks/b1.json'); console.log('count:',a.length); console.log('types:',[...new Set(a.map(x=>x.type))]); console.log('sample:', JSON.stringify(a[0], null, 2));"
```

Expected: count > 50, types include flashcard/fill_blank/listening/translation/verb_preposition, sample looks pedagogically reasonable.

- [ ] **Step 4: Verify rerun is idempotent (no LLM calls, no diff)**

```bash
npm run generate:content -- --block 1
git diff lib/data/blocks/b1.json
```

Expected: log shows "cache hits" via fast completion, git diff empty.

- [ ] **Step 5: Commit the generated content**

```bash
git add lib/data/blocks/b1.json
git commit -m "data: generated exercises for Block 1 (fonética)"
```

---

### Task 18: generate-audio orchestrator

**Files:** Create `scripts/generate-audio.ts`. Modify `package.json`.

- [ ] **Step 1: Implement**

```ts
// scripts/generate-audio.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';
import { BLOCKS, getBlock } from '@/lib/data/curriculum';
import {
  BLOCKS_DIR, DATA_DIR, TTS_CONCURRENCY, TTS_OUTPUT, VOICES, DEFAULT_VOICE,
  TTS_MODEL, LLM_MODEL,
} from './config';
import { collectAudioJobs } from './lib/audio-collector';
import { generateTts } from './lib/minimax-tts';
import { ExerciseSchema, type Exercise } from './lib/zod-schemas';

interface CliArgs { block?: number; }
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let block: number | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--block') block = Number(args[++i]);
  }
  return { block };
}

async function loadBlockExercises(blockId: number): Promise<Exercise[]> {
  const file = path.join(BLOCKS_DIR, `b${blockId}.json`);
  const raw = await fs.readFile(file, 'utf8');
  const parsed = JSON.parse(raw) as unknown[];
  return parsed.map(e => ExerciseSchema.parse(e));
}

async function main() {
  const { block } = parseArgs();
  const blocks = block ? [getBlock(block)] : BLOCKS;
  const limit = pLimit(TTS_CONCURRENCY);

  // audioIndex maps: variant → text → hash
  const audioIndex: Record<string, Record<string, string>> = { br: {}, pt: {} };
  const manifestBlocks: Record<string, { exerciseCount: number; audioCount: number }> = {};

  for (const b of blocks) {
    if (b.lessons.length === 0) continue;
    let exercises: Exercise[];
    try {
      exercises = await loadBlockExercises(b.id);
    } catch (err) {
      console.log(`Block ${b.id} has no generated content yet — skipping.`);
      continue;
    }

    const jobs = collectAudioJobs(exercises);
    console.log(`\n=== Block ${b.id}: ${jobs.length} audio jobs ===`);

    let done = 0;
    const audioResults = await Promise.all(jobs.map(j => limit(async () => {
      const voice = VOICES[j.variant][DEFAULT_VOICE];
      const result = await generateTts({ text: j.text, voiceId: voice, variant: j.variant });
      done++;
      if (done % 20 === 0) console.log(`  progress: ${done}/${jobs.length}`);
      return { ...j, ...result, voice };
    })));

    // Attach audio refs back into exercises (where audio applies).
    for (const ex of exercises) {
      const brTexts = collectAudioJobs([ex]).filter(j => j.variant === 'br').map(j => j.text);
      const ptTexts = collectAudioJobs([ex]).filter(j => j.variant === 'pt').map(j => j.text);
      const brText = brTexts[0];
      const ptText = ptTexts[0];
      if (!brText || !ptText) continue;
      const brR = audioResults.find(r => r.variant === 'br' && r.text === brText);
      const ptR = audioResults.find(r => r.variant === 'pt' && r.text === ptText);
      if (brR && ptR) {
        ex.audio = {
          br: { hash: brR.hash, voice: brR.voice },
          pt: { hash: ptR.hash, voice: ptR.voice },
        };
      }
    }

    // Persist updated exercises with audio refs.
    const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
    await fs.writeFile(file, JSON.stringify(exercises, null, 2) + '\n', 'utf8');

    // Update audioIndex.
    for (const r of audioResults) {
      audioIndex[r.variant][r.text] = r.hash;
    }
    manifestBlocks[String(b.id)] = { exerciseCount: exercises.length, audioCount: jobs.length };
    console.log(`Block ${b.id}: ${jobs.length} audios generated (cached: ${audioResults.filter(r => r.cached).length})`);
  }

  // Merge with existing manifest (preserve blocks not regenerated).
  const manifestPath = path.join(DATA_DIR, 'manifest.json');
  let prev: any = {};
  try { prev = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}
  const manifest = {
    generatedAt: new Date().toISOString(),
    modelText: LLM_MODEL,
    modelTts: TTS_MODEL,
    voices: VOICES,
    blocks: { ...(prev.blocks ?? {}), ...manifestBlocks },
    audioIndex: {
      br: { ...(prev.audioIndex?.br ?? {}), ...audioIndex.br },
      pt: { ...(prev.audioIndex?.pt ?? {}), ...audioIndex.pt },
    },
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`\nManifest updated: ${path.relative(process.cwd(), manifestPath)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Add script to package.json**

```json
{
  "scripts": {
    "generate:audio": "tsx scripts/generate-audio.ts"
  }
}
```

- [ ] **Step 3: Add convenience meta-script**

```json
{
  "scripts": {
    "generate:all": "npm run generate:curriculum && npm run generate:content && npm run generate:audio"
  }
}
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-audio.ts package.json
git commit -m "feat(scripts): generate-audio (TTS pipeline with manifest)"
```

---

### Task 19: Confirm MiniMax voices for PT-BR / PT-PT

**Files:** Possibly modify `scripts/config.ts`.

The voice IDs in `config.ts` are placeholders. MiniMax has a voice listing endpoint or docs. Verify the real IDs before running TTS at scale.

- [ ] **Step 1: Try a single TTS call with current voice IDs**

Create a one-off script `scripts/probe-tts.ts`:

```ts
import 'dotenv/config';
import { generateTts } from './lib/minimax-tts';
import { VOICES } from './config';
async function main() {
  for (const variant of ['br', 'pt'] as const) {
    const voiceId = VOICES[variant].f;
    try {
      const r = await generateTts({ text: 'Olá, bom dia.', voiceId, variant });
      console.log(`${variant}/${voiceId}: ${r.cached ? 'cached' : 'generated'} → ${r.filePath}`);
    } catch (err) {
      console.error(`${variant}/${voiceId} FAILED:`, (err as Error).message);
    }
  }
}
main();
```

Run:

```bash
set -a; source .env.local; set +a
npm i -D dotenv 2>/dev/null || true
npx tsx scripts/probe-tts.ts
```

- [ ] **Step 2: If a voice ID is invalid**

Check `https://api.minimax.io/v1/get_voice` (or current MiniMax docs URL for voice listing) using your API key:

```bash
curl -s -X GET https://api.minimax.io/v1/get_voice \
  -H "Authorization: Bearer $MINIMAX_API_KEY" | jq '.system_voice[] | select(.voice_name | test("Portuguese"; "i")) | {voice_id, voice_name}' 2>/dev/null || \
curl -s -X GET https://api.minimax.io/v1/get_voice \
  -H "Authorization: Bearer $MINIMAX_API_KEY"
```

Pick one female + one male voice per variant from the returned list. Edit `scripts/config.ts` `VOICES` constant to use the real IDs.

- [ ] **Step 3: Re-probe**

```bash
rm -f public/audio/*.mp3   # clear any failed/empty files from previous attempt
npx tsx scripts/probe-tts.ts
```

Expected: 2 MP3s in `public/audio/`. Open one in Finder to verify it actually plays Portuguese.

- [ ] **Step 4: Cleanup probe script**

```bash
rm scripts/probe-tts.ts
```

- [ ] **Step 5: Commit voice updates if any**

```bash
git add scripts/config.ts
git commit -m "fix(scripts): confirmed MiniMax PT-BR/PT-PT voice IDs" || echo "no changes"
```

---

### Task 20: Run audio generation for Block 1

- [ ] **Step 1: Run**

```bash
set -a; source .env.local; set +a
npm run generate:audio -- --block 1
```

Expected: progress logs, ending with summary of audios generated. `public/audio/` populated with N MP3s (likely 200-600 files for Block 1 depending on exercises).

- [ ] **Step 2: Spot-check audio quality**

```bash
ls public/audio/ | head -3
open public/audio/$(ls public/audio/ | head -1)
```

Expected: a real MP3 plays Portuguese. If quality is poor or wrong language, revisit voice IDs.

- [ ] **Step 3: Verify rerun is idempotent (all cached)**

```bash
npm run generate:audio -- --block 1
```

Expected: very fast completion, "cached: N" matches total count.

- [ ] **Step 4: Verify b1.json now has audio refs**

```bash
node -e "const a=require('./lib/data/blocks/b1.json'); console.log('with audio:', a.filter(x=>x.audio).length, '/ total:', a.length);"
```

Expected: most flashcards/listening/translations have audio refs.

- [ ] **Step 5: Commit audio + manifest + updated b1.json**

```bash
git add public/audio/ lib/data/manifest.json lib/data/blocks/b1.json
git commit -m "data: generated audio for Block 1 (PT-BR + PT-PT)"
```

(Repo size will grow by ~10-50MB depending on audio count. This is expected per design.)

---

### Task 21: verify-content script

**Files:** Create `scripts/verify-content.ts`. Modify `package.json`.

- [ ] **Step 1: Implement**

```ts
// scripts/verify-content.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { BLOCKS } from '@/lib/data/curriculum';
import { BLOCKS_DIR, DATA_DIR, TTS_OUTPUT } from './config';
import { ExerciseSchema, type Exercise } from './lib/zod-schemas';

interface ManifestShape {
  audioIndex: { br: Record<string, string>; pt: Record<string, string> };
  blocks: Record<string, { exerciseCount: number; audioCount: number }>;
}

async function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  const manifestPath = path.join(DATA_DIR, 'manifest.json');
  let manifest: ManifestShape;
  try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); }
  catch { errors.push(`Manifest missing or invalid: ${manifestPath}`); return done(); }

  for (const b of BLOCKS) {
    if (b.lessons.length === 0) continue;
    const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
    let exercises: Exercise[];
    try {
      const raw = JSON.parse(await fs.readFile(file, 'utf8')) as unknown[];
      exercises = raw.map((x, i) => {
        const r = ExerciseSchema.safeParse(x);
        if (!r.success) {
          errors.push(`b${b.id}.json[${i}]: ${r.error.issues[0]?.message}`);
          return null as any;
        }
        return r.data;
      }).filter(Boolean) as Exercise[];
    } catch {
      warnings.push(`Block ${b.id} has no generated exercises (b${b.id}.json missing).`);
      continue;
    }

    for (const lesson of b.lessons) {
      const count = exercises.filter(e => e.lessonId === lesson.id).length;
      if (count < 10) warnings.push(`Lesson ${lesson.id}: only ${count} exercises generated (expected ≥ 10).`);
    }

    for (const ex of exercises) {
      if (!ex.audio) continue;
      for (const variant of ['br', 'pt'] as const) {
        const hash = ex.audio[variant].hash;
        const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
        try { await fs.access(mp3); }
        catch { errors.push(`${ex.id}: missing audio file public/audio/${hash}.mp3 (${variant})`); }
      }
    }
  }

  // Cross-check manifest audioIndex hashes have real files.
  for (const variant of ['br', 'pt'] as const) {
    for (const [text, hash] of Object.entries(manifest.audioIndex?.[variant] ?? {})) {
      const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
      try { await fs.access(mp3); }
      catch { errors.push(`manifest.audioIndex.${variant}["${text.slice(0,30)}..."]: missing ${hash}.mp3`); }
    }
  }

  done();
  function done() {
    if (warnings.length) {
      console.log('\nWARNINGS:');
      warnings.forEach(w => console.log('  ⚠', w));
    }
    if (errors.length) {
      console.log('\nERRORS:');
      errors.forEach(e => console.log('  ✗', e));
      process.exit(1);
    }
    console.log(`\n✓ Verification passed (${warnings.length} warnings, 0 errors).`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Add script**

```json
{
  "scripts": {
    "verify:content": "tsx scripts/verify-content.ts"
  }
}
```

- [ ] **Step 3: Run**

```bash
npm run verify:content
```

Expected: `✓ Verification passed`. May show warnings for blocks 2-10 (they have no lessons yet).

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-content.ts package.json
git commit -m "feat(scripts): verify-content (schema + audio file integrity)"
```

---

### Task 22: README documenting the pipeline

**Files:** Create/overwrite `README.md`.

- [ ] **Step 1: Write README**

```markdown
# Aprende Português

App de aprendizaje estructurado de portugués (BR + PT) para hispanohablantes. Sigue el currículo de 10 bloques: fonética → morfología → verbos → subjuntivo → sintaxis → léxico → variación.

**Status:** MVP #1 — pipeline de generación + Bloque 1 (fonética) generado. UI en próximo plan.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Editar .env.local y pegar MINIMAX_API_KEY real
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia Next.js en http://localhost:3000 |
| `npm test` | Corre tests unitarios (vitest) |
| `npm run typecheck` | TypeScript en modo `--noEmit` |
| `npm run generate:curriculum` | Escribe `lib/data/concepts.json` desde curriculum.ts |
| `npm run generate:content -- --block N` | Genera ejercicios del bloque N con MiniMax LLM |
| `npm run generate:audio -- --block N` | Genera MP3s del bloque N con MiniMax TTS |
| `npm run generate:all` | Pipeline completo de generación |
| `npm run verify:content` | Valida JSONs + integridad de audios |

## Idempotencia

Todas las llamadas a MiniMax están cacheadas por hash determinista:
- **LLM cache:** `scripts/.cache/llm/<hash>.json` (gitignored, regenerable).
- **Audio:** `public/audio/<hash>.mp3` (committed). Mismo texto + voz + variante = mismo hash = mismo archivo.

Re-ejecutar cualquier script con todo cacheado no llama a la API y no produce git diff. Para forzar regeneración: `--force`.

## Estructura

Ver `docs/plans/2026-06-04-aprende-portugues-design.md` para el diseño completo.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README with pipeline usage"
```

---

### Task 23: Final end-to-end verification

This task is a verification gate, not new code.

- [ ] **Step 1: Clean rebuild from scratch**

```bash
rm -rf scripts/.cache
npm run typecheck
npm test
```

Expected: typecheck clean, all unit tests pass.

- [ ] **Step 2: Full pipeline rerun on Block 1**

```bash
set -a; source .env.local; set +a
npm run generate:curriculum
npm run generate:content -- --block 1
npm run generate:audio -- --block 1
npm run verify:content
```

Expected:
- `generate:curriculum` writes concepts.json (no diff vs committed version).
- `generate:content` re-runs LLM for Block 1 (cache was deleted) → produces b1.json. Compare to previous committed b1.json: should be very similar (LLM is somewhat deterministic at temp 0.4 but not exactly).
- `generate:audio` is fully cached (audio cache is committed in `public/audio/`) → 0 new API calls, all `cached: N`.
- `verify:content` passes.

- [ ] **Step 3: Reset b1.json if LLM produced minor differences**

If `git diff lib/data/blocks/b1.json` shows changes you don't want, restore:

```bash
git checkout lib/data/blocks/b1.json
```

- [ ] **Step 4: Final commit if anything changed**

```bash
git status
# If clean, done. Otherwise add + commit.
```

- [ ] **Step 5: Tag MVP #1**

```bash
git tag -a mvp-1-pipeline -m "MVP #1: pipeline + Block 1 generated"
```

---

## Done — what you have now

- Next.js project bootstrapped with strict TS, Tailwind, all runtime deps.
- Vitest configured with unit tests for the cache, prompt runner, zod schemas, audio collector.
- Idempotent hash-based cache for LLM + TTS.
- Working pipeline: `generate-curriculum`, `generate-content`, `generate-audio`, `verify-content`.
- Real content for Block 1 (fonética): exercises in `lib/data/blocks/b1.json` + MP3s in `public/audio/`.
- Manifest tracking audio index per variant.
- README documenting usage.

**What's deferred to Plan #2:** All UI — Home, lesson screens, ExerciseRunner, Dexie wiring, FSRS runtime, navigation, basic styling beyond defaults.

---

## Self-Review

**Spec coverage (Plan #1 scope):**
- Bootstrap with Next.js + Tailwind + Dexie + ts-fsrs deps ✓ (Tasks 1-2)
- TypeScript strict + path aliases ✓ (Task 3)
- Vitest setup ✓ (Task 4)
- Cache module with idempotency guarantees ✓ (Task 6)
- MiniMax LLM wrapper using SDK Anthropic baseURL override ✓ (Task 9)
- MiniMax TTS wrapper hitting `/v1/t2a_v2` with hash cache ✓ (Task 10)
- Prompt templates for 5 exercise types ✓ (Task 11) — `sentence_construction` and `chunk` deferred (noted in TYPE_TO_TEMPLATE map).
- Prompt runner with cache + Zod validation + retry ✓ (Task 12)
- Audio collector dedup ✓ (Task 13)
- Curriculum module with Block 1 full + skeletons 2-10 ✓ (Task 14)
- Content generation orchestrator ✓ (Task 16)
- Audio generation orchestrator with manifest ✓ (Task 18)
- Voice ID confirmation step ✓ (Task 19)
- Block 1 end-to-end run ✓ (Tasks 17, 20)
- Verify script ✓ (Task 21)
- README ✓ (Task 22)
- E2E verification gate ✓ (Task 23)

**Placeholder scan:** No "TBD" or "implement later" left in steps. `sentence_construction` and `chunk` types are explicitly mapped to `null` in TYPE_TO_TEMPLATE with a comment, deferring them to a later plan rather than leaving stubs.

**Type consistency:** `Exercise`, `ExerciseData`, `ExerciseBatchItem`, `VOICES`, `ConceptId`, `LessonId`, `AudioJob`, `TtsRequest`, `TtsResult` — all defined once and used consistently across tasks.

**Known minor follow-ups (intentional, not blockers):**
- The Block 1 LLM generation can vary slightly across runs because of LLM non-determinism even at low temperature. Task 23 step 3 documents the recovery (`git checkout`). Cache prevents this on normal reruns.
- Voice IDs in `config.ts` are best-effort placeholders; Task 19 verifies and corrects.
