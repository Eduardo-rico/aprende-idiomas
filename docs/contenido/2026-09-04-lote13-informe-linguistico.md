# Lote 13 — informe LINGÜÍSTICO adversarial

**Revisor:** lingüista adversarial PT (filólogo portugués, PLE).
**Objeto:** `docs/contenido/2026-09-04-lote13-c2-borde.md` (6 ítems, 3 pares
mínimos) y su generador `scripts/lotes/lote13-c2-borde.ts`.
**Corpus consultado:** `lib/data/languages/pt/lecturas/` — 224 obras,
4.298.937 caracteres extraídos y greppeados en texto plano, con grafía
moderna **y** decimonónica.

---

## Veredicto global: **NO**

No por descuido de ejecución —la ejecución es la más limpia de las
últimas sesiones— sino por dos razones que ninguna corrección de texto
arregla:

1. **P-01 enseña algo falso, y lo falso está desmentido por la propia
   Biblioteca de la app.** Doce pasajes de Garrett, Camilo y Eça
   contienen exactamente la construcción que el ítem declara imposible.
   Uno de ellos está en una lectura etiquetada **`nivel: C2`**: el mismo
   alumno, el mismo día, lee en la app el «MAL» que la app le acaba de
   marcar mal.
2. **Ninguno de los tres pares es C2.** Quitado P-01, quedan cuatro
   ítems de nivel B1–B2 sirviendo un punto declarado de C2. Rellenar
   `b12-borde-gramaticalidad` con ellos convierte un cero honesto en un
   seis contable, que es precisamente la ficción que el libro de déficit
   existe para impedir.

Lo correcto es dejar el punto en **0 declarado** —la vía que el propio
`curriculum.ts` documenta en su comentario de B12— y no improvisar tres
pares de sustitución. La regla de corte de Edu aplica aquí en su
dirección incómoda: si sólo hay uno y medio defendible, se publica cero.

**Bloqueantes: 7** (lista cerrada al final; 4 de ellos son *hard*).

---

## 1. Auditoría de la verificación previa

Se pedía no dar por buenas las tres lecturas. Las he releído en el texto
completo. **Las tres son correctas.** El revisor anterior hizo bien en no
retirar los pares por el grep a secas.

| lo que devolvió el grep | fichero | lectura correcta | ¿acierta el revisor? |
|---|---|---|---|
| `dizia-lhe a inclausurada` | `lecturas/amor-de-perdicao-c19.json` — Camilo, *Amor de Perdição*, cap. 19 | «—Dez annos!—**dizia-lhe a inclausurada de Monchique**—Em dez annos terá morrido meu pae…». `a inclausurada` es SUJETO pospuesto de un inciso de cita. En portugués el sujeto no lleva `a` preposicional; aquí `a` es artículo. | **Sí** |
| `perguntou-lhe a causa` | `lecturas/amor-de-perdicao-c05.json` — Camilo, cap. 5 | «…e **perguntou-lhe a causa d'aquelle olhar melancolico**». `a causa d'aquelle olhar` es OD. | **Sí** |
| `deu-lhe a mão` | — | **La cadena no existe en el corpus** (0 hits). Lo que hay es `estendeu-lhe a mão` (`o-crime-do-padre-amaro-c14`, `os-maias-c03`). La lectura es la misma y correcta —`a mão` es OD— pero **la cita no es verbatim**. | Lectura sí, cita no |
| `ver a meu` | `lecturas/os-maias-c03.json` — Eça, *Os Maias*, cap. 3 | «Vou escre**ver a meu** primo Noronha, ao André que vive em Paris…». Regência dativa de `escrever`. | **Sí** |
| `ver a seu` | `lecturas/amor-de-perdicao-c07.json` — Camilo, cap. 7 | «…perguntou-lhe a menina se poderia escre**ver a seu pae**». Ídem. | **Sí** |
| `diante meu` | `lecturas/amor-de-perdicao-c03.json` — Camilo, cap. 3 | «…e será de hoje em **diante** · **meu** inimigo». El grep cruzó dos constituyentes. | **Sí** |

**Hallazgo de higiene (bloqueante blando).** `deu-lhe a mão` se cita en el
documento del lote, en el banco y en el generador como si fuera una
cadena del corpus, y no lo es. El método entero descansa en que las citas
sean comprobables por el siguiente revisor; una cita reconstruida de
memoria en la tabla que justifica «el par vive» es el mismo tipo de
grieta que la sesión E2#12 pagó cara. Sustituir por `estendeu-lhe a mão`
(`o-crime-do-padre-amaro-c14`) o retirar la fila.

---

## 2. Lo que el revisor NO buscó — y que tumba P-01

El grep previo buscó `-lhe` seguido **inmediatamente** de `a` + nombre.
Eso deja fuera todo lo que importa. Barrido ancho realizado:

- `lhe`/`lhes`, proclítico y enclítico, con ventana de **0 a 6 palabras**
  hasta `ao` / `à` / `aos` / `às` (contracción = preposición inequívoca,
  imposible de confundir con sujeto pospuesto): 5.341 ocurrencias de
  `lhe(s)`, 2.829 enclíticas, todas las ventanas revisadas a mano.
- `lhe(s)` + `a` + pronombre tónico (`mim, ti, ele/elle, ela/ella, si,
  nós, vós, todos`).
- **Mesóclise con `-h-` decimonónico**: `escrever-lhe-hia`,
  `pedir-lhe-hia`, `estender-lhe-hia`, `esconder-lhe-ha`,
  `Acordar-lhe-hiam`, `vir-lhe-hia` (9 formas; ninguna duplica).
- **Formas con apóstrofo**: `lh'o` (143), `lh'a` (79), `lh'as` (30),
  `lh'os` (24) — son grupos clíticos, no duplicación.
