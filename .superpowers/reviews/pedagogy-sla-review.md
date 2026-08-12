# Review pedagógica (SLA) — Aprende Português

**Fecha:** 2026-07-01
**Revisor:** experto en adquisición de segundas lenguas (SLA) y diseño instruccional
**Alcance:** solo lectura. Código inspeccionado: `lib/srs/*`, `lib/mastery/concept.ts`, `lib/stores/session.ts`, `lib/db/repository.ts`, `app/[lang]/(review)/practicar/srs/PracticarSrsInner.tsx`, `components/session/*`, `components/cards/*`, `components/ExerciseRunner.tsx`, `lib/production/queue.ts`, `lib/data/languages/pt/{curriculum.ts,diagnostic.json,glossary.json,stories/,mdx/}`, `lib/stores/settings.ts`.

**Pregunta del usuario:** "¿es la mejor manera de que yo aprenda portugués?"
**Respuesta corta:** Hoy, no. El *diseño* es de lo mejor que he visto en una app casera (FSRS-5, interleaving, leech ladder, contraste ES→PT, carga sostenible), pero **tres de los cuatro loops de aprendizaje centrales están rotos o son stubs en el código**, y aun arreglados, a la app le falta lo que más mueve la aguja en SLA: interacción real y feedback de producción. Como está, es un buen lector de historias con flashcards que no se reprograman.

---

## 0. Hallazgos críticos de código (rompen la pedagogía, no son matices)

### 0.1 El loop diario de repaso NO persiste las calificaciones — el SRS no existe en la práctica
- `/learn` y `/review` redirigen ambos a `/practicar/srs` (`app/[lang]/learn/page.tsx`, `app/[lang]/review/page.tsx`).
- Esa ruta usa `SessionScreen` (`components/session/SessionScreen.tsx`), cuyo `handleGrade` **solo actualiza contadores locales de React** (`setReviewed`, `setCorrect`) y avanza el índice. Nunca llama a `submitAnswer` — el propio comentario del archivo lo admite: *"Per-card FSRS grading (submitAnswer) lands in a follow-up"*.
- Consecuencias en cadena:
  - El estado FSRS de la card nunca cambia → `nextReviewAt` queda en el pasado → **las mismas cards vuelven todas las sesiones, para siempre**. No hay espaciado, no hay priorización de lo difícil, no hay descarte de lo fácil.
  - Los intervalos que ve el usuario son mentira: `PLACEHOLDER_INTERVALS_MS` hardcodeados (1 min / 2 d / 4 d / 9 d), pese a que `previewIntervalMs()` ya existe en `lib/srs/fsrs.ts` y no se usa aquí.
  - El banner de fatiga dice *"los intervalos ya están guardados"* (`PracticarSrsInner.tsx:155`) — **falso**.
  - El leech ladder (`lib/srs/leeches.ts`) nunca se dispara desde el loop diario, porque `lapses` solo crece dentro de `submitAnswer` (`lib/db/repository.ts:163-215`).
  - `recordAnswerForConcepts` tampoco corre → el mastery por concepto no se alimenta del repaso diario.
- La única vía que SÍ persiste FSRS es `ExerciseRunner` (usado por `/practice/[lessonId]` y `VocabDrill`). Es decir: la práctica de lección funciona; **el repaso diario —el corazón del producto— no**.

### 0.2 En la sesión diaria, todos los ejercicios activos degeneran a flashcard pasiva (y sin audio)
- `SessionScreen` solo despacha componentes reales para `shadowing`, `cloze` y `production`. Todo lo demás (`fill_blank`, `translation`, `conjugation`, `error_correction`, `matching`, `multiple_choice`, `listening`) cae al branch por defecto: `SessionCardDisplay` + `GradePanel` = **"Mostrar respuesta" → autocalificarse**. No hay respuesta escrita, no hay selección, no hay corrección.
- Peor: `onPlayAudio={() => { /* hook into AudioButton in a follow-up */ }}` (`SessionScreen.tsx:198-200`) — el botón de audio de la sesión **no hace nada**. Las cards de listening en el repaso diario son mudas.
- `backFor()` en `SessionCardDisplay` busca `data.answer`; `error_correction` guarda su solución en `data.correct` y su explicación en `explanationEs` → esas cards se revelan **vacías y sin explicación** en la sesión (la explicación sí se muestra en `ExerciseRunner` vía `ErrorCorrectionCard`).
- Efecto SLA: el "testing effect" (retrieval practice) exige *generar* la respuesta. Reveal-then-grade es reconocimiento, el nivel más débil de práctica. El único lugar donde el usuario produce lenguaje a diario quedó reducido a leer y asentir.

