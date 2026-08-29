# Lote industrial de avisos #1 (plantilla v1.2) — **PUBLICADO 2026-08-29, tras FRENO cumplido**

Sesión E2#5, 2026-08-29. Primer lote industrial de la línea B tras el
piloto: **24 relays** (`b2c2-med-69…92`), ancla `b10-l3-avisos-e-recados`
· concepts `[b10-relay-avisos]`.

## EL FRENO MORDIÓ — y el protocolo se cumplió entero

Muestreo determinista (71, 79, 87): **1/3 con error real** (79: «até
quinta» trasladado como «antes del jueves» — plazo recortado un día;
el revisor detectó la MISMA clase en 69, fuera de muestra) ⇒ **FRENO:
revisión completa de los 24 a mano ANTES de publicar**, como pactó Edu
2026-08-11. Resultado de la revisión completa (informe en scratchpad,
correcciones formalizadas y aplicadas 22/22):

- **10 PASA · 4 ERROR REAL (69, 79, 80, 85) · 10 solo-DISCUTIBLE.**
- Clases de error: (1) **«até + fecha» → «antes de»** — bug de MI
  plantilla, no de un ítem (69, 79 y 85, en 85 también en la RÚBRICA);
  el 76 demostraba la forma buena («como muy tarde el sábado»). Regla
  nueva del contrato: el traslado de deadline conserva la
  INCLUSIVIDAD. (2) Dato sustituido por inferencia no dada (79:
  «escalão B»→«grupo del Tomás»). (3) Calco español dentro de un
  sourceText pt (80: «entre semana» → «durante a semana»; Priberam no
  registra «entre semana»).
- Discutibles aplicados (baratos): días con número donde la casilla lo
  nombra (71, 74), hechos anclados a un «hoy» no dado fuera (73, 74,
  83), «a ratos» (75), «da tarde» a las 20h (89), «caixas de cartão»
  (87), «míster» con tilde (79), «sin necesidad de justificar la
  falta» (90), «por la mañana» (78), sobreprecisión (81).
- Barridos del revisor: señuelos 6/6 omitidos ✓ · reordenar 4/4 con el
  dato urgente en la primera frase ✓ · cifras/horas/matrículas exactas
  (tras los fixes) ✓ · conteos 24/24 en rango ✓ · «rés do chão» AO90
  verificado correcto.

## Contrato v1.2 (delta sobre v1.1)

- **Géneros +3** (el cupo «≤3 por género» del piloto de 8 no escala a
  24 con 5 géneros: 3×5=15): entran `email-servicio`,
  `nota-manuscrita` y `app-notificacion`. 8 géneros × cupo 3 = 24, el
  lote llena el cupo exacto.
- Obligaciones v1.1 cumplidas y medibles: ≥1 `condicional` (69), ≥1
  `corregido` de DOS avisos (70), **≥2 reordenar** (75, 83, 88, 92 —
  casilla operacional «la primera frase contiene el dato urgente»),
  señuelo ~25 % (6/24: 75, 77, 84, 85, 89, 92, todos con casilla
  binaria NEGATIVA), direcciones 17/7 = 71/29.
- **Vigilancia de clones estructurales A MANO** (regla nueva de la
  skill): cotejo de cada ítem contra los publicados de su clase
  (género × dirección × tipos de dato). Adyacencias declaradas abajo;
  el caso límite es MED-75 (tercer «corte de suministro» tras med-39
  agua y med-61 luz) — se admite porque su OPERACIÓN es otra
  (reordenar + señuelo + acciones distintas), y queda anotado para que
  el lote 2 industrial NO traiga un cuarto corte.
- Gates de molde por script ANTES de publicar: arranques de modelo
  únicos (3 primeras palabras, lote + publicados de la clase),
  n-grama ≥6 de sourceText contra publicados.

## Matriz del lote

