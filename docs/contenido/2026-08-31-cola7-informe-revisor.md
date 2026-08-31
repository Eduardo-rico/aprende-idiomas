# Cola 7 — dictamen adversarial (100 ítems)

Rama `variante/pt-pt-como-base`. Revisor: lingüista adversarial de portugués europeo.
Método: reconstrucción de lo que ve el alumno (frase ensamblada con `answer` **y** con cada
`alternative`/`option`, `variantOverrides` aplicados), contraste contra Priberam, contra las 224
lecturas del propio repo (4,9 MB de portugués europeo, volcadas a texto plano para poder citar con
párrafo) y contra el código de las tarjetas (`components/cards/*.tsx`), que es quien decide qué se
puede acertar.

## Recuento

| bloque | ítems | ERROR | DUDA | OK | % error |
|---|---:|---:|---:|---:|---:|
| b7.json  | 54 | **30** | 7 | 17 | 56 % |
| b6.json  | 42 | **17** | 5 | 20 | 40 % |
| b11.json |  4 |  **1** | 0 |  3 | 25 % |
| **total** | **100** | **48** | **12** | **40** | **48 %** |

117 correcciones concretas, 12 ítems con `rehacer: true` (cambia texto locutado).

El 48 % cae dentro de la banda de las colas 1-6 (46/45/50/49/40/53 %). b7, que nunca había pasado
por una cola, sale **peor que la media**: 56 %. b6 sale en 40 %, muy por debajo del 70 % que midió
la cola 6 en este mismo bloque, y la razón es aritmética, no de calidad: de los 42 ítems de b6 que
tocaron aquí, **13 son tarjetas de conjugación** —el molde más simple del corpus— y las 13 están
bien. Quitando esas 13, b6 va al 59 %.

## Las clases que dominan

### 1. b7 entero está escrito en brasileño donde más se nota: el gerundio (7 ítems)

La lección `b7-l2-gerundio` enseña `estar/ficar + gerúndio`. En portugués europeo el progresivo es
**`estar a + infinitivo`**, y el corpus del repo lo escupe a chorros: «estamos **a bater** o pouco
trigo», «estou **a ler**-lhe na alma», «ficou **a olhar** estupidamente a parede», «ficou **a
abanar-se** com um grande leque». El propio proyecto lo tiene tipificado como error de base en
`scripts/lib/variant-guard.ts` (marcador *«gerundio con estar» → estar a + infinitivo*, severidad
`error`).

ERROR: `04c90f64` (ficou pensando), `3e112d47` (estamos revisando), `4ffb57cc` (estou estudando),
`5dcb8dfc` (estamos lutando), `bbb6c2a0` (está saindo).
DUDA: `1df4e6e3` («vem tendo» por «tem tido»), `e2d0dde2` («aos poucos», 2 apariciones en el corpus
europeo frente a 65 de «pouco a pouco» — y una de las dos ni siquiera es el adverbio).

**Hallazgo estructural, y es el más útil de este informe:** el gate del repo NO PUEDE ver estos
cinco. Para `fill_blank`, `CAMPOS_PT` sólo escanea `data.sentence`; `data.blanks[*].answer` no se
lee nunca. Y como el brasileñismo vive partido entre los dos campos —`sentence`: «Eu estou ___
português agora», `answer`: «estudando»—, el regex `estou\s+\w+ndo` no puede casar aunque se
escaneara `blanks`, porque las dos mitades nunca están en la misma cadena. Ensamblando las frases
(`sentence.replace('___', answer)`) sobre los 680 ensamblados de `fill_blank` de todo el corpus
aparecen **6 ítems** invisibles al gate: los 5 de esta cola más `7696748d` («Agora eu estou
estudando (estudar) português», b7, fuera de la cola). Recomendación: que `revisarEjercicio`
ensamble la frase antes de escanear. Son seis errores que ninguna cola humana debería haber tenido
que encontrar a mano.

### 2. «ter + particípio» enseñado como equivalente del pretérito perfecto español (5 ítems)

Es el calco más caro que puede aprender un hispanohablante, y la lección `b7-l3-participio` lo
enseña cuatro veces. El *pretérito perfeito composto* portugués significa repetición o duración,
no hecho acabado: el corpus lo confirma sin excepción («tanto **tenho pedido** ao Senhor dos
Passos», «**tenho ouvido** dizer muitas vezes», «a mulher **tem estado** doente já há dias»).

- `356e7362`: «Ella ha puesto los libros en la mesa» → *«Ela tem posto os livros na mesa»*.
- `5406568e`: «He escrito tres cartas esta semana» → *«Tenho escrito três cartas»* (el compuesto no
  admite cuenta cerrada).
- `970cf7a9`: «He hecho la tarea» → *«Tenho feito a lição»* (y «lição» por 'deberes' es brasileño).
- `c6c330df`: «Ya he arreglado la casa» → *«Tenho arrumado a casa»*.
- `0fc266ba` (audio): «Eu já tenho lido duas vezes» — agramatical, además sin objeto.

Detalle que agrava: **en los cuatro casos de traducción la forma correcta ya estaba en el ítem, como
`acceptedAlternatives`** («Ela pôs os livros na mesa», «Escrevi três cartas esta semana», «Fiz a
lição», «Já arrumei a casa»). La clave premia la mala y ofrece la buena como premio de consolación.

### 3. El infinitivo pessoal, que es de lo que va b7-l1, está mal enseñado (6 ERROR + 3 DUDA)

Dos flashcards con audio enseñan formas que no existen:

- `03b92017` — back locutado: **«falar eu»**. La forma de 1.ª singular ES «falar» (desinencia cero);
  «eu» es el sujeto y va delante («é importante **eu** falar»).
- `99790b7d` — back locutado: **«falar nós»**. Aquí ya no hay excusa: la forma es **«falarmos»**.
  El ejemplo repite el invento («Falar nós português ajuda muito»). Es el peor ítem de la cola.

Y tres ensamblados agramaticales:

- `04e64749`: «**Desistir** vocês…» — con sujeto plural explícito el infinitivo flexiona:
  «Desistirem vocês».
- `cc28fb3f`: «É fundamental **que tomares** decisões» — tras «que» sólo cabe el conjuntivo
  («que tomes»); el infinitivo flexionado se usa **sin** «que». La glosa remata: «Ambos son
  correctos en PT». No lo son en este molde.
- `51820100`: «**Poder ela sair** mais cedo, não sei» — eso se dice «Não sei se ela pode sair mais
  cedo».
- `949e50b1`: orden invertido, «É importante **falar eu** com ela». El corpus sólo da el sujeto
  DELANTE: «para **eu** confessar», «para **eu** explicar a minha culpa», «para **eu** poder dizer».

### 4. Las glosas `esContrast` — la clase #1 de la cola 6, viva y coleando

