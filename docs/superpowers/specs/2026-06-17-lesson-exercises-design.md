# Lessons-before-exercises — Design Spec

> **Status:** approved (brainstorm Sections 1-4 signed off 2026-06-17).
> **Author:** brainstorm session, user + Claude.
> **Target branch:** `feature/lesson-exercises` (worktree).
> **Scope:** PT only (the only lang with content). RU/RO/CS unchanged.

## Contexto

La app hoy tiene 10 bloques curriculares con N lecciones cada uno. Cada lección tiene
objetivos, conceptos cubiertos y una cola de exercises (FSRS-spaced). El estudiante
entra a `/pt/practice/[lessonId]`, ve el primer exercise y empieza a responder.

**Problema:** los conceptos (verbos regulares, subjuntivo, pronombres, etc.) se
presentan en la pantalla de objetivos de `/pt/blocks/[id]/lessons/[lid]` como una
lista seca, sin ejemplos resueltos. El estudiante llega al ejercicio sin entender
**cómo funciona** la regla gramatical — solo sabe **qué** tiene que hacer.

**Hipótesis:** mostrar una explicación con 3-5 ejemplos resueltos ANTES del primer
exercise, una sola vez por lección, mejora la retención sin agregar fricción
porque el repaso es opt-in.

**Outcome:** el estudiante llega al exercise con el modelo mental cargado.
Puede repasar la lección cuando quiera desde `/pt/review`. Las lecciones
existen solo para PT (los scaffolds de ru/ro/cs siguen vacíos).

## Decisiones del brainstorm (locked)

| # | Decisión | Razón |
|---|---|---|
| 1 | `ExerciseType = "lesson"` entra a la discriminated union | Reusa la infra de `EXERCISES_PER_LESSON`, `ExerciseRunner`, `AnswerEvent`. No agrega una capa paralela. |
| 2 | Repaso manual via botón "Repasar lección" (no intraday, no SRS) | YAGNI. La lesson es lectura, no memoria espaciada. |
| 3 | Contenido LLM-generado por bloque | Reusa el pipeline de generate-content. Manualmente 1 lección de prueba = 30 min; LLM = 2 min. |
| 4 | Formato MDX | Componentes custom (`<Example>`, `<Tip>`, `<VerbConjugation>`). Audio inline via marcadores `__AUDIO_n__`. |
| 5 | 1 archivo MDX por lección | Mapea 1:1 con `Lesson.id`. Reutiliza el campo `conceptNotesPath` del curriculum. |
| 6 | TTS pre-generado para los ejemplos resueltos | Audio consistente entre estudiantes, sin latencia en reproducción. Costo MiniMax trivial (~$0.15 total). |

## Data shape

### ExerciseType enum (extensión)

```ts
// lib/data/zod-schemas.ts
export const ExerciseTypeEnum = z.enum([
  "flashcard",
  "fill_blank",
  "listening",
  "translation",
  "verb_preposition",
  "sentence_construction",
  "chunk",
  "lesson",  // NEW
]);
```

### LessonData (nuevo)

```ts
export const LessonDataSchema = z.object({
  kind: z.literal("lesson"),
  lessonId: z.string().regex(/^b\d+-[\w-]+$/),  // "b1-regulares-ar"
  blockId: z.number().int().positive(),
  mdxPath: z.string().regex(/^b\d+\/l[\w-]+\.mdx$/),
  audioRefs: z.record(z.string(), z.array(z.object({
    hash: z.string().min(1),
    voice: z.string().min(1),
  })).default({}),
  exampleCount: z.number().int().nonnegative().default(0),
});
```

### SCHEMA_VERSION + EXERCISES_PER_LESSON

**Importante:** estos records viven en `scripts/config.ts:82-118` (no en `lib/exercises/schema.ts` como decía el primer draft del spec — ese directorio no existe).

