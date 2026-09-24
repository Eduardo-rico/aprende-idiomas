// scripts/lotes/cloze-ru-a2c.ts — EL SÉPTIMO LOTE RUSO, tercero de A2.
//
//   npx tsx scripts/lotes/cloze-ru-a2c.ts          # gates + tabla + rutas
//   npx tsx scripts/lotes/cloze-ru-a2c.ts --json   # ítems para publicar
//
// DIEZ ítems de `u6-demostrativos` (A2, `paradigma` → cloze con pista, piso 8).
// La respuesta NO se escribe: la da la tabla `DETERMINANTES` de
// `pronombres-ru.ts`, y el SUSTANTIVO del marco tampoco: lo deriva
// `casillaNominal` desde `lexicon-a1.ts`. El molde es `cloze-ru-a1c.ts` (un
// paradigma concordado: el ítem declara dos lemas y una casilla).
//
// ══ LAS PREGUNTAS, HECHAS A LA CASILLA Y NO AL TEMA, ANTES DE ESCRIBIR ═
//
//   · **¿Qué parte es gratis, del español de México y del portugués C2?**
//     Que el determinante concuerde y tenga forma propia: las dos lenguas lo
//     hacen (este/esta/estos; este/esta/estes). La ELECCIÓN этот/тот NO se
//     examina —su `gratis` lo dice: es un re-reparto de la frontera
//     este/ese/aquel, otro contenido—: el lema va DADO en el paréntesis.
//     **Y de la forma, lo que el alumno trae es el ADJETIVO** (el prerrequisito
//     `u6-adjetivo-declinado`, publicado en b6): con él acierta gratis las
//     casillas donde el determinante coincide con la fila dura (этого, этому,
//     этом, этой — y тот igual). Lo que NO trae son exactamente dos cosas, y
//     el lote vive SÓLO en ellas:
//       (1) la casilla de la `ы` del adjetivo: `этот` pone `и` (этим, этих,
//           этими, эти) y `тот` pone `е` (тем, тех, теми, те) — medido abajo
//           con la máquina, no razonado: la fila dura da `ы` en m.instr,
//           pl.gen, pl.instr y pl.nom;
//       (2) el nominativo-acusativo CORTO: эту, no *этую (новую).
//     Ninguna de las dos transfiere: el español y el portugués no tienen
//     alternancia de vocal en el determinante ni doble forma corta/larga.
//   · **¿Qué capa mide el ítem, y cuáles carga?** `declinacion`. El CASO lo
//     da el sustantivo declinado del marco y la pista; el GÉNERO y el NÚMERO,
//     también. Son las `capas` del punto (`caso`, `genero`).
//   · **¿Qué VARÍA entre los ítems?** La CASILLA (cinco, una por par, sin
//     repetir: m.instr, pl.gen, pl.instr, pl.nom, f.ac) y el LEMA dentro del
//     par (этот/тот). La vocal и/е a 4 y 4 (k = 2: techo 1/2); la forma corta
//     en un par. ⚠ Y POR QUÉ NO SEIS PARES: las otras casillas de la `ы`
//     (m/n.instr, pl.dat, pl.prep) repiten CADENA —этим es m.instr, n.instr y
//     pl.dat; этих es pl.gen y pl.prep—, y un sexto par o repetía respuesta
//     (§D5) o caía en una casilla gratis por el adjetivo.
//   · **¿El vecino DETERMINA la casilla o sólo la acompaña?** (§33.4) La
//     determina ENTERA: es el sustantivo declinado (§52.2, la posición que
//     cierra la escala). Así que la ruta por lectura acierta donde el bigrama
//     existe — y eso NO es un atajo: con el lema dado, recordar «этим
//     человеком» ES saber la forma.
//   · **¿La preposición rige UN caso o DOS?** `с` rige dos (instr y gen: «с
//     тех пор»), `между` instr (y gen arcaico), `от` uno. No importa aquí:
//     el sustantivo declinado fija la casilla antes que la preposición.
//   · **¿Cuánto del instrumento queda fuera del control?** (§47) El segundo
//     camino es una REGLA escrita a mano (tema + vocal + desinencia), no la
//     tabla copiada; `controlDelAparato()` la corre sobre las 22 casillas de
//     cada uno de los dos lemas (44), no sobre las diez del lote.
//   · **¿El rival es una cadena DISTINTA de la respuesta?** (§59) Sí en los
//     diez; y tres de los rivales vivos son HOMÓGRAFOS de otra palabra (тих,
//     ти, тим), leídos abajo con su fuente.
//   · **¿Cada LECTURA tiene su fuente localizada?** (§71/§78) Sí, y por
//     herramienta: `CITAS` se corre entera por `scripts/cita-ru.ts` en el test.
//   · **¿El rival que el gate no genera es una respuesta correcta que la
//     pista excluye?** (§80, la novena) El sustantivo declinado fija caso y
//     número: «с тем человеком» no admite otra casilla. Ninguno.
//
// ══ LO QUE NO ESTÁ AQUÍ, CON SU MOTIVO ══════════════════════════════
//   · **La mitad interrogativa del punto** (кто/что/какой/чей). Queda SIN
//     cubrir y se dice: чем/чём se distinguen sólo por la ё (§19.1) y какой
//     es un adjetivo (lo cubre el lote 3). Otro lote.
//   · **El acusativo masculino y plural**: depende de la animacidad
//     (`u5-animacidad-acusativo`), que no es prerrequisito de este punto.
//   · **El instrumental femenino** (этой/той): tiene la variante del XIX
//     этою 268 · тою 315 (error simétrico, §46.2) y además es gratis por el
//     adjetivo.
//   · **El nominativo singular**: этот/эта/это son vocabulario de A1 («это
//     книга»), y это/то son los dos homógrafos más grandes del corpus.
//   Las exclusiones son GATE (`casillaExcluida`), no sólo esta prosa.
//
// ══ LO QUE EL LOTE NO PUEDE VER, DICHO (dictamen del 2026-09-23) ════
//   · **El par 4 no atribuye su fallo**: эти es a la vez casilla de la ы y
//     forma corta (frente a новые cambian la vocal Y la longitud), así que
//     *эты y *этие fallan el mismo ítem por razones distintas (§1.2).
//   · **El rival de OTRA casilla del mismo lema** (этом/том por этим/тем, la
//     confusión interna del paradigma, que la ruta `rima` produce) no lo
//     genera `rivalesDe` y G11 no lo ve (§C5). «с этом» 0, «этом человеком» 0.
//   · **«El alumno declina этот como adjetivo duro» es HIPÓTESIS**, sin corpus
//     de aprendices que la ateste; la frontera del adjetivo descansa en ella.
//   · Cuatro de las diez colocaciones exactas dan 0 (этими/теми городами,
//     те письма, ту школу): la FORMA está atestada; el sintagma, no (§49).
import fs from 'node:fs';
import path from 'node:path';
import { ADJETIVOS_A1, NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { casillaNominal, type CasoRu, type EntradaNominal, type GeneroRu, type NumeroRu } from '../../lib/data/languages/ru/paradigma-ru';
import { casillaAdj, temaAdj, type EntradaAdjetival, type FormaAdjetival } from '../../lib/data/languages/ru/paradigma-adj-ru';
import { DETERMINANTES } from '../../lib/data/languages/ru/pronombres-ru';
import { revisarOrtografiaRu, quitarAcento, variantesSinYo } from '../../lib/lang/ortografia-ru';
import { buscar } from '../corpus-ru';
import { candidatasConYo } from '../check-paradigma-ru';
import type { CitaDeclarada } from '../cita-ru';

export type LemaDem = 'этот' | 'тот';
export type EjeDem = 'i-e' | 'forma-corta';
export type ReglaSobreaplicadaDem =
  | 'el-determinante-como-adjetivo'   // la fila dura del prerrequisito: *этую, *тыми
  | 'тот-como-этот';                  // la vocal de этот en тот: *тими

export interface ClozeDemRu {
  p: string;
  lema: LemaDem;
  forma: FormaAdjetival;
  caso: CasoRu;
  /** El sustantivo del marco (lema de NOMBRES_A1); su forma la deriva la máquina. */
  sust: string;
  /** `___` para el hueco, `{D}` para el lema detrás y `{N}` para el sustantivo. */
  marco: string;
  pista: string;
  par: string;
  eje: EjeDem;
  frontera?: { regla: ReglaSobreaplicadaDem; motivo: string };
  /** La DECISIÓN sobre cada rival ATESTADO. La LECTURA vive en LECTURA_RIVAL. */
  rivalesNoAceptados?: Record<string, string>;
}

const P = 'u6-demostrativos';
const G_ESTE = DETERMINANTES['этот'].glosa;   // «este, ese»
const G_AQUEL = DETERMINANTES['тот'].glosa;   // «aquel, el ya mencionado»

export const ITEMS: ClozeDemRu[] = [
  // ── PAR 1 · m.instr — la casilla de la `ы`: этим / тем ─────────────
  // `с` rige instr y gen; `человеком` fija el instrumental. этим человеком 28
  // · тем человеком 7 · с тем человеком 3.
  { p: P, lema: 'этот', forma: 'm', caso: 'instr', sust: 'человек', par: 'sporil', eje: 'i-e',
    marco: 'Я долго спорил с ___ ({D}) {N}.', pista: `${G_ESTE} — instrumental masculino singular` },
  { p: P, lema: 'тот', forma: 'm', caso: 'instr', sust: 'человек', par: 'sporil', eje: 'i-e',
    marco: 'Я долго спорил с ___ ({D}) {N}.', pista: `${G_AQUEL} — instrumental masculino singular`,
    rivalesNoAceptados: { 'тим': 'NO ES UNA FORMA DE тот: es el nombre de la ciudad de Тим (Chéjov) y una vez ucraniano «тим» (Leskov). Ver LECTURA_RIVAL.' } },

  // ── PAR 2 · pl.gen — этих / тех ────────────────────────────────────
  { p: P, lema: 'этот', forma: 'pl', caso: 'gen', sust: 'друг', par: 'slyshal', eje: 'i-e',
    marco: 'Он давно ничего не слышал от ___ ({D}) {N}.', pista: `${G_ESTE} — genitivo plural` },
  { p: P, lema: 'тот', forma: 'pl', caso: 'gen', sust: 'друг', par: 'slyshal', eje: 'i-e',
    marco: 'Он давно ничего не слышал от ___ ({D}) {N}.', pista: `${G_AQUEL} — genitivo plural`,
    rivalesNoAceptados: {
      'тих': 'NO ES UNA FORMA DE тот: es la forma corta de тихий («был тих»). Ver LECTURA_RIVAL.',
      'тых': 'NO se acepta: 2 apariciones, las dos en el skaz de habla ucraniana del narrador de «Заячий ремиз» (Leskov). Ver LECTURA_RIVAL.',
    } },

  // ── PAR 3 · pl.instr — этими / теми — FRONTERA de тот ──────────────
  { p: P, lema: 'этот', forma: 'pl', caso: 'instr', sust: 'город', par: 'ezdil', eje: 'i-e',
    marco: 'Он часто ездил между ___ ({D}) {N}.', pista: `${G_ESTE} — instrumental plural` },
  { p: P, lema: 'тот', forma: 'pl', caso: 'instr', sust: 'город', par: 'ezdil', eje: 'i-e',
    marco: 'Он часто ездил между ___ ({D}) {N}.', pista: `${G_AQUEL} — instrumental plural`,
    frontera: {
      regla: 'тот-como-этот',
      motivo: 'EL CONTAGIO DEL LEMA HERMANO: quien aprende этот primero —y es el que el alumno ve desde A1, «это книга», эти 5433 frente a те 2480— y declina тот con sus desinencias produce *тими (0 en 7,7 M). El tema de тот cambia a те- justo en las casillas donde этот pone и, y eso no lo predice nada del adjetivo ni de este. El distractor está AL LADO, en el mismo marco: этими, que es la respuesta de la pareja. ⚠ Y NO se declara en los otros tres pares aunque la regla también falle ahí: una frontera por regla (G14); en el par 2 el contagio da тих, que es otra palabra, y en el 1 тим, una ciudad.',
    } },

  // ── PAR 4 · pl.nom — эти / те ─────────────────────────────────────
  // `лежали` concuerda en número (plural) y en nada más: el caso lo da
  // `письма`, que es también genitivo singular — la pista lo desambigua.
  { p: P, lema: 'этот', forma: 'pl', caso: 'nom', sust: 'письмо', par: 'lezhali', eje: 'i-e',
    marco: 'На столе лежали ___ ({D}) {N}.', pista: `${G_ESTE} — nominativo plural` },
  { p: P, lema: 'тот', forma: 'pl', caso: 'nom', sust: 'письмо', par: 'lezhali', eje: 'i-e',
    marco: 'На столе лежали ___ ({D}) {N}.', pista: `${G_AQUEL} — nominativo plural`,
    rivalesNoAceptados: { 'ти': 'NO ES UNA FORMA DE тот: son sílabas cantadas, el sufijo de numeral («25-ти») y un ceceo por «ты». Ver LECTURA_RIVAL.' } },

  // ── PAR 5 · f.ac — la forma CORTA: эту / ту — FRONTERA del adjetivo ─
  // No contrasta и/е (las dos llevan -у): contrasta la forma corta con la
  // larga del adjetivo del prerrequisito (новую). Por eso su eje es otro.
  // ⚠ La v0 decía «Я хорошо помню…» y G16 la paró en la primera corrida:
  // `помню` es la RESPUESTA publicada de un ítem del lote 2 (190205e2).
  // Un marco que entrega la respuesta de otro ejercicio; ahora `знаю`.
  { p: P, lema: 'этот', forma: 'f', caso: 'ac', sust: 'школа', par: 'znayu', eje: 'forma-corta',
    marco: 'Я хорошо знаю ___ ({D}) {N}.', pista: `${G_ESTE} — acusativo femenino singular`,
    frontera: {
      regla: 'el-determinante-como-adjetivo',
      motivo: 'LA REGLA DEL PRERREQUISITO SOBREAPLICADA: el alumno acaba de aprender el adjetivo (u6-adjetivo-declinado, publicado en b6), cuyo acusativo femenino es LARGO —новую, большую, русскую—, y declinar этот como un adjetivo duro da *этую (0 en 7,7 M). El determinante tiene aquí la forma CORTA, nominal (эту, como книгу). El distractor no está al lado sino en el lote anterior, y el gate comprueba que es alcanzable: la misma regla aplicada a los adjetivos duros del lexicón da exactamente sus formas publicadas.',
    } },
  { p: P, lema: 'тот', forma: 'f', caso: 'ac', sust: 'школа', par: 'znayu', eje: 'forma-corta',
    marco: 'Я хорошо знаю ___ ({D}) {N}.', pista: `${G_AQUEL} — acusativo femenino singular`,
    rivalesNoAceptados: { 'тую': 'NO se acepta: 2 apariciones, en el skaz ucranianizado de «Заячий ремиз» (Leskov) y en el documento judicial de cancillería que cita «Дубровский» (Pushkin). Ruso dialectal y arcaico; la norma es ту 1980. Ver LECTURA_RIVAL.' } },
];

// ══════════════════════════════════════════════════════════════════════
// LA RESPUESTA Y LA FRASE, DERIVADAS
// ══════════════════════════════════════════════════════════════════════
const NOM = new Map(NOMBRES_A1.map((n) => [n.lema, n]));
const NUM = (f: FormaAdjetival): NumeroRu => (f === 'pl' ? 'pl' : 'sg');
export function entradaSust(x: ClozeDemRu): EntradaNominal | undefined { return NOM.get(x.sust); }
export function formaDelSustantivo(x: ClozeDemRu): string | null {
  const n = entradaSust(x);
  return n ? casillaNominal(n, x.caso, NUM(x.forma)) : null;
}
export function respuestaDe(x: ClozeDemRu): string | null {
  return DETERMINANTES[x.lema]?.tabla[`${x.forma}.${x.caso}`] ?? null;
}
/** CALCULADAS: hoy vacías (ninguna respuesta lleva ё). */
export function alternativasDe(x: ClozeDemRu): string[] {
  const r = respuestaDe(x);
  return r ? variantesSinYo(r) : [];
}
export function frase(x: ClozeDemRu): string {
  return x.marco.replace('{D}', x.lema).replace('{N}', formaDelSustantivo(x) ?? '{N?}');
}
const CASO_ES: Record<CasoRu, string> = { nom: 'nominativo', ac: 'acusativo', gen: 'genitivo', dat: 'dativo', instr: 'instrumental', prep: 'prepositivo' };
const GEN_ES: Record<Exclude<FormaAdjetival, 'pl'>, string> = { m: 'masculino', f: 'femenino', n: 'neutro' };
export const pistaCanonica = (x: ClozeDemRu) =>
  `${DETERMINANTES[x.lema].glosa} — ${CASO_ES[x.caso]} ${x.forma === 'pl' ? 'plural' : `${GEN_ES[x.forma]} singular`}`;
const GENERO_DE_FORMA: Record<Exclude<FormaAdjetival, 'pl'>, GeneroRu> = { m: 'm', f: 'f', n: 'n' };

// ══════════════════════════════════════════════════════════════════════
// EL SEGUNDO CAMINO: LA DECLINACIÓN PRONOMINAL COMO REGLA, ESCRITA AQUÍ
// ══════════════════════════════════════════════════════════════════════
// No es la tabla copiada (§C4): es tema + vocal + desinencia. Si coincide con
// `DETERMINANTES` en las 44 casillas, las dos cosas —tabla y regla— dicen lo
// mismo por caminos distintos.
export const TEMA_MANUAL: Record<LemaDem, string> = { 'этот': 'эт', 'тот': 'т' };
/** La vocal de la casilla de la `ы`: la ÚNICA diferencia de tabla entre los dos. */
export const VOCAL_MANUAL: Record<LemaDem, string> = { 'этот': 'и', 'тот': 'е' };
export type Manual = (lema: LemaDem, forma: FormaAdjetival, caso: CasoRu) => string | null;
export const reglaDeManual: Manual = (lema, forma, caso) => {
  const t = TEMA_MANUAL[lema], V = VOCAL_MANUAL[lema];
  const tab: Record<FormaAdjetival, Partial<Record<CasoRu, string>>> = {
    m: { nom: lema, gen: t + 'ого', dat: t + 'ому', instr: t + V + 'м', prep: t + 'ом' },
    n: { nom: t + 'о', ac: t + 'о', gen: t + 'ого', dat: t + 'ому', instr: t + V + 'м', prep: t + 'ом' },
    f: { nom: t + 'а', ac: t + 'у', gen: t + 'ой', dat: t + 'ой', instr: t + 'ой', prep: t + 'ой' },
    pl: { nom: t + V, gen: t + V + 'х', dat: t + V + 'м', instr: t + V + 'ми', prep: t + V + 'х' },
  };
  return tab[forma][caso] ?? null;
};
/** ★ EL CONTROL DEL APARATO (§47): TODAS las casillas que la tabla guarda de
 *  los dos lemas, no las cinco del lote. Recibe la regla por PARÁMETRO para
 *  poder verse en rojo sobre una casilla que ningún ítem toca. */
// ⚠ SOBRE UNA REJILLA FIJA, no sobre las claves de la tabla (mutación D6 del
// 2026-09-23): recorriendo las claves, borrar una casilla de DETERMINANTES
// bajaba lo examinado de 44 a 43 y el test —que contaba la misma tabla— seguía
// verde. Es el enumerador que encoge en silencio (§C1). La rejilla es 4 formas
// × 6 casos menos los DOS acusativos que decide la animacidad (m, pl): 22 por
// lema. Una casilla que falte en la tabla o en la regla es discrepancia.
export const REJILLA: [FormaAdjetival, CasoRu][] = (['m', 'f', 'n', 'pl'] as FormaAdjetival[])
  .flatMap((f) => (['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as CasoRu[]).map((c) => [f, c] as [FormaAdjetival, CasoRu]))
  .filter(([f, c]) => !(c === 'ac' && (f === 'm' || f === 'pl')));
export function controlDelAparato(manual: Manual = reglaDeManual): { examinadas: number; discrepancias: string[] } {
  const out: string[] = [];
  let examinadas = 0;
  for (const lema of ['этот', 'тот'] as LemaDem[]) {
    for (const [f, c] of REJILLA) {
      examinadas++;
      const t = DETERMINANTES[lema].tabla[`${f}.${c}`] ?? null, m = manual(lema, f, c);
      if (t === null || m === null || m !== t) out.push(`${lema} ${f}.${c}: la regla da «${m}» y la tabla «${t}»`);
    }
  }
  return { examinadas, discrepancias: out };
}

// ══════════════════════════════════════════════════════════════════════
// EL ADJETIVO DEL PRERREQUISITO, POR LA MÁQUINA: la regla que el alumno TRAE
// ══════════════════════════════════════════════════════════════════════
/** El lema tratado como adjetivo DURO de desinencia átona: эт- → *этый, т- → *тый.
 *  Es la regla del lote 3 aplicada a una palabra que no es adjetivo. Sale de
 *  `casillaAdj`, no de una tabla de aquí: es lo que el prerrequisito ENSEÑÓ. */
export const comoAdjetivo = (lema: LemaDem): EntradaAdjetival =>
  ({ lema: TEMA_MANUAL[lema] + 'ый', tema: 'duro', desinenciaTonica: false, glosa: '—' } as EntradaAdjetival);
/** Qué da la fila dura del adjetivo en una casilla (la desinencia sola). */
export function desinenciaAdjetival(forma: FormaAdjetival, caso: CasoRu): string | null {
  const e = { lema: 'новый', tema: 'duro', desinenciaTonica: false, glosa: 'nuevo' } as EntradaAdjetival;
  const f = casillaAdj(e, forma, caso, { animado: false });
  return f ? f.slice('нов'.length) : null;
}
/** La casilla de la `ы`: donde el adjetivo duro escribe ы. */
export const esCasillaY = (forma: FormaAdjetival, caso: CasoRu) => (desinenciaAdjetival(forma, caso) ?? '').startsWith('ы');
/** La forma corta: el adjetivo tiene desinencia de dos letras y el determinante de una. */
export function esFormaCorta(lema: LemaDem, forma: FormaAdjetival, caso: CasoRu): boolean {
  const d = desinenciaAdjetival(forma, caso), r = DETERMINANTES[lema].tabla[`${forma}.${caso}`];
  return !!d && !!r && d.length >= 2 && r.length - TEMA_MANUAL[lema].length === 1;
}
/** Los EJES, como PARTICIÓN (mutación D8): pl.nom (эти/те) es a la vez casilla
 *  de la ы y forma corta, y la v0 dejaba etiquetarlo con cualquiera de los dos.
 *  Donde se cruzan manda la vocal, que es lo que el par contrasta. */
export function ejeDe(lema: LemaDem, forma: FormaAdjetival, caso: CasoRu): EjeDem | null {
  if (esCasillaY(forma, caso)) return 'i-e';
  if (esFormaCorta(lema, forma, caso)) return 'forma-corta';
  return null;
}
/** Las casillas FUERA por decisión, con su motivo (mutación D3: vivían sólo en
 *  la cabecera, y f.nom / n.nom / n.ac pasaban G12 y sólo las paraba G11 por
 *  accidente, porque тая/этая/тое están atestadas). */
export function casillaExcluida(forma: FormaAdjetival, caso: CasoRu): string | null {
  if (caso === 'ac' && (forma === 'm' || forma === 'pl')) return 'el acusativo m/pl depende de la animacidad (u5-animacidad-acusativo, no es prerrequisito)';
  if (caso === 'nom' && forma !== 'pl') return 'el nominativo singular es vocabulario de A1 (этот/эта/это) y это/то son los dos homógrafos más grandes del corpus';
  if (forma === 'n' && caso === 'ac') return 'n.ac es это/то otra vez: el homógrafo del demostrativo-sujeto y de la conjunción';
  if (forma === 'f' && caso === 'instr') return 'el instrumental femenino tiene la variante del XIX этою/тою y este lote no la calcula (§46.2)';
  return null;
}
/** El RÉGIMEN del marco (mutación D7): la palabra de delante del hueco y las
 *  casillas que admite. Declarado, no derivado; una palabra fuera de la tabla
 *  es rojo. «ездил от этими городами» o «лежало эти письма» pasaban. */
export const REGIMEN: Record<string, string[]> = {
  'с': ['instr', 'gen'], 'от': ['gen'], 'между': ['instr'],
  'лежали': ['nom.pl'],   // pasado PLURAL: concuerda con un sujeto plural
  'знаю': ['ac'],
};
export const regente = (s: string) => { const t = (s.split('___')[0] ?? '').split(/[^\p{L}]+/u).filter(Boolean); return (t[t.length - 1] ?? '').toLowerCase(); };
/** G3b como FUNCIÓN, con límites unicode (mutación D5: `\bи\b` no casa nunca
 *  con la и cirílica — §A7 —, y además la pista canónica lo tapaba). */
export const pistaNombraLoExaminado = (p: string) =>
  /(tema|vocal|corta|larga|pronominal|adjetiv|desinencia|termina|irregul)/i.test(p) || /(?<!\p{L})[ыи](?!\p{L})/u.test(p);

export const SOBREAPLICADA: Record<ReglaSobreaplicadaDem, (x: ClozeDemRu) => string | null> = {
  'el-determinante-como-adjetivo': (x) => casillaAdj(comoAdjetivo(x.lema), x.forma, x.caso, { animado: false }),
  'тот-como-этот': (x) => {
    if (x.lema !== 'тот') return respuestaDe(x);
    const e = DETERMINANTES['этот'].tabla[`${x.forma}.${x.caso}`];
    return e ? 'т' + e.slice('эт'.length) : null;
  },
};

// ══════════════════════════════════════════════════════════════════════
// LOS GATES
// ══════════════════════════════════════════════════════════════════════
const sinParentesis = (s: string) => s.replace(/\([^)]*\)/g, ' ');
const PALABRA = (w: string) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu');
const palabras = (s: string) => sinParentesis(s).replace('___', ' ').split(/[^\p{L}]+/u).filter(Boolean);

export function verificar(items: ClozeDemRu[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const resps = new Map<string, number>();
  for (const [i, x] of items.entries()) {
    const id = `CLRUA2C-${String(i + 1).padStart(3, '0')} (${x.lema} ${x.forma}.${x.caso})`;
    if (x.p !== P) v.push(`${id}: el punto es «${x.p}» y este lote es de ${P}`);
    // G0 · las casillas FUERA por decisión, ANTES de nada (mutación D4: el gate
    //      de animacidad vivía detrás del `continue` de la tabla y no podía
    //      dispararse por la razón que nombraba).
    const excl = casillaExcluida(x.forma, x.caso);
    if (excl) { v.push(`${id}: casilla fuera — ${excl}`); continue; }
    const r = respuestaDe(x), n = entradaSust(x), fn = formaDelSustantivo(x);
    if (!r) { v.push(`${id}: DETERMINANTES no tiene la casilla ${x.forma}.${x.caso}`); continue; }
    if (!n || !fn) { v.push(`${id}: el sustantivo «${x.sust}» no está en NOMBRES_A1 o no tiene ${x.caso}.${NUM(x.forma)}`); continue; }
    const s = frase(x), alt = alternativasDe(x);
    // G1 · un hueco, un {D}, un {N}. G2 · el lema detrás del hueco y el sustantivo detrás del lema.
    for (const [marca, k] of [['___', x.marco.split('___').length - 1], ['{D}', x.marco.split('{D}').length - 1], ['{N}', x.marco.split('{N}').length - 1]] as const)
      if (k !== 1) v.push(`${id}: ${k} «${marca}» en el marco, tiene que haber 1`);
    if (!/___\s*\(\{D\}\)\s*\{N\}/.test(x.marco)) v.push(`${id}: el marco no es «___ ({D}) {N}»: el sustantivo tiene que ir pegado detrás del lema`);
    // G3 · la pista canónica, y sin nombrar lo examinado.
    if (x.pista !== pistaCanonica(x)) v.push(`${id}: la pista «${x.pista}» no es la canónica «${pistaCanonica(x)}»`);
    if (pistaNombraLoExaminado(x.pista)) v.push(`${id}: la pista nombra la vocal, la forma corta o la clase, que es lo examinado`);
    // G4 · el sustantivo CONCUERDA con la casilla pedida: género (en singular) y
    //       la forma derivada. Un sustantivo de otro género daría la casilla en ruso
    //       y la contradiría en la pista.
    if (x.forma !== 'pl' && n.genero !== GENERO_DE_FORMA[x.forma]) v.push(`${id}: «${x.sust}» es ${n.genero} y la casilla es ${x.forma}`);
    // G4b · el régimen del marco admite la casilla.
    const reg = regente(s), adm = REGIMEN[reg];
    if (!adm) v.push(`${id}: «${reg}» delante del hueco no está en REGIMEN — el gate no aprueba lo que no sabe leer`);
    else if (!adm.includes(x.caso) && !adm.includes(`${x.caso}.${NUM(x.forma)}`)) v.push(`${id}: «${reg}» admite ${adm.join('/')} y la casilla es ${x.caso}.${NUM(x.forma)}`);
    // G5/G6 · ni la pista ni la frase deletrean la respuesta. G7 · no es el lema.
    for (const c of [r, ...alt]) if (PALABRA(quitarAcento(c)).test(x.pista)) v.push(`${id}: la pista deletrea «${c}»`);
    if (palabras(s).some((w) => w.toLowerCase() === quitarAcento(r).toLowerCase())) v.push(`${id}: la respuesta «${r}» ya está en la frase`);
    if (quitarAcento(r) === x.lema) v.push(`${id}: la respuesta coincide con el lema`);
    // G8 · la ё, en las dos direcciones.
    if (r.includes('ё') && alt.length === 0) v.push(`${id}: «${r}» lleva ё y no declara la variante sin ё`);
    for (const c of candidatasConYo(r)) v.push(`${id}: «${r}» tiene variante con ё atestada («${c.forma}» ${c.n})`);
    // G9 · ortografía y homóglifos en todo lo que el alumno ve.
    for (const [campo, t] of [['frase', s], ['pista', x.pista], ['respuesta', r]] as const)
      for (const h of revisarOrtografiaRu(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // G10 · la respuesta, atestada. G10b · el instrumental femenino, fuera por nombre (этою/тою).
    if (buscar(r).n === 0) v.push(`${id}: «${r}» no aparece en 7,7 M de palabras`);
    // G11 · EL RIVAL ATESTADO LLEVA LECTURA Y DECISIÓN, las dos.
    for (const riv of rivalesDe(x)) {
      const k = buscar(riv).n;
      if (k === 0) continue;
      if (!LECTURA_RIVAL[riv]) v.push(`${id}: el rival «${riv}» sale ${k} veces y LECTURA_RIVAL no dice qué es`);
      if (!x.rivalesNoAceptados?.[riv]) v.push(`${id}: el rival «${riv}» sale ${k} veces y el ítem no escribe su decisión en rivalesNoAceptados`);
    }
    // G11b · la decisión DECIDE (empieza por «NO»: este lote no acepta ningún
    //        rival) y no hay decisiones sobre rivales que el lote ya no genera
    //        (mutación D9: «sí» pasaba, y una clave obsoleta también).
    const vivos = new Set(rivalesDe(x));
    for (const [riv, dec] of Object.entries(x.rivalesNoAceptados ?? {})) {
      if (!/^NO\b/.test(dec)) v.push(`${id}: la decisión sobre «${riv}» no empieza por «NO» — no decide`);
      if (!vivos.has(riv)) v.push(`${id}: decisión sobre «${riv}», que rivalesDe ya no genera (clave obsoleta)`);
      if (!LECTURA_RIVAL[riv]) v.push(`${id}: decisión sobre «${riv}» sin su LECTURA_RIVAL`);
    }
    const clave = s.replace(/\s+/g, ' ').trim().toLowerCase();
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
    resps.set(r, (resps.get(r) ?? 0) + 1);
  }
  for (const [r, k] of resps) if (k > 1) v.push(`la respuesta «${r}» sale ${k} veces (§D5: la misma cadena en dos casillas mide una)`);

  // G12 · LOS PARES: marco, sustantivo y casilla constantes; un этот y un тот;
  //       y el EJE se RECALCULA contra la máquina del adjetivo.
  const pares = new Map<string, ClozeDemRu[]>();
  for (const x of items) pares.set(x.par, [...(pares.get(x.par) ?? []), x]);
  const casillasDePar = new Set<string>();
  for (const [k, xs] of pares) {
    if (xs.length !== 2) { v.push(`par «${k}»: ${xs.length} ítems — un par de marco son DOS`); continue; }
    const [a, b] = xs as [ClozeDemRu, ClozeDemRu];
    if (a.marco !== b.marco || a.sust !== b.sust) v.push(`par «${k}»: el marco o el sustantivo no son idénticos`);
    if (a.forma !== b.forma || a.caso !== b.caso) v.push(`par «${k}»: casillas distintas (${a.forma}.${a.caso} / ${b.forma}.${b.caso}) — dentro del par sólo cambia el lema`);
    if (a.eje !== b.eje) v.push(`par «${k}»: ejes distintos`);
    if (new Set([a.lema, b.lema]).size !== 2) v.push(`par «${k}»: los dos ítems son de «${a.lema}» — el par es этот contra тот`);
    const cas = `${a.forma}.${a.caso}`;
    if (casillasDePar.has(cas)) v.push(`par «${k}»: la casilla ${cas} ya la usa otro par (§D5)`);
    casillasDePar.add(cas);
    const ra = respuestaDe(a), rb = respuestaDe(b);
    if (!ra || !rb) continue;
    if (ejeDe(a.lema, a.forma, a.caso) !== a.eje) v.push(`par «${k}»: declara «${a.eje}» y la casilla ${cas} es «${ejeDe(a.lema, a.forma, a.caso)}»`);
    if (a.eje === 'i-e') {
      if (!esCasillaY(a.forma, a.caso)) v.push(`par «${k}»: eje «i-e» y en ${cas} el adjetivo no escribe ы (da «${desinenciaAdjetival(a.forma, a.caso)}») — ahí no hay nada que el adjetivo no dé`);
      const vocal = (x: ClozeDemRu, r: string) => r.slice(TEMA_MANUAL[x.lema].length, TEMA_MANUAL[x.lema].length + 1);
      if (vocal(a, ra) === vocal(b, rb)) v.push(`par «${k}»: eje «i-e» y las dos respuestas llevan la misma vocal`);
    } else if (a.eje === 'forma-corta') {
      if (!esFormaCorta(a.lema, a.forma, a.caso) || !esFormaCorta(b.lema, b.forma, b.caso)) v.push(`par «${k}»: eje «forma-corta» y en ${cas} el determinante no es corto frente a un adjetivo largo`);
    }
  }
  // G13 · VARIANZA: la vocal и/е, ninguna por encima de 1/k (k = 2); ≥ 2 ejes.
  const vocales = items.filter((x) => x.eje === 'i-e').map((x) => (respuestaDe(x) ?? '').slice(TEMA_MANUAL[x.lema].length, TEMA_MANUAL[x.lema].length + 1));
  for (const vv of ['и', 'е']) if (vocales.filter((z) => z === vv).length > vocales.length / 2) v.push(`la vocal «${vv}» ocupa más de la mitad de los ítems i-e`);
  if (new Set(items.map((x) => x.eje)).size < 2) v.push('un solo eje: el lote mediría una mitad del punto');

  // G14 · LAS FRONTERAS: la regla se EJECUTA, falla en la frontera y el
  //       distractor es ALCANZABLE; una por regla.
  const reglas = new Set<string>();
  for (const x of items.filter((y) => y.frontera)) {
    const f = x.frontera!, r = respuestaDe(x), sob = SOBREAPLICADA[f.regla](x);
    if (reglas.has(f.regla)) v.push(`${x.lema} ${x.forma}.${x.caso}: dos fronteras sobreaplican «${f.regla}»`);
    reglas.add(f.regla);
    if (f.motivo.length < 120) v.push(`${x.lema}: el motivo de la frontera es demasiado corto`);
    if (!sob || sob === r) v.push(`${x.lema} ${x.forma}.${x.caso}: declara «${f.regla}» y esa regla ACIERTA «${r}» — no es una sobreaplicación`);
    // G14b · el distractor es un ERROR limpio y el motivo habla de ÉL (mutación
    //        D2: la frontera se podía mover a тим —una ciudad— o a тую —atestada—,
    //        y la del adjetivo a этим con un motivo que hablaba de *этую).
    if (sob && buscar(sob).n > 0) v.push(`${x.lema} ${x.forma}.${x.caso}: el distractor «${sob}» está atestado (${buscar(sob).n}) — una frontera tiene que inducir un error limpio`);
    if (sob && !f.motivo.includes(`*${sob}`)) v.push(`${x.lema} ${x.forma}.${x.caso}: el motivo de la frontera no nombra su distractor «*${sob}»`);
    const pj = items.find((y) => y !== x && y.par === x.par);
    if (f.regla === 'тот-como-этот') {
      if (x.lema !== 'тот') v.push(`${x.lema}: «тот-como-этот» sólo puede ser frontera de тот`);
      // Alcanzable = la pareja de par es el этот cuya desinencia se contagia.
      if (!pj || SOBREAPLICADA[f.regla](pj) !== respuestaDe(pj)) v.push(`${x.lema}: la pareja de par no es el этот que presta la desinencia — el distractor no está al lado`);
    } else {
      // Alcanzable = el alumno HA VISTO esa desinencia en el adjetivo: la del
      // distractor, pegada a los adjetivos duros del lexicón, sale en la
      // BIBLIOTECA. ⚠ La v0 comparaba `casillaAdj(новый)` con
      // `casillaAdj(comoAdjetivo)`: la misma función con la misma clase, que no
      // puede discrepar (mutación D1, §B6). El corpus es de otra naturaleza. Y
      // no se lee de los ítems publicados porque el lote 3 NO tiene
      // acusativos: la forma larga del f.ac no la ha drillado ningún ítem, sólo
      // la lección y la lectura — y eso se dice en vez de fingir lo contrario.
      const des = (sob ?? '').slice(TEMA_MANUAL[x.lema].length);
      const vistas = ADJETIVOS_A1.filter((a) => a.tema === 'duro').map((a) => temaAdj(a) + des).filter((w) => buscar(w).n > 0);
      if (vistas.length === 0) v.push(`${x.lema}: la desinencia «-${des}» del distractor no sale en la biblioteca pegada a ningún adjetivo duro del lexicón — el alumno no la ha visto`);
    }
  }
  if (reglas.size === 0) v.push('el lote no declara ninguna frontera (§0.6)');
  // G15 · ninguna palabra de un marco es respuesta de otro ítem.
  const resp = new Map<string, string>();
  for (const x of items) { const r = respuestaDe(x); if (r) resp.set(r.toLowerCase(), `${x.lema} ${x.forma}.${x.caso}`); }
  for (const x of items)
    for (const w of palabras(frase(x))) {
      const d = resp.get(quitarAcento(w).toLowerCase());
      if (d) v.push(`${x.lema} ${x.forma}.${x.caso}: el marco contiene «${w}», que es la RESPUESTA del ítem ${d}`);
    }
  return v;
}

// G16 · LA FUGA CONTRA LO YA PUBLICADO, con exclusión POR IDENTIDAD (§51).
export function fugaContraLoPublicado(items: ClozeDemRu[], dir: string): string[] {
  if (!fs.existsSync(dir)) return [`G16: no existe «${dir}» — el gate no ha mirado nada`];
  const out: string[] = [];
  const propias = new Set(items.map((x) => frase(x).replace(/\s+/g, ' ').trim().toLowerCase()));
  const pub = new Map<string, string>();
  let n = 0;
  for (const f of fs.readdirSync(dir).filter((z: string) => /^b\d+\.json$/.test(z)))
    for (const ex of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Array<Record<string, any>>) {
      if (propias.has(String(ex?.data?.sentence ?? '').replace(/\s+/g, ' ').trim().toLowerCase())) continue;
      n++;
      for (const b of (ex?.data?.blanks ?? []) as Array<{ answer?: string; alternatives?: string[] }>)
        for (const c of [b.answer, ...(b.alternatives ?? [])]) if (typeof c === 'string') pub.set(quitarAcento(c).toLowerCase(), String(ex.id));
    }
  if (n === 0) return ['G16: 0 ejercicios publicados leídos — un cero aquí es «no he mirado» (§A2)'];
  for (const x of items) {
    const r = respuestaDe(x);
    if (r && pub.has(r.toLowerCase())) out.push(`${x.lema} ${x.forma}.${x.caso}: la respuesta «${r}» ya está publicada en ${pub.get(r.toLowerCase())}`);
    for (const w of palabras(frase(x))) {
      const id = pub.get(quitarAcento(w).toLowerCase());
      if (id) out.push(`${x.lema} ${x.forma}.${x.caso}: el marco contiene «${w}», respuesta del ejercicio publicado ${id}`);
    }
  }
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// LOS RIVALES, CON LAS CINCO SALIDAS (§9.1 + HOMÓGRAFO del §59)
// ══════════════════════════════════════════════════════════════════════
/** Los errores que el lote induce: el adjetivo (para los diez) y el contagio
 *  del hermano (этот ↔ тот) en las casillas donde difieren. */
export function rivalesDe(x: ClozeDemRu): string[] {
  const r = respuestaDe(x);
  if (!r) return [];
  const otro: LemaDem = x.lema === 'этот' ? 'тот' : 'этот';
  const ro = DETERMINANTES[otro].tabla[`${x.forma}.${x.caso}`];
  const contagio = ro ? TEMA_MANUAL[x.lema] + ro.slice(TEMA_MANUAL[otro].length) : null;
  const out = new Set<string>([SOBREAPLICADA['el-determinante-como-adjetivo'](x) ?? '', contagio ?? '']);
  out.delete(''); out.delete(r); out.delete(x.lema);
  return [...out];
}
/** El rival PRINCIPAL: la regla de la frontera si es frontera; si no, el
 *  contagio del hermano en los pares i-e y el adjetivo en el par corto. */
export function rivalDe(x: ClozeDemRu): string | null {
  if (x.frontera) return SOBREAPLICADA[x.frontera.regla](x);
  const rs = rivalesDe(x);
  if (x.eje === 'forma-corta') return SOBREAPLICADA['el-determinante-como-adjetivo'](x);
  return rs.find((z) => z !== SOBREAPLICADA['el-determinante-como-adjetivo'](x)) ?? rs[0] ?? null;
}
/** Las LECTURAS, con la fuente leída por `scripts/cita-ru.ts` (ver CITAS). */
export const LECTURA_RIVAL: Record<string, string> = {
  'тих': 'HOMÓGRAFO DE OTRO LEMA en 46 de 47: la forma corta de тихий «tranquilo» («Лес, окутанный утренним светом, был тих и неподвижен», Chéjov, «Драма на охоте», cap. 5). ⚠ Y UNA es UCRANIANO тих = тех, justo la forma que la frontera тот-como-этот produce, en habla de personaje («тих я до себе затягти не можу», Leskov, «Печерские антики»). La v0 decía «las 47»: leídas sólo las 12 que imprime `--ctx`, lo cazó el lingüista leyendo las 47 (§A3: la lectura que confirma también se rehace).',
  'ти': 'NINGUNA ES FORMA DE тот, pero no todas son ruido (la v0 decía «cosas que no son palabras rusas»: media verdad, lingüista 2026-09-23): 91 son el sufijo de numeral escrito con cifra («лет 25-ти», «10-ти верст», Tolstói), unas 50 sílabas cantadas o silabeadas («то-то-ти-то-том», «хо-ти-те»), ~10 el DATIVO eslavo eclesiástico ти = тебе, que sí es palabra («слава ти, Господи», Tolstói, «Севастополь в августе 1855 года»), 2 ucraniano ти = ты, y el acento extranjero —francés, no un ceceo— de «Ти ни о чем не дюмаешь?» (Leskov, «Шерамур»).',
  'тим': 'HOMÓGRAFO: cinco son la ciudad de Тим («нелегкая занесла в г. Тим», Chéjov, «Самый большой город») y una es UCRANIANO, «тим» = «por eso», en el habla de un personaje de Leskov («Человек на часах»). Ninguna es el instrumental de тот.',
  'тых': 'ES LA FORMA QUE EL ERROR PRODUCE, en habla de personaje: las 2 son del narrador de «Заячий ремиз» (Leskov), cuyo ruso está cruzado de ucraniano a propósito («до тых римских язычников», «як у тых»). Caracterización, no norma: тех 2577.',
  'тую': 'ARCAICA Y DIALECTAL: el mismo narrador ucranianizado de «Заячий ремиз» («взял у Вековечкина тую тетрадь») y el fallo judicial en lengua de cancillería que cita «Дубровский» (Pushkin, cap. 1: «отдавать тую землю»). Frente a ту 1980.',
};
/** Las citas de este lote, como DATO, para que el test las pase por `verificarCita`. */
export const CITAS: CitaDeclarada[] = [
  { cita: 'был тих и неподвижен', autor: 'Чехов', obra: 'Драма на охоте' },
  { cita: 'тих я до себе затягти не можу', autor: 'Лесков', obra: 'Печерские антики' },
  { cita: 'слава ти, Господи', autor: 'Толстой', obra: 'Севастополь в августе 1855 года' },
  { cita: 'Ти ни о чем не дюмаешь', autor: 'Лесков', obra: 'Шерамур' },
  { cita: 'нелегкая занесла в г. Тим', autor: 'Чехов', obra: 'Самый большой город' },
  { cita: 'то тим вона теперечки моя', autor: 'Лесков', obra: 'Человек на часах' },
  { cita: 'до тых римских язычников', autor: 'Лесков', obra: 'Заячий ремиз' },
  { cita: 'взял у Вековечкина тую тетрадь', autor: 'Лесков', obra: 'Заячий ремиз' },
  { cita: 'правому отдавать тую землю', autor: 'Пушкин', obra: 'Дубровский' },
];
export type Veredicto = 'EVIDENCIA' | 'NULO VACÍO' | 'TAREA DE LECTURA' | 'HOMÓGRAFO' | 'ROJO';
export function veredictoRival(x: ClozeDemRu): { rival: string; nR: number; nB: number; veredicto: Veredicto } | null {
  const rival = rivalDe(x), r = respuestaDe(x);
  if (!rival || !r) return null;
  const nR = buscar(rival).n, nB = buscar(r).n;
  let veredicto: Veredicto;
  if (rival === r || rival === x.lema) veredicto = 'HOMÓGRAFO';
  else if (revisarOrtografiaRu(rival).length) veredicto = 'EVIDENCIA';
  else if (nR === 0 && nB > 0) veredicto = 'EVIDENCIA';
  else if (nR === 0) veredicto = 'NULO VACÍO';
  else if (!LECTURA_RIVAL[rival]) veredicto = 'ROJO';
  else veredicto = 'TAREA DE LECTURA';
  return { rival, nR, nB, veredicto };
}

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS
// ══════════════════════════════════════════════════════════════════════
// ★ EL TEOREMA DEL DISEÑO PAREADO (§48), enunciado sobre la CADENA: dentro de
// un par son constantes el marco, el sustantivo y la casilla (G12), y las dos
// respuestas son cadenas distintas. Una ruta que no lea el LEMA ni la GLOSA
// devuelve la misma cadena en los dos ítems y acierta como mucho uno: 5 de 10
// = el tope, nunca por encima. Las cifras que informan son las de las rutas
// que SÍ leen el lema.
export interface Vista { s: string; pista: string; lema: LemaDem; forma: FormaAdjetival; caso: CasoRu; sust: string }
export function vista(x: ClozeDemRu): Vista { return { s: frase(x), pista: x.pista, lema: x.lema, forma: x.forma, caso: x.caso, sust: formaDelSustantivo(x) ?? '' }; }
export interface Ruta { nombre: string; porQue: string; predicho: number; aplicablesPredicho: number; correr: (v: Vista) => string | null }
const conVocal = (v: Vista, V: string) => {
  const r = reglaDeManual(v.lema, v.forma, v.caso);
  if (!r || !esCasillaY(v.forma, v.caso)) return r;
  const t = TEMA_MANUAL[v.lema];
  return t + V + r.slice(t.length + 1);
};

export const ESTRATEGIAS: Ruta[] = [
  { nombre: 'copiar-el-lema', predicho: 0, aplicablesPredicho: 10,
    porQue: 'La cadena que el estímulo entrega. Ninguna respuesta es el lema (G7); `aplicables` 10 es el control de que la ruta corre.',
    correr: (v) => v.lema },
  { nombre: 'el-determinante-como-adjetivo · LA REGLA QUE TRAE', predicho: 0, aplicablesPredicho: 10,
    porQue: '★ LO QUE EL ALUMNO LLEVA DEL PRERREQUISITO: этот y тот declinados como un adjetivo duro (*этым, *этых, *этыми, *этые, *этую; *тым…). Por construcción del lote falla los diez: el lote vive sólo en las casillas donde el adjetivo NO da la forma. Si acertara uno, un ítem estaría en una casilla gratis.',
    correr: (v) => casillaAdj(comoAdjetivo(v.lema), v.forma, v.caso, { animado: false }) },
  { nombre: 'rima-con-el-sustantivo', predicho: 2, aplicablesPredicho: 10,
    porQue: 'Pegar al tema del lema la terminación del sustantivo de al lado (человек-ом → *этом, друз-ей → *этей, город-ами → *этами, письм-а → *эта, школ-у → эту). Predicho: sólo el par 5, las dos (эту, ту), porque la forma corta del acusativo femenino ES la desinencia nominal. Lee el lema, así que el teorema no la acota: por eso se mide.',
    correr: (v) => {
      const d = (v.sust.match(/(ами|ями|ом|ем|ей|ов|а|я|у|ю|ы|и)$/) ?? [''])[0];
      return TEMA_MANUAL[v.lema] + d;
    } },
];

export const PERFILES: Ruta[] = [
  { nombre: 'тот-como-этот', predicho: 6, aplicablesPredicho: 10,
    porQue: 'Sabe этот entero y declina тот con sus desinencias: acierta los cinco этот y ту; falla тем, тех, теми, те (→ *тим, *тих, *тими, *ти).',
    correr: (v) => (v.lema === 'этот' ? reglaDeManual(v.lema, v.forma, v.caso) : conVocal(v, 'и')) },
  { nombre: 'этот-como-тот', predicho: 6, aplicablesPredicho: 10,
    porQue: 'Su simétrico (menos probable: этот es el que se aprende primero). Acierta los cinco тот y эту.',
    correr: (v) => (v.lema === 'тот' ? reglaDeManual(v.lema, v.forma, v.caso) : conVocal(v, 'е')) },
  { nombre: 'la-vocal-bien-y-la-forma-larga', predicho: 6, aplicablesPredicho: 10,
    porQue: 'Sabe и/е en la casilla de la ы pero pone la desinencia LARGA del adjetivo en nominativo y acusativo: -ые con su vocal (*этие, *тее) y -ую (*этую, *тую). Acierta los pares 1-3 (6) y falla los pares 4 y 5.',
    correr: (v) => {
      const adj = desinenciaAdjetival(v.forma, v.caso) ?? '';
      if (v.forma === 'pl' && v.caso === 'nom' || v.forma === 'f' && v.caso === 'ac')
        return TEMA_MANUAL[v.lema] + (adj.startsWith('ы') ? VOCAL_MANUAL[v.lema] + adj.slice(1) : adj);
      return reglaDeManual(v.lema, v.forma, v.caso);
    } },
  { nombre: 'copiar-la-respuesta-de-этот', predicho: 5, aplicablesPredicho: 10,
    porQue: 'La forma más simple del contagio (discutible 6 del lingüista): la forma de этот en la casilla, sin mirar el lema. No lee el lema, así que el teorema la acota a 5, y acierta exactamente los cinco этот.',
    correr: (v) => DETERMINANTES['этот'].tabla[`${v.forma}.${v.caso}`] ?? null },
  { nombre: 'el-paradigma-entero · CONTROL DEL APARATO', predicho: 10, aplicablesPredicho: 10,
    porQue: '⚠ NO ES UNA RUTA DEL ALUMNO. Tiene que dar 10/10, y su 10/10 NO autoriza a leer la tabla: lo autoriza `controlDelAparato()` sobre las casillas enteras de los dos lemas (§47).',
    correr: (v) => reglaDeManual(v.lema, v.forma, v.caso) },
];

// ★ LA RUTA POR LECTURA: la forma del lema más frecuente JUSTO DELANTE del
// sustantivo declinado. El sustantivo determina la casilla (§52.2), así que
// cuando el bigrama existe debería acertar — pero la cadena del sustantivo
// puede ser OTRA casilla (письма es también genitivo singular), y ahí el
// bigrama devuelve el determinante de esa otra.
const formasDe = (lema: LemaDem) => [...new Set(Object.values(DETERMINANTES[lema].tabla))];
const lecturaDelante = (lema: LemaDem, sust: string): string | null => {
  let mejor: string | null = null, max = 0;
  for (const f of formasDe(lema)) {
    const n = buscar(`${f} ${sust}`).n;
    if (n > max) { max = n; mejor = f; }
  }
  return mejor;
};
export const RUTAS_POR_LECTURA: Ruta[] = [
  { nombre: 'memoria-colocacional-por-el-sustantivo', predicho: 5, aplicablesPredicho: 8,
    porQue: 'Predicho ANTES de medir: aciertan этим/тем человеком, этих/тех друзей y эти письма (5); с `теми/этими городами` no hay bigrama (null ×2), `ту школу` tampoco (null); y тот delante de письма devuelve того (genitivo singular de la misma cadena), un fallo aplicable. Denominador 7.',
    // ⚠ OBSERVADO 5 de 8, y el 5 coincide POR ACCIDENTE: los aciertos no son
    // los predichos. Leído lo que devuelve (§52.1), ítem a ítem: acierta
    // этим/тем человеком, этих/тех друзей y ЭТУ школу (5 · 6 · que la
    // predicción olvidó: эту школу sale 5); falla эти письма, porque `этого
    // письма` gana — письма es TAMBIÉN el genitivo singular, y el bigrama
    // devuelve la otra casilla de la misma cadena; y devuelve `то` delante de
    // письма y de школу: ⚠ la v0 de este comentario decía «la CONJUNCIÓN de
    // если…, то», y leídas son la PARTÍCULA -то separada del guion por el
    // límite de palabra («какие-то письма» 3 de 4, «какую-то школу» 2 de 2;
    // lingüista 2026-09-23) — no el determinante en ningún caso (§F3: cuenta
    // cadenas cuando la pregunta es un análisis). O sea: dos de
    // los tres fallos son del APARATO (un lector no toma la conjunción por el
    // determinante) y uno es de la LENGUA (la cadena del sustantivo es dos
    // casillas). El denominador predicho (7, en la v0) es el que lo delató; el
    // numerador, solo, habría salido verde (§G5). Se deja 8 escrito: un ⚠ que
    // sale en cada corrida es un gate apagado (discutible 5 del lingüista).
    correr: (v) => lecturaDelante(v.lema, v.sust) },
];

// ══════════════════════════════════════════════════════════════════════
// EL CONTROL POSITIVO: LAS FORMAS QUE EL LOTE NO DEBE PRODUCIR
// ══════════════════════════════════════════════════════════════════════
// Sólo formas que no son palabra de ningún lema: тих, ти, тим, тых y тую NO
// están, por la razón escrita en LECTURA_RIVAL (el `*лесы` del §35).
export const FALSAS_DEL_LOTE: { mala: string; buena: string; porQue: string }[] = [
  { mala: 'этым', buena: 'этим', porQue: 'el adjetivo duro en la casilla de la ы' },
  { mala: 'тым', buena: 'тем', porQue: 'ídem sobre тот' },
  { mala: 'этых', buena: 'этих', porQue: 'ídem, genitivo plural' },
  { mala: 'этыми', buena: 'этими', porQue: 'ídem, instrumental plural' },
  { mala: 'тыми', buena: 'теми', porQue: 'ídem sobre тот' },
  { mala: 'этые', buena: 'эти', porQue: 'la forma larga del nominativo plural' },
  { mala: 'этую', buena: 'эту', porQue: 'el error diana de la frontera del adjetivo' },
  { mala: 'тими', buena: 'теми', porQue: 'el error diana de la frontera тот-como-этот' },
  { mala: 'этеми', buena: 'этими', porQue: 'su simétrica' },
];
export function veredictoFalsa(mala: string, buena: string): { rechaza: boolean; via: string; detalle: string } {
  const orto = revisarOrtografiaRu(mala);
  if (orto.length) return { rechaza: true, via: 'ortografia', detalle: `${orto[0]!.clase} en «${orto[0]!.palabra}»` };
  const nm = buscar(mala).n, nb = buscar(buena).n;
  if (nm < nb) return { rechaza: true, via: 'corpus', detalle: `«${mala}» ${nm} < «${buena}» ${nb}` };
  return { rechaza: false, via: '—', detalle: `«${mala}» ${nm} ≥ «${buena}» ${nb}` };
}

export interface Informe { nombre: string; aciertos: number; n: number; aplicables: number; predicho: number; aplicablesPredicho: number; cuales: number[]; devuelve: (string | null)[] }
/** Acierta si y sólo si la TARJETA la daría por buena. */
export function correr(items: ClozeDemRu[], rutas: Ruta[]): Informe[] {
  return rutas.map((es) => {
    let aplicables = 0;
    const cuales: number[] = [];
    const devuelve: (string | null)[] = [];
    for (const [i, x] of items.entries()) {
      const s = es.correr(vista(x));
      devuelve.push(s);
      if (s === null) continue;
      aplicables++;
      const buenas = [respuestaDe(x), ...alternativasDe(x)].filter(Boolean).map((y) => quitarAcento(y!).toLowerCase());
      if (buenas.includes(quitarAcento(s).toLowerCase())) cuales.push(i + 1);
    }
    return { nombre: es.nombre, aciertos: cuales.length, n: items.length, aplicables, predicho: es.predicho, aplicablesPredicho: es.aplicablesPredicho, cuales, devuelve };
  });
}

if (/[/\\]cloze-ru-a2c\.ts$/.test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  v.push(...fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, s: frase(x), answer: respuestaDe(x), alt: alternativasDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Cloze derivado RU-A2C — ${ITEMS.length} ítems de ${P}\n`);
  console.log('| # | lema | casilla | respuesta | adjetivo daría | sustantivo | resp+sust | rival | veredicto | par · eje |');
  console.log('|--:|---|---|---|---|---|--:|---|---|---|');
  for (const [i, x] of ITEMS.entries()) {
    const r = respuestaDe(x)!, vr = veredictoRival(x);
    console.log(`| ${i + 1} | ${x.lema} | ${x.forma}.${x.caso} | **${r}** | ${SOBREAPLICADA['el-determinante-como-adjetivo'](x)} | ${formaDelSustantivo(x)} | ${buscar(`${r} ${formaDelSustantivo(x)}`).n} | ${vr ? `${vr.rival} ${vr.nR}/${vr.nB}` : '—'} | ${vr?.veredicto ?? '—'} | ${x.par} · ${x.eje}${x.frontera ? ` · FRONTERA ${x.frontera.regla}` : ''} |`);
  }
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${frase(x)}  → **${respuestaDe(x)}**  · ${x.pista}`);
  const tablaRutas = (titulo: string, rutas: Ruta[], tope: boolean) => {
    console.log(`\n## ${titulo}\n`);
    console.log('| ruta | predicho | observado | % | aplicables (pred.) | ítems que acierta | devuelve |');
    console.log('|---|--:|--:|--:|--:|---|---|');
    for (const r of correr(ITEMS, rutas)) {
      const mal = r.aciertos !== r.predicho ? ' ⚠ NO COINCIDE' : '';
      const malA = r.aplicables !== r.aplicablesPredicho ? ' ⚠' : '';
      const sobre = tope && r.aciertos / r.n > 0.5 ? ' ⚠ POR ENCIMA DEL TOPE' : '';
      console.log(`| \`${r.nombre}\` | ${r.predicho} | ${r.aciertos}/${r.n}${mal} | ${Math.round((100 * r.aciertos) / r.n)}%${sobre} | ${r.aplicables} (${r.aplicablesPredicho})${malA} | ${r.cuales.join(' ')} | ${r.devuelve.map((z) => z ?? '∅').join(' ')} |`);
      if (sobre) process.exitCode = 1;
    }
  };
  tablaRutas('Estrategias CIEGAS (tope: la mitad)', ESTRATEGIAS, true);
  tablaRutas('PERFILES de conocimiento parcial (sin tope)', PERFILES, false);
  tablaRutas('RUTAS POR LECTURA', RUTAS_POR_LECTURA, false);
  const ctl = controlDelAparato();
  const ruta = correr(ITEMS, PERFILES).find((r) => r.nombre.startsWith('el-paradigma-entero'))!;
  console.log(`\n★ CONTROL DEL APARATO — ${ctl.examinadas} casillas de этот y тот: ${ctl.discrepancias.length} discrepancias; la ruta del paradigma entero: ${ruta.aciertos}/${ITEMS.length}.`);
  for (const d of ctl.discrepancias) console.log(`  ✗ ${d}`);
  if (ctl.discrepancias.length || ruta.aciertos !== ITEMS.length) { console.log('⚠ LA REGLA NO REPRODUCE LA TABLA: los números de PERFILES son de un aparato roto.'); process.exitCode = 1; }
  console.log('\n## Los RIVALES, con las cinco salidas\n');
  const vers = ITEMS.map((x) => veredictoRival(x)!);
  for (const k of ['EVIDENCIA', 'NULO VACÍO', 'TAREA DE LECTURA', 'HOMÓGRAFO', 'ROJO'] as Veredicto[]) console.log(`${k}: ${vers.filter((z) => z.veredicto === k).length}`);
  for (const [i, z] of vers.entries()) if (z.veredicto !== 'EVIDENCIA') console.log(`  · ítem ${i + 1} (${ITEMS[i]!.lema}): «${z.rival}» ${z.nR} — ${z.veredicto}${LECTURA_RIVAL[z.rival] ? `: ${LECTURA_RIVAL[z.rival]!.slice(0, 90)}…` : ''}`);
  if (vers.some((z) => z.veredicto === 'ROJO')) process.exitCode = 1;
  console.log('\n## Control positivo\n');
  const malas = FALSAS_DEL_LOTE.map((f) => ({ ...f, ...veredictoFalsa(f.mala, f.buena) }));
  for (const m of malas) console.log(`${m.rechaza ? '✓' : '✗'} *${m.mala}  [${m.via}] ${m.detalle}   — ${m.porQue}`);
  console.log(`\n${malas.filter((m) => m.rechaza).length}/${malas.length} rechazadas.`);
  if (malas.some((m) => !m.rechaza)) { console.log('⚠ UNA FORMA FALSA NO SE RECHAZA.'); process.exitCode = 1; }
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log(process.exitCode ? 'Gates limpios, PERO el informe tiene un rojo arriba.' : 'Limpio.');
}
