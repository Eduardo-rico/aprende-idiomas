# Lote 10 B2C2 **v3** — revisión PEDAGÓGICA Y DE DISEÑO (ronda 3, la última)

Revisor #2 (ángulo pedagógico). No he hablado con el revisor lingüístico.
Doc auditado: `/Users/lalo/idiomas/portugues-app/docs/contenido/2026-09-03-lote10-b2c2-v3.md`
Fecha: 2026-08-31 (hora local CDMX). Repo: `/Users/lalo/idiomas/portugues-app`.

---

## VEREDICTO GLOBAL: **PUBLICA-CON-CORRECCIONES** — 6 bloqueantes, los 6 accionables en un paso

El lote es publicable. Su contenido es mejor que el de la v1 y el de la v2, y
las diez correcciones que el doc dice haber aplicado **están aplicadas de
verdad** (§7). Pero sale con tres cosas rotas que la regla de corte no puede
absolver, porque ninguna se arregla retirando ítems:

1. **hay un atajo nuevo, medido, que hace saltar el preflight** (11/14, p=0,029)
   y que estaba ya en la v1 y en la v2 sin que nadie lo midiera;
2. **el etiquetado es falso** y, publicado tal cual, dejará `b11-aspecto-tempo`
   marcado con 11 ítems cuando sólo 6 lo enseñan — la enfermedad
   `b5-futuro-composto`, prospectiva;
3. **la consecuencia declarada del doc es aritméticamente falsa**: el punto no se
   queda a UNO del piso, se queda a CINCO — y ni siquiera eso se puede afirmar,
   porque **once juicios publicados enseñan aspecto/tiempo y sólo tres lo
   declaran** (§3).

Los seis bloqueantes están en §8. Cuatro son ediciones de una línea. Dos son
ediciones de una frase, y las he **verificado corriendo el preflight parcheado**:
con ellas el lote sale **EXIT=0** con la batería de 12 rasgos.

**Sobre las dos lápidas la respuesta es que hiciste bien** (§5): escribí siete
reposiciones más y murieron las siete — una de ellas, la que el informe de la v2
te prescribió por su nombre, **ya está publicada casi literal** y el gate la
puntúa **0,159**. Ese es el hallazgo más grave de toda la auditoría y no es del
lote sino de la herramienta: **el gate de virginidad mide sustantivos, no
puntos** — cambiar «sexta-feira» por «sábado» hunde un duplicado perfecto de
**1,00 a 0,22**. Va al backlog, no a los bloqueantes, porque no impide publicar
este lote; impide confiar en el siguiente.

---

## 0 · ¿Me fío del preflight pegado? Es fiel a la batería, y está **caducado**

Corrido por mí, sobre el mismo documento:

```
$ npx tsx scripts/preflight-lote.ts docs/contenido/2026-09-03-lote10-b2c2-v3.md
EXIT=0
$ diff <(sed -n '59,125p' docs/contenido/2026-09-03-lote10-b2c2-v3.md) <(salida real)
9c9
< Patrón: `MMBMBBBMBMMBBB` · prefijo de 4: `MMBM` · racha máxima: 3 · desequilibrio: 2
---
> Patrón: `MMBMBBBMBMMBBB` · racha máxima: 3 · desequilibrio: 2
10a11,24
> Solape con los 10 lotes publicados (el objetivo es el AZAR, no el mínimo …):
> | lote | patrón | solape | azar | desvío | tope |
> | l1 | `BMMBMBMMBMBBBM` | 7/14 | 7.0 | 0.0 | 3 |
> …
> | l8 | `BBMBMMBMMB` | 2/10 | 5.0 | 3.0 | 3 |
```

La tabla de atajos, la de virginidad y el veredicto son **idénticos byte a byte**.
Lo que cambió es la sección **Molde**: `scripts/preflight-lote.ts` fue reescrito
durante esta auditoría (`mtime 2026-08-31 17:33:59`) y el criterio del «prefijo
de cuatro» ya no existe — lo sustituye un solape contra los diez lotes
publicados. El lote pasa el criterio nuevo también, pero **l8 queda con desvío
3,0 contra un tope de 3,0: en el filo**.

> **Hallazgo de proceso.** La cabecera estampa el rev de `scripts/lib/atajos.ts`
> (`4cc7a606`, que **sigue siendo el del repo** — verificado) pero **no estampa el
> rev de `preflight-lote.ts`**. Es la cicatriz de E2#12 subida un nivel: la
> batería está sellada y el gate que la envuelve no. Con el sello sólo sobre la
> batería, un documento puede llevar una salida pegada que ya no reproduce y
> parecer fresco. Añadir el hash de `preflight-lote.ts` a la misma línea de
> cabecera. *(No es bloqueante del lote; es deuda de herramienta.)*

---

## 1 · ATAJOS · **el rasgo 12: la construcción europea marcada**

### La regla, en una frase

> **«Si la frase LUCE portugués europeo —una perífrasis aspectual, un *haver de*,
> un futuro do conjuntivo, una ênclise sobre verbo finito— está BIEN.»**

Se ejecuta sin evaluar la gramaticalidad ni una sola vez: basta reconocer si la
frase *exhibe* algo del inventario C1 que las lecciones presumen. Es un atajo de
**reconocimiento de vitrina**.

Es un rasgo de un tipo que la batería no tiene. Los once anteriores miran el
TEXTO (bolsa de palabras, longitud, comas) o la POSICIÓN (dentro de la frase,
dentro del lote). **Ninguno mira qué gramática exhibe la frase.** La historia
—longitud → arranque → posición en el lote— es una historia de estadísticos y
de posiciones; ésta es la primera vez que el rasgo es *el contenido*.

### La medición, con el `medirRasgo`/`pValor` del propio repo

Fórmula **acierto sobre N = 14**, nunca recall sobre los 6 MAL.

| variante del rasgo | acierto | % | dirección | presentes | p |
|---|---:|---:|---|---:|---:|
| **A · lista cerrada de 7 formas (la que propongo)** | **11/14** | **79** | presente⇒BIEN | 7 | **0,0287 ⚠** |
| B · + `reparar em` | 12/14 | 86 | presente⇒BIEN | 8 | 0,0065 ⚠ |
| C · sin `dar por` | 10/14 | 71 | presente⇒BIEN | 6 | 0,0898 |
| D · sin ênclise (sólo perífrasis + fut. do conjuntivo) | 10/14 | 71 | presente⇒BIEN | 4 | 0,0898 |
| E · sólo perífrasis aspectuales | 9/14 | 64 | presente⇒BIEN | 3 | 0,2120 |

`(binomial N=14 del repo: 10⇒0,090 · 11⇒0,029 · 12⇒0,0065 · 13⇒0,0009; SOSPECHOSO=0,05)`

Desglose ítem a ítem de la variante A:

```
GJ-01 · rasgo=SÍ (ênclise sobre verbo finito: «disse-me»)        ⇒ BIEN · real MAL  · falla
GJ-02 · rasgo=no                                                  ⇒ MAL  · real MAL  · ACIERTA
GJ-03 · rasgo=SÍ (costumar + infinitivo)                          ⇒ BIEN · real BIEN · ACIERTA
GJ-04 · rasgo=no                                                  ⇒ MAL  · real MAL  · ACIERTA
GJ-05 · rasgo=SÍ (haver de + inf · futuro do conjuntivo)          ⇒ BIEN · real BIEN · ACIERTA
GJ-06 · rasgo=no                                                  ⇒ MAL  · real BIEN · falla
GJ-08 · rasgo=SÍ (ir + gerúndio)                                  ⇒ BIEN · real BIEN · ACIERTA
GJ-09 · rasgo=no                                                  ⇒ MAL  · real MAL  · ACIERTA
GJ-10 · rasgo=SÍ (ênclise sobre verbo finito: «Deram-me»)         ⇒ BIEN · real BIEN · ACIERTA
GJ-11 · rasgo=no                                                  ⇒ MAL  · real MAL  · ACIERTA
GJ-12 · rasgo=no                                                  ⇒ MAL  · real MAL  · ACIERTA
GJ-13 · rasgo=no                                                  ⇒ MAL  · real BIEN · falla
GJ-14 · rasgo=SÍ (dar por = notar)                                ⇒ BIEN · real BIEN · ACIERTA
GJ-16 · rasgo=SÍ (ênclise sobre verbo finito: «Casou-se»)         ⇒ BIEN · real BIEN · ACIERTA
```

Tabla 2×2: **presente 6 BIEN / 1 MAL · ausente 5 MAL / 2 BIEN.**

### El null estricto, dicho antes de que me lo digan

El `pValor` del repo compara contra p=0,5. Con **8 BIEN y 6 MAL, el predictor
constante «todo BIEN» ya saca 8/14 gratis** — por eso la tabla pegada tiene dos
rasgos con `presente en 0` que aun así declaran «57 %». Bajo un null que respeta
el desequilibrio de clases y el número de presentes (hipergeométrico exacto,
7 presentes de los que 6 son BIEN):

```
p hipergeométrico una cola = 0,0513 · dos colas ≈ 0,1026
```

O sea: **por la regla que el repo declara y ejecuta, el rasgo BLOQUEA (p=0,029).
Por el null estricto queda en el filo (0,051).** Lo digo entero porque presentar
sólo el número que me conviene es la enfermedad de este proyecto. Lo que
desempata es la tasa base, abajo.

### Control: ¿no será que todos los lotes son así?

Rasgo A medido sobre **los 146 juicios ya publicados**, misma dirección
(presente⇒BIEN):

| lote publicado | N | acierto | % | presentes |
|---|---:|---:|---:|---:|
| l1 | 20 | 9/20 | 45 | 7 |
| l2 | 20 | 12/20 | 60 | 2 |
| l3 | 20 | 10/20 | 50 | 6 |
| l4 | 20 | 12/20 | 60 | 6 |
| l5 | 20 | 12/20 | 60 | 4 |
| l6 | 10 | 5/10 | 50 | 2 |
| l7 | 10 | 4/10 | 40 | 1 |
| l8 | 10 | 5/10 | 50 | 4 |
| l9 | 10 | 5/10 | 50 | 0 |
| otros | 6 | 3/6 | 50 | 1 |
| **TODOS los publicados** | **146** | **77/146** | **53** | 33 |

`p hipergeométrico del corpus publicado = 0,3138` — ruido puro. De los 33
publicados con el rasgo, 18 son BIEN (55 %), contra el 49 % basal.

**Ningún lote publicado pasa del 60 %. El candidato saca 79 %.** No es un
artefacto de la lengua ni del género «juicio de gramaticalidad»: es de este lote.

### Y no lo fabricó la ronda 3: llevaba dos rondas bloqueando

Mismo rasgo, mismo código, sobre las tres versiones:

| versión | N | acierto | p | ¿bloqueaba? |
|---|---:|---:|---:|:-:|
| v1 (`2026-09-01-lote10-b2c2.md`) | 16 | 12/16 (75 %) | 0,0384 | **sí** |
| v2 (`2026-09-02-lote10-b2c2-v2.md`) | 16 | 12/16 (75 %) | 0,0384 | **sí** |
| **v3** | 14 | 11/14 (79 %) | **0,0287** | **sí** |

Esto rompe el patrón de las tres sesiones anteriores: **este rasgo no nació de
arreglar el anterior.** Estaba desde la v1 y sobrevivió dos rondas completas de
«arreglos anti-atajo» porque las dos rondas atacaron estadísticos de superficie
(longitud, arranque) y ninguna miró el reparto del contenido. El informe de la
v2 lo tenía delante y lo dejó pasar por debajo del umbral:

> «`construcción sin equivalente literal en español` … 11/16 (p=0,105). Está
> justo por debajo del umbral hoy; **con dos ítems más del mismo corte,
> bloquea**.» — informe pedagógico v2, §4

Y la ronda 3 hizo exactamente eso sin darse cuenta: al matar GJ-15 («Quando eu
**chegar** em casa…», el único MAL con futuro do conjuntivo) y GJ-07, el lote se
quedó con **un solo MAL** que exhibe construcción europea (GJ-01) frente a
**seis BIEN** de siete. La regla de corte no fabricó el atajo, pero lo apretó.

### El código que hay que añadir a `scripts/lib/atajos.ts`

Va en `RASGOS`, entre `arranca con adjunto…` y `más corta que la mediana
(palabras)`:

```ts
{
  // RASGO 12. Los once rasgos anteriores miran el TEXTO (bolsa de
  // palabras, longitud) o la POSICIÓN (en la frase, en el lote).
  // Ninguno mira QUÉ GRAMÁTICA EXHIBE la frase. Y el lote 10 la
  // reparte de una sola manera: el portugués europeo marcado —las
  // perífrasis aspectuales, el «haver de», el futuro do conjuntivo,
  // la ênclise sobre verbo finito— sólo aparece en los BIEN. La regla
  // «si la frase LUCE portugués europeo ⇒ está bien» acierta 11 de 14
  // (p=0,029) sin evaluar una sola vez si la frase es gramatical.
  // Tasa base en los 146 juicios publicados: 53 %, ningún lote por
  // encima del 60 % ⇒ no es un artefacto de la lengua, es del lote.
  nombre: 'exhibe una construcción europea marcada (perífrasis, fut. do conjuntivo, ênclise sobre finito)',
  f: (x) => {
    const s = x.sentence;
    // ênclise/mesóclise sobre verbo FINITO: el español sólo tiene
    // enclisis en infinitivo, gerundio e imperativo, así que
    // «disse-me» está marcado y «levantar-me» no.
    for (const m of s.matchAll(/(?<![\p{L}])([\p{L}]{3,})-(?:me|te|se|lhe|nos|lhes|o|a|os|as|lo|la|los|las)(?![\p{L}-])/giu))
      if (!/(?:ar|er|ir|ôr|or|ndo)$/i.test(m[1]!)) return true;
    return [
      /(?<![\p{L}])(?:hei|hás|há|havemos|hão|havia|havias|havíamos|haviam)\s+d[eo](?![\p{L}])/iu,               // haver de + inf
      /(?<![\p{L}])costum(?:o|as|a|amos|am|ava|avas|ávamos|avam)(?![\p{L}])/iu,                                  // costumar + inf
      /(?<![\p{L}])(?:est(?:ou|ás|á|amos|ão|ava|avas|ávamos|avam|ive|eve)|fic(?:o|as|a|amos|am|ava|avam|uei|ou|aram|ámos)|and(?:o|as|a|amos|am|ava|avam|ei|ou)|continu(?:o|a|amos|am|ava|ou)|começ(?:o|a|amos|am|ava|ei|ou)|volt(?:o|a|amos|am|ei|ou))\s+a\s+[\p{L}]+(?:ar|er|ir|ôr)(?![\p{L}])/iu, // estar/ficar/andar a + inf
      /(?<![\p{L}])(?:vou|vais|vai|vamos|vão|ia|ias|íamos|iam|vem|vêm|vinha|anda|andam|andava)\s+[\p{L}]+ndo(?![\p{L}])/iu, // ir/vir/andar + gerúndio
      /(?<![\p{L}])(?:for|fores|formos|forem|tiver|tiveres|tivermos|tiverem|puder|puderes|pudermos|puderem|quiser|quiseres|quisermos|quiserem|vier|vieres|viermos|vierem|fizer|fizeres|fizermos|fizerem|souber|soubermos|souberem|estiver|estivermos|estiverem|vir|vires|virmos|virem|[\p{L}]{3,}(?:armos|ermos|irmos|arem|erem|irem|ares|eres|ires))(?![\p{L}])/iu, // futuro do conjuntivo
      /(?<![\p{L}])(?:dei|deu|deram|dou|dá|dão|dava|davam)\s+por(?![\p{L}])/iu,                                  // dar por (= notar)
    ].some((re) => re.test(s));
  },
},
```

