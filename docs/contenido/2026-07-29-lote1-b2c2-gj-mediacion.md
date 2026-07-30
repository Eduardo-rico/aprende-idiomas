# Lote 1 Ola B2C2-PT — 20 juicios de gramaticalidad + 6 mediaciones

**Estado: REVISADO Y PUBLICADO (2026-07-29)** — GJ en b8 (b2c2-gj-l1-01…20)
y mediaciones en b10 (b2c2-med-03…08). La fuente de verdad de los TEXTOS
FINALES son los JSON de los bloques; este doc conserva el borrador y el
resultado de la revisión.

## Resultado de la revisión (2 informes independientes)

- **RETIRADO GJ-03 original** («Tenho medo aos cães»): ambos revisores
  — `medo a` está atestada en PT europeo y un juicio binario no puede
  apoyarse en frecuencia. Sustituto: el falso amigo oficina→escritório
  (propuesta del revisor 1; la del 2 —«vou a estudar»— duplicaba el
  GJ-1 del piloto).
- **Convergencias aplicadas**: fuga GJ-06→07 cortada (la explicación de
  06 ya no menciona 'pedir'); GJ-07 dice la verdad (la trampa es de
  material traducido del INGLÉS, no calco del español); 6 absolutos
  falsos corregidos (olvidar/aficionado existen como arcaísmo/préstamo,
  'rico' afectivo prenominal, 'capaz que' es regional, 'até o' no es
  agramatical estricto, la hora en plural es LA PREGUNTA); GJ-01
  centrado en estar a + inf; GJ-02 reescrito (la interferencia es del
  BR de series, no del español); cola des-alternada (secuencia final
  BMMBMBMMBMBBBMMMBMBB, runs ≤3); «anedota»→«chiste» en la consigna de
  M7; metadata de tuteo coherente (GJ-13 declara informal/tu, GJ-06 ya
  no); rúbrica de M4 operacionalizada (binaria) y la de M5 admite
  'shopping' (también se dice en Portugal); modelo de M6 sin torcer a
  Maria; sourceText de M3/M6 EXTRAÍDOS POR SCRIPT de los JSON de la
  biblioteca (no re-tecleados) y recuentos de modelo verificados por
  script (todos ∈ rango).
- **Solo revisor 1, verificable de plano, aplicado**: la «próclise» de
  GJ-13 era FANTASMA (no hay clítico en «não deixes») — sustituida por
  la regla real (imperativo negativo = conjuntivo).
- **Conflictos sin convergencia (queda el original, anotado)**: rango de
  M7 (el 1 defiende que relay recuenta y puede exceder la fuente; regla
  para el molde: el techo ≤70% NO aplica a relay/reformulate/
  cross_variety); repair de GJ-18 (adepto verificado por el 2; fã ya
  está en la explicación); «ao pé do quiosque» se queda (ambos a favor).
- **Convención declarada**: audience va en la lengua del PRODUCTO
  (M4/M5 pt, resto es); en sourceRef, `parrafos[0]` de las lecturas con
  secciones es el numeral romano.

---

## BORRADOR ORIGINAL (v1 pre-revisión, superado) Primer lote a escala tras el piloto. Sigue el
MOLDE fijado por los informes del piloto: ratio BIEN/MAL 10/10 con orden
mezclado (nada de alternancia), un solo error por frase MAL, repairs
naturales, explicaciones SIN absolutos falsos, ítems que no se regalan
respuestas entre sí, techo de resumen ≤ ~70% de la fuente. PT europeo,
AO90 en el material nuevo; las citas de la biblioteca conservan su grafía
original declarada (Eça ~1902, Junqueiro 1877) y NO se «corrigen».

Para los revisores: (1) ¿cada verdict es inequívoco en PT-PT — un nativo
culto no discreparía? (2) ¿cada repair es la forma NATURAL? (3) ¿cada
explicación dice verdad, sin sobregeneralizar? (4) ¿algún par de ítems se
regala la respuesta? (5) mediaciones: rúbricas autoevaluables, consignas
claras, rangos, y las respuestas modelo palabra a palabra. (6) Los
sourceText de M4 y M5 son originales del autor: atacadlos con saña — en
el piloto el sourceText inventado fue el error más gordo.

## Juicios de gramaticalidad (blockId 8; register neutro y lessonId provisional b8-l1 salvo indicación)

### L1-GJ-01 · BIEN
- sentence: «Está a chover desde ontem.»
- explanationEs: «'Estar a + infinitivo' es el progresivo europeo, y
  'desde + punto en el tiempo' (ontem) no necesita nada más — la duda
  viene del español 'desde ayer / desde hace un día'.»

