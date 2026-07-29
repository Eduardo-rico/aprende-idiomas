# La serie — portugués europeo, de A1 a C2

**Documento de edición final.** Cierra la revisión del corpus por niveles, fija la dirección de la serie, publica los ocho primeros episodios ya corregidos por un nativo de Lisboa, define el molde de la sesión de 25 minutos y deja la lista exacta de lo que hay que decidir antes de gastar un euro en voces.

Todo el portugués de este documento es europeo. Lo que se cita del corpus actual se cita con su `id` o con `archivo:línea`.

**Medido hoy sobre el repo** (`node` sobre `lib/data/languages/pt/`, 2.037 ítems en 9 bloques, 20 historias):

| | valor |
|---|---|
| `você` (todas las grafías) | **273** · en minúscula 205 |
| `chamo-me` · `desculpe` · `não percebi` · `obrigada` | **0 · 0 · 0 · 0** |
| `obrigado` | 7, ninguno con nota de concordancia |
| `faz favor` | **6**, y las 6 son `se faz favor` — el grito de mostrador no existe en el corpus |
| `galão` · `talão` · `apelido` · `se calhar` · `giro` · `dezasseis` · `dezassete` · `dezanove` · `Angola` · `machimbombo` | **0 cada uno** |
| `bica` | **0 reales** (los 2 hits son subcadenas de «silábica») |
| `pois` · `pronto` | 5 · 4 |
| `autocarro` · `comboio` · `telemóvel` | 14 · 5 · 9 — y las 14 de `autocarro` son metalingüísticas (`b10.json:442,455,467,1668,1669,3678,4241,4247`) |
| `estar a + infinitivo` conjugado | **24** en 2.037 ítems |
| gerundios en `-ndo` | ~200 formas (las de más peso: `esperando` 15, `falando` 12, `pensando` 10, `tentando` 9) |
| historias con `lessonIds: []` | **20 de 20** · 4.068 palabras de variante `pt` huérfanas |
| `glossary.json` · `vocab-catalog.json` | 49 · 141 entradas |
| `manifest.json` | MiniMax-M3 / `speech-2.8-hd`, **4 voces**: `Portuguese_Wiselady`/`Portuguese_Narrator` (pt-pt), `Portuguese_SentimentalLady`/`Portuguese_JovialMan` (pt-br) |

---

# 1. El material que ya existe, nivel por nivel

Cinco profesores abrieron el corpus ítem por ítem. El diagnóstico coincide en las cinco bandas y se resume en una frase: **el curso no enseña mal portugués, enseña portugués brasileño con bandera portuguesa, y allí donde toma una decisión doctrinal la toma contra el portugués europeo.** No es un problema de calidad de ítems: es un problema de premisa. Y la capa que el alumno lee cuando falla —`esContrast`— es la más contaminada de todas.

| Banda | Ítems | Leídos con su texto | Salvable | Qué significa ese porcentaje |
|---|---:|---:|---:|---|
| A1 | 587 | 430 | **34 %** | reutilizable tras reescribir la glosa y hacer el scrub europeo; *servible tal cual*: ~12 % |
| A2 | 401 | 280 | **45 %** | tras una pasada mecánica barata, sin reescribir contenido |
| B1 | 465 | 520 (con solapes) | **35 %** | tras borrar entera la capa `esContrast`, que hay que reescribir a mano |
| B2 | 518 | 540 | **38 %** | y de ese 38 %, buena parte es A2/B1 disfrazado |
| C1 | 57 | 82 | **12 %** | 7 ítems de mesóclise; el resto es B1 bien hecho |
| C2 | 0 | — | **0 %** | no hay nada que salvar porque no hay nada |

Lo único del repositorio que es portugués europeo genuinamente bueno son **las 20 historias en su variante `pt`** —`estava a lidar`, `levam-nos`, `meteu-se`, `Conta-me`, `pequeno-almoço`, `acharam piada`— y están huérfanas: `lessonIds: []` en las 20. Son mejores que los ejercicios que supuestamente las preparan.

---

## 1.1 · A1 — 587 ítems · se salva el 34 %

### El veredicto

A1 no está enseñado: está cubierto, y en b1 ni siquiera eso — está **mal** enseñado, que es peor. La lección 2 entera (51 ítems) está construida sobre la idea falsa de que portugués y español acentúan distinto las mismas palabras: repite cuarenta veces que «difícil es esdrújula en PT y grave sin tilde en ES» (`b1/045fccec`, `079125e5d`, `81997b51`, `bdcff0e2`, `aba830a5`) cuando en las dos lenguas es paroxítona y en las dos lleva tilde. La lección 1 enseña que el acento agudo marca vocal cerrada (`b1/7093d2de`) con el ejemplo «café /kaˈfɛ/», que se desmiente a sí mismo en la misma tarjeta.

Un alumno que haga b1 completo sale escribiendo «habito» sin tilde (`b1/133a98bd` se lo ordena), creyendo que la W se llama «dúplex» (`b1/3e26e656`), que el alfabeto tiene 23 letras (`b1/32400dc7`, contradicho por otros tres ítems del mismo bloque), que la ⟨ç⟩ va ante e/i (`b1/bf81e577` y `b1/80945c47`, la regla exactamente invertida) y que `avó`/`avô` es una diferencia entre Brasil y Portugal en vez de abuela/abuelo — siete ítems lo machacan y uno tiene grabado en TTS el agramatical «Minha avô mora em Lisboa» (`b1/086de331`).

Lo que el plan llamaba «el activo limpio» —las correspondencias ES→PT— no lo es: son 51 ítems y no 64 (el 64 salía de contar etiquetas duplicadas), el concepto `b1-corresp-ll-lh` (`concepts.json:17`) mezcla dos reglas distintas y ninguna es «-ll-→-lh-» (ojo→olho es j→lh; llamar→chamar es ll→ch), y **falta la única correspondencia que de verdad genera palabras nuevas: h-→f-** (hijo/filho, hacer/fazer, hablar/falar), mientras 21 ítems se dedican a una «h muda» que también es muda en español, o sea a un contraste inventado.

Y el nivel, medido como tarea y no como forma, casi no existe: **cero horas** («que horas são» = 0), tres ítems con un numeral por encima de diez y los tres son «el alfabeto tiene 26 letras», dos meses, cero `desculpe`, cero `com licença`, cero `bom dia`, cero `chamo-me`, cero morada/apelido/código postal, y 35 ítems con gerundio `-ndo` frente a 4 con `estar a + infinitivo`.

### Lo que sirve de plantilla

| id | tipo | texto | por qué es plantilla |
|---|---|---|---|
| `b3/6b1f353f` | translation | «¿Me trae la cuenta, señor?» → **«Traga-me a conta, por favor»**, override **«Traga-me a conta, se faz favor»**, alternativas «Poderia trazer-me a conta, se faz favor?» / «A conta, se faz favor» | Tarea real (pagar), ênclise natural, fórmula europea, y varias formulaciones aceptadas con distinto grado de cortesía. **Todo A1 debería parecerse a esto.** |
| `b2/9fb06ef7` + `2a484dc4`, `2ad0c58f`, `c550419f` | error_correction | «A problema é muito difícil» → **«O problema é muito difícil»** · «En PT 'problema' es masculino; el -a final no marca femenino como en español» | Los 17 `error_correction` de b2+b3 son la única capa escrita por alguien que conoce la interlengua del hispanohablante. Conservar con `reviewStatus: human-verified` y **generar veinte veces más**. |
| `b3/da56890d` + `b3-l4` entero (`0f1ef40f`, `52dcaa95`, `6ad1e3dc`, `640d2e4c`) | error_correction | «Haver muitas pessoas na festa» → **«Há muitas pessoas na festa»** · «Há dois anos que estudo português» | La única lección del nivel que enseña una diferencia PT-PT/PT-BR de verdad y la enseña bien: existencial impersonal como norma europea frente al `tem` brasileño. |
| `b3/1a7ec3f3` | flashcard | «Mi novia vive en São Paulo» → **«A minha namorada mora em São Paulo»** · «El posesivo se usa con artículo» | **El único ítem de ~430 revisados que enuncia la regla del posesivo con artículo.** Está enterrado en la lección de haver/ter y debería ser el eje de b2-l3. |
| `b1/798ef701` | fill_blank | «Na mesa, há ___ pão, ___ café e ___ laranja» → um / um / uma | Artículo indefinido, existencial `há` y léxico de mesa en una frase que un A1 puede decir el primer día. Debería haber cincuenta y hay una. |
| `b3/d5a1df41` | fill_blank | «___ mais devagar, por favor! Não há pressa» → **Fala** | El imperativo de `tu`, la forma que el descriptor A1 exige. Sirve tal cual **en cuanto se le quite la alternativa «Fale»**, que hoy acepta el tratamiento contrario. |
| `b1/4d0b69ee` | translation | «El carro es rojo» → «O carro é vermelho», alt. **«O carro é encarnado»** | Guiño europeo tratado como lo que es: una alternativa aceptada, no una curiosidad metalingüística. |

### Lo que se tira

- **La lección 2 de b1 entera (51 ítems).** `b1/133a98bd` («hábito = paroxítona → sin tilde»: es proparoxítona y lleva tilde), `b1/baa408d7` («'gentil' es esdrújula»: es oxítona y no lleva ninguna), `b1/e6eae5d6` («ônibus… sin tilde», escribiéndolo con circunflejo). No se repara: se descarta.
- **Los dos ítems raíz de la acentuación**, `b1/7093d2de` (agudo = cerrada, falso) y `b1/e2a9ef15` (circunflejo bien enunciado, ilustrado con «vovô /voˈvɔ/», abierta). Son la base de todo lo demás y hoy el SRS los graba invertidos.
- **El clúster `avó`/`avô`: `086de331`, `4db8fa08`, `8b9118d0`, `f56d9fa6`, `f5a62aac`, `666eaeb9`, `cb398595`** — siete ítems y sus MP3, más sus entradas de manifest. `4db8fa08` acepta «Meu avó já morreu»; `086de331` tiene grabado «Minha avô mora em Lisboa».
- **`b1/bf81e577` y `b1/80945c47`** (la ⟨ç⟩ ante e/i, exactamente al revés), y el audio de `bf81e577` empieza con «Cê», reducción brasileña, en la primera lección de un curso europeo.
- **La lección 5 de b1 (51 ítems), ~40 con fonología falsa.** `b1/08716d78` da /ʁ/ intervocálico a «caro», destruyendo el par mínimo caro/carro; `b1/6d37d0a6` afirma lo contrario para la misma palabra; `b1/4626c4a6` da la misma transcripción a las dos variantes; cinco sitios describen [ʁ] como «vibrante alveolar».
- **Palabras y etimologías inventadas:** `b1/3e26e656` («dúplex»), `b1/8695dcff` («'pará' es el verbo parar»), `b1/5e68ce66` («papel» vs «papél», dos palabras idénticas), `b1/c7a2263e` («regráfico»), `b1/c2c0c60d` («pôr lleva circunflejo por la contracción de 'poder'»), `b1/15eab0ae` («'colectivo' (PT)» por autobús: es rioplatense).
- **Seis `fill_blank` de b2 que aceptan la forma sin contraer** —`462ff808`, `52c87804`, `61a585cf`, `d527e384`, `df4b9ea9`, `fd0eb5d6`— «de a», «em o», «por a». La lección existe para enseñar que la contracción es obligatoria y el corrector felicita al que no la hace. Reparación mecánica de diez minutos.
- **El eje pronominal de b3-l2 (53 ítems).** `b3/8bbff80a` enseña próclise brasileña como norma; `b3/d90b7e07` tiene por audio «Dá-me o livro» y por glosa «el pronombre va ANTES del verbo»; `b3/e1e393b7` inventa que «me + lhe se mantiene igual» cuando el portugués contrae `mo`/`to`/`lho`; `b3/08ff77bd` da por correcto «Vós nos a apresentastes ontem». Se escribe de cero.

### Los huecos

1. **Números, horas y fechas: no existen.** 3 ítems con numeral > 10 y los tres son «el alfabeto tiene 26 letras»; 0 con la hora; 2 con un mes; 5 con un día de la semana. Faltan 0-1000, la hora en las dos formas, la fecha, la edad («quantos anos tens?» = 0) y el teléfono. **~120 ítems nuevos.**
2. **El repertorio de cortesía PT-PT entero:** 0 `desculpe`, 0 `com licença`, 0 `bom dia/boa tarde/boa noite`, 0 `adeus/até logo`, 1 `olá`, 0 `chamo-me`, 0 `como se chama`, 0 `não percebi`, 0 `pode repetir`, 3 `se faz favor`. Y ni un ítem sobre `obrigado`/`obrigada` concordando con el hablante, que es uno de los tres errores capitales del criterio de salida.
3. **El sistema de tratamiento**, que en el plan es el primer contenido pragmático y hoy no está en la banda: 46 ítems usan `você`, y de los 13 `conjugation` del presente **cero** usan `tu`. Los tres únicos overrides pt-pt (`b3/d03061db`, `915dc048`, `15c6e949`) cambian `answer` sin tocar `person` y renderizan **«você falas»**.
4. **Ênclise como orden por defecto.** 24 apariciones y casi todas accidentales, mientras la regla explícita que se enuncia es la próclise brasileña. Falta el paquete `chamo-me / dá-me / desculpe-me / levanto-me` desde la lección 1 y la lista cerrada de atractores.
5. **`estar a + infinitivo`:** 4 ítems frente a 35 con gerundio. Si no se instala en A1, en B1 ya está fosilizado.
6. **Posesivo con artículo:** obligatorio en PT-PT y hoy es la excepción (`b2-l3` se apoya en «meus filhos», «minha irmã»). Hay que invertirlo.
7. **Fonología europea entera.** La redução vocálica átona aparece **una vez** en toda la banda y de refilón (`b1/e003d393`), y el mismo ítem afirma que en BR la r «se elide», que es falso. No hay ⟨l⟩ final velarizada, no hay sândi, no hay ⟨ei⟩ lisboeta, y **no hay un solo par mínimo con audio A/B** frente a un descriptor que pide discriminar 18 de 20.
8. **Tipos de tarea.** 0 dictado, 0 discriminación de pares mínimos, 0 formulário, 0 lectura de ementa/cartaz/horário, 0 elección de tratamiento situada, 0 shadowing, 0 mediación.
9. **Léxico europeo básico:** 0 autocarro usado, 0 comboio, 0 pequeno-almoço, 0 casa de banho, 0 bilhete, 0 morada, 0 apelido, 0 sumo, 1 telemóvel — frente a garçom, cardápio, ônibus, celular y ruim servidos sin override.

### Resecuenciación propuesta

El fallo no es el orden entre bloques: es que la banda **empieza por lo más abstracto y lo que el alumno no puede verificar**. Su primera pantalla hoy es «¿Cuántas letras tiene el alfabeto portugués?». Cuatro tramos, al revés:

- **Tramo 1 (sem. 1-2) — Oído y boca antes que ojo.** Pares mínimos con audio A/B (caro/carro, avó/avô, mão/mau, pá/pai, mal/mau, sê/se), ⟨s⟩ coda → [ʃ], nasales, y la redução vocálica presentada como *la razón por la que no entiendes a un lisboeta*, con dictado desde el primer día. El material existente aporta ~8 ítems; hay que escribir ~150.
- **Tramo 2 (sem. 2-4) — Identidad y tratamiento.** `chamo-me` / `como se chama` / `prazer`; `tu` con un igual frente a 3.ª persona sin pronombre con un desconocido; `obrigado`/`obrigada` concordando; `desculpe` frente a `com licença`; `se faz favor`. Con ênclise instalada desde la lección 1, porque `chamo-me` y `dá-me` *son* ênclise. Hoy esto vive en b10-l1, semana ~34 de 36, y allí está mal enseñado.
- **Tramo 3 (sem. 4-7) — La máquina nominal.** b2-l1 (artigos y las 24 contracciones) tal cual, que es lo mejor de la banda; b2-l2/l3 con el posesivo con artículo reescrito como norma; y **aquí, no antes**, los números, las horas y las fechas, que es donde el artículo y la contracción se vuelven útiles («às três da tarde», «no dia dez»).
- **Tramo 4 (sem. 7-12) — El verbo en uso.** b3-l1/l3/l4 con el paradigma en las seis personas incluida `tu`, `há` existencial, `estar a + infinitivo` como única forma progresiva, imperativo de `tu`.

Las correspondencias ortográficas ES→PT **no son una lección**: son una herramienta de generación léxica que se distribuye en píldoras a lo largo de los cuatro tramos (`-ção` al llegar a los sustantivos, `h-→f-` al llegar a los verbos), y hay que reescribir su inventario antes. Y **b1 tal como existe hoy no se resecuencia: se congela** — desaprender una regla falsa grabada por el SRS es más caro que aprenderla bien la primera vez.

---

## 1.2 · A2 — 401 ítems · se salva el 45 %

### El veredicto

El A2 está cubierto, no enseñado, y en el punto que más importa —el tratamiento— está enseñado **al revés**. De 1.095 ítems en b2/b3/b4/b5/b10, sólo **20 (1,8 %)** obligan a producir una forma inequívoca de `tu`, y de los 39 drills de `conjugation` **cero** usan `tu` mientras cinco usan `você` con la pista `hintEs: "tú/usted habla(s)"`, que enseña la confusión en vez de deshacerla.

La lección de tratamiento (b10-l1, 63 ítems) está gobernada por `mdx/b10/l1-registro-formal-informal.mdx:1`, que dice literalmente que **«'Você' es el equivalente a 'tú' español»** y remata en su `<Tip>`: «Si es alguien de tu edad con quien tienes confianza, 'você' es suficiente». La palabra `tu` no aparece ni una vez en toda la nota, y sus tres ejemplos son brasileños en la colocación del clítico. Un mexicano que la aplique en Lisboa tuteará con la forma que allí suena distante. Alrededor conviven cuatro reglas mutuamente excluyentes (`b10/1f7391d9`, `7d06ab4a`, `887c4692`, `2aaa15ef`) y ninguna enuncia la regla portuguesa real: **la deferencia se hace en 3.ª persona sin pronombre, con nombre o cargo.**

Y el motor sabotea lo poco que está bien: **10 de los 11 `fill_blank` de b4-l4 llevan como alternativa aceptada el tiempo contrario** —`992a8bcf` da por buena «Quando eu **foi** criança», que ni concuerda en persona—, de modo que el único ejercicio del nivel que mide el contraste perfeito/imperfeito no lo mide. Y **los 24 `multiple_choice` de la banda tienen `answer: undefined`**: 24 ítems imposibles de aprobar.

### Lo que sirve de plantilla

| id | tipo | texto | por qué |
|---|---|---|---|
| `b4/2720f54b` | error_correction | «Ontem eu **falé** com ela» → «Ontem eu **falei** com ela» · «La 1.ª del perfeito en -ar termina en -ei, no en -é como el español 'hablé'» | La plantilla del nivel. Sus hermanos `c5b8eb1e` (fazi→fiz), `258da011` (tuvo→teve), `b3/74821f0d` (sabo→sei), `b5/85396ad6` (falaré→falarei), `b5/eb7f85c1` (vou a falar→vou falar) son igual de buenos. |
| `b3/2c9d83a8` | translation | **«Não me digas mentiras, diz-me só a verdade.»** · «PT-PT: imperativo negativo 'não digas' (tu). PT-BR: 'não diga' (você).» | El único ítem de la banda que enseña el imperativo negativo de `tu` **y** nombra la variedad en la misma respiración. Debería haber cuarenta. |
| `b5/b2959079` | error_correction | «Se eu **teria** dinheiro…» → «Se eu **tivesse** dinheiro…» · «calco del español 'si tendría'» | Ataca una transferencia real. Alto rendimiento, coste cero. |
| `b10/2c640e11` | translation | «Formamos uma fila enorme para entrar no show» → override PT **«Formámos uma fila enorme para entrar no concerto»** · «'Bicha' en BR = fila; en PT-PT es ofensivo» | El único ítem que combina las tres cosas que el curso necesita: contraste léxico real, la forma `Formámos` del perfeito europeo, y una advertencia con consecuencia social. |
| `b10/2ee3583d` | translation | «As cartas continuaram **a chegar**» / alt. «continuaram chegando» · «En PT-PT se prefiere 'continuar a + infinitivo'» | El modelo exacto para instalar `estar a + infinitivo`: por contraste, no por regla. |
| `b3/5557e460` | translation | **«Ela está-lhe a contar agora»**, alt. «Ela está a contar-lhe agora» | Acepta las dos colocaciones legítimas del clítico en la perífrasis europea. Fino, correcto, y es lo que no hace el resto de su lección. |
| `b3/849bc051` | fill_blank | «Quando ___ vejo, fico nervoso» → **te** · «en subordinadas con 'quando', próclise obligatoria» | La regla de colocación europea bien enunciada y bien ejercitada, en medio de una lección que enseña próclise brasileña indiscriminada. **Salvar éste y tirar la doctrina que lo rodea.** |

### Lo que se tira

- **`mdx/b10/l1-registro-formal-informal.mdx` entero.** Se reescribe de cero como dos sistemas separados: `tu` entre iguales, y 3.ª persona sin pronombre + nome/cargo para la deferencia.
- **`b10/7d06ab4a`** («En PT-PT, 'tu' es informal y 'você' es formal») y **`b10/2aaa15ef`** («El 'tu' es regional, norte de PT»). El segundo es el que justifica que el alumno nunca aprenda a conjugar `tu`: le dice que no le hace falta. Y lo desmiente la nota MDX de su propia lección hermana.
- **`b10/8568365f`**: audio «Oi, meu amigo! Tudo bem? Vamos combinar de sair amanhã, tá?», pregunta «¿qué pronombres de tratamiento se usan?», respuesta marcada **«Tu e você»**. En ese audio no aparece ninguno de los dos.
- **`b4/655a7e71`**, cuyo `variantOverrides.pt-br` cambia la respuesta a **`toma`** (presente) en un ejercicio de hábito pasado; **y las 10 alternativas suicidas de b4-l4** (`992a8bcf`, `2ae6a2e6`, `6d00a1c0`, `91ac6f99`, `dd326215`). `components/cards/FillBlankCard.tsx:20` confirma que las alternativas se dan por buenas.
- **`b3/849826de`** («Imperativo de **tu**: FAZER→FAZ | DIZER→**DIGA** | VIR→**VENHA**»), `a9255b44` («Não DIGA mentiras» por defecto, la forma de `tu` escondida en el override, y el modo llamado «subjuntivo» en la base y «conjuntivo» en el override) y `f055722c` (el enunciado conjuga FALAR y la respuesta da SÊ/SEJA). **Las claves de variante están invertidas y el alumno de PT-PT recibe siempre la versión brasileña por defecto.**
- **44 ítems con léxico exclusivamente brasileño fuera de la lección diatópica, 40 sin override europeo** (`garçom`, `cardápio`, `moletom`, `vestibular`, `ônibus`, `contato`, `celular`, `reais`). `b3/56cc385d` responde `garçom` a «¿cómo se dice mesero?» mientras la historia de esa misma lección (`stories/b3-s2`) dice correctamente `empregado de mesa` y `ementa`.
- **`b3/d90b7e07`** y su lección: audio «Dá-me o livro», glosa «el pronombre va ANTES del verbo». Más `4fef5e1e` («vós **láveis** a carta», que no es palabra), `7e95ece4` («'lo' se convierte en artículo»), `b5/30ef3472` («Vais **a** poupar», con la alternativa aceptada «Vais a **ahorrar**»), `b5/8125e2e5` («Quando eu **vou** crescer»).
- **Los 24 `multiple_choice` con `answer: undefined`** (`b63d821e`, `22073fb4`, `f076b301`, `a113611c`, `4b100602`…).

### Los huecos

1. **El paradigma de `tu` como forma por defecto**, con paridad frente a `eu` (que hoy acapara 24 de 39 drills): presente completo, perfeito (las 14 raíces fuertes en 2.ª persona, que es donde la forma es más ajena al español), imperfeito, futuro y condicional.
2. **Los cinco drills con `hintEs: "tú/usted habla(s)"`** (`d03061db`, `915dc048`, `15c6e949`, `72e90352`, `37740d01`) no son un hueco: son contenido activo que enseña la confusión.
3. **La deferencia real:** no existe ni un ítem con 3.ª persona sin pronombre («A Maria quer açúcar?», «O senhor doutor precisa de quê?»), ni la regla operativa («ante la duda, en Portugal no uses `você`»), ni el cambio de tratamento dentro de una conversación, que es descriptor explícito del A2.
4. **Imperativo negativo de `tu`:** existe exactamente un ítem, y la nota MDX de la lección sólo da ejemplos de `você` **e invierte la regla morfológica** (dice que `faça` viene del indicativo; viene del conjuntivo).
5. **`estar a + infinitivo` enseñada:** 23 ocurrencias en 1.095 y ninguna lección la enuncia. Falta el ejercicio que fuerza la conversión gerundio → `a + infinitivo`, y las extensiones `continuar a`, `começar a`, `andar a`.
6. **Posesivo con artículo:** en b2-l3 sólo 8 ítems lo muestran y 5 muestran la forma pelada. Y `f6f47168` da como correcto «Eu perdi **minhas** chaves».
7. **Ênclise/próclise con reglas de atracción**, y la **ênclise con asimilación** (`conhecem-na`, `fá-lo`, `di-lo`), hoy inexistente: `b7bc11e4` da «Eles a conhecem bem» por bueno.
8. **Léxico europeo de la vida cotidiana**: `pequeno-almoço`, `autocarro`, `comboio`, `telemóvel`, `casa de banho`, `talho`, `frigorífico`, `bica/imperial/galão/meia de leite`, `bifana`, `multibanco`, `MB Way`, `NIF`, `finanças`, `junta de freguesia`, `centro de saúde`, `SNS`, `fatura com contribuinte`. Y `fixe`, `giro`, `pois`, `pronto`, `se calhar`, `olhe que`.
9. **Los 49 falsos amigos del glosario no llegan a ningún ejercicio.** `b3/6881454f` pregunta literalmente por «propina» y sólo enseña `gorjeta`, sin mencionar la trampa.
10. **Mediación ES↔PT: cero ítems**, pese a ser la destreza que un hispanohablante tiene disponible desde el día uno. Y las 288 traducciones existentes tienen `sourceLang`/`targetLang` invertidos en decenas de casos.
11. **Fonología del habla conectada:** cero elisión de [ɨ], cero sândi, cero desplazamiento acentual (`falo`/`falámos`/`falaram`).
12. **Producción libre: cero.**

