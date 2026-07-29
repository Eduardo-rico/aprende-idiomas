# Ataque adversarial a las correcciones del 28 de julio

**Fecha:** 2026-07-29 · **Objeto:** los cuatro currículos ya corregidos, la serie AO BALCÃO ya corregida, el episodio 1 con narradora y el bloque 1 de fonética reparado.

Ayer se corrigió el material a partir de una revisión lingüística de 72 errores. Hoy cuatro revisores —uno por lengua— atacaron **las correcciones**, no el material original. La pregunta no era «¿está bien el currículo?» sino «¿la corrección lo dejó mejor?».

La respuesta es que no siempre. **De 73 hallazgos, 19 los introdujo una corrección de ayer.** Ésos van primero en este documento, porque son los que demuestran que el ciclo de corrección puede empeorar el material, y porque son los únicos que no existirían si ayer no se hubiera tocado nada.

---

## Cómo se midió

Nada se dio por bueno de vista. Todo lo verificable se verificó con `node` contra los ficheros de hoy:

| Comprobación | Resultado |
|---|---|
| `verb_preposition` con la preposición repetida tras el hueco | **31 de 180** (17,2 %) — la revisión anterior encontró 2 y llamó a este tipo «el mejor material del proyecto» |
| `variantStatus` leído en `lib/exercise-resolver.ts` | **0 veces** — sólo aparece dentro de un comentario (línea 65) |
| Ítems de `b1.json` sin `contentHash` | **4**: `b1-hf-01`…`b1-hf-04`, los cuatro añadidos ayer |
| `variantStatus` en b1 | 207 `unchecked` · 35 `needs-human` · 16 `divergent` |
| `4db8fa08` acepta como correcta | `"Meu avó já morreu."` — gemelo exacto del ítem borrado ayer por decir «Minha avô» |
| Tokens con cirílico **y** latino mezclados en el currículo | **1**: `obособление`, línea 1353 |
| `scripts/check-bleed-docs.ts` (creado ayer) | Detecta CJK, kana, hangul, hebreo, árabe, devanagari, tailandés. **No detecta latín dentro de cirílico**, que es el vector real |
| `curriculos:490` frente a `:813` y `:430` | La corrección de `a→e` se aplicó en **uno de los tres sitios** |
| `curriculos:544` | `a asista la` sigue en la lista semilla de falsos amigos |
| `curriculos:83` · `:95` · `:144` · `:138` | Los cuatro arreglos pedidos ayer siguen sin aplicar |
| Inventario léxico del ep. 1 (serie:488) | Sigue listando `seguinte` y `o`, que ya no aparecen; no lista `quem` ni `segue`, que sí |
| `biblioteca-lectura.md:730` | Sigue rematando la pieza H3 con «pregunta por el apodo» |

---

## Cuadro de mando

| Lengua | Hallazgos | Graves | Medios | Menores | **Los introdujo una corrección de ayer** | Discutibles |
|---|---:|---:|---:|---:|---:|---:|
| Portugués (+ el material en español) | 18 | 9 | 9 | 0 | **6** | 12 |
| Rumano | 15 | 6 | 8 | 1 (agrupa 6) | **3** | 13 |
| Checo | 26 | 3 | 18 | 5 | **6** | 10 |
| Ruso | 14 | 2 | 7 | 5 | **4** | 8 |
| **Total** | **73** | **20** | **42** | **11** | **19** | **43** |

Los recuentos son de **entradas de hallazgo**. Varias agrupan ítems: la entrada de los `verb_preposition` cubre 31 ejercicios, la de acentuación de b1 cubre 9 tarjetas, la de la lección r/rr cubre 5, y la de menores rumanos cubre 6 líneas. Contados uno a uno, los ítems de contenido afectados pasan de 130.

**Ninguna de las cuatro lenguas queda firmada.** El checo no llega ni a la mitad: de 20 hallazgos de la primera revisión se aplicaron 5, y 4 de esas 5 introdujeron un defecto nuevo. El ruso conserva el 55 % de sus hallazgos originales. El rumano tiene dos correcciones aplicadas a medias que dejaron el documento **contradiciéndose consigo mismo**, y en las dos la versión que sobrevive es la falsa. El portugués es el único donde la mayoría de las correcciones son buenas — y aun así ahí está el error más caro del día.

---

## 1 · Los 19 que introdujo una corrección de ayer

Éstos son los valiosos. Un error que ya estaba no dice nada nuevo sobre el proceso; un error que **nació de la corrección** dice que el proceso no tiene red.

### El patrón, en cuatro formas

Los 19 no son 19 accidentes independientes. Caen en cuatro moldes, y los cuatro son predecibles:

1. **Se arregla el síntoma y se propaga la enfermedad** (6 casos). La corrección sustituye una afirmación falsa por otra afirmación —igual de generativa y sin condicionar— en lugar de acotar la primera.
2. **Se arregla en un sitio y se deja en los otros dos** (4 casos). El documento pasa a decir dos cosas incompatibles, y la que sobrevive intacta suele ser la que alimenta al generador.
3. **Se pega encima sin borrar la cola** (3 casos). Queda duplicación, contradicción interna o comentario de revisión dentro del texto de producto.
4. **Se aplica un buscar-y-reemplazar y no se rehacen los números que dependían de él** (6 casos). Recuentos, inventarios, presupuestos y notas de corrección quedan describiendo un texto que ya no existe.

### Los cuatro más caros

**① La regla generativa falsa que sustituyó a otra regla falsa — `b1-hf-01`** · GRAVE · portugués
El ítem añadido ayer enseña: «Donde el español tiene h- muda inicial, el portugués **casi siempre** tiene f-». Es falso, y falso en el vocabulario más frecuente. No vale para `homem`, `hora`, `hoje`, `haver`, `hospital`, `história`, `húmido` (h- que ya era h- en latín), ni para `osso`, `ovo`, `horto`, `erva`, `gelo`, `irmão` (donde el español diptongó o la h- es de otro origen). Un alumno que aplique la regla como está enunciada produce **\*fomem, \*fora, \*foje, \*faver, \*fosso, \*fovo, \*ferva**.