### L1-GJ-02 · MAL
- sentence: «Cheguei em casa muito tarde.»
- repair: «Cheguei a casa muito tarde.»
- explanationEs: «'Chegar' de movimiento rige A en el estándar europeo
  ('chegar a casa', sin artículo). 'Chegar em' es habla brasileña
  corriente y calco cómodo del español 'llegar en… no, llegar A' — ojo:
  en español también es A; el calco real es del BR que se oye en series.»

### L1-GJ-03 · MAL
- sentence: «Tenho medo aos cães.»
- repair: «Tenho medo de cães.»
- explanationEs: «'Miedo A los perros' se dice 'medo DE cães': el
  sustantivo 'medo' rige DE en portugués.»

### L1-GJ-04 · BIEN
- sentence: «Apaixonei-me por ela.»
- explanationEs: «'Enamorarse DE' se dice 'apaixonar-se POR' — aquí está
  bien. La ênclise 'apaixonei-me' también: frase afirmativa sin
  disparador de próclise.»

### L1-GJ-05 · MAL
- sentence: «Levo três anos a estudar português.»
- repair: «Estudo português há três anos.»
- explanationEs: «'Llevar + tiempo + gerundio' no se traduce con 'levar':
  la duración en portugués es con 'há' ('há três anos que estudo' también
  vale). 'Levar' existe, pero para otras cosas (levar tempo A fazer algo
  = tardar).»

### L1-GJ-06 · BIEN · register informal · address tu · lessonId b8-l2
- sentence: «Vou perguntar-lhe se pode ajudar.»
- explanationEs: «'Perguntar' (hacer una pregunta) con 'se' está perfecto.
  No confundir con 'pedir' (solicitar algo): aquí se pregunta, no se
  pide.»

### L1-GJ-07 · MAL · lessonId b8-l4-discurso-indireto
- sentence: «Pedi-lhe uma pergunta.»
- repair: «Fiz-lhe uma pergunta.»
- explanationEs: «Las preguntas no se 'piden': se HACEN — 'fazer uma
  pergunta'. Cruce del español 'pedir' con 'preguntar'.»

### L1-GJ-08 · MAL
- sentence: «Vou a pé até o centro.»
- repair: «Vou a pé até ao centro.»
- explanationEs: «En el estándar europeo, 'até' + artículo pide la
  contracción CON a: 'até ao centro', 'até à praia'. 'Até o' es la norma
  brasileña.»

### L1-GJ-09 · BIEN
- sentence: «Faz muito calor em agosto.»
- explanationEs: «'Fazer calor/frio' existe en portugués igual que en
  español ('está calor' también se dice). Correcta tal cual.»

### L1-GJ-10 · MAL
- sentence: «Olvidei-me de trazer o livro.»
- repair: «Esqueci-me de trazer o livro.»
- explanationEs: «'Olvidar' no es palabra portuguesa: es 'esquecer'. La
  estructura ('-me de + infinitivo') estaba impecable — el error es solo
  el verbo.»

### L1-GJ-11 · BIEN
- sentence: «Somos quatro na minha família.»
- explanationEs: «'Somos cuatro' funciona igual: 'ser + numeral' para el
  tamaño del grupo, y el posesivo con artículo ('na minha família') es
  el europeo de manual.»

### L1-GJ-12 · BIEN
- sentence: «Se calhar vou ficar em casa.»
- explanationEs: «'Se calhar' (= a lo mejor) es europeo genuino y
  corriente — no existe en español y por eso suena 'sospechoso'. En
  Brasil se diría 'talvez' o 'capaz que'.»

### L1-GJ-13 · BIEN
- sentence: «Não deixes de visitar Sintra.»
- explanationEs: «'Deixar de + infinitivo' = 'dejar de': coincide con el
  español y está perfecto — no todo lo que suena igual es calco. La
  próclise ('não deixes') la dispara la negación.»

### L1-GJ-14 · MAL · lessonId b8-l3-colocacao-pronominal
- sentence: «O filme parece-se ao livro.»
- repair: «O filme parece-se com o livro.»
- explanationEs: «'Parecerse A' se dice 'parecer-se COM'. La ênclise
  'parece-se' está bien — el error está en la preposición.»

