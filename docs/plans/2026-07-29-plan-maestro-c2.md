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

### Ola L — la biblioteca de lectura, SOLO PT ← LA SIGUIENTE

Es la primera porque **desbloquea B2-C2 sin esperar a nadie**: la lectura extensiva es el único insumo de esos niveles que no necesita revisor nativo (los textos son de nativos muertos) ni generación por LLM (cero riesgo de inventar lengua).

1. **Infraestructura** (la app): sección `/[lang]/leer` — catálogo por nivel, lector con diccionario emergente, progreso a la capa de evidencia MCER, audio TTS por capítulo con las voces aprobadas.
2. **Curaduría PT** (~700k de los 1,9M): dominio público — Eça de Queirós, Camilo, Pessoa (bien muerto en 1935), Almeida Garrett; graduación por nivel medida con el vocabulario acumulado del alumno, no a ojo. Fábulas y cuentos cortos abajo, novela entera arriba (*Os Maias* es el techo C2 natural).
3. **Gate de procedencia**: cada texto con fuente, autor, año de muerte del autor y URL de origen en un manifiesto — nada entra sin los cuatro campos.
4. **Lector karaoke** (requisito de Edu, no extra): audio generado con `/with-timestamps` de ElevenLabs (alineación por carácter) y resaltado sincronizado en el lector. Se pilota con UN texto antes del lote.
5. **Chistes y poemas por nivel — nativos del idioma, jamás traducidos**: se escriben (no hay dominio público graduado) → pasan por el lingüista adversarial de su lengua ANTES de publicarse. Sin excepción: es la lección más cara ya pagada.
6. RO/CS/RU **esperan a que PT esté terminado** (decisión secuencial). Cuando toquen: Creangă/Eminescu/Caragiale · Němcová/Hašek · Chéjov/Pushkin — y sus chistes, comidas y mundo PROPIOS.

### Ola V — verificación del corpus PT existente

1.827 `unchecked` no se verifican a mano uno a uno: se **triagean por regla** (los guards de variante ya existen: `scripts/lib/variant-guard.ts`) y lo que la regla no decide va a la cola humana que ya existe (`needs-human`). Meta realista: bajar `unchecked` a <500 por regla, y aceptar que la cola humana espera al nativo. **No bloquea nada más.**

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
