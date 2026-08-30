# Informe R2 — lote 9 B2C2 (ángulo pedagógico-adversarial)

Revisor: linguista-adversarial-pt (rol adoptado íntegro). Documento revisado:
`docs/contenido/2026-08-29-lote9-b2c2.md` (NO PUBLICADO). Contrato leído entero:
`.claude/skills/lote-b2c2/SKILL.md`. Todo lo que digo que medí lleva el dato al lado.

**Recuento: 21 ERROR · 15 DISCUTIBLE.**

**El hallazgo más grave:** la rúbrica de MED-140 manda «corregir» *a gente vai* a
*vamos*, y el catálogo publica *a gente vai* como LA forma europea correcta en DOS
sitios (`b2c2-med-17` y `b10/3d979702`) — el lote suspendería una respuesta que el
propio curso enseña.

---

## 1 · Mediciones de atajos (acierto sobre los 10, ítem a ítem)

Las diez frases, con su longitud, para que todo lo demás se pueda auditar:

```
01 B  9  Deixa lá, não vale a pena chateares-te com isso.
02 M 11  Depois de tanto treino, foi um grande logro para a equipa.
03 B  7  Há que ter paciência com estas coisas.
04 B  8  Ela tirou o curso de Direito em Coimbra.
05 B  8  Estás enganado: não foi isso que eu disse.
06 M  9  Apanhei o autocarro das sete e cheguei muito pronto.
07 B 11  Fiquei a saber ontem que ela se mudou para o Porto.
08 M 12  Abre o grifo, faz favor, que a água já deve estar quente.
09 M 10  O meu irmão é tanto alto como o meu pai.
10 M  9  Perguntei para a professora se havia teste na sexta.
```

### (i) Palabra española/cognada visible → MAL — **7/10** (8/10 en lectura estricta)

Operacionalización: la frase contiene una palabra cuya FORMA lee un hispanohablante
como suya Y que aparece con el sentido español.

| ítem | ¿bandera? | predice | real | |
|---|---|---|---|---|
|01|no|B|B|✓|
|02|**logro**|M|M|✓|
|03|**«há que»** (fórmula)|M|B|✗|
|04|no («tirar» está usado a la portuguesa)|B|B|✓|
|05|no («enganado» ≠ «engañado» a la vista)|B|B|✓|
|06|**pronto**|M|M|✓|
|07|no|B|B|✓|
|08|**grifo**|M|M|✓|
|09|no|B|M|✗|
|10|no|B|M|✗|

**7/10.** Aviso: si el alumno sólo cuenta PALABRAS (no fórmulas), GJ-03 deja de
dispararla y el atajo sube a **8/10 — fuera de banda**. GJ-03 es lo único que lo
sostiene dentro; es un ítem que carga solo con la defensa de todo el eje.

### (ii) Fórmula/superficie europea → BIEN — **6/10**

Banderas (cualquier marca europea de superficie): 01 *Deixa lá / chatear-se*,
02 *equipa · treino*, 03 *há que* impersonal, 04 *tirar o curso*, 06 *apanhar o
autocarro*, 07 *ficar a saber · mudar-se para o Porto*, 08 *faz favor*.
Sin bandera: 05, 09, 10.
Aciertos: 01,03,04,07 (B) + 09,10 (M) = **6/10**. Falla en 02, 06, 08 (MAL con
marca) y en 05 (BIEN sin marca).

### (iii) Glosa cognada palabra-por-palabra → español natural = BIEN — **4/10**; **la INVERSA, 6/10**

| ítem | glosa | predice | real | |
|---|---|---|---|---|
|01|«Deja allá… enfadar-te-te» → **roto**|M|B|✗|
|02|«fue un gran logro para el equipo» → natural|B|M|✗|
|03|«Hay que tener paciencia con estas cosas» → natural|B|B|✓|
|04|«tiró el curso de Derecho» → **roto**|M|B|✗|
|05|«Estás engañado: no fue eso que yo dije» → natural|B|B|✓|
|06|«Cogí el autobús de las siete y llegué muy pronto» → natural|B|M|✗|
|07|«Quedé a saber ayer que ella se mudó» → **roto**|M|B|✗|
|08|«Abre el grifo, haz favor…» → natural|B|M|✗|
|09|«es tanto alto como mi padre» → **roto**|M|M|✓|
|10|«Pregunté para la profesora» → **roto**|M|M|✓|

Directo **4/10**, inverso («roto → BIEN») **6/10**. Los dos dentro de [3,7]. Es el
eje mejor construido del lote y merece decirse: es la única dieta que el lote 5
pidió y que aquí sí está.

### (iv) Bloque: b8 → BIEN, b11 → MAL — **7/10** (el conteo del autor es correcto)

b8: 01 B ✓, 03 B ✓, 07 B ✓, 09 M ✗. b11: 02 M ✓, 04 B ✗, 05 B ✗, 06 M ✓,
08 M ✓, 10 M ✓. Recalculado sobre los publicados, el lote 8 dio también 7/10, el
lote 6 dio 8/10 y el lote 7 dio 4/10 — la deuda es real y crónica, no de este lote.
Matiz operativo que el doc no dice: el atajo **sólo existe en el modo por lección**;
en `practicar/srs` las cartas se mezclan (`lessonId: "daily-review"`) y el bloque
deja de ser visible.

### (v) Registro declarado neutro → MAL — **7/10** (metadato) / **6/10** (proxy visible)

neutro: 02 M ✓, 03 B ✗, 04 B ✗, 06 M ✓, 09 M ✓, 10 M ✓ · informal: 01 B ✓,
05 B ✓, 07 B ✓, 08 M ✗ → **7/10**.
`register` **no se renderiza** (grep en `components/`+`app/`: sólo aparece como
etiqueta de `reformulate_register` en `MediationCard.tsx`), así que el atajo es un
soplo de DISEÑO, no una fuga de UI. El proxy que el alumno sí ve —«¿hay 2.ª persona
en la frase? → BIEN»— da **6/10** (01, 05 ✓; 08 ✗; 02, 06, 09, 10 ✓; 03, 04, 07 ✗).

### (vi) Marca temporal concreta → MAL — **6/10**

Marcas: 06 *das sete* (M), 07 *ontem* (B), 10 *na sexta* (M). Dos MAL y **un BIEN**:
la enfermedad del lote 5 (anclar sólo los MAL) está contenida. Aciertos: 06, 10 (M)
+ 01, 03, 04, 05 (B) = **6/10**. Bien hecho.

### (vii) Idiomatismo pintoresco → BIEN — **6/10** estricto, **7/10** generoso

Estricto (sólo modismo/colocación coloquial, no un mero europeísmo de deletreo):
banderas 01, 04, 06, 07, 08. Aciertos 01, 04, 07 (B) + 02, 09, 10 (M) = **6/10**.
El 7/10 del autor sale de contar 03 y 05 como «con sabor europeo»; con cualquiera
de las dos lecturas **el atajo está DENTRO de banda y no es la deuda del lote**.

**Con qué ítem se arregla, que es lo que pedía la nota (b):** el atajo sólo falla en
la dirección «sabor → MAL»; en la dirección BIEN acierta 5/5 porque **los cinco BIEN
llevan sabor y ningún MAL llano lo lleva**. Se corrige vistiendo un MAL llano.
Concretamente: **GJ-10**, cambiando la destinataria por un europeísmo sin equivalente
brasileño → «**Perguntei para o meu explicador se havia teste na sexta.**»
(*explicador* = profesor particular, PT-PT puro; BR dice *professor particular*). Eso
lo baja a 5/10.
**GJ-09 NO se puede vestir**: el vestuario natural de un marco *tanto/tão* es
«*tão giro*», «*montra*», y `b2c2-gj-l8-02` publica «**Que casaco tão giro!**» — le
regalarías al alumno la forma correcta. Déjalo desnudo.

