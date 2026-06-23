# Plan 5b — Mass Content via Parallel Sonnet Subagents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add text-only content (the 4 new exercise types + extra existing types) to blocks b2–b10 by dispatching one Claude Sonnet subagent per block, merging schema-conformant staged JSON with collision-safe ids, gated by the extended content guard.

**Architecture:** Agents emit `blocks/bN.staged.json` (exercise objects **without `id`**). A `merge-staged.ts` script reuses `contentId()` hashing, enforces **global id uniqueness**, validates new-type integrity (E10), then appends into `bN.json`. No audio (text types only). Re-weighted per E8.

**Tech Stack:** TypeScript, Zod 4 (the frozen schema from Plan 5a), vitest, Claude Sonnet subagents.

## Global Constraints

- **Prerequisites (hard):** Plan **5a** merged (the 5 new type schemas + cards exist) and the **content-fixes plan Task 2** merged (the English-bleed + structural gate is wired into verify-content). Do not start 5b otherwise.
- **No audio:** only `error_correction`, `conjugation`, `matching`, `multiple_choice` and extra `translation`/`fill_blank`/`verb_preposition`. **Never** generate `flashcard`/`listening`/`shadowing` content here (those need TTS).
- **Re-weighting (E8):** per block — `error_correction` ~10, `conjugation` ~10 (verb blocks b3–b7 lean higher), `multiple_choice` **≤3** (discrimination items only), `matching` **≤3** (or 0), plus ~15 extra `translation`/`fill_blank`/`verb_preposition`.
- **Language:** Portuguese/Spanish only; the gate (latin-guard + content-guard) rejects other scripts and English. `esContrast`/`explanationEs`/`hintEs` in **Spanish**.
- Run `npm run typecheck && npm test && npm run verify:content && npm run build` after each block merge.

---

### Task 1: `merge-staged.ts` — collision-safe merge + new-type validation (E2, E10, R2)

**Files:**
- Create: `scripts/merge-staged.ts`
- Create: `scripts/lib/staged-validate.ts` (pure validators, unit-tested)
- Test: `tests/unit/staged-validate.test.ts`

**Interfaces:**
- Produces:
  - `assignIds(items, existingIds: Set<string>): { withIds: Exercise[]; collisions: string[] }` — assigns `contentId(type,data,variantOverrides,esContrast)`; any id already in `existingIds` (or duplicated within the batch) is reported in `collisions`, never silently dropped.
  - `validateNewType(ex): string[]` — returns problems: `multiple_choice` with duplicate options or out-of-range `correctIndex`; `matching` with a `right` value reachable from two `left`s; `error_correction` where `sentence === correct`.

- [ ] **Step 1: Write the failing validator test**

```ts
// tests/unit/staged-validate.test.ts
import { describe, it, expect } from 'vitest';
import { validateNewType, assignIds } from '@/scripts/lib/staged-validate';

describe('validateNewType (E10)', () => {
  it('flags MC duplicate options', () => {
    expect(validateNewType({ type: 'multiple_choice', data: { question: 'q', options: ['a','a','b'], correctIndex: 0, explanationEs: 'x' } } as any)).toContain('duplicate options');
  });
  it('flags MC out-of-range correctIndex', () => {
    expect(validateNewType({ type: 'multiple_choice', data: { question: 'q', options: ['a','b'], correctIndex: 5, explanationEs: 'x' } } as any).join()).toMatch(/correctIndex/);
  });
  it('flags error_correction where sentence equals correct', () => {
    expect(validateNewType({ type: 'error_correction', data: { sentence: 'igual', correct: 'igual', explanationEs: 'x' } } as any).join()).toMatch(/sentence equals correct/);
  });
  it('passes a clean multiple_choice', () => {
    expect(validateNewType({ type: 'multiple_choice', data: { question: 'q', options: ['a','b'], correctIndex: 1, explanationEs: 'x' } } as any)).toEqual([]);
  });
});

describe('assignIds (R2)', () => {
  it('reports a collision instead of dropping it', () => {
    const a = { type: 'error_correction', data: { sentence: 's', correct: 'c', explanationEs: 'e' } } as any;
    const { withIds, collisions } = assignIds([a, a], new Set());
    // identical content → same hash → second is a collision
    expect(withIds.length).toBe(1);
    expect(collisions.length).toBe(1);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**. `npx vitest run tests/unit/staged-validate.test.ts`

- [ ] **Step 3: Implement `scripts/lib/staged-validate.ts`**

```ts
// scripts/lib/staged-validate.ts
import { createHash } from 'node:crypto';
import { stableStringify } from './cache'; // reuse the canonical stringify if exported; else inline JSON.stringify with sorted keys

