// lib/data/languages/la/subjuntivo.ts
//
// LOS CUATRO TIEMPOS DEL SUBJUNTIVO.
//
// ══ POR QUÉ ES LA PIEZA MÁS GRANDE QUE FALTABA ══════════════════════
//
// Contados los puntos del inventario que NOMBRAN el subjuntivo en su
// descriptor, su `varia` o su excepción: **dieciocho**. Trece o catorce lo
// necesitan de verdad —`l7-morfologia-subj`, las tres de `ut`, la
// interrogativa indirecta, la consecutio, los condicionales, el cum
// histórico, la oratio obliqua, las causales, las concesivas— y hasta hoy
// `conjugar` tenía presente, imperfecto y futuro, y nada más.
//
// ══ LAS CUATRO FORMACIONES, Y DOS SON REGULARES DE VERDAD ════════════
//
//   PRESENTE          cambia por conjugación, y es el único que lo hace
//                     1.ª  `amem, amēs, amet`      la `ā` del tema → `ē`
//                     2.ª  `moneam, moneās`        se inserta `-ā-`
//                     3.ª  `regam, regās`          se inserta `-ā-`
//                     4.ª  `audiam, audiās`        se inserta `-ā-`
//
//   IMPERFECTO        INFINITIVO + desinencia personal, en las cuatro:
//                     `amāre-m`, `monēre-m`, `regere-m`, `audīre-m`.
//                     Es la formación más regular del verbo latino.
//
//   PERFECTO          tema de perfecto + `-erim, -erīs, -erit…`
//   PLUSCUAMPERFECTO  tema de perfecto + `-issem, -issēs, -isset…`
//                     y también: INFINITIVO DE PERFECTO + desinencia,
//                     porque `amāvisse` + `m` es `amāvissem`.
//
// ══ LA HOMONIMIA QUE OTRO PUNTO YA DECLARA ═══════════════════════════
//
// `l5-futuro-dos-formas` dice en su excepción: «la 1.ª persona de la 3.ª y
// 4.ª ("regam", "audiam") es idéntica al presente de subjuntivo: sólo el
// contexto separa». Ahora que la máquina produce las dos, esa afirmación
// es **comprobable**, y hay un test que la comprueba en vez de creérsela.
import {
  conjugacionDe, esMixta, temaDePerfecto, conjugar,
  type EntradaVerbal, type Persona,
} from './paradigma-la';