### Resecuenciación propuesta

**El tratamiento vive en b10-l1, semana ~34 de 36, y el paradigma de `tu` no vive en ninguna parte.** La decisión que un alumno toma en su primer intercambio con un portugués se le enseña ocho meses después, y cuando llega, la regla que se le da es la que ofende.

1. **`tu` entra con el presente, en b3-l1, en paridad estricta con `eu`**; y el sistema de tratamiento se enseña ahí mismo, en b3-l2, no en b10.
2. **b3-l2 se parte en dos:** pronombres sujeto + tratamento bajan a A1 tardío; la colocación pronominal sube desde b8 y se queda aquí, **reescrita** — su doctrina actual es brasileña de raíz y no se parchea.
3. **b3-l3 (imperativo) mantiene su sitio pero se le voltean los defaults:** `fala/faz/diz/vem/sê/levanta-te` como base, `fale/faça/diga` como variante de deferencia. El imperativo negativo de `tu` entra aquí, un bloque entero antes de b6.
4. **b4 se queda: es el corazón sano del nivel.** Pierde b4-l5 (mais-que-perfeito simples), que se reetiqueta C1 literario, y gana el `tu` del perfeito irregular.
5. **b5 se reequilibra:** en portugués europeo el futuro simples está mucho más vivo que en BR, al revés de lo que sugiere el corpus.
6. **b10-l1 desaparece como lección de A2** (sus ~15 ítems salvables de convenciones de correo se reparten; el registro burocrático se va a B2/C1). **b10-l2 se queda** —es lo mejor del bloque— pero movida a un punto en que el alumno ya tenga un sistema europeo que contrastar.

---

## 1.3 · B1 — 465 ítems · se salva el 35 %

### El veredicto

Las **formas** verbales son en su mayoría correctas; el **marco** que las envuelve —el ejemplo, la nota de contraste, el distractor, la variante marcada como «la buena»— enseña portugués brasileño, y con frecuencia alarmante enseña portugués inexistente.

Las dos sospechas del plan son ciertas y peores de lo que decía:

- **El conjuntivo ocupa seis lecciones consecutivas** (b5-l4 + b6-l1 a b6-l5): 338 ítems, el 16,6 % del corpus entero. Y el reparto interno está invertido respecto a la necesidad del hispanohablante: **134 ítems con imperfeito do conjuntivo** —lo que un mexicano ya trae hecho desde «si tuviera»— frente a **46 con futuro do conjuntivo**, que es el único que su lengua no tiene.
- **b7 está construido íntegramente sobre el gerundio brasileño.** `estar a + infinitivo` aparece 20 veces en los 2.037 ítems, y en b7-l2-gerundio (58 ítems) aparece **5**, siempre como alternativa aceptada o distractor, jamás como respuesta exigida. `b7/451780c2` **corrige** «Ele está comer» → «Ele está comendo», y `mdx/b7/l2-gerundio.mdx` instruye textualmente: *«si en español dices 'está hablando', en portugués es 'está falando'»*. El curso no omite la forma europea: **consagra la brasileña como la correcta.**

Y la capa `esContrast` contiene invenciones puras: «'quisesse' en BR, 'quissesse' en PT-EU» (`b6/3d44b946`), «en PT-BR se usa 'teu', en PT-PT se prefiere 'seu'» (`b6/1f424c71`, exactamente al revés), «en PT-BR se escribe 'afecto'… en PT-PT cambia a 'afeto'» (`b10/c398eb39`, al revés y anacrónico), «'Abs' viene de 'abusivamente'» (`b10/0b091314`; viene de `abraços`).

Un alumno que haga estos 465 ejercicios sale sabiendo rellenar huecos con `-asse` y `-esse`, y sale sin poder decir «estou a tratar disso», sin haber conjugado `tu` ni una vez (0 de 49 conjugaciones de la banda) y creyendo que en Lisboa se dice «Me fala».

### Lo que sirve de plantilla

| id | tipo | texto | por qué |
|---|---|---|---|
| `b4/b723fb8a` | error_correction | «Enquanto eu **estudei**, o telefone tocou» → «Enquanto eu **estudava**…» · «fondo en imperfeito, evento puntual en perfeito» | Error real, corrección mínima, explicación que nombra la razón sin metalenguaje. Los 43 `error_correction` de la banda son todos así. |
| `b4/069d7ad0` | flashcard | «'Fiquei feliz' vs 'Ficava feliz'» → «Fiquei = mudança pontual. Ficava = estado contínuo» · «Ao vê-la, fiquei feliz / Quando a via, ficava feliz» | El único formato que obliga a **contrastar** dos formas en un par mínimo semántico en vez de recuperar una etiqueta. |
| `b4/09935e6a` | flashcard | «Yo caminaba por la playa cuando de repente encontré una moneda» → «Enquanto eu caminhava pela praia, encontrei uma moeda de repente» | La única tarea que pide **construir** una oración desde una intención comunicativa. Debería ser el tipo dominante de B1. |
| `b6/31f581c1` | error_correction | «Quando eu **terei** tempo, eu te ligo» → «Quando eu **tiver** tempo…» | El error capital del hispanohablante, atacado con la forma que el español no tiene. **Es el corazón de B1 y hay uno solo; hacen falta treinta.** |
| `b6/173d1ece` | flashcard | «Error común: 'Se eu sei…' (**españolismo**)» → «Correcto: Se eu soubesse…» | El framing «esto es tu español asomando» es el que desmonta el portuñol antes de que se fije. |
| `b8/18e1b7bb` | translation | «Ya que no existe otra opción…» → **«Já que não existe outra opção, teremos de aceitar as suas condições»**, alt. «Uma vez que…», «Visto que…» | Portugués europeo real (`teremos de`, posesivo con artículo) y tres alternativas que enseñan un paradigma en vez de una sola respuesta. |
| `b4/35cc02df` | conjugation | perfeito, nós → `trabalhamos` · «En PT-PT el acento distingue el tiempo: **trabalhámos** (perfeito) vs trabalhamos (presente); en BR ambas se escriben igual» | El único ítem de conjugación de la banda que enseña una diferencia PT-PT real. Demuestra que el formato sirve. |
| `stories/b6-s2`, `b8-s1` (variante `pt`) | historia | «estava a lidar», «levam-nos», «meteu-se», «Conta-me», «acharam piada», «pequeno-almoço» | **El mejor portugués europeo del repositorio, y está huérfano.** Es el modelo de lengua al que hay que alinear los ejercicios, no al revés. |

### Lo que se tira

- **`b7/451780c2`** y con él el encuadre de `mdx/b7/l2-gerundio.mdx` (que además glosa «encontrar» con «maar ook», neerlandés). Es el ítem más dañino de la banda porque está en la capa que el plan declaraba mejor hecha.
- **`b8/fa57cc56`**: «Eu ___ cedo todos os dias» con opciones `["me acordo","acordo-me","acordo","me acordo"]` y respuesta `"me acordo"`. La opción está **duplicada**, la respuesta marcada es próclise inicial (agramatical en PT-PT) y **la única forma correcta —`acordo`— figura como distractor**. Con sus tres propagaciones: `a3ea04a7`, `1fd04f2c`, `7d26539b`.
- **`b8/fb9bfb23`**: audio «Se derem oportunidades aos jovens, tudo **se transformará**», pregunta por la colocación, clave **«Mesóclise»**. Es próclise. Y el `esContrast` contiene alemán («'Se **ihnen** oportunidades' no existe»).
- **`b6/3d44b946`** («quissesse» aceptado como respuesta y vendido como rasgo europeo) y **`b6/278e78fc`** («ouver» como «forma arcaica aceita»; el verbo llamado «Haverbir»).
- **`b6/e9764a9c`**: «Se ele ___ (ter) tempo» con clave **`ter`**, en la lección llamada futuro-conjuntivo. Y **`b6/2c90a6da`** («Assim que nós ___ terminar» → `terminar` en vez de `terminarmos`).
- **`b6/1f424c71`** y **`b6/442b94b3`**: los dos empujan al alumno hacia el brasileño creyendo que se acerca al europeo.
- **`b10/3dec5fb6`** («'Próprio' es un vocativo afectuoso»: no lo es en ninguna variedad), **`b10/0b091314`**, **`b10/b646cfbb`** («se dice 'fazer o favor', no 'fazer favor'», cuando `faz favor` es *la* fórmula de Portugal).
- **`b8/1312dd96`**: «Hay que alimentarse bien» → **«Precisa-se de alimentar-se bem»**, con la alternativa aceptada «Tem de-se de alimentar bem». La respuesta que el sistema premia no es portugués.
- **`b4/73288d4c`** (inventa «era ido», llama irregular a un participio regular), `b4/62e47684` («Eu fizera feito»), `b4/9cc3099f` («Nós tínhamosido»).
- **`b7/94b6b800`** («engalinhando», que no es palabra) y **`b7/d3d578cf`** (pide gerundio y la respuesta no lo contiene, y encima usa próclise brasileña).
- **`b5/5112fc8c`**: pregunta por el futuro do presente y responde «vou realizar», que es perifrástico — en la lección que existe para distinguirlos.

### Los huecos

1. **`estar a + infinitivo` productiva.** 20 apariciones en 2.037 (0,98 %) y **cero** ítems que la exijan como respuesta en contexto comunicativo. Falta el presente, el pasado, la negación (`não estou a perceber`) y el uso como muletilla (`estás a ver?`, 0 apariciones).
2. **El paradigma de `tu` en tiempos de B1.** 0 de 49 conjugaciones; ni un ejercicio pide `fizeste`, `estiveste`, `vieste`, `quiseste`, `poderás`, `terias`, `souberes`, `quiseres`. Ni el imperativo de `tu`, afirmativo o negativo.
3. **Futuro do conjuntivo con densidad suficiente y en contexto oral.** Faltan los usos fosilizados: `quando quiseres`, `se precisares`, `assim que puderes`, `enquanto houver`, `faças o que fizeres`, `seja como for`. Y los irregulares completos con contraste contra el infinitivo homógrafo.
4. **Pretérito perfeito composto con su valor iterativo.** «Tenho estado doente» NO es «he estado enfermo»: es «llevo un tiempo enfermo». Es el falso amigo gramatical más caro de B1 y el corpus lo trata como equivalente.
5. **`é que` y el orden marcado.** 12 apariciones, ninguna enseñada. Sin esto se suena a traducción del español en cada frase.
6. **Marcadores y gestión del turno:** 0 `se calhar`, 0 `epá`, 0 `lá isso`, 0 `estás a ver`. Y **cero ítems de tipo interacción** en toda la banda.
7. **Verbos de dativo psicológico:** `apetecer` = 0 apariciones. Faltan `custar-me`, `fazer-me falta`, `saber-me bem`, `dar jeito`.
8. **Colocação repartida por atractor**, y la ênclise con transformación fonética (`fá-lo`, `di-lo`, `pô-lo`, `vemo-nos`, `dá-mo`, `dá-lho`): ni un ítem.
9. **Léxico de la vida real en Portugal:** 0 multibanco, senha, freguesia, centro de saúde, fiador, recibo verde, finanças, talão, ementa, morada. En cambio: `ônibus` 26, `vestibular` 15, `café da manhã` 6.
10. **Coherencia ortográfica AO1990:** el corpus mezcla `afecto/afeto`, `cerimônia/cerimónia`, `registo/registro`, `facto/fato` sin criterio.
11. **Producción y mediación: cero tareas**, pese a que las 20 historias bivariantes regalan el corpus de la tercera.
12. **Comprensión oral que exija la gramática:** 14 de 25 `listening` de b6 y 10 de 15 de b7 preguntan por la **forma**, no por el mensaje.

### Resecuenciación propuesta

B1 se ordena por **función comunicativa**, no por tiempo verbal, y el conjuntivo deja de ser un bloque.

- **B1-A · «El presente que no tienes» (4 sem.).** `estar a + infinitivo` productiva (b7-l2 reescrita desde cero), `ter de`, perfeito composto iterativo, `é que`, y el paradigma de `tu` en presente e imperativo subido desde b3. La ênclise básica se consolida aquí, no en la semana 28.
- **B1-B · «El pasado que ya narras» (3 sem.).** b4-l1 a l4 casi tal cual. El mais-que-perfeito simples **sale** a C1 receptivo-literario, y con él b4-l5.
- **B1-C · «Lo que va a pasar y lo que quizá pase» (4 sem.).** Sube el **futuro do conjuntivo** de la semana ~24 a la ~10, fusionado con b5-l1/l2 reequilibrados y con el infinitivo pessoal de b7-l1, que es su competidor natural y debe enseñarse en oposición (`antes de saíres` vs `antes que saias`).
- **B1-D · «Hipótesis y cortesía» (3 sem., no 5).** Condicional + imperfeito do conjuntivo + condicionales tipo 2, fusionando b5-l3, b5-l4, b6-l2 y b6-l4. El alumno ya tiene el concepto; necesita la forma. **Libera cinco semanas.**
- **B1-E · «El conjuntivo como fragmento» (1 sem.).** El presente do conjuntivo deja de ser lección y se disuelve en funciones ya introducidas.
- **B1-F · «Contar lo que otro dijo» (2 sem.).** b8-l4 reescrito, con verbos introductores reales.
- **B1-G · «Discutir» (3 sem.).** b8-l1 y b8-l2 más el aparato de concesión y turno que hoy no existe.

**Lo que se disuelve:** b6 desaparece como bloque. b7 desaparece como bloque —el gerundio se convierte en **una** lección receptiva etiquetada «así habla Brasil»—. b8-l3 deja de ser unidad: la ênclise baja a A1, los trece atractores se reparten uno a uno, y la mesóclise sale entera a C1. b10-l1 se parte: el tratamiento sube a A1, la calibración de registro se queda.

---

## 1.4 · B2 — 518 ítems · se salva el 38 %

### El veredicto

No está enseñado: **está cubierto por la forma y vacío por la tarea.** Los 686 ítems de b6+b7+b8 suman **3.680 tokens de portugués** — el input más largo tiene **18 palabras** y sólo 6 ítems de 686 contienen más de una oración seguida. No hay un párrafo, ni un texto expositivo, ni un argumento, ni una tarea de producción; y de 149 etiquetas distintas, **ninguna** es de producción, mediación, lectura o argumentación. B2 es leer prensa, sostener una discusión y matizar; esto es rellenar huecos sobre seis palabras recicladas (`início` 23, `ligação` 20, `formulário` 17, `vaga` 15, `confiança` 15).

En los tres puntos donde el material toma una decisión doctrinal, la toma contra el portugués europeo: `mdx/b8/l3` dice que **«la próclise es la opción predeterminada»** (regla brasileña; en PT-PT la ênclise es lo no marcado); `mdx/b7/l2` instruye «si en español dices 'está hablando', en portugués es 'está falando'»; y b7-l3 enseña que el perfeito composto equivale al «he hecho» español (`970cf7a9`, `c6c330df`, `5406568e`), que es la fosilización clásica vendida como regla.

Y está averiado en frío: **15 de los 60 `verb_preposition` producen frases agramaticales al aplicar su propia clave** (`b6/07865669`: «Quero que ela de mim»), cinco `listening` preguntan por una forma que no está en el audio, y hay palabras inexistentes y de otras lenguas dentro del portugués que iría a doblaje: «suspado», «tiempo», «promiseu», «consequences», «acteur», «okay», «nowadays», «meanwhile», y un «maar ook» neerlandés.

### Lo que sirve de plantilla

| id | tipo | texto | por qué |
|---|---|---|---|
| `b7/ccb65e45` | error_correction | «É importante nós **estudar** mais» → «É importante nós **estudarmos** mais» | Con su gemelo `b7/8339f141` («Antes de eles **chegar**» → «**chegarem**») cubren la forma portuguesa por excelencia, que el español no tiene. |
| `b7/63e0e911` + `474b0d6d`, `b077af3b`, `e6ba16e3`, `cc7715be` | error_correction | ponhado→**posto**, fazido→**feito**, dizido→**dito**, vido→**visto**, abrido→**aberta** | El único set que ataca sistemáticamente la sobrerregularización que el español induce. Neutro de variedad, cero retoque. |
| `b6/b9c397d4` | translation | «En cuanto traigan el formulario, lo rellenaré» → **«Assim que trouxerem o formulário, preenchê-lo-ei»** | Futuro do conjuntivo irregular + mesóclise obligatoria en una sola frase, las dos invisibles para un hispanohablante. **Así debe verse la mesóclise: incrustada donde es forzosa.** |
| `b6/d29b5962` | translation | «Si te dedicas a la abogacía…» → **«Se te dedicares à advocacia, precisarás de paciência»** | Tres cosas europeas a la vez y las tres bien: futuro do conjuntivo donde el español pone presente, `tu` con su desinencia, y `precisar DE`. |
| `b8/5a721355` | error_correction | «O livro **que o autor** é famoso» → «O livro **cujo** autor é famoso» | El relativo posesivo separa un B1 fluido de un B2 real. Con `b8/0f44db92` («a cidade **que** eu moro» → **onde**) cubre las dos relativas que el hispanohablante colapsa. |
| `b8/6271f983` | error_correction | «Eu acho **de que** ele tem razão» → «Eu acho **que**…» | Dequeísmo trasplantado: un fósil que nadie corrige porque se entiende igual. |
| `b8/8cb5e279` + la lección b8-l2 entera | translation | «O **actor** a quem deram o **guião** confirmou que **pararia** de fumar para o papel» | Campo léxico coherente y genuinamente europeo (`guião`, `realizador`, `estreante`, `prémio`, `rodar`) sobre el que se montan relativas reales. **Prueba de que el generador sabía hacerlo cuando se le daba un mundo en vez de una lista.** |

### Lo que se tira

- **`b7/451780c2`** otra vez (es el mismo ítem, y cae en las dos bandas).
- **`b7/99790b7d`**: «infinitivo pessoal de 'falar' en 1.ª plural → **falar nós**», con el ejemplo «Falar nós português ajuda muito». Es `falarmos`. Y contradice a `b7/8c46475d` y `b7/cef7412d` **en la misma lección**. Añádase `b7/5292d03a`, cuyo ejemplo de infinitivo pessoal es un presente do conjuntivo.
- **`b6/694d343b`**: «el imperfeito do conjuntivo se forma desde la raíz del **imperfeito do indicativo**». La regla real es la 3.ª plural del **perfeito** (falaram→falasse, fizeram→fizesse, foram→fosse). Con la regla que da la tarjeta, el alumno no genera un solo irregular.
- **`b6/e9764a9c`** y **`b6/2c90a6da`** (repetidos de B1: ignoran la flexión en la lección que se llama futuro-conjuntivo).
- **`b8/fb9bfb23`**, **`b8/a3ea04a7`**, **`b8/fa57cc56`** (repetidos de B1).
- **`b7/e86c3aa3`** («Ela **tem nascido** em Lisboa»: nacer repetidamente es imposible), **`970cf7a9`**, **`c6c330df`**: seis ítems de b7-l3 codifican el falso amigo gramatical más caro del par ES-PT como si fuera la regla.
- **`b6/8351a07a`** (audioText «Se eu tivesse **suspado** que o **tiempo** ia ficar assim»), **`b7/58b6df50`** («Se eu tivesse **promiseu** a ela»), **`b6/f21d22f2`** («Assim que **nosotros nos pongamos** de acuerdo sobre el rumbo…»), **`b8/c3c29288`** («A mim achou-me muita graça o filme»). **Son textos que irían al proveedor de doblaje tal cual.**
- **Los 13 `multiple_choice` tienen `correctIndex: 0`.** Tres ítems y el alumno descubre que la respuesta siempre es la primera. Y `b7/13aad32a` pone «estou a falar» de distractor.

### Los huecos

1. **Texto: cero.** 3.680 tokens en toda la banda ≈ 15 minutos de lectura. Falta el 100 % del input largo: prensa (*Público*, *Expresso*), crónica (Miguel Esteves Cardoso, Ricardo Araújo Pereira), narrativa no adaptada, texto administrativo.
2. **`estar a + infinitivo`:** 4 apariciones en b7 frente a ~150 gerundios, y sólo dentro de `variantOverrides` mal etiquetados.
3. **El paradigma de `tu` y de `nós`:** de 13 `conjugation` del conjuntivo, 12 son `eu` y uno `eles`. Y en el futuro do conjuntivo la persona elegida (`eu`) es la celda homófona del infinitivo, la que no informa de nada. `você` aparece 83 veces; `tu` con desinencia, ~20.
4. **Particípios duplos y voz pasiva:** cero `aceite/aceitado`, `pago/pagado`, `entregue/entregado`; cero «voz passiva» o pasiva pronominal. Obra nueva entera.
5. **Pragmática y tratamiento:** 0 `se calhar`, 0 `pois é`, 0 `está lá?`, 0 `importa-se de`, 0 `percebes`, una sola `tem de` frente a `tem que`. Y `b6/d39ebf56` glosa `você` como «usted» mientras `b6/61c4310f` lo glosa como «tú».
6. **Mediación e interacción: cero tareas.**
7. **Conectores de escrito:** falta `nomeadamente`, `no que diz respeito a`, `importa salientar`, `por um lado / por outro`, `não obstante`, `daí que`. Y `b8/1f83ee26` enseña «apesar de que», calco del español.
8. **Regência difícil:** los 60 `verb_preposition` son cuatro verbos repetidos; faltan `assistir A`, `telefonar A`, `chamar POR`, `pagar A alguém`, `reparar EM`, `aperceber-se DE`.
9. **Ortografía doble (AO90 vs anterior): cero tratamiento**, y a partir de B2 el alumno lee las dos. Encima el corpus mezcla `prémio` y `prêmio` dentro de la misma lección (`b8/89d7ecee`).
10. **Mesóclise como registro:** ~7 ítems y 4 averiados. Falta lo único que un B2 necesita: reconocerla en un boletín y saber que en el café nadie la usa.

### Resecuenciación propuesta

La secuencia actual es un índice de gramática: ocho semanas de conjuntivo, tres de formas no personales, cuatro de sintaxis. Para este público está invertida.

1. **El futuro do conjuntivo SUBE a B1** y sale de aquí: es cotidiano, no avanzado. b6-l3 se vacía hacia abajo salvo los ítems con mesóclise, que suben a B2 alto.
2. **El presente do conjuntivo también baja** (`talvez`, `espero que`, `é possível que` son fragmentos rentables de A2-B1). Queda en B2 b6-l2 (con la derivación **real**) y b6-l4.
3. **b7 se parte y se invierte:** el **infinitivo pessoal abre la banda**; el gerundio deja de ser lección y pasa a nota de contraste receptivo; los particípios se quedan reescritos con el reparto `ter`/`ser` y los duplos. **b7-l2 queda bloqueado hasta ese reencuadre.**
4. **b8 se parte en tres y se reparte por niveles:** ênclise básica a A1-A2, próclise por atracción en B2, mesóclise a C1 y sólo **dentro** de textos de su registro.
5. **Y sobre todo: la banda deja de organizarse por forma y pasa a organizarse por TAREA.** Cada semana se define por lo que el alumno tendrá que hacer (leer un editorial y reconstruir la tesis; escribir un correo profesional; sostener un desacuerdo de quince turnos; mediar un malentendido). Sin ese cambio de eje, reordenar bloques sólo produce el mismo temario en otro orden.

---

## 1.5 · C1-C2 — 57 ítems · se salva el 12 % · C2 no existe

### El veredicto

C1 **no está enseñado ni cubierto: está simulado.** Los 57 ítems de `b8-l3-colocacao-pronominal` no son C1: son una lección de B1 sobre clíticos, con siete frases de mesóclise dentro, escrita desde el marco escolar brasileño y etiquetada `targetLang: "pt-br"` en los 93 sitios donde aparece la etiqueta (**0 ocurrencias de `pt-pt` en todo b8**).

El error de concepción está en la regla madre: `b8/4da6718a` (`b8.json:2042`) enseña **«ÊNCLISE = verbo al inicio»**, que es la regla de Brasil. En portugués europeo la ênclise es la posición **por defecto** y la próclise es la excepción disparada por una lista cerrada. Todo lo demás hereda ese error, y por eso `b8/bcf50c91` (`b8.json:4893`) tiene como base «**Me diga** logo o que aconteceu!» —agramatical en Lisboa— y esconde la forma europea correcta dentro de `variantOverrides["pt-br"]`, con la clave invertida.

**C2 no existe.** Cero ítems, cero autores del canon (`Eça|Camilo|Garrett|Antero|Pessoa|Saramago` = 0 coincidencias en 2.037 ítems y 20 historias), cero PALOP, cero alusión histórica, cero mediación, `não obstante`/`com efeito`/`ora bem`/`de resto`/`quando muito` = 0 cada uno.

### Lo que sirve de plantilla

| id | texto | por qué |
|---|---|---|
| `b8/4cf47319` (`b8.json:2007`) | **«Conhecer-se-iam os factos se fizessem o relatório.»** | Mesóclise real, en condicional, con sujeto pospuesto y grafía europea (`factos`). El único ítem del bloque que suena a portugués escrito de verdad. |
| `b8/11849607` (`b8.json:269`) | **«Se lhe dessem essa oportunidade, aproveitá-la-ia.»** | Mesóclise + clítico de OD contraído tras raíz en `-r` + imperfeito do conjuntivo. El nudo que un hispanohablante no puede adivinar desde el español. |
| `b8/eb7d4755` (`b8.json:6015`) | «A verdade **dir-se-á** mais cedo ou mais tarde», alt. **«A verdade há de dizer-se»** | La alternativa vale más que el ítem: `haver de + infinitivo` es PT-PT vivo y casi nunca se enseña. Modelo de cómo poblar alternativas: **otra construcción del mismo registro**, no un sinónimo. |
| `b8/d69a8be6` (`b8.json:6612`) | «**Quando vi-o** na rua» → «**Quando o vi** na rua» | Nombra el disparador. Con `c17161d2` («Espero que ajude-me» → «Espero que me ajude») es la plantilla del nivel: dar el error plausible y exigir la corrección. |
| `b8/fc508283` | «a) Se me derem b) Derem-se me c) Me derem se» → **«Se me derem — próclise tras 'se'»** | El único ítem de los 57 diseñado como ítem de prueba: distractores plausibles, uno correcto, regla nombrada. |
| `b8/eeb0f6d7` | **«Meteram-se em problemas sérios.»** | Ênclise por defecto en afirmativa sin atractor, que es *la* regla europea. **Irónicamente contradice la regla madre del bloque: hay que ascenderlo a regla y degradar `4da6718a`.** |
| `b4/9995bd11` (`b4.json:4819`) | «¿Dónde se usa más el mais-que-perfeito simples (-ra)? → Más en PT-PT, literario y habla formal de Brasil. PT-PT: *Ele dissera a verdade* / PT-BR hablado: *Ele tinha dito a verdade*» | **La mejor nota de variación del repo.** Las dos versiones contrastadas en la misma tarjeta, sin moralizar. |

