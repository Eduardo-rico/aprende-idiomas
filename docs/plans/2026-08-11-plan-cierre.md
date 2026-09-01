# Plan de cierre — terminar aprende-idiomas

**2026-08-11.** Este plan sustituye la sección de ejecución del plan
maestro (`2026-07-29-plan-maestro-c2.md`); las decisiones marco de aquel
siguen vigentes y no se reabren.

## Decisiones vigentes (no se preguntan de nuevo)

1. Techo **C2**, lectura **1,9M palabras** PT, **los 4 idiomas** con PT
   completo primero (2026-07-29).
2. Karaoke SOLO para la escalera graduada (~2-3 textos/mes); novelas
   como texto puro (2026-07-29).
3. **NUEVA (Edu, 2026-08-11): sin `interaccion` ni `produccion_oral`
   por ahora.** El eje MCER las seguirá mostrando a cero — eso es
   honesto y correcto, el test que lo vigila se queda. «Terminado» se
   define sobre las CUATRO destrezas restantes: comprensión lectora,
   comprensión oral, producción escrita y mediación.

## Definición de TERMINADO

**PT terminado** cuando, con cifras medidas:
- [ ] Lectura ≥ 1.900.000 palabras en el catálogo (hoy: 714.004).
- [ ] **COBERTURA, no total** (decisión de Edu, 2026-09-01): **≥12 ítems
      en cada uno de los 186 puntos del currículo**, ~3.900 ejercicios.
      **El total de 6.300 queda DEROGADO**: salía de una extrapolación por
      horas, y la partición de conceptos de E2#10 midió que sostenerlo
      pedía 788 conceptos (15,8× el inventario) o 126 ítems por concepto
      (2,4× la densidad real). Faltan **1.513**: 761 de C1+C2 y 578 de
      sub-puntos flacos de A2/B1/B2.
- [ ] **Mediación: composición, no bucket.** Las **230 TAREAS** siguen
      (183 hechas, 80 %). Los **ÍTEMS** de mediación salen como ~30 % de
      los 1.513, **no encima**: el bucket de 1.580 venía de la misma
      extrapolación por horas que queda derogada.
- [ ] Bloque 11 con sus ~6-8 lecciones y sus ítems.
- [ ] **Cero `unchecked` sin triaje** en el corpus (hoy: 1.799) y cero
      `needs-human`/`divergent` sin resolver (hoy: 266+110).
- [ ] Backlog de producción a cero (duplicados, b7-gerundio, med-20,
      flashcards viejos, MDX b8).
- [ ] Audio de ejercicios sin errores en `verify:content` (hoy: 4
      preexistentes) y escalera karaoke completa (ver E4).
- [ ] Suite verde, typecheck 0, los dos gates de virginidad en el ciclo.

**Proyecto terminado** cuando además: RO, CS y RU replicados al mismo
techo (fase F), en ese orden.

## Estado medido hoy

| eje | hoy | meta | % |
|---|---|---:|---:|
| lectura | 714.004 palabras · 224 lecturas | 1.900.000 | 38 |
| ejercicios totales | 2.177 | ~recuento E1-P0 | — |
| **mediación** | **32** | **~430** | **7** |
| producción escrita (anclada) | 808 | ~830 | 97* |
| comprensión lectora (anclada) | 1.158 | — | — |
| comprensión oral (anclada) | 179 | — | — |
| B2C2 publicado | 138 ítems | — | — |
| lecciones b11 | 2 | 6-8 | ~30 |
| corpus sin verificar | 1.799 unchecked + 376 marcados | 0 | — |

\* Los 808 anclan a todos los niveles.

## Paso 0 — EJECUTADO 2026-08-11 (el recuento que nadie hizo)

Reconciliación currículo (`2026-07-28-curriculos-completos.md` §Portugués)
contra corpus, por script. **Tres hallazgos que redimensionan el plan:**

**1. La cifra «~430 mediación» que se venía arrastrando era del RUSO**
(línea 1512 del doc de currículos). El PT pide **1.580 ejercicios de
mediación** (A2 200 · B1 280 · B2 400 · C1 400 · C2 300) más **230
tareas de mediación** dentro de las 830 de producción. Hay 32.

**2. El faltante real de ejercicios es 4.123**, no «~1.100 tareas»:

| nivel | hay | pide | motor-runtime* | meta corpus | falta |
|---|---:|---:|---:|---:|---:|
| A1 | 258 | 900 | 0 | 900 | 642 |
| A2 | 459 | 1.100 | 0 | 1.100 | 641 |
| B1 | 668 | 1.400 | 200 | 1.200 | 532 |
| B2 | 776 | 1.600 | 300 | 1.300 | 524 |
| C1 | 16 | 1.200 | 200 | 1.000 | 984 |
| C2 | 0 | 800 | 0 | 800 | 800 |
| **Σ** | **2.177** | **7.000** | **700** | **6.300** | **4.123** |

\* «motor-runtime» = desfosilización dirigida: el currículo la define
sobre «los errores REALES del alumno» — no es corpus pre-producible, es
un motor que se construye una vez. Excluirla del target no es recorte,
es lectura correcta. (Mapeo nivel-por-bloque de anchor.ts, grueso y
declarado: los ~57 de mesóclise de b8 cuentan como B2 aquí.)

**3. Las 830 tareas de producción, con la decisión sin-oral aplicada:**
escritas ~310 (+la parte de A1) · **orales 230 → EXCLUIDAS** ·
mediación-tareas 230 (hay 32).

**Cantera clave**: las 288 translations pt→es se pueden ASCENDER a
mediación relay real añadiéndoles destinatario+propósito+rúbrica — el
plan maestro §8.6 vetó reetiquetarlas sin eso, pero el upgrade sí es
legítimo y cubre ~⅕ del faltante de mediación a costo mecánico.

---

# FASE E — cerrar PT

