# Lote 10 B2C2 — auditoría de DISEÑO DEL LOTE (revisor pedagógico)

**Fecha:** 2026-08-31 · **Objeto:** `docs/contenido/2026-09-01-lote10-b2c2.md`
(16 juicios de gramaticalidad) · **Trabajo en solitario, sin consultar al otro
revisor.** No he tocado ningún fichero del repo: los candidatos y las corridas
del gate viven en el scratchpad.

## Veredicto

**NO PUBLICAR tal cual.** El molde formal (ratio, arranque, rachas) está bien y
lo he verificado contra la tabla. Lo que falla es lo que la tabla no mira:

1. **Un atajo no probado rompe el lote: la LONGITUD acierta 13/16 (81 %) y hasta
   14/16 (88 %).** Las cinco frases más cortas son las cinco MAL; ninguna BIEN
   baja de 8 palabras. Es la cicatriz del «marca de día concreto» con la
   polaridad invertida: se le añadió a los BIEN una coleta justificativa que
   los MAL no tienen.
2. **Las tres cifras del final: una miente de plano, otra miente de etiqueta, y
   la tercera acierta el número por un camino inválido y con la lista mal.**
3. **Seis de los dieciséis ya están publicados** — uno de ellos con la respuesta
   literal en las opciones de un `multiple_choice` de b10, otro es el *repair*
   textual de un ítem del propio b11. El doc no corrió el gate de virginidad:
   yo lo corrí y da **23 pares fiables + 9 puntos reenseñados desde un bloque
   anterior**.
4. **Dos ítems contradicen a ítems publicados** (GJ-05 vs `gj-l3-03`, GJ-15 vs
   `gj-l4-16`) y **uno se contradice con otro del propio lote** (GJ-01 vs GJ-08).
5. **Tres fugas de explicación→respuesta**, dos de ellas dentro del lote.
6. La tabla de déficit mide un artefacto de metadatos: `b11-regencias` no tiene
   5 ítems publicados, tiene **10**.

---

# 1 · LOS ATAJOS, MEDIDOS

Regla del método (skill): *«Los atajos se miden como ACIERTO sobre los N, nunca
como recall sobre los MAL.»* Todo lo de abajo es acierto sobre los 16, con la
predicción del atajo pegada ítem a ítem.

## 1.1 Atajo A — «¿hay una palabra visiblemente española? → MAL»

```
  disparos: 0 de 16 (ninguna frase contiene una palabra española). La regla predice BIEN×16.
  BIEN×16 (la regla nunca dispara)                            8/16 =  50%   fallan: 1,2,4,7,9,11,12,15
  → recall sobre los MAL = 0/8. ACIERTO sobre los 16 = 8/16 (= azar).
```

La premisa del doc es CIERTA (revisé palabra por palabra los ocho MAL: no hay
ni un españolismo). **La cifra está mal etiquetada.** «0 de 16» es el recall
sobre los MAL (0 de 8) escrito sobre una base de 16. El acierto es 8/16.
Conclusión práctica idéntica (el atajo no explota nada), **pero es exactamente
la confusión que la skill prohíbe por escrito**, y en el mismo sitio del
documento donde el lote 5 la cometió.

## 1.2 Atajo B — «glosa palabra por palabra: ¿sale español normal? → MAL»

```
   #  V  glosa normal?  → la regla dice   glosa
   1  M  SÍ            → M   Estoy haciendo la cena, ya falta poco.
   2  M  SÍ            → M   Acabo de llegar ahora mismo del aeropuerto.
   3  B  no (roto)     → B   Acostumbro levantarme a las siete, MISMO AL fin de semana.
   4  M  no (roto)     → B   En estos últimos meses VIAJÉ INMENSO A TRABAJO.
   5  B  no (roto)     → B   He de contarte todo cuando nos *VIÉREMOS* con calma.
   6  B  no (roto)     → B   *QUEDÉ A PENSAR* en lo que me dijiste ayer por la noche.
   7  M  SÍ            → M   El tren está para llegar, pero aún va a demorar dos horas.
   8  B  SÍ            → M   La abuela va mejorando poco a poco, ya se levanta sola.
   9  M  SÍ            → M   Se vino a saber que él ya estaba enfermo hace meses.
  10  B  SÍ            → M   Asistimos al partido todo de pie, no había sitios.
  11  M  no (roto)     → B   *LLEGAMOS EN Lisboa* a las seis de la tarde.
  12  M  no (roto)     → B   *Los chicos obedecen LOS abuelos* sin discutir.
  13  B  SÍ            → M   Repara en la camisa nueva de él, debe haber costado una fortuna.
  14  B  no (roto)     → B   Entré en la sala sin *BATIR A LA* puerta y él *NI DIO POR MÍ*.
  15  M  no (roto)     → B   *PEDÍ PARA ÉL VENIR* más temprano al día siguiente.
  16  B  SÍ            → M   Se casó con una arquitecta que conoció en Coimbra.
  acierto de la regla sobre los 16                            8/16 =  50%   fallan: 4,8,10,11,12,13,15,16
    · sólo sección A (aspecto, 1-9)                           7/9  =  78%   fallan: 4,8
    · sólo sección B (regência, 10-16)                        1/7  =  14%   fallan: 10,11,12,13,15,16
  MAL cuya glosa da español normal: [1, 2, 7, 9]
```

**El número final del doc (8/16) es correcto. La lista y el método no.**

