// El séptimo lote ruso (u6-demostrativos): cada gate visto en ROJO con el lote
// real parcheado, y el lote real como control negativo.
import { describe, expect, it } from 'vitest';
import {
  ITEMS, verificar, fugaContraLoPublicado, respuestaDe, frase, controlDelAparato, reglaDeManual,
  correr, ESTRATEGIAS, PERFILES, RUTAS_POR_LECTURA, FALSAS_DEL_LOTE, veredictoFalsa, CITAS,
  rivalesDe, esCasillaY, esFormaCorta, REJILLA, pistaNombraLoExaminado, type ClozeDemRu, type Manual,
} from '../../scripts/lotes/cloze-ru-a2c';
import { DETERMINANTES } from '../../lib/data/languages/ru/pronombres-ru';
import { verificarCita } from '../../scripts/cita-ru';

const con = (i: number, cambio: Partial<ClozeDemRu>) => ITEMS.map((x, k) => (k === i ? { ...x, ...cambio } : x));
const hay = (v: string[], re: RegExp) => v.some((s) => re.test(s));
const BLOQUES = 'lib/data/languages/ru/blocks';

describe('cloze-ru-a2c · u6-demostrativos', { timeout: 120_000 }, () => {
  it('CONTROL NEGATIVO: el lote real pasa todos los gates y no fuga contra lo publicado', () => {
    expect(verificar(ITEMS)).toEqual([]);
    expect(fugaContraLoPublicado(ITEMS, BLOQUES)).toEqual([]);
  });

  it('las respuestas por par (el conjunto, no el orden), sin repetir cadena', () => {
    const porPar = new Map<string, string[]>();
    for (const x of ITEMS) porPar.set(x.par, [...(porPar.get(x.par) ?? []), respuestaDe(x)!].sort());
    expect([...porPar.values()].map((xs) => xs.join('/')).sort()).toEqual(['те/эти', 'тем/этим', 'теми/этими', 'тех/этих', 'ту/эту']);
    expect(new Set(ITEMS.map(respuestaDe)).size).toBe(ITEMS.length);
  });

  it('G0 · las casillas FUERA son gate y no prosa (mutación D3/D4): f.nom, n.ac, m.ac, f.instr', () => {
    expect(hay(verificar(con(8, { caso: 'nom', pista: 'x' })), /casilla fuera — el nominativo singular/)).toBe(true);
    expect(hay(verificar(con(8, { forma: 'n', caso: 'ac', sust: 'окно' })), /casilla fuera — n\.ac/)).toBe(true);
    expect(hay(verificar(con(0, { forma: 'm', caso: 'ac' })), /casilla fuera — el acusativo m\/pl depende de la animacidad/)).toBe(true);
    expect(hay(verificar(con(0, { forma: 'f', caso: 'instr', sust: 'школа' })), /casilla fuera — el instrumental femenino/)).toBe(true);
  });

  it('G4b · el régimen del marco (mutación D7): «ездил от» + instrumental, «лежало» + plural', () => {
    const pl = (m: string) => ITEMS.map((x) => (x.par === 'ezdil' || x.par === 'lezhali' ? { ...x, marco: x.par === 'ezdil' ? m : x.marco.replace('лежали', 'лежало') } : x));
    const v = verificar(pl('Он часто ездил от ___ ({D}) {N}.'));
    expect(hay(v, /«от» admite gen y la casilla es instr/)).toBe(true);
    expect(hay(v, /«лежало» delante del hueco no está en REGIMEN/)).toBe(true);
  });

  it('LA PREGUNTA A LA CASILLA, fijada: el lote vive sólo donde el adjetivo NO da la forma', () => {
    for (const x of ITEMS) expect(esCasillaY(x.forma, x.caso) || esFormaCorta(x.lema, x.forma, x.caso), `${x.forma}.${x.caso}`).toBe(true);
    // Y el control negativo del predicado: las casillas gratis por el adjetivo no lo cumplen.
    for (const [f, c] of [['m', 'gen'], ['m', 'dat'], ['m', 'prep'], ['f', 'gen'], ['f', 'prep']] as const)
      expect(esCasillaY(f, c) || esFormaCorta('этот', f, c), `${f}.${c}`).toBe(false);
  });

  it('G16 · ROJO con la v0 del par 5: «помню» es la respuesta publicada de un ítem del lote 2', () => {
    const v0 = ITEMS.map((x) => (x.par === 'znayu' ? { ...x, marco: 'Я хорошо помню ___ ({D}) {N}.' } : x));
    expect(hay(fugaContraLoPublicado(v0, BLOQUES), /«помню», respuesta del ejercicio publicado/)).toBe(true);
    expect(fugaContraLoPublicado(ITEMS, '/no/existe')[0]).toMatch(/no ha mirado nada/);
  });

  it('G3 · la pista no canónica; y G3b, con límites unicode (mutación D5: `\\bи\\b` no casaba nunca)', () => {
    expect(hay(verificar(con(0, { pista: 'este — instrumental' })), /no es la canónica/)).toBe(true);
    for (const p of ['lleva и', 'con ы', 'forma corta', 'la vocal']) expect(pistaNombraLoExaminado(p), p).toBe(true);
    for (const x of ITEMS) expect(pistaNombraLoExaminado(x.pista), x.pista).toBe(false);
  });

  it('G4 · un sustantivo de otro género que la casilla', () => {
    expect(hay(verificar(con(8, { sust: 'стол' })), /es m y la casilla es f/)).toBe(true);
  });

  it('G10b · el instrumental femenino, fuera por su nombre (этою 268, тою 315)', () => {
    expect(hay(verificar(con(0, { forma: 'f', caso: 'instr', sust: 'школа', pista: 'este, ese — instrumental femenino singular' })), /variante del XIX/)).toBe(true);
  });

  it('G11 · un rival atestado sin la decisión del ítem', () => {
    expect(hay(verificar(con(3, { rivalesNoAceptados: {} })), /«тих» sale \d+ veces y el ítem no escribe su decisión/)).toBe(true);
  });

  it('G11b · una decisión que no decide, y una clave obsoleta (mutación D9)', () => {
    expect(hay(verificar(con(7, { rivalesNoAceptados: { 'ти': 'sí' } })), /no empieza por «NO»/)).toBe(true);
    expect(hay(verificar(con(0, { rivalesNoAceptados: { 'тих': 'NO, obsoleta' } })), /que rivalesDe ya no genera/)).toBe(true);
  });

  it('G12 · el par con dos этот, el eje i-e en una casilla sin ы, y una casilla repetida', () => {
    expect(hay(verificar(con(1, { lema: 'этот', pista: ITEMS[0]!.pista })), /el par es этот contra тот/)).toBe(true);
    const sinY = ITEMS.map((x) => (x.par === 'znayu' ? { ...x, eje: 'i-e' as const } : x));
    expect(hay(verificar(sinY), /eje «i-e» y en f\.ac el adjetivo no escribe ы/)).toBe(true);
    // Los ejes son PARTICIÓN (mutación D8): pl.nom es casilla de la ы y forma corta a la vez; manda la vocal.
    const cortaEnPl = ITEMS.map((x) => (x.par === 'lezhali' ? { ...x, eje: 'forma-corta' as const } : x));
    expect(hay(verificar(cortaEnPl), /declara «forma-corta» y la casilla pl\.nom es «i-e»/)).toBe(true);
    const repe = ITEMS.map((x) => (x.par === 'slyshal' ? { ...x, forma: 'm' as const, caso: 'instr' as const, sust: 'человек', marco: 'Я долго говорил с ___ ({D}) {N}.', pista: `${DETERMINANTES[x.lema].glosa} — instrumental masculino singular` } : x));
    expect(hay(verificar(repe), /ya la usa otro par/)).toBe(true);
  });

  it('G14 · una frontera cuya regla ACIERTA, y una de тот declarada en этот', () => {
    const acierta = con(9, { frontera: { regla: 'тот-como-этот', motivo: 'x'.repeat(130) } });
    expect(hay(verificar(acierta), /esa regla ACIERTA «ту»/)).toBe(true);
    const enEtot = con(4, { frontera: { regla: 'тот-como-этот', motivo: 'x'.repeat(130) } });
    expect(hay(verificar(enEtot), /sólo puede ser frontera de тот/)).toBe(true);
  });

  it('G14b · la frontera movida a un distractor ATESTADO, o con un motivo que habla de otro (mutación D2)', () => {
    const f = ITEMS[8]!.frontera!;
    const aTuyu = ITEMS.map((x, k) => (k === 8 ? { ...x, frontera: undefined } : k === 9 ? { ...x, frontera: f } : x));
    expect(hay(verificar(aTuyu), /el distractor «тую» está atestado/)).toBe(true);
    const aEtim = ITEMS.map((x, k) => (k === 8 ? { ...x, frontera: undefined } : k === 0 ? { ...x, frontera: f } : x));
    expect(hay(verificar(aEtim), /el motivo de la frontera no nombra su distractor «\*этым»/)).toBe(true);
  });

  it('G15 · un marco que contiene la respuesta de otro ítem', () => {
    expect(hay(verificar(con(0, { marco: 'Я долго спорил с ___ ({D}) {N}, а не с теми.' })), /RESPUESTA del ítem/)).toBe(true);
  });

  it('★ CONTROL DEL APARATO sobre una REJILLA FIJA (mutación D6), y ROJO en una casilla que ningún ítem toca', () => {
    // 4 formas × 6 casos menos los dos acusativos de animacidad: 22 por lema. La
    // rejilla NO se lee de la tabla: borrar una casilla de DETERMINANTES tiene
    // que ser discrepancia, no una casilla menos examinada.
    expect(REJILLA).toHaveLength(22);
    const real = controlDelAparato();
    expect(real.examinadas).toBe(2 * REJILLA.length);
    expect(real.discrepancias).toEqual([]);
    const hueco: Manual = (l, f, c) => (l === 'тот' && f === 'pl' && c === 'dat' ? null : reglaDeManual(l, f, c));
    expect(controlDelAparato(hueco).discrepancias).toEqual(['тот pl.dat: la regla da «null» y la tabla «тем»']);
    // m.prep de тот: ningún ítem la usa.
    expect(ITEMS.some((x) => x.forma === 'm' && x.caso === 'prep')).toBe(false);
    const roto: Manual = (l, f, c) => (l === 'тот' && f === 'm' && c === 'prep' ? 'тем' : reglaDeManual(l, f, c));
    expect(controlDelAparato(roto).discrepancias).toEqual(['тот m.prep: la regla da «тем» y la tabla «том»']);
  });

  it('★ EL TEOREMA DEL PAR: marco, sustantivo y casilla constantes, respuestas distintas ⇒ una ruta que no lea el lema acierta ≤ 5', () => {
    const pares = new Map<string, ClozeDemRu[]>();
    for (const x of ITEMS) pares.set(x.par, [...(pares.get(x.par) ?? []), x]);
    expect(pares.size).toBe(5);
    for (const [, [a, b]] of pares) {
      expect(frase(a!).replace(a!.lema, '')).toBe(frase(b!).replace(b!.lema, ''));
      expect(respuestaDe(a!)).not.toBe(respuestaDe(b!));
    }
  });

  it('las rutas, en su forma medida (lo observado, no lo predicho)', () => {
    const r = (xs: ReturnType<typeof correr>, n: string) => xs.find((z) => z.nombre.startsWith(n))!;
    const ciegas = correr(ITEMS, ESTRATEGIAS), perf = correr(ITEMS, PERFILES), lect = correr(ITEMS, RUTAS_POR_LECTURA);
    expect(r(ciegas, 'copiar-el-lema').aciertos).toBe(0);
    expect(r(ciegas, 'el-determinante-como-adjetivo').aciertos).toBe(0);
    expect(r(ciegas, 'rima-con-el-sustantivo').cuales).toEqual([9, 10]);
    for (const z of ciegas) expect(z.aciertos, z.nombre).toBeLessThanOrEqual(ITEMS.length / 2);
    expect(r(perf, 'тот-como-этот').cuales).toEqual([1, 3, 5, 7, 9, 10]);
    expect(r(perf, 'la-vocal-bien-y-la-forma-larga').cuales).toEqual([1, 2, 3, 4, 5, 6]);
    expect(r(perf, 'el-paradigma-entero').aciertos).toBe(ITEMS.length);
    expect(r(perf, 'copiar-la-respuesta-de-этот').cuales).toEqual([1, 3, 5, 7, 9]);
    // La lectura, en la FORMA del hecho y no en su cifra (§B7): no aplica en
    // todos, falla alguno de los que aplica, y entre lo que devuelve está «то»
    // — la partícula -то cortada del guion, que el aparato cuenta como forma.
    const l = r(lect, 'memoria-colocacional');
    expect(l.aplicables).toBeLessThan(ITEMS.length);
    expect(l.aciertos).toBeLessThan(l.aplicables);
    expect(l.devuelve).toContain('то');
  });

  it('los rivales: el adjetivo en los diez, y el contagio del hermano donde difieren', () => {
    expect(rivalesDe(ITEMS[5]!)).toEqual(expect.arrayContaining(['тыми', 'тими']));
    expect(rivalesDe(ITEMS[9]!)).toEqual(['тую']);   // эту/ту: el contagio da la misma respuesta
  });

  it('CONTROL POSITIVO: las nueve falsas se rechazan, y el veredicto NO rechaza las buenas', () => {
    for (const f of FALSAS_DEL_LOTE) expect(veredictoFalsa(f.mala, f.buena).rechaza, f.mala).toBe(true);
    for (const f of FALSAS_DEL_LOTE) expect(veredictoFalsa(f.buena, f.mala).rechaza, f.buena).toBe(false);
  });

  it('CITAS: todas pasan por la herramienta, y una mal atribuida sale roja', () => {
    for (const c of CITAS) expect(verificarCita(c).problemas, c.cita).toEqual([]);
    expect(verificarCita({ ...CITAS[0]!, autor: 'Толстой' }).ok).toBe(false);
  });
});