Cinco olas. E2 y E3 corren **intercaladas** (una sesión de lotes, una de
lectura); E4 es cadencia mensual; E1 y E5 son sesiones sueltas.

## E1 · Medición y limpieza de producción (1 sesión)

**Paso 0 — el recuento que nadie hizo**: qué exige el currículo por
nivel y destreza contra lo que el corpus tiene, ítem por ítem, por
script. Salida: la tabla real de «falta X de Y» que gobierna E2. La
cifra ~430 de mediación se confirma o corrige aquí.

**Limpieza con ids concretos** (todo ya diagnosticado):
- Duplicados B2C2↔corpus viejo: `b2c2-gj-01` (1,0 contra `b5/823a95c9`),
  `gj-l3-01`, `gj-l4-12`, `gj-l2-19`↔`gj-l3-12`. Criterio: se cambia el
  ítem B2C2 (el viejo tiene lessonId y FSRS history a su favor).
- `b6/e9764a9c` («nos encontraremos» — clítico abriendo oración).
- **`b7-gerundio` 9-a-1 pro-brasileño**: reequilibrar con ~15 ítems de
  «estar a + infinitivo» europeos nuevos (pasados por el gate) y
  re-glosar los existentes que vendan el gerundio como neutro.
- `b2c2-med-20` («V» colado), flashcards `d4e7089f`/`2acce101`/
  `62b470e0`, MDX b8 «continuou trabalhando».
- Audio: **HECHO 2026-08-11, con ElevenLabs** (decisión final de Edu:
  «no quiero minimax quiero elevenlabs» — la cuenta MiniMax se secó a
  mitad de la primera corrida y no se recarga). Resultado:
  `check-audio-stale` → **«Todo el audio corresponde a su texto
  actual»** y `verify:content` → **0 errores, por primera vez**. Se
  sintetizaron ~224 clips (~14k créditos; la deriva acumulada desde
  junio, no 15) con Leonor, la narradora aprobada. Los clips de
  variante br llevan voz `ElevenLabs_Leonor_brInterino`: la cuenta no
  tiene voz brasileña — cuando Edu apruebe una a oído, regenerarlos es
  un comando. De paso cayeron CINCO bugs de infraestructura: locks
  fósiles silenciosos (el generador llevaba muerto desde el 22-jun),
  mapeo de variante invertido (dos eras de archivos: 5.451 MP3 para
  ~2.576 refs), attach con claves legacy («audio attached: 0» — los
  refs jamás se escribían), MiniMax 1008 sin fail-fast, y el checker
  ciego a ElevenLabs. Pendiente menor: gc de MP3 huérfanos (~2,5k
  archivos de la era no referenciada) — se hace cuando el estado lleve
  unas sesiones estable, no el mismo día.

## Paso 0 — RE-EJECUTADO 2026-08-30 (E2#8), ahora por script repetible

`npx tsx scripts/recuento-paso0.ts` — el cálculo que en E1 se hizo a
mano y por eso no se podía repetir. Salida pegada:

```
| nivel |    hay |   pide | motor* |   meta |  falta |    %   |
|-------|--------|--------|--------|--------|--------|--------|
| A1    |    258 |    900 |      0 |    900 |    642 |    29% |
| A2    |    459 |   1100 |      0 |   1100 |    641 |    42% |
| B1    |    775 |   1400 |    200 |   1200 |    425 |    65% |
| B2    |    807 |   1600 |    300 |   1300 |    493 |    62% |
| C1    |     40 |   1200 |    200 |   1000 |    960 |     4% |
| C2    |      0 |    800 |      0 |    800 |    800 |     0% |
| Σ     |   2339 |   7000 |    700 |   6300 |   3961 |    37% |

Mediación:
  mediación-TAREAS   139 / 230   (60 %)   ← va bien
  mediación-ÍTEMS      0 / 1350  ( 0 %)   ← el bucket grande, intacto
  total mediación    139 / 1580  ( 9 %)
```

**Burn-down real contra E1** (2026-08-11 → 2026-08-30, siete sesiones
E2): el corpus pasó de 2.177 a **2.339** ejercicios. Son **162 en
siete sesiones**, ~23 por sesión — y eso incluye la sesión de hoy, que
con 65 (21 artesanales + 44 industriales) es la más productiva de la
serie. El faltante son **3.961**.

**El hallazgo que cambia la decisión, y que la línea industrial no
estaba atacando**: de los 3.961 que faltan, **1.350 son
mediación-ÍTEM** — el 34 % del total — y están a CERO. Los avisos que
produce la línea B son mediación-TAREA (rúbrica de 4-5 casillas,
respuesta libre de 25-65 palabras): por eso el bucket de tareas va al
60 % y el de ítems no se ha movido nunca. Son productos distintos: el
ítem de mediación del currículo es corto y de respuesta acotada
(relay de una frase, fidelidad de contenido, cloze de mediación), y
cuesta una fracción de lo que cuesta una tarea.

**Las tres palancas, con su aritmética** (para decisión de Edu, no
del ejecutor):
1. **Generalizar la línea industrial a familias de ÍTEM**, no sólo de
   tarea: una plantilla por tipo (cloze de mediación, fidelidad de
   contenido, relay corto). Es lo que ataca los 1.350 y lo que más
   mueve la aguja; el protocolo (matriz, rúbrica derivada, muestreo
   con freno, gate de molde) ya está probado y se hereda entero.
