# Doctrina de auditoría — fuente única

*Este fichero es la fuente ÚNICA del método. Los seis agentes
`auditor-<lang>` lo leen entero; ninguno lo copia. Si estuviera copiado en
seis sitios fallaría en la copia N+1 que nadie sincronizó, que es la
trampa §A3 de esta misma lista.*

Cada clase de abajo **se pagó**: está medida, con fecha y con el método que
la cazó. No son buenas prácticas genéricas.

---

## A · El instrumento miente sin dar error

**A1 · El fallo que devuelve un número plausible.** Ni excepción ni cero:
el número de antes, o uno con la forma correcta. Dos simulaciones de
estrategia ciega devolvieron 3,9 % y 0,9 % **sin cazar ni uno de los tres
ejemplos que el propio punto declara**. *Defensa: correr todo medidor nuevo
contra los ejemplos escritos en el material; si no los caza, el número es
ruido con formato de dato.*

**A2 · El cero que sólo dice «no he mirado».** Un `try/catch` se tragaba un
`TypeError` y el bucle se saltaba todas las entradas. *Defensa: exigir un
mínimo de casos examinados antes de dar verde; ningún `catch` mudo.*

**A3 · ★ El cero que CONFIRMA se audita menos que el que REFUTA.** Una cifra
publicada decía 0 y eran 8. Sobrevivió porque **confirmaba** la regla:
nadie desconfía de un nulo que le da la razón. *Defensa: cuando una
medición confirme lo que ya creías, ésa es la que hay que volver a correr.*

**A4 · El instrumento falla en DE QUÉ ESTÁ HECHA LA LISTA, no al contar.**
Un par de control mal elegido movió un reparto más que el fenómeno (9,0 %
contra 9,8 %), y las dos cifras eran plausibles. *Defensa: auditar la
muestra antes que el contador.*

**A5 · La señal menor que el ruido del motor.** Todo salió indistinguible
**incluidas las calibraciones**; el instrumento veía bien y la señal
(0,046-0,095) era menor que el ruido entre dos generaciones (0,1138).
*Defensa: toda medida sobre salida generativa trae el ruido entre dos
generaciones de la misma entrada.*

**A6 · Antes de culpar a los datos, comprueba que tu extractor no fabrique
el defecto.** 167 «homóglifos» repartidos entre ocho autores, con la
explicación ya montada, eran un `JSON.stringify`. **La prisa por explicar
es la señal**: si tienes la historia antes que la comprobación, llegó
demasiado pronto.

**A7 · Un regex ASCII miente distinto en cada alfabeto.** `\b` y `\w` no son
unicode-aware ni con la bandera `u`: en rumano cuentan **de más** (se
rompen en la letra acentuada), en cirílico **no cuentan nunca** y devuelven
un cero limpio, y ahí lo único que dispara `\b` es la juntura
latín↔cirílico — o sea que usarlo **selecciona los tokens contaminados**.
*Usar `(?<!\p{L})…(?!\p{L})` con `u`.*

---

## B · El gate que no es un gate

**B1 · Un gate visto sólo en verde no está probado.** Tres gates nuevos
dieron 4, 26 y 21 hallazgos **falsos** antes de los buenos. *Correrlo
contra un caso que DEBE cazar, y meter ese caso en un test.*

**B2 · Y su control negativo, que es la mitad que falta.** Un gate que
rechaza todo también rechaza los venenos: su rojo es idéntico al de uno que
sirve. *Los casos BUENOS tienen que pasar limpios.*

**B3 · Un informe no es un gate.** Un invariante encontró tres omisiones
reales, se arreglaron, y **seguía saliendo con código 0**: su clase no
estaba en la condición de fallo. *Añadir un invariante y añadirlo a las
clases rojas son DOS cambios.*

**B4 · Iterar lo que hay nunca encuentra lo que falta.** Las casillas
vacías se filtran —y hace bien—, así que el recorrido no las visita.
*Enumerar el conjunto ESPERADO y preguntar por cada elemento.*

**B5 · Un gate ruidoso es un gate apagado.** Si marca ocho de cada nueve,
nadie lee su salida. Y la variante peor: **el gate que falla sólo en la
maniobra de escape** —el que se recorre con prisa, rodeando un problema—
se aprende a ignorar.

**B6 · Un gate que recomputa la regla del generador se da la razón a sí
mismo.** El segundo camino tiene que ser de **otra naturaleza**.

**B7 · Un techo puesto a ras de la medida se rompe solo.** Un umbral de
0,10 sobre un 9,97 % medido se puso rojo al crecer el dominio, sin que
nada estuviera mal — dos veces. *Cuando el criterio es «que esté
equilibrado», el umbral va **absoluto**, nunca contra una cifra medida.*
Y **un test fija la FORMA del hecho, no el número**: un porcentaje pasó por
cinco valores en una jornada sin que ninguna medición fuera mala.