| # | género | datos | mod | flags | dir | dominio |
|---|---|---|---|---|---|---|
| 69 | portal-infra | dia+franja+condicion+contacto | **condicional** | — | pt→es | revisión de gas |
| 70 | portal-infra | dia+dia+accion | **corregido** (2 avisos) | — | pt→es | recogida de basura |
| 71 | portal-infra | dia+franja+lugar+accion | simple | — | pt→es | cerradura del portal |
| 72 | cartel | dia+franja+accion+condicion | simple | — | pt→es | obras en la calle |
| 73 | cartel | dia+franja+objeto (3 tipos) | simple | — | pt→es | museo |
| 74 | cartel | dia+dia+lugar (2 tipos +lugar) | simple | — | pt→es | mercado municipal |
| 75 | sms-servicio | franja+accion+accion+contacto | simple | **reordenar+señuelo** | pt→es | corte de fibra |
| 76 | sms-servicio | objeto+lugar+franja+condicion | simple | — | pt→es | lavandería |
| 77 | sms-servicio | dia+franja+accion+objeto | simple | **señuelo** | pt→es | vacuna del gato |
| 78 | recado-voz | objeto+lugar+franja | simple | — | pt→es | ropa del tendedero |
| 79 | recado-voz | dia+accion+condicion+contacto | simple | — | pt→es | voluntarios del torneo |
| 80 | recado-voz | franja+accion+condicion | simple | — | pt→es | ruido del piano |
| 81 | aviso-escolar | accion+condicion+contacto | simple | — | pt→es | piojos |
| 82 | aviso-escolar | dia+objeto+accion | simple | — | pt→es | cantina cerrada |
| 83 | email-servicio | dia+franja+accion | simple | **reordenar** | pt→es | gimnasio cierra hoy |
| 84 | email-servicio | dia+lugar+accion+objeto | simple | **señuelo** | pt→es | tarjeta del banco |
| 85 | email-servicio | dia+objeto+accion+condicion | simple | **señuelo** | pt→es | seguro del coche |
| 86 | nota-manuscrita | lugar+objeto+franja | simple | — | es→pt | llaves y cena |
| 87 | nota-manuscrita | dia+accion+accion | simple | — | es→pt | vidrio al contenedor |
| 88 | app-notificacion | lugar+franja+accion | simple | **reordenar** | es→pt | embarque adelantado |
| 89 | app-notificacion | dia+franja+objeto+accion | simple | **señuelo** | es→pt | entrega del súper |
| 90 | aviso-escolar | dia+accion+condicion | simple | — | es→pt | huelga de comedor |
| 91 | nota-manuscrita | accion+contacto+franja | simple | — | es→pt | llamada al proveedor |
| 92 | app-notificacion | objeto+lugar+accion | simple | **reordenar+señuelo** | es→pt | grúa del parking |

*(91 es nota-manuscrita — el «recado-voz→nota» de la celda es el
marco: el jefe la dejó escrita. Cupos: portal 3 · cartel 3 · sms 3 ·
recado 3+1nota-marco… no: 91 cuenta como nota-manuscrita ⇒ nota ×3
(86, 87, 91), recado ×3 (78, 79, 80), app ×3 (88, 89, 92), escolar ×3
(81, 82, 90), email ×3 (83, 84, 85) — 8 géneros, cupo exacto.)*

**Adyacencias declaradas** (dominios/estructuras vecinas de
publicados): 75 ↔ med-39/61 (familia «corte de suministro», operación
distinta — ver contrato); 69 «gás» ↔ med-54 «perder gás» (palabra
compartida, dominios distintos: revisión obligatoria vs avería de
esquentador); 71 «portal/chaves» ↔ med-68 «portal» (palabra); 84
«cartão» ↔ med-62 «cartão de cidadão» (objetos distintos); 92 ↔ med-63
(coche, pero taller≠grúa y la operación es urgencia). Dominios
disjuntos del registro completo (agua+ascensor, pintura, reunión,
informe, llamada, entrada, visita, esquentador, calefacción,
medicamento, desayuno, tranvía, luz, análisis, taller, biblioteca,
excursión, fumigación, dentista, paquete, bolo).

---

### MED-69 · portal-infra · pt→es · condicional
**sourceText:**
> «Inspeção periódica obrigatória da rede de gás: quinta-feira, dia
> 11, entre as 9h e as 13h, os técnicos visitarão todas as frações. É
> indispensável a presença de um adulto. Caso não possa estar
> presente, reagende até dia 9 pelo 210 340 500; a segunda visita é
> cobrada ao morador.»
**audience:** «tu compañera de piso española»
**instructionsEs:** «El aviso está en el portal. Cuéntaselo — uno de
los dos tiene que estar ese día.»
**wordRange:** 35–70 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día y la franja (jueves 11, de 9 a 13, revisión
   obligatoria del gas piso por piso)?
2. ¿Traslada que tiene que haber un adulto en casa?
3. ¿Traslada la condición completa (si no podemos, reagendar hasta el
   día 9 al 210 340 500; la segunda visita se cobra)?
4. ¿Español natural, sin lusismos («frações», «morador»), entre 35 y
   70 palabras?

**modelAnswer**:
> Oye, el jueves 11 pasan los técnicos del gas por todos los pisos,
> entre las nueve y la una — es la revisión obligatoria y tiene que
> haber un adulto en casa. Si ese día no podemos ninguno, hay que
> reagendar como muy tarde el día 9 llamando al 210 340 500; si no, la
> segunda visita nos la cobran.

### MED-70 · portal-infra · pt→es · corregido (DOS avisos)
**sourceText:**
> «[Aviso de segunda-feira] A partir da próxima semana, a recolha de
> lixo indiferenciado passa de terças e sábados para QUARTAS e
> sábados. Os contentores devem ir para a rua só depois das 20h.
>
> [Aviso de hoje] RETIFICAÇÃO: mantém-se a recolha de terça-feira. A
> alteração é só ao sábado, que passa para DOMINGO de manhã.»
**audience:** «tu compañero de piso español, que saca la basura»
**instructionsEs:** «Los dos avisos están en el tablón. UN solo
mensaje con el estado final — sin rastro del dato caducado como
vigente.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿El estado final es el correcto: se mantiene el MARTES y el sábado
   pasa a DOMINGO por la mañana (el «miércoles» del primer aviso no
   aparece como vigente)?