### 0.3 El "feedback en 24h" de producción es un stub que nunca llega — y puede borrar lo escrito
- `ProductionCard.tsx:53` promete *"Feedback diferido en 24h"*. `enqueueProduction()` guarda el texto en `db.telemetry` con `level:"warn"` (`lib/production/queue.ts`).
- `getPendingProduction()` **no tiene ni un solo consumidor** en todo el repo (verificado por grep: solo `queue.ts` y `ProductionCard.tsx` referencian el módulo). No hay job, no hay UI de revisión, no hay LLM. El feedback no llega nunca.
- Agravante: `logTelemetry()` (`lib/db/repository.ts:628-636`) trata `db.telemetry` como ring buffer — al pasar de 1000 filas **borra las 200 más viejas**. Los textos del usuario comparten tabla con logs de leeches y errores: sus ensayos pueden ser eliminados silenciosamente.
- Efecto SLA: output sin feedback consolida errores (fosilización). Prometer feedback y no darlo es peor que no pedir producción: entrena al usuario a ignorar la tarea ("Saltar" es gratis — de hecho `onDone()` califica 3/Good igual que enviar).

### 0.4 El mastery por concepto es ruido: `weightedAccuracy` es código muerto
- `recordAnswerForConcepts` (`lib/mastery/concept.ts:32-59`) computa `accuracy = correct ? 1 : 0` — **solo la última respuesta**. `weightedAccuracy()` con time-decay (la parte buena del diseño) no se llama desde ningún sitio (grep: cero usos fuera del propio archivo y tests).
- Resultado: `masteryPct` oscila entre 0 y ~100 con cada respuesta; `isMastered` = "la última respuesta fue correcta y hubo ≥3 exposiciones". El dashboard de progreso y el achievement `conceptsMastery80` miden una moneda al aire, no dominio.

### 0.5 Shadowing: autoevaluación sin dientes
- `ShadowingCard.tsx` graba y permite comparar con el modelo (bien), y muestra `selfChecks` (bien), pero el único botón de salida es `onSubmit("", true)` — **siempre correct=true**. En el flujo de sesión eso se mapea directo a Good(3) sin opción de marcarse mal (`SessionScreen.tsx:157-162`). No hay ASR ni scoring de pronunciación en ninguna parte.

---

## 1. Calificación por dimensión

| Dimensión | Diseño | Funcionando hoy | Nota |
|---|---|---|---|
| Repetición espaciada + retrieval (FSRS-5, interleave, leeches) | 9/10 | **2/10** | Excelente en `lib/srs/*`; desconectado del loop diario (§0.1, §0.2) |
| Transfer ES→PT (cognados, interferencia) | 7/10 | 6/10 | B1 entero ataca correspondencias sistemáticas y fonética nasal/rr/s; `esContrast` en cards; pero solo 12 falsos amigos en el glosario y una correspondencia mal formulada (ver §3) |
| Input comprensible | 6/10 | 6/10 | 20 historias graduadas (2/bloque) con audio dual BR/PT por frase — bien hecho, pero es ~1h de lectura total; volumen muy bajo para adquisición |
| Output forzado (Swain) | 5/10 | **1/10** | Producción escrita existe pero su feedback es un stub (§0.3); la sesión diaria no exige producir nada (§0.2) |
| Loops de feedback | 5/10 | 3/10 | `explanationEs` solo en error_correction vía `/practice`; el resto es bien/mal + respuesta correcta; en sesión diaria ni eso |
| BR+PT simultáneo | 6/10 | 5/10 | Bien mitigado (variante activa única + compare opt-in + `variantHighlights` + B10), pero cuestionable para principiante (§4) y hay *bleed* real ("ementa" en el texto BR de `b3-s1`) |
| Carga cognitiva / motivación | 9/10 | 7/10 | Meta 15 min, sesión 20/40, fatigue check 18 min, caps 100/10/floor 3, streak+XP+heatmap: sostenible y bien calibrado para adulto ocupado. Penaliza que el bug §0.1 recicla las mismas cards → sensación de no avanzar |
| Currículo y placement | 7/10 | 5/10 | Secuencia estructural sensata de 10 bloques (~36 semanas); diagnóstico de 26 MCQ sesgado a b1–b3 (0 preguntas de b5/b7/b9/b10) y su resultado solo se registra — no adapta nada |

