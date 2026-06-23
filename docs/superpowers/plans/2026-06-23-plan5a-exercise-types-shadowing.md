# Plan 5a — New Exercise Types + Shadowing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four text-only exercise types (`error_correction`, `conjugation`, `matching`, `multiple_choice`) and a `shadowing` type (MediaRecorder record + side-by-side playback) to the PT learning app, end to end (schema → UI → scoring → tests).

**Architecture:** Extend the canonical Zod discriminated unions in `lib/data/zod-schemas.ts` (Zod 4 — no `.extend()` on a union, rebuild it), wire each type through the same maps/config the existing 8 types use, then add one `components/cards/<Type>Card.tsx` per type dispatched by `ex.type` in `ExerciseRunner.tsx`'s `AnswerableCard`. New types carry **no audio** (`audio` optional in the generated schema; `textsFor` returns `[]`), except `shadowing` which reuses an existing audio hash.

**Tech Stack:** Next.js 16 (RSC; `'use client'` for interactive cards), React 19, TypeScript, Zod 4, Tailwind v4, Dexie + ts-fsrs, vitest.

## Global Constraints

- This is **Next.js 16** — read `node_modules/next/dist/docs/` before adding any page/route code; directories prefixed `_` are private (404). (`AGENTS.md`)
- Cards are client components: first line `"use client";`. Match the existing card pattern in `components/cards/FillBlankCard.tsx` (props `{ ex, onSubmit }`, `useSettings()`, `resolveExerciseData(ex, variant)`).
- The answer contract is `onSubmit(answer: string, correct: boolean)`. `ExerciseRunner.handleAnswer` ignores `answer` and uses `correct`; the standard 4-button `GradePanel` (Otra vez/Difícil/Bien/Fácil) follows every submit.
- Answer normalization (text types): `trim()` + `toLowerCase()` + `.normalize('NFC')`, **accents significant** (matches `FillBlankCard`).
- New types are **text-only**: `audio` is optional in the generated schema, they are NOT added to `AUDIO_REQUIRED`, and `textsFor` returns `[]` (except `shadowing`).
- No new content in this plan — Task data is hand-written fixtures in tests only. Mass content is Plan 5b.
- Tailwind-only styling; reuse existing card classes (`p-8 border-2 border-border rounded-2xl`, `bg-primary`, etc.).
- Commit after every task. Run `npm run typecheck && npm test` before each commit.

---

### Task 1: Schema + config foundation for all 5 new types

Freeze the data contract first so every later task and Plan 5b validate against it. This task adds the type literals, per-type `data` schemas, the three rebuilt discriminated unions with **audio optional** for the new types, and all the config/map wiring the reviewers enumerated (R1, R4).

**Files:**
- Modify: `lib/data/zod-schemas.ts` (enum ~line 13; data schemas; the 3 unions ~240/316/328; `ExerciseDataByTypeSchema` ~line 128; `VariantOverrideByTypeSchema` ~line 172)
- Modify: `scripts/config.ts` (`SCHEMA_VERSION`, `EXERCISES_PER_LESSON`, `TYPE_TO_TEMPLATE`)
- Modify: `scripts/lib/audio-collector.ts` (`textsFor` switch ~line 27-73)
- Modify: `scripts/verify-content.ts` (`AUDIO_REQUIRED` ~line 32 — leave new types OUT; no change needed beyond confirming)
- Test: `tests/unit/exercise-types-schema.test.ts`

**Interfaces:**
- Produces: `ExerciseTypeEnum` now includes `'error_correction' | 'conjugation' | 'matching' | 'multiple_choice' | 'shadowing'`. New `data` shapes:
  - `error_correction`: `{ sentence: string, correct: string, explanationEs: string }`
  - `conjugation`: `{ infinitive: string, person: string, tense: string, answer: string, hintEs: string }`
  - `matching`: `{ pairs: { left: string, right: string }[] }` (min 3, max 6)
  - `multiple_choice`: `{ question: string, options: string[], correctIndex: number, explanationEs: string }` (2–4 options)
  - `shadowing`: `{ text: string, es: string, audioRef?: string }`
- These data objects are the same shape consumed by every Card task and by Plan 5b's agents.

