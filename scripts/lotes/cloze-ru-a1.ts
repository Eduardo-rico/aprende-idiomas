// scripts/lotes/cloze-ru-a1.ts — EL PRIMER LOTE RUSO: cloze derivado, A1.
//
//   npx tsx scripts/lotes/cloze-ru-a1.ts          # gates + tabla + estrategias
//   npx tsx scripts/lotes/cloze-ru-a1.ts --json   # ítems para publicar
//
// ONCE ítems de `u4-declinacion-singular` (A1, `paradigma` → cloze con
// pista, piso 8). La respuesta NO se escribe: la deriva `casillaNominal()` /
// `prepositivoSg()` desde `lexicon-a1.ts`.
//
// ══ LO QUE ESTE LOTE EXAMINA, Y LO QUE DA POR DADO ═══════════════════
//
// `capas: { examina: 'declinacion', dadas: ['caso', 'genero', 'grafia'] }`.
// Las dos mitades de eso son gates y no buenas intenciones:
//
//   · **el CASO va DADO**, escrito en la pista con su nombre. Si no, el
//     ítem mide `u4-que-es-el-caso` —«¿qué caso pide el contexto?»— que es
//     otro punto del MISMO bloque y del MISMO nivel. Es el aviso que el
//     relevo del ruso pone delante de este lote: «el ítem tiene que dar el
//     CASO resuelto o mide u4-que-es-el-caso y no la forma».
//   · **el GÉNERO va DADO**, escrito en la pista, y en TODOS los ítems y
//     no sólo donde hace falta. Hace falta de verdad en `ночь` y `дверь`,
//     porque `конь` (m) y `дверь` (f) acaban en la misma letra y la clase
//     no se deriva; pero anotarlo SÓLO ahí convierte la anotación en una
//     pista tipográfica que correlaciona con la 3.ª declinación, que es la
//     clase de fuga que el rumano pagó tres veces (§4.40: el diacrítico, la
//     longitud del adjetivo, la terminación del lema — las tres del
//     SIGNIFICANTE y las tres las cazó el lingüista y no el autor).
//     Constante en los once, no puede separar nada.
//
// Género + terminación determinan la declinación **en los cuarenta lemas de
// `lexicon-a1.ts` y en las cinco clases regulares**, y eso es lo que hace que
// dar el género sea suficiente: la declinación la deriva el alumno de dos
// cosas que ya tiene enseñadas (`u3-genero-por-terminacion` es prerrequisito).
// Lo que NO tiene es la TABLA DE DESINENCIAS de cada declinación en cada caso,
// y eso es el punto.
//
// ⚠ Y LA FRASE ANTERIOR SIN ESA ACOTACIÓN ERA MEDIA REGLA, con los
// contraejemplos entre las palabras más frecuentes del idioma. Lo cazó el
// lingüista y va medido: `пути` 441 y `путём` 165 + 48 con ё —`путь` es
// masculino en `-ь` y va por la 3.ª en todo el singular MENOS el
// instrumental—; `матери` 1.531 y `дочь`, que meten `-ер-`; `времени` 1.966 e
// `имени` 466, neutros en `-я` heteróclitos. La máquina no los produce mal
// porque no están en el lexicón, pero esta cabecera es **contenido
// publicado**, y quien la lea derivará `*путе` y `*времем`. Es la misma mina
// que el `abierto` del punto documenta para el segundo locativo («la regla de
// prepositivo escrita aquí produce *в лесе»), con otro nombre. El aviso cuesta
// una subordinada y aquí está.
//
// ══ LA DEFENSA ES ESTRUCTURAL: CINCO PARES MÍNIMOS DE MARCO ══════════
//
// A n = 11 la nula por permutación no puede rechazar nada (§4.41 rumano:
// medido a n = 8 con p = 0,076 sobre un atajo PLANTADO al 100 %), así que
// no se corre y no se finge que su verde valdría algo. Lo que protege al
// lote es la ESTRUCTURA (§4.40): **cada ítem no-frontera vive en un par que
// comparte la frase entera y el caso, y sólo cambia el lema.** Dentro de un
// par, toda propiedad del marco —longitud, preposición, verbo, orden,
// ortografía visible, posición del hueco, la etiqueta de la consigna— es
// CONSTANTE y no puede separar las dos respuestas. Y el invariante que lo
// hace computable: **las dos respuestas de un par tienen que ser
// DISTINTAS**; si coinciden, el par no contrasta nada.
//
// ══ LOS TRES EJES QUE VARÍAN, Y POR QUÉ NO SON UNO ═══════════════════
//
//   · entre pares, el CASO (prep, dat, instr, gen) y el GÉNERO;
//   · dentro del par, la CLASE: 1.ª/2.ª/3.ª declinación y tema duro/blando;
//   · y el ítem 11, que es la FRONTERA (§0.6): el acusativo de la 3.ª
//     declinación, donde la regla del punto NO se aplica y la respuesta es
//     el lema sin tocar.
//
// La operación «añadir una desinencia» es invariante en los diez primeros y
// eso es propiedad de la LENGUA, no una decisión mía: en el singular ruso no
// hay casilla sin desinencia salvo el nominativo y el acusativo que lo
// copia — y ésa es exactamente la que el ítem 11 examina. Es el caso
// `r3-negacion-antepuesta` del rumano (invariancia legítima) y no el caso
// `r2-numerales-de` (invariancia fabricada por el autor).
//
// ══ LO QUE NO ESTÁ AQUÍ, CON SU MOTIVO ══════════════════════════════
//
//   · **Ningún ítem de prepositivo con в/на, y va en GATE.** `лес`, `сад`,
//     `берег` y `пол` toman el SEGUNDO LOCATIVO tónico (`в лесу́` 381 frente
//     a `в лесе` 3) y eso es dato LÉXICO: un ítem que lo pidiera mediría
//     `lexico` y no `declinacion`, y un ítem que lo ignorara publicaría
//     `*в лесе`. El `abierto` del punto pedía literalmente que esto «no se
//     deje al criterio de quien escriba el lote: va en gate».
//   · **Ningún ítem del acusativo MASCULINO.** Ahí la casilla la decide la
//     animacidad, que es `u5-animacidad-acusativo` y es A2: el ítem cargaría
//     una capa que nadie ha enseñado todavía. El neutro y la 3.ª declinación
//     copian el nominativo sin consultar la animacidad, y por eso la
//     frontera vive en la 3.ª.
//   · **El masculino de la 2.ª sólo aparece en prepositivo y dativo**: no hay
//     genitivo ni instrumental masculinos, y el reparto de género del lote es
//     6 f · 3 m · 2 n + 1. Peor, y lo señaló el lingüista (D3): **el error
//     diana que el propio punto declara en su campo `gratis` —«el alumno
//     reconoce `университет` entero y por eso cree que la palabra está
//     resuelta, cuando lo que le falta es `в университете`»— no tiene un solo
//     ítem.** `в университете` sale 116 veces en la biblioteca y
//     `университет` no está en `lexicon-a1.ts`. No se cierra aquí porque
//     meter el lema es trabajo de máquina y no de lote, y ningún gate
//     denuncia hoy que la forma declarada como diana de un punto quede sin
//     cubrir — eso es un hueco del instrumental, no de este fichero, y queda
//     escrito para que el siguiente no lo redescubra.
//   · **Ningún ítem de tema `-ия/-ий/-ие`**, que es la otra frontera real
//     (el prepositivo va `-ии` y no `-е`): no hay un solo lema de esa clase
//     en `lexicon-a1.ts`. Se escribe en vez de disimularse — declarar la
//     cobertura de una frontera que no existe sería el gate declarado y
//     ausente.
import {
  NOMBRES_A1,
} from '../../lib/data/languages/ru/lexicon-a1';
import {
  casillaNominal, prepositivoSg, variantesInstrSgFem, declinacionDe,
  type CasoRu, type EntradaNominal,
} from '../../lib/data/languages/ru/paradigma-ru';
import { revisarOrtografiaRu, quitarAcento } from '../../lib/lang/ortografia-ru';
import { buscar, corpus, INI, FIN } from '../corpus-ru';
import { candidatasConYo } from '../check-paradigma-ru';

