# Auditoría lingüística de contenido — portugues-app

**Fecha:** 2026-07-01 · **Auditor:** agente lingüista (PT-BR/PT-PT + ES-MX) · **Modo:** solo lectura (ningún archivo de contenido modificado)

**Alcance muestreado:** glosario completo (49), diagnóstico completo (26), 2 historias (b1-s1, b8-s1), 3 lecciones (b3-l1, b6-l1, b2-l1), y ~250 ejercicios revisados en detalle (los 60 error_correction, los 37 multiple_choice, 64 conjugation, ~45 translation, ~35 flashcard/fill_blank, ~45 verb_preposition revisados a mano + escaneo heurístico de los 180 verb_preposition).

**Veredicto corto:** el núcleo gramatical (conjugaciones, error_correction, multiple_choice, prosa de las historias) es sólido, pero hay una franja de ejercicios generados con plantilla rota (sobre todo `verb_preposition`, ~15-18% de ese tipo) y **varios ítems que enseñan como correcto exactamente el error de interferencia ES→PT que la app corrige en otros ejercicios**. No es publicable sin una pasada de corrección.

**Conteo:** Críticos: **25** hallazgos (~60 ítems afectados) · Importantes: **28** · Menores: **16**

---

## CRÍTICO — enseña algo incorrecto

### C1. Verbo inexistente "suspiar" en lección y ejercicio
- `lib/data/languages/pt/mdx/b6/l1-presente-conjuntivo.mdx` línea 10: `- **suspiar** — suspirar`
- `lib/data/languages/pt/blocks/b6.json` (id `659e6191`, fill_blank): blank 2 espera `"suspie"` (subjuntivo del verbo inventado). El propio `esContrast` dice "'suspirar' = 'suspirar' en pt también", contradiciéndose.
- **Corrección:** el verbo es **suspirar**; la forma es **suspire**. Eliminar "suspiar"/"suspie" de ambos sitios.

### C2. Glosario "apelido": en PT-PT significa APELLIDO, no apodo
- `glossary.json` entrada `apelido`: `"variants": { ..., "pt": "apelido (apodo) / sobrenome (apellido)" }` y nota "'Apelido' en PT/BR = apodo".
- **Incorrecto para Portugal:** en PT-PT `apelido` = apellido/sobrenome ("Qual é o seu apelido?" en Lisboa pregunta el apellido); apodo = **alcunha**. La propia entrada `sobrenome` lo contradice y lo dice bien: `"pt": "apelido (PT-PT) / sobrenome"`.
- **Corrección:** variants → `br: "apelido (apodo) / sobrenome (apellido)"`, `pt: "alcunha (apodo) / apelido (apellido)"`, y reescribir la nota como trampa doble BR≠PT.

### C3. Glosario "fato": en PT-PT "hecho" se escribe FACTO
- `glossary.json` entrada `fato`: `"pt": "fato (traje y hecho)"` y nota "En PT el 'fato' de facto existe también con el sentido de 'hecho'".
- **Incorrecto:** el Acordo Ortográfico mantiene la **c** pronunciada en Portugal: *facto* = hecho; *fato* = traje. Solo en Brasil "fato" = hecho.
- **Corrección:** `pt: "fato (traje) / facto (hecho)"`.

### C4. Conjugation en modo PT-PT: muestra "você" pero exige la forma de "tu"
- `blocks/b3.json` ids `d03061db` (falar→override pt-pt `falas`), `915dc048` (`bebes`), `15c6e949` (`estás`); `blocks/b4.json` `72e90352` (`comeste`); `blocks/b5.json` `37740d01` (`terás`).
- El override solo cambia `answer`, no `person`; `components/cards/ConjugationCard.tsx` renderiza `d.person` (sigue diciendo "você"). En Portugal **você también rige 3ª persona** ("você fala"). El usuario PT-PT ve "você · presente" y solo se le acepta "falas" → aprende "você falas".
- **Corrección:** o el override también cambia `person` a "tu", o se elimina el override (la respuesta base "fala" ya es válida en ambas variantes).

