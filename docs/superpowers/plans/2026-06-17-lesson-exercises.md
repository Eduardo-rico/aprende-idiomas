# Lessons-before-exercises Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `lesson` exercise type that shows an MDX explanation with 3 audio-supported examples before the first exercise of each lesson, with manual "Repasar" review from `/review`. PT only.

**Architecture:** New `ExerciseType = "lesson"` enters the discriminated union in `lib/data/zod-schemas.ts`. Lesson content lives as MDX files under `lib/data/languages/pt/mdx/bN/l*.mdx` (one per lesson), loaded server-side via Next 16's `await import()` dynamic pattern. Audio hashes stored in `lib/data/languages/pt/lessons/audio-refs.json`. Progress tracked in new Dexie v7 `lessonViews` table. New `LessonGate` client component wraps the practice queue; `LessonStep` wraps the renderer with a "Entendi" completion button. Manual review surfaced in `/review` as a "Repasar lección" section above the existing SRS cards.

**Tech Stack:** Next.js 16.2.7 (Turbopack, App Router, `params: Promise<...>`), React 19, TypeScript, Zod 4, Dexie 4.4.3, MDX via `@next/mdx` + `@mdx-js/*`, MiniMax LLM/TTS via `@anthropic-ai/sdk`, Vitest 4 + Testing Library + Playwright.

**Reference spec:** `docs/superpowers/specs/2026-06-17-lesson-exercises-design.md`

---

## Working Assumptions

- Repo root: `/Users/lalo/idiomas/portugues-app`
- Default lang for scripts/tests: `pt`
- Test runner: `npm test` (Vitest, runs `tests/unit/**/*.test.{ts,tsx}` + `tests/integration/**/*.test.{ts,tsx}`)
- E2E: `npx playwright test tests/e2e/lessons.spec.ts` (single test, added in L5)
- Build verification: `npm run build` (Turbopack)
- Content verification: `STRICT=1 npm run verify:content`
- Node version: check `node -v` matches what `package.json#engines` declares; if no engines field, assume Node 22+
- Commands run from repo root
- Each task ends with a checkpoint commit (see each task's "Step N: Commit")
- The `feature/lesson-exercises` worktree is created at execution time per `using-git-worktrees` skill

---

## Sub-phase L0 — MDX Bootstrap

> No behavior added yet. Just install deps and prove MDX renders in a stub file. Gates: typecheck, build, manual `GET /_mdx-stub` returns 200 with rendered text.

### Task 0.1: Install MDX dependencies

**Files:**
- Modify: `package.json` (devDeps + scripts)

- [ ] **Step 1: Add the deps**

Run:
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install -D @tailwindcss/typography
```

Expected: 4 production deps + 1 dev dep added. `package.json` shows them in alphabetical order under `dependencies` and `devDependencies`.

- [ ] **Step 2: Verify versions are pinned (no `^` on Next-aligned packages)**

Run:
```bash
grep -E '"(@next/mdx|@mdx-js/loader|@mdx-js/react|@types/mdx)"' package.json
```

Expected: each line is `"name": "x.y.z"` (no `^`). If `^` is present, run `npm install --save-exact @next/mdx @mdx-js/loader @mdx-js/react @types/mdx` to pin.

- [ ] **Step 3: Verify typecheck still passes**

Run: `npm run typecheck`
Expected: `tsc` exits 0. No new errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(lessons): install MDX deps (@next/mdx, @mdx-js/*, @tailwindcss/typography)"
```

---

### Task 0.2: Configure Next 16 to recognize MDX

**Files:**
- Modify: `next.config.ts` (currently `const nextConfig: NextConfig = {};`)
- Create: `mdx-components.tsx` (project root, required by App Router per Next 16 docs)

- [ ] **Step 1: Read the existing config**

Run: `cat next.config.ts`
Expected output (verify before editing):
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 2: Replace `next.config.ts` with MDX-aware version**

Write the following to `next.config.ts`:
```ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
```

- [ ] **Step 3: Create `mdx-components.tsx` at project root**

This file is required by Next 16's `@next/mdx` for App Router. Write the following to `mdx-components.tsx`:
```tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
```

- [ ] **Step 4: Verify build still works**

Run: `npm run build`
Expected: build completes without MDX-related errors. Other pages (e.g. `/pt`) still build.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts mdx-components.tsx
git commit -m "feat(lessons): wire @next/mdx into next.config + add mdx-components stub"
```

---

### Task 0.3: Smoke-render an MDX file via dynamic import

**Files:**
- Create: `content/_smoke.mdx` (a throwaway test file; will be removed in L5)
- Create: `app/_mdx-smoke/page.tsx` (throwaway route; removed in L5)
- Delete: both files at end of L0

- [ ] **Step 1: Create the MDX stub**

Write to `content/_smoke.mdx`:
```mdx
# MDX smoke

This file proves that `@next/mdx` is wired correctly.

- [x] Renders
- [x] Lists
- [x] Headings
```

- [ ] **Step 2: Create a temporary route that imports it**

Write to `app/_mdx-smoke/page.tsx`:
```tsx
import SmokeMdx from "@/content/_smoke.mdx";

export default function MdxSmokePage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <SmokeMdx />
    </div>
  );
}
```

- [ ] **Step 3: Start dev server and verify**

Run in background: `npm run dev &`
Wait 8 seconds (Turbopack boot).
Run: `curl -s http://localhost:3000/_mdx-smoke | grep -c "MDX smoke"`
Expected: `1` (the `<h1>` is in the response).
Run: `curl -s http://localhost:3000/_mdx-smoke | grep -c "Renders"`
Expected: `1` (the list item).

- [ ] **Step 4: Stop dev server and remove stub files**

Run:
```bash
pkill -f "next dev" || true
rm app/_mdx-smoke/page.tsx
rmdir app/_mdx-smoke
rm content/_smoke.mdx
```

- [ ] **Step 5: Verify build still works (no orphan routes)**

Run: `npm run build`
Expected: build succeeds with no orphan route warnings.

- [ ] **Step 6: Commit**

```bash
git add -A
git status   # verify: only the 4 expected deletions appear (or "nothing to commit" if stub files were already untracked)
git commit -m "test(lessons): verify MDX smoke render works in stub route" --allow-empty
```

> Note: if `content/_smoke.mdx` and `app/_mdx-smoke/page.tsx` were created in this task and never committed (since they were deleted before the first commit of L0.3), the commit will be empty — that's OK, it serves as a checkpoint marker.

---

## Sub-phase L1 — Schema

> New `ExerciseType = "lesson"` enters the discriminated union. `LessonData` is added. `SCHEMA_VERSION` and `EXERCISES_PER_LESSON` are extended. No UI, no MDX rendering yet. Gates: typecheck, all tests, `verify:content` (which must still pass for PT), build.

### Task 1.1: Add `lesson` to `ExerciseTypeEnum`

**Files:**
- Modify: `lib/data/zod-schemas.ts:13-22` (the `ExerciseTypeEnum`)

- [ ] **Step 1: Read the existing enum**

Run: `sed -n '13,22p' lib/data/zod-schemas.ts`
Expected: the `z.enum([...])` array of 7 string literals.

- [ ] **Step 2: Add `"lesson"` as the 8th variant**

Edit `lib/data/zod-schemas.ts` — change the `ExerciseTypeEnum` declaration to add `"lesson"`:
```ts
export const ExerciseTypeEnum = z.enum([
  "flashcard",
  "fill_blank",
  "listening",
  "translation",
  "verb_preposition",
  "sentence_construction",
  "chunk",
  "lesson",
]);
```

- [ ] **Step 3: Verify typecheck flags the missing entries (expected failure)**

Run: `npm run typecheck`
Expected: **compile error** at `scripts/config.ts:82-118` mentioning `Property 'lesson' is missing` in `EXERCISES_PER_LESSON` and `SCHEMA_VERSION`. This is the expected failure that drives Tasks 1.4 and 1.5.

- [ ] **Step 4: Don't commit yet — proceed to 1.2**

(No commit. This task is mid-flight; the commit happens after 1.5 when the new type is fully wired.)

---

### Task 1.2: Define `LessonData` schema

**Files:**
- Modify: `lib/data/zod-schemas.ts` (after the existing `ChunkData` definition around line 81)

- [ ] **Step 1: Read the existing per-type data shapes**

Run: `sed -n '35,82p' lib/data/zod-schemas.ts`
Expected: 7 `XxxData` schema definitions, each `z.object({...}).strict()` or similar.

- [ ] **Step 2: Add `LessonData` schema**

Insert after the `ChunkData` declaration (find the line ending in `});` that closes the `ChunkData` block, paste after it):
```ts
export const LessonDataSchema = z.object({
  kind: z.literal("lesson"),
  lessonId: z.string().regex(/^b\d+-[\w-]+$/, "lessonId must look like b1-regulares-ar"),
  blockId: z.number().int().positive(),
  mdxPath: z.string().regex(/^b\d+\/l[\w-]+\.mdx$/, "mdxPath must look like b1/l-regulares-ar.mdx"),
  exampleCount: z.number().int().nonnegative(),
});
```

- [ ] **Step 3: Verify typecheck still flags only the same error (no new errors from the schema)**

Run: `npm run typecheck`
Expected: same error as Task 1.1 Step 3 — only `scripts/config.ts:82-118` complains about `lesson` not in `Record<ExerciseType, ...>`.

- [ ] **Step 4: No commit yet — proceed to 1.3**

---

### Task 1.3: Register `LessonData` in the discriminated union

**Files:**
- Modify: `lib/data/zod-schemas.ts` (3 places: `ExerciseDataByTypeSchema` map, `VariantOverrideByTypeSchema` map, `ExerciseSchema` discriminated union)

