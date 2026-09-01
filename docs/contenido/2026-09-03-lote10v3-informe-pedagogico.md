# Lote 10 B2C2 **v3** — revisión PEDAGÓGICA Y DE DISEÑO (ronda 3, la última)

Revisor #2 (ángulo pedagógico). No he hablado con el revisor lingüístico.
Doc auditado: `docs/contenido/2026-09-03-lote10-b2c2-v3.md`.
Repo: `/Users/lalo/idiomas/portugues-app`.

> **Nota de estado, primero porque cambia cómo hay que leer esto.** El documento,
> la batería y el preflight cambiaron **tres veces** durante esta auditoría, y en
> la última pasada **el lote ya estaba publicado**: el corpus pasó de 2.431 a
> 2.445 ítems y existen `b2c2-gj-l10-01 … -16` en `b11.json`
> (commit `cb92e39 LOTE 10 PUBLICADO: 14 ítems tras tres rondas, y el rasgo 13`).
> Buena parte de lo que este informe traía como bloqueante **ya está aplicado** y
> lo digo en §7. Lo que queda son **defectos en producción**, y por eso la lista
> final (§8) no es «qué corregir antes de publicar» sino **qué parchear ya en
> `b11.json`**.

---

## VEREDICTO GLOBAL: **PUBLICA-CON-CORRECCIONES** · **7 bloqueantes**, dos de ellos ya visibles para el alumno

Publicar fue defendible: los 14 ítems son material usable, `b11-regencias`
cierra de verdad (14 ≥ 12) y el etiquetado se arregló. Pero el lote salió con
siete defectos, y los dos primeros están hoy en producción, delante del usuario.

1. **Dos explicaciones publicadas hablan de frases que ya no existen.**
   `b2c2-gj-l10-03` explica «la ênclise **«levantar-me»**» y su frase dice
   «**deitar-me**»; `b2c2-gj-l10-05` explica ««**quando nos virmos**»» y su frase
   dice «quando **estivermos**». Es el residuo de sustituir las cuatro frases sin
   arrastrar las explicaciones. Dos líneas de `b11.json`.
2. **El rasgo 12 publicó con la cifra equivocada.** Dos de las catorce glosas
   están juzgadas con un criterio distinto del de las otras doce. Corregidas, el
   rasgo pasa de **9/14 (p=0,212)** a **11/14 (p=0,029)** y **bloqueaba**.
   Verificado corriendo el preflight: **EXIT=1**.
3. **`b11-aspecto-tempo` figura en 6 de 12 y probablemente está cerrado.** Hay
   **17 juicios publicados que enseñan aspecto y tiempo y sólo 6 lo declaran**;
   con el backfill de los siete que llevan `concepts: []`, el punto llega a
   **13** y cierra. La pregunta «¿merece publicarse a 7 de 12?» tiene la premisa
   rota: no hay que escribir ítems, hay que etiquetar los que ya están.

Y **sobre las dos lápidas: hiciste bien** (§5). Escribí siete reposiciones más y
murieron las siete; una de ellas —la que el informe de la v2 prescribía por su
nombre— **ya estaba publicada casi literal** y el gate la puntúa **0,159**.

---

## 1 · ATAJOS

### 1.1 · El **rasgo 13** que se me pidió buscar: la construcción europea marcada

> **«Si la frase EXHIBE portugués europeo marcado —una perífrasis aspectual, un
> *haver de*, un futuro do conjuntivo, una ênclise sobre verbo finito— está
> BIEN.»**

Se ejecuta sin evaluar la gramaticalidad ni una vez: basta reconocer si la frase
*luce* algo del inventario que la lección presume. Es un atajo de
**reconocimiento de vitrina**, y es de un tipo que la batería no tenía: los doce
rasgos anteriores miran el TEXTO (bolsa de palabras, longitud, comas), la
POSICIÓN (en la frase, en el lote) o la GLOSA. **Ninguno miraba qué gramática
exhibe la frase.**

Medido con `medirRasgo`/`pValor` del repo, acierto sobre N=14, sobre el documento
tal como estaba cuando lo medí:

```
exhibe construcción europea marcada    12/14 (86 %)  presente⇒BIEN  presentes 8  p=0.0065  ⚠
```

```
GJ-01 · SÍ (ênclise sobre finito: «disse-me»)          ⇒ BIEN · real MAL  · falla
GJ-02 · no                                              ⇒ MAL  · real MAL  · ACIERTA
GJ-03 · SÍ (costumar + inf)                             ⇒ BIEN · real BIEN · ACIERTA
GJ-04 · no                                              ⇒ MAL  · real MAL  · ACIERTA
GJ-05 · SÍ (haver de + inf · futuro do conjuntivo)      ⇒ BIEN · real BIEN · ACIERTA
GJ-06 · SÍ (ficar A + infinitivo)                       ⇒ BIEN · real BIEN · ACIERTA
GJ-08 · SÍ (ir + gerúndio)                              ⇒ BIEN · real BIEN · ACIERTA
GJ-09 · no                                              ⇒ MAL  · real MAL  · ACIERTA
GJ-10 · SÍ (ênclise sobre finito: «Deram-me»)           ⇒ BIEN · real BIEN · ACIERTA
GJ-11 · no                                              ⇒ MAL  · real MAL  · ACIERTA
GJ-12 · no                                              ⇒ MAL  · real MAL  · ACIERTA
GJ-13 · no                                              ⇒ MAL  · real BIEN · falla
GJ-14 · SÍ (dar por = notar)                            ⇒ BIEN · real BIEN · ACIERTA
GJ-16 · SÍ (ênclise sobre finito: «Casou-se»)           ⇒ BIEN · real BIEN · ACIERTA
```

