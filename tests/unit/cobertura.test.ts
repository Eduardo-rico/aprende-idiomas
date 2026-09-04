// tests/unit/cobertura.test.ts
//
// LA NORMA: un gate dice sobre cuántos casos decidió, no sólo su veredicto.
//
// Nace de la forma más silenciosa que hemos encontrado: `revisarCoherenciaLexico`
// pasó de contrastar 34 lemas a 22 al crecer el dominio, **sin dejar de
// estar en verde**. Crece el material, crece la confianza aparente, y la
// cobertura real baja.
import { describe, it, expect } from 'vitest';
import { revisarCobertura, resumenCobertura, type Cobertura } from '../../scripts/lib/cobertura';
import { coberturaGlosa, revisarLote } from '../../scripts/lib/gate-cloze-glosa';
import { coberturaDerivado, revisarLoteD } from '../../scripts/lib/gate-cloze-derivado';
import { coberturaConcordancia, revisarLoteC } from '../../scripts/lib/gate-concordancia';
import { LOTE_FUNCION_POR_DESINENCIA } from '../../lib/data/languages/la/lotes/l3-funcion-por-desinencia';
import { LOTE_SEGUNDA } from '../../lib/data/languages/la/lotes/l2-segunda';
import { LOTE_CONCORDANCIA } from '../../lib/data/languages/la/lotes/l4-concordancia';

describe('la comprobación que no ha mirado nada', () => {
  it('CAZA la cobertura cero: no ha aprobado, ha callado', () => {
    const h = revisarCobertura([{ comprobacion: 'algo', decididos: 0, total: 10 }]);
    expect(h.map((x) => x.clase)).toContain('cobertura-cero');
  });

  it('CAZA la cobertura parcial sin motivo escrito', () => {
    // Un salto sin razón es el mismo agujero que la cuarentena sin motivo.
    const h = revisarCobertura([{ comprobacion: 'algo', decididos: 3, total: 10 }]);
    expect(h.map((x) => x.clase)).toContain('cobertura-sin-motivo');
  });

  it('APRUEBA la parcial que dice por qué', () => {
    expect(revisarCobertura([{ comprobacion: 'algo', decididos: 3, total: 10,
      motivoDeLosQueQuedanFuera: 'los otros siete no tienen el rasgo' }])).toEqual([]);
  });

  it('el resumen se puede pegar en un commit', () => {
    const r = resumenCobertura([{ comprobacion: 'una cosa', decididos: 8, total: 12 } as Cobertura]);
    expect(r).toContain('8');
    expect(r).toContain('12');
  });
});

describe('los tres gates declaran su denominador, y ninguno decide sobre cero', () => {
  const casos = [
    ['cloze en la glosa', coberturaGlosa(LOTE_FUNCION_POR_DESINENCIA), revisarLote(LOTE_FUNCION_POR_DESINENCIA)],
    ['cloze derivado', coberturaDerivado(LOTE_SEGUNDA), revisarLoteD(LOTE_SEGUNDA)],
    ['concordancia', coberturaConcordancia(LOTE_CONCORDANCIA), revisarLoteC(LOTE_CONCORDANCIA)],
  ] as const;

  for (const [nombre, cob, hallazgos] of casos) {
    it(`${nombre}: cada comprobación decide sobre ≥1 ítem y explica los que quedan fuera`, () => {
      expect(cob.length).toBeGreaterThan(0);
      for (const c of cob) {
        expect(c.decididos, `${nombre} · ${c.comprobacion}`).toBeGreaterThan(0);
        if (c.decididos < c.total) expect(c.motivoDeLosQueQuedanFuera, `${nombre} · ${c.comprobacion}`).toBeTruthy();
      }
      expect(hallazgos).toEqual([]);
    });
  }

  it('y el denominador flaco se VE, que es de lo que se trata', () => {
    // «el vocativo en -e» decide sobre 2 de 12 en el lote derivado: la
    // excepción de los -ius descansa sobre dos ítems. No es un fallo —hay
    // el mínimo exigido y su contraste— pero antes era invisible, y ése es
    // justo el número que se encoge sin que nadie lo note al crecer el lote.
    const voc = coberturaDerivado(LOTE_SEGUNDA).find((c) => c.comprobacion.includes('vocativo'))!;
    expect(voc.decididos).toBe(2);
    expect(voc.total).toBe(12);
  });
});
