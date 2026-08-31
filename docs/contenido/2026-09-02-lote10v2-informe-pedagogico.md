# Lote 10 B2C2 v2 — revisión PEDAGÓGICA (diseño del lote)

Revisor #2 (ángulo pedagógico). No he consultado al revisor lingüístico.
Doc auditado: `/Users/lalo/idiomas/portugues-app/docs/contenido/2026-09-02-lote10-b2c2-v2.md`

**Veredicto: NO PUBLICAR.** Dos bloqueantes duros (un atajo nuevo a 13/16 p=0,011
y un choque de virginidad de 0,617 que el gate no ve **por culpa del arreglo de
la v1**), más cuatro ítems que sobran por nivel o por repetición.

---

## 0 · Primero: ¿me fío del preflight pegado?

Corrido por mí:

```
$ npx tsx scripts/preflight-lote.ts docs/contenido/2026-09-02-lote10-b2c2-v2.md
$ diff <(sed -n '44,106p' <doc>) <(salida real)
IDENTICO: la salida pegada = la salida real
EXIT=0
```

**La salida pegada es fiel.** Es la primera vez en esta serie que un número
declarado en el doc resiste la reproducción: la enfermedad de la v1 (cifras
inventadas a mano) está curada. Eso hay que decirlo.

**Pero la salida ya está caducada.** `scripts/lib/atajos.ts` cambió DURANTE esta
auditoría (`mtime=2026-08-31 16:20:59`): otra sesión añadió el rasgo `posición
par en el lote (alternancia mecánica)` y el campo `pos`. La batería real de hoy
tiene **10 rasgos**; la tabla pegada en el doc tiene **9**. El veredicto no
cambia (el rasgo nuevo sale 10/16, p=0,227), pero:

> **La salida pegada no lleva ninguna marca de QUÉ batería la produjo.** Una
> tabla de atajos sin el hash/rev de `atajos.ts` al lado es la misma clase de
> objeto que «12 mediaciones contadas por script» del lote 6: un número sin su
> comando. El preflight debe imprimir el rev de `scripts/lib/atajos.ts` y el
> conteo de rasgos en su cabecera.

---

## 1 · BLOQUEANTE — el atajo que la batería no tiene: **el arranque de la frase**

La batería mide nueve/diez rasgos y **todos son bolsa-de-palabras**: ¿está esta
palabra?, ¿está esta marca?, ¿cuántos caracteres? Ninguno mira **dónde** están
las cosas. El rasgo nuevo del `pos` es el primer rasgo estructural, y es de
posición-en-el-lote, no de posición-dentro-de-la-frase.

Medido con `medirRasgo`/`pValor` del propio repo (fórmula acierto-sobre-N):

| rasgo | acierto | % | dirección | presente en | p | |
|---|---:|---:|---|---:|---:|:-:|
| **★ arranca con algo que NO es el verbo (adjunto/sujeto/conjunción antepuestos)** | **13/16** | **81 %** | presente⇒MAL | 7 | **0.011** | **BLOQUEA** |
| la primera palabra es adverbio/preposición/conjunción (adjunto antepuesto) | 12/16 | 75 % | presente⇒MAL | 4 | 0.038 | **BLOQUEA** |
| construcción sin equivalente literal en español (hei de/costumar/ficar a/ir+ger/fut. conj.) | 11/16 | 69 % | presente⇒BIEN | 5 | 0.105 | |
| contiene un clítico, con o sin guion | 10/16 | 63 % | presente⇒BIEN | 10 | 0.227 | |
| contiene una forma de conjuntivo | 10/16 | 63 % | presente⇒MAL | 4 | 0.227 | |
| longitud en caracteres POR ENCIMA de la mediana | 10/16 | 63 % | presente⇒BIEN | 6 | 0.227 | |
| contiene «em/no/na» delante de sustantivo de lugar | 10/16 | 63 % | presente⇒MAL | 10 | 0.227 | |
| contiene subordinada con «que» | 9/16 | 56 % | presente⇒MAL | 7 | 0.402 | |
| contiene «não» | 9/16 | 56 % | presente⇒BIEN | 3 | 0.402 | |
| termina en determinante + sustantivo | 9/16 | 56 % | presente⇒MAL | 5 | 0.402 | |
| contiene dos comas o más | 9/16 | 56 % | presente⇒BIEN | 1 | 0.402 | |
| contiene nombre propio | 8/16 | 50 % | presente⇒BIEN | 2 | 0.598 | |
| contiene numeral / expresión de hora | 8/16 | 50 % | presente⇒BIEN | 2 | 0.598 | |
| contiene infinitivo tras preposición | 8/16 | 50 % | presente⇒BIEN | 4 | 0.598 | |
| primera mitad del lote | 8/16 | 50 % | presente⇒BIEN | 8 | 0.598 | |
| contiene «à/às» (crase) | 8/16 | 50 % | presente⇒BIEN | 8 | 0.598 | |

