// tests/unit/lote-acento-penultima-la.test.ts
import { describe, it, expect } from 'vitest';
import { LOTE_ACENTO_PENULTIMA } from '@/lib/data/languages/la/lotes/l1-acento-penultima';
import { coberturaAcento, revisarLoteAcento, SUELO_DE_LA_PENULTIMA, tasasCiegasAc } from '@/scripts/lib/gate-acento-la';
import { PUNTOS_LA } from '@/lib/data/languages/la/inventario-puntos';

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteAcento(LOTE_ACENTO_PENULTIMA).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });

  it('y trae los 20 ítems que el punto pide', () => {
    const p = PUNTOS_LA.find((x) => x.id === 'l1-acento-penultima')!;
    expect(LOTE_ACENTO_PENULTIMA.length).toBe((p as { itemsQuePide?: number }).itemsQuePide ?? 20);
  });
});

describe('las dos distorsiones son deliberadas y están medidas', () => {
  it('el lote va 10 y 10 aunque la lengua dé seis de cada diez llanas', () => {
    const llanas = LOTE_ACENTO_PENULTIMA.filter((i) => i.ejes.tipo !== 'breve').length;
    expect(llanas).toBe(10);
    expect(SUELO_DE_LA_PENULTIMA).toBeGreaterThan(0.6);
    // contestar «la penúltima» a todo resuelve la mitad del lote y seis
    // décimas de la lengua: la diferencia es el trabajo del lote
    expect(tasasCiegasAc(LOTE_ACENTO_PENULTIMA).siempreLaPenultima).toBeLessThanOrEqual(0.5);
  });

  it('la penúltima larga POR POSICIÓN va al 25 % y en la lengua es el 3,8 %', () => {
    const pos = LOTE_ACENTO_PENULTIMA.filter((i) => i.ejes.tipo === 'posicion').length;
    expect(pos).toBe(5);
    expect(pos / LOTE_ACENTO_PENULTIMA.length).toBeGreaterThan(0.2);
  });
});

describe('el varia, que son dos ejes', () => {
  it('la longitud se recorre de 2 a 4 sílabas', () => {
    const ns = new Set(LOTE_ACENTO_PENULTIMA.map((i) => i.ejes.silabas));
    expect([...ns].sort()).toEqual([2, 3, 4]);
  });

  it('y están los dos tipos de penúltima larga que el lexicón permite', () => {
    const tipos = new Set(LOTE_ACENTO_PENULTIMA.map((i) => i.ejes.tipo));
    expect(tipos).toContain('macron');
    expect(tipos).toContain('posicion');
    expect(tipos).toContain('bisilabo');
    expect(tipos).toContain('breve');
    // y el diptongo NO, porque no existe en L1
    expect(tipos).not.toContain('diptongo');
    expect(coberturaAcento(LOTE_ACENTO_PENULTIMA).find((c) => c.comprobacion.includes('DIPTONGO'))!.elCeroEsUnResultado)
      .toBeTruthy();
  });
});

describe('la excepción declarada', () => {
  it('los bisílabos son llanos pase lo que pase, y «Deus» es el caso', () => {
    const bis = LOTE_ACENTO_PENULTIMA.filter((i) => i.ejes.tipo === 'bisilabo');
    expect(bis.length).toBeGreaterThanOrEqual(2);
    const deus = bis.find((i) => i.palabra === 'Deus')!;
    expect(deus.respuesta).toBe('de');
    expect(deus.ejes.silabas).toBe(2);
  });
});

describe('ninguna pista nombra su respuesta', () => {
  it('y son sílabas de dos letras, así que la comprobación va por palabra suelta', () => {
    for (const i of LOTE_ACENTO_PENULTIMA) {
      const r = new RegExp(`(?<!\\p{L})${i.respuesta}(?!\\p{L})`, 'iu');
      expect(r.test(i.pista.normalize('NFC')), `${i.id}: «${i.pista}» / «${i.respuesta}»`).toBe(false);
    }
  });
});
