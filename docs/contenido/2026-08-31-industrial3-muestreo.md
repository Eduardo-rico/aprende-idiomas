# Muestreo adversarial — lote industrial de avisos #3 (44 relays, `b2c2-med-141…184`)

Revisor: lingüista adversarial PT-PT (filólogo de Lisboa). Muestra fijada ANTES de la
lectura: **MED-145, MED-155, MED-165, MED-175, MED-179** (5/44 = 11,4 %).
Doc: `/Users/lalo/idiomas/portugues-app/docs/contenido/2026-08-30-lote-industrial-avisos-3.md`
JSON: `.../scratchpad/industrial3-candidatos.json`

**Criterio de ERROR REAL (fijado antes, no negociado aquí):** falsedad lingüística en
sourceText/modelAnswer/rúbrica (portugués no europeo, español no natural, palabra o
construcción inexistente); casilla que el propio modelAnswer no tica; dato del sourceText
inventado/alterado/omitido cuando la casilla lo exige; calco no declarado; rúbrica no
binaria o no autoevaluable; deadline que pierda la INCLUSIVIDAD. Estilo = DISCUTIBLE.

**Recuentos mecánicos** (`texto.split(/\s+/).filter(Boolean).length`, script sobre el JSON):
145 → **39** (25–55 ✓) · 155 → **56** (35–70 ✓) · 165 → **50** (30–65 ✓) ·
175 → **42** (25–55 ✓) · 179 → **57** (30–65 ✓). **Ningún ítem fuera de rango.**

---

## MED-145 · cartel · pt→es · farmacia de guardia — **PASA**

### (1) El sourceText es cartel real
> «Farmácia de serviço permanente esta semana: Farmácia Central, Rua da Sé, n.º 12.
> Atendimento noturno das 22h às 9h pelo postigo. Fora desse horário, funcionamento normal.»

Realia correcta y específicamente portuguesa: **«serviço permanente»** es la fórmula
administrativa real del turno de guardia en Portugal (no «de guarda», que sería el calco
esperable), **«postigo»** es el ventanuco nocturno de la farmacia, **«n.º 12»** es la
abreviatura EP, y **«noturno»** lleva la grafía del AO90 sin *c*. Sintaxis de cartel
(nominal, sin verbos). Nada que objetar.

### (2) modelAnswer contra rúbrica, casilla por casilla
> «Esta semana la farmacia de guardia es la Central, en la Rua da Sé número 12. De diez de
> la noche a nueve de la mañana atienden por la ventanilla, llamando al timbre. El resto
> del día abren normal.»

1. **Cuál y dónde (Farmácia Central, Rua da Sé, 12).** «la farmacia de guardia es la
   Central, en la Rua da Sé número 12». Ataqué la pérdida de «Farmácia»: en español la
   elipsis («la Central») es lo natural una vez dicho «farmacia», y el topónimo queda
   intacto y sin traducir, que es lo correcto. **TICA.**
2. **Franja nocturna (22→9) y cómo se atiende (por la ventanilla).** «De diez de la noche
   a nueve de la mañana atienden por la ventanilla». 22h = diez de la noche ✓, 9h = nueve
   de la mañana ✓, «ventanilla» ✓. **TICA.**
3. **Español natural, sin lusismos, 25–55.** «atienden por la ventanilla», «abren normal»:
   peninsular natural. **39 palabras.** **TICA.**

### (3) Datos contra el sourceText
| dato | fuente | modelo | |
|---|---|---|---|
| semana | esta semana | esta semana | ✓ |
| farmacia | Farmácia Central | la Central | ✓ |
| dirección | Rua da Sé, n.º 12 | Rua da Sé número 12 | ✓ (topónimo intacto) |
| franja | das 22h às 9h | de diez de la noche a nueve de la mañana | ✓ |
| modo | pelo postigo | por la ventanilla | ✓ |
| resto | funcionamento normal | el resto del día abren normal | ✓ |
| **timbre** | **—** | **«llamando al timbre»** | **añadido** |

### (4) Calcos
Ninguno, y esquiva la trampa que el ítem tiende: **«postigo» existe en español** (el
postigo de una puerta o una contraventana) pero **no designa el ventanuco de la farmacia**;
un traductor descuidado lo habría dejado tal cual y habría producido un falso amigo
perfecto. El modelo pone «ventanilla», que es exactamente lo que se dice en España.
«Atendimento» → «atienden» ✓, sin «atendimiento».

