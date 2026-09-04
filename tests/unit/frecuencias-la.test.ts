// tests/unit/frecuencias-la.test.ts
//
// LAS FRECUENCIAS, CON SU AMBIGÜEDAD DECLARADA.
//
// Nace de un aviso del rumano —«las comprobaciones de corpus salieron
// verdes por homografía»— y del caso encontrado el mismo día en este
// proyecto: conté `liber` 124 y son dos palabras.
import { describe, it, expect } from 'vitest';
import frec from '../../lib/data/languages/la/frecuencias-la.json';

const L = frec.lemas as Record<string, { total: number; porCategoria: Record<string, number>; ambiguo?: string; formas?: Record<string, number> }>;

describe('el caso que motivó la herramienta', () => {
  it('`liber` NO devuelve un número: devuelve su reparto', () => {
    // 82 NOUN (liber, «libro») + 42 ADJ (līber, «libre»), y sin mácrons en
    // el corpus nada los separa. Un número plausible es peor que ninguno.
    expect(L.liber!.ambiguo).toBeTruthy();
    expect(L.liber!.porCategoria.NOUN).toBe(82);
    expect(L.liber!.porCategoria.ADJ).toBe(42);
    expect(L.liber!.formas).toBeTruthy();
  });

  it('y ni siquiera la categoría bastaría: el reparto por FORMA lo enseña', () => {
    // `NOUN liber` (9) es el nominativo de «libro», cuyos oblicuos hacen
    // `libr-`; `ADJ liberi` es «līberī», que como sustantivo es «los
    // hijos». Tres palabras, una grafía, ninguna columna las separa sola.
    const f = L.liber!.formas!;
    expect(Object.keys(f)).toContain('NOUN liber');
    expect(Object.keys(f)).toContain('NOUN libro');
  });
});

describe('el flag no marca de más, que es como se apaga un gate', () => {
  it('NO marca la variación de anotación', () => {
    // `et` lo marcaba UN token etiquetado ADJ entre 11.407. Un valor
    // atípico no puede voltear un veredicto: la clase minoritaria tiene
    // que llegar al 5 % y a 3 tokens.
    expect(L.et?.ambiguo).toBeFalsy();
    expect(L.magnus?.ambiguo).toBeFalsy();
    expect(L.omnis?.ambiguo).toBeFalsy();
  });

  it('SÍ marca los homógrafos de verdad', () => {
    // `eō` «voy» contra `eō` «por eso»; `mundus` «mundo» contra «limpio».
    expect(L.eo?.ambiguo).toBeTruthy();
    expect(L.mundus?.ambiguo).toBeTruthy();
  });

  it('y la proporción marcada es legible, no una alarma de fondo', () => {
    const total = Object.keys(L).length;
    const amb = Object.values(L).filter((v) => v.ambiguo).length;
    expect(amb / total).toBeLessThan(0.10);
    expect(amb).toBeGreaterThan(10);   // ni tan pocos que no mida nada
  });
});

describe('lo que se puede citar', () => {
  it('sólo lemas con base suficiente para afirmar algo', () => {
    expect(frec.minimo).toBe(20);
    for (const v of Object.values(L)) expect(v.total).toBeGreaterThanOrEqual(20);
  });

  it('los lemas de los falsos regalos del nivel están y no son ambiguos', () => {
    // Los que el punto `l11-falsos-regalos` nombra y que sí se pueden citar
    // con un número. `liber` queda fuera a propósito: va con su reparto.
    for (const l of ['hostis', 'uirtus', 'familia', 'debeo', 'probo', 'parens', 'fides', 'gratia']) {
      expect(L[l], l).toBeTruthy();
      expect(L[l]!.ambiguo, `${l} es ambiguo y su frecuencia no se puede citar de un número`).toBeFalsy();
    }
  });

  it('el corpus tiene un artefacto que conviene conocer', () => {
    // 452 tokens con el lema «greek.expression»: pasajes griegos dentro de
    // los textos latinos. No es una palabra y no debe entrar en ninguna
    // cuenta de léxico.
    expect(L['greek.expression']).toBeTruthy();
    expect(L['greek.expression']!.ambiguo).toBeTruthy();
  });
});
