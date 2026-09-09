// lib/data/languages/la/compuestos-de-sum.ts
//
// LOS COMPUESTOS DE `sum`. Punto: `l5-sum-y-compuestos`.
//
// «sum/es/est, possum (pot- + sum), adsum, absum, prōsum. Irregular,
// altísima frecuencia, y con la asimilación de possum como única
// complicación.»
//
// ── POR QUÉ NO SE DERIVAN CONCATENANDO ───────────────────────────────
//
// Un compuesto de `sum` no es «prefijo + forma de sum» sin más: el prefijo
// tiene **dos alomorfos** y cuál sale depende de si la forma de `sum`
// empieza por vocal o por consonante.
//
//     possum  = pos + sum      potest = pot + est
//     prōsum  = prō + sum      prōdest = prōd + est
//     adsum   = ad  + sum      adest  = ad  + est   (un solo alomorfo)
//
// Concatenar a ciegas daría *«potsum» y *«prōest», que no existen. Por eso
// la tabla declara los dos alomorfos de cada uno en vez de una sola cadena.
//
// Frecuencias medidas en el corpus: `sum` 8.189, `possum` 890, `absum` 77,
// `dēsum` 62, `adsum` 49, `prōsum` 45, `intersum` 25, `praesum` 21.
import { conjugar, type Persona, type Tiempo, type EntradaVerbal } from './paradigma-la';
import { VERBOS_L1 } from './lexicon-l1';

export interface CompuestoDeSum {
  lema: string;
  /** El alomorfo ante consonante: el de `sum`, `sumus`, `sunt`. */
  anteConsonante: string;
  /** El alomorfo ante vocal: el de `es`, `est`, `eram`, `erō`. */
  anteVocal: string;
  glosa: string;
  /** Cuántas veces sale en el corpus. */
  frecuencia: number;
  /** Sólo cuando los dos alomorfos difieren: qué pasa y por qué. */
  asimilacion?: string;
}

export const COMPUESTOS_DE_SUM: CompuestoDeSum[] = [
  { lema: 'possum', anteConsonante: 'pos', anteVocal: 'pot', glosa: 'poder', frecuencia: 890,
    asimilacion: 'el prefijo es «pot-», y ante la «s-» de «sum» la «t» se asimila: «pot+sum» → «possum». Ante vocal no pasa nada y reaparece: «potest». Es la única complicación que el punto declara, y con 890 apariciones es la que más se ve' },
  { lema: 'adsum', anteConsonante: 'ad', anteVocal: 'ad', glosa: 'estar presente', frecuencia: 49 },
  { lema: 'absum', anteConsonante: 'ab', anteVocal: 'ab', glosa: 'estar ausente', frecuencia: 77 },
  { lema: 'prōsum', anteConsonante: 'prō', anteVocal: 'prōd', glosa: 'ser útil', frecuencia: 45,
    asimilacion: 'ante vocal aparece una «-d-» que no está en el prefijo suelto: «prōd+est» → «prōdest». Es una consonante de enlace, no una asimilación, y va aquí para que nadie la derive por regla' },
  { lema: 'dēsum', anteConsonante: 'dē', anteVocal: 'dē', glosa: 'faltar', frecuencia: 62 },
];

const SUM = (): EntradaVerbal => VERBOS_L1.find((v) => v.lema === 'sum')!;

/** Conjuga un compuesto eligiendo el alomorfo según lo que empiece la forma
 *  de `sum`. Nunca se concatena a ciegas. */
export function conjugarCompuesto(c: CompuestoDeSum, p: Persona, t: Tiempo = 'presente'): string {
  const base = conjugar(SUM(), p, t).normalize('NFC');
  const empiezaPorVocal = /^[aeiouāēīōū]/.test(base);
  return (empiezaPorVocal ? c.anteVocal : c.anteConsonante) + base;
}

// ── LO QUE ESTA TABLA NO CUBRE, dicho en vez de disimulado ───────────
//
// Sólo el INFECTUM: presente, imperfecto y futuro. Comprobado contra el
// corpus en los dos sentidos, y el infectum sale completo; las únicas formas
// atestiguadas que no produce son del perfectum —«potuerit» ×3, «potuerō»,
// «adfuerit», «profuerit», «dēfuerint»— más un «possīs» de subjuntivo.
//
// El perfectum de los compuestos se forma sobre `potuī`, `adfuī`, `prōfuī`,
// `dēfuī`, que NO son «prefijo + fuī» sin más (`prōfuī`, no *«prōdfuī»).
// Añadirlo pide otra tabla de alomorfos y es el siguiente paso de este
// punto, no una nota al pie.
export function paradigmaCompuesto(c: CompuestoDeSum, t: Tiempo = 'presente'): Record<Persona, string> {
  const out = {} as Record<Persona, string>;
  for (const p of ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'] as Persona[])
    out[p] = conjugarCompuesto(c, p, t);
  return out;
}