### L1-GJ-15 · BIEN
- sentence: «Vou-me embora, que já é tarde.»
- explanationEs: «'Ir-se embora' y el 'que' causal coloquial ('…que ya es
  tarde') son europeos naturales. Nada que tocar.»

### L1-GJ-16 · MAL · lessonId b8-l4-discurso-indireto
- sentence: «Perguntou-me que hora era.»
- repair: «Perguntou-me que horas eram.»
- explanationEs: «La hora en portugués es PLURAL: 'que horas são?', 'que
  horas eram?'. El singular es calco de '¿qué hora era?'.»

### L1-GJ-17 · BIEN · register informal · address tu
- sentence: «Quanto tempo demoraste a chegar?»
- explanationEs: «'Demorar A + infinitivo' (= tardar en) es la regência
  correcta, y 'demoraste' es el 2sg del tuteo europeo normal.»

### L1-GJ-18 · MAL
- sentence: «Sou aficionado ao futebol.»
- repair: «Sou adepto do futebol.»
- explanationEs: «'Aficionado' no se usa en portugués: del fútbol se es
  'adepto' (o 'fã'). Léxico, no gramática.»

### L1-GJ-19 · BIEN
- sentence: «Ainda não me habituei a acordar cedo.»
- explanationEs: «'Habituar-se A' es la regência correcta, y la próclise
  ('não ME habituei') la exige la negación. Todo en orden.»

### L1-GJ-20 · MAL
- sentence: «A carne estava tão rica que repetimos.»
- repair: «A carne estava tão boa que repetimos.»
- explanationEs: «'Rico' en portugués es quien tiene dinero, no la comida
  sabrosa: 'estar bom/saboroso'. '¡Qué rico!' de comida es español.»

## Mediaciones (blockId 10; lessonId b10-l1 salvo M5)

### L1-MED-03 · summarise · pt→es · register neutro
- sourceRef: o-tesoiro (párrafos 2-3 EXACTOS de la lectura; grafía de
  ~1902 declarada)
- sourceText: «Os três irmãos de Medranhos, Rui, Guannes e Rostabal,
  eram então, em todo o Reino das Astúrias, os fidalgos mais famintos e
  os mais remendados. Nos Paços de Medranhos, a que o vento da serra
  levára vidraça e telha, passavam êles as tardes dêsse inverno,
  engelhados nos seus pelotes de camelão, batendo as solas rotas sôbre
  as lages da cozinha, diante da vasta lareira negra, onde desde muito
  não estalava lume, nem fervia a panela de ferro. Ao escurecer devoravam
  uma côdea de pão negro, esfregada com alho. Depois, sem candeia,
  através do pátio, fendendo a neve, iam dormir à estrebaria, para
  aproveitar o calor das três éguas lazarentas que, esfaimadas como êles,
  roíam as traves da mangedoura. E a miséria tornára êstes senhores mais
  bravios que lôbos.» *(128 palabras)*
- audience: «un amigo hispanohablante que no ha leído el cuento»
- instructionsEs: «Resume EN ESPAÑOL cómo viven los tres hermanos al
  empezar 'O Tesoiro' de Eça.»
- wordRange: 25–50
- rubric: «Menciona que son tres hermanos nobles arruinados» ·
  «Transmite la miseria concreta (frío, hambre, dormir con las yeguas)» ·
  «No inventa nada que el texto no diga» · «Cabe en el rango»
- modelAnswer: «Son tres hermanos nobles de Asturias, los más pobres del
  reino: pasan el invierno con la ropa remendada, sin fuego ni comida
  caliente, y duermen en el establo para aprovechar el calor de sus tres
  yeguas, tan hambrientas como ellos.» *(41 palabras)*

### L1-MED-04 · reformulate_register · pt→pt · formal→informal · register informal · address tu
- sourceRef: (aviso formal creado para el ejercicio)
- sourceText: «Exmos. Senhores, informamos que a reunião de sexta-feira
  foi adiada para segunda-feira, às 10h. Agradecemos a compreensão.»
- audience: «um colega que também é teu amigo, por mensagem»
- instructionsEs: «Reescribe el aviso como mensaje INFORMAL a tu colega:
  misma información (la reunión del viernes pasa al lunes a las 10),
  tuteo natural, sin fórmulas de oficina.»
- wordRange: 10–30
- rubric: «Trata de tu (o registro informal claro), sin Exmos./Agradecemos» ·
  «Dice lo mismo: viernes → lunes 10h, sin inventar motivos» ·
  «Suena a mensaje real, no a aviso encogido» · «Cabe en el rango»
- modelAnswer: «Olá! Olha, a reunião de sexta passou para segunda às 10.
  Não te esqueças!» *(14 palabras)*

### L1-MED-05 · cross_variety · BR→PT · register informal · address tu · lessonId b10-l2-variacao-diatopica-brasil-portugal
- sourceRef: (mensaje BR creado para el ejercicio — el brasileño es
  CORRECTO ahí a propósito: es la fuente)
- sourceText: «Você pode pegar o ônibus na frente do shopping. Desce no
  ponto perto da banca de jornal e me liga do seu celular quando chegar.»
- audience: «um amigo de Lisboa, tratado por tu»
- instructionsEs: «Reescribe estas indicaciones EN PORTUGUÉS EUROPEO,
  tuteando: cambia lo que un lisboeta diría distinto (léxico, tratamiento
  y colocación de pronombres).»
- wordRange: 15–40
- rubric: «Léxico europeo: autocarro, telemóvel, paragem, quiosque,
  centro comercial (o equivalentes)» · «Tuteo coherente (podes/apanhas…),
  ni un você» · «Colocación europea (liga-me / ligas-me, no 'me liga')» ·
  «Misma información, en el rango»
- modelAnswer: «Podes apanhar o autocarro em frente do centro comercial.
  Sais na paragem ao pé do quiosque e ligas-me do telemóvel quando
  chegares.» *(23 palabras)*

### L1-MED-06 · summarise · pt→es · register neutro
- sourceRef: junqueiro-a-alma (cuento completo, 163 palabras; grafía de
  1877 declarada)
- sourceText: (el cuento «A alma» ÍNTEGRO tal como está publicado en la
  lectura junqueiro-a-alma — diálogo entre Maria y su madre sobre el
  entierro de un niño y qué es el alma)
- audience: «un amigo hispanohablante»
- instructionsEs: «Resume EN ESPAÑOL este mini-cuento de 'Contos para a
  infância': qué pregunta la niña y cómo se lo explica la madre.»
- wordRange: 30–55
- rubric: «Recoge la pregunta de Maria (vio un entierro; ¿qué es el
  alma?)» · «Recoge la explicación de la madre (la pena que sintió 'ahí
  dentro' ES el alma)» · «No inventa nada» · «Cabe en el rango»
- modelAnswer: «Maria vio el entierro de un niño y le pregunta a su madre
  si los niños malos no van al paraíso, y qué es eso del alma. La madre
  le responde con lo que la propia niña sintió: esa pena 'ahí dentro' al
  ver llorar a la familia — eso es el alma.» *(52 palabras)*

### L1-MED-07 · relay · pt→es · register informal
- sourceRef: anedotas-e-quadras-a2-1 (pieza III, texto exacto)
- sourceText: «Dois alentejanos estão deitados à sombra de uma oliveira.
  Passa um turista: — Bom dia! O que é que está a fazer? — Nada, nada.
  — E o seu amigo? — Está a ajudar-me.»
- audience: «un amigo español al que quieres contarle el chiste»
- instructionsEs: «Cuéntale la anedota EN ESPAÑOL, como se cuenta un
  chiste — corto y con el remate al final.»
- wordRange: 25–50
- rubric: «Escena: dos alentejanos tumbados a la sombra y un turista que
  pregunta» · «El remate es la última frase ('me está ayudando')» ·
  «No explica el chiste, lo CUENTA» · «Cabe en el rango»
- modelAnswer: «Dos del Alentejo están tumbados a la sombra de un olivo.
  Pasa un turista y le pregunta a uno: '¿qué hace usted?'. 'Nada, nada'.
  '¿Y su amigo?'. 'Me está ayudando.'» *(31 palabras)*

### L1-MED-08 · explain_concept · pt→es · register neutro
- sourceRef: anedotas-e-quadras-a2-2 (pieza I, texto exacto)
- sourceText: «A professora diz: — Joãozinho, conjuga o verbo andar. —
  Eu ando… tu andas… ele anda… — Mais depressa! — Nós corremos, vós
  correis, eles correm!»
- audience: «un amigo español que estudia portugués y no le ve la gracia»
- instructionsEs: «Explícale EN ESPAÑOL por qué tiene gracia: qué dos
  cosas puede significar la orden de la profesora y qué hace Joãozinho
  con el verbo.»
- wordRange: 30–60
- rubric: «Explica la ambigüedad de 'Mais depressa!' (recita más rápido /
  muévete más rápido)» · «Explica que Joãozinho responde cambiando
  'andar' por 'correr' SIN salirse del paradigma (sigue en nosotros-
  vosotros-ellos)» · «No traduce el chiste entero palabra a palabra:
  lo explica» · «Cabe en el rango»
- modelAnswer: «La profesora le pide conjugar 'andar' y, cuando dice
  '¡más deprisa!', quiere que recite más rápido. Joãozinho entiende (o
  finge entender) que debe MOVERSE más rápido… y sigue la tabla donde
  iba, pero con 'correr': 'nós corremos, vós correis, eles correm'.»
  *(44 palabras)*

*(nota del autor: en M5 dudo si «ao pé do quiosque» del modelo es mejor
que «perto do quiosque» — decidan; y en GJ-02 la explicación menciona el
BR: ¿estorba o ayuda?)*
