// lib/data/languages/la/lotes/l5-imperativo.ts
//
// PRIMER LOTE DEL IMPERATIVO. Punto: `l5-imperativo`.
//
// «amā/amāte. Y dīc, dūc, fac, fer, que pierden la vocal final.» `varia`: si
// el verbo es de los cuatro irregulares o no.
//
// ── LA IRREGULARIDAD NO ES DEL VERBO SINO DE UNA DE SUS DOS FORMAS ───
//
// Medido en el corpus, los cuatro pierden la vocal SÓLO en el singular y su
// plural es completamente normal:
//
//     dīc ×24   ·  dīcite ×19        fac ×33  ·  facite ×24
//     dūc ×2    ·  dūcite ×2         fer ×2   ·  ferte ×3
//
// O sea que el alumno verá las dos cosas del MISMO verbo, muchas veces en la
// misma página. Un lote que sólo trajera los singulares enseñaría que
// «`dīcō` es irregular», que es falso: lo irregular es su imperativo de
// singular. Por eso cada verbo irregular aparece en las dos formas.
//
// ── LO QUE FALTA, DICHO ──────────────────────────────────────────────
//
// El punto nombra CUATRO y este lote trae TRES: falta `fer`, porque `ferō`
// es irregular en todo su presente —`fers`, `fert`, `fertis`— y meterlo en
// el lexicón rompería `conjugar`. Pertenece a `l5-irregulares`, que hoy no
// se puede escribir por lo mismo. No es un olvido: es el mismo hueco de
// máquina, y el gate de inventario contra lexicón lo dirá cuando se le
// enseñe a mirar los irregulares.
//
// ── EL MACRÓN ────────────────────────────────────────────────────────
//
// Marco sin macrones. Aquí eso hace algo concreto y visible: «dīc» y «dic»
// se leen igual, y el alumno que produzca la forma tiene que saber que la
// `i` es larga aunque nunca la vea marcada.
import type { Numero } from '../paradigma-la';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import { imperativo, esImperativoIrregular } from '../paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export interface ItemImperativo {
  id: string;
  punto: string;
  verbo: ReturnType<typeof V>;
  numero: Numero;
  marco: string;
  glosa: string;
  respuesta: string;
  ejes: {
    /** Declarado a mano y contrastado contra la máquina. */
    irregular: boolean;
    /** Sólo cuando es irregular: qué pierde y dónde NO lo pierde. */
    queLePasa?: string;
  };
}

const PIERDE = (sg: string, pl: string, nSg: number, nPl: number) =>
  `pierde la vocal final SÓLO en el singular —«${sg}» ×${nSg}— y su plural «${pl}» ×${nPl} es normal. Lo irregular no es el verbo sino una de sus dos formas`;

type Def = [id: string, lema: string, num: Numero, marco: string, glosa: string, queLePasa?: string];

const DEFS: Def[] = [
  // ── REGULARES, las cinco clases ──
  ['la-5m-01', 'amō', 'sg', '___ rosam.', '¡Ama la rosa!'],
  ['la-5m-02', 'portō', 'pl', '___ dona.', '¡Lleven los regalos!'],
  ['la-5m-03', 'videō', 'sg', '___ reginam.', '¡Mira a la reina!'],
  ['la-5m-04', 'moneō', 'pl', '___ discipulos.', '¡Adviertan a los discípulos!'],
  ['la-5m-05', 'legō', 'sg', '___ verba.', '¡Lee las palabras!'],
  ['la-5m-06', 'mittō', 'pl', '___ dona.', '¡Envíen los regalos!'],
  ['la-5m-07', 'audiō', 'sg', '___ poetam.', '¡Oye al poeta!'],
  ['la-5m-08', 'custōdiō', 'pl', '___ templum.', '¡Guarden el templo!'],

  // ── LOS IRREGULARES, cada uno en SUS DOS FORMAS ──
  ['la-5m-09', 'dīcō', 'sg', '___ verba.', '¡Di las palabras!', PIERDE('dīc', 'dīcite', 24, 19)],
  ['la-5m-10', 'dīcō', 'pl', '___ verba.', '¡Digan las palabras!', PIERDE('dīc', 'dīcite', 24, 19)],
  ['la-5m-11', 'dūcō', 'sg', '___ servos.', '¡Guía a los esclavos!', PIERDE('dūc', 'dūcite', 2, 2)],
  ['la-5m-12', 'dūcō', 'pl', '___ servos.', '¡Guíen a los esclavos!', PIERDE('dūc', 'dūcite', 2, 2)],
  ['la-5m-13', 'faciō', 'sg', '___ opus.', '¡Haz la obra!', PIERDE('fac', 'facite', 33, 24)],
  ['la-5m-14', 'faciō', 'pl', '___ opus.', '¡Hagan la obra!', PIERDE('fac', 'facite', 33, 24)],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemImperativo[] = DEFS.map(([id, lema, numero, marco, glosa, queLePasa]) => {
  const verbo = V(lema);
  return {
    id, punto: 'l5-imperativo', verbo, numero, marco, glosa,
    respuesta: imperativo(verbo, numero),
    ejes: {
      irregular: esImperativoIrregular(verbo),
      ...(queLePasa ? { queLePasa } : {}),
    },
  };
});

export const LOTE_IMPERATIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);