Salida del preflight con el parche (copia en scratchpad; **el repo no se ha
tocado**):

```
Batería de atajos: **12 rasgos**, rev `a4b89d2c`.

| rasgo | acierto | dirección | presente en | p |
| exhibe una construcción europea marcada … ⚠ | **11/14** (79 %) | presente⇒BIEN | 7 | 0.029 |
| posición par en el lote (alternancia mecánica) | **9/14** (64 %) | presente⇒BIEN | 7 | 0.212 |
…
**1 BLOQUEANTES — el round NO se abre:**
- atajo «exhibe una construcción europea marcada (perífrasis, fut. do conjuntivo,
  ênclise sobre finito)»: acierta 11/14 (p=0.029) — se resuelve el lote sin saber portugués
EXIT=1
```

### El arreglo de un paso, verificado

**No hay que retirar ningún ítem** — retirar empeora casi siempre (quitar GJ-01,
el único MAL con el rasgo, sube a 11/13, p=0,011; quitar cualquier BIEN sin
rasgo, igual; y quitar GJ-01 rompe además el molde: quedarían 8 BIEN contra 5
MAL, desequilibrio 3 > 2). Lo que hay que hacer es **darle una construcción
europea al lado inocente de un MAL** — exactamente la medicina que la v2 aplicó
al arranque:

> GJ-12 «Os miúdos **costumam** obedecer os avós sem discutir, o que já é raro
> nesta idade.» → repair «Os miúdos **costumam** obedecer **aos** avós sem
> discutir, …»

No toca el error bajo examen (`obedecer A`), lo endurece (el alumno tiene que no
distraerse con un `costumar` correcto) y mete portugués europeo en un MAL, que
es justo lo que al lote le falta. Medido, junto con el arreglo de GJ-09 (§4):

```
$ npx tsx scripts/preflight-lote.ts docs/v3-parcheado.md    # batería de 12 rasgos
| exhibe una construcción europea marcada … | **10/14** (71 %) | presente⇒BIEN | 8 | 0.090 |
**Preflight limpio.** El round puede abrirse con esta salida pegada en el documento.
EXIT=0
```

### La cara pedagógica del mismo hecho: la dieta

El rasgo mecánico y el nivel real (§2) son **el mismo hecho medido dos veces**.
Glosa literal al español de cada frase, y si el español resultante está roto:

| ítem | glosa | ¿español roto? | ¿exige portugués? |
|---|---|:-:|:-:|
| GJ-01 MAL | «Ayer por la noche no **dijo-me** nada…» | SÍ | no |
| GJ-02 MAL | «**Si yo sería** más joven…» | SÍ | no |
| GJ-04 MAL | «Espero que tu hermano **viene**…» | SÍ | no |
| GJ-09 MAL | «…**sin que** nadie lo **vio**…» | SÍ | no |
| GJ-11 MAL | «**Llegamos en** Lisboa…» | SÍ | no |
| GJ-12 MAL | «Los críos **obedecen los** abuelos…» | SÍ | no |

**Los seis MAL, seis.** Ninguno exige saber portugués: los seis los caza un
hispanohablante rechazando su propia lengua. En la v2 al menos GJ-07 («vou a
levar») aguantaba; la regla de corte lo mató y con él el único MAL que medía
portugués.

*(Aviso metodológico, para no repetir la cicatriz: «6 de 6» **no es una cifra de
atajo** — es recall sobre los MAL. Su versión acierto-sobre-N, regla «glosa rota
⇒ MAL», sale entre **11/14 (p=0,029)** y **12/14 (p=0,0065)** según se cuenten o
no como rotas las glosas de GJ-10 («diéronme») y GJ-14 («dio por mí»). No la
presento como bloqueante porque no es mecanizable; el bloqueante mecánico y
reproducible es el rasgo 12.)*

---

## 2 · NIVEL REAL · se vende como C1; **como prueba es B1**

| ítem | v/f | qué mide de verdad | nivel real | por qué |
|---|:-:|---|:-:|---|
| GJ-01 | MAL | próclise por «não» | **B1** | el español coloca igual («no me dijo»); la propia explicación lo admite |
| GJ-02 | MAL | prótasis con condicional | **A2** | «si yo sería» lo rechaza el español; el doc lo admite |
| GJ-03 | BIEN | `costumar` + inf | B1 | reconocimiento, no discriminación |
| GJ-04 | MAL | conjuntivo tras `esperar que` | **A2/B1** | idéntico al español; 14 ítems publicados ya lo cubren |
| GJ-05 | BIEN | `haver de` + subida de clítico + fut. do conjuntivo | **C1** | pero es un BIEN: se exhibe, no se examina |
| GJ-06 | BIEN | `ficar a` + inf | B2 | idem |
| GJ-08 | BIEN | `ir` + gerúndio (contraejemplo) | B2/C1 | idem |
| GJ-09 | MAL | conjuntivo tras `sem que` | **A2/B1** | «sin que nadie lo vio» es igual de malo en español |
| GJ-10 | BIEN | ênclise en afirmativa | B2 | idem |
| GJ-11 | MAL | `chegar A` | **B1** | «llegamos en Lisboa» roto en español |
| GJ-12 | MAL | `obedecer A` | **B1/B2** | el español pide la «a» personal y empuja a lo correcto |
| GJ-13 | BIEN | `reparar EM` | B2 | «reparar en» existe en español |
| GJ-14 | BIEN | `entrar em` + `bater à` + `dar por` | B2/C1 | idem |
| GJ-16 | BIEN | `casar-se com` + ênclise | B1/B2 | idem |

**En conjunto: A2/B1.** El desequilibrio de nivel es sistemático y va en una sola
dirección, y esta vez sin excepciones:

> **Todo el contenido C1 del lote está en los BIEN. Todos los MAL son B1 o menos.**

Un lote donde los MAL se resuelven con «¿lo rechaza mi español?» es A2/B1
disfrazado, y eso es exactamente lo que el rasgo 12 mide por la puerta mecánica.
El bloque se llama «Anti-calco C1»; lo que hay es **exhibición C1 + examen B1**.

