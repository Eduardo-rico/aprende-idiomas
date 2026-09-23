// scripts/lotes/cloze-ru-a2b.ts — EL SEXTO LOTE RUSO, segundo de A2.
//
//   npx tsx scripts/lotes/cloze-ru-a2b.ts          # gates + tabla + rutas
//   npx tsx scripts/lotes/cloze-ru-a2b.ts --json   # ítems para publicar
//
// DOCE ítems de `u5-genitivo-plural` (A2, `paradigma` → cloze con pista, piso
// 8). La respuesta NO se escribe: la deriva `casillaNominal(e, 'gen', 'pl')`
// desde `lexicon-a1.ts`. El molde es `cloze-ru-a2.ts` (una casilla, varias
// clases de lema, el gate RECALCULA la clase contra una regla de manual).
//
// ══ LAS PREGUNTAS, HECHAS A LA CASILLA Y NO AL TEMA, ANTES DE ESCRIBIR ═
//
//   · **¿Qué parte es gratis, del español de México y del portugués C2?**
//     Nada de la forma: en las dos lenguas el plural AÑADE (-s) y aquí la
//     tercera parte de los lemas QUITA (Ø). La desinencia la decide la
//     DECLINACIÓN —la terminación del nominativo singular— y, DENTRO de la 2.ª,
//     el género (стол → столов, место → мест: misma declinación, tema duro).
//     ⚠ La v0 decía «la declinación y no el género», media regla que el propio
//     `reglaSobreElLema` contradecía con su `if (g === 'n')` (E6 del lingüista).
//     ⚠ Y LA v0 AFIRMABA que el alumno TRAE de sus dos lenguas la regla
//     «masculino ⇒ -ов». Es falso (E5): en español y en portugués el plural lo
//     decide la TERMINACIÓN, no el género (el poeta/los poetas, o mapa/os
//     mapas, pão/pães), así que el patrón de мужчина → мужчин le es FAMILIAR.
//     La regla «masculino ⇒ -ов, femenino y neutro ⇒ Ø» viene de los MANUALES
//     de РКИ que la presentan por género; es la que el par 3 desmonta. Es una
//     hipótesis del modelo que se escribió como hecho de transferencia.
//   · **¿Qué capa mide el ítem, y cuáles carga?** `declinacion` (la forma);
//     el CASO va dado dos veces (la preposición o el cuantificador del marco,
//     y la pista), el GÉNERO va dado en la pista y es constante en el par, el
//     LÉXICO va en la glosa. Son las `capas` del punto, sin añadir ninguna.
//   · **¿Qué VARÍA entre los ítems?** La desinencia, en sus tres valores
//     (-ов, -ей, Ø) a 4 cada uno —con k = 3 el techo ciego de una cola fija
//     es 4/12 = 1/k, y G15 lo exige—, y lo que la decide: el tema
//     (duro/blando), la sibilante, la declinación, la vocal de apoyo y el
//     tema de plural. Cinco ejes en seis pares.
//   · **¿La preposición rige UN caso o DOS?** (§25.1) UNO en los seis marcos
//     (около, от, из, сколько, среди, от): el caso lo da la lengua y el ítem
//     es memorizable como bigrama. Se sabe al elegir y se mide en la ruta por
//     lectura.
//   · **¿El vecino DETERMINA la casilla o sólo la acompaña?** (§33.4) Fija el
//     caso siempre y el NÚMERO sólo en DOS marcos: `из … никто` (con estos
//     lemas el partitivo singular no cabe; con un colectivo sí: из семьи) y
//     `сколько` con un contable. En `около`, `от`, `вдали от` y `среди` el
//     plural lo da SÓLO la pista, en español. ⚠ La v0 contaba tres y metía
//     `среди`: falso (E2 del lingüista) — `среди` + genitivo SINGULAR es «en
//     medio de» (среди комнаты 61, среди двора 11), y «Среди карты лежало
//     письмо» es ruso impecable. Va declarado en el ítem.
//   · **¿Cuánto del instrumento queda fuera del control?** (§47) `Vista` no
//     tiene `caso` ni `num`: una ruta sólo puede producir un genitivo plural,
//     así que el control corre sobre los 42 lemas × 1 casilla, el 100 %.
//   · **¿El rival es una cadena DISTINTA de la respuesta?** (§59) Se comprueba
//     antes de leer el veredicto, y además que no sea el LEMA: el Ø de un
//     masculino duro es su nominativo singular (`стол`), otra casilla del
//     mismo lema, y contarlo mediría otra cosa.
//   · **★ LA OCTAVA (§71): ¿cada LECTURA tiene su fuente localizada, o la
//     atribuyo de memoria?** Las dos lecturas de este lote (`местов`,
//     `человеков`) se escribieron con el fichero de cada aparición delante,
//     contado con un regex unicode Y SIN DISTINGUIR MAYÚSCULAS: la primera
//     pasada, sin la bandera `i`, daba 8 de las 9 de `местов` y perdía la
//     que abre una réplica con mayúscula («Местов много…»). El segundo camino
//     de una lectura tiene su propio A7. ⚠ Y AUN ASÍ la v0 atribuía esa cita a
//     Dostoievski y al «брюнет»: está en Chéjov («Гордый человек») y la dice el
//     шафер AL brunet; lo de Dostoievski es «из однех местов» (el tabernero
//     Душкин). Dos fuentes fundidas en una y el hablante invertido, en el lote
//     que declaraba resuelto el §71 (E1 del lingüista). Tener el fichero
//     delante no basta: hay que leer la cita EN el fichero, no en la salida
//     del contador.
//
// ══ LO QUE NO ESTÁ AQUÍ, CON SU MOTIVO ══════════════════════════════
//
//   · **Ningún cuantificador delante de `человек`.** Tras `несколько`
//     (несколько человек 78 · людей 8) y los numerales (пять человек 21) el
//     genitivo de cómputo es `человек`; con `сколько` conviven (3 · 6). Un
//     ítem así suspendería a quien lo escribe bien. ⚠ La v0 metía `много`, y
//     `много человек` sale 0 frente a `много людей` 38 (E3). Su marco es `вдали от`, donde `человек` no cabe.
//   · **`сестра`, `день`, `край`**: su genitivo plural lleva ё (сестёр,
//     краёв) o vocal fugaz (дней, u13). **`деревня`** → `деревень` repetiría
//     en femenino la clase de `окон` (vocal de apoyo), que ya es el par 4 (⚠ la
//     v0 la metía entre las de ё o fugaz: motivo falso, E8). `дядя` → `дядей`
//     es una excepción de lista sin regla que la sostenga.
//   · **Ningún adjetivo ni determinante en el marco**: daría el número y el
//     caso en ruso, pero sería `u6-adjetivo-declinado`, otra capa.
import fs from 'node:fs';
import path from 'node:path';
import { NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { casillaNominal, type EntradaNominal, type GeneroRu, type TemaRu } from '../../lib/data/languages/ru/paradigma-ru';
import { revisarOrtografiaRu, quitarAcento, variantesSinYo } from '../../lib/lang/ortografia-ru';
import { buscar, corpus, INI, FIN } from '../corpus-ru';
import { candidatasConYo } from '../check-paradigma-ru';

/** De qué regla es la sobreaplicación un ítem de frontera. Tipo CERRADO, y
 *  cada regla es una FUNCIÓN EJECUTABLE (`SOBREAPLICADA`): el gate comprueba
 *  que la regla falla en la frontera Y acierta en la pareja de par, que es lo
 *  que hace del distractor algo alcanzable (D7). No se asigna una clase por
 *  descarte (E6 del lote 5): la regla escrita tiene que casar. */
export type ReglaSobreaplicadaGen =
  | 'el-tema-duro-hace-ов'          // sin la mitad de la sibilante: *товарищов
  | 'el-masculino-hace-ов'          // el género en vez de la declinación: *мужчинов
  | 'el-grupo-final-pide-vocal'     // la vocal de apoyo donde NO va: *месот (§0.6)
  | 'el-genitivo-sobre-el-lema';    // sin el tema de plural: *человеков

export type EjeGenRu = 'tema' | 'sibilante' | 'declinacion' | 'vocal-de-apoyo' | 'tema-de-plural';

export interface ClozeGenRu {
  p: string;
  lema: string;
  /** `___` para el hueco y `{L}` para el lema entre paréntesis detrás. */
  marco: string;
  /** «<glosa> — genitivo plural · <género>». Nunca el tema ni la desinencia. */
  pista: string;
  par: string;
  eje: EjeGenRu;
  frontera?: { regla: ReglaSobreaplicadaGen; motivo: string };
  /** La DECISIÓN del ítem sobre cada forma ATESTADA que no acepta, POR FORMA
   *  (E3 del lote 5). La LECTURA —qué es la forma— vive en LECTURA_RIVAL. */
  rivalesNoAceptados?: Record<string, string>;
}

const P = 'u5-genitivo-plural';

export const ITEMS: ClozeGenRu[] = [
  // ── PAR 1 · MASCULINO: duro contra blando ─────────────────────────
  // `столов` 53 · `коней` 214. `около столов` 9 · `около коней` 0 (la
  // ausencia no prohíbe; `около` rige sólo genitivo). El número lo da la pista.
  // ⚠ La v0 del marco acababa en «толпились люди», y `люди` es la RESPUESTA
  // publicada del ítem de человек en u3-plural-nominativo: la cazó G17 contra
  // el directorio de publicados en la primera corrida.
  { p: P, lema: 'стол', par: 'okolo', eje: 'tema',
    marco: 'Около ___ ({L}) толпился народ.', pista: 'mesa — genitivo plural · masculino' },
  { p: P, lema: 'конь', par: 'okolo', eje: 'tema',
    marco: 'Около ___ ({L}) толпился народ.', pista: 'caballo — genitivo plural · masculino' },

  // ── PAR 2 · MASCULINO: la SIBILANTE — frontera 1 ──────────────────
  // `студентов` 41 · `товарищей` 323 · `*товарищов` 0. `от товарищей` 11.
  { p: P, lema: 'студент', par: 'pismo-ot', eje: 'sibilante',
    marco: 'Он получил письмо от ___ ({L}).', pista: 'estudiante — genitivo plural · masculino' },
  { p: P, lema: 'товарищ', par: 'pismo-ot', eje: 'sibilante',
    marco: 'Он получил письмо от ___ ({L}).', pista: 'compañero, camarada — genitivo plural · masculino',
    frontera: {
      regla: 'el-tema-duro-hace-ов',
      motivo: 'LA REGLA DE DOS CASILLAS QUE EL ALUMNO SE CONSTRUYE AL VER EL PAR 1: «tema duro ⇒ -ов, tema blando ⇒ -ей». Acierta студентов, столов y коней, y le falta la mitad que dice que tras ж ш ч щ el genitivo plural masculino es -ей aunque el tema sea duro (АГ-80 I; Зализняк, tipo 4): товарищей 323 frente a *товарищов 0, y lo mismo врачей 30 · ножей 27 · ключей 26. Su distractor está en el mismo marco: студентов, un masculino animado de tema duro donde la regla de dos casillas SÍ acierta. ⚠ Y LO QUE NO ES: no es transferencia; ni el español ni el portugués tienen nada que empuje hacia -ов o hacia -ей. Es la sobreaplicación de una regla del propio punto. ⚠ Y la forma que la sobreaplicación produce en un alumno que SÍ sabe u1 no es *товарищов sino *товарищев (la /o/ átona tras sibilante se escribe е, como товарищем): sale 1 vez y es el POSESIVO «товарищев» (Ёрш), otra palabra, así que no puede ir al control positivo —la frecuencia la rechazaría por la razón equivocada— y se escribe aquí (discutible 2 del lingüista).',
    } },

  // ── PAR 3 · MASCULINO: la DECLINACIÓN, no el género — frontera 2 ──
  // `мальчиков` 95 · `мужчин` 241 · `*мужчинов` 0. `из мальчиков` 6 · `из
  // мужчин` 16. «Из … никто» fuerza el plural EN RUSO con estos dos lemas (con
  // un colectivo singular no: из семьи 7, discutible 10).
  { p: P, lema: 'мальчик', par: 'iz-nikto', eje: 'declinacion',
    marco: 'Из ___ ({L}) никто не ответил.', pista: 'niño — genitivo plural · masculino' },
  { p: P, lema: 'мужчина', par: 'iz-nikto', eje: 'declinacion',
    marco: 'Из ___ ({L}) никто не ответил.', pista: 'hombre — genitivo plural · masculino',
    frontera: {
      regla: 'el-masculino-hace-ов',
      motivo: 'LA REGLA QUE MUCHOS MANUALES DE РКИ DAN POR GÉNERO: «masculino ⇒ -ов, femenino y neutro ⇒ Ø». NO viene de las dos lenguas del alumno —en español y en portugués el plural lo decide la terminación y no el género (el poeta/los poetas, o mapa/os mapas), así que un masculino en -a que se pluraliza como un femenino le es familiar—: viene del manual, y por eso la frontera es de la regla enseñada y no de la transferencia. En el genitivo plural ruso lo que decide es la DECLINACIÓN (y, sólo dentro de la 2.ª, el género): мужчина acaba en -а, va por la 1.ª como книга, y su genitivo plural es мужчин (241), con desinencia Ø, aunque sea masculino y animado. *мужчинов sale 0 veces en 7,7 M de palabras. Su distractor está al lado, en el mismo marco: мальчиков, un masculino animado de la 2.ª donde la regla por género acierta. Es la única pareja del lexicón que separa las dos reglas dentro de UN género, y por eso entraron los dos lemas el 2026-09-23: папа, el otro masculino de la 1.ª, da пап 4 veces y no admite un marco natural en plural.',
    } },

  // ── PAR 4 · NEUTRO: la VOCAL DE APOYO — frontera 3 (§0.6 del punto) ─
  // `мест` 200 · `окон` 254. Los dos temas acaban en DOS consonantes (ст, кн)
  // y los dos toman Ø; sólo `окно` mete vocal. `сколько` con un contable fija
  // el genitivo plural EN RUSO. ⚠ Con un no contable fija el genitivo
  // SINGULAR partitivo: «сколько места» (cuánto espacio) es ruso correcto, y
  // por eso la pista dice «plural» y el ítem lo escribe en su campo.
  { p: P, lema: 'место', par: 'skolko', eje: 'vocal-de-apoyo',
    marco: 'Сколько ___ ({L}) было в зале?', pista: 'lugar — genitivo plural · neutro',
    frontera: {
      regla: 'el-grupo-final-pide-vocal',
      motivo: 'LA SOBREAPLICACIÓN QUE EL PROPIO PUNTO DECLARA EN SU §0.6 («la vocal de apoyo donde NO va»). Quien vea окно → окон, сестра → сестёр, письмо → писем aprende que «cuando la desinencia Ø deja dos consonantes al final, se mete una vocal entre ellas», y escribe *месот o *месет (0 las dos). La vocal de apoyo NO depende sólo de que haya grupo: depende de la consonante FINAL del grupo (АГ-80; Зализняк) — aparece cuando acaba en sonante (р л н м) o en к/ц (окон, сестёр, писем 134, земель 108, ложек 21, сердец) y no cuando acaba en otra obstruyente (мест, карт, звёзд, верст 493), con pocas excepciones marcadas por lema (судеб 23, свадеб 6). ⚠ La v0 decía «el reparto es LÉXICO» y callaba esa regla (E7 del lingüista): un alumno con la regla buena acierta мест y карт sin lista. Su distractor es la otra cara del par, окон, en el mismo marco. ⚠ El inventario cita *карот como ejemplo; aquí va *месот porque el par tiene que ser de un solo género (§63) y el neutro trae las dos caras en el lexicón (место/окно) sin ё, mientras que la cara femenina con apoyo es сестёр, cuya ё el comparador no pliega (§32). карт está en el par 5 y tampoco lleva vocal.',
    },
    rivalesNoAceptados: {
      'места': 'NO ES UN RIVAL DEL MISMO ANÁLISIS: «сколько места» es el genitivo SINGULAR partitivo de место como no contable («cuánto espacio»), ruso correcto. El ítem pide la casilla que la pista nombra, genitivo PLURAL, y en esa casilla места no es respuesta. Se escribe aquí para que nadie la tome por un error de lengua.',
      'местов': 'NO se acepta: 9 apariciones, todas en habla popular (ver LECTURA_RIVAL). Es la sobreaplicación de -ов al neutro, viva en el diálogo del XIX; la norma es мест (200) y es citable.',
    } },
  { p: P, lema: 'окно', par: 'skolko', eje: 'vocal-de-apoyo',
    marco: 'Сколько ___ ({L}) было в зале?', pista: 'ventana — genitivo plural · neutro' },

  // ── PAR 5 · FEMENINO: la DECLINACIÓN otra vez, del otro lado ──────
  // `карт` 91 · `вещей` 289. 1.ª declinación (Ø) contra 3.ª (-ей), las dos
  // femeninas: la terminación del nominativo decide y el género no. ⚠ `среди`
  // NO fija el plural: admite el genitivo singular «en medio de» (E2).
  // ⚠ §74 PEDÍA LEER `карт` ANTES DE USARLO: ¿homógrafo de otra palabra?
  // Leído: las 91 son el genitivo plural de карта, casi todas «carta de
  // baraja» (колоду карт 13, колода 8, колоды 5, игральных 3); ningún otro
  // lema da esa cadena. ⚠ La v0 decía «la glosa "mapa, carta" cubre los dos
  // sentidos», y eso es verdad en Madrid y falso en México, donde «carta» es
  // письмо — y este marco lleva «старое письмо». Corregida el 2026-09-23 en el
  // lexicón a «mapa, carta de baraja» (ver su nota), con las dos pistas
  // publicadas resincronizadas por `resincronizar-pista-ru.ts`.
  { p: P, lema: 'карта', par: 'sredi', eje: 'declinacion',
    marco: 'Среди ___ ({L}) лежало старое письмо.', pista: 'mapa, carta de baraja — genitivo plural · femenino',
    rivalesNoAceptados: {
      'карты': 'NO ES UN RIVAL DEL MISMO ANÁLISIS: «среди карты» es el genitivo SINGULAR con среди «en medio de» (среди комнаты 61, среди двора 11), ruso correcto: «en medio del mapa». La pista pide genitivo PLURAL y en esa casilla карты no es respuesta. ⚠ G11 no puede ver esta clase —sólo genera rivales pegados al tema en plural—, así que una lectura correcta en SINGULAR nunca lo pondría rojo (C5): se declara a mano, como места.',
    } },
  { p: P, lema: 'вещь', par: 'sredi', eje: 'declinacion',
    marco: 'Среди ___ ({L}) лежало старое письмо.', pista: 'cosa — genitivo plural · femenino',
    rivalesNoAceptados: { 'вещи': '«среди вещи» (genitivo singular, «en medio de la cosa») es gramatical y absurdo; la pista pide plural. Declarado por simetría con карты.' } },

  // ── PAR 6 · MASCULINO: el TEMA DE PLURAL — frontera 4 ─────────────
  // `городов` 55 · `людей` 3.578. `вдали от` rige genitivo y no admite el
  // genitivo de cómputo `человек`, que es correcto tras cuantificador.
  { p: P, lema: 'город', par: 'vdali', eje: 'tema-de-plural',
    marco: 'Он долго жил вдали от ___ ({L}).', pista: 'ciudad — genitivo plural · masculino' },
  { p: P, lema: 'человек', par: 'vdali', eje: 'tema-de-plural',
    marco: 'Он долго жил вдали от ___ ({L}).', pista: 'persona — genitivo plural · masculino',
    frontera: {
      regla: 'el-genitivo-sobre-el-lema',
      motivo: 'LA SOBREAPLICACIÓN DE «EL CASO SE PEGA AL TEMA DEL LEMA», que en plural sólo vale cuando el plural no cambia de tema. человек lo cambia entero (люди, lote 4; людьми, lote 5): el tema de plural es люд-, BLANDO, y su genitivo es людей (3.578; ⚠ la v0 decía «la forma de genitivo plural más frecuente de la biblioteca», escrito de memoria y falso: лет 4.224, E4). Quien pegue la regla al lema escribe *человеков, que el alumno puede LEER: sale 11 veces, todas en registro eclesiástico, elevado o irónico («поношение человеков», «в числе человеков»; ver LECTURA_RIVAL). Su distractor está en el mismo marco: городов, un masculino de tema duro donde la regla sobre el lema acierta. ⚠ Y el ítem presupone люди, respuesta publicada de u3-plural-nominativo (prerrequisito del prerrequisito de este punto).',
    },
    rivalesNoAceptados: {
      'человеков': 'NO se acepta: 11 apariciones, todas en registro eclesiástico, elevado o irónico, ninguna como plural neutro de «persona» (ver LECTURA_RIVAL). Aceptarla haría correcta la sobreaplicación exacta que la frontera mide. Se declara que el alumno la puede leer; no se llama error de lengua.',
    } },
];

// ══════════════════════════════════════════════════════════════════════
// LA DERIVACIÓN, Y NO SE TECLEA
// ══════════════════════════════════════════════════════════════════════
const NOM = new Map(NOMBRES_A1.map((n) => [n.lema, n]));
export function entradaNom(x: ClozeGenRu): EntradaNominal | undefined { return NOM.get(x.lema); }
export function respuestaDe(x: ClozeGenRu): string | null {
  const n = entradaNom(x);
  return n ? casillaNominal(n, 'gen', 'pl') : null;
}
/** CALCULADAS, nunca declaradas a mano. Hoy vacías: ninguna respuesta lleva ё. */
export function alternativasDe(x: ClozeGenRu): string[] {
  const r = respuestaDe(x);
  return r ? variantesSinYo(r) : [];
}
export function frase(x: ClozeGenRu): string { return x.marco.replace('{L}', x.lema); }
export function regente(s: string): string {
  const toks = (s.split('___')[0] ?? '').split(/[^\p{L}]+/u).filter(Boolean);
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : '';
}
/** Qué casos rige cada regente del lote, ENTEROS (no sólo el del lote). */
export const REGENTES: Record<string, string[]> = {
  'около': ['gen'], 'от': ['gen'], 'из': ['gen'], 'среди': ['gen'],
  // `сколько` rige genitivo: PLURAL con un contable, SINGULAR con uno que no
  // lo es (сколько места / сколько воды). Es cuantificador, no preposición.
  'сколько': ['gen'],
};
const GENERO_ES: Record<GeneroRu, string> = { m: 'masculino', f: 'femenino', n: 'neutro' };
const sinParentesis = (s: string) => s.replace(/\([^)]*\)/g, ' ');
const PALABRA = (w: string) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu');