- El doc dice que los MAL de glosa española normal son **02, 11, 12 y 15**. De
  esos, sólo el 02 lo es. **11, 12 y 15 glosan a español ROTO** («llegamos EN
  Lisboa», «obedecen LOS abuelos» — el español exige la *a* personal —, «pedí
  para él venir»), porque sus errores son **brasileirismos, no hispanismos**.
  Lo dice el propio doc en las explicaciones («Chegar em es brasileño»,
  «Pedir para + infinitivo es coloquial y brasileño») y aun así los cuenta
  como calcos del español.
- Faltan tres que sí lo son: **01, 07 y 09**. El 09 es especialmente flagrante:
  su explicación dice «es el que produce quien traslada la próclise española»
  — o sea, por definición su glosa da español normal.
- El método: «son la mitad de los MAL ⇒ acierta 8 de 16». Eso vuelve a ser
  recall (4/8) transportado a una base de 16 sin mirar el lado BIEN. Que el
  resultado coincida es casualidad aritmética.
- **Lo que sí importa y el doc no vio: en la sección B el atajo acierta 1/7
  (14 %), es decir, un alumno que lo use SISTEMÁTICAMENTE saca 6/7 invirtiendo
  la regla.** Un atajo anti-correlacionado es tan explotable como uno
  correlacionado.

## 1.3 Atajo C — «¿hay marca temporal? → MAL»

El doc afirma: *«marca de día concreto: no se usa en ninguno, ni en los MAL ni
en los BIEN, así que no ancla nada.»* **Es falso: once de dieciséis llevan
marca temporal explícita**, incluidos «ontem à noite» (06) y «no dia seguinte»
(15), que son marcas de día en el sentido literal del lote 5.

```
   1  M  já falta pouco               → M
   2  M  agora mesmo                  → M
   3  B  às sete / ao fim de semana   → M
   4  M  Nestes últimos meses         → M
   5  B  quando nos virmos            → M
   6  B  ontem à noite                → M
   7  M  ainda / duas horas           → M
   8  B  aos poucos / já              → M
   9  M  já / há meses                → M
  10  B  —                            → B
  11  M  às seis da tarde             → M
  12  M  —                            → B
  13  B  —                            → B
  14  B  —                            → B
  15  M  mais cedo / no dia seguinte  → M
  16  B  —                            → B
  acierto sobre los 16                                       11/16 =  69%   fallan: 3,5,6,8,12
    · sólo sección A (1-9)                                    5/9  =  56%   fallan: 3,5,6,8
    · sólo sección B (10-16)                                  6/7  =  86%   fallan: 12
```

**En la sección B (regência) el atajo temporal acierta 6/7 = 86 %** sin saber
una palabra de portugués. En la sección A es ruido (todos los ítems de aspecto
llevan tiempo, como es natural). O sea: la afirmación del doc es falsa, y el
rasgo está anclado justo donde no debería.

## 1.4 Atajo D — LONGITUD (el que el doc no probó, y el que rompe el lote)

```
 #  V  pal  car  frase
 1  M    7   39  Estou fazendo o jantar, já falta pouco.
 2  M    7   41  Acabo de chegar agora mesmo do aeroporto.
 3  B    9   52  Costumo levantar-me às sete, mesmo ao fim de semana.
 4  M    7   46  Nestes últimos meses viajei imenso a trabalho.
 5  B   10   50  Hei de te contar tudo quando nos virmos com calma.
 6  B   10   49  Fiquei a pensar no que me disseste ontem à noite.
 7  M   11   61  O comboio está para chegar, mas ainda vai demorar duas horas.
 8  B   10   55  A avó vai melhorando aos poucos, já se levanta sozinha.
 9  M   10   50  Veio-se a saber que ele já estava doente há meses.
10  B    9   49  Assistimos ao jogo todo de pé, não havia lugares.
11  M    7   36  Chegámos em Lisboa às seis da tarde.
12  M    7   40  Os miúdos obedecem os avós sem discutir.
13  B   10   59  Repara na camisola nova dele, deve ter custado uma fortuna.
14  B   13   55  Entrei na sala sem bater à porta e ele nem deu por mim.
15  M    9   44  Pedi para ele vir mais cedo no dia seguinte.
16  B    8   52  Casou-se com uma arquitecta que conheceu em Coimbra.
M: n=8  palabras media 8.12 (min 7 max 11)  caracteres media 44.6
B: n=8  palabras media 9.88 (min 8 max 13)  caracteres media 52.6

  mejor corte por CARACTERES: 14/16 (88%) con «≤ 48 caracteres → MAL»
    regla de caracteres                                      14/16 =  88%   fallan: 7,9
  «≤7 palabras → MAL, ≥8 → BIEN»                             13/16 =  81%   fallan: 7,9,15
  las 5 frases de ≤7 palabras: [1, 2, 4, 11, 12] — LAS CINCO son MAL (5/5, precisión 100%)
  las 8 BIEN miden 8-13 palabras; ninguna baja de 8.
```

**13/16 sin saber portugués, y con precisión perfecta en el extremo corto.** La
causa es visible leyendo la columna: **las ocho BIEN llevan una coleta que las
avala** («não havia lugares», «deve ter custado uma fortuna», «já se levanta
sozinha», «mesmo ao fim de semana», «e ele nem deu por mim», «que conheceu em
Coimbra») y cinco de los ocho MAL van pelados. Es literalmente la regla de la
skill —*«si añades un rasgo por el bien de los MAL tiene que aparecer también
en los BIEN»*— aplicada al revés: aquí el rasgo se añadió por el bien de los
BIEN, para que sonaran naturales.

## 1.5 Atajos secundarios medidos

```
  «¿lleva clítico (-me/-se/te/…)? → BIEN»                    12/16 =  75%   fallan: 9,10,13,14
    con clítico: [3, 5, 6, 8, 9, 16] → 5 BIEN, 1 MAL
  «≤7 palabras → MAL; en la sección B, marca temporal → MAL» 14/16 =  88%   fallan: 7,9
```