Esto **no lo arregla la regla de corte** (retirar los MAL fáciles deja el molde en
8 BIEN/2 MAL, desequilibrio 6, y el preflight lo bloquea). El arreglo —**un MAL
cuyo error viva DENTRO de una construcción europea**— es para el lote 11, y es
más difícil de lo que parece: escribí siete candidatas de ese corte y las siete
murieron contra el corpus (§5). Aquí lo único accionable es no vender como C1 lo
que es B1: **declararlo por escrito en el doc y en las etiquetas** (§3), que
además es lo que impide que el recuento mienta.

---

## 3 · EL ETIQUETADO · **es falso, y la cifra que produce es la que más daño hace**

Verificado el «antes» del doc, y **es correcto como conteo de etiquetas**:

```
$ node -e "…cuenta concepts declarados en lib/data/languages/pt/blocks/*.json…"
concepts= b11-aspecto-tempo → 3
concepts= b11-regencias     → 5      (+5 con concepts:[] bajo lessonId
                                      b11-l2-regencias-que-traem = 10)
TOTAL items: 2431 · ítems sin concepts: 121
```

**Pero el 3 no es la realidad del punto, es la realidad de las etiquetas.**
Barriendo los 146 juicios publicados por la CONSTRUCCIÓN que exhiben, no por la
etiqueta que llevan:

```
$ node -e "…juicios con perífrasis aspectual / expresión de duración…"
juicios que EXHIBEN aspecto/tiempo perifrástico: 10 de 146   (+1 que el regex se
                                                              deja, b2c2-gj-l9-07)
  b2c2-gj-05      concepts=[]                    :: Há dois anos que moro em Lisboa.
  b2c2-gj-06      concepts=[]                    :: Conheço-a desde faz cinco anos.
  b2c2-gj-l1-01   concepts=[]                    :: Está a chover desde ontem.
  b2c2-gj-l1-05   concepts=[]                    :: Levo três anos a estudar português.
  b2c2-gj-l2-04   concepts=[]                    :: Estou esperando o autocarro.
  b2c2-gj-l3-03   concepts=[]                    :: Hei de visitar o Porto um dia.
  b2c2-gj-l3-07   concepts=[]                    :: Estou a jantar com eles na sexta-feira.
  b2c2-gj-l5-01   concepts=["b11-aspecto-tempo"] :: É capaz de chover no domingo.
  b2c2-gj-l5-05   concepts=["b11-aspecto-tempo"] :: Ando a ler um livro do Saramago.
  b2c2-gj-l5-10   concepts=["b11-aspecto-tempo"] :: Ontem tenho falado com o teu pai.
```

**Once ítems enseñan aspecto y tiempo. Tres lo declaran.** Los otros ocho viven
con `concepts: []` bajo `b8-l1-conectores-subordinadas-adverbiais`, que es un
cajón, no un punto. Es decir: **la enfermedad que este lote está a punto de
cometer ya está cometida sobre este mismo punto**, y en la dirección contraria —
`b11-aspecto-tempo` puede estar hoy en 11 de 12, a uno del piso de verdad, y
nadie puede saberlo con las etiquetas de hoy.

Pero el «tras el lote» no. Punto real de cada ítem, con los sub-puntos de
`scripts/lib/conceptos-finos.ts` (b11 **no tiene partición**, así que sus ítems
caen bajo los sub-puntos de b5/b6/b7/b8 y las transversales de regência):

| ítem | declarado | **punto real (primario)** | secundario | ¿declarado = real? |
|---|---|---|---|:-:|
| GJ-01 | `b11-aspecto-tempo` | **`b8-colocacao-pronominal` / `b8-coloc-proclise-negacao`** | — | **NO** |
| GJ-02 | `b11-aspecto-tempo` | **`b5-se-condicional` / `b5-se-imperfeito-conj`** | `b6-imperfeito-subj` | **NO** |
| GJ-03 | `b11-aspecto-tempo` | `b11-aspecto-tempo` (aspecto habitual) | `b8-coloc-enclise` | sí |
| GJ-04 | `b11-aspecto-tempo` | **`b6-presente-subj` / `b6-pres-subj-disparadores`** | `b6-contr-emocao` | **NO** |
| GJ-05 | `b11-aspecto-tempo` | `b11-aspecto-tempo` (`haver de`) | `b6-fut-subj-quando` · `b8-coloc-infinitivo` | sí (con tres puntos en una frase) |
| GJ-06 | `b11-aspecto-tempo` | `b11-aspecto-tempo` (`ficar a`) | `b7-estar-a-infinitivo` | sí |
| GJ-08 | `b11-aspecto-tempo` | **`b7-gerundio` / `b7-gerundio-aspectual`** | `b11-aspecto-tempo` | fronterizo |
| GJ-09 | `b11-aspecto-tempo` | **`b6-imperfeito-subj` / `b6-imperf-subj-correlacao`** | `b8-oracoes-subordinadas` | **NO** |
| GJ-10 | `b11-regencias` | **`b8-colocacao-pronominal` / `b8-coloc-enclise`** | — | **NO** |
| GJ-11 | `b11-regencias` | `b11-regencias` / transversal `reg-verbal-a` | — | sí |
| GJ-12 | `b11-regencias` | `b11-regencias` / transversal `reg-verbal-a` | — | sí |
| GJ-13 | `b11-regencias` | `b11-regencias` / transversal `reg-verbal-em` | — | sí |
| GJ-14 | `b11-regencias` | `b11-regencias` / transversal `reg-verbal-em` | `reg-verbal-a` (`bater à`) | sí |
| GJ-16 | `b11-regencias` | **`b8-coloc-enclise`** + `b11-regencias` (`reg-verbal-com`) | — | mixto |

### GJ-10 es el caso puro: la regência que declara **no está en la frase**

«Deram-me os parabéns pelo trabajo, mas eu bem sei quem fez a parte difícil.»
La explicación enseña tres cosas, y su propia letra confiesa que la tercera no se
puede examinar:

> «…cuando aparece el destinatario, el régimen europeo es **a** … **aquí el
> destinatario es el propio clítico «-me»**.»

Es decir: el régimen `dar os parabéns **a** alguém` **nunca aflora en la frase**.
Y «pelo trabalho» es un `por` causal idéntico al español. Lo único que la frase
pone a prueba es la ênclise. **Etiquetado como `b11-regencias`, GJ-10 infla un
punto que no enseña.**

### La aritmética real

| punto | antes (etiquetas) | el doc declara | **real, contando lo que cada ítem enseña** |
|---|---:|---:|---:|
| `b11-aspecto-tempo` | 3 (**11 sin etiquetar**) | **11** (no cierra, «a uno del piso») | **3 + 3 = 6** primarios (7 contando GJ-08). Con el backfill de los 8 sin etiquetar: **14 y cierra** |
| `b11-regencias` | 10 | **16** (cierra) | **14** (15 con GJ-16) — cierra igual |

Las dos filas están mal por la misma razón y en direcciones opuestas: el doc suma
al punto ítems que no lo enseñan (GJ-01, GJ-02, GJ-04, GJ-09, GJ-10) y no suma
los ocho publicados que sí lo enseñan y no lo declaran. **El número correcto no
se puede escribir sin hacer antes el backfill.**

