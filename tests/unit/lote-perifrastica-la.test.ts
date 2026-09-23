// tests/unit/lote-perifrastica-la.test.ts — y el gate, en rojo.
//
// El segundo camino de la REGLA es el treebank (`atestacion-perifrastica.json`);
// el de la FORMA, la máquina. Cada veneno muta uno de los campos por donde
// el lote AFIRMA algo —marco, glosa, pista, respuesta, las tablas del
// español, el sello— y el lote bueno es el control negativo de todos.
import { describe, it, expect } from 'vitest';
import { LOTE_PERIFRASTICA, FUENTE_PERIFRASTICA } from '@/lib/data/languages/la/lotes/l8-perifrastica-pasiva';
import {
  AGENTES_ES, VERBO_ES, RUTAS, LO_QUE_DICE_EL_CORPUS, atestiguada, coberturaPerifrastica, participioRegular,
  preposicionAnte, respuestaDerivada, revisarItemPerifrastica, revisarLotePerifrastica, tablasContraElLexicon,
  tasasPerifrastica, type ItemPerifrastica,
} from '@/scripts/lib/gate-perifrastica';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const P = FUENTE_PERIFRASTICA.find((i) => i.id === 'P1')!;
const Q = FUENTE_PERIFRASTICA.find((i) => i.id === 'Q7')!;
const clases = (i: ItemPerifrastica) => revisarItemPerifrastica(i).map((f) => f.clase);
const loteDice = (xs: ItemPerifrastica[]) => revisarLotePerifrastica(xs).map((f) => `${f.clase}: ${f.detalle}`).join(' | ');
const PERIF = (i: ItemPerifrastica) => i.construccion === 'perifrastica';

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLotePerifrastica(LOTE_PERIFRASTICA).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('12 ítems, mitad y mitad, ids únicos', () => {
    expect(LOTE_PERIFRASTICA).toHaveLength(12);
    expect(new Set(LOTE_PERIFRASTICA.map((i) => i.id)).size).toBe(12);
    expect(LOTE_PERIFRASTICA.filter(PERIF)).toHaveLength(6);
  });
  it('ningún marco lleva mácrones: el texto real no los escribe', () => {
    for (const i of LOTE_PERIFRASTICA) expect(i.marco, i.id).not.toMatch(/[āēīōūȳ]/u);
  });
  it('la regla, literal: perifrástica → dativo; pasiva → ā + ablativo', () => {
    for (const i of FUENTE_PERIFRASTICA)
      expect(i.respuesta, i.id).toMatch(i.id.startsWith('P') ? /^[^\s]+ī$/u : /^ā \S+e$/u);
  });
});

describe('LO QUE EL TREEBANK DICE DE LA REGLA', () => {
  const s = LO_QUE_DICE_EL_CORPUS.porCabeza;
  it('gerundivo con sum: el dativo manda, y con nombres también', () => {
    expect(s.gerundivoConSum.dativo).toBeGreaterThan(5 * s.gerundivoConSum.conAb);
    expect(s.gerundivoConSum.dativoNombre).toBeGreaterThan(0);
  });
  it('pasiva de infectum: ā/ab manda', () => {
    expect(s.infectumPasivo.conAb).toBeGreaterThan(20 * s.infectumPasivo.dativo);
  });
  it('y la pasiva de PERFECTO admite dativo: por eso no se usa', () => {
    expect(s.participioPerfecto.dativo).toBeGreaterThan(0);
  });
  it('la excepción se cuenta también donde el anotador la etiqueta `obl` («ā nātūrā petundum est»)', () => {
    expect(s.gerundivoConSum.conAbObl.some((x) => x.startsWith('natura'))).toBe(true);
    const a = atestiguada('perifrastica');
    expect(a.b).toBe(s.gerundivoConSum.conAb + s.gerundivoConSum.conAbObl.length);
  });
  it('el sello no es un cero por no mirar', () => {
    expect(LO_QUE_DICE_EL_CORPUS.agentesAnotados).toBeGreaterThan(300);
    expect(atestiguada('perifrastica').ok).toBe(true);
    expect(atestiguada('pasiva').ok).toBe(true);
  });
  it('ā ante p/m/f; ab ante vocal; y ante r y s las dos, que el gate rechaza', () => {
    expect(preposicionAnte('patre')).toBe('ā');
    expect(preposicionAnte('mātre')).toBe('ā');
    expect(preposicionAnte('frātre')).toBe('ā');
    expect(preposicionAnte('rēge')).toBeNull();
    expect(preposicionAnte('servō')).toBeNull();
  });
  it('EN ROJO: un sello volteado deja la regla sin atestiguar', () => {
    const c = s.gerundivoConSum, antes = { ...c };
    try {
      c.dativo = antes.conAb; c.conAb = antes.dativo;
      expect(clases(P)).toContain('regla-sin-atestiguar');
    } finally { Object.assign(c, antes); }
    expect(clases(P)).toEqual([]);
  });
});

