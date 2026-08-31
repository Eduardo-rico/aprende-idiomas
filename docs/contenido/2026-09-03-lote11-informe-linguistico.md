# Lote 11 — C1 «se aprende ELECCIÓN» · dictamen **LINGÜÍSTICO** (ángulo #1, ronda 1)

Fuente: `docs/contenido/2026-09-02-lote11-c1-eleccion.md`. Los 24 juicios, uno
por uno, más la metadata.

---

## Método (lo que hice antes de opinar)

**Corpus.** Aplané los 224 ficheros de `lib/data/languages/pt/lecturas/` a texto
plano con autor y capítulo en cada línea: **19 008 párrafos, 4 272 301
caracteres** (Camilo, Eça, Garrett, Teófilo Braga, Junqueiro). Trabajé sobre
**mi propia copia** (`corpus-ling11.txt`) porque el `corpus.txt` del scratchpad
lo reescribió otro proceso en mitad de la sesión: si esto se repite, cualquier
cita puede quedar apuntando a un fichero que ya no existe.

**Búsqueda por lema y con grafía del XIX.** Todas las búsquedas van por lema
(todas las personas y tiempos) y con las variantes decimonónicas del corpus
(`elle/ella/elles`, `sahir`, `escripto`, `emquanto`, `phantastico`, `n'um`,
`d'aquelle`, `-ámos`). Dos ejemplos de por qué: el primer barrido de
`antes de que` devolvió **dos hits falsos** que eran el corte de
«dardej**antes de que**» y «vacill**antes de que**»; y el conteo de
«dezanove» sólo se entiende al ver que el corpus escribe **«dezenove» seis
veces y «dezanove» una** — grafía vieja, no brasileña.

**Ningún grep vale sin leer el párrafo entero.** Cada cita de este informe está
leída en su párrafo completo; cuando el candidato no sobrevivió a la lectura, lo
digo.

**Fuentes externas consultadas una a una** (no de memoria), con URL, autor y
fecha: Ciberdúvidas × 6 (`antes de que`, uso obligatorio del infinitivo
flexionado, infinitivo flexionado / tendencias, infinitivo pessoal,
`estar`/`ficar` locativos, `cedo demais`) y Priberam × 3 (`doente`, `dezanove`,
`baixa`).

**Catálogo publicado.** Consulté los 2 431 ejercicios de
`lib/data/languages/pt/blocks/*.json` con script, no de oído: **146 juicios de
gramaticalidad publicados**, con su `register`, su `address` y su veredicto.
Dos de ellos deciden ítems de este lote.

**Aviso metodológico.** Las búsquedas web *genéricas* sobre `estar` + gentilicio
y sobre «é doente desde» devolvieron respuestas redactadas por el buscador con
ejemplos inventados («Ele é doente desde ontem», «"estou português" é
gramaticalmente correto»). **No las uso como evidencia y recomiendo que nadie
las use**: son exactamente la clase de falso positivo contra la que existe la
barra de retirada. Todo lo que cito abajo es corpus leído, diccionario o
consultorio con firma y fecha.

---

## Veredicto global

# PUBLICA-CON-CORRECCIONES

**Bloqueantes: 7** (1 frase que muere + 5 explicaciones que no pueden
publicarse como están + 1 bloque de metadata que falta entero).

Ningún veredicto MAL de los doce cae por condenar una forma atestiguada —
**salvo uno**, GJ-18, y cae por la razón exacta que el encargo sospechaba. Los
otros once aguantan la verificación con corpus y con fuente externa. El fallo se
ha mudado, como en el lote 10 v2, a las **explicaciones**: cinco dicen cosas
falsas, y dos de ellas enseñan justo lo contrario de lo que el lote castiga en
otros ítems.

| veredicto | ítems | n |
|---|---|---:|
| **MUERE** (la frase, no la explicación) | GJ-18 | **1** |
| **CORRIGE-ASÍ** (bloqueante: la explicación no puede salir así) | GJ-02, GJ-03, GJ-12, GJ-15, GJ-17 | **5** |
| **CORRIGE-ASÍ** (menor) | GJ-04, GJ-09, GJ-21, GJ-22 | **4** |
| **PASA** (con nit, sin bloqueo) | GJ-06, GJ-16 | **2** |
| **PASA** | GJ-01, GJ-05, GJ-07, GJ-08, GJ-10, GJ-11, GJ-13, GJ-14, GJ-19, GJ-20, GJ-23, GJ-24 | **12** |

---

# A · `b11-alternancia-infinitivo`

**La regla del punto, verificada primero.** Ciberdúvidas, *Uso obrigatório do
infinitivo flexionado* (Carlos Rocha, 23 de março de 2006), resumiendo a Cunha &
Cintra, *Nova Gramática do Português Contemporâneo*, págs. 482-486: el
infinitivo flexionado **«usa-se quando o sujeito está claramente expresso»**, y
el ejemplo que da es de Vergílio Ferreira — «Mas o curioso é **tu não
perceberes** que não houve nunca "ilusão" alguma» —, con el juicio explícito de
que sin flexión **«há erro gramatical»**.

**Y el matiz honesto, que también verifiqué:** la respuesta más antigua del mismo
consultorio (*Infinitivo flexionado*, Teresa Álvares, 1 de março de 1997) avisa
de que en esta materia «não há regras rígidas, mas **tendências**», y que pesan
factores estilísticos. Mirado de cerca, no toca a este lote: la primera de las
tres tendencias que lista es exactamente **«quando o sujeito está claramente
expresso»**, con el ejemplo «É estranho **tu não entenderes** o que ele diz» —
un predicado impersonal con sujeto expreso y flexión, que es el molde de GJ-03 y
GJ-06—, y el margen estilístico que describe está en los casos **sin** sujeto
expreso, que no son los que el lote condena.