Es exactamente el defecto que la propia revisión de ayer le reprochó al rumano en `fată/fete`: una regla generativa mal condicionada de la que cuelgan cientos de formas. Se señaló en una lengua y se cometió en otra, el mismo día, en el bloque que más repite el SRS. **Éste es el hallazgo más caro de los 73.**

**② La red de seguridad que no existe — `variantStatus`** · GRAVE · portugués
Los mensajes de commit de ayer dicen que 23 ítems con el cuerpo falso quedan «aparcados» en `needs-human` y que 82 «dejan de servirse como verificados». Medido: `variantStatus` **no se lee en ningún punto del código de resolución**; en `lib/exercise-resolver.ts` aparece una sola vez, dentro de un comentario. Marcar un ítem `needs-human` no lo saca de la cola, no lo degrada y no avisa al alumno. Los 105 ítems se siguen sirviendo exactamente igual que antes.

Esto es lo que convierte a la corrección de ayer en un problema y no sólo en un trabajo incompleto: **la mitigación que justificó «retirar el `esContrast` en vez de reescribir el ítem» no se aplica**. Se retiró la etiqueta de contraste y se dejó el cuerpo falso servido a diario. Entre ellos: «lápis y fácil no llevan tilde» (con audio grabado), «atrás lleva acento grave», «pará es la 3.ª persona de parar», «vôo es la forma de PT-PT», y el gemelo del ítem que ayer se borró.

**③ La corrección aplicada en uno de los tres sitios — rumano `a→e` / `a→ă`** · GRAVE
Ayer se corrigió en `:490` que `fată/fete` es `a→e` y no `a→ă`. No se propagó a `:430` ni a `:813`. Resultado: el documento afirma ahora **las dos reglas a la vez sobre el mismo par**, y la versión falsa es la que sobrevive en `:813` — que es el párrafo que especifica literalmente qué debe declarar `Concept.morphRules`, o sea el que lee quien programe el generador de los ~530 ítems de declinación. La corrección dejó el documento peor que antes: antes había una regla mal enunciada, ahora hay dos incompatibles y el generador se queda con la mala.

Y de propina, la corrección **rompió la sintaxis de la enumeración**: el inciso «la clase se almacena por lema» se insertó en medio de la lista, y las cinco alternancias consonánticas (`t→ț, d→z, s→ș, c→ci, g→ji`) quedaron colgando de él. El texto ahora dice que las alternancias 100 % automáticas «se almacenan por lema», que es lo contrario de lo que son y de lo que el mismo documento afirma en `:430`.

**④ El gate nuevo que da verde sobre el fichero contaminado — `check-bleed-docs.ts`** · MEDIO · ruso
Se escribió ayer, precisamente porque la revisión encontró dos caracteres chinos (`操作`) donde debía decir `Операция „Ы“`. Detecta CJK, kana, hangul, hebreo, árabe, devanagari y tailandés. **No detecta latín dentro de cirílico**, que en ruso es el vector real y el único que el propio currículo se molesta en documentar (`:1552`, la lista de homóglifos а/a, о/o, с/c…).

Medido: el fichero pasa el gate de ayer **en verde** y contiene `obособление` en la línea 1353 —«o» y «b» latinas dentro de la palabra cirílica—, que es el nombre del concepto del que cuelgan los 900 ejercicios de puntuación de C1. Un gate nuevo, escrito ayer, que declara limpio un fichero sucio: es el falso verde que este proyecto ya tiene documentado en `verify-content`, construido otra vez.

### Los 15 restantes