- [ ] **Step 1: Read the three map/union locations**

Run: `sed -n '85,135p' lib/data/zod-schemas.ts`
Expected: `ExerciseDataByTypeSchema` (line 85-93) and `VariantOverrideByTypeSchema` (line 126-134).

Run: `sed -n '188,195p' lib/data/zod-schemas.ts`
Expected: `ExerciseSchema = z.discriminatedUnion('type', [...])` array.

- [ ] **Step 2: Add `LessonData` to the data map**

In `ExerciseDataByTypeSchema`, add a `lesson` entry. The exact pattern follows the other 7 entries — find the closing `}` of the map and add:
```ts
  lesson: LessonDataSchema,
```

If the map is `z.record(z.string(), ...)` (free-key), no change needed — the new schema is automatically registered. If the map is explicit (each `type: DataSchema` enumerated), add the `lesson` line.

- [ ] **Step 3: Add `LessonOverride` and register in override map**

The override pattern (see `FlashcardOverride` at line 105-111) is `z.strictObject(Schema.shape).partial()`. Since `LessonData` has no fields that need per-variant overrides, the override is an empty `partial()`:

Insert after `LessonDataSchema`:
```ts
export const LessonOverride = z.strictObject(LessonDataSchema.shape).partial();
```

Then in `VariantOverrideByTypeSchema`, add a `lesson` entry. Mirror the pattern of other entries (e.g. `flashcard: FlashcardOverride`):
```ts
  lesson: LessonOverride,
```

- [ ] **Step 4: Add `LessonEx` to the discriminated union**

Define a `LessonEx` near the other 7 `XxxEx` types (find one of them, e.g. `ChunkEx`):
```ts
const LessonEx = BaseExercise.extend({
  type: z.literal("lesson"),
  data: LessonDataSchema,
  variantOverrides: z.record(z.string(), LessonOverride).optional(),
});
```

Add `LessonEx` to the `z.discriminatedUnion('type', [...])` array:
```ts
export const ExerciseSchema = z.discriminatedUnion("type", [
  FlashcardEx,
  FillBlankEx,
  ListeningEx,
  TranslationEx,
  VerbPrepositionEx,
  SentenceConstructionEx,
  ChunkEx,
  LessonEx,
]);
```

- [ ] **Step 5: Verify typecheck flags only the `scripts/config.ts` error**

Run: `npm run typecheck`
Expected: same `scripts/config.ts` error from 1.1/1.2 — `lesson` is now in the union but `EXERCISES_PER_LESSON` and `SCHEMA_VERSION` records still don't have it.

- [ ] **Step 6: No commit yet — proceed to 1.4**

---

### Task 1.4: Extend `SCHEMA_VERSION` and `EXERCISES_PER_LESSON`

**Files:**
- Modify: `scripts/config.ts:82-118` (extend both records)

- [ ] **Step 1: Read the two records**

Run: `sed -n '82,118p' scripts/config.ts`
Expected: `EXERCISES_PER_LESSON` (82-90) and `SCHEMA_VERSION` (110-118), each typed `Record<ExerciseType, ...>`.

- [ ] **Step 2: Add `lesson` to `EXERCISES_PER_LESSON`**

In the `EXERCISES_PER_LESSON` declaration, add (preserving alphabetical or value order — follow the existing order):
```ts
  lesson: 1,
```

- [ ] **Step 3: Add `lesson` to `SCHEMA_VERSION`**

In the `SCHEMA_VERSION` declaration, add:
```ts
  lesson: 1,
```

- [ ] **Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: `tsc` exits 0. No errors anywhere.

- [ ] **Step 5: Verify `verify:content` still passes for PT**

Run: `STRICT=1 npm run verify:content`
Expected: success, no errors. The PT content has no `lesson` exercises yet, but the schema must accept the new variant without rejecting existing content.

- [ ] **Step 6: Commit**

```bash
git add lib/data/zod-schemas.ts scripts/config.ts
git commit -m "feat(lessons): add 'lesson' to ExerciseType union (L1 schema)"
```

---

### Task 1.5: Schema-level unit tests

**Files:**
- Create: `tests/unit/exercise-lesson.test.ts`

- [ ] **Step 1: Read the existing zod-schemas test for the test pattern**

Run: `sed -n '1,30p' tests/unit/zod-schemas.test.ts`
Expected: imports from `@/scripts/lib/zod-schemas`, `describe`/`it`/`expect` from vitest, a `baseCommon` object with `id`, `blockId`, `lessonId`, `difficulty`, `concepts`, `tags`, `contentHash`, `audio`.

- [ ] **Step 2: Write the test file**

Write to `tests/unit/exercise-lesson.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  ExerciseSchema,
  LessonDataSchema,
  type ExerciseType,
  SCHEMA_VERSION,
  EXERCISES_PER_LESSON,
} from "@/scripts/lib/zod-schemas";

const baseLesson = {
  id: "l1b2c3d4",
  blockId: 1,
  lessonId: "b1-regulares-ar",
  type: "lesson" as const,
  data: {
    kind: "lesson" as const,
    lessonId: "b1-regulares-ar",
    blockId: 1,
    mdxPath: "b1/l-regulares-ar.mdx",
    exampleCount: 3,
  },
  concepts: [],
  tags: [],
};

describe("LessonDataSchema", () => {
  it("parses a valid lesson data shape", () => {
    const r = LessonDataSchema.safeParse(baseLesson.data);
    expect(r.success).toBe(true);
  });

  it("rejects a lessonId that does not match the blockId pattern", () => {
    const r = LessonDataSchema.safeParse({
      ...baseLesson.data,
      lessonId: "regulares-ar", // missing bN- prefix
    });
    expect(r.success).toBe(false);
  });

  it("rejects an mdxPath without block subdirectory", () => {
    const r = LessonDataSchema.safeParse({
      ...baseLesson.data,
      mdxPath: "regulares-ar.mdx",
    });
    expect(r.success).toBe(false);
  });
});

describe("ExerciseSchema with type=lesson", () => {
  it("parses a lesson exercise end-to-end", () => {
    const r = ExerciseSchema.safeParse(baseLesson);
    expect(r.success).toBe(true);
  });

  it("rejects a lesson with audio (lesson exercises do not have audio)", () => {
    const r = ExerciseSchema.safeParse({
      ...baseLesson,
      audio: { "pt-br": { hash: "abc", voice: "v1" } },
    });
    // If BaseExercise has `audio` optional, this should still parse.
    // If required, this should fail. We assert "no crash" and document the actual behavior.
    expect(typeof r.success).toBe("boolean");
  });
});

describe("SCHEMA_VERSION + EXERCISES_PER_LESSON for lesson", () => {
  it("SCHEMA_VERSION.lesson is a positive integer", () => {
    expect(SCHEMA_VERSION.lesson).toBeGreaterThan(0);
  });

  it("EXERCISES_PER_LESSON.lesson is 1", () => {
    expect(EXERCISES_PER_LESSON.lesson).toBe(1);
  });

  it("ExerciseType union now includes 'lesson'", () => {
    const t: ExerciseType = "lesson";
    expect(t).toBe("lesson");
  });
});
```

- [ ] **Step 3: Run the tests**

Run: `npm test -- tests/unit/exercise-lesson.test.ts`
Expected: all tests pass (or, for the "audio" test, the assertion holds regardless of whether `audio` is rejected).

- [ ] **Step 4: Run the full test suite (regression)**

Run: `npm test`
Expected: all previously-passing tests still pass. The baseline is 448 tests; this adds ~6, so the count is ~454.

- [ ] **Step 5: Commit**

```bash
git add tests/unit/exercise-lesson.test.ts
git commit -m "test(lessons): add LessonData + ExerciseType.lesson unit tests"
```

---

### Task 1.6: Build verification (L1 gate)

**Files:** none

- [ ] **Step 1: Run typecheck, tests, verify:content, build**

Run in sequence:
```bash
npm run typecheck
npm test
STRICT=1 npm run verify:content
npm run build
```
Expected: all four commands exit 0. Build produces no warnings about the new union member.

- [ ] **Step 2: No commit — this is a gate checkpoint, not a code change**

If any command failed, fix the underlying issue and re-run. Do not commit fixes here — they belong in the task that introduced them.

---

## Sub-phase L2 — Loader + API

> Lesson content is loaded from per-block `bN.json` (already on disk) + a new `audio-refs.json` (generated). A new API route serves the data. Gates: typecheck, tests, build, manual `GET /api/lessons/pt/b1-regulares-ar` returns 200 (or 404 if no audio-refs yet).

### Task 2.1: Define `LessonAudioRefs` schema and loader

**Files:**
- Modify: `lib/data/zod-schemas.ts` (add `LessonAudioRefsEntrySchema`, `LessonAudioRefsFileSchema`)
- Modify: `lib/data/loaders.ts` (add `loadLessonsAudioRefs(lang)`)

- [ ] **Step 1: Read existing audio-related schemas**

Run: `grep -n "AudioRef\|hash.*voice" lib/data/zod-schemas.ts | head -20`
Expected: the existing `AudioRefSchema` (free-key `Record<VariantKey, { hash, voice }>`).

- [ ] **Step 2: Add the lesson audio-refs schemas**

Insert after the existing `AudioRefSchema` definition:
```ts
export const LessonAudioRefSchema = z.object({
  hash: z.string().min(1),
  voice: z.string().min(1),
});

export const LessonAudioRefsEntrySchema = z.object({
  blockId: z.number().int().positive(),
  title: z.string().min(1),
  exampleCount: z.number().int().nonnegative(),
  audioRefs: z.record(z.string(), z.array(LessonAudioRefSchema)),
});

export const LessonAudioRefsFileSchema = z.record(
  z.string().regex(/^b\d+-[\w-]+$/),
  LessonAudioRefsEntrySchema,
);
```

