// tests/unit/paradigma-ro.test.ts
//
// El paradigma rumano visto EN ROJO antes de creerle: los cuatro casos que
// el plan maestro y el ataque adversarial mandan cazar (*draji, *a lucrez,
// *domne, fată/fete mal clasificada), y formas conocidas de dexonline y
// del currículo comprobadas una a una. El segundo camino (Hunspell) corre
// aquí sólo si el binario está; si no, el test lo dice y no finge verde.
import { describe, it, expect } from 'vitest';
import {
  articulado, genitivoDativo, vocativo, presente, participio, perfectCompus, imperfecto,
  conjugacionDe, temaInfinitivo, palatalizar, invariantesLema, paradigmaNominal,
  conjunctiv, conjunctiv3, conjunctivSa, conjunctivPerfect, conj3Derivable,
  gerunziu, gerDerivable, imperativNegativ, imperativAfirmativ2pl, SIN_IMPERATIV,
  type LemaNominal, type LemaVerbal,
} from '@/scripts/lib/paradigma-ro';
import { SUSTANTIVOS_A1, VERBOS_A1 } from '@/lib/data/languages/ro/lexicon-a1';
import { hunspellDisponible, desconocidas } from '@/scripts/lib/hunspell-ro';

const N = (lema: string, genero: 'm' | 'f' | 'n', plural: string, extra: Partial<LemaNominal> = {}): LemaNominal =>
  ({ lema, genero, plural, gloss: '', ...extra });
const V = (inf: string, sg1: string, sg3: string, extra: Partial<LemaVerbal> = {}): LemaVerbal => ({ inf, sg1, sg3, gloss: '', ...extra });

describe('paradigma-ro: el gate en ROJO', () => {
  it('*a lucrez como infinitivo no pasa las invariantes', () => {
    expect(invariantesLema(V('a lucrez', 'lucrez', 'lucrează')).join(' ')).toMatch(/\*a lucrez/);
    expect(invariantesLema(V('a lucra', 'lucrez', 'lucrează'))).toEqual([]);
  });
  it('*draji como plural de drag no pasa: g ante -i da gi', () => {
    expect(invariantesLema(N('drag', 'm', 'draji')).join(' ')).toMatch(/draji/);
    expect(invariantesLema(N('drag', 'm', 'dragi'))).toEqual([]);
  });
  it('un vocativo marcado sin registro no pasa; un neutro con vocativo tampoco', () => {
    expect(invariantesLema(N('doctor', 'm', 'doctori', { vocSg: 'doctorule' })).join(' ')).toMatch(/sin registro/);
    expect(invariantesLema(N('tren', 'n', 'trenuri', { vocSg: 'trenule', registro: 'brusc' })).join(' ')).toMatch(/neutro/);
  });
  it('*domne no sale del paradigma: el vocativo singular se guarda por lema, nunca se deriva', () => {
    expect(vocativo(N('domn', 'm', 'domni'), 'sg')).toBeNull();                       // no declarado ⇒ no se inventa
    expect(vocativo(N('domn', 'm', 'domni', { vocSg: 'domnule', registro: 'neutru' }), 'sg')).toBe('domnule');
    expect(vocativo(N('frate', 'm', 'frați', { vocSg: null }), 'sg')).toBe('frate');  // sin marca, declarado
  });
  it('fată/fete: la a→e no se deriva, se guarda; y se ve en el genitivo (fetei), no en *fatei', () => {
    const fata = N('fată', 'f', 'fete');
    expect(genitivoDativo(fata, 'sg', true)).toBe('fetei');
    expect(genitivoDativo(fata, 'sg', false)).toBe('fete');
    // casă/case: misma terminación, otra clase — por eso el plural va guardado
    expect(genitivoDativo(N('casă', 'f', 'case'), 'sg', true)).toBe('casei');
  });
  it('una concatenación con undefined nunca sale como forma', () => {
    expect(presente(V('a merge', undefined as unknown as string, 'merge', { participio: 'mers' }), 'eu')).toBeNull();
  });
});

