# Lote 12 — informe PEDAGÓGICO y de DISEÑO

**Revisor:** pedagogía y diseño (no gramática — de la gramática se ocupa otro).
**Documento revisado:** `docs/contenido/2026-09-03-lote12-c2-mesoclise.md`, **v2**
(la reconstruida tras el dry-run del publicador).
**Generador:** `scripts/lotes/lote12-pares.ts` · **biblioteca:** `scripts/lib/pares-minimos.ts`
· **tests:** `tests/unit/pares-minimos.test.ts` · **batería:** `scripts/lib/atajos.ts` rev `4cc7a606`.

---

## Veredicto global: **NO**

No es «este lote está mal escrito». Las doce frases son defendibles y el
preflight es honesto y reproducible — lo he vuelto a correr y sale idéntico
al pegado. El **NO** es por otra cosa, y es una sola frase:

> **El punto se llama «la mesóclise como recurso de estilo» y no hay un solo
> ítem en el que la mesóclise sea una elección.** En los seis pares es
> OBLIGATORIA o IMPOSIBLE. El propio generador lo dice en su cabecera y lo
> presenta como la virtud que hizo elegir este punto: *«esa oposición es
> CATEGÓRICA en la norma europea»* (`lote12-pares.ts:16-18`). Una oposición
> categórica es, por definición, lo contrario de un recurso de estilo.

El punto se eligió **porque** daba veredictos inequívocos, y los veredictos
inequívocos son precisamente los que no puede haber en el punto tal como el
currículo lo define. Es el mismo mecanismo que la sesión acaba de destapar
midiendo: `b5-futuro-composto` acumuló 54 ítems donde el futuro composto no
aparece ni una vez. Aquí serían 12 ítems bajo «mesóclise como elección»
donde no hay ni una elección.

Publicarlo así cierra un punto en la tabla y no cierra nada en la cabeza de
nadie. Y no es reparable con retoques: **hay que rehacer la mitad del lote**,
que es barato (el generador funciona) y hay que hacerlo ahora.

**Bloqueantes: 8** (más 4 avisos que no bloquean). Lista cerrada al final.

---

## 1 · La tesis de los pares mínimos: cierta, pero prueba mucho menos de lo que se le atribuye

### 1.1 Lo que la tesis SÍ prueba (y es un teorema, no un hallazgo)

Si el BIEN y el MAL salen del mismo esqueleto, cualquier rasgo binario que
no mire el hueco vale igual en los dos miembros. Aporta un acierto y un
fallo. Con 6 pares, exactamente 6/12. Es aritmética, no evidencia.

Y el proyecto ya lo sabe, porque está escrito como aserción en el test:

```
tests/unit/pares-minimos.test.ts:96-108
  it('y los rasgos de TEXTO caen exactamente en el azar, no «cerca»', () => {
    const deTexto = bateria(items).filter((a) => !/posición|más corta/.test(a.nombre));
    for (const a of deTexto) expect(a.aciertos, a.nombre).toBe(12);
```

**Consecuencia que nadie ha escrito:** en un lote de pares, la sección
«Atajos» del preflight tiene **dos grados de libertad, no once**. Ocho de los
once rasgos están clavados en 6/12 por teorema. Reportarlos con su
`p = 0,613` presenta un teorema como si fuera una medición.

El documento dice que *«la batería de atajos deja de ser el motor del diseño
y pasa a ser verificación»*. Es al revés: **la batería deja de verificar.**
Antes de los pares, un 6/12 significaba «he mirado y no hay nada». Ahora
significa «no he mirado». La potencia de verificación no se ha trasladado a
otro sitio: se ha evaporado, y el round humano tiene que absorberla entera
sin que nadie lo haya dicho.

### 1.2 Agujero 1 — los rasgos RELATIVOS no están clavados, y ya se movieron

La pista (a) del encargo es correcta y ya está pasando **en este lote**. Los
dos rasgos de longitud relativa a la mediana dieron 6/12 en la v1 y **7/12
en la v2**, sin que nadie tocara el diseño anti-atajos: sólo se reescribieron
tres esqueletos.

```
| rasgo                              | v1     | v2     |
|------------------------------------|--------|--------|
| más corta que la mediana (palabras)| 6/12   | 7/12   |
| más corta que la mediana (caracteres)| 6/12 | 7/12   |
```

Y la frontera es más frágil de lo que el 7/12 sugiere. Medido sobre la v2
(salida pegada abajo, § 1.6): cambiar el desempate de `<` a `≤` mueve el
rasgo de 7/12 a 7/12 pero le cambia la DIRECCIÓN (`presente⇒MAL` →
`presente⇒BIEN`), es decir el rasgo no está midiendo nada estable, está
midiendo dónde cayó la mediana. Un rasgo relativo al lote **no es un rasgo
del ítem**, y la garantía del par no le aplica. Está bien que el test lo
excluya explícitamente; está mal que el documento del lote lo incluya en el
«todo rasgo que no mire ese tramo vale exactamente igual».

**Corrección al texto del documento (bloqueante menor, va en B-8):** la frase
«Todo rasgo que no mire ese tramo … vale exactamente igual en los dos
miembros del par» es falsa como está escrita. Lo cierto es: *todo rasgo que
sea función únicamente del texto del ítem*. Los rasgos relativos al lote y
los de posición quedan fuera, y son 3 de los 11.

### 1.3 Agujero 2 — el atajo que SÍ resuelve el lote: 12/12, p = 0,0002

Ésta es la pista (d) y está abierta de par en par. La regla:

> «Si la frase contiene **não**, **nunca** o **ninguém** → es BIEN si el
> clítico NO va con guion. Si no contiene ninguna de esas tres palabras →
> es BIEN si el clítico SÍ va con guion.»

Medido:

```
## A · ¿resuelve el lote una regla de bolsa de palabras?

| regla | aciertos | p |
|---|---:|---:|
| A1 · léxico ESTRECHO {não, nunca, ninguém} XOR mesóclise | **12/12** | 0.0002 |
| A2 · léxico REAL del proyecto (17 atractores) XOR mesóclise | **6/12** | 0.6128 |
```

Hay que leer las dos filas juntas, porque la conclusión está en el contraste:

- **A1 = 12/12.** Una regex de tres palabras resuelve el lote entero. p = 0,0002,
  cuatro veces más significativo que el atajo de la LONGITUD (13/16, p = 0,011)
  que hizo cambiar el método.
- **A2 = 6/12.** La misma regla con la lista de atractores que **el propio
  proyecto enseña** (`scripts/lib/conceptos-finos.ts:408-409`: `não|nunca|
  nada|ninguém|nenhum|jamais` + `já|também|sempre|ainda|só|talvez|todos|
  tudo|quem|que|onde|quando`) cae al azar.

O sea: la regla que gana es **estrictamente más pobre** que la destreza. No
es «el rasgo juzgado detectado por otro nombre» — es la destreza amputada a
su tercio más fácil. Un alumno que memorice A1 saca 12/12 aquí y falla en
`Talvez lhe diga`, `Só te direi`, `Quem to disse`, `Que me digas`, `Já lhe
disse` — todos ellos atractores que el proyecto ya enseña en B2 con 10 ítems
(`b8-coloc-proclise-adverbio`).