| # | Lengua | Dónde | Qué introdujo la corrección | Gravedad |
|---|---|---|---|---|
| 5 | pt | serie:591 (nota didáctica ep. 2) | Sobrevive «sabiendo que `apelido` no es apodo» nueve líneas antes del recuadro que explica que eso es falso — y describe un gag que ya se retiró. Un generador que lea los descriptores servidos reintroduce el falso amigo inventado en A1 | grave |
| 6 | pt | serie:488, 915 y tabla de recuento | Se cambiaron 13 réplicas y se borraron 4 sin volver a medir. El ep. 1 lista `seguinte` y `o`, que ya no aparecen; no lista `quem` ni `segue`, que sí; el ep. 3 declara `quem` como nueva cuando ya salió en el 1; y la nota de corrección n.º 2 del ep. 2 arregla un `Hã?` que ayer se borró | medio |
| 7 | pt | serie:106, :222 | `Faz favor, quem se segue?` es portugués correcto, pero ahora las dos funciones que el documento dice contrastar **empiezan por la misma cadena**. Se fabricó un solapamiento donde había un contraste, en la serie cuya tesis es que las fórmulas se aprenden por repetición idéntica. Y mete una próclise obligatoria (`quem se segue`) como primer clítico del curso, antes que el ancla enclítica `chamo-me` | medio |
| 8 | pt | `b1/7093d2de` | La mejor tarjeta del día usa **`você`** como palabra modelo del circunflejo — la forma que el currículo prohíbe expresamente en A1 y que el gate del proyecto marca como brasileñismo. Y transcribe `pêssego` /ˈpesegu/, dejando plena la átona intermedia en el bloque cuya tesis es la redução vocálica | medio |
| 9 | ro | `:636` | Se añade `a uita vs a se uita la` a los falsos amigos. `a uita` viene del mismo étimo que «olvidar» y significa eso: no es falso amigo ES-RO, es un contraste **interno** al rumano. Repite la confusión de categoría que la corrección venía a arreglar, en la misma línea que advierte que el fichero hay que mirarlo con sospecha | medio |
| 10 | cs | `:935` | «univerzita≠\*univerzita palatalizada» se insertó como excepción a las reglas (1)(2)(3) de obecná — que son ý→ej, é→ý/í y v- protética. `univerzita` no contiene ý, no contiene é y no empieza por o-: no es excepción a ninguna. El hallazgo de `di/ti/ni` se metió en el sitio equivocado y el error real de `:909` sigue en pie | medio |
| 11 | cs | `:935` | La excepción del dual se enunció como lista cerrada de cuatro sustantivos. En checo estándar el dual arrastra la **concordancia**: `s modrýma očima`, `vlastníma rukama`. Tal como quedó, el alumno escribe `*s modrými očima` convencido de estar siendo formal — que es el error n.º 1 de hipercorrección del extranjero avanzado | medio |
| 12 | cs | `:935` vs `:922` y `:939`(3) | Documentar `dobří→dobrý` es correcto, pero vuelve **no funcional** la dirección OČ→SČ: ahora `dobrý` corresponde a tres celdas estándar distintas. Y nadie actualizó los dos sitios que exigen esa conversión con respuesta única y umbral ≥85 % | medio |
| 13 | cs | `:909` | La frase de diptongos añadida ayer arrastra tres defectos: deja «**que faltaban**» —comentario de revisión— dentro del texto de currículo; se apropia del «entrenado primero en PERCEPCIÓN» que pertenecía a la cantidad vocálica, que pierde su instrucción justo donde se reparte el 35 % de las horas; y atribuye entrenamiento perceptivo a `au`/`eu`, que son diptongos nativos del español | medio |
| 14 | cs | `:868` | Al corregir `:909` a cuatro pares de cantidad, `:868` se quedó diciendo cinco. El documento se contradice a 40 líneas de distancia | menor |
| 15 | cs | `:935` regla (5) | La corrección más necesaria del documento, con el ejemplo negativo mal elegido: marca **`*by`** con asterisco, y `by` es una de las palabras más frecuentes del checo (`by přišel`, `kdyby`, `aby`) — usada como forma legítima dos frases antes en la misma línea. En un gate positivo token a token, eso banea una palabra gramatical | menor |
| 16 | ru | `:1162-1176` vs `:1223` | La partición pre_A1/A1 mueve a `pre_A1` **las dos cifras exactas** que A1 ya tenía como puerta (≥60 ppm, dictado ≥90 %) y deja la de A1 intacta. Dos niveles consecutivos con la misma barra, A1 sin objetivo propio, y `:1556` sigue asignando el 60 a A1: tres sitios diciendo cosas distintas | medio |
| 17 | ru | `:1246` | El reparto del genitivo plural ya es correcto, pero se pegó encima sin borrar la cola: `рублей`, `друзей` y `людей` aparecen **dos veces en la misma frase**, primero como regulares en -ей y después como «irregulares frecuentes». `рублей` no tiene nada de irregular | menor |
| 18 | ru | `:1415` | La sustitución de los caracteres chinos es correcta, pero quedó «рука,Операция» sin espacio, y con comillas bajas alemanas donde el ruso usa angulares | menor |
| 19 | pt | `b1-hf-01`…`04` | Los cuatro ítems nuevos son los **únicos 4 de 258** sin `contentHash`, y usan id legible en vez de hash. El proyecto declara que el id es el hash del contenido y que de ahí cuelga el audio. Hay que decidirlo antes de generar los MP3 de A1, no después | menor |

---

## 2 · Veredicto por lengua

### Portugués (y el material en español)

**No se firma el bloque 1 «reparado» ni el episodio 1 con narradora. Las correcciones del currículo y de la serie se firman a medias.**

**Lo que se hizo bien y hay que reconocerlo:** se leyeron los 37 `esContrast` retirados o reescritos ayer, uno a uno, contra el diff. **Ninguno correcto se perdió.** Los 23 retirados eran todos falsos o vacíos; los dos que sí eran ciertos —la cedilla y `alfabeto` frente a `abecedário`— no se borraron, se sustituyeron por versiones mejores. La decisión de retirar en vez de inventar 45 textos que nadie podía verificar es la correcta.

**Lo que no se hizo:** se retiró la capa de contraste y se dejó intacto el cuerpo falso. Los 23 ítems «desactivados» se siguen sirviendo con su texto original, y ahí dentro hay nueve falsedades de acentuación (`bdad8a26`, `e6eae5d6`, `f0ae3fd6`, `8695dcff`, `e2a9ef15`, `c5dab06e`, `770097dd`, `7fdd81e1`, `c2c0c60d`) que sobrevivieron a una reparación cuyo mensaje de commit dice haber eliminado esta clase de error. `décimo` es esdrújula con tilde también en español; `atrás` lleva agudo —el grave portugués marca la crase y **nunca** la tónica—; `pará` no es forma de `parar` y «Ele pará de chorar» es agramatical; `óbvia` y `coração` no llevan circunflejo por ninguna parte.

**Lo más caro que no tocó la reparación:** la lección 5 de b1 (`b1-l5-pron-rr-s`) enseña `caro`/`carro` **al revés en tres ítems distintos**. `08716d78` transcribe «caro /ka.ʁu/» —escribe *carro* y lo llama *caro*—; `6d37d0a6` dice que en portugués europeo la ⟨rr⟩ de `carro` es un tap, con lo que el alumno pronuncia `caro` toda su vida creyendo que dice `carro`; `4626c4a6` da dos transcripciones idénticas presentándolas como distintas. Es el par mínimo que el propio currículo llama «EL par mínimo» del portugués europeo (`:83`), y la lección entera describe el brasileño en un curso declarado PT-PT.

**Y lo medido:** los `verb_preposition`, que la primera revisión llamó «el mejor material del proyecto» tras encontrar 2 casos rotos, tienen **31 de 180 rotos** (17,2 %). La preposición que se pide ya está escrita inmediatamente después del hueco, así que la respuesta correcta produce «gosto de dos meus filhos», «pensa em no futuro», «sonhou com com uma praia», «lembrei de de comprar». En una parte de ellos el hueco era del **verbo** y alguien puso la preposición como clave, así que el ítem no tiene ni siquiera verbo.

