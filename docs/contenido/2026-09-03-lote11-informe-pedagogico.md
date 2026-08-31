# Lote 11 (C1 · «se aprende ELECCIÓN») — revisión PEDAGÓGICA y de DISEÑO

Revisor #2, ángulo pedagógico. Ronda 1. No he visto al revisor lingüístico
y no juzgo aquí ningún *verdict* de gramaticalidad.
Doc auditado: `/Users/lalo/idiomas/portugues-app/docs/contenido/2026-09-02-lote11-c1-eleccion.md`

---

## Veredicto global: **NO PUBLICA**

**8 bloqueantes.** El más grave no es un descuido del autor: es que el lote
**deshizo a mano una máquina que el repo ya tiene escrita y probada**
(`scripts/lib/pares-minimos.ts`, 19/19 tests verdes). Once de los doce ítems
de la sección B son **un solo miembro** de un par mínimo que ya existe en
`tests/unit/pares-minimos.test.ts`, con el otro miembro tirado a la basura.
Eso es exactamente lo que crea el rasgo nº 12.

Y el rasgo nº 12 **no se arregla con pares mínimos**, porque es el único
atajo que mira *dentro* del hueco. Sólo se arregla con contenido: el punto
`b11-ser-estar-divergente` declara enseñar los usos «en que la elección
portuguesa no coincide con la española» y **once de sus doce ítems coinciden
con el español**. Un hispanohablante que no sepa una palabra de portugués
acierta la sección B **12 de 12**.

Los tres hallazgos —el atajo, la cobertura y el nivel— **son el mismo
hallazgo visto desde tres sitios**. No se arreglan por separado.

---

## 0 · ¿Me fío del preflight pegado? — sí en los números, **no en el sello**

Lo corrí y lo diferencié contra lo pegado, línea a línea:

```
$ npx tsx scripts/preflight-lote.ts docs/contenido/2026-09-02-lote11-c1-eleccion.md > /tmp/pf-real.txt; echo EXIT=$?
EXIT=0
$ diff <(bloque ``` nº1 del doc) /tmp/pf-real.txt
9c9
< Patrón: `MBBBMMBMBMMBBMBBMMBMMBMB` · prefijo de 4: `MBBB` · racha máxima: 3 · desequilibrio: 0
---
> Patrón: `MBBBMMBMBMMBBMBBMMBMMBMB` · racha máxima: 3 · desequilibrio: 0
10a11,24
> Solape con los 10 lotes publicados (el objetivo es el AZAR, no el mínimo — la casi-complementaria es un calco igual que la copia):
>
> | lote | patrón | solape | azar | desvío | tope |
> |---|---|---:|---:|---:|---:|
> | l1 | `BMMBMBMMBMBBBMMMBMBB` | 10/20 | 10.0 | 0.0 | 4 |
> | l2 | `BMBMMBBMMBMMBBBMMBMB` |  8/20 | 10.0 | 2.0 | 4 |
> | l3 | `MBBMBMMBMBBMBMBBMBMM` | 10/20 | 10.0 | 0.0 | 4 |
> | l4 | `MMBBMBMMBBMMBMBBMBMB` | 12/20 | 10.0 | 2.0 | 4 |
> | l5 | `BBMMBMBBMMMBMBMMBBBM` |  8/20 | 10.0 | 2.0 | 4 |
> | l6 | `BBBMMBMBMM`           |  4/10 |  5.0 | 1.0 | 3 |
> | l7 | `MMMBBBMBMB`           |  2/10 |  5.0 | 3.0 | 3 |
> | l8 | `BBMBMMBMMB`           |  6/10 |  5.0 | 1.0 | 3 |
> | l9 | `BMBBBMBMMM`           |  6/10 |  5.0 | 1.0 | 3 |
```

**Lo bueno, y es lo que importa para mi trabajo**: las 11 filas de atajos
coinciden cifra a cifra, y las 17 líneas de virginidad también. Los números
que el doc declara **resisten la reproducción**. Segundo lote seguido. La
enfermedad de E2#11 sigue curada.

**Lo malo**: la salida pegada **está caducada** y el sello dice que no.

```
$ node -e "sha256(scripts/lib/atajos.ts).slice(0,8)"
4cc7a606          ← idéntica a la del doc: «vigente»

$ git log --oneline -3 -- scripts/preflight-lote.ts
b905c45 pares mínimos por construcción + bloque 12 (C2), y un mapa duplicado que mentía en silencio   ← POSTERIOR al doc
a7a8cda ronda 2 del lote 10 …
9681f61 preflight ejecutable …
$ git log --oneline -1 -- scripts/lib/atajos.ts
a7a8cda ronda 2 del lote 10 …                                                                        ← anterior al doc
```

El sello sólo estampa `scripts/lib/atajos.ts`. El fichero que **produce la
salida** es `scripts/preflight-lote.ts`, y ése cambió en `b905c45`: perdió el
«prefijo de 4» y ganó una tabla entera de solape con los lotes publicados
que **no está en el doc**. El sello, que se inventó justo para que una salida
caducada no pasara desapercibida, da luz verde a una salida caducada.

Es el mismo modo de fallo, un fichero más allá — y la misma familia que el
«mapa duplicado que mentía en silencio» del propio commit `b905c45`. Fix de
una línea:

```ts
const revBateria = crypto.createHash('sha256')
  .update(fs.readFileSync(path.join(process.cwd(), 'scripts/lib/atajos.ts'), 'utf8'))
  .update(fs.readFileSync(path.join(process.cwd(), 'scripts/preflight-lote.ts'), 'utf8'))
  .update(fs.readFileSync(path.join(process.cwd(), 'scripts/lib/virginidad.ts'), 'utf8'))
  .digest('hex').slice(0, 8);
