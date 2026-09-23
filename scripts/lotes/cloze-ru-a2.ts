// scripts/lotes/cloze-ru-a2.ts — EL QUINTO LOTE RUSO y el PRIMERO DE A2.
//
//   npx tsx scripts/lotes/cloze-ru-a2.ts          # gates + tabla + rutas
//   npx tsx scripts/lotes/cloze-ru-a2.ts --json   # ítems para publicar
//
// DOCE ítems de `u5-declinacion-plural` (A2, `paradigma` → cloze con pista,
// piso 8). La respuesta NO se escribe: la deriva `casillaNominal(e, caso, 'pl')`
// desde `lexicon-a1.ts`. El molde es `cloze-ru-a1d.ts` (una casilla por par,
// varias clases de lema, el gate RECALCULA la clase contra una regla de manual).
//
// ══ LA PREGUNTA, HECHA A LA CASILLA Y NO AL TEMA, ANTES DE ESCRIBIR ═══
//
// El punto son TRES casillas —dativo, instrumental y prepositivo plural— y su
// campo `varianza` avisa: «si el lote reparte por caso, añadir -ам/-ами/-ах es
// una operación única disfrazada de tres». Es cierto y es la mitad: en esas tres
// casillas la desinencia NO depende del género ni de la declinación. Lo único
// que la decide es UN bit —el tema del PLURAL, duro o blando— y dos listas.
//
//   · **¿Qué parte es gratis, del español de México y del portugués C2?** De
//     las desinencias, nada. Pero **la uniformidad sí es gratis como IDEA**: en
//     las dos lenguas del alumno el plural es una sola marca para los dos
//     géneros (-s), así que «una desinencia para los tres géneros» no le cuesta
//     nada y un lote que variara el género mediría eso. Por eso **los seis pares
//     son de UN solo género cada uno**, y el género no es un eje.
//   · **¿Qué casilla examina un ítem?** Una: la forma de UN caso plural, con el
//     caso dado dos veces (la preposición del marco y la pista).
//   · **¿Qué varía entre los ítems?** El TEMA del plural (duro/blando), leído
//     en cuatro sitios distintos del lema, y las dos listas: el tema de plural
//     supletivo (`друг` → `друзь-`) y el instrumental en `-ьми` (`людьми`).
//   · **¿El vecino DETERMINA la casilla o sólo la acompaña?** (§33.4) En
//     CINCO pares la preposición determina el CASO y **no el número**: `к
//     столу` y `к столам` son los dos dativos, y el número va dado sólo en la
//     pista, en español (el E10 del lote 4 con los ojos abiertos). ⚠ En el par
//     6 NO: `между` con un singular exige coordinación (`между человеком, … и
//     …`, las 3 del corpus), así que en «Между ___ начался спор» el plural lo da
//     el RUSO. La v0 de esta línea decía «el número va dado sólo en la pista» de
//     los doce; lo corrigió el lingüista (E10). El lote tiene así dos posiciones
//     de la escala, no una.
//   · **¿El rival es una cadena DISTINTA de la respuesta?** (§59) NO en dos de
//     doce: `вещь` y `товарищ` salen HOMÓGRAFO, porque u1 cierra la otra rama del
//     tema (*вещям, *товарищях no son escribibles). ⚠ La v0 decía «sí en los
//     doce» con la salida contradiciéndola (E5). Y el veredicto HOMÓGRAFO es un
//     INFORME, no un gate: por eso el error por el que existe el par 4 (*вещям)
//     sólo vive en FALSAS_DEL_LOTE, donde la caza la ortografía — el aparato de
//     rivales no puede generarlo.
//   · **¿Cuánto del instrumento queda fuera del control?** (§47) `Vista` sólo
//     tiene `caso` ∈ {dat, instr, prep} y número implícito plural, así que
//     ninguna ruta alcanza otra casilla: el control corre sobre los 40 lemas ×
//     3 casillas = 120, el 100 % de lo que una ruta puede tocar.
//
// `capas: { examina: 'declinacion', dadas: ['caso', 'genero', 'grafia'] }`.
//   · el CASO va dado por la preposición y por la pista;
//   · el GÉNERO va dado en la pista y es constante dentro de cada par;
//   · la GRAFÍA —la `а` que sustituye a la `я` tras ж ш ч щ, regla de
//     `u1-ortografia-sibilantes`— va dada, y por eso **el par 4 (`дверям` /
//     `вещам`) no discrimina a quien haya hecho el bloque 1**. Está por la otra
//     razón, escrita en su comentario: es la única pareja donde la «regla» que
//     el alumno ve funcionar (-ям para lo blando) FALLA por ortografía.
//
// ══ LO QUE NO ESTÁ AQUÍ, CON SU MOTIVO ══════════════════════════════
//
//   · **Ni el genitivo ni el acusativo plural.** El genitivo es
//     `u5-genitivo-plural` (la casilla cara, punto aparte a propósito) y el
//     acusativo es `u5-animacidad-acusativo`. Con ellos el lote mediría tres
//     puntos.
//   · **Ningún instrumental de la 3.ª declinación.** `дверями` 67 · `дверьми`
//     34, `лошадьми` 101 · `лошадями` 6: DOS formas correctas vivas en esos
//     lemas, y la que gana cambia de lema a lema. Un ítem que exija una
//     suspende a quien escribe la otra (D8). ⚠ Y NO es la clase entera, como
//     decía la v0 (E4 del lingüista): `вещами` 75 · `вещьми` 0, `ночами` 19 ·
//     `ночьми` 0. De los tres lemas de la 3.ª del lexicón sólo `дверь` tiene
//     doblete. G0c cierra la DECLINACIÓN entera A SABIENDAS de que excluye de
//     más: el doblete es léxico, el lexicón no lo marca, y una exclusión por
//     clase no puede olvidar un lema nuevo como sí lo haría una lista.
//   · **`сестра`** (`сёстрам`, ё en el tema de plural: el comparador no pliega
//     la ё, §32) **ni `день`** (`дням`, vocal fugaz: `u13-alternancias-raiz`).
//     G0 y G0b, heredados.
//   · **Ningún adjetivo ni determinante en el marco** que diera el número en
//     ruso: sería `u6-adjetivo-declinado` o `u6-demostrativos`, otra capa.
//
// ══ EL ERROR SIMÉTRICO QUE ESTE LOTE SÍ TIENE: `людями` ESTÁ ATESTADA ═
//
// `людями` sale **4** veces, las cuatro en Chéjov, y su fuente se localizó con
// `grep -l` sobre las lecturas: TRES son habla de personaje — «Не срами меня
// перед людями» (Матвей Саввич citándose, «Бабы»), «обходиться с людями
// простого звания» (el suboficial Пришибеев) y «пренебрегать людями» (el padre
// Христофор, diálogo de «Степь»)— y UNA es narración en primera persona
// («считал их сильными людями», «Рассказ неизвестного человека»). ⚠ La v0 de
// este párrafo decía «habla de una criada» y «las dos últimas son NARRACIÓN»:
// dos lecturas falsas que CONFIRMABAN la tesis y nadie volvió a leer (§A3, E1
// del lingüista). Es la forma analógica que el propio ítem 12 induce, viva en la
// prosa del XIX aunque la norma sea `людьми` 673 (Розенталь; Зализняк: тв.
// людьми). La norma gana y es citable; **no entra en FALSAS_DEL_LOTE** porque
// el veredicto por frecuencia la «rechazaría» (4 < 673) por la razón
// equivocada (el `*лесы` del §35 con el signo cambiado); y la decisión de NO
// aceptarla como alternativa va escrita en el ítem en vez de supuesta.
import fs from 'node:fs';
import path from 'node:path';
import { NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import {
  casillaNominal, declinacionDe, type EntradaNominal, type GeneroRu, type TemaRu,
} from '../../lib/data/languages/ru/paradigma-ru';
import { revisarOrtografiaRu, quitarAcento, variantesSinYo } from '../../lib/lang/ortografia-ru';
import { buscar, corpus, INI, FIN } from '../corpus-ru';
import { candidatasConYo } from '../check-paradigma-ru';

export type CasoOblRu = 'dat' | 'instr' | 'prep';

/** De qué regla es la sobreaplicación un ítem de frontera. Tipo CERRADO, y la
 *  regla declarada se RECALCULA sobre (lema, caso, respuesta):
 *
 *   · `el-oblicuo-se-forma-sobre-el-lema` — el alumno toma el tema del
 *     SINGULAR (`друг-` → *другах) cuando el plural tiene tema propio (`друзь-`,
 *     que además es BLANDO: друзьях). Clase recalculada: `tema-de-plural`.
 *   · `el-instrumental-es-ами-ями` — el tema de plural es el bueno (`люд-`,
 *     que el alumno ya sabe por `люди`) y la desinencia no es la de la tabla:
 *     `-ьми`. Clase recalculada: `desinencia`. */
export type ReglaSobreaplicadaObl = 'el-oblicuo-se-forma-sobre-el-lema' | 'el-instrumental-es-ами-ями';

/** El eje que el PAR contrasta. Se declara y el gate lo RECALCULA. */
export type EjeOblRu =
  | 'tema'            // duro/blando con un tema que no acaba en velar ni sibilante
  | 'tema-velar'      // duro de tema VELAR (su nominativo plural es -и) frente a blando
  | 'grafia'          // los dos blandos; uno acaba en ж ш ч щ y u1 cambia я → а
  | 'tema-de-plural'  // uno de los dos tiene tema de plural propio
  | 'instr-ьми';      // uno de los dos hace el instrumental en -ьми

export interface ClozeOblRu {
  p: string;
  lema: string;
  caso: CasoOblRu;
  /** `___` para el hueco y `{L}` para el lema entre paréntesis detrás. */
  marco: string;
  /** Nombra lo DADO (la casilla y el género); nunca el tema ni la desinencia. */
  pista: string;
  par: string;
  eje: EjeOblRu;
  frontera?: { regla: ReglaSobreaplicadaObl; motivo: string };
  /** La DECISIÓN sobre cada forma rival ATESTADA que el ítem no acepta, POR
   *  RIVAL (E4). G12 exige una entrada por cada rival > 0 — ⚠ la v0 era un solo
   *  `string` y bastaba con que existiera para callar sobre CUALQUIER rival (E3
   *  del lingüista). La LECTURA —qué es la forma— vive en LECTURA_RIVAL; la
   *  DECISIÓN del ítem, aquí. Son dos preguntas y G12 exige las dos. */
  rivalesNoAceptados?: Record<string, string>;
}

const P = 'u5-declinacion-plural';

export const ITEMS: ClozeOblRu[] = [
  // ── PAR 1 · DATIVO, MASCULINO: duro contra blando, sin velar ni sibilante ──
  // `столам` 12 · `коням` 10. Los dos lemas del par del plural nominativo
  // (lote 4), ahora en oblicuo: el alumno los tiene vistos y lo único nuevo es
  // la casilla. `к столам` 1 · `к коням` 2: la colocación existe para los dos.
  { p: P, lema: 'стол', caso: 'dat', par: 'slugi', eje: 'tema',
    marco: 'Слуги подошли к ___ ({L}).', pista: 'mesa — dativo plural · masculino' },
  { p: P, lema: 'конь', caso: 'dat', par: 'slugi', eje: 'tema',
    marco: 'Слуги подошли к ___ ({L}).', pista: 'caballo — dativo plural · masculino' },

  // ── PAR 2 · PREPOSITIVO, FEMENINO: el tema VELAR, y la trampa que deja el lote 4 ──
  // `книгах` 76 · `деревнях` 25. El nominativo plural de los dos acaba en `-и`
  // (книги, деревни), y el lote 4 enseñó que esa `-и` de `книги` sale de un
  // tema DURO por la regla de u1. Quien lea el tema en el nominativo plural
  // escribe *книгях (0), y ésa es la ruta `desde-el-nominativo-plural`.
  { p: P, lema: 'книга', caso: 'prep', par: 'rasskazyvali', eje: 'tema-velar',
    marco: 'Об этом рассказывали в ___ ({L}).', pista: 'libro — prepositivo plural · femenino' },
  { p: P, lema: 'деревня', caso: 'prep', par: 'rasskazyvali', eje: 'tema-velar',
    marco: 'Об этом рассказывали в ___ ({L}).', pista: 'aldea — prepositivo plural · femenino' },

  // ── PAR 3 · INSTRUMENTAL, NEUTRO: duro contra blando ─────────────────
  // `окнами` 211 · `морями` 8. El neutro blando es el único del lexicón
  // (`море`); en nominativo plural su cola `-я` era inescribible (lote 4, §65)
  // y en oblicuo no: `морями` no es homógrafo de ninguna otra casilla.
  // ⚠ LA v0 DEL MARCO ERA «Над ___ кружились чайки» y el lingüista la tumbó
  // (E12, el único ERROR de lengua del dictamen): `кружиться` sitúa el vuelo
  // en UN punto, y no se dan vueltas sobre varios mares a la vez (`над морями`
  // 2, las dos de travesía; `кружились чайки` 0). El plural sólo lo sostenía
  // la pista española. `за окнами` 17 y `за морями` 1 («за морями, за лесами»)
  // son las colocaciones naturales en plural, y `за` rige dos casos.
  { p: P, lema: 'окно', caso: 'instr', par: 'za', eje: 'tema',
    marco: 'За ___ ({L}) начиналась другая жизнь.', pista: 'ventana — instrumental plural · neutro' },
  { p: P, lema: 'море', caso: 'instr', par: 'za', eje: 'tema',
    marco: 'За ___ ({L}) начиналась другая жизнь.', pista: 'mar — instrumental plural · neutro' },

  // ── PAR 4 · DATIVO, 3.ª DECLINACIÓN: los dos blandos, y la GRAFÍA ────
  // `дверям` 185 · `вещам` 16. Los dos son femeninos de la 3.ª y de tema
  // blando; lo único que los separa es que `вещ-` acaba en `щ` y la `я` no se
  // escribe tras ella (u1, capa DADA). O sea que el par NO discrimina a quien
  // haya hecho el bloque 1, y la tabla lo imprime. Está porque es la única
  // pareja donde la regla que el alumno ve funcionar en los otros cinco
  // blandos («blando ⇒ -ям») produce una forma que la ortografía prohíbe
  // (*вещям), y porque `ночам` 295 —el mismo caso— es de las formas más
  // frecuentes del punto por «по ночам».
  { p: P, lema: 'дверь', caso: 'dat', par: 'prikasalsya', eje: 'grafia',
    marco: 'Никто не прикасался к ___ ({L}).', pista: 'puerta — dativo plural · femenino' },
  { p: P, lema: 'вещь', caso: 'dat', par: 'prikasalsya', eje: 'grafia',
    marco: 'Никто не прикасался к ___ ({L}).', pista: 'cosa — dativo plural · femenino' },

  // ── PAR 5 · PREPOSITIVO, MASCULINO: el tema de plural — frontera 1 ───
  // `товарищах` 11 · `друзьях` 10 · `другах` 0.
  { p: P, lema: 'товарищ', caso: 'prep', par: 'vspominal', eje: 'tema-de-plural',
    marco: 'Он часто вспоминал о ___ ({L}).', pista: 'compañero, camarada — prepositivo plural · masculino' },
  { p: P, lema: 'друг', caso: 'prep', par: 'vspominal', eje: 'tema-de-plural',
    marco: 'Он часто вспоминал о ___ ({L}).', pista: 'amigo — prepositivo plural · masculino',
    frontera: {
      regla: 'el-oblicuo-se-forma-sobre-el-lema',
      motivo: 'LA SOBREAPLICACIÓN DE «EL CASO SE PEGA AL TEMA DEL LEMA», que es como se forma TODO el singular y que en el plural sólo vale cuando el plural no tiene tema propio. `друг` lo tiene (друзья, lote 4): el tema de plural es друзь- y además es BLANDO, así que el prepositivo es друзьях (10) y quien pegue la desinencia al lema escribe *другах, que sale CERO veces en 7,7 M de palabras. Su distractor está al lado, en el mismo marco: товарищах, un masculino animado donde el tema del plural SÍ es el del singular. ⚠ Y LO QUE ESTA FRONTERA NO ES: no es transferencia. Ni el español de México ni el portugués tienen casos en que un tema de plural propio se arrastre, así que nada empuja hacia ningún lado; lo que sí trae del portugués es que un plural pueda cambiar la terminación léxicamente (pão/pães, leão/leões, mão/mãos: una LISTA, como la rusa), así que un plural que no sale de la regla no le extraña. Le falta saber que en ruso el tema cambiado SIGUE en los demás casos. ⚠ Y el ítem presupone друзья, que es respuesta publicada del lote 4 (u3-plural-nominativo, prerrequisito de este punto): es lo que hace de esto una frontera y no una adivinanza.',
    } },

  // ── PAR 6 · INSTRUMENTAL, MASCULINO: el -ьми — frontera 2 ─────────────
  // `студентами` 18 · `людьми` 673 · `людями` 4 (LEÍDAS, ver la cabecera) ·
  // `человеками` 8, LEÍDAS con su fuente: 4 tras numeral («двенадцатью
  // человеками» ×2 en Обломов, «пятнадцатью» y «тысячью» en Война и мир), 2
  // predicativas («человеками-то быть тяготимся», Записки из подполья) y **2 son
  // el bigrama de ESTE marco, `между человеками`** (Chéjov, «Корреспондент», en
  // cita irónica; Goncharov, «Обрыв», en boca de Райский). ⚠ La v0 decía «seis
  // tras numeral y dos eclesiásticas»: falso (E2).
  { p: P, lema: 'студент', caso: 'instr', par: 'spor', eje: 'instr-ьми',
    marco: 'Между ___ ({L}) начался спор.', pista: 'estudiante — instrumental plural · masculino' },
  { p: P, lema: 'человек', caso: 'instr', par: 'spor', eje: 'instr-ьми',
    marco: 'Между ___ ({L}) начался спор.', pista: 'persona — instrumental plural · masculino',
    frontera: {
      regla: 'el-instrumental-es-ами-ями',
      motivo: 'LA SOBREAPLICACIÓN DE LA TABLA DEL PROPIO PUNTO: «instrumental -ами/-ями para los tres géneros». El alumno ya sabe люди (lote 4) y su tema люд- es blando, así que la tabla da *людями; la lengua da людьми (673), con la desinencia -ьми que comparten sólo un puñado de lemas (дети → детьми 296, лошадь → лошадьми 101). Su distractor está en el mismo marco: студентами, un masculino animado de persona donde la tabla SÍ acierta. ⚠ Y LO QUE HACE CARA A ESTA FRONTERA: La forma que el error produce NO es un cero. людями sale 4 veces, las cuatro en Chéjov: tres en boca de personajes y una en narración («считал их сильными людями»); la norma de hoy es людьми y es citable, así que el ítem enseña la norma y no acepta людями, y la decisión va en `rivalesNoAceptados`. ⚠ Y la otra forma que un alumno puede escribir —para ESTE alumno la más probable, porque persona → personas es un plural regular—, *человеками, TAMPOCO es un cero: sale 8 veces, cuatro como forma de cómputo tras numeral («с пятнадцатью человеками», donde la norma admite también «пятью людьми»), dos predicativas y DOS en este mismo bigrama, «между человеками» (Chéjov irónico, Goncharov elevado). El alumno la puede leer en este marco exacto: no se acepta porque hoy es arcaica o elevada, y el ítem lo dice en vez de llamarla error de lengua.',
    },
    rivalesNoAceptados: {
      'людями': 'людями 4 (tres en boca de personaje, una en narración de Chéjov) frente a людьми 673. NO se acepta: la norma viva es людьми (Зализняк, тв. мн. людьми), y la forma analógica en -ями es popular en el XIX. Aceptarla convertiría en correcta la sobreaplicación exacta que la frontera mide. La lección b5-l1 avisa de que el alumno la puede leer.',
      'человеками': 'человеками 8, y dos en ESTE bigrama («между человеками», Chéjov irónico y Goncharov elevado). NO se acepta: fuera de la forma de cómputo tras numeral es arcaica o elevada, y el plural de человек es люди/людьми. Se declara que el alumno la puede leer en este marco; no se llama error de lengua.',
    } },
];

// ══════════════════════════════════════════════════════════════════════
// LA DERIVACIÓN, Y NO SE TECLEA
// ══════════════════════════════════════════════════════════════════════
const NOM = new Map(NOMBRES_A1.map((n) => [n.lema, n]));
export function entradaNom(x: ClozeOblRu): EntradaNominal | undefined { return NOM.get(x.lema); }

export function respuestaDe(x: ClozeOblRu): string | null {
  const n = entradaNom(x);
  return n ? casillaNominal(n, x.caso, 'pl') : null;
}
/** CALCULADAS, nunca declaradas a mano. Hoy vacías en los doce: ninguna lleva ё. */
export function alternativasDe(x: ClozeOblRu): string[] {
  const r = respuestaDe(x);
  return r ? variantesSinYo(r) : [];
}
export function frase(x: ClozeOblRu): string { return x.marco.replace('{L}', x.lema); }

/** El REGENTE: la palabra inmediatamente anterior al hueco. */
export function regente(s: string): string {
  const toks = (s.split('___')[0] ?? '').split(/[^\p{L}]+/u).filter(Boolean);
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : '';
}
/** Qué casos rige cada preposición del lote, escrito DESDE LA GRAMÁTICA y
 *  ENTERO, no sólo la casilla que el lote usa: `в` y `о` rigen prepositivo Y
 *  acusativo, `между` instrumental y (arcaico) genitivo; `к` y `над`, uno.
 *  ⚠ La v0 de esta tabla daba a `в`, `о` y `между` sólo el caso del lote, y
 *  con eso el gate aprobaba igual —mira `includes`— pero la tabla afirmaba una
 *  falsedad que la ruta por lectura del §25.1 necesita al revés: con un
 *  regente de DOS casos el bigrama se reparte. Una preposición fuera de la
 *  tabla es rojo: el gate no aprueba lo que no sabe leer. */
export type CasoRegido = CasoOblRu | 'ac' | 'gen';
export const REGENTES: Record<string, CasoRegido[]> = {
  'к': ['dat'], 'над': ['instr'], 'между': ['instr', 'gen'], 'за': ['instr', 'ac'],
  'о': ['prep', 'ac'], 'об': ['prep', 'ac'], 'в': ['prep', 'ac'],
};

const CASO_ES: Record<CasoOblRu, string> = { dat: 'dativo', instr: 'instrumental', prep: 'prepositivo' };
const GENERO_ES: Record<GeneroRu, string> = { m: 'masculino', f: 'femenino', n: 'neutro' };
const sinParentesis = (s: string) => s.replace(/\([^)]*\)/g, ' ');
const PALABRA = (w: string) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu');

