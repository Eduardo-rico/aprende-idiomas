// lib/data/languages/la/lotes/l1-eclesiastica-ae.ts
//
// Punto: `l1-eclesiastica-ae`. «caelum = "chélum", poena = "péna". Es el
// punto donde la voz italiana NO ayuda: el italiano no tiene la grafía
// "ae" y leería /ka.e/. Por eso existe la respelización.»
//
// `varia`: «si el dígrafo lleva diéresis (aër, poëta), que lo rompe en dos
// sílabas». `excepcion`: «"aër", "poëta", "coëmō": la diéresis marca que NO
// es dígrafo, y el que sobreaplique leerá *"ér"».
//
// ── UNA NOTA SOBRE EL VARIA, QUE NO CUADRA CON EL MATERIAL ───────────
//
// El `varia` habla de DIÉRESIS y **el material no usa diéresis**: escribe
// `poēta`, con mácrón en la `ē`, y el mácrón hace el mismo trabajo —dice
// que la `ē` es larga, luego núcleo propio, luego no hay dígrafo—. Es lo
// que ya documentaba `RESPELIZACION`: «pero NO `poēta`: la ē lleva
// mácrón». Los casos negativos de este lote son de mácrón, no de diéresis,
// y queda dicho para quien revise el inventario.
import { itemsDe, type DefEc } from './_ayuda-eclesiastica';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const APLICAN: DefEc[] = [
  ['la-ea-01', 'caelum', 'el cielo', 'el dígrafo «ae»: ¿cuántas vocales suenan?'],
  ['la-ea-02', 'caelō', 'en el cielo', 'el dígrafo «ae»'],
  ['la-ea-03', 'terrae', 'de la tierra', 'el dígrafo «ae» al final'],
  ['la-ea-04', 'quae', 'las cuales', 'el dígrafo «ae» al final'],
  ['la-ea-05', 'litterae', 'la carta', 'el dígrafo «ae» al final'],
  ['la-ea-06', 'haec', 'ésta', 'el dígrafo «ae» con «h» delante'],
];
// ── LOS NEGATIVOS · el mácrón dice que NO hay dígrafo ──
const NO_APLICAN: DefEc[] = [
  ['la-ea-07', 'poēta', 'el poeta', 'la «ē» lleva mácrón: ¿es dígrafo?'],
  // `poētae` estaba aquí como negativo y el gate lo corrigió: tiene «oē»
  // (hiato) Y «ae» (dígrafo), así que la regla SÍ se aplica y es un caso
  // positivo. Un ítem con las dos cosas no sirve para enseñar ninguna.
  ['la-ea-08', 'meī', 'de mí', 'dos vocales seguidas y la segunda con mácrón'],
  ['la-ea-09', 'Deī', 'de Dios', 'la «ī» lleva mácrón: ¿es dígrafo?'],
  ['la-ea-10', 'eōs', 'a ellos', 'dos vocales seguidas y la segunda con mácrón'],
  ['la-ea-11', 'eī', 'a él', 'dos vocales seguidas y la segunda con mácrón'],
  ['la-ea-12', 'diē', 'en el día', 'dos vocales seguidas y la segunda con mácrón'],
];

export const SEMILLA_DE_ORDEN = 1;
export const INVARIANCIA = undefined;
export const LOTE_ECLESIASTICA_AE = ordenPublicado(
  [...itemsDe('ae-oe', APLICAN), ...itemsDe('ae-oe', NO_APLICAN)], SEMILLA_DE_ORDEN);
