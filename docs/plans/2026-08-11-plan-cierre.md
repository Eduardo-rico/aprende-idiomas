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
- [ ] Corpus según recuento del Paso 0 (ver E1), con **mediación
      completa** — es el cuello: 32 de ~430 (7 %).
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

\* Los 808 anclan a todos los niveles; el recuento del Paso 0 dirá
cuántos valen para el tramo B2-C2. La cifra 830+430 del currículo
original nunca se reconcilió con el corpus — ese recuento es lo primero.

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
  a cero. **[DECISIÓN EDU: proveedor — MiniMax (archivado, barato) vs
  ElevenLabs (gasta cuota karaoke)]**.

## E2 · Corpus a escala, MED-pesado (~12-16 sesiones)

El lote cambia de composición: **12 MED + 10 GJ** por lote (antes 6+20)
— la mediación es el cuello y los juicios van sobrados en proporción.
A ~2 lotes/sesión ≈ **24 MED + 20 GJ por sesión** → las ~400 mediaciones
restantes salen en ~16 sesiones; si el Paso 0 baja la meta, menos.

Cada sesión E2 lleva además:
- **1 lección b11 cada 2 sesiones** (hasta 6-8; los conceptos nuevos
  `b11-morfologia-enganosa` y `b11-aspecto-tempo` ya existen y tienen
  ítems esperando lección).
- **Una cola de ~100 `unchecked`** del corpus viejo por el triage v2 +
  muestreo adversarial del 10 % — así los 1.799 se agotan en las mismas
  ~16 sesiones sin ola propia. **[DECISIÓN EDU: aceptar muestreo del
  10 % con freno (si la muestra da >2 % de error ⇒ revisión completa de
  esa cola) vs revisión exhaustiva (≈4× el costo) vs regenerar]**.
  Recomendación: muestreo con freno.
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
El juez LLM queda como mejora opcional — ya no bloquea nada.
[DECISIÓN EDU, sin prisa].*

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
lo demás. **[DECISIÓN EDU: tamaño de la escalera]**. Cuota: ~60,5k
créditos hoy (rinden ~2×), reset **2026-08-28** (121k/mes). Piloto de 2
párrafos antes de cada texto, como siempre. `/doblar-episodio` para
cualquier audio de curso.

## E5 · Gate de cierre PT (1 sesión)

Recorrer la checklist de TERMINADO con cifras medidas y comandos
adjuntos; `next build`; smoke E2E; doc de cierre en `docs/plans/`;
actualizar memoria. Si algo no pasa, no se declara — se lista y se
vuelve.

**Total PT: ~20-24 sesiones de trabajo** (16 E2 ∥ 5 E3 + E1 + E5),
más la cadencia E4.

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

# Decisiones de Edu (las únicas abiertas)

| # | decisión | bloquea | recomendación |
|---|---|---|---|
| 1 | Proveedor audio ejercicios (MiniMax vs ElevenLabs) | E1 | MiniMax: no gasta cuota karaoke |
| 2 | Unchecked: muestreo 10 % con freno vs exhaustivo vs regenerar | E2 | muestreo con freno |
| 3 | Tamaño escalera karaoke (~14 textos propuestos) | E4 | 14 |
| 4 | Juez LLM para mediación | nada (opcional) | diferir a post-E5 |

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
