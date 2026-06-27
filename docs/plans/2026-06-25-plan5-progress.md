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
| 5b — mass content | `plan5b-mass-content.md` | ✅ **b2–b8 + b10 done** (b9 = freeDrill, no exercises). Linguist + pedagogue review applied. |
| 5c — richer lessons | `plan5c-richer-lessons.md` | ✅ done — VerbConjugation component + vocab sections + 11 conjugation tables (audio untouched) |
| 5d — SRS / engagement | `plan5d-srs-engagement.md` | ✅ done — interleaving, new-card floor, leech 8→5, XP decoupling |

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

Content done:
- **b2** — 24 text-only items (10 error_correction, 3 MC, 2 matching, 9
  fill_blank). `b2.json` 204→228.
- **b3** (presente, verbos) — 27 items (13 conjugation variant-aware
  você/tu, 7 error_correction, 4 fill_blank, 3 MC incl. 2 imperativo).
  `b3.json` 204→231.
- **b4** (pasado: perfeito/imperfeito/mais-que-perfeito) — 25 items
  (13 conjugation, 6 error_correction, 3 fill_blank, 3 MC). 255→280.
- **b5** (futuro/condicional) — 25 items (13 conjugation, 6 ec, 3 fb, 3 MC). 204→229.
- **b6** (conjuntivo presente/imperfeito/futuro) — 25 items
  (13 conjugation, 6 ec, 3 fb, 3 MC). 260→285.
- **b7** (infinitivo pessoal/gerúndio/particípio) — 25 items
  (10 conjugation, 8 ec, 4 fb, 3 MC). Particípio via ec/fb/MC (no está en el
  set de `tense`). 148→173.
- **b8** (sintaxis: conectores/subordinadas/colocação/discurso indireto) — 24
  items (12 ec, 7 MC, 4 fb, 1 matching; sin conjugation). 204→228.
- **b10** (registro + variação BR↔PT) — 25 items (12 MC, 5 ec, 6 fb, 2 matching). 102→127.
- **b9** — skip permanente: es `freeDrill` (léxico sobre el catálogo de vocab),
  no tiene lecciones ni conceptos a los que adjuntar ejercicios.

### Revisión experta aplicada (5b-b3..b10)

Dos subagentes (lingüista PT-BR/PT-PT+ES, pedagogo SLA) revisaron los 148 items
de los 4 tipos gramaticalmente sensibles (conjugation/error_correction/MC/
matching). **0 blockers / 0 altas.** Fixes aplicados: errores artificiales →
calcos reales del español (`tuvo`, `falaré`, `voy`, `entonces`, y en b6 forma
ES→PT del conjuntivo: `venga→venha`, `viniera→viesse`, `estudie→estude`,
`tengan→tenham`); `ganhado→ganho` (debatible) reemplazado por `ponhado→posto`;
doble preposición `desde de manhã`→`desde manhã`; distractor `escrevudo`→
`escripto`; matching `cara→senhor`→`pra→para`; recalibración de dificultad; y
+2 items de imperativo en b3 (la lección l3 no tenía ninguno). Se rechazó el
fix sugerido de `haver→há` (el alternativo `tem→há` sería incorrecto: `tem`
existencial es válido en BR).

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

## 5c ✅ — richer lessons (done)

Data-driven `<VerbConjugation>` MDX component (R7) + a `### Vocabulário`
section per lesson + conjugation tables for the 11 verb lessons of b3–b7,
**inserted before the first `<Example>` so the audio lines stay
byte-identical** (312 insertions, 0 deletions — no TTS regen). Infra in
`scripts/lib/enrich-mdx.ts` (insertBlock idempotent + buildVocabMdx +
buildVerbConjugationMdx) and the `scripts/enrich-lessons.ts --write` CLI
(glosses from `vocab-catalog.json`, validates with assertLatinScript + the
English guard). **Deviation from the spec:** conjugation forms are
hand-curated BR paradigms, not LLM-generated (deterministic, no MiniMax
dep). Contrast tables (the 3rd spec sub-item) were NOT added — the existing
`<Rule>` prose + the per-exercise `esContrast` already cover ES↔PT contrast;
revisit if a dedicated table is wanted. Shipped green + Playwright-verified.

## 5d ✅ — SRS / engagement (done)

All four pedagogy fixes shipped: E6 interleaving (`lib/srs/interleave.ts`
+ wired into `/review`; `/learn` daily mix routes to `/review`), E12
new-card floor (`new_cards_floor: 3`, total may exceed cap by the floor),
leech threshold 8→5, and XP decoupled from the FSRS rating
(Hard/Good/Easy all → 2, Again → 0). Pure logic/config; 594 vitest green.
**Still open** (carried from 5a Task 7, NOT addressed here):
`computeRecommendation` defaults `recommendedStart=1` when no block fails —
a learner who passes everything places at block 1. Revisit separately.

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