### Lo que se tira

- **`b8/fa57cc56`** (opción duplicada + respuesta brasileña + la correcta puesta de distractor: **penaliza al alumno por acertar**).
- **`b8/fb9bfb23`** (clave falsa + alemán dentro del `esContrast`).
- **`b8/1312dd96`** («Precisa-se de alimentar-se bem» / «Tem de-se de alimentar bem»: ninguna de las dos es portugués).
- **`b8/2acce101`**: «¿'Vamos nos informar' o 'Vamos nos informar'?» — **las dos opciones son la misma cadena**, y el `variantOverrides["pt-br"]` contiene «Em Portugal diz-se 'Vamos informar-nos'». La inversión de claves en carne y hueso.
- **`b8/bcf50c91`**: base brasileña agramatical en Lisboa, override europeo bajo la etiqueta equivocada. Se reescribe invirtiendo base y override, y con la forma `tu`: **«Diz-me já o que aconteceu!»**
- **`b8/4da6718a`**: la mnemotecnia BANDEIRA. **Es la raíz doctrinal de casi todos los demás errores.** Se reescribe como regla europea: ênclise por defecto; próclise sólo con la lista cerrada (`não, nunca, ninguém, nada, tudo, quem, que, se, talvez, já, ainda, só, também, sempre, todos` + interrogativos y relativos).
- **`b8/a3ea04a7`** y sus tres propagaciones (`1fd04f2c`, `7d26539b`, `fa57cc56`): cuatro ítems fabrican el mismo error de interlengua y **el SRS lo va a grabar por repetición espaciada**.
- **`b8/83a9c448`** (concordancia mal + `vos` presentado como brasileño), **`b8/a02ffc72`** (la pista dice «(eu)» y la clave es `lhe`), **`b8/d4e7089f`** («A gente **se alimenta**», brasileño coloquial archivado como C1 europeo).
- **`b4/62e47684`** («Eu fizera feito») y **`b4/805028f5`** (`trem` donde PT-PT dice `comboio`), dentro de los 7 de mais-que-perfeito simples que **sí** se reetiquetan a C1.

### Los huecos

1. **C2 entero.** No es un hueco: es la ausencia del nivel. Y el criterio terminal (cero errores de interferencia en 2.000 palabras bajo fatiga) no tiene hoy ni un instrumento que lo mida.
2. **Texto largo.** El texto más largo del corpus tiene **307 palabras** (`stories/b2-s2`), mediana 203. C1 pide editoriales de 2.000. **No hay soporte físico para inferencia, presuposición, ironía ni cohesión a distancia.**
3. **Elección léxica de matiz:** ni un ítem obliga a escoger entre casi-sinónimos. `perceber` 5, `entender` 8, `compreender` 0, `chatear` 0, `aborrecer` 0, `incomodar` 0.
4. **Conectores de nivel discursivo:** `não obstante` 0, `com efeito` 0, `ora bem` 0, `de resto` 0, `quando muito` 0, `aliás` 2.
5. **Registro y las tres versiones de un mismo contenido:** el descriptor central de C1 no tiene ningún tipo de ejercicio que lo soporte. Y la colocação pronominal —*el* recurso de registro del portugués europeo— se enseña como regla de ortografía en vez de como decisión estilística.
6. **Ironía, understatement y alusión:** 1 coincidencia de /ironia|irónic|sarcas/ en todo el corpus. Cero *25 de Abril*, *Salazar*, *Estado Novo*, *troika*, *descolonização*. Cero *fado*.
7. **Variedades africanas:** `Angola`, `Moçambique`, `Cabo Verde`, `Guiné`, `São Tomé` = **0 ocurrencias**, frente a un descriptor que exige ≥80 % de comprensión de un hablante angoleño.
8. **Coloquial PT-PT profundo:** `gajo, bué, malta, chatice, seca, estar-se nas tintas, à balda` = 1 coincidencia en todo el corpus.
9. **Las dos ortografías:** 1 mención del AO90, cuando todo el dominio público útil para este nivel está en grafía anterior (`facto`, `acção`, `óptimo`).
10. **Mediación: 0.** El hueco más grande y la ventaja competitiva desperdiciada.
11. **La alternancia infinitivo pessoal / conjuntivo / infinitivo simples como elección:** 44 ítems mencionan el término, todos en b7, y sólo 2 lo ponen en contacto con el conjuntivo. **No existe el ejercicio que da un contexto y obliga a elegir entre las tres** — la alternancia de criterio n.º 1 de C1 en portugués.
12. **Léxico en volumen:** 141 + 49 entradas frente a 10.000 productivos / 20.000 receptivos declarados. No se arregla con más ítems: exige input extensivo.

### Resecuenciación propuesta

`b8-l3-colocacao-pronominal` se despieza en cuatro, porque hoy un solo concepto de 57 ítems en la semana ~28 cubre de A1 a C1 y por eso no enseña bien ninguno de los dos extremos:

1. **A1, lección 1** — la ênclise como posición **neutra**: `chamo-me`, `dá-me`, `desculpe-me`, `levanto-me`. No es gramática avanzada: es cómo se dice el propio nombre. `b8/eeb0f6d7` pertenece aquí.
2. **A2** — los tres o cuatro atractores de alta frecuencia (`não, que, se, quando`) como excepciones a la ênclise. Aquí caben los cuatro `error_correction` limpios sin tocar una coma.
3. **B1** — la lista cerrada completa + contracciones pronominales (`dá-mo`, `dá-lho`), que hoy no existen en ningún ítem.
4. **C1** — la mesóclise, movida de sitio **y de forma**: su ejercicio propio es *reconocer que un texto es formal porque la usa* y *reescribir un aviso coloquial en registro de ministério*. Fuera del texto no significa nada. Se le une el mais-que-perfeito simples de b4-l5 en una unidad de **registro escrito culto**.

Y una regla que gobierna todas las capas: **invertir la polaridad del dato.** Mientras la base siga siendo brasileña y Portugal siga siendo el `variantOverride` —93 `targetLang: "pt-br"` y 0 `pt-pt` en b8, con las claves además cambiadas en `bcf50c91`, `2acce101`, `83a9c448`— resecuenciar sólo cambia el orden en que se enseña la variedad equivocada.

---

# 2. La serie

## **AO BALCÃO** — *Portugal, contado por quem o serve*

**Pitch.** Un ingeniero de sonido mexicano llega a Lisboa con un contrato y sin papeles. Todo lo que necesita —una llave, una morada, un número fiscal, un trabajo que pueda cobrar— pasa por el mismo mostrador de la misma pastelaria de Arroios, y por una mujer de 68 años que se lo puede dar con una firma y no se la da. Él graba todo lo que oye porque es su oficio; nosotros oímos lo que él graba. **Cuarenta y cuatro episodios, ninguno de más de cinco minutos, y en el primero un hombre no consigue pedir un café.**

### Por qué engancha

Tres motores, y ninguno es la disciplina del alumno.

1. **Una apuesta material desde el episodio 1.** No es «aprender portugués»: es **la llave, el papel y el dinero**. Migue no puede cobrar sin NIF; no hay registo de NIF sin morada por escrito; y la Dona Fátima no le pone la morada por escrito **porque tiene sobre la mesa una oferta por el edificio y un inquilino registrado le complica la venta**. Una sola frase compra la trama, el secreto y el motivo — y sostiene, sin inventar nada, todo el anillo burocrático (`NIF`, `morada`, `apelido`, `código postal`, `Junta de Freguesia`, `Loja do Cidadão`, `recibo`, `fatura com contribuinte`) que hoy tiene **cero ocurrencias reales** en los 2.037 ítems.
2. **Deuda serial que cierra dentro de cada banda.** El currículo dice que el 90 % de quienes empiezan se detiene entre A2 y B1. Un misterio que se resuelve en C1 paga sólo al 5 % que llega — es el mismo error que estamos corrigiendo en el corpus (el contenido bueno en la semana 34), cometido en la estructura dramática. Por eso: **A1 cierra con el NIF · A2 cierra con la venta del edificio · B1 cierra con la pastelaria y con la hermana de Kilu. Ningún arco cruza más de 12 episodios; ninguna pregunta abierta dura más de 3.** El que se baja en A2 —que es la mayoría— cobra.
3. **O Arquivo: la prueba audible de progreso, a coste cero.** Cada línea de habla no controlada (Capa 1) queda guardada. El alumno puede reabrirla, y al reabrirla la app le hace **la misma pregunta de extracción de entonces más tres que nunca le hizo**. La ráfaga que la Dona Fátima suelta en el segundo 3 del episodio 1 es el punto de calibración de todo el curso, y vuelve **íntegra y sin retocar** en el episodio 4 y en el 40. No es una gráfica: es un hecho, y es infalsificable, porque el material es el mismo y el que cambió fue él.

### La arquitectura: cuatro capas

Es lo que hace que «manejable desde el momento 1» e «inmersivo» no se contradigan, y es la única parte de esta dirección que no depende del talento del guionista.

| Capa | Qué es | Regla dura |
|---|---|---|
| **0 · español** | Migue contando qué le pasó. 90 s en el ep. 1 → 45 s en el 4 → 30 s en el 13 → **0 s en el 25**. Calendario publicado y auditado por gate. | **No puede contener ningún dato que responda a una tarea de la app.** |
| **1 · portugués real** | Habla no controlada desde el minuto uno: 145 ppm en A1, ráfagas de 175, redução máxima, sin limpiar. | **Ninguna pregunta de la app se responde con la Capa 1.** |
| **2 · portugués manejable** | Lo mismo, dentro del léxico cerrado, a 95-125 ppm. En A1 vive **dentro de la escena** (Kilu reformula, Marta rebobina) y en una pista de reprise llamada *Outra vez*. | **Todas las preguntas se responden con la Capa 2.** Ninguna línea difícil de la Capa 1 se queda sin su reemisión. |
| **3 · el juego** | Las tareas. | **La app no marca el día por reproducir el episodio, sólo por cerrar el juego de tareas.** |

### El mundo

Cuatro sitios, y no hacen falta más: **el balcão** de la Pastelaria Flor de Arroios (el motor transaccional de todo el A1), **la escalera y el cuarto** de encima (Rua de Arroios, 21, terceiro esquerdo), **la ventanilla** (Junta de Freguesia y Loja do Cidadão), y **el teléfono**, que a partir de A2 es un escenario propio porque es donde el hispanohablante se derrumba: no hay cara, no hay contexto, y la redução vocálica va entera.

### El reparto

**Cinco voces cargan A1-A2. La sexta entra en B1. Las invitadas no existen antes de B1.** El presupuesto de voces se escalona; que aparezca una voz nueva y más difícil justo cuando el alumno se ha acomodado es una función pedagógica, no un lujo.

**1 · Migue — Miguel Ángel Rentería, 36, Guadalajara.** Ingeniero de sonido freelance: por eso hay grabaciones, por eso hay Arquivo, y por eso se puede rebobinar sin romper la ficción. Es el alumno dentro de la serie y **la única voz que no debe sonar nativa**. Sus errores son el temario y se reparan en escena.
> *Voz:* barítono cálido, 105-125 ppm, sonrisa audible, vocales españolas plenas (no reduce nada). **Dos configuraciones, no tres**: «acento marcado» (eps. 1-24) y «acento residual» (25 en adelante). Necesita además **una configuración en español** para la Capa 0.

**2 · Dona Fátima Andrade, 68, Lisboa (Arroios).** Dueña de la pastelaria **y del edificio de encima**. Eso le da las dos palancas: el mostrador y el contrato. Trata en 3.ª persona sin pronombre a quien no conoce y espera lo mismo de vuelta. **Es el arco fonológico del curso hecho persona:** deliberadamente incomprensible en el ep. 1, perfectamente comprensible en el 40.
> *Voz:* contralto grave, con grano y aire, autoridad total, 140-175 ppm según a quién le hable, redução vocálica máxima y silencios secos. **No es una viejita dulce: es una patrona.** Sus fórmulas de mostrador se repiten hasta la exactitud —`O seguinte, faz favor!`, `Faz favor?`, `Mais alguma coisa?`, `São dois e vinte`, `Quer talão?`— porque lo que hace aprendible el habla rápida es la **frecuencia, no la lentitud**.

**3 · Kiluanji «Kilu» Neto, 33, Luanda.** Enfermero en el centro de saúde de Arroios, cliente diario a las 7:30. **Desde el episodio 1**, porque su función es ser la rampa y la rampa tiene que estar el primer día. Vocales átonas **plenas**, ritmo silábico: un hispanohablante lo entiende muchísimo mejor que a un lisboeta, y ése es su trabajo. Lleva el **40 % de las líneas en A1 → 25 % en A2 → 12 % en B1**: el subsidio se le retira al alumno sin avisarle. Gramática europea plena; léxico propio sin glosar (`machimbombo`, `candongueiro`, `bazar`, `estamos juntos`). Hoy el corpus tiene **0 ocurrencias de Angola**.
> *Voz:* tenor medio, articulación separada y limpia, 125-145 ppm. **La más inteligible del reparto, y debe serlo de forma obvia.**

**4 · Marta Vilaverde, 24, Matosinhos (Porto).** Monta la serie con Migue: son socios, se tutean y trabajan de noche. **Cuando el episodio repite una frase despacio, es porque ELLA rebobina dentro de la ficción.** Eso convierte la capa fonética —el contenido más caro de A1, el 40 % de sus horas— en una escena en vez de un truco de app, y cumple al pie de la letra la instrucción del dueño: la fonología pasa de bloque a capa dentro de una frase que sirve para algo. Es la **única con licencia para señalar la lengua, y siempre desde el oído**, nunca desde la regla.
> *Voz:* mezzo brillante, 150-165 ppm, melodía nortenha. Al rebobinar baja a **95-105 ppm sin cambiar de timbre**: es la misma persona hablando lento, no una voz de dictado. Su norte tiene que estar **escrito**, no sólo en la acotación: `Ouve lá`, `Anda lá`, `Vá lá`, `Olha lá`, `ó pá` son suyas y de nadie más.

**5 · Sr. Joaquim Almeida, 54, Almada.** Funcionário en la Junta de Freguesia y en la Loja do Cidadão. **Es dos personas y ése es el punto.** En la ventanilla: 110-115 ppm, plano, fórmulas nominales sin verbos de trato, 3.ª persona, mesóclise cuando lee del sistema. En el café (Temporada 2): 150 ppm, `ó pá`, enclisis coloquial, fado amateur los jueves. Su modo ventanilla es además **el nativo que habla despacio por carácter**, que es un regalo pedagógico que no cuesta una sexta voz.
> *Voz:* barítono seco. **Dos configuraciones de la misma voz.** Si salen como dos voces distintas, se pierde la lección de registro entera y no se recupera sin volver a doblar. Su configuración «balcão», con pasa-banda 300-3400 Hz + compresión + reverb, **es también la megafonía** — coste marginal cero.

**6 · Nuno Cardoso, 28, Marvila (entra en B1).** Trabaja el balcão con Fátima. **180-190 ppm, reducción al máximo, se solapa, interrumpe, abandona frases.** Es el techo de dificultad auditiva y entra exactamente cuando el alumno cree que ya entiende Lisboa. Vehículo de `estar a + infinitivo` y de la interrogativa con `é que`. **Prohibido «limpiarlo» en el doblaje**: si suena a locutor, el personaje no sirve para nada.

**Invitados (sólo B1-C1, máximo 4 reutilizados):** la peixeira del mercado, **Wesley** —el proveedor brasileño, el único `você` y el único gerundio de toda la serie, en cámara y sin que nadie lo corrija—, una açoriana, y un abogado mexicano para las tareas de mediación de C1.

### Las diez reglas duras de la biblia

1. **Ningún personaje portugués USA `você`.** La única emisión portuguesa de la palabra en toda la serie es la **cita** con que la Dona Fátima se la devuelve a Migue en el ep. 2. (Hoy: 273 en el corpus.)
2. **Cero gerundio en boca portuguesa.** `estar a + infinitivo` ≥6 por episodio a partir del ep. 4, incluida la muletilla `estás a ver?` / `estás a ouvir?`.
3. **`obrigada`/`obrigado` concordando con el hablante, siempre y sin comentario** — con **una** excepción: en el ep. 4 Marta lo señala en cuatro palabras y desde el oído. (Hoy: `obrigada` = 0 en los bloques.)
4. **Posesivo con artículo por defecto:** `a minha chave`, `o teu telemóvel`, `a minha avó`.
5. **Cero palabra brasileña sin motivo diegético.**
6. **Toda escena tiene un objetivo material.** Nadie conversa sobre el desayuno: alguien quiere algo del otro y no siempre lo consigue. **Si la escena podría existir sin personajes, se tira.**
7. **Anti-folleto:** ninguna línea empieza por «Em Portugal, as pessoas…». **Un episodio, UN dato**, y el dato tiene que hacerle falta a un personaje para resolver algo ese día.
8. **Anti-clase:** nadie explica gramática dentro de la ficción.
9. **Todo episodio contiene un desacuerdo** entre dos personas que tienen algo en juego.
10. **La trama vive en la pista de audio, y todo evento narrativo tiene que ser audible en el metro.** Ningún acontecimiento decisivo se confía sólo a un efecto de sonido: **si el foley lo dice, una línea de portugués tiene que decirlo también.** Silencios dramáticos ≤3 s y siempre con ambiente audible debajo.

### La regla de reaparición léxica (la que faltaba)

El diagnóstico del pedagogo sobre la primera tanda era correcto y es el defecto más caro de una serie pedagógica: presencia sin distribución. Un `fixe` único a los tres minutos de curso no se adquiere, se olvida.

- **Tres puertas.** Ninguna palabra-bandera entra en la serie si no tiene **≥3 apariciones planificadas en ≥3 episodios** de su banda.
- **Dos pasos.** Ninguna palabra nueva entra en un episodio si no vuelve **en alguno de los dos siguientes**.
- **Exenciones declaradas, no implícitas:** (a) los miembros de un **par mínimo** (`caro/carro`, `avó/avô`, `mau/mal`) viven en las tareas A/B de discriminación, no en la regla de reaparición; (b) el **léxico de color receptivo** (`machimbombo`, `candongueiro`) se marca como receptivo y se exime; (c) el léxico **escena-específico** de altísima frecuencia interna (`senha`, `balcão` en el ep. 6) cumple por densidad dentro del episodio más una reaparición en la banda.

### Estructura de temporadas, A1 → C2

**44 episodios de ficción. Ninguno pasa de 5 minutos. Nunca.** Lo que crece no es la duración: crece la densidad, la velocidad, el número de voces y la retirada del andamio.

| | **T1 · A1 · eps. 1-12** | **T2 · A2 · eps. 13-24** | **T3 · B1 · eps. 25-44** |
|---|---|---|---|
| **Título** | *O balcão* | *A morada* | *A casa vende-se* |
| **Duración** | 3:30-4:30 | 4:00-5:00 | 7-8 min, **publicados en dos mitades** de 3-4 min con cierre propio |
| **Palabras PT** | 380-520 | 700-900 | 1.100-1.400 |
| **Velocidad** | Capa 1 a 145 ppm (ráfagas 175) · Capa 2 a 95-125 | Capa 1 a 165 · Capa 2 a 120 | 160-190, sin Capa 2 |
| **Voces por escena** | 2 (3 máx. en Capa 1), **sin solapamiento** | 3, solapamiento breve | 3-4, solapamiento real + ruido diegético |
| **Español (Capa 0)** | 90 s → 45 s | 30 s, sólo apertura | **cero** |
| **Capa 2** | completa en todos | encoge: 120 → 90 s | **cae entre los eps. 21 y 27**, gradual |
| **Registro** | transacción de mostrador; tuteo entre iguales y 3.ª persona con desconocidos | + ventanilla, + teléfono, + cambio de tratamento dentro de una escena | + queja, + reclamación, + trabajo; concesión y gestión del turno |
| **Complejidad** | frase simple, presente, imperativo, `há`, `estar a + inf` | perfeito/imperfeito **narrados** con alguien que interrumpe; paradigma de `tu` saturado | subordinación completa, discurso indirecto, condicional de cortesía, **futuro do conjuntivo donde vive de verdad** (cierres y ofrecimientos) |
| **Arco** | la llave, el cuarto y el NIF | la venta del edificio | la pastelaria y la hermana de Kilu |
| **Kilu** | 40 % de las líneas | 25 % | 12 % |

**B2 · sin ficción nueva — «O arquivo».** El reparto se recicla como **aparato**: se lee un editorial del *Público* o el aviso oficial del condomínio («Proceder-se-á à revisão dos contratos») y a continuación Fátima, Nuno y Almeida lo comentan en la cocina en habla llana («Então mas eles vão avisar por carta ou quê?»). Ese par —formal leído / gente comentándolo— es el único andamio que hace que la mesóclise signifique algo. Aquí vive la **toma gemela**: la misma frase grabada dos veces por la misma voz, en serio y con retranca (`Correu lindamente`, `Não está mau, pois não?`), y la pregunta es sobre la **intención**, no sobre la forma. Es la única manera de enseñar el understatement portugués, que por escrito es literalmente indistinguible de su contrario. **Coste: cero guion nuevo.**

**C1 · «A cabina».** El reparto en modo profesional sobre material real: reunión con interrupción y cesión de turno (`Posso só interromper um segundo?`, `Deixa-me só acabar a ideia`); negociación donde alguien dice que no sin decirlo (`Vamos ver`, `É complicado`, `Não lhe prometo nada` — que un mexicano oye como «sí» y en Lisboa es «no»); y **Migue haciendo de intérprete consecutivo ES↔PT**, con las pausas escritas en el guion. El que en el episodio 1 no sabía pedir un café ahora traduce para otros: **el arco del personaje *es* el descriptor.** Kilu deja de ser el vecino y pasa a ser exposición sostenida de portugués angoleño.

**C2 · sin serie — «Ruído».** Sin transcripción, sin repetición lenta, sin resumen previo. Sobrevive un solo formato y es el más útil: **los episodios degradados.** Todo el Arquivo re-emitido con el canal arruinado —mala línea, altavoz, cocina, cansancio a las once de la noche (`Estás a ouvir-me?`, `Não te ouço nada`)— con la versión limpia disponible **después** como andamio. Es el correlato receptivo exacto del criterio de C2 y **cuesta procesado, no contenido**. El resto de C2 es plan de estudio sobre obra real (Eça, Camilo, Antero) + DUPLE, como ya decidió el plan. **La app no certifica C2.**

---

# 3. Los ocho primeros episodios

**Lo que sigue es el guión corregido.** Un nativo de Lisboa leyó los ocho réplica por réplica y cazó ocho errores que un portugués detecta en la primera escucha; están todos aplicados, y al pie de cada episodio se anota qué cambió. Un especialista en adquisición demostró que el presupuesto léxico declarado subestimaba la novedad entre 2× y 4×: **los recuentos de abajo están medidos con un tokenizador sobre estos guiones, no estimados**, y donde el presupuesto se pasaba se han recortado y redistribuido réplicas.

**Convención.** Cada episodio se publica como **núcleo dramático** (lo que va en la tabla) más las tres capas del molde de §4. El núcleo es lo que hay que escribir a mano; la Capa 0, la reprise *Outra vez* y la coda de reciclaje se construyen con la receta de §4.3 y son las que llevan el episodio de ~100 palabras de núcleo a las 380-520 que pide la banda. **Ninguna palabra nueva entra por la coda.**

### Recuento léxico medido — los ocho episodios

| Ep. | Réplicas | Tokens PT | Tipos | **Tipos nuevos** | **% tokens nuevos** | Caracteres PT |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 31 | 94 | 43 | 43 | 100,0 % | 571 |
| 2 | 28 | 71 | 46 | 31 | 57,7 % | 525 |
| 3 | 33 | 67 | 40 | 27 | 59,7 % | 454 |
| 4 | 40 | 112 | 59 | 25 | 29,5 % | 733 |
| 5 | 46 | 152 | 70 | 31 | 32,9 % | 972 |
| 6 | 51 | 182 | 94 | 40 | 34,1 % | 1.277 |
| 7 | 48 | 163 | 93 | 43 | 35,0 % | 983 |
| 8 | 34 | 125 | 81 | **19** | **18,4 %** | 779 |
| **Total** | **311** | **966** | — | **259 acumulados** | — | **6.294** |

*Criterio: se excluyen nombres propios, letras de senha e interjecciones (`ó`, `hã`, `ah`, `ai`, `hm`, `chiu`). Los tipos son formas, no lemas: `carrega` y `carregar` cuentan dos. El % de tokens nuevos se calcula sobre el núcleo dramático solo; con la coda de reciclaje de §4.3 —que es masa 100 % reciclada— los eps. 6 y 7, que son los densos, bajan por debajo del 25 %.*

**Reaparición medida:** 136 de 259 tipos (**52,5 %**) viven en un solo episodio, frente al 59,8 % de la primera tanda. Sigue siendo demasiado y por eso existe la regla de tres puertas de §2 — pero **todas las palabras-bandera europeas ya cumplen**: `fixe` 3 eps · `desculpe` 3 · `bica` 3 · `obrigada` 3 · `pois` 4 · `morada` 4 · `chave`, `talão`, `contribuinte`, `giro`, `epá`, `autocarro`, `apelido`, `galão`, `pastel`, `balcão`, `pronto`, `se calhar`, `rés-do-chão`, `esquisito`, `mau`, `dezassete`, `chamo-me`, `percebi` = 2 cada una. Las que quedan en 1 (`machimbombo`, `senha`, `dezasseis`, `dezanove`, `caro/carro`, `avó/avô`, `mal`) están **exentas por clase declarada** o vuelven en los eps. 9-12.

