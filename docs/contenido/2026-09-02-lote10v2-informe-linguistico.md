# Lote 10 B2C2 **v2** — dictamen LINGÜÍSTICO (portugués europeo)

Fuente: `docs/contenido/2026-09-02-lote10-b2c2-v2.md`. Los 16 juicios, uno por uno.

**Método.** Aplané los 224 ficheros de `lib/data/languages/pt/lecturas/` a texto
plano: **18 993 párrafos, 4 269 271 caracteres** (cuadra con el conteo de la v1).
Busqué **por lema**, con las variantes decimonónicas (`n'um`, `sahir`, `ha de`,
`-ámos`, `emquanto`) y **leí entero el párrafo de cada candidato antes de usarlo**.
Contrastes externos comprobados uno a uno, no de memoria: texto primario del AO90
(Base IX), Ciberdúvidas (5 consultas) y Priberam (`obedecer`, `reparar`).

**Aviso metodológico que vale por medio informe.** De los tres greps que parecían
tumbar un ítem, **los tres eran falsos positivos** y se ven en el detalle de
GJ-01, GJ-09 y GJ-11. Un recuento a ciegas habría retirado tres veredictos
correctos. Marco en cada ítem cuántos candidatos hubo y cuántos sobrevivieron a
la lectura.

---

## Recuento

| veredicto | ítems | n |
|---|---|---:|
| **RETIRAR** | 07 (lingüístico), 15 (redundancia) | **2** |
| **CORREGIR** (el ítem se queda; la explicación no puede publicarse así) | 01, 05, 06, 10, 13, 14, 16 | **7** |
| **MANTENER con matiz menor** | 02, 03, 04, 12 | **4** |
| **MANTENER** tal cual | 08, 09, 11 | **3** |

**El titular: la v2 arregló el problema de la v1.** De los 8 veredictos MAL,
**7 aguantan la verificación** (en la v1 cayeron 5 de 8). El único que cae por
razones lingüísticas es GJ-07, y GJ-15 cae por redundancia, no por lengua.

**Y el titular incómodo: el fallo se mudó de sitio.** Ahora está en las
*explicaciones*, y sobre todo en esto —

