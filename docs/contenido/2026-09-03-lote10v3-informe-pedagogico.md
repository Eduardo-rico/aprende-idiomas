# Lote 10 B2C2 **v3** — revisión PEDAGÓGICA Y DE DISEÑO (ronda 3, la última)

Revisor #2 (ángulo pedagógico). No he hablado con el revisor lingüístico.
Doc auditado: `docs/contenido/2026-09-03-lote10-b2c2-v3.md`, estado del
`2026-08-31 17:56:55` (el documento cambió dos veces mientras lo auditaba; todo
lo que sigue está medido contra esta versión).
Repo: `/Users/lalo/idiomas/portugues-app` · sello del preflight `eb2f75bf`,
reproducido.

---

## VEREDICTO GLOBAL: **PUBLICA-CON-CORRECCIONES** — 8 bloqueantes

Siete de los ocho se cierran en un paso y los he verificado corriendo el
preflight. **El octavo no se puede cerrar dentro de este lote**, y por eso el
veredicto lleva condición: el lote sólo debe publicar si ese atajo se declara con
su cifra en el documento, en vez de salir con la cifra que hoy figura, que está
mal medida.

Lo esencial, en tres frases:

1. **El rasgo 13 existe y bloquea**: «si la frase LUCE portugués europeo ⇒ está
   BIEN» acierta **12/14 (p=0,006** binomial del repo; **0,016** hipergeométrico),
   con tasa base del 53 % en los 146 juicios publicados. Se arregla en dos
   ediciones — verificado, **EXIT=0**.
2. **El rasgo 12 que acabáis de añadir está infra-medido por sus propias
   declaraciones**: dos de las catorce glosas están juzgadas con un criterio
   distinto del que se aplica a las otras doce. Corregidas, el rasgo pasa de
   **9/14 (p=0,212)** a **11/14 (p=0,029)** y **bloquea** — verificado, EXIT=1.
   Y **ninguna edición lo desbloquea**: los seis MAL, los seis, son cazables desde
   el español. Eso es una propiedad del PUNTO, no de las frases.
3. **El arreglo de los `<Example>` cambió las cadenas y dejó el atajo.** El
   shortcut «está en la lección ⇒ BIEN» valía 10/14 con las frases literales;
   medido a nivel de CONSTRUCCIÓN —que es como lo aplica un alumno— vale
   **11/14 (p=0,029)** antes y después del cambio. Las cuatro frases nuevas usan
   las cuatro construcciones del `<Example>` de la lección con otras palabras.

Y lo que sí está bien, que es mucho, en §7. **Sobre las lápidas: hiciste bien**
(§5) — escribí siete reposiciones más y murieron las siete.

---

## 0 · El preflight pegado · **ahora sí es reproducible, y eso hay que decirlo**

```
$ npx tsx scripts/preflight-lote.ts docs/contenido/2026-09-03-lote10-b2c2-v3.md
EXIT=0
$ diff <(sed -n '80,170p' <doc>) <(salida real)
(sin diferencias)
```

Byte a byte, incluidas las tablas de molde, atajos y virginidad. Y el sello
`eb2f75bf` **cubre ahora los tres ficheros** (`atajos.ts`, `pares-minimos.ts`,
`preflight-lote.ts`) unidos por `\0`, no sólo la batería. Verificado que
reproduce.

Esto cierra el agujero que encontré en la pasada anterior de esta auditoría —
`preflight-lote.ts` había cambiado después de pegarse la salida y el sello, que
sólo miraba `atajos.ts`, seguía dando luz verde con la sección de molde ya
caducada. **Arreglado y comprobado.**

---

## 1 · ATAJOS

### 1.1 · **EL RASGO 13: la construcción europea marcada** — 12/14, p=0,006

> **«Si la frase EXHIBE portugués europeo marcado —una perífrasis aspectual, un
> *haver de*, un futuro do conjuntivo, una ênclise sobre verbo finito— está
> BIEN.»**

Se ejecuta sin evaluar la gramaticalidad ni una sola vez: basta reconocer si la
frase *luce* algo del inventario que la lección presume. Es un atajo de
**reconocimiento de vitrina**, y es de un tipo que la batería no tiene: los doce
rasgos actuales miran el TEXTO (bolsa de palabras, longitud, comas), la POSICIÓN
(en la frase, en el lote) o la GLOSA. **Ninguno mira qué gramática exhibe la
frase.**

Medido con `medirRasgo`/`pValor` del propio repo, acierto sobre N=14:

```
exhibe construcción europea marcada    12/14 (86 %)  presente⇒BIEN  presentes 8  p=0.0065  ⚠
```

```
GJ-01 · SÍ (ênclise sobre finito: «disse-me»)            ⇒ BIEN · real MAL  · falla
GJ-02 · no                                                ⇒ MAL  · real MAL  · ACIERTA
GJ-03 · SÍ (costumar + inf)                               ⇒ BIEN · real BIEN · ACIERTA
GJ-04 · no                                                ⇒ MAL  · real MAL  · ACIERTA
GJ-05 · SÍ (haver de + inf · futuro do conjuntivo)        ⇒ BIEN · real BIEN · ACIERTA
GJ-06 · SÍ (ficar A + infinitivo)                         ⇒ BIEN · real BIEN · ACIERTA
GJ-08 · SÍ (ir + gerúndio)                                ⇒ BIEN · real BIEN · ACIERTA
GJ-09 · no                                                ⇒ MAL  · real MAL  · ACIERTA
GJ-10 · SÍ (ênclise sobre finito: «Deram-me»)             ⇒ BIEN · real BIEN · ACIERTA
GJ-11 · no                                                ⇒ MAL  · real MAL  · ACIERTA
GJ-12 · no                                                ⇒ MAL  · real MAL  · ACIERTA
GJ-13 · no                                                ⇒ MAL  · real BIEN · falla
GJ-14 · SÍ (dar por = notar)                              ⇒ BIEN · real BIEN · ACIERTA
GJ-16 · SÍ (ênclise sobre finito: «Casou-se»)             ⇒ BIEN · real BIEN · ACIERTA
```

