# Agent Content Brief — Plan 5b mass content (text-only, no audio)

You generate **text-only** practice exercises for one curriculum block of an app
that teaches **Brazilian + European Portuguese to Spanish speakers**. Output a
JSON array written to `lib/data/languages/pt/blocks/b{N}.staged.json`.

## Output contract (what `merge-staged.ts` requires)

Each array element is an exercise object with EXACTLY these envelope fields:

- `type` — one of the allowed types below
- `lessonId` — a **real lesson id of this block** (you are given the list)
- `difficulty` — `1` | `2` | `3`
- `concepts` — non-empty array of **real conceptIds of this block** (given)
- `tags` — array of short kebab/lowercase strings (e.g. `["falso-amigo"]`, `["regular"]`)
- `data` — the per-type shape below (verbatim field names)
- `esContrast` — *(optional, Spanish)* the specific ES→PT interference
- `variantOverrides` — *(optional)* `{ "pt-pt": { ...partial data... } }` for European forms

Do **NOT** emit `id`, `blockId`, `contentHash`, or `audio` — the merge assigns them.

## Allowed types (NO flashcard / listening / shadowing — those need audio)

```
error_correction : { sentence: string, correct: string, explanationEs: string }
conjugation      : { infinitive: string, person: string, tense: string, answer: string, hintEs: string }
matching         : { pairs: { left: string, right: string }[] }   // 3–6 pairs, every `right` UNIQUE
multiple_choice  : { question: string, options: string[2..4], correctIndex: number, explanationEs: string }  // options unique, index in range
translation      : { source: string, target: string, sourceLang: "es", targetLang: "pt-br", acceptedAlternatives?: string[] }
fill_blank       : { sentence: string (with ___), blanks: { position: number, answer: string, alternatives?: string[] }[] }  // #___ === blanks.length
verb_preposition : { verb: string, sentence: string (one ___), options: string[2+], answer: string }
```

## Weighting per block (E8)

- `error_correction` ≈ 10
- `conjugation` ≈ 10 (verb blocks **b3–b7** lean higher; non-verb blocks fewer)
- `multiple_choice` **≤ 3** (only genuine discrimination items, not trivia)
- `matching` **≤ 3** (or 0 — low pedagogical value, keep minimal)
- `translation` / `fill_blank` / `verb_preposition` ≈ 15 total extra

## Canonical vocabulary (E9) — use these labels EXACTLY

`tense` (closed set): `presente do indicativo`, `pretérito perfeito`,
`pretérito imperfeito`, `mais-que-perfeito`, `futuro do presente`,
`futuro composto`, `condicional`, `presente do conjuntivo`,
`imperfeito do conjuntivo`, `futuro do conjuntivo`, `infinitivo pessoal`,
`gerúndio`. (BR synonym "subjuntivo" may appear in `hintEs`/`esContrast` prose,
but the `tense` field uses "conjuntivo".)

`person` (closed set): `eu`, `tu`, `você`, `ele/ela`, `nós`, `vocês`, `eles/elas`.

**Variant-aware conjugation:** when the `tu` (PT-PT) and `você` (BR) forms differ,
put the BR form in base `answer` and the European form in
`variantOverrides["pt-pt"].answer`. Example: falar/presente/2ª →
base `answer: "fala"` (você), `variantOverrides: { "pt-pt": { answer: "falas" } }` (tu).

## esContrast / error rubric (R8)

Every `esContrast` / `explanationEs` / `hintEs` is **in Spanish** and names the
SPECIFIC interference. `error_correction.sentence` must contain an error a Spanish
speaker actually makes; `correct` is the single uncontroversial fix
(`sentence !== correct`). Common interferences to draw from:

- `tengo` → `tenho`; `muy` → `muito`; `está hablando` → `está falando`
- régimen: `gostar DE`, `precisar DE`, `pensar EM`, `lembrar-se DE`
- `buscar` → `procurar`; `embarazada` → `grávida` (falso amigo)
- spelling: `ll` → `lh`/`ch`, `-ón` → `-ão`, `-ción` → `-ção`
- `você` + 3ª pessoa (not 2ª): `você fala` (not `você falas`)
- género: `o problema`, `a viagem`, `o leite`, `a árvore`

## Hard rules

- **Portuguese and Spanish only.** No English words, no other writing systems —
  the gate (latin-guard + content-guard) rejects them and the merge fails.
- `matching` `right` values must be unique (ambiguity fails E10).
- `multiple_choice` options unique, `correctIndex` in range.
- Output valid JSON (an array), nothing else.

## Gold examples

```json
[
  { "type": "error_correction", "lessonId": "<lesson>", "difficulty": 2,
    "concepts": ["<concept>"], "tags": ["falso-amigo"],
    "esContrast": "régimen: 'gostar' pide 'de' en PT.",
    "data": { "sentence": "Eu gosto música brasileira.",
              "correct": "Eu gosto de música brasileira.",
              "explanationEs": "'gostar' en PT exige la preposición 'de' (gostar DE), a diferencia de 'gustar' en español." } },

  { "type": "conjugation", "lessonId": "<lesson>", "difficulty": 1,
    "concepts": ["<concept>"], "tags": ["regular","-ar"],
    "data": { "infinitive": "falar", "person": "você", "tense": "presente do indicativo",
              "answer": "fala", "hintEs": "tú/usted hablas" },
    "variantOverrides": { "pt-pt": { "answer": "falas" } } },

  { "type": "multiple_choice", "lessonId": "<lesson>", "difficulty": 2,
    "concepts": ["<concept>"], "tags": ["plural"],
    "data": { "question": "¿Cuál es el plural de 'pão'?",
              "options": ["pães", "pãos", "panes"], "correctIndex": 0,
              "explanationEs": "Muchos sustantivos en '-ão' hacen el plural en '-ães' (pão→pães)." } },

  { "type": "translation", "lessonId": "<lesson>", "difficulty": 2,
    "concepts": ["<concept>"], "tags": ["cotidiano"],
    "data": { "source": "Voy a la playa con mis amigos.",
              "target": "Vou à praia com os meus amigos.",
              "sourceLang": "es", "targetLang": "pt-br",
              "acceptedAlternatives": ["Vou para a praia com os meus amigos."] } }
]
```
