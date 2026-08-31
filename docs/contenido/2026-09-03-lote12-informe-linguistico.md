# Lote 12 — informe LINGÜÍSTICO, ronda 1

**Revisor:** lingüista adversarial PT (norma europea).
**Documento revisado:** `docs/contenido/2026-09-03-lote12-c2-mesoclise.md`, **versión v2**
(la reconstruida tras el dry-run del publicador: P-03/P-04/P-05 con antecedente
en la primera cláusula).
**Generador:** `scripts/lotes/lote12-pares.ts` · **biblioteca:** `scripts/lib/pares-minimos.ts`.
**Corpus consultado:** `lib/data/languages/pt/lecturas/` — 224 obras, **4 269 271 caracteres**,
aplanado a `obra § párrafo` para poder citar frase entera.

---

## VEREDICTO GLOBAL: **NO**

No por la gramática de las frases —ocho de los doce ítems son portugués europeo
irreprochable y la morfología de las seis mesóclises está perfecta— sino por tres
cosas que el lote afirma y no son verdad:

1. **Dos MAL no se sostienen.** P-04 y P-05 declaran INCORRECTO algo que la propia
   Biblioteca del curso escribe: `«Perguntou por Marianna, e o carcereiro lhe disse
   que a mandava chamar.»` (Camilo, *Amor de Perdição* c12 §52) es literalmente la
   estructura del MAL. Es el precedente `do que` del lote 5, sin diferencia.
2. **El lote se contradice a sí mismo.** GJ-10 dice, de la mesóclise, «a C2 es una
   elección de registro — **culta, no obligatoria**», y su par GJ-05 marca MAL la
   alternativa. Si no es obligatoria, la otra no está mal. Esto no necesita corpus.
3. **Esto no es C2: es `b8-coloc-mesoclise` otra vez.** Cinco de los seis pares
   reenuncian proposiciones ya publicadas en el bloque 8, y P-06 es la traducción
   ya publicada `315cc2f3` («Quando conseguir falar contigo, **explicar-te-ei** tudo»)
   con otro verbo. Cargar `b12-mesoclise-estilistica` con estos doce ítems mueve la
   tabla de cobertura sin mover el material.

**Bloqueantes: 6** (lista cerrada al final). Hay una salida que salva ocho ítems y
está descrita en cada par.

---

## Método, y una advertencia que el proyecto debe anotar

El grep que absuelve tiene que ser ancho **y con grafía antigua**. Aquí la trampa
fue mayor de lo previsto: la Biblioteca escribe el **futuro sintético con `h`**
—`dir-lhe-hei`, `far-se-ha`, `dir-se-hia`, `escrevel-o-hão`— porque es ortografía
del XIX. Un grep con la grafía moderna encuentra **16** mesóclises en 4,27 M de
caracteres; añadiendo la `-h-` aparecen **89**. **El 82 % de la evidencia estaba
escondida.** Es la quinta vez que la grafía antigua esconde hits; conviene que la
skill lo escriba como patrón, no como anécdota.

Dato de fondo, útil para la sección de nivel: de esas 89 mesóclises, **27 son de
futuro y 62 de condicional**. En la Biblioteca la mesóclise vive sobre todo en el
condicional. El lote 12 es 100 % futuro y nunca enseña el condicional.

---

## Veredicto por par

| par | veredicto |
|---|---|
| P-01 | **PASA** |
| P-02 | **PASA** |
| P-03 | **PASA** (una corrección de explicación) |
| P-04 | **MUERE el MAL · DALE LA VUELTA** |
| P-05 | **MUERE el MAL · DALE LA VUELTA** |
| P-06 | **CORRIGE-ASÍ** (el BIEN pasa; el MAL sobrevive, su explicación no) |

---

### P-01 — `Não {lhe direi / dir-lhe-ei} a verdade toda…` → **PASA**

Ítems GJ-12 (BIEN) y GJ-09 (MAL).

Busqué exactamente lo que tumbaría el par: **mesóclise bajo atractor**. Con el
patrón ancho y la grafía en `-h-`, sobre las 89 mesóclises del corpus, el único
candidato en todo el corpus es:

> `«…que não tornasse ali a apparecer, quando não ver-se-hia obrigado a empregar
> meios violentos.»` — Junqueiro, *Os animaes agradecidos* §22

Leída la frase entera, **no es contraejemplo**: `quando não` es aquí la locución
fija equivalente a *senão / caso contrário*; el `não` no niega a `ver-se-ia`, forma
parte del conector. Fuera de eso: **cero mesóclises bajo atractor en 4,27 M de
caracteres.**

Y la dirección BIEN está atestada casi literal, dos veces:

> `«Basta: não lhe direi nada.»` — Garrett, *Viagens na Minha Terra* c25 §7
> `«Não lhe direi que se tema da justiça humana…»` — Camilo, *Novelas do Minho ·
> Gracejos que Matam* §343

La morfología `dir-lhe-ei` es correcta y el corpus la confirma en cuatro personas
distintas: `dir-te-hei` (Garrett c47 §3), `dir-me-has` (Garrett c16 §64),
`dir-me-hão` (Eça, *O Crime do Padre Amaro* c16 §112), `dir-se-ha` (Camilo c03 §6).
El aviso de E2#11 no aplica aquí: `di-lo-ão` sólo aparece cuando el clítico es de
3.ª acusativo y fuerza la caída de la `-r`; con dativo el tema `dir-` se conserva.
Corrido el conjugador del propio proyecto, `mesoclise('dizer','lhe','eu')` da
`dir-lhe-ei`, y `mesoclise('dizer','o','eles')` da `di-lo-ão`.

**Sobre el «OBLIGATORIAMENTE» de GJ-12:** normalmente lo tacharía —han caído
catorce absolutos aquí— pero **éste se sostiene** y es el único del lote que
sostengo: 0 mesóclises bajo atractor frente a más de sesenta próclisis bajo
atractor con futuro o condicional en el mismo corpus. Déjenlo.

---

### P-02 — `Ninguém {lhes contará / contar-lhes-á}…` → **PASA**

Ítems GJ-01 (BIEN) y GJ-04 (MAL). Misma prueba, mismo resultado, y con la
atestación más limpia del lote — Camilo escribe la estructura exacta del BIEN,
con cuantificador negativo, próclise y **futuro**, dos veces en la misma línea:

> `«Ninguem o amará como eu; ninguém lhe adoçará as penas tão desinteresseiramente
> como o eu fiz.»` — Camilo, *Amor de Perdição* c18 §47

Más: `«Ninguem me levará ao degredo a noticia da sua morte!»` (c19 §46),
`«ninguem me daria metade do seu pão»` (Eça, *A Cidade e as Serras* c16 §28),
`«Ninguem a conheceria»` (Eça, *Os Maias* c10 §207).

`contar-lhes-á` es morfológicamente correcta (verbo regular, clítico dativo, sin
caída de `-r`); el corpus trae la misma forma con otros verbos: `esconder-lhe-ha`,
`estender-lhe-hia`, `pedir-lhe-hia`.

**Una nota, no bloqueante:** el clítico `lhes` no tiene antecedente en la frase.
Ver la respuesta a la pregunta 2 del coordinador, más abajo: no rompe el ítem.

---

### P-03 — `O recurso está pendente e a comissão nunca {o decidirá / decidi-lo-á}…` → **PASA**

Ítems GJ-06 (BIEN) y GJ-11 (MAL).

La reconstrucción es buena: el antecedente `o recurso` da referente al `o`, el
régimen `decidir um recurso` es normal en registro jurídico, y `nunca` sigue
siendo el atractor que el ítem juzga. `decidi-lo-á` es correcta —`-ir` no lleva
tilde: `parti-lo`, `abri-la`, `decidi-lo`— y el conjugador del proyecto la
reproduce. La Biblioteca respalda la próclise con `nunca` + futuro/condicional
en abundancia: `«nunca o poderiam deixar mais despido»` (Eça, *A Aia* §6),
`«nunca o saberá»` (*Os Maias* c03 §277), `«nunca o poderia manifestar»`
(*O Crime do Padre Amaro* c08 §105), `«nunca a descortinaria»` (*José Matias* §12).

**CORRIGE-ASÍ (explicación, no frase).** GJ-06 dice «Los adverbios de negación y de
frecuencia negativa —"nunca", "jamais", **"raramente"**— son atractores». `raramente`
no es de la misma clase: no es negativo, es un adverbio de frecuencia baja, y el
propio Priberam no lo trata como negación. Meterlo en la lista es fabricar un
absoluto de más en un ítem que no lo necesita. Sustituir por:

> **explicación GJ-06:** «Los adverbios negativos —«nunca», «jamais»— atraen el
> clítico igual que «não». Con ellos el futuro no se parte: «nunca o decidirá».
> Cuidado: no todos los adverbios antepuestos atraen; los que atraen son los
> negativos y los de foco («só», «também», «apenas»).»

---

### P-04 — `…e a direção {informá-lo-á / o informará} do resultado…` → **MUERE el MAL · DALE LA VUELTA**
### P-05 — `…e o secretariado {enviá-lo-á / o enviará} aos sócios…` → **MUERE el MAL · DALE LA VUELTA**

