# Cola 6 — dictamen y aplicación (b5 futuros/condicional + b6 conjuntivo)

**Sesión** E2#8 · **Fecha** 2026-08-31 · **Ítems** 100 (46 de `b5.json`, 54 de `b6.json`)
**Estado** APLICADO · audio regenerado · suite/typecheck/verify:content/check-audio-stale verdes.

## Recuento medido

| | ERROR | DUDA | OK | Total | Tasa |
|---|---:|---:|---:|---:|---:|
| b5 (futuros y condicional) | 15 | 11 | 20 | 46 | **33 %** |
| b6 (conjuntivo) | 38 | 2 | 14 | 54 | **70 %** |
| **Total** | **53** | **13** | **34** | **100** | **53 %** |

Colas 1-5: 46 / 45 / 50 / 49 / 40 %. La 6 sube a 53 % **por el bloque 6**, que
concentra el 72 % de los errores de la cola. b6 (conjuntivo, 70 %) desbanca a
b3 verbos (52 %) y b4 pasados (52,2 %) como la peor clase medida del corpus.

Aplicado: 53 ítems corregidos con **78 correcciones a la letra**, 13 DUDA
selladas, 34 OK sellados. Diff semántico: **53 ítems con cambio de contenido,
47 sólo sello, 414 sin cambio** (el diff textual mostraba 467 líneas porque el
serializador reordena claves — de ahí que el diff textual no valga como control).

## Auditoría del informe antes de aplicar

No apliqué nada sin comprobarlo. Lo verificable por máquina, verificado:

- **Alineación** informe↔cola: los 100 casan por `id` y `file`.
- **#53 NO GANABLE** ✔ confirmado: `answer` = «Expresión impersonal de
  **possibilidade**» y en `options` figura «…de **posibilidad**». Ninguna
  elección puntúa. (`ListeningCard` compara `opt === data.answer`.)
- **Formas inventadas** ✔ las tres presentes en el corpus: «Dúvido» (×2),
  «facças».
- **#31 reparto BR↔PT invertido** ✔ confirmado literalmente: base traía
  `person: "você"`, `answer: "terá"` y el override `pt-pt` cambiaba **sólo** la
  answer a «terás» ⇒ al alumno europeo se le mostraba «ter · você» y se le
  exigía «terás».
- **Ensamblados rotos** ✔ confirmados montando la frase con la answer y con
  cada alternativa. Los seis son reales y uno de ellos es peor de lo descrito:
  en #18, #51 y #75 **falta el verbo entero** («eu ___ muito deste curso» →
  «eu **de** muito deste curso»; «Quero que ela **de** mim»; «É possível que
  nós **de** ajuda»).
