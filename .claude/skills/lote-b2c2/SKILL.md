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
2. **Los dos gates de máquina, antes de gastar un revisor:**
   - `npx tsx scripts/check-bleed-docs.ts <doc>` (escrituras ajenas).
   - `npx tsx scripts/check-virginidad.ts --nuevos <candidatos.json>`
     — **el barrido de virginidad ya no se hace a ojo**. Compara cada
     par (sentence, repair) contra los 2.151 ejercicios del corpus por
     solape ponderado por IDF. Existe porque durante cuatro lotes la
     regla se cumplió sólo sobre los ids `b2c2-`, y eso metió duplicados
     EN PRODUCCIÓN: `gj-01` (el primero del piloto) puntúa 1,0 contra
     `b5/823a95c9`; `gj-l3-01` repite un target de b6; `gj-l4-12`
     repite `b7/cc7715be`. Umbral útil 0,5; por debajo entra ruido de
     vocabulario común. Lo que marca no se retira automáticamente: se
     mira. Coincidir en «pão» es ruido; coincidir en el PUNTO es muerte.
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

- «prefiro o comboio **do que** o autocarro» — Ciberdúvidas es
  categórico contra ello y aun así cae: Eça lo usa en `os-maias-c01`
  («preferia saber que elle recolhera… --do que vel-o»). Norma explícita
  ≠ verdict inequívoco cuando la propia Biblioteca del curso lo
  desmiente (lote 5)

Regla: atestación de USO o de DICCIONARIO con el sentido condenado =
fuera. Frecuencia no es gramaticalidad. Distinción fina del lote 2:
«vacações» sobrevivió porque es entrada fósil SIN uso vivo — atestación
de uso ≠ entrada de diccionario, pero la explicación debe decir la
verdad («fósil jurídico», no «no existe»).

**Y la regla que hace útiles a las anteriores: el grep que absuelve
tiene que ser ancho.** En el lote 5 di por virgen «preferir do que»
porque busqué `prefiro … do que` — 1.ª persona, presente. El uso
atestado estaba en `preferia`. Un grep estrecho no absuelve a nadie:
busca el LEMA (todas las personas y tiempos), no la forma que escribiste.

## El molde de los juicios

- **Ratio ~10/10 con la última MAL en posición 19-20** (mata el conteo),
  runs ≤3, sin alternancia mecánica, arranque DISTINTO de todos los
  lotes previos (el lote 2 calcó 17/20 posiciones del 1; el 3 calcó el
  arranque — ambos se rehicieron). Arranques quemados: MBM, BMM, BMB,
  MBB, MMB, BBM.
- **El solape con los lotes previos se busca cerca del AZAR (≈10/20), no
  al mínimo.** Corrección del lote 5: presenté un 2/20 contra el lote 4
  como virtud y está a 3,6σ — es la casi-complementaria de ese lote,
  que es un patrón igual que el calco. El objetivo es independencia.
- **Los atajos se miden como ACIERTO sobre los 20, nunca como recall
  sobre los MAL.** El lote 5 presumió de «1/20» comparándolo con el
  «19/20» del lote 3: manzanas y peras, 10 puntos de mejora inflada. El
  acierto real era 11/20.
- **Hay que probar más de un atajo.** Los tres conocidos, con su cifra
  del lote 5 v2 tras corregirlos: palabra española visible (11/20),
  **marca de día concreto (15/20 → 9/20)**, glosa cognada que da español
  normal (16/20 → 13/20). El del día nació de un descuido que se repite
  solo: **si añades un rasgo por el bien de los MAL —un adverbio
  temporal, un contexto, una longitud— tiene que aparecer también en los
  BIEN.** Anclar temporalmente sólo los MAL hizo predecible el 75 % del
  lote.
- **Dieta mixta obligatoria**: si los MAL se resuelven con «¿hay una
  palabra visiblemente española? → MAL», el lote es de A2 disfrazado
  (19/20 sin saber portugués, lote 3). Mínimo 3-4 MAL gramaticales
  donde TODAS las palabras sean portuguesas (talvez+conjuntivo,
  progresivo-no-futuro, dequeísmo, colocação, ser/estar…). Contra el
  atajo de la glosa cognada, lo que ayuda son MAL cuya traducción
  palabra-por-palabra dé español **roto**: «Los ciudadanes votaron»,
  «Habían muchas personas», «Ayer he hablado», «Prometo hacer-lo».
