// scripts/lotes/cloze-ru-a1c.ts — EL TERCER LOTE RUSO: cloze derivado, A1.
//
//   npx tsx scripts/lotes/cloze-ru-a1c.ts          # gates + tabla + rutas
//   npx tsx scripts/lotes/cloze-ru-a1c.ts --json   # ítems para publicar
//
// DOCE ítems de `u6-adjetivo-declinado` (A1, `paradigma` → cloze con pista,
// piso 8). Ni la respuesta NI la forma del sustantivo se escriben: las derivan
// `concordar()` y `casillaNominal()` desde `lexicon-a1.ts`. El molde es
// `cloze-ru-a1.ts` / `cloze-ru-a1b.ts` y lo que cambia son los pares, los
// gates propios y las rutas predichas.
//
// ══ LO QUE ESTE LOTE EXAMINA, Y LO QUE DA POR DADO ═══════════════════
//
// `capas: { examina: 'declinacion', dadas: ['caso', 'genero', 'grafia'] }`.
//
// ⚠ LA TERCERA CAPA DADA LA AÑADÍ YO AL INVENTARIO ANTES DE ESCRIBIR UN ÍTEM,
// y el motivo va aquí porque es una corrección de dato: el punto declaraba
// `dadas: ['caso','genero']` y sus cuatro clases —dura, blanda y las dos
// «mixtas»— SON la ortografía. `русским` y `хорошим` se escriben con `и` por
// la regla de la `и` tras velar y sibilante, que es `u1-ortografia-sibilantes`,
// un punto A1 con piso propio. Su hermano `u4-declinacion-singular` —mismo
// `examina`, misma máquina, mismo bloque de problema— ya declaraba
// `['caso','genero','grafia']` y ya traía `u1-ortografia-sibilantes` en sus
// `prereqs`. O sea que los dos puntos de paradigma nominal decían cosas
// distintas sobre la misma capa, y el que callaba era el que no tenía lote. Es
// el A-3 del lote 2 con final distinto: allí la capa (`acento`) no tenía dueño
// PRODUCIBLE y hubo que declarar el hueco en un campo; aquí lo tiene, así que
// se arregla en el inventario en vez de disimularse en un comentario.
//
//   · **EL CASO VA DADO DOS VECES Y NINGUNA DE LAS DOS SOBRA**: en la pista
//     (la etiqueta) y **en la lengua**, por el REGENTE del sintagma —`о`, `у`,
//     `от`, `в`, `из` y el verbo `помогал`—. Sin el regente el ítem mediría
//     `u4-que-es-el-caso`; sin la etiqueta, un ítem con `окна` admitiría leer
//     el sustantivo como nominativo plural (окно → окна) y no estaría
//     determinado.
//   · **EL GÉNERO Y EL NÚMERO VAN DADOS EN EL SUSTANTIVO**, que es el ANCLA y
//     va detrás del hueco. Y no se teclean: el ítem declara el LEMA nominal y
//     la forma la calcula `casillaNominal()`. El género del adjetivo lo pone
//     `concordar()` leyéndolo de la ENTRADA NOMINAL, nunca del ítem — copiarlo
//     a mano es la regla duplicada esperando (ver la cabecera de
//     `paradigma-adj-ru.ts`).
//   · **LA GRAFÍA VA DADA** por `u1-ortografia-sibilantes`, y eso tiene una
//     consecuencia medida que va dicha en vez de disimulada: **el par 5
//     (`новым` / `русским`) no discrimina a nadie que haya hecho el bloque 1**.
//     Su contraste entero lo resuelve un prerrequisito. Está en el lote por
//     otra razón, escrita en su `motivo`: es el ítem que PRESENTA la falsa
//     analogía que la frontera del par 1 refuta. Es el §25.4 del lote 1
//     —«el contraste interno de la mitad de los pares lo resuelve un
//     prerrequisito»— declarado de entrada y no descubierto al final.
//
// ══ LO QUE LA MEDICIÓN CAMBIÓ DEL DISEÑO, ANTES DE ESCRIBIR UN ÍTEM ══
//
// ⚠ **EN EL LEXICÓN A1 HAY UN SOLO LEMA QUE SEPARA «-ий» DE «BLANDO», Y ESO NO
// ES UNA CASUALIDAD DEL LOTE: ES UNA PROPIEDAD DE LOS SEIS LEMAS.**
//
// La regla del significante —«si el lema acaba en `-ий`, usa la fila blanda»—
// es falsa y acierta casi siempre. Medido con la máquina y no razonado: se
// declinó `хороший` DOS veces, una con su clase real (`duro`) y otra con la
// clase `blando`, y **las 24 casillas salen idénticas**. `хорошего`,
// `хорошем`, `хорошей`, `хорошим`, `хорошая`, `хорошее`: la fila blanda las
// produce todas. Con `русский` la misma prueba da **14 casillas distintas de
// 24** (`русского` frente a `русскего` 0, `русской` frente a `русскей` 0,
// `русская` frente a `русскяя` 0…), porque la `к` NO es sibilante y por tanto
// la /o/ átona no alterna.
//
// O sea: de los seis adjetivos del lexicón, los tres que acaban en `-ий` son
// `синий` (blando de verdad), `хороший` (duro y **homógrafo** de un blando en
// las 24 casillas) y `русский` (duro y distinguible). **`русский` es el único
// testigo posible de la diferencia**, y por eso el lote lo lleva tres veces:
// dos en casillas de la /o/ —donde la regla falsa se rompe— y una en la
// casilla de la `ы` —donde la regla falsa ACIERTA, y es la que se la enseña—.
//
// La consecuencia de diseño **no es subir ningún tope** (§4.35: eso falsea el
// termómetro) sino saberlo al leer la tabla de rutas: `terminacion-del-lema`
// acierta 10 de 12 y los dos que falla son los dos `русский` de la /o/.
//
// ⚠ **Y EL PAR QUE NO SE PUEDE ESCRIBIR, medido y guardado como evidencia
// negativa:** `синий` y `русский` en una casilla de la `ы` (dativo plural)
// dan `синим` y `русским`. Las dos respuestas DIFIEREN como cadena —los temas
// son distintos— y **la desinencia es la misma**: una llega por la fila blanda
// y la otra por la fila dura más la regla velar. Un par así no contrasta nada
// y el gate del lote 2 (que comparaba RESPUESTAS) lo habría aprobado. G13 aquí
// compara **desinencias**, y su testigo rojo es exactamente ese par.
//
// ══ EL ERROR SIMÉTRICO, Y AQUÍ ES UNA EXCLUSIÓN ══════════════════════
//
// **Ningún ítem vive en el INSTRUMENTAL FEMENINO SINGULAR, y va en gate.** La
// desinencia `-ой/-ей` ocupa las cuatro casillas oblicuas del femenino, pero
// la variante larga del XIX existe **sólo en el instrumental**: medido,
// `большою` 109, `новою` 61, `хорошею` 21, `синею` 5. Un ítem de esa casilla
// que exigiera únicamente `-ой` suspendería a quien escribe el ruso que la
// biblioteca le ha enseñado, y este lote no calcula la variante adjetival
// (`variantesInstrSgFem` existe para el SUSTANTIVO y lleva la casilla en el
// nombre justamente por esto). Las otras tres casillas femeninas —genitivo,
// dativo y prepositivo— no tienen variante larga, así que los dos ítems
// femeninos del lote viven ahí. Es el §18 convertido en invariante en vez de
// en una nota que alguien tiene que recordar.
//
// ⚠ Y LA Ё NO APARECE EN NINGUNA RESPUESTA, y tampoco es un olvido: el
// adjetivo ruso sólo escribiría `ё` en una desinencia blanda TÓNICA, y ésa no
// existe —`invariantesAdjetivales` la prohíbe por su nombre—. Los gates de la
// ё (G11 y G12) se corren igual y sus dos testigos rojos van en el test: un
// gate visto sólo en verde no está probado, y menos cuando está vacío.
//
// ══ LO QUE NO ESTÁ AQUÍ, CON SU MOTIVO ══════════════════════════════
//
//   · **Ningún NOMINATIVO y ningún ACUSATIVO.** El nominativo masculino ES el
//     lema y el ítem se contestaría copiando; el acusativo depende de la
//     animacidad y es `u5-animacidad-acusativo` (A2), otro punto. Y los dos son
//     además las ÚNICAS dos casillas que discriminan género
//     (`casillasQueDiscriminanGenero` lo calcula: 2 de 6 en singular, 0 de 6 en
//     plural) — pero aquí el género va DADO, así que no se pierde nada: este
//     lote no mide concordancia de género, mide la FILA.
//   · **Ningún DEMOSTRATIVO ni posesivo en el marco** (`этот`, `тот`, `свой`,
//     `его`). Son `u6-demostrativos` y `u6-svoj`, dos vecinos de bloque con
//     `capas.examina: 'declinacion'` el primero: meter uno en el marco sería
//     publicar casillas de otro punto dentro de éste.
//   · **Ningún numeral.** `u10-sintagma-numeral-adjetivo` es el único sitio
//     donde el adjetivo tras 2-4 NO sigue al sustantivo, y un marco con `два`
//     mediría eso.
//   · **Ninguna forma CORTA.** La máquina no las produce (la vocal de apoyo es
//     léxica) y su punto es B2.
//   · **Ningún sustantivo con `locativo2`** (`лес`, `сад`, `берег`, `пол`) bajo
//     `в`/`на`: es el gate G8 del lote 1, heredado, porque `casillaNominal`
//     devuelve el prepositivo de `о` y produciría `*в лесе`.
//   · **El PLURAL aparece en un solo par** (dativo plural). Es hueco de
//     cobertura declarado, no error: en el plural las dos filas son las mismas
//     dos y ninguna casilla discrimina género, así que un segundo par plural
//     repetiría la misma decisión.
import fs from 'node:fs';
import path from 'node:path';
import { ADJETIVOS_A1, NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import {
  casillaNominal, ortografiar, vocalDesinencialO,
  type CasoRu, type NumeroRu, type EntradaNominal,
} from '../../lib/data/languages/ru/paradigma-ru';
import {
  concordar, temaAdj, casillaAdj,
  type EntradaAdjetival, type FormaAdjetival,
} from '../../lib/data/languages/ru/paradigma-adj-ru';
import { revisarOrtografiaRu, quitarAcento, variantesSinYo } from '../../lib/lang/ortografia-ru';
import { buscar, corpus, INI, FIN } from '../corpus-ru';
import { candidatasConYo } from '../check-paradigma-ru';

/** De qué regla es la sobreaplicación un ítem de frontera. Tipo CERRADO y no
 *  cadena libre, por la misma razón que en el lote 2: el gate exige que no se
 *  repita, y con cadena libre dos redacciones de la misma regla pasarían como
 *  dos reglas distintas. */
export type ReglaSobreaplicada =
  | 'fila-por-la-terminacion-del-lema'
  | 'la-o-atona-sin-mirar-el-acento'
  | 'la-forma-siempre-cambia';

/** El eje que el PAR contrasta. Se declara y **el gate lo RECALCULA** contra
 *  las dos entradas adjetivales: un eje declarado que no es cierto es el
 *  motivo escrito falso, que pasa el gate igual que uno verdadero si nadie lo
 *  recomputa (§4.33 rumano). Aquí el eje no es prosa: es qué propiedad de las
 *  dos entradas hace que las DESINENCIAS difieran. */
export type EjeAdjRu = 'dureza' | 'sibilante' | 'acento' | 'velar';

export interface ClozeAdjRu {
  p: string;
  /** El lema adjetival, tal como está en `ADJETIVOS_A1`. */
  adj: string;
  /** El LEMA nominal del núcleo del sintagma. Su forma NO se escribe: la
   *  calcula `casillaNominal()`, y de esa entrada sale además el género que
   *  `concordar()` usa. El ítem no declara género en ninguna parte. */
  sustantivo: string;
  caso: CasoRu;
  num: NumeroRu;
  /** El marco, con `___` para el adjetivo, `{N}` para la forma DERIVADA del
   *  sustantivo y el lema adjetival entre paréntesis tras el hueco. */
  marco: string;
  /** La pista: NOMBRA lo dado (caso, género y número) y no dice nada de la
   *  clase, la fila ni el tema, que es lo que examina. */
  pista: string;
  par: string;
  eje: EjeAdjRu;
  frontera?: { regla: ReglaSobreaplicada; motivo: string };
}

export const ITEMS: ClozeAdjRu[] = [
  // ── PAR 1 · DOS LEMAS EN `-ий` Y DOS FILAS DISTINTAS — y su frontera ──
  // El par que lleva el punto entero: `русский` y `синий` acaban igual, los
  // dos son de desinencia átona, y uno va por la fila dura y el otro por la
  // blanda. `русской` 297 · `синей` 107 · `о русской` 11 · `о синей` 1 ·
  // `говорили о` 175 · `книге` 146.
  {
    p: 'u6-adjetivo-declinado', adj: 'русский', sustantivo: 'книга', caso: 'prep', num: 'sg',
    par: 'fila-o-knige', eje: 'dureza',
    marco: 'Мы говорили о ___ ({A}) {N}.',
    pista: 'ruso — prepositivo femenino singular',
    frontera: {
      regla: 'fila-por-la-terminacion-del-lema',
      motivo: 'LA SOBREAPLICACIÓN DE LA REGLA DEL SIGNIFICANTE (§0.6), y es la única que el lexicón A1 permite escribir. «El lema acaba en -ий ⇒ fila blanda» acierta 10 de los 12 ítems de este lote —la tabla de rutas lo imprime— y produce *русскей, que sale 0 veces en 7,7 M de palabras. Su distractor está escrito AL LADO, en el otro ítem del mismo par (синей), que es la mejor posición posible. Y la falsa analogía no se la tiene que inventar el alumno: se la enseña el propio lote, en el ítem 10 (русским), donde la fila blanda y la fila dura con la regla velar dan EXACTAMENTE la misma desinencia. Medido con la máquina: declinado como blando, `русский` difiere de su forma real en 14 de 24 casillas, y `хороший` en NINGUNA de las 24 — o sea que en estos seis lemas русский es el único testigo de que -ий no es blando. ⚠ Y LO QUE ESTA FRONTERA **NO** ES, y va dicho porque el proyecto se ha equivocado cinco veces en esta casilla (§0.1): **no es un error de transferencia**. Ni el español de México ni el portugués europeo empujan hacia él; es intralingüístico y lo produce igual un anglófono. Que exista no me lo he inventado y la prueba es indirecta pero sólida: la tradición РКИ tiene que CREAR la categoría «смешанное склонение» precisamente porque el grupo gráfico -ий no es una clase — Хавронина–Широченская reparten los -ий entre «основа на г, к, х» (русский, маленький, тихий) y «мягкая основа» (синий, последний), y АГ-80 y Розенталь hacen lo mismo. Una categoría pedagógica existe porque los alumnos confunden lo que separa. Pero la L1 aquí ni lo causa ni lo protege, y prometerlo sería el §0.1 por sexta vez.',
    },
  },
  {
    p: 'u6-adjetivo-declinado', adj: 'синий', sustantivo: 'книга', caso: 'prep', num: 'sg',
    par: 'fila-o-knige', eje: 'dureza',
    marco: 'Мы говорили о ___ ({A}) {N}.',
    pista: 'azul oscuro — prepositivo femenino singular',
  },

  // ⚠ A-3/A-4/A-5 · LA NATURALIDAD DE LOS SINTAGMAS, DICTAMINADA Y ESCRITA AQUÍ
  // EN VEZ DE PROMETIDA. El lingüista adversarial leyó las apariciones una a una:
  //   · `у синего окна` (ítem 4) está a cero por todos los caminos —синее окно 0,
  //     синие окна 0, синего окна 0, у синего 0— y NO es un hueco del corpus: en
  //     ruso una ventana no es «azul». `синий` colocaciona con море (синее море
  //     14), небо, глаза, платье. **El par está estructuralmente forzado**: синий
  //     es el único lema blando del lexicón y no hay ningún neutro que admitan a
  //     la vez новый y синий. El arreglo de verdad es un segundo lema blando
  //     (`последний` 1.000) y no cabe en este lote; queda escrito.
  //   · `в хорошем городе` (ítem 7): las 45 apariciones de «в хорошем» son todas
  //     abstractas o sociales (расположении духа ×3, обществе ×4, платье ×2,
  //     чине, доме, смысле), ni una de lugar geográfico. Gramatical y producible,
  //     pero marcado — y su pareja SÍ es la colocación (в большом 178). La
  //     asimetría dentro del par va dicha.
  //   · `из хорошей страны` (ítem 11): las CINCO de «из хорошей» son семьи /
  //     фамилии, o sea un modismo («de buena familia»), no un patrón productivo.
  //     Las diez de «из большой» son recipientes y salas.
  //   · `русского человека` (37) y `хорошего человека` (17) son las dos únicas
  //     colocaciones del lote con atestación robusta, y las dos son idiomáticas.
  // Ninguna de las doce es agramatical y ninguna se retira: lo que cambia es que
  // el lote ya no las presenta como atestadas.

  // ── PAR 2 · LA FILA DURA CONTRA LA BLANDA, sin nada que las disfrace ──
  // `нового` 499 · `синего` 40 · `сидел у` 124 · `у окна` 318 · `окна` 1299.
  // El regente `у` rige SÓLO genitivo, y aquí hace falta: `окна` es a la vez
  // el genitivo singular y el nominativo plural de `окно`, y sin la
  // preposición el ítem admitiría `новые`.
  {
    p: 'u6-adjetivo-declinado', adj: 'новый', sustantivo: 'окно', caso: 'gen', num: 'sg',
    par: 'fila-u-okna', eje: 'dureza',
    marco: 'Он сидел у ___ ({A}) {N}.',
    pista: 'nuevo — genitivo neutro singular',
  },
  {
    p: 'u6-adjetivo-declinado', adj: 'синий', sustantivo: 'окно', caso: 'gen', num: 'sg',
    par: 'fila-u-okna', eje: 'dureza',
    marco: 'Он сидел у ___ ({A}) {N}.',
    pista: 'azul oscuro — genitivo neutro singular',
  },

  // ── PAR 3 · LA /o/ ÁTONA TRAS SIBILANTE, con dos temas DUROS ─────────
  // Los dos son de la fila dura y de desinencia átona: lo único que los separa
  // es que `хорош-` acaba en sibilante y `русск-` en velar, y la velar NO toca
  // la /o/. `русского` 397 · `хорошего` 415 · `русского человека` 37 ·
  // `хорошего человека` 17 · `письмо от` 101.
  {
    p: 'u6-adjetivo-declinado', adj: 'русский', sustantivo: 'человек', caso: 'gen', num: 'sg',
    par: 'o-ot-cheloveka', eje: 'sibilante',
    marco: 'Это письмо от ___ ({A}) {N}.',
    pista: 'ruso — genitivo masculino singular',
  },
  {
    p: 'u6-adjetivo-declinado', adj: 'хороший', sustantivo: 'человек', caso: 'gen', num: 'sg',
    par: 'o-ot-cheloveka', eje: 'sibilante',
    marco: 'Это письмо от ___ ({A}) {N}.',
    pista: 'bueno — genitivo masculino singular',
  },

  // ── PAR 4 · EL ACENTO, CON EL MISMO TEMA SIBILANTE — y la frontera 2 ──
  // `хороший` y `большой` tienen el MISMO tema sibilante y la MISMA fila, y se
  // diferencian en un solo bit. `хорошем` 89 · `большом` 264 · `в хорошем` 45 ·
  // `в большом` 178 · `большом городе` 4 · `городе` 1066.
  {
    p: 'u6-adjetivo-declinado', adj: 'хороший', sustantivo: 'город', caso: 'prep', num: 'sg',
    par: 'acento-v-gorode', eje: 'acento',
    marco: 'Мы были в ___ ({A}) {N}.',
    pista: 'bueno — prepositivo masculino singular',
  },
  {
    p: 'u6-adjetivo-declinado', adj: 'большой', sustantivo: 'город', caso: 'prep', num: 'sg',
    par: 'acento-v-gorode', eje: 'acento',
    marco: 'Мы были в ___ ({A}) {N}.',
    pista: 'grande — prepositivo masculino singular',
    frontera: {
      regla: 'la-o-atona-sin-mirar-el-acento',
      motivo: 'LA SOBREAPLICACIÓN DE LA REGLA DE LA /o/ (§0.6): quien aprenda `хорошем` en el ítem 7 y concluya «tras sibilante, е» escribe *большем, porque la regla real lleva una segunda condición —la /o/ átona tras sibilante se escribe е, y la TÓNICA se escribe о— y `большой` es tónico. Su distractor es su pareja de par, escrito al lado. ⚠ Y LO QUE HACE ESPECIAL A ESTA FRONTERA, que va dicho en vez de disimulado: **la forma que el error produce NO es agramatical**. `большем` sale 15 veces y `большей` 156, y no son formas de `большой`: son el comparativo declinado `бо́льший` «mayor», que es otra palabra con su propio paradigma — la lectura está hecha una a una en `lecturaRival` de `lexicon-a1.ts` («в большей чести», «большее удовольствие»). O sea que ni la ortografía ni el corpus pueden rechazarlas, y por eso NO están en el control positivo de este lote: un veredicto que las rechazara lo haría por la razón equivocada, que es el `*лесы` del §35 con el signo cambiado. Lo único que separa la respuesta del error es el LEMA escrito en el paréntesis, y eso es exactamente lo que el ítem pide leer.',
    },
  },

  // ── PAR 5 · LA `ы` TRAS VELAR — el par que NO discrimina, y su función ─
  // `новым` 272 · `русским` 204 · `студентам` 15 · `помогал` 87.
  // ⚠ SU CONTRASTE LO RESUELVE UN PRERREQUISITO (`u1-ortografia-sibilantes`:
  // la `и` tras к/г/х) y por tanto su valor discriminante para quien haya
  // hecho el bloque 1 es CERO: la ruta `solo-la-fila-dura` acierta LOS DOS
  // ítems de este par, que es lo que la tabla imprime. Está en el lote porque
  // es el ítem que ENSEÑA la falsa analogía que refuta la frontera del par 1:
  // aquí `русский` se comporta exactamente como un blando (`русским` = lo que
  // daría la fila blanda), y el par 1 muestra que no lo es. Una frontera cuyo
  // distractor no está en el lote mide un error que el alumno no puede
  // producir; ésta trae además la EVIDENCIA que lo induce.
  {
    p: 'u6-adjetivo-declinado', adj: 'новый', sustantivo: 'студент', caso: 'dat', num: 'pl',
    par: 'velar-studentam', eje: 'velar',
    marco: 'Он помогал ___ ({A}) {N}.',
    pista: 'nuevo — dativo plural',
  },
  {
    p: 'u6-adjetivo-declinado', adj: 'русский', sustantivo: 'студент', caso: 'dat', num: 'pl',
    par: 'velar-studentam', eje: 'velar',
    marco: 'Он помогал ___ ({A}) {N}.',
    pista: 'ruso — dativo plural',
  },

  // ── PAR 6 · EL ACENTO EN FEMENINO — y la frontera 3, el SINCRETISMO ───
  // `хорошей` 125 · `большой` 1684 · `из хорошей` 5 · `из большой` 10 ·
  // `приехал из` 37 · `страны` (genitivo singular de страна).
  // El genitivo femenino y NO el instrumental: ver la cabecera (la variante
  // `-ою` del XIX existe sólo en el instrumental).
  {
    p: 'u6-adjetivo-declinado', adj: 'хороший', sustantivo: 'страна', caso: 'gen', num: 'sg',
    par: 'acento-iz-strany', eje: 'acento',
    marco: 'Он приехал из ___ ({A}) {N}.',
    pista: 'bueno — genitivo femenino singular',
  },
  {
    p: 'u6-adjetivo-declinado', adj: 'большой', sustantivo: 'страна', caso: 'gen', num: 'sg',
    par: 'acento-iz-strany', eje: 'acento',
    marco: 'Он приехал из ___ ({A}) {N}.',
    pista: 'grande — genitivo femenino singular',
    frontera: {
      regla: 'la-forma-siempre-cambia',
      motivo: 'EL ÚNICO ÍTEM DEL LOTE CUYA RESPUESTA ES EL LEMA, y es el §16 medido: en los lemas de desinencia tónica el nominativo masculino es homógrafo de LAS CUATRO CASILLAS OBLICUAS DEL FEMENINO, así que el genitivo femenino de `большой` es `большой`. La regla que se sobreaplica es la que los otros once ítems enseñan sin decirla —«el adjetivo cambia de forma al declinarse»— y quien la aplique aquí escribe algo distinto del lema: *большей (que es el comparativo, ver el ítem 8) o la variante larga del instrumental, que en genitivo no existe. ⚠ Y LA v0 DE ESTE MOTIVO DECÍA «su valor discriminante es CERO», Y ERA FALSO — lo refutó el lingüista adversarial con la tabla que este mismo fichero imprime veinte líneas más abajo. Que una ruta lo acierte no es valor discriminante cero: `copiar-el-lema` lo acierta (y es el único de los doce, por eso G19 lo limita a uno), pero **`todo-menos-el-acento` lo FALLA**, o sea que este ítem discrimina exactamente el mismo bit que el ítem 8 —el acento, que es el bit más caro del lote— y lo discrimina en el femenino, donde el ítem 8 no llega. Es la quinta vez en este proyecto que la prosa enseña algo falso con los ítems bien, y la segunda que la refuta una tabla que el propio fichero imprime. ⚠ Y LO QUE SÍ ES CIERTO Y HAY QUE ARREGLAR FUERA DEL LOTE: el sincretismo es INVISIBLE para el alumno. Quien contesta `большой` llega por el camino recto (fila dura femenina + la /o/ tónica que no se ablanda) y no tiene por qué enterarse de que ha escrito el lema; la pista no puede decírselo (G3 lo prohíbe, y con razón) y hasta hoy la lección tampoco lo decía. Va añadido a `b6-l1`, que es donde el alumno lo puede leer.',
    },
  },
];

// ══════════════════════════════════════════════════════════════════════
// LAS DOS DERIVACIONES, Y NINGUNA SE TECLEA
// ══════════════════════════════════════════════════════════════════════
const ADJ = new Map(ADJETIVOS_A1.map((a) => [a.lema, a]));
const NOM = new Map(NOMBRES_A1.map((n) => [n.lema, n]));

export function entradaAdj(x: ClozeAdjRu): EntradaAdjetival | undefined { return ADJ.get(x.adj); }
export function entradaNom(x: ClozeAdjRu): EntradaNominal | undefined { return NOM.get(x.sustantivo); }

/** La forma del SUSTANTIVO, derivada. Si la máquina no sabe, `null`. */
export function formaNominal(x: ClozeAdjRu): string | null {
  const n = entradaNom(x);
  return n ? casillaNominal(n, x.caso, x.num) : null;
}

/** LA RESPUESTA, DERIVADA por `concordar()` — que lee el género y la
 *  animacidad de la ENTRADA NOMINAL y no del ítem. */
export function respuestaDe(x: ClozeAdjRu): string | null {
  const a = entradaAdj(x), n = entradaNom(x);
  return a && n ? concordar(a, n, x.caso, x.num) : null;
}

/** Las respuestas correctas ALTERNATIVAS, calculadas y nunca declaradas.
 *  Hoy sale vacía en los doce, y eso es un HECHO comprobable y no un
 *  descuido: el adjetivo ruso sólo escribiría `ё` en una desinencia blanda
 *  TÓNICA, y `invariantesAdjetivales` prohíbe esa combinación por su nombre. */
export function alternativasDe(x: ClozeAdjRu): string[] {
  const r = respuestaDe(x);
  return r ? variantesSinYo(r) : [];
}

/** La frase que ve el alumno. `{N}` es la forma nominal derivada y `{A}` el
 *  lema adjetival: escribir cualquiera de las dos a mano sería la tercera
 *  copia de un dato que la máquina ya tiene. */
export function frase(x: ClozeAdjRu): string {
  return x.marco.replace('{A}', x.adj).replace('{N}', formaNominal(x) ?? '⟨?⟩');
}
/** El ANCLA: la forma nominal, que es lo que fija género y número EN LA
 *  LENGUA y no sólo en la etiqueta. Va detrás del hueco, y el gate lo
 *  comprueba ahí. */
export const ancla = (x: ClozeAdjRu): string | null => formaNominal(x);

const CASO_ES: Record<CasoRu, string> = {
  nom: 'nominativo', ac: 'acusativo', gen: 'genitivo',
  dat: 'dativo', instr: 'instrumental', prep: 'prepositivo',
};
/** La etiqueta de género/número tal como la pista la escribe. En plural el
 *  ruso no marca género y la etiqueta no finge que lo marque. */
function formaEs(x: ClozeAdjRu): string | null {
  if (x.num === 'pl') return 'plural';
  const n = entradaNom(x);
  if (!n) return null;
  return { m: 'masculino singular', f: 'femenino singular', n: 'neutro singular' }[n.genero];
}
/** La casilla adjetival: `pl` o el género del SUSTANTIVO. Es la misma
 *  expresión que usa `concordar()` y por eso se lee de la entrada nominal. */
function formaAdj(x: ClozeAdjRu): FormaAdjetival | null {
  if (x.num === 'pl') return 'pl';
  const n = entradaNom(x);
  return n ? n.genero : null;
}

/** La DESINENCIA: la casilla menos el tema. Es lo que el punto enseña, y lo
 *  que un par tiene que contrastar — dos respuestas distintas con la MISMA
 *  desinencia no contrastan nada, sólo llevan temas distintos. */
export function desinenciaDe(x: ClozeAdjRu): string | null {
  const a = entradaAdj(x), r = respuestaDe(x);
  if (!a || !r) return null;
  return quitarAcento(r).slice(temaAdj(a).length);
}

/** La grafía de la /o/ de la desinencia para este adjetivo, por la ÚNICA
 *  regla que la escribe (`vocalDesinencialO`, importada y no copiada). */
const vocalO = (a: EntradaAdjetival) =>
  vocalDesinencialO(temaAdj(a), a.tema === 'blando' ? 'blando' : 'duro', a.desinenciaTonica);
/** La grafía de la `ы` de la desinencia, por `ortografiar` y no por una regex
 *  propia: si el tema es velar o sibilante sale `и`. */
const grafiaY = (a: EntradaAdjetival) =>
  (ortografiar(temaAdj(a), 'ы', { clase: a.tema === 'blando' ? 'blando' : 'duro', tonica: a.desinenciaTonica }) ?? '').slice(-1);

const sinParentesis = (s: string) => s.replace(/\([^)]*\)/g, ' ');
const PALABRA = (w: string) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu');

