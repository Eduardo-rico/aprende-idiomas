# El orden de cierre — decidido por Edu el 2026-09-11

> «latín sigue corriendo en paralelo, después ruso, después rumano, después
> checo» — Edu, textual.

Este documento existe porque el orden es una decisión y no una deducción:
si alguien lo reconstruye mirando las cifras, **le sale otro**. El rumano
está a 354 unidades de su piso y el ruso estaba a cero, así que «terminar
lo empezado» habría dicho rumano primero. Edu decidió lo contrario. No se
re-litiga.

## El orden

    1. LATÍN      en paralelo, sin fecha de corte
    2. RUSO       arrancado el 2026-09-11
    3. RUMANO     aparcado en déficit 354, residuo 0
    4. CHECO      sin empezar

## Qué significa «terminado», para las cuatro

El criterio es **COBERTURA, no total**: **≥8 ítems por punto declarado, 6
en C2**, más cero puntos sin lote que no tengan **piso cero declarado con
motivo escrito**. Decisión de Edu del 2026-09-01.

⚠ **La cifra de «23.100 ejercicios» que imprime `paso0-idioma.ts --lang=ru`
—y sus equivalentes en las otras lenguas— está DEROGADA.** Sale de una
extrapolación por horas. Medir contra una meta derogada es la peor clase
de gate: el trabajo que pide de más parece pendiente y el que ya está
hecho no se acredita. Si te encuentras persiguiendo el número grande,
párate.

## Estado medido el 2026-09-12

| lengua | lectura | ejercicios | cobertura |
|---|---|---|---|
| PT | 3,2M ✅ | 3.292 | 0 bajo piso · prosa corregida el 11-sep (7 falsas + las 6 que metió la corrección) |
| RO | 2,9M ✅ | 454 servibles | 48 de 107 puntos bajo piso · déficit **354**, residuo 0 |
| LA | 3 lecturas | ~400 publicados | **40 de 117** puntos con lote (eran 34 el 11-sep) |
| RU | **7,7M ✅** (de 1,96M) | **12** | **1 de 93 puntos cubierto** · déficit **596** (de 604), residuo 0 · 948 formas, 934 atestadas, 0 rojos |
| CS | 793 lecturas | 0 | sin inventario |

⚠ **RUSO al 2026-09-12 (noche): la tubería entera existe y el primer lote está
PUBLICADO.** 12 ítems de `u4-declinacion-singular` en `ru/blocks/b4.json`, la
primera lección del ruso (`lessons/b4.json`), el publicador
(`publicar-cloze-ru.ts`) y **el contador del déficit, que no existía**
(`scripts/deficit-ru.ts`: 604 → 596, residuo 0).

Y lo que el contador destapó antes de escribir un ítem, que es lo que hay que
saber al retomar CUALQUIERA de las cuatro lenguas: **88 de los 93 puntos rusos
no pueden recibir un ejercicio porque su bloque no tiene lección**, y el
publicador rechaza el lote entero. Las lecciones van ANTES que los lotes.
Cuesta un JSON de siete campos por bloque y ningún MDX (§23.1 del relevo ruso).
Dos bombas más del esqueleto, las dos arregladas: `LessonSchema.blockId` topaba
en 12 y el ruso tiene 15 bloques —21 puntos inalcanzables, el mismo accidente
que el C2 del portugués con el 11— y **nada validaba una lección escrita a
mano**, con cinco incumplimientos vivos en PT y RO.

Suite al 2026-09-12 (noche): **268 ficheros / 2.942 tests, 0 rojos** — los del
latín incluidos. Cuatro de los rojos anteriores eran TIMEOUT de 5 s contra un
corpus de 91 MB y no contenido: verdes corridos solos, rojos dentro de la suite.

Suite al 2026-09-12 (tarde): **259 ficheros / 2.818 tests**, y los rojos son
**todos de la sesión de LATÍN, que está a medio camino**: a las 20:07 era 1
(`acento-la-dos-caminos`) y a las 20:11 eran **6 en 5 ficheros**
(`acento-la-dos-caminos`, `todas-las-formas-la`, `gate-infinitivo`,
`gate-irregulares` ×2, `formas-no-producidas-la`). El hook los atribuye solo:
los ficheros que los causan (`personales-la.ts`, `irregulares.ts`,
`lexicon-l1.ts`, `atestacion-*.json`) están en el árbol y no en ningún commit
de ruso. **Los 4 ficheros de ruso están verdes** (141 tests).