---

## Episodio 1 · «Uma bica, se faz favor»

**Duración:** 4:30 de pista · núcleo dramático 1:15.
**Sinopsis.** Migue entra por primera vez en la Pastelaria Flor de Arroios a las 7:30 y quiere un café. No sabe pedirlo. Kilu, que está a su lado todas las mañanas, pide el suyo primero y le presta la fórmula; la Dona Fátima no baja la velocidad ni una vez. Migue se rinde y dice «para levar» — Kilu no lo deja marcharse. Y al final, sin darse cuenta, hace algo bien.

**Lengua nueva: 43 formas · 94 tokens · 571 caracteres.** De las 43, unas 15 son transparentes de oído para un hispanohablante (`favor`, `dia`, `um/uma`, `e`, `sim`, `é`, `para`, `aqui`, `ou`, `de`, `nada`, `dois`, `não`, `isso`, `que`): el coste real del primer episodio son **28 palabras**. Inventario: faz · favor · seguinte · bom · dia · uma · bica · se · um · galão · e · pastel · de · nata · sim · é · para · aqui · ou · levar · desculpe · ao · balcão · são · dois · setenta · obrigado · obrigada · nada · até · amanhã · ó · rapaz · chave · isso · fica · semana · ouviste · ainda · assinei · eu · que · o. **Fórmulas completas, no palabras sueltas:** `O seguinte, faz favor!` · `Faz favor?` · `se faz favor` · `É para aqui ou para levar?` · `Desculpe?` · `São dois e setenta` · `De nada`. **Cero `você`. Cero gerundios. Cero `estar a + infinitivo`** — imposible dentro de este presupuesto; entra en el ep. 2 y satura en el 4.

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| **FÁTIMA** *(Capa 1)* | Ó Zé! Ó Zé, isso fica para a semana, ouviste? Que eu ainda não assinei nada! | **El primer portugués que oye el alumno en su vida.** Contralto grave con grano, 175 ppm, ráfaga sin respiración, gritada hacia dentro (a la cocina), **no** al cliente. Volumen alto y mal articulado: redução al máximo, que se pierdan las átonas. **NO ralentizar, NO limpiar.** Debe sonar a pared. |
| SOM *(não dobrar)* | *[máquina de café; chávenas no mármore; rádio ao fundo; a porta de vidro abre e corta a ráfaga]* | Foley. Entra **antes** de la primera voz y no para en todo el episodio. La puerta que abre es la señal diegética de que esa ráfaga no era para el oyente. |
| **FÁTIMA** | O seguinte, faz favor! | Grito seco de mostrador, sin mirar a nadie, sin amabilidad. Es una llamada de turno. |
| **KILU** | Bom dia, Dona Fátima. Uma bica, se faz favor. | Tenor angoleño, 140 ppm, articulación separada, vocales átonas **plenas**. Buen humor de cliente diario. **Cada palabra debe poder transcribirse a la primera.** |
| **FÁTIMA** | Uma bica. | Repetición de comanda, monótona, hacia la máquina, ya de espaldas. 150 ppm. |
| **KILU** | Bom dia. | Ahora hacia Migue: medio tono más arriba, sonrisa audible, **más lento** (125 ppm). Es un saludo a un desconocido con cara de perdido. |
| **MIGUE** | Bom dia... eh... | Barítono mexicano, acento marcado, 110 ppm. La «o» de «bom» demasiado abierta. El «eh» es aire, no palabra. |
| **FÁTIMA** | Faz favor? | Misma cadena que antes, **ahora ascendente y dirigida a él**. 160 ppm, impaciente, hay cola. Máximo 0,4 s de pausa: corta a Migue. |
| **MIGUE** | *(en español)* Un café con leche. | Español mexicano neutro, 130 ppm, con total naturalidad y confianza. No cuenta en el presupuesto portugués: es el error diagnóstico del episodio. |
| **FÁTIMA** | Hã? | Monosílabo, tras 1,5 s de silencio seco (la máquina sigue; ella no). Grave, corto, sin subir mucho. Ni amable ni hostil: un muro. |
| **KILU** | Um galão. | Muy bajito, casi al oído, cómplice, 120 ppm, hiperarticulado. Es un soplo, no una corrección. |
| **MIGUE** | Um galão. Se faz favor. | Copiando, con dos milímetros de duda antes de «se faz favor». 105 ppm, muy lento, aplicado; sube al final como preguntando si lo ha dicho bien. |
| **FÁTIMA** | Um galão. E um pastel de nata? | Primera mitad hacia la máquina, monótona. Pausa de 1 s. Segunda mitad de vuelta a él, 165 ppm, seca. No es una sugerencia amable: es negocio. |
| **MIGUE** | Sim. Sim! | El primero dudoso y bajo; el segundo, medio segundo después, alto y con alivio. Contraste marcado. |
| **FÁTIMA** *(Capa 1)* | É para aqui ou para levar? | 175 ppm, una sola masa sonora, todo ligado, sin pausas internas. **Debe resultar incomprensible la primera vez.** |
| **MIGUE** | Desculpe? | 95 ppm, pequeño, avergonzado, subiendo mucho. Se le va la voz. |
| **FÁTIMA** | É para aqui ou para levar? | **Idéntica.** Misma velocidad, misma masa, mismo volumen. **NO ralentizar ni un 5 %.** Si acaso, medio tono más irritada. |
| **KILU** *(Capa 2)* | Aqui? Ou levar? | **La reformulación que hace comprensible la línea anterior, y la hace un personaje.** 110 ppm, dos bloques separados por medio segundo, hiperarticulados, al oído. |
| **MIGUE** | Para levar. | 115 ppm, rápido, de huida. Ha elegido la última opción que oyó porque es la única que retuvo. |
| **KILU** | Não, não. Para aqui. | Firme, casi cortándolo, 135 ppm, sin agresividad y sin negociación. Los dos «não» pegados. |
| **MIGUE** | Para aqui? | Eco desconcertado, 100 ppm, subiendo. |
| **KILU** | Para aqui. | Plano y definitivo, 130 ppm, cae el final. |
| **KILU** | Aqui, ao balcão. | Ya sentándose (taburete audible), sin volverse. 125 ppm. Asunto cerrado. |
| **FÁTIMA** | São dois e setenta. | 155 ppm, seca, sin «euros». Golpe de moneda sobre el mármol justo después. |
| **MIGUE** | Obrigada. | Alegre, orgulloso, 110 ppm, alargando la última «a». **Está convencido de haberlo hecho perfecto.** |
| **FÁTIMA** | De nada. | Ni una pausa ni un gesto: no lo ha registrado o no le importa. 160 ppm, plano, ya con la mano en la máquina. |
| **KILU** | Obrigado, Dona Fátima. | Voz masculina, clara, 135 ppm, recogiendo su bica. Cálido y rutinario. |
| **FÁTIMA** | De nada, Kilu. | Un grado más cálida que con Migue: a Kilu lo conoce. 150 ppm. |
| **FÁTIMA** | Obrigada! Até amanhã. | **En primer plano**, al repartidor de pan que deja las cajas. 155 ppm, a volumen normal, perfectamente audible. **No es ambiente: es una réplica.** |
| **FÁTIMA** | Ó rapaz! | Ya lejos, subiendo el volumen para alcanzarlo (él se está yendo). 170 ppm, imperativo, sin cariño, con reverberación de local. |
| **FÁTIMA** | Amanhã. A chave. | Dos bloques separados por 1 s. Grave, bajando, casi para sí. |
| **MIGUE** | Amanhã. A chave. | Repitiendo para memorizar, 100 ppm, cuidadoso, sin subir al final. |
| **FÁTIMA** | Isso. | **Dos sílabas, 150 ppm, sin volverse.** Es todo lo que ella da, y es aprobación. Corte seco sobre el ruido de la máquina. |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. `Faz favor!` como llamada de turno **no existe en Portugal** — ni en el corpus: las 6 ocurrencias del repo son todas `se faz favor`. Se sustituye por **`O seguinte, faz favor!`**, y `Faz favor?` ascendente se conserva porque es la función auténtica. La serie pasa de cuatro funciones (dos inventadas) a **dos reales bien contrastadas**.
2. **`Ó?` interrogativo no es portugués:** `ó` es partícula vocativa y sólo eso. Sustituido por **`Hã?`**.
3. **`É para aqui ou é para levar?`** → **`É para aqui ou para levar?`**, que es como se dice.
4. **`E um pastel?`** en una pastelaria es ambiguo (nata / bacalhau) → **`E um pastel de nata?`**.
5. **Precio corregido:** galão + pastel a 2,30 € es precio de 2014. **`São dois e setenta`**. La estructura `São X e Y` es la constante de la serie; el número es la variable.
6. **`pá` en boca de una señora de 68** se elimina de la ráfaga; el resto de la ráfaga es habla real y se conserva íntegra (`ficar para a semana`, el `que` causal enfático, el `ouviste`).
7. **Se añade la Capa 2 que faltaba** (`Aqui? Ou levar?`): el pedagogo demostró que la única frase del episodio con una decisión operativa dentro se quedaba sin reemisión manejable, violando el gate 3.
8. **Se añade `Isso.`** — el alumno pidió una victoria antes del ep. 4 y tenía razón: en la versión anterior perdía ocho veces seguidas. Ésta es la primera grieta de Fátima y cuesta una palabra.
9. **`Obrigada` de Fátima sale del fondo y pasa a primer plano.** Estaba fuera de plano, a 165 ppm y sin foco: se estaba poniendo el dato decisivo de la tríada en el peor sitio posible.
10. **Se añade `Aqui, ao balcão`** para que el alumno oiga `balcão` con su significado real **antes** de que Migue lo confunda en el ep. 6.

**Nota didáctica.** Este episodio existe para que alguien que no sabe una palabra de portugués cierre su primera sesión **habiendo pedido algo**, no habiendo estudiado algo. Sirve cuatro descriptores A1 (`curriculos-completos.md:83-95`): pedir un café con `se faz favor` y `obrigado/obrigada` concordando con **su propio** género; identificar el precio, dicho como se dice de verdad; pedir repetición con la fórmula portuguesa **y recibir la consecuencia realista** (la repetición llega igual de rápida — eso es lo primero que hay que desaprender del método escolar); y la concordancia de `obrigado`, enseñada por **tres datos yuxtapuestos y cero explicación**: Migue (hombre) mal · Kilu (hombre) bien · Fátima (mujer) bien, en cuarenta segundos.

Hay dos líneas de Capa 1 y **ninguna tarea se responde con ellas**; la ráfaga inicial ni siquiera se glosa. Es el mismo fichero de audio que vuelve en el ep. 4 y en el 40. **Ficha medida:** você 0 · gerundios 0 · `obrigado`/`obrigada` concordando en las tres emisiones nativas + 1 error deliberado no comentado · objetivo material (conseguir un café sin quedar en ridículo) · desacuerdo con algo en juego (Kilu impone «para aqui», y de eso depende que exista la serie) · 3 voces, ninguna invitada, Kilu con el 40 % de las líneas desde el minuto uno.

---

## Episodio 2 · «Dois apelidos»

**Duración:** 4:00 de pista · núcleo 1:10.
**Sinopsis.** Segunda mañana. La Dona Fátima le toma los datos para el recibo del cuarto y Migue descubre, delante de todo el mostrador, que «apelido» no es lo que él creía. Cuando pide que le ponga la morada en el papel, ella se niega — y él, sin pensar, la trata de «você».

**Lengua nueva: 31 formas · 71 tokens · 525 caracteres · acumulado 74 tipos.** Nuevas: então · tudo · bem · nome · **chamo-me** · apelido(s) · os · amigos · completo · devagar · estou · escrever · do · pai · da · mãe · tenho · quatro · me · cabe · **morada** · preciso · trabalho · mas · você · tem · precisa · **percebi** · pois. Reciclado a propósito del ep. 1: `faz favor` (2.ª vez, otra función) · `ó rapaz` · `dois` · `aqui` · `desculpe`. **Primer `estar a + infinitivo` de la serie.** `Você`: **1 sola ocurrencia**, en boca del mexicano y castigada en escena; ningún personaje portugués lo usa.

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| SOM *(não dobrar)* | *[o mesmo balcão, 7h35; chávenas, moedas, uma esferográfica no mármore]* | Foley. Debe reconocerse como el mismo sitio en menos de dos segundos: la máquina, la radio, y ahora un bolígrafo que rasca papel. |
| **KILU** | Bom dia! Então, tudo bem? | Entrando, alto, alegre, 140 ppm, articulación separadísima. «Então» abre la frase como un empujón. |
| **MIGUE** | Tudo. | Muerto de sueño, 90 ppm, monosílabo arrastrado. |
| **MIGUE** | Não. | Segundo y medio después, honesto, sin fuerza, bajando. Es una enmienda a sí mismo. |
| **KILU** | Não? | Riéndose, subiendo mucho, 130 ppm, sin preocupación real. |
| **FÁTIMA** | Ó rapaz. O nome. | Corta la risa. 160 ppm, plana, sin saludar. El bolígrafo ya está en la mano. |
| **MIGUE** | Chamo-me Miguel. | 130 ppm, rápido, aliviado de que le pregunten algo fácil. Clítico pegado: una sola palabra fonética. |
| **FÁTIMA** | Apelido. | Una sola palabra, 165 ppm, sin verbo, sin mirar, ya escribiendo. Es un formulario hecho persona. |
| **MIGUE** | Migue. | Con total seguridad, hasta con simpatía, 120 ppm, ofreciendo confianza: cree que le preguntan cómo le dicen sus amigos. |
| **FÁTIMA** | Hã? | **El bolígrafo PARA** (audible), tras tres segundos de silencio. Grave, corto, incrédulo. |
| **MIGUE** | Migue. Os amigos... Migue. | Cada vez más pequeño, 100 ppm, con una pausa de duda. Se está dando cuenta de que algo no encaja, pero no de qué. |
| **FÁTIMA** | O nome completo. | 150 ppm, plana, paciencia agotada, articulando un poco más de lo normal — que en ella es una humillación, no una ayuda. |
| **MIGUE** | Ah! Chamo-me Miguel Ángel Rentería Salazar. | El «Ah!» explota. Después dispara el nombre entero a 170 ppm, a la mexicana, encadenado y orgulloso. |
| **FÁTIMA** | Devagar. | Una palabra, 140 ppm, sin levantar la voz ni la vista. Corta el nombre por la mitad. |
| **MIGUE** | Ren-te-rí-a. | Silabeado exageradamente, 70 ppm, con pausa entre sílabas. Ligeramente ofendido. |
| **FÁTIMA** | Estou a escrever. | 155 ppm, plana, sin defensa ni disculpa. **Debajo se oye el bolígrafo escribiendo de verdad, y sigue sonando dos segundos después de que ella calle.** |
| **FÁTIMA** | Rentería... Salazar... Dois apelidos. | Los dos apellidos deletreados hacia el papel, cansados, con una pausa de escritura entre ellos. «Dois apelidos» llega 1 s después, seco. |
| **KILU** | Dois! | Con la boca llena de pastel, divertidísimo, 145 ppm, subiendo. Se ríe justo después. |
| **MIGUE** | Dois. O do pai e o da mãe. | Orgulloso, 125 ppm, más lento en «o do pai» y «o da mãe», separando los dos bloques. Está explicando su país, no la lengua. |
| **FÁTIMA** | Dois? Eu tenho quatro. Isso não me cabe aqui. | Sin levantar la vista. 160 ppm. **No es curiosidad ni asombro: es una queja logística**, está midiendo el ancho del renglón. El «Eu tenho quatro» es contrastivo, va acentuado. |
| SOM *(não dobrar)* | *[o papel a deslizar sobre o mármore]* | Un solo gesto, seco. Marca el cambio de tono: se acabó la comedia. |
| **MIGUE** | E a morada? | 125 ppm, todavía animado, sin sospechar nada. Sube al final. |
| **FÁTIMA** | A morada não. | Inmediata, sin medio segundo de pausa, 170 ppm, cortando. Volumen bajo y velocidad alta: es un portazo, no un grito. |
| **MIGUE** | Preciso da morada. Para o trabalho. | Insistiendo, 130 ppm. La segunda frase llega como un añadido, más firme que la primera. |
| **MIGUE** | Mas você tem a morada. | Rápido, 140 ppm, casi enfadado, sin pensar. **Debe sonar razonable:** no está siendo grosero, está argumentando. |
| SOM *(não dobrar)* | *[três segundos — a máquina continua, uma colher pára a meio, ninguém fala]* | Tres segundos exactos, con ambiente audible debajo. **Este silencio es el contenido pedagógico más caro del episodio: no se acorta en el montaje.** |
| **FÁTIMA** | «Você»? | Muy baja, muy lenta (80 ppm), grave, **sin subir el volumen**. Le devuelve su palabra entre comillas audibles. Peor que un grito. |
| **FÁTIMA** | O seguinte, faz favor! | Girándose a otro cliente, alto, 170 ppm. Da la conversación por terminada sin despedirse. |
| **KILU** *(bajito, a Fátima)* | Dona Fátima, o rapaz precisa da morada. | 120 ppm, discreto, sin dramatizar, mirándola a ella. **Es la misma petición de Migue, dicha bien.** |
| **MIGUE** | Desculpe. Não percebi. | Muy bajito, hacia Kilu, 100 ppm, desconcertado de verdad. No es la fórmula de clase: es un hombre que no sabe qué acaba de pasar. |
| **KILU** | Pois. | Deja de masticar antes de decirlo. Muy bajo, grave, 90 ppm, alargado, mirando el papel y no a Migue. Ya no está divertido. Corte dos segundos después. |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. **«Aqui é um.» era falso y era el único dato cultural del episodio.** Los portugueses llevan dos, tres o cuatro apelidos. Sustituido por **`Dois? Eu tenho quatro. Isso não me cabe aqui.`**, que conserva la función (queja logística), el chiste y el presupuesto — y es verdad.
2. **`Ó?` → `Hã?`** (segunda ocurrencia del mismo error).
3. **`Miguel.` → `Chamo-me Miguel.`** `chamo-me` tiene **0 ocurrencias en los 2.037 ítems** y es el primer enclítico declarativo que aprende cualquiera. El episodio del nombre lo estaba esquivando.
4. **`Mas eu preciso do papel. Com a morada.` → `Preciso da morada. Para o trabalho.`** El alumno señaló que el guión sabía cosas que él no: en el ep. 2 nadie ha hablado todavía del NIF (llega en el 4) ni del papel firmado (llega en el 6). Ahora la motivación es autoevidente y de paso **planta `trabalho`, que es el reloj que el ep. 4 pone en marcha**.
5. **La sanción del `você` cambia de forma.** `Eu?` devolvía el pronombre equivocado; la retranca lisboeta es **repetir el del otro**. Ahora es **`«Você»?`**, plano y lento — la única emisión portuguesa de la palabra en toda la serie, en cita y sancionadora.
6. **Se añade la reparación que faltaba.** El pedagogo tenía razón: un castigo sin modelo no es una lección. Kilu dice **la misma proposición con la forma correcta**, tres segundos después, en 3.ª persona con título. Ahora el alumno oye qué *sí* se dice.
7. **`Não percebi` → `Desculpe. Não percebi.`**, que es la fórmula completa del descriptor. Las dos tienen 0 ocurrencias en el corpus.
8. **`faz favor` de expulsión → `O seguinte, faz favor!`**

**Nota didáctica.** Registro **B (Risa)** en la rotación: el humor hace el trabajo pesado en la primera mitad y paga la factura dramática en la segunda. Descriptores servidos: rellenar un formulário portugués sabiendo que `apelido` no es apodo (el episodio **es** ese formulario, fallado en directo); sostener un intercambio sobre datos personales **sin usar `você`**, enseñado por contraejemplo castigado **y reparado**; pedir velocidad más lenta (`Devagar`, recibida antes que producida, que es la vez que un hispanohablante nunca la ha oído); y el primer `estar a + infinitivo`, **sincronizado con el sonido de la acción**.

Lo que este episodio hace y un manual no puede: el sistema de tratamiento —el primer contenido pragmático del curso según el currículo, y hoy el peor enseñado del repo— se transmite entero en un silencio de tres segundos, una palabra entre comillas y una réplica de doce sílabas. No hay tabla, no hay `<Tip>`, no hay nota. Hay una señora de 68 años que deja de hablarte y un amigo que te enseña cómo se pide. **El gate de desfosilización de A1 —cero ocurrencias de `você` a un desconocido— se juega aquí, en el episodio 2, no en la semana 34.**

---

## Episodio 3 · «Mais um»

**Duración:** 4:00 de pista · núcleo 1:25 (la mitad son escaleras, respiración y silencio: la densidad léxica real es la más baja de la tanda).
**Sinopsis.** Migue sube al cuarto por primera vez, con la maleta y con Kilu empujando por detrás. Llama a la puerta del que él cree que es el tercer piso y le contesta el ruido de una cinta métrica. La Dona Fátima le entrega la llave arriba y, cuando él pregunta quién vive en el piso de abajo, contesta una palabra que ya sabemos que no es verdad.

**Lengua nueva: 27 formas · 67 tokens · 454 caracteres · acumulado 101 tipos.** Nuevas: terceiro · esquerdo · boa · tens · ela · três · dá · licença · contei · rés-do-chão · primeiro · segundo · mais · subir · sempre · cheguei · fixe · pequeno · caro · carro · quem · mora · no · está · lá · alguém · ninguém. Reciclado en función **nueva**: `devagar` (aquí es ánimo entre amigos, no reproche) · `então` (aquí es reproche impaciente) · `chave` (2.ª aparición) · `obrigado`. **2 `estar a + infinitivo`, los dos sincronizados con el sonido de subir escaleras.** Ordinales europeos completos del portal.

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| SOM *(não dobrar)* | *[escadaria de prédio antigo; eco; rodas de mala a bater degrau a degrau; respiração pesada]* | El eco de caja de escalera tiene que ser **muy** distinto del balcão: es el segundo escenario de la serie y debe reconocerse por el sonido antes que por las voces. |
| **FÁTIMA** *(desde arriba)* | Terceiro esquerdo! | Desde el rellano de arriba, gritado hacia el hueco, con reverberación larga. 175 ppm, dos bloques, **sin repetir**. Voz de patrona que ya subió y no piensa volver a bajar. |
| **MIGUE** | Terceiro esquerdo. | Repitiendo para sí, sin aire, 95 ppm, entre dos respiraciones. |
| **KILU** | Boa. | Una sílaba, 130 ppm, cálida, casi distraída. **Es una aprobación y hay que oírla como tal.** |
| **KILU** | Devagar, devagar. Tens a chave? | Por debajo, empujando la maleta, riéndose y con esfuerzo, 130 ppm. Los dos «devagar» pegados. |
| **MIGUE** | Não. Ela tem. | 105 ppm, sin aire, resignado. |
| **MIGUE** | Um... dois... três. | Contando tramos, un número por rellano, con la respiración y los pasos entre medias. ~60 ppm efectivos. Cansado, concentrado. |
| **MIGUE** | Terceiro. | Satisfecho, casi triunfal pese al agotamiento, 110 ppm. Golpe de maleta justo después. |
| SOM *(não dobrar)* | *[três batidas secas na porta. Depois, 1,5 s de silêncio total.]* | Madera antigua, seca. |
| SOM *(não dobrar)* | *[dentro: uma fita métrica metálica a recolher — duas vezes. Passos. A porta não abre.]* | **El personaje más importante del episodio, y no tiene voz.** El chasquido metálico tiene que ser inconfundible y quedarse grabado: vuelve en el ep. 4 y el alumno debe reconocerlo sin ayuda. |
| **MIGUE** | Dá licença? | Hacia la puerta, más alto de lo normal, 120 ppm, subiendo mucho al final. Un poco cohibido. |
| **KILU** *(bajito)* | Aqui não. | Casi al oído, tocándole el brazo. 110 ppm, dos palabras, sin explicación. Está incómodo y quiere irse de esa puerta. |
| **MIGUE** | É o terceiro. Contei. Um, dois, três. | Terco, cansado, subiendo el volumen, 145 ppm. **Los tres números disparados seguidos, sin las pausas de antes: ahora son un argumento, no una cuenta.** |
| **KILU** | Rés-do-chão. | Empieza a subir. Dice la palabra **pisando un escalón**, 100 ppm, articulación separadísima, paciente y sin condescendencia. Un paso audible después. |
| **KILU** | Primeiro. | Otro escalón, misma cadencia, mismo volumen. |
| **KILU** | Segundo. | Otro escalón. Idéntico. **La monotonía es el método.** |
| **KILU** | Terceiro. | Otro escalón, y aquí una pausa de segundo y medio. Deja que caiga. |
| **MIGUE** | Rés-do-chão... | Muy lento, 70 ppm, entendiendo mientras habla. Arrastra el final: es el sonido de una moneda cayendo. |
| **KILU** | Mais um. | Plano, amable, definitivo. 120 ppm. Ya está subiendo el siguiente tramo. |
| **MIGUE** | Mais um?! | Desesperado y cómico, 150 ppm, subiendo mucho, con la maleta arrastrando de nuevo. Medio grito. |
| **KILU** | Mais um! | Riéndose abiertamente, desde arriba, 140 ppm, con eco de escalera. Burla cariñosa. |
| **MIGUE** | Estou a subir. Estou sempre a subir. | Para sí, sin aire, entrecortado por la respiración y los escalones. 85 ppm. La segunda frase, más resignada y más lenta, **ya no habla de la escalera**. |
| **FÁTIMA** | Então? | Arriba del todo, esperando, con las llaves en la mano (tintineo). 150 ppm, impaciente, subiendo. Una palabra que significa «llevo aquí cinco minutos». |
| **MIGUE** | Cheguei. | Sin una gota de aire, 80 ppm, casi inaudible. Suelta la maleta. |
| **FÁTIMA** | A chave. | 150 ppm, dos palabras, sin ceremonia. Tintineo y entrega. |
| **MIGUE** | Obrigado. | 105 ppm, sincero y sin aliento. |
| SOM *(não dobrar)* | *[chave na fechadura; a porta abre; silêncio; uma cama de ferro a ranger]* | El silencio dentro del cuarto tiene que ser **mucho más seco** que la escalera: sin eco, habitación pequeña. La cama que cruje es el chiste, y llega antes que el chiste hablado. |
| **KILU** | É... fixe. | Un segundo de duda antes de «fixe». 105 ppm, generoso, **mintiendo con todo el cariño del mundo**. La palabra sale medio tono más alta de lo natural. |
| **MIGUE** | É pequeno. | Plano, honesto, 115 ppm. Sin queja: constatación. |
| **KILU** | É. | Inmediato, monosílabo, 130 ppm, y se ríe justo después. Se rinde de golpe. |
| **MIGUE** | E é caro? | 115 ppm, práctico. |
| SOM *(não dobrar)* | *[um carro a passar na rua, com a janela aberta]* | Justo encima de la última sílaba. |
| **MIGUE** | Carro? | 100 ppm, desconcertado, subiendo. |
| **KILU** | Caro, não carro. | 120 ppm, riéndose, marcando la vibrante múltiple en el segundo. **El par mínimo dentro del chiste, no en una lista.** |
| SOM *(não dobrar)* | *[os dois a rir; a mala a cair de lado]* | Risa real de los dos, tres segundos, superpuesta. **La única superposición de voces del episodio.** |
| **MIGUE** | Dona Fátima. | Todavía con restos de risa, y se le apaga a media palabra. 110 ppm. Se le acaba de ocurrir algo. |
| **MIGUE** | Quem mora no segundo? | 125 ppm, ligero, sin ninguna intención. Pregunta de cortesía, no acusación. |
| **KILU** *(bajito)* | Está lá alguém. | 105 ppm, tres palabras, sin mirar a nadie. **No es una advertencia: es un hecho que se le escapa.** |
| SOM *(não dobrar)* | *[em baixo, ao longe, a fita métrica outra vez]* | Audible por encima del piso de ruido: **no al borde de oírse**. |
| **FÁTIMA** | Ninguém. | Ya bajando la escalera, sin volverse, sin subir la voz. 140 ppm, plana, tres sílabas. **NO debe sonar a mentira: debe sonar a fin de la conversación.** Pasos que bajan, una puerta abajo, corte inmediato. |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. **`Quem mora no terceiro?` → `Quem mora no segundo?`** Migue acaba de aprender que el 3.º está un tramo más arriba y sube a **su** cuarto; con la versión anterior estaba preguntando quién vive donde vive él, y el remate moría. Es el error que más barato es hoy y más caro mañana.
2. **`Terceiro andar! À esquerda!` → `Terceiro esquerdo!`** En Portugal la puerta se designa `3.º esq.` / `3.º dt.` / `3.º frente`, y es contenido A1 utilísimo que no está en ningún sitio del corpus.
3. **Continuidad de Fátima arreglada:** gritaba desde abajo «sin pensar subir» y veinte réplicas después estaba arriba con las llaves. Ahora **ya está arriba desde la primera línea**.
4. **`Faz favor?` en una puerta → `Dá licença?`** (tercera función inventada, eliminada).
5. **`Estou aqui.` → `Cheguei.`** Calco de «aquí estoy»; `Cheguei` es A1 puro y además siembra el perfeito.
6. **Se añade `Está lá alguém.`** El pedagogo demostró que la contradicción del episodio vivía **sólo** en la pista de foley: el alumno cobraba la recompensa narrativa por reconocer un ruido metálico, no por entender portugués. Ahora la mentira de Fátima contradice **una línea de portugués**, y el alumno de A1 puede notarlo con las 101 palabras que ya tiene. El alumno del metro, además, la oye.
7. **Se sube el nivel de la fita métrica** por encima del piso de ruido: «que el alumno dude de si lo ha oído» funciona en la sala de edición y no en la línea 3 a las 7:40.
8. **Se añaden `Boa.` (segunda victoria de Migue), `Tens a chave?` (primera forma de `tu` de la serie) y el par mínimo `caro/carro`**, que el descriptor A1 pide y el corpus no tiene en ninguna forma.