**El episodio con narradora es un buen formato con una voz modelo que aún no es impecable.** La narradora usa presente simple donde el portugués europeo exige `estar a + infinitivo` —«A Dona Fátima fala com a cozinha» describiendo algo que ocurre en ese instante—, en la lengua cuyo error capital n.º 2 declarado es precisamente ése, y en el mismo documento donde Marta lo hace bien en el ep. 4 («Ela está a falar com o Zé»). Y afirma que «Em português não se diz "café con leche"», cuando en Portugal **sí** se dice `café com leite` todos los días; además `galão` no es su equivalente (el de taza es `meia de leite`).

**Cuatro correcciones pedidas ayer que siguen sin aplicar en el currículo, verificadas hoy línea a línea:** `:83` sigue anunciando 8 pares mínimos y repitiendo `avó/avô` y `avô/avó` como si fueran dos · `:95` sigue enseñando `desculpe-me`, que en Portugal no se dice · `:144` sigue dando `Está?` como fórmula de quien **atiende** el teléfono cuando es la de quien **llama** —y la serie, en el ep. 8, lo tiene bien: los dos documentos se contradicen— · `:138` da indicativo a los cuatro fragmentos de conjuntivo, incluidos `talvez` y `espero que`, que piden conjuntivo.

### Rumano

**Dos correcciones limpias, dos aplicadas a medias, y las dos a medias dejaron el documento contradiciéndose consigo mismo con la versión falsa sobreviviendo en el sitio que alimenta al generador.**

Las limpias son buenas de verdad: el sufijo `-ez-`/`-esc-` (`:492`) queda bien enunciado **y con la explicación de por qué `*a lucrez` es agramatical**, que es la que impide que el error vuelva; y la sustitución de `cu mașina` por `la birou, pe stradă` (`:542`) deja cuatro ejemplos que pierden efectivamente el artículo, sin un solo contraejemplo.

Las de a medias ya están arriba (`a→e`/`a→ă`) y aquí: **`a asista la` se retiró de `:636` y `:646` pero sigue intacto en `:544`** — y `:544` es donde más daño hace, porque no es un descriptor sino la **semilla del fichero**: las 30 entradas con las que se abre el activo que el proyecto declara diferencial y del que cuelgan 80 entradas con esContrast hasta B2. El español «asistir a» significa lo mismo que `a asista la`: es cognado perfecto y sólo es falso amigo para un anglohablante.

**Lo más caro de lo que la primera revisión no miró:** no existe ninguna alternancia `g→j` ni `g→ji` en la flexión rumana. ⟨j⟩ es /ʒ/ y jamás es el resultado de ⟨g⟩ ante -i: el plural de `drag` es **`dragi`**, el de `lung` es **`lungi`** — nunca `*draji`, `*lunji`. La alternancia es `g→gi`, paralela exacta de la `c→ci` que la misma línea escribe bien. **Está en los tres sitios, incluido el spec de `morphRules`.** Un generador por regla alimentado con «g→ji» produce ortografía inexistente en cada masculino y adjetivo en -g del corpus.

Y tres más que la primera revisión no vio: la caída de la **-L** del artículo enclítico (`omul→omu'`) está enunciada al revés como «elisión de la -u final» (`:596`), lo que hace que el alumno busque una -u que ya está y no aprenda que la -l desaparece — en el rasgo que decide si oye o no el artículo enclítico. El tratamiento nominal de `:498` enuncia como regla rumana **la regla española** (`domnule` + nombre de pila; el rumano es `domnule` + apellido o cargo) y a continuación advierte que no funciona como el español. Y `:642` declara la Aktionsart «sin equivalente sistemático en español» dando equivalente español a los siete ítems entre paréntesis, en la misma línea — lo que le asigna 180 ejercicios de B2 a un terreno de transferencia alta.

El presupuesto de audio de A1 no cuadra: 120 min declarados contra **147-224 min** medidos (los 120 textos son 12.000 palabras a 110-130 ppm = 92-109 min, no ~75; los 300 ítems de 8-20 s son 40-100 min, no ~30). De ahí cuelga la cifra agregada de 61 h y el coste del proyecto.

### Checo

**El documento se presenta como corregido y conserva el 75 % de sus hallazgos. Verificado cadena a cadena contra el texto de hoy: de 20 hallazgos, se aplicaron 5.** Los otros 15 siguen literalmente idénticos — `:854` «no existe en ninguna otra lengua», `:868` «cinco vocales con y sin čárka», `:909` «Cvrček & Richterová», `:958` «Nezapomeň», `:962` «rád, schopen», `:1031` «sin haberlo estudiado nunca», `:1042` «písemná práce», `:1080` «que es libre».

Es decir: **conserva dos de los tres errores graves** —la universalidad de la pareja aspectual y la regla `di/ti/ni` sin restricción de préstamos—, que son exactamente las dos líneas desde las que se generaría material a escala. Y de las 5 correcciones aplicadas, **4 introdujeron un defecto nuevo**.

El resultado es que el «medio camino» es peor que el original, porque ahora hay contradicciones internas que un generador resolverá al azar: `:854` contra `:909` en el inventario de sibilantes (cuatro oposiciones frente a tres más una marginal), `:868` contra `:909` en el número de vocales, `:935` contra `:962` en el instrumental en -ma (en A2 el dual es estándar, en B1 el -ma vuelve a ser «obecná» y pasa a producción — la receta exacta de la hipercorrección).