```

y renombrar el rótulo, porque ya no sella la batería sino el preflight
entero.

*(El veredicto no cambia por esto: la tabla de solape sale dentro de tope en
los nueve lotes —el peor es l7 con desvío 3,0 sobre tope 3— y el molde
sigue limpio. Pero la salida hay que volver a pegarla.)*

El preflight hace lo que promete. El problema es lo que **no** mide, y por
qué no puede medirlo.

---

## 1 · BLOQUEANTE — el rasgo nº 12: **la glosa cognada**

### Qué es

«Traduce la frase palabra por palabra al español y júzgala con tu intuición
de hispanohablante. Si la traducción es español correcto ⇒ BIEN. Si es
español roto ⇒ MAL.»

No hay que saber portugués. Ni una palabra.

### Por qué la batería no lo tiene

Porque es el único de los tres atajos históricos que **no sale de un regex**.
La skill lo nombra desde el lote 3 —«glosa cognada que da español normal
(16/20 → 14/20)»— y la batería en código implementa el primero («palabra
visiblemente española») y el segundo («marca de día concreto» ≈ «marcador
temporal»), pero **el tercero nunca llegó al código**. Se quedó fuera por
ser el que exige juicio, que es justo la razón por la que hacía falta
meterlo.

Y encaja con el historial que me dieron: longitud (13/16) → arranque (12/16)
→ posición en el lote (24/24). Los tres se arreglaron por construcción. Éste
sobrevive **porque los pares mínimos no lo tocan** (§2).

### La medida

Fórmula del repo (`medirRasgo` + `pValor`): **acierto SOBRE N**, jamás recall
sobre los MAL.

| rasgo | acierto | % | dirección | presente en | p | |
|---|---:|---:|---|---:|---:|:-:|
| **★ glosa cognada: la traducción literal al español es español CORRECTO** | **20/24** | **83 %** | presente⇒BIEN | 12 | **0.0008** | **BLOQUEA** |
| ★ el mismo rasgo, **sólo en la sección B** (GJ-13…24) | **12/12** | **100 %** | presente⇒BIEN | 6 | **0.0002** | **BLOQUEA** |
| ★ el mismo rasgo, sólo en la sección A (GJ-01…12) | 8/12 | 67 % | presente⇒BIEN | 6 | 0.194 | |

```
p binomial de referencia N=24: 16⇒0.0758 · 17⇒0.0320 · 18⇒0.0113 · 19⇒0.0033 · 20⇒0.0008 · 21⇒0.0001
p binomial N=12 (por sección):  9⇒0.0730 · 10⇒0.0193 · 11⇒0.0032 · 12⇒0.0002
```

El umbral de la batería es `SOSPECHOSO = 0.05`; con N=24 eso son **17
aciertos**. Éste saca 20.

### El desglose, ítem a ítem, con la glosa escrita

La anotación es juicio mío y va **declarada** para que se pueda discutir
línea a línea. Nadie tiene que fiarse de un número: la columna de en medio
es el dato.

```
GJ-01 · «Para los críos entender el ejercicio, el profesor explicó todo otra vez.»        ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-02 · «Antes de salir de casa, comprueben si cerraron bien la llave del gas.»           ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-03 · «Es mejor esperar aquí dentro hasta la lluvia pasar del todo.»                    ES roto    ⇒ MAL  · real BIEN · falla
GJ-04 · «Traje los documentos para el señor los firmar antes de irse.»                    ES roto    ⇒ MAL  · real BIEN · falla
GJ-05 · «Después de ellos salió de la oficina, nos quedamos ordenando las cajas.»         ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-06 · «Es preciso que hacermos alguna cosa antes de que sea demasiado tarde.»           ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-07 · «Después de yo haber hablado con ella por teléfono, todo quedó más claro.»        ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-08 · «Sin ellos saber lo que pasó, es difícil pedirles una opinión.»                   ES bueno   ⇒ BIEN · real MAL  · falla
GJ-09 · «Conviene que la propuesta sea entregada antes del viernes al mediodía.»          ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-10 · «Antes de que salgas de casa, deja la llave debajo del felpudo de la entrada.»    ES bueno   ⇒ BIEN · real MAL  · falla
GJ-11 · «Sin los críos supieren de nada, los padres lo arreglaron todo en una tarde.»     ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-12 · «Al llegar a lo alto de la sierra, ya no se veía nada por causa de la niebla.»    ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-13 · «La cena de despedida es en el restaurante de siempre, hacia las ocho.»           ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-14 · «La reunión con los inversores está a las tres de la tarde en la sala grande.»    ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-15 · «La biblioteca queda al fondo de la calle, justo al lado de correos.»             ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-16 · «La puerta estuvo abierta toda la noche y entró frío por toda la casa.»           ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-17 · «Estoy portugués, pero vivo en España desde los dieciocho años.»                  ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-18 · «Antonio es enfermo desde la semana pasada y no va a trabajar.»                   ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-19 · «Ella es profesora de Historia, aunque este año esté dando Portugués.»            ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-20 · «El concierto está en el Coliseo el próximo sábado, a las nueve y media.»         ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-21 · «Este café es frío, debe de haberse quedado en la máquina desde el almuerzo.»     ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-22 · «La entrada es gratuita para los socios, pero hoy está agotado el aforo.»         ES bueno   ⇒ BIEN · real BIEN · ACIERTA
GJ-23 · «La fiesta de cumpleaños de mi sobrina está el domingo en casa de los abuelos.»   ES roto    ⇒ MAL  · real MAL  · ACIERTA
GJ-24 · «El edificio es del siglo diecinueve, pero está todo remodelado por dentro.»      ES bueno   ⇒ BIEN · real BIEN · ACIERTA
```

**La sección B no tiene un solo fallo.** Los cuatro fallos del lote entero
—GJ-03, GJ-04, GJ-08, GJ-10— están todos en la sección A, y son justamente
los cuatro ítems donde el infinitivo pessoal hace algo que el español no
sabe imitar. Es decir: **la sección A resiste a medias el atajo (8/12, no
significativo) y la sección B no lo resiste nada**.

### El mecanismo, que es lo que hay que arreglar

No es mala suerte. Es aritmética:

1. Cada ítem de la sección B es un miembro de un **par mínimo** «é/está»
   (§2). En un par, un miembro es el portugués correcto y el otro el
   incorrecto.
2. En **once** de los doce pares, el español elige **igual** que el
   portugués (§3).
3. Luego la glosa española del miembro BIEN es siempre español correcto, y
   la del miembro MAL siempre español roto.
4. Luego «la glosa es buen español» **es** la etiqueta. 12 de 12, por
   construcción.

Por eso digo que el atajo, la cobertura y el nivel son el mismo hallazgo.

### Qué código añadir a `scripts/lib/atajos.ts`

El rasgo no se puede calcular: se **declara**. Y como un procedimiento que
depende de recordar falla, el preflight tiene que **bloquear si falta la
declaración** —si no, el campo se queda `undefined`, el rasgo sale 12/24 y
pasa en silencio, que es precisamente el modo de fallo que esta batería
existe para impedir.

**(a) `scripts/lib/atajos.ts` — el campo:**

```ts
export interface ItemJuicio {
  id: string;
  /** posición en el lote, 0-based. La rellena `bateria()` si falta. */
  pos?: number;
  /** true = la frase está BIEN formada */
  verdict: boolean;
  sentence: string;
  /** La GLOSA COGNADA, declarada: ¿la traducción palabra por palabra al
   *  español es español bien formado? No hay regex que lo calcule —es
   *  juicio— y por eso se declara en el doc, con la glosa escrita al
   *  lado, y el preflight bloquea si falta. Declararlo cuesta un minuto
   *  por ítem y es el único atajo que los pares mínimos NO neutralizan. */
  glosaEsCorrecta?: boolean;
}
```

**(b) `scripts/lib/atajos.ts` — el rasgo, al principio de `RASGOS`:**

```ts
  {
    // EL RASGO 12. La skill lo nombra desde el lote 3 —«glosa cognada que
    // da español normal», 16/20— y la batería en código nunca lo tuvo,
    // porque es el único de los tres atajos históricos que no sale de un
    // regex. Se quedó fuera por ser el que exige juicio, que es
    // exactamente la razón por la que hacía falta meterlo.
    //
    // Lote 11: 20/24 (p=0,0008) en el lote entero y 12/12 (p=0,0002) en
    // la sección de ser/estar. Un hispanohablante que no sepa una palabra
    // de portugués resuelve media batería traduciendo.
    //
    // Y OJO, que es la parte importante: los PARES MÍNIMOS no lo
    // neutralizan. La garantía de `pares-minimos.ts` es que todo rasgo
    // que NO mira el hueco vale igual en los dos miembros. Éste SÍ mira
    // el hueco. La única defensa es de contenido: que el punto sea de
    // verdad divergente del español. Si el español elige igual que el
    // portugués, el punto no se puede examinar con juicios binarios.
    nombre: 'la glosa palabra-por-palabra al español es español correcto',
    f: (x) => x.glosaEsCorrecta === true,
  },