export function contentId(type: string, data: unknown, variantOverrides: unknown, esContrast: unknown): string {
  return createHash('sha256').update(stableStringify({ type, data, variantOverrides, esContrast })).digest('hex').slice(0, 8);
}

export function validateNewType(ex: { type: string; data: any }): string[] {
  const out: string[] = [];
  if (ex.type === 'multiple_choice') {
    const o = ex.data.options ?? [];
    if (new Set(o).size !== o.length) out.push('duplicate options');
    if (typeof ex.data.correctIndex !== 'number' || ex.data.correctIndex < 0 || ex.data.correctIndex >= o.length) out.push('correctIndex out of range');
  }
  if (ex.type === 'matching') {
    const rights = (ex.data.pairs ?? []).map((p: any) => p.right);
    if (new Set(rights).size !== rights.length) out.push('ambiguous matching (duplicate right values)');
  }
  if (ex.type === 'error_correction') {
    if (ex.data.sentence === ex.data.correct) out.push('sentence equals correct');
  }
  return out;
}

export function assignIds(items: any[], existingIds: Set<string>): { withIds: any[]; collisions: string[] } {
  const seen = new Set(existingIds);
  const withIds: any[] = []; const collisions: string[] = [];
  for (const it of items) {
    const id = contentId(it.type, it.data, it.variantOverrides, it.esContrast);
    if (seen.has(id)) { collisions.push(id); continue; }
    seen.add(id); withIds.push({ ...it, id });
  }
  return { withIds, collisions };
}
```

(If `stableStringify` is not exported from `cache.ts`, export it there in this step — it is the function `hashKey` already uses, so reusing it keeps ids identical to the existing pipeline.)

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Implement the orchestrator `scripts/merge-staged.ts`** (CLI: `tsx scripts/merge-staged.ts --block N [--write]`):
  1. Read `blocks/bN.staged.json` and `blocks/bN.json`.
  2. Build `existingIds` from the **whole corpus** (all `b*.json`), not just block N.
  3. `GeneratedExerciseSchema.safeParse` each staged item (audio-optional per 5a R1); collect Zod failures.
  4. `validateNewType` each; collect failures.
  5. `findNonLatinDeep` + `findEnglishWords` (content-guard) each; collect bleed.
  6. `assignIds`; report collisions.
  7. If any failures/collisions/bleed → print them and exit 1 (do NOT write).
  8. With `--write` and zero problems → append `withIds` (add `blockId: N`, `lessonId` from the item's target lesson, `contentHash`) into `bN.json` and write.

- [ ] **Step 6: typecheck + tests, Commit**

```bash
git add scripts/merge-staged.ts scripts/lib/staged-validate.ts tests/unit/staged-validate.test.ts
git commit -m "feat(content): merge-staged with collision-safe ids + new-type validation (5b Task1)"
```

---

### Task 2: Author the agent content brief (E8, E9, R8)

A single markdown brief every per-block agent receives. Pure documentation; the deliverable is the brief file the orchestration step (Task 3) feeds to agents.

**Files:**
- Create: `scripts/prompts/agent-content-brief.md`

- [ ] **Step 1: Write the brief** containing:
  - The exact Zod `data` shapes for `error_correction`, `conjugation`, `matching`, `multiple_choice` and the extra existing types (`translation`, `fill_blank`, `verb_preposition`), copied from `lib/data/zod-schemas.ts`.
  - 2–3 **gold examples per type** (hand-written, correct PT/ES).
  - **Canonical `tense` vocabulary (E9)** — the closed set (verify exact labels against the lessons): `["presente do indicativo","pretérito perfeito","pretérito imperfeito","mais-que-perfeito","futuro do presente","futuro composto","condicional","presente do conjuntivo","imperfeito do conjuntivo","futuro do conjuntivo","infinitivo pessoal","gerúndio"]`. Canonical `person` set: `["eu","tu","você","ele/ela","nós","vocês","eles/elas"]`. Conjugation answers must be **variant-aware**: when tu/você differ, give the PT-PT (tu) form in `variantOverrides["pt-pt"].answer` and BR (você) in base `answer`.
  - **esContrast / error rubric (R8):** every `esContrast`/`explanationEs` must name the SPECIFIC Spanish→PT interference; `error_correction.sentence` must contain an error a Spanish speaker actually makes (enumerate: tengo→tenho, muy→muito, está hablando→está falando, gostar/precisar/pensar sin/with prep, buscar→procurar, embarazada→grávida, ll→ch, -ón→-ão, você+3ª pessoa). `correct` must be the single uncontroversial fix.
  - **Weighting (E8):** per block — error_correction ~10, conjugation ~10 (b3–b7 higher), multiple_choice ≤3, matching ≤3, +~15 extra translation/fill_blank/verb_preposition. **No** flashcard/listening/shadowing.
  - **Hard rules:** Portuguese/Spanish only, no other scripts, no English words; output a JSON array of exercise objects with NO `id`/`blockId`/`lessonId`/`audio`/`contentHash`.

- [ ] **Step 2: Commit** — `git add scripts/prompts/agent-content-brief.md && git commit -m "docs(content): agent brief — shapes, canonical tense/person, rubric, weighting (5b Task2)"`

---

### Task 3: Generate + merge, per block (execution loop)

Not classic TDD — this is the generation run, gated by Task 1's validators.

**For each block N in 2..10 (b9 is freeDrill — skip exercises, or generate only error_correction on lexical items):**

- [ ] **Step 1: Dispatch a Sonnet subagent** with: the brief (Task 2), block N's concepts + `vocabKey` (from `curriculum.ts`/`concepts.json`), and the instruction to write `lib/data/languages/pt/blocks/b{N}.staged.json` (a JSON array, no ids). One agent per block; agents run in parallel since each writes a distinct file.

- [ ] **Step 2: Merge dry-run** — `bash scripts/with-env.sh npx tsx scripts/merge-staged.ts --block N`. Expect zero schema/validation/bleed/collision problems. If problems: send them back to that block's agent to regenerate the offending items; repeat.

- [ ] **Step 3: Human quality-gate (R8)** — sample ~10 items: `esContrast` names the specific interference; `error_correction` errors are realistic; `conjugation.tense`/`person` use the canonical set; MC items are discrimination-worthy (not trivia). Reject low-quality back to the agent.

- [ ] **Step 4: Merge for real** — `... merge-staged.ts --block N --write`.

- [ ] **Step 5: Gates** — `npm run typecheck && npm test && npm run verify:content && npm run build` (all green; the gate now also enforces English/structural/non-Latin).

- [ ] **Step 6: Commit** — `git add lib/data/languages/pt/blocks/b{N}.json && rm lib/data/languages/pt/blocks/b{N}.staged.json && git commit -m "feat(content): block {N} new-type + extra exercises (5b)"`

- [ ] **Step 7:** Repeat for all blocks. Final: confirm corpus exercise counts grew as intended and `verify:content` is green.

---

## Self-Review
- **Spec coverage:** E8 weighting → Task 2 brief + enforced by review in Task 3 Step 3; E9 canonical/variant-aware → Task 2; E10 merge validation → Task 1 `validateNewType`; R2 collision-safe ids → Task 1 `assignIds`; E2 gate dependency → prerequisite + Task 3 Step 5.
- **Placeholder scan:** Task 3 is an execution loop (agent dispatch can't be pre-written as code) — its acceptance criteria (dry-run clean, gates green) are concrete. Task 2 lists the exact canonical vocab.
- **Type consistency:** `contentId`/`assignIds`/`validateNewType` names consistent; `GeneratedExerciseSchema` (audio-optional) from 5a is the validation contract.
