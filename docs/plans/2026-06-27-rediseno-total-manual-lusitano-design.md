# Rediseño total — "Manual Lusitano"

**Fecha:** 2026-06-27
**Autor:** Edu (con Claude + 5 agentes expertos: lingüística PT, pedagogía SLA, UX, UI, backend)
**Estado:** Diseño aprobado, listo para escribir plan de implementación.
**Repo:** `Eduardo-rico/aprende-idiomas` (`/Users/lalo/idiomas/portugues-app`)
**Enfoque elegido:** A — "Todo de golpe" (un solo release, varios workstreams en paralelo + QA dedicado).
**Mockups de referencia (fuente de verdad visual):** `design-mockups/{home,leccion,sesion,progreso}.html`

---

## 1. Visión

Rehacer por completo la UX y la UI de la app de portugués **conservando el contenido** (currículo de 10 bloques, ejercicios, historias y audios ya generados), corrigiendo los errores de contenido detectados, y cerrando el déficit pedagógico de producción (output). El resultado se llama **"Manual Lusitano"**: un libro de texto digital bien editado — papel cálido, serifa para lo que enseña, sans para lo que opera, márgenes editoriales, y la metáfora del libro hecha sistema (capítulos, secciones, folios, drop caps, notas al margen, pull-quotes).

### 1.1. Objetivos

1. **UX:** de 3 clicks a 1 click para empezar a estudiar; continuidad entre días ("dónde quedé"); onboarding; taxonomía de "libro".
2. **UI:** dirección visual "Manual Lusitano" con tokens, tipografía e iconografía coherentes (ver mockups).
3. **Pedagogía:** cerrar el output gap — activar Shadowing, añadir Cloze y Production; sesiones cronometradas; leech ladder; métricas de outcome.
4. **Lingüística:** corregir los errores críticos de contenido antes de regenerar audio; crear glosario bilingüe; marcar variantes BR/PT desde el bloque 1.
5. **Datos:** Dexie v8 con tablas nuevas y migración segura (backup + rollback), sin perder el progreso del usuario.

### 1.2. No-objetivos

- No se regenera el contenido pedagógico existente salvo lo que tenga errores (texto) y lo que lo requiera (audio de historias corregidas, audio de Shadowing nuevo).
- No se cambia el modelo de generación (MiniMax LLM+TTS) ni la convención de audio content-addressed (`/audio/<sha>.mp3`).
- No se rompen las fórmulas FSRS/mastery/XP ni la cookie de auth HMAC.
- No se activan RU/RO/CS (siguen scaffolds vacíos), pero se elimina el hardcode `pt` que los bloquea.
- No se introduce multiusuario ni deploy a producción en este release.

---

## 2. Stack (sin cambios de framework)

| Capa | Tecnología | Cambio |
|---|---|---|
| Framework | Next.js 16.2.7 (App Router) + React 19 + TS estricto | — |
| UI | Tailwind v4 + shadcn/ui + framer-motion + canvas-confetti | + `lucide-react` (iconos) |
| Tipografía | **Fraunces** (display) + **Inter** (body) + **JetBrains Mono** (IPA/mono) | Plus Jakarta → Inter; + JetBrains Mono |
| Storage local | Dexie (IndexedDB) | v7 → **v8** |
| SRS | `ts-fsrs` (FSRS-5) | — (sin tocar fórmulas) |
| Estado | Zustand | + stores `useUiState`, `useAudioQueue`, `useTelemetry` |
| Contenido | MDX + JSON estático | + `glossary.json`, + `variantHighlights` en historias |
| LLM/TTS (build) | MiniMax (Anthropic baseURL + t2a_v2) | — (solo se re-invoca para fixes y Shadowing) |
| Tests | vitest (unit) + playwright (e2e) | + cobertura nueva (ver §10) |

---

## 3. Dirección visual "Manual Lusitano" (de los mockups)

> Implementación literal de `design-mockups/*.html`. Esos archivos son la fuente de verdad de espaciado, color y jerarquía.

### 3.1. Cinco principios

1. El espacio en blanco es contenido (densidad por supresión).
2. La tipografía hace el trabajo; el color apoya (90% papel+tinta).
3. El "libro" se manifiesta, no se imita (folios, running heads, drop caps, margin notes; sin texturas de cuero/pergamino).
4. Estados legibles, no gritones (colores apagados + glifo).
5. Motion discreto y útil (120–320ms, `cubic-bezier(.2,.8,.2,1)`; nada rebota; confeti solo en acierto).