**Nota didáctica.** Registro **C (Mundo)**: **un** dato, verificable, y le hace falta a un personaje ese día para resolver algo. El dato es el sistema portugués de plantas —`rés-do-chão`, `primeiro`, `segundo`, `terceiro`— y llega **caminado**: cada palabra ocupa el mismo segundo que un escalón. Regla de hierro cumplida (a Kilu le hace falta para que su amigo no se quede llamando a la puerta equivocada) y regla anti-folleto cumplida (ninguna línea empieza por «Em Portugal…»; hay exactamente un dato).

**Decisión de producción que hay que respetar en el lote:** el hombre que mide el piso **no tiene voz**, ni aquí ni en toda la banda A1-A2. Es foley y un silencio. Eso mantiene el episodio dentro del presupuesto de 5 voces, no depende de que el proveedor sostenga una voz invitada, y da algo que ninguna voz daría: el alumno identifica al antagonista **por un ruido antes que por un nombre**. El mismo efecto vuelve en el ep. 4 y ahí se le pone nombre.

---

## Episodio 4 · «Estás a ouvir?»

**Duración:** 4:15 de pista · núcleo 1:30.
**Sinopsis.** En el cuarto, a las once y media de la noche. Marta escucha con Migue la grabación de la primera mañana en la pastelaria y le hace repetir la ráfaga de la Dona Fátima hasta que él saca de ahí una sola palabra: un nombre. Después le pone otro sonido — el que él creía que era el tercer piso. Y luego le hace la pregunta que él lleva cuatro episodios esquivando.

**Lengua nueva: 25 formas · 112 tokens · 733 caracteres · acumulado 126 tipos.** Nuevas: onze · meia · outra · vez(es) · põe · já · tu · dizes · estás · ouvir · perceber · ouve · sei · sabes · trabalhar · falar · com · isto · andar · fita · métrica · nós · trabalhamos · giro. **Segunda persona `tu` saturada por primera vez en el curso:** ouviste · põe · dizes · estás (×2) · sabes · ouve. **6 `estar a + infinitivo` en 90 segundos, con el paradigma completo `estou / estás / está`, y cero gerundios** — contra un corpus que hoy tiene 24 progresivos europeos en 2.037 ítems. Reciclado: `pois` (3.ª aparición, 3.º valor) · `fixe` · `rés-do-chão` · `segundo` · `amanhã` (vuelve del ep. 1) · `nada` (3.º valor).

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| SOM *(não dobrar)* | *[quarto pequeno, sem eco; um portátil; auscultadores; um clique de reprodução]* | Mismo espacio seco del final del ep. 3. **El clic de reproducción es el motor del episodio y tiene que ser siempre el mismo sonido.** |
| **MIGUE** | Marta. São onze e meia. | 105 ppm, cansado, sin fuerza para discutir. **Presenta a Marta por su nombre y da la hora en la misma línea.** |
| **MARTA** | Outra vez. Põe outra vez. | Mezzo brillante del norte, melodía nortenha marcada, 160 ppm. Alegre, mandona, sin pedir permiso. Las dos frases pegadas, casi sin respirar. |
| **MIGUE** | Já ouviste três vezes. | Cansado, divertido, 120 ppm. Sin ninguna intención de discutir de verdad. |
| **MARTA** | Põe. | Monosílabo, 140 ppm, seco y risueño a la vez. Fin de la negociación. |
| **MARTA** | Obrigada. | 150 ppm, distraída, cogiendo el vaso de agua que él le pasa. Ambiente, pero **en primer plano**. |
| **MIGUE** | Obrigada. | Copiando sin pensar, 110 ppm. |
| **MARTA** | Obrigado. Tu dizes obrigado. | **Baja a 100 ppm sin cambiar de timbre**, cuatro palabras, sin levantar la vista de la pantalla. No es una clase: es una corrección entre socios, dicha y olvidada en dos segundos. |
| **FÁTIMA** *(gravação)* | Ó Zé! Ó Zé, isso fica para a semana, ouviste? Que eu ainda não assinei nada! | **EL MISMO FICHERO DEL EPISODIO 1**, sin retocar, sin ralentizar, sin limpiar. Reproducido por altavoz de portátil: filtrado, con algo de saturación. **Ni un doblaje nuevo.** |
| **MARTA** | Aí! | Cortando la grabación, alta, 170 ppm, excitada. Un clic inmediato después (rebobina). |
| **MARTA** | Estás a ouvir? | 155 ppm, muletilla, **sin ningún énfasis didáctico**: es como habla ella siempre. |
| **MIGUE** | Não estou a ouvir nada. | 115 ppm, honesto, derrotado. Se quita un auricular al decirlo (audible). |
| **MARTA** | Não estás a ouvir? | Incrédula, 165 ppm, subiendo mucho. Casi ofendida en broma. |
| **MIGUE** | Não estou a perceber, Marta. | 110 ppm, cansado de verdad, con el nombre al final como quien pide tregua. |
| **MARTA** | Ouve lá. Ó... | **Aquí baja a 95 ppm sin cambiar de timbre.** Es la misma persona hablando lento, no una voz de dictado: mismo color, misma melodía nortenha, sólo estirada. Pausa de 1 s. |
| **MIGUE** | Ó...? | Copiando, 90 ppm, dudando. Sube al final. |
| **MARTA** | Zé. | 95 ppm, aislada, con aire alrededor. La «é» abierta, muy marcada. |
| **MIGUE** | Zé? | 100 ppm, sin creérselo del todo. |
| **MARTA** | Zé. É um nome. | Vuelve a su velocidad normal de golpe, 160 ppm. Alegre, ya en otra cosa. |
| **FÁTIMA** *(gravação)* | Ó Zé! Ó Zé, isso fica para a semana, ouviste? Que eu ainda não assinei nada! | **El mismo fichero otra vez, íntegro, a toda velocidad, sin ninguna concesión.** |
| **MIGUE** | Ó Zé! | De golpe, alto, 150 ppm, encima de la grabación, con la alegría fea del que caza algo. Casi un grito. |
| **MARTA** | Fixe. | 140 ppm, corta, satisfecha. |
| **MARTA** | Isso é giro. | 150 ppm, ya distraída, apuntando algo. |
| **MARTA** | Pois. | Bajo, 130 ppm. Un segundo de pausa después. |
| **MARTA** | Quem é o Zé? | 155 ppm, curiosa, sin sospechar nada todavía. |
| **MIGUE** | Não sei. | Plano, 120 ppm, encogiéndose de hombros (audible en la silla). |
| **MARTA** | Não sabes? | 165 ppm, subiendo, medio en broma medio de verdad. |
| **MIGUE** | Marta, não sei nada. | Riéndose de sí mismo, cansado, 125 ppm. La risa se le queda a medias. |
| **MARTA** | Chiu. Estou a trabalhar. | «Chiu» seco y corto; luego 155 ppm, ya distraída, **tecleando de verdad debajo de la frase**. |
| **MARTA** | Ela está a falar com o Zé. | Casi para sí, más lenta, 130 ppm, mientras marca algo en la pantalla. Pensativa. |
| **MARTA** | E isto? | 150 ppm, ligera, cambiando de pista. Un clic inmediatamente después. |
| SOM *(não dobrar)* | *[a fita métrica metálica — duas vezes. Reproduzida pelo portátil.]* | **El mismo efecto del ep. 3**, filtrado por altavoz. Idéntico, reconocible al instante. |
| **MIGUE** | Isso é o segundo andar. | Tranquilo, hasta divertido, 130 ppm. Para él es una anécdota de escaleras. |
| **MARTA** | Isso é uma fita métrica. | **Deja de teclear antes de hablar** (el silencio de las teclas es la mitad de la réplica). 120 ppm, plana, sin dramatizar. |
| **MARTA** | E no rés-do-chão? | 135 ppm, ya con otra idea en la cabeza. |
| **MIGUE** | Não sei. | 105 ppm, bajo. |
| SOM *(não dobrar)* | *[silêncio longo — três segundos. Nem teclas, nem portátil. Ambiente de rua muito por baixo.]* | Después de tres episodios llenos de ruido de local, este vacío tiene que doler — pero con el ambiente audible debajo, para que no parezca que se cortó el audio. |
| **MARTA** | Migue. | 125 ppm, suave, seria. Cambia de tema sin avisar. |
| **MIGUE** | Hm? | Un gruñido, no una palabra. Distraído, todavía pensando en la cinta métrica. |
| **MARTA** | Nós trabalhamos amanhã. E o NIF? | 140 ppm, práctica, sin dramatismo. Es una pregunta de trabajo. |
| SOM *(não dobrar)* | *[dois segundos]* | Migue no contesta. |
| **MARTA** | Migue. O trabalho é amanhã. E o NIF? | Tres bloques separados, 135 ppm, bajando de volumen y subiendo de firmeza. La última pregunta más lenta que la primera vez. |
| **MIGUE** | Não tenho. | 95 ppm, bajísimo, dos palabras, sin excusa. Se corta el aire. |
| **MARTA** | Pois. | Un segundo después. Se quita los auriculares (audible) antes de decirlo. 110 ppm, grave para ella, resignada. Corte seco: sin música, sin cierre. |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. **Se presenta a Marta.** El alumno pasaba 86 segundos preguntándose si era la novia, la vecina o la socia, en vez de escuchando portugués. `Marta. São onze e meia.` + `Nós trabalhamos amanhã` establecen nombre, hora y relación en dos líneas — y la hora es descriptor A1.
2. **Se añade la reparación de `obrigada`.** El pedagogo demostró que la lección del ep. 1 le pedía al input que diera evidencia negativa, que es justo lo que el input no puede dar: doce episodios de exposición no reparada a un error modelado por el personaje-avatar. Ahora la corrección llega en el **ep. 4**, en cuatro palabras, en boca de la única persona con licencia para señalar la lengua, y **desde el oído**. La regla de la biblia cambia en consecuencia.
3. **`Isso é o terceiro andar` → `segundo`** (arrastre de la corrección del ep. 3).
4. **El norte de Marta pasa a estar escrito** (`Ouve lá`), no sólo en la acotación: con doblaje TTS en lote, una melodía nortenha que no está en el texto no va a existir.
5. **Se añaden `fixe`, `giro` y `rés-do-chão`** como reaparición: las tres estaban condenadas a una sola aparición en toda la tanda.
6. **El silencio largo lleva ambiente debajo** (regla 10).

**Nota didáctica.** Registro **D (Gente)** en la rotación: dos personas, sin trama en la superficie, y es **el que se puede oír con ruido**, así que cae siempre el mismo día de la semana. Aquí nace **O Arquivo**, y nace sin coste: la ráfaga del ep. 1 se reproduce dos veces sin retocar y el efecto de la cinta métrica del ep. 3 una vez. **Cero audio nuevo**, y el alumno recibe la única prueba de progreso que es infalsificable — el material no cambió; cambió él.

Descriptores servidos: *«identifica el número, la hora y el día que le dan en un mensaje de voz de 20 segundos, a la primera escucha»* — Migue extrae **un dato** (un nombre) de una ráfaga que sigue sin entender, que es exactamente la destreza; `estar a + infinitivo` sin un solo gerundio, con el paradigma completo; y el tuteo entre iguales, con **seis formas de `tu`** frente a las 0 de 62 conjugaciones que tiene el corpus hoy.

**El mecanismo que hay que proteger en el doblaje:** cuando Marta baja a 95-100 ppm **no puede cambiar de timbre**. Es la misma mujer hablando despacio, no una voz de dictado. Si el proveedor entrega esas cinco réplicas con otro color, la Capa 2 deja de ser una escena y vuelve a ser un truco de app — y eso no se arregla sin volver a doblar.

---

## Episodio 5 · «Está esquisito»

**Duración:** 4:30 de pista · núcleo 1:45.
**Sinopsis.** Migue quiere que la Dona Fátima le escriba y le firme la morada, así que le hace la pelota alabando su pastel de nata. Elige la peor palabra posible. Y cuando cree que se ha salvado, la caja registradora le pide lo único que no tiene.

**Lengua nueva: 31 formas · 152 tokens · 972 caracteres · acumulado 157 tipos.** Nuevas: alguma · coisa · hoje · diga-me · esquisito · muito · pronto · coma · epá · dizer · quê · disse · mau · falaste · mal · diz · antes · agora · pagas · quanto · vinte · talão · quer · contribuinte · número · ele · há · papel · escreva · assine · guarda. **Cero estructuras nuevas**: se consolida el imperativo de 3.ª persona deferente (`diga-me`, `coma`, `escreva`, `assine`) frente al de `tu` (`diz`, `pagas`), los dos en el mismo episodio y en bocas distintas. 2 `estar a + infinitivo`, 0 `você`, 0 gerundios.

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| **FÁTIMA** | O seguinte, faz favor! | AMBIENTE: máquina, loza, calle. Grito de mostrador, no de enfado. 170 ppm, la frase en un solo golpe. Corta el ambiente en seco. |
| **MIGUE** | Bom dia, Dona Fátima. Uma bica, se faz favor. | 115 ppm, sonrisa audible, acento mexicano marcado. **Ensayado**: separa «se faz favor» en tres palabras, como quien recita. |
| **FÁTIMA** | Uma bica. Mais alguma coisa? | 165 ppm, ya apuntando. La pregunta dura 0,5 s. Ni calor ni frialdad: eficiencia. |
| **MIGUE** | E um pastel de nata. | 118 ppm, contento. Alarga «nata» con gusto. |
| **FÁTIMA** | Um pastel. | Eco plano de confirmación, 170 ppm. Ruido de pinza y plato justo encima. |
| **KILU** | Bom dia, Migue. | Tenor medio, 145 ppm, vocales átonas **plenas** — no reduce como Fátima. Entra desde un lado, sin levantar la voz. |
| **MIGUE** | Ó Kilu! Bom dia. | 120 ppm, se alegra de verdad y sube el volumen. La «Ó» vocativa larga y abierta, sin diptongar. |
| **KILU** | E o trabalho? | 140 ppm, directo, mientras se sienta. |
| **MIGUE** | É hoje. | 110 ppm, dos palabras, con un peso que no se explica. |
| **FÁTIMA** | Aqui está. | 168 ppm. Golpe seco de platillo sobre el mármol **exactamente** al terminar la frase. |
| **MIGUE** | Mmm... Dona Fátima! | Con la boca llena. Sonido de gusto real durante 1 s y después el nombre en subida entusiasta. 110 ppm. |
| **FÁTIMA** | Diga-me. | 165 ppm, sin girarse, sigue trabajando. **Clítico pegado: una sola palabra fonética**, con la «e» final reducida casi a nada. |
| **MIGUE** | Isto está esquisito! Muito esquisito! | Eufórico, 110 ppm, muy alto, alargando «esquisito» con placer. **Cree que está haciendo el mayor cumplido de su vida. Cero duda en la voz.** |
| **FÁTIMA** | Esquisito. | **Silencio seco de 2 s antes** — que pare hasta la máquina. Contralto grave, 100 ppm, plana, sin pregunta y sin insulto. Es un eco, no una réplica. Deja 1 s después. |
| **MIGUE** | Sim! Muito, muito esquisito! | Sube todavía más, 105 ppm, silabeando para que ella lo entienda bien. El momento más alegre y más suicida del episodio. |
| **FÁTIMA** | Pronto. Não coma mais. | 162 ppm. **Plato retirado del mármol, seco, exactamente al empezar la frase.** Sin subir la voz. Sentencia, no discusión. |
| **MIGUE** | Não? Dona Fátima? Dona Fátima! | Pánico creciente en tres escalones, de 100 a 130 ppm. El último llamado se le quiebra. |
| **KILU** | Epá... Migue. Tu estás a dizer o quê? | Aguantando la risa, 140 ppm. «Epá» largo y descendente, con mucho aire. Después baja la voz, casi al oído. |
| **MIGUE** | O quê? O que é que eu disse? | 115 ppm, genuinamente perdido, subiendo. «O que é que» sale atropellado, como cadena única. |
| **KILU** | Esquisito não é bom. Esquisito é mau. Tu falaste mal. | Baja a 125 ppm, amable, didáctico de amigo y no de profesor. Separa las frases con 0,6 s. **Marca la /w/ final de «mau» y la ⟨l⟩ velarizada de «mal» con claridad, sin exagerar.** |
| **MIGUE** | Mau?! | Un solo golpe de 0,5 s, horror puro. Diptongo abierto y mexicano. |
| **KILU** | Diz antes: está bom. Está muito bom. | 130 ppm, paciente. Modela la frase dos veces **con la misma melodía**, para que se pueda imitar. |
| **MIGUE** | Obrigado, Kilu... Dona Fátima! Está bom! Está muito bom! | Primero bajo y avergonzado (105 ppm); después giro de cuerpo y **grito** hacia el mostrador (125 ppm), desesperado, dos veces seguidas. |
| **FÁTIMA** | Estou a ouvir, ó rapaz. Pois, pois. | Sin girarse, 150 ppm, sequísima, casi aburrida. **«Pois, pois» doblado es el desdén**; dos notas descendentes de 0,3 s. Nada de perdón en la voz. |
| **MIGUE** | E agora? | Bajito, a Kilu, 100 ppm, derrotado. |
| **KILU** | Agora pagas. | 140 ppm, seco y divertido. Corta cualquier autocompasión. |
| **MIGUE** | Quanto é? | 115 ppm, resignado, girado hacia el mostrador. |
| **FÁTIMA** | São dois e vinte. | 175 ppm, ráfaga, sin mirar. **Fórmula fija: tiene que sonar idéntica cada vez que la dice en toda la temporada, con el número como única variable.** |
| **MIGUE** | Dois e vinte... Aqui tem. | Cuenta monedas, 105 ppm, lento. Monedas sobre el mármol. |
| **FÁTIMA** | Talão? | 172 ppm, una palabra, automática de caja. |
| **MIGUE** | Não. | 110 ppm, sin pensarlo. |
| **FÁTIMA** | Quer com contribuinte? | 170 ppm, la misma automaticidad. Ni siquiera levanta la vista. |
| **MIGUE** | Sim! Sim, se faz favor. | 125 ppm, alegre y aplicado: cree que le están ofreciendo algo bueno y que por fin ha entendido una pregunta a la primera. |
| **FÁTIMA** | Número. | 168 ppm, una palabra, mano tendida. |
| SOM *(não dobrar)* | *[dois segundos. A máquina de café. Ninguém fala.]* | |
| **MIGUE** | ...Número? | 95 ppm, muy bajo. Sube al final como quien sabe que se acaba de meter solo en un pozo. |
| **KILU** *(bajito)* | Ele não tem. | 115 ppm, tres palabras, hacia Fátima, sin mirar a Migue. **Le está ahorrando decirlo a él.** |
| **FÁTIMA** | Então não há. | 160 ppm, plana, sin crueldad y sin consuelo. Golpe de tecla en la caja. |
| **KILU** | Ai, Migue... | Muriéndose de risa por fin, sin disimular. 1,5 s, con mucho aire. |
| SOM *(não dobrar)* | *[o pratinho a voltar ao mármore, devagar]* | **El gesto del episodio, y no lleva palabras encima.** |
| **FÁTIMA** | Coma. | 145 ppm, una palabra, sin mirarle, ya de espaldas. **Ni cariño ni disculpa: es la misma mujer, dos verbos, dos direcciones.** |
| **MIGUE** | Dona Fátima... tenho aqui um papel. | **Giro de tono del episodio.** 100 ppm, bajo, serio por primera vez. Ruido de papel desdoblándose. Aquí deja de ser una comedia. |
| **FÁTIMA** | Um papel. | 148 ppm. Tercer eco del episodio, pero éste sin burla: es cautela. 0,8 s. |
| **MIGUE** | É para o NIF. Escreva aqui a morada. E assine. | 112 ppm, cuidadoso: ha ensayado esto. Marca «Escreva» y «assine» con respeto explícito, casi con miedo. |
| **FÁTIMA** | Hoje não. | **Silencio de 3 s antes** — el más largo del episodio. Después 120 ppm, muy bajo, casi suave. Dos palabras y para. **No es un «no» de mostrador: es otra cosa, y tiene que oírse que es otra cosa.** |
| **MIGUE** | Hoje não? | 105 ppm, sin entender absolutamente nada. |
| **FÁTIMA** | O seguinte, faz favor! | 175 ppm, grito hacia otro cliente, idéntico al de la primera línea. Campanilla de la puerta encima. |
| **KILU** | Migue. Guarda o papel. | 130 ppm, muy bajo, ya sin nada de risa. **Primera vez en el episodio que Kilu suena preocupado.** 2 s de ambiente y corte seco. |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. **`Não come mais.` → `Não coma mais.`** El imperativo negativo de 3.ª persona exige conjuntivo. La versión anterior era ambigua en el mejor caso y agramatical como orden en el peor — y especialmente cara, porque dos episodios después se enseña bien `não digas` para `tu`: quedaban las dos celdas del sistema enfrentadas, una bien y otra mal.
2. **`propina` se elimina del episodio y de la banda.** El alumno tenía razón: `esquisito` + `propina` es la anécdota que cuenta cualquiera que estuvo en Lisboa, en ese orden, y suena a curso de idiomas. En su lugar entra **`Quer com contribuinte?`**, que es la pregunta que un extranjero oye literalmente todos los días en Portugal, que ningún curso enseña, **y que es la trama entera dicha por una caja registradora**: le piden el NIF que no tiene, en público, dos episodios antes de ir a buscarlo. `propina` se reubica en una escena universitaria de B1.
3. **Se añade `Coma.`** El alumno señaló que Fátima no le daba nada en ocho episodios y que para el 12 ya le caería mal. Ahora, después de la humillación, ella le devuelve el plato sin decir una palabra de más — y el alumno oye **el mismo verbo en imperativo negativo y afirmativo** con tres minutos de diferencia.
4. **El mecanismo de la sanción deja de ser siempre el eco plano.** Con `esquisito` es eco; con el contribuinte es **silencio + tecla de caja + la risa de Kilu**; en el ep. 2 fue la cita; en el ep. 6 será la no-reacción burocrática. Cuatro mecanismos, cuatro episodios.
5. **`mau/mal` completo:** faltaba un miembro del par. `Tu falaste mal` lo cierra, y de paso es otra forma de `tu`.
6. **`Está aqui.` → `Aqui está.`** (servir) y **→ `Aqui tem.`** (entregar/pagar). `Está aqui` significa «está aquí», ubicación; era el calco más repetido de la temporada. El par `Aqui está` / `Aqui tem` es además un ítem A1 precioso.
7. **`Uma bica. Mais?` → `Mais alguma coisa?`**; **`Diz assim` → `Diz antes`**; **`Pois.` → `Pois, pois.`**; **`Faz favor!` → `O seguinte, faz favor!`**; **precio a `dois e vinte`**.
8. **`Isto não é uma escola.` desaparece** con la propina que la motivaba; su función (el corte seco) la hace ahora `Então não há.`
9. **Se añade `E o trabalho?` / `É hoje.`** — el alumno señaló que el reloj del ep. 4 se tiraba a la basura. Ahora sigue corriendo, y **cobra en el ep. 6**.

