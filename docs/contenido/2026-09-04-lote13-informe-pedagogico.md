# Lote 13 — informe PEDAGÓGICO y de DISEÑO

**Revisor:** lingüista adversarial PT (eje pedagogía + diseño; la gramática la
revisa otro, cuyo informe **no he leído**, por encargo).
**Objeto:** `scripts/lotes/lote13-c2-borde.ts` y
`docs/contenido/2026-09-04-lote13-c2-borde.md`, **en el estado de HEAD
`89ae861`**.
**Scripts de medición**, en el repo para que las cifras se re-corran:
`scratchpad/medir13.ts` (lote actual), `medir13c.ts` (tasa base sobre el
corpus), `medir13d.ts` (espacio de órdenes). `scratchpad/medir13b.ts` es de
la línea base vieja (N = 6) y sólo sirve para las cifras marcadas como tales.

> **Nota de línea base, y hay que leerla antes que nada.** El encargo me
> mandó revisar **seis** ítems en **tres** pares. A mitad de la revisión el
> round de gramática aterrizó (`89ae861`): mató P-01 —el portugués **sí**
> duplica el clítico dativo, doce pasajes, «Eu **lhe** digo **aos
> senhores**» (Garrett)—, corrigió dos falsedades publicadas en el MDX de
> `b12`, cambió el esqueleto de P-02 y redeclaró la glosa de P-03. **He
> re-corrido todas las mediciones sobre el estado nuevo: 4 ítems, 2 pares.**
> Todas las cifras de este informe son del lote de cuatro. Donde el recorte
> cambia el diagnóstico, lo digo.

---

## Veredicto global: **NO**

Y ahora no es cuestión de grado. El lote pasó de doce planeados a seis por la
regla de corte y de seis a cuatro por el round, y **a cuatro ítems el
instrumento que lo certifica deja de existir**:

```
| N | p de un rasgo PERFECTO (N/N) | k mínimo para p<0,05 | ¿el gate puede rechazar? |
|---|---|---|---|
| 4 | 0.0625 | — | **NO. Ningún rasgo puede bloquear, ni acertando el 100 %** |
| 5 | 0.0313 | 5/5 | sí |
| 6 | 0.0156 | 6/6 | sí |
```

**Con cuatro ítems, `pValor(4,4) = 0,0625 > 0,05`: un rasgo que prediga el
lote entero, sin un solo fallo, sale «no sospechoso».** «Preflight limpio» a
N = 4 no es un resultado: es una tautología. El preflight no puede imprimir
otra cosa.

Y no es hipotético — **hay dos rasgos al 100 %**:

- **el espejo del español** (declarado): `4/4`, y por construcción en un
  punto `trampa`;
- **la posición**: el patrón es `MMBB`, o sea «los dos primeros MAL, los dos
  últimos BIEN». *«posición ≥ 3 ⇒ BIEN»* acierta `4/4`. Mecánico, sin juicio
  ninguno. La batería tiene un rasgo de posición y **no lo ve**, porque mide
  paridad (`MBMB`) y esto es un bloque.

A lo que se suma que **la mitad del lote se imprime como respuesta de la otra
mitad**: los dos MAL van delante de sus BIEN, y la tarjeta imprime el
`repair`, que **es** la frase del BIEN.

Y el remate, que es el que decide el veredicto y no admite edición:

```
| pares | N | órdenes | sin fuga (BIEN antes que su MAL) | + molde válido | + NO resoluble por posición |
|---|---|---|---|---|---|
| 2 | 4 | 24 | 6 | 6 | **0** ← IMPOSIBLE |
| 3 | 6 | 720 | 90 | 90 | **48** |
| 4 | 8 | 40320 | 2520 | 1944 | **1920** |
| 5 | 10 | 3628800 | 113400 | 52920 | **52800** |
```

**Con dos pares mínimos no existe ningún orden que sea a la vez sin fuga y no
resoluble por la posición.** Los 24 órdenes posibles, uno a uno: seis evitan
la fuga y los seis se resuelven mirando dónde cae la carta. No es un defecto
de esta baraja: es que a N = 4 el espacio de diseño está vacío. **El lote de
cuatro no se puede arreglar barajando.**

**9 bloqueantes**, en §7.

| par | qué es | veredicto |
|---|---|---|
| P-02 · la «a» personal | hecho de A2, bien montado, con la excepción del pronombre tónico bien declarada; el arreglo del esqueleto fabricó un defecto nuevo | **corregible** — vale como reenseñanza declarada, no como cobertura de C2 |
| P-03 · adverbio + posesivo | el `repair` no corrige el calco: cambia la proposición | **retirar y rehacer** |

---

## 0 · La cadena de recortes, y qué le hizo al instrumento

