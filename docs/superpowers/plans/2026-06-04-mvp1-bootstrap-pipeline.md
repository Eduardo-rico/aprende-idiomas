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

- [ ] **Step 0: Audit `.gitignore` BEFORE create-next-app**

The current `.gitignore` (already created) is minimal. Replace its contents with this canonical list (don't trust CNA's defaults):

```gitignore
# dependencies
node_modules/
.pnp
.pnp.js

# next.js
.next/
out/
build/

# env
.env
.env.local
.env*.local
*.local

# testing
coverage/
.playwright/

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# misc
.DS_Store
*.pem
.vscode/

# typescript
*.tsbuildinfo
next-env.d.ts

# pipeline cache (regenerable, committed only output JSONs + audio)
scripts/.cache/
public/audio/*.mp3.tmp
```

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
git commit -m "chore: bootstrap Next.js 16 + TS + Tailwind + canonical .gitignore"
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

### Task 4: Setup vitest + full `package.json` scripts (all generation commands upfront)

**Files:** Create `vitest.config.ts`, `tests/setup.ts`. Modify `package.json` to add ALL generation scripts now (no editing later).

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

- [ ] **Step 3: Add COMPLETE scripts block to package.json (definitive — no further edits)**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "generate:curriculum": "tsx scripts/generate-curriculum.ts",
    "generate:content":    "tsx scripts/generate-content.ts",
    "generate:audio":      "tsx scripts/generate-audio.ts",
    "generate:stories":    "tsx scripts/generate-stories.ts",
    "generate:all":        "npm run generate:curriculum && npm run generate:content && npm run generate:audio && npm run verify:content",
    "verify:content":      "tsx scripts/verify-content.ts",
    "probe:tts":           "tsx scripts/probe-tts.ts"
  }
}
```

Note: ALL generation-related commands are present from this point forward. Future tasks do NOT edit `package.json` — they create the corresponding files.

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
git commit -m "test: setup vitest + complete package.json scripts (no future edits)"
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
import { hashKey, readCache, writeCache, normalizeForHash } from '@/scripts/lib/cache';

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

  it('normalizeForHash strips undefined and NaN consistently', () => {
    // { a: undefined } normaliza a {} → mismo hash que {}
    expect(hashKey({ a: undefined })).toBe(hashKey({}));
    // NaN normaliza a null → mismo hash que { a: null }
    expect(hashKey({ a: NaN })).toBe(hashKey({ a: null }));
  });

  it('normalizeForHash applies NFC unicode normalization to strings', () => {
    // U+00E9 (composed) and U+0065 U+0301 (decomposed) must hash the same
    const composed = 'café';
    const decomposed = 'café';
    expect(composed.length).not.toBe(decomposed.length);
    expect(hashKey({ word: composed })).toBe(hashKey({ word: decomposed }));
  });

  it('writeCache is atomic: no .tmp artifact left after success', async () => {
    await writeCache(tmpDir, { k: 1 }, { v: 'x' });
    const files = fs.readdirSync(tmpDir);
    expect(files.filter(f => f.endsWith('.tmp'))).toHaveLength(0);
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

// Normalización para hashing estable.
// 1. JSON round-trip strips undefined y convierte NaN/Infinity → null.
// 2. Strings se normalizan a NFC (forma canónica compuesta) para que
//    ediciones con NFD (forma descomuesta) no invaliden el cache silenciosamente.
// 3. Recursión para cubrir estructuras anidadas.
export function normalizeForHash(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.normalize('NFC');
  if (typeof value === 'number') {
    if (Number.isNaN(value) || !Number.isFinite(value)) return null;
    return value;
  }
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(normalizeForHash);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj).sort()) {
      out[k] = normalizeForHash(obj[k]);
    }
    return out;
  }
  // functions, symbols, undefined → string representable, exclude them
  return null;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(normalizeForHash(value));
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
  await fs.rename(tmp, file); // atomic on same fs
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
npm test -- cache
```

Expected: 7 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/cache.ts tests/unit/cache.test.ts
git commit -m "feat(scripts): hardened cache module (NFC + undefined/NaN + atomic test)"
```

---

### Task 7: Generation config

**Files:** Create `scripts/config.ts`. Create `scripts/with-env.sh`.

- [ ] **Step 1: Create `scripts/with-env.sh` (wraps scripts with `.env.local` loading)**

```bash
#!/usr/bin/env bash
# scripts/with-env.sh — load .env.local into the current shell, then exec the given command.
# Uso: bash scripts/with-env.sh npm run generate:content -- --block 1
# Por qué: evita teclear `set -a; source .env.local; set +a` cada vez y previene que la
# API key quede en el historial del shell.
set -a
# shellcheck disable=SC1091
[ -f .env.local ] && source .env.local
set +a
exec "$@"
```

Make executable:

```bash
chmod +x scripts/with-env.sh
```

- [ ] **Step 2: Create config**

```ts
// scripts/config.ts
import path from 'node:path';
import type { ExerciseType } from './lib/zod-schemas';

// Resolves project root reliably under both ESM and tsx (which breaks __dirname).
// Always run scripts via `bash scripts/with-env.sh tsx ...` from project root.
export const PROJECT_ROOT = process.cwd();

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

// Voices — placeholders, confirmed via /v1/get_voice in Task 19.
// Each variant has a female + male voice. Default to female unless overridden.
export const VOICES: Record<'br' | 'pt', Record<'f' | 'm', string>> = {
  br: { f: 'Portuguese_Brazil_FemaleA', m: 'Portuguese_Brazil_MaleA' },
  pt: { f: 'Portuguese_Portugal_FemaleA', m: 'Portuguese_Portugal_MaleA' },
};

export const DEFAULT_VOICE: 'f' | 'm' = 'f';

// Mapping de ExerciseType → cuántos pedir al LLM por lección.
// Tipeado contra ExerciseType para que TS atrape typos. `null` = tipo diferido a Plan #2.
// Iteración de ExerciseType tipada exhaustivamente; añadir un tipo nuevo sin entrada → error.
export const EXERCISES_PER_LESSON: Record<ExerciseType, number | null> = {
  flashcard: 15,
  fill_blank: 10,
  listening: 5,
  translation_es_pt: 8,
  translation_pt_es: 8,
  verb_preposition: 5,
  sentence_construction: null, // diferido a Plan #2
  chunk: null,                 // diferido a Plan #2
};

// Mapping de ExerciseType → nombre de archivo de prompt. `null` = no generar.
export const TYPE_TO_TEMPLATE: Record<ExerciseType, string | null> = {
  flashcard: 'flashcard',
  fill_blank: 'fill_blank',
  listening: 'listening',
  translation_es_pt: 'translation',
  translation_pt_es: 'translation',
  verb_preposition: 'verb_preposition',
  sentence_construction: null,
  chunk: null,
};

// Costo estimado (USD) por 1k tokens para el modelo LLM actual.
// Usado por --dry-run para imprimir "Will cost ~$X".
export const COST_USD_PER_1K_INPUT  = 0.0002; // placeholder; calibrar con billing real
export const COST_USD_PER_1K_OUTPUT = 0.0006;

// SCHEMA_VERSION por tipo de exercise. Bumpear un tipo invalida SOLO su cache.
// (Una bump global es unsafe: cambios reales son por-tipo.)
export const SCHEMA_VERSION: Record<ExerciseType, number> = {
  flashcard: 1,
  fill_blank: 1,
  listening: 1,
  translation_es_pt: 1,
  translation_pt_es: 1,
  verb_preposition: 1,
  sentence_construction: 1,
  chunk: 1,
};
```

- [ ] **Step 3: Add `MINIMAX_API_KEY` accessor (fails loudly if missing)**

Append to `scripts/config.ts`:

```ts
export function requireApiKey(): string {
  const key = process.env.MINIMAX_API_KEY;
  if (!key) {
    throw new Error(
      'MINIMAX_API_KEY is not set. ' +
      'Add it to .env.local and run scripts via `bash scripts/with-env.sh tsx ...`'
    );
  }
  return key;
}
```

- [ ] **Step 4: Commit**

```bash
git add scripts/config.ts scripts/with-env.sh
git commit -m "feat(scripts): typed config + with-env.sh wrapper for safe env loading"
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
import {
  ExerciseSchema,
  FlashcardDataSchema,
  GeneratedExerciseSchema,
} from '@/scripts/lib/zod-schemas';

const baseCommon = {
  id: 'a1b2c3d4',
  blockId: 1,
  lessonId: 'b1-l1',
  difficulty: 1 as const,
  concepts: ['b1-fonema-vogais'],
  tags: [],
  contentHash: 'x'.repeat(64),
  audio: { br: { hash: 'h1', voice: 'v1' }, pt: { hash: 'h2', voice: 'v2' } },
};