El defecto de diseño concreto: **el lote no contiene ni un solo ítem que
distinga «hay un atractor en la frase» de «hay un atractor que gobierna este
verbo».** Los seis pares son un mapeo uno-a-uno de tres palabras a tres
pares, y los otros catorce atractores de la lista no aparecen nunca en
posición gobernante.

**El arreglo es un par, y es barato.** Un par donde el atractor esté presente
y NO gobierne, de modo que la mesóclise sea la forma buena:

```ts
{
  id: 'P-07', concepto: CONCEPTO,
  rasgo: 'un atractor dentro de una subordinada POSTERIOR no gobierna el verbo principal',
  esqueleto: 'O tribunal {} que o prazo não pode ser prorrogado.',
  bien: 'dir-lhe-á', mal: 'lhe dirá',
  // A1 predice MAL sobre el BIEN («contiene não» ⇒ próclise) y falla.
}
```

Con ese par en el lote, A1 baja de 14/14 a 12/14 (p = 0,0065 → 0,0287) y con
dos pares así a 10/14 (p = 0,090): deja de ser significativo. **Y no hay que
inventar el gate: el rasgo A1 hay que meterlo en `atajos.ts` como rasgo
número doce**, porque un lote que se resuelve con una lista cerrada de tres
palabras es exactamente lo que la batería existe para cazar y hoy no lo caza.

```ts
// scripts/lib/atajos.ts — RASGOS, añadir:
{
  nombre: 'la colocación se predice con un léxico de 3 atractores (bolsa de palabras)',
  f: (x) => /(?<![\p{L}])(não|nunca|ninguém)(?![\p{L}])/iu.test(x.sentence)
         !== /[\p{L}]-(?:me|te|lhe|nos|lhes|o|a|os|as|lo|la|los|las)-(?:ei|ás|á|emos|ão|ia|ias|íamos|iam)(?![\p{L}])/iu.test(x.sentence),
},
```

### 1.4 Agujero 3 — el señuelo «já» está en el lote y nadie lo explica

Efecto colateral bueno de la reconstrucción v2: los esqueletos nuevos de
P-04 y P-05 empiezan por «O presidente **já** sabe do caso e…» y «O programa
**já** está fechado e…». `já` **es un atractor de próclise** de la lista
cerrada que el proyecto enseña en B2. Aquí no gobierna, porque está en la
otra cláusula coordinada. Eso es exactamente el señuelo que hace falta.

Pero está sin declarar y sin explicar:

```
## B · señuelos: atractores de la lista que NO gobiernan

| ítem | atractores presentes | el que gobierna | señuelos NO explicados |
|---|---|---|---|
| GJ-03 | já | — | já |
| GJ-05 | já | — | já |
| GJ-07 | já | — | já |
| GJ-10 | já | — | já |
```

La explicación de GJ-10 se molesta en excusar la coordinación —*««e»
coordina, no atrae»*— y **no menciona el «já» que está tres palabras antes**.
Un alumno que hizo los 10 ítems de `b8-coloc-proclise-adverbio` ha aprendido
`já me disse` → próclise. Al ver «O presidente já sabe do caso e a direção
informá-lo-á» va a marcar MAL por la razón correcta según lo que se le
enseñó, y la explicación no le va a decir dónde está su error. **Es un ítem
que castiga haber aprendido bien la lección anterior.**

No es un bloqueante de contenido sino de glosa, y se arregla en cuatro
líneas: las explicaciones de GJ-03, GJ-05, GJ-07 y GJ-10 tienen que decir
que el «já» pertenece a la primera cláusula y por eso no alcanza al verbo de
la segunda. Bien explicado, esos cuatro ítems suben de B2 a C1 y son lo
mejor del lote.

### 1.5 Agujero 4 — la memoria de reconocimiento: 9/12 sin saber portugués

Éste no es un rasgo del ítem, y por eso la batería, que es **por ítem**, no
puede verlo ni en principio. El `repair` de cada MAL es literalmente el BIEN
de su par, y el BIEN de su par **también está en el lote**:

```
## el repair de cada MAL, ¿está en el lote como BIEN?

- GJ-04 repair ≡ GJ-01
- GJ-05 repair ≡ GJ-10
- GJ-07 repair ≡ GJ-03
- GJ-08 repair ≡ GJ-02
- GJ-09 repair ≡ GJ-12
- GJ-11 repair ≡ GJ-06
```

Y `GrammaticalityJudgmentCard.tsx:54-58` **imprime el repair en pantalla**
después de contestar. De modo que el segundo miembro de cada par llega al
alumno ya resuelto: o bien ya vio esa frase exacta con la etiqueta contraria,
o bien se la acaban de enseñar como «forma correcta».

```
## Estrategia SIN portugués que explota el par (memoria de reconocimiento)

- ítems que son SEGUNDA aparición de su par: **6/12** → deterministas tras el feedback del primero
- acierto esperado: 6 + 6×0,5 = **9/12** (75 %)
- P(que esa estrategia saque ≥10/12, o sea que dispare el propio gate) = 34.4 %
- P(≥9/12) = 65.6 %
```

**Los pares mínimos SUBEN el techo de la estrategia sin conocimiento del
50 % al 75 %.** Ese es el coste que el método no ha declarado.

Y la separación mínima lo empeora en vez de mitigarlo: `SEPARACION_MINIMA = 3`
garantiza que los dos miembros están **cerca**, no lejos. Medido:

```
| par | posiciones | distancia | primero servido |
|---|---|---:|---|
| P-01 | 9 y 12 | 3 | MAL |
| P-02 | 1 y 4 | 3 | BIEN |
| P-03 | 6 y 11 | 5 | BIEN |
| P-04 | 5 y 10 | 5 | MAL |
| P-05 | 3 y 7 | 4 | BIEN |
| P-06 | 2 y 8 | 6 | BIEN |
```

Ninguno pasa de 6. En una sesión de 12 cartas están los doce. Y el
interleaver no ayuda: `lib/srs/interleave.ts:21-24` puntúa por *concepto* y
*tipo*, y los doce ítems comparten los dos, así que todos empatan y el orden
se conserva.

**Regla nueva, y hay que escribirla** (§ 5).

### 1.6 La tabla de atajos completa, medida sobre la v2

Reproducción exacta de la batería del preflight más los rasgos que la
batería no tiene. Comando:
`npx tsx <scratch>/medir.ts` sobre `docs/contenido/2026-09-03-lote12-c2-mesoclise.md`.

