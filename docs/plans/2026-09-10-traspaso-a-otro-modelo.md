# Traspaso — 2026-09-10 — para una sesión nueva (Opus) que ejecute lo que falta

**Lee esto entero antes de tocar nada. Son ~200 líneas. Todo lo que dice está
medido hoy; lo que no está medido lo dice.**

Edu pidió este documento porque su cuota de Fable se acaba y lo que queda lo
hará otra sesión. La regla es: **hacer puntualmente lo que se pide, en el
orden que se pide, y reportar con cifras pegadas** (línea base → después,
con el momento). Si aparece HTTP 429, parar y decirlo; no reintentar en bucle.

---

## 0 · Estado medido HOY (2026-09-10), no el del 4 de septiembre

| qué | valor | cómo se midió |
|---|---|---|
| rama | `variante/pt-pt-como-base` en `4d8b0bc3`, igual a `origin` | `git log -1`, `git fetch` |
| árbol | LIMPIO salvo dos directorios de scratch sin valor: `.tmp-ro/` y `scripts/tmp-lin/` (sondeos de corpus; se pueden borrar) | `git status` |
| suite | **2455 / 2455** en 236 ficheros | `npx vitest run` (exit 0) |
| tsc | limpio | `npx tsc --noEmit` (exit 0) |
| stash | vacío | `git stash list` |
| PT | TERMINADO (2026-09-01, gate 5/5); **pero con 8 falsedades en su prosa, sin arreglar** (ver §2) | `docs/plans/2026-08-11-plan-cierre.md` |
| RO | déficit **370**, residuo 0, 453 ítems servibles, 107 puntos; quedan **5 puntos de `transformacion`** | `npx tsx scripts/deficit-ro.ts` |
| CS | biblioteca 745 lecturas · 1,92 M palabras; **0 puntos, 0 ejercicios** | `npx tsx scripts/paso0-idioma.ts --lang=cs` |
| RU | biblioteca 2.180 lecturas · 7,69 M palabras; **0 puntos, 0 ejercicios** | `--lang=ru` |
| LA | inventario 116 puntos, paradigma + lexicón L1 (384 formas), 36 lotes escritos en `lib/data/languages/la/lotes/`; **0 ejercicios en `blocks/`** (nada publicado) | `ls`, recuento de `blocks/b*.json` |
| GRC | sólo scaffold | `ls lib/data/languages/grc` |

**La nota del parón del 4-sep (`docs/plans/2026-09-04-estado-al-paron.md`)
decía que el árbol estaba en rojo por dos ficheros de latín. Ya no: la
sesión de latín cerró `Deus` (`3630df25`) y la suite está verde.** No
busques ese rojo.

---

## 1 · Los documentos que gobiernan cada lengua (no los reescribas; úsalos)

- **Rumano**: `docs/plans/2026-09-03-ro-relevo.md` (2.604 líneas). Su §0 es
  la regla que gobierna todo; su §3 dice qué producir y en qué orden; su §4
  son las trampas ya pagadas. **Antes de escribir un ítem rumano, lee §0 y
  §4 enteros.**
- **Latín**: `docs/plans/2026-09-03-la-relevo.md` (§7 = estado y lo que
  falta en orden) y `docs/plans/2026-09-03-la-grc-paso0.md` (diseño e
  inventario). Decisión del 4-sep: **el marco se presenta sin macrones**;
  la versión con macrones va en la respuesta o en la pista.
- **Auditoría de prosa**: `docs/auditorias/2026-09-04-prosa-que-lee-el-alumno.md`
  — las 8 falsas y 18 medias verdades, con fichero, ruta y evidencia cada
  una. **ERRATA DE ESTE DOCUMENTO, corregida el 10-sep**: una versión
  anterior decía «F1–F8, todas en PORTUGUÉS». Es falso y lo desmiente el
  propio recuento de la auditoría: **7 son de portugués (F1, F2, F3, F4,
  F6, F11, F12) y la octava es de RUMANO** (R2, «Contracciones
  OBLIGATORIAS»). La Tarea A cubre las siete; R2 sigue sin tocar.
