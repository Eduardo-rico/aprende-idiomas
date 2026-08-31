# Lote industrial de PARADIGMA #1 — dirigido por déficit

**Sesión E2#11, 2026-09-01.** Primer lote de la era en que **ningún lote
elige tema**: los puntos salen de la tabla de déficit, no del gusto del
autor. Y salen los dos que el propio análisis de E2#10 destapó rotos:

| punto | antes | falta | por qué éste |
|---|---:|---:|---|
| `b5-futcomp-composto-real` | **0** | 12 | el concepto que llevaba su nombre acumulaba 54 ítems y **no enseñaba el futuro composto ni una vez**: eran «ir + infinitivo» |
| `b8-coloc-mesoclise` | **1** | 11 | es **el rasgo más característico del portugués europeo culto** y tenía un solo ítem, una ficha que lo explica sin que nadie lo practique |

**24 ítems: 12 + 12.** Cierra los dos puntos (0→12 y 1→13).

---

## 1 · Por qué esto puede ser industrial

Un punto de MORFOLOGÍA es el caso más limpio de derivación por
construcción que hay: la forma correcta **se calcula**. El lote no la
escribe, la pide a `scripts/lib/paradigma-pt.ts`, y el gate comprueba
cada ítem contra ese cálculo. Donde la línea de mediación derivaba la
clave aplicando una transformación declarada, aquí la deriva un
conjugador con 12 tests — incluida la excepción que la regla ingenua
esconde: **tras -r cae la consonante y el verbo se acentúa es falso para
los -ir** (`parti-lo`, `abri-la`, no *«partí-lo»*).

Y los distractores también se derivan, cada uno con su defecto nombrado:
- **ênclise** (`falará-me`) — el calco del hispanohablante, que coloca
  como en español;
- **próclise** (`me falará`) — correcta sólo si hay atractor, así que
  como distractor obliga a mirar si lo hay;
- **persona equivocada** — el mismo paradigma, otra casilla.

## 2 · La matriz

**Eje 1 · punto** (2): futuro composto · mesóclise.
**Eje 2 · verbo** (12): falar, dar, dizer, fazer, escrever, comprar,
vender, partir, abrir, trazer, levar, entregar. Cubre las tres
conjugaciones **y los tres únicos irregulares** (dizer, fazer, trazer),
que son los que rompen la regla del infinitivo entero.
**Eje 3 · persona** (5): eu, tu, ele, nós, eles.
**Eje 4 · contexto** (2): **sin atractor** → la forma marcada es la
correcta; **con atractor** (negación, adverbio, subordinada,
interrogativo) → la forma marcada es la INCORRECTA y gana la otra.

## 3 · El anti-atajo que gobierna el reparto

Si en los doce ítems de mesóclise la respuesta fuera siempre la
mesóclise, el alumno aprendería «elige la rara» y no habría aprendido la
regla. **Cuatro de los doce llevan atractor y su respuesta es próclise**;
la mesóclise ahí es el distractor. Lo mismo en futuro composto:
**cuatro de los doce se resuelven con futuro simple**, porque no hay
anterioridad que marcar.

Eso convierte el lote en un ejercicio de DISCRIMINAR, que es lo que
separa un ítem de C1 de uno de B1, y no de reconocer una forma.

Reparto medido de las claves, para que no se acierte por posición: se
cuenta por script en el publicador.

---

# Los 24 ítems

Formato: el punto, la derivación (verbo + clítico + persona + tiempo), la
forma que el conjugador calcula, el ítem, y el defecto de cada distractor.

## A · Futuro composto (`b5-futcomp-composto-real`) — 12

### PAR-01 · fill_blank · sin atractor
**derivación:** `futuroComposto('terminar', 'eu')` → **terei terminado**
**frase:** «Antes do almoço já ___ a apresentação. (terminar)»
**respuesta:** `terei terminado`
**glosa:** El futuro composto marca lo que estará ACABADO antes de otro
momento futuro. En español, «habré terminado».