// ══════════════════════════════════════════════════════════════════════
// EL SEGUNDO CAMINO: LA REGLA DE MANUAL, ESCRITA A MANO AQUÍ
// ══════════════════════════════════════════════════════════════════════
// No se importa de la máquina. `controlDelAparato()` la compara con
// `casillaNominal` en los 42 lemas del lexicón, no en los doce del lote.
export const temaDelLema = (lema: string) => quitarAcento(lema).replace(/[аяоеьй]$/, '');
export const SIBILANTE = (t: string) => /[жшчщ]$/.test(t);
export const GRUPO_FINAL = (t: string) => /[^аеёиоуыэюяьй][^аеёиоуыэюяьй]$/.test(t);
export type Decl = 1 | 2 | 3;
export function declinacionManual(lema: string, g: GeneroRu): Decl {
  const l = quitarAcento(lema);
  if (/[ая]$/.test(l)) return 1;
  if (g === 'f' && l.endsWith('ь')) return 3;
  return 2;
}
/** La regla SOBRE EL LEMA, sin listas: declinación, tema y sibilante. */
export function reglaSobreElLema(lema: string, g: GeneroRu, tema: TemaRu): string {
  const l = quitarAcento(lema), t = temaDelLema(lema), d = declinacionManual(lema, g);
  if (d === 3) return t + 'ей';
  if (d === 1) return tema === 'duro' ? t : t + 'ь';
  if (g === 'n') return tema === 'duro' ? t : t + 'ей';
  if (SIBILANTE(t) || l.endsWith('ь')) return t + 'ей';
  if (l.endsWith('й')) return t + 'ев';
  return t + 'ов';
}
/** Las formas que un manual lista lema a lema. */
export const APOYO_DE_MANUAL: Record<string, string> = {
  'сестра': 'сестёр', 'деревня': 'деревень', 'окно': 'окон', 'письмо': 'писем', 'сердце': 'сердец',
};
export const TEMAS_PL_DE_MANUAL: Record<string, string> = { 'друг': 'друзь', 'человек': 'люд', 'день': 'дн' };
export const FORMAS_DE_MANUAL: Record<string, string> = { 'дядя': 'дядей', 'край': 'краёв' };
/** El genitivo plural sobre un tema de plural BLANDO: -ей, y la ь del tema
 *  cae (друзь- → друзей). ⚠ La v0 pegaba -ей sin más y daba *друзьей: lo cazó
 *  el control del aparato en la primera corrida, sobre `друг`, un lema que
 *  NINGÚN ítem del lote toca — que es exactamente para lo que el §47 pide
 *  correrlo sobre el lexicón entero y no sobre los doce. */