### (viii) ATAJO NUEVO — cuantificador de grado visible → MAL: **8/10. FUERA DE BANDA.**

Regla: «¿hay *muito / tanto / tão / bastante* en la frase? → MAL».

| lleva cuantificador | verdict |
|---|---|
|02 «Depois de **tanto** treino»|M|
|06 «cheguei **muito** pronto»|M|
|09 «é **tanto** alto»|M|
|— ningún otro —| |

Precisión 3/3 sobre los MAL, 0/5 sobre los BIEN. Predice bien 02, 06, 09 (M) y 01,
03, 04, 05, 07 (B); falla sólo en 08 y 10. **8/10.**
Es exactamente la enfermedad que el contrato nombra: «si añades un rasgo por el bien
de los MAL —un adverbio temporal, un contexto, una longitud— tiene que aparecer
también en los BIEN».
**Y tiene causa documentada en el propio doc:** el BIEN retirado en preproducción era
«O casaco novo assenta-te **muito** bem» y su sustituto, «Ela tirou o curso de
Direito em Coimbra», no lleva cuantificador. La sustitución creó el atajo.
**Arreglo (8 → 6), dos palabras:** «Há que ter **muita** paciência com estas coisas»
(GJ-03) y «Estás **muito** enganado: não foi isso que eu disse» (GJ-05). Las dos son
europeo corriente y ninguna abre fuga hacia GJ-09 (cuantificador + sustantivo /
+ participio, no + adjetivo comparado).

### Atajos accesorios medidos (por completitud)

- **Longitud ≥10 palabras → MAL: 7/10.** Medias: BIEN 8,6 (9,7,8,8,11) · MAL 10,2
  (11,9,12,10,9). Señal débil pero del mismo signo que todas las demás.
- **Nombre propio en la frase → BIEN: 7/10.** Sólo 04 (*Direito, Coimbra*) y 07
  (*o Porto*) llevan topónimo, y los dos son BIEN.
- **Ensemble (voto de mayoría de i, iv, v, vii, nuevo): 8/10.** Éste es el problema
  real: seis atajos débiles apuntando todos en el mismo sentido se suman. Un alumno
  que combine dos o tres saca 8-9/10 sin decidir una sola cuestión de portugués.

**Resumen de banda:** dentro [3,7] → (ii) 6, (iii) 4/6, (vi) 6, (vii) 6-7.
Al límite → (i) 7, (iv) 7, (v) 7, longitud 7, nombre propio 7.
**Fuera → cuantificador 8, ensemble 8.**

---

## 2 · Secuencia y solapes — recalculados contra los JSON

Verificado leyendo `data.verdict` de los `b2c2-gj-*` en `b8.json`/`b10.json`/`b11.json`,
ordenados por id (no por la tabla del doc):

```
lote   secuencia (20 o 10)         primeros 10   solape con BMBBBMBMMM
l1     BMMBMBMMBMBBBMMMBMBB        BMMBMBMMBM    5
l2     BMBMMBBMMBMMBBBMMBMB        BMBMMBBMMB    6
l3     MBBMBMMBMBBMBMBBMBMM        MBBMBMMBMB    4
l4     MMBBMBMMBBMMBMBBMBMB        MMBBMBMMBB    4
l5     BBMMBMBBMMMBMBMMBBBM        BBMMBMBBMM    6
l6     BBBMMBMBMM                  (10)          4
l7     MMMBBBMBMB                  (10)          4
l8     BBMBMMBMMB                  (10)          6
media 4,875 (azar = 5,0; σ = 1,58) — ningún lote a más de 0,7σ
```

**La tabla del doc es exacta**, cifra a cifra. Ratio 5/5 ✓. Runs = [1,1,3,1,1,3],
máximo 3 ✓. Última MAL en la 10 ✓ (l7 y l8 la ponían en la 9 ✓; l6 también en la 10,
detalle que el doc no reclama). Independencia real, no complementariedad: el 2/20 a
3,6σ del lote 5 no se repite.

**Prefijo BMBB: inédito ✓.** Verificado: p `MBMM` · l1 `BMMB` · l2 `BMBM` ·
l3 `MBBM` · l4 `MMBB` · l5 `BBMM` · l6 `BBBM` · l7 `MMMB` · l8 `BBMB`.

**[DISCUTIBLE 1 — contra la skill, no contra el lote]** El contrato pide «arranque
DISTINTO» y lista seis 3-prefijos quemados, entre ellos **BMB**, que es el de este
lote (y el del l2). Pero tras l6 (`BBB`) y l7 (`MMM`) **los ocho 3-prefijos posibles
están quemados**: la regla es insatisfacible y el lote 8 (`BBM`) ya la incumplió. La
escalada del doc a prefijos de 4 es la única salida correcta — **hay que escribirla
en la skill**, o cada lote futuro nacerá «violando» una regla muerta.

---

## 3 · Clones estructurales a mano (el gate no los ve)

Coteje cada ítem nuevo contra los publicados de su clase por *género × dirección ×
tipos de dato × casillas*. Encontré **cuatro**, y el peor no está en las MED.

### [ERROR 1] GJ-01 es clon estructural de `b2c2-gj-l6-03` — y el gate da cero

| | `b2c2-gj-l6-03` (publicado) | GJ-01 (nuevo) |
|---|---|---|
|frase|«Dá-me jeito **vires** às três, se puderes.»|«Deixa lá, não vale a pena **chateares-te** com isso.»|
|verdict|BIEN|BIEN|
|bloque/lección|b8 · `b8-l1-conectores…`|b8 · `b8-l1-conectores…`|
|registro/address|informal · tu|informal · tu|
|receta|muletilla europea + infinitivo pessoal flexionado|muletilla europea + infinitivo pessoal flexionado|
|explicación|«…y el infinitivo pessoal «vires» **concordando contigo** sin conjunción»|«…con su infinitivo pessoal «chateares-te» **concordando contigo** tras «não vale a pena»»|

Mismo veredicto, mismo bloque, misma lección, mismo registro, mismo address, misma
receta didáctica y **la misma frase en la explicación**. Es la definición literal del
clon de E2#4 (med-53 ↔ med-38), en la mitad GJ. El gate de virginidad da ~0 porque
las palabras no coinciden.
Y hay un **segundo eje**: `b2c2-gj-l6-08` «**Vê lá** se te portas bem na festa»
(BIEN, b8-l1, informal·tu) ya publica la muletilla «V + *lá*» y su explicación dice
«fórmula europea coloquial». El grep del doc («*deixa lá*: 0 en bloques») buscó la
CADENA, no el PATRÓN — la regla del contrato es que el grep que absuelve tiene que
ser ancho.
**Qué hacer:** retirar GJ-01, o rehacerlo sin infinitivo pessoal y sin «V + lá».

### [ERROR 2] MED-129 es clon estructural de `b2c2-med-96` y del molde entero

Los cuatro `synthesise_sources` publicados (med-27, -37, -52, -96) comparten un molde
único: dos cuentos de Junqueiro, pt→pt, informal·tu, audience «um amigo teu,
português, que não leu nenhum dos dois», rúbrica de 5 casillas [A · B · contraste ·
lengua+rango+trato · n-grama ≤6], y modelo con bisagra «Repara na diferença:» /
«Vês a diferença?».
MED-129 conserva **todo** menos el registro: dos cuentos de Junqueiro (Chapelinho +
Branca de Neve, exactamente el mismo género que med-96, que empareja los dos cuentos
de hadas de Junqueiro), pt→pt, misma rúbrica casilla a casilla hasta el n-grama, y
la bisagra conjugada: «**O senhor repare na diferença** do desfecho:». Hasta el
cierre antitético es el de med-96:

- med-96: «Num conto o fogo consola e leva; no outro, funde os dois num só resto…»
- MED-129: «**Num conto** vence a vigilância; **no outro**, a sorte.»

El doc prohibió los andamios «Olha,…» y «Repara:…» y el modelo los esquiva por
flexión. **Qué hacer:** retirar MED-129 o rehacerla con otra operación (la única
perilla girada, el registro, no basta — el contrato ya avisó de que «reunión ≠ visita
de cliente» camufló el clon anterior).

### [ERROR 3] MED-139 tiene la rúbrica calcada de `med-102` / `med-58`

|casilla|med-102 / med-58 (publicados)|MED-139|
|---|---|---|
|1|«¿Cambia los **CUATRO de léxico**: X→**Y** ×4?»|«¿Cambia los **CUATRO de léxico**: ficheiro→**arquivo**…?»|
|2|«¿Resuelve «passadeira» / adapta X?»|«¿Resuelve «telemóvel» y «se puderes»…?»|
|3|«¿Adapta tratamiento y colocación a BR…?»|«¿Adapta tratamiento y colocación a BR («manda-me»→«me manda»)?»|
|4|«¿Coloquial brasileño operativo (**você/te, «pra/pro» al menos una vez**), entre N y M?»|«¿Coloquial brasileño verosímil (**você/te, «pra» al menos una vez**), entre 30 y 65?»|

Idéntica, con el paréntesis literal incluido. Sólo cambia el dominio léxico
(informática en vez de viaje/fiesta). **Qué hacer:** rehacer la rúbrica desde la
operación que el propio contrato elogia —DISCRIMINAR, no corregir en bloque—:
p. ej. «pasa *carrega no botão* a BR **y deja en paz** *email*, que en Brasil también
se dice así».

### [ERROR 4] MED-140 clona `med-101`

Misma dirección BR→PT, mismo género (recado coloquial de ocio), **mismo wordRange
30–65**, y la casilla 3 de MED-140 —«¿Pasa «*a gente vai*» y «*pra*» a formas
europeas (vamos, para)?»— es palabra por palabra la casilla 2 de med-101
—«¿Resuelve los coloquiales en forma europea («pra»→para, «sentamos»→sentámo-nos,
«**a gente combina**»→combinamos)?».

### Cotejo del resto (no son clones — lo digo para que conste el barrido)

- **MED-130 y MED-131** (`synthesise_sources` con fuentes DOCUMENTALES: dos avisos
  que se pisan / dos reseñas del mismo sábado) **no tienen precedente**: los cuatro
  publicados son literarios. Es la única ruptura real del molde en todo el lote.
- **MED-136** (informal→participação de casamento impresa): los dos publicados de esa
  dirección (med-02, med-14) producen *email formal*; el género de salida es nuevo.
- **MED-138**: **primer `reformulate_register` es→pt** del catálogo (los 12
  publicados son pt→pt). Ruptura real. *(Pero ver DISC 12.)*
- **MED-133 / MED-134 / MED-135** (`explain_concept`): los 11 publicados son
  anécdota/quadra/moraleja literaria; MED-134 (sistema de tratamiento a partir de un
  diálogo) es el primero **metalingüístico** — género nuevo y bien traído.
- **MED-137**: ver DISC 11 (eco de med-41 + med-56, no clon limpio).

---

## 4 · El pendiente: ¿rompe el menú MED o sólo las etiquetas?

**Los números del doc, recontados contra `b10.json` (128 MED publicadas):**

| | doc dice | real | |
|---|---|---|---|
|tipos publicados|relay 71 · summarise 19 · reformulate 12 · cross 11 · explain 11 · synthesise 4|idéntico|✓|
|direcciones publicadas|pt→es 74 · es→pt 24 · pt→pt 23 · pt-br→pt 4 · pt→pt-br 3|idéntico|✓|
|registros publicados|informal 94 · neutro 22 · formal 12|idéntico|✓|
|address publicados|(ninguno) 80 · tu 38 · voce_BR 3 · o_senhor 2 · V_Exa 2 · nome_cargo 2 · terceira 1|idéntico|✓|
|tipos del lote|synth 4 · explain 3 · reform 3 · cross 2 · relay 0 · summarise 0|idéntico|✓|
|direcciones del lote|pt→pt 5 · pt→es 3 · es→pt 2 · PT→BR 1 · BR→PT 1|idéntico|✓|
|**registros del lote**|**formal 4 · neutro 5 · informal 3**|**formal 3 · neutro 5 · informal 4**|**✗**|
|address del lote|o_senhor 2 · terceira 1|idéntico (+ tu 2, voce_BR 1)|✓|
|rangos synthesise|90-140, 40-75, 45-80, 80-130; ninguno repite 75-125|✓ (los publicados: 70-120, 75-125 ×3)|✓|

### [ERROR 5] El recuento de registros está mal

formal = **129, 133, 136 → 3**. informal = **131, 135, 139, 140 → 4**. Y por tanto
«el catálogo va 73 % informal; aquí 25 %» es **33 %**. Es la única cifra del doc que
no se sostiene, y es de las «pegadas» sin salida de comando — la falta exacta que el
contrato castiga desde el lote 6.

### Juicio: **rompe el MENÚ, no el MOLDE**

- **Rompe el menú, y de verdad.** Coge los cuatro tipos de la cola (synthesise 4/128
  = 3,1 %) y deja fuera los dos que copan 90 de 128. Post-lote: synthesise 8,
  explain 14, reformulate 15, cross 13. `terceira_sem_pronome` pasa de 1 a 2 usos y
  `o_senhor` de 2 a 4. Eso es exactamente lo que E2#5 pidió.
- **No rompe el molde.** De los 12 ítems, **cuatro reproducen casilla a casilla la
  plantilla publicada de su clase** (ERROR 2, 3, 4 y DISC 11). En `synthesise_sources`
  el lote entrega 2 ítems verdaderamente nuevos (130, 131) y 2 repintados (129, 132).
  Cambiar la etiqueta del tipo mientras se copia la rúbrica es cambiar el menú, no la
  cocina.

### Qué pierde el alumno sin relay ni summarise

Poco, y no lo que el autor teme. `relay` tiene 71 ítems publicados y `summarise` 19:
la cobertura está sobradísima. Lo que sí se pierde, y conviene decirlo:

1. **`summarise` es el único tipo con techo de compresión** (≤70 % de la fuente): es
   el que entrena SELECCIONAR bajo presupuesto. `synthesise_sources` se le parece
   pero se puntúa por CONTRASTAR dos fuentes, no por comprimir una — el lote no
   sustituye esa destreza, la esquiva.
2. **El lote se va al extremo largo.** 8 de 12 ítems piden ≥40 palabras y 5 piden
   ≥80; los publicados tienen mediana de fuente de 42 palabras. Un bloque `b10-l1`
   con cuatro síntesis de 5 casillas seguidas es una sesión pesada y homogénea. El
   tipo que este lote infra-sirve no es `relay`: es **el ítem corto**.

Recomendación: dejar la composición invertida (es correcta) y meter **una**
`summarise` corta para no romper el ritmo, o bajar dos rangos.

---

## 5 · Nivel y rúbricas

### ¿Algún GJ se resuelve sin portugués?