**Global: 4/10 hoy** (sería ~7/10 con los cuatro fixes de §0 hechos; el techo sin interacción humana/LLM real es ~8).

---

## 2. Fortalezas (lo que vale la pena conservar)

1. **La infraestructura SRS es seria.** FSRS-5 real vía ts-fsrs con config centralizada y sana (`request_retention 0.9`, fuzz, caps diarios, `new_cards_floor: 3` para que los repasos no ahoguen lo nuevo — detalle fino). El interleaving greedy por concepto+tipo (`lib/srs/interleave.ts`) es exactamente lo que la literatura de *interleaved practice* recomienda. El leech ladder warn@3/reset@5/focus@7 con `introducedAt` preservado (anti-gaming) está mejor pensado que el de Anki.
2. **El enfoque contrastivo ES→PT es el correcto para este usuario.** Dedicar el bloque 1 completo a fonética/ortografía contrastiva (nasales, rr/s BR-vs-PT, correspondencias -ão/-nh/-lh, h muda) es donde de verdad duele para un hispanohablante; el 90% léxico transparente no necesita instrucción, necesita exposición — y las historias la dan. Los chips "Contraste ES" en cards y las notas MDX en español son andamiaje L1 bien usado.
3. **Audio dual BR/PT por frase + selector de variante con compare opt-in** es una solución elegante al problema de las dos variantes (una activa, la otra visible bajo demanda).
4. **El diseño de carga es adulto-realista:** 15 min de meta, sesión de 20 con escape a los 18, caps que evitan el "muro de 400 reviews" post-vacaciones. Esto es lo que hace que un hábito sobreviva meses.
5. **Historias graduadas por bloque** con vocab vinculado a cards SRS (`getOrCreateVocabCard` con tag `story:{id}`) — el puente input→SRS está bien cableado.

---

## 3. Gaps ordenados por impacto en el aprendizaje real

