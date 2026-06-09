# Plan #3 — Engagement (Stories + Gamification + Stats + Diagnostic)

**Fecha:** 2026-06-09
**Autor:** Edu (con Claude, brainstorming)
**Estado:** Diseño aprobado, listo para planificación ejecutable.
**Tag al cerrar:** `mvp-3-engagement`
**Hermano:** Plan #1 (`mvp-1-pipeline`) y Plan #2 (`mvp-2-ui`) cerrados.

---

## 1. Visión

Convertir `aprende-portugues-app` de "app para estudiar portugués" en "app que engancha estudiar portugués". Cierra el loop de engagement con:

- **Narrativa** — mini-historias con audio nativo que dan input comprensible a nivel bloque.
- **Motivación** — streak, XP/niveles, achievements derivados, daily goal anillos.
- **Visibilidad** — stats con heatmap, charts, mastery por concepto.
- **Orientación** — diagnostic test opt-in que recomienda por dónde empezar.
- **Vocabulario** — library global derivado de las historias, drillable.

Sigue 100% local-first, sin auth, sin runtime LLM. Todo el contenido nuevo se genera con scripts `MiniMax` (LLM + TTS), con cache idempotente por hash — regenerar es gratis, no se gastan tokens a lo tonto.

### No-objetivos (heredados + nuevos)

- Karaoke-style highlight de palabra activa → **fuera de scope** (decisión del usuario). El audio de historia se reproduce linealmente.
- Pronunciación con auto-feedback (MediaRecorder) → postponed.
- Traducción libre con LLM en runtime → postponed.
- Mascot → no.
- Achievements custom por usuario → no, son derivados de data.

---

## 2. Decisiones cerradas (del brainstorming)

| Aspecto | Decisión |
|---|---|
| Alcance de Plan #3 | Un solo plan grande (este doc cubre todo) |
| Shape de mini-historia | Texto completo + 1 audio full BR + 1 audio full PT + vocab sidebar clickeable. **Sin karaoke.** |
| Cantidad de historias | 1-2 por bloque × 10 bloques = 10-20 historias |
| Streak trigger | Minutos estudiados ≥ `dailyGoalMinutes` cuenta como día cumplido |
| XP fórmula | +1 Good, +5 Easy, +0 Hard/Again; +30 lesson, +20 streak day, +100 achievement, +10 story |
| Level curve | Cuadrática: nivel n requiere `100·n²` XP adicional; cumulativo `100·n(n+1)(2n+1)/6` |
| Achievements | Todos derivados de data (~18 rules) |
| Stats scope | Heatmap 365d + línea de tiempo; accuracy/bloque; mastery/concepto (top weak/strong); FSRS retention + BR/PT split |
| Diagnostic | Opt-in (botón en home o settings). 20 preguntas, no bloqueante, resultado en Dexie |
| Approach de implementación | Vertical slices (cada phase ships una feature working) |

---

## 3. Generación de contenido (build-time)

### 3.1. Scripts nuevos

- **`scripts/generate-stories.ts`** — genera 1-2 mini-historias por bloque. Para cada historia genera:
  - Texto BR (~3-5 párrafos, 200-400 palabras)
  - Texto PT (variante europea del mismo contenido)
  - Lista de vocab (5-12 items por historia) con traducción ES
  - Audio full BR (TTS, voz female neutral)
  - Audio full PT (TTS, voz female neutral)
  - Audio de cada vocab aislado (BR y PT)
  - Llama MiniMax-M2.5-highspeed (vía SDK Anthropic con `baseURL: https://api.minimax.io/anthropic`).
  - Llama MiniMax TTS `speech-2.8-hd` para cada audio.
  - Valida con Zod. Si falla, log a `b{N}-s{M}.rejected.json` y continuar.
  - Idempotente por hash — regenerar sin cambios = cero llamadas.

- **`scripts/generate-diagnostic.ts`** — genera 20 preguntas multi-concepto, mezclando bloques 1-3 para no requerir bloques futuros. Cada pregunta: `blockId`, `conceptId`, `prompt`, 4 opciones, `correctAnswer`. Idempotente.

### 3.2. Garantías de idempotencia (heredadas, críticas)