### C5. Familia de verb_preposition con plantilla rota (~30 ítems): el hueco cae en el verbo o la preposición ya está en la frase
Ítems donde ninguna opción produce una frase gramatical, o la respuesta marcada duplica la preposición:
- `b1.json`: `54bd1670` ("O alfabeto com 'ã' e 'â' ___ com palavras difíceis." → "com"; además la frase es semánticamente absurda), `8f089cb7` ("Você se ___ da letra 'ã'..." → "de"; falta *lembra*), `d0321a11` ("...a palavra 'pâo', em que você ___?" → "em"; falta *pensa*, y "pâo" está mal escrito: es **pão**), `d4c69c92` ("Você ___ de uma letra 'ç'..." → "de"; falta *precisa*).
- `b3.json`: `2a2931a0` ("No presente, há ___ razões..." → "de" produce *"há de razões"*, agramatical; lo correcto es sin preposición).
- `b4.json`: `b6c7a0a5` ("Nós pensamos ___ em viajar" → "em em"), `be72ef32` ("sonhou ___ com" → "com com"), `ee412815` ("precisou ___ de" → "de de"), `363ee468`, `65d71785`, `8ff16eda` ("Quando eu era criança, eu ___ chocolate." → "de"; falta *gostava*), `c06e57b7`, `cb1f7a4f`, `72e78802` ("Enquanto eu ___ pensar ___ você...").
- `b5.json`: `100acbec` (el "verb" es el sustantivo *conselho* y el hueco pide un sustantivo, pero las opciones son preposiciones), `3eecb886`, `dc63d860`, `ccdeaeaa`, `99114a7c` (blank 2 "com" con el "com" ya presente).
- `b6.json`: `07865669` ("Quero que ela ___ mim." → "de"; falta *goste*), `4fd214c6` ("É possível que nós ___ ajuda." falta *precisemos*), `6972c50b`, `6ca73007`, `9bd90a95`, `cbd87b11`.
- `b8.json`: `b68ed598` ("depende ___ de" → "de de"), `ebedefb2` ("precisamos ___ de" → "de de").
- `b10.json`: `02ab9316` ("O comboio ___ à estação" → "à"; falta *chega*), `8dc1d8a1` ("Caso ___ de mais informações" → "de"; falta *precise*).
- **Corrección:** regenerar estos ítems con el hueco sobre la preposición (y solo una vez), p.ej. "O comboio chega ___ estação às nove." → "à".

### C6. verb_preposition b8 `fa57cc56`: enseña "*me acordo*" como correcto
- `blocks/b8.json`: "Eu ___ cedo todos os dias." opciones `["me acordo", "acordo-me", "acordo", "me acordo"]` (¡opción duplicada!), respuesta `"me acordo"`; esContrast afirma "En PT 'acordar' es reflexivo (acordar-se)".
- **Falso:** *acordar* (despertarse) NO es pronominal en portugués: **"Eu acordo cedo"**. "Me acordo" es la interferencia del ES "me despierto". La única opción correcta ("acordo") está marcada como distractor.

### C7. verb_preposition b5 `90c3eec0`: enseña "*vou a começar*"
- `blocks/b5.json`: "Vou ___ começar a poupar..." respuesta `"a"` → "Vou **a** começar", calco del ES "voy a empezar". En PT, ir + infinitivo va **sin preposición**: "Vou começar".
- Contradice directamente el error_correction `eb7f85c1` del mismo bloque ("Eu vou a falar..." → "Eu vou falar..."). El distractor `∅` es la respuesta correcta.

### C8. fill_blank b5 `8125e2e5`: enseña "*Quando eu vou crescer*"
- "Quando eu ___ crescer, quero ser astronauta." respuesta `"vou"`; esContrast: "'Vou crescer' = 'voy a crecer'. Expresión muy natural en PT-BR".
- **Falso:** tras *quando* con referencia futura el portugués exige **futuro do conjuntivo**: "Quando eu **crescer**, quero ser astronauta" (el hueco sobra). "Quando eu vou crescer" es agramatical.

### C9. fill_blank b3 `c1a0ab13`: acepta "*Fazem anos*" como alternativa válida
- "___ anos que moro nesta cidade..." respuesta "Há", `alternatives: ["Fazem"]`.
- **Falso:** *fazer* temporal es impersonal: "**Faz** anos que...". "Fazem anos" es precisamente el error de concordancia clásico que la norma proscribe.

### C10. fill_blank b2 `87c3220e`: respuesta "quemquer" (palabra inexistente)
- "Qualquer pessoa, ___ que seja, pode participar..." respuesta `"quemquer"`.
- **Corrección:** es **"quem quer"** (dos palabras: *quem quer que seja*). "Quemquer" no existe.

