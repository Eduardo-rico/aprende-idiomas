# Familia de plantilla · MEDIACIÓN-ÍTEM v1 — «fidelidad de relay»

**Sesión E2#9, 2026-08-31.** Primera familia de la línea industrial que
produce **ítems** de mediación, no tareas. Es el frente que ataca el
bucket de **1.580 a cero**; las tareas quedan congeladas en 183/230 por
decisión de Edu.

---

## 1 · Por qué es otro producto, y por qué eso importa

La tarea de mediación que produjo la línea B es: fuente → **rúbrica de
4-5 casillas** → respuesta libre de 25-70 palabras, evaluada a mano o por
juez LLM. El ítem del currículo es otra cosa: **corto, de respuesta
cerrada, autocorregible**.

Y la diferencia no es sólo de coste. El lote industrial 3 midió que
**12 de sus 20 errores fueron trasvase roto rúbrica↔gold**: la casilla
nombraba un dato que la respuesta modelo no decía. Un ítem cerrado **no
tiene rúbrica que trasvasar**, así que esa clase de error —la dominante,
la que hizo saltar el freno— desaparece por construcción, no por
vigilancia. Ése es el argumento de diseño principal de esta familia.

## 2 · Qué estrategia del Companion Volume ejercita

CV2020, **Mediar un texto → «Transmitir información específica»**, con el
criterio de evaluación que el propio currículo fija para las tareas de
mediación de este curso:

> «MEDIACIÓN: 3 tareas de relay ES↔PT puntuadas por fidelidad de
> contenido ≥85% (**dato omitido o añadido = fallo**).» — currículo A2,
> criterio de salida 4

La tarea EVALÚA la fidelidad; el ítem la ENSEÑA. El alumno ve un aviso y
un recado que alguien ya escribió, y tiene que decir **qué se perdió, qué
se inventó o qué cambió** — o que no falla nada. Es la misma competencia
que la tarea puntúa, en formato de detección.

Que sea detección y no producción es deliberado: el currículo de C2 pide
explícitamente 150 ejercicios «de detección (¿esto lo escribió un
nativo?, ¿dónde está la ironía?, ¿qué registro es?)». Esta familia es la
versión de mediación de esa idea, disponible desde B1.

## 3 · La matriz

Tres ejes. El de género se hereda de la plantilla de avisos v1.3 (once
géneros ya probados); los otros dos son nuevos.

**Eje 1 · género** (11): portal-infra · cartel · sms-servicio ·
recado-voz · aviso-escolar · email-servicio · nota-manuscrita ·
app-notificacion · megafonia · factura-recibo · chat-grupo.

**Eje 2 · dirección** (2): `pt→es` (el alumno audita un recado español de
una fuente portuguesa) y `es→pt` (audita un recado portugués). El segundo
es más difícil y va en menor proporción.

**Eje 3 · tipo de fallo** (6) — **y aquí está lo que hace barata a esta
familia**: la taxonomía no es inventada, son las clases de error que la
revisión completa del lote industrial 3 midió una por una. El catálogo de
fallos que costó 20 errores reales se convierte en el generador de
distractores.

| tipo | qué se le hace al recado fiel | de dónde sale |
|---|---|---|
| **PLAZO** | «até X» (incluye X) se rinde como «antes de X» (lo excluye) | 5 de los 20 errores del lote 3, y la clase que frenó el lote 1 |
| **OMISIÓN** | se borra un dato que la fuente da | la clase más numerosa del lote 3 |
| **INVENCIÓN** | se añade un dato que la fuente no da | MED-145 («llamando al timbre», que el cartel no decía) |
| **ALTERACIÓN** | se cambia el valor de un dato (día, hora, importe, sitio) | MED-183, que movió la fecha |
| **REASIGNACIÓN** | cambia quién debe hacerlo o quién decide | MED-155 («Se não der» → «si usted prefiere») y MED-174 («os pais» → la tía) |
| **FIEL** | nada: el recado es correcto | control anti-atajo, ver §6 |

Reparto del lote 1: FIEL 6 · PLAZO 4 · OMISIÓN 4 · INVENCIÓN 4 ·
ALTERACIÓN 3 · REASIGNACIÓN 3 = **24**. Dirección: 18 `pt→es` + 6 `es→pt`.

## 4 · Cómo se deriva la respuesta por construcción

El ítem no se «escribe»: se **deriva**, en cuatro pasos mecánicos.

1. Se escribe la fuente (aviso PT-PT o ES real, 25-45 palabras) y se
   **enumera su lista de datos**: día, hora, plazo, lugar, importe,
   condición, agente, motivo.
2. Se escribe el **recado fiel** — la línea base. Traslada todos los
   datos de la lista, sin añadir ninguno.
3. Se aplica **UNA transformación** de la tabla del §3 sobre **UN** dato
   concreto de la lista. Para los ítems FIEL no se aplica ninguna.
4. La **respuesta correcta es el nombre de la transformación aplicada**.
   No hay juicio: el autor sabe la clave porque acaba de ejecutarla.