Combinando dos rasgos superficiales (longitud + tiempo) se llega a **14/16 =
88 %**. Ése es el techo real del lote para alguien que no sepa portugués.

## 1.6 Resumen de las tres cifras declaradas

| cifra del doc | ¿miente? | valor correcto |
|---|---|---|
| «palabra española: 0 de 16» | **sí, de etiqueta** — es recall (0/8), no acierto | acierto **8/16** (azar) |
| «marca de día: no se usa en ninguno» | **sí, de hecho** — 11 de 16 llevan marca temporal | acierto **11/16**; **6/7 en la sección B** |
| «glosa cognada: 02,11,12,15 → acierta 8 de 16» | **sí, la lista y el método**; el número coincide por azar | lista real **01,02,07,09**; acierto 8/16, pero **1/7 en la sección B** (⇒ 6/7 invertido) |
| *(no probada)* **longitud** | — | **13/16 (81 %) · 14/16 con corte por caracteres** |

---

# 2 · LA DIETA

**Criterio literal: SÍ pasa.** Los ocho MAL son 100 % portugués y el fallo es
invisible al ojo. No hay un solo españolismo léxico. Eso está bien hecho y hay
que decirlo.

**Criterio de fondo: falla.** La skill pide MAL cuya traducción palabra por
palabra dé español **roto**. Hay exactamente cuatro (04, 11, 12, 15) — cumple
el mínimo de 3-4 — pero **tres de ellos lo consiguen por ser brasileirismos, no
por ser calcos**. Composición real de los ocho MAL por origen del error:

| origen | ítems | n |
|---|---|---:|
| calco del español (lo que el bloque 11 dice enseñar) | 02, 04, 09 | **3** |
| forma brasileña (dialecto, no calco) | 01, 11, 15 | 3 |
| incompatibilidad semántica de la perífrasis | 07 | 1 |
| calco que **no existe** (ver §5, GJ-12) | 12 | 1 |

En un bloque titulado **Anti-calco C1**, tres de ocho MAL son brasileirismos y
uno no tiene interferencia ninguna. El alumno que aplique «lo que suena
brasileño está mal» saca 3 de 8; el que aplique «lo que calca al español está
mal» saca otros 3. Ninguna de las dos heurísticas es la que el bloque quiere
instalar, y las dos funcionan a medias.

---

# 3 · EL MOLDE, verificado contra la TABLA (no contra lo que dice)

Leí los 16 verdicts de las fichas y reconstruí la secuencia:

```
 lote 10 n=16  MMBMBBMBMBMMBBMB  M=8 B=8 ?=0  arranque4=MMBM  ult.MAL=15  racha_max=2
```

- **Ratio 8/8 ✓** (M en 01,02,04,07,09,11,12,15).
- **Arranque MMBM ✓ y genuinamente virgen.** No me fié de la lista de la skill:
  reconstruí los arranques reales del corpus publicado.
  ```
  l1=BMMB, l2=BMBM, l3=MBBM, l4=MMBB, l5=BBMM, l6=BBBM, l7=MMMB, l8=BBMB, l9=BMBB
  ```
  MMBM no está. ✓
- **Rachas máximas 2 ✓** (declarado 2, medido 2 — y la skill sólo exige ≤3).
- **Último MAL en 15 ✓ pero al filo.** El análogo de «19-20 sobre 20» en un lote
  de 16 es 15-16. Está en el borde flojo: **quien haya contado ocho MAL al
  llegar al 15 tiene el 16 regalado**. Con el último MAL en 16 el ataque por
  conteo no rinde nada.
- **Solape posicional con los lotes previos** — comprobación que la skill exige
  («cerca del AZAR, no al mínimo») y que el doc omite por completo:
  ```
   vs lote 1 :  5/16 coincidencias  (azar 8.0)  z=-1.50
   vs lote 2 : 10/16 coincidencias  (azar 8.0)  z=+1.00
   vs lote 3 : 11/16 coincidencias  (azar 8.0)  z=+1.50
   vs lote 4 : 10/16 coincidencias  (azar 8.0)  z=+1.00
   vs lote 5 :  7/16 coincidencias  (azar 8.0)  z=-0.50
   vs lote 6 :  6/10 coincidencias  (azar 5.0)  z=+0.63
   vs lote 7 :  8/10 coincidencias  (azar 5.0)  z=+1.90
   vs lote 8 :  2/10 coincidencias  (azar 5.0)  z=-1.90
   vs lote 9 :  4/10 coincidencias  (azar 5.0)  z=-0.63
  ```
  **Todo dentro de 2σ. ✓** Lo más tenso: lote 7 (+1,90) y lote 8 (−1,90, la
  casi-complementaria que la skill señala como patrón). Hay que **pegar esta
  tabla en el doc**, no dejar la comprobación implícita.
- **Alternancia**: 11 cambios de signo en 15 pares adyacentes (esperado 7,5;
  z=+1,81). Alta pero dentro de rango. Con rachas topadas a 2 en un lote de 16
  esto es casi forzoso; conviene permitir una racha de 3.
- ⚠️ **Metadata: el doc no declara NADA.** Ni `register`, ni `address`, ni
  `concepts` por ítem, ni `difficulty`. La skill lo exige explícitamente
  («Metadata coherente», «`address` SÓLO donde hay tratamiento en la frase»).
  Con esta tabla: **address `tu` obligatorio en 05 («te contar»), 06
  («disseste» 2sg) y 13 («Repara» imperativo 2sg); prohibido en los otros
  trece.** Sin esto `revisarRegistro` va a chillar.