// ══════════════════════════════════════════════════════════════════════
// LOS GATES
// ══════════════════════════════════════════════════════════════════════
export function verificar(items: ClozeAdjRu[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const porPunto = new Map<string, Map<string, number>>();

  for (const [i, x] of items.entries()) {
    const id = `CLRUA-${String(i + 1).padStart(3, '0')} (${x.adj} ${x.sustantivo} ${x.caso}.${x.num})`;
    const a = entradaAdj(x), n = entradaNom(x);
    if (!a) { v.push(`${id}: el adjetivo «${x.adj}» no está en ADJETIVOS_A1`); continue; }
    if (!n) { v.push(`${id}: el sustantivo «${x.sustantivo}» no está en NOMBRES_A1`); continue; }

    // ⚠ LOS TRES GATES DE EXCLUSIÓN VAN ANTES DE ABANDONAR POR `null`, por el
    // §0.8 rumano: dos comprobaciones INDEPENDIENTES no pueden compartir un
    // `continue`, y `concordar()` devuelve `null` en el acusativo sin
    // animacidad — justo la casilla que G7 existe para prohibir.
    // G5 · EL REGENTE Y EL SEGUNDO LOCATIVO, heredado del lote 1.
    if (n.locativo2 && /(^|\s)(в|на)\s+___/.test(x.marco))
      v.push(`${id}: «${x.sustantivo}» tiene segundo locativo (${n.locativo2.forma}) y el marco lleva в/на — casillaNominal devuelve el prepositivo de «о» y la frase saldría mal`);
    // G6 · EL INSTRUMENTAL FEMENINO SINGULAR ESTÁ PROHIBIDO. Ver la cabecera:
    //      su -ой/-ей tiene variante larga del XIX (большою 109, новою 61,
    //      хорошею 21, синею 5) y este lote no la calcula. Exigir sólo -ой
    //      suspende a quien escribe lo que ha leído.
    if (x.caso === 'instr' && x.num === 'sg' && n.genero === 'f')
      v.push(`${id}: instrumental femenino singular — su desinencia tiene la variante larga -ою/-ею del XIX (большою 109, новою 61) y este lote no la calcula; exigir sólo -ой suspende a quien escribe el ruso de la biblioteca`);
    // G7 · NI NOMINATIVO NI ACUSATIVO. El primero es el lema (se contesta
    //      copiando) y el segundo depende de la animacidad, que es
    //      `u5-animacidad-acusativo` (A2).
    if (x.caso === 'nom' || x.caso === 'ac')
      v.push(`${id}: casilla «${x.caso}» — el nominativo masculino ES el lema y el acusativo depende de la animacidad (u5-animacidad-acusativo, A2): las dos miden otro punto`);

    const r = respuestaDe(x);
    const fn = formaNominal(x);
    if (!fn) { v.push(`${id}: la máquina nominal devuelve null para ${x.caso}.${x.num} de «${x.sustantivo}»`); continue; }
    if (!r) { v.push(`${id}: concordar() devuelve null — no se inventa una forma plausible`); continue; }
    const alt = alternativasDe(x);
    const s = frase(x);

    // G1 · un solo hueco, un solo `{N}` y un solo `{A}`.
    for (const [marca, cuantos] of [['___', s.split('___').length - 1], ['{N}', x.marco.split('{N}').length - 1], ['{A}', x.marco.split('{A}').length - 1]] as const)
      if (cuantos !== 1) v.push(`${id}: ${cuantos} «${marca}» en el marco, tiene que haber 1`);
    // G2 · el lema adjetival, entre paréntesis y DETRÁS del hueco.
    if (!new RegExp(`___\\s*\\(\\s*${x.adj}\\s*\\)`).test(s))
      v.push(`${id}: la frase no nombra el lema «${x.adj}» entre paréntesis justo detrás del hueco`);
    // G3 · la pista NOMBRA lo dado (caso, género y número) y NO lo examinado.
    const fe = formaEs(x);
    if (!x.pista.includes(CASO_ES[x.caso])) v.push(`${id}: la pista no nombra el caso «${CASO_ES[x.caso]}»`);
    if (fe && !x.pista.includes(fe)) v.push(`${id}: la pista no nombra «${fe}» — el género y el número van DADOS y se anotan en los doce, no sólo donde hacen falta`);
    if (/(fila|dura|blanda|duro|blando|mixt|clase|tema|sibilante|velar|acento|t[óo]nic|[áa]ton)/i.test(x.pista))
      v.push(`${id}: la pista nombra la FILA, el TEMA o el ACENTO, que es justo lo que el ítem examina`);
    // G3c · la pista tiene forma canónica. Cualquier variación tipográfica de
    //        la glosa es una pista del significante — el lote 1 la cometió
    //        («femenino EN RUSO» en dos de once) justo sobre el par que
    //        contrastaba.
    const FORMAS_ES = ['masculino singular', 'femenino singular', 'neutro singular', 'plural'];
    if (!new RegExp(`^[^()—]+ — (${Object.values(CASO_ES).join('|')}) (${FORMAS_ES.join('|')})$`).test(x.pista))
      v.push(`${id}: la pista «${x.pista}» no tiene la forma canónica «<glosa> — <caso> <género y número>»`);
    // G4 · EL ANCLA es la forma nominal DERIVADA y va DETRÁS del hueco: es lo
    //      que fija género y número en la lengua y no sólo en la etiqueta.
    if (!PALABRA(fn).test(sinParentesis(s).split('___')[1] ?? ''))
      v.push(`${id}: el ancla «${fn}» no aparece detrás del hueco`);
    // G8 · la pista no deletrea la respuesta.
    for (const c of [r, ...alt]) if (PALABRA(quitarAcento(c)).test(x.pista)) v.push(`${id}: la pista deletrea la respuesta «${c}»`);
    // G9 · la respuesta no está escrita en la frase fuera del paréntesis.
    if (PALABRA(r).test(sinParentesis(s).replace('___', ' '))) v.push(`${id}: la respuesta «${r}» ya está escrita en la frase`);
    // G10 · LA RESPUESTA NO PUEDE SER EL LEMA, salvo en una frontera y con su
    //       motivo escrito. Es G9 del lote 1, heredado: sin la excepción no se
    //       podría enseñar el sincretismo del femenino oblicuo; sin el gate,
    //       «copiar el lema» sería una estrategia con varios aciertos.
    if (quitarAcento(r) === quitarAcento(x.adj) && !x.frontera)
      v.push(`${id}: la respuesta coincide con el lema y el ítem no declara frontera — se contesta copiando`);
    // G11 · EL ERROR SIMÉTRICO DE LA Ё. Toda respuesta con ё tiene que aceptar
    //       la grafía sin ё: el comparador del producto NO la pliega (§32) y
    //       1.752 de 2.180 lecturas no la escriben nunca.
    if (r.includes('ё') && alt.length === 0)
      v.push(`${id}: la respuesta «${r}» lleva ё y no declara la variante sin ё — exigir sólo la forma con ё suspende a quien escribe el ruso atestado de la biblioteca`);
    // G12 · y la mitad contraria: si la respuesta lleva `е` donde la lengua
    //       escribe `ё`, la máquina está produciendo OTRA palabra.
    for (const c of candidatasConYo(r)) v.push(`${id}: la respuesta «${r}» tiene variante con ё atestada («${c.forma}» ${c.n}) — la regla del proyecto es producir con ё siempre`);
    // G13 · ortografía y homóglifos en TODO lo que el alumno ve.
    for (const [campo, t] of [['frase', s], ['pista', x.pista], ['respuesta', r], ['alternativas', alt.join(' ')]] as const)
      for (const h of revisarOrtografiaRu(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // G14 · respuesta y forma nominal ATESTADAS las dos.
    if (buscar(quitarAcento(r)).n === 0) v.push(`${id}: la respuesta «${r}» no aparece ni una vez en 7,7 M de palabras`);
    if (buscar(quitarAcento(fn)).n === 0) v.push(`${id}: la forma nominal «${fn}» no aparece ni una vez en 7,7 M de palabras`);
    // G15 · §4.43 RUMANO · LA RESPUESTA NO PUEDE VENIR PEGADA AL SUSTANTIVO.
    //       En rumano una regla acertó 4 de 4 sin una palabra de rumano porque
    //       el objeto del estímulo llevaba su propia respuesta al final. Aquí
    //       el ancla está a una palabra del hueco, así que se comprueba.
    //
    //       ⚠ Y DÓNDE MUERDE EN RUSO, CONTADO Y NO RAZONADO. Yo había escrito
    //       que la única casilla donde el sustantivo entrega la desinencia es
    //       el instrumental femenino singular (`с новой книгой`), que G6 ya
    //       prohíbe por otro motivo — o sea que este gate sobraba. **Es falso, y
    //       lo refutó el barrido exhaustivo** de las 2.880 combinaciones de
    //       adjetivo × sustantivo × casilla del lexicón: hay **284**
    //       colisiones y **240 están en el INSTRUMENTAL PLURAL**, en los tres
    //       géneros —`новыми книгами`, `русскими столами`: `-ыми`/`-ами`
    //       comparten las dos últimas letras—. Las otras 38 son el
    //       instrumental femenino singular y 6 el dativo neutro singular. Este
    //       lote no tiene ningún instrumental plural y eso fue SUERTE, no
    //       diseño. El razonamiento en prosa habría cerrado el gate justo donde
    //       más hace falta.
    if (quitarAcento(r).slice(-2) === quitarAcento(fn).slice(-2))
      v.push(`${id}: la respuesta «${r}» y el sustantivo «${fn}» acaban en las mismas dos letras — el estímulo entrega la desinencia`);

    const m = porPunto.get(x.p) ?? new Map<string, number>();
    m.set(r, (m.get(r) ?? 0) + 1); porPunto.set(x.p, m);
    const clave = s.replace(/\s+/g, ' ').trim().toLowerCase();
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
  }
  for (const [p, m] of porPunto) for (const [r, k] of m) if (k > 1) v.push(`${p}: la respuesta «${r}» sale ${k} veces`);

  // G16 · LOS PARES DE MARCO. A n = 12 la nula por permutación no rechaza nada
  //       (§4.41 rumano, medido a n = 8 con p = 0,076 sobre un atajo PLANTADO
  //       al 100 %), así que no se corre. Lo que protege al lote es que dentro
  //       de un par toda propiedad del marco sea CONSTANTE.
  //
  //       ⚠ Y AQUÍ EL INVARIANTE DEL LOTE 2 NO BASTA. Allí se exigía que las
  //       dos RESPUESTAS difirieran. En el adjetivo dos respuestas pueden
  //       diferir sólo por el TEMA y llevar la MISMA desinencia —`синим` y
  //       `русским`, una por la fila blanda y otra por la fila dura más la
  //       regla velar— y ese par no contrasta nada de lo que el punto enseña.
  //       Lo que se exige es que difieran las DESINENCIAS.
  const pares = new Map<string, ClozeAdjRu[]>();
  for (const x of items) if (x.par) { const a = pares.get(x.par) ?? []; a.push(x); pares.set(x.par, a); }
  for (const x of items) if (!x.par) v.push(`${x.adj} ${x.sustantivo}: ítem sin par de marco`);
  for (const [k, xs] of pares) {
    if (xs.length !== 2) { v.push(`par «${k}»: ${xs.length} ítems — un par de marco son DOS`); continue; }
    const [a, b] = xs as [ClozeAdjRu, ClozeAdjRu];
    if (a.marco !== b.marco) v.push(`par «${k}»: los dos marcos no son idénticos («${a.marco}» / «${b.marco}»)`);
    if (a.sustantivo !== b.sustantivo) v.push(`par «${k}»: los dos ítems llevan sustantivos distintos («${a.sustantivo}» / «${b.sustantivo}»)`);
    if (a.caso !== b.caso || a.num !== b.num) v.push(`par «${k}»: los dos ítems no están en la misma casilla`);
    if (a.adj === b.adj) v.push(`par «${k}»: el mismo adjetivo en los dos ítems`);
    const da = desinenciaDe(a), db = desinenciaDe(b);
    if (da !== null && da === db)
      v.push(`par «${k}»: las dos desinencias son «-${da}» — las respuestas difieren sólo por el TEMA y el par no contrasta nada de lo que el punto enseña`);
    if (a.eje !== b.eje) v.push(`par «${k}»: los dos ítems declaran ejes distintos («${a.eje}» / «${b.eje}»)`);

    // ⚠ G17 · EL EJE DECLARADO SE RECALCULA CONTRA EL LEXICÓN ADJETIVAL.
    //       Exigir un motivo escrito garantiza que el motivo EXISTA, nunca que
    //       sea cierto (§4.33 rumano, y en rumano un juicio falso pasó el gate
    //       del estreno igual que uno verdadero). Aquí el eje no es prosa: es
    //       QUÉ propiedad de las dos entradas hace que las desinencias
    //       difieran, y se recomputa con `vocalDesinencialO` y `ortografiar`,
    //       importadas y no copiadas.
    const ea = entradaAdj(a), eb = entradaAdj(b);
    if (ea && eb) {
      const mismaFila = ea.tema === eb.tema;
      const mismoAcento = ea.desinenciaTonica === eb.desinenciaTonica;
      const mismaO = vocalO(ea) === vocalO(eb);
      switch (a.eje) {
        case 'dureza':
          if (mismaFila) v.push(`par «${k}»: declara eje «dureza» y los dos adjetivos son de tema ${ea.tema}`);
          break;
        case 'sibilante':
          if (!mismaFila) v.push(`par «${k}»: declara eje «sibilante» y los temas son de filas distintas — lo que contrasta es la dureza`);
          else if (!mismoAcento) v.push(`par «${k}»: declara eje «sibilante» y los acentos difieren — lo que contrasta es el acento`);
          else if (mismaO) v.push(`par «${k}»: declara eje «sibilante» y los dos escriben la /o/ igual («${vocalO(ea)}») — la sibilante no separa nada aquí`);
          break;
        case 'acento':
          if (!mismaFila) v.push(`par «${k}»: declara eje «acento» y los temas son de filas distintas`);
          else if (mismoAcento) v.push(`par «${k}»: declara eje «acento» y los dos adjetivos tienen la desinencia ${ea.desinenciaTonica ? 'tónica' : 'átona'}`);
          else if (mismaO) v.push(`par «${k}»: declara eje «acento» y los dos escriben la /o/ igual («${vocalO(ea)}») — con un tema no sibilante el acento NO se ve fuera del nominativo masculino, y ése es el caso de новый/молодой`);
          break;
        case 'velar':
          if (!mismaFila || !mismoAcento) v.push(`par «${k}»: declara eje «velar» y los dos adjetivos difieren además en la fila o en el acento`);
          else if (!mismaO) v.push(`par «${k}»: declara eje «velar» y la /o/ se escribe distinta («${vocalO(ea)}» / «${vocalO(eb)}») — lo que contrasta es la sibilante, no la velar`);
          else if (grafiaY(ea) === grafiaY(eb)) v.push(`par «${k}»: declara eje «velar» y los dos escriben la ы igual («${grafiaY(ea)}»)`);
          break;
      }
    }
  }
  // G18 · TODO EJE DECLARADO EXISTE, y con menos de tres la cobertura real no
  //       llega al piso por muchos ítems que haya (§4.25 rumano).
  const ejes = new Set(items.map((x) => x.eje));
  if (ejes.size < 3) v.push(`el lote declara ${ejes.size} ejes distintos (${[...ejes].join(', ')}) — con menos de tres la cobertura real no llega al piso`);

  // G19 · LAS FRONTERAS. No se cuentan: se comprueba que cada una declare de
  //       QUÉ regla es la sobreaplicación, que ninguna regla se repita y que
  //       su DISTRACTOR SEA ALCANZABLE — el dictamen D4 del lote 1 vuelto
  //       invariante en el lote 2 y heredado aquí.
  const fronteras = items.filter((x) => x.frontera);
  if (fronteras.length === 0) v.push('el lote no declara ni un ítem de frontera — sin él el alumno sobregeneraliza y saca 12/12 (§0.6)');
  const reglas = new Set<string>();
  for (const x of fronteras) {
    const f = x.frontera!;
    if (reglas.has(f.regla)) v.push(`${x.adj} ${x.sustantivo}: dos fronteras sobreaplican la misma regla «${f.regla}» — la segunda no añade cobertura`);
    reglas.add(f.regla);
    if (f.motivo.length < 120) v.push(`${x.adj} ${x.sustantivo}: el motivo de la frontera es demasiado corto para decir qué error produce la regla`);
    const e = entradaAdj(x);
    if (!e) continue;
    if (f.regla === 'fila-por-la-terminacion-del-lema') {
      // El lema tiene que acabar en `-ий` (o la regla del significante no se
      // dispara) y ser de tema DURO (o no hay sobreaplicación). Y el
      // distractor —un lema en `-ий` que SÍ es blando— tiene que ser la
      // respuesta de otro ítem del lote.
      if (!/ий$/.test(quitarAcento(x.adj)) || e.tema !== 'duro')
        v.push(`${x.adj}: frontera «fila-por-la-terminacion-del-lema» en un lema que no acaba en -ий o que es blando de verdad — no hay sobreaplicación`);
      const distractor = items.find((y) => {
        const ey = entradaAdj(y);
        return !!ey && ey.tema === 'blando' && /ий$/.test(quitarAcento(y.adj));
      });
      if (!distractor)
        v.push(`${x.adj}: frontera «fila-por-la-terminacion-del-lema» sin distractor alcanzable — el lote tiene que traer un lema en -ий que SÍ vaya por la fila blanda`);
      // Y la EVIDENCIA que induce el error: un ítem del mismo lema en una
      // casilla donde la regla falsa ACIERTA. Sin ella la analogía se la
      // tendría que inventar el alumno.
      const evidencia = items.find((y) => {
        if (y === x || y.adj !== x.adj) return false;
        const ey = entradaAdj(y), fy = formaAdj(y), ry = respuestaDe(y);
        if (!ey || !fy || !ry) return false;
        const comoBlando = casillaAdj({ ...ey, tema: 'blando' }, fy, y.caso, { animado: false });
        return comoBlando === ry;
      });
      if (!evidencia)
        v.push(`${x.adj}: frontera «fila-por-la-terminacion-del-lema» sin la EVIDENCIA que la induce — hace falta otro ítem del mismo lema en una casilla donde la fila blanda dé la misma forma`);
    }
    if (f.regla === 'la-o-atona-sin-mirar-el-acento') {
      if (!e.desinenciaTonica)
        v.push(`${x.adj}: frontera «la-o-atona-sin-mirar-el-acento» en un lema de desinencia ÁTONA — la regla no se sobreaplica, se aplica`);
      if (vocalO(e) !== 'о')
        v.push(`${x.adj}: frontera «la-o-atona-sin-mirar-el-acento» en un lema cuya /o/ ya se escribe «${vocalO(e)}» — no hay nada que la regla átona cambie`);
      // El distractor es el lema ÁTONO del mismo tema, y tiene que estar en el
      // lote: es el que enseña «tras sibilante, е».
      const pareja = items.find((y) => {
        const ey = entradaAdj(y);
        return !!ey && y.adj !== x.adj && ey.tema === e.tema && !ey.desinenciaTonica && vocalO(ey) === 'е';
      });
      if (!pareja)
        v.push(`${x.adj}: frontera «la-o-atona-sin-mirar-el-acento» sin distractor alcanzable — el lote tiene que traer el lema átono del mismo tema, que es el que enseña la regla que se sobreaplica`);
    }
    if (f.regla === 'la-forma-siempre-cambia') {
      const r = respuestaDe(x);
      if (!r || quitarAcento(r) !== quitarAcento(x.adj))
        v.push(`${x.adj}: frontera «la-forma-siempre-cambia» sobre una casilla cuya respuesta NO es el lema — no hay sincretismo que enseñar`);
      // Y tiene que ser la ÚNICA del lote: dos harían de «copiar el lema» una
      // estrategia con dos aciertos, que es la razón escrita del lote 1.
      const otras = items.filter((y) => {
        const ry = respuestaDe(y);
        return !!ry && quitarAcento(ry) === quitarAcento(y.adj);
      });
      if (otras.length > 1)
        v.push(`${x.adj}: hay ${otras.length} ítems cuya respuesta es su propio lema — con más de uno «copiar-el-lema» deja de ser el suelo`);
    }
  }

  // G20 · LA FUGA ENTRE ÍTEMS, que ningún gate por ítem puede ver. El lote 1
  //       la pagó: su marco empezaba por `Утром`, que es el instrumental de
  //       `утро`, o sea la respuesta-patrón de otro par escrita dos ítems
  //       antes.
  //
  //       ⚠ Y LO QUE ESTE GATE NO MIRA, escrito en vez de supuesto: `-ом`,
  //       `-ем`, `-ой` y `-ей` quedan fuera aunque sean desinencias
  //       adjetivales. Son también el instrumental y el prepositivo del
  //       SUSTANTIVO (`столом`, `учителем`, `книгой`, `дверей`), y un gate que
  //       las marcara marcaría cualquier marco con un sustantivo oblicuo
  //       dentro — un gate que marca medio lote es un gate apagado. Las que
  //       quedan son inequívocamente adjetivales.
  const DESINENCIAS_ADJETIVALES = ['ого', 'его', 'ому', 'ему', 'ыми', 'ими', 'ым', 'им', 'ых', 'их', 'ая', 'яя', 'ую', 'юю', 'ые', 'ие'];
  const respuestas = new Set(items.map((x) => respuestaDe(x)).filter(Boolean).map((r) => quitarAcento(r!).toLowerCase()));
  for (const x of items) {
    const marco = sinParentesis(frase(x)).replace('___', ' ');
    for (const w of marco.split(/[^\p{L}]+/u).filter((t) => t.length >= 3)) {
      const wl = quitarAcento(w).toLowerCase();
      if (respuestas.has(wl)) { v.push(`${x.adj} ${x.sustantivo}: el marco contiene «${w}», que es la RESPUESTA de otro ítem del lote`); continue; }
      const des = DESINENCIAS_ADJETIVALES.find((d) => wl.endsWith(d));
      if (des && [...respuestas].some((r) => r.endsWith(des)))
        v.push(`${x.adj} ${x.sustantivo}: el marco contiene «${w}», que acaba en «-${des}» — la misma desinencia adjetival que la respuesta de otro ítem, y eso es una pista del significante entre ítems`);
    }
  }

  return v;
}

// ══════════════════════════════════════════════════════════════════════
// ★ G21 · LA FUGA CONTRA LO YA PUBLICADO, que era un AGUJERO DECLARADO
// ══════════════════════════════════════════════════════════════════════
//
// El §4.12 rumano lo dejó escrito y abierto: «la respuesta puede estar en la
// frase de OTRO lote: el gate es intra-ítem y nadie mira el corpus». Con dos
// lotes rusos publicados (22 ítems) el hueco ya es real, y cerrarlo cuesta
// leer un directorio. Comprueba las dos direcciones:
//
//   · ninguna palabra de un marco nuevo es la RESPUESTA de un ejercicio ruso
//     ya publicado —el alumno la tiene delante en otra tarjeta—;
//   · ninguna respuesta nueva está ya publicada como respuesta de otro punto,
//     que sería la duplicación que `--asigna` no puede ver.
//
// Va aparte de `verificar()` porque toca el disco y el test la corre con el
// directorio real: un gate que lee ficheros dentro del verificador haría
// imposible correrlo sobre un lote parcheado.
//
// ⚠ ★ Y ESTE GATE SE PUSO ROJO AL PUBLICAR EL LOTE, SIN QUE NADA ESTUVIERA MAL.
// Es el §40 en vivo y con el signo contrario al de aquel: allí un control
// negativo se quedó SIN OBJETO al terminar el trabajo; aquí GANÓ uno — sus
// propios doce ítems, que en cuanto se escriben en `ru/blocks/b6.json` pasan a
// ser «lo ya publicado» y el lote se denuncia a sí mismo. La pregunta correcta
// al verlo en rojo no fue «¿qué se ha roto?» sino «¿qué mide ahora que antes no
// medía?», y la respuesta es: a sí mismo.
//
// **El arreglo no es borrar el control ni fecharlo, que se desincronizaría: es
// excluir por IDENTIDAD.** Un ejercicio publicado cuya frase es una de las doce
// de este lote ES este lote, y la comparación por frase no depende de tags, de
// ids ni de que nadie se acuerde de nada. Así el gate sigue contestando la
// pregunta que existe para contestar —«¿una palabra de mi marco es la respuesta
// de OTRO ejercicio?»— antes y después de publicar.
export function fugaContraLoPublicado(items: ClozeAdjRu[], dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const propias = new Set(items.map((x) => frase(x).replace(/\s+/g, ' ').trim().toLowerCase()));
  const publicadas = new Map<string, string>();
  for (const f of fs.readdirSync(dir).filter((x: string) => /^b\d+\.json$/.test(x)))
    for (const ex of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Array<Record<string, any>>) {
      const frasePub = String(ex?.data?.sentence ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (propias.has(frasePub)) continue;   // soy yo, ya publicado
      for (const b of (ex?.data?.blanks ?? []) as Array<{ answer?: string; alternatives?: string[] }>)
        for (const c of [b.answer, ...(b.alternatives ?? [])])
          if (typeof c === 'string') publicadas.set(quitarAcento(c).toLowerCase(), String(ex.id));
    }
  for (const x of items) {
    const r = respuestaDe(x);
    if (r && publicadas.has(quitarAcento(r).toLowerCase()))
      out.push(`${x.adj} ${x.sustantivo}: la respuesta «${r}» ya está publicada en ${publicadas.get(quitarAcento(r).toLowerCase())}`);
    for (const w of sinParentesis(frase(x)).replace('___', ' ').split(/[^\p{L}]+/u).filter(Boolean)) {
      const id = publicadas.get(quitarAcento(w).toLowerCase());
      if (id) out.push(`${x.adj} ${x.sustantivo}: el marco contiene «${w}», que es la RESPUESTA del ejercicio ya publicado ${id}`);
    }
  }
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS, CON SU NÚMERO PREDICHO ESCRITO ANTES DE CORRER
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ EL NÚMERO PREDICHO NO ES ADORNO: ES EL ÚNICO TESTIGO POSIBLE de una ruta
// muerta. Un gate muerto se caza con un testigo rojo; una RUTA muerta no,
// porque su «rojo» es acertar y acertar poco es justo lo que se busca.
//
// ⚠ Y SE PREDICE TAMBIÉN EL DENOMINADOR (`aplicablesPredicho`), porque el lote
// 2 demostró que la predicción NO caza un instrumento mal elegido: su ruta por
// lectura predijo 2 y observó 1, **y las dos cifras eran del aparato roto**.
//
// ⚠ Y AQUÍ HAY ADEMÁS UN CONTROL QUE EL LOTE 2 NO TENÍA, y es la respuesta
// directa a ese hallazgo: `el-paradigma-entero` es una ruta que modela al
// alumno que lo sabe TODO, escrita con tablas de manual propias de este
// fichero, y **tiene que acertar 12 de 12**. Si no lo hace, mis tablas están
// mal y el número de TODAS las demás rutas es de un aparato roto — porque
// todas comparten esas tablas. Es además un SEGUNDO CAMINO: las tablas de
// manual, escritas a mano aquí, reproducen lo que produce `paradigma-adj-ru.ts`
// desde dos filas y un sentinela.
//
// ══ TRES LISTAS, PORQUE SON TRES PREGUNTAS ══════════════════════════
//
//   · `ESTRATEGIAS` — rutas CIEGAS: el alumno las ejecuta sin haber aprendido
//     nada de este punto. Van contra el tope de la mitad.
//
//     ⚠ ★ Y EL TOPE NO PUEDE FALLAR PARA LA MAYORÍA DE ELLAS, QUE ES UN GATE
//     VISTO SÓLO EN VERDE. Lo cazó el lingüista adversarial y es un teorema
//     del diseño pareado, no una medición: dentro de un par, G16 obliga a que
//     el marco, el sustantivo, el caso, el número y la forma nominal sean
//     IDÉNTICOS, así que **toda ruta que no lea el LEMA ni la GLOSA es
//     constante dentro del par y acierta como mucho uno de cada dos: 6/12 =
//     exactamente el tope, nunca por encima**. El verde de «ninguna ciega pasa
//     de la mitad» no dice nada sobre estas doce frases. Las únicas cifras
//     informativas son las de las rutas que SÍ leen el lema —`copiar-el-lema`,
//     `tema-mas-cola-del-sustantivo`, `una-desinencia-fija`, `rima-con-el-ancla`
//     y todos los perfiles—, y para ésas el tope sí es el criterio correcto.
//     Es el §4.36 rumano con el signo cambiado: allí el tope garantizaba el
//     hallazgo falso sobre un máximo buscado; aquí garantiza el verde.
//   · `PERFILES` — conocimiento PARCIAL: presuponen alguna de las dos filas,
//     que es el CONTENIDO. No van contra ningún tope; su número dice cuántos
//     ítems discriminan y cuáles.
//   · `RUTAS_POR_LECTURA` — la del alumno que ha leído las 2.180 lecturas.

export interface Vista {
  s: string;
  pista: string;
  /** El lema adjetival, que está escrito en el paréntesis. */
  adj: string;
  /** La forma del sustantivo, que está escrita en la frase. */
  sustantivo: string;
  /** La casilla, que la PISTA deletrea. La ruta no recibe la entrada del
   *  lexicón: no puede leer `tema` ni `desinenciaTonica` «ni con un `as`». */
  caso: CasoRu;
  forma: FormaAdjetival;
}
export function vista(x: ClozeAdjRu): Vista | null {
  const fn = formaNominal(x), fa = formaAdj(x);
  if (!fn || !fa) return null;
  return { s: frase(x), pista: x.pista, adj: x.adj, sustantivo: fn, caso: x.caso, forma: fa };
}

/** ⚠ LAS DOS FILAS COMO LAS TRAE UN MANUAL, y no importadas de la máquina.
 *  Aquí la duplicación es deliberada y tiene dos funciones: (a) una ruta
 *  modela lo que el alumno SABE, y para poder estar equivocada tiene que
 *  tener su propia tabla; (b) escritas a mano son un SEGUNDO CAMINO sobre las
 *  dos filas de `paradigma-adj-ru.ts`, y `el-paradigma-entero` comprueba que
 *  los dos caminos coinciden en las doce respuestas.
 *  La `о` de la fila dura se escribe `о` y la regla de la /o/ la cambia
 *  DESPUÉS, donde la ruta la conozca; la `ы` se escribe `ы` y la regla de la
 *  и tras velar o sibilante —que es capa DADA— la cambia después. */
const FILA_DURA: Record<FormaAdjetival, Partial<Record<CasoRu, string>>> = {
  m: { gen: 'ого', dat: 'ому', instr: 'ым', prep: 'ом' },
  f: { gen: 'ой', dat: 'ой', instr: 'ой', prep: 'ой' },
  n: { gen: 'ого', dat: 'ому', instr: 'ым', prep: 'ом' },
  pl: { gen: 'ых', dat: 'ым', instr: 'ыми', prep: 'ых' },
};
const FILA_BLANDA: Record<FormaAdjetival, Partial<Record<CasoRu, string>>> = {
  m: { gen: 'его', dat: 'ему', instr: 'им', prep: 'ем' },
  f: { gen: 'ей', dat: 'ей', instr: 'ей', prep: 'ей' },
  n: { gen: 'его', dat: 'ему', instr: 'им', prep: 'ем' },
  pl: { gen: 'их', dat: 'им', instr: 'ими', prep: 'их' },
};
/** El tema, que el alumno saca del lema quitándole la desinencia visible. */
const temaDelLema = (lema: string) => quitarAcento(lema).replace(/(ый|ой|ий)$/, '');
/** La regla ortográfica de la и tras velar o sibilante: es `u1-ortografia-sibilantes`,
 *  o sea capa DADA. Una ruta que no la aplicara produciría `*русскым` y
 *  fallaría por algo que el alumno SÍ sabe: el número saldría más bajo de lo
 *  real, que es el peor sesgo posible en un tope. */
const u1 = (tema: string, des: string) => (/[кгхжшщч]$/.test(tema) ? des.replace(/^ы/, 'и') : des);
/** La regla de la /o/ átona, que NO está en `u1-ortografia-sibilantes`: la /o/
 *  de la desinencia se escribe `е` tras sibilante cuando es ÁTONA y `о` cuando
 *  es tónica. El alumno la trae de `u4-declinacion-singular` (столом /
 *  учителем / врачом / товарищем), que es prerrequisito de este punto. */
const reglaO = (tema: string, tonica: boolean, des: string) =>
  /[жшщцч]$/.test(tema) && !tonica ? des.replace(/^о/, 'е') : des;
/** El acento, leído del lema: `-ой` sólo puede ser una desinencia tónica. Es
 *  información del significante y está a la vista del alumno. */
const tonicoPorElLema = (lema: string) => /ой$/.test(quitarAcento(lema));

export interface Ruta {
  nombre: string;
  porQue: string;
  predicho: number;
  aplicablesPredicho: number;
  correr: (v: Vista) => string | null;
}

export const ESTRATEGIAS: Ruta[] = [
  {
    nombre: 'copiar-el-lema',
    porQue: 'La única cadena adjetival que el estímulo le entrega es la del paréntesis. Su número NO es cero y eso está declarado: acierta el ítem 12, que es el sincretismo del femenino oblicuo de un lema de desinencia tónica (большой = m.nom = f.gen = f.dat = f.instr = f.prep). Uno de doce es el suelo y G19 lo fija: con dos, «copiar el lema» dejaría de serlo.',
    predicho: 1,
    aplicablesPredicho: 12,
    correr: (v) => v.adj,
  },
  {
    nombre: 'copiar-el-sustantivo',
    porQue: 'La otra cadena que el estímulo entrega. Tiene que dar CERO, y su cero no es un resultado: es el control de que la ruta corre — el informe imprime `aplicables`, y si fuera 0 la ruta estaría apagada y su cero sería el de otra cosa.',
    predicho: 0,
    aplicablesPredicho: 12,
    correr: (v) => v.sustantivo,
  },
  {
    nombre: 'tema-mas-cola-del-sustantivo',
    porQue: '★ EL DETECTOR DEL §4.43 RUMANO, donde una regla acertó 4 de 4 sin una palabra de rumano porque el objeto del estímulo llevaba su propia respuesta pegada al final. Aquí el ancla es un sustantivo declinado y está a una palabra del hueco, así que la pregunta hay que hacerla: pega al tema del adjetivo las dos últimas letras del sustantivo. Su cero es la evidencia de que las desinencias nominales y las adjetivales no se solapan en estas doce casillas, y va MEDIDO y no razonado.',
    predicho: 0,
    aplicablesPredicho: 12,
    correr: (v) => temaDelLema(v.adj) + quitarAcento(v.sustantivo).slice(-2),
  },
  // ⚠ LAS DOS QUE SIGUEN LAS TRAJO EL LINGÜISTA ADVERSARIAL Y SU NÚMERO NO ES
  // UNA PREDICCIÓN MÍA: es el suyo, reproducido. Van escritas así porque un
  // número reportado que no es la salida pegada de un instrumento propio es una
  // afirmación, y confundir «lo predije» con «lo reproduje» es lo que hace que
  // la predicción deje de ser un testigo.
  {
    nombre: 'una-desinencia-fija',
    porQue: '★ LA LÍNEA BASE QUE FALTABA, y sin ella ninguna de las demás cifras se puede leer: el alumno que se aprende UNA desinencia y la pega al tema en los doce huecos. Se enumeran todas las desinencias que el lote usa y se toma la MEJOR —o sea es un máximo buscado (§4.36) y por eso se imprime el barrido entero, no sólo el ganador—. Su número dice si el reparto de desinencias del lote está equilibrado: con seis pares y doce desinencias distintas el máximo tiene que ser 2, y si saliera más alto el lote estaría repitiendo casilla sin darse cuenta.',
    predicho: 2,
    aplicablesPredicho: 12,
    correr: (v) => temaDelLema(v.adj) + DESINENCIA_FIJA,
  },
  {
    nombre: 'rima-con-el-ancla',
    porQue: '★ LA RUTA DEL SIGNIFICANTE QUE UN HISPANOHABLANTE EJECUTA DE VERDAD, y no es `tema-mas-cola` (que pega la cola literal y da 0): es MAPEAR la terminación del sustantivo a una desinencia adjetival. «si el ancla acaba en -ге, pon -ой; si en -на, pon -ого». Se calcula el mapa ÓPTIMO por enumeración, así que es otro máximo buscado. ⚠ Y SU 6/12 NO ES UNA FUGA SINO EL MISMO TEOREMA DEL DISEÑO PAREADO: los dos ítems de un par comparten el sustantivo, luego comparten clase de rima, luego el mapa óptimo acierta como mucho uno de los dos. Seis pares, seis aciertos. Lo que sí es informativo es el barrido de UNA letra, que agrupa distinto: `окна` y `человека` acaban las dos en -а y las dos piden -ого, así que ahí una sola asociación cobra dos ítems. Se imprimen los dos.',
    predicho: 6,
    aplicablesPredicho: 12,
    correr: (v) => { const d = MAPA_RIMA.get(quitarAcento(v.sustantivo).slice(-2)); return d ? temaDelLema(v.adj) + d : null; },
  },
];

/** ⚠ LOS DOS MÁXIMOS SE BUSCAN, NO SE DECLARAN, y por eso viven en funciones:
 *  una constante escrita a mano se desincroniza del lote en cuanto cambia un
 *  ítem, y entonces la ruta mide otra cosa sin que nada falle. Se recalculan
 *  sobre `ITEMS` cada vez. */
const DESINENCIAS_DEL_LOTE = () => [...new Set(ITEMS.map((x) => desinenciaDe(x)).filter(Boolean) as string[])];
export function barridoDesinenciaFija(): { des: string; aciertos: number }[] {
  return DESINENCIAS_DEL_LOTE().map((d) => ({
    des: d,
    aciertos: ITEMS.filter((x) => { const a = entradaAdj(x), r = respuestaDe(x); return !!a && !!r && quitarAcento(r) === temaAdj(a) + d; }).length,
  })).sort((a, b) => b.aciertos - a.aciertos);
}
/** El mapa de rima ÓPTIMO: para cada terminación del ancla (últimas `k`
 *  letras), la desinencia adjetival que más ítems acierta de esa clase. */
export function barridoRima(k: number): { clase: string; des: string; aciertos: number; n: number }[] {
  const clases = new Map<string, number[]>();
  ITEMS.forEach((x, i) => {
    const fn = formaNominal(x); if (!fn) return;
    const c = quitarAcento(fn).slice(-k);
    clases.set(c, [...(clases.get(c) ?? []), i]);
  });
  return [...clases].map(([clase, idx]) => {
    const cand = DESINENCIAS_DEL_LOTE().map((d) => ({
      d, n: idx.filter((i) => { const x = ITEMS[i]!, a = entradaAdj(x), r = respuestaDe(x); return !!a && !!r && quitarAcento(r) === temaAdj(a) + d; }).length,
    })).sort((p, q) => q.n - p.n)[0]!;
    return { clase, des: cand.d, aciertos: cand.n, n: idx.length };
  });
}
const DESINENCIA_FIJA = barridoDesinenciaFija()[0]!.des;
const MAPA_RIMA = new Map(barridoRima(2).map((r) => [r.clase, r.des]));

export const PERFILES: Ruta[] = [
  {
    nombre: 'solo-la-fila-dura',
    porQue: 'Vio UNA tabla y cree que es la única, con la regla ortográfica del bloque 1 —que es capa DADA— y sin la regla de la /o/. Su número mide el SUELO del lote y sale por encima de la mitad por una razón concreta y declarada: el par 5 (новым/русским) no contrasta nada que este perfil no tenga ya, porque su diferencia entera es la и tras velar. Acierta los DOS ítems de ese par y exactamente uno de cada uno de los otros cinco.',
    predicho: 7,
    aplicablesPredicho: 12,
    correr: (v) => {
      const t = temaDelLema(v.adj);
      const d = FILA_DURA[v.forma][v.caso];
      return d ? t + u1(t, d) : null;
    },
  },
  {
    nombre: 'fila-dura-mas-la-o-del-sustantivo',
    porQue: '★ EL PERFIL QUE MIDE LA TRANSFERENCIA DESDE EL PRERREQUISITO. Sabe la fila dura y trae de `u4-declinacion-singular` la regla de la /o/ átona (столом / учителем / врачом / товарищем), más el acento leído del lema. Lo único que le falta es la fila BLANDA. Su número dice cuánto del adjetivo se resuelve sin haber visto la segunda fila, y por tanto qué parte del punto es de verdad nueva.',
    predicho: 10,
    aplicablesPredicho: 12,
    correr: (v) => {
      const t = temaDelLema(v.adj);
      const d = FILA_DURA[v.forma][v.caso];
      return d ? t + u1(t, reglaO(t, tonicoPorElLema(v.adj), d)) : null;
    },
  },
  {
    nombre: 'terminacion-del-lema',
    porQue: '★ LA REGLA DEL SIGNIFICANTE, y es la que decide el diseño: «si el lema acaba en -ий, fila blanda; si en -ый o -ой, fila dura». Es falsa y acierta casi siempre, porque de los tres lemas en -ий del lexicón uno es blando de verdad (синий) y otro es HOMÓGRAFO de un blando en las 24 casillas (хороший, medido con la máquina). El único que la rompe es русский. ⚠ Y EL ARGUMENTO CON EL QUE LA v0 LA DEJABA FUERA DEL TOPE ERA FALSO, lo demostró el lingüista adversarial corriendo su refutación: decía «para ejecutarla hacen falta LAS DOS FILAS», y no hacen falta — **la fila blanda ES la dura con la primera vocal de la desinencia ablandada** (ого→его, ому→ему, ым→им, ом→ем, ой→ей, ых→их, ыми→ими, ая→яя, ую→юю, ые→ие), así que basta UNA tabla más un cambio de letra. Implementado así (ver `una-fila-mas-ablandar`) da los MISMOS 10/12 y los MISMOS dos fallos. Se queda en PERFILES por el criterio del §4.35 bien aplicado —no es «¿cuántas tablas hace falta saberse?» sino «¿el alumno llega ya produciéndolo?», y el alumno no llega sabiendo -ого/-ому/-ым/-ом, que no se parecen a ninguna desinencia nominal— pero el argumento que lo sostiene es ése y no el que estaba escrito. La objeción queda publicada con su medida para que el siguiente la pueda reabrir.',
    predicho: 10,
    aplicablesPredicho: 12,
    correr: (v) => {
      const t = temaDelLema(v.adj);
      const blando = /ий$/.test(quitarAcento(v.adj));
      const d = (blando ? FILA_BLANDA : FILA_DURA)[v.forma][v.caso];
      if (!d) return null;
      return t + u1(t, blando ? d : reglaO(t, tonicoPorElLema(v.adj), d));
    },
  },
  {
    nombre: 'una-fila-mas-ablandar',
    porQue: '★ LA REFUTACIÓN DEL LINGÜISTA ADVERSARIAL, IMPLEMENTADA Y CORRIDA, y su número no es una predicción mía sino el suyo reproducido. Yo defendía `terminacion-del-lema` fuera del tope diciendo que «hacen falta LAS DOS FILAS». No hacen falta: la fila blanda es la dura con la PRIMERA VOCAL de la desinencia ablandada (о→е, ы→и, а→я, у→ю), así que esta ruta se sabe UNA tabla y ablanda si el lema acaba en -ий. Da los mismos 10 de 12 y falla los mismos dos ítems (1 y 5, los dos `русский` de la /o/). O sea que el argumento era falso y la conclusión aguanta por otro camino: lo que no trae el alumno es la tabla dura, no el número de tablas.',
    predicho: 10,
    aplicablesPredicho: 12,
    correr: (v) => {
      const t = temaDelLema(v.adj);
      const d = FILA_DURA[v.forma][v.caso];
      if (!d) return null;
      const ablandar = (x: string) => x.replace(/^о/, 'е').replace(/^ы/, 'и').replace(/^а/, 'я').replace(/^у/, 'ю');
      if (/ий$/.test(quitarAcento(v.adj))) return t + ablandar(d);
      return t + u1(t, reglaO(t, tonicoPorElLema(v.adj), d));
    },
  },
  {
    nombre: 'todo-menos-el-acento',
    porQue: 'Sabe las dos filas, la clase de cada lema y la regla de la /o/, y trata TODAS las desinencias como átonas. Su número aísla lo que vale el bit de acento en este lote, que es el eje de dos de los seis pares. Falla exactamente los dos ítems de `большой`, que son las dos fronteras del acento.',
    predicho: 10,
    aplicablesPredicho: 12,
    correr: (v) => {
      const t = temaDelLema(v.adj);
      const blando = CLASE_DE_MANUAL[v.adj]?.blando ?? false;
      const d = (blando ? FILA_BLANDA : FILA_DURA)[v.forma][v.caso];
      if (!d) return null;
      return t + u1(t, blando ? d : reglaO(t, false, d));
    },
  },
  {
    nombre: 'el-paradigma-entero · CONTROL DEL APARATO',
    porQue: '⚠ NO ES UNA RUTA DEL ALUMNO: ES EL CONTROL DE QUE LAS TABLAS DE ESTE FICHERO NO ESTÁN ROTAS. Modela al alumno que lo sabe todo y TIENE QUE ACERTAR 12 DE 12; si no lo hace, mis dos filas de manual están mal y el número de todos los demás perfiles es de un aparato roto — porque todas las rutas comparten estas tablas. Es la respuesta al hallazgo A-1 del lote 2, donde la predicción escrita coincidió con lo observado y las dos cifras salían de una ruta que medía el vacío: un denominador correcto no habría salvado a aquella ruta, y un control positivo sí la habría cazado. Y es además un SEGUNDO CAMINO sobre `paradigma-adj-ru.ts`: dos filas escritas a mano aquí contra dos filas con sentinela allí.',
    predicho: 12,
    aplicablesPredicho: 12,
    correr: (v) => {
      const t = temaDelLema(v.adj);
      const c = CLASE_DE_MANUAL[v.adj];
      if (!c) return null;
      const d = (c.blando ? FILA_BLANDA : FILA_DURA)[v.forma][v.caso];
      if (!d) return null;
      return t + u1(t, c.blando ? d : reglaO(t, c.tonica, d));
    },
  },
];

/** ★ EL CONTROL DEL APARATO DE VERDAD, Y LA RUTA `el-paradigma-entero` NO LO ERA.
 *
 *  ⚠ LO DEMOSTRÓ EL LINGÜISTA ADVERSARIAL CON UNA MUTACIÓN, y es el hallazgo más
 *  caro de su dictamen porque el control fallaba EXACTAMENTE COMO YO HABÍA
 *  ESCRITO QUE NO PODÍA FALLAR. Los doce ítems tocan **6 de las 24 casillas**, y
 *  de `FILA_BLANDA` sólo validan DOS (`f.prep` y `n.gen`, vía `синий`), porque
 *  `хороший` y `русский` van por `FILA_DURA`. Mutando `FILA_BLANDA` en las
 *  casillas que el lote no toca, el control seguía imprimiendo **12/12** y su
 *  frase «los números de los demás perfiles se pueden leer» — mientras
 *  `terminacion-del-lema`, que es la ruta que decide el diseño entero, caía de
 *  10 a 8. Lo único que lo delataba era el `predicho` de esa ruta, que es
 *  justamente aquello de lo que un control existe para no depender: si el fallo
 *  hubiera precedido a la escritura de la predicción, no habría habido rojo.
 *
 *  **Un control que sólo mira lo que el lote usa no controla el aparato: controla
 *  el lote.** Éste compara las dos filas de manual contra `casillaAdj()` en las
 *  **144 casillas** (6 lemas × 4 formas × 6 casos), que es lo que su nombre
 *  promete. La ruta se queda —su 12/12 sigue siendo el control de que las doce
 *  respuestas concretas coinciden— pero ya no es ella la que autoriza a leer la
 *  tabla. */
export function controlDelAparato(): string[] {
  const out: string[] = [];
  for (const a of ADJETIVOS_A1) {
    const c = CLASE_DE_MANUAL[a.lema];
    if (!c) { out.push(`${a.lema}: no está en CLASE_DE_MANUAL — el segundo camino no lo cubre`); continue; }
    if (c.blando !== (a.tema === 'blando') || c.tonica !== a.desinenciaTonica)
      out.push(`${a.lema}: la clase de manual (${c.blando ? 'blando' : 'duro'}, ${c.tonica ? 'tónica' : 'átona'}) no es la del lexicón (${a.tema}, ${a.desinenciaTonica ? 'tónica' : 'átona'})`);
    const t = temaAdj(a);
    for (const f of ['m', 'f', 'n', 'pl'] as FormaAdjetival[])
      for (const caso of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as CasoRu[]) {
        const maquina = casillaAdj(a, f, caso, { animado: false });
        const d = (c.blando ? FILA_BLANDA : FILA_DURA)[f][caso];
        // El nominativo y el acusativo masculinos y plurales no viven en las
        // filas de manual (el primero lo decide el acento, el segundo la
        // animacidad): se declaran fuera en vez de compararse contra nada.
        if (d === undefined) continue;
        const manual = t + u1(t, c.blando ? d : reglaO(t, c.tonica, d));
        if (manual !== maquina) out.push(`${a.lema} ${f}.${caso}: el manual da «${manual}» y la máquina «${maquina}»`);
      }
  }
  return out;
}

/** La clase de cada lema COMO LA TRAERÍA UN MANUAL, escrita a mano y no leída
 *  del lexicón: es la mitad del segundo camino. Si algún día discrepa del
 *  lexicón, `el-paradigma-entero` deja de dar 12 y el test se pone rojo. */
const CLASE_DE_MANUAL: Record<string, { blando: boolean; tonica: boolean }> = {
  'новый': { blando: false, tonica: false },
  'молодой': { blando: false, tonica: true },
  'синий': { blando: true, tonica: false },
  'русский': { blando: false, tonica: false },
  'хороший': { blando: false, tonica: false },
  'большой': { blando: false, tonica: true },
};

// ══════════════════════════════════════════════════════════════════════
// ★ LAS RUTAS POR LECTURA, Y LA PREGUNTA DEL §33.4 EN SU TERCERA POSICIÓN
// ══════════════════════════════════════════════════════════════════════
//
// El lote 1 midió que **una preposición que rige UN SOLO CASO hace el ítem
// memorizable como bigrama**, porque todas las apariciones del lema tras ella
// son la misma casilla. El lote 2 midió el otro extremo: **un pronombre no
// selecciona casilla**, coocurre con el presente, el pasado y el infinitivo.
// La pregunta que quedó escrita para el siguiente es: *¿el vecino del hueco
// DETERMINA la casilla o sólo la acompaña?*
//
// Aquí el vecino de la derecha es un SUSTANTIVO DECLINADO, que es el extremo
// determinante de esa escala: fija el caso, el género y el número a la vez, y
// no deja ninguna otra casilla posible. Así que la ruta por lectura debería
// ser lo más fuerte que este proyecto haya medido… **si el bigrama existe**.
// Y ahí está la segunda mitad de la pregunta, que ninguno de los dos lotes
// anteriores tuvo que hacerse: una preposición y un pronombre son palabras
// GRAMATICALES y aparecen decenas de miles de veces; un sustantivo en una
// casilla concreta aparece cientos, y el bigrama adjetivo+sustantivo, decenas
// o ninguna. **Determinación y densidad tiran en direcciones contrarias.**
//
// Por eso se miden DOS rutas y no una, con su predicción cada una:
//
//   · `por-el-sustantivo` — la palabra más frecuente DELANTE del sustantivo
//     entre las que empiezan por las dos primeras letras del lema. Máxima
//     determinación, mínima densidad.
//   · `por-el-regente` — la palabra más frecuente DETRÁS del regente (`о`,
//     `у`, `от`, `в`, `из`, `помогал`) con el mismo prefijo. Menos
//     determinación —una preposición rige uno o dos casos y no dice el
//     género—, mucha más densidad.
//
// ⚠ E-2 · Y EL PAR 5 ES MÁS DÉBIL QUE LOS OTROS CINCO EN LO DE «EL CASO VA DADO
// DOS VECES», y lo destapó el lingüista adversarial: su regente no es una
// preposición sino el VERBO `помогал`, y la rección de un verbo es
// `u10-reccion-verbal`, que no es prerrequisito de este punto y no es A1 — el
// inventario los separa. No daña la determinación (`студентам` es
// inequívocamente dativo plural y la pista lo dice), pero la afirmación de la
// cabecera vale menos ahí que en los otros cinco pares. Se declara en vez de
// cambiarse: corregir un ítem que no está mal es la clase que más daño ha hecho
// en este proyecto (§4.6, seis veces).
//
// ⚠ E-3 · Y UNA CAPA LÉXICA MÁS QUE NO SE DECLARABA: de los cinco verbos de los
// marcos (`говорили`, `сидел`, `были`, `приехал`, `помогал`) sólo `говорить`
// está en `VERBOS_A1`; los otros cuatro se teclean. No afecta a ninguna
// respuesta, pero contradice la doctrina de este mismo fichero («nada se
// teclea») justo en lo que el alumno lee.
//
// ⚠ B-2 · Y UNA VARIANTE DEL XIX QUE ESTE LOTE NO PISA Y EL SIGUIENTE SÍ: el
// nominativo-acusativo plural tiene la grafía prerreforma `-ыя`, y está en el
// corpus — `новыя` **8**, leídas una a una y todas nom/ac plural en textos con ъ
// y ѣ (новыя газеты, новыя рѣчи, новыя болѣзни). Con tema velar o sibilante no
// aparece (русския 0, большия 0, хорошия 0, синия 0). Este lote no tiene ninguna
// casilla de nominativo ni de acusativo, así que hoy no muerde; **un lote que
// las use necesita para el plural el mismo trato que G6 le da al instrumental
// femenino**. Y la consecuencia que vale para todo el ruso del proyecto: los
// ceros de `FALSAS_DEL_LOTE` son ceros EN ORTOGRAFÍA MODERNA, porque el corpus
// contiene texto prerreforma.
//
// ══ ★ Y EL PREFIJO DEL LOTE 2 ESTABA MAL AQUÍ, POR UNA RAZÓN DE LA LENGUA ══
//
// El lote 2 midió que el prefijo correcto para modelar «lo que un lector
// reconoce de la palabra sin saber conjugarla» son LAS DOS PRIMERAS LETRAS del
// infinitivo, «que es la parte que ninguna alternancia rusa toca». Copié ese
// prefijo y las dos rutas dieron 3/12 y 2/12 contra 5 y 6 predichos. **Antes de
// tocar la prosa se leyó lo que devolvían**, que es la única manera de saber si
// un número bajo es una propiedad de la lengua o un aparato mal hecho:
//
//   · con `ру` la ruta del sustantivo devolvió **`рукописной`** para el ítem 1
//     —un adjetivo REAL, en la casilla EXACTA que el ítem pide (femenino
//     oblicuo), con el lema equivocado—;
//   · con `но` devolvió **`ночью`** («ночью у окна») y con `бо`, **`богатства`**
//     («из богатства страны»): ni siquiera son modificadores del sustantivo;
//   · y la ruta del regente devolvió `ног`, `рук`, `ход`, `холода`, `больницы`:
//     dos letras tras una preposición cazan sustantivos.
//
// O sea que **el aparato medía a un lector que sólo reconoce dos letras**, y
// ese lector no existe. La razón por la que el lote 2 tenía razón y aquí no es
// de la lengua y no de método: **el tema del VERBO alterna** (`писа-`→`пиш-`,
// `виде-`→`виж-`) y por eso sólo las dos primeras letras son seguras; **el tema
// del ADJETIVO no alterna en ninguna de las 24 casillas**, así que lo que un
// lector reconoce es el TEMA ENTERO. Las cuatro rutas se publican: las dos del
// prefijo corto **rotuladas SUBESPECIFICADAS**, con su número y su lectura,
// para que nadie vuelva a copiar el prefijo sin mirar si la lengua lo permite.
//
// ⚠ Esto es el A-1 del lote 2 en su forma menos vigilada: allí el prefijo
// EXCLUÍA por construcción las formas buenas y la ruta no podía acertar; aquí
// el prefijo las INCLUYE y además incluye a media lengua, así que la ruta
// acierta poco por ruido. Los dos números son plausibles y los dos son del
// aparato. Lo que los separó no fue la predicción —que en el lote 2 tampoco lo
// cazó— sino LEER lo que la ruta devuelve en los ítems que falla.

const palabraAnterior = (s: string, w: string): string | null => {
  const antes = sinParentesis(s).split(new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'u'))[0] ?? '';
  const toks = antes.replace('___', ' ').split(/[^\p{L}]+/u).filter(Boolean);
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : null;
};
/** El regente: la última palabra ANTES del hueco. */
const regente = (v: Vista): string | null => {
  const toks = sinParentesis(v.s).split('___')[0]?.split(/[^\p{L}]+/u).filter(Boolean) ?? [];
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : null;
};
const dosLetras = (lema: string) => quitarAcento(lema).slice(0, 2);
/** El TEMA del adjetivo: el lema menos su desinencia de nominativo masculino.
 *  Es lo que un lector reconoce de un adjetivo ruso, porque no alterna en
 *  ninguna de las 24 casillas. Se importa de la máquina (`temaAdj`) y no se
 *  recalcula. */
const temaLeible = (lema: string) => temaAdj({ lema, tema: 'duro', desinenciaTonica: false, glosa: '' });

/** La palabra más frecuente que PRECEDE a `siguiente` entre las que empiezan
 *  por `prefijo`, en 7,7 M de palabras. `null` si no hay ninguna: un `null`
 *  baja el denominador y se ve, que es lo que un cero no deja ver. */
const colocacionAntesDe = (siguiente: string, prefijo: string): string | null => {
  const re = new RegExp(`${INI}(${prefijo}\\p{L}*)\\s+${siguiente}${FIN}`, 'giu');
  const cuenta = new Map<string, number>();
  for (const m of corpus().matchAll(re)) {
    const w = m[1]!.toLowerCase();
    cuenta.set(w, (cuenta.get(w) ?? 0) + 1);
  }
  if (!cuenta.size) return null;
  return [...cuenta].sort((a, b) => b[1] - a[1])[0]![0];
};
/** La palabra más frecuente que SIGUE a `anterior` con el mismo prefijo. */
const colocacionDespuesDe = (anterior: string, prefijo: string): string | null => {
  const re = new RegExp(`${INI}${anterior}\\s+(${prefijo}\\p{L}*)${FIN}`, 'giu');
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
    nombre: 'por-el-sustantivo-con-dos-letras · SUBESPECIFICADA',
    porQue: '⚠ NO MIDE AL LECTOR QUE DICE MEDIR, Y SE PUBLICA PARA QUE NADIE COPIE EL PREFIJO DEL LOTE 2 SIN MIRAR LA LENGUA. Dos letras bastan en el verbo porque el tema alterna y sólo ellas son seguras; en el adjetivo el tema NO alterna en ninguna de las 24 casillas, así que un lector reconoce mucho más. Con `ру` devolvió `рукописной` —un adjetivo real en la casilla exacta del ítem y con el lema equivocado—, con `но` devolvió `ночью` y con `бо`, `богатства`, que ni siquiera modifican al sustantivo. Su número es del aparato y no de la lengua; se queda medido y rotulado, que es guardar la evidencia negativa en vez de perderla.',
    predicho: 3,
    aplicablesPredicho: 6,
    correr: (v) => colocacionAntesDe(quitarAcento(v.sustantivo), dosLetras(v.adj)),
  },
  {
    nombre: 'por-el-regente-con-dos-letras · SUBESPECIFICADA',
    porQue: '⚠ Ídem desde el otro lado, y peor: dos letras detrás de una preposición cazan sustantivos (`ног`, `рук`, `ход`, `холода`, `больницы`). Publicada con su número por el mismo motivo.',
    predicho: 2,
    aplicablesPredicho: 12,
    correr: (v) => {
      const reg = regente(v);
      return reg ? colocacionDespuesDe(reg, dosLetras(v.adj)) : null;
    },
  },
  {
    nombre: 'memoria-colocacional-por-el-sustantivo',
    porQue: '★ LA MEDIDA REAL, y la que contesta la pregunta del §33.4 en su tercera posición. La palabra más frecuente DELANTE de la forma nominal del ítem entre las que empiezan por el TEMA del adjetivo. El vecino de la derecha es un sustantivo DECLINADO, que es el extremo determinante de la escala que abrieron los lotes 1 y 2: fija el caso, el género y el número a la vez y no deja ninguna otra casilla posible. Lo que la limita no es la ambigüedad sino la DENSIDAD — un sustantivo en una casilla concreta no es una palabra gramatical y su bigrama con un adjetivo concreto sale decenas de veces o ninguna—, y por eso el denominador se predice aparte y vale tanto como el numerador. ★ OBSERVADO Y NO AJUSTADO: predije 5 de 5 y salió **4 de 4** — la densidad la calculé uno alto y el MECANISMO salió exacto. Cuando el bigrama existe, la ruta acierta SIEMPRE: cuatro de cuatro, cero errores de casilla. Es el techo de la escala que abrieron los lotes 1 y 2.',
    predicho: 5,
    aplicablesPredicho: 5,
    correr: (v) => colocacionAntesDe(quitarAcento(v.sustantivo), temaLeible(v.adj)),
  },
  {
    nombre: 'memoria-colocacional-por-el-regente',
    porQue: '★ La misma lectura desde el otro lado: la palabra más frecuente DETRÁS del regente (о, у, от, в, из, помогал) con el mismo prefijo. El regente es una palabra gramatical y aparece decenas de miles de veces, así que la densidad deja de ser el problema; lo que se pierde es determinación, porque una preposición rige uno o dos casos y no dice nada del género ni del número. Las dos rutas juntas son el experimento que ningún lote anterior pudo hacer: separan «el vecino DETERMINA la casilla» de «el bigrama EXISTE», que en el lote 1 y en el lote 2 iban pegadas y no se podían distinguir. ★ OBSERVADO Y NO AJUSTADO: predije 7 de 9 y salió **5 de 12** — el denominador lo calculé BAJO (el tema entero tras `помогал` sí encuentra algo) y el numerador, alto. Y los siete fallos, LEÍDOS uno a uno, son la medida que buscaba: CINCO son el lema correcto en OTRA CASILLA (синем por синей, русских por русского, большой por большом, хорошего por хорошей, большого por большой), uno es la casilla correcta con OTRO LEMA (новобрачным, que es dativo plural de verdad) y uno es `синя`, la FORMA CORTA usada como atributo en una fórmula folclórica, y una máquina que no produce cortas no la habría propuesto nunca. ⚠ Y LA CITA QUE ESCRIBÍ AQUÍ ERA FALSA, la cazó el lingüista adversarial y las cifras van releídas: **`синя` 19 es el unigrama**, no la fórmula; «из синя моря» sale **6** y lo que esta ruta ve es «у синя» (**3**), que es el regente del ítem 4 — y dos de esas tres son de Pushkin («Князь у синя моря ходит», *Сказка о царе Салтане*), no de Afanásiev. Es el aviso del §42 en su forma más barata de cometer: una cifra que CONFIRMA lo que ya creías, puesta al lado de la afirmación, no se vuelve a mirar. Y la lectura correcta no es «vieja y no mala» a secas: la forma corta atributiva del ruso está congelada en un puñado de fórmulas con sustantivos CONTADOS (синя моря, бела свѣта, красна девица, добра молодца), así que no es una casilla del paradigma sino léxico — «у синя окна» no es ruso de ninguna época, y por eso ningún hueco de los doce la admite (АГ-80: la forma corta moderna sólo es predicado). O sea: la preposición fija el LEMA y deja la casilla abierta; el sustantivo declinado cierra la casilla. Medido, no razonado.',
    predicho: 7,
    aplicablesPredicho: 9,
    correr: (v) => {
      const reg = regente(v);
      return reg ? colocacionDespuesDe(reg, temaLeible(v.adj)) : null;
    },
  },
];

// ══════════════════════════════════════════════════════════════════════
// EL CONTROL POSITIVO DEL LOTE: LAS FORMAS QUE NO DEBE PRODUCIR
// ══════════════════════════════════════════════════════════════════════
//
// Son las formas que ESTE lote invita a producir, no una lista general. Cada
// una con su veredicto por los DOS caminos —la ortografía, que es un módulo
// escrito en otra pasada para otra pregunta, o el corpus—, y con el camino
// dicho: que una la cace uno y otra el otro no es lo mismo.
//
// ⚠ Y LAS DOS QUE **NO** ESTÁN, con su motivo, porque su ausencia es el
// hallazgo: `большем` (15) y `большей` (156) son lo que producen las dos
// fronteras del acento… y son formas REALES de OTRO LEMA, el comparativo
// declinado `бо́льший` «mayor», leídas una a una en `lexicon-a1.ts`. Meterlas
// aquí saldría «✓ rechazada por corpus» —15 < 264, 156 < 1684— y el verde
// sería falso: el veredicto acertaría por frecuencia sobre un HOMÓGRAFO, que
// es exactamente el `*лесы` del §35 con el signo cambiado. Un control positivo
// sólo puede llevar formas que no sean palabra de ningún lema.
export const FALSAS_DEL_LOTE: { mala: string; buena: string; porQue: string }[] = [
  { mala: 'русскей', buena: 'русской', porQue: 'la FILA BLANDA por la terminación del lema, que es el error diana de la frontera del ítem 1. русскей 0 · русской 297' },
  { mala: 'русскего', buena: 'русского', porQue: 'ídem en la otra casilla de la /o/, la del ítem 5. русскего 0 · русского 397' },
  { mala: 'русскяя', buena: 'русская', porQue: 'ídem en el nominativo femenino, que este lote no publica pero que la misma regla falsa produce. русскяя 0 · русская 355' },
  { mala: 'синой', buena: 'синей', porQue: 'y la sobreaplicación contraria: la fila DURA sobre un tema blando. синой 0 · синей 107' },
  { mala: 'синого', buena: 'синего', porQue: 'ídem en el genitivo. синого 0 · синего 40' },
  { mala: 'хорошого', buena: 'хорошего', porQue: 'la /o/ sin la regla de la sibilante átona, que es el contenido del par 3. хорошого 0 · хорошего 415' },
  { mala: 'хорошом', buena: 'хорошем', porQue: 'ídem en el prepositivo, la casilla del par 4. хорошом 0 · хорошем 89' },
  { mala: 'хорошой', buena: 'хорошей', porQue: 'ídem en el femenino oblicuo, la casilla del par 6. хорошой 0 · хорошей 125' },
  { mala: 'русскым', buena: 'русским', porQue: 'la ы sin la regla de la и tras velar. Es capa DADA (u1-ortografia-sibilantes) y por eso el ítem 10 no discrimina: la lleva igualmente el control, porque un generador que la produjera estaría roto. русскым 0 · русским 204' },
  { mala: 'большым', buena: 'большим', porQue: 'ídem tras sibilante. большым 0 · большим (la casilla no la publica este lote, pero la máquina la produce)' },
];

/** El veredicto de UNA forma falsa por los dos caminos, con el que la caza
 *  dicho: la ORTOGRAFÍA (un módulo escrito en otra pasada para otra pregunta)
 *  o el CORPUS. Confundirlos es leer un sello como si fuera dos. */
export function veredictoFalsa(mala: string, buena: string): { rechaza: boolean; via: string; detalle: string } {
  const orto = revisarOrtografiaRu(mala);
  if (orto.length) return { rechaza: true, via: 'ortografia', detalle: `${orto[0]!.clase} en «${orto[0]!.palabra}»` };
  const nm = buscar(quitarAcento(mala)).n, nb = buscar(quitarAcento(buena)).n;
  if (nm < nb) return { rechaza: true, via: 'corpus', detalle: `«${mala}» ${nm} < «${buena}» ${nb}` };
  return { rechaza: false, via: '—', detalle: `«${mala}» ${nm} ≥ «${buena}» ${nb}` };
}

export interface Informe { nombre: string; aciertos: number; n: number; aplicables: number; predicho: number; aplicablesPredicho: number; cuales: number[] }

/** Acierta si y sólo si la TARJETA se la daría por buena: la respuesta o
 *  cualquiera de sus alternativas. Medir con una regla propia mide otra cosa. */
export function correr(items: ClozeAdjRu[], rutas: Ruta[]): Informe[] {
  return rutas.map((es) => {
    let aplicables = 0;
    const cuales: number[] = [];
    for (const [i, x] of items.entries()) {
      const vx = vista(x);
      const s = vx ? es.correr(vx) : null;
      if (s === null) continue;
      aplicables++;
      const buenas = [respuestaDe(x), ...alternativasDe(x)].filter(Boolean).map((y) => quitarAcento(y!));
      if (buenas.includes(quitarAcento(s))) cuales.push(i + 1);
    }
    return { nombre: es.nombre, aciertos: cuales.length, n: items.length, aplicables, predicho: es.predicho, aplicablesPredicho: es.aplicablesPredicho, cuales };
  });
}

if (/[/\\]cloze-ru-a1c\.ts$/.test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  v.push(...fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, s: frase(x), answer: respuestaDe(x), alt: alternativasDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Cloze derivado RU-A1C — ${ITEMS.length} ítems de u6-adjetivo-declinado\n`);
  // ⚠ LA COLOCACIÓN SE IMPRIME Y NO SE ESCRIBE, y es una corrección del dictamen
  // (A-2): la cabecera citaba el unigrama de la respuesta y el bigrama con el
  // regente, nunca el SINTAGMA que se publica, y esas cifras se leían como si lo
  // validaran — un sello contestando la pregunta de otro. Ocho de los doce
  // sintagmas dan CERO. Ninguno es agramatical y la ausencia no prohíbe, pero el
  // cero tiene que estar a la vista y no en un comentario que se desincroniza.
  console.log('| # | adjetivo | fila | desinencia tónica | sustantivo | casilla | respuesta | desinencia | colocación | par · eje |');
  console.log('|--:|---|---|---|---|---|---|---|--:|---|');
  for (const [i, x] of ITEMS.entries()) {
    const a = entradaAdj(x)!;
    const col = buscar(`${quitarAcento(respuestaDe(x)!)} ${quitarAcento(formaNominal(x)!)}`).n;
    console.log(`| ${i + 1} | ${x.adj} | ${a.tema} | ${a.desinenciaTonica ? 'sí' : 'no'} | ${formaNominal(x)} | ${x.caso}.${formaAdj(x)} | **${respuestaDe(x)}** | -${desinenciaDe(x)} | ${col} | ${x.par} · ${x.eje}${x.frontera ? ` · FRONTERA ${x.frontera.regla}` : ''} |`);
  }
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${frase(x)}  → **${respuestaDe(x)}**  · ${x.pista}`);
  const tabla = (titulo: string, rutas: Ruta[], tope: boolean) => {
    console.log(`\n## ${titulo}\n`);
    console.log('| ruta | predicho | observado | % | aplicables (pred.) | ítems que acierta |');
    console.log('|---|--:|--:|--:|--:|---|');
    for (const r of correr(ITEMS, rutas)) {
      const mal = r.aciertos !== r.predicho ? ' ⚠ NO COINCIDE' : '';
      const malA = r.aplicables !== r.aplicablesPredicho ? ' ⚠' : '';
      const pc = Math.round((100 * r.aciertos) / r.n);
      const sobre = tope && r.aciertos / r.n > 0.5 ? ' ⚠ POR ENCIMA DEL TOPE' : '';
      console.log(`| \`${r.nombre}\` | ${r.predicho} | ${r.aciertos}/${r.n}${mal} | ${pc}%${sobre} | ${r.aplicables} (${r.aplicablesPredicho})${malA} | ${r.cuales.join(' ')} |`);
    }
  };
  tabla('Estrategias CIEGAS (tope: la mitad)', ESTRATEGIAS, true);
  tabla('PERFILES de conocimiento parcial (sin tope — dicen qué ítems discriminan)', PERFILES, false);
  tabla('RUTAS POR LECTURA (no van contra el tope a A1: el alumno ha leído cero palabras de ruso)', RUTAS_POR_LECTURA, false);
  const todas = correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]);
  const control = todas.find((r) => r.nombre.startsWith('el-paradigma-entero'))!;
  const disc = controlDelAparato();
  console.log(`\n★ CONTROL DEL APARATO — 144 casillas (6 lemas × 4 formas × 6 casos): ${disc.length} discrepancias.`);
  for (const d of disc) console.log(`  ✗ ${d}`);
  console.log(`   y la ruta \`el-paradigma-entero\` sobre los doce ítems: ${control.aciertos}/${ITEMS.length}.`);
  if (disc.length || control.aciertos !== ITEMS.length) {
    console.log('⚠ LAS TABLAS DE MANUAL DE ESTE FICHERO NO REPRODUCEN LA MÁQUINA: todos los demás');
    console.log('  números de la tabla de PERFILES son de un aparato roto y no se pueden leer.');
  } else {
    console.log('   Las dos filas escritas a mano aquí reproducen la máquina en las 144 casillas, no');
    console.log('   sólo en las seis que el lote usa: el segundo camino coincide y los perfiles se leen.');
  }
  const ac = (n: string) => new Set(todas.find((r) => r.nombre === n)!.cuales);
  const dura = ac('fila-dura-mas-la-o-del-sustantivo'), term = ac('terminacion-del-lema'), acento = ac('todo-menos-el-acento');
  const union = [...new Set([...dura, ...term, ...acento])].sort((p, q) => p - q);
  const ninguno = ITEMS.map((_, i) => i + 1).filter((k) => !union.includes(k));
  console.log(`\nLa UNIÓN de los tres perfiles parciales acierta ${union.length} de ${ITEMS.length}: ${union.join(' ')}.`);
  console.log(`Los ítems que NO acierta ningún perfil parcial: ${ninguno.join(' ') || '—'}.`);
  console.log('Y la unión no es una estrategia: elegir entre «aplica la fila dura», «lee la terminación»');
  console.log('y «olvida el acento» exige saber cuál de las tres resuelve el ítem, y eso es el punto.');
  console.log('\n## Los dos MÁXIMOS BUSCADOS, con su barrido entero (§4.36: a un máximo no se le pone tope)\n');
  console.log(`desinencia fija: ${barridoDesinenciaFija().map((d) => `-${d.des}:${d.aciertos}`).join(' ')}`);
  for (const k of [2, 1]) {
    const b = barridoRima(k);
    console.log(`rima de ${k} letra(s): ${b.map((r) => `${r.clase}→-${r.des} ${r.aciertos}/${r.n}`).join(' · ')}  = ${b.reduce((a, r) => a + r.aciertos, 0)}/${ITEMS.length}`);
  }
  console.log('Con seis pares y un sustantivo por par, la rima de 2 letras tiene una clase por par y');
  console.log('su máximo ES el suelo del diseño pareado. La de 1 letra agrupa distinto y por eso vale');
  console.log('mirarla: `окна` y `человека` acaban las dos en -а y las dos piden -ого.');
  console.log('\n## Control positivo: las formas que el lote NO debe producir\n');
  const malas = FALSAS_DEL_LOTE.map((f) => ({ ...f, ...veredictoFalsa(f.mala, f.buena) }));
  for (const m of malas) console.log(`${m.rechaza ? '✓' : '✗'} *${m.mala}  [${m.via}] ${m.detalle}   — ${m.porQue}`);
  const buenasLimpias = FALSAS_DEL_LOTE.filter((f) => revisarOrtografiaRu(f.buena).length === 0).length;
  console.log(`\n${malas.filter((m) => m.rechaza).length}/${malas.length} rechazadas · ${buenasLimpias}/${FALSAS_DEL_LOTE.length} buenas limpias.`);
  if (malas.some((m) => !m.rechaza)) { console.log('⚠ UNA FORMA FALSA NO SE RECHAZA: el control positivo está en rojo.'); process.exit(1); }
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: un hueco por ítem, caso y género/número en la pista con su forma canónica y');
  console.log('la fila NUNCA, el sustantivo DERIVADO detrás del hueco como ancla, la respuesta');
  console.log('derivada por concordar() con el género leído de la entrada nominal, ni nominativo ni');
  console.log('acusativo, ni instrumental femenino singular (la variante -ою del XIX), ningún');
  console.log('sustantivo con segundo locativo bajo в/на, ortografía y homóglifos, respuesta y forma');
  console.log('nominal atestadas, seis pares de marco idéntico con DESINENCIAS distintas, el eje de');
  console.log('cada par RECALCULADO contra el lexicón adjetival, cuatro ejes distintos, TRES');
  console.log('fronteras de reglas distintas con su distractor alcanzable y —la primera— con la');
  console.log('EVIDENCIA que la induce dentro del lote, ninguna desinencia adjetival de un ítem');
  console.log('escrita en el marco de otro, ninguna palabra del marco que sea respuesta de un');
  console.log('ejercicio ya publicado, y las diez formas del control positivo rechazadas.');
}