```
## batería real (11 rasgos) — reproducción

| rasgo | aciertos | dirección | presente en | p |
|---|---:|---|---:|---:|
| posición par en el lote (alternancia mecánica) | **8/12** | presente⇒MAL | 6 | 0.1938 |
| más corta que la mediana (palabras) | **7/12** | presente⇒MAL | 5 | 0.3872 |
| más corta que la mediana (caracteres) | **7/12** | presente⇒MAL | 5 | 0.3872 |
| arranca con adjunto o subordinada, no con el sujeto o el verbo | **6/12** | presente⇒BIEN | 2 | 0.6128 |
| lleva una coma (frase con coleta) | **6/12** | presente⇒BIEN | 2 | 0.6128 |
| lleva marcador temporal | **6/12** | presente⇒BIEN | 6 | 0.6128 |
| lleva una palabra visiblemente española | **6/12** | presente⇒BIEN | 2 | 0.6128 |
| lleva verbo en primera persona | **6/12** | presente⇒BIEN | 0 | 0.6128 |
| lleva clítico con guion (ênclise/mesóclise) | **6/12** | presente⇒BIEN | 6 | 0.6128 |
| lleva preposición contraída (do/da/no/na/ao/à/pelo) | **6/12** | presente⇒BIEN | 4 | 0.6128 |
| lleva dos o más oraciones (punto o punto y coma interior) | **6/12** | presente⇒BIEN | 0 | 0.6128 |

## rasgos NUEVOS (fuera de la batería)

| rasgo | aciertos | dirección | presente en | p |
|---|---:|---|---:|---:|
| X1 · es la PRIMERA aparición de su par en el lote | **8/12** | presente⇒BIEN | 6 | 0.1938 |
| X2 · está en la primera mitad del lote | **8/12** | presente⇒BIEN | 6 | 0.1938 |
| X3 · más corta que la MEDIA (palabras) | **7/12** | presente⇒BIEN | 7 | 0.3872 |
| X4 · más corta que la MEDIA (chars) | **7/12** | presente⇒MAL | 7 | 0.3872 |
| X5 · ≤ mediana chars | **7/12** | presente⇒MAL | 7 | 0.3872 |
| X6 · ≤ mediana palabras | **7/12** | presente⇒BIEN | 7 | 0.3872 |
| X7 · lleva guion clítico (control) | **6/12** | presente⇒BIEN | 6 | 0.6128 |
| X8 · lleva atractor léxico (não/nunca/ninguém) | **6/12** | presente⇒BIEN | 6 | 0.6128 |
| X9 · DESTREZA amputada (atractor estrecho XOR mesóclise) | **12/12** | presente⇒BIEN | 6 | 0.0002 |
| X10 · clítico suelto delante del verbo (próclise visible) | **6/12** | presente⇒BIEN | 6 | 0.6128 |
| X11 · verbo del hueco en 3.ª persona sg. | **6/12** | presente⇒BIEN | 4 | 0.6128 |

## C · rasgos RELATIVOS (al lote y al par)

| rasgo | aciertos | dirección | p |
|---|---:|---|---:|
| C1 · es el miembro MÁS LARGO de su par (chars) | **6/12** | presente⇒BIEN | 0.6128 |
| C2 · es el miembro MÁS LARGO de su par (palabras) | **6/12** | presente⇒BIEN | 0.6128 |
| C3 · su par aparece por PRIMERA vez aquí | **8/12** | presente⇒BIEN | 0.1938 |
| C4 · rango de longitud impar dentro del lote | **6/12** | presente⇒BIEN | 0.6128 |
```

Notas de lectura, porque la tabla sola engaña:

- **C1/C2 = 6/12 no es mérito del par.** «Ser el miembro más largo de mi par»
  es un rasgo *relativo al par*, y el par no lo protege: la mesóclise es
  siempre un carácter más larga. Sale 6/12 **sólo porque en 3 pares la
  mesóclise está en el BIEN y en 3 en el MAL**. Ese 3/3 no lo garantiza
  ningún gate: es una frase en el comentario de cabecera del generador
  (`lote12-pares.ts:23-26`). Con un 4/2 el rasgo daría 8/12 (p = 0,19) y la
  batería no lo bloquearía; con 5/1 daría 10/12 y sí. **Falta un gate que
  compruebe el equilibrio del rasgo juzgado, en vez de confiarlo a la prosa.**
- **Tres rasgos distintos dan 8/12** (posición 0-based par, primera aparición
  del par, primera mitad del lote). Ninguno significativo; con 15 rasgos
  medidos, ver al menos un 8/12 tiene probabilidad ≈ 0,95. No es hallazgo.
  El hallazgo está en lo siguiente.

### 1.7 El problema real de la sección de atajos: a N = 12 el gate no puede detectar casi nada

```
## Potencia del gate binomial a N=12

| N | umbral p<0.05 | potencia vs atajo 67 % | potencia vs atajo 75 % | potencia vs atajo 83 % |
|---:|---|---:|---:|---:|
| 12 | ≥10/12 | 18 % | 39 % | 68 % |
| 16 | ≥12/16 | 34 % | 63 % | 89 % |
| 20 | ≥15/20 | 30 % | 62 % | 90 % |
| 24 | ≥17/24 | 42 % | 77 % | 96 % |
| 36 | ≥24/36 | 58 % | 91 % | 100 % |
| 48 | ≥31/48 | 68 % | 96 % | 100 % |
```

Con 12 ítems hacen falta **10 aciertos (83 %)** para disparar. Un atajo que
resuelve tres de cada cuatro ítems escapa el **61 %** de las veces. Un atajo
al 67 % escapa el 82 %.

Y esto interactúa muy mal con el diseño por pares, porque **el lote de 12 es
en realidad un lote de 6**: la unidad de información independiente es el par,
no el ítem. Un rasgo que mira el hueco tiene 6 observaciones efectivas, no 12.

**Recomendación de calibración (aviso, no bloqueante):** los lotes de juicio
por pares no deberían bajar de 24 ítems (12 pares). El coste marginal es
casi nulo —el generador ya está escrito— y es la diferencia entre 39 % y
77 % de potencia contra el atajo que de verdad preocupa.

---

## 2 · El límite del método que el fallo de la v1 dejó al descubierto

Esto responde a las dos preguntas del coordinador y, en mi opinión, es lo
más valioso que sale de este lote — más que el lote.

### 2.1 El enunciado general, que hay que escribir en la skill

> **El par mínimo compra validez DIFERENCIAL y no compra ni un gramo de
> validez ABSOLUTA.** Garantiza que los dos miembros difieren sólo en el
> tramo juzgado. No dice nada sobre si alguno de los dos es un ítem bueno.
> Y todo defecto **compartido** por los dos miembros es, por construcción,
> invisible tanto para `verificarPar()` como para la batería: la batería lo
> puntúa 6/12 —«limpio»— tanto si el rasgo compartido es inocuo como si es
> letal.

El fallo de la v1 es la instancia canónica y no fue mala suerte. El objeto
duplicado estaba en el BIEN **y** en el MAL. La batería lo midió, le dio
6/12, y firmó «preflight limpio» mientras 4 de 12 ítems eran agramaticales
por una razón que el ítem no juzga. **El gate no falló por descuido: hizo
exactamente lo que sabe hacer.**

Verificado en código — `verificarPar()` no ve nada en los pares rotos de la v1:

```
### control · `verificarPar` actual sobre la v1 rota

- v1P-03: SIN VIOLACIONES (pasa el gate actual)  → «A comissão nunca o decidirá sem ouvir primeiro as duas partes.»
- v1P-04: SIN VIOLACIONES (pasa el gate actual)  → «A direção comunicá-lo-á o resultado assim que a comissão terminar a votação.»
- v1P-05: SIN VIOLACIONES (pasa el gate actual)  → «O secretariado enviá-lo-á o programa definitivo na semana que vem.»
```

**Precisión sobre el diagnóstico del coordinador**, porque cambia la
respuesta a «¿es automatizable?»: de los tres pares tocados, **sólo dos
tenían objeto duplicado**. P-03 v1 —«A comissão nunca **o** decidirá sem
ouvir primeiro as duas partes»— no lleva ningún objeto directo explícito
detrás; lo que le pasaba es la *otra* cosa, que el clítico acusativo no
tiene antecedente. Son dos defectos distintos con dos automatizabilidades
distintas, y conviene no mezclarlos.