- `-lhes aos`, `-lhe à` + nombre de persona, `chamar-lhe … a/ao` por lema
  y en todas las personas y tiempos.

### Resultado: **12 pasajes de duplicación genuina del clítico dativo con SN expreso**

| # | pasaje | fichero / obra / cap. | nivel de la lectura | tipo |
|---|---|---|---|---|
| 1 | «Eu **lhe digo aos senhores**: o homem nem era assim nem era assado.» | `viagens-na-minha-terra-c07` — Garrett, *Viagens na Minha Terra*, cap. 7 | C1 | **`dizer` + clítico + SN dativo pleno, sin pausa** |
| 2 | «É o que eu **lhes digo a elles**: —"Ó almas do diabo, atacai as questões sociaes!"» | `os-maias-c16` — Eça, *Os Maias*, cap. 16 | **C2** | `dizer` + clítico + pronombre tónico |
| 3 | «E agora Deus **lhes dê boas noites a todos**» | `o-crime-do-padre-amaro-c10` — Eça, cap. 10 | C1 | clítico + SN cuantificador, sin coma |
| 4 | «Pelo que vejo não **lhe importa ao senhor** ir a uma forca?» | `amor-de-perdicao-c11` — Camilo, cap. 11 | B2 | clítico + `ao senhor`, sin pausa |
| 5 | «**Bacorejou-lhe ao cego** que estava roubado» | `novelas-do-minho--cego-04` — Camilo, «O Cego de Landim: IV» | C1 | clítico + SN pleno, sin pausa, + completiva |
| 6 | «o soldado que **lhe chamou maluco ao pensador** de taes extravagancias» | `viagens-na-minha-terra-c23` — Garrett, cap. 23 | C1 | clítico + SN pleno, sin pausa |
| 7 | «**Chamam-lhe o Alfageme ao mestre** J. P.» | `viagens-na-minha-terra-c07` — Garrett, cap. 7 | C1 | ídem |
| 8 | «E que se **lhe havia de fazer, ao pequeno**?» | `o-crime-do-padre-amaro-c20` — Eça, cap. 20 | C1 | dislocación a la derecha con coma |
| 9 | «Que **lhe parecia, ao amigo** Amaro?» | `o-crime-do-padre-amaro-c23` — Eça, cap. 23 | C1 | ídem |
| 10 | «uma existencia de solteirões **lhes impedisse, a elle e ao avô**, de receberem senhoras» | `os-maias-c07` — Eça, cap. 7 | **C2** | clítico + coordinación pronombre + SN |
| 11 | «Que **lhes importava a elles** que um de nós fosse Jacintho…» | `a-cidade-e-as-serras-c08` — Eça, cap. 8 | C1 | clítico + tónico |
| 12 | «não **lhes póde fazer senão bem, a elles e a nós**» | `a-cidade-e-as-serras-c09` — Eça, cap. 9 | C1 | ídem |