**Nota didáctica.** Registro **B (Risa)**, y el chiste **es** el temario: `esquisito` es la entrada 32 de `glossary.json`, un fichero de 49 entradas que hoy ninguna pantalla del producto importa. No se explica dentro de la ficción: el sentido llega por el silencio seco de Fátima, la risa de Kilu y la corrección de un amigo en el mostrador, que es como se aprende esto en la calle.

**Arquitectura de escucha:** el episodio alterna Fátima a 165-175 ppm con redução máxima (Capa 1) y Kilu a 125-145 ppm con vocales plenas (Capa 2). **Kilu funciona de traductor intra-lengua:** repite en portugués fácil lo que Fátima dijo en portugués difícil. Gate 3: ninguna pregunta de la app se responde con una línea de Fátima.

**Producción:** bloquear la glosa española emergente de `esquisito`, `Esquisito.`, `Não coma mais.` y `Quer com contribuinte?` hasta que el episodio termine. Si el alumno toca «esquisito» y lee «raro» en el segundo 25, el episodio no enseña nada.

---

## Episodio 6 · «Senha B dezassete»

**Duración:** 4:45 de pista · núcleo 2:05. **Es el episodio más denso de la tanda y por eso su coda de reciclaje es la más larga.**
**Sinopsis.** Migue y Marta en la Loja do Cidadão para sacar el NIF. Hay que coger senha y esperar a que la megafonía cante tu letra y tu número, y Migue no oye nada. Cuando por fin llega al balcão, el Sr. Almeida le pide una cosa que Migue no tiene. Y a la salida, Marta hace una pregunta que ya no tiene respuesta buena.

**Lengua nueva: 40 formas · 182 tokens · 1.277 caracteres · acumulado 197 tipos.** Nuevas: anda · autocarro · demora · senha · ali · máquina · esta · essa · carrega · em · sete · dezassete · senta-te · quarenta · cinco · casa · pá · mesa · senhor · era · meu · és · dezasseis · falta · ouço · nervoso · letra · só · vai · documento · identificação · rua · por · escrito · assinatura · senhorio · sem · registo · dezanove · porquê. **Numerales europeos que hoy tienen 0 ocurrencias en los 2.037 ítems:** dezasseis, dezassete, dezanove. **Estructuras:** `há` existencial en negativa (`não há registo` — no `não tem`, que es brasileño); deixis `este/esse` contrastada; ênclise en imperativo de `tu` (`senta-te`); 1 `estar a + infinitivo`; 0 `você`; 0 gerundios.

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| **MARTA** | Anda lá. O autocarro demora sempre. | AMBIENTE: calle, puerta automática. Mezzo brillante, 160 ppm, **melodía nortenha muy marcada**. Rápida, práctica. |
| **MARTA** | Migue! A senha. Ali — a máquina. | AMBIENTE: sala grande con eco, gente, sillas, un teclado lejos. 160 ppm. Señala con la voz. |
| **MIGUE** | Esta? | 115 ppm, una sílaba, dudando. Sube al final. |
| **MARTA** | Essa. Carrega em Finanças. | 162 ppm. Marca la diferencia `esta`/`essa` **sin ninguna intención didáctica**: sólo está corrigiendo el dedo de Migue. |
| **MIGUE** | B... um... sete. | Bip de máquina y papel saliendo justo antes. 100 ppm, leyendo dígito a dígito como quien lee una matrícula. Pausas de 0,4 s. |
| **MARTA** | Dezassete. B dezassete. | 158 ppm. La primera vez corrige, la segunda ancla. Marca la doble ese sorda. |
| **MIGUE** | Dezassete. | 110 ppm, repitiendo para memorizarlo, **con la ese española [s] en vez de [z] — el error tiene que oírse**. |
| **MARTA** | Senta-te. Isto demora. | 155 ppm, ya sentándose ella. Silla de plástico. Clítico pegado: una palabra sola. |
| **MIGUE** | Isto é esquisito. | 108 ppm, mirando alrededor, sin ninguna gracia. **Lo usa bien, y es la primera vez.** |
| **MEGAFONE** | Senha A quarenta e dois. Balcão cinco. | **No es una sexta voz:** es la configuración «Almeida balcão» con pasa-banda 300-3400 Hz, compresión dura y reverb de sala grande. 130 ppm, absolutamente plana, sin melodía. Dos campanadas cortas antes. |
| **MIGUE** | Balcão? Que balcão? | 112 ppm, mirando hacia arriba, buscando algo que no está. |
| **MARTA** | Não é um balcão de casa, ó pá. É a mesa do senhor. Ali. | 155 ppm, riéndose a medias, sin parar de mirar el panel. **La desambiguación dura tres segundos y no vuelve a mencionarse.** |
| **MIGUE** | Era o meu? | 118 ppm, alarmado, medio levantándose. |
| **MARTA** | Não. Isso é A. Tu és B. | 160 ppm, sin dramatismo, empujándolo otra vez a la silla. Separa las dos letras con nitidez. |
| **MEGAFONE** | Senha B dezasseis. Balcão três. | Idéntica configuración. 130 ppm, plana. Campanadas antes. |
| **MIGUE** | B... dezasseis? | 105 ppm, inseguro, mirando el papel. |
| **MARTA** | Dezasseis. Falta um. | 158 ppm. Práctica. **La aritmética la hace ella en voz alta, para que el alumno también la haga.** |
| **MIGUE** | Marta, não ouço nada. | 110 ppm, bajo, confesando algo que le da vergüenza. **La frase más honesta de la temporada hasta aquí.** |
| **MARTA** | Não estás a ouvir. Estás nervoso. | 155 ppm, seca pero sin dureza. Diagnóstico, no consuelo. |
| **MARTA** | Ouve lá. Senha... B... dezassete... balcão... três. A letra, o número, o balcão. Só isso. | **Cambio de velocidad, mismo timbre: baja a 95 ppm.** No es voz de dictado ni voz de app — es la misma mujer hablando despacio a un amigo. Pausas de 0,5 s entre los tres elementos. La última frase vuelve a 150 ppm. |
| **MIGUE** | A letra... o número... o balcão. | 100 ppm, repitiendo para sí, casi susurrado. Se está agarrando a eso. |
| **MEGAFONE** | Senha B dezassete. Balcão três. | Idéntica configuración. **Que suene exactamente igual que las anteriores: el alumno tiene que reconocerlo, no adivinarlo.** |
| **MARTA** | Fixe! Vai! Balcão três! | 168 ppm, casi un grito, feliz. Pasos rápidos sobre suelo duro. |
| **ALMEIDA** | Bom dia. Faz favor. | **MODO VENTANILLA.** Barítono seco, 112 ppm, absolutamente plano, sin melodía y sin cortesía audible. No es antipático: es un procedimiento. Teclado de fondo. |
| **MIGUE** | Bom dia. B dezassete. | 115 ppm, orgullosísimo de haberlo oído bien. Casi lo canta. |
| **ALMEIDA** | Documento de identificação, se faz favor. | 112 ppm, plano, sin levantar la vista. Fórmula cerrada, siempre igual. |
| **MIGUE** | Aqui tem. | 118 ppm. Plástico sobre el mostrador. |
| **ALMEIDA** | Nome completo. | 112 ppm, plano, dos palabras. |
| **MIGUE** | Chamo-me Miguel Ángel Rentería Salazar. | 120 ppm, en español mexicano puro para el nombre — no lo portugueliza. **Contraste fonético deliberado con todo lo demás.** |
| **ALMEIDA** | Apelido. | 112 ppm, plano, una palabra, sin subir. No es una pregunta: es un campo del formulario. |
| **MIGUE** | ...Migue? | **Silencio de 1,5 s antes.** 95 ppm, muy bajo, dudando muchísimo. Sube al final como quien sabe que está a punto de equivocarse otra vez. |
| **ALMEIDA** | Apelido. Rentería. | 112 ppm, plano, sin la menor emoción, sin levantar la vista, **leyendo del documento**. Cero diversión. Eso es lo que lo hace gracioso. |
| **MIGUE** | Rentería. Desculpe. | 105 ppm, humillado, muy rápido. «Desculpe» pegado a la palabra anterior. |
| **ALMEIDA** | Morada em Portugal. | 112 ppm, plano. Siguiente campo. |
| **MIGUE** | Rua de Arroios, vinte e um, terceiro esquerdo. | 115 ppm, seguro: esto sí se lo sabe. Un punto de alivio. |
| **ALMEIDA** | Por escrito. | 112 ppm, plano, dos palabras. Deja 1 s. **La trampa entera cabe en dos palabras y no suena a trampa.** |
| **MIGUE** | Por escrito? | 100 ppm, el aire se le va. Sube al final. |
| **MIGUE** | Desculpe, não percebi. | 98 ppm, más bajo todavía. **La fórmula completa del descriptor, dicha cuando de verdad hace falta.** |
| **ALMEIDA** | Um papel com a assinatura do senhorio. | 112 ppm, plano, de un tirón. Ya lo ha dicho ocho mil veces. |
| **MIGUE** | E sem o papel? | 98 ppm, muy bajo, ya sabiendo la respuesta. |
| **ALMEIDA** | Sem o papel não há registo. E sem registo não há NIF. | 112 ppm, plano, sin crueldad y sin consuelo. Es una ley física. 1,5 s de silencio después. |
| **MEGAFONE** | Senha B dezanove. Balcão dois. | Idéntica configuración, un poco más lejos en la mezcla: ya están de espaldas. |
| **ALMEIDA** | O seguinte, faz favor. | 112 ppm, plano, mirando por encima del hombro de Migue. **Ya no existe.** |
| **MARTA** | Obrigada, senhor Almeida. | 155 ppm, medio paso detrás de Migue, recogiendo el documento. Educada de verdad, no de fórmula. |
| **MARTA** | Então? | AMBIENTE: puerta automática, calle, tráfico. 150 ppm, una palabra, subiendo. |
| **MIGUE** | Ela não quer escrever. | 100 ppm, plano, mirando al suelo. Sin energía. |
| **MARTA** | Quem? A Dona Fátima? | 160 ppm, dos preguntas pegadas, ya alerta. |
| **MIGUE** | Ela disse: hoje não. | 98 ppm, **citándola exactamente, con la misma entonación plana con la que Fátima lo dijo en el ep. 5**. Es una imitación y tiene que oírse que lo es. |
| **MARTA** | ...Hoje não, porquê? | **Silencio de 2 s antes.** 130 ppm, mucho más lento que el resto de sus líneas. No se lo está preguntando a Migue. |
| **MARTA** | E o trabalho? | 140 ppm, práctica, media vuelta ya andando. |
| **MIGUE** | Já não há. | 95 ppm, tres palabras. **Corte seco, sin ambiente de salida.** |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. **Almeida saluda:** un funcionário portugués dice `Bom dia` antes de `Faz favor`. Su sequedad se sostiene igual.
2. **`Faz favor, o próximo.` → `O seguinte, faz favor.`**
3. **La premisa jurídica se reformula.** «Sem o papel não há NIF» es una afirmación legal discutible (la AT admite morada estrangeira; un no comunitario lo que necesita es representante fiscal). Ahora Almeida dice lo que sí es cierto **en su ventanilla**: `Sem o papel não há registo. E sem registo não há NIF.` Es procedimiento, no ley, es igual de devastador, y usa dos `há` existenciales. **Aun así, esto va a la lista de decisiones de §5: hay que verificarlo con alguien que lo haya tramitado antes de doblar doce episodios sobre ello.**
4. **`Ela não escreve.` → `Ela não quer escrever.`**
5. **`Rua da Graça` → `Rua de Arroios, vinte e um, terceiro esquerdo`.** La pastelaria es Flor de **Arroios**; Graça y Arroios son freguesias distintas y un lisboeta lo nota en el segundo dos. Y la morada se da con el andar.
6. **Se desambigua `balcão`, que es el título de la serie.** El pedagogo señaló que la palabra aparece 9 veces, es la diana de la única tarea de extracción de la tanda, **no está en `glossary.json` ni en `vocab-catalog.json`**, y un hispanohablante oye «balcón». Ahora Migue mira hacia arriba y Marta lo baja al suelo en tres segundos. (Y en el ep. 1 el alumno ya lo oyó con su sentido real.)
7. **Se recorta la megafonía de cinco emisiones a cuatro** y se elimina «Um momento. O sistema está a carregar.» El alumno señaló el segundo exacto en que se le cae la máscara y ve el ejercicio debajo de la ficción; el episodio era además el más denso de los ocho.
8. **Se añaden a coste cero `Desculpe, não percebi.` y `Isto é esquisito.`** (reaparición) y **`E o trabalho? / Já não há.`**, que es donde el reloj del ep. 4 por fin cobra.

**Nota didáctica.** Registro **C (Mundo)**: **un** dato, y le hace falta a un personaje ese día. En Portugal, en la Loja do Cidadão y en las Finanças se coge senha en una máquina y se espera a que la megafonía cante **letra + número + balcão**. Si no lo oyes, pierdes el turno. Todo el episodio es esa tarea.

**Descriptor ancla** (`curriculos-completos.md:83`): *«identifica el número de teléfono, la hora y el día que le dan en un mensaje de voz de 20 segundos, a la primera escucha»*. La megafonía es el canal degradado real y la terna es una TaskSpec limpia: cuatro llamadas idénticas en estructura, tres distractores y una diana. **La app genera ítems de esto automáticamente y el alumno no percibe que está haciendo un ejercicio.**

**La capa fonética es una escena.** La réplica larga de Marta a 95 ppm es el mecanismo entero de la dirección: la repetición lenta ocurre **dentro** de la ficción porque ella rebobina, no porque la app tenga un botón. Requisito duro de doblaje: misma voz, misma persona, sólo más lenta.

**El contraste de registro es el contenido:** Marta a 155-168 ppm con melodía nortenha frente a Almeida a 112 ppm plano y nominal. Es la primera vez que el alumno oye que **la velocidad es una elección social y no una propiedad del idioma**. «Almeida café» llega en la Temporada 2 con la misma voz a 150 ppm: eso hay que planificarlo **ahora**, antes de comprar el lote.

**Presupuesto de voces: 3 reales** (Marta, Migue, Almeida) **+ megafonía, que no es una voz nueva** sino Almeida filtrado. Coste marginal cero.

---

## Episodio 7 · «Às sete e meia»

**Duración:** 4:30 de pista · núcleo 1:55.
**Sinopsis.** Las siete y media de la mañana, antes de que la pastelaria abra de verdad. Kilu entra a desayunar **saliendo** del turno de noche y la Dona Fátima le hace un galão. Hablan de dormir poco, de su hermana en Luanda y de cómo se dice «autobús» en Angola. En los últimos ocho segundos, Fátima le pide una cosa.

**Lengua nueva: 43 formas · 163 tokens · 983 caracteres · acumulado 240 tipos.** Nuevas: comeste · queres · torrada · dormiste · pouco · fazer · noites · entro · às · oito · saio · vida · come · pequeno-almoço · dormir · minha · irmã · ligou · ontem · pensar · vir · cá · chega · claro · tua · avó · avô · vem · como · avião · depois · dizemos · machimbombo · diga · fato · prédio · este · calhar · metas · nisso · cima · onde · chateies. **Siembra receptiva del perfeito en `tu`** —`comeste`, `dormiste`, más `ligou`—: tres formas fijas sin paradigma, que se cosechan en la Temporada 2. **Contraste ênclise/próclise real en la misma boca:** `Senta-te` (afirmativo, ep. 6) ⟷ `Não te metas nisso` y `Não me chateies` (negativo). 2 `estar a + infinitivo`; 0 `você`; 0 gerundios.

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| **FÁTIMA** | Ó Kilu. Bom dia. | AMBIENTE: persiana metálica acabando de subir, calle vacía, un pájaro, cero música. Contralto grave, **140 ppm — más lenta que nunca**: es la primera hora y no hay clientes. Sin grano de mostrador: casi cariñosa, aunque ella no lo admitiría. |
| **KILU** | Bom dia, Dona Fátima. | Tenor medio, 140 ppm, articulación limpia. Cansado: la voz un poco más grave de lo habitual, arrastrando el final. |
| **FÁTIMA** | Já comeste? | 138 ppm, sin mirar, ya con el vaso en la mano. Pregunta de madre, tono de patrona. |
| **KILU** | Ainda não. | 135 ppm, dos palabras, sin energía. |
| **FÁTIMA** | Senta-te. Queres um galão? | 140 ppm. Orden y oferta en la misma respiración, sin esperar respuesta. Clítico pegado: una palabra sola. |
| **KILU** | Um galão. E uma torrada. | 138 ppm. La segunda frase la añade tarde, como quien se lo piensa. |
| **FÁTIMA** | Torrada. Pronto. | 142 ppm. «Pronto» descendente, 0,3 s, cierra el turno. Después 3 s de máquina y pan en la tostadora. |
| **FÁTIMA** | Aqui está. | 140 ppm. Vaso sobre el plato, sin golpe: hoy no lo estampa. |
| **KILU** | Obrigado. | 135 ppm, una palabra, con aire. Sinceridad de las siete de la mañana. |
| **FÁTIMA** | E então? Dormiste? | 138 ppm, ya apoyada en el mostrador con los dos codos. **Ha dejado de trabajar: eso tiene que oírse en el ambiente, que se queda quieto.** |
| **KILU** | Pouco. Muito pouco. | 130 ppm, arrastrando, con una risa muy corta al final que no llega a risa. |
| **FÁTIMA** | Estás outra vez a fazer noites. | 138 ppm. No es pregunta: es reproche disfrazado de constatación. Baja al final. |
| **KILU** | Outra vez. Entro às oito, saio às oito. | 135 ppm. La segunda mitad con ritmo de fórmula, casi cantada — la ha dicho mil veces. Marca las dos contracciones `às`. |
| **FÁTIMA** | Isso não é vida. | 142 ppm, seca, con la mano en el mármol. Opinión, no consuelo. |
| **KILU** | É o que há. | 132 ppm, cuatro sílabas, **sin autocompasión y sin queja**. Punto final. 1 s de silencio después. |
| **FÁTIMA** | Pois é. | 140 ppm, dos sílabas descendentes, concediendo. Loza y cuchara. |
| **FÁTIMA** | Come o pequeno-almoço e vai dormir. | 138 ppm, empujándole el plato. Imperativo de `tu`, dos veces, sin ninguna ceremonia. |
| **KILU** | A minha irmã ligou ontem. De Luanda. | 138 ppm, cambio de tema, se le anima la voz. |
| **FÁTIMA** | E então? | 140 ppm, dos sílabas, subiendo. Interés real. |
| **KILU** | Está a pensar em vir para cá. | 136 ppm, con cuidado — todavía no se atreve a alegrarse. |
| **KILU** | Chega dia dezassete. | 134 ppm, y aquí sí sonríe. |
| **FÁTIMA** | Pois claro que está. | 144 ppm, de un tirón, sin sorpresa ninguna. Evidencia. |
| **FÁTIMA** | E a tua avó? Está bem? | 138 ppm. **Se acuerda de la abuela: eso dice más de Fátima que cualquier descripción.** |
| **KILU** | A minha avó está bem. O meu avô não. | 130 ppm, más lento. Marca la diferencia de vocal con nitidez: «avó» abierta, «avô» cerrada. **NO exagerar: tiene que sonar a habla, no a ejercicio.** Deja 1,5 s. |
| **FÁTIMA** | Ai. | Una sílaba, 1 s, con aire. No dice nada más. **Ese silencio es la línea.** |
| **FÁTIMA** | E ela vem como? De avião? | 140 ppm, retomando el hilo. Práctica: vuelve a lo concreto. |
| **KILU** | De avião. Depois, cá, é de autocarro. | 138 ppm. «autocarro» **sin ningún énfasis**: es una palabra normal para él. |
| **FÁTIMA** | Pois. | 140 ppm, una sílaba descendente, 0,3 s. |
| **KILU** | Lá em Luanda não dizemos autocarro. Dizemos machimbombo. | 135 ppm, divertido, un poco orgulloso. Marca «machimbombo» sílaba a sílaba la primera vez, como quien presenta a alguien. |
| **FÁTIMA** | Machi... quê? | 138 ppm, **se atasca de verdad**. La palabra le resulta ajena y no lo disimula. Sube al final. |
| **KILU** | Machimbombo. | 125 ppm, más lento que antes, sílaba a sílaba, sin condescendencia. |
| **FÁTIMA** | Machimbombo. É giro. | 138 ppm. Repite la palabra con torpeza y después el juicio, seco y corto. 0,8 s entre las dos frases. |
| **KILU** | É. | Una sílaba con una sonrisa dentro. 0,4 s. Después 2 s de taza y de calle: el episodio respira. |
| **FÁTIMA** | Ó Kilu. | **Cambio de tono.** 130 ppm, más bajo de volumen, más grave. Ha dejado de apoyarse en el mostrador. El ambiente se cierra: quitar la calle de la mezcla. |
| **KILU** | Diga. | 135 ppm, una palabra. Ya sabe que viene algo. |
| **FÁTIMA** | Anda aí um senhor. | 128 ppm, muy bajo, casi sin abrir la boca. Cinco palabras. |
| **KILU** | Que senhor? | 132 ppm, la taza queda parada en el aire. Sin alarma todavía. |
| **FÁTIMA** | Um senhor de fato. Quer o prédio. | 126 ppm. Las dos frases separadas por 1 s. La segunda, más baja aún. Después **silencio seco de 2 s con ambiente debajo**. |
| **KILU** | Este prédio? | 130 ppm, dos palabras, muy bajo. Taza sobre el plato, seco. |
| **FÁTIMA** | Este prédio. | 124 ppm, eco plano, sin subir. Es su cuarto eco de la temporada y el único que da miedo. |
| **KILU** | E a Dona Fátima? | 130 ppm. Pregunta directa, en 3.ª persona con el título — **la única forma en que puede preguntarle algo así sin ofenderla.** |
| **FÁTIMA** | Se calhar não é nada. | **Silencio de 2 s antes.** 120 ppm, la más lenta de todo el episodio, sin convicción ninguna. **Es una frase que no se cree.** |
| **KILU** | Dona Fátima... | 128 ppm, arrastrando, con reproche. No la deja escapar. |
| **FÁTIMA** | Ó Kilu. Não te metas nisso. | **Corta a Kilu**, encima de su última sílaba. 148 ppm: sube la velocidad y baja el volumen — eso es lo que hace Fátima cuando está asustada. Dura. |
| **KILU** | Mas ele mora lá em cima. | 140 ppm, sube el volumen por primera vez en el episodio. Está discutiendo. |
| **FÁTIMA** | Sei bem onde ele mora. Não me chateies. | 150 ppm la primera frase, cortante; después 1 s de pausa y la segunda a **118 ppm, muchísimo más lenta y más baja**. Casi una súplica, y por eso da más miedo. |
| **KILU** | ...Está bem. | **Silencio de 3 s antes.** 120 ppm, dos palabras, sin ninguna convicción. Se oye que no le gusta. |
| **FÁTIMA** | O seguinte, faz favor! | 175 ppm, grito de mostrador. Campanilla y ruido de calle entrando de golpe. Corte inmediato, sin cola. |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. **El par ênclise/próclise que la nota anunciaba no existía.** En «Não digas nada» **no hay ningún clítico**: `nada` es un pronombre negativo. Era el mismo error metalingüístico de los 57 ítems de `b8-l3`, cometido en la biblia que iba a corregirlos. Ahora hay dos próclises reales —**`Não te metas nisso`** y **`Não me chateies`**— contra la ênclise de `Senta-te`, en la misma boca y con dos velocidades opuestas.
2. **`trabalhar de noite` → `fazer noites`**, que es el idiomatismo, y **la escena se reencuadra como salida de turno**, no como entrada: a las 7:30 no se puede entrar a las ocho de la noche. `Entro às oito, saio às oito` ahora cuadra.
3. **`Lá em casa` → `Lá em Luanda`.** `Lá em casa` es «en mi hogar»; un portugués entendía que en el piso de Kilu se dice machimbombo y en la calle no. Para «allá en mi país» se dice `lá na minha terra` / `lá em Luanda`.
4. **`Anda aqui um senhor` → `Anda aí um senhor`** (más vago, más inquietante, más portugués).
5. **`Está aqui.` → `Aqui está.`** y **`Depois, aqui, é o autocarro` → `Depois, cá, é de autocarro`**.
6. **Se poda el pronombre sujeto explícito de Fátima:** `Eu sei onde ele mora` → **`Sei bem onde ele mora`**. Individualmente los sujetos explícitos pasan; en conjunto sonaban a traducción.
7. **Se añade `pequeno-almoço`** —era el episodio del desayuno y faltaba la palabra, que está en la lista A1 obligatoria— **y `Chega dia dezassete`**, que da la segunda aparición del numeral y una fecha.
8. **`Faz favor!` → `O seguinte, faz favor!`**

**Nota didáctica.** Registro **D (Gente)**: dos personas, sin trama aparente, hasta los últimos ocho segundos. Es el episodio que se puede oír con ruido —densidad baja, frases cortas, ninguna cifra que retener— y por eso cae siempre el mismo día de la semana.

