# El triaje de variante: qué son de verdad los 2.682 «unchecked»

*E2#22. Todas las cifras salen de `npx tsx scripts/gate-e5.ts` y de una
lectura del campo `variantVerificacion` ítem a ítem.*

La línea de cierre dice «cero `unchecked` sin triaje» y hoy marca 2.682,
que leído en crudo parece 2.682 ejercicios sin revisar. **No lo son.** El
campo `variantStatus` y el campo `variantVerificacion` cuentan cosas
distintas, y 1.803 de los 2.682 llevan escrito quién los revisó y cuándo.

## La foto

| familia | ejercicios | qué se le hizo | marcados hoy por `check-variant` |
|---|---:|---|---:|
| **A · dictamen humano** | 1.152 | cola de revisión manual ítem a ítem, o dos revisores adversariales | 6 · **0,5 %** |
| **B · máquina + muestreo** | 612 | gates de la familia + muestreo con freno; sin lectura humana ítem a ítem | 1 · **0,2 %** |
| **C · escucha** | 8 | pares mínimos publicados, esperando el oído de Edu | 0 |
| **D · otro** | 31 | correcciones sueltas con su sello | 1 · 3,2 % |
| **E · SIN sello** | 879 | nada | 6 · **0,7 %** |
| *(fuera de `unchecked`)* `needs-human` | 271 | la cuarentena del triaje | 56 · **20,7 %** |
| *(fuera)* `divergent` | 110 | divergencia declarada | 1 · 0,9 % |

**El triaje funcionó**: 56 de los 71 ejercicios que el gate marca hoy están
en `needs-human`, que es donde los puso. Concentrar el 79 % de los defectos
en el 9 % del corpus es exactamente lo que se le pedía.

## Lo que la tabla NO dice, y es la trampa

**El 0,7 % de la familia E no es prueba de que esté limpia.** Eso ya se
midió y salió que no: la calibración del 2026-07-29 tomó 120 ítems que la
regla de superficie declaraba sellables, los leyó un tercer lingüista
adversarial, y encontró **19 ERROR y 15 AVISO** contra un criterio
precomprometido de 0 y ≤3. Por eso la consagración automática a `neutral`
está desactivada en `triage-variante.ts` desde entonces. Una regla de
superficie no valida lengua: se le escapan regencias, posesivo sin
artículo, español crudo y portugués roto en las dos normas.

Así que «el gate no lo marca» vale como orden de cola y no vale como
sello. Esto aplica a E y aplicaría a B si el argumento para B fuera el
gate — no lo es.

## La hipótesis, contrastada

> *«Lo producido por una máquina con sus gates en verde no necesita el
> mismo dictamen que el corpus generado a ojo en junio.»*

El argumento para B no es que el gate calle: es que el texto se **escribió
deliberadamente en norma europea** por un proceso cuyas muestras leyó un
revisor adversarial con freno. Eso es una afirmación distinta de la que
murió en calibración, y se mide igual.

**Muestra de 30 de la familia B**, determinista por hash del id, con el
criterio escrito ANTES de leer (0 errores de variante, ≤1 aviso; la
proporción del criterio de la Ola V sobre 120):