### 3.2. Tokens (CSS variables en `app/globals.css`)

Light (valores exactos de los mockups):
- `--paper:#FBF7EE` · `--paper-raised:#FFFFFF` · `--paper-sunken:#F4EFE0`
- `--ink:#2A241D` · `--ink-muted:#6B6359` · `--ink-faint:#9A9082`
- `--rule:#DDD6C7` · `--rule-strong:#C9C0AD`
- **Acentos semánticos:** `--lesson:#2E8B57` (+`--lesson-soft:#E6F2EA`) · `--review:#D4922A` (+`--review-soft:#FAF2DF`) · `--diagnostic:#4F46E5`
- **Variante:** `--br:#CA8A04` · `--pt:#1E40AF` (solo micro-acento)
- **Estados:** `--success:#2E8B57` · `--error:#B54545` (+soft) · `--info:#5B9BD5` (+`--info-soft:#EAF2FA`)
- Escala OKLCH completa + dark mode (papel noche, no negro puro) según el reporte UI. Sombras base tinta baja opacidad.

Tipografía: Fraunces 400/500/600 (display, headings, drop cap, pull-quotes), Inter 400/500/600 (body, UI), JetBrains Mono 450 (IPA, folios, concept-ids, intervalos SRS). Escala modular 1.250.

Espaciado base 4px. Radios: card `10–14px`, botón `6–8px`, pill `999px`. Iconos: `lucide-react`, stroke 1.5px, `currentColor`; emojis solo narrativos (🔥 racha, 🇧🇷/🇵🇹 banderas).

### 3.3. Componentes primarios (especificados en mockups)

- **Botón:** primary (bg lesson), secondary (border rule-strong), ghost, destructive. Tamaños sm/md/lg.
- **Card:** eyebrow ALL-CAPS + título serif + meta sans + footer; `--paper-raised`, border `--rule`, radius-lg, shadow-xs→sm en hover (sin color shift).
- **Eyebrow + rule de 28px:** patrón editorial que abre cada sección.
- **TOC del libro:** filas con número romano, nombre serif, barra de mastery, %; estado actual resaltado (`--lesson-soft`), bloqueado a opacidad 50%.
- **Margin notes:** `border-left` 2px coloreado — Dica (lesson) / Cuidado (review) / Contraste ES (info) / Variación BR↔PT (review). Colapsan a `<aside>` en mobile <880px.
- **AudioButton:** lucide `Play`/`VolumeX` + `.wave-bar` actual; sin emoji.
- **GradePanel:** 4 botones con label + intervalo resultante + atajo `[1-4]`.

---

## 4. Arquitectura de información y rutas

### 4.1. Mapa de rutas (nuevo)

```
/[lang]/                              PORTADA  (mockup home.html)
/[lang]/libro/                        índice del libro (capítulos = bloques)
/[lang]/libro/[chapter]/              capítulo: descripción + secciones
/[lang]/libro/[chapter]/[section]     lección leída (mockup leccion.html) → ejercicios a 0 clicks
/[lang]/practicar/                    colas: SRS diario · vocab global · por bloque
/[lang]/practicar/srs                 sesión SRS diaria (mockup sesion.html)
/[lang]/practicar/[chapter]/[section] ejercicios de una lección (LessonGate inline, sin redirect)
/[lang]/practicar/vocab               drill de vocabulario
/[lang]/historias/  + /[id]           reproductor karaoke + lectura + vocab
/[lang]/diagnostico/                  placement test
/[lang]/progreso/                     stats + logros (mockup progreso.html, con tabs)
/[lang]/cuenta/                       preferencias · objetivo · display · sesión (hub 4 sub-vistas)
```

Implementado con **route groups** de Next 16: `(learn)`, `(review)`, `(story)`, `(data)`, `(intro)`, `(config)`, cada uno con su `layout.tsx` + `loading.tsx` + `error.tsx`.

### 4.2. Eliminaciones / consolidaciones

- **Eliminar `/learn`** → la "sesión" se inicia desde el CTA de la portada.
- **Eliminar `/review` como destino** → SRS diario vive en `/practicar/srs`.
- **Colapsar las dos rutas de "leer lección"** (`/blocks/[id]/lessons/[lid]` intro + `/lessons/[lessonId]` reader) en `/libro/[chapter]/[section]`.
- **`/settings` (9 secciones) → `/cuenta/*`** (4 sub-vistas).
- **`/stats` + `/achievements` → `/progreso`** (tabs Aprendizaje/Logros).
- Las rutas eliminadas (`/blocks`, `/learn`, `/review`, `/lessons/*`, `/practice/*`) no desaparecen de golpe: su page se reemplaza por un **redirect 308** a la ruta nueva equivalente, y se retiran en un follow-up tras confirmar que ningún link interno las usa. "Eliminar" arriba significa eliminar la pantalla/función, no dejar un 404.

