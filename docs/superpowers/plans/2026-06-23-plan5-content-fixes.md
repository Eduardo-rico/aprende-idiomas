# Content Fixes Implementation Plan (pre-5b, no audio)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Fix the correctness issues the expert linguistic + pedagogy review found, without regenerating any audio, and harden the content gate — so the mass-content generation (Plan 5b) builds on a correct, guarded base.

**Architecture:** Resolver-level fix for the PT-PT variant mislabel (no id churn); extend the content gate with English-bleed + structural checks; hand-correct the diagnostic, `esContrast`, and MDX factual errors; add diagnostic ceiling items. All changes are to text/logic — never to an audio-bearing field (TTS'd: `flashcard.back`, `listening.audioText`, `translation` source/target, story variant text, lesson `<Example>` pt).

**Tech Stack:** TypeScript, Zod 4, vitest. Content is committed JSON/MDX under `lib/data/languages/pt/`.

## Global Constraints

- **No new audio.** Never edit an audio-bearing field (see above). If a needed fix touches one, leave it and note it in the plan's deferred list — do not edit it.
- `variantOverrides` is part of the content-id hash, so **do not rename keys in committed JSON** (it would orphan Dexie progress). Fix variant handling in the resolver only.
- Run `npm run typecheck && npm test && npm run verify:content` before every commit.
- Covers design-doc resolutions E1, E2, E3, E4, E5, E13. (E6/E7/E8/E9/E10/E11/E12 belong to 5a/5b/5c/5d.)

---

### Task 1: Fix PT-PT variant resolution (E1)

The legacy migration put European-PT overrides under `variantOverrides["pt-br"]` (`lib/data/variant.ts`). The resolver only uses that key for the legacy `"pt"` alias, so `pt-pt` users get BR base and `pt-br` users get European overrides wrongly applied. Fix the resolver to treat the `"pt-br"`-keyed legacy override as European (`pt-pt`), and stop applying it to `pt-br`/`br`.

**Files:**
- Modify: `lib/exercise-resolver.ts` (`isLegacyPtAlias` ~line 59, `resolveExerciseData` ~line 64)
- Modify: `lib/data/variant.ts` (`ptOverridesToVariantOverrides` — emit `"pt-pt"` for future conversions)
- Modify: `scripts/lib/audio-collector.ts` (`textsFor` legacy comment/branch, mirror the resolver)
- Test: `tests/unit/variant-resolution.test.ts`

**Interfaces:**
- Produces: `resolveExerciseData(ex, "pt-pt")` applies `variantOverrides["pt-pt"] ?? variantOverrides["pt-br"]`; `resolveExerciseData(ex, "pt-br")` and `"br"` apply **no** legacy override (return base).

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/variant-resolution.test.ts
import { describe, it, expect } from 'vitest';
import { resolveExerciseData } from '@/lib/exercise-resolver';

// An exercise whose only override is the legacy European text under "pt-br".
const ex = {
  id: 'x', type: 'flashcard', blockId: 7, lessonId: 'b7-l1', difficulty: 1, concepts: [], tags: [],
  data: { front: 'estoy hablando', back: 'estou falando' }, // BR base
  variantOverrides: { 'pt-br': { back: 'estou a falar' } },  // legacy European, mislabeled
} as any;

describe('variant resolution (E1)', () => {
  it('pt-pt user gets the European override', () => {
    expect((resolveExerciseData(ex, 'pt-pt') as any).back).toBe('estou a falar');
  });
  it('pt-br user gets the BR base, NOT the European override', () => {
    expect((resolveExerciseData(ex, 'pt-br') as any).back).toBe('estou falando');
  });
  it('legacy "pt" alias still maps to European', () => {
    expect((resolveExerciseData(ex, 'pt') as any).back).toBe('estou a falar');
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`pt-pt` returns base; `pt-br` returns the override). `npx vitest run tests/unit/variant-resolution.test.ts`

- [ ] **Step 3: Fix the resolver**

In `lib/exercise-resolver.ts`, replace the `isLegacyPtAlias` + override-selection logic:

```ts
// The legacy migration (lib/data/variant.ts) stored European-PT overrides under
// the "pt-br" key. So the "pt-br"-keyed override is actually European (pt-pt),
// and BR is the base (ex.data). We must NOT apply it to pt-br/br users.
const LEGACY_EUROPEAN_KEY = "pt-br";
function europeanFallback(variant: VariantKey): boolean {
  return variant === "pt-pt" || variant === "pt";
}

export function resolveExerciseData(ex: Exercise, variant: VariantKey): ResolvedData {
  const overrides = ex.variantOverrides?.[variant]
    ?? (europeanFallback(variant) ? ex.variantOverrides?.[LEGACY_EUROPEAN_KEY] : undefined);
  if (!overrides) return ex.data as ResolvedData;
  const validOverride = VariantOverrideByTypeSchema[ex.type].parse(overrides);
  const merged = { ...ex.data, ...validOverride };
  return ExerciseDataByTypeSchema[ex.type].parse(merged) as ResolvedData;
}
```

(Note: when `variant === "pt-br"`, `ex.variantOverrides?.["pt-br"]` still matches on the first line. Guard it: only use a direct match for non-legacy keys.) Replace the first line with:

```ts
  const direct = variant === LEGACY_EUROPEAN_KEY ? undefined : ex.variantOverrides?.[variant];
  const overrides = direct
    ?? (europeanFallback(variant) ? ex.variantOverrides?.[LEGACY_EUROPEAN_KEY] : undefined);
```

- [ ] **Step 4: Run the test — expect PASS**

- [ ] **Step 5: Stop future mislabeling** — in `lib/data/variant.ts`, change the legacy branch from `return { "pt-br": input.ptOverrides };` to `return { "pt-pt": input.ptOverrides };`. In `scripts/lib/audio-collector.ts` `textsFor`, mirror the same european-fallback logic if it resolves overrides (match the resolver's behavior so audio selection agrees).

- [ ] **Step 6: Full gates** — `npm run typecheck && npm test && npm run verify:content` (all green).

- [ ] **Step 7: Commit**

```bash
git add lib/exercise-resolver.ts lib/data/variant.ts scripts/lib/audio-collector.ts tests/unit/variant-resolution.test.ts
git commit -m "fix(variant): pt-pt users get European overrides; pt-br gets BR base (E1)"
```

---

### Task 2: Extend the content gate — English bleed + structural checks (E2)

`latin-guard` only blocks non-Latin scripts. Add an English-word heuristic and a fill_blank structural check, wired into `verify-content` as hard errors, so the same bug class can't recur in 5b's mass generation.

**Files:**
- Create: `scripts/lib/content-guard.ts`
- Modify: `scripts/verify-content.ts` (add the two checks to the bleed/validation section)
- Test: `tests/unit/content-guard.test.ts`

**Interfaces:**
- Produces:
  - `findEnglishWords(text: string): string[]` — returns matched English stopwords (whole-word, case-insensitive) from a curated list that does not collide with PT/ES.
  - `blankCountMismatch(ex): boolean` — true if a `fill_blank` exercise's `sentence` blank count ≠ its `blanks.length`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/content-guard.test.ts
import { describe, it, expect } from 'vitest';
import { findEnglishWords, blankCountMismatch } from '@/scripts/lib/content-guard';

describe('findEnglishWords', () => {
  it('flags stray English words', () => {
    expect(findEnglishWords('Eu the dei o livro')).toContain('the');
    expect(findEnglishWords('Ela gave os contactos')).toContain('gave');
  });
  it('does not flag Portuguese/Spanish', () => {
    expect(findEnglishWords('Eu tenho um livro e ela tem dois')).toEqual([]);
    expect(findEnglishWords('La canción es muy bonita')).toEqual([]);
  });
});

describe('blankCountMismatch', () => {
  it('flags a fill_blank whose blanks length != number of ___ in sentence', () => {
    const ex = { type: 'fill_blank', data: { sentence: 'eu ___ lembrar ___ daquela', blanks: [{ answer: 'me' }] } } as any;
    expect(blankCountMismatch(ex)).toBe(true);
  });
  it('passes a well-formed fill_blank', () => {
    const ex = { type: 'fill_blank', data: { sentence: 'eu ___ daquela', blanks: [{ answer: 'gosto' }] } } as any;
    expect(blankCountMismatch(ex)).toBe(false);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`content-guard` not found)

- [ ] **Step 3: Implement the guard**

```ts
// scripts/lib/content-guard.ts
// English words that are NOT also valid PT/ES words. Curated to avoid false
// positives (e.g. "a", "o", "e", "de", "no", "me", "se", "tem" are PT/ES).
const ENGLISH_STOPWORDS = new Set([
  'the', 'and', 'with', 'this', 'that', 'these', 'those', 'have', 'has', 'had',
  'will', 'would', 'should', 'gave', 'give', 'given', 'they', 'them', 'their',
  'because', 'about', 'into', 'from', 'which', 'what', 'when', 'where', 'while',
  'announcing', 'sweatshirt', 'however', 'therefore',
]);
export function findEnglishWords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-záàâãéêíóôõúç]+/gi) ?? [];
  return words.filter((w) => ENGLISH_STOPWORDS.has(w));
}
export function blankCountMismatch(ex: { type: string; data?: { sentence?: string; blanks?: unknown[] } }): boolean {
  if (ex.type !== 'fill_blank') return false;
  const sentence = ex.data?.sentence ?? '';
  const blanks = ex.data?.blanks ?? [];
  const n = (sentence.match(/___/g) ?? []).length;
  return n !== blanks.length;
}
```

- [ ] **Step 4: Run it — expect PASS**

- [ ] **Step 5: Wire into verify-content** — in `scripts/verify-content.ts`, in the per-block loop, for each exercise push an error when `findEnglishWords` finds anything in any string field (reuse a deep walk like `findNonLatinDeep`, but for English) or when `blankCountMismatch(ex)` is true. Example:

```ts
import { findEnglishWords, blankCountMismatch } from './lib/content-guard';
// inside the block-exercise loop:
const enHits = findEnglishWords(JSON.stringify(ex.data) + ' ' + (ex.esContrast ?? ''));
if (enHits.length) errors.push(`${ex.id}: English bleed: ${[...new Set(enHits)].join(' ')}`);
if (blankCountMismatch(ex)) errors.push(`${ex.id}: fill_blank blank/answer count mismatch.`);
```

- [ ] **Step 6: Run verify to surface the existing bleed** — `npm run verify:content`. Expect errors listing the known cases (b3 `the`, b10 `gave`, b4 mismatch). These are fixed in Tasks 3/5; leave them failing for now or fix inline if trivial.

- [ ] **Step 7: typecheck + tests, then Commit**

```bash
git add scripts/lib/content-guard.ts scripts/verify-content.ts tests/unit/content-guard.test.ts
git commit -m "feat(gate): English-bleed + fill_blank structural checks in verify (E2)"
```

---

### Task 3: Fix broken diagnostic items (E3)

**Files:**
- Modify: `lib/data/languages/pt/diagnostic.json`
- Test: `tests/unit/diagnostic-integrity.test.ts`

- [ ] **Step 1: Write the failing integrity test**

```ts
// tests/unit/diagnostic-integrity.test.ts
import { describe, it, expect } from 'vitest';
import diag from '@/lib/data/languages/pt/diagnostic.json';
import concepts from '@/lib/data/languages/pt/concepts.json';

const conceptIds = new Set((concepts as { id: string }[]).map((c) => c.id));

describe('diagnostic integrity', () => {
  for (const q of (diag as any).questions) {
    it(`${q.id}: options unique, correctIndex valid, conceptId known`, () => {
      expect(new Set(q.options).size).toBe(q.options.length);            // no dup options
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(conceptIds.has(q.conceptId)).toBe(true);                    // valid concept
    });
  }
});
```

- [ ] **Step 2: Run it — expect FAIL** for `q10b02` (dup "pães") and `q19` (conceptId). `npx vitest run tests/unit/diagnostic-integrity.test.ts`

- [ ] **Step 3: Apply the fixes in `diagnostic.json`**
  - `q03b01` (nasal vowel; mão+pão both nasal): replace a distractor so only one option is nasal — change `mão` → `sol`.
  - `q10b02` (plural of pão): options had `pães` twice → set options to `["pãos","pães","pões","pãis"]`, `correctIndex: 1`.
  - `q08b01` (H pronounced): H is silent in all four → change the prompt to "Em qual palavra o H é MUDO?" and set any/all-correct framing, OR replace with a clear single-answer item; simplest: prompt "Em qual palavra o dígrafo soa /ʃ/?" options `["chave","hora","casa","rua"]`, `correctIndex: 0`.
  - `q19` (existential ter): accept BR — change the "incorrect" framing so `"Tem muitos livros na estante"` is not marked wrong (pick a genuinely wrong option as the answer), and set `conceptId` to the real id `b3-existenciais` (verify the exact id in concepts.json).
  - `q06` (caballo→cavalo is ll→v, not ll→lh): retag `conceptId` to the correct correspondence concept (verify in concepts.json) or replace with a true ll→ch item (`llave→chave`).

- [ ] **Step 4: Run the integrity test + scorer tests — expect PASS** (`npm test`).
- [ ] **Step 5: Commit** — `git commit -m "fix(diagnostic): broken/ambiguous items + conceptId (E3)"`

---

### Task 4: Fix esContrast + MDX factual errors (E4)

These are display-only text fields (not audio). Fix the specific errors and add a regression test that the known-wrong strings are gone.

**Files:**
- Modify: `lib/data/languages/pt/blocks/b6.json` (the `ligación` / `acalentar` notes), `b1.json` (the /h/ and r notes), `b8.json` (`por isso` claim), `b2.json` (`casi que`)
- Modify: `lib/data/languages/pt/mdx/b1/l3-correspondencias.mdx` (ll→ch), `lib/data/languages/pt/mdx/b2/l2-genero-gramatical.mdx` (-ma)
- Test: `tests/unit/escontrast-regressions.test.ts`

- [ ] **Step 1: Write the failing regression test** (asserts the wrong strings are absent across all blocks + the two MDX files)

```ts
// tests/unit/escontrast-regressions.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const D = 'lib/data/languages/pt';
const allText = [
  ...fs.readdirSync(`${D}/blocks`).filter(f => /^b\d+\.json$/.test(f)).map(f => fs.readFileSync(`${D}/blocks/${f}`, 'utf8')),
  fs.readFileSync(`${D}/mdx/b1/l3-correspondencias.mdx`, 'utf8'),
  fs.readFileSync(`${D}/mdx/b2/l2-genero-gramatical.mdx`, 'utf8'),
].join('\n');

describe('esContrast / MDX factual regressions (E4)', () => {
  it('no invented Spanish word "ligación"', () => { expect(allText).not.toMatch(/ligación/i); });
  it('no wrong ll→lh correspondence claim', () => { expect(allText).not.toMatch(/'ll'[^.]*'lh'/); });
  it('no "-ma siempre masculino" overgeneralization', () => { expect(allText).not.toMatch(/-ma['"]?,?\s*¡?seguro\s+es\s+masculino/i); });
  it('no "acalentar" = calentar confusion', () => { expect(allText).not.toMatch(/acalentar/i); });
});
```

- [ ] **Step 2: Run it — expect FAIL**

- [ ] **Step 3: Apply the corrections** (verbatim guidance — confirm exact current strings with grep first):
  - `b6.json` `ligación` notes → `"Falso amigo: PT 'ligar' = llamar por teléfono / encender; ES 'ligar' = ligar/atar. 'ligação' = llamada o conexión."`
  - `b6.json` `acalentar` note → `"'aquecer' = calentar."`
  - `b1.json` r-note → `"BR: 'r' inicial ≈ [h]/[x] (como 'house' en inglés); PT europeo ≈ [ʁ] uvular o vibrante."` (esContrast only; do NOT touch any `back`/audio field)
  - `b8.json` → drop the false `"'por isso' es una sola palabra"` claim.
  - `b2.json` → simplify the `casi que` note to `"'quase' = casi."`
  - `mdx/b1/l3-correspondencias.mdx` → change the rule to ES `ll` → PT **`ch`** (`'llave' → 'chave'`, `'llamar' → 'chamar'`); remove the contradictory ll→lh sentence.
  - `mdx/b2/l2-genero-gramatical.mdx` → change the `-ma` Tip to: `"Muchos cultismos en -ma de origen griego (problema, tema, sistema) son masculinos; pero 'a cama', 'a forma' son femeninos."`
  - Make any `esContrast` you touch Spanish (not PT).

- [ ] **Step 4: Run the regression test + verify:content — expect PASS** (`npm test && npm run verify:content`)
- [ ] **Step 5: Commit** — `git commit -m "fix(content): esContrast + MDX factual errors (E4)"`

---

### Task 5: Fix malformed exercises + surviving English bleed (E5 + the E2 cases)

**Files:**
- Modify: `lib/data/languages/pt/blocks/b3.json` (`e1e393b7` example: `the`→`lhe`), `b4.json` (malformed verb_preposition; mixed ES/PT translation source), `b10.json` (`fc80a430` `front`: `gave`)
- (No test file — Task 2's gate is the test; it must pass after these fixes.)

- [ ] **Step 1: Confirm the items** — `grep -n "Eu the dei" lib/data/languages/pt/blocks/b3.json; grep -n "lembrar ___" lib/data/languages/pt/blocks/b4.json; grep -n "fizemos nada especial" lib/data/languages/pt/blocks/b4.json; grep -n "gave os contactos" lib/data/languages/pt/blocks/b10.json`

- [ ] **Step 2: Fix each (text-only; do NOT touch the `back` of b10 fc80a430 — that's audio, deferred):**
  - b3 `e1e393b7` `data.example`: `"Eu the dei o livro."` → `"Eu lhe dei o livro."`
  - b4 malformed `verb_preposition` (`"Ontem, eu me ___ lembrar ___ daquela música antiga."`): rewrite to a single, well-formed blank consistent with `blanks` (e.g. sentence `"Ontem, eu me ___ daquela música antiga."` with one blank answer `lembrei`), OR remove the exercise if it can't be salvaged cleanly.
  - b4 mixed-source translation (`"Durante las vacaciones, no fizemos nada especial, mas curtimos muito."`): if `source` is meant to be Spanish, make it Spanish (`"Durante las vacaciones, no hicimos nada especial, pero disfrutamos mucho."`); confirm `source` is NOT audio-bearing for this translation direction (`translation_pt_es` → audio is on `source`=PT; if so this IS audio-bearing → **defer** and only fix the bleed in a non-audio field). Verify direction before editing.
  - b10 `fc80a430` `data.front`: `"...'Ela gave os contactos do escritório.'"` → replace `gave` with `tem`/`deu` as fits the prompt (front is text-only).

- [ ] **Step 3: Run the gate — expect 0 English-bleed / structural errors** (`npm run verify:content`)
- [ ] **Step 4: Commit** — `git commit -m "fix(content): malformed exercises + English bleed (E5)"`

---

### Task 6: Add diagnostic ceiling items B4/B6/B8 (E13)

So prior learners can place beyond B3.

**Files:**
- Modify: `lib/data/languages/pt/diagnostic.json` (add ~6 MCQ items: 2 each for B4 past tenses, B6 subjuntivo, B8 sintaxis/colocação)
- Modify (if the scorer hard-codes block coverage): `lib/srs/` diagnostic scorer / `lib/data/.../diagnostic` consumer — check `tests/unit/diagnostic-scorer.test.ts` to see the expected `blockId` distribution and update it.

- [ ] **Step 1: Read the scorer + its test** — `grep -rnE "blockId|recommend|coverage" lib/srs lib/data tests/unit/diagnostic-scorer.test.ts | head`. Understand how `correctIndex`/`blockId`/`conceptId` are consumed and whether adding higher-block items breaks the recommendation logic.

- [ ] **Step 2: Add 6 items** (text MCQ, no audio), each with valid `conceptId` (from concepts.json), unique options, in-range `correctIndex`. Example B4 item:

```json
{ "id": "q21b04", "blockId": 4, "conceptId": "b4-perfeito-irregular",
  "prompt": "Pretérito perfeito de 'fazer' (eu):",
  "options": ["fiz", "fazi", "fez", "fazei"], "correctIndex": 0 }
```

(Write two for B4, two for B6 — e.g. presente do conjuntivo of 'ser' → 'seja' — and two for B8 — e.g. próclise trigger after 'não'. Use the exact concept ids present in concepts.json.)

- [ ] **Step 3: Run integrity (Task 3) + scorer tests — expect PASS**; update the scorer test's expected distribution if needed.
- [ ] **Step 4: Commit** — `git commit -m "feat(diagnostic): ceiling items for B4/B6/B8 placement (E13)"`

---

## Self-Review

- **Spec coverage:** E1 → Task 1; E2 → Task 2; E3 → Task 3; E4 → Task 4; E5 → Task 5; E13 → Task 6. E6/E7/E8/E9/E10/E11/E12 are explicitly out (5a/5b/5c/5d).
- **Placeholder scan:** Tasks 4/5/6 require the implementer to confirm exact current strings/ids with `grep` before editing (stated as Step 1 of each) — this is deliberate (the wrong strings must be matched exactly), not a placeholder; the corrections themselves are given verbatim.
- **Type consistency:** `findEnglishWords`/`blankCountMismatch` names consistent between Task 2's code and its wiring; `resolveExerciseData` signature unchanged in Task 1.
- **Audio safety:** Tasks 4/5 call out the one risky field (b10 `back`, b4 translation `source` if PT) as **defer, do not edit** — consistent with the no-audio constraint.

## Sequencing
Run **before Plan 5b** (the gate extension E2 must guard mass generation). Order: Task 2 (gate) → Tasks 3/4/5 (fixes the gate now flags) → Task 1 (variant) → Task 6 (diagnostic). Task 1 is independent and can run any time.
