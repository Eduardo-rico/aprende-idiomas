# Informe adversarial — lote industrial 3, tramo A (MED-141 … MED-155)

Revisor: lingüista adversarial PT-EU / ES-peninsular.
Fuente: `docs/contenido/2026-08-30-lote-industrial-avisos-3.md` (líneas 106–472).
**No se ha tocado ningún fichero del repositorio.**

Recuento: **7 ERROR · 5 DUDA · 3 OK**. Ninguno para matar; los siete errores
se arreglan con edición acotada (todas las cadenas `de` verificadas como
subcadena EXACTA y ÚNICA del documento, y contenidas dentro de una sola
línea del fichero para que el script no tropiece con los prefijos `> `).

---

## 1. Qué hice con los priores mecánicos (verificados uno a uno)

| prior | veredicto tras verificar |
|---|---|
| MED-142 «até às 8h» → «antes de las 8» | **confirmado pero DUDA**, no ERROR: gold y rúbrica coinciden, así que la casilla se tica; el desplazamiento es de un instante y «antes de las ocho» es la forma idiomática castellana de un plazo de entrega. Doy corrección mejor («como muy tarde a las ocho»), que además es fiel. |
| MED-144 «até sábado à noite» | mismo caso, **secundario**; el ERROR de 144 es otro (ver abajo). |
| MED-151 «até 20 de setembro, inclusive» | **falso positivo**: el gold lo resuelve ejemplarmente («como muy tarde el 20 de septiembre — ese día todavía vale»). |
| MED-153 «até às 18h» → «hasta las seis» | **falso positivo**: aquí el plazo es durativo («pode passar… até às 18h»), y «hasta las seis» lo conserva íntegro. |
| Condicionales 141/144/148 | **falsos positivos como condicionales de la fuente**: son «si» inventados por el gold (ofertas personales). En 141 y 148 los dejo como DUDA por ampliación, no por condición. |
| Condicional 142 «Caso não possa» → «Si no entran» | **falso positivo**: el gold resuelve la condición con el dato que da `audience` («trabaja fuera») y conserva las dos ramas de la decisión (llave o diciembre), que es lo que pedía `instructionsEs`. |
| Condicional 152 «Si no puede» | **falso positivo**: «Se a essa hora não puderes mesmo» es fiel. |
| Anclas ausentes 148 «octubre», 152 «jueves», 153 «95» | **falsos positivos del barrido**: están, pero en el otro idioma («outubro», «quinta») o en letra («noventa y cinco»). |
| Anclas 143 «4471», 150 «2026/8812», 154 «77» | **señuelos**: la casilla pide que NO estén y no están. Correcto. |
| Ancla 154 «77» | ídem, pero 154 tiene otro fallo real (ver abajo). |
| «chaveiro» = cerrajero en MED-154 | **verificado y absuelto**: Priberam marca esa acepción como [Brasil], pero el uso está vivo en el ramo portugués (chaveiro24h.pt, chavesconfianca.pt, segredodaschaves.pt, mundodasfechaduras.pt, todos de Lisboa). No lo marco. «Serralheiro» sería más conservador, nada más. |

Comprobaciones léxicas hechas contra Priberam, no de memoria: `monos`
(acepción 6, «objecto doméstico… pesado ou de grandes dimensões»,
etiquetada **[Portugal]** → MED-144 correcto), `azeite` (acepción 1 =
aceite de oliva; la 2, genérica, es residual/técnica), `intervencionar`
(no restringido a medicina → MED-143 correcto), `chaveiro`.

---

## 2. ERRORES (7)

### MED-143 — la instrucción apunta al revés y falta el ancla de la casilla 2
La fuente manda retirar bolsas y comida de animales **das garagens**
(zona afectada = *caves*, sótanos). El gold dice «Hay que sacar **de ahí**
… así que **baja** el pienso del gato».