Y el etiquetado falso no sólo infla: **roba**. Seis ítems que sí enseñan algo se
lo enseñan a puntos que hoy están **por debajo del piso de 12** y no recibirán
crédito:

```
b8-colocacao-pronominal   18   → 21   (GJ-01, GJ-10, GJ-16)
b6-presente-subj           6   →  7   (GJ-04)      ← bajo el piso
b6-imperfeito-subj         6   →  7   (GJ-09)      ← bajo el piso
b6-futuro-subj             8   →  9   (GJ-05 sec.) ← bajo el piso
b7-gerundio                9   → 10/11 (GJ-08, GJ-06 sec.) ← bajo el piso
```

**Re-etiquetar no es un castigo: son cinco puntos hambrientos alimentados
gratis.** Y si no se re-etiqueta, `recuento-conceptos.ts` —que cuenta por
`concepts` declarados— dirá `b11-aspecto-tempo = 11` y el punto parecerá casi
cerrado. Eso es literalmente `b5-futuro-composto` (54 ítems etiquetados, cero
futuro composto) reproducido en directo, con la diferencia de que aquí lo
estamos viendo **antes** de publicar.

*(Nota de inventario: el prompt habla de 186 puntos; lo que hoy produce el código
son **163** — `PARTICIONES 37 · subpuntos 143 · transversales 7 · gruesos sin
partir 13`. Conviene reconciliar la cifra antes de usarla como denominador de la
meta.)*

---

## 4 · FUGAS Y CONTRADICCIONES

### 4.1 GRAVE · GJ-01 (ítem **nº 1**) regala GJ-10 y GJ-16 — **la corrección de la v2 no se aplicó**

La explicación de GJ-01 sigue enunciando el sistema entero:

> «…el error sale de haber aprendido que **la ênclise es lo normal en portugués y
> aplicarla también donde hay atractor**.»

Con eso, GJ-10 («Deram-me…», ênclise en afirmativa, pos 9) y GJ-16 («Casou-se…»,
pos 14) se contestan sin pensar — y **la trampa declarada de GJ-16 ES lo que
GJ-01 explicó** («el hispanohablante coloca "se casou", con próclise sin atractor
que la justifique»). El informe de la v2 lo marcó como bloqueante nº 6
(«o se mueve GJ-01 al final, o la explicación de GJ-01 se limita al caso de
"não"»); la v3 lo dejó tal cual. **Tres ítems del lote se examinan de colocação y
el ítem nº 1 da la regla completa.**

### 4.2 GRAVE · GJ-02 → GJ-09, y GJ-09 lleva la clave dentro

GJ-02 (pos 2) enseña en su explicación que la hipotética pide **imperfeito do
conjuntivo**, con la forma «se eu **fosse**». GJ-09 (pos 8) es
«…sem que ninguém o viu, **como se fosse** um ladrão», y su explicación lo firma:

> «la propia frase trae el contraste delante: «como se fosse» ya está bien
> puesto, así que **el ítem se resuelve comparando sus dos mitades**.»

Doble regalo: la forma correcta está escrita en la propia frase **y** ya se
explicó seis ítems antes. La v2 pidió retirar GJ-09; la v3 lo conservó con la
confesión intacta. Con la regla de corte no se puede retirar (rompe el molde),
así que **hay que quitarle la clave a la frase**:

> «Ele saiu de casa sem que ninguém o viu, **com os sapatos na mão**.»
> repair: «…sem que ninguém o **visse**, com os sapatos na mão.»

(Verificado: con este cambio + el de GJ-12, el preflight de 12 rasgos sale
**EXIT=0**.)

### 4.3 La cita de GJ-16 a GJ-05: **resuelve la contradicción, pero es una fuga de OTRO tipo**

Sobre lo que se preguntaba: **la cita hace su trabajo.** Sin ella el lote afirma
dos cosas incompatibles —GJ-05 marca BIEN «Hei de **te** contar» (clítico
antepuesto sin atractor) y GJ-16 dice que la próclise sin atractor es el error—
y la salvedad traza la línea correcta: la regla del atractor manda sobre el
**verbo finito simple**, no sobre el predicado complejo. Contradicción cerrada.

**Pero la cita, tal como está escrita, no puede publicarse:**

> «(como «Hei de te contar», **aquí mismo en GJ-05**)»

`GJ-05` es un id **del documento**, no del catálogo. Al publicar, los ítems pasan
a `b2c2-gj-lXX-NN` y el alumno los ve sueltos en el SRS, nunca numerados ni en
este orden. Verificado:

```
$ node -e "…busca /GJ-\d|b2c2-gj-|ítem anterior|ejercicio anterior/ en data…"
ítems publicados cuya explicación referencia otro ítem por id: 0
```

**Cero de 2.431.** Sería la primera referencia colgante del catálogo. Se arregla
en un paso haciéndola autónoma: «…en las perífrasis —«hei de te contar», «vou
dizer-te»— el clítico puede ir delante del infinitivo sin atractor…».

*Direccionalidad, para no exagerar:* la cita apunta **hacia atrás**, a un ítem ya
respondido, así que no filtra la respuesta de GJ-16. La fuga hacia GJ-16 viene de
GJ-01 (§4.1), no de aquí.

### 4.4 GJ-05 **contradice a un ítem publicado**

GJ-05 afirma: «"Haver de + infinitivo" es la perífrasis europea de intención
firme, **que el español no tiene con ese valor**». El catálogo ya publica lo
contrario:

```
b2c2-gj-l3-03  «Hei de visitar o Porto um dia.» BIEN
  «'Haver de + infinitivo' expresa promesa/determinación… El español TAMBIÉN
   TIENE 'he de', pero más libresco — aquí no lo evites: es habla viva.»
```

Dos ítems del mismo catálogo, misma construcción, mismo veredicto, afirmaciones
opuestas sobre el español. Un paso: borrar la cláusula «que el español no tiene
con ese valor».

### 4.5 Puntos que el lote **reenseña sin declararlo** — y el gate no ve ninguno

El gate del preflight compara por solape IDF. Corrido por mí sobre la **frase
desnuda** (núcleo didáctico escrito a mano: verbo + complemento regido, sin
adjuntos ni coleta), que es la recomendación nº 10 del informe de la v2:

| candidato | ya publicado | score desnudo | lo que da el preflight |
|---|---|---:|---|
| **GJ-01** «Não disse-me nada» | `b2c2-gj-l2-19` «Ela me disse que vinha.» → «Ela disse-me que vinha.» | **0,679 ⛔** | aviso 0,389 |
| GJ-01 | `b2c2-gj-l3-12` «Ele disse-me de que vinha hoje.» | 0,452 | — |
| GJ-05 «Hei de…» | `b2c2-gj-l3-03` «Hei de visitar o Porto um dia.» BIEN | <0,30 | — |
| GJ-06 «Fiquei a pensar» | `b2c2-gj-l9-07` «Fiquei a saber **ontem** que…» BIEN · `b7-ep-05` «ficou esperando»→«ficou a esperar» | 0,361 | aviso 0,406 |
| GJ-08 «vai melhorando **aos poucos**» | `10c85d3c` «Ele vai entrando **aos poucos** em confiança» | 0,370 | — |
| **GJ-14** «deu por mim» | `b2c2-gj-l4-20` «Quando dei por ela…» BIEN — **en la MISMA lección `b11-l2`** | <0,30 | — |