**Los casos 1, 3, 4, 5, 6 y 7 no llevan coma, no son dislocaciones y no
son énfasis contrastivo.** Son duplicación llana, en portugués europeo
canónico, de tres autores distintos.

El caso **1** es el que cierra el asunto: es `dizer`, es un SN pleno
introducido por `aos`, va sin pausa y va delante de la completiva.
Estructuralmente es la frase de GJ-06 con otro léxico. Y está a dos
capítulos de distancia del caso 7, en el mismo capítulo 7 de Garrett,
donde además aparece «Mas porque **chamaram ao mestre P. o Alfageme** do
Cartaxo?» — la misma alternancia jugada en la misma página.

### Lo que sí es verdad, y que es otra cosa

Lo defendible en portugués europeo contemporáneo es una afirmación de
**preferencia**, no de gramaticalidad:

> En PE neutro, con `dizer` y destinatario léxico expreso, la variante sin
> clítico es la no marcada; el clítico añade dislocación o énfasis y, en
> el habla corriente, calca al español cuando aparece sin ninguna de las
> dos cosas.

Eso es cierto y es enseñable. Pero **una afirmación de preferencia no se
puede meter en un juicio binario de gramaticalidad**: el alumno que marca
«BIEN» la frase con clítico no se equivoca, acierta con Garrett. El
formato es el que está mal elegido, no sólo el texto.

---

## 3. Veredicto por par

### P-01 · duplicación del clítico dativo — **MUERE**

**Ítems afectados:** GJ-03 (BIEN), GJ-06 (MAL).

- El MAL **no es agramatical**: es marcado/dispreferido. Evidencia: los 12
  pasajes de §2, seis de ellos sin pausa ni dislocación.
- La explicación de GJ-06 —«En portugués europeo se elige uno de los
  dos»— es **falsa** tal como está escrita.
- La explicación de GJ-03 —«el portugués europeo NO pone además el
  clítico»— es **falsa** tal como está escrita.
- Agravante: la misma falsedad ya está publicada en
  `lib/data/languages/pt/mdx/b12/l1-o-limite-da-gramatica.mdx`: «El
  español duplica el clítico ("le dije a Juan") y el portugués no
  ("disse ao João", nunca "disse-lhe ao João")». El lote no introduce el
  error: lo **certifica**.
- **No proponer sustituto improvisado.** No he encontrado, dentro de este
  fenómeno, ninguna reformulación que sea a la vez (a) categórica, (b)
  contrastiva ES/PT y (c) de nivel C2. Inventar una aquí sería
  exactamente el movimiento que mató a siete MAL en tres sesiones.

**ERROR adicional dentro de P-01 (vale aunque el par muera, porque el
esqueleto puede reciclarse):** `director` es grafía **pre-AO90**. En
portugués europeo post-Acordo es **`diretor`** (la `c` de `ct` es muda y
cae, como en `ator`, `fator`, `direto`). El corpus publicado ya está
mezclado (`director` 16 / `diretor` 6; `direcção` 2 / `direção` 6), pero
eso es deuda previa, no licencia.

### P-02 · la «a» personal — **CORRIGE-ASÍ** (y reclasifica de nivel)

**Ítems afectados:** GJ-04 (BIEN), GJ-05 (MAL).

**Lo que aguanta.** El MAL es genuinamente agramatical y el corpus lo
respalda por ausencia: **0 hits** de `visitar` + `ao/à` + humano como OD
en 4,3 M de caracteres (los `visita ao padre`, `visita ao Ramalhete` que
devuelve el grep son el **sustantivo** `visita` con complemento, y los
`visitar a entrevada / a velha / a Senhora / a quinta` llevan `a`
**artículo** femenino). Barrí además ~30 verbos transitivos (`ver`,
`matar`, `encontrar`, `conhecer`, `esperar`, `procurar`, `acompanhar`,
`escolher`, `insultar`…) contra `ao/à/aos/às` + nombre humano: **todos
los hits son dativos**, ninguno acusativo preposicional con SN léxico.

