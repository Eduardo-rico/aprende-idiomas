# Lote industrial de avisos #2 (plantilla v1.2) — **PUBLICADO 2026-08-29 · FRENO: NO (0/3)**

**Constancia del muestreo** (106, 114, 122 — determinista): **0/3 con
error real** ⇒ publica sin revisión completa, según el pacto. La clase
«até» que frenó el lote 1 salió CURADA en la muestra («hasta las
siete incluso», «até ao fim do mês, inclusive»). Siete DISCUTIBLES de
estilo anotados en el informe (p. ej. «incluso»→«inclusive», «e já
não há maneira» trunco) — ninguno frena. El revisor validó además que
106 NO es cuarto corte de suministro (mantenimiento puntual de
antena). Y de la fase de máquina: los gates de molde CAZARON dos
arranques repetidos contra publicados (105↔66, 119↔90 — variados) y
el gate de palabras olió el clon estructural 108↔64 (cierre+
reapertura+alternativa, 0,373) que mi vigilancia manual dejó pasar —
rediseñado con la operación INVERSA (la piscina abre MÁS).

Sesión E2#6, 2026-08-29. Segundo lote industrial: **24 relays**
(`b2c2-med-105…128`), ancla `b10-l3-avisos-e-recados` · concepts
`[b10-relay-avisos]`. Método: plantilla → gates de máquina → muestreo
adversarial 10 % con FRENO (≥1 de 3 con error real ⇒ todo a mano).

## Restricciones heredadas de E2#5, cumplidas por diseño

