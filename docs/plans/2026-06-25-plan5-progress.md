# Plan 5 — Progress & Resume State

> Durable, repo-tracked progress record for Plan 5 (shadowing + new exercise
> types + mass content + richer lessons + SRS/engagement). The per-plan
> implementation specs live in `docs/superpowers/plans/2026-06-23-plan5*.md`;
> the master design doc is `docs/plans/2026-06-23-plan5-shadowing-content-design.md`.
> Local SDD ledgers (`.superpowers/sdd/plan5*-progress.md`) are git-ignored
> scratch — this file is the committed source of truth.

_Last updated: 2026-06-25._

## Status at a glance

| Sub-plan | Spec file | Status |
|---|---|---|
| content-fixes | `plan5-content-fixes.md` | ✅ done — merged to main |
| 5a — exercise types + shadowing | `plan5a-exercise-types-shadowing.md` | ✅ done — merged to main |
| 5b — mass content | `plan5b-mass-content.md` | 🔄 infra + **b2** done; **b3–b10 pending** |
| 5c — richer lessons | `plan5c-richer-lessons.md` | ⬜ not started |
| 5d — SRS / engagement | `plan5d-srs-engagement.md` | ⬜ not started |

Execution note: content-fixes, 5a, and 5b so far were run **inline** (not
subagent-driven) because the account monthly spend limit blocked subagent
dispatch. Each sub-plan was shipped green (`typecheck` + full `vitest` +
`verify:content` + `build`).

## content-fixes ✅ (merged `a941b1c..3f3995f`)

E1 variant resolver (pt-pt→European / pt-br→base), E2 English-bleed + structural
gate in `verify-content` (audio-aware: deferred warnings for audio-bearing
fields), E3 diagnostic repairs, E4 esContrast/MDX factual fixes, E5
malformed-exercise + bleed fixes, E13 diagnostic ceiling items B4/B6/B8.

## 5a ✅ (merged `3f3995f..5dfaf64`)

Five exercise types end-to-end: `error_correction`, `conjugation`
(variant-aware answers, E9), `matching`, `multiple_choice` (+ shared
`OptionsGrid`), `shadowing` (MediaRecorder, iOS-safe MIME, self-checks E11).
Schema in `lib/data/zod-schemas.ts` (audio-optional generated types, R1); cards
in `components/cards/`; helpers `lib/exercises/{normalize,recorder}.ts`.
Task 7 (new-card cap) was a verified **no-op** — the cap already exists
(`buildDueQueue`), is wired (`FSRS_CONFIG.new_cards_per_day=10` in /learn +
/review), and is tested (`review-queue.test.ts`).

## 5b 🔄 (merged `5dfaf64..1efbdb9`) — infra + b2; b3–b10 remain

Tooling done:
- `scripts/lib/staged-validate.ts` — `contentId`/`contentHash` reuse the
  pipeline `hashKey` (byte-identical ids); `validateNewType` (E10);
  `assignIds` collision-safe vs the whole corpus (R2).
- `scripts/merge-staged.ts` — `--block N [--write]`. Validates lessonId ∈ block,
  conceptIds, `difficulty`, the anti-bleed gate, and the final shape against
  **`ExerciseSchema`** (not `GeneratedExerciseSchema`).
- `scripts/prompts/agent-content-brief.md` — shapes, canonical tense/person
  (E9), ES→PT interference rubric (R8), per-block weighting (E8).

Content done: **b2** — 24 text-only items (10 error_correction, 3 MC, 2
matching, 9 fill_blank). `b2.json` 204→228.

### How to resume b3–b10 (per block N)

1. Author `lib/data/languages/pt/blocks/bN.staged.json` — a JSON array of items,
   each with `type`, `data`, `lessonId` (a real lesson of block N), `concepts`,
   `tags`, `difficulty`; optionally `esContrast` / `variantOverrides`. **No**
   `id`/`blockId`/`audio`/`contentHash` (the merge assigns them). Follow
   `scripts/prompts/agent-content-brief.md`. (Inline = author directly;
   subagent-driven = one Sonnet agent per block writes this file.)
2. Dry-run: `npx tsx scripts/merge-staged.ts --block N` → expect 0 problems.
3. Merge: `npx tsx scripts/merge-staged.ts --block N --write`.
4. Gates: `npm run typecheck && npm test && npm run verify:content && npm run build`.
5. `git add lib/data/languages/pt/blocks/bN.json && rm bN.staged.json && commit`.

### 5b deviations (driven by the no-audio constraint)

1. **`translation` excluded** — it is in `AUDIO_REQUIRED` and its generated
   schema requires audio; incompatible with no-audio. Generatable text-only set:
   `error_correction`, `conjugation`, `matching`, `multiple_choice`,
   `fill_blank`, `verb_preposition`. `conjugation` weights into verb blocks b3–b7.
2. `merge-staged` validates with `ExerciseSchema` — the whole corpus stores
   `fill_blank` (360) and `verb_preposition` (180) **without** audio.
3. Staged items carry `lessonId`/`difficulty` (the brief's "no lessonId" was
   underspecified; the merge needs lesson placement).
4. `EXERCISES_PER_LESSON` / `TYPE_TO_TEMPLATE` for the 5 new types remain `null`
   from 5a — 5b uses staged files, not the classic LLM `generate-content`
   pipeline, so they aren't needed unless that pipeline is later wired.

## 5c ⬜ — richer lessons (not started)

Data-driven `<VerbConjugation>` MDX component (R7), vocabulary section, and
contrast tables, **inserted around the untouched audio-bearing `<Example>`
lines** (no TTS regeneration). Spec: `plan5c-richer-lessons.md`.

## 5d ⬜ — SRS / engagement (not started)

Interleaving (E6), new-card floor, leech threshold 8→5, XP decoupling (E12).
Spec: `plan5d-srs-engagement.md`. Open note from 5a Task 7: `computeRecommendation`
defaults `recommendedStart=1` when no block fails (a learner who passes
everything places at block 1) — revisit here.

## Carry-overs / pending human action

- **Audio round** (deferred; the gate flags these as warnings): `b4 04e3860e`
  translation (its BR/PT audio was generated from the **Spanish** `target` —
  needs target→PT-BR + TTS regen); `b10 fc80a430` `back` + `c753a69c` BR
  `audioText` still contain English (their pt-pt overrides are already clean).
- **5a shadowing device smoke** — record/playback on a real iPhone (Safari) +
  desktop Chrome; not doable headless.
- **Pre-existing flaky suite test** — full suite failed ~1/10 runs with no
  reproducible test (not introduced by 5a/5b); worth hunting down.
- **Spend limit** — raising it re-enables subagent-driven execution (faster,
  with independent per-task review) for b3–b10 and 5c/5d.
