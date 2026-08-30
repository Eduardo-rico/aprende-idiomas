# Mini-round lote 9 B2C2 — los cinco ítems REDISEÑADOS

Filólogo portugués (Lisboa), revisión adversarial. Sólo material nuevo:
GJ-01, MED-129, MED-132, MED-133, MED-134, MED-136.

Todo lo que afirmo aquí está verificado contra el repo. Las salidas van
pegadas. No he tocado un solo fichero del repo (los dos `.ts` temporales
que corrí para los gates se borraron en la misma orden).

---

## Resumen ejecutivo

| ítem | veredicto |
|---|---|
| **GJ-01** | **NO PASA** — 1 ERROR bloqueante (colisión con `b2c2-gj-l1-02`, 0,488) + 1 ERROR de `concepts` |
| **MED-129** | **NO PASA** — 3 ERROR (address ausente, dato inventado, dato falso) |
| **MED-132** | **NO PASA** — 3 ERROR (casilla 3 sigue sin fuente, casilla 2 a medias, recorte no se sostiene) + `fuente-compartida` con MED-135 |
| **MED-133** | **NO PASA** — 2 ERROR (address ausente, ortografía pre-AO90) |
| **MED-134** | **NO PASA** — 2 ERROR (colisión referencial que R1 mandó eliminar, «registros» por «tratamientos») |
| **MED-136** | **NO PASA** — 2 ERROR (artículo ante nombre en participação impresa, `address` sin declarar) |

Los conteos de palabras y el anti-copia sí están todos limpios.

---

## Comprobaciones transversales (PASAN)

**Conteo con el contador de la app** (`texto.split(/\s+/).filter(Boolean).length`,
`components/cards/MediationCard.tsx:38`):

```
MED-129 (90–140)     125 palabras   (123 si se descartan los guiones sueltos)
MED-132 (80–130)     111            (110)
MED-133 (45–85)       83            (81)
MED-134 (50–90)       77            (76)
MED-136 (55–95)       78            (78)
```

Los cinco **PASAN**. Una advertencia: MED-133 va a 83/85 — a **dos palabras
del techo**, y todavía le falta meter el «o senhor» que su casilla 4 exige
(ver más abajo). El modelo cumplidor NO cabe en el rango actual.

**Andamio prohibido — PASAN los cinco.** Ninguno abre con «Olha,…»; ninguno
usa el lema `repar-` como bisagra. Verificado, y con contexto que el doc no
tiene: de los 128 modelos publicados, **6 abren literalmente «Olha,»** y
son `med-27, med-35, med-37, med-50, med-52, med-94`; `med-44` abre
«Repara no que…» y `med-107` «Ojo, que…». Los **tres** `synthesise_sources`
Junqueiro publicados (27, 37, 52) abren «Olha,» **y** cierran con
«Repara[ na diferença]:». MED-129 y MED-132 escapan de las dos. Bien.

**Anti-copia (>6 palabras seguidas).** Script propio con normalización de
grafía antigua (ph→f, ct→t, ll→l…) contra las fuentes íntegras:

```
MED-129: runs de 4+ palabras copiadas: ninguna
MED-132: runs de 4+ palabras copiadas: ninguna
MED-133: runs de 5+ palabras copiadas: ['as suas faltas e o']   (5 < 6, y 133 no tiene esa casilla)
```

**PASAN.**

**Gate de registro del repo** (`scripts/lib/check-registro.ts`) sobre los
seis ítems: **`sin hallazgos` en los seis.** Eso NO es una absolución — es
el hallazgo. El gate sólo caza *contradicciones* (`address=o_senhor` + tuteo);
no comprueba **presencia**. Un modelo que no trata al destinatario de ninguna
manera pasa limpio. Es el agujero por el que R1 tuvo que cazar a mano
GJ-07/GJ-08 (E16/E17), y por el que hoy pasan MED-129 y MED-133.

---

## 1 · GJ-01 «Mal cheguei a casa, começou a chover.»

### PASA — la lengua

«Mal + pretérito perfeito simples» con valor de 'en cuanto, apenas' es
conector temporal europeo **corriente y bien formado**, y la frase está
impecable: `chegar A casa` sin artículo (europeo, frente al BR «chegar em
casa») y `começou a chover`. La puntuación, correcta.

### PASA — la cita de Eça EXISTE, y es exacta

Grep ancho con grafía antigua sobre `lib/data/languages/pt/lecturas/*.json`:

```
=== 'mal entrou' === 2
amor-de-perdicao-c10.json[26]        | Mal entrou na grade, disse á sua amiga:
o-crime-do-padre-amaro-c10.json[351] | Amaro, ao subir a escada, tremia--e, mal entrou na sala,
                                       o rosto d'Amelia, alumiado pelas luzes do piano, deu-lhe
                                       um deslumbramento…
```