```

**(c) `scripts/preflight-lote.ts` — parsear y bloquear.** En el bucle del
parser, junto a `sentence`/`repair`:

```ts
    glosaEsCorrecta: /\*\*glosa-es:\*\*[\s\S]*?·\s*español\s+CORRECTO/i.test(sec)
      ? true
      : /\*\*glosa-es:\*\*[\s\S]*?·\s*español\s+INCORRECTO/i.test(sec)
        ? false
        : undefined,
```

y en el bloque «── 1 · Higiene ──»:

```ts
  if (x.glosaEsCorrecta === undefined)
    bloqueantes.push(`${x.id}: sin **glosa-es:** — el rasgo de la glosa cognada no se puede medir, y sin medirlo la batería miente por omisión`);
```

**(d) el doc del lote** gana una línea por ítem, entre `repair` y
`explicación`:

```
**glosa-es:** «La reunión con los inversores está a las tres de la tarde en la sala grande.» · español INCORRECTO
```

Con esto mi 20/24 deja de ser un número mío y pasa a salir del preflight, en
la misma tabla que los otros once, para éste y para todos los lotes futuros.

---

## 1 bis · AVISO — el **peso léxico**: la longitud, un piso más abajo

La longitud de la FRASE está muerta, y bien muerta (§«qué está bien»). La de
las PALABRAS, no:

```
la palabra más larga tiene ≥10 letras    17/24 (71 %) presente⇒BIEN · presente en 9  · p=0.0320
la palabra más larga tiene ≥9 letras     15/24 (63 %) presente⇒BIEN · presente en 13 · p=0.1537
≥2 palabras de 8+ letras                 18/24 (75 %) presente⇒BIEN · presente en 10 · p=0.0113
≥3 palabras de 8+ letras                 13/24 (54 %) presente⇒BIEN · presente en 3  · p=0.4194
```

(guion contado como frontera de palabra, para que «sexta-feira» no cuente
como una palabra de diez letras)

Los BIEN se escribieron con léxico pesado —*verifiquem, esperarmos,
documentos, restaurante, biblioteca, professora, remodelado*— y los MAL con
palabras cortas y corrientes: *reunião, concerto, festa, café, porta,
miúdos*. Tiene mecanismo, y el mecanismo es el desequilibrio de sub-tipos
del §4: los MAL de la sección B son tres marcos de evento con sustantivos
cortos, y los BIEN son los marcos «ser + estar en la misma frase», que
piden adjetivos largos.

**Lo declaro AVISO y no bloqueante, y digo por qué**: lo encontré barriendo
~139 rasgos candidatos (28 de diseño, ~90 umbrales numéricos, 21 de bolsa de
palabras). `medirRasgo` coge la mejor de las dos direcciones, así que bajo
la hipótesis nula un «p<0,05» ocurre en ~6,4 % de los rasgos: en 139 rasgos
se esperan **≈9 falsos positivos** y he encontrado 3, dos de los cuales son
el mismo rasgo con otro umbral. Un rasgo pescado con caña no vale lo que uno
pre-registrado. El de la glosa sí resiste: p=0,0015 corregido por las dos
direcciones, esperado 0,21 en 139 pruebas, y además estaba pre-registrado en
la skill desde el lote 3.

**Aun así métetelo en la batería**, porque en cuanto esté en `RASGOS` deja de
ser pescado y pasa a ser pre-registrado para el lote 12:

```ts
  {
    // El peso LÉXICO: la longitud otra vez, un piso más abajo. El lote 10
    // v2 igualó la longitud de la FRASE, el lote 11 la mantuvo igualada
    // (13/24, p=0,419) — y nadie miró la de las PALABRAS: los BIEN se
    // escribieron con léxico pesado y los MAL con palabras cortas.
    // 18/24 (p=0,011) en el lote 11, encontrado por barrido, así que en
    // ese lote vale como aviso; a partir del 12 vale como medida.
    nombre: 'lleva dos o más palabras de 8+ letras (peso léxico)',
    f: (x) => x.sentence.split(/[\s\-—]+/)
      .filter((w) => w.replace(/[^\p{L}]/gu, '').length >= 8).length >= 2,
  },
```

---

## 1 ter · BUG — el rasgo «palabra visiblemente española» no mide eso

La tabla del preflight dice que ese rasgo está **presente en 3** ítems.
Cuáles:

```
$ node -e "…aplicar el regex del rasgo a cada sentence…"
GJ-17 MAL → dispara con: "desde"
GJ-18 MAL → dispara con: "desde"
GJ-21 MAL → dispara con: "desde"
```

**`desde` es portugués corriente.** Está en el propio corpus publicado:
`b8/b2c2-gj-l1-01` = «Está a chover **desde** ontem.» El rasgo no está
midiendo hispanismos: está midiendo la palabra «desde», y que las tres
apariciones caigan en MAL es casualidad que le infla la cifra a 15/24.

En la lista del regex hay otros dos que son portugués perfecto y van a
disparar en falso en cuanto aparezcan: **`nunca`** (PT «nunca», idéntico) y
**`aje\b`**, que casa con **«traje»** (PT *o traje* = la indumentaria).

Un detector de atajos con falsos positivos es peor que no tenerlo: gasta el
presupuesto de atención y, el día que haya un hispanismo de verdad, su cifra
ya estará contaminada. Fix:

```ts
    f: (x) => /ñ|ll[aeiou]|ción\b|dad\b|(?<![\p{L}])(pero|entonces|ahora|siempre|muy|hasta|aunque|antes de que)(?![\p{L}])/iu.test(x.sentence),
```

(fuera `desde`, `nunca` y `aje\b`; dentro **`antes de que`**, que es el
calco de GJ-10 y es exactamente lo que el rasgo quiere cazar)

---

## 2 · BLOQUEANTE — el lote **deshizo** los pares mínimos que ya existían

Esto es lo que de verdad hay que arreglar, y no está en el doc del lote: está
en el repo.

`scripts/lib/pares-minimos.ts` existe, tiene 271 líneas, y su cabecera dice
literalmente lo que el lote 11 necesitaba:

> **Eso no se gana midiendo, se gana por construcción.** Si el BIEN y el MAL
> salen del MISMO esqueleto y sólo difieren en el hueco que se juzga,
> entonces TODO rasgo que no mire el hueco vale exactamente igual en los dos
> miembros del par […] y también el rasgo número doce que a nadie se le ha
> ocurrido todavía. La batería deja de ser el motor de diseño y pasa a ser lo
> que debió ser siempre: **verificación**.

Y en `tests/unit/pares-minimos.test.ts` hay **doce pares reales del punto
`b11-ser-estar-divergente`**, con la suite verde:

```
$ npx vitest run tests/unit/pares-minimos.test.ts
 Test Files  1 passed (1)
      Tests  19 passed (19)
