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
