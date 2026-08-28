# Plantilla de avisos v1.1 — línea B industrial · **PILOTO PUBLICADO 2026-08-28** (b2c2-med-61…68)

**Convergencia 2026-08-28 (R1 lingüístico · R2 pedagógico, sin verse):**
la matriz la verificaron AMBOS (pares sin repetir, géneros en cupo,
franjas en seis formatos, dominios disjuntos, fechas internamente
consistentes) y el portugués/español de las fuentes salió «de aviso
real» — pero el round encontró el molde donde la matriz no mira: en
las RESPUESTAS (orden-espejo 8/8, condición al final 8/8, arranques
repetidos) y en el calco de fórmula contra publicados (MED-61↔med-39).
El diagnóstico de R2 gobierna la v1.1: «la matriz varía los DATOS pero
no la OPERACIÓN pedida» — tras 50 ítems el alumno aprendería la
plantilla, no la destreza. Cambios v1→v1.1: (1) «señuelo» pasa a FLAG
ortogonal combinable (no era un modificador tipado — R1-D10/R2-D7);
(2) regla 1 pasa a «al menos 3 TIPOS distintos» (legaliza dia+dia de
MED-64 — R2-D8); (3) entra el EJE DE RELEVANCIA: cada ítem declara a
quién le importa cada dato; señuelo ~25 % del lote; ≥2 ítems por lote
industrial exigen REORDENAR (casilla operacional: «la primera frase
contiene [el dato urgente]») — la operación «decidir qué viaja y en
qué orden», que separa B1 de C1 (el MED-53 v2 del lote 7 estrena el
filtro por destinatario); (4) GATES DE MOLDE en el publicador de la
línea: ningún modelo repite el arranque (3 primeras palabras) de otro
del lote ni de un publicado de la clase; ningún sourceText comparte
n-grama ≥6 con un aviso publicado; verificación automática de la
matriz (las reglas se auditaban a ojo y a ojo se escaparon D7/D8);
(5) el «corregido» pasa a DOS AVISOS (el original + la rectificación
→ un solo mensaje con el estado final) — con la retificação sola, la
traducción ciega aprobaba (R2-D9); (6) `condicional` queda SIN pilotar
por decisión declarada: el primer lote industrial debe traer ≥1;
(7) PRERREQUISITO de escala (R2-D12, R1 converge): ancla propia antes
del primer lote industrial — lección/concept «avisos e recados» con el
checklist de bloque nuevo de la skill; hoy todo cuelga de
`b10-l1`/`b10-registro` y eso entierra la lección y ciega el eje de
concepts dentro de la clase.

Sesión E2#4, 2026-08-28. Primera plantilla de la línea B aprobada en
E2#2 (guardrails: matriz género×dato por lote, rúbrica derivada por
construcción, plantilla-id en tags; el gate de virginidad SÍ indexa
sourceText/modelAnswer de mediation — verificado entonces). La clase
es la de MED-38/39: aviso de 2–4 frases con 3–4 datos transmisibles,
tarea `relay`.

## La plantilla (contrato v1)

**Tupla generadora:** `(género, conjunto-de-datos, modificador,
dirección)`.

- **Géneros v1 (5):** `portal-infra` (avisos de edificio/servicios) ·
  `sms-servicio` (clínica, taller, paquetería…) · `recado-voz`
  (transcripción de mensaje de voz) · `cartel` (aviso en local
  público) · `aviso-escolar` (circular corta).
- **Tipos de dato (7):** `dia` · `franja` (hora o intervalo) · `lugar`
  · `accion` (lo que el receptor debe hacer) · `condicion` (si X ⇒ Y)
  · `objeto` (cosa/cantidad) · `contacto`.
- **Modificadores (3):** `simple` · `corregido` (el aviso RECTIFICA un
  dato; la rúbrica exige el valor nuevo y castiga el viejo) ·
  `condicional` (un dato solo vale bajo condición).

**Reglas de construcción (cada una es un guardrail):**
1. sourceText de 2–4 frases con **3–4 datos, de al menos 3 tipos
   distintos**. Dirección pt→es (aviso portugués → español) o es→pt.