El corpus va en la misma dirección y sin una sola excepción, **contando
candidatos y supervivientes**:

- *A favor de la flexión:* **9 candidatos, 6 supervivientes** tras leer el
  párrafo entero — «para **as abelhas tocarem** os nectarios» (Junqueiro), «para
  **aquelles cavalheiros abancarem**» (Eça, *Os Maias*), «sem **as lagrimas
  poderem** rebentar» (Camilo), «por **todos terem** nascido da mesma colher»,
  «provinha de **elles não terem** onde se lavar» (Eça), «para **elles mesmos
  acharem** o caminho». Los tres caídos: «para os que soffrem» (relativa con
  verbo finito), «para as engastarem» (clítico, no sujeto) y «por elles por
  serem» (el pronombre está fuera de la infinitiva).
- *Control negativo —sujeto pleno con infinitivo sin flexionar—:* **32
  candidatos, 0 supervivientes.** Treinta y uno son clíticos proclíticos («para
  os melhorar», «sem as definir», «para as fazer viver», «sem os comprehender»),
  y el treinta y dos es «se para **ellas houver** algum Pindaro» (Garrett), que
  es futuro do conjuntivo de otra oración. Ni un solo caso.

Sobre esa base:

## GJ-01 · «Para os miúdos perceber…» → **PASA**

Veredicto correcto y bien apoyado: sujeto expreso («os miúdos») ⇒ flexión
obligatoria ⇒ «perceberem». El *repair* es mínimo (una palabra) y la explicación
no dice nada falso.

Único apunte sin consecuencia: la frase es EP hasta la médula («os miúdos», «o
exercício»), y no hay ninguna palabra visiblemente española que delate el MAL.

## GJ-02 · «Antes de saírem de casa, verifiquem…» → **CORRIGE-ASÍ** (bloqueante)

El **veredicto BIEN aguanta**: «saírem» es infinitivo pessoal de 3.ª plural con
el sujeto recuperable de «verifiquem», y la concordancia interna del ítem es
impecable.

**Pero la contrastiva con el español es falsa.**

> «El español resolvería con subjuntivo («antes de que salgan») y aquí no hace
> falta conjunción ninguna.»

Aquí el sujeto de la subordinada y el del imperativo son **el mismo**, y con
sujeto único el español **también usa infinitivo**: «Antes de **salir** de casa,
comprueben si han cerrado bien la llave del gas». Nadie dice «antes de que
salgan» en esa frase. Es la misma falla que el lote 10 v2 tuvo que arreglar en
su GJ-01 —atribuirle al español un comportamiento distinto justo donde coincide—
y aquí además desactiva la única lección contrastiva del ítem.

> **Sustituir la última frase por:** «El español hace lo mismo mientras el
> sujeto no cambie —"antes de salir de casa"—, pero no puede marcar de quién se
> habla: el portugués lo marca en el propio infinitivo ("saírem" = ustedes,
> "saíres" = tú), y por eso puede prescindir de la conjunción incluso cuando el
> sujeto cambia.»

## GJ-03 · «…até a chuva passar de vez.» → **CORRIGE-ASÍ** (bloqueante)

Era la primera sospecha del encargo. **Confirmada: la explicación describe mal
lo que pasa, y describe mal justo la regla que el lote castiga cuatro veces.**

