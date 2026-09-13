// tests/unit/lote-cantidad-fonemica-la.test.ts
import { describe, it, expect } from 'vitest';
import { LOTE_CANTIDAD_FONEMICA } from '@/lib/data/languages/la/lotes/l1-cantidad-fonemica';
import { coberturaCantidad, revisarLoteCantidad, tasasCiegasCant } from '@/scripts/lib/gate-cantidad-fonemica';
import { parDe } from '@/lib/data/languages/la/pares-de-cantidad';
import { palabrasDesconocidas } from '@/scripts/lib/gate-vocabulario-del-marco';

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteCantidad(LOTE_CANTIDAD_FONEMICA).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('llega al piso de L1', () => {
    expect(LOTE_CANTIDAD_FONEMICA.length).toBeGreaterThanOrEqual(8);
  });
});

describe('el equilibrio va absoluto y sale exacto', () => {
  it('mitad con la diana larga y mitad con la breve', () => {
    const t = tasasCiegasCant(LOTE_CANTIDAD_FONEMICA);
    expect(t.siempreMacron).toBe(0.5);
    expect(t.nuncaMacron).toBe(0.5);
    // Las dos estrategias son complementarias: el máximo nunca baja del
    // 50 %, así que el umbral no puede ir sobre las tasas.
    expect(t.siempreMacron + t.nuncaMacron).toBe(1);
  });
});

describe('el varia: tipo de par y vocal', () => {
  it('hay pares léxicos y morfológicos', () => {
    const tipos = LOTE_CANTIDAD_FONEMICA.map((i) => i.ejes.tipo);
    expect(tipos.filter((t) => t === 'lexico').length).toBeGreaterThanOrEqual(3);
    expect(tipos.filter((t) => t === 'morfologico').length).toBeGreaterThanOrEqual(8);
  });

  it('y las cinco vocales', () => {
    expect(new Set(LOTE_CANTIDAD_FONEMICA.map((i) => i.ejes.vocal))).toEqual(new Set(['a', 'e', 'i', 'o', 'u']));
    expect(coberturaCantidad(LOTE_CANTIDAD_FONEMICA).find((c) => c.comprobacion.includes('vocal'))!.decididos).toBe(5);
  });

  it('ningún par se repite', () => {
    const s = LOTE_CANTIDAD_FONEMICA.map((i) => i.sinMacrones);
    expect(new Set(s).size).toBe(s.length);
  });
});

describe('cada ítem es un par de verdad y sus dos miembros existen', () => {
  it('el par está en el dominio y «el otro» es el otro', () => {
    for (const i of LOTE_CANTIDAD_FONEMICA) {
      const p = parDe(i.sinMacrones);
      expect(p, i.id).not.toBeNull();
      const formas = p!.miembros.map((m) => m.forma.normalize('NFC'));
      expect(formas, i.id).toContain(i.respuesta.normalize('NFC'));
      expect(formas, i.id).toContain(i.elOtro.normalize('NFC'));
      expect(i.respuesta).not.toBe(i.elOtro);
    }
  });

  it('y la diana se lee en la posición donde difieren, no «algún mácrón»', () => {
    // `legēs` lleva `ē` en la desinencia y su diana es la PRIMERA vocal,
    // que ahí es breve.
    const leges = LOTE_CANTIDAD_FONEMICA.find((i) => i.respuesta === 'legēs');
    if (leges) {
      expect(/[āēīōūȳ]/.test(leges.respuesta)).toBe(true);
      expect(leges.ejes.dianaLarga).toBe(false);
    }
  });
});

describe('los marcos', () => {
  it('usan sólo vocabulario de L1 y no llevan ninguno de los dos miembros', () => {
    for (const i of LOTE_CANTIDAD_FONEMICA) {
      expect(palabrasDesconocidas(i.marco), `${i.id}: ${i.marco}`).toEqual([]);
      const m = i.marco.toLowerCase();
      for (const f of [i.respuesta, i.elOtro])
        expect(m.replace('___', ' ').includes(f.toLowerCase()), `${i.id} lleva «${f}»`).toBe(false);
    }
  });
});
