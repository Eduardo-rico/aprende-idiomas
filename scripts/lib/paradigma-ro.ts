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
  /** LA 3.ª PERSONA DEL CONJUNTIVO (`să ___`), guardada. Una sola casilla
   *  para singular y plural, porque el conjuntivo las funde: `el să meargă`
   *  y `ei să meargă`. Es la ÚNICA casilla del conjuntivo que se aparta del
   *  indicativo, y no es derivable: la alternancia vocálica se INVIERTE
   *  respecto al presente (merg/merge → meargă, văd/vede → vadă,
   *  încep/începe → înceapă) y la reducción del diptongo no es predecible
   *  desde ninguna casilla guardada (iese → iasă, no *iesă). Una regla
   *  «-e → -ă» produciría *mergă, *vedă, *începă: rumano de ninguna clase.
   *  Se guarda por la misma razón que el participio de 2.ª y 3.ª. */
  conj3?: string;
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
  if (/[aeiouăâî]/.test(t)) return t;
  // Sin vocal en el tema hay DOS casos y la v0 los trataba igual,
  // devolviendo el infinitivo entero:
  //   · «a ști» → «șt»: la -i ES del tema y hay que conservarla ⇒ «ști».
  //   · «a da», «a sta», «a bea», «a vrea» → «d», «st», «b», «vr»: el tema
  //     es la consonante, y devolver «da» fabricaba *daăm, *daat, *staat,
  //     *beaem, *vreaem.
  // Hoy no explotaba porque los cuatro llevan `irregular` y `participio`
  // guardados y ninguna rama llegaba aquí. Explotaría el día que alguien
  // quitara un record por «este verbo ya no hace falta guardarlo entero»,
  // y saldría `daăm` sin que nada fallara: es «el fallo que devuelve un
  // número plausible», sólo que aquí devuelve una PALABRA plausible.
  // Lo cazó el lingüista adversarial en el lote 14, por omisión.
  return /i$/.test(v) ? v : t;
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

/** El infinitivo CORTO: el único verbal vivo. El largo es la forma en
 *  -re (`mergere`), hoy sustantivo — cicatriz del primer ataque
 *  adversarial, que la encontró presentada como verbo. */
export const infinitivoCorto = (inf: string) => inf.replace(/^a /, '');

const AUX_VIITOR: Record<Persona, string> = { eu: 'voi', tu: 'vei', el: 'va', noi: 'vom', voi: 'veți', ei: 'vor' };
/** Viitor LITERAR: `voi/vei/va/vom/veți/vor` + infinitivo corto. Es el
 *  registro formal y escrito de los cuatro que el punto contrasta, y el
 *  ÚNICO de los cuatro que se deriva sin conjuntivo — por eso es el que
 *  el lote pide. Los otros tres (`o să`, `am să`, `oi`) son correctos y
 *  el inventario los enseña: el ítem tiene que FIJAR el registro o no
 *  está determinado. */
export function viitorLiterar(v: LemaVerbal, p: Persona): string | null {
  return formaValida(`${AUX_VIITOR[p]} ${infinitivoCorto(v.inf)}`);
}

const AUX_COND: Record<Persona, string> = { eu: 'aș', tu: 'ai', el: 'ar', noi: 'am', voi: 'ați', ei: 'ar' };
/** Condicional presente: `aș/ai/ar/am/ați/ar` + infinitivo corto. Y el
 *  perfecto, `aș fi` + participio. El auxiliar NO es el de `a avea` pese
 *  al parecido de `ai/am/ați`: es una serie propia, y por eso 1.ª pl.
 *  `am` coincide con el perfect compus y sólo el infinitivo/participio
 *  de detrás los separa. */
export function conditional(v: LemaVerbal, p: Persona): string | null {
  return formaValida(`${AUX_COND[p]} ${infinitivoCorto(v.inf)}`);
}
export function conditionalPerfect(v: LemaVerbal, p: Persona): string | null {
  const part = participio(v);
  return part ? formaValida(`${AUX_COND[p]} fi ${part}`) : null;
}