### 2.2 Pregunta 1 — ¿es automatizable el chequeo del objeto duplicado? **Sí, y bien.**

Y es más fácil de lo que parece, por una razón que hay que aprovechar: en un
par mínimo **el relleno viene declarado**. No hace falta desambiguar si el
«o» de «A direção **o** comunicará o resultado» es artículo o clítico —
sabemos cuál es porque está en el campo `mal`. Eso convierte un problema de
parsing en un problema de listas cerradas.

Regla: *si el relleno aporta un clítico acusativo (lista cerrada:
`o a os as lo la los las no na nos nas`) y el esqueleto continúa, sin
preposición por medio, con un determinante seguido de un nombre → objeto
duplicado.*

Medido, con recall y falsos positivos:

```
### E1 · objeto duplicado (clítico acusativo en el hueco + SN sin preposición detrás)

**v1 (rota, 3 pares tocados)** → 2 disparos
- v1P-04: el relleno «comunicá-lo-á» aporta un clítico ACUSATIVO y el esqueleto sigue con el sintagma «o resultado» sin preposición — objeto duplicado
- v1P-05: el relleno «enviá-lo-á» aporta un clítico ACUSATIVO y el esqueleto sigue con el sintagma «o programa» sin preposición — objeto duplicado

**v2 (la que se publica)** → 0 disparos

**banco ser/estar del test (7 pares sanos)** → 0 disparos
```

**2 de 2 de los casos reales, 0 falsos positivos** sobre la v2 y sobre el
banco honesto de 7 pares del test. Código para `scripts/lib/pares-minimos.ts`:

```ts
/** Los clíticos ACUSATIVOS, lista cerrada. En un par mínimo el relleno
 *  viene DECLARADO, así que no hay que desambiguar «o» artículo de «o»
 *  clítico: sabemos cuál es porque está en el campo. */
const ACUSATIVO = /(?:^|[\s-])(?:o|a|os|as|lo|la|los|las|no|na|nos|nas)(?:$|[\s-])/iu;
const DETERMINANTE = /^(?:o|a|os|as|um|uma|uns|umas|este|esta|estes|estas|esse|essa|esses|essas|aquele|aquela|aqueles|aquelas|meu|minha|seu|sua|nosso|nossa|todo|toda|todos|todas)$/iu;

/** El hueco aporta un clítico acusativo y el esqueleto ya realiza el
 *  objeto directo: «comunicá-lo-á **o resultado**». Cazó 2/2 de los pares
 *  rotos de la v1 del lote 12, 0 falsos positivos sobre la v2 y sobre el
 *  banco ser/estar del test. */
function objetoDuplicado(p: ParMinimo): string | null {
  for (const relleno of [p.bien, p.mal]) {
    if (!ACUSATIVO.test(relleno)) continue;
    const w = (p.esqueleto.split(HUECO)[1] ?? '').trim().split(/\s+/).filter(Boolean);
    if (w.length >= 2 && DETERMINANTE.test(w[0]!.replace(/[.,;:]/g, '')) && /^[\p{L}]{3,}[.,;:]?$/u.test(w[1]!))
      return `${p.id}: el relleno «${relleno}» aporta un clítico ACUSATIVO y el esqueleto sigue con «${w[0]} ${w[1]}» sin preposición — objeto duplicado`;
  }
  return null;
}
```

Dos avisos de honestidad sobre este gate:

1. **Va a dar falsos positivos** con sujetos pospuestos («…{} **o
   presidente** em pessoa»), con SN temporales sin preposición («…{} **a
   semana passada**») y con predicativos. Por eso debe llevar una válvula
   explícita en el par —`permiteSNPosterior: true`— que obligue a
   justificarlo por escrito, no un `if` silencioso.
2. **Es un gate estrecho, no «el gate de gramaticalidad».** Cubre el caso
   medido y nada más. No debe presentarse como si cubriera la clase.

### 2.3 El otro gate, que es el fuerte, y que el proyecto ya tiene medio escrito

El gate que de verdad cierra una clase entera es éste, y no es una
heurística sino un cálculo:

> **En un par de colocação, los dos rellenos tienen que ser el MISMO verbo,
> el MISMO tiempo, la MISMA persona y el MISMO clítico — sólo cambia dónde
> se pone el clítico.** Si cambia algo más, el par no es mínimo aunque los
> textos midan lo mismo.

Es la doctrina «la respuesta se calcula, no se juzga» que la línea
industrial usa desde E2#9, y el proyecto **ya tiene la función**:
`scripts/lib/paradigma-pt.ts` exporta `mesoclise(inf, clítico, persona,
tiempo)`, `enclise(forma, clítico)` y `proclise(clítico, forma)`. La forma
canónica del gate es exigir que ambos rellenos se deriven del mismo
`(lema, clítico, persona, tiempo)`. La versión por desinencia, más barata,
ya funciona:

```
**v2** → 0 disparos
**banco ser/estar (sin clítico → el gate NO aplica)** → 0 disparos
**casos rotos sintéticos** → 3 disparos:
- R-1: desinencias distintas («ei» / «ão») — el par cambia persona o tiempo, no sólo la colocación
- R-2: desinencias distintas («ei» / «ia») — el par cambia persona o tiempo, no sólo la colocación
- R-3: desinencias distintas («ei» / «ia») — el par cambia persona o tiempo, no sólo la colocación
```

```ts
const CLIT = /(?<![\p{L}])(me|te|se|lhe|nos|lhes|o|a|os|as|lo|la|los|las)(?![\p{L}])/iu;
const DESIN = /(?:ei|ás|á|emos|ão|ia|ias|íamos|iam)(?![\p{L}])/iu;

/** Sólo aplica a pares de COLOCAÇÃO (ambos rellenos llevan clítico): el
 *  par tiene que mover el clítico y NADA MÁS. 3/3 sobre casos rotos
 *  sintéticos, 0 falsos positivos sobre la v2 y sobre el banco ser/estar. */
function mismosRasgosVerbales(p: ParMinimo): string | null {
  if (!CLIT.test(p.bien) || !CLIT.test(p.mal)) return null;
  const desin = (s: string) => (s.match(DESIN)?.[0] ?? '∅').toLowerCase();
  const clit  = (s: string) => (s.match(CLIT)![1]!).toLowerCase().replace(/^l/, '');
  if (desin(p.bien) !== desin(p.mal))
    return `${p.id}: desinencias distintas («${desin(p.bien)}» / «${desin(p.mal)}») — el par cambia persona o tiempo, no sólo la colocación`;
  if (clit(p.bien) !== clit(p.mal))
    return `${p.id}: clíticos distintos («${clit(p.bien)}» / «${clit(p.mal)}»)`;
  return null;
}
```

### 2.4 Pregunta 2 — la clase ENTERA de fallos que el esqueleto compartido permite

Ocho familias. Marco cada una con si es gate, aviso o regla escrita, sin
fingir que un gate cubre lo que no cubre.

