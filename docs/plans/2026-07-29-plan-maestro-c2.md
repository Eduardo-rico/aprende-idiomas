# Plan maestro 0→C2 — cuatro idiomas, lectura completa

**Fecha:** 2026-07-29 · **Decisiones de Edu que lo dimensionan** (cerradas hoy, no reabrir):

1. **Techo: C2** en los cuatro idiomas.
2. **Lectura: 1,9M palabras** — el catálogo completo, dominio público (uso personal, ya confirmado).
3. **Idiomas: los cuatro** — PT-PT (con sombra PT-BR), rumano, checo y ruso.
4. **SECUENCIAL** (añadido el mismo día): «terminemos portugués y después hagamos los demás». PT completo 0→C2 + lectura ANTES de levantar el primer bloque de RO.
5. **Inmersión nativa por idioma**: chistes del idioma —no traducidos—, comidas del país, mundo propio. Regla dura para TODO contenido cultural.
6. **Lectura con karaoke**: el texto se resalta sincronizado con el audio, palabra a palabra.

Este documento ordena; los diseños viven donde ya están: currículos en `2026-07-28-curriculos-completos.md` (corregidos dos veces), serie en `2026-07-28-serie-inmersiva-y-revision-material.md`, contenido narrado en `docs/contenido/`.

---

## El principio que ordena todo

**Nada se genera a escala sin su gate, y ningún gate se declara verde sin haberlo visto rojo.** Todo lo que este proyecto ha tenido que tirar —el corpus brasileño consagrado como europeo, la regla h-/f-, los guiones sin narradora, el ep. 1 doblado a medias— se generó antes de tener el gate que lo habría parado. El orden de cada ola es siempre: **gate → piloto → lote**, nunca lote primero.

## Estado de partida honesto

| Activo | Estado |
|---|---|
| PT audio A1-A2 | ✅ T1 completa: 20 piezas, 46,6 min, narradora validada, voces aprobadas |
| PT corpus ejercicios | ⚠️ 2.039 ítems base europea; **~110 verificados**, 1.827 unchecked, 102 en cuarentena filtrada |
| PT B2-C2 | ❌ currículo en papel; el corpus real llega a B1 |
| Eje MCER (evidencia) | ✅ construido para PT (descriptores + TaskSpecs + evidencia en Dexie) |
| RO / CS / RU | ❌ currículos corregidos en papel; scaffolds vacíos en la app |
| Lectura (4 idiomas) | ❌ sin arrancar |
| Doblaje | ✅ pipeline completo en `scripts/doblaje/` con sus lecciones escritas |

## Las olas, en orden

### Ola L — la biblioteca de lectura, SOLO PT ✅ CERRADA 2026-07-29

**Cerrada el mismo día en tres sesiones** (commits hasta `6b2c597`). Lo entregado, medido:

- **Catálogo: 224 lecturas · 10 series · 714.004 palabras** (objetivo ~700k ✅). Eça completo en Gutenberg (12 Contos + Cidade e as Serras + Padre Amaro + Os Maias), Camilo (Amor de Perdição + Novelas do Minho), Garrett (Viagens), Junqueiro (43 Contos para a infância), Braga (Contos Phantasticos), y 2 fornadas de anedotas/quadras originales con doble adversarial.
- **Karaoke** (escalera graduada): A Aia (B1) + O Tesoiro (B1) + Civilização (C1) — los ~3 textos/mes de cuota. La cuota rinde ~2× lo presupuestado (34.437 créditos por 62.599 chars).
- **Infra completa**: modo texto puro, series/capítulos con navegación, diccionario emergente con des-flexión nominal, «marcar como lida» → evidencia MCER (comprensión lectora por nivel, reglas anti-inflación heredadas), graduación por métricas medidas contra anclas (A Aia 22,7 / O Defunto 27,3 / Civilização 35). E2E con clics reales 4/4.
- **Gates**: procedencia (2 vías: dominio público / original con constancia adversarial), segmentadores con cuenta exacta — todos probados en rojo.

**Backlog que NO bloqueó el cierre**: engordar diccionario para literatura (gato/flor→null), capítulos de novela pesados (2,4MB HTML), Pessoa vía Orpheu (multiautor, Almada †1970), O Primo Basílio no está en Gutenberg, DISCUTIBLES de fornada 2 para fornada 3, karaoke de agosto.

<details><summary>Diseño original de la ola</summary>

Es la primera porque **desbloquea B2-C2 sin esperar a nadie**: la lectura extensiva es el único insumo de esos niveles que no necesita revisor nativo (los textos son de nativos muertos) ni generación por LLM (cero riesgo de inventar lengua).