**Lo que hay que corregir (ERROR).** La explicación de GJ-04 dice: «El
portugués **no tiene** la "a" personal del español». Falso como
absoluto. El portugués conserva acusativo preposicional en dos nichos, y
los dos están en la Biblioteca que el alumno lee:

- **Obligatorio con pronombre tónico** (duplicación del OD): «e
  **escolhera-o a elle**, a elle padre» (`o-crime-do-padre-amaro-c09`);
  «**desacreditou-a a ella**» (`…-c11`); «**Evital-o a elle**, e ao que
  lhe pertence» (`…-c14`); «que **me chamou a mim seductor**» (`…-c11`);
  «e **me insultou a mim**» (`…-c13`); «E amo-te, e **amo-te a ti** so
  como realmente nunca amei» (`viagens-na-minha-terra-c47`); «logo nessa
  tarde **a viu a ela**, Luísa» (`singularidades-de-uma-rapariga-loura`,
  grafía moderna); «tendo-**a só a ela**» (`no-moinho`, grafía moderna).
- **Residuo léxico con `Deus`**: «o terror **d'offender a Deus**»
  (`o-crime-do-padre-amaro-c21`); «um peccado que **offende a Deus**»
  (`os-maias-c03`).

Texto exacto de sustitución para `explicacionBien` de P-02:

> El objeto directo de persona va sin preposición: «visitar o teu avô».
> El portugués **no generalizó** la «a» personal del español: sólo la
> conserva con pronombre tónico duplicado («viu-a **a ela**», «amo-te
> **a ti**») y en fórmulas fijas con «Deus» («ofender a Deus»). Fuera de
> esos dos nichos, la preposición delante del OD es calco. Y es el calco
> que más resiste, porque en español es obligatorio.

**Lo que hay que corregir (DISCUTIBLE fuerte — confound).** Respuesta a
la pregunta 1 del encargo, en dos partes:

- **¿Es «ao lar» natural?** Sí, y es *más* que natural: «ir ver / visitar
  / buscar alguém **a** um sítio» es construcción europea marcada, la que
  distingue PE de PB y de español. El corpus la trae: «Terça feira
  **vou-te buscar ao Ramalhete**» (`os-maias-c05`), «voára **a buscar ao
  Ramalhete**» (`os-maias-c15`), «Pediu-me que **a fosse esperar a
  Guimarães**» (`novelas-do-minho--gracejos-que-matam`), «levar as suas
  malas **ao hotel**» (`os-maias-c01`). PB y español dirían «no lar / en
  el asilo». Así que **«ao lar» es correcto y «no lar» sería el calco.**
- **¿Confunde?** Sí, y ése es el problema. La coleta mete en el mismo
  ítem un **segundo** contraste `a`-vs-otra-cosa, que no se juzga y que
  es más difícil que el que sí se juzga. En el MAL la frase queda
  «visitar **ao** teu avô **ao** lar»: el alumno puede rechazarla por
  *cacofonía de la repetición* y acertar sin haber aplicado la regla, o
  puede sospechar del `ao` equivocado. Un juicio binario que se puede
  ganar por el motivo equivocado no mide lo que declara medir.

Esqueleto exacto propuesto (quita el único otro `a` de la frase y
conserva el `estar a + infinitivo`, que sí conviene tener ahí):

```
esqueleto: 'Fomos visitar {} teu avô esta manhã, mas ele já estava a dormir.'
glosaBien: 'Fuimos a visitar el tu abuelo esta mañana, pero él ya estaba durmiendo.'
glosaMal:  'Fuimos a visitar al tu abuelo esta mañana, pero él ya estaba durmiendo.'
```

Cualquier cambio de texto **invalida el preflight pegado** (`rev
ff3e2d90`, virginidad, molde, batería de 13 rasgos) y obliga a
re-ejecutarlo antes de abrir el round: es la regla del propio documento.

**Nota sobre la válvula.** El `permiteSNPosterior: true` de P-02 está
**bien concedido y bien justificado**: el relleno `o` casa el regex
`ACUSATIVO` del gate, pero aquí es artículo, no clítico, y el gate
`objetoDuplicado` es —por su propio comentario— estrecho y medido. Es el
uso correcto de una válvula explícita.
**Pero conviene decir en voz alta lo que la válvula no cubre:** el gate
sólo mira clíticos **acusativos**. `disse-lhe` es dativo, así que P-01
nunca lo activó. En el fallo de este lote la única defensa era la
revisión lingüística, y falló sola.