```ts
// scripts/config.ts (extender las definiciones existentes)
export const SCHEMA_VERSION: Record<ExerciseType, number> = {
  flashcard: 1, fill_blank: 1, listening: 1, translation: 1,
  verb_preposition: 1, sentence_construction: 1, chunk: 1,
  lesson: 1,  // NEW
};

export const EXERCISES_PER_LESSON: Record<ExerciseType, number | null> = {
  flashcard: 15, fill_blank: 10, listening: 5, translation: 8,
  verb_preposition: 5, sentence_construction: null, chunk: null,
  lesson: 1,  // NEW — solo 1 lesson step por lección
};
```

### Lessons manifest (PT)

**Decisión revisada:** NO usamos un manifest JSON consolidado. En su lugar
reutilizamos el patrón existente: `lib/data/languages/pt/lessons/bN.json`
(ya existen `b2.json`–`b10.json`). Cada `Lesson` con `conceptNotesPath` es
la fuente de verdad.

`loadAllLessons(lang)` walks el directorio y devuelve el array plano de
`Lesson` con `conceptNotesPath !== ""`. El audio refs (TTS) se almacena
en un archivo nuevo `lib/data/languages/pt/lessons/audio-refs.json`
generado por el script de audio, con esta forma:

```
lib/data/languages/pt/lessons/audio-refs.json
{
  "b1-regulares-ar": {
    "blockId": 1,
    "title": "Verbos regulares en -AR",
    "exampleCount": 3,
    "audioRefs": {
      "pt-br": [
        { "hash": "abc123", "voice": "pt-BR-female" },
        { "hash": "def456", "voice": "pt-BR-female" },
        { "hash": "ghi789", "voice": "pt-BR-female" }
      ]
    }
  },
  ...
}
```

(Una entrada por lección con MDX, generada por `generate-lessons-content.ts`.)

### MDX format (frontmatter + custom components)

```mdx
---
lessonId: b1-regulares-ar
blockId: 1
title: "Verbos regulares en -AR"
exampleCount: 3
---

# Verbos regulares en -AR

En portugués, los verbos terminados en **-AR** siguen un patrón
de conjugación regular en el presente del indicativo.

<Rule title="Patrón general">
Quitar la terminación `-ar` y agregar: `-o, -as, -a, -amos, -ais, -am`
</Rule>

## Ejemplos resueltos

<Example index={0} pt="Eu falo português." es="Yo hablo portugués." audioRef={0} />
<Example index={1} pt="Tu falas com o João." es="Tú hablas con João." audioRef={1} />
<Example index={2} pt="Eles falam inglês e espanhol." es="Ellos hablan inglés y español." audioRef={2} />

<Tip>
La terminación `-amos` es la misma para nosotros en español y portugués.
¡Es el único verbo regular que coincide!
</Tip>

## Practica ahora

Ahora que viste el patrón, intentá conjugar vos mismo.
```

### Custom components

| Tag | Props | Render |
|---|---|---|
| `<Example index={0} pt="..." es="..." audioRef={0} />` | index, pt, es, audioRef? | Card con index (1/3), ambos idiomas, botón play si `audioRef` está en `audioRefs[variant]`. |
| `<Tip>` | children | Callout amarillo con icono 💡 |
| `<Rule title="...">` | title?, children | Box con borde lateral, título opcional. |
| `<VerbConjugation verb="falar" tense="presente" />` | verb, tense | Tabla 6×1 con la conjugación completa. Lookup en `FALLBACK_DICTIONARY`. |

**Marker replacement `__AUDIO_n__`**: el renderer reemplaza el placeholder en el MDX
con un `<LessonAudioPlayer hash={audioRefs[variant][n].hash} voice={...} />`. Esto
permite al LLM generar MDX sin saber los hashes reales — los marcadores se
resuelven en runtime.

## API & renderer

### Server route