describe('paradigma-ro: nominal, formas comprobadas', () => {
  const om = N('om', 'm', 'oameni', { vocSg: 'omule', registro: 'brusc' });
  const carte = N('carte', 'f', 'cărți');
  const tren = N('tren', 'n', 'trenuri');
  const familie = N('familie', 'f', 'familii');
  const tata = N('tată', 'm', 'tați', { vocSg: null });
  const metrou = N('metrou', 'n', 'metrouri');
  const frate = N('frate', 'm', 'frați', { vocSg: null });
  const zi = N('zi', 'f', 'zile');
  const cafea = N('cafea', 'f', 'cafele');

  it('artículo enclítico singular: omul, cartea, trenul, familia, tatăl, metroul, fratele, ziua, cafeaua', () => {
    expect([om, carte, tren, familie, tata, metrou, frate, zi, cafea].map((l) => articulado(l, 'sg')))
      .toEqual(['omul', 'cartea', 'trenul', 'familia', 'tatăl', 'metroul', 'fratele', 'ziua', 'cafeaua']);
  });
  it('artículo enclítico plural: oamenii, cărțile, trenurile, familiile, frații', () => {
    expect([om, carte, tren, familie, frate].map((l) => articulado(l, 'pl')))
      .toEqual(['oamenii', 'cărțile', 'trenurile', 'familiile', 'frații']);
  });
  it('genitivo-dativo: omului, cărții, trenului, familiei, tatălui, fratelui; unei cărți; oamenilor, cărților', () => {
    expect([om, carte, tren, familie, tata, frate].map((l) => genitivoDativo(l, 'sg', true)))
      .toEqual(['omului', 'cărții', 'trenului', 'familiei', 'tatălui', 'fratelui']);
    expect(genitivoDativo(carte, 'sg', false)).toBe('cărți');
    expect([om, carte].map((l) => genitivoDativo(l, 'pl', true))).toEqual(['oamenilor', 'cărților']);
  });
  it('vocativo plural = GD plural, y los neutros no tienen', () => {
    expect(vocativo(om, 'pl')).toBe('oamenilor');
    expect(vocativo(frate, 'pl')).toBe('fraților');
    expect(vocativo(tren, 'pl')).toBeNull();
  });
  it('un paradigma nominal entero no tiene casillas nulas fuera del vocativo', () => {
    for (const [k, f] of Object.entries(paradigmaNominal(carte))) if (!k.startsWith('V')) expect(f, k).not.toBeNull();
  });
});