2×2: **presente 7 BIEN / 1 MAL · ausente 5 MAL / 1 BIEN.**

**El null estricto, dicho antes de que me lo pidan.** El `pValor` del repo compara
contra p=0,5, y con 8 BIEN / 6 MAL el predictor constante ya saca 8/14 gratis
(por eso hay dos rasgos con `presente en 0` declarando «57 %»). Bajo el
hipergeométrico exacto, que respeta el desequilibrio de clases y el número de
presentes:

```
rasgo 13 · hipergeométrico exacto una cola = 0.0163   (presentes 8, de ellos BIEN 7)
```

**Bloquea bajo los dos nulos.** El rasgo 12 recién añadido, en cambio, sólo
bloquea bajo uno de los dos: ver §1.2.

**Control — ¿no serán así todos los lotes?** Mismo rasgo sobre los **146 juicios
publicados**, misma dirección:

```
l1  9/20 (45 %)   l4 12/20 (60 %)   l7  4/10 (40 %)
l2 12/20 (60 %)   l5 12/20 (60 %)   l8  5/10 (50 %)
l3 10/20 (50 %)   l6  5/10 (50 %)   l9  6/10 (60 %)
TODOS  78/146  (53 %) · presentes 34
```

**Ningún lote publicado pasa del 60 %. El candidato saca 86 %.** No es un
artefacto de la lengua ni del formato: es de este lote.

**Y es viejo.** Medido sobre las tres versiones con el mismo código: v1 y v2 daban
**12/16 (p=0,038)** y v3 da **12/14 (p=0,006)**. El rasgo llevaba bloqueando
desde la primera versión y sobrevivió a tres rondas de arreglos anti-atajo porque
las tres atacaron la superficie (longitud, arranque, cadena literal del
`<Example>`) y ninguna miró el reparto del contenido.

### 1.2 · El **rasgo 12 está infra-medido por sus propias declaraciones**

El coordinador pidió expresamente que auditara las catorce glosas. Lo he hecho
una a una. **Discrepo en dos, y las dos van en la misma dirección.**

| ítem | v/f | glosa declarada | juicio del doc | mi juicio |
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
«Casóse con una arquitecta» **son español bien formado**. La ênclise sobre verbo
finito es arcaica y literaria en español, no agramatical: «Diéronle las gracias»,
«Fuese y no hubo nada». Lo que las hace parecer imposibles en la glosa es **el
guion**, que es una convención ortográfica portuguesa que el glosador arrastró:
escritas a la española —«Diéronme», «Casóse»— pasan.

Y el criterio operativo del rasgo es *¿el oído del hispanohablante rechaza el
resultado?*. Ante «Deram-me os parabéns» ese oído registra «antiguo», no «malo»:
**no puede usar su L1 para rechazarlo.** Luego el ítem no se resuelve desde el
español, luego la glosa es CORRECTO.

**El contra-test, que es lo que hace sólido el criterio:** GJ-01 sigue siendo
INCORRECTO, y con razón — «no díjome nada» es imposible en *cualquier* registro
del español, porque la negación fuerza la próclise igual que en portugués. El
criterio discrimina bien; sólo estaba mal aplicado en los dos ítems donde no hay
atractor.

**El efecto, medido:**

```
$ preflight con las dos glosas corregidas
| la glosa palabra-por-palabra al español es español correcto ⚠ | **11/14** (79 %) | presente⇒BIEN | 5 | 0.029 |
**1 BLOQUEANTES — el round NO se abre:**
- atajo «la glosa palabra-por-palabra al español es español correcto»: acierta 11/14 (p=0.029)
EXIT=1
```

De **9/14 (p=0,212)** a **11/14 (p=0,029)**, y de «no bloquea» a «bloquea».
Hipergeométrico exacto: **0,0280** — bloquea también bajo el null estricto,
porque los cinco presentes son BIEN los cinco.

**La causa de fondo: el criterio no está escrito.** El doc aplica dos reglas
distintas sin decirlo — la literal estricta a la ênclise (GJ-10, GJ-16
→ INCORRECTO por el guion) y la caritativa a GJ-13, donde «deve **ter** custado»
se glosa «debe **de haber** costado», que ya no es palabra por palabra (la
literal, «debe tener costado», sería INCORRECTO). Un rasgo que se declara a mano
necesita su criterio escrito **en el código, al lado del rasgo**, o cada lote lo
aplicará distinto. Ése es el arreglo de un paso.

**Y lo que no tiene arreglo dentro de este lote.** Los cinco presentes son los
cinco BIEN y **ningún MAL puede tener glosa correcta**: repasados los seis, los
seis rompen el español (`no dijo-me`, `si yo sería`, `espero que viene`, `sin que
nadie lo vio`, `llegamos en Faro`, `obedecen los abuelos`). No es un problema de
redacción — es que los seis puntos examinados son puntos donde el español elige
distinto y por tanto **avisa**. Lo dice ya el comentario del propio rasgo en
`atajos.ts`, y suscribo cada palabra:

> «La única defensa es de contenido: que el punto sea de verdad divergente del
> español. Si el español elige igual que el portugués, el punto no se puede
> examinar con juicios binarios — **hay que cambiar de formato, no de frases**.»

### 1.3 · El arreglo de los `<Example>` **cambió las cadenas y dejó el atajo**

El `<Example>` de `b11-l4-aspecto-e-tempo` contiene siete frases:

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
cinco BIEN**. Acierto **11/14, p=0,029**, hipergeométrico 0,0280.

> **El atajo de la cadena literal valía 10/14. El de la construcción vale 11/14, y
> vale lo mismo antes y después del cambio de frases.** Indexar `mdx/` fue una
> mejora real del gate —y hay que reconocerla— pero atacó el síntoma: el gate
> compara cadenas y el alumno reconoce construcciones.

### 1.4 · El arreglo de un paso para el rasgo 13, verificado

Retirar ítems **empeora** (quitar GJ-01, el único MAL con el rasgo, sube a 11/13
p=0,011 y además rompe el molde: 8 BIEN contra 5 MAL, desequilibrio 3 > 2). Lo
que funciona es meter portugués europeo en la mitad **inocente** de dos MAL —la
misma medicina que la v2 aplicó al arranque—, sin tocar el error bajo examen:

> **GJ-12** «Os miúdos **costumam** obedecer os avós sem discutir, o que já é raro
> nesta idade.» · repair «…**costumam** obedecer **aos** avós…»
>
> **GJ-11** «Chegámos em Faro às seis da tarde, depois de **estarmos** sete horas
> **no** comboio.» · repair «Chegámos **a** Faro às seis da tarde, depois de
> estarmos sete horas no comboio.»

Corrido, con el rasgo 13 en la batería (copia en scratchpad; **el repo no se ha
tocado**):

```
$ preflight sin las ediciones
| exhibe una construcción europea marcada … ⚠ | **12/14** (86 %) | presente⇒BIEN | 8 | 0.006 |
EXIT=1

$ preflight con las dos ediciones
| exhibe una construcción europea marcada | **10/14** (71 %) | presente⇒BIEN | 10 | 0.090 |
**Preflight limpio.**
EXIT=0
```

Endurecen los dos ítems (el alumno tiene que no distraerse con un `costumar` y un
infinitivo pessoal correctos) y no rozan lo que examinan.

### 1.5 · El código para `scripts/lib/atajos.ts`

Va en `RASGOS`, después del rasgo de la glosa:

```ts
{
  // RASGO 13. Los doce anteriores miran el TEXTO, la POSICIÓN o la
  // GLOSA. Ninguno mira QUÉ GRAMÁTICA EXHIBE la frase. El lote 10 la
  // reparte de una sola manera: el portugués europeo marcado —perífrasis
  // aspectual, haver de, futuro do conjuntivo, ênclise sobre verbo
  // finito— sólo aparece en los BIEN. «Si la frase LUCE portugués
  // europeo ⇒ está bien» acierta 12/14 (p=0,0065; hipergeométrico
  // 0,0163) sin evaluar gramaticalidad ni una vez. Tasa base en los 146
  // juicios publicados: 53 %, ningún lote por encima del 60 %.
  //
  // Es la versión ROBUSTA del atajo que el gate de <Example> ataca por la
  // cadena: cambiar las palabras de la frase no lo mueve, porque el alumno
  // reconoce la construcción, no la cadena. Medido: 11/14 antes y después
  // de sustituir las cuatro frases literales del <Example> de b11-l4.
  nombre: 'exhibe una construcción europea marcada (perífrasis, fut. do conjuntivo, ênclise sobre finito)',
  f: (x) => {
    const s = x.sentence;
    // ênclise/mesóclise sobre verbo FINITO: el español sólo la tiene viva
    // en infinitivo, gerundio e imperativo, así que «disse-me» está
    // marcado y «levantar-me» no.
    for (const m of s.matchAll(/(?<![\p{L}])([\p{L}]{3,})-(?:me|te|se|lhe|nos|lhes|o|a|os|as|lo|la|los|las)(?![\p{L}-])/giu))
      if (!/(?:ar|er|ir|ôr|or|ndo)$/i.test(m[1]!)) return true;
    return [
      /(?<![\p{L}])(?:hei|hás|há|havemos|hão|havia|havias|havíamos|haviam)\s+d[eo](?![\p{L}])/iu,                 // haver de + inf
      /(?<![\p{L}])costum(?:o|as|a|amos|am|ava|avas|ávamos|avam)(?![\p{L}])/iu,                                    // costumar + inf
      /(?<![\p{L}])(?:est(?:ou|ás|á|amos|ão|ava|avas|ávamos|avam|ive|eve|iveram)|fic(?:o|as|a|amos|am|ava|avam|ou|aram|ámos)|fiqu(?:ei|e|em)|and(?:o|as|a|amos|am|ava|avam|ei|ou)|continu(?:o|a|amos|am|ava|ou)|começ(?:o|a|amos|am|ava|ei|ou))\s+a\s+[\p{L}]+(?:ar|er|ir|ôr)(?![\p{L}])/iu,  // estar/ficar/andar A + inf
      /(?<![\p{L}])(?:vou|vais|vai|vamos|vão|ia|ias|íamos|iam|vem|vêm|vinha|anda|andam|andava)\s+[\p{L}]+ndo(?![\p{L}])/iu,  // ir/vir/andar + gerúndio
      /(?<![\p{L}])(?:for|fores|formos|forem|tiver|tiveres|tivermos|tiverem|puder|puderes|pudermos|puderem|quiser|quiseres|quisermos|quiserem|vier|vieres|viermos|vierem|fizer|fizeres|fizermos|fizerem|souber|soubermos|souberem|estiver|estivermos|estiverem|vires|virmos|virem|[\p{L}]{3,}(?:armos|ermos|irmos|arem|erem|irem|ares|eres|ires))(?![\p{L}])/iu,  // futuro do conjuntivo
      /(?<![\p{L}])(?:dei|deu|deram|dou|dá|dão|dava|davam)\s+por(?![\p{L}])/iu,                                    // dar por (= notar)
    ].some((re) => re.test(s));
  },
},
```

