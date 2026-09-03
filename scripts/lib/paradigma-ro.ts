// scripts/lib/paradigma-ro.ts — EL PARADIGMA DEL RUMANO, por regla.
//
// Es la máquina de la que cuelgan el cloze derivado y la transformación
// en rumano (Paso 0 §4): la forma correcta se CALCULA desde el lexicón y
// el gate la recalcula, en vez de fiarse del autor. En PT la regla
// equivalente vive en `paradigma-pt.ts` y sólo conjuga, porque el
// portugués no declina; aquí la mitad del trabajo es NOMINAL.
//
// ── EL REPARTO GUARDAR / DERIVAR, y por qué ───────────────────────────
//
// Se GUARDA en el lexicón lo que no es predecible desde el lema, y se
// DERIVA lo demás. La línea la marcó el ataque adversarial del inventario
// (E2#30) y se comprobó en dexonline lema a lema:
//
//   · el PLURAL: `masă/mese` pero `casă/case`, `tren/trenuri` pero
//     `scaun/scaune` — la clase no sale del singular, se guarda;
//   · la 1.ª y la 3.ª sg del PRESENTE: `dorm/doarme`, `văd/vede`,
//     `lăs/lasă`, `mănânc/mănâncă` — las alternancias vocálicas dependen
//     del acento y no de la conjugación, se guardan;
//   · el PARTICIPIO de la 3.ª conjugación (mers, spus, scris) y los
//     irregulares (făcut, fost): se guardan;
//   · el VOCATIVO singular: -ule por defecto, -e por lema, y el REGISTRO,
//     que ningún diccionario da.
//
// Se DERIVA: el artículo enclítico (sg y pl), el genitivo-dativo (indef y
// def, sg y pl), el vocativo plural (= GD plural), la 2.ª sg del presente
// (palatalización t→ț, d→z, s→ș, sc→șt), 1.ª y 2.ª pl (desde el tema del
// infinitivo, no desde la 1.ª sg: văd → vedem), 3.ª pl, el imperfecto y el
// perfect compus.
//
// ── LO QUE ESTE MÓDULO NO CERTIFICA ───────────────────────────────────
//
// Que una forma salga de aquí no la hace correcta: la hace CONSISTENTE con
// el lexicón. El segundo camino, independiente, es Hunspell ro_RO
// (`hunspell-ro.ts`): gate LÉXICO, que caza `*draji`, `*domne`, `*fate`
// pero no certifica una forma ausente del diccionario (rechaza
// `doctorule`, atestado en dexonline). Lo que Hunspell no puede ver lo ve
// el lingüista. Un sello responde a UNA pregunta.
//
// Toda forma pasa por `formaValida` antes de salir: una concatenación con
// `undefined` dentro se devuelve como null, no como palabra. Es la
// cicatriz de «trouxeundefined» de PT.

export type Genero = 'm' | 'f' | 'n';
export type Numero = 'sg' | 'pl';
export type Caso = 'NAc' | 'GD';
export type Registro = 'neutru' | 'familiar' | 'brusc' | 'popular';

export interface LemaNominal {
  lema: string;
  genero: Genero;
  /** Guardado, no derivado: la clase de plural no sale del singular. */
  plural: string;
  /** Vocativo singular guardado por lema; `null` = sin marca (frate!, Maria!). */
  vocSg?: string | null;
  vocAlt?: string[];
  /** Obligatorio si hay vocativo marcado: -ule sobre un común es brusco. */
  registro?: Registro;
  /** DIMINUTIVO, guardado y NUNCA derivado. El reparto de sufijos
   *  (-uță, -el, -iță, -aș, -uleț, -cică, -șoară) no sale del lema: es
   *  léxico, como la clase de plural. cafea→cafeluță pero pahar→păhărel y
   *  fată→fetiță; un hispanohablante pondría «-ito» a todo y acertaría
   *  cero. Punto `r10-diminutivo-atenuador` del inventario, re-encuadrado
   *  el 2026-09-02: lo que se examina es la ELECCIÓN, no el efecto
   *  cortés (ése lo calca el español de México sin saber rumano). */
  dim?: string;
  /** Plural del diminutivo, guardado por la MISMA razón que el diminutivo
   *  y con una vuelta de tuerca: el sufijo cambia de alomorfo en plural
   *  (floricică → floricele, cărticică → cărticele; DOOM3 g.-d. art.
   *  floricelei). La regla femenina «-ă → -e» daría *floricice. Lo cazó
   *  el lingüista como ERROR-EN-ESPERA: no explota hoy porque nada
   *  pluraliza `dim`, y explotaría el día que alguien lo derivara. */
  dimPlural?: string;
  /** Dobletes ESTÁNDAR del genitivo-dativo definido singular, que DOOM3 sí
   *  admite en un puñado de lemas (tată: tatălui / tatii / tatei; soră:
   *  surorii / sorei; noră: nurorii). `genitivoDativo()` devuelve una sola
   *  cadena, así que sin este campo la tarjeta suspendería una respuesta
   *  correcta y ningún gate lo vería. Mismo patrón que `dimPlural`: se
   *  guarda antes de que muerda. Lo cazó el lingüista en el lote 7, por
   *  OMISIÓN — no había ítem roto, había un campo que faltaba. */
  gdAlt?: string[];
  /** OBLIGATORIO si hay `dim`, y lo exige un invariante. Regla pagada con
   *  `supică` y `ceaiuț`, que se colaron en un lote y no están en DEX,
   *  MDA2, DLR ni DOOM3: un diminutivo sin fuente no entra. */
  dimFuente?: string;
  gloss: string;
}