**37 de los 100 ítems llevan corrección de `esContrast`/`explanationEs`** (28 dictaminados ERROR, 9
DUDA). En 16 de ellos la glosa es el ÚNICO fallo: el ejercicio funciona y lo que miente es la pista.
Se repite el patrón exacto que describió la cola 6. Muestrario:

- **Falsedad morfológica.** `da209019`: «'Poner' en subjuntivo: pt 'preste' (irregular) vs es
  'ponga'». «Preste» es el conjuntivo de **prestar**, y es regular. · `832480f1`: «O particípio de
  'matar' é irregular: 'morto', não 'matado'». Falso: doble participio, y el corpus del repo trae
  «matado» con auxiliar tres veces («se elle o tivesse **matado**», «accusado de haver **matado** em
  Lisboa o lavrador», «esta excitação a teria **matado**»).
- **Se contradice con su propio ítem.** `04350a8e` dice que el español pide «sin + infinitivo
  compuesto» cuando el target del propio ejercicio es «Sin QUE yo lo percibiera». · `42c051e1` dice
  que el portugués rige «EM + gerundio» y su frase lleva infinitivo. · `79076c11` dice «sin coma tras
  'possível'» y el target y la alternativa llevan esa coma.
- **Se contradice con otro ítem del mismo lote.** `c3039dc6` enseña que «início» lleva tilde donde
  el español no la lleva; `ea82416e` enseña que «início» «mantiene la misma forma». Ambos en b6.
- **Falsedad simple.** `4ffb57cc`: «el gerundio portugués no lleva acento, a diferencia del español
  'estudiando'». El gerundio español tampoco lleva acento.
- **Idioma equivocado.** `ef069ef4` está **en inglés** («Both languages use subjunctive after…»),
  herencia del material del que este corpus siempre se sospechó. Otras siete están en portugués.
- **Circular o vacía.** `fab76824`: «No confundas con 'talvez' que en español también es 'quizás'»
  (avisa de no confundir «talvez» con «talvez»). · `3e112d47`: «Revisar em português é 'revisar',
  diferente de 'revisar' em espanhol». · `fda162e1`: «(misma forma), pero la conjugación es
  diferente».

### 5. «talvez»: la asimetría sigue sin enseñarse (3 ítems)

Ningún ítem la niega explícitamente, como pasó en la cola 6 — pero `ea82416e` dice que «talvez»
«puede ir antes o después del verbo» sin más, y `71807a5f` afirma en bloque que «talvez exige
conjuntivo». Antepuesto sí; **pospuesto lleva indicativo** («Ele vem, talvez»). `fab76824` tenía el
sitio perfecto para decirlo y lo gasta en la frase circular. Los tres llevan corrección propuesta.
En cambio `31da58c8` (error_correction, «Talvez ele está» → «esteja») está impecable.

### 6. Ítems no ganables o con la clave rota (5)

- `1154b88e` (**no ganable**): `ListeningCard` decide con `opt === data.answer` y la respuesta
  «arrumando o quarto» no está entre las opciones, que dicen «arrumando **el** cuarto». Es el tercer
  no-ganable en tres colas (cola 5, cola 6, y éste).
- `d62089ce` (**no ganable**): «Ela pensava ___ início de tudo» — ninguna de las cuatro
  preposiciones da frase válida; hace falta la contracción «no».
- `e453e88d` (**clave contra enunciado**): el ítem manda usar «(desenvolver)» y la respuesta
  canónica es «tenham»; quien obedece acierta por alternativa y luego lee «Respuesta correcta:
  tenham».
- `c2f0740c` y `51820100` (**dos huecos, un solo input**): `FillBlankCard` compara la respuesta
  contra CUALQUIER hueco y sólo revela `blanks[0]`. El ítem no se puede contestar entero.

### 7. Ensamblados sin verbo (4) — la clase de la cola 6, otra vez

- `b82f612d`: «É provável que tudo ___ do início do projeto» + clave «de» = «tudo **de do** início».
  El verbo «depender», que la tarjeta anuncia, no está en la frase.
- `4aebcaf6`: la tarjeta dice «Verbo: gostar» y la frase es «**Estou** ___ aprender português» →
  «Estou **de** aprender português».
- `1be8b94d`: «Eu já ___ o jogo!» + «ganho» = participio suelto sin auxiliar.
- `832480f1`: «O sol ___ muitas plantas» + «morto» = «O sol morto muitas plantas».

### 8. Basura de generación que llegó al alumno (6)

`863fc5a6`: el ejemplo dice **«Já we've comido naquele restaurante»** — inglés sin traducir.
`c6c330df`: la alternativa aceptada es **«Arrumiei»**, forma que no existe (arrumar → arrumei), y
`TranslationCard` da las alternativas por buenas. `8ed1afe5`: el español dice «Seguía» (singular) y
el portugués meta «Seguiam» (plural). `e4dbc397`: «**suspio**» por «suspiro», y el español meta
—que hay que teclear letra por letra— es agramatical: «*Aprieta* la vida de alguien es pesado».
`c5ffec65`: el audio dice «**Tenho prazer em dizer** que o relatório está carregado de erros
importantes» (nadie se congratula de los errores) y las opciones mezclan español y portugués.
`6b92cf03`: el target español es calco puro, «Él tiene placer en ayudar a los demás».

### 9. Reparto: brasileño dentro de la base europea (6)

`d3dc059d`, `ee56978e` y `f1903f8d` llevan en el **front visible** la instrucción «(traduce al
PT-BR)». `e3d20fd0` enseña que 'llamada' se dice «ligação» — brasileño; en Portugal es «uma
chamada» o «um telefonema», y Priberam no registra ese sentido en el sustantivo «ligação» (sí en el
verbo «ligar»). `970cf7a9` usa «a lição» por 'los deberes' («os trabalhos de casa»). `42c051e1`
escribe «com **meus** estudos», sin artículo.

### 10. Flashcards muertas (4)

`c3039dc6` (front «início (substantivo)» / back «início»), `d0091d78` («suspirar» / «suspirar — ele
suspirava»), `dd01dacf` («vaga (adjetivo)» / «vago / vaga»), `e3d20fd0` («ligação (substantivo)» /
«ligação»). Front y back en portugués, en dos casos idénticos: no hay nada que traducir. Corrijo el
`front` al español para no obligar a regenerar audio, pero conste que `d0091d78` y `dd01dacf` son
pares cognados (suspirar/suspirar, vago/vago) y siguen valiendo poco: merecen sustitución.

## Clase que NO puse en el dictamen ítem a ítem, y por qué