- [ ] **Step 1: Write the failing schema round-trip test**

```ts
// tests/unit/exercise-types-schema.test.ts
import { describe, it, expect } from 'vitest';
import { ExerciseSchema, GeneratedExerciseSchema } from '@/lib/data/zod-schemas';

const base = { id: 'abcd1234', blockId: 2, lessonId: 'b2-l1', difficulty: 1 as const, concepts: [], tags: [] };

describe('new exercise types parse in ExerciseSchema', () => {
  it('error_correction', () => {
    const ex = { ...base, type: 'error_correction', data: { sentence: 'Eu tengo um livro.', correct: 'Eu tenho um livro.', explanationEs: "'tengo' es español; en PT es 'tenho'." } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('conjugation', () => {
    const ex = { ...base, type: 'conjugation', data: { infinitive: 'falar', person: 'eu', tense: 'presente do indicativo', answer: 'falo', hintEs: 'yo hablo' } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('matching', () => {
    const ex = { ...base, type: 'matching', data: { pairs: [{ left: 'obrigado', right: 'gracias' }, { left: 'bom dia', right: 'buenos días' }, { left: 'água', right: 'agua' }] } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('multiple_choice', () => {
    const ex = { ...base, type: 'multiple_choice', data: { question: '¿Cuál es el plural de "pão"?', options: ['pães', 'pãos', 'panes'], correctIndex: 0, explanationEs: "'-ão' → '-ães' en muchos casos." } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('shadowing', () => {
    const ex = { ...base, type: 'shadowing', data: { text: 'Bom dia, tudo bem?', es: 'Buenos días, ¿todo bien?' } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
});

describe('GeneratedExerciseSchema accepts text-only types WITHOUT audio (R1)', () => {
  it('error_correction needs only contentHash, not audio', () => {
    const gen = { ...base, type: 'error_correction', contentHash: 'x', data: { sentence: 'a', correct: 'b', explanationEs: 'c' } };
    expect(GeneratedExerciseSchema.safeParse(gen).success).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/exercise-types-schema.test.ts`
Expected: FAIL — `error_correction` etc. are not in the `ExerciseTypeEnum`, so `ExerciseSchema` rejects them.

- [ ] **Step 3: Add the type literals to the enum**

In `lib/data/zod-schemas.ts`, extend `ExerciseTypeEnum` (after `'lesson',`):

```ts
export const ExerciseTypeEnum = z.enum([
  'flashcard', 'fill_blank', 'listening', 'translation',
  'verb_preposition', 'sentence_construction', 'chunk', 'lesson',
  'error_correction', 'conjugation', 'matching', 'multiple_choice', 'shadowing',
]);
```

- [ ] **Step 4: Add the per-type `data` schemas**

Near the other `*Data` schemas, add:

```ts
export const ErrorCorrectionData = z.object({
  sentence: z.string().min(1), correct: z.string().min(1), explanationEs: z.string().min(1),
});
export const ConjugationData = z.object({
  infinitive: z.string().min(1), person: z.string().min(1), tense: z.string().min(1),
  answer: z.string().min(1), hintEs: z.string().min(1),
});
export const MatchingData = z.object({
  pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })).min(3).max(6),
});
export const MultipleChoiceData = z.object({
  question: z.string().min(1), options: z.array(z.string().min(1)).min(2).max(4),
  correctIndex: z.number().int().nonnegative(), explanationEs: z.string().min(1),
});
export const ShadowingData = z.object({
  text: z.string().min(1), es: z.string().min(1), audioRef: z.string().optional(),
});
```

- [ ] **Step 5: Add the `*Ex` members and rebuild `ExerciseSchema`**

Mirror the existing `BaseExercise.extend({...})` members and append the five to the `ExerciseSchema` discriminated union array:

```ts
const ErrorCorrectionEx = BaseExercise.extend({ type: z.literal('error_correction'), data: ErrorCorrectionData, variantOverrides: z.record(z.string(), VariantOverrideValue).optional() });
const ConjugationEx = BaseExercise.extend({ type: z.literal('conjugation'), data: ConjugationData, variantOverrides: z.record(z.string(), VariantOverrideValue).optional() });
const MatchingEx = BaseExercise.extend({ type: z.literal('matching'), data: MatchingData, variantOverrides: z.record(z.string(), VariantOverrideValue).optional() });
const MultipleChoiceEx = BaseExercise.extend({ type: z.literal('multiple_choice'), data: MultipleChoiceData, variantOverrides: z.record(z.string(), VariantOverrideValue).optional() });
const ShadowingEx = BaseExercise.extend({ type: z.literal('shadowing'), data: ShadowingData, variantOverrides: z.record(z.string(), VariantOverrideValue).optional() });
// add ErrorCorrectionEx, ConjugationEx, MatchingEx, MultipleChoiceEx, ShadowingEx to the ExerciseSchema z.discriminatedUnion array
```

- [ ] **Step 6: Add the `*Gen` members with audio OPTIONAL (R1) and rebuild `GeneratedExerciseSchema`**

The new types extend only `contentHash` (audio optional), unlike the existing `RequiredGeneratedFields`:

```ts
const TextOnlyGeneratedFields = { contentHash: z.string().min(1), audio: AudioRefSchema.optional() };
const ErrorCorrectionGen = ErrorCorrectionEx.extend(TextOnlyGeneratedFields);
const ConjugationGen = ConjugationEx.extend(TextOnlyGeneratedFields);
const MatchingGen = MatchingEx.extend(TextOnlyGeneratedFields);
const MultipleChoiceGen = MultipleChoiceEx.extend(TextOnlyGeneratedFields);
const ShadowingGen = ShadowingEx.extend(TextOnlyGeneratedFields);
// append the five to the GeneratedExerciseSchema z.discriminatedUnion array
```

- [ ] **Step 7: Add the five to `LlmItemSchema` and the type maps**

Append `.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true })` members for the five `*Ex` to the `LlmItemSchema` union. Add entries to `ExerciseDataByTypeSchema` (`error_correction: ErrorCorrectionData`, etc.) and `VariantOverrideByTypeSchema` (use `ErrorCorrectionData.partial()` etc., matching how existing types build their override schema in that map).

- [ ] **Step 8: Wire config + audio-collector**

In `scripts/config.ts` add to `SCHEMA_VERSION` (`error_correction: 1`, … `shadowing: 1`), `EXERCISES_PER_LESSON` (pick the same default the other types use, e.g. `5`), and `TYPE_TO_TEMPLATE` (`error_correction: null`, … `shadowing: null`).
In `scripts/lib/audio-collector.ts` `textsFor`, add cases returning `[]` for `error_correction`/`conjugation`/`matching`/`multiple_choice`, and for `shadowing` return `data.audioRef ? [] : []` (shadowing reuses an existing hash; it does not enqueue new TTS) — i.e. `case 'shadowing': return [];`.

- [ ] **Step 9: Run the test to verify it passes**

Run: `npx vitest run tests/unit/exercise-types-schema.test.ts`
Expected: PASS (6 assertions).

- [ ] **Step 10: Typecheck (exhaustiveness) + full suite + verify**

Run: `npm run typecheck && npm test && npm run verify:content`
Expected: typecheck exit 0 (any `switch(type)` exhaustiveness errors must be fixed here), all tests pass, verify passes. Fix any non-exhaustive switches the compiler flags.

- [ ] **Step 11: Commit**

```bash
git add lib/data/zod-schemas.ts scripts/config.ts scripts/lib/audio-collector.ts tests/unit/exercise-types-schema.test.ts
git commit -m "feat(exercises): schema+config foundation for 5 new types (audio-optional)"
```

---

### Task 2: ErrorCorrectionCard

**Files:**
- Create: `components/cards/ErrorCorrectionCard.tsx`
- Modify: `components/ExerciseRunner.tsx` (`AnswerableCard`, ~line 253-258; import)
- Create: `lib/exercises/normalize.ts` (shared answer normalizer — used by Tasks 2,3)
- Test: `tests/unit/answer-normalize.test.ts`

