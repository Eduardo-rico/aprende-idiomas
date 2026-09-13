// lib/data/languages/la/grado.ts — COMPARATIVO Y SUPERLATIVO.
//
// Punto `l4-comparativo`. «altior/altissimus; melior/optimus, maior/maximus,
// plūs/plūrimus. Los irregulares son los mismos que en español, que es un
// regalo poco frecuente.» `varia`: «si el adjetivo es regular o de la lista,
// y si el superlativo es en `-issimus`, `-errimus` o `-illimus`».
//
// ══ POR QUÉ ESTE MÓDULO Y NO UNA RAMA EN `declinarAdjetivo` ══════════
//
// El comparativo **no se declina como los demás adjetivos de la 3.ª**. Es
// un tema consonántico puro: ablativo en `-e` y genitivo plural en `-um`,
// donde `fortis` y compañía hacen `-ī` y `-ium`. El corpus lo confirma:
// `maiōre` ×13 y `maiōrum` ×7, y ni un solo `*maiōrī` ni `*maiōrium`.
// Meterlo en el declinador de la 3.ª habría producido formas que no existen
// y el gate las habría aprobado, porque el gate mira lo que la máquina da.
//
// ══ LOS TRES SUPERLATIVOS, Y POR QUÉ UNO ES UNA LISTA ════════════════
//
//   `-issimus`   la regla general                     certus → certissimus
//   `-errimus`   los acabados en `-er`, SOBRE EL
//                NOMINATIVO y no sobre el tema        pulcher → pulcherrimus
//   `-illimus`   LOS SEIS EN `-ilis`, que son una
//                lista cerrada y no un sufijo         similis → simillimus
//
// La diferencia entre los dos últimos es lo que hace caro este punto.
// `similis` está entre los seis y hace `simillimus`; `ūtilis` y `fidēlis`
// acaban igual, NO están, y hacen `ūtilissimus` y `fidēlissimus`. Una regla
// por sufijo —«los en -ilis hacen -illimus»— produce `*ūtillimus`, que no
// existe. Por eso la lista va escrita: son estos seis y no los que acaben
// así.
//
// ══ LOS QUE NO ADMITEN GRADO ═════════════════════════════════════════
//
// Los posesivos (`meus`, `tuus`, `suus`, `noster`) y los ordinales
// (`prīmus`) no se comparan: `*meior` no significa nada. Y los acabados en
// `-eus`, `-ius`, `-uus` lo hacen con perífrasis —`magis anxius`, `maximē
// anxius`— porque `*anxior` sería impronunciable como comparativo. La
// máquina devuelve `null` en los primeros y la perífrasis en los segundos,
// en vez de fabricar formas que ningún texto trae.
import type { Caso, Numero } from './paradigma-la';

export type GeneroAdj = 'm' | 'f' | 'n';
export type ClaseDeSuperlativo = 'issimus' | 'errimus' | 'illimus' | 'irregular' | 'perifrastico' | 'sin-grado';

/** Los irregulares, que son los mismos que en español y por eso el punto
 *  los llama «un regalo poco frecuente»: mejor/óptimo, mayor/máximo,
 *  menor/mínimo, peor/pésimo, más. */
export const GRADO_IRREGULAR: Record<string, { comparativo: string; superlativo: string }> = {
  bonus: { comparativo: 'melior', superlativo: 'optimus' },
  malus: { comparativo: 'peior', superlativo: 'pessimus' },
  magnus: { comparativo: 'maior', superlativo: 'maximus' },
  parvus: { comparativo: 'minor', superlativo: 'minimus' },
  multus: { comparativo: 'plūs', superlativo: 'plūrimus' },
};

/** LOS SEIS. Es una lista cerrada, no la terminación: `ūtilis` y `fidēlis`
 *  acaban igual y hacen `-issimus`. */
export const SEIS_EN_ILIS = ['facilis', 'difficilis', 'similis', 'dissimilis', 'gracilis', 'humilis'] as const;

/** Posesivos, ordinales y cuantificadores: no se comparan.
 *
 *  `omnis` entra aquí por semántica, no por frecuencia: un cuantificador
 *  universal no admite grados —«más todo» no significa nada— y el corpus no
 *  trae ni un `*omnior` ni un `*omnissimus`.
 *
 *  Lo que NO entra, y conviene dejarlo dicho para que nadie lo añada: que
 *  `integer`, `vērus`, `commūnis`, `praesēns` y `similis` tampoco tengan
 *  grado atestiguado en estos 227.301 tokens **no es un argumento**.
 *  `integerrimus`, `vērissimus` y `simillimus` son latín corriente; lo que
 *  dice ese cero es el tamaño del corpus, no una propiedad de la lengua. */
export const SIN_GRADO = new Set([
  'meus', 'tuus', 'suus', 'noster', 'vester',
  'prīmus', 'secundus', 'tertius', 'quārtus', 'quīntus',
  'omnis',
]);