2. **Rúbrica derivada por construcción**: una casilla por dato, con el
   VALOR entre paréntesis (verificable a la letra); más una casilla
   fija de lengua meta **operacionalizada con las palabras-trampa
   concretas del sourceText** (los lusismos/hispanismos que ese texto
   invita a calcar); más la casilla de rango. Nada de «suena natural»
   sin operacionalizar.
3. wordRange elegido por el autor con la regla MED-28: la respuesta
   mínima que tica todas las casillas debe caber. Guía: 25–60 para 3
   datos, 30–70 para 4.
4. **plantilla-id en tags**: `['b2c2-linea-b', 'plantilla:aviso-v1',
   'genero:<g>', 'datos:<d1+d2+…>', 'mod:<m>']`.
5. **Matriz por lote**: sin repetir el par (género,
   conjunto-de-datos); ningún género más de 3 veces por lote; al menos
   un `corregido` por lote (obliga a DISCRIMINAR, no a copiar);
   direcciones ≈ 70/30 pt→es / es→pt.
6. **Dominios no reciclados**: el servicio/asunto del aviso no repite
   ninguno ya publicado ni del lote artesanal en curso (registro al
   final de este doc).
7. Gates de máquina antes de revisor: `check-bleed-docs` +
   `check-virginidad --nuevos` (al umbral del código, 0,34) sobre los
   ítems completos (sourceText y modelAnswer entran al índice).
8. El ciclo adversarial NO se salta: piloto con doble revisor; a
   escala, muestreo adversarial del 10 % con freno (la regla de los
   unchecked), como aprobó E2#2.

**Anti-atajos de la clase** (para que el alumno no aprenda la
plantilla en vez de la destreza): varía el NÚMERO de datos (3 o 4);
al menos un aviso lleva un dato-señuelo que NO hace falta trasladar
(p. ej. el nº de referencia interna) y la rúbrica no lo pide; el
`corregido` castiga el traslado ciego; las franjas se dicen de formas
distintas (das 9h às 17h · entre as três e as cinco · até às 12h).

## Piloto (8 ítems) — ids previstos `b2c2-med-61…68`

*(La numeración se corre si el lote 7 pierde ítems en el round; los
ids finales los asigna el publicador.)* Todos `type: mediation`,
`mediationType: relay`, b10, `lessonId: b10-l1-registro-formal-
informal`, concepts `[b10-registro]`.

**Matriz del piloto:**

| # | género | datos | mod | flags | dir |
|---|---|---|---|---|---|
| 61 | portal-infra | dia+franja+accion+condicion | simple | — | pt→es |
| 62 | sms-servicio | objeto+lugar+franja+condicion | simple | **señuelo** | pt→es |
| 63 | recado-voz | objeto+accion+franja+contacto | simple | — | pt→es |
| 64 | cartel | dia+dia+lugar+accion (3 tipos) | simple | — | pt→es |
| 65 | aviso-escolar | dia+objeto+accion+condicion | simple | — | pt→es |
| 66 | portal-infra | dia+franja+accion | **corregido** (dos avisos) | — | pt→es |
| 67 | sms-servicio | dia+franja+lugar+condicion | simple | — | es→pt |
| 68 | recado-voz | objeto+lugar+franja+contacto | simple | — | es→pt |

### MED-61 · portal-infra · pt→es · simple (v2: apertura propia; sin datos inventados; c2 binaria)
**sourceText:**
> «Aviso — corte de energia elétrica: quinta-feira, dia 4, das 14h às
> 18h, para substituição do quadro geral do prédio. Recomenda-se
> desligar os aparelhos sensíveis. Caso o corte se prolongue para além
> das 18h, os moradores devem contactar a EDP pelo 216 999 000.»
**audience:** «tu compañero de piso español, que no lee portugués»
**instructionsEs:** «El aviso apareció en el portal. Cuéntaselo en
español con todo lo que le afecta.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día (jueves 4)?
2. ¿Traslada la franja (corte de luz de 14 a 18) y el motivo (cambio
   del cuadro eléctrico)?
3. ¿Traslada la acción (desenchufar los aparatos delicados)?
4. ¿Traslada la condición (si pasa de las 18h, llamar a la eléctrica
   al 216 999 000)?
5. ¿Español natural, sin lusismos («moradores», «quadro geral»), entre
   30 y 65 palabras?