⚠ **RUSO — la morfología ya no bloquea los lotes.** Al 12-sep por la tarde
están construidos el adjetivo (dos filas para las cuatro declinaciones
escolares) y el pronombre (personales con н- protética, posesivos,
demostrativos, interrogativos). Lo que queda es CONTENIDO. Y tres cosas que
decidirían cualquier lote y están medidas: en el adjetivo **sólo el
nominativo distingue los tres géneros** —cuatro de los seis casos son
sincréticos m=n, y el inventario nombraba dos—; **el instrumental femenino
tiene dos formas vivas** en la biblioteca (`-ой`/`-ою`, 22 % la segunda, y en
el pronombre hasta el 45 %), así que exigir una sola suspende a quien escribe
ruso atestado; y `у его` es un homógrafo del posesivo mientras que `к ему` es
lengua real de registro popular — dos rivales de la misma regla con
veredictos opuestos.

## Lo que se resolvió el 11 y el 12 de septiembre

**La línea de la voz del latín está CERRADA en `needs-human`.** Cinco voces,
dos lenguas, ocho marcas ortográficas y el canal IPA de `eleven_v3`: el
acento latino **no es forzable por medios ortográficos**. Y el cierre trae
dos hallazgos que valen fuera del latín:

- **la energía de la señal NO mide acento** — lo dice un control positivo,
  no una sospecha: en `capitano` el pico cae en `no`, que no se acentúa ni
  como sustantivo ni como verbo;
- **`eleven_v3` reparte la alineación DENTRO de la palabra** (racha de 7,7
  caracteres idénticos contra 1,9 en v2) **y la mide bien ENTRE palabras**.
  Sirve para karaoke por palabra; **no sirve por debajo de la palabra**.
  Su variabilidad en frase sí pasa (1,2-1,6× la de v2); en palabra suelta
  no (4,2×), y eso era un artefacto de medir palabras aisladas.

**Lo único que queda de la voz es el oído de Edu** sobre
`https://claude.ai/code/artifact/7dc2ff45-2cbe-4640-845f-62a6d8463d38`
(`capitano` contra `càpitano`). Su veredicto sobre la primera página fue
**«sonaban distintas entre sí»** — y explícitamente NO «la marcada sonaba
bien». O sea: **la marca cambia el audio de forma audible; no está
verificado que ponga el acento donde toca.** No estirar eso.

**Dos gates propios estaban apagados y se arreglaron:**

- el test de la **línea roja** fallaba en cualquier worktree, que es
  justo la maniobra que se usa para esquivar un rojo ajeno. Anclado al
  worktree principal.
- **`corpus-ru`** era el `testTimeout` por defecto (5 s) contra 91 MB de
  JSON. Declarado 120 s **con guarda**: un timeout largo puede esconder un
  cuelgue, así que se comprueba que el corpus se cargó de verdad.

## Lo que hay que saber al retomar cada una

**RUSO — es la primera no romance, y eso INVIERTE el riesgo.** Casi todas
las trampas del relevo rumano se cazaron buscando lo que era **gratis por
transferencia**. En ruso no transfiere casi nada, así que el error nuevo
es el contrario: **declarar dificultad donde no la hay**, y **no saber a
qué capa atribuir un fallo** (¿el caso, el aspecto, la declinación, o que
no leyó bien el cirílico?). Un ítem que mide «ruso» no mide nada.

Y la trampa de medición que va a morder seguro: **`\w` de JavaScript es
`[A-Za-z0-9_]` incluso con la bandera `u`, así que en cirílico cuenta CERO
sin dar error.** Ya mordió tres veces en rumano y latín.

**LATÍN — la máquina dejó de ser el cuello de botella** (pasiva,
participios, adjetivos de 3.ª e irregulares construidos). Lo que queda es
léxico y contenido. **La deuda con fecha es el GRADO del adjetivo**: 114
entradas y 537 tokens que la máquina no produce. Hoy no lo pide ningún
punto; en cuanto se escriba uno, **la máquina va antes que el lote**.