**El hallazgo nuevo grave:** `jít/přijít` presentado como pareja aspectual junto a `dělat/udělat` (`:909`). No lo es — `jít` es imperfectivo **determinado** (su par es `chodit`) y el imperfectivo de `přijít` es `přicházet`. Meterlo enseña la ecuación falsa `jít:přijít :: dělat:udělat`, choca con el sistema determinado/indeterminado que el propio A2 introduce, y `:930` remata pidiendo **siete perfectivos prefijados sin un solo imperfectivo**. Resultado garantizado: `*Každý den přijdu do práce v osm`. Y como entrada de diccionario alimenta `aspectPair` (`:1070`) con un par que no existe.

Es el patrón exacto que este proyecto ya sufrió: una fórmula que se ve razonable, que nadie del equipo puede falsar, y que alimenta el modelo de datos.

El juicio de fondo sobre el diseño no cambia —sigue siendo el mejor currículo de checo para hispanohablantes escrito fuera de la bohemística checa—, pero **no se firma como corregido**.

### Ruso

**Cinco de las seis correcciones de ayer son técnicamente correctas y se verificaron forma por forma.** `с тремястами пятьюдесятью шестью респондентами` con los tres componentes declinados en instrumental; `го́род→городско́й→загоро́дный` con el acento en la sílaba normativa; el reparto del genitivo plural; el par prohibir/advertir del imperativo —que es **mejor** que lo que la revisión pedía—; y la desaparición de los caracteres chinos.

Pero **dos de ellas dejaron basura al pegar** y una tercera crea una puerta duplicada (los tres están en la tabla de arriba). Y lo más grave no es eso: **de los 11 errores que la primera revisión levantó en ruso, sólo se tocaron 5.**

Siguen vivos: el GRAVE de los casos «receptivos» —A1 declara dativo e instrumental no productivos (`:1178`, `:1200`) y a la vez exige producir `мне 30 лет`, decir la edad y aprobar el simulacro de ТЭУ con ≥66 % en Лексика-грамматика, subtest que examina los seis casos: **un nivel cuyo enunciado dice «cuatro casos» no puede aprobar su propia puerta de salida**—; el MEDIO de los mínimos léxicos leídos como «activos» en los cinco niveles (A1 declara 800 activos + 1.200 receptivos contra un mínimo oficial de **780 en total**, citado en la misma línea); y los tres MENORES enteros.

**Y tres hallazgos nuevos, los tres de la misma familia que el `操作` que la primera revisión sí cazó:** `obособление` con «o» y «b» latinas (arriba); la palabra rusa **`где`** usada como el «donde» español dentro de una frase en castellano (`:1142`), que deja la oración sin nexo y sin verbo principal; y un ejemplo de nominalización que **no es ruso**: `вместо того, что строят дом` (`:1357`) — la construcción rusa es `вместо того, чтобы` + infinitivo; con `что` + verbo finito es agramatical. Es una fórmula inventada en la posición más cara: un ejemplo de contenido lingüístico del que cuelgan los 700 ejercicios de sintaxis compleja de B2, en la única lengua donde el dueño no puede detectarlo.

También, sin señalar antes: `:1196` presenta `жи/ши`, `ча/ща`, `чу/щу` como «reglas dependientes de la palatalización» y dos líneas después declara que ж/ш son siempre duras y ч/щ siempre blandas. Las dos afirmaciones se contradicen y la primera es falsa: ese grupo es precisamente el conjunto de casos donde la regla vocal→blandura **no** se aplica. Enseñado así, el alumno deduce que `жи` se pronuncia [ʐʲi], que es el error de pronunciación más común del principiante.

---

## 3 · Lo discutible

43 puntos que no son errores pero exigen una decisión declarada. Los que mueven presupuesto o material:

**Portugués**
- **`Faz favor, quem se segue?` frente a `Quem se segue?` a secas.** La forma corregida no es incorrecta, pero lo que se grita en un balcão lisboeta es la pregunta sola. `Faz favor` delante acumula dos fórmulas y destruye el contraste (ver hallazgo 7). Alternativas igual de lisboetas para variar por episodio: `É a vez de quem?` / `A seguir!`
- **`galão` como equivalente de «café con leche».** Para el ep. 1 está bien elegido, pero se está enseñando una de las dos: el de taza es `meia de leite`, y conviene meterlo en los eps. 9-12 antes de que el alumno pida un galão en una esplanada creyendo que es lo mismo.
- **Que la narradora pronuncie «café con leche» en español.** Acierto dramático, riesgo de producción: una voz `pt-PT` va a articular la cadena con fonología portuguesa. Hay que grabarla con la voz `es-MX` o marcarla con override fonémico, y decidirlo **antes** de doblar.
- **`júri`/`jurado` como par del contraste de acentuación** (esContrast escrito ayer): el contraste es correcto, pero no son la misma palabra. Los pares que muerden son `táxi`/`taxi`, `vírus`/`virus`, `ténis`/`tenis`, `bónus`/`bonus`.
- **«El agudo marca vocal ABIERTA»**: vale para a/e/o; no significa nada para `í` y `ú`. Media línea lo arregla: «en i y u el agudo sólo marca la tónica».
- **La lección 5 entera de b1 describe el brasileño** en un curso PT-PT: doce ítems hablando de /h/, /χ/ y «en BR…», con el europeo como nota al pie. Aparte de los tres invertidos, la decisión de fondo —qué variedad es el sujeto de la lección— está tomada al revés y no se arregla ítem a ítem.