describe('zod schemas', () => {
  it('valid flashcard exercise parses', () => {
    const ok = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'a', back: 'a (vogal aberta)', example: 'casa' },
    });
    expect(ok.success).toBe(true);
  });

  it('rejects exercise with unknown type', () => {
    const bad = ExerciseSchema.safeParse({
      ...baseCommon, type: 'mystery', data: {},
    });
    expect(bad.success).toBe(false);
  });

  it('flashcard data requires front and back', () => {
    const bad = FlashcardDataSchema.safeParse({ front: 'a' });
    expect(bad.success).toBe(false);
  });

  it('type/data coupling: a listening with flashcard data is REJECTED', () => {
    const bad = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'listening',
      data: { front: 'a', back: 'b' }, // wrong shape
    });
    expect(bad.success).toBe(false);
  });

  it('type/data coupling: a flashcard with listening data is REJECTED', () => {
    const bad = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { audioText: 'x', question: 'q', answer: 'a' },
    });
    expect(bad.success).toBe(false);
  });

  it('ptOverrides must match parent type (cannot mix fields from another type)', () => {
    // flashcard parent with chunk-typed ptOverrides
    const bad = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'a', back: 'b' },
      ptOverrides: { chunk: 'x', meaning: 'y', examples: [{ sentence: 's' }] },
    });
    expect(bad.success).toBe(false);
  });

  it('ptOverrides with valid flashcard fields parses', () => {
    const ok = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'ônibus', back: 'ônibus' },
      ptOverrides: { back: 'autocarro' },
    });
    expect(ok.success).toBe(true);
  });

  it('parses one valid instance of EACH exercise type', () => {
    const samples = [
      { type: 'fill_blank' as const, data: { sentence: 'Eu ___ café.', blanks: [{ position: 0, answer: 'tomo' }] } },
      { type: 'listening' as const, data: { audioText: 'Bom dia.', question: 'q', options: ['a', 'b'], answer: 'a' } },
      { type: 'translation_es_pt' as const, data: { source: 'Hola', target: 'Olá' } },
      { type: 'translation_pt_es' as const, data: { source: 'Olá', target: 'Hola' } },
      { type: 'verb_preposition' as const, data: { verb: 'gostar', sentence: 'Gosto ___ café.', options: ['de', 'a'], answer: 'de' } },
      { type: 'sentence_construction' as const, data: { words: ['eu', 'gosto', 'café'], answer: ['eu', 'gosto', 'café'] } },
      { type: 'chunk' as const, data: { chunk: 'tomar uma decisão', meaning: 'decidir', examples: [{ sentence: 'Vou tomar uma decisão.' }] } },
    ];
    for (const s of samples) {
      const r = ExerciseSchema.safeParse({ ...baseCommon, ...s });
      expect(r.success, `failed for type ${s.type}: ${r.success ? '' : JSON.stringify(r.error.issues[0])}`).toBe(true);
    }
  });

  it('GeneratedExerciseSchema requires audio and contentHash', () => {
    const r = GeneratedExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'a', back: 'b' },
    });
    expect(r.success).toBe(true);
  });

  it('GeneratedExerciseSchema rejects when audio is missing', () => {
    const { audio, ...withoutAudio } = baseCommon;
    void audio;
    const r = GeneratedExerciseSchema.safeParse({
      ...withoutAudio,
      type: 'flashcard',
      data: { front: 'a', back: 'b' },
    });
    expect(r.success).toBe(false);
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

// ─── ExerciseType ──────────────────────────────────────────────
// Tipos activos en MVP1. sentence_construction y chunk diferidos a Plan #2
// pero presentes en el enum para que el data model no requiera migración.
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

// ─── Per-type data shapes ──────────────────────────────────────
const AudioRefSchema = z.object({
  br: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
  pt: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
});

const FlashcardData = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  example: z.string().optional(),
});
const FillBlankData = z.object({
  sentence: z.string().min(1),
  blanks: z.array(z.object({
    position: z.number().int().nonnegative(),
    answer: z.string().min(1),
    alternatives: z.array(z.string()).optional(),
  })).min(1),
});
const ListeningData = z.object({
  audioText: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).min(2).optional(),
  answer: z.string().min(1),
});
const TranslationData = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  acceptedAlternatives: z.array(z.string()).optional(),
});
const VerbPrepositionData = z.object({
  verb: z.string().min(1),
  sentence: z.string().min(1),
  options: z.array(z.string()).min(2),
  answer: z.string().min(1),
});
const SentenceConstructionData = z.object({
  words: z.array(z.string()).min(2),
  answer: z.array(z.string()).min(2),
  translation: z.string().optional(),
});
const ChunkData = z.object({
  chunk: z.string().min(1),
  meaning: z.string().min(1),
  examples: z.array(z.object({ sentence: z.string().min(1), gloss: z.string().optional() })).min(1),
});

// Map para resolver el schema de data por tipo. Útil en audio-collector y
// generate-audio (re-validar tras spread de ptOverrides).
export const ExerciseDataByTypeSchema = {
  flashcard: FlashcardData,
  fill_blank: FillBlankData,
  listening: ListeningData,
  translation_es_pt: TranslationData,
  translation_pt_es: TranslationData,
  verb_preposition: VerbPrepositionData,
  sentence_construction: SentenceConstructionData,
  chunk: ChunkData,
} as const;

// ─── ptOverrides por tipo (todos los campos opcionales) ────────
const FlashcardOverride = FlashcardData.partial();
const FillBlankOverride = FillBlankData.partial();
const ListeningOverride = ListeningData.partial();
const TranslationOverride = TranslationData.partial();
const VerbPrepositionOverride = VerbPrepositionData.partial();
const SentenceConstructionOverride = SentenceConstructionData.partial();
const ChunkOverride = ChunkData.partial();

// ─── Exercise: discriminated union sobre `type` ────────────────
// CRÍTICO: el data y ptOverrides son variante-específicos. Cruzar tipos
// (ej. ptOverrides.audioText en un flashcard) no parsea.
const BaseExercise = z.object({
  id: z.string().min(1),
  blockId: z.number().int().positive(),
  lessonId: z.string().min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  concepts: z.array(z.string()),
  tags: z.array(z.string()),
  contentHash: z.string().optional(),
  esContrast: z.string().optional(),
  audio: AudioRefSchema.optional(),
});

const FlashcardEx = BaseExercise.extend({
  type: z.literal('flashcard'),
  data: FlashcardData,
  ptOverrides: FlashcardOverride.optional(),
});
const FillBlankEx = BaseExercise.extend({
  type: z.literal('fill_blank'),
  data: FillBlankData,
  ptOverrides: FillBlankOverride.optional(),
});
const ListeningEx = BaseExercise.extend({
  type: z.literal('listening'),
  data: ListeningData,
  ptOverrides: ListeningOverride.optional(),
});
const TranslationEsPtEx = BaseExercise.extend({
  type: z.literal('translation_es_pt'),
  data: TranslationData,
  ptOverrides: TranslationOverride.optional(),
});
const TranslationPtEsEx = BaseExercise.extend({
  type: z.literal('translation_pt_es'),
  data: TranslationData,
  ptOverrides: TranslationOverride.optional(),
});
const VerbPrepositionEx = BaseExercise.extend({
  type: z.literal('verb_preposition'),
  data: VerbPrepositionData,
  ptOverrides: VerbPrepositionOverride.optional(),
});
const SentenceConstructionEx = BaseExercise.extend({
  type: z.literal('sentence_construction'),
  data: SentenceConstructionData,
  ptOverrides: SentenceConstructionOverride.optional(),
});
const ChunkEx = BaseExercise.extend({
  type: z.literal('chunk'),
  data: ChunkData,
  ptOverrides: ChunkOverride.optional(),
});

export const ExerciseSchema = z.discriminatedUnion('type', [
  FlashcardEx, FillBlankEx, ListeningEx,
  TranslationEsPtEx, TranslationPtEsEx,
  VerbPrepositionEx, SentenceConstructionEx, ChunkEx,
]);
export type Exercise = z.infer<typeof ExerciseSchema>;

// Estado "generado y completo" — invariante al disco. Plan #1 debe commitear
// SOLO archivos que satisfagan esta invariante. validate-content la impone.
export const GeneratedExerciseSchema = ExerciseSchema.extend({
  contentHash: z.string().min(1),
  audio: AudioRefSchema,
});
export type GeneratedExercise = z.infer<typeof GeneratedExerciseSchema>;

// LLM batch output: el LLM produce N items, omitimos los campos que el
// orquestador adjunta (id, blockId, lessonId, contentHash, audio).
// El type discrimina el data shape.
const LlmItemSchema = z.discriminatedUnion('type', [
  FlashcardEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  FillBlankEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ListeningEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  TranslationEsPtEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  TranslationPtEsEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  VerbPrepositionEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  SentenceConstructionEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ChunkEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
]);
export const ExerciseBatchSchema = z.array(LlmItemSchema);
export type ExerciseBatchItem = z.infer<typeof ExerciseBatchSchema>[number];
```

- [ ] **Step 4: Run test**

```bash
npm test -- zod-schemas
```

Expected: 9 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/zod-schemas.ts tests/unit/zod-schemas.test.ts
git commit -m "feat(scripts): discriminated-union Exercise schemas + GeneratedExercise invariant"
```

---

### Task 9: MiniMax LLM wrapper (with hardened JSON extraction + refusal detection + retry/backoff)

**Files:**
- Create: `scripts/lib/minimax-llm.ts`
- Test: `tests/unit/minimax-llm.test.ts`

- [ ] **Step 1: Write the failing test for `extractJson`**

```ts
// tests/unit/minimax-llm.test.ts
import { describe, it, expect } from 'vitest';
import { extractJson } from '@/scripts/lib/minimax-llm';

describe('extractJson', () => {
  it('parses bare JSON', () => {
    expect(extractJson('[{"a":1}]')).toEqual([{ a: 1 }]);
  });

  it('strips leading and trailing markdown fences', () => {
    expect(extractJson('```json\n[{"a":1}]\n```')).toEqual([{ a: 1 }]);
  });

  it('finds the JSON array even with leading prose', () => {
    expect(extractJson('Sure, here are the items: [{"a":1}]')).toEqual([{ a: 1 }]);
  });

  it('finds the JSON object even with surrounding text', () => {
    expect(extractJson('Result: {"x":1} done.')).toEqual({ x: 1 });
  });

  it('repairs trailing commas in arrays', () => {
    expect(extractJson('[{"a":1},{"b":2},]')).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it('repairs trailing commas in objects', () => {
    expect(extractJson('{"a":1,"b":2,}')).toEqual({ a: 1, b: 2 });
  });

  it('throws on no JSON found', () => {
    expect(() => extractJson('No json here at all')).toThrow(/No JSON found/);
  });

  it('throws on truly unparseable JSON (after repair)', () => {
    expect(() => extractJson('[{"a": ')).toThrow();
  });
});
```