Dos fallos encadenados:
1. **`baja`** manda el pienso *hacia* la zona que hay que despejar. Si el
   trastero está en la cave (que es donde están en Portugal), lo que toca
   es **subirlo**. Leído como «baja [a por] el pienso» tampoco funciona:
   en español eso exige «baja a por el pienso». Instrucción operativa
   equivocada o, en el mejor de los casos, ambigua — y `instructionsEs`
   dice justamente «lo que importa es qué tiene que quitar».
2. La casilla 2 nombra **«de los garajes»** y el gold lo sustituye por un
   anafórico («de ahí») cuyo antecedente es más amplio (sótanos y zonas
   comunes). La casilla no se tica limpiamente.

Corrección (dos ediciones, 45 palabras finales, rango 30–65 ✓).

### MED-144 — la casilla 3 no se puede ticar con el gold
Casilla 3: «¿Conserva la hora y la instrucción original (desde las 8,
**junto al contenedor, sin bloquear el paso**)?». El gold conserva la
hora («desde las ocho») y **omite las otras dos**: «junto al contenedor»
no aparece, y «sin obstruir la passagem» sólo asoma como consecuencia
(«se queda ahí un día entero bloqueando»), no como instrucción. Es
exactamente la clase del MED-175 ya confirmado: la casilla nombra algo
que el gold no dice. Y aquí importa de verdad, porque el compañero tiene
que volver a bajar el sofá el domingo y no se le dice dónde ponerlo.

Corrección: sustituir la coletilla causal por la instrucción (60
palabras finales, rango 30–65 ✓).

Nota secundaria (no bloqueante): «até sábado à noite» → «antes del sábado
por la noche» adelanta el plazo. Lo fiel y natural sería «como muy tarde
el sábado por la noche», y exigiría tocar también la casilla 2.

### MED-145 — ampliación no marcada: «llamando al timbre»
El cartel dice «Atendimento noturno das 22h às 9h **pelo postigo**». No
dice nada de timbre. El gold añade «atienden por la ventanilla, **llamando
al timbre**» — información inventada, y encima operativa (la madre puede
buscar un timbre que no existe; en Portugal el postigo se golpea o tiene
campainha, pero eso el cartel no lo afirma). El resto del ítem es bueno:
«postigo» → «ventanilla» resuelve bien el falso amigo (ES *postigo* =
contraventana).

Corrección: borrar «, llamando al timbre» (36 palabras, rango 25–55 ✓).

### MED-148 — falso amigo canónico ES→PT: «aceite» ≠ «azeite»
El cartel español pide «**aceite**» (genérico: girasol u oliva) y el gold
portugués escribe «**azeite**», que en portugués es aceite de OLIVA. La
acepción genérica de `azeite` que recoge Priberam («óleo extraído de
outros frutos ou de certos animais») es residual: en un banco alimentar
portugués la rúbrica es «óleo alimentar», y `azeite` se lista aparte.
Un lector portugués con este gold compra aceite de oliva.

Es el falso amigo que este mismo material existe para enseñar, y llama
la atención que el autor **sí** esquivó el otro («legumbres» →
«leguminosas», no «legumes»). Se arregla con una palabra.

Corrección: «é azeite, leguminosas e leite» → «é óleo alimentar,
leguminosas e leite» (40 palabras, rango 25–60 ✓).

### MED-151 — la casilla 1 pide un dato que el gold no da
Casilla 1: «¿Traslada la renovación automática (el 1 de octubre, **con la
cuota vigente**)?». El gold dice «si no dices nada, el 1 de octubre te
renueva solo» y **no menciona la cuota**. La fuente sí lo dice («com a
mensalidade em vigor») y al primo le importa: es a qué precio le renuevan.
Media casilla no ticable. (El resto del ítem es el mejor del tramo: la
inclusividad del 20 de septiembre está resuelta de forma ejemplar.)

Corrección: «…te renueva solo, con la cuota que esté en vigor.» (51
palabras, rango 30–65 ✓).

