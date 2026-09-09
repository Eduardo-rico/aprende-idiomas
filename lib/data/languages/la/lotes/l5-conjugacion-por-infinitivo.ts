// lib/data/languages/la/lotes/l5-conjugacion-por-infinitivo.ts
//
// PRIMER LOTE DE «QUÉ CONJUGACIÓN ES». Punto:
// `l5-conjugacion-por-infinitivo`.
//
// «amāre (1.ª), monēre (2.ª), regere (3.ª), audīre (4.ª), capere (mixta). La
// cantidad de la vocal separa `monēre` de `regere`, y sin macrón no se
// distinguen.» `varia`: la conjugación, **y hay que traer la mixta, que es
// la que nadie ve**.
//
// ── EL PUNTO ERA INSATISFACIBLE POR CONSTRUCCIÓN ─────────────────────
//
// El lexicón no tenía NI UN verbo de la conjugación mixta, así que su
// `varia` no se podía cumplir de ninguna manera. Entran `faciō/facere` y
// `capiō/capere`, los dos más frecuentes del corpus —1.541 y 90
// apariciones— y precisamente los que hacen visible el problema.
//
// ── POR QUÉ LA ENTRADA TRAE LAS DOS PARTES ───────────────────────────
//
// Con el infinitivo solo, la mixta es **literalmente indistinguible** de la
// 3.ª: `capere` y `legere` se escriben igual, con macrón y sin él. Lo que la
// delata es la primera parte principal: `capiō` frente a `legō`. Por eso
// cada ítem muestra las dos, y el gate lo exige.
//
// Las dos rutas ciegas, y la segunda es media destreza legítima:
//
//   · **el infinitivo SIN cantidad** confunde la 2.ª con la 3.ª —`habēre` y
//     `legere` acaban las dos en `-ere` si no se lee la raya—, que es
//     exactamente lo que el punto nombra.
//   · **el infinitivo CON cantidad** acierta cuatro clases de cinco por
//     derecho, y falla SIEMPRE en la mixta. A esa ruta no se le pone techo:
//     leer bien el infinitivo es la mitad del punto. Lo que se le exige es
//     que se estrelle con las mixtas, y eso lo dice la cobertura.
//
// ── EL MACRÓN AQUÍ SÍ, Y NO CONTRADICE LA POLÍTICA ───────────────────
//
// El marco de este punto no es texto corrido: es una **entrada de
// diccionario**, y los diccionarios marcan la cantidad. La regla del 9 de
// septiembre es sobre el latín que se lee, no sobre la ficha del lexicón.
// Sin macrones aquí el punto no tendría objeto, porque su contenido ES la
// cantidad.
import type { ItemConjugacion } from '../../../../../scripts/lib/gate-conjugacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import { conjugacionDe } from '../../../../../scripts/lib/gate-conjugacion';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

const PISTA_LARGA = 'Fíjate en la vocal antes de «-re»: si lleva raya es larga.';
const PISTA_MIXTA = 'El infinitivo no basta aquí: mira cómo acaba la PRIMERA parte.';

const DEFS: [id: string, lema: string, pista: string][] = [
  // ── 1.ª · el infinitivo la da sin ambigüedad ──
  ['la-5c-01', 'amō', PISTA_LARGA],
  ['la-5c-02', 'portō', PISTA_LARGA],
  ['la-5c-03', 'laudō', PISTA_LARGA],
  // ── 2.ª · aquí muerde la cantidad ──
  ['la-5c-04', 'videō', PISTA_LARGA],
  ['la-5c-05', 'moneō', PISTA_LARGA],
  ['la-5c-06', 'habeō', PISTA_LARGA],
  // ── 3.ª · el contraste directo de la anterior ──
  ['la-5c-07', 'legō', PISTA_LARGA],
  ['la-5c-08', 'mittō', PISTA_LARGA],
  ['la-5c-09', 'dūcō', PISTA_LARGA],
  // ── 4.ª ──
  ['la-5c-10', 'audiō', PISTA_LARGA],
  ['la-5c-11', 'inveniō', PISTA_LARGA],
  ['la-5c-12', 'custōdiō', PISTA_LARGA],
  // ── MIXTA · la que el infinitivo NO puede dar ──
  ['la-5c-13', 'faciō', PISTA_MIXTA],
  ['la-5c-14', 'capiō', PISTA_MIXTA],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemConjugacion[] = DEFS.map(([id, lema, pista]) => {
  const verbo = V(lema);
  return {
    id, punto: 'l5-conjugacion-por-infinitivo', verbo,
    entrada: `${verbo.lema}, ${verbo.infinitivo}`,
    respuesta: conjugacionDe(verbo),
    pista,
  };
});

export const LOTE_CONJUGACION = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);