| momento | ítems | pares | qué puede decir el gate |
|---|---:|---:|---|
| el punto pide | 12 | 6 | bloquea desde 10/12 (83 %); ve con potencia 0,80 atajos del **87 %** |
| regla de corte de Edu (E2#14) | 6 | 3 | bloquea sólo con 6/6; ve con potencia 0,80 atajos del **96 %** |
| round de gramática (`89ae861`) | **4** | **2** | **no bloquea nunca**; no ve **nada** |

La regla de corte es correcta —tres pares defendibles valen más que seis
inventados, y ocho MAL muertos en cuatro sesiones lo prueban— y el round de
gramática hizo lo que tenía que hacer. **Lo que nadie miró es que cada
recorte también recorta la capacidad de medir**, y que hay un suelo por
debajo del cual la medición se apaga: **N = 5**. El lote cayó por debajo.

```
POTENCIA = P(el gate dispara | el atajo acierta de verdad una fracción q de los ítems)
| q | N=4 | N=6 | N=12 | N=16 | N=24 |
|---|---|---|---|---|---|
| 66.7 % | 0.0 % | 8.9 % | 18.2 % | 34.1 % | 42.5 % |
| 75.0 % | 0.0 % | 17.8 % | 39.1 % | 63.0 % | 76.6 % |
| 80.0 % | 0.0 % | 26.2 % | 55.8 % | 79.8 % | 91.1 % |
| 83.3 % | 0.0 % | 33.4 % | 67.6 % | 88.6 % | 96.4 % |
| 90.0 % | 0.0 % | 53.1 % | 88.9 % | 98.3 % | 99.8 % |
| 95.0 % | 0.0 % | 73.5 % | 98.0 % | 99.9 % | 100.0 % |
| 100.0 % | 0.0 % | 100.0 % | 100.0 % | 100.0 % | 100.0 % |

N=4: fuerza mínima detectable con potencia 0,80 → NINGUNA (el gate no puede rechazar)
N=6: fuerza mínima detectable con potencia 0,80 → 96.4 %
N=12: fuerza mínima detectable con potencia 0,80 → 87.0 %
N=16: fuerza mínima detectable con potencia 0,80 → 80.1 %
N=24: fuerza mínima detectable con potencia 0,80 → 76.0 %
```

**La respuesta literal a la pregunta del encargo** («mide la potencia real
del gate a N = 6 y dime si un lote de seis está verificado o simplemente sin
medir»): a N = 6 está **sin medir** —sólo ve con fiabilidad atajos del 96 %,
y frente a uno del 83 % acierta una de cada tres veces—, y a N = 4, que es
donde el lote está hoy, **no está ni sin medir: está sin medible**. La
diferencia entre 6 y 4 no es cuantitativa. Es la diferencia entre un
instrumento poco sensible y un instrumento desconectado.

### 0.1 Tres guardas más que se apagan solas al encoger

- **La tabla de solape del molde sale vacía.** `preflight-lote.ts` hace
  `if (L < 8) continue` con `L = min(4, largo del lote publicado)`, así que
  **se compara con 0 de los 11 lotes publicados** (medido). El documento
  imprime la cabecera y ninguna fila, lo que se lee como «sin problemas» y
  significa «sin comprobar».
- **`evaluarMolde` no puede filtrar nada a N = 4.** Sólo hay seis patrones
  con 2 BIEN y 2 MAL, y los seis pasan (racha ≤ 3, desequilibrio 0). Incluido
  `MMBB`, que es el que resuelve el lote por posición.
- **La separación entre miembros del par cae de 3 a 1**
  (`separacionExigible(4) = 1`), y con ella se pierde el único freno que
  quedaba contra la fuga del `repair`.

### 0.2 Y una p que va a la mitad, que afecta a lotes ya certificados

`pValor` calcula **una** cola mientras `medirRasgo` se queda con la **mejor**
de las dos direcciones. La p que imprime el preflight está sistemáticamente a
la mitad de lo que debe. A N = 4 y N = 6 no cambia el veredicto; **a N = 16
sí**: 12/16 pasa de 0,038 («bloqueante») a 0,077 (**no** significativo).
Conviene revisar los lotes de 16 que se hayan certificado apoyándose en esa
cifra. Corrección: dos caracteres.

---

## 1 · El atajo que la batería de trece NO tiene: **el espejo del español**

### 1.1 Por qué el rasgo 12 no lo cubre

El rasgo 12 mide **si la glosa palabra por palabra es español bien formado**.
El atajo que el alumno usa es otro: **«¿esta frase es la que yo produciría
transfiriendo de mi español?»**. Los dos se separan en un ítem del propio
lote:

> **GJ-02** «Fomos visitar **ao** teu avô esta manhã…» · glosa declarada
> «Fuimos a visitar **al tu** abuelo esta mañana» ⇒ español **INCORRECTO** ⇒
> el rasgo 12 dice *«aquí la glosa no ayuda»*.
> Y sin embargo esa frase portuguesa **es exactamente lo que produce un
> hispanohablante que transfiere «visitar a tu abuelo»**.

Lo que rompe la glosa de P-02 es el artículo del posesivo («el tu abuelo»),
que es **ruido de la convención de glosado**: ningún alumno glosa *o teu avô*
como «el tu abuelo» —el artículo con posesivo es A2 y lo tiene automatizado
desde el bloque 2—, lo glosa como «tu abuelo». Con esa convención la glosa
declarada **3/4** pasa a **2/4**. La cifra del rasgo 12 en este lote la
decide una convención de escritura, no la lengua.

### 1.2 Medido: 4/4, y el gate no puede decirlo

| ítem | ¿es lo que produce el hispanohablante por transferencia? | por qué |
|---|---|---|
| GJ-01 `atrás meu` · MAL | **sí** | ← «detrás mío» |
| GJ-02 `visitar ao teu avô` · MAL | **sí** | ← «visitar a tu abuelo» |
| GJ-03 `atrás do meu` · BIEN | no | el default español coloquial es «detrás mío» |
| GJ-04 `visitar o teu avô` · BIEN | no | el español obliga a «a tu abuelo» |

```
==================== 5 · RASGOS DECLARADOS ====================
espejo estructural del español: **4/4** (100 %) · presente⇒MAL · p=0.0625 · NO BLOQUEA (el gate no puede a N=4)
   GJ-01 MAL  espejo=true → la regla «espejo ⇒ MAL» ACIERTA
   GJ-02 MAL  espejo=true → la regla «espejo ⇒ MAL» ACIERTA
   GJ-03 BIEN espejo=false → la regla «espejo ⇒ MAL» ACIERTA
   GJ-04 BIEN espejo=false → la regla «espejo ⇒ MAL» ACIERTA
```

**El lote se cierra entero con una pregunta que no exige saber una palabra de
portugués.** Y el gate imprime `p = 0,0625` y lo deja pasar.

### 1.3 Y no lo declaro yo: está en el campo `rasgo` de los pares

La objeción obvia es que mi declaración es discutible. Lo es —a N = 6 medí
que voltear una sola declaración tumbaba el resultado, y a N = 4 el margen es
todavía menor—. Pero el 4/4 **no depende de mi juicio**: está escrito por el
autor en `lote13-c2-borde.ts`.

| par | `rasgo` declarado | ¿el MAL es la opción española? |
|---|---|---|
| P-02 | «el portugués **no tiene** «a» personal ante el objeto directo» | sí — el MAL es `ao` |
| P-03 | «el **español coloquial admite** adverbio de lugar + posesivo; el portugués exige la preposición» | sí — el MAL es `atrás meu` |

2 de 2. Y no puede ser de otra manera, porque es la definición de la clase en
`formato-punto.ts`:

> `/** El español PERMITE lo que el portugués prohíbe. […] ⇒ JUICIO. */`

**En un punto `trampa`, «MAL» y «la opción española» son la misma cosa por
definición.** Un lote de juicios hecho sólo de puntos `trampa` tiene el
espejo al 100 % **por construcción**, igual que un lote hecho sólo de puntos
`coincide` tiene la glosa al 100 %. El mapa dedujo esa restricción para
`coincide` y la escribió; para `trampa` dedujo **la mitad** —la de la
glosa— y la neutralizó con pares, sin ver que la otra mitad **no se
neutraliza con pares, porque mira el hueco**.

La frase que falta en `REGLA_DE_LOTE_JUICIO`, simétrica de la que ya está:

> Un lote de juicios no puede ser **monocultivo de una sola clase**. Si todos
> sus puntos son `coincide`, se resuelve glosando; si todos son `trampa`, se
> resuelve preguntándose «¿es esto lo que yo diría?». La mezcla no es
> higiene: es la única fuente de validez del formato.

### 1.4 La tasa base, que es lo que lo convierte en hallazgo

Mismo control que el rasgo 13 tiene escrito en su comentario. Midiendo la
fracción de ítems cuyos puntos son todos `trampa`:

```
$ npx tsx scratchpad/medir13c.ts

| lote | ítems | conceptos distintos | % de ítems en puntos `trampa` | clases presentes |
|---|---:|---:|---:|---|
| piloto | 6 | 5 | 67 % | coincide, trampa |
| l1 | 20 | 13 | 40 % | coincide, lexico, pragmatico, trampa |
| l2 | 20 | 15 | 50 % | coincide, lexico, sin-equivalente, trampa |
| l3 | 20 | 11 | 15 % | coincide, lexico, pragmatico, sin-equivalente, trampa |
| l4 | 20 | 14 | 25 % | coincide, lexico, pragmatico, trampa |
| l5 | 20 | 9 | 70 % | coincide, pragmatico, trampa |
| l6 | 10 | 5 | 50 % | coincide, pragmatico, trampa |
| l7 | 10 | 5 | 50 % | coincide, trampa |
| l8 | 10 | 7 | 50 % | coincide, trampa |
| l9 | 10 | 5 | 50 % | coincide, trampa |
| l10 | 14 | 9 | 21 % | coincide, sin-equivalente, trampa |
| **lote 13** | **4** | **1** | **100 %** | trampa |
```

**Ningún lote publicado pasa del 70 %; la mediana es 50 %. Éste está al 100 %
con un solo punto.** No es un rasgo de la lengua: es del lote.

Y el corpus ya tiene el antídoto escrito. **`b2c2-gj-l10-12`** (b11,
`b11-regencias`) es un juicio publicado cuyo MAL es *«Os miúdos costumam
obedecer **os** avós»* y cuyo BIEN es *«obedecer **aos** avós»* — donde la
opción española («obedecer **a** los abuelos») está en el **BIEN**. Un solo
ítem de esa familia dentro del lote rompe el espejo.

---

## 2 · El SEGUNDO atajo al 100 %, y éste es mecánico: la posición

El patrón del lote es `MMBB`.

```
==================== 4 · BARRIDO MECÁNICO EXHAUSTIVO ====================
candidatos mecánicos probados: 666
los que alcanzan 4/4 (100 %): 2
  4/4 · posición ≥ 3 en el lote (presente⇒BIEN, presente en 2) — p=0.0625, NO bloquea
  4/4 · nº de caracteres par (presente⇒MAL, presente en 2) — p=0.0625, NO bloquea
```

El segundo es aritmética sin sentido. El primero **no**: *«los dos primeros
son MAL, los dos últimos son BIEN»*. Un alumno que haga la lección de
corrido acierta el tercero y el cuarto sin leerlos.

Tres cosas hay que decir de esto, y las tres son de método:

1. **La batería TIENE un rasgo de posición y no lo ve.** El rasgo 3 mide
   `pos % 2 === 0` — la **alternancia** `MBMB` que se prohíbe desde el lote 2.
   Un lote **ordenado por etiqueta** (`MMBB`, `BBMM`, `MMMBBB`…) es igual de
   resoluble y el rasgo lo puntúa `2/4`. Es el mismo agujero que el rasgo 3
   vino a tapar, un escalón más allá: *«la posición también es un rasgo»*, sí,
   pero **la posición tiene más de una forma**.
2. **`evaluarMolde` tampoco.** Comprueba equilibrio (0, ok), rachas (2 ≤ 3,
   ok) y solape con los publicados (**0 lotes comparados**, §0.1). Un patrón
   ordenado por etiqueta pasa los tres.
3. **Y esto sí es un problema del proyecto entero, no de este lote.** Lo mismo
   pasaría en un lote de 24 con patrón `MMMMMMMMMMMMBBBBBBBBBBBB`: rachas de
   12, que sí bloquearía. Pero `MMMBBBMMMBBB…` no, y su umbral de posición
   local también resuelve. El gate correcto no es «racha»: es **«¿existe un
   corte de posición que clasifique el lote?»**. Código en §6.

---

## 3 · Los dos esqueletos: los defectos COMPARTIDOS

El enunciado que la sesión pasada dejó escrito —«el par compra validez
diferencial y CERO validez absoluta; todo defecto compartido es invisible por
construcción»— produce aquí dos hallazgos, uno por par.

### 3.1 P-02 · el arreglo del «ao lar» fabricó un defecto nuevo

```
antes:  «Fomos visitar {} teu avô ao lar,       mas ele já estava a dormir.»
ahora:  «Fomos visitar {} teu avô esta manhã,   mas ele já estava a dormir.»
```

El cambio es **correcto y era necesario**: el `ao lar` metía un segundo `ao`
legítimo a tres palabras del `ao` que se juzga, y un ítem que enseña «el
objeto directo va sin preposición» no debe llevar en la misma frase un `ao`
que sí va. Eso está resuelto y hay que apuntárselo al round.

**Pero el sustituto rompe la escena.** `já estava a dormir` significa «ya
estaba durmiendo» — marca que el sueño había empezado *antes de lo
esperado*, y encaja con una visita de tarde o de noche (que es lo que el
`ao lar` sugería). Con `esta manhã`, lo que un portugués dice es **`ainda`
estava a dormir** («todavía estaba durmiendo»). Tal y como está, la frase
dice «fuimos a visitarlo por la mañana, pero ya se había dormido».

Es **defecto compartido**: está en el BIEN y en el MAL, así que ni
`verificarPar()` ni la batería lo ven, y la batería lo puntúa «limpio». Es
la tercera vez en la historia de este proyecto que arreglar un defecto
fabrica otro del mismo tamaño (longitud → arranque; glosa → espejo; `ao lar`
→ `já`/`ainda`), y la primera en que el defecto fabricado es de
**plausibilidad**, no de atajo. *(Confirmación del hecho: revisor de
gramática. Lo de diseño es que el arreglo no se re-leyó entero.)*

Arreglo: `já` → `ainda`, o `esta manhã` → `ontem à noite`.

**Lo que sí está bien en P-02, y es fino:** la `explicacionBien` declara la
excepción («Sí la conserva con pronombre tónico —*amo-te a ti*, *viu-a a
ela*— y en fórmulas con Deus: no es que le falte la preposición, es que no
la usa con un nombre»). Es exactamente la clase de matiz que convierte una
regla de manual en una regla verdadera, y es la corrección del absoluto que
mató a P-01 aplicada **a tiempo** en el par vecino.

### 3.2 P-03 · el `repair` no corrige el calco: cambia la proposición

Éste es el bloqueante que el round no tocó y que ahora es **la mitad del
lote**.

```
MAL    «O carro dele ficou estacionado atrás meu    durante toda a tarde.»
repair «O carro dele ficou estacionado atrás do meu durante toda a tarde.»
```

El español «detrás mío» significa **«detrás de mí»** — de la *persona*. No
existe en español un «detrás mío» que signifique «detrás del mío». Por tanto:

- el MAL calca «detrás mío» = *detrás de mí*, y su corrección europea es
  **«atrás de mim»**;
- el `repair` que da el lote, «atrás do meu», es «detrás **del** mío» =
  detrás de *mi coche*, **otra proposición**.

Y el propio documento lo firma sin verlo: las dos glosas que imprime son
«detrás mío» (GJ-01) y «detrás del mío» (GJ-03), **que no son la misma
frase**. El esqueleto lo esconde porque el sujeto es «O carro dele»: eso
licencia la elipsis «do meu (carro)» y hace que el BIEN suene perfecto.

**El par es mínimo en la cadena de caracteres y no lo es en el
significado.** El alumno que lo hace aprende una equivalencia falsa: la
próxima vez que quiera decir «se puso detrás mío» producirá *«pôs-se atrás
do meu»*. Un ítem que enseña la corrección equivocada es peor que no tener el
ítem.

**El arreglo conserva el par y cuesta cinco caracteres:** que los dos
miembros hablen de la misma cosa.

```
BIEN «O carro dele ficou estacionado atrás de mim durante toda a tarde.»
MAL  «O carro dele ficou estacionado atrás meu    durante toda a tarde.»
```

Difieren en «de mim» / «meu» (5 car., dentro de `LIMITE_CHARS = 8`), la
proposición es constante, el `repair` corrige de verdad el calco, y la glosa
sigue siendo «detrás de mí» / «detrás mío», que es el contraste que el par
declara juzgar.

**Y queda un fleco de variante.** El round estrechó bien la afirmación («en
portugués **europeo** no está atestiguada: cero casos en 4,3 M»), pero la app
sirve PT-BR y PT-PT y el ítem no lleva marca de variante. *Atrás meu / na
frente meu* son coloquialismos vivos en Brasil; un alumno con la variante BR
recibirá un MAL sobre una forma que oye. El proyecto tiene maquinaria para
esto (`variantStatus`, `variantOverrides`, `variant-guard.ts`) y este par no
ha pasado por ella. Si resultara que en BR es corriente, el punto deja de ser
`trampa` y pasa a `pragmatico`, que por el propio `FORMATO_DE_CLASE` pide
**mediación, no juicio**.

### 3.3 El defecto común a los dos: el `repair` **es** el BIEN del par

Es la propiedad definitoria del método de pares, y nadie ha mirado qué le
hace a la tarjeta. `components/cards/GrammaticalityJudgmentCard.tsx:57`:

```tsx
{!data.verdict && data.repair && (
  <div>Forma correcta: <span className="font-medium">{data.repair}</span></div>
)}
```

Y el orden de presentación es el del array en las dos rutas:
`ExerciseRunner.tsx:63` avanza `exercises[idx]` sin barajar, y
`lib/srs/review-queue.ts:44` ordena las cartas nuevas por `introducedAt`, que
sigue el orden de inserción del corpus.

```
==================== 6 · SEPARACIÓN Y FUGA POR EL `repair` ====================
separacionExigible(4) = 1 · SEPARACION_MINIMA declarada = 3
  par P-02: posiciones 2 y 4 → distancia 2
  par P-03: posiciones 1 y 3 → distancia 2
  FUGA: GJ-01 (MAL, pos 1) imprime como «Forma correcta» la frase de GJ-03 (BIEN, pos 3) — 2 cartas después
  FUGA: GJ-02 (MAL, pos 2) imprime como «Forma correcta» la frase de GJ-04 (BIEN, pos 4) — 2 cartas después
  ítems del lote regalados por el feedback de un ítem anterior: 2 de 4 (50 %)
```

**El 50 % del lote está impreso, palabra por palabra, en el feedback de un
ítem anterior.** El alumno responde GJ-03 y GJ-04 leyendo lo que le enseñaron
en GJ-01 y GJ-02, y el FSRS registra dos aciertos que no significan nada.

Dos apuntes de método:

- **Es inédito en el corpus.** Medido: de los 160 juicios publicados, **0**
  tienen un `repair` que sea la `sentence` de otro ítem. Los once lotes
  publicados no se hicieron con pares; el lote 13 sería el primero, y estrena
  el agujero.
- **Y a N = 4 no se puede evitar** (§0, tabla de órdenes). Los seis órdenes
  sin fuga se resuelven todos por posición:

```
Los 6 órdenes sin fuga a N=4, con su patrón y por qué caen:
  BMBM  pares P-02 P-02 P-03 P-03 → resoluble por posición: paridad (alternancia mecánica)
  BBMM  pares P-02 P-03 P-02 P-03 → resoluble por posición: umbral en la posición 3
  BBMM  pares P-02 P-03 P-03 P-02 → resoluble por posición: umbral en la posición 3
  BBMM  pares P-03 P-02 P-02 P-03 → resoluble por posición: umbral en la posición 3
  BBMM  pares P-03 P-02 P-03 P-02 → resoluble por posición: umbral en la posición 3
  BMBM  pares P-03 P-03 P-02 P-02 → resoluble por posición: paridad (alternancia mecánica)
```

Desde tres pares el espacio se abre (48 órdenes válidos a N = 6). **Con dos,
no hay ninguno.**

---

## 4 · Cuatro ítems: no es medio punto, es cero de cinco

### 4.1 Lo que el currículo declara y lo que el lote cubre

`lib/data/languages/pt/curriculum.ts:361`:

> «Las estructuras que el español permite y el portugués no, **y al revés**:
> duplicación del clítico, neutro «lo», infinitivo flexionado con sujeto
> propio, sujeto de infinitivo, orden de constituyentes admisible en una
> lengua y no en la otra»

| lo que el currículo nombra | ítems del lote |
|---|---:|
| duplicación del clítico | **0** — era P-01, muerto en el round |
| neutro «lo» | 0 — y el round acaba de probar que el portugués **sí lo tiene** |
| infinitivo flexionado con sujeto propio | 0 |
| sujeto de infinitivo | 0 |
| orden de constituyentes | 0 |
| *(la mitad «y al revés»: PT permite, ES no)* | **0** |
| — fuera de la lista: «a» personal | 2 (P-02) |
| — fuera de la lista: adverbio + posesivo | 2 (P-03) |

**Cero de las cinco sub-áreas nombradas.** Cuando murió P-01 el lote perdió
el único ítem que estaba dentro del punto tal y como el currículo lo define.
Lo que queda son dos contrastes buenos pero improvisados. La cabecera del
documento («4 — no cierra, y se declara») es honesta en el número y no dice
lo que ese número representa: **no es un tercio del punto, es cero del punto
declarado y dos ítems de otra cosa**.

Y hay un efecto secundario del round que hay que apuntar: **dos de las cinco
sub-áreas eran falsas** —la duplicación del clítico y el neutro «lo»—, así
que el propio currículo hay que reescribirlo. Eso es trabajo, no defecto.

### 4.2 Y la mitad que falta es el antídoto del §1

La mitad «**y al revés**» —lo que el portugués permite y el español no— es
exactamente la familia donde **el espejo del español predice BIEN**: el
infinitivo flexionado, la mesóclise, la ênclise sobre finito, el *obedecer
aos avós* de `b2c2-gj-l10-12`. **El lote no está a medio hacer: está hecho
entero del lado que produce el atajo, y nada del lado que lo mata.**

Por eso la respuesta a «¿publicar medio punto ayuda o estorba?» es
**estorba**, y por tres razones que no son «media tabla»:

1. **A cuatro, la batería no puede hablar** (§0). A doce sí. Y es aritmética
   comprobable: si los ocho ítems que faltan fueran cuatro pares más de la
   misma familia, el espejo saldría 12/12 (p = 0,0002) y **el lote se
   autodenunciaría**. El de cuatro no puede.
2. **Publicar cuatro fija en el corpus** el `repair` que imprime la frase del
   vecino, la equivalencia falsa de P-03 y el `já`/`ainda` de P-02.
   Despublicar cuesta más que esperar.
3. **La regla de corte es correcta y aquí se aplicó bien dos veces.** Lo que
   el lote hace mal no es cortar: es **publicar el corte**. Un banco parado
   no gasta nada; medio punto publicado gasta un número en la tabla de
   cobertura y una entrada en el FSRS de cada alumno.

**Recomendación: el banco se queda en el banco.** P-03 se rehace (§3.2),
P-02 se arregla (§3.1) y se etiqueta como reenseñanza, y se publica cuando
haya al menos seis pares, la mitad de ellos de la dirección «y al revés».

---

## 5 · NIVEL, ítem por ítem

Marco: «qué hay que saber para acertar ESTE ítem», no «dónde se menciona el
tema». Referencia, el reparto habitual del PLE (Camões / QECR).

| id | par | qué hay que saber | dónde vive eso ya en el repo | nivel |
|---|---|---|---|---|
| GJ-01 | P-03 | que `atrás` pide `de` antes del posesivo (cara negativa) | `48c59fd3` (b1, **A1**, «atrás do») · `ad2ff781` (b2, **A2**, «À frente da») | **B1** |
| GJ-02 | P-02 | que el OD nominal de persona va sin preposición (cara negativa) | `b2c2-gj-l10-12` (b11) lo dice en su explicación | **A2** |
| GJ-03 | P-03 | ídem GJ-01, cara positiva | ídem | **A2** |
| GJ-04 | P-02 | ídem GJ-02, cara positiva | ídem | **A2** |

**Recuento: C2 = 0. C1 = 0. B1 = 1. A2 = 3.** El lote se declara C2, puebla
un punto de C2, y **su techo es B1**. Cuando murió P-01 se llevó los dos
únicos ítems de C1 que había.

Tres cosas, y ninguna es «suban el nivel a ojo».

**(a) La «a» personal es A2, y el propio banco ya lo sabe.** Su lista de
descartes rechaza «artículo ante nombre propio» con este motivo:

> «es `b2-art-com-nome`, punto de A2 ya declarado: sería reenseñanza, no
> cobertura de C2»

El criterio es exacto y hay que aplicárselo a P-02: *«visitar a tu abuelo» →
«visitar o teu avô»* es el mismo tipo de hecho contrastivo de A2. Que el
error **persista** hasta C1 no lo convierte en un ítem de C1: el nivel de un
ítem es el conocimiento que exige, no la longevidad del error que castiga.

**(b) Y P-02 tiene su versión de C2 escrita en su propia explicación.** El
`explicacionBien` dice ya lo que hace falta: el portugués **sí** conserva la
preposición ante objeto directo con pronombre tónico —*«amo-te a ti»*,
*«viu-a a ela»*— y en fórmulas con Deus. Saber que «visitar ao teu avô» está
mal es A2; saber que *«Viu-me **a mim**, não **a ti**»* está bien es C2. Un
par con esos dos miembros:

- juzga el hecho fino en vez del grueso,
- **y mata el espejo**, porque el BIEN pasa a ser la opción con aspecto
  español.

Es el mejor sitio del lote, y no hay que inventarlo: está escrito en el
propio ítem, como nota al pie de un ejercicio de A2.

**(c) Lo mismo con P-03,** si se rehace: el contraste C2 no es *atrás meu* /
*atrás de mim* (que es B1) sino *atrás de mim* / *atrás do meu*, donde las
**dos** son correctas y lo que decide es a qué se refiere el posesivo.

**La conclusión del §5 y la del §1 son la misma.** El punto no está mal
poblado por casualidad: se ha poblado con la mitad fácil de cada contraste
—la mitad donde la regla es «el portugués no lo tiene»— y esa mitad es a la
vez la de nivel bajo y la que regala el atajo. **Subir el nivel y matar el
atajo son la misma edición.**

---

## 6 · Fugas, repetición, y el código

### 6.1 Fugas

- **Del lote a sí mismo: 2 de 4 ítems (50 %)**, por el `repair`. §3.3.
- **De la lección al lote: resuelta, y por los pelos.** Hasta `89ae861` la
  lección `b12-l1-o-limite-da-gramatica` decía en su `<Rule>`: *«el portugués
  no [duplica el clítico] («disse ao João», nunca «disse-lhe ao João»)»* —el
  par P-01 entero, los dos miembros con el veredicto pegado, en la lección
  que sirve este punto. El round lo corrigió al matar P-01, así que **hoy no
  hay fuga**. Pero el gate **no la habría visto nunca**: `preflight-lote.ts:230`
  indexa las lecciones con
  `matchAll(/<Example[^>]*\bpt="([^"]+)"/g)` — sólo el atributo `pt=` de
  `<Example>`. El texto del `<Rule>`, que es donde este proyecto pone los
  contraejemplos en prosa, **no se indexa**. Es la cicatriz del lote 10 v3
  («la fuente no estaba indexada») arreglada un piso más abajo de donde hacía
  falta. Que esta vez lo cazara un revisor y no el gate es exactamente lo que
  el gate existe para evitar.
- **Aviso:** `37f6efe7` (b4) publica «Eu disse-lhe a verdade» como ejemplo
  modelo. Ya no colisiona con nada, ahora que P-01 murió.

### 6.2 Repetición: dos pares, dos contrastes

La pregunta del encargo era si tres pares eran tres contrastes o dos. Con
P-01 muerto la pregunta cambia y la respuesta es buena: **P-02 y P-03 son los
dos contrastes opuestos** —el español *añade* una pieza (`ao`) / el español
*quita* una pieza (`do`)— y esa oposición es lo que mantiene neutros los
rasgos de longitud y de contracción:

```
GJ-01 P-03 MAL  car=62      GJ-03 P-03 BIEN car=65   → en P-03 el MAL es MÁS CORTO
GJ-02 P-02 MAL  car=64      GJ-04 P-02 BIEN car=63   → en P-02 el MAL es MÁS LARGO
```

Los dos rasgos de longitud tienen techo `4/4` —o sea, **podrían** disparar—
y salen `2/4` porque las direcciones se cancelan. Lo mismo «lleva preposición
contraída» (`ao` en el MAL de P-02, `do` en el BIEN de P-03). **Eso está bien
hecho, es lo único que impide que este lote repita la cicatriz fundacional
del lote 10, y hay que conservarlo a propósito al rehacer P-03.**

### 6.3 El código, para `scripts/lib/atajos.ts`

Cuatro piezas: el rasgo 14, la potencia (para que el preflight diga cuánto
puede ver antes de decir «limpio»), el gate de monocultivo y el de
separabilidad por posición.

```ts
// ── EL RASGO 14 · EL ESPEJO DEL ESPAÑOL, y por qué el 12 no lo cubre ─
//
// Encontrado por el round del lote 13. El rasgo 12 mide **si la glosa
// palabra por palabra es español bien formado**. El lote 13 lo neutralizó
// eligiendo pares cuyos dos rellenos glosan igual, y aun así se resuelve
// entero sin saber portugués, porque el atajo que el alumno usa no es ése:
// es «¿esta frase es la que yo produciría transfiriendo de mi español?».
// Medido en el lote 13: **4/4 (100 %)**.
//
// Los dos rasgos se separan en un ítem del propio lote: «Fomos visitar ao
// teu avô» glosa a «Fuimos a visitar al tu abuelo» = español MALO (el
// rasgo 12 dice «no ayuda») y sin embargo es EXACTAMENTE lo que produce
// quien transfiere «visitar a tu abuelo» (el 14 dice «lo resuelve»). Lo
// que rompe la glosa es el artículo del posesivo, que es ruido de la
// convención de glosado, no del punto.
//
// Y la consecuencia que NINGÚN equilibrio de glosas arregla: en un punto
// `trampa` el MAL **es** la opción española por definición de la clase.
// Eso no se mide: se impide al montar el lote — ver `monocultivoDeClase`.
{
  nombre: 'la frase es la que el hispanohablante produce por transferencia directa (espejo del español)',
  f: (x) => x.espejoEs === true,
},
```

```ts
export interface ItemJuicio {
  // … lo que ya hay …
  /** EL ESPEJO, declarado. ¿Esta frase portuguesa es la que un
   *  hispanohablante produce transfiriendo su español, morfema a morfema?
   *  NO es `glosaEsCorrecta`: aquella pregunta si la traducción resulta
   *  español bueno; ésta, si el portugués es la imagen del español. Se
   *  declara por la misma razón que la glosa —es juicio, no regex— y el
   *  preflight debe BLOQUEAR si falta. */
  espejoEs?: boolean;
}
```

```ts
// ── LO QUE UN GATE BINOMIAL PUEDE Y NO PUEDE VER, según N ────────────
//
// El lote 13 salió «limpio» con CUATRO ítems, y a N=4 `pValor(4,4)=0,0625`:
// **un rasgo que prediga el lote entero sin un solo fallo no baja de 0,05**.
// El gate no puede rechazar nada, así que «preflight limpio» es una
// tautología. A N=6 puede, pero sólo con 6/6: un atajo del 83 % pasa, y la
// potencia frente a él es del 33 %. Publicar la p sin publicar la POTENCIA
// es publicar media medición: «no dispara» y «no puede disparar» se
// imprimen igual.

/** N por debajo del cual el gate binomial no puede rechazar NADA. */
export const N_SUELO_DEL_GATE = 5;   // pValor(4,4)=0,0625 · pValor(5,5)=0,0313
/** N por debajo del cual el gate rechaza sólo atajos casi perfectos. */
export const N_MINIMO_PARA_CERTIFICAR = 12;

/** Acierto mínimo que el gate puede declarar sospechoso con N ítems.
 *  N=4 → no existe · N=6 → 6 · N=12 → 10 · N=16 → 12 · N=24 → 17. */
export function umbralAcierto(n: number, alfa = SOSPECHOSO): number {
  for (let k = Math.ceil(n / 2); k <= n; k++) if (pValor(k, n) < alfa) return k;
  return n + 1; // no existe k: el gate no puede rechazar nada
}

/** Potencia: P(el gate dispare | el atajo acierta de verdad una fracción q
 *  de los ítems). Cuenta las dos colas porque la batería se queda con la
 *  mejor de las dos direcciones. */
export function potenciaGate(n: number, q: number, alfa = SOSPECHOSO): number {
  const k = umbralAcierto(n, alfa);
  if (k > n) return 0;
  const comb = (a: number, b: number) => { let r = 1; for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1); return r; };
  const pmf = (i: number) => comb(n, i) * q ** i * (1 - q) ** (n - i);
  let p = 0;
  for (let i = k; i <= n; i++) p += pmf(i);
  for (let i = 0; i <= n - k; i++) p += pmf(i);
  return p;
}

/** Fuerza mínima de atajo que el gate ve con potencia 0,80. Es la cifra que
 *  tiene que ir AL LADO de «preflight limpio»:
 *  N=4 → ninguna · N=6 → 96 % · N=12 → 87 % · N=16 → 80 % · N=24 → 76 %. */
export function fuerzaMinimaDetectable(n: number, objetivo = 0.8): number | null {
  for (let q = 0.5; q <= 1.0001; q += 0.001) if (potenciaGate(n, q) >= objetivo) return q;
  return null;
}

/** Techo alcanzable de cada rasgo bajo un diseño de PARES MÍNIMOS.
 *
 *  Un rasgo sólo llega a N/N si DIFIERE entre los dos miembros en TODOS los
 *  pares; si difiere en d de los P pares, su techo es N/2 + d. Un rasgo con
 *  techo por debajo del umbral **no es una comprobación**: es una fila de la
 *  tabla que se lee como comprobación. Hay que imprimirlo. */
export function techoBajoPares(
  items: ItemJuicio[],
  parDe: (x: ItemJuicio) => string | undefined,
): { nombre: string; difiereEn: number; pares: number; techo: number; puedeDisparar: boolean }[] {
  const xs = items.map((x, i) => ({ ...x, pos: x.pos ?? i }));
  const grupos = new Map<string, ItemJuicio[]>();
  for (const x of xs) { const p = parDe(x); if (p) grupos.set(p, [...(grupos.get(p) ?? []), x]); }
  const k = umbralAcierto(xs.length);
  return RASGOS.map((r) => {
    let d = 0;
    for (const [, m] of grupos) if (m.length === 2 && r.f(m[0]!, xs) !== r.f(m[1]!, xs)) d++;
    const techo = Math.floor(xs.length / 2) + d;
    return { nombre: r.nombre, difiereEn: d, pares: grupos.size, techo, puedeDisparar: techo >= k };
  });
}
```

```ts
// ── EL MONOCULTIVO ──────────────────────────────────────────────────
//
// `formato-punto.ts` dedujo que un lote hecho sólo de puntos `coincide` se
// resuelve glosando. La otra mitad del teorema es la que costó el lote 13:
// **un lote hecho sólo de puntos `trampa` se resuelve con el espejo**,
// porque ahí el MAL ES la opción española por definición de la clase. Y no
// lo arregla equilibrar glosas dentro del par: el espejo mira el hueco.
//
// Tasa base medida sobre los 11 lotes publicados: ninguno pasa del 70 % de
// ítems en puntos `trampa`, mediana 50 %. El lote 13 estaba al 100 % con UN
// punto.
export const TOPE_MONOCULTIVO = 0.7;

/** `claseDe` se inyecta para no acoplar la batería al mapa (y para poder
 *  testearla sin currículo). En el preflight: `(c) => formatoDe(c).clase`. */
export function monocultivoDeClase(
  conceptosPorItem: string[][],
  claseDe: (id: string) => string,
): string | null {
  const n = conceptosPorItem.length;
  if (!n) return null;
  const cuenta = new Map<string, number>();
  for (const cs of conceptosPorItem) {
    const clases = [...new Set(cs.map(claseDe))];
    if (clases.length === 1) cuenta.set(clases[0]!, (cuenta.get(clases[0]!) ?? 0) + 1);
  }
  for (const [clase, k] of cuenta) {
    if (k / n <= TOPE_MONOCULTIVO) continue;
    if (clase === 'trampa')
      return `monocultivo \`trampa\`: ${k}/${n} ítems (${Math.round((100 * k) / n)} %). En un punto trampa el MAL ES la opción española, así que «¿es esto lo que yo diría?» resuelve el lote sin saber portugués. Los pares NO lo neutralizan: el espejo mira el hueco. Hay que mezclar puntos donde el español coincide con el portugués — p. ej. \`b2c2-gj-l10-12\`.`;
    if (clase === 'coincide')
      return `monocultivo \`coincide\`: ${k}/${n} ítems (${Math.round((100 * k) / n)} %) — se resuelve glosando al español.`;
  }
  return null;
}
```

```ts
// ── LA POSICIÓN TIENE MÁS DE UNA FORMA ──────────────────────────────
//
// El rasgo 3 mide la PARIDAD, porque el lote 11 salió `MBMBMB…`. El lote 13
// salió `MMBB`, que la paridad puntúa 2/4 y que se resuelve entero con
// «¿estoy en la primera mitad?». `evaluarMolde` tampoco lo ve: equilibrio 0,
// racha 2, y el solape ni se calcula por debajo de L=8.
//
// El gate correcto no es «racha»: es **¿existe un corte de posición que
// clasifique el lote?**. Cubre la alternancia, el orden por etiqueta y
// cualquier bloque intermedio, y es de cuatro líneas.
export function separablePorPosicion(patron: string): string | null {
  const n = patron.length;
  for (let k = 1; k < n; k++) {
    let a = 0, b = 0;
    for (let i = 0; i < n; i++) {
      const pre = i < k;
      if (pre === (patron[i] === 'B')) a++;
      if (pre === (patron[i] === 'M')) b++;
    }
    if (a === n || b === n) return `molde: un corte en la posición ${k + 1} clasifica el lote entero (${patron}) — la posición predice la etiqueta al 100 %`;
  }
  let a = 0, b = 0;
  for (let i = 0; i < n; i++) {
    const par = i % 2 === 0;
    if (par === (patron[i] === 'B')) a++;
    if (par === (patron[i] === 'M')) b++;
  }
  if (a === n || b === n) return `molde: alternancia mecánica (${patron}) — la paridad predice la etiqueta al 100 %`;
  return null;
}
```

Y en `preflight-lote.ts`:

```ts
const q = fuerzaMinimaDetectable(items.length);
console.log(`Potencia: con ${items.length} ítems el gate ${q === null
  ? '**NO PUEDE RECHAZAR NADA** — ni un rasgo que acierte el 100 %'
  : `sólo detecta con fiabilidad (0,80) atajos que acierten ≥ ${Math.round(q * 100)} %, umbral ${umbralAcierto(items.length)}/${items.length}`}.\n`);