### (5) Recuento
39 palabras, rango 25–55 ✓.

### (6) Barrido de inclusividad
Sin deadline: «das 22h às 9h» es franja, no plazo. «Esta semana» ✓. Nada que degradar.

### Hallazgos
- **DISCUTIBLE — «llamando al timbre».** No está en el cartel. Lo interrogué con el test
  que ya se usó en los lotes 1–2 (¿es entrañamiento?, ¿es aportación propia del mediador
  marcada como suya?, ¿puede ser falsa?): no es entrañamiento de «pelo postigo» — un
  postigo se puede golpear, tener intercomunicador o campainha —, y sí puede ser falsa. Lo
  salva que la ampliación con conocimiento del mundo es una operación de mediación
  legítima y que ninguna casilla se rompe con ella. Pero la destinataria es una madre que
  va a plantarse ahí a las tres de la mañana: **a mano yo lo cortaría o lo marcaría como
  propio** («y me parece que hay que llamar al timbre»). No dispara el freno por sí solo.

**Veredicto: PASA** (0 errores reales, 1 discutible).

---

## MED-155 · recado-voz · pt→es · electricista — **ERROR REAL**

### (1) El sourceText es recado de voz real
> «É o eletricista. Não consigo trocar o quadro sem cortar a luz a todo o prédio, e isso só
> pode ser das 14h às 16h, com autorização do condomínio. Falem com o administrador e
> digam-me qualquer coisa. Se não der, faço só a tomada da cozinha.»

Portugués europeo oral de primera: apertura telefónica **«É o eletricista»** (no «Sou o»,
que sería calco), **«digam-me qualquer coisa»** — idiotismo EP exacto para «decidme algo» —,
**«se não der»**, **«a todo o prédio»**, ênclise correcta en el imperativo (**«digam-me»**),
y grafía AO90 sin *c* en «eletricista». Cero brasilerismos, cero gerundios. Excelente.

### (2) modelAnswer contra rúbrica, casilla por casilla
> «Ha llamado el electricista. Dice que no puede cambiar el cuadro sin cortar la luz de
> todo el edificio, y que eso sólo se permite de dos a cuatro y con autorización de la
> comunidad, así que habría que hablar con el administrador. **Si usted prefiere no
> complicarlo, deja hecho sólo el enchufe de la cocina.**»

1. **Problema (no puede cambiar el cuadro sin cortar la luz de todo el edificio).**
   Literal y correcto. **TICA.**
2. **Franja y requisito (sólo de 14 a 16, con permiso de la comunidad → hablar con el
   administrador).** «sólo se permite de dos a cuatro y con autorización de la comunidad,
   así que habría que hablar con el administrador» ✓. **TICA.**
3. **Plan B — «si no se puede, sólo arregla el enchufe de la cocina».** La fuente dice
   **«Se não der»** = *si no sale / si no puede ser*: la condición es **externa** (que no
   haya autorización o no cuadre la franja). El modelo escribe **«Si usted prefiere no
   complicarlo»**: condición **volitiva**, de la casera. No es la misma proposición ni se
   entraña de ella — «no dar» puede ocurrir con la casera queriéndolo todo, y la casera
   puede no querer complicarse aunque «dé». La casilla exige literalmente *si no se puede*
   y el modelAnswer no lo transmite. **NO TICA.**
4. **Español natural y de usted, 35–70.** Natural ✓; el usted está marcado («usted
   prefiere») ✓; 56 palabras ✓. **TICA** (pero ver el efecto colateral abajo).

### (3) Datos contra el sourceText
| dato | fuente | modelo | |
|---|---|---|---|
| emisor | o eletricista | el electricista | ✓ |
| problema | trocar o quadro / cortar a luz a todo o prédio | cambiar el cuadro / cortar la luz de todo el edificio | ✓ |
| franja | das 14h às 16h | de dos a cuatro | ✓ |
| requisito | autorização do condomínio | autorización de la comunidad | ✓ |
| gestión | falem com o administrador | habría que hablar con el administrador | ✓ |
| respuesta | **digam-me qualquer coisa** | **—** | omitido |
| **condición del plan B** | **«Se não der»** | **«Si usted prefiere no complicarlo»** | **ALTERADO** |
| plan B | faço só a tomada da cozinha | deja hecho sólo el enchufe de la cocina | ✓ |

