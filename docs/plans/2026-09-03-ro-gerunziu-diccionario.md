# El gerunziu contra el diccionario: la predicción, escrita antes de correrlo

*2026-09-03. Este fichero se commitea ANTES de ejecutar la medición. Los
resultados van en un commit posterior, debajo, sin tocar nada de arriba.*

## Por qué

La regla del gerunziu ha necesitado **tres correcciones en dos días**, una
por cada verbo nuevo que entraba en el lexicón:

1. le faltaba la rama del **tema** (`a scrie`, de 3.ª, hace `scriind`);
2. al corregirla se tiró la rama de la **conjugación**, y volvieron
   `*vorbând`, `*dormând`, `*venând`, `*iubând`, `*plătând`, `*locuând`;
3. le faltaba la rama del **contexto de la i** (`a tăia` → `tăind`, no
   `*tăiind`).

Las tres salieron de aplicar la regla al lexicón entero. Pero el lexicón
son **43 verbos**, así que sólo puede revelar las ramas que esos 43 tocan:
cada lema nuevo es otra oportunidad de descubrir la mitad que falta, y eso
no converge solo. `tools/hunspell/ro_RO.dic` tiene **181.357 entradas**, y
entre ellas los gerundios atestiguados — un conjunto de otro orden.

## La dirección en la que se puede medir

Del gerundio SOLO no se recuperan el infinitivo ni la conjugación, así que
no se puede aplicar la regla «hacia adelante» sobre el diccionario. Lo que
sí se puede comprobar son **afirmaciones de forma**, que es donde vive cada
rama de la regla, y la **cobertura** de lo que la regla produce.

## Las predicciones

**C1 · Ninguna forma acaba en `-iând`.** Es el contraejemplo directo de la
rama «tema acabado en `i` ⇒ `-ind`». *Predicción: 0.*
**Contaminada**: el coordinador ya midió esta y me dio el resultado. No
cuenta como predicción mía; queda para que el script la re-mida.

**C2 · Ninguna forma acaba en `-Viind` con V vocal** (`ăiind`, `oiind`,
`aiind`…). Es el contraejemplo de la **tercera rama**, la que dice que tras
vocal la `i` cae: `tăi` → `tăind`, `îndoi` → `îndoind`. *Predicción: 0.*
**Ésta es la genuinamente abierta**: la rama se escribió DESPUÉS de que el
coordinador midiera, y él no informó de ella. Si sale distinto de 0, mi
tercera rama es falsa o incompleta, y lo será con testigos de sobra.

**C3 · Habrá muchos temas con LAS DOS desinencias.** *Predicción: del orden
de 150.* Contaminada también (el coordinador dice 158), pero se re-mide
porque es la prueba en números de que **la rama de conjugación no era
prescindible**: es exactamente la que llegué a tirar «corrigiendo» la regla.

**C4 · Cobertura.** De los 43 gerundios que la regla y el lexicón producen
hoy, ¿cuántos están en el `.dic` como entrada? *Predicción: ≥ 38 de 43.* No
espero 43 porque el `.dic` puede generar algunas formas por afijo en vez de
listarlas. **Cualquier ausencia se LEE una a una**: si una forma que la
regla produce no está atestiguada, es candidata a cuarta rama, no a ruido.

**C5 · ¿Hay una cuarta rama?** *Predicción: no aparecerá ninguna que se vea
desde la forma sola.* Lo que espero es que las terminaciones se repartan en
un conjunto pequeño y cerrado, sin residuos estructurales. Si me equivoco,
mejor: habrá salido de golpe y con miles de testigos en vez de de uno en
uno.

## Lo que NO demuestra esta medición

Que la regla asigne la desinencia correcta **a cada lema**: para eso haría
falta el infinitivo, que el diccionario no da junto al gerundio. Demuestra
que ninguna rama tiene contraejemplo de forma y que lo que la regla produce
existe. Es un sello, y responde a UNA pregunta.
