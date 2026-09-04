// tests/unit/lote-la-3ab.test.ts — el ablativo, y el punto donde 1/k no vale.
import { describe, it, expect } from 'vitest';
import { revisarLoteAbl, tasasCiegasAbl, coberturaAblativo, PREPOSICION,
         POR_TRANSFERENCIA, TECHO_CONTENIDO, SUELO_TRANSFERENCIA,
         type FuncionAbl } from '../../scripts/lib/gate-ablativo';
import { LOTE_ABLATIVO as LOTE } from '../../lib/data/languages/la/lotes/l3-ablativo';
import { revisarCantidad } from '../../lib/data/languages/la/cantidad';
import { separablePorPosicion } from '../../scripts/lib/atajos';
import { patronDe } from '../../scripts/lib/orden-publicado';

describe('EL EJE DE LA RESPUESTA NO ES EL EJE DEL PUNTO', () => {
  it('tres de las siete funciones comparten preposición en español', () => {
    // No es una casualidad de este lote: es el español. Y por eso «pon
    // siempre CON» tiene un SUELO de 3/7 bajo cualquier diseño con dos
    // ítems por función — treinta ítems harían falta para bajarlo al 20 %,
    // o sea veintidós de relleno.
    const con = (Object.keys(PREPOSICION) as FuncionAbl[]).filter((f) => PREPOSICION[f] === 'con');
    expect(con).toHaveLength(3);
    expect(SUELO_TRANSFERENCIA).toBeCloseTo(3 / 7, 6);
    expect(tasasCiegasAbl(LOTE).siempreCon).toBeCloseTo(3 / 7, 2);
  });

  it('y por eso el techo se aplica SÓLO donde las respuestas son uniformes', () => {
    // Bajar el techo global al 43 % y llamarlo techo sería ajustar el
    // termómetro a lo que mide.
    const t = tasasCiegasAbl(LOTE);
    expect(t.contenido).toBe(8);
    for (const [p, v] of Object.entries(t.enElContenido)) {
      expect(v, `siempre «${p}»`).toBeLessThanOrEqual(TECHO_CONTENIDO + 1e-9);
    }
  });

  it('las tres de «con» no son una exención: son la FRONTERA', () => {
    // El alumno las produce por transferencia y acierta sin saber latín.
    // Están para impedir el error simétrico —«nunca con»— que aplicaría a
    // tres de las siete funciones.
    const frontera = LOTE.filter((i) => POR_TRANSFERENCIA.includes(i.ejes.funcion));
    expect(frontera).toHaveLength(6);
    for (const i of frontera) expect(i.respuesta).toBe('con');
  });
});

describe('el lote del ablativo', () => {
  it('pasa el gate entero', () => expect(revisarLoteAbl(LOTE)).toEqual([]));

  it('catorce, y el número sale de una cuenta', () => {
    // 2k con k = 7. Con ocho, cada función saldría UNA vez y toda
    // propiedad del ítem quedaría confundida con su función: el punto no
    // sería examinable por construcción.
    expect(LOTE).toHaveLength(14);
    for (const f of Object.keys(PREPOSICION) as FuncionAbl[]) {
      expect(LOTE.filter((i) => i.ejes.funcion === f).length, f).toBe(2);
    }
  });

  it('CAZA la función que sale una sola vez', () => {
    const sinPareja = LOTE.filter((i) => i.id !== 'la-3ab-14');
    expect(revisarLoteAbl(sinPareja).map((x) => x.clase)).toContain('funcion-sin-pareja');
  });

  it('CAZA la función que falta', () => {
    const sinComparacion = LOTE.filter((i) => i.ejes.funcion !== 'comparación');
    expect(revisarLoteAbl(sinComparacion).map((x) => x.clase)).toContain('falta-una-funcion');
  });

  it('CAZA la respuesta que no cuadra con su función', () => {
    const malo = LOTE.map((i) => (i.ejes.funcion === 'causa' ? { ...i, respuesta: 'con' } : i));
    expect(revisarLoteAbl(malo).map((x) => x.clase)).toContain('respuesta-no-cuadra');
  });

  it('el orden publicado no predice si se traduce con «con»', () => {
    expect(separablePorPosicion(patronDe(LOTE, (i) => POR_TRANSFERENCIA.includes(i.ejes.funcion)))).toBeNull();
  });

  it('el latín pasa la cantidad, preposiciones y comparativos incluidos', () => {
    for (const i of LOTE) expect(revisarCantidad(i.latin), i.id).toEqual([]);
    // `cum` y `ex` no tienen paradigma y hacen falta desde el primer
    // ablativo; los comparativos van declarados porque el grado es otro
    // punto y su declinación no está en la máquina.
    expect(revisarCantidad('cum ex fortior sanctior')).toEqual([]);
  });

  it('cada comprobación dice sobre cuántos ítems decidió', () => {
    for (const c of coberturaAblativo(LOTE)) {
      expect(c.decididos, c.comprobacion).toBeGreaterThan(0);
      if (c.decididos < c.total) expect(c.motivoDeLosQueQuedanFuera, c.comprobacion).toBeTruthy();
    }
  });
});