**`sourceLang`/`targetLang` dicen `pt-br` en la base europea.** Afecta a los 24+24 pares de b7 y a
los 40+40 de b6 — 48 de los 100 ítems de esta cola. La tarjeta se lo enseña al alumno tal cual
(«PT-BR → ES»). Es un incumplimiento real del contrato, pero es **legado uniforme de todo el corpus**
(b1-b8 lo tienen así; sólo b10, más nuevo, usa `pt`, y b1 tiene 6 ítems con `pt-pt` que arregló
alguna cola anterior). Convertir eso en 48 dictámenes ahogaría la señal de esta cola y además se
arregla mejor por script en una pasada: `sed` de `"sourceLang": "pt-br"` → `"pt-pt"` cuando el texto
portugués ya esté validado como europeo. Lo dejo aquí, medido, y no lo cuento como error por ítem.

Segunda cosa cosmética que tampoco cuento: en `verb_preposition`, unos ítems usan `"—"` para «sin
preposición» y otros `"∅"` (`b75d20c5`, `d635cdd6`, `f8056a17`). `VerbPrepositionCard` sólo rotula
`"—"` como «(sin preposición)»; el `∅` se pinta como un glifo suelto. Un `sed` lo arregla.

## Qué está BIEN (con datos)

- **Las 13 tarjetas de conjugación de b6 no tienen un solo fallo** (índices 29-41): presente do
  conjuntivo (fale, seja, tenham, faça, vá), imperfeito (falasse, tivesse, fosse, fizesse) y futuro
  (falar, tiver, for, fizer), con las pistas españolas correctas y dando las dos variantes -ra/-se
  donde toca. Es el molde más sano del corpus y el único bloque de esta cola que se puede sellar
  entero.
- **El régimen preposicional europeo está bien puesto**: `d7916162`, `f8056a17` y `eedbf026` usan
  «precisar **DE** + infinitivo» («precisávamos de descansar»), que es justamente lo que Brasil
  pierde. Ningún ítem cae en el calco.
- **`96a445f6` («É melhor sairmos agora») es el mejor ítem de la cola**: infinitivo pessoal de 1.ª
  plural bien flexionado, y su molde está atestado literal en Eça, en el corpus del propio repo: «É
  melhor **irmos** para lá». `d8371e83` («É melhor falares mais devagar») es igual de sólido.
- **Tres ítems sí usan bien el compuesto** (`2a9da328` «tem visto… este mês», `7bb869a1` «tenho
  feito… todos os dias», `abae281d` «tem ganho… este ano») — o sea que la regla se conocía cuando se
  escribió el bloque, lo que hace más raro el desastre de los otros cinco. `abae281d` además usa el
  participio corto europeo «tem ganho», no «ganhado».
- **`31da58c8`** (talvez → esteja) y **`db27b3bf`** (futuro do conjuntivo de ser = «for») están
  impecables, explicación incluida.
- **La frase portuguesa de `42f4d894`, «Depois de o ver», es europea de manual** por la posición del
  clítico (Brasil diría «depois de vê-lo» o «depois de ver ele»). El error está sólo en la glosa,
  que llama sujeto a un objeto.
- **El léxico grueso está limpio.** Barrida la cola entera con los marcadores del gate: 0 «você»
  singular, 0 ônibus/celular/trem/contato/planejar/café da manhã/trema/-éia. Los 3 «vocês» son
  legítimos (es la 2.ª del plural normal en Portugal). Lo que falla en este corpus no es el
  vocabulario: es la sintaxis, el aspecto verbal y las glosas.
- **b11 aguanta el escrutinio**: 3 de 4 verificados contra fuente. Priberam confirma que «pronto» no
  tiene acepción 'cedo' (sólo «prontamente, rapidamente») y que «grifo» no tiene acepción 'torneira';
  Ciberdúvidas 29108 existe y se titula, literalmente, «Fazer um curso» = «tirar um curso», que es lo
  que la glosa afirma. El único fallo es de citación, no de lengua (ver ítem 0).

## Nota sobre las citas de corpus de este informe

Todas las atestaciones que cito están comprobadas en el texto de `lib/data/languages/pt/lecturas/`,
no de memoria. Y a la inversa: la única cita que este lote traía —la de «logro» en `b2c2-gj-l9-02`—
resultó ser **de otro autor** (Teófilo Braga, no Eça) y **no literal**. Es exactamente el fallo
contra el que avisaba el encargo, y esta vez lo cometió el material, no el revisor.

## Formato del JSON adjunto

`informe-cola7.json`: 100 objetos en el mismo orden que `cola7.json`. Los valores `de` se extrajeron
por script directamente de `lib/data/languages/pt/blocks/*.json` con el dot-path indicado, así que
casan carácter a carácter. En los campos que son listas (`data.blanks`, `*.alternatives`,
`data.options`, `data.acceptedAlternatives`) el `de` y el `a` van como **array JSON**, no como
cadena. El único `(ausente)` es `esContrast` de `dd01dacf`, que no existe hoy.

---

# Dictamen ítem a ítem

Índices en el orden de `cola7.json`.

### b11.json

**0. `b2c2-gj-l9-02` — ERROR**  
El dictamen lingüístico es correcto —Priberam da para «logro» «plano ou história falsa para enganar», y el sentido 'lucro' va marcado [Antigo]—, pero la cita está falsificada dos veces. (1) No es literal: el único «logro» de las 224 lecturas dice «para que o riso o defendesse do logro que esperava», no «o riso defendia-o do logro que esperava». (2) No es de Eça: es de TEÓFILO BRAGA, «A adega de Funck» (contos-phantasticos--a-adega-de-funck.json:21). Una atribución falsa entre comillas delante del alumno es exactamente lo que esta cola tiene que cazar. La segunda cita sí resiste: «não logrou esta esperança» está verbatim en Eça, «O Defunto» (o-defunto.json:22).  
<sub>campos: `data.explanationEs`</sub>

**1. `b2c2-gj-l9-04` — OK**  
«Tirar um curso» es colocación europea corriente y el verdict=true es correcto. Verificada también la fuente que cita: Ciberdúvidas 29108 existe y se titula «Fazer um curso» = «tirar um curso», que es justo lo que la glosa afirma. Nada que tocar.

**2. `b2c2-gj-l9-06` — OK**  
Verificado en Priberam: «pronto» sólo tiene sentido adverbial «prontamente, rapidamente» — ninguna acepción 'cedo'. En el corpus del repo las 4 apariciones de «pronto» son adjetivo o interjección, ninguna temporal. El resto de la frase («apanhei o autocarro») es europeo impecable, como afirma la glosa.

**3. `b2c2-gj-l9-08` — OK**  
Verificado en Priberam: grifo1 = enigma; grifo2 = animal fabuloso / abutre / caracol de cabelo; grifo3 = letra inclinada. Ninguna acepción 'torneira'. El corpus del repo atesta «torneira» (a-cidade-e-as-serras) para el grifo del agua. Item correcto.


### b6.json

**4. `b27edcea` — OK**  
«Eu gostaria que ela visse a exposição na galeria» — imperfeito do conjuntivo correcto tras condicional. Sin objeciones.