### MED-154 — «en el momento» promete más que «no próprio dia»
Casilla 3: «¿Traslada que la llave nueva **queda hecha el mismo día**?».
El gold dice «La llave nueva la hacen **en el momento**». No es lo mismo:
*no próprio dia* = ese mismo día (puede llevársela al taller y volver por
la tarde); *en el momento* = ahí mismo, delante de ti. Para alguien que
teletrabaja y calcula cuántas veces tiene que abrir la puerta, la
diferencia es operativa. Y la casilla, tal como está redactada, no se
tica: «el mismo día» no aparece.

Corrección: «La llave nueva la hacen el mismo día.» (50 palabras ✓).

### MED-155 — confirmado: la imposibilidad externa se vuelve preferencia
Ya diagnosticado por el muestreo. La fuente: «**Se não der**, faço só a
tomada da cozinha» — si no *se puede* (porque el condominio no autoriza o
no cuadra la franja). El gold: «**Si usted prefiere no complicarlo**,
deja hecho sólo el enchufe de la cocina» — convierte una imposibilidad
externa en un capricho de la casera, y cambia quién decide. La casilla 3
(«si no se puede») no se tica.

**Aviso sobre el arreglo**: si sólo se sustituye esa cláusula, el gold se
queda **sin una sola marca de usted** (todo lo demás es 3.ª persona
impersonal sobre el electricista) y entonces revienta la casilla 4
(«¿Español natural **y de usted**…?»). Por eso doy dos ediciones: la del
plan B y «así que **tendría usted que** hablar con el administrador», que
además reparte bien la agencia (la fuente dice «Falem com o
administrador»: le toca a ella). 56 palabras finales, rango 35–70 ✓.

---

## 3. DUDAS (5) — no las bloqueo, pero las dejo apuntadas

### MED-141 — ampliación inventada sobre la interlocutora
«yo me encargo si quieres, **que tú entras a trabajar pronto**». El
`audience` sólo dice «tu compañera de piso española»: el horario laboral
es invención del gold. Compárese con MED-143, donde el dato personal
(«guarda el pienso en el trastero») sí viene de `audience` y por eso el
uso es legítimo. Como *modelAnswer* enseña a inventarse al destinatario.

Dos afinados menores del mismo ítem: `garrafões` son garrafas de 5 l, no
«botellas» (y la propia casilla 3 dice «garrafas»); y `na véspera` es
*el día antes*, no necesariamente *la noche antes*.

### MED-142 — «até às 8h» → «antes de las 8»
Gold y rúbrica coinciden, así que la evaluación no se rompe, pero ambos
adelantan el plazo un instante respecto de la fuente. Existe una opción
que es a la vez fiel y castellana: **«como muy tarde a las ocho de la
mañana»** (nótese que «deja la llave hasta las ocho» sí sería calco: ese
es el motivo por el que el autor huyó a «antes de»). Corrección propuesta
para gold **y** casilla 2, para que sigan alineados.

### MED-149 — «el Tomás» y la cartilla a medias
1. «cita del pediatra para **el Tomás**»: artículo + nombre de pila es
   obligatorio en portugués (*o Tomás*) y **marcado** en español
   peninsular estándar — dialectal (Cataluña, Aragón, zonas rurales) y a
   menudo despectivo. En un gold cuya casilla 4 dice «sin lusismos», el
   calco es incómodo. Está también en el campo `audience`, así que es
   decisión deliberada del autor: si se corrige, hay que corregir los dos.
2. La casilla 2 pide «la cartilla de salud **infantil**» y el gold dice
   sólo «la cartilla de salud». Se entiende por contexto, pero el ancla
   completa es gratis.

### MED-150 — la alternativa libre se vuelve subsidiaria
Fuente: «com o comprovativo **ou** o documento de identificação» — las dos
valen, a elección. Gold: «el resguardo o, **si lo has perdido**, el DNI»,
que degrada el DNI a plan B. La casilla 2 se tica igual (aparecen las dos
opciones), por eso no es ERROR, pero es un cambio de la lógica de la
fuente — la misma familia que el fallo confirmado de MED-155, en versión
menor. Añadido inocuo aparte: «así que guarda el papel que te den».