**modelAnswer**:
> Oye, aviso del portal: el jueves 4 cortan la luz de dos a seis de
> la tarde, que cambian el cuadro eléctrico del edificio. Conviene
> desenchufar los aparatos delicados. Y si a las seis no ha vuelto,
> hay que llamar a la eléctrica: 216 999 000.

### MED-62 · sms-servicio · pt→es · con dato-señuelo
**sourceText:**
> «Lab. Clínico Silva & Matos [ref.ª 2026-08-1147]: os resultados das
> suas análises já se encontram disponíveis. Podem ser levantados na
> receção do laboratório, das 8h às 19h, mediante apresentação do
> cartão de cidadão. Após 30 dias serão arquivados.»
**audience:** «tu madre, española, que fue quien se hizo los análisis
en su visita»
**instructionsEs:** «El SMS llegó a tu móvil portugués, pero los
análisis son de tu madre. Pásaselo en español. (No todo lo que trae
el SMS le hace falta.)»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el objeto (los resultados de sus análisis, listos)?
2. ¿Traslada el lugar (recepción del laboratorio) y la franja (de 8 a
   19)?
3. ¿Traslada la condición doble (llevar el documento de identidad; a
   los 30 días los archivan)?
4. ¿La respuesta NO incluye la referencia interna (2026-08-1147)? (La
   instrucción ya avisa: «No todo lo que trae el SMS le hace falta».)
5. ¿Español natural, sin lusismos («levantar» por recoger, «cartão de
   cidadão» sin traducir), entre 30 y 65 palabras?

**modelAnswer** *(conteo por script abajo)*:
> Mamá, ya están tus análisis. Los recogen en la recepción del
> laboratorio, de ocho de la mañana a siete de la tarde — llévate el
> DNI, que lo piden. Y no lo dejes pasar: a los treinta días los
> archivan.

### MED-63 · recado-voz · pt→es · simple
**sourceText** (mensaje de voz):
> «Boa tarde, daqui é da oficina. O carro do senhor Navarro está
> pronto: mudámos as pastilhas dos travões e o óleo. Pode passar a
> levantá-lo hoje até às 19h; paga com multibanco à saída. Qualquer
> coisa, é ligar para a oficina e perguntar pelo Álvaro.»
**audience:** «tu jefe español, el señor Navarro, al que tratas de
usted»
**instructionsEs:** «Llevaste el coche de tu jefe al taller y el
mensaje te llegó a ti. Dale el recado en español, de usted.»
**wordRange:** 35–70 · **register:** formal
**Rúbrica:**
1. ¿Traslada el objeto y lo hecho (el coche está listo: pastillas de
   freno y aceite)?
2. ¿Traslada la acción con su límite (puede recogerlo hoy hasta las
   19h)?
3. ¿Traslada el pago (con tarjeta / en el datáfono a la salida)?
4. ¿Traslada el contacto (llamar al taller y preguntar por Álvaro)?
5. ¿Español natural, sin lusismos («oficina» por taller,
   «levantar» por recoger, «multibanco» sin resolver), de usted, entre
   35 y 70 palabras?

**modelAnswer**:
> Señor Navarro: han llamado del taller. Su coche ya está listo — le
> cambiaron las pastillas de freno y el aceite. Puede pasar a
> recogerlo hoy hasta las siete de la tarde; se paga con tarjeta a la
> salida. Si necesita cualquier cosa, que llame al taller y pregunte
> por Álvaro.

### MED-64 · cartel · pt→es · simple
**sourceText:**
> «A biblioteca municipal encerra de 15 a 19 de setembro para
> inventário. Reabrimos segunda-feira, dia 22. Durante o encerramento,
> as devoluções podem ser feitas na caixa exterior, junto à porta
> principal. Os prazos de empréstimo ficam suspensos.»
**audience:** «tu amiga española de intercambio, que tiene libros
prestados»
**instructionsEs:** «El cartel está en la puerta de la biblioteca.
Cuéntaselo en español — a ella le afectan los libros que tiene en
casa.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el cierre con sus fechas (del 15 al 19 de septiembre, por
   inventario)?
2. ¿Traslada la reapertura (lunes 22)?
3. ¿Traslada el lugar alternativo (devoluciones en el buzón exterior,
   junto a la puerta principal)?
4. ¿Traslada la acción/tranquilidad (los plazos de préstamo quedan
   suspendidos — no corren)?