1. **[Bloqueante] El repaso diario no reprograma cards** (§0.1). Sin esto no hay spaced repetition: el tiempo del usuario se reparte uniforme entre lo que ya sabe (cognados transparentes) y lo que se le resiste. Es exactamente el desperdicio que la pregunta 2 del encargo temía, causado por un bug, no por el diseño.
2. **[Bloqueante] Cero output con feedback.** La sesión diaria es 100% reconocimiento (§0.2) y la producción escrita es un buzón sin fondo (§0.3). Por la *output hypothesis* de Swain y todo lo posterior: sin producir y ser corregido, este usuario va a entender portugués en semanas (lo hacía casi desde el día 1 por ser hispanohablante) y va a hablar *portuñol* indefinidamente. Para un par de lenguas tan próximas, el output corregido importa MÁS que el input.
3. **Sin interacción ni negociación de significado.** No hay conversación (ni siquiera un chat LLM), no hay ASR (el shadowing es a ciegas y se autocalifica siempre "bien", §0.5). La app cubre input y (en teoría) retrieval, pero la fluidez conversacional — presumiblemente la meta real — no se entrena en ningún mecanismo del repo.
4. **Feedback superficial:** fuera de `error_correction` (que sí trae `explanationEs`), el usuario se entera de *que* falló, no de *por qué*. No hay diagnóstico de interferencia ("escribiste *quedar* pensando en español; en PT es *ficar*") pese a que el glosario ya marca `falseFriend: true` — dato que ningún ejercicio explota. Y el mastery que ve en el dashboard es ruido (§0.4).
5. **Interferencia sub-atacada:** 12 falsos amigos marcados de 49 entradas de glosario es poquísimo (los inventarios ES↔PT estándar superan 100: *embaraçada, exquisito/esquisito, oficina, borracha, apellido, largo, todavia, polvo…*). Además la correspondencia `b1-corresp-ll-lh` ("-ll- → -lh-") es lingüísticamente incorrecta como regla (ES *ll-* inicial → PT *ch-*: llave→chave; el PT *lh* corresponde al ES *j*: mujer→mulher, ojo→olho) y el MDX de la lección enseña ll→ch mientras el concepto declara ll→lh — inconsistencia interna que confundirá justo donde se quería ayudar.
6. **BR y PT a la vez siendo principiante:** honestamente, estorba más de lo que ayuda en b1–b4. Mantener dos representaciones fonológicas del mismo lexema (s final /s/ vs /ʃ/, r inicial /h/ vs vibrante), dobletes léxicos (cardápio/ementa, trem/comboio) y dos gramáticas de progresivo (*estou falando* vs *estou a falar*) duplica la carga en la fase donde la memoria fonológica del PT aún no existe. La app lo mitiga bien (variante activa única), pero el contenido tiene *bleed* real (el texto **BR** de `b3-s1` usa "ementa", PT-PT) — señal de que ni el pipeline de contenido logra mantenerlas separadas. Recomendación estándar SLA: una variedad como ancla hasta ~B4/B5 del currículo, la otra solo receptiva (audio compare), y estudio explícito del contraste al final (el bloque 10 ya existe para eso).
7. **Placement decorativo:** el diagnóstico (26 MCQ, dist. b1:8/b2:6/b3:6/b4:2/b6:2/b8:2) computa `recommendedStart` y lo guarda (`DiagnosticRunner.tsx`), pero nada lo consume para saltar bloques o sembrar cards. Un hispanohablante típico ya "sabe" pasivamente medio b2–b3; empezarlo en b1-l1 (nombres de letras) desperdicia sus primeras sesiones — las que deciden si el hábito prende. Además, todo MCQ de reconocimiento sobreestima a un hispanohablante justo por la transparencia léxica.
8. **Gramática 100% deductiva:** todas las lecciones MDX abren con `<Rule>` y luego ejemplos. Para un adulto con L1 próxima es defendible (la instrucción explícita rinde, Norris & Ortega 2000), pero no hay una sola tarea de *noticing* inductivo (p. ej. "lee estas 6 frases, ¿cuándo se usa *ficar*?"), que es lo que mejor fija los contrastes que el español no marca.
9. **Escucha extensiva insuficiente:** ~20 historias cortas es el inventario completo de input. No hay re-escucha programada, ni audio-only mode, ni contenido más allá del currículo. Para comprensión auditiva del PT-BR rápido o del PT-PT reducido (el verdadero muro para hispanohablantes) hará falta fuente externa (podcasts, TV) — la app ni lo sugiere.

---

## 4. ¿Aprender BR y PT simultáneamente? (respuesta honesta)

Para *este* usuario (principiante, adulto, hispanohablante): **estorba ahora, ayuda después**. La proximidad ES-PT ya genera una tarea de inhibición constante (suprimir el español); añadir una segunda norma del PT duplica esa tarea en el peor momento. Los estudios de third-language/bidialectal acquisition apuntan a que la exposición receptiva temprana a ambas variantes no daña la comprensión, pero la *producción* estable requiere un modelo dominante. El diseño de la app (variante activa única + compare toggle) ya es la implementación correcta de "una produce, la otra se escucha" — solo falta convertirlo en recomendación explícita del onboarding: elige BR o PT según tu meta, y no lo cambies hasta terminar el bloque 4. El bloque 10 (variação diatópica) es el lugar correcto para sistematizar el contraste, no las semanas 1–20.