Por eso el documento del lote guarda **las dos versiones** de cada
recado, la fiel y la mostrada. No es documentación: es lo que hace
verificable el ítem. Sin la línea base no se puede comprobar que la
transformación es la declarada, y el ítem vuelve a depender del juicio
del autor — que es exactamente lo que rompió el lote de 44.

## 5 · Cómo se valida sin rúbrica humana

Cinco gates de máquina, en `scripts/check-fidelidad-mediacion.ts`. Los
cinco son binarios y no admiten discusión:

1. **Una sola transformación.** El recado mostrado y el fiel difieren en
   exactamente un tramo (o en ninguno, si es FIEL). Dos cambios harían
   ambigua la clave.
2. **La clave nombra la transformación aplicada.** `correctIndex` apunta
   a la etiqueta declarada en la matriz; para FIEL, a «No falla nada».
3. **El dato tocado existe en la fuente.** No se puede omitir ni alterar
   algo que la fuente nunca dijo (eso sería INVENCIÓN, otra clase).
4. **Los tres distractores son plausibles.** Cada etiqueta falsa tiene
   que nombrar un tipo de dato que la fuente CONTIENE. Ofrecer «falta el
   precio» donde no hay precio deja resolver el ítem por eliminación sin
   leer el recado. Éste es el gate importante: es el único que ataca un
   atajo, y es enteramente mecánico.
5. **FIEL es idéntico.** En los ítems de control, el recado mostrado es
   byte a byte el recado fiel.