`(binomial N=16: 11⇒0.105 · 12⇒0.038 · 13⇒0.011 · 14⇒0.002; SOSPECHOSO=0.05)`

### El desglose ítem a ítem — la regla es «¿empieza por el verbo? → BIEN»

```
GJ-01 · arranque «Ontem»    · rasgo=SÍ ⇒ predice MAL  · real MAL  · ACIERTA
GJ-02 · arranque «Se»       · rasgo=SÍ ⇒ predice MAL  · real MAL  · ACIERTA
GJ-03 · arranque «Costumo»  · rasgo=no ⇒ predice BIEN · real BIEN · ACIERTA
GJ-04 · arranque «Espero»   · rasgo=no ⇒ predice BIEN · real MAL  · falla
GJ-05 · arranque «Hei»      · rasgo=no ⇒ predice BIEN · real BIEN · ACIERTA
GJ-06 · arranque «Fiquei»   · rasgo=no ⇒ predice BIEN · real BIEN · ACIERTA
GJ-07 · arranque «Na»       · rasgo=SÍ ⇒ predice MAL  · real MAL  · ACIERTA
GJ-08 · arranque «A»        · rasgo=SÍ ⇒ predice MAL  · real BIEN · falla
GJ-09 · arranque «Ele»      · rasgo=SÍ ⇒ predice MAL  · real MAL  · ACIERTA
GJ-10 · arranque «Deram-me» · rasgo=no ⇒ predice BIEN · real BIEN · ACIERTA
GJ-11 · arranque «Chegámos» · rasgo=no ⇒ predice BIEN · real MAL  · falla
GJ-12 · arranque «Os»       · rasgo=SÍ ⇒ predice MAL  · real MAL  · ACIERTA
GJ-13 · arranque «Repara»   · rasgo=no ⇒ predice BIEN · real BIEN · ACIERTA
GJ-14 · arranque «Entrei»   · rasgo=no ⇒ predice BIEN · real BIEN · ACIERTA
GJ-15 · arranque «Quando»   · rasgo=SÍ ⇒ predice MAL  · real MAL  · ACIERTA
GJ-16 · arranque «Casou-se» · rasgo=no ⇒ predice BIEN · real BIEN · ACIERTA
```

Tabla 2×2: presente **6 MAL / 1 BIEN** · ausente **2 MAL / 7 BIEN**.
Fisher exacto a dos colas **p = 0,041**.

### La forma FUERTE: el adjunto antepuesto es 4/4 MAL, 0/8 BIEN

De las cuatro frases que abren con un adjunto o una subordinada antepuesta
—«**Ontem à noite**…» (01), «**Se eu seria**…» (02), «**Na segunda-feira**…»
(07), «**Quando eu chegar em casa esta noite,**…» (15)— **las cuatro son MAL.
Ninguno de los ocho BIEN abre así.**

Y de dónde salió, dicho por el propio documento:

> «**Las longitudes se equilibran por diseño**: los MAL nuevos son tan largos
> como los BIEN, **con su propia coleta**.»

Ahí está el mecanismo. Para matar el atajo de la LONGITUD de la v1 (13/16) se
alargaron los MAL, y se los alargó **por delante**, con complementos
circunstanciales. La longitud queda neutralizada — verificado, 10/16 p=0,227,
eso es verdad — y en su lugar aparece un atajo del mismo tamaño exacto: **13/16,
p=0,011.** Es literalmente la cicatriz que la skill ya tenía escrita:

> «si añades un rasgo por el bien de los MAL —un adverbio temporal, un contexto,
> una longitud— tiene que aparecer también en los BIEN.»

Se cumplió para el adverbio temporal (la batería lo confirma: `lleva marcador
temporal` = 8 presentes repartidos, 10/16) pero **no para su POSICIÓN**.

### Control: ¿no será que todos los lotes son así?

`arranque no verbal` medido sobre los 146 juicios ya publicados, con una lista
de clase cerrada fijada de antemano (artículos, preposiciones y contracciones,
pronombres sujeto, conjunciones subordinantes, 6 adverbios temporales):

| lote publicado | N | acierto | % | dirección | p |
|---|---:|---:|---:|---|---:|
| l1 | 20 | 10/20 | 50 % | presente⇒BIEN | 0.588 |
| l2 | 20 | 12/20 | 60 % | presente⇒MAL | 0.252 |
| l3 | 20 | 14/20 | 70 % | presente⇒MAL | 0.058 |
| l4 | 20 | 12/20 | 60 % | presente⇒MAL | 0.252 |
| l5 | 20 | 13/20 | 65 % | presente⇒MAL | 0.132 |
| l6 | 10 | 6/10 | 60 % | presente⇒MAL | 0.377 |
| l7 | 10 | 7/10 | 70 % | presente⇒MAL | 0.172 |
| l8 | 10 | 7/10 | 70 % | presente⇒BIEN | 0.172 |
| l9 | 10 | 6/10 | 60 % | presente⇒MAL | 0.377 |
| **TODOS los b2c2 publicados** | 146 | **84/146** | **58 %** | presente⇒MAL | 0.0409 |