> **Tres de las diez correcciones que la v1 marcó como obligatorias no se
> aplicaron, y los ítems afectados siguen en el lote con el texto literal de la
> v1.** Son GJ-05 (#10), GJ-06 (#4) y GJ-16 (#9). Una cuarta (GJ-13, #5) se
> aplicó a medias y sigue siendo falsa.

Comprobado carácter a carácter contra `2026-09-01-lote10-b2c2.md`. El documento
lista en «Qué cambia respecto de la v1» cinco cambios y ninguno de estos tres.
El riesgo no es un ítem: es que el ciclo de revisión pierde correcciones ya
pagadas.

---

# A · `b11-aspecto-tempo`

## GJ-01 · «Ontem à noite não disse-me nada…» → **CORREGIR** (explicación)

**El veredicto es el mejor verificado del lote.** Busqué ênclise bajo `não` en
los 4,27 M de caracteres: **22 candidatos, 0 supervivientes.** Todos son:

- `senão` / `se não` = 'si no, sino': «Senão **quebrava-lhe** a cara» (Eça, *Os
  Maias* c09), «Senão **deixo-te** a ti arranjar os termos» (íd. c15), «senão
  **tinha-o** feito» (Garrett, c46), «senão **têmol-a** aqui» (Eça, *Amaro* c09).
- `quando não` = 'de lo contrario': «quando não **atiro-lhes** já ás pernas os
  meus cães de fila» (Junqueiro).
- Y uno que es puro chiste del grep: «O **anão** voltou-se» (Eça, *Amaro* c23).

Cero casos de verbo **finito** con ênclise bajo un `não` de su propia oración.
La frase está mal y el *repair* es mínimo (una palabra). Hasta aquí, impecable.

**Pero la explicación tiene dos frases falsas.**

**1. La causa está del revés — y es la misma falla que la v2 dice haber
arreglado en GJ-12.**

> «…y el hispanohablante la rompe **porque el español coloca al revés**.»

Con negación el español coloca **igual**: *no me dijo nada*, proclítico, sin
alternativa. En este contexto exacto las dos lenguas coinciden y la L1 **empuja
hacia la forma correcta**. El hispanohablante que traduce a bulto acierta.
El error real es de hipercorrección: el alumno ha aprendido que en PE la ênclise
es lo normal y la sobreaplica. Es literalmente el defecto que el revisor de la v1
levantó en GJ-12 y que la v2 celebra haber corregido — reintroducido en GJ-01.

**2. El absoluto no se sostiene para el infinitivo.**

> «con "não", el clítico va **delante** del verbo. Es de las poquísimas reglas de
> colocación que **no admite discusión en ninguna variedad**.»

Sólo vale para el verbo **finito**. Ciberdúvidas, *Próclise ou ênclise do
pronome*: «Com os **INFINITIVOS soltos, mesmo quando modificados por negação, é
lícita a PRÓCLISE ou a ÊNCLISE**», con el ejemplo «Para **não fitá-lo**, deixai
cair os olhos». Y el corpus del curso lo practica:

- «para **não dá-la** por tão pouco» (*Contos Phantásticos*, «A Adega de Funck»)
- «até **não podê-lo** ser mais» (Camilo, *Amor de Perdição* c21)
- «para **não torná-lo** uma mentira» (*Contos Phantásticos*, «Beijos por Facadas»)
- «seria apenas torcer-lhe um momento o instincto natural e **não criar-lhe** uma
  paz duradoura» (Eça, *Amaro* c22)

> **Sustituir la explicación entera por:** «Con el verbo **finito**, «não» obliga
> a la próclise: el clítico va delante. Es de las reglas de colocación más firmes
> del portugués, y vale igual en Portugal y en Brasil. (Con infinitivo la cosa se
> afloja: «para não lhe dizer» y «para não dizer-lhe» son las dos correctas.)
> Ojo: aquí el español **no** te traiciona —dice también «no me dijo nada»—; el
> error sale de haber aprendido que la ênclise es lo normal en portugués y
> aplicarla también donde hay atractor.»

*Nota de diseño, no mía:* el preflight ya avisa de que `e75e296f` publicado es
«Ele não ___ disse nada sobre a viagem», la misma regla con casi la misma frase.

## GJ-02 · «Se eu seria mais novo…» → **MANTENER** (un matiz)

Era una de las sospechas del encargo. **Aguanta.**

Corpus: **cero** casos de `se` conjunción condicional + condicional en la
prótasis. Todo lo que el grep levanta es `se` = 'si acaso / whether' en
interrogativa indirecta, que es otra construcción y es correcta:
«perguntou… **se não haveria** risco» (Camilo c01), «hesitando **se deveria**
ouvir» (*Contos Phantásticos*), «perguntou… **se ella gostaria** que Carlos
viesse» (Eça, *Os Maias* c15), y una exclamativa indirecta que engaña de veras:
«Lembrava-me minha mãe. **Se a tornaria a vêr** ainda!» (*Beijos por Facadas*).

**Y la explicación ya está bien acotada**: dice «la prótasis de una condición
hipotética», que es justo lo que impide leerla como si condenara «Não sei se eu
seria capaz». Está redactada con el cuidado que a otros ítems del lote les falta.

**El único matiz.** «El español tampoco admite "si yo sería"» es verdad del
español **estándar**, y falso del español real de bastantes zonas (País Vasco,
Navarra, La Rioja; áreas de Argentina y Ecuador), donde «si tendría dinero, lo
compraría» está documentado desde hace un siglo. Como la frase está sosteniendo
un argumento causal, la acotaría:

> «El español **estándar** tampoco admite "si yo sería", así que aquí el calco no
> viene de la lengua materna sino de la simetría aparente entre las dos mitades.»

*Sin consecuencia:* «convosco» es correcto y es buen PE, aunque Ciberdúvidas lo
da como la opción más formal frente a «com vocês» (en el corpus aparece una sola
vez, y con `vós`). No lo tocaría.

## GJ-03 · «Costumo levantar-me às sete…» → **MANTENER** (nit)

Verificado en la v1 en sus tres capas y no ha cambiado nada relevante. La
mención a `soer`, que sobraba, se fue: bien.

*Nit de redacción, no error:* «más frecuente que cualquier **perífrasis** con
"normalmente"» — «normalmente» es un adverbio, no una perífrasis, y la
comparación de frecuencia no la sostiene nadie. Bastaría «más frecuente que
decirlo con "normalmente"».

## GJ-04 · «Espero que o teu irmão vem…» → **MANTENER** (un matiz)

**El veredicto se sostiene, y con autoridad explícita.** Ciberdúvidas, *O verbo
esperar e o conjuntivo*: «**O verbo esperar selecciona orações completivas com
verbo no conjuntivo**». La misma respuesta admite el futuro do indicativo como
«de **carácter marginal** na perspectiva da norma» — y el ítem no usa futuro,
usa presente (`vem`), que no está ni en esa zona marginal.

Corpus: ~25 casos reales de `esperar que` con completiva, **todos en conjuntivo**
(«esperava que suas Incellencias lhe **perdoassem**», Eça; «Esperei que o tempo
te **aclarasse** a razão», Camilo; «Espera que te **offereçam** outro», Junqueiro).

**Una sola excepción, y es exactamente la marginal que describe Ciberdúvidas:**
«espero que quando fores maior te **has** de corrigir» (Junqueiro, *Os Pêssegos*)
— indicativo, con la perífrasis modal `haver de`. No amenaza el veredicto, pero
desaconseja escribir el absoluto sin red. Si se quiere blindar:

> «"Esperar que" rige **conjuntivo**… (con futuro y valor de convicción firme
> aparece a veces el indicativo —"espero que virá"—, pero es uso marginal; con
> presente, como aquí, no cabe.)»

## GJ-05 · «Hei de te contar tudo…» → **CORREGIR (obligatorio, heredado)**

**Veredicto BIEN correcto**, y por la razón que la v1 ya estableció: en predicado
complejo el clítico sale del dominio del finito. Corpus, **28 casos** con el
clítico entre `de` y el infinitivo, incluido el paralelo casi literal «**Has de
te lembrar** algumas vezes d'estas boas manhãs» (Eça, *Amaro* c19), más «**hei de
lhe levar** um cesto» (Junqueiro), «**Hão de lhe vir** ámanhã as vertigens»,
«**Hei de lhes mostrar**», «**havia de me dar** a sua freguesia» (*No Moinho*).

**Pero la frase que la v1 mandó acotar sigue igual, palabra por palabra:**

> «"quando nos virmos" es futuro do conjuntivo, **obligatorio tras "quando" de
> futuro"**»

Falso para el `quando` interrogativo: «**Quando nos vemos?**» con valor de futuro
es PE perfectamente normal. Corrección de la v1 nº 10, no aplicada.

> **Sustituir:** «obligatorio tras "quando" de futuro»
> **Por:** «obligatorio tras "quando" **en oración subordinada temporal** de
> futuro (en la interrogativa no: "Quando nos vemos?" está bien).»

## GJ-06 · «Fiquei a pensar…» → **CORREGIR (obligatorio, heredado)**

**Veredicto BIEN correcto.** Y el absoluto que la v1 mandó quitar está intacto:

> «El español lo resuelve con "me quedé pensando", **gerundio que aquí no cabe**.»

Cabe. Lo conté yo mismo: **48 casos de `ficar` + gerundio** en el corpus del
curso.

- «E **ficou pensando** na sua espinhosa situação.» — Camilo, *Amor de Perdição* c08
- «**ficamos pensando** que seria ella a propria rainha» — íd. c01
- «Eu **fico pedindo** a Nossa Senhora que vá na sua companhia.» — íd. c10
- «Depois **ficou relendo** a de Thereza» — íd. c08
- «**ficava esmagando** os olhos turvos na fachada negra daquela casa» — Eça,
  *José Matias* (edición de ortografía modernizada: no es arcaísmo gráfico)

Corrección de la v1 nº 4, no aplicada. Es la más grave de las tres heredadas,
porque le dice al alumno que no existe algo que va a leer esta semana en la
Biblioteca de la propia app.

> **Sustituir:** «gerundio que aquí no cabe.»
> **Por:** «El español lo resuelve con "me quedé pensando". La norma europea de
> hoy prefiere el infinitivo, "ficar a pensar" (en Eça y en Camilo todavía
> encontrarás "ficou pensando").»

## GJ-07 · «Na segunda-feira vou a levar o carro…» → **RETIRAR** *(o reescribir; ver abajo)*

**Éste repite la clase de fallo que tumbó la v1**, y no lo digo por analogía:
lo dice la autoridad.

**Ciberdúvidas**, consultorio *«Vamos a ver»: ir + a + infinitivo*, sobre la
construcción `ir a + infinitivo`: «**está correta**, mas não é específica de um
falar regional. Na verdade, **pertence ao português em geral**» — y no la trata
como castelhanismo. Le reconoce dos valores: incitación («vamos a ver») e
**inminencia** («a criança **ia a dormir** ao colo da mãe»), con respaldo del
gramático Francisco Fernandes.

**Corpus del curso: 25 casos.** La mayoría son inminencia —

- «**Ia a dizer**: —Fiz uma tolice, —mas acanhou-se.» — Eça, *Amaro* c08
- «**Ia a sahir**, mas á porta, parando:» — íd. c23
- «Carlos impaciente **ia a subir** ao quarto do Ega.» — Eça, *Os Maias* c13
- «**Iam a cahir** nos braços um do outro…» — Garrett, c25
- «Mas quando **ia a sair**, o gallo atirou-se a elle» — Junqueiro

— pero **no todos**, y ahí es donde el ítem se rompe:

> «—Sr. pai! —continuou mansamente o filho— isto **não vai a matar**. Tome
> fôlego, e escute o seu Joaquim.» — Camilo, *Novelas do Minho*, «A Morgada» 04

Eso no es inminencia: es futuro/modal genérico, 'esto no va a matar a nadie'.
Y en Eça: «E o que **vou a dizer** não é para lisonjear a vossas senhorias»
(*Amaro* c25); «sempre que **vou a adormecer**» (*Os Maias* c05).

**Por qué cae.** El ítem afirma:

> «El futuro perifrástico portugués **no lleva "a"**: "vou levar", **nunca** "vou
> a levar".»

Ese «nunca» es falso: la cadena está atestiguada 25 veces en la Biblioteca del
propio curso y declarada correcta por Ciberdúvidas. Lo único que hace rara la
frase del ítem es que «Na segunda-feira» bloquea la lectura de inminencia — o
sea, **un juicio de compatibilidad aspectual disfrazado de juicio de buena
formación**, que es palabra por palabra la razón por la que se retiró el GJ-07 de
la v1 («está para chegar… duas horas»). Un C1 que haya leído «ia a dizer» y
marque BIEN no está equivocado.

**Si Edu quiere salvar el punto** —y vale la pena, es el error nº 1 real del
hispanohablante— tiene que dejar de mentir. Explicación que sí es verdad:

> «El futuro perifrástico portugués es **"vou levar"**, sin "a". Ojo, porque
> "ir **a** + infinitivo" **sí existe** en portugués, pero significa otra cosa:
> estar a punto de. "Ia a sair quando o telefone tocou" = estaba a punto de
> salir. Por eso "na segunda-feira vou a levar" no funciona: la fecha futura
> mata la lectura de inminencia y sólo queda el futuro, que va sin "a".»

Aun así queda un ítem cuya dificultad es semántica, no formal. **Mi veredicto es
RETIRAR**; reescribirlo es una decisión de Edu, y con la explicación actual no
puede publicarse en ninguna de las dos hipótesis.

## GJ-08 · «A avó vai melhorando aos poucos…» → **MANTENER**

Sigue siendo el mejor ítem del lote y no le toqué nada. Veredicto correcto,
explicación verdadera, y el absoluto desactivado a propósito por el propio texto
(«es el contraejemplo que impide leer la regla como "en portugués europeo nunca
hay gerundio"»). Es el modelo de redacción que le falta a GJ-01, GJ-06 y GJ-14.

## GJ-09 · «Ele saiu de casa sem que ninguém o viu…» → **MANTENER**

La otra sospecha del encargo. **También aguanta**, y esta vez el grep sí me tendió
una trampa.

Corpus: **41 apariciones de «sem que»**. Treinta y nueve son la conjunción y
**las treinta y nueve llevan conjuntivo** («sem que a sua face de mármore
**perdesse** a rigidez», Eça, *A Aia*; «sem que Jacintho o **ordenasse**», íd.;
«sem que ninguem em roda **suspeite**», *Amaro* c20; «sem que um cão **ladrasse**
detrás das cancelas», Eça, *O Defunto*).

Las otras dos **parecen** «sem que» + indicativo y **no lo son**:

> «compre um Spectator, que é livro **sem que se não póde** estar» — Garrett, c04
> «é liga **sem que se não lavra** o mais fino de seu oiro» — íd., c10

Ahí `que` es **pronombre relativo** tras la preposición `sem` (= «sem o qual»),
no la conjunción; por eso va indicativo. Construcción distinta. Un recuento por
cadena las habría dado como contraejemplos y habría retirado un ítem correcto.

Ciberdúvidas lista «sem que» entre las conjunciones que abren oraciones «que
podem conter o imperfeito do subjuntivo ou o presente do subjuntivo».
**Respuesta a la pregunta del encargo: no encontré ningún registro que admita
«sem que» conjunción + indicativo.**

El *repair* es de una palabra y la explicación es verdadera, incluido el contraste
interno («como se fosse» ya está bien puesto). Nada que tocar.

---

# B · `b11-regencias`

## GJ-10 · «Deram-me os parabéns pelo trabalho…» → **CORREGIR** (explicación)

**La frase es correcta**, y el corpus confirma los dos regímenes por separado:

- causa con `por`: «Muitos parabens **por** ter quinado com o senhor parocho»
  (Eça, *Amaro* c04)
- destinatario con `a`: «dê lá os parabens **a** essa gente» (íd. c10), «Os
  nossos parabens **ao** arrojado gentleman» (*Os Maias* c07), «muitos parabens
  **a** v. exc.^a» (íd. c16)

**Pero la explicación confunde las dos casillas:**

> «Y "dar os parabéns **por**" —no "para"— es el régimen europeo.»

El contraste `por`/`para` **no existe** en la casilla de la causa: nadie dice
«*dar os parabéns **para** o trabalho». Donde sí existe es en la casilla del
**destinatario**: «dar os parabéns **a** alguém» (europeo) frente a «**para**
alguém» (brasileño). Y en esta frase el destinatario es el clítico `-me`, así que
el contraste que el ítem invoca **ni siquiera es visible en la frase**. Es un
hombre de paja: pone al alumno a descartar una forma que nadie produce.

**Respuesta a la pregunta del encargo:** no hay alternancia `por`/`pelo` que
decidir — `pelo` **es** `por` + `o`. Con nombre determinado la contracción es
obligatoria («pelo trabalho»); sin determinante sería «por um trabalho».

> **Sustituir:** «Y "dar os parabéns **por**" —no "para"— es el régimen europeo.»
> **Por:** «El motivo va con **por** ("pelo trabalho" = por + o). Y cuando
> aparece el destinatario, el régimen europeo es **a** —"dar os parabéns **a**
> alguém"—, no "para", que es lo brasileño; aquí el destinatario es el propio
> clítico "-me".»

## GJ-11 · «Chegámos em Lisboa…» → **MANTENER**

**El MAL mejor sostenido del lote, y las dos afirmaciones son exactas.**

*Régimen.* Busqué `chegar` + `em/no/na/num/n'um`: **9 candidatos, 0 de destino.**
Todos son tiempo, medio o modo:

- tiempo: «Tinha chegado **na vespera**» (*Amaro* c25), «Chegára **na vespera**»
  (*Os Maias* c15), «chegou **nos nossos dias** até ao chafariz» (Garrett c28)
- medio: «quando elle chegasse **no comboio** de Irun» (*A Cidade e as Serras* c08)
- modo: «que chega **em estado**» (Garrett c01) — el que la v1 ya había cazado
- y uno que **confirma** la regla en la misma línea: «chegava **no dia seguinte
  ao** Ramalhete» (*Os Maias* c15) — tiempo con `no`, destino con `ao`

Frente a eso, **238 casos** de `chegar a/ao/à + lugar`. Cero contraejemplos.

*Acento.* **La afirmación del ítem es exacta, y la verifiqué en el texto primario,
no en una paráfrasis.** AO90, Base IX, 4.º: «**É facultativo assinalar com acento
agudo as formas verbais de pretérito perfeito do indicativo, do tipo *amámos*,
*louvámos***». Y la oposición sigue viva de verdad, porque en PE no es sólo
gráfica: la tónica es [a] abierta en el pretérito frente a [ɐ] en el presente.
Así que «el acento es facultativo bajo el AO90, pero la oposición sigue viva» es
correcto en sus dos mitades. Corrección nº 8 de la v1: **aplicada y bien**.

Y el diseño de usar `chegámos` (forma que el alumno podría creer errónea) dentro
de una frase MAL, desactivando esa lectura falsa en la propia explicación, sigue
siendo lo más fino del lote después de GJ-08.

## GJ-12 · «Os miúdos obedecem os avós…» → **MANTENER** (ajuste menor)

**El veredicto es sólido.** Corpus: **26 casos** de `obedecer`/`desobedecer`,
**ninguno** con objeto directo. Todos con `a`/`ao`/`ás` («obedecer promptamente
**ao** curativo», Camilo; «obedecendo **ás** suspeitas da ama», íd.; «obedecendo
**ao** official de guarda», Eça), en dativo («**obedecer-lhe**, dê por onde der»;
«eu vivo para **vos obedecer**») o absolutos, sin complemento («O abbade
**obedeceu** com deleite»).

*Contraevidencia que alguien podría citar y que no prospera:* Priberam etiqueta
`obedecer` como «verbo **transitivo e intransitivo**», pero es su convención laxa
—no distingue directo de indirecto— y **todos** sus ejemplos llevan `a`: «o cão
treinado obedece **ao** dono», «obedecer **às** regras».

**Respuesta a la pregunta del encargo: sí, la afirmación se sostiene, pero está
contando media historia.** Es verdad que el español lleva *a* personal («obedecen
**a** los abuelos») y que la traducción literal da la forma correcta. Lo que falla
es la etiología que viene detrás:

> «El error viene de tratar "obedecer" como transitivo **por analogía con
> "respeitar" o "seguir"**, que sí lo son.»

Eso es una causa inventada, y hay dos mucho más probables que el texto omite:
(1) el **portugués de Brasil**, donde `obedecer` con objeto directo es corriente
—que es la causa que había propuesto la v1 y que la v2 cambió sin motivo—; y
(2) el alumno que **ya ha aprendido bien** que el portugués no tiene *a* personal
(«Vejo o meu pai», no «*Vejo ao meu pai») y por eso borra la *a* aquí. En ese
segundo caso el español **sí** alimenta el error, sólo que por hipercorrección y
no por calco — así que «empuja hacia la forma correcta» vale para el que traduce
a bulto y no para el que ha estudiado.

> **Sustituir:** «El error viene de tratar "obedecer" como transitivo por
> analogía con "respeitar" o "seguir", que sí lo son.»
> **Por:** «El error sale de suponer que "obedecer" lleva objeto directo, como en
> el portugués de Brasil — o de acordarse de que el portugués no tiene "a"
> personal ("Vejo o meu pai") y borrarla también aquí, donde no es personal sino
> régimen del verbo.»

## GJ-13 · «Repara na camisola nova dele…» → **CORREGIR** (menor; heredado a medias)

**Veredicto BIEN correcto** (`reparar em` = fijarse en, 40+ casos en la v1).

La v1 mandó quitar «significa arreglar, que es otro verbo entero». La v2 lo
suavizó pero **sigue sin ser verdad**:

> «Sin la preposición, "reparar" tiene otra acepción corriente —arreglar—, así
> que la preposición no es un adorno: **separa dos verbos**.»

**Priberam**, acepción **11** de `reparar`, listada entre las **transitivas**:
«**Notar; examinar; ver**». Sin preposición y con el sentido de 'darse cuenta'.
Y `reparar que` + oración = 'notar' está por todo el corpus: «**Reparei** então
**que** o meu amigo emmagrecera» (Eça, *A Cidade e as Serras* c02), «**reparou
que** lhe cahira uma luva» (*Amaro* c03). No son dos verbos: es **un** verbo cuyo
sentido lo selecciona el complemento.

> **Sustituir:** «…así que la preposición no es un adorno: separa dos verbos.»
> **Por:** «…así que con complemento nominal la preposición decide el sentido:
> "reparar **na** camisola" es fijarse; "reparar **a** camisola" es arreglarla.
> (Con oración completiva no hace falta: "Reparei **que** estava rota" también es
> 'me di cuenta'.)»

## GJ-14 · «Entrei na sala sem bater à porta…» → **CORREGIR (obligatorio)**

**La frase está bien** y los dos regímenes que enseña son buenos. El «nunca
entrar a» que la v1 mandó acotar desapareció: bien.

**Pero la frase que quedó es falsa, y la v1 no la había visto** (viene literal de
la v1, así que la levanto yo):

> «Dos regímenes en la misma frase, **los dos distintos del español**, que dice
> "entrar a/en" y "llamar a la puerta".»

Las dos mitades fallan:

1. **`entrar em` no es distinto del español** peninsular, que dice «entrar **en**
   la sala» — idéntico. El propio texto escribe «entrar a/**en**» y acto seguido
   lo llama distinto: se contradice en la misma línea. Sí es distinto del español
   americano («entrar **a** la sala»), que es el que hablan los alumnos de este
   curso — y eso es lo que habría que decir.
2. **`bater à porta` tampoco contrasta en el régimen**: el español dice «llamar
   **a** la puerta», con la misma preposición `a`. Lo que cambia es el verbo
   (`bater` / *llamar*) y la contracción con el artículo, no la rección.

> **Sustituir:** «Dos regímenes en la misma frase, los dos distintos del español,
> que dice "entrar a/en" y "llamar a la puerta".»
> **Por:** «"Entrar **em**" es como el "entrar **en**" de España, pero choca con
> el "entrar **a**" de América, que es el que te va a salir solo. Y en "bater
> **à** porta" la preposición es la misma del español ("llamar **a** la puerta");
> lo que cambia es el verbo y la contracción con el artículo.»

*DISCUTIBLE, terminología:* «con **crase**». Ciberdúvidas: «Na terminologia
gramatical **brasileira**, o termo *crase* é usado… para designar "contração da
preposição *a* com o artigo *a*"». La metalengua europea es **contração** (y
*acento grave* para la tilde); además, en rigor la crase es el fenómeno fonético,
no el signo. En un curso cuyo eje es PT-PT, la metalengua también debería serlo.

## GJ-15 · «Quando eu chegar em casa esta noite…» → **RETIRAR** (por redundancia)

**Lingüísticamente el ítem es correcto en todo.** `chegar a casa` sin artículo,
×6 en el corpus («Quando **cheguei a casa**, já na dos meus visinhos remediados
não havia luz», Junqueiro). La ênclise `ligo-te` en la principal tras subordinada
antepuesta es la norma europea: 33 casos («Quando o carvoeiro **chegou a casa**,
**contou-lhe** logo o que lhe tinha acontecido», Junqueiro; «Quando Emma saiu da
sua mudez sublime, **recostou-se** sobre o meu hombro», *Contos Phantásticos*).
`para combinarmos`, infinitivo pessoal: correcto.

**Lo que no se sostiene es que ocupe una plaza.** Tres razones acumuladas:

1. **Enseña exactamente el mismo régimen que GJ-11** — mismo lema, misma
   preposición, mismo error. Son 2 de las 8 únicas plazas MAL gastadas en una
   sola rección, en un lote que existe para cubrir un punto entero.
2. **No es material nuevo: ya está publicado, dos veces.** En
   `lib/data/languages/pt/blocks/b10.json` hay un ítem de *repair* explícito
   —«¿Repone la regência europea "cheguei em casa" → "cheguei a casa"?»— y una
   pareja de mediación PT-PT/PT-BR cuya mitad europea es «Quando **chegar a casa
   ligo-te** do telemóvel» contra la brasileña «Quando chegar em casa te ligo do
   celular». La frase de GJ-15 es esa pareja con las palabras movidas. Y
   `b7.json` trae «Ao eu chegar em casa, vou te ligar». El preflight vio la
   sombra (0,445 / 0,351 / 0,35) y la pasó como «aviso que no bloquea».
3. **Defecto mecánico:** la explicación abre con «Mismo régimen que **el
   anterior**». El anterior en el documento es GJ-14 («Entrei na sala»), no
   GJ-11; y en la app los ítems no se sirven necesariamente en este orden. La
   referencia cruzada está rota tal como está escrita.

**Respuesta a la pregunta del encargo: es redundancia, no repetición útil.** El
único ingrediente que GJ-15 añade sobre GJ-11 —el futuro do conjuntivo— ya lo
cubre GJ-05 en el mismo lote. Sustitúyase por otra rección de `b11-regencias` sin
cubrir.

## GJ-16 · «Casou-se com uma arquiteta…» → **CORREGIR (obligatorio, heredado)**

`arquitecta` → `arquiteta`: **aplicado**. Era el bloqueante nº 2 de la v1 y está
resuelto. (Sigue pendiente la deuda aparte que la v1 detectó en `b5.json`, con
tres `arquitecta` y ~15 `director`; no es de este lote.)

**Pero la contradicción interna sigue en pie.** GJ-16 le dice al alumno que
«se casou» está mal por ser «próclise **sin atractor que la justifique**» —
mientras **en el mismo lote** GJ-05 le presenta como BIEN «Hei de **te** contar»,
que es próclisis y no tiene atractor ninguno. Un alumno que compare los dos
ítems concluye que la regla es falsa. Corrección de la v1 nº 9, no aplicada.

> **Añadir a GJ-16:** «Ojo con no aplicar esto de más: en las perífrasis (como
> "Hei de te contar") el clítico puede ir delante del infinitivo sin ningún
> atractor. La regla del atractor manda sobre el verbo finito **simple**, que es
> el caso de "casou".»

*Nit sin consecuencia, ya dicho en la v1:* el PE prefiere de largo `casar com`
sin pronombre (corpus ~25 a 2). El ítem **necesita** el clítico para que exista
la trampa, así que no propongo cambiarlo; sólo que la explicación no se lea como
«la forma europea es casar-se com».

---

# Lo que hay que cambiar sí o sí antes de publicar

**Bloqueantes (el ítem no puede salir así):**

1. **GJ-07 — retirar, o reescribir la explicación entera.** Condena una cadena
   que Ciberdúvidas declara «correta… pertence ao português em geral» y que el
   corpus del curso usa 25 veces. Es la misma clase de fallo que tumbó la v1.
2. **GJ-06 — «gerundio que aquí no cabe».** Cabe: 48 casos de `ficar` + gerundio
   en Eça y Camilo. *Corrección obligatoria de la v1 (nº 4) no aplicada.*
3. **GJ-01 — dos frases falsas.** La causa está del revés (el español coloca
   **igual** bajo negación: «no me dijo nada»), y el absoluto no vale para el
   infinitivo (Ciberdúvidas: «é lícita a próclise ou a ênclise»).
4. **GJ-16 — falta la salvedad de la perífrasis**, así que contradice a GJ-05
   dentro del mismo lote. *Corrección obligatoria de la v1 (nº 9) no aplicada.*
5. **GJ-14 — «los dos distintos del español» es falso** en sus dos mitades, y el
   texto se contradice en la misma línea al escribir «entrar a/**en**».

**Obligatorios menores (quitar lo que no es verdad):**

6. **GJ-05** — acotar «obligatorio tras "quando"» a la subordinada temporal.
   *Corrección de la v1 (nº 10) no aplicada.*
7. **GJ-10** — el contraste `por`/`para` está en la casilla equivocada; la
   oposición europea real es `a` vs `para` en el destinatario.
8. **GJ-13** — Priberam da `reparar` transitivo = 'notar' (ac. 11): no son «dos
   verbos». *Corrección de la v1 (nº 5) aplicada a medias.*
9. **GJ-12** — sustituir la causa inventada («por analogía con respeitar o
   seguir») por las dos reales (uso brasileño / borrado de la *a* personal).
10. **GJ-15** — sustituir por otra rección: duplica GJ-11 y reproduce material ya
    publicado en `b10.json`. Y arreglar «el anterior», que apunta a GJ-14.

**Menores sin bloqueo:** GJ-02 acotar a «el español **estándar**»; GJ-03 quitar
«perífrasis con normalmente»; GJ-04 blindar el absoluto con el caso marginal del
futuro; GJ-14 cambiar «crase» por «contração» (metalengua europea).

**Consecuencia de planificación:** si caen GJ-07 y GJ-15 quedan **14 ítems, 6 MAL
/ 8 BIEN**, y hay que reponer **2 MAL** — uno de `b11-aspecto-tempo` y uno de
`b11-regencias` que **no** sea `chegar a`.

*Fuera de mi ángulo pero visible:* la tabla del encabezado no cuadra.
`b11-regencias` con 10 antes y **7 ítems** en la sección B da 17, no los 12 que
dice la columna «tras el lote».

---

# Qué está bien (específico)

No es cortesía: es lo que no hay que tocar.

- **La v2 resolvió el problema por el que existía.** 7 de 8 veredictos MAL
  aguantan la verificación, contra 3 de 8 en la v1. Y los tres que verifiqué más
  a fondo —GJ-01, GJ-09, GJ-11— no sólo aguantan: aguantan **con cero
  contraejemplos** en 4,27 M de caracteres, después de leer entero cada candidato.
- **GJ-11 es el ítem mejor construido del lote.** Veredicto exacto, corpus
  unánime (238 a 0), la nota del AO90 literalmente correcta contra el texto
  primario, y el truco de usar `chegámos` dentro de la frase condenada para
  desactivar de antemano una lectura falsa.
- **GJ-08** sigue siendo el modelo de redacción: veredicto correcto, explicación
  verdadera y un absoluto desactivado a propósito por el propio texto.
- **GJ-02 y GJ-09 están redactados con el cuidado que faltaba.** GJ-02 dice «la
  prótasis de una condición hipotética» —y esa acotación es justo lo que lo salva
  de «não sei se eu seria capaz»—; GJ-09 apoya el juicio en un contraste que ya
  está dentro de la propia frase («como se fosse»). Son ítems que se defienden
  solos.
- **Los MAL nuevos no se detectan por el ojo.** Verifiqué que ninguno contiene
  una palabra visiblemente española: los errores son de rección, de modo y de
  colocación. Los cinco sustitutos evitaron de verdad la clase que falló en la
  v1 — condenar una variante que el propio corpus practica — **en cuatro de los
  cinco casos**. El que se escapó es GJ-07.