Dos consecuencias.

**(a) El umbral de bloqueo del propio preflight (0,5) lo cruza GJ-01 al
desnudarlo: 0,679.** Y la sonda de núcleo que la v3 añadió para esto **es un
no-op en los cinco ítems sin coma** (GJ-01, GJ-04, GJ-06, GJ-08, GJ-16): la
función parte por comas y se queda con el trozo más largo, que sin comas es la
frase entera. Se ve en la salida pegada — `GJ-01·núcleo` puntúa exactamente lo
mismo que `GJ-01`. **El arreglo de la v2 se implementó donde no hacía falta y
falla justo donde vive la colisión.**

Ahora bien, GJ-01 **no es un duplicado**: `b2c2-gj-l2-19` enseña «sin atractor →
ênclise» y GJ-01 enseña «con atractor → próclise». Son las dos mitades
complementarias de la misma regla, y enseñar la segunda después de la primera es
correcto. Lo que no vale es que pase **sin declararse**. Un paso: declararlo en
el doc y en el ítem, con el id al lado.

**(b) GJ-14 duplica un ítem que ya está contado en el «antes».** `b2c2-gj-l4-20`
vive en `b11-l2-regencias-que-traem` y es **uno de los 10** con los que el doc
calcula el «antes = 10» de `b11-regencias`. Publicar GJ-14 como ítem nuevo del
mismo punto **cuenta `dar por` dos veces**. El gate no lo ve porque las dos
frases no comparten léxico: es ceguera de PUNTO, no de palabras — y los 121
ítems del corpus con `concepts: []` (entre ellos `b2c2-gj-l4-20`, `l2-19`,
`l3-03`) dejan apagado el segundo eje del gate, el que compara conceptos.

### 4.6 Pares que enseñan lo mismo dos veces **dentro del lote**

| par | qué comparten | severidad |
|---|---|---|
| **GJ-11 + GJ-12** (adyacentes, los dos MAL) | transversal `reg-verbal-a`. Tras leer GJ-11 («chegar **A**; "chegar em" es brasileño») el alumno llega a GJ-12 cebado a buscar una «a» que falta | alta: son **los dos únicos MAL de la sección B** |
| **GJ-13 + GJ-14** (adyacentes, los dos BIEN) | transversal `reg-verbal-em` | media |
| **GJ-10 + GJ-16** (los dos BIEN) | `b8-coloc-enclise` sobre verbo finito en afirmativa | media |
| GJ-02 + GJ-09 | imperfeito do conjuntivo | ver §4.2 |

La sección B «regencias — 6» cubre en realidad **dos** clases de régimen
(A ×2, EM ×2) más un `com` y una colocação. No son seis puntos: son tres.

### 4.7 «Vejo o meu pai» (GJ-12): **no es fuga**

Comprobado: la «a» personal no existe como punto enseñado en el catálogo
(0 ítems), y ningún otro ítem del lote depende de ella. El par de contraste vive
dentro de la explicación y ahí es legítimo. *(La afirmación en sí es del revisor
lingüístico, no mía.)*

### 4.8 Una contradicción del catálogo que este lote destapa

GJ-11 condena «chegar em» como brasileñismo. El catálogo publica, como **modelo
correcto**, un flashcard de infinitivo pessoal:

```
0b4ea261 [flashcard]  ejemplo: «Ao eu chegar EM casa, VOU TE ligar. / Ao chegares tu, avisa-me.»
```

«chegar em» + próclise brasileña, dado como ejemplo bueno. No es culpa del lote
—y no lo bloquea—, pero publicar GJ-11 sin arreglar `0b4ea261` deja al alumno
con las dos cosas. **Ticket para el backlog, no para esta ronda.**

---

## 5 · LAS DOS LÁPIDAS · **la decisión es correcta. No había reposición evidente — y demostrarlo destapó lo peor del gate**

**GJ-07 y GJ-15 se matan bien.** Verifiqué las tres muertes y las tres se
sostienen: `b2c2-gj-l5-10` publica «Ontem tenho falado com o teu pai» con la
misma explicación (0,674), `b2c2-gj-l4-17` publica «Ontem assistimos o jogo todo
na televisão» (0,515), y `apaixonar-se de` lo desmiente Camilo. Nada que objetar.

Escribí **siete** candidatas más y las medí antes de defender ninguna. **Murieron
las siete.** La tabla, con su causa de muerte:

| candidata | por qué muere |
|---|---|
| **«Estamos a jantar com eles no sábado»** → «Jantamos…» (`estar a` proyectado al futuro) | **YA ESTÁ PUBLICADO**: `b2c2-gj-l3-07` «Estou a jantar com eles **na sexta-feira**» → «Vou jantar com eles na sexta-feira», MAL, explicación «*'Estar a + infinitivo' es SOLO presente en curso: NO proyecta al futuro*». Es el mismo ítem con otro día de la semana |
| «estava fazendo o jantar» → «estava a fazer» | publicado cuatro veces: `b7-ep-03`, `b7-ep-07`, `b7-ep-10`, `b7-ep-14`, más `b2c2-gj-l2-04` «Estou esperando o autocarro» |
| «Faz três meses que não o vejo» → «Há três meses…» | **0,769 ⛔** contra `e6fb129d`, un flashcard que usa «Faz três meses que não te vejo» **como MODELO correcto** |
| «desde há cinco anos» → «há cinco anos» | 0,491 contra `b2c2-gj-06` «Conheço-a desde faz cinco anos» |
| «Mal cheguei, a reunião já tinha acabado» | `b2c2-gj-l9-01` ya publica «Mal saímos do teatro…» con el mismo punto |
| «Vou-te dizer» → «Vou dizer-te» | **no es MAL**: la subida del clítico en perífrasis es correcta en europeo — lo dice el propio GJ-16 |
| «Ele deve de estar cansado» → «deve estar» | **no es MAL**: «dever de» + inf es la forma tradicional de suposición |

**Conclusión sobre las lápidas: la decisión de matar GJ-07 y GJ-15 es correcta, y
no había una reposición evidente que se te escapara.** Diez intentos (tus tres,
mis siete) y diez muertes no es mala suerte: es que el punto, medido por
construcción y no por etiqueta, **ya está mucho más cubierto de lo que el conteo
de `concepts` deja ver** (§3: once juicios publicados de aspecto/tiempo, tres
declarados).

### Y el informe de la v2, que prescribía la reposición por su nombre, se equivocó

> «`estar a + infinitivo` … **no tiene ni un solo juicio de gramaticalidad en todo
> el catálogo**» — informe pedagógico v2, §6

Falso. Hay **tres**, y uno de ellos es exactamente el ítem que el mismo informe
mandaba escribir:

```
b2c2-gj-l1-01  «Está a chover desde ontem.»               BIEN
b2c2-gj-l2-04  «Estou esperando o autocarro.»             MAL → «Estou a esperar…»
b2c2-gj-l3-07  «Estou a jantar com eles na sexta-feira.»  MAL → «Vou jantar com eles na sexta-feira.»
```

Los tres con `concepts: []` bajo `b8-l1-conectores-subordinadas-adverbiais`. El
revisor de la v2 buscó por ETIQUETA y no encontró nada; yo busqué por
CONSTRUCCIÓN y aparecieron. **Es la misma ceguera que este informe le reprocha al
lote, cometida por el informe anterior.** Que se anote: una corrección de un
revisor no es verdad por ser de un revisor.