```
GET /api/lessons/[lang]/[lessonId]
→ 200 { lessonId, blockId, mdxPath, audioRefs, exampleCount, duration? }
→ 400 si lang !== "pt" (los scaffolds no tienen lessons)
→ 404 si lessonId no existe en lessons-manifest.json
→ 500 si falla la lectura del JSON
```

Handler:
```ts
// app/api/lessons/[lang]/[lessonId]/route.ts
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; lessonId: string }> }
) {
  const { lang, lessonId } = await params;
  if (!hasLocale(lang) || lang !== "pt") return new Response(null, { status: 400 });
  const manifest = await loadLessonsManifest(lang);
  const entry = manifest[lessonId];
  if (!entry) return new Response(null, { status: 404 });
  return Response.json({ lessonId, ...entry });
}
```

### LessonRenderer (client component)

```tsx
// components/lessons/LessonRenderer.tsx
"use client";
export function LessonRenderer({
  lessonId, blockId, lang, variant,
}: { lessonId: string; blockId: number; lang: LanguageId; variant: VariantKey }) {
  const [data, setData] = useState<LessonApiResponse | null>(null);
  useEffect(() => {
    const cached = sessionStorage.getItem(`lesson:${lessonId}`);
    if (cached) { setData(JSON.parse(cached)); return; }
    fetch(`/api/lessons/${lang}/${lessonId}`).then(r => r.json()).then(d => {
      sessionStorage.setItem(`lesson:${lessonId}`, JSON.stringify(d));
      setData(d);
    });
  }, [lessonId, lang]);
  if (!data) return <LessonSkeleton />;
  return <MDXRemote {...mdxSource(data.mdxPath, lang)} components={lessonComponents(variant, data.audioRefs)} />;
}
```

### LessonStep (wrapper con "Entendi")

```tsx
// components/lessons/LessonStep.tsx
"use client";
export function LessonStep({ lessonId, blockId, lang, variant, onComplete }: ...) {
  return (
    <div className="space-y-6">
      <LessonRenderer lessonId={lessonId} blockId={blockId} lang={lang} variant={variant} />
      <div className="border-t pt-4 flex justify-end">
        <Button onClick={onComplete} size="lg">
          Entendi, ahora practicar →
        </Button>
      </div>
    </div>
  );
}
```

### ExerciseRunner switch

```ts
// components/ExerciseRunner.tsx
case "lesson": {
  return (
    <LessonStep
      lessonId={ex.data.lessonId}
      blockId={ex.data.blockId}
      lang={lang}
      variant={variant}
      onComplete={async () => {
        await fetch(`/api/lessons/${lang}/${ex.data.lessonId}/complete`, { method: "POST" });
        onAnswer({ kind: "lesson", result: "lesson_complete" });
      }}
    />
  );
}
```

`AnswerEvent.kind = "lesson"` es una nueva variante del enum. **No toca FSRS** —
solo se registra en la tabla `events` para analítica (cuántas lessons vio el
estudiante, tiempo en pantalla, etc.).

## UI integration

### Tres puntos de entrada

| Punto | URL | Comportamiento |
|---|---|---|
| **A. Vista de lección** | `/pt/blocks/[id]/lessons/[lid]` | Panel "📖 Explicación + ejemplos" arriba de objetivos. Botón "Leer lección →" togglea un `LessonRenderer` inline (no navega). |
| **B. Antes del primer exercise** | `/pt/practice/[lessonId]` | `LessonGate` chequea `getLessonView(lang, lessonId)`. Si `completedAt === null` → `LessonStep` + botón "Entendi" → POST `/api/lessons/.../complete` → re-render con children (exercise queue). Si `completedAt` set → exercise queue directo. |
| **C. Repaso manual** | `/pt/review` | Sección "Lecciones para repasar" arriba de las cards FSRS. Lista lessons con `viewCount >= 1`, ordenadas por `lastViewedAt` asc. Click "Repasar" → `/pt/lessons/[lessonId]` standalone. |

### Persistencia: tabla `lessonViews` (Dexie v7)