> «Y "até a chuva passar" lleva **infinitivo simple** porque su sujeto ("a
> chuva") es de 3.ª singular y no marca desinencia.»

La frase se contradice a sí misma: si tiene sujeto, **no es infinitivo simple**.
Con sujeto propio expreso la flexión es obligatoria (Cunha & Cintra, arriba), y
lo que ocurre es que **la 3.ª del singular del infinitivo pessoal es igual que
la del impessoal** — desinencia cero. Es infinitivo pessoal con forma
sincrética, no infinitivo simple.

**Y el lote ya lo dice bien en otro sitio.** GJ-04, sobre la construcción
idéntica: «"Para o senhor assinar" es infinitivo pessoal con sujeto expreso de
3.ª singular, **donde la flexión coincide con el infinitivo simple**». Los dos
ítems no pueden publicarse a la vez: uno de los dos enseña al alumno que un
sujeto delante **no** obliga a flexionar, que es literalmente el error de
GJ-01, GJ-05, GJ-08 y GJ-11.

> **Sustituir la segunda frase de la explicación por:** «Y "até a chuva passar"
> es **también** infinitivo pessoal: tiene sujeto propio ("a chuva"), sólo que
> la 3.ª del singular no lleva desinencia y por eso la flexión no se ve. Se ve
> en cuanto el sujeto es plural: "até **as chuvas passarem**".»

*Nota de redundancia, no bloqueante.* El núcleo de GJ-03 —«É melhor» +
infinitivo pessoal de `nós`— ya está publicado en `b2c2-gj-l3-08`: **«É melhor
irmos embora antes da chuva.»** (BIEN), que además comparte la palabra *chuva*.
El preflight no lo cazó porque el par se queda a un pelo del umbral 0,34. Si se
quiere separar sin tocar la enseñanza: **«Mais vale esperarmos aqui dentro até a
chuva passar de vez.»**

## GJ-04 · «…para o senhor os assinar…» → **CORRIGE-ASÍ** (menor)

Veredicto BIEN correcto, y el análisis del infinitivo es el bueno del lote (ver
GJ-03). El corpus respalda la colocación con **sujeto intercalado**, que es lo
raro de la frase: **14 casos**, de los que leí en su párrafo los nueve que el
barrido con ventana ancha devuelve, y los nueve son lo que parecen — «bata por
dentro **para eu lhe abrir** a porta» (Camilo, *Amor de Perdição* c10 §50);
«corri a buscar o meu casaco de borracha, **para ella se abrigar** se a chuva
viesse» (Eça, *A Cidade e as Serras* c13 §63); «trabalhei á luz do sol homicida
**para elle se resguardar** do clima» (Camilo, *Amor de Perdição* c18 §35); «me
mandou chamar **para eu a tratar**» (Eça, *Os Maias* c12 §61); «estendeu os
braços ao Baptista **para elle lhe vestir** um casaco leve» (íd. c14 §223).

**El problema es la causa que se le atribuye.**

> «Y el clítico va proclítico **por estar dentro de la subordinada**.»

Estar dentro de una subordinada no es, por sí, un disparador de próclise: lo son
los atractores (negación, interrogativos, conjunción subordinante…), y aquí no
hay ninguno. Lo que hay es una infinitiva regida por preposición, donde la
próclise es lo normal **pero la ênclise también es correcta**: contando sólo los
clíticos que no pueden confundirse con un artículo (`lhe, lhes, me, te, se,
nos`), el corpus da **404 próclisis contra 31 ênclisis** («para perguntar-lhe»,
«para entregar-lhe», «para trazer-nos», «até perder-se»…). Dicho como está, el
ítem contradice además el material del lote 10 v2, que ya tuvo que abrir esta
misma salvedad.

> **Sustituir la última frase por:** «Y el clítico va delante porque en las
> infinitivas regidas por preposición la próclise es la colocación normal en
> portugués europeo (en el corpus del curso, 404 a 31). "Para o senhor
> assiná-los" también es correcto: aquí no hay atractor que obligue.»

## GJ-05 · «Depois de eles saiu do escritório…» → **PASA**

Correcto, y el *repair* es de una palabra. `ficámos` con acento agudo es marca
europea impecable.

Un apunte de calidad, no de lengua: éste es el MAL **menos fino** del punto,
porque «eles saiu» falla la concordancia de número en cualquier análisis y se ve
sin saber nada de infinitivo pessoal. La explicación lo admite a medias («el
error se oye poco pero se lee enseguida»). No bloquea.

## GJ-06 · «É preciso que fazermos…» → **PASA** (con un nit)

Era la segunda sospecha del encargo. **Verificada: las dos construcciones que el
ítem declara buenas lo son, y la mezcla no está atestiguada.**

- «é preciso **fazermos**»: predicado impersonal + infinitivo flexionado sin
  conjunción. Ciberdúvidas lo ejemplifica con «**É estranho tu não entenderes**
  o que ele diz» (Teresa Álvares, 1997); el corpus lo trae con otro predicado
  impersonal — «Então **era necessario ficarem** lá, fazer as peregrinações
  classicas…» (Eça, *Os Maias* c08 §16) —; y el catálogo ya lo publica como BIEN
  en `b2c2-gj-l3-08` («É melhor irmos embora antes da chuva»).
- «é preciso **que façamos**»: 4 párrafos con «é/era preciso que» + conjuntivo.
- La mezcla «que + infinitivo flexionado»: **0** casos en 4,27 M de caracteres.

*Nit sin bloqueo:* la coleta «tarde **de mais**» viaja también en el *repair*, o
sea que se publica como modelo correcto. Es defendible —la grafía separada viene
del Acordo de 1945 y del *Tratado* de Rebelo Gonçalves—, pero Ciberdúvidas (*O
uso de «demais»: «cedo demais»*, Carlos Rocha, 7 de março de 2023) declara hoy
**«demais» «correto e preferível»** como unidad adverbial. Si se quiere el
modelo menos discutible: «antes que seja tarde **demais**». Y para que conste,
la forma junta está en el propio corpus europeo: «…tanto tanto... **é demais**!»
(Garrett, *Viagens na Minha Terra* c24 §19).

## GJ-07 · «Depois de eu ter falado com ela…» → **PASA**

Correcto y bien explicado. Aquí sí cambia el sujeto («eu» vs «tudo»), así que la
contrastiva con «después de que yo hablara» es legítima — al revés que en GJ-02,
donde no lo era. «ao telefone» es marca europea.

## GJ-08 · «Sem eles saber o que se passou…» → **PASA**

Correcto. Con la puntuación que trae, la única lectura posible es la infinitiva
(la salida «Sem eles, saber o que se passou é difícil» exigiría la coma después
de «eles», que no está). «pedir-lhes» con ênclise tras «é difícil» es la
colocación correcta.

## GJ-09 · «Convém que a proposta seja entregue…» → **CORRIGE-ASÍ** (menor)

Veredicto BIEN correcto. Sólo hay que blindar una frase para que no se lea como
un absoluto:

> «Aquí el infinitivo pessoal no cabe porque hay conjunción.»

Es verdad **de esta frase**, pero no del verbo: con un predicado impersonal el
infinitivo pessoal cabe perfectamente —«Então **era necessario ficarem** lá»
(Eça, *Os Maias* c08 §16), «**É estranho tu não entenderes** o que ele diz»
(Ciberdúvidas, 1997)—. Lo que no cabe es *detrás de «que»*.

> **Añadir:** «Ojo: es "detrás de *que*" donde no cabe. Sin conjunción, el mismo
> verbo lo admite: "Convém a proposta ser entregue antes de sexta-feira".»

## GJ-10 · «Antes de que saíres de casa…» → **PASA**

Era la tercera sospecha del encargo —«¿está atestado en portugués antiguo o
literario?»—. **No lo está, y la autoridad es explícita.**

- **Corpus: 0 casos** de `antes de que` en 4,27 M de caracteres. Los dos hits
  del primer barrido eran cortes de palabra («dardej-antes de que…»,
  «vacill-antes de que…»), leídos y descartados. Tampoco hay `depois de que`.
  Enfrente: **19** «antes que» + conjuntivo («Trinta annos, antes que **seja**
  bello!» — Eça, *A Cidade e as Serras* c09 §148; «antes que a borrasca
  **rebentasse** de chofre» — Teófilo Braga, *As azas brancas* §74) y **67**
  «antes de» + infinitivo.
- **Ciberdúvidas, *«Antes que» vs. «antes de»* (Carlos Rocha, 9 de junho de
  2006):** «**Não é, pois, possível escrever "antes de que"**.»

El *repair* es además el mínimo posible: se borra «que» y lo que queda —«Antes
de saíres de casa»— ya es portugués correcto, con «saíres» reinterpretado como
infinitivo pessoal de 2.ª singular, que concuerda con el «deixa» de tuteo.

## GJ-11 · «Sem os miúdos souberem de nada…» → **PASA**

Era la cuarta sospecha: **«¿es inequívoco que tras "sem" no cabe el futuro do
conjuntivo?» Sí, y por una razón categorial, no de frecuencia.**

`sem` es **preposición**, no conjunción: no encabeza oraciones con verbo finito.
Para eso el portugués tiene `sem que` + conjuntivo, que el corpus trae **36**
veces. La contraparte finita de esta frase sería «sem que os miúdos
**soubessem** de nada». Y «souberem» **sólo puede ser** futuro do conjuntivo:
el tema irregular *soube-* lo separa sin ambigüedad del infinitivo pessoal
*saberem* — por eso el par funciona con `saber` y no funcionaría con un verbo
regular, donde las dos formas son homófonas. Es el ítem más fino del punto y
está bien construido.

## GJ-12 · «Ao chegarmos ao cimo da serra…» → **CORRIGE-ASÍ** (bloqueante)

Veredicto BIEN correcto. **La explicación tiene dos frases falsas, una de ellas
un absoluto de los que ya han caído catorce veces en este proyecto.**

> «El español lo diría con **gerundio** ("al llegar" o "llegando"), y el
> portugués aquí **no admite ninguno de los dos**.»

1. **«Al llegar» no es un gerundio**: es «a» + infinitivo. El gerundio español
   es «llegando». Meterlos en el mismo saco delante de un alumno C1 —que está
   aprendiendo precisamente a distinguir formas no personales— es caro.
2. **El portugués admite los dos.** «Ao chegar ao cimo da serra» (infinitivo sin
   flexionar) es normal: con una lista cerrada de 30 verbos —o sea, una cota
   inferior— el corpus da **186** «ao + infinitivo» sin flexionar («ao passar»
   31, «ao entrar» 23, «ao sahir» 15, «ao chegar» 11) frente a **15**
   flexionados, entre ellos la estructura exacta del ítem: «**Ao sahirmos**»,
   «**Ao penetrarmos**», «**Ao passarem**», «ao verem». Los dos
   comportamientos están vivos, y el ítem elige uno. Y el gerundio adjunto
   inicial también existe en portugués
   europeo, con la misma estructura de la frase del ítem: «**Voltando** para o
   Ramalhete, era esta a unica idéa que elle sentia…» (Eça, *Os Maias* c11
   §127); «**Olhando** atravez d'esse muro, a pequerrucha viu uma sala…»
   (Junqueiro, *A rapariguinha e os phosphoros* §6); «**Vendo** este triste
   espectaculo, o malmequer não pôde…» (Junqueiro, *O malmequer* §24);
   «**Voltando** ás escuras, com os braços estendidos…» (Camilo, *Amor de
   Perdição*, Conclusão §64).

Lo que sí es verdad —y es lo que el ítem quiere enseñar— es que la **flexión**
de «chegarmos» hace explícito el sujeto, cosa que ni «ao chegar» ni el gerundio
hacen.

> **Sustituir la explicación entera por:** «"Ao + infinitivo pessoal" para la
> simultaneidad, con la flexión de "nós": "chegarmos" dice **quién** llega sin
> necesidad de sujeto expreso. "Ao chegar" también es correcto —el portugués usa
> mucho el infinitivo sin flexionar tras "ao"—, pero deja el sujeto sin marcar.
> El español no tiene esa opción: "al llegar" (a + infinitivo) es siempre
> ambiguo y hay que deducir el sujeto del contexto.»

---

# B · `b11-ser-estar-divergente`

**Un aviso sobre la premisa del punto, antes de los ítems.** La cabecera dice
que «el portugués y el español **no reparten igual**», y los tres ítems que más
peso llevan (GJ-14, GJ-20, GJ-23: eventos con SER) son justamente casos donde el
español hace **lo mismo** — «la reunión **es** a las tres», «el concierto **es**
en el Coliseo», «la fiesta **es** el domingo». La propia explicación de GJ-14 lo
reconoce a medias («El español usa "es" para la hora»). No es un error de lengua
y no bloquea, pero el punto se apoya menos en la divergencia de lo que su
cabecera promete: la divergencia real del bloque está en **`ficar`** (GJ-15), y
ahí la explicación es la que hay que arreglar.

## GJ-13 · «O jantar de despedida é no restaurante do costume…» → **PASA**

Correcto. El evento va con SER, y el contraste que la explicación pone («o
jantar está na mesa») es el bueno. «lá para as oito» es europeo y natural.
Corpus: «**O enterro foi** ao outro dia, á uma hora» (Eça, *Os Maias* c17 §402).

## GJ-14 · «A reunião … está às três da tarde…» → **PASA**

Correcto. Busqué la construcción condenada por lema —evento + `estar` en
cualquier tiempo— y el corpus da **0**: ni «a festa está», ni «o baile está», ni
«a reunião está», ni «o concerto está», ni «o casamento está», con `está`,
`estava`, `esteve` o `estará`. Lo que sí aparece es el evento con SER.

## GJ-15 · «A biblioteca fica ao fundo da rua…» → **CORRIGE-ASÍ** (bloqueante)

Era la quinta sospecha del encargo, y es la que más consecuencias tiene.
**El veredicto BIEN aguanta; la explicación es falsa.**

> «La localización de un edificio va con **ficar** en portugués europeo, **más
> que con "ser" o "estar"**. El español no tiene ese verbo en ese uso y por eso
> el hablante nunca lo produce solo.»

- **`estar` no es "menos frecuente": es intercambiable.** Ciberdúvidas, *O valor
  dos verbos «estar» e «ficar»* (Miguel Moiteiro Marques, 8 de março de 2012):
  «**O único caso em que podemos usar alternadamente os verbos "estar" e "ficar"
  é para localizar edifícios e localidades no espaço**», con los dos ejemplos
  dados como equivalentes: «O hospital **está** ao lado do hotel» / «O hospital
  **fica** ao lado do hotel». Es decir: el consultorio elige exactamente el caso
  de este ítem para decir lo contrario de lo que el ítem dice.
- **`ser` tampoco está fuera.** Corpus, leídos enteros: «**O quarto do pequeno
  era ao fundo do corredor.**» (Eça, *Os Maias* c12 §207) — la misma estructura
  literal, «ser» + «ao fundo de»; «**A casa era na rua das Sousas**, d'um andar,
  muito velha…» (Eça, *O Crime do Padre Amaro* c08 §64); «**O n.º 3 era no fundo
  do corredor.**» (Eça, *Singularidades de uma Rapariga Loura* §23); «**Onde é a
  porta do paraiso?**» (Eça, *Amaro* c11 §87); «era na rua dos Francos» (Teófilo
  Braga, *Beijos por facadas* §16).
- **Y el propio catálogo lo publica como BIEN.** `b2c2-gj-l5-19`: **«A morada
  dela é na Rua Augusta.»**, `verdict: true`. Publicar GJ-15 con esta
  explicación pone al curso a contradecirse a sí mismo.

> **Sustituir la explicación entera por:** «Para situar edificios y sitios, el
> portugués europeo prefiere **ficar**: es la opción por defecto y la que el
> hispanohablante nunca produce solo, porque su lengua no tiene ese verbo en
> este uso. No es que las otras estén mal —"A biblioteca **está** ao fundo da
> rua" es igual de correcta, y con "ser" también se localiza ("A morada dela
> **é** na Rua Augusta")—: lo que se aprende aquí es a **elegir "ficar"**, que
> es lo que suena a portugués.»

*Nota de redundancia, no bloqueante:* `ficar` + localización ya está en el
catálogo dos veces (`b2c2-gj-l2-11` «Minha casa fica perto do centro», MAL por
el artículo; `37b772b1` «O ___ fica na esquina da rua», que el preflight ya
señaló a 0,349). Como BIEN, GJ-15 no obliga al alumno a **elegir** nada: le
enseña una frase correcta con «fica». La corrección de arriba es lo que lo
convierte en un ítem de este punto y no de B1.

## GJ-16 · «A porta esteve aberta a noite toda…» → **PASA** (con un nit)

Correcto: estado resultante con ESTAR y pretérito perfeito por periodo cerrado.
Que coincida con el español es una virtud declarada, y la comparto.

*Nit:* el corpus prefiere de largo **«toda a noite» (29)** a **«a noite toda»
(2)**, pero las dos están atestiguadas y las dos son europeas — «assim
permaneceu **a noite toda**, até que ao outro dia deram com elle regelado»
(Teófilo Braga, *A adega de Funck* §137); «orou **a noite toda** ante o retabulo
de Santa Maria d'Atocha» (íd., *Beijos por facadas* §19). No toco el ítem: el
orden pospuesto es el que enfatiza la duración, que es lo que la frase quiere.

## GJ-17 · «Estou português…» → **CORRIGE-ASÍ** (bloqueante)

Era la sexta sospecha: **¿hay algún uso vivo o dialectal de `estar` +
nacionalidad?** No lo encontré: **0** casos de `estar` (en cualquier persona y
tiempo) + gentilicio en 4,27 M de caracteres, y ninguna fuente que lo autorice.
**El veredicto MAL aguanta.**

**Pero el absoluto no puede publicarse.**

> «Nacionalidad con SER, **sin excepción**, por muy temporal que sea la
> situación.»

`estar` **coacciona** predicados normalmente permanentes hacia una lectura
transitoria, y el corpus lo hace continuamente: «**Estou muito velho**, Zé
Fernandes…» (Eça, *A Cidade e as Serras* c14 §44); «**Está fria** a tua mão
hoje! E hontem tam quente estava!» (Garrett, *Viagens* c24 §19); «Balthazar
Coutinho **estava senhor** do segredo de Thereza» (Camilo, *Gracejos que
Matam*). Con un gentilicio ese mecanismo produce lecturas de *comportamiento*,
no de nacionalidad («hoje estás muito português» = te estás portando como…), y
un alumno C1 se topará con ellas. El ítem no las excluye, y basta con acotarlo.

> **Sustituir la primera frase por:** «La **nacionalidad** va con SER, por muy
> temporal que sea la situación: "sou português" aunque vivas fuera desde los
> dieciocho. (Lo que sí existe con "estar" es otra cosa: un juicio sobre cómo te
> comportas hoy —"hoje estás muito português"—, que no dice de dónde eres.)»

## GJ-18 · «O António é doente desde a semana passada…» → **MUERE**

Era la séptima sospecha del encargo, y **es la única del lote que se lleva un
ítem por delante.** La frase, no la explicación.

El ítem se apoya entero en esta premisa:

> «La frase lo delata sola: "desde a semana passada" es un estado, no una
> definición.»

**Es falsa: `ser` admite `desde` sin ningún problema.** Corpus, leídos enteros:

- «**Era orfão desde 1832.** Aos vinte annos emancipara-se…» (Camilo, *Novelas
  do Minho / Gracejos que Matam* §36) — `ser` + adjetivo + `desde` + fecha, la
  estructura exacta que el ítem declara imposible.
- «Aborrecia-o, porque **era irrisorio desde o duello**…» (íd. §193).
- «De como o A. d'este livro **foi jacobino desde pequeno**» (Garrett, *Viagens*
  c09, sumario del capítulo).