### PAR-02 · fill_blank · sin atractor
**derivación:** `futuroComposto('sair', 'eles')` → **terão saído**
**frase:** «Quando o autocarro passar, os miúdos já ___ de casa. (sair)»
**respuesta:** `terão saído`
**glosa:** «Ya habrán salido»: acabado ANTES de que pase el autobús, no a
la vez. Y «quando passar» es futuro do conjuntivo, que el español no tiene.

### PAR-03 · fill_blank · sin atractor · irregular
**derivación:** `futuroComposto('fazer', 'nós')` → **teremos feito**
**frase:** «Até sexta ___ tudo o que ficou pendente. (fazer)»
**respuesta:** `teremos feito`
**glosa:** Participio irregular: «feito», no *«fazido»*. Y «até sexta»
incluye el viernes.

### PAR-04 · fill_blank · sin atractor · irregular
**derivación:** `futuroComposto('dizer', 'ele')` → **terá dito**
**frase:** «Quando o julgamento acabar, a testemunha já ___ tudo. (dizer)»
**respuesta:** `terá dito`
**glosa:** «Dito», no *«dizido»*. Es uno de los tres verbos que también
son irregulares en el futuro simple (dirá).

### PAR-05 · multiple_choice · CONTRASTE, gana el futuro simple
**frase:** «Amanhã de manhã ___ com o teu chefe sobre o aumento.»
**opciones:** [0] **falarás** ✅ · [1] terás falado · [2] falará · [3] tens falado
**defecto de cada distractor:** [1] futuro composto sin anterioridad que
marcar — no hay otro momento futuro con el que compararse; [2] persona
equivocada; [3] pretérito perfeito composto, que en portugués significa
repetición, no futuro.
**glosa:** Sin un segundo momento futuro al que anticiparse, el futuro
composto sobra: basta el simple.

### PAR-06 · multiple_choice · CONTRASTE, gana el futuro simple
**frase:** «Se calhar ___ o carro no próximo verão.»
**opciones:** [0] terei vendido · [1] venderá · [2] vendo · [3] **venderei** ✅
**defecto:** [0] no hay anterioridad; [1] persona equivocada; [2] presente por futuro.
**glosa:** «Se calhar» es la mitigación europea de «quizá», y no cambia
el tiempo: aquí la acción es simplemente futura.

### PAR-07 · multiple_choice · gana el compuesto
**frase:** «Quando vocês chegarem ao cinema, o filme já ___.»
**opciones:** [0] começará · [1] **terá começado** ✅ · [2] começa · [3] tinha começado
**defecto:** [0] futuro simple: dice que empieza DESPUÉS de que lleguen,
que es lo contrario; [2] presente; [3] pasado.
**glosa:** El «já» y la subordinada de futuro piden anterioridad: la
película ya habrá empezado.

### PAR-08 · multiple_choice · gana el compuesto · irregular
**frase:** «Até ao fim do mês ___ todas as facturas. (pagar)»
**opciones:** [0] pagarei · [1] pago · [2] **terei pago** ✅ · [3] tenho pago
**defecto:** [0] no marca que quede acabado ANTES del plazo; [1]
presente; [3] repetición en el pasado reciente.
**glosa:** Participio irregular: «pago», no *«pagado»*. «Até ao fim do
mes» incluye el último día.

### PAR-09 · fill_blank · sin atractor
**derivación:** `futuroComposto('escrever', 'tu')` → **terás escrito**
**frase:** «Antes de o sol se pôr, já ___ o discurso todo. (escrever)»
**respuesta:** `terás escrito`
**glosa:** Participio irregular: «escrito». Y «antes de o sol se pôr» es
infinitivo pessoal con sujeto propio, que es lo que el europeo usa aquí.

### PAR-10 · fill_blank · sin atractor
**derivación:** `futuroComposto('ver', 'nós')` → **teremos visto**
**frase:** «No fim da viagem ___ cinco cidades diferentes. (ver)»
**respuesta:** `teremos visto`
**glosa:** Participio irregular: «visto». Ojo: «ver» es regular en el
futuro simple (veremos) e irregular sólo en el participio.

