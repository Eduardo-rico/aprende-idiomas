---
name: lote-b2c2
description: Producir un lote del catálogo B2-C2 de portugués (juicios de gramaticalidad + mediaciones + lecciones b11+) con el ciclo completo borrador → doble adversarial → convergencia → gates → publicar. Usar para cada lote nuevo, para lecciones del bloque Anti-calco, y como molde de sus reglas — cada una viene de un error ya pagado en el piloto o los lotes 1-3.
---

# Lote B2C2 — el ciclo que se autocorrige

Destilado de 6 ciclos ejecutados (piloto + lotes 1-5, 2026-07-29 a
08-11, **138 ítems publicados**). Cada regla tiene historial: no es
teoría, es cicatriz. El lote 5 necesitó TRES rondas de doble revisión y
aportó la mitad de las reglas de aquí abajo — fue el primero producido
enteramente contra esta skill, así que sus errores son errores DE la
skill.

## El tamaño del lote es 24 — medido, no supuesto

**Regla (Edu, E2#8): el lote industrial es de 24. Si hace falta más
volumen son DOS lotes de 24 en pasadas separadas, nunca uno de 44.**

Las tres tandas industriales, con su tasa de error medida por revisión
completa a mano (no por muestreo):

| lote | tamaño | muestreo | freno | error real |
|---|---:|---|---|---:|
| industrial 1 | 24 | 1/3 | SÍ | **4/24 = 17 %** |
| industrial 2 | 24 | 0/3 | no | *sin medir* |
| industrial 3 | **44** | 2/5 | SÍ | **20/44 = 45 %** |

Casi triplicar el error borra la ventaja: el lote grande costó una
revisión a mano de 44 más una ronda de verificación, que es más trabajo
humano que dos lotes de 24. Y la clase dominante **no fue de lengua**:
12 de los 20 errores fueron **trasvase roto rúbrica↔gold** — la casilla
nombra un dato que la respuesta modelo no dice, o exige uno que la
fuente no da. Ése es el mecanismo, y explica por qué el tamaño importa:
la rúbrica y su modelo se escriben en paralelo y **se separan cuando se
escriben 44 de un tirón**. No es fatiga del autor, es que el lote grande
no cabe en una sola cabeza a la vez.

Lo que NO fue la causa, también medido: los modificadores nuevos del
lote 3 (`contradictorio`, `parcial`) pasaron limpios el muestreo y la
revisión, y lo ya publicado aguanta (0 de 15 mediaciones industriales en
producción traducen mal «até»). El 45 % fue del lote, no de la línea.

## El ciclo

1. **Borrador** en `docs/contenido/AAAA-MM-DD-loteN-….md`, marcado
   `NO PUBLICADO`. TODO redactado: consignas, rúbricas Y modelos — nada
   «se redacta en build» (deuda del lote 3: dos modelos salieron sin
   tercer round). Con notas del autor: las dudas se confiesan, los
   revisores las responden mejor que tú.
2. **PREFLIGHT EJECUTABLE — sin su salida no se abre el round.**

   ```
   npx tsx scripts/preflight-lote.ts docs/contenido/<doc>.md
   ```

   Corre los gates, mide la batería de atajos EN CÓDIGO y sale con
   código 1 si algo bloquea. **Su salida se pega en el documento del
   lote.** Existe porque el fallo del lote 10 (E2#11) no fue de juicio
   sino de proceso: se repitió una cicatriz que ya estaba escrita —
   presentar un **recall sobre los MAL** como si fuera **acierto sobre
   N**—, se calcularon a mano tres cifras anti-atajo y las tres salieron
   mal, y **no se corrió el gate de virginidad**, que ya era obligatorio.
   Un procedimiento que depende de recordar falla.

   Corrido a posteriori sobre aquel lote, lo habría **bloqueado con seis
   razones**, entre ellas las tres que un revisor encontró a mano: el
   atajo de la **LONGITUD** (12/16, p=0,038 — las frases más cortas eran
   las MAL), y dos choques de virginidad a 0,598 y 0,579, uno de ellos
   el ítem que era el *repair* textual de uno ya publicado.

   La batería no es una lista de atajos conocidos: es un marco que mide,
   para cada rasgo binario, cuánto acierta la regla «predice MAL si el
   rasgo está» y su contraria, y marca lo que supere el azar por
   binomial. **Un rasgo cualquiera que prediga la etiqueta es un atajo,
   se le hubiera ocurrido a alguien o no.** Añadir un rasgo a
   `scripts/lib/atajos.ts` lo mete en la batería para siempre.

3. **Los dos gates de máquina, antes de gastar un revisor:**
   - `npx tsx scripts/check-bleed-docs.ts <doc>` (escrituras ajenas).
   - `npx tsx scripts/check-virginidad.ts --nuevos <candidatos.json>`
     — **el barrido de virginidad ya no se hace a ojo**. Compara cada
     par (sentence, repair) contra los 2.151 ejercicios del corpus por
     solape ponderado por IDF. Existe porque durante cuatro lotes la
     regla se cumplió sólo sobre los ids `b2c2-`, y eso metió duplicados
     EN PRODUCCIÓN: `gj-01` (el primero del piloto) puntúa 1,0 contra
     `b5/823a95c9`; `gj-l3-01` repite un target de b6; `gj-l4-12`
     repite `b7/cc7715be`. Umbral útil 0,5; por debajo entra ruido de
     vocabulario común. Lo que marca no se retira automáticamente: se
     mira. Coincidir en «pão» es ruido; coincidir en el PUNTO es muerte.
     **Audita al umbral DEL CÓDIGO, y mira todos los pares.** El lote 5
     declaró «los pares a 0,5 son ruido» mientras el gate corría a 0,34,
     y los tres que importaban vivían en 0,39-0,49. Un umbral elegido a
     ojo DESPUÉS de ver los resultados es un descarte silencioso con
     otro nombre.
   - **Declara `concepts` en cada ítem nuevo.** Es el segundo eje del
     gate: compara el PUNTO, no las palabras. Sin él, «Vou a telefonar
     ao médico» pasa a 0,237 contra el publicado «Vou a falar com ela»,
     que es el mismo ejercicio. Reenseñar un concepto de un bloque
     anterior no es delito —refinar en C1 un punto de B1 es legítimo—
     pero tiene que salir declarado en el doc, no por descuido.
   - **Un gate nuevo se prueba TAMBIÉN dentro del conjunto candidato.**
     El eje de molde nació en E2#7 comparando candidatos contra el
     corpus publicado, y por eso fue ciego a dos mediaciones del MISMO
     lote que compartían fuente (MED-132 ↔ MED-135) — la misma regla
     con la que ese lote había obligado a otra a cambiar de fuente. Lo
     cazó un revisor a mano. Un lote se compara consigo mismo.
   - **Un barrido mecánico ENUMERA y TRIAJA todas las ocurrencias.**
     El de «-ámos» (E2#7) filtró por «contexto de pasado», y como la
     mayoría de ítems no lleva marcador temporal explícito, cazó 3 de
     los 10 casos reales: el revisor humano encontró los otros 7. Un
     filtro por un rasgo que la mayoría de la población no tiene no es
     un barrido, es una muestra disfrazada de barrido. Enumera el
     universo (las 433 formas), triaja con criterios declarados, y
     declara cuántas revisaste y cuántas cayeron.
   - **El gate NO protege a las MEDIACIONES.** Medido en el lote 9 por
     los dos revisores por separado: **0 pares para las doce MED** al
     umbral del código. No es que estuvieran limpias — dos eran clones
     (una ⊂ otra por fuente y frase; otra calcaba la rúbrica de un
     publicado casilla a casilla) — es que el solape IDF se diluye en
     textos largos y nunca llega a 0,34. Para las MED, el cotejo A MANO
     contra los publicados de su clase es el ÚNICO gate que existe:
     misma fuente, mismos párrafos, misma rúbrica, misma bisagra.
   - **El gate NO ve clones estructurales — los caza el round (o un
     gate de molde).** En E2#4 el MED-53 del borrador era el publicado
     med-38 con los nombres cambiados: mismo género, misma dirección,
     mismos tipos de dato y la rúbrica calcada casilla a casilla hasta
     el rango — y el gate dio CERO pares (palabras distintas = ningún
     solape IDF; concepts solo dijo «familia b10-registro»). Ninguno de
     los dos ejes compara la ESTRUCTURA. Antes de gastar revisor,
     coteja cada ítem nuevo A MANO contra los publicados de su misma
     clase (género × dirección × tipos de dato); para clases seriadas
     (avisos de la línea B), corre además los gates de molde del
     contrato v1.1 (arranques únicos, n-grama ≥6 de sourceText contra
     publicados). Y el registro de dominios por ETIQUETA no basta:
     «reunión» ≠ «visita de cliente» camufló el clon.
4. **DOS `linguista-adversarial-pt` EN PARALELO, sin verse** (si los
   agentes del repo no están registrados en la sesión: general-purpose
   con «lee y adopta .claude/agents/linguista-adversarial-pt.md»).
   Prompts distintos: al #1 dale el ángulo lingüístico (verdicts,
   Priberam, corpus de la propia biblioteca), al #2 el pedagógico
   (diseño del lote, patrones explotables, fugas, nivel real).
   Pídeles cotejar fuentes contra los JSON y responder tus notas.
5. **REGLA DE CORTE (decisión de Edu, E2#8): un ítem que no pasa el
   round en TRES rondas se mata o se degrada a un lote futuro con su
   diagnóstico escrito. El lote no se retiene por él, y no hay ronda
   5.** El lote 9 consumió tres sesiones enteras por tres ítems; a
   partir de ahí deja de ser rigor y es un bucle. Publicar el lote sin
   ellos es la decisión correcta: lo que muere queda documentado y
   puede renacer verificado en otro lote.
6. **Convergencia**: lo convergente se aplica; lo de un solo revisor se
   aplica SOLO si es verificable de plano (una próclise sin clítico, un
   fichero que no existe) — si no, queda anotado para el siguiente
   lote. Conflicto directo entre revisores → gana el refuerzo
   estrictamente superior si existe; si no, queda el original, anotado.
7. **Publicar por script** (scratchpad .mts): construye los ítems,
   `contentHash` de `scripts/lib/staged-validate`, sello
   `variantVerificacion` con fecha y doc, y VALIDA ANTES de escribir
   (el lote 3 escribió y validó después: un modelo salió 61/60).
8. **Gates**: barrido de `revisarEjercicio` + `revisarRegistro` sobre
   los ítems nuevos (hallazgos didácticos esperados se declaran),
   `npm run verify:content` (los 4 errores de audio en translations son
   preexistentes), suite completa, y recuentos de modelo por script.
9. **Doc a estado PUBLICADO** con la tabla de resultado (qué se retiró,
   qué convergió, qué quedó en conflicto) — el borrador se conserva
   debajo como historia. Commit por hito, push.

## Un gate que deriva la respuesta NO comprueba que la pregunta la determine

**Cicatriz de E2#11, y la más cara de la sesión.** La familia industrial
de PARADIGMA calcula la forma correcta con un conjugador y el gate la
recalcula y compara: derivación por construcción llevada al extremo, sin
juicio del autor. El gate salió limpio en los 24 ítems.

Y el round encontró **8 errores de 24**, casi todos de la misma clase que
el gate **no puede ver por diseño**: en cinco de los seis `fill_blank`
**nada en la frase fijaba la persona**. «Antes do almoço já ___ o
relatório» admite las cinco —terei, terás, terá, teremos, terão— y el
campo llevaba `alternatives: []`, así que sólo una puntuaba. El ítem era
inresoluble y el gate lo bendecía, porque la forma declarada SÍ salía del
paradigma.

**La regla: verificar que la respuesta es derivable es la mitad. La otra
mitad es que el CONTEXTO la determine — sujeto explícito, antecedente
para el clítico, ancla temporal.** Un hueco cuya respuesta depende de un
dato que la frase no da no es un ejercicio difícil: es uno roto.

Las otras tres de la misma sesión, todas invisibles al gate: un clítico
`-o` cuyo único antecedente masculino de la frase era el sujeto
equivocado; un sujeto «nós» con clítico «me» («nosotros me traeríamos»);
y dos distractores que resultaron ser portugués correcto porque la frase
no expresaba sujeto. Ninguna es de forma; todas son de contexto.

## La barra de retirada (jurisprudencia)

Un juicio binario se RETIRA si el verdict no es inequívoco. Han caído:
- «medo aos cães» — `medo a` atestada en regência europea (lote 1)
- «regalo» — diccionarizado como 'presente' Y vivo en el Eça de la
  propia Biblioteca (lote 2; el revisor lo probó con grep al corpus)
- «gana», «listo» — Priberam los registra con el sentido del estímulo
  (lote 3; «listo» es regionalismo de Trás-os-Montes y basta)
- «pelo comprido» de «ela» — la lectura gata era legítima: ancla el
  referente («a minha irmã»); «esquisita» sola — ancla la intención
  («Parabéns à cozinheira»)

- «prefiro o comboio **do que** o autocarro» — Ciberdúvidas es
  categórico contra ello y aun así cae: Eça lo usa en `os-maias-c01`
  («preferia saber que elle recolhera… --do que vel-o»). Norma explícita
  ≠ verdict inequívoco cuando la propia Biblioteca del curso lo
  desmiente (lote 5)

**Para un par DISPUTADO, sólo la dirección BIEN admite verdict
inequívoco.** Un BIEN afirma que la frase está bien formada; un MAL
tiene que afirmar que la otra está mal, y ahí la autoridad falla.
«Entre tu e eu» murió como MAL —Ciberdúvidas describe `entre` como la
única preposición que admite nominativos— y renace como BIEN («A
diferença entre mim e ti é essa»), enseñando el mismo contraste sin
verdict disputado. Es por eso que sobreviven «mais pequena» y «morada»,
que también son preferencias y no reglas. Cuando un par tenga artículo
propio en Ciberdúvidas con los dos miembros en el título, dale la vuelta
en vez de retirarlo.

**Y el corolario que E2#13 pagó tres veces seguidas: NO se inventa un MAL
bajo presión.** Al reponer los dos ítems que la ronda 2 del lote 10 había
tumbado, las TRES reposiciones murieron antes del round — dos las cazó el
gate de virginidad por estar **ya publicadas casi literales** (0,674
contra `b2c2-gj-l5-10`, que ya trae «Ontem tenho falado com o teu pai»; y
0,515 contra `b2c2-gj-l4-17`, que ya trae «Ontem assistimos o jogo todo»),
y la tercera la desmintió el corpus (`apaixonar-se de` por `por`: Camilo
escribe «apaixonado **de** Thereza»). Un cuarto candidato, `esquecer-se
DE`, también cayó al grep ancho: Eça trae «esquecia-me **o cognac**».
El lote salió con 14 en vez de 16 y un punto se quedó a **uno** del piso.
Publicar corto y declarado es correcto; inventar un quinto MAL con el
contexto agotado es cómo se fabricaron los siete que ya murieron.

Regla: atestación de USO o de DICCIONARIO con el sentido condenado =
fuera. Frecuencia no es gramaticalidad. Distinción fina del lote 2:
«vacações» sobrevivió porque es entrada fósil SIN uso vivo — atestación
de uso ≠ entrada de diccionario, pero la explicación debe decir la
verdad («fósil jurídico», no «no existe»).

**Y la regla que hace útiles a las anteriores: el grep que absuelve
tiene que ser ancho.** En el lote 5 di por virgen «preferir do que»
porque busqué `prefiro … do que` — 1.ª persona, presente. El uso
atestado estaba en `preferia`. Un grep estrecho no absuelve a nadie:
busca el LEMA (todas las personas y tiempos), no la forma que
escribiste. **Y con GRAFÍA ANTIGUA**: la Biblioteca escribe
ortografía del XIX y ya escondió hits tres veces — «melhor escripto»
(Garrett) mató un verdict del lote 7 que el grep moderno daba por
limpio, y «emquanto» escondió en el lote 8 las atestaciones de las DOS
direcciones de un ítem («emquanto não souber», «n'um instante»).
Variantes a probar siempre: -pt-→-ppt-/-pct- (escripto/aceite),
em-/en- (emquanto), ph (phosphoro), c' y n'/d' con apóstrofo, -mm-,
th, y (systema).

## LOS JUICIOS SE ESCRIBEN POR PARES MÍNIMOS (E2#13)

**Regla: un lote de juicios nuevo se construye con
`scripts/lib/pares-minimos.ts`.** El BIEN y el MAL salen del MISMO
esqueleto y difieren SÓLO en el tramo que se juzga: misma longitud,
mismo arranque, mismo léxico, misma coleta.

El bucle que esto rompe, medido tres sesiones seguidas: **cada atajo que
se arreglaba fabricaba otro del mismo calibre.** Se mató la LONGITUD
(13/16) alargando los MAL «con su propia coleta» — y como se alargaron
por DELANTE nació el ARRANQUE (12/16, p=0,038). Y esa misma coleta CEGÓ
el gate de virginidad, porque envolver una frase publicada en una
subordinada diluye el solape IDF: **el arreglo de la v1 desactivó el
gate que había cazado el fallo de la v1.**

Eso no se gana midiendo, se gana por construcción. Con pares, todo rasgo
que no mire el hueco vale igual en los dos miembros: aporta un acierto y
un fallo, o sea 50 % exacto, **sea el rasgo que sea** — incluido el que
todavía no se le ha ocurrido a nadie. Medido en el lote 12: los once
rasgos de texto dan **6/12 clavado**, incluido «lleva clítico con guion»,
que está presente en 6 ítems y no predice nada.

**Y el límite que el primer lote por pares pagó a la primera: los pares
garantizan que el BIEN y el MAL sólo difieran en el rasgo juzgado; NO
garantizan que el ESQUELETO sea gramatical.** Tres de los seis pares del
lote 12 salieron rotos en sus DOS direcciones — el hueco llevaba un
clítico acusativo y el esqueleto ya traía el objeto directo, así que el
BIEN decía «A direção comunicá-lo-á **o resultado**», con el objeto
duplicado. Ni `verificarPar()` ni el preflight lo vieron: lo cazó leer la
salida del publicador ítem a ítem, que es la regla del **diff semántico
antes de commitear**. Con un esqueleto compartido, un solo descuido se
multiplica por dos y se ve la mitad de bien, porque los dos ítems
comparten el defecto y ninguno hace de control del otro. Antes de dar un
lote de pares por bueno: lee las N frases ENSAMBLADAS, no los pares.

Lo que los pares NO resuelven, y por eso sigue habiendo round: que el
veredicto sea inequívoco, que el contexto determine la respuesta, y que
el rasgo juzgado no sea detectable por una regla superficial distinta de
la destreza. **Cada par declara en `rasgo` qué se juzga**: un rasgo que
detecte ESO es la destreza; cualquier otro es un atajo.

Reglas del generador, todas comprobadas por `verificarPar`: un solo
hueco, arranque idéntico, ≤1 palabra y ≤8 caracteres de diferencia entre
los rellenos, y el resto del texto literalmente igual. La posición
BIEN/MAL va **barajada con semilla** (reproducible: un barajado que no se
puede repetir no se puede auditar) y los dos miembros de un par nunca a
menos de tres posiciones. Y el equilibrio que el par no da solo: si en
todos los pares el rasgo cae del mismo lado —p. ej. la mesóclise siempre
en el BIEN—, ese rasgo vuelve a discriminar; hay que repartirlo mitad y
mitad.

El preflight exime a los dos miembros de un par DECLARADO de compararse
entre sí en el gate de virginidad. Sólo entre ellos: cada uno se compara
igual contra todo el corpus publicado.

## El molde de los juicios

- **Ratio ~10/10 con la última MAL en posición 19-20** (mata el conteo),
  runs ≤3, sin alternancia mecánica. El lote 2 calcó 17/20 posiciones
  del 1 y el 3 calcó el arranque; ambos se rehicieron.
- **El criterio del arranque ya no es una lista, es una medida** —
  `evaluarMolde()` en `scripts/lib/pares-minimos.ts`, y lo corre el
  preflight. Un patrón vale si está equilibrado (≤2), sin rachas >3, no
  es idéntico a ninguno publicado, y **su solape con CADA lote publicado
  está cerca del azar**: |solape − L/2| ≤ floor(√L), que para L=20 da el
  «|solape−10| ≤ 4» que esta skill ya traía escrito. Se mide contra el
  patrón **y contra su complementario**, porque la casi-complementaria
  es un calco igual que la copia (cicatriz del lote 5: presenté un 2/20
  como virtud y estaba a 3,6σ).
- **Por qué se cambió**: la regla vieja era «prefijo de CUATRO no visto»,
  y con 16 prefijos y uno por lote **se agota por construcción**. La
  skill decía «al llegar al lote 15»; al recontarlo en E2#13 quedaban
  **cinco**, y tres violaban la regla de rachas. Se agotaba en dos lotes,
  no en diez. El criterio nuevo mide en un espacio de 2^N y cada lote
  publicado sólo excluye una cáscara fina: no se agota.
- **El anti-andamio se busca por LEMA, no por cadena.** El lote 9 pasó
  un `grep "Repara:"` y traía «O senhor **repare** na diferença:» — la
  misma bisagra conjugada. Dato que lo explica: de 128 modelos
  publicados, cinco usan «Repara» y **tres de esos cinco son tres de
  los cuatro `synthesise_sources`**: la muletilla está pegada al tipo.
- **El solape con los lotes previos se busca cerca del AZAR (≈10/20), no
  al mínimo.** Corrección del lote 5: presenté un 2/20 contra el lote 4
  como virtud y está a 3,6σ — es la casi-complementaria de ese lote,
  que es un patrón igual que el calco. El objetivo es independencia.
- **Los atajos se miden como ACIERTO sobre los 20, nunca como recall
  sobre los MAL.** El lote 5 presumió de «1/20» comparándolo con el
  «19/20» del lote 3: manzanas y peras, 10 puntos de mejora inflada. El
  acierto real era 11/20.
- **Hay que probar más de un atajo.** Los tres conocidos, con su cifra
  del lote 5 v2 tras corregirlos: palabra española visible (11/20),
  **marca de día concreto (15/20 → 9/20)**, glosa cognada que da español
  normal (16/20 → 14/20). El del día nació de un descuido que se repite
  solo: **si añades un rasgo por el bien de los MAL —un adverbio
  temporal, un contexto, una longitud— tiene que aparecer también en los
  BIEN.** Anclar temporalmente sólo los MAL hizo predecible el 75 % del
  lote.
- **Dieta mixta obligatoria**: si los MAL se resuelven con «¿hay una
  palabra visiblemente española? → MAL», el lote es de A2 disfrazado
  (19/20 sin saber portugués, lote 3). Mínimo 3-4 MAL gramaticales
  donde TODAS las palabras sean portuguesas (talvez+conjuntivo,
  progresivo-no-futuro, dequeísmo, colocação, ser/estar…). Contra el
  atajo de la glosa cognada, lo que ayuda son MAL cuya traducción
  palabra-por-palabra dé español **roto**: «Los ciudadanes votaron»,
  «Habían muchas personas», «Ayer he hablado», «Prometo hacer-lo».
- **Un solo error por frase MAL, repair MÍNIMO** (corrige EL error, no
  dos cosas — «estou a esperar», no «estou à espera de»). **Prueba
  operativa: borra el elemento culpable y mira qué queda.** Si lo que
  queda ya es portugués correcto, ÉSE es el repair. «Não consegui
  dormir-me» → el error es el clítico → «Não consegui dormir», no
  «adormecer»: el alumno que borra el «-se» ha acertado, y con el repair
  largo el modelo le habría dicho que no. Mismo fallo que «cadeiras» vs
  «disciplinas» en el lote 3.
- **Que tu propia atestación licencie tu frase.** Publiqué la
  contracción de clíticos con «prometer» y mis siete atestaciones del
  corpus eran cinco con verbos de decir y ninguna con «prometer»: la
  frase era gramatical y sonaba a ejercicio justo por eso. Si citas
  corpus para probar que un punto existe, escribe el ítem con el
  anfitrión que el corpus te da.
- **Sin absolutos falsos**: «no existe» / «obligatoriamente» / «nunca»
  han caído CATORCE veces. **Y el más caro fue el décimo: «el portugués
  no lo admite en ninguna variedad», desmentido por la MISMA cita de
  Ciberdúvidas que sostenía el ítem** («ocorre na variedade
  brasileira»). Antes de escribir un absoluto, relee tu propia fuente
  buscando la cláusula que lo limita: suele estar en la misma frase. Olvidar/aficionado/regalo/gana/listo existen;
  ir a + inf de inminencia existe; la contracción tiene excepción;
  «morada» SÍ es morada de vivir (Priberam ac. 1); «menor» SÍ convive
  con «mais pequeno»; «não tenho a mínima ideia» SÍ se dice; «dar pena»
  existe; «tava» SÍ se escribe en Portugal; «tive que» convive con
  «tive de». Hedge con verdad: «hoy nadie lo dice», «en el estándar
  europeo», «suena más culto».
- **Cuidado con la regla que se enuncia con los ejemplos que la
  confirman.** «Tras -r cae la consonante y el verbo se acentúa» es
  falso para los -ir (parti-lo, abri-la) y los tres ejemplos que puse
  eran -ar/-er/-ôr: la prueba escondía la excepción. Si enuncias una
  regla, busca la conjugación o el caso que la rompe ANTES de escribirla.
- **Sin fugas**: la explicación de un ítem no puede ser la respuesta de
  otro (GJ-05→06 del piloto, 06→07 del lote 1, 01→02 del lote 2 — las
  tres se cortaron). Lección→ejercicio SÍ es diseño válido: los ítems
  que una lección «regala» viven EN su bloque, tras la lección.
- **Puntos vírgenes verificados CONTRA LOS JSON publicados** (grep a
  b8/b10/b11), no contra la memoria — la lista de cabecera del lote 2
  estaba incompleta y costó dos repeticiones.
- **Metadata coherente**: todo tuteo declara `register informal ·
  address tu`; deferencia 3.ª declara formal; la mesóclise es culta,
  no informal. BIEN de hipercorrección = el canon correcto (mesóclise,
  infinitivo pessoal, hei de, gostava que, importa-se de, se calhar,
  imenso adverbial).
- **`address` SÓLO donde hay tratamiento en la frase.** El catálogo
  publicado lo omite en 68 de 86 ítems: se declara cuando hay un «tu»,
  un «-te», un posesivo de 2.ª o una forma verbal 2sg. La v1 del lote 5
  lo declaró en 20/20, incluyendo frases sin ni una marca de segunda
  persona — eso rompe la convención y ensucia `revisarRegistro`.

## El molde de las mediaciones

- **sourceText de la Biblioteca, EXTRAÍDO POR SCRIPT del JSON** — jamás
  re-tecleado ni descrito de memoria. Tres reincidencias: el castillo
  inventado (piloto), las espigas en monedas (lote 2), el rey vivo
  (lote 3). La grafía antigua de Eça/Junqueiro NO se «corrige».
- **Leer entero NO basta: el modelo se coteja contra el JSON en el
  MISMO paso en que se escribe.** Sexta reincidencia (lote 6): con la
  fuente leída ÍNTEGRA esa misma sesión, el resumen dijo que el lino
  llega a libro (nunca llega — «os livros vão por esse mundo fóra» y el
  papel se queda) y que cantan las silvas (cantan las crianças).
  Redactar horas después de leer ES redactar de memoria.
- **Todo número que se declare «medido» lleva la SALIDA PEGADA del
  comando, no la cifra suelta.** En el lote 6 los doce «contadas por
  script» eran números inventados en rango — los dos revisores los
  recontaron y ninguno coincidía. La cifra sin su comando al lado vale
  lo que una estimación.
- **El recorte tiene que sostenerse solo.** El de la v1 del lote 5
  empezaba en «Dito isto desappareceu» — una anáfora cuyo antecedente
  (Jesús) quedaba fuera. Lee el primer párrafo del recorte preguntándote
  quién es «él» y qué es «esto»: si no se contesta desde dentro, amplía.
- **NINGUNA CITA DE CORPUS ENTRA SIN LEER LA FRASE ENTERA ALREDEDOR.**
  Es el mismo mecanismo que produjo las espigas convertidas en monedas,
  ahora en las pruebas: en el lote 5 justifiqué dos retiradas con greps
  que devolvían la cadena y no el sentido — «todo o que» resultó ser
  «todo aquel que» (otro sentido) y «eram as duas» era «son las dos
  RELACIONES», no un reloj. Las retiradas eran correctas; las pruebas,
  falsas. Un grep da candidatos, no veredictos.
- Los ficheros con guion doble son SOLO de contos-phantasticos;
  amor-de-perdicao-cNN va con guion simple. `parrafos[0]` puede ser el
  numeral de sección.
- **Rúbricas binarias autoevaluables** (nada de «suena real» sin
  operacionalizar) y el MODELO debe cumplir SU rúbrica casilla a
  casilla. Techo de `summarise` ≤ ~70% de la fuente; relay/reformulate/
  cross_variety recuentan y pueden exceder.
- **Comprueba el modelo contra su rúbrica UNA CASILLA POR VEZ, por
  escrito.** En el lote 5, TRES de seis modelos incumplían el suyo y yo
  no lo vi: uno se comía la mitad de la sentencia que la casilla exigía,
  otro no nombraba a la destinataria que la casilla pedía nombrar, otro
  fallaba a la letra. Leerlo entero y decir «cumple» no es comprobarlo.
- **La rúbrica tiene que ser SATISFACIBLE dentro del `wordRange`.**
  Redacta la respuesta mínima que tica todas las casillas y cuéntala: si
  mide el máximo justo, el rango está mal. (MED-28: mínimo cumplidor
  60 palabras, rango 35-60.)
- **Una casilla verificable por script vale por tres de juicio.** «No
  copia más de 6 palabras seguidas de la fuente» se comprueba con
  n-gramas y no admite discusión. Métele al menos una por mediación.
- **audience en la lengua del PRODUCTO** (pt→pt en portugués, pt→es en
  español). Consignas españolas sin lusismos («chiste», no «anedota»).
- **cross_variety**: el BR de la fuente debe ser BR AUTÉNTICO y
  verosímil (nada de frases fabricadas al revés para forzar el léxico
  meta); cuidado con condenar europeo vivo en la rúbrica («a gente
  encontra-se» es europeo; lo BR era la próclise; «tava» se escribe en
  Portugal; «fila» es europea neutra). **Y comprueba las marcas de la
  palabra que PRESCRIBES, no sólo de la que condenas**: la rúbrica del
  lote 5 obligaba a cambiar «fila» —sin marca regional en Priberam— por
  «bicha», que es [Portugal, informal] y, en el mismo diccionario,
  homógrafo del insulto homófobo corriente. Estaríamos enseñándoselo a
  alguien que lo va a decir en una estación de Lisboa.
- **La mejor casilla del lote 5 exige DISCRIMINAR, no corregir en
  bloque**: «pasa "Me liga" a "Liga-me" Y deja en paz "ainda me
  esqueci", donde la próclise la dispara "ainda" y es europea». Eso
  separa un ejercicio de C1 de uno de B1.
- Variar taskType×fuente entre lotes: el tercer relay-de-anedota
  consecutivo ya es fórmula.

## Lecciones b11+ (Anti-calco C1)

- El MDX se revisa en el MISMO round que el lote (texto didáctico =
  misma saña). Estructura: `<Rule>` + `### Vocabulário` (≤7 en
  vocabKey) + `<Example>` + `<Tip>`.
- Checklist de bloque nuevo: `LessonSchema` en zod-schemas tiene
  `blockId max()` y `vocabKey max(7)` — subir el tope o revienta;
  `BLOQUE_A_NIVEL` en anchor.ts; BLOCKS **y los `*_CONCEPTS` en
  `ALL_CONCEPTS`** en curriculum.ts; `lessons/bN.json` + su MDX +
  `blocks/bN.json` (aunque sea `[]`); el test `loaders-lang` cuenta los
  bloques; `verify-content` exige que el lessonId de cada ítem exista EN
  SU bloque.
- **Un mapa duplicado es una métrica que miente en silencio.** Al abrir
  el bloque 12 (E2#13) todo salió verde y los ocho puntos de C2 recién
  declarados **desaparecieron de la tabla de déficit**: cayeron en el
  nivel «?» porque `scripts/split-conceptos.ts` tenía su propia COPIA de
  `BLOQUE_A_NIVEL` en vez de importarla. Nada falló; la cifra
  simplemente dejó de contar 96 unidades. Ahora se importa de
  `lib/data/anchor.ts`, que es la fuente única.
- **Declarar un punto no crea trabajo: lo hace visible.** Al declararlo,
  las unidades pasan de la columna «sin empezar» a la de «declarados con
  cero», que es la que vigila la línea de reconciliación; el total no se
  mueve y el residuo sigue en cero. Es el corolario de la cicatriz de
  E2#12 (un punto a cero era invisible).
- Los ítems que la lección enseña nacen en su bloque con su lessonId y
  en `exerciseRefs`. Examples no reciclan repairs publicados verbatim.
- Dos familias en falsos amigos: los de verdad Y los que parecen falsos
  pero son amigos (apelido, constipado — el pánico viene del inglés).

## Sellos y trazabilidad

`variantStatus: 'unchecked'` + `variantVerificacion: 'Ola B2C2 lote N:
2 linguistas adversariais FECHA (doc)'`. Ids: `b2c2-gj-lN-XX`,
`b2c2-med-XX` (numeración corrida). El doc del lote es la constancia de
procedencia del contenido original — mismo rol que el gate de la Ola L.