Ítems GJ-10/GJ-05 y GJ-03/GJ-07. Los dos caen por la misma razón y con la misma
salida, así que van juntos.

**La pregunta era si «A direção o comunicará» es INCORRECTO o sólo menos
frecuente. La respuesta es: es de otra época y de otro registro, no es
incorrecto — y por tanto el MAL cae.**

Lo que sostiene la afirmación del lote es la norma del portugués europeo
**contemporáneo**: con sujeto definido antepuesto y sin atractor, la colocación
estándar es ênclise, y en futuro/condicional mesóclise. Eso es cierto y no lo
discuto. Lo que no es cierto es la etiqueta —«la próclise sin atractor es la
colocación **brasileña**»— ni el carácter categórico. Lo que el corpus muestra no
es Brasil: es portugués europeo del XIX, en los tres autores canónicos del curso.

**Contraejemplos limpios** (leídos enteros, sin atractor en ninguna parte de la
oración, y con el clítico en el segundo miembro coordinado por «e», que es
exactamente el molde reconstruido):

> ★ `«Perguntou por Marianna, e o carcereiro lhe disse que a mandava chamar.»`
> — Camilo, *Amor de Perdição* c12 §52
> Coordinante «e» + **sujeto DP definido** + próclise + verbo finito. Es, palabra
> por palabra en su estructura, `«…e a direção o informará…»`.

> `«…abraçou apaixonadamente a mãe dolorosa, e a beijou, e lhe chamou irmã do seu
> coração…»` — Eça, *A Aia* §13 *(lectura de nivel B1 del propio curso)*

> `«…e arrancou o pau do seio do monstro estendido, e lhe mirou a ponta gotejante
> de sangue…»` — Eça, *Adão e Eva no Paraíso* §45 *(C1)*

> `«…e lançou sôbre os seus ombros um manto impenetrável às neblinas do mar, e lhe
> estendeu sôbre a mesa … as comidas mais sãs e mais finas da Terra.»`
> — Eça, *A Perfeição* §57 *(B2)*

> ★ `«Lá irão dar as minhas cartas; e na primeira te direi em que nome has de
> responder á tua pobre Thereza.»` — Camilo, *Amor de Perdição* c02 §18
> Próclise **en futuro**, sin atractor. Es el tiempo y la colocación que el lote
> declara imposibles.

Y sin coordinación, con sujeto antepuesto a secas:

> `«Esta sordidez da Planicie me levou a procurar melhor aragem d'espirito…»`
> — Eça, *A Cidade e as Serras* c16 §48
> `«Uma exclamação involuntaria lhe rebentou dos labios…»` — Garrett, *Viagens* c34 §17
> `«Um estranho lhe esmolou a subsistencia de oito mezes de carcere…»` — Camilo, c14 §58
> `«Uma freira me disse que eu não ficava aqui…»` — Camilo, c09 §32
> `«…mas os anjos escrevel-o-hão no Paraizo, e mais tarde nós o viremos a saber.»`
> — Junqueiro, *Um nome inscripto no céo* §7 — la MISMA frase trae mesóclise y
> próclise-sin-atractor, una detrás de otra.

Medido en bruto, tras «e»: **139** casos de próclise, **112** de ênclise, **2** de
mesóclise. Digo «en bruto» porque la mayoría de las 139 son arrastre del atractor
de la cláusula anterior (`que…, e lhe…`) y no valen; las seis que cito arriba
sobreviven a la lectura entera. Pero el orden de magnitud es el que importa: en la
Biblioteca de este curso la próclise sin atractor **no es rara ni marcada**.

**El argumento que no necesita corpus.** GJ-10 explica: «a C2 es una elección de
registro — **culta, no obligatoria**». GJ-05 dice que la alternativa está MAL. Las
dos frases no pueden ser verdad a la vez. La barra de retirada del proyecto está
escrita para justo esto: *«un MAL tiene que afirmar que la otra está mal, y ahí la
autoridad falla»*.

**Un tercer defecto, menor pero de forma.** El campo `rasgo` de los dos pares dice
«sin atractor y **con el verbo abriendo la oración**». El verbo no abre nada: lo
abre el sujeto (`a direção`, `o secretariado`), y desde la reconstrucción está
además en el segundo miembro de una coordinación. El `rasgo` es el campo que
legitima o deslegitima un atajo en la batería; si describe mal su propio ítem, la
verificación de atajos queda sin ancla. Aunque el par se salve, hay que reescribirlo:
`«sin atractor, con sujeto antepuesto: la próclise no es la colocación europea contemporánea»`.

#### La vuelta