- **Reglas transversales**: memoria del proyecto
  (`~/.claude/projects/-Users-lalo/memory/`), en especial
  `gotcha_gate_solo_en_verde.md`, `gotcha_un_sello_responde_a_una_pregunta.md`,
  `gotcha_mismo_dato_varios_campos.md`, `gotcha_fallo_que_devuelve_numero_plausible.md`.

---

## 2 · LO QUE FALTA, en el orden en que hay que hacerlo

### Tarea A — Arreglar las 7 falsedades de la prosa portuguesa (PRIMERO)

**Por qué primero**: el 4-sep quedó propuesto «arreglar las falsas antes
de seguir con lengua nueva», pendiente del OK de Edu. Edu, al pedir este
traspaso, quiere que lo que falta se haga; el coordinador (`idiomas`) es
quien confirma el orden — **pregúntale en el primer mensaje si el OK está
dado**. Si dice que sí, esto va antes que cualquier lote nuevo, porque es
prosa que el alumno lee como si fuera la lección en un curso ya declarado
terminado.

Las ocho, con su fichero (todas en `lib/data/languages/pt/lessons/` o en
MDX de `lib/data/languages/pt/mdx/`; la auditoría da ruta exacta y frase
literal de cada una):

| # | qué está mal | qué debe decir |
|---|---|---|
| F1 | «irregulares del futuro: ser, estar, ter, ir, fazer…» | son exactamente tres: `dizer→direi`, `fazer→farei`, `trazer→trarei` (`scripts/lib/paradigma-pt.ts` lo tiene bien) |
| F2 | imperfeito irregular = la lista del español | los irregulares del imperfeito portugués son `ser, ter, vir, pôr` |
| F3 | condicional tipo 1 con calco del español | con `se` + consecuencia futura va **futuro do conjuntivo** («se chover, não vamos») |
| F4 | imperfeito do conjuntivo «derivado del imperfeito» y «-ir da -esse» | se deriva del **pretérito perfeito 3.ª pl.** (`fizeram → fizesse`); `-ir` da `-isse` |
| F5 | futuro do conjuntivo «-ir da -er» | `-ir` da `-ir` (`partirem → partir`) |
| F6 | numeración de condicionales contradictoria | unificar la numeración en los objetivos y el MDX |
| F7 | progresivo brasileño («estou fazendo») en la base europea | `estar a + infinitivo`; el gerundio sólo en `variantOverrides['pt-br']` |
| F8 | `você` como cortesía europea | en PT-PT `você` a desconocido ofende; la deferencia es 3.ª persona sin pronombre / con nombre o cargo |

**Procedimiento (por cada una):**
1. Abrir la auditoría en la sección `#### Fn`, copiar la ruta y la frase literal.
2. Corregir el texto en el fichero. Si la frase vive en más de un sitio (la
   auditoría lista «copias vivas»), corregir TODAS: es la clase
   «el mismo dato vive en varios campos».
3. Pasar el texto corregido por el agente `linguista-adversarial-pt`
   (`.claude/agents/`) ANTES de commitear: pedirle ERROR/DISCUTIBLE/QUÉ ESTÁ
   BIEN sobre la frase nueva, con fuente.
4. Correr `npx vitest run`. **`tests/unit/corr-ro-a2b.test.ts:24` congela
   una de las falsedades** (lo dice la nota del parón): si se pone en rojo
   al corregir, arreglar el TEST, no revertir la prosa. Decirlo en el commit.
5. Commit por falsedad o por fichero, con la salida de los tests pegada,
   `Co-Authored-By` y `Claude-Session` del modelo que lo haga.
6. Al final: `npx next build` (el texto de lección atraviesa páginas).

**Cifra de cierre esperada**: «7 falsas de PT → 0; N medias verdades → M», con la
lista de commits.

#### ✅ TAREA A HECHA — 2026-09-10, commit `3ca0ee53`

**7 falsas de PT → 0.** Y además las 3 de rumano de la misma auditoría
(R2, R3, R4), que la tabla de arriba no listaba.

Lo que hay que saber si se vuelve sobre esto:

- **La auditoría no miró los MDX**, y ahí vivía la misma familia de
  falsedades en el texto que el alumno lee COMO la lección. Se
  reescribieron siete reglas (`b5/l1`, `b5/l2`, `b5/l3`, `b5/l4`,
  `b6/l2`, `b6/l3`, `b7/l2`). La lección del gerundio enseñaba brasileño
  entera —regla, dos ejemplos y el Tip— en la rama europea.
- **F6 no era «unificar la numeración», era matarla.** Se habían borrado
  las tarjetas que DEFINÍAN los tipos 1-4 y quedaban 25 que los USABAN,
  varias repitiendo la falsedad que F3 denuncia. Ahora se nombran: real /
  hipotética / irreal de pasado.
- **EL LINGÜISTA ENCONTRÓ SEIS ERRORES EN MIS PROPIAS CORRECCIONES**, y
  esto es lo más transferible del lote: *una corrección no es verdad por
  ser una corrección*. El grave: al matar F3 escribí la regla absoluta
  «tras `se` NUNCA va presente de indicativo», y la desmiente un ítem
  PUBLICADO del curso (`c092ca4e`: «Se os preços são tão altos, terei de
  fazer um esforço»). El futuro do conjuntivo es obligatorio cuando la
  condición MIRA AL FUTURO; para un hecho presente o general el
  indicativo es correcto. **El paso 3 del procedimiento no es un trámite.**
- **`corr-ro-a2b.test.ts:24` no se puso en rojo**: 19/19. La nota del
  parón se equivocaba, o la falsedad que congelaba ya se había ido.
- **`next build` NO se corrió**, a propósito: hay un servidor de Edu vivo
  en el 3000 desde el 3-sep y el build escribe en el mismo `.next`. Los
  siete MDX se validaron compilándolos con `@mdx-js/mdx`, que es lo que
  ese gate habría comprobado. **Si alguien lo corre, que mire antes si
  ese servidor sigue vivo.**
- **Gate nuevo**: `tests/unit/prosa-pt-falsedades.test.ts`, visto en rojo.
  Su primera versión salía roja por la propia regla que CITA la forma mala
  para prohibirla: un gate que no distingue «enseñar X» de «avisar contra
  X» marca lo correcto y nadie lo lee.
- **`concepts.json` pasó de 50 a 241** al regenerarlo: llevaba meses
  desincronizado de `curriculum.ts`, su generador. Comprobado que **no
  llega al alumno**: `loadConcepts()` no se llama desde ninguna pantalla y
  `description` no se pinta en ningún componente.

### Tarea B — Los 2 puntos de `transformacion` que le quedan al rumano

**CORRECCIÓN DEL 2026-09-10**: son **DOS**, no cinco. Los cinco puntos con
`formato: 'transformacion'` son `r3-imperativo-afirmativo` (9 ítems),
`r5-imperativo-negativo` (8), `r6-cliticos-imperativo-gerunziu` (2, piso
declarado), **`r7-infinitivo-residual` (0)** y **`r7-pasiva-impersonal`
(0)**. Sólo los dos últimos están a cero, y son justo los que el relevo
manda dictaminar A LA VEZ.

Déficit 370 → lo que quede. Todo está en `2026-09-03-ro-relevo.md` §3; no
hay que diseñar nada nuevo. Lo que ese relevo advierte y NO hay que olvidar:

- A los dos puntos de `r7` hacerles la pregunta del §3.1 **contra
  `r7-supin` y `r7-anti-progresivo`**, y **a los dos a la vez** (fue lo que
  evitó que los lotes 28 y 29 se duplicaran).
- Máquina: `scripts/lib/transformacion-ro.ts`; publicador y gates ya
  existen (mirar el último lote publicado, `git log --grep='F-RO lote'`,
  y copiar su forma exacta).
- Ciclo, sin saltarse pasos: preparado en seco → gates vistos en rojo con
  la salida pegada → ataque de `linguista-adversarial-ro` con fuente →
  aplicar → publicar → `npx tsx scripts/deficit-ro.ts --registrar "…"`
  con **residuo 0**.