export const genDeTemaPl = (tp: string) => tp.replace(/ь$/, '') + 'ей';
/** La regla del manual entero. */
export function reglaDeManual(lema: string, g: GeneroRu, tema: TemaRu): string {
  if (FORMAS_DE_MANUAL[lema]) return FORMAS_DE_MANUAL[lema]!;
  if (APOYO_DE_MANUAL[lema]) return APOYO_DE_MANUAL[lema]!;
  if (TEMAS_PL_DE_MANUAL[lema]) return genDeTemaPl(TEMAS_PL_DE_MANUAL[lema]!);
  return reglaSobreElLema(lema, g, tema);
}
/** ★ EL CONTROL DEL APARATO (§47): 42 lemas × 1 casilla, el 100 % de lo que
 *  una `Vista` puede alcanzar. Recibe la regla por PARÁMETRO para poder verse
 *  en rojo sobre un lema que ningún ítem toca. */
export function controlDelAparato(manualDe: (l: string, g: GeneroRu, t: TemaRu) => string = reglaDeManual): string[] {
  const out: string[] = [];
  for (const e of NOMBRES_A1) {
    const maquina = casillaNominal(e, 'gen', 'pl');
    if (maquina === null) { out.push(`${e.lema} gen.pl: la máquina no produce forma`); continue; }
    const manual = manualDe(e.lema, e.genero, e.tema);
    if (manual !== maquina) out.push(`${e.lema} gen.pl: el manual da «${manual}» y la máquina «${maquina}»`);
  }
  return out;
}