// ── Conjuntivo ────────────────────────────────────────────────────────
//
// EL REPARTO, y por qué esta función no deriva más de lo que deriva.
//
// El conjuntivo rumano es `să` + una forma que coincide con el presente de
// indicativo EN TODAS LAS PERSONAS MENOS LA TERCERA, donde singular y
// plural se funden en una casilla propia (`eu să merg`, `tu să mergi`,
// pero `el/ei să meargă`). Esa casilla es el punto entero de
// `r7-conjuntivo-presente`, y es justo la que NO se deriva:
//
//   · en la 1.ª conjugación SÍ hay regla y es limpia: la desinencia es
//     `-e` sobre el tema de la 1.ª sg (cânt → cânte, plec → plece,
//     mănânc → mănânce, lucrez → lucreze). Se deriva.
//   · con los sufijos `-esc` / `-iesc` / `-ăsc` también: `-ească`,
//     `-iască`, `-ască` (citesc → citească, locuiesc → locuiască,
//     hotărăsc → hotărască). Se deriva.
//   · en TODO lo demás se guarda. La alternancia vocálica se INVIERTE
//     respecto al presente —merg/merge da meargă, văd/vede da vadă,
//     încep/începe da înceapă— y la reducción del diptongo no es
//     predecible ni desde `sg1` ni desde `sg3` (a ieși: ies/iese → iasă,
//     no *iesă). Una regla «-e → -ă» fabricaría *mergă, *vedă, *începă.
//
// Y el guardián, que es lo que impide que esto se rompa en silencio: si un
// lema que necesita `conj3` no lo trae, `invariantesLema` da ERROR y
// `conjunctiv()` devuelve **null**. No hay fallback. Es la lección de
// `temaInfinitivo()`, que sobrevivió roto durante catorce lotes porque los
// cuatro lemas que lo habrían delatado llevaban su record guardado y
// ninguna rama llegaba al fallback: un derivador con fallback plausible no
// falla, MIENTE.
//
// ── LO QUE ESTA FUNCIÓN NO CUBRE, declarado ──────────────────────────
//   · El `să` NO lo pone: se compone fuera (`conjunctivSa`). Aquí se
//     devuelve la forma verbal sola, porque en el hueco de un cloze el
//     `să` puede estar ya escrito en la frase.
//   · La NEGACIÓN (`să nu meargă`) y los CLÍTICOS (`să-i spună`, `să se
//     ducă`) son colocación, no flexión: no pasan por aquí.
//   · El conjuntivo de los verbos con `se` obligatorio no está en el
//     lexicón A1 y por tanto no está cubierto por ningún gate.
//   · Hunspell certifica que la forma EXISTE, no que sea la del
//     conjuntivo de ESE lema: `mergi` y `mergem` también existen. La
//     casilla correcta la certifica el lingüista, no el diccionario. Y no
//     es teórico: **medido, Hunspell ACEPTA `vedă`**, que es justo lo que
//     la regla ingenua «-e → -ă» produciría para `a vedea`. De las siete
//     formas mal generadas que se le pasaron caza seis y deja pasar ésa,
//     así que el segundo camino habría dado VERDE sobre 2.751 formas con
//     `*să vedă` dentro. Lo que salva esa casilla es el invariante que
//     obliga a guardarla, no el diccionario. Está en un test con nombre.
const CONJUNCTIV_IRREGULAR: Record<string, Record<Persona, string>> = {
  // `a fi` es el ÚNICO verbo del lexicón cuyo conjuntivo se aparta del
  // indicativo también fuera de la 3.ª persona (să fiu / sunt, să fii /
  // ești, să fim / suntem). Guardarlo entero es la diferencia entre una
  // excepción declarada y una regla que se cree general.
  'a fi': { eu: 'fiu', tu: 'fii', el: 'fie', noi: 'fim', voi: 'fiți', ei: 'fie' },
};

/** ¿La 3.ª del conjuntivo de este lema se DERIVA, o hay que guardarla? */
export function conj3Derivable(v: LemaVerbal): boolean {
  if (v.irregular || v.invariable || CONJUNCTIV_IRREGULAR[v.inf]) return false;
  if (/(esc|iesc|ăsc)$/.test(v.sg1)) return true;
  return conjugacionDe(v.inf) === 'I';
}

/** La `ă` de la última sílaba se adelanta a `e` ante desinencia anterior.
 *  Sólo la ÚLTIMA VOCAL, y sólo si es `ă`: `â` no participa. */
function frontalizarUltimaVocal(tema: string): string {
  const m = [...tema.matchAll(/[aeiouăâî]/gu)];
  const ult = m[m.length - 1];
  if (!ult || ult[0] !== 'ă') return tema;
  return tema.slice(0, ult.index!) + 'e' + tema.slice(ult.index! + 1);
}

/** La 3.ª persona del conjuntivo (una casilla para sg y pl). Devuelve null
 *  —nunca una forma inventada— cuando hace falta guardarla y no está. */