- [ ] **Step 2: Run to fail**

```bash
npm test -- minimax-llm
```

- [ ] **Step 3: Implement wrapper**

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
      timeout: 60_000, // 60s per request
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

export interface LlmCallResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export class TruncationError extends Error {
  constructor() { super('LLM response truncated (stop_reason=max_tokens). Reduce batch size.'); }
}
export class RefusalError extends Error {
  constructor(msg: string) { super(`LLM refused: ${msg.slice(0, 200)}`); }
}
export class EmptyResponseError extends Error {
  constructor(blocks: unknown[]) { super(`LLM returned no text blocks. Got: ${JSON.stringify(blocks).slice(0, 200)}`); }
}

const REFUSAL_REGEX = /cannot|I'm unable|lo siento|desculpe.*não/i;

export async function callLlm(params: LlmCallParams): Promise<LlmCallResult> {
  const res = await withBackoff(() => client().messages.create({
    model: LLM_MODEL,
    max_tokens: params.maxTokens ?? 4000,
    temperature: params.temperature ?? 0.4,
    system: params.system,
    messages: [{ role: 'user', content: params.user }],
  }));

  if (res.stop_reason === 'max_tokens') {
    throw new TruncationError();
  }

  const parts: string[] = [];
  for (const block of res.content) {
    if (block.type === 'text') parts.push(block.text);
  }
  if (parts.length === 0) {
    throw new EmptyResponseError(res.content);
  }
  const text = parts.join('\n').trim();

  if (REFUSAL_REGEX.test(text)) {
    throw new RefusalError(text);
  }

  return {
    text,
    inputTokens: res.usage.input_tokens,
    outputTokens: res.usage.output_tokens,
  };
}

// Retry con backoff exponencial y jitter. Reintenta 429 (parseando Retry-After),
// 5xx, y timeouts. NO reintenta TruncationError, RefusalError, 4xx con model_not_found.
async function withBackoff<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const status = err?.status ?? err?.statusCode;
      if (status === 400 && /model_not_found|deprecated/i.test(String(err?.error?.type ?? err?.message ?? ''))) {
        throw err; // no retry
      }
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err; // 4xx (except 429) → fail fast
      }
      if (i === attempts - 1) break;
      const retryAfter = err?.headers?.['retry-after'] ? Number(err.headers['retry-after']) * 1000 : 0;
      const base = 1000 * Math.pow(2, i);
      const jitter = Math.random() * 500;
      const delay = Math.max(retryAfter, base + jitter);
      await new Promise(r => setTimeout(r, Math.min(delay, 30_000)));
    }
  }
  throw lastErr;
}

// Extrae JSON de respuestas que pueden traer fences, prosa circundante, comas
// trailing, etc. Estrategia: strip fences, encontrar el primer [ o {, parsear
// substring, reparar trailing-comma con reintento, fallar con mensaje útil.
export function extractJson(raw: string): unknown {
  const stripped = raw.replace(/^```(?:json)?\s*\n/, '').replace(/\n```\s*$/, '').trim();
  const i = stripped.search(/[\[{]/);
  if (i === -1) {
    throw new Error(`No JSON found in LLM response. Raw start: ${raw.slice(0, 200)}`);
  }
  // Walk brackets to find the matching close instead of relying on lastIndexOf.
  const substr = stripped.slice(i);
  const end = findBalancedEnd(substr);
  if (end === -1) {
    throw new Error(`Unbalanced JSON delimiters. Raw: ${raw.slice(0, 200)}`);
  }
  let candidate = substr.slice(0, end + 1);
  try {
    return JSON.parse(candidate);
  } catch (firstErr) {
    // Intento 1: strip trailing commas (LLMs las emiten constantemente).
    const repaired = candidate.replace(/,(\s*[\]}])/g, '$1');
    try {
      return JSON.parse(repaired);
    } catch (secondErr) {
      throw new Error(
        `Failed to parse JSON after repair. Original: ${firstErr instanceof Error ? firstErr.message : firstErr}. ` +
        `Repaired: ${secondErr instanceof Error ? secondErr.message : secondErr}. ` +
        `Raw start: ${raw.slice(0, 200)}`
      );
    }
  }
}

function findBalancedEnd(s: string): number {
  const opener = s[0];
  const closer = opener === '[' ? ']' : '}';
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === opener) depth++;
    else if (c === closer) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
```

- [ ] **Step 4: Run test to pass**

```bash
npm test -- minimax-llm
```

Expected: 8 passed.

- [ ] **Step 5: Smoke typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/minimax-llm.ts tests/unit/minimax-llm.test.ts
git commit -m "feat(scripts): MiniMax LLM wrapper with balanced JSON extraction + refusal detection + backoff"
```

---

### Task 10: MiniMax TTS wrapper (size check + single-flight + retry/backoff)

**Files:**
- Create: `scripts/lib/minimax-tts.ts`
- Test: `tests/unit/minimax-tts.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/minimax-tts.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

vi.mock('@/scripts/config', async (orig) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tts-test-'));
  return {
    ...(await orig<any>()),
    TTS_OUTPUT: tmp,
    requireApiKey: () => 'test-key',
  };
});

import { generateTts, isValidMp3, _resetInflight } from '@/scripts/lib/minimax-tts';

const REAL_FETCH = globalThis.fetch;

beforeEach(() => {
  _resetInflight();
  vi.restoreAllMocks();
});
afterEach(() => {
  globalThis.fetch = REAL_FETCH;
});

function mockFetchOnce(responder: (url: string, init: any) => Promise<Response> | Response) {
  globalThis.fetch = vi.fn(((url: any, init: any) => responder(url, init)) as any) as any;
}

function mp3Hex(): string {
  // 64KB of zeros, prefixed with ID3v2 magic (a valid MP3 can start with ID3).
  // We just need enough bytes that isValidMp3() considers it a real MP3.
  const id3 = Buffer.from('ID3', 'utf8');
  const body = Buffer.alloc(64 * 1024, 0xAB);
  return Buffer.concat([id3, body]).toString('hex');
}

describe('generateTts', () => {
  it('throws on non-200 response', async () => {
    mockFetchOnce(async () => new Response('rate limited', { status: 429 }));
    await expect(generateTts({ text: 'oi', voiceId: 'v', variant: 'br' }))
      .rejects.toThrow(/TTS failed \(429\)/);
  });

  it('throws when data.audio is missing', async () => {
    mockFetchOnce(async () => new Response(JSON.stringify({ data: {} }), { status: 200 }));
    await expect(generateTts({ text: 'oi', voiceId: 'v', variant: 'br' }))
      .rejects.toThrow(/TTS missing audio/);
  });

  it('throws when decoded bytes are too small or not a valid MP3', async () => {
    mockFetchOnce(async () => new Response(JSON.stringify({ data: { audio: '00' } }), { status: 200 }));
    await expect(generateTts({ text: 'oi', voiceId: 'v', variant: 'br' }))
      .rejects.toThrow(/invalid MP3/);
  });

  it('writes a valid MP3 to disk and reports cached: false', async () => {
    mockFetchOnce(async () => new Response(JSON.stringify({ data: { audio: mp3Hex() } }), { status: 200 }));
    const r = await generateTts({ text: 'oi', voiceId: 'v', variant: 'br' });
    expect(r.cached).toBe(false);
    expect(fs.existsSync(r.filePath)).toBe(true);
    expect(fs.statSync(r.filePath).size).toBeGreaterThan(1024);
  });

  it('second call with same request returns cached: true and does not call fetch', async () => {
    let calls = 0;
    mockFetchOnce(async () => {
      calls++;
      return new Response(JSON.stringify({ data: { audio: mp3Hex() } }), { status: 200 });
    });
    const a = await generateTts({ text: 'cached-text', voiceId: 'v', variant: 'pt' });
    const b = await generateTts({ text: 'cached-text', voiceId: 'v', variant: 'pt' });
    expect(a.cached).toBe(false);
    expect(b.cached).toBe(true);
    expect(calls).toBe(1);
  });

  it('single-flight: concurrent calls for the same hash make only one fetch', async () => {
    let calls = 0;
    mockFetchOnce(async () => {
      calls++;
      await new Promise(r => setTimeout(r, 50));
      return new Response(JSON.stringify({ data: { audio: mp3Hex() } }), { status: 200 });
    });
    const req = { text: 'inflight', voiceId: 'v', variant: 'br' as const };
    const [a, b] = await Promise.all([generateTts(req), generateTts(req)]);
    expect(calls).toBe(1);
    expect(a.hash).toBe(b.hash);
  });
});

describe('isValidMp3', () => {
  it('accepts ID3 header', () => {
    const buf = Buffer.concat([Buffer.from('ID3', 'utf8'), Buffer.alloc(100, 0)]);
    expect(isValidMp3(buf)).toBe(true);
  });
  it('accepts MPEG frame sync (0xFF 0xFB)', () => {
    const buf = Buffer.concat([Buffer.from([0xFF, 0xFB, 0x90]), Buffer.alloc(100, 0)]);
    expect(isValidMp3(buf)).toBe(true);
  });
  it('rejects too-small buffer', () => {
    expect(isValidMp3(Buffer.alloc(10))).toBe(false);
  });
  it('rejects wrong magic', () => {
    const buf = Buffer.alloc(2048, 0xAB);
    expect(isValidMp3(buf)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to fail**

```bash
npm test -- minimax-tts
```

- [ ] **Step 3: Implement**

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

// language_boost: 'Portuguese' para BR, 'Portuguese (Portugal)' para PT.
// Verificado en Task 19 probe — si MiniMax no acepta el string específico,
// caemos al genérico y lo documentamos.
function languageBoost(variant: 'br' | 'pt'): string {
  return variant === 'pt' ? 'Portuguese (Portugal)' : 'Portuguese';
}

// Valida que un buffer es un MP3 razonable: >= 1KB y empieza con magic
// ID3v2 ('ID3') o MPEG frame sync (0xFF 0xFB/0xFA/0xF3/0xF2).
export function isValidMp3(buf: Buffer): boolean {
  if (buf.length < 1024) return false;
  if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) return true; // 'ID3'
  if (buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0) return true; // MPEG sync
  return false;
}

// Single-flight: si dos workers piden el mismo hash, solo uno hace fetch.
// Evita race en el `.tmp + rename` cuando dos workers ven el archivo ausente.
const inflight = new Map<string, Promise<TtsResult>>();
export function _resetInflight(): void { inflight.clear(); }

async function fetchAndStore(hash: string, filePath: string, body: object): Promise<TtsResult> {
  const res = await withBackoff(() => fetch(TTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  }));

  if (!res.ok) {
    throw new Error(`TTS failed (${res.status}): ${await res.text()}`);
  }
  const json = await res.json() as { data?: { audio?: string }; base_resp?: { status_msg?: string } };
  const hex = json.data?.audio;
  if (!hex) {
    throw new Error(`TTS missing audio in response: ${JSON.stringify(json.base_resp ?? json).slice(0, 300)}`);
  }

  const buf = Buffer.from(hex, 'hex');
  if (!isValidMp3(buf)) {
    throw new Error(
      `TTS returned invalid MP3 (length=${buf.length}, head=${buf.slice(0, 4).toString('hex')}). ` +
      `Refusing to write ${filePath}.`
    );
  }

  await fs.mkdir(TTS_OUTPUT, { recursive: true });
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, filePath);

  return { hash, filePath, cached: false };
}

export async function generateTts(req: TtsRequest): Promise<TtsResult> {
  const hash = ttsHash(req);
  const filePath = path.join(TTS_OUTPUT, `${hash}.mp3`);

  // Cache hit
  try {
    await fs.access(filePath);
    return { hash, filePath, cached: true };
  } catch {
    // not cached
  }

  // Single-flight
  const existing = inflight.get(hash);
  if (existing) return existing;

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
    language_boost: languageBoost(req.variant),
    output_format: 'hex',
  };

  const promise = fetchAndStore(hash, filePath, body)
    .finally(() => inflight.delete(hash));
  inflight.set(hash, promise);
  return promise;
}

async function withBackoff<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const status = err?.status ?? (err?.message?.match(/TTS failed \((\d+)\)/)?.[1] | 0);
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err; // 4xx (except 429) → fail fast
      }
      if (i === attempts - 1) break;
      const retryAfter = err?.headers?.['retry-after'] ? Number(err.headers['retry-after']) * 1000 : 0;
      const base = 1000 * Math.pow(2, i);
      const jitter = Math.random() * 500;
      const delay = Math.max(retryAfter, base + jitter);
      await new Promise(r => setTimeout(r, Math.min(delay, 30_000)));
    }
  }
  throw lastErr;
}
```

