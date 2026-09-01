# Los 60 cloze sin pista restantes — criterio PRECOMPROMETIDO

*Escrito y commiteado ANTES de leer un solo ítem.*

Cerrados los 99 de léxico abierto, quedan **80 sin dictaminar**: 45
«verbales sin persona ni tiempo», 21 de «clase cerrada» y 13 «verbales
determinados» (más 1 residual). El triaje ya avisó de que **aprueba de
más** —9 de 15 en su clase más segura—, así que la pregunta no es si están
bien, sino si están **lo bastante bien** como para sellarlos declarando la
tasa en vez de leerlos uno a uno.

## La muestra

**20 ítems**, elegidos por hash SHA-256 del `id` sobre **la población
entera de los 80**, no sobre la cabeza de la cola. Es la corrección de un
sesgo que ya nos engañó dos veces: el 62 % de b10 y la proyección de las
alternativas salieron altos y bajos por leer tramos ordenados, no
muestras. Una cola ordenada por déficit no es una muestra aleatoria.

## El criterio, y no se toca después

Se cuenta como **DEFECTUOSO** un ítem que esté roto (frase agramatical,
respuesta que no encaja, forma inexistente, marca brasileña servida como
europea) **o** indeterminado (el enunciado admite varias respuestas
razonables y ninguna pista lo cierra).

- **≤ 15 % defectuosos** → se sellan los 60 restantes declarando la tasa
  medida en el propio `variantVerificacion`, y se pasa a producción.
- **≥ 30 %** → se leen los 60 uno a uno, como los 99.
- **Entre 15 % y 30 %** → **se leen**. En la frontera gana la lectura,
  porque el coste de sellar material roto lo paga Edu con fallos falsos y
  el de leer de más lo pago yo con una tanda.

## Lo que este criterio NO decide

No decide que los sellados sean buenos: decide que **la tasa medida es
baja como para no leerlos**, con la tasa escrita en cada ítem para que
quien la lea dentro de seis meses sepa sobre qué evidencia se selló. Es la
misma figura que el sello por construcción de la familia B.

---

# RESULTADO: **6 de 20 = 30 %. Se leen todos.**

El criterio decía ≥30 % → leer los 60. Cae exactamente en el umbral, y
además la frontera ya estaba adjudicada a la lectura.

## Los dos ROTOS

- **`a75af754`** — «Vocês ___ a escolha correta. (aperceber)» → «apercebem».
  «Aperceber-se» rige **de** y es pronominal: «apercebem-se da escolha».
  La frase, tal cual, no es portuguesa. Y el ítem declara enseñar el
  pronombre reflexivo mientras su respuesta no lleva ninguno.
- **`4db88ca6`** — «Eu ___ muito à minha avó. (querer)» → «quero».
  **Castellanismo**: «querer a alguien» con el sentido de amar es español.
  El portugués dice «gosto muito da minha avó» o «quero muito bem à minha
  avó». Es de la familia de «logrado o sucesso» y «manifestar a V. Sa.».

## Los cuatro INDETERMINADOS

Los cuatro comparten causa, y es la que la regla nueva del generador ya
cierra hacia delante: **el lema está en el molde y el tiempo no lo fija
nada.**

- `3bca1e9a` «A casa ___ (ser) encantadora» → «era», pero «é» encaja igual.
- `b27f1f44` «Nós ___ (ser) muito amigos desde a infância» → «éramos», y
  «somos» encaja igual —«desde a infância» funciona con presente—.
- `e73505bb` «Ela ___ (admirar) … todas as tardes» → «admirava», y
  «admira» encaja igual.
- `bcf50c91` «___ logo o que aconteceu! (dizer)» → «Diga-me», donde ni la
  persona está fija —«Diz-me» es el tú— ni el clítico está anunciado.

**Lo que esto dice del triaje**: los tres primeros están en la clase
«verbal determinado», la que el clasificador daba por segura. Ya sabíamos
que aprobaba de más; ahora está medido dos veces.