### (4) Calcos
«Tomada» → «enchufe» ✓ (no «toma»), «condomínio» → «comunidad» ✓ (no «condominio», que en
España es otra cosa), «administrador» ✓ (administrador de fincas, amigo verdadero).

### (5) Recuento
56 palabras, rango 35–70 ✓.

### (6) Barrido de inclusividad
Ningún «até» ni plazo: la franja 14–16 se traslada entera. ✓

### Hallazgos
- **ERROR REAL — la condición del plan B está alterada y la casilla 3 no se tica.**
  Cita: modelAnswer, «**Si usted prefiere no complicarlo**, deja hecho sólo el enchufe de
  la cocina» frente a fuente «**Se não der**, faço só a tomada da cozinha» y casilla 3
  «(**si no se puede**, sólo arregla el enchufe de la cocina)».
  Por qué es falso: convierte una **imposibilidad externa** en una **preferencia de la
  destinataria**. El recado real dice «hablad con el administrador, decidme algo, y si no
  hay manera hago sólo el enchufe»; la versión mediada le ofrece a la casera un menú
  («¿se complica o no?») que el electricista nunca puso sobre la mesa, y de paso deja en
  el aire el trámite. La decisión que toma la casera al leer una y otra no es la misma:
  ése es exactamente el daño que la mediación debe evitar.
  **Qué debe decir:** «…así que habría que hablar con el administrador **y decirle algo a
  él**. **Si al final no puede ser**, deja hecho sólo el enchufe de la cocina.» Ojo al
  arreglar: el único «usted» del ítem vive en la frase defectuosa, así que la reescritura
  tiene que reponer una marca de usted (p. ej. «si usted no lo consigue» → no: eso vuelve
  a personalizar; mejor «¿Le digo que siga adelante o lo dejamos en el enchufe?»).
- **DISCUTIBLE — se pierde «digam-me qualquer coisa».** No lo exige ninguna casilla, pero
  es la única acción que el electricista pide *a ellos*; para la casera que decide, es
  información útil. Iría en la reescritura de la casilla 3.
- **DISCUTIBLE — «el cuadro» a secas.** La casilla 4 pide «quadro» *resuelto*; el término
  español es **«cuadro eléctrico»** / «cuadro de luces». El contexto (electricista, cortar
  la luz) desambigua y por eso no es error, pero el gold debería decir «el cuadro
  eléctrico», que además blinda la casilla contra un corrector estricto.

**Veredicto: ERROR REAL** (1 error, 2 discutibles).

---

## MED-165 · nota-manuscrita · es→pt · plantas de la vecina — **PASA**

### (1) El sourceText es nota manuscrita real, en español
> «¡Hola! Me voy diez días. Te dejo la llave para que riegues: las de la terraza, cada dos
> días; el ficus del salón, sólo una vez por semana y poca agua. El correo lo recoge mi
> hijo, no te preocupes.»

Peninsular auténtico: elipsis de nota («las de la terraza»), dos puntos enumerativos,
«no te preocupes» de cierre. Nada forzado.

### (2) modelAnswer contra rúbrica, casilla por casilla
> «A vizinha foi-se por dez dias e deixou a chave para regarmos. As plantas da varanda, de
> dois em dois dias; o fícus da sala só uma vez por semana e com pouca água — cuidado que
> esse morre afogado. O correio não é connosco, vem cá o filho dela.»

1. **Encargo y duración (regar diez días, con la llave que dejó).** «foi-se por dez dias e
   deixou a chave para regarmos» ✓. **TICA.**
2. **Las DOS pautas distintas.** «da varanda, de dois em dois dias» / «o fícus da sala só
   uma vez por semana e com pouca água» ✓ — y las mantiene separadas, que es lo que la
   casilla mide. **TICA.**
3. **Lo que NO hay que hacer (el correo lo recoge el hijo).** «O correio não é connosco,
   vem cá o filho dela» ✓. **TICA.**
