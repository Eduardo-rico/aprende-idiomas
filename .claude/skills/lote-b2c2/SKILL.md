---
name: lote-b2c2
description: Producir un lote del catálogo B2-C2 de portugués (juicios de gramaticalidad + mediaciones + lecciones b11+) con el ciclo completo borrador → doble adversarial → convergencia → gates → publicar. Usar para cada lote nuevo, para lecciones del bloque Anti-calco, y como molde de sus reglas — cada una viene de un error ya pagado en el piloto o los lotes 1-3.
---

# Lote B2C2 — el ciclo que se autocorrige

Destilado de 4 ciclos ejecutados (piloto + lotes 1-3, 2026-07-29/30, 86
ítems publicados). Cada regla tiene historial: no es teoría, es cicatriz.

## El ciclo

1. **Borrador** en `docs/contenido/AAAA-MM-DD-loteN-….md`, marcado
   `NO PUBLICADO`. TODO redactado: consignas, rúbricas Y modelos — nada
   «se redacta en build» (deuda del lote 3: dos modelos salieron sin
   tercer round). Con notas del autor: las dudas se confiesan, los
   revisores las responden mejor que tú.
2. **`npx tsx scripts/check-bleed-docs.ts <doc>`** antes de lanzar.
3. **DOS `linguista-adversarial-pt` EN PARALELO, sin verse** (si los
   agentes del repo no están registrados en la sesión: general-purpose
   con «lee y adopta .claude/agents/linguista-adversarial-pt.md»).
   Prompts distintos: al #1 dale el ángulo lingüístico (verdicts,
   Priberam, corpus de la propia biblioteca), al #2 el pedagógico
   (diseño del lote, patrones explotables, fugas, nivel real).
   Pídeles cotejar fuentes contra los JSON y responder tus notas.
4. **Convergencia**: lo convergente se aplica; lo de un solo revisor se
   aplica SOLO si es verificable de plano (una próclise sin clítico, un
   fichero que no existe) — si no, queda anotado para el siguiente
   lote. Conflicto directo entre revisores → gana el refuerzo
   estrictamente superior si existe; si no, queda el original, anotado.
5. **Publicar por script** (scratchpad .mts): construye los ítems,
   `contentHash` de `scripts/lib/staged-validate`, sello
   `variantVerificacion` con fecha y doc, y VALIDA ANTES de escribir
   (el lote 3 escribió y validó después: un modelo salió 61/60).
6. **Gates**: barrido de `revisarEjercicio` + `revisarRegistro` sobre
   los ítems nuevos (hallazgos didácticos esperados se declaran),
   `npm run verify:content` (los 4 errores de audio en translations son
   preexistentes), suite completa, y recuentos de modelo por script.
7. **Doc a estado PUBLICADO** con la tabla de resultado (qué se retiró,
   qué convergió, qué quedó en conflicto) — el borrador se conserva
   debajo como historia. Commit por hito, push.

## La barra de retirada (jurisprudencia)

Un juicio binario se RETIRA si el verdict no es inequívoco. Han caído:
- «medo aos cães» — `medo a` atestada en regência europea (lote 1)
- «regalo» — diccionarizado como 'presente' Y vivo en el Eça de la
  propia Biblioteca (lote 2; el revisor lo probó con grep al corpus)
- «gana», «listo» — Priberam los registra con el sentido del estímulo
  (lote 3; «listo» es regionalismo de Trás-os-Montes y basta)
- «pelo comprido» de «ela» — la lectura gata era legítima: ancla el
  referente («a minha irmã»); «esquisita» sola — ancla la intención
  («Parabéns à cozinheira»)

Regla: atestación de USO o de DICCIONARIO con el sentido condenado =
fuera. Frecuencia no es gramaticalidad. Distinción fina del lote 2:
«vacações» sobrevivió porque es entrada fósil SIN uso vivo — atestación
de uso ≠ entrada de diccionario, pero la explicación debe decir la
verdad («fósil jurídico», no «no existe»).

## El molde de los juicios

- **Ratio ~10/10 con la última MAL en posición 19-20** (mata el conteo),
  runs ≤3, sin alternancia mecánica, arranque DISTINTO de todos los
  lotes previos (el lote 2 calcó 17/20 posiciones del 1; el 3 calcó el
  arranque — ambos se rehicieron).
