# Lote 10 B2C2 · **v3** — dictamen LINGÜÍSTICO (portugués europeo)

Fuente: `docs/contenido/2026-09-03-lote10-b2c2-v3.md` (14 ítems: 8 BIEN / 6 MAL).
Ronda 3, la última que permite la regla de corte de Edu.

---

# Veredicto global: **PUBLICA-CON-CORRECCIONES**

**Bloqueantes: 5.** Ninguno mata un ítem. Los catorce juicios BIEN/MAL son
correctos y están verificados contra corpus; ninguno merece MUERE. Lo que
bloquea no es la lengua: son **una fuga**, **un etiquetado falso**, **una
tabla que no cuadra**, **una lápida con una atestación fabricada** y **un
atajo del 71 % que el preflight no puede ver por construcción**.

| | |
|---|---|
| Veredictos BIEN/MAL correctos | **14 de 14** |
| De las 10 correcciones del round, aplicadas | **10 de 10** (ninguna se perdió) |
| De esas 10, verdaderas tal como quedaron redactadas | **9 de 10** (falla GJ-13) |
| Ítems que MUEREN | **0** |
| Bloqueantes | **5** |
| Menores con texto de sustitución | **6** |

**El titular bueno.** La v2 perdió tres correcciones ya pagadas. **La v3 no
perdió ninguna.** Comprobado carácter a carácter contra
`2026-09-02-lote10v2-informe-linguistico.md`: las diez están, y ocho de ellas
son el texto prescrito **literal**. Ese fallo de proceso está cerrado.

**El titular malo, y es el mismo de siempre en sitio nuevo.** El fallo se ha
vuelto a mudar: de los veredictos (v1) a las explicaciones (v2) al
**andamiaje** (v3) — etiquetas, tablas, lápidas y la frontera entre el ítem y
la lección que lo enseña. Y ahí hay un hallazgo que iguala en tamaño a los que
tumbaron la v1 y la v2:

> **Cuatro de las ocho frases de la sección A son `<Example>` literales de la
> lección `b11-l4-aspecto-e-tempo` que el alumno acaba de leer — y las cuatro
> son BIEN.** El preflight no lo ve porque `scripts/preflight-lote.ts` sólo
> indexa `lib/data/languages/pt/blocks` (línea 52) y **nunca abre
> `lib/data/languages/pt/mdx/`**. Como regla, «la frase es un ejemplo de la
> lección ⇒ BIEN» acierta **10/14 (71 %)**, más que **cualquiera** de los once
> atajos medidos (el mejor: 9/14, 64 %).

---

# Método

Aplané los **224** ficheros de `lib/data/languages/pt/lecturas/` a texto plano
con atribución de obra y capítulo: **18 993 párrafos, 4 269 271 caracteres** —
cuadra al carácter con el conteo de la v2, así que estamos midiendo sobre el
mismo corpus.

Las tres reglas del encargo, aplicadas:

1. **Grep ancho por LEMA y con grafía antigua.** Donde la v2 buscó 22
   candidatos de ênclise bajo `não`, yo levanté **140** (admitiendo hasta dos
   palabras entre el `não` y el clítico, y las formas decimonónicas
   `fital-a`, `dizel-o`, `crêl-o`, `podêl-o`, `têmol-a`, `permitti-lo`).
2. **Ninguna cita sin leer el párrafo entero.** Se me cayó una en la mano: la
   atestación de la lápida de GJ-15 (§ Lápidas).
3. **Contrastes externos comprobados uno a uno**, no de memoria: Priberam
   (`reparar`, `apaixonar`) y el texto de la Base IX del AO90 vía Portal da
   Língua Portuguesa / Ciberdúvidas.

Además, y esto no estaba en el encargo pero resultó ser lo importante: **leí
las lecciones** `b11-l4-aspecto-e-tempo.mdx` y `b11-l2-regencias-que-traem.mdx`,
que son las que el alumno tiene delante cuando le llegan estos ítems. Es de
ahí de donde salen dos de los cinco bloqueantes.

---

# Parte 0 · Las diez correcciones, una por una

Esto era el primer encargo: verificar que están y que lo que dicen es verdad.

| # | ítem | ¿aplicada? | ¿verdadera? |
|---|---|---|---|
| 1 | GJ-01 causa del revés + absoluto del infinitivo | **sí, literal** | **sí** |
| 2 | GJ-05 acotar «tras *quando*» a la subordinada temporal | **sí, literal** | **sí** |
| 3 | GJ-06 «gerundio que aquí no cabe» → cabe | **sí, literal** | **sí** |
| 4 | GJ-10 `por`/`para` a la casilla del destinatario | **sí, literal** | **sí** |
| 5 | GJ-12 causa inventada → BR / hipercorrección del *a* personal | **sí, literal** | **sí** |
| 6 | GJ-13 «separa dos verbos» → Priberam ac. 11 | **sí, literal** | **NO** ⚠ |
| 7 | GJ-14 «los dos distintos del español» + `crase`→`contração` | **sí** | **sí** (nit de redacción) |
| 8 | GJ-16 salvedad de la perífrasis | **sí, y de más** | sí, pero **abre una fuga** ⚠ |
| 9 | GJ-02/03/04 menores | **sí, las tres** | sí (GJ-04, matiz) |
| 10 | GJ-07/15 lápidas | **sí** | **una de las dos, no** ⚠ |

**Nueve de diez aplicadas y verdaderas.** La que falla —#6— falla porque **el
texto que la v2 prescribió era él mismo falso**, y la v3 lo copió con
fidelidad. Detalle en GJ-13.