2. ¿Conserva la acción (contenedores a la calle solo después de las
   20h)?
3. ¿Español natural, sin lusismos («recolha», «indiferenciado»,
   «contentores»), entre 30 y 65 palabras?

**modelAnswer**:
> Al final la basura queda así: martes como siempre, y lo del sábado
> pasa al domingo por la mañana — olvídate del miércoles que pusieron
> primero, lo han rectificado. Y sigue igual lo de sacar los cubos
> solo a partir de las ocho de la tarde.

### MED-71 · portal-infra · pt→es · simple
**sourceText:**
> «Por motivos de segurança, a fechadura da porta principal será
> substituída na segunda-feira, dia 15. As chaves novas podem ser
> levantadas na portaria, das 17h às 20h, mediante assinatura. A
> chave antiga deixa de funcionar às 22h desse dia.»
**audience:** «tu amiga española, que llega esa noche de viaje»
**instructionsEs:** «Ella vuelve el lunes por la noche. Cuéntale lo
que le afecta — y en qué orden.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada que la llave vieja DEJA de funcionar el lunes 15 a las
   22h (lo que a ella le afecta primero)?
2. ¿Traslada dónde y cuándo se recoge la nueva (portería, de 17 a 20,
   firmando)?
3. ¿Traslada el motivo/el hecho (cambian la cerradura del portal por
   seguridad)?
4. ¿Español natural, sin lusismos («fechadura», «levantar», «portaria»
   sin resolver), entre 30 y 65 palabras?

**modelAnswer**:
> Importante para el lunes 15: tu llave del portal deja de funcionar esa
> noche a las diez — cambian la cerradura por seguridad. Las llaves
> nuevas se recogen en portería de cinco a ocho de la tarde, firmando.
> Si llegas más tarde, avísame y te bajo yo la mía.

### MED-72 · cartel · pt→es · simple
**sourceText:**
> «Obras na via — Rua das Flores encerrada ao trânsito de terça a
> sexta, dias 12 a 15, das 8h às 18h. Proibido estacionar em toda a
> extensão a partir das 7h; as viaturas em infração serão removidas a
> expensas do proprietário.»
**audience:** «tu prima española, que aparca ahí su coche de alquiler»
**instructionsEs:** «El cartel está en la esquina. Cuéntaselo con todo
lo que le toca.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada los días y la franja (calle cerrada al tráfico de martes
   12 a viernes 15, de 8 a 18)?
2. ¿Traslada la prohibición con su hora (prohibido aparcar desde las
   7h)?
3. ¿Traslada la consecuencia (se llevan el coche y lo paga el dueño)?
4. ¿Español natural, sin lusismos («viaturas», «a expensas» como
   calco), entre 30 y 65 palabras?

**modelAnswer**:
> Prima, mueve el coche: la Rua das Flores va a estar cerrada por
> obras de martes a viernes (del 12 al 15), de ocho a seis. Y desde
> las siete de la mañana está prohibido aparcar en toda la calle — al
> que lo deje se lo lleva la grúa y la paga él.

### MED-73 · cartel · pt→es · simple
**sourceText:**
> «Museu da Cidade — horário de verão: terça a domingo, das 10h às
> 18h. Entrada gratuita aos domingos até às 13h. Encerrado às
> segundas-feiras e feriados.»
**audience:** «tus padres, de visita, que quieren ir al museo»
**instructionsEs:** «El cartel está en la puerta. Diles cuándo pueden
ir — y cuándo sale gratis.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el horario (de martes a domingo, de 10 a 18)?
2. ¿Traslada lo gratis (domingos hasta las 13)?
3. ¿Traslada el cierre (lunes y festivos)?
4. ¿Español natural, sin lusismos («encerrado», «feriados»), entre 25
   y 60 palabras?

**modelAnswer**:
> El museo abre de martes a domingo, de diez a seis. Los lunes y los
> festivos está cerrado. Y un truco: el domingo por
> la mañana, hasta la una, la entrada es gratis — si vamos pronto nos
> lo ahorramos.

### MED-74 · cartel · pt→es · simple
**sourceText:**
> «Informa-se que o Mercado Municipal estará encerrado na
> quinta-feira, dia 8, por ser feriado municipal. A banca de peixe
> reabre só no sábado; as restantes bancas funcionam normalmente na
> sexta-feira.»
**audience:** «tu madre, que está de visita y cocina el jueves»
**instructionsEs:** «Ella quería comprar pescado el jueves. Cuéntale
el cartel — que no haga el viaje en balde.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el cierre (mercado cerrado el jueves 8, festivo local)?
2. ¿Traslada el matiz del pescado (la pescadería no vuelve hasta el
   SÁBADO)?