/** La CLASE, recalculada contra la regla escrita (§60) y nunca por descarte
 *  (E6 del lote 5): cada clase exige CASAR con su tabla; lo que no casa con
 *  ninguna es `ninguna`, y es rojo. */
export type ClaseGen = 'regular' | 'vocal-de-apoyo' | 'tema-de-plural' | 'lista' | 'ninguna';
export function claseDe(e: EntradaNominal, resp: string): ClaseGen {
  if (resp === reglaSobreElLema(e.lema, e.genero, e.tema)) return 'regular';
  if (APOYO_DE_MANUAL[e.lema] === resp) return 'vocal-de-apoyo';
  if (TEMAS_PL_DE_MANUAL[e.lema] && genDeTemaPl(TEMAS_PL_DE_MANUAL[e.lema]!) === resp) return 'tema-de-plural';
  if (FORMAS_DE_MANUAL[e.lema] === resp) return 'lista';
  return 'ninguna';
}
/** La desinencia, en sus tres valores: lo que el alumno ELIGE. */
export type Des = 'ов' | 'ей' | 'Ø';
/** ⚠ SE LEE CONTRA EL TEMA DEL LEMA, no en la cola de la cadena. La v0 miraba
 *  `/[оеё]в$/` y clasificaba `слов` —Ø sobre el tema `слов-`— como «-ов»: lo
 *  cazó el testigo rojo de G12 al meter `слово` en el par 4, y habría falseado
 *  G13 (el techo 1/k) con cualquier lema cuyo tema acabe en -ов/-ев (голова →
 *  голов, корова → коров). Es el §A6 en el instrumento propio. */
export function desinenciaDe(resp: string, lema: string): Des {
  const t = temaDelLema(lema);
  if (resp === t || resp === t + 'ь') return 'Ø';
  if ([t + 'ов', t + 'ев', t + 'ёв'].includes(resp)) return 'ов';
  if (/ей$/.test(resp)) return 'ей';
  return 'Ø';   // la vocal de apoyo (окон, сестёр): Ø con el tema alterado
}

/** Las cuatro reglas sobreaplicadas, EJECUTABLES. */
export const SOBREAPLICADA: Record<ReglaSobreaplicadaGen, (e: EntradaNominal) => string> = {
  'el-tema-duro-hace-ов': (e) => {
    const t = temaDelLema(e.lema), d = declinacionManual(e.lema, e.genero);
    if (d !== 2 || e.genero === 'n') return reglaSobreElLema(e.lema, e.genero, e.tema);
    return e.tema === 'duro' ? t + 'ов' : t + 'ей';
  },
  'el-masculino-hace-ов': (e) => {
    const t = temaDelLema(e.lema);
    // ⚠ La v0 escribía `e.tema === 'duro' && !SIBILANTE(t)`: sabía la regla de
    // la sibilante que el nombre de la regla —y el perfil que la usa— dicen que
    // NO sabe. Lo cazó la predicción del perfil `por-genero-y-tema` (8 escrito
    // a mano; la v0 dio 9 acertando товарищей). Nombre ≠ código, el E9 del
    // lote 5 otra vez; se arregla el código, no el número.
    if (e.genero === 'm') return e.tema === 'duro' ? t + 'ов' : t + 'ей';
    return e.tema === 'duro' ? t : t + 'ей';
  },
  'el-grupo-final-pide-vocal': (e) => {
    const r = reglaSobreElLema(e.lema, e.genero, e.tema);
    return desinenciaDe(r, e.lema) === 'Ø' && GRUPO_FINAL(r) ? r.slice(0, -1) + 'о' + r.slice(-1) : r;
  },
  'el-genitivo-sobre-el-lema': (e) => reglaSobreElLema(e.lema, e.genero, e.tema),
};
const ESPERADA: Record<ReglaSobreaplicadaGen, ClaseGen> = {
  'el-tema-duro-hace-ов': 'regular', 'el-masculino-hace-ов': 'regular',
  'el-grupo-final-pide-vocal': 'regular', 'el-genitivo-sobre-el-lema': 'tema-de-plural',
};

