# Plan 5c — Richer Lessons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make the 36 lessons pedagogically richer — a data-driven `<VerbConjugation>` table, a vocabulary section, and contrastive tables — **without changing any audio-bearing `<Example>` line** (so no TTS regeneration).

**Architecture:** Add MDX custom components, then enrich existing lesson MDX by *inserting* new blocks (vocab, conjugation, contrast tables) around the untouched `<Example>` lines via a pure insertion function. Conjugation/contrast data is generated (gated) or hand-curated; `<Example>` strings stay byte-identical.

**Tech Stack:** Next.js 16 (client MDX components), React 19, Zod 4, MDX (`@next/mdx`), vitest. Addresses design-doc E7 (real gap) + R7 (data-driven, no dictionary lookup).

## Global Constraints

- **No audio.** `<Example index={n} audioRef={n} pt="..." es="..." />` lines are audio-bearing — the enrichment must leave them **byte-for-byte unchanged**. Insert new blocks before the first `<Example>` or after the last one; never edit an Example.
- Lesson MDX custom components are client-side (`components/lessons/mdx-components.tsx` factory `lessonMdxComponents`, used by the `'use client'` `LessonRenderer`). New components register there.
- The anti-bleed gate (latin-guard, now + English via content-fixes) guards lesson writes; rerun `verify:content` after enrichment.
- `<VerbConjugation>` is **data-driven** (forms passed as props in the MDX) — `fallback-dictionary.ts` is word→gloss, it has NO conjugation tables, so no runtime lookup.
- Run `npm run typecheck && npm test && npm run build` before each commit.

---

### Task 1: `<VerbConjugation>` MDX component (data-driven, R7)

**Files:**
- Create: `components/lessons/VerbConjugation.tsx`
- Modify: `components/lessons/mdx-components.tsx` (`lessonMdxComponents` factory — register it alongside `Example, Tip, Rule`)
- Test: `tests/unit/verb-conjugation.test.tsx`

**Interfaces:**
- Produces: `VerbConjugation({ verb, tense, forms }: { verb: string; tense: string; forms: { person: string; form: string }[] })` — renders a labeled 6-row table.

- [ ] **Step 1: Write the failing render test**

