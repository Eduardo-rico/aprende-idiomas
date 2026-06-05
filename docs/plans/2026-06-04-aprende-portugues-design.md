# Aprende Português — Design Document

**Fecha:** 2026-06-04
**Autor:** Edu (con Claude)
**Estado:** Diseño aprobado, listo para planificación de implementación.

---

## 1. Visión

App de aprendizaje estructurado de portugués (brasileño + europeo) para hispanohablantes, basada en el currículo de 10 bloques diseñado por Edu — desde fonética hasta variación dialectal — con ejercicios variados, audio nativo, repetición espaciada (FSRS-5) y técnicas pedagógicas comprobadas de SLA (Second Language Acquisition).

Inspirada en y construida con el mismo patrón del proyecto hermano `aprende-ipa` (`/Users/lalo/idiomas/ipa-app`).

### 1.1. Por qué soporte dual PT-BR + PT-PT

Edu quiere ambas variantes desde el inicio: la mayoría del léxico básico y conjugaciones regulares es idéntico, pero pronunciación siempre difiere y existen diferencias léxicas y sintácticas clave (você vs tu, gerúndio vs `estar a + infinitivo`, colocação pronominal, `ônibus` vs `autocarro`, etc.). El modelo de datos lo soporta de raíz para evitar refactor.

### 1.2. No-objetivos

- No es una red social ni tiene perfiles compartidos.
- No es multi-usuario en un solo browser — progreso local en IndexedDB sin auth.
- No se deploya a producción inicialmente (corre `npm run dev` local en Mac).
- No requiere conexión a internet en runtime (solo para generación de contenido en build-time).
- No usa Claude API en runtime — todo el contenido es pre-generado y estático.

---

## 2. Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind v4 + shadcn/ui + framer-motion + canvas-confetti |
| Tipografía | Fraunces (display) + Plus Jakarta Sans (body) |
| Storage local | Dexie (IndexedDB) |
| SRS | `ts-fsrs` (FSRS-5) |
| Gráficos | Recharts |
| Estado | Zustand |
| Contenido docs | MDX (con componentes interactivos) |
| LLM (build-time) | MiniMax-M2.5-highspeed vía SDK Anthropic (`baseURL: https://api.minimax.io/anthropic`) |
| TTS (build-time) | MiniMax `speech-2.8-hd` vía REST (`POST /v1/t2a_v2`) |
| Tests | vitest (unit) + playwright (e2e) |

---

## 3. Arquitectura

### 3.1. Modelo local-first, 100% estático

Tres "tiempos" claramente separados:

| Tiempo | Quién corre | Qué pasa |
|---|---|---|
| **Build (generación)** | Scripts Node (`npm run generate:*`) llamando MiniMax APIs | Crea/cachea ejercicios JSON + audios MP3. Manual, no en CI. |
| **Build (Next.js)** | `next build` | Empaqueta la app con los assets ya presentes. |
| **Runtime** | Browser | Lee JSON estático, reproduce MP3 estático, guarda progreso en IndexedDB. |

### 3.2. Layout de carpetas

```
portugues-app/
├── app/                        # Rutas Next (ver §7)
├── components/                 # UI (shadcn + custom)
├── lib/
│   ├── data/
│   │   ├── curriculum.ts       # Definición de los 10 bloques + lecciones + conceptos
│   │   ├── blocks/             # JSON generado por bloque (ejercicios)
│   │   ├── stories/            # Mini-historias por bloque
│   │   ├── concepts.json       # Catálogo de conceptos
│   │   └── manifest.json       # Índice global (hashes de cada item)
│   ├── db/                     # Dexie schema + queries
│   ├── srs/                    # Wrapper sobre ts-fsrs
│   ├── audio/                  # Helper para resolver text→audio path
│   ├── mastery/                # Cálculo de % maestría por concepto
│   └── stores/                 # Zustand (settings, session)
├── public/
│   └── audio/                  # MP3s de MiniMax, nombre = hash(text+voice+variant)
├── scripts/
│   ├── generate-curriculum.ts  # Define estructura (sin API calls)
│   ├── generate-content.ts     # Llama MiniMax-M2.5-highspeed → JSONs
│   ├── generate-stories.ts     # Genera mini-historias por bloque
│   ├── generate-audio.ts       # Llama MiniMax TTS → MP3s
│   ├── verify-content.ts       # Validación con Zod + manifest
│   ├── lib/
│   │   ├── minimax-llm.ts      # SDK Anthropic apuntando a MiniMax
│   │   ├── minimax-tts.ts      # fetch al endpoint /v1/t2a_v2
│   │   ├── cache.ts            # Cache determinista por hash
│   │   └── prompt-runner.ts    # Render plantillas + invocar LLM + parse
│   ├── prompts/                # Plantillas por tipo de ejercicio (md/mdx)
│   └── config.ts               # Voces, modelos, concurrency, cantidades
├── docs/
│   └── plans/                  # Design docs + planes de implementación
└── tests/                      # vitest + playwright
```