*(Aviso honesto sobre mi propio código: la primera versión que escribí tenía
`fic(...)` sin cubrir `fiqu-`, y por eso me daba 11/14 en vez de 12/14. Está
corregido y la cifra de arriba es la del regex corregido. Un regex mal escrito
infra-mide un atajo exactamente igual que una glosa mal juzgada.)*

---

## 2 · NIVEL REAL · se vende como C1; **como prueba sigue siendo B1**

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
| GJ-10 | BIEN | ênclise en afirmativa | B2 — y ni siquiera: el español tiene «Diéronme» |
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

---

## 3 · ETIQUETADO · la corrección es **correcta pero no suficiente**

La corrección hecha —GJ-01→`b8-coloc-proclise-negacao`, GJ-02→`b5-se-condicional`,
GJ-04→`b6-pres-subj-disparadores`, GJ-09→`b6-contraste-indicativo-subjuntivo`, y
el backfill de los cinco `concepts: []` de `b11-l2`— **está bien hecha y era
necesaria**. Verificado: `b11-regencias` pasa de 5 a **10** por etiqueta, y ya no
hay que contarlo a mano por lección. Eso es exactamente el arreglo correcto.

**Quedan cuatro cosas.**

### 3.1 · GJ-10 sigue mal etiquetado, y es el caso puro

«Deram-me os parabéns pelo trabalho, mas eu bem sei quem fez a parte difícil.»,
declarado `b11-regencias`. Su propia explicación confiesa que la regência no se
puede examinar:

> «…cuando aparece el destinatario, el régimen europeo es **a** … **aquí el
> destinatario es el propio clítico «-me»**.»

El régimen `dar os parabéns **a** alguém` **nunca aflora en la frase**, y «pelo
trabalho» es un `por` causal idéntico al español. Lo único que la frase pone a
prueba es la ênclise. → **`b8-coloc-enclise`** (18 hoy). Etiquetado como
`b11-regencias` infla un punto que no enseña, que es la enfermedad que el round
acaba de curar en la sección A y que sigue viva en la B.

### 3.2 · GJ-16 lleva etiqueta única y enseña dos cosas

Declarado `b11-regencias` (`casar-se com`), pero su explicación dice literalmente
«la trampa no es la preposición: es que el hispanohablante coloca "se casó"».
→ etiqueta doble: `b11-regencias` **+** `b8-coloc-enclise`.

### 3.3 · GJ-09 fue a un punto que no es el suyo, **y encima al que no lo necesita**

`sem que` + imperfeito do conjuntivo no es ninguno de los cinco sub-puntos de
`b6-contraste-indicativo-subjuntivo` (talvez, duda, certeza, impersonales,
emoción). Es `b6-imperfeito-subj` / `b6-imperf-subj-formacao` («visse», -isse).
Y ahí está lo caro:

```
b6-contraste-indicativo-subjuntivo   25   ← al que fue GJ-09 (ya sobre el piso)
b6-pres-subj-disparadores            20   ← al que fue GJ-04 (ya sobre el piso)
b5-se-condicional                    28   ← al que fue GJ-02 (ya sobre el piso)
b8-coloc-proclise-negacao            12   ← al que fue GJ-01 (justo en el piso)

b6-imperfeito-subj                    6   ← el punto REAL de GJ-09      · BAJO EL PISO
b6-presente-subj                      6   ← el punto real de GJ-04      · BAJO EL PISO
b6-futuro-subj                        8   ← secundario de GJ-05         · BAJO EL PISO
b7-gerundio                           9   ← el punto real de GJ-08      · BAJO EL PISO
```

> **Los cuatro re-etiquetados fueron a puntos que ya están en el piso o por
> encima. Ninguno fue a los cuatro que están hambrientos.** Declarar el punto
> real como segundo concepto cuesta cero y da **+4 de cobertura** donde hace
> falta. Es la parte más rentable de todo este informe.

### 3.4 · La sección B son 6 ítems y **3 sub-puntos**

Por las transversales de `conceptos-finos.ts`: `reg-verbal-a` ×2 (GJ-11, GJ-12,
**adyacentes y los dos MAL**), `reg-verbal-em` ×2 (GJ-13, GJ-14, **adyacentes y
los dos BIEN**), `reg-verbal-com` ×1 (GJ-16), colocação ×1 (GJ-10). Contar seis
puntos donde hay tres vuelve a inflar, un nivel más abajo.