export type TiempoSubj = 'presente' | 'imperfecto' | 'perfecto' | 'pluscuamperfecto';
export const TIEMPOS_SUBJ: TiempoSubj[] = ['presente', 'imperfecto', 'perfecto', 'pluscuamperfecto'];
export const PERSONAS_SUBJ: Persona[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

/** Las desinencias personales que se pegan al tema del subjuntivo. La `m`
 *  de la 1.ª singular es la marca: el indicativo tiene `-ō` y el subjuntivo
 *  `-m`, salvo el futuro de la 3.ª y la 4.ª, que es justo la homonimia. */
const PERSONALES: Record<Persona, string> = {
  '1sg': 'm', '2sg': 's', '3sg': 't', '1pl': 'mus', '2pl': 'tis', '3pl': 'nt',
};
/** Con vocal larga delante en todas menos la 1.ª sg y la 3.ª sg/pl. */
const LARGA: Record<Persona, boolean> = {
  '1sg': false, '2sg': true, '3sg': false, '1pl': true, '2pl': true, '3pl': false,
};

/** Los que no se derivan y van en tabla, con su motivo. */
export const SUBJUNTIVO_IRREGULAR: Record<string, Partial<Record<TiempoSubj, Record<Persona, string>>>> = {
  'sum': {
    presente: { '1sg': 'sim', '2sg': 'sīs', '3sg': 'sit', '1pl': 'sīmus', '2pl': 'sītis', '3pl': 'sint' },
    imperfecto: { '1sg': 'essem', '2sg': 'essēs', '3sg': 'esset', '1pl': 'essēmus', '2pl': 'essētis', '3pl': 'essent' },
  },
  'possum': {
    presente: { '1sg': 'possim', '2sg': 'possīs', '3sg': 'possit', '1pl': 'possīmus', '2pl': 'possītis', '3pl': 'possint' },
    imperfecto: { '1sg': 'possem', '2sg': 'possēs', '3sg': 'posset', '1pl': 'possēmus', '2pl': 'possētis', '3pl': 'possent' },
  },
  'volō': {
    presente: { '1sg': 'velim', '2sg': 'velīs', '3sg': 'velit', '1pl': 'velīmus', '2pl': 'velītis', '3pl': 'velint' },
    imperfecto: { '1sg': 'vellem', '2sg': 'vellēs', '3sg': 'vellet', '1pl': 'vellēmus', '2pl': 'vellētis', '3pl': 'vellent' },
  },
  'nōlō': {
    presente: { '1sg': 'nōlim', '2sg': 'nōlīs', '3sg': 'nōlit', '1pl': 'nōlīmus', '2pl': 'nōlītis', '3pl': 'nōlint' },
    imperfecto: { '1sg': 'nōllem', '2sg': 'nōllēs', '3sg': 'nōllet', '1pl': 'nōllēmus', '2pl': 'nōllētis', '3pl': 'nōllent' },
  },
  'mālō': {
    presente: { '1sg': 'mālim', '2sg': 'mālīs', '3sg': 'mālit', '1pl': 'mālīmus', '2pl': 'mālītis', '3pl': 'mālint' },
    imperfecto: { '1sg': 'māllem', '2sg': 'māllēs', '3sg': 'māllet', '1pl': 'māllēmus', '2pl': 'māllētis', '3pl': 'māllent' },
  },
  'eō': {
    presente: { '1sg': 'eam', '2sg': 'eās', '3sg': 'eat', '1pl': 'eāmus', '2pl': 'eātis', '3pl': 'eant' },
    imperfecto: { '1sg': 'īrem', '2sg': 'īrēs', '3sg': 'īret', '1pl': 'īrēmus', '2pl': 'īrētis', '3pl': 'īrent' },
  },
  'fīō': {
    presente: { '1sg': 'fīam', '2sg': 'fīās', '3sg': 'fīat', '1pl': 'fīāmus', '2pl': 'fīātis', '3pl': 'fīant' },
    imperfecto: { '1sg': 'fierem', '2sg': 'fierēs', '3sg': 'fieret', '1pl': 'fierēmus', '2pl': 'fierētis', '3pl': 'fierent' },
  },
  'dō': {
    presente: { '1sg': 'dem', '2sg': 'dēs', '3sg': 'det', '1pl': 'dēmus', '2pl': 'dētis', '3pl': 'dent' },
    imperfecto: { '1sg': 'darem', '2sg': 'darēs', '3sg': 'daret', '1pl': 'darēmus', '2pl': 'darētis', '3pl': 'darent' },
  },
  'ferō': {
    presente: { '1sg': 'feram', '2sg': 'ferās', '3sg': 'ferat', '1pl': 'ferāmus', '2pl': 'ferātis', '3pl': 'ferant' },
    imperfecto: { '1sg': 'ferrem', '2sg': 'ferrēs', '3sg': 'ferret', '1pl': 'ferrēmus', '2pl': 'ferrētis', '3pl': 'ferrent' },
  },
};

/** El tema del presente de subjuntivo. Es la ÚNICA formación que cambia
 *  por conjugación, y por eso es la que hay que enseñar. */
function temaPresente(e: EntradaVerbal): string {
  const inf = e.infinitivo.normalize('NFC');
  const c = esMixta(e) ? 3 : conjugacionDe(e);
  if (c === 1) return `${inf.replace(/āre$/, '')}ē`;          // amā- → amē-
  if (c === 2) return `${inf.replace(/ēre$/, '')}eā`;          // monē- → moneā-
  if (c === 4) return `${inf.replace(/īre$/, '')}iā`;          // audī- → audiā-
  // 3.ª y mixta: el tema del presente más `-ā-`. La mixta conserva la `i`.
  const tema = inf.replace(/ere$/, '');
  return esMixta(e) ? `${tema}iā` : `${tema}ā`;
}

function pegar(tema: string, p: Persona): string {
  const larga = LARGA[p];
  const base = larga ? tema : tema.replace(/[āē]$/, (m) => (m === 'ā' ? 'a' : 'e'));
  return base + PERSONALES[p];
}

export function subjuntivo(e: EntradaVerbal, t: TiempoSubj, p: Persona): string | null {
  const irr = SUBJUNTIVO_IRREGULAR[e.lema.normalize('NFC')]?.[t];
  if (irr) return irr[p];
  if (t === 'presente') return pegar(temaPresente(e), p);
  if (t === 'imperfecto') {
    // INFINITIVO + desinencia. La formación más regular del verbo latino.
    //
    // Y la `e` final del infinitivo se ALARGA ante las desinencias de vocal
    // larga: `amāre` + `s` es `amārēs`, no *`amāreēs`. La primera versión
    // añadía una `ē` en vez de alargar la que hay, y salía una vocal de
    // más en cuatro de las seis personas.
    const inf = e.infinitivo.normalize('NFC');
    const base = LARGA[p] ? inf.replace(/e$/, 'ē') : inf;
    return base + PERSONALES[p];
  }
  const tp = temaPerfectoDe(e);
  if (tp === null) return null;
  if (t === 'perfecto') {
    const larga = LARGA[p];
    return `${tp}er${larga ? 'ī' : 'i'}${PERSONALES[p]}`;
  }
  // Pluscuamperfecto: tema de perfecto + `-isse-` + desinencia, que es el
  // INFINITIVO DE PERFECTO más la desinencia.
  const larga = LARGA[p];
  return `${tp}iss${larga ? 'ē' : 'e'}${PERSONALES[p]}`;
}

function temaPerfectoDe(e: EntradaVerbal): string | null {
  const irr = SUBJUNTIVO_IRREGULAR[e.lema.normalize('NFC')];
  if (irr && !irr.perfecto) {
    // `sum` y compañía sí tienen perfectum regular desde su tema.
    const t = temaDePerfecto(e);
    return t;
  }
  return temaDePerfecto(e);
}

export function paradigmaSubjuntivo(e: EntradaVerbal): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of TIEMPOS_SUBJ)
    for (const p of PERSONAS_SUBJ) {
      const f = subjuntivo(e, t, p);
      if (f) out[`${t}.${p}`] = f;
    }
  return out;
}