- Para cada uno: si el lingüista dice que el punto es «gratis» para un
  hispanohablante (como pasó con el 29), se declara **piso reducido en su
  propia línea**, no se rellena a ocho.

**Cifra de cierre esperada**: déficit 370 → X, residuo 0, foto registrada,
puntos de transformación restantes 5 → Y.

#### ✅ TAREA B HECHA — 2026-09-10, commit `498b2f0c`

**Déficit 370 → 354, residuo 0.** Puntos de `transformacion` a cero: 2 → 0.
Foto registrada (34 en el histórico).

- `r7-infinitivo-residual` → **PISO CERO**. Está CUBIERTO y es GRATIS por
  dos vías; es `r4-dativo-oi` otra vez. Queda escrita la única casilla que
  podría resucitarlo (el infinitivo impersonal de instrucciones, «A nu se
  atinge»), condicionada a cita de DOOM3/GALR, con el aviso de que el
  corpus del proyecto **no puede** atestiguarla y de que «a nu se» sale 378
  veces sin ser ni una sola vez esa fórmula.
- `r7-pasiva-impersonal` → **PISO 1**, publicado.

**Y lo que hay que leer antes de escribir el siguiente lote**, porque son
tres fallos míos de tres clases distintas:

1. **Un dato inventado que el propio fichero castigaba.** Escribí «las dos
   atestaciones son del XIX» sin tener ningún dato de fecha delante —los
   ficheros del corpus sólo llevan la muerte del autor— y eran de 1914. El
   lote contenía su propia cláusula de retirada y se disparó contra mí.
2. **Un umbral de RECHAZO usado como umbral de ACEPTACIÓN.** «El listón es
   `văzându-o`, rechazado a 13 %, y esto es 0,1 %» no vale: son dos
   preguntas. Y la prueba de que no era un criterio es que no lo aplicaba a
   la celda vecina (1,44 %).
3. **Dos números copiados de un informe sin recontarlos** («mi se» 763, no
   664; «ți se» 194, no 408) y una atribución falsa: «Alecsandri» salía en
   la ventana de contexto como **nombre de calle**.

Y un fallo del andamiaje que vale para cualquier lote: **un testigo de gate
puede pasar en vacío**. Uno de los míos cambiaba dos cosas a la vez, así
que al desactivar el gate que decía probar seguía en verde, salvado por
otra comprobación del mismo gate. Un defecto por testigo, y comprobar
desactivando cada comprobación por separado.

### Tarea C — Latín: publicar lo que ya está escrito

Hay **36 lotes escritos** en `lib/data/languages/la/lotes/` y **cero
ejercicios en `blocks/`**. Antes de escribir un ítem más de latín, hay que
saber por qué no se publicaron: leer `2026-09-03-la-relevo.md` §7 y el
último commit de latín (`git log -1 4d8b0bc3`). Preguntar al coordinador
si hay un publicador de latín o si hay que portar `publicar-cloze-ro.ts`
(patrón: validar TODO antes de escribir NADA; id = hash del contenido; sello
que dice qué certifica).

Después, en el orden del relevo §7: lotes restantes de L1 → **el audio ya
NO está bloqueado** (ver abajo) → lectura de L1 con la Vulgata.

**La voz se resolvió el 2026-09-10** (`2026-09-03-la-relevo.md` §5.ante):
Edu escuchó la batería de esdrújulas y aprobó **cinco** voces italianas,
declaradas en `lib/data/languages/la/voces.ts` con papeles —MarcoTrox
narrador, Tiziana y Samanta alternancia, Sara y Rita diálogo— y sello
`oído de Edu`. `EL_VOICES.la` apunta a la principal, con test que impide
la desincronización. **Cinco voces son cinco papeles, no cinco corpus:
cada texto se sintetiza UNA vez.** Rita, que la nota del parón daba por
la voz del latín, resultó ser **napolitana**: aprobada igual, pero es la
única no estándar y va anotada.

#### ✅ TAREA C HECHA (en parte) — 2026-09-11, commit `429cccb3`

