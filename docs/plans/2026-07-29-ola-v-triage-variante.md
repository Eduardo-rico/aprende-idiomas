# Ola V — triage por regla del corpus `unchecked`

**Estado: EJECUTADA CON RESULTADO MODIFICADO (2026-07-29). La
consagración por regla MURIÓ en la calibración; solo se aplicó la
cuarentena.**

## Resultado final

La auditoría de calibración (120 sellables al azar, TERCER lingüista
adversarial independiente, criterio precomprometido 0 ERROR / ≤3
AVISO) dio **19 ERROR y 15 AVISO** — la regla FALLA, y no por un pelo.
Lo que se le escapa a cualquier regla de superficie: regencias BR
(*dar para alguém*, *responder + OD*, *jogar bola*), posesivo sin
artículo sistemático, español crudo (*practicar*), portugués roto en
las dos normas (*embora festejas*, *quando caminhar* en pasado), lemas
inexistentes (*suspiar*), falsedades didácticas («história tem dois
acentos»), y léxico PT-PT (*equipa*) que por definición no es
«idéntico en ambas». **Una regla de superficie no valida lengua.**

Aplicado (2026-07-29):
- **Cuarentena por marcador inequívoco: +146** (você singular 100,
  gerundio con estar 13, garçom 8, vestibular 7…) — la muestra de este
  cubo SÍ pasó auditoría (1 falso positivo en 133, corregido en v2).
- **Cuarentena por auditoría: +19** (los ERROR citados con ID y motivo).
- **Consagración a `neutral`: CERO.** Los 934 candidatos-inertes
  quedan `unchecked`; el clasificador sirve para ORDENAR la cola
  humana (los con-riesgos primero), no para cancelarla.
- Corpus final: **1.661 unchecked · 266 needs-human · 110 divergent ·
  2 neutral** (de 1.826/101/110/2).

**El dato que nadie tenía**: ~16 % del cubo MÁS LIMPIO del corpus
(sin ningún marcador ni riesgo de superficie) está roto o es
divergente. Extrapolado: el problema del corpus no es de etiquetas de
variante — es de contenido generado mezclando las dos orillas (y algo
de español). La meta «unchecked <500 por regla» del plan maestro es
INALCANZABLE honestamente; el camino real es revisión
humana/adversarial por lotes o regeneración por regla con pipeline
revisado — decisión de Edu.

Lo que queda de valor permanente: el guard pasó de 17 a ~90
marcadores (léxico BR completo de dos revisiones convergentes, grafías
pre-2009, próclise generalizada, ênclise tras negación), escanea
`options`/`pairs` que antes eran invisibles, y distingue campos
didácticos y contrastes implícitos para no cuarentenar pedagogía.

---

**Historia: v2, calibrada antes de aplicar (2026-07-29).** La v1 de este
documento pasó por DOS lingüistas adversariales independientes y ambos
la vetaron con evidencia de corpus — cada uno simuló la regla sobre los
1.826 ítems reales. Veredicto conjunto: «no aplicar la v1 tal como está
escrita» (habría consagrado ≥25-40 brasileñismos). La v2 incorpora todo
lo convergente y lo verificado; los 21 ítems citados con ID por los
revisores se re-verificaron uno a uno contra la v2: ninguno se sella.

## Lo que la revisión cambió (v1 → v2)