/** ── LA PASIVA DEL SUBJUNTIVO ──
 *
 *  `amer, amēris, amētur, amēmur, amēminī, amentur` y `amārer, amārēris…`.
 *  Se forma sobre el MISMO tema que la activa, cambiando el juego de
 *  desinencias — igual que en el indicativo, que es lo que enseña
 *  `l6-pasiva-infectum`.
 *
 *  Entra el 2026-09-12 porque la auditoría invertida la pidió en cuanto se
 *  le abrieron los filtros: `vidērētur` ×22 y no la producía nadie. */
const PASIVAS: Record<Persona, string> = {
  '1sg': 'r', '2sg': 'ris', '3sg': 'tur', '1pl': 'mur', '2pl': 'minī', '3pl': 'ntur',
};
// La 2.ª del plural SÍ lleva vocal larga: `amēminī`, como el indicativo
// `amāminī`. La primera versión la puso breve y salía *`ameminī`.
const LARGA_PAS: Record<Persona, boolean> = {
  '1sg': false, '2sg': true, '3sg': true, '1pl': true, '2pl': true, '3pl': false,
};

export function subjuntivoPasivo(e: EntradaVerbal, t: TiempoSubj, p: Persona): string | null {
  if (t !== 'presente' && t !== 'imperfecto') return null;   // el perfectum pasivo es perifrástico
  if (SIN_PASIVA_SUBJ.has(e.lema.normalize('NFC'))) return null;
  let tema: string;
  if (t === 'presente') tema = temaPresente(e);
  else tema = e.infinitivo.normalize('NFC').replace(/e$/, 'ē');
  const base = LARGA_PAS[p] ? tema : tema.replace(/[āē]$/, (m) => (m === 'ā' ? 'a' : 'e'));
  return base + PASIVAS[p];
}

/** Los que no tienen pasiva, con su motivo — igual que en `infinitivos.ts`:
 *  se declara en vez de dejar que un `try` se lo trague. */
export const SIN_PASIVA_SUBJ = new Set(['sum', 'possum', 'eō', 'fīō', 'volō', 'nōlō', 'mālō']);

/** ¿Coincide con alguna forma del INDICATIVO del mismo verbo? Es la
 *  homonimia que `l5-futuro-dos-formas` declara para «regam» y «audiam», y
 *  ahora se puede comprobar en vez de creerla. */
export function homonimoDelIndicativo(e: EntradaVerbal, t: TiempoSubj, p: Persona): string | null {
  const s = subjuntivo(e, t, p);
  if (!s) return null;
  for (const ti of ['presente', 'imperfecto', 'futuro'] as const) {
    let f: string;
    try { f = conjugar(e, p, ti); } catch { continue; }
    if (f.normalize('NFC') === s.normalize('NFC')) return `${ti}.${p}`;
  }
  return null;
}