**5. `b75d20c5` — OK**  
«Eu gosto de café pela manhã» es europeo: «pela manhã» tiene 38 atestaciones en el corpus del repo (Eça), frente a 52 de «de manhã» — no es brasileñismo. Único reparo cosmético: la opción «∅» se pinta literal (VerbPrepositionCard sólo rotula «—» como «(sin preposición)»).

**6. `b82f612d` — ERROR**  
Hueco sin verbo: la frase es «É provável que tudo ___ do início do projeto» y la clave mete una PREPOSICIÓN, así que el alumno que acierta lee «É provável que tudo de do início do projeto». El verbo «depender» (que la tarjeta anuncia) no está en ninguna parte y «do» ya lleva la preposición contraída. Misma clase que los huecos sin verbo de la cola 6.  
<sub>campos: `data.sentence`, `data.options`, `data.answer`, `esContrast`</sub>

**7. `c2f0740c` — ERROR**  
Dos huecos y un solo campo de texto: FillBlankCard compara la respuesta contra CUALQUIER hueco y sólo revela blanks[0], así que el ítem no se puede contestar entero y «é» también se da por bueno para el primer hueco. Además la glosa está escrita en portugués en un campo que es la pista para hispanohablantes.  
<sub>campos: `data.sentence`, `data.blanks`, `esContrast`</sub>

**8. `c3039dc6` — ERROR**  
Flashcard muerta: front «início (substantivo)» y back «início» — ambos en portugués y ademáis idénticos; no hay nada que traducir ni que recordar. Y la glosa atribuye a PT-BR («En PT-BR se escribe con acento agudo») una tilde que el portugués europeo lleva exactamente igual; encima contradice a la glosa de ea82416e (índice 21), que afirma que «início» «mantiene la misma forma» que el español.  
<sub>campos: `data.front`, `esContrast`</sub>

**9. `d0091d78` — ERROR**  
Flashcard muerta: front «suspirar» y back «suspirar — ele suspirava», los dos en portugués. El alumno no traduce nada. Corrijo el front al español para que la tarjeta funcione sin tocar el audio, pero conste que el par sigue siendo de valor casi nulo (suspirar/suspirar son idénticos): merece sustitución en un lote futuro.  
<sub>campos: `data.front`</sub>

**10. `d3dc059d` — ERROR**  
La instrucción visible manda traducir «al PT-BR» en un ítem cuya base es, por contrato, la europea. El back es portugués correcto y no hace falta tocarlo (ni regenerar audio); lo que sobra es la etiqueta.  
<sub>campos: `data.front`</sub>

**11. `d62089ce` — ERROR**  
Ítem no ganable y agramatical: «Ela pensava ___ início de tudo com frequência» con la clave «em» da «pensava em início de tudo», que ningún portugués acepta — hace falta la contracción «no início». Ninguna de las cuatro opciones (em/de/sobre/a) produce una frase bien formada.  
<sub>campos: `data.sentence`</sub>

**12. `d635cdd6` — OK**  
«Ela pensa em mudar de emprego» — régimen correcto y frase natural. Sólo el glifo «∅» de la cuarta opción se pinta literal en la tarjeta.

**13. `d7916162` — OK**  
«Nós precisávamos de descansar do trabalho» es justamente la forma EUROPEA (en Brasil se omite el «de» ante infinitivo). Buen ítem.

**14. `da209019` — ERROR**  
La glosa afirma una falsedad morfológica: «preste» no es el conjuntivo de «pôr» ni es irregular — es el presente do conjuntivo de «prestar», perfectamente regular, y el español hace lo mismo con «prestar → preste». El ejercicio en sí («prestar atenção às dúvidas») es correcto.  
<sub>campos: `esContrast`</sub>

**15. `dd01dacf` — ERROR**  
Flashcard muerta: front «vaga (adjetivo)» y back «vago / vaga», ambos en portugués. Además el front etiqueta «vaga» como adjetivo sin avisar de que en portugués «vaga» es también sustantivo (plaza libre, ola). Igual que en 9: el par es cognado y de valor bajo aun arreglado.  
<sub>campos: `data.front`, `esContrast`</sub>

**16. `e3d20fd0` — ERROR**  
Brasileñismo léxico metido en la base europea, y encima enseñado como norma: la glosa dice «en español sería 'llamada', pero en PT se usa 'ligação'». En Portugal una llamada es «uma chamada» o «um telefonema»; «fazer uma ligação» por 'llamar' es brasileño. Priberam no registra el sentido 'llamada telefónica' bajo el sustantivo «ligação» (sí bajo el verbo «ligar» = telefonar). Y encima la tarjeta está muerta (front «ligação (substantivo)» / back «ligação»).  
<sub>campos: `data.front`, `esContrast`</sub>

**17. `e453e88d` — ERROR**  
La clave contradice al enunciado: el ítem da el verbo entre paréntesis, «(desenvolver)», y la respuesta canónica es «tenham». El alumno que obedece y escribe «desenvolvam» acierta por alternativa, pero acto seguido lee «Respuesta correcta: tenham». Basta invertir clave y alternativa.  
<sub>campos: `data.blanks[0].answer`, `data.blanks[0].alternatives`, `esContrast`</sub>

**18. `e4dbc397` — ERROR** · ♻︎ **rehacer audio**  
Los dos lados están rotos. En portugués, «suspio» no existe (errata por «suspiro»). En español, «Aprieta la vida de alguien es pesado» es agramatical: el sujeto pide infinitivo, «Apretar la vida de alguien es pesado» — y ese target es lo que el runner exige teclear letra por letra. Aun corregido, el sentido de la frase sigue siendo opaco (¿qué es «apertar a vida de alguém»?): recomiendo sustituirla entera en un lote futuro.  
<sub>campos: `data.source`, `data.target`, `esContrast`</sub>

**19. `e8c9ae6b` — OK**  
«Eu esperava que ele chegasse cedo» — correlación de tiempos correcta y «cedo» es la palabra europea para 'temprano'. La alternativa «cedinho» es coloquial pero legítima.

**20. `ea7f1371` — DUDA**  
«raíz cambia completamente» es una exageración (t- → tenh-, no hay supleción), y la glosa desaprovecha el contraste útil: el español hace exactamente lo mismo con «tener → tenga», así que aquí no hay dificultad nueva salvo la 1.ª del plural. El ítem en sí es correcto.  
<sub>campos: `esContrast`</sub>

**21. `ea82416e` — ERROR**  
Glosa con dos fallos. (1) Dice que «talvez» «puede ir antes o después del verbo» como si diera igual, y calla la asimetría que cuenta: antepuesto exige CONJUNTIVO (talvez… pareça, que es lo que hace este ítem), pospuesto lleva INDICATIVO («Tudo parece vago, talvez»). (2) Afirma que «início» mantiene la misma forma que el español, cuando lleva una tilde que el español no lleva — y contradice frontalmente a la glosa de c3039dc6 (índice 8), que enseña justo lo contrario.  
<sub>campos: `esContrast`</sub>