**280 ejercicios publicados** (256 fill_blank, 12 transformation, 12
flashcard) en 6 bloques y 12 lecciones, todas con ejercicios. El latín
pasa de 0 a servir contenido.

**EL BLOQUEO NO ERA EL QUE DECÍA ESTA TAREA.** No hacía falta portar
`publicar-cloze-ro.ts`: hacía falta que existiera un currículo. `BLOCKS`
estaba a `[]`, así que los 454 ítems escritos no tenían dónde ir. Y §7
del relevo del latín decía «2 lotes hechos» cuando había **35**. Medir
antes de ejecutar.

Lo que hay ahora:
- `lib/data/languages/la/curriculum.ts` — conceptos y bloques DERIVADOS
  de `inventario-puntos.ts` (no copiados: derivados, así que no se
  desincronizan). Lo escrito a mano es el tallado en lecciones.
- `scripts/generate-mdx-la.ts` — las notas de lección se GENERAN desde
  las descripciones del inventario, con test de drift.
- `scripts/publicar-la.ts` — 8 formas de ítem, no una; valida contra
  `ExerciseSchema` antes de escribir nada.
- `tests/unit/curriculum-la.test.ts` — 12 tests, gates vistos en rojo.

**LO QUE FALTA, con su motivo escrito en el código** (`APLAZADOS_CON_MOTIVO`
en el publicador y `SIN_TALLAR` en el currículo): 174 ítems en 14 lotes.
En orden de rentabilidad:

1. **Forma D, 8 lotes, 98 ítems** — el bloque 3 casi entero. Necesitan
   `alternativas` por ítem: la clave lleva artículo español y el latín no
   tiene artículo, «a la madre» suspende «a su madre», y 9 de 12 de
   `l5-pro-drop` admiten otra respuesta buena («erat» no marca género).
   Hay que escribirlas bajo el gate del lote; no se derivan.
2. **`l2-cuarta` (12)** — necesita que `FillBlankCard` llame a
   `comparaLa(valor, clave, { sensibleACantidad })`. `comparaLa` existe
   desde hace meses y NO tiene ni un consumidor.
3. **`l2-sin-articulo` (12)** — el latinista dio la salida y no exige
   producto: mover el hueco para que se trague el sustantivo («el señor
   es ___» → clave «maestro»), y la respuesta vacía desaparece.
4. **`l5-interrogativas` (12)** — cabe en `multiple_choice`, pero hay que
   ESCRIBIR 12 `explanationEs`.
5. **`l2-genero-3a` (14), `l10-que-enclitico` (12),
   `l5-conjugacion-por-infinitivo` (14)** — sin superficie evidente.

**Y UN HUECO QUE NO ES UN APLAZAMIENTO: falta `l2-primera`.** La primera
declinación está en el inventario, es peldaño L1, **no tiene lote**, y es
prerrequisito de `l3-funcion-por-desinencia` —el punto central del
curso—, que se publica igual con 20 ítems llenos de «puella» y
«rēgīnās». El bloque «Sustantivo» enseña la 2.ª, la 3.ª y la 5.ª y da por
sabida la 1.ª. Es el primer lote que hay que escribir.

**Pendiente de arreglar en material ya escrito**: `l3-ablativo`
`la-3ab-11` y `la-3ab-12` publican español agramatical («de el templo»);
`l2-neutro-regla.ts:43` tiene la plantilla `ART` desincronizada de la de
`l3-funcion-por-desinencia` y produce «La guerra llama la reina»; y
`scripts/check-ortografia-la.ts` se anuncia en `ortografia-la.ts` y no
existe, así que `custodit` y `custōdit` conviven en el corpus.

### Tarea D — Sólo si el coordinador lo ordena

- **Checo o ruso**: arrancar por el Paso 0 (`npx tsx scripts/paso0-idioma.ts --lang=cs|ru`)
  e inventario de puntos, calcando `docs/plans/2026-09-01-ro-paso0.md`
  §0–§8 y el inventario rumano (`lib/data/languages/ro/inventario-puntos.ts`)
  como molde. **El checo tiene A2 con 2 piezas de lectura: la escalera baja
  la ponen los ejercicios.** El ruso choca con `scripts/lib/latin-guard.ts`
  (bloquea cirílico): hay que hacerlo por lengua antes de generar nada.