**LOTE 10 v2 (candidato), misma lista mínima: 13/16 = 81 % · p=0.011**

Hay un sesgo basal real del 58 % (una frase con error a menudo necesita contexto
delante), pero ningún lote publicado pasa del 70 %, y contra esa tasa base el
candidato sigue siendo alto: **P(X≥13 | n=16, p=0,575) = 0,044**. No es un
artefacto de la lengua: es de este lote.

### La corrección concreta a `scripts/lib/atajos.ts`

Añadir a `RASGOS` (probado: con esto el preflight sale con **EXIT=1**):

```ts
{
  // La batería nació ciega a la POSICIÓN dentro de la frase: todos los
  // rasgos eran bolsa-de-palabras. El lote 10 v2 mató el atajo de la
  // longitud alargando los MAL POR DELANTE, con adjuntos antepuestos —
  // y los cuatro adjuntos antepuestos eran MAL, 0 de 8 BIEN. 13/16,
  // p=0,011: el mismo tamaño que el atajo que venía a arreglar.
  nombre: 'arranca con algo que no es el verbo (adjunto/sujeto/conjunción antepuestos)',
  f: (x) => /^(o|a|os|as|um|uma|uns|umas|no|na|nos|nas|do|da|dos|das|ao|aos|à|às|num|numa|em|de|com|para|por|sem|entre|sobre|se|que|quando|enquanto|embora|porque|como|eu|tu|ele|ela|nós|vós|eles|elas|este|esta|esse|essa|aquele|aquela|meu|minha|teu|tua|seu|sua|ontem|hoje|amanhã|agora|depois|antes|já|ainda|sempre|nunca|logo|então|mas|e|também|mesmo|todos|todas)$/i
    .test(x.sentence.trim().split(/[\s,;.!?]+/)[0] ?? ''),
},
```

Salida del preflight con el parche (copia en scratchpad, el repo no se tocó):

```
| rasgo | acierto | dirección | presente en | p |
| arranca con algo que no es el verbo … ⚠ | **13/16** (81 %) | presente⇒MAL | 7 | 0.011 |
| posición par en el lote (alternancia mecánica) | **10/16** (63 %) | presente⇒MAL | 8 | 0.227 |
| más corta que la mediana (palabras) | **10/16** (63 %) | presente⇒MAL | 6 | 0.227 |
…
**1 BLOQUEANTES — el round NO se abre:**
- atajo «arranca con algo que no es el verbo (adjunto/sujeto/conjunción antepuestos)»:
  acierta 13/16 (p=0.011) — se resuelve el lote sin saber portugués
EXIT=1
```

---

## 2 · BLOQUEANTE — la coleta que arregló el atajo **cegó el gate de virginidad**

Esto es lo más grave del documento, y no aparece en su preflight.

Existe publicado, en `b8.json`, este juicio de gramaticalidad:

```
b2c2-gj-l1-02  grammaticality_judgment  lesson=b8-l1-conectores-subordinadas-adverbiais
{"sentence": "Cheguei em casa muito tarde.",
 "verdict": false,
 "repair":   "Cheguei a casa muito tarde.",
 "explanationEs": "'Chegar' de movimiento rige A en el estándar europeo — y con
  la casa de uno, sin artículo: 'chegar a casa'. Este error NO viene del español
  (que también dice 'llegar A casa'): es interferencia del portugués de Brasil
  ('cheguei em casa', normal allí), que se pega por las series."}
```

Y el candidato GJ-15 es: «Quando eu chegar **em casa** esta noite, ligo-te…» →
repair «Quando eu chegar **a casa** esta noite, ligo-te…».

Mismo lema, misma preposición, mismo complemento (`casa`), mismo error, mismo
repair, misma explicación. **GJ-15 es `b2c2-gj-l1-02` con una subordinada
delante y una coleta detrás.** El preflight no lo dice porque el gate no lo ve.
Medido con `scripts/lib/virginidad.ts` (umbral del código = 0,34):

```
## GJ-15 (tal cual)
   top del gate: b2c2-gj-l2-10@0.446  0bdb4c36@0.351  00f673de@0.35
   NO ve (bajo umbral): b2c2-gj-l1-02, …

## GJ-15 SIN la coleta  («Cheguei em casa esta noite.» / «Cheguei a casa esta noite.»)
   top del gate: b2c2-gj-l1-02@0.617   3df42b79@0.423   1d7f9747@0.404
   ✓ ve a b2c2-gj-l1-02 — 0.617
```