El BIEN vive: `informá-lo-á` y `enviá-lo-á` son correctas, la morfología está
verificada, y la estructura está atestada en la propia Biblioteca —

> `«…e o horror do impossivel tornal-o-hia hypocrita…»` — Teófilo Braga,
> *Contos Phantasticos · Um erro no kalendario* §3 — «e» + sujeto DP + mesóclise.
> `«…e os vélhos poetas pitorescos ter-lhe-iam chamado — pomba, arminho, neve e
> oiro.»` — Eça, *Singularidades de uma Rapariga Loura* §32
> `«O dono do castello far-nos-ha um bom acolhimento.»` — Junqueiro, *João e os
> seus camaradas* §67
> `«As senhoras dir-me-hão talvez … que se trata apenas da filha do sineiro.»`
> — Eça, *O Crime do Padre Amaro* c16 §112

Lo que hay que cambiar es **el otro miembro**. En vez de oponer la mesóclise a una
próclise defendible, opóngasela al calco que **sí** es inequívocamente falso: la
ênclise pegada a la forma finita de futuro, que es lo que produce un
hispanohablante y lo que la propia `enclise()` del proyecto existe para fabricar.
Lo verifiqué: **cero atestaciones de ênclise sobre futuro o condicional sintético
en 4,27 M de caracteres** (los seis candidatos del grep eran pretéritos en `-ei`
—`retirei-me`, `declarei-lhe`— e imperfectos en `-ia` —`preferia-o`—, no futuros).

> **P-04 CORRIGE-ASÍ**
> esqueleto: `O presidente já sabe do caso e a direção {} do resultado esta semana.`
> **BIEN:** `informá-lo-á` · **MAL:** `informará-o`
> *repair del MAL:* «O presidente já sabe do caso e a direção informá-lo-á do resultado esta semana.»
> *explicación del MAL:* «En futuro y condicional el clítico no se pega detrás de la
> forma conjugada: se mete DENTRO, entre el infinitivo y la desinencia. «informará-o»
> es el calco que produce el español («lo informará» → *«informará-lo»); la forma
> portuguesa es «informá-lo-á».»
>
> **P-05 CORRIGE-ASÍ**
> esqueleto: `O programa já está fechado e o secretariado {} aos sócios amanhã.`
> **BIEN:** `enviá-lo-á` · **MAL:** `enviará-o`

Diferencia de 1 palabra y ≤1 carácter en los dos casos: `verificarPar` sigue
pasando, y el reparto «tres mesóclises en el BIEN, tres en el MAL» se conserva.

**Dos condiciones antes de aceptar esta vuelta**, porque el corolario que E2#13 ya
pagó tres veces es que no se inventa un MAL bajo presión:

- `informará-o` / `enviará-o` **son primos de distractores ya publicados** en el
  bloque 8 (`b2c2-par-14` trae `falará-me`, `b2c2-par-15` trae `dir-me-á`/`dirá-me`).
  El gate de virginidad hay que **volver a correrlo**, no darlo por bueno.
- Y hay que decidir antes la pregunta de nivel: si estos pares se quedan, esta
  vuelta los deja enseñando morfología de la mesóclise, que es B2 puro. Ver abajo.

---

### P-06 — `Quando o prazo terminar, {enviar-te-ei / te enviarei}…` → **CORRIGE-ASÍ**

Ítems GJ-02 (BIEN) y GJ-08 (MAL).

**El BIEN es firme y está muy bien atestado.** La pregunta era si hay dos
descripciones. La hay, pero no donde el lote la teme, y el corpus decide con
holgura: restringiendo a clíticos inequívocos (`me/te/lhe/lhes/vos`) tras
subordinada adverbial antepuesta y coma, encuentro **159 casos de ênclise o
mesóclise** frente a **14 candidatos de próclise, de los cuales trece son falsos
positivos** (relativas, o segundos miembros coordinados bajo un atractor
compartido). Y tres de los 159 realizan **la mesóclise exacta que el ítem pide**:

> `«Se as estradas fossem de papel, fa-las-iam, não digo que não.»`
> — Garrett, *Viagens na Minha Terra* c49 §46
> `«--Se a não acceitasse, obrigal-o-ia eu ao cumprimento dos seus deveres.»`
> — Camilo, *Amor de Perdição* c11 §30
> `«Se meu tio a obrigasse, desde menina, a uma obediencia cega, têl-a-ia agora
> submissa…»` — Camilo, c10 §125

Más ênclise pura: `«Quando o carvoeiro chegou a casa, contou-lhe logo o que lhe
tinha acontecido»` (Junqueiro, *Presente por presente* §0), `«quando chegou á
presença de sua magestade, pediu-lhe que…»` (*Os animaes agradecidos* §35),
`«Quando a politica me agourava uma mitra, as mulheres far-me-hiam regeitar o
chapeu»` (Camilo, *Gracejos que Matam* §277).