**Sí: GJ-09.** «O meu irmão é **tanto** alto como o meu pai.» El español distingue
igual (*tan alto* / *tanto dinero*), y la propia explicación lo admite: «aquí no te
traiciona tu lengua: te traiciona la prisa». Un hispanohablante lo resuelve por
transferencia pura de L1. No es C1, es un ítem de atención.
**[DISCUTIBLE 2]** No lo retiraría, pero cuenta a medias al declarar dieta mixta: los
MAL «con todas las palabras portuguesas» que exigen SABER portugués europeo son
**dos** (06 *pronto*, 10 *perguntar para*), no tres.

**Y una MED se resuelve sin leer una palabra de portugués: MED-129.**
**[ERROR 6]** Caperucita y Blancanieves. Las cinco casillas —lobo que se traga a la
abuela y se pone su ropa; diálogo orejas/ojos/brazos/boca; tres disfraces con collar,
peine y manzana; cazador que abre al lobo; el tropezón que salva a Blancanieves— son
**todas** de la versión canónica que cualquier hispanohablante conoce de niño. La
fuente de 2.628 palabras es decorado.
**Qué hacer:** colgar la rúbrica de lo que sólo está en ESTA versión — el lobo le
señala plantas **venenosas** ([15]), la abuela le manda buscar la llave **debajo de
la puerta** ([20]), los enanos son «**sete mineiros pequeninos**» con linterna ([13]),
el primer atentado es un **estrangulamiento** con el collar ([32] «a rainha
estrangulou-a»), y el tercer disfraz es de **camponeza** ([48]), no de vendedora.

### ¿Rúbricas binarias y autoevaluables?

Mayoritariamente sí. Cuatro no lo son:

- **[DISCUTIBLE 3] MED-130 casilla 3.** «¿Señala el CHOQUE (a las 9 el garaje estaría
  a la vez vacío por la limpieza y lleno de gente por la reunión)?» El aviso dice
  «Os automóveis devem ser retirados» — saca COCHES, no personas. Reunirse en un
  garaje sin coches no contradice nada; es incómodo, no contradictorio. La casilla es
  binaria y suspende al alumno que tenga razón. **Arreglo de una línea:** que el
  primer aviso diga «a garagem estará **encerrada** / sem acesso nesse período».
- **[DISCUTIBLE 4] MED-136 casilla 2.** «¿Conserva la confirmación con su plazo
  INCLUSIVO (hasta finales de julio)?» «Até ao fim de julho» no es una fecha: no hay
  inclusividad que conservar. La casilla está copiada de donde sí aplica (med-100,
  MED-138) y aquí no significa nada.
- **[ERROR 7] MED-140 casilla 1.** Anuncia «los CUATRO de léxico» y sólo hay **tres**:
  *maiô→fato de banho*, *bermuda→calções*, *orla→marginal*. El cuarto,
  «chinelo→**chinelos** (o «havaianas» → chinelos)», es falso por partida doble:
  *chinelo* es palabra portuguesa europea idéntica (Priberam) —lo que cambia es el
  NÚMERO, no el léxico— y «havaianas» **no aparece en la fuente**. El alumno que
  escriba «um chinelo» no ha cometido ningún brasileñismo léxico.
- **MED-134 casilla 2** — pide afirmar algo que el diálogo no sostiene: ver **ERROR 17** en §7.

### wordRange vs mínimo cumplidor (regla MED-28) — los cuatro `synthesise`

Corrección previa: no llevan 5 casillas los cuatro. **129 y 132 llevan 5; 130 y 131
llevan 4.** Redacté el mínimo cumplidor de cada uno (telegráfico, sin conectores) y
lo conté:

| ítem | rango | mínimo cumplidor | margen | |
|---|---|---|---|---|
|MED-129|90–140|**111**|29|✓|
|MED-130|40–75|**47**|28|✓|
|MED-131|45–80|**47**|33|✓|
|MED-132|80–130|**127**|**3**|**✗**|

**[DISCUTIBLE 5] MED-132 incumple MED-28.** Sus cinco casillas piden: dos
comerciantes + avellana con hilo + el desorden en **cinco** sitios (adega, cozinha,
celeiro, estribaria, livros) + la moraleja escrita + **el doble agradecimiento** +
Korriscosso poeta-camarero + Fanny + el policeman mantenido a copitas + el griego +
lo común. Mi mínimo, ya telegráfico, mide 127/130. Cualquier alumno que escriba con
conectores se pasa. **Qué hacer:** subir a 80–150 o quitar el doble agradecimiento y
reducir «cinco sitios» a «al menos dos».

### Cuatro modelos contra SUS casillas, una por vez, por escrito

**MED-129 — INCUMPLE 2 de 5. [ERROR 8]**
- c1 (disfraz del lobo + diálogo de orejas/ojos/brazos/boca) → «o lobo engole a avó,
  veste-lhe a roupa e mete-se na cama — e o disfarce só cai no diálogo das orelhas,
  dos olhos, dos braços e da boca» ✓
- c2 (tres disfraces **y que las dos primeras las deshacen los enanos**) → «a rainha
  disfarça-se de vendedeira três vezes: colar, pente e maçã». **Los enanos no
  aparecen. ✗**
- c3 (cazador saca vivas a la niña **y a la abuela** · el lobo **muere** por las
  piedras · el azar salva a Blancanieves · **la reina muere de miedo**) → «a menina do
  chapelinho é salva por um caçador, que abre o lobo e lhe cose pedras na barriga; a
  Branca deve a vida ao acaso — um tropeção faz-lhe sair o pedaço de maçã».
  **Faltan tres de los cuatro elementos**: la abuela viva ([35] «A avó saiu também
  contentissima por ver outra vez a luz do dia»), la muerte del lobo ([37] «com o
  peso, caiu no lago, e affogou-se») y la muerte de la reina ([68] «teve tal medo…
  que morreu de repente»). **✗**
- c4 (portugués, 90–140, «o senhor», sin tuteo) → 117 palabras, «O senhor repare» ✓
- c5 (≤6 palabras seguidas) → verificado por script con normalización ortográfica
  antigua: 0 coincidencias de 7-gramas ✓
**Qué hacer:** cabe reescribir dentro del rango (117/140 deja 23 palabras).

**MED-136 — INCUMPLE 1 de 4. [ERROR 9]**
- c1 pide «los novios (o novio e Inês)». El modelo empieza «**Têm** o prazer de
  convidar para o seu casamento…»: **no nombra a nadie**, y además arranca con un
  verbo en 3.ª plural **sin sujeto** — una participación real dice «O João e a Inês
  têm o prazer de convidar…». **✗** (y el modelo mide 71/95: caben los nombres).
- c2 (plazo + alojamiento) ✓ · c3 (elimina «Malta!», «a gente trata») ✓ ·
  c4 (55–95, sin tuteo) ✓ 71 palabras.

**MED-139 — INCUMPLE 1 de 4. [ERROR 10]**
- c1 (cuatro pares) ✓ · c2 (telemóvel→celular, se puderes) ✓ · c3 («manda-me»→«me
  manda») ✓
- c4: «¿Coloquial brasileño verosímil (**você/te, «pra» al menos una vez**), entre 30
  y 65?» El modelo tiene 32 palabras, **un** *você*, **cero** *pra* y **cero** *te*.
  Los dos publicados del mismo molde sí cumplen (med-58: «pro lanche», «pras
  crianças»; med-102: «pro casamento», «pros pedágios», «pra você»). **✗**
  **Arreglo:** «…aperta o botão verde da tela **pra** desligar antes de sair».