---

## 4. Modelo de datos

### 4.1. Curriculum (`lib/data/curriculum.ts`)

Source of truth del esqueleto del curso. Curado a mano, versionado en git.

```ts
export const BLOCKS: Block[] = [
  { id: 1, slug: 'fonetica', name: 'Sistema fonético y ortográfico', durationWeeks: 2, ... },
  { id: 2, slug: 'morfologia-nominal', name: 'Morfología nominal', durationWeeks: 4, ... },
  { id: 3, slug: 'presente-imperativo', name: 'Sistema verbal — presente e imperativo', ... },
  { id: 4, slug: 'pasados', name: 'Sistema verbal — pasados', durationWeeks: 6, ... },
  { id: 5, slug: 'futuros-condicional', name: 'Futuros y condicional', ... },
  { id: 6, slug: 'subjuntivo', name: 'Subjuntivo', durationWeeks: 8, ... },
  { id: 7, slug: 'formas-no-personales', name: 'Formas no personales', ... },
  { id: 8, slug: 'sintaxis-conectores', name: 'Sintaxis y conectores', ... },
  { id: 9, slug: 'lexico', name: 'Léxico por campos', durationWeeks: null, freeDrill: true },
  { id: 10, slug: 'registros-variacion', name: 'Registros y variación', ... },
];

type Block = {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationWeeks: number | null;
  prereqs: number[];        // bloques que deben completarse antes
  freeDrill: boolean;       // true para Bloque 9 — siempre disponible
  lessons: Lesson[];
  storyIds: string[];       // mini-historias del bloque
};

type Lesson = {
  id: string;               // 'b3-l2-presente-irregulares'
  blockId: number;
  name: string;
  objectives: string[];     // learning objectives explícitos
  vocabKey: string[];       // IDs de cards de vocab clave (pre-teaching)
  conceptNotesPath: string; // path a MDX en lib/data/blocks/{slug}/notes.mdx
  exerciseRefs: string[];   // IDs de ejercicios
  conceptIds: ConceptId[];  // conceptos cubiertos
};
```

### 4.2. Conceptos (`lib/data/concepts.json`)

Entidad de primera clase para granularidad pedagógica.

```ts
type Concept = {
  id: string;              // 'b3-presente-irregular-ser'
  name: string;            // 'Presente irregular: ser'
  blockId: number;
  description: string;
  prereqs: ConceptId[];
};
```

Permite: dashboard "tu maestría por concepto", drill "refuerza mis 10 conceptos más débiles", recomendaciones contextuales.

### 4.3. Ejercicios (`lib/data/blocks/b{N}.json`)