**Y es el episodio que hace que alguien suene portugués.** Aquí viven los marcadores que ninguna app enseña y que el corpus casi no tiene: `pois` (5 ocurrencias hoy, casi todas metalingüísticas), `pois é`, `pronto` (4), `então`, `se calhar` (**0**), `giro` (**0**), y `É` como respuesta plena. Y aquí vive el tratamiento en su forma más difícil: **Fátima tutea a Kilu** (`comeste`, `dormiste`, `a tua avó`, `senta-te`, `não te metas`) **y Kilu la trata a ella de 3.ª persona con título** (`Dona Fátima`, `Diga`, `E a Dona Fátima?`). La asimetría se oye durante dos minutos y nadie la menciona. `mdx/b10/l1-registro-formal-informal.mdx` hoy enseña lo contrario; **este episodio es su refutación en audio.**

**Siembra receptiva del perfeito en `tu`:** `comeste`, `dormiste`, `ligou`. Tres formas fijas, sin paradigma, sin explicación y sin ejercicio en A1. Se cosechan en la Temporada 2, donde el paradigma de `tu` es el contenido central. Hoy, de 62 conjugaciones del corpus, **cero** usan `tu`: es la celda vacía más cara del producto, y la única forma barata de llenarla es que el alumno la haya oído cien veces antes de estudiarla.

**Par mínimo en contexto:** `avó`/`avô`, dentro de una frase con peso emocional. Es uno de los 20 pares del descriptor A1 y de paso desmiente `b1/086de331`, que hoy graba el agramatical «Minha avô mora em Lisboa» y presenta el par como una diferencia Brasil/Portugal.

**El portugués no es propiedad de Portugal:** `machimbombo` entra por la puerta correcta —«lá em Luanda não dizemos autocarro»— y no por la del folleto. Y es **la primera vez en toda la serie que alguien coge de verdad un autocarro**: hoy las 14 ocurrencias del corpus son metalingüísticas.

---

## Episodio 8 · «Não era nada»

**Duración:** 4:00 de pista · núcleo 1:25. **Es el más corto a propósito, y el que hay que entender entero.**
**Sinopsis.** Migue vuelve al balcão con el papel por tercera vez, y esta vez sin trabajo. Suena el teléfono de la pastelaria y la Dona Fátima contesta delante de él. Cuando cuelga, le dice que no era nada. Migue ha oído lo suficiente para saber que sí era.

**Lengua nueva: 19 formas · 125 tokens · 779 caracteres · acumulado 259 tipos. El 18,4 % de tokens nuevos — la cifra más baja de la tanda, frente a un gate del 20 %.** Nuevas: posso · também · olhe · deixe-me · perdi · quero · sou · doutor · cliente · sexta-feira · noventa · cêntimos · quinta · na · sexta · ir · duas · estamos · juntos. **Todo su material dramático está construido con palabras que el alumno ha oído tres o cuatro veces**: papel, morada, amanhã, prédio, bica, faz favor, talão, contribuinte, se calhar, sabes. **Estructuras:** contraste `era`/`é` (primer imperfeito de la serie, receptivo, sin explicación); 2 ênclises con imperativo deferente (`escreva`, `deixe-me`); 2 `estar a + infinitivo`; 0 `você`; 0 gerundios. Días de la semana: `vocab-catalog.json` tiene hoy **0 de 7**.

| Personaje | Portugués | Indicación de voz |
|---|---|---|
| **MIGUE** | Dona Fátima. | AMBIENTE: mediodía, pastelaria llena, voces, loza, máquina. 108 ppm, plano, **sin saludo**. No dice «bom dia»: eso es lo primero que cambia. |
| **FÁTIMA** | Faz favor. | 165 ppm, sin girarse, fórmula de mostrador aplicada a alguien a quien conoce. **Es una manera de no mirarle.** |
| **MIGUE** | É o papel. | 106 ppm, tres palabras. Papel sobre el mármol. |
| **FÁTIMA** | Outra vez o papel. | 160 ppm, cansada, sin rabia. Sigue trabajando. |
| **MIGUE** | Escreva aqui a morada. E assine. É só isso. | 112 ppm. Las tres frases seguidas, sin dejarle hueco. «É só isso» más bajo, casi suplicando. |
| **FÁTIMA** | Hoje não posso. | 158 ppm, tres palabras, ya de espaldas. |
| **MIGUE** | Ontem também não. | 104 ppm, muy plano, sin subir. **La primera vez en la serie que Migue le contesta.** |
| **FÁTIMA** | Olhe lá. Deixe-me trabalhar. | 170 ppm, girándose por fin, cortante. «Olhe lá» de un golpe, casi una sílaba. 0,5 s antes de la segunda frase. |
| **MIGUE** | Dona Fátima, perdi o trabalho. | 100 ppm, sin dramatizar, casi administrativo. **Y por eso pesa.** 1 s de silencio después. |
| **MIGUE** | Também quero trabalhar. Sem o NIF não posso. | 110 ppm, sin levantar la voz, muy claro. Marca «também» y «trabalhar»: **está devolviéndole su propia palabra.** Después 1 s de nada. |
| **FÁTIMA** | Amanhã. | 155 ppm, una palabra, sin mirarle. |
| **MIGUE** | Amanhã? | 105 ppm, la misma palabra subiendo. Nada más. |
| **FÁTIMA** | Amanhã. | 152 ppm, la misma palabra bajando, cerrada. **Tres «amanhã» seguidos con tres melodías distintas.** |
| **FÁTIMA** | Estou? ... Sim, sou eu. | **Teléfono de pared sonando, dos tonos, encima de la línea anterior.** 150 ppm. «Estou?» corto y subiendo. Después 2 s de silencio con ruido de sala mientras escucha. |
| **FÁTIMA** | Sim, senhor doutor... Não, não. Estou a falar com um cliente... Sim. O prédio, sim... Sexta-feira. Sexta-feira está bem. | **La línea más importante del episodio.** Baja el volumen y gira el cuerpo — que se oiga que se aparta. 145 ppm, medio susurrada, con pausas de 1-1,5 s en cada puntos suspensivos. **«O prédio» y «Sexta-feira» tienen que quedar perfectamente inteligibles pese al susurro: son los dos datos.** «Estou a falar com um cliente» sale rápida y descuidada, como algo que no importa. |
| **MIGUE** | ...Dona Fátima? | **Clic del teléfono al colgar** y después 2 s con todo el ambiente de la sala bajado, casi mudo. 95 ppm, muy bajo, dos palabras. No es una pregunta: **es una oportunidad que le está dando.** |
| **FÁTIMA** | Não era nada. Uma bica? | **Sube de golpe a 168 ppm** y a volumen de mostrador: vuelve la voz de trabajo, el ambiente vuelve a entrar. **La transición tiene que ser brutal y perfectamente audible.** Sonrisa falsa en la voz. |
| **MIGUE** | ...Uma bica. | **Silencio de 1,5 s antes.** 92 ppm, dos palabras, absolutamente muertas. Acepta el café porque no sabe qué otra cosa hacer. |
| **MIGUE** | Isto é mau. | 90 ppm, para sí, casi inaudible, mirando el papel. |
| **FÁTIMA** | Noventa cêntimos. | AMBIENTE: máquina de café, 3 s largos y solos antes. 172 ppm, fórmula fija idéntica a la del ep. 5. **Que no se note ni un gramo de lo que acaba de pasar.** |
| **MIGUE** | Aqui tem. Obrigado. | 96 ppm. Monedas. «Obrigado» hueco, mecánico, sin ninguna gratitud dentro. |
| **FÁTIMA** | Quer talão? Com contribuinte? | 170 ppm, fórmula automática de caja, **la misma que en el ep. 5 y con la misma indiferencia**. |
| **MIGUE** | Não. | 90 ppm, una sílaba. Después 2 s de nada. |
| **MIGUE** | Kilu. | 98 ppm, girándose hacia el otro lado del balcão. Bajo. |
| **KILU** | Diz. | 138 ppm, una sílaba, **y demasiado rápida**. Ya sabe lo que viene. |
| **MIGUE** | O que é sexta-feira? | 100 ppm, **inocente de verdad**. La pregunta más de A1 posible, hecha en el peor momento posible. **Silencio de 3 s después** — el más largo de la tanda. |
| **KILU** | É... é o dia. Depois de quinta. | 120 ppm — mucho más lento que cualquier línea suya de la serie. Se atasca en el primer «É». **Es la verdad, y es una cobardía, y las dos cosas tienen que oírse.** |
| **MIGUE** | Kilu. O que é que ela vai fazer na sexta? | 106 ppm, muy claro, sin subir la voz. Cada palabra separada. **No es una pregunta: es una acusación educada.** Silencio de 2 s después. |
| **KILU** | Epá, Migue. Tenho de ir. Entro às duas. | 145 ppm, demasiado rápido, atropellando. Silla, monedas dejadas de cualquier manera. **No contesta y los dos lo saben.** |
| **MIGUE** | Tu sabes alguma coisa. | 102 ppm, plano, sin acusación en el tono — y por eso es peor. |
| **KILU** | Se calhar não é nada. | 130 ppm, sin mirarle. **Es la frase de Fátima, en su boca, palabra por palabra.** |
| **KILU** | Estamos juntos. | 128 ppm, ya de espaldas, la despedida angoleña de siempre, y hoy suena a excusa. |
| **MIGUE** | Kilu! | 125 ppm, una sílaba, alto, con la voz rota. **Campanilla de la puerta y calle cortando la palabra por la mitad.** |
| **FÁTIMA** | O seguinte, faz favor! | 175 ppm, desde el otro extremo del balcão, exactamente igual que en los eps. 5 y 7. **Corte inmediato sobre la campanilla, sin cola, sin música.** |

**Qué cambió tras la revisión de Lisboa (y del panel).**
1. **`O que é que ela está a fazer na sexta-feira?` → `O que é que ela vai fazer na sexta?`** En portugués europeo el progresivo **no** proyecta al futuro: eso es inglés y español. Era la única de las diez ocurrencias de `estar a + infinitivo` de la tanda que estaba mal, y estaba mal justo donde la nota didáctica la canonizaba como «un uso que ninguna gramática menciona». Corregirla además regala `vai + infinitivo`.
2. **Se añade `Quer com contribuinte?` al `Quer talão?`** — el nativo señaló que es la pregunta que de verdad se dispara en cada caja del país, y ahora es un callback frío de la humillación del ep. 5: la misma pregunta, la misma indiferencia, y ahora Migue ya sabe lo que significa.
3. **Se añade `Dona Fátima, perdi o trabalho.`** El alumno señaló que el reloj del ep. 4 nunca cobraba. Cobra en el ep. 6 y **se dice a la cara** en el ep. 8, y por eso su insistencia con el papel deja de ser terca y pasa a ser desesperada.
4. **`Está aqui.` → `Aqui tem.`**; **`Escreva-me a morada` → `Escreva aqui a morada`** (el enclítico estaba bien, faltaba el objeto: «escreva-me» solo suena a «escríbame a mí»); **precio corregido a `Noventa cêntimos`** (setenta es precio de 2014).
5. **Se poda el pronombre sujeto explícito de Migue** donde no es contrastivo (`Eu também quero` → `Também quero`; `eu tenho de ir` → `Tenho de ir`).
6. **Se añade `Estamos juntos`** — Kilu tenía **una** palabra angoleña en toda la tanda; ésta cuesta cero y lo convierte en una persona de un sitio. Y colocada aquí, en la salida cobarde, duele.
7. **Se añaden `Se calhar não é nada` (en boca de Kilu) e `Isto é mau`**: reaparición de dos banderas que morían en un solo episodio, y las dos hacen trabajo dramático.
8. **Regla de glosado publicada:** la glosa española de la línea del teléfono es **íntegramente en español** («El viernes está bien»), y la app **bloquea el diccionario emergente** de esa línea hasta que se cierran las tareas del episodio. Dejar `sexta-feira` a medio traducir en la glosa inutilizaba la tarea de mediación y adelantaba el remate.

**Nota didáctica.** Registro **A (Trama)**: el más corto y el único de la tanda que mueve el triángulo material. Aquí se cierra la primera vuelta y se abre la segunda mitad de la Temporada 1, que termina en el ep. 12 con el NIF — o con Migue entendiendo por qué no puede tenerlo.

**La mentira es audible y es la tarea.** La línea del teléfono contiene tres datos extraíbles por un alumno de A1 (un `senhor doutor`, el `prédio`, `sexta-feira`) y la siguiente los niega con `Não era nada`. La app puntúa exactamente eso. Es el descriptor A1 de mediación semilla —*«transmite en español el contenido de un aviso breve (precio, hora, lugar, condición) sin omitir ni añadir ningún dato»*— y por una vez omitir un dato tiene **consecuencia narrativa**, no sólo puntuación. Y hay un cuarto dato que duele: acaba de llamar `um cliente` a Migue, que está a un metro.

**El episodio invierte la jerarquía.** Migue pregunta «O que é sexta-feira?» y el alumno, a esta altura, ya lo sabe. **Es la primera vez que el que escucha va por delante del protagonista** — y no es la única: en el ep. 3 el alumno ya sabía que Fátima mentía, porque Kilu dijo `Está lá alguém` y ella dijo `Ninguém`. Ése es el motor de retención que ninguna racha da: no una gráfica, la sensación concreta de haber entendido algo que el personaje no.

**Contrastes que entran sin explicarse:** `era`/`é` (primer imperfeito, receptivo); `Se calhar não é nada` (ep. 7) frente a `Não era nada` (aquí); los tres `Amanhã` con tres melodías (mínimo par prosódico puro, sin léxico nuevo, y un tipo de ítem que el corpus no tiene en absoluto); las dos ênclises deferentes (`escreva`, `deixe-me`) frente al `diz` de tú de Kilu; `ter de ir` y no `ter que ir`; `Estou?` al teléfono y no `Alô`.

**Arco:** ninguna pregunta abierta dura más de tres episodios. El `Hoje não` del ep. 5 se explica aquí. Lo que queda abierto —qué pasa el viernes— se cierra en el ep. 12, dentro de la banda A1. **El que se baja en A2 cobra.**

---

# 4. Cómo se convierte un episodio en una sesión de 25 minutos

El episodio no **es** la sesión: es su columna. La sesión son 25 minutos en el móvil, casi siempre de pie, y el episodio ocupa entre cuatro y cinco. Todo lo demás sale de él.

## 4.1 · El molde

| | Minutos | Qué pasa | Regla |
|---|---:|---|---|
| **Antes — «O que aconteceu»** | 2 | Migue cuenta en español lo que le pasó (Capa 0) y la app muestra **cuatro palabras** del episodio, sin traducción, sólo con audio: son las que van a decidir si entiende. | La Capa 0 **no puede contener ningún dato que responda a una tarea**. Verificable: guion y tareas viven en el mismo archivo. |
| **Mientras — primera escucha** | 4-5 | El episodio entero, a velocidad real, **sin transcripción**. Una sola pregunta al final, de extracción: un número, un nombre, un día. | Si falla, no pasa nada: se repite. **La app no marca el día por reproducir el episodio.** |
| **Mientras — «Outra vez»** | 3 | La reprise: las 6-8 líneas más duras reemitidas en Capa 2 (95-125 ppm), **cada una seguida de su emisión original a velocidad real**. En A1 la voz es la de Kilu; a partir del ep. 4, la de Marta. | Ninguna línea de Capa 1 se queda sin su reemisión. **Todas las preguntas se responden con la Capa 2.** |
| **Mientras — segunda escucha con texto** | 3 | El episodio otra vez, ahora con la transcripción sincronizada y el diccionario emergente activo — **salvo en las líneas bloqueadas** (los falsos amigos y los remates de trama). | El bloqueo se levanta al cerrar las tareas del episodio. |
| **Después — la capa de fonología** | **5-8** | Ver §4.2. | Nunca es una clase. |
| **Después — el juego** | 6-8 | Las tareas generadas (§4.4) más la cola de FSRS del día. | **El día se marca aquí y sólo aquí.** |
| **Después — el artefacto** | 2 | Un objeto escrito del mundo del episodio: la ementa de la Flor de Arroios, el horário de la Loja do Cidadão, el aviso do condomínio, el recibo del quarto. 60-120 palabras, con preguntas de dato explícito. | **Cada episodio entrega su artefacto.** Es lo que cierra los dos descriptores A1 que un audio no puede cerrar. |

**Total:** 25-30 minutos, de los cuales el alumno oye el episodio **tres veces** sin que se lo parezca.

## 4.2 · La capa de fonología, 5-8 minutos, sin volverse una clase

El currículo dice que la fonología es el **40 % de las horas de A1**, y la instrucción del dueño es que deje de ser un bloque y pase a ser una capa dentro de una frase que sirva para algo. Se cumple con tres reglas:

1. **El material sale del episodio que se acaba de oír, sin excepción.** Nada de listas de pares mínimos genéricos: los pares son los que la escena cruzó (`caro/carro` en el ep. 3, `mau/mal` en el 5, `avó/avô` en el 7, `dezasseis/dezassete` en el 6). La discriminación A/B se hace sobre **las voces del reparto**, no sobre una voz de laboratorio.
2. **El modelo de la lentitud es una persona, no un botón.** La reemisión lenta ya existe dentro de la ficción porque Marta rebobina o Kilu reformula. La capa de fonología **reusa esos mismos ficheros**: primero la línea lenta (95-105 ppm), después la rápida (145-175), después el hueco para que el alumno la diga encima. Coste de audio adicional: cero.
3. **Se nombra el fenómeno una sola vez y por su consecuencia, nunca por su símbolo.** No «redução vocálica átona /e/→[ɨ]», sino: *«esta palabra tiene tres sílabas escritas y dos habladas. Óyelas.»* El símbolo fonético existe en la ficha del concepto, para quien lo abra; no en la pantalla.

**Los cinco minutos, en la práctica:** 90 s de discriminación A/B (8 pares, tomados del episodio) · 90 s de **dictado** de 4 frases de 6-10 palabras construidas por recombinación de las réplicas del episodio · 120 s de **shadowing** sobre 3 líneas con su versión lenta disponible · 60 s de una sola cadena de habla conectada del episodio, marcada y repetida (`É para aqui ou para levar?`, `Sem o papel não há registo`).

## 4.3 · La coda de reciclaje: cómo se llega de 100 a 450 palabras

El núcleo dramático de estos ocho episodios va de 67 a 182 tokens. La banda pide 380-520 palabras. La diferencia **no se cubre escribiendo más trama** —eso multiplicaría el léxico nuevo, que es justo el defecto que estamos corrigiendo— sino con **masa reciclada**, y con una regla dura: **ninguna palabra nueva entra por la coda.**

Tres piezas, en este orden:

- **«Outra vez» (~40 palabras).** La reprise. Es audio nuevo pero léxico cero.
- **«O que aconteceu» (~130 palabras).** El recap del episodio **en portugués**, leído por Kilu en A1 y por Marta en A2, escrito íntegramente con el acumulado. Es un texto conectado de 120-180 palabras — que es exactamente el descriptor de lectura A1 que ningún ítem del corpus sirve hoy, porque la mediana de enunciado es de dos palabras.
- **«Ao balcão» (~150 palabras).** Una escena corta de mostrador **sin trama**: otro cliente, la misma transacción, las mismas fórmulas, otro producto y otro precio. Es donde se paga la regla de tres puertas: `talão`, `contribuinte`, `galão`, `bica`, `Mais alguma coisa?`, `São X e Y` vuelven a sonar sin que nadie tenga que inventarles una escena. Y es material perfecto para FSRS porque **es autónomo**: no exige recordar la trama.

Con las tres, los ocho episodios pasan de 966 tokens a ~3.500, el acumulado léxico no se mueve, y los eps. 6 y 7 —los densos— bajan del 34-35 % de tokens nuevos a menos del 25 %.

## 4.4 · Qué ejercicios salen solos del episodio y cuáles hay que escribir a mano

**Automáticos** (el guion es la fuente; el generador no inventa nada):

| Tipo | De dónde sale | Ejemplo del ep. 6 |
|---|---|---|
| Extracción de dato | cualquier línea con número, hora, letra o día | «Senha B dezassete. Balcão três» → letra / número / balcão |
| Dictado | recombinación de réplicas de 6-10 palabras | «Sem o papel não há registo» |
| Discriminación A/B | los pares mínimos que la escena cruzó | dezasseis / dezassete |
| Shadowing | cualquier línea que tenga versión lenta | la réplica larga de Marta |
| Ordenar la réplica | cualquier línea de ≥5 palabras | «Um papel com a assinatura do senhorio» |
| ¿Quién lo dijo bien? | las emisiones de `obrigado`/`obrigada` y de tratamiento | Migue vs. Kilu vs. Fátima (ep. 1) |
| Elegir el tratamiento | cualquier escena con dos interlocutores de distinto estatus | tú a Marta / 3.ª persona a Almeida |
| Cloze sobre el recap | «O que aconteceu», con los huecos en el léxico de la semana | — |
| Mediación semilla | cualquier línea con 3+ datos | la llamada de teléfono del ep. 8 |

**A mano** (y no hay atajo):

1. **Los `error_correction`.** Son la mejor capa del corpus actual y la única que ataca la interlengua real del hispanohablante; no se generan desde el guion porque el guion no contiene el error. Hay que escribirlos contra la taxonomía de 12 tipos, y hay que multiplicar por veinte los 17 buenos que ya existen.
2. **Las tareas de producción.** Escribir 60-80 palabras presentándose; hablar 60 segundos sin leer; rellenar el formulário. Necesitan rúbrica, no clave.
3. **Los artefactos escritos.** La ementa, el cartaz, el horário, el recibo. Son objetos del mundo, se escriben con el léxico acumulado, y **cada uno siembra ≥3 pares de correspondencia ES→PT** (`identificação`, `documentação`, `cidade`, `qualidade`, `novidade`) — que es la única forma de cerrar el descriptor de generación léxica, hoy sin apoyo (`-dade`: 0 tipos en los ocho guiones; `-ção`: 1).
4. **Los pares mínimos que la trama no cruza.** El descriptor pide 18 de 20 y la serie entrega cuatro. Los otros dieciséis se graban aparte, con las voces del reparto, y se cuelgan de la escena más cercana.
5. **La cola de desfosilización.** Los tres errores capitales (`você` a un desconocido, gerundio por `estar a + infinitivo`, `obrigado` dicho por una mujer) necesitan ítems de producción forzada, no de reconocimiento.

## 4.5 · Y lo que la serie **no** cubre, dicho en voz alta

Doce episodios de A1 a este molde son **~51 minutos de pista** y ~4.500 palabras de portugués. El currículo A1 pide **180 minutos de audio y 12.000 palabras de input**. La serie es, por tanto, **el 28 % del audio y el 37 % del input** del nivel, no su totalidad. El resto son los artefactos leídos, el banco de dictado, los 120 pares mínimos A/B, las capas de reprise aisladas y los textos funcionales portugueses reales que la Ola 7 ya presupuesta. Venderla como la columna vertebral entera sería el mismo error de contabilidad que este documento le reprocha al corpus.

---

# 5. Qué falta para doblarlo

## 5.0 · Decidido tras escuchar el episodio 1 doblado (2026-07-28, tarde)

El episodio 1 se dobló entero con ElevenLabs (29 réplicas, 991 caracteres) y Edu lo escuchó. Tres decisiones que dejan de ser propuesta:

**La voz del alumno se hace con una voz MEXICANA leyendo el idioma meta.** No es una voz portuguesa fingiendo acento: es una voz `es-MX` leyendo texto portugués, y produce el acento sin actuarlo. Veredicto de Edu: *«es como se escucha un mexicano hablando portugués, me gusta»*. Es la única voz del reparto que no debe sonar nativa, y su acento es el temario.

**El truco se extiende a los otros tres idiomas.** Se probó la misma voz `es-MX` leyendo rumano, checo y ruso —incluido cirílico, que funciona— contra una voz nativa de cada uno, y Edu lo dio por bueno. Consecuencia: **es el mismo personaje y la misma voz en las cuatro series.** Un solo aprendiz mexicano, cuatro idiomas, continuidad gratis entre cursos.

> El criterio con el que se juzga esta voz no es «¿suena bien?» sino **«¿suena a un error que cometería una persona?»**. Si el acento del alumno no se parece a ningún hispanohablante real, deja de enseñar y sólo estorba.

**Kilu se dobla con una voz angoleña real** (`Tchize`, en el catálogo bajo `pt-BR` pero angoleña). No es una elección estética: la función pedagógica del personaje es tener las vocales átonas plenas, que es lo que hace que un hispanohablante lo entienda mucho mejor que a un lisboeta. Eso no se actúa.

**Pendiente que sigue abierto:** la batería de aceptación fonética (`cedo : medo`, `avó : avô`, reducción átona, `-s` final) está generada y a la espera de un oído nativo. Y falta el foley y la Capa 0 en español: lo doblado es sólo el núcleo dramático.

---

## 5.1 · El lote de voces

**Seis configuraciones para A1-A2, y sólo cinco personas.**

| # | Voz | Sexo · edad · origen | Características que el proveedor tiene que sostener | Configuraciones |
|---|---|---|---|---|
| 1 | **Migue** | m · 36 · Guadalajara | barítono cálido, 105-125 ppm, **acento español audible**, vocales plenas, sonrisa | **2 en PT** (marcado / residual desde el ep. 25) **+ 1 en español** para la Capa 0 |
| 2 | **Dona Fátima** | f · 68 · Lisboa | contralto grave **con grano y aire**, 140-175 ppm, redução máxima, ráfagas sin respiración, silencios secos | 1 |
| 3 | **Kilu** | m · 33 · Luanda | tenor medio, **vocales átonas plenas**, ritmo silábico, 125-145 ppm, la más inteligible del reparto | 1 |
| 4 | **Marta** | f · 24 · Matosinhos | mezzo brillante, **melodía nortenha**, 150-165 ppm, **y la misma voz a 95-105 ppm sin cambiar de timbre** | 1 voz, 2 velocidades |
| 5 | **Sr. Almeida** | m · 54 · Almada | barítono seco, 112 ppm plano y nominal en ventanilla, 150 ppm coloquial en el café (T2) | **2** («balcão» / «café») |
| — | *Megafonía* | — | **no es una voz**: «Almeida balcão» con pasa-banda 300-3400 Hz, compresión dura y reverb de sala | coste marginal 0 |
| 6 | **Nuno** *(entra en B1)* | m · 28 · Marvila | 180-190 ppm, reducción al máximo, solapamiento, frases abandonadas. **Prohibido limpiarlo.** | 1 |
| — | *Invitados* | — | peixeira · **Wesley** (brasileño: el único `você` y el único gerundio de la serie) · una açoriana · un abogado mexicano | máx. **4**, sólo B1-C1 |

