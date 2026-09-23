// tests/unit/cloze-ru-a2.test.ts
//
// Prueba que cada gate del lote DISPARA contra el defecto que existe para
// cazar (B1) y NO dispara contra el lote real (B2: el control negativo es el
// lote real, no uno fabricado). Fija además cada ruta en su número OBSERVADO con
// su denominador (G5), y el control del aparato visto en rojo con una mutación
// en un lema que ningún ítem toca (§47).
//
// No prueba que el ruso sea correcto: eso lo hacen el corpus (dentro de los
// gates) y el lingüista adversarial.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, verificar, fugaContraLoPublicado, respuestaDe, alternativasDe, frase, regente,
  REGENTES, controlDelAparato, controlDeLasTablasDeRuta, reglaDeManual, reglaSobreElLema, tabla,
  claseIrregular, correr, veredictoRival, rivalDe, LECTURA_RIVAL, ESTRATEGIAS, PERFILES,
  RUTAS_POR_LECTURA, FALSAS_DEL_LOTE, veredictoFalsa, entradaNom, vista, colaDe,
  type ClozeOblRu, type CasoOblRu,
} from '../../scripts/lotes/cloze-ru-a2';
import { buscar, CANARIO } from '../../scripts/corpus-ru';
import { NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { casillaNominal, type TemaRu } from '../../lib/data/languages/ru/paradigma-ru';
import { quitarAcento, revisarOrtografiaRu } from '../../lib/lang/ortografia-ru';

const con = (i: number, parche: Partial<ClozeOblRu>): ClozeOblRu[] => ITEMS.map((x, k) => (k === i ? { ...x, ...parche } : x));
/** Cambia los DOS ítems de un par a la vez: un gate de par no se puede probar
 *  rompiendo la mitad, porque entonces salta el de «marcos no idénticos». */
const conPar = (par: string, f: (x: ClozeOblRu) => Partial<ClozeOblRu>): ClozeOblRu[] => ITEMS.map((x) => (x.par === par ? { ...x, ...f(x) } : x));
const hay = (v: string[], re: RegExp) => v.some((s) => re.test(s));
const idx = (lema: string) => ITEMS.findIndex((x) => x.lema === lema);
/** El timeout va declarado y con su guarda (§26): el corpus son 91 MB. */
const T = { timeout: 120_000 };

describe('EL CONTROL NEGATIVO: el lote real pasa limpio', T, () => {
  it('el corpus está cargado — la guarda del timeout largo', () => { expect(buscar(CANARIO).n).toBeGreaterThan(1000); });
  it('verificar() no devuelve nada sobre los doce ítems', () => { expect(verificar(ITEMS)).toEqual([]); });
  it('ni fugaContraLoPublicado contra el directorio REAL', () => { expect(fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks')).toEqual([]); });
  it('doce ítems, seis pares, cinco ejes, tres casos a partes iguales, dos fronteras', () => {
    expect(ITEMS).toHaveLength(12);
    expect(new Set(ITEMS.map((x) => x.par)).size).toBe(6);
    expect(new Set(ITEMS.map((x) => x.eje)).size).toBe(5);
    for (const c of ['dat', 'instr', 'prep'] as CasoOblRu[]) expect(ITEMS.filter((x) => x.caso === c)).toHaveLength(4);
    expect(ITEMS.filter((x) => x.frontera).map((x) => x.lema)).toEqual(['друг', 'человек']);
  });
  it('las respuestas se DERIVAN y no están en lo que el alumno ve; ninguna lleva ё', () => {
    for (const x of ITEMS) {
      const r = respuestaDe(x)!;
      expect(r).not.toBeNull();
      expect(`${x.marco} ${x.pista} ${x.lema}`).not.toContain(quitarAcento(r));
      expect(r).not.toMatch(/ё/);
      expect(alternativasDe(x)).toEqual([]);
    }
  });
});

describe('cada gate, VISTO EN ROJO contra su defecto', T, () => {
  it('G0 · un lema con ё en el tema de plural (сестра → сёстрам)', () => {
    expect(hay(verificar(con(idx('книга'), { lema: 'сестра', pista: 'hermana — prepositivo plural · femenino' })), /lleva ё/)).toBe(true);
  });
  it('G0b · un lema con vocal fugaz (день → дням)', () => {
    expect(hay(verificar(con(idx('стол'), { lema: 'день', pista: 'día — dativo plural · masculino' })), /vocal fugaz/)).toBe(true);
  });
  it('G0c · ⚠ el instrumental plural de la 3.ª declinación (дверями/дверьми)', () => {
    const v = verificar(con(idx('дверь'), { caso: 'instr', pista: 'puerta — instrumental plural · femenino' }));
    expect(hay(v, /3\.ª declinación/)).toBe(true);
  });
  it('G2 · el lema fuera del paréntesis', () => {
    expect(hay(verificar(con(0, { marco: 'Слуги подошли к ___ стол.' })), /entre paréntesis/)).toBe(true);
  });
  it('G3 · la pista sin la casilla, con otro género, con otra glosa, con el tema, sin forma canónica', () => {
    expect(hay(verificar(con(0, { pista: 'mesa — plural · masculino' })), /no nombra la casilla/)).toBe(true);
    expect(hay(verificar(con(0, { pista: 'mesa — dativo plural · femenino' })), /no nombra el género/)).toBe(true);
    expect(hay(verificar(con(0, { pista: 'mueble — dativo plural · masculino' })), /glosa de la pista/)).toBe(true);
    expect(hay(verificar(con(0, { pista: 'mesa — dativo plural · masculino (tema duro)' })), /TEMA, la CLASE/)).toBe(true);
    expect(hay(verificar(con(0, { pista: 'mesa: dativo plural, masculino' })), /forma canónica/)).toBe(true);
  });
  it('G4 · un regente que no rige el caso declarado, y uno que la tabla no conoce', () => {
    expect(hay(verificar(con(0, { caso: 'prep', pista: 'mesa — prepositivo plural · masculino' })), /rige dat y el ítem pide prep/)).toBe(true);
    expect(hay(verificar(con(0, { marco: 'Слуги подошли под ___ ({L}).' })), /no está en la tabla REGENTES/)).toBe(true);
  });
  it('G4 · la tabla de regentes es la gramática ENTERA: в y о rigen también acusativo', () => {
    expect(REGENTES['в']).toContain('ac');
    expect(REGENTES['о']).toContain('ac');
    expect(REGENTES['к']).toEqual(['dat']);
  });
  it('G6 · la respuesta escrita en la frase', () => {
    expect(hay(verificar(con(0, { marco: 'Слуги подошли к столам, к ___ ({L}).' })), /ya está escrita en la frase/)).toBe(true);
  });
  it('G12 · ⚠ cada rival atestado exige su LECTURA y la DECISIÓN del ítem, por rival (E3)', () => {
    const j = idx('человек');
    const dec = ITEMS[j]!.rivalesNoAceptados!;
    // quitar la decisión sobre UN rival (человеками) deja la del otro: tiene que ser rojo
    const { 'человеками': _q, ...soloLyudyami } = dec;
    expect(hay(verificar(con(j, { rivalesNoAceptados: soloLyudyami })), /rival «человеками» sale 8 veces y el ítem no escribe su decisión/)).toBe(true);
    // y quitar la LECTURA, con la decisión intacta, también
    const g = LECTURA_RIVAL['человеками'];
    delete LECTURA_RIVAL['человеками'];
    try { expect(hay(verificar(ITEMS), /rival «человеками» sale 8 veces y LECTURA_RIVAL no dice qué es/)).toBe(true); }
    finally { LECTURA_RIVAL['человеками'] = g!; }
  });
  it('G13 · un par con géneros distintos, con casos distintos, con marcos distintos', () => {
    expect(hay(verificar(conPar('slugi', (x) => (x.lema === 'стол' ? { lema: 'книга', pista: 'libro — dativo plural · femenino' } : {}))), /géneros distintos/)).toBe(true);
    expect(hay(verificar(con(0, { caso: 'prep', pista: 'mesa — prepositivo plural · masculino', marco: 'Слуги подошли к ___ ({L}).' })), /casos distintos/)).toBe(true);
    expect(hay(verificar(con(0, { marco: 'Гости подошли к ___ ({L}).' })), /no son idénticos/)).toBe(true);
  });
  it('G14 · el eje declarado se RECALCULA — cinco ejes, cinco rojos', () => {
    // «tema» sobre un par cuyos dos temas son blandos
    expect(hay(verificar(conPar('prikasalsya', () => ({ eje: 'tema' }))), /eje «tema»/)).toBe(true);
    // «tema-velar» sobre un par sin velar (стол/конь)
    expect(hay(verificar(conPar('slugi', () => ({ eje: 'tema-velar' }))), /no acaba en velar/)).toBe(true);
    // «grafia» sobre un par con un duro
    expect(hay(verificar(conPar('za', () => ({ eje: 'grafia' }))), /exige dos temas BLANDOS/)).toBe(true);
    // «tema-de-plural» sobre un par regular
    expect(hay(verificar(conPar('slugi', () => ({ eje: 'tema-de-plural' }))), /eje «tema-de-plural»/)).toBe(true);
    // «instr-ьми» en un par que no es instrumental
    expect(hay(verificar(conPar('slugi', () => ({ eje: 'instr-ьми' }))), /eje «instr-ьми» en dat/)).toBe(true);
  });
  it('G15 · un lote con un caso de más de la mitad, y uno de un solo lado', () => {
    const sesgado = ITEMS.filter((x) => x.caso !== 'prep');
    expect(hay(verificar(sesgado), /usa 2 de los tres casos/)).toBe(true);
    const unLado = ITEMS.filter((x) => /^а/.test(colaDe(x) ?? ''));
    expect(hay(verificar(unLado), /de un solo lado/)).toBe(true);
  });
  it('G16 · una frontera con la regla equivocada, sin distractor, repetida y sin motivo', () => {
    const i = idx('друг');
    expect(hay(verificar(con(i, { frontera: { ...ITEMS[i]!.frontera!, regla: 'el-instrumental-es-ами-ями' } })), /la recalculada es «tema-de-plural»/)).toBe(true);
    expect(hay(verificar(con(i, { frontera: { ...ITEMS[i]!.frontera!, motivo: 'corto' } })), /demasiado corto/)).toBe(true);
    const j = idx('человек');
    expect(hay(verificar(con(j, { frontera: { ...ITEMS[j]!.frontera!, regla: 'el-oblicuo-se-forma-sobre-el-lema' } })), /dos fronteras sobreaplican/)).toBe(true);
  });
  it('G16b · un irregular sin frontera', () => {
    expect(hay(verificar(con(idx('друг'), { frontera: undefined })), /irregular \(tema-de-plural\) y el ítem no declara frontera/)).toBe(true);
  });
  it('G17 · una palabra del marco que es respuesta de otro ítem', () => {
    const m = 'Об этом рассказывали коням в ___ ({L}).';
    expect(hay(verificar(conPar('rasskazyvali', () => ({ marco: m }))), /RESPUESTA del ítem de «конь»/)).toBe(true);
  });
  it('G18 · la fuga contra lo publicado: un marco con una respuesta ya publicada', () => {
    // «школы» es respuesta publicada de u4-declinacion-singular (lote 1).
    const m = 'Об этом рассказывали школы в ___ ({L}).';
    expect(hay(fugaContraLoPublicado(conPar('rasskazyvali', () => ({ marco: m })), 'lib/data/languages/ru/blocks'), /школы/)).toBe(true);
  });
});

describe('★ EL CONTROL DEL APARATO, en rojo y en verde (§47)', T, () => {
  it('limpio sobre las 120 casillas (40 lemas × 3 casos)', () => {
    // Era `toHaveLength(40)`; entraron мальчик y мужчина el 2026-09-23. El
    // control recorre NOMBRES_A1 entero, así que la forma es «no encoge».
    expect(NOMBRES_A1.length).toBeGreaterThanOrEqual(40);
    expect(controlDelAparato()).toEqual([]);
  });
  it('ROJO con la regla mutada en un lema que NINGÚN ítem toca (музей)', () => {
    const mut = (l: string, t: TemaRu, c: CasoOblRu) => (l === 'музей' ? tabla('музе', false, c) : reglaDeManual(l, t, c));
    const d = controlDelAparato(mut);
    expect(d.filter((s) => s.startsWith('музей'))).toHaveLength(3);
    expect(ITEMS.some((x) => x.lema === 'музей')).toBe(false);
  });
  it('ROJO sin la regla de u1 (la я tras sibilante): caza ночь, вещь, душа…', () => {
    const sinU1 = (l: string, t: TemaRu, c: CasoOblRu) => {
      const r = reglaDeManual(l, t, c);
      return /[жшчщ]а/.test(r) && t !== 'duro' ? r.replace(/([жшчщ])а/, '$1я') : r;
    };
    expect(controlDelAparato(sinU1).some((s) => s.startsWith('ночь'))).toBe(true);
  });
  it('⚠ las tablas que sólo leen las rutas también están bajo control (se cazó antes de publicar)', () => {
    expect(controlDeLasTablasDeRuta()).toEqual([]);
    expect(controlDeLasTablasDeRuta({ ...Object.fromEntries(ITEMS.map((x) => [x.lema, casillaNominal(entradaNom(x)!, 'nom', 'pl')!])), 'книга': 'книгы' }).length).toBe(1);
  });
});

describe('las rutas, fijadas en lo OBSERVADO con su denominador', T, () => {
  const por = (nombre: string) => correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]).find((r) => r.nombre.startsWith(nombre))!;
  it('ninguna ciega pasa de la mitad — y la de la glosa, que el teorema NO acota, tampoco', () => {
    for (const r of correr(ITEMS, ESTRATEGIAS)) { expect(r.aciertos, r.nombre).toBeLessThanOrEqual(6); expect(r.aplicables).toBe(12); }
  });
  it('las cifras, una a una', () => {
    expect(por('copiar-el-lema').cuales).toEqual([]);
    expect(por('una-cola-fija').aciertos).toBe(2);
    expect(por('el-caso-de-la-pista').cuales).toEqual([1, 3, 5, 8, 9, 11]);
    expect(por('el-genero-de-la-pista').aciertos).toBe(3);
    expect(por('la-glosa').cuales).toEqual([1, 3, 6, 8, 9, 11]);
    expect(por('la-ultima-letra-del-lema').cuales).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 11]);
    expect(por('desde-el-nominativo-plural').cuales).toEqual([1, 2, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(por('la-tabla-sin-el-ьми').cuales).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(por('el-paradigma-entero').aciertos).toBe(12);
    expect(por('memoria-colocacional-sin-el-lema').aciertos).toBe(0);
    expect(por('memoria-colocacional-con-el-tema').cuales).toEqual([3, 8, 9, 11]);
  });
  it('★ el perfil que el lote 4 deja montado falla EXACTAMENTE el tema velar y el -ьми', () => {
    const f = [...Array(12).keys()].map((k) => k + 1).filter((k) => !por('desde-el-nominativo-plural').cuales.includes(k));
    expect(f.map((k) => ITEMS[k - 1]!.lema)).toEqual(['книга', 'человек']);
  });
  it('la ruta por lectura devuelve el SINGULAR donde falla — leído, no contado', () => {
    const r = RUTAS_POR_LECTURA.find((x) => x.nombre === 'memoria-colocacional-con-el-tema')!;
    const sal = Object.fromEntries(ITEMS.map((x) => [x.lema, r.correr(vista(x)!)]));
    for (const [l, sg] of [['стол', 'столу'], ['деревня', 'деревне'], ['дверь', 'двери'], ['человек', 'человеком']] as const) expect(sal[l]).toBe(sg);
    // y tras `за`, que rige DOS casos, devuelve el ACUSATIVO singular (§25.1): за окно 44, за море 20
    expect([sal['окно'], sal['море']]).toEqual(['окно', 'море']);
  });
});

describe('los rivales y el control positivo', T, () => {
  it('cinco salidas: 9 EVIDENCIA, 2 HOMÓGRAFO (вещь, товарищ), 1 TAREA DE LECTURA (людями), 0 ROJO', () => {
    const v = ITEMS.map((x) => veredictoRival(x)!.veredicto);
    expect(v.filter((z) => z === 'EVIDENCIA')).toHaveLength(9);
    expect(ITEMS.filter((x) => veredictoRival(x)!.veredicto === 'HOMÓGRAFO').map((x) => x.lema)).toEqual(['вещь', 'товарищ']);
    expect(rivalDe(ITEMS[idx('человек')]!)).toBe('людями');
    expect(v).not.toContain('ROJO');
  });
  it('ROJO si se borra la lectura escrita de людями', () => {
    const g = LECTURA_RIVAL['людями'];
    delete LECTURA_RIVAL['людями'];
    try { expect(veredictoRival(ITEMS[idx('человек')]!)!.veredicto).toBe('ROJO'); } finally { LECTURA_RIVAL['людями'] = g!; }
  });
  it('las diez falsas se rechazan y las diez buenas pasan limpias; ninguna falsa es palabra de otro lema', () => {
    for (const f of FALSAS_DEL_LOTE) {
      expect(veredictoFalsa(f.mala, f.buena).rechaza, f.mala).toBe(true);
      expect(revisarOrtografiaRu(f.buena)).toEqual([]);
      expect(buscar(f.mala).n, f.mala).toBe(0);
    }
    expect(FALSAS_DEL_LOTE.map((f) => f.mala)).not.toContain('людями');
    expect(FALSAS_DEL_LOTE.map((f) => f.mala)).not.toContain('человеками');
  });
  it('CONTROL NEGATIVO del veredicto: una forma buena contra sí misma no se «rechaza»', () => {
    expect(veredictoFalsa('коням', 'коням').rechaza).toBe(false);
  });
  it('la clase recalculada separa las dos fronteras', () => {
    const e = (l: string) => NOMBRES_A1.find((n) => n.lema === l)!;
    expect(claseIrregular(e('друг'), 'prep', 'друзьях')).toBe('tema-de-plural');
    expect(claseIrregular(e('человек'), 'instr', 'людьми')).toBe('desinencia');
    expect(claseIrregular(e('человек'), 'dat', 'людям')).toBe('tema-de-plural');
    expect(reglaSobreElLema('друг', 'duro', 'prep')).toBe('другах');
    // E6: una forma basura ya no cae en «desinencia» por descarte
    expect(claseIrregular(e('человек'), 'instr', 'zzz')).toBe('ninguna');
  });
  it('el regente se lee de la frase', () => {
    expect(ITEMS.map((x) => regente(frase(x)))).toEqual(['к', 'к', 'в', 'в', 'за', 'за', 'к', 'к', 'о', 'о', 'между', 'между']);
  });
  it('§61 · la Vista no tiene campo de número: ninguna ruta puede nombrar otra casilla de casillaNominal', () => {
    expect(Object.keys(vista(ITEMS[0]!)!).sort()).toEqual(['caso', 'genero', 'glosa', 'lema', 'pista', 's']);
  });
});
