// lib/data/languages/la/paradigma-la.ts
//
// LA MÁQUINA DE FORMAS DE L1: 1.ª y 2.ª declinación, presente de indicativo
// de las cuatro conjugaciones.
//
// El riesgo de una máquina así está medido en este proyecto: en rumano una
// regla enunciada con la alternancia equivocada se replicó en cientos de
// formas generadas. Aquí la defensa son tres comprobaciones, y **dos de
// ellas no consultan esta máquina**:
//
//   1. la cantidad, contra el lexicón de `cantidad.ts` (que a su vez está
//      auditado por los reflejos romances, que no consultan el lexicón);
//   2. la atestación, contra 227.300 tokens de treebank UD;
//   3. las excepciones declaradas en el inventario, que son la parte que
//      una regla bonita se come.
//
// ── LA ENTRADA ES LEMA + GENITIVO, NO EL NOMINATIVO ───────────────────
//
// Es el punto `l2-genitivo-clave`: de «rēx» no se deduce nada, de «rēgis»
// sale todo. La máquina deriva el tema del GENITIVO, así que `puer/puerī`
// y `ager/agrī` salen bien sin regla especial — la síncopa está en el
// dato, no en el código.

export type Caso = 'nom' | 'ac' | 'gen' | 'dat' | 'abl' | 'voc';
export type Numero = 'sg' | 'pl';

export interface EntradaNominal {
  lema: string;      // nominativo singular, macronizado
  genitivo: string;  // genitivo singular, macronizado — de aquí sale el tema
  genero: 'm' | 'f' | 'n';
  glosa: string;
}

/** Terminaciones. El orden es [nom, ac, gen, dat, abl, voc]. */
const N1: Record<Numero, string[]> = {
  sg: ['a', 'am', 'ae', 'ae', 'ā', 'a'],
  pl: ['ae', 'ās', 'ārum', 'īs', 'īs', 'ae'],
};
const N2: Record<Numero, string[]> = {
  sg: ['us', 'um', 'ī', 'ō', 'ō', 'e'],
  pl: ['ī', 'ōs', 'ōrum', 'īs', 'īs', 'ī'],
};
const N2_NEUTRO: Record<Numero, string[]> = {
  sg: ['um', 'um', 'ī', 'ō', 'ō', 'um'],
  pl: ['a', 'a', 'ōrum', 'īs', 'īs', 'a'],
};
const ORDEN: Caso[] = ['nom', 'ac', 'gen', 'dat', 'abl', 'voc'];

export type Declinacion = '1ª' | '2ª';

export function declinacionDe(e: EntradaNominal): Declinacion {
  const g = e.genitivo.normalize('NFC');
  if (g.endsWith('ae')) return '1ª';
  if (g.endsWith('ī')) return '2ª';
  throw new Error(`genitivo «${g}» fuera de L1: sólo 1.ª (-ae) y 2.ª (-ī)`);
}

const temaDe = (e: EntradaNominal) =>
  e.genitivo.normalize('NFC').replace(/(ae|ī)$/, '');

export function declinar(e: EntradaNominal, caso: Caso, num: Numero): string {
  const decl = declinacionDe(e);
  const tema = temaDe(e);
  const i = ORDEN.indexOf(caso);

  if (decl === '1ª') return tema + N1[num]![i]!;

  // ── 2.ª ──
  const tabla = e.genero === 'n' ? N2_NEUTRO : N2;
  // Los `-er` y los `-ir` no tienen desinencia en nominativo ni vocativo
  // singular: la forma es el lema. `puer/puerī` conserva la e y
  // `ager/agrī` la pierde, y las dos salen del genitivo sin regla aparte.
  const sinDesinencia = /(er|ir)$/.test(e.lema.normalize('NFC')) && e.genero !== 'n';
  if (num === 'sg' && sinDesinencia && (caso === 'nom' || caso === 'voc')) return e.lema.normalize('NFC');

  // LA EXCEPCIÓN DECLARADA (Allen & Greenough §49.c), y va aquí porque es
  // justo lo que una regla bonita se come: los NOMBRES PROPIOS en -ius,
  // más `fīlius` y `genius`, hacen vocativo en -ī y NO en -ie. La regla
  // no vale para los comunes en -ius. Atestiguado en el treebank:
  // fīlī 20, Pompōnī 7, Cornēlī 2, Tullī 2.
  //
  // El vocativo se forma por CONTRACCIÓN: la `-i-` del tema se funde con
  // la `-ī`, así que es `fīlī` y no `fīliī`. La primera versión devolvía
  // `tema + 'ī'` = `fīliī`, que además COLISIONA con el genitivo — y lo
  // cazó el gate de cantidad al rechazar `fīlī` como forma que la máquina
  // no produce. En el treebank: `fili` 13, `filie` 0.
  if (num === 'sg' && caso === 'voc' && /ius$/.test(e.lema.normalize('NFC'))) {
    const propio = /^\p{Lu}/u.test(e.lema);
    if (propio || ['fīlius', 'genius'].includes(e.lema.normalize('NFC'))) return tema.replace(/i$/, '') + 'ī';
  }
  return tema + tabla[num]![i]!;
}

export function paradigmaNominal(e: EntradaNominal): Record<string, string> {
  const out: Record<string, string> = {};
  for (const num of ['sg', 'pl'] as const) for (const caso of ORDEN) out[`${caso}.${num}`] = declinar(e, caso, num);
  return out;
}

// ── VERBO: presente de indicativo activo ──────────────────────────────

export type Conjugacion = 1 | 2 | 3 | 4;
export type Persona = '1sg' | '2sg' | '3sg' | '1pl' | '2pl' | '3pl';
const PERSONAS: Persona[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

export interface EntradaVerbal {
  lema: string;        // 1.ª sg del presente: `amō`
  infinitivo: string;  // `amāre` — de aquí sale la conjugación
  glosa: string;
}

/** Las terminaciones del presente. La vocal temática se ABREVIA ante -t y
 *  -nt finales (*brevis brevians*, A&G §603.f): por eso `amat` y no
 *  `amāt`, que es el error típico del material generado. */
const V: Record<Conjugacion, string[]> = {
  1: ['ō', 'ās', 'at', 'āmus', 'ātis', 'ant'],
  2: ['eō', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
  3: ['ō', 'is', 'it', 'imus', 'itis', 'unt'],
  4: ['iō', 'īs', 'it', 'īmus', 'ītis', 'iunt'],
};

export function conjugacionDe(e: EntradaVerbal): Conjugacion {
  const inf = e.infinitivo.normalize('NFC');
  if (inf.endsWith('āre')) return 1;
  if (inf.endsWith('ēre')) return 2;
  if (inf.endsWith('īre')) return 4;
  if (inf.endsWith('ere')) return 3;
  throw new Error(`infinitivo «${inf}» no es de ninguna de las cuatro`);
}

const temaVerbal = (e: EntradaVerbal) =>
  e.infinitivo.normalize('NFC').replace(/(āre|ēre|īre|ere)$/, '');

export function conjugar(e: EntradaVerbal, p: Persona): string {
  const c = conjugacionDe(e);
  return temaVerbal(e) + V[c]![PERSONAS.indexOf(p)]!;
}

export function paradigmaVerbal(e: EntradaVerbal): Record<Persona, string> {
  return Object.fromEntries(PERSONAS.map((p) => [p, conjugar(e, p)])) as Record<Persona, string>;
}
