// lib/data/languages/la/lotes/l1-eclesiastica-ti.ts
//
// Punto: `l1-eclesiastica-ti`. «grātia = "grátsia", nātiō = "natsio". El
// otro agujero del G2P italiano.»
//
// `varia`: «la consonante anterior, que decide si la regla aplica».
// `excepcion`: «tras s, t o x NO se aplica: "bestia", "mixtiō" siguen con
// /ti/. **Es el caso negativo obligatorio**».
//
// ── ESTE LOTE NO SE PODÍA ESCRIBIR HACE UNA HORA ─────────────────────
//
// El caso negativo es obligatorio y **en L1 no había ni uno**: cero formas
// con `ti`+vocal precedidas de `s`, `t` o `x`. No pocas — cero. `bestia`
// entró por eso, con sus 54 tokens, y es la palabra que el propio
// descriptor nombra.
import { itemsDe, type DefEc } from './_ayuda-eclesiastica';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const APLICAN: DefEc[] = [
  ['la-et-01', 'grātia', 'la gracia', '¿cómo suena «ti» ante vocal?'],
  ['la-et-02', 'grātiam', 'la gracia (acusativo)', '¿cómo suena «ti» ante vocal?'],
  ['la-et-03', 'nātiō', 'la nación', '¿cómo suena «ti» ante vocal?'],
  ['la-et-04', 'nātiōnēs', 'las naciones', '¿cómo suena «ti» ante vocal?'],
  ['la-et-05', 'etiam', 'también', '¿cómo suena «ti» ante vocal?'],
  ['la-et-06', 'grātiās', 'las gracias', '¿cómo suena «ti» ante vocal?'],
];
// ── LOS NEGATIVOS · tras `s` la regla NO se aplica ──
const NO_APLICAN: DefEc[] = [
  ['la-et-07', 'bestia', 'la bestia', 'el «ti» va tras «s»: ¿se africa?'],
  ['la-et-08', 'bestiam', 'la bestia (acusativo)', 'el «ti» va tras «s»'],
  ['la-et-09', 'bestiae', 'de la bestia', 'el «ti» va tras «s»'],
  ['la-et-10', 'bestiās', 'las bestias', 'el «ti» va tras «s»'],
  ['la-et-11', 'bestiīs', 'con las bestias', 'el «ti» va tras «s»'],
  ['la-et-12', 'bestiā', 'con la bestia', 'el «ti» va tras «s»'],
];

export const SEMILLA_DE_ORDEN = 1;
export const LOTE_ECLESIASTICA_TI = ordenPublicado(
  [...itemsDe('ti-vocal', APLICAN), ...itemsDe('ti-vocal', NO_APLICAN)], SEMILLA_DE_ORDEN);