describe('las tablas del español, atadas al lexicón', () => {
  it('limpias', () => { expect(tablasContraElLexicon()).toEqual([]); });
  it('el participio se DERIVA del infinitivo, con la tilde tras vocal', () => {
    expect(participioRegular('alabar')).toBe('alabado');
    expect(participioRegular('advertir')).toBe('advertido');
    expect(participioRegular('oír')).toBe('oído');
  });
  it('EN ROJO: un participio que no es el de su infinitivo («loado» por «alabar»)', () => {
    const antes = VERBO_ES['laudō']!.participio;
    try {
      VERBO_ES['laudō']!.participio = 'loado';
      expect(tablasContraElLexicon().join(' ')).toContain('loado');
    } finally { VERBO_ES['laudō']!.participio = antes; }
  });
  it('EN ROJO: un agente con el género cambiado', () => {
    const antes = AGENTES_ES['māter']!.genero;
    try {
      AGENTES_ES['māter']!.genero = 'm';
      expect(tablasContraElLexicon().join(' ')).toContain('māter');
    } finally { AGENTES_ES['māter']!.genero = antes; }
  });
});

describe('las rutas, que pueden fallar y se comprueba', () => {
  for (const [nom, f] of Object.entries(RUTAS)) {
    it(`«${nom}» acierta en algún ítem y falla en alguno`, () => {
      expect(LOTE_PERIFRASTICA.some((i) => f(i) === i.respuesta)).toBe(true);
      expect(LOTE_PERIFRASTICA.some((i) => f(i) !== i.respuesta)).toBe(true);
    });
  }
  it('los números medidos son los predichos en la cabecera del lote', () => {
    const t = tasasPerifrastica(LOTE_PERIFRASTICA);
    expect(t['siempre ā + ablativo (el «por» español)']).toBe(6 / 12);
    expect(t['siempre dativo']).toBe(6 / 12);
  });
});

describe('los venenos del ÍTEM', () => {
  it('control: los dos ítems base limpios', () => { expect(clases(P)).toEqual([]); expect(clases(Q)).toEqual([]); });
  it('el error diana como clave: «ā patre» en la perifrástica', () => {
    expect(clases({ ...P, respuesta: 'ā patre' })).toContain('respuesta-no-derivable');
  });
  it('el dativo en la pasiva ordinaria', () => {
    expect(clases({ ...Q, respuesta: 'patrī' })).toContain('respuesta-no-derivable');
  });
  it('«ab» donde el corpus escribe «ā»', () => {
    expect(clases({ ...Q, respuesta: 'ab patre' })).toContain('respuesta-no-derivable');
  });
  it('la preposición metida en el marco, que da el caso', () => {
    expect(clases({ ...Q, marcoConCantidad: 'Fīlius ā ___ vocātur.', marco: 'Filius a ___ vocatur.' })).toContain('marco-no-derivable');
  });
  it('un mácrón inventado en el marco con cantidad', () => {
    expect(clases({ ...P, marcoConCantidad: 'Fīlius ___ laudandus ēst.' })).toContain('marco-no-derivable');
  });
  it('el marco con mácrones', () => { expect(clases({ ...P, marco: P.marcoConCantidad })).toContain('marco-con-cantidad'); });
  it('la glosa de la otra construcción', () => {
    expect(clases({ ...Q, glosa: 'El hijo debe ser llamado por el padre' })).toContain('glosa-no-derivable');
  });
  it('la glosa sin «por», o con otro participio', () => {
    expect(clases({ ...P, glosa: P.glosa.replace(' por ', ' de ') })).toContain('glosa-no-derivable');
    expect(clases({ ...P, glosa: P.glosa.replace('alabado', 'alabada') })).toContain('glosa-no-derivable');
  });
  it('la pista que dice la regla', () => { expect(clases({ ...P, pista: 'pater · dativo' })).toContain('pista-no-derivable'); });
  it('la pista sin la consigna de la forma NORMAL: afirmaría que «ā patre» está mal', () => {
    expect(clases({ ...P, pista: 'pater' })).toContain('pista-no-derivable');
  });
  it('la consigna es la misma en las dos mitades: si cambiara, diría cuál es', () => {
    expect(new Set(LOTE_PERIFRASTICA.map((i) => i.pista.replace(/^\S+ · /u, ''))).size).toBe(1);
  });
  it('los tres verbos que sacó el latinista no vuelven', () => {
    for (const l of ['amō', 'dūcō', 'audiō']) expect(clases({ ...P, verbo: V(l) }), l).toContain('verbo-no-declarado');
  });
  it('un verbo de dativo de destinatario (mittō)', () => { expect(clases({ ...P, verbo: V('mittō') })).toContain('verbo-no-declarado'); });
  it('un agente fuera de la tabla', () => { expect(clases({ ...P, agente: 'dominus' })).toContain('agente-no-declarado'); });
  it('EN ROJO: un agente de la 2.ª (dativo = ablativo) o de la 1.ª (dativo = genitivo), aunque se declare', () => {
    try {
      AGENTES_ES['dominus'] = { es: 'señor', genero: 'm' };
      AGENTES_ES['fīlia'] = { es: 'hija', genero: 'f' };
      expect(clases({ ...P, agente: 'dominus' })).toContain('agente-ambiguo');
      expect(clases({ ...P, agente: 'fīlia' })).toContain('agente-ambiguo');
    } finally { delete AGENTES_ES['dominus']; delete AGENTES_ES['fīlia']; }
  });
  it('una clave que el publicador sirve y el gate no mira: `alternativas`', () => {
    expect(clases({ ...P, alternativas: ['ā patre'] } as ItemPerifrastica)).toContain('clave-no-declarada');
  });
  it('`ejes.colapsaAlLeer`', () => {
    expect(clases({ ...P, ejes: { ...P.ejes, colapsaAlLeer: 'x' } } as ItemPerifrastica)).toContain('clave-no-declarada');
  });
  it('los ejes que no dicen lo que el ítem es', () => {
    expect(clases({ ...P, ejes: { ...P.ejes, construccion: 'pasiva' } })).toContain('eje-mal-declarado');
  });
  it('un punto ajeno', () => { expect(clases({ ...P, punto: 'l6-pasiva-infectum' })).toContain('punto-ajeno'); });
  it('la respuesta derivada cambia con la construcción', () => {
    expect(respuestaDerivada({ construccion: 'perifrastica', agente: 'pater' })).toBe('patrī');
    expect(respuestaDerivada({ construccion: 'pasiva', agente: 'pater' })).toBe('ā patre');
  });
});