2. **Subir el tamaño de lote — MEDIDO Y DESACONSEJADO.** Se probó hoy y
   salió mal. Las tres tandas industriales, con su tasa de error medida
   por revisión completa a mano:

   | lote | tamaño | muestreo | freno | error real |
   |---|---:|---|---|---:|
   | industrial 1 | 24 | 1/3 | SÍ | **4/24 = 17 %** |
   | industrial 2 | 24 | 0/3 | no | *sin medir* (publicó sin revisión completa) |
   | industrial 3 | **44** | 2/5 | SÍ | **20/44 = 45 %** |

   Casi triplicar la tasa de error al pasar de 24 a 44 borra la ventaja:
   el lote grande costó una revisión completa a mano de 44 ítems más una
   ronda de verificación, que es más trabajo humano que dos lotes de 24.
   La clase dominante del lote 3 **no fue de lengua sino de trasvase
   rúbrica↔gold** (la casilla nombra un dato que el gold no dice): 12 de
   los 20 errores. Es el fallo típico de producir en masa — la rúbrica y
   la respuesta modelo se separan cuando se escriben 44 a la vez.

   Aviso metodológico: el tamaño va confundido con dos cambios más
   (3 géneros nuevos y 2 modificadores nuevos). Pero los modificadores
   quedan absueltos por medición — `contradictorio` y `parcial` pasaron
   limpios el muestreo y la revisión —, así que el tamaño es el
   sospechoso que queda.

   **Contrapeso, también medido**: la calidad de lo YA PUBLICADO aguanta.
   Sobre las 56 mediaciones industriales en producción, 0 de 15 traducen
   mal «até» (la clase que frenó el lote 1: todas dicen «hasta» y cuatro
   explicitan «incluido»), y del barrido de anclas rúbrica↔gold salieron
   11 sospechosas de las que, triadas 5, **4 eran falsos positivos** del
   propio barrido y 1 real y menor (`b2c2-med-125` pide «sábado 28» y el
   gold dice sólo «el sábado»). El 45 % es del lote 3, no de la línea.
3. **Recortar la meta**. Los 6.300 salen del currículo que fijó Edu, no
   de una ley externa: C2 (800, a cero) y la mitad de C1 (960) son
   dos tercios del faltante de los niveles altos, y son justamente los
   que menos alumno tienen delante.

## E2 · Corpus a escala — DOS líneas de producción (~18-22 sesiones)

El Paso 0 obliga a partir E2 en dos líneas con economías distintas:

**Línea A — artesanal (el ciclo /lote-b2c2):** las ~200 tareas de
mediación restantes (de 230; van 32) + los juicios C1 + las lecciones
b11. Lotes de **12 MED-tarea + 10 GJ**, ~2 lotes/sesión → **~7-8
sesiones**. Doble adversarial completo, como hasta ahora.

**Línea B — industrial (el pipeline tipo Ola L):** los ~4.100 ejercicios
faltantes, que son ítems (no tareas): los **1.580** de mediación-ítem
(relay corto, fidelidad de contenido, cloze de mediación), precisión
léxica, registro, inferencia, y el A1-B2 faltante. Método: plantilla por
familia → piloto con doble adversarial → generación por lote con gates
(virginidad 2 ejes + variant + registro) → **muestreo adversarial del
10 % con freno** (la misma regla que los unchecked). Arranque: el
upgrade de las 288 translations pt→es a relay. Throughput estimado
~300-400 ítems/sesión una vez pilotada cada familia → **~11-14
sesiones**. La reconversión del corpus viejo (~1.100 reescritura
mecánica + ~450 a mano, según el destino bloque-por-bloque del
currículo) se integra aquí.

**C2 depende de E3**: sus fuentes (prensa, crónica, ensayo, ironía) no
existen en el catálogo — las tranches de E3 deben incluir crónica/ensayo
(As Farpas de Ramalho, Fialho) además de novela.

Cada sesión E2 lleva además:
- **1 lección b11 cada 2 sesiones** (hasta 6-8; los conceptos nuevos
  `b11-morfologia-enganosa` y `b11-aspecto-tempo` ya existen y tienen
  ítems esperando lección).
- **Una cola de ~100 `unchecked`** del corpus viejo por el triage v2 +
  muestreo adversarial del 10 % con freno (>2 % de error en la muestra ⇒
  revisión completa de esa cola) — CERRADO por Edu 2026-08-11. Así los
  1.799 se agotan dentro de las sesiones E2 sin ola propia.
- Los 266 `needs-human` van aparte en 4 tandas de ~65 con doble
  adversarial (son los que el clasificador ya declaró no poder decidir).
  Los 110 `divergent` se regeneran mecánicamente (tienen forma europea
  conocida).

Reglas: todo por `/lote-b2c2` (18 reglas), los DOS ejes del gate antes
de gastar revisor, `concepts` declarado en cada ítem nuevo. Variar
taskType×fuente en MED (relay no-chiste, synthesise_sources ya
estrenado, cross_variety con léxico no repetido). Anotado del lote 5:
«A diferença entre mim e ti é essa» como BIEN; arranques quemados
MBM/BMM/BMB/MBB/MMB/BBM; secuencia con `|solape−10| ≤ 4` contra CADA
lote.

*Mediación se corrige por autoevaluación contra rúbrica (v1 declarada).
Juez LLM: DIFERIDO a post-E5 (Edu, 2026-08-11).*

## E3 · Lectura a 1,9M (~5 sesiones, intercaladas con E2)

Faltan **1.186.000 palabras** → 5 tranches de ~240k. Pipeline completo
ya existe (`scripts/lectura/`); cada tranche es: elegir obras → curl
Gutenberg → gate de procedencia probado en rojo → segmentar → publicar
texto-puro → engordar diccionario (backlog de deflexión de la Ola L).

Cantera PT-PT dominio público (autor †<1956, verificar cada uno):
- **Eça** restante: O Primo Basílio, A Relíquia, A Ilustre Casa de
  Ramires, O Mandarim, A Correspondência de Fradique Mendes (†1900)
- **Camilo**: A Queda dum Anjo, Novelas do Minho, Eusébio Macário (†1890)
- **Júlio Dinis**: As Pupilas do Senhor Reitor, A Morgadinha (†1871)
- **Almeida Garrett** restante, **Herculano** (Eurico, Lendas e
  Narrativas), **Fialho de Almeida** (O País das Uvas), **Trindade
  Coelho** (Os Meus Amores), **Cesário Verde** y **Antero** (poesía)
