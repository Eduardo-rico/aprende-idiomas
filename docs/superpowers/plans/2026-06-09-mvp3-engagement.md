# Plan #3 — Engagement (Stories + Gamification + Stats + Diagnostic)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar el loop de engagement del usuario con mini-historias (sin karaoke), streak/XP/niveles/achievements derivados, daily goal anillos, stats con heatmap + charts, diagnostic test opt-in, y home dashboard rehecho. Tag al cerrar: `mvp-3-engagement`.

**Architecture:** Vertical slices (9 phases). Cada phase ship-ready. Genera contenido con scripts MiniMax LLM+TTS (idempotente por hash — regenerar no gasta tokens). Dexie schema extendido con `storyProgress` + `diagnosticResults` + `achievements` (tabla materializada). Lógica pura en `lib/streak/`, `lib/xp/`, `lib/achievements/`, `lib/vocab/`, `lib/stats/`, `lib/diagnostic/`. UI con Tailwind v4 + Recharts + framer-motion. Sin karaoke — audio de historia se reproduce linealmente.

**Tech Stack:** Next.js 16 + TypeScript strict + Tailwind v4 + Dexie 4 + ts-fsrs 5.4 + Zustand 5 + framer-motion + Recharts + canvas-confetti + Zod.

**Prerequisites:**
- Plan #2 ejecutado y commiteado (✓, tag `mvp-2-ui`).
- Schema Dexie + tipos `Achievement`, `StreakDay`, `XpRow` ya definidos en `lib/db/schema.ts` (Plan #2).
- 7 rutas existentes: `/`, `/blocks`, `/blocks/[id]`, `/blocks/[id]/lessons/[lid]`, `/learn`, `/practice/[lessonId]`, `/settings`.
- Working tree limpio, branch `main` sincronizado con GitHub.
- Node 20+.

**Reference design doc:** `docs/plans/2026-06-09-mvp3-engagement-design.md` (committed en `4a5b4e7`).

**Patrones a reusar de Plan #2:**
- `lib/data/zod-schemas.ts` — agregar `StorySchema` y `DiagnosticSchema`
- `lib/db/schema.ts` — extender con `db.version(2)`
- `lib/db/repository.ts` — agregar métodos de eventos
- `components/ExerciseRunner.tsx` — reusar para `/drill/vocab`
- `components/AudioButton.tsx` — reusar para `StoryPlayer` y `VocabItem`
- Patrón `generate-content.ts` para nuevos scripts de generación
- Patrón cache idempotente (`scripts/.cache/llm/<hash>.json` + `public/audio/<hash>.mp3`)

---

## File Structure (Plan #3)

```
portugues-app/
├── app/
│   ├── page.tsx                       # REPLACE: home dashboard
│   ├── stories/
│   │   ├── page.tsx                   # NEW: stories grid
│   │   └── [id]/
│   │       └── page.tsx               # NEW: story page
│   ├── stats/
│   │   └── page.tsx                   # NEW: stats dashboard
│   ├── achievements/
│   │   └── page.tsx                   # NEW: achievements grid
│   ├── concepts/
│   │   └── page.tsx                   # NEW: concepts map
│   ├── diagnostic/
│   │   └── page.tsx                   # NEW: diagnostic test
│   └── drill/
│       └── vocab/
│           └── page.tsx               # NEW: vocab drill
├── components/
│   ├── stories/
│   │   ├── StoryPlayer.tsx
│   │   ├── StoryText.tsx
│   │   ├── VocabSidebar.tsx
│   │   └── VocabItem.tsx
│   ├── gamification/
│   │   ├── StreakRing.tsx
│   │   ├── DailyGoalRing.tsx
│   │   ├── XpBar.tsx
│   │   ├── LevelBadge.tsx
│   │   ├── AchievementToast.tsx
│   │   └── AchievementCard.tsx
│   ├── stats/
│   │   ├── Heatmap.tsx
│   │   ├── LineChart.tsx
│   │   ├── BlockAccuracyChart.tsx
│   │   ├── ConceptMasteryChart.tsx
│   │   ├── FsrsRetentionCard.tsx
│   │   └── BrPtSplitChart.tsx
│   ├── vocab/
│   │   └── VocabDrill.tsx
│   ├── diagnostic/
│   │   ├── DiagnosticRunner.tsx
│   │   └── DiagnosticResults.tsx
│   └── home/
│       ├── TodaySummary.tsx
│       ├── ContinueCard.tsx
│       └── StoryOfTheBlockCard.tsx
├── lib/
│   ├── streak/
│   │   ├── streak.ts
│   │   └── streak.test.ts
│   ├── xp/
│   │   ├── calculator.ts
│   │   └── calculator.test.ts
│   ├── achievements/
│   │   ├── rules.ts
│   │   └── rules.test.ts
│   ├── vocab/
│   │   ├── catalog.ts
│   │   └── catalog.test.ts
│   ├── stats/
│   │   ├── aggregations.ts
│   │   └── aggregations.test.ts
│   ├── diagnostic/
│   │   ├── scorer.ts
│   │   └── scorer.test.ts
│   ├── db/
│   │   ├── schema.ts                  # MODIFY: extend with v2 tables
│   │   └── repository.ts              # MODIFY: add event helpers
│   ├── data/
│   │   ├── zod-schemas.ts             # MODIFY: add Story + Diagnostic
│   │   └── loaders.ts                 # NEW: story + vocab loaders
│   └── hooks/
│       ├── useDailyCheck.ts
│       ├── useStreakStatus.ts
│       └── useAchievements.ts
├── scripts/
│   ├── generate-stories.ts            # NEW
│   ├── generate-diagnostic.ts         # NEW
│   ├── build-vocab-catalog.ts         # NEW
│   ├── prompts/
│   │   └── story.md                   # NEW
│   │   └── diagnostic.md              # NEW
│   └── verify-content.ts              # MODIFY: add story + diagnostic checks
├── data/
│   ├── stories/
│   │   └── b{N}-s{M}.json             # 10-20 generated
│   ├── vocab-catalog.json             # derived
│   └── diagnostic.json                # generated
└── tests/
    └── e2e/
        ├── engagement.spec.ts         # NEW
        ├── vocab.spec.ts              # NEW
        └── stories.spec.ts            # NEW
```

---

## Milestone 1 — Stories infra (Phase 1)

### Task 1: Add Story schema to zod-schemas

**Files:**
- Modify: `lib/data/zod-schemas.ts`
- Test: `tests/unit/zod-schemas-story.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/zod-schemas-story.test.ts
import { describe, it, expect } from "vitest";
import { StorySchema } from "@/lib/data/zod-schemas";

describe("StorySchema", () => {
  it("parses a valid story", () => {
    const valid = {
      id: "b1-s1-bom-dia-joao",
      blockId: 1,
      lessonIds: ["b1-l1-alfabeto-acentos"],
      title: "Bom dia, João",
      level: 1,
      conceptIds: ["b1-alfabeto"],
      variants: {
        br: { text: "O João entra na padaria.", audioHash: "abc123" },
        pt: { text: "O João entra na padaria.", audioHash: "def456" },
      },
      vocab: [
        {
          word: "padaria",
          ptWord: "padaria",
          meaning: "panadería",
          audioHash: { br: "ghi789", pt: "jkl012" },
        },
      ],
    };
    expect(() => StorySchema.parse(valid)).not.toThrow();
  });

  it("rejects empty vocab", () => {
    const invalid = {
      id: "b1-s1-x", blockId: 1, lessonIds: [], title: "x", level: 1, conceptIds: [],
      variants: { br: { text: "x", audioHash: "x" }, pt: { text: "x", audioHash: "x" } },
      vocab: [],
    };
    expect(() => StorySchema.parse(invalid)).toThrow();
  });

  it("rejects missing audio hash", () => {
    const invalid = {
      id: "b1-s1-x", blockId: 1, lessonIds: [], title: "x", level: 1, conceptIds: [],
      variants: { br: { text: "x", audioHash: "" }, pt: { text: "x", audioHash: "x" } },
      vocab: [{ word: "x", meaning: "x", audioHash: { br: "x", pt: "x" } }],
    };
    expect(() => StorySchema.parse(invalid)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/zod-schemas-story.test.ts
```

Expected: FAIL with "StorySchema is not exported".

- [ ] **Step 3: Add StorySchema to zod-schemas.ts**

Append to `lib/data/zod-schemas.ts`:

```ts
import { z } from "zod";

export const StoryVocabSchema = z.object({
  word: z.string().min(1),
  ptWord: z.string().min(1).optional(),
  meaning: z.string().min(1),
  audioHash: z.object({ br: z.string().min(1), pt: z.string().min(1) }),
});

export const StoryVariantSchema = z.object({
  text: z.string().min(20),
  audioHash: z.string().min(1),
});

export const StorySchema = z.object({
  id: z.string().regex(/^b\d+-s\d+-.+/, "story id must be b{N}-s{N}-{slug}"),
  blockId: z.number().int().min(1).max(10),
  lessonIds: z.array(z.string()),
  title: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  conceptIds: z.array(z.string()),
  variants: z.object({ br: StoryVariantSchema, pt: StoryVariantSchema }),
  vocab: z.array(StoryVocabSchema).min(3).max(12),
});

export type Story = z.infer<typeof StorySchema>;
export type StoryVocab = z.infer<typeof StoryVocabSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/zod-schemas-story.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/data/zod-schemas.ts tests/unit/zod-schemas-story.test.ts
git commit -m "feat(data): StorySchema for mini-histories"
```

---

### Task 2: Story loaders

**Files:**
- Create: `lib/data/loaders.ts`
- Test: `tests/unit/loaders.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/loaders.test.ts
import { describe, it, expect, vi } from "vitest";
import { loadAllStories, loadStory } from "@/lib/data/loaders";

describe("loadAllStories", () => {
  it("returns empty array when no stories", async () => {
    const stories = await loadAllStories();
    expect(Array.isArray(stories)).toBe(true);
  });

  it("loads valid story JSONs", async () => {
    const stories = await loadAllStories();
    for (const s of stories) {
      expect(s.id).toMatch(/^b\d+-s\d+-.+/);
    }
  });
});

describe("loadStory", () => {
  it("returns null for missing story", async () => {
    const story = await loadStory("nonexistent");
    expect(story).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/loaders.test.ts
```

Expected: FAIL with "loaders module not found".

- [ ] **Step 3: Create loaders.ts**

```ts
// lib/data/loaders.ts
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
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function loadStory(id: string): Promise<Story | null> {
  try {
    const file = path.join(STORIES_DIR, `${id}.json`);
    const raw = await fs.readFile(file, "utf-8");
    return StorySchema.parse(JSON.parse(raw));
  } catch (err: any) {
    if (err.code === "ENOENT") return null;
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
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/loaders.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/data/loaders.ts tests/unit/loaders.test.ts
git commit -m "feat(data): story + vocab loaders with zod validation"
```

---

### Task 3: Story prompt template

**Files:**
- Create: `scripts/prompts/story.md`

- [ ] **Step 1: Create the prompt file**

```md
<!-- scripts/prompts/story.md -->
# Mini-história em português para hispanohablantes

Você vai criar uma mini-história em português brasileiro (BR) com sua variante em português europeu (PT), apropriada para aprendizes hispanofalantes do nível {{level}} (1=básico, 2=intermediário, 3=avançado).

## Tema
{{theme}}

## Vocabulário obrigatório
Use estas palavras/conceitos: {{concepts}}

## Restrições
- 3-5 parágrafos, total de 200-400 palavras em BR
- Linguagem natural e cotidiana
- Use os conceitos do bloco {{blockId}} obrigatoriamente
- 5-12 palavras no vocabulário isolado (palavras novas para hispanofalantes, com tradução ES)
- Tom acolhedor, brasileiro mas universal

## Output (JSON)

```json
{
  "title": "string (3-6 palavras)",
  "br": {
    "text": "string com 3-5 parágrafos separados por \\n\\n"
  },
  "pt": {
    "text": "string com 3-5 parágrafos separados por \\n\\n (variante europeia)"
  },
  "vocab": [
    { "word": "palavra em BR", "ptWord": "palavra em PT se diferente", "meaning": "traducción en español" }
  ]
}
```
```

- [ ] **Step 2: Commit**

```bash
git add scripts/prompts/story.md
git commit -m "feat(scripts): story generation prompt template"
```

---

### Task 4: generate-stories.ts script (Phase 1: b1 only)

**Files:**
- Create: `scripts/generate-stories.ts`
- Modify: `package.json` (add `generate:stories` script)

- [ ] **Step 1: Create the script**

```ts
// scripts/generate-stories.ts
import "dotenv/config";
import { llm } from "./lib/minimax-llm";
import { tts } from "./lib/minimax-tts";
import { renderPrompt } from "./lib/prompt-runner";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import pLimit from "p-limit";

const BLOCKS: Array<{ id: number; theme: string; concepts: string[] }> = [
  { id: 1, theme: "O dia a dia de João na padaria", concepts: ["alfabeto", "acentos", "vogais nasais", "sílabas"] },
];

const StoryOutputSchema = z.object({
  title: z.string().min(3).max(80),
  br: z.object({ text: z.string().min(50) }),
  pt: z.object({ text: z.string().min(50) }),
  vocab: z.array(
    z.object({
      word: z.string().min(1),
      ptWord: z.string().min(1).optional(),
      meaning: z.string().min(1),
    })
  ).min(5).max(12),
});

type StoryOutput = z.infer<typeof StoryOutputSchema>;

async function generateStoryForBlock(block: typeof BLOCKS[number], storyIndex: 1 | 2): Promise<void> {
  const storyId = `b${block.id}-s${storyIndex}-${slugify(block.theme)}`;
  const outputFile = path.join(process.cwd(), "lib/data/stories", `${storyId}.json`);

  if (await fileExists(outputFile)) {
    console.log(`✓ ${storyId} exists, skipping`);
    return;
  }

  const prompt = await renderPrompt("story", {
    blockId: block.id,
    level: storyIndex === 1 ? 1 : 2,
    theme: block.theme,
    concepts: block.concepts.join(", "),
  });

  const llmResult = await llm.messages.create({
    model: "MiniMax-M2.5-highspeed",
    max_tokens: 4000,
    system: "Você é um professor de português criando conteúdo pedagógico.",
    messages: [{ role: "user", content: prompt }],
  });

  const text = llmResult.content[0].type === "text" ? llmResult.content[0].text : "";
  const json = extractJson(text);
  const parsed = StoryOutputSchema.parse(JSON.parse(json));

  const ttsLimit = pLimit(4);
  const audioJobs: Array<Promise<{ key: string; hash: string }>> = [];

  audioJobs.push(
    ttsLimit(async () => ({ key: "br_full", hash: await tts(parsed.br.text, "br", "female_neutral") }))
  );
  audioJobs.push(
    ttsLimit(async () => ({ key: "pt_full", hash: await tts(parsed.pt.text, "pt", "female_neutral") }))
  );
  for (const v of parsed.vocab) {
    audioJobs.push(
      ttsLimit(async () => ({ key: `vocab_br_${v.word}`, hash: await tts(v.word, "br", "female_neutral") }))
    );
    audioJobs.push(
      ttsLimit(async () => {
        const ptWord = v.ptWord ?? v.word;
        return { key: `vocab_pt_${ptWord}`, hash: await tts(ptWord, "pt", "female_neutral") };
      })
    );
  }
  const audios = await Promise.all(audioJobs);
  const audioMap = Object.fromEntries(audios.map((a) => [a.key, a.hash]));

  const story = {
    id: storyId,
    blockId: block.id,
    lessonIds: [],
    title: parsed.title,
    level: storyIndex === 1 ? 1 : 2,
    conceptIds: block.concepts,
    variants: {
      br: { text: parsed.br.text, audioHash: audioMap.br_full },
      pt: { text: parsed.pt.text, audioHash: audioMap.pt_full },
    },
    vocab: parsed.vocab.map((v) => ({
      word: v.word,
      ptWord: v.ptWord,
      meaning: v.meaning,
      audioHash: {
        br: audioMap[`vocab_br_${v.word}`],
        pt: audioMap[`vocab_pt_${v.ptWord ?? v.word}`],
      },
    })),
  };

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(story, null, 2));
  console.log(`✓ Generated ${storyId}`);
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
}

function extractJson(text: string): string {
  const match = text.match(/```json\s*([\s\S]+?)\s*```/);
  if (match) return match[1];
  return text;
}

async function main() {
  const args = process.argv.slice(2);
  const blockArg = args.find((a) => a.startsWith("--block="));
  const targetBlock = blockArg ? Number(blockArg.split("=")[1]) : null;
  const blocksToGen = targetBlock ? BLOCKS.filter((b) => b.id === targetBlock) : BLOCKS.slice(0, 1);

  for (const block of blocksToGen) {
    await generateStoryForBlock(block, 1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add script to package.json**

Add to `package.json` under `scripts`:

```json
"generate:stories": "tsx scripts/generate-stories.ts"
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-stories.ts package.json
git commit -m "feat(scripts): generate-stories.ts (Phase 1: b1 only)"
```

---

### Task 5: Run generate-stories for b1, commit output

**Files:**
- Create: `lib/data/stories/b1-s1-*.json` (generated)
- Create: `public/audio/*.mp3` (generated)

- [ ] **Step 1: Run the script**

```bash
cd /Users/lalo/idiomas/portugues-app
npm run generate:stories -- --block=1
```

Expected: ~12-20 TTS calls (1 BR full + 1 PT full + 2 per vocab × 5-12 vocab), 1 JSON file written. Watch for `✓ Generated b1-s1-...`.

- [ ] **Step 2: Verify the JSON is valid**

```bash
npx tsx -e "import {loadAllStories} from './lib/data/loaders'; loadAllStories().then(s => console.log('stories:', s.length, s[0]?.id))"
```

Expected: `stories: 1 b1-s1-...`

- [ ] **Step 3: Verify audio files exist**

```bash
ls public/audio/ | wc -l
```

Expected: previous count + new audios (should grow by ~12-20).

- [ ] **Step 4: Commit**

```bash
git add lib/data/stories/ public/audio/
git commit -m "data: Bloque 1 story #1 generated (mini-historia + audio)"
```

---

### Task 6: Extend Dexie schema for storyProgress

**Files:**
- Modify: `lib/db/schema.ts`
- Test: `tests/unit/story-progress.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/story-progress.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { getDb, StoryProgressRow } from "@/lib/db/schema";

describe("storyProgress table", () => {
  beforeEach(async () => {
    const db = getDb();
    await db.storyProgress.clear();
  });

  it("stores a story progress row", async () => {
    const db = getDb();
    const row: StoryProgressRow = {
      storyId: "b1-s1-bom-dia",
      startedAt: new Date(),
      completedAt: null,
      lastVariant: "br",
    };
    await db.storyProgress.put(row);
    const got = await db.storyProgress.get("b1-s1-bom-dia");
    expect(got?.lastVariant).toBe("br");
  });

  it("updates completion", async () => {
    const db = getDb();
    const now = new Date();
    await db.storyProgress.put({ storyId: "b1-s1-x", startedAt: now, completedAt: null, lastVariant: "br" });
    await db.storyProgress.update("b1-s1-x", { completedAt: now });
    const got = await db.storyProgress.get("b1-s1-x");
    expect(got?.completedAt).toEqual(now);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/story-progress.test.ts
```

Expected: FAIL with "StoryProgressRow not exported".

- [ ] **Step 3: Add storyProgress to schema.ts**

In `lib/db/schema.ts`, add to types:

```ts
export interface StoryProgressRow {
  storyId: string;
  startedAt: Date;
  completedAt: Date | null;
  lastVariant: Variant;
}
```

In the Dexie stores, bump version and add (keep all existing version blocks):

```ts
db.version(2).stores({
  // ... copy of existing stores ...
  storyProgress: 'storyId, completedAt',
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/story-progress.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/db/schema.ts tests/unit/story-progress.test.ts
git commit -m "feat(db): storyProgress table (Dexie v2)"
```

---

### Task 7: Add storyProgress methods to repository

**Files:**
- Modify: `lib/db/repository.ts`
- Test: `tests/unit/repository-story.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/repository-story.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { getDb } from "@/lib/db/schema";
import { getOrCreateStoryProgress, markStoryCompleted, getCompletedStories } from "@/lib/db/repository";

describe("storyProgress repository", () => {
  beforeEach(async () => {
    const db = getDb();
    await db.storyProgress.clear();
    await db.events.clear();
  });

  it("getOrCreateStoryProgress creates a new row", async () => {
    const row = await getOrCreateStoryProgress("b1-s1-x", "br");
    expect(row.storyId).toBe("b1-s1-x");
    expect(row.completedAt).toBeNull();
    expect(row.lastVariant).toBe("br");
  });

  it("markStoryCompleted sets completedAt and emits event", async () => {
    await getOrCreateStoryProgress("b1-s1-y", "br");
    await markStoryCompleted("b1-s1-y");
    const row = await getDb().storyProgress.get("b1-s1-y");
    expect(row?.completedAt).not.toBeNull();
    const events = await getDb().events.where("type").equals("story_completed").toArray();
    expect(events.length).toBe(1);
  });

  it("getCompletedStories returns completed storyIds only", async () => {
    await getOrCreateStoryProgress("b1-s1-a", "br");
    await getOrCreateStoryProgress("b1-s1-b", "br");
    await markStoryCompleted("b1-s1-a");
    const completed = await getCompletedStories();
    expect(completed).toEqual(["b1-s1-a"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/repository-story.test.ts
```

Expected: FAIL (functions not exported).

- [ ] **Step 3: Add methods to repository.ts**

Append to `lib/db/repository.ts`:

```ts
import { StoryProgressRow, Variant } from "@/lib/db/schema";

export async function getOrCreateStoryProgress(storyId: string, variant: Variant): Promise<StoryProgressRow> {
  const db = getDb();
  const existing = await db.storyProgress.get(storyId);
  if (existing) {
    await db.storyProgress.update(storyId, { lastVariant: variant });
    return { ...existing, lastVariant: variant };
  }
  const row: StoryProgressRow = { storyId, startedAt: new Date(), completedAt: null, lastVariant: variant };
  await db.storyProgress.put(row);
  await db.events.add({ ts: new Date(), type: "story_started", payload: { storyId } });
  return row;
}

export async function markStoryCompleted(storyId: string): Promise<void> {
  const db = getDb();
  const now = new Date();
  await db.storyProgress.update(storyId, { completedAt: now });
  await db.events.add({ ts: now, type: "story_completed", payload: { storyId } });
}

export async function getCompletedStories(): Promise<string[]> {
  const db = getDb();
  const rows = await db.storyProgress.where("completedAt").above(0).toArray();
  return rows.map((r) => r.storyId);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/repository-story.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/db/repository.ts tests/unit/repository-story.test.ts
git commit -m "feat(db): storyProgress repository methods + event emission"
```

---

### Task 8: StoryPlayer component

**Files:**
- Create: `components/stories/StoryPlayer.tsx`
- Test: `tests/unit/story-player.test.tsx` (smoke test with @testing-library/react)

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/story-player.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StoryPlayer } from "@/components/stories/StoryPlayer";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("StoryPlayer", () => {
  it("renders title and play button", () => {
    render(<StoryPlayer audioBr="/audio/br.mp3" audioPt="/audio/pt.mp3" title="Bom dia" />);
    expect(screen.getByText("Bom dia")).toBeTruthy();
    expect(screen.getByLabelText(/play/i)).toBeTruthy();
  });

  it("shows current variant", () => {
    render(<StoryPlayer audioBr="/audio/br.mp3" audioPt="/audio/pt.mp3" title="Bom dia" initialVariant="pt" />);
    const ptBtn = screen.getByRole("button", { name: /PT/i });
    expect(ptBtn).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/story-player.test.tsx
```

Expected: FAIL with "StoryPlayer not found".

- [ ] **Step 3: Create StoryPlayer component**

```tsx
// components/stories/StoryPlayer.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useSettings } from "@/lib/stores/settings";
import { AudioButton } from "@/components/AudioButton";

export function StoryPlayer({
  audioBr,
  audioPt,
  title,
  initialVariant,
}: {
  audioBr: string;
  audioPt: string;
  title: string;
  initialVariant?: "br" | "pt";
}) {
  const { variant: settingsVariant, setVariant } = useSettings();
  const [variant, setLocalVariant] = useState<"br" | "pt">(initialVariant ?? settingsVariant);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = variant === "br" ? audioBr : audioPt;

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setProgress(audio.currentTime));
    audio.addEventListener("ended", () => setPlaying(false));
    return () => { audio.pause(); audio.src = ""; };
  }, [audioUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
      <button
        aria-label={playing ? "pause" : "play"}
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="h-1 bg-muted rounded mt-1">
          <div
            className="h-full bg-primary rounded"
            style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {Math.floor(progress)}s / {Math.floor(duration)}s
        </div>
      </div>
      <div className="flex gap-1">
        <button
          aria-pressed={variant === "br"}
          onClick={() => setLocalVariant("br")}
          className={`px-2 py-1 text-xs rounded ${variant === "br" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          BR
        </button>
        <button
          aria-pressed={variant === "pt"}
          onClick={() => setLocalVariant("pt")}
          className={`px-2 py-1 text-xs rounded ${variant === "pt" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          PT
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/story-player.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/stories/StoryPlayer.tsx tests/unit/story-player.test.tsx
git commit -m "feat(ui): StoryPlayer with audio playback + BR/PT toggle"
```

---

### Task 9: StoryText + VocabSidebar + VocabItem components

**Files:**
- Create: `components/stories/StoryText.tsx`
- Create: `components/stories/VocabItem.tsx`
- Create: `components/stories/VocabSidebar.tsx`

- [ ] **Step 1: Create VocabItem**

```tsx
// components/stories/VocabItem.tsx
"use client";
import { useState } from "react";

export function VocabItem({
  word,
  meaning,
  audioUrl,
  onPlay,
}: {
  word: string;
  meaning: string;
  audioUrl: string;
  onPlay: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  const play = async () => {
    if (playing) return;
    setPlaying(true);
    onPlay();
    const audio = new Audio(audioUrl);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    try { await audio.play(); } catch { setPlaying(false); }
  };

  return (
    <li className="flex items-center gap-2 py-1.5">
      <button
        onClick={play}
        disabled={playing}
        aria-label={`play ${word}`}
        className="w-6 h-6 text-xs rounded bg-muted hover:bg-muted/70 disabled:opacity-50"
      >
        {playing ? "🔊" : "▶"}
      </button>
      <span className="font-medium">{word}</span>
      <span className="text-muted-foreground text-sm">— {meaning}</span>
    </li>
  );
}
```

- [ ] **Step 2: Create VocabSidebar**

```tsx
// components/stories/VocabSidebar.tsx
"use client";
import { VocabItem } from "./VocabItem";
import type { Story } from "@/lib/data/zod-schemas";
import { useSettings } from "@/lib/stores/settings";

export function VocabSidebar({ story }: { story: Story }) {
  const { variant } = useSettings();
  return (
    <aside className="border border-border rounded-lg p-4 bg-card">
      <h3 className="font-medium mb-2">Vocab</h3>
      <ul>
        {story.vocab.map((v) => {
          const audioHash = variant === "br" ? v.audioHash.br : v.audioHash.pt;
          return (
            <VocabItem
              key={v.word}
              word={v.word}
              meaning={v.meaning}
              audioUrl={`/audio/${audioHash}.mp3`}
              onPlay={() => {}}
            />
          );
        })}
      </ul>
    </aside>
  );
}
```

- [ ] **Step 3: Create StoryText**

```tsx
// components/stories/StoryText.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import type { Story } from "@/lib/data/zod-schemas";

export function StoryText({ story }: { story: Story }) {
  const { variant } = useSettings();
  const text = variant === "br" ? story.variants.br.text : story.variants.pt.text;
  return (
    <article className="prose prose-stone max-w-none">
      {text.split("\n\n").map((para, i) => (
        <p key={i} className="mb-4 leading-relaxed">{para}</p>
      ))}
    </article>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/stories/
git commit -m "feat(ui): StoryText + VocabSidebar + VocabItem"
```

---

### Task 10: /stories page (grid) + /stories/[id] page

**Files:**
- Create: `app/stories/page.tsx`
- Create: `app/stories/[id]/page.tsx`

- [ ] **Step 1: Create stories grid page**

```tsx
// app/stories/page.tsx
import { loadAllStories } from "@/lib/data/loaders";
import Link from "next/link";

export default async function StoriesPage() {
  const stories = await loadAllStories();
  const byBlock = stories.reduce<Record<number, typeof stories>>((acc, s) => {
    (acc[s.blockId] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl mb-8">Histórias</h1>
      {Object.entries(byBlock).map(([blockId, blockStories]) => (
        <section key={blockId} className="mb-8">
          <h2 className="font-medium text-xl mb-3">Bloque {blockId}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {blockStories.map((s) => (
              <Link
                key={s.id}
                href={`/stories/${s.id}`}
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <h3 className="font-medium mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Nivel {s.level} · {s.vocab.length} vocab
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {stories.length === 0 && (
        <p className="text-muted-foreground">No hay historias todavía. Ejecuta <code>npm run generate:stories</code>.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create story detail page**

```tsx
// app/stories/[id]/page.tsx
import { loadStory } from "@/lib/data/loaders";
import { notFound } from "next/navigation";
import { StoryPlayer } from "@/components/stories/StoryPlayer";
import { StoryText } from "@/components/stories/StoryText";
import { VocabSidebar } from "@/components/stories/VocabSidebar";
import { StoryActions } from "./StoryActions";

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await loadStory(id);
  if (!story) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">Bloque {story.blockId}</p>
        <h1 className="font-display text-4xl">{story.title}</h1>
      </header>
      <StoryPlayer
        audioBr={`/audio/${story.variants.br.audioHash}.mp3`}
        audioPt={`/audio/${story.variants.pt.audioHash}.mp3`}
        title={story.title}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <StoryText story={story} />
        </div>
        <VocabSidebar story={story} />
      </div>
      <StoryActions storyId={story.id} />
    </div>
  );
}
```

- [ ] **Step 3: Create StoryActions (client component for "mark as read")**

```tsx
// app/stories/[id]/StoryActions.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateStoryProgress, markStoryCompleted, getCompletedStories } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";

export function StoryActions({ storyId }: { storyId: string }) {
  const { variant } = useSettings();
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getOrCreateStoryProgress(storyId, variant).catch(console.error);
    getCompletedStories().then((c) => setCompleted(c.includes(storyId)));
  }, [storyId, variant]);

  const onMarkRead = async () => {
    await markStoryCompleted(storyId);
    setCompleted(true);
    router.refresh();
  };

  return (
    <div className="mt-8 flex justify-end">
      {completed ? (
        <span className="text-sm text-muted-foreground">✓ Leída</span>
      ) : (
        <button
          onClick={onMarkRead}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Marcar como leída
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Add NavBar link**

Edit `components/NavBar.tsx` to add `/stories` link in the nav (next to `/blocks`).

- [ ] **Step 5: Typecheck + dev server**

```bash
npx tsc --noEmit
npm run dev -- --port 3003
```

Open `http://localhost:3003/stories` → see the grid.
Open `http://localhost:3003/stories/b1-s1-...` → see story with audio + vocab.

- [ ] **Step 6: Commit**

```bash
git add app/stories/ components/NavBar.tsx
git commit -m "feat(ui): /stories grid + /stories/[id] page (Phase 1 done)"
```

---

## Milestone 2 — Resto de historias + Vocab library (Phases 2-3)

### Task 11: Extend BLOCKS to all 10

**Files:**
- Modify: `scripts/generate-stories.ts`

- [ ] **Step 1: Replace BLOCKS with full 10-block list**

```ts
const BLOCKS: Array<{ id: number; theme: string; concepts: string[] }> = [
  { id: 1, theme: "O dia a dia de João na padaria", concepts: ["alfabeto", "acentos", "vogais nasais", "sílabas"] },
  { id: 2, theme: "A família de Maria em Lisboa", concepts: ["gênero", "número", "artigos", "possessivos"] },
  { id: 3, theme: "Pedro vai ao restaurante", concepts: ["presente", "irregulares", "pronombres", "verbo haber"] },
  { id: 4, theme: "Ana conta suas férias no Brasil", concepts: ["pretérito perfeito", "imperfeito", "indefinido", "pretérito mais-que-perfeito"] },
  { id: 5, theme: "Os planos de Carlos para o futuro", concepts: ["futuro do presente", "futuro composto", "condicional", "se + futuro"] },
  { id: 6, theme: "Esperança e dúvida na vida de Sofia", concepts: ["presente do subjuntivo", "imperfeito do subjuntivo", "futuro do subjuntivo", "se + subjuntivo"] },
  { id: 7, theme: "Um dia comum de Miguel", concepts: ["infinitivo", "gerúndio", "particípio", "infinitivo pessoal"] },
  { id: 8, theme: "O debate entre amigos no café", concepts: ["conectores", "orações subordinadas", "colocação pronominal", "discurso indireto"] },
  { id: 9, theme: "Cores, sabores e sons do Brasil", concepts: ["léxico temático", "expressões idiomáticas", "falsos amigos", "regência"] },
  { id: 10, theme: "Cartas e e-mails entre Portugal e Brasil", concepts: ["registro formal", "registro informal", "variação diatópica", "norma culta"] },
];
```

- [ ] **Step 2: Extend main() to generate 1-2 per block**

Replace the `for` loop in `main()`:

```ts
for (const block of blocksToGen) {
  await generateStoryForBlock(block, 1);
  await generateStoryForBlock(block, 2); // 2 stories per block
}
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-stories.ts
git commit -m "feat(scripts): generate-stories for all 10 blocks, 2 per block"
```

---

### Task 12: Run full story generation, commit output

**Files:**
- Create: `lib/data/stories/b{2-10}-s{1,2}-*.json` (generated)
- Create: `public/audio/*.mp3` (generated)

- [ ] **Step 1: Run the script for all blocks**

```bash
cd /Users/lalo/idiomas/portugues-app
npm run generate:stories
```

Expected: 20 stories total generated (b1 already exists, 9 more × 2 = 18 new). Watch for `✓ Generated b{N}-s{M}-...` 20 times. TTS may take 30-60 min total.

- [ ] **Step 2: Verify all stories are valid**

```bash
npx tsx -e "import {loadAllStories} from './lib/data/loaders'; loadAllStories().then(s => console.log('stories:', s.length))"
```

Expected: `stories: 20` (or 19 if some failed — check `b{N}-s{M}.rejected.json`).

- [ ] **Step 3: Commit**

```bash
git add lib/data/stories/ public/audio/
git commit -m "data: 20 mini-historias (1-2 per block x 10 blocks) generated"
```

---

### Task 13: build-vocab-catalog.ts script

**Files:**
- Create: `scripts/build-vocab-catalog.ts`
- Modify: `package.json` (add `build:catalog` script)

- [ ] **Step 1: Create the script**

```ts
// scripts/build-vocab-catalog.ts
import { promises as fs } from "fs";
import path from "path";
import { loadAllStories } from "../lib/data/loaders";
import { z } from "zod";

const VocabCatalogItemSchema = z.object({
  word: z.string(),
  ptWord: z.string().optional(),
  meaning: z.string(),
  audioHash: z.object({ br: z.string(), pt: z.string() }),
  conceptIds: z.array(z.string()),
  storyIds: z.array(z.string()),
});

type VocabCatalogItem = z.infer<typeof VocabCatalogItemSchema>;

const VocabCatalogSchema = z.array(VocabCatalogItemSchema);

async function main() {
  const stories = await loadAllStories();
  const byWord = new Map<string, VocabCatalogItem>();

  for (const story of stories) {
    for (const v of story.vocab) {
      const key = v.word.toLowerCase();
      const existing = byWord.get(key);
      if (existing) {
        if (!existing.storyIds.includes(story.id)) existing.storyIds.push(story.id);
        const newConcepts = story.conceptIds.filter((c) => !existing.conceptIds.includes(c));
        existing.conceptIds.push(...newConcepts);
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

  const catalog = Array.from(byWord.values()).sort((a, b) => a.word.localeCompare(b.word));
  VocabCatalogSchema.parse(catalog); // validate

  const outFile = path.join(process.cwd(), "lib/data/vocab-catalog.json");
  await fs.writeFile(outFile, JSON.stringify(catalog, null, 2));
  console.log(`✓ vocab-catalog.json: ${catalog.length} unique words`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add to package.json**

```json
"build:catalog": "tsx scripts/build-vocab-catalog.ts"
```

- [ ] **Step 3: Run the script**

```bash
npm run build:catalog
```

Expected: `✓ vocab-catalog.json: N unique words` (N between 100-200 for 20 stories).

- [ ] **Step 4: Commit**

```bash
git add scripts/build-vocab-catalog.ts package.json lib/data/vocab-catalog.json
git commit -m "feat(data): vocab-catalog.json derived from stories"
```

---

### Task 14: lib/vocab/catalog.ts + tests

**Files:**
- Create: `lib/vocab/catalog.ts`
- Test: `tests/unit/vocab-catalog.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/vocab-catalog.test.ts
import { describe, it, expect } from "vitest";
import { lookupVocab, getVocabByConcept, getAllVocab } from "@/lib/vocab/catalog";

describe("vocab catalog", () => {
  it("lookupVocab finds existing word", async () => {
    const items = await getAllVocab();
    if (items.length === 0) return; // skip if catalog empty
    const first = items[0];
    const got = await lookupVocab(first.word);
    expect(got?.word).toBe(first.word);
  });

  it("lookupVocab returns null for unknown", async () => {
    const got = await lookupVocab("zzzz-nonexistent");
    expect(got).toBeNull();
  });

  it("getVocabByConcept filters correctly", async () => {
    const items = await getVocabByConcept("b1-alfabeto");
    for (const v of items) {
      expect(v.conceptIds).toContain("b1-alfabeto");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/vocab-catalog.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create catalog.ts**

```ts
// lib/vocab/catalog.ts
import { loadVocabCatalog, VocabCatalogItem } from "@/lib/data/loaders";

export type { VocabCatalogItem };

let cache: VocabCatalogItem[] | null = null;

async function getCatalog(): Promise<VocabCatalogItem[]> {
  if (!cache) cache = await loadVocabCatalog();
  return cache;
}

export async function getAllVocab(): Promise<VocabCatalogItem[]> {
  return getCatalog();
}

export async function lookupVocab(word: string): Promise<VocabCatalogItem | null> {
  const items = await getCatalog();
  return items.find((v) => v.word.toLowerCase() === word.toLowerCase()) ?? null;
}

export async function getVocabByConcept(conceptId: string): Promise<VocabCatalogItem[]> {
  const items = await getCatalog();
  return items.filter((v) => v.conceptIds.includes(conceptId));
}

export async function getRandomVocab(n: number, exclude: string[] = []): Promise<VocabCatalogItem[]> {
  const items = await getCatalog();
  const pool = items.filter((v) => !exclude.includes(v.word));
  return [...pool].sort(() => Math.random() - 0.5).slice(0, n);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/vocab-catalog.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/vocab/catalog.ts tests/unit/vocab-catalog.test.ts
git commit -m "feat(vocab): catalog loader with lookup + filter + random"
```

---

### Task 15: getOrCreateVocabCard repository method

**Files:**
- Modify: `lib/db/repository.ts`
- Test: `tests/unit/repository-vocab.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/repository-vocab.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { getDb } from "@/lib/db/schema";
import { getOrCreateVocabCard, getDueVocabCards } from "@/lib/db/repository";

describe("vocab card repository", () => {
  beforeEach(async () => {
    const db = getDb();
    await db.cards.clear();
  });

  it("creates a new vocab card", async () => {
    const card = await getOrCreateVocabCard("padaria", "panadería", "b1-alfabeto");
    expect(card.id).toContain("vocab-padaria");
    expect(card.tags).toContain("vocab");
  });

  it("returns existing vocab card on second call", async () => {
    const c1 = await getOrCreateVocabCard("padaria", "panadería", "b1-alfabeto");
    const c2 = await getOrCreateVocabCard("padaria", "panadería", "b1-alfabeto");
    expect(c1.id).toBe(c2.id);
  });

  it("getDueVocabCards returns cards due now", async () => {
    const card = await getOrCreateVocabCard("café", "café", "b1-alfabeto");
    const due = await getDueVocabCards(10);
    expect(due.find((c) => c.id === card.id)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/repository-vocab.test.ts
```

Expected: FAIL (functions not exported).

- [ ] **Step 3: Add methods to repository.ts**

```ts
import { Card, FsrsCard } from "@/lib/db/schema";
import { fsrsNewCard } from "@/lib/srs/fsrs";

export async function getOrCreateVocabCard(word: string, meaning: string, conceptId: string): Promise<Card> {
  const db = getDb();
  const id = `vocab-${word.toLowerCase()}`;
  const existing = await db.cards.get(id);
  if (existing) return existing;

  const newCard: Card = {
    id,
    blockId: 0, // vocab is cross-block
    lessonId: `vocab-${conceptId}`,
    exerciseType: "flashcard",
    fsrs: fsrsNewCard(),
    state: 0,
    reps: 0,
    lapses: 0,
    lastReviewAt: new Date(0),
    nextReviewAt: new Date(),
    lastResult: undefined,
    conceptIds: [conceptId],
    tags: ["vocab"],
    esContrast: undefined,
  };
  await db.cards.put(newCard);
  return newCard;
}

export async function getDueVocabCards(limit: number): Promise<Card[]> {
  const db = getDb();
  const now = new Date();
  return db.cards
    .where("tags")
    .equals("vocab")
    .and((c) => c.nextReviewAt <= now)
    .limit(limit)
    .toArray();
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/repository-vocab.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/db/repository.ts tests/unit/repository-vocab.test.ts
git commit -m "feat(db): getOrCreateVocabCard + getDueVocabCards"
```

---

### Task 16: /drill/vocab page (uses ExerciseRunner)

**Files:**
- Create: `components/vocab/VocabDrill.tsx`
- Create: `app/drill/vocab/page.tsx`

- [ ] **Step 1: Create VocabDrill component**

```tsx
// components/vocab/VocabDrill.tsx
"use client";
import { useEffect, useState } from "react";
import { getDueVocabCards, getOrCreateVocabCard } from "@/lib/db/repository";
import { getAllVocab } from "@/lib/vocab/catalog";
import { Card } from "@/lib/db/schema";
import { ExerciseRunner } from "@/components/ExerciseRunner";

export function VocabDrill() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // First, ensure 10 vocab cards exist (bootstrap)
      const vocab = await getAllVocab();
      const sample = vocab.slice(0, 10);
      for (const v of sample) {
        const conceptId = v.conceptIds[0] ?? "general";
        await getOrCreateVocabCard(v.word, v.meaning, conceptId);
      }
      const due = await getDueVocabCards(20);
      setCards(due);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) return <p>Cargando vocab...</p>;
  if (cards.length === 0) return <p>No hay vocab para repasar. ¡Aprende más historias!</p>;

  // Convert Card to Exercise format expected by ExerciseRunner
  const exercises = cards.map((c) => ({
    id: c.id,
    blockId: c.blockId,
    lessonId: c.lessonId,
    type: "flashcard" as const,
    difficulty: 1,
    concepts: c.conceptIds,
    tags: c.tags,
    contentHash: c.id,
    data: { front: c.id.replace("vocab-", ""), back: "", example: undefined },
  }));

  return <ExerciseRunner exercises={exercises} mode="drill" />;
}
```

- [ ] **Step 2: Create page**

```tsx
// app/drill/vocab/page.tsx
import { VocabDrill } from "@/components/vocab/VocabDrill";

export default function VocabDrillPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-6">Vocab drill</h1>
      <VocabDrill />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/vocab/ app/drill/
git commit -m "feat(ui): /drill/vocab page (uses ExerciseRunner for vocab cards)"
```

---

## Milestone 3 — Streak + XP + Achievements (Phases 4-5)

### Task 17: lib/streak/streak.ts + tests

**Files:**
- Create: `lib/streak/streak.ts`
- Test: `tests/unit/streak.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/streak.test.ts
import { describe, it, expect } from "vitest";
import { currentStreak, didStudyToday, isStreakAlive } from "@/lib/streak/streak";
import type { StreakDay } from "@/lib/db/schema";

function day(date: string, minutes: number): StreakDay {
  return { date, minutesStudied: minutes, cardsReviewed: 0, xpEarned: 0 };
}

describe("currentStreak", () => {
  it("returns 0 for empty", () => {
    expect(currentStreak([], "2026-06-09", 15)).toBe(0);
  });

  it("returns 1 if today qualifies", () => {
    expect(currentStreak([day("2026-06-09", 20)], "2026-06-09", 15)).toBe(1);
  });

  it("returns 3 for 3 consecutive qualifying days", () => {
    expect(currentStreak(
      [day("2026-06-07", 20), day("2026-06-08", 20), day("2026-06-09", 20)],
      "2026-06-09", 15
    )).toBe(3);
  });

  it("breaks streak on day below goal", () => {
    expect(currentStreak(
      [day("2026-06-07", 20), day("2026-06-08", 10), day("2026-06-09", 20)],
      "2026-06-09", 15
    )).toBe(1);
  });

  it("stops counting at gap", () => {
    expect(currentStreak(
      [day("2026-06-05", 20), day("2026-06-06", 20), day("2026-06-09", 20)],
      "2026-06-09", 15
    )).toBe(1);
  });
});

describe("didStudyToday", () => {
  it("true if minutes >= goal", () => {
    expect(didStudyToday([day("2026-06-09", 20)], "2026-06-09", 15)).toBe(true);
  });
  it("false if minutes < goal", () => {
    expect(didStudyToday([day("2026-06-09", 10)], "2026-06-09", 15)).toBe(false);
  });
  it("false if no data for today", () => {
    expect(didStudyToday([], "2026-06-09", 15)).toBe(false);
  });
});

describe("isStreakAlive", () => {
  it("true if last day was today or yesterday", () => {
    expect(isStreakAlive([day("2026-06-09", 20)], "2026-06-09")).toBe(true);
    expect(isStreakAlive([day("2026-06-08", 20), day("2026-06-09", 20)], "2026-06-09")).toBe(true);
  });
  it("false if last day was 3+ days ago", () => {
    expect(isStreakAlive([day("2026-06-06", 20)], "2026-06-09")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/streak.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create streak.ts**

```ts
// lib/streak/streak.ts
import type { StreakDay } from "@/lib/db/schema";

function dateDiffDays(a: string, b: string): number {
  const ad = new Date(a + "T00:00:00").getTime();
  const bd = new Date(b + "T00:00:00").getTime();
  return Math.round((bd - ad) / 86400000);
}

function dateOffset(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function currentStreak(streak: StreakDay[], today: string, goalMin: number): number {
  const sorted = [...streak].sort((a, b) => a.date.localeCompare(b.date));
  let count = 0;
  let cursor = today;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].date !== cursor) {
      const diff = dateDiffDays(sorted[i].date, cursor);
      if (diff > 0) break;
      if (diff < 0) continue;
    }
    if (sorted[i].minutesStudied >= goalMin) {
      count++;
      cursor = dateOffset(cursor, -1);
    } else {
      break;
    }
  }
  return count;
}

export function didStudyToday(streak: StreakDay[], today: string, goalMin: number): boolean {
  const todayRow = streak.find((s) => s.date === today);
  if (!todayRow) return false;
  return todayRow.minutesStudied >= goalMin;
}

export function isStreakAlive(streak: StreakDay[], today: string): boolean {
  if (streak.length === 0) return false;
  const sorted = [...streak].sort((a, b) => a.date.localeCompare(b.date));
  const last = sorted[sorted.length - 1].date;
  const diff = dateDiffDays(last, today);
  return diff === 0 || diff === 1;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/streak.test.ts
```

Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/streak/streak.ts tests/unit/streak.test.ts
git commit -m "feat(streak): pure functions for currentStreak + didStudyToday + isStreakAlive"
```

---

### Task 18: lib/xp/calculator.ts + tests

**Files:**
- Create: `lib/xp/calculator.ts`
- Test: `tests/unit/xp-calculator.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/xp-calculator.test.ts
import { describe, it, expect } from "vitest";
import { xpForRating, xpForEvent, levelFromXp, levelProgress } from "@/lib/xp/calculator";
import type { Rating } from "@/lib/db/schema";

describe("xpForRating", () => {
  it("Again (1) = 0", () => expect(xpForRating(1 as Rating)).toBe(0));
  it("Hard (2) = 0", () => expect(xpForRating(2 as Rating)).toBe(0));
  it("Good (3) = 1", () => expect(xpForRating(3 as Rating)).toBe(1));
  it("Easy (4) = 5", () => expect(xpForRating(4 as Rating)).toBe(5));
});

describe("xpForEvent", () => {
  it("lesson_complete = 30", () => expect(xpForEvent("lesson_complete")).toBe(30));
  it("streak_day = 20", () => expect(xpForEvent("streak_day")).toBe(20));
  it("achievement_unlocked = 100", () => expect(xpForEvent("achievement_unlocked")).toBe(100));
  it("story_completed = 10", () => expect(xpForEvent("story_completed")).toBe(10));
  it("level_up = 0", () => expect(xpForEvent("level_up")).toBe(0));
});

describe("levelFromXp", () => {
  it("0 → 0", () => expect(levelFromXp(0)).toBe(0));
  it("99 → 0", () => expect(levelFromXp(99)).toBe(0));
  it("100 → 1", () => expect(levelFromXp(100)).toBe(1));
  it("500 → 2", () => expect(levelFromXp(500)).toBe(2));
  it("1400 → 3", () => expect(levelFromXp(1400)).toBe(3));
  it("3000 → 4", () => expect(levelFromXp(3000)).toBe(4));
  it("5500 → 5", () => expect(levelFromXp(5500)).toBe(5));
});

describe("levelProgress", () => {
  it("at start of level", () => {
    const p = levelProgress(100);
    expect(p.current).toBe(1);
    expect(p.start).toBe(0);
    expect(p.end).toBe(500);
    expect(p.pct).toBe(0);
  });
  it("midway", () => {
    const p = levelProgress(250);
    expect(p.pct).toBeCloseTo((250 - 100) / (500 - 100), 2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/xp-calculator.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create calculator.ts**

```ts
// lib/xp/calculator.ts
import type { Rating } from "@/lib/db/schema";

const RATING_XP: Record<Rating, number> = {
  1: 0, 2: 0, 3: 1, 4: 5,
};

const EVENT_XP: Record<string, number> = {
  answer: 0,
  lesson_complete: 30,
  session_complete: 0,
  story_started: 0,
  story_completed: 10,
  streak_day: 20,
  level_up: 0,
  achievement_unlocked: 100,
  diagnostic_completed: 0,
};

export function xpForRating(r: Rating): number {
  return RATING_XP[r];
}

export function xpForEvent(type: string): number {
  return EVENT_XP[type] ?? 0;
}

/** Cumulative XP needed to reach level n: 100 * n(n+1)(2n+1)/6 */
function cumulativeXpForLevel(n: number): number {
  return Math.round((100 * n * (n + 1) * (2 * n + 1)) / 6);
}

export function levelFromXp(total: number): number {
  if (total < 100) return 0;
  let n = 1;
  while (cumulativeXpForLevel(n + 1) <= total) n++;
  return n;
}

export function levelProgress(total: number): { current: number; start: number; end: number; pct: number } {
  const current = levelFromXp(total);
  const start = current === 0 ? 0 : cumulativeXpForLevel(current);
  const end = cumulativeXpForLevel(current + 1);
  const pct = current === 0 ? total / 100 : (total - start) / (end - start);
  return { current, start, end, pct };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/xp-calculator.test.ts
```

Expected: PASS (12 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/xp/calculator.ts tests/unit/xp-calculator.test.ts
git commit -m "feat(xp): calculator (rating/event xp, levelFromXp, levelProgress)"
```

---

### Task 19: lib/achievements/rules.ts + tests

**Files:**
- Create: `lib/achievements/rules.ts`
- Test: `tests/unit/achievements-rules.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/achievements-rules.test.ts
import { describe, it, expect } from "vitest";
import { RULES, checkAndUnlock, AppState } from "@/lib/achievements/rules";

function state(overrides: Partial<AppState> = {}): AppState {
  return {
    totalAnswers: 0,
    currentStreak: 0,
    completedBlocks: [],
    perfectLessons: 0,
    storiesRead: 0,
    vocabCardsLearned: 0,
    conceptsMastery80: 0,
    diagnosticCount: 0,
    variantsUsed: new Set(),
    ...overrides,
  };
}

describe("RULES", () => {
  it("has at least 18 rules", () => {
    expect(RULES.length).toBeGreaterThanOrEqual(18);
  });

  it("every rule has id, name, description, check", () => {
    for (const r of RULES) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.description).toBeTruthy();
      expect(typeof r.check).toBe("function");
    }
  });

  it("rule ids are unique", () => {
    const ids = new Set(RULES.map((r) => r.id));
    expect(ids.size).toBe(RULES.length);
  });
});

describe("specific rules", () => {
  it("first-card", () => {
    const r = RULES.find((r) => r.id === "first-card")!;
    expect(r.check(state({ totalAnswers: 0 }))).toBe(false);
    expect(r.check(state({ totalAnswers: 1 }))).toBe(true);
  });

  it("streak-7", () => {
    const r = RULES.find((r) => r.id === "streak-7")!;
    expect(r.check(state({ currentStreak: 6 }))).toBe(false);
    expect(r.check(state({ currentStreak: 7 }))).toBe(true);
  });

  it("block-1-complete", () => {
    const r = RULES.find((r) => r.id === "block-1-complete")!;
    expect(r.check(state({ completedBlocks: [] }))).toBe(false);
    expect(r.check(state({ completedBlocks: [1] }))).toBe(true);
  });

  it("pt-explorer", () => {
    const r = RULES.find((r) => r.id === "pt-explorer")!;
    expect(r.check(state({ variantsUsed: new Set(["br"]) }))).toBe(false);
    expect(r.check(state({ variantsUsed: new Set(["br", "pt"]) }))).toBe(true);
  });
});

describe("checkAndUnlock", () => {
  it("returns newly unlocked rules", () => {
    const s = state({ totalAnswers: 1 });
    const newUnlocks = checkAndUnlock(new Set(), s);
    expect(newUnlocks.map((r) => r.id)).toContain("first-card");
  });

  it("does not return already-unlocked", () => {
    const s = state({ totalAnswers: 1 });
    const newUnlocks = checkAndUnlock(new Set(["first-card"]), s);
    expect(newUnlocks.map((r) => r.id)).not.toContain("first-card");
  });

  it("returns [] when nothing new", () => {
    const allIds = new Set(RULES.map((r) => r.id));
    const newUnlocks = checkAndUnlock(allIds, state({}));
    expect(newUnlocks).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/achievements-rules.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create rules.ts**

```ts
// lib/achievements/rules.ts

export interface AppState {
  totalAnswers: number;
  currentStreak: number;
  completedBlocks: number[];
  perfectLessons: number;
  storiesRead: number;
  vocabCardsLearned: number;
  conceptsMastery80: number;
  diagnosticCount: number;
  variantsUsed: Set<string>;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  check: (s: AppState) => boolean;
}

export const RULES: Rule[] = [
  { id: "first-card", name: "Primeira palavra", description: "Responde tu primera card", check: s => s.totalAnswers >= 1 },
  { id: "100-cards", name: "Centenário", description: "100 cards respondidas", check: s => s.totalAnswers >= 100 },
  { id: "1000-cards", name: "Maratonista", description: "1,000 cards respondidas", check: s => s.totalAnswers >= 1000 },
  { id: "streak-3", name: "Consistente", description: "3 días seguidos estudiando", check: s => s.currentStreak >= 3 },
  { id: "streak-7", name: "Uma semana", description: "7 días seguidos", check: s => s.currentStreak >= 7 },
  { id: "streak-30", name: "Um mês", description: "30 días seguidos", check: s => s.currentStreak >= 30 },
  { id: "streak-100", name: "Disciplina", description: "100 días seguidos", check: s => s.currentStreak >= 100 },
  { id: "block-1-complete", name: "Fonética dominada", description: "Bloque 1 completo", check: s => s.completedBlocks.includes(1) },
  { id: "block-2-complete", name: "Morfología", description: "Bloque 2 completo", check: s => s.completedBlocks.includes(2) },
  { id: "block-3-complete", name: "Presente", description: "Bloque 3 completo", check: s => s.completedBlocks.includes(3) },
  { id: "perfect-lesson", name: "Perfeccionista", description: "Una lección perfecta", check: s => s.perfectLessons >= 1 },
  { id: "perfect-streak", name: "10 perfectas", description: "10 lecciones perfectas", check: s => s.perfectLessons >= 10 },
  { id: "first-story", name: "Contador", description: "Lee tu primera historia", check: s => s.storiesRead >= 1 },
  { id: "all-stories-10", name: "Leitor", description: "Lee 10 historias", check: s => s.storiesRead >= 10 },
  { id: "all-stories-20", name: "Bibliófilo", description: "Lee 20 historias", check: s => s.storiesRead >= 20 },
  { id: "vocab-50", name: "Vocabularista", description: "50 vocab cards aprendidas", check: s => s.vocabCardsLearned >= 50 },
  { id: "concept-master-1", name: "Maestría 1", description: "1 concepto con 80% mastery", check: s => s.conceptsMastery80 >= 1 },
  { id: "concept-master-10", name: "Maestría 10", description: "10 conceptos con 80% mastery", check: s => s.conceptsMastery80 >= 10 },
  { id: "diagnostic-taken", name: "Auto-conhecimento", description: "Toma el test diagnóstico", check: s => s.diagnosticCount >= 1 },
  { id: "br-explorer", name: "Brasil", description: "Estudia en variante BR", check: s => s.variantsUsed.has("br") },
  { id: "pt-explorer", name: "Portugal", description: "Estudia en variante PT", check: s => s.variantsUsed.has("pt") },
];

export function checkAndUnlock(prevUnlocked: Set<string>, state: AppState): Rule[] {
  return RULES.filter((r) => !prevUnlocked.has(r.id) && r.check(state));
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/achievements-rules.test.ts
```

Expected: PASS (~9 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/achievements/rules.ts tests/unit/achievements-rules.test.ts
git commit -m "feat(achievements): 21 rules (derived) + checkAndUnlock"
```

---

### Task 20: Repository helpers for streak/xp/achievements

**Files:**
- Modify: `lib/db/repository.ts`

- [ ] **Step 1: Add helpers to repository.ts**

```ts
import { currentStreak, didStudyToday, isStreakAlive } from "@/lib/streak/streak";
import { levelFromXp } from "@/lib/xp/calculator";
import { RULES, AppState } from "@/lib/achievements/rules";

export async function recordSessionEnd(sessionId: number, variant: "br" | "pt", minutesStudied: number, cardsReviewed: number): Promise<void> {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const existing = await db.streak.get(today);
  const newMinutes = (existing?.minutesStudied ?? 0) + minutesStudied;
  const newCards = (existing?.cardsReviewed ?? 0) + cardsReviewed;
  await db.streak.put({
    date: today,
    minutesStudied: newMinutes,
    cardsReviewed: newCards,
    xpEarned: existing?.xpEarned ?? 0,
  });
  await db.events.add({ ts: new Date(), type: "session_complete", payload: { sessionId, minutes: minutesStudied, cards: cardsReviewed } });
}

export async function emitStreakDayIfQualified(goalMin: number): Promise<boolean> {
  const db = getDb();
  const all = await db.streak.toArray();
  const today = new Date().toISOString().slice(0, 10);
  if (!didStudyToday(all, today, goalMin)) return false;
  const todayRow = all.find((s) => s.date === today);
  if (!todayRow || todayRow.xpEarned > 0) return false;
  await db.streak.update(today, { xpEarned: 20 });
  await db.events.add({ ts: new Date(), type: "streak_day", payload: { date: today } });
  await addXp(20);
  return true;
}

export async function addXp(amount: number): Promise<{ before: number; after: number; leveledUp: boolean }> {
  const db = getDb();
  const before = ((await db.xp.get("total"))?.value) ?? 0;
  const after = before + amount;
  await db.xp.put({ key: "total", value: after, updatedAt: new Date() });
  const levelBefore = levelFromXp(before);
  const levelAfter = levelFromXp(after);
  const leveledUp = levelAfter > levelBefore;
  if (leveledUp) {
    for (let lv = levelBefore + 1; lv <= levelAfter; lv++) {
      await db.events.add({ ts: new Date(), type: "level_up", payload: { level: lv } });
    }
  }
  return { before, after, leveledUp };
}

export async function getStreakStatus(goalMin: number): Promise<{ currentStreak: number; todayMinutes: number; isStreakAlive: boolean }> {
  const db = getDb();
  const all = await db.streak.toArray();
  const today = new Date().toISOString().slice(0, 10);
  return {
    currentStreak: currentStreak(all, today, goalMin),
    todayMinutes: all.find((s) => s.date === today)?.minutesStudied ?? 0,
    isStreakAlive: isStreakAlive(all, today),
  };
}

export async function getTotalXp(): Promise<number> {
  const db = getDb();
  return ((await db.xp.get("total"))?.value) ?? 0;
}

export async function getUnlockedAchievements(): Promise<Set<string>> {
  const db = getDb();
  const rows = await db.achievements.toArray();
  return new Set(rows.map((r) => r.id));
}

export async function unlockAchievement(ruleId: string): Promise<boolean> {
  const db = getDb();
  const existing = await db.achievements.get(ruleId);
  if (existing) return false;
  await db.achievements.put({ id: ruleId, unlockedAt: new Date() });
  await db.events.add({ ts: new Date(), type: "achievement_unlocked", payload: { ruleId } });
  await addXp(100);
  return true;
}

export async function getAppState(goalMin: number): Promise<AppState> {
  const db = getDb();
  const events = await db.events.toArray();
  const mastery = await db.conceptMastery.toArray();
  const completedStories = await db.storyProgress.where("completedAt").above(0).count();
  const answerEvents = events.filter((e) => e.type === "answer");
  const variantsUsed = new Set(answerEvents.map((e) => (e.payload as any)?.variant).filter(Boolean));
  const lessonsCompleted = events.filter((e) => e.type === "lesson_complete");
  const diagnosticEvents = events.filter((e) => e.type === "diagnostic_completed");
  const vocabCards = await db.cards.where("tags").equals("vocab").count();
  const streakStatus = await getStreakStatus(goalMin);

  const lessonsByBlock: Record<number, number> = {};
  for (const ev of lessonsCompleted) {
    const blockId = (ev.payload as any)?.blockId;
    if (blockId) lessonsByBlock[blockId] = (lessonsByBlock[blockId] ?? 0) + 1;
  }
  const completedBlocks = Object.entries(lessonsByBlock).filter(([_, n]) => n >= 5).map(([b]) => Number(b));

  return {
    totalAnswers: answerEvents.length,
    currentStreak: streakStatus.currentStreak,
    completedBlocks,
    perfectLessons: lessonsCompleted.length,
    storiesRead: completedStories,
    vocabCardsLearned: vocabCards,
    conceptsMastery80: mastery.filter((m) => m.masteryPct >= 80).length,
    diagnosticCount: diagnosticEvents.length,
    variantsUsed,
  };
}

export async function checkAndUnlockAchievements(goalMin: number): Promise<string[]> {
  const state = await getAppState(goalMin);
  const prev = await getUnlockedAchievements();
  const newRules = RULES.filter((r) => !prev.has(r.id) && r.check(state));
  for (const r of newRules) {
    await unlockAchievement(r.id);
  }
  return newRules.map((r) => r.id);
}
```

- [ ] **Step 2: Run all existing tests**

```bash
npx vitest run
```

Expected: all pass.

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add lib/db/repository.ts
git commit -m "feat(db): streak/xp/achievement repository helpers"
```

---

### Task 21: StreakRing + DailyGoalRing components

**Files:**
- Create: `components/gamification/StreakRing.tsx`
- Create: `components/gamification/DailyGoalRing.tsx`
- Create: `lib/hooks/useStreakStatus.ts`

- [ ] **Step 1: Create useStreakStatus hook**

```ts
// lib/hooks/useStreakStatus.ts
"use client";
import { useEffect, useState } from "react";
import { getStreakStatus } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";

export function useStreakStatus() {
  const { dailyGoalMinutes } = useSettings();
  const [status, setStatus] = useState({ currentStreak: 0, todayMinutes: 0, isStreakAlive: false });

  useEffect(() => {
    let mounted = true;
    const refresh = () => getStreakStatus(dailyGoalMinutes).then((s) => mounted && setStatus(s));
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => { mounted = false; clearInterval(interval); };
  }, [dailyGoalMinutes]);

  return status;
}
```

- [ ] **Step 2: Create StreakRing**

```tsx
// components/gamification/StreakRing.tsx
"use client";
import { useStreakStatus } from "@/lib/hooks/useStreakStatus";

export function StreakRing() {
  const { currentStreak, isStreakAlive } = useStreakStatus();
  const flame = currentStreak >= 3;

  return (
    <div className="flex items-center gap-2">
      <span className="text-3xl" aria-label={`streak ${currentStreak}`}>
        {flame ? "🔥" : "○"}
      </span>
      <div>
        <div className="text-2xl font-display font-semibold">{currentStreak}</div>
        <div className="text-xs text-muted-foreground">{isStreakAlive ? "días" : "sin racha"}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create DailyGoalRing**

```tsx
// components/gamification/DailyGoalRing.tsx
"use client";
import { useStreakStatus } from "@/lib/hooks/useStreakStatus";
import { useSettings } from "@/lib/stores/settings";

export function DailyGoalRing() {
  const { todayMinutes } = useStreakStatus();
  const { dailyGoalMinutes } = useSettings();
  const pct = Math.min(1, todayMinutes / dailyGoalMinutes);
  const C = 2 * Math.PI * 28;

  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
        <circle
          cx="32" cy="32" r="28" fill="none"
          stroke="hsl(var(--primary))" strokeWidth="6"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
          strokeLinecap="round"
        />
      </svg>
      <div>
        <div className="text-sm font-medium">{Math.round(todayMinutes)} / {dailyGoalMinutes} min</div>
        <div className="text-xs text-muted-foreground">Meta diaria</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/gamification/ lib/hooks/
git commit -m "feat(ui): StreakRing + DailyGoalRing + useStreakStatus hook"
```

---

### Task 22: XpBar + LevelBadge + useXpStatus

**Files:**
- Create: `components/gamification/LevelBadge.tsx`
- Create: `components/gamification/XpBar.tsx`
- Create: `lib/hooks/useXpStatus.ts`

- [ ] **Step 1: Create useXpStatus**

```ts
// lib/hooks/useXpStatus.ts
"use client";
import { useEffect, useState } from "react";
import { getTotalXp } from "@/lib/db/repository";
import { levelFromXp, levelProgress } from "@/lib/xp/calculator";

export function useXpStatus() {
  const [status, setStatus] = useState({ total: 0, level: 0, progress: { current: 0, start: 0, end: 0, pct: 0 } });

  useEffect(() => {
    let mounted = true;
    const refresh = () =>
      getTotalXp().then((total) => {
        if (!mounted) return;
        setStatus({ total, level: levelFromXp(total), progress: levelProgress(total) });
      });
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return status;
}
```

- [ ] **Step 2: Create LevelBadge**

```tsx
// components/gamification/LevelBadge.tsx
"use client";
import { useXpStatus } from "@/lib/hooks/useXpStatus";

export function LevelBadge() {
  const { level } = useXpStatus();
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md">
      <span className="text-xs text-muted-foreground">Lv</span>
      <span className="text-sm font-display font-semibold">{level}</span>
    </div>
  );
}
```

- [ ] **Step 3: Create XpBar**

```tsx
// components/gamification/XpBar.tsx
"use client";
import { useXpStatus } from "@/lib/hooks/useXpStatus";

export function XpBar() {
  const { progress, total } = useXpStatus();
  const pct = Math.min(100, Math.max(0, progress.pct * 100));
  return (
    <div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-muted-foreground mt-1">{total} XP · nivel {progress.current}</div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/gamification/LevelBadge.tsx components/gamification/XpBar.tsx lib/hooks/useXpStatus.ts
git commit -m "feat(ui): LevelBadge + XpBar + useXpStatus hook"
```

---

### Task 23: /achievements page

**Files:**
- Create: `components/gamification/AchievementCard.tsx`
- Create: `app/achievements/page.tsx`

- [ ] **Step 1: Create AchievementCard**

```tsx
// components/gamification/AchievementCard.tsx
"use client";
import type { Rule } from "@/lib/achievements/rules";

export function AchievementCard({ rule, unlocked, unlockedAt }: { rule: Rule; unlocked: boolean; unlockedAt?: Date }) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        unlocked ? "border-primary bg-primary/5" : "border-border bg-muted/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{unlocked ? "🏆" : "🔒"}</div>
        <div className="flex-1">
          <h3 className="font-medium">{rule.name}</h3>
          <p className="text-sm text-muted-foreground">{rule.description}</p>
          {unlocked && unlockedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Desbloqueado: {unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create page**

```tsx
// app/achievements/page.tsx
"use client";
import { useEffect, useState } from "react";
import { RULES } from "@/lib/achievements/rules";
import { getUnlockedAchievements, checkAndUnlockAchievements } from "@/lib/db/repository";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { useSettings } from "@/lib/stores/settings";
import { getDb } from "@/lib/db/schema";

export default function AchievementsPage() {
  const { dailyGoalMinutes } = useSettings();
  const [unlocked, setUnlocked] = useState<Map<string, Date>>(new Map());

  useEffect(() => {
    async function load() {
      await checkAndUnlockAchievements(dailyGoalMinutes);
      const db = getDb();
      const rows = await db.achievements.toArray();
      setUnlocked(new Map(rows.map((r) => [r.id, r.unlockedAt])));
    }
    load();
  }, [dailyGoalMinutes]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl mb-2">Logros</h1>
      <p className="text-muted-foreground mb-8">
        {unlocked.size} de {RULES.length} desbloqueados
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RULES.map((r) => (
          <AchievementCard
            key={r.id}
            rule={r}
            unlocked={unlocked.has(r.id)}
            unlockedAt={unlocked.get(r.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/gamification/AchievementCard.tsx app/achievements/
git commit -m "feat(ui): /achievements page with grid of cards"
```

---

## Milestone 4 — Stats (Phase 6)

### Task 24: lib/stats/aggregations.ts + tests

**Files:**
- Create: `lib/stats/aggregations.ts`
- Test: `tests/unit/stats-aggregations.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/stats-aggregations.test.ts
import { describe, it, expect } from "vitest";
import { aggregateByDay, accuracyByBlock, weakestConcepts, fsrsRetention, brVsPtSplit } from "@/lib/stats/aggregations";

describe("aggregateByDay", () => {
  it("returns empty for no events", () => {
    expect(aggregateByDay([])).toEqual([]);
  });
  it("groups events by day", () => {
    const events = [
      { ts: new Date("2026-06-09T10:00:00"), type: "answer" as const, payload: { correct: true } },
      { ts: new Date("2026-06-09T15:00:00"), type: "answer" as const, payload: { correct: false } },
      { ts: new Date("2026-06-08T10:00:00"), type: "answer" as const, payload: { correct: true } },
    ];
    const byDay = aggregateByDay(events);
    expect(byDay).toHaveLength(2);
    expect(byDay[0].date).toBe("2026-06-08");
    expect(byDay[0].count).toBe(1);
    expect(byDay[1].date).toBe("2026-06-09");
    expect(byDay[1].count).toBe(2);
  });
});

describe("accuracyByBlock", () => {
  it("computes accuracy per block", () => {
    const events = [
      { ts: new Date(), type: "answer" as const, payload: { blockId: 1, correct: true } },
      { ts: new Date(), type: "answer" as const, payload: { blockId: 1, correct: true } },
      { ts: new Date(), type: "answer" as const, payload: { blockId: 1, correct: false } },
      { ts: new Date(), type: "answer" as const, payload: { blockId: 2, correct: true } },
    ];
    const acc = accuracyByBlock(events);
    expect(acc[1]).toBeCloseTo(2/3, 2);
    expect(acc[2]).toBe(1);
  });
});

describe("weakestConcepts", () => {
  it("returns N lowest mastery concepts with data", () => {
    const mastery = [
      { conceptId: "a", masteryPct: 90 },
      { conceptId: "b", masteryPct: 30 },
      { conceptId: "c", masteryPct: 50 },
      { conceptId: "d", masteryPct: 10 },
    ];
    const weak = weakestConcepts(mastery, 2);
    expect(weak.map((c) => c.conceptId)).toEqual(["d", "b"]);
  });
});

describe("fsrsRetention", () => {
  it("returns 0 if no cards", () => {
    expect(fsrsRetention([])).toBe(0);
  });
  it("counts Review state cards as retained", () => {
    const cards = [
      { state: 2 as number }, // Review
      { state: 1 as number }, // Learning
      { state: 2 as number },
    ];
    expect(fsrsRetention(cards)).toBeCloseTo(2/3, 2);
  });
});

describe("brVsPtSplit", () => {
  it("computes percentage of BR vs PT events", () => {
    const events = [
      { ts: new Date(), type: "answer" as const, payload: { variant: "br" } },
      { ts: new Date(), type: "answer" as const, payload: { variant: "br" } },
      { ts: new Date(), type: "answer" as const, payload: { variant: "pt" } },
    ];
    const split = brVsPtSplit(events);
    expect(split.br).toBeCloseTo(2/3, 2);
    expect(split.pt).toBeCloseTo(1/3, 2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/stats-aggregations.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create aggregations.ts**

```ts
// lib/stats/aggregations.ts

interface BaseEvent {
  ts: Date;
  type: string;
  payload: Record<string, any>;
}

export interface DayAgg {
  date: string;
  count: number;
  correct: number;
}

export function aggregateByDay(events: BaseEvent[]): DayAgg[] {
  const byDate = new Map<string, DayAgg>();
  for (const e of events) {
    const date = e.ts.toISOString().slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, { date, count: 0, correct: 0 });
    const agg = byDate.get(date)!;
    agg.count++;
    if (e.type === "answer" && e.payload.correct) agg.correct++;
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function accuracyByBlock(events: BaseEvent[]): Record<number, number> {
  const byBlock = new Map<number, { correct: number; total: number }>();
  for (const e of events) {
    if (e.type !== "answer") continue;
    const blockId = e.payload.blockId;
    if (!blockId) continue;
    if (!byBlock.has(blockId)) byBlock.set(blockId, { correct: 0, total: 0 });
    const a = byBlock.get(blockId)!;
    a.total++;
    if (e.payload.correct) a.correct++;
  }
  const out: Record<number, number> = {};
  for (const [b, a] of byBlock) out[b] = a.total > 0 ? a.correct / a.total : 0;
  return out;
}

export interface ConceptMastery { conceptId: string; masteryPct: number; }

export function weakestConcepts(mastery: ConceptMastery[], n: number): ConceptMastery[] {
  return [...mastery].sort((a, b) => a.masteryPct - b.masteryPct).slice(0, n);
}

export function strongestConcepts(mastery: ConceptMastery[], n: number): ConceptMastery[] {
  return [...mastery].sort((a, b) => b.masteryPct - a.masteryPct).slice(0, n);
}

export function fsrsRetention(cards: Array<{ state: number }>): number {
  if (cards.length === 0) return 0;
  const reviewState = 2; // Review
  const retained = cards.filter((c) => c.state === reviewState).length;
  return retained / cards.length;
}

export function brVsPtSplit(events: BaseEvent[]): { br: number; pt: number } {
  let br = 0, pt = 0;
  for (const e of events) {
    if (e.type !== "answer") continue;
    if (e.payload.variant === "br") br++;
    else if (e.payload.variant === "pt") pt++;
  }
  const total = br + pt;
  if (total === 0) return { br: 0, pt: 0 };
  return { br: br / total, pt: pt / total };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/stats-aggregations.test.ts
```

Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/stats/aggregations.ts tests/unit/stats-aggregations.test.ts
git commit -m "feat(stats): pure aggregation functions (byDay, byBlock, mastery, fsrs, br/pt)"
```

---

### Task 25: Heatmap component

**Files:**
- Create: `components/stats/Heatmap.tsx`

- [ ] **Step 1: Create Heatmap**

```tsx
// components/stats/Heatmap.tsx
"use client";
import { useMemo } from "react";

interface DayCell { date: string; count: number; }

export function Heatmap({ data, year }: { data: DayCell[]; year: number }) {
  const cells = useMemo(() => {
    const start = new Date(`${year}-01-01T00:00:00`);
    const end = new Date(`${year}-12-31T00:00:00`);
    const byDate = new Map(data.map((d) => [d.date, d.count]));
    const out: Array<{ date: string; count: number; month: number; dayOfWeek: number }> = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().slice(0, 10);
      out.push({
        date,
        count: byDate.get(date) ?? 0,
        month: d.getMonth(),
        dayOfWeek: d.getDay(),
      });
    }
    return out;
  }, [data, year]);

  const max = Math.max(1, ...cells.map((c) => c.count));

  const color = (count: number) => {
    if (count === 0) return "hsl(var(--muted))";
    const intensity = count / max;
    if (intensity < 0.25) return "hsl(var(--primary) / 0.3)";
    if (intensity < 0.5) return "hsl(var(--primary) / 0.6)";
    if (intensity < 0.75) return "hsl(var(--primary) / 0.85)";
    return "hsl(var(--primary))";
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-rows-7 grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(7, 12px)" }}>
        {cells.map((c) => (
          <div
            key={c.date}
            title={`${c.date}: ${c.count} cards`}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color(c.count) }}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/stats/Heatmap.tsx
git commit -m "feat(ui): Heatmap component (365 days)"
```

---

### Task 26: Stats charts (LineChart, BlockAccuracyChart, etc.)

**Files:**
- Create: `components/stats/LineChart.tsx`
- Create: `components/stats/BlockAccuracyChart.tsx`
- Create: `components/stats/ConceptMasteryChart.tsx`
- Create: `components/stats/BrPtSplitChart.tsx`
- Create: `components/stats/FsrsRetentionCard.tsx`

- [ ] **Step 1: Create LineChart (Recharts wrapper)**

```tsx
// components/stats/LineChart.tsx
"use client";
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function LineChart({ data, dataKey, xKey, color = "hsl(var(--primary))" }: { data: any[]; dataKey: string; xKey: string; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RLineChart data={data}>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </RLineChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Create BlockAccuracyChart**

```tsx
// components/stats/BlockAccuracyChart.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function BlockAccuracyChart({ data }: { data: Record<number, number> }) {
  const arr = Object.entries(data).map(([blockId, acc]) => ({
    name: `B${blockId}`,
    accuracy: Math.round(acc * 100),
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={arr}>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
        <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 3: Create ConceptMasteryChart**

```tsx
// components/stats/ConceptMasteryChart.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function ConceptMasteryChart({ data, title }: { data: Array<{ conceptId: string; masteryPct: number }>; title: string }) {
  const arr = data.slice(0, 10).map((c) => ({ name: c.conceptId.replace(/^b\d+-/, ""), mastery: c.masteryPct }));
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={arr} layout="vertical">
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={80} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <Bar dataKey="mastery" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 4: Create BrPtSplitChart**

```tsx
// components/stats/BrPtSplitChart.tsx
"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function BrPtSplitChart({ data }: { data: { br: number; pt: number } }) {
  const arr = [
    { name: "BR", value: Math.round(data.br * 100), color: "hsl(var(--primary))" },
    { name: "PT", value: Math.round(data.pt * 100), color: "hsl(var(--accent))" },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={arr} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
          {arr.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 5: Create FsrsRetentionCard**

```tsx
// components/stats/FsrsRetentionCard.tsx
"use client";
export function FsrsRetentionCard({ data }: { data: Record<number, number> }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-3">Retención FSRS</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([blockId, retention]) => (
          <div key={blockId} className="flex items-center gap-2">
            <span className="text-xs w-8">B{blockId}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${retention * 100}%` }} />
            </div>
            <span className="text-xs w-10 text-right">{Math.round(retention * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add components/stats/
git commit -m "feat(ui): stats chart components (Line, Block, Concept, BrPt, Fsrs)"
```

---

### Task 27: /stats page

**Files:**
- Create: `app/stats/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// app/stats/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getDb } from "@/lib/db/schema";
import { aggregateByDay, accuracyByBlock, weakestConcepts, strongestConcepts, fsrsRetention, brVsPtSplit } from "@/lib/stats/aggregations";
import { Heatmap } from "@/components/stats/Heatmap";
import { LineChart } from "@/components/stats/LineChart";
import { BlockAccuracyChart } from "@/components/stats/BlockAccuracyChart";
import { ConceptMasteryChart } from "@/components/stats/ConceptMasteryChart";
import { BrPtSplitChart } from "@/components/stats/BrPtSplitChart";
import { FsrsRetentionCard } from "@/components/stats/FsrsRetentionCard";

export default function StatsPage() {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const db = getDb();
      const allEvents = await db.events.toArray();
      const cards = await db.cards.toArray();
      const mastery = await db.conceptMastery.toArray();

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - range);
      const events = allEvents.filter((e) => e.ts >= cutoff);

      const byDay = aggregateByDay(events);
      const byBlock = accuracyByBlock(allEvents);
      const weak = weakestConcepts(mastery.filter((m) => m.exposureCount > 0), 10);
      const strong = strongestConcepts(mastery.filter((m) => m.exposureCount > 0), 10);
      const retention = fsrsRetention(cards);
      const split = brVsPtSplit(allEvents);

      // Year heatmap (last year)
      const year = new Date().getFullYear();
      const yearEvents = allEvents.filter((e) => e.ts.getFullYear() === year);
      const heatmapData = aggregateByDay(yearEvents).map((d) => ({ date: d.date, count: d.count }));

      setData({ byDay, byBlock, weak, strong, retention, split, heatmapData, year });
    }
    load();
  }, [range]);

  if (!data) return <p className="p-8">Cargando...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Stats</h1>
        <div className="flex gap-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d as any)}
              className={`px-3 py-1 text-sm rounded ${range === d ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <section className="border border-border rounded-lg p-4">
        <h2 className="text-sm font-medium mb-3">Tiempo total ({range}d)</h2>
        <LineChart
          data={data.byDay.map((d: any) => ({ date: d.date.slice(5), count: d.count }))}
          dataKey="count"
          xKey="date"
        />
      </section>

      <section className="border border-border rounded-lg p-4">
        <h2 className="text-sm font-medium mb-3">Heatmap {data.year}</h2>
        <Heatmap data={data.heatmapData} year={data.year} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-3">Accuracy por bloque</h2>
          <BlockAccuracyChart data={data.byBlock} />
        </section>
        <section className="border border-border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-3">BR vs PT</h2>
          <BrPtSplitChart data={data.split} />
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-border rounded-lg p-4">
          <ConceptMasteryChart data={data.weak} title="Conceptos más débiles" />
        </section>
        <section className="border border-border rounded-lg p-4">
          <ConceptMasteryChart data={data.strong} title="Conceptos más fuertes" />
        </section>
      </div>

      <FsrsRetentionCard data={{ 1: data.retention }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/stats/
git commit -m "feat(ui): /stats page with heatmap + 4 chart groups"
```

---

## Milestone 5 — Diagnostic test (Phase 7)

### Task 28: diagnostic schema + prompt

**Files:**
- Modify: `lib/data/zod-schemas.ts`
- Create: `scripts/prompts/diagnostic.md`

- [ ] **Step 1: Add Diagnostic schema to zod-schemas**

Append to `lib/data/zod-schemas.ts`:

```ts
export const DiagnosticQuestionSchema = z.object({
  id: z.string().length(8),
  blockId: z.number().int().min(1).max(3),
  conceptId: z.string(),
  prompt: z.string().min(10),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export const DiagnosticSchema = z.object({
  generatedAt: z.string(),
  questions: z.array(DiagnosticQuestionSchema).length(20),
});

export type Diagnostic = z.infer<typeof DiagnosticSchema>;
export type DiagnosticQuestion = z.infer<typeof DiagnosticQuestionSchema>;
```

- [ ] **Step 2: Create prompt**

```md
<!-- scripts/prompts/diagnostic.md -->
# Test diagnóstico de portugués

Você vai criar 20 perguntas de múltipla escolha para avaliar o nível de um hispanofalante aprendendo português.

## Distribuição
- 8 perguntas do bloco 1 (fonética)
- 6 perguntas do bloco 2 (morfologia nominal)
- 6 perguntas do bloco 3 (presente)

## Formato

```json
{
  "questions": [
    {
      "id": "8-char-hash",
      "blockId": 1,
      "conceptId": "b1-alfabeto",
      "prompt": "string",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0
    }
  ]
}
```

Cada pergunta deve testar um conceito específico (alphabet, accent, nasal vowels, etc.).
```

- [ ] **Step 3: Commit**

```bash
git add lib/data/zod-schemas.ts scripts/prompts/diagnostic.md
git commit -m "feat(data): DiagnosticSchema + diagnostic prompt"
```

---

### Task 29: generate-diagnostic.ts script

**Files:**
- Create: `scripts/generate-diagnostic.ts`
- Modify: `package.json` (add `generate:diagnostic`)

- [ ] **Step 1: Create script**

```ts
// scripts/generate-diagnostic.ts
import "dotenv/config";
import { llm } from "./lib/minimax-llm";
import { renderPrompt } from "./lib/prompt-runner";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

const QuestionSchema = z.object({
  id: z.string().length(8),
  blockId: z.number().int().min(1).max(3),
  conceptId: z.string(),
  prompt: z.string().min(10),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

const OutputSchema = z.object({ questions: z.array(QuestionSchema).length(20) });

async function main() {
  const outFile = path.join(process.cwd(), "lib/data/diagnostic.json");
  if (await fileExists(outFile)) {
    console.log("✓ diagnostic.json exists, skipping");
    return;
  }

  const prompt = await renderPrompt("diagnostic", {});
  const result = await llm.messages.create({
    model: "MiniMax-M2.5-highspeed",
    max_tokens: 6000,
    system: "Você é um professor de português criando um teste diagnóstico.",
    messages: [{ role: "user", content: prompt }],
  });

  const text = result.content[0].type === "text" ? result.content[0].text : "";
  const json = extractJson(text);
  const parsed = OutputSchema.parse(JSON.parse(json));

  const out = { generatedAt: new Date().toISOString(), questions: parsed.questions };
  await fs.writeFile(outFile, JSON.stringify(out, null, 2));
  console.log(`✓ Generated diagnostic.json (${parsed.questions.length} questions)`);
}

async function fileExists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; } catch { return false; }
}

function extractJson(text: string): string {
  const match = text.match(/```json\s*([\s\S]+?)\s*```/);
  return match ? match[1] : text;
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Add to package.json**

```json
"generate:diagnostic": "tsx scripts/generate-diagnostic.ts"
```

- [ ] **Step 3: Run the script**

```bash
npm run generate:diagnostic
```

Expected: `✓ Generated diagnostic.json (20 questions)`.

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-diagnostic.ts package.json lib/data/diagnostic.json
git commit -m "data: diagnostic.json with 20 questions (blocks 1-3)"
```

---

### Task 30: lib/diagnostic/scorer.ts + tests

**Files:**
- Create: `lib/diagnostic/scorer.ts`
- Test: `tests/unit/diagnostic-scorer.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/diagnostic-scorer.test.ts
import { describe, it, expect } from "vitest";
import { computeRecommendation } from "@/lib/diagnostic/scorer";

const questions = [
  { id: "q1", blockId: 1, correctIndex: 0, prompt: "", options: ["a","b","c","d"] as [string,string,string,string], conceptId: "b1-a" },
  { id: "q2", blockId: 1, correctIndex: 1, prompt: "", options: ["a","b","c","d"] as [string,string,string,string], conceptId: "b1-b" },
  { id: "q3", blockId: 2, correctIndex: 2, prompt: "", options: ["a","b","c","d"] as [string,string,string,string], conceptId: "b2-a" },
  { id: "q4", blockId: 2, correctIndex: 3, prompt: "", options: ["a","b","c","d"] as [string,string,string,string], conceptId: "b2-b" },
  { id: "q5", blockId: 3, correctIndex: 0, prompt: "", options: ["a","b","c","d"] as [string,string,string,string], conceptId: "b3-a" },
];

describe("computeRecommendation", () => {
  it("all correct in B1, B2, B3 → recommends B1 (recomenda复习)", () => {
    const rec = computeRecommendation(questions, [0, 1, 2, 3, 0]);
    expect(rec.recommendedStart).toBe(1);
  });

  it("0% in B1, 100% in B2, B3 → recommends B1 (must review)", () => {
    const rec = computeRecommendation(questions, [9, 9, 2, 3, 0]);
    expect(rec.recommendedStart).toBe(1);
  });

  it("80% B1, 40% B2, 100% B3 → recommends B2 (lowest failing)", () => {
    const rec = computeRecommendation(questions, [0, 1, 9, 9, 0]);
    expect(rec.recommendedStart).toBe(2);
  });

  it("all correct → score = 100", () => {
    const rec = computeRecommendation(questions, [0, 1, 2, 3, 0]);
    expect(rec.score).toBe(100);
  });

  it("empty answers → fallback B1", () => {
    const rec = computeRecommendation(questions, []);
    expect(rec.recommendedStart).toBe(1);
  });

  it("weak concepts are listed", () => {
    const rec = computeRecommendation(questions, [9, 9, 9, 3, 0]);
    expect(rec.weakConceptIds.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/diagnostic-scorer.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create scorer.ts**

```ts
// lib/diagnostic/scorer.ts
import type { DiagnosticQuestion } from "@/lib/data/zod-schemas";

export interface Recommendation {
  recommendedStart: number;
  score: number;
  blockScores: Record<number, number>;
  weakConceptIds: string[];
}

const ACCURACY_THRESHOLD = 0.7;

export function computeRecommendation(
  questions: DiagnosticQuestion[],
  answers: number[]
): Recommendation {
  if (answers.length === 0) {
    return { recommendedStart: 1, score: 0, blockScores: {}, weakConceptIds: [] };
  }

  const byBlock: Record<number, { correct: number; total: number }> = {};
  const byConcept: Record<string, { correct: number; total: number }> = {};
  let totalCorrect = 0;

  for (let i = 0; i < answers.length; i++) {
    const q = questions[i];
    const correct = answers[i] === q.correctIndex;
    if (correct) totalCorrect++;

    if (!byBlock[q.blockId]) byBlock[q.blockId] = { correct: 0, total: 0 };
    byBlock[q.blockId].total++;
    if (correct) byBlock[q.blockId].correct++;

    if (!byConcept[q.conceptId]) byConcept[q.conceptId] = { correct: 0, total: 0 };
    byConcept[q.conceptId].total++;
    if (correct) byConcept[q.conceptId].correct++;
  }

  const blockScores: Record<number, number> = {};
  for (const [b, a] of Object.entries(byBlock)) {
    blockScores[Number(b)] = a.total > 0 ? a.correct / a.total : 0;
  }

  const weakConceptIds: string[] = [];
  for (const [c, a] of Object.entries(byConcept)) {
    if (a.total > 0 && a.correct / a.total < ACCURACY_THRESHOLD) weakConceptIds.push(c);
  }

  // Find lowest block where accuracy < threshold
  const sortedBlocks = Object.entries(blockScores).sort(([a], [b]) => Number(a) - Number(b));
  const failingBlock = sortedBlocks.find(([_, acc]) => acc < ACCURACY_THRESHOLD);
  const recommendedStart = failingBlock ? Number(failingBlock[0]) : 1;

  return {
    recommendedStart,
    score: Math.round((totalCorrect / answers.length) * 100),
    blockScores,
    weakConceptIds,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/unit/diagnostic-scorer.test.ts
```

Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/diagnostic/scorer.ts tests/unit/diagnostic-scorer.test.ts
git commit -m "feat(diagnostic): scorer with recommendation algorithm"
```

---

### Task 31: /diagnostic page

**Files:**
- Create: `components/diagnostic/DiagnosticRunner.tsx`
- Create: `components/diagnostic/DiagnosticResults.tsx`
- Create: `app/diagnostic/page.tsx`

- [ ] **Step 1: Create DiagnosticRunner**

```tsx
// components/diagnostic/DiagnosticRunner.tsx
"use client";
import { useState } from "react";
import type { DiagnosticQuestion } from "@/lib/data/zod-schemas";
import { DiagnosticResults, Recommendation } from "./DiagnosticResults";

export function DiagnosticRunner({ questions }: { questions: DiagnosticQuestion[] }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [scorer, setScorer] = useState<typeof import("@/lib/diagnostic/scorer").computeRecommendation | null>(null);

  useEffect(() => {
    import("@/lib/diagnostic/scorer").then((m) => setScorer(() => m.computeRecommendation));
  }, []);

  if (result) return <DiagnosticResults result={result} />;
  if (!scorer) return <p>Cargando...</p>;

  const q = questions[idx];
  if (!q) return <p>No hay preguntas.</p>;

  const answer = (i: number) => {
    const newAnswers = [...answers, i];
    setAnswers(newAnswers);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      const r = scorer(questions, newAnswers);
      setResult(r);
      // Persist
      import("@/lib/db/schema").then(({ getDb }) => {
        getDb().diagnosticResults.add({
          takenAt: new Date(),
          completed: true,
          answers: newAnswers,
          recommendedStart: r.recommendedStart,
          score: r.score,
        });
        getDb().events.add({ ts: new Date(), type: "diagnostic_completed", payload: { score: r.score, recommendedStart: r.recommendedStart } });
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="text-sm text-muted-foreground mb-2">Pregunta {idx + 1} de {questions.length}</div>
      <h2 className="text-xl font-medium mb-4">{q.prompt}</h2>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            className="w-full text-left p-3 border border-border rounded-md hover:border-primary"
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DiagnosticResults**

```tsx
// components/diagnostic/DiagnosticResults.tsx
"use client";
import Link from "next/link";
import type { Recommendation } from "@/lib/diagnostic/scorer";

export { type Recommendation } from "@/lib/diagnostic/scorer";

export function DiagnosticResults({ result }: { result: Recommendation }) {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="font-display text-3xl">Resultados</h2>
      <div className="border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground">Score</div>
        <div className="text-4xl font-display font-semibold">{result.score}%</div>
      </div>
      <div className="border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Recomendación</div>
        <div className="text-2xl font-display font-semibold mb-2">
          Empezá por el Bloque {result.recommendedStart}
        </div>
        <Link
          href={`/blocks/${result.recommendedStart}`}
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Ir al Bloque {result.recommendedStart} →
        </Link>
      </div>
      {result.weakConceptIds.length > 0 && (
        <div className="border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">Conceptos a reforzar</div>
          <ul className="text-sm space-y-1">
            {result.weakConceptIds.map((c) => <li key={c}>• {c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create page**

```tsx
// app/diagnostic/page.tsx
import { promises as fs } from "fs";
import path from "path";
import { DiagnosticSchema } from "@/lib/data/zod-schemas";
import { DiagnosticRunner } from "@/components/diagnostic/DiagnosticRunner";

export default async function DiagnosticPage() {
  const file = path.join(process.cwd(), "lib/data/diagnostic.json");
  const raw = await fs.readFile(file, "utf-8");
  const diagnostic = DiagnosticSchema.parse(JSON.parse(raw));

  return (
    <div className="py-8">
      <div className="max-w-xl mx-auto px-4 mb-4">
        <h1 className="font-display text-3xl">Test diagnóstico</h1>
        <p className="text-sm text-muted-foreground">20 preguntas · ~5 minutos · sin bloqueante</p>
      </div>
      <DiagnosticRunner questions={diagnostic.questions} />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/diagnostic/ app/diagnostic/
git commit -m "feat(ui): /diagnostic page with 20-question runner + results"
```

---

## Milestone 6 — Home upgrade (Phase 8)

### Task 32: Home dashboard rewrite

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/TodaySummary.tsx`
- Create: `components/home/ContinueCard.tsx`
- Create: `components/home/StoryOfTheBlockCard.tsx`

- [ ] **Step 1: Create TodaySummary**

```tsx
// components/home/TodaySummary.tsx
"use client";
import { StreakRing } from "@/components/gamification/StreakRing";
import { DailyGoalRing } from "@/components/gamification/DailyGoalRing";
import { XpBar } from "@/components/gamification/XpBar";
import { LevelBadge } from "@/components/gamification/LevelBadge";

export function TodaySummary() {
  return (
    <section className="border border-border rounded-lg p-4">
      <h2 className="text-sm font-medium mb-4">Hoy</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
        <StreakRing />
        <DailyGoalRing />
        <div className="col-span-2 sm:col-span-2">
          <XpBar />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <LevelBadge />
        <span className="text-xs text-muted-foreground">Tu nivel</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create StoryOfTheBlockCard**

```tsx
// components/home/StoryOfTheBlockCard.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadAllStories } from "@/lib/data/loaders";
import { getCompletedStories } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";
import type { Story } from "@/lib/data/zod-schemas";

export function StoryOfTheBlockCard() {
  const { variant } = useSettings();
  const [story, setStory] = useState<Story | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const stories = await loadAllStories();
      const done = await getCompletedStories();
      setCompleted(new Set(done));
      // Pick first unread story of block 1
      const first = stories.find((s) => s.blockId === 1 && !done.includes(s.id)) ?? stories[0];
      setStory(first ?? null);
    }
    load();
  }, []);

  if (!story) return null;

  return (
    <section className="border border-border rounded-lg p-4">
      <div className="text-xs text-muted-foreground mb-1">📖 Historia del Bloque {story.blockId}</div>
      <h3 className="font-display text-xl mb-1">{story.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Nivel {story.level} · {story.vocab.length} vocab · ~3 min
        {completed.has(story.id) && " · ✓ ya leída"}
      </p>
      <Link
        href={`/stories/${story.id}`}
        className="inline-block px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
      >
        {completed.has(story.id) ? "Releer" : "Empezar"}
      </Link>
    </section>
  );
}
```

- [ ] **Step 3: Create ContinueCard**

```tsx
// components/home/ContinueCard.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadAllStories } from "@/lib/data/loaders";
import { getDb } from "@/lib/db/schema";
import { getDueCardsCount } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";

export function ContinueCard() {
  const { variant } = useSettings();
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    getDueCardsCount().then(setDueCount);
  }, []);

  if (dueCount === 0) {
    return (
      <section className="border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-1">📚 Continuar</div>
        <p className="text-sm">No hay cards listas para repaso.</p>
        <Link href="/blocks" className="text-sm text-primary underline mt-2 inline-block">
          Ver bloques
        </Link>
      </section>
    );
  }

  return (
    <section className="border border-border rounded-lg p-4">
      <div className="text-xs text-muted-foreground mb-1">🔁 Repaso</div>
      <h3 className="font-display text-xl mb-2">{dueCount} cards listas</h3>
      <Link
        href="/learn"
        className="inline-block px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
      >
        Repasar ahora
      </Link>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite app/page.tsx**

```tsx
// app/page.tsx
import { TodaySummary } from "@/components/home/TodaySummary";
import { StoryOfTheBlockCard } from "@/components/home/StoryOfTheBlockCard";
import { ContinueCard } from "@/components/home/ContinueCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Aprende Português</h1>
        <div className="flex gap-2">
          <Link href="/diagnostic" className="text-sm text-muted-foreground hover:text-foreground">
            Diagnóstico
          </Link>
          <Link href="/stats" className="text-sm text-muted-foreground hover:text-foreground">
            Stats
          </Link>
          <Link href="/achievements" className="text-sm text-muted-foreground hover:text-foreground">
            Logros
          </Link>
        </div>
      </header>
      <TodaySummary />
      <StoryOfTheBlockCard />
      <ContinueCard />
    </div>
  );
}
```

- [ ] **Step 5: Add `getDueCardsCount` helper to repository.ts (if not present)**

```ts
export async function getDueCardsCount(): Promise<number> {
  const db = getDb();
  const now = new Date();
  return db.cards.where("nextReviewAt").belowOrEqual(now).count();
}
```

- [ ] **Step 6: Typecheck + dev server check**

```bash
npx tsc --noEmit
npm run dev -- --port 3004
```

Visit `http://localhost:3004/` and verify all widgets render.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx components/home/ lib/db/repository.ts
git commit -m "feat(ui): home dashboard upgrade with streak/level/story/continue"
```

---

## Milestone 7 — Verify + tag (Phase 9)

### Task 33: Extend verify:content

**Files:**
- Modify: `scripts/verify-content.ts`

- [ ] **Step 1: Add story + vocab + diagnostic checks**

Add to `scripts/verify-content.ts` (in the verify function):

```ts
// Stories
const storiesDir = path.join(process.cwd(), "lib/data/stories");
const storyFiles = await fs.readdir(storiesDir).catch(() => []);
for (const f of storyFiles) {
  const raw = await fs.readFile(path.join(storiesDir, f), "utf-8");
  const story = StorySchema.parse(JSON.parse(raw));
  // Check audio files exist
  const brAudio = path.join(process.cwd(), "public/audio", `${story.variants.br.audioHash}.mp3`);
  const ptAudio = path.join(process.cwd(), "public/audio", `${story.variants.pt.audioHash}.mp3`);
  if (!await fileExists(brAudio)) throw new Error(`Story ${story.id} missing BR audio: ${brAudio}`);
  if (!await fileExists(ptAudio)) throw new Error(`Story ${story.id} missing PT audio: ${ptAudio}`);
  for (const v of story.vocab) {
    if (!await fileExists(path.join(process.cwd(), "public/audio", `${v.audioHash.br}.mp3`))) {
      throw new Error(`Story ${story.id} vocab ${v.word} missing BR audio`);
    }
  }
}
console.log(`✓ ${storyFiles.length} stories verified`);

// Vocab catalog
const catalogFile = path.join(process.cwd(), "lib/data/vocab-catalog.json");
if (await fileExists(catalogFile)) {
  const catalog = JSON.parse(await fs.readFile(catalogFile, "utf-8"));
  console.log(`✓ vocab-catalog.json: ${catalog.length} entries`);
}

// Diagnostic
const diagFile = path.join(process.cwd(), "lib/data/diagnostic.json");
if (await fileExists(diagFile)) {
  const diag = DiagnosticSchema.parse(JSON.parse(await fs.readFile(diagFile, "utf-8")));
  console.log(`✓ diagnostic.json: ${diag.questions.length} questions`);
}
```

- [ ] **Step 2: Run verify**

```bash
npm run verify:content
```

Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-content.ts
git commit -m "chore(verify): check stories + vocab catalog + diagnostic"
```

---

### Task 34: Final static gates + dev smoke test

**Files:** none

- [ ] **Step 1: Typecheck**

```bash
cd /Users/lalo/idiomas/portugues-app
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Tests**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: succeeds with new routes (`/stories`, `/stories/[id]`, `/drill/vocab`, `/stats`, `/achievements`, `/diagnostic`).

- [ ] **Step 4: Dev server smoke**

```bash
npm run dev -- --port 3005
```

In another terminal:

```bash
for route in / /stories /stories/b1-s1-bom-dia-joao-na-padaria /drill/vocab /stats /achievements /diagnostic; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005$route)
  echo "GET $route -> $code"
done
```

Expected: all 200.

- [ ] **Step 5: Verify content again**

```bash
npm run verify:content
```

Expected: all green.

- [ ] **Step 6: Commit (if anything changed)**

```bash
git add -A
git status
# Only commit if there are changes
```

---

### Task 35: E2E tests (engagement + vocab + stories)

**Files:**
- Create: `playwright/tests/engagement.spec.ts`
- Create: `playwright/tests/vocab.spec.ts`
- Create: `playwright/tests/stories.spec.ts`

- [ ] **Step 1: Create engagement.spec.ts**

```ts
// playwright/tests/engagement.spec.ts
import { test, expect } from "@playwright/test";

test("home shows streak + level + daily ring", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/días|sin racha/i)).toBeVisible();
  await expect(page.getByText(/Meta diaria/i)).toBeVisible();
});

test("stats: heatmap renders", async ({ page }) => {
  await page.goto("/stats");
  await expect(page.getByText(/Heatmap/i)).toBeVisible();
});

test("achievements: grid shows 18+ rules", async ({ page }) => {
  await page.goto("/achievements");
  await expect(page.getByText(/de \d+ desbloqueados/i)).toBeVisible();
});

test("diagnostic: take test", async ({ page }) => {
  await page.goto("/diagnostic");
  await expect(page.getByText(/Pregunta 1 de 20/i)).toBeVisible();
  for (let i = 0; i < 20; i++) {
    await page.locator("button").first().click();
  }
  await expect(page.getByText(/Resultados/i)).toBeVisible();
  await expect(page.getByText(/Recomendación/i)).toBeVisible();
});
```

- [ ] **Step 2: Create vocab.spec.ts**

```ts
// playwright/tests/vocab.spec.ts
import { test, expect } from "@playwright/test";

test("vocab drill: page loads and shows cards", async ({ page }) => {
  await page.goto("/drill/vocab");
  // Wait for either loading or content
  await expect(page.locator("body")).toBeVisible();
});
```

- [ ] **Step 3: Create stories.spec.ts**

```ts
// playwright/tests/stories.spec.ts
import { test, expect } from "@playwright/test";

test("stories: grid shows stories", async ({ page }) => {
  await page.goto("/stories");
  await expect(page.getByText(/Histórias/i)).toBeVisible();
  await expect(page.getByText(/Bloque 1/i)).toBeVisible();
});

test("story: vocab click plays audio", async ({ page }) => {
  await page.goto("/stories");
  const firstStory = page.getByRole("link", { name: /B[0-9]/ }).first();
  await firstStory.click();
  await expect(page.getByRole("button", { name: /play .+/i }).first()).toBeVisible();
});
```

- [ ] **Step 4: Run e2e**

```bash
cd /Users/lalo/idiomas/portugues-app
npx playwright test
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add playwright/tests/
git commit -m "test(e2e): engagement, vocab, stories specs"
```

---

### Task 36: Final commit + tag + push

**Files:** none

- [ ] **Step 1: Final commit (empty marker)**

```bash
git add -A
git status
# If changes:
git commit --allow-empty -m "feat(ui): MVP #3 — engagement (stories + gamification + stats + diagnostic)"
```

- [ ] **Step 2: Tag**

```bash
git tag -a mvp-3-engagement -m "MVP #3: Stories (no karaoke) + Streak + XP/Levels + Achievements + Stats + Diagnostic"
```

- [ ] **Step 3: Push**

```bash
git push origin main
git push origin mvp-3-engagement
```

Expected: origin receives 3 commits (final) + tag.

---

## Done — what you have now

- **20 mini-historias** (1-2 per block × 10 blocks) con audio BR + PT + vocab sidebar clickeable
- **Vocab catalog** global derivado de las stories
- **Streak** tracking con anillos visuales (currentStreak + todayMinutes)
- **Daily goal ring** con progress circular
- **XP system** con levels cuadráticos (100·n²)
- **21 achievements** derivados de data
- **Stats dashboard** con heatmap 365d + 4 grupos de charts (línea tiempo, accuracy/bloque, mastery/concepto, FSRS+BR/PT)
- **Diagnostic test** opt-in con recommendation algorithm
- **Home dashboard** rehecho con streak, XP/level, anillos, story del bloque, continue card
- **Vocab drill** usando ExerciseRunner

### What's deferred to Plan #4+
- Karaoke-style highlight (decidido no incluir)
- Shadowing mode (con record + audio compare)
- Generación masiva de bloques 4-10 con contenido nuevo (no solo stories)
- Achievements custom por usuario
- Social features


---

---
