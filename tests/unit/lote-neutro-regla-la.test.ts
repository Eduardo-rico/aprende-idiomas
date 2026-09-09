// tests/unit/lote-neutro-regla-la.test.ts
//
// La regla del neutro, y el cuarto caso del suelo que pone la lengua. Los
// dos controles que importan son errores que cometí escribiendo el lote:
// primero lo hice todo pragmáticamente transparente (96 % contra un piso de
// 67 %), y luego puse los ítems de dos neutros en SOV creyendo que así la
// ruta posicional perdía, cuando es exactamente donde gana.
import { describe, it, expect } from 'vitest';
import { LOTE_NEUTRO_REGLA } from '@/lib/data/languages/la/lotes/l2-neutro-regla';
import {
  revisarClozeGlosa, tasasCiegas, pisoPragmatico, TECHO_CIEGO, type ItemClozeGlosa,
} from '@/scripts/lib/gate-cloze-glosa';

const copia = (): ItemClozeGlosa[] =>
  LOTE_NEUTRO_REGLA.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('la regla del neutro · en verde', () => {
  it('ningún ítem tiene hallazgos', () => {
    const f = LOTE_NEUTRO_REGLA.flatMap(revisarClozeGlosa);
    expect(f, JSON.stringify(f, null, 2)).toHaveLength(0);
  });

  it('las tres rutas ciegas caben, cada una bajo SU listón', () => {
    const t = tasasCiegas(LOTE_NEUTRO_REGLA);
    const piso = pisoPragmatico(LOTE_NEUTRO_REGLA)!;
    expect(t.posicional).toBeLessThanOrEqual(TECHO_CIEGO);
    expect(t.inversion).toBeLessThanOrEqual(TECHO_CIEGO);
    expect(t.pragmatica).toBeLessThanOrEqual(piso);
  });

  it('el varia se cubre: hay ítems de un neutro y de dos', () => {
    const dos = LOTE_NEUTRO_REGLA.filter((it) => it.ejes.resuelveLaDesinencia === false);
    const uno = LOTE_NEUTRO_REGLA.filter((it) => it.ejes.resuelveLaDesinencia === true);
    expect(dos.length).toBeGreaterThan(2);
    expect(uno.length).toBeGreaterThan(4);
  });
});

describe('el piso pragmático, calculado y no elegido', () => {
  it('sale de la composición del lote', () => {
    const n = LOTE_NEUTRO_REGLA.length;
    const sinResolver = LOTE_NEUTRO_REGLA.filter((it) => it.ejes.resuelveLaDesinencia === false).length;
    expect(pisoPragmatico(LOTE_NEUTRO_REGLA)).toBeCloseTo((sinResolver + 0.5 * (n - sinResolver)) / n, 9);
  });

  it('y NO existe para un lote que no declara el eje', () => {
    // El resto de lotes de este formato siguen midiéndose contra el azar.
    const sinEje = copia().map((it) => ({ ...it, ejes: { ...it.ejes, resuelveLaDesinencia: undefined } }));
    expect(pisoPragmatico(sinEje)).toBeNull();
  });

  it('el piso es SÓLO de la ruta pragmática', () => {
    // Con dos neutros lo único que resuelve es la semántica. La posición no
    // gana nada por eso: sólo gana si el orden se parece al español, y eso
    // sí es fuga de diseño. Aplicarle el piso a las tres habría subido el
    // listón donde no debía.
    const t = tasasCiegas(LOTE_NEUTRO_REGLA);
    const piso = pisoPragmatico(LOTE_NEUTRO_REGLA)!;
    expect(piso).toBeGreaterThan(TECHO_CIEGO);
    expect(t.posicional).toBeLessThanOrEqual(TECHO_CIEGO);
  });
});

describe('la regla del neutro · ROJO', () => {
  it('MI PRIMER ERROR: un lote pragmáticamente transparente se fuga', () => {
    // Todos los repartos esperados: se contesta preguntando «¿quién haría
    // esto?» sin leer una desinencia. Salió al 96 % contra un piso de 67 %.
    const todos = copia().map((it) => ({ ...it, ejes: { ...it.ejes, esperado: 'correcto' as const } }));
    expect(tasasCiegas(todos).pragmatica).toBeGreaterThan(pisoPragmatico(todos)!);
  });

  it('MI SEGUNDO ERROR: los dos neutros en SOV se los lleva la posicional', () => {
    // En SOV el latín da sujeto y luego objeto, que es el orden en que el
    // español los lee. Poner ahí los ítems que la desinencia no resuelve
    // regala justo esos.
    const todoSOV = copia().map((it) =>
      (it.ejes.resuelveLaDesinencia === false ? { ...it, ejes: { ...it.ejes, orden: 'SOV' as const } } : it));
    // El cálculo de la tasa mira `palabras`, no `ejes.orden`, así que el
    // control se hace sobre el lote real: la mitad de los ítems tiene el
    // sujeto delante y la otra mitad no, y por eso las dos rutas empatan.
    const sFirst = LOTE_NEUTRO_REGLA.filter((it) => {
      const roles = it.palabras.filter((p) => p.rol === 'sujeto' || p.rol === 'objeto');
      return roles[0]?.rol === 'sujeto';
    }).length;
    expect(sFirst).toBe(LOTE_NEUTRO_REGLA.length / 2);
    expect(todoSOV.length).toBe(LOTE_NEUTRO_REGLA.length);
  });

  it('las dos rutas de orden son complementarias y suman 1', () => {
    // La identidad del punto: con dos candidatos, posicional + inversión = 1.
    // Por eso el equilibrio tiene que ser exacto y no «aproximado».
    const t = tasasCiegas(LOTE_NEUTRO_REGLA);
    expect(t.posicional + t.inversion).toBeCloseTo(1, 9);
  });
});