**0,617.** El preflight bloquea a `>= 0.5`
(`if (h.score >= 0.5) bloqueantes.push(…)`). O sea:

> **La coleta que se añadió para matar el atajo de la longitud hundió un choque
> BLOQUEANTE de 0,617 por debajo del umbral de 0,34 y lo volvió invisible.**
> El arreglo de la v1 desactivó el gate que había cazado el fallo de la v1.

Esto es un hallazgo sobre el GATE, no sólo sobre el lote: el solape IDF se diluye
con el relleno, exactamente igual que se diluye en las mediaciones (la cicatriz
«el gate NO protege a las MEDIACIONES», medida en el lote 9 con 0 pares para las
doce MED). Aquí se ha demostrado que **también se diluye en los juicios en cuanto
se les pone contexto**, que es justo lo que este lote hace por diseño.
Contramedida obligatoria: normalizar antes de indexar (frase reducida al núcleo
verbo + complemento regido), o correr el gate una segunda vez sobre el par
`(sentence, repair)` **truncado a la ventana donde sentence y repair difieren**.

### El mismo agujero, cinco veces más

El gate está ciego a los otros cuatro puntos ya publicados de este lote:

| candidato | ya publicado | qué comparten | ¿lo ve el gate? |
|---|---|---|:-:|
| **GJ-15** «chegar em casa» MAL | `b2c2-gj-l1-02` «Cheguei em casa muito tarde.» MAL | régimen, error, repair, complemento | **NO** (0,617 al desnudarlo) |
| **GJ-11** «Chegámos em Lisboa» MAL | `b2c2-gj-l1-02` (mismo punto) · `b2c2-med-32` rúbrica: *«¿Repone la regência europea "cheguei em casa" → "cheguei a casa"?»* · `b2c2-med-43` modelAnswer BR: «Quando chegar em casa te ligo» | el punto entero, con la respuesta escrita en una rúbrica publicada | **NO** (0 pares) |
| **GJ-06** «Fiquei a pensar…» BIEN | `b2c2-gj-l9-07` «**Fiquei a** saber **ontem** que ela se mudou…» BIEN · `b7-ep-05` «ficou a esperar» · `8f56cd1f` «ficou a fazer barulho» | construcción, veredicto, verbo «Fiquei a», hasta el «ontem» | **NO** |
| **GJ-05** «Hei de te contar…» BIEN | `b2c2-gj-l3-03` «**Hei de** visitar o Porto um dia.» BIEN | construcción y veredicto | **NO** (0 pares) |
| **GJ-08** «vai melhorando **aos poucos**» BIEN | `10c85d3c` «Ele **vai** entrando **aos poucos** em confiança.» · `c494839d` «vamos resolvendo» · `e2d0dde2` «foi descobrindo **aos poucos**» | ir+gerúndio Y la misma colocación adverbial | **NO** |
| **GJ-01** «não disse-me» MAL | `c626c3c9` error_correction «**Não** diga**-me** isso» → «Não me diga isso» (`b8-coloc-proclise-negacao`) | la regla entera, error→repair | **NO** |

Seis de dieciséis candidatos repiten un punto ya publicado y **el gate no señala
ninguno**. Los nueve avisos que sí da (0,35-0,45) son todos ruido léxico
(«oficina», «ligo-te», «fiquei»); **ninguno de los nueve señala una repetición
real y ninguna de las seis repeticiones reales aparece en la lista.** El gate
está midiendo lo que no importa: precisión ~0/9.

Nota adicional: `b2c2-gj-l1-02` y los cinco de `b11-l2` llevan `concepts: []`.
El segundo eje del gate (comparar el PUNTO) está apagado para ellos. La skill lo
manda —«Declara `concepts` en cada ítem nuevo»— pero el corpus heredado no lo
tiene, y **sin backfill de `concepts` en los ítems viejos el eje del punto es
decorativo**. Eso hay que arreglarlo antes que este lote.

---

## 3 · La dieta: 7 de los 8 MAL se resuelven **desde el español**

Los MAL pasan el criterio literal de la skill —`lleva una palabra visiblemente
española` sale **0 presentes**, ni un lusismo a la vista, eso está bien hecho— y
sin embargo el lote sigue siendo resoluble sin portugués, por la puerta de al
lado: la **glosa literal al español**.

