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
- [ ] Corpus según recuento del Paso 0: **6.300 ejercicios** (7.000 del
      currículo − 700 de motor runtime), con **mediación completa**:
      1.580 ítems + 230 tareas — es el cuello: hay 32 (2 %).
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
- Regenerar las 11 grabaciones caducadas + 4 faltantes → `verify:content`
  a cero. Proveedor: **MiniMax** — key probada VIVA el 2026-08-11
  (probe mínimo, 1 llamada, exit 0). No gasta cuota karaoke.

## E2 · Corpus a escala — DOS líneas de producción (~18-22 sesiones)

El Paso 0 obliga a partir E2 en dos líneas con economías distintas:

**Línea A — artesanal (el ciclo /lote-b2c2):** las ~200 tareas de
mediación restantes (de 230; van 32) + los juicios C1 + las lecciones
b11. Lotes de **12 MED-tarea + 10 GJ**, ~2 lotes/sesión → **~7-8
sesiones**. Doble adversarial completo, como hasta ahora.

**Línea B — industrial (el pipeline tipo Ola L):** los ~4.100 ejercicios
faltantes, que son ítems (no tareas): los 1.580−230 de mediación-ítem
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

Reglas pagadas que aplican: normalizar CRLF, quitar `_itálicas_`,
`parrafos[0]` puede ser numeral, fornada 3 de chistes/quadras con doble
adversarial si alcanza.

## E4 · Escalera karaoke (cadencia mensual, no bloquea)

2-3 textos/mes de la escalera graduada. **Propuesta de tamaño total:
~14 textos** cubriendo A2→C1 (hoy: 3) ⇒ ~4-5 meses en paralelo con todo
lo demás — CERRADO por Edu 2026-08-11. Cuota: ~60,5k
créditos hoy (rinden ~2×), reset **2026-08-28** (121k/mes). Piloto de 2
párrafos antes de cada texto, como siempre. `/doblar-episodio` para
cualquier audio de curso.

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
