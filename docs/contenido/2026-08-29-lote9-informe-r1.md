# R1 — Revisión adversarial LINGÜÍSTICA del lote 9 B2C2

Filólogo portugués (Lisboa). Doc revisado:
`docs/contenido/2026-08-29-lote9-b2c2.md` (NO PUBLICADO).
Contrato: `.claude/skills/lote-b2c2/SKILL.md`, leído entero y aplicado
casilla a casilla.

Todo lo que sigue está verificado contra: los 224 JSON de
`lib/data/languages/pt/lecturas/`, los 2.318 ítems de
`lib/data/languages/pt/blocks/*.json`, Priberam, Ciberdúvidas, y la
salida del propio `scripts/check-virginidad.ts`, que **corrí yo** porque
el doc lo deja «(pendiente)».

**21 ERROR · 25 DISCUTIBLE.**

---

## ERROR

### E1 · GJ-03 «Há que ter paciência» — la prueba del corpus es de OTRA construcción (el pecado del lote 5, repetido y ya publicado en la explicación)

Cita textual (explicación que ve el alumno):

> «y el corpus del curso lo trae con naturalidad ("não havia que
> duvidar", "não havia que philosophar")»

Prueba. Leí las cinco atestaciones enteras. **Las cinco son la
construcción existencial NEGATIVA «não há que + inf» = 'no hay nada que
X'**, no la deóntica «há que + inf» = 'hay que X':

```
os-maias-c13[165]        Não havia que duvidar, era um namoro...
o-crime-...-c23[46]      Mas emfim não havia que philosophar: era partir para Poyaes
o-crime-...-c22[133]     Em vossa senhoria é que não ha que estranhar, que vem por aqui todos os dias
amor-de-perdicao-c15[39] não houve que redarguir á rigorosa prelada
os-maias-c06[296]        quando ha que cosinhar, sabe cosinhar   (= 'cuando hay cocina que hacer')
```

«Não havia que duvidar» significa *no había lugar a duda*, no *no había
que dudar*. Es literalmente el caso «todo o que»/«eram as duas» del lote
5: **el grep devolvió la cadena y no el sentido.** Y esta vez la prueba
falsa está escrita en la explicación que lee el alumno.

Nota de honestidad: **el verdict BIEN es correcto** — «há que +
infinitivo» deóntico es portugués europeo vivo. Pero Priberam **no lo
registra** como locución en `haver` (sólo «haver de»), y la única glosa
que lo respalda es `b3/6b47a59b`, escrita por este mismo proyecto:
apoyarse en ella es circular.

Qué debe decir. Quitar las dos citas falsas. La única atestación
afirmativa del corpus es Eça, `a-cidade-e-as-serras-c02[14]`, Jacinto
delante de su biblioteca: **«--Ha que lêr, ha que lêr...»** (y su
negativa en c07[57], «Não ha que lêr»). Es la cita que sí sirve, y es de
la propia Biblioteca.

### E2 · MED-129 — el modelo incumple DOS de sus cinco casillas

Casilla 2 pide: «que la reina se disfraza de vendedora TRES veces
(collar, peine envenenado, manzana envenenada) **y que las dos primeras
las deshacen los enanos**».
Modelo: «a rainha disfarça-se de vendedeira três vezes: colar, pente e
maçã.» → **no hay enanos.** Fuente: `junqueiro-branca-de-neve[32]`
(«Arrancaram-lhe o collar, e deitaram-lhe nos labios algumas gotas d'um
licor amarello») y `[45]` («Tiraram-lhe o pente envenenado»).

Casilla 3 pide: «al lobo lo abre un cazador que saca vivas a la niña **y
a la abuela**, y **muere** por las piedras…; …**y la reina muere de
miedo**».
Modelo: «a menina do chapelinho é salva por um caçador, que abre o lobo
e lhe cose pedras na barriga». → **no sale la abuela** (`[35]` «A avó
saiu também contentissima»), **no muere el lobo** (`[37]` «caiu no lago,
e affogou-se»), **no muere la reina** (`[68]` «teve tal medo… que morreu
de repente»).

Con 115/140 palabras hay sitio de sobra: redacté el mínimo cumplidor y
mide ~115. No es el rango: es que el modelo no lo usa.

### E3 · MED-129 — «No Chapelinho Vermelho»: título brasileño en un curso pt-PT

Cita: «No **Chapelinho Vermelho**, o lobo engole a avó…»

En Portugal el cuento es **«O Capuchinho Vermelho»**; «Chapeuzinho
Vermelho» es Brasil; y la fuente del propio curso lo llama «o
chapellinho encarnado». «Chapelinho Vermelho» no es ninguna de las tres:
es un híbrido. En un lote cuyo bloque se llama *Anti-calco* y cuyo
modelo es el ejemplar de portugués europeo, esto es exactamente lo que
no puede pasar.

Qué debe decir: «No *Capuchinho Vermelho*» (o, si se quiere respetar la
grafía de la fuente, «No conto do chapelinho encarnado»). Y entonces
«a menina do chapelinho» del final pasa a «o Capuchinho».

### E4 · MED-129 — «o lobo engole a avó, veste-lhe a roupa»

El dativo `-lhe` con `vestir` se lee como *la viste a ella*: «vesti-lhe
o casaco» = le puse el abrigo. Después de tragársela, el lobo no puede
vestirla. La fuente dice `[21]`: «vestindo **o fato que ella costumava
usar**».

Qué debe decir: «veste a roupa dela» / «veste-se com o fato da avó».

### E5 · MED-132 — la rúbrica exige un dato que NO está en el recorte declarado

Fuente declarada: `um-poeta-lirico` **[55]–[59]**.
Casilla 3 exige: «¿Recoge a Korriscosso: **poeta que sirve mesas**,
enamorado de Fanny…?»

Leí [55]–[59] entero. Contiene «a sua bela cabeça de poeta» [55],
«criada de todo o serviço em Charing-Cross» [56], «aquele poeta a seu
lado» [57], el policeman [57]–[58], el griego [59]. **No dice en ningún
sitio que Korriscosso sirva mesas ni que trabaje en un restaurante.**
Eso está en [45]–[46] y en [54] («porque não deixa êste covil, êste
templo do ventre?»), fuera del corte. El modelo («Korriscosso é poeta e
serve mesas em Londres») cumple la rúbrica pero **no la fuente**.

Respuesta directa a la nota (i): **[55]–[59] NO se sostiene solo.** «E
disse-me a razão que o prende» — ¿que lo prende a qué? El antecedente
está en [54]. Arreglo mínimo: recortar **[54]–[59]** (añade 10
palabras y trae «êste covil, êste templo do ventre», que ancla oficio y
lugar de una vez).

### E6 · MED-132 — el modelo incumple su casilla 2 y media casilla 1

Casilla 2 exige «…**y que el hombre agradece dos veces, el consejo y la
delicadeza**». El modelo dice «A moral vem escrita: o dono não se
substitui por terceiros» y **nada más**. La fuente,
`junqueiro-o-talisman[7]`: «agradecendo-lhe duplamente, em primeiro
logar, o seu bom conselho, e em segundo logar, a maneira delicada porque
lh'o tinha dado.»

Casilla 1 enumera cinco sitios (**bodega, cocina, granero, cuadra,
libros**). El modelo da tres («a adega vazia, o celeiro roubado, os
livros mal escriturados»): faltan **cozinha** y **estribaria** ([6]: «na
cozinha o pão, a carne e os legumes; …na estribaria, o feno e a aveia»).

### E7 · MED-133 — «todos os dias» no es lo que dice la fuente, y además está fuera del recorte

Cita del modelo: «quem o traz ao pescoço percorre a casa toda, **todos
os dias**».

La fuente dice `[2]`: «Trago-o ao pescoço, e ando assim com elle **todo
o dia** por toda a casa» — *todo el día*, no *todos los días*. Y **[2]
está fuera del recorte declarado [5]–[7]**. La casilla 2 («obliga a su
portador a recorrer la casa entera **todos los días**») hereda el mismo
doble defecto.

Qué debe decir: o se amplía el recorte a [2] + [5]–[7], o la casilla y
el modelo dicen «percorre a casa toda, do celeiro à adega» (que sí sale
de [6]) sin inventar frecuencia.

### E8 · MED-133 es un subconjunto de MED-132 — clon interno que el gate no puede ver

`junqueiro-o-talisman` [5]–[7] ⊂ [0]–[7]. Los dos modelos dicen casi la
misma frase:

- MED-132: «recebe… uma avelã com um fio. Andando com ela ao pescoço por
  toda a casa, **descobre a desordem: a adega vazia**, o celeiro
  roubado, **os livros mal escriturados**.»
- MED-133: «apenas uma avelã atravessada por um fio de seda… quem o traz
  ao pescoço percorre a casa toda… **descobre a adega vazia e os livros
  mal escriturados**.»

Comparten el 4-grama exacto `os livros mal escriturados` y la
colocación `descobre a adega vazia`. Corrí el gate: **cero pares** para
las dos (el eje IDF no ve mediaciones — ver más abajo). Es el patrón
MED-53/med-38 de E2#4: misma fuente, mismos datos, rúbrica solapada, y
los dos ejes del gate mudos.

La nota (j) lo declara como «ruido». No es ruido: es que dos de las doce
mediaciones del lote enseñan el mismo párrafo. Retirar una, o cambiarle
la fuente a MED-133 (`junqueiro-o-ouro`, `junqueiro-o-malmequer`… hay
80 Junqueiro vírgenes).

### E9 · MED-134 — el diálogo NO muestra tres niveles: muestra dos

La consigna, la casilla 2 y el modelo se apoyan en que «Vai levar a azul
ou a branca?» es un **tercer nivel intermedio**. Pero el que dice «Vai
levar…» es **el mismo vendedor que dos líneas antes ha dicho «O senhor
deseja?»**, al mismo cliente. Eso no es un nivel distinto: es el nivel
deferente con el pronombre elidido, que es lo normal en cuanto el
tratamiento ya está establecido.

El fenómeno que se quiere enseñar (3.ª persona sin pronombre como
«usted» neutro portugués) **es real y es el punto correcto** — pero
necesita un interlocutor que no haya sido tratado de «o senhor». Tal
como está, se le enseña al alumno a ver una oposición que el texto no
contiene, y el modelo la agrava: «ahí está el "usted" español» — cuando
«o senhor deseja?» también es «usted».

Qué debe decir: tres interlocutores. P. ej. el vendedor trata al cliente
mayor de «o senhor», a un cliente de la misma edad en 3.ª sin pronombre
(«Leva a azul ou a branca?»), y el cliente trata de «tu» a Rita.

### E10 · MED-136 — el modelo incumple su casilla 1 y «convidar» se queda sin objeto

Casilla 1: «¿Conserva los datos: **los novios (o novio e Inês)**, 12 de
septiembre…?». El modelo empieza «**Têm** o prazer de convidar para o
seu casamento» — sin sujeto y **sin nombrar a nadie**. Con 71/95
palabras hay sitio.

Y «convidar **para** o seu casamento» no lleva objeto directo. La
fórmula portuguesa es «*X e Y têm o prazer de convidar V. Ex.ª para o
seu casamento*». Ya que el catálogo tiene `V_Exa` (2 usos) y este es
exactamente su hábitat, es una ocasión desperdiciada.

### E11 · MED-138 — «recenseados no concelho» dice otra cosa (y algo imposible)

Fuente: «los menores de dieciséis años **empadronados** en el
municipio». Modelo: «os miúdos até aos 16 anos que estejam
**recenseados** no concelho».

En Portugal «estar recenseado» se lee como **inscrito no recenseamento
eleitoral**. Un menor de 16 no puede estarlo. Priberam admite el sentido
censual genérico («incluir no recenseamento»), pero aplicado a niños el
resultado es una contradicción que cualquier padre portugués nota.

Qué debe decir: «que **morem** no concelho» / «**residentes** no
concelho».

### E12 · MED-138 — «até aos 16 anos» ≠ «menores de dieciséis años»

«Menores de dieciséis» excluye a los de 16; «até aos 16 anos» los
incluye. En un ítem cuya casilla 3 hace de la **inclusividad** un
criterio calificado, dejar que el otro límite se deslice es incoherente.

Qué debe decir: «os miúdos com **menos de** 16 anos».

### E13 · MED-139 — el modelo incumple su casilla 4, y es comprobable por script

Casilla 4: «¿Coloquial brasileño verosímil (você/te, **«pra» al menos
una vez**), entre 30 y 65 palabras?»
Modelo completo: «Me manda o arquivo por email, que no celular não abre.
E se você puder, aperta o botão verde da tela antes de sair — o mouse
ficou piscando a noite toda.» → **no aparece «pra».** 32 palabras
(mínimo 30): margen de dos.

Es justo la casilla verificable por script que el contrato pide, y es la
que falla.

### E14 · MED-140 — de los «CUATRO de léxico», dos no son léxico o no son brasileños

Casilla 1: «¿Cambia los CUATRO de léxico: maiô→fato de banho,
**chinelo→chinelos**, bermuda→calções, **orla→marginal**?»

- **chinelo→chinelos** no es un cambio léxico: Priberam da `chinelo`
  («sapato caseiro sem salto nem tacão») **sin marca regional** en las
  dos acepciones vivas; la única marca es `[Brasil: São Paulo]` para un
  pez. Es una diferencia de número, y ni siquiera categórica.
- **orla** no es brasileño: Priberam ac. 3, **sin marca**, con el ejemplo
  «*orla marítima*». En Portugal se dice y se legisla («orla costeira»,
  POOC). Es el caso `fila`→`bicha` del lote 5 otra vez: se condena
  vocabulario europeo vivo.

Sólo `maiô→fato de banho` y `bermuda→calções` son pares reales. El
encabezado del ítem («léxico virgen medido», ×4) vende el doble de lo
que entrega.

Qué debe decir: bajar la casilla a los dos pares reales y añadir dos
verdaderos del mismo mensaje: `pra`→`para` ya está en la casilla 3;
sirven `praia`… no; mejor `esfriar`→**arrefecer** (el modelo ya lo hace,
gratis) y `tomar um sorvete`→**comer um gelado** (el modelo también:
cambia el verbo, que es lo bueno). Con `orla`, si se quiere conservar,
la casilla debe decir «→ **marginal / à beira-mar**, que es lo idiomático
en Portugal», no que «orla» sea brasileño.

### E15 · GJ-04 — «fazer um curso… suele decir otra cosa (un cursillo)» es falso

Cita: «va a "fazer um curso", **que existe pero suele decir otra cosa
(un cursillo, algo más corto)**».

Ciberdúvidas tiene un artículo cuyo título es literalmente
**«Fazer um curso» = «tirar um curso»** (consultório 29108): *«Pode
utilizar um ou outro: "fazer um curso" ou "tirar um curso"»*, sin
distinguir carrera de cursillo. Y la propia Biblioteca sólo trae
`fazer`/`seguir`, nunca `tirar`:

```
a-cidade-e-as-serras-c09[77]  Fiz toda a sorte de cursos, passei pelos professores mais illustres da Europa
contos-phantasticos--preliminar[2]  ia seguindo o meu curso na Universidade
os-maias-c04[35]  --Grande coisa, ter um curso!
```

El verdict BIEN es intocable (la colocación existe). Lo que hay que
retirar es la falsedad sobre «fazer».

Qué debe decir: «…y va a "fazer um curso", que vale igual (Ciberdúvidas
las da por equivalentes). "Tirar" es la que no se te ocurre.»

### E16 · GJ-07 declara `address: tu` sin una sola marca de 2.ª persona

«Fiquei a saber ontem que ela se mudou para o Porto.» — «Fiquei» 1sg,
«ela se mudou» 3sg. Ni «tu», ni «-te», ni posesivo de 2.ª, ni forma
verbal 2sg. El contrato: *«`address` SÓLO donde hay tratamiento en la
frase»*, y la v1 del lote 5 se rehízo por esto.

Qué debe decir: `informal`, sin `address`.

### E17 · GJ-08 tiene 2sg y NO declara `address`

«**Abre** o grifo, faz favor, que a água já deve estar quente.» —
imperativo de `tu`. Por la misma regla, aquí `address: tu` sí toca.

Los dos errores son espejo: uno declara de más y el otro de menos.

### E18 · La composición de registros del doc está mal contada

Cita: «**registros**: formal ×4, neutro ×5, informal ×3 (el catálogo va
73 % informal; **aquí 25 %**)».

Recuento sobre los propios encabezados del doc:
formal = 129, 133, 136 → **3**.
neutro = 130, 132, 134, 137, 138 → **5**.
informal = 131, 135, 139, 140 → **4** → **33 %**, no 25 %.

Es la regla «todo número que se declare medido lleva la SALIDA PEGADA»:
el bloque de arriba (mediationTypes) sí la lleva y es exacto; éste no la
lleva y está mal.

### E19 · Dos de las audiencias anunciadas no existen

Cita: «aquí entran profesor, colega de trabalho, inquilino, grupo de
pais, **cliente, sobrinha**».

Las doce audiencias reales: professor · vecina española del quinto ·
colega de casa português · colega de trabalho portuguesa · chefe
português · amigo hispanohablante · amiga española · convidados mais
velhos da família · inquilina · grupo de pais · colega brasileiro ·
prima de Lisboa. **No hay cliente ni sobrinha.**

### E20 · «ningún modelo usa "Repara:…" como bisagra. Verificado por script» — el script verificó la letra

MED-129: «…colar, pente e maçã. **O senhor repare na diferença do
desfecho:** a menina do chapelinho é salva…»

Eso es la bisagra prohibida, en su sitio (después de la enumeración,
antes del contraste), con el mismo verbo y los mismos dos puntos, en
tratamiento formal. Un `grep "Repara"` no la caza.

Y no es casual: de los 128 modelos publicados, **cinco** usan «Repara»
—med-27, 35, 37, 44, 52— y **tres de esos cinco son tres de los cuatro
únicos `synthesise_sources` publicados**. «Repara:» *es* la fórmula del
synthesise. MED-129 la reproduce conjugada.

Qué debe hacer el script: buscar el lema `repar-` (repara/repare/
reparem/repares) seguido de dos puntos o de «que», no la cadena.

### E21 · GJ-01 y GJ-03 declaran un `concepts` que no nombra su punto

- GJ-01 «Deixa lá, não vale a pena chateares-te com isso.» →
  `[b8-conectores]`. No hay conector ni subordinada adverbial: hay una
  muletilla y un infinitivo pessoal.
- GJ-03 «Há que ter paciência com estas coisas.» → `[b8-conectores]`.
  Tampoco.

El contrato dice que `concepts` es *el segundo eje del gate: compara el
PUNTO, no las palabras*. Un concepto que no describe el punto deja el
eje mudo para el lote 10. (GJ-09 sí encaja por «como» comparativo;
GJ-07 con `b8-oracoes-subordinadas` está perfecto.)

Nota operativa: los ids `b11-falsos-amigos` / `b11-regencias` **sí son
válidos** (existen en `curriculum.ts:305-306` y los usan 18 ítems
publicados) aunque `concepts.json` esté desactualizado y no los tenga.
No es un bloqueo para publicar.

---

## DISCUTIBLE

**D1 · GJ-10: el hedge es MÁS débil que el del precedente que invoca.**
Dice «en el portugués europeo **no aparece**» — un absoluto. El ítem
hermano publicado, `b2c2-gj-l8-08` («chamar-lhe DE»), dice: *«la
gramática de referencia aún registra esa variante (es antigua — ya está
en Gil Vicente), pero hoy en Portugal sobra»*. Ése es el patrón que
sobrevive. Además, la regência hermana **«dizer PARA + persona» está
atestada 7 veces en la propia Biblioteca**, y no en boca de brasileños:

```
junqueiro-a-mae[2]              pegou-lhe na mãosinha… e disse para o velho
junqueiro-presente-por-presente[0]  examinou os cunhos… e disse para a mulher
viagens-na-minha-terra-c25[4]   Joanninha… disse para o primo
viagens-na-minha-terra-c21[34]  Um mais doutor disse para os outros
o-crime-do-padre-amaro-c04[90]  dizia para os lados, baixo, a snr.ª D.
o-crime-do-padre-amaro-c08[145] disse para a igreja o Benedicat vos
os-maias-c06[166]               dizendo para os lados, que aquella questão… era grave
```

Eso no absuelve a «perguntar para» (que sigue siendo brasileño y tiene
**1** hit en el corpus, y ése es «para que» = 'para qué'), pero sí mata
el absoluto sobre «para» como marca de destinatario en europeo. Y la
prueba positiva está servida: **22** «perguntar a/ao/à/aos/às» y **97**
«perguntar + clítico dativo» en la Biblioteca.

Qué debe decir, calcando a l8-08: «"Perguntar para alguém" es corriente
en el Brasil coloquial y las gramáticas lo registran; en el portugués
europeo el complemento va con "a" — en el corpus del curso hay 22
"perguntou ao/à" y 97 "perguntou-lhe", y ni un solo "perguntar para
alguém"».

**D2 · GJ-02: la explicación elide dos acepciones de Priberam.** Dice
«"Logro" en portugués **es** el engaño». Priberam da ac. 1 «Logração,
posse, gozo» y ac. 4 «[Antigo] Lucro, usura». El verdict aguanta (ninguna
es 'éxito', el corpus da 1 hit y es engaño, y 0 en los 2.318 ítems
publicados), pero el absoluto sobra. «El sentido vivo de "logro" es el
engaño» basta.

**D3 · GJ-06: «cheguei muito pronto» es agramatical sólo en la lectura
pretendida.** «Pronto» adjetivo («preparado») concuerda con el sujeto:
«cheguei muito pronto» es analizable como *llegué muy preparado*. Vale
para el ítem —pasa lo mismo con «logro» y «grifo», que también son
palabras portuguesas— pero conviene saber que ninguno de los cinco MAL
del lote es agramatical *stricto sensu*: son inaceptables por sentido.
(De paso: el «nunca 'temprano'» sí lo sostiene Priberam; comprobé
también la grafía antigua **prompt-**, 64 hits, ni uno adverbial de
'cedo' — sólo «de prompto», «promptamente» y adjetivo.)

**D4 · GJ-01 choca de frente con un publicado, a 0,399 — bajo el umbral
que usó el doc y SOBRE el del código.** Corrí `check-virginidad` con los
22 candidatos al umbral del código (0,34): 14 pares. El que importa:

```
0.399  b2c2-gj-l9-01  ↔  73e19881 (b7 fill_blank)
       comparten: pena, isso
       Não ___ a pena ficar triste por isso.
```

«Não vale a pena **ficar triste por isso**» / «não vale a pena
**chateares-te com isso**». El punto es distinto (b7 enseña «vale a
pena»), pero el chasis es el mismo. El doc informa retiradas a 0,531 y
0,561, es decir auditó a ≥0,5 — **exactamente el descarte silencioso que
el contrato prohíbe** («los tres que importaban vivían en 0,39-0,49»).
Sugerencia: cambiar el marco («Deixa lá, mais vale não chateares-te com
isso» conserva el infinitivo pessoal y rompe la colisión).

**D5 · GJ-08 recicla el señuelo de un GJ publicado, y hasta su
redacción.** `0.42 ↔ b2c2-gj-l4-09` «Se faz favor, uma bica e um copo de
água.» (BIEN), cuya explicación dice «Frase **de manual** de
supervivencia en Lisboa»; GJ-08 dice «que es europeo **de manual**».
Mismo señuelo (faz favor), misma agua, misma expresión.

**D6 · MED-130 es un `relay` de avisos con otra etiqueta.** El lote
presume de «relay ×0». MED-130 comparte con los publicados med-66,
med-70 y med-107: mismo género (dos avisos entre corchetes del portal),
misma dirección pt→es, misma audiencia (compañero/vecina española que no
lee portugués), misma consigna («Los dos avisos/papeles están en el
tablón…»), misma forma de rúbrica —una casilla por aviso, una por la
resolución y la de cierre calcada: «¿Español natural, sin lusismos
(«condóminos», «comparência»), entre 40 y 75 palabras?»— y el mismo
arranque de familia `[Aviso …]`. La operación **sí** es nueva (no
resolver el choque, frente a rectificar), y es lo mejor del lote; pero
el molde es el del relay. El gate no lo ve: `n-gramas ≥6` contra los 128
publicados = **0**.

**D7 · MED-129: a un profesor no se le trata de «o senhor» a secas.** En
Portugal la deferencia con cargo va con el cargo: «o Professor acha
que…», «o Senhor Professor». «O senhor» pelado a tu propio profesor
suena a desconocido en una repartición. La consigna lo **obliga**
(«tratando al profesor por "o senhor"», casilla 4). Además: un
«comentário escrito de meia página» con un «O senhor repare» dentro
mezcla oral y escrito; y media página no son 90–140 palabras (~250).

**D8 · MED-133: «Cito-o ao senhor porque…» es ambiguo y torpe.** El
clítico `-o` (el talismán) compitiendo con «ao senhor» invita a leer
«lo cito a usted». Un lisboeta escribiría «Falo-lhe nisto porque…» o
«Trago-lhe este exemplo porque…».

**D9 · «o celeiro roubado» (MED-132) atribuye mal el participio.** La
fuente `[6]`: «no celleiro, o milho, o trigo, o feijão; **na estribaria,
o feno e a aveia, roubados** das manjadouras dos cavallos». Lo robado es
el forraje de la cuadra. Al granero le *falta*, no se lo *roban*.

**D10 · «vendedeira três vezes» (MED-129/rúbrica): el tercer disfraz es
de campesina.** `[29]` «desfarçada em vendedeira ambulante», `[38]`
«Tornou-se a disfarçar em vendedeira», `[48]` «**Vestiu-se de
camponeza** com um cesto de maçãs». Funcionalmente vende, textualmente
no. (Y «vendedeira» está bien elegida: Priberam la da sin marca y es la
palabra de Junqueiro.)

**D11 · MED-135: el recorte [47]–[52] abre con una anáfora sin
antecedente.** «Mas o que **o** tortura é o contacto constante com o
alimento… Se **êle** fôsse um guarda-livros…» — el nombre no aparece
hasta [49]. Se auto-repara en dos párrafos (restaurante, roast-beef,
«o parlamento de Atenas»), pero es el patrón «Dito isto desappareceu».
Arreglo: empezar en **[46]** («aquele poeta lírico, forçado a distribuir
numa sala… costeletas e copos de cerveja»), que da oficio, lugar y
nombre en una frase.

**D12 · MED-135: la rúbrica consagra un lusismo en el producto
español.** Casilla 3 exige, A LA LETRA, «¿pasado o poco hecho?». En
español de España el par es «**muy hecho** / poco hecho»; «pasado» es
calco de «bem passado». Choca con la casilla 4 («¿Está en español…?»).

**D13 · MED-136: «Quem pretenda pernoitar» calca el español.** Con
referencia futura, el portugués pide futuro do conjuntivo: «Quem
**pretender** pernoitar» — como hace la propia fuente («Quem **quiser**
ficar a dormir») y como hace MED-138 («Quem **quiser**, que trate»).
Ciberdúvidas (33264) admite el presente del conjuntivo con matiz
genérico, así que no es agramatical; pero «Quem pretenda» = «Quien
pretenda» al milímetro, y esto es el bloque Anti-calco.

**D14 · MED-140: «vamos direitos para a praia» suena a 1880.** Está
licenciado por el corpus («foi direita ao espelho», Junqueiro; «foi
direito ao espelho»), pero hoy en Lisboa es «vamos direitinhos» o
«vamos diretos». Ojo también: el corpus da «direito **a**», no
«direito **para**».

**D15 · MED-139: la fuente se nota fabricada alrededor de las cuatro
palabras meta.** «carrega no botão verde do ecrã antes de saíres — o
rato ficou a piscar a noite toda»: la relación entre el botón verde de
la pantalla y un ratón que parpadea no existe. El contrato lo pide para
`cross_variety` («nada de frases fabricadas al revés para forzar el
léxico meta») y aquí el que está fabricado es el lado portugués. El
lado brasileño de MED-140, en cambio, es impecable.

**D16 · Andamio nuevo naciendo: los cuatro `synthesise` abren
contando.** «**Os dois contos** partem…» / «Hay **dos papeles** en el
tablón…» / «Encontrei **duas críticas**…» / «**São dois textos**
sobre…». 4/4. Es la misma mecánica que produjo «Olha,…» (7 modelos
publicados) y «Repara:» (5).

**D17 · MED-130 se planta en el techo exacto (75/75).** El modelo es el
ejemplar: enseña al alumno que la respuesta buena roza el máximo. El
mínimo cumplidor que redacté mide 54, así que hay sitio para bajarlo.

**D18 · Audiencias «nuevas» que no lo son tanto.** «o teu colega de casa
português» (MED-131) es **la audiencia más reciclada del catálogo: 9
usos publicados**; «colega de trabalho» (MED-132) tiene 2, uno de ellos
literal («uma colega de trabalho»). Las genuinamente vírgenes son
professor, chefe, inquilina y grupo de pais (0 usos cada una) — ésas sí
son el hallazgo.

**D19 · MED-135 no tiene ninguna casilla verificable por script** más
allá del rango. El contrato pide «al menos una por mediación». Fácil:
«¿No copia más de 6 palabras seguidas de la fuente?».

**D20 · Los dos `cross_variety` van bajo la lección de registro.**
MED-139/140 se declaran `b10-l1-registro-formal-informal` +
`[b10-registro]`, existiendo `b10-l2-variacao-diatopica-brasil-portugal`
y `b10-variacao-diatopica`, que usan 4 de los 11 cross_variety
publicados. El precedente está partido (7 usan la de registro), pero el
eje `concepts` del gate se degrada.

**D21 · GJ-09 es un ítem flojo y su explicación lo confiesa.** «El
español distingue igual ("tan alto" / "tanto dinero"), así que aquí no
te traiciona tu lengua». Si no hay interferencia, no hay anti-calco: es
un lapsus, no un punto de C1. Busqué el contraejemplo europeo que pide
la nota: **no lo hay** — los dos únicos «tanto X como» del corpus llevan
SUSTANTIVO («tanto frio como na rua», «tanto odio como amor»), y «tão +
adj + como» abunda. El verdict es sólido; el ítem, prescindible.

**D22 · Las casillas de n-gramas sobre fuentes del XIX son casi
vacías.** Comprobé MED-129/132/133 contra sus fuentes: **0** 6-gramas
compartidos, y **también 0** normalizando la grafía antigua
(ph→f, -pt-→-t-, geminadas, apóstrofos). Con «escripturados» /
«avellã» / «chapellinho» delante, copiar seis palabras seguidas es casi
imposible. La casilla se cumple sola. Para fuentes literarias antiguas
conviene o normalizar antes de contar, o cambiarla por una casilla de
contenido.

**D23 · Los gates se declaran «(pendiente)» y me llaman igual.** El
contrato pone los dos gates de máquina **antes** de gastar revisor. Los
corrí yo: `check-virginidad --nuevos` con los 22 candidatos → 14 pares
al umbral 0,34 (ninguno ≥0,51 salvo un ruido temático puro: gj-l9-08 ↔
`05532ebb` a 0,502, «quente, água»), y **0 pares para las doce
mediaciones** — el eje IDF es ciego a `mediation` porque los textos
largos diluyen el solape. Conviene saberlo: **el gate no protege a las
MED en absoluto.**

**D24 · «última MAL en la 10» ya se hizo en el lote 6** (`BBBMMBMBMM`).
La frase del doc es cierta («rompe el patrón de los dos lotes
anteriores») pero la posición no es inédita.

**D25 · «condóminos» no es un lusismo.** El DLE registra *condómino*
('copropietario'). Es un problema de registro, no de interferencia. El
lusismo real de esa fuente es «comparência».

---

## Respuestas a las notas del autor

**(a) Los sustitutos llegaron tarde: mírenlos con más saña.**
Correcto el instinto. **GJ-04** (sustituto) trae el E15: la explicación
afirma algo falso sobre «fazer um curso», desmentido por el título mismo
del artículo de Ciberdúvidas y por la Biblioteca (que sólo usa
`fazer`/`seguir`). **GJ-10** (sustituto) trae el D1: hedge más débil que
el de su propio precedente l8-08. Los dos verdicts se sostienen; las dos
explicaciones no. Y las dos retiradas están bien hechas: leí
`b2c2-gj-l5-07` («Fica-te bem esse casaco azul», `concepts:
[b8-colocacao-pronominal]`) y es el mismo punto con la misma prenda —
«assentar» estaba impecable en Priberam y aun así había que matarlo.

**(b) GJ-09 y GJ-10 alimentan el atajo pintoresco. Si sale >7/10, dígan
cuál vestir.** Me sale **5/10**, no 7 — el atajo está muerto en este
lote (detalle en la nota (e)). No hace falta vestir ninguno. Si se
quiere reforzar, el que pide ropa europea es **GJ-09**, que es el más
desnudo del lote: «O meu irmão é tanto alto como o meu pai» podría ser
«O meu irmão é tanto alto como o meu pai, e ainda por cima joga à bola
melhor do que eu» — pero ojo con la regla del contrato: si añades un
rasgo por el bien de un MAL, tiene que aparecer también en los BIEN.

**(c) ¿«brasileño coloquial» basta, o cae como «todo o mundo»?**
**Basta, pero no como está redactado.** «Todo o mundo» cayó porque la
Biblioteca lo desmiente 22 veces *con el sentido condenado*. «Perguntar
para» tiene **1** hit y no es el sentido condenado («perguntou **para
que** eram aquellas trevas»). La barra no lo mata. Lo que sí lo pone en
riesgo es el absoluto **«en el portugués europeo no aparece»**, con la
regência hermana «dizer para + persona» atestada 7 veces en el mismo
corpus. Su respuesta difiere de l8-08 precisamente porque l8-08 **no**
usó un absoluto: reconoció dónde vive la variante y dijo «hoy en
Portugal sobra». Copie esa estructura y el ítem queda inatacable (ver
D1, con las cifras 22/97/1 para citar).

**(d) ¿La glosa de la cola 3 ya no contradice a GJ-03? ¿Hay otro
publicado que diga que «há que» se evita?**
Verificado sobre los 2.318 ítems, buscando `há que|ha que|hay que` en
**todos** los campos (no sólo `data`). `b3/6b47a59b` ahora dice:
`esContrast: "'Hay que' = 'há que' (corriente en PT-PT) o 'é preciso /
é necessário'. En BR coloquial: 'tem que'."` — **no contradice**, avala.
Y **ningún otro publicado dice que se evite**. Los demás hits son «hay
que» dentro de glosas españolas y la familia «há quem» (b3/15626836,
25589965, 45883d3c), que es otra construcción.

Dos avisos colaterales que encontré por el camino y que no son de este
lote pero conviene poner en el backlog:
- `b8/1312dd96`: «Hay que alimentarse bien todos los días.» → target
  **«Precisa-se de alimentar-se bem todos os dias.»** Eso no es
  portugués aceptable (impersonal + reflexivo chocando). Debería ser «É
  preciso alimentar-se bem todos os dias».
- `b6/72679e92` (`variantStatus: divergent`): base «teria logrado o
  sucesso», y el override pt-br dice **«teria logrado o éxito»** — con
  la palabra española. Justo el vecindario de GJ-02.

**(e) Los conteos de atajos son míos y los mido mal. Midan los seis.**
Los medí con la operacionalización escrita delante, porque sin ella el
número no significa nada:

| atajo | regla aplicada | acierto sobre los 10 |
|---|---|---|
| bloque | b8 ⇒ BIEN, b11 ⇒ MAL | **7/10** (falla 04, 05, 09) |
| idiomatismo pintoresco | marca europea visible ⇒ BIEN, sin marca ⇒ MAL | **5/10** |
| palabra española visible | ⇒ MAL | **6/10** |
| glosa cognada | si el calco palabra-a-palabra da español normal ⇒ MAL | **6/10** |
| ancla temporal | frase con día/hora concretos ⇒ MAL | 0 frases con ancla temporal: **no aplicable** |
| longitud | la más larga ⇒ MAL | 5/10 (las dos más largas son 08 M y 01 B) |

Su 7/10 del bloque coincide con el mío. Su 7/10 del pintoresco es
**pesimista**: le sale 5, que es azar. La razón es buena y el doc no la
ve: **los cinco MAL están hechos con palabras que son todas portuguesas**
— «logro», «pronto» y «grifo» son palabras del diccionario portugués
con otro sentido, no palabras españolas metidas de contrabando. Eso es
lo que hunde a la vez el atajo pintoresco y el de la palabra española.
El único atajo que sigue vivo es el del **bloque**, que es el que el doc
declara. Se arregla poniendo un MAL en b8 y un BIEN en b11 (ya hay 1 y 2
respectivamente; hacen falta ~2 más de cada).

**(f) ¿La composición sin `relay` ni `summarise` se sostiene?**
Lingüísticamente sí, y es la mejor decisión del lote: `synthesise` y
`explain_concept` obligan a **reformular**, no a trasvasar, que es donde
se ve el C1. Dos reservas:
1. **MED-130 es un relay disfrazado** (D6). El titular «relay ×0» es
   verdadero en la etiqueta y falso en el molde.
2. Al desaparecer `relay`, desaparece también el único tipo que
   practicaba la **compresión con destinatario concreto**. Se compensa
   solo: MED-137 y MED-138 hacen eso mismo bajo `reformulate_register`.
No, el lote no pierde nada que el alumno necesite. Lo que pierde es el
tipo con más material publicado para calibrar — y por eso los modelos
nuevos se salen del rail cinco veces (E2, E6, E7, E10, E13).

**(g) Las fuentes documentales de MED-130 y MED-131: ¿es el mejor
hallazgo?**
Es un hallazgo real y lo confirmo con números: **los cuatro
`synthesise_sources` publicados son los cuatro literarios y los cuatro
llevan la audiencia prohibida** («um amigo teu, português, que não leu
nenhum dos dois»). Estrenar la síntesis documental es legítimo y es la
operación de mediación que un adulto hace de verdad.

Sobre la autenticidad, que es lo que me toca:
- **MED-130, portugués: impecable.** «Informa-se que a garagem será
  lavada», «condóminos», «Comparência recomendada», «das 8h às 13h» —
  eso es un aviso de administração de condomínio portugués tal cual.
  Los dos documentos son coherentes entre sí (jueves 9 en los dos) y el
  choque es real: la reunión a las 9h cae dentro de la franja 8h–13h.
- **MED-131, español: impecable.** «nada del otro mundo», «No
  repetimos», «Volveremos seguro» — reseñas españolas de verdad.
- Los dos modelos **son los únicos dos del lote, junto con MED-137, que
  cumplen su rúbrica casilla por casilla**.
- Pero MED-130 es el relay de D6, y MED-131 usa la audiencia más gastada
  del catálogo (D18). El hallazgo es el **género documental**, no el
  ítem: consérvelo, y cámbiele a MED-130 el molde de la rúbrica (que
  ahora es el de med-66/70/107 palabra por palabra).

**(h) MED-140: ¿reenseñanza legítima o dilución?**
Legítima como andamio — pero el problema no es el andamio, es que **de
los cuatro pares "nuevos" sólo dos lo son** (E14). Con `sorvete→gelado`
y `ônibus→autocarro` de andamio, quedan `maiô→fato de banho` y
`bermuda→calções` de contenido nuevo: dos pares para un ítem entero. Y
el modelo regala gratis dos contrastes mejores que los de la rúbrica
(`tomar sorvete`→**comer um gelado**, `esfriar`→**arrefecer**): súbalos
a la casilla.

**(i) MED-132 [55]–[59] y MED-135 [47]–[52]: ¿se pisan? ¿se sostienen
solos?**
- **No se pisan**: los recortes son disjuntos y las operaciones
  distintas. Confirmado.
- **No se sostienen igual.** MED-135 se auto-repara en dos párrafos
  (D11): mejorable, no roto. **MED-132 sí está roto** (E5): su casilla 3
  exige «poeta que sirve mesas», y eso no está en [55]–[59]. Amplíe a
  [54]–[59].
- El que **sí** se pisa, y el doc no lo mira, es **MED-133 dentro de
  MED-132** (E8): mismo fichero, párrafos [5]–[7] ⊂ [0]–[7], y las dos
  respuestas modelo comparten la misma frase.

**(j) Ruido declarado (avelã, garagem, praia).**
- «garagem» y «praia»: de acuerdo, ruido.
- **«avelã/talismã» NO es ruido** (E8). Está en otra categoría: los dos
  ítems comparten fuente, párrafos y frase.
- Añado un ruido no declarado: **«água» + «faz favor»** en GJ-08 chocan
  con `b2c2-gj-l4-09` a 0,42 (D5), y **«não vale a pena … isso»** en
  GJ-01 con `b7/73e19881` a 0,399 (D4).

**(k) Rangos: ¿cabe el mínimo cumplidor en cada uno? (regla MED-28)**
Sí, en los doce. Redacté la respuesta mínima de los cuatro más
apretados: MED-130 → 54 palabras (rango 40–75) · MED-129 → ~115
(90–140) · MED-132 → ~108 (80–130) · MED-133 → ~60 (45–85). **Ninguno
tiene el problema de MED-28.** Y comprobé los doce modelos con el
contador que usa de verdad la app (`MediationCard.tsx:37`,
`texto.split(/\s+/).filter(Boolean).length`): los doce dentro de rango.

```
MED-129 117 (90-140)   MED-133  77 (45-85)   MED-137  51 (40-75)
MED-130  75 (40-75) ←tope   MED-134  75 (50-90)   MED-138  57 (40-75)
MED-131  69 (45-80)   MED-135  78 (45-80)   MED-139  32 (30-65)
MED-132 119 (80-130)  MED-136  71 (55-95)   MED-140  35 (30-65)
```

El problema es el inverso del de MED-28 y el doc no lo pregunta: **el
rango sobra y los modelos no lo usan** (E2, E6, E10). Y MED-130 se pega
al techo exacto (D17).

---

## Qué está bien (específico)

1. **El bloque de recuento pegado es exacto, línea por línea.** Lo
   recalculé sobre `blocks/b10.json`: relay 71 · summarise 19 ·
   reformulate_register 12 · cross_variety 11 · explain_concept 11 ·
   synthesise_sources 4; pt→es 74 · es→pt 24 · pt→pt 23 · pt-br→pt 4 ·
   pt→pt-br 3; informal 94 · neutro 22 · formal 12; y las siete
   entradas de `address`. **Coincide en los cuatro renglones.** Ése es
   el estándar; la línea de registros del lote (E18) es la que se salió
   de él.
2. **El vector de solapes es reproducible al dígito.** Reconstruí las
   nueve secuencias publicadas desde los JSON y calculé:
   `{l1:5, l2:6, l3:4, l4:4, l5:6, l6:4, l7:4, l8:6}` — **idéntico**.
   Media 4,875 contra un azar de 5: eso es independencia de verdad, no
   la casi-complementaria del lote 5. Y la lista de prefijos quemados
   (MBMM/BMMB/BMBM/MBBM/MMBB/BBMM/BBBM/MMMB/BBMB) es correcta uno a
   uno; BMBB es inédito. Runs ≤3, 5/5, última MAL en la 10: todo
   verificado.
3. **Los tres recuentos de fuente son exactos, no estimados.**
   `junqueiro-o-chapellinho-encarnado` [0]–[38] = 39 párrafos, **861**
   palabras. `junqueiro-branca-de-neve` [0]–[69] = 70 párrafos,
   **1.767**. `junqueiro-o-talisman` [0]–[7] = 8 párrafos, **364**.
   Los tres al dedillo.
4. **Las cuatro fuentes son vírgenes de verdad.** 0 apariciones de
   talismã/avelã/Korriscosso/Fanny/Charing/chapelinho/capuchinho/
   «Branca de Neve»/anões/vendedeira en los 2.318 ítems publicados.
5. **El grep ancho se hizo, y con grafía antigua, donde importaba.**
   Confirmo «grifo» (0 hits, incluidas las variantes `gripho`/`grypho`)
   frente a «torneira» (6, todas de grifo de agua real: Eça, *A cidade e
   as serras* y *Civilização*). Y «pronto»: probé **prompt-**, 64 hits,
   ni uno adverbial de 'cedo'. Priberam confirma las dos cosas: `grifo`
   sin acepción de torneira, `pronto` con una sola acepción adverbial
   («prontamente, rapidamente») más «num pronto»/«de pronto».
6. **La asimetría verbo/sustantivo de «logro» está bien vista y bien
   probada.** El único hit del corpus es engaño y lo leí entero
   (`contos-phantasticos--a-adega-de-funck[21]`, Hoffmann sonriendo
   «para que o riso o defendesse do logro que esperava»); los hits de
   `lograr` son 'conseguir'; Priberam no da 'éxito' al sustantivo; y hay
   **0** apariciones del sustantivo en los 2.318 ítems publicados.
   Distinguir el verbo del sustantivo dentro del propio ítem es
   exactamente el nivel C1 que este catálogo debería tener siempre.
7. **«Deixa lá» está mejor probado de lo que dice el doc.** Cuento 18,
   no 15, y de ellos **8 son el uso puro de muletilla** —el del ítem—
   frente a 10 transitivos («deixa lá o sermão»). La cita («--Deixe lá,
   padre Natario, deixe lá!», `o-crime-do-padre-amaro-c07[24]`) es
   literal. 0 en bloques.
8. **«Estar enganado» tiene una prueba mejor que la citada**: 5
   atestaciones directas del adjetivo con el sentido 'equivocado' («o
   fidalgo está enganado comigo», «Está enganado!», «ou ella estava
   enganada»). Y la cita de Junqueiro es verbatim, comprobada:
   `junqueiro-a-rapariguinha-e-os-phosphoros[8]`.
9. **GJ-09 sobrevive al ataque que pedía.** No hay contraejemplo europeo:
   los dos únicos «tanto X como» del corpus llevan sustantivo, y
   «tão + adj + como» está en todas partes (Eça, Camilo, Garrett) —
   o sea que el *repair* está licenciado por la propia Biblioteca, que
   es la regla que el contrato pide.
10. **MED-137 es el mejor ítem del lote y cumple 4/4.** Usa «o seguinte»
    de forma **catafórica** («quer dizer o seguinte: …»), que es
    justamente la trampa que costó un doblaje en este proyecto;
    sostiene `terceira_sem_pronome` sin una sola fuga a «você»;
    y remata con futuro do conjuntivo («os estragos que daí
    **resultarem**»). La fuente contractual es portuguesa auténtica
    («facultar o acesso à **fração**», con la grafía del AO90,
    «mediante pré-aviso»).
11. **MED-130 y MED-131 también cumplen 4/4**, y su español y su
    portugués son naturales: «nada del otro mundo», «No repetimos»,
    «a las nueve el garaje tendría que estar vacío y lleno a la vez»;
    y del lado portugués, «ela achou o peixe extraordinário e ainda
    **lhe ofereceram** a sobremesa» y «ele achou a comida **vulgar**»
    — dos usos europeos exactos (oferecer = regalar; vulgar = del
    montón) que un hispanohablante nunca produciría.
12. **La fuente lisboeta de MED-136 es auténtica**: «Malta!», «ficar a
    dormir», «que a gente trata», «até ao fim de julho» (con «ao», que
    es la marca europea). Y el modelo, pese al E10, tiene una mesóclise
    bien puesta («Seguir-se-á jantar») y «até ao final de julho».
13. **La fuente brasileña de MED-140 es BR de verdad** — «Leva o maiô»,
    «a gente vai direto pra praia», «pro caso de esfriar», «tomamos um
    sorvete», «voltamos de ônibus» —, sin el vicio de fabricarla al
    revés. Y el modelo europeo cambia el verbo además del sustantivo
    («comemos um gelado»), que es más de lo que la rúbrica pide.
14. **«vendedeira» (MED-129) está bien elegida**: Priberam la da sin
    marca alguna y es literalmente la palabra de Junqueiro
    (`[29] «desfarçada em vendedeira ambulante»`). Citar corpus y
    escribir con el anfitrión que el corpus da es la regla del contrato,
    y aquí se cumple.
15. **GJ-07 hace la discriminación fina que separa C1 de B1**: no se
    limita a decir «ficar a saber», explica **por qué** «ela se mudou»
    lleva próclise («la dispara el "que" de la subordinada») y advierte
    de que no es brasileñismo. Es la mejor explicación del lote.
16. **Las dos retiradas de preproducción son correctas y bien
    documentadas**, con el número del gate y la razón. Verifiqué
    `b2c2-gj-l5-07`: mismo punto, misma prenda. Matar un ítem
    léxicamente impecable por clon de punto es la decisión difícil bien
    tomada.
17. **Los cinco repairs son mínimos** (una sola pieza cada uno) y la
    prueba operativa del contrato los avala, incluido el caso delicado
    de GJ-10, donde el repair es la contracción `para a` → `à` y no una
    reescritura.

---

## Lo que yo haría antes de publicar

**Bloqueantes (los cinco):** E1 (prueba falsa impresa en la
explicación) · E2 + E6 + E10 + E13 (cuatro modelos que no cumplen su
propia rúbrica) · E5 + E7 (dos rúbricas que piden lo que su recorte no
contiene) · E9 (MED-134 enseña una oposición que su diálogo no muestra)
· E3 (título brasileño en el modelo de un curso europeo).

**Baratos y de una línea:** E16, E17 (metadata `address`), E18, E19
(dos cifras del doc), E12, E14 (dos casillas), E15 (media frase de
GJ-04), D1 (media frase de GJ-10).

**Para el lote 10:** el gate no ve las mediaciones (D23); el atajo de
bloque sigue a 7/10 (nota e); y el molde `[Aviso …] + rúbrica de cuatro
casillas` ya tiene cuatro ejemplares (D6).