```

Comparando esos doce pares con la sección B del lote:

| par del banco | esqueleto | lote 11 | qué miembro se publicó |
|---|---|---|---|
| P-01 | `A reunião com os investidores {} às três da tarde na sala grande.` | **GJ-14** | el **MAL** (idéntico) |
| P-02 | `O concerto de sábado {} no Coliseu…` | **GJ-20** | el **MAL** (reescrito) |
| P-03 | `O jantar de despedida {} no restaurante do costume, lá para as oito.` | **GJ-13** | el **BIEN** (idéntico) |
| P-04 | `A festa de anos da minha sobrinha {} no domingo em casa dos avós.` | **GJ-23** | el **MAL** (idéntico) |
| P-05 | `O António {} doente desde a semana passada e não vai trabalhar.` | **GJ-18** | el **MAL** (idéntico) |
| P-06 | `Este café {} frio, deve ter ficado na máquina desde o almoço.` | **GJ-21** | el **MAL** (casi idéntico) |
| P-07 | `A porta do quarto {} aberta a noite toda e entrou frio pela casa.` | **GJ-16** | el **BIEN** (casi idéntico) |
| P-08 | `A camisola que me deste {} suja da chuva de ontem à tarde.` | — | *no se usó* |
| P-09 | `O meu vizinho do lado {} português, mas vive em Espanha há anos.` | **GJ-17** | el **MAL** (sujeto cambiado a 1sg) |
| P-10 | `A minha prima mais nova {} professora de História no liceu daqui.` | **GJ-19** | el **BIEN** (coleta nueva) |
| P-11 | `O prédio onde eles moram {} do século dezanove, todo remodelado.` | **GJ-24** | el **BIEN** (coleta nueva) |
| P-12 | `A entrada para os sócios {} gratuita durante todo o mês de agosto.` | **GJ-22** | el **BIEN** (reordenado) |

**Once de doce.** El lote cogió el banco de pares, se quedó con **un** miembro
de cada uno y tiró el otro. Al tirar el hermano se pierde precisamente la
propiedad que el módulo garantiza, y la elección de qué miembro conservar
resultó ser —sin querer— «el que hace que la glosa española prediga la
etiqueta».

**Ahora la parte incómoda.** Publicar los 24 (los doce pares completos) mata
todos los rasgos de superficie, y el test lo demuestra: «los rasgos de TEXTO
caen exactamente en el azar, no "cerca"… 12/24 exacto». Pero **no mata el
rasgo nº 12**, porque el nº 12 mira el hueco. El propio módulo lo dice en su
cabecera, en el párrafo de limitaciones:

> Lo que esto NO resuelve […]: que el rasgo juzgado no sea detectable por una
> regla superficial — si el hueco es «é»/«está», un rasgo «contiene está»
> acierta el 100 %, pero ese rasgo ES la destreza que el punto enseña, no un
> atajo.

Y ahí está la trampa fina, que hay que dejar escrita porque el módulo la roza
sin verla: **la glosa española no es la destreza que el punto enseña — es su
contraria.** El punto se llama `ser-estar-**divergente**` y existe para que el
alumno deje de decidir en español. Un alumno que decide en español saca 12/12.
El atajo no es una destreza legítima que el examen premia: es **el error que
el punto existe para corregir**, y el examen lo premia.

Acción: (a) usar `expandir()` para generar la sección B, no escribirla a
mano; (b) y aun así, cambiar el contenido, porque §3.

---

## 3 · BLOQUEANTE — la sección B **no cubre el punto que declara**

El punto, en `lib/data/languages/pt/concepts.json`:

> `b11-ser-estar-divergente` — «Los usos en que la elección portuguesa **no
> coincide con la española**: los eventos van con SER (a reunião é às três),
> la nacionalidad y la profesión con SER aunque sean temporales, y el estado
> resultante con ESTAR»

Los tres ejemplos que da la descripción **coinciden con el español**. Los
doce ítems, uno a uno:

| ítem | portugués | español | ¿diverge? |
|---|---|---|:-:|
| GJ-13 | o jantar **é** no restaurante | la cena **es** en el restaurante | **no** |
| GJ-14 | a reunião **é** às três | la reunión **es** a las tres | **no** |
| GJ-15 | a biblioteca **fica** ao fundo da rua | la biblioteca **está** al final de la calle | **SÍ** |
| GJ-16 | a porta **esteve** aberta | la puerta **estuvo** abierta | **no** *(lo dice el propio autor)* |
| GJ-17 | **sou** português | **soy** portugués | **no** *(«sin excepción», dice)* |
| GJ-18 | **está** doente | **está** enfermo | **no** |
| GJ-19 | **é** professora | **es** profesora | **no** |
| GJ-20 | o concerto **é** no Coliseu | el concierto **es** en el Coliseo | **no** *(lo dice el propio autor)* |
| GJ-21 | este café **está** frio | este café **está** frío | **no** |
| GJ-22 | a entrada **é** gratuita / **está** esgotada | la entrada **es** gratuita / **está** agotado | **no** |
| GJ-23 | a festa **é** no domingo | la fiesta **es** el domingo | **no** |
| GJ-24 | o prédio **é** do século XIX / **está** remodelado | el edificio **es** del s. XIX / **está** remodelado | **no** |

**Cobertura real del punto: 1 ítem de 12.** El único que hace lo que el
nombre del punto promete es GJ-15, y lo hace con **ficar**, que ni siquiera
es *ser* ni *estar*.

Dos de las explicaciones del propio doc lo confiesan:

- GJ-16: «El español diría "estuvo abierta" igual, así que aquí las dos
  lenguas coinciden».
- GJ-20: «Que el español diga "el concierto es en el Coliseo" debería
  ayudar».

Cuando dos ítems de doce **declaran por escrito que no divergen**, el punto
no se está cubriendo: se está rellenando.

La coartada del doc para GJ-14 —«El español usa "es" para la hora pero
"está" para muchos otros casos, y el hablante generaliza mal»— es una
hipótesis sobre el error del aprendiz, no un contraste entre lenguas. Puede
ser cierta; no convierte el ítem en divergente. Y si el aprendiz generaliza
mal, el remedio no es un juicio binario que su intuición española acierta:
es un ítem donde su intuición española **falle**.

### El defecto está aguas arriba, en el currículo

No lo puede arreglar el lote solo. La entrada de `concepts.json` **describe
mal el español**, y el lote la implementa con fidelidad. Hay que corregir la
descripción del punto antes de reescribir los ítems, o el lote 12 volverá a
caer en lo mismo.

### Qué sí diverge (materia real para doce ítems)

- **`ficar` locativo permanente** — «A biblioteca fica…»; el español no tiene
  el verbo. (GJ-15, el único superviviente.)
- **`ficar` resultativo** — «Fiquei doente», «A casa ficou limpa» ⇒ ES «me
  puse», «quedó». Cero ítems.
- **`estar com` + sustantivo donde el español usa TENER** — «estou com
  fome/pressa/sede» ⇒ ES «tengo hambre». Divergencia de libro. Cero ítems.
- **`ficar bem/mal`** (ropa, colores) ⇒ ES «te queda bien». Cero ítems.
- **`ser casado`** en europeo frente al ES «estar casado». Cero ítems.
- **`está calor / está frio`** ⇒ ES «hace calor». Cero ítems.

Seis familias divergentes de verdad, una cubierta. Con éstas la glosa
española **falla**, que es la prueba de que el punto es el que dice ser.

---

## 4 · Recuento de SUB-TIPOS por punto

La meta ya no es el número de ejercicios sino la cobertura, así que esto se
cuenta, no se estima.

### A · `b11-alternancia-infinitivo` — 6 MAL

| ítem | marco | error real | ¿sub-tipo distinto? |
|---|---|---|:-:|
| GJ-01 | prep. + **sujeto expreso** + verbo | infinitivo sin flexionar | — |
| GJ-05 | prep. + **sujeto expreso** + verbo | **verbo finito** (*saiu*, pretérito) | sí, y no es del punto |
| GJ-08 | prep. + **sujeto expreso** + verbo | infinitivo sin flexionar | **= GJ-01** |
| GJ-11 | prep. + **sujeto expreso** + verbo | futuro do conjuntivo por inf. pessoal | sí |
| GJ-06 | conjunción + inf. pessoal | mezcla de las dos construcciones | sí |
| GJ-10 | «antes de que» | híbrido calcado del español | sí |

**Cuatro de seis MAL comparten el mismo marco sintáctico** (preposición +
sujeto expreso + verbo), con sólo dos preposiciones distintas —«sem» se
repite— y dos sujetos que se repiten literalmente: «os miúdos» en GJ-01 y
GJ-11, «eles» en GJ-05 y GJ-08.

Matizo la sospecha que me pasaron, porque la medida no la confirma del todo:
**el marco se repite cuatro veces, el error no**. Sólo GJ-01 y GJ-08 son el
mismo error; GJ-05 y GJ-11 fallan por sitios distintos. Es un problema de
monotonía y de predictibilidad, no de contenido duplicado. Medido, además,
no llega a atajo:

```
lleva sujeto expreso entre preposición e infinitivo  13/24 (54 %) · p=0.4194
```

Pero sí hay dos cosas que sobran y una que falta:

- **GJ-05 no es del punto.** «Depois de eles **saiu**» no es «infinitivo sin
  flexionar»: es un **pretérito perfeito** detrás de una preposición. El
  infinitivo pessoal de 3.ª singular de *sair* es *sair*, no *saiu*. Un
  aprendiz de B1 ya sabe que tras «depois de» va infinitivo; no hace falta
  saber que existe el flexionado. La explicación además lo llama «la forma de
  3.ª singular», que no es lo que hay ahí. **Es el ítem más elemental de la
  sección A y está mal descrito.** (El verdict es correcto; la etiqueta de
  punto y la explicación, no. Al revisor lingüístico le tocará la segunda
  parte.)
- **GJ-04 y GJ-07 no ejercitan el punto**: son sujeto expreso de 3.ª singular
  y de 1.ª singular, donde la flexión **coincide** con el infinitivo simple.
  El alumno no ve ninguna desinencia, así que no elige nada. Son dos de los
  seis BIEN.
- **Falta la tercera casilla.** La regla que el doc enuncia tiene tres celdas
  y los doce ítems no cubren la tercera: **no hay ni un solo ítem de
  hipercorrección**, del tipo «\*Prefiro nós irmos» / «Prefiro ir», donde
  flexionar sea el error. Los seis MAL fallan todos hacia el español (cuatro
  por defecto de flexión, dos por forma equivocada). La skill pide
  explícitamente «BIEN de hipercorrección… infinitivo pessoal»; aquí no hay
  ni MAL ni BIEN de esa clase. Un alumno que salga de este lote habrá
  aprendido «ante la duda, flexiona», que es el error de la etapa siguiente.

### B · `b11-ser-estar-divergente` — 6 MAL, 6 BIEN

| sub-tipo | ítems | cuántos |
|---|---|---:|
| **evento + copula** (mismo marco: SN evento + é/está + hora/lugar/fecha) | GJ-13 **B**, GJ-14 **M**, GJ-20 **M**, GJ-23 **M** | **4** |
| **ser/estar en la misma frase** (mismo diseño: «X é …, mas/embora está …») | GJ-19 **B**, GJ-22 **B**, GJ-24 **B** | **3** |
| **estado transitorio con ser** (mismo error) | GJ-18 **M**, GJ-21 **M** | 2 |
| estar + participio, estado resultante | GJ-16 **B** | 1 |
| nacionalidad | GJ-17 **M** | 1 |
| ficar locativo | GJ-15 **B** | 1 |

**Confirmo la sospecha y la agravo**: no son tres ítems de evento, son
**cuatro** (GJ-13 es el mismo marco en positivo). Y hay un segundo racimo
igual de gordo al otro lado: **tres de los seis BIEN son el mismo diseño**
«ser para lo que es, estar para cómo está, en una frase con adversativa», y
las tres explicaciones se pelean por ser la definitiva: «Es el ítem que
muestra la línea entera de un vistazo» (GJ-19), «Es el contraste que el
punto existe para fijar» (GJ-22), «es la prueba de que el alumno tiene la
distinción» (GJ-24). Cuando tres ítems reclaman el mismo título, sobran dos.

Y el propio doc lo firma, en GJ-23: «El **tercer** evento del punto —reunión,
concierto, fiesta—».

**Doce ítems, seis sub-tipos, y dos de ellos se llevan siete.** Con la
corrección del §3 encima (once de doce no divergen), la cobertura real del
punto es **1**.

Medido, el sub-tipo de evento **no** llega a atajo por sí solo, y lo digo
para no inflar el expediente:

```
sujeto = EVENTO (reunião/concerto/festa/jantar)   15/24 (63 %) presente⇒MAL · presente en 5 · p=0.1537
primer verbo copulativo es una forma de ESTAR     15/24 (63 %) presente⇒MAL · presente en 5 · p=0.1537
lleva a la vez una forma de SER y una de ESTAR    15/24 (63 %) presente⇒BIEN · presente en 3 · p=0.1537
```

Los tres se quedan en p=0,15. **Ninguno bloquea.** El sub-tipo es un problema
de cobertura, no de atajo; el atajo es el del §1.

Y la otra sospecha que me pasaron, el **largo de la coleta tras la coma**:
barrida a todos los umbrales, no aparece nada. El mejor de la familia es
«caracteres tras la 1.ª coma > 28» con 14/24, p=0,271. **Descartada, medida.**

---

## 5 · NIVEL REAL, ítem por ítem

Yardstick: el mapa del propio repo, `lib/data/anchor.ts` → `BLOQUE_A_NIVEL`.
`b3 = A2` (ser/estar), `b6 = B2` (conjuntivo), `b7 = B2` (formas no
personales — ahí vive `b7-infinitivo-pessoal`), `b11 = C1`.

O sea: por el mapa del proyecto, el infinitivo pessoal y el conjuntivo son
**B2**, y ser/estar es **A2**. Lo que este lote tiene que aportar de C1 es el
incremento: en A, la **elección entre tres**; en B, la **divergencia**.

### Sección A

| ítem | qué exige de verdad | nivel |
|---|---|:-:|
| GJ-01 | una celda: sujeto expreso ⇒ flexiona | **B2** |
| GJ-02 | una celda + recuperar el sujeto del imperativo | **B2/C1** |
| GJ-03 | **dos celdas en una frase** (inf. pessoal 1pl + inf. con sujeto de 3sg) | **C1** ✓ |
| GJ-04 | flexión invisible; lo único observable es la próclise (b8) | **B2** |
| GJ-05 | que tras preposición no va un pretérito | **B1** |
| GJ-06 | **conjunción vs. infinitivo pessoal**, las dos buenas por separado | **C1** ✓ |
| GJ-07 | flexión invisible (1sg) | **B2** |
| GJ-08 | una celda = GJ-01 | **B2** |
| GJ-09 | conjuntivo tras impersonal + que; sin alternancia. Puro b6 | **B2** |
| GJ-10 | calco «antes de que»; léxico-sintáctico, no elección | **B2** |
| GJ-11 | **fut. do conjuntivo vs. inf. pessoal**, homófonos de facto | **C1** ✓ |
| GJ-12 | «ao + inf. pessoal», una celda, flexión visible | **B2** |

**C1 real en la sección A: 3 de 12** (GJ-03, GJ-06, GJ-11). Son, además, los
tres mejores ítems del lote.

### Sección B

| ítem | qué exige de verdad | nivel |
|---|---|:-:|
| GJ-13 | evento con ser; el español elige igual | **B1** |
| GJ-14 | ídem, en MAL | **B1** |
| GJ-15 | ficar locativo — el único divergente; pero es materia de A2 («Onde fica…?») | **A2/B1** |
| GJ-16 | estar + participio; el autor declara que el español coincide | **A2** |
| GJ-17 | nacionalidad con ser | **A1** *(el autor lo admite)* |
| GJ-18 | ser/estar doente; idéntico al español | **A2** |
| GJ-19 | profesión con ser; lo C1 de la frase («embora» + conjuntivo, «estar a») es de b6 y b7, **no del punto** | **A2** |
| GJ-20 | evento; el autor admite que el español ayuda | **B1** |
| GJ-21 | ser/estar frio; idéntico al español | **A2** |
| GJ-22 | ser + estar en una frase; idéntico al español | **B1** |
| GJ-23 | evento | **B1** |
| GJ-24 | ser + estar en una frase; idéntico al español | **B1** |

**C1 real en la sección B: 0 de 12.** El techo de la sección es B1.

### El total

**3 ítems de 24 son C1.** El lote se presenta como el que ataca «los puntos
de C1 que están a cero… los que marcan el reloj del proyecto», y cerraría
24 unidades de déficit de C1 con **21 ítems de A1–B2**. Ése es exactamente
el modo de fallo que la meta de cobertura quería evitar: la tabla queda en
verde y el alumno no ha subido de nivel.

Nota de coherencia interna, que es un defecto de enseñanza y no de nivel: la
regla de cabecera de la sección A dice «sujeto propio y expreso ⇒ infinitivo
pessoal», y tres ítems más abajo GJ-03 llama **«infinitivo simple»** a «até
**a chuva** passar», que tiene sujeto propio y expreso. GJ-04 analiza el
mismo fenómeno bien («infinitivo pessoal… donde la flexión coincide con el
infinitivo simple»). El alumno lee dos análisis contradictorios de la misma
estructura con un ítem de por medio. Hay que unificar: es **infinitivo
pessoal sincrético**, siempre.

---

## 6 · FUGAS — la explicación de un ítem es la respuesta de otro

La skill lo prohíbe y cita tres casos históricos, «las tres se cortaron».
Aquí hay **doce fugas hacia adelante**, y ocho de los doce MAL están
respondidos por escrito antes de que el alumno los vea.

### Fugas DURAS (la explicación da la regla **y** el marco)

| explicación de | dice | responde a | MAL regalados |
|---|---|---|---|
| **GJ-01** (ítem nº 1) | «Con el sujeto expreso ("os miúdos"), el infinitivo se flexiona» | GJ-05, GJ-08, GJ-11 | 3 |
| **GJ-02** (nº 2) | «…y aquí no hace falta conjunción ninguna» + «el español resolvería con subjuntivo ("antes de que salgan")» | GJ-10 | 1 |
| **GJ-06** (nº 6) | «las dos son buenas por separado: *é preciso fazermos* / *é preciso que façamos*» | GJ-09 | 0 (GJ-09 es BIEN) |
| **GJ-13** (nº 13) | «el evento va con SER **aunque se hable de dónde ocurre**. Si el sujeto fuera un objeto… sería ESTAR» | GJ-14, GJ-20, GJ-23 | 3 |
| **GJ-14** (nº 14) | «Un evento ocurre, y el portugués lo dice con SER: *a reunião é às três*, *o casamento é no sábado*» | GJ-20, GJ-23 | (repite) |
| **GJ-18** (nº 18) | «"Ser doente" es una condición permanente; el estado pasajero va con ESTAR» | GJ-21 | 1 |

**8 de los 12 MAL** (GJ-05, 08, 10, 11, 14, 20, 21, 23) tienen su respuesta
escrita en un ítem anterior.

La peor con diferencia es **GJ-13 → GJ-14**: son consecutivos. El alumno
termina el ítem 13, lee «el evento va con SER aunque se hable de dónde
ocurre», pasa al 14 y se encuentra «A reunião… **está** às três». No es una
fuga, es la solución impresa en la página anterior. Y la misma explicación
resuelve además el 20 y el 23.

### Fugas BLANDAS (la regla en abstracto, sin el marco)

- GJ-03 → GJ-06 (impersonal + infinitivo pessoal sin «que»)
- GJ-17 → GJ-19 («con SER, por muy temporal que sea» ⇒ profesión con ser)
- GJ-19 → GJ-22, GJ-24 (enseña el diseño «ser para lo que es, estar para
  cómo está», que es exactamente lo que hay que juzgar en los dos)
- GJ-20 → GJ-23

### Y una autoinculpación

GJ-08 abre su explicación con **«Mismo caso que GJ-05»**. El doc declara por
escrito que un ítem es la repetición de otro. Si el autor lo sabe, el ítem no
debería estar.

---

## 7 · DIETA MIXTA — se cumple la letra y se incumple el espíritu

La regla pide «mínimo 3-4 MAL gramaticales donde TODAS las palabras sean
portuguesas y ninguna sea visiblemente española».

**Se cumple con creces: 12 de 12.** Ninguno de los doce MAL contiene un
hispanismo léxico (los tres que el preflight marca son falsos positivos por
«desde», §1 ter). Contra el atajo de la palabra española, este lote es el
mejor de la serie.

Pero la regla existe por una razón declarada: «si los MAL se resuelven con
"¿hay una palabra visiblemente española? → MAL", el lote es de A2 disfrazado
(19/20 sin saber portugués)». **El objetivo era que no se resolviera sin
saber portugués, y se resuelve: 20/24.** Se cerró la puerta del léxico y se
dejó abierta la de la sintaxis.

Lo que la regla pide de verdad, y lo dice en su segunda mitad, es MAL «cuya
traducción palabra-por-palabra dé español **roto**» — y aquí hace falta lo
contrario: **BIEN cuya traducción literal dé español roto** (GJ-03, GJ-04
son los dos únicos) y **MAL cuya traducción literal dé español perfecto**
(GJ-08, GJ-10, los otros dos únicos). Con cuatro de veinticuatro no basta.
La regla debería reescribirse en esos términos, porque la formulación actual
—que habla de palabras— es la que dejó pasar esto.

---

## 8 · METADATA — cero declaraciones en veinticuatro ítems

El doc **no declara `register` ni `address` en ningún ítem**. En el catálogo
publicado los 146 juicios los llevan todos (`register`: neutro 99, informal
44, formal 3; `address`: ausente 109, `tu` 36, `terceira_sem_pronome` 1). El
lote no puede publicarse así.

Repasando el tratamiento **realizado en el texto**, que es la condición que
pone la skill («`address` SÓLO donde hay tratamiento en la frase… un "tu", un
"-te", un posesivo de 2.ª o una forma verbal 2sg»):

| ítem | tratamiento realizado | qué debe declarar |
|---|---|---|
| **GJ-10** | «dei**xa** a chave» (imperativo 2sg) + «saí**res**» (inf. pessoal 2sg) | `register: informal` · **`address: tu`** — es el ÚNICO ítem del lote que lo exige |
| **GJ-04** | «**o senhor**» + «Trouxe» | `register: formal` · y **no hay valor de `address` en el catálogo que le sirva** |
| **GJ-02** | «verifi**quem**», «saí**rem**», «fecha**ram**» (3.ª pl., o sea *vocês*) | `register` sí; **`address` NO** |
| los otros 21 | ninguno | `register` sí; `address` ausente |

Tres precisiones sobre lo que me preguntaron:

1. **GJ-02 y GJ-04 no se contradicen.** Uno trata de *vocês* y el otro de *o
   senhor*: los dos son no-tuteo y conviven sin problema en un mismo lote.
   La incoherencia no es entre ellos, es que **ninguno de los dos declara
   nada**.
2. **GJ-02 no debe llevar `address`.** «Verifiquem» es 3.ª plural para
   *vocês*, no una forma de 2.ª singular, y la doctrina del proyecto es que
   *vocês* plural es normal y no se marca. Que quede escrito en el doc, o el
   lote 12 lo marcará por analogía con GJ-10.
3. **GJ-04 destapa un hueco del esquema, no del lote.** «O senhor» es
   deferencia **nominal explícita**; el único valor no-`tu` del catálogo es
   `terceira_sem_pronome`, que literalmente dice *sin pronombre* y por tanto
   no describe esto. Hay que añadir un valor (`nominal_o_senhor` o similar) o
   decidir por escrito que «o senhor» va sin `address` y sólo con `register:
   formal`. Sea cual sea la decisión, **es una decisión, y no está tomada**.

Aviso menor de registro, no bloqueante: «os miúdos» (GJ-01, GJ-11) es
coloquial, «o senhor» (GJ-04) es deferente y «deixa a chave debaixo do
tapete» (GJ-10) es íntimo. Tres registros en doce ítems está bien —variedad—
siempre que se declare. Sin declarar, `revisarRegistro` no puede hacer su
trabajo.

---

## 9 · BLOQUEANTE — «antes: 0» es cierto del **id** y falso del **punto**

La tabla de cabecera dice `b11-alternancia-infinitivo | antes 0`. Es cierto
para ese identificador. No lo es para el punto:

```
$ node -e "…contar ejercicios por concepto en lib/data/languages/pt/blocks/…"
b3-pres-irr-ser-estar   8
b7-infinitivo-pessoal   6
b7-estar-a-infinitivo  17
```

**`b7-infinitivo-pessoal` tiene 6 ejercicios publicados**, y uno de ellos es:

> `b7/04350a8e` — «**Sem eu perceber**, ela já tinha decidido tudo.»

Que es el marco exacto de GJ-08 («Sem eles saber…») y GJ-11 («Sem os miúdos
souberem…»), y comparte verbo con GJ-01 («…perceber o exercício»). Los otros
cinco son «É importante eu falar com ela», «É bom ela sair mais cedo», «Ele
recomenda eu desistir», «Vir tu, não sei se ela vir», «Se saber ele antes» —
o sea, el impersonal + infinitivo pessoal de GJ-03 y la homofonía con el
futuro do conjuntivo de GJ-11, ya publicados en **b7 = B2**.

Reenseñar en C1 un punto de B2 es legítimo —lo dice la skill— **pero tiene
que salir declarado en el doc**, y no sale. Y confirma el §5: el proyecto ya
había colocado el infinitivo pessoal en el bloque B2.

### Por qué el gate no lo vio, que es peor que el hallazgo

```
$ npx tsx <sonda de virginidad de los 24 candidatos contra los 6 de b7-infinitivo-pessoal>
publicados con ese concepto: 6
  CERO pares por encima del umbral: el gate no ve el solape de PUNTO
  (los candidatos van con concepts: []).