// ══════════════════════════════════════════════════════════════════════
// EL SEGUNDO CAMINO: LA REGLA DE MANUAL, ESCRITA A MANO AQUÍ
// ══════════════════════════════════════════════════════════════════════
//
// No se importa de la máquina: una ruta que modela lo que el alumno SABE
// necesita su propia regla para poder estar equivocada, y escrita a mano es un
// segundo camino sobre `casillaNominal` que `controlDelAparato()` compara en
// las 120 casillas (40 lemas × 3 casos), no en las doce del lote.

export const temaDelLema = (lema: string) => quitarAcento(lema).replace(/[аяоеьй]$/, '');
const SIBILANTE = (t: string) => /[жшчщ]$/.test(t);
const VELAR_O_SIBILANTE = (t: string) => /[кгхжшчщ]$/.test(t);
const DES: Record<CasoOblRu, [string, string]> = { dat: ['ам', 'ям'], instr: ['ами', 'ями'], prep: ['ах', 'ях'] };

/** u1 (capa DADA): tras ж ш ч щ la `я` no se escribe, se escribe `а`. */
export const u1 = (tema: string, des: string) => (SIBILANTE(tema) ? des.replace(/^я/, 'а') : des);

/** Los temas de PLURAL que un manual lista lema a lema, con su dureza. */
export const TEMAS_PL_DE_MANUAL: Record<string, [string, TemaRu]> = {
  'друг': ['друзь', 'blando'], 'человек': ['люд', 'blando'],
  'день': ['дн', 'blando'], 'сестра': ['сёстр', 'duro'],
};
/** Las desinencias que no salen de ninguna tabla. */
export const FORMAS_DE_MANUAL: Record<string, Partial<Record<CasoOblRu, string>>> = {
  'человек': { instr: 'людьми' },
};