| ítem | glosa palabra por palabra | ¿español roto? | ¿hace falta portugués? |
|---|---|:-:|:-:|
| GJ-01 MAL | «Ayer por la noche no **dijo-me** nada…» | SÍ | no |
| GJ-02 MAL | «**Si yo sería** más joven…» | SÍ | no |
| GJ-04 MAL | «Espero que tu hermano **viene**…» | SÍ | no |
| GJ-07 MAL | «**Voy a llevar** el coche al taller…» | **NO — español perfecto** | **SÍ** |
| GJ-09 MAL | «…**sin que** nadie lo **vio**…» | SÍ | no |
| GJ-11 MAL | «**Llegamos en** Lisboa a las seis…» | SÍ | no |
| GJ-12 MAL | «Los críos **obedecen los** abuelos…» | SÍ | no |
| GJ-15 MAL | «Cuando **llegue en casa** esta noche…» | SÍ | no |

**7 de 8.** Y no lo digo yo: lo dicen las propias explicaciones del documento,
tres veces:

- GJ-02 — «**El español tampoco admite «si yo sería»**, así que aquí el calco no
  viene de la lengua materna sino de la simetría aparente entre las dos mitades.»
  Esa segunda mitad es una racionalización del autor: el alumno no razona sobre
  simetrías, oye «si yo sería» y lo rechaza.
- GJ-04 — ««Esperar que» rige conjuntivo en portugués **igual que en español**.»
- GJ-12 — «**no es un calco del español**: el español lleva *a* personal… y
  **empuja hacia la forma correcta**.» Un ítem cuya explicación dice que el L1
  del alumno le da la respuesta es un ítem que no mide nada.

Y el catálogo publicado dice lo mismo del cuarto: `b2c2-gj-l1-02`, sobre
«chegar em», explica que «este error **NO viene del español** (que también dice
"llegar A casa")».

**Aviso metodológico, para no repetir la cicatriz de E2#11: «7 de 8» NO es una
cifra de atajo** (no es acierto sobre N, es un conteo sobre los MAL). Es una
cifra de DIETA. Su versión acierto-sobre-N —«glosa rota ⇒ MAL»— sale entre
**10/16 (p=0,227)** y **12/16 (p=0,038)** según cómo se resuelvan dos glosas
discutibles (GJ-08 «aos poucos»→«a los pocos», GJ-10 «Diéronme os parabéns»).
Por eso **no la presento como bloqueante**: el bloqueante mecánico y reproducible
es el §1. Ésta es la razón pedagógica de fondo.

La skill pide «mínimo 3-4 MAL gramaticales donde TODAS las palabras sean
portuguesas». Se cumple a la letra (8/8). Pero el espíritu era «que no se
resuelva sin portugués», y ahí sólo **GJ-07** aguanta.

---

## 4 · ¿Es C1? Cuatro MAL sobran por fáciles

**GJ-04 «Espero que … vem» — el más flojo del lote, sobra.** Tenías razón en
sospechar. Es la primera regla de subjuntivo que se enseña, es idéntica en
español (`espero que venga` / `espero que venha`), las dos formas son cognadas
transparentes, y el corpus ya trae la construcción **34 veces**, incluida
`1d5ff8ff` (traducción «Espero que haya…» → «Espero que haja…»). No hay
absolutamente nada de C1 aquí. **Retirar.**

**GJ-02 «Se eu seria» — sobra.** Mismo diagnóstico: la prótasis con condicional
la rechaza cualquier hispanohablante desde A2 porque su lengua la rechaza igual.
El documento lo admite. **Retirar** o darle la vuelta a lo que sí es C1 en
portugués y no existe en español: el **futuro do conjuntivo** («se eu **for**…»,
«quando eu **chegar**…»), que es donde el hispanohablante se estrella de verdad
y que aquí sólo aparece como decorado en GJ-05 y GJ-15.

**GJ-09 «sem que ninguém o viu» — sobra, y además se autodelata.** «Sin que
nadie lo vio» es igual de malo en español. Y la explicación confiesa el
problema: «la propia frase trae el contraste delante: «como se fosse» ya está
bien puesto, así que **el ítem se resuelve comparando sus dos mitades**». Un
ítem que lleva su propia clave dentro no es un ítem difícil, es uno regalado.
**Retirar.**

**GJ-07 «vou a levar» — se queda, pero con reservas.** Es el único MAL invisible
a la glosa, y el argumento de la fosilización es bueno («sobrevive años»). Pero
el propio documento lo llama «**el error número uno** de un español hablando
portugués»: es contenido A2/B1 que sobrevive a C1, y como tal debería estar
formulado en un contexto donde el alumno avanzado dude — p. ej. contrastando el
`ir a + infinitivo` de **inminencia**, que la skill registra como existente
(«ir a + inf de inminencia existe»), contra el perifrástico. Tal como está, es
un ítem de B1 con frase larga.