4. **Portugués natural por tu, 30–65.** 50 palabras ✓. Ver el discutible sobre el «tu».
   **TICA.**

### (3) Datos contra el sourceText
| dato | fuente | modelo | |
|---|---|---|---|
| duración | diez días | dez dias | ✓ |
| llave | te dejo la llave | deixou a chave | ✓ |
| terraza | cada dos días | de dois em dois dias | ✓ |
| ficus | una vez por semana, poca agua | uma vez por semana, pouca água | ✓ |
| correo | lo recoge mi hijo | vem cá o filho dela | ✓ |

El paso de «para que **riegues**» (tú) a «para **regarmos**» (nosotros) no es alteración:
la consigna dice «o teu colega de casa… que **vai tratar das plantas contigo**». Licencia
del marco de la tarea, igual que el «E esta semana és tu» aprobado en el lote 1.

### (4) Calcos y portugués europeo
Aquí el ítem brilla y hay que decirlo: **«de dois em dois dias»** (no «cada dois dias»,
que es el calco español), **«connosco»** con la grafía europea (BR: *conosco*), **«não é
connosco»** como idiotismo de «no es cosa nuestra», **«vem cá»**, ênclise correcta en
«foi-se» (afirmativa principal → ênclise), infinitivo pessoal en «para regarmos», y
**«fícus»** acentuado según la regla que este proyecto tiene por bandera (graves en -u/-us:
*vírus, ónus, fícus*). «Varanda», «sala», «água»: PT-PT limpio.

### (5) Recuento
50 palabras, rango 30–65 ✓.

### (6) Barrido de inclusividad
No hay deadline en el ítem (frecuencias, no plazos). ✓

### Hallazgos
- **DISCUTIBLE — «A vizinha foi-se por dez dias».** Gramatical y europeo, pero «ir-se» sin
  «embora» y con complemento de duración suena a un paso de la lengua escrita; en Lisboa
  se diría «**foi-se embora dez dias**», «**vai estar fora dez dias**» o «foi de viagem».
  No es brasileño ni inexistente: no frena.
- **DISCUTIBLE — la casilla 4 pide «por tu» y el modelAnswer no trae ni una forma de
  segunda persona.** «regarmos» es *nós*, «cuidado» es interjección: no hay «tu» que
  verificar. No lo cuento como casilla no ticada porque tampoco hay nada que la viole (ni
  un «você», ni tratamiento de 3.ª de deferencia) y el criterio que se usó en el lote 2 fue
  precisamente evaluar el trato también por ausencia de formas incorrectas. Aun así, un
  gold que ilustre el tuteo debería tuteear una vez: «**ficas tu com as da varanda?**».
- **DISCUTIBLE — «terraza» → «varanda».** El equivalente estricto es «terraço»; «varanda»
  es balcón. En piso urbano se solapan y la casilla no distingue. Anotado.

**Veredicto: PASA** (0 errores reales, 3 discutibles).

---

## MED-175 · megafonia · pt→es · cierre del supermercado — **ERROR REAL**

### (1) El sourceText es megafonía real
> «Estimados clientes: informamos que a loja encerra dentro de quinze minutos. As caixas 1
> e 2 encerram já; a caixa 5 mantém-se aberta até à saída do último cliente. Amanhã,
> domingo, abrimos das 9h às 13h.»

Género bien construido: «encerra» ✓ EP, «mantém-se» con ênclise correcta ✓, crase «até à»
✓, horario «das 9h às 13h» ✓. (Anoto que en megafonía portuguesa es más frecuente «Caros
clientes» o «Srs. Clientes» que «Estimados clientes», que suena a carta; discutible menor,
no error.)

### (2) modelAnswer contra rúbrica, casilla por casilla
> «Mamá, que cierran en un cuarto de hora. Las cajas 1 y 2 las están cerrando ya; **la
> única que se queda es la 5**. Coge lo que lleves y vamos — mañana domingo abren de nueve
> a una si falta algo.»

1. **Cierre inminente (quince minutos).** «cierran en un cuarto de hora» ✓ equivalente
   exacto. **TICA.**
