# Lote 4 B2C2 (20 GJ + 6 MED) + lección b11-l2 «Regências que traem»

**Estado: REVISADO Y PUBLICADO (2026-07-30)** — 13 GJ en b8 + 7 en b11
(b2c2-gj-l4-01…20), 6 MED (b2c2-med-21…26), lección b11-l2 v2. Fuente de
verdad: los JSON. Primer lote producido y AUDITADO contra la skill
/lote-b2c2.

## Resultado de la revisión (2 informes independientes, contra la skill)

- **RETIRADOS (convergentes, Priberam en mano)**: «provar o casaco»
  (acepción 6 de provar: probarse ropa ES portugués — cabine de provas)
  y «foi suspendida» (participio abundante: 'tinha suspendido' es
  norma — mi explicación era el octavo absoluto falso). Sustituidos por
  el dativo posesivo («Lavei-me as mãos» → «Lavei as mãos») y el
  participio único de verdad («foi abrida» → «aberta», con los dobles
  reales en la explicación).
- **Repeticiones cazadas contra los JSON**: «a gente vamos» duplicaba
  UN ÍTEM PUBLICADO de b10 (3d979702 — mi grep solo barría ids b2c2-;
  regla nueva: el grep de virginidad barre TODO el corpus) y «Há-de»
  tenía la respuesta impresa en la explicación publicada de l3-03.
  Entraron «ótimo» (AO90, con el hedge facto/contacto) y «assistir AO
  jogo» (regência, alimenta b11-l2).
- **Cuarta reincidencia del pecado-de-memoria, cazada por ambos**: en
  «A Aia» al niño lo ESTRANGULAN («esganado») en la huida — mi modelo
  lo apuñalaba en la cuna. Y la «santa» de MED-21 estaba en los
  párrafos [0]-[1], fuera de mi recorte [2] — fuente ampliada a [0]-[2]
  (320 palabras). «Tocante» era lusismo: «conmovedora».
- **MED-25** (relay es→pt, «el mejor movimiento de diseño del lote»
  según ambos): rango bajado a 10-30 (mi modelo de 12 quedaba corto —
  la cicatriz del lote 3 en espejo), consigna en español + audience en
  portugués (formato de la casa).
- **La secuencia que juré virgen calcaba al lote 2** (6 posiciones
  idénticas de arranque, 14/20). Publicada la del revisor 2:
  MMBBMBMMBBMMBMBBMBMB — arranque MMB inédito, última M en 19.
- **Lección**: título corregido a portugués real («Regências que TRAEM»
  — 'traicionam' era un calco morfológico en una lección anti-calco),
  «com QUEM» para personas, herencia de la preposición bien enunciada,
  «acabar por» reformulado (la preposición no traiciona: el gerundio
  sí), «de que preciso» variado para no regalar el ítem 14 verbatim,
  «desenrasco-me» SE QUEDA con glosa «(coloquial)» (ambos).
- **Fugas cortadas**: el ítem de «estou farto» ya no menciona esperar
  por (regalaba el 19); la subida de clítico ya no explica el guion BR
  (regalaba el 17 y contenía una frase autocontradictoria).
- **Armado b11**: los 7 ítems de lección (2 de falsos amigos + 5 de
  regências) nacen EN b11 con su lessonId y en los exerciseRefs de sus
  lecciones — verify-content en verde.
- **Conflictos sin convergencia (queda el original, anotado)**: «Se faz
  favor + bica» (el 1 lo llamó de primera, el 2 relleno — «é capaz de»
  anotado para el lote 5); «registrar» vs «cadastrar» en la fuente BR
  de MED-23 (el 1 la validó auténtica).
- **Backlog descubierto por los revisores** (corpus viejo): flashcards
  d4e7089f y 2acce101 con próclise BR y una errata de opciones
  idénticas; 62b470e0 con «Nos vemos» — a la limpieza del corpus.
- Gates: cero hallazgos del guard en los 26, verify-content solo los 4
  preexistentes, modelos validados ANTES de escribir (regla nueva del
  publicador), suite 936/2.

---