Y **GJ-14 se cuenta dos veces**: su `dar por` ya está publicado como
`b2c2-gj-l4-20` «Quando dei por ela, já era meia-noite» —que es **uno de los diez
del "antes"**, en la misma lección `b11-l2`— y además es el `<Example>` #2 de esa
lección. El gate no lo ve: puntúa **<0,30** porque no comparten sustantivos.

---

## 4 · ¿MERECE PUBLICARSE `b11-aspecto-tempo` A 7 DE 12?

**Sí, pero la pregunta está mal planteada, y ésa es mi respuesta principal.**

El «3 de partida» es un conteo de **etiquetas**, no del punto. Barriendo los 146
juicios publicados por la CONSTRUCCIÓN que exhiben en vez de por la etiqueta que
llevan:

```
$ node -e "…juicios con perífrasis aspectual / expresión de duración…"
11 de 146
  b2c2-gj-05      []                          Há dois anos que moro em Lisboa.
  b2c2-gj-06      []                          Conheço-a desde faz cinco anos.
  b2c2-gj-l1-01   []                          Está a chover desde ontem.
  b2c2-gj-l1-05   []                          Levo três anos a estudar português.
  b2c2-gj-l2-04   []                          Estou esperando o autocarro.
  b2c2-gj-l3-03   []                          Hei de visitar o Porto um dia.
  b2c2-gj-l3-07   []                          Estou a jantar com eles na sexta-feira.
  b2c2-gj-l5-01   ["b11-aspecto-tempo"]       É capaz de chover no domingo.
  b2c2-gj-l5-05   ["b11-aspecto-tempo"]       Ando a ler um livro do Saramago.
  b2c2-gj-l5-10   ["b11-aspecto-tempo"]       Ontem tenho falado com o teu pai.
  b2c2-gj-l9-07   ["b8-oracoes-subordinadas"] Fiquei a saber ontem que ela se mudou…
```

**Once ítems enseñan aspecto y tiempo. Tres lo declaran.** Los otros ocho viven
con `concepts: []` (o mal etiquetados) bajo `b8-l1-conectores-subordinadas-adverbiais`,
que es un cajón, no un punto. Es decir: **la enfermedad que el round acaba de
curar en el lote ya está cometida sobre este mismo punto**, en la dirección
contraria — y con el backfill `3 + 8 + 4 = 15`, el punto **cierra**.

Conclusión operativa: **publicar sí, pero el orden para el lote 11 no es
«escribir cinco ítems de aspecto» sino (1) backfill de `concepts` sobre esos
ocho, (2) volver a medir, (3) escribir sólo lo que falte.** Escribir cinco ítems
nuevos para un punto que probablemente ya está cerrado es la peor decisión
posible, y es a lo que empuja la fila de la tabla tal como está. Y quedan 116
ítems con `concepts: []` en todo el corpus: mientras estén así, ninguna cifra de
cobertura mide el curso.

---

## 5 · LAS DOS LÁPIDAS · **hiciste bien, y demostrarlo destapó lo peor del gate**

Las tres muertes se sostienen, y **la corrección de la lápida de GJ-15 es
correcta**: el corpus publica `b2c2-gj-l1-04` «Apaixonei-me **por** ela» BIEN y
`apaixonar-se por` es el `<Example>` #0 de la propia lección `b11-l2`. La
atestación de «apaixonado **de** Thereza» era, en efecto, un falso positivo.
Reconocer por escrito que la lápida anterior mentía es lo mejor del documento.

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

**Diez intentos (tus tres, mis siete), diez muertes.** No es mala suerte: es que
el punto, medido por construcción, ya está mucho más cubierto de lo que las
etiquetas dejan ver (§4). **No había una reposición evidente que se te escapara.**

### El hallazgo grande: **el gate mide sustantivos, no puntos**

Mi primera candidata y su gemela publicada son el mismo ejercicio. Medido:

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
gate dijera nada — que es lo que casi me pasa a mí y lo que **sí** está pasando
con GJ-14 (§3.4). El gate protege contra el copiar-y-pegar, no contra el
reenseñar. Su segundo eje —`concepts`— existe para eso y está apagado en 116
ítems.

---

## 6 · FUGAS, CONTRADICCIONES Y RESTOS DEL CAMBIO DE FRASES

### 6.1 · GRAVE · **dos explicaciones hablan de frases que ya no existen**

El cambio de las cuatro frases no arrastró las explicaciones:

| ítem | la frase dice | la explicación cita |
|---|---|---|
| **GJ-03** | «Costumo **deitar-me** tarde…» | «Y la ênclise **«levantar-me»** es la colocación por defecto» |
| **GJ-05** | «…quando **estivermos** os dois mais calmos» | «Y **«quando nos virmos»** es futuro do conjuntivo» |

Publicado así, el alumno responde a una frase y recibe una explicación sobre otra
—y las dos citadas son, precisamente, las dos frases retiradas por ser
`<Example>` literales de la lección. **Es el residuo del arreglo, y es visible
para el usuario final.** (GJ-06 tiene el mismo problema en grado menor:
su explicación ilustra con «ficar a pensar», que es el `<Example>` #4 de la
lección y ya no es la frase del ítem; ahí la formulación es genérica y se
sostiene, pero conviene cambiarla por «ficar a remoer».)

### 6.2 · GRAVE · GJ-01 (ítem **nº 1**) sigue regalando GJ-10 y GJ-16