| # | familia | ejemplo | ¿automatizable? |
|---|---|---|---|
| 1 | **Argumento duplicado** — el hueco aporta un argumento que el esqueleto ya realiza | «comunicá-lo-á **o resultado**» (v1) | **GATE**, § 2.2. Vale también para el dativo: `{}`=«lhe dirá» + «**ao presidente**» |
| 2 | **Rasgos verbales que cambian entre rellenos** — el par mueve más que el clítico | «enviar-te-ei» / «te enviarão» | **GATE**, § 2.3, con `paradigma-pt.ts` |
| 3 | **Clítico sin antecedente** — pronombre de 3.ª sin referente en la frase, y el ítem se sirve suelto | **vivo en la v2**: P-01 «lhe», P-02 «lhes» no tienen a quién referirse | **REGLA, no gate.** Un gate crudo («¿hay algún SN de 3.ª?») no caza P-01/P-02 porque «o processo» y «a reunião» existen. La plausibilidad de un dativo humano no es automatizable con reglas honestas |
| 4 | **El tiempo del hueco contradice el resto** | «{}» en futuro + «ontem» en el esqueleto | **AVISO.** Léxico de marcadores × tiempo tiene falsos positivos reales («amanhã já terá terminado») |
| 5 | **Atractor-señuelo no declarado** — una palabra de la lista cerrada aparece en posición no gobernante y la glosa no la menciona | **vivo en la v2**: «já» en GJ-03/05/07/10 | **GATE BARATO**: escanear la frase contra la lista de atractores del proyecto y exigir que la explicación nombre los que no gobiernan. Ya medido en § 1.4 |
| 6 | **Dos pares que declaran el MISMO rasgo** — el mismo ejercicio con otro léxico | **vivo en la v2**: P-04 y P-05, cadena byte-idéntica | **GATE TRIVIAL**, § 3 |
| 7 | **El `repair` de un MAL es otro ítem del lote** | los 6 MAL de este lote | **GATE + regla de runner**, § 5 |
| 8 | **Defecto de registro o de verosimilitud compartido** — los dos miembros son igual de raros | «Quando o prazo terminar, enviar-te-ei os documentos por correio registado» mezcla el `tu` informal con registro notarial | **REGLA, no gate.** Es la clase madre y no es automatizable: es leer los ítems |

**La regla que hay que escribir en la skill, en una línea:** *un lote de
pares mínimos exige leer las **doce frases ensambladas**, no los seis
esqueletos ni los doce rellenos. El par no exime de leer; el par sólo
garantiza que si hay un defecto, estará en las dos.* Que es exactamente lo
que hizo el dry-run del publicador y ningún gate iba a hacer.

---

## 3 · Recuento de contrastes REALES: son **3**, no 6, y el generador puede probarlo solo

De los seis pares:

| grupo | pares | qué enseña | multiplicidad |
|---|---|---|---|
| **Contraste 1** | P-01, P-02, P-03 | hay atractor negativo ⇒ próclise, la mesóclise es imposible | 3 variantes léxicas (`não` / `ninguém` / `nunca`) |
| **Contraste 2** | P-04, P-05 | no hay atractor ⇒ mesóclise, la próclise es brasileña | 2 variantes léxicas (`informar` / `enviar`) |
| **Contraste 3** | P-06 | subordinada antepuesta + coma ⇒ la principal empieza de cero | 1 |

Sobre el grupo 2 no hace falta discutir, porque **el propio código lo
declara**: P-04 y P-05 tienen el campo `rasgo` byte-idéntico
(`lote12-pares.ts:84` y `:101`), y la explicación de P-05 lo dice en voz
alta: *«Mismo caso que el anterior con otro verbo»*. Y sale de un gate de
tres líneas:

```
### E3 · dos pares no pueden declarar el mismo `rasgo`

**v2** → 1 disparos:
- P-04 y P-05 declaran el MISMO rasgo juzgado: «sin atractor y con el verbo abriendo la oración, la próclise es brasileña» — son el mismo ejercicio con otro léxico
```

```ts
/** Dos pares del mismo lote no pueden declarar el mismo `rasgo`: si lo
 *  hacen, es el mismo ejercicio con otro léxico y el lote tiene menos
 *  contrastes de los que dice tener. */
export function rasgosRepetidos(ps: ParMinimo[]): string[] {
  const m = new Map<string, string[]>();
  for (const p of ps) {
    const k = p.rasgo.toLowerCase().replace(/\s+/g, ' ').trim();
    m.set(k, [...(m.get(k) ?? []), p.id]);
  }
  return [...m].filter(([, ids]) => ids.length > 1)
    .map(([k, ids]) => `${ids.join(' y ')} declaran el mismo rasgo juzgado («${k}»): son el mismo ejercicio con otro léxico`);
}
```

Sobre el grupo 1 la discusión es más fina y la respuesta también es que es
**un** contraste. `não`, `ninguém` y `nunca` no son tres reglas: son tres
piezas de la misma sub-clase (palabras negativas) y la generalización
«palabra negativa ⇒ próclise» transfiere entre las tres sin esfuerzo. Un
alumno que acierte P-01 acierta P-02 y P-03 sin aprender nada nuevo. Lo que
*sería* un segundo contraste es un atractor **no negativo** —`que`, `se`,
`quem`, `talvez`, `já`, `só`, `também`, `sempre`, un relativo, una
subordinante—, y de ésos hay **cero**.

**12 ítems · 6 frases · 3 contrastes · 2 reglas.** El punto se factura a 12.

---

## 4 · ¿Cierra el punto o infla la tabla? — **Infla la tabla**, y por tres vías independientes

### 4.1 La vía pedagógica: el contenido no es el punto

El currículo (`lib/data/languages/pt/curriculum.ts:350`) define
`b12-mesoclise-estilistica` con tres componentes:

> «cuándo un futuro o un condicional con clítico **pide** mesóclise, cuándo
> la próclise **por atractor la desactiva** y cuándo usarla **suena a
> impostura**»

Cobertura del lote:

| componente del currículo | ítems | cobertura |
|---|---:|---|
| cuándo la pide | 6 | sólo el caso «sin atractor», sin condicional, sin `-se-`, sin registro |
| cuándo el atractor la desactiva | 6 | sólo atractores **negativos**; 0 de los 14 restantes |
| **cuándo usarla suena a impostura** | **0** | **ninguna** |

El tercer componente es el que hace C2 al punto. Es el único que exige una
elección. Es el único que no tiene ni un ítem. Y no es una omisión menor:
un juicio BIEN/MAL **no puede** enseñarlo, porque «suena a impostura» no es
un juicio de gramaticalidad — es un juicio de adecuación, y el tipo de
ejercicio no lo admite. **El punto necesita otro tipo de ejercicio**
(`multiple_choice` de registro, o el `clitic_placement` que el plan de
currículos pide desde 2026-07-28), no doce juicios más.

También faltan, dentro del componente 1: el **condicional** (`dir-lhe-ia`,
`far-se-ia`) — los seis pares son futuro; y la mesóclise con **`-se-`**
(`dir-se-á`, `far-se-á`), que es la que de verdad aparece en la prensa y en
lo notarial y por tanto la que un C2 va a leer. Y falta la salida que la
propia explicación de P-04 v1 mencionaba entre paréntesis y que ningún ítem
enseña: que a C2 la elección más frecuente es **reformular y no usar
clítico**.

### 4.2 La vía del nivel: 6 de 12 frases las clasifica el propio proyecto como B2

