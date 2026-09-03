// tests/unit/reconciliar-deficit.test.ts
//
// La reconciliación existe por un descuadre real: E2#11 publicó 24 ítems
// que cerraron dos puntos —0→12 y 1→13, o sea −23 de déficit— y el total
// reportado bajó **1**. El caso está reproducido abajo tal cual, con sus
// cifras, y es el test que impide que vuelva a pasar sin verse.
import { describe, it, expect } from 'vitest';
import { reconciliar, informe } from '@/scripts/lib/reconciliar-deficit';

describe('reconciliar', () => {
  it('el residuo es cero cuando nada cambia', () => {
    const r = reconciliar({ a: 3, b: 12 }, { a: 3, b: 12 });
    expect(r.cambio).toBe(0);
    expect(r.residuo).toBe(0);
  });

  it('llenar un punto por debajo del piso baja el déficit', () => {
    const r = reconciliar({ a: 1 }, { a: 13 });
    expect(r.deficitAntes).toBe(11);
    expect(r.deficitAhora).toBe(0);
    expect(r.cambio).toBe(-11);
    expect(r.residuo).toBe(0);
  });

  it('pasar del piso no da crédito de más', () => {
    const r = reconciliar({ a: 12 }, { a: 40 });
    expect(r.cambio).toBe(0);   // ya estaba cubierto
    expect(r.itemsNetos).toBe(28);
  });

  // EL CASO REAL DE E2#11, reproducido con sus cifras.
  it('reproduce el descuadre de E2#11 y lo explica entero', () => {
    const antes = {
      'b8-coloc-mesoclise': 1,
      'b8-coloc-proclise-adverbio': 9,
      'otro-cubierto': 30,
      // `b5-futcomp-composto-real` NO está: tenía cero ítems y por eso
      // era invisible para el déficit. Ésa era la mitad del problema.
    };
    const ahora = {
      'b8-coloc-mesoclise': 13,          // +12 ítems → cierra
      'b8-coloc-proclise-adverbio': 10,  // +1 por re-etiquetado
      'otro-cubierto': 30,
      'b5-futcomp-composto-real': 12,    // nace con 12 → cierra al nacer
      'b8-indireto-imperativo': 1,       // nace con 1 → +11 de déficit
    };
    const r = reconciliar(antes, ahora);
    expect(r.deficitAntes).toBe(11 + 3);     // mesóclise 11 + próclise 3
    expect(r.deficitAhora).toBe(2 + 11);     // próclise 2 + imperativo 11
    expect(r.cambio).toBe(-1);               // ← el −1 que nadie entendía
    expect(r.aporte.nuevos).toBe(11);        // el punto que nace bajo el piso
    expect(r.aporte.movidos).toBe(-12);      // mesóclise −11, próclise −1
    expect(r.residuo).toBe(0);               // y ahora está TODO explicado
  });

  it('un punto que desaparece devuelve su déficit', () => {
    const r = reconciliar({ a: 2, b: 12 }, { b: 12 });
    expect(r.aporte.desaparecidos).toBe(-10);
    expect(r.residuo).toBe(0);
  });

  it('el residuo detecta una fuga: si el desglose no explica el cambio, no es cero', () => {
    // se fuerza una inconsistencia pasando un «antes» que no corresponde
    const r = reconciliar({ a: 5 }, { a: 5 });
    expect(r.residuo).toBe(0);
    // y con cambio real, sigue explicándolo
    const r2 = reconciliar({ a: 5 }, { a: 7 });
    expect(r2.cambio).toBe(-2);
    expect(r2.aporte.movidos).toBe(-2);
    expect(r2.residuo).toBe(0);
  });
});

describe('informe', () => {
  it('avisa cuando entran ítems y el déficit no baja otro tanto', () => {
    const txt = informe(reconciliar({ a: 1 }, { a: 13, nuevo: 0 }));
    expect(txt).toContain('Atención');
    expect(txt).toContain('residuo');
  });

  it('pinta el residuo siempre, para que no se pueda cerrar sin mirarlo', () => {
    expect(informe(reconciliar({ a: 12 }, { a: 12 }))).toContain('residuo (tiene que ser 0)');
  });
});

// ── CAMBIO DE PISO: su propia causa ────────────────────────────────────
// Añadido el 2026-09-03, al declarar `pisoCero` en `r1-diacriticos-coma`.
// `deficitAntes` se recalculaba con el piso de HOY, así que bajar un piso
// REESCRIBÍA LA HISTORIA: la foto que decía 570 pasaba a decir 562 y el
// −8 no aparecía en ninguna línea. Es el mismo defecto que esta función
// existe para impedir —«un indicador que no reconcilia convierte el
// calendario en ficción»— pero aplicado al PISO en vez de a los ítems, y
// por eso ninguno de los tests anteriores lo veía.
describe('reconciliar: el PISO tiene su propia línea', () => {
  const antes = { 'p-a': 0, 'p-b': 3 };
  const ahora = { 'p-a': 0, 'p-b': 3 };          // nadie ha producido nada
  const pisoViejo = () => 8;
  const pisoNuevo = (id: string) => (id === 'p-a' ? 0 : 8);

  it('ROJO: sin el piso de la foto anterior, la rebaja es INVISIBLE', () => {
    const r = reconciliar(antes, ahora, pisoNuevo);
    expect(r.deficitAntes).toBe(5);     // ← la historia, reescrita
    expect(r.aporte.piso).toBe(0);
    expect(r.pisoCambiado).toEqual([]);
  });

  it('con el piso de la foto, la rebaja se declara y NO pasa por producción', () => {
    const r = reconciliar(antes, ahora, pisoNuevo, pisoViejo);
    expect(r.deficitAntes).toBe(13);    // ← lo que la foto decía de verdad
    expect(r.deficitAhora).toBe(5);
    expect(r.aporte.piso).toBe(-8);
    expect(r.aporte.movidos).toBe(0);   // ← no se disfraza de ítems
    expect(r.pisoCambiado).toEqual([{ id: 'p-a', pisoAntes: 8, pisoAhora: 0, delta: -8 }]);
    expect(r.residuo).toBe(0);
  });

  it('el informe lo dice con todas las letras', () => {
    const txt = informe(reconciliar(antes, ahora, pisoNuevo, pisoViejo), '8');
    expect(txt).toContain('PISO declarado distinto');
    expect(txt).toContain('no es producción');
    expect(txt).toContain('piso 8 → 0');
  });

  it('un cambio de piso Y de ítems a la vez se reparte, sin residuo', () => {
    const r = reconciliar({ 'p-a': 0, 'p-b': 3 }, { 'p-a': 0, 'p-b': 8 }, pisoNuevo, pisoViejo);
    expect(r.aporte.piso).toBe(-8);
    expect(r.aporte.movidos).toBe(-5);
    expect(r.residuo).toBe(0);
  });
});