### C11. fill_blank b8 `da76a3f7`: "acteur" no es portugués
- "O guião no ___ aparece o **acteur** estreante foi adaptado." — "acteur" es francés; en portugués es **ator** (AO90; pre-AO PT: *actor*). Además `alternatives: ["qual"]` duplica la respuesta.

### C12. translation b5 `30ef3472`: target con calco "Vais **a** poupar"
- source "¿Vas a ahorrar dinero para el viaje este verano?" → target `"Vais a poupar dinheiro para a viagem este verão?"`; alternativa `"Vais a ahorrar dinheiro..."` (mitad español).
- **Corrección:** "**Vais poupar** dinheiro...?" (PT-PT) / "Você vai poupar...?" (BR). Eliminar la alternativa híbrida.

### C13. translation b6 `2929e031`: "*Dúvido*" mal acentuado
- target `"Dúvido que ele saiba lidar com este problema."` — el verbo es **duvido** (sin acento; *dúvida* es el sustantivo).

### C14. translation b10 `08155994`: palabra inventada "Remainho" + override en el idioma equivocado
- Override PT-PT: `"Seguem em anexo os documentos solicitados. Remainho ao vosso dispor..."` — "Remainho" no existe (parece *remain* + -ho); sería **"Fico/Permaneço ao dispor"**.
- Además el ejercicio es PT→ES (target base en español: "Adjunto le remito...") pero el override PT-PT reemplaza el target por texto en portugués: en modo PT-PT se calificaría la traducción al español contra una frase portuguesa.

### C15. translation b1 `7fdd81e1`: afirmación falsa sobre acentos + source mezclado
- source `"La palavra coração leva acento circunflexo."` → target "A palavra coração leva acento circunflexo."
- **Doble error:** (1) *coração* NO lleva circunflejo: lleva **til** (ã) y cedilla; en el bloque que enseña acentos esto es grave. (2) El "español" de origen está contaminado de portugués ("palavra", "leva"). Mismo problema de source mezclado en b1 `52a18a1a` ("El padre de João fue a São Paulo y trajo **pão para nós**").

### C16. flashcard b1 `be6d8a6e`: regla fonológica incorrecta
- front "¿Por qué en PT europeo 'os' suena como 'och'?" → back "Porque la 's' **entre vocales** se convierte en /ʒ/ o /ʃ/ por asimilación"; ejemplo "os homens → [o'ʒõjʃ]".
- **Falso:** la /s/ **intervocálica** es [z] en ambas variantes; la palatalización [ʃ]/[ʒ] del PT-PT ocurre en **coda silábica** (final de sílaba/palabra). Y "os homens" (h muda → s prevocálica) se pronuncia [uz ˈɔmẽj̃ʃ], no [oʒõjʃ].

### C17. Historia b1-s1 (BR): "João tem quatro letras e **três sílabas: Jo-ão**"
- `stories/b1-s1-o-dia-a-dia-de-joao-na-padaria.json`, variante BR: "Ele olha para a **sílaba** - João tem quatro letras e três sílabas: Jo-ão."
- **Jo-ão son DOS sílabas** (el propio texto lo muestra), y "olha para a sílaba" es incoherente (la variante PT ya lo corrigió a "a palavra" pero mantiene "três sílabas").
- **Corrección:** "...quatro letras e **duas** sílabas: Jo-ão", y "olha para a **palavra**" también en BR.

### C18. Diagnóstico q11: ninguna opción produce una frase correcta
- `diagnostic.json` `q11b02`: "'___ livros estão em ___ mesa.'" opciones "Os / a", "As / a", "Os / à", "As / à"; marcada "Os / a" → "Os livros estão **em a** mesa".
- **"em a" es agramatical** (la contracción **na** es obligatoria, como enseña la propia lección b2-l1); "em à" tampoco existe. La pregunta enseña "em a mesa" como correcto.
- **Corrección:** reformular a "___ livros estão ___ mesa." con opciones "Os / na", etc.

### C19. error_correction b8 `fa684345`: la "corrección" tiene el tiempo equivocado
- "Embora ele está cansado, continuou trabalhando." → correct: "Embora ele **esteja** cansado, **continuou** trabalhando."
- Presente de conjuntivo con principal en pretérito: mismatch. Con "continuou" lo correcto es "Embora **estivesse** cansado"; (o "embora esteja... continua").

