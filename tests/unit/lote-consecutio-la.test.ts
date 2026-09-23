// tests/unit/lote-consecutio-la.test.ts — y el gate, en rojo.
//
// El segundo camino de la REGLA es el treebank (`atestacion-consecutio.json`);
// el de la FORMA, la máquina del subjuntivo. Cada veneno de abajo muta uno
// de los campos por donde el lote AFIRMA algo —marco, glosa, pista,
// respuesta— y el lote bueno es el control negativo de todos.
import { describe, it, expect } from 'vitest';
import { LOTE_CONSECUTIO, FUENTE_CONSECUTIO } from '@/lib/data/languages/la/lotes/l7-consecutio';
import {
  CONSECUTIO, RUTAS, personasContraElLexicon, atestiguadas, atestiguado, coberturaConsecutio, revisarItemConsecutio,
  revisarLoteConsecutio, tasasConsecutio, tiempoPedido, LO_QUE_DICE_EL_CORPUS, type ItemConsecutio,
} from '@/scripts/lib/gate-consecutio';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { VERBOS_IMPORTADOS } from '@/lib/data/languages/la/importados';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = FUENTE_CONSECUTIO.find((i) => i.id === 'pa1')!;
const con = (p: Partial<ItemConsecutio>): ItemConsecutio => ({ ...base, ...p });
const clases = (i: ItemConsecutio) => revisarItemConsecutio(i).map((f) => f.clase);
const loteDice = (xs: ItemConsecutio[]) => revisarLoteConsecutio(xs).map((f) => `${f.clase}: ${f.detalle}`).join(' | ');

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteConsecutio(LOTE_CONSECUTIO).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('16 ítems, 4 por casilla, ids únicos', () => {
    expect(LOTE_CONSECUTIO).toHaveLength(16);
    expect(new Set(LOTE_CONSECUTIO.map((i) => i.id)).size).toBe(16);
    const por: Record<string, number> = {};
    for (const i of LOTE_CONSECUTIO) por[tiempoPedido(i)] = (por[tiempoPedido(i)] ?? 0) + 1;
    expect(por).toEqual({ presente: 4, perfecto: 4, imperfecto: 4, pluscuamperfecto: 4 });
  });
  it('ningún marco lleva mácrones: el texto real no los escribe', () => {
    for (const i of LOTE_CONSECUTIO) expect(i.marco, i.id).not.toMatch(/[āēīōūȳ]/u);
  });
});

describe('LA TABLA, clavada a la gramática y no a sí misma', () => {
  // A&G §483: tiempos primarios → presente (simultánea) y perfecto
  // (anterior); históricos → imperfecto y pluscuamperfecto. Escrita aquí
  // literal porque el sello no tiene la RELACIÓN como dimensión (§C5): un
  // volteo dentro de la misma secuencia pasaba la atestación.
  it('las cuatro casillas', () => {
    expect(CONSECUTIO).toEqual({
      primaria: { simultanea: 'presente', anterior: 'perfecto' },
      historica: { simultanea: 'imperfecto', anterior: 'pluscuamperfecto' },
    });
  });
  it('y cada respuesta del lote, contra la casilla literal', () => {
    const esperado: Record<string, string> = { ps: 'presente', pa: 'perfecto', hs: 'imperfecto', ha: 'pluscuamperfecto' };
    for (const i of FUENTE_CONSECUTIO) expect(tiempoPedido(i), i.id).toBe(esperado[i.id.slice(0, 2)]);
  });
  it('la tabla de personas no se separa del lexicón', () => {
    expect(personasContraElLexicon()).toEqual([]);
  });
});