- **Campos de las 78 correcciones**: 77 con el valor `de` casando EXACTAMENTE
  contra el repo; 1 sobre un campo ausente (`esContrast` de #98), autovivificado.

**Una discrepancia, en la dirección buena.** Mis cuentas de corpus salen más
altas que las del informe: «Oxalá que» **7** (dijo 5), «a certeza» **76** (dijo
73), «estrangeiro» **21** (dijo 18). Las tres contrapartidas dan **0** en las dos
cuentas («Tomara que», «tenho certeza») o 1 («no exterior»). La dirección del
veredicto queda confirmada y reforzada; anoto la discrepancia porque un revisor
que cuenta corto hoy puede contar largo mañana.

**Una corrección que revertí.** El arreglo de #31 traía además el renombre
`tense: "futuro do presente"` → `"futuro do indicativo"`. El propio informe
había dejado esa etiqueta como DUDA para Edu, así que cambiarla en **un** ítem
la pre-decide y deja el corpus con 1 etiqueta contra 6. Revertido el campo,
mantenido el arreglo BR↔PT (base europea `tu/terás`, brasileño al override).

## La decisión que queda para Edu: «futuro do presente»

7 ítems etiquetan el tiempo con el término escolar **brasileño**. En Portugal es
«futuro do indicativo» (Dicionário Terminológico). El corpus usa términos
europeos en todo lo demás — «condicional» (un brasileño diría «futuro do
pretérito»), «presente do conjuntivo», «futuro do conjuntivo» (un brasileño
diría «subjuntivo») —, así que estos 7 son los únicos disonantes.

Medido, para que la decisión no se tome a ciegas:
- **Es visible**: `ConjugationCard.tsx:22` pinta `{d.person} · {d.tense}`.
- **Cuesta un `sed` de 7 campos.** El id de lección `b5-l1-futuro-presente`
  aparece 65 veces en 4 ficheros (incluido `audio-refs.json`), pero **no hay que
  tocarlo**: es una clave interna sin título asociado. No hay impacto en audio.

## Las clases dominantes

1. **Glosas `esContrast` rotas — 31 ítems** (19 sólo por eso). Es lo único que
   el alumno lee DESPUÉS de fallar, y explicaba mal. Siete escritas en
   portugués, una en inglés («pero en español *we'd say*»), falsos amigos
   inventados (dos ítems niegan que «lidar com» sea «lidiar con» — y la fuente
   española de uno de ellos dice «lidiar con»), morfología falsa (declara
   irregular el condicional de «ver»; Priberam: *veria*, sobre el infinitivo —
   los únicos irregulares son *dizer, fazer, trazer*), una glosa que dice
   «-á … no como en es '-á'» (idéntico a los dos lados, no dice nada) y una que
   contradice a su ítem («indicativo tras espero» en una frase con «espero que
   **esteja**»).
2. **Ensamblados agramaticales — 9 ítems**: preposición duplicada, hueco sin
   verbo, clave que premia el error, 1 ítem no ganable, 2 fronts que regalan la
   respuesta antes de revelar.
3. **Formas inventadas (3) y tarjetas muertas (6)** — ver el triaje completo abajo.
4. **Reparto BR↔PT invertido — 6 ítems** (#31, «Tomara que», «não tenho
   certeza», «liguem para mim», «no exterior», «traducir al PT-BR» dentro de la
   base europea).
5. **Futuro do conjuntivo: 0 confusiones de forma.** Los 10 ítems que lo usan lo
   usan bien. Lo roto es la explicación alrededor (dos definen el conector con
   un verbo español, «*ocurrirá*», que además se locuta). El punto realmente
   falseado de b6 es **«talvez»**: un ítem enseña que va «antes ou depois do
   verbo no subjuntivo» (pospuesto exige **indicativo**) y su glosa niega la
   asimetría clave con «En español también funciona igual» — la asimetría que el
   bloque existía para enseñar.

## Barrido completo: las 15 flashcards muertas del corpus

El informe encontró 6 en la cola. El barrido mecánico sobre los 542 flashcards
del corpus dice que la clase es **15**. Enumeradas y triadas todas, que es la
regla: el defecto es el mismo en las quince — **cero español en la tarjeta**, así
que se le pide al alumno que produzca la palabra que se le acaba de enseñar. La
convención sana del corpus es front en español, back en portugués («Traduce
'esfuerzo'» → «esforço»).

| ítem | fichero | tarjeta | destino |
|---|---|---|---|
| `419a2f15` | b6 | «vaga (substantivo - emprego)» → «vaga» | corregida en esta cola |
| `496c5452` | b6 | «apertado (adjetivo)» → «apertado / apertada» | corregida en esta cola |
| `72151956` | b6 | «talvez» → «talvez» | corregida en esta cola |
| `93088d54` | b6 | «lidar com (verbo)» → «lidar com» | corregida en esta cola |
| `9fce0ceb` | b6 | «talvez (adverbio)» → «talvez» | corregida en esta cola |
| `a3b799c6` | b6 | «rumo (substantivo)» → «rumo» | corregida en esta cola |
| `88f4a544` | b1 | «hotel» → «hotel» | **lote E2#9** · tag `h-muda`: el punto (la h no se pronuncia) no aparece en ninguna parte de la tarjeta |
| `d70fb1c6` | b1 | «hora» → «hora» | **lote E2#9** · idem `h-muda` |
| `7453b417` | b4 | «saudade» → «saudade» | **lote E2#9** · front debe ser el español («añoranza, morriña») |
| `c393d532` | b4 | «admirar» → «admirar» | **lote E2#9** · cognado idéntico: o enseña algo (conjugación, régimen) o se mata |
| `01c91268` | b6 | «formulário (substantivo)» → «formulário» | **lote E2#9** · **duplicado exacto** de `32e521c9` en otra lección |
| `32e521c9` | b6 | «formulário (substantivo)» → «formulário» | **lote E2#9** · duplicado; uno de los dos se mata |
| `c3039dc6` | b6 | «início (substantivo)» → «início» | **lote E2#9** |
| `cdb2ca2d` | b6 | «confiança (substantivo)» → «confiança» | **lote E2#9** |
| `e3d20fd0` | b6 | «ligação (substantivo)» → «ligação» | **lote E2#9** |

Las nueve de fuera de la cola **no** las improviso aquí: rehacer una tarjeta es
escribir contenido, y el contrato dice que el contenido nuevo pasa por los dos
revisores adversariales. Van con su diagnóstico escrito al primer lote de E2#9,
que es exactamente lo que la regla de corte manda hacer con lo que no cabe.

Nota aparte del mismo barrido: `72151956` y `9fce0ceb` comparten **los dos
hashes de audio** (`e7a24ce4…` br, `7bcacf5a…` pt) — son el mismo ítem dos
veces, con distinto front. Corregidos por separado en esta cola; si tras la
corrección siguen enseñando lo mismo, uno sobra.

## Qué está bien (medido, no cortesía)

- **La morfología verbal es sólida**: las 13 fichas de conjugación son correctas
  una por una (falarei, serei, farei, direi, trarão, irei, falaria, faria,
  diria, seriam, gostaria, veria, terás). Nadie inventó un paradigma.
- **Los 3 ítems de corrección de errores de b5** atacan calcos reales del
  hispanohablante: «falaré» por «falarei», «fazerei» por «farei» y «vou **a**
  falar» por «vou falar» — el error número uno de un español hablando portugués.
- **El imperfeito do conjuntivo de b6 está limpio**: 5 ítems, correlación
  temporal correcta en los cinco, con disparadores variados.
- **Ningún «-ámos» mal acentuado** en los 100: el nido que costó 7 ítems en la
  cola 5 no toca ni b5 ni b6.