// ══════════════════════════════════════════════════════════════════════
// LOS GATES
// ══════════════════════════════════════════════════════════════════════
export function verificar(items: ClozeGenRu[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const resps = new Map<string, number>();
  for (const [i, x] of items.entries()) {
    const id = `CLRUA2B-${String(i + 1).padStart(3, '0')} (${x.lema})`;
    const n = entradaNom(x);
    if (!n) { v.push(`${id}: el lema «${x.lema}» no está en NOMBRES_A1`); continue; }
    if (x.p !== P) v.push(`${id}: el punto es «${x.p}» y este lote es de ${P}`);
    // G0 · la vocal fugaz es u13-alternancias-raiz.
    if (n.temaOblicuo) v.push(`${id}: «${x.lema}» tiene tema oblicuo «${n.temaOblicuo}» — mediría u13-alternancias-raiz`);
    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: casillaNominal devuelve null para gen.pl`); continue; }
    const alt = alternativasDe(x), s = frase(x), reg = regente(s);
    // G1 · un hueco y un `{L}`. G2 · el lema detrás del hueco.
    for (const [marca, k] of [['___', s.split('___').length - 1], ['{L}', x.marco.split('{L}').length - 1]] as const)
      if (k !== 1) v.push(`${id}: ${k} «${marca}» en el marco, tiene que haber 1`);
    if (!new RegExp(`___\\s*\\(\\s*${x.lema}\\s*\\)`).test(s)) v.push(`${id}: la frase no nombra el lema entre paréntesis detrás del hueco`);
    // G3 · la pista canónica, con la glosa del lexicón y sin nombrar lo examinado.
    if (!/^[^—·]+ — genitivo plural · (masculino|femenino|neutro)$/.test(x.pista)) v.push(`${id}: la pista «${x.pista}» no tiene la forma «<glosa> — genitivo plural · <género>»`);
    if (!x.pista.endsWith(GENERO_ES[n.genero])) v.push(`${id}: la pista no nombra el género «${GENERO_ES[n.genero]}»`);
    if (!x.pista.startsWith(`${n.glosa} —`)) v.push(`${id}: la glosa de la pista no es la de NOMBRES_A1 («${n.glosa}»)`);
    if (/(tema|dur[oa]|bland[oa]|clase|velar|sibilante|desinencia|termina|acento|irregul|supletiv|declinaci|vocal|apoyo|cero)/i.test(x.pista))
      v.push(`${id}: la pista nombra el TEMA, la CLASE o la DESINENCIA, que es lo examinado`);
    // G4 · el regente rige genitivo. Uno fuera de la tabla es rojo.
    const rige = REGENTES[reg];
    if (!rige) v.push(`${id}: el regente «${reg}» no está en REGENTES — el gate no aprueba lo que no sabe leer`);
    else if (!rige.includes('gen')) v.push(`${id}: el regente «${reg}» rige ${rige.join('/')} y el ítem pide genitivo`);
    // G5/G6 · ni la pista ni la frase deletrean la respuesta. G7 · no es el lema.
    for (const c of [r, ...alt]) if (PALABRA(quitarAcento(c)).test(x.pista)) v.push(`${id}: la pista deletrea «${c}»`);
    if (PALABRA(quitarAcento(r)).test(quitarAcento(sinParentesis(s).replace('___', ' ')))) v.push(`${id}: la respuesta «${r}» ya está en la frase`);
    if (quitarAcento(r) === quitarAcento(x.lema)) v.push(`${id}: la respuesta coincide con el lema`);
    // G8 · la ё, en las dos direcciones.
    if (r.includes('ё') && alt.length === 0) v.push(`${id}: «${r}» lleva ё y no declara la variante sin ё`);
    for (const c of candidatasConYo(r)) v.push(`${id}: «${r}» tiene variante con ё atestada («${c.forma}» ${c.n})`);
    // G9 · ortografía y homóglifos en todo lo que el alumno ve.
    for (const [campo, t] of [['frase', s], ['pista', x.pista], ['respuesta', r]] as const)
      for (const h of revisarOrtografiaRu(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // G10 · la respuesta, atestada.
    if (buscar(quitarAcento(r)).n === 0) v.push(`${id}: «${r}» no aparece en 7,7 M de palabras`);
    // G11 · EL RIVAL ATESTADO LLEVA LECTURA Y DECISIÓN, las dos (E3 del lote 5).
    for (const riv of rivalesDe(x)) {
      const k = buscar(riv).n;
      if (k === 0) continue;
      if (!LECTURA_RIVAL[riv]) v.push(`${id}: el rival «${riv}» sale ${k} veces y LECTURA_RIVAL no dice qué es`);
      if (!x.rivalesNoAceptados?.[riv]) v.push(`${id}: el rival «${riv}» sale ${k} veces y el ítem no escribe su decisión en rivalesNoAceptados`);
    }
    const clave = s.replace(/\s+/g, ' ').trim().toLowerCase();
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
    resps.set(r, (resps.get(r) ?? 0) + 1);
  }
  for (const [r, k] of resps) if (k > 1) v.push(`la respuesta «${r}» sale ${k} veces`);
  if (new Set(items.map((x) => x.lema)).size !== items.length) v.push('el lote repite algún lema');

  // G12 · LOS PARES: marco, eje y GÉNERO constantes; las desinencias o las
  //       formas, distintas; y el EJE se RECALCULA contra el lexicón.
  const pares = new Map<string, ClozeGenRu[]>();
  for (const x of items) pares.set(x.par, [...(pares.get(x.par) ?? []), x]);
  for (const [k, xs] of pares) {
    if (xs.length !== 2) { v.push(`par «${k}»: ${xs.length} ítems — un par de marco son DOS`); continue; }
    const [a, b] = xs as [ClozeGenRu, ClozeGenRu];
    if (a.marco !== b.marco) v.push(`par «${k}»: los dos marcos no son idénticos`);
    if (a.eje !== b.eje) v.push(`par «${k}»: ejes distintos («${a.eje}» / «${b.eje}»)`);
    const ea = entradaNom(a), eb = entradaNom(b), ra = respuestaDe(a), rb = respuestaDe(b);
    if (!ea || !eb || !ra || !rb) continue;
    if (ea.genero !== eb.genero) v.push(`par «${k}»: géneros distintos (${ea.genero}/${eb.genero}) — la pista escribe el género y lo regalaría (§63)`);
    const ka = claseDe(ea, ra), kb = claseDe(eb, rb);
    const reg = ka === 'regular' && kb === 'regular';
    const ta = temaDelLema(a.lema), tb = temaDelLema(b.lema);
    const da = declinacionManual(a.lema, ea.genero), db = declinacionManual(b.lema, eb.genero);
    switch (a.eje) {
      case 'tema':
        if (!reg) v.push(`par «${k}»: eje «tema» con un irregular (${ka}/${kb})`);
        else if (ea.tema === eb.tema || da !== db) v.push(`par «${k}»: eje «tema» exige misma declinación y temas distintos (${ea.tema}/${eb.tema}, ${da}/${db})`);
        else if (SIBILANTE(ta) || SIBILANTE(tb)) v.push(`par «${k}»: eje «tema» con una sibilante — eso es «sibilante»`);
        break;
      case 'sibilante':
        if (!reg) v.push(`par «${k}»: eje «sibilante» con un irregular (${ka}/${kb})`);
        else if (ea.tema !== 'duro' || eb.tema !== 'duro' || da !== 2 || db !== 2) v.push(`par «${k}»: eje «sibilante» exige dos temas DUROS de la 2.ª`);
        else if (SIBILANTE(ta) === SIBILANTE(tb)) v.push(`par «${k}»: eje «sibilante» y los dos temas son ${SIBILANTE(ta) ? '' : 'no '}sibilantes`);
        break;
      case 'declinacion':
        if (!reg) v.push(`par «${k}»: eje «declinacion» con un irregular (${ka}/${kb})`);
        else if (da === db) v.push(`par «${k}»: eje «declinacion» y los dos lemas son de la ${da}.ª`);
        break;
      case 'vocal-de-apoyo': {
        const ks = [ka, kb].sort().join('/');
        if (ks !== 'regular/vocal-de-apoyo') v.push(`par «${k}»: eje «vocal-de-apoyo» y las clases son ${ka}/${kb}`);
        else if (desinenciaDe(ra, a.lema) !== 'Ø' || desinenciaDe(rb, b.lema) !== 'Ø') v.push(`par «${k}»: eje «vocal-de-apoyo» con una desinencia que no es Ø`);
        else if (!GRUPO_FINAL(ta) || !GRUPO_FINAL(tb)) v.push(`par «${k}»: eje «vocal-de-apoyo» y algún tema no acaba en dos consonantes (${ta}/${tb}) — sin grupo no hay decisión`);
        break;
      }
      case 'tema-de-plural': {
        const ks = [ka, kb].sort().join('/');
        if (ks !== 'regular/tema-de-plural') v.push(`par «${k}»: eje «tema-de-plural» y las clases son ${ka}/${kb}`);
        break;
      }
    }
    if (a.eje !== 'vocal-de-apoyo' && desinenciaDe(ra, a.lema) === desinenciaDe(rb, b.lema))
      v.push(`par «${k}»: las dos desinencias son «${desinenciaDe(ra, a.lema)}» — el par no contrasta la elección`);
  }
  // G13 · VARIANZA: las tres desinencias, ninguna por encima de 1/k (una cola
  //       fija no puede pasar del techo ciego, G4 de la doctrina); ≥ 4 ejes.
  const cuenta = new Map<Des, number>();
  for (const x of items) { const r = respuestaDe(x); if (r) { const d = desinenciaDe(r, x.lema); cuenta.set(d, (cuenta.get(d) ?? 0) + 1); } }
  if (cuenta.size !== 3) v.push(`el lote usa ${cuenta.size} de las tres desinencias`);
  for (const [d, k] of cuenta) if (k > Math.ceil(items.length / 3)) v.push(`la desinencia ${d} ocupa ${k} de ${items.length}: una cola fija pasaría del techo 1/k`);
  if (new Set(items.map((x) => x.eje)).size < 4) v.push('menos de cuatro ejes distintos');

  // G14 · LAS FRONTERAS: la regla sobreaplicada se EJECUTA — falla en la
  //       frontera y acierta en la pareja (distractor alcanzable, D7) —, la
  //       clase recalculada es la esperada, y ninguna regla se repite.
  const reglas = new Set<string>();
  for (const x of items.filter((y) => y.frontera)) {
    const f = x.frontera!;
    if (reglas.has(f.regla)) v.push(`${x.lema}: dos fronteras sobreaplican «${f.regla}»`);
    reglas.add(f.regla);
    if (f.motivo.length < 120) v.push(`${x.lema}: el motivo de la frontera es demasiado corto`);
    const n = entradaNom(x), r = respuestaDe(x);
    const pj = items.find((y) => y !== x && y.par === x.par);
    const np = pj && entradaNom(pj), rp = pj && respuestaDe(pj);
    if (!n || !r || !pj || !np || !rp) { v.push(`${x.lema}: frontera sin pareja de par`); continue; }
    const sob = SOBREAPLICADA[f.regla];
    if (sob(n) === r) v.push(`${x.lema}: declara «${f.regla}» y esa regla ACIERTA «${r}» — no es una sobreaplicación`);
    if (sob(np) !== rp) v.push(`${x.lema}: la regla «${f.regla}» no acierta a la pareja (${sob(np)} ≠ ${rp}) — el distractor no es alcanzable`);
    if (claseDe(n, r) !== ESPERADA[f.regla]) v.push(`${x.lema}: «${f.regla}» pide clase «${ESPERADA[f.regla]}» y la recalculada es «${claseDe(n, r)}»`);
  }
  if (reglas.size === 0) v.push('el lote no declara ninguna frontera (§0.6)');
  // G15 · ningún irregular suelto: o es frontera, o es la pareja de una.
  for (const x of items) {
    const n = entradaNom(x), r = respuestaDe(x);
    if (!n || !r || claseDe(n, r) === 'regular' || x.frontera) continue;
    if (!items.some((y) => y !== x && y.par === x.par && y.frontera)) v.push(`${x.lema}: «${r}» es ${claseDe(n, r)} y ni es frontera ni es el distractor de una`);
  }
  // G16 · ninguna palabra de un marco es respuesta de otro ítem.
  const resp = new Map<string, string>();
  for (const x of items) { const r = respuestaDe(x); if (r) resp.set(quitarAcento(r).toLowerCase(), x.lema); }
  for (const x of items)
    for (const w of sinParentesis(frase(x)).replace('___', ' ').split(/[^\p{L}]+/u).filter((t) => t.length >= 3)) {
      const d = resp.get(quitarAcento(w).toLowerCase());
      if (d) v.push(`${x.lema}: el marco contiene «${w}», que es la RESPUESTA del ítem de «${d}»`);
    }
  return v;
}

// G17 · LA FUGA CONTRA LO YA PUBLICADO, con exclusión POR IDENTIDAD (§51).
// ⚠ Si falta el directorio NO devuelve `[]` en silencio (discutible 21 del
// lote 5, §A2): lo dice como hallazgo.
export function fugaContraLoPublicado(items: ClozeGenRu[], dir: string): string[] {
  if (!fs.existsSync(dir)) return [`G17: no existe «${dir}» — el gate no ha mirado nada`];
  const out: string[] = [];
  const propias = new Set(items.map((x) => frase(x).replace(/\s+/g, ' ').trim().toLowerCase()));
  const pub = new Map<string, string>();
  for (const f of fs.readdirSync(dir).filter((z: string) => /^b\d+\.json$/.test(z)))
    for (const ex of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Array<Record<string, any>>) {
      if (propias.has(String(ex?.data?.sentence ?? '').replace(/\s+/g, ' ').trim().toLowerCase())) continue;
      for (const b of (ex?.data?.blanks ?? []) as Array<{ answer?: string; alternatives?: string[] }>)
        for (const c of [b.answer, ...(b.alternatives ?? [])]) if (typeof c === 'string') pub.set(quitarAcento(c).toLowerCase(), String(ex.id));
    }
  for (const x of items) {
    const r = respuestaDe(x);
    if (r && pub.has(quitarAcento(r).toLowerCase())) out.push(`${x.lema}: la respuesta «${r}» ya está publicada en ${pub.get(quitarAcento(r).toLowerCase())}`);
    for (const w of sinParentesis(frase(x)).replace('___', ' ').split(/[^\p{L}]+/u).filter(Boolean)) {
      const id = pub.get(quitarAcento(w).toLowerCase());
      if (id) out.push(`${x.lema}: el marco contiene «${w}», respuesta del ejercicio publicado ${id}`);
    }
  }
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// LOS RIVALES, CON LAS CINCO SALIDAS (§9.1 + HOMÓGRAFO del §59)
// ══════════════════════════════════════════════════════════════════════
/** Las tres desinencias pegadas al tema del lema, más la salida de la regla
 *  sobreaplicada si es frontera. Fuera las que coinciden con la respuesta y
 *  las que son el LEMA (el Ø de un masculino duro es su nominativo singular:
 *  otra casilla del mismo lema, y contarla mediría otra cosa). */
export function rivalesDe(x: ClozeGenRu): string[] {
  const n = entradaNom(x), r = respuestaDe(x);
  if (!n || !r) return [];
  const t = temaDelLema(x.lema);
  // ⚠ El Ø va SÓLO en la rama del propio tema (duro → t, blando → t+ь). La v0
  // metía las dos y el gate pidió lectura para «столь» 703 (el adverbio), «месть»
  // 20 («venganza») y «кон» 1 («на кон»): hipótesis que ningún alumno hace,
  // fabricadas por mi generador de rivales (§A6) — y las tres eran homógrafos
  // de otra palabra, o sea que el gate habría archivado «lecturas» de nada.
  const out = new Set<string>([t + 'ов', t + 'ей', n.tema === 'duro' ? t : t + 'ь', reglaSobreElLema(x.lema, n.genero, n.tema)]);
  if (x.frontera) out.add(SOBREAPLICADA[x.frontera.regla](n));
  return [...out].filter((z) => z !== r && z !== quitarAcento(x.lema) && revisarOrtografiaRu(z).length === 0);
}
/** El rival PRINCIPAL: el error que el ítem induce — la salida de su regla
 *  sobreaplicada si es frontera; si no, la desinencia de la pareja de par
 *  pegada a su tema (el contagio), que es la hipótesis que el par pone al lado. */
export function rivalDe(x: ClozeGenRu, items: ClozeGenRu[] = ITEMS): string | null {
  const n = entradaNom(x), r = respuestaDe(x);
  if (!n || !r) return null;
  if (x.frontera) return SOBREAPLICADA[x.frontera.regla](n);
  const pj = items.find((y) => y !== x && y.par === x.par);
  const rp = pj && respuestaDe(pj);
  if (!rp) return null;
  const t = temaDelLema(x.lema), d = desinenciaDe(rp, pj!.lema);
  return d === 'Ø' ? (n.tema === 'duro' ? t : t + 'ь') : t + d;
}
export const LECTURA_RIVAL: Record<string, string> = {
  'местов': 'ATESTADA 9 VECES EN 8 LECTURAS, localizadas con un regex unicode sin distinguir mayúsculas: Chéjov ×4 («Безотцовщина»; «Счастье»; «Гордый человек», donde el шафер le dice al brunet «Местов много… Да вот хоть бы к буфету»; «Мечты»), Leskov «Воительница» ×2, Dostoievski «Преступление и наказание» (c09, «а с Митреем они из однех местов», deposición del tabernero Душкин), Saltykov «Ворон-челобитчик» y Tolstói «Записки маркёра». Leídas las 9: siete son DIÁLOGO en habla popular o imitándola («из наших местов,— отвечает», «из каких местов ты сам?», «никто настоящих местов не знает»; en «Безотцовщина» la dice Трилецкий, médico, en tono bufo, no un hombre del pueblo) y dos NARRACIÓN SKAZ, en voz de narrador popular (el marcador de Tolstói; la fábula de Saltykov, «вороньё новых местов искать»). Es la forma de habla popular (просторечие) del XIX; la norma es мест 200.',
  'человеков': 'ATESTADA 11 VECES EN 11 LECTURAS (Chéjov ×4: «Человек в футляре», «Корреспондент», «У постели больного», «Степь»; Dostoievski ×2: «Братья Карамазовы», «Игрок»; Leskov ×2: «Очарованный странник», «Железная воля»; Turguénev ×2: «Муму», «Бригадир»; Tolstói «Война и мир»). Leídas las 11: ninguna es el plural neutro de «persona». Son registro eclesiástico o elevado —«поношение человеков» (cita del Salmo 21), «блаженство человеков», «пищу человеков»—, la fórmula irónica «в числе человеков» (×3), el rótulo «Равнодушие человеков», el juego con el título en Chéjov («таких человеков в футляре») y, en boca de narradores y personajes populares (Флягин en «Очарованный странник», Капитон en «Муму», el narrador de «Бригадир»), просторечие como «за человеков считать». Plural eslavo eclesiástico o popular, vivo como cita, ironía o habla de personaje; el plural de человек es люди/людей.',
};
export type Veredicto = 'EVIDENCIA' | 'NULO VACÍO' | 'TAREA DE LECTURA' | 'HOMÓGRAFO' | 'ROJO';
export function veredictoRival(x: ClozeGenRu): { rival: string; nR: number; nB: number; veredicto: Veredicto } | null {
  const rival = rivalDe(x), r = respuestaDe(x);
  if (!rival || !r) return null;
  const nR = buscar(rival).n, nB = buscar(r).n;
  let veredicto: Veredicto;
  if (rival === r || rival === quitarAcento(x.lema)) veredicto = 'HOMÓGRAFO';
  else if (revisarOrtografiaRu(rival).length) veredicto = 'EVIDENCIA';
  else if (nR === 0 && nB > 0) veredicto = 'EVIDENCIA';
  else if (nR === 0) veredicto = 'NULO VACÍO';
  else if (!LECTURA_RIVAL[rival]) veredicto = 'ROJO';
  else veredicto = 'TAREA DE LECTURA';
  return { rival, nR, nB, veredicto };
}

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS, CON NÚMERO Y DENOMINADOR PREDICHOS ANTES DE CORRER
// ══════════════════════════════════════════════════════════════════════
// ⚠ Las predicciones se escribieron a mano, ítem por ítem, antes de la
// primera corrida, y no se tocan: si una no coincide, la tabla lo imprime y
// la explicación va en un comentario junto a la ruta.
//
// ★ EL TEOREMA DEL §48: dentro de un par todo es constante salvo el lema y la
// glosa, y las dos respuestas tienen desinencias distintas (G12) salvo en el
// par 4, donde las dos son Ø y difieren en la vocal. Toda ruta cuya COLA no
// dependa del lema ni de la glosa acierta como mucho uno por par: ≤ 6. (⚠
// «que no lea el lema» era falso: pegan la cola AL TEMA, discutible 7.) La de la GLOSA no
// está acotada, y se corre.
export interface Vista { s: string; pista: string; lema: string; genero: GeneroRu; glosa: string }
export function vista(x: ClozeGenRu): Vista | null {
  const n = entradaNom(x);
  return n ? { s: frase(x), pista: x.pista, lema: x.lema, genero: n.genero, glosa: n.glosa } : null;
}
export interface Ruta { nombre: string; porQue: string; predicho: number; aplicablesPredicho: number; correr: (v: Vista) => string | null }

const COLAS = ['ов', 'ей', ''] as const;
const aciertaCon = (x: ClozeGenRu, s: string) => respuestaDe(x) === s;
export function barridoPorClase(items: ClozeGenRu[], clase: (x: ClozeGenRu) => string): { clase: string; cola: string; aciertos: number; n: number }[] {
  const cl = new Map<string, ClozeGenRu[]>();
  for (const x of items) cl.set(clase(x), [...(cl.get(clase(x)) ?? []), x]);
  return [...cl].map(([k, xs]) => {
    const m = COLAS.map((c) => ({ c, n: xs.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length })).sort((p, q) => q.n - p.n)[0]!;
    return { clase: k, cola: m.c, aciertos: m.n, n: xs.length };
  });
}
const mapa = (clase: (x: ClozeGenRu) => string) => new Map(barridoPorClase(ITEMS, clase).map((r) => [r.clase, r.cola]));
const colaFija = () => COLAS.map((c) => ({ c, n: ITEMS.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length })).sort((p, q) => q.n - p.n)[0]!;
// Parte también por `;` (dictamen del 2026-09-23): una glosa «mapa; naipe»
// daba el token «mapa;» y una clase fantasma de tamaño 1 que la ruta memoriza.
export const claseDeGlosa = (g: string) => (g.split(/[ ,;]+/)[0] ?? '').slice(-1);
const E = (v: Vista) => NOM.get(v.lema)!;

export const ESTRATEGIAS: Ruta[] = [
  { nombre: 'copiar-el-lema', predicho: 0, aplicablesPredicho: 12,
    porQue: 'La cadena que el estímulo entrega. Ninguna respuesta es el lema (G7); su `aplicables` 12 es el control de que la ruta corre.',
    correr: (v) => v.lema },
  { nombre: 'una-cola-fija-al-tema', predicho: 4, aplicablesPredicho: 12,
    porQue: '★ EL TECHO 1/k. Una sola desinencia pegada al tema en los doce huecos, la mejor de las tres (máximo buscado, barrido impreso). Con 4/4/4 el techo es 4 = 1/k, y G13 lo impone. Pegada al tema: -ов da 4, -ей da 3 (людей no sale de человек), Ø da 3 (окон no sale de окн).',
    correr: (v) => temaDelLema(v.lema) + colaFija().c },
  { nombre: 'el-genero-de-la-pista · LA REGLA POR GÉNERO', predicho: 6, aplicablesPredicho: 12,
    porQue: '★ LA REGLA QUE EL ALUMNO TRAE (ver la cabecera): la pista escribe el género y el barrido elige una cola por género — sale m → -ов, f → Ø (o -ей, empate), n → Ø, que es la regla de manual por género. ACOTADA por el teorema: los pares son de un género, así que ≤ 1 por par = 6, y 6 es el techo que alcanza. Su valor es que su 6 son exactamente los -ов y dos Ø: falla todos los -ей y мужчин.',
    correr: (v) => { const c = mapa((x) => entradaNom(x)?.genero ?? '?').get(v.genero); return c === undefined ? null : temaDelLema(v.lema) + c; } },
  { nombre: 'la-glosa-española · última letra', predicho: 6, aplicablesPredicho: 12,
    porQue: 'LA RUTA POR LA GLOSA, NO acotada por el teorema: mapea la última letra de la primera palabra de la glosa a la mejor cola (máximo buscado sobre cinco clases y doce ítems, o sea sobreajuste garantizado). Predicho a mano: -a 1 de 5, -o 2 de 3 (caballo, compañero → -ей), -e 1 de 2, -r 1 de 1, -d 1 de 1 = 6. Si pasara de la mitad no diría que la glosa contesta: diría que un mapa elegido sobre doce ítems los memoriza.',
    correr: (v) => { const c = mapa((x) => claseDeGlosa(entradaNom(x)?.glosa ?? '')).get(claseDeGlosa(v.glosa)); return c === undefined ? null : temaDelLema(v.lema) + c; } },
];

export const PERFILES: Ruta[] = [
  { nombre: 'por-genero-y-tema', predicho: 8, aplicablesPredicho: 12,
    porQue: 'El alumno que sabe duro/blando y la 3.ª declinación pero lee el GÉNERO donde manda la declinación y no sabe la sibilante, la vocal de apoyo ni el tema de plural. Tiene que fallar exactamente las cuatro fronteras menos una y el distractor de la vocal: 4 (товарищ), 6 (мужчина), 8 (окно), 12 (человек).',
    correr: (v) => SOBREAPLICADA['el-masculino-hace-ов'](E(v)) },
  { nombre: 'la-regla-sobre-el-lema', predicho: 10, aplicablesPredicho: 12,
    porQue: 'Declinación, tema y sibilante, sin ninguna lista: falla sólo lo que es LÉXICO — окон (8) y людей (12).',
    correr: (v) => reglaSobreElLema(v.lema, v.genero, E(v).tema) },
  { nombre: 'la-regla-con-vocal-de-apoyo-general', predicho: 9, aplicablesPredicho: 12,
    porQue: 'La anterior más «grupo final ⇒ vocal», la regla que la frontera 3 sobreaplica. Acierta окон y falla мест (7) y карт (9), además de людей (12). ⚠ Que falle también карт es el dato: la sobreaplicación de la vocal no sólo muerde en la frontera declarada, muerde en el par 5, que NO la declara porque su eje es otro.',
    correr: (v) => SOBREAPLICADA['el-grupo-final-pide-vocal'](E(v)) },
  { nombre: 'el-contagio-del-par', predicho: 1, aplicablesPredicho: 12,
    porQue: 'LA RUTA QUE LOS DOS LINGÜISTAS ANTERIORES PIDIERON Y NINGÚN FICHERO TENÍA (discutible 10 del lote 4, 16 del lote 5): pegar al propio tema la desinencia de la pareja de par. Como G12 exige desinencias distintas, sólo puede acertar en el par 4, donde las dos son Ø: acierta мест y falla окн. Predicho 1.',
    // ⚠ La v0 llamaba a `rivalDe`, que para una FRONTERA devuelve la regla
    // sobreaplicada y no el contagio: dio 0 contra 1 predicho, y el que faltaba
    // era мест, frontera. Nombre ≠ código por segunda vez en la misma corrida.
    correr: (v) => {
      const x = ITEMS.find((y) => y.lema === v.lema)!, pj = ITEMS.find((y) => y !== x && y.par === x.par)!;
      const d = desinenciaDe(respuestaDe(pj)!, pj.lema), t = temaDelLema(v.lema);
      return d === 'Ø' ? (E(v).tema === 'duro' ? t : t + 'ь') : t + d;
    } },
  { nombre: 'el-paradigma-entero · CONTROL DEL APARATO', predicho: 12, aplicablesPredicho: 12,
    porQue: '⚠ NO ES UNA RUTA DEL ALUMNO. Tiene que dar 12/12, y su 12/12 NO autoriza a leer la tabla: lo autoriza `controlDelAparato()` sobre los 42 lemas (§47).',
    correr: (v) => reglaDeManual(v.lema, v.genero, E(v).tema) },
];

// ★ LA RUTA POR LECTURA. Los seis regentes rigen UN caso (§25.1), así que el
// bigrama devolvería la casilla… salvo el NÚMERO, que sólo fijan tres marcos.
// El prefijo es el tema del lema y excluye por construcción `окон` y `людей`
// (A-1 del lote 2, aplicado de entrada).
const colocacionDespuesDe = (anterior: string, prefijo: string): string | null => {
  const re = new RegExp(`${INI}${anterior}\\s+(${prefijo}\\p{L}*)${FIN}`, 'giu');
  const cuenta = new Map<string, number>();
  for (const m of corpus().matchAll(re)) { const w = m[1]!.toLowerCase(); cuenta.set(w, (cuenta.get(w) ?? 0) + 1); }
  if (!cuenta.size) return null;
  return [...cuenta].sort((a, b) => b[1] - a[1])[0]![0];
};
export const RUTAS_POR_LECTURA: Ruta[] = [
  { nombre: 'memoria-colocacional-sin-el-lema', predicho: 0, aplicablesPredicho: 12,
    porQue: 'La palabra más frecuente detrás del regente, sin mirar el lema. Acotada por el teorema; dice si el marco solo entrega alguna respuesta.',
    correr: (v) => colocacionDespuesDe(regente(v.s), '') },
  { nombre: 'memoria-colocacional-con-el-tema', predicho: 3, aplicablesPredicho: 10,
    porQue: 'La palabra más frecuente detrás del regente entre las que empiezan por el TEMA del lema. Predicho a mano: acierta товарищей (от товарищей 11), мальчиков y мужчин (из), y devuelve el SINGULAR en около/от/сколько donde el número no lo fija la lengua; sin candidato en окн- y en вещ- tras среди.',
    // ★ ACIERTOS 3 COMO SE PREDIJO, APLICABLES 7 Y NO 10, y se LEYÓ antes de
    // escribir nada (§52.1). Los tres aciertos son los predichos (товарищей,
    // мальчиков, мужчин). Los cuatro fallos aplicables devuelven el SINGULAR
    // donde el número no lo fija la lengua (стола tras около, города y
    // человека tras от) y otra palabra con el prefijo (конюшни). Los cinco
    // `null` caen en `сколько` y `среди` (y `от студент-`), no en «los marcos
    // que fijan el plural» como decía la v0 (`среди` no lo fija, E2):
    // `сколько мест-`, `сколько окн-` (excluido por construcción), `среди
    // карт-`, `среди вещ-` y `от студент-` no aparecen nunca. O sea que yo
    // había supuesto densidad donde el cuantificador y `среди` no la tienen:
    // la sexta posición de la escala del §33.4 es «el marco fija el número y
    // el bigrama no existe», y ahí la ruta ni siquiera arranca.
    correr: (v) => colocacionDespuesDe(regente(v.s), temaDelLema(v.lema)) },
];

// ══════════════════════════════════════════════════════════════════════
// EL CONTROL POSITIVO: LAS FORMAS QUE EL LOTE NO DEBE PRODUCIR
// ══════════════════════════════════════════════════════════════════════
// Sólo formas que no son palabra de ningún lema: `местов` (9) y `человеков`
// (11) NO están, por la razón escrita en LECTURA_RIVAL (el `*лесы` del §35:
// la frecuencia las «rechazaría» por la razón equivocada).
export const FALSAS_DEL_LOTE: { mala: string; buena: string; porQue: string }[] = [
  { mala: 'столей', buena: 'столов', porQue: 'la cola blanda sobre el tema duro del par 1' },
  { mala: 'конов', buena: 'коней', porQue: 'y su simétrica' },
  { mala: 'товарищов', buena: 'товарищей', porQue: 'el error diana de la frontera 1: -ов tras sibilante' },
  { mala: 'мужчинов', buena: 'мужчин', porQue: 'el error diana de la frontera 2: el género en vez de la declinación' },
  { mala: 'месот', buena: 'мест', porQue: 'el error diana de la frontera 3: la vocal de apoyo donde no va' },
  { mala: 'окн', buena: 'окон', porQue: 'su simétrica: Ø sin la vocal que sí va' },
  { mala: 'карот', buena: 'карт', porQue: 'el ejemplo del propio inventario (§0.6), que la ruta de la vocal general produce en el par 5' },
  { mala: 'вещ', buena: 'вещей', porQue: 'la 3.ª declinación leída como la 1.ª DURA (Ø). ⚠ La v0 decía «como la 1.ª»: la 1.ª blanda daría вещь, que es el lema (discutible 9)' },
];
export function veredictoFalsa(mala: string, buena: string): { rechaza: boolean; via: string; detalle: string } {
  const orto = revisarOrtografiaRu(mala);
  if (orto.length) return { rechaza: true, via: 'ortografia', detalle: `${orto[0]!.clase} en «${orto[0]!.palabra}»` };
  const nm = buscar(mala).n, nb = buscar(buena).n;
  if (nm < nb) return { rechaza: true, via: 'corpus', detalle: `«${mala}» ${nm} < «${buena}» ${nb}` };
  return { rechaza: false, via: '—', detalle: `«${mala}» ${nm} ≥ «${buena}» ${nb}` };
}

export interface Informe { nombre: string; aciertos: number; n: number; aplicables: number; predicho: number; aplicablesPredicho: number; cuales: number[] }
/** Acierta si y sólo si la TARJETA la daría por buena. */
export function correr(items: ClozeGenRu[], rutas: Ruta[]): Informe[] {
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

if (/[/\\]cloze-ru-a2b\.ts$/.test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  v.push(...fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, s: frase(x), answer: respuestaDe(x), alt: alternativasDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Cloze derivado RU-A2B — ${ITEMS.length} ítems de ${P}\n`);
  console.log('| # | lema | g | decl | tema | respuesta | des | clase | regente+resp | rival | veredicto | par · eje |');
  console.log('|--:|---|---|---|---|---|---|---|--:|---|---|---|');
  for (const [i, x] of ITEMS.entries()) {
    const n = entradaNom(x)!, r = respuestaDe(x)!;
    const col = buscar(`${regente(frase(x))} ${r}`).n;
    const vr = veredictoRival(x);
    console.log(`| ${i + 1} | ${x.lema} | ${n.genero} | ${declinacionManual(x.lema, n.genero)} | ${n.tema} | **${r}** | ${desinenciaDe(r, x.lema)} | ${claseDe(n, r)} | ${col} | ${vr ? `${vr.rival} ${vr.nR}/${vr.nB}` : '—'} | ${vr?.veredicto ?? '—'} | ${x.par} · ${x.eje}${x.frontera ? ` · FRONTERA ${x.frontera.regla}` : ''} |`);
  }
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${frase(x)}  → **${respuestaDe(x)}**  · ${x.pista}`);
  const tablaRutas = (titulo: string, rutas: Ruta[], tope: boolean) => {
    console.log(`\n## ${titulo}\n`);
    console.log('| ruta | predicho | observado | % | aplicables (pred.) | ítems que acierta |');
    console.log('|---|--:|--:|--:|--:|---|');
    for (const r of correr(ITEMS, rutas)) {
      const mal = r.aciertos !== r.predicho ? ' ⚠ NO COINCIDE' : '';
      const malA = r.aplicables !== r.aplicablesPredicho ? ' ⚠' : '';
      const sobre = tope && r.aciertos / r.n > 0.5 ? ' ⚠ POR ENCIMA DEL TOPE' : '';
      console.log(`| \`${r.nombre}\` | ${r.predicho} | ${r.aciertos}/${r.n}${mal} | ${Math.round((100 * r.aciertos) / r.n)}%${sobre} | ${r.aplicables} (${r.aplicablesPredicho})${malA} | ${r.cuales.join(' ')} |`);
    }
  };
  tablaRutas('Estrategias CIEGAS (tope: la mitad; la cola fija, 1/k; la de la glosa NO acotada)', ESTRATEGIAS, true);
  tablaRutas('PERFILES de conocimiento parcial (sin tope)', PERFILES, false);
  tablaRutas('RUTAS POR LECTURA', RUTAS_POR_LECTURA, false);
  const fija = correr(ITEMS, ESTRATEGIAS).find((r) => r.nombre === 'una-cola-fija-al-tema')!;
  if (fija.aciertos > Math.ceil(ITEMS.length / 3)) { console.log(`⚠ LA COLA FIJA PASA DEL TECHO 1/k: ${fija.aciertos}`); process.exitCode = 1; }
  const disc = controlDelAparato();
  const ctl = correr(ITEMS, PERFILES).find((r) => r.nombre.startsWith('el-paradigma-entero'))!;
  console.log(`\n★ CONTROL DEL APARATO — ${NOMBRES_A1.length} lemas × 1 casilla: ${disc.length} discrepancias; la ruta del paradigma entero: ${ctl.aciertos}/${ITEMS.length}.`);
  for (const d of disc) console.log(`  ✗ ${d}`);
  if (disc.length || ctl.aciertos !== ITEMS.length) console.log('⚠ LA REGLA DE MANUAL NO REPRODUCE LA MÁQUINA: los números de PERFILES son de un aparato roto.');
  console.log('\n## Los MÁXIMOS BUSCADOS, con su barrido entero (§4.36)\n');
  console.log(`cola fija: ${COLAS.map((c) => `-${c || 'Ø'}:${ITEMS.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length}`).join(' ')}`);
  for (const [nombre, f] of [['género', (x: ClozeGenRu) => entradaNom(x)?.genero ?? '?'], ['última letra de la glosa', (x: ClozeGenRu) => claseDeGlosa(entradaNom(x)?.glosa ?? '')]] as const) {
    const b = barridoPorClase(ITEMS, f);
    console.log(`${nombre}: ${b.map((r) => `${r.clase}→-${r.cola || 'Ø'} ${r.aciertos}/${r.n}`).join(' · ')}  = ${b.reduce((a, r) => a + r.aciertos, 0)}/${ITEMS.length}`);
  }
  console.log('\n## Los RIVALES, con las cinco salidas\n');
  const vers = ITEMS.map((x) => veredictoRival(x)!);
  for (const k of ['EVIDENCIA', 'NULO VACÍO', 'TAREA DE LECTURA', 'HOMÓGRAFO', 'ROJO'] as Veredicto[]) console.log(`${k}: ${vers.filter((z) => z.veredicto === k).length}`);
  for (const [i, z] of vers.entries()) if (z.veredicto !== 'EVIDENCIA') console.log(`  · ítem ${i + 1} (${ITEMS[i]!.lema}): «${z.rival}» ${z.nR} — ${z.veredicto}${LECTURA_RIVAL[z.rival] ? `: ${LECTURA_RIVAL[z.rival]!.slice(0, 90)}…` : ''}`);
  // HOMÓGRAFO aquí es «el contagio del Ø sobre un masculino duro da el LEMA»:
  // мальчик+Ø = мальчик, вещь+Ø = вещь. Es el nominativo singular, otra casilla
  // del mismo lema, y el corpus no puede separar nada con él.
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