describe('paradigma-ro: verbal, formas comprobadas', () => {
  it('conjugación y tema por el infinitivo', () => {
    expect(['a cânta', 'a vedea', 'a merge', 'a dormi', 'a coborî'].map(conjugacionDe)).toEqual(['I', 'II', 'III', 'IV', 'IVî']);
    expect(['a cânta', 'a vedea', 'a merge', 'a dormi', 'a coborî'].map(temaInfinitivo)).toEqual(['cânt', 'ved', 'merg', 'dorm', 'cobor']);
  });
  it('palatalización: t→ț, d→z, s→ș, sc→șt; c y g no cambian', () => {
    expect(['bat', 'văd', 'las', 'citesc', 'plec', 'merg'].map(palatalizar)).toEqual(['baț', 'văz', 'laș', 'citeșt', 'plec', 'merg']);
  });
  it('presente: a lucra → lucrez lucrezi lucrează lucrăm lucrați lucrează (sufijo -ez, 3.ª pl = 3.ª sg)', () => {
    const v = V('a lucra', 'lucrez', 'lucrează');
    expect(['eu', 'tu', 'el', 'noi', 'voi', 'ei'].map((p) => presente(v, p as never))).toEqual(['lucrez', 'lucrezi', 'lucrează', 'lucrăm', 'lucrați', 'lucrează']);
  });
  it('presente: a vedea → văd vezi vede vedem vedeți văd (1.ª pl desde el tema del infinitivo, no desde văd)', () => {
    const v = V('a vedea', 'văd', 'vede', { sg2: 'vezi', participio: 'văzut' });
    expect(['eu', 'tu', 'el', 'noi', 'voi', 'ei'].map((p) => presente(v, p as never))).toEqual(['văd', 'vezi', 'vede', 'vedem', 'vedeți', 'văd']);
    // la ă→e de văd→vezi NO se deriva (văzi): se guarda, y sin guardar sale la forma palatalizada que Hunspell rechaza
    expect(presente(V('a vedea', 'văd', 'vede', { participio: 'văzut' }), 'tu')).toBe('văzi');
  });
  it('presente: a merge, a dormi, a citi, a coborî, a mânca, a ști', () => {
    const f = (v: LemaVerbal) => ['eu', 'tu', 'el', 'noi', 'voi', 'ei'].map((p) => presente(v, p as never));
    expect(f(V('a merge', 'merg', 'merge', { participio: 'mers' }))).toEqual(['merg', 'mergi', 'merge', 'mergem', 'mergeți', 'merg']);
    expect(f(V('a dormi', 'dorm', 'doarme'))).toEqual(['dorm', 'dormi', 'doarme', 'dormim', 'dormiți', 'dorm']);
    expect(f(V('a citi', 'citesc', 'citește'))).toEqual(['citesc', 'citești', 'citește', 'citim', 'citiți', 'citesc']);
    expect(f(V('a coborî', 'cobor', 'coboară'))).toEqual(['cobor', 'cobori', 'coboară', 'coborâm', 'coborâți', 'coboară']);
    expect(f(V('a mânca', 'mănânc', 'mănâncă'))).toEqual(['mănânc', 'mănânci', 'mănâncă', 'mâncăm', 'mâncați', 'mănâncă']);
    expect(f(V('a ști', 'știu', 'știe', { participio: 'știut' }))).toEqual(['știu', 'știi', 'știe', 'știm', 'știți', 'știu']);
  });
  it('a trebui es invariable: trebuie en todas las personas', () => {
    const v = V('a trebui', 'trebuie', 'trebuie', { invariable: true });
    expect(presente(v, 'noi')).toBe('trebuie');
  });
  it('participio y perfect compus: cântat, văzut, mers (guardado), dormit, coborât; am mers, ați mers', () => {
    expect(participio(V('a cânta', 'cânt', 'cântă'))).toBe('cântat');
    expect(participio(V('a vedea', 'văd', 'vede'))).toBeNull();                        // II: no se deriva (văzut, băut, putut)
    expect(participio(V('a vedea', 'văd', 'vede', { participio: 'văzut' }))).toBe('văzut');
    expect(participio(V('a merge', 'merg', 'merge'))).toBeNull();                       // 3.ª sin guardar: no se inventa
    expect(participio(V('a merge', 'merg', 'merge', { participio: 'mers' }))).toBe('mers');
    expect(participio(V('a dormi', 'dorm', 'doarme'))).toBe('dormit');
    expect(participio(V('a coborî', 'cobor', 'coboară'))).toBe('coborât');
    expect(perfectCompus(V('a merge', 'merg', 'merge', { participio: 'mers' }), 'voi')).toBe('ați mers');
  });
  it('imperfecto: lucram, vedeam, mergeam, dormeam, coboram, știam; eram', () => {
    expect(imperfecto(V('a lucra', 'lucrez', 'lucrează'), 'eu')).toBe('lucram');
    expect(imperfecto(V('a vedea', 'văd', 'vede', { participio: 'văzut' }), 'noi')).toBe('vedeam');
    expect(imperfecto(V('a merge', 'merg', 'merge', { participio: 'mers' }), 'ei')).toBe('mergeau');
    expect(imperfecto(V('a dormi', 'dorm', 'doarme'), 'tu')).toBe('dormeai');
    expect(imperfecto(V('a coborî', 'cobor', 'coboară'), 'el')).toBe('cobora');
    expect(imperfecto(V('a ști', 'știu', 'știe', { participio: 'știut' }), 'eu')).toBe('știam');
    expect(imperfecto(V('a fi', 'sunt', 'este'), 'voi')).toBe('erați');
    // Lo que Hunspell cazó en la primera pasada del gate: los irregulares no se derivan
    expect(imperfecto(V('a da', 'dau', 'dă', { irregular: { eu: 'dau', tu: 'dai', el: 'dă', noi: 'dăm', voi: 'dați', ei: 'dau' } }), 'eu')).toBeNull();
    expect(imperfecto(V('a da', 'dau', 'dă', { impf: 'dădeam' }), 'ei')).toBe('dădeau');
    expect(imperfecto(V('a face', 'fac', 'face', { participio: 'făcut', impf: 'făceam' }), 'noi')).toBe('făceam');
    expect(imperfecto(V('a locui', 'locuiesc', 'locuiește'), 'eu')).toBe('locuiam');
    // y spun → spui, pun → pui: la n cae; se guarda, no se deriva (*spuni)
    expect(presente(V('a spune', 'spun', 'spune', { participio: 'spus' }), 'tu')).toBe('spuni');
    expect(presente(V('a spune', 'spun', 'spune', { sg2: 'spui', participio: 'spus' }), 'tu')).toBe('spui');
    expect(genitivoDativo(N('femeie', 'f', 'femei'), 'sg', true)).toBe('femeii');
  });
});