### 4.3. Portada (de `home.html`)

Jerarquía exacta: NavBar (Estudar/Livro/Histórias/Progresso/⚙ + toggle BR/PT) → eyebrow "HOJE" → hero "Bom dia, Edu" + racha + capítulo actual → 2 rings (racha + minutos) → barra XP → **CTA único** "Empezar sesión · N tarjetas (R repasos · N nuevas · ~min)" → "Continuar" (lección a medias, leída de `uiState`) → **TOC del libro** → Repaso rápido + História do bloco.

Reglas:
- Toda nav interna usa prefijo `/${lang}` (gotcha histórico de 404).
- Datos de conteo SRS se cargan server-side (RSC), no en `useEffect` con "Cargando…".
- `StoryOfTheBlockCard` recomienda historia del **bloque actual**, no hardcode bloque 1.
- Onboarding: si IndexedDB está vacío → CTA primario "Hacé el diagnóstico" en vez del CTA de sesión.

### 4.4. Lección/capítulo (de `leccion.html`)

Layout `grid [1fr 248px]`: columna de prosa (drop cap, tabla de conjugación mono, pull-quote con cita nativa, audio inline BR/PT, CTA "Continuar a exercícios →", "Continua na p. N" + glifo ❦) + columna de **margin notes** (Dica/Cuidado/Contraste ES/Variación BR↔PT). Running head con nombre de capítulo + folio "p. N". Mobile <880px: una columna, notas como `<aside>` intercaladas.

### 4.5. Sesión (de `sesion.html`)

Top bar de **foco** (sin NavBar completa): cerrar + barra de progreso + contador "N/M" + **cronómetro de 20 min**. Chip de tipo de ejercicio + concept-id. Card grande (palabra serif + IPA mono + audio). Reveal con respuesta + ejemplo + "Contraste ES". GradePanel 4 botones con intervalo + atajos. Footer "interleaving activo".

### 4.6. Progreso (de `progreso.html`)

Tabs Aprendizaje / Logros. Sección "Resultados de aprendizaje" (4 métricas de outcome) + heatmap 90 días + "Producción vs Reconocimiento" + "Maestría por concepto" con decay visible (ámbar/rojo).

---

## 5. Pedagogía (cerrar el output gap)

Diagnóstico SLA: la app es ~70% drills de forma, ~0% output; Shadowing existe pero con 0 instancias en el corpus. Cambios:

### 5.1. Tipos de ejercicio nuevos / activados

| Tipo | Acción | Implementación |
|---|---|---|
| **Shadowing** | Activar + poblar B3–B8 (~50 cards de conjugación oral con grabación + autoevaluación) | Componente ya existe; generar contenido + audio |
| **ClozeCard** | Cloze en párrafo sobre las 20 historias existentes (coste cero de contenido) | Reusar `FillBlankCard` con `text[]` |
| **Production (FreeWriting)** | Escribir 5 frases sobre un tema; feedback diferido 24h | Nuevo: textarea + autoevaluación + cola diferida |

(Diferidos a follow-up: Dictation, PictureDescription, SpeedTranslation, SentenceOrdering.)

### 5.2. Loop de estudio (sesión de ~20–30 min)

`warm-up (3 cards casi-vencidas sin grade)` → `teaching (si toca lección nueva)` → `practice mezclado (interleave: ~30% nuevos, 30% reviews bloque previo, 20% lejanos, 10% leeches, 10% oral)` → `producción (1 de cada 4 sesiones)` → `story + cloze` → `cierre metacognitivo (elegir foco de mañana)`.

### 5.3. Ajustes de mecánica

- **Sesión cronometrada** (default 20 min) en vez de cap de 100 reviews; **fatigue check** a los ~18 min ("podés parar, los intervals ya están guardados"); opción opt-in "sesión larga 40 min".
- **Leech ladder:** aviso silencioso a 3 lapses → badge + sugerencia de reset a 5 → "focus session" con 3 variantes a 7+.
- **Feedback post-error:** tras "Otra vez", mostrar regla + **Contraste ES** explícito; opción de marcar para repaso extra.
- **Mastery con decay real:** llamar a `weightedAccuracy()` (hoy existe pero no se invoca en el path de escritura).
- **Interleaving entre días**, no solo dentro del día; aleatorizar dentro de bloques conceptuales con empate.

