# Lote 11 v2 — informe PEDAGÓGICO y de DISEÑO

**Revisor:** lingüista adversarial PT (eje pedagogía + diseño; la gramática la revisa otro).
**Objeto:** `scripts/lotes/lote11v2-cloze.ts` (24 ítems) y `docs/contenido/2026-09-04-lote11-v2-cloze.md`.
**Fecha de la revisión:** 2026-08-31. Releído tras el cambio a pista entre paréntesis.

---

## Veredicto global: **NO**

Y el desglose honesto, porque las dos mitades no valen lo mismo:

| sección | veredicto | por qué |
|---|---|---|
| A · `b11-alternancia-infinitivo` | **PUBLICA-CON-CORRECCIONES** | el formato es el correcto y la pista no regala; lo que sobra es monotonía estructural y lo que falta es nivel |
| B · `b11-ser-estar-divergente` | **NO** | mide lo mismo que la v1 y lo mide un poco peor: **la traducción al español resuelve 12/12** (p = 1,9·10⁻⁶) frente a los 11/12 que mataron la v1 |

**El cambio de formato no resuelve el problema de la sección B: lo esconde.**
La v1 murió porque un rasgo declarado —la glosa cognada— acertaba 12/12
en esa sección. La v2 conserva **once de las doce mismas elecciones** y
añade una nueva (`fica`) que en español es *queda*. Lo único que ha
cambiado es que en un cloze **ese rasgo ya no se mide**, porque la
batería vieja necesita una etiqueta binaria y aquí no la hay. El lote lo
dice con todas las letras en su cabecera —«la familia entera de atajos de
la batería deja de aplicar»— y esa frase es verdadera y es la trampa: que
los atajos de un formato no apliquen no significa que el formato nuevo no
tenga los suyos. Significa que **nadie los había medido nunca**.

Ahora sí. `scripts/lib/atajos-cloze.ts` existe (lo he escrito para poder
medir esto) y su primera corrida está abajo.

**12 bloqueantes**, listados al final.

---

## 1 · La batería de atajos del formato CLOZE

### 1.1 El marco

Un atajo de juicio es un **rasgo** que predice una etiqueta. Un cloze no
tiene etiqueta, así que su atajo es otra cosa: un **resolutor** — una
función que produce la respuesta a partir de un *subconjunto estricto* de
la información del ítem y acierta por encima del azar. Y el azar aquí no
es 0,5: es 1/k sobre el espacio que el formato deja abierto (tres
construcciones en la sección A, tres lemas en la B). Usar 0,5 por inercia
infla la tabla entera, así que cada resolutor declara **qué información
usa** y **contra qué baseline se mide**.

Lo que acusa a un ítem no es que un resolutor acierte: es que acierte uno
que **no lee el contexto que el ítem dice examinar**.

### 1.2 Salida pegada

```
$ npx tsx scratchpad/medir.ts        # batería de scripts/lib/atajos-cloze.ts

# Batería de atajos del formato CLOZE — lote 11 v2

### A · `b11-alternancia-infinitivo` (N=12)

| resolutor | usa | acierto | baseline | p |
|---|---|---:|---:|---:|
| tabla de disparadores (8 palabras funcionales) + lema + persona | UNA palabra funcional a la izquierda del hueco, el paréntesis y el sujeto | **11/12** (92 %) | 33 % | 4.7e-5 |
| lema del paréntesis + terminación de la persona (infinitivo pessoal SIEMPRE) | el paréntesis y el sujeto contiguo; NADA del resto de la frase | **6/12** (50 %) | 33 % | 0.1777 |
| concatenación ingenua: lema visible + desinencia, sin ajuste ortográfico | el paréntesis y el sujeto contiguo | **4/12** (33 %) | 33 % | 0.6069 |
| responder siempre la forma más frecuente del punto | nada del ítem: sólo el reparto del lote | **1/12** (8 %) | 33 % | 0.9923 |
| traducir la frase al español y poner el verbo español (DECLARADO) | la frase, pero sólo como español | **0/12** (0 %) | 33 % | 1.0000 |

### B · `b11-ser-estar-divergente` (N=12)

| resolutor | usa | acierto | baseline | p |
|---|---|---:|---:|---:|
| traducir la frase al español y poner el verbo español (DECLARADO) | la frase, pero sólo como español: cero conocimiento del portugués salvo la morfología de ser/estar | **12/12** (100 %) | 33 % | 1.9e-6 |
| responder siempre la forma más frecuente del punto | nada del ítem: sólo el reparto del lote | **6/12** (50 %) | 33 % | 0.1777 |
| lema del paréntesis + terminación de la persona | el paréntesis y el sujeto contiguo | **0/12** (0 %) | 33 % | 1.0000 |
| concatenación ingenua | el paréntesis y el sujeto contiguo | **0/12** (0 %) | 33 % | 1.0000 |
| tabla de disparadores + lema + persona | UNA palabra funcional a la izquierda del hueco | **0/12** (0 %) | 33 % | 1.0000 |

### Rasgos binarios · sección A, target = «la respuesta es CONJUNTIVO» (N=12)

| rasgo | acierto | dirección | presentes | p (vs 0,5) |
|---|---:|---|---:|---:|
| posición ≥ 6 en el lote | **12/12** (100 %) | presente⇒SÍ | 6 | 0.0002 |
| la frase abre con preposición (Para/Antes/Sem/Depois) | **10/12** (83 %) | presente⇒NO | 4 | 0.0193 |
| hay «que» a la izquierda del hueco | **10/12** (83 %) | presente⇒SÍ | 4 | 0.0193 |
| el sujeto contiguo es un pronombre (eles/tu/nós/vocês) | **9/12** (75 %) | presente⇒SÍ | 7 | 0.0730 |
| el ancho del input es > 6 | **6/12** (50 %) | presente⇒SÍ | 4 | 0.6128 |

### Rasgos binarios · sección B, target = «el lema es SER» (N=12)

| rasgo | acierto | dirección | presentes | p (vs 0,5) |
|---|---:|---|---:|---:|
| lleva día de la semana o fecha | **9/12** (75 %) | presente⇒SÍ | 6 | 0.0730 |
| tras el hueco viene una preposición de lugar/tiempo (na/no/em/do) | **9/12** (75 %) | presente⇒SÍ | 4 | 0.0730 |
| más corta que la mediana (palabras) | **9/12** (75 %) | presente⇒SÍ | 6 | 0.0730 |
| lleva marcador temporal (rasgo 8 de la batería vieja) | **8/12** (67 %) | presente⇒NO | 3 | 0.1938 |
| el sujeto denota un EVENTO (jantar/concerto/festa) | **8/12** (67 %) | presente⇒SÍ | 3 | 0.1938 |
| lleva coma | **7/12** (58 %) | presente⇒SÍ | 8 | 0.3872 |
| sujeto animado | **6/12** (50 %) | presente⇒SÍ | 3 | 0.6128 |
```