3. ¿Traslada que el resto de puestos abre el viernes con normalidad?
4. ¿Español natural, sin lusismos («encerrado», «bancas» sin
   resolver), entre 25 y 60 palabras?

**modelAnswer**:
> Mamá, el jueves 8 ni vayas al mercado: está cerrado por fiesta local.
> Y ojo con el pescado — la pescadería no abre hasta el sábado; los
> demás puestos sí vuelven el viernes normal. Si quieres pescado para
> el jueves, hay que comprarlo antes.

### MED-75 · sms-servicio · pt→es · reordenar + señuelo
**sourceText:**
> «NOS informa: intervenção programada na rede de fibra da sua zona
> [incidência TK-58201]. Esta noite, entre as 23h e as 6h, o serviço
> de internet e televisão poderá ficar intermitente. Recomenda-se
> descarregar antecipadamente conteúdos importantes. Após as 6h, se o
> serviço não voltar, reinicie o router; persistindo, ligue 16990.»
**audience:** «tu compañera de piso española, que tiene una entrega a
medianoche»
**instructionsEs:** «Le va a pillar de lleno. Lo urgente, primero.»
**wordRange:** 35–70 · **register:** informal
**Rúbrica:**
1. ¿La PRIMERA frase contiene lo urgente (esta noche, de 23 a 6, el
   internet puede caerse a ratos)?
2. ¿Traslada la recomendación (descargar antes lo importante)?
3. ¿Traslada el después (a partir de las 6, reiniciar el router; si
   sigue mal, llamar al 16990)?
4. ¿La respuesta NO incluye el código de incidencia (TK-58201)?
5. ¿Español natural, sin lusismos («intervenção», «descarregar» como
   'descargar' vale), entre 35 y 70 palabras?

**modelAnswer**:
> ¡Esta noche se te puede caer internet a ratos entre las once y las seis —
> avisa la compañía, obras en la fibra! Con tu entrega a medianoche,
> descárgate antes todo lo que necesites. Y mañana, si a partir de
> las seis sigue sin ir, reinicia el router; si ni con esas, hay que
> llamar al 16990.

### MED-76 · sms-servicio · pt→es · simple
**sourceText:**
> «Lavandaria Sol: a sua roupa está pronta. Pode levantá-la no balcão
> da Rua Nova até sábado, das 9h às 19h30. Peças não levantadas no
> prazo de 30 dias revertem para doação.»
**audience:** «tu padre, que dejó allí las camisas en su visita»
**instructionsEs:** «El SMS llegó a tu número. Pásaselo — él vuelve a
España el domingo.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el objeto (su ropa/las camisas, listas)?
2. ¿Traslada lugar y franja (mostrador de la Rua Nova, hasta el
   sábado, de 9 a 19:30) — con el apremio de que él se va el domingo?
3. ¿Traslada la condición (a los 30 días la donan)?
4. ¿Español natural, sin lusismos («levantar», «peças»), entre 25 y
   60 palabras?

**modelAnswer**:
> Papá, tus camisas ya están listas en la lavandería. Tienes que
> recogerlas como muy tarde el sábado — abren de nueve a siete y
> media, en la Rua Nova — porque el domingo ya vuelas. Si se te pasa,
> a los treinta días las donan.

### MED-77 · sms-servicio · pt→es · señuelo
**sourceText:**
> «Clínica Veterinária Bicho Feliz [ficha 44-C]: lembramos a vacina
> anual do Tico, agendada para quarta-feira, dia 17, às 18h30. O
> animal deve vir em jejum desde o almoço. Traga o boletim de
> vacinas.»
**audience:** «tu novia española — el gato es suyo»
**instructionsEs:** «El SMS llegó a tu móvil. Pásale lo que hay que
hacer.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada la cita (vacuna anual del Tico, miércoles 17, 18:30)?
2. ¿Traslada la preparación (en ayunas desde la comida)?
3. ¿Traslada el objeto (llevar la cartilla de vacunas)?
4. ¿La respuesta NO incluye el número de ficha (44-C)?
5. ¿Español natural, sin lusismos («boletim», «agendada» vale), entre
   25 y 60 palabras?

**modelAnswer**:
> Amor, la vacuna del Tico es el miércoles 17 a las seis y media. Del
> veterinario dicen que no le demos nada de comer desde el mediodía —
> tiene que ir en ayunas — y que llevemos la cartilla de vacunas. ¿Lo
> llevas tú o lo llevo yo?

### MED-78 · recado-voz · pt→es · simple
**sourceText** (mensaje de voz):
> «Olá vizinho, é a Manuela do segundo. Olhe, começou a chover forte
> e tirei a vossa roupa do estendal — está cá em casa, dobradinha.
> Passem quando quiserem até às dez, ou amanhã de manhã a partir das
> oito.»
**audience:** «tu compañera de piso española, que tendió esa ropa»
**instructionsEs:** «El recado llegó a tu móvil. Pásaselo.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el objeto y el porqué (la vecina recogió nuestra ropa
   del tendedero porque llovía; la tiene doblada)?