2×2: **presente 7 BIEN / 1 MAL · ausente 5 MAL / 1 BIEN.**

**El null estricto, dicho antes de que me lo pidan.** El `pValor` del repo compara
contra p=0,5, y con 8 BIEN / 6 MAL el predictor constante saca 8/14 gratis (por
eso hay dos rasgos con `presente en 0` declarando «57 %»). Bajo el hipergeométrico
exacto, que respeta el desequilibrio de clases y el número de presentes:

```
rasgo 13 · hipergeométrico exacto una cola = 0.0163   (presentes 8, de ellos BIEN 7)
```

**Bloquea bajo los dos nulos**, que es más de lo que se puede decir de los tres
rasgos anteriores de la serie.

**Control — ¿no serán así todos los lotes?** Mismo rasgo sobre los **146 juicios
publicados antes de este lote**, misma dirección:

```
l1  9/20 (45 %)   l4 12/20 (60 %)   l7  4/10 (40 %)
l2 12/20 (60 %)   l5 12/20 (60 %)   l8  5/10 (50 %)
l3 10/20 (50 %)   l6  5/10 (50 %)   l9  6/10 (60 %)
TODOS  78/146  (53 %) · presentes 34
```

**Ningún lote publicado pasa del 60 %. El candidato sacaba 86 %.** No es un
artefacto de la lengua ni del formato: era de este lote.

**Y es viejo.** Medido con el mismo código sobre las tres versiones: v1 y v2 daban
**12/16 (p=0,038)** y v3 **12/14 (p=0,006)**. Rompe el patrón de la serie: **este
rasgo no nació de arreglar el anterior** — estaba desde la primera versión y
sobrevivió a tres rondas de arreglos anti-atajo porque las tres atacaron la
superficie (longitud, arranque, cadena literal del `<Example>`) y ninguna miró el
reparto del contenido.

**Estado:** el rasgo **está en la batería** (`atajos.ts`, primer elemento de
`RASGOS`) y la edición de GJ-12 («Os miúdos **costumam** obedecer…») lo bajó a
**10/14, p=0,090**. Verificado en el preflight actual. Este bloqueante está
cerrado. Dejo el desglose porque la cifra hay que poder auditarla después.

*(Aviso sobre mi propio código: la primera versión de mi regex no cubría `fiqu-`
—«fiquei» es fi-QU-ei, no fi-c-ei— y me daba 11/14 en vez de 12/14. Un regex mal
escrito infra-mide un atajo exactamente igual que una glosa mal juzgada, que es
justo lo de §1.2.)*

### 1.2 · **El rasgo 12 publicó infra-medido por dos de sus catorce declaraciones**

Se me pidió expresamente auditar las glosas. Lo he hecho una a una.
**Discrepo en dos, y las dos van en la misma dirección.**

| ítem | v/f | glosa declarada | doc | mi juicio |
|---|:-:|---|:-:|:-:|
| GJ-01 | MAL | «Ayer por la noche no **dijo-me** nada…» | INCORRECTO | INCORRECTO ✓ |
| GJ-02 | MAL | «**Si yo sería** más joven…» | INCORRECTO | INCORRECTO ✓ |
| GJ-03 | BIEN | «Acostumbro acostarme tarde, incluso cuando tengo que despertar…» | CORRECTO | CORRECTO ✓ |
| GJ-04 | MAL | «Espero que tu hermano **viene**…» | INCORRECTO | INCORRECTO ✓ |
| GJ-05 | BIEN | «**He de le pedir** disculpa cuando **estuviéremos**…» | INCORRECTO | INCORRECTO ✓ |
| GJ-06 | BIEN | «…**quedé a rumiar** el asunto…» | INCORRECTO | INCORRECTO ✓ |
| GJ-08 | BIEN | «Mi abuelo va perdiendo la memoria despacio…» | CORRECTO | CORRECTO ✓ |
| GJ-09 | MAL | «…**sin que** nadie lo **vio**…» | INCORRECTO | INCORRECTO ✓ |
| **GJ-10** | **BIEN** | «**Dieron-me** la enhorabuena por el trabajo…» | INCORRECTO | **CORRECTO ⇦ DISCREPO** |
| GJ-11 | MAL | «**Llegamos en** Faro…» | INCORRECTO | INCORRECTO ✓ |
| GJ-12 | MAL | «…**obedecen los** abuelos…» | INCORRECTO | INCORRECTO ✓ |
| GJ-13 | BIEN | «Repara en la camiseta nueva de él, debe de haber costado…» | CORRECTO | CORRECTO ✓ |
| GJ-14 | BIEN | «…**sin batir a la puerta**, él ni siquiera **dio por mí**.» | INCORRECTO | INCORRECTO ✓ |
| **GJ-16** | **BIEN** | «**Casó-se** con una arquitecta…» | INCORRECTO | **CORRECTO ⇦ DISCREPO** |