/** La tabla aplicada a un tema y una dureza dados. */
export const tabla = (tema: string, blando: boolean, caso: CasoOblRu) => tema + u1(tema, DES[caso][blando ? 1 : 0]);
/** La regla SOBRE EL LEMA: el tema del singular y su dureza, sin listas. */
export const reglaSobreElLema = (lema: string, tema: TemaRu, caso: CasoOblRu) => tabla(temaDelLema(lema), tema !== 'duro', caso);
/** La regla del manual entero: la lista de formas, luego el tema de plural, luego la tabla. */
export function reglaDeManual(lema: string, tema: TemaRu, caso: CasoOblRu): string {
  const f = FORMAS_DE_MANUAL[lema]?.[caso];
  if (f) return f;
  const tp = TEMAS_PL_DE_MANUAL[lema];
  return tp ? tabla(tp[0], tp[1] !== 'duro', caso) : reglaSobreElLema(lema, tema, caso);
}

/** ★ EL CONTROL DEL APARATO, con el §47 aplicado de entrada: 40 lemas × 3
 *  casillas, el 100 % de lo que una `Vista` puede alcanzar. Recibe la regla
 *  por PARÁMETRO para poder verse en rojo (B1): el test le pasa una regla
 *  mutada en un lema que ningún ítem toca. */
export function controlDelAparato(manualDe: (l: string, t: TemaRu, c: CasoOblRu) => string = reglaDeManual): string[] {
  const out: string[] = [...controlDeLasTablasDeRuta()];
  for (const e of NOMBRES_A1) for (const c of ['dat', 'instr', 'prep'] as CasoOblRu[]) {
    const maquina = casillaNominal(e, c, 'pl');
    if (maquina === null) { out.push(`${e.lema} ${c}.pl: la máquina no produce forma`); continue; }
    const manual = manualDe(e.lema, e.tema, c);
    if (quitarAcento(manual) !== quitarAcento(maquina)) out.push(`${e.lema} ${c}.pl: el manual da «${manual}» y la máquina «${maquina}»`);
  }
  return out;
}

/** La CLASE del irregular, recalculada contra la regla y no leída del
 *  resultado (§60). ⚠ SU LÍMITE, dicho: lee `TEMAS_PL_DE_MANUAL`, así que una
 *  irregularidad de tema que esa tabla absorba no la ve (E7 del lote 4). */
/** ⚠ La v0 devolvía `desinencia` para TODO lo que no fuera las otras dos —lo
 *  que sobraba, no una clase recalculada— y `claseIrregular(человек, instr,
 *  'zzz')` salía `desinencia` (E6 del lingüista): G16 y G16b aprobaban
 *  cualquier forma basura en el ítem 12. Ahora `desinencia` exige coincidir con
 *  `FORMAS_DE_MANUAL`, y lo que no casa con nada es `ninguna`, que es rojo. */