### C20. fill_blank b8 `11927933`: modela colocación pronominal incorrecta en el bloque de colocación pronominal
- "Não sei ___ foi **que deixou-me** frustrado." — tras el relativo *que* la próclise es obligatoria: "que **me deixou** frustrado". El bloque 8 enseña exactamente esa regla (cf. q25 del diagnóstico).

### C21. verb_preposition b5 `ca40cfd1`: la frase no está en portugués
- "Se ___ **con** preços baixos, **ven á nosa** padaria." — "con/ven á nosa" es castellano/gallego. En PT: "Se sonhar **com** preços baixos, **venha à nossa** padaria."

### C22. verb_preposition b1 `e913eb0e`: respuesta marcada agramatical + opciones duplicadas
- "O professor lembrou-nos ___ olho roxo..." opciones `["do","de","ao","ao"]`, marcada `"de"` → "lembrou-nos **de olho** roxo" (falta el artículo). La correcta es **"do"**, que figura como distractor. ("ao" aparece dos veces.)

### C23. verb_preposition b4 `34a0e087` y `aba188e7`: la respuesta marcada duplica la preposición
- `34a0e087`: "Nós não nos ___ ___ **do** nome dele." marcada "tínhamos / lembrado **de**" → "lembrado de do nome". La correcta es la opción "tínhamos / lembrado".
- `aba188e7`: "O médico ___ **de** muitos pacientes..." marcada "tratou **de**" → "tratou de de". La correcta es "tratou".

### C24. fill_blank b7 `51820100`: ejercicio irrecuperable
- "___ ela ___ sair mais cedo, não sei." blanks: `"Poder"` y `"ela"` (¡"ela" ya está en la frase!); alternativas "Querer"/"querer sair". Ninguna combinación produce portugués gramatical. Regenerar (p.ej. "Se ela **puder** sair mais cedo, não sei.").

### C25. Lección b6-l1 + glosario: erratas que cambian la palabra
- (Ver C1 para "suspiar".) Adicional en glosario: headword `"policia / polícia"` — "policia" sin acento no existe como sustantivo; siempre **polícia** (el contenido interno de la entrada sí es correcto).

---

## IMPORTANTE — ambiguo, confuso o variante cruzada

### I1. Glosario "microondas": el AO90 exige "micro-ondas" en AMBAS variantes
- `glossary.json`: `"variants": { "br": "micro-ondas", "pt": "microondas" }` — tras el Acordo Ortográfico (vigente también en Portugal) la grafía es **micro-ondas** en las dos variantes. "microondas" es grafía pre-AO.

### I2. Glosario "borracha": nota enredada que sugiere el sentido "ebria"
- Nota: "Aunque también existe como adjetivo de embriaguez ('estar bêbada')" — *borracha* NO significa ebria en portugués (eso es *bêbada*); la nota, tal como está, sugiere lo contrario del punto que quiere hacer. Reescribir: "ebria = bêbada; borracha = goma/caucho".

### I3. Glosario "achar": el sentido "opinar" NO es solo brasileño
- Nota/variants: "En PT = encontrar principalmente", `"pt": "achar (encontrar)"` — "Acho que sim" es perfectamente estándar y frecuentísimo en Portugal. Quitar la marca de que opinar≈solo BR.

### I4. Glosario "você / tu": "você" como "formal" en PT-PT es una simplificación peligrosa
- `"pt": "tu (informal) / você (formal)"` — en Portugal el trato formal es **"o senhor / a senhora"** o la 3ª persona sin pronombre; el "você" explícito puede sonar brusco o descortés. Nota recomendada: "formal: o senhor/a senhora; 'você' explícito puede resultar rudo en PT-PT".

### I5. Glosario "pegar": falta "apanhar" para PT-PT
- `"pt": "pegar/agarrar"` y ejemplo "Vou pegar o ônibus" — para transporte, en Portugal lo idiomático es **apanhar** ("apanhar o autocarro"); "pegar o ônibus" es BR (y *ônibus* es léxico BR). Añadir apanhar y un ejemplo PT.

### I6. Glosario "polvo": segundo ejemplo confuso
- "Tem muito polvo **na prateleira**." — parece calcado de "hay mucho polvo (ES) en la estantería", que en PT sería **pó**. Como ejemplo de *polvo*=pulpo es absurdo y refuerza la confusión que quiere evitar. Sustituir por "Comemos polvo à lagareiro."