No es opinión mía. Le he pasado a las doce frases las regex de la partición
`b8-colocacao-pronominal` (`scripts/lib/conceptos-finos.ts:404-411`), que
es B2:

```
## D · ¿a qué sub-punto de b8 (B2) asigna la partición cada frase?

| ítem | sub-punto b8 que casa |
|---|---|
| GJ-01 | `b8-coloc-proclise-negacao` |
| GJ-02 | `b8-coloc-mesoclise` |
| GJ-03 | — (residuo) |
| GJ-04 | `b8-coloc-mesoclise` |
| GJ-05 | — (residuo) |
| GJ-06 | `b8-coloc-proclise-negacao` |
| GJ-07 | — (residuo) |
| GJ-08 | — (residuo) |
| GJ-09 | `b8-coloc-mesoclise` |
| GJ-10 | — (residuo) |
| GJ-11 | — (residuo) |
| GJ-12 | `b8-coloc-proclise-negacao` |

**6/12** casan con un sub-punto B2 de `b8-colocacao-pronominal`.
```

Y el 6/12 es un **suelo**, no un techo: seis de los residuos no casan por un
defecto de la regex, no porque el contenido sea otro (véase el aviso A-3).

Y el bloque 8 ya tiene el punto surtido:

```
| b8-colocacao-pronominal | 71 | coloc-mesoclise:13 · coloc-proclise-negacao:12 · coloc-proclise-adverbio:10 · coloc-infinitivo:1 · coloc-enclise:19 | 16 |
```

`b8-coloc-mesoclise` está en **13** y `b8-coloc-proclise-negacao` en **12**:
los dos **por encima del piso, cerrados**. Este lote de C2 aporta 12 ítems
más de exactamente esas dos cosas, a un punto distinto. Es la definición
literal de inflar la tabla: el déficit baja 12 y la cobertura real no se
mueve.

### 4.3 La vía contable: si se publica como los 146 GJ anteriores, el punto sigue a CERO

Éste es un bloqueante puramente mecánico y muy fácil de pisar.
`scripts/split-conceptos.ts:74` itera `for (const c of (x.concepts ?? []))`:
**un ítem sin `concepts` no cuenta para ningún punto.** Y la práctica del
proyecto con los juicios es publicarlos sin conceptos:

```
GJ publicados: 146 · con concepts vacío (invisibles para la tabla de cobertura): 86
```

Confirmado contra la tabla actual, con `b12` ya declarado y vacío:

```
**Puntos nuevos (8):** `b12-arcaismo-juridico` (0 ítems, +12) · `b12-borde-gramaticalidad` (0 ítems, +12) · `b12-concordancia-discutida` (0 ítems, +12) · `b12-mesoclise-estilistica` (0 ítems, +12) · …
```

Si los doce salen con `concepts: []` —como salieron 86 de los 146 anteriores—
el documento dirá «cierra 0 → 12» y la tabla seguirá diciendo 0. **El
documento del lote tiene que declarar el `concepts` con el que se publica, y
el informe de cierre tiene que pegar el `split-conceptos` de después.**

---

## 5 · Fugas: el `repair` es otro ítem del lote

Confirmado al 100 % (§ 1.5): los 6 `repair` son verbatim otros 6 ítems, y la
tarjeta los imprime en pantalla.

**¿Rompe el ejercicio?** Rompe la mitad del ejercicio, y de la peor manera:
convierte un juicio de gramaticalidad en una prueba de memoria de
reconocimiento, que es justo la destreza que el tipo de ejercicio no quiere
medir. Y lo hace de forma invisible en la métrica: el alumno acierta, el
FSRS registra un acierto, la carta se aleja en el tiempo. El sistema aprende
que el alumno sabe colocação pronominal cuando lo que el alumno sabe es que
esa frase ya salió.

**¿Debe el runner evitar servir los dos miembros en la misma sesión? Sí, y
además hace falta más que eso.** Tres reglas, en orden de coste:

> **R1 (runner, obligatoria).** Dos ejercicios que declaren el mismo `parId`
> no se sirven nunca en la misma sesión. Implementación: campo `parId` en el
> ejercicio; filtro en la construcción de la cola, antes del `interleave`.
> Sin esto, `lib/srs/interleave.ts` no ayuda — puntúa por concepto y tipo, y
> los dos miembros comparten los dos, así que empatan y se conserva el
> orden.
>
> **R2 (runner, obligatoria).** Nunca se muestra como `repair` una cadena
> que sea el `sentence` de otro ejercicio publicado del mismo punto. Si lo
> es, se muestra la explicación sin la frase, o se genera una reparación
> alternativa. Es una consulta de igualdad normalizada; barata.
>
> **R3 (contenido, recomendada).** El `repair` de un MAL **no debería** ser
> automáticamente el BIEN de su par. Hoy lo es por construcción
> (`pares-minimos.ts:163`) y el test lo consagra
> (`pares-minimos.test.ts:72-78`). Una alternativa que además enseña más:
> que el `repair` sea la reparación **mínima** (sólo el tramo, «lhe direi»,
> no la frase entera), que es lo que el alumno tiene que producir y lo que
> no le sirve de plantilla para reconocer otro ítem.

Y el gate de preflight que falta, hermano del que ya existe para el corpus
publicado (`preflight-lote.ts:166-187`):

```ts
// El repair de un MAL no puede ser, además, el sentence de OTRO ítem del
// mismo lote: la tarjeta lo imprime y deja resuelto el otro ítem.
const porFrase = new Map(items.map((x) => [norm(x.sentence), x.id]));
for (const x of items) {
  if (!x.repair) continue;
  const otro = porFrase.get(norm(x.repair));
  if (otro && otro !== x.id)
    bloqueantes.push(`${x.id}: su repair es literalmente el ítem ${otro} de este mismo lote — la tarjeta lo imprime y ${otro} queda resuelto`);
}
```

Con la regla R1 en el runner, este gate pasa a AVISO. Sin R1, es bloqueante.

---

## 6 · La exención del gate de virginidad: ilegítima como está, y la puerta es más ancha de lo que parece

El código es `preflight-lote.ts:149-151`:

```ts
const parDe = (id: string) => items.find((x) => x.id === id.replace('·núcleo', ''))?.par;
const pa = parDe(c.id), pb = parDe(h.id);
if (pa && pb && pa === pb) continue;
```

**La exención es correcta en su intención y no está verificada en absoluto.**
Confía en una cadena de texto parseada del markdown (`**par:** \`P-01\``).
Nada comprueba que los dos ítems que comparten esa etiqueta sean realmente
un par mínimo.

Y la puerta es más ancha de lo que sugiere el encargo, porque **la exención
no está limitada a dos miembros**. Si alguien etiqueta los doce ítems con
`**par:** P-01`, entonces `pa === pb` para todas las parejas del lote y la
auto-comparación del lote —la cicatriz de E2#7, el gate «el lote se compara
consigo mismo»— queda **desactivada entera por una sola cadena de texto**.
No hace falta mala fe: basta con un copy-paste al escribir el documento a
mano, que es como se escribieron los lotes 1 a 11.

**El cierre**, y es corto: la exención no se concede por etiqueta, se
concede por **verificación**. Un `par` declarado es válido si y sólo si:

```ts
/** Un `par` declarado sólo exime del gate si es un par DE VERDAD. La
 *  etiqueta del markdown no es prueba de nada: se re-deriva la propiedad
 *  a partir de las dos frases, con el mismo invariante que `verificarPar`
 *  impone al generar. */
function paresDeclaradosValidos(items: Item[]): { validos: Set<string>; violaciones: string[] } {
  const v: string[] = [];
  const validos = new Set<string>();
  const grupos = new Map<string, Item[]>();
  for (const x of items) if (x.par) grupos.set(x.par, [...(grupos.get(x.par) ?? []), x]);

  for (const [par, xs] of grupos) {
    if (xs.length !== 2) { v.push(`par «${par}»: ${xs.length} miembros — un par tiene exactamente 2`); continue; }
    const [a, b] = xs as [Item, Item];
    if (a.verdict === b.verdict) { v.push(`par «${par}»: sus dos miembros son ${a.verdict ? 'BIEN' : 'MAL'} — un par es 1 BIEN + 1 MAL`); continue; }
    const bien = a.verdict ? a : b, mal = a.verdict ? b : a;

    // prefijo y sufijo comunes: lo que queda en medio es el tramo juzgado
    let i = 0; while (i < bien.sentence.length && i < mal.sentence.length && bien.sentence[i] === mal.sentence[i]) i++;
    let j = 0; while (j < bien.sentence.length - i && j < mal.sentence.length - i
                   && bien.sentence.at(-1 - j) === mal.sentence.at(-1 - j)) j++;
    const dBien = bien.sentence.slice(i, bien.sentence.length - j);
    const dMal  = mal.sentence.slice(i, mal.sentence.length - j);

    if (dBien.length > LIMITE_TRAMO || dMal.length > LIMITE_TRAMO) {
      v.push(`par «${par}»: el tramo que difiere mide ${Math.max(dBien.length, dMal.length)} caracteres (tope ${LIMITE_TRAMO}) — «${dBien}» / «${dMal}». No es un par mínimo: NO se exime`);
      continue;
    }
    if (mal.repair && norm(mal.repair) !== norm(bien.sentence))
      v.push(`par «${par}»: el repair del MAL no es el BIEN del par — o no son un par, o el repair está mal`);

    validos.add(par);
  }
  return { validos, violaciones: v };
}
```

…y en el bucle de virginidad, `if (pa && pb && pa === pb && validos.has(pa)) continue;`
más `bloqueantes.push(...violaciones)`.

`LIMITE_TRAMO` debe ser generoso pero finito — 24 caracteres cubre
holgadamente los seis rellenos de este lote (el mayor, «informá-lo-á», mide
12) y descarta cualquier «par» que sea en realidad dos frases distintas.

Con eso, la exención deja de ser una declaración y pasa a ser un teorema
comprobado en cada corrida, que es lo que el resto del preflight ya hace.

---

## 7 · NIVEL, ítem por ítem

Criterio: ¿qué tiene que saber el alumno que no supiera al terminar el
bloque 8? El bloque 8 publica **71** ítems de colocação pronominal, con
`coloc-mesoclise` en 13 y `coloc-proclise-negacao` en 12 — los dos cerrados.
Y `b10-var-colocacao` publica 10 ítems del contraste PT/BR.

| ítem | destreza que exige | ¿la enseña ya el bloque 8/10? | nivel real |
|---|---|---|---|
| GJ-01 · BIEN «Ninguém lhes contará…» | negativo ⇒ próclise | sí, `b8-coloc-proclise-negacao` (12 ítems) | **B2** |
| GJ-02 · BIEN «Quando o prazo terminar, enviar-te-ei…» | la subordinada antepuesta NO es atractor: frontera de cláusula | no explícitamente | **C1** |
| GJ-03 · BIEN «…já está fechado e o secretariado enviá-lo-á…» | sin atractor ⇒ mesóclise · **+ señuelo «já» sin explicar** | sí, `b8-coloc-mesoclise` (13) | **B2** (sería C1 con la glosa del señuelo) |
| GJ-04 · MAL «Ninguém contar-lhes-á…» | idéntica a GJ-01, signo contrario | sí | **B2** |
| GJ-05 · MAL «…a direção o informará…» | próclise sin atractor = brasileña | sí, `b10-var-colocacao` (10) | **B2** |
| GJ-06 · BIEN «…a comissão nunca o decidirá…» | `nunca` ⇒ próclise | sí, misma regex de `proclise-negacao` | **B2** |
| GJ-07 · MAL «…o secretariado o enviará…» | idéntica a GJ-05, otro verbo | sí | **B2** |
| GJ-08 · MAL «…te enviarei os documentos…» | el átono no abre oración tras coma | no explícitamente | **C1** |
| GJ-09 · MAL «Não dir-lhe-ei…» | `não` ⇒ próclise | sí, el caso central de `proclise-negacao` | **B2** |
| GJ-10 · BIEN «…a direção informá-lo-á…» | sin atractor ⇒ mesóclise · **+ señuelo «já» sin explicar** | sí | **B2** (sería C1 con la glosa) |
| GJ-11 · MAL «…nunca decidi-lo-á…» | idéntica a GJ-06, signo contrario | sí | **B2** |
| GJ-12 · BIEN «Não lhe direi…» | idéntica a GJ-09, signo contrario | sí | **B2** |

**Recuento: 0 de 12 son C2. 2 de 12 (el par P-06) son C1. Los otros 10 son
B2**, y 6 de ellos los reconoce como B2 la propia partición del proyecto.

El único ítem que **habla** de la elección es GJ-10, y sólo en la glosa: *«a
C2 es una elección de registro — culta, no obligatoria»*. Pero la frase es
falsa respecto del ítem que la acompaña: si fuera una elección, el MAL de su
par (GJ-05, la próclise) sería una alternativa aceptable, y el lote lo marca
MAL. **El ítem enseña obligatoriedad y la glosa dice elección.** Ese
desajuste no es un matiz: es el punto entero.

---

## 8 · Qué está bien (específico)

Hay bastante, y conviene no perderlo en la reescritura.

1. **El preflight es honesto y reproducible.** Lo he vuelto a correr sobre la
   v2 y sale byte a byte igual a lo pegado, `EXIT=0`, y el `shasum` de
   `atajos.ts` da `4cc7a606`, que es la rev declarada. El mecanismo de
   caducidad de la salida pegada funciona. Es la primera vez en el proyecto
   que una cifra «medida» de un lote se puede auditar sin volver a
   calcularla a mano, y es un avance real.
2. **El equilibrio 3/3 de la mesóclise funciona y se puede comprobar.** La
   estrategia «hispanohablante ingenuo: el clítico va delante» saca
   exactamente **6/12** sobre este lote. La estrategia «¿hay guion? → MAL»
   también. Ese equilibrio es deliberado y está bien hecho.
3. **El molde con solape-contra-el-azar es correcto y sustituye bien al
   prefijo de cuatro.** El argumento de que el criterio viejo se agotaba por
   construcción es cierto, y el nuevo mide en un espacio de 2^N. El test de
   no-agotamiento (`pares-minimos.test.ts:161-185`) prueba lo que dice
   probar.
4. **La sonda de núcleo** del gate de virginidad
   (`preflight-lote.ts:121-133`) es un arreglo bueno de una cicatriz real y
   sigue activa aquí.
