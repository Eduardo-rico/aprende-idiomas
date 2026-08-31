# Lote industrial de avisos #3 (plantilla v1.3) — **NO PUBLICADO** (publica el script)

Sesión E2#8, 2026-08-30. **Primer lote escalado: 44 relays**
(`b2c2-med-141…184`), ancla `b10-l3-avisos-e-recados` · concepts
`[b10-relay-avisos]`. Casi el doble que los dos anteriores (24), con el
MISMO protocolo: matriz género×dato, rúbrica derivada por
construcción, plantilla-id en tags, muestreo 10 % con FRENO (>2 %).

## Por qué se puede escalar ahora, y qué hubo que ampliar antes

El escalado estaba congelado hasta que existiera el gate de clones de
mediación (E2#7) y la retro-auditoría saliera limpia. Las dos
condiciones se cumplen: el eje de molde está en `--strict` y compara
también DENTRO del lote candidato, y la retro-auditoría de las 128
publicadas dejó 2 pares clase A, ambos declarados como progresión
deliberada.

**Auditoría de la matriz antes de producir** (salida pegada):

```
avisos publicados por género:
  portal-infra 8 · sms-servicio 8 · recado-voz 8 · cartel 7
  aviso-escolar 7 · email-servicio 6 · nota-manuscrita 6 · app-notificacion 6
cupo actual: 3/género · géneros: 8 · celdas (género,datos) usadas: 52
total avisos publicados: 56
combinaciones de datos posibles: C(7,3)=35 + C(7,4)=35 = 70
con 8 géneros → celdas teóricas: 560
```

La combinatoria de datos sobra (52 de 560), pero **el cuello no es
ésa**: con 8 géneros y cupo 3 el techo por lote es 24, y los DOMINIOS
(el asunto del aviso) se agotan antes que las celdas. Para 44 hubo que
ampliar la matriz, que es exactamente lo que el encargo pedía
comprobar:

- **+3 géneros** (11 en total): `megafonia` (avisos hablados de
  estación, aeropuerto, centro comercial), `factura-recibo` (documento
  con importes y vencimientos) y `chat-grupo` (mensajes de grupo
  vecinal o de padres, con varios emisores).
- **cupo 4 por género** → 11 × 4 = 44 exactos.
- **+2 modificadores**: `contradictorio` (dos datos del mismo aviso se
  pisan y hay que señalarlo sin resolverlo) y `parcial` (el aviso NO
  dice algo que el receptor necesita, y hay que marcar el hueco). Son
  operaciones nuevas, no adornos: obligan a evaluar la fuente, no sólo
  a trasvasarla.
- **44 dominios nuevos**, ninguno en el registro acumulado de los
  lotes 1-2, el piloto y los artesanales.

## Matriz del lote (11 géneros × 4 · 31 pt→es / 13 es→pt = 70/30)

| # | género | datos | mod | flags | dir | dominio |
|---|---|---|---|---|---|---|
| 141 | portal-infra | dia+franja+accion | simple | — | pt→es | limpieza de depósitos |
| 142 | portal-infra | dia+lugar+condicion | **condicional** | — | pt→es | cambio de contadores |
| 143 | portal-infra | dia+franja+objeto+accion | simple | **señuelo** | pt→es | desratización |
| 144 | portal-infra | dia+dia+accion (3 tipos) | **corregido** | — | pt→es | recogida de muebles |
| 145 | cartel | dia+franja+lugar | simple | — | pt→es | farmacia de guardia |
| 146 | cartel | objeto+lugar+contacto | simple | — | pt→es | gato perdido |
| 147 | cartel | dia+franja+accion+condicion | simple | **reordenar** | pt→es | punto limpio |
| 148 | cartel | lugar+accion+objeto | simple | — | es→pt | banco de alimentos |
| 149 | sms-servicio | dia+franja+lugar+condicion | simple | — | pt→es | cita del pediatra |
| 150 | sms-servicio | objeto+accion+contacto | simple | **señuelo** | pt→es | móvil reparado |
| 151 | sms-servicio | dia+objeto+condicion | **condicional** | — | pt→es | renovación de gimnasio |
| 152 | sms-servicio | franja+accion+lugar | simple | **reordenar** | es→pt | cita en la gestoría |
| 153 | recado-voz | objeto+franja+accion | simple | — | pt→es | portátil arreglado |
| 154 | recado-voz | dia+lugar+contacto | simple | **señuelo** | pt→es | cerrajero |
| 155 | recado-voz | accion+condicion+franja | simple | — | pt→es | electricista |
| 156 | recado-voz | dia+objeto+accion | simple | — | es→pt | ensayo de la coral |
| 157 | aviso-escolar | dia+objeto+accion+condicion | simple | — | pt→es | campamento de verano |
| 158 | aviso-escolar | dia+franja+lugar | simple | — | pt→es | reunión de padres |
| 159 | aviso-escolar | objeto+accion+dia | simple | **parcial** | pt→es | uniforme de gimnasia |
| 160 | aviso-escolar | dia+accion+condicion | simple | — | es→pt | vacunación escolar |
| 161 | email-servicio | dia+objeto+condicion+contacto | simple | **señuelo** | pt→es | seguro del hogar |
| 162 | email-servicio | dia+franja+accion | simple | — | pt→es | mantenimiento de la web |
| 163 | email-servicio | objeto+dia+condicion | **condicional** | — | pt→es | renovación del pasaporte |
| 164 | email-servicio | dia+lugar+objeto | simple | — | es→pt | curso de cocina |
| 165 | nota-manuscrita | objeto+lugar+franja | simple | — | es→pt | plantas del vecino |
| 166 | nota-manuscrita | accion+condicion+contacto | simple | — | es→pt | perro del vecino |
| 167 | nota-manuscrita | dia+objeto+accion | simple | **señuelo** | pt→es | tintorería |
| 168 | nota-manuscrita | lugar+franja+accion | simple | — | pt→es | riego del huerto |
| 169 | app-notificacion | franja+accion+condicion | simple | **reordenar** | pt→es | alerta de viento |
| 170 | app-notificacion | dia+lugar+objeto | simple | — | pt→es | entrega en punto de recogida |
| 171 | app-notificacion | franja+accion+lugar | simple | **reordenar** | es→pt | andén cambiado |
| 172 | app-notificacion | dia+franja+condicion | simple | **señuelo** | es→pt | corte de tráfico por carrera |
| 173 | **megafonia** | lugar+franja+accion | simple | **reordenar** | pt→es | embarque en Sete Rios |
| 174 | **megafonia** | objeto+lugar+contacto | simple | — | pt→es | niño perdido en el centro comercial |
| 175 | **megafonia** | dia+franja+accion | simple | — | pt→es | cierre del supermercado |
| 176 | **megafonia** | lugar+accion+condicion | simple | — | es→pt | evacuación de simulacro |
| 177 | **factura-recibo** | objeto+dia+condicion | simple | — | pt→es | recibo del agua |
| 178 | **factura-recibo** | dia+objeto+contacto | simple | **señuelo** | pt→es | cuota del condominio |
| 179 | **factura-recibo** | dia+condicion+accion | **contradictorio** | — | pt→es | factura de la luz |
| 180 | **factura-recibo** | objeto+dia+accion | simple | — | es→pt | matrícula del curso |
| 181 | **chat-grupo** | dia+franja+lugar+accion | simple | — | pt→es | cena de vecinos |
| 182 | **chat-grupo** | accion+objeto+condicion | **contradictorio** | — | pt→es | obras del 4.º |
| 183 | **chat-grupo** | dia+objeto+accion | simple | **parcial** | pt→es | regalo de la profesora |
| 184 | **chat-grupo** | franja+lugar+accion | simple | **señuelo** | es→pt | quedada del parque |

**Cumplimiento del contrato, medido**: `condicional` ×3 (142, 151,
163) · `corregido` ×1 (144) · `contradictorio` ×2 (179, 182, nuevo) ·
`parcial` ×2 (159, 183, nuevo) · señuelo ×10 (23 %) · reordenar ×5 ·
direcciones 31/13 = 70/30 · 11 géneros × 4 exactos · 44 dominios
nuevos, ninguno en el registro acumulado.

---

### MED-141 · portal-infra · pt→es · simple
**sourceText:**
> «Limpeza dos depósitos de água: terça-feira, dia 7, das 9h às 14h. Não
> haverá água nas torneiras durante esse período. Recomenda-se encher
> garrafões na véspera.»
**audience:** «tu compañera de piso española»
**instructionsEs:** «El aviso está en el portal. Cuéntaselo.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día y la franja (martes 7, de 9 a 14)?
2. ¿Traslada la consecuencia (no habrá agua en los grifos)?
3. ¿Traslada la acción preventiva (llenar garrafas la víspera)?
4. ¿Español natural, sin lusismos («torneiras», «véspera»), entre 25 y
   55 palabras?

**modelAnswer**:
> El martes 7, de nueve a dos, limpian los depósitos y nos quedamos sin
> agua en los grifos. Conviene que llenemos botellas la noche antes —
> yo me encargo si quieres, que tú entras a trabajar pronto.

### MED-142 · portal-infra · pt→es · condicional
**sourceText:**
> «Substituição dos contadores de eletricidade na quinta-feira, dia 16.
> O técnico passará por todas as frações. Caso não possa estar presente,
> deixe a chave na portaria até às 8h desse dia; sem acesso, a
> substituição fica adiada para dezembro.»
**audience:** «tu compañero de piso español, que ese día trabaja fuera»
**instructionsEs:** «El aviso está en el tablón. Cuéntaselo — a él le
toca decidir.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día y el qué (jueves 16, cambian los contadores de la
   luz, piso por piso)?
2. ¿Traslada la condición completa (si no puede estar, dejar la llave
   en portería antes de las 8 de ese día)?
3. ¿Traslada la consecuencia de no hacerlo (el cambio se aplaza a
   diciembre)?
4. ¿Español natural, sin lusismos («frações», «portaria» sin
   resolver), entre 30 y 65 palabras?

**modelAnswer**:
> El jueves 16 vienen a cambiar los contadores de la luz en todos los
> pisos. Como tú trabajas fuera, tendrías que dejar la llave en
> portería antes de las ocho de la mañana de ese día. Si no entran, no
> te lo cambian hasta diciembre.

### MED-143 · portal-infra · pt→es · señuelo
**sourceText:**
> «Desratização preventiva [processo interno DZ-4471]: quarta-feira, dia
> 22, das 10h às 13h, nas caves e zonas comuns. Pede-se que retirem
> sacos de lixo e alimentos para animais das garagens. As frações
> habitadas não são intervencionadas.»
**audience:** «tu compañera de piso española, que guarda el pienso del
gato en el trastero»
**instructionsEs:** «El aviso está en el portal. Cuéntaselo — lo que
importa es qué tiene que quitar.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día y la franja (miércoles 22, de 10 a 13) y dónde
   (sótanos y zonas comunes)?
2. ¿Traslada la acción que le toca (retirar de los garajes las bolsas
   de basura y la comida de animales)?
3. ¿Traslada la tranquilidad (en los pisos habitados no entran)?
4. ¿La respuesta NO incluye el número de proceso interno (DZ-4471)?
5. ¿Español natural, sin lusismos («caves», «intervencionadas»), entre
   30 y 65 palabras?

**modelAnswer**:
> El miércoles 22, de diez a una, hacen desratización en los sótanos y
> las zonas comunes. Hay que sacar de ahí las bolsas de basura y la
> comida de animales, así que baja el pienso del gato. En los pisos no
> entran, tranquila.

### MED-144 · portal-infra · pt→es · corregido (DOS avisos)
**sourceText:**
> «[Aviso de terça] Recolha de monos e mobílias velhas: sábado, dia 3,
> a partir das 8h. Deixar junto ao contentor, sem obstruir a passagem.
>
> [Aviso de hoje] RETIFICAÇÃO: a recolha de monos passa para DOMINGO,
> dia 4, à mesma hora. Quem já tenha deixado mobília à porta deve
> recolhê-la até sábado à noite.»
**audience:** «tu compañero de piso español, que ya bajó el sofá viejo»
**instructionsEs:** «Los dos avisos están en el tablón. UN mensaje con
el estado final — y con lo que le toca hacer ahora.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿El día vigente es el DOMINGO 4 (el sábado 3 no aparece como
   vigente)?
2. ¿Traslada lo que le toca por haber bajado ya el sofá (volver a
   subirlo o retirarlo antes del sábado por la noche)?
3. ¿Conserva la hora y la instrucción original (desde las 8, junto al
   contenedor, sin bloquear el paso)?
4. ¿Español natural, sin lusismos («monos», «recolha»), entre 30 y 65
   palabras?

**modelAnswer**:
> Cambio: la recogida de muebles no es el sábado 3 sino el domingo 4, a
> la misma hora, desde las ocho. Y ojo, que tú ya bajaste el sofá: hay
> que subirlo o apartarlo antes del sábado por la noche, porque si no
> se queda ahí un día entero bloqueando.

### MED-145 · cartel · pt→es · simple
**sourceText:**
> «Farmácia de serviço permanente esta semana: Farmácia Central, Rua da
> Sé, n.º 12. Atendimento noturno das 22h às 9h pelo postigo. Fora
> desse horário, funcionamento normal.»
**audience:** «tu madre, de visita, que puede necesitar algo de noche»
**instructionsEs:** «El cartel está en la puerta de la farmacia del
barrio. Explícaselo.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada cuál es la farmacia de guardia esta semana y dónde
   (Farmácia Central, Rua da Sé, 12)?
2. ¿Traslada la franja nocturna (de 22 a 9) y cómo se atiende (por la
   ventanilla)?
3. ¿Español natural, sin lusismos («postigo» resuelto, «atendimento»),
   entre 25 y 55 palabras?

**modelAnswer**:
> Esta semana la farmacia de guardia es la Central, en la Rua da Sé
> número 12. De diez de la noche a nueve de la mañana atienden por la
> ventanilla, llamando al timbre. El resto del día abren normal.

### MED-146 · cartel · pt→es · simple
**sourceText:**
> «DESAPARECEU gata siamesa, magra, com coleira vermelha sem chapa.
> Fugiu do n.º 14 da Travessa do Forno na noite de sexta. Atende por
> Mia. Quem a vir, telefone 962 118 340 — recompensa.»
**audience:** «tu amigo español del barrio, que sale a correr de
madrugada»
**instructionsEs:** «El cartel está en la farola de la esquina.
Pásaselo — él es el que más calle pisa a esas horas.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada qué se busca (gata siamesa, delgada, collar rojo sin
   chapa, responde a Mia)?
2. ¿Traslada de dónde y cuándo se escapó (del número 14 de la Travessa
   do Forno, la noche del viernes)?
3. ¿Traslada el contacto (962 118 340) y la recompensa?
4. ¿Español natural, sin lusismos («atende por», «coleira»), entre 25
   y 60 palabras?

**modelAnswer**:
> Tú que corres de madrugada: se ha escapado una gata siamesa del
> número 14 de la Travessa do Forno, la noche del viernes. Es delgada,
> lleva collar rojo sin chapa y responde a Mia. Si la ves, llama al 962
> 118 340; dan recompensa.

### MED-147 · cartel · pt→es · reordenar
**sourceText:**
> «Ecocentro municipal — novo horário de inverno: encerra às 17h (antes
> 20h). Encerrado aos domingos. Não são aceites resíduos de obra sem
> guia de transporte.»
**audience:** «tu compañera de piso española, que sale hoy a las 18h
con el maletero lleno de escombros»
**instructionsEs:** «Le va a pillar de lleno. Lo urgente primero.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿La PRIMERA frase mata su plan (a las 18h el punto limpio ya está
   cerrado: ahora cierra a las 17h)?
2. ¿Traslada la segunda pega, que también le afecta (no aceptan
   escombros de obra sin albarán de transporte)?
3. ¿Traslada el cierre dominical?
4. ¿Español natural, sin lusismos («ecocentro» resuelto, «guia»), entre
   25 y 60 palabras?

**modelAnswer**:
> ¡No salgas a las seis: el punto limpio ahora cierra a las cinco, han
> cambiado al horario de invierno! Y hay otra pega para lo que llevas:
> sin albarán de transporte no aceptan escombros de obra. Los domingos
> tampoco abren.

### MED-148 · cartel · es→pt · simple
**sourceText** (cartel en español, en el portal):
> «Recogida solidaria de alimentos: los sábados de octubre, en el
> vestíbulo del centro cívico. Se necesita sobre todo aceite, legumbres
> y leche. No se admiten productos frescos ni abiertos.»
**audience:** «o teu colega de casa português, que quer colaborar»
**instructionsEs:** «El cartel está en español y él no lo entiende.
Pásaselo en portugués.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada cuándo y dónde (los sábados de octubre, en el vestíbulo
   del centro cívico)?
2. ¿Traslada qué hace falta (aceite, legumbres y leche, sobre todo)?
3. ¿Traslada lo que NO se admite (productos frescos ni abiertos)?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> Há uma recolha solidária de alimentos aos sábados de outubro, no átrio
> do centro cívico. O que faz mais falta é azeite, leguminosas e leite.
> Não aceitam nada fresco nem embalagens já abertas — se quiseres,
> levamos juntos no sábado.

### MED-149 · sms-servicio · pt→es · simple
**sourceText:**
> «Centro de Saúde: consulta de pediatria do Tomás marcada para
> segunda-feira, dia 9, às 11h20, gabinete 4. Traga o boletim de saúde
> infantil. Em caso de febre, contacte antes pelo 217 445 900.»
**audience:** «tu pareja española — el Tomás es vuestro hijo»
**instructionsEs:** «El SMS llegó a tu móvil. Pásaselo con todo.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada día, hora y lugar (lunes 9, 11:20, consulta 4)?
2. ¿Traslada el objeto (llevar la cartilla de salud infantil)?
3. ¿Traslada la condición (si tiene fiebre, llamar antes al 217 445
   900)?
4. ¿Español natural, sin lusismos («gabinete», «boletim»), entre 25 y
   60 palabras?

**modelAnswer**:
> Ya tenemos cita del pediatra para el Tomás: el lunes 9 a las once y
> veinte, en la consulta 4. Hay que llevar la cartilla de salud. Y si
> ese día amanece con fiebre, dicen que llamemos antes al 217 445 900.

### MED-150 · sms-servicio · pt→es · señuelo
**sourceText:**
> «TecnoFix [OS 2026/8812]: o seu telemóvel está reparado. Levantamento
> na loja do Saldanha, com o comprovativo ou o documento de
> identificação. Garantia da reparação: 90 dias.»
**audience:** «tu hermana española, que te dejó el móvil para
arreglarlo»
**instructionsEs:** «El SMS llegó a tu número. Dile lo que necesita
saber.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada que el móvil está reparado y dónde se recoge (tienda del
   Saldanha)?
2. ¿Traslada qué hay que llevar (el resguardo o el documento de
   identidad)?
3. ¿Traslada la garantía (90 días)?
4. ¿La respuesta NO incluye el número de orden (OS 2026/8812)?
5. ¿Español natural, sin lusismos («levantamento», «comprovativo»),
   entre 25 y 55 palabras?

**modelAnswer**:
> Tu móvil ya está arreglado. Se recoge en la tienda del Saldanha
> llevando el resguardo o, si lo has perdido, el DNI. La reparación
> tiene noventa días de garantía, así que guarda el papel que te den.

### MED-151 · sms-servicio · pt→es · condicional
**sourceText:**
> «Ginásio Ritmo: a sua inscrição renova automaticamente a 1 de
> outubro, com a mensalidade em vigor. Caso não pretenda renovar,
> comunique por escrito até 20 de setembro, inclusive. Após essa data, a
> renovação é anual.»
**audience:** «tu primo español, que se va de Lisboa en noviembre»
**instructionsEs:** «El SMS llegó a tu móvil porque tú lo apuntaste.
Dile qué tiene que hacer y para cuándo.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada la renovación automática (el 1 de octubre, con la cuota
   vigente)?
2. ¿Traslada la condición con el plazo INCLUSIVO (para no renovar hay
   que avisar por escrito hasta el 20 de septiembre incluido)?
3. ¿Traslada la consecuencia (pasada esa fecha, la renovación es
   anual)?
4. ¿Español natural, sin lusismos («pretenda», «mensalidade»), entre 30
   y 65 palabras?

**modelAnswer**:
> Ojo con el gimnasio: si no dices nada, el 1 de octubre te renueva
> solo. Como te vas en noviembre, tienes que avisar por escrito como
> muy tarde el 20 de septiembre — ese día todavía vale. Si se te pasa,
> te atan un año entero.

### MED-152 · sms-servicio · es→pt · reordenar
**sourceText** (SMS en español):
> «Gestoría Ramos: su cita para la declaración se adelanta al jueves a
> las 9:15 (antes 12:30). Traiga los certificados de retenciones. Si no
> puede, responda a este SMS.»
**audience:** «o teu sócio português, que na quinta de manhã ia estar
noutro sítio»
**instructionsEs:** «Mándale el mensaje en portugués — lo urgente
primero, que la hora cambió.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿La PRIMERA frase contiene lo urgente (la cita se adelanta al
   jueves a las 9:15, ya no es a las 12:30)?
2. ¿Traslada qué hay que llevar (los certificados de retenciones)?
3. ¿Traslada la salida (si no puede, que responda al SMS)?
4. ¿Portugués natural por tu, entre 30 y 65 palabras?

**modelAnswer**:
> Atenção que mudaram a hora: a reunião na gestora passou para quinta
> às 9h15, já não é às 12h30. Tens de levar os certificados de
> retenções. Se a essa hora não puderes mesmo, responde ao SMS deles e
> remarcam.

### MED-153 · recado-voz · pt→es · simple
**sourceText** (mensaje de voz):
> «Boa tarde, é da assistência informática. O portátil está pronto:
> mudámos o disco e ficou com o sistema novo. Pode passar amanhã até às
> 18h; são 95 euros, e aceitamos multibanco. Traga a fatura antiga, se a
> tiver.»
**audience:** «tu padre español — el portátil es suyo»
**instructionsEs:** «El recado llegó a tu móvil. Pásaselo con los
datos.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada que el portátil está listo y qué le han hecho (cambiar el
   disco, sistema nuevo)?
2. ¿Traslada cuándo y cuánto (mañana hasta las 18h; 95 euros, con
   tarjeta)?
3. ¿Traslada el objeto opcional (llevar la factura antigua si la
   tiene)?
4. ¿Español natural, sin lusismos («fatura» resuelto, «multibanco»),
   entre 30 y 65 palabras?

**modelAnswer**:
> Papá, ya está el portátil: le han cambiado el disco y le han puesto
> el sistema nuevo. Puedes recogerlo mañana hasta las seis; son noventa
> y cinco euros y aceptan tarjeta. Si encuentras la factura vieja,
> llévala, aunque dicen que no es imprescindible.

### MED-154 · recado-voz · pt→es · señuelo
**sourceText** (mensaje de voz):
> «É do chaveiro da Praça Nova [serviço n.º 77]. Passei por sua casa às
> onze e não estava ninguém. Volto quinta-feira de manhã; se ninguém
> puder estar, deixe recado no 213 660 004 e combinamos outro dia. A
> chave nova fica pronta no próprio dia.»
**audience:** «tu compañera de piso española, que teletrabaja el
jueves»
**instructionsEs:** «El recado llegó a tu móvil. Dile lo que necesita
saber.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada que el cerrajero vino y no había nadie, y que vuelve el
   jueves por la mañana?
2. ¿Traslada la alternativa (si no puede estar nadie, dejar recado en
   el 213 660 004 y quedar otro día)?
3. ¿Traslada que la llave nueva queda hecha el mismo día?
4. ¿La respuesta NO incluye el número de servicio (77)?
5. ¿Español natural, entre 30 y 65 palabras?

**modelAnswer**:
> Ha venido el cerrajero a las once y no había nadie en casa. Vuelve el
> jueves por la mañana — como tú teletrabajas, te pilla bien. Si al
> final no puedes estar, hay que llamar al 213 660 004 para quedar otro
> día. La llave nueva la hacen en el momento.

### MED-155 · recado-voz · pt→es · simple
**sourceText** (mensaje de voz):
> «É o eletricista. Não consigo trocar o quadro sem cortar a luz a todo
> o prédio, e isso só pode ser das 14h às 16h, com autorização do
> condomínio. Falem com o administrador e digam-me qualquer coisa. Se
> não der, faço só a tomada da cozinha.»
**audience:** «tu casera española, a la que tratas de usted»
**instructionsEs:** «El recado llegó a tu móvil; la obra es de ella.
Cuéntaselo de usted.»
**wordRange:** 35–70 · **register:** formal
**Rúbrica:**
1. ¿Traslada el problema (no puede cambiar el cuadro sin cortar la luz
   de todo el edificio)?
2. ¿Traslada la franja y el requisito (sólo de 14 a 16, y con permiso
   de la comunidad: hay que hablar con el administrador)?
3. ¿Traslada el plan B (si no se puede, sólo arregla el enchufe de la
   cocina)?
4. ¿Español natural y de usted, sin lusismos («quadro» resuelto,
   «condomínio»), entre 35 y 70 palabras?

**modelAnswer**:
> Ha llamado el electricista. Dice que no puede cambiar el cuadro sin
> cortar la luz de todo el edificio, y que eso sólo se permite de dos a
> cuatro y con autorización de la comunidad, así que habría que hablar
> con el administrador. Si usted prefiere no complicarlo, deja hecho
> sólo el enchufe de la cocina.

### MED-156 · recado-voz · es→pt · simple
**sourceText** (mensaje de voz en español):
> «Hola, soy Carmen, de la coral. Que el ensayo del martes lo pasamos al
> miércoles, misma hora, porque el local está ocupado. Traed la carpeta
> azul, que empezamos con el repertorio nuevo. Y decidme quién viene,
> que necesito saber si somos suficientes.»
**audience:** «a tua amiga portuguesa da coral, que não percebe o
espanhol falado»
**instructionsEs:** «Pásale el recado en portugués, entero.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el cambio (el ensayo del martes pasa al miércoles, a la
   misma hora, porque el local está ocupado)?
2. ¿Traslada el objeto (llevar la carpeta azul: empiezan repertorio
   nuevo)?
3. ¿Traslada la petición (confirmar quién va, para saber si son
   suficientes)?
4. ¿Portugués natural por tu, entre 30 y 65 palabras?

**modelAnswer**:
> A Carmen deixou recado da coral: o ensaio de terça passa para
> quarta-feira, à mesma hora, porque a sala está ocupada. Leva a pasta
> azul, que vão começar o repertório novo. E ela pede que digas se
> podes ir — precisa de saber se são gente que chegue.

### MED-157 · aviso-escolar · pt→es · simple
**sourceText:**
> «Colónia de férias de julho: inscrições abertas até 15 de junho,
> inclusive. Vagas limitadas a 30 crianças. É necessário entregar a
> ficha de inscrição assinada e o comprovativo do seguro escolar. O
> pagamento pode ser feito em duas prestações.»
**audience:** «tu pareja española, que gestiona los papeles del niño»
**instructionsEs:** «Circular del colegio. Dile qué hay que entregar y
para cuándo.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el plazo INCLUSIVO (inscripciones hasta el 15 de junio
   incluido) y las plazas limitadas (30 niños)?
2. ¿Traslada los dos documentos (ficha de inscripción firmada y
   justificante del seguro escolar)?
3. ¿Traslada la facilidad de pago (en dos plazos)?
4. ¿Español natural, sin lusismos («colónia», «vagas»,
   «comprovativo»), entre 30 y 65 palabras?

**modelAnswer**:
> Lo del campamento de julio: hay que apuntarlo antes del 15 de junio,
> ese día todavía vale, y sólo cogen a treinta niños. Piden la ficha de
> inscripción firmada y el justificante del seguro escolar. Lo bueno es
> que se puede pagar en dos veces.

### MED-158 · aviso-escolar · pt→es · simple
**sourceText:**
> «Reunião de encarregados de educação do 3.º B: quinta-feira, dia 12,
> às 18h30, na sala 7. Ordem de trabalhos: visita de estudo, avaliação
> intercalar e eleição do representante dos pais.»
**audience:** «tu pareja española, que va a ir a la reunión»
**instructionsEs:** «Circular del cole. Cuéntale cuándo es y de qué va.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada día, hora y lugar (jueves 12, 18:30, aula 7)?
2. ¿Traslada los tres puntos del orden del día (excursión, evaluación
   intermedia y elección del representante de padres)?
3. ¿Español natural, sin lusismos («encarregados de educação», «ordem
   de trabalhos»), entre 25 y 55 palabras?

**modelAnswer**:
> Reunión de padres del 3.º B el jueves 12 a las seis y media, en el
> aula 7. Van a hablar de tres cosas: la excursión, la evaluación de
> mitad de curso y la elección del representante de los padres. ¿Vas tú
> o voy yo?

### MED-159 · aviso-escolar · pt→es · **parcial** (el aviso no lo dice todo)
**sourceText:**
> «A partir de outubro, a aula de Educação Física passa a ser à
> segunda-feira. Os alunos devem trazer o equipamento completo e
> sapatilhas de sola clara, obrigatórias no pavilhão.»
**audience:** «tu pareja española, que tiene que comprar las zapatillas»
**instructionsEs:** «Circular del cole. Cuéntale lo que dice — y dile
también qué NO dice, que es lo que nos falta para comprar.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el cambio (desde octubre, Educación Física pasa al lunes)?
2. ¿Traslada el material obligatorio (equipación completa y zapatillas
   de suela clara para el pabellón)?
3. ¿SEÑALA EL HUECO: la circular no dice desde qué lunes de octubre
   empieza (ni la hora), así que hay que preguntarlo?
4. ¿Español natural, sin lusismos («equipamento», «sapatilhas»), entre
   30 y 65 palabras?

**modelAnswer**:
> Desde octubre, la clase de gimnasia pasa a los lunes, y piden
> equipación completa y zapatillas de suela clara, que en el pabellón
> son obligatorias. Lo que no dicen es desde qué lunes empieza ni a qué
> hora, así que habrá que preguntarlo antes de comprar nada.

### MED-160 · aviso-escolar · es→pt · simple
**sourceText** (circular del colegio español):
> «El equipo de enfermería administrará la vacuna de la gripe el
> miércoles 19 a los alumnos cuyas familias hayan firmado la
> autorización. Los alumnos sin autorización firmada asistirán a clase
> con normalidad.»
**audience:** «o pai português de um colega do teu filho»
**instructionsEs:** «Él no lee bien el español administrativo. Pásale
la circular en portugués.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el día y el qué (miércoles 19, vacuna de la gripe en el
   colegio)?
2. ¿Traslada la condición (sólo a los alumnos cuya familia haya
   firmado la autorización)?
3. ¿Traslada que quien no la firme sigue en clase con normalidad?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> Chegou uma circular: na quarta, dia 19, a enfermagem vai dar a vacina
> da gripe, mas só aos alunos cujos pais tenham assinado a autorização.
> Quem não entregar o papel fica na aula na mesma, sem problema
> nenhum. Assinaste o teu?

### MED-161 · email-servicio · pt→es · señuelo
**sourceText:**
> «Seguro multirriscos habitação [apólice HM-55021]: a sua apólice
> renova a 30 de setembro. Se pretender alterar o capital seguro,
> comunique até 15 de setembro. A partir de outubro, a franquia passa
> de 150 € para 200 €.»
**audience:** «tu madre española, que es la titular del seguro»
**instructionsEs:** «El email llegó a tu correo. Dile lo que cambia y
qué puede hacer.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada la renovación (el seguro de hogar se renueva el 30 de
   septiembre)?
2. ¿Traslada la opción con plazo (si quiere cambiar el capital
   asegurado, avisar antes del 15 de septiembre)?
3. ¿Traslada el cambio que viene igualmente (la franquicia sube de 150
   a 200 € desde octubre)?
4. ¿La respuesta NO incluye el número de póliza (HM-55021)?
5. ¿Español natural, sin lusismos («apólice», «franquia» resuelto),
   entre 30 y 65 palabras?

**modelAnswer**:
> Mamá, el seguro de la casa se renueva el 30 de septiembre. Si quieres
> cambiar el capital asegurado, tienes que decirlo antes del 15. Y
> avisan de algo que pasa igual: desde octubre la franquicia sube de
> ciento cincuenta a doscientos euros.

### MED-162 · email-servicio · pt→es · simple
**sourceText:**
> «Manutenção programada: o portal do cliente estará indisponível na
> madrugada de sábado, entre as 2h e as 6h. Os pagamentos agendados
> nesse período serão processados às 7h. Não é necessário repetir
> operações.»
**audience:** «tu socia española, que suele pagar a proveedores de
madrugada»
**instructionsEs:** «El email llegó a los dos, pero ella no lee
portugués. Cuéntaselo.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada la franja de caída (la madrugada del sábado, de 2 a 6) y
   qué se cae (el portal del cliente)?
2. ¿Traslada qué pasa con los pagos programados en esa franja (se
   procesan a las 7)?
3. ¿Traslada la instrucción de no repetir operaciones?
4. ¿Español natural, sin lusismos («indisponível», «agendados»), entre
   25 y 60 palabras?

**modelAnswer**:
> El sábado de madrugada, entre las dos y las seis, el portal del banco
> estará caído por mantenimiento. Los pagos que tengas programados en
> esa franja se procesan a las siete. Sobre todo, no los repitas
> pensando que han fallado.

### MED-163 · email-servicio · pt→es · condicional
**sourceText:**
> «Renovação de passaporte: pode renovar a partir de seis meses antes da
> validade. Caso viaje para fora do espaço Schengen nos próximos 90
> dias, deve pedir marcação urgente, com custo adicional de 40 €. O
> prazo normal de entrega é de 12 dias úteis.»
**audience:** «tu hermano español, residente aquí, que vuela a Londres
en tres semanas»
**instructionsEs:** «El email es informativo. Dile lo que le toca a
él.»
**wordRange:** 30–70 · **register:** informal
**Rúbrica:**
1. ¿Traslada la regla general (se puede renovar desde seis meses antes
   de que caduque; entrega normal en 12 días hábiles)?
2. ¿Traslada la condición que le afecta (si viaja fuera de Schengen en
   los próximos 90 días, cita urgente con 40 € de recargo)?
3. ¿Aterriza que Londres está fuera de Schengen y que su viaje entra
   en esa ventana?
4. ¿Español natural, sin lusismos («marcação», «dias úteis» resuelto),
   entre 30 y 70 palabras?

**modelAnswer**:
> Lo del pasaporte: se puede renovar desde seis meses antes de que
> caduque, y tardan doce días hábiles. Pero como tú vuelas a Londres en
> tres semanas y eso está fuera de Schengen, te toca pedir cita urgente
> — cuesta cuarenta euros más, pero llegas.

### MED-164 · email-servicio · es→pt · simple
**sourceText** (email en español):
> «Curso de cocina de temporada: cuatro sesiones, los martes de
> noviembre, de 19 a 21 h, en el aula-cocina del mercado. Plazas: 12.
> Incluye materiales; cada asistente se lleva lo que cocina.»
**audience:** «a tua vizinha portuguesa, que anda a aprender espanhol
mas ainda não o lê bem»
**instructionsEs:** «Pásaselo en portugués — a ella le interesa
apuntarse.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el formato (cuatro sesiones, los martes de noviembre, de
   19 a 21)?
2. ¿Traslada el lugar y las plazas (aula-cocina del mercado, 12
   plazas)?
3. ¿Traslada lo que incluye (materiales, y cada uno se lleva lo que
   cocina)?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> Há um curso de cozinha de época: quatro sessões, às terças de
> novembro, das 19h às 21h, na cozinha-escola do mercado. São só 12
> lugares. Os materiais estão incluídos e cada um leva para casa o que
> cozinhar. Queres que nos inscrevamos juntas?

### MED-165 · nota-manuscrita · es→pt · simple
**sourceText** (nota de la vecina, en español):
> «¡Hola! Me voy diez días. Te dejo la llave para que riegues: las de la
> terraza, cada dos días; el ficus del salón, sólo una vez por semana y
> poca agua. El correo lo recoge mi hijo, no te preocupes.»
**audience:** «o teu colega de casa português, que vai tratar das
plantas contigo»
**instructionsEs:** «La nota es de la vecina y él no lee español.
Pásasela en portugués.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el encargo y su duración (regar durante diez días, con la
   llave que dejó)?
2. ¿Traslada las DOS pautas distintas (las de la terraza cada dos
   días; el ficus del salón una vez por semana y poca agua)?
3. ¿Traslada lo que NO tenemos que hacer (el correo lo recoge su
   hijo)?
4. ¿Portugués natural por tu, entre 30 y 65 palabras?

**modelAnswer**:
> A vizinha foi-se por dez dias e deixou a chave para regarmos. As
> plantas da varanda, de dois em dois dias; o fícus da sala só uma vez
> por semana e com pouca água — cuidado que esse morre afogado. O
> correio não é connosco, vem cá o filho dela.

### MED-166 · nota-manuscrita · es→pt · simple
**sourceText** (nota en el buzón, en español):
> «Vecinos: mi perro está recién operado y no puede subir escaleras. Si
> lo veis atado abajo un rato por las mañanas, es que estoy subiendo la
> compra. Cualquier cosa, llamadme al 655 40 12 88. Perdonad las
> molestias.»
**audience:** «o teu colega de casa português, que se assusta com o
cão»
**instructionsEs:** «La nota es del vecino del bajo. Pásasela en
portugués — para que no se preocupe.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el motivo (el perro está recién operado y no puede subir
   escaleras)?
2. ¿Traslada la situación concreta (si lo ve atado abajo por las
   mañanas, es que el dueño está subiendo la compra)?
3. ¿Traslada el contacto (655 40 12 88)?
4. ¿Portugués natural por tu, entre 30 y 65 palabras?

**modelAnswer**:
> O vizinho do rés do chão deixou um recado: o cão foi operado há pouco
> e não pode subir escadas. Se o vires amarrado lá em baixo de manhã,
> não te assustes — é só enquanto ele sobe as compras. Qualquer coisa,
> o número dele é 655 40 12 88.

### MED-167 · nota-manuscrita · pt→es · señuelo
**sourceText** (nota del tinte, grapada al ticket):
> «Recolha: casaco de lã e duas camisas [talão 3391]. Prazo normal:
> quinta-feira. As nódoas do casaco saíram todas menos a da manga, que
> precisa de tratamento especial — mais 8 €, se autorizar. Diga-nos até
> quarta.»
**audience:** «tu compañera de piso española, que dejó el abrigo»
**instructionsEs:** «La nota estaba en la puerta. Dile lo que hay y lo
que tiene que decidir.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada qué está listo y para cuándo (abrigo de lana y dos
   camisas, el jueves)?
2. ¿Traslada la decisión que le toca (la mancha de la manga necesita
   tratamiento especial: 8 € más, si autoriza)?
3. ¿Traslada el plazo para decidir (avisar antes del miércoles)?
4. ¿La respuesta NO incluye el número de resguardo (3391)?
5. ¿Español natural, sin lusismos («nódoas», «talão»), entre 30 y 65
   palabras?

**modelAnswer**:
> En la tintorería te dejan recado: el abrigo de lana y las dos camisas
> estarán el jueves. Le han salido todas las manchas menos la de la
> manga, que necesita un tratamiento aparte y cuesta ocho euros más.
> Tienes que decirles si lo hacen antes del miércoles.

### MED-168 · nota-manuscrita · pt→es · simple
**sourceText** (nota en la caseta del huerto comunitario):
> «Quem regar à noite, feche a torneira geral ao sair — ontem ficou
> aberta e perdeu-se meio depósito. O turno de rega é das 20h às 22h;
> fora disso, a bomba está desligada.»
**audience:** «tu amiga española, que tiene la parcela de al lado»
**instructionsEs:** «La nota está clavada en la caseta. Pásasela.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada la queja concreta (ayer quedó abierta la llave general y
   se perdió medio depósito)?
2. ¿Traslada la acción (quien riegue de noche, cerrar la llave general
   al salir)?
3. ¿Traslada el turno de riego (de 20 a 22; fuera de esa franja la
   bomba está apagada)?
4. ¿Español natural, sin lusismos («torneira», «rega»), entre 25 y 55
   palabras?

**modelAnswer**:
> Han dejado una nota en la caseta: ayer alguien se dejó abierta la
> llave general y se perdió medio depósito. Piden que quien riegue de
> noche la cierre al irse. El turno es de ocho a diez; fuera de esa
> hora la bomba ni funciona.

### MED-169 · app-notificacion · pt→es · reordenar
**sourceText:**
> «Aviso meteorológico laranja: vento forte com rajadas até 90 km/h
> entre as 22h de hoje e as 6h de amanhã. Recolha vasos e objetos
> soltos das varandas. Evite estacionar debaixo de árvores.»
**audience:** «tu compañera de piso española, que tiene el tendedero y
las macetas en la terraza»
**instructionsEs:** «La alerta saltó en tu móvil. Lo que hay que hacer
YA, primero.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿La PRIMERA frase pone la acción urgente (meter macetas y todo lo
   suelto de la terraza)?
2. ¿Traslada el aviso y su franja (alerta naranja por viento, rachas
   de hasta 90 km/h, de las 22h de hoy a las 6h de mañana)?
3. ¿Traslada la segunda recomendación (no aparcar debajo de árboles)?
4. ¿Español natural, sin lusismos («rajadas» vale, «recolha»), entre 25
   y 60 palabras?

**modelAnswer**:
> Mete ya las macetas y lo que tengas suelto en la terraza: hay alerta
> naranja por viento, con rachas de hasta noventa, desde las diez de
> esta noche hasta las seis de la mañana. Y no dejes el coche debajo de
> los árboles.

### MED-170 · app-notificacion · pt→es · simple
**sourceText:**
> «A sua encomenda não coube no cacifo e está no ponto de recolha da
> Papelaria Lopes, Rua Direita 8. Levantamento até domingo, das 9h às
> 19h, com o código enviado por SMS.»
**audience:** «tu compañero de piso español — el paquete es suyo»
**instructionsEs:** «La notificación llegó a tu móvil. Pásasela.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada dónde está el paquete y por qué (en el punto de recogida
   de la Papelaria Lopes, Rua Direita 8, porque no cabía en el
   casillero)?
2. ¿Traslada el plazo INCLUSIVO y la franja (hasta el domingo, de 9 a
   19)?
3. ¿Traslada que hace falta el código del SMS?
4. ¿Español natural, sin lusismos («cacifo», «levantamento»), entre 25
   y 55 palabras?

**modelAnswer**:
> Tu paquete no cabía en la taquilla y lo han dejado en el punto de
> recogida de la papelería Lopes, en la Rua Direita 8. Puedes ir hasta
> el domingo incluido, de nueve a siete, con el código que te llegó por
> SMS.

### MED-171 · app-notificacion · es→pt · reordenar
**sourceText** (notificación en español):
> «Cambio de andén: su tren a Sevilla sale ahora por la vía 11 (antes
> vía 3). Salida puntual a las 15:42. El acceso a la vía 11 es por la
> escalera del fondo.»
**audience:** «a tua amiga portuguesa, que está a comprar água na
estação»
**instructionsEs:** «Mándale el mensaje en portugués — lo urgente
primero.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿La PRIMERA frase contiene el cambio urgente (el tren sale por la
   vía 11, ya no por la 3)?
2. ¿Traslada la hora (15:42, puntual)?
3. ¿Traslada cómo se llega (por la escalera del fondo)?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> Mudaram a linha: o comboio sai da linha 11, já não é a 3. Parte às
> 15h42 e não esperam. Vai pelas escadas do fundo, que é por aí que se
> chega. Despacha-te com a água!

### MED-172 · app-notificacion · es→pt · señuelo
**sourceText** (notificación en español):
> «Aviso de tráfico [ref. TR-9082]: mañana domingo, de 8:00 a 14:00,
> corte total en el paseo marítimo por la carrera popular. Los
> autobuses 3 y 12 desvían por la avenida. Se recomienda no aparcar en
> la zona desde las 6:00.»
**audience:** «o teu colega de casa português, que costuma deixar o
carro no paseo»
**instructionsEs:** «Mándale el aviso en portugués — con lo que le
toca.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el corte (mañana domingo, de 8 a 14, cierran el paseo
   marítimo por una carrera)?
2. ¿Traslada lo que le toca (no dejar el coche en la zona a partir de
   las 6)?
3. ¿Traslada el desvío de los autobuses 3 y 12?
4. ¿La respuesta NO incluye la referencia (TR-9082)?
5. ¿Portugués natural por tu, entre 30 y 65 palabras?

**modelAnswer**:
> Amanhã, domingo, cortam a marginal das 8h às 14h por causa de uma
> corrida. Tira o carro de lá antes das 6h, senão ficas sem ele até à
> tarde. E os autocarros 3 e 12 vão desviados pela avenida, se
> precisares.

### MED-173 · megafonia · pt→es · reordenar · **género nuevo**
**sourceText** (megafonía de la estación):
> «Informação aos passageiros: o autocarro das 16h30 para Faro efetua
> hoje a partida no cais 9, e não no cais 4. O embarque encerra dez
> minutos antes da partida. Passageiros com bagagem de porão devem
> dirigir-se primeiro ao balcão.»
**audience:** «tu tía española, que está sentada en la cafetería con
las maletas»
**instructionsEs:** «Acabas de oír la megafonía y ella no la entendió.
Lo urgente primero.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿La PRIMERA frase contiene el cambio (el autobús de las 16:30 a
   Faro sale por la dársena 9, no la 4)?
2. ¿Traslada el cierre de embarque (diez minutos antes de la salida)?
3. ¿Traslada lo que le toca por llevar maletas (pasar antes por el
   mostrador para facturar)?
4. ¿Español natural, sin lusismos («cais», «porão»), entre 30 y 65
   palabras?

**modelAnswer**:
> Han cambiado la dársena: el autobús de las cuatro y media a Faro sale
> de la 9, no de la 4. Y cierran el embarque diez minutos antes, o sea
> a las cuatro y veinte. Como llevas maletas para la bodega, hay que
> pasar antes por el mostrador.

### MED-174 · megafonia · pt→es · simple · **género nuevo**
**sourceText** (megafonía del centro comercial):
> «Atenção: encontra-se no balcão de informações, no piso 0, um menino
> de cerca de quatro anos, de camisola azul, que responde pelo nome de
> Rodrigo. Os pais devem dirigir-se ao balcão com documento de
> identificação.»
**audience:** «tu amiga española, que está buscando a su sobrino»
**instructionsEs:** «Lo acabas de oír por megafonía. Díselo ya.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada dónde está el niño (mostrador de información, planta 0)?
2. ¿Traslada la descripción (unos cuatro años, jersey azul, responde
   al nombre de Rodrigo)?
3. ¿Traslada el requisito para recogerlo (ir con documento de
   identidad)?
4. ¿Español natural, sin lusismos («camisola», «balcão»), entre 25 y
   55 palabras?

**modelAnswer**:
> ¡Está en información, en la planta baja! Han dicho por megafonía que
> tienen a un niño de unos cuatro años, con jersey azul, que responde a
> Rodrigo. Corre para allá, pero llévate el DNI, que sin documento no
> te lo entregan.

### MED-175 · megafonia · pt→es · simple · **género nuevo**
**sourceText** (megafonía del supermercado):
> «Estimados clientes: informamos que a loja encerra dentro de quinze
> minutos. As caixas 1 e 2 encerram já; a caixa 5 mantém-se aberta até
> à saída do último cliente. Amanhã, domingo, abrimos das 9h às 13h.»
**audience:** «tu madre española, que sigue comparando yogures»
**instructionsEs:** «Lo has oído por megafonía. Métele prisa con los
datos.»
**wordRange:** 25–55 · **register:** informal
**Rúbrica:**
1. ¿Traslada el cierre inminente (la tienda cierra en quince minutos)?
2. ¿Traslada el detalle útil (las cajas 1 y 2 cierran ya; la 5 se
   queda abierta hasta el último cliente)?
3. ¿Traslada el horario de mañana (domingo, de 9 a 13)?
4. ¿Español natural, sin lusismos («encerra», «caixas»), entre 25 y 55
   palabras?

**modelAnswer**:
> Mamá, que cierran en un cuarto de hora. Las cajas 1 y 2 las están
> cerrando ya; la única que se queda es la 5. Coge lo que lleves y
> vamos — mañana domingo abren de nueve a una si falta algo.

### MED-176 · megafonia · es→pt · simple · **género nuevo**
**sourceText** (megafonía en español, edificio de oficinas):
> «Atención: se trata de un simulacro de evacuación. Abandonen el
> edificio por las escaleras, sin usar los ascensores, y reúnanse en el
> aparcamiento exterior. No recojan efectos personales.»
**audience:** «o teu colega português, que está numa reunião no 4.º
andar»
**instructionsEs:** «Mándale el mensaje en portugués, ya.»
**wordRange:** 25–55 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada que es un simulacro (no una emergencia real)?
2. ¿Traslada las instrucciones (salir por las escaleras, sin
   ascensores, y reunirse en el aparcamiento exterior)?
3. ¿Traslada que no hay que recoger efectos personales?
4. ¿Portugués natural por tu, entre 25 y 55 palabras?

**modelAnswer**:
> É um simulacro de evacuação, não é a sério. Sai já pelas escadas —
> nada de elevadores — e vai ter ao parque de estacionamento lá fora.
> Não percas tempo a arrumar coisas; deixa tudo como está e sai.

### MED-177 · factura-recibo · pt→es · simple · **género nuevo**
**sourceText** (recibo del agua):
> «Fatura n.º 2026/114 — Água e saneamento. Consumo do bimestre: 14 m³.
> Total a pagar: 38,60 €. Débito direto na conta terminada em 4471, a
> 5 de outubro. Reclamações no prazo de 30 dias.»
**audience:** «tu compañera de piso española, con la que divides los
gastos»
**instructionsEs:** «El recibo llegó al buzón. Cuéntaselo — os lo
repartís.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el importe y el concepto (38,60 € de agua y saneamiento,
   bimestre, 14 m³)?
2. ¿Traslada cómo y cuándo se cobra (domiciliado, el 5 de octubre)?
3. ¿Traslada el plazo de reclamación (30 días)?
4. ¿Español natural, sin lusismos («fatura», «débito direto»), entre 25
   y 60 palabras?

**modelAnswer**:
> Ha llegado el recibo del agua: 38,60 euros por el bimestre, catorce
> metros cúbicos. Lo pasan por el banco el 5 de octubre, así que te
> paso la mitad ese día. Si algo no cuadra, hay treinta días para
> reclamar.

### MED-178 · factura-recibo · pt→es · señuelo · **género nuevo**
**sourceText** (recibo del condominio):
> «Quota de condomínio — outubro [referência multibanco 21398 550
> 041236]. Valor: 42,00 €. Inclui fundo de reserva de 4,20 €.
> Pagamento até dia 8. Após essa data, acrescem juros de mora.»
**audience:** «tu casera española, que paga la cuota del condominio»
**instructionsEs:** «El recibo llegó al buzón del piso. Pásaselo por
mensaje — ella paga desde España.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el importe y el concepto (42 € de cuota de comunidad de
   octubre, con 4,20 € de fondo de reserva)?
2. ¿Traslada el plazo INCLUSIVO (hasta el día 8) y qué pasa después
   (intereses de demora)?
3. ¿La respuesta NO incluye la referencia larga de pago (que ella no
   necesita si paga por transferencia; se la puede pedir aparte)?
4. ¿Español natural, sin lusismos («quota», «juros de mora»), entre 25
   y 60 palabras?

**modelAnswer**:
> Ha llegado la cuota de la comunidad de octubre: cuarenta y dos euros,
> de los cuales cuatro veinte van al fondo de reserva. Hay que pagarla
> como muy tarde el día 8, que si no cobran intereses. Dime si quieres
> que la pague yo y me la descuentas.

### MED-179 · factura-recibo · pt→es · **contradictorio** · **género nuevo**
**sourceText** (factura de la luz):
> «Fatura de eletricidade — setembro. Leitura real: 210 kWh. Total:
> 54,30 €. Data limite de pagamento: 30 de setembro. Nota no verso:
> "Faturas emitidas após o dia 25 têm 15 dias para pagamento." Data de
> emissão: 26 de setembro.»
**audience:** «tu compañero de piso español, que lleva las cuentas»
**instructionsEs:** «La factura llegó hoy. Cuéntasela — y dile lo que
no cuadra, sin decidir tú.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el importe y el consumo (54,30 €, 210 kWh de septiembre,
   lectura real)?
2. ¿Traslada la fecha límite impresa (30 de septiembre)?
3. ¿SEÑALA LA CONTRADICCIÓN sin resolverla: la nota del reverso da 15
   días desde la emisión (26 de septiembre), lo que daría el 11 de
   octubre, y eso no cuadra con el 30?
4. ¿Español natural, sin lusismos («fatura», «leitura»), entre 30 y 65
   palabras?

**modelAnswer**:
> Factura de la luz de septiembre: 54,30 euros, 210 kWh, con lectura
> real. Pone como fecha límite el 30 de septiembre, pero al dorso dice
> que las facturas emitidas después del 25 tienen quince días — y ésta
> se emitió el 26, o sea que daría el 11 de octubre. No cuadra;
> conviene preguntar antes de pagar.

### MED-180 · factura-recibo · es→pt · simple · **género nuevo**
**sourceText** (recibo de matrícula, en español):
> «Matrícula curso 2026/27. Importe: 310 €. Fraccionamiento: dos plazos
> de 155 € (octubre y enero). El impago del segundo plazo supone la baja
> automática. Justificante disponible en la secretaría virtual.»
**audience:** «o teu colega português, que se matriculou contigo»
**instructionsEs:** «El recibo está en español. Pásaselo en portugués
con lo importante.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el importe y el fraccionamiento (310 € en dos plazos de
   155, en octubre y enero)?
2. ¿Traslada la consecuencia del impago del segundo plazo (baja
   automática)?
3. ¿Traslada dónde está el justificante (secretaría virtual)?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> A propina do curso são 310 euros, que podes pagar em duas
> prestações de 155 — uma em outubro, outra em janeiro. Atenção a esta:
> se falhares a segunda, dão-te baixa automática. O comprovativo está
> na secretaria virtual.

### MED-181 · chat-grupo · pt→es · simple · **género nuevo**
**sourceText** (grupo de vecinos):
> «— Malta, o jantar do prédio fica marcado para sábado, dia 25, às 20h,
> no pátio.
> — Cada um leva um prato para partilhar; as bebidas paga o condomínio.
> — Quem tiver mesas dobráveis, avise que ajudamos a descer.»
**audience:** «tu compañera de piso española»
**instructionsEs:** «El grupo es un caos. Resúmele lo que hay que
saber.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada día, hora y lugar (sábado 25, 20h, en el patio)?
2. ¿Traslada qué hay que llevar (un plato para compartir; las bebidas
   las pone la comunidad)?
3. ¿Traslada la petición extra (quien tenga mesas plegables, que
   avise)?
4. ¿Español natural, sin lusismos («malta», «partilhar»), entre 25 y
   60 palabras?

**modelAnswer**:
> La cena de vecinos es el sábado 25 a las ocho, en el patio. Cada uno
> lleva un plato para compartir y las bebidas las paga la comunidad. Y
> preguntan quién tiene mesas plegables — nosotras tenemos una, ¿la
> bajamos?

### MED-182 · chat-grupo · pt→es · **contradictorio** · **género nuevo**
**sourceText** (grupo de vecinos):
> «— Aviso: as obras do 4.º direito começam segunda e o senhorio diz que
> duram duas semanas.
> — O empreiteiro disse-me ontem que são seis semanas, no mínimo.
> — Seja como for, o barulho é das 8h às 17h e não haverá elevador nas
> tardes de quarta.»
**audience:** «tu compañero de piso español, que teletrabaja»
**instructionsEs:** «Resúmele el hilo — incluida la parte en la que no
se ponen de acuerdo.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada lo que SÍ está claro (las obras del 4.º empiezan el
   lunes; ruido de 8 a 17; sin ascensor los miércoles por la tarde)?
2. ¿SEÑALA LA CONTRADICCIÓN sin inventar cuál es cierta (el casero
   dice dos semanas y el contratista seis)?
3. ¿Español natural, sin lusismos («senhorio», «empreiteiro»), entre
   30 y 65 palabras?

**modelAnswer**:
> Empiezan las obras del cuarto el lunes. El ruido será de ocho a
> cinco, y los miércoles por la tarde nos quedamos sin ascensor. Lo que
> no está nada claro es cuánto duran: el casero dice dos semanas y el
> contratista le dijo a otro vecino que seis como mínimo. Tú que
> teletrabajas, hazte a la idea larga.

### MED-183 · chat-grupo · pt→es · **parcial** · **género nuevo**
**sourceText** (grupo de padres):
> «— Vamos juntar dinheiro para a prenda da professora, como no ano
> passado.
> — Eu trato de comprar; podem transferir para o meu MB WAY.
> — Fica combinado até ao fim da semana!»
**audience:** «tu pareja española, que va a poner el dinero»
**instructionsEs:** «Resúmele el hilo — y dile qué falta por saber
antes de mandar nada.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿Traslada el plan (juntar dinero para el regalo de la profesora,
   como el año pasado; una madre lo compra y se le transfiere)?
2. ¿Traslada el plazo (antes de fin de semana)?
3. ¿SEÑALA EL HUECO: en el hilo no dicen CUÁNTO pone cada uno ni el
   número de la persona, así que hay que preguntarlo antes de
   transferir?
4. ¿Español natural, sin lusismos («prenda», «MB WAY» explicado),
   entre 25 y 60 palabras?

**modelAnswer**:
> En el grupo de padres van a juntar dinero para el regalo de la
> profesora, como el año pasado: una madre lo compra y se le transfiere
> por móvil, antes del fin de semana. Pero no dicen cuánto pone cada
> uno ni dan el número, así que habrá que preguntarlo.

### MED-184 · chat-grupo · es→pt · señuelo · **género nuevo**
**sourceText** (grupo de amigos, en español):
> «— Quedada mañana en el parque del Retiro, junto al estanque, de 11 a
> 14.
> — Llevo yo la manta y el frisbee. ¡El que llegue tarde paga los
> helados!
> — Por cierto, ¿alguien sabe si abrieron ya el bar nuevo de la calle
> Huertas?»
**audience:** «o teu amigo português, que está de visita e não percebe
o grupo»
**instructionsEs:** «Pásale en portugués lo que necesita para ir. No
todo el hilo hace falta.»
**wordRange:** 25–60 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el plan (mañana en el parque del Retiro, junto al
   estanque, de 11 a 14)?
2. ¿Traslada lo práctico (alguien lleva manta y frisbee; el que llegue
   tarde paga los helados)?
3. ¿La respuesta OMITE la pregunta del bar de la calle Huertas, que no
   tiene nada que ver con la quedada?
4. ¿Portugués natural por tu, entre 25 y 60 palabras?

**modelAnswer**:
> Amanhã há encontro no parque do Retiro, ao pé do lago, das 11h às
> 14h. Um deles leva a manta e o frisbee, não precisas de levar nada. E
> atenção à regra: quem chegar atrasado paga os gelados a todos — por
> isso não te atrases!

---

## Muestreo adversarial del 10 % con FRENO

Muestra determinista (cada décimo desde el 145): **145, 155, 165,
175** — 4/44 = 9,1 %, redondeado al alza a 5 con **179** (el primer
`contradictorio`, modificador estrenado en este lote y por tanto el de
mayor riesgo). Regla pactada: **≥1 con error real ⇒ FRENO**, el lote
entero a mano. Error real fijado ANTES: falsedad lingüística en
sourceText/modelo/rúbrica; casilla que el modelo no tica; dato
inventado, alterado u omitido; calco no declarado; rúbrica no binaria;
deadline que pierda la inclusividad.

## Recuentos y gates (SALIDA PEGADA — se rellena antes de publicar)

```
(pendiente: publicador + gate de molde + virginidad)
```

## Sellos

`variantStatus: 'unchecked'` + `variantVerificacion: 'Línea B
aviso-v1.3 lote industrial 3 (escalado a 44): plantilla + muestreo
adversarial 11,4% 2026-08-30 (este doc)'`. Tags por matriz.
