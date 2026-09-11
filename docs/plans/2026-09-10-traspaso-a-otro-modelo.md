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

### Tarea B — Los 5 puntos de `transformacion` que le quedan al rumano

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