```ts
// ID es derivado del contenido (sha256 de stableStringify({type, data, ptOverrides, esContrast}),
// truncado a 8 chars) para que el SRS sea estable a través de regeneraciones del LLM.
// CRÍTICO: el ID posicional (lessonId-type-NNN) es frágil — el cache hit del LLM puede
// producir distintos items en distintas posiciones, rompiendo identidades de cards.
type ExerciseId = string; // 8-char content hash

// Exercise como discriminated union sobre `type`. El tipo de `data` se infiere del literal.
type Exercise = FlashcardExercise | FillBlankExercise | ListeningExercise
  | TranslationExercise | VerbPrepositionExercise
  | SentenceConstructionExercise | ChunkExercise;

type ExerciseType = Exercise['type']; // union de los 8 literales

type FlashcardExercise = {
  id: ExerciseId;
  blockId: number;
  lessonId: string;
  type: 'flashcard';
  difficulty: 1 | 2 | 3;
  concepts: ConceptId[];        // IDs válidos referenciados en concepts.json (validado post-generación)
  tags: string[];               // ej. 'falso-amigo', 'irregular'
  contentHash: string;
  data: { front: string; back: string; example?: string };
  ptOverrides?: { type: 'flashcard'; front?: string; back?: string; example?: string };
  esContrast?: string;
  audio?: { br: { hash: string; voice: string }; pt: { hash: string; voice: string } };
};
// ... un struct por tipo. data y ptOverrides son variante-específicos.

// Estado "generado y completo" — invariante al disco: tiene contentHash Y audio.
// Plan #1 debe commitear SOLO archivos que satisfagan esta invariante.
type GeneratedExercise = Exercise & {
  contentHash: string;
  audio: { br: { hash: string; voice: string }; pt: { hash: string; voice: string } };
};
```

Resolución por variante — se re-parsea contra el schema del tipo declarado:
```ts
function resolveExercise(ex: Exercise, variant: 'br' | 'pt'): Exercise['data'] {
  if (variant !== 'pt' || !ex.ptOverrides) return ex.data;
  const merged = { ...ex.data, ...ex.ptOverrides };
  // re-validar: si ptOverrides tenía campos inválidos para el tipo, throw.
  return ExerciseDataByTypeSchema[ex.type].parse(merged);
}
```

`ptOverrides` es un discriminated union con los mismos miembros que Exercise pero todos los campos opcionales. Cruzar tipos (ej. `ptOverrides.audioText` en un flashcard) no compila y no parsea. Esto elimina la clase de bug "Frankenstein data" detectada en el review.

