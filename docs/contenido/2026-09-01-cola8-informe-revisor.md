# Cola 8 — dictamen adversarial (portugués europeo)

Rama `variante/pt-pt-como-base`. 100 ítems, en el orden exacto de `cola8.json`.
Verificado antes de opinar: los 100 objetos de la cola coinciden **byte a byte**
con lo que hay hoy en `lib/data/languages/pt/blocks/*.json`, y **ninguno de los
100 tiene `variantOverrides`** — o sea que lo que dictamino es literalmente lo
que ve el alumno en las dos variantes, con la única diferencia del hash de audio.

## Recuento

| bloque | ítems | ERROR | DUDA | OK | % error |
|---|---|---|---|---|---|
| b8 | 47 | **25** | 11 | 11 | **53 %** |
| b7 | 30 | 3 | 3 | 24 | 10 % |
| b10 | 6 | 0 | 1 | 5 | 0 % |
| b1 | 5 | 3 | 0 | 2 | 60 % |
| b2 | 3 | 1 | 0 | 2 | 33 % |
| b3 | 3 | 3 | 0 | 0 | 100 % |
| b4 | 3 | 3 | 0 | 0 | 100 % |
| b5 | 3 | 2 | 1 | 0 | 67 % |
| **total** | **100** | **40** | **16** | **44** | **40 %** |

**b8 sale al 53 %** en su primera cola: dentro de la banda 40-53 % de las siete
anteriores, y sin ninguna sorpresa metodológica — el bloque nunca revisado se
comporta como los demás bloques nunca revisados.

**b7 sale al 10 %, no al 56 %.** No es que se me haya escapado nada: 22 de los 30
ítems que me tocaron de b7 son precisamente los que la cola 7 ya reparó o los que
son mecánicamente verificables (8 de `estar a + infinitivo`, 6 de infinitivo
pessoal, 4 de corrección de error, 4 de participio). El muestreo de esta cola cayó
sobre la parte sana de b7. Lo digo explícitamente para que nadie lea el 10 % como
«b7 ya está bien»: **es el 10 % de un tramo que ya había pasado por revisión.**

50 de los 100 ítems llevan correcciones concretas. **15 exigen rehacer audio**
(`rehacer: true`).

### Convención del JSON

`campo` es dot-path con índices (`data.blanks[0].alternatives`). Para campos
escalares, `de` es la cadena exacta del repo. Para **arrays y objetos**, `de` y
`a` van serializados en JSON compacto (`json.dumps(..., ensure_ascii=False,
separators=(',',':'))`), p. ej. `["Faz"]` o
`[{"position":0,"answer":"uma","alternatives":[]}]`. El fichero se generó con un
script que **releyó cada `de` del repo y abortaba si no coincidía o si la
corrección no cambiaba nada**: los 50 pasan.

---

## Las clases dominantes

### 1 · La glosa `esContrast` sigue siendo la clase nº 1 — 22 ítems (55 % de los ERROR)

Igual que en las colas 6 y 7. Cuatro subtipos, todos presentes:

**(a) Afirmaciones falsas sobre la lengua.** Las peores, porque el alumno las
memoriza:

- `4c...` **b7/ac1c679f**: «En portugués, 'ler' no es irregular como en español.
  Se conjuga regular». Priberam clasifica `ler` como **conjugação irregular**
  (presente *leio, lês, lê, lemos, leem*). Y el contraste está del revés: el
  español *leer* sí es regular en presente. La glosa enseña lo contrario de lo
  que pasa.
- **b8/6eb4b5cf**: «'porém' … No lleva acento en PT-BR». Lleva acento agudo en
  las dos variantes — y el propio `front` y el propio `back` de la tarjeta lo
  escriben acentuado. **La glosa contradice a su propio ítem.**
- **b8/1352e0af**: «en PT-BR se usa más el subjuntivo en la subordinada».
  Invención pura, y además mete PT-BR en la glosa de una base europea.
- **b8/102a053a**: «'Achar' no significa 'achar' (encontrar), sino
  'creer/pensar'». Priberam da como **acepción 1** de *achar*: «deparar-se com
  algo… (sin. ENCONTRAR)». Tiene los dos sentidos.
- **b8/84eae918**: «['pois'] Se coloca después del verbo en PT-BR». El *pois*
  causal encabeza siempre su oración — como en el ejemplo de la propia tarjeta.
- **b2/f7df9e85**: «'Mão' termina en -o pero es femenina… **diferente del
  español**». Termina en *-ão*, y *la mano* también es femenina en español: el
  contraste no existe. Es exactamente el patrón que el proyecto ya arrastra.
- **b1/1cf5bb47**: «'bom' **en español** tiene vocal diferente». En español no
  existe *bom*.

**(b) Contrastes inventados entre lenguas que aquí coinciden.** `b8/7a379c9b` y
`b8/73018a82` presentan *conseguir* como falso amigo: el español *conseguir*
significa igualmente 'lograr' («conseguí terminarlo»). No hay nada que contrastar.

**(c) Glosas escritas en portugués, en el campo que es la pista PARA
hispanohablantes.** `b3/ea88503e` («su conjugação em -ar é regular»),
`b5/361162f9` («Em es seria 'vendrá', mas o acento é igual»), `b5/dcda4a67`,
`b7/0b0c9571` (íntegramente en portugués), `b8/15492270` («No confundas **com**»).
En `b8/03013ffe` la glosa española escribe la palabra portuguesa: «La película que
vi es **ótima**».

**(d) Glosas que se contradicen o no se entienden.** `b7/f53e27b7`: «'trabalho' en
PT es trabajo; no confundas con 'trabajo' (empleo) = 'emprego'» — dice que A = B y
acto seguido que no confundas B con A. `b8/294ade1e` llama **irregular** a
*imaginar* y en la misma línea lo compara con *falar*, el paradigma regular.
`b8/6bc826a5`: «'Pensar en' se dice 'pensar EM' en PT, no 'pensar em' que ya es
así». `b8/b332868a`: «son aposiciones que no restrictivas» — ininteligible.

### 2 · Flashcards muertas — 13 de las 19 flashcards de la cola

