# Cola 6 — dictamen ítem a ítem (b5 futuros/condicional + b6 conjuntivo)

**Revisor:** lingüista adversarial pt-PT · **Fecha:** 2026-08-30 · **Ítems:** 100 (46 de `b5.json`, 54 de `b6.json`)

**Método.** Para cada ítem se reconstruyó lo que el alumno VE — frase ensamblada con la `answer` y con CADA `alternative`, con los `variantOverrides` aplicados —, se verificó cada afirmación de la glosa en las dos lenguas, las conjugaciones contra Priberam (`dicionario.priberam.org/Conjugar/…`) y los usos contra el corpus de lecturas del propio proyecto (`lib/data/languages/pt/lecturas/*.json`, 224 ficheros, grafía decimonónica incluida). Se leyó también el runner: `FillBlankCard` y `TranslationCard` aceptan las `alternatives` / `acceptedAlternatives` COMO CORRECTAS, `ListeningCard` y `VerbPrepositionCard` comparan `opt === data.answer` (una answer que no figure entre las options hace el ítem imposible), `esContrast` sólo se muestra TRAS revelar (por eso una glosa que contenga la respuesta no la destripa; una pista dentro de `data.front`, sí) y `audio-collector` locuta `data.back` en los flashcards, `data.audioText` en los listening y `target`/`source` en las traducciones según la dirección — de ahí los `rehacer`.

---

## Recuento

| | ERROR | DUDA | OK | Total | Tasa de error |
|---|---:|---:|---:|---:|---:|
| **b5** (futuros y condicional) | 15 | 11 | 20 | 46 | **33 %** |
| **b6** (conjuntivo) | 38 | 2 | 14 | 54 | **70 %** |
| **Total** | **53** | **13** | **34** | **100** | **53 %** |

Ítems con `rehacer: true` (el texto corregido es el que se locutó): **9** — #3, #49, #53, #63, #65, #66, #71, #78, #89.

Precedentes: colas 1-5 dieron 46 / 45 / 50 / 49 / 40 % de error. Esta cola sube a 53 % por el bloque 6: el conjuntivo concentra el 72 % de los errores de toda la cola.

---

## Las clases dominantes

### 1. Glosas `esContrast` falsas, vacías o en la lengua equivocada — 31 ítems (19 de ellos, sólo por la glosa)

Es la clase más numerosa y la más dañina, porque `esContrast` es lo único que el alumno lee DESPUÉS de fallar: es la explicación, y explica mal.

* **En portugués** (el campo es la pista *para hispanohablantes*): #20, #50, #64, #76, #82, #88, #94; y medio en portugués #9. Ejemplo (#50): «*Em português, 'tomar' café é mais natural que em espanhol*».
* **En inglés**: #83 — «*pero en español **we'd say** 'Es importante que'*».
* **Falsos amigos inventados**: #47 y #63 niegan que «lidar com» sea «lidiar con» cuando lo es exactamente — y el propio corpus lo demuestra: la fuente española de #63 dice «Dudo que él sepa **lidiar con** este problema». #69 afirma que «en español 'venir' no lleva prep» (existe «venía **de** la galería»). #62 se contradice en dos líneas: «'Confiança' = confianza … No confundas con 'confianza' del español».
* **Afirmaciones morfológicas falsas**: #6 declara irregular el condicional de «ver» (Priberam: verei/veria, formados sobre el infinitivo; los únicos irregulares del futuro y del condicional son *dizer, fazer, trazer*); #21 dice que «en portugués cambia la raíz: vir» cuando la que cambia es la española (venir → vendrá); #73 manda «fijarse en la 'j'» de «venha/venga», donde no hay ninguna «j»; #15 inventa el tiempo «condicional imperfecto» para «queria»; #13 inventa la palabra española «faría».
* **Glosa que contradice a su propio ítem**: #80 asegura que tras «espero» va indicativo… en una frase que dice «espero que **esteja**».

### 2. Ensamblados agramaticales: preposición duplicada, hueco sin verbo, ítem no ganable — 9 ítems

* **Preposición duplicada** (el nido «gostei DE DO filme»): #1 — la frase ya trae «de nossas conversas» y la `answer` es «lembrarei **de**» ⇒ «*eu sempre lembrarei de de nossas conversas*»; la única opción gramatical, «lembrarei», está marcada como falsa. #18 repite el patrón con «**de** … **de**ste curso».
* **Hueco donde debía ir el verbo**: #51 «*Quero que ela de mim*», #75 «*É possível que nós de ajuda*», #25 «*eu deveria mais atenção à minha saúde*» (aquí lo delata la propia alternativa, «teria que dar», que sí es gramatical: el runner acepta la alternativa y rechaza la respuesta).
* **La clave premia el error**: #2 — la frase ya contiene «sonhar com», así que la `answer` «com» produce «*sempre vou **com** sonhar com preços baixos*»; la única opción correcta es «∅» y se da por incorrecta.
* **NO GANABLE** (como en la cola 5): #53 — `answer` = «Expresión impersonal de **possibilidade**» y en las `options` figura «Expresión impersonal de **posibilidad**». No coinciden: ninguna elección puntúa. Y el `audioText` es un sinsentido («É possível que eles suspirem de tão grande que é a confiança»).
* **La pista regala la respuesta dentro del `front`** (visible ANTES de revelar): #48 «Traduce: 'conexión, **ligação**'» → back «ligação»; #97 «'Eu sei que ele ___ aqui.' **(está)**» → back «está».

### 3. Formas verbales inventadas (3) y tarjetas muertas (6)