### 5.4. Métricas de outcome (en `/progreso`, de `progreso.html`)

Retención a 7 días · velocidad de respuesta media (`responseMs`, ya capturado) · conceptos dominados · vocab que produces · producción vs reconocimiento (brecha) · maestría por concepto con decay · constancia (heatmap). Separadas visualmente de las métricas mecánicas (racha, XP, logros).

---

## 6. Contenido lingüístico (calidad garantizada)

### 6.1. Errores críticos a corregir ANTES de regenerar audio

| ID | Archivo | Error | Fix |
|---|---|---|---|
| C1 | `stories/b3-s1-pedro-vai-ao-restaurante.json` | "presently" (inglés) | "agora/atualmente" |
| C2 | `stories/b10-s1-cartas...json` | "intentar" (español) en texto + vocab | "tentar" (todas las apariciones) |
| C3 | `blocks/b10.json` + `stories/b10-s1` | **"bicha" invertido y ofensivo** (BR=slur, PT=fila) | reescribir + flag `tabu` |
| C4 | `stories/b5-s2-os-planos...json` | "poujado" (typo PT) | "poupado" |
| C5 | `stories/b10-s2-cartas...json` | "número detelefone" | "número de telefone" |
| C6 | `stories/b7-s2-um-dia-comum...json` | gerundio/pronombre incoherente | reescribir natural |
| C7 | `stories/b4-s2-ana-conta...json` | "avião aterrou no hotel" (absurdo) | "chegou ao hotel" |
| C8 | `lessons/b4.json:29` | caracteres chinos sueltos (高频) | quitar | <!-- bleed-ok: cita los caracteres ofensores como ejemplo -->

> **Gate de audio:** la regeneración de TTS queda CONGELADA hasta que todos los fixes de texto pasen el checklist. Re-generar solo los hashes afectados (no los 5.451 MP3).

### 6.2. Artefactos nuevos

- **`lib/data/languages/pt/glossary.json`** — ≥40 entradas con `{word, translations[], falseFriend, variants{br,pt}, register, tabu?, examples[], conceptIds[]}`. Las 40+ prioritarias están en el reporte de lingüística (ficar, pegar, puxar, borracha, oficina/escritório, propina/gorjeta, achar, carta/ementa/cardápio, etc.).
- **`variantHighlights`** opcional en cada historia: `["garçom (BR) → empregado de mesa (PT)", ...]`, renderizado como tooltips/margin notes desde el bloque 1 (no esperar a b10).
- **Terminología portuguesa** consistente en nombres de lección (conjuntivo, pretérito perfeito, gerúndio…), no mezclar con español.
- **Limpiar `*.rejected.json`** + añadir validación de `conceptIds` en `scripts/propose-lessons.ts`.

### 6.3. Checklist de validación lingüística (QA continua)

Guardar como `docs/qa-checks-linguisticos.md` con las 7 categorías del reporte: A (variantes BR/PT), B (falsos amigos), C (calidad textual / cero caracteres no-PT), D (terminología gramatical), E (progresión), F (audio), G (glosario). QA corre este checklist en cada cambio de contenido.

---

## 7. Modelo de datos (Dexie v8)

### 7.1. Tablas nuevas

```
userProfile: "id, createdAt"                 // identidad separada de auth (futuro multiusuario)
uiState:     "key, updatedAt"                 // última lección/sesión, último filtro, tab activa → "Continuar"
telemetry:   "++id, ts, level, [level+ts]"   // ring buffer de errores/warnings client-side
dailyGoals:  "date, goalMinutes, achieved"   // separado del histórico de streak/XP
```

(Opcional, opt-in) `reviewQueue: "sessionId, position"` para restaurar orden tras refresh en sesiones largas.

### 7.2. Índices nuevos sobre tablas existentes (aditivos)

- `events`: `type, [type+ts]`
- `sessions`: `endedAt`
- `cards`: `[language+state]`
- `conceptMastery`: `lastReviewed`

### 7.3. Migración (expand-migrate-contract)

1. **Backup atómico** previo: `db.export()` → DB sombra `PortuguesAppDB_backup_v7`.
2. `version(8)` con `upgrade` que copia verbatim las tablas compatibles, valida `events.payload` con Zod (skip + log si malformado, nunca rechaza la fila entera), y siembra defaults en las tablas nuevas.
3. Si la migración falla → fallback a v7 + pantalla "Restablecer desde backup".
4. Backup auto-purgable tras 7 días.

