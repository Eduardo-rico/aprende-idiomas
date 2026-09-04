# La prosa que lee el alumno — auditoría de los `objectives` y los `title`

**2026-09-04 · rama `variante/pt-pt-como-base` · SOLO LECTURA (no se tocó ni un fichero de contenido)**

Motivo: `lib/data/loaders.ts:557` sirve `lesson.objectives[0]` como `firstParagraph` de
la lección. Lo que diga ese primer objetivo **el alumno lo lee como si fuera la lección**.
Zod los valida por FORMA (1..6 strings no vacíos) y nada más;
`tests/unit/content-linguist-scan.test.ts` es una lista negra de cinco cadenas del portugués.

---

## 0. El denominador estaba mal: no son 230, son 241

El encargo decía **230 objectives (155 pt + 75 ro)**. Ese número sale de contar
`lib/data/languages/{pt,ro}/lessons/b*.json`. Pero **el bloque 1 del portugués no tiene
fichero de lecciones**: sus 5 lecciones viven EN LÍNEA en `lib/data/languages/pt/curriculum.ts`
(`const B1_LESSONS`, líneas ~95-124), con **11 objectives más**.

| | lessons/*.json | curriculum.ts (inline) | total |
|---|---|---|---|
| pt | 155 (41 lecciones) | **11 (5 lecciones)** | **166** |
| ro | 75 (24 lecciones) | 0 | 75 |
| **total** | 230 | 11 | **241** |

Consecuencia operativa, y es la primera del informe: **cualquier gate que apunte a
`lessons/*.json` no mira el bloque 1 del portugués — el PRIMERO que ve el alumno.**
Es el mismo hueco que el `pt/lessons/b9.json`, que es literalmente `[]` (bloque de léxico,
`freeDrill: true`, sin lecciones): un fichero vacío no dispara ninguna alarma.

---

## 1. EL RECUENTO

Criterio: **A** = meta o tema, no hay nada que verificar. **B** = afirma algo falsable
sobre la lengua (regla, equivalencia, condición, lista cerrada, «se forma con», «los tres…»).

| lengua | A | B | total | % B |
|---|---|---|---|---|
| **pt** | 63 | **103** | 166 | **62 %** |
| **ro** | 18 | **57** | 75 | **76 %** |
| **TOTAL** | **81** | **160** | **241** | **66 %** |

**Dos de cada tres párrafos publicados afirman algo que puede ser falso, y nada lo comprueba.**

Los `title` (70: 46 pt + 24 ro) son casi todos rótulos de tema; **~10 afirman**
(p. ej. `Futuro composto: ir + infinitivo`, `Articolul hotărât: el artículo pegado al final`,
`Să + prezent: donde el español pone infinitivo`, `Infinitivo pessoal: la forma portuguesa única`).
Van dentro de los hallazgos donde corresponde.

De los 160 B, **verifiqué uno a uno** y el reparto es:

| veredicto | pt | ro | total |
|---|---|---|---|
| verdadera | 71 | 40 | 111 |
| **falsa** | **7** | **1** | **8** |
| **media verdad** | **11** | **7** | **18** |
| verdadera pero GRATIS para este alumno | 8 | 6 | 14 |
| no verificable / duda declarada | 6 | 3 | 9 |

---

## 2. LOS FALSOS Y LAS MEDIAS VERDADES, uno a uno

Formato: fichero · ruta · frase literal · veredicto · evidencia · **copias vivas**.

### ═══ PORTUGUÉS ═══

#### F1 — Los irregulares del futuro (y del condicional) no son ésos. Es una lista pegada.

`lib/data/languages/pt/lessons/b5.json` · `[0].objectives[1]` (lección `b5-l1-futuro-presente`)

> «Identificar verbos irregulares no futuro (ser, estar, ter, ir, fazer...)»

**FALSA.** En portugués el futuro do presente tiene **exactamente tres** irregulares:
`dizer→direi`, `fazer→farei`, `trazer→trarei` (y sus compuestos). `ser→serei`,
`estar→estarei`, `ter→terei`, `ir→irei` son **regulares**: infinitivo + desinencia, sin excepción.
De los cinco verbos que la frase nombra como irregulares, **cuatro son regulares**.

Segunda copia, la misma falsedad en el condicional:
`lib/data/languages/pt/lessons/b5.json` · `[2].objectives[1]` (`b5-l3-condicional`)
> «Identificar verbos irregulares no condicional (ser, ter, fazer, querer...)»
`ser→seria`, `ter→teria`, `querer→quereria` son regulares. Sólo `fazer` acierta.

**Copias vivas (4):**
- `lib/data/languages/pt/lessons/b5.json:8` (objetivo del futuro)
- `lib/data/languages/pt/lessons/b5.json:53` (objetivo del condicional)
- `lib/data/languages/pt/curriculum.ts:201` — `b5-futuro-presente`, description:
  «irregulares (ser, estar, ter, ir, fazer, dizer, vir, ver, poder, querer, saber, dar, trazer, pôr)»
  → **14 verbos, 3 correctos**
- `lib/data/languages/pt/concepts.json` · `b5-futuro-presente.description` (idéntica)

**El mecanismo, que es lo importante:** esa lista de 14 verbos
(`ser, estar, ter, ir, fazer, dizer, vir, ver, poder, querer, saber, dar, trazer, pôr`)
está **copiada literalmente en cinco tiempos distintos** de `curriculum.ts`:
`b3-presente-irregular` (161), `b4-perfeito-irregular` (182), `b5-futuro-presente` (201),
`b6-presente-subj` (220). En el presente y en el perfeito es correcta; en el futuro es falsa.
Nadie preguntó «¿irregular EN QUÉ TIEMPO?». Es una lista de «verbos difíciles», no un dato.
De propina, `curriculum.ts:161` escribe **`traer`**, que es español (`trazer`).

#### F2 — El imperfeito irregular es la lista del ESPAÑOL, transplantada

`lib/data/languages/pt/lessons/b4.json` · `[2].objectives[1]` (`b4-l3-imperfeito`)

> «Identificar los tres verbos irregulares: ser, ir, ver»

**FALSA, y de la peor clase: es la regla del español puesta en portugués.**
En español los irregulares del imperfecto son exactamente esos tres (era, iba, veía).
En portugués son **otros y son cuatro**: `ser→era`, `ter→tinha`, `vir→vinha`, `pôr→punha`
(más compuestos). `ir→ia` y `ver→via` salen del patrón regular (`part-ir→partia`, `com-er→comia`;
raíz vacía y raíz `v-`). Los tres que la lección **omite** —`ter`, `vir`, `pôr`— son los
tres que de verdad hay que memorizar, y `tinha` es además el auxiliar del mais-que-perfeito
que la propia lección `b4-l5` enseña dos lecciones después.

**Copias vivas (3):**
- `lib/data/languages/pt/lessons/b4.json:53`
- `lib/data/languages/pt/curriculum.ts:183` — `b4-imperfeito`: «…Irregular: ser, ir, ver»
- `lib/data/languages/pt/concepts.json` · `b4-imperfeito.description` (idéntica)

#### F3 — La condicional de tipo 1: la app enseña el calco del español

`lib/data/languages/pt/lessons/b5.json` · `[3].objectives[0]` (`b5-l4-se-futuro-condicional`)

> «Reconhecer a estrutura da oração condicional tipo 1 (se + presente → futuro)»

**FALSA para el caso que la frase describe.** Con `se` y consecuencia futura, el portugués
exige **futuro do conjuntivo**: *Se **tiver** tempo, vou/irei*. «Se + presente do indicativo»
es exactamente lo que hace el español (*si tengo tiempo*) y es **el error nº 1 del
hispanohablante en portugués**. La lección lo publica como la regla.

Y la prueba está dentro del propio repo, en la tarjeta que el alumno estudia:

`lib/data/languages/pt/blocks/b5.json:3139` (flashcard)
> front: «¿Cuál es la estructura de una oración condicional tipo 1?»
> back: «Se + presente do indicativo + futuro do presente (ou presente simples)
> **Exemplo: Se eu tiver dinheiro, vou viajar.**»

**La regla y su propio ejemplo se contradicen en la misma tarjeta**: `tiver` es futuro do
conjuntivo, no presente do indicativo. Nadie leyó la tarjeta entera.

Y el dato correcto también está en el repo, sin conectar:
`lib/data/languages/pt/concepts.json` · `b6-futuro-subj`: «Derivación del perfeito…;
uso con quando, **se**, assim que, como se». Un fichero sabe que `se` rige futuro do
conjuntivo y el otro enseña lo contrario.

**Copias vivas (4):** `lessons/b5.json:74` · `blocks/b5.json:3139` (tarjeta) ·
`curriculum.ts:204` (`b5-se-condicional`: «tipo 1 (si presente, futuro)») ·
`concepts.json` · `b5-se-condicional`.

#### F4 — El imperfeito do conjuntivo no se deriva del imperfeito, y `-ir` no da `-esse`

`lib/data/languages/pt/lessons/b6.json` · `[1].objectives[0]` (`b6-l2-imperfeito-conjuntivo`)

> «Derivar as formas do imperfeito do conjuntivo a partir do **imperfeito do indicativo**
> (-ar → -asse; **-er/-ir → -esse**)»

**FALSA por dos sitios a la vez:**
1. La base es el **pretérito perfeito** (3.ª pl.), no el imperfeito: `fizeram→fizesse`,
   `disseram→dissesse`, `puseram→pusesse`, `souberam→soubesse`. Desde el imperfeito
   (`fazia`) sale `*fazisse`, que no existe.
2. `-ir` **no** da `-esse`: `partir→partisse`, `dormir→dormisse`. Son tres desinencias
   (`-asse / -esse / -isse`), no dos.

La regla acierta por accidente en los `-ar` regulares (`falava`→`falasse`), y por eso
sobrevivió: es una **media regla que se contesta bien en el caso de portada**.

Que es falsa lo dice el fichero de al lado: `lessons/b6.json` · `[2].objectives[0]`
(`b6-l3-futuro-conjuntivo`) dice, correctamente, «a partir do **perfeito** do indicativo».
**Dos lecciones consecutivas del mismo fichero dan bases distintas para dos tiempos que
comparten la misma base.**

**Copias vivas (3):**
- `lib/data/languages/pt/lessons/b6.json:33`
- `lib/data/languages/pt/curriculum.ts:221` — `b6-imperfeito-subj`: «Derivación del imperfeito (-ar → -asse; -er/-ir → -esse)»
- `lib/data/languages/pt/blocks/b6.json:3844` (flashcard que el alumno estudia):
  «Se toma la raíz del **pretérito imperfeito do indicativo** y se añade -ASSE: falar → falasse»

#### F5 — El futuro do conjuntivo: `-ir` tampoco da `-er`

`lib/data/languages/pt/lessons/b6.json` · `[2].objectives[0]`

> «Derivar as formas do futuro do conjuntivo a partir do perfeito do indicativo
> (-ar → -ar; **-er/-ir → -er**)»

**MEDIA VERDAD.** La base (perfeito) es correcta. Las desinencias no: `partir→partir`,
no `*parter`. Es la misma colisión `-er/-ir` de F4, en la lección siguiente, con la
misma forma. **Copias vivas (2):** `lessons/b6.json:44` · `concepts.json` · `b6-futuro-subj`
(«-er/-ir → -er»).

#### F6 — La numeración de las condicionales se contradice consigo misma

- `lessons/b5.json` · `[3].objectives[1]`: «condicional **tipo 2** (se + **imperfeito do conjuntivo** → condicional)»
- `lessons/b6.json` · `[3].objectives[0]`: «o condicional **tipo 3** (**imperfeito do conjuntivo**) e o tipo 4 (mais-que-perfeito do conjuntivo)»
- `blocks/b6.json:8493` (opciones de un quiz): «Condicional tipo 1 (presente do indicativo) /
  **tipo 2 (imperfeito do INDICATIVO)** / **tipo 3 (imperfeito do conjuntivo)** / tipo 4 (mais-que-perfeito do conjuntivo)»

**La misma estructura se llama tipo 2 en el bloque 5 y tipo 3 en el bloque 6**, y el quiz
sigue la del bloque 6. Un alumno que estudie los dos bloques tiene un número que cambia de
referente sin aviso. Añadido: «tipo 4» es una categoría inventada (la taxonomía estándar
llega al 3), y «a partícula se» llama partícula a una conjunción.

#### F7 — El progresivo brasileño en una rama que se llama `pt-pt-como-base`

`lib/data/languages/pt/lessons/b7.json` · `[1].objectives[1]` (`b7-l2-gerundio`)

> «Producir oraciones progresivas con **estar**, andar, ir y vir + gerúndio»

**MEDIA VERDAD, y del lado equivocado de la rama.** En portugués europeo el progresivo es
**`estar A + infinitivo`** (*estou a comer*); `estar + gerúndio` es la forma brasileña.
`andar/ir/vir + gerúndio` sí son europeos, y por eso la frase es media verdad y no falsa:
mete el único que no va en la lista de los que sí van.

Lo dice el propio curso, siete bloques después:
`lessons/b11.json` · `[3].objectives[0]`: «Usar **«estar a + infinitivo»** como progresivo
y reconocer que «ir + gerúndio» (avance gradual) **sí** es europeo».
**El alumno lee la versión brasileña en B1 y la corrección en C1.**

**Copias vivas (3):** `lessons/b7.json:29` · `concepts.json` · `b7-gerundio`
(«uso con estar, andar, ir, vir (**estar falando**)») · `curriculum.ts:249`
(descripción del bloque 7: «con sus construcciones (**estar + ger**, ter/haver + part, voz pasiva)»).

#### F8 — `você` como tratamiento de cortesía europeo

`lib/data/languages/pt/lessons/b10.json` · `[0].objectives[1]`

> «Distinguir los tratamientos **você**, o senhor y a senhora según el contexto comunicativo»

**MEDIA VERDAD en PT-PT.** En portugués europeo `você` no es el neutro de cortesía: es
marcado y en muchas situaciones descortés; el sistema real es `tu` / `o senhor, a senhora` /
**tercera persona con el nombre o el título**. El propio curso lo dice en
`lessons/b11.json` · `[7].objectives[0]`: «Dirigirse a alguien en tercera persona con su
nombre o su título, **que es la cortesía europea corriente**». La lección de registro
(bloque 10) enumera el sistema brasileño; la de norma culta oral (bloque 11) el europeo.

#### F9 — «El portugués omite el artículo frente al español» apunta al revés

`lib/data/languages/pt/lessons/b2.json` · `[0].objectives[2]`

> «Distinguir contextos donde el português **omite** el artículo frente al español»

**MEDIA VERDAD y desorientadora.** El contraste que le cuesta a un hispanohablante es el
contrario: el portugués **añade** artículo donde el español no lo pone —ante posesivo
(*o meu carro*) y ante nombre propio de persona (*a Maria*), obligatorio en la norma
europea que esta rama toma como base—. Casos de omisión los hay, pero mandar al alumno a
buscar omisiones es mandarlo al lado que no falla.

#### F10 — Los plurales de `-ão` son tres, y aquí son dos

`lib/data/languages/pt/lessons/b2.json` · `[2].objectives[1]`

> «Transformar del singular al plural aplicando las reglas de -s, -es, **-ões, -ães**»

**MEDIA VERDAD (falta `-ãos`).** Falta la tercera clase: `mão→mãos`, `irmão→irmãos`,
`cidadão→cidadãos` — y `mão`/`irmão` son de las palabras más frecuentes de la lengua.
El repo tiene el dato bien en `lessons/b11.json` · `[2].objectives[3]`:
«Repartir **los tres plurales de -ão (-ões, -ãos, -ães)** sin regularizar».
**Copia viva de la versión incompleta:** `curriculum.ts:141` (`b2-numero`:
«Reglas de plural: -s, -es, -ões, -ães, casos irregulares»).

#### F11 — «Ênclise em início de oración»

`lib/data/languages/pt/lessons/b8.json` · `[2].objectives[1]` (`b8-l3-colocacao-pronominal`)

> «Aplicar a regra geral de ênclise **em início de oración compuesta**»

**FALSA / incoherente.** La regla europea es que la énclisis es el defecto de la oración
afirmativa principal; «en inicio de oración» es precisamente donde el portugués **no**
admite el clítico antepuesto (la regla brasileña «não se inicia período com pronome átono»
habla de la PRÓclisis, no de la énclisis). Tal como está escrita no describe ninguna regla
del portugués. El objetivo `[3]` de la misma lección —«Transformar estructuras con
pronombres de **posición débil** a **posición canônica**»— es jerga vacía: ni el portugués
ni la lingüística usan esos términos aquí.

#### F12 — «Futuro composto» no es `ir + infinitivo`

`lessons/b5.json` · lección `b5-l2-futuro-composto`, **título** + `objectives[0]`

> título: «Futuro composto: ir + infinitivo» · «Reconhecer a estrutura do futuro composto (ir + infinitivo)»

**FALSA terminológicamente.** En la gramática portuguesa «futuro composto» es
`terei falado` (futuro perfeito composto). `ir + infinitivo` es el **futuro perifrástico /
futuro imediato**. El nombre está mal en el título de la lección, en tres objetivos y en
media docena de tarjetas.
**Copias vivas (7+):** `lessons/b5.json:29,30,31,32` · `curriculum.ts:202` ·
`concepts.json` · `b5-futuro-composto` · `blocks/b5.json:674, 2994, 3499-3505, 3629, 4677`.

#### F13 — «Los 13 verbos de alta frecuencia» son 14 en el fichero de al lado

`lessons/b4.json` · `[1].objectives[0]`: «Reconocer las formas irregulares de los **13**
verbos de alta frecuencia». `concepts.json`/`curriculum.ts:182` (`b4-perfeito-irregular`)
listan **14**: ir, ser, estar, ter, fazer, dizer, vir, ver, poder, querer, saber, dar,
trazer, pôr. Un número redondo escrito a ojo que ya no cuadra con su propia lista.

#### F14 — Las correspondencias ES→PT del bloque 1 (las que el gate no mira)

`lib/data/languages/pt/curriculum.ts` · `B1_LESSONS[2].objectives[0]` (`b1-l3-correspondencias-es-pt`)

> «Aplicar las reglas -ón→-ão, **-ll-→-lh-**, -ñ-→-nh-»

**MEDIA VERDAD.** `-ón→-ão` es sólida. `-ñ-→-nh-` es sólida salvo la excepción más
frecuente de todas (`año→ano`, sin `nh`). **`-ll-→-lh-` sólo vale para el subconjunto que
viene del latín `-LI-`** (*batalla/batalha, maravilla/maravilha, brillar/brilhar*): la `ll`
inicial da `ch-` (*llamar/chamar, lleno/cheio, llave/chave, lluvia/chuva*) y la `-ll-`
latina da `-l-` (*caballo/cavalo, bella/bela*). El repo llama a este paso «Pasaje
**sistemático** ES→PT» (`concepts.json` · `b1-corresp-ll-lh`) — y sistemático no es.
Nótese el contraste: para `h-→f-` el mismo objetivo **sí** acota («sólo donde procede, con
la prueba del cultismo»). Alguien acotó una y no la otra.
**Copias vivas (3):** `curriculum.ts` B1_LESSONS · `concepts.json` · `b1-corresp-ll-lh` ·
`curriculum.ts` B1_CONCEPTS (misma description).

---

### ═══ RUMANO ═══

#### R1 — `al cărui / a cărei`: la regla parte la concordancia por la mitad

`lib/data/languages/ro/lessons/b11.json` · `[0].objectives[0]` (`b11-l1-relativul-declinat`)
— **es el `objectives[0]`, o sea el `firstParagraph` que el alumno lee.**

> «Concordar al cărui / a cărei / ai căror / ale căror **con lo POSEÍDO y no con el poseedor**»

**MEDIA VERDAD, y produce error.** El bloque tiene **dos piezas con dos concordancias
distintas**: `al/a/ai/ale` concuerda con lo **poseído**; `cărui/cărei/căror` concuerda con
el **poseedor** (el antecedente). Presentarlo como una unidad que concuerda con lo poseído
hace que el alumno mueva también la segunda pieza.

**Evidencia del corpus** (`scripts/corpus-ro.ts --ctx "ai c(ă|a)rei"`, 13 aciertos), un solo
antecedente femenino singular con tres poseídos distintos:

> «Dacă ea, **al cărui** păr ar cădea…, **ai cărei** ochi ar fi ca cicoarea…, **a cărei**
> mână mică și moale mi-…»

`cărui/cărei` se mueve con el poseedor; `al/ai/a` con lo poseído (`păr` m.sg → `al`;
`ochi` m.pl → `ai`; `mână` f.sg → `a`). Aplicando la regla tal como está escrita, un
antecedente femenino con poseído masculino plural daría `*ai căror ochi` en vez de
`ai cărei ochi`.

El inventario lo dice bien y en otra clave: `inventario-puntos.ts:788` (`r11-relativo-declinado`)
— «donde el **caso y el artículo posesivo se cruzan**». La prosa deshizo el cruce.
**Copias vivas:** sólo `lessons/b11.json:7` (no hay lote publicado de este punto todavía).

#### R2 — «Contracciones OBLIGATORIAS»: la prosa lleva la palabra que el inventario mató HOY

`lib/data/languages/ro/lessons/b6.json` · `[1].objectives[0]` (`b6-l2-contractii-si-encliza`)
— **`objectives[0]`, lo lee el alumno.**

> «Escribir las contracciones **obligatorias** de los clíticos con guion (mi l-a dat, ți-l dau)»

**FALSA.** `inventario-puntos.ts:556` (`r6-contracciones-cliticos`), reescrito **el 2026-09-04**:

> «⚠ Y **NO se llama «obligatorias», que es lo que decía y era falso**: con «nu» la
> contracción es OPCIONAL y así está publicado en r3-negacion-nu, que acepta «nu îl»,
> «nu îmi» y «nu am» como alternativas»

Es **exactamente el caso del gerunziu**: se corrigió el punto en el código y la prosa que
lee el alumno se quedó con la versión vieja. Y hay más: el mismo inventario dice hoy que
el punto **no es de colocación sino de ortografía** (el guion rumano marca sílaba, no
enclisis) y renombró el punto a «El guion del clítico: de qué lado se pega, y dónde NO se
pega». El título de la lección sigue siendo «Contracții și **encliză**» y `objectives[1]`
sigue enseñando colocación —«Colocar los clíticos detrás del verbo en el imperativo
afirmativo y en el gerunziu»— que el inventario declara **GRATIS por dos vías** (español
*dámelo*, portugués *dá-mo*) y por tanto no es lo que el punto mide. Los dos hechos que el
punto sí mide (clúster **segmentado** `dă-mi-o` frente al portugués fundido `dá-mo`; y la
**vocal de legătură** `văzându-l`) **no aparecen en ningún objetivo.**

#### R3 — «ca … să cuando el sujeto va expreso»: la regla corregida el 2026-09-03, viva en la prosa

`lib/data/languages/ro/lessons/b8.json` · `[0].objectives[1]`

> «Repartir «că» … y «să» …, y usar «ca … să» **cuando el sujeto de la subordinada va expreso**»

**FALSA como condición** (verdadera como caso frecuente). `inventario-puntos.ts:632`
(`r8-completivas-ca-sa`):

> «**CORREGIDO EL 2026-09-03: la regla NO es «ca cuando hay sujeto expreso» — eso describe
> el caso frecuente, no la condición.** «Ca» se licencia por haber un CONSTITUYENTE
> ADELANTADO delante de «să», sea sujeto o no (*Vreau CA PÂNĂ MÂINE să termine Ion cartea*),
> y un sujeto expreso POSPUESTO no lo pide (*Vreau să vină el*, sin «ca»).»

Segunda copia viva de la misma media regla, en otra lección:
`lessons/b7.json` · `[0].objectives[2]` — «(vreau să merg, **vreau ca el să vină**)» — ahí es
sólo un ejemplo, así que no miente, pero refuerza la lectura falsa.

#### R4 — El doblado del clítico sin decir «DIRECTO»: la v0 que el inventario declara errónea

`lib/data/languages/ro/lessons/b6.json` · `[0].objectives[2]`

> «Doblar el clítico cuando el **objeto humano determinado** va explícito (Îl văd pe Ion)»

**MEDIA VERDAD.** Falta la palabra **DIRECTO**, y sin ella la regla se extiende al objeto
indirecto, donde es falsa. `inventario-puntos.ts:568` (`r6-doblado-cliticos`) lo dice con
todas las letras:

> «(b) con el objeto INDIRECTO NO vale … y sólo OPCIONAL con OI léxico pospuesto:
> «Dau cartea Mariei» es correcto. **La v0 de esta línea decía «el objeto humano determinado
> se dobla SIEMPRE»** y ponía «îi dau Mariei cartea» de ejemplo, que es justo el caso donde
> es opcional.»

**Copias vivas de la v0 (4), y una está en un test:**
- `lib/data/languages/ro/lessons/b6.json:9` (el objetivo)
- `lib/data/languages/ro/blocks/b6.json:808` — explicación de un ejercicio publicado:
  «…es **obligatorio con objeto humano determinado** — y «studenții lui» lo está.»
- `scripts/lotes/corr-ro-a2b.ts:175` — la misma cadena en el generador
- `tests/unit/corr-ro-a2b.test.ts:24` —
  `const EXPL_DOB = 'El objeto humano determinado se dobla con el clítico además de llevar pe delante.'`
  → **el test CONGELA la versión que el inventario declara errónea.** Corregir la prosa
  romperá ese test; ése es el aviso.

#### R5 — «INVARIABLE en persona» es más ancho que la verdad, y el inventario ya lo escribió

`lib/data/languages/ro/lessons/b7.json` · `[0].objectives[1]`

> «Usar el conjuntivo perfecto «să fi» + participio, que es **INVARIABLE en persona**, para la anterioridad»

**MEDIA VERDAD.** `inventario-puntos.ts:586` (`r7-conjuntivo-perfecto`), 2026-09-03:

> «El borde, escrito … **porque la palabra suelta es más ancha que la verdad**: en la PASIVA
> concuerda el participio léxico (să fi fost văzut / văzută / văzuți / văzute) … y con verbo
> REFLEXIVO **varía el clítico** que precede a «fi» (**să mă fi dus / să te fi dus**)»

Con reflexivo, la perífrasis **sí** varía en persona. La mayúscula del objetivo (`INVARIABLE`)
es justamente la que impide al alumno ver el borde.

#### R6 — «Elegir el término de comparación por el contexto» choca con una medición del repo

`lib/data/languages/ro/lessons/b8.json` · `[1].objectives[0]`

> «**Elegir el término de comparación por el contexto**: mai … decât, la fel de … ca, cel mai»

**MEDIA VERDAD / colisión de término.** Bajo la lectura «elegir entre superioridad,
igualdad y superlativo» es verdadera. Pero «término de comparación» es un **término técnico
usado en este repo** con otro sentido: `decât` vs `ca` tras `mai`. Y ahí el repo tiene un
número:

> `inventario-puntos.ts:648` (`r8-comparativo`): «**El TÉRMINO DE COMPARACIÓN NO SE EXAMINA**:
> «decât» y «ca» son los DOS el comparativo de superioridad tras «mai» … Medido en el corpus
> del proyecto, no supuesto: mai+ADJ+decât = **514** frente a mai+ADJ+ca = **100** …
> **Un hueco ahí no está determinado.**»
> y `tests/unit/lote21-ro.test.ts:43`: «gate 1 · el término de comparación tras «mai + ADJ» no está determinado»

O sea: el objetivo le promete al alumno que hay un criterio contextual donde el proyecto
midió que **no lo hay**, y tiene un gate que tira los ítems que lo suponen.

#### R7 — «salvo … con «cu»» comprime una condición hasta volverla falsa

`lib/data/languages/ro/lessons/b4.json` · `[0].objectives[1]`

> «Dejar el sustantivo sin artículo tras preposición de acusativo (la școală, în oraș),
> salvo con determinante **y con «cu»**»

**MEDIA VERDAD.** `inventario-puntos.ts:491` (`r4-preposicion-caida-articulo`) dice
«y con «cu» **instrumental/comitativo determinado** (cu trenul, cu creionul, cu mâna)».
Sin el calificativo, «cu» pasa a llevar artículo siempre — y el propio curso enseña en el
bloque 10 `cu plăcere`, y `merg cu prieteni` es rumano corriente. La compresión se comió la
condición.

#### R8 — El cuarto futuro no es el que dice el inventario, y el nivel tampoco

`lib/data/languages/ro/lessons/b5.json` · `[1].objectives[0]` — **`objectives[0]`**

> «Elegir el futuro que pide el **registro** entre voi merge, o să merg, am să merg y **merg**»

**DISCREPANCIA, no falsedad.** `inventario-puntos.ts:522` (`r5-futuro-cuatro-registros`)
nombra los cuatro como «voi merge / o să merg / am să merg / **oi merge**»; el objetivo pone
en cuarto lugar el presente con valor de futuro (`merg`), que existe pero no es el punto.
Y el inventario añade: «Receptivos los cuatro, productivos «o să» y «voi». **En B2 se vuelven
elección de registro**» — el objetivo pide la elección por registro en el **bloque 5 (A2)**.

#### R9 — El criterio de «opaco» cambia entre la prosa y el inventario

`lib/data/languages/ro/lessons/b9.json` · `[0].objectives[1]`

> «los lemas OPACOS, que no ofrecen ningún apoyo **etimológico** al hispanohablante»

**CRITERIO EQUIVOCADO.** `inventario-puntos.ts:666` (`r9-opacos`): «**CRITERIO: opaco = no
existe cognado español RECONOCIBLE, gane quien gane la etimología** (a păstra es de origen
disputado, DEX búlgaro / Ciorănescu latín tardío, **y es opaco igual**)». La prosa cambia
«reconocible» por «etimológico», que es la definición que el inventario descartó
explícitamente por inservible. Es la clase «una regla incompleta no se sustituye: cambiar
la condición mueve el agujero».

#### R10 — «600 lemas» es una promesa que el producto no tiene

`lib/data/languages/ro/lessons/b9.json` · `[0].objectives[0]` — **`objectives[0]`**

> «**Dominar los 600 lemas del núcleo A1** por frecuencia, con su forma y su acento»

**NO VERIFICABLE COMO ESTÁ / afirmación sobre el producto que el producto no cumple.**
Hoy: `lib/data/languages/ro/lexicon-a1.ts` tiene **79 lemas**;
`lib/data/languages/ro/vocab-catalog.json` es **`[]`**. La cifra viene del currículo
(`docs/plans/2026-07-28-curriculos-completos.md:496`) y del inventario
(`inventario-puntos.ts:660-664`), donde es un **objetivo**; en la prosa de la lección se
lee como un **hecho** («los 600 lemas»). Y `docs/auditoria/2026-07-28-revision-linguistica.md:306`
ya avisó de que ninguna lista de frecuencia está nombrada, o sea que ni siquiera es
verificable de dónde saldrían.
**Copias vivas (4):** `lessons/b9.json:7` · `inventario-puntos.ts:660` · `inventario-puntos.ts:664` (cita) ·
`docs/plans/2026-07-28-curriculos-completos.md:496` (+ el HTML gemelo, l. 409).

#### R11 — Dobletes «turcos» sin un solo ejemplo turco

`lessons/b9.json` · `[2].objectives[1]`: «dobletes de estrato (latino culto frente a eslavo
**o turco**)». El inventario (`r9-estratos-dobletes`) da cinco dobletes y **ninguno es
turco** (a grăi/a vorbi, nevastă/soție, slobod/liber, a sfârși/a termina, a se prăpădi/a muri).
La palabra «turco» no tiene respaldo en el material. **No verificable / sin respaldo.**

---

## 3. VERDADERAS PERO **GRATIS** para este alumno

Un hispanohablante de **México** con **portugués C2**. Estas afirmaciones son ciertas y no
le enseñan nada — el español o el portugués ya se las dan. No son un defecto de verdad,
son un defecto de presupuesto: ocupan el párrafo que el alumno lee.

| ficha | frase | por qué es gratis |
|---|---|---|
| `ro/b6.json`·`[1].objectives[1]` | «Colocar los clíticos detrás del verbo en el imperativo afirmativo y en el gerunziu» | el inventario lo declara «GRATIS por DOS vías» hoy mismo (es. *dámelo*, pt. *dá-mo*) |
| `ro/b5.json`·`[0].objectives[2]` | «elegir imperfecto cuando el hecho es habitual o de fondo» | `r5-perifrasis-pasado`: «El reparto imperfecto/indefinido en sí **transfiere: NO se examina**» |
| `ro/b6.json`·`[0].objectives[1]` | «Poner «pe» donde el rumano lo exige» | `r6-pe-regla-operativa`: «Es la «a» personal del español **casi 1:1**: donde coincide no se examina» |
| `ro/b10.json`·`[0].objectives[3]` | «Usar el diminutivo como atenuador cortés» | `r10-diminutivo-atenuador`: «lo que el ítem mide es **la ELECCIÓN**, no el efecto cortés (**ése lo calca el español de México** sin saber rumano)» — el objetivo enseña justo la mitad regalada y calla la que cuesta (el sufijo no es predecible) |
| `ro/b5.json`·`[1].objectives[3]` | «mă spăl / îmi spăl mâinile» | la distinción existe en español, sólo cambia la forma |
| `ro/b12.json`·`[1].objectives[0]` | «Dislocar a la izquierda con clítico de recuperación» | `r12-dislocacion-cliticos`: «**transferible del español**, pero con otra frecuencia» |
| `pt/b6.json`·`[4].objectives[0]` | «Distinguir hechos ciertos (indicativo) de estados de dúvida, deseo…» | el reparto indicativo/subjuntivo es el del español |
| `pt/b8.json`·`[1].objectives[3]` | «Aplicar «cujo» para expresar posesion» | el español tiene *cuyo* con la misma sintaxis |
| `pt/b3.json`·`[3].objectives[1]` | «Distinguir el uso posesivo de ter: Tenho + noun = tengo» | idéntico al español |
| `pt/b2.json`·`[3].objectives[0]` | «este/esse/aquele según la distancia» | sistema ternario idéntico al español en PT-PT |

### Y una donde la audiencia mexicana invierte el signo

`pt/b11.json` · `[0].objectives[0]` da **`constipado`** como falso amigo. Para un mexicano
lo es (allí *constipado* ≈ estreñido). Pero el ejercicio del propio repo
(`pt/blocks/b11.json`, ítem `b2c2-gj-l3-14`) explica: «*estou constipado* está BIEN —
constipado en Portugal (**y en el español normativo**) es resfriado». **La lección lo llama
falso amigo y el ejercicio le dice al alumno que no lo es.** Los dos tienen razón para
lectores distintos; ninguno declara para cuál.

---

## 4. LO QUE NO PUDE VERIFICAR, y por qué (evidencia negativa)

1. **Las afirmaciones pragmáticas del portugués europeo** — `pt/b11.json` · `[6]`:
   «*não estava mau* es un elogio», «el humor autodepreciativo como acercamiento»,
   «`lá` y `cá` como atenuadores sin equivalente español». Son plausibles y coinciden con
   lo que se lee del understatement portugués, pero **no hay corpus de portugués europeo
   en este repo** (`corpus-ro.ts` es sólo rumano) y no tengo red. **No verificadas: duda declarada.**
2. **`pt/b8.json` · `[1].objectives[0]`** — «subordinadas substantivas (sujeto, objeto
   direto, **agente**)». «Agente» no es una de las clases de la tradición
   (subjetiva, objetiva direta/indireta, completiva nominal, predicativa, apositiva).
   Sospecho error, pero podría ser una abreviatura de «agente da passiva». **Duda.**
3. **`pt/b7.json` · `[0].objectives[1]`** — «contextos donde el infinitivo pessoal reemplaza
   al conjuntivo o al **infinitivo compuesto**». El infinitivo pessoal se opone al infinitivo
   **simples/impessoal**, no al compuesto (`ter feito`), que además tiene su propia forma
   flexionada. Probablemente confuso, no seguro. **Duda.**
4. **`ro/b9.json` · `[1].objectives[0]`** — «los falsos amigos … son **los que más caro
   cuestan** porque la frase sigue sonando bien». Claim pedagógico cuantitativo sin ningún
   dato detrás en el repo. **No verificable.**
5. **`ro/b8.json` · `[0].objectives[3]`** — «A spus că vine es la forma no marcada». Coincide
   con `r8-discurso-indirecto`, **pero ese punto está declarado `BLOQUEADO: ver «abierto»»`
   en el inventario**. Es decir: la prosa publica una afirmación cuya verificación el propio
   proyecto declara pendiente. No es falsa que yo sepa; **está publicada por delante de su gate.**
6. **`ro/b11.json` · `[1].objectives[1]`** — «repartir dacă / **de** / să». `de` y `să` como
   introductores de prótasis existen (*de-aș ști*, *să fi știut*), pero `r11-periodo-condicional`
   también dice «nunca el subjuntivo que calca el español (*dacă să știu)». La frase es
   ambigua entre las dos lecturas. **Duda, no falsedad.**
7. **El asterisco del inventario que el corpus refuta** (no es prosa, pero cae aquí):
   `r3-trebuie-invariable` dice «**Nunca ***trebuiesc**, *trebuim*». El corpus da
   **`trebuiesc` = 59** apariciones, en la construcción de necesidad
   («*mie-mi **trebuiesc** atâtea cuvinte*», «***Trebuiesc** motive*»), que es rumano
   estándar de hoy. **El objetivo de la lección (`ro/b3.json`·`[1].objectives[1]`,
   «Mantener «trebuie» invariable y poner la persona en el verbo que sigue») es correcto
   porque está acotado al uso modal + `să`; el asterisco del inventario no lo está.**
   Es un caso de «un asterisco propio no es atestación», del lado del código.

---

## 5. ERRATAS Y BASURA EN LA PROSA PUBLICADA (no son afirmaciones, pero se leen)

Ninguna de éstas la caza el scan de lingüista (que sólo busca cinco cadenas concretas):

| ficha | qué |
|---|---|
| `pt/b6.json`·`[3].objectives[2]` | **`irreali­dade`** — un **soft hyphen U+00AD invisible** dentro de la palabra. Detectado con un barrido de categorías Unicode `Cf/Cc`; es el único de los 241 |
| `pt/b5.json`·`[1].objectives[1]` | «futuro composto **emPT-BR** vs. PT-PT» — falta el espacio |
| `pt/b5.json`·`[1].objectives[2]` | «planos **immediatos**» — doble m, no es ni PT ni ES |
| `pt/b4.json`·`[0].objectives[1]` | «las terminaciones **característico** de cada grupo verbal» — concordancia rota |
| `pt/b8.json`·`[1].objectives[2]` | «como **nexus** de subordinadas» — ni ES (*nexos*) ni PT (*nexos*) |
| `pt/b8.json`·`[1].objectives[3]` | «expresar **posesion em** oraciones relativas» — falta tilde + `em` portugués dentro de una frase española |
| `pt/b5.json`·`[2].objectives[2]` | «Aplicar o condicional para **deseos** corteses e conselhos suaves» — español dentro del portugués |
| `pt/b6.json`·`[4].objectives[0,1,2]` | tres objetivos en **espanglés-portugués** mezclado: «estados de **dúvida**, deseo…», «expresiones **impessoais** que **requieren**…», «**eligindo** el modo **adequado**» |
| `pt/b3.json` (toda la lección `b3-l1`, `b3-l2`) | terminología **escolar brasileña** en una rama `pt-pt-como-base`: «pronomes pessoais do **caso reto**», «oblíquos **tônicos**» (grafía BR; PT-PT: *tónicos*) |
| `curriculum.ts:161` | `b3-presente-irregular` lista **`traer`** (español) por `trazer` |
| contradicción interna | `pt/b3.json`·`[1]` se titula «…y su uso **en Brasil**» y su `objectives[2]` enseña `me+o=mo`, `te+a=ta`, que están **muertas en el portugués de Brasil** y vivas sólo en el europeo |

---

## 6. QUÉ ME SORPRENDIÓ

1. **El daño no está donde se buscaba.** El caso del gerunziu rumano hizo pensar en un
   problema del rumano. **El portugués está mucho peor**: 7 falsedades duras y 11 medias
   verdades contra 1 y 7 del rumano — y son de bloques A2/B1 (b4, b5, b6, b7), o sea las
   que el alumno lee primero y con menos defensas. El rumano tiene menos porque su
   inventario es un documento vivo que se corrige; el portugués de b2-b8 es contenido
   generado en 2026-07 que **nadie ha vuelto a leer nunca**.

2. **El fallo dominante no es una regla falsa, es una LISTA reutilizada.** Los 14 verbos
   «irregulares» pegados en cinco tiempos distintos de `curriculum.ts` producen ellos solos
   dos de los siete falsos. Nadie hizo la pregunta «irregular ¿en qué tiempo?», porque la
   lista *parece* un dato y es una etiqueta («verbos difíciles»). Es el mismo mecanismo que
   «una regla copiada se desincroniza», pero peor: aquí **las copias están todas de acuerdo
   entre sí** y todas mal. Un gate de consistencia entre copias las habría dado por buenas.

3. **La contradicción viaja en el tiempo, no en el espacio.** Tres veces (progresivo
   `estar a`+inf, `você`, plural `-ãos`) el curso **enseña la versión equivocada en un
   bloque bajo y la corrige en el bloque 11**. Nadie lo ve porque los dos ficheros están
   bien cada uno por su lado; lo que está mal es el ORDEN en que el alumno los lee. Es un
   defecto que no vive en ningún fichero.

4. **La tarjeta que se refuta a sí misma.** `blocks/b5.json:3139` dice «Se + presente do
   indicativo» y pone de ejemplo «Se eu **tiver** dinheiro». La regla y el ejemplo no se
   miraron juntos. Es el hermano exacto del `fugind` que refutaba su propia regla en el
   gerunziu — y aquí ya había pasado, en otra lengua, sin que nadie lo relacionara.

5. **Un test congela una falsedad.** `tests/unit/corr-ro-a2b.test.ts:24` guarda como
   constante la redacción del doblado que `inventario-puntos.ts:568` declara errónea (la v0
   sin «DIRECTO»). Arreglar la prosa **pondrá ese test en rojo**, y quien lo vea en rojo
   pensará que rompió algo. La deuda tiene un guardián que la defiende.

6. **El denominador de esta auditoría estaba mal (230 vs 241) por la misma razón que el
   defecto original.** El bloque 1 del portugués vive en `curriculum.ts` y no en
   `lessons/*.json`, y `pt/lessons/b9.json` es `[]`. Cualquier herramienta que hayamos
   escrito apuntando a `lessons/*.json` **nunca ha mirado el primer bloque del curso**.
   Once objetivos publicados que no estaban ni en el censo.

7. **El inventario del rumano es, de largo, la mejor pieza del repo** — y aun así **su
   prosa derivada va tres días por detrás**: dos correcciones fechadas 2026-09-03 (`ca…să`,
   `să fi`) y una fechada **2026-09-04** (`contracciones obligatorias`) siguen vivas en los
   `objectives` que el alumno lee. El defecto no es que el inventario esté mal: es que
   **nada propaga una corrección del inventario a la prosa**, y `objectives[0]` es prosa
   publicada.