### I7. Diagnóstico q07: "niño" → "ninho" es equivalencia falsa
- `q07b01`: "Qual é a forma portuguesa da palavra espanhola 'niño'?" respuesta "ninho" — como correspondencia gráfica ñ→nh vale, pero **ninho = nido**, no niño (= menino/criança). Tal como está redactada ("la forma portuguesa de la palabra") enseña un falso amigo como traducción. Reformular: "¿Qué grafía usa el portugués donde el español usa 'ñ'?" o usar un par real (banho/baño).

### I8. Diagnóstico q19: distractor también incorrecto según la norma
- "Qual frase está INCORRETA?" — la marcada es "Haverem muitos livros..." (bien), pero "**Tem** muitos livros na estante" también es incorrecta en la norma culta y en PT-PT (existencial *ter* es coloquial BR). Un alumno avanzado puede elegirla con razón. Sustituir el distractor.

### I9. Historia b1-s1 (PT): "toda a manhã" cambia el significado
- BR "toda manhã" (= cada mañana) fue "traducido" a PT como "**toda a manhã**" (= toda la mañana, duración). En PT-PT cada mañana = "**todas as manhãs**".

### I10. Historia b1-s1 (PT): brasileñismos sin adaptar en la variante europea
- "pão **francês**" (en Portugal: carcaça/papo-seco) y "bolo de **fubá**" (fubá es léxico BR; en PT: farinha de milho) permanecen en el texto PT. Además el texto PT no usa artículo ante nombres propios ("João abre...", "ensina a Lúcia" sí lo hace) — inconsistente con b8-s1 que sí lo hace sistemáticamente ("o Lucas, a Ana").

### I11. Historia b8-s1 (PT): "tanto... quanto" sin adaptar
- Variante PT: "tanto os livros **quanto** as viagens" — en PT-PT lo natural es "tanto... **como**". (El resto de la adaptación PT de esta historia está muy bien: ênclise, artículos, "acharam piada".)

### I12. Lección b3-l1: el Tip contradice la tabla y confunde personas
- `mdx/b3/l1-presente-regular.mdx`: "la segunda y tercera personas del plural cambian: -ar → -am..." — la 2ª del plural que la misma lección acaba de enseñar es *vós falais* (-ais). Lo que quiere decir es "vocês/eles → -am". Además "La principal diferencia con el español es que las terminaciones se apartan más del infinitivo" es vago y dudoso (las desinencias PT/ES son casi paralelas).
- Vocabulario: "**satisfeito** — contento, **harto** (de comer)" — para un mexicano "harto" = fastidiado; mejor "satisfecho, lleno".

### I13. Lección b6-l1: "diferencia clave" que no muestra ninguna diferencia + categorías mal etiquetadas
- "hay diferencias clave: en portugués se dice 'é importante que ele venha' (venga), mientras que en español diríamos 'es importante que él venga'" — ambas frases son idénticas en estructura; no hay diferencia que ilustrar. Además clasifica "é importante que / é necessário que" como "emociones" y luego las repite como impersonales. Reescribir el párrafo contrastivo (p.ej. contraste real: ES "cuando llegue" subjuntivo vs PT "quando chegar" futuro do conjuntivo).

### I14. Lección b2-l1: "el español solo contrae 'a + el = al'"
- Olvida **del** (de + el), que el propio Tip cita después ("Si en español dices 'al' o 'del'..."). Corregir a "solo contrae al y del".

### I15. Alternativas de fill_blank que aceptan formas agramaticales
- `b2.json` `52c87804`: respuesta "à", `alternatives: ["a a"]` — acepta "Fui **a a** padaria". `df4b9ea9`: alt `"de o"` ("carro **de o** meu pai"). `0478585d`: respuesta "visitar nossos", alt `"nossos"` → aceptaría "Vamos **nossos** avós". `b5.json` `46224559`: alt "constituir" con apódosis condicional ("Se ela constituir família, precisaria..." — mismatch de tiempos). El validador no debería aceptar las formas sin contraer/agramaticales.