export function formaValida(forma: string | null | undefined): string | null {
  if (typeof forma !== 'string' || !forma) return null;
  return /undefined|null|NaN/.test(forma) ? null : forma;
}

/** Artículo definido enclítico. */
export function articulado(l: LemaNominal, n: Numero): string | null {
  if (n === 'pl') {
    const p = l.plural;
    if (l.genero === 'm' && p.endsWith('i')) return formaValida(p + 'i');        // oameni → oamenii
    if (/(e|i|uri)$/.test(p)) return formaValida(p + 'le');                        // case → casele, cărți → cărțile, trenuri → trenurile
    return null;
  }
  const s = l.lema;
  if (l.genero === 'f') {
    if (s.endsWith('ie')) return formaValida(s.slice(0, -2) + 'ia');              // familie → familia
    if (s.endsWith('ă')) return formaValida(s.slice(0, -1) + 'a');                // casă → casa
    if (s.endsWith('e')) return formaValida(s + 'a');                              // carte → cartea, floare → floarea
    if (s.endsWith('a')) return formaValida(s + 'ua');                             // cafea → cafeaua
    if (s.endsWith('i')) return formaValida(s + 'ua');                             // zi → ziua
    return null;
  }
  // masculino y neutro
  if (s.endsWith('u')) return formaValida(s + 'l');                                // metrou → metroul, leu → leul
  if (s.endsWith('e')) return formaValida(s + 'le');                               // frate → fratele, nume → numele
  if (s.endsWith('ă')) return formaValida(s + 'l');                                // tată → tatăl
  return formaValida(s + 'ul');                                                    // om → omul
}

/** Genitivo-dativo. Indefinido: m/n = nominativo; f = la forma del plural
 *  (unei case, unei cărți). Definido: m/n = articulado + ui; f = plural + i
 *  (casei, cărții), con -ie → -iei; plural definido = plural + lor. */
export function genitivoDativo(l: LemaNominal, n: Numero, definido: boolean): string | null {
  if (n === 'pl') return definido ? formaValida(l.plural + 'lor') : formaValida(l.plural);
  if (l.genero === 'f') {
    if (!definido) return formaValida(l.plural);
    // familie → familiei (-ie átona tras consonante); femeie → femeii (-eie: la i es del plural)
    if (l.lema.endsWith('ie') && !/[aeiou]ie$/.test(l.lema)) return formaValida(l.lema.slice(0, -2) + 'iei');
    const p = l.plural;
    return formaValida(p.endsWith('i') ? p + 'i' : p + 'i');                      // cărți → cărții, case → casei
  }
  if (!definido) return formaValida(l.lema);
  const art = articulado(l, 'sg');
  if (!art) return null;
  return formaValida(art.endsWith('le') ? art.slice(0, -2) + 'lui' : art + 'ui');  // omul → omului, fratele → fratelui, tatăl → tatălui
}

/** Diminutivo: SÓLO lo guardado. No hay rama que lo derive, y es
 *  deliberado — si mañana alguien escribe una regla «-ă → -uță», este
 *  módulo empezará a fabricar *apuță por apșoară y nadie lo verá. */
export function diminutivo(l: LemaNominal): string | null {
  return l.dim ? formaValida(l.dim) : null;
}