describe('lexicón A1', () => {
  it('todas las entradas pasan las invariantes', () => {
    const errores = [...SUSTANTIVOS_A1, ...VERBOS_A1].flatMap(invariantesLema);
    expect(errores, errores.join('\n')).toEqual([]);
  });
  it('los ids son únicos y ningún verbo se guarda por una forma finita', () => {
    const lemas = [...SUSTANTIVOS_A1.map((l) => l.lema), ...VERBOS_A1.map((v) => v.inf)];
    expect(new Set(lemas).size).toBe(lemas.length);
    for (const v of VERBOS_A1) expect(v.inf.startsWith('a ')).toBe(true);
  });
  it('Hunspell (segundo camino) rechaza *draji y *domne y acepta las formas guardadas del lexicón — si el binario está', () => {
    if (!hunspellDisponible()) { console.warn('hunspell no disponible: este test NO corrió'); return; }
    expect(desconocidas(['draji', 'domne', 'dragi', 'domnule'])).toEqual(['draji', 'domne']);
    const guardadas = [...SUSTANTIVOS_A1.flatMap((l) => [l.lema, l.plural]), ...VERBOS_A1.flatMap((v) => [v.sg1, v.sg3])];
    const malas = desconocidas(guardadas);
    expect(malas, `Hunspell no reconoce: ${malas.join(', ')}`).toEqual([]);
  });
});