**MED-132 — INCUMPLE 2 de 5 (a la letra). [ERROR 11]**
- c1 pide el desorden en cinco sitios; el modelo da tres («a adega vazia, o celeiro
  roubado, os livros mal escriturados»). **✗ a la letra**
- c2 pide la moraleja **y** que «el hombre agradece dos veces, el consejo y la
  delicadeza»: el modelo sólo da la moraleja. **✗**
- c3 (Korriscosso) ✓ pero con contenido fuera del recorte — ver ERROR 12.
- c4 (lo común) ✓ · c5 (80–130 y ≤6 palabras) → 119 palabras ✓, 7-gramas 0 ✓

**Los ocho modelos restantes** caen todos dentro de su rango (medido):
130 = 75/40-75 (justo en el techo), 131 = 69/45-80, 133 = 77/45-85, 134 = 75/50-90,
135 = 78/45-80, 137 = 51/40-75, 138 = 57/40-75, 140 = 35/30-65.

---

## 6 · Fugas

### [ERROR 12] MED-132 pide en la rúbrica lo que su recorte no contiene

c3: «¿Recoge a Korriscosso: **poeta que sirve mesas**, enamorado de Fanny…?» El
recorte declarado es `um-poeta-lirico` **[55]–[59]**. Que sirve mesas está en
[46]–[52], fuera. El modelo lo dice igualmente («Korriscosso é poeta e **serve mesas**
em Londres»): contenido importado de fuera de la fuente declarada — la familia de
«el castillo inventado». **Qué hacer:** ampliar a [45]–[59] (y entonces choca con
MED-135) o borrar «que sirve mesas» de la casilla y del modelo.

### [ERROR 13] MED-132 y MED-133 se regalan la respuesta, dentro del mismo lote y de la misma lección

- MED-132: «…descobre a desordem: **a adega vazia**, o celeiro roubado, **os livros
  mal escriturados**.»
- MED-133: «…é nesse percurso que descobre **a adega vazia e os livros mal
  escriturados**.»

Misma fuente (`junqueiro-o-talisman`, y **[5]–[7] ⊂ [0]–[7]**: el recorte de 133 está
contenido en el de 132), mismo hallazgo, casi las mismas palabras, mismo bloque y
misma lección `b10-l1`. La nota (j) declara el ruido «avelã/talismã» como si fuera
léxico; es una fuga de contenido. **Qué hacer:** una de las dos cambia de fuente.

### [ERROR 14] MED-133: el recorte [5]–[7] no sostiene ni su rúbrica ni su modelo

- c2 y modelo: «percorre a casa toda, **todos os dias**». En el recorte hay **una sola
  vez** ([6] «começou a correr toda a casa com o talisman»); «ando assim com elle
  **todo o dia** por toda a casa» está en **[2]**, fuera.
- [5] abre «Quando ao outro dia foi procurar **o seu** generoso concorrente…» — sin
  antecedente: quién va, y de quién es «seu», no se contesta desde dentro. Es la
  regla «el recorte tiene que sostenerse solo».
**Qué hacer:** declarar `[0]–[7]` (el cuento entero son **364 palabras**, medidas) —
no hay razón para recortar 8 párrafos.

### [DISCUTIBLE 6] MED-135: el recorte abre con una anáfora hacia fuera

[47] empieza «**Mas** o que **o** tortura é o contacto constante com o alimento». El
«mas» remite a [46] («Não é a dependência que o aflige»), que queda fuera, y el «o»
no se resuelve hasta [49]. Se sostiene a medias. *(Los dos recortes de
`um-poeta-lirico` —[47]–[52] y [55]–[59]— efectivamente **no se solapan**: la nota
(i) tiene razón en eso.)*

### GJ-03 y «há que» — verificado, y con un problema distinto del que temía el autor

Barrido de TODOS los bloques: la única glosa que hablaba de «há que» es
`b3/6b47a59b`, y **ya está corregida** (`variantVerificacion: "corregido según
revisión manual E2#5 2026-08-29 (informe-cola3-manual)"`): hoy dice «'Hay que' =
'há que' (**corriente en PT-PT**) o 'é preciso / é necessário'» y acepta «Há que
poupar dinheiro». **Ningún publicado contradice a GJ-03. ✓** Nota (d) cerrada.

Pero:

**[ERROR 15] La prueba de corpus de GJ-03 es falsa.** La explicación dice: «el corpus
del curso lo trae con naturalidad («não havia que duvidar», «não havia que
philosophar»)». Leídas enteras, las dos son la **existencial negativa**, no la
deóntica:
- Os Maias c13: «…e ella de lá, com aquelle ar de lambisgoia… **Não havia que
  duvidar, era um namoro**» = *no había NADA que dudar*.
- Padre Amaro c23: «mas emfim **não havia que philosophar: era partir para Poyaes**»
  = *no había NADA que filosofar*.
Barrido completo de la Biblioteca (`h(á|avia|ouve|averá) que + infinitivo`): **5
ocurrencias, 4 negativas**, y la única afirmativa —Os Maias c06, «quando **ha que
cosinhar**, sabe cosinhar»— también es existencial. Lo mismo «**Ha que lêr, ha que
lêr**» (A Cidade e as Serras c02): Jacinto mirando su biblioteca, *hay [cosas] que
leer*. **Atestaciones de «há que» deóntico afirmativo en el corpus: cero.**
El ítem SOBREVIVE (la construcción es europea legítima y el propio catálogo lo dice),
pero es el mecanismo exacto del «todo o que» y del «eram as duas» del lote 5: «un
grep da candidatos, no veredictos». **Qué hacer:** cambiar la prueba — citar
Ciberdúvidas y/o el propio `b3/6b47a59b`, y borrar las dos citas del corpus.

**[DISCUTIBLE 7]** Y por lo mismo, GJ-03 no es un punto virgen: `b3/6b47a59b` ya
enseña «há que» en el bloque 3, que todo alumno cruza mucho antes de b8. Es
reenseñanza legítima, pero el contrato exige declararla, y `concepts` debería llevar
`b3-existenciais` además de `b8-conectores`.

### Otras fugas contra publicados (el gate no las ve)

- **[DISCUTIBLE 8] GJ-04 repite el PUNTO de `b2c2-gj-l2-06`.** Publicado (BIEN): «Vou
  tirar uma fotografia» — «Las fotos en portugués se TIRAN: … El 'sacar una foto' del
  español no se traslada». GJ-04 (BIEN): «Ela tirou o curso…» — ««tirar» le suena a
  sacar o a quitar». Mismo punto (colocaciones de *tirar* donde el español pone
  *sacar*), misma dirección, mismo veredicto. IDF bajo en «tirar», así que el gate
  calla. De propina, repite el decorado «Coimbra» de `l7-10` (también BIEN).
- **[DISCUTIBLE 9] GJ-10: el punto no es virgen.** `b2c2-gj-l1-06` (BIEN) es «Vou
  **perguntar-lhe** se pode ajudar», con explicación «la ênclise 'perguntar-lhe' es la
  colocación europea» — es decir, el dativo de *perguntar* ya está publicado como
  BIEN. Súmese `l1-07` («Pedi-lhe uma pergunta») y `l1-16` («Perguntou-me que hora
  era»): GJ-10 es el **cuarto** ítem anclado en *perguntar*. El doc buscó la cadena
  «perguntar para», no el lema+punto. Declarar la familia.
- MDX: barrido de `lib/data/languages/pt/mdx/` por *logro, grifo, torneira, tirar o
  curso, ficar a saber, deixa lá, enganado, tanto/tão, perguntar a, equipa*: **cero
  coincidencias** en los tres MDX de b11 y en los cuatro de b8. Ninguna lección regala
  ninguna respuesta del lote. ✓ Único roce: `b5/l1-futuro-presente.mdx` glosa «**em
  breve** — pronto, dentro de poco», que no contradice a GJ-06 (habla del *pronto*
  español, no del portugués).