if (items.length < N_SUELO_DEL_GATE)
  bloqueantes.push(`N=${items.length}: pValor(${items.length},${items.length})=${pValor(items.length, items.length).toFixed(4)} — ningún rasgo puede bloquear. «Preflight limpio» a este tamaño es una tautología, no un resultado.`);
else if (items.length < N_MINIMO_PARA_CERTIFICAR)
  bloqueantes.push(`N=${items.length}: el gate exige ${umbralAcierto(items.length)}/${items.length} y su potencia frente a un atajo del 83 % es ${(potenciaGate(items.length, 5 / 6) * 100).toFixed(0)} %. El lote no está verificado: está sin medir.`);
for (const t of techoBajoPares(items, (x) => (x as Item).par))
  if (!t.puedeDisparar) avisos.push(`rasgo «${t.nombre}»: techo ${t.techo}/${items.length} bajo este diseño — NO puede disparar (difiere en ${t.difiereEn}/${t.pares} pares)`);
const mono = monocultivoDeClase(items.map((x) => (x.concepto ? [x.concepto] : [])), (c) => formatoDe(c).clase);
if (mono) bloqueantes.push(mono);
const sep = separablePorPosicion(patron);
if (sep) bloqueantes.push(sep);
// y la fuga del repair, que es propia del método de pares:
for (const x of items) {
  if (x.verdict || !x.repair) continue;
  const iM = items.indexOf(x), iB = items.findIndex((y) => normPar(y.sentence) === normPar(x.repair!));
  if (iB > iM) bloqueantes.push(`${x.id} (MAL, pos ${iM + 1}) imprime como «Forma correcta» la frase de ${items[iB]!.id}, que es la carta ${iB + 1}: el ítem se regala`);
}
```

Y en `pares-minimos.ts`, la invariante que evita la fuga de raíz:

```ts
// El `repair` de un MAL ES la frase del BIEN de su par, y la tarjeta lo
// imprime (`GrammaticalityJudgmentCard.tsx:57`). Si el MAL va delante, su
// feedback contesta el BIEN. Medido en el lote 13: 2 de 4 ítems regalados.
// Y OJO: con 2 pares NO existe ningún orden que cumpla esto y no sea
// resoluble por posición — el suelo del método son 3 pares.
function sinFugaDeRepair(orden: ItemGenerado[]): boolean {
  const vistos = new Set<string>();
  for (const x of orden) {
    if (x.verdict) { vistos.add(x.parId); continue; }
    if (!vistos.has(x.parId)) return false;   // el MAL va antes que su BIEN
  }
  return true;
}
```

### 6.4 Dos contradicciones del documento, por cadenas hardcodeadas

El generador no se actualizó del todo al pasar de 3 pares a 2, y el
documento publicado se contradice:

- `lote13-c2-borde.ts:183` — `L.push(\`## \\\`${C}\\\` — 6\`)`, con el 6
  literal. Resultado, `2026-09-04-lote13-c2-borde.md:118`: **la cabecera de
  la sección dice «— 6» y debajo hay 4 ítems.** Debe ser `${items.length}`.
- `lote13-c2-borde.ts:171` —
  `${p.id === 'P-02' ? 'las dos MALAS' : 'las dos BUENAS'}`, condicionado al
  id. Resultado, `…-lote13-c2-borde.md:54`: **imprime «las dos BUENAS» para
  P-03**, cuando el propio documento, dos párrafos antes, explica que la
  glosa de P-03 **no** es neutra y que sale 3/4. La columna debe derivarse de
  `GLOSAS`, no de una condición sobre el id.

No es cosmética: la tabla resumen es lo que un revisor futuro leerá como
«la glosa está neutralizada», que es justo lo que el round acaba de
desmentir.

---

## 7 · Bloqueantes (lista cerrada)

| # | bloqueante | evidencia |
|---|---|---|
| **B1** | **A N = 4 el gate binomial no puede rechazar nada.** `pValor(4,4) = 0,0625 > 0,05`: un rasgo que prediga el lote entero sin un fallo sale «no sospechoso». «Preflight limpio» a este tamaño es una tautología. El suelo del método es **N = 5**, y certificar de verdad pide **N = 12** (potencia 0,80 sólo desde el 87 %). | §0 |
| **B2** | **El espejo del español resuelve el lote: 4/4 (100 %).** No es de estas frases: en un punto `trampa` el MAL **es** la opción española por definición de la clase, y los pares no lo neutralizan porque mira el hueco. Lo declara el propio generador en su campo `rasgo`, 2 de 2. Tasa base: ningún lote publicado pasa del 70 % de ítems `trampa`; éste está al 100 % con un punto. | §1 |
| **B3** | **La posición resuelve el lote: 4/4, mecánico.** El patrón es `MMBB` y «posición ≥ 3 ⇒ BIEN» acierta el 100 %. La batería tiene un rasgo de posición y no lo ve (mide **paridad**, no bloque) y `evaluarMolde` tampoco (racha 2, equilibrio 0, solape no calculado). | §2 |
| **B4** | **Fuga por el `repair`: 2 de 4 ítems (50 %).** Los dos MAL van delante de sus BIEN y la tarjeta imprime el `repair`, que **es** la frase del BIEN. El alumno contesta GJ-03 y GJ-04 leyendo el feedback de GJ-01 y GJ-02. Inédito: 0 de los 160 juicios publicados tienen esa propiedad. | §3.3 |
| **B5** | **Con dos pares el problema no tiene solución: 0 de los 24 órdenes son a la vez sin fuga y no resolubles por posición.** No es esta baraja: es que a N = 4 el espacio de diseño está vacío. Desde tres pares hay 48 órdenes válidos. **El lote de cuatro no se arregla barajando.** | §0, §3.3 |
| **B6** | **P-03: el `repair` no corrige el calco, cambia la proposición.** «atrás meu» calca «detrás mío» = *detrás de mí* (persona), cuya corrección europea es «**atrás de mim**»; «atrás do meu» es «detrás **del** mío» = detrás de mi coche. Las dos glosas que el documento imprime no son la misma frase. El ítem enseña una equivalencia falsa. Arreglo de 5 caracteres en §3.2. | §3.2 |
| **B7** | **P-02: el arreglo del «ao lar» fabricó un defecto compartido nuevo.** «esta manhã … **já** estava a dormir» — con una visita de mañana lo que se dice es «**ainda** estava a dormir». Está en los dos miembros, así que es invisible para `verificarPar()` y para la batería. Tercera vez que arreglar un defecto fabrica otro. | §3.1 |
| **B8** | **Nivel: 0 de 4 ítems son C2 y ninguno es C1** (B1 = 1, A2 = 3), en un lote que se declara C2. Al morir P-01 el lote perdió sus dos únicos ítems de C1. La versión C2 de P-02 está escrita en su propia `explicacionBien` («amo-te a ti», «viu-a a ela») y no se ha usado. | §5 |
| **B9** | **Cobertura: 0 de las 5 sub-áreas que el currículo nombra**, y 0 ítems de la mitad «y al revés» — que es exactamente la que rompería B2. Publicar cuatro fija en el corpus el lado del punto que produce el atajo y ninguno del que lo mata. Además, el documento se contradice a sí mismo por dos cadenas hardcodeadas: la cabecera dice «— 6» con 4 ítems, y la tabla dice de P-03 «las dos BUENAS» cuando el propio doc explica que no lo son. | §4, §6.4 |

**Avisos** (no bloquean, al backlog):

- `pValor` da la p de **una** cola mientras la batería toma la mejor de las
  **dos** direcciones: la p impresa está a la mitad. A N = 16 convierte 12/16
  de 0,038 (bloqueante) en 0,077 (no significativo). Revisar los lotes de 16
  ya certificados.
- El gate de virginidad indexa de las lecciones **sólo** `<Example pt="…">`;
  el `<Rule>` —donde este proyecto pone los contraejemplos en prosa— no se
  indexa. Es lo que dejó pasar el P-01 publicado en el MDX de `b12` hasta que
  lo vio un humano.
- La tabla de solape del molde compara con **0 de los 11 lotes publicados**
  (`if (L < 8) continue`) e imprime una cabecera vacía que se lee como
  «comprobado».
- `SEPARACION_MINIMA = 3` se relaja a 1 por debajo de N = 12
  (`separacionExigible`), justo donde más falta hace.
- P-03 no ha pasado por `variantStatus`/`variant-guard`: *atrás meu* es
  coloquialismo vivo en PT-BR y la app sirve las dos variantes.
- El currículo (`curriculum.ts:361`) nombra como sub-áreas del punto dos
  cosas que el round acaba de probar falsas —la duplicación del clítico y el
  neutro «lo»—: hay que reescribir la descripción del punto.

---

## 8 · Qué está bien, y es específico

Sin esto no se puede decidir qué se conserva, y aquí hay bastante.

1. **La salida del preflight REPRODUCE, carácter a carácter**, y el sello de
   rev es el del repo. Verificado con un diff programático contra la salida
   pegada en el documento: `¿la salida pegada REPRODUCE? SÍ`. Es la primera
   vez en cuatro rounds; la cicatriz de E2#11 está cerrada.
2. **Los pares mínimos matan de verdad los atajos de superficie, y lo he
   intentado romper a lo bruto.** 666 rasgos mecánicos a N = 4 —cada token,
   cada n-grama de 2 a 6 caracteres, cada bigrama, umbrales de longitud, de
   posición, paridades— y los únicos dos que llegan al 100 % son artefactos
   del **orden** y de la **aritmética**, no del texto. (A N = 6, con la
   versión de tres pares, el mismo barrido con 998 candidatos daba **cero**.)
   La promesa de `pares-minimos.ts` se cumple contra mil candidatos que nadie
   había probado. Lo que queda es la familia semántica, que se ataca con
   contenido, no con barajado.
3. **La compensación de la longitud está bien vista y hay que preservarla.**
   Que P-02 y P-03 vayan en direcciones opuestas (MAL más largo / MAL más
   corto) deja en `2/4` dos rasgos cuyo **techo** es `4/4`, o sea que podrían
   haber disparado. Lo mismo con «lleva preposición contraída». No es suerte
   y es lo único que impide repetir la cicatriz fundacional del lote 10.
4. **El round de gramática hizo lo que había que hacer, y de la manera
   correcta.** Mató P-01 con evidencia de corpus, encontró que la falsedad
   estaba **publicada** en la lección, la corrigió allí, y de paso corrigió
   una segunda del mismo tipo. Y el aviso nuevo que dejó en el MDX —«a C2 la
   trampa ya no es equivocarse de forma: es enunciar una regla más dura de lo
   que la lengua aguanta»— es la mejor línea de todo el bloque 12.
5. **La `explicacionBien` de P-02 declara su propia excepción.** «Sí la
   conserva con pronombre tónico —*amo-te a ti*, *viu-a a ela*— y en fórmulas
   con Deus: no es que le falte la preposición, es que no la usa con un
   nombre.» Es la corrección del absoluto que mató a P-01, aplicada **a
   tiempo** en el par vecino. Y contiene, ya escrito, el ítem de C2 que al
   lote le falta (§5b).
6. **La verificación contra el corpus del banco es trabajo de primera.** Tres
   greps que «parecían tumbar los tres pares» y los tres falsos positivos,
   diagnosticados leyendo la frase entera. Lo he re-corrido con un patrón más
   ancho: 33 candidatos de dativo duplicado en el corpus publicado, y el único
   que parecía real —`b2c2-med-10`, «o mar **cabe-lhe ao fundo**»— también es
   falso positivo («ao fundo» es adjunto de lugar). «Un grep da candidatos, no
   veredictos», aplicado entero.
7. **La regla de corte se aplicó dos veces y las dos con razón.** Nueve MAL
   muertos en cuatro sesiones por publicar formas atestiguadas, y este lote es
   el primero que corta **antes** en vez de después. El error no está en
   cortar: está en publicar el corte.
8. **El diagnóstico del mapa sobre C2 es correcto y verificado.** Los ocho
   puntos de `b12` están en `curriculum.ts` y `formato-punto.ts` los
   clasifica: cinco `pragmatico`, uno `coincide`, uno `sin-equivalente` y
   **exactamente uno `trampa`**. La afirmación del documento se sostiene. Su
   ironía —que el único punto de C2 que admite juicios es justo el que a solas
   los invalida— es el hallazgo de este round, y sale de haber hecho **bien**
   el mapa, no de haberlo hecho mal.

---

## 9 · Qué haría yo, en orden

1. **No publicar.** El banco al banco.
2. **Rehacer P-03** con la proposición constante: BIEN «atrás de mim» / MAL
   «atrás meu» (§3.2). Cierra B6, y de paso pasa el par por `variantStatus`.
3. **Arreglar P-02**: `já` → `ainda` (o `esta manhã` → `ontem à noite`), y
   etiquetarlo como **reenseñanza declarada**, no como cobertura de C2.
4. **Escribir el par de C2 que P-02 ya lleva dentro**: *«Viu-me **a mim**,
   não **a ti**»* frente a su versión sin `a`. Sube el nivel y **rompe el
   espejo**, que son B2 y B8 de un golpe.
5. **Llegar a seis pares**, la mitad de la dirección «y al revés» (infinitivo
   flexionado, ênclise sobre finito, el `obedecer aos avós` de
   `b2c2-gj-l10-12`). Con eso el espejo deja de ser 100 % y la batería
   recupera la capacidad de hablar.
6. **En el código, por orden de coste/beneficio:**
   `separablePorPosicion` (4 líneas, caza B3) · la invariante «el BIEN nunca
   después de su MAL» en `expandir()` (caza B4) · el suelo de N en el
   preflight (caza B1) · `monocultivoDeClase` (caza B2) · el indexado del
   `<Rule>` en el gate de virginidad · las dos cadenas hardcodeadas del
   generador (§6.4) · la p a dos colas.
7. **Reescribir la descripción de `b12-borde-gramaticalidad`** en
   `curriculum.ts`: dos de sus cinco sub-áreas resultaron falsas en este
   round.