### 7.4. Invariantes que NO se tocan

URL de audio `/audio/<sha>.mp3`; fórmulas FSRS/mastery/XP; cookie HMAC; contrato i18n `/[lang]/` + `hasLocale()`; paths MDX bajo `lib/data/languages/pt/mdx/`; pipeline de generación.

### 7.5. Fix pre-existente

`lib/achievements/rules.ts`: la regla "br/pt explorer" usa strings legacy `"br"`/`"pt"` y nunca dispara → migrar a `pt-br`/`pt-pt` (usar `legacyVariantToKey`). Fix aislado, parte del Gate 0.

### 7.6. Otros fixes de backend

- Quitar hardcode `pt` en `app/api/lessons/[lang]/[lessonId]/route.ts` (data-driven).
- `lib/audio/preloader.ts` (nuevo): precarga próximos 3 audios de la cola, LRU de 50 en memoria.
- Completar `pickVoice` (hoy no-op) cuando se cablee el VoicePicker.
- Bump `@types/node` a 22; sincronizar `@next/mdx` con `next`.

---

## 8. Workstreams paralelos

Tras un **Gate 0 secuencial** (base común), 4 workstreams corren en paralelo, con QA (WS-E) validando continuamente. Cada workstream produce PRs pequeños y verificables.

```
GATE 0 (base, secuencial):
  - Tokens "Manual Lusitano" en globals.css + layout (Fraunces/Inter/Mono, lucide)
  - Dexie v8 schema + migración + backup/rollback
  - Fix achievements bug + fix hardcode pt en API
  - Componentes UI primitivos (Button, Card, Eyebrow, MarginNote, AudioButton)
        │
        ▼
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ WS-A: UI/Front│ WS-B: Rutas/IA│ WS-C: Contenido│ WS-D: Pedagogía│
│ frontend-eng  │ frontend-eng  │ lingüística    │ SLA + frontend │
│               │               │ (agente revisor)│               │
│ - Portada     │ - route groups│ - 8 fixes C1-C8│ - Shadowing    │
│ - Lección     │ - redirects   │ - glossary.json│ - ClozeCard    │
│ - Sesión      │ - nav/IA      │ - variantHighl.│ - Production    │
│ - Progreso    │ - onboarding  │ - checklist    │ - sesión 20min │
│ - cuenta/*    │ - "continuar" │ - terminología │ - leech ladder │
│               │   (uiState)   │ - rejected.json│ - métricas out │
└──────────────┴──────────────┴──────────────┴──────────────┘
        │
        ▼
GATE 1 (integración): WS-E (QA) valida cada PR
  - e2e Playwright clic-real por cada Link (cazar 404 de prefijo /${lang})
  - checklist lingüístico A-G en cada cambio de contenido
  - naturalWidth>0 en imágenes; assertion de CSP (next.config)
  - migración v7→v8 testeada con fake-indexeddb (perfiles nuevo/intermedio/100 días)
        │
        ▼
GATE 2 (audio): regenerar TTS SOLO de historias corregidas + Shadowing nuevo
```

### 8.1. Dependencias entre workstreams

- WS-A depende de Gate 0 (tokens + primitivos).
- WS-B depende de Gate 0 (Dexie v8 para `uiState`) y coordina con WS-A los nombres de página.
- WS-C es **independiente** (contenido) — puede correr desde el día 1.
- WS-D depende de Gate 0 (schema) y de WS-C (Cloze usa historias ya corregidas).
- WS-E (QA) es transversal y continuo.

### 8.2. Garantía de traducciones

1. **Agente lingüista revisor** valida cada PR de WS-C contra el checklist A-G.
2. **Test automatizado** que escanea JSONs/MDX por: caracteres no-portugueses (C1 categoría), strings prohibidos ("intentar", "presently", "bicha" sin flag `tabu`), participios típicos mal escritos.
3. **Gate de audio:** ningún TTS se regenera hasta que el checklist pasa al 100%.

---

## 9. Mapeo de archivos (qué se toca)

**Gate 0:** `app/globals.css`, `app/layout.tsx`, `app/[lang]/layout.tsx`, `package.json` (+lucide), `lib/db/schema.ts` (v8), `lib/db/migrate-v7-to-v8.ts` (nuevo), `lib/achievements/rules.ts` (fix), `app/api/lessons/[lang]/[lessonId]/route.ts` (fix), `components/ui/*` (primitivos nuevos).