**El desequilibrio de nivel es sistemático y va en una sola dirección**: todo el
contenido C1 del lote está en los BIEN (haver de, futuro do conjuntivo, ficar a
+ inf, ir + gerúndio, costumar, infinitivo pessoal) y todo el contenido B1 está
en los MAL. Eso no es sólo un problema de nivel — es la razón de que el rasgo
`construcción sin equivalente literal en español` prediga BIEN a 11/16 (p=0,105).
Está justo por debajo del umbral hoy; con dos ítems más del mismo corte, bloquea.
**Hace falta al menos un MAL cuyo error esté DENTRO de una construcción
genuinamente europea** (un `estar a + infinitivo` proyectado al futuro, un
`ficar a` mal construido, una mesóclise mal formada), no sólo BIEN que la
exhiban.

---

## 5 · Fugas: cinco, y dos de ellas graves

**GRAVE · GJ-11 → GJ-15.** Preguntaste por esto: sí, el segundo se resuelve
leyendo el primero, y el propio documento lo firma —«**Mismo régimen que el
anterior**»—. Son el mismo error (`chegar em` → `chegar a`), los dos MAL, con
cuatro ítems de separación. El alumno que ve la explicación de GJ-11 responde
GJ-15 sin leerla. Y como el punto ya está publicado (§2), lo correcto no es
elegir uno: **es retirar los dos** y quedarse, si acaso, con un régimen no
publicado.

**GRAVE · GJ-01 → GJ-10 y GJ-16.** La explicación de GJ-01 (el primer ítem del
lote) enuncia la regla completa de colocación: «La negación es atractor de
próclise… Es de las poquísimas reglas que no admiten discusión». A partir de
ahí, GJ-10 («Deram-me…» ênclise en afirmativa) y GJ-16 se contestan sin pensar.
GJ-16 es el caso de libro, porque **su trampa declarada ES lo que GJ-01
explicó**: «la trampa no es la preposición: es que el hispanohablante produce
«se casou», con próclise sin atractor que la justifique». Un ítem cuya dificultad
declarada la neutralizó la explicación del ítem 1. **Cortar**: o se mueve GJ-01
al final, o la explicación de GJ-01 se limita al caso de «não» sin enunciar el
sistema.

**MEDIA · GJ-05 → GJ-15.** «…«quando nos virmos» es futuro do conjuntivo,
obligatorio tras «quando» de futuro». GJ-15 abre con «Quando eu chegar…». El
alumno que leyó GJ-05 sabe que esa mitad está bien y le queda una sola cosa que
mirar. Reduce el espacio de búsqueda a la mitad.

**MEDIA · GJ-07 → GJ-13/GJ-14.** «Ojo: el «a» de «à oficina» sí va — ahí es la
preposición del complemento, contraída con el artículo» adelanta la sección B
entera (crase y contracción) tres ítems antes de que empiece.

**MENOR · GJ-13 y el andamio de la casa.** «**Repara na** camisola nova dele…».
La skill avisa de que «Repara» es la muletilla pegada a los modelos; barrido por
lema: `Repara/repare na` aparece en **4 ítems publicados** (`med-27`, `med-37`,
`med-44`, `med-129`), dos de ellos con la misma colocación «Repara na
diferença». No invalida el ítem, pero el arranque no es neutro: es la voz de la
casa.

---

## 6 · Redundancia y cobertura: la tabla de cabecera no cuadra

La tabla del documento dice:

| punto | antes | falta | tras el lote |
|---|---:|---:|---:|
| `b11-aspecto-tempo` | 3 | 9 | 12 |
| `b11-regencias` | 10 | 2 | 12 |

**Verificado el «antes» — el recuento del autor es CORRECTO**, y es un buen
trabajo: `concepts` declarados dan 3 y 5, pero por `lessonId` la lección
`b11-l2-regencias-que-traem` tiene diez ítems, cinco con `concepts: []`
(`gj-l4-08` preocupar-se com, `gj-l4-14` precisar de, `gj-l4-17` assistir a,
`gj-l4-18` esperar por, `gj-l4-20` dar por). 10 confirmado.

**Pero el «tras el lote» de la segunda fila es falso.** La sección B del
documento tiene **7 ítems** (GJ-10…GJ-16), no 2:

```
10 publicados + 7 del lote = 17,  no 12.
```

Cinco ítems de sobra sobre el objetivo declarado — y dos de ellos (GJ-11, GJ-15)
son el mismo régimen, ya publicado. **O la tabla está mal, o cinco ítems no
deberían estar en el lote.** Hay que decidirlo por escrito antes de publicar.

**Y la primera fila cuadra en aritmética pero no en contenido.** Los 9 ítems de
la sección A no son 9 de aspecto/tiempo:

| ítem | de qué es realmente |
|---|---|
| GJ-01 | **colocação pronominal** (`b8-coloc-proclise-negacao`) — no es aspecto ni tiempo |
| GJ-02 | modo (condicional vs imperfeito do conjuntivo) — fronterizo |
| GJ-03 | aspecto habitual (costumar) ✓ |
| GJ-04 | **modo** (conjuntivo tras «esperar que») — es subordinación, `b8` |
| GJ-05 | haver de + futuro do conjuntivo ✓ |
| GJ-06 | aspecto (ficar a + inf) ✓ — **ya publicado** |
| GJ-07 | perífrasis de futuro (ir + inf) ✓ |
| GJ-08 | aspecto (ir + gerúndio) ✓ — **ya publicado ×3** |
| GJ-09 | **modo** (sem que + conjuntivo) — no es aspecto ni tiempo |

Aspecto/tiempo de verdad: **5 de 9**, y dos de esos cinco repiten punto
publicado. El punto no llega a 12: llega a 3 + 5 = **8**, y neto de
repeticiones, a **6**. `b11-aspecto-tempo` **no queda cerrado**, que es lo que
el documento promete.

### El hueco obvio dentro del punto

Lo ya publicado con `b11-aspecto-tempo` son tres ítems: `é capaz de` (l5-01),
`andar a + infinitivo` (l5-05) y el **pretérito perfeito composto** (l5-10,
«Ontem tenho falado» → «Ontem falei»). Sumando los cinco nuevos válidos, el
punto cubre: é capaz de, andar a, perfeito composto, costumar, haver de, ficar
a, ir + inf, ir + gerúndio.

**Falta lo primero de la lista.** `estar a + infinitivo` —el buque insignia del
aspecto europeo, el punto n.º 2 del brief del lingüista— **no tiene ni un solo
juicio de gramaticalidad en todo el catálogo**. Sólo existe como
`multiple_choice` de b10 (`e6e74857`, «El progresivo 'estou fazendo' es típico
de Brasil…»), que es un ítem de variación diatópica, no de aspecto. Y con él
falta su corolario, que el brief nombra explícitamente como calco a cazar: **el
progresivo europeo NO proyecta al futuro** («está a fazer na sexta»). Ése sería
un MAL genuinamente C1, invisible a la glosa española (la glosa da «está
haciendo el viernes», que en español también chirría pero mucho menos), y en
construcción europea — exactamente lo que al lote le falta según el §4.

Segundo hueco menor: **mais-que-perfeito simples** (`fizera`) frente al
compuesto, que no aparece en ninguna parte.

En regências, si de verdad hacen falta sólo 2, los candidatos vírgenes obvios
son los que el catálogo NO tiene: `assistir a` está (l4-17), `precisar de`
está (l4-14), `sonhar com` está (l7-10), `perguntar a` está (l9-10)…
**`obedecer a` (GJ-12) sí es virgen — 0 ocurrencias de «obedec» en todo el
corpus.** Ése se queda. `entrar em` + `bater à porta` (GJ-14) y `reparar em`
(GJ-13) también son vírgenes como juicio. Con GJ-12, GJ-13 y GJ-14 la fila
regências se cierra sobradamente; GJ-10, GJ-11, GJ-15 y GJ-16 son el excedente.

---

## 7 · El molde, verificado contra la tabla (no contra lo que el doc afirma)

Patrón real recomputado del documento: `MMBMBBMBMBMMBBMB`.

| criterio de la skill | exigencia | candidato | ¿pasa? |
|---|---|---|:-:|
| ratio | ~mitad y mitad | **8 BIEN / 8 MAL**, desequilibrio 0 | ✔ |
| rachas | ≤ 3 | racha máxima **2** | ✔ |
| última MAL cerca del final | pos 19-20 de 20 ⇒ **15-16 de 16** | **posición 15** (el 16 es BIEN) | ✔ (al filo) |
| alternancia mecánica | prohibida | rasgo `posición par` = 10/16, p=0,227 | ✔ |
| prefijo de CUATRO no visto | — | `MMBM` | ✔ |

Los prefijos publicados, extraídos de los JSON (no de la lista de la skill):

```
lote l1: BMMB · últimaMAL=pos18/20      lote l6: BBBM · pos10/10
lote l2: BMBM · pos19/20                lote l7: MMMB · pos9/10
lote l3: MBBM · pos20/20                lote l8: BBMB · pos9/10
lote l4: MMBB · pos19/20                lote l9: BMBB · pos10/10
lote l5: BBMM · pos20/20
candidato: MMBM · pos15/16
```

La lista de quemados de la skill (MBMM del piloto + los nueve publicados)
coincide exactamente con lo que hay en los JSON. **`MMBM` es virgen. El molde
pasa entero.** Ojo al contador: con `MMBM` gastado quedan **cinco** prefijos de
cuatro (`MBMB`, `MBBB`, `BMMM`, `BBBB`, `MMMM`), y tres de ellos son rachas de
3-4 que la propia regla de rachas prohíbe. **El criterio del prefijo se agota en
dos lotes, no en el 15 como dice la skill.** Conviene cambiarlo ya.