## BORRADOR ORIGINAL (v1 pre-revisión, superado) Producido con la skill /lote-b2c2 (molde v4).
TODO redactado antes del round. Dieta: 6 MAL gramaticales, 2 léxicos
herméticos, 1 de uso, 1 ortográfico-normativo. Puntos verificados
contra los 86 publicados (b8/b10/b11 por grep). Secuencia propuesta:
B M B M M B M B B M M B M B B M M B B M (arranque BMB — ningún lote
previo; última M en 20… NO, en 20 hay M ✓; runs ≤2).

Para los revisores: las preguntas de siempre (verdicts inequívocos,
absolutos, repeticiones, fugas, fuentes contra JSON, modelos vs
rúbricas) + las notas del autor al final.

## Juicios (blockId 8 salvo los marcados b11; register neutro salvo nota)

1. BIEN «Eu vi-o ontem no mercado.»
   - expl: «El sujeto expreso ('eu') NO dispara próclise: la ênclise
     'vi-o' es la colocación normal. (El que aprendió que 'ela me
     disse' está mal a veces sobrecorrige creyendo que todo pronombre
     delante cambia el clítico — no.)»
   - lessonId b8-l3-colocacao-pronominal
2. MAL «Preocupo-me muito por ti.» → «Preocupo-me muito contigo.»
   - expl: «'Preocupar-se' rige COM en portugués: 'preocupo-me
     contigo/com isso'. El 'preocuparse por' del español no se
     traslada.» · register informal · address tu · lessonId b11-l2
3. BIEN «Vou ter contigo ao café às cinco.»
   - expl: «'Ir ter com alguém' (= reunirse con, ir a donde está) es
     idiomatismo europeo de primera necesidad. Suena imposible al
     hispanohablante — y es lo que dice todo Lisboa.» · register
     informal · address tu
4. MAL «A reunião foi suspendida até nova ordem.» → «A reunião foi
   suspensa até nova ordem.»
   - expl: «'Suspender' solo tiene participio fuerte: 'suspenso'.
     '*Suspendida' no existe en portugués — el '-ida' es arrastre del
     español ('suspendida').»
5. MAL «Os livros que preciso estão esgotados.» → «Os livros de que
   preciso estão esgotados.»
   - expl: «QUEÍSMO: la relativa hereda la regência — 'preciso DE
     livros' → 'os livros DE QUE preciso'. Comerse la preposición en la
     relativa es tan tentador en portugués como en español, y tan
     incorrecto en la norma culta de ambos.» · lessonId b11-l2
6. BIEN «Vou-lhe dizer a verdade hoje mesmo.»
   - expl: «La SUBIDA del clítico al auxiliar ('vou-lhe dizer') es tan
     correcta como 'vou dizer-lhe' en el europeo. Dos posiciones
     válidas — ninguna es la próclise brasileña 'vou lhe dizer' sin
     guion… que se escribe igual que una de las buenas: en la escritura
     el guion es la frontera.» (nota del autor: ¿este BIEN confunde más
     de lo que enseña? Decidid si se publica o se simplifica la expl.)
   - lessonId b8-l3-colocacao-pronominal
7. MAL «Ela ficou muito contenta com a notícia.» → «Ela ficou muito
   contente com a notícia.»
   - expl: «'Contente' es INVARIABLE: ele está contente, ela está
     contente. El femenino '*contenta' es morfología española.»
8. BIEN «Se faz favor, uma bica e um copo de água.»
   - expl: «'Se faz favor' es LA fórmula europea de cortesía (SFF en
     los letreros); 'bica' es el café solo lisboeta. Frase de manual de
     supervivencia en Lisboa.» · register neutro
9. BIEN «Estou farto de esperar pelo autocarro.»
   - expl: «'Estar farto de' (= estar harto de) funciona igual que en
     español — no todo lo parecido es calco. Y 'esperar POR algo' es la
     regência europea normal.»
10. MAL «O ano passado tirámos umas férias no taller do meu pai.» —
    (nota del autor: frase rara — mejor «Deixei o carro no taller.») →
    «Deixei o carro na oficina.»
    - expl: «El taller es la 'oficina' — el falso amigo al revés: aquí
      es tu palabra española la que no existe en portugués, y la
      portuguesa la que te parecía sospechosa.» · lessonId b11-l1 · b11