### El hallazgo grande: **el gate mide sustantivos, no puntos**

Mi candidata y su gemela publicada son el mismo ejercicio. El gate, medido:

```
## REPO-A completa — «Estamos a jantar com eles no sábado, por isso não contes connosco.»
   contra b2c2-gj-l3-07 → score 0.159 · comparten: jantar
   (ninguno por encima de 0.34)

## REPO-A desnuda — «Estamos a jantar com eles no sábado.»
   contra b2c2-gj-l3-07 → score 0.22 · comparten: jantar
   (ninguno por encima de 0.34)

## REPO-A calcada — «Estou a jantar com eles na sexta-feira.»
   contra b2c2-gj-l3-07 → score 1 · comparten: sexta-feira, jantar, estou, vou
```

> **Cambiar «sexta-feira» por «sábado» y «Estou» por «Estamos» hace caer el score
> de 1,00 a 0,22 — un factor de 4,5 — sin cambiar ni una coma de lo que el ítem
> enseña.** El umbral de aviso es 0,34 y el de bloqueo 0,50: el duplicado perfecto
> pasa invisible.

Eso reinterpreta las tres muertes del doc. Las tres reposiciones no murieron por
duplicar el PUNTO: murieron por **reutilizar los sustantivos** («o teu pai», «o
jogo todo»). Una cuarta que hubiera repetido el punto cambiando los sustantivos
habría entrado sin que el gate dijera nada — que es exactamente lo que casi pasa
conmigo, y lo que sí está pasando con **GJ-14** (§4.5b).

**El gate protege contra el copiar-y-pegar, no contra el reenseñar.** Su segundo
eje —el de `concepts`— existe para eso y está apagado: 121 ítems con
`concepts: []`, entre ellos los seis con los que este lote choca. Mientras no se
haga el backfill, **la única defensa real contra la repetición es el grep por
construcción, a mano**, y eso hay que escribirlo en el procedimiento del lote 11.

---

## 6 · LA CONSECUENCIA DECLARADA · **la premisa es falsa**

> «Consecuencia declarada: `b11-aspecto-tempo` se queda a **uno** del piso.»

No, por dos motivos que van en direcciones opuestas y ninguno de los cuales es
«uno».

**Contando lo que los ítems del lote enseñan de verdad, se queda a CINCO**
(§3): 3 etiquetados + 3 que realmente enseñan el punto (GJ-03, GJ-05, GJ-06; 4
si se cuenta GJ-08, que es más `b7-gerundio`) = **6 de 12**. Y de esos tres,
GJ-05 y GJ-06 refinan puntos ya publicados (`b2c2-gj-l3-03`,
`b2c2-gj-l9-07`/`b7-ep-05`): en ítems **nuevos** de verdad, el punto suma **uno**,
GJ-03.

**Y contando lo que el corpus ya tiene, puede que no falte nada**: hay once
juicios publicados de aspecto/tiempo y sólo tres lo declaran (§3). Las dos cosas
son ciertas a la vez, y juntas dicen lo único que importa: **con las etiquetas de
hoy, la cifra «11 de 12» no significa nada** — ni la que el doc escribe ni la que
yo escribo. Lo que hay que publicar no es un número, es la manera de obtenerlo.

**¿Merece la pena publicar así? Sí, con dos condiciones.**

1. **Publicar el contenido, corregir la contabilidad.** Los 14 ítems son material
   usable —cuatro de ellos francamente buenos (§7)— y `b11-regencias` cierra de
   verdad (10 + 4 = 14 ≥ 12), que era la mitad del objetivo del lote. Tirar 14
   ítems válidos por una etiqueta mal puesta sería el error contrario.
2. **Lo que NO se puede publicar es la tabla de cabecera.** Si sale como está,
   `recuento-conceptos.ts` marcará `b11-aspecto-tempo = 11` y el punto quedará
   registrado como casi cerrado. Nadie volverá a mirarlo. Eso es una cifra falsa
   metida en el sistema de medición que este proyecto usa para decidir dónde
   trabajar — el daño no es del lote, es de las diez sesiones siguientes.

**¿Falta algo? Sí, pero no es lo que el doc cree.** No faltan «ítems de aspecto y
tiempo»: hay **once publicados** y sólo tres declarados (§3). Lo que falta es
**el backfill de `concepts` sobre esos ocho**, que es trabajo de una tarde y
probablemente cierra el punto solo — `3 + 8 + 3 = 14 ≥ 12`. Escribir seis ítems
nuevos para un punto que quizá ya esté cerrado sería la peor decisión posible, y
es a lo que empuja la tabla de cabecera tal como está.

El orden correcto para el lote 11, entonces, no es «escribir seis ítems» sino:
**(1) backfill de `concepts`; (2) volver a medir; (3) escribir sólo lo que falte
de verdad, y que sea MAL en construcción europea** (§2), que es lo único que este
lote no tiene y que no se arregla con etiquetas.

---

## 7 · QUÉ ESTÁ BIEN (específico — sin esto el informe no sirve para decidir)

- **Las diez correcciones obligatorias están aplicadas de verdad, una a una.**
  Las verifiqué contra el texto de la v2: la causa de GJ-01 está del derecho, GJ-05
  está acotado a la subordinada temporal («Quando nos vemos?» está bien), GJ-06
  reconoce los 48 casos de `ficar` + gerundio, GJ-10 movió el contraste `por`/`para`
  al destinatario, GJ-12 tiene causa real en vez de inventada, GJ-13 cita Priberam
  ac. 11, GJ-14 dice `contração` y no `crase`, y GJ-16 trae la salvedad. **Las tres
  correcciones que la v2 había perdido (GJ-05, GJ-06, GJ-16) están recuperadas.**
  Es la primera vez en esta serie que una ronda no pierde trabajo ya pagado.
- **El equilibrio del arranque se hizo bien y sin trampa.** GJ-06 pasó de «Fiquei a
  pensar no que me disseste **ontem à noite** e não preguei olho» a «**Ontem à
  noite** fiquei a pensar no que me disseste e não preguei olho»: es un traslado
  del mismo adjunto, no una frase nueva. El rasgo cae de 12/16 (p=0,038) a **8/14
  (p=0,395)** — reproducido por mí. *(Con GJ-14 el doc se pasa de fino: no es un
  traslado, se cambió el coordinante «e» por «Quando» y eso sí es sintaxis nueva.
  El resultado es correcto; la descripción, no del todo.)*
- **El preflight pegado es fiel a la batería, byte a byte** en atajos, virginidad
  y veredicto. La enfermedad de las cifras a mano sigue curada.
- **`lleva una palabra visiblemente española`: 0 presentes.** Ni un lusismo léxico.
  El lote no es A2 disfrazado *por esa* vía; lo es por la de la glosa.
- **GJ-12 (`obedecer a`) es virgen de verdad**: `0 ocurrencias de "obedec"` en los
  2.431 ítems. `bater à porta`: 0. Son los dos puntos genuinamente nuevos del lote.
- **GJ-08 sigue siendo el mejor ítem del lote**: un BIEN que existe para impedir
  que la regla se lea como «en portugués europeo nunca hay gerundio», que así
  enunciada es falsa. Hedge con verdad.