- ⚠️ Las reglas del molde están escritas para n=20 y aquí se han escalado a 16
  **sin declararlo**. El escalado que hicieron es razonable, pero consumir uno
  de los 16 prefijos de cuatro con un lote de 16 acelera el agotamiento que la
  propia skill ya anuncia para el lote 15.

---

# 4 · FUGAS

**Tres dentro del lote (dos son de las que se cortan) y una desde el corpus.**

### F1 · GJ-03 → GJ-16 · **CORTAR**
GJ-03 (posición 3) explica: *«la ênclise "levantar-me" es la colocación por
defecto, **sin atractor** que la mueva»*.
GJ-16 (posición 16) pregunta exactamente eso: *«el hablante coloca "se casó" y
produce "se casou", con **próclise sin atractor**»*.
Misma regla, misma palabra clave, trece posiciones de distancia. GJ-03 regala
GJ-16. Es el mismo mecanismo que mató a GJ-05→06 del piloto.

### F2 · GJ-10 → GJ-12 · **CORTAR**
GJ-10 (pos. 10) establece: *«"Assistir A" cuando significa presenciar… El
brasileño admite "assistir o jogo"; el europeo no.»*
GJ-12 (pos. 12) es la misma estructura con otro verbo: objeto pelado donde el
europeo pide **A**. Quien leyó la explicación de 10 acierta 12 sin pensar. Y
las dos explicaciones usan el mismo molde retórico («Sin la preposición, X
significa OTRA COSA»), lo que refuerza el emparejamiento.

### F3 · GJ-01 y GJ-06 → GJ-08 · trampa querida, **pero con un absoluto falso**
01 y 06 preparan al alumno contra el gerundio y 08 es el contraejemplo. Eso es
buen diseño. El problema es cómo está escrito el 01:

> «en Portugal sólo sobrevive en usos adverbiales»

**El propio GJ-08 lo desmiente**: «vai melhorando» no es un uso adverbial, es
una perífrasis aspectual. Dos explicaciones del mismo lote se contradicen. Es
la cicatriz de los «absolutos falsos» (catorce caídas), y aquí el desmentido no
hay ni que buscarlo fuera: está ocho ítems más abajo.

### F4 · fuga desde el corpus publicado → GJ-01
`b10/e6e74857` (publicado, `multiple_choice`) dice literalmente:

> «El progresivo **'estou fazendo'** es típico de Brasil; en Portugal se dice:
>  [**estou a fazer**, estou faço, fazendo estou]»

GJ-01 es «Estou **fazendo** o jantar» → «Estou **a fazer** o jantar». La
respuesta está publicada palabra por palabra, con el enunciado incluido.

*(Nota metodológica: la lección `b11/l4-aspecto-e-tempo.mdx` regala 7 de los 9
ítems de aspecto en sus `<Example>` casi verbatim — «Estou a fazer o jantar»,
«Acabei de chegar», «Costumo levantar-me às sete», «Hei de te contar tudo»,
«Fiquei a pensar no que disseste», «O comboio está para chegar», «A avó vai
melhorando aos poucos» —, y el `<Tip>` explica GJ-08 entero. Eso **la skill lo
permite** («Lección→ejercicio SÍ es diseño válido»), pero conviene verlo por lo
que es: los nueve ítems de la sección A son la lista de siete `vocabKey` de la
lección con una coleta pegada. No miden discriminación, miden recuerdo de una
lista de siete líneas — y de ahí, en parte, viene el atajo de longitud.)*

---

# 5 · ¿ES C1? Veredicto por ítem