### I16. verb_preposition b1 `4dd2b7ab`: única respuesta la forma no normativa
- "Este café me lembra ___ avó do Brasil." marcada "da" — "X me lembra **a** avó" es la regencia normativa (lembrar algo a alguém); "me lembra **da**" es coloquial BR. Marcar solo "da" como correcta (con "a" como distractor) invierte la norma. Aceptar ambas o reformular con "lembrar-se de".

### I17. verb_preposition con artículo faltante en la respuesta marcada
- `b2.json` `8477dcc8`: "contribuir ___ bem-estar" marcada "com" — la colocación estándar es "contribuir **para o** bem-estar"; ni "com" ni "para" solos producen frase natural (falta el artículo). `b2.json` `b47ba1bc`: "lembrar ___ aquele dia" marcada "de" → "de aquele" sin la contracción obligatoria **daquele**. `b6.json` `d62089ce`: "pensava ___ início de tudo" marcada "em" → falta "no" (em + o). `b8.json` `34d81602`: "Achei muita graça ___ história" marcada "de" → sería "**da** história".

### I18. verb_preposition b5 `c80f3e0a`: dos opciones defendibles
- "se esforçar mais ___ realizar seus sonhos" marcada "em"; "para" (en las opciones) es al menos igual de correcta y más natural ("esforçar-se para/por"). Ambigua.

### I19. verb_preposition b7 `ee77cd22`: "já tenho feito" no significa "ya lo hice"
- "— Sim, já tenho ___ feito." con respuesta "que / —" produce "já tenho feito", que en PT es perfecto iterativo ("últimamente he estado haciendo"), no "ya lo hice" (= "já o fiz"). Diálogo confuso.

### I20. Flashcards b6 con front == back (no enseñan nada)
- `b6.json` ids `01c91268` ("formulário (substantivo)" → "formulário"), `419a2f15` ("vaga" → "vaga"), `c3039dc6` ("início" → "início") — el anverso debería estar en español ("formulario", "vacante/plaza", "inicio").

### I21. flashcard b8 `4b22579b`: regla inventada
- "levanto-me — ênclise **tras palabra monosilábica tónica**" — la razón real es que no hay palabra atractora (inicio de cláusula → ênclise en la norma / PT-PT). La "regla" citada no existe.

### I22. flashcard b7 `d3d578cf`: etiqueta gramatical equivocada
- "Traduce: '¿Dónde nos encontraremos?' (**usando gerúndio**)" → "Onde **vamos nos encontrar**?" — eso es ir + infinitivo, no gerundio.

### I23. fill_blank b10 `04452b00`: verbo semánticamente equivocado
- "As duas variantes do português ___ em muitos aspetos." respuesta "correspondem-se" — *corresponder-se* = cartearse; querría decir "**diferem**" (o "divergem"). Además "aspetos" es grafía PT-PT en el data base que debería ser BR ("aspectos").

### I24. translation b4 `025206ca`: target solo idiomático sin alternativa literal
- "Ellos resolvieron todo sin problemas." → único target "Eles **tiraram tudo de letra**."; sin `acceptedAlternatives`. "Eles resolveram tudo sem problemas" sería rechazada. Añadir la literal.

### I25. translation b8 `2954b8b7`: grafías PT-PT en el data base (que es BR)
- "...quem vai levar o **prémio** para o país... deixa toda a **equipa** frustrada" — en BR: **prêmio**, **equipe**. El base data es la variante BR según `lib/exercise-resolver.ts`; estas formas deberían ir en el override PT.

### I26. vocab-catalog: "banca" → ptWord "bancada" es equivalencia falsa
- `vocab-catalog.json`: `{"word": "banca", "ptWord": "bancada", "meaning": "puesto de venta en mercado"}` — *bancada* = mesada/banco de trabajo (o bancada parlamentaria), no puesto de mercado; en PT-PT el puesto de mercado también es **banca**.

### I27. listening b3 `08c44363`: frase antinatural con "presentemente"
- "Eu vou ao médico **presentemente**." — *presentemente* (= actualmente) no combina con "vou ao médico" puntual; ningún hablante lo diría. Usar "Atualmente faço tratamento..." o "Agora vou ao médico".

### I28. fill_blank b6 `9d4f7d44`: respuesta marcada con mismatch temporal
- "Se nós ___ ao filme, certamente nos ___." marcada blank1 "tivéssemos ido" + blank2 "divertiríamos" — con antecedente compuesto pasado, la apódosis natural es "**teríamos** divertido" (que está relegada a alternativa). Además "ir **ao filme**" es calco; en PT se va "ao cinema".