/** Vocativo: singular guardado por lema (o sin marca); plural = GD plural. */
export function vocativo(l: LemaNominal, n: Numero): string | null {
  if (n === 'pl') return l.genero === 'n' ? null : formaValida(l.plural + 'lor');
  if (l.genero === 'n') return null;
  if (l.vocSg === undefined) return null;   // no declarado: no se inventa
  return l.vocSg === null ? formaValida(l.lema) : formaValida(l.vocSg);
}

// ── Verbo ─────────────────────────────────────────────────────────────

export type Conjugacion = 'I' | 'II' | 'III' | 'IV' | 'IVî';
export type Persona = 'eu' | 'tu' | 'el' | 'noi' | 'voi' | 'ei';
export const PERSONAS: readonly Persona[] = ['eu', 'tu', 'el', 'noi', 'voi', 'ei'];
export const esPersona = (p: unknown): p is Persona => PERSONAS.includes(p as Persona);

export interface LemaVerbal {
  /** Infinitivo con partícula: «a lucra». Nunca una forma finita. */
  inf: string;
  /** Guardadas: 1.ª sg y 3.ª sg del presente. */
  sg1: string;
  sg3: string;
  /** Sólo si la derivación no vale (a învăța → înveți, a veni → vii). */
  sg2?: string;
  /** Participio: se guarda si es irregular o de 3.ª conjugación. */
  participio?: string;
  /** Verbo enteramente irregular: el paradigma completo, guardado. */
  irregular?: Record<Persona, string>;
  /** 1.ª sg del imperfecto, guardada cuando no se deriva: dădeam, stăteam,
   *  voiam, beam, făceam. Las demás personas salen de ella. */
  impf?: string;
  /** Invariable (a trebui): una sola forma para todas las personas. */
  invariable?: boolean;
  gloss: string;
}

/** La conjugación sale de la terminación del infinitivo. */
export function conjugacionDe(inf: string): Conjugacion {
  const v = inf.replace(/^a /, '');
  if (v.endsWith('ea')) return 'II';
  if (v.endsWith('a')) return 'I';
  if (v.endsWith('e')) return 'III';
  if (v.endsWith('î')) return 'IVî';
  if (v.endsWith('i')) return 'IV';
  throw new Error(`conjugacionDe: «${inf}» no es un infinitivo rumano`);
}

/** El tema del infinitivo: lo que queda al quitar «a » y la desinencia. */
export function temaInfinitivo(inf: string): string {
  const v = inf.replace(/^a /, '');
  const c = conjugacionDe(inf);
  const t = c === 'II' ? v.slice(0, -2) : v.slice(0, -1);
  // «a ști»: quitar la -i deja «șt», sin vocal. La i ES del tema.
  return /[aeiouăâî]/.test(t) ? t : v;
}

/** Las desinencias que empiezan por i/e pierden esa vocal tras tema en -i:
 *  ști + im → știm, scri + em → scriem (no), ști + iți → știți. */
const pegar = (tema: string, des: string) => (tema.endsWith('i') && des.startsWith('i') ? tema + des.slice(1) : tema + des);

/** Palatalización ante la -i de 2.ª sg (y de plural nominal): t→ț, d→z,
 *  s→ș, sc→șt, st→șt. c y g NO cambian en la grafía (plec → pleci, merg → mergi). */
export function palatalizar(tema: string): string {
  if (tema.endsWith('sc')) return tema.slice(0, -2) + 'șt';
  if (tema.endsWith('st')) return tema.slice(0, -2) + 'șt';
  if (tema.endsWith('t')) return tema.slice(0, -1) + 'ț';
  if (tema.endsWith('d')) return tema.slice(0, -1) + 'z';
  if (tema.endsWith('s')) return tema.slice(0, -1) + 'ș';
  return tema;
}