**Rumano**
- **El fichero de falsos amigos sigue mezclando dos categorías.** `prost`, `plic`, `borcan`, `tare`, `a păstra` y `a lăsa` no tienen cognado español, así que no pueden ser falsos amigos: son palabras opacas, que el documento ya trata bien aparte en `:496`. Y `a lăsa` es cognado de «dejar» con el mismo significado. **`prost` lo recomendó la primera revisión**: es el patrón que este proyecto ya vio en portugués —un revisor sustituye una entrada mala por otra que tampoco lo es. Antes de generar 80 entradas hay que definir el criterio de admisión: cognado formal + divergencia semántica, y nada más.
- **El dativo experimentante no aparece en ningún nivel.** Grep sobre las 424 líneas: cero apariciones de `mi-e foame`, `mi-e frig`, `mi-e dor`, `îmi trebuie`, `mi se pare`. Es la construcción con la que un rumano dice tener hambre, frío, sueño, miedo y ganas. Debería ser A1 semana 2.
- **La divergencia del conjuntivo está apuntada al sitio equivocado** (`:588`). Lo que rompe al hispanohablante avanzado no es `vreau să merg` —instalado en A1 semana 1— sino lo contrario: rumano con **indicativo** donde el español exige subjuntivo (`când vine`, `după ce termin`, `chiar dacă vine`, `nu cred că vine`). El error real de B1 es la **sobre**producción de `să`, y no está descrito, así que los 300 ejercicios se gastarían donde no era.
- **`nume` / `prenume` no se advierte** (`:484`): en rumano `nume` es el **apellido** y `prenume` el nombre de pila, al revés de la intuición del hispanohablante. Es la misma trampa que acaba de costar un episodio entero de la serie portuguesa, y aquí está en un ejercicio de A1 con corrección por igualdad exacta de cadena.

**Checo**
- **Los 6 vzory nucleares de A1**: `růže` debería estar dentro y `kost` fuera. El vocabulario situacional de A1 está lleno de `růže` (restaurace, ulice, stanice, práce, chvíle); de `kost` en A1 sólo aparecen `věc` y `noc`. Discutible porque ésas dos son frecuentísimas y `kost` es el vzor que peor se adivina.
- **El ×1,5 por estudio en solitario y la paridad de horas con el ruso** siguen sin resolverse. El checo con siete casos, cuatro clases de género con animacidad, diglosia funcional y genitivo plural impredecible no puede salir un 68 % más barato que el ruso con la misma categoría FSI. La resolución honesta es aplicarle al checo el método de agravantes enumerados, no bajarle las horas al ruso.
- **La cobertura «88-91 % con 4.000 lemas»** sigue sin fuente verificable y parece alta; las curvas del ČNK quedan más cerca del 80-85 %. De ese número cuelga la promesa de «lectura extensiva que se sostiene sola».

**Ruso**
- **Las cifras de cobertura léxica siguen internamente incoherentes**: `:1369` («~98 %, lo que exige ~8.000-9.000 lemas») contra `:1427` («los 10.000 primeros cubren ~91-92 %»). Marcado ayer, no aplicado, y de ahí cuelgan las horas de B2-C2.
- **La regla del imperativo negativo sigue en absoluto en la tipología** (`:1116`), 130 líneas antes de la corrección que la desmonta. Es la línea que un generador leerá como caracterización del aspecto.
- **No hay puerta de velocidad lectora para C1 ni C2** (`:1556` llega hasta B2), en un idioma cuya fase de descodificación es contenido de primera clase.

---

## 4 · Qué está bien

Esto no es cortesía: es la lista de lo que **no hay que volver a tocar**, y de las decisiones que hacen creíble el resto.

**Portugués**
- **Ningún `esContrast` correcto se perdió** en la reparación de ayer. Verificado uno a uno contra el diff.
- **Las ocho correcciones de contenido de b1 son buenas y ninguna es trivial.** Agudo = vocal abierta / circunflejo = cerrada, con `avó`/`avô` y `pôde`/`pode` como consecuencia, es exactamente la regla y estaba escrita al revés. `ç` nunca ante e ni i, con el porqué. 26 letras desde el AO90 frente a las 27 españolas. `duplo vê`. `hábito` proparoxítona. Y el `esContrast` de `táxi` es el único contraste de acentuación verdadero entre las dos lenguas, formulado con precisión.
- **La entrada de `apelido` en el currículo (`:86`) quedó impecable**, y el dato que la sustituye es el correcto y el difícil: `nome + apelido(s)` con el materno **antes** del paterno, al revés que en México. Es el tipo de dato que sólo sabe quien ha rellenado un impresso portugués.
- **El portugués de los guiones 4, 5 y 6 aguanta la lectura de un lisboeta.** `Não coma mais` y `Coma` frente a `Senta-te` y `Diz antes`, en el mismo episodio y sin una nota explicativa. `Escreva aqui a morada. E assine.` `Carrega em Finanças.` `Estou a ouvir, ó rapaz. Pois, pois.` Y el par `Não estou a ouvir nada` (ep. 4) / `não ouço nada` (ep. 6) puesto a dos episodios de distancia, que es la única forma de enseñar la diferencia sin explicarla.
- **El `esta`/`essa` del ep. 6** es la mejor línea de gramática de la tanda: el sistema deíctico de tres términos enseñado corrigiendo un dedo.
- **«O Kilu disse obrigado. O Migue disse obrigada. O Migue é homem.»** Tres frases declarativas, cero metalenguaje, cero traducción. Con «Uma bica é um café pequeno» justifican el formato entero.
- **El arreglo del `variant-guard` que deja de marcar `vocês`** es correcto y no obvio: `vocês` es el plural normal de `tu` en Portugal y marcarlo inflaba el gate en 18 ejercicios. «Un gate que grita en falso pierde autoridad para lo que sí importa» es la regla buena.
- **Bajar la cobertura europea verificada de 191 a 110 ítems** en vez de dejar el número alto. Es la corrección que nadie exige desde fuera porque nadie la ve, y la que hace creíble el resto del recuento.