export interface ClozeRu {
  /** El punto del inventario al que cuenta. */
  p: string;
  /** El lema, tal como está en `lexicon-a1.ts`. La respuesta se DERIVA. */
  lema: string;
  caso: CasoRu;
  /** OBLIGATORIO en el prepositivo, y la firma es el invariante: no existe
   *  «el prepositivo» de un sustantivo con segundo locativo. Ver
   *  `prepositivoSg()`. */
  regente?: 'о' | 'в' | 'на' | 'при';
  /** La frase, con `___` y el lema entre paréntesis. */
  s: string;
  /** La pista: NOMBRA el caso y el género —las dos capas DADAS— y no dice
   *  nada del tema ni de la declinación, que es lo que examina. */
  pista: string;
  /** Trozo literal de la frase que fija el caso (la preposición o el
   *  regente léxico). */
  ancla: string;
  /** La etiqueta del PAR DE MARCO. Los dos ítems de un par comparten la
   *  frase entera salvo el lema, y el caso. `undefined` sólo en la
   *  frontera. */
  par?: string;
  /** Motivo ESCRITO, y sólo aquí la respuesta puede ser el lema sin tocar.
   *  Es el ítem de sobreaplicación del §0.6. */
  frontera?: string;
}

export const ITEMS: ClozeRu[] = [
  // ── PAR 1 · PREPOSITIVO con `о` — 2.ª declinación dura frente a 3.ª ──
  // `о друге` 9 · `друге` 44 · `о ночи` 1 · `ночи` 1053.
  //
  // ⚠ LA v0 PONÍA `книга` AQUÍ y las dos del par eran FEMENINAS. Lo cambió el
  // dictamen del lingüista (D3): con `книга` el masculino de la 2.ª aparecía
  // en un solo caso de todo el lote —el dativo—, sin prepositivo, sin
  // genitivo y sin instrumental, y el reparto de género quedaba 7 f · 2 m ·
  // 2 n con la 1.ª declinación sobrerrepresentada. `книга` no se pierde: pasa
  // al par 6, donde su acusativo hace un trabajo que antes no hacía nadie.
  { p: 'u4-declinacion-singular', lema: 'друг', caso: 'prep', regente: 'о', par: 'prep-o',
    s: 'Он долго думал о ___ (друг).', pista: 'amigo (masculino) — prepositivo singular', ancla: 'думал о' },
  // ⚠ Y LO QUE ESTE PAR MIDE NO ES «el prepositivo en dos clases» (D6): `ночи`
  // es genitivo, dativo Y prepositivo singular a la vez, así que la palabra
  // «prepositivo» de la pista no hace ningún trabajo en el segundo ítem — el
  // alumno no puede fallar eligiendo otra oblicua. En el primero sí lo hace
  // (`друге` frente a `друга`, `другу`, `другом`). Lo que el par mide es «el
  // oblicuo de la 3.ª declinación es `-и`», que es un hecho más barato que el
  // que la etiqueta promete, y va dicho.
  { p: 'u4-declinacion-singular', lema: 'ночь', caso: 'prep', regente: 'о', par: 'prep-o',
    s: 'Он долго думал о ___ (ночь).', pista: 'noche (femenino) — prepositivo singular', ancla: 'думал о' },

  // ── PAR 2 · DATIVO con `к` — 2.ª declinación, tema duro frente a blando ──
  // Los dos son masculinos animados de la 2.ª: el eje es el TEMA, y la
  // respuesta se separa en una letra (`-у` / `-ю`). `к студенту` 3 ·
  // `студенту` 26 · `к учителю` 13 · `учителю` 57.
  //
  // ⚠ EL MARCO EMPEZABA POR `Утром` Y ESO ERA UNA FUGA ENTRE ÍTEMS. Lo cazó
  // el lingüista y es del SIGNIFICANTE puro: `утром` es el INSTRUMENTAL
  // SINGULAR de `утро` —neutro, tema duro, desinencia `-ом`—, o sea la
  // casilla exacta que pide el par 3 (`окно` → `окном`), escrita en
  // mayúscula y en posición inicial dos ítems antes. G6 sólo mira la frase
  // del PROPIO ítem; no había ningún gate entre ítems, y ahora lo hay
  // (`G16`) con este caso como testigo rojo. `Вчера он` 22.
  { p: 'u4-declinacion-singular', lema: 'студент', caso: 'dat', par: 'dat-k',
    s: 'Вчера он пошёл к ___ (студент).', pista: 'estudiante (masculino) — dativo singular', ancla: 'пошёл к' },
  { p: 'u4-declinacion-singular', lema: 'учитель', caso: 'dat', par: 'dat-k',
    s: 'Вчера он пошёл к ___ (учитель).', pista: 'maestro (masculino) — dativo singular', ancla: 'пошёл к' },

  // ── PAR 3 · INSTRUMENTAL con `за` — el NEUTRO, duro frente a blando ──
  // `за окном` 37 · `за морем` 15.
  //
  // Es la rama ÁTONA de la regla de la /o/ de la desinencia, y decirlo así
  // importa porque la regla tiene TRES grafías y no dos (§15 del relevo, que
  // se titula «UNA SOLA REGLA CON TRES GRAFÍAS»): tema duro siempre `о`
  // (столо́м, ме́стом); tema blando tónica `ё` y átona `е` (конём frente a
  // учи́телем); sibilante y `ц`, tónica `о` y átona `е` (врачо́м frente a
  // това́рищем, лицо́ frente a се́рдце). Este par instancia sólo `-ом`/`-ем`,
  // o sea el tema duro contra el blando átono. **La rama de la ё no está en
  // el lote**, y va escrito en vez de disimulado: un par con `конь` pediría
  // `конём`, y el acento de esa desinencia es dato del lexicón, no regla —
  // el ítem mediría `lexico`. La v0 de esta cabecera escribía la regla con
  // dos grafías y lo cazó el lingüista.
  //
  // ⚠ Y UN RIESGO DECLARADO, que es el único del lote donde el distractor no
  // es una casilla mal elegida sino OTRA LECTURA SINTÁCTICA (D1 del
  // dictamen): `что за` + NOMINATIVO es ruso vivo y frecuentísimo («¿qué
  // clase de X?»), medido `что это за` 268, y en neutro el nominativo es el
  // lema, así que `Что там за окно?` es una frase correcta — y es justo la que
  // produce la ruta `copiar-el-lema`. Lo que lo cierra es la COMA, y la coma
  // funciona: medido `что там, за` 2, y las dos son `за` + instrumental
  // («что там, за острогом»). Más la pista, que nombra el caso. El ítem queda
  // determinado, pero **aquí la pista es PORTANTE de una forma en que no lo es
  // en los otros diez**: si un formato de repaso llegara a mostrar la frase sin
  // ella, el ítem admitiría dos respuestas. Eso es una condición del PRODUCTO
  // y no del contenido, y el proyecto ya la pagó una vez —el repaso del
  // portugués no enseñaba la respuesta en 1.640 de 2.131 ejercicios—, así que
  // va escrita aquí en vez de confiada. `за` es además la única preposición
  // atestada con LOS DOS lemas (`за окном` 37 · `за морем` 15; con `перед` y
  // `рядом с`, `море` da 0), o sea que el marco no se puede cambiar sin perder
  // el par.
  { p: 'u4-declinacion-singular', lema: 'окно', caso: 'instr', par: 'instr-za',
    s: 'Что там, за ___ (окно)?', pista: 'ventana (neutro) — instrumental singular', ancla: 'за' },
  { p: 'u4-declinacion-singular', lema: 'море', caso: 'instr', par: 'instr-za',
    s: 'Что там, за ___ (море)?', pista: 'mar (neutro) — instrumental singular', ancla: 'за' },

  // ── PAR 4 · GENITIVO con `из` — 1.ª declinación, tema duro frente a blando ──
  // El reparto `-ы`/`-и` es de TEMA y no ortográfico: una regla que lo
  // decidiera por la letra anterior produce `*деревны`, que es una de las
  // cuatro formas con las que el lingüista tumbó la v0 de
  // `u3-plural-nominativo`. `из школы` 21 · `из деревни` 131 · `деревни` 395
  // · `*деревны` 0.
  //
  // ⚠ Y LA v0 DE ESTA CABECERA DECÍA «ES EL ÍTEM MÁS DISCRIMINANTE DEL
  // LOTE». Lo refuta la salida del propio script: el perfil
  // `mitad-dura-mas-ablandamiento` **acierta** este ítem, porque el pareo
  // `ы↔и` es exactamente la capa `grafia` que este punto declara DADA. O sea
  // que el contraste interno de este par lo resuelve un prerrequisito, y
  // eso vale igual para el par 2 (`у↔ю`) y el par 3 (`о↔е`): **tres de los
  // seis pares tienen su contraste interno resuelto por una capa dada.** Lo
  // que queda como contenido propio del punto son las cinco casillas duras y
  // las tres de la 3.ª declinación, que es el único sitio donde ablandar no
  // llega. El número honesto está en la tabla de rutas, no aquí.
  { p: 'u4-declinacion-singular', lema: 'школа', caso: 'gen', par: 'gen-iz',
    s: 'Она вернулась из ___ (школа).', pista: 'escuela (femenino) — genitivo singular', ancla: 'вернулась из' },
  { p: 'u4-declinacion-singular', lema: 'деревня', caso: 'gen', par: 'gen-iz',
    s: 'Она вернулась из ___ (деревня).', pista: 'aldea (femenino) — genitivo singular', ancla: 'вернулась из' },

  // ── PAR 5 · INSTRUMENTAL FEMENINO — 1.ª frente a 3.ª, y el ERROR SIMÉTRICO ──
  // Dos cosas a la vez:
  //
  //   · `сестрой` admite la variante del XIX en `-ою`, que la máquina NO
  //     produce y que la biblioteca escribe a todas horas: `сестрой` 148 ·
  //     `сестрою` 31 (17 %). Exigir sólo `-ой` suspendería a quien escribe el
  //     ruso que el material de inmersión le ha enseñado — el error
  //     simétrico. Las alternativas NO se escriben a mano: las calcula
  //     `variantesInstrSgFem()`, que lleva la casilla en el nombre porque en
  //     el adjetivo esa misma desinencia ocupa cuatro casillas y la variante
  //     larga existe sólo en el instrumental.
  //   · y el rival es la **3.ª declinación** (`дверью` 381) y no un femenino
  //     blando de la 1.ª, que era la v0 (`деревней`). El cambio lo pidió el
  //     PERFIL «mitad dura + ablandamiento»: con `деревней` ese perfil
  //     acertaba el par entero, porque `-ей` se obtiene ablandando `-ой`.
  //     `-ью` no se obtiene ablandando nada.
  //
  // ⚠ Y LO QUE QUEDA ABIERTO, con su medida: la 3.ª declinación tiene su
  // propia variante con fecha, `-ию`, atestada en la biblioteca (`смертию`
  // 27 · `властию` 12 · `кровию` 7). `дверию` 0 y `ночию` 0, así que la clave
  // del ítem 10 no está mal —la ausencia no prohíbe, y tampoco obliga a
  // aceptar—, pero la asimetría es real: el alumno que ha leído `смертию`
  // tiene el patrón. Los tres lemas atestados son abstractos y eclesiásticos
  // y `дверь` es concreto, que es la única razón por la que no se acepta hoy.
  // Decisión de lengua pendiente, no hueco olvidado.
  { p: 'u4-declinacion-singular', lema: 'сестра', caso: 'instr', par: 'instr-s',
    s: 'Что случилось с ___ (сестра)?', pista: 'hermana (femenino) — instrumental singular', ancla: 'случилось с' },
  { p: 'u4-declinacion-singular', lema: 'дверь', caso: 'instr', par: 'instr-s',
    s: 'Что случилось с ___ (дверь)?', pista: 'puerta (femenino) — instrumental singular', ancla: 'случилось с' },

  // ── PAR 6 · ACUSATIVO — la 1.ª declinación AÑADE, la 3.ª COPIA ─────────
  // ⚠ ESTE PAR ES LA CORRECCIÓN DEL DICTAMEN QUE MÁS CAMBIA EL LOTE (D4). La
  // v0 tenía el acusativo de `дверь` SOLO, como frontera suelta, y el
  // lingüista mostró que sus distractores no eran alcanzables desde el lote:
  // el error que la literatura РКИ documenta en esa casilla es `*дверю`, por
  // analogía con `книгу`/`школу`, **y el lote no tenía un solo acusativo de
  // 1.ª declinación**, así que la analogía que dispara ese error nunca se
  // presentaba. La celda `f.ac = 'у'` existía en la tabla de rutas y no se
  // ejercitaba en ningún ítem.
  //
  // Emparejado, el mismo marco pide las dos caras: `книгу` añade `-у` y
  // `дверь` no añade nada. La frontera del §0.6 deja de ser un apéndice
  // cosido y pasa a ser **la segunda cara del propio par**, que es el mejor
  // sitio donde puede estar. `открыл книгу` 2 · `книгу` 601 · `открыл дверь`
  // 5 · `дверь` 2567 · `медленно открыл` 1.
  { p: 'u4-declinacion-singular', lema: 'книга', caso: 'ac', par: 'ac-otkryl',
    s: 'Он медленно открыл ___ (книга).', pista: 'libro (femenino) — acusativo singular', ancla: 'открыл' },
  { p: 'u4-declinacion-singular', lema: 'дверь', caso: 'ac', par: 'ac-otkryl',
    s: 'Он медленно открыл ___ (дверь).', pista: 'puerta (femenino) — acusativo singular', ancla: 'открыл',
    frontera: 'LA SOBREAPLICACIÓN (§0.6), y ahora con su distractor al lado. Los diez ítems de los pares 1-5 enseñan «al caso se le añade una desinencia» y su pareja de este mismo par lo confirma en la 1.ª declinación (книга → книгу); aquí NO se añade nada, porque el acusativo de la 3.ª es el nominativo, animado o no (вижу мать, о мать). El error que dispara el par es *дверю, por analogía directa con книгу escrita en el marco de al lado, y es el que la literatura РКИ documenta en esta casilla. Es el único ítem del lote cuya respuesta ES el lema, y el gate exige que sea el único y que traiga este motivo escrito. Su valor DISCRIMINANTE es cero —`copiar-el-lema` lo acierta y el paréntesis lleva la respuesta escrita— y su valor es didáctico: eso va dicho y no se le llama «el ítem que el lote mide de verdad».',
  },
];