| # | veredicto | por qué |
|---|---|---|
| 01 | **A2/B1 — RETIRAR** | Regla nº 1 de cualquier manual. Publicado como `b7-ep-07` (`error_correction`, concepto `b7-estar-a-infinitivo`) **con el mismo repair**, y regalado por `b10/e6e74857`. |
| 02 | **C1 ✓** | «acabo / acabei de» es fino, virgen y el calco existe de verdad. El mejor de la primera mitad junto al 04. |
| 03 | **B1/B2 — flojo** | «costumar» es B2 temprano; la ênclise en infinitivo es la posición trivial (no cabe atractor). Además regala el 16 (F1). |
| 04 | **C1 ✓✓** | Perfeito composto disparado por marcador durativo. Virgen, dirección inversa al calco, glosa rota. El mejor del lote. |
| 05 | **C1 de punto, pero DUPLICADO** | Ver §6: clon de `b2c2-gj-l3-03` y **contradice su explicación**. |
| 06 | **B2, casi-clon** | Ver §6: `b2c2-gj-l9-07` es «Fiquei a saber **ontem** que…»; éste es «Fiquei a pensar… **ontem** à noite». Mismo verbo, mismo tiempo, mismo adverbio, mismo verdict, lote inmediatamente anterior. |
| 07 | **NO prueba portugués — REHACER** | La incompatibilidad «está para llegar / **dos horas**» **sobrevive intacta a la traducción**: «El tren está para llegar pero aún tardará dos horas» chirría igual en español. Se resuelve sin portugués. Y el repair viola el mínimo (§7). |
| 08 | **C1 ✓ de discriminación** | Buen contraejemplo. Rebaja: la construcción está publicada en b7 (`10c85d3c`: «Ele **vai entrando aos poucos** em confiança») con el **mismo adverbial**, a nivel B1/B2. |
| 09 | **C1 ✓✓ pero MAL ARCHIVADO** | Clítico sobre el infinitivo en perífrasis: virgen (0 hits de `vir a + inf` en 2 431 ejercicios) y genuinamente C1. Pero su punto es **colocação**, no aspecto — lo dice la propia explicación: «El error es de colocación, no de perífrasis». |
| 10 | **RETIRAR** | Es el *repair* textual del publicado `b2c2-gj-l4-17` (§6). Y como BIEN discrimina poco: el español «asistir a» coincide, así que la respuesta correcta es no hacer nada. |
| 11 | **B1 y de origen equivocado** | «chegar a» es B1. El error es **brasileño**, y el hispanohablante no lo produce (su español dice «llegamos **a** Lisboa»): no hay calco que combatir. |
| 12 | **El calco que enseña NO EXISTE — REHACER** | La explicación dice «En español "obedecer" es transitivo y de ahí el calco». Falso con objeto humano: el español exige la *a* personal — «obedecen **a** los abuelos» —, que produce **exactamente la forma portuguesa correcta**. La L1 empuja al ACIERTO. **Arreglo:** objeto no humano — «Os miúdos obedecem as regras» → «obedecem **às** regras»; ahí el español («obedecen las reglas», sin preposición) sí genera el error. |
| 13 | **B2, y PRE-ENSEÑADO** | «reparar em» no tiene ejercicio publicado, pero **seis `modelAnswer` de mediación publicados usan «Repara na/no…»** (`med-27`, `med-35`, `med-37`, `med-44`, `med-52`, `med-129`). El alumno ha leído la construcción seis veces en respuestas modelo. Además «Repara» es la muletilla documentada de la casa. |
| 14 | **B1 — RETIRAR o rehacer** | «entrar em» se enseña en b5 («entrar na universidade»). Ningún B1 falla «entrei na sala». Encima acumula **tres** regências en una frase (entrar em + bater à + dar por, esta última ya publicada en `gj-l4-20`): un BIEN que exige acertar tres juicios a la vez baja la probabilidad de acierto sin subir la información. |
| 15 | **CONTRADICE AL CORPUS — RETIRAR o dar la vuelta** | Ver §6. Y el repair viola el mínimo (§7). |
| 16 | **Mal etiquetado** | La regência «casar com» está publicada dos veces (`b2/d3e11929`, `b8/9571e77d`) y coincide con el español; la propia explicación dice «La trampa aquí **no es la preposición**». El punto real es colocação pronominal — que pertenece a `b11-l3` / `b8-l3`, no a regências. Y lo regala GJ-03 (F1). |

**Demasiado fáciles para C1: 01, 03, 10, 11, 14** (y 07, que no es fácil pero no
es de portugués). **Genuinamente C1: 02, 04, 08, 09** — cuatro de dieciséis.

---

# 6 · SOLAPE CON LO PUBLICADO

**El doc no corrió el gate.** Su prueba de virginidad es una lista en prosa de
ocho ítems escrita a mano. La corrí yo (candidatos en scratchpad, umbral **del
código**, 0.34, como manda la skill):

```
corpus indexado: 2431 ejercicios · 9516 tipos de palabra · umbral 0.34
candidatos nuevos: 16
...
puntos reenseñados desde un bloque anterior: 9
...
pares por encima del umbral: **23 fiables** + 1 contra ítems de texto ínfimo
```

Los pares que **importan** (los que coinciden en el PUNTO, no en «pão»):

```
0.600  b2c2-gj-l10-01  ↔  e6e74857 (b10 multiple_choice)
         comparten: fazendo, estou, fazer
         estou a fazer · estou faço · fazendo estou
0.417  b2c2-gj-l10-01  ↔  b7-ep-07 (b7 error_correction)
         comparten: fazendo, fazer
         O que estás fazendo aí em cima? · O que estás a fazer aí em cima?
0.592  b2c2-gj-l10-10  ↔  b2c2-gj-l4-17 (b11 grammaticality_judgment)
         comparten: assistimo, jogo, todo
         Ontem assistimos o jogo todo na televisão. · Ontem assistimos ao jogo todo na televisão.
0.379  b2c2-gj-l10-06  ↔  b2c2-gj-l9-07 (b8 grammaticality_judgment)
         comparten: fiquei, ontem
         Fiquei a saber ontem que ela se mudou para o Porto.
0.386  b2c2-gj-l10-15  ↔  b2c2-gj-l4-16 (b8 grammaticality_judgment)
         comparten: vir, cedo
         Disse-lhe para vir mais cedo amanhã.
0.395  b2c2-gj-l10-16  ↔  727eedd9 (b5 translation)
         comparten: arquitecta
         Ela vai ser uma arquitecta muito concreta, sempre com os pés na terra.
```

Y **por debajo del umbral, pero coincidiendo en el punto** (la skill: *«un
umbral elegido a ojo DESPUÉS de ver los resultados es un descarte silencioso
con otro nombre»* — hay que mirar la banda, no sólo lo que salta):

```
0.281  b2c2-gj-l10-05  ↔  b2c2-gj-l3-03 (b8)   «Hei de visitar o Porto um dia.»
0.320  b2c2-gj-l10-08  ↔  10c85d3c (b7)        «Ele vai entrando aos poucos em confiança.»
```

## Los seis choques, uno a uno

**S1 · GJ-10 ES EL *REPAIR* DEL PUBLICADO `b2c2-gj-l4-17`.**
Publicado (b11, lote 4, MAL): «Ontem assistimos **o** jogo todo na televisão»
→ repair «Ontem assistimos **ao** jogo todo na televisão».
Nuevo GJ-10 (BIEN): «Assistimos **ao** jogo todo de pé». Cuatro palabras
seguidas idénticas al repair publicado, mismo verbo, mismo complemento, mismo
punto. **Muerte.**