**Rumano**
- **La morfología nominal de A2 está escrita sin un solo fallo**: genitivo-dativo completo, genitivo analítico con `lui`, la regla real del artículo posesivo, demostrativos en las dos posiciones con caso, y el paradigma del vocativo (-e/-o/-lor). Es la parte más difícil del idioma y está correcta al detalle.
- **Los clíticos con contracción ortográfica están todos bien** (`mi l-a dat`, `dă-mi-l`, `nu te duce`, `m-am dus`, `într-o`, `dintr-un`), que es donde falla casi todo el material publicado de rumano. Y `al cărui / a cărei / ai căror` con las tres concordancias correctas.
- **Las once partículas modales están bien glosadas**, incluido `cică` = «dizque», que es exactamente el equivalente que un mexicano necesita y que un manual escrito para anglohablantes no puede dar.
- **Las etimologías del léxico opaco están todas correctas**, verificadas una a una (eslavo, húngaro, turco, griego). Sólo `a dori` es discutible.
- **La aritmética del documento cuadra**, verificado con `node`: ejercicios 900/1.200/1.600/1.500/1.100 = 7.100; lectura 50k/200k/500k/1M/1,7M; audio acumulado 61 h; horas 240/470/705/940/1.420; 1.210 tareas de producción. La única que falla es el reparto interno del audio de A1-A2.
- **La decisión de NO generar los ítems de declinación con un LLM** sino por regla desde el lexicón, validados contra UD Romanian-RRT o Hunspell, sigue siendo la decisión de producción más importante — y por eso los tres errores dentro del spec de `morphRules` son los que hay que arreglar antes que nada.

**Checo**
- **La corrección de los 14 vzory es correcta y completa** (4+2+4+4), y ahora cuadra con `:935`. La glosa de `předseda`/`soudce` como «nominativo de apariencia femenina con concordancia masculina animada» es la información que un hispanohablante necesita y que casi ningún manual da explícita.
- **La regla (5) de obecná** —caída de -l sólo tras consonante— es la más importante de las cinco aplicadas y cierra el riesgo concreto de generar `*dělá`, agramatical en cualquier registro e indetectable para el equipo.
- **Los seis pares mínimos de cantidad** (byt/být, pas/pás, dal/dál, rada/ráda, vila/víla, páni/paní) son todos reales, y `páni/paní` es especialmente bueno porque opone la **posición** de la longitud. La puerta dura de 40 pares con ≥90 % y azar 50 % sigue siendo la mejor decisión del currículo de checo.
- **Las anclas externas son todas verificables y ninguna inventada**, incluida la declaración explícita de que **no existe examen C2 de checo**. Que el documento se niegue a fingir un C2 certificable y construya cinco instrumentos operativos es la parte más honesta del plan.
- **El diagnóstico de `:1086`** sigue siendo el más importante del documento: para el checo el guardián anti-bleed no sirve, porque el riesgo es el inverso (que el generador escriba `reka` por `řeka`) y hace falta un gate **positivo** con analizador morfológico.

**Ruso**
- **Las tres correcciones graves de ayer son correctas** y se verificaron forma por forma, no de vista.
- **La corrección del aspecto en imperativo es mejor que lo que pedía la revisión**: enseña los dos valores con la etiqueta pragmática correcta (imperfectivo para prohibir, perfectivo para advertir de algo involuntario) y añade que el español usa la misma forma para las dos cosas.
- **El documento está limpio de escrituras exóticas**: cero ocurrencias de CJK, kana, hangul, hebreo, árabe, devanagari y tailandés en los tres ficheros de plan. El `操作 Ы` desapareció de verdad.
- **La aritmética cuadra**, comprobada con `node`: 23.100 ejercicios, 1.958.000 palabras, 23.040 min = 384 h de audio, 1.440 tareas, 4.000 horas con los acumulados citados todos correctos y la cadena de ajustes 2.000×0,94×1,41×1,5 llegando a 4.000.
- **Los 14 pares de verbos de movimiento son la lista canónica**, sin inventos y sin colar `лазать` por `лазить`. Y las recciones verbales de A2 y de registro oficial de B2 están **todas** bien, que es el eje de interferencia ES→RU número uno.
- **El diagnóstico de riesgo del acento (`:1568`) es el mejor párrafo del documento**: `за́мок`/`замо́к` con TTS y SRS encima, la tasa del 2 % convertida en 460 minutos de material que fija pronunciaciones falsas, y el gate `stressVerified` por clip. Es el riesgo real de este idioma y está **dimensionado**, no mencionado.

---

## 5 · Qué hacer, priorizado

### P0 — Antes de generar o doblar una sola cosa más

| # | Acción | Por qué ahora |
|---|---|---|
| 1 | **Reescribir `b1-hf-01` con la regla condicionada** y partir sus ejercicios en dos series: una que la aplique y otra que la desmienta. Texto propuesto: «Cuando el español tiene h- inicial y el portugués no es un cultismo, suele haber f-: filho, fazer, falar, farinha, ferro, folha, formiga, fumo, fome, forno, fio, fígado. NO ocurre en las palabras que ya tenían h- en latín (homem, hora, hoje, haver, hospital, história) ni donde el español diptongó (osso, ovo, horto, erva).» | Es la única regla generativa **nueva** del día. Cada hora que pasa sirviéndose fija `*fomem` en más alumnos, y es el bloque que más repite el SRS |
| 2 | **O `exercise-resolver.ts` filtra `needs-human`, o los 105 ítems se reescriben/borran.** Las dos cosas no se pueden posponer a la vez | Mientras no se haga, el mensaje de commit describe una mitigación que el código no aplica. Y separar los ejes: `variantStatus` es pt-pt/pt-br; un ítem con fonética falsa necesita `contentStatus` propio, porque hoy contamina el recuento de los 110 `divergent` |
| 3 | **Borrar los 11 ítems de acentuación falsa de b1 con sus MP3** (`bdad8a26`, `e6eae5d6`, `f0ae3fd6`, `8695dcff`, `e2a9ef15`, `c5dab06e`, `770097dd`, `7fdd81e1`, `c2c0c60d`, `bd843713`, `e91c1337`) y reescribir la lección 2 sobre las cuatro reglas que sí son ciertas | La lección 2 no se salva ítem a ítem. Y `bd843713` tiene audio grabado enseñando que `lápis` y `fácil` no llevan tilde |
| 4 | **Borrar `4db8fa08`** (acepta «Meu avó») **y los dos ítems de `avó`/`avô` como diferencia entre países** (`f56d9fa6`, `b61938ce`) | Se borró un ítem por este error y se dejó su gemelo, en la misma lección, tras pasarle la mano por encima |
| 5 | **Propagar la corrección de `:490` a `:813` y `:430`, y cambiar `g→ji` por `g→gi` en los tres sitios** | El spec de `morphRules` es la única defensa que tiene el rumano contra la ausencia de revisor nativo, y hoy tiene dos reglas mal enunciadas |
| 6 | **Retirar `a asista la` de `:544`** y sustituirlo por un falso amigo ES-RO real (`vară`, `a ține`, `a pleca`, `a certa`) | Es la semilla del fichero del que cuelgan 80 entradas hasta B2 |
| 7 | **Arreglar `obособление` (`:1353`) y añadir a `check-bleed-docs.ts` la regla de mezcla por token**: marcar todo token que contenga a la vez `[Ѐ-ӿ]` y `[A-Za-z]` | Un gate que da verde sobre un fichero contaminado es peor que no tener gate. El arreglo del carácter es de un minuto; lo caro es no tener la regla |
| 8 | **Arreglar `вместо того, что строят дом` (`:1357`) y `где` (`:1142`)** | Fórmula inventada y palabra rusa haciendo de conjunción española, las dos en la lengua donde el dueño no puede detectarlas |