**Por qué discrepo, y por qué no es una pedantería.** «Diéronme la enhorabuena» y
«Casóse con una arquitecta» **son español bien formado**: la ênclise sobre verbo
finito es arcaica y literaria en español, no agramatical («Diéronle las gracias»,
«Fuese y no hubo nada»). Lo que las hace parecer imposibles en la glosa es **el
guion**, que es una convención ortográfica portuguesa que el glosador arrastró.
Escritas a la española pasan.

Y el criterio operativo del rasgo es *¿el oído del hispanohablante rechaza el
resultado?*. Ante «Deram-me os parabéns» ese oído registra «antiguo», no «malo»:
**no puede usar su L1 para rechazarlo**, luego el ítem no se resuelve desde el
español, luego la glosa es CORRECTO.

**El contra-test, que es lo que hace sólido el criterio:** GJ-01 sigue siendo
INCORRECTO con razón — «no díjome nada» es imposible en *cualquier* registro del
español, porque la negación fuerza la próclise igual que en portugués. El
criterio discrimina bien; sólo estaba mal aplicado donde no hay atractor.

**El efecto, medido:**

```
$ preflight con las dos glosas corregidas
| la glosa palabra-por-palabra al español es español correcto ⚠ | **11/14** (79 %) | presente⇒BIEN | 5 | 0.029 |
**1 BLOQUEANTES — el round NO se abre:**
- atajo «la glosa palabra-por-palabra al español es español correcto»: acierta 11/14 (p=0.029)
EXIT=1
```

De **9/14 (p=0,212)** a **11/14 (p=0,029)**; hipergeométrico exacto **0,0280**,
porque los cinco presentes son BIEN los cinco. **El lote publicó con 9/14 y la
cifra buena era la que bloqueaba.**

**La causa de fondo: el criterio no está escrito.** El doc aplica dos reglas sin
decirlo — la literal estricta a la ênclise (GJ-10/16 → INCORRECTO por el guion) y
la caritativa a GJ-13, donde «deve **ter** custado» se glosa «debe **de haber**
costado», que ya no es palabra por palabra (la literal, «debe tener costado»,
sería INCORRECTO). Un rasgo declarado a mano necesita **su criterio escrito en el
código, al lado del rasgo**, o cada lote lo aplicará distinto.

**Y lo que no tiene arreglo dentro de este lote.** Los cinco presentes son los
cinco BIEN, y **ningún MAL puede tener glosa correcta**: repasados los seis, los
seis rompen el español (`no dijo-me`, `si yo sería`, `espero que viene`, `sin que
nadie lo vio`, `llegamos en Faro`, `obedecen los abuelos`). No es un problema de
redacción: los seis puntos examinados son puntos donde el español elige distinto
y por tanto **avisa**. Lo dice el propio comentario del rasgo en `atajos.ts`, y lo
suscribo entero:

> «La única defensa es de contenido: que el punto sea de verdad divergente del
> español. Si el español elige igual que el portugués, el punto no se puede
> examinar con juicios binarios — **hay que cambiar de formato, no de frases**.»

### 1.3 · El arreglo de los `<Example>` **cambió las cadenas y dejó el atajo**

`b11-l4-aspecto-e-tempo` tiene siete `<Example>`:

```
Estou a fazer o jantar. · Acabei de chegar. · Costumo levantar-me às sete.
Hei de te contar tudo. · Fiquei a pensar no que disseste.
O comboio está para chegar. · A avó vai melhorando aos poucos.
```

Las cuatro de en medio eran las cuatro BIEN de la sección A, literales. Ahora son
otras frases — pero **son las mismas cuatro construcciones**: `costumar`,
`haver de`, `ficar a`, `ir + gerúndio`. Y en la sección B, el `<Example>` #2 de
`b11-l2-regencias-que-traem` es «Só **dei pelo** erro quando já era tarde», que es
el `dar por` de GJ-14.

Rasgo «la construcción que la frase exhibe está en los `<Example>` de la lección
que el lote sirve»: presente en GJ-03, GJ-05, GJ-06, GJ-08, GJ-14 — **cinco, los
cinco BIEN**. Acierto **11/14, p=0,029**; hipergeométrico 0,0280.

> **El atajo de la cadena literal valía 10/14. El de la construcción vale 11/14,
> y vale lo mismo antes y después del cambio de frases.** Indexar `mdx/` fue una
> mejora real del gate —encontró un choque de verdad, `GJ-11` ↔
> `b6/l5-contraste-modos` a 0,529, de ahí «Faro»— pero atacó el síntoma: **el
> gate compara cadenas y el alumno reconoce construcciones.** El rasgo 13 es la
> versión robusta del mismo atajo, y por eso va en la batería y no en el gate.

---

## 2 · NIVEL REAL · se vende como C1; **como prueba es B1**