**Pero la explicación del MAL sí tiene el problema de las dos descripciones, y hay
que arreglarla.** GJ-08 dice: «El portugués europeo **no admite** el pronombre
átono abriendo oración, y tras la coma la principal empieza **de cero**». Las dos
mitades son falsas como enunciado general:

- El único candidato genuino de los catorce lo escribe Eça, y es principal
  abierta por clítico tras un adjunto antepuesto:
  > `«Receoso de que essa orla de murmurios lentos, sem brilho e sem alegria, se
  > estabelecesse de novo, me abalancei (para animar), a interpellar Jacintho…»`
  > — Eça, *A Cidade e as Serras* c13 §22
- Y la formulación clásica de la regla **no es** la del ítem. La regla es «no se
  empieza **período** con pronombre átono». En la frase de Eça el período empieza
  por `Receoso`, no por `me`: Eça no está violando nada. La lectura del ítem —«la
  principal empieza de cero»— es una versión **más fuerte** de la regla, y es
  justo la versión que Eça desmiente. Ahí están las dos descripciones.

El veredicto del ítem sobrevive (159 contra 0 en la configuración exacta:
subordinada adverbial FINITA + coma), pero el argumento con el que se defiende, no.

> **CORRIGE-ASÍ — explicación de GJ-08:**
> «Tras una subordinada antepuesta, el portugués europeo mantiene la ênclise o,
> en futuro y condicional, la mesóclise: «enviar-te-ei». La subordinada no es
> atractor —los atractores tienen que estar DENTRO de la oración del verbo— y el
> «quando» sólo gobierna su propia cláusula. «Te enviarei» es la colocación
> brasileña, y es también lo que produce el español por calco.»
>
> **CORRIGE-ASÍ — explicación de GJ-02:** quitar «acabada la coma, la principal
> empieza otra vez y el clítico no puede abrirla» y dejar: «El atractor tiene que
> estar dentro de la oración del verbo, y «quando» se queda en la suya. De ahí la
> mesóclise, «enviar-te-ei». Es el caso que más se falla, porque parece que el
> «quando» gobierna toda la frase.»

`enviar-te-ei` es morfológicamente correcta (verbo regular, clítico consonántico,
sin caída de `-r`), confirmada por el conjugador y por el corpus:
`«levar-te-hei á estufa grandiosa»` (Junqueiro, *A mãe* §17), `«dir-te-hei a
verdade»` (Garrett c47 §3), `«ser-te-hemos irmãos no ceu»` (Camilo c21 §62).

---

## Las dos preguntas del coordinador

### 1. ¿«e» atrae? — **No. Pero no ha salvado nada.**

La conjunción coordinante no está en ninguna lista de atractores: los atractores
son los negativos, los adverbios de foco antepuestos, los cuantificadores e
indefinidos, los interrogativos y relativos, y las conjunciones **subordinantes**.
`e`, `mas`, `ou` y `pois` no atraen; la única coordinante que atrae es `nem`, y
atrae por negativa, no por coordinante. La parentética de GJ-10 —«"e" coordina, no
atrae»— es **correcta**.

El problema es otro, y es peor: **al coordinar con «e», P-04 y P-05 se mudaron al
único entorno del corpus donde la próclise sin atractor es más abundante.** El
contraejemplo más dañino del lote —`«e o carcereiro lhe disse»`— vive justamente
ahí. La reconstrucción arregló la duplicación de objeto y no tocó la disputa; sólo
la hizo más fácil de refutar.

Dos cosas más que la reconstrucción trajo y que hay que mirar:

- **`já` en P-04 y P-05.** `«O presidente **já** sabe do caso e…»`, `«O programa
  **já** está fechado e…»`. `já` **sí** es atractor cuando precede inmediatamente
  al verbo — y aquí precede a `sabe` y a `está`, en la PRIMERA cláusula, no al
  verbo juzgado. El análisis del ítem no cambia. Pero la explicación de GJ-10 dice
  «Sin **nada** que atraiga el clítico», y en la frase hay algo que atrae, sólo que
  en otra cláusula. Si el par sobrevive, la explicación debe decirlo: es
  exactamente la destreza de P-06, y regalarla sería mejor pedagogía que negarla.
- **Referencia turbia en P-04.** `«…e a direção informá-lo-á do resultado…»`: el
  masculino singular más próximo al clítico es `o caso`, no `o presidente`. El
  régimen (`informar alguém de algo`) desambigua, pero a un lector rápido le cuesta.
  P-05 y P-03 no tienen este problema. **DISCUTIBLE**, no error: si se toca la
  frase, `«O presidente ainda não foi avisado e a direção informá-lo-á…»` — no,
  eso mete un atractor. Mejor `«O presidente aguarda notícias e a direção
  informá-lo-á do resultado esta semana.»`