Su explicación enuncia el sistema entero:

> «…el error sale de haber aprendido que **la ênclise es lo normal en portugués y
> aplicarla también donde hay atractor**.»

Con eso, GJ-10 («Deram-me…», pos 9) y GJ-16 («Casou-se…», pos 14) se contestan sin
pensar, y **la trampa declarada de GJ-16 ES lo que GJ-01 explicó**. Es el
bloqueante nº 6 del informe de la v2, que sigue sin aplicarse en la tercera
ronda. Un paso: borrar esa última oración de GJ-01.

### 6.3 · GRAVE · GJ-09 lleva la clave dentro y lo confiesa

> «la propia frase trae el contraste delante: «como se fosse» ya está bien puesto,
> así que **el ítem se resuelve comparando sus dos mitades**.»

Y encima GJ-02 (pos 2) ya enseñó que la hipotética pide `fosse`. Doble regalo. Con
la regla de corte no se puede retirar (rompe el molde), así que hay que quitarle
la clave a la frase:

> «Ele saiu de casa sem que ninguém o viu, **com os sapatos na mão**.»
> repair «…sem que ninguém o **visse**, com os sapatos na mão.»

### 6.4 · La cita a «GJ-05» **está resuelta** — y la contradicción, cerrada

Preguntabas si la cita resolvía la contradicción o creaba una fuga. **Resolvía la
contradicción** —sin la salvedad, GJ-05 marca BIEN «Hei de **lhe** pedir» (clítico
antepuesto sin atractor) y GJ-16 dice que eso es el error; la salvedad traza la
línea correcta: el atractor manda sobre el verbo finito **simple**— y en esta
versión **ya no cita a «GJ-05» por su id**, sino que ilustra sola («hei de lhe
dizer», «havia de me dar»). Bien resuelto: la referencia habría colgado, porque
en el catálogo publicado hay **0 de 2.431** ítems que referencien a otro por id.
Lo verifiqué. Nada que hacer aquí.

### 6.5 · Virginidad desnuda: **dos choques que el gate no ve**

Corrido el gate sobre la frase desnuda (núcleo didáctico escrito a mano), contra
los 2.431 publicados **más** los 140 `<Example>`:

| candidato | choca con | desnudo | lo que ve el preflight |
|---|---|---:|---:|
| **GJ-01** «Não disse-me nada» | `b2c2-gj-l2-19` «Ela me disse que vinha» → «Ela disse-me que vinha» | **0,679 ⛔** | 0,392 (aviso) |
| **GJ-04** «Espero que o teu irmão vem» | `mdx:b6/l5-contraste-modos#1` «Espero que você venha à festa» | **0,495** | 0,363 (aviso) |
| GJ-03 «Costumo deitar-me tarde» | `b2c2-gj-l3-02` «Vou deitar-me cedo hoje» · `mdx:b11/l4#2` «Costumo levantar-me às sete» | 0,441 · 0,388 | 0,424 |
| GJ-14 «deu por mim» | `b2c2-gj-l4-20` «Quando dei por ela…» · `mdx:b11/l2#2` «Só dei pelo erro…» | <0,30 | — |

**GJ-01 cruza el umbral de bloqueo del propio preflight (0,5) y el preflight no lo
ve.** La sonda de núcleo sigue siendo un **no-op en los ítems sin coma** —parte por
comas y se queda con el trozo más largo, que sin comas es la frase entera; se ve
en la salida pegada, donde `GJ-01·núcleo` puntúa igual que `GJ-01`.

GJ-01 **no es un duplicado**: `b2c2-gj-l2-19` enseña «sin atractor → ênclise» y
GJ-01 «con atractor → próclise»; son las dos mitades de la misma regla y enseñar
la segunda después de la primera es correcto. Lo que no vale es que pase **sin
declararse**. Y **GJ-04, a una milésima del bloqueo, sí es el mismo ejercicio** que
un `<Example>` de `b6/l5`, con otro sujeto.

### 6.6 · Pares que enseñan lo mismo dos veces dentro del lote

`reg-verbal-a` ×2 adyacentes y los dos MAL (GJ-11, GJ-12) · `reg-verbal-em` ×2
adyacentes y los dos BIEN (GJ-13, GJ-14) · ênclise sobre finito ×2 BIEN (GJ-10,
GJ-16) · imperfeito do conjuntivo ×2 MAL (GJ-02, GJ-09). Tras leer la explicación
de GJ-11 («chegar **A**; "chegar em" es brasileño») el alumno llega a GJ-12 cebado
para buscar una «a» que falta — y son los **dos únicos MAL de la sección B**.

### 6.7 · Una contradicción del catálogo que este lote destapa

GJ-11 condena «chegar em». El catálogo publica como **modelo correcto** el
flashcard `0b4ea261`: «Ao eu chegar **em** casa, **vou te** ligar.» — «chegar em»
más próclise brasileña. No es culpa del lote y no lo bloquea; ticket de backlog.

---

## 7 · QUÉ ESTÁ BIEN (específico)

- **El sello del preflight cubre ahora los tres ficheros** y la salida pegada
  reproduce byte a byte. Es el arreglo exacto del agujero que encontré en la
  pasada anterior, hecho en horas.
- **Indexar los 140 `<Example>` de `mdx/` es una mejora real y grande del gate**,
  y encontró un choque de verdad (`GJ-11` ↔ `b6/l5-contraste-modos` a 0,529, de
  ahí «Faro»). Ataca el síntoma y no la enfermedad (§1.3), pero el síntoma era
  gordo.
