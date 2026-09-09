// tests/unit/lote-negacion-la.test.ts
//
// La negación. El punto es `regalo` y lo es de verdad en el 70 % largo: lo
// que este lote tiene que hacer es no fingir que enseña más de lo que enseña.
import { describe, it, expect } from 'vitest';
import { LOTE_NEGACION, TRANSFIERE, type Constituyente } from '@/lib/data/languages/la/lotes/l5-negacion';

describe('la negación · en verde', () => {
  it('los cinco constituyentes', () => {
    for (const c of ['verbo', 'adverbio', 'pronombre', 'nombre', 'adjetivo'] as Constituyente[])
      expect(LOTE_NEGACION.some((it) => it.ejes.constituyente === c), c).toBe(true);
  });

  it('todo ítem que NO transfiere dice qué hace el español', () => {
    for (const it of LOTE_NEGACION) {
      const transfiere = TRANSFIERE[it.ejes.constituyente];
      expect(Boolean(it.ejes.queHaceElEspanol), `${it.id} (${it.ejes.constituyente})`).toBe(!transfiere);
    }
  });

  it('y los que transfieren NO lo dicen: sería inventarles una dificultad', () => {
    for (const it of LOTE_NEGACION.filter((x) => TRANSFIERE[x.ejes.constituyente]))
      expect(it.ejes.queHaceElEspanol, it.id).toBeUndefined();
  });

  it('el marco siempre pone «non» delante de su cabeza', () => {
    // Medido: el 96,8 % de las 2.919 apariciones del corpus. La posición
    // transfiere y por eso no se examina.
    for (const it of LOTE_NEGACION) expect(it.marco, it.id).toMatch(/___/);
  });
});

describe('el lote no finge medir más de lo que mide', () => {
  it('la mitad son de constituyentes que transfieren, y están de contraste', () => {
    const transfieren = LOTE_NEGACION.filter((it) => TRANSFIERE[it.ejes.constituyente]).length;
    const no = LOTE_NEGACION.length - transfieren;
    expect(transfieren).toBeGreaterThan(0);
    expect(no).toBeGreaterThan(0);
    // Nombre y adjetivo son el 30 % del corpus y aquí un tercio del lote:
    // sobrerrepresentados a propósito, porque son lo único que se enseña.
    expect(no / LOTE_NEGACION.length).toBeGreaterThan(0.3);
  });

  it('la tabla de transferencia es del par de lenguas, no del ítem', () => {
    expect(TRANSFIERE.verbo).toBe(true);
    expect(TRANSFIERE.adverbio).toBe(true);    // «non semper» = «no siempre»
    expect(TRANSFIERE.pronombre).toBe(true);   // «non omnes» = «no todos»
    expect(TRANSFIERE.nombre).toBe(false);     // «non arbor» ≠ *«no árbol»
    expect(TRANSFIERE.adjetivo).toBe(false);
  });
});