| ítem | v/f | qué mide de verdad | nivel real |
|---|:-:|---|:-:|
| GJ-01 | MAL | próclise por «não» | **B1** — el español coloca igual; la explicación lo admite |
| GJ-02 | MAL | prótasis con condicional | **A2** — «si yo sería» lo rechaza el español |
| GJ-03 | BIEN | `costumar` + inf | B1 — reconocimiento |
| GJ-04 | MAL | conjuntivo tras `esperar que` | **A2/B1** — idéntico al español |
| GJ-05 | BIEN | `haver de` + subida de clítico + fut. do conjuntivo | **C1** — pero es un BIEN: se exhibe, no se examina |
| GJ-06 | BIEN | `ficar a` + inf | B2 — idem |
| GJ-08 | BIEN | `ir` + gerúndio (contraejemplo) | B2/C1 — idem |
| GJ-09 | MAL | conjuntivo tras `sem que` | **A2/B1** |
| GJ-10 | BIEN | ênclise en afirmativa | B2 — y ni eso: el español tiene «Diéronme» |
| GJ-11 | MAL | `chegar A` | **B1** |
| GJ-12 | MAL | `obedecer A` | **B1/B2** — el español pide la «a» y empuja a lo correcto |
| GJ-13 | BIEN | `reparar EM` | B2 — «reparar en» existe en español |
| GJ-14 | BIEN | `entrar em` + `bater à` + `dar por` | B2/C1 |
| GJ-16 | BIEN | `casar-se com` + ênclise | B1/B2 |

**En conjunto: A2/B1**, y el desequilibrio va en una sola dirección, sin
excepciones:

> **Todo el contenido C1 del lote está en los BIEN. Los seis MAL son B1 o menos.**

Los tres números —rasgo 13 (12/14), rasgo 12 auditado (11/14) y el rasgo del
inventario de la lección (11/14)— son **el mismo hecho medido de tres maneras**.
El bloque se llama «Anti-calco C1»; lo que hay es **exhibición C1 + examen B1**.
Eso no lo arregla ninguna edición de frases (§1.2), y por eso es lo primero que
debería decidir el diseño del lote 11.

---

## 3 · ETIQUETADO · la corrección **se hizo, y es buena**; queda un flanco

Lo publicado, verificado ítem a ítem en `b11.json`:

```
l10-01 ["b8-coloc-proclise-negacao"]   l10-10 ["b8-coloc-enclise"]
l10-02 ["b5-se-condicional"]           l10-11 ["b11-regencias"]
l10-03 ["b11-aspecto-tempo"]           l10-12 ["b11-regencias"]
l10-04 ["b6-pres-subj-disparadores"]   l10-13 ["b11-regencias"]
l10-05 ["b11-aspecto-tempo"]           l10-14 ["b11-regencias"]
l10-06 ["b11-aspecto-tempo"]           l10-16 ["b8-coloc-enclise"]
l10-08 ["b7-gerundio"]
l10-09 ["b6-imperfeito-subj"]
```

**Está bien hecho**, y coincide ítem por ítem con el reparto que yo había
calculado por mi cuenta: GJ-10 y GJ-16 salieron de `b11-regencias` (sus frases
exhiben ênclise, no régimen — en GJ-10 el destinatario es el propio clítico
«-me», como su explicación admite), GJ-08 fue a `b7-gerundio` y GJ-09 a
`b6-imperfeito-subj`. Cobertura resultante, medida:

```
b11-aspecto-tempo   6      b8-coloc-enclise           20     b6-imperfeito-subj   7   ← bajo el piso
b11-regencias      14 ✔    b8-coloc-proclise-negacao  13     b6-presente-subj     6   ← bajo el piso
                           b5-se-condicional          29     b6-futuro-subj       8   ← bajo el piso
                           b6-pres-subj-disparadores  21     b7-gerundio         10   ← bajo el piso
```

**Lo que queda.** Dos ítems fueron a un punto que ya estaba sobrado teniendo al
lado uno hambriento, y bastaría un **segundo** concepto (coste cero, +2 de
cobertura donde hace falta):

| ítem | fue a | debería llevar TAMBIÉN |
|---|---|---|
| `l10-04` «Espero que… vem» | `b6-pres-subj-disparadores` (21) | **`b6-presente-subj`** (6) |
| `l10-05` «…quando estivermos…» | `b11-aspecto-tempo` | **`b6-futuro-subj`** (8) — el futuro do conjuntivo es la mitad del ítem |
| `l10-16` «Casou-se com…» | `b8-coloc-enclise` | **`b11-regencias`** (`reg-verbal-com`) — la preposición sí está en la frase |

**Y la sección B son 6 ítems y 3 sub-puntos.** Por las transversales de
`conceptos-finos.ts`: `reg-verbal-a` ×2 (GJ-11, GJ-12, **adyacentes y los dos
MAL**), `reg-verbal-em` ×2 (GJ-13, GJ-14, **adyacentes y los dos BIEN**),
`reg-verbal-com` ×1, colocação ×1. Contar seis puntos donde hay tres vuelve a
inflar, un nivel más abajo. Y `dar por` (GJ-14) ya estaba publicado como
`b2c2-gj-l4-20` **en la misma lección** y es el `<Example>` #2 de esa lección: el
doc lo declara, bien, pero **no se puede contar dos veces para la cobertura**.

---

## 4 · `b11-aspecto-tempo` A 6 DE 12 · **la premisa de la pregunta está rota**

El «3 de partida» era un conteo de **etiquetas**, no del punto. Barriendo los 160
juicios publicados por la CONSTRUCCIÓN que exhiben:

```
$ node -e "…juicios con perífrasis aspectual / expresión de duración…"
juicios que EXHIBEN aspecto/tiempo: 17 de 160 · declaran b11-aspecto-tempo: 6

  [no] b2c2-gj-05     []    Há dois anos que moro em Lisboa.
  [no] b2c2-gj-06     []    Conheço-a desde faz cinco anos.
  [no] b2c2-gj-l1-01  []    Está a chover desde ontem.
  [no] b2c2-gj-l1-05  []    Levo três anos a estudar português.
  [no] b2c2-gj-l2-04  []    Estou esperando o autocarro.
  [no] b2c2-gj-l3-03  []    Hei de visitar o Porto um dia.
  [no] b2c2-gj-l3-07  []    Estou a jantar com eles na sexta-feira.
```

**Siete juicios enseñan el punto y llevan `concepts: []`.** Etiquetarlos lleva
`b11-aspecto-tempo` de **6 a 13 — y cierra**. (Los otros cuatro sin declarar
—`l10-08`, `l10-12`, `l10-16`, `l9-07`— ya tienen etiqueta propia legítima y no
los cuento.)

> **Respuesta a «¿merece publicarse a 6 de 12?»: sí, y además el punto
> probablemente ya está cerrado y nadie lo sabe.** El orden para el lote 11 no es
> «escribir seis ítems de aspecto» sino **(1) backfill de `concepts`, (2) volver a
> medir, (3) escribir sólo lo que falte**. Escribir seis ítems para un punto
> cerrado es la peor decisión posible, y es a lo que empuja la fila de la tabla
> tal como está. Quedan **116 ítems con `concepts: []`** en el corpus: mientras
> estén así, ninguna cifra de cobertura mide el curso — que es exactamente la
> enfermedad `b5-futuro-composto` con el signo cambiado.

---

## 5 · LAS DOS LÁPIDAS · **hiciste bien; y demostrarlo destapó lo peor del gate**

Las tres muertes se sostienen, y **la corrección de la lápida de GJ-15 es
correcta**: el corpus publica `b2c2-gj-l1-04` «Apaixonei-me **por** ela» BIEN y
`apaixonar-se por` es el `<Example>` #0 de la propia lección `b11-l2`. La
atestación de «apaixonado **de** Thereza» era un falso positivo. Reconocer por
escrito que la lápida anterior mentía —«la atestación era mía y era falsa»— es lo
mejor del documento.

Escribí **siete** reposiciones más y las medí antes de defender ninguna.
**Murieron las siete:**

| candidata | causa de muerte |
|---|---|
| «Estamos a jantar com eles no sábado» → «Jantamos…» (`estar a` proyectado al futuro) | **YA PUBLICADO**: `b2c2-gj-l3-07` «Estou a jantar com eles **na sexta-feira**» → «Vou jantar…», MAL, explicación «*NO proyecta al futuro*». El mismo ítem con otro día |
| «estava fazendo o jantar» → «estava a fazer» | publicado 4 veces (`b7-ep-03/07/10/14`) + `b2c2-gj-l2-04` |
| «Faz três meses que não o vejo» → «Há três meses…» | **0,769 ⛔** contra `e6fb129d`, flashcard que usa «Faz três meses que não te vejo» **como modelo correcto** |
| «desde há cinco anos» → «há cinco anos» | 0,491 contra `b2c2-gj-06` «Conheço-a desde faz cinco anos» |
| «Mal cheguei, a reunião já tinha acabado» | `b2c2-gj-l9-01` publica «Mal saímos do teatro…» |
| «Vou-te dizer» → «Vou dizer-te» | **no es MAL** — la subida del clítico es correcta; lo dice el propio GJ-16 |
| «Ele deve de estar cansado» → «deve estar» | **no es MAL** — «dever de» + inf es la forma tradicional de suposición |

**Diez intentos (tus tres, mis siete), diez muertes.** No es mala suerte: el
punto, medido por construcción, ya está mucho más cubierto de lo que las
etiquetas dejan ver (§4). **No había una reposición evidente que se te escapara.**

### El hallazgo grande: **el gate mide sustantivos, no puntos**

Mi primera candidata y su gemela publicada son el mismo ejercicio. Medido con
`virginidad.ts`:

```
REPO-A completa «Estamos a jantar com eles no sábado, por isso não contes connosco.»
   contra b2c2-gj-l3-07 → 0.159 · comparten: jantar        (nada por encima de 0.34)
REPO-A desnuda  «Estamos a jantar com eles no sábado.»
   contra b2c2-gj-l3-07 → 0.22  · comparten: jantar        (nada por encima de 0.34)
REPO-A calcada  «Estou a jantar com eles na sexta-feira.»
   contra b2c2-gj-l3-07 → 1.00  · comparten: sexta-feira, jantar, estou, vou
```

> **Cambiar «sexta-feira» por «sábado» y «Estou» por «Estamos» hunde un duplicado
> perfecto de 1,00 a 0,22 —factor 4,5— sin tocar nada de lo que el ítem enseña.**
> El umbral de aviso es 0,34 y el de bloqueo 0,50: el duplicado pasa invisible.

