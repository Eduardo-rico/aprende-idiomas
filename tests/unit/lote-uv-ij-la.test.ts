// tests/unit/lote-uv-ij-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_UV_IJ } from '@/lib/data/languages/la/lotes/l1-uv-ij';
import {
  comoLoEscribeLaEdicionAntigua, coberturaUV, revisarItemUV, revisarLoteUV,
  tasasCiegasUV, type ItemUV,
} from '@/scripts/lib/gate-uv-ij';

const base = LOTE_UV_IJ.find((i) => i.respuesta === 'venit')!;
const con = (p: Partial<ItemUV>): ItemUV => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemUV) => revisarItemUV(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteUV(LOTE_UV_IJ).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
});

describe('la excepción es el punto entero', () => {
  it('hay casos que NO cambian y cada uno dice por qué', () => {
    const fijos = LOTE_UV_IJ.filter((i) => !i.ejes.cambia);
    expect(fijos.length).toBeGreaterThanOrEqual(5);
    for (const i of fijos) expect((i.ejes.porQueNoCambia ?? '').length, i.id).toBeGreaterThan(15);
  });

  it('y está el contraejemplo que el descriptor da: «suus»', () => {
    const suus = LOTE_UV_IJ.find((i) => i.respuesta === 'suus');
    expect(suus, '«suus» es el contraejemplo del propio descriptor').toBeDefined();
    expect(suus!.ejes.cambia).toBe(false);
    expect(suus!.ejes.porQueNoCambia).toContain('ante vocal');
  });

  it('y el contexto que el descriptor NO nombra: «qu»', () => {
    const qui = LOTE_UV_IJ.find((i) => i.respuesta === 'qui')!;
    expect(qui.ejes.cambia).toBe(false);
    expect(qui.ejes.porQueNoCambia).toContain('labiovelar');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('una escrita antigua que no sale de la respuesta', () => {
    expect(clases(con({ escrita: 'venit' }))).toContain('respuesta-no-cuadra');
  });

  it('el eje «cambia» mal declarado', () => {
    expect(clases(con({ ejes: { letra: 'u', cambia: false, porQueNoCambia: 'un motivo suficientemente largo' } })))
      .toContain('eje-mal-declarado');
  });

  it('un caso que no cambia SIN motivo escrito', () => {
    expect(clases(con({ escrita: 'cum', respuesta: 'cum', ejes: { letra: 'u', cambia: false } })))
      .toContain('sin-motivo');
  });

  it('una forma que no es de L1', () => {
    // `volo` estaba aquí y dejó de envenenar: `volō` entró en la tabla de
    // irregulares. Un veneno que deja de envenenar se sustituye.
    expect(clases(con({ escrita: 'urbanus', respuesta: 'vrbanus' }))).toContain('sin-atestiguar');
  });
});

describe('los venenos de LOTE', () => {
  it('un lote donde todo cambia enseña una regla que el punto declara no decidible', () => {
    const lote = LOTE_UV_IJ.filter((i) => i.ejes.cambia);
    expect(tasasCiegasUV(lote).convertirSiempre).toBe(1);
    expect(revisarLoteUV(lote).map((f) => f.clase)).toContain('sin-caso-negativo');
    expect(coberturaUV(lote).find((c) => c.comprobacion.includes('NO cambia'))!.decididos).toBe(0);
  });
});

describe('la escritura antigua se deriva, no se copia', () => {
  it('toda v es u, y la i consonántica inicial puede ser j', () => {
    expect(comoLoEscribeLaEdicionAntigua('venit')).toBe('uenit');
    expect(comoLoEscribeLaEdicionAntigua('vocem')).toBe('uocem');
    expect(comoLoEscribeLaEdicionAntigua('Iesus', true)).toBe('Jesus');
    expect(comoLoEscribeLaEdicionAntigua('cum')).toBe('cum');
  });
});