### PAR-11 · multiple_choice · gana el compuesto
**frase:** «Daqui a dez anos esta empresa já ___ de dono três vezes.»
**opciones:** [0] mudará · [1] muda · [2] mudou · [3] **terá mudado** ✅
**defecto:** [0] futuro simple: no marca el balance acumulado; [1]
presente; [2] pasado.
**glosa:** Con un plazo futuro y un recuento («três vezes»), el
compuesto es el que hace el balance.

### PAR-12 · multiple_choice · CONTRASTE, gana el futuro simple
**frase:** «Não te preocupes: eu ___ contigo à consulta.»
**opciones:** [0] **irei** ✅ · [1] terei ido · [2] irá · [3] tenho ido
**defecto:** [1] anterioridad inexistente; [2] persona; [3] repetición
pasada.
**glosa:** Es una promesa, no un balance: futuro simple.

## B · Mesóclise (`b8-coloc-mesoclise`) — 12

### PAR-13 · multiple_choice · sin atractor
**derivación:** `mesoclise('dizer', 'te', 'eu')` → **dir-te-ei**
**frase:** «___ o resultado assim que souber alguma coisa.»
**opciones:** [0] **Dir-te-ei** ✅ · [1] Direi-te · [2] Te direi · [3] Dir-te-ia
**defecto:** [1] ênclise sobre el futuro — el calco español, que coloca
el clítico detrás de la forma entera; [2] próclise sin atractor que la
justifique; [3] condicional, otro tiempo.
**glosa:** En futuro y condicional el clítico va DENTRO: entre la raíz
(dir-) y la desinencia (-ei). Es la mesóclise, y es europea culta.

### PAR-14 · multiple_choice · sin atractor
**derivación:** `mesoclise('falar', 'me', 'ele')` → **falar-me-á**
**frase:** «O advogado ___ do processo assim que houver novidades.»
**opciones:** [0] falará-me · [1] falar-me-ia · [2] me falará · [3] **falar-me-á** ✅
**defecto:** [0] ênclise sobre el futuro; [1] condicional, otro tiempo;
[2] próclise sin atractor.
**glosa:** «Falar» + «me» + «-á»: el clítico se mete entre el infinitivo
y la desinencia del futuro.

### PAR-15 · multiple_choice · CON ATRACTOR, gana la próclise
**frase:** «Ele **não** ___ o preço antes de ver a casa toda.»
**opciones:** [0] dir-me-á · [1] dirá-me · [2] **me dirá** ✅ · [3] dir-me-ia
**defecto:** [0] la mesóclise es correcta en abstracto, **pero la
negación la cancela**: ése es el punto del ítem; [1] ênclise; [3]
condicional.
**glosa:** La negación es un atractor de próclise, y **el atractor manda
sobre la mesóclise**. Con «não», el clítico va delante: «não me dirá».

### PAR-16 · multiple_choice · CON ATRACTOR, gana la próclise
**frase:** «**Quem** ___ a notícia primeiro?»
**opciones:** [0] **te dará** ✅ · [1] dar-te-á · [2] dará-te · [3] dar-te-ia
**defecto:** [1] mesóclise cancelada por el interrogativo; [2] ênclise;
[3] condicional.
**glosa:** Los interrogativos («quem», «que», «onde») atraen el clítico
igual que la negación.

### PAR-17 · fill_blank · sin atractor · clítico de 3.ª
**derivación:** `mesoclise('comprar', 'o', 'ele')` → **comprá-lo-á**
**frase:** «Se o preço descer, ele ___ sem hesitar. (comprar + o)»
**respuesta:** `comprá-lo-á`
**glosa:** Con clítico de 3.ª persona cae la -r del infinitivo, el
clítico pasa a «-lo» y el tema se acentúa: comprar + o + á =
«comprá-lo-á».