Y «ser doente» es un predicado vivo, como el propio ítem reconoce: «--**Mas a
mamã não é doente?** --Oh, não! Madame era muito forte» (Eça, *Os Maias* c09
§102-103), donde el contraste con «forte» deja clarísimo que es la persona
enfermiza, no el estado de hoy.

Juntando las dos cosas: «O António **é** doente desde a semana passada» tiene
una lectura legítima —*es un enfermo crónico y lo es desde la semana pasada*,
que es lo que se dice tras un diagnóstico o un accidente— y la coleta «e não vai
trabalhar» no la excluye: un inválido tampoco va a trabajar. **Un MAL tiene que
afirmar que la otra frase está mal, y aquí la autoridad falla.** Por la barra de
retirada, fuera — es exactamente el molde de los siete MAL retirados en el lote
hermano.

**Compárese con GJ-21, que sí sobrevive** (abajo): allí la segunda mitad es
**causal** —explica *por qué* está frío— y por eso bloquea la lectura
individual-level. Aquí la segunda mitad es una consecuencia compatible con las
dos lecturas. Un adjunto temporal **no** hace inequívoca la elección; una
cláusula causal sí. Ésa es la diferencia y conviene que quede escrita, porque es
la que permite reponer el ítem sin volver a fallar.

> **Reposición A (la más segura, error constructivo).**
> **sentence:** «O António é de baixa médica desde a semana passada e não vai
> trabalhar.»
> **repair:** «O António está de baixa médica desde a semana passada e não vai
> trabalhar.»
> **explicación:** «"Estar de baixa (médica)" es la expresión fija portuguesa
> para la baja por enfermedad (Priberam, *baixa*, ac. 8: "dispensa temporária do
> trabalho por motivo de doença"). Con "ser" no significa nada: es una de esas
> combinaciones donde el verbo viene con la expresión y no se elige. Y ojo, el
> contraste sigue vivo al lado: "O António **é** doente" —enfermo crónico— es
> otra cosa que "**está** doente" —hoy no puede ir a trabajar—.»

> **Reposición B (mínima, si se quiere conservar «doente»).** Cambiar sólo la
> coleta para que sea causal, como en GJ-21:
> **sentence:** «O António é doente desde a semana passada, quando apanhou uma
> gripe que não passa.»
> **repair:** «O António está doente desde a semana passada, quando apanhou uma
> gripe que não passa.»
> La gripe no convierte a nadie en enfermo crónico, así que la lectura de «ser
> doente» queda cerrada por el propio texto.

**Consecuencia de proceso:** cualquiera de las dos cambia el texto del ítem, y
el preflight pegado en el documento **caduca** — hay que volver a correr la
batería de 11 rasgos y la virginidad (la reposición A estrena «baixa», que no
aparece en ningún publicado; la B estrena «gripe», que sólo aparece en
`b2c2-med-160`, una mediación).

## GJ-19 · «Ela é professora de História, embora este ano esteja a dar Português.» → **PASA**

Correcto y bien construido: profesión con SER, situación con `estar a +
infinitivo`, los dos en la misma frase. «dar Português» es lo que dice un
profesor portugués. Y usa `estar a`, nunca gerundio, que es doctrina del curso.

## GJ-20 · «O concerto está no Coliseu…» → **PASA**

Correcto, por lo mismo que GJ-14 (0 atestaciones de evento + `estar`). El
Coliseu es referencia europea real.

## GJ-21 · «Este café é frio, deve ter ficado na máquina…» → **CORRIGE-ASÍ** (menor)

**El veredicto MAL sobrevive**, y sobrevive *por la coleta*. Hay que decirlo
mejor, porque tal como está la explicación se puede leer como que «Este café é
frio» está mal por sí solo, y no lo está: el corpus usa `ser` + `frio` con
objetos sin ningún problema («eram frias e rígidas as pedras», «a noite não era
fria» — Eça). Lo que hace imposible la frase es que la segunda mitad **explica
la causa** del frío, y una causa episódica es incompatible con una cualidad
definitoria.

> **Sustituir la última frase por:** «Aislada, "Este café é frio" sería una
> frase buena —hablaría de un café que se sirve frío—. Lo que la rompe es la
> segunda mitad: si se ha enfriado en la máquina, el frío es de hoy, y el estado
> de hoy va con ESTAR.»

## GJ-22 · «A entrada é gratuita para os sócios, mas hoje está esgotada a lotação.» → **CORRIGE-ASÍ** (menor)

Veredicto BIEN correcto, y la pareja SER/ESTAR en una frase es justo lo que el
punto quiere. Pero:

> «…en la misma frase y **con el mismo sujeto de fondo**.»

No es el mismo sujeto: son dos, «a entrada» y «a lotação». Es un descuido menor
pero está en la frase que explica el contraste, o sea en el peor sitio.

> **Sustituir por:** «SER para la característica del billete y ESTAR para el
> estado de hoy, en la misma frase y sobre el mismo evento. Los sujetos son
> distintos —"a entrada", "a lotação"— y el contraste se ve igual: lo que la
> entrada **es** no cambia; lo que hoy **está** esgotado, mañana no.»

## GJ-23 · «A festa de anos … está no domingo…» → **PASA**

Correcto. «festa de anos» es europeo (Brasil diría «festa de aniversário») y la
prueba que da la explicación —sustituir por «tem lugar»— funciona: «a festa **tem
lugar** no domingo».

## GJ-24 · «O prédio é do século dezanove…» → **PASA**

Era la última sospecha del encargo. **Comprobado y limpio.**

- **Priberam, *dezanove*:** «**Grafia no Brasil: dezenove. Grafia em Portugal:
  dezanove.**» La frase usa la europea.
- Ninguna mezcla de variantes: «prédio» (EP para el edificio de pisos),
  «remodelado», «por dentro» — todo europeo, ninguna forma brasileña.
- *Curiosidad que conviene conocer antes de que la levante otro:* el corpus del
  curso escribe **«dezenove» seis veces** (Camilo, Eça, Garrett) y «dezanove»
  **una** (Garrett, *Viagens* c05). No es contraejemplo: es la grafía del XIX,
  anterior a la fijación de la forma portuguesa moderna. Si alguien grepea el
  corpus para «verificar» este ítem, va a encontrar lo contrario de lo que
  espera.

---

# Metadata: `register` / `address`

**Medí la convención en vez de recordarla.** De los 2 431 ejercicios publicados,
**146 son juicios de gramaticalidad**, y:

| campo | declarados | omitidos |
|---|---:|---:|
| `register` | **146 / 146** (100 %) | 0 |
| `address` | **37 / 146** (25 %) | **109** |

O sea: **la regla que el catálogo practica es "`register` siempre; `address`
sólo donde hay tratamiento realizado en el texto"**. El `register` por defecto
es `neutro` (109 ítems), y los ejercicios *anteriores* a la ola B2C2 no llevan
ninguno de los dos campos — de ahí puede venir la impresión de que se omiten los
dos.

**El lote 11 no declara ni uno ni otro en 24/24 ítems.** Eso rompe la convención
en `register` para los 24 y deja sin marcar los tres ítems que sí realizan
tratamiento. Lo que hay que declarar:

| ítem | tratamiento realizado en el texto | `register` | `address` |
|---|---|---|---|
| **GJ-04** | «para **o senhor** os assinar» | `formal` | `o_senhor` |
| **GJ-10** | «**saíres** … **deixa** a chave» (tuteo, en la frase y en el *repair*) | `informal` | `tu` |
| **GJ-02** | «verifiquem … fecharam» = **vocês** | `neutro` | **omitir** |
| los otros 21 | ninguno (3.ª persona, «nós», «eu») | `neutro` | omitir |

Sobre GJ-02: el tratamiento está realizado, pero **el enum no tiene «vocês»**
(`AddressSchema` = `tu · terceira_sem_pronome · nome_cargo · o_senhor · V_Exa ·
voce_BR`). El precedente ya existe y está documentado: MED-41 del lote 6 se
publicó con `address` omitido por esta misma razón. Repetirlo aquí, no inventar
un valor.

**Mesóclise:** no hay ninguna en el lote. El rasgo del preflight «clítico con
guion» lo dispara **GJ-08 («pedir-lhes»), que es ênclise**, no mesóclise. La
doctrina —la mesóclise es culta, no informal— ya está aplicada en el catálogo:
`b2c2-gj-l3-13` «Dir-te-ei amanhã, prometo» está publicado con **`register:
neutro`** y `address: tu`, que es la corrección que se hizo en el lote 3. Nada
que arreglar por este lado.

---

# Lo que hay que cambiar sí o sí antes de publicar

**Bloqueantes (el ítem no puede salir así):**

1. **GJ-18 — muere la frase.** «Ser + adjetivo + desde» está atestiguado («Era
   orfão **desde** 1832», Camilo) y «ser doente» es un predicado vivo («Mas a
   mamã não **é doente**?», Eça): el adjunto temporal **no** hace inequívoca la
   elección y la lectura de enfermo crónico sobrevive. Reponer con el texto
   exacto de la **Reposición A** (o la B) del apartado GJ-18.
2. **GJ-03 — el análisis es falso y contradice a GJ-04 dentro del mismo lote.**
   «Até a chuva passar» es infinitivo **pessoal** con forma sincrética de 3.ª
   singular, no infinitivo simple. Tal como está, enseña que un sujeto expreso
   no obliga a flexionar — el error que GJ-01, GJ-05, GJ-08 y GJ-11 castigan.
   Texto de sustitución dado.
3. **GJ-15 — la explicación condena lo que Ciberdúvidas autoriza y lo que el
   propio catálogo publica.** «Estar» y «ficar» son intercambiables justo para
   localizar edificios (Ciberdúvidas 31032), «ser» lo hace en Eça («O quarto do
   pequeno **era ao fundo do corredor**») y `b2c2-gj-l5-19` ya está publicado
   como BIEN («A morada dela **é** na Rua Augusta»). Texto de sustitución dado.
4. **GJ-12 — dos frases falsas.** «Al llegar» no es gerundio, y el portugués sí
   admite las dos alternativas: «ao chegar» sin flexionar (186 casos con una
   lista cerrada de 30 verbos, contra 15 flexionados) y el gerundio adjunto
   inicial (4 casos leídos, Eça, Camilo, Junqueiro). Texto de sustitución dado.
5. **GJ-02 — la contrastiva con el español es falsa.** Con sujeto único el
   español usa infinitivo («antes de salir de casa»), no subjuntivo. Es la falla
   del lote 10 v2 reintroducida. Texto de sustitución dado.
6. **GJ-17 — el absoluto «sin excepción».** El veredicto aguanta (0
   atestaciones), pero «estar» coacciona predicados permanentes y con gentilicio
   da lecturas de comportamiento. Acotar con el texto dado.
7. **Metadata — falta entera.** Añadir `register` a los **24** ítems (`neutro`
   salvo GJ-04 `formal` y GJ-10 `informal`), y `address` sólo a **GJ-04**
   (`o_senhor`) y **GJ-10** (`tu`). GJ-02 lleva tratamiento pero **sin
   `address`**, por el precedente MED-41.

**Obligatorios menores (quitar lo que no es verdad):**

8. **GJ-04** — la próclise no la dispara «estar dentro de la subordinada»; es la
   colocación normal de la infinitiva preposicionada, y la ênclise también es
   correcta (corpus 404 a 31).
9. **GJ-21** — decir *por qué* muere la frase: la coleta es **causal**. Aislada,
   «Este café é frio» sería buena.
10. **GJ-22** — «el mismo sujeto de fondo» es falso: son «a entrada» y «a
    lotação».
11. **GJ-09** — blindar «el infinitivo pessoal no cabe» con el caso que sí cabe:
    «Convém a proposta ser entregue».

**Sin bloqueo, para decidir:** GJ-06, «tarde **de mais**» viaja en el *repair* y
Ciberdúvidas (2023) prefiere «tarde demais»; GJ-03 solapa con el publicado
`b2c2-gj-l3-08` («É melhor irmos embora antes da chuva») justo por debajo del
umbral 0,34 — «Mais vale esperarmos…» lo separa; GJ-15 es el tercer «ficar +
localización» del catálogo.

**Consecuencia de planificación.** Si GJ-18 se repone en el sitio, el lote sigue
en 24 (12 MAL / 12 BIEN) y los dos puntos cierran a 12 como dice la tabla. Si se
retira sin reponer, quedan **23 ítems, 11 MAL / 12 BIEN** y
`b11-ser-estar-divergente` cierra a **11**, no a 12. En cualquier caso, **el
preflight pegado en el documento caduca en cuanto se toque una `sentence`**:
GJ-18 cambia sí o sí, así que hay que volver a correrlo antes de abrir el round
siguiente.

---

# Qué está bien (específico, y por tanto qué no hay que tocar)

No es cortesía. Es lo que se pierde si alguien «arregla» el lote entero.

- **Los doce veredictos MAL son once buenos y uno malo, y los once están
  verificados con corpus *y* con fuente externa, no con intuición.** Es el mejor
  resultado de la serie: la v1 del lote 10 perdió 5 de 8 y la v2 perdió 1 de 8
  con muchos menos ítems en juego.
- **GJ-10 es el ítem mejor apoyado del lote.** Cero atestaciones en 4,27 M de
  caracteres —incluidos los dos falsos positivos que hubo que leer y
  descartar—, 19 «antes que» + conjuntivo y 67 «antes de» + infinitivo enfrente,
  y una fuente que lo dice con esas palabras: «Não é, pois, possível escrever
  "antes de que"». Y el *repair* es el mínimo absoluto: se borra «que» y lo que
  queda ya es portugués, con «saíres» reinterpretado sin tocar una letra.
- **GJ-11 es el ítem mejor construido.** El par «souberem»/«saberem» sólo
  funciona con un verbo de tema irregular; con un verbo regular las dos formas
  serían homófonas y el ítem no existiría. Eso es diseño, no suerte. Y el
  veredicto no depende de la frecuencia: `sem` es preposición, y punto.
- **GJ-04 tiene el análisis del infinitivo pessoal que a GJ-03 le falta**, con
  las mismas palabras que había que usar («donde la flexión coincide con el
  infinitivo simple»). La corrección de GJ-03 es literalmente copiar de su
  vecino.
- **GJ-06 resistió la sospecha del autor entera.** Las dos construcciones que
  declara buenas están las dos documentadas —una en el consultorio, otra en Eça
  («era necessario **ficarem** lá»), y una tercera vez en el propio catálogo
  publicado—, y la mezcla no aparece ni una vez.
- **GJ-16 está puesto a propósito y hace falta.** Un punto contrastivo donde
  *todos* los ítems divergen del español enseña una superstición. Que uno
  coincida, y que la explicación lo diga, es criterio.
- **El molde EP no falla en ninguna de las 24 frases:** «os miúdos»,
  «ficámos», «torneira do gás», «festa de anos», «dezanove», «lá para as oito»,
  «ao telefone», «estar a dar», «Coliseu». Ni un brasileirismo, ni un gerundio
  progresivo, ni un posesivo sin artículo. Y ningún MAL se detecta por el ojo:
  no hay una sola palabra visiblemente española en las doce frases condenadas —
  los errores son de flexión, de rección y de elección de cópula, que es lo que
  el nivel pide.