5. ¿Español natural, sin lusismos («encerra», «empréstimo»), entre 30
   y 65 palabras?

**modelAnswer**:
> La biblioteca cierra del 15 al 19 de septiembre por inventario;
> vuelven a abrir el lunes 22. Si quieres devolver los libros esos
> días, hay un buzón fuera, junto a la puerta principal. Y tranquila
> con los plazos: quedan congelados mientras esté cerrada.

### MED-65 · aviso-escolar · pt→es · simple
**sourceText:**
> «Exmos. Encarregados de Educação: a visita de estudo ao Oceanário
> realiza-se na sexta-feira, dia 12. Cada aluno deve trazer 9 euros e
> a autorização assinada até quarta-feira, dia 10. Sem autorização, o
> aluno permanece na escola em atividades alternativas.»
**audience:** «tu pareja española — el niño es de los dos, pero el
portugués lo llevas tú»
**instructionsEs:** «La circular llegó en la mochila. Cuéntale a tu
pareja qué hay que hacer y para cuándo.»
**wordRange:** 30–65 · **register:** informal
**Rúbrica:**
1. ¿Traslada el día de la excursión (viernes 12, al Oceanário)?
2. ¿Traslada el objeto (9 euros)?
3. ¿Traslada la acción con su plazo (autorización firmada hasta el
   miércoles 10)?
4. ¿Traslada la condición (sin autorización se queda en la escuela)?
5. ¿Español natural, sin lusismos («encarregados de educação»,
   «visita de estudo» literal), entre 30 y 65 palabras?

**modelAnswer** *(conteo por script abajo)*:
> Amor, circular del cole: el viernes 12 llevan a los niños de
> excursión al Oceanário. Hay que mandar 9 euros y la autorización
> firmada como muy tarde el miércoles 10 — si no la entregamos, el
> niño se queda en el colegio con actividades alternativas.

### MED-66 · portal-infra · pt→es · **corregido, DOS AVISOS** (v2: el mod con dientes)
**sourceText:**
> «[Aviso afixado ontem] Desinfestação das zonas comuns: terça-feira,
> dia 9, das 10h às 12h. Pede-se aos moradores que fechem as janelas e
> não deixem animais nas zonas comuns.
>
> [Aviso de hoje] RETIFICAÇÃO: no aviso de ontem, onde se lê
> “terça-feira, dia 9”, deve ler-se “QUARTA-feira, dia 10”. O horário
> e as restantes indicações mantêm-se.»
**audience:** «tu compañero de piso español, que no lee portugués y no
sabe nada de esto»
**instructionsEs:** «Los dos avisos están hoy en el portal, uno al
lado del otro. Escríbele UN solo mensaje con el estado final — que no
quede ni rastro del dato viejo como vigente.»
**wordRange:** 25–60 · **register:** informal
**Rúbrica:**
1. ¿El mensaje presenta como día vigente el MIÉRCOLES 10 (el martes 9
   no aparece, o aparece solo como cancelado)?
2. ¿Confirma el horario (de 10 a 12)?
3. ¿Conserva las dos acciones (cerrar ventanas; no dejar animales en
   las zonas comunes)?
4. ¿Español natural, sin lusismos («desinfestação» sin resolver,
   «moradores»), entre 25 y 60 palabras?

**modelAnswer**:
> Aviso del portal: el miércoles 10 fumigan las zonas comunes, de diez
> a doce — lo habían puesto para el martes, pero lo han pasado. Ese
> día deja las ventanas cerradas, y nada de dejar al gato por la
> escalera.

### MED-67 · sms-servicio · es→pt · simple
**sourceText:**
> «Clínica Dental Aranda: le recordamos su cita el lunes 15 a las 9:40
> en nuestra consulta de la calle Mayor, 28. Si no puede asistir,
> responda NO a este mensaje con 24 h de antelación; de lo contrario
> se facturará la visita.»
**audience:** «o teu colega de casa português — a consulta é dele, mas
deu o teu número espanhol»
**instructionsEs:** «El SMS te llegó a ti en español. Pásaselo a tu
compañero en portugués, por mensaje.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el día y la hora (lunes 15, 9:40)?
2. ¿Traslada el lugar (la consulta de la calle Mayor, 28)?
3. ¿Traslada la condición completa (avisar respondiendo NO con 24
   horas de antelación; si no, cobran la visita)?