**S2 · La lista de virginidad del doc está construida sobre un artefacto.**
El doc dice que los cinco ítems de regência publicados son «o primeiro a
chegar», «ir ao encontro de», «sonhar com», «chamar mentiroso», «perguntar à
professora». Ésos son los cinco que tienen `concepts: ['b11-regencias']`
**declarado**. La lección `b11-l2-regencias-que-traem` tiene **diez** ítems
publicados; los otros cinco llevan `concepts: []`:

| id | frase | punto |
|---|---|---|
| `b2c2-gj-l4-08` | «Preocupo-me muito por ti.» | preocupar-se **com** |
| `b2c2-gj-l4-14` | «Os livros que preciso estão esgotados.» | precisar **de** / relativa cortadora |
| **`b2c2-gj-l4-17`** | **«Ontem assistimos o jogo todo na televisão.»** | **assistir a** ← el clon |
| `b2c2-gj-l4-18` | «Esperei por ti mais de uma hora à porta do cinema.» | esperar **por** |
| `b2c2-gj-l4-20` | «Quando dei por ela, já era meia-noite.» | **dar por** ← lo reusa GJ-14 |

Es literalmente la cicatriz de la skill («durante cuatro lotes la regla se
cumplió sólo sobre los ids `b2c2-`»), reencarnada: ahora se cumple sólo sobre
los `concepts` declarados.

**S3 · GJ-01 está publicado dos veces.** `b7-ep-07` (error_correction, mismo
error y mismo repair, concepto `b7-estar-a-infinitivo`) y `b10/e6e74857`
(multiple_choice con la respuesta en las opciones). Además `b2c2-gj-l3-07` ya
cubre el flanco fino de la misma perífrasis («Estou a jantar com eles na
sexta-feira» → no proyecta a futuro).

**S4 · GJ-05 duplica Y CONTRADICE a `b2c2-gj-l3-03`.**
Publicado (BIEN): «**Hei de** visitar o Porto um dia» — *«El español también
tiene 'he de', pero **más libresco**»*.
Nuevo GJ-05 (BIEN): «**Hei de** te contar tudo…» — *«la perífrasis europea de
intención firme… **que el español no tiene**»*.
Mismo punto, mismo verdict, **y afirmaciones incompatibles sobre el español**.
Además el «no tiene» es otro absoluto de los que ya han caído catorce veces.
Lo único nuevo del ítem es «quando nos virmos», que es futuro do conjuntivo —
punto de b8, no de `b11-aspecto-tempo`.

**S5 · GJ-06 es un casi-clon del lote inmediatamente anterior.**
`b2c2-gj-l9-07` (BIEN): «**Fiquei a** saber **ontem** que ela se mudou…»
GJ-06 (BIEN): «**Fiquei a** pensar no que me disseste **ontem** à noite.»
Mismo arranque, mismo auxiliar, mismo tiempo, mismo adverbio, mismo verdict,
misma familia de argumento («construcción europea que al hispanohablante no se
le ocurre»). El gate lo caza a 0,379.

**S6 · GJ-15 contradice de plano al publicado `b2c2-gj-l4-16`.**
Publicado (b8, **BIEN**): «Disse-lhe **para vir mais cedo** amanhã» —
*«'Dizer (a alguém) para + infinitivo' es la manera europea normal de reportar
una orden. **Nada que corregir**.»*
Nuevo GJ-15 (**MAL**): «Pedi **para** ele **vir mais cedo** no dia seguinte» —
*«"Pedir para + infinitivo" es coloquial y brasileño.»*
**Ocho caracteres de diferencia en el segmento crítico y verdicts opuestos.**
Y el propio corpus lo agrava: la explicación de `b2c2-gj-l9-10` dice *«la
regência hermana "dizer para + persona" SÍ está atestada siete veces en la
propia Biblioteca — el "para" no está prohibido en europeo»*. Aplica la barra
de retirada: *«Para un par DISPUTADO, sólo la dirección BIEN admite verdict
inequívoco»*. **GJ-15 es un MAL sobre construcción disputada, con el corpus
propio en contra. No puede publicarse como MAL.**

## Lo que SÍ es virgen (verificado con grep de lema sobre los 2 431 ejercicios)

| punto | hits en el corpus |
|---|---:|
| `obedecer` (GJ-12) | **0** |
| `vir a + infinitivo` (GJ-09) | **0** |
| `estar para + infinitivo` (GJ-07) | **0** |
| `bater à porta` (GJ-14) | **0** |
| `a/em trabalho` (GJ-04) | **0** |
| `reparar em` como ejercicio (GJ-13) | **0** *(pero 6 `modelAnswer` lo usan)* |

Los cuatro puntos realmente vírgenes del lote son **04, 07, 09 y 12**. Los otros
doce reenseñan algo ya presente en el corpus, y **nueve lo hacen desde un
bloque ANTERIOR** (la salida del eje de `concepts` lo dice: *«puntos
reenseñados desde un bloque anterior: 9»*, los nueve de aspecto contra b8).
Reenseñar es legítimo, pero **tiene que salir declarado en el doc**, y no sale.

## Comparación del lote CONSIGO MISMO

La skill lo exige («Un lote se compara consigo mismo»). Lo corrí metiendo los
16 candidatos en el corpus y auditando por prefijo: **cero pares
candidato↔candidato por encima del umbral.** ✓ En eso el lote está limpio.

---

# 7 · REPAIR MÍNIMO — dos violaciones

Prueba operativa de la skill: *borra el elemento culpable y mira qué queda.*