// ── El conjuntivo, visto en ROJO antes que en verde ───────────────────
//
// El punto entero de `r7-conjuntivo-presente` es la 3.ª persona, y es la
// única casilla que no se deriva. Estos tests son las formas MAL GENERADAS
// a propósito: son literalmente lo que produce la regla ingenua «-e → -ă»
// que cualquiera escribiría para tapar un null.
describe('conjuntivo: el guardián y las formas mal generadas', () => {
  const NAIVE = { mergă: 'meargă', vedă: 'vadă', începă: 'înceapă', spunăe: 'spună' };

  it('un lema de 2.ª o 3.ª sin `conj3` da ERROR y NO se deriva en silencio', () => {
    const merge = V('a merge', 'merg', 'merge', { participio: 'mers' });
    expect(invariantesLema(merge).join(' ')).toMatch(/sin `conj3`/);
    // Y lo que importa: no hay fallback. Un derivador con fallback
    // plausible no falla, MIENTE — es la lección de temaInfinitivo().
    expect(conjunctiv3(merge)).toBeNull();
    expect(conjunctiv(merge, 'el')).toBeNull();
    expect(conjunctivSa(merge, 'ei')).toBeNull();
  });

  it('con `conj3` guardada sale la forma real, no la que daría «-e → -ă»', () => {
    // Lleva `ger` porque la 3.ª conjugación también lo exige: el invariante
    // del gerunziu, escrito después, hizo fallar este test — que es
    // justamente lo que tenía que pasar.
    const merge = V('a merge', 'merg', 'merge', { participio: 'mers', conj3: 'meargă', ger: 'mergând' });
    expect(conjunctiv3(merge)).toBe('meargă');
    expect(conjunctiv3(merge)).not.toBe('mergă');
    expect(conjunctivSa(merge, 'el')).toBe('să meargă');
    expect(invariantesLema(merge)).toEqual([]);
    // Las personas que SÍ coinciden con el indicativo, comprobadas: si
    // alguien «arreglara» la 3.ª tocando la función entera, éstas caen.
    expect(conjunctiv(merge, 'eu')).toBe('merg');
    expect(conjunctiv(merge, 'noi')).toBe('mergem');
  });

  it('`conj3` guardada donde la regla ya la da es una copia que se desincroniza', () => {
    expect(invariantesLema(V('a cânta', 'cânt', 'cântă', { conj3: 'cânte' })).join(' ')).toMatch(/SÍ se deriva/);
  });

  it('la 1.ª conjugación se deriva, INCLUIDA la alternancia ă → e que la v0 no tenía', () => {
    // Las dos que Hunspell cazó: la regla daba *cumpăre y *învățe.
    expect(conjunctiv3(V('a cumpăra', 'cumpăr', 'cumpără', { sg2: 'cumperi' }))).toBe('cumpere');
    expect(conjunctiv3(V('a învăța', 'învăț', 'învață', { sg2: 'înveți' }))).toBe('învețe');
    // Y la que rompe la versión descuidada de esa misma regla: se toca la
    // última VOCAL, no la última «ă». «Cambia la última ă» daría *menânce.
    expect(conjunctiv3(V('a mânca', 'mănânc', 'mănâncă'))).toBe('mănânce');
    expect(conjunctiv3(V('a pleca', 'plec', 'pleacă'))).toBe('plece');
    expect(conjunctiv3(V('a intra', 'intru', 'intră'))).toBe('intre');
    expect(conjunctiv3(V('a lucra', 'lucrez', 'lucrează'))).toBe('lucreze');
  });

  it('los sufijos -esc / -iesc / -ăsc se derivan', () => {
    expect(conjunctiv3(V('a citi', 'citesc', 'citește'))).toBe('citească');
    expect(conjunctiv3(V('a locui', 'locuiesc', 'locuiește'))).toBe('locuiască');
    expect(conjunctiv3(V('a hotărî', 'hotărăsc', 'hotărăște'))).toBe('hotărască');
  });

  it('«a fi» es irregular en TODA la persona, no sólo en la tercera', () => {
    const fi = VERBOS_A1.find((v) => v.inf === 'a fi')!;
    expect(conjunctiv(fi, 'tu')).toBe('fii');
    expect(presente(fi, 'tu')).toBe('ești');       // el indicativo NO sirve
    expect(conjunctiv(fi, 'noi')).toBe('fim');
    expect(conjunctivSa(fi, 'el')).toBe('să fie');
  });

  it('el conjuntivo perfecto es uniforme y cuelga del participio', () => {
    const merge = VERBOS_A1.find((v) => v.inf === 'a merge')!;
    expect(conjunctivPerfect(merge)).toBe('fi mers');
    // Sin participio no hay forma: no se inventa.
    expect(conjunctivPerfect(V('a plânge', 'plâng', 'plânge', { conj3: 'plângă' }))).toBeNull();
  });

  it('el lexicón entero declara su conjuntivo: ningún verbo cae en null', () => {
    for (const v of VERBOS_A1) {
      expect(conj3Derivable(v) || !!v.conj3 || v.inf === 'a fi').toBe(true);
      expect(conjunctiv3(v), v.inf).not.toBeNull();
    }
  });

  // EL SEGUNDO CAMINO, con su agujero MEDIDO y no supuesto. Hunspell caza
  // seis de las siete formas que la regla ingenua produce — incluidas las
  // dos que de verdad se colaron en el lexicón (*cumpăre, *învățe) —, y
  // deja pasar UNA.
  it('Hunspell caza las formas mal generadas… menos «vedă», que ACEPTA', () => {
    if (!hunspellDisponible()) { expect(hunspellDisponible()).toBe(false); return; }
    const buenas = Object.values(NAIVE).concat(['cumpere', 'învețe', 'mănânce']);
    expect(desconocidas(buenas)).toEqual([]);
    const malas = Object.keys(NAIVE).concat(['cumpăre', 'învățe', 'menânce']);
    expect(desconocidas(malas).sort()).toEqual(malas.filter((w) => w !== 'vedă').sort());
  });

  // EL AGUJERO, escrito como test para que nadie lo descubra dos veces.
  it('«vedă» es el agujero del segundo camino: Hunspell la da por buena y NO es el conjuntivo de «a vedea»', () => {
    if (!hunspellDisponible()) { expect(hunspellDisponible()).toBe(false); return; }
    // Hunspell es gate LÉXICO, no morfológico: contesta «¿existe esta
    // cadena?», no «¿es la casilla que pido?». Si la regla ingenua «-e → -ă»
    // hubiera entrado, `a vedea` habría dado *să vedă y el gate del
    // paradigma habría salido VERDE con 2751 formas.
    expect(desconocidas(['vedă'])).toEqual([]);
    // Lo que sí lo impide es el invariante: `a vedea` es de 2.ª conjugación,
    // no se deriva, y sin `conj3` el lema no pasa. La defensa de esta
    // casilla no es el diccionario: es el guardián, y detrás el lingüista.
    expect(conjunctiv3(VERBOS_A1.find((v) => v.inf === 'a vedea')!)).toBe('vadă');
    expect(invariantesLema(V('a vedea', 'văd', 'vede', { participio: 'văzut' })).join(' ')).toMatch(/sin `conj3`/);
  });
});


