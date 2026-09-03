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
  /** Sólo en la 3.ª: si el tema es en `-i`. No se deduce de la forma
   *  —`urbs/urbis` lo es y `rēx/rēgis` no— así que es DATO, como el
   *  genitivo. Cambia el genitivo plural (`-ium`) y, en los neutros, el
   *  ablativo singular (`-ī`) y el nominativo plural (`-ia`). */
  iStem?: boolean;
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
// La 3.ª. El nominativo singular NO es derivable del tema —`rēx` contra
// `rēg-`, `nōmen` contra `nōmin-`, `opus` contra `oper-`— así que es el
// lema quien lo pone, igual que en los `-er` de la 2.ª. Es el punto
// `l2-genitivo-clave` otra vez: de la forma de diccionario no sale nada;
// del genitivo sale todo.
const N3: Record<Numero, string[]> = {
  sg: ['', 'em', 'is', 'ī', 'e', ''],
  pl: ['ēs', 'ēs', 'um', 'ibus', 'ibus', 'ēs'],
};
const N3_NEUTRO: Record<Numero, string[]> = {
  sg: ['', '', 'is', 'ī', 'e', ''],
  pl: ['a', 'a', 'um', 'ibus', 'ibus', 'a'],
};
const ORDEN: Caso[] = ['nom', 'ac', 'gen', 'dat', 'abl', 'voc'];

export type Declinacion = '1ª' | '2ª' | '3ª';

export function declinacionDe(e: EntradaNominal): Declinacion {
  const g = e.genitivo.normalize('NFC');
  if (g.endsWith('ae')) return '1ª';
  if (g.endsWith('ī')) return '2ª';
  if (g.endsWith('is')) return '3ª';
  throw new Error(`genitivo «${g}» fuera de L1: 1.ª (-ae), 2.ª (-ī) o 3.ª (-is)`);
}

const temaDe = (e: EntradaNominal) =>
  e.genitivo.normalize('NFC').replace(/(ae|ī|is)$/, '');

export function declinar(e: EntradaNominal, caso: Caso, num: Numero): string {
  const decl = declinacionDe(e);
  const tema = temaDe(e);
  const i = ORDEN.indexOf(caso);

  if (decl === '1ª') return tema + N1[num]![i]!;

  if (decl === '3ª') {
    // Nominativo, acusativo y vocativo del neutro, y nominativo y
    // vocativo de los demás: la forma es el LEMA, no el tema + desinencia.
    const esLema = num === 'sg' && (caso === 'nom' || caso === 'voc' || (e.genero === 'n' && caso === 'ac'));
    if (esLema) return e.lema.normalize('NFC');
    const t3 = e.genero === 'n' ? N3_NEUTRO : N3;
    let d = t3[num]![i]!;
    if (e.iStem) {
      if (caso === 'gen' && num === 'pl') d = 'ium';
      if (e.genero === 'n' && num === 'sg' && caso === 'abl') d = 'ī';
      if (e.genero === 'n' && num === 'pl' && (caso === 'nom' || caso === 'ac' || caso === 'voc')) d = 'ia';
    }
    return tema + d;
  }

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

// ── ADJETIVO DE LA PRIMERA CLASE (bonus / bona / bonum) ───────────────
//
// Declina como la 2.ª en masculino y neutro y como la 1.ª en femenino, o
// sea que **la máquina ya existe**: un adjetivo es tres entradas
// nominales que comparten tema. Se construyen aquí en vez de duplicar las
// tablas, porque una regla copiada se desincroniza en la copia N+1.
//
// Lo que este tipo NO cubre y se dice en vez de disimularse: los
// adjetivos de la 3.ª (`ācer`, `omnis`, `fēlīx`), que son el punto
// `l4-adjetivo-3a` y necesitan la 3.ª declinación en la máquina.

export interface EntradaAdjetivo {
  /** Nominativo singular masculino: `bonus`, `magnus`, `pulcher`. */
  lema: string;
  /** El tema, que en los `-er` no se deduce del lema (`pulcher/pulchr-`,
   *  `miser/miser-`). Mismo motivo que el genitivo en los nombres. */
  tema: string;
  glosa: string;
}

export function declinarAdjetivo(a: EntradaAdjetivo, genero: 'm' | 'f' | 'n', caso: Caso, num: Numero): string {
  const t = a.tema.normalize('NFC');
  const como: EntradaNominal =
    genero === 'f' ? { lema: t + 'a', genitivo: t + 'ae', genero: 'f', glosa: a.glosa }
    : genero === 'n' ? { lema: t + 'um', genitivo: t + 'ī', genero: 'n', glosa: a.glosa }
    : { lema: a.lema, genitivo: t + 'ī', genero: 'm', glosa: a.glosa };
  return declinar(como, caso, num);
}

/** La forma que concuerda con un sustantivo en una celda dada. El género
 *  lo pone el SUSTANTIVO, no la desinencia — que es el punto entero. */
export function concuerda(a: EntradaAdjetivo, n: EntradaNominal, caso: Caso, num: Numero): string {
  return declinarAdjetivo(a, n.genero, caso, num);
}
