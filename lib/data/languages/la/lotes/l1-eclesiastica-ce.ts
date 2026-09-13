// lib/data/languages/la/lotes/l1-eclesiastica-ce.ts
//
// Punto: `l1-eclesiastica-ce`. «Cicerō = "Chíchero", descendit =
// "deshéndit", regem = "réyem". El italiano lo da gratis y por eso la voz
// funciona.»
//
// `varia`: «la vocal que sigue, porque ante a/o/u la regla NO se aplica».
// `excepcion`: «"ca", "co", "cu" siguen siendo /k/: un alumno que
// sobreaplique dirá *"chása" por "casa"».
//
// ── EL PUNTO AGRUPA TRES REGLAS Y EL LOTE LAS TRAE LAS TRES ──────────
//
//   `ce/ci` → /tʃ/   `dīcit` = «díchit»
//   `ge/gi` → /dʒ/   `lēgem` = «léyem»
//   `sc+e/i` → /ʃ/   `discipulus` = «dishípulus»
//
// ── Y LA MITAD SON CASOS NEGATIVOS, QUE ES DONDE ESTÁ EL PUNTO ───────
//
// Un lote todo de positivos enseña la regla y no su borde, y el alumno sale
// diciendo *«chása». Seis ítems aplican y seis no.
//
// `caelum` es el caso fino y va dentro: su `c` NO está ante `e` en el
// original, pero lo queda **después** de fundir el dígrafo `ae`, así que
// suena «chélum». Es el orden que el propio `RESPELIZACION` documenta.
import { itemsDe, type DefEc } from './_ayuda-eclesiastica';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const APLICAN: DefEc[] = [
  ['la-ec-01', 'dīcit', 'dice', '¿cómo suena la «c»?'],
  ['la-ec-02', 'facere', 'hacer', '¿cómo suena la «c»?'],
  ['la-ec-03', 'caelum', 'el cielo', 'el dígrafo se funde PRIMERO, y entonces la «c» queda ante «e»'],
];
const GE: DefEc[] = [
  ['la-ec-04', 'lēgem', 'la ley', '¿cómo suena la «g»?'],
  // `longē` estaba aquí y el gate lo tiró: el adverbio no lo produce la
  // máquina —no hay formación de adverbios, y es un hueco conocido— así
  // que no está atestiguado como forma de L1 aunque salga ×69 en el corpus.
  ['la-ec-05', 'magister', 'el maestro', '¿cómo suena la «g» ante «i»?'],
];
const SC: DefEc[] = [
  ['la-ec-06', 'discipulus', 'el discípulo', '¿cómo suena el grupo «sc»?'],
];
// ── LOS NEGATIVOS: la regla NO se aplica ante a, o, u ──
const NO_APLICAN: DefEc[] = [
  ['la-ec-07', 'causa', 'la causa', 'la «c» va ante «au»: ¿cambia?'],
  ['la-ec-08', 'locum', 'el lugar', 'la «c» va ante «u»: ¿cambia?'],
  ['la-ec-09', 'cum', 'con', 'la «c» va ante «u»: ¿cambia?'],
  ['la-ec-10', 'corpus', 'el cuerpo', 'la «c» va ante «o»: ¿cambia?'],
  ['la-ec-11', 'magnus', 'grande', 'aquí no hay «ce» ni «ge»: ¿cambia la «g»?'],
  ['la-ec-12', 'capere', 'tomar', 'la «c» va ante «a»: ¿cambia?'],
];

export const SEMILLA_DE_ORDEN = 1;

export const LOTE_ECLESIASTICA_CE = ordenPublicado([
  ...itemsDe('ce-ci', APLICAN),
  ...itemsDe('ge-gi', GE),
  ...itemsDe('sc-e-i', SC),
  ...itemsDe('ce-ci', NO_APLICAN),
], SEMILLA_DE_ORDEN);