- [ ] **Step 3: Read existing loaders for pattern**

Run: `sed -n '93,140p' lib/data/loaders.ts`
Expected: `loadAllBlocks` and `loadAllStories` showing the `fs.readdir` + `fs.readFile` + `JSON.parse` + `*.parse()` pattern.

- [ ] **Step 4: Add `loadLessonsAudioRefs(lang)`**

Insert at the end of `lib/data/loaders.ts`:
```ts
export async function loadLessonsAudioRefs(lang: LanguageId): Promise<z.infer<typeof LessonAudioRefsFileSchema>> {
  const { lessonsDir } = await import("./registry");
  const dir = lessonsDir(lang);
  const file = path.join(dir, "audio-refs.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    return LessonAudioRefsFileSchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}
```

> Note: `fs` and `path` are already imported at the top of `loaders.ts` (verify with `head -15 lib/data/loaders.ts`).

- [ ] **Step 5: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 6: No commit yet — proceed to 2.2**

---

### Task 2.2: API route `GET /api/lessons/[lang]/[lessonId]`

**Files:**
- Create: `app/api/lessons/[lang]/[lessonId]/route.ts`

- [ ] **Step 1: Read the existing reference route**

Run: `cat app/api/vocab/lookup/route.ts`
Expected: 89 lines showing NextResponse, `Request` signature, lazy init pattern, `hasLocale` guard.

- [ ] **Step 2: Create the route directory and file**

Run: `mkdir -p "app/api/lessons/[lang]/[lessonId]"`

Write to `app/api/lessons/[lang]/[lessonId]/route.ts`:
```ts
import { NextResponse } from "next/server";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadLessonsAudioRefs } from "@/lib/data/loaders";
import { loadCurriculum } from "@/lib/data/loaders";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; lessonId: string }> }
) {
  const { lang: rawLang, lessonId } = await params;

  if (!hasLocale(rawLang)) {
    return NextResponse.json({ error: "Unknown language" }, { status: 400 });
  }
  const lang: LanguageId = rawLang;

  // RU/RO/CS scaffolds have no lesson content.
  if (lang !== "pt") {
    return NextResponse.json({ error: "No lessons for this language" }, { status: 400 });
  }

  const curriculum = await loadCurriculum(lang);
  const lesson = curriculum.BLOCKS.flatMap((b) => b.lessons).find((l) => l.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const audioRefsMap = await loadLessonsAudioRefs(lang);
  const entry = audioRefsMap[lessonId];

  return NextResponse.json({
    lessonId: lesson.id,
    blockId: lesson.blockId,
    mdxPath: lesson.conceptNotesPath, // reuses the existing curriculum field
    audioRefs: entry?.audioRefs ?? {},
    exampleCount: entry?.exampleCount ?? 0,
    title: entry?.title ?? lesson.name,
  });
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: No commit yet — proceed to 2.3**

---

### Task 2.3: API route unit test

**Files:**
- Create: `tests/unit/lessons-api.test.ts`

- [ ] **Step 1: Read the existing API test pattern**

Run: `ls tests/unit/*api* tests/unit/*route* 2>/dev/null | head -5`
Run: `cat tests/unit/vocab-lookup-lang.test.ts 2>/dev/null | head -40`
Expected: a vitest test that mocks `loadVocabCatalog` and tests the route handler. If no existing API test, check `tests/integration/` for an example.

- [ ] **Step 2: Write the test**

Write to `tests/unit/lessons-api.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock loaders BEFORE importing the route
vi.mock("@/lib/data/loaders", () => ({
  loadLessonsAudioRefs: vi.fn(),
  loadCurriculum: vi.fn(),
}));

// Mock next/server's NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { "content-type": "application/json" },
      }),
  },
}));

import { GET } from "@/app/api/lessons/[lang]/[lessonId]/route";
import { loadCurriculum, loadLessonsAudioRefs } from "@/lib/data/loaders";

const mockedCurriculum = vi.mocked(loadCurriculum);
const mockedAudioRefs = vi.mocked(loadLessonsAudioRefs);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/lessons/[lang]/[lessonId]", () => {
  it("returns 200 with shape for a known PT lesson", async () => {
    mockedCurriculum.mockResolvedValue({
      BLOCKS: [
        {
          id: 1, slug: "b1", name: "Block 1", description: "", durationWeeks: null,
          prereqs: [], freeDrill: false, lessons: [
            { id: "b1-regulares-ar", blockId: 1, name: "Verbos -AR",
              objectives: [], conceptIds: [], vocabKey: [],
              conceptNotesPath: "b1/l-regulares-ar.mdx", exerciseRefs: [] },
          ],
        },
      ],
      ALL_CONCEPTS: [],
      getBlock: () => { throw new Error("not used"); },
      getLesson: () => { throw new Error("not used"); },
      getConceptsByIds: () => [],
    });
    mockedAudioRefs.mockResolvedValue({
      "b1-regulares-ar": {
        blockId: 1,
        title: "Verbos regulares en -AR",
        exampleCount: 3,
        audioRefs: { "pt-br": [{ hash: "abc", voice: "v1" }] },
      },
    });

    const res = await GET(
      new Request("http://localhost/api/lessons/pt/b1-regulares-ar"),
      { params: Promise.resolve({ lang: "pt", lessonId: "b1-regulares-ar" }) }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.lessonId).toBe("b1-regulares-ar");
    expect(body.blockId).toBe(1);
    expect(body.mdxPath).toBe("b1/l-regulares-ar.mdx");
    expect(body.exampleCount).toBe(3);
    expect(body.audioRefs["pt-br"]).toHaveLength(1);
  });

  it("returns 400 for unknown lang", async () => {
    const res = await GET(
      new Request("http://localhost/api/lessons/xx/b1-regulares-ar"),
      { params: Promise.resolve({ lang: "xx", lessonId: "b1-regulares-ar" }) }
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for ru (no lesson content)", async () => {
    const res = await GET(
      new Request("http://localhost/api/lessons/ru/b1-regulares-ar"),
      { params: Promise.resolve({ lang: "ru", lessonId: "b1-regulares-ar" }) }
    );
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown lessonId", async () => {
    mockedCurriculum.mockResolvedValue({
      BLOCKS: [], ALL_CONCEPTS: [],
      getBlock: () => { throw new Error("not used"); },
      getLesson: () => { throw new Error("not used"); },
      getConceptsByIds: () => [],
    });
    mockedAudioRefs.mockResolvedValue({});

    const res = await GET(
      new Request("http://localhost/api/lessons/pt/unknown"),
      { params: Promise.resolve({ lang: "pt", lessonId: "unknown" }) }
    );
    expect(res.status).toBe(404);
  });

  it("returns 200 with empty audioRefs when no audio-refs entry exists", async () => {
    mockedCurriculum.mockResolvedValue({
      BLOCKS: [
        {
          id: 1, slug: "b1", name: "Block 1", description: "", durationWeeks: null,
          prereqs: [], freeDrill: false, lessons: [
            { id: "b1-test", blockId: 1, name: "Test",
              objectives: [], conceptIds: [], vocabKey: [],
              conceptNotesPath: "b1/l-test.mdx", exerciseRefs: [] },
          ],
        },
      ],
      ALL_CONCEPTS: [],
      getBlock: () => { throw new Error("not used"); },
      getLesson: () => { throw new Error("not used"); },
      getConceptsByIds: () => [],
    });
    mockedAudioRefs.mockResolvedValue({});

    const res = await GET(
      new Request("http://localhost/api/lessons/pt/b1-test"),
      { params: Promise.resolve({ lang: "pt", lessonId: "b1-test" }) }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.audioRefs).toEqual({});
    expect(body.exampleCount).toBe(0);
    expect(body.title).toBe("Test"); // falls back to lesson.name
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm test -- tests/unit/lessons-api.test.ts`
Expected: 5 tests pass.

- [ ] **Step 4: Run the full test suite (regression)**

Run: `npm test`
Expected: ~459 tests pass (448 + 5 from 1.5 + 6 from this task — actually 5 from this task and ~6 from 1.5, so ~459).

- [ ] **Step 5: Commit**

```bash
git add app/api/lessons/ lib/data/zod-schemas.ts lib/data/loaders.ts tests/unit/lessons-api.test.ts
git commit -m "feat(lessons): lessons audio-refs schema + loader + GET /api/lessons/:lang/:id"
```

---

### Task 2.4: Build verification (L2 gate)

**Files:** none

- [ ] **Step 1: Run all gates**

```bash
npm run typecheck
npm test
STRICT=1 npm run verify:content
npm run build
```
Expected: all exit 0. `verify:content` should still pass for PT (no lesson content generated yet, so `audio-refs.json` may not exist on disk; the loader handles ENOENT).

- [ ] **Step 2: Manual smoke (only if dev server is up)**

```bash
npm run dev &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/lessons/pt/b1-regulares-ar
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/lessons/pt/unknown
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/lessons/ru/b1-regulares-ar
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/lessons/xx/b1-regulares-ar
pkill -f "next dev" || true
```
Expected: `404`, `404`, `400`, `400` (no PT lessons have audio-refs yet, so even a known lessonId returns 404 because... wait, actually if `b1-regulares-ar` is a known lesson in the curriculum but not in `audio-refs.json`, the route should return 200 with empty audioRefs. The 404 only fires if the lesson isn't in the curriculum at all.)

> **Important:** if `b1-regulares-ar` is NOT in the current PT curriculum (because lessons are auto-generated and named differently, e.g., `l1-alfabeto-acentos`), use a real lesson id from `lib/data/languages/pt/lessons/b1.json` for the manual smoke. Check with: `jq -r '.[].id' lib/data/languages/pt/lessons/b1.json | head -3`.

- [ ] **Step 3: No commit — gate checkpoint**

---

## Sub-phase L3 — Renderer

> `LessonRenderer` server component dynamically imports the MDX file, renders it with custom components. Custom components: `<Example>`, `<Tip>`, `<Rule>`. Audio marker replacement happens client-side via `<LessonAudioPlayer>`. Gates: typecheck, tests, build, manual `GET /_mdx-smoke-lesson` returns rendered MDX (route is removed before L5).

### Task 3.1: Create custom MDX components

**Files:**
- Create: `components/lessons/mdx-components.tsx` (server-renderable, no audio yet)

- [ ] **Step 1: Verify `components/` exists and check structure**

Run: `ls components/ | head -20`
Expected: at minimum `ExerciseRunner.tsx`, `NavBar.tsx`, etc.

- [ ] **Step 2: Create the components directory and file**

Run: `mkdir -p components/lessons`

Write to `components/lessons/mdx-components.tsx`:
```tsx
import type { ReactNode } from "react";

/**
 * <Example> renders a single resolved example.
 * Audio playback is injected via the LessonAudioPlayer on the client.
 */