2. **Detalle útil: (a) cajas 1 y 2 cierran ya; (b) la 5 se queda abierta **hasta el último
   cliente**.** (a) ✓ «Las cajas 1 y 2 las están cerrando ya». (b) sólo a medias: «la única
   que se queda es la 5» dice *cuál*, no *hasta cuándo*. **La casilla nombra el límite
   temporal con todas las letras y el gold no lo lleva.** Y no es un detalle decorativo:
   «até à saída do último cliente» es justamente lo que convierte el aviso en útil — dice
   que no te echan a mitad de la compra, que es lo contrario de lo que la madre deduce de
   «cierran en un cuarto de hora». **NO TICA.**
3. **Horario de mañana (domingo, 9–13).** «mañana domingo abren de nueve a una» ✓ (13h =
   una de la tarde). **TICA.**
4. **Español natural, sin lusismos, 25–55.** «encerra»→«cierran» ✓, «caixas»→«cajas» ✓, 42
   palabras ✓. **TICA.**

### (3) Datos contra el sourceText
| dato | fuente | modelo | |
|---|---|---|---|
| cierre | dentro de quinze minutos | en un cuarto de hora | ✓ |
| cajas que cierran | 1 e 2, já | 1 y 2, ya | ✓ |
| caja abierta | a caixa 5 | la 5 | ✓ |
| **hasta cuándo** | **até à saída do último cliente** | **—** | **OMITIDO** |
| mañana | domingo, das 9h às 13h | domingo, de nueve a una | ✓ |
| exclusividad de la 5 | (no se dice de la 3 y la 4) | «la única que se queda» | inferencia |

### (4) Calcos
Ninguno. «Coge lo que lleves y vamos» es habla peninsular real.

### (5) Recuento
42 palabras, rango 25–55 ✓.

### (6) Barrido de inclusividad — aquí está el nervio
El **único** plazo del ítem es «**até** à saída do último cliente», y es **el que
desaparece**. No hay degradación de «até» a «antes de» (la patología del lote 1), pero el
resultado práctico es peor: se borra entero el margen que el aviso concede. En un lote cuyo
contrato protege explícitamente la inclusividad de los plazos, perder el «até» por
supresión cuenta igual que perderlo por traducción.

### Hallazgos
- **ERROR REAL — dato exigido por la casilla 2 omitido.**
  Cita: casilla 2 «¿Traslada el detalle útil (las cajas 1 y 2 cierran ya; **la 5 se queda
  abierta hasta el último cliente**)?» frente a modelAnswer «la única que se queda es la 5».
  Por qué: el gold no contiene una de las tres sub-proposiciones que su propia casilla
  enumera; «se queda» no entraña «hasta que salga el último cliente» (podría quedarse
  abierta cinco minutos más y cerrar a la hora). O el gold se completa o la casilla está
  sobre-especificada: el ítem es internamente incoherente tal como está.
  **Qué debe decir:** «…la única que se queda es la 5, **y ésa no cierra hasta que salga el
  último**. Coge lo que lleves y vamos…» (cabe de sobra: quedaría en ~48 palabras, dentro
  de 25–55).
- **DISCUTIBLE — «la única que se queda».** La fuente habla de la 1, la 2 y la 5, y calla
  sobre la 3 y la 4. La exclusividad es implicatura razonable de una megafonía de cierre
  (si singularizan la 5, es la que queda), por eso no la cuento como dato inventado; pero
  si se toca el ítem, «la que se queda es la 5» dice lo mismo sin afirmar de más.
- **DISCUTIBLE — «Estimados clientes»** en el sourceText: «Caros clientes» / «Srs.
  Clientes» es lo que se oye en un supermercado portugués.

**Veredicto: ERROR REAL** (1 error, 2 discutibles).

---

## MED-179 · factura-recibo · pt→es · **`contradictorio` (modificador nuevo)** — **PASA**

Éste entró en la muestra por ser el estreno del modificador. Lo he atacado por las cuatro
vías que se le pidieron al ítem: existencia real de la contradicción, aritmética,
señalamiento sin resolución, y autoevaluabilidad.

### (1) El sourceText es factura real
> «Fatura de eletricidade — setembro. Leitura real: 210 kWh. Total: 54,30 €. Data limite de
> pagamento: 30 de setembro. Nota no verso: "Faturas emitidas após o dia 25 têm 15 dias
> para pagamento." Data de emissão: 26 de setembro.»