2. ¿Traslada quién y dónde (Manuela, la del segundo, en su casa)?
3. ¿Traslada la franja (pasar hasta las 10 de hoy, o mañana desde las
   8)?
4. ¿Español natural, sin lusismos («estendal», «cá»), entre 25 y 60
   palabras?

**modelAnswer**:
> ¡Qué maja Manuela, la del segundo! Se puso a llover fuerte y nos
> recogió la ropa del tendedero — la tiene en su casa, doblada y
> todo. Podemos pasar a buscarla hoy hasta las diez, o mañana por la mañana, a
partir de las ocho.

### MED-79 · recado-voz · pt→es · simple
**sourceText** (mensaje de voz):
> «Fala o míster do Tomás. No sábado há torneio em Setúbal e
> precisamos de pais voluntários para o transporte — faltam dois
> carros. Quem puder, que se inscreva na folha do pavilhão até
> quinta; sem carros suficientes, os miúdos do escalão B ficam de
> fora. Dúvidas, 969 111 222.»
**audience:** «tu mujer, española — el Tomás es vuestro hijo»
**instructionsEs:** «El recado del entrenador llegó a tu móvil.
Cuéntaselo entero.»
**wordRange:** 35–70 · **register:** informal
**Rúbrica:**
1. ¿Traslada el qué y el día (torneo en Setúbal el sábado; faltan dos
   coches de padres voluntarios)?
2. ¿Traslada la acción con plazo (apuntarse en la hoja del pabellón
   hasta el jueves)?
3. ¿Traslada la consecuencia (sin coches, los del grupo B no van)?
4. ¿Traslada el contacto (dudas al 969 111 222)?
5. ¿Español natural, sin lusismos («míster» vale como 'entrenador',
   «escalão», «miúdos»), entre 35 y 70 palabras?

**modelAnswer**:
> Cariño, ha llamado el entrenador del Tomás: el sábado hay torneo en
> Setúbal y faltan dos coches de padres para llevarlos. El que pueda
> tiene que apuntarse en la hoja del pabellón como muy tarde el jueves — si
> no juntan coches, los del grupo B se quedan fuera. Dudas,
> al 969 111 222. ¿Podemos uno de los dos?

### MED-80 · recado-voz · pt→es · simple
**sourceText** (mensaje de voz):
> «Boa tarde, é a D. Amélia, a administradora. Recebemos queixas do
> piano depois das dez da noite. O regulamento permite instrumentos
> só até às 22h; durante a semana, idealmente até às 21h. Se precisarem
> de mais horas, falem comigo antes de sexta e vemos a sala do rés
> do chão.»
**audience:** «tu compañera de piso española, la del piano»
**instructionsEs:** «El recado es sobre ella. Pásaselo sin dramatizar
— trae una salida.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada la queja y el límite (quejas por el piano después de las
   diez; el reglamento lo permite solo hasta las 22h, ideal 21h entre
   semana)?
2. ¿Traslada la salida (hablar con la administradora antes del
   viernes; hay una sala en la planta baja)?
3. ¿Mantiene el tono no dramático que pide la consigna?
4. ¿Español natural, sin lusismos («rés do chão», «regulamento» vale),
   entre 30 y 65 palabras?

**modelAnswer**:
> Nada grave: la administradora dice que ha habido quejas por el piano
> a partir de las diez. La norma es hasta las diez, y entre semana
> mejor hasta las nueve. Lo bueno: si necesitas más horas, hablas con
> ella antes del viernes y os miran lo de la sala de la planta baja.

### MED-81 · aviso-escolar · pt→es · simple
**sourceText:**
> «Exmos. Encarregados de Educação: foram detetados casos de
> pediculose na turma do 2.º B. Pede-se a verificação diária da
> cabeça das crianças durante duas semanas e o aviso à professora
> titular em caso de deteção. A criança pode frequentar as aulas
> desde que inicie o tratamento.»
**audience:** «tu pareja española — el niño va al 2.º B»
**instructionsEs:** «Circular en la mochila. Cuéntale qué hay que
hacer.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el hecho (piojos en la clase del niño, 2.º B)?
2. ¿Traslada la acción (revisarle la cabeza a diario dos semanas y
   avisar a la tutora si aparece algo)?
3. ¿Traslada la condición (puede ir a clase siempre que empiece el
   tratamiento)?
4. ¿Español natural, sin lusismos («pediculose» resuelto como piojos,
   «professora titular»), entre 30 y 65 palabras?

**modelAnswer**:
> Aviso del cole: hay piojos en la clase del peque, el 2.º B. Toca
> revisarle la cabeza todos los días durante dos semanas, y si le
> encontramos algo, avisar a la tutora. Puede seguir yendo a clase
> sin problema, siempre que empecemos el tratamiento.

