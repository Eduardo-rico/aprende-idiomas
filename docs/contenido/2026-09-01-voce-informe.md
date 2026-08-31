# «Você» en la base europea — dictamen de los 98 ítems marcados

Rama `variante/pt-pt-como-base`. Base `data` = portugués **europeo** por contrato desde la
inversión del 2026-07-28; `variantOverrides['pt-br']` = Brasil.

Revisión hecha reconstruyendo lo que el alumno VE (frase ensamblada, override aplicado según
`lib/exercise-resolver.ts`), con las conjugaciones comprobadas una a una en Priberam antes de
escribirlas, y con el resultado re-escaneado contra los marcadores de `scripts/lib/variant-guard.ts`.

## Recuento

| | |
|---|---|
| Ítems revisados | **98** |
| `CORREGIR` | **92** |
| `OK` (no se tocan) | **6** |
| Correcciones propuestas | **210** campos |
| Ítems que exigen **rehacer el audio PT** | **26** |

### Por clase

| clase | ítems | qué se hace |
|---|---|---|
| `tuteo` | **58** | la base pasa a `tu` / `ti` / `te` / `contigo`, con la desinencia de 2.ª persona |
| `elidir` | **33** | se cae el pronombre y se queda la 3.ª persona sin sujeto (pro-drop europeo) |
| `ensena-tratamento` | **4** | el ítem enseña el propio sistema de tratamiento: `você` está bien puesto |
| `otro` | **3** | 2 declaran la variante en el enunciado (`OK`) + 1 ítem roto que pide ojo humano |

Por fichero: `b6` 32 · `b5` 20 · `b8` 15 · `b3` 11 · `b1` 6 · `b4` 6 · `b10` 3 · `b2` 3 · `b7` 2.

---

## La regla que apliqué, y por qué no es la del encargo tal cual

El encargo separa «español tutea → `tu`» de «español trata de usted o no hay persona → elidir».
Al bajar a los ítems reales aparecieron dos casos que esa dicotomía no cubre, así que la regla
operativa acabó siendo ésta —y conviene leerla antes de auditar el JSON:

1. **Si la glosa española tutea** → `tu` + 2.ª persona. (16 ítems: `¿Te gustaría…?`, `si pudieras
   venir`, `Cuando llegaste`, `No me digas… lo conseguiste`, `Tú vas a enfocarte`…)
2. **Si trata de usted o no hay persona, y la frase conserva un verbo finito** → **elidir**. La
   3.ª sin pronombre es el trato deferente europeo y no toca lo que el ítem enseña. (33 ítems.)
   Sólo 3 tienen glosa de *usted* explícita (`d39ebf56`, `407c3bde` y la alternativa de
   `4a3bcc22`); los otros 30 son glosas gramaticales sin persona.
3. **Si `você` es OBLICUO** (`em você`, `para você`, `de você`, `com você`) u **objeto directo**
   (`trazer você`, `informarei você`) → **no se puede elidir**: un complemento no desaparece.
   Va a `ti` / `contigo` / clítico `-te`. Son **23 ítems**, el grupo más numeroso de la clase
   `tuteo`. Y `com você` NO da «com ti»: da la forma amalgamada **`contigo`** (3 ítems).
4. **Si elidir dejaría la persona ambigua con la 3.ª** (`quando chegou` = «¿cuando llegó él?»,
   `se viesse`, `entenderia melhor`) → `tu`, porque la desinencia de 2.ª desambigua sola y en
   europeo ni siquiera hace falta escribir el pronombre. (12 ítems.)
5. **Si el hueco ES el verbo** y elidir dejaría la frase sin sujeto Y sin verbo visible → `tu`
   ocupa el hueco estructural. (1 ítem: `d4c69c92`.)

### El freno que más decidió: **la respuesta guardada manda sobre el pronombre**

En **9 ítems** la elección no fue estilística. Tutear habría cambiado la desinencia que está
guardada en `answer` o citada en `esContrast`, y el ítem habría empezado a enseñar algo falso:

- `cefb1b07` (listening): opciones `Ter / Tiver / Tem / Tinha`, respuesta **`Tiver`**. Con `tu`
  sería `tiveres` y la respuesta declarada pasaría a ser FALSA. **Elidir es obligatorio aquí.**
- `0bdb4c36`: el `esContrast` dice que el futuro do conjuntivo de `chegar` *coincide con el
  infinitivo*; con `chegares` esa afirmación deja de ser cierta.
- `e552df71`: el contraste enseñado es «pt `saiba` vs es `sepa`»; `saibas` descuadra el par.
- `f77c9982` (`tenha`), `d24421bc` (`diga`), `643ed58b` (`preencher`), `f0de9ef5` (`souber`),
  `4dbd621a` (`viniera`→`viesse`), `830d1cfb` (`estudie`→`estude`).

### El otro freno: **la colocación pronominal**

Quitar `você` mueve el clítico. Aparece en **15 ítems** y es donde un arreglo mecánico habría
metido agramaticalidades europeas:

- `Você poderia me ajudar` → **`Poderia ajudar-me`** (ênclise sobre el infinitivo), no
  «*Poderia me ajudar».
- `Quando você tiver…, me avise` → **`avise-me`**; `Quando você se ___, me liga` → **`ligue-me`**.
- `Você se ___ da letra 'ã'` no admite elisión directa: dejaría «*Se lembra…», próclise en inicio
  absoluto, agramatical en Portugal. Solución: sustituir el pronombre por **`Ainda`**, adverbio
  que sí dispara próclise, con lo que el clítico y el hueco se quedan exactamente donde estaban.
  El mismo truco resuelve `3ecb638b` con **`já`**.
- Al revés: en `d24421bc` (`Quero que me diga`) y `b68ed598` (`de como se preparar`) la próclise
  se **conserva** porque la disparan `que` y `como`. Y en `c21d89d9` la próclise tras `não`
  —que es justo lo que el ítem enseña— sobrevive intacta al tuteo: `Não me digas`.

### El tercer freno: **`você` vivía en más de un campo en 17 ítems**

Éste es el que rompe los arreglos por regex. Escaneando TODOS los campos del ítem (no sólo los
que mira el gate) `você` aparecía repartido así:

- **`sentence` + `correct`** en los 3 `error_correction` corregidos (`adab6a42`, `4dbd621a`,
  `830d1cfb`): tocar sólo uno convierte el par «error → forma correcta» en dos frases sin relación.
- **`front` + `back`** en las dos fichas de paradigma (`9cc3099f`, `3917b328`): el enunciado pide
  «eu, você, nós» y la respuesta los da. Cambiar sólo el `back` deja la ficha pidiendo una persona
  que ya no contesta.