- **Un solo error por frase MAL, repair MÍNIMO** (corrige EL error, no
  dos cosas — «estou a esperar», no «estou à espera de»).
- **Sin absolutos falsos**: «no existe» / «obligatoriamente» / «nunca»
  han caído TRECE veces. Olvidar/aficionado/regalo/gana/listo existen;
  ir a + inf de inminencia existe; la contracción tiene excepción;
  «morada» SÍ es morada de vivir (Priberam ac. 1); «menor» SÍ convive
  con «mais pequeno»; «não tenho a mínima ideia» SÍ se dice; «dar pena»
  existe; «tava» SÍ se escribe en Portugal; «tive que» convive con
  «tive de». Hedge con verdad: «hoy nadie lo dice», «en el estándar
  europeo», «suena más culto».
- **Cuidado con la regla que se enuncia con los ejemplos que la
  confirman.** «Tras -r cae la consonante y el verbo se acentúa» es
  falso para los -ir (parti-lo, abri-la) y los tres ejemplos que puse
  eran -ar/-er/-ôr: la prueba escondía la excepción. Si enuncias una
  regla, busca la conjugación o el caso que la rompe ANTES de escribirla.
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
- **`address` SÓLO donde hay tratamiento en la frase.** El catálogo
  publicado lo omite en 68 de 86 ítems: se declara cuando hay un «tu»,
  un «-te», un posesivo de 2.ª o una forma verbal 2sg. La v1 del lote 5
  lo declaró en 20/20, incluyendo frases sin ni una marca de segunda
  persona — eso rompe la convención y ensucia `revisarRegistro`.

## El molde de las mediaciones

- **sourceText de la Biblioteca, EXTRAÍDO POR SCRIPT del JSON** — jamás
  re-tecleado ni descrito de memoria. Tres reincidencias: el castillo
  inventado (piloto), las espigas en monedas (lote 2), el rey vivo
  (lote 3). La grafía antigua de Eça/Junqueiro NO se «corrige».
- **El recorte tiene que sostenerse solo.** El de la v1 del lote 5
  empezaba en «Dito isto desappareceu» — una anáfora cuyo antecedente
  (Jesús) quedaba fuera. Lee el primer párrafo del recorte preguntándote
  quién es «él» y qué es «esto»: si no se contesta desde dentro, amplía.
- **NINGUNA CITA DE CORPUS ENTRA SIN LEER LA FRASE ENTERA ALREDEDOR.**
  Es el mismo mecanismo que produjo las espigas convertidas en monedas,
  ahora en las pruebas: en el lote 5 justifiqué dos retiradas con greps
  que devolvían la cadena y no el sentido — «todo o que» resultó ser
  «todo aquel que» (otro sentido) y «eram as duas» era «son las dos
  RELACIONES», no un reloj. Las retiradas eran correctas; las pruebas,
  falsas. Un grep da candidatos, no veredictos.
- Los ficheros con guion doble son SOLO de contos-phantasticos;
  amor-de-perdicao-cNN va con guion simple. `parrafos[0]` puede ser el
  numeral de sección.
- **Rúbricas binarias autoevaluables** (nada de «suena real» sin
  operacionalizar) y el MODELO debe cumplir SU rúbrica casilla a
  casilla. Techo de `summarise` ≤ ~70% de la fuente; relay/reformulate/
  cross_variety recuentan y pueden exceder.
- **Comprueba el modelo contra su rúbrica UNA CASILLA POR VEZ, por
  escrito.** En el lote 5, TRES de seis modelos incumplían el suyo y yo
  no lo vi: uno se comía la mitad de la sentencia que la casilla exigía,
  otro no nombraba a la destinataria que la casilla pedía nombrar, otro
  fallaba a la letra. Leerlo entero y decir «cumple» no es comprobarlo.
- **La rúbrica tiene que ser SATISFACIBLE dentro del `wordRange`.**
  Redacta la respuesta mínima que tica todas las casillas y cuéntala: si
  mide el máximo justo, el rango está mal. (MED-28: mínimo cumplidor
  60 palabras, rango 35-60.)
- **Una casilla verificable por script vale por tres de juicio.** «No
  copia más de 6 palabras seguidas de la fuente» se comprueba con
  n-gramas y no admite discusión. Métele al menos una por mediación.
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