Realia portuguesa correcta y con las etiquetas que de verdad imprime una factura EP:
**«Leitura real»** (frente a *estimada*), **«Data limite de pagamento»**, **«Data de
emissão»**, **«Nota no verso»**, importe con coma decimal y euro pospuesto («54,30 €»).
Grafías AO90 sin *c*: «fatura», «eletricidade» ✓. 210 kWh a 54,30 € ≈ 0,26 €/kWh con
términos fijos: verosímil en Portugal. Nada que objetar.

### (a) ¿La contradicción existe de verdad, tal como está escrito?
**Sí, y es aritmética, no interpretativa.** La nota del reverso condiciona por «emitidas
**após o dia 25**»; la emisión es el **26**, que es posterior al 25 → la regla se activa
sin discusión. Activada, concede **15 días para pagar**; la factura imprime como límite el
**30 de septiembre**, que son **4 días**. La factura concede y niega el mismo plazo. No es
un «plazo más restrictivo» presentado como cortesía: es un derecho impreso al dorso que el
anverso incumple. Contradicción genuina, y del tipo que un hispanohablante encuentra de
verdad en Portugal.

### (b) ¿La aritmética es correcta?
Septiembre tiene 30 días: 26 + 15 = 41 → **11 de octubre**. Correcto. Y es además el
cómputo jurídicamente estándar en Portugal (art. 279.º b) del Código Civil: no se cuenta el
día del hecho que inicia el plazo, así que se cuenta desde el 27 y se llega al 11). Un
cómputo inclusivo del día de emisión daría el 10 — ver discutible.

### (c) ¿Señala sin resolver?
> «Factura de la luz de septiembre: 54,30 euros, 210 kWh, con lectura real. Pone como fecha
> límite el 30 de septiembre, pero al dorso dice que las facturas emitidas después del 25
> tienen quince días — y ésta se emitió el 26, o sea que daría el 11 de octubre. **No
> cuadra; conviene preguntar antes de pagar.**»

**Sí.** Expone las dos ramas, hace el cálculo, y cierra sin arbitrar: «no cuadra» +
«conviene preguntar». No dice cuál manda, no dice «así que puedes pagar el 11», no dice
«hazle caso al 30». La recomendación es de **procedimiento** (preguntar), no de **fecha**,
que es exactamente la línea que el modificador pide no cruzar. Y el destinatario elegido
—el compañero que lleva las cuentas— hace que «preguntar antes de pagar» sea una acción
real, no un adorno.

### (2) modelAnswer contra rúbrica, casilla por casilla
1. **Importe y consumo (54,30 €, 210 kWh de septiembre, lectura real).** Los cuatro datos
   presentes y en formato español (coma decimal, «euros»). **TICA.**
2. **Fecha límite impresa (30 de septiembre).** «Pone como fecha límite el 30 de
   septiembre» ✓ — obsérvese que dice *el 30*, no *antes del 30*. **TICA.**
3. **Señala la contradicción sin resolverla (15 días desde el 26 → 11 de octubre, que no
   cuadra con el 30).** Los tres componentes están: la regla, el cálculo con su fecha, y el
   choque. Y falta —correctamente— el veredicto. **TICA.**
4. **Español natural, sin lusismos, 30–65.** «fatura»→«factura» ✓, «leitura»→«lectura» ✓,
   «no verso»→«al dorso» ✓ (no «en el reverso», que sería más torpe), «o sea que daría» ✓
   coloquial de convivencia. **57 palabras** ✓. **TICA.**

### (3) Datos contra el sourceText
| dato | fuente | modelo | |
|---|---|---|---|
| periodo | setembro | de septiembre | ✓ |
| consumo | 210 kWh | 210 kWh | ✓ |
| tipo de lectura | leitura real | con lectura real | ✓ |
| importe | 54,30 € | 54,30 euros | ✓ |
| límite impreso | 30 de setembro | el 30 de septiembre | ✓ |
| regla del reverso | emitidas após o dia 25 → 15 dias | emitidas después del 25 → quince días | ✓ |
| emisión | 26 de setembro | se emitió el 26 | ✓ |
| cálculo | (no está en la fuente) | 11 de octubre | ✓ derivado, correcto |