**WS-A:** `app/[lang]/page.tsx`, `app/[lang]/(learn)/libro/**`, `app/[lang]/(review)/practicar/**`, `app/[lang]/(data)/progreso/**`, `app/[lang]/(config)/cuenta/**`, `components/{NavBar,BlockCard,LessonCard,ExerciseRunner,AudioButton,VariantToggle}.tsx`, `components/home/*`, `components/cards/*`, `components/lessons/*`, `components/stats/*`.

**WS-B:** route groups + `loading.tsx`/`error.tsx` por grupo, redirects 308 de rutas viejas, `lib/stores/useUiState.ts`, onboarding en portada.

**WS-C:** `lib/data/languages/pt/stories/*.json` (8 fixes), `lib/data/languages/pt/blocks/b10.json`, `lib/data/languages/pt/lessons/b4.json`, `lib/data/languages/pt/glossary.json` (nuevo), `scripts/propose-lessons.ts` (validación), `docs/qa-checks-linguisticos.md` (nuevo).

**WS-D:** `components/cards/{ShadowingCard,ClozeCard,ProductionCard}.tsx`, `lib/srs/{config,interleave,leeches}.ts`, `lib/mastery/concept.ts` (decay), `lib/stores/session.ts` (timer), scripts para poblar Shadowing/Cloze.

**WS-E (QA):** `tests/e2e/*` (por flujo), `tests/unit/migrate-v7-to-v8.test.ts`, test de escaneo lingüístico, test de Links con prefijo lang.

---

## 10. Testing y verificación

- **e2e Playwright con clic real** (no `goto`) por cada Link de cada pantalla — caza los 404 de prefijo `/${lang}` (gotcha histórico recurrente).
- **Migración:** tests con `fake-indexeddb` sobre 3 perfiles snapshot (nuevo / intermedio / 100 días de racha); verificar conteos antes/después (cards, sesiones, eventos, streak, xp).
- **Lingüístico:** test de escaneo automatizado + revisión del agente lingüista; checklist A-G.
- **Visual:** assertion del CSP en `next.config` + `naturalWidth>0` en imágenes (gotcha de mapa roto en otro proyecto).
- **Regresión SRS:** verificar que las fórmulas FSRS/mastery/XP no cambian numéricamente (snapshot tests).

---

## 11. Riesgos y mitigaciones

| Riesgo | Sev | Mitigación |
|---|---|---|
| Migración v7→v8 corrompe progreso | Alta | backup atómico `db.export()` + rollback + tests fake-indexeddb |
| Regenerar 451MB de audio por error | Alta | gate de audio; regenerar solo hashes afectados |
| Enseñar "bicha" al revés (ofensivo) | Alta | fix C3 + flag `tabu` + checklist B1; bloquea release |
| 404 por links sin prefijo `/${lang}` | Media | e2e clic-real obligatorio en QA |
| Coexistencia rutas viejas/nuevas confunde | Media | redirects 308 temporales con ventana definida |
| Output features (Shadowing) sin contenido | Media | WS-D genera contenido + audio antes de activar la UI |
| Drift `@next/mdx`/`next`/`@types/node` | Baja | bump sincronizado en Gate 0 |

---

## 12. Definición de "terminado"

1. Las 4 pantallas clave (portada, lección, sesión, progreso) coinciden con los mockups y pasan e2e clic-real.
2. Dexie v8 migra los 3 perfiles snapshot sin pérdida; rollback probado.
3. Los 8 errores de contenido (C1–C8) corregidos; `glossary.json` con ≥40 entradas; checklist A-G al 100%.
4. Audio regenerado solo para historias corregidas + Shadowing nuevo; `verify:content` pasa.
5. Shadowing, Cloze y Production activos con contenido real; sesión cronometrada + leech ladder funcionando.
6. `/progreso` muestra las métricas de outcome; mastery con decay real.
7. Rutas viejas redirigen 308 a las nuevas; sin links rotos.
8. Fix de `achievements/rules.ts` y hardcode `pt` verificados.

---

## Anexo — Mockups de referencia

- `design-mockups/home.html` — Portada
- `design-mockups/leccion.html` — Capítulo / lección
- `design-mockups/sesion.html` — ExerciseRunner / sesión
- `design-mockups/progreso.html` — Dashboard de outcomes

Estos archivos son la fuente de verdad de la dirección visual. Cualquier discrepancia entre el spec y los mockups se resuelve a favor de los mockups (salvo errores evidentes).
