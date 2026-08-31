# Muestreo adversarial del 10 % — lote industrial de PARADIGMA #1

**Muestra:** PAR-08 (futuro composto, gana el compuesto) · PAR-15 (mesóclise, con
atractor) · PAR-18 (mesóclise, la excepción de los -ir).
**Documento:** `/Users/lalo/idiomas/portugues-app/docs/contenido/2026-09-01-lote-industrial-paradigma-1.md`
**Oráculo:** `/Users/lalo/idiomas/portugues-app/scripts/lib/paradigma-pt.ts` ·
gate `/Users/lalo/idiomas/portugues-app/scripts/check-paradigma.ts` ·
tests `/Users/lalo/idiomas/portugues-app/tests/unit/paradigma-pt.test.ts`
**Ejecutado (lectura, sin tocar nada):** los 14 tests pasan; el gate declara
«limpio» sobre los 24 ítems.

---

## PAR-08 — **ERROR REAL** (dos defectos independientes)

> «Até ao fim do mês ___ todas as **facturas**. (pagar)»
> [0] pagarei · [1] pago · [2] **terei pago** ✅ · [3] tenho pago

### Primero, lo que el encargo sospechaba: **«terei pago» es CORRECTO**

La sospecha era razonable pero no se sostiene. `pagar` es participio **abundante**
(Priberam lo marca así literalmente: *«Particípio: abundante»*), y la regla
tradicional —regular con *ter/haver*, irregular con *ser/estar*— tiene como
excepción canónica precisamente la terna **pagar / ganhar / gastar**, donde la
forma irregular desplazó a la regular también con *ter*. Ciberdúvidas, respuesta
32626: las formas irregulares se prefieren *«tanto em construções com o auxiliar
ser como com o auxiliar ter»*, y en el caso de `pago` **sustituyó por completo**
al antiguo `pagado`. Respuesta 1010: enuncia la regla tradicional y acto seguido
la desactiva para este verbo (*«Eu já tinha pago a conta»*).

**Veredicto sobre la clave: se queda.** «Terei pago» es lo que escribe y dice un
portugués hoy. Aquí el autor acertó.

### Defecto 1 · «facturas» es grafía pre-Acordo — **ERROR REAL**

Priberam, entrada `fatura`, literal:

> «Grafia alterada pelo Acordo Ortográfico de 1990: **fatura**.»
> «Grafia anterior ao Acordo Ortográfico de 1990: **factura**.»

La *c* de *factura* no se pronuncia en Portugal, así que el AO90 la elimina —a
diferencia de *facto* o *contacto*, que la conservan porque sí se pronuncian. El
Estado portugués escribe **e-Fatura**. Y el propio proyecto ya fijó esta grafía:
`lib/data/languages/pt/blocks/b10.json` tiene *«Traga a fatura antiga»*, y los
informes de auditoría anteriores la registran como criterio
(`docs/contenido/2026-08-31-industrial3-muestreo.md:328`: «Grafías AO90 sin *c*:
"fatura", "eletricidade" ✓»).

Publicar «facturas» aquí mete en el mismo corpus las dos grafías de la misma
palabra, y la mala en la variante que el proyecto enseña.

**Corrección:** «Até ao fim do mês ___ todas as **faturas**.»

### Defecto 2 · el ítem tiene tres respuestas defendibles — **ERROR REAL**

La frase no contiene **ningún ancla de anterioridad**: ni «já», ni un segundo
momento futuro con el que compararse. «Até ao fim do mês» es sólo un plazo, y con
un plazo el portugués europeo admite sin reservas:

- «Até ao fim do mês **pagarei** todas as faturas.» — natural, y probablemente lo
  más frecuente. La nota del documento dice que «no marca que quede acabado ANTES
  del plazo»; cierto, pero eso no lo hace incorrecto, y en un *multiple_choice* de
  clave única eso basta para romper la evaluación.
- «Até ao fim do mês **pago** todas as faturas.» — presente con valor de futuro,
  absolutamente idiomático en EP con adjunto temporal («Amanhã pago-te»). El
  documento lo etiqueta «presente» como si el presente fuera el defecto; no lo es.