### (4) Calcos
Ninguno. «Al dorso» ✓, «lectura real» ✓ (también es la etiqueta española), «no cuadra» ✓.

### (5) Recuento
57 palabras, rango 30–65 ✓.

### (6) Barrido de inclusividad — **el punto donde este ítem se jugaba el freno y gana**
Dos plazos, los dos conservados:
- «**Data limite de pagamento: 30 de setembro**» → «**fecha límite el 30 de septiembre**».
  No degrada a «antes del 30»: el día 30 sigue siendo hábil. ✓
- «**emitidas após o dia 25**» → «**emitidas después del 25**». «Após» es exclusivo y
  «después del 25» también lo es; el 26 entra en ambos, que es de lo que depende todo el
  ítem. Si aquí se hubiera escrito «a partir del 25» (inclusivo) el razonamiento seguiría
  saliendo, pero la regla estaría falseada. No ocurre. ✓

### Hallazgos
- **DISCUTIBLE — la casilla 3 clava «el 11 de octubre».** El cómputo alternativo (contando
  el 26 como día 1) da el **10**, y es el que hace mucha gente. Un alumno que escriba «el
  10 de octubre» habrá hecho la operación pedida —detectar y señalar el choque— y un
  corrector literal se la tumbará. Recomiendo aflojar la casilla sin perder binariedad:
  «…lo que llevaría el pago **a octubre** (hacia el 10-11), y eso no cuadra con el 30».
- **DISCUTIBLE — la casilla 3 carga tres operaciones en una** (leer la regla, calcular, no
  arbitrar). Es binaria y autoevaluable —se puede contestar sí/no leyendo la respuesta—,
  por eso no la cuento como defecto de rúbrica; pero si alguna casilla del lote va a
  desdoblarse algún día, es ésta: «¿señala el choque?» / «¿se abstiene de decidir?».

**Veredicto: PASA** (0 errores reales, 2 discutibles). **El modificador nuevo no es el
problema del lote.** Es, de los cinco, el ítem mejor cerrado.

---

## Qué está bien (sección obligatoria, específica)

- **El portugués de los sourceText es de verdad europeo, no «de manual».** MED-155 es el
  mejor recado de voz que he visto en este proyecto: «É o eletricista», «digam-me qualquer
  coisa», «se não der», con ênclise correcta en el imperativo. MED-145 usa «serviço
  permanente» y «postigo», que son los términos administrativos y físicos reales de la
  farmacia de guardia portuguesa. MED-179 imprime las etiquetas exactas de una factura EP.
  Grafía AO90 consistente en los cuatro («eletricista», «noturno», «fatura»,
  «eletricidade»). Ni un brasileirismo, ni un gerundio, ni una próclise indebida.
- **MED-165 es un modelo de PT-PT productivo**, no sólo correcto: «de dois em dois dias»
  (no el calco «cada dois dias»), «connosco», «não é connosco», infinitivo pessoal
  («para regarmos»), ênclise en «foi-se», y «fícus» acentuado según la regla de las graves
  en -us que este proyecto lleva años defendiendo.
- **Los falsos amigos se esquivan donde duele.** «Postigo» → «ventanilla» (145): el calco
  habría sido invisible y catastrófico. «Tomada» → «enchufe» y «condomínio» → «comunidad»
  (155). «No verso» → «al dorso» (179).
- **El modificador `contradictorio` funciona a la primera** en MED-179: contradicción real
  y aritmética, cómputo correcto y jurídicamente estándar, señalamiento sin arbitraje, y
  destinatario que hace accionable la abstención. Era el riesgo declarado del lote y no lo
  es.
- **La inclusividad está mayoritariamente protegida en todo el lote**, y de forma
  deliberada: hay rúbricas que escriben «plazo INCLUSIVO» en mayúsculas (157, 170, 178, y
  151, que además lo lleva en el sourceText: «até 20 de setembro, **inclusive**») y golds
  que lo refuerzan («hasta el domingo **incluido**» en 170; «mañana hasta las seis» en 153).
  El contrato del lote 1 se ha interiorizado. Lo que queda son fugas puntuales, no un fallo
  de doctrina.

---

## Hallazgos FUERA DE MUESTRA (contexto; no cuentan en n/5, pero van a mano igual)