describe('LO QUE EL TREEBANK DICE DE LA REGLA', () => {
  const ii = LO_QUE_DICE_EL_CORPUS.interrogativaIndirecta;
  it('tras presente o futuro: presente y perfecto, e imperfecto NUNCA', () => {
    expect(atestiguadas('primaria', 'presente')).toBeGreaterThan(0);
    expect(atestiguadas('primaria', 'perfecto')).toBeGreaterThan(0);
    // El error del hispanohablante: «pregunta por qué viniera» → *venīret.
    expect(atestiguadas('primaria', 'imperfecto')).toBe(0);
  });
  it('tras imperfecto: imperfecto y pluscuamperfecto, y ni presente ni perfecto', () => {
    expect(atestiguadas('historica', 'imperfecto')).toBeGreaterThan(0);
    expect(atestiguadas('historica', 'pluscuamperfecto')).toBeGreaterThan(0);
    expect(atestiguadas('historica', 'presente')).toBe(0);
    expect(atestiguadas('historica', 'perfecto')).toBe(0);
  });
  it('la tabla del gate es la que el corpus atestigua, casilla a casilla', () => {
    for (const sec of ['primaria', 'historica'] as const)
      for (const rel of ['simultanea', 'anterior'] as const)
        expect(atestiguado(sec, CONSECUTIO[sec][rel]), `${sec}/${rel}`).toBe(true);
  });
  it('y el PERFECTO de indicativo lleva las dos secuencias: por eso no se usa', () => {
    const p = ii.PastPerf ?? {};
    expect((p.Pres ?? 0) + (p.PastPerf ?? 0)).toBeGreaterThan(0);
    expect((p.Past ?? 0) + (p.Pqp ?? 0)).toBeGreaterThan(0);
  });
  it('y el control de que el sello no es un cero por no mirar: hay más de 100 casos', () => {
    const n = Object.values(ii).flatMap((f) => Object.values(f)).reduce((a, b) => a + b, 0);
    expect(n).toBeGreaterThan(100);
  });
});

describe('las rutas, que pueden fallar y se comprueba', () => {
  for (const [nom, f] of Object.entries(RUTAS)) {
    it(`«${nom}» acierta en algún ítem y falla en alguno`, () => {
      expect(LOTE_CONSECUTIO.some((i) => f(i) === tiempoPedido(i))).toBe(true);
      expect(LOTE_CONSECUTIO.some((i) => f(i) !== tiempoPedido(i))).toBe(true);
    });
  }
  it('las dos rutas mexicanas fallan cada una EXACTAMENTE una casilla, y distinta', () => {
    const f1 = RUTAS['imperfecto tras primario («dónde estaba»)']!;
    const f2 = RUTAS['el pretérito mexicano («preguntaba si vinieron»)']!;
    const fallan1 = LOTE_CONSECUTIO.filter((i) => f1(i) !== tiempoPedido(i));
    const fallan2 = LOTE_CONSECUTIO.filter((i) => f2(i) !== tiempoPedido(i));
    expect(fallan1.every((i) => tiempoPedido(i) === 'perfecto')).toBe(true);
    expect(fallan2.every((i) => tiempoPedido(i) === 'pluscuamperfecto')).toBe(true);
    expect([fallan1.length, fallan2.length]).toEqual([4, 4]);
  });
  it('los números medidos son los predichos en la cabecera del lote', () => {
    const t = tasasConsecutio(LOTE_CONSECUTIO);
    expect(t['siempre presente']).toBe(4 / 16);
    expect(t['sólo el regente (la regla de la final)']).toBe(8 / 16);
    expect(t['imperfecto tras primario («dónde estaba»)']).toBe(12 / 16);
    expect(t['el pretérito mexicano («preguntaba si vinieron»)']).toBe(12 / 16);
  });
});