### P1 — Esta semana, antes del siguiente lote de contenido

9. **Correr el gate de preposición duplicada sobre los 180 `verb_preposition` y arreglar los 31 uno a uno.** Donde el hueco era del verbo, restituir el verbo como clave. El gate es tres líneas de `node` y ya está escrito en este documento.
10. **Reescribir la lección 5 de b1 (r/rr) desde cero con el eje europeo** —⟨r⟩ intervocálica = [ɾ], ⟨rr⟩/⟨r-⟩/tras n·l·s = [ʁ], ⟨r⟩ final = [ɾ] débil— con par mínimo A/B `caro`/`carro` y tarea de discriminación. **Y un gate que falle si un ítem transcribe `caro` con [ʁ] o `carro` con [ɾ].**
11. **Volver a pasar el tokenizador por los ocho guiones** y regenerar la tabla de recuento, los inventarios por episodio y el acumulado. Arreglar la nota 2 del ep. 2, que corrige una réplica inexistente. Si el gate léxico es «medido y falsable», tiene que **fallar** cuando el guion cambia y el recuento no.
12. **Arreglar la nota didáctica del ep. 2 (serie:591) y `biblioteca-lectura.md:730`**, que siguen diciendo que `apelido` es apodo y hoy contradicen al currículo y entre sí.
13. **Aplicar las cuatro correcciones del currículo portugués que siguen pendientes**: `:83` (pares mínimos duplicados), `:95` (`desculpe-me`), `:144` (`Está?` invertido), `:138` (conjuntivo con indicativo en los cuatro fragmentos).
14. **Checo: aplicar los 15 hallazgos no aplicados**, empezando por los dos graves (`:852`/`:909` la pareja aspectual como universal; `:909` `di/ti/ni` sin restricción de préstamos) y por el grave nuevo (`jít/přijít` fuera de la lista de parejas de A1). Y arreglar los cuatro defectos que introdujo la corrección de ayer, todos en `:935` y `:909`.
15. **Ruso: repartir los casos de A1 por SIGNIFICADO y no por caso entero**, que es lo que la primera revisión ya proponía y sigue sin aplicarse: nom; prep (lugar + `о`); ac (objeto + dirección); gen (`у меня есть`/`нет`/tras 2-4); dat (`мне нравится`/`мне нужно`/`мне N лет`); instr (profesión con `быть`, `с кем`). Y reetiquetar los mínimos léxicos en los cinco niveles.

### P2 — Antes del go/no-go de presupuesto

16. **Recalcular el audio de rumano A1-A2** (147-224 min reales contra 120 declarados) y con él la cifra agregada de 61 h.
17. **Decidir y declarar la licencia de MorphoDiTa/MorfFlex** (código libre, diccionario y modelos CC BY-NC-SA): el pipeline entero de checo se apoya en una pieza no comercial.
18. **Resolver `Faz favor, quem se segue?` frente a `Quem se segue?`** antes de doblar los eps. 1, 5, 7 y 8: hoy las dos funciones que el documento dice contrastar empiezan por la misma cadena.
19. **Decidir la voz de «café con leche»** en el ep. 1 (`es-MX` o override fonémico) antes de entrar en cabina.
20. **Decidir el esquema de id de los cuatro `b1-hf-0*`** (hash de contenido frente a id legible) antes de generar los MP3 de A1, no después.

### Lo que hay que cambiar del proceso, no del material

Tres gates que habrían cazado 19 de los 73 hallazgos y que cuestan poco:

- **Gate de propagación.** Cuando una corrección toca una regla que aparece en más de un sitio, el commit no pasa si la cadena vieja sigue existiendo en el fichero. Habría cazado el `a→e` rumano, el `di/ti/ni` checo, las cinco vocales de `:868` y las tres puertas de velocidad rusas.
- **Gate de recuento.** Todo número declarado «medido» lleva el comando que lo mide, y el CI lo vuelve a correr. Habría cazado los inventarios del ep. 1 y del ep. 3, y las duraciones y presupuestos léxicos de las piezas nuevas.
- **Gate de mezcla de escrituras por token**, no por rango exótico. Habría cazado `obособление` — y lo habría cazado **el día que se escribió el detector que no lo caza**.

Y una regla de redacción, que es la que evita el molde n.º 1: **una corrección que sustituye una afirmación generativa por otra afirmación generativa no es una corrección, es un cambio de apuesta.** Si la regla nueva no viene con su lista de excepciones y con los ejercicios que la desmienten, no está corregida.