- **Las tres lápidas están bien argumentadas y con sus cifras** (0,674 / 0,515 /
  la atestación de Camilo), y **la decisión aguanta una auditoría independiente**:
  escribí siete reposiciones más y murieron las siete (§5). El instinto de no
  aflojar un gate para que pase el propio lote —dicho explícitamente en la lápida
  de GJ-07— es exactamente el criterio correcto, y es lo mejor del documento.
- **El banco explícito para el lote siguiente** («Tenho dormido mal estas últimas
  semanas…», con el motivo de por qué no entra hoy: dejaría el molde en
  desequilibrio 3) es la forma correcta de no perder trabajo entre rondas.
- **El molde pasa entero**, incluido el criterio nuevo de solape con los lotes
  publicados que apareció esta misma tarde (l8 en el filo, 3,0 de 3,0).

---

## 8 · BLOQUEANTES · lista cerrada, cada uno accionable en un paso

| # | bloqueante | acción, un paso | verificación |
|---|---|---|---|
| **B1** | **Atajo nuevo**: «exhibe una construcción europea marcada» acierta **11/14, p=0,029** (tasa base publicada 53 %, ningún lote >60 %). Con el rasgo en la batería el preflight sale **EXIT=1** | (a) añadir el rasgo a `scripts/lib/atajos.ts` (código en §1); (b) **GJ-12** → «Os miúdos **costumam** obedecer os avós…» / repair «…**costumam** obedecer **aos** avós…» | corrido: baja a **10/14, p=0,090**; preflight de 12 rasgos **EXIT=0** |
| **B2** | **Etiquetado falso**: 6 de 14 ítems declaran un punto que no enseñan; publicado así, `recuento-conceptos` dirá `b11-aspecto-tempo = 11` cuando son 6 | reescribir `concepts` de cada ítem con la tabla de §3, y **corregir la tabla de cabecera**: `b11-aspecto-tempo` **3 → 6**, no 3 → 11. Y decir en el doc que el «3» de partida es un conteo de etiquetas, no del punto (hay 11 juicios publicados de aspecto/tiempo) | conteos de §3, medidos sobre los 2.431 |
| **B3** | **GJ-01 (ítem nº 1) regala GJ-10 y GJ-16** — bloqueante nº 6 de la v2, no aplicado | borrar de la explicación de GJ-01 la última oración («el error sale de haber aprendido que la ênclise es lo normal…»); el resto de la explicación se sostiene sola | — |
| **B4** | **GJ-09 lleva la clave dentro de la frase** y la explicación lo confiesa | cambiar la coleta: «…sem que ninguém o viu, **com os sapatos na mão**.» / repair «…o **visse**, com os sapatos na mão.» y borrar la frase «el ítem se resuelve comparando sus dos mitades» | corrido junto con B1: preflight **EXIT=0** |
| **B5** | **GJ-16 cita «GJ-05»**, un id que no existe fuera de este documento (0 de 2.431 ítems publicados referencian a otro por id) | reescribir la salvedad autónoma: «…en las perífrasis —«hei de te contar», «vou dizer-te»— el clítico puede ir delante del infinitivo sin atractor…» | `grep` sobre `blocks/*.json`: 0 precedentes |
| **B6** | **Reenseñanza no declarada de 5 puntos publicados**, uno de ellos por encima del umbral de bloqueo del propio gate (**GJ-01 ↔ `b2c2-gj-l2-19` = 0,679** desnudo) | añadir al doc una línea por ítem con el id del publicado: GJ-01↔`b2c2-gj-l2-19`, GJ-05↔`b2c2-gj-l3-03`, GJ-06↔`b2c2-gj-l9-07`+`b7-ep-05`, GJ-08↔`10c85d3c`, GJ-14↔`b2c2-gj-l4-20`; y **no contarlos como cobertura nueva** | scores del §4.5 |

**No bloquean, pero van al backlog del lote 11** (deuda de herramienta y de
contenido, en este orden):

1. **El gate mide sustantivos, no puntos** (§5). Cambiar el día de la semana y la
   persona del verbo hace caer un duplicado perfecto de **1,00 a 0,22**, por
   debajo del umbral de aviso (0,34). Es el hallazgo más grave de la auditoría y
   no lo arregla ningún umbral: hace falta el segundo eje (`concepts`) o un grep
   por construcción escrito en el procedimiento.
2. **Backfill de `concepts`**: 121 ítems con `concepts: []`, entre ellos los seis
   con los que choca este lote y los ocho juicios de aspecto/tiempo que no
   declaran su punto (§3). Sin esto, el segundo eje del gate es decorativo y el
   recuento de cobertura no mide el curso.
3. La sonda de núcleo es un **no-op en los ítems sin coma** (§4.5a). Sustituirla
   por el par `(sentence, repair)` truncado a la ventana donde difieren, o por un
   desnudo declarado a mano. Hoy es la diferencia entre 0,389 y 0,679.
4. `preflight-lote.ts` debe estampar **su propio** hash, no sólo el de `atajos.ts`
   (§0): la salida pegada de este doc ya está caducada y nada lo indicaba.
5. `b11` **no tiene partición** en `conceptos-finos.ts`. Mientras no la tenga, sus
   ítems no se pueden auditar por sub-punto y todo cae en dos cubos enormes.
6. Reconciliar **163 vs 186 puntos** antes de volver a usar la cifra como
   denominador de la meta.
7. `0b4ea261` publica «Ao eu chegar **em** casa, **vou te** ligar» como modelo
   correcto, y GJ-11 lo condena (§4.8).
8. Para el lote 11, el orden es **backfill → medir → escribir**, no al revés (§6);
   y lo que se escriba tiene que ser **MAL en construcción europea** (§2), que es
   lo único que este lote no tiene.

---

### Comandos corridos, para que cualquiera reproduzca

```
npx tsx scripts/preflight-lote.ts docs/contenido/2026-09-03-lote10-b2c2-v3.md          # EXIT=0, batería de 11
diff <(sed -n '59,125p' <doc>) <(salida real)                                          # sólo difiere la sección Molde
<copia del repo con el rasgo 12 en atajos.ts>  preflight-lote.ts <doc>                 # EXIT=1, 11/14 p=0.029
<copia del repo>  preflight-lote.ts <doc con GJ-12 y GJ-09 parcheados>                 # EXIT=0, 10/14 p=0.090
<script propio>   medirRasgo/pValor del repo sobre v1, v2, v3 y los 146 publicados     # tasa base 77/146 = 53 %
<script propio>   virginidad.ts sobre las 14 frases DESNUDAS + 10 candidatas de repos. # GJ-01 = 0.679
<script propio>   virginidad.ts: REPO-A vs b2c2-gj-l3-07 en tres redacciones           # 1.00 / 0.22 / 0.159
node -e "…"       conteos de concepts sobre lib/data/languages/pt/blocks/*.json        # 3 · 10 · 121 sin concepts
node -e "…"       juicios que EXHIBEN aspecto/tiempo, por construcción no por etiqueta # 10(+1) de 146, 3 declarados
node -e "…"       greps de construcción: obedecer 0 · bater à porta 0 · estar a + inf 38 (3 juicios)
```

El repo no se ha modificado. Los parches viven en
`/private/tmp/claude-501/-Users-lalo/81a35124-6606-4ff5-b312-6a66f19a4678/scratchpad/repo/`.
