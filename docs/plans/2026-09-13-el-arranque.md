# Griego moderno (`el`) — arranque

> «griego es griego moderno» · «los dos, moderno primero» — Edu, 2026-09-13.

## Por qué existe este documento

Durante diez días el proyecto construyó **griego ANTIGUO** (`grc`) creyendo
que era lo que Edu había pedido. No lo era. Se descubrió cuando lo dijo con
todas las letras al ver la tabla de las seis lenguas.

**No se perdió trabajo** —`grc` estaba a cero absoluto: 29 líneas de
andamio— pero sí se perdió tiempo de decisión, y la causa merece quedar
escrita porque es barata de repetir: **«griego» a secas nombra dos lenguas
distintas**, y una sesión eligió una sin preguntar. `TITULO` las nombra
ahora con apellido las dos, y hay un test que lo fija.

`grc` **se queda aparcado a cero**, por decisión de Edu. Los dos, moderno
primero.

## Qué se hizo hoy

`el` entra en `LANGUAGES` con todo lo que eso arrastra: etiqueta
(`Ελληνικά`), bandera (🇬🇷 — que es suya, y por eso `grc` lleva 🏺), chrome
en lengua meta, prosa de lección, y **niveles MCER**, al revés que el
latín y el griego antiguo. Andamio vacío en `lib/data/languages/el/`.

**Y `LANGUAGE_BOOST.el` queda VACÍO a propósito**: el motor probablemente
lo soporta, pero declararlo de memoria sería escribir una cifra sin
leerla. Se verifica contra `/v1/models` antes de usarlo.

## Lo que hay que saber antes de escribir una línea

**1 · Es la segunda lengua con alfabeto propio, así que hereda del RUSO,
no del latín.** Todo lo de `docs/plans/2026-09-11-ru-relevo.md` sobre
cirílico se transfiere de forma: `\b` y `\w` **no son unicode-aware** y
sobre griego darán un cero limpio y plausible igual que sobre cirílico —
**mídelo antes de escribir el primer contador**, y pega el rojo.

**2 · MONOTÓNICO desde 1982.** El griego moderno escribe **una sola
tilde** y **ningún espíritu**: la ortografía normal SÍ marca el acento, al
revés que el mácrón latino (0 en 227.301 tokens) y que el acento ruso (0 en
7,7 M). **Esa asimetría hay que medirla, no suponerla**: si el corpus que
se consiga fuera de antes de 1982 traería politónico, y entonces la
distinción es de edición y no de lengua — exactamente lo que pasó con la ё
rusa, que resultó bimodal **por editorial**.

**3 · El alumno es hispanohablante de México con portugués C2**, y para el
griego eso trae una transferencia que no tiene ninguna otra lengua del
proyecto: **el léxico culto**. Miles de palabras españolas y portuguesas
son griegas. `gratis` va a ser más grande aquí que en ningún sitio, y
medirlo antes de escribir puede recortar el inventario como recortó doce
puntos en ruso.

**4 · Y el falso amigo del mismo origen**, que es la cara contraria:
`εμπάθεια` no es «empatía» sino lo opuesto, `συμπάθεια` no es «simpatía» a
secas. El préstamo culto regala vocabulario **y planta trampas**; las dos
cosas hay que medirlas, no suponerlas.

## El orden, que ya funcionó dos veces

Paso 0 (`npx tsx scripts/paso0-idioma.ts --lang=el`) → inventario de
puntos → ortografía → paradigma → voz → lotes. Y el auditor es
`auditor-el`.

⚠ **Lo que falta antes de nada: la BIBLIOTECA.** Las otras cuatro lenguas
vivas ya cumplen su meta de lectura —PT 3,3 M · RO 2,9 M · CS 1,9 M · RU
7,7 M— y el griego moderno está a **cero**. Ese pilar costó semanas en cada
una.