**Interfaces:**
- Produces: `normalizeAnswer(s: string): string` = `s.trim().toLowerCase().normalize('NFC')`. Consumed by ErrorCorrectionCard, ConjugationCard.
- Consumes: `Exercise`, `resolveExerciseData`, `useSettings` (Task 1 schema).

- [ ] **Step 1: Write the failing normalizer test**

```ts
// tests/unit/answer-normalize.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeAnswer } from '@/lib/exercises/normalize';

describe('normalizeAnswer', () => {
  it('trims and lowercases', () => { expect(normalizeAnswer('  Falo ')).toBe('falo'); });
  it('keeps accents significant', () => { expect(normalizeAnswer('estão')).not.toBe(normalizeAnswer('estao')); });
  it('NFC-normalizes composed vs decomposed', () => {
    expect(normalizeAnswer('ã')).toBe(normalizeAnswer('ã')); // combining vs precomposed
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`normalize.ts` not found)

Run: `npx vitest run tests/unit/answer-normalize.test.ts`

- [ ] **Step 3: Implement the normalizer**

```ts
// lib/exercises/normalize.ts
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().normalize('NFC');
}
export function answersMatch(a: string, b: string): boolean {
  return normalizeAnswer(a) === normalizeAnswer(b);
}
```

- [ ] **Step 4: Run it — expect PASS**

- [ ] **Step 5: Write the card** (mirror `FillBlankCard.tsx`)

```tsx
// components/cards/ErrorCorrectionCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { answersMatch } from "@/lib/exercises/normalize";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ErrorCorrectionCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant) as { sentence: string; correct: string; explanationEs: string };
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const submit = () => { const ok = answersMatch(input, data.correct); setRevealed(true); onSubmit(input, ok); };
  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-sm text-muted-foreground text-center">Corrige el error:</div>
      <div className="text-xl text-center">{data.sentence}</div>
      {!revealed ? (
        <div className="flex gap-2">
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) submit(); }}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background" placeholder="Frase corregida" />
          <button onClick={submit} disabled={!input.trim()} className="px-4 py-2 bg-primary rounded-md font-medium">OK</button>
        </div>
      ) : (
        <div className="text-center text-sm space-y-1">
          <div>Correcto: <span className="font-medium">{data.correct}</span></div>
          <div className="text-muted-foreground">{data.explanationEs}</div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Dispatch in `AnswerableCard`** — add inside `components/ExerciseRunner.tsx` `AnswerableCard`, with the import at top:

```tsx
// import { ErrorCorrectionCard } from "./cards/ErrorCorrectionCard";
if (ex.type === "error_correction") return <ErrorCorrectionCard ex={ex} onSubmit={onAnswer} />;
```

- [ ] **Step 7: Verify build + typecheck**

Run: `npm run typecheck && npm run build`
Expected: exit 0; route table prints.

- [ ] **Step 8: Commit**

```bash
git add components/cards/ErrorCorrectionCard.tsx components/ExerciseRunner.tsx lib/exercises/normalize.ts tests/unit/answer-normalize.test.ts
git commit -m "feat(exercises): error_correction card + answer normalizer"
```

---

### Task 3: ConjugationCard

**Files:**
- Create: `components/cards/ConjugationCard.tsx`
- Modify: `components/ExerciseRunner.tsx` (`AnswerableCard` + import)
- Test: covered by `answer-normalize` (no new logic) — add one card-data render test is optional; skip per YAGNI.

**Interfaces:**
- Consumes: `normalizeAnswer`/`answersMatch` (Task 2), `ConjugationData` shape (Task 1).

- [ ] **Step 1: Write the card** (input-and-check, like Task 2 but prompts with infinitive/person/tense)

```tsx
// components/cards/ConjugationCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { answersMatch } from "@/lib/exercises/normalize";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ConjugationCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { infinitive: string; person: string; tense: string; answer: string; hintEs: string };
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const submit = () => { const ok = answersMatch(input, d.answer); setRevealed(true); onSubmit(input, ok); };
  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-center space-y-1">
        <div className="text-2xl font-medium">{d.infinitive}</div>
        <div className="text-sm text-muted-foreground">{d.person} · {d.tense}</div>
        <div className="text-xs text-muted-foreground">({d.hintEs})</div>
      </div>
      {!revealed ? (
        <div className="flex gap-2">
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) submit(); }}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background" placeholder="Forma conjugada" />
          <button onClick={submit} disabled={!input.trim()} className="px-4 py-2 bg-primary rounded-md font-medium">OK</button>
        </div>
      ) : (
        <div className="text-center text-sm">Correcto: <span className="font-medium">{d.answer}</span></div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Dispatch + import in `AnswerableCard`**

```tsx
// import { ConjugationCard } from "./cards/ConjugationCard";
if (ex.type === "conjugation") return <ConjugationCard ex={ex} onSubmit={onAnswer} />;
```

- [ ] **Step 3: Verify** — `npm run typecheck && npm run build` (exit 0)
- [ ] **Step 4: Commit** — `git add ... && git commit -m "feat(exercises): conjugation card"`

---

### Task 4: MultipleChoiceCard (+ shared OptionsGrid, R10)

**Files:**
- Create: `components/cards/OptionsGrid.tsx` (shared options renderer)
- Create: `components/cards/MultipleChoiceCard.tsx`
- Modify: `components/ExerciseRunner.tsx`
- Test: `tests/unit/options-grid.test.tsx` (renders options, fires onPick with index)

**Interfaces:**
- Produces: `OptionsGrid({ options, onPick }: { options: string[]; onPick: (i: number) => void })`.

- [ ] **Step 1: Write the failing OptionsGrid test**

```tsx
// tests/unit/options-grid.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionsGrid } from '@/components/cards/OptionsGrid';

describe('OptionsGrid', () => {
  it('renders options and reports the picked index', () => {
    const onPick = vi.fn();
    render(<OptionsGrid options={['a', 'b', 'c']} onPick={onPick} />);
    fireEvent.click(screen.getByText('b'));
    expect(onPick).toHaveBeenCalledWith(1);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`OptionsGrid` not found). `npx vitest run tests/unit/options-grid.test.tsx`

- [ ] **Step 3: Implement OptionsGrid**

```tsx
// components/cards/OptionsGrid.tsx
"use client";
interface Props { options: string[]; onPick: (index: number) => void; disabled?: boolean; }
export function OptionsGrid({ options, onPick, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt, i) => (
        <button key={i} disabled={disabled} onClick={() => onPick(i)}
          className="border-2 border-border rounded-md px-4 py-3 text-left hover:bg-muted disabled:opacity-60">
          {opt}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run it — expect PASS**

- [ ] **Step 5: Implement MultipleChoiceCard**

```tsx
// components/cards/MultipleChoiceCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { OptionsGrid } from "./OptionsGrid";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function MultipleChoiceCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { question: string; options: string[]; correctIndex: number; explanationEs: string };
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => { if (picked !== null) return; setPicked(i); onSubmit(d.options[i] ?? "", i === d.correctIndex); };
  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xl text-center">{d.question}</div>
      <OptionsGrid options={d.options} onPick={pick} disabled={picked !== null} />
      {picked !== null && (
        <div className="text-center text-sm text-muted-foreground">{d.explanationEs}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Dispatch + import** in `AnswerableCard`:

```tsx
// import { MultipleChoiceCard } from "./cards/MultipleChoiceCard";
if (ex.type === "multiple_choice") return <MultipleChoiceCard ex={ex} onSubmit={onAnswer} />;
```

- [ ] **Step 7: Verify** — `npm run typecheck && npm test && npm run build`
- [ ] **Step 8: Commit** — `git commit -m "feat(exercises): multiple_choice card + shared OptionsGrid"`

---

### Task 5: MatchingCard (R3 — serializes answer)

**Files:**
- Create: `components/cards/MatchingCard.tsx`
- Modify: `components/ExerciseRunner.tsx`
- Test: `tests/unit/matching-card.test.tsx`

**Interfaces:**
- Consumes: `MatchingData` (Task 1). Calls `onSubmit(JSON.stringify(connections), allCorrect)`.

- [ ] **Step 1: Write the failing test** (connect all pairs correctly → onSubmit with correct=true)

```tsx
// tests/unit/matching-card.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchingCard } from '@/components/cards/MatchingCard';

vi.mock('@/lib/stores/settings', () => ({ useSettings: () => ({ variant: 'pt-br' }) }));
vi.mock('@/lib/exercise-resolver', async (orig) => ({ ...(await orig()), resolveExerciseData: (ex: any) => ex.data }));

const ex = { id: 'x', type: 'matching', data: { pairs: [{ left: 'sim', right: 'sí' }, { left: 'não', right: 'no' }, { left: 'água', right: 'agua' }] } } as any;

describe('MatchingCard', () => {
  it('reports correct=true when every left is connected to its right', () => {
    const onSubmit = vi.fn();
    render(<MatchingCard ex={ex} onSubmit={onSubmit} />);
    // click left then its right, for all pairs
    for (const p of ex.data.pairs) { fireEvent.click(screen.getByText(p.left)); fireEvent.click(screen.getByText(p.right)); }
    expect(onSubmit).toHaveBeenCalledWith(expect.any(String), true);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`MatchingCard` not found)

- [ ] **Step 3: Implement MatchingCard** (tap-left then tap-right to connect; right column shuffled; auto-submits when all left are connected)

```tsx
// components/cards/MatchingCard.tsx
"use client";
import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function MatchingCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { pairs: { left: string; right: string }[] };
  const rights = useMemo(() => [...d.pairs.map(p => p.right)].sort(() => Math.random() - 0.5), [d]);
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [conn, setConn] = useState<Record<string, string>>({}); // left -> right
  const [done, setDone] = useState(false);

  const connect = (right: string) => {
    if (activeLeft === null || done) return;
    const next = { ...conn, [activeLeft]: right };
    setConn(next); setActiveLeft(null);
    if (Object.keys(next).length === d.pairs.length) {
      const allCorrect = d.pairs.every(p => next[p.left] === p.right);
      setDone(true);
      onSubmit(JSON.stringify(next), allCorrect);
    }
  };
  return (
    <div className="p-8 border-2 border-border rounded-2xl">
      <div className="text-sm text-muted-foreground text-center mb-4">Empareja:</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {d.pairs.map(p => (
            <button key={p.left} disabled={done || p.left in conn} onClick={() => setActiveLeft(p.left)}
              className={`w-full border-2 rounded-md px-3 py-2 ${activeLeft === p.left ? 'border-primary' : 'border-border'} ${p.left in conn ? (conn[p.left] === p.right ? 'bg-green-100' : 'bg-red-100') : ''}`}>
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map(r => (
            <button key={r} disabled={done || Object.values(conn).includes(r)} onClick={() => connect(r)}
              className="w-full border-2 border-border rounded-md px-3 py-2 disabled:opacity-50">{r}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test — expect PASS** (`npx vitest run tests/unit/matching-card.test.tsx`)

- [ ] **Step 5: Dispatch + import** in `AnswerableCard`:

```tsx
// import { MatchingCard } from "./cards/MatchingCard";
if (ex.type === "matching") return <MatchingCard ex={ex} onSubmit={onAnswer} />;
```

- [ ] **Step 6: Verify** — `npm run typecheck && npm test && npm run build`
- [ ] **Step 7: Commit** — `git commit -m "feat(exercises): matching card"`

---

### Task 6: ShadowingCard (MediaRecorder, R5)

**Files:**
- Create: `lib/exercises/recorder.ts` (MIME pick + recorder helper — unit-testable pure part)
- Create: `components/cards/ShadowingCard.tsx`
- Modify: `components/ExerciseRunner.tsx`
- Test: `tests/unit/recorder-mime.test.ts`

**Interfaces:**
- Produces: `pickRecorderMime(isSupported: (t: string) => boolean): string | null` — returns the first of `['audio/webm;codecs=opus','audio/mp4','audio/ogg']` that is supported, else `null`.

- [ ] **Step 1: Write the failing MIME-pick test**

```ts
// tests/unit/recorder-mime.test.ts
import { describe, it, expect } from 'vitest';
import { pickRecorderMime } from '@/lib/exercises/recorder';

describe('pickRecorderMime', () => {
  it('prefers webm/opus when supported (Chrome)', () => {
    expect(pickRecorderMime((t) => t.startsWith('audio/webm'))).toBe('audio/webm;codecs=opus');
  });
  it('falls back to audio/mp4 on iOS Safari', () => {
    expect(pickRecorderMime((t) => t === 'audio/mp4')).toBe('audio/mp4');
  });
  it('returns null when nothing is supported', () => {
    expect(pickRecorderMime(() => false)).toBeNull();
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

- [ ] **Step 3: Implement the helper**

```ts
// lib/exercises/recorder.ts
const CANDIDATES = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg'];
export function pickRecorderMime(isSupported: (t: string) => boolean): string | null {
  return CANDIDATES.find(isSupported) ?? null;
}
```

- [ ] **Step 4: Run it — expect PASS**

- [ ] **Step 5: Implement ShadowingCard** (state machine; stops model `<audio>` before recording; useRef stream cleanup; sequential playback; revokeObjectURL; record-only when no `audioRef`)

```tsx
// components/cards/ShadowingCard.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { pickRecorderMime } from "@/lib/exercises/recorder";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ShadowingCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { text: string; es: string; audioRef?: string };
  const modelUrl = d.audioRef ? `/audio/${d.audioRef}.mp3` : null;
  const [phase, setPhase] = useState<"idle" | "recording" | "recorded">("idle");
  const [recUrl, setRecUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const modelAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (recUrl) URL.revokeObjectURL(recUrl);
  }, [recUrl]);

  const playModel = () => { if (modelUrl) { modelAudioRef.current = new Audio(modelUrl); modelAudioRef.current.play(); } };

  const record = async () => {
    setError(null);
    modelAudioRef.current?.pause(); // R5: free the audio session before recording
    if (!navigator.mediaDevices?.getUserMedia) { setError("Tu navegador no permite grabar audio."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickRecorderMime((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: mime ?? "audio/webm" });
        if (recUrl) URL.revokeObjectURL(recUrl);
        setRecUrl(URL.createObjectURL(blob));
        setPhase("recorded");
        stream.getTracks().forEach((t) => t.stop());
      };
      recorderRef.current = rec; rec.start(); setPhase("recording");
    } catch { setError("No se pudo acceder al micrófono."); }
  };

  const stop = () => recorderRef.current?.stop();
  const playRecording = () => { if (recUrl) new Audio(recUrl).play(); };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-sm text-muted-foreground text-center">Escucha y repite (shadowing):</div>
      <div className="text-xl text-center">{d.text}</div>
      <div className="text-sm text-center text-muted-foreground">{d.es}</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {modelUrl && <button onClick={playModel} className="px-4 py-2 border-2 border-border rounded-md">▶ Modelo</button>}
        {phase !== "recording"
          ? <button onClick={record} className="px-4 py-2 bg-primary rounded-md font-medium">🎙 Grabar</button>
          : <button onClick={stop} className="px-4 py-2 bg-red-500 text-white rounded-md font-medium">⏹ Detener</button>}
        {phase === "recorded" && <button onClick={playRecording} className="px-4 py-2 border-2 border-border rounded-md">▶ Mi voz</button>}
      </div>
      {error && <div className="text-center text-sm text-red-600">{error}</div>}
      {phase === "recorded" && (
        <button onClick={() => onSubmit("", true)} className="w-full px-4 py-2 bg-primary rounded-md font-medium">Listo — calificar</button>
      )}
      {phase === "idle" && !modelUrl && (
        <button onClick={() => onSubmit("", true)} className="w-full text-sm text-muted-foreground underline">Saltar grabación</button>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Dispatch + import** in `AnswerableCard`:

```tsx
// import { ShadowingCard } from "./cards/ShadowingCard";
if (ex.type === "shadowing") return <ShadowingCard ex={ex} onSubmit={onAnswer} />;
```

- [ ] **Step 7: Verify automated gates** — `npm run typecheck && npm test && npm run build` (exit 0)

- [ ] **Step 8: Manual smoke (Phase-1 exit criterion)** — Run `npm run dev`, create a temporary shadowing exercise fixture (or point a practice route at one), and on **both** desktop Chrome **and** a real iPhone (Safari): play model, grant mic, record, stop, play back. Confirm no console errors and recording plays. Document the result.

- [ ] **Step 9: Commit**

```bash
git add components/cards/ShadowingCard.tsx lib/exercises/recorder.ts components/ExerciseRunner.tsx tests/unit/recorder-mime.test.ts
git commit -m "feat(exercises): shadowing card (MediaRecorder, iOS-safe MIME)"
```

---

### Task 7: FSRS new-card introduction cap (R6)

Ensure that when Plan 5b adds ~460 new exercises, existing learners aren't flooded — new cards must be rate-limited in the daily mix.

**Files:**
- Read first: `lib/db/repository.ts` (the due/new-card query) and `lib/srs/*` and wherever the daily mix is assembled (search `getDue`, `newCardsPerDay`, `dailyMix`, `interleav`).
- Modify (only if no cap exists): the daily-mix builder + `lib/stores/settings.ts` (a `newCardsPerDay` setting, default 20).
- Test: `tests/unit/daily-mix-newcap.test.ts`

**Interfaces:**
- Produces (if added): the daily mix yields at most `newCardsPerDay` cards in FSRS "new" state per day.

- [ ] **Step 1: Investigate** — `grep -rnE "new|getDue|dailyMix|interleav|perDay" lib/db lib/srs lib/stores | head -40`. Determine whether a new-card cap already exists. If one exists, write a test asserting it and STOP (no code change); if not, continue.

- [ ] **Step 2: Write the failing test** (only if no cap exists) — given 100 new cards available and `newCardsPerDay = 20`, the mix contains ≤ 20 new cards.

```ts
// tests/unit/daily-mix-newcap.test.ts
import { describe, it, expect } from 'vitest';
import { capNewCards } from '@/lib/srs/daily-mix';
describe('capNewCards', () => {
  it('limits new cards to the configured per-day cap', () => {
    const newCards = Array.from({ length: 100 }, (_, i) => ({ id: String(i), state: 'new' as const }));
    expect(capNewCards(newCards, 20).length).toBe(20);
  });
});
```

- [ ] **Step 3: Implement `capNewCards`** in `lib/srs/daily-mix.ts` (or fold into the existing mix builder) and apply it where the mix is assembled. Wire `newCardsPerDay` from settings (default 20).

```ts
// lib/srs/daily-mix.ts
export function capNewCards<T>(newCards: T[], cap: number): T[] {
  return newCards.slice(0, Math.max(0, cap));
}
```

- [ ] **Step 4: Run test — expect PASS**; then `npm run typecheck && npm test && npm run build`.
- [ ] **Step 5: Commit** — `git commit -m "feat(srs): cap new-card introduction per day"`

---

## Self-Review

- **Spec coverage:** Phase 1 of the design (5 new types + shadowing) → Tasks 1–6. R1 (audio-optional) → Task 1 Step 6. R3 (matching/shadowing contract) → Tasks 5/6. R4 (wiring checklist) → Task 1 Steps 3–8. R5 (MediaRecorder) → Task 6. R6 (new-card flood) → Task 7. R9 (normalization) → Task 2. R10 (shared options grid) → Task 4. Phase 2 (content) and Phase 3 (richer lessons) are **separate plans (5b, 5c)** — not covered here by design.
- **Placeholder scan:** none — every code step has complete code; manual-smoke step (Task 6 Step 8) is an explicit human action, not a code placeholder.
- **Type consistency:** `onSubmit(answer: string, correct: boolean)` used uniformly; `resolveExerciseData(ex, variant)` cast per type; `normalizeAnswer`/`answersMatch` names consistent across Tasks 2–3; `pickRecorderMime` consistent in Task 6.

## Follow-on plans (write after 5a lands)
- **5b — Mass content:** per-block Sonnet subagents → `bN.staged.json` (no ids) → `merge-staged.ts` (reuse `contentId()` + global uniqueness check, R2) → verify+gate+build. Quality rubric R8; canonical `tense` vocabulary R8.
- **5c — Richer lessons:** `<VerbConjugation verb tense forms>` (data-driven, R7) + static vocab MDX section; regenerate the 36 lessons; anti-bleed gate already guards writes.