export type ClaseObl = 'regular' | 'tema-de-plural' | 'desinencia' | 'ninguna';
export function claseIrregular(e: EntradaNominal, caso: CasoOblRu, resp: string): ClaseObl {
  const r = quitarAcento(resp);
  if (r === quitarAcento(reglaSobreElLema(e.lema, e.tema, caso))) return 'regular';
  const tp = TEMAS_PL_DE_MANUAL[e.lema];
  if (tp && r === quitarAcento(tabla(tp[0], tp[1] !== 'duro', caso))) return 'tema-de-plural';
  const f = FORMAS_DE_MANUAL[e.lema]?.[caso];
  if (f && r === quitarAcento(f)) return 'desinencia';
  return 'ninguna';
}

/** La COLA: lo que queda de la respuesta tras el tema del lema. */
export function colaDe(x: ClozeOblRu): string | null {
  const r = respuestaDe(x);
  if (r === null) return null;
  const t = temaDelLema(x.lema), q = quitarAcento(r);
  return q.startsWith(t) ? q.slice(t.length) : q;
}

// ══════════════════════════════════════════════════════════════════════
// LOS GATES
// ══════════════════════════════════════════════════════════════════════
export function verificar(items: ClozeOblRu[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const respuestasVistas = new Map<string, number>();

  for (const [i, x] of items.entries()) {
    const id = `CLRUA2-${String(i + 1).padStart(3, '0')} (${x.lema})`;
    const n = entradaNom(x);
    if (!n) { v.push(`${id}: el lema «${x.lema}» no está en NOMBRES_A1`); continue; }
    if (x.p !== P) v.push(`${id}: el punto es «${x.p}» y este lote es de ${P}`);
    // G0 · la ё en el tema de plural (§32): el comparador no la pliega.
    const tp = n.temaPl ?? TEMAS_PL_DE_MANUAL[x.lema]?.[0];
    if (tp && tp.includes('ё')) v.push(`${id}: el tema de plural «${tp}» lleva ё y el comparador del producto no la pliega (§32)`);
    // G0b · la vocal fugaz es u13-alternancias-raiz.
    if (n.temaOblicuo) v.push(`${id}: «${x.lema}» tiene tema oblicuo «${n.temaOblicuo}» (vocal fugaz) — mediría u13-alternancias-raiz`);
    // G0c · ⚠ EL DOBLETE DEL INSTRUMENTAL DE LA 3.ª DECLINACIÓN, cerrado por la
    //       CLASE y no por una lista: дверями 67 · дверьми 34, лошадьми 101 ·
    //       лошадями 6. Exigir una suspende a quien escribe la otra (D8).
    if (x.caso === 'instr' && declinacionDe(n) === 3)
      v.push(`${id}: instrumental plural de la 3.ª declinación — hay lemas de la clase con doblete -ями/-ьми (дверями 67 · дверьми 34) y el lexicón no los marca, así que se excluye la clase entera (de más a sabiendas: вещами 75 · вещьми 0)`);

    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: casillaNominal devuelve null para ${x.caso}.pl — no se inventa una forma`); continue; }
    const alt = alternativasDe(x);
    const s = frase(x);
    const reg = regente(s);

    // G1 · un hueco y un `{L}`.
    for (const [marca, k] of [['___', s.split('___').length - 1], ['{L}', x.marco.split('{L}').length - 1]] as const)
      if (k !== 1) v.push(`${id}: ${k} «${marca}» en el marco, tiene que haber 1`);
    // G2 · el lema entre paréntesis justo detrás del hueco.
    if (!new RegExp(`___\\s*\\(\\s*${x.lema}\\s*\\)`).test(s)) v.push(`${id}: la frase no nombra el lema «${x.lema}» entre paréntesis justo detrás del hueco`);
    // G3 · la pista: forma canónica, casilla, género, glosa del lexicón, nada del tema.
    const casilla = `${CASO_ES[x.caso]} plural`;
    if (!x.pista.includes(casilla)) v.push(`${id}: la pista no nombra la casilla «${casilla}»`);
    if (!x.pista.includes(GENERO_ES[n.genero])) v.push(`${id}: la pista no nombra el género «${GENERO_ES[n.genero]}»`);
    if (!new RegExp(`^[^—·]+ — (${Object.values(CASO_ES).join('|')}) plural · (${Object.values(GENERO_ES).join('|')})$`).test(x.pista))
      v.push(`${id}: la pista «${x.pista}» no tiene la forma canónica «<glosa> — <caso> plural · <género>»`);
    if (!x.pista.startsWith(`${n.glosa} —`)) v.push(`${id}: la glosa de la pista no es la de NOMBRES_A1 («${n.glosa}»)`);
    if (/(tema|dur[oa]|bland[oa]|clase|velar|sibilante|desinencia|termina|acento|irregul|supletiv|declinaci)/i.test(x.pista))
      v.push(`${id}: la pista nombra el TEMA, la CLASE o la DESINENCIA, que es lo examinado`);
    // G4 · EL REGENTE rige el caso declarado. El caso va dado en la lengua.
    const rige = REGENTES[reg];
    if (!rige) v.push(`${id}: el regente «${reg}» no está en la tabla REGENTES — el gate no aprueba lo que no sabe leer`);
    else if (!rige.includes(x.caso)) v.push(`${id}: el regente «${reg}» rige ${rige.join('/')} y el ítem pide ${x.caso} — el caso dado en la lengua contradice la pista`);
    // G5 · la pista no deletrea la respuesta. G6 · la frase tampoco.
    for (const c of [r, ...alt]) if (PALABRA(quitarAcento(c)).test(x.pista)) v.push(`${id}: la pista deletrea la respuesta «${c}»`);
    if (PALABRA(quitarAcento(r)).test(quitarAcento(sinParentesis(s).replace('___', ' ')))) v.push(`${id}: la respuesta «${r}» ya está escrita en la frase`);
    // G7 · la respuesta no es el lema.
    if (quitarAcento(r) === quitarAcento(x.lema)) v.push(`${id}: la respuesta coincide con el lema`);
    // G8/G9 · la ё, en las dos direcciones. ⚠ G8 NO PUEDE DISPARARSE (E11):
    //   `alternativasDe` es `variantesSinYo`, que devuelve la variante siempre
    //   que hay ё. Queda como guarda contra un cambio de `alternativasDe`, y se
    //   dice en vez de dejarlo en verde para siempre (§66).
    if (r.includes('ё') && alt.length === 0) v.push(`${id}: la respuesta «${r}» lleva ё y no declara la variante sin ё`);
    for (const c of candidatasConYo(r)) v.push(`${id}: la respuesta «${r}» tiene variante con ё atestada («${c.forma}» ${c.n})`);
    // G10 · ortografía y homóglifos en todo lo que el alumno ve.
    for (const [campo, t] of [['frase', s], ['pista', x.pista], ['respuesta', r], ['alternativas', alt.join(' ')]] as const)
      for (const h of revisarOrtografiaRu(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // G11 · la respuesta, atestada.
    if (buscar(quitarAcento(r)).n === 0) v.push(`${id}: la respuesta «${r}» no aparece ni una vez en 7,7 M de palabras`);
    // G12 · ⚠ EL RIVAL ATESTADO QUE EL ÍTEM NO ACEPTA LLEVA SU DECISIÓN EN UN
    //       CAMPO. Si la regla de manual SOBRE EL LEMA o la TABLA sobre el tema
    //       de plural dan una cadena distinta que el corpus trae, callarla es
    //       suspender sin decir por qué a quien la leyó.
    for (const riv of rivalesDe(x)) {
      const k = buscar(quitarAcento(riv)).n;
      if (k === 0) continue;
      if (!LECTURA_RIVAL[quitarAcento(riv)]) v.push(`${id}: el rival «${riv}» sale ${k} veces y LECTURA_RIVAL no dice qué es`);
      if (!x.rivalesNoAceptados?.[quitarAcento(riv)]) v.push(`${id}: el rival «${riv}» sale ${k} veces y el ítem no escribe su decisión en rivalesNoAceptados`);
    }
    const clave = s.replace(/\s+/g, ' ').trim().toLowerCase();
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
    respuestasVistas.set(r, (respuestasVistas.get(r) ?? 0) + 1);
  }
  for (const [r, k] of respuestasVistas) if (k > 1) v.push(`la respuesta «${r}» sale ${k} veces`);
  if (new Set(items.map((x) => x.lema)).size !== items.length) v.push('el lote repite algún lema');

  // G13 · LOS PARES DE MARCO: todo constante salvo el lema — marco, caso y
  //       GÉNERO (la pista lo escribe; con géneros distintos regalaría una
  //       etiqueta que separa las dos respuestas, §63). Aquí no hay excepción.
  const pares = new Map<string, ClozeOblRu[]>();
  for (const x of items) pares.set(x.par, [...(pares.get(x.par) ?? []), x]);
  for (const [k, xs] of pares) {
    if (xs.length !== 2) { v.push(`par «${k}»: ${xs.length} ítems — un par de marco son DOS`); continue; }
    const [a, b] = xs as [ClozeOblRu, ClozeOblRu];
    if (a.marco !== b.marco) v.push(`par «${k}»: los dos marcos no son idénticos`);
    if (a.caso !== b.caso) v.push(`par «${k}»: los dos ítems piden casos distintos (${a.caso}/${b.caso})`);
    if (a.eje !== b.eje) v.push(`par «${k}»: ejes distintos («${a.eje}» / «${b.eje}»)`);
    const ea = entradaNom(a), eb = entradaNom(b), ra = respuestaDe(a), rb = respuestaDe(b);
    if (!ea || !eb || !ra || !rb) continue;
    if (ea.genero !== eb.genero) v.push(`par «${k}»: géneros distintos (${ea.genero}/${eb.genero}) — la pista escribe el género y lo regala`);
    const ca = colaDe(a), cb = colaDe(b);
    if (ca === cb) v.push(`par «${k}»: las dos colas son «-${ca}» — el par no contrasta nada`);
    // G14 · EL EJE SE RECALCULA contra el lexicón.
    const ka = claseIrregular(ea, a.caso, ra), kb = claseIrregular(eb, b.caso, rb);
    const ta = temaDelLema(a.lema), tb = temaDelLema(b.lema);
    const reg = ka === 'regular' && kb === 'regular';
    const duroDe = () => (ea.tema === 'duro' ? ta : tb);
    switch (a.eje) {
      case 'tema':
        if (!reg) v.push(`par «${k}»: eje «tema» con un irregular (${ka}/${kb})`);
        else if (ea.tema === eb.tema) v.push(`par «${k}»: eje «tema» y los dos temas son ${ea.tema}`);
        else if (VELAR_O_SIBILANTE(ta) || VELAR_O_SIBILANTE(tb)) v.push(`par «${k}»: eje «tema» con un tema velar o sibilante — eso es «tema-velar» o «grafia»`);
        break;
      case 'tema-velar':
        if (!reg) v.push(`par «${k}»: eje «tema-velar» con un irregular (${ka}/${kb})`);
        else if (ea.tema === eb.tema) v.push(`par «${k}»: eje «tema-velar» y los dos temas son ${ea.tema}`);
        else if (!/[кгх]$/.test(duroDe())) v.push(`par «${k}»: eje «tema-velar» y el lema duro no acaba en velar — no hay nominativo plural en -и que engañe`);
        break;
      case 'grafia':
        if (!reg) v.push(`par «${k}»: eje «grafia» con un irregular (${ka}/${kb})`);
        else if (ea.tema !== eb.tema || ea.tema === 'duro') v.push(`par «${k}»: eje «grafia» exige dos temas BLANDOS (${ea.tema}/${eb.tema}) — u1 sólo toca la я`);
        else if (SIBILANTE(ta) === SIBILANTE(tb)) v.push(`par «${k}»: eje «grafia» y los dos temas son ${SIBILANTE(ta) ? '' : 'no '}sibilantes — u1 no separa nada`);
        break;
      case 'tema-de-plural':
        if ([ka, kb].filter((z) => z === 'tema-de-plural').length !== 1 || ![ka, kb].includes('regular'))
          v.push(`par «${k}»: eje «tema-de-plural» y las clases recalculadas son ${ka}/${kb}`);
        break;
      case 'instr-ьми':
        if (a.caso !== 'instr') v.push(`par «${k}»: eje «instr-ьми» en ${a.caso}`);
        else if ([ka, kb].filter((z) => z === 'desinencia').length !== 1 || ![ka, kb].includes('regular') || ![ra, rb].some((z) => z.endsWith('ьми')))
          v.push(`par «${k}»: eje «instr-ьми» y las clases/respuestas son ${ka}/${kb} (${ra}/${rb})`);
        break;
    }
  }
  // G15 · VARIANZA. Tres casos presentes y ninguno con más de la mitad; al
  //       menos cuatro ejes; y el LADO: lo duro y lo blando repartidos (D6).
  const casos = new Map<CasoOblRu, number>();
  for (const x of items) casos.set(x.caso, (casos.get(x.caso) ?? 0) + 1);
  if (casos.size !== 3) v.push(`el lote usa ${casos.size} de los tres casos del punto`);
  for (const [c, k] of casos) if (k > items.length / 2) v.push(`el caso ${c} ocupa ${k} de ${items.length} ítems`);
  if (new Set(items.map((x) => x.eje)).size < 4) v.push('menos de cuatro ejes distintos');
  // ⚠ El lado se mide en la VOCAL de la desinencia de la respuesta, no en la
  //   cola impresa: la v0 cazaba `друзьях` con una regex por accidente
  //   (discutible 17). `вещам` cuenta en -а- aunque su tema sea blando: el lado
  //   es lo que el alumno ESCRIBE.
  const vocal = (x: ClozeOblRu) => (respuestaDe(x) ?? '').match(/([ая])(м|ми|х)$/)?.[1];
  const ladoA = items.filter((x) => vocal(x) === 'а').length;
  const ladoYa = items.filter((x) => vocal(x) === 'я').length;
  if (Math.min(ladoA, ladoYa) < items.length / 3) v.push(`el lote está de un solo lado: ${ladoA} en -а- y ${ladoYa} en -я- (D6)`);

  // G16 · LAS FRONTERAS: regla recalculada, sin repetir, con motivo y con su
  //       DISTRACTOR ALCANZABLE en el propio par (D7).
  const ESPERADA: Record<ReglaSobreaplicadaObl, ClaseObl> = {
    'el-oblicuo-se-forma-sobre-el-lema': 'tema-de-plural',
    'el-instrumental-es-ами-ями': 'desinencia',
  };
  const fr = items.filter((x) => x.frontera);
  if (fr.length === 0) v.push('el lote no declara ninguna frontera (§0.6)');
  const reglas = new Set<string>();
  for (const x of fr) {
    const f = x.frontera!;
    if (reglas.has(f.regla)) v.push(`${x.lema}: dos fronteras sobreaplican «${f.regla}»`);
    reglas.add(f.regla);
    if (f.motivo.length < 120) v.push(`${x.lema}: el motivo de la frontera es demasiado corto`);
    const n = entradaNom(x), r = respuestaDe(x);
    if (!n || !r) continue;
    const k = claseIrregular(n, x.caso, r);
    if (k !== ESPERADA[f.regla]) v.push(`${x.lema}: declara «${f.regla}», que pide clase «${ESPERADA[f.regla]}», y la recalculada es «${k}»`);
    const pj = items.find((y) => y !== x && y.par === x.par);
    const np = pj && entradaNom(pj), rp = pj && respuestaDe(pj);
    if (!pj || !np || !rp || claseIrregular(np, pj.caso, rp) !== 'regular')
      v.push(`${x.lema}: frontera sin distractor alcanzable en su par — la pareja tiene que ser regular`);
  }
  // G16b · ningún irregular sin frontera.
  for (const x of items) {
    const n = entradaNom(x), r = respuestaDe(x);
    if (n && r && claseIrregular(n, x.caso, r) !== 'regular' && !x.frontera)
      v.push(`${x.lema}: «${r}» es irregular (${claseIrregular(n, x.caso, r)}) y el ítem no declara frontera`);
  }
  // G17 · ninguna palabra de un marco es respuesta de otro ítem.
  const resp = new Map<string, string>();
  for (const x of items) { const r = respuestaDe(x); if (r) resp.set(quitarAcento(r).toLowerCase(), x.lema); }
  for (const x of items)
    for (const w of sinParentesis(frase(x)).replace('___', ' ').split(/[^\p{L}]+/u).filter((t) => t.length >= 3)) {
      const d = resp.get(quitarAcento(w).toLowerCase());
      if (d) v.push(`${x.lema}: el marco contiene «${w}», que es la RESPUESTA del ítem de «${d}»`);
    }
  return v;
}

// G18 · LA FUGA CONTRA LO YA PUBLICADO, con la exclusión POR IDENTIDAD (§51).
export function fugaContraLoPublicado(items: ClozeOblRu[], dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
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
/** Los rivales de un ítem: lo que la regla SOBRE EL LEMA da y, para un regular,
 *  la OTRA rama del tema (la hipótesis que compite sobre el mismo lema), más,
 *  si hay tema de plural, la tabla sobre él. Todos DISTINTOS de la respuesta. */
export function rivalesDe(x: ClozeOblRu): string[] {
  const n = entradaNom(x), r = respuestaDe(x);
  if (!n || !r) return [];
  const out = new Set<string>();
  const sobreLema = reglaSobreElLema(x.lema, n.tema, x.caso);
  out.add(sobreLema);
  const t = temaDelLema(x.lema);
  out.add(tabla(t, n.tema === 'duro', x.caso));   // la otra rama del tema
  const tp = TEMAS_PL_DE_MANUAL[x.lema];
  if (tp) out.add(tabla(tp[0], tp[1] !== 'duro', x.caso));
  return [...out].filter((z) => quitarAcento(z) !== quitarAcento(r));
}
/** El rival PRINCIPAL: el error que el ítem induce. */
export function rivalDe(x: ClozeOblRu): string | null {
  const n = entradaNom(x), r = respuestaDe(x);
  if (!n || !r) return null;
  const tp = TEMAS_PL_DE_MANUAL[x.lema];
  // Para la frontera del -ьми el rival principal es la TABLA sobre el tema de
  // plural (*людями), no la regla sobre el lema (*человеками, en INSTRUMENTAL:
  // la v0 de este comentario escribía *человеках, que es prepositivo, E7). ⚠ Y
  // es DISCUTIBLE (nº 5): para este alumno el error más probable es
  // *человеками. Los dos están en `rivalesDe` y los dos llevan decisión.
  if (FORMAS_DE_MANUAL[x.lema]?.[x.caso] && tp) return tabla(tp[0], tp[1] !== 'duro', x.caso);
  const sobreLema = reglaSobreElLema(x.lema, n.tema, x.caso);
  if (quitarAcento(sobreLema) !== quitarAcento(r)) return sobreLema;
  return tabla(temaDelLema(x.lema), n.tema === 'duro', x.caso);
}
export const LECTURA_RIVAL: Record<string, string> = {
  'людями': 'ATESTADA 4 VECES, las cuatro en Chéjov y localizadas con grep -l sobre las lecturas: tres en boca de personaje —«Не срами меня перед людями» (Матвей Саввич, «Бабы»), «обходиться с людями простого звания» (Пришибеев), «пренебрегать людями» (el padre Христофор, «Степь»)— y una en narración en primera persona («считал их сильными людями», «Рассказ неизвестного человека»). Forma analógica popular del XIX frente a людьми 673; la norma (Зализняк) es людьми. ⚠ La v0 de esta lectura decía «habla de una criada» y «dos en narración»: falsa (E1 del lingüista)',
  'человеками': 'ATESTADA 8 VECES: 4 tras numeral («двенадцатью человеками» ×2, Обломов; «пятнадцатью», «тысячью», Война и мир), 2 predicativas («человеками-то быть тяготимся», Записки из подполья) y 2 en el bigrama «между человеками» (Chéjov, «Корреспондент», cita irónica; Goncharov, «Обрыв», Райский en tono elevado). Forma arcaica o elevada fuera del cómputo tras numeral. ⚠ La v0 decía «seis tras numeral y dos eclesiásticas»: falsa (E2)',
};
export type Veredicto = 'EVIDENCIA' | 'NULO VACÍO' | 'TAREA DE LECTURA' | 'HOMÓGRAFO' | 'ROJO';
export function veredictoRival(x: ClozeOblRu): { rival: string; nR: number; nB: number; veredicto: Veredicto } | null {
  const rival = rivalDe(x), r = respuestaDe(x);
  if (!rival || !r) return null;
  const nR = buscar(quitarAcento(rival)).n, nB = buscar(quitarAcento(r)).n;
  let veredicto: Veredicto;
  if (quitarAcento(rival) === quitarAcento(r)) veredicto = 'HOMÓGRAFO';
  else if (revisarOrtografiaRu(rival).length) veredicto = 'EVIDENCIA';   // la cadena ni siquiera es escribible
  else if (nR === 0 && nB > 0) veredicto = 'EVIDENCIA';
  else if (nR === 0 && nB === 0) veredicto = 'NULO VACÍO';
  else if (!LECTURA_RIVAL[quitarAcento(rival)]) veredicto = 'ROJO';
  else veredicto = 'TAREA DE LECTURA';
  return { rival, nR, nB, veredicto };
}

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS, CON NÚMERO Y DENOMINADOR PREDICHOS ANTES DE CORRER
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ LAS PREDICCIONES SE ESCRIBIERON A MANO, ÍTEM POR ÍTEM, ANTES DE LA PRIMERA
// CORRIDA, y no se tocan después: si una no coincide, la tabla lo imprime y la
// explicación va en el `porQue`, no en el número.
//
// ★ EL TEOREMA DEL §48, Y DÓNDE NO VALE. Dentro de un par el marco, el caso, el
// regente, el género y la pista SALVO LA GLOSA son idénticos; toda ruta que no
// lea el lema NI LA GLOSA acierta como mucho uno de cada par: ≤ 6. **Una ruta
// que lee la GLOSA no está acotada** (E8 del lote 4), y por eso se corre una.
export interface Vista {
  s: string;
  pista: string;
  lema: string;
  genero: GeneroRu;
  /** El caso, que la pista y el regente dan. NO hay campo `num`: el número es
   *  plural en los doce, y una ruta no puede nombrar otra casilla. */
  caso: CasoOblRu;
  /** La glosa española, que la pista escribe. Es propiedad del lema. */
  glosa: string;
}
export function vista(x: ClozeOblRu): Vista | null {
  const n = entradaNom(x);
  return n ? { s: frase(x), pista: x.pista, lema: x.lema, genero: n.genero, caso: x.caso, glosa: n.glosa } : null;
}
export interface Ruta { nombre: string; porQue: string; predicho: number; aplicablesPredicho: number; correr: (v: Vista) => string | null }

const aciertaCon = (x: ClozeOblRu, s: string) => { const r = respuestaDe(x); return r !== null && quitarAcento(r) === quitarAcento(s); };
const COLAS = ['ам', 'ям', 'ами', 'ями', 'ах', 'ях'];
/** Barrido de un MÁXIMO BUSCADO: para cada clase, la cola que más acierta
 *  pegada al tema del lema. Se imprime entero (§4.36). */
export function barridoPorClase(items: ClozeOblRu[], clase: (x: ClozeOblRu) => string): { clase: string; cola: string; aciertos: number; n: number }[] {
  const cl = new Map<string, ClozeOblRu[]>();
  for (const x of items) cl.set(clase(x), [...(cl.get(clase(x)) ?? []), x]);
  return [...cl].map(([k, xs]) => {
    const m = COLAS.map((c) => ({ c, n: xs.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length })).sort((p, q) => q.n - p.n)[0]!;
    return { clase: k, cola: m.c, aciertos: m.n, n: xs.length };
  });
}
const mapa = (clase: (x: ClozeOblRu) => string) => new Map(barridoPorClase(ITEMS, clase).map((r) => [r.clase, r.cola]));
const colaFija = () => COLAS.map((c) => ({ c, n: ITEMS.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length })).sort((p, q) => q.n - p.n)[0]!;
const primeraPalabra = (g: string) => (g.split(/[ ,;]+/)[0] ?? '');  // `;` también: ver claseDeGlosa de a2b
export const claseDeGlosa = (g: string) => primeraPalabra(g).slice(-1);

export const ESTRATEGIAS: Ruta[] = [
  {
    nombre: 'copiar-el-lema',
    porQue: 'La cadena que el estímulo entrega. Tiene que dar CERO y su `aplicables` 12 es el control de que la ruta corre.',
    predicho: 0, aplicablesPredicho: 12,
    correr: (v) => v.lema,
  },
  {
    nombre: 'una-cola-fija-al-tema',
    porQue: 'Una sola desinencia pegada al tema del lema en los doce huecos, la mejor de las seis (máximo buscado, barrido impreso). Con seis colas repartidas y tres casos, más de 2 diría que el lote repite casilla sin saberlo.',
    predicho: 2, aplicablesPredicho: 12,
    correr: (v) => temaDelLema(v.lema) + colaFija().c,
  },
  {
    nombre: 'el-caso-de-la-pista · LA MITAD DURA',
    porQue: '★ LA RUTA QUE EL PROPIO INVENTARIO ENSEÑA: la `descripcion` de u5-declinacion-plural dice «dativo -ам, instrumental -ами, prepositivo -ах son casi uniformes para los tres géneros», o sea la mitad dura presentada como la tabla. ⚠ La v0 era un máximo buscado y en dativo hay EMPATE -ам 2 / -ям 2: elegía la mitad dura por el ORDEN de un array, no por la descripción (E9). Ahora las tres colas van escritas a mano, las de la descripción. Está ACOTADA POR EL TEOREMA —el caso es constante en el par— y su 6 es exactamente el tope: un acierto por par, siempre el de cola en -а- (no «siempre el duro», como decía la v0: acierta `вещам`, de tema BLANDO, porque u1 le da la misma cola, E8). Que la descripción del punto sea esta ruta es la misma media regla que el §36 del relevo cazó en el objective de b5-l1 y corrigió allí; la descripción del inventario sigue diciéndolo con un «casi» delante.',
    predicho: 6, aplicablesPredicho: 12,
    correr: (v) => temaDelLema(v.lema) + ({ dat: 'ам', instr: 'ами', prep: 'ах' } as const)[v.caso],
  },
  {
    nombre: 'el-genero-de-la-pista',
    porQue: 'La pista escribe el género y los seis pares son de un género cada uno, así que el teorema la acota a uno por par. ⚠ Y SU DENOMINADOR NO ES 12 (discutible 13, el E5 del lote 4 otra vez): con una cola por género y cada género repartido en casos distintos, el techo es 1 por género = 3. Saca 3 de 3, el 100 % de lo que puede sacar. Un máximo buscado alcanza su techo por construcción: su «predicción» es un cálculo.',
    predicho: 3, aplicablesPredicho: 12,
    correr: (v) => { const c = mapa((x) => entradaNom(x)?.genero ?? '?').get(v.genero); return c ? temaDelLema(v.lema) + c : null; },
  },
  {
    nombre: 'la-glosa-española · última letra',
    porQue: '★ LA RUTA POR LA GLOSA, pedida explícitamente y NO acotada por el teorema: la glosa es propiedad del lema y difiere dentro de cada par. Mapea la última letra de la glosa española (médico → o, aldea → a, mar → r…) a la cola que más acierta: máximo buscado sobre cuatro clases y doce ítems, o sea sobreajuste garantizado —la clase «r» tiene UN ítem y acierta por definición—. Se imprime el barrido entero. Si pasara de la mitad no significaría que la glosa conteste: significaría que un mapa de cuatro entradas elegido sobre doce ítems memoriza doce ítems.',
    predicho: 7, aplicablesPredicho: 12,
    // ⚠ PREDICHO 7 Y SALIÓ 6, y el 7 es de OTRO conjunto de ítems: lo calculé a
    // mano cuando el par 1 era `врач`/`учитель` (glosas «médico»/«maestro», dos
    // «o») y no lo rehice al cambiarlo a `стол`/`конь` («mesa»/«caballo»). Es
    // la predicción heredada que el lote 4 ya avisaba que no es un testigo. No
    // se corrige el número: se dice. Leído lo que devuelve, el 6 son cinco
    // ítems de cola en -а- (столам, книгах, вещам —tema blando—, товарищах,
    // студентами) más `морями` por la clase «r» de UN solo ítem (mar); la v0 de
    // esta nota decía «los seis duros salvo окнами» y era falso (E8). La glosa
    // no contesta nada: el máximo buscado memoriza. ⚠ Y esta ruta no puede
    // fallar de forma informativa en ninguna dirección (discutible 14, §G6).
    correr: (v) => { const c = mapa((x) => claseDeGlosa(entradaNom(x)?.glosa ?? '')).get(claseDeGlosa(v.glosa)); return c ? temaDelLema(v.lema) + c : null; },
  },
];

/** El nominativo plural que el alumno YA SABE (u3, prerrequisito), escrito a
 *  mano desde la gramática: la ruta `desde-el-nominativo-plural` lo lee. */
const NOM_PL_DE_MANUAL: Record<string, string> = {
  'стол': 'столы', 'конь': 'кони', 'книга': 'книги', 'деревня': 'деревни', 'окно': 'окна', 'море': 'моря',
  'дверь': 'двери', 'вещь': 'вещи', 'товарищ': 'товарищи', 'друг': 'друзья', 'студент': 'студенты', 'человек': 'люди',
};

export const PERFILES: Ruta[] = [
  {
    nombre: 'la-ultima-letra-del-lema',
    porQue: 'Lee el tema en la letra final del lema (-ь, -й, -я, -е ⇒ blando), aplica la tabla y la regla de u1. No sabe ninguna de las dos listas. Tiene que fallar exactamente las dos fronteras (10, 12).',
    predicho: 10, aplicablesPredicho: 12,
    correr: (v) => tabla(temaDelLema(v.lema), /[ьйяе]$/.test(quitarAcento(v.lema)), v.caso),
  },
  {
    nombre: 'desde-el-nominativo-plural',
    porQue: '★ EL PERFIL QUE EL LOTE 4 DEJA MONTADO. El alumno sabe el nominativo plural (u3) y lee en su última letra la dureza: -ы/-а ⇒ duro, -и/-я ⇒ blando; el tema es el nominativo plural sin esa letra, y u1 encima. Acierta el tema de plural de друзья (друзьях) y falla donde la -и NO es de tema blando sino de la regla velar: книги → *книгях (0 en el corpus). Y falla людьми, porque la tabla da *людями. Predicho 10, fallando 3 y 12.',
    predicho: 10, aplicablesPredicho: 12,
    correr: (v) => { const np = NOM_PL_DE_MANUAL[v.lema]; if (!np) return null; return tabla(np.slice(0, -1), /[ия]$/.test(np), v.caso); },
  },
  {
    nombre: 'la-tabla-sin-el-ьми',
    porQue: 'Sabe el tema de plural de cada lema (las listas) y la tabla, pero no la desinencia -ьми. Tiene que fallar SÓLO el ítem 12: si fallara otro, mi regla de manual estaría rota y el control del aparato lo diría antes.',
    predicho: 11, aplicablesPredicho: 12,
    correr: (v) => { const tp = TEMAS_PL_DE_MANUAL[v.lema]; return tp ? tabla(tp[0], tp[1] !== 'duro', v.caso) : tabla(temaDelLema(v.lema), TEMA_DE_MANUAL[v.lema] !== 'duro', v.caso); },
  },
  {
    nombre: 'el-paradigma-entero · CONTROL DEL APARATO',
    porQue: '⚠ NO ES UNA RUTA DEL ALUMNO. Tiene que dar 12/12, y su 12/12 NO autoriza a leer la tabla: lo autoriza `controlDelAparato()` sobre las 120 casillas (§47).',
    predicho: 12, aplicablesPredicho: 12,
    correr: (v) => reglaDeManual(v.lema, TEMA_DE_MANUAL[v.lema] ?? 'duro', v.caso),
  },
];

/** El tema de cada lema del lote COMO LO TRAERÍA UN MANUAL, a mano. */
const TEMA_DE_MANUAL: Record<string, TemaRu> = {
  'стол': 'duro', 'конь': 'blando', 'книга': 'duro', 'деревня': 'blando', 'окно': 'duro', 'море': 'blando',
  'дверь': 'blando', 'вещь': 'blando', 'товарищ': 'duro', 'друг': 'duro', 'студент': 'duro', 'человек': 'duro',
};

/** ⚠ LAS DOS TABLAS QUE SÓLO LEEN LAS RUTAS, y quedaban FUERA del control del
 *  aparato en la primera versión del fichero (§47 otra vez, cazado antes de
 *  publicar): `NOM_PL_DE_MANUAL` y `TEMA_DE_MANUAL` están escritas a mano para
 *  que las rutas modelen al alumno, y una errata en cualquiera de las dos
 *  movía un perfil sin que nada se pusiera rojo. Se comparan contra el dato
 *  —el nominativo plural de la máquina y el tema del lexicón— en cada ítem. */
export function controlDeLasTablasDeRuta(
  nomPl: Record<string, string> = NOM_PL_DE_MANUAL, temas: Record<string, TemaRu> = TEMA_DE_MANUAL,
): string[] {
  const out: string[] = [];
  for (const x of ITEMS) {
    const e = entradaNom(x);
    if (!e) continue;
    const np = casillaNominal(e, 'nom', 'pl');
    if (!nomPl[x.lema] || quitarAcento(nomPl[x.lema]!) !== quitarAcento(np ?? '')) out.push(`${x.lema}: NOM_PL_DE_MANUAL da «${nomPl[x.lema]}» y la máquina «${np}»`);
    if (temas[x.lema] !== e.tema) out.push(`${x.lema}: TEMA_DE_MANUAL da «${temas[x.lema]}» y el lexicón «${e.tema}»`);
  }
  return out;
}

// ★ LA RUTA POR LECTURA — y la pregunta del §33.4 en su QUINTA posición: el
// vecino es una PREPOSICIÓN QUE FIJA EL CASO Y NO EL NÚMERO. Predicción, escrita
// antes de medir: el bigrama devuelve el SINGULAR, que es mucho más denso (к
// столу frente a к столам), así que la ruta acierta poco aunque la preposición
// determine la casilla a medias. El prefijo es el tema del lema, y excluye por
// construcción `друзьях` y `людьми` (el A-1 del lote 2 aplicado de entrada).
const colocacionDespuesDe = (anterior: string, prefijo: string): string | null => {
  const re = new RegExp(`${INI}${anterior}\\s+(${prefijo}\\p{L}*)${FIN}`, 'giu');
  const cuenta = new Map<string, number>();
  for (const m of corpus().matchAll(re)) { const w = m[1]!.toLowerCase(); cuenta.set(w, (cuenta.get(w) ?? 0) + 1); }
  if (!cuenta.size) return null;
  return [...cuenta].sort((a, b) => b[1] - a[1])[0]![0];
};
export const RUTAS_POR_LECTURA: Ruta[] = [
  {
    nombre: 'memoria-colocacional-sin-el-lema',
    porQue: 'La palabra más frecuente detrás del regente, sin mirar el lema. Acotada por el teorema; su valor es saber si el marco solo entrega alguna respuesta.',
    predicho: 0, aplicablesPredicho: 12,
    correr: (v) => colocacionDespuesDe(regente(v.s), ''),
  },
  {
    nombre: 'memoria-colocacional-con-el-tema',
    porQue: 'La palabra más frecuente detrás del regente entre las que empiezan por el TEMA del lema. Predicho 2 de 12 con aplicables 12: el prefijo del lema casi siempre encuentra ALGO (к концу para кон-, о другом para друг-), y lo que encuentra es sobre todo el singular.',
    predicho: 2, aplicablesPredicho: 12,
    // ★ PREDICHO 2 Y SALIÓ 4, Y SE LEYÓ ANTES DE ESCRIBIR NADA (§52.1). El
    // mecanismo era el predicho: de los ocho fallos, SEIS devuelven el mismo
    // lema en SINGULAR —cuatro en el caso pedido (столу, деревне, двери,
    // человеком) y DOS en ACUSATIVO (окно, море) porque `за` rige dos casos y
    // `за окно` 44 / `за море` 20 ganan al instrumental (§25.1; con la v0 del
    // marco, `над`, devolvía окном/морем)— y dos otra palabra con el mismo
    // prefijo (концу de конец, другом). Lo que la
    // predicción no contó es que acierta justo donde el singular del bigrama es
    // RARO o empata: к вещам 4 · к вещи 0, о товарищах 2 · о товарище 1, между
    // студентами 1, y в книгах 43 contra в книге 42 — un acierto que depende de
    // una aparición. Es la QUINTA posición de la escala del §33.4: el regente
    // fija el caso y no el número, y el número lo decide la DENSIDAD del
    // singular, que no es propiedad del lote.
    correr: (v) => colocacionDespuesDe(regente(v.s), temaDelLema(v.lema)),
  },
];

// ══════════════════════════════════════════════════════════════════════
// EL CONTROL POSITIVO: LAS FORMAS QUE EL LOTE NO DEBE PRODUCIR
// ══════════════════════════════════════════════════════════════════════
// Sólo formas que no son palabra de ningún lema. `людями` (4) y `человеками`
// (8) NO están, por la razón escrita en LECTURA_RIVAL.
export const FALSAS_DEL_LOTE: { mala: string; buena: string; porQue: string }[] = [
  { mala: 'конам', buena: 'коням', porQue: 'la cola dura sobre el tema blando del par 1' },
  { mala: 'столям', buena: 'столам', porQue: 'y su simétrica: la cola blanda sobre el tema duro' },
  { mala: 'книгях', buena: 'книгах', porQue: '★ el error de la ruta `desde-el-nominativo-plural`: leer la -и de книги como tema blando. Ortográficamente escribible, así que la caza el CORPUS' },
  { mala: 'деревнах', buena: 'деревнях', porQue: 'la mitad dura de la tabla sobre un blando: el error que b5-l1 nombra (*деревнам) en otro caso' },
  { mala: 'морами', buena: 'морями', porQue: 'la mitad dura sobre el neutro blando' },
  { mala: 'дверам', buena: 'дверям', porQue: 'la mitad dura sobre la 3.ª declinación' },
  { mala: 'вещям', buena: 'вещам', porQue: 'la я tras щ: la caza la ORTOGRAFÍA (u1), no el corpus' },
  { mala: 'товарищях', buena: 'товарищах', porQue: 'la я tras щ sobre un tema DURO: dos errores a la vez, y la ortografía caza el que se ve' },
  { mala: 'другах', buena: 'друзьях', porQue: 'el error diana de la frontera 1: la desinencia sobre el tema del singular' },
  { mala: 'студентями', buena: 'студентами', porQue: 'la cola blanda sobre el distractor de la frontera 2' },
];
export function veredictoFalsa(mala: string, buena: string): { rechaza: boolean; via: string; detalle: string } {
  const orto = revisarOrtografiaRu(mala);
  if (orto.length) return { rechaza: true, via: 'ortografia', detalle: `${orto[0]!.clase} en «${orto[0]!.palabra}»` };
  const nm = buscar(quitarAcento(mala)).n, nb = buscar(quitarAcento(buena)).n;
  if (nm < nb) return { rechaza: true, via: 'corpus', detalle: `«${mala}» ${nm} < «${buena}» ${nb}` };
  return { rechaza: false, via: '—', detalle: `«${mala}» ${nm} ≥ «${buena}» ${nb}` };
}

export interface Informe { nombre: string; aciertos: number; n: number; aplicables: number; predicho: number; aplicablesPredicho: number; cuales: number[] }
/** Acierta si y sólo si la TARJETA la daría por buena. */
export function correr(items: ClozeOblRu[], rutas: Ruta[]): Informe[] {
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

if (/[/\\]cloze-ru-a2\.ts$/.test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  v.push(...fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, s: frase(x), answer: respuestaDe(x), alt: alternativasDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Cloze derivado RU-A2 — ${ITEMS.length} ítems de ${P}\n`);
  console.log('| # | lema | g | tema | caso | respuesta | cola | clase | regente+resp | rival | veredicto | par · eje |');
  console.log('|--:|---|---|---|---|---|---|---|--:|---|---|---|');
  for (const [i, x] of ITEMS.entries()) {
    const n = entradaNom(x)!, r = respuestaDe(x)!;
    const col = buscar(`${regente(frase(x))} ${quitarAcento(r)}`).n;
    const vr = veredictoRival(x);
    console.log(`| ${i + 1} | ${x.lema} | ${n.genero} | ${n.tema} | ${x.caso} | **${r}** | -${colaDe(x)} | ${claseIrregular(n, x.caso, r)} | ${col} | ${vr ? `${vr.rival} ${vr.nR}/${vr.nB}` : '—'} | ${vr?.veredicto ?? '—'} | ${x.par} · ${x.eje}${x.frontera ? ` · FRONTERA ${x.frontera.regla}` : ''} |`);
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
  tablaRutas('Estrategias CIEGAS (tope: la mitad; la de la glosa NO está acotada por el teorema)', ESTRATEGIAS, true);
  tablaRutas('PERFILES de conocimiento parcial (sin tope)', PERFILES, false);
  tablaRutas('RUTAS POR LECTURA', RUTAS_POR_LECTURA, false);
  const disc = controlDelAparato();
  const ctl = correr(ITEMS, PERFILES).find((r) => r.nombre.startsWith('el-paradigma-entero'))!;
  console.log(`\n★ CONTROL DEL APARATO — ${NOMBRES_A1.length} lemas × 3 casillas: ${disc.length} discrepancias; la ruta del paradigma entero: ${ctl.aciertos}/${ITEMS.length}.`);
  for (const d of disc) console.log(`  ✗ ${d}`);
  if (disc.length || ctl.aciertos !== ITEMS.length) console.log('⚠ LA REGLA DE MANUAL NO REPRODUCE LA MÁQUINA: los números de PERFILES son de un aparato roto.');
  console.log('\n## Los MÁXIMOS BUSCADOS, con su barrido entero (§4.36)\n');
  console.log(`cola fija: ${COLAS.map((c) => `-${c}:${ITEMS.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length}`).join(' ')}`);
  for (const [nombre, f] of [['caso', (x: ClozeOblRu) => x.caso], ['género', (x: ClozeOblRu) => entradaNom(x)?.genero ?? '?'], ['última letra de la glosa', (x: ClozeOblRu) => claseDeGlosa(entradaNom(x)?.glosa ?? '')]] as const) {
    const b = barridoPorClase(ITEMS, f);
    console.log(`${nombre}: ${b.map((r) => `${r.clase}→-${r.cola} ${r.aciertos}/${r.n}`).join(' · ')}  = ${b.reduce((a, r) => a + r.aciertos, 0)}/${ITEMS.length}`);
  }
  console.log('\n## Los RIVALES, con las cinco salidas\n');
  const vers = ITEMS.map((x) => veredictoRival(x)!);
  for (const k of ['EVIDENCIA', 'NULO VACÍO', 'TAREA DE LECTURA', 'HOMÓGRAFO', 'ROJO'] as Veredicto[]) console.log(`${k}: ${vers.filter((z) => z.veredicto === k).length}`);
  for (const [i, z] of vers.entries()) if (z.veredicto === 'TAREA DE LECTURA') console.log(`  · ítem ${i + 1}: «${z.rival}» ${z.nR} — ${LECTURA_RIVAL[quitarAcento(z.rival)]}`);
  // HOMÓGRAFO: las dos ramas del tema dan la misma cadena. Para `вещь` es el
  // CONTENIDO del par 4 (u1, capa dada: el par no discrimina); para `товарищ`
  // es una propiedad incidental de su tema sibilante y su par SÍ discrimina
  // (E4 del lote 4: una propiedad del LEMA no se lee como propiedad del PAR).
  for (const [i, z] of vers.entries()) if (z.veredicto === 'HOMÓGRAFO') console.log(`  · ítem ${i + 1}: las dos ramas del tema dan «${z.rival}» — el corpus no separa las dos hipótesis sobre ESTE lema (par «${ITEMS[i]!.par}», eje ${ITEMS[i]!.eje}${ITEMS[i]!.eje === 'grafia' ? ': es el contenido del par, que no discrimina' : ': propiedad incidental del lema; el par discrimina por su otro ítem'})`);
  if (vers.some((z) => z.veredicto === 'ROJO')) {
    for (const [i, z] of vers.entries()) if (z.veredicto === 'ROJO') console.log(`⚠ ROJO en el ítem ${i + 1}: «${z.rival}» ${z.nR} frente a ${z.nB}, sin lectura escrita`);
    process.exit(1);
  }
  console.log('\n## Control positivo\n');
  const malas = FALSAS_DEL_LOTE.map((f) => ({ ...f, ...veredictoFalsa(f.mala, f.buena) }));
  for (const m of malas) console.log(`${m.rechaza ? '✓' : '✗'} *${m.mala}  [${m.via}] ${m.detalle}   — ${m.porQue}`);
  const limpias = FALSAS_DEL_LOTE.filter((f) => revisarOrtografiaRu(f.buena).length === 0).length;
  console.log(`\n${malas.filter((m) => m.rechaza).length}/${malas.length} rechazadas · ${limpias}/${FALSAS_DEL_LOTE.length} buenas limpias.`);
  if (malas.some((m) => !m.rechaza)) { console.log('⚠ UNA FORMA FALSA NO SE RECHAZA.'); process.exit(1); }
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}