Contrástese con los ítems que sí fuerzan el compuesto: PAR-01 («Antes do almoço
**já** ___»), PAR-07 («Quando vocês chegarem…, o filme **já** ___»), PAR-11
(«Daqui a dez anos **já** ___ três vezes»). En todos ellos hay «já» o subordinada
de futuro. PAR-08 no tiene ni una cosa ni la otra.

**Corrección (mínima):** «Até ao fim do mês **já** ___ todas as faturas.» — con
«já», *«já pagarei»* y *«já pago»* caen solos.
**Corrección (mejor):** dar el segundo momento futuro:
«Quando o senhorio vier, **já** ___ todas as faturas.»

### Defecto 3 · la glosa niega una forma que existe — DISCUTIBLE

> «Participio irregular: "pago", no *"pagado"*.»

El asterisco declara inexistente lo que Priberam lema como participio
(*«A forma pagado pode ser [masculino singular particípio passado de pagar]»*) y
lo que la norma tradicional **prescribía** con *ter*. No cuenta para el freno
porque no rompe la evaluación, pero le enseña una falsedad a un alumno de C1 que
tarde o temprano leerá «tinha pagado» en un texto antiguo.

**Corrección:** «"Pagar" tiene participio doble; con *ter* la lengua actual usa
"pago" y "pagado" ha caído en desuso.»

### Defecto 4 · erratita en la glosa

«Até ao fim do **mes**» → **mês**.

---

## PAR-15 — **PASA**

> «Ele **não** ___ o preço antes de ver a casa toda.»
> [0] dir-me-á · [1] dirá-me · [2] **me dirá** ✅ · [3] dir-me-ia

Lo comprobé por las cuatro vías que el encargo pedía y aguanta:

1. **La regla es cierta.** La negación es atractor de próclise, y el atractor
   **cancela la mesóclise**: no es que compitan, es que con «não» la mesóclise es
   agramatical. «Ele não me dirá o preço» es la única colocación posible. El
   propio repo lo tiene mecanizado como error duro:
   `scripts/lib/variant-guard.ts:129` marca «ênclise tras negación» con severidad
   `error`.
2. **Ningún distractor es también correcto.** [1] «dirá-me» es el calco español y
   es agramatical en cualquier contexto (con futuro no hay ênclise). [0]
   «dir-me-á» es correcta *en abstracto* pero imposible tras «não» — que es
   exactamente el punto del ítem. [3] «dir-me-ia» falla por dos motivos a la vez
   (tiempo y colocación); tras «não» tendría que ser «não me diria».
3. **La frase es portugués natural.** «Ele não me dirá o preço antes de ver a casa
   toda» es una escena real: un mediador o um avaliador que no adelanta precio
   hasta haber visto la casa entera. No huele a laboratorio.
4. **El registro es coherente.** La clave es próclise, no mesóclise; no hay choque
   entre forma culta y frase corriente.

**DISCUTIBLE (a):** «antes de ver» lleva infinitivo impersonal, así que el sujeto
por defecto es el de la principal («ele»). La lectura *«antes de que YO vea la
casa»* exigiría infinitivo pessoal: «antes de **eu** ver a casa toda». Las dos
lecturas son coherentes con la escena, así que no es error — pero el propio lote
presume del infinitivo pessoal en PAR-09, y aquí se pierde la ocasión de
desambiguar. Si se quiere la lectura del comprador, escribir «antes de eu ver a
casa toda».

**DISCUTIBLE (b):** [3] «dir-me-ia» es un distractor barato: se descarta por el
tiempo sin necesidad de saber nada de colocación. Un cuarto distractor más
exigente sería «não dir-me-á» explicitando la negación en la opción, que obliga a
juzgar la colocación y no el tiempo.

---

## PAR-18 — **PASA** en la forma; dos DISCUTIBLES, uno serio

> «O bolo é enorme; o pai ___ à mesa. (partir + o)» → **parti-lo-á**

**La forma es correcta y no lleva acento.** Verificado: las oxítonas portuguesas
en **-i** y **-u** no se acentúan nunca (aqui, ali, parti-lo, abri-lo,
dividi-lo), mientras que las terminadas en -a, -e, -o sí (comprá-lo, vendê-lo,
pô-lo). De ahí el par `comprá-lo-á` / `parti-lo-á`, que es real y bien elegido:
es de las poquísimas cosas que ningún manual de PLE explica bien.