### P-03 · posesivo tras adverbio de lugar — **CORRIGE-ASÍ** (lado PT limpio)

**Ítems afectados:** GJ-01 (MAL), GJ-02 (BIEN).

**Lo que aguanta, y aguanta bien.** Barrí 33 adverbios y locativos
(`atrás`, **`atraz`**, `atráz`, `trás`, **`traz`**, `detrás`, `detraz`,
`diante`, **`deante`**, `defronte`, `perto`, `junto`, `longe`, `dentro`,
`fora`, `debaixo`, `cima`, `baixo`, `frente`, `lado`, `pé`, `volta`,
`redor`, `roda`, `torno`, `através`, `antes`, `depois`…) × 20 posesivos.
La grafía decimonónica importa aquí más que en ninguna otra parte: el
corpus escribe **`atraz`** (73 ocurrencias con `de`) frente a `atrás`
(9). Cubiertas las dos.

**Resultado: 0 casos de adverbio de lugar + posesivo sin preposición** en
4,3 M de caracteres. Los tres únicos falsos positivos son
`diante meu` (ya diagnosticado), `depois sua` («Mezes depois sua mãe…»,
`os-maias-c01`) y `contra seu peito` (`viagens-na-minha-terra-c35`), los
tres con cruce de constituyentes o con `contra` preposición.

**Respuesta a la pregunta 2 del encargo.** «Atrás do meu» es exactamente
lo que diría un portugués, y el corpus da el paralelo estructural exacto
—posesivo pronominal con elipsis del núcleo, con antecedente en la frase
anterior—: «O seu beliche está **ao pé do meu**» (`amor-de-perdicao-c20`,
Camilo). Las alternativas:

- «atrás **de mim**» — **cambia el significado**: pasa a ser "detrás de mi
  persona", no de mi coche. Con `O carro dele` como sujeto sería
  incoherente.
- «atrás do meu **carro**» — correcto pero redundante: con el antecedente
  a cinco palabras, el portugués elide. La versión llena suena a
  traducción.

El BIEN **no es raro.** El par se sostiene por el lado portugués.

**Lo que hay que corregir (ERROR de alcance).** La explicación de GJ-01
dice que «atrás meu» «en portugués **no existe en ninguna variedad**».
La evidencia recogida es 100 % portugués europeo literario del XIX; no
dice absolutamente nada de la variedad brasileña, y en el habla coloquial
brasileña el tipo `adv + posesivo` (`atrás meu`, `do lado meu`) sí
circula, estigmatizado pero vivo. Esta app es **bi-variante por diseño**
(cada ítem lleva `audio.br` y `audio.pt`, y hay `variantStatus` /
`variant-human-queue.json`): una afirmación con «ninguna variedad» dentro
compromete a la variedad brasileña, y no está pagada.

Texto exacto de sustitución para `explicacionMal` de P-03:

> «Atrás meu» calca el «detrás mío» español. En portugués **normativo**
> —europeo y brasileño— no existe: el adverbio de lugar exige la
> preposición («atrás do meu», «ao lado do meu»). El habla coloquial de
> Brasil lo deja oír, pero no pasa a la escritura en ninguna de las dos
> normas.

**Lo que hay que corregir (DISCUTIBLE fuerte — rompe el «neutro por
teorema»).** El documento afirma que en P-01 y P-03 «las dos glosas son
español CORRECTO», y de ahí deduce que el rasgo 12 queda neutro **por
teorema**. En P-03 el teorema tiene un agujero:

- «detrás **del mío**» (GJ-02) es español impecable.
- «detrás **mío**» (GJ-01) es español **extendido pero censurado por la
  norma culta** (el DPD desaconseja expresamente adverbio de lugar +
  posesivo), y además está **prácticamente ausente del español de
  México**, donde se dice «atrás de mí / detrás de mí».

