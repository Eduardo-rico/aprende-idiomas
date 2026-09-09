// tests/unit/lote-conjugacion-la.test.ts
//
// «Qué conjugación es». El control que importa es el último grupo: la mixta
// es INDISTINGUIBLE de la 3.ª mirando el infinitivo, con macrón y sin él, y
// eso es lo que obliga a que la entrada muestre las dos primeras partes.
import { describe, it, expect } from 'vitest';
import { LOTE_CONJUGACION } from '@/lib/data/languages/la/lotes/l5-conjugacion-por-infinitivo';
import {
  revisarItemConjugacion, revisarLoteConjugacion, conjugacionDe,
  soloElInfinitivoSinCantidad, soloElInfinitivoConCantidad, pisoSinCantidad,
  CONJUGACIONES, TECHO_CINCO, type ItemConjugacion,
} from '@/scripts/lib/gate-conjugacion';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const copia = (): ItemConjugacion[] => LOTE_CONJUGACION.map((it) => ({ ...it }));

describe('la conjugación · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteConjugacion(LOTE_CONJUGACION);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('trae las cinco clases, incluida la mixta que el varia exige', () => {
    for (const c of CONJUGACIONES)
      expect(LOTE_CONJUGACION.some((it) => it.respuesta === c), c).toBe(true);
    expect(LOTE_CONJUGACION.filter((it) => it.respuesta === 'mixta').length).toBeGreaterThanOrEqual(2);
  });

  it('toda entrada muestra las DOS primeras partes', () => {
    for (const it of LOTE_CONJUGACION) {
      expect(it.entrada, it.id).toContain(it.verbo.lema);
      expect(it.entrada, it.id).toContain(it.verbo.infinitivo);
    }
  });

  it('la respuesta la deriva la máquina', () => {
    for (const it of LOTE_CONJUGACION) expect(it.respuesta, it.id).toBe(conjugacionDe(it.verbo));
  });
});

describe('POR QUÉ la entrada trae las dos partes', () => {
  it('la mixta y la 3.ª tienen el mismo infinitivo, con macrón y sin él', () => {
    expect(V('capiō').infinitivo).toBe('capere');
    expect(V('legō').infinitivo).toBe('legere');
    // Las dos acaban en `-ere` con la `e` breve: no hay cantidad que leer.
    expect(soloElInfinitivoConCantidad(V('capiō'))).toBe('3ª');
    expect(conjugacionDe(V('capiō'))).toBe('mixta');
    // Lo que las separa es el `-iō` de la primera parte principal.
    expect(V('capiō').lema.endsWith('iō')).toBe(true);
    expect(V('legō').lema.endsWith('iō')).toBe(false);
  });

  it('y sin cantidad se confunden además la 2.ª y la 3.ª', () => {
    expect(soloElInfinitivoSinCantidad(V('habeō'))).toBe('3ª');   // habēre
    expect(conjugacionDe(V('habeō'))).toBe('2ª');
    expect(soloElInfinitivoSinCantidad(V('legō'))).toBe('3ª');    // legere
    expect(conjugacionDe(V('legō'))).toBe('3ª');
  });
});

describe('el suelo que pone la escritura', () => {
  it('se calcula del lote y no se elige', () => {
    const n = LOTE_CONJUGACION.length;
    const ineq = LOTE_CONJUGACION.filter((it) => it.respuesta === '1ª' || it.respuesta === '4ª').length;
    expect(pisoSinCantidad(LOTE_CONJUGACION)).toBeCloseTo((ineq + (n - ineq) / 3) / n, 9);
  });

  it('y es MUY superior al azar de cinco valores, que era el listón malo', () => {
    // Con el techo fijo del 20 % este lote salía en rojo, y «arreglarlo»
    // habría significado quitar la 1.ª y la 4.ª —dos de las cinco clases que
    // el punto pide cubrir— para que un número quedara bonito.
    expect(pisoSinCantidad(LOTE_CONJUGACION)).toBeGreaterThan(TECHO_CINCO * 2);
    expect(revisarLoteConjugacion(LOTE_CONJUGACION).rutas.sinCantidad)
      .toBeLessThanOrEqual(pisoSinCantidad(LOTE_CONJUGACION) + 0.1);
  });
});

describe('la conjugación · ROJO', () => {
  it('sin mixtas, el infinitivo resuelve el lote entero', () => {
    const sinMixta = copia().filter((it) => it.respuesta !== 'mixta');
    const r = revisarLoteConjugacion(sinMixta);
    expect(r.fallos.some((f) => f.clase === 'clase-sin-cubrir')).toBe(true);
    expect(r.rutas.conCantidad).toBe(1);   // la ruta acierta el 100 %
  });

  it('una entrada que sólo muestra el infinitivo', () => {
    const it = copia().find((x) => x.respuesta === 'mixta')!;
    it.entrada = it.verbo.infinitivo;
    expect(revisarItemConjugacion(it).some((f) => f.clase === 'entrada-incompleta')).toBe(true);
  });

  it('una respuesta que la máquina no deriva', () => {
    const it = copia()[0]!;
    it.respuesta = it.respuesta === '1ª' ? '2ª' : '1ª';
    expect(revisarItemConjugacion(it).some((f) => f.clase === 'respuesta-no-derivada')).toBe(true);
  });

  it('un lote escorado a una clase se contesta repitiéndola', () => {
    const unas = copia().filter((it) => it.respuesta === '1ª');
    const r = revisarLoteConjugacion([...unas, ...unas, ...copia().filter((it) => it.respuesta !== '1ª').slice(0, 2)]);
    expect(r.fallos.some((f) => f.clase === 'ruta-ciega' && f.detalle.includes('siempre la misma clase'))).toBe(true);
  });
});