---

## 7 · Los ERROR y DISCUTIBLE que faltan por listar

### [ERROR 16] MED-140: la rúbrica condena portugués europeo vivo — contra DOS publicados

Cita: «¿Pasa «**a gente vai**» y «pra» a formas europeas (**vamos**, para)?»

- `b2c2-med-17` (publicado, casilla 1): «'Encontramo-nos' o '**a gente encontra-se**'
  (lo brasileño era la próclise 'se encontra' — **'a gente' con el verbo detrás es
  europeo vivo**)».
- `b10/3d979702` (publicado, error_correction): frase mala «A gente **vamos** ao
  cinema hoje à noite» → **correcta «A gente vai ao cinema hoje à noite»**, explicación
  «'a gente' (= nosotros, informal) lleva el verbo en 3ª persona singular: '**a gente
  vai**'».

O sea: el catálogo publica *a gente vai* como LA forma correcta y la rúbrica nueva
manda cambiarla. Un alumno que la deje en paz —lo correcto— pierde la casilla. Es
literalmente el aviso del contrato («cuidado con condenar europeo vivo en la
rúbrica») repetido en el mismo bloque donde ya se pagó. **Qué hacer:** dejar «a gente
vai», y mover la casilla a lo que sí es BR: «*pra*»→*para* y, si se quiere,
«*direto*»→*direitos/diretamente*.

### [ERROR 17] MED-138: el modelo desplaza el límite de edad y mete un falso amigo

Fuente: «Podrán participar **los menores de dieciséis años** empadronados en el
municipio». Modelo: «podem concorrer os miúdos **até aos 16 anos** que estejam
**recenseados** no concelho».
1. *até aos 16 anos* incluye a los de 16; *menores de 16* son 15 y menos. La casilla 1
   pide «menores de 16»: el modelo falla su propia casilla, y falla justo en el eje
   —la inclusividad de los límites— que el lote convierte en casilla dos veces.
   → «podem concorrer os miúdos **com menos de 16 anos**».
2. *estar recenseado* en Portugal es el **recenseamento eleitoral**: nadie de 15 años
   está recenseado. «Empadronado» no tiene equivalente portugués porque Portugal no
   tiene padrón municipal. Un falso amigo en el modelo de un curso anti-falsos-amigos.
   → «que **morem no concelho**» / «**residentes** no concelho».

### [ERROR 18] MED-134: el diálogo no demuestra los tres niveles que la rúbrica exige «A LA LETRA»

Casilla 2: «¿Explica el nivel intermedio **A LA LETRA del diálogo**: «Vai levar…» sin
pronombre — la tercera persona sola…?»
En el diálogo, **el mismo vendedor** dice «**O senhor** deseja?» y, tres líneas
después, «**Vai levar** a azul ou a branca?» **al mismo cliente**. Eso no es un nivel
intermedio: es la elipsis normal del pronombre dentro del **mismo** trato deferente —
nadie repite «o senhor» en cada frase. El nivel genuinamente intermedio (3.ª sin
pronombre a alguien a quien NO se trata de «o senhor») exige otro interlocutor.
La casilla pide afirmar algo que el texto no sostiene, y la casilla 3 pide avisar
sobre «**você**», que **no aparece en el diálogo**.
**Qué hacer:** que «Vai levar…» se lo diga a una tercera persona a la que nunca llamó
«o senhor» (p. ej. una clienta de mediana edad que entra después), o retirar la
pretensión de «tres niveles» y quedarse en dos.

### [ERROR 19] GJ-07 declara `address: tu` sin ni una marca de segunda persona

«Fiquei a saber ontem que ela se mudou para o Porto.» — 1.ª persona y 3.ª persona,
nada más. Es la infracción que el contrato levanta del lote 5 palabra por palabra
(«address SÓLO donde hay tratamiento en la frase… la v1 del lote 5 lo declaró en
20/20 incluyendo frases sin ni una marca de segunda persona — eso rompe la convención
y ensucia `revisarRegistro`»). **Qué hacer:** quitar `address` y bajar `register` a
`neutro` (nada en la frase es informal).

### [ERROR 20] GJ-08 NO declara `address: tu` teniéndolo

«**Abre** o grifo, faz favor…» — imperativo de 2.ª singular. Por la misma regla, hay
que declararlo. (Los otros ocho están bien: 01 *chateares-te* → tu ✓, 05 *Estás* →
tu ✓, y 02/03/04/06/09/10 sin 2.ª persona y sin `address` ✓.)

### [ERROR 21] `concepts` mal declarados en tres ítems de b8 — así se ciega el segundo eje del gate

- GJ-01 (muletilla + infinitivo pessoal + clítico) → declara `[b8-conectores]`: **no
  hay ningún conector en la frase**. Debería ser `[b8-colocacao-pronominal]` — que es
  justamente el concepto de `l6-03`, el clon del ERROR 1. **Con el concepto correcto,
  el gate lo habría visto.**
- GJ-03 («há que», impersonal de *haver*) → `[b8-conectores]`. Debería llevar
  `b3-existenciais`.
- GJ-09 (comparativa de igualdad) → `[b8-conectores]`.
El contrato es explícito: «Declara `concepts` en cada ítem nuevo. Es el segundo eje
del gate: compara el PUNTO, no las palabras.» Declararlo mal es peor que no
declararlo.

### DISCUTIBLES restantes

**[DISCUTIBLE 10] GJ-06: la explicación da la acepción más rara de «pronto» y calla la
de todos los días.** «"Pronto" como adverbio en portugués significa 'rápidamente'…
**nunca** 'temprano'.» El sentido vivo de *pronto* en Portugal es *listo / terminado*,
y es el que el alumno va a oír («Está pronto!»); el corpus lo confirma y no trae ni un
solo adverbial: 4 ocurrencias, todas en *Singularidades de uma rapariga loura*, dos
interjectivas («--**Pronto!**--disse Macário») y dos adjetivas («Tem-no **pronto**
àmanhã», «temos o anel **pronto**»). Además «**nunca**» es un absoluto, y los
absolutos han caído catorce veces en este proyecto. **Qué hacer:** añadir la acepción
viva y cambiar el absoluto por «y para 'temprano', **cedo**».

**[DISCUTIBLE 11] MED-137 comparte molde con med-41 y med-56, y refuerza el dominio
más saturado del catálogo.** med-41: «Exmos. Senhores Condóminos… **sob pena de**
danificação» → WhatsApp. MED-137: «Cláusula 8.ª — O arrendatário obriga-se… **sob
pena de** responsabilidade…» → llano. Mismo género (aviso jurídico de vivienda con
«sob pena de»), misma dirección, misma operación; la perilla girada es el `address`.
Y med-56 ya hace «documento técnico ilegible → explicación llana a una señora mayor».
Dominio: el condominio/arrendamiento ancla ya med-31, -41, -55, -99, -100; el lote le
añade DOS más (130 y 137), en un lote que se presenta como ruptura. *(No lo llamo
clon porque `terceira_sem_pronome` tiene 1 solo uso publicado y practicarlo vale la
pena; pero cambia la fuente de dominio.)*

**[DISCUTIBLE 12] Andamios que el script anti-andamio no vio.** Se prohibió «Olha,…»
y «Repara:…». Pasaron:
- «**São dois** textos sobre…» (MED-132) ↔ med-96 «**São dois** contos que acabam no
  lume» — y med-52 «Olha, **são duas** histórias sobre maneiras de dar».