---

## 8 · Qué está bien (específico)

- **El preflight pegado es reproducible byte a byte.** Es la corrección real del
  fallo de proceso de E2#11 y hay que reconocerla.
- **El atajo de la longitud está muerto y bien muerto:** 13/16 → **10/16
  (p=0,227)** en palabras y en caracteres, medido, no afirmado.
- **`lleva una palabra visiblemente española`: 0 presentes.** Cero lusismos
  léxicos. El lote no es «A2 disfrazado» por esa vía.
- **El recuento de `b11-regencias` = 10 es correcto** y encontrarlo (5 declarados
  + 5 con `concepts: []` bajo el `lessonId`) es exactamente el trabajo que la
  v1 no hizo.
- **Las cinco retiradas de la v1 están bien argumentadas**, y el criterio
  invocado es el correcto: un MAL tiene que afirmar que la otra forma está mal.
- **GJ-12 (`obedecer a`) es virgen de verdad**: 0 ocurrencias de `obedec` en los
  2.431 ítems. Y su explicación reescrita ya no miente sobre la dirección del
  calco.
- **GJ-08 es pedagógicamente valioso** como contraejemplo declarado («impide leer
  la regla como "en portugués europeo nunca hay gerundio" — una regla que, así
  enunciada, es falsa»). Eso es hedge con verdad, tal como manda la skill. El
  problema es que el punto ya está publicado, no cómo está escrito.
- El molde pasa los cinco criterios, verificados contra los JSON.

---

## 9 · Lo que hay que cambiar **sí o sí** antes de publicar

1. **Añadir el rasgo del arranque a `scripts/lib/atajos.ts`** (código en §1) y
   volver a correr el preflight. Hoy sale **EXIT=1**. Sin este rasgo en la
   batería el fallo se repite en el lote 11.
2. **Rehacer los MAL para que el adjunto antepuesto no sea marca de MAL.**
   La cuenta que hay que igualar: hoy 4 MAL / 0 BIEN abren con adjunto o
   subordinada. O se les quita la coleta delantera a GJ-01/07/15 y se les pone
   detrás, o se le pone delante a tres BIEN. Objetivo: ≤ 12/16 en el rasgo.
3. **Retirar GJ-11 y GJ-15.** El punto (`chegar a` vs `chegar em`) ya está
   publicado como juicio (`b2c2-gj-l1-02`, 0,617 al desnudar GJ-15), está en la
   rúbrica de `b2c2-med-32` y en el modelo de `b2c2-med-43`. Además son el mismo
   ítem dos veces, con fuga confesa.
4. **Retirar GJ-04, GJ-02 y GJ-09** por nivel: los tres se resuelven desde el
   español y GJ-09 lleva la clave dentro de la frase.
5. **Resolver GJ-06, GJ-05, GJ-08 y GJ-01** como repeticiones de punto ya
   publicado (§2). O se retiran, o se declara por escrito en el doc que son
   reenseñanza deliberada de un punto anterior refinado en C1 —la skill lo
   permite— **con el id del publicado al lado**. Lo que no vale es que pasen por
   descuido, que es lo que pasó.
6. **Cortar la fuga GJ-01 → GJ-10/GJ-16**: la explicación de GJ-01 no puede
   enunciar el sistema de colocación entero si tres ítems posteriores dependen de
   él. Y cortar GJ-05 → GJ-15 (moot si se aplica el punto 3).
7. **Arreglar la tabla de cabecera.** `b11-regencias`: 10 + 7 = 17, no 12.
   Declarar el objetivo real o recortar. Y **corregir la fila de
   `b11-aspecto-tempo`**: con 4 de los 9 ítems siendo modo o colocação, el punto
   no cierra en 12.
8. **Meter al menos un MAL en construcción europea** —el candidato natural es
   `estar a + infinitivo` proyectado al futuro («está a fazer na sexta»)—, que
   es a la vez el hueco de cobertura más obvio del punto y el único tipo de ítem
   que sube la dieta por encima del 1/8 actual.
9. **Que el preflight estampe el rev de `scripts/lib/atajos.ts`** en su cabecera.
   La batería cambió durante esta auditoría y la salida pegada quedó obsoleta sin
   que nada lo indicara.
10. **Antes del round, correr el gate de virginidad también sobre la frase
    DESNUDA** (núcleo verbo + complemento regido, sin adjuntos ni coleta).
    Es la única forma de que vuelva a ver lo que el relleno le esconde, y hoy es
    la diferencia entre 0,617 y 0,00.