```ts
// lib/db/schema.ts
type LessonView = {
  id: string;             // PK compuesta: `${lang}:${lessonId}`
  lang: LanguageId;
  lessonId: string;
  blockId: number;
  firstViewedAt: number;  // epoch ms
  lastViewedAt: number;
  viewCount: number;
  completedAt: number | null;
};

// v7 stores:
this.version(7).stores({
  ...v6Stores,
  lessonViews: "id, lang, blockId, [lang+blockId], lastViewedAt",
});
```

**Migration v6→v7**: no-op body. `lessonViews` arranca vacía.

### Ruta standalone `/pt/lessons/[lessonId]`

```tsx
// app/[lang]/lessons/[lessonId]/page.tsx (server component)
export default async function LessonStandalonePage({
  params,
}: { params: Promise<{ lang: string; lessonId: string }> }) {
  const { lang: rawLang, lessonId } = await params;
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : "pt";
  // No gate — siempre visible
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { href: `/${lang}`, label: "Inicio" },
        { href: `/${lang}/review`, label: "Repaso" },
        { label: manifest[lessonId].title },  // del lessons-manifest.json
      ]} />
      <LessonStep
        lessonId={lessonId}
        blockId={/* from lessons-manifest */ 0}
        lang={lang}
        variant={"pt-br"}
        onComplete={async () => {
          "use server";
          await markLessonCompletedAction(lang, lessonId);
        }}
      />
    </div>
  );
}
```

`markLessonCompletedAction` es un server action que llama a un API interno
(`/api/lessons/.../complete`) porque Dexie es client-only y el server action
necesita hidratarse igual. Más simple: el cliente hace el fetch directo, no
server action.

### `/pt/review` — sección "Repasar lección"

```tsx
// app/[lang]/review/page.tsx — nuevo bloque arriba
const lessonsToReview = await getLessonViewsForReview(lang, blockId);
// → devuelve lessons con viewCount >= 1, ordenadas por lastViewedAt asc
if (lessonsToReview.length > 0) {
  return (
    <>
      <section>
        <h2>📖 Repasar lección</h2>
        <ul>
          {lessonsToReview.map(l => (
            <li key={l.lessonId}>
              <h3>{l.lessonTitle}</h3>
              <p>Vista {l.viewCount} veces — última vez hace {daysAgo(l.lastViewedAt)} días</p>
              <Link href={`/${lang}/lessons/${l.lessonId}`}>Repasar</Link>
            </li>
          ))}
        </ul>
      </section>
      <hr />
      <SrsReviewCards />  {/* lo que ya estaba */}
    </>
  );
}
```

## Scripts

### `scripts/generate-lessons-content.ts`

Lee `--lang=pt` (no-op para otros), itera sobre las lessons del curriculum, y por cada una:

1. Carga los `concepts.json` del bloque
2. Carga los exercises existentes de la lección (de `lib/data/languages/pt/blocks/b*/l*.json`)
3. Llama a MiniMax con prompt `scripts/prompts/lessons-content.md` que pide MDX con frontmatter + 3 ejemplos resueltos + marcadores `__AUDIO_n__`
4. Parsea la respuesta (markdown crudo — el LLM devuelve texto, no JSON)
5. Escribe `lib/data/languages/pt/lessons/b1/regulares-ar.mdx` (preserva el patrón de paths existente)
6. Acumula las entries para `lessons-manifest.json`
7. Si la lesson ya tiene MDX y no se pasa `--force`, skip

### `scripts/prompts/lessons-content.md`