- **Dieta mixta obligatoria**: si los MAL se resuelven con «¿hay una
  palabra visiblemente española? → MAL», el lote es de A2 disfrazado
  (19/20 sin saber portugués, lote 3). Mínimo 3-4 MAL gramaticales
  donde TODAS las palabras sean portuguesas (talvez+conjuntivo,
  progresivo-no-futuro, dequeísmo, colocação, ser/estar…).
- **Un solo error por frase MAL, repair MÍNIMO** (corrige EL error, no
  dos cosas — «estou a esperar», no «estou à espera de»).
- **Sin absolutos falsos**: «no existe» / «obligatoriamente» / «nunca»
  han caído SIETE veces. Olvidar/aficionado/regalo/gana/listo existen;
  ir a + inf de inminencia existe; la contracción tiene excepción.
  Hedge con verdad: «hoy nadie lo dice», «en el estándar europeo».
- **Sin fugas**: la explicación de un ítem no puede ser la respuesta de
  otro (GJ-05→06 del piloto, 06→07 del lote 1, 01→02 del lote 2 — las
  tres se cortaron). Lección→ejercicio SÍ es diseño válido: los ítems
  que una lección «regala» viven EN su bloque, tras la lección.
- **Puntos vírgenes verificados CONTRA LOS JSON publicados** (grep a
  b8/b10/b11), no contra la memoria — la lista de cabecera del lote 2
  estaba incompleta y costó dos repeticiones.
- **Metadata coherente**: todo tuteo declara `register informal ·
  address tu`; deferencia 3.ª declara formal; la mesóclise es culta,
  no informal. BIEN de hipercorrección = el canon correcto (mesóclise,
  infinitivo pessoal, hei de, gostava que, importa-se de, se calhar,
  imenso adverbial).

## El molde de las mediaciones

- **sourceText de la Biblioteca, EXTRAÍDO POR SCRIPT del JSON** — jamás
  re-tecleado ni descrito de memoria. Tres reincidencias: el castillo
  inventado (piloto), las espigas en monedas (lote 2), el rey vivo
  (lote 3). La grafía antigua de Eça/Junqueiro NO se «corrige».
- Los ficheros con guion doble son SOLO de contos-phantasticos;
  amor-de-perdicao-cNN va con guion simple. `parrafos[0]` puede ser el
  numeral de sección.
- **Rúbricas binarias autoevaluables** (nada de «suena real» sin
  operacionalizar) y el MODELO debe cumplir SU rúbrica casilla a
  casilla. Techo de `summarise` ≤ ~70% de la fuente; relay/reformulate/
  cross_variety recuentan y pueden exceder.
- **audience en la lengua del PRODUCTO** (pt→pt en portugués, pt→es en
  español). Consignas españolas sin lusismos («chiste», no «anedota»).
- **cross_variety**: el BR de la fuente debe ser BR AUTÉNTICO y
  verosímil (nada de frases fabricadas al revés para forzar el léxico
  meta); cuidado con condenar europeo vivo en la rúbrica («a gente
  encontra-se» es europeo; lo BR era la próclise).
- Variar taskType×fuente entre lotes: el tercer relay-de-anedota
  consecutivo ya es fórmula.

## Lecciones b11+ (Anti-calco C1)

- El MDX se revisa en el MISMO round que el lote (texto didáctico =
  misma saña). Estructura: `<Rule>` + `### Vocabulário` (≤7 en
  vocabKey) + `<Example>` + `<Tip>`.
- Checklist de bloque nuevo: `LessonSchema` en zod-schemas tiene
  `blockId max()` y `vocabKey max(7)` — subir el tope o revienta;
  `BLOQUE_A_NIVEL` en anchor.ts; BLOCKS en curriculum.ts; el test
  `loaders-lang` cuenta los bloques; `verify-content` exige que el
  lessonId de cada ítem exista EN SU bloque.
- Los ítems que la lección enseña nacen en su bloque con su lessonId y
  en `exerciseRefs`. Examples no reciclan repairs publicados verbatim.
- Dos familias en falsos amigos: los de verdad Y los que parecen falsos
  pero son amigos (apelido, constipado — el pánico viene del inglés).

## Sellos y trazabilidad

`variantStatus: 'unchecked'` + `variantVerificacion: 'Ola B2C2 lote N:
2 linguistas adversariais FECHA (doc)'`. Ids: `b2c2-gj-lN-XX`,
`b2c2-med-XX` (numeración corrida). El doc del lote es la constancia de
procedencia del contenido original — mismo rol que el gate de la Ola L.