* **Formas que no existen**, y que el runner da por buenas: «**Dúvido**» (#63, #71) — es «duvido», sin acento (Priberam: eu duvido); «**facças**» (#92) — es «faças». Las tres están en campos que el alumno debe *producir*, y dos de ellas además se locutan.
* **Tarjetas muertas** (front = back, portugués a los dos lados, sin traducción española: no hay nada que aprender): #67 «vaga»/«vaga», #72 «apertado»/«apertado», #84 «talvez»/«talvez», #95 «lidar com»/«lidar com», #98 «talvez»/«talvez», #99 «rumo»/«rumo». Y #84 y #98 son el MISMO ítem duplicado: comparten los dos hashes de audio (`e7a24ce4…` br, `7bcacf5a…` pt).

### 4. Reparto BR↔PT invertido o filtrado a la base europea — 6 ítems

La base `data` es, por contrato, la europea (`variantOverrides['pt-br']` guarda Brasil). Estos ítems meten brasileño en la base:

* **#31** es el caso de manual: la base trae la casilla brasileña «você / terá» y el override `pt-pt` cambia **sólo la answer** a «terás». Al alumno europeo se le muestra «ter · você» y se le exige «terás», que es agramatical. (El esquema de override admite `person`, así que el arreglo es limpio.)
* **#89** «**Tomara que** ela vivesse…» es brasileño; el europeo «Oxalá» está relegado a alternativa. El corpus de lecturas: **5** «Oxalá que», **0** «Tomara que» (los dos «tomara» del corpus son otra cosa — «Tomara-o uma timidez», «Tomara eu ter o talento», sin «que»).
* **#66** «Não tenho certeza de que» es brasileño; en Portugal lleva artículo. Corpus: **73** «a certeza», **0** «tenho certeza» — p. ej. *Amor de Perdição* c08: «não tenho **a** certeza de que houvessem estradas para o Japão».
* **#68** «liguem **para** mim» es el régimen brasileño; en Portugal, «liguem-me» / «telefonem-me» (ligar **a** alguém). **#1** «no exterior» por «no estrangeiro» (corpus: 18 «estrangeiro» frente a 1 «exterior», y ése físico). **#56** manda traducir «al PT-BR» dentro de la base europea.

### 5. Futuro do conjuntivo frente a presente do conjuntivo — el punto que pedías con lupa

**Ningún ítem de la cola confunde una forma por otra.** Los diez ítems que tocan el futuro do conjuntivo lo usan bien: #10 «Quando vierem, já terá terminado», #68 «Assim que vocês precisarem de ajuda», #65 «Assim que a ligação terminar», #78 «Quando eu conseguir a vaga», #90 «Assim que o verão aquecer», #1 «Quando estiver no…». Lo que falla alrededor es **la explicación, no la forma**: #65 y #78 definen el conector con un verbo español («*ocurrirá*», que además se locuta) y #78 lo hace con una tautología («ação futura que ocurrirá no futuro»); #90 dice «no confundir con 'calentar' español» cuando «aquecer» *es* calentar. Y hay un desajuste curricular de fondo: el futuro do conjuntivo aparece resuelto en b5 (#10, #1) **antes** de su lección, b6-l3, que sólo tiene 4 ítems en toda la cola.

El punto verdaderamente confundido de b6 es otro: **«talvez»**. #49 enseña que va «antes ou depois do verbo no subjuntivo» — falso: antepuesto exige conjuntivo, pospuesto lleva **indicativo** («Ele vem, talvez»), y los dos ejemplos que da lo llevan antepuesto. #84 remata con «se escribe igual» (el español lo escribe separado, «tal vez» — lo dice bien #86, que se contradice con #84) y «se usa con indicativo o conjuntivo según el contexto». La asimetría que el curso tenía que enseñar — español «Quizá **viene**» frente a portugués «Talvez ele **venha**», nunca «*Talvez ele vem*» — está negada explícitamente en #49 («En español también funciona igual»).

### 6. Una decisión sistémica para Edu: «futuro do presente»

Siete fichas (#17, #24, #26, #27, #28, #29, #30, #32, #44 y el `tense` de #31) etiquetan el tiempo como **«futuro do presente»**, que es el término escolar BRASILEÑO. En Portugal es «futuro do indicativo» (Dicionário Terminológico) o «futuro simples». El corpus usa términos europeos en todo lo demás — «condicional» (un brasileño diría «futuro do pretérito»), «presente do conjuntivo», «imperfeito do conjuntivo», «futuro do conjuntivo» (un brasileño diría «subjuntivo») —, así que estas fichas son las únicas disonantes: son **7 de los 7** «futuro do presente» de todo el corpus de bloques. Las he dictaminado DUDA, no ERROR: la conjugación es correcta en todas; lo que hay que decidir es la etiqueta. Si se adopta, es un `sed` de un campo.

---

## Qué está bien

No es un bloque perdido; hay material que se puede publicar tal cual y material que ya hace bien lo difícil.

* **La morfología verbal es sólida.** Las 13 fichas de conjugación son correctas una por una, verificadas: falarei, serei, farei, direi, trarão, irei, falaria, faria, diria, seriam, gostaria, veria, terás. Nadie ha inventado un paradigma. Y las irregularidades están bien repartidas: #38 conjuga «ver → veria» SIN marcarlo como irregular, que es justo lo que la glosa de #6 se equivoca en decir.
* **Los tres ítems de corrección de errores de b5 (#39, #40, #41) son de los mejores del corpus**: atacan calcos reales del hispanohablante — «falaré» por «falarei», «fazerei» por «farei» y, sobre todo, «vou **a** falar» por «vou falar», que es el error número uno de un español hablando portugués.
* **El imperfeito do conjuntivo de b6 está limpio**: #52 tivessem, #55 perdesse, #81 fosse, #85 fizessem, #88 fossem. Correlación temporal correcta en los cinco, con disparadores variados (esperava, duvidava, era impossível, era necessário, pediu).
* **Hay glosas que son exactamente lo que el campo tenía que ser**: #61 («início con acento agudo frente a inicio»), #86 («en español se escribe separado: tal vez»), #91 («los verbos -er pierden la vocal temática: comer → coma»), #17 («es 'saberá', no 'sabrá'»), #41 (el «a» del perifrástico), #4 (fazer/hacer comparten la irregularidad far-/har-). Media docena de contrastes verdaderos, útiles y bien redactados: el molde existe, sólo no se aplicó al resto.
* **El portugués europeo asoma donde importa**: «a minha mãe» y «o meu irmão» con artículo (#23, #19), «precisamos DE resultados» (#12), «Vou falar com…» sin «a», «gostar de», «precisar de» bien planteados en #68 y #87.
* **#10 es el mejor ítem de la cola**: «Quando vierem, já terá terminado» / «Cuando vengan, ya habrá terminado» junta futuro do conjuntivo y futuro perfeito en seis palabras y traduce exacto. Sólo le falta glosa — y es el ítem que más la merecía.
* **Ninguno de los 100 ítems trae un «-ámos» mal acentuado**, el nido que costó 7 ítems en la cola 5: ni b5 ni b6 tocan el pretérito perfeito de 1.ª plural. Y sólo hay una anomalía ortográfica del AO90 en toda la cola (#15, «indirecto» por «indireto»).

---

## Dictamen ítem a ítem

### 1. `844d0dc0` · b5.json · verb_preposition · b5-l1-futuro-presente — ❌ ERROR

Preposición duplicada por la answer: la frase ya trae «de nossas conversas», así que «lembrarei de» ensambla «eu sempre lembrarei DE DE nossas conversas». La única opción que produce una frase gramatical («lembrarei») está marcada como falsa: el ítem premia el error. Además «no exterior» es brasileño (PT-PT: «no estrangeiro») y «de nossas» va sin artículo (PT-PT: «das nossas»); en portugués europeo el verbo es pronominal: «lembrar-se de».

**Corrección:**

* `data.sentence`
  * de: `Quando estiver no exterior, eu sempre ___ de nossas conversas sobre o futuro.`
  * a:  `Quando estiver no estrangeiro, eu sempre me ___ ti e das nossas conversas sobre o futuro.`

### 2. `848f2e90` · b5.json · verb_preposition · b5-l2-futuro-composto — ❌ ERROR

Ensamblado agramatical por partida doble: la frase ya contiene «sonhar com», de modo que la answer «com» da «sempre vou COM sonhar com preços baixos». La única opción gramatical es «∅» («sempre vou sonhar com preços baixos») y la clave la da por incorrecta.

**Corrección:**

* `data.sentence`
  * de: `Sou sonhador, sempre vou ___ sonhar com preços baixos.`
  * a:  `Sou sonhador, sempre vou sonhar ___ preços baixos.`

### 3. `84e35879` · b5.json · translation · b5-l2-futuro-composto — ❌ ERROR

«acreditou em impossível» es agramatical: «acreditar em» exige artículo con el sustantivo abstracto — «acreditou NO impossível» (lo confirma la propia traducción: «creyó en LO imposible»). Y la glosa es falsa: «sonhador» y «soñador» son cognados exactos, no «≠»; la correspondencia es nh (PT) ↔ ñ (ES), no «la h por la ñ».

**Corrección:**

* `data.source`
  * de: `O meu avô era um sonhador, sempre acreditou em impossível.`
  * a:  `O meu avô era um sonhador, sempre acreditou no impossível.`
* `esContrast`
  * de: `sonhador ≠ soñador (cambia la 'h' por 'ñ')`
  * a:  `'Sonhador' es el cognado exacto de 'soñador': al grupo 'nh' portugués le corresponde la 'ñ' española.`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 4. `855588a1` · b5.json · translation · b5-l3-condicional — ✅ OK

Condicional en discurso relatado correcto; la glosa acierta al señalar que fazer/hacer conservan la irregularidad (far-/har-).

### 5. `874c054b` · b5.json · flashcard · b5-l4-se-futuro-condicional — ✅ OK

Tarjeta de vocabulario correcta («preços»/«precios», ejemplo con «imóveis», europeo). Nota curricular: está alojada en b5-l4 (se + futuro/condicional) sin relación con la lección.

### 6. `8be006d7` · b5.json · translation · b5-l3-condicional — ❌ ERROR

Glosa falsa y de doble filo: «ver» NO es irregular en el condicional. Priberam da verei/verás… y veria/verias…, formados sobre el infinitivo; los únicos irregulares del futuro y del condicional portugueses son dizer, fazer y trazer. El español «vería» tampoco es irregular. La frase, además, es semánticamente forzada (un testigo que «afirmó que vería»).

**Corrección:**

* `esContrast`
  * de: `'Veria' de 'ver' (irregular) equivale a 'vería' de 'ver' — ambos mantienen la irregularidad en condicional.`
  * a:  `'Veria' se forma sobre el infinitivo (ver + ia), como en español. En portugués sólo dizer, fazer y trazer son irregulares en futuro y condicional: diria, faria, traria.`

### 7. `8dc0261c` · b5.json · fill_blank · b5-l3-condicional — ✅ OK

«Ela disse que faria a viagem no mês que vem» + alternativa «realizaria»: correcto, y la glosa describe bien la conversión futuro→condicional.

### 8. `94eaa8bc` · b5.json · translation · b5-l2-futuro-composto — ❌ ERROR

La acceptedAlternatives es medio española: «para AHORRAR em preços de habitação» — «ahorrar» no existe en portugués, y el runner de traducción acepta las alternativas como respuesta correcta, así que valida un interlecto. La glosa además es falsa: «poupar» y «economizar» son sinónimos corrientes en portugués, no términos opuestos.

**Corrección:**

* `data.acceptedAlternatives[0]`
  * de: `Vamos apresentar um plano concreto para ahorrar em preços de habitação.`
  * a:  `Vamos apresentar um plano concreto para poupar nos preços da habitação.`
* `esContrast`
  * de: `'Poupar' ≠ 'economizar' en PT (aunque 'economizar' también existe).`
  * a:  `'Ahorrar' se dice 'poupar' (también vale 'economizar'); 'ahorrar' no existe en portugués.`

### 9. `a4283e03` · b5.json · fill_blank · b5-l1-futuro-presente — ❌ ERROR

Glosa escrita en portugués («mas significa», «Atenção ao acento!») en un campo que es la pista para hispanohablantes, y encima falsa: «trarei» no lleva ningún acento gráfico y no se parece a «traería» sino a «traeré».

**Corrección:**

* `esContrast`
  * de: `'Trarei' parece 'traería' mas significa 'vou trazer'. Atenção ao acento!`
  * a:  `El futuro de 'trazer' es irregular, como fazer y dizer: 'trarei' (no '*trazerei'). Equivale al español 'traeré'.`

### 10. `a84de8ea` · b5.json · translation · b5-l1-futuro-presente — ✅ OK

Futuro do conjuntivo («Quando vierem») + futuro perfeito («já terá terminado») con traducción exacta. Es uno de los pocos ítems del bloque que muestra bien el punto duro; sólo le falta glosa.

### 11. `aab6acb1` · b5.json · translation · b5-l1-futuro-presente — ✅ OK

«Em breve saberemos as novidades» / «Pronto sabremos las novedades»: correcto.

### 12. `aba10b4e` · b5.json · translation · b5-l2-futuro-composto — ✅ OK

Correcto y europeo («precisamos DE resultados»). La acceptedAlternatives repite palabra por palabra el target: es inerte, no rompe nada.

### 13. `b887a7a8` · b5.json · fill_blank · b5-l3-condicional — ❌ ERROR

La glosa inventa una forma española: «faría esfuerzo» no existe (es «haría»), de modo que el contraste que propone es entre el portugués y una palabra que ningún hispanohablante diría.

**Corrección:**

* `esContrast`
  * de: `En portugués se dice 'faria esforço', no 'faría esfuerzo'.`
  * a:  `'Faria' es el condicional de 'fazer' y equivale a 'haría': ambas lenguas acortan la raíz (far- / har-).`

### 14. `ba2402b2` · b5.json · translation · b5-l3-condicional — ⚠️ DUDA

Frase y traducción correctas, pero la glosa llama «futuro del pretérito» a lo que el propio bloque llama «condicional» (b5-l3-condicional): nomenclatura brasileña dentro de una base europea. Sugerido: «'Seria adiada' es el condicional pasivo de 'adiar' y equivale a 'sería pospuesta'».

### 15. `c4c353d8` · b5.json · flashcard · b5-l3-condicional — ❌ ERROR

Dos fallos: (a) la glosa inventa una etiqueta — «queria» es pretérito imperfeito DO INDICATIVO, no «condicional imperfecto», que no existe en ninguna de las dos lenguas; (b) la consigna del front mezcla lenguas y desobedece el AO90: «Transforma A discurso indirecto» → «Transforma EM discurso indireto» (sin c, como «direto», «objeto»).

**Corrección:**

* `data.front`
  * de: `'Maria disse: Eu quero este emprego.' → Transforma a discurso indirecto.`
  * a:  `'Maria disse: Eu quero este emprego.' → Transforma em discurso indireto.`
* `esContrast`
  * de: `Querer → queria en discurso indirecto (condicional imperfecto).`
  * a:  `En el discurso indirecto 'quero' pasa a 'queria' (pretérito imperfeito do indicativo), igual que el español 'quiero' → 'quería'.`

### 16. `c5991acb` · b5.json · translation · b5-l2-futuro-composto — ✅ OK

«Os preços vão baixar no próximo mês»: perífrasis de futuro correcta y sin la «a» española.

### 17. `c8c73d70` · b5.json · flashcard · b5-l1-futuro-presente — ⚠️ DUDA

La glosa es de las buenas del bloque («saberá», no «sabrá»; raíz sabe-) y el back es correcto. Dos reservas de variante: la etiqueta «futuro do presente» es la brasileña (en Portugal, «futuro do indicativo»; el mismo bloque ya usa el término europeo «condicional»), y la casilla «você» es la brasileña — en la base europea correspondería «ele/ela». Sugerido: front → «Conjuga 'saber' en futuro do indicativo (ele/ela, elas):».

### 18. `ccdeaeaa` · b5.json · verb_preposition · b5-l1-futuro-presente — ❌ ERROR

El hueco se queda sin verbo y la preposición se duplica: «eu ___ muito deste curso» + answer «de» ensambla «eu DE muito DEste curso». Ninguna de las cuatro opciones produce una frase gramatical, porque el verbo que debía regir DE («gostarei») no está en la frase.

**Corrección:**

* `data.sentence`
  * de: `No próximo ano, eu ___ muito deste curso de português.`
  * a:  `No próximo ano, eu vou gostar muito ___ estudar português.`

### 19. `d085cce7` · b5.json · translation · b5-l2-futuro-composto — ✅ OK

Traducción correcta y europea («O meu irmão», posesivo con artículo). La glosa («'Soñador' = 'sonhador', funciona igual») es la correcta — y desmiente la del ítem #3.

### 20. `d2a6e538` · b5.json · fill_blank · b5-l1-futuro-presente — ❌ ERROR

Glosa en portugués Y autocontradictoria: «a terminação do futuro é '-á' na 3ª pessoa, não '-á' como em es» opone «-á» a «-á». No hay contraste: «resolverá» es idéntico en las dos lenguas; el contraste real está en la 1.ª persona.

**Corrección:**

* `esContrast`
  * de: `Lembre-se: em pt, a terminação do futuro é '-á' na 3ª pessoa, não '-á' como em es.`
  * a:  `En la 3.ª persona el futuro portugués coincide con el español ('resolverá'); donde se separan es en la 1.ª: 'resolverei' frente a 'resolveré'.`

### 21. `d795eee0` · b5.json · listening · b5-l1-futuro-presente — ❌ ERROR

La pregunta no tiene respuesta verdadera: pide «el verbo con forma irregular en futuro» y «virá» es REGULAR (Priberam: virei, virás, virá, sobre la raíz del infinitivo). La glosa lo empeora: «en portugués cambia la raíz» es exactamente lo contrario — la que cambia es la española (venir → vendrá).

**Corrección:**

* `data.question`
  * de: `¿Qué verbo tiene una forma irregular en futuro?`
  * a:  `¿Qué verbo está en futuro?`
* `esContrast`
  * de: `En español 'vendrá'; en portugués cambia la raíz: vir.`
  * a:  `El español cambia la raíz en el futuro de 'venir' ('vendrá'); el portugués la conserva: 'vir' → 'virá'.`

### 22. `de11f97e` · b5.json · fill_blank · b5-l2-futuro-composto — ✅ OK

Dos huecos con «vou» + infinitivo; correcto y coherente con la glosa.

### 23. `eaf46532` · b5.json · translation · b5-l2-futuro-composto — ❌ ERROR

La glosa no pertenece al ítem: habla de «concretar/concretizar» y en la frase no aparece ninguno de los dos. Y de paso es falsa: «concretar» sí existe en portugués junto a «concretizar». El ítem sí tiene un contraste que enseñar y lo desaprovecha: «vou falar» sin «a», y «a minha mãe» con artículo.

**Corrección:**

* `esContrast`
  * de: `'Concretar' ≠ 'concreto': el primero requiere 'concretizar' en PT.`
  * a:  `El futuro perifrástico portugués no lleva 'a': 'vou falar', nunca '*vou a falar'. Y el posesivo va con artículo: 'a minha mãe'.`

### 24. `fbc0d0c6` · b5.json · flashcard · b5-l1-futuro-presente — ⚠️ DUDA

Formas correctas (irás, iremos) y ejemplo europeo. Dos reservas: la etiqueta «futuro do presente» es brasileña, y el tag «verbo-irregular» es falso — «ir» es perfectamente regular en el futuro (irei, irás, irá). Sugerido: front → «Conjuga 'ir' en futuro do indicativo (tu, nós):» y quitar el tag.

### 25. `fd774631` · b5.json · fill_blank · b5-l3-condicional — ❌ ERROR

La answer deja la frase sin verbo pleno: «A médica disse que eu DEVERIA mais atenção à minha saúde» es agramatical — «dever» no rige el objeto directo «atenção», hace falta «dar/prestar». Lo delata la propia alternativa, «teria que dar», que sí funciona: el runner acepta la alternativa y rechaza… la respuesta correcta.

**Corrección:**

* `data.blanks[0].answer`
  * de: `deveria`
  * a:  `deveria dar`
* `data.blanks[0].alternatives`
  * de: `["teria que dar"]`
  * a:  `["teria que dar", "deveria prestar", "devia dar"]`

### 26. `dcc3f383` · b5.json · conjugation · b5-l1-futuro-presente — ⚠️ DUDA

Conjugación de «falar» correcta (verificada) y pista española exacta. La reserva es de nomenclatura: «futuro do presente» es el término escolar BRASILEÑO; en Portugal es «futuro do indicativo». El corpus ya usa los términos europeos en todo lo demás («condicional», «presente do conjuntivo», «imperfeito do conjuntivo»), así que estas 7 fichas son las únicas disonantes. Sugerido: data.tense → «futuro do indicativo».

### 27. `cd2409b8` · b5.json · conjugation · b5-l1-futuro-presente — ⚠️ DUDA

Conjugación de «ser» correcta (verificada) y pista española exacta. La reserva es de nomenclatura: «futuro do presente» es el término escolar BRASILEÑO; en Portugal es «futuro do indicativo». El corpus ya usa los términos europeos en todo lo demás («condicional», «presente do conjuntivo», «imperfeito do conjuntivo»), así que estas 7 fichas son las únicas disonantes. Sugerido: data.tense → «futuro do indicativo».

### 28. `e448128f` · b5.json · conjugation · b5-l1-futuro-presente — ⚠️ DUDA

Conjugación de «fazer» correcta (verificada) y pista española exacta. La reserva es de nomenclatura: «futuro do presente» es el término escolar BRASILEÑO; en Portugal es «futuro do indicativo». El corpus ya usa los términos europeos en todo lo demás («condicional», «presente do conjuntivo», «imperfeito do conjuntivo»), así que estas 7 fichas son las únicas disonantes. Sugerido: data.tense → «futuro do indicativo».

### 29. `dc8aba2f` · b5.json · conjugation · b5-l1-futuro-presente — ⚠️ DUDA

Conjugación de «dizer» correcta (verificada) y pista española exacta. La reserva es de nomenclatura: «futuro do presente» es el término escolar BRASILEÑO; en Portugal es «futuro do indicativo». El corpus ya usa los términos europeos en todo lo demás («condicional», «presente do conjuntivo», «imperfeito do conjuntivo»), así que estas 7 fichas son las únicas disonantes. Sugerido: data.tense → «futuro do indicativo».

### 30. `99014239` · b5.json · conjugation · b5-l1-futuro-presente — ⚠️ DUDA

Conjugación de «trazer» correcta (verificada) y pista española exacta. La reserva es de nomenclatura: «futuro do presente» es el término escolar BRASILEÑO; en Portugal es «futuro do indicativo». El corpus ya usa los términos europeos en todo lo demás («condicional», «presente do conjuntivo», «imperfeito do conjuntivo»), así que estas 7 fichas son las únicas disonantes. Sugerido: data.tense → «futuro do indicativo».

### 31. `37740d01` · b5.json · conjugation · b5-l1-futuro-presente — ❌ ERROR

Reparto de variantes invertido, el nido (e) en estado puro: la base — que por contrato es la EUROPEA — trae la casilla brasileña «você/terá», y el override «pt-pt» cambia sólo la answer a «terás». Resultado: al alumno europeo se le muestra «ter · você» y se le exige «terás», que es agramatical (você → terá). El esquema de override admite «person», así que el arreglo es limpio.

**Corrección:**

* `data.person`
  * de: `você`
  * a:  `tu`
* `data.answer`
  * de: `terá`
  * a:  `terás`
* `data.hintEs`
  * de: `tú/usted tendrá(s)`
  * a:  `tú tendrás`
* `data.tense`
  * de: `futuro do presente`
  * a:  `futuro do indicativo`
* `variantOverrides`
  * de: `{"pt-pt": {"answer": "terás"}}`
  * a:  `{"pt-br": {"person": "você", "answer": "terá", "hintEs": "usted tendrá"}}`

### 32. `7531c36d` · b5.json · conjugation · b5-l1-futuro-presente — ⚠️ DUDA

Conjugación de «ir» correcta (verificada) y pista española exacta. La reserva es de nomenclatura: «futuro do presente» es el término escolar BRASILEÑO; en Portugal es «futuro do indicativo». El corpus ya usa los términos europeos en todo lo demás («condicional», «presente do conjuntivo», «imperfeito do conjuntivo»), así que estas 7 fichas son las únicas disonantes. Sugerido: data.tense → «futuro do indicativo».

### 33. `2f68e579` · b5.json · conjugation · b5-l3-condicional — ✅ OK

falar → falaria: correcto, y la etiqueta «condicional» es la europea.

### 34. `b785e4db` · b5.json · conjugation · b5-l3-condicional — ✅ OK

fazer → faria: correcto.

### 35. `55a0666f` · b5.json · conjugation · b5-l3-condicional — ✅ OK

dizer → diria: correcto.

### 36. `4c7ac2f0` · b5.json · conjugation · b5-l3-condicional — ✅ OK

ser (eles) → seriam: correcto.

### 37. `05449e18` · b5.json · conjugation · b5-l3-condicional — ✅ OK

gostar → gostaria con pista «yo querría/me gustaría»: correcto, y el tag «cortesia» está bien puesto.

### 38. `b81e8fda` · b5.json · conjugation · b5-l3-condicional — ✅ OK

ver → veria: correcto (y aquí, con buen criterio, NO se marca como irregular; compárese con la glosa del ítem #6).

### 39. `85396ad6` · b5.json · error_correction · b5-l1-futuro-presente — ✅ OK

Corrección de error bien planteada: «falaré» es un calco español inexistente en portugués; «falarei» es la forma.

### 40. `da0227bd` · b5.json · error_correction · b5-l1-futuro-presente — ✅ OK

«fazerei» no existe; «farei» es la forma. Explicación exacta.

### 41. `eb7f85c1` · b5.json · error_correction · b5-l2-futuro-composto — ✅ OK

El contraste más rentable del bloque para un hispanohablante: «vou falar» sin «a». Bien explicado.

### 42. `dc5f73f8` · b5.json · error_correction · b5-l3-condicional — ⚠️ DUDA

El ítem exige corregir una frase que NO es agramatical: «Ele disse que chegará tarde à reunião» es perfectamente correcto si la reunión sigue siendo futura respecto al momento de hablar (igual que «dijo que llegará tarde»). Presentar la concordancia de tiempos como obligatoria enseña una falsedad. Sugerido: anclar el contexto en el pasado («…à reunião de ontem») o matizar la explicación: «cuando el hecho ya no es futuro respecto al momento de hablar».

### 43. `7502f1c7` · b5.json · fill_blank · b5-l1-futuro-presente — ✅ OK

«Amanhã nós viajaremos…»: correcto. La glosa contiene la respuesta, pero esContrast sólo se muestra tras revelar, así que no la destripa.

### 44. `4b100602` · b5.json · multiple_choice · b5-l1-futuro-presente — ⚠️ DUDA

Opciones y explicación correctas («fazerei» no existe, «faço» es presente). Misma reserva de nomenclatura: la pregunta dice «futuro do presente» (brasileño) en una base europea.

### 45. `d4b0188a` · b5.json · multiple_choice · b5-l2-futuro-composto — ✅ OK

Pregunta explícitamente metalingüística sobre el brasileño coloquial y correcta: el perifrástico «vou falar» domina en BR. Al estar marcada como brasileña, no contamina la base europea.

### 46. `707ac39c` · b5.json · multiple_choice · b5-l4-se-futuro-condicional — ❌ ERROR

En portugués europeo la apódosis de la condición irreal admite el imperfeito do indicativo: «Se eu tivesse dinheiro, COMPRAVA uma casa» es idiomático, frecuentísimo y está en cualquier gramática (Cunha & Cintra). El ítem lo ofrece como distractor y lo da por incorrecto, y la explicación lo niega: se enseña como error lo que un portugués dice todos los días.

**Corrección:**

* `data.options[2]`
  * de: `comprava`
  * a:  `comprei`
* `data.explanationEs`
  * de: `Condición irreal: la principal va en condicional ('compraria').`
  * a:  `Condición irreal: la principal va en condicional ('compraria'). En portugués europeo coloquial también se usa el imperfecto de indicativo ('comprava'), pero nunca el pretérito perfecto ('comprei').`

### 47. `03b538f2` · b6.json · translation · b6-l5-contraste-modos — ❌ ERROR

Falso amigo inventado: el español «lidiar con» ES «lidar com», equivalente exacto. Lo demuestra el propio corpus del curso (ítem #63 traduce «lidiar con este problema» → «lidar com este problema»). La glosa enseña a evitar la traducción correcta.

**Corrección:**

* `esContrast`
  * de: `'Lidar com' significa 'manejar/hacer frente a', no 'lidiar con' como en español.`
  * a:  `'Lidar com' es el equivalente exacto del español 'lidiar con' (también 'manejar', 'vérselas con').`

### 48. `04421012` · b6.json · flashcard · b6-l1-presente-conjuntivo — ❌ ERROR

El front regala la respuesta: «Traduce: 'conexión, ligação'» y el back es «ligação». El front se muestra ANTES de revelar, así que la tarjeta no puede fallarse.

**Corrección:**

* `data.front`
  * de: `Traduce: 'conexión, ligação'`
  * a:  `Traduce: 'conexión; llamada telefónica'`

### 49. `056ccbea` · b6.json · flashcard · b6-l4-se-hipotese-improvavel — ❌ ERROR

El back es falso y consagra el error justo en el punto que la ficha dice enseñar: «talvez» exige conjuntivo cuando va ANTES del verbo; pospuesto al verbo se construye con INDICATIVO («Ele vem, talvez»), nunca con conjuntivo («*Ele venha talvez»). Los dos ejemplos, además, llevan «talvez» antepuesto, así que no ilustran la mitad que afirman. Y la glosa borra la asimetría central: el español SÍ admite «Quizá viene» en indicativo, el portugués no admite «*Talvez ele vem».

**Corrección:**

* `data.back`
  * de: `Antes ou depois do verbo no subjuntivo`
  * a:  `Antes do verbo: 'talvez' anteposto exige conjuntivo. Posposto ao verbo, usa-se o indicativo.`
* `data.example`
  * de: `Talvez ele venha. / Ele talvez venha amanhã.`
  * a:  `Talvez ele venha. / Ele vem, talvez.`
* `esContrast`
  * de: `En español también funciona igual: 'Quizás venga'.`
  * a:  `No funcionan igual: el español admite 'Quizá viene' (indicativo); el portugués, con 'talvez' antepuesto, exige conjuntivo — 'Talvez ele venha', nunca '*Talvez ele vem'.`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 50. `064a533b` · b6.json · fill_blank · b6-l5-contraste-modos — ❌ ERROR

Glosa escrita en portugués en el campo que es la pista PARA HISPANOHABLANTES, y sin contenido verificable («'tomar' café é mais natural que em espanhol» — en español «tomar un café» es lo normal).

**Corrección:**

* `esContrast`
  * de: `Em português, 'tomar' café é mais natural que em espanhol.`
  * a:  `Con 'café' el portugués admite 'tomar' y 'beber'; el hueco va en presente de indicativo porque enuncia un hábito, no un deseo.`

### 51. `07865669` · b6.json · verb_preposition · b6-l1-presente-conjuntivo — ❌ ERROR

El ensamblado deja la frase sin verbo: «Quero que ela ___ mim» + «de» = «Quero que ela de mim». El hueco está donde debía ir el verbo en conjuntivo, no la preposición.

**Corrección:**

* `data.sentence`
  * de: `Quero que ela ___ mim.`
  * a:  `Quero que ela goste ___ mim.`

### 52. `0a649f0c` · b6.json · fill_blank · b6-l2-imperfeito-conjuntivo — ✅ OK

«Ninguém esperava que vocês tivessem essa reação»: imperfeito do conjuntivo irregular correcto, y «vocês» es plural normal también en Portugal.

### 53. `0a693481` · b6.json · listening · b6-l1-presente-conjuntivo — ❌ ERROR

Ítem NO GANABLE: la answer es «Expresión impersonal de possibilidade» y entre las options figura «Expresión impersonal de posibilidad» — no coinciden ni un carácter, así que ninguna elección puntúa (el runner compara opt === data.answer). Encima la answer está medio en portugués. Y el audioText es un sinsentido: «É possível que eles suspirem de tão grande que é a confiança» no significa nada.

**Corrección:**

* `data.answer`
  * de: `Expresión impersonal de possibilidade`
  * a:  `Expresión impersonal de posibilidad`
* `data.audioText`
  * de: `É possível que eles suspirem de tão grande que é a confiança.`
  * a:  `É possível que eles cheguem mais tarde, mas eu tenho confiança neles.`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 54. `0cdd0085` · b6.json · translation · b6-l1-presente-conjuntivo — ❌ ERROR

La traducción española es un calco agramatical: «vengan a público revelar todo» no es español (ni «venir a público» ni la yuxtaposición de infinitivo). La alternativa aceptada repite el mismo calco, y el runner la da por buena.

**Corrección:**

* `data.target`
  * de: `Tengo miedo de que ellos vengan a público revelar todo.`
  * a:  `Tengo miedo de que lo hagan público todo.`
* `data.acceptedAlternatives[0]`
  * de: `Me da miedo que ellos vengan a público revelar todo.`
  * a:  `Me da miedo que salgan a la luz pública y lo cuenten todo.`

### 55. `14654ef2` · b6.json · fill_blank · b6-l2-imperfeito-conjuntivo — ✅ OK

«Eu duvidava que ele perdesse tanto tempo assim»: correlación imperfeito → imperfeito do conjuntivo correcta.

### 56. `1a95c0df` · b6.json · flashcard · b6-l5-contraste-modos — ❌ ERROR

Fuga de variante en la consigna: manda traducir «al PT-BR» dentro de la base europea, cuando la respuesta («Tenho medo de que ele não possa vir») es idéntica en las dos variantes. Al alumno de pt-PT se le pide explícitamente producir brasileño.

**Corrección:**

* `data.front`
  * de: `Tengo miedo de que él no pueda venir. (traduce al PT-BR)`
  * a:  `Tengo miedo de que él no pueda venir. (traduce al portugués)`

### 57. `1c3050fc` · b6.json · flashcard · b6-l1-presente-conjuntivo — ❌ ERROR

Glosa agramatical y vacía: «Comparten la misma raíz, pero 'apertar' es regulares (-ar)» — no dice qué comparte con qué, y «es regulares» no es español. Además desperdicia el contraste real, que es la diptongación.

**Corrección:**

* `esContrast`
  * de: `Comparten la misma raíz, pero 'apertar' es regulares (-ar).`
  * a:  `El español 'apretar' diptonga (aprieto, apriete); el portugués 'apertar' no: eu aperto, que eu aperte.`

### 58. `1d5ff8ff` · b6.json · translation · b6-l5-contraste-modos — ✅ OK

«Espero que haja uma boa ligação entre nós»: conjuntivo de «haver» correcto y glosa exacta.

### 59. `1e30cc88` · b6.json · flashcard · b6-l1-presente-conjuntivo — ⚠️ DUDA

La ficha es correcta (que eu fale) y usa el término europeo «presente do conjuntivo». La glosa, en cambio, no dice nada: «el presente del subjuntivo en portugués reemplaza al presente de subjuntivo español» es circular. Sugerido: «El paradigma es paralelo: -ar → -e (fale/hable); -er/-ir → -a (coma/coma)».

### 60. `1ecd4197` · b6.json · listening · b6-l2-imperfeito-conjuntivo — ✅ OK

«O professor pediu que vocês estudassem…» y la pregunta por el infinitivo: correcto; los distractores son inofensivos.

### 61. `1ee66c76` · b6.json · flashcard · b6-l1-presente-conjuntivo — ✅ OK

«início» con acento agudo frente al español «inicio»: contraste real, bien formulado, y ejemplo correcto.

### 62. `266656b5` · b6.json · translation · b6-l1-presente-conjuntivo — ❌ ERROR

La glosa se contradice en dos líneas: primero equipara «'Confiança' = confianza» y a continuación ordena «No confundas con 'confianza' del español». No hay falso amigo ninguno; el tag «falso-amigo» también sobra.

**Corrección:**

* `esContrast`
  * de: `'Confiança' = confianza (sustantivo); 'confiar' = confiar (verbo). No confundas con 'confianza' del español.`
  * a:  `'Confiança' es el cognado exacto de 'confianza'; lo único que cambia es la grafía del sufijo: -ança frente a -anza.`

### 63. `2929e031` · b6.json · translation · b6-l5-contraste-modos — ❌ ERROR

Forma inventada en el texto que el alumno debe producir Y oír: «Dúvido» no existe — es «duvido», sin acento (Priberam: eu duvido, tu duvidas). Y la glosa es falsa: el español también exige «lidiar CON»; lo prueba la fuente del propio ítem, «Dudo que él sepa lidiar con este problema».

**Corrección:**

* `data.target`
  * de: `Dúvido que ele saiba lidar com este problema.`
  * a:  `Duvido que ele saiba lidar com este problema.`
* `esContrast`
  * de: `'Lidar com' requiere 'com' aunque en español se diga simplemente 'lidiar'.`
  * a:  `'Lidar com' se construye igual que el español 'lidiar con'. Ojo a la forma: 'duvido' va sin acento gráfico.`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 64. `299f7796` · b6.json · fill_blank · b6-l5-contraste-modos — ❌ ERROR

Glosa escrita en portugués en el campo de pista para hispanohablantes.

**Corrección:**

* `esContrast`
  * de: `O subjuntivo em português funciona como em espanhol neste contexto.`
  * a:  `El disparador va en indicativo ('quero') y es la subordinada la que va en conjuntivo ('que ela volte'), igual que en español.`

### 65. `2cd4cb67` · b6.json · flashcard · b6-l3-futuro-conjuntivo — ❌ ERROR

El back mezcla lenguas: «ocurrirá» es español — en portugués es «ocorrerá». Y ese back es justamente el texto que se locuta (audio-collector emite data.back en los flashcards), así que el alumno oye una palabra que no existe en portugués.

**Corrección:**

* `data.back`
  * de: `Indica ação que ocurrirá imediatamente após outra no futuro: Assim que + [verbo no futuro do conjuntivo]...`
  * a:  `Indica uma ação que ocorrerá imediatamente após outra no futuro: Assim que + [verbo no futuro do conjuntivo]...`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 66. `411492cc` · b6.json · translation · b6-l5-contraste-modos — ❌ ERROR

Fuga brasileña en la base europea: en portugués de Portugal la locución lleva artículo — «não tenho A certeza de que». El corpus de lecturas del propio proyecto lo confirma sin excepción: 73 apariciones de «a certeza» y CERO de «tenho certeza» (p. ej. Amor de Perdição, c08: «não tenho a certeza de que houvessem estradas para o Japão»). La acceptedAlternatives, además, repite literalmente el target (inerte).

**Corrección:**

* `data.source`
  * de: `Não tenho certeza de que eles saibam a resposta certa.`
  * a:  `Não tenho a certeza de que eles saibam a resposta certa.`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 67. `419a2f15` · b6.json · flashcard · b6-l5-contraste-modos — ❌ ERROR

Tarjeta muerta: front «vaga (substantivo - emprego)» y back «vaga» — la misma palabra portuguesa a los dos lados, sin traducción española. Y la glosa marca el sentido como exclusivo de PT-BR cuando «uma vaga de emprego» es igual de corriente en Portugal.

**Corrección:**

* `data.front`
  * de: `vaga (substantivo - emprego)`
  * a:  `Traduce: 'vacante, plaza (de trabajo)'`
* `esContrast`
  * de: `En PT-BR significa 'puesto de trabajo vacante', no 'vago/incierto'`
  * a:  `'Vaga' es la vacante o la plaza, en Portugal y en Brasil; el adjetivo español 'vago/impreciso' se dice también 'vago'.`

### 68. `41a169d9` · b6.json · verb_preposition · b6-l3-futuro-conjuntivo — ❌ ERROR

Fuga brasileña de régimen: «liguem PARA mim» es brasileño; en portugués europeo se dice «liguem-me» / «telefonem-me» (ligar A alguém). Por lo demás el ítem es de los buenos del bloque: futuro do conjuntivo «precisarem» + regencia «de».

**Corrección:**

* `data.sentence`
  * de: `Assim que vocês ___ ___ ajuda, liguem para mim.`
  * a:  `Assim que vocês ___ ___ ajuda, liguem-me.`

### 69. `43b7e44d` · b6.json · verb_preposition · b6-l2-imperfeito-conjuntivo — ❌ ERROR

Glosa falsa: el español también dice «venir DE» — «venía DE la galería» es exactamente la misma construcción. Y la lección es b6-l2 (imperfeito do conjuntivo), pero la frase está en imperfeito de indicativo: no practica lo que anuncia.

**Corrección:**

* `esContrast`
  * de: `En español 'venir' no lleva prep; en PT 'vir DE' indica origen.`
  * a:  `Igual que en español, 'vir de' indica origen; lo que cambia es la contracción obligatoria con el artículo: de + a = 'da galeria'.`

### 70. `43c19009` · b6.json · translation · b6-l5-contraste-modos — ⚠️ DUDA

No es falso, pero «Tenho confiança em que» es una construcción libresca que un portugués no usa: lo natural es «Estou confiante de que…» o «Tenho a certeza de que…». Cero apariciones de «confiança em que» en el corpus de lecturas. Sugerido: data.source → «Estou confiante de que ele vai resolver isso.» (implicaría audio nuevo).

### 71. `44d40ed6` · b6.json · translation · b6-l1-presente-conjuntivo — ❌ ERROR

Tres capas: (a) «Dúvido» no existe — es «duvido» (Priberam); (b) la alternativa aceptada «Dúvido que ele soubesse o que passou» cambia el tiempo (imperfeito por presente, contra la fuente «sepa») y calca el español: en portugués es «o que se passou» / «o que aconteceu» — y el runner la acepta como correcta; (c) «conjunctivo» está mal escrito: en portugués es «conjuntivo» y en español, «subjuntivo».

**Corrección:**

* `data.target`
  * de: `Dúvido que ele saiba o que aconteceu.`
  * a:  `Duvido que ele saiba o que aconteceu.`
* `data.acceptedAlternatives[0]`
  * de: `Dúvido que ele soubesse o que passou.`
  * a:  `Duvido que ele saiba o que se passou.`
* `esContrast`
  * de: `'Saber' en subjuntivo: eu saiba, tu saibas, ele saiba. Presente do conjunctivo, no imperfecto.`
  * a:  `'Saber' en presente do conjuntivo: eu saiba, tu saibas, ele saiba (no el imperfecto 'soubesse').`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 72. `496c5452` · b6.json · flashcard · b6-l4-se-hipotese-improvavel — ❌ ERROR

Tarjeta muerta: front «apertado (adjetivo)» y back «apertado / apertada» — portugués a los dos lados, sin traducción española. El alumno no puede aprender nada porque no hay nada que recordar.

**Corrección:**

* `data.front`
  * de: `apertado (adjetivo)`
  * a:  `Traduce: 'apretado, ajustado' (adjetivo)`

### 73. `4c1c9fb6` · b6.json · fill_blank · b6-l1-presente-conjuntivo — ❌ ERROR

La glosa manda fijarse en una letra que no está: ni «venha» ni «venga» llevan «j». El contraste real es nh (PT) frente a ng (ES).

**Corrección:**

* `esContrast`
  * de: `'Venir' en subjuntivo: pt 'venha' vs es 'venga'. Fíjate en la 'j'.`
  * a:  `'Venir' en conjuntivo: pt 'venha' frente a es 'venga' — donde el español pone 'ng', el portugués pone 'nh'.`

### 74. `4c57ee17` · b6.json · translation · b6-l1-presente-conjuntivo — ❌ ERROR

Ortografía inventada en la glosa: «conjunctivo» no existe ni en portugués («conjuntivo», también antes del AO90) ni en español («subjuntivo»). El contenido de la advertencia sí es correcto.

**Corrección:**

* `esContrast`
  * de: `En portugués se usa conjunctivo después de 'talvez' (no indicativo como a veces se dice en español coloquial).`
  * a:  `Tras 'talvez' antepuesto el portugués exige conjuntivo; el español coloquial admite además el indicativo ('Quizá lo sabe').`

### 75. `4fd214c6` · b6.json · verb_preposition · b6-l1-presente-conjuntivo — ❌ ERROR

Mismo defecto estructural que el ítem #51: el ensamblado deja la frase sin verbo — «É possível que nós de ajuda». El hueco ocupa el lugar del verbo en conjuntivo, no el de la preposición.

**Corrección:**

* `data.sentence`
  * de: `É possível que nós ___ ajuda.`
  * a:  `É possível que nós precisemos ___ ajuda.`

### 76. `5048626c` · b6.json · fill_blank · b6-l5-contraste-modos — ❌ ERROR

Glosa en portugués, y con una regla que no se sostiene: «não duvidar exige indicativo» es falso — «Não duvido que ele venha» (conjuntivo) es normal y correcto; el indicativo es una opción, no una obligación.

**Corrección:**

* `esContrast`
  * de: `'Duvidar' exige subjuntivo na subordinada; compare: 'não duvidar' exige indicativo.`
  * a:  `'Duvidar' rige conjuntivo en la subordinada ('duvido que ele venha'); en negativa caben los dos modos. Aquí el hueco es el verbo principal y va en indicativo.`

### 77. `520df8fd` · b6.json · fill_blank · b6-l1-presente-conjuntivo — ✅ OK

«Duvido que eles possam/saibam lidar com essa situação»: correcto, con alternativa legítima. La coletilla «Ojo con la estructura» no aporta, pero no es falsa.

### 78. `566d289a` · b6.json · flashcard · b6-l3-futuro-conjuntivo — ❌ ERROR

El back mezcla lenguas y además es una tautología: «Indica ação futura que OCURRIRÁ no futuro» — «ocurrirá» es español (PT: «ocorrerá»), y la definición se muerde la cola. Es el texto que se locuta.

**Corrección:**

* `data.back`
  * de: `Indica ação futura que ocurrirá no futuro: Quando + [sujeito] + [verbo no futuro do conjuntivo]...`
  * a:  `Indica uma ação futura ainda não realizada: Quando + [sujeito] + [verbo no futuro do conjuntivo]...`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 79. `64073d7a` · b6.json · flashcard · b6-l1-presente-conjuntivo — ✅ OK

«Talvez ele ___ a verdade» → «diga (conjuntivo)»: correcto. La glosa simplifica con un «siempre» que sólo vale con «talvez» antepuesto, pero al ir antepuesto en el ejemplo, no induce a error.

### 80. `64e682ff` · b6.json · translation · b6-l5-contraste-modos — ❌ ERROR

La glosa contradice al propio ítem: afirma que tras «espero» va INDICATIVO, y la frase dice «espero que ESTEJA» (conjuntivo). «Espero que» rige conjuntivo siempre, en portugués y en español; y la coletilla «en PT-BR» sugiere una diferencia de variante que no existe.

**Corrección:**

* `esContrast`
  * de: `Indicativo tras 'espero' en PT-BR cuando hay expectativa positiva directa.`
  * a:  `Tanto 'é estranho que' como 'espero que' rigen conjuntivo ('tenha ligado', 'esteja'), exactamente igual que en español.`

### 81. `682e66e2` · b6.json · fill_blank · b6-l2-imperfeito-conjuntivo — ✅ OK

«Era impossível que ele fosse tão descuidado»: correlación de tiempos y forma irregular correctas.

### 82. `6cc03736` · b6.json · fill_blank · b6-l5-contraste-modos — ❌ ERROR

Glosa escrita en portugués en el campo de pista para hispanohablantes.

**Corrección:**

* `esContrast`
  * de: `'Lidar com' leva preposição 'com', que se mantém na subordinada.`
  * a:  `'Lidar' rige 'com', igual que el español 'lidiar con', y la preposición se mantiene en la subordinada en conjuntivo: 'que ele lide com…'.`

### 83. `6d873e0e` · b6.json · listening · b6-l5-contraste-modos — ❌ ERROR

Glosa medio en INGLÉS: «pero en español WE'D SAY 'Es importante que'». (El tag, además, dice «imperiosal» por «impessoal».) El contenido, una vez traducido, es correcto.

**Corrección:**

* `esContrast`
  * de: `Ojo: 'É importante que' exige subjuntivo en portugués, pero en español we'd say 'Es importante que' con subjuntivo también.`
  * a:  `'É importante que' rige conjuntivo, exactamente igual que el español 'es importante que'.`

### 84. `72151956` · b6.json · flashcard · b6-l5-contraste-modos — ❌ ERROR

Tres fallos en cinco palabras: (a) front y back son la misma palabra portuguesa («talvez»), así que la tarjeta no enseña nada; (b) la glosa dice «se escribe igual» y es falso — el español lo escribe SEPARADO, «tal vez» (lo dice bien el ítem #86, que se contradice con éste); (c) «se usa con indicativo o conjuntivo según el contexto» borra la regla: antepuesto al verbo exige conjuntivo. Y es duplicado exacto del ítem #98: comparten los DOS hashes de audio.

**Corrección:**

* `data.front`
  * de: `talvez`
  * a:  `Traduce: 'tal vez, quizá'`
* `esContrast`
  * de: `Se escribe igual pero en PT-BR se usa con indicativo o conjuntivo según el contexto`
  * a:  `El español lo escribe separado ('tal vez') y admite indicativo; el portugués lo escribe junto y, antepuesto al verbo, exige conjuntivo: 'Talvez eu vá'.`

### 85. `73e6569c` · b6.json · translation · b6-l2-imperfeito-conjuntivo — ✅ OK

«Era necesario que ellos hicieran» → «Era necessário que eles fizessem»: correcto, y la advertencia sobre «fossem» es pertinente.

### 86. `74ad4db6` · b6.json · translation · b6-l5-contraste-modos — ✅ OK

Traducción correcta y glosa VERDADERA sobre la grafía separada del español («tal vez»). Es la que debería heredar el ítem #84.

### 87. `7ae49552` · b6.json · verb_preposition · b6-l5-contraste-modos — ✅ OK

«Ele aprendeu A lidar com situações difíceis»: régimen correcto y glosa honesta al decir que la estructura es idéntica en las dos lenguas.

### 88. `7b8f1ddb` · b6.json · fill_blank · b6-l2-imperfeito-conjuntivo — ❌ ERROR

Glosa escrita en portugués («no imperfeito do conjuntivo é… não 'fuese'») en el campo de pista para hispanohablantes. El contenido es correcto.

**Corrección:**

* `esContrast`
  * de: `Cuidado: 'ir' no imperfeito do conjuntivo é 'fosse/fôssemos/fossem', não 'fuese'.`
  * a:  `El imperfecto de conjuntivo de 'ir' es 'fosse/fôssemos/fossem' — coincide con el de 'ser' —, no el español 'fuese'.`

### 89. `7ef779dd` · b6.json · translation · b6-l2-imperfeito-conjuntivo — ❌ ERROR

Reparto BR↔PT invertido: «Tomara que» es la fórmula BRASILEÑA, y la europea («Oxalá») está relegada a alternativa. El corpus de lecturas del proyecto lo confirma: 5 «Oxalá que» y CERO «Tomara que» (los dos «tomara» del corpus son otra cosa: «Tomara-o uma timidez» y «Tomara eu ter o talento», sin «que»). El alumno europeo produce y OYE la variante equivocada.

**Corrección:**

* `data.target`
  * de: `Tomara que ela vivesse mais perto de nós.`
  * a:  `Oxalá ela vivesse mais perto de nós.`
* `data.acceptedAlternatives[0]`
  * de: `Oxalá ela vivesse mais perto de nós.`
  * a:  `Quem me dera que ela vivesse mais perto de nós.`

**`rehacer: true`** — el campo corregido es el que se locutó; el audio actual dice el texto roto.

### 90. `7fa4ea72` · b6.json · listening · b6-l3-futuro-conjuntivo — ❌ ERROR

Glosa falsa: «no confundir con 'calentar' español» — «aquecer» ES «calentar»; es la traducción correcta, no una trampa. Lo único cierto (que «eu aquecer» es futuro do conjuntivo) queda ahogado.

**Corrección:**

* `esContrast`
  * de: `'Aquecer' se conjuga en subjuntivo futuro: eu aquecer, no confundir con 'calentar' español.`
  * a:  `Tras 'assim que' va el futuro do conjuntivo, que en los verbos regulares coincide con el infinitivo: 'aquecer' = 'caliente' (español, presente de subjuntivo).`

### 91. `869a319e` · b6.json · flashcard · b6-l1-presente-conjuntivo — ✅ OK

«Conjuga 'comer' en presente do conjuntivo: que ele coma», con una glosa que describe bien el mecanismo (-er → -a).

### 92. `86dee484` · b6.json · translation · b6-l1-presente-conjuntivo — ❌ ERROR

Forma inexistente en la alternativa aceptada: «facças» no existe — la 2.ª persona del presente do conjuntivo de «fazer» es «faças» (Priberam). Y el runner de traducción acepta las acceptedAlternatives como respuesta correcta, así que el alumno que escriba «facças» recibe un «bien».

**Corrección:**

* `data.acceptedAlternatives[0]`
  * de: `É importante que facças a ligação correta.`
  * a:  `É importante que tu faças a ligação correta.`

### 93. `8a623db0` · b6.json · translation · b6-l1-presente-conjuntivo — ✅ OK

«Talvez ele venha amanhã» → «Quizás él venga mañana», con «Tal vez» como alternativa: correcto en las dos direcciones.

### 94. `8d514b7e` · b6.json · fill_blank · b6-l5-contraste-modos — ❌ ERROR

La clave riñe con la frase: «Mas ___ que ___ mesmo» exige contraste, y la answer «não duvido» lo anula («Creo que está enferma. Pero no dudo que lo esté») — además la pista dice «duvidar», no «não duvidar», así que el alumno que escriba «duvido» (lo natural y lo pedido) se equivoca. Con «duvido», la subordinada pasa obligatoriamente a conjuntivo: «esteja». La glosa, encima, está en portugués.

**Corrección:**

* `data.blanks[1].answer`
  * de: `não duvido`
  * a:  `duvido`
* `data.blanks[2].answer`
  * de: `está`
  * a:  `esteja`
* `data.blanks[2].alternatives`
  * de: `["esteja"]`
  * a:  `[]`
* `esContrast`
  * de: `'Achar' no indicativo expressa opinião; 'duvidar' exige subjuntivo na subordinada.`
  * a:  `'Achar' introduce opinión y va con indicativo ('acho que ela está'); 'duvidar' exige conjuntivo ('duvido que esteja').`

### 95. `93088d54` · b6.json · flashcard · b6-l5-contraste-modos — ❌ ERROR

Tarjeta muerta (front «lidar com (verbo)» = back «lidar com», sin traducción española) y glosa que discute un sentido que nadie ha propuesto: «no solo 'tocar' como podría sugerir 'lidar'».

**Corrección:**

* `data.front`
  * de: `lidar com (verbo)`
  * a:  `Traduce: 'lidiar con, vérselas con'`
* `esContrast`
  * de: `Significa 'lidiar con/manejar', no solo 'tocar' como podría sugerir 'lidar'`
  * a:  `'Lidar com' equivale al español 'lidiar con' / 'manejar'; con personas y problemas, no con objetos.`

### 96. `96866205` · b6.json · translation · b6-l1-presente-conjuntivo — ❌ ERROR

La FUENTE española contiene un verbo portugués: «Espero que puedas LIDAR con el problema». En español es «lidiar». El alumno lee como español una palabra que no lo es, en el mismo ítem cuya glosa presume de explicar «lidar com».

**Corrección:**

* `data.source`
  * de: `Espero que puedas lidar con el problema.`
  * a:  `Espero que puedas lidiar con el problema.`

### 97. `980326fd` · b6.json · flashcard · b6-l1-presente-conjuntivo — ❌ ERROR

La pista del front regala la respuesta: «'Eu sei que ele ___ aqui.' (está)» y el back es «está (indicativo)». La pista debe dar el infinitivo, como hace correctamente el ítem #79 con «(dizer)».

**Corrección:**

* `data.front`
  * de: `¿Indicativo o conjuntivo? 'Eu sei que ele ___ aqui.' (está)`
  * a:  `¿Indicativo o conjuntivo? 'Eu sei que ele ___ aqui.' (estar)`

### 98. `9fce0ceb` · b6.json · flashcard · b6-l4-se-hipotese-improvavel — ❌ ERROR

Tarjeta muerta (front «talvez (adverbio)» = back «talvez», sin traducción española) y duplicado exacto del ítem #84: comparten los DOS hashes de audio (br e7a24ce4…, pt 7bcacf5a…). Uno de los dos sobra; el otro necesita front español.

**Corrección:**

* `data.front`
  * de: `talvez (adverbio)`
  * a:  `Traduce: 'tal vez, quizá' (adverbio)`
* `esContrast`
  * de: `(ausente)`
  * a:  `El español lo escribe separado ('tal vez'); el portugués, junto, y antepuesto al verbo exige conjuntivo.`

### 99. `a3b799c6` · b6.json · flashcard · b6-l4-se-hipotese-improvavel — ❌ ERROR

Tarjeta muerta: front «rumo (substantivo)» = back «rumo». Falta la traducción española («rumbo»), que es lo único que la tarjeta tendría que enseñar.

**Corrección:**

* `data.front`
  * de: `rumo (substantivo)`
  * a:  `Traduce: 'rumbo' (sustantivo)`

### 100. `ab9dc6c5` · b6.json · flashcard · b6-l1-presente-conjuntivo — ✅ OK

«Traduce: 'Es posible que…'» → «É possível que…» con ejemplo «É possível que chova amanhã»: correcto y con glosa exacta.

---

## Cierre

**53 ERROR · 13 DUDA · 34 OK = 100.** b5 15/46 = 33 %; b6 38/54 = 70 %.

La lectura útil no es el porcentaje, es el reparto: **b5 falla en el envoltorio y b6 falla en la doctrina.** En b5 las formas son correctas y lo que se rompe son las glosas y cuatro ensamblados; se arregla con `sed`. En b6, 38 de 54 ítems están mal y el patrón es que **nadie escribió las glosas del conjuntivo**: se rellenaron con portugués, con inglés, con falsos amigos inventados y con reglas al revés — incluida la única que este bloque existía para enseñar, la asimetría de «talvez». Y seis tarjetas de b6 son literalmente la misma palabra a los dos lados.

Si hay que priorizar: primero los **9 ensamblados rotos** — incluido el no ganable — (el alumno pierde puntos por acertar), después las **3 formas inventadas** que el runner valida como correctas («Dúvido» ×2, «facças»), después el **duplicado #84/#98** y las **6 tarjetas muertas**, y al final las 31 glosas — que son mayoría, pero sólo se leen tras fallar.