---

## 5. Top-5 recomendaciones (en orden: qué primero y por qué)

1. **Cablear `submitAnswer` en `SessionScreen.handleGrade`** — sin esto, nada de lo demás importa: el producto afirma ser un SRS y no lo es. Mecánica: en `handleGrade`, llamar `submitAnswer({ cardId: ex.id, rating, responseMs, mode: "review", variant, conceptIds: ex.concepts, blockId: ex.blockId, sessionId })` (todo ya existe en `lib/db/repository.ts:163`); reemplazar `PLACEHOLDER_INTERVALS_MS` por `previewIntervalMs()` de `lib/srs/fsrs.ts` (también ya existe); quitar el doble conteo con el update de sesión de `PracticarSrsInner` (submitAnswer ya incrementa `cardsReviewed`); corregir el texto del banner de fatiga. Con esto, FSRS empieza a mandar los cognados fáciles a +30 días y a concentrar el tiempo en lo que duele — resolviendo de golpe la pregunta 2.
2. **Hacer real el feedback de producción o quitar la promesa.** Mover la cola de `db.telemetry` a una tabla propia (el ring buffer de `logTelemetry` puede borrar ensayos del usuario); añadir un consumidor de `getPendingProduction()` que mande el texto a un LLM (el repo ya integra MiniMax para generación de contenido) con un prompt de corrección contrastiva ES→PT, y mostrar las correcciones como primera card de la siguiente sesión ("Tu texto de ayer: 3 correcciones"). Cerrar el loop de Swain es el salto de calidad más grande disponible: convierte la única práctica de producción libre en aprendizaje en vez de fosilización. Y que "Saltar" no califique Good(3).
3. **Restaurar el retrieval activo en la sesión diaria.** `ExerciseRunner.AnswerableCard` ya sabe despachar los 9 tipos a sus componentes reales con respuesta escrita/selección + panel de grade; portar ese dispatch a `SessionScreen` (o reutilizar el runner) en lugar del branch reveal-only, arreglar `backFor()` para `error_correction` (lee `data.correct` y muestra `explanationEs`), y conectar `onPlayAudio` al `AudioButton` existente (hoy las cards de listening son mudas). Esto sube la sesión diaria de reconocimiento a producción — el nivel de práctica que sí transfiere.
4. **Arreglar el mastery usando el código que ya está escrito:** en `recordAnswerForConcepts`, calcular `accuracy` con `weightedAccuracy()` sobre el historial de `AnswerEvent` del concepto (los eventos ya guardan `conceptIds` y `ts`), en vez de `correct ? 1 : 0`. Con mastery estable se puede además hacer útil el diagnóstico: usar `recommendedStart` para pre-marcar conceptos de bloques anteriores como vistos/acelerados.
5. **Anclar una variante hasta B4 + darle dientes al shadowing + ensanchar el ataque a la interferencia.** (a) Onboarding: elegir BR o PT como variante de producción y esconder el toggle tras "modo avanzado" hasta completar b4 (el compare de audio queda, es receptivo); de paso re-correr la remediación de bleed (`b3-s1` BR contiene "ementa"). (b) `ShadowingCard`: permitir marcarse mal (hoy `onSubmit("", true)` fijo) y añadir scoring básico con Web Speech API (`SpeechRecognition` con `lang: pt-BR/pt-PT`, comparar transcript vs `d.text` — barato y suficiente para detectar nasales perdidas). (c) Glosario: crecer de 12 a 60+ falsos amigos y generarles ejercicios `error_correction` dedicados (el tipo que ya tiene `explanationEs`), que es el formato ideal para interferencia. Finalmente, aceptar el límite del producto: para conversación real, complementar con intercambio/tutor 1×semana — ninguna app de cards lo sustituye, y decírselo al usuario es honestidad instruccional.