Tipos de ejercicio activos en MVP1: `flashcard`, `fill_blank`, `listening`, `translation_es_pt`, `translation_pt_es`, `verb_preposition`. `sentence_construction` y `chunk` quedan en el enum (para que el data model no requiera migración en Plan #2) pero su generación se difiere.

### 4.4. Mini-historias (`lib/data/stories/b{N}-s{M}.json`)

```ts
type Story = {
  id: string;              // 'b3-s1-cafe-da-manha'
  blockId: number;
  title: string;
  level: 1 | 2 | 3;        // dificultad
  conceptIds: ConceptId[];
  variants: {
    br: { text: string; segments: Segment[]; vocab: Array<{ word: string; meaning: string }> };
    pt: { text: string; segments: Segment[]; vocab: Array<{ word: string; meaning: string }> };
  };
};

type Segment = {
  text: string;            // palabra o frase
  audioStart: number;      // segundo de inicio en el MP3 completo
  audioEnd: number;        // segundo de fin
  isHighlight: boolean;    // true para palabras nuevas
};
```

Audio karaoke-style: highlight de palabra activa según `currentTime` del `<audio>`.

### 4.5. IndexedDB (Dexie) — progreso del usuario

```ts
db.version(1).stores({
  cards: 'id, blockId, lessonId, nextReviewAt, [blockId+nextReviewAt], [lessonId+nextReviewAt]',
  // { id, contentHash (al aprender), fsrs: { stability, difficulty, ... }, nextReviewAt, lastResult }

  sessions: '++id, startedAt, blockId',
  // { id, startedAt, endedAt, blockId, cardsReviewed, accuracy, mode }

  events: '++id, ts, type',
  // { id, ts, type: 'answer'|'lesson_complete'|'streak_day'|'level_up'|'achievement', payload }

  errorQueue: 'cardId, ts',
  // Mini-cola de errores recientes para "5-min review"

  errorReasons: '++id, cardId, ts',
  // { cardId, ts, reason: 'no_conocia'|'confundi_es'|'gramatica'|'audio_confuso' }

  settings: 'key',
  // { key: 'variant', value: 'br' | 'pt' }
  // { key: 'voicePref', value: { br: 'voice_id', pt: 'voice_id' } }
  // { key: 'showContrast', value: boolean }
  // { key: 'dailyGoalMinutes', value: 15 }
  // { key: 'showCompareToggle', value: boolean }
  // { key: 'theme', value: 'light'|'dark' }
  // { key: 'soundFx', value: boolean }

  achievements: 'id, unlockedAt',
  // { id: 'first-100-cards', unlockedAt }

  streak: 'date',
  // { date: 'YYYY-MM-DD', minutesStudied, cardsReviewed, xpEarned }

  xp: 'key',
  // { key: 'total', value: 4250 } + level se deriva

  conceptMastery: 'conceptId',
  // { conceptId, accuracy, lastReviewed, exposureCount, masteryPct }
});
```

### 4.6. Manifest global (`lib/data/manifest.json`)

```json
{
  "generatedAt": "2026-06-04T...",
  "modelText": "MiniMax-M2.5-highspeed",
  "modelTts": "speech-2.8-hd",
  "voices": {
    "br": { "f": "Portuguese_Brazil_FemaleA", "m": "Portuguese_Brazil_MaleA" },
    "pt": { "f": "Portuguese_Portugal_FemaleA", "m": "Portuguese_Portugal_MaleA" }
  },
  "blocks": {
    "1": { "exerciseCount": 120, "audioCount": 240, "contentHash": "..." }
  },
  "audioIndex": {
    "bom dia": { "br": "abc123...", "pt": "def456..." }
  }
}
```

---

## 5. Pipeline de generación

### 5.1. Garantías de idempotencia

Reglas centrales:

1. **Audio (`public/audio/<hash>.mp3`):** hash incluye `{text, voice_id, speed, model, variant}`. Si el archivo ya existe → skip total. Mismo input ⇒ mismo hash ⇒ mismo archivo. Cero sobreescritura posible.

2. **Llamadas LLM:** cache en `scripts/.cache/llm/<hash>.json` (gitignored, regenerable). Hash incluye `{type, model, lessonId, conceptIds, promptTemplate, schemaVersion, n}`. Si existe → se reusa.

3. **JSONs finales (`lib/data/blocks/b{N}.json`):** merge por `id` estable. Si el `contentHash` no cambia → archivo idéntico, git diff vacío. Si difiere → solo entonces se actualiza (y se loggea).

4. **`manifest.json`:** se reconstruye desde cero pero deterministicamente → git diff vacío si nada cambió.

### 5.2. Comportamiento por tipo de cambio

| Cambio | Qué se regenera |
|---|---|
| Edito prompt en `scripts/prompts/<type>.md` | Solo ejercicios de ese tipo |
| Bumpeo `schemaVersion` de un tipo | Solo ese tipo |
| Cambio voz en `scripts/config.ts` | Solo audios con esa voz |
| Agrego lección nueva al curriculum | Solo ejercicios de esa lección |
| `npm run generate:all -- --force` | Todo (bypass de cache) |
| `npm run generate:content -- --block 3` | Solo bloque 3 |

### 5.3. Scripts

- **`generate-curriculum.ts`** — define `BLOCKS`, `LESSONS`, `CONCEPTS`. Sin API calls. Edición manual.
- **`generate-content.ts`** — itera curriculum × tipos × N ejercicios objetivo. Llama MiniMax-M2.5-highspeed. Valida con Zod. `p-limit(8)` concurrency.
- **`generate-stories.ts`** — genera 1-2 mini-historias por bloque, segmentadas para karaoke.
- **`generate-audio.ts`** — recorre todos los strings que necesitan audio × 2 variantes × voz preferida. Llama MiniMax TTS. `p-limit(4)` concurrency. Outputs MP3 + actualiza manifest.
- **`verify-content.ts`** — valida que cada lección tiene ≥ N ejercicios, cada Exercise pasa Zod, cada audio referenciado existe físicamente, manifest sincronizado.

### 5.4. Llamada LLM típica

```ts
// scripts/lib/minimax-llm.ts
import Anthropic from '@anthropic-ai/sdk';
export const llm = new Anthropic({
  baseURL: 'https://api.minimax.io/anthropic',
  apiKey: process.env.MINIMAX_API_KEY!,
});

await llm.messages.create({
  model: 'MiniMax-M2.5-highspeed',
  max_tokens: 4000,
  system: SYSTEM_PROMPT_PT_TEACHER,
  messages: [{ role: 'user', content: renderedPrompt }],
});
```

### 5.5. Llamada TTS típica

```ts
// scripts/lib/minimax-tts.ts
await fetch('https://api.minimax.io/v1/t2a_v2', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.MINIMAX_API_KEY!}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'speech-2.8-hd',
    text,
    voice_setting: { voice_id, speed: 1, vol: 1, pitch: 0 },
    audio_setting: { sample_rate: 32000, bitrate: 128000, format: 'mp3', channel: 1 },
    language_boost: variant === 'br' ? 'Portuguese' : 'Portuguese',
    output_format: 'url',
  }),
});
```

### 5.6. Costos esperados (orden de magnitud)

- **Contenido textual:** ~10 bloques × ~6 lecciones × ~40 ejercicios = ~2,400 ejercicios. Con MiniMax-M2.5-highspeed: probablemente <$5 generación completa.
- **TTS:** ~3,000 strings × 2 variantes = ~6,000 audios × ~5s promedio. `speech-2.8-hd` cobra por carácter; probable <$20 total. Una sola vez.
- **Audios en git:** ~6,000 × ~30KB = ~180MB. Commit directo al repo (decisión: simplicidad > tamaño).

### 5.7. Comandos `package.json`

```json
{
  "generate:curriculum": "tsx scripts/generate-curriculum.ts",
  "generate:content":    "tsx scripts/generate-content.ts",
  "generate:stories":    "tsx scripts/generate-stories.ts",
  "generate:audio":      "tsx scripts/generate-audio.ts",
  "generate:all":        "npm run generate:curriculum && npm run generate:content && npm run generate:stories && npm run generate:audio",
  "verify:content":      "tsx scripts/verify-content.ts"
}
```

---

## 6. UI / Pantallas

### 6.1. Rutas

| Ruta | Propósito |
|---|---|
| `/` | Dashboard: streak, XP/nivel, daily goal (anillos), due cards hoy, daily mix, próxima lección |
| `/learn` | "Continuar aprendiendo" — modo guiado (due cards primero, luego siguiente lección) |
| `/blocks` | Grid con los 10 bloques. Progreso, estado, conceptos |
| `/blocks/[id]` | Detalle: lista de lecciones, descripción, mini-historias, botón "estudiar" |
| `/blocks/[id]/lessons/[lid]` | Lección: vocab clave (5 cards) → conceptNotes MDX → botón "practicar" |
| `/practice/[lessonId]` | Sesión: ejercicios uno a uno |
| `/stories/[id]` | Mini-historia con audio karaoke + vocab acompañante |
| `/drill` | Modo libre: por concepto, por bloque, por "débiles", por tag |
| `/review-errors` | Mini-cola de errores recientes (5-min queue) |
| `/concepts` | Mapa de conceptos con % maestría |
| `/concepts/[id]` | Detalle: notas, ejercicios, accuracy histórica |
| `/stats` | Heatmap, accuracy por bloque, tiempo invertido, retention por concepto |
| `/achievements` | Grid de logros |
| `/settings` | Variante, voces, contrast, compare toggle, daily goal, theme, sound fx |
| `/diagnostic` | Test diagnóstico inicial (opcional, 20 preguntas) |

### 6.2. Componente clave: `<ExerciseRunner>`

- Recibe un Exercise + callback `onAnswer`.
- Resuelve variante desde settings + aplica `ptOverrides`.
- Renderiza según `type` (sub-componentes: `FlashcardCard`, `FillBlankCard`, `ListeningCard`, `TranslationCard`, `VerbPrepositionCard`, `SentenceConstructionCard`, `ChunkCard`).
- Botón "comparar variante" cuando hay `ptOverrides` → side-by-side + audio de la otra variante.
- `esContrast` como tooltip/badge si setting activa.
- Tras responder: feedback inmediato, audio del término, actualiza FSRS, registra evento, si fue error → push a errorQueue + popover opcional "explica tu error" con tags.
- Atajos: `1/2/3/4` opciones, `Space` audio, `Enter` confirmar.

### 6.3. Componente clave: `<DailyMix>`

Generador de sesión del día (Home): mezcla automática siguiendo interleaving research.
- N due cards del SRS
- M cards nuevas (de la siguiente lección sin completar)
- 1-2 ejercicios de listening
- 1 traducción
- 1 mini-historia si el bloque actual tiene
Variedad obligatoria por defecto.

### 6.4. Componente clave: `<ConceptMastery>`

Por concepto: barra de progreso (cards aprendidas / total), accuracy, último review. Colores: rojo <60%, amarillo 60-85%, verde >85%. Click → drill del concepto.

### 6.5. MDX components en `conceptNotes`

- `<Speak text="bom dia" />` — botón inline que reproduce audio en variante actual
- `<ConjugationTable verb="ser" tense="presente" />` — tabla desde data
- `<Contrast es="..." br="..." pt="..." note="..." />` — caja tri-columna
- `<MinimalPair items={[...]} />` — pares con audio
- `<EsContrast>...</EsContrast>` — solo renderiza si setting on
- `<RuleBox>...</RuleBox>` — regla destacada
- `<CulturalNote>...</CulturalNote>` — pildora cultural

---

## 7. Tono visual

### 7.1. Paleta

- Primary: `#FFD60A` (amarillo dorado) + `#00A86B` (verde tropical)
- Accents: `#FF6B6B` (coral suave para errores), `#4DA8DA` (azul cielo para info)
- Background light (default): crema cálido `#FFF8E7`
- Dark mode toggleable
- Acertaste = verde + burst, fallaste = coral + shake suave (nunca rojo agresivo)

### 7.2. Tipografía

- `Fraunces` — display (con carácter editorial)
- `Plus Jakarta Sans` — body (muy legible)

### 7.3. Micro-interacciones (framer-motion + canvas-confetti)

- Cards entran con spring suave
- Correcto: pop + check verde + confetti burst pequeño
- Streak alcanzado: animación de "fuego" creciendo
- Level up / lesson complete: confetti grande + modal celebratorio
- Hover en bloques: tilt 3D sutil

### 7.4. Audio FX (toggleables, default ON)

- "ding" suave acertar, "boop" fallar, "fanfare" lección completa
- Sin loops de música

### 7.5. Sin mascot

Decisión: estilo editorial sobrio + animaciones abstractas. Sin papagayo/tucán.

---

## 8. Pedagogía

Base implementada por diseño:

1. **FSRS-5** — algoritmo SRS moderno, mejor retención que SM-2.
2. **Active recall** — todos los ejercicios fuerzan recordar, no re-leer.
3. **Comprehensible input + i+1** — graduación de dificultad explícita.
4. **Daily Mix automático con interleaving** — mezcla de tipos y conceptos en cada sesión.
5. **Daily goal por tiempo** — anillos tipo Apple Watch (5/10/15/20/30 min).
6. **Pre-teaching en lecciones** — vocab clave (5 cards) antes de notas y ejercicios.
7. **Narrative comprehensible input** — mini-historias con audio karaoke por bloque.
8. **Shadowing mode** — reproducir + esperar + reproducir, usuario imita en voz alta.
9. **Lexical approach** — `chunk` como tipo de ejercicio dedicado (colocações).
10. **Metacognition** — "explica tu error" con tags estructurados.
11. **Test diagnóstico opcional** — al primer uso, sugiere por dónde empezar.
12. **Cultural notes** — pildoras contextuales en lecciones.
13. **esContrast** — pistas específicas para hispanohablantes (campo de primera clase).
14. **Falsos amigos como tag de primera clase** — drill dedicado.
15. **Régimen preposicional como tipo dedicado** — área de mucho error ES→PT.
16. **Sentence construction** — fuerza producción sintáctica activa.
17. **Error queue / 5-min review** — repaso inmediato de errores recientes, independiente del SRS.

### 8.1. Features no incluidos en MVP (out of scope)

- **Pronunciación con auto-feedback** (MediaRecorder + Web Speech Recognition) — postponed.
- **Traducción libre evaluada por LLM en runtime** — postponed; mantiene la app 100% estática.
- **Mascot** — descartado.

---

## 9. Testing y verificación

### 9.1. Unit tests (vitest)

- `lib/srs/fsrs.ts` — wrapping de `ts-fsrs`: schedule, retention, rating mapping
- `lib/data/loaders.ts` — carga + validación con Zod
- `lib/audio/resolve.ts` — resolución text → MP3 URL por variante
- `lib/db/queries.ts` — Dexie queries (due cards por bloque/concepto/lección)
- `lib/mastery/concept.ts` — cálculo de % maestría
- `scripts/lib/cache.ts` — hash determinista
- `scripts/lib/minimax-llm.ts` — con mock del SDK

### 9.2. Schema tests

- Snapshot que parsea TODOS los `lib/data/blocks/*.json` con Zod.
- Validador de manifest: cada audio referenciado existe en `public/audio/`.

### 9.3. E2E tests (playwright)

- Onboarding: primera visita → setting variante → home
- Lección completa: vocab clave → notas → ejercicios → resultado
- Toggle variante BR↔PT mid-session
- Drill mode por concepto
- Streak: simular fechas y verificar conteo
- Achievement unlock al completar primera lección
- Error queue: fallar 3 cards → `/review-errors` → ver las 3
- Karaoke audio en mini-historia avanza el highlight

### 9.4. `npm run verify:content`

Chequea: cada lección tiene ≥ N ejercicios, cada Exercise pasa Zod, cada audio referenciado existe físicamente, manifest sincronizado. Fail si algo falta.

---

## 10. Roadmap (alto nivel)

Para detalle de tareas, ver el plan de implementación en `docs/plans/2026-06-04-aprende-portugues-plan.md` (a generar tras este doc).

Fases tentativas:

1. **Bootstrap** — Next.js init + Tailwind/shadcn + Dexie + ts-fsrs + estructura de carpetas.
2. **Pipeline de generación** — scripts MiniMax LLM + TTS + cache + Zod + verify.
3. **Curriculum + Bloques 1-3** — primera generación end-to-end, validar pipeline real.
4. **UI core** — Layout, Home, blocks index, lesson detail, ExerciseRunner con todos los tipos.
5. **SRS + Daily Mix + Error queue** — wiring Dexie ↔ UI.
6. **Conceptos + Mastery** — pantallas y cálculo.
7. **Mini-historias + karaoke audio**.
8. **Gamificación** — streak, XP/nivel, achievements, daily goal anillos.
9. **Stats + heatmap**.
10. **Pulido visual** — paleta, micro-interacciones, sonidos.
11. **Generación completa** — Bloques 4-10.
12. **Tests e2e finales**.

---

## 11. Decisiones tomadas (resumen)

| Aspecto | Decisión |
|---|---|
| Proyecto | `/Users/lalo/idiomas/portugues-app` |
| Stack | Next.js 16 + TS + Tailwind + shadcn + Dexie + ts-fsrs + Recharts + Zustand + framer-motion + MDX |
| Modelo | Local-first, 100% estático, contenido pre-generado |
| Alcance | Los 10 bloques completos desde el inicio |
| Variantes | PT-BR base + `ptOverrides` + audio siempre dual |
| UI variantes | Toggle global + modo comparar lado a lado |
| Generación texto | MiniMax-M2.5-highspeed vía SDK Anthropic |
| Generación audio | MiniMax `speech-2.8-hd`, MP3 committed a git |
| Cache | Idempotente por hash, sin sobreescritura |
| Visual | Light cálido brasileño + Fraunces/Plus Jakarta Sans |
| SRS | FSRS-5 |
| Mascot | No |
| Pronunciación auto-feedback | No (postponed) |
| Traducción libre con LLM runtime | No (postponed) |
| Modos | Daily mix, drill libre, sesión por lección, mini-historias karaoke, shadowing, review errors |
| Tipos ejercicio | flashcard, fill_blank, listening, translation_es_pt, translation_pt_es, verb_preposition, sentence_construction, chunk |
| Gamificación | Streak, XP/niveles, achievements, stats detalladas, daily goal por tiempo |
| Pedagogía core | Pre-teaching, interleaving, narrative input, metacognition, test diagnóstico opcional, cultural notes |
| Hispanohablantes | `esContrast` + falsos amigos como tag de primera clase |