**Resultado: 0 errores, 0 avisos.** Y con marcadores europeos activos, no
sólo ausencia de brasileñismos: `chegámos` y `Atravessámos` (la 1.ª plural
del pretérito con acento europeo, que fue una clase entera de error en la
cola 4), `receção` y `respetivo` (grafía europea post-AO frente a
*recepção*/*respectivo*), `devolvo-to`, `fê-lo`, `far-se-á`, «não estava
mau» donde el brasileño diría *ruim*.

**Lo que esta muestra permite decir, y lo que no.** Cero de 30 acota la
tasa por debajo del **9,5 %** con 95 % de confianza — no la pone en cero.
La Ola V usó 120 justamente por eso: 120 acotan al 2,5 %. Declarar el sello
por construcción con n=30 sería repetir el error que la Ola V pagó, sólo
que con el signo cambiado.

## Propuesta

1. **A (1.152) — el sello es contabilidad, no una decisión nueva.** Un
   humano los dictaminó ítem a ítem y escribió el veredicto en el propio
   ítem; lo que falta es mover el campo de estado, que nadie movió. Se
   propone `variantStatus: 'checked'` citando el informe que ya está en el
   `variantVerificacion`. **Condición**: comprobar antes en los informes de
   cola que el dictamen cubría VARIANTE y no sólo contenido. Las colas
   cazaron `-ámos`, clíticos brasileños y «você», así que la respuesta
   probablemente es sí — pero se comprueba, no se supone.
2. **B (612) — calibración a 120, y entonces por construcción.** Mismo
   protocolo que la Ola V: criterio precomprometido por escrito, muestra
   determinista, lectura adversarial. Si pasa, el sello se otorga por
   construcción **y las máquinas lo escriben al publicar**, que es lo que
   evita que esto vuelva a acumularse.
3. **E (879) — es el trabajo real, y no hay atajo.** Nueve colas de ~100
   con el mismo rendimiento medido de las ocho anteriores (46/45/50/49/40/
   53/48/40 % de error). El gate ordena la cola; no la sustituye.
4. **`needs-human` (271) y `divergent` (110)** son el pozo de defectos y ya
   están declarados como tales: 56 de los 71 hallazgos vivos viven ahí.

**El cierre honesto de la línea de la checklist** no es «cero unchecked»:
es *cero ítems sin dictamen, con el dictamen otorgado por el procedimiento
que corresponda a cómo nació cada ítem*. Hoy eso son 879 + la calibración
de 120, no 2.682.

---

## Addendum E2#22 · El triaje por punto, y lo que destapó

El par decidió no pagar nueve colas por 879 ítems: **triarlos por punto y
pagar sólo lo que la cobertura exija**. La decisión es correcta y el
principio también —*no se paga por validar material que el curso no
necesita*—, pero su premisa («la cobertura ya la sostienen los 2.186
dictaminados o de máquina») **es falsa, y por bastante**.

### Lo primero, porque invalida el resto: la cuarentena contaba

`variantStatus: 'needs-human'` está filtrado en el embudo de
`lib/data/loaders.ts` — el alumno no lo ve. **Pero ningún contador de
cobertura lo descontaba.** 271 ítems que nadie ve sumaban al piso de sus
puntos, y **27 puntos caen por debajo del piso al descontarlos**.

Si se hubieran mandado 595 ítems más a cuarentena sin arreglar esto, el
titular habría seguido diciendo 24 mientras el curso perdía 595
ejercicios. Es la mentira silenciosa de siempre: la etiqueta existe,
alguien la lee para una cosa y nadie para la otra — la misma familia del
piso cero que no se aplicaba, cazada el mismo día.

Arreglado en `contarPuntos`, que ahora filtra por defecto y admite
`{ incluirCuarentena: true }` para las auditorías. **Déficit de contenido
SERVIBLE: 80, no 24.** Residuo 0; la reconciliación lo explica como los 56
ítems descontados.

### El triaje, con el coste bien medido

| rama | ítems | qué se hace |
|---|---:|---|
| **excedente** — su punto llega al piso sin ellos | **595** | cuarentena, con el motivo escrito |
| **necesarios** — cubren déficit real | **284** | dictamen a mano, método de las colas |
| *(no cubrible por ningún ítem viejo)* | **93 unidades** en 38 puntos | producir con las máquinas |

**Cuidado con el número intermedio.** La primera cuenta daba 498
«necesarios», y estaba mal: contaba TODOS los ítems sin sello de un punto
deficitario, cuando un punto a 4/8 no necesita sus 22 disponibles, necesita
**cuatro**. Sobreestimar lo que hay que pagar es tan malo como
subestimarlo, porque lleva a tirar por la borda lo que sí valía. Con
selección greedy sobre el déficit real: 284 ítems cubren 293 unidades.

Así que la apuesta del par acierta —**el excedente se lleva el 68 %**— y
las nueve colas se quedan en **unas tres**, no en una ni en nueve.

### Lo que queda por decidir, y por qué no se ha aplicado

Mandar 595 ítems a cuarentena es reversible y está declarado, pero cambia
lo que el alumno ve. Se aplica cuando el par o Edu confirmen, ahora que la
premisa está corregida: **el déficit de lo sellado y servible es 386
unidades en 119 puntos**, no cero. Es decir, sellar A y B no cierra la
cobertura por sí solo — hace falta además el dictamen de los 284 y la
producción de los 93.