```

`scripts/preflight-lote.ts`, línea 94, construye cada candidato con
**`concepts: []`** literal. El eje de conceptos del gate de virginidad —el
que la skill describe como «el segundo eje… compara el PUNTO, no las
palabras»— **está desactivado por construcción en el preflight**, para todos
los lotes. El doc declara sus dos puntos en las cabeceras de sección y esa
información nunca llega al gate.

Es exactamente el fallo que el lote 10 v2 documentó y creyó cerrado («cinco
llevan `concepts: []` y por eso no los conté»), reaparecido un piso más
abajo: ahora no es que los ítems publicados no los tengan, es que **el
preflight tira los de los candidatos**.

Fix: que el parser lea el concepto de la cabecera `## A · \`<id>\`` y lo
ponga en el candidato.

---

## 10 · Qué está bien (y es bastante)

No es cortesía: si no se separa, el lote 12 tira lo bueno con lo malo.

- **Los números del preflight pegado son fieles.** Reproducidos: las 11 filas
  de atajos y las 17 de virginidad, idénticas. Segundo lote seguido en que un
  número declarado resiste la reproducción. Ese hábito ya está adquirido (la
  sección de molde sí caducó, §0, pero eso es del sello, no del autor).
- **El atajo de la LONGITUD está muerto de verdad.** 13/24 en palabras y
  13/24 en caracteres, los dos a p=0,419. Y no por casualidad: los MAL
  llevan su coleta. Se hizo lo que había que hacer.