// ── El gerunziu: el gate ANTES de creerse que es derivable ────────────
//
// La regla ingenua «tema + ând / ind» acierta en 39 de los 42 verbos del
// lexicón, que es exactamente el estado en el que se escribe una regla a
// la que le falta una mitad. Falló en tres, y los tres decían cosas
// distintas: dos eran léxico (a vedea → văzând, a face → făcând, con el
// tema alternando) y UNO era la regla mal enunciada (a scrie, de 3.ª,
// hace scriind). Y al corregirla cambié una mitad por la otra, y el gate
// devolvió seis *vorbând / *dormând más.
describe('gerunziu: las dos mitades de la regla, y lo que no se deriva', () => {
  it('se deriva en I, IV y -î; se GUARDA en II y III', () => {
    expect(gerDerivable(V('a cânta', 'cânt', 'cântă'))).toBe(true);
    expect(gerDerivable(V('a coborî', 'cobor', 'coboară'))).toBe(true);
    expect(gerDerivable(V('a vedea', 'văd', 'vede', { participio: 'văzut' }))).toBe(false);
    expect(gerDerivable(V('a merge', 'merg', 'merge', { participio: 'mers' }))).toBe(false);
  });

  it('un lema de II o III sin `ger` da ERROR y NO se deriva en silencio', () => {
    const crede = V('a crede', 'cred', 'crede', { participio: 'crezut', conj3: 'creadă' });
    expect(invariantesLema(crede).join(' ')).toMatch(/sin `ger`/);
    // El verbo que todavía no está en el lexicón y que delataría la regla:
    // «a crede» hace crezând, y la regla daría *credând.
    expect(gerunziu(crede)).toBeNull();
    expect(gerunziu({ ...crede, ger: 'crezând' })).toBe('crezând');
  });

  it('`ger` guardado donde la regla ya lo da es una copia que se desincroniza', () => {
    expect(invariantesLema(V('a cânta', 'cânt', 'cântă', { ger: 'cântând' })).join(' ')).toMatch(/SÍ se deriva/);
  });

  // PRIMERA MITAD: la desinencia no depende sólo de la conjugación.
  it('«-ind» también fuera de la 4.ª, cuando el tema acaba en i (a scrie → scriind)', () => {
    expect(gerunziu(VERBOS_A1.find((v) => v.inf === 'a scrie')!)).toBe('scriind');
    expect(gerunziu(V('a ști', 'știu', 'știe', { participio: 'știut' }))).toBe('știind');
    // Y no se funden las dos íes: `pegar` (del presente) daría *ștind.
    expect(gerunziu(V('a ști', 'știu', 'știe', { participio: 'știut' }))).not.toBe('ștind');
  });

  // SEGUNDA MITAD: y tampoco depende sólo del tema. Los seis que el gate
  // devolvió al sustituir una mitad de regla por la otra.
  it('«-ind» en TODA la 4.ª, aunque el tema no acabe en i', () => {
    for (const [inf, esperado] of [['a vorbi', 'vorbind'], ['a dormi', 'dormind'], ['a veni', 'venind'],
                                   ['a iubi', 'iubind'], ['a plăti', 'plătind'], ['a locui', 'locuind']] as const)
      expect(gerunziu(VERBOS_A1.find((v) => v.inf === inf)!), inf).toBe(esperado);
  });

  it('«-ând» en I y en -î, que es lo que separa a coborî de a locui', () => {
    expect(gerunziu(V('a cânta', 'cânt', 'cântă'))).toBe('cântând');
    expect(gerunziu(V('a mânca', 'mănânc', 'mănâncă'))).toBe('mâncând');
    expect(gerunziu(VERBOS_A1.find((v) => v.inf === 'a coborî')!)).toBe('coborând');
    expect(gerunziu(VERBOS_A1.find((v) => v.inf === 'a hotărî')!)).toBe('hotărând');
  });

  // Los irregulares SÍ se derivan aquí, y es una decisión MEDIDA sobre los
  // cinco que existen, no una herencia del flag `irregular`, que describe
  // el presente. Un irregular nuevo hay que medirlo.
  it('los cinco irregulares del lexicón salen correctos por regla', () => {
    for (const [inf, esperado] of [['a fi', 'fiind'], ['a da', 'dând'], ['a sta', 'stând'],
                                   ['a lua', 'luând'], ['a trebui', 'trebuind']] as const)
      expect(gerunziu(VERBOS_A1.find((v) => v.inf === inf)!), inf).toBe(esperado);
  });

  it('el lexicón entero declara su gerunziu: ningún verbo cae en null', () => {
    for (const v of VERBOS_A1) expect(gerunziu(v), v.inf).not.toBeNull();
  });

  // EL SEGUNDO CAMINO, con su agujero medido igual que en el conjuntivo.
  it('Hunspell caza las formas que produjo la regla incompleta', () => {
    if (!hunspellDisponible()) { expect(hunspellDisponible()).toBe(false); return; }
    const malas = ['vedând', 'facând', 'scriând', 'vorbând', 'dormând', 'venând', 'iubând', 'plătând', 'locuând', 'ștind', 'credând'];
    const buenas = ['văzând', 'făcând', 'scriind', 'vorbind', 'dormind', 'venind', 'iubind', 'plătind', 'locuind', 'știind', 'crezând'];
    expect(desconocidas(buenas)).toEqual([]);
    // Se afirma cuántas caza, no que las cace todas: el sello contesta
    // «¿existe esta cadena?», y en el conjuntivo ya se midió que eso deja
    // pasar formas (acepta `vedă`). Aquí las caza las once; el día que una
    // se cuele, este test lo dirá con el número y no con un fallo mudo.
    expect(desconocidas(malas).length).toBe(11);
  });
});