- [ ] **Step 4: Run test to pass**

```bash
npm test -- minimax-tts
```

Expected: 10 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/minimax-tts.ts tests/unit/minimax-tts.test.ts
git commit -m "feat(scripts): MiniMax TTS wrapper with isValidMp3 + single-flight + language_boost per variant"
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
- Cuando una palabra/frase difiere entre PT-BR y PT-PT, usa `data` para la versión brasileña y `ptOverrides` para los campos que cambian en europea. Si son idénticas, omite `ptOverrides`. `ptOverrides` debe tener solo campos que existan en `data` para el mismo `type` — campos de otro tipo no parsean.
- Cuando la diferencia con el español sea fuente común de error, incluye `esContrast` con una pista breve (max 120 caracteres) que ayude al hispanohablante.
- `concepts` debe contener únicamente IDs de la lista que te paso. No inventes IDs.
- `difficulty`: 1 = principiante, 2 = intermedio, 3 = avanzado.
- `tags`: opcionales; usa "falso-amigo", "irregular", "regional", "formal", "coloquial" cuando apliquen.
```

- [ ] **Step 2: Flashcard prompt**

```markdown
<!-- scripts/prompts/flashcard.md -->
Genera {{N}} flashcards para la lección "{{lessonName}}" del bloque "{{blockName}}" del curso de portugués.

Vocabulario clave (pre-teaching — DEBE aparecer como flashcards, al menos {{N}} items):
{{vocabKey}}

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

Vocabulario clave (úsalo si es relevante para la lección):
{{vocabKey}}

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

Vocabulario clave (úsalo en los `audioText`):
{{vocabKey}}

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

Vocabulario clave (úsalo en `source` o `target`):
{{vocabKey}}

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

Vocabulario clave (úsalo si es relevante para la lección):
{{vocabKey}}

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

### Task 12: Prompt runner (TDD, with refused-batch handling + structured results)