Eso reinterpreta las tres muertes del doc: no murieron por duplicar el PUNTO,
murieron por **reutilizar los sustantivos** («o teu pai», «o jogo todo»). Una
cuarta que repitiera el punto cambiando los sustantivos habría entrado sin que el
gate dijera nada — que es lo que casi me pasa a mí y lo que **sí** pasó con GJ-14.
El gate protege contra el copiar-y-pegar, no contra el reenseñar; su segundo eje
—`concepts`— existe para eso y está apagado en 116 ítems.

---

## 6 · FUGAS, CONTRADICCIONES Y RESTOS DEL CAMBIO DE FRASES

### 6.1 · GRAVE, **y en producción** · dos explicaciones hablan de otra frase

El cambio de las cuatro frases no arrastró las explicaciones, y así están
publicadas:

```
b2c2-gj-l10-03  S: «Costumo DEITAR-ME tarde, mesmo quando tenho de acordar cedo…»
                E: «…Y la ênclise «LEVANTAR-ME» es la colocación por defecto…»

b2c2-gj-l10-05  S: «Hei de lhe pedir desculpa quando ESTIVERMOS os dois mais calmos…»
                E: «…Y «QUANDO NOS VIRMOS» es futuro do conjuntivo, obligatorio tras…»
```

El alumno responde a una frase y recibe una explicación sobre otra — y las dos
citadas son, precisamente, las dos frases retiradas por ser `<Example>` literales
de la lección. **Es el residuo del arreglo, es visible hoy, y son dos líneas.**
(`l10-06` tiene lo mismo en grado menor: ilustra con «ficar a pensar» cuando la
frase dice «ficar a remoer»; ahí la formulación es genérica y se sostiene, pero
conviene alinearla.)

### 6.2 · Lo que **sí** se cortó

- **La fuga de GJ-01 → GJ-10/GJ-16 está cerrada.** La explicación publicada de
  `l10-01` ya no enuncia el sistema («…el error sale de haber aprendido que la
  ênclise es lo normal…»): ahora termina en «así que el fallo no viene de traducir
  a bulto». Era el bloqueante nº 6 del informe de la v2, arrastrado dos rondas.
- **GJ-09 ya no lleva la clave dentro.** La coleta pasó de «como se fosse um
  ladrão» —que regalaba la forma `-sse` que el ítem pide— a «com os sapatos na
  mão», y la explicación ya no confiesa que «el ítem se resuelve comparando sus
  dos mitades».
- **La cita a «GJ-05» desapareció.** La salvedad de `l10-16` ilustra sola («hei de
  te contar», «vou dizer-te»). Bien: en el catálogo hay **0 de 2.445** ítems que
  referencien a otro por su id, y publicar el primero habría dejado una
  referencia colgante — el alumno ve tarjetas sueltas en el SRS, no un lote
  numerado. Y la salvedad **cierra de verdad la contradicción**: sin ella, GJ-05
  marca BIEN «Hei de **lhe** pedir» (clítico antepuesto sin atractor) y GJ-16 dice
  que eso es el error; la línea correcta es que el atractor manda sobre el verbo
  finito **simple**.

### 6.3 · Virginidad desnuda: dos choques que el gate no ve

Corrido sobre la frase desnuda (núcleo didáctico escrito a mano), contra los
publicados **más** los 140 `<Example>`:

| ítem | choca con | desnudo | lo que ve el preflight |
|---|---|---:|---:|
| **`l10-01`** «Não disse-me nada» | `b2c2-gj-l2-19` «Ela me disse que vinha» → «Ela disse-me que vinha» | **0,679 ⛔** | 0,391 (aviso) |
| **`l10-04`** «Espero que o teu irmão vem» | `mdx:b6/l5-contraste-modos#1` «Espero que você venha à festa» | **0,495** | 0,363 (aviso) |
| `l10-03` «Costumo deitar-me tarde» | `b2c2-gj-l3-02` «Vou deitar-me cedo hoje» · `mdx:b11/l4#2` «Costumo levantar-me às sete» | 0,441 · 0,388 | 0,420 |
| `l10-14` «deu por mim» | `b2c2-gj-l4-20` «Quando dei por ela…» · `mdx:b11/l2#2` «Só dei pelo erro…» | <0,30 | — |

**`l10-01` cruza el umbral de bloqueo del propio preflight (0,5) y el preflight no
lo ve**, porque la sonda de núcleo sigue siendo un **no-op en los ítems sin coma**:
parte por comas y se queda con el trozo más largo, que sin comas es la frase
entera — se ve en la salida pegada, donde `GJ-01·núcleo` puntúa igual que `GJ-01`.

No es un duplicado: `b2c2-gj-l2-19` enseña «sin atractor → ênclise» y `l10-01`
«con atractor → próclise»; son las dos mitades de la misma regla y enseñar la
segunda después de la primera es correcto. Lo que falta es **declararlo**, como se
declaró el de GJ-14. Y **`l10-04`, a una milésima del bloqueo, sí es el mismo
ejercicio** que un `<Example>` de `b6/l5` con otro sujeto.

### 6.4 · Pares que enseñan lo mismo dos veces dentro del lote