**GJ-07 · el repair cambia DOS cosas.**
`«…mas ainda vai demorar duas horas»` → `«…mas ainda demora um bocado»`.
El culpable es **«duas horas»** (el plazo incompatible con lo inminente).
Bórralo: «O comboio está para chegar, mas ainda vai demorar» — ya es portugués
correcto. **Luego el repair mínimo conserva «vai demorar».** Cambiarlo a
«demora» le dice al alumno que su instinto correcto estaba mal. Es el fallo
«estou a esperar / estou à espera de» clavado.

**GJ-15 · el repair cambia TRES cosas.**
`«Pedi para ele vir mais cedo»` → `«Pedi-lhe que viesse mais cedo»`: mete un
clítico dativo que no estaba, sustituye «para» por «que» y pasa el infinitivo a
imperfeito do conjuntivo. El alumno que escriba **«Pedi que ele viesse mais
cedo no dia seguinte»** ha resuelto EL punto — y el modelo le dirá que no.
El repair mínimo es ése, sin el «-lhe». *(Aparte de que el ítem no debería
publicarse como MAL: §6-S6.)*

Los otros seis MAL pasan la prueba limpiamente (01 gerundio→infinitivo, 02
presente→pretérito, 04 simples→composto, 09 posición del clítico, 11 em→a, 12
os→aos). ✓

**Riesgo colateral, para el otro revisor:** en GJ-04 el repair contiene
«**a trabalho**», que tiene 0 apariciones en el corpus y que en europeo suele
ser «em trabalho». Si es brasileirismo, el repair de un MAL no es una frase
plenamente correcta.

---

# 8 · LA PROGRESIÓN: ¿cierran los dos puntos?

**No como dice la tabla.** Tres problemas.

**8.1 · La tabla mide metadatos, no corpus.** `b11-regencias` no parte de 5 sino
de **10** (§6-S2). Tras el lote la lección `b11-l2` tendría 17 ítems, no 12.
`b11-aspecto-tempo` sí parte de 3 correctamente, pero esos 3 viven en **b8** con
`lessonId` de b8, mientras los nuevos irían a `b11-l4`: el punto queda partido
entre dos bloques y dos lecciones, y ningún recuento lo va a reflejar bien.
**Antes de generar por déficit hay que arreglar la tabla**, o la era nueva
empieza midiendo `concepts` faltantes en vez de contenido faltante.

**8.2 · Dos de los dieciséis no pertenecen al punto que se les cuenta**, y lo
dicen sus propias explicaciones:
- **GJ-09** → *«El error es de colocación, no de perífrasis»* — se cuenta a
  aspecto.
- **GJ-16** → *«La trampa aquí no es la preposición»* — se cuenta a regência.

Aporte real: aspecto **8**, regência **6**. Restando además lo que hay que
retirar por duplicado (01, 05, 06, 10, 15), quedan **6 de aspecto y 4 de
regência**. Los dos puntos **no cierran**.

**8.3 · Huecos obvios dentro de cada punto.**

*Regência* — las seis regências reales del lote son **todas la misma
dirección**: «el español no lleva preposición (o lleva otra) y el portugués
pide A/EM». Faltan las clases que de verdad separan un C1:
- la dirección **inversa** — el portugués va pelado donde el español pone
  preposición: **«namorar alguém»**, «pagar o táxi», «responder o email» vs
  «responder **a**»;
- **regência de nombre y de adjetivo**, que en el corpus no existe: «o acesso
  **a**», «a preferência **por**», «ansioso **por**», «capaz **de**»;
- los pares **donde la preposición cambia el significado**: «acabar **de** /
  acabar **por**», «dar **com** / dar **por**», «pegar **em** / pegar»;
- la **relativa que hereda la preposición**, que sólo tiene un ítem publicado
  (`gj-l4-14`) y es la trampa culta que la propia lección anuncia en sus
  objetivos.

*Aspecto* — el lote es **un ítem por bullet del `vocabKey` de la lección** (7
bullets, 7 ítems + 2). Consecuencia: no hay ni un solo ítem de **contraste
entre perífrasis**, que es donde está el C1. Falta:
- **«andar a» vs «estar a» vs «ficar a»** — las tres publicadas por separado,
  nunca enfrentadas;
- **composto vs simples con el marcador ambiguo** — sólo GJ-04 lo toca, y en la
  dirección fácil;
- **«ir a + infinitivo» de inminencia**, que la skill nombra expresamente como
  punto vivo;
- el **imperfeito de cortesía / «gostava que»**, que la propia skill lista en el
  canon de hipercorrección.

---

# 9 · LO QUE HAY QUE CAMBIAR SÍ O SÍ ANTES DE PUBLICAR

### Bloqueantes (sin esto no sale)

1. **Retirar GJ-10.** Es el *repair* textual de `b2c2-gj-l4-17`, publicado en el
   mismo bloque. Score 0,592.
2. **Retirar GJ-01.** Publicado dos veces (`b7-ep-07` y `b10/e6e74857`, este
   último con la respuesta en las opciones) y es A2/B1.
3. **Retirar o dar la vuelta a GJ-15.** Contradice al publicado
   `b2c2-gj-l4-16` («Disse-lhe **para vir mais cedo** amanhã» = BIEN) con ocho
   caracteres de diferencia. Barra de retirada: un MAL sobre construcción
   disputada no admite verdict inequívoco. Si se quiere el punto, va como BIEN.
4. **Retirar GJ-05** (duplica `b2c2-gj-l3-03`) **o** reescribirlo sobre otro
   punto — y en cualquier caso **arreglar la contradicción**: el publicado dice
   que el español SÍ tiene «he de»; éste dice que no.