```tsx
// tests/unit/verb-conjugation.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VerbConjugation } from '@/components/lessons/VerbConjugation';

describe('VerbConjugation', () => {
  it('renders verb, tense and each person→form row', () => {
    render(<VerbConjugation verb="falar" tense="presente do indicativo"
      forms={[{ person: 'eu', form: 'falo' }, { person: 'tu', form: 'falas' }]} />);
    expect(screen.getByText(/falar/)).toBeTruthy();
    expect(screen.getByText('falo')).toBeTruthy();
    expect(screen.getByText('falas')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**. `npx vitest run tests/unit/verb-conjugation.test.tsx`

- [ ] **Step 3: Implement the component**

```tsx
// components/lessons/VerbConjugation.tsx
interface Props { verb: string; tense: string; forms: { person: string; form: string }[]; }
export function VerbConjugation({ verb, tense, forms }: Props) {
  return (
    <div className="my-4 border-2 border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-muted text-sm font-medium">{verb} — {tense}</div>
      <table className="w-full text-sm">
        <tbody>
          {forms.map((f, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-4 py-1.5 text-muted-foreground w-1/3">{f.person}</td>
              <td className="px-4 py-1.5 font-medium">{f.form}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Register in `lessonMdxComponents`** — in `components/lessons/mdx-components.tsx`, import `VerbConjugation` and add it to the returned map (`return { Example: ExampleWithAudio, Tip, Rule, VerbConjugation };`).

- [ ] **Step 5: Run test + build — expect PASS** (`npx vitest run tests/unit/verb-conjugation.test.tsx && npm run build`)

- [ ] **Step 6: Commit** — `git add components/lessons/VerbConjugation.tsx components/lessons/mdx-components.tsx tests/unit/verb-conjugation.test.tsx && git commit -m "feat(lessons): data-driven VerbConjugation MDX component (5c Task1)"`

---

### Task 2: Vocabulary-section insertion (preserves audio Examples)

**Files:**
- Create: `scripts/lib/enrich-mdx.ts` (pure insertion helpers)
- Create: `scripts/enrich-lessons.ts` (CLI applying them)
- Test: `tests/unit/enrich-mdx.test.ts`

**Interfaces:**
- Produces: `insertBlock(mdx: string, block: string): string` — inserts `block` immediately before the first `<Example` line (or appends if none), leaving every `<Example>` line unchanged. `buildVocabMdx(items: { pt: string; es: string }[]): string` — a static `### Vocabulário` MDX list.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/enrich-mdx.test.ts
import { describe, it, expect } from 'vitest';
import { insertBlock, buildVocabMdx } from '@/scripts/lib/enrich-mdx';

const mdx = `<Rule title="x">regla</Rule>\n\n<Example index={0} audioRef={0} pt="A" es="B" />\n`;

describe('insertBlock', () => {
  it('inserts before the first Example and never alters Example lines', () => {
    const out = insertBlock(mdx, buildVocabMdx([{ pt: 'água', es: 'agua' }]));
    expect(out).toContain('### Vocabulário');
    expect(out.indexOf('### Vocabulário')).toBeLessThan(out.indexOf('<Example'));
    expect(out).toContain('<Example index={0} audioRef={0} pt="A" es="B" />'); // byte-identical
  });
  it('is idempotent (does not double-insert)', () => {
    const once = insertBlock(mdx, buildVocabMdx([{ pt: 'água', es: 'agua' }]));
    const twice = insertBlock(once, buildVocabMdx([{ pt: 'água', es: 'agua' }]));
    expect(twice).toBe(once);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

- [ ] **Step 3: Implement `scripts/lib/enrich-mdx.ts`**

```ts
// scripts/lib/enrich-mdx.ts
export function buildVocabMdx(items: { pt: string; es: string }[]): string {
  const lines = items.map((i) => `- **${i.pt}** — ${i.es}`).join('\n');
  return `### Vocabulário\n\n${lines}\n`;
}
export function insertBlock(mdx: string, block: string): string {
  if (mdx.includes(block.trim().split('\n')[0])) return mdx; // idempotent on the heading
  const idx = mdx.indexOf('<Example');
  if (idx === -1) return `${mdx.trimEnd()}\n\n${block}\n`;
  return `${mdx.slice(0, idx)}${block}\n\n${mdx.slice(idx)}`;
}
```

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Implement `scripts/enrich-lessons.ts`** (CLI `--write`): for each lesson MDX under `lib/data/languages/pt/mdx/`, look up its lesson's `vocabKey` (from `lessons/*.json` / `curriculum.ts`), resolve each word's ES gloss from `vocab-catalog.json` (fallback `fallback-dictionary.ts`), build the vocab block with `buildVocabMdx`, and `insertBlock`. Validate the result with `assertLatinScript` (+ English guard) before writing. Skip words with no gloss (log them).

- [ ] **Step 6: Apply + verify** — `bash scripts/with-env.sh npx tsx scripts/enrich-lessons.ts --write`, then `npm run verify:content` (0 bleed) and `git diff --stat` to confirm only insertions (no `<Example>` changes — `git diff` shows only added lines around examples).

- [ ] **Step 7: Commit** — `git add lib/data/languages/pt/mdx scripts/enrich-lessons.ts scripts/lib/enrich-mdx.ts tests/unit/enrich-mdx.test.ts && git commit -m "feat(lessons): vocabulary section (audio Examples untouched) (5c Task2)"`

---

### Task 3: Conjugation tables in verb lessons (b3–b7) + contrastive tables

**Files:**
- Modify: `scripts/enrich-lessons.ts` (add a conjugation-table pass for verb-block lessons)
- Test: `tests/unit/enrich-conjugation.test.ts`

**Interfaces:**
- Produces: `buildVerbConjugationMdx(verb, tense, forms): string` → `<VerbConjugation verb="..." tense="..." forms={[...]} />` MDX literal (forms a JS-array literal the MDX parser accepts).

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/enrich-conjugation.test.ts
import { describe, it, expect } from 'vitest';
import { buildVerbConjugationMdx } from '@/scripts/lib/enrich-mdx';

describe('buildVerbConjugationMdx', () => {
  it('emits a parseable VerbConjugation MDX tag with forms', () => {
    const out = buildVerbConjugationMdx('falar', 'presente do indicativo', [{ person: 'eu', form: 'falo' }]);
    expect(out).toContain('<VerbConjugation');
    expect(out).toContain('verb="falar"');
    expect(out).toContain('"person":"eu"');
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

- [ ] **Step 3: Implement `buildVerbConjugationMdx`** in `scripts/lib/enrich-mdx.ts`

```ts
export function buildVerbConjugationMdx(verb: string, tense: string, forms: { person: string; form: string }[]): string {
  return `<VerbConjugation verb="${verb}" tense="${tense}" forms={${JSON.stringify(forms)}} />`;
}
```

- [ ] **Step 4: Generate the forms (gated)** — in `scripts/enrich-lessons.ts`, for each lesson in blocks 3–7, identify the lesson's target verb+tense (from the lesson `name`/`conceptIds`/`vocabKey`), generate the 6 canonical-person forms via the LLM (`callLlm`, MiniMax-M3) constrained to the canonical `tense`/`person` vocabulary (Plan 5b/E9), validate each form with `assertLatinScript`, and `insertBlock` the `buildVerbConjugationMdx` result. Variant-aware: when tu/você forms differ, prefer the BR (`você`) row and note PT in the contrast table. Cache forms by `{verb,tense}` hash to avoid re-calling.

- [ ] **Step 5: Apply + verify** — run `enrich-lessons.ts --write`; confirm verb lessons (b3–b7) now render a conjugation table, `<Example>` lines unchanged, `verify:content` green, `npm run build` green.

- [ ] **Step 6: Commit** — `git commit -m "feat(lessons): conjugation tables in verb lessons b3-b7 (5c Task3)"`

---

## Self-Review
- **Spec coverage:** E7 (richer lessons real gap) → Tasks 1–3; R7 (data-driven VerbConjugation, no dict lookup) → Task 1 + `buildVerbConjugationMdx`; vocab section → Task 2.
- **Audio safety:** `insertBlock` test asserts `<Example>` lines are byte-identical and insertion happens before them; Step 6/5 verifies via `git diff`.
- **Placeholder scan:** Task 3 Step 4 (form generation) is a gated LLM pass with explicit constraints (canonical vocab, assertLatinScript, cache) — concrete, not a placeholder.
- **Type consistency:** `VerbConjugation` props match `buildVerbConjugationMdx` output (`verb`, `tense`, `forms:{person,form}[]`); `insertBlock`/`buildVocabMdx`/`buildVerbConjugationMdx` names consistent across tasks.