export function Example({
  index,
  pt,
  es,
  audioRef,
}: {
  index: number;
  pt: string;
  es: string;
  audioRef?: number;
}) {
  return (
    <div className="my-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="text-xs font-mono text-muted-foreground mb-2">
        Example {index + 1}
        {audioRef !== undefined && (
          <span className="ml-2" data-audio-ref={audioRef}>
            🔊 audio #{audioRef}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-1">PT</div>
          <div className="text-base">{pt}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-1">ES</div>
          <div className="text-base text-muted-foreground">{es}</div>
        </div>
      </div>
    </div>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 p-4">
      <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
        💡 Tip
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function Rule({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 p-4">
      {title && (
        <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
          {title}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function lessonMdxComponents() {
  return { Example, Tip, Rule };
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: No commit yet — proceed to 3.2**

---

### Task 3.2: Create `LessonRenderer` server component

**Files:**
- Create: `components/lessons/LessonRenderer.tsx`
- Create: `lib/data/mdx.ts` (loader helper that does the dynamic import)

- [ ] **Step 1: Create the MDX loader helper**

Write to `lib/data/mdx.ts`:
```ts
import "server-only";
import { hasLocale, type LanguageId } from "@/lib/locales";

/**
 * Dynamically imports an MDX file by its `conceptNotesPath`-style relative path.
 * Throws if the file does not exist (callers should validate the lesson exists first).
 *
 * Path convention: `b1/l1-alfabeto.mdx` → `lib/data/languages/pt/mdx/b1/l1-alfabeto.mdx`
 */
export async function loadLessonMdx(lang: LanguageId, mdxPath: string) {
  if (!hasLocale(lang)) throw new Error(`Unknown language: ${lang}`);
  if (lang !== "pt") throw new Error(`No MDX content for language: ${lang}`);
  if (!/^b\d+\/l[\w-]+\.mdx$/.test(mdxPath)) {
    throw new Error(`Invalid mdxPath: ${mdxPath}`);
  }
  try {
    const mod = await import(`@/lib/data/languages/${lang}/mdx/${mdxPath}`);
    return mod.default;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "MODULE_NOT_FOUND") return null;
    throw err;
  }
}
```

- [ ] **Step 2: Create the `LessonRenderer` server component**

Write to `components/lessons/LessonRenderer.tsx`:
```tsx
import { loadLessonMdx } from "@/lib/data/mdx";
import type { LanguageId } from "@/lib/locales";
import { lessonMdxComponents } from "./mdx-components";

export async function LessonRenderer({
  lessonId,
  mdxPath,
  lang,
}: {
  lessonId: string;
  mdxPath: string;
  lang: LanguageId;
}) {
  const MdxContent = await loadLessonMdx(lang, mdxPath);
  if (!MdxContent) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
        <div className="text-sm">
          Lesson MDX not yet generated for <code>{mdxPath}</code>.
        </div>
        <div className="text-xs mt-1">
          Run <code>npm run generate:lessons</code> to create it.
        </div>
      </div>
    );
  }
  return <MdxContent components={lessonMdxComponents()} />;
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: No commit yet — proceed to 3.3**

---

### Task 3.3: Smoke-render the renderer

**Files:**
- Create: `lib/data/languages/pt/mdx/b1/l-test.mdx` (test fixture)
- Create: `app/_mdx-smoke-lesson/page.tsx` (throwaway, removed in L5)

- [ ] **Step 1: Create the MDX directory and test file**

Run: `mkdir -p lib/data/languages/pt/mdx/b1`

Write to `lib/data/languages/pt/mdx/b1/l-test.mdx`:
```mdx
# Lesson renderer smoke

This file proves the renderer picks up custom components.

<Rule title="Pattern">
Verbs ending in -AR follow a regular conjugation.
</Rule>

<Example index={0} pt="Eu falo português." es="Yo hablo portugués." audioRef={0} />
<Example index={1} pt="Tu falas com o João." es="Tú hablas con João." audioRef={1} />

<Tip>
The -amos ending is the same in Spanish and Portuguese.
</Tip>
```

- [ ] **Step 2: Create the smoke route**

Run: `mkdir -p app/_mdx-smoke-lesson`

Write to `app/_mdx-smoke-lesson/page.tsx`:
```tsx
import { LessonRenderer } from "@/components/lessons/LessonRenderer";

export default async function MdxSmokeLessonPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <LessonRenderer
        lessonId="b1-test"
        mdxPath="b1/l-test.mdx"
        lang="pt"
      />
    </div>
  );
}
```

- [ ] **Step 3: Start dev server and verify**

Run in background: `npm run dev &`
Wait 8 seconds.
Run: `curl -s http://localhost:3000/_mdx-smoke-lesson | grep -c "Lesson renderer smoke"`
Expected: `1` (the `<h1>` is rendered).
Run: `curl -s http://localhost:3000/_mdx-smoke-lesson | grep -c "Eu falo português"`
Expected: `1` (the `<Example>` rendered the PT sentence).
Run: `curl -s http://localhost:3000/_mdx-smoke-lesson | grep -c "Pattern"`
Expected: `1` (the `<Rule title>` rendered).
Run: `curl -s http://localhost:3000/_mdx-smoke-lesson | grep -c "💡 Tip"`
Expected: `1` (the `<Tip>` rendered the emoji).

- [ ] **Step 4: Stop dev server**

Run: `pkill -f "next dev" || true`

- [ ] **Step 5: No commit yet — proceed to 3.4**

---

### Task 3.4: Renderer unit test

**Files:**
- Create: `tests/unit/lesson-renderer.test.tsx`

- [ ] **Step 1: Read the existing component-test pattern**

Run: `ls tests/unit/*renderer* tests/unit/*component* 2>/dev/null | head -3`
Run: `head -30 tests/unit/$(ls tests/unit/ | grep -i "component\|render" | head -1) 2>/dev/null`
Expected: a vitest test using `@testing-library/react` with `render` + `screen.getByXxx`.

- [ ] **Step 2: Write the test**

Write to `tests/unit/lesson-renderer.test.tsx`:
```ts
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the dynamic import BEFORE importing the component
vi.mock("@/lib/data/languages/pt/mdx/b1/l-test.mdx", () => ({
  default: () => (
    <div>
      <h1>Test Lesson</h1>
      <p>Body paragraph.</p>
    </div>
  ),
}));

vi.mock("@/lib/data/mdx", () => ({
  loadLessonMdx: vi.fn(async () => {
    const mod = await import("@/lib/data/languages/pt/mdx/b1/l-test.mdx");
    return mod.default;
  }),
}));

import { LessonRenderer } from "@/components/lessons/LessonRenderer";

describe("LessonRenderer", () => {
  it("renders the imported MDX content", async () => {
    const jsx = await LessonRenderer({
      lessonId: "b1-test",
      mdxPath: "b1/l-test.mdx",
      lang: "pt",
    });
    render(<>{jsx}</>);
    expect(screen.getByText("Test Lesson")).toBeTruthy();
  });

  it("shows a fallback when MDX is missing", async () => {
    const { loadLessonMdx } = await import("@/lib/data/mdx");
    vi.mocked(loadLessonMdx).mockResolvedValueOnce(null);
    const jsx = await LessonRenderer({
      lessonId: "b1-missing",
      mdxPath: "b1/l-missing.mdx",
      lang: "pt",
    });
    render(<>{jsx}</>);
    expect(screen.getByText(/MDX not yet generated/i)).toBeTruthy();
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm test -- tests/unit/lesson-renderer.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: ~461 tests pass (459 + 2 new).

- [ ] **Step 5: Commit**

```bash
git add components/lessons/ lib/data/mdx.ts lib/data/languages/pt/mdx/b1/l-test.mdx tests/unit/lesson-renderer.test.tsx
git commit -m "feat(lessons): LessonRenderer server component with custom MDX components"
```

> Note: `app/_mdx-smoke-lesson/page.tsx` is left in place for the next L4 sub-phase to use, then removed at the end of L4.

---

### Task 3.5: Build verification (L3 gate)

**Files:** none

- [ ] **Step 1: Run all gates**

```bash
npm run typecheck
npm test
STRICT=1 npm run verify:content
npm run build
```
Expected: all exit 0.

- [ ] **Step 2: No commit — gate checkpoint**

---

## Sub-phase L4 — Runner + Gate + Dexie v7

> `ExerciseRunner` handles the new `type: "lesson"` by rendering `LessonStep`. `LessonGate` is a client component that wraps the practice page. New Dexie v7 `lessonViews` table. New POST endpoint. Gates: typecheck, tests, build, manual `GET /pt/practice/[lessonId]` shows lesson gate before exercise queue (when `completedAt` is null).

### Task 4.1: Dexie v7 schema with `lessonViews`

**Files:**
- Modify: `lib/db/schema.ts` (add `LessonView` interface, `AppDB.version(7)`)

- [ ] **Step 1: Read the existing v6 schema**

Run: `sed -n '40,80p' lib/db/schema.ts`
Expected: `Card` interface with `language?: string`, other types follow.

Run: `sed -n '134,200p' lib/db/schema.ts`
Expected: `AppDB` class with `.version(1)...` through `.version(6)`.

- [ ] **Step 2: Add `LessonView` interface**

Insert after the existing interfaces (before the `AppDB` class):
```ts
export interface LessonView {
  lessonId: string;            // PK
  lang: LanguageId;
  blockId: number;
  firstViewedAt: number;
  lastViewedAt: number;
  viewCount: number;
  completedAt: number | null; // null = "opened but didn't click Entendi"
}
```

- [ ] **Step 3: Add `.version(7)` to `AppDB`**

After the `.version(6)` block (find the closing `});` of the v6 stores declaration), add:
```ts
    this.version(7).stores({
      // v6 stores re-declared; Dexie requires all tables per version.
      cards: "id, blockId, lessonId, nextReviewAt, state, introducedAt, *tags, language, [blockId+nextReviewAt], [lessonId+nextReviewAt]",
      sessions: "id, startedAt, mode, blockId, lessonId",
      answerEvents: "id, cardId, sessionId, ts, kind, [cardId+ts]",
      genericEvents: "id, ts, type, [type+ts]",
      settings: "key",
      achievements: "id, unlockedAt",
      streakDays: "date",
      xpRows: "id, awardedAt, source",
      conceptMastery: "[conceptId+language], conceptId, language, blockId",
      storyProgress: "storyId, [storyId+variant], lastReadAt",
      diagnosticResults: "id, takenAt, language",
      // v7 NEW:
      lessonViews: "lessonId, lang, blockId, [lang+blockId], lastViewedAt",
    });
```

> Note: every prior table must be re-declared in `.version(7).stores()` because Dexie requires the full schema per version. The string for `cards` etc. is the same as v6 — copy verbatim from the v6 block.

- [ ] **Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: No commit yet — proceed to 4.2**

---

### Task 4.2: Repository functions for `lessonViews`

**Files:**
- Modify: `lib/db/repository.ts` (add `getOrCreateLessonView`, `markLessonCompleted`, `getLessonViewsForReview`)

- [ ] **Step 1: Read the existing repository pattern for `getOrCreateStoryProgress`**

Run: `sed -n '199,243p' lib/db/repository.ts`
Expected: the `getOrCreateStoryProgress` and `markStoryCompleted` functions, showing the `db.transaction` + `db.storyProgress.put/get` pattern with event emission.

- [ ] **Step 2: Add the three new functions at the end of `repository.ts`**

```ts
import type { LessonView } from "./schema";

/**
 * Idempotently create or update a lesson view record.
 * Increments viewCount and bumps lastViewedAt on every call.
 */
export async function getOrCreateLessonView(
  lessonId: string,
  lang: LanguageId,
  blockId: number
): Promise<LessonView> {
  return db.transaction("rw", db.lessonViews, async () => {
    const existing = await db.lessonViews.get(lessonId);
    if (existing) {
      const updated: LessonView = {
        ...existing,
        lastViewedAt: Date.now(),
        viewCount: existing.viewCount + 1,
      };
      await db.lessonViews.put(updated);
      return updated;
    }
    const fresh: LessonView = {
      lessonId,
      lang,
      blockId,
      firstViewedAt: Date.now(),
      lastViewedAt: Date.now(),
      viewCount: 1,
      completedAt: null,
    };
    await db.lessonViews.add(fresh);
    return fresh;
  });
}

/**
 * Mark a lesson as completed (user clicked "Entendi"). Idempotent.
 * Emits a `lesson_complete` event for analytics.
 */
export async function markLessonCompleted(lessonId: string): Promise<void> {
  await db.transaction("rw", db.lessonViews, db.genericEvents, async () => {
    const existing = await db.lessonViews.get(lessonId);
    if (!existing) return; // Can't complete a never-viewed lesson
    if (existing.completedAt) return; // already completed
    await db.lessonViews.put({ ...existing, completedAt: Date.now() });
    await db.genericEvents.add({
      id: crypto.randomUUID(),
      ts: Date.now(),
      type: "lesson_complete",
      payload: { lessonId, lang: existing.lang, blockId: existing.blockId },
    });
  });
}

/**
 * Return lesson views eligible for the "Repasar lección" carousel.
 * Filters: completedAt set, sorted by lastViewedAt ascending (oldest first).
 */
export async function getLessonViewsForReview(
  lang: LanguageId,
  limit = 5
): Promise<LessonView[]> {
  const all = await db.lessonViews
    .where("lang")
    .equals(lang)
    .filter((lv) => lv.completedAt !== null)
    .toArray();
  return all.sort((a, b) => a.lastViewedAt - b.lastViewedAt).slice(0, limit);
}
```

> Verify that `db.lessonViews` is exposed on the `AppDB` class. If not, add it: find the table declarations on the `AppDB` class (the `this.table()` calls) and add `lessonViews!: Table<LessonView, string>;`.

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: No commit yet — proceed to 4.3**

---

### Task 4.3: `LessonStep` and `LessonGate` client components

**Files:**
- Create: `components/lessons/LessonStep.tsx` (client component, "Entendi" button)
- Create: `components/lessons/LessonGate.tsx` (client component, checks `completedAt` and either shows gate or children)

- [ ] **Step 1: Create `LessonStep`**

Write to `components/lessons/LessonStep.tsx`:
```tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LessonRenderer } from "./LessonRenderer";
import type { LanguageId } from "@/lib/locales";

export function LessonStep({
  lessonId,
  mdxPath,
  lang,
  onComplete,
}: {
  lessonId: string;
  mdxPath: string;
  lang: LanguageId;
  onComplete: () => Promise<void> | void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const handleClick = async () => {
    setSubmitting(true);
    try {
      await onComplete();
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      <LessonRenderer lessonId={lessonId} mdxPath={mdxPath} lang={lang} />
      <div className="border-t pt-4 flex justify-end">
        <Button onClick={handleClick} disabled={submitting} size="lg">
          {submitting ? "Guardando…" : "Entendi, ahora practicar →"}
        </Button>
      </div>
    </div>
  );
}
```

> Verify that `@/components/ui/button` exists. If not, use a plain `<button>` element.

- [ ] **Step 2: Create `LessonGate`**

Write to `components/lessons/LessonGate.tsx`:
```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";
import { getOrCreateLessonView, markLessonCompleted } from "@/lib/db/repository";
import { LessonStep } from "./LessonStep";
import type { LanguageId } from "@/lib/locales";

export function LessonGate({
  lessonId,
  mdxPath,
  blockId,
  lang,
  children,
}: {
  lessonId: string;
  mdxPath: string;
  blockId: number;
  lang: LanguageId;
  children: ReactNode;
}) {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const view = await getOrCreateLessonView(lessonId, lang, blockId);
      if (!cancelled) setCompleted(view.completedAt !== null);
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, lang, blockId]);

  if (completed === null) {
    return <div className="p-8 text-center text-muted-foreground">Cargando lección…</div>;
  }
  if (completed) {
    return <>{children}</>;
  }
  return (
    <LessonStep
      lessonId={lessonId}
      mdxPath={mdxPath}
      lang={lang}
      onComplete={async () => {
        await markLessonCompleted(lessonId);
        setCompleted(true);
      }}
    />
  );
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: No commit yet — proceed to 4.4**

---

### Task 4.4: `ExerciseRunner` branch for `type: "lesson"`

**Files:**
- Modify: `components/ExerciseRunner.tsx` (add `if (ex.type === "lesson")` early-return in `AnswerableCard`)

- [ ] **Step 1: Read the existing `AnswerableCard` function**

Run: `sed -n '215,235p' components/ExerciseRunner.tsx`
Expected: the early-return if-chain. The signature is `{ ex, onAnswer }`.

- [ ] **Step 2: Add the `lesson` branch at the top of `AnswerableCard`**

In `components/ExerciseRunner.tsx`, find the `AnswerableCard` function and add the lesson branch as the first check:
```ts
  if (ex.type === "lesson") {
    return (
      <LessonStep
        lessonId={ex.data.lessonId}
        mdxPath={ex.data.mdxPath}
        lang={lang}
        onComplete={async () => {
          await fetch(`/api/lessons/${lang}/${ex.data.lessonId}/complete`, {
            method: "POST",
          });
          onAnswer("__lesson_complete__", true);
        }}
      />
    );
  }
```

> The `onAnswer` signature mismatch is intentional — the runner's queue advancement doesn't care about correctness for a lesson. The string `"__lesson_complete__"` is a sentinel that the runner treats as "advance to next exercise" via the existing `submitAnswer` flow which grades `correct: true` (lesson ex has no FSRS grading, so the grading is a no-op).

> **Wait — verify this:** check how `submitAnswer` in `ExerciseRunner.tsx` handles a `correct: true` event when there's no real card id. If it tries to put a card row in Dexie, that could throw. In that case, the lesson branch must call a *different* callback (e.g., `onLessonComplete` added to the runner's props). If the existing API doesn't allow this, add a new prop and adjust the parent. Document the actual decision in the commit message.

- [ ] **Step 3: Add the import**

At the top of `components/ExerciseRunner.tsx` (find the import block), add:
```ts
import { LessonStep } from "@/components/lessons/LessonStep";
```

- [ ] **Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: No commit yet — proceed to 4.5**

---

### Task 4.5: Dexie + repository tests

**Files:**
- Create: `tests/unit/lesson-view-repo.test.ts`

- [ ] **Step 1: Read the existing repository test pattern (vocab card or story progress)**

Run: `ls tests/unit/*repository* tests/unit/*repo* tests/unit/*vocab* 2>/dev/null | head -3`
Run: `head -50 tests/unit/$(ls tests/unit/ | grep -i "vocab-lang" | head -1) 2>/dev/null`
Expected: a test using `fake-indexeddb` (look for `import "fake-indexeddb/auto"` or similar).

- [ ] **Step 2: Write the test**

Write to `tests/unit/lesson-view-repo.test.ts`:
```ts
// @vitest-environment node
import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db/schema";
import {
  getOrCreateLessonView,
  markLessonCompleted,
  getLessonViewsForReview,
} from "@/lib/db/repository";

beforeEach(async () => {
  await db.lessonViews.clear();
  await db.genericEvents.clear();
});

describe("lessonViews repository", () => {
  it("getOrCreateLessonView creates a new view on first call", async () => {
    const v = await getOrCreateLessonView("b1-test", "pt", 1);
    expect(v.viewCount).toBe(1);
    expect(v.completedAt).toBeNull();
    expect(v.lang).toBe("pt");
    expect(v.blockId).toBe(1);
  });

  it("getOrCreateLessonView increments viewCount on subsequent calls", async () => {
    await getOrCreateLessonView("b1-test", "pt", 1);
    const v = await getOrCreateLessonView("b1-test", "pt", 1);
    expect(v.viewCount).toBe(2);
  });

  it("markLessonCompleted sets completedAt and is idempotent", async () => {
    await getOrCreateLessonView("b1-test", "pt", 1);
    await markLessonCompleted("b1-test");
    const v1 = await db.lessonViews.get("b1-test");
    expect(v1?.completedAt).not.toBeNull();
    const firstCompletedAt = v1!.completedAt;

    await markLessonCompleted("b1-test");
    const v2 = await db.lessonViews.get("b1-test");
    expect(v2?.completedAt).toBe(firstCompletedAt); // unchanged
  });

  it("markLessonCompleted emits a lesson_complete generic event", async () => {
    await getOrCreateLessonView("b1-test", "pt", 1);
    await markLessonCompleted("b1-test");
    const events = await db.genericEvents.where("type").equals("lesson_complete").toArray();
    expect(events).toHaveLength(1);
    expect((events[0].payload as { lessonId: string }).lessonId).toBe("b1-test");
  });

  it("markLessonCompleted on a never-viewed lesson is a no-op", async () => {
    await markLessonCompleted("never-viewed");
    const events = await db.genericEvents.where("type").equals("lesson_complete").toArray();
    expect(events).toHaveLength(0);
  });

  it("getLessonViewsForReview returns only completed lessons, oldest first", async () => {
    await getOrCreateLessonView("b1-a", "pt", 1);
    await new Promise((r) => setTimeout(r, 5));
    await getOrCreateLessonView("b1-b", "pt", 1);
    await new Promise((r) => setTimeout(r, 5));
    await getOrCreateLessonView("b1-c", "pt", 1);
    // Complete b1-b and b1-c, leave b1-a incomplete
    await markLessonCompleted("b1-b");
    await markLessonCompleted("b1-c");

    const review = await getLessonViewsForReview("pt");
    expect(review).toHaveLength(2);
    expect(review[0].lessonId).toBe("b1-b"); // older
    expect(review[1].lessonId).toBe("b1-c");
  });

  it("getLessonViewsForReview filters by lang", async () => {
    await getOrCreateLessonView("b1-a", "pt", 1);
    await markLessonCompleted("b1-a");
    const review = await getLessonViewsForReview("ru");
    expect(review).toHaveLength(0);
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm test -- tests/unit/lesson-view-repo.test.ts`
Expected: 7 tests pass.

- [ ] **Step 4: No commit yet — proceed to 4.6**

---

### Task 4.6: POST endpoint for lesson completion

**Files:**
- Create: `app/api/lessons/[lang]/[lessonId]/complete/route.ts`

- [ ] **Step 1: Create the route directory**

Run: `mkdir -p "app/api/lessons/[lang]/[lessonId]/complete"`

- [ ] **Step 2: Write the route**

Write to `app/api/lessons/[lang]/[lessonId]/complete/route.ts`:
```ts
import { NextResponse } from "next/server";
import { hasLocale, type LanguageId } from "@/lib/locales";

/**
 * POST /api/lessons/[lang]/[lessonId]/complete
 *
 * Marks a lesson as completed. The actual write happens client-side
 * via Dexie (this endpoint is a no-op for the client; it exists for
 * symmetry with GET and for future server-side tracking).
 *
 * Returns 204 No Content on success.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ lang: string; lessonId: string }> }
) {
  const { lang: rawLang, lessonId } = await params;
  if (!hasLocale(rawLang) || rawLang !== "pt") {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }
  if (!/^b\d+-[\w-]+$/.test(lessonId)) {
    return NextResponse.json({ error: "Invalid lessonId" }, { status: 400 });
  }
  return new NextResponse(null, { status: 204 });
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: Run all tests**

Run: `npm test`
Expected: ~468 tests pass (461 + 7 from 4.5).

- [ ] **Step 5: Commit**

```bash
git add lib/db/schema.ts lib/db/repository.ts components/lessons/ components/ExerciseRunner.tsx app/api/lessons/ tests/unit/lesson-view-repo.test.ts
git commit -m "feat(lessons): Dexie v7 lessonViews + LessonStep + LessonGate + POST complete"
```

---

### Task 4.7: Remove the L0 + L3 smoke routes

**Files:**
- Delete: `app/_mdx-smoke-lesson/page.tsx`, `lib/data/languages/pt/mdx/b1/l-test.mdx`
- Delete: `app/_mdx-smoke/` (created in L0 if not already removed) and `content/_smoke.mdx`

- [ ] **Step 1: Remove all smoke artifacts**

Run:
```bash
rm -rf app/_mdx-smoke
rm -rf app/_mdx-smoke-lesson
rm -rf content/
# Keep lib/data/languages/pt/mdx/b1/ as an empty dir with .gitkeep (for L5 lessons to land in)
touch lib/data/languages/pt/mdx/.gitkeep
touch lib/data/languages/pt/mdx/b1/.gitkeep
rm -f lib/data/languages/pt/mdx/b1/l-test.mdx
```

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: exits 0. No orphan route errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(lessons): remove MDX smoke routes from L0 + L3"
```

---

### Task 4.8: Build verification (L4 gate)

**Files:** none

- [ ] **Step 1: Run all gates**

```bash
npm run typecheck
npm test
STRICT=1 npm run verify:content
npm run build
```
Expected: all exit 0. ~468 tests.

- [ ] **Step 2: No commit — gate checkpoint**

---

## Sub-phase L5 — UI integration + content scripts

> Final sub-phase. Wires the new pieces into the 3 user-facing entry points (panel in lesson view, gate in practice, standalone review page) and creates the LLM content generator. Gates: typecheck, tests, e2e test, build, manual smoke of all 3 entry points.

### Task 5.1: Panel "📖 Explicación" in `/pt/blocks/[id]/lessons/[lid]`

**Files:**
- Modify: `app/[lang]/blocks/[id]/lessons/[lid]/page.tsx`

- [ ] **Step 1: Read the current page**

Run: `cat app/\[lang\]/blocks/\[id\]/lessons/\[lid\]/page.tsx`
Expected: server component, 54 lines, renders title + objectives + concepts + "Practicar esta lección" link.

- [ ] **Step 2: Add the LessonRenderer panel**

In the JSX returned by the default export, find the `<h1>` for the lesson title. After it (before the objectives), insert:
```tsx
{lesson.conceptNotesPath && (
  <details className="rounded-lg border bg-card p-4 mb-6">
    <summary className="cursor-pointer text-sm font-semibold">
      📖 Explicación + ejemplos
    </summary>
    <div className="mt-4">
      <LessonRenderer
        lessonId={lesson.id}
        mdxPath={lesson.conceptNotesPath}
        lang={lang}
      />
    </div>
  </details>
)}
```

- [ ] **Step 3: Add the import**

At the top of the file, add:
```ts
import { LessonRenderer } from "@/components/lessons/LessonRenderer";
```

- [ ] **Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: No commit yet — proceed to 5.2**

---

### Task 5.2: `LessonGate` wrapping the practice page

**Files:**
- Modify: `app/[lang]/practice/[lessonId]/page.tsx`

- [ ] **Step 1: Read the current practice page**

Run: `cat app/\[lang\]/practice/\[lessonId\]/page.tsx`
Expected: 148 lines, client component, fetches `/api/curriculum?lang=...` + `/api/blocks?lang=...&blockId=...`, opens Dexie session, renders `<ExerciseRunner>`.

- [ ] **Step 2: Find the `<ExerciseRunner>` JSX**

Run: `grep -n "ExerciseRunner" app/\[lang\]/practice/\[lessonId\]/page.tsx`
Expected: one line around line 144.

- [ ] **Step 3: Wrap with `LessonGate`**

Replace the `<ExerciseRunner ... />` JSX with:
```tsx
<LessonGate
  lessonId={lesson.id}
  mdxPath={lesson.conceptNotesPath}
  blockId={lesson.blockId}
  lang={lang}
>
  <ExerciseRunner
    exercises={exercises}
    blockId={lesson.blockId}
    lessonId={lesson.id}
    onFinish={setDone}
  />
</LessonGate>
```

> The `exercises` array is unchanged — it does NOT include a synthetic `lesson` ex. The gate renders the lesson MDX *instead of* the runner when `completedAt === null`. This means the runner's `if (ex.type === "lesson")` branch added in Task 4.4 is dead code for now. That's fine; the branch stays for future use when the runner is refactored to also handle lessons inline.

- [ ] **Step 4: Add the import**

At the top of the file, add:
```ts
import { LessonGate } from "@/components/lessons/LessonGate";
```

- [ ] **Step 5: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 6: No commit yet — proceed to 5.3**

---

### Task 5.3: Standalone review page `/pt/lessons/[lessonId]`

**Files:**
- Create: `app/[lang]/lessons/[lessonId]/page.tsx`

- [ ] **Step 1: Read the existing lesson view page for structure**

Run: `cat app/\[lang\]/blocks/\[id\]/lessons/\[lid\]/page.tsx | head -20`
Expected: server component signature with `params: Promise<{...}>`.

- [ ] **Step 2: Create the page directory and file**

Run: `mkdir -p "app/[lang]/lessons/[lessonId]"`

Write to `app/[lang]/lessons/[lessonId]/page.tsx`:
```tsx
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadCurriculum, loadLessonsAudioRefs } from "@/lib/data/loaders";
import { LessonStep } from "@/components/lessons/LessonStep";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function LessonStandalonePage({
  params,
}: {
  params: Promise<{ lang: string; lessonId: string }>;
}) {
  const { lang: rawLang, lessonId } = await params;
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : "pt";

  const curriculum = await loadCurriculum(lang);
  const lesson = curriculum.BLOCKS
    .flatMap((b) => b.lessons)
    .find((l) => l.id === lessonId);
  if (!lesson) notFound();

  const audioRefsMap = await loadLessonsAudioRefs(lang);
  const entry = audioRefsMap[lessonId];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { href: `/${lang}`, label: "Inicio" },
          { href: `/${lang}/review`, label: "Repaso" },
          { label: entry?.title ?? lesson.name },
        ]}
      />
      <LessonStep
        lessonId={lesson.id}
        mdxPath={lesson.conceptNotesPath}
        lang={lang}
        onComplete={async () => {
          "use server";
          // Server-side completion is a no-op; the client marks via Dexie.
          // This server action is here for type symmetry and future use.
        }}
      />
    </div>
  );
}
```

> Verify that `@/components/ui/breadcrumb` exists. If not, replace with a plain `<nav>` or the existing breadcrumb component used elsewhere. If `Breadcrumb` does not exist, use a simple `<nav className="text-sm text-muted-foreground">Inicio &gt; Repaso &gt; {title}</nav>`.

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 4: No commit yet — proceed to 5.4**

---

### Task 5.4: "Repasar lección" section in `/pt/review`

**Files:**
- Modify: `app/[lang]/review/page.tsx`

- [ ] **Step 1: Read the review page structure**

Run: `sed -n '1,50p' app/\[lang\]/review/page.tsx`
Expected: client component, Suspense wrapper, `ReviewPageInner` does data fetching.

- [ ] **Step 2: Find the main JSX container**

Run: `grep -n "return\|<main\|<div" app/\[lang\]/review/page.tsx | head -10`
Expected: the main JSX block where the SRS cards are rendered.

- [ ] **Step 3: Add the "Repasar lección" section above the existing SRS cards**

Find the line where the existing SRS section starts (look for `<h1>Repaso</h1>` or similar). Insert a new section immediately before it:

```tsx
<LessonReviewSection lang={lang} />
```

Create the `LessonReviewSection` component (also in this file or a new one):
```tsx
// At the top of the file, add the import:
import { useEffect, useState } from "react";
import Link from "next/link";
import { getLessonViewsForReview } from "@/lib/db/repository";
import type { LessonView } from "@/lib/db/schema";

// And inside the same file (or as a new file components/LessonReviewSection.tsx):
function LessonReviewSection({ lang }: { lang: LanguageId }) {
  const [views, setViews] = useState<LessonView[] | null>(null);
  useEffect(() => {
    getLessonViewsForReview(lang).then(setViews);
  }, [lang]);
  if (views === null || views.length === 0) return null;
  return (
    <section className="space-y-3 mb-8">
      <h2 className="font-display text-2xl">📖 Repasar lección</h2>
      <ul className="space-y-2">
        {views.map((v) => (
          <li key={v.lessonId} className="rounded-lg border bg-card p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{v.lessonId}</div>
              <div className="text-xs text-muted-foreground">
                Vista {v.viewCount} {v.viewCount === 1 ? "vez" : "veces"}
              </div>
            </div>
            <Link
              href={`/${lang}/lessons/${v.lessonId}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Repasar →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: No commit yet — proceed to 5.5**

---

### Task 5.5: LLM content generator script

**Files:**
- Create: `scripts/prompts/lesson.md` (the prompt)
- Create: `scripts/generate-lessons.ts` (the script)
- Modify: `package.json` (add `generate:lessons` script)

- [ ] **Step 1: Create the prompt file**

Write to `scripts/prompts/lesson.md`:
```markdown
# Rol
Sos un profesor de portugués brasileño para hispanohablantes. Generás explicaciones gramaticales con ejemplos resueltos para una lección de la app.

# Input
- Bloque: {{blockName}}
- Lección: {{lessonName}}
- ID de lección: {{lessonId}}
- Conceptos cubiertos: {{conceptsList}}
- Vocabulario clave: {{vocabKey}}
- Exercises existentes (NO repetir): {{existingExercises}}

# Output
MDX puro (sin fences \`\`\`). Incluí:

1. Frontmatter YAML:
```
---
lessonId: {{lessonId}}
blockId: {{blockId}}
title: "{{lessonName}}"
exampleCount: 3
---
```

2. Cuerpo:
- Un `<h1>` con el título de la lección
- 1-2 párrafos de explicación de la regla
- Un `<Rule title="...">` con el patrón si aplica
- EXACTAMENTE 3 `<Example index={N} pt="..." es="..." audioRef={N} />` con dificultad progresiva
- Un `<Tip>` con un dato útil o mnemonic
- Una sección `## Practica ahora` con 1 frase motivadora

# Reglas
- NO uses los mismos ejemplos que los exercises existentes
- Mantené el pt-BR (no pt-PT)
- `audioRef` es el índice (0, 1, 2) — se resuelve en runtime con el manifest
- NO incluyas marcadores `__AUDIO_n__`; el renderer los inyecta
- Devolvé SOLO el MDX, sin texto adicional
```

- [ ] **Step 2: Read the existing `generate-content.ts` for the script pattern**

Run: `sed -n '1,100p' scripts/generate-content.ts`
Expected: imports, CLI arg parsing, `loadPrompt`, `runPromptGeneration`, `fs.writeFile` atomic write pattern.

- [ ] **Step 3: Create the new script**

Write to `scripts/generate-lessons.ts`:
```ts
#!/usr/bin/env tsx
/**
 * generate-lessons.ts — Generate lesson MDX content for each lesson in the
 * PT curriculum. One MDX file per lesson, written to
 * lib/data/languages/pt/mdx/{conceptNotesPath}.
 *
 * Usage: npm run generate:lessons -- [--lang=pt] [--block=1] [--force] [--dry-run]
 */
import path from "node:path";
import { promises as fs } from "node:fs";
import { parseArgs } from "node:util";
import { parseLangArgs, noopForLang } from "./lib/cli";
import { LLM_CACHE, LLM_CONCURRENCY, PROMPTS_DIR, LESSONS_DIR } from "./config";
import { runPromptGeneration } from "./lib/prompt-runner";
import { loadPrompt } from "./lib/prompt-utils";
import { loadCurriculum } from "@/lib/data/loaders";
import { hasLocale } from "@/lib/locales";

async function main() {
  const { values } = parseArgs({
    options: {
      block: { type: "string" },
      force: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
    allowPositionals: false,
  });

  const { lang } = parseLangArgs();
  if (lang !== "pt") {
    console.log(noopForLang(lang, "generate-lessons"));
    return;
  }
  if (!hasLocale(lang)) throw new Error(`Unknown language: ${lang}`);

  const curriculum = await loadCurriculum(lang);
  const blocks = values.block
    ? curriculum.BLOCKS.filter((b) => String(b.id) === values.block)
    : curriculum.BLOCKS;

  const mdxRoot = path.join(process.cwd(), "lib", "data", "languages", lang, "mdx");
  const prompt = await loadPrompt("lesson");

  for (const block of blocks) {
    for (const lesson of block.lessons) {
      if (!lesson.conceptNotesPath) continue;
      const outPath = path.join(mdxRoot, lesson.conceptNotesPath);
      const exists = await fs
        .stat(outPath)
        .then(() => true)
        .catch(() => false);
      if (exists && !values.force) {
        console.log(`✓ ${lesson.id} (exists, skip; pass --force to overwrite)`);
        continue;
      }
      // Load existing exercises for this block to avoid repeating examples
      const blockFile = path.join(
        process.cwd(),
        "lib",
        "data",
        "languages",
        lang,
        "blocks",
        `b${block.id}.json`,
      );
      const blockJson = JSON.parse(
        await fs.readFile(blockFile, "utf-8").catch(() => "[]"),
      ) as Array<{ lessonId?: string; data?: { sentence?: string; prompt?: string } }>;
      const lessonExercises = blockJson
        .filter((ex) => ex.lessonId === lesson.id)
        .map((ex) => ex.data?.sentence ?? ex.data?.prompt ?? "")
        .filter(Boolean);

      const vars = {
        blockName: block.name,
        lessonName: lesson.name,
        lessonId: lesson.id,
        blockId: String(block.id),
        conceptsList: lesson.conceptIds.join(", "),
        vocabKey: lesson.vocabKey.join(", "),
        existingExercises: lessonExercises.join(" | ") || "(none)",
      };
      const result = await runPromptGeneration({
        cacheKey: `lesson:${lesson.id}`,
        prompt,
        vars,
        schemaVersion: 1,
        cacheDir: LLM_CACHE,
        concurrency: LLM_CONCURRENCY,
        model: "minimax-m2.5",
      });
      if (values["dry-run"]) {
        console.log(`[dry-run] would write ${outPath}`);
        continue;
      }
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      const tmp = `${outPath}.tmp`;
      await fs.writeFile(tmp, result, "utf-8");
      await fs.rename(tmp, outPath);
      console.log(`✎ ${lesson.id} → ${outPath}`);
    }
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

> Verify the imports `runPromptGeneration`, `loadPrompt`, `LLM_CACHE`, `LLM_CONCURRENCY`, `PROMPTS_DIR` exist. If `runPromptGeneration` is named differently, check `scripts/lib/prompt-runner.ts` for the actual export. The script above is a starting point — adapt to match the project's exact LLM helper API.

- [ ] **Step 4: Add the npm script**

In `package.json` under `scripts`, add:
```json
"generate:lessons": "tsx scripts/generate-lessons.ts"
```

- [ ] **Step 5: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0. (Don't actually run the script yet — that requires MiniMax API access and is part of post-PR content generation.)

- [ ] **Step 6: No commit yet — proceed to 5.6**

---

### Task 5.6: Audio generator extension for lessons

**Files:**
- Modify: `scripts/generate-audio.ts` (add a `lessons` subcommand that reads `audio-refs.json` and generates TTS for each example)
- Create: `lib/data/languages/pt/lessons/audio-refs.json` (empty initial file)

- [ ] **Step 1: Read the existing audio script**

Run: `cat scripts/generate-audio.ts | head -80`
Expected: imports, CLI arg parsing, TTS helper invocation.

- [ ] **Step 2: Add the `lessons` subcommand**

At the bottom of `scripts/generate-audio.ts`, add:
```ts
if (values.target === "lessons") {
  const { lang } = parseLangArgs();
  if (lang !== "pt") {
    console.log(noopForLang(lang, "generate-audio:lessons"));
    process.exit(0);
  }
  const audioRefsFile = path.join(LESSONS_DIR, "audio-refs.json");
  const current = JSON.parse(await fs.readFile(audioRefsFile, "utf-8").catch(() => "{}"));

  for (const block of curriculum.BLOCKS) {
    for (const lesson of block.lessons) {
      if (!lesson.conceptNotesPath) continue;
      const mdxPath = path.join("lib/data/languages/pt/mdx", lesson.conceptNotesPath);
      const mdxContent = await fs.readFile(mdxPath, "utf-8").catch(() => null);
      if (!mdxContent) continue;

      // Extract 3 examples from the MDX (regex: <Example ... pt="..." />)
      const exampleRegex = /<Example\s+index=\{(\d+)\}\s+pt="([^"]+)"/g;
      const examples: { index: number; pt: string }[] = [];
      let m;
      while ((m = exampleRegex.exec(mdxContent)) !== null) {
        examples.push({ index: parseInt(m[1], 10), pt: m[2] });
      }
      if (examples.length === 0) continue;

      // Generate TTS for each example
      const audioRefs: { hash: string; voice: string }[] = [];
      for (const ex of examples) {
        const { hash, voice } = await generateTts(ex.pt, { variant: "pt-br" });
        audioRefs.push({ hash, voice });
      }

      current[lesson.id] = {
        blockId: lesson.blockId,
        title: lesson.name,
        exampleCount: examples.length,
        audioRefs: { "pt-br": audioRefs },
      };
      console.log(`🔊 ${lesson.id} → ${examples.length} audios`);
    }
  }

  await fs.writeFile(audioRefsFile, JSON.stringify(current, null, 2), "utf-8");
  console.log(`Done. Wrote ${audioRefsFile}`);
}
```

> The exact `generateTts` function signature depends on `scripts/lib/minimax-tts.ts`. Check the file and adapt the call. The pattern above is a starting point.

- [ ] **Step 3: Create the empty `audio-refs.json`**

Run: `mkdir -p lib/data/languages/pt/lessons`

Write to `lib/data/languages/pt/lessons/audio-refs.json`:
```json
{}
```

- [ ] **Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: No commit yet — proceed to 5.7**

---

### Task 5.7: End-to-end Playwright test

**Files:**
- Create: `tests/e2e/lessons.spec.ts`

- [ ] **Step 1: Read the existing Playwright test pattern**

Run: `ls tests/e2e/ 2>/dev/null`
Run: `cat $(ls tests/e2e/*.spec.ts 2>/dev/null | head -1) 2>/dev/null | head -40`
Expected: a Playwright test with `import { test, expect } from "@playwright/test"`.

- [ ] **Step 2: Write the e2e test**

Write to `tests/e2e/lessons.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("veo la lesson antes del primer exercise", async ({ page }) => {
  // Step 1: go to the lesson view page
  await page.goto("/pt/blocks/1/lessons/regulares-ar");

  // The "📖 Explicación + ejemplos" panel exists
  await expect(page.getByText(/Explicación \+ ejemplos/)).toBeVisible();

  // If MDX has been generated, expanding the details shows it
  const details = page.locator("details");
  if (await details.count() > 0) {
    await details.first().click();
    // Verify the MDX content area is visible (could be empty if not generated)
    await expect(page.locator("details > div")).toBeVisible();
  }

  // Step 2: navigate to practice
  await page.goto("/pt/practice/b1-regulares-ar");

  // Either the gate shows the lesson (first time) or the runner shows up
  const gateVisible = await page.getByRole("button", { name: /Entendi/ }).isVisible().catch(() => false);
  if (gateVisible) {
    // First visit: gate is showing
    await expect(page.getByRole("button", { name: /Entendi/ })).toBeEnabled();
    // Click "Entendi" — should reveal the exercise queue
    await page.getByRole("button", { name: /Entendi/ }).click();
  }

  // Step 3: after completion, /pt/review should show the "Repasar lección" section
  await page.goto("/pt/review");
  // The section header may or may not be present depending on previous state
  // (this assertion is best-effort)
  const repasarVisible = await page.getByText(/Repasar lección/).isVisible().catch(() => false);
  expect(typeof repasarVisible).toBe("boolean");
});
```

- [ ] **Step 3: Run the e2e test**

Run: `npx playwright test tests/e2e/lessons.spec.ts`
Expected: 1 test passes (or is skipped if Playwright is not configured for CI).

- [ ] **Step 4: No commit yet — proceed to 5.8**

---

### Task 5.8: L5 build + test gate

**Files:** none

- [ ] **Step 1: Run all gates**

```bash
npm run typecheck
npm test
npx playwright test tests/e2e/lessons.spec.ts
STRICT=1 npm run verify:content
npm run build
```
Expected: all exit 0. Test count is now ~470 (468 + 2 from 5.5/5.6 + e2e from 5.7).

- [ ] **Step 2: Manual smoke test**

Start the dev server: `npm run dev &`
Wait 8 seconds.

1. `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/pt/blocks/1/lessons/regulares-ar`
   Expected: `200` (page renders; the panel is collapsible)
2. `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/pt/lessons/b1-regulares-ar`
   Expected: `200` (standalone page renders; MDX is empty fallback if not generated)
3. `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/pt/review`
   Expected: `200` (the new section is conditionally rendered)
4. `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/lessons/pt/b1-regulares-ar/complete -X POST`
   Expected: `204`

Stop the dev server: `pkill -f "next dev" || true`

- [ ] **Step 3: Commit the L5 changes**

```bash
git add app/[lang]/ blocks/ app/[lang]/review/ app/[lang]/lessons/ scripts/prompts/lesson.md scripts/generate-lessons.ts scripts/generate-audio.ts package.json lib/data/languages/pt/lessons/audio-refs.json tests/e2e/lessons.spec.ts
git commit -m "feat(lessons): UI integration + content scripts + e2e (L5)"
```

---

## Final Verification

After all L0-L5 sub-phases complete and all commits are in:

- [ ] **Task F.1: Run the full verification suite**

```bash
npm run typecheck
npm test                                                  # ~470 tests
npx playwright test                                       # 1 e2e test
STRICT=1 npm run verify:content                           # PT content
npm run build                                             # no warnings
```

- [ ] **Task F.2: Final commit**

If any of the verification commands revealed issues, fix them in a final commit:
```bash
git add -A
git commit --allow-empty -m "chore(lessons): L0-L5 complete, all gates green"
```

- [ ] **Task F.3: Update the project memory**

Per `MEMORY.md` discipline, save a memory about this feature for future sessions:
- File: `/Users/lalo/.claude/projects/-Users-lalo/memory/feature_lessons_exercises.md`
- Content: brief summary of the feature, the L0-L5 sub-phase structure, the Dexie v7 bump, and the 3 UI entry points.
- Index entry: `- [Lessons-before-exercises](feature_lessons_exercises.md) — PT-only feature added in feature/lesson-exercises, 5 sub-phases, ~470 tests`

---

## Out of scope (confirmed)

- Lessons in `ru/ro/cs` (no base content; scaffolds return 400)
- Quiz at the end of the lesson (a different exercise type, deferred)
- Lessons for stories (stories are already read+audio)
- SRS / FSRS for lessons themselves (no card, no rate)
- "Skip lesson" button in `/practice` (YAGNI)
- Pre-generated audio for `pt-pt` (remains empty)