5. **Rehacer GJ-06.** Casi-clon de `b2c2-gj-l9-07` (mismo «Fiquei a», mismo
   «ontem», mismo verdict, lote anterior). Cambiar auxiliar o adverbio no
   basta: hay que cambiar el ángulo del punto.
6. **Arreglar la longitud.** Las cinco frases de ≤7 palabras son las cinco MAL.
   **Poner coleta a los MAL cortos (01/02/04/11/12) o quitársela a los BIEN**,
   hasta que el mejor corte por longitud no pase de ~10/16. Es el atajo más
   fuerte del lote (13/16) y el doc no lo probó.
7. **Cortar las dos fugas F1 (03→16) y F2 (10→12).** Quitar «atractor» de la
   explicación de GJ-03; quitar de GJ-10 la generalización «el objeto pelado es
   brasileño» que resuelve GJ-12.
8. **Repairs mínimos en GJ-07 y GJ-15.** GJ-07 → «…mas ainda **vai demorar** um
   bocado» (sólo cae el plazo). GJ-15 → «Pedi **que ele viesse**…» (sin meter
   el «-lhe»).
9. **Rehacer GJ-12 con objeto no humano** — «obedecem **as** regras» → «**às**
   regras». Con objeto humano el español exige la *a* personal y empuja al
   ACIERTO: el calco que el ítem dice combatir no existe.
10. **Corregir el absoluto de GJ-01** («el gerundio sólo sobrevive en usos
    adverbiales»), desmentido por GJ-08 del propio lote. Si GJ-01 se retira,
    revisar que el absoluto no migre a la explicación de GJ-06.
11. **Rehacer las tres cifras de la sección «Verificación del molde»** con la
    definición correcta (acierto sobre los 16) y **añadir la longitud como
    cuarto atajo**. Pegar las salidas, no las conclusiones.

### Obligatorios pero menores

12. **Declarar `concepts` y metadata por ítem.** `address: tu` en 05, 06 y 13;
    en ningún otro. Sin esto, `revisarRegistro` va a marcarlos y el gate de
    virginidad de los lotes futuros volverá a ser ciego a estos ítems —
    exactamente lo que produjo S2.
13. **Pegar en el doc la corrida del gate** (`--nuevos`, umbral del código
    0,34) **y la banda por debajo del umbral**: `gj-l10-05 ↔ gj-l3-03` a 0,281
    y `gj-l10-08 ↔ b7/10c85d3c` a 0,320 no saltan y son duplicados de punto.
14. **Pegar la tabla de solape posicional contra los lotes previos.** Está bien
    (todo dentro de 2σ), pero la comprobación no aparece.
15. **Corregir la tabla de déficit**: `b11-regencias` parte de 10, no de 5. Y
    reasignar **GJ-09** (colocação, no aspecto) y **GJ-16** (colocação, no
    regência) — o aceptar que los puntos cierran a 8 y 6, no a 12 y 12.
16. **Declarar el escalado del molde de 20 a 16** y mover el último MAL a la
    posición 16 (con la ratio 8/8, el ítem 16 es gratis por conteo).
17. **Reponer los retirados con puntos vírgenes de verdad**, que los hay y son
    mejores: dirección inversa de la regência («namorar alguém», «pagar o
    táxi»), regência de nombre/adjetivo, «acabar de / acabar por», y para
    aspecto el contraste «andar a / estar a / ficar a» y «ir a + inf» de
    inminencia.

### Para el otro revisor (no es mi terreno, pero lo tropecé)

- **«a trabalho»** en el repair de GJ-04: 0 hits en el corpus; en europeo suele
  ser «em trabalho». Si es brasileirismo, el repair no es correcto.
- **«arquitecta»** en GJ-16: grafía pre-AO90. El corpus la usa igual
  (`b5/727eedd9`), así que es coherente — pero puede que las dos estén mal.
- **«pedir para + infinitivo»**: hace falta un veredicto sobre si es realmente
  no-europeo con sujeto distinto, dado que el propio corpus publica
  «Disse-lhe para vir» como BIEN.

---

# 10 · QUÉ ESTÁ BIEN (específico)

No todo es demolición, y esto conviene conservarlo:

- **La dieta léxica está impecable.** Los ocho MAL son 100 % portugués. Cero
  españolismos visibles, en un catálogo donde el lote 3 sacó 19/20 con ese
  atajo. Es el problema resuelto.
- **El molde formal se sostiene bajo verificación independiente**: 8/8, MMBM
  genuinamente virgen (comprobado reconstruyendo los arranques del corpus, no
  fiándome de la lista), rachas de 2, solape posicional con los nueve lotes
  previos dentro de 2σ, y **cero clones dentro del propio lote**.
- **GJ-04 es el mejor ítem del catálogo en mucho tiempo**: punto virgen,
  dirección inversa al calco (el español reparte «he viajado/viajé» de otra
  manera), glosa que sale rota, y un marcador durativo que hace el juicio
  decidible sin contexto externo.
- **GJ-09 es C1 limpio y virgen** (0 hits de `vir a + inf` en 2 431 ejercicios).
  Sólo hay que archivarlo donde le toca.
- **GJ-08 como contraejemplo está bien pensado**, y su «já **se** levanta» mete
  de tapadillo una próclise con atractor legítimo: eso es la casilla que
  «exige DISCRIMINAR, no corregir en bloque». Merece salir declarado en el doc,
  no de contrabando.
- **Que el lote salga de una tabla de déficit y no de la inspiración del autor
  es el cambio correcto.** El problema no es la era nueva: es que la tabla que
  la alimenta cuenta `concepts` declarados en vez de ítems, y eso produjo el
  clon de GJ-10. Arreglada la tabla, el mecanismo es bueno.