- **LLM cache**: `scripts/.cache/llm/<hash>.json` (gitignored). Hash incluye `{type, model, lessonId, conceptIds, promptTemplate, schemaVersion, n}`. Si existe → reusa.
- **Audio cache**: `public/audio/<hash>.mp3` (committed). Hash incluye `{text, voice_id, speed, model, variant}`. Si existe → skip.
- **JSONs finales**: merge por `id` estable. Si `contentHash` no cambia → git diff vacío.
- **Regenerar sin cambios NO gasta tokens** — esto es crítico, mencionado explícitamente por el usuario.

### 3.3. Comandos `package.json` (a agregar)

```json
{
  "generate:stories": "tsx scripts/generate-stories.ts",
  "generate:diagnostic": "tsx scripts/generate-diagnostic.ts",
  "generate:all": "npm run generate:curriculum && npm run generate:content && npm run generate:stories && npm run generate:audio && npm run generate:diagnostic"
}
```

---

## 4. Modelo de datos

### 4.1. Schema TS (adiciones)

```ts
// lib/data/zod-schemas.ts (extendido)

type Story = {
  id: string;              // 'b1-s1-bom-dia-joao'
  blockId: number;
  lessonIds: string[];     // lecciones relacionadas (pre-teaching source)
  title: string;
  level: 1 | 2 | 3;
  conceptIds: ConceptId[];
  variants: {
    br: { text: string; audioHash: string };
    pt: { text: string; audioHash: string };
  };
  vocab: Array<{
    word: string;          // forma BR (canonical)
    ptWord?: string;       // override PT si difiere
    meaning: string;       // traducción ES
    audioHash: { br: string; pt: string };
  }>;
};

// lib/data/diagnostic.json
type Diagnostic = {
  generatedAt: string;
  questions: Array<{
    id: string;            // 8-char content hash
    blockId: number;
    conceptId: ConceptId;
    prompt: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
  }>;
};
```

### 4.2. Vocab catalog (derivado, no generado por LLM)

`lib/data/vocab-catalog.json` se deriva de las stories. Script `scripts/build-vocab-catalog.ts` recorre todos los `b{N}-s{M}.json` y consolida vocab (palabra → `meaning`, `audioHash.br`, `audioHash.pt`, `conceptIds` union). Commit-friendly: si las stories no cambian, el catalog es idéntico.

### 4.3. Dexie schema (adiciones)

```ts
// lib/db/schema.ts (extendido)

db.version(2).stores({
  // ... tablas existentes ...

  storyProgress: 'lessonId, completedAt',  // PK = lessonId (de la story)
  // { lessonId, startedAt, completedAt?, lastVariant }

  diagnosticResults: '++id, takenAt, completed',
  // { id, takenAt, completed, answers: number[], recommendedStart, score }

  achievements: 'id, unlockedAt',
  // { id: 'streak-7', unlockedAt } — materialización de rules desbloqueadas
});
```