**22. `ee56978e` — ERROR**  
La instrucción visible manda traducir «al PT-BR» en un ítem de base europea. El back («É possível que ele saiba a resposta») es correcto y no se toca, así que no hace falta audio nuevo.  
<sub>campos: `data.front`</sub>

**23. `ef069ef4` — ERROR**  
La glosa está en INGLÉS («Both languages use subjunctive after…») en el campo que es la pista para hispanohablantes: herencia del material en inglés del que se sospecha en este corpus. El contenido es cierto, el idioma no.  
<sub>campos: `esContrast`</sub>

**24. `f1903f8d` — ERROR**  
Igual que 10 y 22: «(traduce al PT-BR)» dentro de la base europea. El back es correcto y queda intacto.  
<sub>campos: `data.front`</sub>

**25. `f8056a17` — OK**  
«Nós precisamos de ajuda para preencher o formulário» — régimen correcto y léxico europeo («preencher um formulário»). Sólo el glifo «∅».

**26. `fab76824` — ERROR**  
Glosa circular que no dice nada: «No confundas con 'talvez' que en español también es 'quizás'» — avisa de no confundir «talvez» con «talvez». El sitio pedía justamente la regla que este bloque enseña.  
<sub>campos: `esContrast`</sub>

**27. `fc13ad89` — DUDA**  
«Embora eu aquecesse a sopa, ela ficou fria» no es incorrecto, pero con un hecho puntual y acabado en la principal («ficou») el portugués prefiere el compuesto: «Embora eu tivesse aquecido / tenha aquecido a sopa». Aparte, la glosa está redactada en portugués en un campo para hispanohablantes.  
<sub>campos: `esContrast`</sub>

**28. `fda162e1` — ERROR**  
Glosa autocontradictoria en doce palabras: «En español sería 'practique' (misma forma), pero la conjugación es diferente». O es la misma forma o es diferente. Lo único que cambia es la ortografía del infinitivo (practicar / praticar); la desinencia del conjuntivo es idéntica.  
<sub>campos: `esContrast`</sub>

**29. `95e5ca55` — OK**  
Presente do conjuntivo de falar/eu: forma y pista en español correctas. Verificado contra el paradigma estándar.

**30. `b45fa0f3` — OK**  
Presente do conjuntivo de ser/eu: forma y pista en español correctas. Verificado contra el paradigma estándar.

**31. `5c846c71` — OK**  
Presente do conjuntivo de ter/eles: forma y pista en español correctas. Verificado contra el paradigma estándar.

**32. `cf1dbde8` — OK**  
Presente do conjuntivo de fazer/eu: forma y pista en español correctas. Verificado contra el paradigma estándar.

**33. `ec38f0d2` — OK**  
Presente do conjuntivo de ir/eu: forma y pista en español correctas. Verificado contra el paradigma estándar.

**34. `69faec04` — OK**  
Imperfeito do conjuntivo de falar (eu): forma correcta y la pista da las dos variantes españolas (-ra/-se), que es lo que hay que dar.

**35. `3cbc3aa0` — OK**  
Imperfeito do conjuntivo de ter (eu): forma correcta y la pista da las dos variantes españolas (-ra/-se), que es lo que hay que dar.

**36. `739d4742` — OK**  
Imperfeito do conjuntivo de ser (eu): forma correcta y la pista da las dos variantes españolas (-ra/-se), que es lo que hay que dar.

**37. `6b92f74f` — OK**  
Imperfeito do conjuntivo de fazer (eu): forma correcta y la pista da las dos variantes españolas (-ra/-se), que es lo que hay que dar.

**38. `61332de7` — DUDA**  
La forma («falar») y la pista son correctas, pero «No existe en español» es falso en rigor: el español TIENE futuro de subjuntivo («hablare», «fuere»), hoy fosilizado en refranes y lenguaje jurídico. Decir que no existe es la simplificación de manual; para un curso que llega a C2 es preferible la verdad, que además le da al alumno un ancla mnemotécnica.  
<sub>campos: `esContrast`</sub>

**39. `d46bc441` — OK**  
Futuro do conjuntivo, ter → tiver: correcto, y la pista en español («cuando yo…») es la traducción adecuada del uso.

**40. `307fac3e` — OK**  
Futuro do conjuntivo, ser → for: correcto, y la pista en español («cuando yo…») es la traducción adecuada del uso.

**41. `ecc2b2aa` — OK**  
Futuro do conjuntivo, fazer → fizer: correcto, y la pista en español («cuando yo…») es la traducción adecuada del uso.

**42. `31da58c8` — OK**  
«Talvez ele está» → «Talvez ele esteja»: la corrección es justa (talvez ANTEPUESTO exige conjuntivo) y la explicación no promete de más. Uno de los mejores ítems del bloque.

**43. `71807a5f` — DUDA**  
La clave es correcta (talvez es la única de las tres que rige conjuntivo), pero la explicación repite la simplificación peligrosa de este bloque: «talvez» sólo exige conjuntivo ANTEPUESTO al verbo. Pospuesto lleva indicativo, y el alumno que memorice «talvez = conjuntivo» producirá «*Ele vem, talvez venha».  
<sub>campos: `data.explanationEs`</sub>

**44. `db27b3bf` — OK**  
«for» es el futuro do conjuntivo de ser y la explicación distingue bien los tres distractores (será / seja / for). Correcto.