- **El atajo del ARRANQUE, que fue el que mató al lote 10 v2 con 13/16, está
  en 14/24 (p=0,271).** La corrección se aplicó y aguantó.
- **La alternancia mecánica, exactamente 12/24.** El patrón `MBBB…` no calca
  ningún prefijo quemado y no choca con el `MMBM` del lote 10 v3, que está
  en vuelo.
- **El molde pasa el criterio NUEVO, no sólo el viejo.** Corrido
  `evaluarMolde` contra los diez patrones publicados:
  ```
  patrón del lote 11 (24): MBBBMMBMBMMBBMBBMMBMMBMB
  evaluarMolde(24) → []
  sección A (12): MBBBMMBMBMMB → []
  sección B (12): BMBBMMBMMBMB → []
  ```
  Sin calco, sin casi-complementaria, sin racha, sin desequilibrio.
- **La sección A está de verdad blindada en su superficie**, y eso cuesta
  trabajo: el infinitivo flexionado visible (-rem/-rmos/-res) aparece en 3
  BIEN y 3 MAL (rasgo 13/24, p=0,419), y en la sección B «lleva alguna forma
  de ESTAR» sale **12/24 exacto** (4 BIEN y 4 MAL, 2 y 2 en los ausentes).
  Eso no pasa solo.