### 1.3 Qué dice cada cifra

**El atajo que rompe el lote: la traducción, 12/12 en la sección B
(p = 1,9·10⁻⁶).** Es el rasgo 12 de la batería vieja reencarnado en un
formato donde nadie lo buscaba. La glosa está declarada ítem a ítem
(§2.3): *La cena de despedida **es** el jueves* → `é`; *António **está**
enfermo* → `está`; *El tribunal **queda** al lado de la estación* →
`fica`; *Yo **soy** portugués* → `sou`; *La puerta **estuvo** abierta toda
la noche* → `esteve`. No hay una sola excepción. Un hispanohablante que
no sepa nada de portugués salvo la morfología A1 de ser/estar acierta la
sección entera.

Y el mapa formato↔punto lo permitió sin verlo: clasifica
`b11-ser-estar-divergente` como `coincide`, y `FORMATO_DE_CLASE.coincide`
= `cloze-con-pista` con el razonamiento «hay que PRODUCIR, no juzgar». El
razonamiento es correcto para un punto donde producir la forma exige
saber portugués. **No lo es cuando la forma que hay que producir es el
cognado de la que el alumno ya tiene en la cabeza.** El criterio del mapa
—«¿el calco suena bien en español?»— responde a «¿sirve un juicio?»,
pero no a «¿mide portugués el cloze que lo sustituye?». Falta esa segunda
pregunta, y es de una línea: *si el hispanohablante que traduce produce
la respuesta, ningún formato lo arregla; hay que cambiar el CONTENIDO del
punto, no el formato.*

**El atajo de la sección A: la tabla de ocho palabras, 11/12
(p = 4,7·10⁻⁵).** Aquí la lectura es distinta y hay que ser justo: esa
tabla **es la regla que el punto enseña**. El hallazgo no es que
funcione, es que funcione **sin excepciones y sin residuo**. El disparador
determina la construcción en 11 de 12 ítems, y el que falla (CL-06) falla
porque no tiene disparador, no porque el disparador engañe:

```
| id | disparador detectado | construcción declarada | ¿coincide? |
|---|---|---|---|
| CL-01 | pessoal | pessoal | sí |   | CL-07 | conjuntivo-presente | conjuntivo-presente | sí |
| CL-02 | pessoal | pessoal | sí |   | CL-08 | conjuntivo-presente | conjuntivo-presente | sí |
| CL-03 | pessoal | pessoal | sí |   | CL-09 | conjuntivo-presente | conjuntivo-presente | sí |
| CL-04 | pessoal | pessoal | sí |   | CL-10 | conjuntivo-futuro   | conjuntivo-futuro   | sí |
| CL-05 | pessoal | pessoal | sí |   | CL-11 | conjuntivo-futuro   | conjuntivo-futuro   | sí |
| CL-06 | **(ninguno)** | pessoal | **NO** |  | CL-12 | conjuntivo-futuro | conjuntivo-futuro | sí |
```

El lote deja fuera el infinitivo simples «a propósito», y la
justificación es buena (con sujeto plural, *sem dizer* y *sem dizerem*
son las dos correctas). Pero el efecto secundario es que **el subespacio
examinado es exactamente aquel donde la tabla de consulta es completa**:
la única zona donde el disparador NO decide es la que se ha excluido. Un
alumno puede cerrar los doce ítems con un mapa de ocho palabras y no
haber tocado nunca la pregunta que da nombre al punto (¿el sujeto está
expreso o no?).

**El atajo de la POSICIÓN: 12/12, p = 0,0002.** El lote está ordenado por
construcción (seis `pessoal`, tres presente, tres futuro, doce de
ser/estar) y ese orden es el de publicación. `lib/srs/review-queue.ts:44`
ordena las cartas nuevas por `introducedAt`, que sigue el orden de
inserción del corpus: en la primera pasada, **la posición predice la
construcción sin fallo**. Es el equivalente exacto de la «alternancia
mecánica» que la batería vieja mide como rasgo 3 desde el lote 11. Se
arregla intercalando al escribir, no al publicar.

**El atajo que sólo existe en este formato y no está en el texto: EL
ANCHO DEL INPUT.** `FillBlankCard.tsx:59` pinta
`size={Math.max(6, answer.length)}`. El ancho del recuadro es la longitud
de la respuesta. No predice la respuesta —por eso no lleva p, y no se lo
pongo— pero **elimina a la rival antes de teclear**:

```
| id | respuesta (ancho) | rival(es) con su ancho | ¿el ancho ya descarta al rival? |
|---|---|---|---|
| CL-01 | apanharem (9) | apanhem(7)   | **SÍ** |
| CL-04 | assinarmos (10) | assinemos(9) | **SÍ** |
| CL-07 | façam (6)     | fazerem(7)   | **SÍ** |
| CL-09 | tragas (6)    | trazeres(8)  | **SÍ** |
| CL-12 | soubermos (9) | sabermos(8)  | **SÍ** |
(los otros 19: no)

**5 de 24** ítems: CL-01, CL-04, CL-07, CL-09, CL-12
Sección A: 5/12 · Sección B: 0/12
```

Y la parte que lo convierte en hallazgo: los cinco están en la sección A
y **los cinco son precisamente ítems donde la elección entre paradigmas
es lo que se examina**. El alumno de CL-07 ve un recuadro de 6 y ya sabe
que no es *fazerem* (7). El formato filtra justo donde el ítem mide. La
sección B se salva por accidente: todas sus respuestas tienen ≤ 6
caracteres y `Math.max(6, …)` las aplana a un ancho común.

**Los que NO son atajos, y merecen decirse porque un informe que sólo
acusa no sirve para decidir:**

- «lema + terminación de la persona», 6/12, p = 0,178 → **no significativo**.
- concatenación ingenua (lema + desinencia sin ajuste ortográfico), 4/12,
  p = 0,607 → menos que el azar. `saírem` y `porem` castigan al que
  concatena, que era la intención.