---

## MENOR — estilo, erratas, pulido

1. **glossary.json "ficar"**: nota "NO es 'ficar' (sin traducción directa)" — redacción circular; decir "no existe en español; ≈ quedarse".
2. **glossary.json "trem / comboio"**: etimología garbled "del inglés 'train' vía FR" — es del francés *train*; simplificar o quitar.
3. **glossary.json "chinelo"**: "chinela (ES-CL)" — marca dialectal dudosa e irrelevante para un usuario mexicano; basta "chancla (MX)".
4. **glossary.json "carta"**: la acepción PT más útil que falta es "carta de condução" (= licencia de manejo, PT-PT); "mapa" es marginal.
5. **diagnostic.json q02**: llama al til "acento gráfico"; técnicamente es un diacrítico nasal, no un acento (agudo/circunflejo/grave). El ejercicio funciona igual.
6. **blocks/b1.json `9f57a67b`** (verb_preposition): opción "em" duplicada (["em","de","em","—"]).
7. **blocks/b3.json lessons/b3.json** (`b3-l4` vocabKey): "razo" — errata por "razão".
8. **vocab-catalog.json "rumo"**: meaning "rumo, dirección" — el gloss español es **rumbo** ("rumo" no es español).
9. **vocab-catalog.json "jeito"→"jeitão"**: *jeitão* no es el equivalente PT-PT de *jeito* (jeito se usa en Portugal: "não há jeito"); el mapeo BR/PT aquí no aplica.
10. **stories/b8-s1** vocab: "conseguir" y "proteger" listados pero no aparecen en el texto de la historia.
11. **blocks/b7.json `03b92017`** (flashcard): respuesta "falar eu" con orden invertido; el ejemplo "Falar eu assim foi um erro" es rebuscado.
12. **blocks/b10.json `7b9b4b9e`** (translation): alternativa "Qué tal, João? Tudo bem?" mezcla ES y PT en la misma cadena.
13. **blocks/b7.json `cc7715be`** (error_correction): la corrección "A porta está aberta **desde manhã**" — lo idiomático es "desde **de** manhã" / "desde a manhã".
14. **blocks/b8.json `005da0b5`** (flashcard): ejemplo "logo **vais** ter boas notas" usa la forma de *tu* en el data base BR (BR: "você vai ter").
15. **blocks/b2.json `6bb2405f`** (translation, fuente PT): "**Uns** dos meus filhos moram na Europa" — antinatural; "Alguns dos meus filhos".
16. **blocks/b3.json `84b944b6`** (flashcard): "pronombre **oblícuo** (CD/CD de 3ª persona)" — errata por *oblíquo* y "CD/CD" debería ser "CD/reflexivo"; redacción confusa.
17. **blocks/b10.json `a9ce69b5`** (fill_blank): alternativas "pensar"/"ver" para "No meu ___" — "no meu pensar" es rarísimo y "no meu ver" no es la locución (es "a meu ver").

---

## Lo que SÍ está bien (verificado)

- **Marcas de variante del glosario y b10:** ônibus/autocarro, trem/comboio, metrô/metro, celular/telemóvel, geladeira/frigorífico, suco/sumo, sorvete/gelado, banheiro/casa de banho, cardápio/ementa, pequeno-almoço/café da manhã, estar a + inf / gerúndio — todas correctamente etiquetadas y sin cruces.
- **Diagnóstico:** 22 de 26 preguntas limpias, con niveles bien asignados y terminología PT correcta ("conjuntivo", "pretérito perfeito"); q24 (tivesse vs tiver) y q25 (próclise tras "não") son excelentes.
- **error_correction:** 59 de 60 correctos; muchos apuntan con precisión a interferencias ES→PT reales (tengo→tenho, voy→vou, "vou a falar"→"vou falar", entonces→então, embaraçada→grávida).
- **Conjugaciones:** las 64 formas revisadas son correctas (incl. trabalhámos como override PT-PT del perfeito — detalle fino y correcto); futuro do conjuntivo, infinitivo pessoal y participios irregulares impecables.
- **Historia b8-s1:** la adaptación PT-PT (artículos ante nombres, ênclise "levam-nos/Conta-me/meteu-se", "acharam piada") es de calidad, salvo I11.