- **GJ-11 es el mejor ítem del lote.** *Souberem* (futuro do conjuntivo) vs
  *saberem* (infinitivo pessoal) es una discriminación real de C1, sin
  análogo español, y la explicación es exacta.
- **GJ-06 y GJ-03** son los otros dos C1 legítimos, y GJ-06 tiene la mejor
  explicación del documento: «las dos construcciones son buenas por separado
  y lo que no existe es la mezcla» es cómo se enseña una alternancia.
- **GJ-15 es el único ítem que hace lo que promete el nombre de su punto.**
  Consérvese entero.
- **La honestidad de GJ-16** —«conviene que coincidan en algún ítem, o el
  alumno aprende que siempre difieren»— es buena pedagogía y hay que
  guardarla. El problema no es el ítem: es que en la sección hay once así y
  se declara lo contrario.
- **La decisión de NO hacer los conectores discursivos, con el motivo
  escrito** («sus errores son de registro o de matiz, no de gramaticalidad, y
  ésa es la clase que tumbó la v1 del lote 10») es exactamente el juicio
  correcto, y está razonada en el doc antes de que nadie la pidiera.
- **El banco de doce pares mínimos de ser/estar ya está escrito y verde.** El
  trabajo del §2 no es empezar de cero: es usar lo que hay.