const NOM = new Map(NOMBRES_A1.map((e) => [e.lema, e]));

export function entradaDe(x: ClozeRu): EntradaNominal | undefined { return NOM.get(x.lema); }

/** LA RESPUESTA, DERIVADA. El prepositivo va por `prepositivoSg()` con su
 *  regente: `paradigmaNominal().prepDeO` para una frase con в/на es el
 *  fallo que este proyecto tiene documentado con nombre. */
export function respuestaDe(x: ClozeRu): string | null {
  const e = entradaDe(x);
  if (!e) return null;
  if (x.caso === 'prep') return x.regente ? prepositivoSg(e, x.regente) : null;
  return casillaNominal(e, x.caso, 'sg');
}

/** Las respuestas correctas ALTERNATIVAS, calculadas y nunca declaradas.
 *  Hoy sólo la variante `-ою/-ею` del instrumental singular femenino. */
export function alternativasDe(x: ClozeRu): string[] {
  const e = entradaDe(x);
  const r = respuestaDe(x);
  if (!e || !r) return [];
  if (x.caso === 'instr' && e.genero === 'f' && declinacionDe(e) === 1) return variantesInstrSgFem(r);
  return [];
}

const sinParentesis = (s: string) => s.replace(/\([^)]*\)/g, ' ');
const PALABRA = (w: string) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu');