export function conjunctiv3(v: LemaVerbal): string | null {
  if (CONJUNCTIV_IRREGULAR[v.inf]) return formaValida(CONJUNCTIV_IRREGULAR[v.inf]!.el);
  if (v.conj3) return formaValida(v.conj3);
  if (!conj3Derivable(v)) return null;
  const s = v.sg1;
  if (/iesc$/.test(s)) return formaValida(s.slice(0, -4) + 'iască');   // locuiesc → locuiască
  if (/esc$/.test(s)) return formaValida(s.slice(0, -3) + 'ească');     // citesc → citească
  if (/ăsc$/.test(s)) return formaValida(s.slice(0, -3) + 'ască');      // hotărăsc → hotărască
  // 1.ª conjugación: desinencia -e sobre la 1.ª sg. La -u de `intru`,
  // `umblu` es desinencia de 1.ª sg y cae; la de `beau`/`dau` no llega
  // aquí porque esos lemas son irregulares y van guardados.
  const tema = /[^aeiouăâî]u$/.test(s) ? s.slice(0, -1) : s;
  // Y LA ALTERNANCIA `ă → e`, que la v0 no tenía. Ante la desinencia
  // anterior `-e`, la `ă` de la ÚLTIMA sílaba del tema se adelanta:
  // cumpăr → să cumpere, învăț → să învețe. Sin esto la regla producía
  // «*cumpăre» y «*învățe», y NINGÚN camino propio lo habría visto: lo
  // cazó Hunspell, que es el segundo camino y no lo escribió quien
  // escribió la regla. Es también el desmentido de lo que este mismo
  // comentario afirmaba una hora antes —«en la 1.ª conjugación SÍ hay
  // regla y es limpia»—: la había, y le faltaba una mitad.
  //
  // Se toca la última VOCAL, no la última `ă`: en `mănânc` la última vocal
  // es `â` y no se mueve (să mănânce), mientras que una regla escrita como
  // «cambia la última ă» daría «*menânce». La distinción no es cosmética,
  // y el lexicón A1 tiene el caso.
  return formaValida(frontalizarUltimaVocal(tema) + 'e');
}

/** Conjuntivo presente, sin `să`. 1.ª, 2.ª y las dos del plural coinciden
 *  con el indicativo; la 3.ª es casilla propia y común a sg y pl. */
export function conjunctiv(v: LemaVerbal, p: Persona): string | null {
  const irr = CONJUNCTIV_IRREGULAR[v.inf];
  if (irr) return formaValida(irr[p]);
  if (p === 'el' || p === 'ei') return conjunctiv3(v);
  return presente(v, p);
}

/** Con la partícula, que es como aparece en la lengua. */
export function conjunctivSa(v: LemaVerbal, p: Persona): string | null {
  const f = conjunctiv(v, p);
  return f ? formaValida(`să ${f}`) : null;
}

/** Conjuntivo PERFECTO: `să fi` + participio, invariable en persona. Es la
 *  única parte del conjuntivo que sí es uniforme, y por eso se deriva
 *  entera; si no hay participio, no hay forma. */
export function conjunctivPerfect(v: LemaVerbal): string | null {
  const part = participio(v);
  return part ? formaValida(`fi ${part}`) : null;
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
  for (const p of PERSONAS) out[`viit ${p}`] = viitorLiterar(v, p);
  for (const p of PERSONAS) out[`cond ${p}`] = conditional(v, p);
  out['cond perf eu'] = conditionalPerfect(v, 'eu');
  for (const p of PERSONAS) out[`conj ${p}`] = conjunctiv(v, p);
  out['conj perf'] = conjunctivPerfect(v);
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
    // EL GUARDIÁN DEL CONJUNTIVO. Todo lema cuya 3.ª no se derive tiene que
    // TRAERLA. Sin esto, `conjunctiv()` devolvería null en silencio y un
    // lote que pidiera la casilla se quedaría sin respuesta —o, peor, quien
    // viniera detrás escribiría una regla «-e → -ă» para tapar el null y
    // empezaría a fabricar *mergă sin que nada fallara. Es exactamente cómo
    // `temaInfinitivo()` sobrevivió roto: los lemas que lo delataban tenían
    // record guardado.
    if (!conj3Derivable(l) && !l.conj3 && !CONJUNCTIV_IRREGULAR[l.inf])
      errores.push(`${l.inf}: sin \`conj3\` — la 3.ª del conjuntivo no se deriva en esta clase (la alternancia se invierte: merge → meargă, vede → vadă) y una regla «-e → -ă» produciría *mergă`);
    // Y al revés: una `conj3` guardada donde la regla ya la da es una copia
    // que se desincroniza el día que la regla cambie.
    if (conj3Derivable(l) && l.conj3)
      errores.push(`${l.inf}: trae \`conj3\` «${l.conj3}» y esta clase SÍ se deriva — lo guardado y lo derivado se desincronizan; quítalo o justifica por qué la regla falla aquí`);
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