`b8/a8604510`: front **«imaginar»**, back **«imaginar (imaginar)»**. La palabra
glosada consigo misma. No es un caso aislado: `proteger` → «proteger — defender,
preservar de perigo» (`630329e4`), `levar` → «levar (llevar, tardar)»
(`7f33e7ee`), `conseguir` → «conseguir (lograr, conseguir)» (`10b05f5a`),
`existe` → «existe (existe, hay)` (`38fd83bb` **y** `c4e1cba3`, que son la misma
tarjeta con **los mismos dos hashes de audio**).

Dos variantes del mismo agujero:

- **front ⊇ back**: los tres conectores (`5c51b100` embora, `6eb4b5cf` porém,
  `84eae918` pois) llevan en el front «Conector X: 'y' (glosa española)» y en el
  back «y (la misma glosa)». Revelar no añade información: la nota FSRS que sale
  de ahí no mide nada.
- **back sin una palabra de español**: `0106ee6b`, `630329e4`, `406abf88`,
  `9528acd6`. La tarjeta existe para enseñar la equivalencia y no la da.

Y hay un agravante que no está en el radar del proyecto: **`data.back` es el texto
que se sintetiza en audio** (`scripts/lib/audio-collector.ts`, `case 'flashcard':
return data.back`), y `generate-audio.ts` no limpia nada. O sea que la voz
portuguesa está leyendo en voz alta «existe, existe, hay», «levar, llevar,
tardar», «falar flecha falado, con -ado». Por eso 15 de mis correcciones llevan
`rehacer: true`.

### 3 · Ensamblados rotos y claves que premian el error — 12 ítems

- **b7/0b0c9571**: con la answer puesta, el alumno lee «Vocês já **arrumado** as
  malas para a viagem?» — falta el auxiliar. Hueco sin verbo.
- **b8/2fb35ada**: la alternative «já tinha lido» dentro de «Ela contou que já ___
  o livro» produce «que **já já** tinha lido», y FillBlankCard la da por CORRECTA.
- **b4/3bca1e9a**: la alternative «encantador» premia la concordancia errónea con
  «a casa».
- **b8/6bc826a5**: la cuarta opción es **«em / em»** — basura de generación que
  además contiene la respuesta correcta, así que quien la elija por eso falla.
- **b8/4200fafc**: la solución española es agramatical, «El realizador **cuyo**
  última película fracasó», y TranslationCard compara contra `data.target`: el
  ítem **obliga a teclear la forma incorrecta** para puntuar.
- **b8/7137d211**: la solución «española» está a medias en portugués — «João
  **contou** que **no día** anterior había dejado de fumar». La forma correcta
  está escondida en `acceptedAlternatives`.
- **b8/294ade1e**: «Imagina que ele imaginasse que não existe nada para imaginar»
  no significa nada, y la pista anuncia una pregunta indirecta que no aparece.

### 4 · El ítem no ganable de la cola: `b8/9b8559a3`

La racha se rompe por un lado y sigue por otro. **Comprobado uno a uno: en los 13
ítems de `listening` + `verb_preposition` de esta cola, la `answer` figura entre
las `options`.** El fallo `opt === data.answer` con answer huérfana no aparece.

Pero `9b8559a3` es no ganable por otra vía, peor: **la clave es lingüísticamente
falsa y la correcta no está entre las opciones.** En «Parou de trabalhar para
proteger **quem ama**», *quem* no tiene antecedente; la oración funciona como un
nombre —es el complemento directo de *proteger*— y se clasifica como **subordinada
substantiva relativa sem antecedente** (Ciberdúvidas, consultório: «orações
subordinadas substantivas relativas sem antecedente»; *quem* sustituible por «a(s)
pessoa(s) que»). No es adjetiva restritiva: no hay sustantivo al que modificar. Un
alumno que sepa gramática no puede acertar, porque esa etiqueta no está entre las
cuatro. Y la `esContrast` repite el error.

### 5 · Brasileño en la base europea — 6 ERROR + 2 DUDA

| ítem | qué entra | por qué es de Brasil |
|---|---|---|
| b3/6ad1e3dc | alternative **«Faz»** muito tempo | corpus del repo: **97** «há + tiempo», **0** «faz + tiempo» |
| b4/689bec59 | alternative **«assistia»** televisão | en PT-PT *assistir* rige `a`; el corpus solo lo trae con preposición («assistir à vindima», «assistia ao ofício») |
| b8/03013ffe | ejemplo «O filme que eu **assisti**» | ídem → «o filme **a que** assisti» |
| b8/15492270 | ejemplo «achei muita graça **da** história» | PT-PT «achar graça **a**» — atestiguado en el corpus, Camilo, *Amor de Perdição* VIII: «acho graça **á** obediencia com que me deixo guiar» |
| b8/406abf88 | «estreou **seu** primeiro longa-metragem» | posesivo sin artículo → «o seu» |
| b8/9528acd6 | «que faz **sua** estreia» | ídem → «a sua» |
| b8/3ac52a9e (DUDA) | alternative «**entretanto**» = sin embargo | Priberam **sí** registra el adversativo sin marca de Brasil, así que no puedo llamarlo brasileñismo; pero en el corpus europeo las 25 ocurrencias son temporales, y en «O relatório é completo; entretanto, falta rever…» se lee antes 'mientras tanto' |
| b8/8cb5e279 (DUDA) | «**actor**» | grafía anterior al AO90 en un bloque que ya escribe «diretor» y «ótimo». El repo no tiene norma fijada (conviven *facto*/*fato* 5/12, *director*/*diretor* 16/14), así que no lo elevo a ERROR |

El caso `entretanto` es el que más me costó: iba camino de ERROR y **Priberam me
desmintió**. Va como DUDA con la razón escrita, no como error.

---

## Hallazgos transversales (son del motor, no del ítem: no los cuento en los 100)

**T1 · `sourceLang`/`targetLang` dicen «pt-br» en toda la base europea.**
Recuento sobre los bloques: b8 32 pares `pt-br`, b7 24, b4 40, b6 40, b1 38, b3 32,
b2 32, b5 32. TranslationCard pinta la cabecera `ES → PT-BR` mientras el ítem pide
«teremos **de** aceitar **as suas** condições» y «guião». **b10, el bloque más
nuevo, ya usa `"pt"`** (71 targetLang `pt`): la convención buena existe, solo que
nadie la propagó. Es un `sed` de un solo sentido y no lo he metido en las 100
fichas para no ahogar los hallazgos reales — pero es lo primero que yo haría.

**T2 · `FillBlankCard` no sabe hacer ejercicios de varios huecos.** Renderiza **un
solo `<input>`** y valida con `blanks.some(...)`: en un ítem de tres huecos, teclear
uno solo puntúa CORRECTO, y el reveal enseña únicamente `blanks[0].answer`. En el
repo hay **37 ejercicios multi-hueco** (b1 4, b2 2, b3 4, b4 9, b5 6, b6 10, b7 2).
4 me tocaron en esta cola y van como ERROR con la corrección de reducirlos a un
hueco; los otros 33 siguen ahí.

**T3 · 21 `blanks` del repo tienen una `alternative` idéntica a su `answer`.** Ruido
inofensivo, pero es la huella de un generador que no se revisó.

**T4 · `VerbPrepositionCard` solo traduce el glifo `—` a «(sin preposición)».** Los
ítems que usan `∅` (b8/5fd0932e, b8/7f1fb792) lo pintan crudo; b8/b9978825 usa `—`
para lo mismo. Elegir uno.

**T5 · Vocabulario etiquetado con conceptos de gramática — 14 ítems de la cola.**
`levar`, `proteger`, `existe`, `imaginar`, `conseguir`, `realizador`, `estreante`
están etiquetados con `b8-oracoes-subordinadas`, `b8-discurso-indireto` o
`b8-colocacao-pronominal`. El mastery se calcula por concepto a partir de los
ejercicios que lo llevan (`lib/stats/aggregations.ts`, `byConcept`), de modo que
acertar «¿qué significa *levar*?» acredita dominio de subordinadas. Cuando ese es
el **único** reparo lo he puesto como DUDA (`f00f5169`, `fc390e6a`, `1aaa2910`,
`33cf21fe`); cuando se suma a una tarjeta muerta, va dentro del ERROR.

**T6 · Duplicados literales.** «Eu gosto ___ café pela manhã» aparece **tres
veces** (b7/f00f5169, b8/7f1fb792, b8/b9978825). *conseguir* tiene tres tarjetas
(10b05f5a, 7a379c9b, 73018a82), *levar* dos (0106ee6b, 7f33e7ee) y *existe* dos que
comparten hashes de audio (38fd83bb, c4e1cba3). Sobran seis ítems.

---

## Qué está bien — con datos, no con cortesía

**Los 8 ítems `b7-ep-*` de `estar a + infinitivo` aguantan la relectura: 8/8.**
«o bebé está a dormir», «Eles continuam a morar no Porto», «Passei a tarde a
arrumar», «estava a falar», «Ficámos a conversar», «anda a piorar», «estavam a
jantar», «passa o dia a ver». Ninguno tiene `alternatives`, así que el gerundio
brasileño se **rechaza** en vez de aceptarse. Y el léxico acompaña: *bebé*,
*telemóvel*, *Ficámos* con acento. Comprobado por regex sobre los 100 ítems:
**cero apariciones de `estar/ficar/andar/continuar + gerúndio` en la base.** La
clase que la cola 7 marcó como dominante en b7 **está cerrada** en este tramo.

**El calco caro no aparece.** Un solo `ter + particípio` en toda la cola
(b7/fec7825b) y lo usa **bien**: «Ela tem falado muito ultimamente» — repetición,
no hecho acabado. Nadie está presentando el compuesto portugués como el pretérito
perfecto español.

**Infinitivo pessoal: 12 de 13 correctos.** Las seis `conjugation` (falarmos,
serem, termos, fazerem, partirmos, fazermos), las dos `error_correction`
(estudarmos, chegarem), el `fill_blank` (chegarmos) y el `multiple_choice` que
además desactiva la confusión que importa («fizermos es futuro do conjuntivo»).
**La excepción es una y es grave: `b7/ff5e7364`**, que enseña «falar ele/ela» como
si fuera una forma —no lo es; en 3.ª del singular el infinitivo pessoal es *falar*
a secas, con el sujeto delante— y la locuta, con un ejemplo de orden invertido
(«Falar ela assim é surpreendente»). Es exactamente la clase que la cola 7 confirmó
en b7 y **sigue viva, en audio**.

**b10 / mediación «fidelidad de relay»: 6/6 con la clave correcta.** Verifiqué los
seis contra su aviso: préstamos omitidos (correcta), nada falla (correcta), dinero
movido del cajón a la mesa (correcta), calzado impermeable añadido (correcta),
destinatario cambiado de secretaría a profesor (correcta), nada falla (correcta).
Los distractores son **falsables uno a uno** contra el texto, no de relleno. Y el
léxico europeo es de quien sabe lo que hace: *cave*, *arrecadação*, *cadeado*,
*lava-loiça*, *torneira de segurança*, *miradouro*, *parque de estacionamento*,
*esquadra*, *o homem do gás*. La nota de que «rever» es 'volver a ver' y no
'inspeccionar' es correcta y es justo el tipo de precisión que falta en b8. Este
bloque es el único de la cola sin un solo ERROR — y es el más nuevo.

**Otros aciertos sueltos:** `b8/18e1b7bb` («teremos **de** aceitar **as suas**
condições» — perífrasis y posesivo europeos, con «uma vez que»/«visto que» bien
admitidas). `b8/5fd0932e`, que exige la forma europea «Preciso **de** descansar»
frente al brasileño sin preposición. `b8/102a053a`, que es un buen ítem de próclise
tras *que* («Acho que **o** conseguirás»), aunque su glosa esté rota por otro
motivo. `b7/474b0d6d` y `b7/b077af3b`, con el error plantado y la corrección
exactos. Los MC de participio, con distractores plausibles sin ser trampa
(*escrevido* el regular falso, *escripto* la grafía anterior a 1911).

---

## Dictamen ítem a ítem

Índice = posición en `cola8.json` (0-based). El JSON va en el mismo orden.


### b1.json

**[0] `056d0918` · fill_blank · b1-l4-vogais-nasais — OK** 🟢

Frase, respuesta y glosa correctas: «O cão ladra à noite.» El til sí marca la nasalidad de /-ɐ̃w̃/.

**[1] `1cf5bb47` · fill_blank · b1-l4-vogais-nasais — ERROR** 🔴

La esContrast inventa una palabra española: «'bom' en español tiene vocal diferente» — en español no existe *bom*. La comparación honesta es con «buen/bueno», que no tiene vocal nasal. (Aparte, el hueco está infradeterminado: «Este bolo está muito ___» admite doce, saboroso, caro… y el corrector solo acepta «bom».)

- `esContrast` — de: «'Bom' suena /bõ/; 'bom' en español tiene vocal diferente.» → a: «'Bom' se pronuncia /bõ/, con vocal nasal. El español no tiene ese sonido: compara con 'buen/bueno'.»

**[2] `798ef701` · fill_blank · b1-l4-vogais-nasais — ERROR** 🔴

Tres huecos y una sola caja de texto: FillBlankCard renderiza un único input y valida con blanks.some(...), de modo que escribir «um» puntúa CORRECTO sin haber resuelto los otros dos, y el reveal solo enseña «um». El ítem no evalúa lo que dice evaluar. Además las alternatives repiten literalmente el answer.

- `data.sentence` — de: «Na mesa, há ___ pão, ___ café e ___ laranja.» → a: «Na mesa, há um pão, um café e ___ laranja.»
- `data.blanks` — de: «[{"position":0,"answer":"um","alternatives":["um"]},{"position":1,"answer":"um","alternatives":["um"]},{"position":2,"answer":"uma","alternatives":[]}]» → a: «[{"position":0,"answer":"uma","alternatives":[]}]»

**[3] `f02234b9` · fill_blank · b1-l2-silaba-tonica — OK** 🟢

Correcto. La glosa no afirma ningún contraste falso de acentuación (el error sistemático del proyecto): solo señala la sílaba tónica.

**[4] `f1b10ccb` · fill_blank · b1-l3-correspondencias-es-pt — ERROR** 🔴

Dos huecos, una sola caja: misma rotura de evaluación que 798ef701 (basta escribir «canções» para puntuar correcto y el reveal nunca muestra «banho»). El contenido lingüístico es correcto.

- `data.sentence` — de: «As ___ novas e o ___ da manhã.» → a: «As ___ novas e o banho da manhã.»
- `data.blanks` — de: «[{"position":0,"answer":"canções","alternatives":[]},{"position":1,"answer":"banho","alternatives":[]}]» → a: «[{"position":0,"answer":"canções","alternatives":[]}]»


### b10.json

**[5] `b2c2-mfid-19` · multiple_choice · b10-l3-avisos-e-recados — OK** 🟢

Clave correcta: el recado omite los préstamos, que es el cuarto dato del aviso. Léxico europeo exacto: «cave», «passa para», «das 10h às 14h». Los tres distractores son falsos comprobables.

**[6] `b2c2-mfid-20` · multiple_choice · b10-l3-avisos-e-recados — DUDA** 🟡

La clave («Não falha nada») es correcta: los cuatro datos se conservan y el nombre de la calle se deja en español a propósito. Pero «bilhete de identidade» es un documento extinto en Portugal desde 2008: el equivalente vivo del DNI es el «cartão de cidadão». No es un error de lengua, es un anacronismo cultural en un ítem que presume de fidelidad al dato.

- `data.question` — de: «AVISO (em espanhol):⏎«Su cita para renovar el DNI es el lunes 6 a las 9:40 en la comisaría de la calle Toledo. Traiga una foto rec […] tografia recente e o documento antigo. Se não puderes, liga para o 900 100 200.»⏎⏎O que é que falha no recado?» → a: «AVISO (em espanhol):⏎«Su cita para renovar el DNI es el lunes 6 a las 9:40 en la comisaría de la calle Toledo. Traiga una foto rec […] tografia recente e o documento antigo. Se não puderes, liga para o 900 100 200.»⏎⏎O que é que falha no recado?»

**[7] `b2c2-mfid-21` · multiple_choice · b10-l3-avisos-e-recados — OK** 🟢

Clave correcta (el dinero cambia de sitio: «en el cajón» → «em cima da mesa»). «Torneira de segurança», «lava-loiça» y «o homem do gás» son las formas europeas.

**[8] `b2c2-mfid-22` · multiple_choice · b10-l3-avisos-e-recados — OK** 🟢

Clave correcta: «calçado impermeável» es un dato añadido. «Parque de estacionamento» y «miradouro» son europeos; el distractor de la distancia es falso comprobable.

**[9] `b2c2-mfid-23` · multiple_choice · b10-l3-avisos-e-recados — OK** 🟢

Clave correcta: cambia el destinatario (secretaría → o professor). El resto del trasvase es fiel.

**[10] `b2c2-mfid-24` · multiple_choice · b10-l3-avisos-e-recados — OK** 🟢

Clave correcta: no falla nada, incluida la distinción casa/arrecadação. «Arrecadação» por «trastero» y «fazer a manutenção» por «revisar» son resoluciones europeas acertadas, y la nota sobre «rever» ≠ inspeccionar es exacta.


### b2.json

**[11] `f7df9e85` · fill_blank · b2-l2-genero-gramatical — ERROR** 🔴

Dos afirmaciones falsas en cuatro palabras. (a) «'Mão' termina en -o»: termina en -ão. (b) «diferente del español»: el español «la mano» TAMBIÉN es femenina acabando en -o, así que el contraste no existe — es exactamente el patrón de falso contraste que este proyecto ya arrastra. La alternative repite el answer.

- `esContrast` — de: «'Mão' termina en -o pero es femenina: a mão, diferente del español.» → a: «'Mão' acaba en -ão y es femenina: a mão. El paralelo con el español se mantiene ('la mano' también es femenina); lo que cambia es la terminación.»
- `data.blanks[0].alternatives` — de: «["mão"]» → a: «[]»

**[12] `208d6710` · fill_blank · b2-l3-numero-possessivos — OK** 🟢

Regla y forma correctas: papel → papéis. La pista «(papel)» está, a diferencia de otros ítems del lote.

**[13] `cfa0de98` · fill_blank · b2-l3-numero-possessivos — OK** 🟢

Regla y forma correctas: lição → lições, con pista.


### b3.json

**[14] `3f6b80fb` · fill_blank · b3-l1-presente-regular — ERROR** 🔴

Dos huecos y una sola caja: escribir solo «escolhemos» puntúa correcto y el reveal nunca muestra «confirmamos». Las formas son correctas y «ementa» es la palabra europea; lo que está roto es la evaluación.

- `data.sentence` — de: «Nós ___ a ementa e depois ___ o pedido. (escolher / confirmar)» → a: «Nós ___ a ementa e depois confirmamos o pedido. (escolher)»
- `data.blanks` — de: «[{"position":0,"answer":"escolhemos","alternatives":[]},{"position":1,"answer":"confirmamos","alternatives":[]}]» → a: «[{"position":0,"answer":"escolhemos","alternatives":[]}]»

**[15] `6ad1e3dc` · fill_blank · b3-l4-existenciais-haver-ter — ERROR** 🔴

La alternative «Faz» se acepta como respuesta correcta (FillBlankCard valida contra alternatives) y es brasileñismo en una base que por contrato es europea: en el corpus del repo hay 97 ocurrencias de «há + expresión de tiempo» y CERO de «faz + expresión de tiempo». En PT-PT es «Há muito tempo que não a vejo».

- `data.blanks[0].alternatives` — de: «["Faz"]» → a: «[]»

**[16] `ea88503e` · fill_blank · b3-l1-presente-regular — ERROR** 🔴

esContrast escrita medio en portugués: «pero su conjugação em -ar é regular». El campo es la pista PARA hispanohablantes y debe estar en español; tal cual, el alumno lee una frase híbrida.

- `esContrast` — de: «'Estudar' = 'estudiar' (cognado), pero su conjugação em -ar é regular: '-am' para vocês/eles.» → a: «'Estudar' es cognado de 'estudiar', pero su conjugación en -ar es regular: '-am' para vocês/eles.»


### b4.json

**[17] `3bca1e9a` · fill_blank · b4-l3-imperfeito — ERROR** 🔴

Dos fallos. (a) Dos huecos y una sola caja: escribir «era» puntúa correcto sin tocar la concordancia. (b) La alternative «encantador» PREMIA EL ERROR: el sujeto es «a casa» y el masculino es agramatical; FillBlankCard lo da por bueno.

- `data.sentence` — de: «A casa ___ (ser) ___ (encantador) e muito grande.» → a: «A casa ___ (ser) encantadora e muito grande.»
- `data.blanks` — de: «[{"position":0,"answer":"era","alternatives":[]},{"position":1,"answer":"encantadora","alternatives":["encantador"]}]» → a: «[{"position":0,"answer":"era","alternatives":[]}]»

**[18] `ac1c679f` · fill_blank · b4-l1-perfeito-regular — ERROR** 🔴

La esContrast es falsa: Priberam clasifica «ler» como verbo de conjugação IRREGULAR (presente leio, lês, lê, lemos, leem). Y el contraste está invertido: el español «leer» sí es regular en presente. Además el enunciado no lleva la pista del infinitivo que sí llevan sus hermanos del bloque, así que «viram», «leem» y «leram» son respuestas igual de razonables y solo una puntúa.

- `data.sentence` — de: «Vocês ___ as notícias de hoje?» → a: «Vocês ___ as notícias de hoje? (ler)»
- `esContrast` — de: «En portugués, 'ler' no es irregular como en español. Se conjuga regular: li, leste, leu...» → a: «'Ler' es irregular en portugués (presente: leio, lês, lê, lemos, leem). En el pretérito perfeito, en cambio, sigue el patrón regular: li, leste, leu, lemos, lestes, leram.»

**[19] `689bec59` · fill_blank · b4-l4-contraste-perfeito-imperfeito — ERROR** 🔴

La alternative «assistia» se acepta como correcta y produce «Eu assistia televisão», que en portugués europeo es agramatical: «assistir» (= ver) rige «a» — el corpus del repo solo lo trae con preposición («assistir à vindima», «assistia ao ofício»). El régimen sin preposición es brasileño.

- `data.blanks[0].alternatives` — de: «["assistia"]» → a: «["estava a ver"]»


### b5.json

**[20] `361162f9` · fill_blank · b5-l1-futuro-presente — ERROR** 🔴

esContrast escrita en portugués («Em es seria 'vendrá', mas o acento é igual»), justo el campo que debe estar en español. El contenido, además, es trivial: lo que hay que contrastar es el radical (vir → virá frente a venir → vendrá), no la tilde.

- `esContrast` — de: «'Vir' → 'virá' no futuro. Em es seria 'vendrá', mas o acento é igual.» → a: «'Vir' hace 'virá' en el futuro simple; el español cambia de radical y dice 'vendrá'. Las dos formas son agudas y llevan tilde.»

**[21] `d140e759` · fill_blank · b5-l4-se-futuro-condicional — DUDA** 🟡

Lengua correcta: «Caso os preços subissem demais, muitos clientes não comprariam» es gramatical (caso + imperfeito do conjuntivo). Dos reparos de estilo: la glosa habla de «tipo 2», jerga heredada de los manuales de inglés que un hispanohablante no tiene por qué conocer, y en PT-PT «demasiado» es más natural que «demais» modificando a un verbo.

- `esContrast` — de: «'Caso' funciona como 'se' con el mismo valor de tipo 2.» → a: «'Caso' introduce condición igual que 'se' y exige conjuntivo: 'Caso os preços subissem…' = 'Si los precios subieran…'.»

**[22] `dcda4a67` · fill_blank · b5-l1-futuro-presente — ERROR** 🔴

Dos cosas a la vez. La glosa está escrita en portugués («parece 'será' em es, mas usa-se…») en el campo español, y lo que afirma es falso: el español «será» también expresa futuro real («la prueba será difícil»), no solo conjetura.

- `esContrast` — de: «'Será' parece 'será' em es, mas usa-se para futuro, não só para conjetura.» → a: «'Será' se escribe igual que en español y, como en español, sirve tanto para el futuro real como para la conjetura; aquí es futuro.»


### b7.json

**[23] `0b0c9571` · fill_blank · b7-l3-participio — ERROR** 🔴

Ensamblado agramatical: con la answer puesta, el alumno lee «Vocês já arrumado as malas para a viagem?» — falta el auxiliar. O el enunciado incorpora «tinham/têm», o la respuesta es «arrumaram». Encima la esContrast está íntegramente en portugués y la alternative repite el answer.

- `data.sentence` — de: «Vocês já ___ as malas para a viagem?» → a: «Vocês já tinham ___ (arrumar) as malas para a viagem?»
- `data.blanks[0].alternatives` — de: «["arrumado"]» → a: «[]»
- `esContrast` — de: «'Arrumar' pode significar 'ordenar' ou 'preparar' (malas). O particípio é regular: -ado.» → a: «'Arrumar' puede significar 'ordenar' o 'preparar' (las maletas). Su participio es regular: -ado.»

**[24] `f00f5169` · verb_preposition · b7-l3-participio — DUDA** 🟡

Lingüísticamente correcto («Eu gosto de café pela manhã»; «pela manhã» está atestiguado 39 veces en el corpus europeo, no es brasileñismo). Dos reparos de curación: es un ítem de régimen preposicional etiquetado con el concepto b7-participio —el mastery se calcula por concepto, así que acertarlo acredita participios que no ha tocado—, y la frase es idéntica a la de 7f1fb792 y b9978825 en b8.

**[25] `f53e27b7` · translation · b7-l3-participio — ERROR** 🔴

La esContrast se contradice a sí misma: «'trabalho' en PT es trabajo; no confundas con 'trabajo' (empleo) = 'emprego'». Dice que A = B y acto seguido que no confundas B con A. El alumno no puede sacar nada de ahí.

- `esContrast` — de: «Cuidado: 'trabalho' en PT es trabajo; no confundas con 'trabajo' (empleo) = 'emprego'.» → a: «'Trabalho' es 'trabajo' en el sentido de tarea u obra. Para 'trabajo' = puesto de trabajo, el portugués dice 'emprego'.»

**[26] `fc390e6a` · verb_preposition · b7-l1-infinitivo-pessoal — DUDA** 🟡

Lengua correcta: «Ela pensa em viajar para Lisboa», y la advertencia sobre «pensar de» = opinar es exacta. Reparo de curación: es un ítem de régimen preposicional etiquetado como b7-infinitivo-pessoal, concepto con el que no tiene nada que ver.

**[27] `febc4d8a` · verb_preposition · b7-l2-gerundio — DUDA** 🟡

Lengua correcta («comecei a verificar»; el régimen coincide en las dos variantes). Errata visible en la glosa: «Hispanoablantes». Y otra vez concepto mal etiquetado: régimen preposicional dentro de la lección de gerúndio.

- `esContrast` — de: «Hispanoablantes tienden a decir 'começar DE'; PT-BR y PT-PT usan 'a' con começar.» → a: «Los hispanohablantes tienden a decir 'começar DE'; tanto en PT-PT como en PT-BR 'começar' rige 'a'.»

**[28] `fec7825b` · flashcard · b7-l3-participio — OK** 🟢

Correcto y, además, bien pensado: el ejemplo «Ela tem falado muito ultimamente» usa el compuesto portugués con su valor real (repetición/duración), que es justo el calco que un hispanohablante suele hacer mal. No cae en presentar «ter + particípio» como el pretérito perfecto español.

**[29] `ff5e7364` · flashcard · b7-l1-infinitivo-pessoal — ERROR** 🔴

Forma inventada y locutada. El infinitivo pessoal de 3.ª persona del singular ES «falar», sin desinencia y con el sujeto DELANTE; «falar ele/ela» no es una forma del portugués, y el ejemplo «Falar ela assim é surpreendente» tiene el orden invertido (sería «Ela falar assim…»). La esContrast refuerza el invento en vez de corregirlo. El back está sintetizado en audio en las dos voces: hay que rehacerlo.

- `data.front` — de: «Conjuga o infinitivo pessoal de 'falar' na 3ª pessoa do singular» → a: «Infinitivo pessoal de 'falar' en 3.ª persona del singular (ele/ela)»
- `data.back` — de: «falar ele/ela» → a: «ele falar»
- `data.example` — de: «Falar ela assim é surpreendente.» → a: «É estranho ele falar assim.»
- `esContrast` — de: «En español 'hablar él/ella' no existe como forma independiente.» → a: «En 3.ª del singular el infinitivo pessoal coincide con el infinitivo simple: no lleva desinencia. El sujeto va delante ('ele falar'), nunca detrás.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[30] `dd32d1d7` · conjugation · b7-l1-infinitivo-pessoal — OK** 🟢

falar/nós → falarmos. Correcto, y la hintEs da las dos lecturas españolas («para que hablemos» / «al hablar nosotros»).

**[31] `4fd78c34` · conjugation · b7-l1-infinitivo-pessoal — OK** 🟢

ser/eles → serem. Correcto.

**[32] `daccd3f7` · conjugation · b7-l1-infinitivo-pessoal — OK** 🟢

ter/nós → termos. Correcto.

**[33] `34859506` · conjugation · b7-l1-infinitivo-pessoal — OK** 🟢

fazer/eles → fazerem. Correcto (y distinto de «fizerem», futuro do conjuntivo).

**[34] `89ecb8db` · conjugation · b7-l1-infinitivo-pessoal — OK** 🟢

partir/nós → partirmos. Correcto.

**[35] `9ab4fd77` · conjugation · b7-l1-infinitivo-pessoal — OK** 🟢

fazer/nós → fazermos. Correcto.

**[36] `474b0d6d` · error_correction · b7-l3-participio — OK** 🟢

Error plantado y corrección exactos: fazido → feito.

**[37] `b077af3b` · error_correction · b7-l3-participio — OK** 🟢

Error plantado y corrección exactos: dizido → dito.

**[38] `ccb65e45` · error_correction · b7-l1-infinitivo-pessoal — OK** 🟢

Correcto: «É importante nós estudarmos mais para o exame». Con sujeto expreso, el infinitivo se flexiona.

**[39] `8339f141` · error_correction · b7-l1-infinitivo-pessoal — OK** 🟢

Correcto: «Antes de eles chegarem…». Es el contexto canónico del infinitivo pessoal.

**[40] `b2a1d182` · fill_blank · b7-l3-participio — OK** 🟢

Correcto: «Eu já tinha escrito a carta quando ele ligou». Mais-que-perfeito composto bien construido.

**[41] `4f099982` · fill_blank · b7-l1-infinitivo-pessoal — OK** 🟢

Correcto: «Para nós chegarmos a tempo, temos de sair já». «Temos DE» es la forma europea, no «temos que».

**[42] `cdf698b3` · fill_blank · b7-l3-participio — OK** 🟢

Correcto: participio con valor adjetivo y concordancia femenina, «A loja está fechada aos domingos».

**[43] `ace36b02` · multiple_choice · b7-l3-participio — OK** 🟢

Clave correcta (escrito) y los dos distractores son plausibles sin ser trampa: «escrevido» es el regular falso y «escripto» la grafía anterior a 1911.

**[44] `20a6411f` · multiple_choice · b7-l1-infinitivo-pessoal — OK** 🟢

Clave correcta y la explicación desactiva la confusión que importa: «fizermos» es futuro do conjuntivo, no infinitivo pessoal.

**[45] `b7-ep-01` · fill_blank · b7-l2-gerundio — OK** 🟢

«o bebé está a dormir»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.

**[46] `b7-ep-04` · fill_blank · b7-l2-gerundio — OK** 🟢

«Eles continuam a morar no Porto»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.

**[47] `b7-ep-06` · fill_blank · b7-l2-gerundio — OK** 🟢

«Passei a tarde a arrumar o escritório»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.

**[48] `b7-ep-08` · fill_blank · b7-l2-gerundio — OK** 🟢

«estava a falar com outra pessoa»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.

**[49] `b7-ep-09` · fill_blank · b7-l2-gerundio — OK** 🟢

«Ficámos a conversar até à meia-noite»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.

**[50] `b7-ep-11` · fill_blank · b7-l2-gerundio — OK** 🟢

«A situação anda a piorar»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.

**[51] `b7-ep-13` · fill_blank · b7-l2-gerundio — OK** 🟢

«já todos estavam a jantar»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.

**[52] `b7-ep-15` · fill_blank · b7-l2-gerundio — OK** 🟢

«Ele passa o dia a ver vídeos no telemóvel»: estar/ficar/andar/continuar + A + INFINITIVO, que es lo que pide el portugués europeo. No admite alternatives, así que el gerundio brasileño se rechaza. Léxico europeo coherente (bebé, telemóvel, Ficámos con acento). Este es el lote que la cola 7 ya reparó y aguanta la relectura.


### b8.json

**[53] `0055b029` · listening · b8-l1-conectores-subordinadas-adverbiais — DUDA** 🟡

El ítem funciona: la answer «por isso» figura entre las options, el audio contiene los dos conectores y «passar no exame» es normal en PT-PT. Errata en el enunciado español que lee el alumno: «el conector consecutivos».

- `data.question` — de: «¿Cuál es el conector consecutivos en la frase?» → a: «¿Cuál es el conector consecutivo de la frase?»

**[54] `0106ee6b` · flashcard · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

Tarjeta muerta y mal definida. El front ya contiene la respuesta («levar (no sentido de…)») y el back es portugués sin una palabra de español, así que revelar no aporta nada; encima define «levar» como «tirar», que en portugués es 'quitar/sacar', no 'arrastrar'. Y es una tarjeta de vocabulario etiquetada con b8-oracoes-subordinadas: acertarla acredita mastery de subordinadas. El back se locuta.

- `data.front` — de: «levar (no sentido de 'tirar', 'arrastar')» → a: «llevarse, arrastrar (algo o a alguien)»
- `data.back` — de: «levar — tirar, arrastar, fazer seguir» → a: «levar»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[55] `03013ffe` · flashcard · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

Dos fallos de variante en un ítem. (a) El ejemplo «O filme que eu assisti é ótimo» usa «assistir» sin preposición, que es brasileño: en PT-PT rige «a» y el corpus del repo solo lo trae así («assistir à vindima», «assistia ao ofício») → «O filme a que assisti». (b) La glosa española escribe la palabra portuguesa: «La película que vi es ótima». El back (la definición) sí es correcto y no se toca.

- `data.example` — de: «O filme que eu assisti é ótimo.» → a: «O filme a que assisti é ótimo.»
- `esContrast` — de: «Igual que en ES: 'La película que vi es ótima' = 'O filme que eu assisti é ótimo'.» → a: «En portugués europeo 'assistir' (= ver algo) rige la preposición 'a': 'o filme A QUE assisti'. El español 'ver' no lleva preposición: 'la película que vi'.»

**[56] `102a053a` · translation · b8-l3-colocacao-pronominal — ERROR** 🔴

La glosa afirma lo contrario de lo que dice el diccionario: «'Achar' no significa 'achar' (encontrar)». Priberam da como acepción 1 de «achar» exactamente «deparar-se com algo… (sin. ENCONTRAR)». El verbo tiene los dos sentidos. Aparte, el ítem es un buen ejemplo de próclise tras «que» («Acho que o conseguirás») y la glosa no lo menciona pese a ser la lección de colocação pronominal.

- `esContrast` — de: «'Achar' no significa 'achar' (encontrar), sino 'creer/pensar'. En español: 'creo que lo lograrás'.» → a: «'Achar' significa las dos cosas: 'encontrar/hallar' (Priberam, acep. 1) y 'creer/pensar'. Aquí es 'creer'. Fíjate además en la colocación: tras 'que' el pronombre va DELANTE ('que o conseguirás').»

**[57] `10b05f5a` · flashcard · b8-l4-discurso-indireto — ERROR** 🔴

Front y back son la misma palabra: «conseguir» → «conseguir (lograr, conseguir)». La tarjeta pide «Traduce al portugués» y ya enseña el portugués; no hay nada que recordar. Además la glosa entre paréntesis se sintetiza en audio (el TTS lee el back tal cual) y es vocabulario etiquetado como b8-discurso-indireto. Triplica a 7a379c9b y 73018a82.

- `data.front` — de: «conseguir» → a: «lograr / ser capaz de (hacer algo)»
- `data.back` — de: «conseguir (lograr, conseguir)» → a: «conseguir»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[58] `1352e0af` · flashcard · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

La esContrast inventa un hecho: «en PT-BR se usa más el subjuntivo en la subordinada». No es cierto en ninguna dirección —si acaso el brasileño usa MENOS conjuntivo— y además mete PT-BR en la glosa de una base que es europea. El modo lo decide el verbo principal, que es lo que había que explicar.

- `esContrast` — de: «Similar al ES: 'Yo sé que él llegó' = 'Eu sei que ele chegou'. Pero en PT-BR se usa más el subjuntivo en la subordinada.» → a: «Igual que en español: 'Yo sé que él llegó' = 'Eu sei que ele chegou'. El modo lo decide el verbo principal: 'sei que chegou' (indicativo) frente a 'é possível que chova' (conjuntivo).»

**[59] `15492270` · flashcard · b8-l1-conectores-subordinadas-adverbiais — ERROR** 🔴

Régimen brasileño en la base europea: «Eu achei muita graça DA história dele». En portugués europeo «achar graça» rige «a» — atestiguado en el corpus del repo (Camilo, Amor de Perdição VIII: «acho graça á obediencia com que me deixo guiar»). La forma con «de/em» es de Brasil. Y la glosa española arranca en portugués: «No confundas com».

- `data.example` — de: «Eu achei muita graça da história dele.» → a: «Achei muita graça à história dele.»
- `esContrast` — de: «No confundas com 'achar' = pensar. 'Achar graça' = encontrar divertido.» → a: «No lo confundas con 'achar' = creer. 'Achar graça A algo' = encontrarlo gracioso; el régimen con 'de' es brasileño.»

**[60] `18e1b7bb` · translation · b8-l1-conectores-subordinadas-adverbiais — OK** 🟢

Traducción europea limpia: «Já que não existe outra opção, teremos DE aceitar AS SUAS condições» — perífrasis de obligación europea y posesivo con artículo. Las dos alternativas («uma vez que», «visto que») son equivalentes reales.

**[61] `1aaa2910` · verb_preposition · b8-l2-subordinadas-substantivas-adjetivas — DUDA** 🟡

Correcto: «Eu gosto de aprender novas expressões». El reparo es de curación: ítem de régimen preposicional etiquetado con b8-oracoes-subordinadas, concepto que no ejercita.

**[62] `1f6c7479` · translation · b8-l1-conectores-subordinadas-adverbiais — OK** 🟢

Traducción correcta en las dos direcciones y las dos alternativas españolas («así que», «por lo tanto») son legítimas.

**[63] `2772c62b` · translation · b8-l2-subordinadas-substantivas-adjetivas — DUDA** 🟡

Gramaticalmente impecable y bien europeo («Parámos» con acento y «estava a proteger»), lo que deja en evidencia que la etiqueta sourceLang «pt-br» es falsa. El reparo real es semántico: un coche que «protege una casa» solo se sostiene forzando la lectura (coche de seguridad). Huele a recombinación automática del vocabulario del bloque (proteger / carro / parar). Si se cambia, hay que rehacer el audio del lado portugués.

- `data.source` — de: «Parámos o carro que estava a proteger a casa.» → a: «Parámos o carro que estava a bloquear a entrada da casa.»
- `data.target` — de: «Paramos el coche que estaba protegiendo la casa.» → a: «Paramos el coche que estaba bloqueando la entrada de la casa.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[64] `294ade1e` · fill_blank · b8-l4-discurso-indireto — ERROR** 🔴

El ensamblado no significa nada: «Imagina que ele imaginasse que não existe nada para imaginar» — tres veces el mismo lema, mezcla de conjuntivo e indicativo y una pista, «(imagina → pergunta indireta)», que anuncia una pregunta indirecta que no aparece por ninguna parte. Y la esContrast llama IRREGULAR a «imaginar» para acto seguido compararlo con «falar», que es el paradigma regular: se contradice en una línea.

- `data.sentence` — de: «Imagina que ele ___ que não existe nada para imaginar. (imagina → pergunta indireta)» → a: «Ele pediu que eu ___ (imaginar) outro final. («Imagina outro final», disse ele)»
- `esContrast` — de: «Verbo irregular: "imaginar" → "imaginasse" (subjuntivo imperfecto), como "falar" → "falasse".» → a: «'Imaginar' es regular: el imperfecto de conjuntivo se forma sobre la 3.ª pl. del perfecto (imaginaram → imaginasse), igual que 'falar' → 'falasse'. En estilo indirecto, el imperativo del original pasa a conjuntivo.»

**[65] `29e9fe7f` · fill_blank · b8-l2-subordinadas-substantivas-adjetivas — OK** 🟢

Correcto, aunque trivial: «Eu sei que ele vai chegar amanhã». La glosa acierta al avisar de que aquí «que» no coordina, subordina.

**[66] `2fb35ada` · fill_blank · b8-l4-discurso-indireto — ERROR** 🔴

La alternative rompe la frase: «já tinha lido» dentro de «Ela contou que já ___ o livro» produce «que já JÁ tinha lido o livro», y FillBlankCard la da por CORRECTA. La answer principal («tinha lido») es buena.

- `data.blanks[0].alternatives` — de: «["já tinha lido"]» → a: «[]»

**[67] `33cf21fe` · verb_preposition · b8-l2-subordinadas-substantivas-adjetivas — DUDA** 🟡

Correcto: «precisamos de ajuda» es el régimen europeo, y «guião» es la palabra de Portugal. Reparo de curación: régimen preposicional etiquetado como b8-oracoes-subordinadas.

**[68] `38fd83bb` · flashcard · b8-l1-conectores-subordinadas-adverbiais — ERROR** 🔴

La esContrast hace una afirmación morfológica vacía y falsa —«pero sin tilde en PT-BR»: el español «existe» tampoco lleva tilde, no hay contraste ninguno— y luego invierte el registro: presenta «há» como «alternativa informal» cuando en portugués europeo «há» es el existencial NEUTRO y «existe» el marcado como formal o escrito. La tarjeta, además, está vacía (front y back son la misma palabra) y duplica a c4e1cba3, con el que comparte los dos hashes de audio.

- `data.front` — de: «¿Qué significa 'existe' en portugués?» → a: «hay / existe (registro formal)»
- `data.back` — de: «existe (existe, hay)» → a: «existe»
- `esContrast` — de: «'Existe' es casi idéntico al español, pero sin tilde en PT-BR. También existe → há (alternativa informal).» → a: «'Existe' se escribe igual que en español. En portugués europeo el existencial corriente es 'há' ('há um problema'); 'existe' suena más formal o escrito.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[69] `406abf88` · flashcard · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

Tarjeta muerta: back íntegramente en portugués, sin español, y front que ya da la palabra. Y el ejemplo lleva posesivo sin artículo, «estreou SEU primeiro longa-metragem», que es brasileño; en portugués europeo es «o seu». Vocabulario etiquetado con b8-oracoes-subordinadas.

- `data.front` — de: «realizador (cine)» → a: «director / directora (de cine o teatro)»
- `data.back` — de: «realizador(a) — diretor(a) de cinema/teatro» → a: «o realizador, a realizadora»
- `data.example` — de: «O realizador estreou seu primeiro longa-metragem.» → a: «O realizador estreou o seu primeiro filme.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[70] `4200fafc` · translation · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

La solución española es agramatical: «El realizador CUYO última película fracasó». «Cuyo» concuerda con lo poseído, que aquí es femenino: «cuya última película». Como TranslationCard compara contra data.target, el ítem exige teclear la forma incorrecta para puntuar.

- `data.target` — de: «El realizador cuyo última película fracasó fue contratado.» → a: «El realizador cuya última película fracasó fue contratado.»

**[71] `455cee1d` · translation · b8-l2-subordinadas-substantivas-adjetivas — OK** 🟢

Fuente portuguesa y solución española correctas, con «guião» europeo bien resuelto como «guión».

**[72] `5c51b100` · flashcard · b8-l1-conectores-subordinadas-adverbiais — ERROR** 🔴

La glosa enseña justo el calco que hay que evitar: «Igual que 'aunque' en español». No es igual — el español admite indicativo para el hecho real («aunque estaba enfermo»), pero «embora» exige SIEMPRE conjuntivo. Con esa equivalencia el alumno produce *«Embora estava doente», que es agramatical. Encima el front ya contiene el back entero, así que la tarjeta no evalúa nada.

- `data.front` — de: «Conector concessivo: 'embora' (aunque, si bien)» → a: «aunque / si bien (conector concesivo)»
- `data.back` — de: «embora (aunque, si bien, a pesar de que)» → a: «embora + conjuntivo»
- `esContrast` — de: «Igual que 'aunque' en español. Introduce una concessión real o hipotética.» → a: «Ojo, no es igual que 'aunque': el español admite indicativo ('aunque estaba enfermo'), pero 'embora' exige SIEMPRE conjuntivo ('embora estivesse doente'). Para el hecho real el portugués prefiere 'apesar de' + infinitivo.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[73] `5c666bbf` · translation · b8-l4-discurso-indireto — OK** 🟢

Discurso indirecto bien resuelto en las dos lenguas, incluida la alternativa «el día siguiente».

**[74] `5fd0932e` · verb_preposition · b8-l1-conectores-subordinadas-adverbiais — DUDA** 🟡

La respuesta es la europea: «Preciso DE descansar» (el brasileño suprime el «de»), y la answer figura entre las options. El reparo es de interfaz: VerbPrepositionCard solo traduce el glifo «—» a «(sin preposición)»; «∅» se pinta crudo y el alumno ve un símbolo sin explicar. b9978825 usa «—» para lo mismo.

- `data.options` — de: «["∅","de","para","a"]» → a: «["—","de","para","a"]»

**[75] `61e9dc90` · translation · b8-l1-conectores-subordinadas-adverbiais — DUDA** 🟡

No es error: Priberam registra «entretanto» como conjunción adversativa, sin marca de Brasil, así que no puedo llamarlo brasileñismo. Pero en portugués europeo la lectura dominante es temporal —en el corpus del repo las 25 ocurrencias son de tiempo, ninguna adversativa— y en «O relatório é completo; entretanto, falta rever as conclusões» el alumno oye antes 'mientras tanto'. «No entanto» o «todavia» no tienen esa ambigüedad. El resto del ítem es correcto, incluido «rever as conclusões».

- `data.acceptedAlternatives` — de: «["O relatório é completo; entretanto, falta rever as conclusões.","O relatório é completo; porém, falta rever as conclusões."]» → a: «["O relatório é completo; no entanto, falta rever as conclusões.","O relatório é completo; porém, falta rever as conclusões."]»
- `esContrast` — de: ««Sin embargo» se traduce por «contudo», «entretanto» o «porém» (este último más literario).» → a: ««Sin embargo» se traduce por «contudo», «no entanto» o «porém» (más literario). Evita «entretanto»: en portugués europeo se lee primero como 'mientras tanto'.»

**[76] `630329e4` · flashcard · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

Tarjeta sin contenido: «proteger» es cognado perfecto, el front ya es la palabra portuguesa y el back es una definición monolingüe en portugués. No hay nada que aprender ni que recordar, y la propia esContrast lo admite («cognado perfecto»). Lo correcto sería eliminarla; si se conserva, al menos que el front esté en español. Vocabulario etiquetado como b8-oracoes-subordinadas.

- `data.front` — de: «proteger» → a: «proteger, resguardar del peligro»
- `data.back` — de: «proteger — defender, preservar de perigo» → a: «proteger»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[77] `6bc826a5` · verb_preposition · b8-l3-colocacao-pronominal — ERROR** 🔴

La cuarta opción, «em / em», es basura de generación: no es una preposición, y contiene la respuesta correcta, de modo que quien la elija por eso falla. Y la esContrast es un círculo sin salida: «'Pensar en' se dice 'pensar EM' en PT, no 'pensar em' que ya es así».

- `data.options` — de: «["em","de","para","em / em"]» → a: «["em","de","para","com"]»
- `esContrast` — de: «'Pensar en' se dice 'pensar EM' en PT, no 'pensar em' que ya es así.» → a: «El español 'pensar en' se corresponde con 'pensar EM'. Ojo con 'pensar DE', que en portugués significa 'opinar sobre': 'O que pensas dele?'.»

**[78] `6eb4b5cf` · flashcard · b8-l1-conectores-subordinadas-adverbiais — ERROR** 🔴

Afirmación ortográfica falsa: «No lleva acento en PT-BR». «Porém» lleva acento agudo en las dos variantes — el propio front y el propio back del ítem lo escriben con acento, así que la glosa contradice a su propia tarjeta. Además el front ya contiene todo el back.

- `data.front` — de: «Conector adversativo: 'porém' (sin embargo, no obstante)» → a: «sin embargo / no obstante (conector adversativo)»
- `data.back` — de: «porém (sin embargo, no obstante, empero)» → a: «porém»
- `esContrast` — de: «Equivale a 'pero' con tono más formal. No lleva acento en PT-BR.» → a: «Equivale a 'sin embargo', más formal que 'mas'. Lleva acento agudo —'porém'— en las dos variantes.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[79] `6fa406f8` · translation · b8-l4-discurso-indireto — OK** 🟢

Correcto, y la alternativa «no había ningún problema» está bien admitida.

**[80] `7137d211` · translation · b8-l4-discurso-indireto — ERROR** 🔴

La solución «española» está a medias en portugués: «João CONTOU que NO DÍA anterior había dejado de fumar». «Contou» es el verbo portugués sin traducir y «no día» es la preposición portuguesa con tilde española encima. Como TranslationCard exige data.target literal, el ítem obliga a teclear esa mezcla; la única forma correcta está escondida en acceptedAlternatives.

- `data.target` — de: «João contou que no día anterior había dejado de fumar.» → a: «João contó que el día anterior había dejado de fumar.»

**[81] `73018a82` · flashcard · b8-l3-colocacao-pronominal — ERROR** 🔴

El front hace dos preguntas y el back solo contesta una: «¿Cómo se usa con pronombre?» se queda sin respuesta. La esContrast, además, no se sostiene: «'Conseguir' en español = 'obter, alcançar' en portugués. 'Conseguir' solo = lograr» — el español «conseguir» significa igualmente 'lograr' («conseguí terminarlo»), así que el falso amigo es inventado. Y está en la lección de colocação pronominal sin un solo pronombre.

- `data.front` — de: «¿Qué significa ‘conseguir’ en portugués? ¿Cómo se usa con pronombre?» → a: «lograr / poder (hacer algo)»
- `data.back` — de: «Significa ‘lograr, poder’. Ejemplo: Não consigo dormir. (No puedo dormir.)» → a: «conseguir — não consigo dormir»
- `esContrast` — de: «¡OJO! ‘Conseguir’ en español = ‘obter, alcançar’ en portugués. ‘Conseguir’ solo = lograr.» → a: «'Conseguir' no es falso amigo: en los dos idiomas vale 'obtener' y 'lograr'. Lo que cambia es la construcción — en portugués es constante 'conseguir + infinitivo' ('não consigo dormir').»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[82] `77538e3e` · verb_preposition · b8-l2-subordinadas-substantivas-adjetivas — DUDA** 🟡

Régimen y glosa correctos («tratar de + infinitivo»). El enunciado, en cambio, queda colgando: «antes de parar» — ¿de parar qué? Es una coletilla sin referente, otra huella de recombinación mecánica.

- `data.sentence` — de: «Vamos tratar ___ resolver a questão antes de parar.» → a: «Vamos tratar ___ resolver a questão antes da reunião.»

**[83] `7a379c9b` · flashcard · b8-l1-conectores-subordinadas-adverbiais — ERROR** 🔴

La glosa inventa un contraste que no existe: «'Conseguir' en español significa obtener. En PT se usa también para 'lograr'». En español «conseguir» también es 'lograr' («conseguí acabar a tiempo»); presentarlo como diferencia entre lenguas es exactamente el error sistemático que este proyecto arrastra. La tarjeta, además, triplica a 10b05f5a y 73018a82.

- `esContrast` — de: «'Conseguir' en español significa obtener. En PT se usa también para 'lograr' (conseguir fazer algo).» → a: «'Conseguir' no es falso amigo: en los dos idiomas vale 'obtener' y 'lograr'. Lo que cambia es la construcción: en portugués es muy frecuente 'conseguir + infinitivo' ('consegui resolver').»

**[84] `7f1fb792` · verb_preposition · b8-l1-conectores-subordinadas-adverbiais — DUDA** 🟡

Correcto, pero es la TERCERA copia de la misma frase en esta cola («Eu gosto ___ café pela manhã», igual que f00f5169 en b7 y b9978825 en b8), y usa el glifo «∅», que VerbPrepositionCard pinta crudo en vez de «(sin preposición)». Dos de las tres copias sobran.

- `data.options` — de: «["de","a","em","∅"]» → a: «["de","a","em","—"]»

**[85] `7f33e7ee` · flashcard · b8-l4-discurso-indireto — ERROR** 🔴

Tarjeta muerta: front «levar», back «levar (llevar, tardar)». El front ya es la respuesta y el back se sintetiza en audio con la glosa española dentro, así que la voz portuguesa lee «levar, llevar, tardar». Duplica a 0106ee6b y está etiquetada con b8-discurso-indireto siendo vocabulario.

- `data.front` — de: «levar» → a: «llevar / tardar (cierto tiempo)»
- `data.back` — de: «levar (llevar, tardar)» → a: «levar»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[86] `84eae918` · flashcard · b8-l1-conectores-subordinadas-adverbiais — ERROR** 🔴

La glosa describe mal la posición del conector: «Se coloca después del verbo en PT-BR, al inicio de la oración o detrás del sujeto». El «pois» causal encabeza SIEMPRE la oración que introduce —como en el propio ejemplo de la tarjeta, «…, pois estava cansado»— y nunca abre el período; el «pois» intercalado entre comas («Vamos, pois, começar») ya no es causal sino conclusivo. La glosa mezcla los dos usos y le cuelga a PT-BR una posición que no es. Encima el front contiene el back entero.

- `data.front` — de: «Conector causal: 'pois' (porque, ya que)» → a: «porque / ya que (conector causal)»
- `data.back` — de: «pois (porque, ya que / puesto que)» → a: «pois»
- `esContrast` — de: «Se coloca después del verbo en PT-BR, al inicio de la oración o detrás del sujeto.» → a: «Como conjunción causal, 'pois' encabeza siempre su oración y nunca abre el período: 'Não fui à festa, pois estava cansado'. Intercalado entre comas ('Vamos, pois, começar') ya no es causal, sino conclusivo.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[87] `8a92e893` · listening · b8-l4-discurso-indireto — OK** 🟢

La answer figura entre las options y la transformación es la correcta: presente → imperfeito es lo que hace el estilo indirecto tras «disse». La glosa española acierta al descartar «pudieron».

**[88] `8c10745a` · fill_blank · b8-l4-discurso-indireto — OK** 🟢

Correcto: «Ele disse que bebia um café todas as manhãs», con la pista del estilo directo entre paréntesis, que es justo lo que le falta a otros ítems del lote.

**[89] `8cb5e279` · translation · b8-l2-subordinadas-substantivas-adjetivas — DUDA** 🟡

Frase y traducción correctas, incluida «a quem deram» y el condicional «pararia». El reparo es ortográfico: «actor» es grafía anterior al Acordo de 1990 —hoy «ator»— en un bloque que ya escribe «diretor» y «ótimo». El repo no tiene norma fijada (conviven facto/fato, director/diretor), así que lo dejo como duda con la corrección lista; nótese que el lado portugués está locutado.

- `data.source` — de: «O actor a quem deram o guião confirmou que pararia de fumar para o papel.» → a: «O ator a quem deram o guião confirmou que pararia de fumar para o papel.»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[90] `8e08a177` · translation · b8-l2-subordinadas-substantivas-adjetivas — OK** 🟢

Correcto y bien europeo: «O guião que li era muito interessante».

**[91] `93b5ad3c` · translation · b8-l4-discurso-indireto — OK** 🟢

Correcto, con alternativa española legítima.

**[92] `9528acd6` · flashcard · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

Back sin una palabra de español —«pessoa que estreou / que faz sua estreia»— así que la tarjeta no enseña la equivalencia, que es para lo que existe. Y dentro del propio back hay un brasileñismo: «faz SUA estreia» sin artículo; en portugués europeo es «faz A SUA estreia». El back se locuta.

- `data.front` — de: «estreante» → a: «debutante (quien debuta)»
- `data.back` — de: «pessoa que estreou / que faz sua estreia» → a: «estreante — quem faz a sua estreia»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[93] `9b8559a3` · listening · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

La clave es lingüísticamente falsa y el ítem no es ganable. En «Parou de trabalhar para proteger quem ama», «quem» no tiene antecedente: la oración funciona como un nombre —es el complemento directo de «proteger»— y se clasifica como subordinada SUBSTANTIVA relativa sem antecedente (Ciberdúvidas, consultório, entradas sobre «orações subordinadas substantivas relativas sem antecedente»). No es adjetiva restritiva, porque no hay sustantivo al que modificar. Y esa etiqueta correcta no figura entre las cuatro opciones, así que ningún alumno que sepa gramática puede acertar. La esContrast repite el error.

- `data.answer` — de: «Subordinada adjetiva restritiva» → a: «Subordinada substantiva relativa (sem antecedente)»
- `data.options` — de: «["Subordinada adjetiva restritiva","Subordinada substantiva completiva nominal","Subordinada adverbial causal","Subordinada adjetiva explicativa"]» → a: «["Subordinada substantiva relativa (sem antecedente)","Subordinada adjetiva restritiva","Subordinada adverbial causal","Subordinada adjetiva explicativa"]»
- `esContrast` — de: «'Quem' como pronombre relativo significa 'quien/los que' en español; funciona igual en ambos idiomas.» → a: «'Quem' sin antecedente equivale a 'quien / la persona que' y la oración entera funciona como un nombre: aquí es complemento directo de 'proteger'. Por eso no es adjetiva.»

**[94] `a8604510` · flashcard · b8-l4-discurso-indireto — ERROR** 🔴

La tarjeta más vacía del lote: front «imaginar», back «imaginar (imaginar)». Se glosa la palabra consigo misma. Lo correcto es eliminarla; si se conserva, el front tiene que estar en español y el back ser solo la palabra portuguesa (el back se locuta). Vocabulario etiquetado como b8-discurso-indireto.

- `data.front` — de: «imaginar» → a: «imaginar, figurarse»
- `data.back` — de: «imaginar (imaginar)» → a: «imaginar»

> ⚠️ `rehacer: true` — el cambio toca texto locutado.

**[95] `a914bb8f` · translation · b8-l2-subordinadas-substantivas-adjetivas — DUDA** 🟡

La solución principal es correcta y la glosa sobre onde/aonde también. El reparo está en la alternativa aceptada, «A cidade onde eles filmaram o filme», con sujeto expreso innecesario y la repetición «filmaram o filme».

- `data.acceptedAlternatives` — de: «["A cidade onde eles filmaram o filme é muito bonita."]» → a: «["A cidade em que rodaram o filme é muito bonita."]»

**[96] `b332868a` · translation · b8-l2-subordinadas-substantivas-adjetivas — ERROR** 🔴

La glosa es ininteligible en español: «son aposiciones que no restrictivas». Falta la negación bien puesta y, de paso, las explicativas no son aposiciones, son relativas no restrictivas. La traducción del ítem es correcta.

- `esContrast` — de: «Las explicativas (con comas) son aposiciones que no restrictivas: puramente informativas.» → a: «Las explicativas van entre comas y no restringen al antecedente: solo añaden información. Las restrictivas, sin comas, seleccionan de entre varios.»

**[97] `b9978825` · verb_preposition · b8-l3-colocacao-pronominal — DUDA** 🟡

Correcto (y este sí usa el glifo «—», que la tarjeta traduce a «(sin preposición)»). El problema es que es la tercera copia literal de «Eu gosto ___ café pela manhã» dentro de la misma cola, junto a f00f5169 y 7f1fb792.

**[98] `bbc57636` · translation · b8-l4-discurso-indireto — OK** 🟢

Correcto: «tinha conseguido» → «había conseguido», con el nombre adaptado a «María».

**[99] `c4e1cba3` · flashcard · b8-l4-discurso-indireto — ERROR** 🔴

Duplicado exacto de 38fd83bb: mismo back («existe (existe, hay)»), mismo ejemplo salvo una palabra y LOS MISMOS DOS HASHES DE AUDIO. Encima es una tarjeta vacía —front «existe», back «existe»— y está etiquetada con b8-discurso-indireto siendo vocabulario. Lo que procede es borrarla, no corregirla.