| Hallazgo (quién) | Fix en v2 |
|---|---|
| El guard era CIEGO a `multiple_choice`/`matching` — campos inexistentes, 42 sellos vacuos (rev. 2) | `options`/`pairs` escaneados; sin texto escaneable → nunca se sella |
| Acusativo preverbal «Eles a conhecem bem» sellado (ambos) | patrón pronombre sujeto + o/a/os/as + verbo → retener |
| 2.ª persona de sujeto nulo «Vais poupar» sellada (rev. 2) | lista cerrada de ~38 formas 2sg A1-B1 → retener |
| Lista blanca nasal: >50% ruido — `-ência` y cultismos (paciência, ênclise, estômago, fêmea) son INVARIANTES (ambos) | clase abierta `-ência(s)` + cultismos + todos los compuestos de ter/vir (`\p{L}*[tv]êm$`), con ênclises despojadas |
| `precisar + infinitivo` sin *de*: 13 sellados, uno ENSEÑA la regla BR (rev. 1) | riesgo `precisar-sin-de`, excluyendo el impersonal europeo «é preciso + inf» |
| Español en campos PT sellado como «idéntico en ambas» (rev. 2) | cedazo `espanol` (ñ/¿¡/-ción/-dad/palabras función ES) → retener |
| Grafía europea pre-AO90 (directamente, óptimo) sellada — inválida en AMBAS normas (rev. 1) | riesgo `grafia-pre-ao90` → retener |
| `…ndo` retenía quando/mundo/segundo: 60% del cubo gerundio era ruido (rev. 2) | stoplist; el cubo del nativo queda en gerundios reales |
| `error_correction` cuarentenado por el error DIDÁCTICO de `sentence` (rev. 1) | campos didácticos (sentence de EC, options de MC, pairs) → retener, nunca cuarentena |
| «Em Portugal, o 'ônibus' chama-se 'autocarro'» cuarentenado (rev. 2) | exención por contraste implícito (el ítem trae el equivalente europeo) y por etiqueta `(BR)`/`(PT)` |
| Léxico BR faltante: vestibular, moletom, cardápio, todo mundo, sobrenome, mouse, carona, metrô, bebê, câncer… (ambos, listas convergentes) | ~45 marcadores ERROR y ~30 AVISO añadidos al guard PERMANENTE (`variant-guard.ts`) — benefician también a check-variant |
| Grafías BR pre-2009: trema, -ôo, -éia (rev. 1) | ERROR en el guard, cero falsos positivos posibles |
| Próclise inicial: lista de 7 verbos dejaba pasar «Me passa o sal» (rev. 2) | generalizada a me/te/lhe/lhes + verbo |
| Ênclise tras negación «não diga-me» — agramatical en ambas (rev. 2) | ERROR nuevo en el guard |
| Sello sin versión exacta (rev. 2) | `regla-inerte-v2 (2026-07-29)` |
| `neutral` del schema decía solo «verificado idéntico» (ambos, P6) | schema documenta las dos vías (nativo / regla) vía `variantVerificacion` |
| Consagrar sin medir la tasa de error «no es triage, es fe» (ambos) | muestra de calibración de 120 sellables auditada por un TERCER adversarial ANTES de aplicar; criterio: 0 ERROR y ≤3 AVISO, si no la regla vuelve a v3. El nativo real sigue debiendo su pasada: los sellados PERMANECEN en su cola, detrás de los unchecked |

Divergencias resueltas por criterio compartido («ERROR = en Portugal no
se usa; AVISO = ambigua o defendible»): `vestibular` ERROR (institución
inexistente en Portugal), `oi`/`legal`/`reais` AVISO (bifrontes),
`quatorze`/`a gente` AVISO (ambos revisores convergieron solos).

Dry-run v2: 1.826 unchecked → **146 needs-human · 934 neutral · 746
retenidos**. La meta <500 NO se alcanza y no se persigue: los dos
informes subieron el listón de lo retenible, y la meta cede ante la
honestidad (regla escrita del propio plan).

---

## Diseño original (v1, superado — se conserva por historia)

## El problema

2.039 ítems; `variantStatus`: 1.826 `unchecked`, 110 `divergent`,
101 `needs-human` (cuarentena), 2 `neutral`. El plan maestro manda:
triage POR REGLA, meta `unchecked` < 500, lo indecidible espera al
nativo. Nadie va a revisar 1.826 ítems a mano.

## La regla propuesta (v1)

Sobre los campos que llevan portugués (los mismos del gate
`variant-guard.ts`, que ya excluye glosas en español y los overrides
pt-br). Tres destinos:

1. **→ `needs-human`** (cuarentena, deja de servirse): el ítem tiene un
   marcador de SEVERIDAD ERROR de la lista cerrada (gerundio con estar,
   você singular, ônibus, celular, próclise en inicio absoluto, etc.).
   La base es demostrablemente no-europea o el ítem está roto.
   Dry-run: **133 ítems**.