describe('los venenos del ÍTEM', () => {
  it('control: el ítem base limpio', () => { expect(clases(base)).toEqual([]); });
  it('la relación volteada con la respuesta de antes', () => {
    expect(clases(con({ relacion: 'simultanea', ejes: { ...base.ejes, relacion: 'simultanea' } }))).toContain('respuesta-no-derivable');
  });
  it('la respuesta del error diana (imperfecto tras presente)', () => {
    expect(clases(con({ respuesta: 'venīrent' }))).toContain('respuesta-no-derivable');
  });
  it('el regente cambiado de tiempo en el marco', () => {
    expect(clases(con({ marcoConCantidad: 'Rēgīna rogābat quandō nautae ___.', marco: 'Regina rogabat quando nautae ___.' }))).toContain('marco-no-derivable');
  });
  it('el marco con mácrones', () => {
    expect(clases(con({ marco: base.marcoConCantidad }))).toContain('marco-con-cantidad');
  });
  it('la glosa con el verbo de la principal en otro tiempo', () => {
    expect(clases(con({ glosa: base.glosa.replace('preguntará', 'preguntaba') }))).toContain('glosa-no-derivable');
  });
  it('la glosa que regala el tiempo subordinado', () => {
    expect(clases(con({ glosa: base.glosa.replace('…', 'vinieron') }))).toContain('glosa-no-derivable');
  });
  it('la pista con la relación volteada, o sin ella', () => {
    expect(clases(con({ pista: 'veniō · a la vez que la pregunta' }))).toContain('pista-no-dice-la-relacion');
    expect(clases(con({ pista: 'veniō' }))).toContain('pista-no-dice-la-relacion');
  });
  it('un verbo con perfecto en -vī, cuya forma sincopada la clave suspendería', () => {
    const v = V('vocō');
    expect(clases(con({ verbo: v }))).toContain('perfecto-sincopable');
  });
  it('un regente importado sin glosa', () => {
    const r = VERBOS_IMPORTADOS.find((x) => x.lema === 'interrogō')!;
    expect(clases(con({ regente: r }))).toContain('regente-sin-glosa');
  });
  it('un regente en presente, que puede ser histórico', () => {
    expect(clases(con({ tiempoRegente: 'presente' as never }))).toContain('regente-ambiguo');
  });
  it('una clave que el publicador sirve y el gate no mira: `alternativas`', () => {
    expect(clases({ ...base, alternativas: ['venīrent'] } as ItemConsecutio)).toContain('clave-no-declarada');
  });
  it('`ejes.colapsaAlLeer`, que haría que el publicador apartara el ítem', () => {
    expect(clases({ ...base, ejes: { ...base.ejes, colapsaAlLeer: 'x' } } as ItemConsecutio)).toContain('clave-no-declarada');
  });
  it('un punto ajeno', () => { expect(clases(con({ punto: 'l7-ut-final' }))).toContain('punto-ajeno'); });
  it('un sujeto que no es persona: no puede preguntar, y el español no se deriva', () => {
    expect(clases(con({ sujetoPrincipal: { lema: 'verbum', numero: 'sg' } }))).toContain('glosa-no-derivable');
  });
  it('la casilla que el corpus no tiene', () => {
    expect(atestiguado('primaria', 'imperfecto')).toBe(false);
  });
});

describe('los venenos del LOTE', () => {
  it('sin la casilla primaria-anterior: la ruta española pasa del suelo', () => {
    const d = loteDice(LOTE_CONSECUTIO.filter((i) => tiempoPedido(i) !== 'perfecto'));
    expect(d).toContain('celda-sin-cubrir');
    expect(d).toContain('dónde estaba');
  });
  it('sólo regente primario: varia incompleto', () => {
    expect(loteDice(LOTE_CONSECUTIO.filter((i) => i.tiempoRegente !== 'imperfecto'))).toContain('varia-incompleto');
  });
  it('una partícula que sólo sale en una casilla', () => {
    // La partícula se CALCULA: una que el lote no use. Escrita a mano
    // (`quōmodo`) dejó de envenenar en cuanto entró en otras casillas.
    const libre = (['num', 'an', 'ubi', 'cūr', 'quandō', 'quōmodo'] as const).find((p) => !LOTE_CONSECUTIO.some((i) => i.particula === p));
    if (!libre) throw new Error('no queda partícula libre para el veneno');
    const xs = LOTE_CONSECUTIO.map((i) => (tiempoPedido(i) === 'perfecto' ? { ...i, particula: libre } : i));
    expect(loteDice(xs)).toContain('pista-de-marco');
  });
  it('un verbo confinado a una DIAGONAL: cada eje por separado varía y aun así da la casilla', () => {
    const diag = (i: ItemConsecutio) => ['ps', 'ha'].includes(i.id.slice(0, 2));
    const xs = FUENTE_CONSECUTIO.map((i) => (diag(i) ? { ...i } : i));
    // Se reparte: veniō sólo en ps/ha y stō sólo en pa/hs, con el resto
    // coherente (respuesta de la máquina, marco y pista regenerados).
    const v = VERBOS_L1.find((x) => x.lema === 'veniō')!, st = VERBOS_L1.find((x) => x.lema === 'stō')!;
    const mut = xs.map((i) => ({ ...i, verbo: diag(i) ? v : st }));
    expect(loteDice(mut)).toContain('primaria-simultanea');
  });
  it('agrupado por casilla, el orden lo delata', () => {
    expect(loteDice(FUENTE_CONSECUTIO)).toContain('orden-publicado');
  });
  it('la cobertura de las excepciones es un cero declarado con motivo', () => {
    const c = coberturaConsecutio(LOTE_CONSECUTIO).find((x) => x.comprobacion.includes('excepciones'))!;
    expect(c.decididos).toBe(0);
    expect(c.elCeroEsUnResultado ?? '').toContain('PERMISIVAS');
  });
  it('ningún regente en presente ni en perfecto', () => {
    for (const i of LOTE_CONSECUTIO) expect(['futuro', 'imperfecto'], i.id).toContain(i.tiempoRegente);
  });
});
