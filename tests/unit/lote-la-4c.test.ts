// tests/unit/lote-la-4c.test.ts — el primer lote de concordancia.
import { describe, it, expect } from 'vitest';
import { revisarLoteC, tasasCiegasC, TECHO_C, respuestaRimada } from '../../scripts/lib/gate-concordancia';
import { LOTE_CONCORDANCIA as LOTE } from '../../lib/data/languages/la/lotes/l4-concordancia';
import { revisarCantidad } from '../../lib/data/languages/la/cantidad';
import { concuerda } from '../../lib/data/languages/la/paradigma-la';
import { PISO_LA } from '../../lib/data/languages/la/inventario-puntos';

describe('el primer lote de concordancia', () => {
  it('pasa el gate entero', () => {
    expect(revisarLoteC(LOTE)).toEqual([]);
  });

  it('rimar se queda en el azar del eje binario', () => {
    const t = tasasCiegasC(LOTE);
    expect(t.rimar).toBeLessThanOrEqual(TECHO_C);
    expect(t.queNoRiman).toBeGreaterThanOrEqual(4);
    expect(t.conTrampaDeGenero).toBeGreaterThanOrEqual(4);
  });

  it('LOS DOS EJES ESTÁN DECORRELACIONADOS: las cuatro celdas pobladas', () => {
    // La aserción que este lote no tenía y que lo destapó: los cinco ítems
    // que rimaban eran exactamente los cinco con trampa de género, o sea un
    // eje con dos nombres. Romperlo exigió la 3.ª declinación, porque un
    // neutro de 2.ª rima SIEMPRE y sólo los neutros traen la trampa.
    const cruz = { rr: 0, rn: 0, nr: 0, nn: 0 };
    for (const i of LOTE) cruz[((i.ejes.rima ? 'r' : 'n') + (i.ejes.generoEnganya ? 'r' : 'n')) as keyof typeof cruz]++;
    expect(cruz.rr, 'rima y engaña').toBeGreaterThan(0);
    expect(cruz.rn, 'NO rima y engaña — sólo lo da un neutro de 3.ª').toBeGreaterThan(0);
    expect(cruz.nr, 'rima y no engaña').toBeGreaterThan(0);
    expect(cruz.nn, 'ni rima ni engaña').toBeGreaterThan(0);
  });

  it('trae el ejemplo canónico del descriptor, y por su razón', () => {
    const opus = LOTE.find((i) => i.sustantivo.lema === 'opus')!;
    expect(opus.respuesta).toBe('magnum');
    expect(opus.ejes.rima).toBe(false);        // -us contra -um
    expect(opus.ejes.generoEnganya).toBe(true); // «la obra» contra el neutro
    // Y quien rima no produce ni siquiera una forma: no hay desinencia.
    expect(respuestaRimada(opus)).toBe('');
  });

  it('el error diana está en la respuesta que da RIMAR, no en una inventada', () => {
    // «bona nauta» en vez de «bonus nauta»: el error existe porque la
    // estrategia lo produce, no porque a alguien le pareciera plausible.
    const nauta = LOTE.find((i) => i.id === 'la-4c-01')!;
    expect(nauta.respuesta).toBe('bonus');
    expect(respuestaRimada(nauta)).toBe('bona');
  });

  it('la cantidad de marcos y respuestas, contra el lexicón', () => {
    for (const i of LOTE) {
      expect(revisarCantidad(i.marco.replace('___', '')), `${i.id} marco`).toEqual([]);
      expect(revisarCantidad(i.respuesta), `${i.id} respuesta`).toEqual([]);
    }
  });

  it('cada respuesta es la que deriva la máquina', () => {
    for (const i of LOTE) {
      const [c, n] = i.celda.split('.') as ['nom', 'sg'];
      expect(concuerda(i.adjetivo, i.sustantivo, c, n), i.id).toBe(i.respuesta);
    }
  });

  it('pasa el piso del peldaño', () => {
    expect(LOTE.length).toBeGreaterThanOrEqual(PISO_LA('L1'));
  });
});