`reg-verbal-a` ×2 adyacentes y los dos MAL (GJ-11, GJ-12) · `reg-verbal-em` ×2
adyacentes y los dos BIEN (GJ-13, GJ-14) · ênclise sobre finito ×2 BIEN (GJ-10,
GJ-16) · imperfeito do conjuntivo ×2 MAL (GJ-02, GJ-09). Tras leer la explicación
de GJ-11 («chegar **A**; "chegar em" es brasileño») el alumno llega a GJ-12 cebado
para buscar una «a» que falta — y son los **dos únicos MAL de la sección B**.

### 6.5 · Una contradicción del catálogo que este lote destapa

GJ-11 condena «chegar em». El catálogo publica como **modelo correcto** el
flashcard `0b4ea261`: «Ao eu chegar **em** casa, **vou te** ligar.» — «chegar em»
más próclise brasileña. No es culpa del lote; ticket de backlog.

---

## 7 · QUÉ ESTÁ BIEN (específico)

- **El sello del preflight cubre ahora los tres ficheros** (`atajos.ts`,
  `pares-minimos.ts`, `preflight-lote.ts`) y la salida pegada reproducía **byte a
  byte** cuando la verifiqué. Es el arreglo exacto del agujero que encontré en la
  primera pasada de esta auditoría —`preflight-lote.ts` había cambiado tras
  pegarse la salida y el sello, que sólo miraba la batería, seguía dando luz
  verde— y se hizo en horas.
- **Indexar los 140 `<Example>` de `mdx/` es una mejora grande y real del gate**, y
  encontró un choque de verdad (0,529). Ataca el síntoma y no la enfermedad
  (§1.3), pero el síntoma era gordo: cuatro de las ocho frases de una sección
  eran `<Example>` literales.
- **El rasgo 12 es el rasgo correcto y estaba bien elegido.** Que dos de sus
  catorce valores estén mal no quita que meterlo —con la glosa escrita al lado y
  bloqueando si falta— sea la decisión de diseño más importante de la ronda. Su
  comentario en el código, «hay que cambiar de formato, no de frases», es el
  diagnóstico correcto del lote entero.
- **El etiquetado se corrigió de verdad y coincide con mi reparto independiente**,
  incluido lo menos obvio: GJ-10 y GJ-16 fuera de `b11-regencias`, GJ-08 a
  `b7-gerundio`, GJ-09 a `b6-imperfeito-subj`. Y el backfill de los cinco
  `concepts: []` de `b11-l2` está hecho.
- **La tabla de cabecera admite por escrito que estaba mal en sus dos filas.** Eso
  es lo contrario de lo que hizo la v2.
- **La lápida de GJ-15 se corrigió contra el propio autor**, con la cita verificada.
- **`lleva una palabra visiblemente española`: 0 presentes**, y el rasgo se arregló
  quitándole `desde`, `nunca` y `aje\b`, que eran falsos positivos que le inflaban
  la cifra a 15/24. Un detector con falsos positivos contamina su propia cifra.
- **`obedecer a` y `bater à porta` siguen siendo vírgenes de verdad**: 0
  ocurrencias en los 2.445. Son los dos puntos genuinamente nuevos del lote.
- **GJ-08 sigue siendo el mejor ítem**: un BIEN que existe para impedir que la
  regla se lea como «en portugués europeo nunca hay gerundio», que así enunciada
  es falsa.
- **La ronda no perdió trabajo pagado.** Las diez correcciones obligatorias siguen
  aplicadas, incluidas las tres que la v2 había perdido. Y las que este informe
  pedía en su primera pasada —GJ-09, GJ-12, GJ-01, el rasgo 13, el etiquetado de
  GJ-10/16— están todas en el commit publicado.

---

## 8 · BLOQUEANTES · lista cerrada · **son parches sobre `b11.json`, el lote ya publicó**

| # | defecto | acción, un paso | verificación |
|---|---|---|---|
| **P1** | **EN PROD** · `b2c2-gj-l10-03` explica «la ênclise **«levantar-me»**» y su frase dice «**deitar-me**» | en `b11.json`, `levantar-me` → `deitar-me` en `explanationEs` | lectura directa del JSON publicado |
| **P2** | **EN PROD** · `b2c2-gj-l10-05` explica ««**quando nos virmos**»» y su frase dice «quando **estivermos**» | idem: `quando nos virmos` → `quando estivermos` (y alinear `l10-06`: «ficar a pensar» → «ficar a remoer») | idem |
| **P3** | **El rasgo 12 publicó con la cifra equivocada**: GJ-10 y GJ-16 llevan `glosa-es … INCORRECTO` cuando «Diéronme» y «Casóse» son español arcaico **bien formado**. Corregidas: **9/14 (p=0,212) → 11/14 (p=0,029)**, hipergeométrico 0,028 | corregir las dos líneas del doc **y** escribir el criterio en `atajos.ts`: «bien formado en algún registro del español», no «la redacción moderna natural» (hoy se aplica el estricto a GJ-10/16 y el caritativo a GJ-13) | corrido: **EXIT=1**. ⚠ Ninguna edición lo desbloquea — es del PUNTO, no de las frases (§1.2) |
| **P4** | `b2c2-gj-l10-01` ↔ `b2c2-gj-l2-19` a **0,679** desnudo, por encima del umbral de bloqueo del propio preflight, que sólo ve 0,391 | declararlo en el ítem como reenseñanza deliberada con el id al lado —como ya se hizo con GJ-14 ↔ `b2c2-gj-l4-20`— y no contarlo como cobertura nueva | medido con `virginidad.ts` |
| **P5** | `b2c2-gj-l10-04` ↔ `mdx:b6/l5-contraste-modos#1` a **0,495**, a una milésima del bloqueo: es «Espero que você venha à festa» con otro sujeto. El preflight ve 0,363 | declararlo con el id; y añadirle `b6-presente-subj` como segundo concepto (§3) | idem |
| **P6** | **`b11-aspecto-tempo` figura en 6 de 12 y hay 17 juicios publicados que lo enseñan** | backfill de `concepts` en los **siete** con `concepts: []` (`b2c2-gj-05`, `-06`, `l1-01`, `l1-05`, `l2-04`, `l3-03`, `l3-07`) → **13, cierra**. Y segundo concepto a `l10-05` (`b6-futuro-subj`, 8) y `l10-16` (`b11-regencias`) | conteos de §3 y §4, medidos sobre los 2.445 |
| **P7** | **El gate mide sustantivos, no puntos**: 1,00 → 0,22 cambiando el día de la semana y la persona del verbo | encender el segundo eje (`concepts`) —hoy apagado en **116** ítems— y escribir en el procedimiento del lote el grep por construcción, que es lo único que hoy encuentra estas colisiones | §5, medido |