- «**Pessoal, [tema]:**…» (MED-138) ↔ med-41 «**Pessoal, aviso do condomínio:**».
- «**Num conto** X; **no outro**, Y» (MED-129) ↔ med-96 (§3).
**Qué hacer:** ampliar el script a los arranques «São dois/duas…», «Pessoal,» y a la
bisagra «Repar-» en cualquier flexión.

**[DISCUTIBLE 13] MED-129 sería el `synthesise_sources` más largo del catálogo por
2,4×.** 861 + 1.767 = **2.628 palabras** de fuente (contadas por script sobre los JSON)
para producir 90–140. Los cuatro publicados guardan **266, 533, 812 y 1.078** palabras
de `sourceText`, aun cuando su doc decía «íntegro». Y `MediationCard.tsx` la muestra
en un `blockquote` con `max-h-64 overflow-y-auto`.

**[DISCUTIBLE 14] Infidelidades menores a la fuente** (la familia «las espigas en
monedas»):
- MED-129 c2 y modelo: «vendedeira **três vezes**». El tercer disfraz es de
  **camponeza** ([48] «Vestiu-se de camponeza com um cesto de maçãs»).
- MED-129 modelo: «No **Chapelinho Vermelho**…». El texto se llama «o chapellinho
  **encarnado**» y el cuento, en Portugal, «O **Capuchinho** Vermelho». «Chapelinho
  Vermelho» no es ninguno de los dos y roza el brasileño «Chapeuzinho». En un
  comentario para un profesor de literatura.
- MED-132 modelo: «o **celeiro roubado**». Lo robado de las manjadouras es el feno y
  la aveia, en la **estribaria**; en el celeiro faltaban milho, trigo e feijão ([6]).
- MED-135: «una **voz gorda** grita» calca «**grossa** voz faminta» ([49]) — *grossa*
  es *gruesa/vozarrón*, no *gorda*. Calco en el modelo (y en la casilla 3) de un curso
  anti-calco.

**[DISCUTIBLE 15] Detalles de lengua y procedencia:**
- MED-133 «**Cito-o ao senhor** porque…» es ambiguo (¿cito el talismán o cito a
  usted?) y forzado; «Falo-lhe nisto porque…» sale solo.
- GJ-08 usa «**faz favor**» mientras el publicado `l4-09` usa «**Se** faz favor» y su
  explicación lo llama «**LA** fórmula europea de cortesía». Dos modelos de la misma
  fórmula en el mismo catálogo. *(Y este proyecto ya se quemó una vez con «Faz
  favor!».)*
- GJ-01: la atestación citada no licencia la frase. El doc cita «--**Deixe lá**, padre
  Natario, deixe lá!» (3.ª deferente) para un ítem que es «**Deixa lá**» de tú.
  Recuento real en la Biblioteca: 24 de la familia, de los cuales **«deixa lá» ×9** —
  y hay dos que licencian exactamente la frase: «**Deixa lá!** Isso vem depois»
  (Padre Amaro c10) y «**Deixa lá** a opereta, rapaz» (Os Maias c18). El doc declara
  «×15», que no coincide con ninguno de mis conteos.
- GJ-02 no cita atestación para su repair y la tiene: «Tiveram entretanto bom e
  prompto **exito** as diligencias» (Amor de Perdição c09) y «no bom **exito** da
  tentativa» (Novelas do Minho). *(Y el sustantivo «logro» sólo aparece una vez en
  toda la Biblioteca, con el sentido de engaño — verificado; el verdict aguanta.)*
- MED-139: «o rato ficou a piscar a noite toda» va pegado con calzador para colocar el
  cuarto par léxico. «Nada de frases fabricadas al revés para forzar el léxico meta».
- El bloque «Recuentos y gates (SALIDA PEGADA)» está **vacío**: «(pendiente…)». El
  contrato manda correr los dos gates de máquina **antes** de gastar revisor.

---

## 8 · Respuestas a las notas del autor

**(a) «Los sustitutos llegaron tarde: mírenlos con más saña.»**
Tenía razón en el instinto y se equivocó de sospechoso. **GJ-04** (sustituto) repite
el punto de `l2-06` (*tirar* con colocación que el español hace con *sacar*) — DISC 8.
Y **la sustitución creó el atajo del cuantificador (8/10)**: el retirado llevaba
«assenta-te **muito** bem» y el entrante no lleva ninguno. Pero el clon grave del lote
**no es un sustituto**: es **GJ-01**, que nadie tocó (ERROR 1).

**(b) «GJ-09 y GJ-10 alimentan el atajo pintoresco. Si les sale >7/10, díganme cuál
vestir.»**
Me sale **6/10** estricto, 7/10 generoso: **dentro de banda**. No es la deuda del
lote. Si aun así quiere bajarlo: **vista GJ-10** («Perguntei para o meu **explicador**
se havia teste na sexta») → 5/10. **No vista GJ-09**: el vestuario natural de un marco
*tanto/tão* es «tão giro / montra», y `l8-02` publica «**Que casaco tão giro!**» —
regalaría la respuesta.

**(c) «"Perguntar para": ¿el hedge «brasileño coloquial» basta, o cae como «todo o
mundo»?»**
**Basta, y no cae** — por una razón distinta de la que usted plantea. «Todo o mundo»
cayó porque hay **22 atestaciones europeas con el sentido condenado**. Aquí el barrido
del corpus da **cero** usos europeos de *perguntar para* como regência de
destinatario, y el catálogo ya publica el dativo como BIEN (`l1-06` «Vou
perguntar-lhe»). La barra de retirada es «atestación de USO o de DICCIONARIO con el
sentido condenado»: no la hay.
**La respuesta NO difiere de `l8-08` («chamar-lhe de»), y por eso es coherente**: los
dos son brasileñismos de regência, los dos llevan hedge («la gramática de referencia
aún registra esa variante» / «es brasileño coloquial»), los dos tienen corpus europeo
a cero. Lo que sí le pediría es que la adyacencia que usted mismo declara —dos lotes
seguidos con brasileñismo de regência— se cierre en el lote 10, y que declare la
familia *perguntar* (DISC 9).

**(d) «Verifiquen que la glosa corregida en la cola 3 ya no lo contradice.»**
**Verificado y limpio.** `b3/6b47a59b` hoy dice «'Hay que' = 'há que' (corriente en
PT-PT)» y acepta «Há que poupar dinheiro»; su sello es «corregido según revisión
manual E2#5 2026-08-29». Barrido de los once bloques por *há que / hay que*: ningún
otro publicado dice que se evite. **Pero** su prueba de corpus es falsa (ERROR 15) y
el punto no es virgen (DISC 7).

**(e) «Los conteos de atajos son míos y los mido mal. Midan los seis.»**
Medidos los seis, más dos accesorios, más uno nuevo: §1. Sus dos cifras declaradas
—bloque 7/10 y pintoresco 7/10— son **correctas** (la de bloque la recalculé también
para l6=8, l7=4, l8=7). La banda se rompe donde usted no miró: **cuantificador de
grado, 8/10**, y el ensemble de cinco atajos, 8/10.

**(f) «¿La composición se sostiene o el lote pierde el tipo que más practica el
alumno?»**
Se sostiene, y no pierde nada: `relay` tiene 71 publicados y `summarise` 19. Lo que
pierde es más fino: `summarise` es el único tipo con techo de compresión, y
`synthesise_sources` no lo sustituye porque se puntúa por contrastar, no por
comprimir. Y el lote se va entero al formato largo (5 ítems de ≥80 palabras). Mi
recomendación en §4: mantenga la inversión y meta un ítem corto.