Más los gates que ya existen y se heredan enteros: virginidad (IDF +
`concepts`), molde de mediación **corrido también dentro del lote** (la
cicatriz de E2#7), `check-bleed-docs`, y validación del `ExerciseSchema`
ANTES de escribir.

## 6 · Los atajos, y cómo se miden

Un ítem de opción múltiple se resuelve sin saber portugués si el diseño
lo permite. Los cuatro atajos previstos, con su medición obligatoria en
cada lote:

- **«Siempre falla algo».** Si todos los ítems tienen defecto, el alumno
  nunca comprueba la fidelidad, sólo elige cuál. Por eso **6 de 24 son
  FIEL** (25 %), y su respuesta correcta es «No falla nada».
- **Eliminación por dato ausente.** Lo mata el gate 4.
- **Posición de la clave.** `correctIndex` tiene que repartirse cerca del
  uniforme: 6 por posición en un lote de 24. Se cuenta por script.
- **Longitud.** Si la etiqueta correcta fuera sistemáticamente la más
  larga o la más corta, se acierta midiendo. Se cuenta por script.

Y el atajo que NO se puede matar con la plantilla y por eso se vigila a
mano: que el recado con defecto suene **peor en español** que el fiel. El
recado defectuoso tiene que ser un español impecable; el fallo es de
contenido, nunca de lengua. Un revisor lo comprueba en el round.

## 7 · Protocolo de producción

Idéntico al de la línea B, con el tamaño que E2#8 midió: **lotes de 24,
nunca de 44** (24 → 17 % de error, 44 → 45 %). Gates de máquina →
muestreo adversarial del 10 % con freno a >2 % → round adversarial →
convergencia → publicar por script validando antes de escribir.

Ancla: `b10-l3-avisos-e-recados` · concepto **nuevo**
`b10-fidelidad-relay` · ids `b2c2-mfid-NN` · tipo `multiple_choice`.

Nota de runner: `MultipleChoiceCard` colapsaba los saltos de línea, así
que la fuente y el recado salían como un solo párrafo centrado.
Corregido con `whitespace-pre-line` y alineación a la izquierda **sólo
cuando el enunciado tiene saltos**; los 37 `multiple_choice` anteriores
no tienen ni uno, así que se ven exactamente igual. Con test que fija
las dos mitades del contrato.

---

# Lote 1 de la familia — 24 ítems

Formato de cada ficha: la fuente, su lista de datos, el **recado fiel**
(línea base), el **recado mostrado**, la transformación aplicada, las
cuatro etiquetas con la clave marcada, y la explicación.

---

### MFID-01 · portal-infra · pt→es · **PLAZO**
**fuente:**
> «Corte de água na próxima terça-feira, dia 14, para substituição de
> canos no piso 2. A água volta até às 17h. Encham garrafas na véspera,
> se faz favor.»
**datos:** día (martes 14) · motivo (cambio de tuberías, piso 2) · plazo de regreso (hasta las 17h, incluidas) · recomendación (llenar botellas la víspera)
**recado fiel:**
> «El martes 14 cortan el agua para cambiar unas tuberías del segundo. Vuelve como muy tarde a las cinco. Dicen de llenar botellas la noche antes.»
**recado mostrado:**
> «El martes 14 cortan el agua para cambiar unas tuberías del segundo. Vuelve antes de las cinco. Dicen de llenar botellas la noche antes.»
**transformación:** PLAZO sobre «até às 17h»
**opciones:** [0] Falta el motivo del corte · [1] **Se adelanta el plazo** ✅ · [2] Cambia el día · [3] No falla nada
**explicación:** «Até às 17h» incluye las cinco: a esa hora el agua ya está. «Antes de las cinco» promete que vuelve *antes*, que es otra cosa y más optimista. La fórmula fiel es «como muy tarde a las cinco».

### MFID-02 · cartel · pt→es · **FIEL**
**fuente:**
> «Talho Silva — encerrado para férias de 1 a 15 de agosto. Reabrimos
> dia 16 às 8h. As encomendas de Natal já se podem deixar por escrito na
> mercearia do lado.»
**datos:** cierre (1 al 15 de agosto) · reapertura (día 16 a las 8h) · encargos (de Navidad, por escrito, en la tienda de al lado)
**recado fiel:**
> «La carnicería cierra por vacaciones del 1 al 15 de agosto y abre otra vez el 16 a las ocho. Los encargos de Navidad se pueden dejar por escrito en la tienda de al lado.»
**recado mostrado:** *(idéntico al fiel)*
**transformación:** ninguna
**opciones:** [0] Falta la hora de reapertura · [1] Cambia las fechas del cierre · [2] **No falla nada** ✅ · [3] Añade algo que el cartel no dice
**explicación:** Están los tres datos y ninguno de más: las fechas de cierre, la reapertura con su hora y el detalle de los encargos. Un recado fiel también hay que saber reconocerlo.

### MFID-03 · sms-servicio · pt→es · **OMISIÓN**
**fuente:**
> «Centro de Saúde da Lapa: a sua consulta de enfermagem passou para
> quarta, dia 9, às 11h20, no gabinete 3. Traga a lista da medicação.
> Para desmarcar, responda ANULAR.»
**datos:** día (miércoles 9) · hora (11h20) · lugar (gabinete 3) · qué llevar (la lista de medicación) · cómo anular (responder ANULAR)
**recado fiel:**
> «Te han cambiado la consulta de enfermería al miércoles 9 a las once y veinte, en el gabinete 3. Hay que llevar la lista de la medicación, y si no puedes, se anula respondiendo ANULAR.»
**recado mostrado:**
> «Te han cambiado la consulta de enfermería al miércoles 9 a las once y veinte. Hay que llevar la lista de la medicación, y si no puedes, se anula respondiendo ANULAR.»
**transformación:** OMISIÓN de «no gabinete 3»
**opciones:** [0] **Falta el lugar** ✅ · [1] Cambia la hora · [2] Añade algo que el SMS no dice · [3] No falla nada
**explicación:** El SMS dice «no gabinete 3» y el recado no lo traslada. En un centro de salud con varios gabinetes, ése es el dato que decide si llegas o no: una omisión que parece menor no lo es si es la que te deja en el pasillo.

### MFID-04 · recado-voz · pt→es · **INVENCIÓN**
**fuente:**
> «É o canalizador. Passo amanhã de manhã, entre as nove e o meio-dia,
> para ver a torneira da cozinha. Se não estiver ninguém, deixe a chave
> na vizinha do 2.º direito.»
**datos:** cuándo (mañana por la mañana, de nueve a doce) · qué (el grifo de la cocina) · condición (si no hay nadie, llave a la vecina del 2.º derecha)
**recado fiel:**
> «Ha llamado el fontanero. Viene mañana por la mañana, entre las nueve y las doce, a mirar el grifo de la cocina. Si no hay nadie, que dejes la llave a la vecina del segundo derecha.»
**recado mostrado:**
> «Ha llamado el fontanero. Viene mañana por la mañana, entre las nueve y las doce, a mirar el grifo de la cocina y a darte el presupuesto. Si no hay nadie, que dejes la llave a la vecina del segundo derecha.»
**transformación:** INVENCIÓN de «y a darte el presupuesto»
**opciones:** [0] Falta la condición de la llave · [1] Cambia la franja horaria · [2] **Añade algo que el recado no dice** ✅ · [3] No falla nada
**explicación:** El fontanero no dice nada de presupuesto: sólo que viene a ver el grifo. Añadir un dato verosímil es tan infiel como perder uno — y más peligroso, porque nadie lo echa de menos.

### MFID-05 · aviso-escolar · pt→es · **ALTERACIÓN**
**fuente:**
> «Entrega dos manuais escolares usados na segunda-feira, dia 8, das 14h
> às 16h30, no pavilhão. Cada aluno traz os livros num saco identificado
> com o nome e a turma.»
**datos:** día (lunes 8) · franja (de 14h a 16h30) · lugar (el pabellón) · qué hay que llevar (los libros en una bolsa con el nombre y la clase)
**recado fiel:**
> «El lunes 8 se entregan los libros de texto usados, de dos a cuatro y media, en el pabellón. Cada alumno lleva los libros en una bolsa con su nombre y su clase.»
**recado mostrado:**
> «El lunes 8 se entregan los libros de texto usados, de tres a cuatro y media, en el pabellón. Cada alumno lleva los libros en una bolsa con su nombre y su clase.»
**transformación:** ALTERACIÓN de «das 14h» → «de tres»
**opciones:** [0] Falta lo que hay que llevar · [1] Cambia el sitio · [2] No falla nada · [3] **Cambia la hora** ✅
**explicación:** El aviso abre a las 14h, o sea a las dos. «De tres a cuatro y media» se come la primera hora de las dos y media que había: quien llegue a las dos y cuarto se encontrará la puerta abierta y creerá que se ha equivocado de día.

### MFID-06 · email-servicio · pt→es · **REASIGNACIÓN**
**fuente:**
> «Renovação do cartão de cidadão: o titular tem de comparecer
> pessoalmente na loja do cidadão, com o cartão antigo. O agendamento
> pode ser feito por terceiros através do portal.»
**datos:** quién comparece (el titular, en persona) · dónde (loja do cidadão) · qué lleva (el carné antiguo) · quién puede pedir cita (terceros, por el portal)
**recado fiel:**
> «Para renovar el carné tienes que ir tú en persona a la loja do cidadão con el carné viejo. La cita sí te la puede pedir otra persona por internet.»
**recado mostrado:**
> «Para renovar el carné puede ir cualquiera de la familia a la loja do cidadão con el carné viejo. La cita sí te la puede pedir otra persona por internet.»
**transformación:** REASIGNACIÓN de «o titular tem de comparecer pessoalmente»
**opciones:** [0] **Cambia quién tiene que hacerlo** ✅ · [1] Falta lo que hay que llevar · [2] Cambia el sitio · [3] No falla nada
**explicación:** El correo separa dos cosas: comparecer sólo puede el titular, pedir la cita puede cualquiera. El recado se lleva esa distinción por delante, y quien lo lea mandará a otro a hacer una cola inútil.

### MFID-07 · nota-manuscrita · pt→es · **FIEL**
**fuente:**
> «Fui às compras, volto pelas 13h. O guisado está no frigorífico, é só
> aquecer 5 minutos. Se tocarem à porta, é a encomenda da farmácia —
> paga-se lá, são 12 euros.»
**datos:** dónde va y cuándo vuelve (compras, hacia las 13h) · comida (guiso en la nevera, calentar 5 min) · el paquete (farmacia, se paga allí, 12 euros)
**recado fiel:**
> «Se ha ido a comprar y vuelve sobre la una. El guiso está en la nevera, se calienta cinco minutos. Si llaman a la puerta es el pedido de la farmacia: se paga en el momento, son doce euros.»
**recado mostrado:** *(idéntico al fiel)*
**transformación:** ninguna
**opciones:** [0] Falta el precio del pedido · [1] **No falla nada** ✅ · [2] Cambia la hora de vuelta · [3] Añade algo que la nota no dice
**explicación:** Los tres bloques están y con sus valores: la hora de vuelta, los cinco minutos del guiso y los doce euros de la farmacia. «Pelas 13h» es aproximado y «sobre la una» lo conserva: rendir bien una aproximación también es fidelidad.

### MFID-08 · app-notificacion · pt→es · **PLAZO**
**fuente:**
> «Biblioteca: a renovação do livro que requisitou foi aceite. O novo
> prazo de entrega é até quarta-feira, dia 22, inclusive. Não são
> permitidas mais renovações.»
**datos:** qué (la renovación aceptada) · nuevo plazo (hasta el miércoles 22 incluido) · condición (no se puede renovar más)
**recado fiel:**
> «Te han renovado el libro de la biblioteca. El nuevo plazo para devolverlo es hasta el miércoles 22 incluido, y ya no se puede renovar más veces.»
**recado mostrado:**
> «Te han renovado el libro de la biblioteca. El nuevo plazo para devolverlo es antes del miércoles 22, y ya no se puede renovar más veces.»
**transformación:** PLAZO sobre «até quarta-feira, dia 22, inclusive»
**opciones:** [0] Falta la condición de no renovar más · [1] Cambia el día de entrega · [2] No falla nada · [3] **Se adelanta el plazo** ✅
**explicación:** El aviso dice «inclusive» con todas las letras: el miércoles 22 todavía vale. «Antes del miércoles 22» le quita un día entero, y en una biblioteca que ya no admite más renovaciones ese día es el que separa devolver de pagar multa.

### MFID-09 · megafonia · pt→es · **OMISIÓN**
**fuente:**
> «Informamos os senhores clientes de que a secção de peixaria encerra
> às 19h, meia hora antes do resto da loja. As caixas 1 e 2 mantêm-se
> abertas até ao fecho.»
**datos:** qué cierra (la pescadería) · cuándo (19h) · comparación (media hora antes que el resto) · excepción (cajas 1 y 2 abiertas hasta el cierre)
**recado fiel:**
> «Han dicho por megafonía que la pescadería cierra a las siete, media hora antes que el resto de la tienda, y que las cajas 1 y 2 siguen abiertas hasta el final.»
**recado mostrado:**
> «Han dicho por megafonía que la pescadería cierra a las siete, media hora antes que el resto de la tienda.»
**transformación:** OMISIÓN de «As caixas 1 e 2 mantêm-se abertas até ao fecho»
**opciones:** [0] **Falta la excepción de las cajas** ✅ · [1] Cambia la hora de cierre · [2] Añade algo que el aviso no dice · [3] No falla nada
**explicación:** El aviso tiene dos mitades y el recado sólo traslada la primera. La segunda es la que sirve para algo: te dice que aún puedes pagar. Resumir no es quedarse con la frase de delante.

### MFID-10 · factura-recibo · pt→es · **INVENCIÓN**
**fuente:**
> «Recibo do seguro de recheio n.º 88/2026. Prémio anual: 96,40 €.
> Pagamento único a 30 de setembro. A apólice cobre danos por água a
> partir dessa data.»
**datos:** importe (96,40 € al año) · fecha de pago (30 de septiembre) · qué cubre y desde cuándo (daños por agua, a partir de esa fecha)
**recado fiel:**
> «Ha llegado el recibo del seguro de la casa: 96,40 euros al año, que se pagan de una vez el 30 de septiembre. Desde ese día cubre los daños por agua.»
**recado mostrado:**
> «Ha llegado el recibo del seguro de la casa: 96,40 euros al año, que se pagan de una vez el 30 de septiembre. Desde ese día cubre los daños por agua y los robos.»
**transformación:** INVENCIÓN de «y los robos»
**opciones:** [0] Falta la fecha del pago · [1] **Añade algo que el recibo no dice** ✅ · [2] Cambia el importe · [3] No falla nada
**explicación:** El recibo nombra una sola cobertura, la de daños por agua. Añadir los robos es el invento más caro posible: alguien se creerá cubierto de algo que no ha contratado, y sólo lo descubrirá el día que le entren en casa.

### MFID-11 · chat-grupo · pt→es · **FIEL**
**fuente:**
> «Malta, o jantar de turma passa para sábado 27, às 20h, no restaurante
> do costume. São 25 € por pessoa, bebidas incluídas. Quem não puder que
> avise até quinta.»
**datos:** día y hora (sábado 27, 20h) · sitio (el restaurante de siempre) · precio (25 €, bebidas incluidas) · plazo para avisar (hasta el jueves)
**recado fiel:**
> «La cena de la clase se pasa al sábado 27 a las ocho, en el restaurante de siempre. Son 25 euros por persona con las bebidas incluidas, y quien no pueda que avise como muy tarde el jueves.»
**recado mostrado:** *(idéntico al fiel)*
**transformación:** ninguna
**opciones:** [0] Cambia el precio · [1] Falta el sitio · [2] Añade algo que el mensaje no dice · [3] **No falla nada** ✅
**explicación:** Los cuatro datos están, y el plazo se rinde bien: «até quinta» incluye el jueves y «como muy tarde el jueves» también. Es el modelo de lo que la familia pide.

### MFID-12 · portal-infra · pt→es · **ALTERACIÓN**
**fuente:**
> «Os contentores do lixo mudam para a Rua das Amoreiras a partir do dia
> 3. Os do lixo orgânico ficam onde estão. A recolha passa a ser às
> segundas, quartas e sextas.»
**datos:** qué se mueve (los contenedores) · adónde (Rua das Amoreiras) · desde cuándo (a partir del día 3) · qué NO se mueve (el orgánico) · días de recogida (lunes, miércoles y viernes)
**recado fiel:**
> «Desde el día 3, los contenedores pasan a la Rua das Amoreiras; los del orgánico se quedan donde están. Y la recogida cambia a lunes, miércoles y viernes.»
**recado mostrado:**
> «Desde el día 3, los contenedores pasan a la Rua das Amendoeiras; los del orgánico se quedan donde están. Y la recogida cambia a lunes, miércoles y viernes.»
**transformación:** ALTERACIÓN de «Rua das Amoreiras» → «Rua das Amendoeiras»
**opciones:** [0] **Cambia el sitio** ✅ · [1] Falta lo que NO se mueve · [2] Se retrasa el plazo · [3] No falla nada
**explicación:** «Amoreiras» (moreras) y «Amendoeiras» (almendros) se parecen lo bastante como para colarse, y son dos calles distintas. El parecido no es una excusa: en mediación, un nombre propio se copia, no se recuerda.

### MFID-13 · cartel · pt→es · **REASIGNACIÓN**
**fuente:**
> «Obras no elevador de 5 a 9 de maio. Quem precisar de ajuda com as
> compras deve avisar o porteiro até às 11h. Os sacos ficam na
> portaria.»
**datos:** obras (ascensor, del 5 al 9 de mayo) · a quién se avisa (el portero) · plazo (hasta las 11h) · dónde quedan las bolsas (la portería)
**recado fiel:**
> «Del 5 al 9 de mayo arreglan el ascensor. Quien necesite ayuda con la compra tiene que avisar al portero como muy tarde a las once, y las bolsas se quedan en portería.»
**recado mostrado:**
> «Del 5 al 9 de mayo arreglan el ascensor. Quien necesite ayuda con la compra tiene que avisar a la administración como muy tarde a las once, y las bolsas se quedan en portería.»
**transformación:** REASIGNACIÓN de «o porteiro» → «la administración»
**opciones:** [0] Falta dónde quedan las bolsas · [1] Se adelanta el plazo · [2] No falla nada · [3] **Cambia a quién hay que avisar** ✅
**explicación:** El cartel dice que se avise al portero, que es quien está abajo esos días. El recado manda al vecino a la administración, que no lleva esto: el aviso llega a quien no puede hacer nada con él.

### MFID-14 · sms-servicio · pt→es · **PLAZO**
**fuente:**
> «Farmácia Central: a sua encomenda de medicamentos chegou. Guardamo-la
> até sexta-feira, dia 18. Depois disso volta ao fornecedor. Horário:
> 9h-19h.»
**datos:** qué (el pedido de medicamentos, llegado) · plazo de guarda (hasta el viernes 18) · qué pasa después (vuelve al proveedor) · horario (9h-19h)
**recado fiel:**
> «Han avisado de la farmacia: ya está tu pedido. Te lo guardan hasta el viernes 18 incluido; después lo devuelven al proveedor. Abren de nueve a siete.»
**recado mostrado:**
> «Han avisado de la farmacia: ya está tu pedido. Te lo guardan hasta el jueves 17; después lo devuelven al proveedor. Abren de nueve a siete.»
**transformación:** PLAZO sobre «até sexta-feira, dia 18»
**opciones:** [0] Falta qué pasa después · [1] Cambia el horario de la farmacia · [2] **Se adelanta el plazo** ✅ · [3] No falla nada
**explicación:** Un día de menos en un plazo de medicamentos que se devuelven. Aquí el error no se disfraza de «antes de»: cambia directamente el día, que es la versión burda de la misma clase.

### MFID-15 · recado-voz · pt→es · **OMISIÓN**
**fuente:**
> «Bom dia, é da oficina. O carro está pronto, mas a inspeção só a
> podemos fazer na quinta. Pode levantá-lo hoje e voltar, ou deixá-lo cá
> até quinta. Diga qualquer coisa.»
**datos:** el coche está listo · la ITV sólo el jueves · dos opciones (llevárselo y volver, o dejarlo hasta el jueves) · piden respuesta
**recado fiel:**
> «Han llamado del taller: el coche ya está, pero la ITV no se la pueden hacer hasta el jueves. Puedes recogerlo hoy y volver el jueves, o dejarlo allí hasta entonces. Quieren que les digas algo.»
**recado mostrado:**
> «Han llamado del taller: el coche ya está, pero la ITV no se la pueden hacer hasta el jueves. Puedes recogerlo hoy y volver el jueves. Quieren que les digas algo.»
**transformación:** OMISIÓN de la primera opción («Pode levantá-lo hoje e voltar»)
**opciones:** [0] Cambia el día de la inspección · [1] **Falta una de las dos opciones** ✅ · [2] Añade algo que el taller no dice · [3] No falla nada
**explicación:** El taller ofrece elegir y el recado convierte la elección en obligación. Comerse una de dos alternativas no es acortar: es decidir por el otro, que es el fallo de mediación más silencioso que hay.

### MFID-16 · aviso-escolar · pt→es · **INVENCIÓN**
**fuente:**
> «Fotografia escolar na terça-feira, dia 7. Os alunos vêm com a camisola
> do uniforme. As encomendas fazem-se online até dia 20, com o código que
> vai na caderneta.»
**datos:** día (martes 7) · qué se ponen (la camiseta del uniforme) · encargos (por internet, hasta el día 20) · código (viene en la libreta)
**recado fiel:**
> «El martes 7 hacen la foto del colegio. Los niños van con la camiseta del uniforme. Los encargos se hacen por internet como muy tarde el día 20, con el código que viene en la libreta.»
**recado mostrado:**
> «El martes 7 hacen la foto del colegio. Los niños van con la camiseta del uniforme y bien peinados. Los encargos se hacen por internet como muy tarde el día 20, con el código que viene en la libreta.»
**transformación:** INVENCIÓN de «y bien peinados»
**opciones:** [0] **Añade algo que el aviso no dice** ✅ · [1] Falta el código de los encargos · [2] Cambia el día · [3] No falla nada
**explicación:** El aviso sólo pide la camiseta del uniforme. «Y bien peinados» es lo que el mediador supone que se sobreentiende, y por eso es el añadido más fácil de colar: nadie lo cuestiona porque suena a sentido común. Sigue siendo un dato que el colegio no ha pedido.

### MFID-17 · email-servicio · pt→es · **FIEL**
**fuente:**
> «A sua reserva na Pousada da Serra está confirmada para 3 noites, de 12
> a 15 de junho, quarto duplo com pequeno-almoço. Check-in a partir das
> 15h. Cancelamento gratuito até 5 de junho.»
**datos:** noches (3, del 12 al 15 de junio) · habitación (doble con desayuno) · check-in (a partir de las 15h) · cancelación (gratis hasta el 5 de junio)
**recado fiel:**
> «La reserva está confirmada: tres noches, del 12 al 15 de junio, habitación doble con desayuno. Se puede entrar a partir de las tres y se cancela gratis hasta el 5 de junio incluido.»
**recado mostrado:** *(idéntico al fiel)*
**transformación:** ninguna
**opciones:** [0] Falta el desayuno · [1] Cambia el número de noches · [2] **No falla nada** ✅ · [3] Se adelanta el plazo de cancelación
**explicación:** Están las tres noches, el régimen, la hora de entrada y el plazo de cancelación, y este último con su inclusividad conservada («até 5 de junho» → «hasta el 5 incluido»). El distractor del plazo es el que más tienta: aquí está bien resuelto.

### MFID-18 · nota-manuscrita · pt→es · **PLAZO**
**fuente:**
> «Vizinha: rego-lhe as plantas enquanto está fora. A do hall precisa de
> água de três em três dias. Deixo a chave na caixa do correio até
> domingo à noite, depois levo-a comigo.»
**datos:** qué hace (regar las plantas) · cuál necesita más (la del recibidor, cada tres días) · dónde deja la llave (buzón) · hasta cuándo (domingo por la noche)
**recado fiel:**
> «La vecina te riega las plantas mientras no estás. La del recibidor hay que regarla cada tres días. La llave la deja en el buzón hasta el domingo por la noche; a partir de ahí se la lleva.»
**recado mostrado:**
> «La vecina te riega las plantas mientras no estás. La del recibidor hay que regarla cada tres días. La llave la deja en el buzón antes del domingo por la noche; a partir de ahí se la lleva.»
**transformación:** PLAZO sobre «até domingo à noite»
**opciones:** [0] Falta cada cuánto se riega · [1] **Se adelanta el plazo de la llave** ✅ · [2] Cambia dónde deja la llave · [3] No falla nada
**explicación:** «Hasta el domingo por la noche» significa que el domingo por la noche la llave todavía está. «Antes del domingo por la noche» deja fuera justo el momento en que uno vuelve de viaje.

### MFID-19 · cartel · es→pt · **OMISIÓN**
**fuente (ES):**
> «Biblioteca municipal: durante las obras, la sala de estudio se
> traslada al sótano. Entrada por la puerta lateral de la calle Mayor.
> Horario reducido: de 10 a 14. Los préstamos se siguen atendiendo en el
> mostrador de siempre.»
**datos:** traslado (sala de estudio al sótano) · entrada (puerta lateral, calle Mayor) · horario (10-14) · préstamos (en el mostrador de siempre)
**recado fiel:**
> «Durante as obras, a sala de estudo passa para a cave. Entra-se pela porta lateral da calle Mayor e o horário é reduzido, das 10h às 14h. Os empréstimos continuam a ser feitos no balcão do costume.»
**recado mostrado:**
> «Durante as obras, a sala de estudo passa para a cave. Entra-se pela porta lateral da calle Mayor e o horário é reduzido, das 10h às 14h.»
**transformación:** OMISIÓN de la frase de los préstamos
**opciones:** [0] Cambia o horário · [1] Acrescenta algo que o cartaz não diz · [2] **Falta o que acontece com os empréstimos** ✅ · [3] Não falha nada
**explicación:** O cartaz tem quatro informações e o recado só dá três. A dos empréstimos é a que evita uma viagem à cave para nada — e é a última do cartaz, que é onde a omissão passa mais despercebida.

### MFID-20 · sms-servicio · es→pt · **FIEL**
**fuente (ES):**
> «Su cita para renovar el DNI es el lunes 6 a las 9:40 en la comisaría
> de la calle Toledo. Traiga una foto reciente y el DNI antiguo. Si no
> puede, llame al 900 100 200.»
**datos:** día y hora (lunes 6, 9:40) · lugar (comisaría de la calle Toledo) · qué llevar (foto reciente y DNI antiguo) · teléfono para anular (900 100 200)
**recado fiel:**
> «A marcação para renovares o bilhete de identidade é na segunda-feira, dia 6, às 9h40, na esquadra da calle Toledo. Tens de levar uma fotografia recente e o documento antigo. Se não puderes, liga para o 900 100 200.»
**recado mostrado:** *(idéntico al fiel)*
**transformación:** ninguna
**opciones:** [0] **Não falha nada** ✅ · [1] Falta o telefone · [2] Muda a hora · [3] Acrescenta algo que o SMS não diz
**explicación:** Estão os quatro dados com os seus valores. Repara que «comisaría» se resolve como «esquadra» e o nome da rua se mantém em espanhol: traduzir o nome próprio de uma via seria, isso sim, alterar um dado.

### MFID-21 · nota-manuscrita · es→pt · **ALTERACIÓN**
**fuente (ES):**
> «Me llevo el coche, que tengo que ir a Setúbal. Vuelvo sobre las siete.
> Si llega el del gas, la llave de paso está debajo del fregadero. He
> dejado 20 euros en el cajón para pagarle.»
**datos:** adónde va (a Setúbal, en coche) · vuelve (sobre las siete) · llave de paso (debajo del fregadero) · dinero (20 euros en el cajón)
**recado fiel:**
> «Levou o carro porque tem de ir a Setúbal e volta por volta das sete. Se vier o homem do gás, a torneira de segurança está debaixo do lava-loiça, e deixou 20 euros na gaveta para lhe pagares.»
**recado mostrado:**
> «Levou o carro porque tem de ir a Setúbal e volta por volta das sete. Se vier o homem do gás, a torneira de segurança está debaixo do lava-loiça, e deixou 20 euros em cima da mesa para lhe pagares.»
**transformación:** ALTERACIÓN de «en el cajón» → «em cima da mesa»
**opciones:** [0] Falta para onde vai · [1] Muda a hora de regresso · [2] Não falha nada · [3] **Muda onde está o dinheiro** ✅
**explicación:** A nota diz «en el cajón» e o recado põe o dinheiro em cima da mesa. Parece um pormenor até ao momento em que alguém tem de pagar ao homem do gás e o dinheiro não está onde lhe disseram.

### MFID-22 · chat-grupo · es→pt · **INVENCIÓN**
**fuente (ES):**
> «Chicos, el domingo hacemos la ruta corta, la de 8 km, porque han dado
> lluvia por la tarde. Quedamos a las nueve en el aparcamiento del
> mirador. Llevad agua.»
**datos:** ruta (la corta, 8 km) · motivo (dan lluvia por la tarde) · hora y sitio (nueve, aparcamiento del mirador) · qué llevar (agua)
**recado fiel:**
> «No domingo fazemos o percurso curto, o de 8 km, porque deram chuva para a tarde. Encontramo-nos às nove no parque de estacionamento do miradouro. Levem água.»
**recado mostrado:**
> «No domingo fazemos o percurso curto, o de 8 km, porque deram chuva para a tarde. Encontramo-nos às nove no parque de estacionamento do miradouro. Levem água e calçado impermeável.»
**transformación:** INVENCIÓN de «e calçado impermeável»
**opciones:** [0] Falta o motivo da mudança · [1] Muda a distância do percurso · [2] **Acrescenta algo que a mensagem não diz** ✅ · [3] Não falha nada
**explicación:** A mensagem só pede água. O calçado impermeável é uma dedução razoável de quem leu «chuva» — e é precisamente por ser razoável que engana: continua a ser um dado que ninguém disse.

### MFID-23 · aviso-escolar · es→pt · **REASIGNACIÓN**
**fuente (ES):**
> «Los alumnos que no hayan entregado la ficha médica no podrán participar
> en la piscina del viernes. La secretaría la recoge hasta el miércoles a
> las 13:00.»
**datos:** quién queda fuera (los que no han entregado la ficha) · de qué (la piscina del viernes) · quién la recoge (secretaría) · plazo (miércoles a las 13:00)
**recado fiel:**
> «Os alunos que não tenham entregado a ficha médica não podem ir à piscina na sexta-feira. A secretaria recebe-a até quarta-feira às 13h.»
**recado mostrado:**
> «Os alunos que não tenham entregado a ficha médica não podem ir à piscina na sexta-feira. O professor recolhe-a até quarta-feira às 13h.»
**transformación:** REASIGNACIÓN de «la secretaría» → «o professor»
**opciones:** [0] **Muda quem recebe a ficha** ✅ · [1] Falta o prazo · [2] Muda o dia da piscina · [3] Não falha nada
**explicación:** O aviso diz que a ficha se entrega na secretaria. Trocar o destinatário por «o professor» é o tipo de erro que só se descobre na quinta-feira, quando já não há remédio.

### MFID-24 · app-notificacion · es→pt · **FIEL**
**fuente (ES):**
> «Aviso de la comunidad: el jueves 14 revisan los extintores de todo el
> edificio, de 10 a 13. No hace falta que haya nadie en casa, sólo en los
> trasteros. Quien tenga trastero cerrado con candado, que avise.»
**datos:** día y franja (jueves 14, de 10 a 13) · qué (revisión de extintores) · no hace falta estar en casa, sí en los trasteros · quien tenga candado, que avise
**recado fiel:**
> «Na quinta-feira, dia 14, das 10h às 13h, vêm rever os extintores do prédio todo. Não é preciso estar ninguém em casa, só nas arrecadações; quem tiver a arrecadação fechada com cadeado que avise.»
**recado mostrado:** *(idéntico al fiel)*
**transformación:** ninguna
**opciones:** [0] Falta a franja horária · [1] Acrescenta algo que o aviso não diz · [2] Muda quem tem de avisar · [3] **Não falha nada** ✅
**explicación:** Os quatro dados estão, incluída a distinção entre casa e arrecadação, que é a que se costuma perder. «Trastero» resolve-se como «arrecadação», que é o termo europeu.

---

## Reparto de la clave (control de atajo, se cuenta por script)

| posición | ítems | cuenta |
|---|---|---|
| [0] | 03, 06, 09, 16, 20, 23 | 6 |
| [1] | 01, 07, 10, 11*, 14, 18 | 6 |
| [2] | 02, 04, 17, 19, 22, 24* | 6 |
| [3] | 05, 08, 12*, 13, 15*, 21 | 6 |

*(las marcas con asterisco se verifican contra el JSON generado, no
contra esta tabla: la tabla es la intención, el script es la prueba.)*