### 2. Dativo sin antecedente en P-01 y P-02 — **no rompe el ítem, y la cicatriz no aplica**

`«Não lhe direi a verdade toda…»`, `«Ninguém lhes contará o que se passou…»`.

Un clítico de 3.ª persona es anafórico o deíctico por naturaleza y se satisface con
un referente del discurso, no de la oración. `«Diz-lhe que sim.»` es una frase
portuguesa perfectamente formada fuera de contexto, y Camilo escribe `«Não lhe
direi que se tema da justiça humana»` sin antecedente en la frase. **No hay defecto.**

La cicatriz que cita el coordinador —*«un gate que deriva la respuesta no comprueba
que la pregunta la determine»*— es de un `fill_blank`, donde el alumno tiene que
PRODUCIR la forma y necesita saber a quién señala el clítico. Aquí el alumno sólo
juzga una colocación, y la colocación la determina `não` / `ninguém`, que están a
la vista. **El contexto sí determina la respuesta.** No aplica.

**Pero la nota del autor diagnostica mal su propio bug.** Dice que la
reconstrucción «además arregla un segundo defecto del que nadie se había quejado:
el clítico acusativo no tenía antecedente ninguno». Eso no era el defecto. El
defecto era la **duplicación** —clítico acusativo y SN objeto coreferente en la
misma cláusula, que el portugués no admite (a diferencia del español, que sí dobla
el dativo)—, y se habría arreglado igual de bien cambiando el clítico a dativo y
dejando el SN: `«…e a direção comunicar-lhes-á o resultado…»`, que es la
construcción que la Biblioteca prefiere (`«O tapiz verde da relva fresca … esconder-lhe-ha
o lodo de um charco»`, *As azas brancas* §7; `«isto dar-nos-ha novas forças»`,
*A canção da cerejeira* §6). La falta de antecedente no era un defecto: la prueba
es que P-01 y P-02 la conservan y están sanos. Importa porque en este proyecto
**los atajos se fabrican al arreglar mal el anterior**, y un diagnóstico
equivocado es el primer paso de esa cadena.

---

## Morfología de las seis mesóclises — todas correctas

Corridas contra el conjugador del propio proyecto (`scripts/lib/paradigma-pt.ts`),
que es el que en E2#11 daba `*dir-lo-ão` y ya está arreglado:

| forma del lote | derivación | conjugador | veredicto |
|---|---|---|---|
| `dir-lhe-ei` | `dizer` (tema `dir-`) + `lhe` + `-ei` | `dir-lhe-ei` | ✔ |
| `contar-lhes-á` | `contar` + `lhes` + `-á` | `contar-lhes-á` | ✔ |
| `decidi-lo-á` | `decidir` + `o` → cae `-r`, **sin tilde** (`-ir`) | `decidi-lo-á` | ✔ |
| `informá-lo-á` | `informar` + `o` → cae `-r`, tilde en `-á` | `informá-lo-á` | ✔ |
| `enviá-lo-á` | `enviar` + `o` → cae `-r`, tilde en `-á` | `enviá-lo-á` | ✔ |
| `enviar-te-ei` | `enviar` + `te` + `-ei` | `enviar-te-ei` | ✔ |

Controles de la trampa de E2#11: `mesoclise('dizer','o','eles')` → **`di-lo-ão`**
(no `*dir-lo-ão`), `mesoclise('fazer','o','ele')` → **`fá-lo-á`**. Los irregulares
de futuro son sólo `dizer`, `fazer`, `trazer`, y ninguno de los seis del lote los
usa con clítico acusativo, que es donde estaba el peligro.

**Una corrección obligatoria de redacción, y no es cosmética.** GJ-03 explica:
«**"enviará" + "o"** da "enviá-lo-á"». Esa derivación es falsa: predice `*enviará-lo`.
La mesóclise no parte la forma conjugada, se construye sobre el **infinitivo**.
Es exactamente la regla mal enunciada que produjo `*dir-lo-ão` en E2#11, escrita
esta vez en un texto que ve el alumno.

> **CORRIGE-ASÍ — explicación de GJ-03:** «La mesóclise no parte el futuro ya
> conjugado: se monta sobre el infinitivo. «enviar» + «o» + «-á»: la «-r» cae, el
> clítico toma la «-l-» y la «a» recibe tilde — «enviá-lo-á». Aquí «o» remite a
> «o programa».»