describe('los venenos del LOTE', () => {
  it('sólo perifrásticas: «siempre dativo» al 100 %', () => {
    const d = loteDice(LOTE_PERIFRASTICA.filter(PERIF));
    expect(d).toContain('mitades-desiguales');
    expect(d).toContain('siempre dativo');
  });
  it('un agente confinado a una mitad', () => {
    const xs = LOTE_PERIFRASTICA.map((i) => (i.agente === 'pater' && !PERIF(i) ? { ...i, agente: 'māter', respuesta: 'ā mātre', glosa: i.glosa.replace('por el padre', 'por la madre') } : i));
    expect(loteDice(xs)).toContain('agente «pater»');
  });
  it('una COMBINACIÓN de rasgos confinada a una mitad (la diagonal)', () => {
    // Todas las perifrásticas de imperfecto pasan a plural y todas las
    // pasivas de imperfecto a singular: cada rasgo sigue en las dos
    // mitades, la combinación no.
    const xs = LOTE_PERIFRASTICA.map((i) => (i.tiempo === 'imperfecto' ? { ...i, sujeto: { ...i.sujeto, numero: PERIF(i) ? 'pl' as const : 'sg' as const } } : i));
    expect(loteDice(xs)).toContain('tiempo + número del sujeto');
  });
  it('dos ítems que comparten verbo y agente se reconocen', () => {
    const p2 = FUENTE_PERIFRASTICA.find((i) => i.id === 'P2')!; // vocō · māter
    const xs = FUENTE_PERIFRASTICA.map((i) => (i.id === 'Q7' ? { ...i, agente: 'māter' } : i));
    expect(loteDice(xs)).toContain(`comparten verbo «${p2.verbo.lema}» y agente «māter»`);
  });
  it('agrupado por mitad, el orden lo delata', () => {
    expect(loteDice(FUENTE_PERIFRASTICA)).toContain('orden-publicado');
  });
  it('la excepción de A&G §374 N.1 es un cero declarado con motivo', () => {
    const c = coberturaPerifrastica(LOTE_PERIFRASTICA).find((x) => x.comprobacion.includes('374 N.1'))!;
    expect(c.decididos).toBe(0);
    expect(c.elCeroEsUnResultado ?? '').toContain('lexicón');
  });
});