**DISCUTIBLE (a) · registro — el serio.** La mesóclise es **culta y escrita**:
jurídica, notarial, periodística, literaria, o de fórmula («dir-se-á»,
«far-se-á»). «O bolo é enorme; o pai parti-lo-á à mesa» es una escena doméstica, y
en una escena doméstica ningún portugués dice eso: dice «o pai parte-o à mesa» o
«o pai vai parti-lo à mesa». El ítem enseña la forma correcta **en el sitio
equivocado**, que es justo el fallo que produce alumnos que sueltan mesóclises en
un café. La forma no cambia si se cambia la escena; sólo hay que subir el
registro conservando un verbo en -ir:

- «O testamento está selado; o notário **abri-lo-á** apenas na presença dos
  herdeiros.» (`mesoclise('abrir','o','ele')` → `abri-lo-á`, ya cubierto por los
  tests), o
- «O caso sobe a plenário; o tribunal **decidi-lo-á** na próxima sessão.»

**DISCUTIBLE (b) · la glosa vende como excepción lo que es la regla.** Dice: «los
verbos en -ir NO se acentúan… Es la excepción que la regla de "tras -r el verbo se
acentúa" esconde». La segunda mitad es correcta (esa regla ingenua es falsa), pero
llamar «excepción» al caso -ir invierte la explicación: no hay excepción ninguna,
hay **una sola regla de acentuación de oxítonas** — se acentúa lo que el portugués
acentúa siempre (-á, -ê, -ô) y no se acentúa lo que nunca acentúa (-i, -u). Dicho
así se memoriza; dicho como excepción, se olvida. La misma inversión está en el
comentario del conjugador (`paradigma-pt.ts:63-65`) y en el §1 del lote, así que
se propagará a todos los ítems futuros de -ir.

---

# FRENO: **SÍ**

**Cuenta: 1 de 3 ítems con error real (PAR-08), con 2 defectos reales
independientes dentro de él** — grafía pre-Acordo («facturas») y clave no única
(«pagarei» y «pago» son igual de válidos en esa frase). Más 2 discutibles en el
mismo ítem, 2 en PAR-15 y 2 en PAR-18.

Un 1/3 en la muestra con freno a ≥1 manda **el lote entero a revisión a mano**.

---

# Lo que importa más que los tres ítems: cuatro patrones

## P1 · El oráculo está roto en una casilla de su propia matriz, y un test verde lo consagra

`mesoclise()` trata aparte los tres irregulares con este comentario
(`scripts/lib/paradigma-pt.ts:81-83`):

> «El tema de un irregular ya no acaba en -r («dir-»), así que ahí el clítico de
> 3.ª no se funde.»

**Es falso, y se contradice a sí mismo en la propia frase citada:** los tres temas
—`dir-`, `far-`, `trar-`— acaban en -r. La fusión se aplica igual. Las formas
canónicas son:

| llamada | el conjugador da | lo correcto |
|---|---|---|
| `mesoclise('fazer','o','ele')` | *far-lo-á* | **fá-lo-á** |
| `mesoclise('dizer','o','eles')` | *dir-lo-ão* | **di-lo-ão** |
| `mesoclise('trazer','as','nós','condicional')` | *trar-las-íamos* | **trá-las-íamos** |

Ciberdúvidas (consultório 29344) da el paradigma completo verbatim: *«eu fá-lo-ei
/ tu fá-lo-ás / ele fá-lo-á / nós fá-lo-emos / vós fá-lo-eis / eles fá-lo-ão»*, y
la misma fuente para los otros dos: «Direi a verdade» → «Di-la-ei»; «Traríamos as
apostilas» → «Trá-las-íamos».

Y **el test lo bendice**: `tests/unit/paradigma-pt.test.ts`, bloque «los tres
irregulares mesoclizan sobre su raíz corta»:

```ts
expect(mesoclise('dizer', 'o', 'eles')).toBe('dir-lo-ão');   // forma inexistente
```