**(g) «MED-130 y MED-131 con fuentes DOCUMENTALES: ¿es el mejor hallazgo del lote?»**
**Sí, y es lo único que rompe el molde de verdad.** Los cuatro `synthesise_sources`
publicados son literarios y comparten una plantilla idéntica; 130 y 131 son la
operación real de mediación por síntesis (dos papeles que se pisan / dos reseñas del
mismo servicio) y no se parecen a nada publicado. Que 129 y 132 sean el molde viejo
repintado (ERROR 2, DISC de §3) no le quita mérito a 130/131 — al contrario, marca
dónde debería ir el lote 10. Un pero: MED-130 apoya su casilla clave en un choque que
no es lógico (DISC 3) — arréglelo, porque es el mejor ítem del lote y ahora mismo
suspende al alumno que razone bien.

**(h) «MED-140 reusa sorvete→gelado y ônibus→autocarro como andamio: ¿reenseñanza o
dilución?»**
Reenseñanza legítima **si el resto es nuevo — y no lo es**: el cuarto par nuevo no
existe (ERROR 7). Con «chinelo» fuera, la cuenta real es **3 pares nuevos + 2
reenseñados**, no «4 + 2». Con la mitad de las operaciones léxicas recicladas y la
rúbrica clonada de med-101 (ERROR 4), esto **diluye**. Arreglo: quite «chinelo» y meta
un par virgen del mismo campo — BR *isopor* → PT **geleira / esferovite** funciona y
no tiene precedente en b10 (verifíquelo en Priberam antes).

**(i) «MED-132 recorta [55]–[59] y MED-135 [47]–[52] del mismo texto: ¿se pisan? ¿Se
sostienen solos?»**
Los recortes **no se solapan** ✓ y las operaciones son distintas ✓. Pero:
(1) **el que se pisa no es ése**: MED-133 recorta `o-talisman` [5]–[7], que está
**contenido** en el [0]–[7] de MED-132, y los dos modelos dicen «a adega vazia… os
livros mal escriturados» (ERROR 13);
(2) **no se sostienen solos**: MED-135 abre con «**Mas** o que **o** tortura…»
(DISC 6) y MED-133 abre con «Quando ao outro dia foi procurar **o seu** generoso
concorrente» (ERROR 14);
(3) MED-132 pide en la rúbrica contenido que su recorte no tiene (ERROR 12).

**(j) «Ruido declarado: avelã/talismã, garagem, praia.»**
*garagem* y *praia*: de acuerdo, ruido léxico, sin consecuencia. *avelã/talismã*: **no
es ruido, es fuga** (ERROR 13) — no comparten «palabra», comparten hallazgo, fuente y
casi la redacción. Y falta declarar un ruido mayor: el **dominio condominio/vivienda**,
que ya ancla cinco publicadas y al que el lote añade dos (DISC 11).

**(k) «Verifiquen que el mínimo cumplidor cabe en cada uno de los cuatro rangos.»**
Corrección previa: sólo **129 y 132** llevan 5 casillas (130 y 131 llevan 4).
Mínimos redactados y contados: 129 = 111/140 ✓ · 130 = 47/75 ✓ · 131 = 47/80 ✓ ·
**132 = 127/130 ✗** (DISC 5). El único que incumple MED-28 es MED-132, y por 3
palabras con redacción telegráfica.

---

## 9 · Qué está bien (específico)

1. **La secuencia es honesta y está bien medida.** Recalculada contra los JSON, la
   tabla de solapes del doc es **exacta cifra a cifra**, la media (4,875) está a 0,08σ
   del azar y ningún lote pasa de 0,7σ. La corrección del lote 5 («buscar el azar, no
   el mínimo») está interiorizada. Prefijo BMBB inédito, verificado contra los nueve.
2. **La marca temporal está curada.** «Ontem» en GJ-07 (BIEN) rompe el patrón que hizo
   predecible el 75 % del lote 5: dos MAL y un BIEN anclados → 6/10. Es la regla del
   contrato aplicada sin que nadie se la recordara.
3. **El eje de la glosa cognada es el mejor construido del catálogo hasta hoy: 4/10
   directo, 6/10 inverso.** GJ-01, GJ-04 y GJ-07 son BIEN cuya traducción literal da
   español roto — exactamente la dieta que el contrato pide y que ningún lote anterior
   había servido en esa proporción.
4. **MED-130 y MED-131 son una idea nueva de verdad** (§4, nota g): la mediación por
   síntesis de dos documentos que se contradicen es la operación real, y no existía en
   128 ítems.
5. **MED-134 estrena el `explain_concept` metalingüístico** (explicar el sistema de
   tratamiento desde un diálogo) — género nuevo frente a los 11 publicados, todos
   anécdota o quadra. La idea es excelente aunque el diálogo no la sostenga (ERROR 18).
6. **MED-137 es el ítem lingüísticamente más limpio del lote.** «…quando forem
   precisas obras… **tem de deixar entrar** quem as vai fazer… E se **não deixar**
   entrar nessa altura, **fica responsável** pelos estragos que daí resultarem.»
   Tercera persona sin pronombre sostenida cuatro veces sin un solo «você», con
   «É só isso» de cierre. Y usa «o seguinte» **cataforicamente** («quer dizer o
   seguinte: quando…») — que es la trampa con la que este proyecto empezó.
7. **GJ-07 es el mejor juicio del lote.** «Fiquei a saber ontem que ela **se** mudou
   para o Porto» + la explicación que se adelanta al reflejo equivocado: «La próclise
   de «ela se mudou» no es brasileña aquí: la dispara el «que» de la subordinada».
   Eso separa C1 de B1: enseña a NO corregir.
8. **GJ-02 maneja bien la asimetría verbo/sustantivo.** «Cuidado, que aquí el verbo NO
   acompaña al sustantivo: «lograr» sí significa conseguir… y es esa asimetría la que
   engaña». Es la clase de matiz que un lote de falsos amigos suele aplanar.
9. **Todos los `audience` están en la lengua del producto** (12/12 verificados) y
   todas las `instructionsEs` están en español sin lusismos. La regla se cumple sin
   excepción.
10. **La rúbrica no se le enseña al alumno antes de escribir.** Verificado en
    `MediationCard.tsx`: la fase «escribir» sólo muestra fuente + consigna + rango, y
    la rúbrica aparece en la fase «cotejar». MED-139, cuya casilla 1 lista los cuatro
    pares léxicos, no es una fuga por eso.
11. **La barra de retirada se aplicó con datos, no con opinión.** «Todo o mundo» murió
    con 22 atestaciones delante y «apesar de que» con la glosa publicada en la mano —
    y los dos clones que el gate cazó (assentar↔l5-07 a 0,531; a-gente↔3d979702 a
    0,561) se retiraron pese a ser léxicamente impecables. Verifiqué `3d979702`: es
    literalmente el mismo ejercicio. La decisión fue correcta.
12. **Los n-gramas se cumplen.** Comprobé por script, con normalización de la
    ortografía del XIX (ph/f, ct/t, elle/ele, ll/l…), los modelos de MED-129, -132,
    -133 y -135 contra sus fuentes: **cero 7-gramas compartidos** en los cuatro.
13. **Los recuentos de fuente son exactos.** 861 palabras (`o-chapellinho-encarnado`,
    39 párrafos), 1.767 (`branca-de-neve`, 70), 364 (`o-talisman`, 8): coinciden al
    dígito con lo que declara el doc, y los rangos de párrafo [0]–[38], [0]–[69],
    [0]–[7] son correctos.
