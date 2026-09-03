// tests/unit/lote-la-2d.test.ts — el primer lote de cloze derivado.
import { describe, it, expect } from 'vitest';
import { revisarLoteD, tasasCiegasD, TECHO_D, respuestaIngenua, respuestaSincopada } from '../../scripts/lib/gate-cloze-derivado';
import { LOTE_SEGUNDA as LOTE } from '../../lib/data/languages/la/lotes/l2-segunda';
import { revisarCantidad } from '../../lib/data/languages/la/cantidad';
import { declinar } from '../../lib/data/languages/la/paradigma-la';
import { PISO_LA } from '../../lib/data/languages/la/inventario-puntos';

describe('el primer lote de cloze derivado', () => {
  it('pasa el gate entero', () => {
    expect(revisarLoteD(LOTE)).toEqual([]);
  });

  it('LAS CINCO estrategias ciegas se quedan en el azar o por debajo', () => {
    const t = tasasCiegasD(LOTE);
    expect(t.copiarLema).toBe(0);
    expect(t.copiarGenitivo).toBe(0);
    expect(t.temaDelNominativo).toBeLessThanOrEqual(TECHO_D);
    expect(t.sincoparSiempre).toBeLessThanOrEqual(TECHO_D);
    expect(t.vocativoEnE).toBeLessThanOrEqual(TECHO_D);
    // Y las dos de tema suman uno sobre los ítems que discriminan: son
    // complementarias, así que la mitad y la mitad es la única mezcla.
    expect(t.temaDelNominativo + t.sincoparSiempre).toBe(1);
    expect(t.discriminantes).toBeGreaterThanOrEqual(4);
  });

  it('pasa el piso del peldaño', () => {
    expect(LOTE.length).toBeGreaterThanOrEqual(PISO_LA('L1'));
  });

  it('EL MARCO LATINO pasa el gate de cantidad', () => {
    // Va en su propio campo justamente para esto: mezclado con el español
    // no se le pueden comprobar los mácrons. Cada palabra de cada marco
    // tiene que ser una forma que la máquina produzca.
    for (const it of LOTE) {
      expect(revisarCantidad(it.marco.replace('___', '')), `${it.id}: ${it.marco}`).toEqual([]);
    }
  });

  it('y la RESPUESTA también, y coincide con la que deriva la máquina', () => {
    for (const it of LOTE) {
      expect(revisarCantidad(it.respuesta), it.id).toEqual([]);
      const [c, n] = it.celda.split('.') as ['nom', 'sg'];
      expect(declinar(it.entrada, c, n), it.id).toBe(it.respuesta);
    }
  });

  it('en cada -er, exactamente UNA de las dos derivaciones ciegas acierta', () => {
    // La aserción que importa: no basta con que el gate calle sobre el
    // agregado. Si en un ítem las dos aciertan, ese ítem no discrimina por
    // muy bien puesto que esté el eje.
    for (const it of LOTE.filter((x) => x.ejes.clase === 'conserva' || x.ejes.clase === 'sincopa')) {
      const i = respuestaIngenua(it.entrada, it.celda) === it.respuesta.toLowerCase();
      const s = respuestaSincopada(it.entrada, it.celda) === it.respuesta.toLowerCase();
      expect(i, it.id).not.toBe(s);
    }
  });

  it('lleva la excepción Y su contraste, que hacen falta los dos', () => {
    // Sólo `fīlī` haría ganar a «el vocativo nunca es -e»; sólo `domine`
    // haría ganar a «siempre es -e». La excepción se mide con el par.
    expect(LOTE.find((x) => x.respuesta === 'fīlī')).toBeDefined();
    expect(LOTE.find((x) => x.respuesta === 'domine')).toBeDefined();
  });
});