/** Presente. Las casillas guardadas se devuelven tal cual; las demás se derivan. */
export function presente(v: LemaVerbal, p: Persona): string | null {
  if (v.invariable) return formaValida(v.sg3);
  if (v.irregular) return formaValida(v.irregular[p]);
  const c = conjugacionDe(v.inf);
  const tema = temaInfinitivo(v.inf);
  switch (p) {
    case 'eu': return formaValida(v.sg1);
    case 'el': return formaValida(v.sg3);
    case 'tu': {
      if (v.sg2) return formaValida(v.sg2);
      const s = v.sg1;
      if (s.endsWith('u') && !/[aeo]u$/.test(s)) return formaValida(s.slice(0, -1) + 'i'); // scriu → scrii, știu → știi
      if (/[aeo]u$/.test(s)) return formaValida(s.slice(0, -1) + 'i');                       // dau → dai, stau → stai
      return formaValida(palatalizar(s) + 'i');                                                // văd → vezi, plec → pleci, citesc → citești
    }
    case 'noi':
      if (c === 'I') return formaValida(tema + 'ăm');
      if (c === 'IVî') return formaValida(tema + 'âm');
      if (c === 'IV') return formaValida(pegar(tema, 'im'));
      return formaValida(tema + 'em');                                                         // II y III
    case 'voi':
      if (c === 'I') return formaValida(tema + 'ați');
      if (c === 'IVî') return formaValida(tema + 'âți');
      if (c === 'IV') return formaValida(pegar(tema, 'iți'));
      return formaValida(tema + 'eți');
    case 'ei': {
      // 3.ª pl = 3.ª sg en la 1.ª conjugación y en -î sin sufijo (ei cântă,
      // ei coboară); = 1.ª sg en el resto (ei văd, ei merg, ei dorm, ei citesc).
      const sufijo = /(ez|esc|ăsc)$/.test(v.sg1);
      if (c === 'I') return formaValida(v.sg3);
      if (c === 'IVî' && !sufijo) return formaValida(v.sg3);
      return formaValida(v.sg1);
    }
  }
}

export function participio(v: LemaVerbal): string | null {
  if (v.participio) return formaValida(v.participio);
  const c = conjugacionDe(v.inf);
  const tema = temaInfinitivo(v.inf);
  if (c === 'I') return formaValida(tema + 'at');
  if (c === 'II') return null;                                                 // văzut, băut, avut, putut: se guarda
  if (c === 'IV') return formaValida(pegar(tema, 'it'));                     // dormit, știut? no: știut se guarda si hace falta
  if (c === 'IVî') return formaValida(tema + 'ât');
  return null; // II y III: siempre guardados (văzut, mers, spus, scris, făcut)
}

const AUX_PC: Record<Persona, string> = { eu: 'am', tu: 'ai', el: 'a', noi: 'am', voi: 'ați', ei: 'au' };
export function perfectCompus(v: LemaVerbal, p: Persona): string | null {
  const part = participio(v);
  return part ? formaValida(`${AUX_PC[p]} ${part}`) : null;
}

const DES_IMPF: Record<Persona, string> = { eu: 'am', tu: 'ai', el: 'a', noi: 'am', voi: 'ați', ei: 'au' };
/** Imperfecto: I y -î sobre el tema + am…; II, III, IV sobre tema + e + am…
 *  (vedeam, mergeam, dormeam), salvo tema en -i (ști → știam, scri → scriam).
 *  «a fi» es irregular (eram) y va guardado. */
const IMPERFECTO_IRREGULAR: Record<string, Record<Persona, string>> = {
  'a fi': { eu: 'eram', tu: 'erai', el: 'era', noi: 'eram', voi: 'erați', ei: 'erau' },
};
export function imperfecto(v: LemaVerbal, p: Persona): string | null {
  if (IMPERFECTO_IRREGULAR[v.inf]) return formaValida(IMPERFECTO_IRREGULAR[v.inf]![p]);
  if (v.invariable) return formaValida('trebuia');
  if (v.impf) {
    // Guardada la 1.ª sg (dădeam): las demás sobre su base (dăde-).
    if (!v.impf.endsWith('am')) return null;
    return formaValida(v.impf.slice(0, -2) + DES_IMPF[p]);
  }
  if (v.irregular) return null;                                              // sin impf guardado no se inventa (*daam)
  const c = conjugacionDe(v.inf);
  const tema = temaInfinitivo(v.inf);
  if (c === 'I' || c === 'IVî') return formaValida(tema + DES_IMPF[p]);
  if (tema.endsWith('i')) return formaValida(tema + DES_IMPF[p]);            // știam, scriam
  if (/[aeouăâ]$/.test(tema)) return formaValida(tema + 'i' + DES_IMPF[p]); // locuiam
  return formaValida(tema + 'e' + DES_IMPF[p]);                              // vedeam, mergeam, dormeam
}