Es decir: dentro de P-03 las dos glosas **no** son igual de buenas, y el
rasgo «la glosa es español correcto» apunta —débilmente, pero apunta—
BIEN⇒correcta / MAL⇒dudosa. La neutralidad es empírica, no teoremática.
Y hay un problema mayor detrás: **la presión de interferencia que el
ítem dice combatir puede no existir para el usuario.** El español
publicado en esta app es mezcla panhispánica escorada a América (`carro`
64 / `coche` 30; `celular` 30 / `móvil` 25; `ustedes` 22 / `vosotros` 7).
Para un lector mexicano, «detrás mío» no es su gramática: el MAL
portugués no le sale del calco, le sale de la nada. El par mide menos de
lo que cree.

Corolario menor: las glosas de P-03 usan `coche` y `aparcado`, ambos
peninsulares, en un corpus que prefiere `carro` y `estacionar`. Cambiar a
«El carro de él quedó estacionado…».

---

## 4. Respuesta a la pregunta 3: ¿son C2 de verdad?

No. Ninguno de los tres.

| par | nivel real de la **regla** | nivel al que el **error** muere | valor discriminante en C2 |
|---|---|---|---|
| P-01 | — (la regla, tal como está escrita, es falsa) | — | negativo: penaliza al que ha leído |
| P-02 | **A2–B1**. «El portugués no lleva "a" ante el OD» es de las tres primeras cosas que se le dicen a un hispanohablante; el propio banco descarta otro candidato *por ser* de A2 (`b2-art-com-nome`) y no aplica el mismo criterio aquí. | fosiliza hasta **C1** en producción libre | ítem de techo: casi todos aciertan |
| P-03 | **B1–B2**. `adv + de + posesivo` es contenido de los primeros meses. | **B1**, y para un mexicano nunca llega a aparecer | bajo |

Lo que **sí** sería C2 dentro de estos tres fenómenos es el **residuo**,
no la regla:

- de P-02: que el alumno sepa que «viu-**a a ela**» es obligatorio y
  «visitar **ao** avô» imposible — *la misma preposición, dos veredictos
  opuestos según el tipo de OD*. Eso es un borde de verdad, y es
  exactamente lo que la explicación actual borra al decir que la «a»
  personal no existe.
- de P-01: que sepa distinguir «disse-lhe, ao director, que…»
  (dislocado, correcto) de «disse-lhe ao director que…» (llano,
  dispreferido) de «chamaram-lhe ladrão ao João» (llano y **correcto**,
  porque `chamar` lo licencia léxicamente). Eso es C2. Pero no cabe en un
  juicio binario: pide un ítem de **preferencia/registro** de tres o
  cuatro opciones, que es otro formato y otro punto.

---

## 5. Hallazgo colateral, fuera de los seis ítems

El MDX que enmarca este punto —
`lib/data/languages/pt/mdx/b12/l1-o-limite-da-gramatica.mdx`— contiene
**dos** afirmaciones falsas, no una:

1. «el portugués no [duplica el clítico] ("disse ao João", nunca
   "disse-lhe ao João")» → refutada por los 12 pasajes de §2.
2. «El español tiene un neutro ("lo importante") y el portugués tiene que
   nombrar el nombre ("o que é importante")» → **también falsa.** El
   portugués tiene el artículo neutro y lo usa: «mande servir o chá, que
   é **o importante**» (`o-crime-do-padre-amaro-c10`), «**o essencial é**
   que os homens recebam a santidade interior» (`…-c14`), «**O melhor é**
   vêr o casarão» (`a-cidade-e-as-serras`), «**O certo é** que Domingos
   Botelho frequentava o paço» (`amor-de-perdicao-c02`). 15 hits del
   patrón `o + adjetivo + ser`; **0 hits** de «o que é importante /
   melhor / essencial», la forma que el MDX presenta como obligatoria.

Está fuera del encargo, pero es la lección que gobierna el punto que este
lote viene a llenar. Publicar el lote sin tocarlo deja el error donde
está y le añade un ítem que lo confirma.

---

## 6. Qué está bien (específico)

No es cortesía: si esto se rehace, hay que conservarlo.

- **La regla de corte se aplicó de verdad.** Seis y no doce, con los
  descartes escritos y motivados en el banco. Los cuatro candidatos
  descartados están descartados por buenas razones —en particular
  `encontrei Ø João` por ser reenseñanza de A2, que es el criterio
  correcto y el que faltó aplicarle a P-02.