2. **→ `neutral` con `variantVerificacion: 'regla-inerte-v1'`**: el
   texto portugués es VARIANTE-INERTE — no contiene NINGUNA de las
   clases donde PT-PT y PT-BR pueden divergir:
   - sin marcadores ni avisos de la lista cerrada;
   - sin léxico BR de la EXTENSIÓN propuesta (abajo);
   - sin clíticos (ni sueltos `me/te/se/lhe/lhes/nos/vos` ni
     sufijados `-o/-a/-lo/-la/-no/-na…`) — la colocação es la
     divergencia sintáctica central y una regla no la juzga;
   - sin 2.ª persona (`tu/teu/tua/contigo` y afines) — el tratamento
     diverge;
   - sin gerundios (cualquier `…ndo`) — aunque no lleve `estar`, un
     gerundio adverbial puede ser neutral pero preferimos retener;
   - sin `ê`/`ô` ante `m/n` (grafía BR: gênio, econômico, Antônio),
     con lista blanca para las formas europeas legítimas
     (têm, vêm, contêm, mantêm, detêm, obtêm, provêm, advêm).
   Nota honesta: `neutral` significa aquí «una regla determinista no
   encontró material divergente», NO «un nativo lo verificó». Por eso
   queda sellado con `variantVerificacion`, distinguible para siempre
   de una verificación humana. Dry-run: **1.168 − 16 = ~1.152 ítems**.

3. **→ se queda `unchecked`**: tiene material de riesgo (clíticos 363,
   gerundios 132, 2.ª persona 57, ê/ô+m/n 23, avisos 14) que la regla
   no puede juzgar. Espera al nativo. Dry-run: **~541 ítems**.

Resultado esperado: `unchecked` 1.826 → **~541**. La meta era <500;
si la revisión adversarial amplía la extensión léxica, el número de
retenidos puede subir un poco — la meta cede ante la honestidad.

## Extensión léxica propuesta (BR-only frecuente en contenido didáctico)

La lista cerrada actual no tiene: `suco→sumo`, `esporte→desporto`,
`planejar/planejamento→planear/planeamento`, `usuário→utilizador`,
`registro→registo`, `equipe→equipa`, `gol→golo`, `garçom→empregado (de
mesa)`, `caminhão→camião`, `aluguel→aluguer`,
`dezesseis/dezessete/dezenove→dezasseis/dezassete/dezanove`,
`quatorze→catorze` (aviso), `recepção→receção`, `torcida/torcedor→
adeptos/adepto`, `a gente` como sujeto (aviso: existe en PT pero su
frecuencia como sustituto de `nós` es marca BR), `que legal→fixe`.

Ya cazó 16 ítems que la v0 habría consagrado: garçom ×8, a gente ×4
(uno agramatical en ambas variantes: «A gente vamos ao cinema»),
registro ×3, equipe ×1. También apareció «Esse relatório aqui» —
deixis BR (PT: «este… aqui») que NO está en la regla.

## Preguntas concretas para los revisores

1. ¿Qué léxico BR frecuente en contenido didáctico A1-B1 falta en la
   extensión? (comida, transporte, casa, escuela, trabajo, números.)
2. ¿Qué clase de divergencia NO listada podría colarse en «inerte»?
   (¿deixis esse/este+aqui? ¿"em + gerundio"? ¿perífrasis? ¿"tem"
   existencial vs "há"? ¿preposiciones "na TV/à TV"?)
3. ¿La lista blanca nasal es correcta y completa? ¿Algún falso
   positivo/negativo de `[êô](?=[mn])`?
4. ¿Retener todo clítico es demasiado conservador? (`nos` es también
   contracción em+os, inerte; pero distinguirlos por regla es frágil.)
5. ¿`recepção→receção` como ERROR es correcto post-AO90 en Portugal?
   ¿Y `quatorze` como aviso?
6. ATACAD la premisa: ¿es defendible llamar `neutral` a lo que una
   regla no pudo distinguir, aunque quede sellado como `regla-inerte-v1`?