/** Todo el paradigma nominal de un lema, para el gate y para los lotes. */
export function paradigmaNominal(l: LemaNominal): Record<string, string | null> {
  return {
    'N sg': l.lema, 'N pl': l.plural,
    'N sg art': articulado(l, 'sg'), 'N pl art': articulado(l, 'pl'),
    'GD sg indef': genitivoDativo(l, 'sg', false), 'GD sg def': genitivoDativo(l, 'sg', true),
    'GD pl indef': genitivoDativo(l, 'pl', false), 'GD pl def': genitivoDativo(l, 'pl', true),
    'V sg': vocativo(l, 'sg'), 'V pl': vocativo(l, 'pl'),
  };
}

export function paradigmaVerbal(v: LemaVerbal): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const p of PERSONAS) out[`pres ${p}`] = presente(v, p);
  for (const p of PERSONAS) out[`impf ${p}`] = imperfecto(v, p);
  out['participio'] = participio(v);
  out['pc eu'] = perfectCompus(v, 'eu');
  return out;
}

/** Las invariantes de FORMA de una entrada del lexicón, antes de derivar
 *  nada: el gate en rojo del ataque adversarial. */
export function invariantesLema(l: LemaNominal | LemaVerbal): string[] {
  const errores: string[] = [];
  if ('inf' in l) {
    if (!/^a [a-zăâîșț]+$/.test(l.inf)) errores.push(`${l.inf}: el infinitivo lleva «a » + una sola palabra`);
    // «*a lucrez»: la partícula del infinitivo con una forma finita. Va
    // ANTES de pedir la conjugación, que con esa forma no existe.
    if (/(ez|esc|ăsc|ează|ește)$/.test(l.inf.replace(/^a /, ''))) { errores.push(`${l.inf}: junta la partícula con una forma finita (*a lucrez)`); return errores; }
    if (/[şţ]/.test(JSON.stringify(l))) errores.push(`${l.inf}: cedilla`);
    if (l.irregular && !l.impf && !IMPERFECTO_IRREGULAR[l.inf]) errores.push(`${l.inf}: irregular sin imperfecto guardado (impf)`);
    if (!l.invariable && !l.irregular) {
      for (const k of ['sg1', 'sg3'] as const) if (!l[k]) errores.push(`${l.inf}: falta ${k}`);
      const c = conjugacionDe(l.inf);
      if (c === 'III' && !l.participio) errores.push(`${l.inf}: 3.ª conjugación sin participio guardado`);
      // II: el participio NO es regular (văzut, băut, avut frente a putut): se guarda.
      if (c === 'II' && !l.participio) errores.push(`${l.inf}: 2.ª conjugación sin participio guardado`);
    }
  } else {
    if (!/^[a-zăâîșț]+$/.test(l.lema)) errores.push(`${l.lema}: lema con caracteres fuera del alfabeto`);
    if (/[şţ]/.test(JSON.stringify(l))) errores.push(`${l.lema}: cedilla`);
    if (/ji$/.test(l.plural) && /g$/.test(l.lema)) errores.push(`${l.lema}: plural «${l.plural}» — g ante -i da gi, nunca ji (*draji)`);
    if (l.genero === 'f' && l.lema.endsWith('ă') && l.plural === l.lema) errores.push(`${l.lema}: plural igual al singular`);
    if (l.vocSg && !l.registro) errores.push(`${l.lema}: vocativo marcado «${l.vocSg}» sin registro`);
    if (l.genero === 'n' && l.vocSg) errores.push(`${l.lema}: un neutro no tiene vocativo`);
    // Sin fuente no entra: es la regla que costó dos diminutivos inventados.
    if (l.dim && !l.dimFuente) errores.push(`${l.lema}: diminutivo «${l.dim}» sin fuente (dimFuente) — un diminutivo sin atestar no entra`);
    // Los masculinos en -ă (tată, popă, vlădică) y los femeninos en -oră
    // son justo donde DOOM3 lista el doblete. Si el lema es de esa clase y
    // no declara `gdAlt`, o falta el doblete o falta escribir que no lo hay.
    if (/[ăa]$/.test(l.lema) && l.genero === 'm' && !l.gdAlt)
      errores.push(`${l.lema}: masculino en -ă sin \`gdAlt\` — DOOM3 lista doblete de genitivo-dativo para esta clase (tatălui / tatii / tatei) y la tarjeta compara exacto`);
    if (l.dim && !l.dimPlural) errores.push(`${l.lema}: diminutivo «${l.dim}» sin plural guardado (dimPlural) — el sufijo cambia de alomorfo (floricică → floricele) y la regla femenina daría *floricice`);
    if (l.dim && l.dim === l.lema) errores.push(`${l.lema}: el diminutivo es igual al lema`);
  }
  return errores;
}
