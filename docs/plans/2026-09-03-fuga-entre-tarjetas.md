# La fuga ENTRE tarjetas: medida, y por qué no se arregla con un gate

**Estado**: medido **y arreglado por ordenación** (2026-09-03). El medidor
y el reordenador comparten una única implementación en
`lib/srs/fuga-sesion.ts`.
Lo destapó el agente del lote 15 rumano con un caso concreto: `aceasta`
está impresa en una frase del lote 1 y es la clave de un demostrativo del
lote 15; FSRS puede juntarlos en la misma sesión.

## 1 · Qué es, y por qué ningún gate del proyecto lo ve

Todos los gates de fuga son **intra-ítem**: comprueban que la respuesta no
esté en la pista, ni en la propia frase, ni en las alternativas. Ninguno
mira el **corpus**. Un ítem impecable por separado puede ser trivial al
lado de otro, y la revisión por lotes lo hace invisible por construcción:
el lote 15 no puede ver lo que imprimió el lote 1.

Medida con `npx tsx scripts/fuga-entre-tarjetas.ts <lang>`:

```
  pt: 329 pares en fuga · corpus de 3.292 ítems   (24 % de las respuestas de hueco)
  ro:  74 pares en fuga · corpus de   336 ítems   (25 %)
```

(Las dos unidades miden lo mismo: el porcentaje es sobre respuestas de
hueco, los pares cuentan cada ítem-que-imprime con cada ítem-examinado.)

**Dos corpus escritos por separado, con meses de diferencia, dan la misma
tasa.** Eso descarta el accidente y apunta a una propiedad de cómo se
escriben los ítems: el vocabulario natural de un nivel es pequeño, así que
las mismas formas reaparecen. Y ojo con la fecha: **el portugués estaba
declarado TERMINADO** cuando se midió esto.

## 2 · El criterio, que es lo que lo separa de un gate ruidoso

Contar «la respuesta aparece en otro ítem» a secas marca el 43 % del
corpus y **no sirve**: un gate que marca casi la mitad nadie lo lee. Sólo
cuenta si se dan las dos cosas:

- **Otro punto.** Dentro del mismo punto la forma se repite por diseño:
  ocho ítems del artículo enclítico van a compartir formas, y eso es el
  ejercicio, no una fuga.
- **Forma rara** (≤3 apariciones en todo el corpus). **El poder de pista es
  inverso a la frecuencia**: `o` impresa en cincuenta frases no señala
  nada, porque el alumno no puede saber cuál de las cincuenta es la pista.
  `cafeluță` en dos, sí.

## 3 · Lo que NO está establecido, y hay que decirlo

**No está demostrado que estos 49 y 193 hagan daño.** Que `trenul` esté
impreso en la frase de otro punto no impide que el alumno tenga que aplicar
la regla para producirlo; puede incluso ser exposición útil. El daño claro
es el caso `aceasta`: cuando la forma filtrada **es justo el elemento que
el ítem discrimina**, la tarjeta deja de medir su punto.

Distinguir un caso del otro **no es mecánico**: es la misma clase de juicio
que «un ítem que no mide su punto», y sólo la resuelve un lingüista o un
pedagogo mirando el par. Por eso esto **no debe convertirse en un gate de
publicación**: marcaría 49 casos, la mayoría inofensivos, y a la tercera
semana nadie lo leería.

## 4 · El arreglo, ya implementado: ordenar la sesión, no filtrar el contenido

El daño **necesita co-ocurrencia**: la pista sólo sirve si ves la frase
que la contiene ANTES de que te pregunten. Quita la co-ocurrencia y la
fuga queda inerte, sin tocar un solo ítem y sin juzgar cuál hace daño.

Va en `lib/srs/interleave.ts`, no en `buildDueQueue`: el intercalador es
quien decide el orden final de la sesión, y la cola sólo elige el conjunto.

- **Ordenar, no excluir.** Si la tarjeta B tiene su respuesta impresa en la
  tarjeta A, **B va antes que A** dentro de la sesión. Nadie se queda sin
  repasar, ningún calendario FSRS se desplaza, y no hay inanición — que es
  lo que sí pasaría aplazando una de las dos.
- Entrada: el mapa se calcula **sobre las tarjetas de la sesión**, no sobre
  el corpus. Es O(n²) y la sesión está topada, mientras que el corpus pasa
  de 3.000 ítems; y no hace falta más, porque el daño necesita que las dos
  caigan juntas. Así no hay fichero precomputado que pueda quedarse viejo.
- **Ciclos** (A filtra a B y B filtra a A): romper por orden de vencimiento
  y **contarlos en la salida**, no en silencio.
- Perturbación mínima: el orden actual es «lo más vencido primero» y debe
  conservarse salvo donde el conflicto obligue.
- Prueba **en rojo antes que en verde**: una sesión con un par en conflicto
  colocado al revés a propósito, y el reordenador tiene que arreglarlo.

Coste estimado: pequeño. Beneficio: cierra la clase entera en las cuatro
lenguas, incluidas las que aún no tienen corpus.

## 5 · Lo que queda decidido y lo que no

- **Decidido**: no se hace gate de publicación (sería ruidoso y se apagaría).
- **Decidido**: el medidor vive en el repo y es reproducible por lengua, y
  **comparte implementación con el reordenador** — el script no tiene copia
  propia de la regla, porque una regla duplicada se desincroniza.
- **Hecho**: el reordenador, con su par rojo/verde y el conteo de ciclos.
- **Sin decidir, es de Edu**: si se quiere además una pasada de lingüista
  sobre los casos del tipo `aceasta`, que son los únicos con daño
  demostrado. La ordenación los desactiva dentro de una sesión, pero un
  ítem que no discrimina su punto sigue sin discriminarlo.