11. MAL «Compra uma botella de vinho para o jantar.» → «Compra uma
    garrafa de vinho para o jantar.»
    - expl: «'Botella' no es portugués: es 'garrafa'. (Y la 'garrafa'
      española grande… en portugués es 'garrafão'.)» · register
      informal · address tu · lessonId b11-l1 · b11
12. MAL «Há-de chegar cedo, como prometeu.» → «Há de chegar cedo, como
    prometeu.»
    - expl: «Desde el Acordo de 1990, 'hei de / há de' se escribe SIN
      guion. 'Há-de' es la grafía europea antigua — la verás en libros
      viejos, pero ya no se escribe.»
13. BIEN «Vemo-nos logo à saída do trabalho.»
    - expl: «'Vemo-nos' — el -s de 'vemos' cae ante el clítico 'nos':
      morfología enclítica europea de manual. 'Nos vemos' a la
      española/brasileña no es la norma de acá.»
14. MAL «Ele insistiu para que eu provasse o casaco novo.» —
    (nota del autor: quería testear 'provar roupa'; ¿mejor estímulo
    simple?) → propuesta: MAL «Vou provar este casaco antes de o
    comprar.» → «Vou experimentar este casaco antes de o comprar.»
    - expl: «La ropa no se 'prova': se EXPERIMENTA ('experimentar o
      casaco'). 'Provar' es catar comida o demostrar. El 'probarse
      ropa' del español no se traslada.»
15. BIEN «Ele insistiu em que eu ficasse para jantar.»
    - expl: «'Insistir EM' — la regência coincide con el 'insistir en'
      español. Correcta tal cual, conjuntivo incluido.»
16. MAL «A gente vamos ao cinema logo à noite.» → «A gente vai ao
    cinema logo à noite.»
    - expl: «'A gente' concuerda en TERCERA persona singular: 'a gente
      vai'. El plural '*a gente vamos' es agramatical en las dos
      normas — hipercaracterización coloquial que la escuela corrige a
      ambos lados del Atlántico.»
17. MAL «Eles têm se encontrado com frequência.» → «Eles têm-se
    encontrado com frequência.»
    - expl: «En los tiempos compuestos europeos el clítico va ENCLÍTICO
      al auxiliar: 'têm-se encontrado'. El 'têm se encontrado' suelto
      es la colocación brasileña.» · lessonId b8-l3-colocacao-pronominal
18. BIEN «Disse-lhe para vir mais cedo amanhã.»
    - expl: «'Dizer (a alguém) para + infinitivo' es la manera europea
      normal de reportar una orden: 'disse-lhe para vir'. Nada que
      corregir.»
19. BIEN «Esperei por ti mais de uma hora à porta do cinema.»
    - expl: «'Esperar POR alguém' es la regência europea corriente
      (también existe 'esperei-te'). El POR no es anglicismo ni error —
      es de casa.» · register informal · address tu · lessonId b11-l2
20. MAL «Quando dei por ela, já era meia-noite.» — (nota del autor:
    ¡'dar por' es BIEN, lo puse en la columna mal por error de armado!
    Corregido: es BIEN.)
    - BIEN «Quando dei por ela, já era meia-noite.»
    - expl: «'Dar por' (= darse cuenta, reparar en) es idiomatismo
      europeo finísimo: 'nem dei por isso'. Al hispanohablante le suena
      a 'dar por (sentado)' y desconfía — sin motivo.» · lessonId
      b11-l2

(nota del autor sobre la secuencia: con el 20 como BIEN, la última MAL
queda en 17 — la skill pide última M en 19-20. Propongo intercambiar
19↔17 en el orden final: …16 M, 17 B(esperei), 18 B, 19 M(têm-se),
20 B(dei por)… así la última M queda en 19. Validad el orden final:
B M B M M B M B B M M M B M B M B B M B — runs ≤3, arranque BMB.)

## Mediaciones (blockId 10)

- **MED-21 · summarise · pt→es** — fuente: no-moinho, parrafos[2]
  ÍNTEGRO por script (el retrato de Maria da Piedade: la belleza
  delicada, la casa azul, la santa del pueblo). Consigna: «Resume EN
  ESPAÑOL cómo presenta Eça a Maria da Piedade: qué ve el pueblo en
  ella y dónde/cómo vive.» wordRange 30–60. Rúbrica: «La ven como una
  santa / un encanto del pueblo» · «El retrato físico esencial (rubia,
  delicada) sin inventario exhaustivo» · «La casa azul al final del
  camino» · «No inventa nada» · «Rango». Modelo: «Eça la presenta como
  la santa del pueblo: una mujer rubia y delicada, de belleza tocante,
  que vive en una casa azul al final del camino y a la que la gente
  admira al pasar, siempre curvada sobre su costura tras la ventana.»
- **MED-22 · explain_concept · pt→es** — fuente: quadra «Lisboa às
  sete» (anedotas-e-quadras-b1-1, última pieza, por script): «Lisboa às
  sete da tarde / é uma laranja madura: / o rio guarda a luz toda / e
  devolve-a com doçura.» Consigna: «Explícale EN ESPAÑOL la imagen: por
  qué Lisboa es una naranja madura y qué hace el río con la luz.»
  wordRange 30–55. Rúbrica: «La luz del atardecer tiñe la ciudad de
  naranja (por eso 'madura')» · «El río refleja/devuelve esa luz» ·
  «Interpreta, no traduce» · «Rango». Modelo: «Al caer la tarde, la luz
  pone a Lisboa entera de color naranja — por eso la quadra la llama
  fruta madura, a punto. Y el Tajo hace de espejo: guarda toda esa luz
  y la devuelve suavizada, como si endulzara la ciudad desde abajo.»
- **MED-23 · cross_variety · BR→PT (instrucciones)** — fuente BR
  (original, atacadla): «Aperte o botão vermelho e aguarde. Não esqueça
  de registrar sua senha no aplicativo antes de usar.» Consigna:
  «Reescribe las instrucciones EN PORTUGUÉS EUROPEO.» wordRange 12–30.
  Rúbrica: «carregar (no 'apertar') el botón» · «registar (no
  'registrar'), aplicação (no 'aplicativo')» · «reflexivo y posesivo
  europeos: 'não SE esqueça de registar A SUA…'» · «Misma información,
  rango». Modelo: «Carregue no botão vermelho e aguarde. Não se esqueça
  de registar a sua palavra-passe na aplicação antes de usar.»
  (nota del autor: ¿'senha' debe corregirse a 'palavra-passe' o es
  válida en PT? Decidid — si es válida, sale de la rúbrica.)
- **MED-24 · reformulate_register · pt→pt (recado oral → nota
  profesional)** — fuente (original): «Ó Rita, olha, afinal não consigo
  ir buscar-te ao aeroporto. Desenrasca-te de táxi, sim? Desculpa lá!»
  Consigna: «Convierte el recado en una nota NEUTRA-PROFESIONAL de
  colega (sin tuteo, sin desenrascar): mismo aviso y disculpa.»
  wordRange 15–40. Rúbrica: «Sin tu/olha/desenrasca-te» · «Misma info:
  no puede ir al aeropuerto, que tome taxi, disculpa» · «Tono neutro,
  no servil» · «Rango». Modelo: «Rita, afinal não vou conseguir ir
  buscá-la ao aeroporto. Peço desculpa pelo transtorno — o mais prático
  será apanhar um táxi.» (nota del autor: ¿'buscá-la' o 'ir buscá-la'
  con 'a Rita' en 3.ª? ¿O mejor sin clítico: 'não vou conseguir fazer a
  recolha'? Decidid la forma más natural.)
- **MED-25 · relay · es→pt (¡dirección nueva: el producto es
  PORTUGUÉS!)** — fuente ES (original): «— Doctor, tengo una memoria
  malísima. — ¿Desde cuándo? — ¿Desde cuándo qué?» Consigna (en
  portugués, lengua del producto): «Conta esta anedota EM PORTUGUÊS a
  um amigo de Lisboa — curta e com o remate no fim.» wordRange 15–35.
  Rúbrica: «Tratamento português del médico ('senhor doutor')» · «El
  remate es la última línea» · «Portugués europeo natural (sin calcos
  del original)» · «Rango». Modelo: «— Senhor doutor, tenho uma memória
  péssima. — Desde quando? — Desde quando o quê?»
- **MED-26 · summarise · pt→es (cuento COMPLETO)** — fuente: a-aia
  ÍNTEGRA por script (1.830 palabras — techo 70 palabras ≪ 70%).
  Consigna: «Resume EN ESPAÑOL el cuento entero: la situación, lo que
  hace la aia y el final.» wordRange 40–70. Rúbrica: «El rey muere y el
  hermano bastardo ataca de noche para matar al príncipe niño» · «La
  aia cambia a los niños de cuna: el usurpador mata a SU hijo (el de la
  aia)» · «El reino se salva; la aia se clava el puñal» · «No inventa
  nada» · «Rango». Modelo: «Un rey muere en la guerra y su hermano
  bastardo asalta el palacio de noche para matar al príncipe heredero,
  aún bebé. La aia, que cría a los dos niños, los cambia de cuna: el
  usurpador apuñala al que cree príncipe — y era el hijo de la aia. El
  reino se salva, la recompensan… y ella se clava el puñal.» (nota del
  autor: verificad CADA hecho contra a-aia.json — la skill lo exige y
  este resumen lo escribí leyendo el cuento hoy, pero validadlo.)

## Lección b11-l2 «Regências que traicionam» (C1) — MDX borrador

<Rule title="Regências: donde tu preposición española te vende">La regência es el terreno donde el español correcto produce portugués roto sin sonar roto. Las traidoras de alta frecuencia: enamorarse DE es apaixonar-se POR; parecerse A es parecer-se COM; preocuparse POR es preocupar-se COM; soñar CON alguien es sonhar COM (esa coincide — no todas traicionan); esperar admite esperar POR ('esperei por ti'); darse cuenta es dar POR ('nem dei por isso') o aperceber-se DE; acabar POR + infinitivo es 'terminar por'; y precisar exige DE ('preciso de ajuda'). La trampa culta: la relativa HEREDA la regência — 'os livros DE QUE preciso', 'a pessoa COM QUE sonhei' — comerse la preposición ahí (queísmo) delata más que cualquier acento. Regla operativa C1: al aprender un verbo nuevo, aprende su preposición EN LA MISMA ficha; y al armar una relativa, pregúntate qué preposición pedía el verbo antes de esconderse.</Rule>

### Vocabulário

- **apaixonar-se por** — enamorarse de
- **parecer-se com** — parecerse a
- **preocupar-se com** — preocuparse por
- **esperar (por)** — esperar (a alguien)
- **dar por** — darse cuenta de, reparar en
- **acabar por** — terminar por, acabar + gerundio
- **de que / com que (relativas)** — cuya preposición hereda el verbo

<Example index={0} pt="Apaixonei-me por Lisboa à primeira vista." es="Me enamoré de Lisboa a primera vista." />
<Example index={1} pt="Não te preocupes comigo: eu desenrasco-me." es="No te preocupes por mí: yo me las arreglo." />
<Example index={2} pt="Só dei pelo erro quando já era tarde." es="Solo me di cuenta del error cuando ya era tarde." />
<Example index={3} pt="É este o filme de que toda a gente fala." es="Esta es la película de la que habla todo el mundo." />

<Tip>Si dudas entre dos preposiciones, la española es la sospechosa. Y en las relativas, el 'de que' no es dequeísmo cuando el verbo lo rige: 'preciso DE' → 'de que preciso'.</Tip>

(nota del autor a los revisores: ¿'desenrasco-me' en el Example 1 es
apropiado para una lección — registra coloquial — o mejor 'eu
arranjo-me'? ¿'a pessoa com que sonhei' del Rule debería ser 'com quem'?
Corregidme esa antes de que la publique mal.)