- **Griego**: currículo e inventario sin empezar; diseño en `la-grc-paso0.md`.

### Tarea E — Infraestructura pequeña (cuando haya hueco, no antes)

De la nota del parón, siguen pendientes:
1. Que una corrección del inventario FALLE si su prosa (`objectives`) no
   se actualiza — hoy no propaga nada.
2. Arreglar el censo: el bloque 1 de PT vive en `curriculum.ts` y no en
   `lessons/*.json`, así que las herramientas sobre `lessons/*.json` nunca
   miran el primer bloque (11 objetivos fuera de recuento).
3. Rearmar los dos monitores horarios que se pararon en el parón.
4. `tests/e2e/all-links.spec.ts`: al publicar contenido con páginas
   nuevas (RO/LA), añadir una ruta de partida que entre en esa lección
   (el rastreo no ve el enlace si no visita la página donde vive).

---

## 3 · Lo que ESPERA DE EDU (no lo decide la sesión)

_(La voz del latín ya no está aquí: resuelta el 2026-09-10.)_

- El **OK** explícito a la Tarea A antes de lengua nueva (el coordinador lo transmite).
- El **orden** entre terminar rumano, publicar latín, arrancar checo/ruso, abrir griego.

---

## 4 · Reglas de ejecución que no se negocian (cada una costó una sesión)

1. **Cifras medidas y pegadas**, con línea base y momento. Nunca «unos», nunca de memoria.
2. **Un gate nuevo se ve EN ROJO** con un caso que debe cazar, y la salida
   roja se PEGA en el commit (no se describe: hubo cuatro «visto en rojo»
   falsos en la fase F).
3. **Nada se publica sin ataque adversarial previo con fuente** (agentes en
   `.claude/agents/`: `linguista-adversarial-{pt,ro,cs,ru}`). Para el
   formato de corrección, el lingüista **es** el gate: «corregir algo que no
   está mal» salió en tres lotes seguidos y sólo él lo paró.
4. **Toda respuesta buena con más de una realización estándar nace con sus
   `alternatives`** (clítico pleno/contracto, `e`/`este`, orden). Sin eso la
   tarjeta suspende a quien acierta y el fallo falso entra al FSRS.
5. **Un sello responde a UNA pregunta**: Hunspell es gate léxico (no ve
   agramaticalidad construccional); el ASR valida contrastes, no aprueba una
   voz; el lingüista-agente no oye. Escribir en cada sello qué NO certifica.
6. **El hook pre-commit corre `tsc` y `vitest --changed`**; la suite entera
   antes de cada push. `--no-verify` esconde, no arregla.
7. **Lotes de 24; residuo 0 en la foto del déficit; sello escrito al publicar; cada sesión publica.**
8. **Coordinación**: la sesión `idiomas` coordina por mensajes entre
   sesiones; reportar al cerrar cada tarea con la salida pegada. `main` sólo
   lo avanza el coordinador por fast-forward en hitos.
9. **Disco**: interno ~3 GB libres, externo `/Volumes/Edu` ~0,5 GB. Nada
   pesado en el externo; `.next` no se borra con el servidor de Edu vivo.

---

## 5 · Cómo empezar la sesión (literal)

```bash
cd /Users/lalo/idiomas/portugues-app
git pull --ff-only origin variante/pt-pt-como-base
git status --short            # tiene que salir limpio (borra .tmp-ro/ y scripts/tmp-lin/ si estorban)
npx tsc --noEmit && npx vitest run   # 2455/2455 hoy; si no, no es tuyo: dilo
npx tsx scripts/deficit-ro.ts        # 370, residuo 0
```

Primer mensaje al coordinador: «Sesión nueva sobre el traspaso del 10-sep.
Árbol limpio en <hash>, suite <n>/<n>. ¿Está dado el OK de Edu a la Tarea A
(7 falsas de PT) antes de lengua nueva? Si no, arranco la Tarea B.»