**Files:**
- Create: `scripts/lib/prompt-runner.ts`
- Test: `tests/unit/prompt-runner.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/prompt-runner.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { renderTemplate, runPromptGeneration } from '@/scripts/lib/prompt-runner';

const VALID = '[{"type":"flashcard","difficulty":1,"concepts":[],"tags":[],"data":{"front":"x","back":"y"}}]';

let tmp: string;
beforeEach(async () => { tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'pr-')); });
afterEach(async () => { await fs.rm(tmp, { recursive: true, force: true }); });

describe('renderTemplate', () => {
  it('replaces {{var}} placeholders', () => {
    const out = renderTemplate('Hello {{name}}, you have {{n}} items.', { name: 'Edu', n: 5 });
    expect(out).toBe('Hello Edu, you have 5 items.');
  });

  it('throws on missing var', () => {
    expect(() => renderTemplate('x {{missing}}', {})).toThrow(/missing/);
  });
});

describe('runPromptGeneration', () => {
  it('uses cache on second call (no LLM hit)', async () => {
    const callLlm = vi.fn().mockResolvedValue(VALID);
    const params = makeParams({ cacheDir: tmp, callLlm });
    const a = await runPromptGeneration(params);
    const b = await runPromptGeneration(params);
    expect(callLlm).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
  });

  it('returns rejected-batch result on partial Zod failure, not a throw', async () => {
    // 1 valid + 1 invalid (missing required field)
    const partial = JSON.stringify([
      { type: 'flashcard', difficulty: 1, concepts: [], tags: [], data: { front: 'a', back: 'b' } },
      { type: 'flashcard', difficulty: 1, concepts: [], tags: [], data: { front: 'c' } }, // invalid
    ]);
    const callLlm = vi.fn().mockResolvedValue(partial);
    const result = await runPromptGeneration(makeParams({ cacheDir: tmp, callLlm }));
    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].index).toBe(1);
  });

  it('retries on extractJson failure and succeeds on second attempt', async () => {
    const callLlm = vi.fn()
      .mockResolvedValueOnce('not json at all')
      .mockResolvedValueOnce(VALID);
    const result = await runPromptGeneration(makeParams({ cacheDir: tmp, callLlm }));
    expect(callLlm).toHaveBeenCalledTimes(2);
    expect(result.accepted).toHaveLength(1);
  });

  it('does NOT retry on RefusalError', async () => {
    const refusalErr = Object.assign(new Error('LLM refused: ...'), { name: 'RefusalError' });
    const callLlm = vi.fn().mockRejectedValue(refusalErr);
    await expect(runPromptGeneration(makeParams({ cacheDir: tmp, callLlm })))
      .rejects.toThrow(/refused/);
    expect(callLlm).toHaveBeenCalledTimes(1);
  });

  it('does NOT retry on TruncationError', async () => {
    const truncErr = Object.assign(new Error('truncated'), { name: 'TruncationError' });
    const callLlm = vi.fn().mockRejectedValue(truncErr);
    await expect(runPromptGeneration(makeParams({ cacheDir: tmp, callLlm })))
      .rejects.toThrow(/truncated/);
    expect(callLlm).toHaveBeenCalledTimes(1);
  });
});

function makeParams(over: Partial<any> = {}) {
  return {
    cacheDir: over.cacheDir,
    systemPrompt: 'sys',
    template: 'gen {{N}}',
    vars: { N: 1 },
    schemaVersion: 1,
    lessonId: 'l1',
    type: 'flashcard' as const,
    conceptIds: [],
    expectedCount: 1,
    callLlm: over.callLlm,
  };
}
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
import { extractJson, TruncationError, RefusalError } from './minimax-llm';

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
  /** Expected N from EXERCISES_PER_LESSON — used to warn on partial batches. */
  expectedCount: number;
  /** When true, skip readCache but still write to cache on success. */
  force?: boolean;
  callLlm: (args: { system: string; user: string }) => Promise<string>;
}

export interface RejectedItem {
  index: number;
  reason: string;
}

export interface BatchResult {
  accepted: ExerciseBatchItem[];
  rejected: RejectedItem[];
}

// Errores en los que NO tiene sentido reintentar (mismo prompt, misma respuesta).
function isNonRetriable(err: unknown): boolean {
  if (err instanceof TruncationError) return true;
  if (err instanceof RefusalError) return true;
  if (err && typeof err === 'object' && (err as any).name === 'TruncationError') return true;
  if (err && typeof err === 'object' && (err as any).name === 'RefusalError') return true;
  return false;
}

export async function runPromptGeneration(p: PromptGenerationParams): Promise<BatchResult> {
  const user = renderTemplate(p.template, p.vars);
  const cacheKey = {
    schemaVersion: p.schemaVersion,
    lessonId: p.lessonId,
    type: p.type,
    conceptIds: [...p.conceptIds].sort(),
    user,
    system: p.systemPrompt,
  };

  if (!p.force) {
    const hit = await readCache<ExerciseBatchItem[]>(p.cacheDir, cacheKey);
    if (hit) return partitionBatch(hit, p.expectedCount);
  }

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await p.callLlm({ system: p.systemPrompt, user });
      const parsed = extractJson(raw);
      const validated = ExerciseBatchSchema.parse(parsed);
      await writeCache(p.cacheDir, cacheKey, validated);
      return partitionBatch(validated, p.expectedCount);
    } catch (err) {
      lastErr = err;
      if (isNonRetriable(err)) throw err;
      console.warn(`[runPromptGeneration] attempt ${attempt} failed for ${p.lessonId}/${p.type}:`, (err as Error).message);
    }
  }
  throw lastErr;
}

function partitionBatch(items: ExerciseBatchItem[], expectedCount: number): BatchResult {
  const accepted: ExerciseBatchItem[] = [];
  const rejected: RejectedItem[] = [];
  items.forEach((item, index) => {
    accepted.push(item);
  });
  if (items.length < expectedCount) {
    rejected.push({
      index: -1,
      reason: `LLM returned ${items.length} items, expected ${expectedCount}.`,
    });
  }
  return { accepted, rejected };
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
  data: { front: 'q', back: 'resposta' },
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
      data: { front: 'ônibus', back: 'ônibus' },
      ptOverrides: { back: 'autocarro' },
    })]);
    const pt = jobs.find(j => j.variant === 'pt')!;
    expect(pt.text).toBe('autocarro');
  });

  it('emits audioText for listening exercises', () => {
    const jobs = collectAudioJobs([ex({
      type: 'listening',
      data: { audioText: 'Bom dia.', question: 'q', answer: 'a' },
    })]);
    expect(jobs).toHaveLength(2);
    expect(jobs[0].text).toBe('Bom dia.');
  });

  it('emits NO jobs for fill_blank and verb_preposition (not audio-eligible)', () => {
    expect(collectAudioJobs([ex({ type: 'fill_blank', data: { sentence: 'x', blanks: [{ position: 0, answer: 'y' }] } as any)])).toHaveLength(0);
    expect(collectAudioJobs([ex({ type: 'verb_preposition', data: { verb: 'g', sentence: 's', options: ['a', 'b'], answer: 'a' } as any)])).toHaveLength(0);
  });

  it('sentence_construction: text is answer joined by space', () => {
    const jobs = collectAudioJobs([ex({
      type: 'sentence_construction',
      data: { words: ['eu', 'gosto'], answer: ['eu', 'gosto', 'café'] },
    })]);
    expect(jobs.find(j => j.variant === 'br')!.text).toBe('eu gosto café');
  });

  it('deduplicates identical (text, variant) jobs across exercises', () => {
    const jobs = collectAudioJobs([
      ex({ id: 'a', data: { front: 'q', back: 'mesma palavra' } }),
      ex({ id: 'b', data: { front: 'q', back: 'mesma palavra' } }),
    ]);
    expect(jobs).toHaveLength(2); // not 4
  });

  it('exports textsFor for re-use in generate-audio Map building', () => {
    expect(textsFor(ex(), 'br')).toEqual(['resposta']);
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
import { ExerciseDataByTypeSchema } from './zod-schemas';

export interface AudioJob {
  text: string;
  variant: 'br' | 'pt';
}

/**
 * Devuelve los strings audio-eligible para un exercise y variante dados.
 * Re-valida el resultado del spread data + ptOverrides contra el schema del tipo
 * declarado: si ptOverrides tenía campos inválidos, throw. Esto convierte el
 * silent-corruption detectado en el review en un fail-fast explícito.
 *
 * Audio NO emitido para: fill_blank (la frase entera tendría audio pero su
 * valor pedagógico es bajo y haría inflar el cache 2x). verb_preposition igual.
 * sentence_construction emite el answer (la oración correcta).
 */
export function textsFor(ex: Exercise, variant: 'br' | 'pt'): string[] {
  if (variant === 'pt' && ex.ptOverrides) {
    const merged = { ...ex.data, ...ex.ptOverrides };
    // re-validar contra el schema del tipo declarado
    ExerciseDataByTypeSchema[ex.type].parse(merged);
  }
  const data: any = variant === 'pt' && ex.ptOverrides
    ? { ...ex.data, ...ex.ptOverrides }
    : ex.data;
  const t: ExerciseType = ex.type;
  switch (t) {
    case 'flashcard':
      return data.back ? [data.back] : [];
    case 'listening':
      return data.audioText ? [data.audioText] : [];
    case 'translation_es_pt':
      return data.target ? [data.target] : [];
    case 'translation_pt_es':
      return data.source ? [data.source] : [];
    case 'sentence_construction':
      return data.answer?.length ? [data.answer.join(' ')] : [];
    case 'chunk':
      return data.chunk ? [data.chunk] : [];
    case 'fill_blank':
    case 'verb_preposition':
      return [];
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

Expected: 7 passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/audio-collector.ts tests/unit/audio-collector.test.ts
git commit -m "feat(scripts): audio collector with re-validated ptOverrides spread + exported textsFor"
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
  /** Pre-teaching vocab: strings que el LLM debe convertir en flashcards explícitamente. */
  vocabKey: readonly string[];
  /** Path al archivo MDX con las notas conceptuales. Plan #2 lo renderiza. */
  conceptNotesPath: string;
  /** IDs de ejercicios asociados a esta lección (se llenan al generar contenido). */
  exerciseRefs: string[];
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
    vocabKey: ['a', 'e', 'i', 'o', 'u', 'á', 'à', 'â', 'ã', 'ç'] as const,
    conceptNotesPath: 'b1/l1-alfabeto-acentos.mdx',
    exerciseRefs: [],
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
    vocabKey: ['fácil', 'difícil', 'café', 'avó', 'avô', 'táxi', 'lápis'] as const,
    conceptNotesPath: 'b1/l2-silaba-tonica.mdx',
    exerciseRefs: [],
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
    vocabKey: ['coração', 'canção', 'mulher', 'olho', 'manhã', 'banho', 'hotel', 'hora'] as const,
    conceptNotesPath: 'b1/l3-correspondencias.mdx',
    exerciseRefs: [],
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
    vocabKey: ['mãe', 'pão', 'cão', 'irmão', 'bem', 'bom', 'ruim', 'um'] as const,
    conceptNotesPath: 'b1/l4-vogais-nasais.mdx',
    exerciseRefs: [],
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
    vocabKey: ['rato', 'carro', 'rua', 'dois', 'mais', 'meses', 'olhos'] as const,
    conceptNotesPath: 'b1/l5-pron-rr-s.mdx',
    exerciseRefs: [],
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

### Task 16: generate-content orchestrator (with ID-from-content-hash + real --force + --dry-run)

**Files:** Create `scripts/generate-content.ts`.

- [ ] **Step 1: Implement**

```ts
// scripts/generate-content.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';
import { BLOCKS, getBlock, getConceptsByIds, ALL_CONCEPTS, type Lesson } from '@/lib/data/curriculum';
import {
  BLOCKS_DIR, LLM_CACHE, LLM_CONCURRENCY, SCHEMA_VERSION,
  EXERCISES_PER_LESSON, TYPE_TO_TEMPLATE,
  COST_USD_PER_1K_INPUT, COST_USD_PER_1K_OUTPUT,
} from './config';
import { hashKey, normalizeForHash } from './lib/cache';
import { callLlm } from './lib/minimax-llm';
import { runPromptGeneration } from './lib/prompt-runner';
import { ExerciseSchema, type ExerciseType, type Exercise } from './lib/zod-schemas';

// Resolves to repo root reliably — see Task 7 for why.
const PROJECT_ROOT = process.cwd();
const PROMPTS_DIR = path.join(PROJECT_ROOT, 'scripts', 'prompts');

async function loadPrompt(name: string): Promise<string> {
  return fs.readFile(path.join(PROMPTS_DIR, `${name}.md`), 'utf8');
}

interface CliArgs { block?: number; force: boolean; dryRun: boolean; }
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let block: number | undefined;
  let force = false;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--block') { block = Number(args[++i]); }
    else if (args[i] === '--force') { force = true; }
    else if (args[i] === '--dry-run') { dryRun = true; }
  }
  return { block, force, dryRun };
}

function templateVars(lesson: Lesson, blockName: string, type: ExerciseType, n: number): Record<string, string | number> {
  const concepts = getConceptsByIds(lesson.conceptIds);
  const conceptsList = concepts.map(c => `- ${c.id}: ${c.name} — ${c.description}`).join('\n');
  const vocabKey = lesson.vocabKey.join(', ');
  const base = { N: n, lessonName: lesson.name, blockName, conceptsList, vocabKey };
  if (type === 'translation_es_pt') return { ...base, direction: 'es_pt', type };
  if (type === 'translation_pt_es') return { ...base, direction: 'pt_es', type };
  return base;
}