- sujeto animado (candidato (c) del encargo), 6/12 → **azar exacto**.
- adjunto temporal (candidato (c)), 8/12, p = 0,194 → no llega.
- la distribución (candidato (d)): «é» sale **6 de 12**, exactamente el
  50 %, y el gate del lote bloquea en `> 0.5`. Pasa por un ítem. Pero el
  gate mira la **forma** y el punto examina el **lema**: por lema el
  reparto es **ser 7/12 · estar 4/12 · ficar 1/12**, y «responde siempre
  SER» acierta 7/12 (p = 0,066 contra 1/3). El gate está midiendo la
  unidad equivocada.

### 1.4 El código

`scripts/lib/atajos-cloze.ts` ya está en el repo (lo creé para esta
revisión). Lo que **falta** es que el lote declare sus tablas, que son
juicio y por eso van declaradas con la glosa al lado, igual que
`glosaEsCorrecta`. Esto es lo que hay que pegar en `lote11v2-cloze.ts`:

```ts
// Las tres formas de cada verbo: sin esto no se puede medir qué produce
// la REGLA EQUIVOCADA (el conjugador del proyecto sólo deriva el
// infinitivo pessoal).
const FORMAS_POR_ITEM: Record<string, [pessoal: string, conjPres: string, conjFut: string]> = {
  'CL-01': ['apanharem', 'apanhem', 'apanharem'],
  'CL-02': ['saírem', 'saiam', 'saírem'],
  'CL-03': ['darem', 'deem', 'derem'],
  'CL-04': ['assinarmos', 'assinemos', 'assinarmos'],
  'CL-05': ['porem', 'ponham', 'puserem'],
  'CL-06': ['serem', 'sejam', 'forem'],
  'CL-07': ['fazerem', 'façam', 'fizerem'],
  'CL-08': ['ser', 'seja', 'for'],
  'CL-09': ['trazeres', 'tragas', 'trouxeres'],
  'CL-10': ['veres', 'vejas', 'vires'],
  'CL-11': ['quererem', 'queiram', 'quiserem'],
  'CL-12': ['sabermos', 'saibamos', 'soubermos'],
};

// LA TRADUCCIÓN, declarada como el rasgo 12: qué pondría en el hueco un
// hispanohablante y a qué forma portuguesa corresponde. `null` = el
// español no da la respuesta. Sin declararla, el campo queda undefined,
// el resolutor sale en el azar y pasa en silencio — que es el modo de
// fallo que esta batería existe para impedir.
const TRADUCCION: Record<string, { es: string; da: string | null; glosa: string }> = {
  'CL-13': { es: 'es',     da: 'é',      glosa: 'La cena de despedida ES el jueves' },
  'CL-16': { es: 'está',   da: 'está',   glosa: 'António ESTÁ enfermo' },
  'CL-18': { es: 'queda',  da: 'fica',   glosa: 'El tribunal QUEDA al lado de la estación — queda ↔ fica' },
  'CL-19': { es: 'soy',    da: 'sou',    glosa: 'Yo SOY portugués' },
  'CL-21': { es: 'estuvo', da: 'esteve', glosa: 'La puerta ESTUVO abierta toda la noche' },
  // … los 24
};

// La forma RIVAL: la que produce la regla equivocada. Es lo que permite
// medir la fuga por el ancho del input.
const RIVAL: Record<string, string[]> = { 'CL-01': ['apanhem'], /* … */ 'CL-13': ['está', 'fica'] };
```

y el gate del lote pasa a bloquear con:

```ts
import { bateriaCloze, fugaPorAncho, SOSPECHOSO, pBinom } from '../lib/atajos-cloze';

for (const m of bateriaCloze(medibles))
  if (m.p < SOSPECHOSO) v.push(`ATAJO: «${m.nombre}» acierta ${m.aciertos}/${m.n} (p=${m.p.toFixed(4)}) usando ${m.usa}`);
const anchos = fugaPorAncho(medibles).filter((f) => f.distingue);
if (anchos.length) v.push(`el ancho del input descarta la forma rival en ${anchos.length} ítems: ${anchos.map((f) => f.id).join(', ')}`);
// y el reparto, por LEMA y no por forma:
```

Con eso, este lote **no habría abierto el round**: el resolutor de
traducción sale a p = 1,9·10⁻⁶.

---

## 2 · La pista: ¿ayuda o regala?

El encargo cambió de objeto a mitad de la revisión y con razón: `hintEs`
**no la ve nadie**. Lo trato en §5. Aquí mido lo que el alumno sí ve: el
paréntesis dentro de la frase.

### 2.1 Sección A — el paréntesis da el lema, y el lema hace falta

```
| id | paréntesis | respuesta | ¿respuesta = paréntesis + sufijo? | letras a añadir |
|---|---|---|---|---:|
| CL-01 | (apanhar) | apanharem  | **sí** | 2 |
| CL-02 | (sair)    | saírem     | no  | — |
| CL-03 | (dar)     | darem      | **sí** | 2 |
| CL-04 | (assinar) | assinarmos | **sí** | 3 |
| CL-05 | (pôr)     | porem      | no  | — |
| CL-06 | (ser)     | serem      | **sí** | 2 |
| CL-07..CL-12 | (fazer)(ser)(trazer)(ver)(querer)(saber) | façam seja tragas vires quiserem soubermos | no | — |

La respuesta es el paréntesis + un sufijo en **4 de 24** ítems.
```

**Respuesta a la pregunta (a): 6 de 12 (50 %, p = 0,18) con el paradigma
correcto, 4 de 12 (33 %, p = 0,61) por concatenación ingenua. Ninguna de
las dos supera al azar.** El paréntesis de la sección A **no regala**: es
el mínimo imprescindible (sin el lema el hueco admite media docena de
verbos) y el reparto 6-6 entre las dos construcciones lo neutraliza. Es
la pieza mejor resuelta del lote.

Dos cautelas: (i) los cuatro ítems donde la respuesta es literalmente el
paréntesis + dos o tres letras son todos `pessoal` y todos regulares, así
que refuerzan la asociación «paréntesis intacto ⇒ infinitivo pessoal»,
que es media regla; (ii) el paréntesis **anuncia la sección**: `(apanhar)`
frente a `(ser / estar / ficar)` distingue A de B de un vistazo, y con
ello el espacio de respuestas.

### 2.2 Sección B — el trío es una constante, y una constante no informa

```
Paréntesis distintos en la sección B: 1 → «ser / estar / ficar»
Información que aporta: log2(3) = 1,58 bits el primer ítem, 0 bits a partir del segundo.
Reparto por LEMA:  ser 7/12 · estar 4/12 · ficar 1/12
Reparto por FORMA: é 6/12 · está 3/12 · fica 1/12 · sou 1/12 · esteve 1/12
```