4. ¿Portugués sin españolismos — se conservan «calle Mayor, 28»
   (nombre propio de vía) y el «NO» literal (comando del sistema) —,
   tratando al colega por tu, entre 30 y 65 palabras?

**modelAnswer** *(conteo por script abajo)*:
> Chegou-me um SMS do teu dentista: lembram-te a consulta de
> segunda-feira, dia 15, às 9h40, no consultório da calle Mayor, 28.
> Se não puderes ir, tens de responder NO com 24 horas de
> antecedência — senão cobram-te a consulta na mesma.

### MED-68 · recado-voz · es→pt · simple
**sourceText** (mensaje de voz):
> «Hola, guapo, soy Maruja, la del tercero. Que os ha llegado un
> paquete grandote y lo tengo yo, que el cartero no quería dejarlo en
> el portal. Pasaos a por él cuando queráis, pero antes de las nueve,
> que luego me acuesto. Si no estoy, me llamáis al 611 22 33 44.»
**audience:** «o teu colega de casa português, que não percebe o
espanhol falado da D. Maruja»
**instructionsEs:** «El paquete es de tu compañero. Déjale el recado
en portugués, por mensaje escrito.»
**wordRange:** 30–65 · **register:** informal · **address:** tu
**Rúbrica:**
1. ¿Traslada el objeto (un paquete grande vuestro/tuyo)?
2. ¿Traslada el lugar-persona (lo tiene la vecina del tercero, la D.
   Maruja)?
3. ¿Traslada la franja (pasar a por él antes de las nueve)?
4. ¿Traslada el contacto (si no está, llamarla al 611 22 33 44)?
5. ¿Portugués natural por tu (sin calcos de «grandote», «pasaos a por
   él»), entre 30 y 65 palabras?

**modelAnswer**:
> Tens uma encomenda grande à tua espera! Está com a D. Maruja, a
> vizinha do terceiro andar — o carteiro não a quis deixar no portal.
> Passa por lá quando quiseres, mas antes das nove, que depois ela se
> deita. Se não estiver, liga-lhe: 611 22 33 44.

**Notas del autor — RESUELTAS en convergencia (2026-08-28):**
(l) el gag «paquete… aliás» se corta (R1: Priberam no registra
«paquete»=encomenda y el modelo debe ticar su casilla ante evaluador
binario; R2 converge) — el tropiezo queda como material de lección
b11, no de modelAnswer.
(m) defendible y correcto (R1: nombre propio de vía y comando literal
NO se traducen) — la excepción entra EN la casilla 4.
(n) binaria negativa («¿NO incluye la referencia interna?») — voto
convergente de ambos; «premia» era inautoevaluable.
(o) matriz verificada por ambos; sus dos huecos (señuelo sin tipar,
dia+dia vs regla) son los cambios (1) y (2) de la v1.1.

## Registro de dominios usados (para la regla 6)

Publicados: agua+ascensor (med-39) · pintura zonas comunes (med-41) ·
reunión jueves→viernes (med-38, med-46) · informe por email (med-47) ·
llamada de mañana (med-48) · condición de entrada (med-45).
Lote 7 en curso: visita de cliente (53) · caldera/fontanero (54) ·
calefacción/senhorio (55) · toma de medicamento (56) · desayuno en
casa (57) · tranvía/merienda (58).
Piloto: corte de luz (61) · análisis clínicos (62) · taller de coche
(63) · biblioteca (64) · excursión escolar (65) · fumigación (66) ·
cita dental (67) · paquete de vecina (68).

## Recuentos (SALIDA PEGADA del script de conteo, 2026-08-28)

```
== CONTEOS piloto ==
MED-61 (30-65): 48 OK
MED-62 (30-65): 39 OK
MED-63 (35-70): 49 OK
MED-64 (30-65): 44 OK
MED-65 (30-65): 44 OK
MED-66 (25-60): 39 OK
MED-67 (30-65): 40 OK
MED-68 (30-65): 46 OK
```

## Sellos previstos

`variantStatus: 'unchecked'` + `variantVerificacion: 'Línea B
plantilla aviso-v1 piloto: 2 linguistas adversariais 2026-08-28 (este
doc)'`. El publicador valida ANTES de escribir.