⚠ **El enumerador del dominio se había quedado atrás** y nadie lo notaba:
1.429 formas de 2.194, el 65 %. Toda cifra «sobre el dominio» anterior al
2026-09-12 está medida sobre dos tercios. Recalculadas las ocho: el lote
publicado está sano (su gate usa un umbral **absoluto**, no la cifra
medida), dos se corrigieron, y **dos no se movieron — que es lo que las
convierte en hallazgos y no en artefactos del denominador**.

**RUMANO — no está parado por un problema, está aparcado por decisión.**
Quedan 5 puntos de `transformacion` y los niveles B2/C1/C2 enteros a cero.
Relevo: `docs/plans/2026-09-03-ro-relevo.md`, más de cuarenta trampas cada
una con el método que la cazó. Es el documento que más ha ahorrado.

⚠ **RUSO — una clase nueva que vale para las CUATRO lenguas: la
biblioteca puede desenseñar el punto.** El corpus de inmersión es de
dominio público, o sea de hace un siglo, y puede contradecir la norma
moderna que el curso enseña (medido en `u10`: «два большие портрета» de
Dostoievski contra la regla de hoy). **La norma gana** —es citable— pero
entonces: ningún ítem de ese punto puede justificarse con el corpus, hay
que vigilar el error simétrico, y **la lección tiene que avisar** o la
inmersión deshace lo enseñado. Es la primera vez en el proyecto que el
corpus pierde contra el material.

**CHECO — no arranca sin Paso 0.** `npx tsx scripts/paso0-idioma.ts
--lang=cs` primero, y luego el orden que funcionó dos veces:
inventario → ortografía → paradigma → voz → lotes.


## ⚠ Los dos griegos NO tienen currículo — medido el 2026-09-17

    npx tsx scripts/paso0-idioma.ts --lang=el   → ✖ no hay sección «## Griego moderno»
    npx tsx scripts/paso0-idioma.ts --lang=grc  → ✖ no hay sección «## Griego antiguo»

`docs/plans/2026-07-28-curriculos-completos.md` tiene **cinco** secciones:
Portugués, Rumano, **Checo**, Ruso y Latín. **Ninguna de griego.**

**Esto reordena lo que se creía:**

- **El CHECO no está bloqueado por el currículo.** Lo tiene entero y con
  la misma forma que el rumano: A1→C2 con sus horas, volumen total, «lo
  que el modelo actual no puede expresar (19)» y «riesgos (13)». Lo que
  le falta es el **inventario de puntos**, que se deriva de ahí. O sea
  que el checo arranca con `paso0` verde y sin pedirle nada a Edu.
- **Los GRIEGOS sí lo están, y por lo mismo los dos.** Antes de escribir
  un inventario griego hay que escribir su currículo — y eso pasa por el
  panel adversarial, como pasaron los otros cinco. No es trabajo de una
  tarde.

⚠ Y el griego ANTIGUO lleva desde el 2026-09-03 en el registro **sin
currículo**: se añadió con un Paso 0 que nunca pudo correr. Es la misma
familia que «un filtro cierto que caduca» (§C2 de la doctrina), con otra
cara: **una lengua entró en `LANGUAGES` sin que nada comprobara que su
currículo existía**, y el fallo sólo se ve cuando alguien corre el Paso 0
a mano. Vale la pena un invariante que lo pregunte.

**Consecuencia para el orden**: cuando al checo le toque su turno, va
directo. El griego moderno —que es el que Edu quiere— necesita **antes**
su currículo, y ése es su verdadero primer paso, no el inventario.

## El perfil del alumno, que no es «un hispanohablante»

Es un hispanohablante **de México** —sin `vosotros`— **con portugués C2**.
Toda afirmación de «esto es gratis / esto no transfiere» se comprueba
contra **las dos** lenguas. En rumano se descubrió tarde que media
transferencia la pagaba el portugués y no la contaba nadie, y dos puntos
declarados de colocación resultaron ser de ortografía.

Y cada lengua terminada entra en esa lista para la siguiente.