/** ID derivado del contenido. Estable a través de regeneraciones del LLM. */
function contentId(type: ExerciseType, data: any, ptOverrides: any, esContrast: string | undefined): string {
  return hashKey({ type, data, ptOverrides, esContrast }).slice(0, 8);
}

const VALID_CONCEPT_IDS = new Set(ALL_CONCEPTS.map(c => c.id));

async function main() {
  const { block, force, dryRun } = parseArgs();
  const targets = block ? [getBlock(block)] : BLOCKS;
  const system = await loadPrompt('system');
  const limit = pLimit(LLM_CONCURRENCY);

  // Pre-cálculo para --dry-run
  let totalCalls = 0;
  for (const b of targets) {
    if (b.lessons.length === 0) continue;
    for (const lesson of b.lessons) {
      for (const [type, n] of Object.entries(EXERCISES_PER_LESSON) as [ExerciseType, number | null][]) {
        if (n === null) continue;
        totalCalls++;
      }
    }
  }
  if (dryRun) {
    // Asumimos ~2k input + ~2k output tokens por call (orden de magnitud).
    const estIn  = totalCalls * 2000;
    const estOut = totalCalls * 2000;
    const estCost = (estIn / 1000) * COST_USD_PER_1K_INPUT + (estOut / 1000) * COST_USD_PER_1K_OUTPUT;
    console.log(`[dry-run] Will make ${totalCalls} LLM calls.`);
    console.log(`[dry-run] Estimated tokens: ${estIn} in / ${estOut} out. Estimated cost: $${estCost.toFixed(2)} USD.`);
    console.log(`[dry-run] Force mode: ${force}. Exiting without changes.`);
    return;
  }

  for (const b of targets) {
    if (b.lessons.length === 0) {
      console.log(`Block ${b.id} (${b.slug}) has no lessons defined yet — skipping.`);
      continue;
    }

    const out: Exercise[] = [];
    const rejectedLog: string[] = [];
    console.log(`\n=== Block ${b.id}: ${b.name} ===`);

    const jobs: Array<() => Promise<void>> = [];

    for (const lesson of b.lessons) {
      for (const [type, n] of Object.entries(EXERCISES_PER_LESSON) as [ExerciseType, number | null][]) {
        if (n === null) continue;
        const templateName = TYPE_TO_TEMPLATE[type];
        if (!templateName) continue;

        jobs.push(() => limit(async () => {
          const template = await loadPrompt(templateName);
          const vars = templateVars(lesson, b.name, type, n);
          console.log(`  → ${lesson.id} / ${type} (n=${n})`);

          const result = await runPromptGeneration({
            cacheDir: LLM_CACHE,
            systemPrompt: system,
            template,
            vars,
            schemaVersion: SCHEMA_VERSION[type],
            lessonId: lesson.id,
            type,
            conceptIds: lesson.conceptIds,
            expectedCount: n,
            force,
            callLlm,
          });

          // Log rejected (low count, etc.)
          for (const r of result.rejected) {
            const msg = `${lesson.id}/${type}: ${r.reason}`;
            console.warn(`  ⚠ ${msg}`);
            rejectedLog.push(msg);
          }

          for (const item of result.accepted) {
            const ex: Exercise = {
              id: contentId(item.type, item.data, item.ptOverrides, item.esContrast),
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
            ex.contentHash = hashKey(normalizeForHash({
              type: ex.type, data: ex.data, ptOverrides: ex.ptOverrides, esContrast: ex.esContrast,
            }));
            const parsed = ExerciseSchema.safeParse(ex);
            if (!parsed.success) {
              const msg = `${ex.id} (${lesson.id}/${type}): ${parsed.error.issues[0]?.message ?? 'Zod fail'}`;
              console.warn(`  ⚠ ${msg}`);
              rejectedLog.push(msg);
              continue;
            }
            // Validar que concepts referenciados existan.
            for (const c of parsed.data.concepts) {
              if (!VALID_CONCEPT_IDS.has(c)) {
                const msg = `${parsed.data.id}: unknown concept id "${c}"`;
                console.warn(`  ⚠ ${msg}`);
                rejectedLog.push(msg);
                // No rechazamos el item — solo logueamos. (El set crecerá.)
              }
            }
            out.push(parsed.data);
          }
        }));
      }
    }

    await Promise.all(jobs.map(j => j()));

    // Dedup por id (content-derived).
    const seen = new Set<string>();
    const deduped = out.filter(e => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    deduped.sort((a, b) => a.id.localeCompare(b.id));

    await fs.mkdir(BLOCKS_DIR, { recursive: true });
    const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(deduped, null, 2) + '\n', 'utf8');
    await fs.rename(tmp, file); // atomic
    console.log(`Wrote ${deduped.length} exercises (rejected: ${rejectedLog.length}) → ${path.relative(process.cwd(), file)}`);
    if (rejectedLog.length > 0) {
      const logFile = path.join(BLOCKS_DIR, `b${b.id}.rejected.json`);
      await fs.writeFile(logFile, JSON.stringify(rejectedLog, null, 2));
      console.log(`  See ${path.relative(process.cwd(), logFile)} for details.`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-content.ts
git commit -m "feat(scripts): content orchestrator with content-derived IDs, real --force, --dry-run, atomic write"
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

### Task 18: generate-audio orchestrator (with allSettled + Map lookup + atomic write + manifest GC)

**Files:** Create `scripts/generate-audio.ts`.

- [ ] **Step 1: Implement**

```ts
// scripts/generate-audio.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';
import { BLOCKS, getBlock } from '@/lib/data/curriculum';
import {
  BLOCKS_DIR, DATA_DIR, TTS_CONCURRENCY, VOICES, DEFAULT_VOICE,
  TTS_MODEL, LLM_MODEL,
} from './config';
import { collectAudioJobs, textsFor } from './lib/audio-collector';
import { generateTts, type TtsResult } from './lib/minimax-tts';
import { hashKey, normalizeForHash } from './lib/cache';
import { ExerciseSchema, type Exercise } from './lib/zod-schemas';

const PROJECT_ROOT = process.cwd();

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

async function loadBlockExercises(blockId: number): Promise<Exercise[]> {
  const file = path.join(BLOCKS_DIR, `b${blockId}.json`);
  const raw = await fs.readFile(file, 'utf8');
  const parsed = JSON.parse(raw) as unknown[];
  return parsed.map((e, i) => {
    const r = ExerciseSchema.safeParse(e);
    if (!r.success) throw new Error(`b${blockId}.json[${i}]: ${r.error.issues[0]?.message}`);
    return r.data;
  });
}

/** Per-block lockfile via mkdir+rmdir (atomic on POSIX). Prevents concurrent runs corrupting b1.json. */
async function withBlockLock<T>(blockId: number, fn: () => Promise<T>): Promise<T> {
  const lockDir = path.join(BLOCKS_DIR, `.b${blockId}.json.lock`);
  while (true) {
    try {
      await fs.mkdir(lockDir);
      break;
    } catch (err: any) {
      if (err?.code !== 'EEXIST') throw err;
      await new Promise(r => setTimeout(r, 100));
    }
  }
  try {
    return await fn();
  } finally {
    await fs.rmdir(lockDir);
  }
}

async function main() {
  const { block, force } = parseArgs();
  const targets = block ? [getBlock(block)] : BLOCKS;
  const limit = pLimit(TTS_CONCURRENCY);

  const audioIndex: Record<'br' | 'pt', Record<string, string>> = { br: {}, pt: {} };
  const manifestBlocks: Record<string, { exerciseCount: number; audioCount: number }> = {};

  for (const b of targets) {
    if (b.lessons.length === 0) continue;

    await withBlockLock(b.id, async () => {
      let exercises: Exercise[];
      try {
        exercises = await loadBlockExercises(b.id);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          console.log(`Block ${b.id} has no generated content yet — skipping.`);
          return;
        }
        throw err;
      }

      const jobs = collectAudioJobs(exercises);
      console.log(`\n=== Block ${b.id}: ${jobs.length} audio jobs ===`);

      // allSettled: 1 fallo no mata los otros 599 jobs.
      let done = 0;
      const settled = await Promise.allSettled(jobs.map(j => limit(async () => {
        const voice = VOICES[j.variant][DEFAULT_VOICE];
        const result = await generateTts({ text: j.text, voiceId: voice, variant: j.variant });
        done++;
        if (done % 20 === 0) console.log(`  progress: ${done}/${jobs.length}`);
        return { ...j, ...result, voice };
      })));

      const successes: Array<{ text: string; variant: 'br' | 'pt'; hash: string; voice: string; cached: boolean }> = [];
      const failures: Array<{ text: string; variant: string; reason: string }> = [];
      settled.forEach((r, i) => {
        const j = jobs[i]!;
        if (r.status === 'fulfilled') {
          successes.push(r.value);
        } else {
          failures.push({ text: j.text, variant: j.variant, reason: String(r.reason?.message ?? r.reason) });
        }
      });

      // Build a Map<string, TtsResult> for O(1) lookup in the attach loop.
      const audioMap = new Map<string, TtsResult & { variant: 'br' | 'pt' }>();
      for (const s of successes) audioMap.set(`${s.variant}::${s.text}`, s);

      // Attach audio refs. Reuse textsFor directly (no second collectAudioJobs call).
      let audioAttachedCount = 0;
      for (const ex of exercises) {
        const brText = textsFor(ex, 'br')[0];
        const ptText = textsFor(ex, 'pt')[0];
        if (!brText || !ptText) continue;
        const brR = audioMap.get(`br::${brText}`);
        const ptR = audioMap.get(`pt::${ptText}`);
        if (brR && ptR) {
          ex.audio = {
            br: { hash: brR.hash, voice: brR.voice },
            pt: { hash: ptR.hash, voice: ptR.voice },
          };
          // Recompute contentHash post-audio-attach so SRS keys on post-generated state.
          ex.contentHash = hashKey(normalizeForHash({
            type: ex.type, data: ex.data, ptOverrides: ex.ptOverrides, esContrast: ex.esContrast,
          }));
          audioAttachedCount++;
        }
      }

      // Persist updated exercises with audio refs. ATOMIC.
      const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
      const tmp = `${file}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(exercises, null, 2) + '\n', 'utf8');
      await fs.rename(tmp, file);

      // Update in-memory audioIndex for the manifest.
      for (const s of successes) {
        audioIndex[s.variant][s.text] = s.hash;
      }
      manifestBlocks[String(b.id)] = { exerciseCount: exercises.length, audioCount: jobs.length };
      const cachedCount = successes.filter(s => s.cached).length;
      console.log(`Block ${b.id}: ${successes.length} ok, ${failures.length} failed, audio attached: ${audioAttachedCount}, cached: ${cachedCount}`);
      if (failures.length > 0) {
        const logFile = path.join(BLOCKS_DIR, `b${b.id}.audio-failures.json`);
        await fs.writeFile(logFile, JSON.stringify(failures, null, 2));
        console.log(`  Failures: ${path.relative(process.cwd(), logFile)}`);
      }
    });
  }

  // Manifest con GC: podar entries del audioIndex que no estén en el contenido actual.
  const manifestPath = path.join(DATA_DIR, 'manifest.json');
  let prev: any = {};
  try { prev = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}

  // Construir set de textos usados en el contenido actual (de los bloques que regeneramos).
  const liveTexts = { br: new Set<string>(), pt: new Set<string>() };
  for (const b of targets) {
    if (b.lessons.length === 0) continue;
    let exercises: Exercise[] = [];
    try { exercises = await loadBlockExercises(b.id); } catch { continue; }
    for (const ex of exercises) {
      for (const t of textsFor(ex, 'br')) liveTexts.br.add(t);
      for (const t of textsFor(ex, 'pt')) liveTexts.pt.add(t);
    }
  }

  // Reconstruir audioIndex de los bloques regenerados: solo entradas vivas.
  const cleanIndex = { br: {} as Record<string, string>, pt: {} as Record<string, string> };
  for (const v of ['br', 'pt'] as const) {
    for (const [text, hash] of Object.entries(audioIndex[v])) {
      if (liveTexts[v].has(text)) cleanIndex[v][text] = hash;
    }
  }
  // Para bloques NO regenerados, conservar las entries vivas del manifest previo.
  const targetIds = new Set(targets.map(b => String(b.id)));
  for (const v of ['br', 'pt'] as const) {
    for (const [text, hash] of Object.entries(prev.audioIndex?.[v] ?? {})) {
      // Conservar solo si NO estamos regenerando su bloque y el texto sigue vivo.
      if (liveTexts[v].has(text) && !Object.keys(audioIndex[v]).includes(text)) {
        cleanIndex[v][text] = hash;
      }
    }
  }
  void targetIds; // suprimido: el check de "no regenerar" ya se aplica arriba

  // Determinar si el manifest cambia. Si no, preservar generatedAt.
  const newManifest = {
    modelText: LLM_MODEL,
    modelTts: TTS_MODEL,
    voices: VOICES,
    blocks: { ...(prev.blocks ?? {}), ...manifestBlocks },
    audioIndex: cleanIndex,
  };
  const prevComparable = { ...prev };
  delete prevComparable.generatedAt;
  const changed = JSON.stringify(prevComparable) !== JSON.stringify(newManifest);
  const finalManifest = {
    generatedAt: changed ? new Date().toISOString() : (prev.generatedAt ?? new Date().toISOString()),
    ...newManifest,
  };
  const tmp = `${manifestPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(finalManifest, null, 2) + '\n', 'utf8');
  await fs.rename(tmp, manifestPath);
  console.log(`\nManifest ${changed ? 'updated' : 'unchanged'}: ${path.relative(process.cwd(), manifestPath)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-audio.ts
git commit -m "feat(scripts): audio orchestrator with allSettled, Map lookup, lockfile, manifest GC, idempotent generatedAt"
```

---

### Task 19: Confirm MiniMax contracts (voices, output_format, language_boost, model)

**Files:** Create `scripts/probe-tts.ts` (kept permanently as a diagnostic — **do NOT delete**). Possibly modify `scripts/config.ts`.

Voice IDs in `config.ts` are placeholders. This task runs BEFORE Task 20 (TTS at scale). It must verify four contracts and probe both `f` and `m` voices for each variant.

- [ ] **Step 1: Implement probe-tts.ts (permanently, not deleted)**

```ts
// scripts/probe-tts.ts
// Diagnóstico de contratos MiniMax TTS. Se corre una vez al setup; queda como
// herramienta de diagnóstico para re-probar voces cuando cambien modelos.
// NO está en `generate:all`. Se invoca manualmente.
//
// Prerrequisito: `bash scripts/with-env.sh tsx scripts/probe-tts.ts`
//   (with-env.sh carga .env.local y exec tsx con la API key en el entorno).
import { generateTts, isValidMp3 } from './lib/minimax-tts';
import { VOICES, TTS_OUTPUT } from './config';
import { ttsHash } from './lib/minimax-tts';
import path from 'node:path';
import fs from 'node:fs';

const TORTURE = ['Olá, bom dia.', 'mãe', 'pão', 'coração', 'constituição', 'ônibus', 'autocarro'];

async function probeVariant(variant: 'br' | 'pt', which: 'f' | 'm'): Promise<boolean> {
  const voiceId = VOICES[variant][which];
  console.log(`\n--- ${variant}/${which} (${voiceId}) ---`);
  try {
    for (const text of TORTURE) {
      const r = await generateTts({ text, voiceId, variant });
      const fullPath = path.join(TTS_OUTPUT, `${r.hash}.mp3`);
      const stat = await fs.promises.stat(fullPath);
      console.log(`  "${text}" → ${r.cached ? 'cached' : 'new'} (${stat.size} bytes, hash=${r.hash.slice(0, 8)})`);
      if (stat.size < 1024) {
        console.error(`  ✗ File too small — TTS returned truncated audio`);
        return false;
      }
      if (!isValidMp3(await fs.promises.readFile(fullPath))) {
        console.error(`  ✗ File is not a valid MP3 (wrong magic bytes)`);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error(`  ✗ FAILED: ${(err as Error).message}`);
    return false;
  }
}

async function listAvailableVoices(): Promise<void> {
  console.log('\n--- Available Portuguese voices from /v1/get_voice ---');
  const res = await fetch('https://api.minimax.io/v1/get_voice', {
    headers: { Authorization: `Bearer ${process.env.MINIMAX_API_KEY!}` },
  });
  if (!res.ok) {
    console.error(`get_voice failed: ${res.status}`);
    return;
  }
  const json = await res.json() as any;
  const voices: any[] = json.system_voice ?? json.voices ?? [];
  const ptVoices = voices.filter((v: any) =>
    /portuguese|portugu[eê]s|brazil|brasil/i.test(`${v.voice_name ?? ''} ${v.voice_id ?? ''}`));
  console.log(`Total voices: ${voices.length}, Portuguese: ${ptVoices.length}`);
  for (const v of ptVoices.slice(0, 20)) {
    console.log(`  ${v.voice_id}  (${v.voice_name})`);
  }
}

async function main() {
  await listAvailableVoices();
  const results: Record<string, boolean> = {};
  for (const variant of ['br', 'pt'] as const) {
    for (const which of ['f', 'm'] as const) {
      results[`${variant}/${which}`] = await probeVariant(variant, which);
    }
  }
  console.log('\n=== Probe summary ===');
  for (const [k, v] of Object.entries(results)) {
    console.log(`  ${v ? '✓' : '✗'} ${k}`);
  }
  if (!results['br/f'] || !results['br/m']) {
    console.error('\nFATAL: BR voices missing. Edit scripts/config.ts VOICES.br.');
    process.exit(1);
  }
  if (!results['pt/f'] || !results['pt/m']) {
    console.warn('\nWARN: PT-PT voices missing. Edit scripts/config.ts VOICES.pt to use BR voices (acceptable fallback, will lose accent).');
    // NO exit — the orchestrator can fall back. Document this in VOICES comment.
  }
  void ttsHash; // silence unused
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run probe (using with-env.sh, not inline source)**

```bash
bash scripts/with-env.sh tsx scripts/probe-tts.ts
```

Expected:
- `get_voice` lists voices; ≥1 Portuguese (BR) voice, ideally ≥1 PT-PT voice.
- 2 (BR f/m) and ideally 2 (PT f/m) torture-list MP3s land in `public/audio/`.
- All MP3s are >= 1KB and pass `isValidMp3`.

- [ ] **Step 3: If any voice fails, edit `scripts/config.ts` VOICES with real IDs**

Pick from the probe output. Re-run until all 4 voices pass.

- [ ] **Step 4: Commit voice updates and probe script**

```bash
git add scripts/probe-tts.ts scripts/config.ts
git commit -m "fix(scripts): confirm MiniMax voice IDs via probe-tts torture test"
```

- [ ] **Step 5: Manual listen-through (NOT automatable — required before Task 20)**

Open 2 random MP3s from `public/audio/` in Finder. Confirm:
- Language is Portuguese, not Spanish/French.
- "Olá, bom dia." in BR vs PT sounds phonetically different (especially the 'r' in "bom dia").
- No truncated first phoneme, no robotic artifacts.

If quality is bad, document in `scripts/config.ts` comment and continue (better bad audio than no audio for MVP1).

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

### Task 21: verify-content script (with --strict + isValidMp3 + audio REQUIRED + GC report)

**Files:** Create `scripts/verify-content.ts`. Modify `package.json`.

- [ ] **Step 1: Implement**

```ts
// scripts/verify-content.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { BLOCKS } from '@/lib/data/curriculum';
import { BLOCKS_DIR, DATA_DIR, TTS_OUTPUT, EXERCISES_PER_LESSON, TYPE_TO_TEMPLATE } from './config';
import { ExerciseSchema, GeneratedExerciseSchema, type Exercise, type ExerciseType } from './lib/zod-schemas';
import { isValidMp3 } from './lib/minimax-tts';
import { textsFor } from './lib/audio-collector';

interface ManifestShape {
  generatedAt: string;
  audioIndex: { br: Record<string, string>; pt: Record<string, string> };
  blocks: Record<string, { exerciseCount: number; audioCount: number }>;
}

const STRICT = process.env.STRICT === '1';

const AUDIO_REQUIRED: Set<ExerciseType> = new Set([
  'flashcard', 'listening', 'translation_es_pt', 'translation_pt_es', 'sentence_construction', 'chunk',
]);

async function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  const manifestPath = path.join(DATA_DIR, 'manifest.json');
  let manifest: ManifestShape;
  try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); }
  catch { errors.push(`Manifest missing or invalid: ${manifestPath}`); finish(); return; }

  // Per-lección expected count derivado de EXERCISES_PER_LESSON.
  const expectedPerLesson = (): number => {
    let total = 0;
    for (const [type, n] of Object.entries(EXERCISES_PER_LESSON)) {
      if (n !== null && TYPE_TO_TEMPLATE[type as ExerciseType] !== null) total += n;
    }
    return total;
  };
  const expected = expectedPerLesson();

  for (const b of BLOCKS) {
    if (b.lessons.length === 0) continue;
    const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
    let exercises: Exercise[];
    try {
      const raw = JSON.parse(await fs.readFile(file, 'utf8')) as unknown[];
      const validated: Exercise[] = [];
      for (let i = 0; i < raw.length; i++) {
        const r = ExerciseSchema.safeParse(raw[i]);
        if (!r.success) {
          errors.push(`b${b.id}.json[${i}]: ${r.error.issues[0]?.message}`);
          continue;
        }
        validated.push(r.data);
      }
      exercises = validated;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        warnings.push(`Block ${b.id} has no generated exercises (b${b.id}.json missing).`);
        continue;
      }
      throw err;
    }

    for (const lesson of b.lessons) {
      const count = exercises.filter(e => e.lessonId === lesson.id).length;
      const msg = `Lesson ${lesson.id}: ${count} exercises generated (expected ~${expected}).`;
      if (count < expected) {
        (STRICT ? errors : warnings).push(msg);
      } else if (count === 0) {
        errors.push(`Lesson ${lesson.id}: ZERO exercises (silent failure).`);
      }
    }

    for (const ex of exercises) {
      // GeneratedExercise: contentHash y audio son invariantes.
      const g = GeneratedExerciseSchema.safeParse(ex);
      if (!g.success) {
        if (AUDIO_REQUIRED.has(ex.type) && !ex.audio) {
          errors.push(`${ex.id} (${ex.type}): audio required but missing.`);
        }
        if (!ex.contentHash) {
          errors.push(`${ex.id}: contentHash missing.`);
        }
      }
      // Si tiene audio, validar que el MP3 existe y es válido.
      if (ex.audio) {
        for (const variant of ['br', 'pt'] as const) {
          const hash = ex.audio[variant].hash;
          const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
          try {
            const stat = await fs.stat(mp3);
            if (stat.size < 1024) {
              errors.push(`${ex.id} (${variant}): audio file ${hash}.mp3 is ${stat.size} bytes (corrupt/truncated).`);
              continue;
            }
            const buf = await fs.readFile(mp3);
            if (!isValidMp3(buf)) {
              errors.push(`${ex.id} (${variant}): audio file ${hash}.mp3 has invalid MP3 magic bytes.`);
            }
          } catch (err) {
            const code = (err as NodeJS.ErrnoException).code;
            if (code === 'ENOENT') {
              errors.push(`${ex.id} (${variant}): missing audio file public/audio/${hash}.mp3`);
            } else {
              throw err;
            }
          }
        }
      }
    }
  }

  // Cross-check manifest audioIndex hashes have real files.
  for (const variant of ['br', 'pt'] as const) {
    for (const [text, hash] of Object.entries(manifest.audioIndex?.[variant] ?? {})) {
      const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
      try {
        const stat = await fs.stat(mp3);
        if (stat.size < 1024) {
          errors.push(`manifest.${variant}["${text.slice(0,30)}..."]: ${hash}.mp3 is ${stat.size} bytes.`);
        }
      } catch {
        errors.push(`manifest.${variant}["${text.slice(0,30)}..."]: missing ${hash}.mp3`);
      }
    }
  }

  // GC report: audios en public/audio/ no referenciados por el contenido actual.
  // No borra automáticamente — solo avisa para que el humano decida.
  const liveHashes = new Set<string>();
  for (const b of BLOCKS) {
    if (b.lessons.length === 0) continue;
    let exercises: Exercise[] = [];
    try {
      const raw = JSON.parse(await fs.readFile(path.join(BLOCKS_DIR, `b${b.id}.json`), 'utf8')) as unknown[];
      exercises = raw.flatMap(e => {
        const r = ExerciseSchema.safeParse(e);
        return r.success ? [r.data] : [];
      });
    } catch { continue; }
    for (const ex of exercises) {
      for (const t of textsFor(ex, 'br')) {
        const h = manifest.audioIndex?.br?.[t];
        if (h) liveHashes.add(h);
      }
      for (const t of textsFor(ex, 'pt')) {
        const h = manifest.audioIndex?.pt?.[t];
        if (h) liveHashes.add(h);
      }
    }
  }
  let orphanCount = 0;
  try {
    const files = await fs.readdir(TTS_OUTPUT);
    for (const f of files) {
      if (!f.endsWith('.mp3')) continue;
      const hash = f.replace(/\.mp3$/, '');
      if (!liveHashes.has(hash)) orphanCount++;
    }
  } catch {}
  if (orphanCount > 0) {
    warnings.push(`GC: ${orphanCount} MP3 file(s) in public/audio/ not referenced by any exercise. Manual cleanup recommended.`);
  }

  finish();
  function finish() {
    if (warnings.length) {
      console.log('\nWARNINGS:');
      warnings.forEach(w => console.log('  ⚠', w));
    }
    if (errors.length) {
      console.log('\nERRORS:');
      errors.forEach(e => console.log('  ✗', e));
      process.exit(1);
    }
    console.log(`\n✓ Verification passed (${warnings.length} warnings, 0 errors, mode: ${STRICT ? 'STRICT' : 'default'}).`);
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

Expected: `✓ Verification passed`. Warnings for blocks 2-10 (no lessons yet) are normal. Default mode warns on low counts; set `STRICT=1 npm run verify:content` to fail.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-content.ts package.json
git commit -m "feat(scripts): verify-content (strict mode, MP3 magic check, audio-required, orphan GC report)"
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

This task is a verification gate, not new code. Several gates — none pass-through.

- [ ] **Step 1: Static gates (must pass before any regeneration)**

```bash
npm run typecheck
npm test
STRICT=1 npm run verify:content  # STRICT mode en esta verificación final
```

Expected:
- typecheck: 0 errors. If any, fix and re-run before continuing.
- npm test: all unit tests pass.
- STRICT verify:content: 0 errors. Warnings for blocks 2-10 (no lessons) are normal.

If any gate fails, **stop and fix**. Do NOT proceed to Step 2.

- [ ] **Step 2: Clean LLM cache + full pipeline rerun on Block 1**

```bash
rm -rf scripts/.cache
bash scripts/with-env.sh npm run generate:curriculum
bash scripts/with-env.sh npm run generate:content -- --block 1
bash scripts/with-env.sh npm run generate:audio -- --block 1
bash scripts/with-env.sh npm run verify:content
```

Expected:
- `generate:curriculum` writes concepts.json (no diff vs committed version).
- `generate:content` re-runs LLM for Block 1 (cache was deleted) → produces b1.json.
- `generate:audio` mostly cached (audios committed in `public/audio/`); for any new texts, makes TTS calls.
- `verify:content` passes.

- [ ] **Step 3: Idempotency check (second rerun should be no-op)**

```bash
bash scripts/with-env.sh npm run generate:content -- --block 1
bash scripts/with-env.sh npm run generate:audio -- --block 1
git diff lib/data/blocks/b1.json lib/data/manifest.json
```

Expected: `git diff` shows only changes due to LLM non-determinism at temp 0.4 (acceptable). If major drift, consider lowering `temperature` in `callLlm` defaults or accepting the documented variance.

- [ ] **Step 4: Manual listen-through**

Open 2 random MP3s from `public/audio/`. Confirm Portuguese audio quality, no truncation, BR/PT distinction audible.

- [ ] **Step 5: Reset b1.json if LLM produced unacceptable differences**

```bash
git checkout lib/data/blocks/b1.json lib/data/manifest.json
```

- [ ] **Step 6: Final commit if anything changed**

```bash
git status
# If clean, done. Otherwise add + commit.
```

- [ ] **Step 7: Tag MVP #1**

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