### Backlog del lote 11, por orden de daño

1. **La sonda de núcleo es un no-op en los ítems sin coma** (§6.3). Sustituirla por
   el par `(sentence, repair)` truncado a la ventana donde difieren. Hoy es la
   diferencia entre 0,391 y 0,679.
2. **El gate de `<Example>` compara cadenas; el alumno reconoce construcciones**
   (§1.3). El rasgo 13 cubre eso en la batería; el gate sigue sin cubrirlo.
3. `b11` **no tiene partición** en `conceptos-finos.ts`: sus ítems no se pueden
   auditar por sub-punto y todo cae en dos cubos. La sección B de este lote son 6
   ítems y 3 sub-puntos, y eso no lo ve nadie hoy.
4. Reconciliar el inventario de puntos: el código produce **163**
   (`PARTICIONES 37 · subpuntos 143 · transversales 7 · gruesos sin partir 13`),
   no 186. Es el denominador de la meta de cobertura.
5. `0b4ea261` publica «Ao eu chegar **em** casa, **vou te** ligar» como modelo
   correcto y GJ-11 lo condena (§6.5).
6. **El diseño del lote 11 tiene que empezar por el formato, no por las frases.**
   Regência y colocação son puntos donde el español coincide, y por eso los seis
   MAL de este lote son cazables desde el español (§1.2, §2). Un juicio binario no
   puede examinarlos. Y para aspecto/tiempo, el orden es **backfill → medir →
   escribir**: escribí siete candidatas y murieron las siete (§5).
7. **Publicar cierra el round.** El lote se mergeó a `blocks/` mientras la ronda 3
   —la que la regla de corte declara última y decisoria— seguía abierta, y el
   preflight sobre el doc pasó de EXIT=0 a **49 bloqueantes**, todos por chocar
   consigo mismo ya publicado. No cambia ninguna conclusión de este informe, pero
   deja el gate inutilizable para cualquier revisión posterior del propio lote.

---

### Comandos corridos

```
npx tsx scripts/preflight-lote.ts <doc>                          # 3 estados distintos: EXIT=0, EXIT=0, EXIT=1 (49, post-publicación)
diff <(sed -n '80,170p' <doc>) <(salida real)                    # sin diferencias — la salida pegada era fiel
<copia + rasgo 13 en atajos.ts>  preflight <doc>                 # EXIT=1, 12/14 p=0.006
<copia + rasgo 13>               preflight <doc con GJ-12/GJ-11> # EXIT=0, 10/14 p=0.090
<copia + rasgo 13>               preflight <doc con glosas fix>  # EXIT=1, glosa 11/14 p=0.029
<script propio> medirRasgo/pValor sobre v1, v2, v3 y 146 publicados   # base 78/146 = 53 %
<script propio> hipergeométrico exacto                                # r13 0.0163 · r12 auditado 0.0280
<script propio> virginidad.ts sobre las 14 desnudas + 140 <Example>   # l10-01 0.679 · l10-04 0.495
<script propio> virginidad.ts: REPO-A vs b2c2-gj-l3-07, 3 redacciones # 1.00 / 0.22 / 0.159
node -e "…" concepts publicados de b2c2-gj-l10-*                      # los 14, uno a uno
node -e "…" juicios que EXHIBEN aspecto/tiempo, por construcción      # 17 de 160, 6 declarados
node -e "…" sin concepts en el corpus                                 # 116 de 2445
grep -o '<Example[^>]*pt="[^"]*"' mdx/b11/l4-aspecto-e-tempo.mdx      # las 7 del inventario
```

El repo no lo he modificado yo. Los parches de prueba viven en
`/private/tmp/claude-501/-Users-lalo/81a35124-6606-4ff5-b312-6a66f19a4678/scratchpad/repo2/`.