El barrido de inclusividad del punto (6) lo corrí sobre los 44 ítems por script, porque la
clase que frenó el lote 1 se detecta mecánicamente. Dos impactos fuera de mi muestra, los
dos de la clase FRENO:

- **MED-142 — «até às 8h» → «antes de las ocho», y además en la rúbrica.**
  Fuente: «deixe a chave na portaria **até às 8h** desse dia». modelAnswer: «tendrías que
  dejar la llave en portería **antes de las ocho** de la mañana». Casilla 2: «(…dejar la
  llave en portería **antes de las 8** de ese día)». «Até às 8h» admite dejarla a las 8:00;
  «antes de las 8» lo prohíbe. Es literalmente la patología que frenó el lote 1, esta vez
  duplicada en gold y rúbrica (coherentes entre sí, y las dos mal respecto a la fuente).
  **Debe decir:** «hasta las ocho de la mañana» en ambos sitios.
- **MED-183 — «até ao fim da semana» → «antes de fin de semana».**
  Fuente: «Fica combinado **até ao fim da semana**». Casilla 2: «¿Traslada el plazo (**antes
  de fin de semana**)?»; el gold, igual. En español peninsular «antes del fin de semana»
  significa *antes de que llegue el sábado*, es decir un plazo **distinto y más corto** que
  «hasta el fin de semana». No sólo pierde la inclusividad: mueve la fecha.
  **Debe decir:** «hasta el final de la semana» / «antes de que acabe la semana».
- **Anotación menor, MED-182** (el otro `contradictorio`): tras señalar bien el choque
  («el casero dice dos semanas y el contratista seis»), cierra con «**hazte a la idea
  larga**». Lo interrogué como resolución encubierta y lo dejo en **discutible**: es consejo
  prudencial de planificación, no una afirmación de que seis semanas sea lo cierto. Aun así,
  el modificador nuevo pide abstención y ésta es la frase que más se acerca al borde;
  merece una mirada en la revisión a mano.

---

## Dictamen

| ítem | veredicto |
|---|---|
| MED-145 · cartel · farmacia de guardia | **PASA** (1 discutible) |
| MED-155 · recado-voz · electricista | **ERROR REAL** (condición del plan B alterada; casilla 3 no ticada) |
| MED-165 · nota-manuscrita · plantas | **PASA** (3 discutibles) |
| MED-175 · megafonia · supermercado | **ERROR REAL** (omitido «hasta la salida del último cliente», exigido por la casilla 2) |
| MED-179 · factura-recibo · `contradictorio` | **PASA** (2 discutibles) |

**FRENO: SÍ (2/5).**

2 errores reales sobre 5 muestreados = 40 %, muy por encima del umbral del 2 %. Se activa
la revisión a mano de los 44. Además, el barrido mecánico de inclusividad ya entrega dos
impactos más fuera de muestra (MED-142 y MED-183), los dos de la clase que frenó el lote 1,
lo que sugiere que la tasa real del lote no es un accidente de mi muestra.

**Dónde mirar primero en la revisión a mano** (por orden de rendimiento esperado):
1. **Todos los «até»/«hasta»/«antes de»** de los 44: la clase está confirmada viva (142,
   183) y es detectable por script antes de leer nada.
2. **Los condicionales del tipo «se não der» / «caso não…»**: MED-155 muestra que el gold
   puede cambiarle la naturaleza a la condición (externa → volitiva) sin que salte ninguna
   alarma de estilo. Afecta a los ítems `condicional` (142, 151, 163) y a cualquier plan B.
3. **Las casillas con paréntesis enumerativo**: MED-175 falla porque el paréntesis nombra
   tres sub-datos y el gold trae dos. Es comprobable casi mecánicamente: descomponer cada
   paréntesis en sub-proposiciones y buscarlas una a una en el modelAnswer.
4. **Añadidos del gold no marcados como propios** (el «llamando al timbre» de 145): no
   frenan, pero conviene decidir de una vez la política, porque el gold es lo que el alumno
   imita.

Lo que **no** hace falta re-auditar por sospecha genérica: el portugués europeo de los
sourceText (sólido en los cuatro que he leído a fondo) y el modificador `contradictorio`,
que se estrena sin un solo error real.