**Respuesta a la pregunta (b): el trío no deja nada por decidir que el
alumno no decida ya en español (12/12), y a cambio abre un agujero: no
fija el TIEMPO.** Los tres lemas están en infinitivo y once ítems piden
presente; CL-21 pide un pretérito perfeito (`esteve`) y **nada visible lo
exige**. La única pista que decía «periodo cerrado» es `hintEs`, que no se
renderiza. CL-21 tal como lo verá el alumno es irresoluble.

Y hay una colisión de convenciones que conviene medir antes de consagrar
el formato:

```
fill_blank publicados: 417
  con paréntesis en la frase: 123 (29 %)
  con paréntesis de OPCIONES «a / b»: 3 (1 %)
   · Eu ___ um café todas as manhãs. (hábito/fato)
   · ___ ele ___ aqui amanhã. (talvez / estar)
   · Eu ___ que ela está doente. Mas ___ que ___ mesmo. (achar / duvidar / estar)
```

La convención del corpus **no es** «paréntesis = pista»: sólo el 29 % de
los `fill_blank` lleva paréntesis. Y donde hay barras, la lista es **un
lema por hueco, en orden** (`achar / duvidar / estar` para tres huecos).
Un alumno que ha hecho esos ejercicios leerá `(ser / estar / ficar)` como
«aquí faltan tres huecos», no como «elige uno». Si se adopta el trío, hay
que separarlo tipográficamente de la convención existente.

**¿El diseño correcto para C1 sería NO dar el trío? Sí, y por una razón
más fuerte que la del atajo:** dar el trío convierte producción en
reconocimiento entre tres, y en un punto que ya se resuelve traduciendo,
reconocer entre tres es gratis. El diseño C1 de este punto es el **par
mínimo con las dos lecturas gramaticales**, donde el contexto elige el
sentido y no la gramática: *O António **é** doente* (crónico) frente a *O
António **está** doente* (hoy); *a porta **é** aberta às nove* (rutina)
frente a *a porta **esteve** aberta a noite toda*. Ahí el español no ayuda
—porque en español las dos también existen y el reparto no coincide— y no
hace falta paréntesis ninguno: el hueco entre sujeto y predicado sólo
admite cópula.

### 2.3 Las 24 pistas, una a una

`hintEs` no llega al alumno (§5), pero es lo que un futuro revisor —o una
tarjeta futura— leerá como pista, así que la mido igual. **Ítems cuya
`hintEs` nombra o niega el lema de la respuesta: 12 de 12 en la
sección B.**

| id | `hintEs` | ¿da el lema? | ¿da la forma? |
|---|---|---|---|
| CL-13 | «un evento OCURRE: en portugués va con **ser**» | sí, literal | falta persona/tiempo |
| CL-14 | «otro evento con lugar y fecha: sigue siendo **ser**» | sí, literal | ídem |
| CL-15 | «si el sujeto se puede sustituir por «tem lugar», va con **ser**» | sí, literal | ídem |
| CL-16 | «**estado** pasajero — la segunda mitad dice que se le pasa» | sí, por «estado» ⇒ estar | ídem |
| CL-17 | «se ha enfriado: **estado** resultante, no cualidad» | sí, ídem | ídem |
| CL-18 | «la localización de un edificio prefiere **ficar**…» | sí, literal | ídem |
| CL-19 | «nacionalidad con **ser**» | sí, literal | «Eu» está en la frase ⇒ `sou` |
| CL-20 | «profesión con **ser**» | sí, literal | ídem |
| CL-21 | «**estado** resultante en un **periodo cerrado**» | sí | y el tiempo también |
| CL-22 | «característica del billete, **no estado** de hoy» | sí, por negación | ídem |
| CL-23 | «lo que el edificio **ES** —su época— frente a cómo **está** ahora» | sí, y las dos formas | ídem |
| CL-24 | «el tiempo de hoy: **estar**» | sí, literal | ídem |

En la sección A las doce pistas dan lema + persona pero **no** la
construcción, porque la glosa española va en subjuntivo en las doce (*para
que cojan*, *antes de que salieran*, *espero que traigas*) y el subjuntivo
español no distingue infinitivo pessoal de conjuntivo. Eso está bien
hecho. La excepción son **CL-10 y CL-11, cuya pista dice «(futuro)»** —
que es exactamente la elección bajo examen— y CL-12, futuro también, no lo
dice. La etiqueta «(futuro)» aparece en 2 ítems y los 2 son futuro.

**Conclusión de §2:** el paréntesis de la sección A ayuda sin regalar; el
trío de la sección B no regala más de lo que la propia frase ya regala en
español, pero tampoco añade nada y estropea CL-21. El verdadero
«regalo» —la `hintEs` que nombra el lema en 12/12— hoy es inofensivo
sólo porque es invisible, y eso es una bomba de relojería: el día que
alguien haga que `FillBlankCard` renderice una pista, la sección B pasa
de resolverse traduciendo a resolverse leyendo la respuesta.

---

## 3 · Sub-tipos: ¿seis ejercicios o el mismo seis veces?

### Sección A — **3 estructuras** en 12 ítems

| estructura | ítems | disparadores | ¿varían? |
|---|---|---|---|
| preposición + sujeto expreso + inf. pessoal | CL-01…CL-05 | `para`, `antes de`, `sem`, `depois de`, `para` | 4 disparadores en 5 ítems (`para` repetido); la estructura es idéntica |
| matriz adjetival + sujeto + inf. pessoal | CL-06 | (ninguno) | única — y es la que rompe la regla que el lote declara |
| matriz volitiva/impersonal + `que` + conj. presente | CL-07…CL-09 | `É preciso que`, `Convém que`, `Espero que` | tres matrices, una sola clase semántica |
| conjunción temporal/condicional + conj. futuro | CL-10…CL-12 | `Quando`, `Se`, `Assim que` | tres conjunciones, una sola clase |

Cuatro casillas, y la variación entre ítems de una misma casilla es
**léxica** (otro verbo, otro disparador de la misma clase), no
estructural. Lo que **no** aparece ni una vez: infinitivo simples (la
tercera construcción del punto, excluida a propósito), conjuntivo tras
matriz negada (*não creio que*), tras concesiva (*embora*, *ainda que*),
tras antecedente indefinido (*procuro alguém que*), tras `talvez`;
infinitivo pessoal en posición de sujeto pospuesto o tras `ao` + inf.;
y **la alternancia real**, que es el mismo disparador con y sin sujeto
expreso (*antes de sair* / *antes de eles saírem*), que es lo único que
obliga a entender la regla en vez de consultarla.