### MED-152 — «a reunião na gestora»
`gestoría` no tiene equivalente directo: en portugués «gestora» es una
gestora de fondos o una directiva, y «na gestora» sin antecedente
desorienta. Lo natural en Portugal es «na contabilidade» / «no
contabilista», o conservar el nombre propio del SMS. Todo lo demás del
ítem es EP impecable (véase abajo).

---

## 4. OK (3)

- **MED-146** — las tres casillas se tican con el gold, 44 palabras,
  español natural («se ha escapado», perfecto peninsular). La fuente es
  EP de manual: futuro de subjuntivo bien usado («Quem a **vir**,
  telefone»), `coleira`, `chapa`, `atende por`.
- **MED-147** — la primera frase mata el plan, como pide la casilla 1, y
  las tres pegas están. `Não são **aceites**` en la fuente es marcador EP
  fuerte (BR diría *aceitos*); «ecocentro» → «punto limpio» y «guia de
  transporte» → «albarán de transporte» son las equivalencias correctas
  para España.
- **MED-153** — el ítem mejor resuelto del tramo en el eje plazo/importe:
  «até às 18h» → «hasta las seis» (durativo, íntegro), «95» en letra,
  `multibanco` → «tarjeta», `fatura antiga` → «factura vieja» con su
  opcionalidad. Tuteo consistente con el padre. La fuente trae
  **`mudámos`** con acento: marcador EP de primera (BR escribe *mudamos*).

### Tabla de cierre

| id | veredicto |
|---|---|
| MED-141 | DUDA |
| MED-142 | DUDA |
| MED-143 | ERROR |
| MED-144 | ERROR |
| MED-145 | ERROR |
| MED-146 | OK |
| MED-147 | OK |
| MED-148 | ERROR |
| MED-149 | DUDA |
| MED-150 | DUDA |
| MED-151 | ERROR |
| MED-152 | DUDA |
| MED-153 | OK |
| MED-154 | ERROR |
| MED-155 | ERROR |

**7 ERROR · 5 DUDA · 3 OK** (15/15).

---

## 5. Qué está bien, en concreto

No es un lote flojo de portugués. Los `sourceText` son EP de verdad y
resisten el ataque: `monos` (verificado [Portugal] en Priberam),
`frações`, `caves`, `contentor`, `portaria`, `telemóvel`, `comprovativo`,
`levantamento`, `multibanco`, `boletim de saúde infantil`, `gabinete`,
`ginásio`, `ecocentro`, `postigo`, `serviço permanente`. Ortografía del
AO1990 consistente (`retificação`, `eletricista`, `noturno`, `fatura`).
Morfosintaxis europea sin un solo desliz brasileño en las quince fuentes:
enclisis correcta (`Recomenda-se`, `Pede-se`, `digam-me`, `recolhê-la`),
futuro de subjuntivo vivo (`Quem a vir`, `se ninguém puder`, `se a
tiver`, `se não puderes`), participio `aceites`, pretérito `mudámos`,
`tens de levar`, cero gerundio progresivo, cero `você`, cero `a gente`.

En español, los golds resuelven bien los falsos amigos difíciles
(`postigo` → ventanilla, `monos` → muebles, `guia` → albarán, `gabinete`
→ consulta, `ecocentro` → punto limpio, `multibanco` → tarjeta) y el
registro tú/usted no se rompe en ningún ítem. Los cinco señuelos
funcionan: ningún gold cuela el número interno.

El patrón de fallo no es lingüístico: **es de trasvase de datos entre la
fuente, la casilla y el gold.** Cinco de los siete errores son la misma
avería — la casilla nombra un dato (los garajes, el contenedor y el paso,
la cuota vigente, «el mismo día», «si no se puede») y el gold no lo dice
o dice otra cosa. Los otros dos son ampliación inventada (timbre) y falso
amigo (azeite). Ninguno exige rehacer el ítem.
</content>