1. **Infraestructura** (la app): sección `/[lang]/leer` — catálogo por nivel, lector con diccionario emergente, progreso a la capa de evidencia MCER, audio TTS por capítulo con las voces aprobadas.
2. **Curaduría PT** (~700k de los 1,9M): dominio público — Eça de Queirós, Camilo, Pessoa (bien muerto en 1935), Almeida Garrett; graduación por nivel medida con el vocabulario acumulado del alumno, no a ojo. Fábulas y cuentos cortos abajo, novela entera arriba (*Os Maias* es el techo C2 natural).
3. **Gate de procedencia**: cada texto con fuente, autor, año de muerte del autor y URL de origen en un manifiesto — nada entra sin los cuatro campos.
4. **Lector karaoke** (requisito de Edu, no extra): audio generado con `/with-timestamps` de ElevenLabs (alineación por carácter) y resaltado sincronizado en el lector. Se pilota con UN texto antes del lote.
5. **Chistes y poemas por nivel — nativos del idioma, jamás traducidos**: se escriben (no hay dominio público graduado) → pasan por el lingüista adversarial de su lengua ANTES de publicarse. Sin excepción: es la lección más cara ya pagada.
6. RO/CS/RU **esperan a que PT esté terminado** (decisión secuencial). Cuando toquen: Creangă/Eminescu/Caragiale · Němcová/Hašek · Chéjov/Pushkin — y sus chistes, comidas y mundo PROPIOS.

</details>

### Ola V — verificación del corpus PT existente ✅ EJECUTADA 2026-07-29, con resultado distinto al previsto

El diseño original («triagear por regla, unchecked <500») **murió en su
calibración**: dos adversariales vetaron la v1 con evidencia de corpus, y
el tercer auditor tumbó la v2 sobre una muestra de 120 (19 ERROR / 15
AVISO; criterio 0/≤3). Una regla de superficie no valida lengua. Detalle
completo en `2026-07-29-ola-v-triage-variante.md`.

Lo aplicado: cuarentena +165 (146 por marcador inequívoco auditado + 19
por auditoría directa) → corpus **1.661 unchecked · 266 needs-human ·
110 divergent · 2 neutral**; guard de variante de 17 a ~90 marcadores y
campos antes invisibles (`options`/`pairs`); clasificador de riesgos que
ORDENA la cola humana sin cancelarla.

**El hallazgo que redefine la siguiente ola**: ~16 % del cubo más limpio
del corpus está roto o divergente (regencias BR, posesivo sin artículo,
español incrustado, agramaticalidades). El corpus generado viene mezclado
de las dos orillas. Camino real, a decidir por Edu: (a) revisión
adversarial por lotes de los 1.661, o (b) regeneración por regla con el
pipeline revisado + gates nuevos. Ninguna de las dos bloquea la Ola
B2C2-PT, pero sí acota cuánto corpus viejo sobrevive.

### Ola B2C2-PT — el corpus alto de portugués

Con la lectura andando: los bloques B2-C2 según el currículo. Los tipos nuevos que el currículo exige (`mediation`, `register`, `grammaticality_judgment`) se implementan **primero en el schema y el runner**, después se genera contenido. La mediación usa los textos de la Ola L como fuente — por eso L va antes.

### Ola RO/CS/RU-1 — levantar los tres idiomas

Por idioma, en este orden fijo:
1. **Motor morfológico por regla** (el spec de `morphRules` del currículo rumano es la plantilla) validado contra UD/Hunspell — **el gate se prueba en rojo con formas falsas conocidas** (*draji*, *fete/fată* mal clasificada) antes de generar nada.
2. **Bloques A1-A2** generados por regla + léxico curado; lo no generable por regla se escribe y pasa por el lingüista adversarial de la lengua.
3. **Serie propia con narradora** — mismo formato de 4 capas, mundo propio (no traducir AO BALCÃO: el método exige que el mundo sea del país de la lengua). Diez episodios A1 por idioma, pilotados con `SOLO=` antes del lote.
4. Voces: batería fonética de cada lengua (la de PT está en el skill; RO/CS/RU necesitan la suya — vocales centrales rumanas, ř checa, reducción rusa) aprobada **a oído por Edu** antes del lote.

Orden entre idiomas: **RO → CS → RU** (el rumano tiene el spec de morfología más maduro; el ruso es el más caro y va último para heredar todas las lecciones).

### Ola B2C2-×3 — el tramo alto de los otros tres

Réplica de B2C2-PT por idioma, con la lectura de su Ola L como insumo de mediación.

## Reglas transversales (las lecciones pagadas, ya no opcionales)

- **Adversarial antes de doblar/publicar** — una corrección nativa no es verdad por ser nativa.
- **Cifras medidas, nunca estimadas** — contador de formas, ffprobe, recuentos con `node`; el que declara una cifra adjunta el comando.
- **Gates probados en rojo** — un gate que nunca se vio fallar no protege nada.
- **Ningún descarte silencioso** — todo filtro revienta o reporta lo que dejó fuera.
- **Piloto antes de lote** en todo lo que gaste dinero (TTS) o escala (generación).
- **Los agentes del repo** (`.claude/agents/`, `.claude/skills/`) son el vehículo: cada lección nueva se escribe ahí, no en la memoria de una sesión.

## Qué NO está decidido (y a quién le toca)

- Proveedor para regenerar las 11 grabaciones de ejercicios caducadas + 4 faltantes (MiniMax archivado vs ElevenLabs) — **Edu**, cuando toque volver al audio de ejercicios.
- Si PT-BR merece su propia serie algún día — **nadie lo pidió; no se hace**.
- Presupuesto de voces ElevenLabs para RO/CS/RU (121k créditos/mes actuales; la T1 de PT costó ~25k) — se mide en el piloto de cada idioma antes de comprometer nada.