- **`front` + `example`** (`b3bebf21`), **`back` + `example`** (`fa14b3b9`, `72894d13`).
- **dentro del `esContrast`**, que el gate NO escanea pero el alumno SÍ lee: `72894d13`
  («se traduce igual: 'Você poderia me ajudar'»), `64a089d7`, `d6eb0f27` («'te quiero' = 'eu te
  amo'»), `b3974972`. Los cuatro habrían quedado desmintiéndose a sí mismos.
- **en `acceptedAlternatives`** (`4b2561b4`): campo que `camposPortugues()` deja fuera por diseño,
  así que un `você` puede sobrevivir ahí indefinidamente sin que ningún gate lo vea.

Los 17 están corregidos campo por campo, o marcados `OK` porque el ítem enseña el tratamiento.

---

## Los 6 `OK`, y por qué

**Enseñan el sistema de tratamiento (4).** Quitar `você` los destruiría:

- `b63d821e` (b10, multiple_choice) — la elección es «o senhor / a senhora» vs `você` vs `tu`, y
  `você` es distractor en un campo didáctico. La clave marcada es la correcta en Portugal.
- `0847ef58` (b10) y `27f780d5` (b3) — los dos son el mismo ejercicio: `você sabes` → `você sabe`,
  `você falas` → `você fala`. El ítem ES la concordancia en 3.ª persona.
- `842c4750` (b3) — `você` es etiqueta metalingüística del imperativo deferente. **`Abra a porta,
  por favor!` es exactamente la forma europea de cortesía.**

**Declaran la variante en el enunciado (2).** El alumno lee «(traduce al PT-BR)»:

- `7acf7f5e` y `da3e3c73` (b6). Con esa consigna `você` es la respuesta correcta. Ojo: el gate no
  los exime porque su regex pide `(BR)` literal y aquí pone `(traduce al PT-BR)`.

---

## Qué está bien (sección obligatoria, y no es de cortesía)

- **El marcador acertó casi siempre.** De 98, sólo 6 son falsos positivos, y 2 de ellos por una
  etiqueta que el gate no sabe leer todavía. Un 94 % de precisión en un marcador de sintaxis es
  mucho más de lo que suele conseguirse.
- **La decisión de marcar sólo el singular está bien tomada.** `vocês` como 2.ª del plural es
  europeo de manual y no aparece en la lista: `b3c94153` lo lleva en el `front` y no se marcó.
- **Varios ítems ya traían la ênclise europea correcta** y sólo les sobraba el pronombre:
  `Diga-me o que você acha`, `Já que você está aqui, ajude-me`, `Ainda não o vi`. Alguien ya pasó
  por ahí y acertó.
- **La próclise disparada por `se`, `que`, `como`, `não` está bien puesta** en todos los ítems que
  la usan. Ningún caso de «la próclise es lo predeterminado», que es el error típico del material
  heredado de Brasil.
- **El swap léxico anterior (E2#10) funcionó**: `cardápio` → `ementa` está bien hecho y la forma
  brasileña quedó guardada donde debía, en `variantOverrides['pt-br']`. Lo que falló es sólo la
  concordancia de género, que es un fallo de segunda vuelta, no de diseño.

---

## Lo que encontré y NO está en `correcciones` (fuera de encargo)

Separo **ERROR** (falso o agramatical) de **DISCUTIBLE** (elección defendible que yo haría
distinta), porque confundirlos quita autoridad para lo que sí importa.

### ERROR

1. **`8695dcff` (b1) enseña una forma que no existe.** «`pará` (con acento) es verbo `parar` en
   3ª persona del singular». Falso: la 3.ª de `parar` es **`para`**, sin tilde. Lo que existió
   fue **`pára`** (tilde en la primera `a`), y el Acordo de 1990 la abolió. La ficha enseña a la
   vez una grafía inexistente y una regla derogada. **Ni corrigiéndole el `você` deja de ser
   falsa: hay que rehacerla o retirarla.**
2. **`9f626d97` (b3) declara una respuesta falsa.** Pregunta qué persona gramatical usa «você me
   traz» y responde «Segunda pessoa do singular», contradiciendo su propio `esContrast` y los
   ítems `0847ef58` y `27f780d5`, que enseñan lo contrario. Mi propuesta lo repara girando la
   base a `tu` (con lo que la respuesta se vuelve verdadera) y dando al override brasileño su
   propia pregunta y su propia respuesta — pero **es el único ítem de los 98 que pido que mire
   un humano antes de aplicar**.
3. **`7acf7f5e` (b6) opone un conjuntivo a un indicativo.** «En PT-BR se usa 'você' + subjuntivo,
   no **'tu vens'** (más propio de PT-PT)». La forma europea paralela a «que você venha» es
   «que **tu venhas**», no «tu vens». El contraste, tal como está escrito, es incoherente.
4. **`34d81602` (b8) enseña una regência brasileña como si fuera europea.** La clave es
   `achar graça DE`; en Portugal es **`achar graça A`** («achei graça à história»). Encima el
   hueco no contrae con el artículo: la respuesta rinde «graça de história».
5. **`1c3cdbee` (b5) conserva un marcador ERROR del propio gate: `vestibular`** (europeo: *exames
   nacionais / provas de acesso*). No lo he tocado porque cambiarlo obliga a reescribir también
   el lado español y sus alternativas aceptadas; **debe ir a la ola léxica, no perderse aquí.**
6. **Huecos estructuralmente rotos, independientes de la variante — 15 ítems.** Al ensamblar la
   frase con su respuesta sale algo que no es portugués: la preposición se duplica, falta el
   verbo, o hay dos huecos y una sola respuesta. Todos son `verb_preposition` menos uno:
   `8f089cb7` («se de da letra»), `d0321a11`, `d4c69c92`, `c1c6623d` («Eu de ti»), `72e78802`,
   `fac545dd`, `dc63d860` («eu em em ti»), `19c89d21`, `435a79ff`, `6ca73007`, `86e213b1`,
   `ee77cd22`, `34d81602` («graça de história», sin contracción), `b68ed598` («depende de de
   como»), y `3ecb638b` («Eu já te **ligado**»). Mis correcciones **no los empeoran ni los
   arreglan**: dejan la estructura exactamente como está. Es una deuda aparte, y grande — son
   15 de los 21 `verb_preposition` de esta lista.
7. **`9cc3099f` (b4) etiqueta mal el tiempo.** «Pretérito mais-que-perfeito composto» de `ter`
   sería «tinha tido»; lo que da la ficha (`tinha, tinhas, tínhamos`) es el imperfeito del
   auxiliar. Y el ejemplo se comió un espacio: «tínhamos**ido**».
8. **`fb7440b8` (b6) tiene una alternativa aceptada mitad española mitad portuguesa:** «Quiero
   que hagas esa **ligação** al inicio de la reunión».
9. **`7d26539b` (b8) acepta una forma incompatible con su propia frase.** La alternativa
   `acordares` es de `tu` y la frase lleva `se` + 3.ª. Venía descuadrada de antes; no la he
   tocado para no meter una corrección con valor de array, pero **debería borrarse**.
10. **`278e78fc` (b6) acepta `ouver`**, que no es palabra, como alternativa de `houver`; y su
    `esContrast` habla de un verbo «Haverbir».

### DISCUTIBLE

- **`sourceLang` / `targetLang` dicen `pt-br` en los 16 `translation` de la lista**, incluida la
  base que ahora es europea. El gate sólo los usa para elegir qué campo escanear, así que no
  rompe nada hoy, pero es metadato que miente y conviene barrer en bloque.
- **`842c4750`**: en un curso de PT-PT la etiqueta debería decir «imperativo formal, 3.ª pessoa /
  o senhor», no «você», y convendría una ficha hermana con el imperativo de `tu` (**`Abre`**).
- **`7d5f6f8a`**: el ejemplo sigue anclado en São Paulo. Inmersión, no gramática.
- **`ee77cd22`**: la clave es `ter QUE + infinitivo`; la norma europea prefiere **`ter DE`**, que
  está entre los distractores. El ítem premia la opción menos europea de las dos.
- **`801648fa`**: el `esContrast` afirma que «`pensar de` existe em PT-BR com matizes diferentes».
  Dudoso; pide fuente.
- **`86e213b1`**: `esContrast` descuadrado (habla de «conocer» para ilustrar `gostar de`).
- **`fb7440b8`, `6ca73007`**: `ligação` por llamada telefónica es brasileñizante; en Portugal,
  `telefonema` / `chamada`. No está en la lista del gate.
- **`38c0760e`**: `assistir` sin preposición es brasileño; en Portugal `assistir A` o `vê-lo`.
- **`4a3bcc22`**: tras el arreglo la alternativa aceptada «¿Le gustaría ver el menú?» ya no
  concuerda con el tuteo de la base.
- **`acceptedAlternatives` es un punto ciego del gate.** `camposPortugues()` sólo devuelve
  `source`/`target`, así que un brasileñismo puede vivir ahí para siempre sin que nadie lo vea.
  En esta lista lo cacé una vez (`4b2561b4`, ya corregido); **conviene barrer el campo entero en
  todo el corpus**, no sólo en estos 98.

### Un fallo del propio gate, que conviene arreglar antes de la siguiente ola

`contrasteImplicito()` toma «la primera palabra portuguesa de ≥3 letras» del campo `europeo` del
marcador. Para `você`, `europeo` es *«tu (informal) o 3ª persona sin pronombre (deferencia)»*, así
que el término extraído es **`informal`**. Resultado: **cualquier ítem que contenga la palabra
«informal» queda tratado como contraste didáctico de `você`**. Es exactamente lo que pasa con
`c1c6623d`, que dice «No registo informal, dizemos: "Eu gosto de você"» — la afirmación más
anti-europea de las 98, presentada como si fuera la norma informal de Portugal, y el gate la
consideraba contrastada. Convendría que el campo `europeo` de ese marcador empiece por una forma
portuguesa citable (p. ej. `tu`), o que `contrasteImplicito` no se aplique a marcadores de
sintaxis.

---

## Cómo aplicar

> ⚠️ **AVISO DE CARRERA.** Mientras se escribía este informe, el árbol de trabajo se modificó
> desde fuera: los nueve `bN.json` quedaron con `M` en `git status` a las 15:03, con una versión
> anterior de este informe ya aplicada. Los `de` de este fichero se reconstruyeron por eso contra
> **`git show HEAD:`**, verificado idéntico ítem por ítem al snapshot `voce.json` (0 diferencias).
> Consecuencia práctica: **hay 3 correcciones nuevas que la versión aplicada no llevaba** —
> `esContrast` de `72894d13`, y `data.acceptedAlternatives[0]` +
> `variantOverrides.pt-br.acceptedAlternatives` de `4b2561b4`. O se re-aplica el informe entero
> sobre un checkout limpio, o se aplican sólo esas tres a mano.

- `informe-voce.json`: 98 objetos **en el orden de `voce.json`**. Cada `de` se tomó VERBATIM del
  snapshot prístino (`build_informe.py`) y se volvió a verificar contra `git show HEAD:`
  (`verify_informe.py`, 0 discrepancias). `(ausente)` significa que el campo hay que crearlo.
- `variantOverrides['pt-br']` es un **merge superficial** sobre `data` (`lib/exercise-resolver.ts`),
  así que basta con poner los campos que difieren — es lo que hacen todas las propuestas.
- Tras aplicar, **los 92 `CORREGIR` dejan de disparar** `você`, gerundio con `estar`, próclise en
  inicio de frase y ênclise tras negación en los campos portugueses de la base (verificado
  ensamblando también los `fill_blank` con su respuesta). Los únicos residuos de `você` son los
  10 campos de los 6 ítems marcados `OK`, que es lo que se buscaba.
- Un barrido MÁS amplio (todos los campos, no sólo los del gate) deja sólo 3 apariciones de
  `você` en ítems `CORREGIR`, y las 3 son **menciones deliberadas dentro de glosas españolas que
  contrastan las dos normas**: `9f626d97`, `e87ec3cb` («'Tu' exige 'pagas'; 'você' exige 'paga'»)
  y `64a089d7` («'É importante que estudes' (Portugal) / 'que você estude' (Brasil)»). Son uso
  metalingüístico, no trato.
- Falta un paso que **no** he metido en `correcciones` porque es de vuestro proceso: los 92
  corregidos pasan a tener las dos formas, así que su `variantStatus` debería quedar
  **`divergent`** (hoy 91 están en `needs-human` y 1 en `unchecked`).
- **26 ítems exigen rehacer el audio PT** (`rehacer: true`): son aquellos en los que cambia el
  campo locutado — `data.back` en flashcards, `data.audioText` en listening y el lado portugués
  de las `translation` (`data.source` si va pt→es, `data.target` si va es→pt), según
  `scripts/lib/audio-collector.ts`. El audio **BR no se toca**: la forma brasileña queda intacta
  en el override, así que su job de TTS produce el mismo texto y el mismo hash.

---

## Dictamen ítem a ítem

El índice es la posición en `voce.json` (el orden que pidió el encargo).

### `b1.json` — 6 ítems

**[0] `0693557a`** · verb_preposition · **CORREGIR** · clase `elidir`

Glosa gramatical sin persona (contracción a+o). El verbo «volta» ya está en la frase, así que basta elidir el pronombre: «Quando volta ao hotel...?» es el trato deferente normal en la receção de un hotel en Portugal. La regência enseñada no se toca.

- `data.sentence`
  - de: `Quando você volta ___ hotel amanhã de manhã?`
  - a:  `Quando volta ___ hotel amanhã de manhã?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quando você volta ___ hotel amanhã de manhã?`

**[1] `8695dcff`** · flashcard · **CORREGIR** · clase `tuteo`

«você» sólo aparece en `example` y como oblicuo tras preposición: en portugués europeo el oblicuo de `tu` es `ti` («Isso é para ti»). No se puede elidir un complemento preposicional. OJO (fuera de encargo): «pará» NO existe como forma de `parar`; era «pára», tilde abolida por el Acordo de 1990 — la ficha enseña una falsedad.

- `data.example`
  - de: `Ele pará de chorar. / Isso é para você.`
  - a:  `Ele pará de chorar. / Isso é para ti.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Ele pará de chorar. / Isso é para você.`

**[2] `8f089cb7`** · verb_preposition · **CORREGIR** · clase `elidir`

Glosa gramatical (lembrar-se DE). Elidir «você» dejaría «se» en próclise absoluta, agramatical en Portugal («*Se lembra da letra»). Se sustituye el pronombre por «Ainda», adverbio que SÍ dispara próclise en europeo, así que la posición del clítico y del hueco quedan idénticas: «Ainda se lembra da letra 'ã'...?». AVISO: el hueco de este ítem ya estaba roto antes (la respuesta «de» rinde «se de da letra»).

- `data.sentence`
  - de: `Você se ___ da letra 'ã' no português?`
  - a:  `Ainda se ___ da letra 'ã' no português?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você se ___ da letra 'ã' no português?`

**[3] `d0321a11`** · verb_preposition · **CORREGIR** · clase `elidir`

Glosa gramatical (pensar EM). Los dos «você» se eliden; el verbo finito «ouve» fija la persona. AVISO fuera de encargo: «pâo» está mal escrito (es «pão», tilde, no circunflejo).

- `data.sentence`
  - de: `Quando você ouve a palavra 'pâo', em que você ___?`
  - a:  `Quando ouve a palavra 'pâo', em que ___?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quando você ouve a palavra 'pâo', em que você ___?`

**[4] `d4c69c92`** · verb_preposition · **CORREGIR** · clase `tuteo`

Glosa gramatical, pero aquí el hueco ES el verbo: al elidir «você» la frase se queda sin sujeto Y sin verbo visible («___ de uma letra...»), y el alumno no puede reconstruir la persona. Se pone `tu`, que ocupa el mismo espacio estructural y no obliga a tocar ninguna desinencia guardada (la respuesta es la preposición, no el verbo).

- `data.sentence`
  - de: `Você ___ de uma letra 'ç' para escrever 'caça'.`
  - a:  `Tu ___ de uma letra 'ç' para escrever 'caça'.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você ___ de uma letra 'ç' para escrever 'caça'.`

**[5] `e0241775`** · listening · **CORREGIR** · clase `elidir` · ⚠️ **rehacer audio PT**

La pregunta va en español y no marca persona. «Ouviu o acento?» es 3.ª sin pronombre, el registro deferente normal de una locución de curso.

- `data.audioText`
  - de: `A palavra 'café' tem acento agudo. Você ouviu o acento?`
  - a:  `A palavra 'café' tem acento agudo. Ouviu o acento?`
- `variantOverrides.pt-br.audioText`
  - de: `(ausente)`
  - a:  `A palavra 'café' tem acento agudo. Você ouviu o acento?`

### `b2.json` — 3 ítems

**[9] `7d5f6f8a`** · flashcard · **CORREGIR** · clase `elidir`

Glosa española sin persona. El verbo está en la frase: «Onde mora?» es la pregunta europea normal a un desconocido. DISCUTIBLE (no corregido): el ejemplo sigue anclado en São Paulo.

- `data.example`
  - de: `Eu moro em São Paulo. / Onde você mora?`
  - a:  `Eu moro em São Paulo. / Onde mora?`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Eu moro em São Paulo. / Onde você mora?`

**[10] `b3758d78`** · verb_preposition · **CORREGIR** · clase `elidir`

Glosa gramatical (precisar DE). «Precisa de ajuda com esse exercício?» es europeo natural y conserva intacta la regência enseñada.

- `data.sentence`
  - de: `Você precisa ___ ajuda com esse exercício?`
  - a:  `Precisa ___ ajuda com esse exercício?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você precisa ___ ajuda com esse exercício?`

**[11] `ee2f355d`** · flashcard · **CORREGIR** · clase `elidir`

Glosa sobre «qualquer», sin persona. «Pode chegar a qualquer hora» conserva el punto léxico.

- `data.example`
  - de: `Você pode chegar a qualquer hora, não tem problema.`
  - a:  `Pode chegar a qualquer hora, não tem problema.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Você pode chegar a qualquer hora, não tem problema.`

### `b3.json` — 11 ítems

**[12] `368bd639`** · flashcard · **CORREGIR** · clase `tuteo`

El propio `back` de la ficha enseña «TU estás»; el ejemplo lo contradecía con «você está». «Como estás hoje?» (Priberam: tu estás) hace que el ejemplo ilustre el paradigma que la ficha acaba de dar. `back` no cambia → el audio sirve.

- `data.example`
  - de: `Como você está hoje? Estou bem, obrigado.`
  - a:  `Como estás hoje? Estou bem, obrigado.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Como você está hoje? Estou bem, obrigado.`

**[13] `4a3bcc22`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa española TUTEA («¿Te gustaría ver el menú?»). Base a `tu`: «Gostarias de ver a ementa?». De paso se arregla la concordancia rota que dejó el swap léxico BR→EP: «ementa» es FEMENINO, «o ementa» es agramatical. El override pt-br ya existe y es correcto («o cardápio», masculino): no se toca.

- `data.source`
  - de: `Você gostaria de ver o ementa?`
  - a:  `Gostarias de ver a ementa?`

**[14] `591aec46`** · fill_blank · **CORREGIR** · clase `tuteo`

El interlocutor es 2.ª persona y elidir daría «não percebeu», que en europeo se lee como 3.ª («él no se dio cuenta»): se perdería el destinatario. Con `tu` la desinencia es inequívoca (Priberam: perceber, tu percebeste). La respuesta «tenho» no se toca.

- `data.sentence`
  - de: `Eu ___ razão, você não percebeu o problema.`
  - a:  `Eu ___ razão, tu não percebeste o problema.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu ___ razão, você não percebeu o problema.`

**[15] `801648fa`** · verb_preposition · **CORREGIR** · clase `tuteo`

«você» es OBLICUO tras «em»: no se puede elidir. El oblicuo europeo de `tu` es `ti` → «pensamos em ti». DISCUTIBLE (no corregido): el esContrast afirma que «pensar de» existe «em PT-BR com matizes diferentes» — es dudoso y merece revisión aparte.

- `data.sentence`
  - de: `Nós pensamos ___ você todos os dias.`
  - a:  `Nós pensamos ___ ti todos os dias.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Nós pensamos ___ você todos os dias.`

**[16] `9f626d97`** · listening · **CORREGIR** · clase `otro` · ⚠️ **rehacer audio PT**

ÍTEM ROTO EN TRES SITIOS A LA VEZ, y no se arregla campo a campo sin coordinar variantes. (1) La `question` CITA «você me traz», así que cambiar sólo el audioText dejaría el ítem contradiciéndose. (2) La respuesta declarada («Segunda pessoa do singular») es FALSA para «você traz» y contradice al propio esContrast del ítem y a los ítems 0847ef58 y 27f780d5, que enseñan que `você` rige 3.ª. (3) «o ementa» es agramatical (ementa es femenino) — residuo del swap léxico. Además «Você me traz» lleva próclise sin disparador, imposible en Portugal. Reparación propuesta: la base pasa a `tu` con ênclise («Trazes-me», Priberam: tu trazes), con lo cual la respuesta «Segunda pessoa» se vuelve VERDADERA; y el override pt-br recibe su propia pregunta y su propia respuesta (3.ª persona), que es la correcta allí. REQUIERE OJO HUMANO antes de aplicar.

- `data.audioText`
  - de: `Eu quero o ementa, por favor. Você me traz logo?`
  - a:  `Eu quero a ementa, por favor. Trazes-me logo?`
- `data.question`
  - de: `¿Qué persona gramatical usa «você me traz»?`
  - a:  `¿Qué persona gramatical usa «trazes-me»?`
- `variantOverrides.pt-br.question`
  - de: `(ausente)`
  - a:  `¿Qué persona gramatical usa «você me traz»?`
- `variantOverrides.pt-br.answer`
  - de: `(ausente)`
  - a:  `Terceira pessoa do singular`
- `esContrast`
  - de: `«Você» equivale a «tú» en ES, pero es tercera persona gramatical.`
  - a:  `En PT-PT el tuteo lleva 2.ª persona y el clítico va detrás del verbo: «trazes-me». En Brasil «você» equivale a «tú» pero rige 3.ª persona: «você me traz».`

**[17] `a0542d09`** · flashcard · **CORREGIR** · clase `tuteo`

«para você» es oblicuo: no elidible. Europeo informal: «para ti».

- `data.example`
  - de: `Ele está presente na reunião. (está presente) / Esse livro é um presente para você. (un regalo)`
  - a:  `Ele está presente na reunião. (está presente) / Esse livro é um presente para ti. (un regalo)`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Ele está presente na reunião. (está presente) / Esse livro é um presente para você. (un regalo)`

**[18] `e87ec3cb`** · fill_blank · **CORREGIR** · clase `tuteo`

BASE Y OVERRIDE ESTÁN INVERTIDOS respecto al contrato del 2026-07-28: hoy el alumno de PT-PT ve «Você paga» y el de PT-BR ve «Tu pagas», exactamente al revés de las dos normas. El ítem SÍ enseña el sistema de tratamiento (esContrast: «'Tu' exige 'pagas'; 'você' exige 'paga'»), y por eso la corrección es un INTERCAMBIO, no una elisión: cada variante recupera su propia forma y el contraste enseñado sigue en pie. Priberam: pagar → tu pagas.

- `data.sentence`
  - de: `Você ___ a conta no final. (pagar)`
  - a:  `Tu ___ a conta no final. (pagar)`
- `data.blanks[0].answer`
  - de: `paga`
  - a:  `pagas`
- `variantOverrides.pt-br.sentence`
  - de: `Tu ___ a conta no final. (pagar)`
  - a:  `Você ___ a conta no final. (pagar)`
- `variantOverrides.pt-br.blanks[0].answer`
  - de: `pagas`
  - a:  `paga`

**[19] `f297792c`** · flashcard · **CORREGIR** · clase `tuteo`

Mismo caso que 368bd639: el `back` enseña «TU fazes» y el ejemplo lo desmentía. «O que fazes da vida?» (Priberam: tu fazes) es la forma europea corriente. `back` intacto → audio válido.

- `data.example`
  - de: `O que você faz da vida? Eu faço pão.`
  - a:  `O que fazes da vida? Eu faço pão.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `O que você faz da vida? Eu faço pão.`

**[20] `fa14b3b9`** · flashcard · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

El enunciado español TUTEA («Tienes razón»), así que la traducción europea es «Tens razão» (Priberam: ter, tu tens). Cambia `back`, que es el campo locutado → hay que rehacer el audio PT. El ejemplo se alinea con la misma persona.

- `data.back`
  - de: `Você tem razão, mas ele não.`
  - a:  `Tens razão, mas ele não.`
- `data.example`
  - de: `Você tem toda a razão. / Raison d'être = razão de ser.`
  - a:  `Tens toda a razão. / Raison d'être = razão de ser.`
- `variantOverrides.pt-br.back`
  - de: `(ausente)`
  - a:  `Você tem razão, mas ele não.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Você tem toda a razão. / Raison d'être = razão de ser.`

**[21] `27f780d5`** · error_correction · **OK** · clase `ensena-tratamento`

El ítem entero ES la concordancia de `você` («Você falas» → «Você fala»), con tag `voce` y lección de pronombres personales. Quitar el pronombre borraría el ejercicio.


**[22] `842c4750`** · fill_blank · **OK** · clase `ensena-tratamento`

«você» aparece como ETIQUETA metalingüística del imperativo deferente, no como trato: «Abra a porta, por favor!» es exactamente la forma europea de cortesía (3.ª persona, Priberam). DISCUTIBLE (no corregido): en un curso de PT-PT la etiqueta debería decir «imperativo formal, 3.ª pessoa / o senhor», y convendría una ficha hermana con el imperativo de `tu` («Abre»).


### `b4.json` — 6 ítems

**[23] `171f16b3`** · flashcard · **CORREGIR** · clase `tuteo`

«dar um abraço EM alguém» es brasileño; en Portugal se abraza «a alguém» o, mejor, con clítico: «Posso dar-te um abraço?» (ênclise sobre el infinitivo, correcta en europeo).

- `data.example`
  - de: `Posso dar um abraço em você?`
  - a:  `Posso dar-te um abraço?`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Posso dar um abraço em você?`

**[24] `5fe6d699`** · flashcard · **CORREGIR** · clase `tuteo`

Oblicuo tras «para»: «para ti».

- `data.example`
  - de: `Eu trouxe um presente para você.`
  - a:  `Eu trouxe um presente para ti.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Eu trouxe um presente para você.`

**[25] `72e78802`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «em»: «em ti». AVISO: el ítem ya venía roto (dos huecos y una sola respuesta).

- `data.sentence`
  - de: `Enquanto eu ___ pensar ___ você, o tempo passou rápido.`
  - a:  `Enquanto eu ___ pensar ___ ti, o tempo passou rápido.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Enquanto eu ___ pensar ___ você, o tempo passou rápido.`

**[26] `7bbe3d88`** · flashcard · **CORREGIR** · clase `tuteo`

Elidir daría «quando chegou», ambiguo con la 3.ª persona. Con `tu` la desinencia lo resuelve sola y ni siquiera hace falta el pronombre (Priberam: chegar, tu chegaste).

- `data.example`
  - de: `Eu tinha feito o jantar quando você chegou.`
  - a:  `Eu tinha feito o jantar quando chegaste.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Eu tinha feito o jantar quando você chegou.`

**[27] `9cc3099f`** · flashcard · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

Ficha de PARADIGMA: el `front` pide «eu, você, nós» y el `back` los da. Si sólo se toca el `back`, el enunciado queda pidiendo una persona que la respuesta ya no da — hay que cambiar los dos. Paradigma europeo: «eu tinha, tu tinhas, nós tínhamos» (Priberam). `back` es locutado → rehacer audio PT. AVISOS fuera de encargo: el tiempo está mal etiquetado (eso es el imperfeito de `ter`, no el mais-que-perfeito composto, que sería «tinha tido»), y el ejemplo tiene un espacio comido: «tínhamosido».

- `data.front`
  - de: `Conjuga 'ter' en Pretérito mais-que-perfeito composto: eu, você, nós`
  - a:  `Conjuga 'ter' en Pretérito mais-que-perfeito composto: eu, tu, nós`
- `data.back`
  - de: `Eu tinha, você tinha, nós tínhamos`
  - a:  `Eu tinha, tu tinhas, nós tínhamos`
- `variantOverrides.pt-br.front`
  - de: `(ausente)`
  - a:  `Conjuga 'ter' en Pretérito mais-que-perfeito composto: eu, você, nós`
- `variantOverrides.pt-br.back`
  - de: `(ausente)`
  - a:  `Eu tinha, você tinha, nós tínhamos`

**[28] `fac545dd`** · verb_preposition · **CORREGIR** · clase `tuteo`

Igual que 7bbe3d88: «quando chegaste» quita la ambigüedad de persona sin tocar la respuesta.

- `data.sentence`
  - de: `Eu ___ ___ de ajuda quando você chegou.`
  - a:  `Eu ___ ___ de ajuda quando chegaste.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu ___ ___ de ajuda quando você chegou.`

### `b5.json` — 20 ítems

**[29] `0361bfe7`** · flashcard · **CORREGIR** · clase `elidir`

Glosa sin persona → elisión. Se añade además la preposición: en portugués europeo `precisar` rige DE también ante infinitivo («preciso de fazer»), construcción que Brasil ha ido perdiendo (Ciberdúvidas, «A regência do verbo precisar»). Es un juicio mío, revertible por separado si se prefiere el mínimo.

- `data.example`
  - de: `Você precisa fazer um esforço maior.`
  - a:  `Precisa de fazer um esforço maior.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Você precisa fazer um esforço maior.`

**[30] `1c3cdbee`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa española TUTEA explícitamente («Tú vas a enfocarte»). Base a `tu`: «Vais focar-te» (en europeo el verbo es pronominal, «focar-se em»). ATENCIÓN: este ítem lleva ADEMÁS un marcador de la lista del gate que NO he tocado — «vestibular» (europeo: exames nacionais / provas de acesso). No lo corrijo porque cambiarlo obliga a reescribir también el lado español y sus alternativas; debe ir a la ola léxica.

- `data.source`
  - de: `Você vai focar nos estudos para o vestibular.`
  - a:  `Vais focar-te nos estudos para o vestibular.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Você vai focar nos estudos para o vestibular.`

**[31] `307d79ee`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa TUTEA («si pudieras venir»). Imperfeito do conjuntivo de `poder`, 2.ª sg: «pudesses». Se elide el pronombre porque la desinencia ya lo dice.

- `data.source`
  - de: `Eu ficaria muito contente se você pudesse vir à festa.`
  - a:  `Eu ficaria muito contente se pudesses vir à festa.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Eu ficaria muito contente se você pudesse vir à festa.`

**[32] `3917b328`** · flashcard · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

Ficha de paradigma como 9cc3099f: `front` y `back` tienen que cambiar juntos. Condicional europeo de `pôr` (Priberam): eu poria, tu porias, nós poríamos. `back` locutado → rehacer.

- `data.front`
  - de: `Conjuga 'pôr' en condicional simple: eu, você, nós`
  - a:  `Conjuga 'pôr' en condicional simple: eu, tu, nós`
- `data.back`
  - de: `eu poria, você poria, nós poríamos`
  - a:  `eu poria, tu porias, nós poríamos`
- `variantOverrides.pt-br.front`
  - de: `(ausente)`
  - a:  `Conjuga 'pôr' en condicional simple: eu, você, nós`
- `variantOverrides.pt-br.back`
  - de: `(ausente)`
  - a:  `eu poria, você poria, nós poríamos`

**[33] `44d50878`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «em»: «em ti».

- `data.sentence`
  - de: `Eu pensaria ___ você enquanto estivesse fora.`
  - a:  `Eu pensaria ___ ti enquanto estivesse fora.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu pensaria ___ você enquanto estivesse fora.`

**[34] `49d7577e`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa española usa «contigo». El equivalente europeo de «com você» con tuteo es la forma amalgamada `contigo` — «com ti» sería agramatical.

- `data.source`
  - de: `Eu gostaria de falar com você sobre esse assunto.`
  - a:  `Eu gostaria de falar contigo sobre esse assunto.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Eu gostaria de falar com você sobre esse assunto.`

**[35] `4e3d1e6d`** · verb_preposition · **CORREGIR** · clase `elidir`

Glosa gramatical (precisar DE). El verbo queda en la frase: «Precisaria de ajuda com isso?».

- `data.sentence`
  - de: `Você precisaria ___ ajuda com isso?`
  - a:  `Precisaria ___ ajuda com isso?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você precisaria ___ ajuda com isso?`

**[36] `6cab85e4`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

El español de partida TUTEA («si estudiaras») y las DOS alternativas aceptadas ya traen «estudasses»: la base era la única que iba con `você`. Dirección es→pt, así que el campo locutado es `target`.

- `data.target`
  - de: `Eu estaria contente se você estudasse mais.`
  - a:  `Eu estaria contente se estudasses mais.`
- `variantOverrides.pt-br.target`
  - de: `(ausente)`
  - a:  `Eu estaria contente se você estudasse mais.`

**[37] `6e7c498c`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa dice «traerte». «trazer você» como objeto directo es brasileño; en europeo el objeto es clítico y va enclítico al infinitivo: «trazer-te».

- `data.source`
  - de: `Se eu puder, vou querer trazer você comigo.`
  - a:  `Se eu puder, vou querer trazer-te comigo.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Se eu puder, vou querer trazer você comigo.`

**[38] `6f5b01a2`** · fill_blank · **CORREGIR** · clase `tuteo`

Elidir daría «se viesse», ambiguo entre 1.ª y 3.ª. Con la desinencia de 2.ª («viesses», Priberam) queda inequívoco sin necesidad de pronombre. La respuesta «estaria/ficaria» no se toca.

- `data.sentence`
  - de: `Eu ___ muito contente se você viesse à minha festa.`
  - a:  `Eu ___ muito contente se viesses à minha festa.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu ___ muito contente se você viesse à minha festa.`

**[39] `72894d13`** · flashcard · **CORREGIR** · clase `elidir` · ⚠️ **rehacer audio PT**

Es una ficha de CORTESÍA, y «você poderia» es precisamente la fórmula cortés brasileña: la europea es la 3.ª sin pronombre. Además el clítico salta a ênclise sobre el infinitivo: «me ajudar» → «ajudar-me». `back` es el campo locutado → rehacer audio PT. TRAMPA DE COHERENCIA: «você» vive también en el `esContrast` («se traduce igual: 'Você poderia me ajudar'»), así que hay que tocarlo o la ficha se desmiente a sí misma.

- `data.back`
  - de: `você poderia + infinitivo`
  - a:  `poderia + infinitivo`
- `data.example`
  - de: `Você poderia me ajudar com isso?`
  - a:  `Poderia ajudar-me com isso?`
- `esContrast`
  - de: `'Podrías ayudarme' se traduce igual: 'Você poderia me ajudar'.`
  - a:  `'Podrías ayudarme' se traduce igual: 'Poderia ajudar-me'.`
- `variantOverrides.pt-br.back`
  - de: `(ausente)`
  - a:  `você poderia + infinitivo`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Você poderia me ajudar com isso?`

**[40] `8a71ec94`** · fill_blank · **CORREGIR** · clase `elidir`

Petición cortés → 3.ª sin pronombre. Con el pronombre fuera, «me dar» tiene que pasar a ênclise: «dar-me». La respuesta «poderia» no cambia.

- `data.sentence`
  - de: `Você ___ me dar um conselho sobre isso?`
  - a:  `___ dar-me um conselho sobre isso?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você ___ me dar um conselho sobre isso?`

**[41] `b3bebf21`** · flashcard · **CORREGIR** · clase `elidir`

«você» está en `front` y en `example`; arreglar sólo uno dejaría la ficha contradiciéndose. Los dos pasan a 3.ª sin pronombre con ênclise («dizer-me»). `back` no cambia → audio válido.

- `data.front`
  - de: `'Você poderia me dizer onde fica a estação?' → Identifica la estructura`
  - a:  `'Poderia dizer-me onde fica a estação?' → Identifica la estructura`
- `data.example`
  - de: `Você poderia me dizer qual é o seu conselho?`
  - a:  `Poderia dizer-me qual é o seu conselho?`
- `variantOverrides.pt-br.front`
  - de: `(ausente)`
  - a:  `'Você poderia me dizer onde fica a estação?' → Identifica la estructura`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Você poderia me dizer qual é o seu conselho?`

**[42] `b3c94153`** · flashcard · **CORREGIR** · clase `tuteo`

«que você venha» → «que venhas» (Priberam: vir, presente do conjuntivo, tu venhas). Elidir daría «que venha», ambiguo con la 3.ª. De paso «nos visitar» pasa a ênclise: «visitar-nos». («vocês» del `front` es PLURAL y es europeo normal: no se toca.)

- `data.example`
  - de: `Quereremos muito que você venha nos visitar.`
  - a:  `Quereremos muito que venhas visitar-nos.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Quereremos muito que você venha nos visitar.`

**[43] `d2f872f3`** · flashcard · **CORREGIR** · clase `tuteo`

«com você» → forma amalgamada `contigo`.

- `data.example`
  - de: `Eu falaria português com você, se pudesse.`
  - a:  `Eu falaria português contigo, se pudesse.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Eu falaria português com você, se pudesse.`

**[44] `dc63d860`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «em»: «em ti».

- `data.sentence`
  - de: `Em breve, eu ___ em você quando resolvermos este problema.`
  - a:  `Em breve, eu ___ em ti quando resolvermos este problema.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Em breve, eu ___ em você quando resolvermos este problema.`

**[45] `f0de9ef5`** · fill_blank · **CORREGIR** · clase `elidir`

Glosa metalingüística sobre «souber». Tutear obligaría a «souberes» y a «perderás», y la respuesta guardada («souber») dejaría de ser la correcta: el punto enseñado se rompería. Elidir lo conserva intacto y «Se não souber a tempo, perderá a vaga» es europeo natural.

- `data.sentence`
  - de: `Se você não ___ a tempo, perderá a vaga.`
  - a:  `Se não ___ a tempo, perderá a vaga.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Se você não ___ a tempo, perderá a vaga.`

**[46] `f3712afa`** · listening · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La pregunta española habla de «la persona» sin fijar trato, pero elidir dejaría «se realizasse o seu desejo», que en europeo se lee como 3.ª («si él cumpliera SU deseo»). Con `tu` queda claro. Se corrige además el posesivo: en europeo lleva artículo, «o teu desejo».

- `data.audioText`
  - de: `Ela disse que ficaria muito contente se você realizasse seu desejo.`
  - a:  `Ela disse que ficaria muito contente se realizasses o teu desejo.`
- `variantOverrides.pt-br.audioText`
  - de: `(ausente)`
  - a:  `Ela disse que ficaria muito contente se você realizasse seu desejo.`

**[47] `adab6a42`** · error_correction · **CORREGIR** · clase `elidir`

Lo que enseña es la tilde («podería» → «poderia»), no el trato. `sentence` (errónea a propósito) y `correct` tienen que cambiar A LA VEZ o el par deja de ser un par. Fuera el pronombre, «me ajudar» pasa a ênclise.

- `data.sentence`
  - de: `Você podería me ajudar com isto?`
  - a:  `Podería ajudar-me com isto?`
- `data.correct`
  - de: `Você poderia me ajudar com isto?`
  - a:  `Poderia ajudar-me com isto?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você podería me ajudar com isto?`
- `variantOverrides.pt-br.correct`
  - de: `(ausente)`
  - a:  `Você poderia me ajudar com isto?`

**[48] `3dc6033d`** · fill_blank · **CORREGIR** · clase `elidir`

Petición cortés europea = 3.ª sin pronombre; el clítico pasa a ênclise sobre el infinitivo.

- `data.sentence`
  - de: `Você ___ (poder) me ajudar, por favor?`
  - a:  `___ (poder) ajudar-me, por favor?`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você ___ (poder) me ajudar, por favor?`

### `b6.json` — 32 ítems

**[49] `0b68f903`** · flashcard · **CORREGIR** · clase `elidir`

El ejemplo ya trae «o vir» en próclise correcta (disparada por «se»), y el imperativo «me avise» tiene que pasar a ênclise: «avise-me». Elidiendo el pronombre, la 3.ª de «vir» y la de «avise» concuerdan entre sí.

- `data.example`
  - de: `Se por um acaso você o vir, me avise.`
  - a:  `Se por um acaso o vir, avise-me.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Se por um acaso você o vir, me avise.`

**[50] `19c89d21`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «em»: «em ti».

- `data.sentence`
  - de: `Se ela ___ ___ você, vai ligar na hora.`
  - a:  `Se ela ___ ___ ti, vai ligar na hora.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Se ela ___ ___ você, vai ligar na hora.`

**[51] `278e78fc`** · fill_blank · **CORREGIR** · clase `tuteo`

«informarei você» usa `você` como objeto directo, imposible en europeo (exigiría «informá-lo-ei» / «informar-te-ei», mesóclise fuera de nivel). Se resuelve con presente por futuro y ênclise, que es lo que se dice de verdad: «informo-te». La respuesta «houver» —el punto del ítem— no se toca.

- `data.sentence`
  - de: `Assim que ___ (haver) mais informações, informarei você.`
  - a:  `Assim que ___ (haver) mais informações, informo-te.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Assim que ___ (haver) mais informações, informarei você.`

**[52] `435a79ff`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «de»: «de ti».

- `data.sentence`
  - de: `Quando ___ ___ você, tudo vai melhorar.`
  - a:  `Quando ___ ___ ti, tudo vai melhorar.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quando ___ ___ você, tudo vai melhorar.`

**[53] `451f6f84`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

El español de partida TUTEA («que llenes»). Presente do conjuntivo, 2.ª sg (Priberam): «preenchas». Dirección es→pt: el campo locutado es `target`. La alternativa aceptada «que preencha» sigue valiendo como variante deferente.

- `data.target`
  - de: `É importante que você preencha o formulário.`
  - a:  `É importante que preenchas o formulário.`
- `variantOverrides.pt-br.target`
  - de: `(ausente)`
  - a:  `É importante que você preencha o formulário.`

**[54] `49c18c4f`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa TUTEA («que tengas confianza en ti mismo»). Con `tu` el reflexivo también cambia: «em si mesmo» sólo vale con 3.ª; con tuteo es «em ti mesmo».

- `data.source`
  - de: `É importante que você tenha confiança em si mesmo.`
  - a:  `É importante que tenhas confiança em ti mesmo.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `É importante que você tenha confiança em si mesmo.`

**[55] `4b2561b4`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

El español de partida TUTEA («Creo que tienes»). Dirección es→pt: se corrige `target`. TRAMPA DE COHERENCIA: `você` sobrevivía en `acceptedAlternatives[0]`, campo que el gate NO escanea (ver `camposPortugues()` en variant-guard) pero que el alumno ve como respuesta válida — se alinea también, y la forma brasileña se guarda en el override.

- `data.target`
  - de: `Acredito que você tem confiança em mim.`
  - a:  `Acredito que tens confiança em mim.`
- `data.acceptedAlternatives[0]`
  - de: `Penso que você tem confiança em mim.`
  - a:  `Penso que tens confiança em mim.`
- `variantOverrides.pt-br.target`
  - de: `(ausente)`
  - a:  `Acredito que você tem confiança em mim.`
- `variantOverrides.pt-br.acceptedAlternatives`
  - de: `(ausente)`
  - a:  `["Penso que você tem confiança em mim."]`

**[56] `5d724b79`** · fill_blank · **CORREGIR** · clase `tuteo`

Oblicuo tras «para»: «para ti». DISCUTIBLE (no corregido): en europeo la regência corriente es «ligar A alguém» o directamente «ligo-te».

- `data.sentence`
  - de: `Quando eu ___ (chegar) ao escritório, ligarei para você.`
  - a:  `Quando eu ___ (chegar) ao escritório, ligarei para ti.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quando eu ___ (chegar) ao escritório, ligarei para você.`

**[57] `61c4310f`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa TUTEA con pronombre explícito («Espero que tú veas»). Presente do conjuntivo de `ver`, 2.ª sg (Priberam): «vejas».

- `data.source`
  - de: `Espero que você veja o erro antes de continuar.`
  - a:  `Espero que vejas o erro antes de continuar.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Espero que você veja o erro antes de continuar.`

**[58] `643ed58b`** · fill_blank · **CORREGIR** · clase `elidir`

Glosa léxica sobre «advocacia», sin persona. Tutear obligaría a «preencheres» y cambiaría la respuesta guardada; elidir la deja intacta y «Se preencher o formulário, podemos começar» es europeo normal.

- `data.sentence`
  - de: `Se você ___ (preencher) o formulário, podemos começar o processo de ___ (advocacia).`
  - a:  `Se ___ (preencher) o formulário, podemos começar o processo de ___ (advocacia).`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Se você ___ (preencher) o formulário, podemos começar o processo de ___ (advocacia).`

**[59] `65045f37`** · verb_preposition · **CORREGIR** · clase `tuteo`

«com você» → `contigo`.

- `data.sentence`
  - de: `Eu gostaria ___ tomar um café com você.`
  - a:  `Eu gostaria ___ tomar um café contigo.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu gostaria ___ tomar um café com você.`

**[60] `694d343b`** · flashcard · **CORREGIR** · clase `tuteo`

Elidir daría «entenderia melhor», ambiguo con la 3.ª y con la 1.ª. La desinencia de 2.ª («entenderias») lo resuelve sin pronombre.

- `data.example`
  - de: `Se eu falasse mais devagar, você entenderia melhor.`
  - a:  `Se eu falasse mais devagar, entenderias melhor.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Se eu falasse mais devagar, você entenderia melhor.`

**[61] `6ca73007`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «em»: «em ti». DISCUTIBLE (no corregido): «a ligação» por llamada telefónica es brasileñizante; en Portugal, «o telefonema» / «a chamada».

- `data.sentence`
  - de: `Talvez ele ___ em você quando receber a ligação.`
  - a:  `Talvez ele ___ em ti quando receber a ligação.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Talvez ele ___ em você quando receber a ligação.`

**[62] `7823cae6`** · listening · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

«Quero que» + conjuntivo: con tuteo, «tenhas» (Priberam). La pregunta y las opciones están en español y hablan de «el interlocutor», así que no se contradicen. AVISO fuera de encargo: la frase es semánticamente confusa («ter confiança no início do formulário»).

- `data.audioText`
  - de: `Quero que você tenha confiança no início do formulário, mesmo que a ligação pareça vaga.`
  - a:  `Quero que tenhas confiança no início do formulário, mesmo que a ligação pareça vaga.`
- `variantOverrides.pt-br.audioText`
  - de: `(ausente)`
  - a:  `Quero que você tenha confiança no início do formulário, mesmo que a ligação pareça vaga.`

**[63] `7acf7f5e`** · flashcard · **OK** · clase `otro`

DECLARA LA VARIANTE: el enunciado que ve el alumno dice «(traduce al PT-BR)» y el esContrast contrasta explícitamente PT-BR con PT-PT. Con esa consigna, `você` es la respuesta correcta y quitarlo rompería el ítem. AVISOS para otra ola: (a) el gate no lo exime porque su regex pide «(BR)» literal y aquí pone «(traduce al PT-BR)» — conviene añadir la etiqueta canónica; (b) el esContrast contiene un ERROR: opone «você venha» (conjuntivo) a «tu vens» (INDICATIVO); la forma europea paralela es «tu venhas»; (c) pedir producción en PT-BR dentro de un corpus de base europea es una decisión editorial que alguien debe confirmar.


**[64] `86e213b1`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «de»: «de ti». Se corrige además el posesivo sin artículo, marca brasileña clásica: «minha família» → «a minha família». AVISO: el esContrast está descuadrado (habla de «conocer» para ilustrar «gostar de»).

- `data.sentence`
  - de: `Quando eu ___ ___ você, vou apresentar minha família.`
  - a:  `Quando eu ___ ___ ti, vou apresentar a minha família.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quando eu ___ ___ você, vou apresentar minha família.`

**[65] `a6c2ee3c`** · flashcard · **CORREGIR** · clase `tuteo`

El ejemplo contrasta dos tiempos («viesse» vs «venha») y elidir dejaría las dos formas ambiguas con la 3.ª. Con tuteo (viesses / venhas, Priberam) el contraste temporal —que es lo que la ficha enseña— se ve mejor, no peor.

- `data.example`
  - de: `Eu queria que você viesse (pasado) / Eu quero que você venha (presente).`
  - a:  `Eu queria que viesses (pasado) / Eu quero que venhas (presente).`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Eu queria que você viesse (pasado) / Eu quero que você venha (presente).`

**[66] `bf8cd8d3`** · flashcard · **CORREGIR** · clase `tuteo`

«com você» → `contigo`.

- `data.example`
  - de: `É bom que eu seja honesto com você.`
  - a:  `É bom que eu seja honesto contigo.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `É bom que eu seja honesto com você.`

**[67] `cdb2ca2d`** · flashcard · **CORREGIR** · clase `tuteo`

Oblicuo tras «em»: «em ti».

- `data.example`
  - de: `Ele tem muita confiança em você.`
  - a:  `Ele tem muita confiança em ti.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Ele tem muita confiança em você.`

**[68] `cefb1b07`** · listening · **CORREGIR** · clase `elidir` · ⚠️ **rehacer audio PT**

AQUÍ LA ELISIÓN ES OBLIGATORIA, no una preferencia: las opciones son «Ter / Tiver / Tem / Tinha» y la respuesta es «Tiver». Con `tu` la forma sería «tiveres» y la respuesta declarada quedaría FALSA. Elidiendo, «Quando tiver a vaga confirmada» conserva «tiver». El imperativo pasa a ênclise: «avise-me».

- `data.audioText`
  - de: `Quando você tiver a vaga confirmada, me avise por telefone.`
  - a:  `Quando tiver a vaga confirmada, avise-me por telefone.`
- `variantOverrides.pt-br.audioText`
  - de: `(ausente)`
  - a:  `Quando você tiver a vaga confirmada, me avise por telefone.`

**[69] `d24421bc`** · fill_blank · **CORREGIR** · clase `elidir`

La glosa es metalingüística («pt 'diga' vs es 'diga'»): tutear cambiaría la respuesta a «digas» y rompería el par que se enseña. Elidiendo, la próclise «me diga» SIGUE siendo correcta en europeo porque la dispara la conjunción «que».

- `data.sentence`
  - de: `Quero que você me ___ a verdade sobre o que aconteceu.`
  - a:  `Quero que me ___ a verdade sobre o que aconteceu.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quero que você me ___ a verdade sobre o que aconteceu.`

**[70] `d39ebf56`** · translation · **CORREGIR** · clase `elidir` · ⚠️ **rehacer audio PT**

El español de llegada trata de USTED («Es importante que usted complete»). La 3.ª sin pronombre es la traducción europea exacta de ese registro.

- `data.source`
  - de: `É importante que você preencha o formulário corretamente.`
  - a:  `É importante que preencha o formulário corretamente.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `É importante que você preencha o formulário corretamente.`

**[71] `da3e3c73`** · flashcard · **OK** · clase `otro`

DECLARA LA VARIANTE en el propio enunciado: «(traduce al PT-BR)». Con esa consigna `você` es lo correcto. AVISOS para otra ola: falta la etiqueta canónica «(BR)» que exime en el gate, y habría que decidir si un corpus de base europea debe pedir producción brasileña.


**[72] `daa1df76`** · listening · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La pregunta sólo pide identificar el TIEMPO («Imperfeito do conjuntivo»), y «aquecesses» sigue siendo imperfeito do conjuntivo: la respuesta no se ve afectada. Elidir dejaría «aquecesse», ambiguo con la 3.ª.

- `data.audioText`
  - de: `Eu queria que você aquecesse o café antes de tomarmos.`
  - a:  `Eu queria que aquecesses o café antes de tomarmos.`
- `variantOverrides.pt-br.audioText`
  - de: `(ausente)`
  - a:  `Eu queria que você aquecesse o café antes de tomarmos.`

**[73] `e4a808b5`** · flashcard · **CORREGIR** · clase `tuteo`

Oblicuo tras «em»: «em ti».

- `data.example`
  - de: `Tenho confiança em você.`
  - a:  `Tenho confiança em ti.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Tenho confiança em você.`

**[74] `e552df71`** · fill_blank · **CORREGIR** · clase `elidir`

El contraste enseñado es «pt 'saiba' vs es 'sepa'»: con tuteo la forma sería «saibas» y el par se descuadraría. Elidir conserva la respuesta exacta.

- `data.sentence`
  - de: `Espero que você ___ a resposta correta.`
  - a:  `Espero que ___ a resposta correta.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Espero que você ___ a resposta correta.`

**[75] `edd55a17`** · flashcard · **CORREGIR** · clase `tuteo`

El `back` de la ficha ya lista «tivesses»; el ejemplo lo desmentía con «você tivesse». Con tuteo el ejemplo pasa a ilustrar la forma que la propia ficha enseña, y «terias» concuerda.

- `data.example`
  - de: `Se você tivesse estudado, teria passado no exame.`
  - a:  `Se tivesses estudado, terias passado no exame.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Se você tivesse estudado, teria passado no exame.`

**[76] `fb7440b8`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa TUTEA («Quiero que hagas»). Presente do conjuntivo de `fazer`, 2.ª sg (Priberam): «faças». AVISOS fuera de encargo: «ligação» por llamada es brasileñizante (europeo: telefonema/chamada) y la alternativa aceptada «Quiero que hagas esa ligação...» mezcla español y portugués.

- `data.source`
  - de: `Quero que você faça essa ligação no início da reunião.`
  - a:  `Quero que faças essa ligação no início da reunião.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Quero que você faça essa ligação no início da reunião.`

**[77] `4dbd621a`** · error_correction · **CORREGIR** · clase `elidir`

Lo que enseña es «viniera» (castellanismo) vs «viesse», no el trato. `sentence` y `correct` cambian juntas para que el par siga siendo un par; elidir mantiene «viesse» exacto, mientras que tutear lo movería a «viesses» y desharía el contraste declarado en explicación.

- `data.sentence`
  - de: `Eu queria que você viniera à minha festa.`
  - a:  `Eu queria que viniera à minha festa.`
- `data.correct`
  - de: `Eu queria que você viesse à minha festa.`
  - a:  `Eu queria que viesse à minha festa.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu queria que você viniera à minha festa.`
- `variantOverrides.pt-br.correct`
  - de: `(ausente)`
  - a:  `Eu queria que você viesse à minha festa.`

**[78] `830d1cfb`** · error_correction · **CORREGIR** · clase `elidir`

Mismo patrón: el par enseñado es «estudie» (castellanismo) vs «estude». Elidir conserva las dos formas letra por letra; tutear las movería a «estudes» y rompería la explicación.

- `data.sentence`
  - de: `É importante que você estudie todos os dias.`
  - a:  `É importante que estudie todos os dias.`
- `data.correct`
  - de: `É importante que você estude todos os dias.`
  - a:  `É importante que estude todos os dias.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `É importante que você estudie todos os dias.`
- `variantOverrides.pt-br.correct`
  - de: `(ausente)`
  - a:  `É importante que você estude todos os dias.`

**[79] `f77c9982`** · fill_blank · **CORREGIR** · clase `elidir`

El esContrast fija la respuesta literalmente («va conjuntivo: 'tenha'»). Elidir la conserva; tutear («tenhas») la contradiría.

- `data.sentence`
  - de: `Espero que você ___ (ter) um bom dia.`
  - a:  `Espero que ___ (ter) um bom dia.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Espero que você ___ (ter) um bom dia.`

**[80] `0bdb4c36`** · fill_blank · **CORREGIR** · clase `elidir`

El esContrast dice que el futuro do conjuntivo de `chegar` COINCIDE con el infinitivo: con tuteo sería «chegares» y esa afirmación dejaría de ser cierta. Elidir la conserva. Se corrigen además dos brasileñismos de la misma frase: «chegar EM casa» → «chegar A casa» y «me avise» → «avise-me» (ênclise).

- `data.sentence`
  - de: `Quando você ___ (chegar) em casa, me avise.`
  - a:  `Quando ___ (chegar) a casa, avise-me.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quando você ___ (chegar) em casa, me avise.`

### `b7.json` — 2 ítems

**[81] `3ecb638b`** · fill_blank · **CORREGIR** · clase `tuteo`

Dos problemas europeos en una frase: «Eu te ___» pone el clítico en próclise sin disparador, y «você nunca atendeu» pierde la persona si se elide. Se resuelve insertando «já», adverbio que SÍ dispara próclise en europeo (así el clítico se queda donde está), y pasando el segundo verbo a 2.ª («atendeste», Priberam). AVISO: el hueco ya venía roto («Eu já te ligado»).

- `data.sentence`
  - de: `Eu te ___ muitas vezes, mas você nunca atendeu.`
  - a:  `Eu já te ___ muitas vezes, mas nunca atendeste.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu te ___ muitas vezes, mas você nunca atendeu.`

**[82] `ee77cd22`** · verb_preposition · **CORREGIR** · clase `elidir`

Glosa gramatical sobre «ter que + infinitivo»; el verbo finito «tem» queda en la frase. DISCUTIBLE (no corregido): en norma europea la obligación se dice «ter DE + infinitivo», así que la clave del ítem («que») es la opción menos europea de las dos que ofrece.

- `data.sentence`
  - de: `Você tem ___ fazer isso hoje? — Sim, já tenho ___ feito.`
  - a:  `Tem ___ fazer isso hoje? — Sim, já tenho ___ feito.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Você tem ___ fazer isso hoje? — Sim, já tenho ___ feito.`

### `b8.json` — 15 ítems

**[83] `26820612`** · verb_preposition · **CORREGIR** · clase `tuteo`

Oblicuo tras «de»: «de ti».

- `data.sentence`
  - de: `Ela gosta ___ você, mas não quer admitir.`
  - a:  `Ela gosta ___ ti, mas não quer admitir.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Ela gosta ___ você, mas não quer admitir.`

**[84] `26b5b655`** · flashcard · **CORREGIR** · clase `elidir`

Glosa léxica sobre «achar», sin persona. «O que acha disso?» es europeo corriente y el `back` —que es el campo locutado— no se toca.

- `data.example`
  - de: `O que você acha disso?`
  - a:  `O que acha disso?`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `O que você acha disso?`

**[85] `34d81602`** · verb_preposition · **CORREGIR** · clase `tuteo`

«a história que contou» sería ambiguo con la 3.ª; «que contaste» fija el destinatario. AVISO SERIO fuera de encargo: en europeo la regência es «achar graça A» («achei graça à história»), así que la clave del ítem («de») enseña una regência brasileña como si fuera europea, y encima el hueco no contrae con el artículo.

- `data.sentence`
  - de: `Achei muita graça ___ história que você contou.`
  - a:  `Achei muita graça ___ história que contaste.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Achei muita graça ___ história que você contou.`

**[86] `38c0760e`** · flashcard · **CORREGIR** · clase `tuteo`

«com você» → `contigo`. El resto del ejemplo ya es europeo («Ainda não o vi», próclise disparada por la negación). DISCUTIBLE (no corregido): «assistir» sin preposición es brasileño; en Portugal, «assistir A» o simplemente «vê-lo».

- `data.example`
  - de: `Ainda não o vi, quero assistir com você.`
  - a:  `Ainda não o vi, quero assistir contigo.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Ainda não o vi, quero assistir com você.`

**[87] `407c3bde`** · translation · **CORREGIR** · clase `elidir` · ⚠️ **rehacer audio PT**

El español de llegada trata de USTED («Dígame qué piensa»), y la frase ya trae la ênclise europea «Diga-me». La 3.ª sin pronombre es la traducción exacta y deja el ítem internamente coherente.

- `data.source`
  - de: `Diga-me o que você acha.`
  - a:  `Diga-me o que acha.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Diga-me o que você acha.`

**[88] `43a6d371`** · flashcard · **CORREGIR** · clase `elidir`

El ejemplo ya cierra con «ajude-me» (3.ª, ênclise): elidir el pronombre hace que las dos mitades concuerden. Con tuteo habría que reescribir también el imperativo («ajuda-me»).

- `data.example`
  - de: `Já que você está aqui, ajude-me.`
  - a:  `Já que está aqui, ajude-me.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Já que você está aqui, ajude-me.`

**[89] `45b2038a`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa TUTEA («Ya que no quieres ir»). Priberam: querer, tu queres.

- `data.source`
  - de: `Já que você não quer ir, vamos ficar em casa.`
  - a:  `Já que não queres ir, vamos ficar em casa.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Já que você não quer ir, vamos ficar em casa.`

**[90] `64a089d7`** · flashcard · **CORREGIR** · clase `tuteo`

TRAMPA DE COHERENCIA: «você» está en `example` Y dentro de la cita portuguesa del `esContrast`; arreglar sólo el ejemplo dejaría la palabra viva en la glosa que el alumno lee. El español del esContrast TUTEA («Es importante que estudies»), así que la base va a «que estudes». El esContrast se reescribe marcando las dos variantes para que siga siendo cierto también para el alumno de Brasil.

- `data.example`
  - de: `É importante que você estude. (=subjecto)`
  - a:  `É importante que estudes. (=subjecto)`
- `esContrast`
  - de: `Funcionan igual que en ES: 'Es importante que estudies' = 'É importante que você estude'.`
  - a:  `Funcionan igual que en ES: 'Es importante que estudies' = 'É importante que estudes' (Portugal) / 'que você estude' (Brasil).`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `É importante que você estude. (=subjecto)`

**[91] `6ac9398a`** · flashcard · **CORREGIR** · clase `elidir`

Glosa sobre el conector «ainda que», sin persona. «Ainda que não acredite, é verdade» es europeo natural y no toca el conector enseñado.

- `data.example`
  - de: `Ainda que você não acredite, é verdade.`
  - a:  `Ainda que não acredite, é verdade.`
- `variantOverrides.pt-br.example`
  - de: `(ausente)`
  - a:  `Ainda que você não acredite, é verdade.`

**[92] `7d26539b`** · fill_blank · **CORREGIR** · clase `elidir`

El ítem enseña la próclise tras «quando», y eso hay que conservarlo: por eso el clítico «se» se queda delante del verbo. Elidir mantiene además la respuesta «acordar» intacta (tutear obligaría a «acordares»). «me liga» pasa a «ligue-me» para concordar con la 3.ª y con la ênclise europea. AVISO (no corregido para no tocar un array): la alternativa «acordares» que el ítem ya traía es una forma de `tu` incompatible con «se» — venía descuadrada de antes y debería borrarse.

- `data.sentence`
  - de: `Quando você se ___ (acordar), me liga.`
  - a:  `Quando se ___ (acordar), ligue-me.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Quando você se ___ (acordar), me liga.`

**[93] `b3974972`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa TUTEA («Cuando llegaste»). Este ítem venía marcado por el OTRO marcador del gate —gerundio con estar— y lleva los dos defectos en la misma frase: se corrigen juntos, porque «estava dormindo» es imposible en Portugal («estar A + infinitivo»). El esContrast se reescribe: decía que «se usa 'dormindo'», que después del arreglo sería falso para la base.

- `data.source`
  - de: `Quando você chegou, eu já estava dormindo.`
  - a:  `Quando chegaste, eu já estava a dormir.`
- `esContrast`
  - de: `En pt-BR se usa 'dormindo' con gerúndio; en es se puede decir 'dormido/a'.`
  - a:  `En PT-PT el progresivo es 'estar A + infinitivo' ('estava a dormir'); el gerundio 'dormindo' es brasileño.`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Quando você chegou, eu já estava dormindo.`

**[94] `b68ed598`** · verb_preposition · **CORREGIR** · clase `elidir`

«como» dispara próclise, así que «de como se preparar» queda correcto en europeo sin el pronombre. AVISO: el hueco ya venía roto (la respuesta «de» duplica el «de» que ya está escrito).

- `data.sentence`
  - de: `Tudo depende ___ de como você se preparar para a prova.`
  - a:  `Tudo depende ___ de como se preparar para a prova.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Tudo depende ___ de como você se preparar para a prova.`

**[95] `c21d89d9`** · translation · **CORREGIR** · clase `tuteo` · ⚠️ **rehacer audio PT**

La glosa TUTEA dos veces («No me digas... lo conseguiste»). Con tuteo el imperativo negativo es «não digas» y la próclise tras «não» —que es EXACTAMENTE lo que el ítem enseña— se conserva. Priberam: conseguir, tu conseguiste.

- `data.source`
  - de: `Não me diga que você conseguiu!`
  - a:  `Não me digas que conseguiste!`
- `variantOverrides.pt-br.source`
  - de: `(ausente)`
  - a:  `Não me diga que você conseguiu!`

**[96] `d6eb0f27`** · fill_blank · **CORREGIR** · clase `tuteo`

El ítem enseña el clítico «te», así que no se puede elidir. En europeo «Eu te alimento» es próclise sin disparador: el clítico pasa a ênclise sobre el verbo del hueco («Eu alimento-te») y el infinitivo personal se flexiona («sempre que precisares»). Se corrige también el esContrast, que ilustraba el pronombre con «eu te amo», forma brasileña: en Portugal, «amo-te».

- `data.sentence`
  - de: `Eu te ___ (alimentar) sempre que você precisar.`
  - a:  `Eu ___-te (alimentar) sempre que precisares.`
- `esContrast`
  - de: `No confundas 'te' (pronombre) con 'ti' español: 'te quiero' = 'eu te amo'.`
  - a:  `No confundas 'te' (pronombre) con 'ti' español: 'te quiero' = 'amo-te'.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Eu te ___ (alimentar) sempre que você precisar.`

**[97] `dc9ba1b0`** · fill_blank · **CORREGIR** · clase `elidir`

La frase ya empieza con «Diga-me», 3.ª persona con ênclise: elidir el pronombre la deja internamente coherente y no toca la respuesta («o que»), que es lo que el ítem enseña.

- `data.sentence`
  - de: `Diga-me ___ você quer para o jantar.`
  - a:  `Diga-me ___ quer para o jantar.`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `Diga-me ___ você quer para o jantar.`

### `b10.json` — 3 ítems

**[6] `c1c6623d`** · verb_preposition · **CORREGIR** · clase `tuteo`

El ítem AFIRMA que «Eu gosto de você» es el registro informal — y en Portugal es justo lo contrario: el informal es «Eu gosto de ti»; «de você» ni es informal ni es europeo. El marco ya está europeizado («registo»), sólo faltaba el pronombre. Oblicuo tras preposición: no se puede elidir. (Este ítem se escapó del gate por un fallo del propio gate: `contrasteImplicito` toma «informal» como término europeo del marcador `você`, y la frase contiene «informal».)

- `data.sentence`
  - de: `No registo informal, dizemos: "Eu ___ você."`
  - a:  `No registo informal, dizemos: "Eu ___ ti."`
- `variantOverrides.pt-br.sentence`
  - de: `(ausente)`
  - a:  `No registo informal, dizemos: "Eu ___ você."`

**[7] `b63d821e`** · multiple_choice · **OK** · clase `ensena-tratamento`

Enseña el propio inventario de tratamiento: «o senhor / a senhora» vs «você» vs «tu» son las opciones de una elección múltiple, y `você` es distractor en un campo DIDÁCTICO. Quitarlo destruiría el ítem. La respuesta marcada (o senhor / a senhora) es la correcta en Portugal.


**[8] `0847ef58`** · error_correction · **OK** · clase `ensena-tratamento`

Enseña la concordancia de `você` en 3.ª persona («Você sabes» → «Você sabe»), dentro de una lección de registro formal/informal. `você` existe en europeo como meio-tratamento y su concordancia es exactamente lo que el ítem enseña. No se toca.