### PAR-18 · fill_blank · sin atractor · la EXCEPCIÓN de los -ir
**derivación:** `mesoclise('partir', 'o', 'ele')` → **parti-lo-á**
**frase:** «O bolo é enorme; o pai ___ à mesa. (partir + o)»
**respuesta:** `parti-lo-á`
**glosa:** También cae la -r y aparece «-lo», **pero los verbos en -ir NO
se acentúan**: «parti-lo-á», no *«partí-lo-á»*. Es la excepción que la
regla de «tras -r el verbo se acentúa» esconde, porque los ejemplos que
se citan siempre son de -ar y -er.

### PAR-19 · multiple_choice · sin atractor · condicional
**derivación:** `mesoclise('dar', 'lhe', 'ele', 'condicional')` → **dar-lhe-ia**
**frase:** «Se pudesse, ___ um conselho, mas não me compete.»
**opciones:** [0] daria-lhe · [1] lhe daria · [2] **dar-lhe-ia** ✅ · [3] dar-lhe-á
**defecto:** [0] ênclise; [1] próclise sin atractor; [2] —; [3] futuro
donde la prótasis pide condicional.
**glosa:** La mesóclise también funciona en condicional: dar + lhe + ia.

### PAR-20 · multiple_choice · CON ATRACTOR, gana la próclise
**frase:** «**Talvez** ___ a casa mais cedo do que pensas.»
**opciones:** [0] vender-se-á · [1] **se venda** ✅ · [2] vendê-la-á · [3] venderá-se
**defecto:** [0] mesóclise cancelada por «talvez», que además pide
conjuntivo; [2] mismo problema y otro clítico; [3] ênclise.
**glosa:** «Talvez» antepuesto exige conjuntivo **y** atrae el clítico:
dos cosas a la vez. Pospuesto («Vende-se, talvez») llevaría indicativo.

### PAR-21 · fill_blank · sin atractor · irregular
**derivación:** `mesoclise('fazer', 'lhe', 'ele')` → **far-lhe-á**
**frase:** «O médico ___ alguns exames antes de decidir. (fazer + lhe)»
**respuesta:** `far-lhe-á`
**glosa:** «Fazer» es uno de los tres irregulares: el tema del futuro es
«far-», y la mesóclise se construye sobre él: far + lhe + á.

### PAR-22 · fill_blank · sin atractor · plural
**derivación:** `mesoclise('escrever', 'lhes', 'eles')` → **escrever-lhes-ão**
**frase:** «Os professores ___ assim que houver vagas. (escrever + lhes)»
**respuesta:** `escrever-lhes-ão`
**glosa:** Con clítico de 1.ª o 2.ª persona (y con «lhe/lhes») el tema
queda intacto: escrever + lhes + ão.

### PAR-23 · multiple_choice · CON ATRACTOR, gana la próclise
**frase:** «Ela disse **que** ___ o dinheiro na segunda-feira.»
**opciones:** [0] entregar-nos-á · [1] entregará-nos · [2] **nos entregará** ✅ · [3] entregar-nos-ia
**defecto:** [0] mesóclise cancelada por la subordinada; [1] ênclise; [3]
condicional donde la principal pide futuro.
**glosa:** La conjunción «que» de una subordinada es atractor: dentro de
la subordinada el clítico va delante.

### PAR-24 · multiple_choice · sin atractor · condicional irregular
**derivación:** `mesoclise('trazer', 'me', 'nós', 'condicional')` → **trar-me-íamos**
**frase:** «Se soubéssemos que era urgente, ___ os documentos hoje mesmo.»
**opciones:** [0] **trar-me-íamos** ✅ · [1] traríamos-me · [2] me traríamos · [3] trar-me-á
**defecto:** [1] ênclise; [2] próclise sin atractor; [3] futuro y persona
equivocadas.
**glosa:** «Trazer» es el tercer irregular: tema «trar-». Y en
condicional la desinencia de «nós» es «-íamos».