const NFC = (s: string) => s.normalize('NFC');

/** Los acabados en `-eus`, `-ius`, `-uus` van con perífrasis. `anxius` es
 *  el de L1. No cuenta el `-quus`, que es otra cosa. */
export function vaConPerifrasis(lema: string): boolean {
  return /[eiu]us$/.test(NFC(lema)) && !/quus$/.test(NFC(lema));
}

export interface Grados {
  /** Nominativo masculino/femenino singular: `altior`, `melior`. */
  comparativo: string | null;
  /** El neutro, que es otra forma: `altius`, `melius`. */
  comparativoNeutro: string | null;
  /** Nominativo masculino singular: `altissimus`, `optimus`. */
  superlativo: string | null;
  clase: ClaseDeSuperlativo;
}

/** El tema del comparativo, que es lo que declina: `maiōr-`, `certiōr-`. */
export function temaDelComparativo(comparativo: string): string {
  const c = NFC(comparativo);
  return c.endsWith('ior') ? `${c.slice(0, -3)}iōr` : c.endsWith('or') ? `${c.slice(0, -2)}ōr` : c;
}

/** `lema` es el nominativo masculino singular; `tema`, lo que queda al
 *  quitarle la desinencia (`pulchr-`, `fort-`). */
export function gradosDe(lema: string, tema: string): Grados {
  const l = NFC(lema);
  const t = NFC(tema);
  if (SIN_GRADO.has(l)) return { comparativo: null, comparativoNeutro: null, superlativo: null, clase: 'sin-grado' };

  const irr = GRADO_IRREGULAR[l];
  if (irr) {
    return {
      comparativo: irr.comparativo,
      comparativoNeutro: irr.comparativo === 'plūs' ? 'plūs' : `${irr.comparativo.replace(/or$/, 'us')}`,
      superlativo: irr.superlativo,
      clase: 'irregular',
    };
  }

  if (vaConPerifrasis(l)) {
    return { comparativo: `magis ${l}`, comparativoNeutro: `magis ${l.replace(/us$/, 'um')}`,
             superlativo: `maximē ${l}`, clase: 'perifrastico' };
  }

  const comparativo = `${t}ior`;
  const comparativoNeutro = `${t}ius`;

  // `-errimus` va sobre el NOMINATIVO, no sobre el tema: `pulcher` + `rimus`
  // y no `pulchr` + `errimus`, que daría `*pulchrerrimus`.
  if (/er$/.test(l)) return { comparativo, comparativoNeutro, superlativo: `${l}rimus`, clase: 'errimus' };
  // `-illimus` sobre el tema de los SEIS: `simil` + `limus`.
  if ((SEIS_EN_ILIS as readonly string[]).includes(l)) return { comparativo, comparativoNeutro, superlativo: `${l.replace(/is$/, '')}limus`, clase: 'illimus' };
  return { comparativo, comparativoNeutro, superlativo: `${t}issimus`, clase: 'issimus' };
}

/** La estrategia del que sobreaplica: `-issimus` a todo. Produce
 *  `*facilissimus`, que es el error que el punto declara. */
export function superlativoIngenuo(tema: string): string {
  return `${NFC(tema)}issimus`;
}

// ══ LA DECLINACIÓN DEL COMPARATIVO ═══════════════════════════════════
//
// Tema consonántico: ablativo singular en `-e`, genitivo plural en `-um`,
// nominativo/acusativo neutro plural en `-a`. NO es la de `fortis`.
const COMPARATIVO_MF: Record<Numero, Record<Caso, string>> = {
  sg: { nom: '', gen: 'is', dat: 'ī', ac: 'em', abl: 'e', voc: '' },
  pl: { nom: 'ēs', gen: 'um', dat: 'ibus', ac: 'ēs', abl: 'ibus', voc: 'ēs' },
};
const COMPARATIVO_N: Record<Numero, Record<Caso, string>> = {
  sg: { nom: '', gen: 'is', dat: 'ī', ac: '', abl: 'e', voc: '' },
  pl: { nom: 'a', gen: 'um', dat: 'ibus', ac: 'a', abl: 'ibus', voc: 'a' },
};

export function declinarComparativo(g: Grados, genero: GeneroAdj, caso: Caso, num: Numero): string | null {
  if (g.comparativo === null) return null;
  if (g.clase === 'perifrastico') return null;   // la perífrasis declina el adjetivo, no el comparativo
  const tema = temaDelComparativo(g.comparativo);
  if (genero === 'n') {
    // El neutro singular del nominativo y el acusativo es la forma en `-ius`,
    // que NO sale del tema: `maius`, no `*maiōr`.
    if (num === 'sg' && (caso === 'nom' || caso === 'ac' || caso === 'voc')) return g.comparativoNeutro;
    return tema + COMPARATIVO_N[num][caso];
  }
  if (num === 'sg' && (caso === 'nom' || caso === 'voc')) return g.comparativo;
  return tema + COMPARATIVO_MF[num][caso];
}