- **La disciplina de «un grep da candidatos, no veredictos» funcionó.**
  Los tres falsos positivos que el revisor anterior desactivó estaban
  bien desactivados. Con el grep a secas se habrían retirado tres pares y
  uno de ellos (P-03) es bueno.
- **P-03 por el lado portugués es un par sólido**, y raro: 0 hits en 4,3 M
  de caracteres con la grafía antigua cubierta, y el BIEN con paralelo
  estructural exacto en Camilo. Si se recicla algo de este lote, es esto.
- **La coleta de P-02 es portugués europeo de buena ley**, aunque
  estorbe: `ao lar` con verbo de movimiento y `estar a dormir` en vez de
  gerundio son los dos marcadores europeos correctos, y el segundo es de
  los que este proyecto vigila.
- **`correio registado`** (no *registrado*), **`ficou estacionado`**,
  **`O carro dele`** (no *o seu carro*, ambiguo): las tres son elecciones
  europeas correctas y deliberadas.
- **La válvula `permiteSNPosterior` se usó como está diseñada**: por
  escrito, con el motivo lingüístico correcto (artículo ≠ clítico), en
  vez de escondida en un `if`.
- **El razonamiento de la restricción del mapa** —elegir pares cuyos dos
  miembros glosen igual— es correcto y es la salida buena al problema del
  punto `trampa`. Falla en la ejecución de P-03, no en la idea.

---

## 7. Bloqueantes — lista cerrada

**Hard (impiden publicar tal cual):**

1. **P-01 muere.** GJ-03 y GJ-06 fuera. El MAL no es agramatical: 12
   pasajes de Garrett, Camilo y Eça en `lecturas/`, seis de ellos sin
   pausa ni dislocación, y uno (`os-maias-c16`) en una lectura de
   `nivel: C2`. La cita decisiva es `viagens-na-minha-terra-c07`: «Eu
   **lhe digo aos senhores**».
2. **Nivel.** Ninguno de los tres pares es C2 (P-02 = A2–B1, P-03 =
   B1–B2). Quitado P-01, quedan 4 ítems sub-nivel llenando un punto
   declarado de C2. O se reclasifican y salen de
   `b12-borde-gramaticalidad`, o el punto se queda en 0 declarado.
3. **ERROR en GJ-04.** «El portugués no tiene la "a" personal» es falso:
   acusativo preposicional obligatorio con tónico (`escolhera-o a elle`,
   `amo-te a ti`, `a viu a ela`) y residuo con `Deus` (`ofender a Deus`).
   Texto de sustitución dado en §3.
4. **ERROR de alcance en GJ-01.** «no existe en ninguna variedad»
   compromete al portugués brasileño sin evidencia; el corpus es 100 % PE
   del XIX y la app es bi-variante. Texto de sustitución dado en §3.

**Blandos (hay que resolverlos, no obligan a rehacer el lote):**

5. **Confound de P-02.** La coleta `ao lar` mete un segundo contraste con
   `a` que no se juzga y que permite acertar por cacofonía. Esqueleto de
   sustitución dado en §3. Cualquier cambio de texto **caduca el
   preflight** (`rev ff3e2d90`) y obliga a re-ejecutarlo.
6. **El «neutro por teorema» de P-03 no se cumple.** «detrás mío» no es
   español igual de correcto que «detrás del mío» (norma culta lo
   desaconseja; ausente del español de México, que es la variedad
   dominante del corpus de glosas). Reetiquetar la glosa de GJ-01 y
   rebajar la afirmación de «neutro por teorema» a «neutro medido».
   Colateral: `coche`/`aparcado` → `carro`/`estacionado`.
7. **Citas no verbatim.** `deu-lhe a mão` no existe en el corpus (es
   `estendeu-lhe a mão`, `o-crime-do-padre-amaro-c14`). Aparece como
   evidencia en el lote, en el banco y en el generador. Corregir o
   retirar. **Y** `director` → **`diretor`** (grafía pre-AO90) si el
   esqueleto de P-01 se recicla.

**Recomendación fuera de la lista, para la sesión que recoja esto:**
corregir el MDX `b12/l1-o-limite-da-gramatica.mdx`, que hoy publica dos
afirmaciones falsas (§5). El lote 13 no las inventó, pero iba a
certificarlas.
