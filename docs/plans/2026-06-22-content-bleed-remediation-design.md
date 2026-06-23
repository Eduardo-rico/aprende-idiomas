# Content Bleed Remediation — Design

> **Status:** approved (user, 2026-06-22).
> **Scope:** PT content quality. Fix systemic multilingual "bleed" (stray
> Chinese/Cyrillic/other-script characters) injected by the generation LLM,
> and prevent recurrence.

## Problem

`MiniMax-M2.5-highspeed` injected characters from other writing systems into
generated content. A full scan found bleed across **all** generated content,
not just lessons:

- ~23 exercise entries across 7 blocks (b1, b3, b4, b5, b6, b8, b10) — both in
  audio/display fields (`pt`, `front`, `target`) and in hint/`esContrast` fields.
- Examples: `de砖om concreto`, `Moi相似的 mais non idéntico`, `região`→`регион`.
- 1 story (b10-s2), and 7 lessons (already hand-fixed in 7e9762b).

Root cause: the `highspeed` model is unreliable, and nothing in the pipeline
rejects non-Latin output.

## Decisions (locked with user)

| # | Decision |
|---|---|
| 1 | Add an anti-bleed **gate** that rejects non-Latin-script output and is enforced as a hard **error** in `verify:content`. |
| 2 | Switch the default generation model to **`MiniMax-M3`** (non-highspeed; probed valid). The gate is model-independent. |
| 3 | **Repair** the existing corpus surgically (per-string correction via M3), not by regenerating whole blocks. |
| 4 | Do **not** change lesson structure (no vocab section, no `<VerbConjugation>`) this round. |

## Components

### 1. `scripts/lib/latin-guard.ts`
- `findNonLatin(text): string[]` → list of offending characters (outside ASCII +
  Latin-1/Latin-Extended accents + common punctuation + IPA block + arrows used
  pedagogically). Empty list = clean.
- `assertLatinScript(text, label)` → throws if non-Latin found.
- Unit-tested: accepts PT/ES accents (ã, ç, é…), IPA (ʃ), arrows (→); rejects
  CJK (桥), Cyrillic (с), Hangul, etc.

### 2. Wiring (prevention)
- `prompt-runner.ts`: items whose string fields contain non-Latin go to
  `rejected` (same path as Zod failures) — never cached, never shipped.
- `generate-lessons.ts`: `assertLatinScript` on the rendered MDX before write.
- `verify-content.ts`: non-Latin in any content field is a hard **error**
  (was: a soft GC warning). Nothing bleedy can pass the gates again.

### 3. Model
- `scripts/config.ts`: default `LLM_MODEL` → `MiniMax-M3` (env override kept).

### 4. `scripts/repair-bleed.ts` (existing corpus)
- Scan blocks + stories + lessons for non-Latin string values.
- For each, ask M3 to return the corrected string (same meaning, target language
  inferred from context, zero non-Latin chars), gate-checked.
- Write back in place. Re-sync audio (`generate:audio`) only for blocks whose
  `pt`/audio text changed; GC orphans afterward.

## Verification
- New unit tests for `latin-guard` pass.
- `verify:content` (STRICT) reports 0 bleed errors after repair.
- Full gates: typecheck, tests, verify, build. Then commit + push.

## Out of scope
- Subtle Spanish-in-Portuguese bleed that is pure-Latin (not detectable by the
  script gate) — mitigated by the M3 upgrade for future generation.
- Lesson enrichment (vocab/VerbConjugation).