- **«SIN cuarto corte de suministro»** (PENDIENTE E2#5): el lote 1
  acumuló tres avisos de la familia corte (agua med-39, luz med-61,
  fibra med-75) y quedó prohibido el cuarto. Este lote trae CERO
  dominios de corte — lo más cercano es la huelga de metro (123,
  servicios mínimos: transporte, no suministro) y las interrupciones
  breves de TV por ajuste de antena (106, mantenimiento puntual, no
  corte programado de servicio) — ambos declarados aquí para que el
  revisor los juzgue.
- **Clase «até + fecha» VIGILADA** (el bug que el freno cazó en el
  lote 1): todo deadline del lote conserva la INCLUSIVIDAD («como muy
  tarde el día X», «hasta el X incluido»); barrido propio antes del
  muestreo, y el muestreo lo re-barre.
- **Anti-molde nuevos de este lote** (la matriz varía la OPERACIÓN,
  no solo los datos): 111 invierte el señuelo aprendido (el nº de
  lote es DATO ESENCIAL con casilla positiva — quien aprendió «los
  números de referencia no viajan» en 62/75/84 se equivoca aquí);
  121 es un aviso SIN acción (casilla: «¿deja claro que NO hay que
  hacer nada?»); 116 sustituye el OBJETO (el libro del mes cambia,
  la cita no — ni día ni hora se mueven); 107 rectifica el LUGAR
  (no el día, que fue lo rectificado en 66 y 70).

## Matriz del lote (8 géneros × cupo 3 = 24 · 17/7 = 71/29)

| # | género | datos | mod | flags | dir | dominio |
|---|---|---|---|---|---|---|
| 105 | portal-infra | dia+franja+accion | simple | — | pt→es | revisión de extintores |
| 106 | portal-infra | dia+franja+condicion | simple | — | pt→es | ajuste de antena colectiva |
| 107 | portal-infra | dia+lugar+accion | **corregido** (2 avisos, LUGAR) | — | pt→es | poda del patio |
| 108 | cartel | dia+dia+lugar | simple | — | pt→es | piscina municipal |
| 109 | cartel | objeto+lugar+contacto | simple | — | pt→es | perro perdido |
| 110 | cartel | dia+franja+lugar+condicion | simple | — | pt→es | donación de sangre |
| 111 | sms-servicio | objeto+accion+condicion | simple | **reordenar+lote-esencial** | pt→es | retirada de producto |
| 112 | sms-servicio | dia+accion+condicion | **condicional** | **señuelo** | pt→es | inspección del coche (IPO) |
| 113 | sms-servicio | objeto+lugar+franja | simple | — | pt→es | receta renovada |
| 114 | recado-voz | objeto+franja+accion | simple | **señuelo** | pt→es | zapatero |
| 115 | recado-voz | dia+objeto+accion | simple | — | pt→es | ensayo extra del coro |
| 116 | recado-voz | objeto+accion+contacto | simple | **señuelo** | es→pt | club de lectura |
| 117 | aviso-escolar | dia+objeto+accion | simple | — | pt→es | banco de manuales |
| 118 | aviso-escolar | objeto+dia+accion | simple | — | pt→es | rifa solidaria |
| 119 | aviso-escolar | dia+objeto+objeto | simple | — | es→pt | huerto escolar |
| 120 | email-servicio | dia+objeto+condicion+contacto | simple | **señuelo** | pt→es | talleres infantiles |
| 121 | email-servicio | dia+franja+condicion | simple | **sin-accion** | pt→es | rodaje en la calle |
| 122 | email-servicio | objeto+dia+accion | simple | **señuelo** | es→pt | fotos del colegio |
| 123 | app-notificacion | dia+franja+accion | simple | **reordenar** | es→pt | huelga de metro |
| 124 | app-notificacion | dia+accion+contacto | simple | **reordenar** | pt→es | alerta de calor |
| 125 | app-notificacion | dia+franja+lugar | simple | — | pt→es | procesión y bus desviado |
| 126 | nota-manuscrita | objeto+lugar+dia | simple | — | es→pt | aspiradora prestada |
| 127 | nota-manuscrita | franja+accion+condicion | simple | **señuelo** | es→pt | mensajero y sobre |
| 128 | nota-manuscrita | dia+franja+condicion | simple | — | es→pt | fiesta del vecino |

**Adyacencias declaradas** (una por ítem donde existe): 106 ↔ familia
corte (NO es corte: interrupciones breves por mantenimiento — a juicio
del revisor); 107 ↔ 66/70 (mod corregido; aquí se rectifica LUGAR);
108 «pavilhão» ↔ brainstorm E2#5 (dominio piscina virgen en corpus);
113 ↔ med-56 (familia salud/medicamento; la operación es recogida, no
toma); 114 ↔ med-63/76 (clase «listo-para-recoger»; twist: pago solo
en efectivo + señuelo); 115 ↔ med-79 (recado deportivo-musical; aquí
sin inscripción ni consecuencia); 118 «festa da escola» ↔ l8 med-100
(palabra); 121 ↔ obras-calle med-72 (aquí la calle queda ABIERTA y no
hay acción); 123 ↔ med-88 (transporte; operación distinta: huelga con
franjas, no cambio de puerta); 125 ↔ med-72 (corte de tránsito; aquí
lo clave es el DESVÍO del bus con parada provisional); 126 «3.º B» ↔
med-78 (vecina; objeto distinto); 127 ↔ l8 med-91 (recado de jefe;
aquí es entrega física con plazo); 128 ↔ med-80 (ruido; aquí es
invitación+disculpa, no queja). Dominios cotejados contra TODO el
registro acumulado (docs industrial-1, piloto, lotes 5-8).

---

### MED-105 · portal-infra · pt→es · simple
**sourceText:**
> «Manutenção anual dos extintores: quarta-feira, dia 17, das 9h às
> 12h, os técnicos percorrerão todos os pisos. Pede-se aos moradores
> que mantenham os patamares desobstruídos e acessíveis durante a
> intervenção.»
**audience:** «tu compañero de piso español»
**instructionsEs:** «El aviso está en el portal. Cuéntaselo.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día y la franja (miércoles 17, de 9 a 12)?
2. ¿Traslada el qué (revisión anual de los extintores, piso por piso)?
3. ¿Traslada la acción (dejar los rellanos despejados y accesibles)?
4. ¿Español natural, sin lusismos («moradores», «patamares»,
   «desobstruídos»), entre 25 y 60 palabras?

**modelAnswer**:
> Cosa sencilla esta vez: el miércoles 17, de nueve a doce, pasan los
> técnicos a revisar los extintores por todos los pisos — mantenimiento
> anual. Solo piden que ese rato dejemos los rellanos despejados, sin
> cajas ni trastos, para poder pasar.

### MED-106 · portal-infra · pt→es · simple
**sourceText:**
> «Informam-se os condóminos de que na terça-feira, dia 23, de manhã,
> será afinada a antena coletiva do prédio. O sinal de televisão
> poderá sofrer interrupções breves entre as 9h e as 12h30. Caso o
> sinal não regresse ao normal depois das 13h, os moradores devem
> sintonizar novamente os canais.»
**audience:** «tu compañera de piso española, que teletrabaja con la
tele de fondo»
**instructionsEs:** «El aviso está en el tablón. Cuéntaselo.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día y la franja (martes 23 por la mañana, cortes
   breves de señal entre las 9 y las 12:30)?
2. ¿Traslada el motivo (ajustan la antena colectiva del edificio)?
3. ¿Traslada la condición (si después de las 13h la señal sigue rara,
   hay que resintonizar los canales)?
4. ¿Español natural, sin lusismos («afinada», «condóminos»), entre 30
   y 65 palabras?

**modelAnswer**:
> Para que no te pille en directo: el martes 23 por la mañana ajustan
> la antena del edificio y la tele puede dar cortes breves entre las
> nueve y las doce y media. Si a partir de la una la señal sigue rara,
> toca resintonizar los canales — es un momento.

### MED-107 · portal-infra · pt→es · **corregido (DOS avisos, se rectifica el LUGAR)**
**sourceText:**
> «[Aviso de segunda-feira] Poda das árvores do pátio NORTE:
> quinta-feira, dia 25, durante a manhã. Pede-se que não estacionem
> bicicletas junto às árvores.
>
> [Aviso de hoje] RETIFICAÇÃO: a poda de quinta-feira realiza-se no
> pátio SUL, e não no pátio norte como foi anunciado. Dia e restantes
> indicações mantêm-se.»
**audience:** «tu compañero español — su bici duerme en el patio sur»
**instructionsEs:** «Los dos avisos están en el tablón. UN mensaje con
el estado final — a él le afecta justo el cambio.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿El estado final es el correcto: la poda del jueves 25 por la
   mañana es en el patio SUR (el norte solo como anulado, o ausente)?
2. ¿Aterriza lo que le afecta (su bici está en el sur: que la quite de
   junto a los árboles)?
3. ¿Español natural, sin lusismos («poda» vale, «estacionem»), entre
   25 y 60 palabras?

**modelAnswer**:
> Ojo, que lo han cambiado: la poda del jueves 25 por la mañana es al
> final en el patio SUR — donde duerme tu bici —, no en el norte como
> pusieron primero. Quita la bici de junto a los árboles la noche
> antes, por si acaso.

### MED-108 · cartel · pt→es · simple · **operación inversa: la piscina abre MÁS** (v2: el molde cierre+reapertura+alternativa calcaba med-64 — lo olió el gate de palabras a 0,373 y se rediseñó)
**sourceText:**
> «Piscina Municipal — noites de verão: às sextas-feiras de setembro,
> horário alargado até às 24h. A partir das 21h, entrada a preço
> reduzido (2 €). Lotação limitada; a última entrada é às 23h.»
**audience:** «tu madre, de visita, a la que le encanta nadar»
**instructionsEs:** «El cartel está en la puerta de la piscina. Dale
la buena noticia con la letra pequeña.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada la ampliación (los viernes de septiembre la piscina abre
   hasta las 24h)?
2. ¿Traslada el precio (desde las 21h, entrada reducida a 2 €)?
3. ¿Traslada la letra pequeña (aforo limitado; última entrada a las
   23h)?
4. ¿Español natural, sin lusismos («alargado», «lotação»), entre 25 y
   60 palabras?

**modelAnswer**:
> Mamá, plan para ti: los viernes de septiembre la piscina municipal
> abre hasta medianoche, y a partir de las nueve la entrada baja a dos
> euros. Solo dos cosas: hay aforo limitado y la última entrada es a
> las once. ¿Nos vamos el viernes a nadar de noche?

### MED-109 · cartel · pt→es · simple
**sourceText:**
> «PERDEU-SE cão de água português, castanho, atende por Farrusco.
> Visto pela última vez no jardim da Estrela. Usa coleira azul com
> chapa. Recompensa-se. Contactar: 933 210 480 (qualquer hora).»
**audience:** «tu amiga española, que pasea a su perra por ese parque
cada tarde»
**instructionsEs:** «El cartel está en la verja del parque. Pásaselo —
ella es la que más ojo puede echar.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el objeto (se perdió un perro de aguas portugués, marrón,
   responde a Farrusco, collar azul con chapa)?
2. ¿Traslada el lugar (visto por última vez en el jardín de la
   Estrela)?
3. ¿Traslada el contacto (933 210 480, a cualquier hora; hay
   recompensa)?
4. ¿Español natural, sin lusismos («atende por», «coleira»), entre 25
   y 60 palabras?

**modelAnswer**:
> Tú que vas cada tarde a la Estrela: se ha perdido por ahí un perro
> de aguas portugués, marrón, que responde a Farrusco — lleva collar
> azul con chapa. Si lo ves, llama al 933 210 480 a cualquier hora;
> dan recompensa.

### MED-110 · cartel · pt→es · simple
**sourceText:**
> «Dádiva de sangue — unidade móvel no Largo da Feira, sábado, dia
> 21, das 8h30 às 13h. Podem dar sangue maiores de 18 anos com
> documento de identificação. Não é necessário estar em jejum;
> recomenda-se tomar o pequeno-almoço.»
**audience:** «tu primo español, que quería donar desde que llegó»
**instructionsEs:** «El cartel está en la plaza. Dale todo lo que
necesita saber.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada día, franja y lugar (sábado 21, de 8:30 a 13, unidad
   móvil en el Largo da Feira)?
2. ¿Traslada la condición (mayores de 18, con documento de
   identidad)?
3. ¿Traslada el matiz del ayuno (NO hace falta ir en ayunas; mejor
   desayunar)?
4. ¿Español natural, sin lusismos («dádiva», «em jejum» resuelto),
   entre 30 y 65 palabras?

**modelAnswer**:
> Ya puedes donar: el sábado 21 ponen la unidad móvil de sangre en el
> Largo da Feira, de ocho y media a una. Solo piden ser mayor de 18 y
> llevar el documento de identidad. Y ojo, que aquí es al revés de lo
> que crees: no hay que ir en ayunas — recomiendan desayunar antes.

### MED-111 · sms-servicio · pt→es · **reordenar + el nº de lote es ESENCIAL**
**sourceText:**
> «SuperPreço informa: por precaução, retirámos do mercado o queijo
> fresco da marca Vale Verde, LOTE VV-0812, por possível presença de
> listéria. Se tiver este produto em casa, não o consuma. Pode
> devolvê-lo em qualquer loja, com ou sem talão, para reembolso
> integral.»
**audience:** «tu compañera de piso española — el queso lo compró
ella ayer»
**instructionsEs:** «El SMS llegó a tu móvil. Lo urgente primero — y
esta vez el número SÍ importa.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿La PRIMERA frase impide que se lo coma (no comer el queso fresco
   Vale Verde: retirado por posible listeria)?
2. ¿Incluye el NÚMERO DE LOTE (VV-0812) para que compruebe el suyo?
   (Aquí la referencia es esencial — sin lote no puede saber si su
   queso es el retirado.)
3. ¿Traslada la devolución (cualquier tienda, con o sin ticket,
   reembolso íntegro)?
4. ¿Español natural, entre 30 y 65 palabras?

**modelAnswer**:
> ¡No te comas el queso fresco que compraste ayer sin mirarlo antes!
> Han retirado el Vale Verde, lote VV-0812, por posible listeria —
> comprueba el número en el envase. Si es ese, lo devuelves en
> cualquier tienda, con o sin ticket, y te dan todo el dinero.

### MED-112 · sms-servicio · pt→es · condicional + señuelo
**sourceText:**
> «Centro de Inspeções AutoCheck [ref.ª CI-2244]: a inspeção periódica
> obrigatória do seu veículo vence a 30 de setembro. Agende até essa
> data pelo 210 555 777 ou no nosso site. Circular com a inspeção
> caducada implica coima a partir de 250 €.»
**audience:** «tu padre español — el coche que usa aquí está a tu
nombre»
**instructionsEs:** «El SMS llegó a tu móvil, pero el coche lo mueve
él. Dile qué hay que hacer y qué pasa si no.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el plazo INCLUSIVO (la ITV del coche vence el 30 de
   septiembre: agendar como muy tarde ese día, por teléfono 210 555
   777 o web)?
2. ¿Traslada la consecuencia (circular con la inspección caducada:
   multa desde 250 €)?
3. ¿La respuesta NO incluye la referencia interna (CI-2244)?
4. ¿Español natural («coima» resuelto como multa), entre 30 y 65
   palabras?

**modelAnswer**:
> Papá, lo de la ITV del coche: vence el 30 de septiembre, así que hay
> que pedir cita como muy tarde ese mismo día — al 210 555 777 o por
> la web. No lo dejes pasar, que circular con la inspección caducada
> son 250 euros de multa para arriba.

### MED-113 · sms-servicio · pt→es · simple
**sourceText:**
> «SNS: a sua receita renovada já está disponível. Pode levantá-la na
> receção do Centro de Saúde da Alameda, das 8h às 18h, apresentando
> o cartão de utente. Validade da receita: 60 dias.»
**audience:** «tu suegra española, de visita larga — la receta es
suya»
**instructionsEs:** «El SMS llegó a tu número porque tú la
registraste. Pásaselo con todo.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el objeto (su receta renovada, lista)?
2. ¿Traslada lugar y franja (recepción del Centro de Salud de la
   Alameda, de 8 a 18, con la tarjeta de usuaria)?
3. ¿Traslada la validez (60 días)?
4. ¿Español natural, sin lusismos («levantar», «cartão de utente»
   resuelto), entre 25 y 60 palabras?

**modelAnswer**:
> Ya está lista tu receta renovada. Se recoge en la recepción del
> Centro de Salud de la Alameda, de ocho a seis, enseñando tu tarjeta
> sanitaria. Sin prisa pero sin pausa: la receta vale sesenta días.

### MED-114 · recado-voz · pt→es · señuelo
**sourceText** (mensaje de voz):
> «Boa tarde, é do sapateiro da Rua do Norte. As botas castanhas já
> estão prontas — ficou em 18 euros, e atenção que só aceitamos
> dinheiro. Pode passar até às 19h; guarde o talão n.º 47 se ainda o
> tiver, mas não é preciso.»
**audience:** «tu novia española — las botas son suyas»
**instructionsEs:** «El recado llegó a tu móvil. Dile lo que necesita
para recogerlas sin viaje en balde.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el objeto y el precio (sus botas marrones listas, 18 €)?
2. ¿Traslada el aviso clave (SOLO aceptan efectivo)?
3. ¿Traslada la franja (pasar hasta las 19h — incluida)?
4. ¿La respuesta NO exige el número de ticket (el propio recado dice
   que no hace falta)?
5. ¿Español natural, entre 25 y 60 palabras?

**modelAnswer**:
> Amor, tus botas marrones ya están en el zapatero de la Rua do Norte:
> 18 euros — y lleva efectivo, que no aceptan tarjeta. Puedes pasar
> hoy hasta las siete incluso. El ticket no hace falta, así que ve
> ligera.

### MED-115 · recado-voz · pt→es · simple
**sourceText** (mensaje de voz):
> «Olá, fala o maestro Vidal. Marquei ensaio extra do coro para
> sábado às 10h, por causa do concerto. Tragam as partituras novas do
> Requiem — as azuis — e, quem puder, um atril. Não é obrigatório,
> mas conto convosco.»
**audience:** «tu pareja española, que canta contigo en el coro»
**instructionsEs:** «El recado entró en tu buzón. Cuéntaselo entero,
con el tono que tiene.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el ensayo (extra, sábado a las 10, por el concierto)?
2. ¿Traslada el objeto (las partituras nuevas del Réquiem — las
   azules — y, quien pueda, un atril)?
3. ¿Traslada el tono (no es obligatorio, pero el maestro cuenta con
   la gente)?
4. ¿Español natural, sin lusismos («atril» vale — coincide), entre 30
   y 65 palabras?

**modelAnswer**:
> Recado del maestro Vidal: ha puesto ensayo extra del coro el sábado
> a las diez, por el concierto. Hay que llevar las partituras nuevas
> del Réquiem — las azules — y, quien pueda, un atril. Dice que no es
> obligatorio… pero que cuenta con nosotros, ya lo conoces.

### MED-116 · recado-voz · es→pt · señuelo
**sourceText** (mensaje de voz de la coordinadora, en español):
> «Hola, guapo, soy Berta, la del club de lectura. Que la novela de
> este mes está agotada en todas partes — ISBN 978-84-663-1278-4, ni
> lo intentes. Así que cambiamos: leemos "El bosque", de la misma
> autora, capítulos uno a cinco. El día y la hora del club quedan
> igual, ¿eh? Si alguien ya compró la otra, que hable con Marta.»
**audience:** «o teu amigo português do clube, que não percebe a
Berta ao telefone»
**instructionsEs:** «Pásale el recado en portugués — lo que cambia y
lo que NO cambia.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el cambio de OBJETO (la novela del mes está agotada; en
   su lugar, «El bosque» de la misma autora, capítulos 1 a 5)?
2. ¿Deja claro lo que NO cambia (día y hora del club, iguales)?
3. ¿Traslada el contacto (quien ya compró la otra, que hable con
   Marta)?
4. ¿La respuesta NO incluye el ISBN?
5. ¿Portugués natural por tu, entre 30 y 65 palabras?

**modelAnswer**:
> Recado da Berta, do clube: o romance deste mês esgotou em todo o
> lado, por isso mudamos de livro — vamos ler «El bosque», da mesma
> autora, capítulos um a cinco. Atenção: o dia e a hora do clube ficam
> IGUAIS. E quem já tiver comprado o outro, que fale com a Marta.

### MED-117 · aviso-escolar · pt→es · simple
**sourceText:**
> «Banco de Manuais Escolares: a entrega dos manuais do ano passado
> decorre até sexta-feira, dia 19, na papelaria da escola. Os livros
> devem estar em estado aceitável (sem folhas soltas). Será entregue
> comprovativo, necessário para receber os manuais do próximo ano.»
**audience:** «tu pareja española — los libros del niño están en su
coche»
**instructionsEs:** «Circular en la mochila. Dile qué hay que hacer y
para cuándo — y por qué conviene el papelito.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el plazo INCLUSIVO (entregar los libros del año pasado
   hasta el viernes 19 incluido, en la papelería de la escuela)?
2. ¿Traslada la condición (en estado aceptable, sin hojas sueltas)?
3. ¿Traslada el porqué del comprobante (lo dan al entregar y hace
   falta para recibir los del año que viene)?
4. ¿Español natural, sin lusismos («manuais», «comprovativo»), entre
   30 y 65 palabras?

**modelAnswer**:
> Lo de los libros del cole que llevas en el coche: hay que
> entregarlos en la papelería de la escuela hasta el viernes 19, ese
> día todavía vale. Que estén decentes, sin hojas sueltas. Y guarda el
> comprobante que te den — sin él no nos dan los del año que viene.

### MED-118 · aviso-escolar · pt→es · simple
**sourceText:**
> «Rifa solidária da festa da escola: cada aluno leva hoje uma
> caderneta com 10 rifas a 2 € cada. As matrizes e o dinheiro devem
> ser devolvidos ao diretor de turma até dia 20. O sorteio realiza-se
> na festa de encerramento. Quem não quiser participar, devolve a
> caderneta completa.»
**audience:** «tu pareja española, que gestiona la mochila del niño»
**instructionsEs:** «Circular del colegio. Lo práctico, con todos los
números.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el objeto (talonario de 10 papeletas a 2 € cada una, en
   la mochila hoy)?
2. ¿Traslada la devolución con plazo INCLUSIVO (matrices y dinero al
   tutor hasta el día 20 incluido; si no queréis participar, se
   devuelve el talonario entero)?
3. ¿Traslada el sorteo (en la fiesta de fin de curso)?
4. ¿Español natural, sin lusismos («caderneta», «diretor de turma»),
   entre 30 y 65 palabras?

**modelAnswer**:
> Hoy viene en la mochila un talonario de la rifa solidaria: diez
> papeletas a dos euros. Lo que vendamos — matrices y dinero — se
> entrega al tutor hasta el día 20; y si no queremos participar, se
> devuelve el talonario entero. El sorteo es en la fiesta de fin de
> curso.

### MED-119 · aviso-escolar · es→pt · simple
**sourceText** (circular del colegio español):
> «Familias de 3.º: el martes 24 inauguramos el huerto escolar. Los
> niños deben traer ese día botas de agua viejas y una botella
> reutilizable. La ropa, que sea de la que puede mancharse.»
**audience:** «o pai português da melhor amiga da tua filha — os
miúdos estão juntos no colégio espanhol»
**instructionsEs:** «Él no lee bien el español. Pásale la circular en
portugués.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el día y el qué (martes 24, se inaugura el huerto
   escolar)?
2. ¿Traslada los objetos (botas de agua viejas + botella
   reutilizable, ese día)?
3. ¿Traslada el detalle de la ropa (que pueda mancharse)?
4. ¿Portugués natural por tu (botas de agua→galochas, huerto→horta),
   entre 25 y 60 palabras?

**modelAnswer**:
> Vem aí a horta escolar: inauguram-na na terça, dia 24. As miúdas
> têm de levar nesse dia galochas velhas e uma garrafa reutilizável —
> e roupa que se possa sujar sem drama. A tua já tem galochas, ou
> emprestamos nós umas?

### MED-120 · email-servicio · pt→es · señuelo
**sourceText:**
> «Junta de Freguesia — oficinas de férias [sócio n.º 1188]: estão
> abertas as inscrições para as oficinas infantis de outubro
> (marionetas e cerâmica). 12 vagas por oficina, por ordem de
> chegada. Inscrição presencial ou por resposta a este email até dia
> 27. Dúvidas: 218 300 400.»
**audience:** «tu pareja española — el niño quiere lo de marionetas»
**instructionsEs:** «El email llegó a tu correo. Dile cómo apuntarlo
antes de que vuele la plaza.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el qué (talleres infantiles de octubre: marionetas y
   cerámica; 12 plazas por taller, por orden de llegada)?
2. ¿Traslada el cómo con plazo INCLUSIVO (inscripción presencial o
   respondiendo al email, hasta el 27 incluido)?
3. ¿Traslada el contacto de dudas (218 300 400)?
4. ¿La respuesta NO incluye el número de socio (1188)?
5. ¿Español natural, sin lusismos («oficinas» resuelto como talleres,
   «vagas»), entre 30 y 65 palabras?

**modelAnswer**:
> Han abierto los talleres infantiles de octubre en la junta:
> marionetas y cerámica, doce plazas por taller y por orden de
> llegada — así que el de marionetas conviene pedirlo ya. Se apunta en
> persona o respondiendo al email, hasta el 27 incluido. Dudas: 218
> 300 400.

### MED-121 · email-servicio · pt→es · **aviso SIN acción**
**sourceText:**
> «Câmara Municipal informa: na sexta-feira, dia 26, entre as 20h e as
> 2h, decorrerão filmagens na sua rua. Haverá iluminação intensa e
> algum ruído técnico. A rua permanece aberta ao trânsito e aos
> peões; não é necessária qualquer ação dos moradores. Agradecemos a
> compreensão.»
**audience:** «tu compañero de piso español, aprensivo con los líos
del barrio»
**instructionsEs:** «El email llegó al buzón vecinal. Cuéntaselo — y
que le quede claro si hay que hacer algo o no.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el hecho (viernes 26, de 20h a 2h: rodaje en nuestra
   calle, con mucha luz y algo de ruido técnico)?
2. ¿Deja EXPLÍCITO que no hay que hacer nada (la calle sigue abierta
   a coches y peatones; cero acciones para los vecinos)?
3. ¿Español natural, sin lusismos («filmagens», «peões»), entre 25 y
   60 palabras?

**modelAnswer**:
> Tranquilo, que esto es de las buenas: el viernes 26, de ocho de la
> tarde a dos de la madrugada, ruedan una película en nuestra calle —
> habrá focos potentes y algo de ruido técnico. No hay que hacer
> nada de nada: la calle sigue abierta para coches y peatones.

### MED-122 · email-servicio · es→pt · señuelo
**sourceText** (email del fotógrafo del colegio, en español):
> «Estimadas familias: ya están disponibles las fotos escolares en
> nuestra galería web. Acceso con el código familiar que va en la
> agenda del alumno. Los pedidos se realizan en la propia web hasta
> fin de mes (ejemplo de pedido: FT-2231). Después, la galería se
> cierra.»
**audience:** «o pai português do colégio, que não percebeu o email»
**instructionsEs:** «Pásaselo en portugués con lo esencial.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el objeto (las fotos escolares ya están en la galería
   web; se entra con el código familiar de la agenda del alumno)?
2. ¿Traslada el plazo INCLUSIVO (pedidos en la web hasta fin de mes;
   después cierran la galería)?
3. ¿La respuesta NO incluye el ejemplo de pedido (FT-2231)?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> As fotografias da escola já estão na galeria online — entras com o
> código da família, aquele que vem na caderneta do teu filho. As
> encomendas fazem-se no próprio site até ao fim do mês, inclusive;
> depois disso fecham a galeria e já não há maneira.

### MED-123 · app-notificacion · es→pt · reordenar
**sourceText** (notificación de la app de transporte, en español):
> «Huelga parcial de Metro mañana jueves. Servicios mínimos
> garantizados solo de 6:30 a 9:30 y de 16:00 a 19:00. Fuera de esas
> franjas, estaciones cerradas. Líneas de autobús operativas con
> refuerzos.»
**audience:** «a tua amiga portuguesa, de visita, que amanhã tem de
ir ao aeroporto às 11h»
**instructionsEs:** «Le pilla de lleno. Lo urgente primero, en
portugués.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿La PRIMERA frase mata su plan (a las 11h el metro estará CERRADO:
   la huelga solo garantiza 6:30–9:30 y 16:00–19:00)?
2. ¿Traslada la alternativa (autobuses funcionando con refuerzos — o
   salir dentro de la franja de la mañana)?
3. ¿Portugués natural por tu, entre 30 y 65 palabras?

**modelAnswer**:
> Más vale que lo sepas ya: às 11h não vais ter metro — amanhã há
> greve parcial e só garantem serviço das 6h30 às 9h30 e das 16h às
> 19h; fora disso, estações fechadas. Ou sais mais cedo, dentro da
> faixa da manhã, ou vais de autocarro, que reforçaram as linhas.

### MED-124 · app-notificacion · pt→es · reordenar
**sourceText:**
> «Proteção Civil: aviso de calor extremo HOJE e amanhã, com máximas
> acima de 40 ºC. Evite a rua entre as 11h e as 17h, beba água com
> frequência e não deixe crianças nem animais em viaturas. Linha de
> apoio a idosos: 800 200 100.»
**audience:** «tu abuela española, que llegó ayer de visita»
**instructionsEs:** «La alerta saltó en tu móvil. Díselo con cariño —
lo de hoy primero.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿La PRIMERA frase aterriza lo de HOY (ola de calor extremo hoy y
   mañana, más de 40º: no salir entre las 11 y las 17)?
2. ¿Traslada los cuidados (beber agua a menudo; nada de niños ni
   animales en el coche)?
3. ¿Traslada el teléfono de apoyo a mayores (800 200 100)?
4. ¿Español natural y con el tono que pide la consigna, entre 30 y 65
   palabras?

**modelAnswer**:
> Abuela, hoy no me salgas a la calle entre las once y las cinco, que
> están avisando de más de 40 grados hoy y mañana. Ve bebiendo agua
> aunque no tengas sed, ¿eh? Y apunta este teléfono de apoyo a
> mayores, por si acaso: 800 200 100.

### MED-125 · app-notificacion · pt→es · simple
**sourceText:**
> «Câmara Municipal: sábado, dia 28, entre as 17h e as 20h, o trânsito
> na Rua Direita estará cortado para a procissão das festas. A
> carreira 12 é desviada; paragem provisória no Largo do Cruzeiro.»
**audience:** «tu tía española, que vuelve el sábado en el bus 12
cargada del mercado»
**instructionsEs:** «La notificación saltó en tu móvil. Dile cómo le
afecta — y dónde bajarse.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el corte (sábado 28, de 17 a 20: la Rua Direita cortada
   por la procesión de las fiestas)?
2. ¿Traslada lo que le toca (el bus 12 va desviado; parada
   provisional en el Largo do Cruzeiro)?
3. ¿Español natural, sin lusismos («carreira», «paragem»), entre 25 y
   60 palabras?

**modelAnswer**:
> Tía, para el sábado: de cinco a ocho cortan la Rua Direita por la
> procesión de las fiestas, y tu bus, el 12, va desviado. Te tocará
> bajarte en la parada provisional del Largo do Cruzeiro — está a dos
> minutos del portal, no te cargues mucho.

### MED-126 · nota-manuscrita · es→pt · simple
**sourceText** (nota de tu compañera española):
> «¡Hola! Le presté la aspiradora a la del 3.º B, que tiene a los
> nietos este finde. Me prometió devolverla el lunes. Si la
> necesitas antes, sube a pedírsela sin apuro, que es majísima.»
**audience:** «o teu colega de casa português, a quem toca aspirar
este fim de semana»
**instructionsEs:** «La nota está en la nevera y él no lee español.
Pásasela en portugués.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el objeto y dónde está (la aspiradora, prestada a la
   vecina del 3.º B, que tiene a los nietos el finde)?
2. ¿Traslada el plazo (la devuelve el lunes)?
3. ¿Traslada la salida (si la necesitas antes, sube a pedírsela con
   confianza — es muy maja)?
4. ¿Portugués natural por tu (aspiradora→aspirador), entre 25 y 60
   palabras?

**modelAnswer**:
> Recado da Carmen: o aspirador está emprestado à vizinha do 3.º B,
> que tem os netos cá este fim de semana. Ela devolve-o na
> segunda-feira. Se precisares dele antes, sobe e pede-lho à vontade —
> diz a Carmen que é uma querida.

### MED-127 · nota-manuscrita · es→pt · señuelo
**sourceText** (nota del jefe español en tu mesa):
> «Pásate por recepción antes de las 12: viene un mensajero a por el
> sobre marrón que está en mi bandeja (albarán MR-5560, ya
> cumplimentado). Si a las 12 no ha venido, déjaselo a Sofía en
> recepción y vete a comer tranquilo.»
**audience:** «a Sofía, da receção — portuguesa; deixas-lhe uma nota
por escrito»
**instructionsEs:** «Redacta EN PORTUGUÉS la nota que le dejarías a
Sofía con lo que le toca A ELLA (el mensajero puede llegar cuando tú
ya no estés).»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada a Sofía SU parte (viene un mensajero a por el sobre
   marrón; si llega después de las 12, entregárselo ella — el sobre
   queda con ella)?
2. ¿Traslada la franja (el mensajero estaba citado antes de las 12)?
3. ¿La nota NO incluye el número de albarán (va cumplimentado dentro;
   a Sofía no le hace falta)?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> Sofía, deixo contigo o envelope castanho do meu chefe: vem aí um
> estafeta buscá-lo, em princípio antes do meio-dia. Se ele chegar
> depois das 12, entregas-lho tu, pode ser? A papelada já vai
> preenchida lá dentro. Obrigado!

### MED-128 · nota-manuscrita · es→pt · simple
**sourceText** (nota del vecino español en el buzón):
> «¡Hola, vecinos! El sábado 30 celebro mi despedida de soltero en
> casa, de 21h a 2h como muy tarde. Pido disculpas por adelantado por
> el ruido — intentaremos ser razonables. ¡Y estáis invitados a pasar
> a brindar cuando queráis!»
**audience:** «o teu colega de casa português, que trabalha no
domingo de manhã»
**instructionsEs:** «La nota apareció en el buzón. Cuéntasela entera —
lo bueno y lo malo.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el hecho con día y franja (sábado 30, fiesta de
   despedida de soltero del vecino, de 21h a 2h como muy tarde)?
2. ¿Traslada la disculpa por el ruido (avisa por adelantado; intentan
   ser razonables)?
3. ¿Traslada la invitación (podemos pasar a brindar cuando queramos)?
4. ¿Portugués natural por tu (despedida de soltero→despedida de
   solteiro), entre 25 y 60 palabras?

**modelAnswer**:
> Notícia agridoce para ti, que trabalhas domingo: o vizinho espanhol
> faz a despedida de solteiro em casa no sábado 30, das 21h às 2h no
> máximo — pede desculpa já pelo barulho. A parte boa: estamos
> convidados a passar lá para um brinde quando quisermos.

---

## Muestreo adversarial del 10 % con FRENO

Muestra determinista (cada octavo, empezando en 106): **106, 114,
122** — 3/24 = 12,5 %. Regla pactada: ≥1 de 3 con error real ⇒ FRENO,
el lote entero a mano. Error real (fijado ANTES del informe) =
falsedad lingüística en sourceText/modelo/rúbrica; casilla que el
modelo no tica; dato inventado/alterado/omitido; calco no declarado;
rúbrica no binaria; **deadline que pierda inclusividad («até»)**.
Estilo/preferencia = anotar, no frenar.

## Recuentos y gates (SALIDA PEGADA — se rellena antes de publicar)

```
(pendiente: publicador + gates de molde + virginidad)
```

## Sellos

`variantStatus: 'unchecked'` + `variantVerificacion: 'Línea B
aviso-v1.2 lote industrial 2: plantilla + muestreo adversarial 12,5%
2026-08-29 (este doc)'`. Tags por matriz. El publicador valida ANTES
de escribir (schema, rangos, empaque, molde).