export function verificar(items: ClozeRu[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const porPunto = new Map<string, Map<string, number>>();

  for (const [i, x] of items.entries()) {
    const id = `CLRU-${String(i + 1).padStart(3, '0')} (${x.lema} ${x.caso})`;
    const e = entradaDe(x);
    if (!e) { v.push(`${id}: «${x.lema}» no está en lexicon-a1.ts`); continue; }
    // ⚠ EL REGENTE SE COMPRUEBA ANTES DE ABANDONAR POR `null`, y no es
    // cosmética: `prepositivoSg()` no se puede llamar sin regente, así que
    // un prepositivo que no lo declare devuelve `null`, cae por el
    // `continue` de abajo y **el gate del regente no llega a correr nunca**.
    // Su testigo rojo lo destapó en el primer intento: el gate existía,
    // estaba bien escrito, y era inalcanzable. Es §0.8 rumano —dos
    // comprobaciones independientes no pueden compartir un `continue`— y sin
    // el testigo habría quedado como un gate vivo que no dispara jamás.
    if (x.caso === 'prep' && !x.regente)
      v.push(`${id}: prepositivo sin regente declarado — no existe «el prepositivo» de un lema con segundo locativo`);
    if (x.caso !== 'prep' && x.regente) v.push(`${id}: declara regente en un caso que no es el prepositivo`);
    if (e.locativo2 && x.caso === 'prep')
      v.push(`${id}: «${x.lema}» tiene segundo locativo (${e.locativo2.regente} ${e.locativo2.forma}) — un ítem de prepositivo con este lema mide «lexico», no «declinacion»`);

    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: la máquina devuelve null para esa casilla — no se inventa una forma plausible`); continue; }
    const alt = alternativasDe(x);

    // G1 · un solo hueco.
    const huecos = x.s.split('___').length - 1;
    if (huecos !== 1) v.push(`${id}: ${huecos} huecos, tiene que haber 1`);
    // G2 · el lema, entre paréntesis y escrito igual.
    if (!new RegExp(`\\(\\s*${x.lema}\\s*\\)`).test(x.s)) v.push(`${id}: la frase no nombra el lema «${x.lema}» entre paréntesis`);
    // G3 · la pista NOMBRA las dos capas dadas y NO la examinada.
    const CASOS_ES: Record<CasoRu, string> = { nom: 'nominativo', ac: 'acusativo', gen: 'genitivo', dat: 'dativo', instr: 'instrumental', prep: 'prepositivo' };
    if (!x.pista.includes(CASOS_ES[x.caso])) v.push(`${id}: la pista no nombra el caso «${CASOS_ES[x.caso]}» — sin él el ítem mide u4-que-es-el-caso`);
    const GEN_ES: Record<string, string> = { m: 'masculino', f: 'femenino', n: 'neutro' };
    if (!x.pista.includes(GEN_ES[e.genero]!)) v.push(`${id}: la pista no nombra el género «${GEN_ES[e.genero]}», que es capa DADA`);
    if (/\b(duro|blando|sibilante|declinaci[oó]n|tema)\b/i.test(x.pista)) v.push(`${id}: la pista nombra la CLASE, que es justo lo que el ítem examina`);
    // G3c · ⚠ LA PISTA TIENE UNA FORMA CANÓNICA, Y ES UN GATE PORQUE LA v0
    //       ROMPIÓ SU PROPIA REGLA. La cabecera argumentaba en tres párrafos
    //       que el género va anotado en LOS ONCE «y no sólo donde hace falta»,
    //       para que la anotación no correlacione con la 3.ª declinación — y
    //       dos pistas decían «(femenino EN RUSO)» y nueve «(femenino)». No
    //       era explotable dentro del par, y por eso G3 no lo veía: G3 mira
    //       la PRESENCIA del género, no la UNIFORMIDAD de la glosa. Pero la
    //       marca se posaba justo sobre el par que contrasta 1.ª contra 3.ª.
    //       Lo cazó el lingüista. Comprobar presencia y comprobar uniformidad
    //       son dos preguntas, y un sello sólo responde a una.
    if (!new RegExp(`^[^()]+ \\((masculino|femenino|neutro)\\) — (${Object.values(CASOS_ES).join('|')}) singular$`).test(x.pista))
      v.push(`${id}: la pista «${x.pista}» no tiene la forma canónica «<glosa> (<género>) — <caso> singular» — cualquier variación tipográfica de la glosa es una pista del significante`);
    // G4 · ancla declarada y presente.
    if (!x.ancla.trim()) v.push(`${id}: sin ancla declarada`);
    else if (!x.s.includes(x.ancla)) v.push(`${id}: el ancla «${x.ancla}» no está en la frase`);
    // G5 · la pista no deletrea la respuesta.
    for (const cand of [r, ...alt]) if (PALABRA(quitarAcento(cand)).test(x.pista)) v.push(`${id}: la pista deletrea la respuesta «${cand}»`);
    // G6 · la respuesta no está escrita en la frase FUERA del paréntesis del
    //      lema. El paréntesis se quita a propósito: en el ítem de frontera
    //      la respuesta ES el lema, y mirar la frase entera confundiría el
    //      gate de la copia (G9) con éste — dos sellos, dos preguntas.
    if (PALABRA(r).test(sinParentesis(x.s).replace('___', ' '))) v.push(`${id}: la respuesta «${r}» ya está escrita en la frase`);
    // G7b · y el regente declarado tiene que estar DELANTE del hueco: un
    //        regente que sólo vive en el campo no fija ningún caso.
    if (x.caso === 'prep' && x.regente && !PALABRA(x.regente).test(x.s.split('___')[0] ?? ''))
      v.push(`${id}: el regente «${x.regente}» no aparece delante del hueco`);
    // G9 · la respuesta sólo puede ser el lema en el ítem de FRONTERA.
    if (r === x.lema && !x.frontera) v.push(`${id}: la respuesta coincide con el lema y el ítem no declara «frontera» con su motivo — así se contesta copiando y ningún otro gate lo ve`);
    if (x.frontera && r !== x.lema) v.push(`${id}: declara «frontera» y la respuesta no es el lema — la frontera de este punto es la casilla donde NO se añade desinencia`);
    // G10 · el error simétrico: el instrumental femenino de la 1.ª tiene DOS
    //       formas vivas en la biblioteca y las dos son correctas.
    if (x.caso === 'instr' && e.genero === 'f' && declinacionDe(e) === 1 && alt.length === 0)
      v.push(`${id}: instrumental singular femenino sin la variante «-ою/-ею» — exigir sólo «${r}» suspende a quien escribe el ruso atestado de la biblioteca`);
    // G11 · ortografía y homóglifos en todo lo que el alumno ve.
    for (const [campo, t] of [['frase', x.s], ['pista', x.pista], ['respuesta', r], ['alternativas', alt.join(' ')]] as const)
      for (const h of revisarOrtografiaRu(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // G12 · LA Ё. Si la respuesta lleva «е» donde la lengua escribe «ё», la
    //       máquina está produciendo otra palabra y `contar()` no puede
    //       verlo porque funde las dos grafías.
    for (const c of candidatasConYo(r)) v.push(`${id}: la respuesta «${r}» tiene variante con ё atestada («${c.forma}» ${c.n}) — la regla del proyecto es producir con ё siempre`);
    // G13 · toda respuesta atestada.
    const n = buscar(quitarAcento(r)).n;
    if (n === 0) v.push(`${id}: la respuesta «${r}» no aparece ni una vez en 7,7 M de palabras`);
    // G14 · ninguna respuesta se repite dentro del punto.
    const m = porPunto.get(x.p) ?? new Map<string, number>();
    m.set(r, (m.get(r) ?? 0) + 1); porPunto.set(x.p, m);
    const clave = x.s.replace(/\s+/g, ' ').trim().toLowerCase();
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
  }

  for (const [p, m] of porPunto) for (const [r, k] of m) if (k > 1) v.push(`${p}: la respuesta «${r}» sale ${k} veces`);

  // G15 · LOS PARES DE MARCO. Es el invariante estructural del que cuelga
  //       todo lo demás: a n = 11 la nula por permutación no rechaza nada
  //       (§4.41), así que lo que protege al lote es que dentro de un par
  //       toda propiedad del marco sea constante — y eso sólo vale si el
  //       marco es LITERALMENTE el mismo y las dos respuestas DIFIEREN.
  const pares = new Map<string, ClozeRu[]>();
  for (const x of items) if (x.par) { const a = pares.get(x.par) ?? []; a.push(x); pares.set(x.par, a); }
  for (const x of items) if (!x.par && !x.frontera) v.push(`${x.lema} ${x.caso}: ítem sin par de marco y sin declarar frontera`);
  for (const [k, xs] of pares) {
    if (xs.length !== 2) { v.push(`par «${k}»: ${xs.length} ítems — un par de marco son DOS`); continue; }
    const [a, b] = xs as [ClozeRu, ClozeRu];
    const marco = (x: ClozeRu) => x.s.replace(`(${x.lema})`, '(·)');
    if (marco(a) !== marco(b)) v.push(`par «${k}»: los dos marcos no son idénticos («${marco(a)}» / «${marco(b)}») — si el marco varía, cualquier propiedad suya puede separar las clases`);
    if (a.caso !== b.caso) v.push(`par «${k}»: los dos ítems no están en el mismo caso`);
    const ra = respuestaDe(a), rb = respuestaDe(b);
    if (ra && rb && ra === rb) v.push(`par «${k}»: las dos respuestas son «${ra}» — el par no contrasta nada y una ruta ciega acierta las dos`);
    if (a.lema === b.lema) v.push(`par «${k}»: el mismo lema en los dos ítems`);
  }
  // ══ G16 · LA FUGA ENTRE ÍTEMS, QUE NINGÚN GATE POR ÍTEM PUEDE VER ════
  //
  // ⚠ LO CAZÓ EL LINGÜISTA SOBRE LA v0 Y ERA LA CADENA LITERAL. El marco del
  // par 2 empezaba por `Утром`, y `утром` es el INSTRUMENTAL SINGULAR de
  // `утро` —neutro, tema duro, desinencia `-ом`—, o sea exactamente la
  // casilla que pide el par 3 (`окно` → `окном`): la respuesta-patrón de un
  // par escrita en el marco de otro, en mayúscula y en posición inicial, dos
  // ítems antes. G6 comprueba que la respuesta no esté en SU PROPIA frase;
  // entre ítems no había nada.
  //
  // Y LO QUE ESTE GATE NO MIRA, escrito en vez de supuesto: sólo las
  // desinencias que son inequívocamente nominales (`-ом -ем -ой -ей -ою -ею
  // -ью`). `-е`, `-и`, `-у`, `-ы` son también desinencias VERBALES —
  // `думал`, `случилось`, `открыл` no, pero `говорит`, `идёте`, `думаю` sí—,
  // así que un gate que las marcara marcaría medio lote por ruido, y un gate
  // ruidoso es un gate apagado. Un verificador sólo caza en las dimensiones
  // que su modelo representa, y sobre lo que no modela calla: aquí se dice
  // cuáles son.
  const DESINENCIAS_INEQUIVOCAS = ['ою', 'ею', 'ью', 'ом', 'ем', 'ой', 'ей'];
  const respuestas = new Set(items.map((x) => respuestaDe(x)).filter(Boolean) as string[]);
  for (const x of items) {
    const marco = sinParentesis(x.s).replace('___', ' ');
    for (const w of marco.split(/[^\p{L}]+/u).filter((t) => t.length >= 4)) {
      const wl = w.toLowerCase();
      if (respuestas.has(wl)) { v.push(`${x.lema} ${x.caso}: el marco contiene «${w}», que es la RESPUESTA de otro ítem del lote`); continue; }
      const des = DESINENCIAS_INEQUIVOCAS.find((d) => wl.endsWith(d));
      if (des && [...respuestas].some((r) => r.endsWith(des)))
        v.push(`${x.lema} ${x.caso}: el marco contiene «${w}», que acaba en «-${des}» — la misma desinencia nominal que la respuesta de otro ítem, y eso es una pista del significante entre ítems`);
    }
  }

  // Un solo ítem de frontera: dos harían de «no tocar la forma» una
  // estrategia con dos aciertos y de la copia una ruta rentable.
  const fronteras = items.filter((x) => x.frontera).length;
  if (fronteras !== 1) v.push(`el lote declara ${fronteras} ítems de frontera — la sobreaplicación del §0.6 se enseña con UNO`);

  return v;
}

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS, CON SU NÚMERO PREDICHO ESCRITO ANTES DE CORRER
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ EL NÚMERO PREDICHO NO ES ADORNO: ES EL ÚNICO TESTIGO POSIBLE. Un gate
// muerto se caza con un testigo rojo; una RUTA muerta no, porque su «rojo»
// es acertar y acertar poco es justo lo que se busca. Un cero puede ser «no
// hay fuga» o «mi simulación se apagó», y son cosas opuestas —en el rumano
// pasó tres veces—. `tests/unit/cloze-ru-a1.test.ts` compara la predicción
// con lo observado y comprueba además que cada ruta devuelve algo distinto
// de `null` donde debe aplicarse.
//
// Y `correr()` construye la VISTA DEL ALUMNO: la ruta no recibe la respuesta
// ni la entrada del lexicón, así que no puede leerla «ni con un `as`» — un
// tipo estructural protege a quien escribe, no al objeto. El género lo lee
// de la PISTA, que es donde el alumno lo tiene; consultarlo en el lexicón
// sería darle a la ruta más de lo que él ve.
//
// ══ Y SON DOS LISTAS, NO UNA, PORQUE RESPONDEN A DOS PREGUNTAS ═══════
//
//   · `ESTRATEGIAS` — rutas CIEGAS: el alumno las ejecuta **sin haber
//     aprendido nada de este punto**, porque lo que necesitan lo trae de sus
//     dos lenguas o de contar. Éstas van contra el tope del 50 %, que ahí es
//     el criterio correcto.
//   · `PERFILES` — conocimiento PARCIAL: presuponen la tabla de desinencias,
//     que es el contenido del punto. **No van contra ningún tope**, y
//     medirlas sirve para otra cosa: su número dice CUÁNTOS ítems del lote
//     discriminan de verdad contra un alumno a medio camino, y CUÁLES.
//     Confundir las dos listas sería un sello respondiendo la pregunta de
//     otro — y subir un tope porque un perfil lo pasa es falsear el
//     termómetro, igual que bajarlo por un ciego sería falsear el examen.
//
// El perfil que más enseña es el segundo, y no estaba escrito en la v0: la
// tabla dura MÁS el pareo de vocales dura/blanda (а↔я, о↔е, у↔ю, ы↔и), que
// es capa DADA de este punto (`u2-palatalizacion-escrita`, A1). Con una sola
// idea resuelve las dos filas y por eso hay que medirlo: es la lección del
// lote 24 rumano —«enumerar las rutas no es enumerar las que se te ocurren,
// es enumerar las COMPOSICIONES de las que se te ocurren con la morfología
// que el alumno ya trae»—. Lo que NO resuelve es la 3.ª declinación, porque
// `-и` y `-ью` no se obtienen ablandando ninguna desinencia dura.

export interface Vista { s: string; pista: string; lema: string; caso: CasoRu }
export const vista = (x: ClozeRu): Vista => ({ s: x.s, pista: x.pista, lema: x.lema, caso: x.caso });

/** Quitar la vocal final o el signo blando: es lo que un alumno hace para
 *  «llegar al tema» sin saber cuál es el tema. */
const raiz = (lema: string) => (/[аяоеьй]$/.test(lema) ? lema.slice(0, -1) : lema);
/** El género que la pista le REGALA al alumno, leído de la pista y no del
 *  lexicón: una ruta que consultara el lexicón sabría más que él. */
const generoDeLaPista = (p: string): 'm' | 'f' | 'n' | null =>
  p.includes('femenino') ? 'f' : p.includes('neutro') ? 'n' : p.includes('masculino') ? 'm' : null;

/** La tabla de desinencias DURAS por género y caso. Es la mitad del punto y
 *  vive en UN sitio: los dos perfiles la importan de aquí en vez de
 *  copiarla, que es la regla duplicada que falla en la copia N+1. */
const DURAS: Record<'m' | 'f' | 'n', Partial<Record<CasoRu, string>>> = {
  f: { prep: 'е', dat: 'е', instr: 'ой', gen: 'ы', ac: 'у' },
  m: { prep: 'е', dat: 'у', instr: 'ом', gen: 'а', ac: 'а' },
  n: { prep: 'е', dat: 'у', instr: 'ом', gen: 'а', ac: 'о' },
};
/** El pareo dura/blanda de `u2-palatalizacion-escrita`, que es capa DADA. */
const ABLANDA: Record<string, string> = { а: 'я', о: 'е', у: 'ю', ы: 'и', е: 'е' };
const esBlando = (lema: string) => /[ьяеёюй]$/.test(lema);

export interface Ruta {
  nombre: string;
  porQue: string;
  predicho: number;
  correr: (v: Vista) => string | null;
}

export const ESTRATEGIAS: Ruta[] = [
  {
    nombre: 'copiar-el-lema',
    porQue: 'Es también la ruta de TRADUCIR: ni el español mexicano ni el portugués marcan caso en el nombre, así que la única cadena que las dos lenguas del alumno le entregan es el lema desnudo. No se cuenta dos veces con dos nombres: dos sellos no pueden compartir un hallazgo.',
    predicho: 1,
    correr: (v) => v.lema,
  },
  {
    nombre: 'desinencia-fija-por-caso',
    porQue: 'La desinencia más frecuente del singular ruso para cada caso, sin mirar el lema ni el género. No necesita haber aprendido las tres declinaciones: le basta haber visto una tabla y creer que es la única.',
    predicho: 4,
    correr: (v) => {
      const d: Partial<Record<CasoRu, string>> = { prep: 'е', dat: 'у', instr: 'ом', gen: 'а' };
      if (v.caso === 'ac') return v.lema;
      const s = d[v.caso];
      return s === undefined ? null : raiz(v.lema) + s;
    },
  },
];

export const PERFILES: Ruta[] = [
  {
    nombre: 'solo-la-mitad-dura',
    porQue: 'La tabla CORRECTA de los temas duros por caso y género, aplicada también a los blandos y a la 3.ª declinación. Es el alumno que aprendió la mitad del punto, y su número tiene una lectura exacta: dentro de un par de marco acierta UNO de los dos, y con respuesta binaria la mitad es el SUELO y no holgura. Seis de doce, uno por par.',
    predicho: 6,
    correr: (v) => {
      const g = generoDeLaPista(v.pista);
      if (!g) return null;
      const s = DURAS[g][v.caso];
      return s === undefined ? null : raiz(v.lema) + s;
    },
  },
  {
    nombre: 'mitad-dura-mas-ablandamiento',
    porQue: 'La tabla dura MÁS el pareo de vocales dura/blanda, que es capa DADA de este punto. Una sola idea que resuelve las dos filas; lo que no resuelve es la 3.ª declinación, porque -и y -ью no se obtienen ablandando nada. Los ítems que este perfil falla son, por definición, los que el lote mide contra un alumno a medio camino: TRES de doce, y los tres de la 3.ª declinación.',
    predicho: 9,
    correr: (v) => {
      const g = generoDeLaPista(v.pista);
      if (!g) return null;
      const s = DURAS[g][v.caso];
      if (s === undefined) return null;
      const t = raiz(v.lema);
      if (!esBlando(v.lema)) return t + s;
      const prim = ABLANDA[s[0]!];
      return prim === undefined ? t + s : t + prim + s.slice(1);
    },
  },
];

// ══════════════════════════════════════════════════════════════════════
// LA TERCERA LISTA: LA RUTA QUE NO SALE DE SUS DOS LENGUAS, SALE DEL CORPUS
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ LA TRAJO EL LINGÜISTA ADVERSARIAL Y ES EL HALLAZGO MÁS CARO DEL DICTAMEN.
// El lote medía dos rutas ciegas y dos perfiles, y ninguna era la del alumno
// que este proyecto se ha propuesto fabricar: **el que ha leído las 2.180
// lecturas y contesta con la cadena que ha visto detrás de esa preposición.**
// No necesita la tabla de desinencias, ni el género, ni la clase: le basta un
// bigrama. Sobre los 12 ítems da **8, el 67 %**.
//
// (El lingüista la midió en 7 de 11 sobre la v0; con el par 6 añadido son 8 de
// 12, porque `открыл книг…` → `книгу` también es un bigrama. La predicción de
// este fichero decía 7 y el instrumento dijo 8: la diferencia es el ítem
// nuevo, y se corrige leyendo el contador y no ajustando la prosa.)
//
// ¿Va contra el tope del 50 %? **No, y el argumento es el del §4.35 aplicado
// literalmente: el criterio no es «¿esto es la regla del punto?» sino «¿el
// alumno llega ya produciéndolo?».** Este punto es A1, y a A1 el alumno ha
// leído CERO palabras de ruso: la biblioteca es su material de inmersión
// futuro, no conocimiento previo. La ruta necesita haber leído 7,7 M de
// palabras.
//
// Y por eso va en su propia lista y no exenta del tope de las ciegas, porque
// hay dos cosas que sí son verdad y que un «no aplica» taparía:
//
//   1. **Deja de ser inofensiva en cuanto el alumno lee.** El FSRS repite
//      estas tarjetas durante meses y la inmersión corre en paralelo: el día
//      que el alumno lleve un millón de palabras leídas, este lote se le
//      contesta de memoria en 7 de 12. La defensa no es un gate sobre este
//      lote: es que a esas alturas ya no sea éste el material.
//   2. **Enseña un hecho estructural que no estaba escrito en ninguna
//      parte:** una preposición que rige UN SOLO CASO (`о`, `к`, `из`) hace
//      el ítem memorizable como bigrama, porque todas las apariciones de ese
//      lema tras ella son la misma casilla. Con una que rija DOS (`за`,
//      `под`, `в`, `на`) la cuenta se reparte entre dos celdas y la ruta
//      falla — y falla exactamente en los ítems 5 y 6, que son los de `за`
//      (`за окно` 44 frente a `за окном` 37; `за море` 20 frente a `за морем`
//      15). Eso no se arregla eligiendo colocaciones peores: se arregla
//      sabiéndolo al elegir el marco.
//
// La ruta se ejecuta, no se razona. Y se ejecuta sobre la vista del alumno:
// la palabra que precede al hueco y el lema, nada más.

/** La palabra inmediatamente anterior al hueco, que es lo único que la ruta
 *  colocacional necesita: no distingue preposición de verbo a propósito. */
const palabraAnterior = (v: Vista): string | null => {
  const antes = sinParentesis(v.s.split('___')[0] ?? '');
  const toks = antes.split(/[^\p{L}]+/u).filter(Boolean);
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : null;
};

/** La continuación más frecuente de «<palabra anterior> <prefijo…>» en 7,7 M
 *  de palabras. El prefijo es el lema menos su última letra: es lo que un
 *  lector reconoce de la palabra sin saber declinarla. */
const colocacionMasFrecuente = (v: Vista): string | null => {
  const prev = palabraAnterior(v);
  if (!prev) return null;
  const prefijo = v.lema.slice(0, -1);
  const re = new RegExp(`${INI}${prev}\\s+(${prefijo}\\p{L}*)${FIN}`, 'giu');
  const cuenta = new Map<string, number>();
  for (const m of corpus().matchAll(re)) {
    const w = m[1]!.toLowerCase();
    cuenta.set(w, (cuenta.get(w) ?? 0) + 1);
  }
  if (!cuenta.size) return null;
  return [...cuenta].sort((a, b) => b[1] - a[1])[0]![0];
};

export const RUTAS_POR_LECTURA: Ruta[] = [
  {
    nombre: 'memoria-colocacional',
    porQue: 'La cadena más frecuente que sigue a esa palabra en las 2.180 lecturas, entre las que empiezan como el lema. No presupone la tabla, ni el género, ni la clase: presupone HABER LEÍDO. A A1 el alumno ha leído cero palabras de ruso, así que no va contra el tope de las ciegas; deja de ser inofensiva en cuanto lea. Y el hecho que enseña: una preposición de un solo caso hace el ítem memorizable como bigrama; una de dos casos, no.',
    predicho: 8,
    correr: colocacionMasFrecuente,
  },
];

export interface Informe { nombre: string; aciertos: number; n: number; aplicables: number; predicho: number; cuales: number[] }

/** Acierta si y sólo si la TARJETA se la daría por buena: la respuesta o
 *  cualquiera de sus alternativas. Medir con una regla propia mide otra cosa.
 *  Y devuelve CUÁLES, porque un número sin los ítems detrás no se puede
 *  leer: el cero de una ruta y el cero de una ruta apagada son el mismo cero. */
export function correr(items: ClozeRu[], rutas: Ruta[]): Informe[] {
  return rutas.map((es) => {
    let aplicables = 0;
    const cuales: number[] = [];
    for (const [i, x] of items.entries()) {
      const s = es.correr(vista(x));
      if (s === null) continue;
      aplicables++;
      const buenas = [respuestaDe(x), ...alternativasDe(x)].filter(Boolean).map((y) => quitarAcento(y!));
      if (buenas.includes(quitarAcento(s))) cuales.push(i + 1);
    }
    return { nombre: es.nombre, aciertos: cuales.length, n: items.length, aplicables, predicho: es.predicho, cuales };
  });
}

if (/[/\\]cloze-ru-a1\.ts$/.test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, answer: respuestaDe(x), alt: alternativasDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Cloze derivado RU-A1 — ${ITEMS.length} ítems de u4-declinacion-singular\n`);
  console.log('| # | lema | gén | decl | caso | respuesta | alternativas | par |');
  console.log('|--:|---|---|---|---|---|---|---|');
  for (const [i, x] of ITEMS.entries()) {
    const e = entradaDe(x)!;
    console.log(`| ${i + 1} | ${x.lema} | ${e.genero} | ${declinacionDe(e)}ª ${e.tema} | ${x.caso} | **${respuestaDe(x)}** | ${alternativasDe(x).join(', ') || '—'} | ${x.par ?? 'FRONTERA'} |`);
  }
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  const tabla = (titulo: string, rutas: Ruta[], tope: boolean) => {
    console.log(`\n## ${titulo}\n`);
    console.log('| ruta | predicho | observado | % | aplicables | ítems que acierta |');
    console.log('|---|--:|--:|--:|--:|---|');
    for (const r of correr(ITEMS, rutas)) {
      const mal = r.aciertos !== r.predicho ? ' ⚠ NO COINCIDE' : '';
      const pc = Math.round((100 * r.aciertos) / r.n);
      const sobre = tope && r.aciertos / r.n > 0.5 ? ' ⚠ POR ENCIMA DEL TOPE' : '';
      console.log(`| \`${r.nombre}\` | ${r.predicho} | ${r.aciertos}/${r.n}${mal} | ${pc}%${sobre} | ${r.aplicables} | ${r.cuales.join(' ')} |`);
    }
  };
  tabla('Estrategias CIEGAS (tope: la mitad)', ESTRATEGIAS, true);
  tabla('PERFILES de conocimiento parcial (sin tope — dicen qué ítems discriminan)', PERFILES, false);
  tabla('RUTAS POR LECTURA (no van contra el tope a A1: el alumno ha leído cero palabras de ruso)', RUTAS_POR_LECTURA, false);
  const todas = correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]);
  const falla = (n: string) => ITEMS.map((_, i) => i + 1).filter((k) => !todas.find((r) => r.nombre === n)!.cuales.includes(k));
  const fp = falla('mitad-dura-mas-ablandamiento'), fc = falla('memoria-colocacional');
  console.log(`\nItems que falla el perfil más fuerte: ${fp.join(', ')}. Que falla la ruta por lectura: ${fc.join(', ')}.`);
  console.log(`Los falla LAS DOS: ${fp.filter((k) => fc.includes(k)).join(', ') || '—'}.`);
  console.log('La UNIÓN de las dos rutas acertaría 11 de 12, y aun así no es una estrategia:');
  console.log('elegir entre el bigrama y la tabla exige saber cuál de los dos acierta, que es');
  console.log('el punto. Una ruta cuyo nombre y cuyo código no son la misma frase mide otra cosa.');
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: un hueco por ítem, caso y género nombrados en la pista y clase NUNCA,');
  console.log('respuesta derivada por casillaNominal/prepositivoSg, prepositivo con regente y sin');
  console.log('segundo locativo, la variante -ою/-ею aceptada donde existe, ortografía y homóglifos,');
  console.log('la ё sin variante atestada, toda respuesta atestada, SEIS pares de marco idéntico');
  console.log('con respuestas distintas, ninguna desinencia nominal de un ítem escrita en el marco');
  console.log('de otro, la pista con su forma canónica, y UN solo ítem de frontera con su motivo.');
}
