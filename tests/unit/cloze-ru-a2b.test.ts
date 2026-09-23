// tests/unit/cloze-ru-a2b.test.ts
//
// Cada gate del lote DISPARA contra el defecto que existe para cazar (B1) y
// NO dispara contra el lote real (B2: el control negativo es el lote real).
// Fija cada ruta en su número OBSERVADO con su denominador (G5), y el control
// del aparato en rojo con una mutación en un lema que ningún ítem toca (§47).
// No prueba que el ruso sea correcto: eso lo hacen el corpus y el lingüista.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, verificar, fugaContraLoPublicado, respuestaDe, alternativasDe, frase, regente,
  controlDelAparato, reglaDeManual, reglaSobreElLema, claseDe, desinenciaDe, SOBREAPLICADA,
  correr, veredictoRival, LECTURA_RIVAL, ESTRATEGIAS, PERFILES, RUTAS_POR_LECTURA,
  FALSAS_DEL_LOTE, veredictoFalsa, entradaNom, vista, rivalesDe, type ClozeGenRu,
} from '../../scripts/lotes/cloze-ru-a2b';
import { buscar, CANARIO } from '../../scripts/corpus-ru';
import { NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { casillaNominal, type GeneroRu, type TemaRu } from '../../lib/data/languages/ru/paradigma-ru';

const con = (i: number, parche: Partial<ClozeGenRu>): ClozeGenRu[] => ITEMS.map((x, k) => (k === i ? { ...x, ...parche } : x));
const conPar = (par: string, f: (x: ClozeGenRu) => Partial<ClozeGenRu>): ClozeGenRu[] => ITEMS.map((x) => (x.par === par ? { ...x, ...f(x) } : x));
const hay = (v: string[], re: RegExp) => v.some((s) => re.test(s));
const idx = (lema: string) => ITEMS.findIndex((x) => x.lema === lema);
const T = { timeout: 120_000 };

describe('EL CONTROL NEGATIVO: el lote real pasa limpio', T, () => {
  it('el corpus está cargado — la guarda del timeout largo', () => { expect(buscar(CANARIO).n).toBeGreaterThan(1000); });
  it('verificar() no devuelve nada sobre los doce ítems', () => { expect(verificar(ITEMS)).toEqual([]); });
  it('ni la fuga contra el directorio REAL de publicados', () => { expect(fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks')).toEqual([]); });
  it('doce ítems, seis pares, cinco ejes, cuatro fronteras, y las tres desinencias a 4', () => {
    expect(ITEMS).toHaveLength(12);
    expect(new Set(ITEMS.map((x) => x.par)).size).toBe(6);
    expect(new Set(ITEMS.map((x) => x.eje)).size).toBe(5);
    expect(ITEMS.filter((x) => x.frontera)).toHaveLength(4);
    const d = ITEMS.map((x) => desinenciaDe(respuestaDe(x)!, x.lema));
    expect(['ов', 'ей', 'Ø'].map((k) => d.filter((z) => z === k).length)).toEqual([4, 4, 4]);
  });
  it('las respuestas se DERIVAN, ninguna lleva ё y ninguna es el lema', () => {
    for (const x of ITEMS) {
      const r = respuestaDe(x)!;
      expect(r).toBe(casillaNominal(entradaNom(x)!, 'gen', 'pl'));
      expect(r.includes('ё')).toBe(false);
      expect(alternativasDe(x)).toEqual([]);
      expect(r).not.toBe(x.lema);
    }
  });
});

describe('cada gate, VISTO EN ROJO contra su defecto', T, () => {
  it('G0 · un lema con vocal fugaz (день → дней)', () => {
    expect(hay(verificar(con(idx('город'), { lema: 'день', pista: 'día — genitivo plural · masculino' })), /tema oblicuo «дн»/)).toBe(true);
  });
  it('G3 · la pista sin forma canónica, con otra glosa, con otro género, nombrando la vocal de apoyo', () => {
    const i = idx('окно');
    expect(hay(verificar(con(i, { pista: 'ventana — genitivo · neutro' })), /no tiene la forma/)).toBe(true);
    expect(hay(verificar(con(i, { pista: 'vidrio — genitivo plural · neutro' })), /glosa de la pista/)).toBe(true);
    expect(hay(verificar(con(i, { pista: 'ventana — genitivo plural · femenino' })), /no nombra el género/)).toBe(true);
    expect(hay(verificar(con(i, { pista: 'ventana (con vocal de apoyo) — genitivo plural · neutro' })), /nombra el TEMA/)).toBe(true);
  });
  it('G4 · un regente que la tabla no conoce, y uno que no rige genitivo', () => {
    expect(hay(verificar(conPar('okolo', () => ({ marco: 'Возле ___ ({L}) толпился народ.' }))), /«возле» no está en REGENTES/)).toBe(true);
    // `здесь` delante del hueco: el marco natural «Сколько здесь ___» deja sin regente al gate.
    expect(hay(verificar(conPar('skolko', () => ({ marco: 'Сколько здесь ___ ({L})?' }))), /«здесь» no está en REGENTES/)).toBe(true);
  });
  it('G6 · la respuesta escrita en la frase', () => {
    expect(hay(verificar(conPar('okolo', () => ({ marco: 'Около ___ ({L}) не было столов.' }))), /ya está en la frase/)).toBe(true);
  });
  it('G11 · ⚠ el rival atestado exige LECTURA y DECISIÓN, las dos por separado', () => {
    const i = idx('место');
    const sinDecision = con(i, { rivalesNoAceptados: { 'места': ITEMS[i]!.rivalesNoAceptados!['места']! } });
    expect(hay(verificar(sinDecision), /«местов» sale 9 veces y el ítem no escribe su decisión/)).toBe(true);
    const guardada = LECTURA_RIVAL['местов']!;
    delete LECTURA_RIVAL['местов'];
    try { expect(hay(verificar(ITEMS), /«местов» sale 9 veces y LECTURA_RIVAL no dice qué es/)).toBe(true); }
    finally { LECTURA_RIVAL['местов'] = guardada; }
  });
  it('G11 · §A6 · el generador de rivales NO fabrica el Ø de la otra rama (столь, месть, кон)', () => {
    const todos = ITEMS.flatMap((x) => rivalesDe(x));
    for (const basura of ['столь', 'месть', 'кон']) expect(todos).not.toContain(basura);
  });
  it('G12 · un par con géneros distintos y con marcos distintos', () => {
    expect(hay(verificar(con(idx('конь'), { lema: 'дверь', pista: 'puerta — genitivo plural · femenino' })), /géneros distintos/)).toBe(true);
    expect(hay(verificar(con(idx('конь'), { marco: 'У ___ ({L}) толпился народ.' })), /no son idénticos/)).toBe(true);
  });
  it('G12 · el eje se RECALCULA — cinco ejes, cinco rojos', () => {
    // tema: dos duros
    expect(hay(verificar(con(idx('конь'), { lema: 'сад', pista: 'jardín — genitivo plural · masculino' })), /eje «tema» exige/)).toBe(true);
    // sibilante: los dos sin sibilante
    expect(hay(verificar(con(idx('товарищ'), { lema: 'мальчик', pista: 'niño — genitivo plural · masculino', frontera: undefined })), /eje «sibilante» y los dos temas son no sibilantes/)).toBe(true);
    // declinacion: las dos de la 2.ª
    expect(hay(verificar(con(idx('мужчина'), { lema: 'студент', pista: 'estudiante — genitivo plural · masculino', frontera: undefined })), /eje «declinacion» y los dos lemas son de la 2/)).toBe(true);
    // vocal-de-apoyo: sin apoyo en ninguno
    expect(hay(verificar(con(idx('окно'), { lema: 'слово', pista: 'palabra — genitivo plural · neutro' })), /eje «vocal-de-apoyo» y las clases son regular\/regular/)).toBe(true);
    // tema-de-plural: sin supletivo
    expect(hay(verificar(con(idx('человек'), { lema: 'стол', pista: 'mesa — genitivo plural · masculino', frontera: undefined })), /eje «tema-de-plural» y las clases son regular\/regular/)).toBe(true);
  });
  it('G12 · vocal-de-apoyo sin GRUPO final: sin dos consonantes no hay decisión', () => {
    expect(hay(verificar(con(idx('место'), { lema: 'слово', pista: 'palabra — genitivo plural · neutro', frontera: undefined, rivalesNoAceptados: undefined })), /no acaba en dos consonantes/)).toBe(true);
  });
  it('§A6 · la desinencia se lee contra el TEMA: `слов` es Ø, no «-ов» (la v0 lo leía en la cola)', () => {
    expect(desinenciaDe('слов', 'слово')).toBe('Ø');
    expect(desinenciaDe('голов', 'голова')).toBe('Ø');
    expect(desinenciaDe('столов', 'стол')).toBe('ов');
    expect(desinenciaDe('окон', 'окно')).toBe('Ø');
  });
  it('G13 · ★ el techo 1/k: una desinencia con más de la tercera parte', () => {
    const v = verificar(con(idx('мужчина'), { lema: 'город', pista: 'ciudad — genitivo plural · masculino', frontera: undefined }));
    expect(hay(v, /la desinencia ов ocupa 5 de 12/)).toBe(true);
  });
  it('G14 · la regla sobreaplicada se EJECUTA: una que acierta la frontera, una sin distractor, una repetida, una sin motivo', () => {
    const t = idx('товарищ'), m = idx('мужчина');
    // la regla de la vocal sobre товарищ ACIERTA товарищей: no es sobreaplicación
    expect(hay(verificar(con(t, { frontera: { ...ITEMS[t]!.frontera!, regla: 'el-grupo-final-pide-vocal' } })), /esa regla ACIERTA «товарищей»/)).toBe(true);
    // «masculino ⇒ -ов» sobre мужчина con una pareja que la regla no acierta
    expect(hay(verificar(con(idx('мальчик'), { lema: 'товарищ', pista: 'compañero, camarada — genitivo plural · masculino' }).map((x, k) => (k === idx('товарищ') ? { ...x, lema: 'мальчик', pista: 'niño — genitivo plural · masculino', frontera: undefined } : x))),
      /no acierta a la pareja/)).toBe(true);
    expect(hay(verificar(con(m, { frontera: { ...ITEMS[m]!.frontera!, regla: 'el-tema-duro-hace-ов' } })), /dos fronteras sobreaplican/)).toBe(true);
    expect(hay(verificar(con(m, { frontera: { ...ITEMS[m]!.frontera!, motivo: 'corto' } })), /demasiado corto/)).toBe(true);
  });
  it('G15 · un irregular suelto (окон sin frontera en su par)', () => {
    const i = idx('место');
    expect(hay(verificar(con(i, { frontera: undefined })), /«окон» es vocal-de-apoyo y ni es frontera ni es el distractor/)).toBe(true);
  });
  it('G16 · una palabra del marco que es respuesta de otro ítem', () => {
    expect(hay(verificar(conPar('okolo', () => ({ marco: 'Около ___ ({L}) не было людей.' }))), /es la RESPUESTA del ítem de «человек»/)).toBe(true);
  });
  it('G17 · la fuga contra lo publicado — y la v0 real del marco del par 1 («люди»)', () => {
    expect(hay(fugaContraLoPublicado(conPar('okolo', () => ({ marco: 'Около ___ ({L}) толпились люди.' })), 'lib/data/languages/ru/blocks'), /«люди», respuesta del ejercicio publicado/)).toBe(true);
  });
  it('G17 · §A2 · sin directorio NO devuelve un verde vacío', () => {
    expect(hay(fugaContraLoPublicado(ITEMS, 'no/existe'), /no ha mirado nada/)).toBe(true);
  });
});

describe('★ EL CONTROL DEL APARATO (§47): el lexicón entero, en rojo y en verde', T, () => {
  it('limpio sobre todos los lemas del lexicón', () => {
    expect(NOMBRES_A1.length).toBeGreaterThanOrEqual(42);
    expect(controlDelAparato()).toEqual([]);
  });
  it('ROJO con la regla mutada en un lema que NINGÚN ítem toca (музей)', () => {
    const mut = (l: string, g: GeneroRu, t: TemaRu) => (l === 'музей' ? 'музеов' : reglaDeManual(l, g, t));
    expect(controlDelAparato(mut)).toEqual(['музей gen.pl: el manual da «музеов» y la máquina «музеев»']);
  });
  it('ROJO con la v0 del tema de plural (-ей pegado sin quitar la ь): caza друг, que ningún ítem toca', () => {
    const v0 = (l: string, g: GeneroRu, t: TemaRu) => (l === 'друг' ? 'друзь' + 'ей' : reglaDeManual(l, g, t));
    expect(hay(controlDelAparato(v0), /друг gen\.pl: el manual da «друзьей»/)).toBe(true);
  });
  it('ROJO sin la sibilante: caza товарищ y врач', () => {
    const sinSib = (l: string, g: GeneroRu, t: TemaRu) => (['товарищ', 'врач'].includes(l) ? reglaSobreElLema(l, g, t).replace(/ей$/, 'ов') : reglaDeManual(l, g, t));
    const d = controlDelAparato(sinSib);
    expect(hay(d, /товарищ/)).toBe(true);
    expect(hay(d, /врач/)).toBe(true);
  });
});

describe('las rutas, fijadas en lo OBSERVADO con su denominador', T, () => {
  const todas = correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]);
  const de = (n: string) => todas.find((r) => r.nombre.startsWith(n))!;
  it('ninguna ciega pasa de la mitad, y la cola fija no pasa de 1/k', () => {
    for (const r of correr(ITEMS, ESTRATEGIAS)) expect(r.aciertos).toBeLessThanOrEqual(6);
    expect(de('una-cola-fija').aciertos).toBe(4);
  });
  it('las cifras, una a una', () => {
    const f = (n: string) => [de(n).aciertos, de(n).aplicables, de(n).cuales];
    expect(f('copiar-el-lema')).toEqual([0, 12, []]);
    expect(f('una-cola-fija')).toEqual([4, 12, [1, 3, 5, 11]]);
    expect(f('el-genero-de-la-pista')).toEqual([6, 12, [1, 3, 5, 7, 10, 11]]);
    expect(f('la-glosa-española')).toEqual([6, 12, [1, 2, 3, 4, 7, 11]]);
    expect(f('por-genero-y-tema')).toEqual([8, 12, [1, 2, 3, 5, 7, 9, 10, 11]]);
    expect(f('la-regla-sobre-el-lema')).toEqual([10, 12, [1, 2, 3, 4, 5, 6, 7, 9, 10, 11]]);
    expect(f('la-regla-con-vocal')).toEqual([9, 12, [1, 2, 3, 4, 5, 6, 8, 10, 11]]);
    expect(f('el-contagio-del-par')).toEqual([1, 12, [7]]);
    expect(f('el-paradigma-entero')).toEqual([12, 12, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]);
    expect(f('memoria-colocacional-sin')).toEqual([0, 12, []]);
    expect(f('memoria-colocacional-con')).toEqual([3, 7, [4, 5, 6]]);
  });
  it('★ la regla por GÉNERO falla todos los -ей y мужчин: el par 3 es lo único que la separa de la declinación DENTRO de un género', () => {
    const r = de('el-genero-de-la-pista');
    expect(r.cuales).not.toContain(idx('мужчина') + 1);
    // Sin мужчина (y su pareja), la regla por género sólo fallaría por el -ей
    const sinPar3 = ITEMS.filter((x) => x.par !== 'iz-nikto');
    const otra = correr(sinPar3, ESTRATEGIAS).find((z) => z.nombre.startsWith('el-genero'))!;
    expect(otra.aciertos).toBe(5);
  });
  it('★ la vocal de apoyo general falla también карт, que NO es frontera: el par 5 la mide sin declararla', () => {
    expect(de('la-regla-con-vocal').cuales).not.toContain(idx('карта') + 1);
    expect(SOBREAPLICADA['el-grupo-final-pide-vocal'](entradaNom(ITEMS[idx('карта')]!)!)).toBe('карот');
  });
  it('la ruta por lectura: los fallos aplicables devuelven el SINGULAR u otra palabra — leído, no contado', () => {
    const r = RUTAS_POR_LECTURA[1]!;
    const dev = Object.fromEntries(ITEMS.map((x) => [x.lema, r.correr(vista(x)!)]));
    expect([dev['стол'], dev['город'], dev['человек']]).toEqual(['стола', 'города', 'человека']);
    expect([dev['место'], dev['окно'], dev['карта'], dev['вещь'], dev['студент']]).toEqual([null, null, null, null, null]);
  });
});

describe('los rivales y el control positivo', T, () => {
  it('cinco salidas: 9 EVIDENCIA, 2 HOMÓGRAFO (мальчик, вещь), 1 TAREA DE LECTURA (человеков), 0 ROJO', () => {
    const v = ITEMS.map((x) => veredictoRival(x)!);
    const n = (k: string) => v.filter((z) => z.veredicto === k).length;
    expect([n('EVIDENCIA'), n('HOMÓGRAFO'), n('TAREA DE LECTURA'), n('ROJO'), n('NULO VACÍO')]).toEqual([9, 2, 1, 0, 0]);
    expect(v.filter((z) => z.veredicto === 'HOMÓGRAFO').map((z) => z.rival)).toEqual(['мальчик', 'вещь']);
  });
  it('ROJO si se borra la lectura escrita de человеков', () => {
    const guardada = LECTURA_RIVAL['человеков']!;
    delete LECTURA_RIVAL['человеков'];
    try { expect(veredictoRival(ITEMS[idx('человек')]!)!.veredicto).toBe('ROJO'); }
    finally { LECTURA_RIVAL['человеков'] = guardada; }
  });
  it('las falsas se rechazan todas; ninguna es palabra de otro lema; y el control NO rechaza una forma buena', () => {
    for (const f of FALSAS_DEL_LOTE) expect(veredictoFalsa(f.mala, f.buena).rechaza).toBe(true);
    // местов y человеков NO pueden estar: la frecuencia las «rechazaría» por la razón equivocada.
    expect(FALSAS_DEL_LOTE.map((f) => f.mala)).not.toContain('местов');
    expect(FALSAS_DEL_LOTE.map((f) => f.mala)).not.toContain('человеков');
    // CONTROL NEGATIVO: el nominativo singular contra el genitivo plural NO se rechaza por corpus.
    expect(veredictoFalsa('мальчик', 'мальчиков').rechaza).toBe(false);
  });
  it('la clase recalculada separa las cuatro fronteras, y `ninguna` para la basura (E6 del lote 5)', () => {
    const k = (l: string) => { const x = ITEMS[idx(l)]!; return claseDe(entradaNom(x)!, respuestaDe(x)!); };
    expect(['товарищ', 'мужчина', 'место', 'окно', 'человек'].map(k)).toEqual(['regular', 'regular', 'regular', 'vocal-de-apoyo', 'tema-de-plural']);
    expect(claseDe(entradaNom(ITEMS[idx('человек')]!)!, 'zzz')).toBe('ninguna');
  });
  it('el regente se lee de la frase', () => {
    expect(ITEMS.map((x) => regente(frase(x)))).toEqual(['около', 'около', 'от', 'от', 'из', 'из', 'сколько', 'сколько', 'среди', 'среди', 'от', 'от']);
  });
  it('§61 · la Vista no tiene caso ni número: ninguna ruta puede nombrar otra casilla', () => {
    expect(Object.keys(vista(ITEMS[0]!)!).sort()).toEqual(['genero', 'glosa', 'lema', 'pista', 's']);
  });
});