Los 14 tests están en verde afirmando una forma que no existe. Como el gate
recalcula con **esta misma función**, cualquier ítem futuro que combine uno de los
tres irregulares con un clítico de 3.ª saldría publicado mal **y con el gate en
verde**. Son 3 verbos × 4 clíticos × 5 personas × 2 tiempos = 120 formas
inventadas esperando turno. La familia entera se vende como «la forma no la
escribió el autor, la calcula el conjugador»: esa promesa es exactamente tan buena
como el conjugador.

**El lote de 24 se salva por casualidad**: ninguno de los 24 combina irregular con
clítico de 3.ª (PAR-13 dizer+te, PAR-21 fazer+lhe, PAR-24 trazer+me — los tres
clíticos que no funden).

**La corrección es una línea BORRADA.** `fundirConR` ya resuelve bien los tres
temas si se le dejan pasar: `far` acaba en «ar» → `fá-lo`; `trar` acaba en «ar` →
`trá-lo`; `dir` acaba en «ir» → `di-lo` (sin acento, como parti-lo). Basta con
eliminar el caso especial de `mesoclise()` y llamar siempre a
`fundirConR(tema, c)`. Y corregir el test a `di-lo-ão`, añadiendo `fá-lo-á` y
`trá-las-íamos`.

## P2 · El gate no comprueba la forma de 10 de los 24 ítems — y ahí es donde estaban los errores

Gate 1 sólo actúa si el ítem declara `**derivación:**`. La declaran los 10
`fill_blank` y 4 `multiple_choice` (PAR-13, 14, 19, 24). **Los otros 10
multiple_choice —PAR-05, 06, 07, 08, 11, 12, 15, 16, 20, 23— no pasan por el
conjugador**: su clave es puro juicio del autor. Encima, para los marcados
`CONTRASTE`/`CON ATRACTOR` la comprobación de la clave está desactivada por
diseño (`&& !x.contraste`, línea 91), así que ni siquiera declarando derivación se
verificarían.

Los dos errores reales que encontré están, los dos, en un ítem sin derivación. No
es coincidencia: el 100 % de la superficie no verificada es donde puede haber
errores.

**Qué hacer:** exigir derivación también a los MC (para los de contraste, declarar
la forma que la clave NO es, y comprobar que **está entre los distractores** —
PAR-15 podría declarar `mesoclise('dizer','me','ele')` → `dir-me-á` y el gate
verificaría que esa forma es el distractor [0] y que la clave es
`proclise('me', futuro('dizer','ele'))` → `me dirá`, que ya existe como función).

## P3 · Ningún gate mira la ortografía del Acordo, y en los MC ni siquiera mira la frase

`variant-guard.ts` tiene una sección «Ortografía anterior al Acordo» que sólo
cubre `contato`, `fato de que`, trema, `-ôo` y `-éia`. **Las consonantes mudas
pre-Acordo (`factura`, `actual`, `óptimo`, `acção`…) no están en ninguna lista.**
Y para `multiple_choice` el guard sólo escanea `options` (línea 36): la frase
portadora, que es donde apareció «facturas», vive en un campo que el guard trata
como español y no mira nunca.

**Qué hacer:** una regla de consonante muda con lista blanca corta para las que
Portugal sí pronuncia y conserva (facto, contacto, pacto, ficção, convicção,
excepto→exceto no, etc.). Es determinista y barata, y es la clase de gate que este
proyecto ya sabe que ahorra meses.

## P4 · «Futuro composto sin ancla»: el defecto de PAR-08 no es único

La regla que hace correcta la respuesta es que exista un **segundo momento
futuro** o un **«já»**. Repasando los 12 del punto:

- Con ancla: PAR-01, 02, 04, 07, 09, 11 («já») · PAR-05, 06, 12 (contraste, ganan
  el simple, correctos).
- **Sin ancla: PAR-03** («Até sexta ___ tudo o que ficou pendente») **y PAR-08**.
  PAR-03 es peor de lo que parece porque es `fill_blank` autocorregido: el alumno
  que escriba «faremos» —portugués impecable en esa frase— será marcado como
  incorrecto.
- Al límite: PAR-10 («No fim da viagem ___ cinco cidades»), que se salva porque
  «veremos» cambiaría el significado.

**Qué hacer:** convertirlo en gate. Todo ítem cuya clave sea futuro composto debe
contener `já` o una subordinada temporal de futuro (`quando … +futuro do
conjuntivo`, `antes de …`, `assim que …`). Es un regex sobre la frase y cierra la
clase entera.

## P5 · dos claims del documento que no coinciden con lo que hay

- §3 promete «**cuatro** de los doce se resuelven con futuro simple». El gate
  cuenta **3** (PAR-05, 06, 12) — 25 %. El gate no lo detecta porque sólo
  comprueba `0 < contraste < total`, no la proporción prometida.
- El §1 y la cabecera de `paradigma-pt.ts` dicen «12 tests»; hay **14**. Trivial,
  pero es la clase de deriva que hace que nadie vuelva a contar.

---

# Qué está bien (y es mucho)

- **El diagnóstico que originó el lote es correcto y valioso.** Un concepto
  llamado `futuro composto` con 54 ítems que enseñaban «ir + infinitivo» es
  exactamente el tipo de agujero que el corpus no puede ver solo, y la mesóclise
  con un solo ítem explicativo es el rasgo más identificatorio del EP culto
  quedándose sin práctica. Elegir por déficit y no por gusto es la decisión buena.
- **La excepción de los -ir está bien vista y bien calculada.** `parti-lo-á` /
  `comprá-lo-á` es un contraste que el 90 % de los materiales de PLE se salta o
  explica mal, y el conjugador lo acierta (incluido `vendê-lo` con circunflejo).
- **El anti-atajo funciona.** Que 4 de los 12 de mesóclise se resuelvan con
  próclise es la diferencia entre un ítem de C1 y uno de reconocimiento de forma.
  PAR-15, PAR-16, PAR-20 y PAR-23 cubren los cuatro atractores de verdad
  (negación, interrogativo, adverbio + conjuntivo, conjunción subordinante), y
  PAR-20 además encadena «talvez» → conjuntivo **y** próclise, que es
  precisamente donde el hispanohablante se cae.
- **El bug de `saído`** cazado por el propio gate justifica el diseño: un
  conjugador con hiato explícito (`sa-í-do`, `constru-ído`, y `seguido` fuera por
  la *u* muda de *gu*) es más fino de lo que el 99 % del material impreso maneja.
- **Marcadores europeos correctos y no decorativos**: «até ao fim do mês» (no
  *até o*), «se calhar», «autocarro», «os miúdos», «assim que houver», el
  infinitivo pessoal de PAR-09. No es portugués de manual traducido del brasileño.
- **PAR-15 aguanta un ataque directo.** Le busqué segunda respuesta, ambigüedad de
  sujeto, choque de registro y calco, y sólo salieron dos discutibles. Es un buen
  ítem.

---

## Fuentes

- Priberam, *fatura* / *factura*: «Grafia alterada pelo Acordo Ortográfico de
  1990: fatura» · «Grafia anterior ao Acordo Ortográfico de 1990: factura» —
  https://dicionario.priberam.org/fatura
- Priberam, *pagar* («Particípio: abundante») y *pagado* («A forma pagado pode ser
  [masculino singular particípio passado de pagar]») —
  https://dicionario.priberam.org/pagar · https://dicionario.priberam.org/pagado
- Ciberdúvidas, *Os particípios passados de pagar, gastar e ganhar* (n.º 32626) —
  https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/os-participios-passados-de-pagar-gastar-e-ganhar/32626
- Ciberdúvidas, *Pago / pagado* (n.º 1010) —
  https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/pago--pagado/1010
- Ciberdúvidas, *O verbo fazer e a mesóclise* (n.º 29344), paradigma «fá-lo-ei /
  fá-lo-ás / fá-lo-á / fá-lo-emos / fá-lo-eis / fá-lo-ão» —
  https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/o-verbo-fazer-e-a-mesoclise/29344
- Acentuación de oxítonas en -i/-u (parti-lo, dividi-lo, ouvi-las, frente a
  amá-lo / vendê-lo / pô-lo) — https://www.dicio.com.br/acentuacao-em-verbos-com-pronome/