Tablas ya definidas en Plan #2 que este plan **completa con lógica**:
- `streak` (`{date, minutesStudied, cardsReviewed, xpEarned}`)
- `xp` (`{key: 'total', value}`)
- `events` (nuevos tipos: `story_completed`, `streak_day`, `level_up`, `achievement_unlocked`, `diagnostic_completed`)
- `conceptMastery` (ya tiene datos de Plan #2)

---

## 5. Arquitectura lógica

### 5.1. Nuevos archivos en `lib/`

```
lib/
├── streak/
│   ├── streak.ts          # currentStreak, didStudyToday, isStreakAlive
│   └── streak.test.ts
├── xp/
│   ├── calculator.ts      # xpForRating, xpForEvent, levelFromXp, levelProgress
│   └── calculator.test.ts
├── achievements/
│   ├── rules.ts           # ~18 AchievementRule
│   └── rules.test.ts
├── vocab/
│   ├── catalog.ts         # load, lookup, getOrCreateVocabCard
│   └── catalog.test.ts
├── stats/
│   ├── aggregations.ts    # aggregateByDay, accuracyByBlock, weakestConcepts, fsrsRetention, brVsPtSplit
│   └── aggregations.test.ts
└── diagnostic/
    ├── scorer.ts          # computeRecommendation
    └── scorer.test.ts
```

### 5.2. Nuevas rutas

| Ruta | Propósito |
|---|---|
| `/stories` | Grid de historias (10-20), filtrable por bloque |
| `/stories/[id]` | Texto + audio + vocab sidebar |
| `/drill/vocab` | Drill de vocab global (vocab cards en FSRS) |
| `/stats` | Heatmap + 4 grupos de charts |
| `/achievements` | Grid de logros (unlocked/locked) |
| `/concepts` | Mapa de conceptos con % mastery |
| `/diagnostic` | Test 20 preguntas opt-in |
| `/` | Home rehecho: streak, XP, level, anillos, story del bloque |

### 5.3. Nuevos componentes (resumen)

- **Stories**: `StoryPlayer`, `StoryText`, `VocabSidebar`, `VocabItem`
- **Gamification**: `StreakRing`, `DailyGoalRing`, `XpBar`, `LevelBadge`, `AchievementToast`, `AchievementCard`
- **Stats**: `Heatmap`, `LineChart`, `BlockAccuracyChart`, `ConceptMasteryChart`, `FsrsRetentionCard`, `BrPtSplitChart`
- **Vocab**: `VocabDrill`, `VocabCard`
- **Diagnostic**: `DiagnosticRunner`, `DiagnosticResults`
- **Home**: `TodaySummary`, `ContinueCard`, `StoryOfTheBlockCard`

---

## 6. Pantallas

### 6.1. Home `/` (re-hecho)

```
┌─────────────────────────────────────────────┐
│  Olá, Edu              🔥 7   Lv 12  3/18 🏆 │
├─────────────────────────────────────────────┤
│  Hoy                                          │
│  ⭕ 12/15 min   │   24 cards reviewed         │
│  [anillo Apple Watch]   [barra XP: 1340/5000] │
├─────────────────────────────────────────────┤
│  📖 Historia del bloque 1                    │
│  "Bom dia, João" — 3 min, 8 vocab           │
│  [Empezar]                                    │
├─────────────────────────────────────────────┤
│  📚 Lección 2: Sílaba tónica                │
│  [Continuar]                                 │
├─────────────────────────────────────────────┤
│  🔁 24 cards listas para repaso              │
│  [Repasar]                                   │
└─────────────────────────────────────────────┘
```

### 6.2. Story page `/stories/[id]`

```
┌─────────────────────────────────────────────┐
│  ← Historias / Bloque 1                      │
│  Bom dia, João                               │
├─────────────────────────────────────────────┤
│  ▶ ━━━━━━━━━━━━━ 1:24 / 3:12   [BR] [PT]    │
│                                              │
│  O João entra na padaria pela manhã.         │
│  Ele compra pão fresco e um café quente.     │
│  "Bom dia!", diz ele para a moça.            │
│  ...                                         │
│                                              │
├─────────────────────────────────────────────┤
│ Vocab                          Leída ✓       │
│ ─ padaria  [▶]  panadería                     │
│ ─ pão      [▶]  pan                          │
│ ─ café     [▶]  café                         │
│ ─ moça     [▶]  chica                        │
│ ...                                          │
└─────────────────────────────────────────────┘
```

### 6.3. Stats `/stats`

```
┌─────────────────────────────────────────────┐
│ Stats                          [7d|30d|90d]  │
├─────────────────────────────────────────────┤
│ Tiempo total (línea con Recharts)            │
├─────────────────────────────────────────────┤
│ Heatmap 365 días                             │
├─────────────────────────────────────────────┤
│ ┌─Accuracy por bloque──┐ ┌─BR vs PT split─┐ │
│ │ B1 ████████░ 84%     │ │    ███████ BR   │ │
│ │ B2 ████░░░░░ 42%     │ │    ████░░ PT   │ │
│ └──────────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────┤
│ Conceptos más débiles (top 10)               │
│ Conceptos más fuertes (top 10)               │
├─────────────────────────────────────────────┤
│ Retención FSRS: B1 78% · B2 62%              │
└─────────────────────────────────────────────┘
```

### 6.4. Achievements `/achievements`

Grid de cards con iconos, locked = gris con candado. Unlocked = color con fecha.

### 6.5. Diagnostic `/diagnostic`

20 preguntas, 4 opciones cada una. Al final: "Recomendamos empezar por Bloque N" + lista de conceptos débiles + botón "Ir a Bloque N".

### 6.6. Vocab drill `/drill/vocab`

Reutiliza `ExerciseRunner` con solo vocab cards del catálogo global. Cada vocab card se crea con `getOrCreateVocabCard` la primera vez y entra a FSRS.

---

## 7. Data flow

### 7.1. Respuesta de card

1. Usuario presiona 1/2/3/4 → `onAnswer(rating)` en `ExerciseRunner`
2. `repository.submitAnswer(cardId, rating)` — atómico: actualiza FSRS + inserta `events` row `{type: 'answer', rating, ts}` + acumula session stats
3. XP del answer: `+1` Good, `+5` Easy, `+0` Hard/Again → suma a `xp` table
4. `checkAndUnlock(previousUnlocked, currentState)` → diff → emite `achievement_unlocked` events para los nuevos
5. Si level cambió → emite `level_up` event
6. Si rating === Again → push a `errorQueue`

### 7.2. Fin de sesión

1. `session.endedAt = now` → emite `lesson_complete` si se completaron todas las cards (+30 XP) o `session_complete` parcial
2. Recalcula `streak[hoy].minutesStudied` sumando todas las sesiones del día
3. Si `minutesStudied ≥ dailyGoalMinutes` y `streak[hoy]` no estaba "contado" → emite `streak_day` event (+20 XP), marca como contado
4. Recalcula `currentStreak` (cuenta días consecutivos hacia atrás con goal cumplido)

### 7.3. Abrir la app

1. `useDailyCheck()` hook: al montar `/`, recalcula streak de hoy y extiende si qualification
2. `useAchievements()` recomputa unlocked set en background
3. `useStreakStatus()` devuelve `{currentStreak, todayMinutes, isStreakAlive}` para el ring y el home

### 7.4. Historia

1. User abre `/stories/[id]` → `storyProgress.getOrCreate(lessonId, variant)` → actualiza `startedAt`
2. User hace click "marcar como leída" → `storyProgress.completedAt = now` + emite `story_completed` event (+10 XP)

### 7.5. Diagnostic

1. User abre `/diagnostic` → carga `diagnostic.json` (20 preguntas con `blockId`, `conceptId`, `correctAnswer`)
2. User responde 20 → estado local
3. Submit → guarda `diagnosticResults` row con todas las respuestas + score
4. Emite `diagnostic_completed` event
5. `scorer.computeRecommendation(answers)` → `recommendedStart: BlockId` (lowest block where accuracy < 70% AND not completed; fallback B1)

### 7.6. Funciones puras clave

```ts
// lib/streak/streak.ts
currentStreak(streak: StreakDay[], today: string, goalMin: number): number
didStudyToday(streak: StreakDay[], today: string, goalMin: number): boolean
isStreakAlive(streak: StreakDay[], today: string): boolean

// lib/xp/calculator.ts
xpForRating(r: Rating): number
xpForEvent(type: EventType): number
levelFromXp(total: number): number
levelProgress(total: number): { current: number; start: number; end: number; pct: number }

// lib/achievements/rules.ts
type Rule = { id: string; name: string; description: string; check: (state: AppState) => boolean }
const RULES: Rule[] = [/* ~18 */]
checkAndUnlock(prevUnlocked: Set<string>, state: AppState): Rule[]

// lib/diagnostic/scorer.ts
computeRecommendation(answers: number[]): BlockId
```

### 7.7. Eventos emitidos

| Tipo | Cuándo | XP |
|---|---|---|
| `answer` | Cada card respondida (con rating) | `xpForRating(rating)` |
| `lesson_complete` | Sesión con 100% de cards hechas | +30 |
| `session_complete` | Sesión terminada (no lesson_complete) | 0 |
| `story_completed` | User marca historia como leída | +10 |
| `story_started` | User abre historia (no otorga XP) | 0 |
| `streak_day` | Una vez por día, cuando se cumple goal | +20 |
| `level_up` | Una vez por nivel cruzado | 0 (el XP ya se contó antes) |
| `achievement_unlocked` | Una vez por rule, primera vez que se cumple | +100 |
| `diagnostic_completed` | Al submit del diagnostic | 0 |

---

## 8. Achievements (rules derivados)

Lista tentativa de ~18 rules. Cada una es una función pura sobre `AppState`.

```ts
const RULES: Rule[] = [
  { id: "first-card",        name: "Primeira palavra",  check: s => s.totalAnswers >= 1 },
  { id: "100-cards",         name: "Centenário",        check: s => s.totalAnswers >= 100 },
  { id: "1000-cards",        name: "Maratonista",       check: s => s.totalAnswers >= 1000 },
  { id: "streak-3",          name: "Consistente",       check: s => s.currentStreak >= 3 },
  { id: "streak-7",          name: "Uma semana",        check: s => s.currentStreak >= 7 },
  { id: "streak-30",         name: "Um mês",            check: s => s.currentStreak >= 30 },
  { id: "streak-100",        name: "Disciplina",        check: s => s.currentStreak >= 100 },
  { id: "block-1-complete",  name: "Fonética dominada", check: s => s.completedBlocks.includes(1) },
  /* ... block-2 .. block-10 ... */
  { id: "perfect-lesson",    name: "Perfeccionista",    check: s => s.perfectLessons >= 1 },
  { id: "perfect-streak",    name: "10 perfectas",      check: s => s.perfectLessons >= 10 },
  { id: "first-story",       name: "Contador",          check: s => s.storiesRead >= 1 },
  { id: "all-stories-10",    name: "Leitor",            check: s => s.storiesRead >= 10 },
  { id: "all-stories-20",    name: "Bibliófilo",        check: s => s.storiesRead >= 20 },
  { id: "vocab-50",          name: "Vocabularista",     check: s => s.vocabCardsLearned >= 50 },
  { id: "concept-master-1",  name: "Maestría 1",        check: s => s.conceptsMastery80 >= 1 },
  { id: "concept-master-10", name: "Maestría 10",       check: s => s.conceptsMastery80 >= 10 },
  { id: "diagnostic-taken",  name: "Auto-conhecimento", check: s => s.diagnosticCount >= 1 },
  { id: "br-explorer",       name: "Brasil",            check: s => s.variantsUsed.has("br") },
  { id: "pt-explorer",       name: "Portugal",          check: s => s.variantsUsed.has("pt") },
];
```

---

## 9. Error handling

### 9.1. Generación (build-time)

- **TTS falla para X audio** → log a `b{N}-s{M}.audio-failures.json`, continuar. Página muestra "🔇 Audio no disponible".
- **LLM rechaza story** → log a `b{N}-s{M}.rejected.json`, continuar con otros bloques. Bloque con 0 stories se renderiza sin sección de stories.
- **LLM genera story con vocab vacío** → Zod valida `vocab.length >= 3`. Si falla, log + reintentar hasta 3 veces con temperatura más alta.
- **TTS rate limit** → `p-limit(4)` + retry exponencial en 429.

### 9.2. Runtime — achievements

- **Race** → `checkAndUnlock` corre síncrono dentro de la transacción de `recordEvent`. No race.
- **Double unlock** → filter `prevUnlocked.has(id)` antes de emitir.
- **Multiple level-ups** → toast con animación secuencial, no flood.

### 9.3. Runtime — streak

- **Día corrupto** → si `streak[fecha]` no existe, no cuenta. Append-only.
- **Timezone** → `YYYY-MM-DD` local del browser. Cambio de TZ puede romper streak (aceptable).
- **Double qualification** → `streak_day` se marca como contado, no se re-emite.

### 9.4. Runtime — stories

- **Vocab sin audio** → muestra "🔇" con tooltip "Audio no disponible".
- **Story sin variant PT** → fallback solo BR con banner. Toggle BR/PT deshabilitado.
- **Story no marcada leída** → queda como `startedAt` sin `completedAt`. "En progreso" en `/stories`.

### 9.5. Runtime — diagnostic

- **Abandono** → guardar progreso parcial con `completed: false`. Resume muestra "Continuar" o "Empezar de nuevo".
- **Resultado inconcluso** (acc < 50% en B1) → recomienda B1 de todos modos.
- **Re-toma** → escribe nuevo row, no sobreescribe.

### 9.6. Runtime — stats

- **>10K events** → precomputar agregaciones memoized al cargar `/stats`. Si >30K, agregar por semana.
- **Bloque sin datos** → muestra "—" en lugar de %.
- **Conceptos sin mastery** → excluir de top weak/strong (solo `exposureCount > 0`).

### 9.7. Runtime — vocab drill

- **Vocab sin audio** → render igual, AudioButton muestra error state.
- **Card nueva** → `getOrCreateVocabCard` la crea con `state: New`.

---

## 10. Testing

### 10.1. Unit (vitest) — ~50 tests nuevos

| Archivo | Tests |
|---|---|
| `lib/streak/streak.test.ts` | 8 |
| `lib/xp/calculator.test.ts` | 12 |
| `lib/achievements/rules.test.ts` | 20 |
| `lib/vocab/catalog.test.ts` | 4 |
| `lib/stats/aggregations.test.ts` | 12 |
| `lib/diagnostic/scorer.test.ts` | 6 |
| `scripts/lib/cache.test.ts` (story extension) | 3 |

### 10.2. Schema tests

- `StorySchema` parsea todos los `b{N}-s{M}.json`
- `DiagnosticSchema` parsea `diagnostic.json`
- `vocab-catalog.json` parsea

### 10.3. E2E (playwright) — ~10 escenarios

```
playwright/tests/
├── engagement.spec.ts
│   ├── home shows streak + level + daily ring
│   ├── story flow: open, read, mark complete → XP bar moves
│   ├── streak: 3 simulated days → streak count = 3
│   ├── first-lesson: complete → "first-lesson" achievement toast
│   ├── diagnostic: take test → recommendation screen
│   └── stats: heatmap renders with test data
├── vocab.spec.ts
│   └── /drill/vocab: study 3 cards → cards persisted in Dexie
└── stories.spec.ts
    ├── /stories: grid shows 10-20 stories
    ├── /stories/[id]: vocab click plays audio
    └── story BR ↔ PT toggle works
```

### 10.4. `npm run verify:content` (extendido)

- Cada story tiene audio BR y PT físicamente
- Cada vocab item tiene audio
- `vocab-catalog.json` regenerable desde stories sin cambios
- `diagnostic.json` schema válido
- Manifest incluye nuevos audios

---

## 11. Approach de implementación (Vertical slices)

9 phases, cada una ship-ready. Plan ejecutable detallado se generará con la skill `writing-plans` tras este design.

1. **Stories infra** — `generate-stories.ts`, TTS full audio, schema, ruta `/stories/[id]`, 1 historia generada y navegable.
2. **Resto de historias** — 1-2/bloque × 10 bloques.
3. **Vocab library** — catálogo derivado de stories, drill mode, `/drill/vocab`.
4. **Streak + daily goal ring** — eventos, tabla `streak`, componente anillo.
5. **XP + levels + achievements derivados** — funciones puras, eventos, badge notifications.
6. **Stats `/stats`** — heatmap + 4 grupos de charts.
7. **Diagnostic test** — generación, ruta, scorer, recomendación.
8. **Home dashboard upgrade** — streak, XP/level, anillos, achievements count, story del bloque.
9. **Verify + tag `mvp-3-engagement`**

---

## 12. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| TTS rate limit en `generate-stories` | `p-limit(4)`, retry exponencial, log a failures |
| Vocab catalog crece mucho (>500 items) | UI lo pagina y busca; drill carga solo vocab due |
| Heatmap lento con muchos events | Precomputar agregaciones memoized |
| Diagnostic sin conclusión clara | Fallback B1; muestra "Recomendamos B1" si no hay señal |
| User cambia timezone | Aceptable romper streak (no se documenta como bug) |
| Achievement rules se sienten "fáciles" | La dificultad emerge de las combinaciones (e.g., 100 días de streak requiere ~3 meses de consistencia) |

---

## 13. Decisiones heredadas (no cambiadas)

- Stack: Next.js 16 + TS + Tailwind + shadcn + Dexie + ts-fsrs + Recharts + Zustand + framer-motion + MDX
- Modelo: local-first, 100% estático
- Variantes: PT-BR + PT-PT
- UI variantes: toggle global + compare side-by-side
- Generación: MiniMax-M2.5-highspeed (LLM) + speech-2.8-hd (TTS)
- Cache: idempotente por hash
- Visual: light cálido brasileño + Fraunces/Plus Jakarta Sans
- SRS: FSRS-5
- Mascot: no
- Sin pronunciación auto-feedback, sin LLM en runtime