**B8 · ★ Un control negativo anclado a «lo que aún no está hecho» caduca
cuando el trabajo se termina.** *Si un control se pone rojo al acabar una
tanda, la primera pregunta no es qué se rompió sino si se quedó sin
objeto.* Anclarlo a algo imposible por construcción.

**B9 · Un gate imposible de cumplir se acaba desactivando.** Exigía que dos
proporciones complementarias quedaran las dos por debajo del 50 %.

---

## C · El punto ciego que crece solo

**C1 · El enumerador del dominio encoge en silencio.** La máquina creció a
10 tablas y el enumerador seguía recibiendo 3: **1.429 formas de 2.194**.
Nada falla, nada discrepa, cada porcentaje es cierto *sobre lo que el
enumerador ve*. Peor que la regla duplicada, que al menos discrepa.

**C2 · ★ Un filtro que era CIERTO cuando se escribió caduca en silencio.**
`Mood !== 'Ind'` era correcto el día que la máquina sólo tenía indicativo;
meses después se saltaba la pasiva, los infinitivos y los participios. **Su
caducidad no produce ningún error: produce menos trabajo.** *El comentario
tiene que decir POR QUÉ se excluye, no qué: «sólo indicativo porque la
máquina no tiene subjuntivo» caduca de forma visible.*

**C3 · Al meter una pieza nueva, la pregunta no es qué invariantes EXISTEN
sino cuáles la MIRAN.** Tres veces ha desprotegido un gate en silencio; una
vez el congelador miraba **3 tablas de 14**, o sea el 43 % del material.

**C4 · Una copia y su original coinciden en el error.** Cruzar dos copias
mide la deriva entre copias, **nunca el acierto**.

**C5 · El verificador calla en verde sobre lo que su modelo no
representa.** Un error de caso pasó los dos caminos porque **ninguno tenía
el caso como dimensión**. *Cuando un `varia` nombre un rasgo, comprobar
primero que la máquina lo tiene como **dimensión**; si no, el gate sobre
ese rasgo no es débil: **no existe**.*

**C6 · ★ El dato sin consecuencia visible no puede validarse por
consecuencias.** `bestia`→`bēstia` sobrevivió meses porque **no mueve el
acento**, que es lo único que el sistema deriva de la cantidad. *Buscar los
campos INERTES: mutar cada campo y ver si algo se rompe.*

**C7 · ★ Consumo cosmético ≠ verificación.** Un campo puede aparecer en una
salida sin **decidir** ninguna: la glosa del verbo se colaba en la del
participio y el barrido la daba por vigilada. *No preguntes si algo lo usa:
pregunta si algún gate **FALLARÍA** al cambiarlo.*

---

## D · El ítem que no mide su punto

**D1 · Qué parte es GRATIS.** El alumno es hispanohablante **de México**
—sin `vosotros`— **con portugués C2**. Toda transferencia se comprueba
contra **las dos**; en rumano ese hueco duró 28 lotes. Y cada lengua
terminada entra en la lista para la siguiente.

**D2 · El riesgo invertido.** En una lengua lejana, **declarar inexistente
una dificultad que existe** hace tanto daño como cobrar un regalo.

**D3 · El suelo que pone la lengua.** Donde la L1 fusiona lo que la L2
distingue, la traducción regala media respuesta y **ningún diseño lo baja**
(medido seis veces; el peor, 80,6 %). *No se baja el techo: se mide qué
parte regala y se construye el contraste en lo que no regala.*

**D4 · La tasa ciega es del LOTE, no de la lengua.** Equilibrar para poder
medir borra la distribución real: 25 % en el lote contra 82 % en el texto.
*Publicar las dos, con etiqueta.*

**D5 · Ocho ítems que no varían son uno.** Si el rasgo diana es invariante,
la cobertura real es 1.

**D6 · Un lote de sólo un lado instala la regla contraria.** Con dos
salidas complementarias, **la mitad del lote tiene que ser del otro lado**.

**D7 · Los distractores tienen que ser ALCANZABLES.** Uno al que nadie
llegaría no es distractor: es relleno.

**D8 · El error simétrico.** Que **ninguna respuesta correcta alternativa
suspenda a un alumno impecable**. Incluye las marcas que el texto real no
escribe: mácrones, ё, acento ruso.

**D9 · Comparar dos CADENAS no es comparar dos hipótesis sobre el mismo
lema.** Cuatro salidas: evidencia / nulo vacío / **tarea de lectura** /
rojo. Un rival distinto de cero **es una tarea de lectura, no un número**.