Las tres que la v2 había perdido (GJ-05 #2, GJ-06 #3, GJ-16 #8) **están las
tres**, verbatim. Ese era el punto de la ronda y se ha cumplido.

---

# Parte 1 · Ítem por ítem

## A · `b11-aspecto-tempo` (8 ítems)

### GJ-01 · «Ontem à noite não disse-me nada…» → **PASA**

**El veredicto MAL es el mejor verificado del lote, y lo verifiqué más ancho
que la v2.** Busqué `não` + hasta dos palabras + verbo con clítico enclítico,
con las formas antiguas: **140 candidatos** (la v2 levantó 22). Filtrados por
si el portador del clítico es infinitivo o no, quedan **nueve** no-infinitivos,
y los nueve se caen al leer el párrafo:

- **`quando não` = 'de lo contrario'**, que no niega nada: «Ponham-se a andar
  immediatamente, **quando não atiro-lhes** já ás pernas os meus cães de fila»
  (Junqueiro, *João e os seus camaradas*); «que não tornasse ali a apparecer,
  **quando não ver-se-hia** obrigado a empregar meios violentos» (íd., *Os
  animaes agradecidos*).
- **`se não` = 'si no / sino / a no ser'**: «E **se não digam-me**: onde estão
  as universidades» (Garrett, c13); «não sabia como amordaçar a maledicencia…
  **se não occupando-lhes** as linguas» (Camilo, *O Cego de Landim* VI); «e
  **não falta senão observá-las**» (Garrett, c15).
- **Infinitivos con acento que mi filtro no reconoció**: «não deviamos
  **importuná-lo**» (Garrett, c07), «não ousou **contê-la**» (íd., c18), «Deus
  não hade **permitti-lo**» (íd., c40).
- **Infinitivos flexionados**: «não impeceu a **reproduzirem-se**» (Camilo,
  *Amor de Perdição* c01), «não é permittido **apaixonarem-se**» (Garrett, c11).

**Cero verbos finitos con ênclise bajo un `não` que los niegue, en 4,27 M de
caracteres, con la red más ancha que se ha echado hasta ahora.**

Y el paréntesis nuevo —«con infinitivo la cosa se afloja»— no es una concesión
de cortesía: **es lo que hace el corpus**, masivamente. «para **não dal-a** por
tão pouco» (*Contos Phantásticos*, «A Adega de Funck»), «para **não tornal-o**
uma mentira» (íd., «Beijos por Facadas»), «até **não podêl-o** ser mais»
(Camilo, *Amor de Perdição*, Conclusão), «e **não crear-lhe** uma paz
duradoura» (Eça, *Amaro* c22).

La corrección #1 está aplicada literal y las dos mitades son verdad. Nada que
tocar.

*Único nit, y es de arranque, no de lengua:* GJ-01 y GJ-06 abren **los dos**
con «Ontem à noite». En un lote de catorce eso se nota. Ver el menor M-6.

### GJ-02 · «Se eu seria mais novo…» → **PASA**

Corrección #9 aplicada: «El español **estándar** tampoco admite "si yo sería"».

Verificado con grep estricto (`se` + pronombre sujeto + condicional):
**5 apariciones, cero prótasis condicionales.** Las cinco son interrogativa
indirecta, que es otra construcción y correcta: «perguntou-me **se eu cria** nas
relações com o mundo invisivel» (*Contos Phantásticos*, «As azas brancas»);
«Quem sabe **se elle não recusaria** que lhe dessem a extrema-unção» (Eça,
*Amaro* c11); «perguntou… **se ella gostaria** que Carlos viesse» (Eça, *Os
Maias* c15); «quiz saber **se elle preferia** cognac ou cerveja» (íd., c16).

Frente a eso, las prótasis reales del corpus van todas en conjuntivo: «**Se eu
fosse** um santo» (Eça, *A Cidade e as Serras* c16), «**Se eu sentisse** fome»
(íd.), «**Se meu tio a obrigasse**, desde menina, a uma obediencia cega»
(Camilo, *Amor de Perdição* c10).

El «nunca en condicional» sigue siendo un absoluto, pero **la propia frase lo
acota** («la prótasis de una condición hipotética»), que es justo lo que impide
leerlo como si condenara «Não sei se eu seria capaz». Sigue siendo de lo mejor
redactado del lote.

*Metadata:* «convosco» realiza tratamiento de 2.ª plural. Ver M-4.

### GJ-03 · «Costumo levantar-me às sete…» → **CORRIGE-ASÍ** (la frase, no la explicación)

Corrección #9 aplicada: «más frecuente que cualquier **perífrasis** con
"normalmente"» **desapareció**. Bien: «normalmente» no es una perífrasis y esa
comparación de frecuencia no la sostenía nadie.

La explicación que queda es correcta y sobria. **El problema es la frase.**

`lib/data/languages/pt/mdx/b11/l4-aspecto-e-tempo.mdx` publica, como ejemplo de
la lección:

> `<Example pt="Costumo levantar-me às sete." es="Suelo levantarme a las siete." />`

La frase del ítem es ese ejemplo **literal**, con una coleta pegada detrás. Ver
el bloqueante **B-5**.

> **Sustituir la frase por:** «Costumo deitar-me tarde, mesmo quando tenho de
> acordar cedo no dia seguinte.»
>
> Mantiene lo que enseña —`costumar` + infinitivo y ênclise sin atractor—, es
> PE limpio (`ter de`, no `ter que`) y no repite el ejemplo de la lección.

### GJ-04 · «Espero que o teu irmão vem connosco…» → **CORRIGE-ASÍ** (menor)

Corrección #9 aplicada, literal: se añadió el blindaje del caso marginal.

**El veredicto MAL se sostiene.** Corpus: **58 apariciones** de `esperar que`
con completiva, y todas en conjuntivo salvo una — «esperava que suas
Incellencias lhe **perdoassem**» (Eça, *A Cidade e as Serras* c08); «**Esperei
que** o tempo te **aclarasse** a razão» (Camilo, *Amor de Perdição* c04);
«**Espera que** te **offereçam** outro» (Junqueiro, *João Pateta*); «as
religiosas assistentes **esperavam que** ella **fechasse** os olhos» (Camilo,
c13).

**La excepción, y por qué el blindaje apunta un poco al lado.** La única es:

> «espero que quando fores maior te **has** de corrigir» — Junqueiro, *Os
> Pêssegos*

`has` es **presente do indicativo**. El blindaje dice: «Con **futuro** y valor
de convicción firme aparece a veces el indicativo —"espero que virá"—, pero es
uso marginal; **con presente, como aquí, no cabe**.» El único contraejemplo del
corpus tiene forma de **presente** y valor de futuro, o sea que se sienta
exactamente encima de la línea que el blindaje traza. Y la frase del ítem
(«vem… no sábado que vem») es también presente con valor de futuro.

No amenaza el veredicto —«hás de corrigir» es la perífrasis modal que
Ciberdúvidas describe como el caso marginal—, pero el «no cabe» es un absoluto
que el propio corpus roza. Cuesta cuatro palabras quitarlo:

> **Sustituir:** «pero es uso marginal; con presente, como aquí, no cabe.»
> **Por:** «pero es uso marginal; con el presente simple, como aquí, la norma
> no lo admite.»

### GJ-05 · «Hei de te contar tudo…» → **CORRIGE-ASÍ** (la frase, no la explicación)

**Las dos correcciones aplicadas y las dos verdaderas.**

*La acotación de `quando` (#2), literal.* «Obligatorio tras "quando" **en
oración subordinada temporal** de futuro (en la interrogativa no: "Quando nos
vemos?" está bien)» — correcto, y ahora ya no condena una interrogativa que es
PE normal.

*La adición nueva sobre el clítico.* «En predicado complejo el clítico sale del
dominio del verbo finito ("**Has de te lembrar**", Eça)» — **verificado, cita
exacta**: «És tu que queres... **Has de te lembrar** algumas vezes d'estas boas
manhãs...» (Eça, *O Crime do Padre Amaro*, c19). Y no es un caso aislado:
**29 párrafos** con el clítico entre `de` y el infinitivo — «**hei de lhe
levar** um cesto d'ellas» (Junqueiro, *Presente por presente*), «**Hão de lhe
vir** ámanhã as vertigens» (Eça, *Amaro* c05), «**Hei de lhes mostrar**» (íd.,
c14), «A prima **havia de me dar** a sua freguesia» (Eça, *No Moinho*), «**Has
de me dar** tempo para arranjar» (*Os Maias* c14).

**El problema es la frase**, otra vez la lección:

> `<Example pt="Hei de te contar tudo." es="Ya te contaré todo." />` — `b11-l4`

> **Sustituir la frase por:** «Hei de lhe pedir desculpa quando estivermos os
> dois mais calmos, que isto assim não pode ficar.»
>
> Conserva las dos cosas que enseña —clítico entre `de` y el infinitivo, y
> futuro do conjuntivo tras `quando` temporal—, y **de paso quita una fuga
> menor**: la coleta actual («prometo que **não me esqueço**») exhibe la
> próclise correcta bajo `não`, que es exactamente lo que GJ-01 pide juzgar.

### GJ-06 · «Ontem à noite fiquei a pensar…» → **CORRIGE-ASÍ** (la frase, no la explicación)

**La corrección #3 —la más grave de las tres heredadas— está aplicada, literal,
y es verdad.** Lo conté yo también, con la red algo más ancha: **51 casos de
`ficar` + gerundio** en el corpus del curso.

- «E **ficou pensando** na sua espinhosa situação.» — Camilo, *Amor de Perdição* c08
- «**ficamos pensando** que seria ella a propria rainha» — íd., c01
- «Depois **ficou relendo** a de Thereza» — íd., c08
- «Eu **fico pedindo** a Nossa Senhora que vá na sua companhia.» — íd., c10
- «**ficava esmagando** os olhos turvos na fachada negra daquela casa» — Eça, *José Matias*
- «Carlos **ficou pensando** n'aquella proposta do Ega» — Eça, *Os Maias* c05
- «Cintra **ficava dormindo** ao luar.» — íd., c08

Y el dato que hace que la redacción nueva sea **exactamente** la correcta: en
el corpus decimonónico `ficar` + gerundio (**51**) es **más frecuente** que
`ficar a` + infinitivo (**26**). Por eso «la norma europea **de hoy** prefiere
el infinitivo… (en Eça y en Camilo **todavía** encontrarás "ficou pensando")»
es verdad en sus dos mitades, y el «no cabe» de la v2 era falso.

**El problema es la frase**, tercera vez:

> `<Example pt="Fiquei a pensar no que disseste." es="Me quedé pensando en lo que dijiste." />` — `b11-l4`

> **Sustituir la frase por:** «Depois daquele telefonema fiquei a remoer o
> assunto a noite inteira e não preguei olho.»
>
> Sigue **abriendo con adjunto** (que es lo que el reordenamiento de la v3
> buscaba: GJ-06 es uno de los dos BIEN que equilibran ese rasgo), conserva
> `ficar a` + infinitivo y el modismo `não preguei olho`, no repite el ejemplo
> de la lección **y deja de chocar con el «Ontem à noite» de GJ-01**.

### GJ-07 · lápida → **PASA con enmienda de redacción**

Ver § Lápidas. Lo publicado se corresponde con lo que dice, y las tres
atestaciones de `esquecer` existen; lo que falla es un eslabón del razonamiento.

### GJ-08 · «A avó vai melhorando aos poucos…» → **CORRIGE-ASÍ** (la frase, no la explicación)

**Sigue siendo el ítem con la explicación mejor construida del lote**, y no le
toqué una coma: veredicto correcto, contenido verdadero y un absoluto
desactivado **por el propio texto** («es el contraejemplo que impide leer la
regla como "en portugués europeo nunca hay gerundio" — una regla que, así
enunciada, es falsa»).

`ir` + gerundio: **301 apariciones**. «já… **ia deixando** um sulco de matança e
ruínas» (Eça, *A Aia*), «**iam descambando** para o Phallismo» (*A Cidade e as
Serras* c06), «**ia erguendo** uma nave» (*A Perfeição*), «**vai surgindo**,
dentro do seu crânio bisonho, … o sentimento das Formas» (*Adão e Eva no
Paraíso*).

Verifiqué también, porque nadie lo había hecho, que el «já **se** levanta» de la
frase no es una trampa involuntaria: **`já` es atractor de próclise en PE** y el
corpus lo confirma sin ambigüedad — **355** párrafos con `já` + próclise contra
**2** con ênclise, y esos dos llevan el clítico en un **infinitivo**, no en el
finito («podia já **enviar-lhe**», Camilo c19; «vou ámanhã já **fallar-lhes**»,
*Os Maias* c10). La frase es correcta.

**El problema es la frase**, cuarta y última vez:

> `<Example pt="A avó vai melhorando aos poucos." es="La abuela va mejorando poco a poco." />` — `b11-l4`

Y agrava: la explicación de GJ-08 es, además, una paráfrasis del `<Tip>` de esa
misma lección («El gerundio **no** está prohibido en portugués europeo… `ir +
gerúndio` ("vai melhorando") marca el avance gradual»).

> **Sustituir la frase por:** «O meu avô vai perdendo a memória devagar, mas
> ainda se lembra de todas as cantigas da tropa.»
>
> Conserva `ir` + gerundio con valor gradual **y** la próclise tras adverbio
> atractor (`ainda`, del mismo grupo que `já`), y no repite el ejemplo.

### GJ-09 · «Ele saiu de casa sem que ninguém o viu…» → **PASA**

Sin corrección pedida y sin nada que corregir. Reverifiqué el punto donde la v2
avisó de una trampa: **36 apariciones de `sem que`**, y las conjunciones van
todas en conjuntivo — «sem que a sua face de mármore **perdesse** a rigidez»
(Eça, *A Aia*), «sem que Jacintho o **ordenasse**» (*A Cidade e as Serras* c11),
«sem que ninguem em roda **suspeite**» (*Amaro* c20), «sem que um cão
**ladrasse** detrás das cancelas» (Eça, *O Defunto*), «sem que se **notasse** no
seu rosto a mais pequena alteração» (Junqueiro, *Branca de Neve*).

Las dos que **parecen** indicativo y no lo son siguen siendo las de Garrett, y
sólo se ven leyendo:

> «compre um Spectator, que é livro **sem que se não póde** estar» — c04
> «é liga **sem que se não lavra** o mais fino de seu oiro» — c10

`que` ahí es **relativo** tras la preposición `sem` (= «sem o qual»), no la
conjunción. Un recuento por cadena habría retirado un veredicto correcto, por
segunda ronda consecutiva.

La explicación apoya el juicio en un contraste que ya está **dentro de la
frase** («como se fosse»). Es, con GJ-08, el ítem que se defiende solo.

## B · `b11-regencias` (6 ítems)

### GJ-10 · «Deram-me os parabéns pelo trabalho…» → **PASA**

**Corrección #4 aplicada literal, y ahora las dos casillas están en su sitio.**
Verificado: `parabéns` aparece con **`por` para el motivo** —«Muitos parabens
**por** ter quinado com o senhor parocho» (Eça, *Amaro* c04)— y con **`a` para
el destinatario** —«dê lá os parabens **a** essa gente» (íd., c10), «Os nossos
parabens **ao** arrojado gentleman» (*Os Maias* c07), «muitos parabens **a** v.
exc.^a» (íd., c16)—. **Cero `parabéns para`.**

El texto nuevo es exacto en las tres cosas que afirma: `pelo` = `por` + `o`; el
régimen europeo del destinatario es `a`; y —lo que salva el ítem de ser un
hombre de paja— **dice explícitamente** que aquí el destinatario es el propio
clítico `-me`, o sea que el alumno no tiene que descartar una forma invisible.

### GJ-11 · «Chegámos em Lisboa…» → **PASA**

**El MAL mejor sostenido del lote y el ítem mejor construido, sin discusión.**

*Régimen.* `chegar` + `em/no/na/num/n'um`: **10 candidatos, 0 de destino.**
Tiempo («Tinha chegado **na vespera**», *Amaro* c25; «Chegára **na vespera**»,
*Os Maias* c15; «chegou **nos nossos dias** até ao chafariz», Garrett c28),
medio («quando elle chegasse **no comboio** de Irun», *A Cidade e as Serras*
c08), modo («que chega **em estado**», Garrett c01), un adjetivo que el grep
confunde con el verbo («muito **chegados no** canapé», *Amaro* c19), y uno que
**confirma la regla en la misma línea**: «chegava **no dia seguinte ao**
Ramalhete» (*Os Maias* c15) — tiempo con `no`, destino con `ao`.

Frente a eso, **239** casos de `chegar a/ao/à` + lugar. Cero contraejemplos.

*Acento.* Fui al texto de la Base IX y la afirmación del ítem es literalmente
correcta: «**é facultativo assinalar com acento agudo as formas verbais de
pretérito perfeito do indicativo, do tipo *amámos*, *louvámos*, para as
distinguir das correspondentes formas do presente do indicativo (*amamos*,
*louvamos*), já que o timbre da vogal tónica é aberto naquele caso em certas
variantes do português**». O sea: facultativo **y** la oposición viva. Las dos
mitades de la frase del ítem, exactas.

Y el diseño —meter `chegámos`, forma que el alumno podría creer errónea, dentro
de una frase MAL, y desactivar esa lectura falsa en la propia explicación—
sigue siendo lo más fino que hay aquí.

### GJ-12 · «Os miúdos obedecem os avós…» → **PASA** (fuga comprobada: no la hay)

**Corrección #5 aplicada literal.** Corpus: **38 apariciones** de
`obedecer`/`desobedecer` y **ninguna con objeto directo**. Todas con `a/ao/ás`
(«obedecer promptamente **ao** curativo», Camilo c07; «obedecendo **ás**
suspeitas da ama», íd. c09; «obedecendo **ao** official de guarda», *Os Maias*
c10; «não desobedecer **a** vossa magestade», Junqueiro), en dativo
(«**obedecer-lhe**, dê por onde der», *Amaro* c13; «eu vivo para **vos
obedecer**», *O Defunto*; «não ousava **desobedecer-lhe**», *Os Maias* c01) o
absolutas («O abbade **obedeceu** com deleite», íd. c03).

*Contraevidencia que alguien traerá y que no prospera:* «Só podia ser
sériamente **obedecido**» (*Os Maias* c12) — pasiva. En portugués (como en
español) los verbos de régimen dativo admiten pasiva sin que eso los vuelva
transitivos directos en activo; no licencia «obedecem os avós».

**La fuga que había que comprobar: no existe.** Busqué en los diez ficheros de
bloques y en todos los MDX si algún ítem publicado o alguna lección enseña la
*a* personal o usa «Vejo o meu pai»: **cero coincidencias**. La mención de
GJ-12 no regala nada, ni dentro del lote ni fuera.

### GJ-13 · «Repara na camisola nova dele…» → **CORRIGE-ASÍ** (menor, y es el único fallo de contenido)

**Veredicto BIEN correcto**: `reparar em` = fijarse en, y el corpus lo practica
sin excepción — «nem sequer **reparei n'ella**» (*Amaro* c05), «Taveira não
**reparara no pé**» (*Os Maias* c05), «**reparou n'um painel** antigo» (íd.,
c13), «É não lhe **reparar nas manias**» (*Amaro* c22).

**Pero la corrección #6 se aplicó literal y el texto prescrito era falso.** La
v3 dice ahora:

> «Con complemento nominal **la preposición decide el sentido**: "reparar **na**
> camisola" es fijarse; "reparar **a** camisola" es arreglarla.»

Fui a Priberam a leer la entrada entera, y la acepción que la propia v2 citó
para tumbar «separa dos verbos» **tumba también su sustituto**:

> `reparar`, acepción **11**, listada entre las **transitivas**: «**Notar;
> examinar; ver**».

Si existe un `reparar` transitivo directo que significa 'notar', entonces con
complemento nominal la preposición **no decide** el sentido: lo hace probable,
no unívoco. Es el mismo absoluto de la v2 en versión suave, y por eso lo marco
como el único punto del lote donde la ronda 3 hereda una falsedad en vez de
matarla.

En descargo del ítem: en el corpus, `reparar` con objeto directo aparece
siempre con el sentido de 'enmendar / arreglar' («podêrem **reparar certos
damnos** de reputação feminina», Garrett c09; «se foi **reparando**,
concertando», íd. c36), nunca con el de 'notar'. O sea que la acepción 11 es
real pero hoy es rara y literaria. Por eso basta con degradar el verbo de la
frase:

> **Sustituir:** «…así que con complemento nominal la preposición decide el
> sentido: "reparar **na** camisola" es fijarse; "reparar **a** camisola" es
> arreglarla.»
> **Por:** «…así que con complemento nominal la preposición es la que asegura
> el sentido de 'fijarse': "reparar **na** camisola". Sin ella, "reparar a
> camisola" se entiende como arreglarla.»

(«se entiende como» en lugar de «es» — es todo lo que hace falta, y es verdad.)

### GJ-14 · «Quando entrei na sala sem bater à porta…» → **PASA** (con un nit)

**Corrección #7 aplicada, y las dos mitades falsas de la v2 están muertas.** El
texto nuevo es verdadero: `entrar em` **sí** coincide con el «entrar en»
peninsular y **sí** choca con el «entrar a» americano, que es el que hablan los
alumnos de este curso; y en `bater à porta` la preposición **es la misma** del
español, siendo el verbo y la contracción lo que cambia.

Corpus: `bater à porta` **16** apariciones, todas con `á/à` («Quando o arreeiro
**bateu á porta**», Camilo c04; «**bateram á porta**», Junqueiro, *A mãe*).
`entrar a` + lugar: **cero**. Los 17 candidatos de `entrar a` son el incoativo
(«**entra a namorar-se** da belleza moral», Camilo, *Gracejos que Matam*;
«**entrou a desconfiar** que era tolo», íd., *A Morgada* X; «**entravam a pôr**
carapuças», Garrett c06), tiempo («**entrou á noite** em casa da S. Joanneira»,
*Amaro* c14) o sujeto pospuesto («**entrou a prelada** com a ceia», Camilo c07).
Que ese incoativo exista **no** contradice al ítem, porque el ítem nunca dice
que «entrar a» no exista: dice que el «entrar a» **de América** choca. Redacción
correctamente acotada.

*Nit de metalengua, sin consecuencia:* la v2 pidió cambiar `crase` por
`contração` porque la primera es terminología brasileña. Se cambió — pero la
frase quedó como «lo que cambia es el verbo y **la contração** con el
artículo», con el sustantivo portugués incrustado sin marcar en medio de una
oración española. O se marca (**la *contração*** en cursiva, como término) o se
escribe «la contracción». Ninguna de las dos cuesta nada.

### GJ-15 · lápida → **CORRIGE-ASÍ (bloqueante)**

Ver § Lápidas. Contiene una atestación que no lo es.

### GJ-16 · «Casou-se com uma arquiteta…» → **CORRIGE-ASÍ (bloqueante)**

**Corrección #8 aplicada — y aplicada de más.** La salvedad que faltaba está, y
resuelve la contradicción con GJ-05 que la v1 y la v2 arrastraban. Eso es
progreso real.

Pero la v3 añadió al texto prescrito cuatro palabras que no estaban:

> «…en las perífrasis (como «Hei de te contar», **aquí mismo en GJ-05**) el
> clítico puede ir delante del infinitivo sin ningún atractor…»

**Dos defectos, y los dos son de los que este proyecto ya pagó una vez.**

1. **Es una fuga.** «Hei de te contar» es, palabra por palabra, el arranque de
   la frase de GJ-05, y GJ-16 la presenta como **correcta**. Un alumno al que
   le sirvan GJ-16 antes que GJ-05 no tiene que juzgar GJ-05: ya se lo han
   dicho. Es exactamente lo que el encargo mandaba vigilar.
2. **La referencia cruzada está rota en producción.** «Aquí mismo en GJ-05»
   sólo significa algo dentro de este documento. En la app los ítems no llevan
   ese identificador ni se sirven en este orden — es el mismo defecto por el
   que la v2 marcó el «Mismo régimen que **el anterior**» de GJ-15, que
   apuntaba a GJ-14.

El arreglo es de una línea y no pierde nada de lo que la corrección #8 vino a
ganar (el ejemplo sustituto está atestiguado: «**hei de lhe levar** um cesto
d'ellas», Junqueiro; «A prima **havia de me dar** a sua freguesia», Eça, *No
Moinho*):

> **Sustituir:** «Ojo con no aplicar esto de más: en las perífrasis (como «Hei
> de te contar», aquí mismo en GJ-05) el clítico puede ir delante del
> infinitivo sin ningún atractor — la regla del atractor manda sobre el verbo
> finito **simple**, que es el caso de «casou».»
> **Por:** «Ojo con no aplicar esto de más: en las perífrasis el clítico puede
> ir delante del infinitivo sin ningún atractor —«hei de lhe dizer», «havia de
> me dar»—. La regla del atractor manda sobre el verbo finito **simple**, que
> es el caso de «casou».»

*Nit ya dicho en la v1 y en la v2, que sigue sin ser un problema:* el PE
prefiere de largo `casar com` sin pronombre — lo reconté, **58** apariciones y
la aplastante mayoría sin clítico («Domingos Botelho **casou com** D. Rita
Preciosa», Camilo c01; «não me force a **casar com** meu primo», íd. c04; «vai
**casar com** uma forte, sã, e bela rapariga de Guiães», Eça, *Civilização*).
El ítem **necesita** el clítico para que exista la trampa y la explicación no
dice que `casar-se com` sea la forma europea preferida. Correcto como está.

---

# Parte 2 · Las dos lápidas

El encargo pedía comprobar que dicen la verdad. Una la dice; la otra no del
todo.

## GJ-07 — **PASA con enmienda de redacción**

**Lo publicado es lo que dice.** `b2c2-gj-l5-10` (en
`lib/data/languages/pt/blocks/b8.json`) publica, literal:

> sentence: «Ontem tenho falado com o teu pai.» · verdict `false` ·
> repair: «Ontem falei com o teu pai.» · explicación: «El pretérito perfeito
> composto portugués no es el "he hablado" español: significa acción repetida o
> continuada hasta hoy… Con un "ontem" puntual es incompatible.»

La reposición que se escribió («Tenho falado com o teu irmão ontem à tarde…»)
**es ese ítem**, no se le parece. El 0,674 del gate está bien ganado, y la
decisión de no aflojar el gate para que pase el propio lote es la correcta.

**Las tres atestaciones de `esquecer` también existen**, y las verifiqué una a
una:

- «Com a afflicção **esquecia-me o cognac**...» — Eça, *Os Maias* c11
- «**Esqueceram-me as queijadas!**» — íd., c08
- «**Esquecia-me o Cruges!**... É um dever d'honra!» — íd., c16

**Lo que falla es el eslabón.** La lápida dice que estas atestaciones tumbaron
un MAL sobre `esquecer-se DE`. No lo tumban: como la propia lápida reconoce,
son **otra construcción** (inacusativa, con el objeto de sentido como sujeto y
el clítico en dativo — 'se me olvidó el coñac'), y no licencian «esqueci o
guarda-chuva». Lo que sí lo licencia es que **`esquecer` transitivo directo es
portugués normal y corriente**, sin más. La conclusión (no escribir el ítem) es
correcta; la prueba que se aduce no es la que lo prueba.

> **Enmienda (no bloqueante, pero el documento es memoria del proyecto):**
> sustituir «Es otra construcción…, pero convive con lo que yo iba a condenar»
> por «Es otra construcción, y por sí sola no tumbaba el ítem: lo que lo tumba
> es que `esquecer` con objeto directo (“esqueci o livro”) es portugués
> corriente. La atestación que encontré prueba algo distinto de lo que yo
> quería probar.»

## GJ-15 — **CORRIGE-ASÍ (bloqueante)**

**La parte del gate es verdad.** `b2c2-gj-l4-17` (en `b11.json`) publica,
literal: «Ontem assistimos o jogo todo na televisão.» · verdict `false` ·
repair: «Ontem assistimos ao jogo todo na televisão.» La reposición
(«Assistimos o jogo todo de pé…») **es** ese ítem, y el 0,515 está bien puesto.

**La parte del corpus es falsa.** La lápida dice:

> «Un tercer intento —`apaixonar-se de` por `por`— lo desmintió el corpus antes
> de escribirlo: Camilo trae «apaixonado **de** Thereza» en *Amor de Perdição*,
> que es exactamente la clase de atestación que tumbó los cinco MAL de la v1.»

Leí el párrafo entero, que es lo que el propio método exige. *Amor de Perdição*,
**capítulo 8, párrafo 97**:

> «Não desprazia, portanto, o amor de Marianna **ao amante apaixonado de
> Thereza**. Isto será culpa no severo tribunal das minhas leitoras…»

El capítulo trata de que **Marianna** ama a **Simão**, y Simão es el amante de
**Thereza** (párrafo 96: «Passou-lhe na mente… a conjectura de que era amado
d'aquella dôce creatura»). O sea: «a Thereza's impassioned lover» — `de Thereza`
es complemento del **sustantivo `amante`**, y `apaixonado` es un adjetivo
epíteto que se mete entre los dos. No hay manera de establecer que `de Thereza`
dependa de `apaixonado`. **Bajo la propia regla de la barra de retirada —una
lectura que no es inequívoca no vale—, esto no es una atestación de nada.** Es
justo el falso positivo que el método dice cazar leyendo el párrafo.

Y hay dos agravantes:

1. **El corpus dice lo contrario.** `apaixonad*` + `por/pelo/pela`: **4
   apariciones**, cero con `de` — «Amaro sahia sempre de casa da S. Joanneira
   mais **apaixonado por Amelia**» (*Amaro* c09); «uma actriz do Principe Real…
   **apaixonada por elle**» (*Os Maias* c07); «o marquez… **apaixonado por uma
   barqueira**» (íd., c14); «o artista grego **apaixonado pela carnalidade**»
   (*Contos Phantásticos*, «Beijos por Facadas»). Priberam, además, no registra
   `apaixonar-se de`.
2. **La lección publicada del propio curso enseña lo contrario, en esta misma
   sección B.** `lib/data/languages/pt/mdx/b11/l2-regencias-que-traem.mdx` abre
   su `<Rule>` con «enamorarse DE es **apaixonar-se POR**», lo repite en el
   Vocabulário («**apaixonar-se por** — enamorarse de») y lo ejemplifica en
   `<Example index={0}>` («**Apaixonei-me por** Lisboa à primeira vista.»).

O sea que el tercer intento **no murió en el corpus**: murió —si es que debía
morir— por **redundancia con la regla titular de su propia lección**, que es un
motivo distinto y perfectamente respetable. Dejarlo escrito como está siembra
en la memoria del proyecto la instrucción falsa de que `apaixonado de` está
atestiguado, y el próximo lote la va a obedecer.

> **Sustituir:** «Un tercer intento —`apaixonar-se de` por `por`— lo desmintió
> el corpus antes de escribirlo: Camilo trae «apaixonado **de** Thereza» en
> *Amor de Perdição*, que es exactamente la clase de atestación que tumbó los
> cinco MAL de la v1.»
> **Por:** «Un tercer intento —`apaixonar-se de` por `por`— no llegó a
> escribirse, pero **no por el corpus**: el corpus lo respalda (4 casos de
> `apaixonado por`, ninguno con `de`; el «apaixonado **de** Thereza» de *Amor
> de Perdição* c08 es un falso positivo — ahí `de Thereza` complementa a
> `amante`, no a `apaixonado`). Murió por redundancia: `apaixonar-se por` es la
> **regla titular** de la propia lección `b11-l2-regencias-que-traem`, con
> entrada de vocabulario y `<Example>` propio.»

---

# Parte 3 · Los `concepts` declarados: **sí, el etiquetado es falso** (bloqueante)

El encargo preguntaba si el etiquetado miente. Miente, y se puede medir contra
la definición que el propio proyecto publica.

## Qué es `b11-aspecto-tempo`, según el proyecto

`lib/data/languages/pt/mdx/b11/l4-aspecto-e-tempo.mdx`, `<Rule>` entera:

> «Lo que se calca no son las formas… sino el ASPECTO: cuándo una acción se ve
> acabada, cuándo sigue, cuándo acaba de pasar y cuándo está a punto. Tres
> repartos que no coinciden: **1.** el progresivo (`estar a` + infinitivo);
> **2.** el perfeito composto (`tenho falado` no es «he hablado»); **3.** las
> perífrasis que el español no tiene: `haver de`, `ficar a`, `estar para`, `vir a`.»

Ni una palabra de colocación pronominal, de prótasis condicional ni de
selección de modo. Y los **tres** ítems que hoy llevan la etiqueta se ajustan a
esa definición con rigor: `é capaz de chover` (modalidad), `ando a ler`
(aspecto), `Ontem tenho falado` (aspecto/tiempo). **La etiqueta, en este
repositorio, significa lo que dice que significa.**

## Qué enseñan de verdad los ocho de la sección A

| ítem | lo que enseña | ¿es aspecto/tempo? | dónde debería estar |
|---|---|---|---|
| GJ-01 | próclise obligatoria bajo `não` | **NO** — colocación | `b8-coloc-proclise-negacao` (ya existe, 12 ítems) |
| GJ-02 | imperfeito do conjuntivo en la prótasis | **NO** — modo | `b5-se-condicional` (28) / `b6-se-subjuntivo` (21) |
| GJ-03 | `costumar` + infinitivo (habitualidad) | **sí** | — |
| GJ-04 | `esperar que` rige conjuntivo | **NO** — modo | `b6-pres-subj-disparadores` (20) |
| GJ-05 | `haver de` + fut. do conjuntivo | **sí** | (+ `b6-fut-subj-quando`, 22) |
| GJ-06 | `ficar a` + infinitivo (continuativo) | **sí** | — |
| GJ-08 | `ir` + gerundio (gradual) | **sí** | — |
| GJ-09 | `sem que` rige conjuntivo | **NO** — modo | `b6-contraste-indicativo-subjuntivo` (25) |

**Cuatro de ocho.** Y no es que falten conceptos donde meterlos: el repositorio
**ya tiene** `b8-coloc-proclise-negacao`, `b8-colocacao-pronominal`,
`b8-coloc-enclise`, `b5-se-condicional`, `b6-pres-subj-disparadores`,
`b6-fut-subj-quando`, `b6-contraste-indicativo-subjuntivo`. Etiquetar GJ-01 como
«aspecto y tiempo» teniendo `b8-coloc-proclise-negacao` a mano es la misma
enfermedad que `b5-futuro-composto` con 54 ítems y cero futuro composto, sólo
que en dirección contraria: aquí se **infla** el punto que no cierra a costa de
los que sí enseñan lo que se etiqueta.

**Consecuencia sobre la tabla de cabecera.** La v3 declara `b11-aspecto-tempo`
«3 → 11 (no cierra), a **uno** del piso». Contando sólo lo que de verdad enseña
aspecto o tiempo: **3 + 4 = 7**, a **cinco** del piso. La frase «se queda a uno
del piso» es falsa, y es la frase con la que se justifica publicar catorce.

## Y la otra fila de la tabla tampoco cuadra

`b11-regencias` se declara «10 antes → **16** tras el lote (**cierra**)».
Conté los `concepts` de los 2 431 ítems publicados:

- ítems con `concepts` conteniendo `b11-regencias`: **5**
- ítems con `lessonId: b11-l2-regencias-que-traem`: **10**, de los cuales **5
  llevan `concepts: []`** (`b2c2-gj-l4-08` preocupar-se, `-l4-14` precisar de,
  `-l4-17` assistir a, `-l4-18` esperar por, `-l4-20` dar por)

O sea: el «10 antes» es un recuento a mano por lección, no por etiqueta. Por
etiqueta —que es lo único que una app puede contar— tras el lote quedan
**5 + 6 = 11**, y con el piso en 12 **el punto no cierra**. (Ironía fina: uno de
esos cinco sin etiquetar es `b2c2-gj-l4-17`, el mismo que mató la reposición de
GJ-15.)

> **Acción, en un paso:** retiquetar GJ-01, GJ-02, GJ-04 y GJ-09 a sus
> conceptos reales; **y** en el mismo commit poner `concepts:
> ["b11-regencias"]` a los cinco ítems de `b11-l2-regencias-que-traem` que hoy
> lo tienen vacío. Con eso `b11-regencias` cierra de verdad (10 + 6 = 16) y
> `b11-aspecto-tempo` queda declarado honestamente en 7, no en 11. Si Edu
> prefiere no tocar los cinco legacy, entonces **la tabla de cabecera tiene que
> decir 11 y «no cierra»**, no 16 y «cierra».

---

# Parte 4 · Metadata `register` / `address`

**El documento no declara ninguno de los dos campos en ningún ítem.** La regla
del encargo —`address` sólo donde hay tratamiento **realizado en el texto**— es
la que el repositorio ya practica: de 2 431 ítems, **2 328 no llevan `address`**,
y los 88 que llevan `address: "tu"` lo llevan porque el texto lo realiza. El
precedente exacto es el propio gemelo de la lápida de GJ-07: `b2c2-gj-l5-10`,
«Ontem tenho falado com **o teu** pai», lleva `register: "neutro"` y
`address: "tu"`. Y `b2c2-gj-l4-17`, «Ontem assistimos o jogo todo na
televisão», lleva `register` y **no** lleva `address`, porque no hay 2.ª persona.

Aplicando ese criterio al lote:

| ítem | tratamiento realizado | `address` |
|---|---|---|
| GJ-02 | «iria **convosco**» — 2.ª plural | ⚠ ver abajo |
| GJ-04 | «o **teu** irmão» | `tu` |
| GJ-05 | «Hei de **te** contar» | `tu` |
| GJ-06 | «no que me **disseste**» | `tu` |
| GJ-13 | «**Repara** na camisola» (imperativo 2.ª sg) | `tu` |
| GJ-01, 03, 08, 09, 10, 11, 12, 14, 16 | ninguno | **sin campo** |

**El caso que no encaja: GJ-02.** «Convosco» realiza tratamiento de 2.ª plural,
y el vocabulario de `address` que el repositorio usa hoy (`tu`, `voce_BR`,
`o_senhor`, `V_Exa`, `nome_cargo`, `terceira_sem_pronome`) **no tiene valor para
eso**. Lingüísticamente «convosco» es PE correcto y Ciberdúvidas lo da como la
opción más formal frente a «com vocês» —en el corpus aparece **una sola vez**,
y con `vós` («eu tenho de ir **convosco** a Cabril, onde **vós ides**», Eça,
*O Defunto*)—, así que no propongo tocar la frase. Propongo **no inventar un
valor**: o se añade uno explícito al vocabulario, o GJ-02 se queda sin `address`
y se anota por qué. Lo que no vale es etiquetarlo `tu`.

**`register`:** la convención mayoritaria del repositorio es omitirlo (2 087 de
2 431). Si se declara, lo honesto sería `informal` para GJ-03 («um bocado»),
GJ-06 («não preguei olho») y GJ-12 («os miúdos»), y omitirlo en el resto. No es
bloqueante en ninguna de las dos direcciones; lo que sí lo sería es marcarlos
todos «neutro» por defecto.

---

# Parte 5 · Fugas y atajos

## Fuga confirmada: GJ-16 → GJ-05

Ya tratada en GJ-16. Es el bloqueante B-1.

## Fuga menor, en la dirección contraria: GJ-05 → GJ-01

La coleta de GJ-05 es «prometo que **não me esqueço**» — próclise correcta bajo
`não`, en un ítem **BIEN**, que es literalmente el modelo de lo que GJ-01 pide
juzgar. No regala el veredicto de GJ-01 (que es MAL), pero le da al alumno la
forma buena servida en bandeja. La sustitución de frase que propongo en GJ-05 la
elimina de paso.

## Fuga comprobada que NO existe: GJ-12

Ver GJ-12. Cero coincidencias en bloques y MDX. Limpio.

## Atajo no medido, y es el más fuerte del lote (bloqueante)

Cuatro de las ocho frases de la sección A son `<Example>` de
`b11-l4-aspecto-e-tempo.mdx` —la lección que este mismo lote sirve— con una
coleta pegada detrás:

| ítem | frase del lote | `<Example>` de la lección | veredicto |
|---|---|---|---|
| GJ-03 | «**Costumo levantar-me às sete**, mesmo ao fim de semana, e depois leio um bocado.» | «Costumo levantar-me às sete.» | BIEN |
| GJ-05 | «**Hei de te contar tudo** quando nos virmos com calma…» | «Hei de te contar tudo.» | BIEN |
| GJ-06 | «Ontem à noite **fiquei a pensar no que me disseste** e não preguei olho.» | «Fiquei a pensar no que disseste.» | BIEN |
| GJ-08 | «**A avó vai melhorando aos poucos** e já se levanta sozinha para ir à cozinha.» | «A avó vai melhorando aos poucos.» | BIEN |

**Cuatro de cuatro, y las cuatro BIEN.** Ninguno de los seis MAL sale de la
lección (los `<Example>` restantes —«Estou a fazer o jantar», «Acabei de
chegar», «O comboio está para chegar»— no están en el lote). La sección B está
limpia: ninguna de sus seis frases reproduce un `<Example>` de
`b11-l2-regencias-que-traem`.

**Cuánto vale como atajo.** Como regla «está en la lección ⇒ BIEN, no está ⇒
MAL» sobre los 14: 4 aciertos por presencia + 6 por ausencia = **10/14 (71 %)**,
por encima de **los once** rasgos que el preflight sí mide (el mejor, 9/14, 64 %).
Precisión perfecta (4 de 4, ningún falso positivo). Test exacto de Fisher
unilateral: **p ≈ 0,070** — por encima del `SOSPECHOSO = 0.05` de
`scripts/lib/atajos.ts`, o sea que **aunque el preflight lo midiera, no
bloquearía**; pero el acierto bruto es el más alto de la tabla.

**Por qué el gate no puede verlo.** `scripts/preflight-lote.ts`, línea 52:

```ts
const DIR_BLOQUES = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
```

Es el **único** directorio que abre. El gate de virginidad compara contra 2 431
ítems publicados y **nunca contra las lecciones**. Es el mismo mecanismo que la
v2 descubrió con la coleta que diluía el solape IDF, un piso más abajo: aquí no
es que el solape se diluya, es que la fuente ni siquiera está indexada.

> **Acción, en un paso:** sustituir las cuatro frases (los textos exactos están
> en GJ-03, GJ-05, GJ-06 y GJ-08) y volver a pasar el preflight. Si alguna
> sustitución tropieza con el gate, esa se queda **y el atajo se declara
> medido** en el documento — que es la doctrina de la casa: no se afloja un
> gate para que pase el propio lote, pero tampoco se publica un rasgo sin
> declararlo.
>
> **Y por separado, para el lote 11:** que `preflight-lote.ts` indexe también
> `lib/data/languages/pt/mdx/**`. Sin eso, este atajo vuelve.

## Lo que sí está medido y está bien

Verifiqué la afirmación del encabezado sobre el arranque: los cuatro ítems que
abren con adjunto o subordinada son GJ-01 y GJ-02 (**MAL**) y GJ-06 y GJ-14
(**BIEN**) — **dos y dos**, tal como dice el documento, y el rasgo cae a 8/14,
p = 0,395. El arreglo del arreglo funcionó.

Y el `rev` del preflight es **auténtico y vigente**: el sha256 de
`scripts/lib/atajos.ts` empieza por `4cc7a606`, exactamente el que el documento
estampa. La salida pegada no está caducada.

---

# Lo que hay que cambiar sí o sí antes de publicar

## Bloqueantes (5)

1. **GJ-16 — quitar la fuga y la referencia colgante.** «(como "Hei de te
   contar", **aquí mismo en GJ-05**)» regala el veredicto de GJ-05 y apunta a
   un identificador que en la app no existe. Texto de sustitución exacto en
   § GJ-16.
2. **`concepts` falsos en GJ-01, GJ-02, GJ-04 y GJ-09.** Cuatro de los ocho de
   la sección A no enseñan ni aspecto ni tiempo según la definición que publica
   la propia lección `b11-l4`. Retiquetar a `b8-coloc-proclise-negacao`,
   `b5-se-condicional`, `b6-pres-subj-disparadores` y
   `b6-contraste-indicativo-subjuntivo`.
3. **La tabla de cabecera.** Por etiqueta, `b11-regencias` queda en **11**, no
   en 16, y **no cierra**; y `b11-aspecto-tempo` queda en **7**, no en 11 —
   a cinco del piso, no a uno. O se etiquetan en el mismo commit los cinco
   ítems de `b11-l2-regencias-que-traem` que hoy llevan `concepts: []`, o la
   tabla se corrige.
4. **La lápida de GJ-15 — la atestación es falsa.** «Apaixonado de Thereza»
   (Camilo, *Amor de Perdição* c08 §97) es «el amante apasionado **de
   Thereza**»: `de Thereza` complementa a `amante`. El corpus, además, trae
   `apaixonado por` cuatro veces y `de` ninguna, y la lección
   `b11-l2-regencias-que-traem` **enseña `apaixonar-se por` como regla
   titular**. Texto de sustitución exacto en § Lápidas.
5. **El atajo de los `<Example>` de la lección.** Cuatro frases de la sección A
   son ejemplos literales de `b11-l4` y las cuatro son BIEN (10/14, p ≈ 0,070,
   por encima del mejor rasgo medido). Sustituciones exactas en GJ-03, GJ-05,
   GJ-06 y GJ-08; y volver a pasar el preflight. *(El dueño primario de este
   hallazgo es el ángulo pedagógico; lo levanto porque es una fuga
   lección→ítem y salió de verificar los `concepts`.)*

## Menores, con el texto exacto (6)

- **M-1 · GJ-13.** «la preposición decide el sentido» → «la preposición es la
  que asegura el sentido de 'fijarse'… Sin ella, "reparar a camisola" **se
  entiende como** arreglarla». Priberam da `reparar` transitivo = 'notar'
  (ac. 11): la preposición no *decide*, inclina.
- **M-2 · GJ-04.** «con presente, como aquí, **no cabe**» → «con el presente
  simple, como aquí, **la norma no lo admite**». El único contraejemplo del
  corpus («espero que… te **has** de corrigir», Junqueiro) tiene forma de
  presente.
- **M-3 · GJ-14.** «la **contração** con el artículo» → «la *contração*» (en
  cursiva, como término) o «la contracción». Portuguesismo sin marcar en medio
  de una frase española.
- **M-4 · `address` / `register`.** Poner `address: "tu"` en GJ-04, GJ-05,
  GJ-06 y GJ-13 (tratamiento realizado en el texto, precedente
  `b2c2-gj-l5-10`); **no** ponerlo en los otros nueve; y resolver GJ-02
  («convosco» es 2.ª plural y el vocabulario del proyecto no tiene valor para
  eso) añadiendo un valor explícito o dejándolo vacío con nota — nunca `tu`.
- **M-5 · Lápida de GJ-07.** Aclarar que las tres citas de `esquecer` prueban
  otra cosa: lo que tumba el ítem es que `esquecer` transitivo directo es
  portugués corriente, no la construcción inacusativa con dativo.
- **M-6 · GJ-01 y GJ-06 abren los dos con «Ontem à noite».** La sustitución de
  frase que propongo en GJ-06 lo resuelve sin coste; si esa sustitución no se
  hace, cambiar al menos el adjunto.

---

# Qué está bien (con nombre y apellidos, para que no se pierda al reescribir)

No es cortesía. Es lo que no hay que tocar en la reescritura.

- **Las diez correcciones están las diez, y ocho son el texto prescrito
  literal.** El fallo de proceso que definió la v2 —perder correcciones ya
  pagadas al reconstruir el lote de memoria— **está cerrado**. Es el único
  motivo por el que esta ronda no repite la anterior.
- **GJ-11 es el mejor ítem del lote y por segunda ronda consecutiva.** Veredicto
  exacto (239 a 0 tras un grep ancho con grafía antigua), la nota del AO90
  verificada contra la Base IX literal en sus **dos** mitades (facultativo *y*
  oposición viva), y el truco de meter `chegámos` dentro de la frase condenada
  para desactivar de antemano una lectura falsa. No se toca nada.
- **GJ-08 sigue siendo el modelo de redacción**, y ahora con un dato más a su
  favor: el «já **se** levanta» de la frase es correcto y verificable (355
  párrafos de `já` + próclise contra 2 de ênclise, y esas dos sobre
  infinitivo). Su absoluto está desactivado **por el propio texto**, que es lo
  que a GJ-04 y GJ-13 todavía les falta. Cámbiese la frase, **no la
  explicación**.
- **GJ-01 es el veredicto mejor verificado que ha tenido este lote.** Le eché
  la red más ancha hasta ahora —140 candidatos frente a los 22 de la v2,
  admitiendo dos palabras de distancia y las formas decimonónicas— y siguen
  siendo **cero** supervivientes. Y el paréntesis del infinitivo, que la v2
  mandó añadir, resultó estar respaldado por media docena de casos reales del
  propio corpus.
- **GJ-12 pasó la prueba de fuga que se le pedía.** Busqué «Vejo o meu pai» y
  la *a* personal en los diez bloques y en todos los MDX: cero. La mención no
  regala nada.
- **GJ-09 y GJ-02 se defienden solos.** GJ-09 apoya el juicio en un contraste
  que ya está dentro de la propia frase («como se fosse»); GJ-02 dice «la
  prótasis de una condición hipotética» y esa acotación es justo lo que lo
  salva de condenar «Não sei se eu seria capaz». Y en los dos, la trampa del
  grep volvió a estar ahí (los `sem que` relativos de Garrett, los `se`
  interrogativos indirectos) y volvió a caerse sólo al leer el párrafo.
- **GJ-10 dejó de ser un hombre de paja.** El texto nuevo no sólo pone el
  contraste en la casilla correcta: **dice en voz alta** que en esta frase el
  destinatario es el clítico `-me`, o sea que el alumno no tiene que descartar
  una forma que nadie produce. Eso es honestidad de diseño, y es nueva.
- **El equilibrio del arranque funcionó, y lo verifiqué.** Los cuatro ítems que
  abren con adjunto o subordinada son dos MAL y dos BIEN, exactamente como
  declara el encabezado. El atajo que el arreglo de la v2 fabricó está muerto.
- **El `rev` del preflight es auténtico.** `4cc7a606` es el sha256 real de
  `scripts/lib/atajos.ts` a día de hoy. La disciplina de estampar la rev para
  que una salida caducada se note funciona; es la razón por la que pude
  descartar en un minuto la hipótesis de que el preflight pegado fuera viejo.
- **Y la decisión de no aflojar el gate para que pase el propio lote.** Las
  reposiciones de GJ-07 y GJ-15 murieron a 0,674 y 0,515 contra ítems que
  publican lo mismo, y las dos cifras son ciertas: las verifiqué abriendo
  `b8.json` y `b11.json`. Que el lote salga con 14 en vez de 16 por respetar su
  propio gate es lo más sano que hay en este documento.