- **Pessoa vía Orpheu**: multiautor — gate por autor (Almada †1970 NO
  entra; Sá-Carneiro †1916 sí; Pessoa †1935 sí)
- **Estante BR (pedido de Edu 2026-08-12, etiquetado `pt-br`)**:
  **Machado de Assis** (†1908, dominio público) — Papéis Avulsos con «O
  Alienista» (Gutenberg #57001), y de ahí Dom Casmurro / Memórias
  Póstumas si se quiere más. Entra marcado `pt-br`: NO cuenta para las
  1,9M de inmersión PT-PT, y sirve además de fuente auténtica para las
  mediaciones `cross_variety`. Los otros 8 autores pedidos NO tienen
  fuente legal de dominio público (Lispector †1977, Guimarães Rosa
  †1967, Fonseca †2020, Fagundes Telles †2022, Sophia de Mello †2004,
  Abelaira †2003, Mário de Carvalho y Almeida Faria vivos): sólo entran
  si Edu aporta sus propias copias (uso personal), vía carpeta de
  ingesta con `licencia: 'copia personal'`.

Reglas pagadas que aplican: normalizar CRLF, quitar `_itálicas_`,
`parrafos[0]` puede ser numeral, fornada 3 de chistes/quadras con doble
adversarial si alcanza.

## E4 · Escalera karaoke — ✅ CERRADA 2026-08-28 (129aadb)

**14/14 textos, de una vez** (decisión de Edu al renovarse la cuota:
«tranche de karaoke E4 para ya terminar»): a los 3 de la Ola L se
sumaron 11 — anedotas a2-1/a2-2/b1-1 (A2-B1, vía original del gate),
João Pateta, Carlos Magno e o Abade, O Rabequista (Junqueiro B1-B2),
O Suave Milagre, Frei Genebro, No Moinho (Eça B2), Um Poeta Lírico
(Eça C1) y Viagens na Minha Terra cap. I (Garrett C1). Medido: 336
párrafos-MP3 · 127,0 min · 102.297 chars · 56.019 créditos de 174.357
(ratio 0,55 confirmado); quedan 118.338 este mes. Herramienta nueva:
`scripts/lectura/karaoke-desde-catalogo.mjs` (upgrade in place de una
lectura publicada, gate de procedencia con las dos vías). El plan
original (2-3/mes × ~4-5 meses) quedó obsoleto por presupuesto real.

## E5 · Gate de cierre PT (1 sesión)

Recorrer la checklist de TERMINADO con cifras medidas y comandos
adjuntos; `next build`; smoke E2E; doc de cierre en `docs/plans/`;
actualizar memoria. Si algo no pasa, no se declara — se lista y se
vuelve.

**Total PT: ~26-30 sesiones de trabajo** (18-22 E2 ∥ 5 E3 + E1 + E5),
más la cadencia E4. (Subió de ~20-24: el Paso 0 encontró que la meta de
mediación era 3,7× la que se creía y que faltan 4.123 ejercicios, no
~1.100 — a cambio, 700 «ejercicios» del currículo son un motor de
runtime que no se produce como corpus, y 230 tareas orales quedan fuera
por decisión.)

---

# FASE F — RO → CS → RU (post-PT, orden fijo)

Por idioma, el método ya validado (plan maestro §RO/CS/RU-1):

| hito | contenido | gate |
|---|---|---|
| F.1 motor | morphRules por regla (spec RO es la plantilla) validado contra UD/Hunspell | **en rojo** con formas falsas conocidas (*draji*, *fete/fată*) |
| F.2 bloques | A1-A2 por regla + léxico curado | lingüista adversarial de la lengua ANTES de publicar |
| F.3 serie | 10 episodios A1, narradora propia, mundo del país (NO traducir AO BALCÃO) | piloto `SOLO=` antes del lote; voces **a oído por Edu** |
| F.4 lectura | su Ola L (RO 1,7M · CS 1,0M · RU ~1,9M) | gate de procedencia por obra |
| F.5 B2C2 | réplica del ciclo `/lote-b2c2` con su lingüista y su biblioteca | los dos ejes del gate + doble adversarial |

Presupuesto de voces: se mide en el piloto de cada idioma antes de
comprometer nada (T1 de PT costó ~25k créditos). RU va último porque es
el más caro y hereda todas las lecciones. El detalle fino de F se
planifica **al cerrar E5**, con lo aprendido — planificarlo hoy sería
estimar, no medir.

---

# Decisiones de Edu — TODAS CERRADAS (2026-08-11)

| # | decisión | resolución |
|---|---|---|
| 1 | Proveedor audio ejercicios | **por probe**: se prueba la key de MiniMax en E1 — viva → MiniMax, muerta → ElevenLabs (~15 grabaciones, costo despreciable en cualquier caso) |
| 2 | Unchecked | **muestreo 10 % con freno** (muestra >2 % de error ⇒ revisión completa de esa cola) |
| 3 | Escalera karaoke | **~14 textos** A2→C1 |
| 4 | Juez LLM mediación | **diferido a post-E5**; autoevaluación v1 declarada sigue |

# Riesgos y notas

- **La cifra ~430 de mediación** es del currículo sin reconciliar; el
  Paso 0 puede moverla en ambas direcciones. El plan se re-dimensiona
  con ese recuento, no antes.
- **Disco**: la purga ya se llevó dos veces el chromium de Playwright y
  una vez `node_modules` y el scratchpad. Antes de cada sesión:
  `df -h /` y `npx playwright install chromium` si hace falta. Lo
  pesado a `/Volumes/Edu`.
- **`~/.npm` tiene 209 entradas de root** — reinstalar con
  `--cache <tmp>` hasta que Edu corra `sudo chown -R lalo:staff ~/.npm`.
- Interacción/producción oral quedan a cero **por decisión**, no por
  olvido: el test de anchor lo vigila y este plan lo hereda. Si algún
  día entra, es una fase nueva con su propio diseño.

---

## E2#9 (2026-08-31) — dos correcciones al propio plan, y la medición para el re-corte

**1 · El bucket de mediación-ítem es 1.580, no 1.350.** El recuento de
E2#8 calculaba `1580 − 230`. Está mal: son buckets separados, de líneas
distintas del currículo. **EJERCICIOS** de mediación (A2 200 · B1 280 ·
B2 400 · C1 400 · C2 300) = **1.580**, dentro de los 7.000 de ejercicios.
**PRODUCCIÓN** de mediación (20 · 40 · 60 · 60 · 50) = **230**, dentro de
las 830 tareas. Este plan tenía las dos versiones —§«Estado medido hoy»
correcta, línea de la línea B con la resta— y el script heredó la mala.
Corregidos los dos scripts y esa línea. **El hallazgo de E2#8 se hace más
grande, no menor: el bucket a cero es de 1.580, un 40 % del faltante.**

**2 · Subir el tamaño de lote queda descartado y es ahora regla de la
skill:** el lote industrial es de **24**. A 44 el error pasó de 17 % a
45 %, y la clase dominante fue trasvase roto rúbrica↔gold — la casilla y
el gold se separan cuando se escriben 44 de un tirón. Si hace falta más
volumen, dos lotes de 24 en pasadas separadas.

**3 · La medición para el re-corte de la meta** está en
`scripts/recuento-conceptos.ts`, con la salida pegada en
`2026-08-31-medicion-conceptos.txt`. Tres tablas y una inversión:

- El currículo **enumera 186 puntos** de enseñanza (A1 31 · A2 31 · B1 27
  · B2 31 · C1 32 · C2 34). Conteo auditable: se declara qué separador se
  usó en cada sección.
- Hoy hay **50 conceptos** y 2.391 asignaciones: **densidad 48 ítems por
  concepto**, mediana 53, mín 3, máx 125, ninguno a cero. C2 tiene 0
  conceptos declarados y C1 sólo 4.
- **La meta bajo N ítems por concepto**: con los 50 conceptos de hoy,
  300 / 400 / 500 para N = 6 / 8 / 10. Con los 186 puntos del currículo,
  **1.116 / 1.488 / 1.860**. Los 6.300 actuales están entre 3× y 21× por
  encima.
- **La inversión, que es el número que decide**: sostener 6.300 a N=8
  pide **788 conceptos, 15,8× el inventario actual**; los 186 puntos del
  currículo son sólo 3,7×. Dicho al revés: 6.300 con 50 conceptos obliga
  a **126 ítems por concepto**, 2,4× la densidad que el corpus ya tiene.

**La cautela que hay que leer junto a la tabla**: el inventario de
conceptos es GRUESO. `b10-registro` tiene 125 ítems y
`b6-contraste-indicativo-subjuntivo` 90, no porque sobren sino porque no
son un punto de enseñanza sino familias enteras. Con esa granularidad,
«N por concepto» mide el inventario tanto como el curso. Las dos bases
acotan la respuesta; **la meta y el inventario no son independientes**, y
si el criterio se adopta, el trabajo previo es partir los conceptos
gruesos — que es trabajo de currículo, no de contenido.

Sin recomendación de recorte: la decisión es de Edu.

---

## E2#11 (2026-09-01) — las tres decisiones que gobiernan hasta el final

Fijadas por Edu con la tabla de cobertura de E2#10 delante. **No se
re-litigan.**

**1 · La meta es COBERTURA.** ≥12 ítems por cada uno de los 186 puntos
(~3.900 ejercicios). Faltan 1.513. Los 6.300 quedan derogados.

**2 · La mediación es composición, no un bucket aparte.** 230 tareas
(183 hechas) + los ítems de mediación como ~30 % de los 1.513.

**3 · NINGÚN LOTE ELIGE TEMA.** Cada lote toma sus puntos de la tabla de
déficit (`npx tsx scripts/split-conceptos.ts`), y su reporte dice qué
puntos cerró y cuánto bajó el déficit. La prueba de por qué, medida en
E2#10: producir por tema llevó a enseñar la regência con DE **87 veces
en 9 bloques** mientras la mesóclise —el rasgo más característico del
portugués europeo culto— tiene **2 ítems**, y a que un punto llamado
`b5-futuro-composto` acumule 54 ítems donde el futuro composto **no
aparece ni una vez**.

**Calendario**: ~25 sesiones de producción, unos dos meses y medio. Luego
E3 (lectura, barata) y E5. Cuando el déficit baje de ~400, E3 entra en
paralelo.

**Una cicatriz de Edu, anotada por él**: su reparto proporcional daba
A2/B1/B2 por cerrados y la partición fina demostró lo contrario —
medianas de 8, 11 y 11, con 89 puntos bajo el piso entre los tres. Es
exactamente para lo que servía partir los conceptos: **un concepto gordo
bien surtido esconde sub-puntos famélicos.**


---

## E2#13 (2026-09-03) — se abre C2, y el método artesanal cambia de raíz

**1 · El bloque 12 existe.** C2 eran **408 unidades de déficit
inalcanzables**: el currículo enumera 34 puntos y no había ni un concepto
declarado ni sitio donde aterrizar un ítem, porque `LessonSchema.blockId`
topaba en 11. Abierto el bloque «Pasar por portugués (C2)» con los OCHO
puntos de la línea de gramática del currículo. Los otros (léxico opaco,
fonología, pragmática, mediación profesional) se declararán cuando exista
el formato que los ejercita; declararlos antes sería fingir cobertura.

Y el hallazgo que sólo se ve mirando la tabla: al abrirlo, todo salió
verde y **los ocho puntos nuevos desaparecieron del déficit**, porque
`split-conceptos.ts` tenía su propia COPIA de `BLOQUE_A_NIVEL` en vez de
importarla. Un mapa duplicado es una métrica que miente en silencio.

**2 · Los juicios se escriben por PARES MÍNIMOS** (`scripts/lib/
pares-minimos.ts`): el BIEN y el MAL salen del mismo esqueleto y difieren
sólo en el tramo juzgado. Rompe el bucle de tres sesiones en que cada
atajo arreglado fabricaba otro del mismo calibre. Y sustituye el criterio
del molde, que se agotaba: «prefijo de CUATRO no visto» tenía 16 casillas
y quedaban cinco, tres de ellas con racha >3 — moría en dos lotes.

**Pero la tesis prueba MENOS de lo que se le atribuyó, y está medido**:
el par compra validez **diferencial** y cero validez **absoluta**. Todo
defecto compartido por los dos miembros es invisible por construcción y
la batería lo puntúa «limpio». Tres corolarios pagados el mismo día: el
rasgo juzgado puede seguir siendo un atajo si se usa sólo su tercio fácil
(12/12, p=0,0002); los `repair` son verbatim otros ítems del lote, lo que
sube el techo de la estrategia sin portugués del 50 % al 75 %; y a N=12
el binomial exige 10/12, así que un atajo al 75 % se escapa el 61 % de
las veces.

**3 · Dos rasgos nuevos en la batería, encontrados por los rounds:**
- **El 12, la GLOSA COGNADA**, que la skill nombraba desde el lote 3 y
  que el código nunca tuvo por ser el único que no sale de un regex:
  **20/24 (p=0,0008)** en el lote 11. No se calcula, se DECLARA, y el
  preflight bloquea si falta. **Los pares mínimos NO lo neutralizan**
  porque mira dentro del hueco: la única defensa es que el punto sea de
  verdad divergente del español.
- **El 13, la CONSTRUCCIÓN EUROPEA MARCADA**: 11/14 (p=0,029) en el lote
  10, con tasa base 53 % sobre los 146 juicios publicados.

**4 · Lo publicado y lo que no.** Lote 10: **14 ítems**, tres rondas,
once bloqueantes aplicados. Lotes 11 y 12: **NO publican**, y por la
misma razón de fondo — un punto que no diverge del español no se puede
examinar con juicios binarios. Déficit **1.668 → 1.656**, residuo 0.


---

## E2#14 (2026-09-04) — la sesión que borró trabajo del calendario y descubrió que el gate mentía a N pequeño

**Ningún lote publica**, y por cuarta vez seguida. Pero el déficit baja
**1.650 → 1.615** sin escribir un solo ítem, que es la primera vez que
eso pasa.

**1 · El barrido de etiquetado, la única tarea que BORRA trabajo.**
109 ejercicios publicados (4,5 % del corpus) tenían `concepts: []`, y el
bucle de asignación itera `x.concepts`: **eran invisibles para la tabla
que gobierna el calendario**. Causa limpia — los lotes 1-4 y el piloto
son anteriores a la regla, del 5 en adelante hay cero. Resultado: 79
etiquetados, 30 declarados sin punto a propósito, **cinco puntos cerrados
sin escribir nada** (`b10-var-lexico`, `b11-morfologia-enganosa`,
`b3-pron-indirecto`, `reg-verbal-com`, `reg-verbal-a`) y un punto nuevo
que nace cubierto: `b9-lexico-anti-calco`, que catorce juicios llevaban
desde el lote 1 enseñando sin tener dónde vivir. Puerta cerrada con
`npm run check:concepts` + 3 tests.

**2 · El mapa formato↔punto, y su corrección en la misma sesión.**
Criterio: *juicio binario si y sólo si el error que enseña produce,
traducido palabra por palabra, español bien formado*. Reparto sobre los
213 puntos: **cloze 130 · juicio 41 · transformación 24 · mediación 18**
— la línea artesanal de juicios sólo puede atacar el 19 % del faltante.

Y la corrección, que el round del lote 11 v2 forzó: **cambiar de formato
NO arregla un punto que coincide con el español.** El cloze mata el atajo
de etiqueta, no el de traducción; la sección de ser/estar salió resoluble
12/12 poniendo el verbo español. `coincide` significa **elige otras
frases**, no «cámbiale el formato».

**3 · «Preflight limpio» era una tautología a N pequeño.** A N=4,
`pValor(4,4)=0,0625`: ningún rasgo puede bloquear ni acertando el 100 %.
El preflight imprime ahora la POTENCIA antes que nada y bloquea por
debajo de N=5. Con ello salieron siete gates más: el rasgo 14 (espejo del
español), el 15 (primera mitad), `monocultivoDeClase`,
`separablePorPosicion`, `techoBajoPares`, la invariante del `repair` y —
medido y resuelto con los ojos abiertos— **el conflicto entre esa
invariante y el gradiente posicional que fabrica**.

**4 · Y el runner, que llevaba tiempo cobrando mal.** `FillBlankCard` no
pintaba la pista **y el esquema la tiraba en silencio** (`z.object`
descarta lo que no declara). Auditados los 417 `fill_blank`: **70
sospechosos de ser inresolubles**, y de una muestra de 20 dictaminada a
mano, **nueve lo son (45 %)** — el freno muerde. Es el gemelo del
multi-hueco: aquél cobraba aciertos de más, éste cobra **fallos** de más.
Repararlos es ahora una línea por ítem.


---

## E2#15 (2026-09-05) — dos decisiones de Edu, y la primera sesión que publica de verdad

**1 · El piso baja de 12 a 8 ítems por punto (C2: 6).** El 12 se eligió a
ojo hace tres sesiones porque era redondo; con FSRS repitiendo, ocho
ítems variados por punto sobran, y en C2 lo que de verdad enseña es leer
—para eso está la Biblioteca—. **Sólo ese cambio: déficit 1.615 → 862.**

**2 · Un solo formato y revisión por muestreo.** Se produce en **cloze
con pista derivado**, y la doble revisión adversarial ítem por ítem se
sustituye por **muestreo del 20 % con el freno de siempre**. Es lo que
convertía 24 ítems en una sesión entera.

**3 · MORATORIA sobre los juicios de gramaticalidad.** Cuatro sesiones
seguidas murieron ahí y el formato cubre 41 de 213 puntos. Los lotes 11 y
13 quedan en el banco con sus descartes escritos; se retoman cuando haya
holgura y toda la cicatriz acumulada juegue a favor.

**Resultado: 100 ítems publicados y 14 puntos cerrados**, déficit
**862 → 762** con residuo 0. Ritmo medido: **100 por sesión**, o sea unas
ocho sesiones para lo que queda, no cuatro meses.

**Y el muestreo se ganó su sitio**: las tres muestras encontraron
**clases, no instancias** — un artificio de redacción repetido en 22
ítems (el sujeto pospuesto), un bug del conjugador que afectaba a todos
los verbos en -car/-gar/-çar, y un conector fuera de su marco. Como el
freno mordió las tres veces, los 100 acabaron revisados a mano igual;
pero lo que la revisión encontró fueron **causas**, y eso sí escala.


---

## E2#16 · 181 ítems, 46 puntos cerrados, y el conjugador auditado por clases

Tres frentes, los tres cerrados. **Déficit 750 → 611**, residuo 0. (Las
dos cifras del script conviven y ninguna es la buena a solas: **FALTA
750 → 611** incluye los 59 puntos que el currículo enumera y aún no
tienen concepto declarado, × piso; el **déficit de los 213 declarados**
va de **358 a 203**. Mezclarlas es lo que me hizo perder media sesión.)

**1 · Lote 12 de mediación**, que llevaba tres esperando su formato: 24
ítems, `b12-mesoclise-estilistica` y `b12-arcaismo-juridico` de 0 a 12,
los dos cierran. La rúbrica se DERIVA de los marcadores y datos
declarados, y el gate de trasvase cazó doce fallos en mi propio texto.

**2 · Los 220 «derivables»** dictaminados: 39 de clase cerrada, 155
verbales, 23 ni una cosa ni otra. Seis reparados, dos de ellos ROTOS. El
barrido de sujeto-verbo sobre los 155 dio 8 marcados y **los 8 eran
falsos positivos de mi propia criba**.

**3 · 157 cloze con pista a 44 puntos, todos cerrados.** El número no lo
elegí: el déficit alcanzable por cloze eran **165 unidades en 46 puntos**,
así que 150 habría dejado quince sin cerrar y pasar de 165 habría puesto
ítems por encima del piso, que descuentan cero. El lote es el hueco.

### Lo que encontró el freno: dos clases, no dos ítems

**El acento de hiato.** El muestreo del 20 % dio «saissem» por «saíssem».
La regla existía y funcionaba en el particípio, en el clítico `-lo` y en
el infinitivo pessoal — **tres copias del mismo regex**. Los dos
conjuntivos que E2#15 añadió no la llevaban. El defecto no era el regex:
era tenerlo tres veces. Ahora hay una `hiatoEnI` y el futuro do
conjuntivo de los regulares **delega** en el infinitivo pessoal, porque
son la misma forma.

**La alternancia vocálica de -ir**, que el muestreo NO cazó — la encontró
la lectura del lote entero que el freno obliga a hacer cuando muerde.
«sube» por «sobe», «dormo» por «durmo», «servo» por «sirvo», «prefero»
por «prefiro», «seguo» por «sigo». No es predecible por la forma («unir»
no alterna), así que tabla cerrada, y **lo que no está se rechaza en vez
de inventarse**. El guardián frenó a la primera un ítem ya publicado
(«resumir»): era correcto y lo certifiqué. Eso es exactamente lo que se
le pide a un guardián.

**Barrido de las dos clases sobre el corpus entero, no sobre muestra.**
Alternancia: 0 en campo portugués. Hiato: **tres ítems publicados y
falsos** (`ce0518bc`, `6c7d8450`, `94729cbc`), corregidos con su audio
regenerado.

### Lo que se aparcó, y lo que se acotó

`b3-pron-directo` se queda fuera con sus 7 ítems escritos: un cloze de
clítico de OD necesita el antecedente en la frase, y el clítico
portugués es homógrafo del artículo que lo precede, así que la respuesta
está siempre escrita al lado. **El gate de fuga no es un falso positivo:
acierta.** Es el formato el que no sirve para ese punto.

Y un gate se **acotó a su motivo**, que no es lo mismo que aflojarlo: el
paréntesis en la frase se exigía porque la tarjeta no pintaba `hintEs`, y
desde E2#13 lo pinta. Ahora se exige donde importa — si el ítem pide la
forma de un verbo, hay que nombrar el verbo.

### El ritmo, medido otra vez

**181 ítems y 46 puntos en una sesión.** Quedan 611 de FALTA, de los
cuales **356 son puntos de C1 y C2 sin concepto declarado** (× piso): ésos
no se llenan escribiendo cloze, se llenan declarándolos primero. El
déficit de lo ya declarado son **203**, que a este ritmo son dos sesiones.


---

## E2#18 · el déficit deja de ser una estimación, y la mediación se produce en serie

**FALTA 392 → 256**, residuo 0 en las cinco reconciliaciones. Y por
primera vez la cifra es **enteramente medida**: cero puntos «sin empezar»
en todos los niveles, así que FALTA y déficit son ya el mismo número.

**1 · A1: los 8 puntos «sin empezar» eran 5.** Mismo método que C1/C2 —
sacar el texto de los 31 segmentos y leerlos. 21 ya estaban declarados, 2
son metas de vocabulario, 3 son colas de frase. Y lo que la aritmética
tapaba: **la redução vocálica átona tiene CERO menciones en todo el
corpus**, y lo dice el propio currículo. Es lo que separa oír portugués
europeo de oír una sopa. Los cuatro puntos de fonología estrenan el
formato **`escucha`**, porque meterlos en cualquiera de los cuatro
formatos escritos habría sido fingir que se enseñan.

**2 · 112 mediaciones publicadas en cinco pasadas, 15 puntos cerrados.**
Dimensionadas siempre por el hueco medido: 24, 22, 24, 22, 20. Nunca un
número redondo.

**3 · Y HUBO QUE CONSTRUIR LA SEGUNDA MÁQUINA.** A mitad del bucket, los
puntos que quedaban dejaron de ser transposición de registro: en «ironía y
understatement» no hay marcador que sustituir, hay un efecto que explicar.
`explicar-mediacion.ts` mantiene el principio —la rúbrica se DERIVA de lo
declarado— y cambia lo declarado: puntos clave en vez de marcadores.

Su primer diseño falló en 26 de 18 ítems, y el fallo enseña algo: buscaba
la frase de la casilla dentro del modelo, y una explicación de ochenta
palabras parafrasea por definición. Exigirlo obliga a escribir **modelos
peores para que el gate esté contento**. La solución es la del cloze:
separar lo que la casilla DICE de lo que el script COMPRUEBA.

### Las tres cosas que la revisión encontró, y que ningún gate veía

**El dato inventado.** Ocho en las dos primeras pasadas: «sem resposta há
duas semanas» donde la fuente no da plazo, «senhor Manuel» donde no hay
nombre, un motivo de indeferimento que nadie escribió. Uno era peor que un
descuido: **su consigna se contradecía con su rúbrica** —invitaba a
explicar el porqué y la casilla negativa lo prohíbe—, y se arregló la
consigna, no la casilla.

**La rúbrica agramatical**, que destapó una auditoría externa. Tres
casillas ya publicadas proponían «Informam-se que…», que no es gramatical,
mientras sus propios modelos escribían «Informa-se». **El alumno que
obedecía la rúbrica escribía mal y la casilla lo aprobaba.** Se cerró por
construcción: `rubricaDe` propone ahora la forma que el modelo USA.

**Y dos veces la misma lección sobre los gates**: el comparador
rúbrica↔modelo marcaba 43 de 70, y la primera versión del detector de
datos nuevos listaba todas las palabras de contenido. Los dos eran
correctos y los dos eran inservibles. **Un gate ruidoso es un gate
apagado**, así que uno se acotó a números y nombres y el otro se sustituyó
por un invariante en la suite.

### Dónde vive lo que queda

| formato | unidades | máquina |
|---|---:|---|
| juicio | 97 | **bajo moratoria** |
| transformación | 76 | **sin construir** |
| escucha | 32 | **sin construir** (audio A/B) |
| mediación | 28 | las dos hechas |
| cloze | 23 | hecha |

De las 23 de cloze, 7 son `b3-pron-directo`, que necesita transformación.


---

## E2#19 · la tercera máquina, y el punto que suspendía a quien acertaba

**Déficit 256 → 169**, residuo 0. **Cloze y mediación quedan en CERO.**

**1 · Cerradas las dos líneas maduras.** Las 28 unidades de mediación en
tres lotes según lo que cada punto pedía (registro, explicar, traducción)
y las 16 de cloze escribibles. El lote de traducción obligó a declarar
`sourceLang` y `targetLang` en el ítem: tres de sus seis traducen HACIA el
español, y publicarlos como `pt` habría sido el defecto de `b2c2-med-220`
invertido.

**2 · Construida la TERCERA máquina: transformación.** Tipo, esquema,
tarjeta, despachador, gates y publicador. Es el formato que 15 puntos
esperaban, incluido `b3-pron-directo`, aparcado en E2#16 porque el cloze
no puede examinarlo. 41 unidades publicadas en dos pasadas.

**El atajo del formato se declara y se mide.** Traducir al español,
transformar allí y volver es su riesgo mayor y no se detecta por regex:
cada ítem declara `espejoEs` y el preflight imprime la proporción, salga
verde o rojo. Lote 1: 2/24. Lote 2: 0/17.

**3 · DOS COSAS QUE HABRÍAN ENVENENADO EL LOTE ENTERO, encontradas antes
de escribir ningún ítem.** `enclise` es INGENUA a propósito —se escribió
para fabricar el distractor de un juicio— y da «fez-o», que no existe;
`encliseReal` implementa las tres reglas (fê-lo, tem-nas, Encontrámo-las).
Y la QUINTA clase del conjugador, la más limpia de todas: el acento de
«nós» sobre el tema de pretérito estaba escrito dos veces y **las dos
versiones fallaban en espejo** —*coméssemos* en una, *fizêramos* en la
otra—, cada una correcta donde la otra erraba.

**4 · Y el defecto que más alumnos habría suspendido.** Una auditoría
externa vio que 7 de 24 transformaciones piden la frase entera con punto
final y la comparación lo exigía. El barrido destapó lo gordo: **560
traducciones publicadas** con la clave terminada en signo, y
`TranslationCard` comparando en crudo —sin NFC, sin recortar la clave y
exigiendo el punto—. Quien traducía perfecto sin poner el punto quedaba
suspendido, y el fallo entra en el FSRS.

La cura es el matiz del auditor: se hace opcional **el signo que la clave
lleva**, no cualquiera. Ignorarlos todos habría dado por buena la
interrogativa frente a la afirmativa, y ahí el «?» es la respuesta.

### Dónde queda todo

| formato | unidades | estado |
|---|---:|---|
| juicio | 97 | bajo moratoria — un lote de 24 decide si vuelve o muere |
| transformación | 40 | máquina hecha, produciendo |
| escucha | 32 | sin construir; necesita audio |
| cloze | 0 | **cerrado** |
| mediación | 0 | **cerrado** |

Y un punto que no se produce por decisión: `b11-nominalizacao` (8) es casi
todo espejo del español y en este formato no discrimina.