---

## ¿Es C2, o es B2 repetido? — **Es B2 repetido**

Es el hallazgo más grande del informe y no depende de ninguna opinión: está en
`lib/data/languages/pt/blocks/b8.json`.

El punto `b8-coloc-mesoclise` (13 ítems, bloque 8) **ya publica las seis
proposiciones del lote 12**:

| lote 12 afirma | `b8.json` ya lo publica |
|---|---|
| P-01: con `não`, próclise y no mesóclise | `b2c2-par-15` — «Ele não ___ o preço…» → `me dirá`; explicación: *«La negación es un atractor de próclise, y el atractor manda sobre la mesóclise.»* Mismo verbo, mismo clítico, misma regla. |
| P-02/P-03: cuantificador negativo / adverbio negativo idem | `b2c2-par-16` (interrogativo), `b2c2-par-23` (conjunción `que`) — misma regla, otro atractor |
| P-04/P-05: sujeto antepuesto sin atractor ⇒ mesóclise | `b2c2-par-14` — «O advogado ___ do processo **assim que** houver novidades» → `falar-me-á`. Sujeto DP + mesóclise + la misma coleta `assim que` |
| P-05 con antecedente en la 1.ª cláusula y clítico `-lo` | `b2c2-par-17` — «**O terreno já está avaliado**; se o preço descer, ele ___ sem hesitar. (comprar + o)» → `comprá-lo-á`. **El molde reconstruido de P-05 ya existe**, punto y coma en vez de «e» |
| P-03, morfología `-ir` + `-lo` | `b2c2-par-18` → `parti-lo-á` |
| P-06: `Quando …, mesóclise en futuro con `-te-` | `315cc2f3` (traducción, `b8-l1`) — **«Quando conseguir falar contigo, explicar-te-ei tudo.»** Misma conjunción, mismo clítico, misma desinencia, misma estructura |
| P-06 en condicional | `11849607` — «Se lhe dessem essa oportunidade, aproveitá-la-ia.» |

Y el juicio `b2c2-gj-l3-13`, ya publicado en b8, es «Dir-te-ei amanhã, prometo.»
con verdict `true`: el BIEN de P-06 con otro verbo.

**Lo que el currículo pide para C2** (`lib/data/languages/pt/curriculum.ts:350`)
son tres cosas: *«cuándo un futuro o un condicional con clítico pide mesóclise,
cuándo la próclise por atractor la desactiva y **cuándo usarla suena a impostura**»*.
Las dos primeras son literalmente b8. **La tercera —la única que b8 no cubre y la
única que justifica un punto de C2— no tiene un solo ítem en el lote.** Ni uno.

Los doce ítems enseñan **la regla**, no **la elección**. Cada uno tiene una única
respuesta derivable mecánicamente de la presencia o ausencia de un atractor. No
hay ningún ítem donde las dos formas sean gramaticales y lo que se juzgue sea el
registro — que es lo que significa «recurso estilístico consciente y no forma
obligada». El propio lote lo confiesa en GJ-10 («culta, no obligatoria») y a
continuación construye un MAL que lo niega.

Dos ausencias que lo confirman: el lote es **100 % futuro** cuando la mesóclise
del corpus es **62/89 condicional**; y nunca aparece la alternativa que un
portugués culto usa de verdad para evitar la mesóclise sin caer en la próclise
(reordenar, o `há de` + infinitivo — la Biblioteca lo trae en `eb7d4755`:
«A verdade há de dizer-se»).

**Conclusión:** publicar estos doce ítems bajo `b12-mesoclise-estilistica` sube la
cobertura de C2 de 0 a 12 sin añadir ni una destreza de C2. Es la falsificación de
tabla que la instrucción pedía nombrar, y la nombro.

**Salida:** los ocho ítems sanos (P-01, P-02, P-03, P-06) son buen material y
deberían publicarse **en `b8-coloc-mesoclise`**, donde encajan y donde el gate de
virginidad tiene que decidir si aportan sobre los 13 que ya hay. Para `b12` hacen
falta pares donde **las dos formas sean correctas** y lo juzgado sea la elección:
mesóclise vs. reordenación, mesóclise vs. `há de`, mesóclise en documento oficial
vs. mesóclise en diálogo (donde suena a impostura), condicional vs. futuro.

---

## Qué está bien, específicamente

No es cortesía: sin esto no se puede decidir qué se salva.

- **Las seis mesóclises son morfológicamente impecables**, incluida la distinción
  fina que casi todo el material de PLE esconde: `-ar`/`-er` llevan tilde
  (`informá-lo`, `enviá-lo`) y `-ir` no (`decidi-lo`). Y `dir-lhe-ei` esquiva la
  trampa de E2#11 por la razón correcta.
- **P-01, P-02 y P-03 son sólidos y están atestados**, con la mejor atestación
  posible: Camilo escribiendo `«ninguém lhe adoçará as penas»` y Garrett
  `«não lhe direi nada»`.
- **El «OBLIGATORIAMENTE» de GJ-12 es el primer absoluto de este proyecto que
  sobrevive a la prueba.** 0 mesóclises bajo atractor en 4,27 M de caracteres.
- **P-06 es pedagógicamente el mejor ítem del lote** —la observación de que el
  «quando» sólo gobierna su cláusula es exacta y es el error real de los
  hispanohablantes—, aunque su explicación se apoye en una regla mal enunciada.
- **El método de pares mínimos funciona y hay que quedárselo.** La batería sale
  toda al 50 % por construcción, tal como prometía. El fallo de la v1 no fue del
  método: fue que el método garantiza que los dos miembros difieran sólo en el
  rasgo, no que el esqueleto sea gramatical — y la nota del autor lo dice con esas
  palabras, que es la clase de honestidad que hace útil un documento.
- **El léxico y la ortografía europeos están bien**: `correio registado` (no
  *registrado*), `direção`, `dezembro` en minúscula, `sócios`, futuro de
  subjuntivo `terminar`/`houver`, `enquanto … não estiver`.

Fuera de alcance, pero lo vi y lo dejo dicho: **`b2c2-par-20` en `b8.json` está
roto**. La pregunta es «A casa só ___ depois do verão, quando o mercado recuperar»
y la explicación habla de «Talvez», que no aparece en la frase. La respuesta
(`se venderá`, por el atractor `só`) es correcta; la explicación es de otro ítem.

---

## Bloqueantes — lista cerrada

1. **GJ-05 y GJ-07 (los MAL de P-04 y P-05) no se sostienen.** La Biblioteca del
   propio curso publica la estructura que declaran incorrecta (Camilo, *Amor de
   Perdição* c12 §52 y c02 §18; Eça, *A Aia* §13, *A Perfeição* §57, *Adão e Eva*
   §45). Barra de retirada, precedente `do que` del lote 5. → **DALE LA VUELTA**
   con el MAL de ênclise-calco (`informará-o`, `enviará-o`), y **vuelve a correr el
   gate de virginidad** contra `b2c2-par-14` y `b2c2-par-15`, que ya traen
   distractores de esa familia.
2. **Contradicción interna en el par P-04.** GJ-10 dice «culta, **no obligatoria**»
   y GJ-05 marca MAL la alternativa. Incompatible con o sin corpus. Se resuelve
   con el bloqueante 1.
3. **El `rasgo` de P-04 y P-05 describe mal su propio ítem** («con el verbo
   abriendo la oración»: el verbo no abre la oración, y desde la reconstrucción
   está en el segundo miembro de una coordinación). El campo es el que legitima o
   deslegitima los atajos de la batería. Reescribir.
4. **GJ-03 enuncia una regla morfológica falsa** («"enviará" + "o" da
   "enviá-lo-á"»), que predice `*enviará-lo`. Es la clase de error que produjo
   `*dir-lo-ão` en E2#11, esta vez en texto visible para el alumno. Texto de
   sustitución arriba.
5. **GJ-08 y GJ-02 se apoyan en un absoluto falso** («el portugués europeo **no
   admite** el pronombre átono abriendo oración» / «la principal empieza **de
   cero**»). La regla clásica es sobre el **período**, no sobre la principal, y
   Eça abre una principal con clítico tras adjunto antepuesto (*A Cidade e as
   Serras* c13 §22). El veredicto del ítem se salva; el argumento no. Textos de
   sustitución arriba.
6. **El lote no es C2 y no puede cerrar `b12-mesoclise-estilistica`.** Cinco de
   los seis pares reenuncian proposiciones ya publicadas en `b8-coloc-mesoclise`
   (tabla arriba), P-06 replica la traducción `315cc2f3` casi estructura por
   estructura, y la tercera pata del punto del currículo —«cuándo usarla suena a
   impostura»— tiene **cero** ítems. Reasignar los ítems sanos a `b8` y construir
   para `b12` pares donde **ambas formas sean correctas** y lo juzgado sea la
   elección de registro.

Menores, no bloqueantes: la lista «nunca, jamais, **raramente**» de GJ-06
(`raramente` no es negativo); la referencia turbia de `-lo` en P-04 (`o caso` está
más cerca que `o presidente`); y la explicación de GJ-10 que dice «sin **nada** que
atraiga el clítico» cuando la frase contiene `já` en la otra cláusula.