```markdown
# Rol
Sos un profesor de portugués brasileño para hispanohablantes. Generás
explicaciones gramaticales con ejemplos resueltos.

# Input
Bloque: {blockTitle}
Lección: {lessonTitle}
Conceptos cubiertos: {conceptsList}
Exercises existentes (NO repetir ejemplos): {existingExercises}

# Output
MDX puro (sin fences ```). Frontmatter YAML con lessonId, blockId, title,
exampleCount. Cuerpo con:
- 1-2 párrafos de explicación de la regla
- <Rule> con el patrón si aplica
- EXACTAMENTE 3 ejemplos resueltos con <Example index={N} pt="..." es="..." audioRef={N} />
- <Tip> con un dato útil o mnemonic
- Sección "## Practica ahora" con 1 frase motivadora

# Reglas
- NO uses los mismos ejemplos que los exercises existentes
- Mantené el pt-BR (no pt-PT)
- audioRef es el índice (0, 1, 2) — se resuelve en runtime con el manifest
- Los marcadores __AUDIO_0__, __AUDIO_1__, __AUDIO_2__ NO van en el MDX; el renderer los inyecta
```

### `scripts/generate-audio.ts` — extensión

Agrega un sub-comando `lessons` que lee `lessons-manifest.json` y genera
audios TTS de los 3 ejemplos por lección (solo si no existen ya). Audio refs
se actualizan en el manifest.

```bash
npm run generate:audio:lessons -- --lang=pt
```

## Tests (cap a ~471 total)

### Unit (L1-L5)

| Archivo | Cubre |
|---|---|
| `tests/unit/exercise-types.test.ts` (extender) | `lesson` parsea con Zod, rechaza `ptOverrides` mal, snapshot de `EXERCISES_PER_LESSON.lesson` |
| `tests/unit/lessons-api.test.ts` | GET 200 + shape, 400 lang !== pt, 404 lessonId desconocido |
| `tests/unit/lessons-manifest.test.ts` | `loadLessonsManifest("pt")` retorna el JSON, valida shape |
| `tests/unit/lesson-renderer.test.tsx` | MDX con custom components renderiza; marker `__AUDIO_n__` se reemplaza; sesión storage cachea |
| `tests/unit/lesson-custom-components.test.tsx` | `<Example>` muestra ambos idiomas + audio, `<Tip>` tiene icono, `<Rule>` tiene borde, `<VerbConjugation>` renderiza tabla |
| `tests/unit/lesson-view-repo.test.ts` | `markLessonViewed`, `markLessonCompleted`, `getLessonView`, `getLessonViewsForReview` |
| `tests/unit/lesson-gate.test.tsx` | Sin `completedAt` → renderiza `LessonStep`; con → children directo; click "Entendi" → POST |
| `tests/unit/exercise-runner-lesson.test.tsx` | Switch dispatchea a `LessonStep`; `AnswerEvent.kind === "lesson"` no toca FSRS |
| `tests/unit/lessons-standalone-route.test.tsx` | `/pt/lessons/[lessonId]` sin gate; breadcrumb correcto |
| `tests/unit/review-lessons-section.test.tsx` | Sección "Repasar lección" si hay `viewCount >= 1`; no aparece si no hay |

### E2E (Playwright, 1 caso)

```ts
test("veo la lesson antes del primer exercise", async ({ page }) => {
  await page.goto("/pt/blocks/1/lessons/regulares-ar");
  await expect(page.getByRole("button", { name: /Leer lección/ })).toBeVisible();
  await page.getByRole("button", { name: /Leer lección/ }).click();
  await expect(page.getByText("Verbos regulares en -AR")).toBeVisible();
  await expect(page.getByText("Eu falo português.")).toBeVisible();
  await page.getByRole("button", { name: /Entendi/ }).click();
  // ... (re-render o redirect a /practice)
});
```

## Sub-fases de implementación

| Sub-fase | Contenido | Branch commit | Gate |
|---|---|---|---|
| **L0. MDX bootstrap** | Install `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`, `@tailwindcss/typography`. Wrap `next.config.ts` with `createMDX`. Create `mdx-components.tsx` at project root. Verify with a stub MDX file. | `feat(lessons): MDX deps + next config` | typecheck, build, smoke render of stub |
| **L1. Schema** | `ExerciseType = "lesson"`, `LessonData` Zod, `SCHEMA_VERSION`, `EXERCISES_PER_LESSON` | `feat(lessons): add lesson exercise type` | typecheck, test, verify:content, build |
| **L2. Loader + API** | `loadAllLessons(lang)`, `audio-refs.json`, `/api/lessons/[lang]/[lessonId]` | `feat(lessons): lessons loader + API` | + route test |
| **L3. Renderer** | `LessonRenderer` server component with `await import()` of MDX, custom components, marker replacement | `feat(lessons): MDX renderer + custom components` | + renderer test |
| **L4. Runner + Gate** | `ExerciseRunner` branch, `LessonStep` client component, `LessonGate`, `lessonViews` Dexie v7, POST complete | `feat(lessons): runner integration + lesson views` | + gate + repo tests |
| **L5. UI + scripts** | Panel en `/blocks/[id]/lessons/[lid]`, gate en `/practice/[lessonId]`, ruta `/lessons/[lessonId]`, sección en `/review`, `generate-lessons-content.ts`, extensión `generate-audio.ts` | `feat(lessons): UI integration + content scripts` | + e2e test |

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| MDX inválido del LLM | Media | Bajo | Snapshot tests; `verify:content` valida que cada lesson MDX parsea. Si falla, el script aborta. |
| `lessonViews` requiere Dexie v7 | Alta (tabla nueva) | Bajo | Bump v6→v7 con no-op body. Phase 4 ya subió a v6, este es un bump más. |
| Ejemplos del LLM repiten exercises existentes | Alta | Bajo | Prompt lista los exercises existentes como "NO repetir". Validación post-generación en `verify:content`. |
| TTS costos para 30 audios × N lessons | Baja | Bajo | `pt-pt` queda vacío; solo `pt-br` se genera. ~$0.15 total estimado. |
| `LessonGate` rompe el flow de `/practice` | Baja | Alto | Smoke manual con `--no-gate` flag de dev. Si rompe, fallback: el botón "Leer lección" de `/blocks/[id]/lessons/[lid]` sigue funcionando como opt-in. |
| El usuario pide "skip lesson" en `/practice` | Media | Bajo | YAGNI. Se puede agregar `skippable: true` después sin breaking change. |

## Out of scope

- Lessons en `ru/ro/cs` (no hay contenido base).
- Quiz al final de la lesson (es otro exercise type).
- Lesson para stories (los stories ya son lectura + audio).
- SRS / FSRS para la lesson misma.
- Botón "Skip lesson" en `/practice`.
- Audio pre-generado para `pt-pt` (queda vacío, `audioRefs["pt-pt"] === []`).

## Verification

```bash
# Final (L5)
npm run typecheck
npm test                                    # 471-475 verde
STRICT=1 npm run verify:content             # PT content + lessons MDX válido
npm run build                               # sin warnings
# Manual smoke (recorded in PR description):
#   1. GET /pt/blocks/1/lessons/regulares-ar → panel "📖 Explicación"
#   2. Click "Leer lección" → MDX renderiza con 3 ejemplos + TTS funcional
#   3. Click "Entendi" → vuelve a /pt/practice/[lessonId], exercise queue
#   4. Reload /pt/practice/[lessonId] → directo a exercise (no lesson de nuevo)
#   5. GET /pt/review → sección "Repasar lección" arriba (si hay viewCount >= 1)
#   6. Click "Repasar" en una lesson → /pt/lessons/[lessonId] → "Listo" → /pt/review
```

## Entregables

1. Branch `feature/lesson-exercises` (worktree).
2. 5 commits (L1-L5) con gates verdes cada uno.
3. Spec: este archivo (committed).
4. Plan: `docs/superpowers/plans/2026-06-17-lesson-exercises.md` (escrito por `writing-plans` skill después de este spec).
5. ~471 tests verde.
6. PR con smoke manual grabado.