La cita del doc («mal entrou na sala, o rosto d'Amelia…») es **literal y
correctamente atribuida a Eça** (*O Crime do Padre Amaro*, c10). Nada que
objetar — y va con expediente, porque este proyecto ya publicó citas que el
grep devolvía y el sentido no (GJ-03, lote 5).

**Y el conteo de 5 atestaciones se queda CORTO.** Grep ancho por
`mal + (pretérito | mais-que-perfeito | imperfeito)` con valor temporal, 38
candidatos revisados a mano; los genuinos son **al menos nueve**:

```
amor-de-perdicao-c10[26]          Mal entrou na grade, disse á sua amiga
o-crime-do-padre-amaro-c10[351]   mal entrou na sala, o rosto d'Amelia … deu-lhe
o-crime-do-padre-amaro-c11[109]   mal viu o pallio … apoderou-se do braço
o-crime-do-padre-amaro-c19[77]    mal soubera que o conego Dias … estava interessado
junqueiro-a-boneca[110]           Mal passou a chuva, desci o degrau da porta
junqueiro-o-ermitao[3]            mal o encontrou disse-lhe
os-maias-c17[320]                 Mal acordou, puxou a mala para o meio do quarto
a-cidade-e-as-serras-c16[49]      mal eu entrára, o seu dizer … foi suffocado
contos-phantasticos--a-adega-de-funck[24]  Mal acabava de proferir … quando se atirou
```

(y dos de la variante `mal que`: `beijos-por-facadas[101]`,
`viagens-na-minha-terra-c18[31]`). El punto está vivísimo.

### ERROR 1 (BLOQUEANTE) · la frase reutiliza la REPARACIÓN de un ítem publicado

Corrí el gate del propio repo:

```
$ npx tsx scripts/check-virginidad.ts --nuevos <candidatos>
corpus indexado: 2318 ejercicios · 8530 tipos de palabra · umbral 0.34

── PALABRAS (solape IDF) ──
0.488  b2c2-gj-l9-01  ↔  b2c2-gj-l1-02 (b8 grammaticality_judgment)
         comparten: cheguei, casa
         Cheguei em casa muito tarde. · Cheguei a casa muito tarde.
0.389  b2c2-gj-l9-01  ↔  a21205af (b7 translation)
         comparten: chover, começou
         Estávamos a esperar o ônibus quando começou a chover.
0.352  b2c2-gj-l9-01  ↔  33979c62 (b4 translation)
         comparten: chover, casa
         Fiquei em casa porque estava a chover.
pares por encima del umbral: 3
```

Y el ítem publicado, entero (`lib/data/languages/pt/blocks/b8.json`):

```json
{ "id": "b2c2-gj-l1-02", "lessonId": "b8-l1-conectores-subordinadas-adverbiais",
  "data": { "sentence": "Cheguei em casa muito tarde.",
            "verdict": false,
            "repair":  "Cheguei a casa muito tarde.",
            "explanationEs": "'Chegar' de movimiento rige A en el estándar
              europeo — y con la casa de uno, sin artículo: 'chegar a casa'…" } }
```

Por qué es falso lo que el doc afirma («Verificado para el sustituto»):
la verificación que se hizo fue *del punto* («mal + pretérito»: 0 en bloques
— cierto). **No se corrió el gate de virginidad sobre la frase.** Y la frase
contiene, palabra por palabra, **la cadena de reparación de un MAL publicado
en la MISMA lección `b8-l1`**: `cheguei a casa`.

Consecuencia pedagógica, que es lo grave: el alumno que ya hizo `l1-02`
acaba de aprender que «cheguei **a** casa» es la forma correcta. Al ver
GJ-01 responde BIEN por la preposición, **sin mirar el «mal»**. El ítem deja
de medir lo que dice medir, y de paso le regala la clave de `l1-02`.

Es exactamente la muerte que el propio lote aplicó a «O casaco novo
assenta-te muito bem» (0,531 contra `l5-07`), con la doctrina escrita en el
mismo documento: «**Coincidir en el PUNTO es muerte**». Aquí ni siquiera es
sólo el punto: es la cadena literal.

**Qué debe decir:** otra frase con el mismo punto y sin `chegar a casa` ni
`começar a chover`. P. ej. **«Mal saímos do cinema, começámos a discutir.»**
o **«Mal acabou o discurso, toda a gente se levantou.»** — y volver a correr
`check-virginidad.ts --nuevos` antes de dar el punto por bueno, con la
salida pegada. Con 2.318 ejercicios indexados, adivinar no vale.

### ERROR 2 · el `concepts` sigue mal declarado — la ronda 3 lo mandaba arreglar

El mandato de ronda 3 dice literalmente «Sustituto **+ `concepts` correctos**»
(doc, §«Va a RONDA 3», punto 1). El sustituto se hizo; el `concepts` es el
mismo de antes: `[b8-conectores]`. Y `b8-conectores` **no cubre los
temporales** — `lib/data/languages/pt/concepts.json`:

```json
{ "id": "b8-conectores", "name": "Conectores",
  "description": "Causales (porque, pois, já que), consecutivos (por isso,
   então, logo), adversativos (porém, contudo, entretanto, mas),
   concessivos (embora, apesar de, ainda que)" }
```

Cuatro familias, ninguna temporal. El que sí lo cubre está al lado:

```json
{ "id": "b8-oracoes-subordinadas", "name": "Orações subordinadas",
  "description": "… adjetivas (…), adverbiais (quando, onde, como, porque)" }
```

No es cosmético: el propio doc explica que el clon con `l6-03` fue
«invisible al gate porque el `concepts` estaba mal declarado». Declararlo
mal otra vez reabre el mismo agujero. (De paso: `b2c2-gj-l8-01` «Ao sábado,
o mercado enche-se de gente» —que no es un conector— arrastra el mismo
`b8-conectores` desde el lote 8. La deuda es del catálogo, no sólo de este
ítem.)

**Qué debe decir:** `concepts: ["b8-oracoes-subordinadas"]`.

### DISCUTIBLE

La explicación enumera «mal cheguei, mal entrou, **mal soube**» sin avisar
de que el `mal` vecino —el de `mal sabia ele que…`, 'poco sabía'— es otra
cosa, y en esta misma Biblioteca sale mucho más veces que el temporal
(`os-maias-c03[245]`, `c10[302]`, `padre-amaro-c14[200]`, `c20[96]`,
`junqueiro-docura-e-bondade[2]`…). En un ítem B2/C2 que celebra la
polisemia de «mal», dejar el homónimo fuera es desaprovechar el ítem.

---

## 2 · MED-129 · «quién salva a cada niña» · `nome_cargo`

Coteje el modelo con las dos fuentes íntegras, párrafo a párrafo.

### Las cinco casillas, UNA POR UNA

**Casilla 1 — el cazador, intervención humana y deliberada. ✅ CUMPLE.**
`o-chapellinho-encarnado[31]`: «Um caçador que passava por acaso … ouviu
aquelle barulho»; `[33]`: «Não, disse elle, não vejo a dona da casa. Talvez
o lobo a engulisse viva. E em lugar de matar o animal com uma bala, pegou na
sua faca de mato, e abriu-lhe cuidadosamente a barriga»; `[33]-[35]`: salen
la niña y la abuela. El modelo lo recoge y hasta el «deliberada» está
justificado (el cazador **decide no disparar**). Buen trabajo.

**Casilla 2 — enanos ×2, azar la tercera. ✅ CUMPLE, y con precisión.**
- Collar: `branca-de-neve[32]` «Arrancaram-lhe o collar» → modelo «tiram-lhe
  o colar» ✓
- Peine: `[45]` «Tiraram-lhe o pente envenenado» → «tiram-lhe o pente» ✓
- Tercera, no pueden: `[60]` «Debalde tinham tentado reanimal-a» ✓
- El azar: `[64]` «Quatro homens pegaram no caixão… **Um d'elles tropeçou
  n'uma raiz**, e o caixão soffreu um balanço, que fez cair o bocado da
  maçã» → modelo «um tropeção que **lhe** faz sair o pedaço de maçã» ✓ —
  y con el acierto de **no** decir que tropieza ella.

**Casilla 3 — cómo acaban los dos culpables. ❌ INCUMPLE en las dos mitades.**
Ver ERROR 1 y ERROR 2.

**Casilla 4 — «tratando al profesor por el cargo y sin tuteo». ❌ INCUMPLE.**
Ver ERROR 3. (La mitad «sin tuteo» se cumple, pero se cumple vacuamente.)

**Casilla 5 — no copiar >6 palabras. ✅ CUMPLE** (0 runs de 4+, salida arriba).

### ERROR 1 · dato INVENTADO: «quando se baixa para beber»

Modelo: «…cose-lhe pedras na barriga, e é esse peso que o afoga **quando se
baixa para beber**».

Fuente, `junqueiro-o-chapellinho-encarnado[37]`, íntegro:

> «Decorrido um instante o lobo accordou, e como tinha sede, **levantou-se
> para ir beber ao lago**. **Ao andar** ouvia as pedras baterem uma na
> outra, e não podia comprehender o que aquillo era; **com o peso, caiu no
> lago, e affogou-se**.»

El lobo **se levanta y camina**; el peso lo hace **caer dentro** del lago.
No se agacha. «Se baixa para beber» es el final de los **Grimm** (el pozo),
que el alumno no ha leído — el modelo está contando otra versión del cuento.
Y esto en el ítem cuya casilla 5 pide fidelidad a *estos* dos textos.

**Qué debe decir:** «…e é esse peso que o faz cair ao lago, onde se afoga.»

### ERROR 2 · dato FALSO: «ao ver-se descoberta»

Modelo: «a rainha … morre de repente, de medo, **ao ver-se descoberta**».
Casilla 3: «la reina muere de repente, de miedo, **al verse descubierta**».
**El error está en la casilla y en el modelo a la vez.**

Fuente, `junqueiro-branca-de-neve[68]`:

> «A estas palavras a rainha estremeceu, e teve tal medo **que os seus
> crimes fossem descobertos**, que morreu de repente.»

Conjuntivo de algo que **no ha ocurrido**: teme *que lleguen a
descubrirse*. Nadie la descubre — nadie en la boda sabe nada; lo único que
pasa es que el espejo vuelve a nombrar a Branca. «Verse descubierta» afirma
un hecho que el texto niega, y encima le quita el filo a lo que el modelo
acierta dos líneas antes («não é castigada por ninguém»): muere de **miedo
anticipado**, que es justamente el detalle que distingue esta versión de la
de los Grimm (donde sí hay castigo, los zapatos al rojo).

**Qué debe decir** — casilla y modelo: «…morre de repente, de medo de que os
seus crimes viessem a ser descobertos.»

### ERROR 3 · `address: nome_cargo` declarado, y CERO marcas de tratamiento

El modelo, entero, no contiene **ni una** forma de tratamiento: ni vocativo,
ni cargo, ni verbo concordado con el destinatario. No hay «Senhor
Professor», no hay «como o Senhor Professor sabe», no hay nada. El
destinatario no existe en el texto.

Y la casilla 4 lo exige literalmente: «¿Está en portugués, entre 90 y 140
palabras, **tratando al profesor por el cargo** y sin tuteo?». **La casilla
no se cumple.**

Es el mismo defecto que R1 cazó en GJ-07 («declara `address: tu` sin una
sola marca de 2.ª persona», E16) y que la ronda 2 arregló allí. Aquí
reaparece en el ítem que se rehízo *entero* precisamente por incumplir
casillas — y el gate del repo no lo ve, como demostré arriba.

La convención publicada es inequívoca; los tres `nome_cargo`/`o_senhor`
publicados **realizan** el tratamiento en el cuerpo:

```
b2c2-med-40 (nome_cargo): «Exma. Senhora Diretora, … agradecia que
                           a Senhora Diretora nos informasse…»
b2c2-med-55 (nome_cargo): «Exmo. Senhor Peixoto, … que o senhor Peixoto
                           nos indicasse, até quarta-feira…»
b2c2-med-02 (o_senhor):   «Exmo. Senhor Diretor, Poderia o senhor confirmar…»
```

**Qué debe decir:** abrir «Exmo. Senhor Professor,» y, ya que la casilla pide
*tratar* y no sólo saludar, una marca en el cuerpo — p. ej. cerrar «…como o
Senhor Professor notará, uma vigia e a outra tem sorte». Sobran 15 palabras
de margen (125/140).

### ERROR 4 · la frase de cierre no es portugués interpretable

«**Uma vigia; a outra, sorte.**»

Dos problemas. (a) La elipsis no es paralela: cruza un **verbo** («vigia»)
con un **sustantivo** («sorte»), y «uma vigia» sin antecedente femenino
disponible se lee primero como el sustantivo *vigia* ('vigilante, ojo de
buey'). (b) El contenido es falso para el cuento que resume: en el
Capuchinho no salva ninguna *vigilancia*, salva una **intervención** — el
propio modelo lo dice cuatro líneas antes («a salvação é humana e
deliberada»). La palabra «vigilancia» es de MED-132 (su casilla 4: «en la
vigilancia del dueño, no en el amuleto»). Se ha contaminado un ítem con el
otro.

**Qué debe decir:** «Numa, salva-a um homem; na outra, o acaso.»

### PASA — lo que sí mejoró de verdad

«**O Capuchinho Vermelho**» es el título europeo correcto, y entierra el
híbrido BR/PT «Chapelinho Vermelho» de la v1 (R1-E3). «Branca de Neve» ✓.
«o ressonar» (infinitivo sustantivado) ✓ europeo natural. «à terceira já não
conseguem» ✓. Desapareció el «veste-lhe a roupa» imposible. Y el ítem ya no
clona a `med-96`: el gate de molde no devuelve ningún par para MED-129.

---

## 3 · MED-132 · recorte ampliado a `um-poeta-lirico` [54]–[59]

### ERROR 1 (BLOQUEANTE) · el recorte ampliado SIGUE sin contener «poeta que sirve mesas»

Es el hallazgo R1-E5 **sin arreglar**. La ampliación de [55]–[59] a
[54]–[59] añade exactamente un párrafo, y ese párrafo es:

> `[54]` «--¿Mas--perguntei-lhe eu--porque não deixa êste covil, êste templo
> do ventre?»

Ahí no hay ni «serve», ni «mesas», ni «restaurante», ni «criado», ni
«empregado». Leí los seis párrafos declarados enteros. Lo que un alumno
puede saber leyendo SÓLO [54]–[59]:

- `[55]` «a sua bela **cabeça de poeta**» → es poeta ✓
- `[56]` «Ama uma Fanny, **criada** de todo o serviço em Charing-Cross» →
  la **criada** es Fanny, no él; Charing-Cross es donde ella sirve
- `[57]` «aquele poeta a seu lado … **ama um policeman**» ✓
- `[58]` «quartilhos de gin, de brandy, de genebra … **mantem-no fiel pelo
  álcool**» ✓
- `[59]` «Korriscosso só pode escrever as suas elégias na sua língua
  materna… E **Fanny não compreende grego**» ✓

Cuatro de los cinco datos de la casilla 3 están. **El quinto —el que motivó
la ampliación— no.** Lo más cerca que llega el texto es «o nó da gravata
branca no cachaço» ([55]) y «êste templo do ventre» ([54]): pistas, no el
dato. El dato está en `[46]` («forçado a distribuir numa sala, a burgueses
estabelecidos e glutões, costeletas e copos de cerveja») y en `[60]`
(«quando se move pelo restaurante com a travessa do roast-beef») — ambos
**fuera** del recorte.

Y no hay salida por ampliar: bajar a `[46]` engulliría el recorte
`[47]–[52]` de **MED-135**, que es el mismo texto — reproduciendo el
`133 ⊂ 132` que esta sesión acaba de matar.

**Qué debe decir:** quitar «que sirve mesas» de la casilla 3 y de la
primera línea del segundo bloque del modelo, y sustituirlo por lo que el
recorte sí sostiene: «Korriscosso, o poeta que não consegue deixar aquele
"templo do ventre"…». Con eso la casilla vuelve a ser verificable.

### ERROR 2 · el recorte NO se sostiene solo (respuesta directa a la nota (i) del autor)

[54]–[59] **abre a mitad de un diálogo**, con dos deícticos sin antecedente:

> «--¿Mas--perguntei-lhe eu--porque não deixa **êste** covil, **êste** templo
> do ventre?»

¿Quién es «lhe»? ¿Qué es «êste covil»? El nombre «Korriscosso» no aparece
hasta el final de `[55]`. Un alumno que empieza en [54] no sabe a quién se
está hablando ni dónde está la escena hasta el segundo párrafo, y nunca
sabrá qué es el «covil». El recorte hermano de MED-135 ([47]–[52]) sí se
sostiene, porque abre con una tesis («Mas o que o tortura é o contacto
constante com o alimento»). Éste no.

**Qué debe decir:** empezar el recorte en `[53]` («Ah! é um amargo
destino!») no arregla nada; hay que **reescribir la casilla** para que no
dependa del oficio, o mover MED-132 a otra segunda fuente (el propio doc
dice que hay ~80 Junqueiro vírgenes) y dejar `um-poeta-lirico` entero para
MED-135.

### ERROR 3 · casilla 2 cumplida a medias — falta la moraleja

Casilla 2 pide **dos** cosas: «(a) que la moraleja está dicha en el texto
(el dueño no puede ser sustituido por un tercero) **y** (b) que el hombre
agradece DOS veces». El modelo entrega (b) —«Agradece duas vezes — o
conselho e a delicadeza», corregido respecto de la v1, bien— y **omite (a)
por completo**.

La moraleja está literal en `junqueiro-o-talisman[6]`:

> «…viu tudo isto, e que era necessário dar-lhe remedio, **comprehendendo
> que o dono da casa nunca póde ser substituido por terceira pessoa na
> direcção dos seus negocios**.»

El modelo dice «vê o que nunca via» y salta directo al agradecimiento. R1
cazó que faltaba el doble agradecimiento; se arregló ése y se cayó el otro
medio de la misma casilla.

**Qué debe decir:** insertar «…e percebe que a casa de um homem não se
governa por terceiros.» Hay 19 palabras de margen (111/130).

### DISCUTIBLE · casilla 4 sólo se roza

Casilla 4 especifica dos contrastes: «en la vigilancia del dueño, no en el
amuleto; en el poeta, no en el coloso». El modelo abre «São dois textos
sobre procurar valor no sítio errado» y **nunca vuelve**: no dice que el
valor esté en la vigilancia (que es lo mismo que falta en la casilla 2), ni
que esté en el poeta y no en el policía. Como *modelAnswer* es la
definición operativa de «respuesta de 10», dejarlo en una frase-tema es
enseñar a no cerrar.

### DISCUTIBLE · el andamio se quitó, la fórmula no

«São dois textos sobre procurar valor no sítio errado.» frente a lo
publicado:

```
med-52: «Olha, são duas histórias sobre maneiras de dar.»
med-37: «Olha, são duas fábulas do Junqueiro sobre a felicidade…»
med-27: «Olha, li dois contos do Junqueiro e não dizem bem a mesma coisa.»
MED-129: «Nos dois contos uma menina é enganada…, mas o que a salva não é o mesmo.»
```

Se ha borrado la palabra prohibida y se ha conservado el molde:
`São + [dois/duas] + N + sobre + X`. Con MED-132 y MED-129 dentro serían
**cinco de cinco** `synthesise_sources` con la misma apertura. El script
anti-andamio busca cadenas; esto pide un ojo. No lo llamo ERROR porque la
regla escrita se cumple — lo llamo la próxima cadena que habrá que prohibir.

### Hallazgo de gate · `fuente-compartida` MED-132 ↔ MED-135

El gate de molde que esta sesión estrena lo dice él mismo
(`scripts/lib/molde-mediacion.ts`, comentario de cabecera):

> «5. la **FUENTE**: dos mediaciones que citan la misma lectura son un
> hallazgo por sí mismas, **con o sin score** — es la clase 133 ⊂ 132.»

Corrí el gate candidato-contra-candidato (el barrido normal sólo compara
contra el corpus publicado, así que este par es **invisible** en la corrida
oficial):

```
== INTRA-LOTE (candidatos entre sí) ==
b2c2-med-132 ↔ b2c2-med-135 | score 0.056 | fuente-compartida
                              {"esqueleto":0,"rubrica":0,"tupla":0.2,"audiencia":0.056}
```

No digo que sea un clon —no lo es: los recortes son disjuntos y las
operaciones distintas—. Digo que **la regla que se usó para obligar a
MED-133 a cambiar de fuente se aplica igual aquí, y aquí se está
ignorando**. O se documenta la excepción con la salida pegada («recortes
disjuntos + operaciones distintas ⇒ waiver»), o se cambia una de las dos. Lo
que no puede quedar es la asimetría silenciosa. (Nota para la herramienta:
`buscarClonesMolde` no compara candidatos entre sí; el lote 9 estrena el
gate y su primer par real le pasa por debajo.)

### PASA

«um polícia» (masculino = agente) ✓; «genebra» = ginebra, y está en la
fuente ([58]) ✓; «arruína-se» acentuado bien ✓; «o celeiro e a estrebaria
saqueados» concuerda bien en masculino plural ✓; los **cinco** lugares del
talismán están («adega, cozinha, celeiro, estrebaria, livros») ✓ — eso era
R1-E6 y está arreglado; «estrebaria» modernizado desde «estribaria» ✓.
DISCUTIBLE menor: «saqueados» vale para la estrebaria («roubados das
manjadouras») pero para el celeiro la fuente sólo dice que faltaba grano.

---

## 4 · MED-133 · fuente nueva `junqueiro-nao-quero` [0]–[1]

Leí la fuente entera. Son **dos párrafos, 191 palabras**, y confirmo que es
íntegra, virgen y que el gate de molde no le devuelve ningún par. La
elección de fuente es buena.

### Cada dato del modelo, contra el texto

| dato del modelo | fuente | ¿está? |
|---|---|---|
| «na estrada» | `[0]` «passando na estrada» | ✅ |
| «recusa-se a mentir à mãe sobre a escola» | `[0]` «Não quero dizer á mamã que venho da escola, porque é mentira» | ✅ |
| «prefere a repreensão à mentira» | `[0]` «Sei que me hade ralhar, mas antes quero que me ralhe do que mentir» | ✅ |
| «o companheiro, que lhe aconselhava desculpar-se com uma mentira» | `[0]` «o outro pequeno, que lhe aconselhava que se desculpasse mentindo» | ✅ |
| «afasta-se envergonhado» | `[0]` «ia-se embora todo envergonhado» | ✅ |
| «meses depois» | `[1]` «D'ahi a alguns mezes» | ✅ |
| «o mestre» | `[1]` «interroguei o mestre» | ✅ (el texto también dice «o professor») |
| «honrado e pronto a reparar as suas faltas» | `[1]` «honrado, sincero, sempre prompto a confessar as suas faltas e … a reparal-as» | ✅ |
| «mentiroso e incorrigível» | `[1]` «é mentiroso, covarde e incorrigivel» | ✅ |
| «o narrador não se espanta» | `[1]` «Não me espanto, disse eu» | ✅ |
| «naquele minuto» | — | ❌ inventado (ver DISCUTIBLE) |

Las casillas 1, 2 y 3 se cumplen en contenido. La 4, no.

### ERROR 1 · `address: o_senhor` declarado, y «o senhor» NO aparece

El modelo dice «A história é esta, **senhor director**:» — un **vocativo**,
y nada más. En las 83 palabras no hay ni un «o senhor», ni un verbo en 3.ª
concordado con el jefe, ni «como o senhor me pediu». La casilla 4 dice
literalmente: «¿Está en portugués formal, **con «o senhor»** y sin tuteo,
entre 45 y 85 palabras?». **Incumplida.**

`o_senhor` y `nome_cargo` son valores **distintos** del enum
(`lib/data/zod-schemas.ts:191`), y el precedente publicado los distingue:
`b2c2-med-02` declara `o_senhor` y escribe «Exmo. Senhor Diretor, **Poderia
o senhor confirmar** se o relatório já está concluído?» — vocativo por el
cargo **más** el pronombre en el cuerpo. Aquí sólo está la mitad, y es la
mitad que la casilla no pide.

**Qué debe decir:** «Como o senhor me pediu, resumo o essencial: na
estrada…» o «…já continha os dois homens que o senhor conhece». Y ojo
—segundo problema— **no cabe**: el modelo va a 83/85. Hay que subir el
techo a 95 o recortar. Es un incumplimiento de la regla MED-28 que el propio
doc invoca (nota (k)): «verifiquen que el mínimo cumplidor cabe en cada
uno». **Aquí el mínimo cumplidor NO cabe.**

### ERROR 2 · «director» es ortografía anterior al Acordo de 1990

Debe ser **«senhor diretor»**. El *c* mudo cae en el AO90 y el proyecto lo
aplica: en los bloques hay `diretor ×5`, `Diretor ×1`, `Diretora ×5`
—incluidos los dos modelos publicados más cercanos a éste,
`b2c2-med-02` («Exmo. Senhor **Diretor**») y `b2c2-med-40` («Exma. Senhora
**Diretora**»)— frente a un solo `senhor director` en un campo portugués
autorado, que es deuda antigua. Las ocurrencias con *c* de las **lecturas**
son legítimas: son ediciones del XIX y llevan su `notaOrtografia` («Ortografía
de 1877, anterior a todas las reformas»). Un modelo escrito hoy, no.

### DISCUTIBLE

- **«naquele minuto»**: la fuente dice «Um dia, passando na estrada» — no hay
  minuto. Y el modelo ya había dicho «na estrada» al principio, con lo que
  se abre un segundo marco temporal inventado. La casilla 3 dice «lo que vio
  **en la carretera**». Léase «…porque o que viu naquela estrada já continha…».
- **El remate no se nombra.** La casilla 3 y la consigna giran sobre la frase
  «ya les había hecho el horóscopo»; el modelo la explica («Daí o remate: o
  narrador não se espanta») **sin decirla nunca**. Si la consigna pregunta
  *por qué dice eso*, el modelo debería citarlo.
- **Registro**: «A história é esta, senhor director:» es apertura de habla,
  no de un «essencial por escrito» pedido por un jefe. Lo idiomático:
  «Exmo. Senhor Diretor, conforme solicitado, resumo o essencial:».
- **«o mestre»** está en la fuente, pero hoy en Portugal un maestro de
  escuela es «o professor» (que también está en `[1]`). Para un modelo de
  2026 preferiría «o professor».
- **Nota para la herramienta anti-andamio:** el doc propone buscar «el lema
  `repar-` + dos puntos/que». Este modelo contiene «pronto a **reparar** as
  suas faltas» — el verbo léxico, no la bisagra. Ese regex daría falso
  positivo aquí. Hay que anclarlo al imperativo (`repara|repare|reparem`) en
  posición inicial o tras punto.

### PASA

El portugués formal es correcto: «recusa-se a mentir» ✓, «prefere A à B» ✓,
«pronto a reparar» ✓, «viriam a ser» ✓ (perífrasis europea idiomática),
«afasta-se» con ênclise correcta ✓. Cero tuteo ✓. La fidelidad al contenido
es alta y la operación (explicar el remate) es genuinamente `explain_concept`,
no un resumen disfrazado.

---

## 5 · MED-134 · diálogo con TRES interlocutores

### PASA · «Leva a azul ou a branca?» es natural y es tercera persona sin pronombre

Respondo directo a la pregunta. **Sí**: dirigido a una clienta de su edad,
`Leva a azul ou a branca?` es 3.ª persona del singular **sin pronombre**, y
es el tratamiento neutro por defecto de un comerciante portugués con una
desconocida adulta a la que no va a tutear ni a solemnizar con «a senhora».
Es correcto, es vivo y es exactamente el hueco que el español no tiene. El
punto del ítem es bueno y merece existir.

### ERROR 1 · la oposición sigue contaminada: «a azul ou a branca» remite a la camisa del OTRO cliente

R1 mató la v1 porque «Vai levar…» iba dirigido **al mismo cliente**. Ahora
hay tres interlocutores — pero el objeto no se movió:

```
— Boa tarde. O senhor deseja? (ao cliente idoso)
— Queria ver aquela CAMISA, se faz favor.
— Com certeza. — (a uma cliente da idade dele, sem pronome nenhum)
  Leva A AZUL ou A BRANCA?
— A branca.
```

`camisa` es **femenino**, y «a azul / a branca» son femeninos. El lector
—alumno de B2— lee la tercera línea como la continuación natural de la
segunda: el vendedor le está ofreciendo al **señor mayor** la camisa en azul
o en blanco. Lo único que impide esa lectura es la **acotación entre
paréntesis**, que además está incrustada en el mismo turno, después de un
guion, tras haberle contestado «Com certeza» al primer cliente. Un turno,
dos destinatarios.

Dicho de otro modo: la acotación hace el trabajo que debería hacer el
diálogo. Quítela y el ítem vuelve a ser la v1. Y R1 fue explícito: «se le
enseña al alumno a ver una oposición que el texto no contiene».

**Qué debe decir:** cerrar la transacción del señor y darle a la clienta su
propio objeto, de otro género o de otra clase:

```
— Boa tarde. O senhor deseja?
— Queria ver aquela camisa, se faz favor.
— Com certeza, já lha mostro.
— (a uma cliente da mesma idade, que hesita entre duas écharpes)
  Leva a azul ou a branca?
— A branca.
```

### ERROR 2 · el modelo llama «registros» a lo que son TRATAMIENTOS

«Fíjate en que el vendedor usa **tres registros** con tres personas
distintas.»

No son registros: son **tratamientos**. En este propio esquema son dos
campos de primera clase y separados —`RegisterSchema` (`intimo, informal,
neutro, formal, solene`) y `AddressSchema` (`tu, terceira_sem_pronome,
nome_cargo, o_senhor, V_Exa, voce_BR`), `lib/data/zod-schemas.ts:190-191`—
y el propio ítem se declara `register: neutro` mientras exhibe tres
*addresses*. La consigna lo dice bien («el sistema de **tratamiento**»); el
modelo, que es lo que el alumno imita, lo dice mal. En un bloque cuyo tema
es la distinción registro/tratamiento, confundirlos en la primera línea del
modelo es un error de fondo, no de estilo.

**Qué debe decir:** «…el vendedor usa **tres tratamientos** con tres
personas distintas.»

### DISCUTIBLE

- **La acotación regala la respuesta.** El `sourceText` dice «(a uma cliente
  da idade dele, **sem pronome nenhum**)» y la `audience` dice «pregunta por
  qué el vendedor **no usa ningún pronombre** con la segunda clienta». La
  casilla 2 pide justamente eso. Se puede contestar copiando el paréntesis
  sin haber mirado el portugués. Quite «sem pronome nenhum» de la acotación:
  la audiencia ya plantea la pregunta.
- **¿De quién es hija Rita?** «(à filha adolescente, que espera à porta)» no
  dice de quién, y el modelo resuelve «A **su** hija adolescente», que en
  español remite al vendedor. Si es hija del vendedor, tutearla es trivial y
  el tercer nivel no enseña nada; si es una clienta adolescente
  desconocida, el ítem está afirmando que un vendedor portugués tutea a una
  adolescente en su tienda — defendible con niños, discutible con
  adolescentes, y desde luego no algo que deba quedar implícito. R1 propuso
  otra cosa: «**el cliente** trata de "tu" a Rita». Esa versión no tiene el
  problema. Recupérela.
- **«Fíjate en que…»** no está prohibido por la regla escrita (que cubre
  «Olha,» y «Repara/repare:») y tiene **0 usos** como apertura entre los 128
  modelos publicados. Pero es el gemelo español exacto del «Olha,» que se
  acaba de desterrar, en un `explain_concept` que es el hábitat de aquél.
  Aviso, no acusación.
- **Gate de molde:** la corrida oficial devuelve tres pares para MED-134
  (`↔ med-49` 0.306, `↔ med-104` 0.293, `↔ med-26` 0.245, todos
  `clon-de-esqueleto`). Los considero **falsos positivos**: el `sourceText`
  de MED-134 es un diálogo cortísimo y, tras el enmascarado, la métrica de
  *contención* (`|A∩B|/min(|A|,|B|)`) infla cualquier conjunto pequeño metido
  dentro de uno grande. Su esqueleto enmascarado es
  `#nome tarde o senhor deseja ao cliente idoso #nome ver aquela camisa…`.
  No hay clon. Pero el gate del publicador **va a emitir esos tres
  hallazgos** y alguien tendrá que firmar el waiver por escrito; conviene
  dejarlo dicho en el doc antes, no después.

### PASA

«não querias uns ténis?» — imperfeito de cortesia ✓ europeo natural; «ténis»
✓ (no «tênis»); «se faz favor» ✓; «Já escolhi, obrigada» ✓. El aviso final
del modelo («No lo rellenes con "você": a un desconocido puede sonarle
seco») es correcto y es de las cosas que este curso debe decir. Y el español
del modelo es natural: no hay lusismos, la sintaxis es de conversación real.
77/90 palabras ✓.

---

## 6 · MED-136 · participação de casamento con V. Ex.ª

### PASA · la fórmula troncal es la correcta en Portugal

«X e Y **têm o prazer de convidar V. Ex.ª para o seu casamento**» es fórmula
de participação portuguesa legítima y corriente (junto a «participam a
V. Ex.ª o seu casamento»). El posesivo «o seu» no genera aquí la ambigüedad
que en teoría podría (leerse como *el casamiento de V. Ex.ª*), porque el
sujeto va expreso al principio y ancla la lectura. Y **arregla las dos
mitades de R1-E10**: los novios están nombrados y `convidar` tiene por fin
su objeto directo. Bien.

### ERROR 1 · «O Pedro e a Inês» — el artículo delante del nombre no va en una participação impresa

Éste es el registro que el ejercicio existe para depurar, y falla en las dos
primeras palabras. El artículo ante nombre de pila (`o Pedro`, `a Inês`) es
la marca del **portugués familiar hablado** — es lo que hace el propio
`sourceText` en el grupo de WhatsApp («eu e **a Inês** casamos») y es lo que
la casilla 3 manda eliminar. Un convite impresso encabeza con el nombre
desnudo, y normalmente con apellido:

> **Pedro Cardoso** e **Inês Almeida** têm o prazer de convidar V. Ex.ª…

Y no es teoría mía: **R1 escribió la fórmula sin artículos** («La fórmula
portuguesa es «*X e Y têm o prazer de convidar V. Ex.ª para o seu
casamento*»», E10). Los artículos los añadió la corrección. La audiencia
declarada —«os convidados mais velhos da família, num convite impresso»— es
justo la que lo nota.

**Qué debe decir:** «Pedro e Inês têm o prazer de convidar V. Ex.ª…»

### ERROR 2 · el modelo usa V. Ex.ª y el ítem NO declara `address`

MED-136 declara `register: formal` y **ningún `address`** (doc, línea
«**wordRange:** 55–95 · **register:** formal»). El modelo, en cambio, usa
`V. Ex.ª` — que es un valor del enum: `V_Exa`. R1 dijo que éste «es
exactamente su hábitat, es una ocasión desperdiciada»; se aprovechó en el
texto y no se declaró en la metadata. Media corrección otra vez.

Dos consecuencias medibles:
1. El recuento de `address` del propio lote (doc, §menú: «`o_senhor` ×2 y
   `terceira_sem_pronome` ×1») queda **desactualizado**: falta el `V_Exa`.
   La regla de la casa es «todo número medido lleva su salida pegada».
2. `check-registro.ts` no puede opinar sobre un ítem sin `address`. Con
   `V_Exa` declarado sí lo vigila (`línea 48`).

Sobre la pregunta de si «choca con el `address: formal` declarado»: **no hay
tal declaración**, y menos mal — `formal` es un valor de `RegisterSchema`,
no de `AddressSchema` (`zod-schemas.ts:190-191`). Si alguien lo metiera como
`address`, Zod lo rechazaría en la validación.

**Qué debe decir:** `address: "V_Exa"`, y recontar el bloque de menú.

### DISCUTIBLE

- **`V. Ex.ª` vs `V. Exa.`** El corpus publicado usa `V. Exa. ×5` y
  `V. Ex.as ×1` (b10), con `Vossa Excelência ×3`. Las dos abreviaturas son
  correctas en Portugal (`V. Ex.ª` es incluso la más canónica en escrita
  oficial), pero un lote que estrena la forma nueva rompe la consistencia
  del catálogo y cualquier script que busque la cadena `V. Exa.` no la
  encontrará. Decidan una y anótenla.
- **Dato inventado: «no mesmo local».** El `sourceText` dice «Depois há
  jantar e festa até de madrugada» — **no dice dónde**. «Seguir-se-á jantar
  **no mesmo local**» añade un dato que la fuente no da. Es la clase de
  invención que el propio lote condena en MED-130 («sin inventar cuál
  manda»). Y de paso se pierde «festa até de madrugada», que la consigna
  («mismos datos») pide y la casilla 1 olvidó exigir.
- **«fechar a lotação»**: `lotação` es aforo de recinto («lotação
  esgotada»). Lo que hay que cerrar es el **número de convidados**. «uma vez
  que é necessário confirmar o número de convidados junto da quinta» es más
  llano y más exacto.
- **«Quem pretenda pernoitar»**: correcto, pero la fuente usa futuro do
  conjuntivo («Quem **quiser** ficar a dormir») y es lo que pide una
  condición futura en portugués europeo. Preferiría «Quem **pretender**
  pernoitar deverá indicá-lo na resposta».

### PASA

«Seguir-se-á» — **mesóclise correcta**, y es un lujo europeo que este
material debería usar más ✓. «pelas 16 horas» ✓ (no «às 16h» en un impreso).
«que se realizará» ✓. «Agradece-se a confirmação de presença» ✓ fórmula
estándar. «até ao **final** de julho» ✓ **inclusivo** — es la lección de
R1-E12 (el «até aos 16 anos») aplicada correctamente aquí. Cero tuteo, cero
«você», «Malta!» y «a gente trata» eliminados ✓. 78/95 palabras ✓.

---

## Lo que está bien, en concreto

No es cortesía: sin esto no se puede decidir.

1. **La cita de Eça de GJ-01 existe, es literal y es del autor que se
   dice.** Después del desastre de GJ-03 en la ronda 2 (citas que el grep
   devolvía y el sentido no), esto es lo que había que demostrar y está
   demostrado. Y el punto está infra-declarado, no inflado: hay 9
   atestaciones donde el doc dice 5.
2. **MED-129 casillas 1 y 2 son ahora impecables y verificadas al párrafo.**
   Los cinco datos de Branca de Neve (collar, peine, tercera fallida, el
   tropezón de uno de los cuatro porteadores, «não é castigada por
   ninguém») son exactos, incluida la decisión difícil de **no** decir que
   tropieza ella. Y «não é castigada por ninguém» es una lectura fina: esta
   versión de Junqueiro no tiene los zapatos al rojo de los Grimm, y el
   modelo lo respeta.
3. **El título «O Capuchinho Vermelho» entierra el híbrido BR/PT.** R1-E3
   cerrado.
4. **Los tres andamios están fuera de verdad.** Los tres
   `synthesise_sources` Junqueiro publicados abren «Olha,» y cierran
   «Repara na diferença:»; MED-129 y MED-132 no hacen ni lo uno ni lo otro.
5. **El anti-copia se cumple con margen enorme**: cero coincidencias de 4
   palabras seguidas en 129 y 132, con normalización de grafía antigua.
6. **La fuente de MED-133 es una buena elección**: dos párrafos, íntegra,
   virgen, sin par en el gate de molde, y el contenido del modelo es fiel
   dato a dato (tabla arriba). El problema de MED-133 es de tratamiento y
   de ortografía, no de lectura.
7. **El punto de MED-134 es correcto y vale la pena pelearlo.** La 3.ª sin
   pronombre como «usted» neutro portugués es de las cosas que ningún
   manual explica bien, y el aviso sobre «você» es exacto.
8. **MED-136 arregla las dos mitades de R1-E10**, mete mesóclise correcta y
   resuelve el plazo inclusivo con «até ao final de julho» — que es
   exactamente la lección de E12 aplicada sin que nadie se lo recordara.

## Deudas del documento (no de los ítems, pero se publican con ellos)

- **Línea 774**: «MED-132 recorta `um-poeta-lirico` **[55]–[59]**» — el ítem
  dice [54]–[59]. Quedó sin actualizar.
- **Líneas 176-178**: «**deixa lá**: … VIVO como BIEN» sigue en las
  «Verificaciones de barra» aunque el ítem se retiró en la ronda 2. Y
  «**mal + pretérito**», que es el sustituto, **no está** en esa lista.
- **Líneas 115-117**: «ningún modelo abre con "Olha,…" ni usa "Repara:…"
  como bisagra. **Verificado por script antes del round**» — mientras que el
  bloque de «Recuentos y gates» (línea 789) dice `(pendiente: publicador +
  virginidad + anti-andamio)`. Una afirmación medida sin salida pegada, que
  es la regla que el propio doc se impone. (La comprobé yo y es cierta; el
  problema es el procedimiento.)
- **Líneas 105-106**: el recuento de `address` del lote no incluye el `V_Exa`
  de MED-136.

---

# VEREDICTO: **NO PUBLICABLE**

Los cinco ítems rediseñados **no** están listos. Dos de los cinco arrastran
sin arreglar el hallazgo que motivó su rediseño (MED-132 casilla 3;
MED-134 la ambigüedad referencial), y aparece un defecto **nuevo y
sistemático** que la ronda 3 introdujo: **tres de los cinco declaran un
tratamiento formal que su texto no realiza o no declara** (MED-129
`nome_cargo` sin ninguna marca; MED-133 `o_senhor` sin «o senhor»; MED-136
usa V. Ex.ª sin declarar `V_Exa`). El gate automático no ve ninguno de los
tres, y ése es el patrón, no la casualidad.

## Bloqueantes (hay que arreglarlos para publicar)

1. **GJ-01** · la frase reutiliza la cadena de reparación de `b2c2-gj-l1-02`
   («Cheguei a casa»), 0,488 en el gate de virginidad. Cambiar la frase y
   re-correr el gate con la salida pegada.
2. **GJ-01** · `concepts: [b8-conectores]` no cubre los temporales →
   `b8-oracoes-subordinadas`. Era la mitad no hecha del mandato de ronda 3.
3. **MED-129** · `address: nome_cargo` sin una sola marca de tratamiento;
   casilla 4 incumplida.
4. **MED-129** · «quando se baixa para beber» es un dato inventado (la
   fuente: se levanta, camina y cae al lago por el peso).
5. **MED-129** · «ao ver-se descoberta» contradice la fuente («teve tal medo
   **que os seus crimes fossem descobertos**»). Corregir **casilla 3 y
   modelo**.
6. **MED-129** · «Uma vigia; a outra, sorte.» no es interpretable y
   contamina con el vocabulario de MED-132.
7. **MED-132** · la casilla 3 sigue pidiendo «poeta que sirve mesas», que
   **no está** en [54]–[59]. La ampliación no arregló nada.
8. **MED-132** · el recorte no se sostiene solo (abre con «lhe» y «êste
   covil» sin antecedente).
9. **MED-132** · casilla 2 a medias: falta la moraleja explícita («o dono da
   casa nunca póde ser substituido por terceira pessoa»).
10. **MED-133** · `address: o_senhor` y el texto sólo trae un vocativo. Y al
    meter «o senhor» **no cabe** en 45–85 (va a 83): subir el techo.
11. **MED-133** · «senhor **director**» → «senhor **diretor**» (AO90; el
    corpus autorado usa `diretor/Diretora` 11 veces).
12. **MED-134** · «a azul ou a branca» remite a la camisa del cliente
    anterior; la oposición sigue sostenida por la acotación, no por el
    diálogo. Dar a la segunda clienta su propio objeto.
13. **MED-134** · el modelo dice «tres **registros**» donde son tres
    **tratamientos** — y `register`/`address` son campos distintos del
    esquema.
14. **MED-136** · «O Pedro e a Inês» — quitar los artículos: es el registro
    familiar que la casilla 3 manda eliminar, en la primera línea del
    impreso.
15. **MED-136** · declarar `address: "V_Exa"` y recontar el bloque de menú.

## A decidir por escrito antes de publicar (no arreglar, adjudicar)

- **MED-132 ↔ MED-135 = `fuente-compartida`** en el gate de molde que esta
  sesión estrena. Es la misma regla con la que se obligó a MED-133 a cambiar
  de fuente. O waiver documentado con la salida pegada, o cambio de fuente.
  Y `buscarClonesMolde` **no compara candidatos entre sí**: el primer par
  real del gate nuevo es invisible en la corrida oficial.
- **Los tres `clon-de-esqueleto` de MED-134** (↔ med-49, med-104, med-26)
  son falsos positivos por contención de conjunto pequeño; conviene firmarlo
  en el doc antes de que salte en el publicador.
- **La fórmula `São dois textos/histórias sobre X`** sobrevive intacta bajo
  el «Olha,» borrado, en 5 de 5 `synthesise_sources`. Es la próxima cadena
  a prohibir.
