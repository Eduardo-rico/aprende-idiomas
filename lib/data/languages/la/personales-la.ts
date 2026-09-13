// lib/data/languages/la/personales-la.ts
//
// LOS PRONOMBRES PERSONALES Y EL REFLEXIVO.
//
// ── POR QUÉ NO CABEN EN `pronombres-la.ts` ───────────────────────────
//
// Aquella tabla es la de la DECLINACIÓN PRONOMINAL: un tema más las
// desinencias, con género. `ille`, `iste`, `ipse`, `is`, `hic`, `quī`.
//
// Los personales no tienen género y su paradigma es supletivo entero:
// `ego`, `meī`, `mihi`, `mē`. No hay tema del que salgan. Meterlos allí
// sería inventar una regularidad que no existe, que es lo que este proyecto
// no hace — así que van en tabla, como los irregulares del verbo.
//
// ── POR QUÉ ENTRAN, Y ES MEDICIÓN NO GUSTO ───────────────────────────
//
// El barrido de vocabulario de los marcos encontró `me` en un lote ya
// publicado (`l5-negacion`) sin que el curso tuviera el pronombre. Y las
// cuentas del corpus dicen que no es un caso raro:
//
//     mē   ×1.373      mihi ×719      ego  ×713      meī  ×106
//     tē    ×866       tibi ×418      tū   ×377      tuī   ×64
//     sē    ×789       sibi ×213      suī   ×64
//     vōs   ×663       vōbīs ×693     nōs  ×460      nōbīs ×323
//
// `mē` es más frecuente que cualquier sustantivo de L1. Y hacen falta
// además para `l5-pro-drop`: no se puede enseñar que el latín OMITE el
// pronombre sujeto si el pronombre sujeto no existe en el curso.
//
// ── EL REFLEXIVO NO TIENE NOMINATIVO, Y ESO ES EL PUNTO ──────────────
//
// `suī, sibi, sē, sē`: no hay forma de sujeto porque el reflexivo remite al
// sujeto, no lo es. Va declarado con `null` en vez de inventado.
import type { Caso, Numero } from './paradigma-la';

export interface Personal {
  /** Con qué se le nombra. El reflexivo se cita por el genitivo, `suī`,
   *  justamente porque no tiene nominativo. */
  lema: string;
  glosa: string;
  numero: Numero;
  /** `null` donde la forma no existe. */
  formas: Partial<Record<Caso, string | null>>;
}

export const PERSONALES_L1: Personal[] = [
  { lema: 'ego', glosa: 'yo', numero: 'sg',
    formas: { nom: 'ego', ac: 'mē', gen: 'meī', dat: 'mihi', abl: 'mē', voc: null } },
  { lema: 'tū', glosa: 'tú', numero: 'sg',
    formas: { nom: 'tū', ac: 'tē', gen: 'tuī', dat: 'tibi', abl: 'tē', voc: 'tū' } },
  { lema: 'nōs', glosa: 'nosotros', numero: 'pl',
    formas: { nom: 'nōs', ac: 'nōs', gen: 'nostrī', dat: 'nōbīs', abl: 'nōbīs', voc: null } },
  { lema: 'vōs', glosa: 'vosotros', numero: 'pl',
    formas: { nom: 'vōs', ac: 'vōs', gen: 'vestrī', dat: 'vōbīs', abl: 'vōbīs', voc: 'vōs' } },
  // El reflexivo, que sirve para los dos números y no tiene nominativo.
  { lema: 'suī', glosa: 'se, a sí mismo', numero: 'sg',
    formas: { nom: null, ac: 'sē', gen: 'suī', dat: 'sibi', abl: 'sē', voc: null } },
];

/** Las formas que existen de verdad, sin los `null`. */
export function formasDe(p: Personal): string[] {
  return Object.values(p.formas).filter((f): f is string => f !== null && f !== undefined);
}

/** El genitivo plural tiene DOS formas y significan cosas distintas:
 *  `nostrī` es el objetivo («de nosotros» como complemento) y `nostrum` el
 *  partitivo («de entre nosotros»). Las dos están atestiguadas —`nostri`
 *  ×150, `nostrum` ×100— y el paradigma de arriba guarda la primera. */
export const GENITIVO_PARTITIVO: Record<string, string> = {
  'nōs': 'nostrum',
  'vōs': 'vestrum',
};