**45. `b9809b25` — DUDA**  
La regla que enseña (achar que en afirmativo → indicativo) es correcta, pero el ejemplo escogido no es la manera portuguesa de decirlo: para 'tener razón' el corpus del repo da 21 «tem razão» frente a 1 solo «está certo», y esa única aparición significa 'estar seguro' («Vossê está certo d'isso?»). Cambiando el verbo el ítem enseña lo mismo con portugués idiomático.  
<sub>campos: `data.question`, `data.options`, `data.explanationEs`</sub>


### b7.json

**46. `03b92017` — ERROR** · ♻︎ **rehacer audio**  
«falar eu» NO es una forma verbal. El infinitivo pessoal de 1.ª del singular de «falar» ES «falar» (desinencia cero); «eu» es el sujeto, y en portugués va DELANTE («é importante eu falar»), no pegado detrás. La tarjeta locuta esa forma inventada y encima está muerta (front y back los dos en portugués). Es el mismo error que 99790b7d (índice 84), donde ya no hay excusa de desinencia cero.  
<sub>campos: `data.front`, `data.back`, `data.example`, `esContrast`</sub>

**47. `04350a8e` — ERROR**  
La glosa es falsa y contradice a su propio ítem: dice que «el español requiere 'sin + infinitivo compuesto'», cuando el target que el propio ejercicio da es «Sin QUE yo lo percibiera» — subordinada con subjuntivo, que es justo lo que el español necesita porque no puede poner sujeto al infinitivo. La frase portuguesa («Sem eu perceber») es europea impecable.  
<sub>campos: `esContrast`</sub>

**48. `04c90f64` — ERROR**  
«Ele ficou pensando» es la construcción brasileña. En portugués europeo es «ficou A PENSAR» — el corpus del repo lo atesta a manos llenas («ficou a olhar estupidamente a parede», «ficou a abanar-se», «ficou a susurrar»). El gate de variante del propio proyecto marca el gerundio perifrástico como error de base.  
<sub>campos: `data.sentence`, `data.blanks[0].answer`, `data.blanks[0].alternatives`</sub>

**49. `04e64749` — ERROR**  
Con sujeto plural explícito el infinitivo pessoal DEBE flexionar: «Desistirem vocês». «Desistir vocês» es agramatical, y la glosa lo canoniza («'Desistir vocês' = 'Que ustedes desistieran'»). De paso, la coma entre sujeto y verbo sobra.  
<sub>campos: `data.sentence`, `data.blanks[0].answer`, `data.blanks[0].alternatives`, `esContrast`</sub>

**50. `0e2d8fc1` — OK**  
«Eu gosto de café de manhã» — régimen correcto, léxico europeo, distractores razonables. (Está archivado en la lección del infinitivo pessoal, con la que no tiene nada que ver; eso es cuestión de currículo, no de lengua.)

**51. `0fc266ba` — ERROR** · ♻︎ **rehacer audio**  
El texto locutado es agramatical: «Eu já tenho lido duas vezes» junta el pretérito perfeito COMPOSTO —que en portugués significa repetición o duración— con «já … duas vezes», que cierra la cuenta; y encima le falta el objeto. Un portugués dice «Eu já o li duas vezes». Añádase que la glosa es incoherente («'Vale a pena' + infinitivo significa 'vale la pena'. Não se dice 'vale a pena fazer'»): afirma y niega lo mismo, y está a medias en portugués.  
<sub>campos: `data.audioText`, `esContrast`</sub>

**52. `1154b88e` — ERROR**  
Ítem NO GANABLE: ListeningCard decide con `opt === data.answer`, y la respuesta «arrumando o quarto» no figura entre las opciones (que dicen «arrumando el cuarto», en español). Pulses lo que pulses, fallas. Encima las cuatro opciones mezclan portugués y español. (El audio en sí es correcto: «arrumar o quarto» es europeo — el corpus trae «arrumava no quarto uns moveis», «arrumações de maletas».)  
<sub>campos: `data.options`, `data.answer`</sub>

**53. `1be8b94d` — ERROR**  
Doble avería. (1) «Eu já ganho o jogo!» es agramatical: participio suelto, sin auxiliar — lo que se lee es el presente 'yo ya gano el juego'. (2) La clave acepta «ganhado» como alternativa correcta justo cuando la glosa declara que lo correcto es «ganho»: el ejercicio premia el error que dice combatir. (Matiz: «ganhado» no es inventado —el corpus trae «tinha ganhado Escossez»— pero en portugués europeo de hoy con ter/haver se dice «tenho ganho».)  
<sub>campos: `data.sentence`, `data.blanks[0].alternatives`, `esContrast`</sub>

**54. `1df4e6e3` — DUDA**  
«Ele vem tendo problemas» se entiende y la perífrasis vir + gerundio existe, pero en el corpus europeo del repo aparece casi siempre con verbos de movimiento («vem trotando a vacca», «vinha chorando a filha»). Para 'lleva teniendo problemas' el portugués de Portugal dice «tem tido problemas desde que chegou». Corrección propuesta, pero saca el ítem de la lección del gerundio: decidan ustedes.  
<sub>campos: `data.sentence`, `data.blanks[0].answer`</sub>

**55. `2a9da328` — OK**  
«Ela tem visto muitos filmes este mês» es el uso correcto del pretérito perfeito composto: cantidad abierta y periodo aún en curso. Es, junto con abae281d, el ítem que sí enseña bien el contraste con el español.

**56. `30edcef4` — DUDA**  
El ejercicio de régimen es correcto («desistiu de tentar»). La glosa, en cambio, presenta «desistir eu» como si fuera una forma flexionada: en 1.ª del singular el infinitivo pessoal no flexiona. Es la confusión que produjo los ítems rotos 03b92017 y 99790b7d.  
<sub>campos: `esContrast`</sub>

**57. `330cdc48` — OK**  
«Sempre que possível, sigo em frente» es portugués corriente y la traducción española es aceptable. Sin objeciones.

**58. `356e7362` — ERROR** · ♻︎ **rehacer audio**  
El target enseña el calco que más daño hace al hispanohablante: «Ela tem posto os livros na mesa» NO traduce «ha puesto». El compuesto portugués es iterativo/durativo ('ha estado poniendo'); para un hecho puntual va el simple. La propia alternativa aceptada («Ela pôs…») es la traducción correcta, o sea que la clave premia la mala. Corrijo por el lado que salva la lección del participio: hago iterativa la frase española.  
<sub>campos: `data.source`, `data.target`, `data.acceptedAlternatives`</sub>

**59. `3e112d47` — ERROR**  
«Nós estamos revisando» es brasileño; el gate de variante del propio repo lo marca como error ('gerundio con estar' → «estar a + infinitivo»). El europeo es «estamos a rever os documentos» (corpus: «estamos a bater o pouco trigo», «estou a ler-lhe na alma»). Además la alternativa «checando» es anglicismo brasileño, y la glosa no dice nada: «Revisar em português é 'revisar', diferente de 'revisar' em espanhol».  
<sub>campos: `data.sentence`, `data.blanks[0].answer`, `data.blanks[0].alternatives`, `esContrast`</sub>

**60. `41238d65` — DUDA**  
«Ele recomenda eu desistir» es forzado en portugués europeo: con verbos de influencia se abre subordinada («recomenda que eu desista») o se usa «aconselha-me a desistir». Lo que sí sobra es que la glosa lo canonice diciendo «En portugués se dice…». Corrijo sólo la glosa para no rehacer audio.  
<sub>campos: `esContrast`</sub>

**61. `42c051e1` — ERROR**  
Dos fallos. (1) «com meus estudos» sin artículo es marca brasileña: en Portugal, «com OS meus estudos». (2) La glosa dice que el portugués «requiere EM + gerundio» y el propio ítem lleva infinitivo («em seguir»): la glosa contradice a su ejercicio y, de propina, enseña una regla inexistente.  
<sub>campos: `data.sentence`, `esContrast`</sub>

**62. `42f4d894` — ERROR**  
La glosa analiza mal su propio ejemplo. En «depois de o ver», la «o» es el CLÍTICO OBJETO ('verlo'), no el sujeto de un infinitivo pessoal — que aquí ni siquiera está flexionado. Presentarlo como caso de infinitivo pessoal induce al alumno a leer «o» como sujeto. La forma que sí equivale al infinitivo compuesto español es la alternativa ya aceptada, «depois de o ter visto» (el corpus trae «depois de a ter despido», «depois de a ter desprendido»). La frase portuguesa está bien y es europea de manual por la próclise al infinitivo.  
<sub>campos: `esContrast`</sub>

**63. `4aebcaf6` — ERROR**  
A la frase le falta el verbo del ejercicio: la tarjeta anuncia «gostar» y la frase dice «Estou ___ aprender português», de modo que la clave «de» produce «Estou de aprender português», que no es portugués. Misma clase que los huecos sin verbo de la cola 6.  
<sub>campos: `data.sentence`</sub>

**64. `4ffb57cc` — ERROR**  
Dos fallos. (1) «Eu estou estudando» es brasileño; el europeo es «estou A ESTUDAR» (y el gate del repo lo marca como error de base). (2) La glosa es falsa: dice que el gerundio portugués no lleva acento «a diferencia del español 'estudiando'» — el gerundio español tampoco lo lleva. Ninguno de los dos se acentúa.  
<sub>campos: `data.sentence`, `data.blanks[0].answer`, `esContrast`</sub>

**65. `51820100` — ERROR**  
Tres averías en un ítem. (1) Dos huecos con un solo campo de texto: FillBlankCard sólo revela blanks[0] y acepta como buena cualquier respuesta que case con cualquier hueco. (2) La alternativa del segundo hueco es «querer sair», que va donde tiene que ir el SUJETO. (3) Reconstruida con la clave, «Poder ela sair mais cedo, não sei» no es portugués: eso se dice «Não sei se ela pode sair mais cedo». Propongo un molde de un solo hueco que sí enseñe el infinitivo con sujeto explícito.  
<sub>campos: `data.sentence`, `data.blanks`, `esContrast`</sub>

**66. `5406568e` — ERROR** · ♻︎ **rehacer audio**  
«Tenho escrito três cartas esta semana» choca consigo mismo: el compuesto portugués expresa repetición sin cuenta cerrada, y «três cartas» la cierra. Un portugués dice «Escrevi três cartas esta semana» — que es, otra vez, la alternativa aceptada y no la clave. Corrijo por el lado español para que el ítem siga enseñando el compuesto.  
<sub>campos: `data.source`, `data.target`, `data.acceptedAlternatives`</sub>

**67. `5b7470d5` — ERROR**  
La pregunta nombra mal lo que el audio contrasta: lo que se opone a «ele ter desistido» es «que ele tenha desistido», que es CONJUNTIVO composto, no «infinitivo composto». Con esa terminología la pregunta es incontestable salvo por eliminación. La clave («cuando hay cambio de sujeto») sí es correcta. Nota aparte: «Espero ele ter desistido» es aceptable pero áspero; con «esperar» el portugués europeo tira de «que ele tenha desistido».  
<sub>campos: `data.question`</sub>

**68. `5dcb8dfc` — ERROR**  
«Estamos lutando» es brasileño: el europeo es «Estamos a lutar» (gate del repo: 'gerundio con estar' = error de base).  
<sub>campos: `data.sentence`, `data.blanks[0].answer`, `data.blanks[0].alternatives`</sub>

**69. `5dee3985` — OK**  
Front en español metalingüístico, back en portugués, participios correctos (visto / posto) y la advertencia sobre «posto ≠ puesto» es pertinente. Buena tarjeta.

**70. `6b92cf03` — ERROR**  
El español meta no es español: «Él tiene placer en ayudar a los demás» es calco literal del portugués, y TranslationCard exige teclear ese target letra por letra — o sea que el ítem sólo se aprueba escribiendo algo que ningún hispanohablante diría. El portugués de partida está bien («ter prazer em» está atestado en el corpus: «teve muito prazer em conhecer o sr. Clifford»).  
<sub>campos: `data.target`, `data.acceptedAlternatives`</sub>

**71. `73e19881` — DUDA**  
El ejercicio es correcto («Não vale a pena ficar triste por isso»). La glosa, escrita en portugués, es confusa: «A expressão é 'vale a pena' …, não 'hace falta' ni 'vale la pena'» puede leerse como que «vale la pena» no es el equivalente español, cuando lo es. Lo que quiere decir es que no se calque el artículo.  
<sub>campos: `esContrast`</sub>

**72. `79076c11` — ERROR**  
Dos fallos. (1) La glosa es falsa y se contradice con su propio ítem: dice que «sempre que possível» se escribe «todo junto» (son tres palabras) y «sin coma tras 'possível'», cuando el target y la alternativa del propio ejercicio llevan esa coma. (2) La alternativa aceptada «saio a correr de manhã» significa en portugués 'salgo corriendo' — el corpus lo confirma («via sair a correr levando teu filho») —, no 'salgo a correr'.  
<sub>campos: `data.acceptedAlternatives`, `esContrast`</sub>

**73. `79ce3558` — OK**  
«É importante falar com ele» — traducción exacta y natural. Sin objeciones.

**74. `7b5321b1` — OK**  
«Ela pensa em escrever um livro» — régimen correcto, y la advertencia sobre «pensar de» (opinión) es acertada.

**75. `7bb869a1` — OK**  
«Eu tenho feito a tarefa todos os dias» es uso legítimo del compuesto (repetición con «todos os dias») y el español lo refleja. Correcto.

**76. `82e31db5` — ERROR**  
Glosa rota: mezcla inglés («loaded/strong»), llama portuguesa a la palabra española («'cargado' en português») y acaba diciendo que es igual en español después de anunciar un contraste. Encima contradice a bffcf765 (índice 88), que sí afirma que hay diferencia de matices. Añado «forte» como alternativa porque el hueco está infradeterminado (quente, forte, bom valen igual de bien).  
<sub>campos: `esContrast`, `data.blanks[0].alternatives`</sub>

**77. `832480f1` — ERROR**  
Dos fallos graves. (1) «O sol morto muitas plantas no jardim» es agramatical: participio suelto sin auxiliar. (2) La glosa afirma una falsedad: «matar» tiene DOBLE participio — «matado» con ter/haver y «morto» con ser/estar. El corpus del propio repo lo atesta tres veces con auxiliar: «se elle o tivesse matado», «accusado de haver matado em Lisboa o lavrador», «esta excitação a teria matado». Y la clave acepta «matado» mientras la glosa lo declara incorrecto.  
<sub>campos: `data.sentence`, `data.blanks[0].answer`, `data.blanks[0].alternatives`, `esContrast`</sub>

**78. `863fc5a6` — ERROR**  
El ejemplo lleva inglés sin traducir: «Já we've comido naquele restaurante» — residuo de traducción automática, la misma clase de basura que este corpus arrastra. (El campo `example` no se pinta ni se locuta hoy, así que no hay audio que rehacer, pero es texto podrido dentro de la base.)  
<sub>campos: `data.example`</sub>

**79. `8ed1afe5` — ERROR** · ♻︎ **rehacer audio**  
Desajuste de número: el español dice «Seguía» (singular) y el portugués meta dice «Seguiam» (3.ª del plural). El alumno que traduzca bien falla, porque el target exigido está mal.  
<sub>campos: `data.target`</sub>

**80. `949e50b1` — ERROR** · ♻︎ **rehacer audio**  
Orden de palabras: el sujeto del infinitivo pessoal va DELANTE. El corpus del repo sólo trae ese orden — «para eu confessar», «para eu explicar a minha culpa», «para eu poder dizer». «É importante falar eu com ela» suena a traducción; lo portugués es «É importante eu falar com ela sobre isso».  
<sub>campos: `data.source`</sub>

**81. `9554a90b` — OK**  
«A vida útil deste equipamento é de cinco anos» / «La vida útil de este equipo es de cinco años» — traducción exacta en los dos sentidos. Correcto.

**82. `96a445f6` — OK**  
«É melhor sairmos agora» es el mejor ítem del bloque: infinitivo pessoal de 1.ª plural bien flexionado y con el molde exacto que atesta el corpus («É melhor irmos para lá», Eça).

**83. `970cf7a9` — ERROR** · ♻︎ **rehacer audio**  
Dos fallos. (1) «He hecho la tarea» es un hecho puntual y acabado: en portugués, «Fiz…», no «Tenho feito…» (la alternativa aceptada vuelve a ser la buena y la clave la mala). (2) «a lição» por 'los deberes' es brasileño; en Portugal son «os trabalhos de casa» («lição» es la lección que se da).  
<sub>campos: `data.target`, `data.acceptedAlternatives`</sub>

**84. `99790b7d` — ERROR** · ♻︎ **rehacer audio**  
«falar nós» no existe. El infinitivo pessoal de 1.ª del plural es «falarmos», y aquí, a diferencia del singular, la desinencia es visible: la tarjeta locuta una forma inventada y el ejemplo la repite («Falar nós português ajuda muito»). Es el error más grave del bloque, porque enseña justo al revés lo que la lección se llama.  
<sub>campos: `data.front`, `data.back`, `data.example`, `esContrast`</sub>

**85. `a8bb8161` — OK**  
Front en español, back en portugués, frase correcta: la flashcard está construida como debe. Comparte audio con 330cdc48 porque el texto portugués es el mismo — eso está bien, no es un choque.

**86. `abae281d` — OK**  
«A empresa tem ganho muito dinheiro este ano» es uso correcto del compuesto (duración abierta) y además emplea el participio corto europeo «ganho», no «ganhado». Buen ítem.

**87. `bbb6c2a0` — ERROR**  
«Ela está saindo» es brasileño; el europeo es «Ela está a sair com o namorado» (gate del repo: 'gerundio con estar' = error de base).  
<sub>campos: `data.sentence`, `data.blanks[0].answer`</sub>

**88. `bffcf765` — OK**  
«O café está carregado, prefiro mais suave» / «El café está cargado, prefiero más suave» — correcto en las dos lenguas, y la alternativa con «fuerte» está bien puesta.

**89. `c1ad509c` — DUDA**  
El ejercicio es correcto. La glosa, en cambio, está mal escrita: ««Vale a pena» se traducen estas tres palabras» no es una oración española, y el aviso final («no se dice 'vale a pena' en español») sólo se entiende si el lector adivina que habla del artículo.  
<sub>campos: `esContrast`</sub>

**90. `c5ffec65` — ERROR** · ♻︎ **rehacer audio**  
Dos fallos. (1) El texto locutado es absurdo: «Tenho prazer em dizer que o relatório está carregado de erros importantes» — nadie se congratula de que un informe esté lleno de errores; el alumno oye una frase que ningún portugués diría. (2) Las opciones mezclan español y portugués («Erros importantes» entre tres opciones españolas), lo que además delata la respuesta.  
<sub>campos: `data.audioText`, `data.options`, `data.answer`</sub>

**91. `c6c330df` — ERROR** · ♻︎ **rehacer audio**  
Dos fallos. (1) «Ya he arreglado la casa» es puntual: en portugués, «Já arrumei a casa», no «Tenho arrumado». (2) La primera alternativa aceptada, «Arrumiei», NO EXISTE (arrumar → arrumei), y TranslationCard da las alternativas por correctas: el ítem premia una forma inventada.  
<sub>campos: `data.target`, `data.acceptedAlternatives`</sub>

**92. `cc28fb3f` — ERROR**  
«É fundamental que tomares decisões» es agramatical: tras «que» va el conjuntivo («que tomes»); el infinitivo pessoal se usa SIN «que» («É fundamental tomares decisões»). Las dos alternativas empeoran la cosa: «que tomar decisões» y «que tomar tu decisões». Y la glosa remata afirmando que «ambos son correctos en PT» dentro de este molde, que es exactamente lo falso.  
<sub>campos: `data.sentence`, `data.blanks[0].alternatives`, `esContrast`</sub>

**93. `ccbc27b9` — OK**  
«A vida útil deste aparelho já terminou. Ele está todo gasto» es portugués correcto, la pregunta es contestable y la respuesta figura entre las opciones. Correcto.

**94. `d8371e83` — OK**  
«É melhor falares mais devagar» — infinitivo pessoal de 2.ª singular bien flexionado, alternativa «falar» también legítima, y la glosa da el contraste exacto con el subjuntivo español. Modelo de cómo debería estar hecha esta lección.

**95. `d89951cf` — OK**  
«A vida útil deste aparelho terminou» — traducción correcta, y la nota sobre «findou» como forma más literaria es exacta.

**96. `e2d0dde2` — DUDA**  
«Ela foi descobrindo» es europeo legítimo: el corpus del repo atesta ir + gerundio de sobra («foi indo», «foi repetindo o recado», «se foi definhando»). Lo que chirría es «aos poucos», de preferencia brasileña: el corpus europeo da 65 «pouco a pouco» frente a 2 «aos poucos», y uno de esos dos ni siquiera es el adverbio («aos poucos ouvintes»).  
<sub>campos: `data.sentence`</sub>

**97. `e6797426` — DUDA** · ♻︎ **rehacer audio**  
La frase es gramatical y el infinitivo flexionado tras «para» está bien empleado, pero «para resolverem» se queda sin referente: en ningún punto se dice quiénes resuelven. Explicitar el sujeto arregla la frase sin tocar la traducción española, que ya dice «para que resuelvan».  
<sub>campos: `data.source`</sub>

**98. `e77c4143` — OK**  
«Não é preciso correr» es la manera europea de decirlo (más idiomática que «não é necessário»). Correcto.

**99. `eedbf026` — OK**  
«Nós precisamos de ajuda para arrumar a casa» — régimen correcto y «arrumar a casa» está atestado en el corpus europeo. Correcto.

