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

## Estado medido el 2026-09-11

| lengua | lectura | ejercicios | cobertura |
|---|---|---|---|
| PT | 3,2M ✅ | 3.292 | 0 bajo piso · **prosa corregida el 11-sep** |
| RO | 2,9M ✅ | 454 servibles | 48 de 107 puntos bajo piso · déficit **354**, residuo 0 |
| LA | 3 lecturas | 357 publicados | 34 de 117 puntos con lote |
| RU | **7,7M ✅** (de 1,96M) | 0 | inventario sin empezar |
| CS | 793 lecturas | 0 | sin inventario |

Suite: **2.519/2.519 verde**, 243 ficheros. Árbol limpio.

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
léxico y contenido. La voz está **medida y casi resuelta**: el motor
italianiza el acento, pero lee la tilde y la aplica al sitio correcto —
se queda a tres centésimas de volcar el pico.

**RUMANO — no está parado por un problema, está aparcado por decisión.**
Quedan 5 puntos de `transformacion` y los niveles B2/C1/C2 enteros a cero.
Relevo: `docs/plans/2026-09-03-ro-relevo.md`, más de cuarenta trampas cada
una con el método que la cazó. Es el documento que más ha ahorrado.

**CHECO — no arranca sin Paso 0.** `npx tsx scripts/paso0-idioma.ts
--lang=cs` primero, y luego el orden que funcionó dos veces:
inventario → ortografía → paradigma → voz → lotes.

## El perfil del alumno, que no es «un hispanohablante»

Es un hispanohablante **de México** —sin `vosotros`— **con portugués C2**.
Toda afirmación de «esto es gratis / esto no transfiere» se comprueba
contra **las dos** lenguas. En rumano se descubrió tarde que media
transferencia la pagaba el portugués y no la contaba nadie, y dos puntos
declarados de colocación resultaron ser de ortografía.

Y cada lengua terminada entra en esa lista para la siguiente.