**D10 · La normalización no falla: APRUEBA.** Cuando tapa el rasgo
examinado, el ítem **no puede fallar nunca**. Cuatro veces.

**D11 · Producir ≠ reconocer.** Una regularidad de paradigma sirve para
producir y puede tener un 5,5 % de precisión como pista de lectura, porque
al leer compite con todo lo que acaba igual.

**D12 · Un lote que sale limpio a la primera es sospechoso.** Las dos veces
que pasó, lo que faltaba era una comprobación.

---

## E · Lo que el material AFIRMA

**E1 · La prosa publicada no tiene gate.** De 241 `objectives` —que
`loaders.ts` sirve como primer párrafo de la lección—, **160 afirman algo
falsable**: 8 falsas y 18 medias verdades. Zod las valida sólo por forma.

**E2 · Una corrección no es verdad por ser una corrección.** Matar 7
falsedades metió **6 nuevas**, una grave. *La forma típica del error nuevo
es la **regla absoluta**: sospechar de todo «siempre» y «nunca» que
aparezca en un arreglo.*

**E3 · El motivo escrito puede ser falso**, y un dato falso en un campo
**que nadie lee** es una mina esperando a que alguien cambie la rama.

**E4 · Lo que se queda en prosa no se vuelve a mirar.** Tres veces en un
día una conclusión correcta vivía en un comentario donde ningún gate la ve.
*Toda lectura va a un CAMPO.*

**E5 · ★ La biblioteca puede DESENSEÑAR el punto.** El corpus de inmersión
es de dominio público, o sea viejo, y puede contradecir la norma moderna.
*La norma gana, pero: ningún ítem se justifica con el corpus, ojo al error
simétrico, y **la lección tiene que avisar**.*

**E6 · Una afirmación medida en un sentido no vale en el otro**, y **un
sello responde a UNA pregunta**: usarlo para otra fabrica trabajo ya hecho.

---

## F · Las fuentes

**F1 · El corpus es el segundo camino, con tres asimetrías**: la presencia
prueba, **la ausencia no prohíbe**, y el corpus tiene una fecha.

**F2 · Consulta y publica con el MISMO instrumento.** Tres atestaciones
resultaron homógrafos por mezclar la CLI y el gate.

**F3 · Verde por homografía.** Contar CADENAS cuando la pregunta es un
ANÁLISIS: `laudem` sale 15 veces y **las 15 son el sustantivo**. Y el sello
**premiaba** lo peor, porque elegía las formas más frecuentes.

**F4 · Un corpus que contiene aquello que quieres contrastar no es
independiente.** La documentación del proyecto cita latín, así que no vale
para decidir si una forma es española.

**F5 · Una declaración —de un experto, de un manual, de un campo de
metadatos— es una HIPÓTESIS sobre el sistema.** Un campo de la API decía
que ninguna voz soportaba un modelo; **20 caracteres** demostraron que sí.

**F6 · ★ Silencio no es contradicción, y una fuente que calla la mitad del
tiempo da huecos con formato de dato.** Lewis & Short marca **194 de 457**
vocales: no marca la cantidad, marca lo justo para colocar el acento.
*Test: cruzar en las DOS direcciones y comprobar que el silencio de la
fuente significa algo.*

**F7 · El corpus de referencia también se audita**, y sólo desde fuera: hay
un token «voice» —la palabra inglesa— con anotación latina correcta.

---

## G · Los números

**G1 · Ninguna cifra se escribe sin leerla de su contador en esa misma
sesión.** Es el fallo más repetido: cuatro veces en un día, en tres
agentes. **Si citas un reparto, que sume.**

**G2 · Un número que se equivoca POR DEBAJO no levanta sospecha.** Nadie
audita una cifra que le da menos mérito del que tiene.

**G3 · Manda el contador que lee el DATO FINAL**, no el que lee el código
fuente: un `grep` no ve lo que se construye en tiempo de ejecución.

**G4 · Con k valores en el eje el techo ciego es 1/k**, y el lote pide
**≥2k ítems**. A **n=8 la nula NO puede rechazar** —se plantó un atajo al
100 % y el test lo aprobó—: la defensa que no depende del tamaño es la
**estructura**.

**G5 · Predecir el número no protege si el instrumento está mal elegido.**
Se predijo 2 y se observó 1, y **las dos cifras eran del aparato roto**.
*Predecir también el **denominador**.*

**G6 · Diseñar para que el nulo informe.** Si «no detecto nada» sólo puede
significar «no miro», el experimento no puede fallar de forma útil.

**G7 · Un hallazgo que sobrevive al cambio de base es un hallazgo; uno que
se mueve con el denominador era un artefacto del recorte.**