- **El rasgo 12 es el rasgo correcto y estaba bien elegido.** Que su valor
  declarado esté mal en dos ítems no quita que meterlo, con la glosa escrita al
  lado y bloqueando si falta, sea la decisión de diseño más importante de esta
  ronda. El comentario que lo acompaña —«hay que cambiar de formato, no de
  frases»— es el diagnóstico correcto del lote entero.
- **El etiquetado se corrigió de verdad y el backfill de `b11-l2` está hecho**:
  `b11-regencias` pasa de 5 a 10 por etiqueta, verificado. Y la tabla de cabecera
  admite por escrito que estaba mal en sus dos filas. Eso es lo contrario de lo
  que hizo la v2.
- **La lápida de GJ-15 se corrigió contra el propio autor**: «Mi lápida decía lo
  contrario y el round la corrigió: la atestación era mía y era falsa.»
  Verificado que la corrección es la buena (`b2c2-gj-l1-04` + `<Example>` #0 de
  `b11-l2`).
- **`lleva una palabra visiblemente española`: 0 presentes**, y el rasgo se
  arregló quitándole `desde`, `nunca` y `aje\b`, que eran falsos positivos. Un
  detector con falsos positivos contamina su propia cifra; quitarlos fue correcto.
- **GJ-12 (`obedecer a`) y `bater à porta` siguen siendo vírgenes de verdad**:
  0 ocurrencias de `obedec` y de `bater à porta` en los 2.431. Son los dos puntos
  genuinamente nuevos del lote.
- **GJ-08 sigue siendo el mejor ítem**: un BIEN que existe para impedir que la
  regla se lea como «en portugués europeo nunca hay gerundio», que así enunciada
  es falsa.
- **El banco explícito para el lote siguiente**, con el motivo de por qué no entra
  hoy (dejaría el molde en desequilibrio 3), es la forma correcta de no perder
  trabajo entre rondas.

---

## 8 · BLOQUEANTES · lista cerrada

| # | bloqueante | acción, un paso | verificación |
|---|---|---|---|
| **B1** | **Rasgo 13**: «exhibe construcción europea marcada» acierta **12/14** (p=0,006 binomial; **0,016** hipergeométrico). Tasa base publicada 53 %, ningún lote >60 %. Con el rasgo en la batería, **EXIT=1** | (a) añadir el rasgo a `atajos.ts` (§1.5); (b) las dos ediciones de §1.4 (GJ-12 «costumam obedecer», GJ-11 «depois de estarmos sete horas no comboio») | corrido: **12/14 → 10/14 (p=0,090)**, preflight **EXIT=0** |
| **B2** | **Rasgo 12 mal declarado**: GJ-10 y GJ-16 llevan `glosa-es … INCORRECTO` cuando «Diéronme» y «Casóse» son español arcaico **bien formado**. Corregidas: **9/14 (p=0,212) → 11/14 (p=0,029)**, hipergeométrico 0,028 | corregir las dos líneas **y** escribir el criterio en `atajos.ts`: «bien formado en algún registro del español», no «la redacción moderna natural» (hoy se aplica el estricto a GJ-10/16 y el caritativo a GJ-13) | corrido: **EXIT=1**. ⚠ **Ninguna edición lo desbloquea** — decisión de Edu, ver abajo |
| **B3** | **Dos explicaciones citan frases retiradas**: GJ-03 dice «la ênclise «levantar-me»» y la frase es «deitar-me»; GJ-05 dice ««quando nos virmos»» y la frase es «quando estivermos» | sustituir las dos citas por las formas de la frase actual (y en GJ-06, «ficar a pensar» → «ficar a remoer») | lectura directa del doc |
| **B4** | **GJ-01 ↔ `b2c2-gj-l2-19` = 0,679** desnudo, por encima del umbral de bloqueo del propio preflight, que sólo ve 0,392 | declararlo en el doc y en `concepts` como reenseñanza deliberada, con el id al lado — es la mitad complementaria de la misma regla, no un duplicado — y **no contarlo como cobertura nueva** | medido con `virginidad.ts` |
| **B5** | **GJ-04 ↔ `mdx:b6/l5-contraste-modos#1` = 0,495** desnudo, a una milésima del bloqueo. El preflight ve 0,363. Es «Espero que você venha à festa» con otro sujeto | cambiar el disparador o el sujeto (p. ej. «Duvido que o teu irmão vem connosco…»), o declararlo con el id | medido con `virginidad.ts` |
| **B6** | **GJ-01 (ítem nº 1) regala GJ-10 y GJ-16** — bloqueante nº 6 de la v2, sin aplicar en tres rondas | borrar la última oración de la explicación de GJ-01 («el error sale de haber aprendido que la ênclise es lo normal…»); el resto se sostiene solo | — |
| **B7** | **GJ-09 lleva la clave dentro** y la explicación lo confiesa | «…sem que ninguém o viu, **com os sapatos na mão**» / repair «…o **visse**, com os sapatos na mão», y borrar la frase confesional | — |
| **B8** | **Etiquetado incompleto**: GJ-10 sigue en `b11-regencias` sin exhibir la regência; GJ-16 necesita etiqueta doble; y los cuatro re-etiquetados fueron a puntos ya sobre el piso mientras cuatro puntos están en 6-9 de 12 | GJ-10 → `b8-coloc-enclise`; GJ-16 → `+b8-coloc-enclise`; añadir **segundo** concepto a GJ-09 (`b6-imperfeito-subj`, 6), GJ-04 (`b6-presente-subj`, 6), GJ-05 (`b6-futuro-subj`, 8), GJ-08 (`b7-gerundio`, 9) | conteos de §3.3, medidos sobre los 2.431 |