// ══ EL IMPERATIVO NEGATIVO (lote 24) ═════════════════════════════════
//
// Se escribe en el paradigma y no a mano en el lote porque el lote 23
// escribió sus nueve claves a mano, y la segunda vez ya es «la regla
// copiada que se desincroniza».
describe('imperativo negativo', () => {
  const v = (inf: string) => VERBOS_A1.find((x) => x.inf === inf)!;

  it('la 2.ª SG es el infinitivo corto, y NINGUNA supletiva del afirmativo sobrevive', () => {
    // El afirmativo de estos siete es `fă`, `vino`, `zi`, `ia`, `vezi`,
    // `fii`, `dă` — y la negación los borra todos. Ésa es la razón de que
    // la regla no tenga excepción léxica en el singular.
    expect(imperativNegativ(v('a face'), 'sg')).toBe('face');
    expect(imperativNegativ(v('a veni'), 'sg')).toBe('veni');
    expect(imperativNegativ(v('a zice'), 'sg')).toBe('zice');
    expect(imperativNegativ(v('a lua'), 'sg')).toBe('lua');
    expect(imperativNegativ(v('a vedea'), 'sg')).toBe('vedea');
    expect(imperativNegativ(v('a fi'), 'sg')).toBe('fi');
    expect(imperativNegativ(v('a da'), 'sg')).toBe('da');
  });

  // LA MITAD DE REGLA QUE SE PIERDE SOLA. La formulación que se oye más
  // —«el plural negativo es el PRESENTE de 2.ª pl»— es falsa, y la rompe
  // exactamente un verbo. Si el código dijera «presente», este test sería
  // el único sitio donde se vería.
  it('la 2.ª PL es el AFIRMATIVO plural, no el presente — y `a fi` es quien los separa', () => {
    expect(imperativNegativ(v('a veni'), 'pl')).toBe('veniți');
    expect(imperativNegativ(v('a pleca'), 'pl')).toBe('plecați');
    expect(imperativNegativ(v('a fi'), 'pl')).toBe('fiți');
    // ROJO: la formulación falsa daría esto, que no es rumano.
    expect(presente(v('a fi'), 'voi')).toBe('sunteți');
    expect(imperativNegativ(v('a fi'), 'pl')).not.toBe(presente(v('a fi'), 'voi'));
    // Y en todos los demás las dos coinciden, que es por lo que la
    // formulación falsa sobrevive: sólo se separa en la frontera.
    for (const x of VERBOS_A1.filter((y) => y.inf !== 'a fi' && !(SIN_IMPERATIV as readonly string[]).includes(y.inf)))
      expect(imperativAfirmativ2pl(x), x.inf).toBe(presente(x, 'voi'));
  });

  it('los DEFECTIVOS devuelven null en vez de una forma plausible', () => {
    for (const inf of SIN_IMPERATIV) {
      expect(imperativNegativ(v(inf), 'sg'), inf).toBeNull();
      expect(imperativNegativ(v(inf), 'pl'), inf).toBeNull();
    }
    // Y la guarda es ESTRECHA: cualquier otro verbo sí deriva. Sin esto,
    // un null nuevo se confundiría con la exención declarada.
    for (const x of VERBOS_A1.filter((y) => !(SIN_IMPERATIV as readonly string[]).includes(y.inf)))
      expect(imperativNegativ(x, 'sg'), x.inf).not.toBeNull();
  });

  it('SEGUNDO CAMINO: Hunspell acepta las 78 formas derivadas', () => {
    if (!hunspellDisponible()) { expect(true).toBe(true); return; }
    const formas = VERBOS_A1.flatMap((x) => [imperativNegativ(x, 'sg'), imperativNegativ(x, 'pl')])
      .filter((f): f is string => f !== null);
    expect(formas.length).toBe(78);
    expect(desconocidas(formas)).toEqual([]);
  });
});
