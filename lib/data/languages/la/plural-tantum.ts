// lib/data/languages/la/plural-tantum.ts
//
// LOS PLURALIA TANTUM. Punto: `l2-plural-tantum`.
//
// «castra (el campamento), arma (las armas, pero también el equipo de UN
// soldado), litterae (la carta), cōpiae (las tropas). La forma es plural y
// el sentido no siempre.» `varia`: **si el lema tiene singular con otro
// sentido (littera = letra) o carece de él (castra)**.
//
// ── VAN EN TABLA APARTE Y NO EN EL LEXICÓN ───────────────────────────
//
// `declinar` produciría el singular de todos ellos —`*armum`, `*tenebra`—
// y esas formas no existen. Meterlos en `NOMBRES_L1` sería fabricar
// exactamente el error que el punto enseña a no cometer, y el gate de
// atestación lo cazaría como inventos... si alguien lo mirara.
//
// ── EL EJE ESTÁ MEDIDO Y NO ES BINARIO ───────────────────────────────
//
// Contados los singulares y plurales de cada uno en el corpus:
//
//     arma        77 tokens    0 singulares   sin singular, punto
//     tenebrae    44           0
//     īnsidiae    24           0
//     nūptiae     21           0
//     līberī      16           0
//     moenia       5           0
//     castra     160           1              casi sin singular
//     littera    225           7  (3 %)       singular real, otro sentido
//     cōpia      119          26  (22 %)      singular corriente, otro sentido
//
// El `varia` dice «tiene singular con otro sentido O carece de él», y la
// medición añade el medio: `castra` tiene UNO en 160, o sea que el singular
// `castrum` («fortín») existe y el alumno no lo verá nunca. No es lo mismo
// que `arma`, que no lo tiene, ni que `cōpia`, que lo tiene y es corriente.
export interface PluralTantum {
  /** El lema, en plural, que es como se cita. */
  lema: string;
  glosa: string;
  /** El singular, si existe. `null` si no lo hay. */
  singular: string | null;
  /** Qué significa el singular, cuando existe y significa otra cosa. */
  glosaDelSingular?: string;
  /** Tokens en el corpus y cuántos de ellos en singular. */
  tokens: number;
  enSingular: number;
}

export const PLURALIA_TANTUM: PluralTantum[] = [
  // ── SIN SINGULAR NINGUNO ──
  { lema: 'arma', glosa: 'las armas; también el equipo de UN solo soldado',
    singular: null, tokens: 77, enSingular: 0 },
  { lema: 'tenebrae', glosa: 'la oscuridad', singular: null, tokens: 44, enSingular: 0 },
  { lema: 'īnsidiae', glosa: 'la emboscada', singular: null, tokens: 24, enSingular: 0 },
  { lema: 'nūptiae', glosa: 'la boda', singular: null, tokens: 21, enSingular: 0 },
  { lema: 'līberī', glosa: 'los hijos', singular: null, tokens: 16, enSingular: 0 },
  { lema: 'moenia', glosa: 'la muralla', singular: null, tokens: 5, enSingular: 0 },

  // ── CON SINGULAR RARÍSIMO ──
  // El punto lo pone como ejemplo de «carece de singular», y casi acierta:
  // hay UNO en 160. `castrum` («el fortín») existe como palabra suelta y con
  // otro sentido, así que técnicamente es de la segunda clase — pero con una
  // frecuencia que lo hace invisible. La medición matiza al punto sin
  // contradecirlo.
  { lema: 'castra', glosa: 'el campamento', singular: 'castrum',
    glosaDelSingular: 'el fortín, un puesto suelto: existe y el alumno no lo verá nunca (1 de 160)',
    tokens: 160, enSingular: 1 },

  // ── CON SINGULAR REAL Y OTRO SENTIDO ──
  { lema: 'litterae', glosa: 'la carta', singular: 'littera',
    glosaDelSingular: 'la letra del alfabeto — un sentido completamente distinto',
    tokens: 225, enSingular: 7 },
  { lema: 'cōpiae', glosa: 'las tropas', singular: 'cōpia',
    glosaDelSingular: 'la abundancia, la provisión — y es corriente: 22 % de sus apariciones',
    tokens: 119, enSingular: 26 },
];

export type ClasePT = 'sin-singular' | 'singular-con-otro-sentido';

/** Las DOS clases que el punto declara: «tiene singular con otro sentido
 *  (littera = letra) o carece de él (castra)».
 *
 *  La primera versión de esto clasificaba por FRECUENCIA —menos del 5 % de
 *  singulares = «rarísimo»— y metía `litterae` (7 de 225, el 3 %) en el
 *  mismo saco que `castra` (1 de 160). Pero el punto no las separa por lo
 *  raro que sea el singular sino por si SIGNIFICA OTRA COSA, y `littera` es
 *  su ejemplo de eso. Medir lo que no es el eje y llamarlo el eje es la
 *  forma más silenciosa de que un lote deje de examinar su punto. */
export function claseDe(p: PluralTantum): ClasePT {
  return p.singular === null ? 'sin-singular' : 'singular-con-otro-sentido';
}

/** Y la frecuencia se conserva aparte, como evidencia y no como criterio.
 *  Dice algo que el punto no dice: `castra` tiene UN singular en 160, así
 *  que `castrum` existe y el alumno no lo verá nunca — que no es lo mismo
 *  que `arma`, que no lo tiene, ni que `cōpia`, corriente en singular. */
export function loRaroQueEsElSingular(p: PluralTantum): number | null {
  return p.singular === null ? null : p.enSingular / p.tokens;
}