### MED-82 · aviso-escolar · pt→es · simple
**sourceText:**
> «Informa-se que na sexta-feira, dia 20, a cantina estará encerrada
> por assembleia de pessoal. Os alunos devem trazer almoço frio de
> casa; haverá micro-ondas disponível no refeitório. As aulas
> decorrem normalmente.»
**audience:** «tu pareja española, que prepara las mochilas»
**instructionsEs:** «Circular del colegio. Lo práctico, claro.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día y el hecho (viernes 20, comedor cerrado por
   asamblea)?
2. ¿Traslada la acción (llevar comida fría de casa; hay microondas en
   el comedor)?
3. ¿Traslada que hay clase normal?
4. ¿Español natural, sin lusismos («cantina» vale, «encerrada»,
   «decorrem»), entre 25 y 60 palabras?

**modelAnswer**:
> Para el viernes 20: el comedor del cole cierra por asamblea del
> personal, así que hay que mandarle comida de casa — algo frío,
> aunque tienen microondas allí. Las clases son normales, solo cambia
> lo de la comida. Lo apunto en el calendario.

### MED-83 · email-servicio · pt→es · reordenar
**sourceText:**
> «Caro sócio: informamos que HOJE, quinta-feira, o ginásio encerra
> excecionalmente às 17h por evento privado. As aulas de grupo da
> tarde ficam canceladas. Amanhã retomamos o horário habitual
> (6h30–23h). Pedimos desculpa pelo incómodo.»
**audience:** «tu hermana española, que va hoy a la clase de las 19h»
**instructionsEs:** «El email llegó a mediodía. Lo urgente, primero.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿La PRIMERA frase mata su plan (hoy el gimnasio cierra a las 17h —
   su clase de las 19h no existe)?
2. ¿Traslada el porqué breve (evento privado; clases de tarde
   canceladas)?
3. ¿Traslada la vuelta a la normalidad (mañana, horario de siempre)?
4. ¿Español natural, sin lusismos («sócio», «incómodo» como calco),
   entre 25 y 60 palabras?

**modelAnswer**:
> ¡No vayas al gimnasio esta tarde: hoy cierran a las cinco y tu
> clase de las siete está cancelada! Lo cierran por un
> evento privado. Mañana ya abren con el horario normal, de seis y
> media a once.

### MED-84 · email-servicio · pt→es · señuelo
**sourceText:**
> «Caro cliente [contrato n.º 0033-88-41]: o seu novo cartão de
> débito está disponível para levantamento no balcão da agência da
> Avenida, a partir de terça-feira, dia 16. Traga um documento de
> identificação. O cartão anterior será desativado 10 dias após a
> emissão.»
**audience:** «tu padre español — la cuenta es suya, tú eres el
autorizado»
**instructionsEs:** «El email llegó a tu correo. Dile qué tiene que
hacer.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el qué y desde cuándo (su tarjeta nueva, en la sucursal
   de la Avenida, desde el martes 16)?
2. ¿Traslada la acción (ir con un documento de identidad)?
3. ¿Traslada el plazo implícito (la vieja se desactiva a los 10 días
   de la emisión — que no lo deje pasar)?
4. ¿La respuesta NO incluye el número de contrato (0033-88-41)?
5. ¿Español natural, sin lusismos («levantamento», «balcão»), entre
   25 y 60 palabras?

**modelAnswer**:
> Papá, tu tarjeta nueva del banco ya se puede recoger en la sucursal
> de la Avenida, a partir del martes 16 — llévate el DNI. No lo dejes
> mucho: la vieja se desactiva a los diez días de emitir la nueva,
> así que mejor ve esa misma semana.

### MED-85 · email-servicio · pt→es · señuelo
**sourceText:**
> «Seguro automóvel — renovação [apólice AT-77-190]: a sua apólice
> renova-se a 1 de outubro. Para manter o desconto de bom condutor,
> envie o certificado de sinistralidade atualizado até dia 25 de
> setembro. Sem esse documento, o prémio sobe 12 %.»
**audience:** «tu tío español — el coche asegurado es el suyo»
**instructionsEs:** «El email llegó a tu correo porque tú hiciste de
intermediario. Pásale lo que tiene que hacer.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada la renovación (el seguro del coche se renueva el 1 de
   octubre)?
2. ¿Traslada la acción con plazo (mandar el certificado de
   siniestralidad actualizado hasta el 25 de septiembre)?
3. ¿Traslada la consecuencia (sin el papel, la prima sube un 12 %)?
4. ¿La respuesta NO incluye el número de póliza (AT-77-190)?
5. ¿Español natural, sin lusismos («apólice», «prémio» resuelto como
   prima), entre 25 y 60 palabras?

**modelAnswer**:
> Tío, lo del seguro del coche: se renueva el 1 de octubre. Para que
> no pierdas el descuento de buen conductor tienes que mandar el
> certificado de siniestralidad actualizado como muy tarde el 25 de
> septiembre — si no llega, la prima te sube un doce por ciento.