---

## 11 · Lista cerrada de BLOQUEANTES

| # | bloqueante | evidencia |
|---:|---|---|
| **B1** | **Atajo de la glosa cognada**: traducir palabra por palabra al español y juzgar con intuición española acierta **20/24 (p=0,0008)**; en la sección B, **12/12 (p=0,0002)**. El lote se resuelve sin saber portugués. | §1 |
| **B2** | **La sección B no cubre su punto**: `b11-ser-estar-divergente` declara los usos que NO coinciden con el español y **11 de 12 coinciden**. Cobertura real: **1 ítem** (GJ-15). Dos explicaciones lo confiesan por escrito. El defecto está también en `concepts.json`. | §3 |
| **B3** | **Nivel**: sólo **3 de 24 ítems son C1** (GJ-03, GJ-06, GJ-11), todos en la sección A; la sección B tiene **cero** y su techo es B1. Cerrar 24 unidades de déficit de C1 con 21 ítems de A1–B2 pone la tabla en verde sin mover al alumno. | §5 |
| **B4** | **Fugas**: **8 de los 12 MAL** están respondidos por la explicación de un ítem anterior. GJ-13 → GJ-14 son **consecutivos**. GJ-08 declara por escrito «Mismo caso que GJ-05». | §6 |
| **B5** | **Sub-tipos**: en B, **4 de 12** ítems son el marco «evento + copula» y **3 de 6 BIEN** son el mismo diseño «ser + estar en una frase» — 7 de 12 en dos moldes. En A, **4 de 6 MAL** comparten marco; **GJ-04 y GJ-07 no ejercitan el punto** (flexión invisible); **falta entera la tercera celda** de la regla (ningún ítem de hipercorrección). | §4 |
| **B6** | **El lote deshizo los pares mínimos que ya existen**: 11 de 12 ítems de la sección B son **un** miembro de un par de `tests/unit/pares-minimos.test.ts` con el hermano tirado. La máquina (`scripts/lib/pares-minimos.ts`, 19/19 verdes) no se usó. Y arreglarlo **no basta**: los pares no neutralizan B1. | §2 |
| **B7** | **Metadata**: **cero** `register`/`address` en 24 ítems. GJ-10 exige `informal`/`tu`; GJ-04 exige `formal` y **no existe valor de `address`** en el catálogo para «o senhor» — hay que crearlo o decidir por escrito que va sin él. | §8 |
| **B8** | **«antes: 0» es falso para el punto**: `b7-infinitivo-pessoal` tiene **6 ítems publicados**, uno de ellos «Sem eu perceber…», el marco de GJ-08/GJ-11. Reenseñar es legítimo pero hay que declararlo. Y el gate no puede verlo porque **`preflight-lote.ts` construye los candidatos con `concepts: []`** (línea 94), lo que deja el eje de conceptos apagado para todos los lotes. | §9 |

### Avisos (no bloquean, pero se arreglan en la misma pasada)

- **A1** — Peso léxico: «≥2 palabras de 8+ letras» acierta 18/24 (p=0,011).
  Encontrado por barrido de ~139 rasgos, así que en este lote vale como
  aviso; métase en `RASGOS` para que en el 12 valga como medida. §1 bis
- **A2** — El rasgo «palabra visiblemente española» tiene falsos positivos:
  dispara con **`desde`** (portugués corriente) en GJ-17/18/21, y disparará
  con `nunca` y con `traje`. §1 ter
- **A3** — GJ-05 no es del punto: es un pretérito tras preposición (B1), y su
  explicación llama «forma de 3.ª singular» a `saiu`, que no lo es.
- **A4** — GJ-03 llama «infinitivo simple» a «até a chuva passar», que por la
  regla de cabecera de su propia sección es **infinitivo pessoal
  sincrético**; GJ-04 analiza el mismo fenómeno correctamente. Dos análisis
  contradictorios con un ítem de por medio.
- **A5** — **El sello de vigencia no sella lo que produce la salida.** Estampa
  `atajos.ts` (sin cambios, `4cc7a606`) mientras `preflight-lote.ts` cambió en
  `b905c45`, posterior al doc: la sección de molde pegada está caducada —cita
  el «prefijo de 4», que ya no existe, y le falta la tabla de solape con los
  lotes publicados— y el sello da luz verde. Encadenar los tres ficheros en el
  hash y volver a pegar la salida. Los números de atajos y virginidad no
  cambian; la sección de molde sí. §0

---

## 12 · Qué haría yo con el lote

No es reparable ítem a ítem, y la regla de corte de tres rondas no debería
gastarse en parches.

- **Sección A — se salva, reconstruida.** Se conservan GJ-03, GJ-06, GJ-11
  (los tres C1) y GJ-02, GJ-12. Se retiran GJ-05 (B1, mal etiquetado), GJ-04
  y GJ-07 (flexión invisible), GJ-08 (duplica GJ-01). Se reponen con: dos de
  **hipercorrección** (flexionar donde no toca), uno de infinitivo pessoal
  **compuesto** con flexión visible, uno de «para + inf. pessoal» de 2.ª
  plural, y dos de la tercera celda. Y se genera **por pares mínimos**, lo que
  además obliga a que cada frase aparezca dos veces y mata de golpe B4 y B5.
- **Sección B — se rehace entera, y antes se arregla el currículo.** Primero
  corregir la descripción de `b11-ser-estar-divergente` en `concepts.json`,
  que hoy afirma tres divergencias que no lo son. Después escribir doce pares
  sobre las seis familias del §3 (ficar locativo, ficar resultativo, `estar
  com` vs. *tener*, ficar bem/mal, ser casado, está calor). En esas familias
  la glosa española **falla**, que es la única prueba de que el punto es el
  que dice ser. Se conserva GJ-15.
- **Antes de abrir la ronda 2**: meter los dos rasgos nuevos en `atajos.ts`,
  arreglar el regex del hispanismo, arreglar `concepts: []` en el preflight,
  encadenar los tres ficheros en el sello de vigencia, y volver a correrlo y
  a pegar la salida entera. Con el rasgo 12 dentro, el preflight **habría
  bloqueado este lote él solo**, que es como tiene que ser.

---

*Revisor pedagógico #2 · 2026-09-03 · ronda 1 · lote 11*