5. **La reconstrucción de la v2 mejoró más de lo que su nota reclama.** Los
   antecedentes nuevos («O recurso está pendente e…») no sólo arreglaron el
   objeto duplicado: metieron por accidente el señuelo «já», que es el único
   material genuinamente C1 del lote y que estaba ausente en la v1. Merece
   quedarse — explicado.
6. **La nota del autor sobre el fallo de la v1 está escrita con la
   franqueza correcta** y nombra el límite del método sin adornarlo. Eso es
   lo que permite que este informe vaya un paso más allá en vez de tener que
   discutir si el fallo existió.
7. **P-06 es un buen ítem**, y es el único del lote que ataca un error que
   un C1 comete de verdad. Debería ser el modelo de los que falten.

---

## 9 · BLOQUEANTES — lista cerrada

| # | bloqueante | evidencia | arreglo |
|---|---|---|---|
| **B-1** | **El lote no contiene ni un ítem donde la mesóclise sea una ELECCIÓN.** El punto se llama «recurso de estilo» y los 12 ítems son casos categóricos. El componente «cuándo usarla suena a impostura» tiene 0 ítems y un juicio BIEN/MAL no puede darlos | § 4.1 · `curriculum.ts:350` · `lote12-pares.ts:16-18` | O el punto se cubre con otro tipo de ejercicio (registro / `clitic_placement`), o el lote no puede declararse cierre de `b12-mesoclise-estilistica` |
| **B-2** | **`concepts` no está declarado.** 86 de 146 juicios publicados salieron con `concepts: []` y son invisibles para la tabla. Si estos 12 salen igual, el punto sigue en 0 y el documento dice «cierra» | § 4.3 · `split-conceptos.ts:74` · salida pegada | Declarar `concepts: ['b12-mesoclise-estilistica']` en el documento y pegar el `split-conceptos` de después en el informe de cierre |
| **B-3** | **Atajo 12/12, p = 0,0002.** Una bolsa de palabras de tres atractores resuelve el lote entero. Es 4× más significativo que el atajo de la LONGITUD que motivó el cambio de método | § 1.3, tabla A | Añadir ≥1 par-señuelo con atractor presente y no gobernante (§ 1.3), y meter el rasgo A1 en `atajos.ts` como rasgo 12 |
| **B-4** | **Los 6 `repair` son verbatim otros 6 ítems del lote** y la tarjeta los imprime. Sube el techo de la estrategia sin portugués del 50 % al 75 % | § 1.5, § 5 | Regla R1 en el runner (no servir los dos miembros en la misma sesión) + gate de preflight. R3 recomendada |
| **B-5** | **P-04 y P-05 declaran el mismo `rasgo`, byte a byte.** Sólo hay 3 contrastes reales, no 6 | § 3, salida E3 | Gate `rasgosRepetidos()`; y sustituir P-05 por un contraste que no exista aún (condicional, `-se-`, atractor no negativo) |
| **B-6** | **El señuelo «já» aparece en 4 ítems y ninguna explicación lo menciona**, siendo `já` un atractor que el propio proyecto enseña en B2 con 10 ítems. El ítem castiga haber aprendido bien la lección anterior | § 1.4, salida B | Reescribir las glosas de GJ-03, GJ-05, GJ-07 y GJ-10 nombrando el «já» y por qué no alcanza a la segunda cláusula |
| **B-7** | **La exención del gate de virginidad se concede por etiqueta de texto sin verificar**, y no está limitada a dos miembros: una sola cadena repetida desactiva la auto-comparación del lote entera | § 6 · `preflight-lote.ts:149-151` | `paresDeclaradosValidos()` (§ 6): exactamente 2 miembros, 1 BIEN + 1 MAL, tramo diferente ≤ `LIMITE_TRAMO`, repair = BIEN. Sin eso, no hay exención |
| **B-8** | **`verificarPar()` no ve ningún defecto COMPARTIDO por los dos miembros**, que es la clase entera a la que pertenece el fallo de la v1. Y el documento afirma que «todo rasgo que no mire ese tramo vale exactamente igual», lo cual es falso para los rasgos relativos y los de posición | § 2, § 1.2 · salida «control» | Añadir `objetoDuplicado()` y `mismosRasgosVerbales()` (§ 2.2, § 2.3), escribir en la skill la regla de leer las 12 frases ensambladas, y corregir la afirmación del documento |

### Avisos (no bloquean)

- **A-1 · Potencia.** A N = 12 el gate exige 10/12 para disparar; un atajo al
  75 % escapa el 61 % de las veces (§ 1.7). Y con pares, la unidad
  independiente son 6, no 12. **Los lotes de juicio por pares no deberían
  bajar de 24 ítems.**
- **A-2 · El 3/3 de la mesóclise no está en ningún gate**, sólo en un
  comentario (`lote12-pares.ts:23-26`). Con 4/2 el rasgo del guion daría
  8/12 (p = 0,19) y la batería no lo bloquearía. Conviene un gate de
  equilibrio del rasgo juzgado.
- **A-3 · Bug en la partición, fuera de este lote.** La regex de
  `b8-coloc-mesoclise` (`conceptos-finos.ts:407`) **no cubre los alomorfos
  `-lo-`/`-la-`**, que son la mayoría de las mesóclises acusativas.
  Verificado: `informá-lo-á`, `enviá-lo-á`, `decidi-lo-á`, `fá-lo-á`,
  `di-lo-ão`, `trá-las-íamos` → NO CASA; `contar-lhes-á`, `dir-lhe-ei`,
  `enviar-te-ei` → CASA. Sobre el corpus: **30 ejercicios contienen una
  mesóclise real y la partición sólo reconoce 18 — se pierden 12.** El «13»
  de `b8-coloc-mesoclise` es un subrecuento.
- **A-4 · Clítico dativo sin antecedente**, vivo en la v2: P-01 («lhe») y
  P-02 («lhes») no tienen referente en la frase y el ítem se sirve suelto.
  No es agramatical, pero rompe el criterio de round «que el contexto
  determine la respuesta». No es automatizable con reglas honestas (§ 2.4,
  familia 3): va como regla escrita.

---

## 10 · La ruta corta a PUBLICA

No hay que tirar nada. Con esto el lote sale, y sale mejor de lo que entró:

1. Conservar P-01, P-02, P-06 y **uno** de P-04/P-05.
2. Sustituir el otro y P-03 por: **(a)** un par con atractor **no negativo**
   (`só`, `talvez`, `que`); **(b)** el par-señuelo de § 1.3, que mata el
   atajo A1.
3. Añadir dos pares nuevos que cubran lo que falta: **condicional**
   (`dir-lhe-ia`) y **mesóclise con `-se-`** (`dir-se-á`), que es la que se
   lee de verdad.
4. Reescribir las cuatro glosas del «já» (B-6).
5. Subir a 24 ítems / 12 pares (A-1).
6. Y para el componente que un juicio no puede enseñar —la impostura—
   abrir un lote aparte del tipo correcto. **Hasta que exista, este punto no
   se declara cerrado**, aunque tenga 24 ítems.

Con los pasos 1-5 el lote pasa a **PUBLICA-CON-CORRECCIONES** como refuerzo
de colocação de nivel C1. Con el paso 6, y sólo con él, cierra
`b12-mesoclise-estilistica`.