### MED-86 · nota-manuscrita · es→pt · simple
**sourceText** (nota en la mesa):
> «¡Hola! Me voy corriendo al aeropuerto. Te dejo las llaves del
> trastero en el buzón, dentro de un sobre. La cena está en el horno:
> caliéntala 15 min a 180. ¡No me riegues el cactus, que lo ahogas!
> Vuelvo el jueves.»
**audience:** «o teu colega de casa português, que chega logo à
noite»
**instructionsEs:** «La nota la dejó tu amiga española para los dos,
pero él no lee español. Pásasela en portugués.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada las llaves (las del trastero, en el buzón, dentro de un
   sobre)?
2. ¿Traslada la cena (en el horno, 15 min a 180)?
3. ¿Traslada el no-hacer y la vuelta (no regar el cactus; vuelve el
   jueves)?
4. ¿Portugués natural por tu (trastero→arrecadação, buzón→caixa do
   correio), entre 30 y 65 palabras?

**modelAnswer**:
> A Sara foi a correr para o aeroporto e deixou recado: as chaves da
> arrecadação estão na caixa do correio, dentro de um envelope. O
> jantar está no forno — aquece 15 minutos a 180. E não regues o
> cato, que ela diz que o afogas! Volta quinta-feira.

### MED-87 · nota-manuscrita · es→pt · simple
**sourceText** (nota de la casera):
> «Chicos: el martes pasan a por el vidrio — dejad las botellas en el
> contenedor verde del patio antes de las 8. Y por favor, no dejéis
> los cartones en el rellano, que la del tercero ya se ha quejado dos
> veces. Los cartones, doblados y al azul de la calle.»
**audience:** «o teu colega de casa português»
**instructionsEs:** «La nota es de la casera española. Pásasela en
portugués — a él le toca el vidrio esta semana.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el vidrio (martes; botellas al contenedor verde del
   patio antes de las 8)?
2. ¿Traslada la queja y la acción (nada de cartones en el rellano —
   doblados y al contenedor azul de la calle)?
3. ¿Portugués natural por tu (rellano→patamar, contenedor→contentor
   o ecoponto), entre 30 y 65 palabras?

**modelAnswer**:
> Recado da senhoria: na terça levam o vidro — as garrafas têm de
> estar no contentor verde do pátio antes das oito, e esta semana és
> tu. E nada de deixar as caixas de cartão no patamar, que a vizinha do terceiro
> já se queixou duas vezes: dobradas e para o contentor azul da rua.

### MED-88 · app-notificacion · es→pt · reordenar
**sourceText** (notificación de la app de la aerolínea):
> «Cambio de puerta: su vuelo IB3116 a Lisboa embarca ahora por la
> puerta K42 (antes J15). Embarque adelantado: comienza a las 14:10 y
> cierra a las 14:35. Diríjase a la nueva puerta con antelación.»
**audience:** «o teu amigo português, que foi comprar água e não tem
a app»
**instructionsEs:** «Estáis en el aeropuerto. Mándale el mensaje — lo
urgente primero.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿La PRIMERA frase contiene lo urgente (el embarque empieza YA a
   las 14:10 y cierra 14:35)?
2. ¿Traslada la puerta nueva (K42, ya no la J15)?
3. ¿Portugués natural por tu (puerta→porta de embarque), entre 25 y
   60 palabras?

**modelAnswer**:
> Despacha-te: o embarque foi antecipado — começa às 14h10 e fecha às
> 14h35! E mudaram a porta: agora é a K42, já não é a J15. Vem já
> para cá, eu guardo-te lugar na fila.

### MED-89 · app-notificacion · es→pt · señuelo
**sourceText** (notificación de la app del súper):
> «Su pedido nº 88012 llega mañana viernes entre las 18:00 y las
> 20:00. Recuerde: los congelados van en bolsa térmica. Si no hay
> nadie, el repartidor lo deja en conserjería. Código descuento para
> su próxima compra: AHORRA5.»
**audience:** «o teu colega de casa português — a encomenda do
supermercado é dele»
**instructionsEs:** «La notificación llegó a tu móvil porque el
pedido va a tu nombre. Pásale lo que le toca — no todo hace falta.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada la entrega (mañana viernes, entre las 18 y las 20)?
2. ¿Traslada el detalle útil (congelados en bolsa térmica; si no hay
   nadie, lo dejan en la portería)?
3. ¿La respuesta NO incluye el código de descuento (AHORRA5) ni el
   número de pedido?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> A tua encomenda do supermercado chega amanhã, sexta, ao fim do dia, entre as seis
> e as oito. Os congelados vêm em saco térmico; se não
> estiver ninguém em casa, o estafeta deixa tudo na portaria. Fica
> atento ao telemóvel a essa hora, pode ser?