### La decisión que B2 te deja encima de la mesa

Con las glosas corregidas —y están mal, no es opinable— el preflight sale
**EXIT=1** y **no hay edición que lo arregle**: los seis MAL son cazables desde el
español, los seis, y eso es una propiedad de los puntos examinados (regência y
colocação son puntos donde el español mayormente coincide), no de cómo están
escritas las frases. Retirar ítems empeora: quitar BIEN dispara el rasgo 13 a
11/12 (p=0,003), y quitar MAL rompe el molde.

Las dos salidas honestas:

- **(a) PUBLICA-CON-CORRECCIONES** — aplicar B1 y B3-B8, corregir las dos glosas
  a la verdad, y **publicar el lote con el atajo declarado y su cifra en el
  documento** («11/14, p=0,029; los seis MAL son B1 como prueba»). Es lo que
  recomiendo: matar el lote no produce ningún ítem mejor, y el remedio real
  —cambiar de formato para regência y colocação— es trabajo del lote 11.
- **(b) NO PUBLICAR la sección B** y quedarse con la A corregida. Cierra el
  preflight, pero tira 6 ítems válidos y deja `b11-regencias` sin cerrar.

Yo firmo **(a)**. Lo que no vale es publicar con el 9/14 de hoy: eso es meter una
cifra que sé que está mal en el sistema de medición que este proyecto usa para
decidir dónde trabajar.

### No bloquean — backlog del lote 11, por orden de daño

1. **El gate mide sustantivos, no puntos** (§5): 1,00 → 0,22 cambiando el día de
   la semana. Sin el segundo eje (`concepts`) o un grep por construcción escrito
   en el procedimiento, no hay umbral que lo arregle.
2. **Backfill de `concepts`**: 116 ítems con `concepts: []`, entre ellos los ocho
   juicios de aspecto/tiempo (§4) y los tres con los que choca este lote.
   Probablemente cierra `b11-aspecto-tempo` solo.
3. **La sonda de núcleo es un no-op en los ítems sin coma** (§6.5). Sustituirla
   por el par `(sentence, repair)` truncado a la ventana donde difieren. Hoy es
   la diferencia entre 0,392 y 0,679.
4. **El gate de `<Example>` compara cadenas; el alumno reconoce construcciones**
   (§1.3). El rasgo 13 es la versión robusta y va en la batería, no en el gate.
5. `b11` **no tiene partición** en `conceptos-finos.ts`: sus ítems no se pueden
   auditar por sub-punto y todo cae en dos cubos.
6. Reconciliar el inventario de puntos: el código produce hoy **163**
   (`PARTICIONES 37 · subpuntos 143 · transversales 7 · gruesos sin partir 13`),
   no 186. Es el denominador de la meta de cobertura.
7. `0b4ea261` publica «Ao eu chegar **em** casa, **vou te** ligar» como modelo
   correcto y GJ-11 lo condena (§6.7).
8. Para el lote 11: **backfill → medir → escribir**, y lo que se escriba tiene que
   ser **MAL en construcción europea con glosa española correcta** — que es lo
   único que este lote no tiene y lo que hace falta para bajar los rasgos 12 y 13
   a la vez. Escribí siete candidatas y murieron las siete (§5): no es fácil, y
   por eso hay que empezar por ahí y no por el final.

---

### Comandos corridos

```
npx tsx scripts/preflight-lote.ts <doc>                          # EXIT=0, 12 rasgos, sello eb2f75bf
diff <(sed -n '80,170p' <doc>) <(salida real)                    # sin diferencias — la salida pegada es fiel
<copia + rasgo 13 en atajos.ts>  preflight <doc>                 # EXIT=1, 12/14 p=0.006
<copia + rasgo 13>               preflight <doc con §1.4>        # EXIT=0, 10/14 p=0.090
<copia + rasgo 13>               preflight <doc con §1.4 y §B2>  # EXIT=1, glosa 11/14 p=0.029
<script propio> medirRasgo/pValor sobre v1, v2, v3 y 146 publicados   # base 78/146 = 53 %
<script propio> hipergeométrico exacto                                # r13 0.0163 · r12 auditado 0.0280
<script propio> virginidad.ts sobre las 14 desnudas + 140 <Example>   # GJ-01 0.679 · GJ-04 0.495
<script propio> virginidad.ts: REPO-A vs b2c2-gj-l3-07, 3 redacciones # 1.00 / 0.22 / 0.159
node -e "…" conteos de concepts sobre blocks/*.json                   # 3 · 10 · 116 sin concepts
node -e "…" juicios que EXHIBEN aspecto/tiempo, por construcción      # 11 de 146, 3 declarados
grep -o '<Example[^>]*pt="[^"]*"' mdx/b11/l4-aspecto-e-tempo.mdx      # las 7 del inventario
```

El repo no se ha modificado. Los parches viven en
`/private/tmp/claude-501/-Users-lalo/81a35124-6606-4ff5-b312-6a66f19a4678/scratchpad/repo2/`.
