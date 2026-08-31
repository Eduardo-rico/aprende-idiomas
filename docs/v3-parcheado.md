# Lote 10 B2C2 · **v3** — RONDA 3, la última que permite la regla de corte

**Sesión E2#13, 2026-09-03.** Tercera y última ronda. Por la regla de
corte (Edu, E2#8) **lo que no pase aquí se mata y el lote publica con el
resto: no hay ronda 4.**

Historia: la **v1** no publicó (los dos revisores convergieron en NO; el
lingüístico retiró los cinco MAL con corpus del propio proyecto y el
pedagógico midió que el atajo de la **longitud** acertaba 13 de 16). La
**v2** no publicó (7 de 8 MAL aguantaron —progreso real— pero cayeron
GJ-07 y GJ-15, y la v2 **perdió tres correcciones ya pagadas** de la v1).

| punto | antes | falta | tras el lote |
|---|---:|---:|---:|
| `b11-aspecto-tempo` | 3 | 9 | **11** (no cierra) |
| `b11-regencias` | 10 | 2 | **16** (cierra) |

**El lote sale con 14, no con 16**, y ninguno de los dos ítems que la
ronda 2 tumbó pudo reponerse: las tres reposiciones que escribí murieron
en el gate o en el corpus (detalle en las lápidas de GJ-07 y GJ-15). Por
la regla de corte se matan y el lote publica con el resto. Consecuencia
declarada: `b11-aspecto-tempo` se queda a **uno** del piso.

## Qué cambia respecto de la v2

**Los dos ítems que cayeron NO pudieron reponerse.** Escribí tres
reposiciones y las tres murieron antes del round — dos en el gate de
virginidad por estar ya publicadas casi literales, y la tercera en el
corpus. Está en las lápidas de GJ-07 y GJ-15, con sus cifras.

**Las diez correcciones obligatorias del round, aplicadas una a una** —
incluidas las tres que la v2 había perdido (GJ-05, GJ-06, GJ-16):

| # | ítem | qué se corrige |
|---|---|---|
| 1 | GJ-01 | la causa estaba **del revés** (con negación el español coloca igual y empuja hacia lo correcto) + el absoluto no vale para el infinitivo |
| 2 | GJ-05 | «obligatorio tras *quando* de futuro» → acotado a la **subordinada temporal** («Quando nos vemos?» está bien) |
| 3 | GJ-06 | «gerundio que aquí no cabe» → **cabe: 48 casos de `ficar` + gerundio** en Eça y Camilo |
| 4 | GJ-10 | el contraste `por`/`para` estaba en la casilla equivocada (es del **destinatario**, no del motivo) |
| 5 | GJ-12 | causa inventada («por analogía con respeitar») → BR con objeto directo, o hipercorrección del *a* personal |
| 6 | GJ-13 | «separa dos verbos» es falso: Priberam ac. 11 da `reparar` transitivo = notar |
| 7 | GJ-14 | «los dos distintos del español» es falso **en sus dos mitades** + `crase` → `contração` (metalengua europea) |
| 8 | GJ-16 | faltaba la salvedad de la perífrasis, y sin ella **contradice a GJ-05** en el mismo lote |
| 9 | GJ-02/03/04 | menores: acotar a «español **estándar**», quitar «perífrasis con normalmente», blindar el absoluto de «esperar que» |
| 10 | GJ-07/15 | **muertos** por la regla de corte (ver lápidas) |

**Y el arranque, equilibrado por primera vez.** En la v2 los cuatro ítems
que abrían con adjunto o subordinada eran **los cuatro MAL** — 12/16,
p=0,038: el atajo que fabricó el arreglo del atajo de la longitud. Ahora
abren con adjunto **dos MAL y dos BIEN** (GJ-01, GJ-02 · GJ-06, GJ-14) y
el rasgo cae a 8/14, p=0,395. GJ-06 y GJ-14 se reordenaron para eso, sin
tocar lo que enseñan.

---

## Preflight — salida pegada (sin ella no se abre el round)

```
# Preflight — 2026-09-03-lote10-b2c2-v3.md

Batería de atajos: **11 rasgos**, rev `4cc7a606`. Si esta rev no es la del repo, la salida está caducada.

Ítems: **14** · BIEN 8 · MAL 6

## Molde

Patrón: `MMBMBBBMBMMBBB` · prefijo de 4: `MMBM` · racha máxima: 3 · desequilibrio: 2

## Atajos — acierto SOBRE N (14), nunca recall sobre los MAL

| rasgo | acierto | dirección | presente en | p |
|---|---:|---|---:|---:|
| posición par en el lote (alternancia mecánica) | **9/14** (64 %) | presente⇒BIEN | 7 | 0.212 |
| más corta que la mediana (palabras) | **9/14** (64 %) | presente⇒MAL | 5 | 0.212 |
| más corta que la mediana (caracteres) | **9/14** (64 %) | presente⇒MAL | 7 | 0.212 |
| lleva marcador temporal | **9/14** (64 %) | presente⇒MAL | 7 | 0.212 |
| lleva verbo en primera persona | **9/14** (64 %) | presente⇒BIEN | 5 | 0.212 |
| lleva preposición contraída (do/da/no/na/ao/à/pelo) | **9/14** (64 %) | presente⇒BIEN | 11 | 0.212 |
| arranca con adjunto o subordinada, no con el sujeto o el verbo | **8/14** (57 %) | presente⇒MAL | 4 | 0.395 |
| lleva una palabra visiblemente española | **8/14** (57 %) | presente⇒MAL | 0 | 0.395 |
| lleva clítico con guion (ênclise/mesóclise) | **8/14** (57 %) | presente⇒BIEN | 4 | 0.395 |
| lleva dos o más oraciones (punto o punto y coma interior) | **8/14** (57 %) | presente⇒MAL | 0 | 0.395 |
| lleva una coma (frase con coleta) | **7/14** (50 %) | presente⇒BIEN | 9 | 0.605 |

## Virginidad — 14 candidatos (+14 sondas de núcleo) contra 2431 publicados + entre sí (umbral 0.34)

- `GJ-01` ↔ `e75e296f` — 0.408 · comparten: sobre, nada, disse
  > Ele não ___ disse nada sobre a viagem.
- `GJ-01` ↔ `b2c2-gj-l2-19` — 0.389 · comparten: disse-me, disse
  > Ela me disse que vinha. · Ela disse-me que vinha.
- `GJ-06` ↔ `ea8b0d49` — 0.406 · comparten: fiquei, ontem
  > eu fiquei · Eu fiquei em casa ontem.
- `GJ-08` ↔ `b9f10f09` — 0.407 · comparten: levanta, vai
  > Ele se levanta e vai embora.
- `GJ-01·núcleo` ↔ `e75e296f` — 0.408 · comparten: sobre, nada, disse
  > Ele não ___ disse nada sobre a viagem.
- `GJ-01·núcleo` ↔ `b2c2-gj-l2-19` — 0.389 · comparten: disse-me, disse
  > Ela me disse que vinha. · Ela disse-me que vinha.
- `GJ-06·núcleo` ↔ `ea8b0d49` — 0.406 · comparten: fiquei, ontem
  > eu fiquei · Eu fiquei em casa ontem.
- `GJ-08·núcleo` ↔ `b9f10f09` — 0.407 · comparten: levanta, vai
  > Ele se levanta e vai embora.
- `GJ-11·núcleo` ↔ `abe27690` — 0.346 · comparten: chegámo
  > Tinha feito o bolo quando nós chegámos.

**9 pares fiables** + 1 contra ítems de texto ínfimo (score no fiable).

## Frases idénticas a algo publicado

Ninguna.

## Veredicto

Avisos (9), no bloquean:
- virginidad: GJ-01 ↔ e75e296f a 0.408
- virginidad: GJ-01 ↔ b2c2-gj-l2-19 a 0.389
- virginidad: GJ-06 ↔ ea8b0d49 a 0.406
- virginidad: GJ-08 ↔ b9f10f09 a 0.407
- virginidad: GJ-01·núcleo ↔ e75e296f a 0.408
- virginidad: GJ-01·núcleo ↔ b2c2-gj-l2-19 a 0.389
- virginidad: GJ-06·núcleo ↔ ea8b0d49 a 0.406
- virginidad: GJ-08·núcleo ↔ b9f10f09 a 0.407
- virginidad: GJ-11·núcleo ↔ abe27690 a 0.346

**Preflight limpio.** El round puede abrirse con esta salida pegada en el documento.
```

---

## A · `b11-aspecto-tempo` — 8

### GJ-01 · **MAL**
**sentence:** «Ontem à noite não disse-me nada sobre o que tinha acontecido na reunião.»
**repair:** «Ontem à noite não me disse nada sobre o que tinha acontecido na reunião.»
**explicación:** Con el verbo **finito**, «não» obliga a la próclise: el
clítico va delante. Es de las reglas de colocación más firmes del
portugués, y vale igual en Portugal y en Brasil. (Con infinitivo la cosa
se afloja: «para não lhe dizer» y «para não dizer-lhe» son las dos
correctas.) Ojo: aquí el español **no** te traiciona —dice también «no me
dijo nada»—; el error sale de haber aprendido que la ênclise es lo normal
en portugués y aplicarla también donde hay atractor.

### GJ-02 · **MAL**
**sentence:** «Se eu seria mais novo, ainda iria convosco à serra no próximo fim de semana.»
**repair:** «Se eu fosse mais novo, ainda iria convosco à serra no próximo fim de semana.»
**explicación:** La prótasis de una condición hipotética va en
**imperfeito do conjuntivo**, nunca en condicional: «se eu fosse». El
condicional se queda para la apódosis («iria»). El español estándar
tampoco admite «si yo sería», así que aquí el calco no viene de la lengua
materna sino de la simetría aparente entre las dos mitades.

### GJ-03 · **BIEN**
**sentence:** «Costumo levantar-me às sete, mesmo ao fim de semana, e depois leio um bocado.»
**explicación:** «Costumar + infinitivo» es la manera europea corriente de
decir la habitualidad. Y la ênclise «levantar-me» es la colocación por
defecto, sin atractor que la mueva.

### GJ-04 · **MAL**
**sentence:** «Espero que o teu irmão vem connosco ao casamento no sábado que vem.»
**repair:** «Espero que o teu irmão venha connosco ao casamento no sábado que vem.»
**explicación:** «Esperar que» rige **conjuntivo** en portugués igual que
en español («espero que venga»). El error es de los que delatan que el
alumno reconoce el conjuntivo pero no lo dispara, porque «vem» y «venha»
suenan cerca y la frase parece completa sin él. (Con futuro y valor de
convicción firme aparece a veces el indicativo —«espero que virá»—, pero
es uso marginal; con presente, como aquí, no cabe.)

### GJ-05 · **BIEN**
**sentence:** «Hei de te contar tudo quando nos virmos com calma, prometo que não me esqueço.»
**explicación:** «Haver de + infinitivo» es la perífrasis europea de
intención firme, que el español no tiene con ese valor; en predicado
complejo el clítico sale del dominio del verbo finito («Has de te
lembrar», Eça). Y «quando nos virmos» es futuro do conjuntivo,
obligatorio tras «quando» **en oración subordinada temporal** de futuro
(en la interrogativa no: «Quando nos vemos?» está bien).

### GJ-06 · **BIEN**
**sentence:** «Ontem à noite fiquei a pensar no que me disseste e não preguei olho.»
**explicación:** «Ficar a + infinitivo» expresa que la acción CONTINÚA a
partir de un punto, y es de lo más corriente en Portugal. El español lo
resuelve con «me quedé pensando»: la norma europea de hoy prefiere el
infinitivo, «ficar a pensar» (en Eça y en Camilo todavía encontrarás
«ficou pensando»).

### GJ-07 · **MUERTO POR LA REGLA DE CORTE**

Cayó en la ronda 2 («vou a levar»: `ir a + infinitivo` está en
Ciberdúvidas y 25 veces en el corpus). **La reposición murió en el
preflight**: escribí «Tenho falado com o teu irmão ontem à tarde…» y el
gate lo cazó a **0,674 contra `b2c2-gj-l5-10`**, que ya publica «Ontem
tenho falado com o teu pai» con esta misma explicación. No es que se
pareciera: es el mismo ítem.

**Banco para el lote siguiente** (no entra aquí porque dejaría el molde en
9 BIEN contra 6 MAL, desequilibrio 3, y el preflight lo bloquea — no se
afloja un gate para que pase el propio lote): «Tenho dormido mal estas
últimas semanas, deve ser do calor que está», BIEN, con el PPC durativo
y la perífrasis de probabilidad en la misma frase.

**Y un tercer MAL que ni se escribió**: `esquecer-se DE` frente al «me
olvidé el paraguas» español parecía categórico, y el grep ancho lo tumbó
antes — Eça trae «esquecia-me **o cognac**», «Esqueceram-me **as
queijadas**», «Esquecia-me **o Cruges**». Es otra construcción (el objeto
es sujeto y el clítico es dativo), pero convive con lo que yo iba a
condenar. Tres intentos, tres atestaciones: por eso el lote sale con 14.

### GJ-08 · **BIEN**
**sentence:** «A avó vai melhorando aos poucos e já se levanta sozinha para ir à cozinha.»
**explicación:** «Ir + gerúndio» **sí** es europeo: marca el avance
gradual, y no es el progresivo. Es el contraejemplo que impide leer la
regla como «en portugués europeo nunca hay gerundio» — una regla que, así
enunciada, es falsa.

### GJ-09 · **MAL**
**sentence:** «Ele saiu de casa sem que ninguém o viu, com os sapatos na mão.»
**repair:** «Ele saiu de casa sem que ninguém o visse, com os sapatos na mão.»
**explicación:** «Sem que» rige **conjuntivo**, y con la principal en
pasado pide imperfeito: «visse». La propia frase trae el contraste
delante: «como se fosse» ya está bien puesto, así que el ítem se resuelve
comparando sus dos mitades.

## B · `b11-regencias` — 6

### GJ-10 · **BIEN**
**sentence:** «Deram-me os parabéns pelo trabalho, mas eu bem sei quem fez a parte difícil.»
**explicación:** Ênclise en oración afirmativa iniciada por el verbo:
«Deram-me» es la colocación por defecto. El motivo va con **por**
(«pelo trabalho» = por + o). Y cuando aparece el destinatario, el régimen
europeo es **a** —«dar os parabéns **a** alguém»—, no «para», que es lo
brasileño; aquí el destinatario es el propio clítico «-me».

### GJ-11 · **MAL**
**sentence:** «Chegámos em Lisboa às seis da tarde, depois de sete horas de comboio.»
**repair:** «Chegámos a Lisboa às seis da tarde, depois de sete horas de comboio.»
**explicación:** «Chegar **A**» un sitio; «chegar em» es brasileño. Y
«chegámos» con acento es la 1.ª plural del pretérito en la norma europea,
donde el presente sería «chegamos» — el acento es facultativo bajo el
AO90, pero la oposición sigue viva.

### GJ-12 · **MAL**
**sentence:** «Os miúdos costumam obedecer os avós sem discutir, o que já é raro nesta idade.»
**repair:** «Os miúdos costumam obedecer aos avós sem discutir, o que já é raro nesta idade.»
**explicación:** «Obedecer **A** alguém», con preposición. El error sale
de suponer que «obedecer» lleva objeto directo, como en el portugués de
Brasil — o de acordarse de que el portugués no tiene «a» personal («Vejo
o meu pai») y borrarla también aquí, donde no es personal sino régimen
del verbo.

### GJ-13 · **BIEN**
**sentence:** «Repara na camisola nova dele, deve ter custado uma fortuna naquela loja.»
**explicación:** «Reparar **EM**» = fijarse en. Con complemento nominal la
preposición decide el sentido: «reparar **na** camisola» es fijarse;
«reparar **a** camisola» es arreglarla. (Con oración completiva no hace
falta: «Reparei **que** estava rota» también es 'me di cuenta'.)

### GJ-14 · **BIEN**
**sentence:** «Quando entrei na sala sem bater à porta, ele nem sequer deu por mim.»
**explicación:** «Entrar **em**» es como el «entrar **en**» de España,
pero choca con el «entrar **a**» de América, que es el que te va a salir
solo. Y en «bater **à** porta» la preposición es la misma del español
(«llamar **a** la puerta»); lo que cambia es el verbo y la contração con
el artículo.

### GJ-15 · **MUERTO POR LA REGLA DE CORTE**

Cayó en la ronda 2 por redundancia (duplicaba a GJ-11 y su frase estaba
publicada). **La reposición también murió en el preflight**: «Assistimos
o jogo todo de pé…» puntúa **0,515 contra `b2c2-gj-l4-17`**, que ya
publica «Ontem assistimos o jogo todo na televisão». Un tercer intento
—`apaixonar-se de` por `por`— lo desmintió el corpus antes de escribirlo:
Camilo trae «apaixonado **de** Thereza» en *Amor de Perdição*, que es
exactamente la clase de atestación que tumbó los cinco MAL de la v1.

### GJ-16 · **BIEN**
**sentence:** «Casou-se com uma arquiteta que conheceu em Coimbra durante o mestrado.»
**explicación:** «Casar-se **COM**», como en español, con el clítico
enclítico en la principal afirmativa. La trampa no es la preposición: es
que el hispanohablante coloca «se casó» y produce «se casou», con
próclise sin atractor que la justifique. Ojo con no aplicar esto de más:
en las perífrasis (como «Hei de te contar», aquí mismo en GJ-05) el
clítico puede ir delante del infinitivo sin ningún atractor — la regla
del atractor manda sobre el verbo finito **simple**, que es el caso de
«casou».