Coincide con el plan: Ola 7 pide **≥4 voces (2f/2m) verificadas** y Ola 10 **≥6**. Aquí son 5 en A1-A2 (3m/2f) y 6 en B1.

## 5.2 · Segundos y caracteres

**Los ocho primeros episodios, medidos:**

| | Valor |
|---|---|
| Núcleo dramático (portugués, síntesis nueva) | **6.294 caracteres** · 966 tokens · ~11:30 de habla |
| Menos la ráfaga reutilizada 2 veces en el ep. 4 | −150 car (**el mismo fichero, no se vuelve a sintetizar**) |
| Capa 0 en español (90 s → 45 s) | ~5.600 caracteres ES · ~7 min |
| «Outra vez» (reprise, 6-8 líneas/ep) | ~2.600 caracteres PT · ~4 min |
| Coda de reciclaje («O que aconteceu» + «Ao balcão») | ~6.400 caracteres PT · ~9 min |
| **Total a sintetizar, 8 episodios** | **~20.700 caracteres** (≈15.100 PT + 5.600 ES) |
| **Duración de pista, 8 episodios** | **~34 minutos** · media 4:15 por episodio (rango 4:00-4:45) |
| Foley y silencio (no se sintetiza) | ~7 min · **presupuesto aparte** |

**Extrapolación a los 44 episodios:**

| Temporada | Eps. | Caracteres | Minutos de pista |
|---|---:|---:|---:|
| T1 · A1 | 12 | ~40.000 | ~51 |
| T2 · A2 | 12 | ~70.000 | ~54 |
| T3 · B1 | 20 | ~150.000 | ~150 |
| Artefactos escritos leídos (44 × ~400 car) | — | ~17.600 | ~15 |
| Banco de dictado + 120 pares mínimos A/B | — | ~30.000 | ~25 |
| **Total** | **44** | **~308.000 caracteres** | **~295 min** |

B2, C1 y C2 **no suman caracteres**: son procesado (episodios degradados, tomas gemelas, filtros) sobre material ya doblado, más lectura de dominio público. Es el ahorro estructural de esta dirección.

## 5.3 · Lo que hay que decidir **antes** de gastar

**1 · ¿Se reciclan las voces de MiniMax o se tiran?** Hay que separar dos preguntas que hoy están mezcladas.
- **Los 5.451 MP3 actuales se tiran.** No es discutible: la auditoría midió que el **92,1 % de los clips etiquetados PT-PT sintetizan texto brasileño**, y el problema no es la voz, es la cadena de caracteres. Ninguno se reutiliza.
- **Las cuatro voces del `manifest.json` —`Portuguese_Wiselady`, `Portuguese_Narrator`, `Portuguese_SentimentalLady`, `Portuguese_JovialMan`— van a una prueba ciega de 30 minutos**: cada una sintetiza 30 segundos de la variante `pt` de `stories/b6-s2` y `stories/b8-s1` (que es portugués europeo genuino y ya está escrito), y **un nativo portugués juzga sin saber la etiqueta**. Un proveedor que etiqueta como `pt-PT` una voz brasileña arruina la serie entera **y el error no se detecta leyendo el texto**.
- **Aunque pasen, no bastan.** Este reparto necesita cinco timbres distintos, uno angoleño, uno del norte y uno mexicano hablando español y portugués. La pregunta real que hay que responder antes de comprar no es «¿sirve Wiselady?» sino **«¿tiene este proveedor un catálogo PT-PT con esa variedad, o hay que cambiar de proveedor?»**.

**2 · ¿Sostiene el proveedor solapamiento y disfluencia?** Si no, la Capa 1 se recorta a 45 s por episodio y se compensa con **ambiente real grabado mezclado por debajo** — que es barato y compra el 70 % del efecto. Esto se decide **antes de escribir**, no después de sesenta guiones.

**3 · Las dos configuraciones de Migue y las dos de Almeida.** Si no se planifican ahora, la lección de registro de C1 se pierde y no se recupera sin volver a doblar. Y si Almeida-balcão y Almeida-café salen como dos personas distintas, la lección desaparece entera.

**4 · El timbre de Marta a 95 ppm.** Es el mecanismo central de la serie. **Requisito contractual: la misma voz, más lenta, no una locución de dictado.** Si el proveedor no puede variar la velocidad sin cambiar el color, hay que saberlo antes del episodio 1, porque afecta a los 44.

**5 · La premisa jurídica del NIF.** «Sem o papel não há registo» sostiene doce episodios. Hay que **verificarlo con alguien que haya hecho la cola** (la AT admite morada estrangeira y un no comunitario necesita representante fiscal; lo que de verdad no se consigue sin papel firmado es el comprovativo de morada o el atestado da Junta de Freguesia). Corregirlo hoy cuesta **una réplica**; corregirlo después del doblaje cuesta doce episodios.

**6 · El nombre del protagonista es una variable en los guiones**, no una cadena escrita a mano, y se elige de dos sílabas con la misma prosodia por si hay que cambiarlo.

**7 · El presupuesto de foley.** El ep. 3 tiene un antagonista que es un ruido metálico, el ep. 2 tiene un bolígrafo que escribe debajo de una frase y el ep. 8 tiene un teléfono de pared. **El foley no es decoración: es contenido, y no está en el presupuesto de TTS.** Hay que decidir si se compra biblioteca o se graba.

**8 · Las reglas de glosado, en el pipeline y no en la cabeza del guionista.** Glosa siempre íntegra en español; diccionario emergente **bloqueado** en las líneas marcadas (falsos amigos y remates) hasta cerrar las tareas; y la Capa 1 sin glosa cuando la nota lo diga.

**9 · El cableado, desde el día 1.** Episodio → lección → conceptos → ítems. **Las 20 historias actuales nacieron huérfanas y siguen huérfanas: `lessonIds: []` en las 20, con 4.068 palabras de portugués europeo excelente que nadie oye.** Si los 44 episodios nacen igual, en seis meses habrá 33.000 palabras excelentes que nadie oye.

**10 · El orden de producción.** Escribir a mano los eps. **1, 5 y 9** —uno de cada registro— como biblia de estilo, hacerlos revisar por un nativo portugués y **probarlos en frío con tres aprendices reales** antes de generar el cuarto. Y **cerrar y doblar la Temporada 1 completa antes de escribir el episodio 13**. Si el episodio 1 no funciona con alguien que no sabe nada de portugués, esta dirección no se salva escribiendo más episodios.

## 5.4 · Y antes de todo lo anterior: los gates

1. **Presupuesto léxico, medido y falsable.** ≤20 % de tokens fuera del acumulado **y** ≤45 tipos nuevos por episodio en A1 (media de banda ≤32). **La lista de cognados transparentes ES-PT se publica en el repo**: mientras no exista, el gate no es falsable, que es exactamente lo que pasaba con la primera tanda. Y el acumulado se mide contra un `vocab-catalog.json` **de 700 lemas sembrados contra *Português Fundamental***, no contra las 141 entradas actuales, que traen `acarajé` y `caldo de cana` y ni un número, ni un día de la semana, ni un saludo.
2. **Regla de reaparición** (§2): tres puertas, dos pasos, exenciones declaradas.
3. **Ficha lingüística por episodio, decidida antes de escribir la escena:** ≥4 pares ênclise/próclise **con clítico de verdad**, ≥6 `estar a + infinitivo`, 0 gerundios en boca portuguesa, 0 `você` en boca portuguesa, `obrigado`/`obrigada` concordando, ≥1 par mínimo dentro del chiste. **El episodio que no cumple su ficha se reescribe, aunque sea la mejor escena de la serie.**
4. **La Capa 0 no contiene datos evaluables** y **ninguna tarea se responde con la Capa 1.**
5. **Auditoría de voz ciega antes de comprar el lote** (§5.3, punto 1).
6. **Nivel de audio:** ningún evento narrativo por debajo de −18 LUFS relativo al diálogo; ningún silencio dramático de más de 3 s; ningún silencio sin ambiente audible debajo. **Se verifica en auriculares de 200 pesos, en movimiento, no en la sala de edición.**
7. **Autonomía de escena:** cada escena se entiende sola. FSRS va a devolver material del ep. 31 tres meses después; si para entenderlo hace falta recordar la trama, el repaso se vuelve castigo.

---

# 6. Lo que el panel dijo y qué cambió

Tres lectores: un nativo de Lisboa, un especialista en adquisición y el propio alumno. **De 34 objeciones, 30 se aceptaron y 4 se rechazaron.** Las cuatro rechazadas se explican abajo con su razón.

## 6.1 · El nativo de Lisboa

### Graves — las ocho, aceptadas

| # | Objeción | Qué cambió |
|---|---|---|
| 1 | **«Aqui é um»** sobre los dos apellidos es **falso**: los portugueses llevan dos, tres o cuatro. Y el chiste se apoyaba en ello. | **Aceptada.** Ep. 2 → `Dois? Eu tenho quatro. Isso não me cabe aqui.` Conserva la queja logística, el chiste y el presupuesto, y es verdad. |
| 2 | **`Quem mora no terceiro?`** — está preguntando por su propio piso; la puerta de la cinta métrica es el segundo. | **Aceptada.** Ep. 3 → `Quem mora no segundo?`, y el eco del ep. 4 corregido en cadena. |
| 3 | **El par ênclise/próclise anunciado no existe:** en «Não digas nada» no hay clítico. Y en ocho episodios no había **ni una próclise**. | **Aceptada, y es la corrección más importante del panel.** Ep. 7 → `Não te metas nisso` y `Não me chateies`, contra `Senta-te`. Era el mismo error metalingüístico de los 57 ítems de `b8-l3`, cometido en la biblia que iba a corregirlos. |
| 4 | **`Faz favor!` con cuatro funciones, dos inventadas:** no es llamada de turno ni se dice en una puerta. | **Aceptada.** `O seguinte, faz favor!` para el turno (eps. 1, 2, 5, 6, 7, 8) y `Dá licença?` en la puerta (ep. 3). Quedan **dos funciones auténticas** bien contrastadas: ofrecimiento ascendente y cierre de conversación. |
| 5 | **`Ó?` interrogativo no es portugués**: `ó` es sólo vocativo. | **Aceptada.** → `Hã?` en los eps. 1 y 2. El uso del ep. 4 (Marta partiendo el vocativo) se conserva porque ahí sí es correcto. |
| 6 | **`Está aqui` como «aquí tiene» es calco**, repetido cinco veces como fórmula fija. | **Aceptada.** `Aqui está` al servir (eps. 5, 7) y `Aqui tem` al entregar o pagar (eps. 5, 6, 8). El par es además un ítem A1 precioso. |
| 7 | **`Não come mais`** no es imperativo negativo válido; exige conjuntivo. | **Aceptada.** → `Não coma mais`, y de regalo el contraste con `Coma` tres minutos después, en la misma boca. |
| 8 | **El progresivo con valor de futuro es inglés/español, no portugués europeo** — y la nota lo canonizaba. | **Aceptada.** Ep. 8 → `O que é que ela vai fazer na sexta?`. Era la única de las diez ocurrencias de `estar a + infinitivo` que estaba mal. |

### Medias — nueve aceptadas, dos matizadas

**Aceptadas y aplicadas:** `Lá em casa` → `Lá em Luanda` (ep. 7) · `trabalhar de noite` → `fazer noites` **con la escena reencuadrada como salida de turno** (ep. 7) · `Terceiro andar! À esquerda!` → `Terceiro esquerdo!` (ep. 3) · **continuidad de Fátima** arreglada: ya está arriba desde la primera línea (ep. 3) · **`chamo-me`** añadido en los eps. 2 y 6, que tenía 0 ocurrencias en los 2.037 ítems y es el primer enclítico declarativo que aprende cualquiera · `Estou aqui` → `Cheguei` (ep. 3) · **`Quer com contribuinte?`** añadido — y no en el ep. 8 como sugería, sino **en el 5**, donde sustituye a `propina` y se vuelve trama · **geografía y precios**: `Rua de Arroios, 21, terceiro esquerdo`, y 2,70 € / 2,20 € / 0,90 € en vez de 2,30 y 0,70 · **pronombres sujeto podados** en Fátima y en Kilu (`Sei bem onde ele mora`, `Tenho de ir`), conservados en Migue porque son su interferencia y son el temario.

**Matizada — Marta es del Porto sólo en las acotaciones.** Aceptada la premisa: con doblaje TTS en lote, una melodía nortenha que no está escrita no va a existir. Aplicado el remedio barato (`Ouve lá`, `Anda lá`, `Vá lá`, `Olha lá`, `ó pá` son suyas y de nadie más). **No se retira la afirmación del reparto**: si la prueba ciega de voz de §5.3 demuestra que el proveedor no tiene un timbre del norte, se retira entonces y con datos.

**Matizada — la premisa jurídica del NIF.** Aceptada la duda, no la reescritura completa: la réplica pasa a `Sem o papel não há registo. E sem registo não há NIF.`, que es procedimiento de ventanilla y no afirmación legal, **y la verificación entra en la lista de decisiones de §5.3 como punto 5**. Es lo único del documento que puede tumbar doce episodios si está mal.

### Menores — aceptadas todas menos una

Aplicadas: `Mais alguma coisa?` · `Depois, cá, é de autocarro` · `Diz antes` · `Anda aí um senhor` · `Pois, pois` · `O seguinte, faz favor` · `Escreva aqui a morada` · `Ela não quer escrever` · Almeida saluda (`Bom dia. Faz favor.`) · `E um pastel de nata?` · `pá` eliminado de la boca de Fátima · `pequeno-almoço` añadido al episodio del desayuno · `Estamos juntos` como despedida de Kilu.

**Rechazada (1/4): la sanción del `você` está sobreactuada.** El nativo señala que muchas patronas «ni pestañean, sólo te clasifican». Es verdad como sociología y es malo como pedagogía: si Fátima no reacciona, **el alumno no recibe ninguna señal** y el error capital nº 1 del criterio de salida A1 se queda sin instalar. Se conserva el silencio de tres segundos, pero se acepta su versión de la forma —**`«Você»?`**, la cita plana y lenta, en vez de `Eu?`— y se añade la reparación de Kilu, que es lo que faltaba de verdad.

## 6.2 · El pedagogo

| # | Objeción | Resolución |
|---|---|---|
| 1 | **La serie entregada es un tercio de la que ganó y le faltan dos capas.** La Capa 2 sólo existía en 2 de 8 episodios, y la línea más difícil del ep. 1 (`É para aqui ou para levar?`) no tenía reemisión ninguna: se violaba el gate 3. | **Aceptada.** Se añade la Capa 2 dentro de la escena (`Aqui? Ou levar?`, ep. 1), se define la reprise **«Outra vez»** como pieza obligatoria de todos los episodios (§4.1), y se publica la **coda de reciclaje** (§4.3) que lleva el episodio de ~100 a ~450 palabras **sin léxico nuevo**. Los episodios pasan de 62-88 s a 4:00-4:45 de pista. |
| 2 | **La repetición no está distribuida:** 44 % del vocabulario aparece una vez, y son las palabras-bandera. | **Aceptada, y es la mejor objeción del panel.** Se crea la **regla de tres puertas** (§2) y se aplica: `talão`, `contribuinte`, `giro`, `epá`, `autocarro`, `balcão`, `esquisito`, `mau`, `rés-do-chão`, `dezassete`, `percebi`, `chave` pasan de 1 a ≥2 episodios; `fixe`, `desculpe`, `bica`, `obrigada` a 3; `pois` y `morada` a 4. El *hapax* de la tanda baja de 59,8 % a **52,5 %**, y la coda de §4.3 lo sigue bajando. Las que quedan en 1 están **exentas por clase declarada**, no por olvido. |
| 3 | **La trama se sigue sin portugués** y el documento lo celebraba: el ep. 3 pagaba la recompensa narrativa por reconocer un ruido metálico. | **Aceptada.** Ep. 3 → `Está lá alguém.` / `Ninguém.` **La contradicción pasa a ser entre dos líneas de portugués** que un A1 con 101 palabras puede decodificar, y el foley queda como refuerzo. Se añade la regla 10 de la biblia. |
| 4 | **`balcão` es falso amigo sin marcar, es el título y es la diana de la única tarea de extracción.** No está en `glossary.json` ni en `vocab-catalog.json`. | **Aceptada.** El alumno lo oye con su sentido real en el ep. 1 (`Aqui, ao balcão`) y ve a Migue confundirlo en el ep. 6, con desambiguación de tres segundos. Y entra en el glosario. |
| 5 | **El par mínimo `mau/mal` tenía un solo miembro.** | **Aceptada.** Ep. 5 → `Esquisito é mau. Tu falaste mal.` Y se añade `caro/carro` en el ep. 3, que el corpus no tiene en ninguna forma. Los otros dieciséis pares del descriptor se declaran material aparte (§4.4). |
| 6 | **El presupuesto léxico de los eps. 5-8 subestimaba la novedad entre 2× y 4×, y el gate no era falsable** (de tokens, con una lista de cognados nunca publicada). | **Aceptada sin reservas. Los recuentos de §3 están medidos con tokenizador, no estimados**, y se publican en tipos **y** en tokens. El gate pasa a ser doble (tokens **y** tipos) y **obliga a publicar la lista de cognados en el repo**. El ep. 8, que declaraba 4 formas nuevas y tenía 17, ahora declara 19 y tiene 19. |
| 7 | **La lección de `obrigada` pedía al input evidencia negativa**, con el dato decisivo fuera de plano y doce episodios sin reparación. | **Aceptada.** La tercera emisión pasa a **primer plano** (ep. 1) y la reparación llega en el **ep. 4**, no en el 12, en cuatro palabras y desde el oído (`Obrigado. Tu dizes obrigado.`). La regla 3 de la biblia se modifica en consecuencia. |
| 8 | **`você` se sancionaba pero nunca se reparaba:** la alternativa no se decía en toda la tanda. | **Aceptada.** Kilu dice **la misma proposición con la forma correcta** tres segundos después: `Dona Fátima, o rapaz precisa da morada.` Un castigo sin modelo no es una lección. |
| 9 | **El paradigma de `tu` llegaba en el ep. 4 y era de cuatro verbos.** | **Aceptada parcialmente.** Se adelanta a los eps. 3 (`Tens a chave?`) y se amplía: `ouviste`, `põe`, `dizes`, `estás`, `sabes`, `ouve`, `pagas`, `falaste`, `comeste`, `dormiste`, `queres`, `senta-te`, `come`, `vai`, `diz`, `és`, `não te metas`, `não me chateies`. **No se completa el paradigma en A1 y es deliberado**: el perfeito de `tu` entra aquí como siembra receptiva y se cosecha en la T2, donde es el contenido central. |
| 10 | **Seis de trece descriptores A1 sin nada, y dos imposibles en audio** (ementa/cartaz/horário; texto de 120-180 palabras). | **Aceptada.** Se crea el **artefacto escrito por episodio** (§4.1) y el recap **«O que aconteceu»** de 120-180 palabras en portugués (§4.3), que cierran los dos imposibles. `chamo-me` entra en los eps. 2 y 6 y la presentación completa se sitúa en el ep. 9. Las correspondencias `-ção`/`-dade` se siembran en los artefactos, con cuota de 3 pares por artefacto. |
| 11 | **Volumen: 16 minutos frente a 180. Como espina dorsal no llega, por un factor de diez.** | **Aceptada, y publicada como aritmética en §4.5:** la serie es el **28 % del audio y el 37 % del input** de A1. Venderla como la columna entera sería el mismo error de contabilidad que este documento le reprocha al corpus. |

**Rechazada (2/4): «la mediana de enunciado es de 2 palabras, no hay material de dictado».** Es cierto sobre el guion crudo y deja de serlo con el molde: el banco de dictado no son las réplicas tal cual, sino **recombinaciones de 6-10 palabras** construidas desde el léxico del episodio (§4.4), más el recap de 120-180 palabras. No se alargan las réplicas para servir al dictado — alargarlas rompería la verosimilitud del mostrador, que es lo único que hace que la serie no suene a manual.

## 6.3 · El alumno

| # | Objeción | Resolución |
|---|---|---|
| 1 | **«Me humillan ocho veces seguidas y no gano ni una. Ahí es donde dejé Duolingo.»** | **Aceptada, y es la objeción que más cambia la serie.** Ep. 1 → `Isso.` (dos sílabas de la persona más dura, y es aprobación). Ep. 3 → `Boa.` de Kilu. Ep. 5 → `Coma.`, la primera grieta de Fátima. Ep. 6 → Migue usa `esquisito` **bien**. Y el placer estructural —el alumno por delante del protagonista— se adelanta del ep. 8 al **ep. 3**. |
| 2 | **«La trama vive en cosas que en el metro no existen»**: un ruido al borde de oírse y silencios de tres segundos. | **Aceptada.** Regla 10 de la biblia + gate 6 de §5.4: nada narrativo por debajo de −18 LUFS, silencios ≤3 s y siempre con ambiente debajo, y **la verificación se hace en auriculares malos y en movimiento**. Más el refuerzo lingüístico del ep. 3. |
| 3 | **«Ponen un reloj en el ep. 4 y lo tiran a la basura.»** | **Aceptada.** El reloj corre en el ep. 5 (`E o trabalho?` / `É hoje.`), **cobra en el ep. 6** (`Já não há.`) y se dice a la cara en el ep. 8 (`perdi o trabalho`). |
| 4 | **«El ep. 2 sabe algo que sólo me van a decir en el ep. 6.»** | **Aceptada.** `Mas eu preciso do papel. Com a morada.` → `Preciso da morada. Para o trabalho.` La motivación es autoevidente y de paso planta el reloj. |
| 5 | **«Es la misma broma cuatro veces y para la tercera ya la vi venir.»** | **Aceptada.** Cuatro mecanismos distintos de sanción: cita (ep. 2), eco plano (ep. 5, `esquisito`), silencio + tecla de caja + risa (ep. 5, contribuinte), no-reacción burocrática (ep. 6). |
| 6 | **«El ep. 5 es, con esas palabras, de curso de idiomas»**: `esquisito` + `propina` es la anécdota de fiesta. | **Aceptada.** `propina` sale de la banda y se reubica en una escena universitaria de B1. Entra `Quer com contribuinte?`, que nadie cuenta en las fiestas, que se oye todos los días, y que **es la trama**. |
| 7 | **«Donde me aburro es el ep. 6, en la tercera megafonía.»** | **Aceptada.** Cinco emisiones → cuatro, y se elimina «O sistema está a carregar». Se añade el gag de `balcão`, que además cierra la objeción 4 del pedagogo. |
| 8 | **«Marta aparece de noche en mi cuarto y nadie me dice quién es.»** | **Aceptada.** `Marta. São onze e meia.` + `Nós trabalhamos amanhã` dan nombre, hora y relación en dos líneas — y la hora es descriptor. |
| 9 | **«Fátima no me da nada en ocho episodios, ni mi nombre.»** | **Aceptada.** `Isso.` (ep. 1) y `Coma.` (ep. 5). **No se le da el nombre**: sigue siendo `ó rapaz` toda la Temporada 1, y el día que le llame Miguel será un acontecimiento. |
| 10 | **«El primer minuto puede leerse como que la app está rota.»** | **Aceptada.** La Capa 0 en español abre el episodio (90 s), como el chasis mandaba y el guion entregado había omitido; y **la puerta de vidrio corta la ráfaga**, que es la señal diegética de que eso no era para él. |
| 11 | **«La glosa del ep. 8 deja `sexta-feira` en portugués.»** | **Aceptada.** Reglas de glosado publicadas en §5.3, punto 8: glosa íntegra en español y diccionario emergente bloqueado en las líneas marcadas hasta cerrar las tareas. |
| 12 | **«Me como la temporada entera en un viaje.»** | **Aceptada en parte.** Los episodios pasan de ~1:20 a ~4:15 y la temporada de 10:36 a **~51 minutos**; y la app **libera un episodio por sesión cerrada, no por día**, así que hacer maratón exige hacer el trabajo. |

**Rechazadas (3 y 4 de 4):**

- **«Adelanten el ep. 8 al 3.»** No se mueve el episodio. Lo que se adelanta es **el mecanismo**: la sensación de ir por delante del protagonista se instala en el ep. 3 (el alumno sabe que Fátima miente y Migue no). El ep. 8 necesita ocho episodios de acumulación para que `O que é sexta-feira?` funcione — moverlo al 3 lo convertiría en una pregunta de vocabulario sin coste.
- **«Fátima debería llamarme por mi nombre antes del 8.»** Rechazada, y a propósito: **el vacío de tratamiento es contenido**. Fátima no le dice `tu`, no le dice `você` y no le dice su nombre; lo despacha sin pronombre, que es una de las cosas más difíciles de percibir del portugués europeo y no tiene equivalente en español. Se compensa con las dos grietas (`Isso.`, `Coma.`), que dan calor sin resolver el tratamiento.

---

## Archivos citados

`lib/data/languages/pt/blocks/b1.json` · `b2.json` · `b3.json` · `b4.json` · `b5.json` · `b6.json` · `b7.json` · `b8.json` · `b10.json` · `lib/data/languages/pt/stories/b6-s2-esperanca-e-duvida-na-vida-de-.json` · `stories/b8-s1-o-debate-entre-amigos-no-cafe.json` · `stories/b3-s2-pedro-vai-ao-restaurante.json` · `stories/b2-s2-a-familia-de-maria-em-lisboa.json` · `lib/data/languages/pt/glossary.json` · `vocab-catalog.json` · `concepts.json` · `manifest.json` · `curriculum.ts` · `lib/data/languages/pt/mdx/b7/l2-gerundio.mdx` · `mdx/b8/l3-*.mdx` · `mdx/b10/l1-registro-formal-informal.mdx` · `mdx/b3/l3-*.mdx` · `components/cards/FillBlankCard.tsx:20` · `docs/plans/2026-07-28-plan-0-a-c2.md` (§1.3.d, §2.1, §3.1, §6 Olas 7 y 10) · `docs/plans/2026-07-28-curriculos-completos.md:75-160` · `docs/auditoria/2026-07-28-auditoria-multiagente.md`
