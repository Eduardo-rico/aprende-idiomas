// tests/unit/lote-la-fpd.test.ts — el primer lote, contra su propio gate.
import { describe, it, expect } from 'vitest';
import { revisarLote, respuestaPosicional } from '../../scripts/lib/gate-cloze-glosa';
import { LOTE_FUNCION_POR_DESINENCIA as LOTE } from '../../lib/data/languages/la/lotes/l3-funcion-por-desinencia';
import { revisarOrtografiaLa } from '@/lib/lang/ortografia-la';

describe('el primer lote de latín', () => {
  it('pasa el gate del formato entero', () => {
    expect(revisarLote(LOTE)).toEqual([]);
  });

  it('llega al piso de L1 y lo pasa', () => {
    expect(LOTE.length).toBeGreaterThanOrEqual(8);
  });

  it('en TODOS, traducir en el orden del latín da la respuesta EQUIVOCADA', () => {
    // La aserción que importa, y en la dirección que destapa el fallo:
    // no basta con que el gate no marque nada. El lector posicional tiene
    // que equivocarse en los doce, porque si acierta en uno, ese ítem no
    // examina el punto por muy limpio que esté.
    for (const it of LOTE) {
      expect(respuestaPosicional(it), it.id).not.toEqual(it.respuestas);
    }
  });

  it('el latín pasa la norma ortográfica', () => {
    for (const it of LOTE) expect(revisarOrtografiaLa(it.latin), it.id).toEqual([]);
  });

  it('recorre los tres órdenes útiles y las cuatro conjugaciones', () => {
    expect(new Set(LOTE.map((i) => i.ejes.orden))).toEqual(new Set(['OSV', 'OVS', 'VOS']));
    expect(new Set(LOTE.map((i) => i.ejes.conjugacion))).toEqual(new Set([1, 2, 3, 4]));
    expect(new Set(LOTE.map((i) => i.ejes.numero))).toEqual(new Set(['sg', 'pl']));
  });
});
