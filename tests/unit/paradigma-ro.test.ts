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