### MED-90 · aviso-escolar · es→pt · simple
**sourceText** (circular del colegio español):
> «Estimadas familias: el miércoles 24 el personal de comedor
> secunda la huelga general. No habrá servicio de comedor ni de
> desayuno matinal. Los alumnos que se queden a mediodía deberán
> traer comida de casa; también pueden recogerse a las 13:00 sin necesidad de justificar la falta.»
**audience:** «o pai português do melhor amigo do teu filho — os
miúdos estão juntos no colégio espanhol»
**instructionsEs:** «El padre portugués no lee bien el español
administrativo. Pásale la circular en portugués.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el día y el hecho (miércoles 24, huelga del personal de
   comedor: no hay comedor ni desayuno)?
2. ¿Traslada las dos opciones (mandar comida de casa, o recogerlos a
   las 13:00 sin que cuente como falta)?
3. ¿Portugués natural por tu (comedor→cantina/refeitório,
   huelga→greve), entre 30 y 65 palabras?

**modelAnswer**:
> Aviso do colégio: na quarta, dia 24, o pessoal da cantina adere à
> greve geral — não há almoço nem pequeno-almoço. Ou mandamos comida
> de casa para os miúdos, ou podemos ir buscá-los às 13h sem contar
> como falta. Combinamos entre nós quem os vai buscar?

### MED-91 · nota-manuscrita · es→pt · simple
**sourceText** (nota del jefe en tu escritorio):
> «Cuando llegues: llama de mi parte al Sr. Fonseca, el proveedor de
> Braga (912 555 010). Dile que aceptamos su último presupuesto y que
> mande el contrato. Mejor antes de las 11, que luego entra en
> reunión. Gracias.»
**audience:** «o senhor Fonseca, fornecedor de Braga, ao telefone —
mas primeiro escreves-lhe a mensagem, formal»
**instructionsEs:** «Tu jefe español te dejó la nota. Redacta EN
PORTUGUÉS el mensaje formal que le mandarás al Sr. Fonseca (por si no
coge el teléfono antes de las 11).»
**wordRange:** 30–65 · **register:** formal · **address:** o_senhor
**Rúbrica:**
1. ¿Traslada la decisión (aceptamos su último presupuesto)?
2. ¿Traslada la acción (que envíe el contrato)?
3. ¿Es un mensaje formal correcto en portugués (tratamiento «o senhor
   Fonseca» / 3.ª persona, saludo y despedida), sin españolismos?
4. ¿Entre 30 y 65 palabras?

**modelAnswer**:
> Bom dia, senhor Fonseca. Escrevo-lhe da parte do meu diretor:
> aceitamos o seu último orçamento e agradecíamos que nos enviasse o
> contrato para assinatura. Se precisar de falar connosco, estamos
> disponíveis até às 11h de hoje. Com os melhores cumprimentos.

### MED-92 · app-notificacion · es→pt · reordenar + señuelo
**sourceText** (megafonía/app del centro comercial español):
> «Aviso a los clientes: el vehículo matrícula 23-XM-71 se encuentra
> estacionado en la zona de carga y descarga del nivel -1. Rogamos lo
> retiren de inmediato; en 15 minutos será retirado por la grúa
> (tasa: 90 €). Aprovechen hoy 3×2 en perfumería.»
**audience:** «o teu amigo português — o carro é dele e ele está no
provador»
**instructionsEs:** «Mándale el mensaje YA. Lo urgente primero — y no
todo hace falta.»
**wordRange:** 25–55 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿La PRIMERA frase saca a tu amigo del probador (la grúa se lleva
   su coche en 15 minutos — 90 € de tasa)?
2. ¿Traslada el dónde (zona de carga y descarga del nivel -1) y la
   matrícula para que sepa que es el suyo?
3. ¿La respuesta NO incluye la oferta de perfumería?
4. ¿Portugués natural por tu, entre 25 y 55 palabras?

**modelAnswer**:
> Sai já do provador: o reboque leva-te o carro em 15 minutos — 90
> euros de taxa! Anunciaram a matrícula, é o teu: 23-XM-71,
> estacionado na zona de cargas do piso -1. Vai lá a correr, eu
> guardo-te as compras.

---

## Muestreo adversarial del 10 % con FRENO (diseño original — el resultado está arriba)

Muestra determinista (cada octavo del lote, empezando en 71): **71,
79, 87** — 3/24 = 12,5 %. Regla pactada (decisión de Edu 2026-08-11,
misma que las colas): **≥1 de 3 con error real ⇒ FRENO: el lote entero
se revisa a mano antes de publicar.** El veredicto de qué cuenta como
error se fija ANTES de leer al revisor: error real = falsedad
lingüística en sourceText/modelo/rúbrica, casilla que el modelo no
tica, dato inventado u omitido, calco no declarado. (Hallazgo de
estilo o preferencia = anotar, no frenar.)

## Recuentos y gates (SALIDA PEGADA — se rellena antes de publicar)

```
(pendiente: publicador + gates de molde + virginidad)
```

## Sellos

`variantStatus: 'unchecked'` + `variantVerificacion: 'Línea B
aviso-v1.2 lote industrial 1: plantilla + muestreo adversarial 12,5%
2026-08-29 (este doc)'`. Tags por matriz. El publicador valida ANTES
de escribir.