Doce ítems cierran el punto en la tabla de cobertura. **No lo cierran en
la realidad, y para la tercera construcción no lo cierran ni siquiera en
la tabla**: la ficha del mapa dice «la ELECCIÓN entre infinitivo pessoal,
conjuntivo e infinitivo simples» y el infinitivo simples tiene cero
ítems.

### Sección B — **5 estructuras** en 12 ítems, y una repetida tres veces

| estructura | ítems |
|---|---|
| evento + `é` + fecha/lugar | CL-13, CL-14, CL-15 ← **el mismo ejercicio tres veces** |
| estado transitorio + `está` + adjetivo | CL-16, CL-17 |
| estado transitorio en periodo cerrado + `esteve` | CL-21 |
| cualidad/identidad + `é` | CL-19, CL-20, CL-22, CL-23 |
| localización de edificio + `fica` | CL-18 |
| el tiempo atmosférico + `está` | CL-24 |

CL-13, CL-14 y CL-15 comparten marco (`SN-evento ___ [prep] fecha`),
respuesta (`é`) y regla (evento ⇒ ser). Tres ítems que valen uno. Con
ellos, la sección tiene **10 ejercicios distintos**, no 12.

---

## 4 · NIVEL, ítem por ítem

Referencia: el reparto habitual del PLE (Camões / QECR). Marco «lo que
hay que saber para acertar ESTE ítem», no «cuándo se menciona el tema».

| id | qué exige | nivel |
|---|---|---|
| CL-01 | `para` + sujeto + inf. pessoal regular | **B1** |
| CL-02 | ídem + hiato ortográfico (`saírem`) | **B2** |
| CL-03 | ídem, verbo monosilábico | **B1** |
| CL-04 | ídem, 1.ª plural | **B1** |
| CL-05 | ídem + `pôr` pierde el circunflejo + tratamiento `os senhores` | **B2** |
| CL-06 | inf. pessoal como sujeto de matriz adjetival, **sin preposición** | **B2/C1** ← el único candidato a C1 |
| CL-07 | conj. presente tras `É preciso que`, verbo irregular | **B1** |
| CL-08 | conj. presente tras `Convém que` + pasiva | **B1/B2** |
| CL-09 | conj. presente tras `Espero que`, `trazer` irregular | **B1** |
| CL-10 | fut. do conjuntivo de `ver` (`vires`), irregular | **B2** |
| CL-11 | fut. do conjuntivo de `querer` | **B2** |
| CL-12 | fut. do conjuntivo de `saber`, 1.ª plural | **B2** |
| CL-13 | evento con `ser` | **A2** |
| CL-14 | ídem | **A2** |
| CL-15 | ídem | **A2** |
| CL-16 | `estar` + adjetivo de estado | **A1** |
| CL-17 | ídem | **A2** |
| CL-18 | `ficar` de localización | **A2** |
| CL-19 | nacionalidad con `ser`, 1.ª sing. | **A1** |
| CL-20 | profesión con `ser` | **A1** |
| CL-21 | `estar` en pretérito perfeito, periodo delimitado | **B1** |
| CL-22 | `ser` de característica frente a `estar` de promoción temporal | **B2** (si se resolviera la ambigüedad; hoy es ambiguo) |
| CL-23 | `ser` de origen/época | **A2/B1** |
| CL-24 | `Como está o tempo?` — colocación fija | **A2** |

**Recuento: C1 = 0 (uno discutible, CL-06). B2 = 7. B1 = 7. A1-A2 = 9.**
La v1 tenía 3 de 24 en C1. **La v2 baja a 0.** El lote se declara C1 en el
título, cierra dos puntos de un bloque C1 y su mediana está en B1. La
sección B, que es la mitad del lote, es material de A1-A2 con paréntesis.

Y la razón es estructural, no de redacción: **un ítem de ser/estar es C1
sólo cuando las dos opciones son gramaticales y el contexto decide el
SENTIDO.** Los doce están construidos al revés — una opción correcta y
dos imposibles — que es el diseño de A2. El único que roza el diseño C1
es CL-16 (*é doente* 'enfermizo' / *está doente* 'hoy'), y el ítem lo
desactiva al no admitir la otra lectura.

---

## 5 · La `hintEs`, el `answer` y el runner

Verificado en el código y con la tarjeta renderizada, no supuesto.

### 5.1 Hay DOS runners y no corrigen igual

| ruta | componente | ¿se teclea? | ¿se revela la respuesta? | ¿pista? | ¿esContrast? |
|---|---|---|---|---|---|
| `/[lang]/practice/[lessonId]` | `ExerciseRunner` → `FillBlankCard` | **sí**, un input por hueco | sí, al enviar | **no existe campo** | no |
| `/[lang]/(review)/practicar/srs` | `SessionScreen` → `SessionCardDisplay` | **no**, ningún input | **NO** | no | sí |

Evidencia renderizada (test temporal, ya borrado):

```
$ npx vitest run tests/unit/tmp-revisor-lote11v2.test.tsx --reporter=verbose

ANCHO DEL INPUT (size) = 6 · longitud de «saírem» = 6
«sairem» → [ 'sairem', false ]
NFD «saírem» se ve igual: saírem · veredicto: false
TEXTO RENDERIZADO: "Antes de eles  (sair) de casa, deixámos a chave no sítio do costume.OK"
BLOQUE DE RESPUESTA: "Contraste ES: contraste de prueba"
¿aparece «saírem»? false
¿hay algún input donde teclear? 0
 ✓ 5 passed
```

La última mitad es el bloqueante: en el runner de repaso —el que mueve el
FSRS— un `fill_blank` se muestra como carta de revelar, **y al revelar no
enseña la respuesta**, porque `backFor()` (`SessionCardDisplay.tsx:35`)
busca `data.answer` y un `fill_blank` guarda la suya en
`data.blanks[i].answer`. El alumno ve la frase con el hueco, pulsa
«Mostrar respuesta», no aparece nada y tiene que autocalificarse. Los 24
ítems de este lote caen ahí en cuanto entran en repaso.

### 5.2 Corrección: alternativas sí, acentos también, NFC no

`FillBlankCard.tsx:16-19`:

```ts
const aciertaHueco = (b, valor) => {
  const v = valor.trim().toLowerCase();
  return b.answer.toLowerCase() === v || (b.alternatives ?? []).some((a) => a.toLowerCase() === v);
};
```

- **Alternativas: sí se aceptan**, y por hueco (arreglado en E2#10). CL-18
  es el único ítem del lote que las usa.
- **Mayúsculas: no distingue.** Ningún ítem depende de ello.
- **Acentos: sí distingue.** «sairem» ≠ «saírem» → CL-02 **sí enseña el
  hiato**, y CL-05 sí castiga «pôrem». Confirmado.
- **Pero no normaliza a NFC**, y es el **único** card de texto que no pasa
  por `lib/exercises/normalize.ts::answersMatch`. `ConjugationCard` y
  `ErrorCorrectionCard` sí; `TranslationCard` tampoco. Consecuencia
  medida arriba: «saírem» tecleado en forma descompuesta —visualmente
  idéntico, y es lo que producen algunos teclados y todo copiar-pegar de
  ciertas fuentes— **se puntúa incorrecto**.

### 5.3 La otra mitad: el alumno que teclea sin acentos en TODO el corpus

```
tipo                 tecleados  con diacrítico    %   normalizador
fill_blank                417         86      20.6%   toLowerCase() a pelo
translation               576        428      74.3%   toLowerCase() a pelo
conjugation                62          8      12.9%   answersMatch (NFC)
error_correction           66         41      62.1%   answersMatch (NFC)
TOTAL                    1121        563      50.2%
```

**La mitad exacta del corpus tecleable exige al menos un diacrítico**, y
en este lote son **11 de 24** respuestas (`é` ×6, `está` ×3, `façam`,
`saírem`).

Mi lectura, que es la que pide el encargo: **es las dos cosas, y hay que
separarlas.**

1. **Defecto, sin discusión:** que `FillBlankCard` y `TranslationCard` no
   usen el normalizador compartido. Hoy el mismo tecleo se acepta en una
   tarjeta y se rechaza en otra, y la variante NFD se rechaza en las
   cuatro sin que se distinga de un error real. Eso no es una política:
   es una inconsistencia. **Arreglo: rutar los cuatro cards por
   `answersMatch`.** Coste: cuatro líneas.
2. **Decisión de producto, que hay que declarar:** si el acento cuenta.
   Yo defiendo que **sí** —es ortografía portuguesa y `saírem` frente a
   `sairem` es justo lo que el lote quiere enseñar— pero un binario
   correcto/incorrecto sobre 563 ítems convierte cada tilde olvidada en
   una penalización de FSRS indistinguible de no saber la forma. La
   salida no es relajar la corrección: es **un tercer veredicto**. Marcar
   «casi: te falta el acento», mostrar la forma correcta, y calificar
   como `hard` (2) en vez de `again` (1). Se implementa comparando dos
   veces —exacta, y con los diacríticos plegados— y es una decisión de
   producto porque cambia lo que el FSRS aprende del alumno.
   **Al backlog, con nombre.**

---

## 6 · Fugas

**Entre ítems del lote: ninguna.** La respuesta de un ítem no aparece en
la frase de otro (comprobado; el gate propio del lote ya lo verifica
dentro de cada frase). El único roce es CL-23, cuya frase contiene «está»
—respuesta de CL-16, CL-17 y CL-24— pero en contraste explícito («é do
século dezanove, mas está todo remodelado»), que es didácticamente bueno,
no una fuga.

**De la lección al lote: siete ítems.** Ésta es la fuga que importa, y el
gate no la ve. La lección `b11-l5-eleccion-c1` —la que el alumno acaba de
leer, escrita en E2#13 a partir de este mismo lote— tiene cinco
`<Example>`, y los cinco reaparecen como **marco** de un ítem:

```
$ npx tsx scratchpad/leccion.ts

<Example> de la lección b11-l5-eleccion-c1: 5
  · Para os miúdos perceberem, explica outra vez.      → marco de CL-01
  · É preciso que façamos alguma coisa.                → marco de CL-07 (misma matriz Y mismo verbo)
  · A reunião é às três na sala grande.                → marco de CL-13, CL-14, CL-15
  · A biblioteca fica ao fundo da rua.                 → marco de CL-18 (edificio + fica + localización)
  · Este café está frio.                               → marco de CL-17 (comida + está + frío)

| candidato | ↔ | score | comparten |
|---|---|---:|---|
| CL-12 | LECCION-2: É preciso que façamos alguma coisa. | 0.341 | alguma, coisa |

pares candidato↔lección por encima de 0,34: **1**
```

**El gate encuentra un par y es el equivocado.** Empareja CL-12 («Assim
que nós soubermos alguma coisa de concreto») con el ejemplo de la lección
por compartir *alguma coisa* —léxico irrelevante— y no ve ninguna de las
cinco coincidencias reales. La causa está en el diseño del gate y es
demostrable:

```
Palabras que el gate IGNORA por vacías y que son el pivote de este lote:
  sección A (disparadores): para, sem, que, se, de
  sección B (respuestas):   é, está, ser, estar, foi, era
```

La lista `VACIAS` de `scripts/lib/virginidad.ts:75` contiene
literalmente **las respuestas de la sección B y los disparadores de la
sección A**. El gate pondera por IDF, que es lo correcto para detectar
duplicación **léxica**, y las fugas de este lote son **construccionales**.
Un «0 pares por encima de 0,5» no es evidencia de nada para estos dos
puntos. (CL-17 vs «Este café está frio» además falla por otro motivo:
`frio` y `fria` son tokens distintos.)

**Y el gate que el documento dice haber corrido no existe en el repo.** El
doc encabeza su bloque de virginidad con «24 candidatos contra 2445
publicados **+ 140 `<Example>` de lecciones**», y la cabecera del lote
atribuye a ese índice el haber cazado cuatro frases copiadas de la
lección. `scripts/check-virginidad.ts::cargarCorpus` lee **sólo**
`lib/data/languages/pt/blocks/b*.json`, y `scripts/lib/virginidad.ts:69`
declara `lesson: []` (una lección no aporta texto indexable). Corrida en
vivo:

```
$ npx tsx scripts/check-virginidad.ts --nuevos <los 24 candidatos>
corpus indexado: 2445 ejercicios · 9734 tipos de palabra · umbral 0.34
...
0.372  CL-01 ↔ 2b5b85b8 (b3 verb_preposition)   comparten: colega, sair
0.357  CL-05 ↔ 55e124a1 (b4 fill_blank)         comparten: trouxe, documento
0.477  CL-06 ↔ 4fd78c34 (b7 conjugation)  [texto ínfimo]   comparten: serem
0.349  CL-07 ↔ 182b84cf (b1 translation)  [texto ínfimo]   comparten: mês
0.375  CL-15 ↔ 8b9118d0 (b1 fill_blank)         comparten: avó, ano, minha
0.356  CL-15 ↔ 07d20060 (b3 verb_preposition)   comparten: avó, domingo, minha
0.353  CL-21 ↔ 72ae98a9 (b2 fill_blank)         comparten: aberta, porta
pares por encima del umbral: **5 fiables** + 2 contra ítems de texto ínfimo
```

**5 pares fiables, no los 3 que el documento pega**, y dos de ellos
(CL-01 y CL-05) no aparecen en el doc. La cifra pegada no se reproduce
con el comando del repo. Es exactamente el modo de fallo que el sello
`revBateria` de `preflight-lote.ts` existe para impedir — sólo que ese
sello no cubre este lote, porque **`preflight-lote.ts` sólo sabe leer
ítems `GJ-` (juicios)**: para un lote de cloze, el preflight obligatorio
del proyecto no corre en absoluto. Ni batería, ni molde, ni sello.

---

## 7 · Barrido: qué otros campos escribe el proyecto que la tarjeta no muestra

Lo que pedía el encargo nuevo, y coincido en que vale más que el lote.
`hintEs` en `fill_blank` no era un caso aislado: es una familia, y tiene
tres formas distintas.

### 7.1 Campos que el schema ni siquiera admite

```
$ npx tsx scratchpad/probe.ts
PARSE OK. Claves que sobreviven: [ 'sentence', 'blanks' ]
hintEs presente? false
```

`FillBlankData` es un `z.object`, así que **acepta el ítem con `hintEs` y
lo tira sin decir nada**. No hay error, no hay aviso. Cualquier campo que
un lote invente sobre un tipo existente desaparece en el `parse`. Lo
mismo le habría pasado a `ancla`, `lema`, `persona` y `construccion` de
este lote: de los nueve campos que `ItemCloze` declara, **sobreviven a la
publicación dos**. La garantía central del lote —el ancla— no llega al
corpus, y con ella se pierde la posibilidad de re-auditar el ítem
publicado.

### 7.2 Campos del schema que la tarjeta correspondiente no nombra

```
tipo                     tarjeta                      campo que NO usa
flashcard                FlashcardCard                example (523 ítems)
fill_blank               FillBlankCard                blanks[].position (452 huecos)
listening                ListeningCard                audioText (179 ítems)
mediation                MediationCard                sourceLang, targetLang (183 ítems)
```

- **`flashcard.example`, 523 ítems.** `FlashcardCard` (el runner de
  lección) no lo renderiza; `SessionCardDisplay` (el de repaso) sí. Media
  frase de ejemplo por tarjeta, visible en una ruta e invisible en la
  otra. Es el mismo fallo que `hintEs` a mayor escala.
- **`blanks[].position`, 452 huecos.** No lo lee nadie: la tarjeta empareja
  input *i* con `blanks[i]`. Hoy es inocuo (0 ítems con desajuste entre nº
  de `___` y nº de blanks) pero **8 ítems ya tienen posiciones que no
  coinciden con el orden del array** (`[0,3]`, `[1]`, `[2]`). Un campo que
  parece autoritativo, que nadie valida y que ya está mal en 8 sitios es
  una trampa esperando a que alguien lo empiece a usar.

### 7.3 El caso grave: el runner de repaso improvisa

`SessionCardDisplay` no tiene tratamiento por tipo. Su `frontFor()` cae en
«el primer campo string que encuentre» y su `backFor()` en «`data.answer`
si existe».

```
El «front» del runner de repaso = primer campo string de data:
  translation              → data.source   (576)
  flashcard                → data.front    (542)
  fill_blank               → data.sentence (417)
  mediation                → data.sourceText (183)
  verb_preposition         → data.verb     (180)   ← sólo el verbo, sin la frase
  listening                → data.audioText (179)  ← EL TEXTO QUE HABÍA QUE OÍR
  grammaticality_judgment  → data.sentence (160)
  multiple_choice          → data.question (75)
  error_correction         → data.sentence (66)
  conjugation              → data.infinitive (62)  ← sin persona ni tiempo

ítems cuyo bloque de respuesta sale VACÍO al pulsar «Mostrar respuesta»:
  translation 576 · fill_blank 417 · mediation 183 · grammaticality_judgment 160
  multiple_choice 75 · error_correction 66 · matching 5   →  1482 de 2445 (61 %)
```

Tres hallazgos, por orden de gravedad:

1. **1.482 ítems (61 % del corpus) no muestran su respuesta al revelarla**
   en la ruta de repaso. El alumno se autocalifica a ciegas y el FSRS
   registra el resultado.
2. **Los 179 ítems de `listening` imprimen la transcripción como
   titular.** El ejercicio consiste en escuchar y responder; la ruta de
   repaso enseña el texto antes de que suene el audio. Está anulado por
   construcción, no por contenido.
3. **`esContrast` (1.586 ítems) sólo se ve en dos sitios**: en
   `SessionCardDisplay` (todos los tipos) y en `FlashcardCard`. En el
   runner de lección, **1.204 ítems no-flashcard llevan un contraste con
   el español que nadie lee**.

Recomendación de método, que es lo que evita la próxima: **un test que
cruce cada `ExerciseDataByTypeSchema[t]` con los campos que la tarjeta de
`t` referencia, y falle si un campo del schema no aparece en su tarjeta
sin una exención declarada con motivo** — exactamente el patrón de
`audioExento`, que el proyecto ya inventó para este mismo problema en el
audio. Un campo invisible es una decisión; una decisión sin firma es un
olvido.

---

## 8 · Bloqueantes (lista cerrada)

| # | bloqueante | evidencia |
|---|---|---|
| 1 | **Sección B: la traducción al español resuelve 12/12** (p = 1,9·10⁻⁶). El punto declara divergencia y no diverge en ningún ítem — peor que la v1 (11/12). No se arregla con formato ni con edición de frases: hay que elegir los casos divergentes de verdad. | §1.2, §1.3 |
| 2 | **El trío `(ser / estar / ficar)` no fija el tiempo: CL-21 es irresoluble** tal como se renderiza (pide `esteve`; la única pista que lo justificaba es `hintEs`, invisible). | §2.2, §5.1 |
| 3 | **Siete ítems de la sección B rechazan una respuesta defendible con `alternatives: []`**: CL-13/14/15 (`será`, `vai ser` para eventos futuros), CL-16 (`ficou doente`), CL-17 (`ficou fria`, más idiomático que `está fria` tras «ninguém se lembrou de a tapar»), CL-21 (`ficou`, `estava`), CL-22 (`está gratuita` durante una promoción de un mes). El trío las **invita** y el runner las castiga en el FSRS. *(Confirmación de cada una: revisor de gramática.)* | §2.2, §4 |
| 4 | **Nivel: 0 de 24 ítems son C1** (uno discutible). La v1 tenía 3. La sección B es A1-A2. El lote cierra dos puntos de un bloque C1 con material de B1. | §4 |
| 5 | **Cobertura falsa**: 3 estructuras en la sección A y 5 en la B; CL-13/14/15 son el mismo ejercicio tres veces; la tercera construcción del punto A (infinitivo simples) tiene **cero** ítems y el punto se declara «cierra (12)». | §3 |
| 6 | **Atajo de posición, 12/12 (p = 0,0002)**: el lote está ordenado por construcción y ése es el orden de introducción del SRS. Hay que intercalar. | §1.2 |
| 7 | **Fuga lección→lote en 7 ítems**: las 5 `<Example>` de `b11-l5-eleccion-c1` son el marco de CL-01, CL-07, CL-13, CL-14, CL-15, CL-17 y CL-18. El gate detecta 1 par y es el equivocado, porque su lista de palabras vacías contiene las respuestas y los disparadores del lote. | §6 |
| 8 | **La cifra de virginidad pegada no reproduce**: el comando del repo da **5 pares fiables** (CL-01 0,372 · CL-05 0,357 · CL-15 ×2 · CL-21) frente a los 3 del documento, y el índice «+140 `<Example>`» que el doc y la cabecera del lote invocan **no existe en el repo**. | §6 |
| 9 | **Anclas que no anclan.** CL-06: ancla «os alunos», que no excluye «É difícil **que** os alunos sejam» — lo que excluye el conjuntivo es la AUSENCIA de `que`, y una ausencia no puede ser un ancla; además CL-06 no tiene preposición, así que contradice la regla que el propio lote declara en su cabecera. CL-07/08/09: «que X» excluye el infinitivo pessoal pero no el futuro do conjuntivo. CL-18 y CL-22: el ancla es decorativa (no interviene en la elección). | §1.3, §3 |
| 10 | **Fuga por el ancho del input en 5 de 24** (CL-01, CL-04, CL-07, CL-09, CL-12): `size={Math.max(6, answer.length)}` descarta la forma rival antes de teclear, y los cinco son ítems donde la elección de paradigma es lo que se mide. | §1.3 |
| 11 | **El runner de repaso no puede corregir un cloze**: sin input y sin revelar la respuesta (`backFor` busca `data.answer`, que un `fill_blank` no tiene). Los 24 ítems son incorregibles en la ruta que mueve el FSRS. | §5.1 |
| 12 | **`FillBlankCard` es el único card de texto que no usa `answersMatch`**: «saírem» en NFD —visualmente idéntico— se puntúa incorrecto, y 11 de las 24 respuestas del lote llevan diacrítico. | §5.2 |

**Avisos** (no impiden publicar, pero van al backlog): `blanks[].position`
muerto y ya inconsistente en 8 ítems · `flashcard.example` invisible en el
runner de lección (523) · `esContrast` invisible en el runner de lección
para 1.204 ítems no-flashcard · `listening.audioText` impreso como
titular en la ruta de repaso (179) · `mediation.sourceLang/targetLang` sin
uso (183) · `preflight-lote.ts` no sabe leer un lote que no sea de
juicios, así que ningún lote de cloze pasa hoy por el preflight
obligatorio.

---

## 9 · Qué está bien, y es específico

No es cortesía: sin esto no se puede decidir qué se conserva.

1. **El diagnóstico de la v1 era correcto y la reacción fue la correcta.**
   Cambiar de formato cuando el problema es del formato, en vez de
   reescribir frases, es la decisión difícil y es la buena. Que en la
   sección B no baste es un problema del *contenido del punto*, no de esa
   decisión.
2. **La sección A está bien construida como material.** El reparto 6-6
   neutraliza la respuesta constante, el paréntesis da el mínimo
   imprescindible sin regalar (medido: 6/12, p = 0,18), y las dos
   familias de glosa española van en subjuntivo las doce veces, de modo
   que la traducción no distingue las construcciones — **0/12 para el
   resolutor de traducción**, que es lo contrario de lo que pasa en la
   sección B. Es la prueba de que el equipo sabe hacerlo cuando el punto
   se deja.
3. **Excluir el infinitivo simples fue correcto.** Un hueco que admite
   dos respuestas correctas no es un ítem. Aplicar la cicatriz de E2#11
   *antes* de escribir en vez de después del round es exactamente el
   cambio de proceso que hacía falta. (Lo que hay que corregir no es la
   exclusión: es declarar el punto cerrado a pesar de ella.)
4. **CL-10 con `ver` en vez de `chegar` es un acierto fino.** «chegares»
   es a la vez futuro do conjuntivo e infinitivo pessoal y el ítem no
   habría discriminado; «vires» frente a «veres» sí. Y lo cazó un gate,
   no un revisor, que es como tiene que ser.
5. **El acento de `saírem`**: el conjugador se arregló con cinco tests, y
   el runner sí distingue el acento. CL-02 y CL-05 enseñan lo que dicen
   enseñar. Era la mitad del punto 5 del encargo y la respuesta es que
   está bien.
6. **CL-20 y CL-23 tienen la única didáctica de nivel del lote**: el
   contraste dentro de la misma frase («é professora… embora esteja a
   dar», «é do século dezanove, mas está todo remodelado») enseña la
   oposición en vez de preguntarla. Si la sección B se rehace, es de ahí
   de donde hay que partir.
7. **El gate propio del lote es mejor que el preflight del proyecto para
   este formato**: recalcula las formas contra el paradigma, exige un
   hueco, exige ancla presente, prohíbe que la respuesta esté en la
   frase y ahora exige el paréntesis. Le faltan tres comprobaciones —la
   batería de cloze, el reparto por LEMA en vez de por forma, y que el
   ancla *determine* en vez de *estar*— y con ellas sería el gate de
   referencia para todos los cloze que vienen.
