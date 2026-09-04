// tests/unit/composiciones.test.ts
//
// LA BÚSQUEDA DE ATAJOS COMPUESTOS, y su nula.
//
// Nace del lote 24 del rumano, que se publicó roto: medía dos rutas al
// 50 % y le faltaba la tercera, que era «la primera MÁS una marca que el
// alumno ya sabía». Acertaba 8 de 8 con los gates en verde.
import { describe, it, expect } from 'vitest';
import { buscarComposiciones, contrastarComposiciones, revisarComposiciones, revisarRevisionDePistas, resumenComposiciones,
         type Estrategia, type Pista } from '../../scripts/lib/composiciones';
import { respuestaPosicional, respuestaInvertida, type ItemClozeGlosa } from '../../scripts/lib/gate-cloze-glosa';
import { LOTE_FUNCION_POR_DESINENCIA as LOTE } from '../../lib/data/languages/la/lotes/l3-funcion-por-desinencia';

// Un lote de juguete: la respuesta es 'A' o 'B'. Dos estrategias que
// aciertan la mitad cada una, y una pista que dice cuál usar.
type T = { resp: 'A' | 'B'; visible: boolean; ruido: boolean };
const E: Estrategia<T>[] = [
  { nombre: 'di A', responde: () => 'A' },
  { nombre: 'di B', responde: () => 'B' },
];

describe('CONTROL POSITIVO: un atajo compuesto de verdad', () => {
  // 20 ítems donde la pista predice la respuesta PERFECTAMENTE.
  const conAtajo: T[] = Array.from({ length: 20 }, (_, i) => ({
    resp: i % 2 === 0 ? 'A' : 'B', visible: i % 2 === 0, ruido: i < 10,
  }));
  const P: Pista<T>[] = [
    { nombre: 'la visible', vale: (x) => x.visible },
    { nombre: 'ruido', vale: (x) => x.ruido },
  ];

  it('lo ENCUENTRA, aunque las dos estrategias sueltas estén al 50 %', () => {
    const cs = buscarComposiciones(conAtajo, (x) => x.resp, E, P);
    expect(cs.find((c) => c.regla === 'di A')!.tasa).toBe(0.5);
    expect(cs.find((c) => c.regla === 'di B')!.tasa).toBe(0.5);
    expect(cs[0]!.tasa).toBe(1);
    expect(cs[0]!.regla).toContain('la visible');
  });

  it('y su nula lo confirma como atajo REAL', () => {
    const v = contrastarComposiciones(conAtajo, (x) => x.resp, E, { pistas: P, revisadaPor: 'el test' }, 500);
    expect(v.hayAtajo).toBe(true);
    expect(v.p).toBeLessThan(0.05);
    expect(revisarComposiciones(v).map((x) => x.clase)).toContain('composicion-gana');
  });
});

describe('CONTROL NEGATIVO: el 50 % es un techo EQUIVOCADO para un máximo', () => {
  // AVISO SOBRE ESTE CONTROL, porque su primera versión falló y la razón
  // es la lección: construí a mano veinte ítems «sin atajo» y el
  // instrumento encontró uno REAL —una de las pistas coincidía con 7 de 7
  // respuestas—. Datos hechos a mano no son datos al azar, y el que los
  // hace no ve la correlación que mete. Así que el control negativo de
  // verdad es el lote real, más abajo, que está medido.
  const items: T[] = Array.from({ length: 20 }, (_, i) => ({
    resp: i % 2 === 0 ? 'A' : 'B', visible: i < 10, ruido: i % 3 === 0,
  }));
  const P: Pista<T>[] = [
    { nombre: 'p1', vale: (x) => x.visible },
    { nombre: 'p2', vale: (x) => x.ruido },
    { nombre: 'p3', vale: (x) => x.visible && x.ruido },
    { nombre: 'p4', vale: (x) => x.visible || x.ruido },
  ];

  it('la nula de un máximo sobre cuatro pistas está MUY por encima del 50 %', () => {
    // Ésta es la aserción que corrige el criterio: si el gate exigiera
    // ≤50 % a un máximo sobre k reglas, marcaría lotes impecables.
    const v = contrastarComposiciones(items, (x) => x.resp, E, { pistas: P, revisadaPor: 'el test' }, 1000);
    expect(v.nulaP95).toBeGreaterThan(0.6);
  });

  it('la nula es reproducible: dos corridas dan el mismo veredicto', () => {
    // Un veredicto que cambia entre corridas no lo puede usar nadie.
    const a = contrastarComposiciones(items, (x) => x.resp, E, { pistas: P, revisadaPor: 'el test' }, 300);
    const b = contrastarComposiciones(items, (x) => x.resp, E, { pistas: P, revisadaPor: 'el test' }, 300);
    expect(a.p).toBe(b.p);
    expect(a.nulaP95).toBe(b.nulaP95);
  });
});

describe('EL LOTE REAL, que es el control negativo que vale', () => {
  const j = (x: string[]) => x.join('|');
  const EST: Estrategia<ItemClozeGlosa>[] = [
    { nombre: 'traducir en orden', responde: (i) => j(respuestaPosicional(i)) },
    { nombre: 'invertir', responde: (i) => j(respuestaInvertida(i)) },
  ];
  const PIS: Pista<ItemClozeGlosa>[] = [
    { nombre: 'es plural', vale: (i) => i.ejes.numero === 'pl' },
    { nombre: 'el verbo va primero', vale: (i) => i.ejes.orden.startsWith('V') },
    { nombre: 'el verbo va último', vale: (i) => i.ejes.orden.endsWith('V') },
    { nombre: 'los nombres son femeninos', vale: (i) => i.palabras.some((p) => p.gen === 'f') },
    { nombre: 'la conjugación es 1ª', vale: (i) => i.ejes.conjugacion === 1 },
  ];

  it('la mejor composición pasa del 50 % y AUN ASÍ no es un atajo', () => {
    const v = contrastarComposiciones(LOTE, (i) => j(i.respuestas), EST, { pistas: PIS, revisadaPor: 'el autor del lote — PENDIENTE de revisión adversarial' }, 1000);
    // Las dos mitades del hallazgo, y por eso van juntas en un solo test:
    expect(v.mejor.tasa).toBeGreaterThan(0.5);   // el criterio viejo lo habría marcado
    expect(v.hayAtajo).toBe(false);              // y se habría equivocado
    expect(v.nulaP95).toBeGreaterThan(v.mejor.tasa);
    expect(revisarComposiciones(v)).toEqual([]);
  });
});

describe('EL LÍMITE DE LA HERRAMIENTA, que es su lado peligroso', () => {
  const items: T[] = Array.from({ length: 20 }, (_, i) => ({
    resp: i % 2 === 0 ? 'A' : 'B', visible: i < 10, ruido: i % 3 === 0,
  }));

  it('una lista SIN REVISAR se marca, porque su verde no significa lo que parece', () => {
    // El algoritmo es exhaustivo sobre la lista; la lista la escribe una
    // persona. En rumano la búsqueda dio 6/9 y con UNA pista que faltaba
    // subía a 8/9 — la vio el lingüista adversarial, no el autor. Y la
    // asimetría es lo que lo hace peligroso: si la lista SOBRA, alguien
    // discute el hallazgo; si FALTA, sale en verde.
    const v = contrastarComposiciones(items, (x) => x.resp, E,
      [{ nombre: 'una sola pista', vale: (x) => x.visible }], 300);
    expect(v.revisadaPor).toBe('sin revisar');
    expect(revisarRevisionDePistas(v).map((x) => x.clase)).toContain('pistas-sin-revisar');
    // Y `revisarComposiciones` NO la lleva: contesta «¿hay atajo?» y sólo
    // eso. Meter la segunda pregunta dentro le rompió dos tests a la otra
    // sesión, que esperaba de esa función lo que siempre dio.
    expect(revisarComposiciones(v).map((x) => x.clase)).not.toContain('pistas-sin-revisar');
  });

  it('y el informe imprime SIEMPRE la lista, no sólo el veredicto', () => {
    // Un «sin atajo» sobre cinco pistas y otro sobre veinte se leían
    // igual. Es la norma del denominador aplicada aquí.
    const v = contrastarComposiciones(items, (x) => x.resp, E,
      { pistas: [{ nombre: 'p1', vale: (x) => x.visible }, { nombre: 'p2', vale: (x) => x.ruido }], revisadaPor: 'el test' }, 300);
    const r = resumenComposiciones(v);
    expect(r).toContain('sobre 2 pistas');
    expect(r).toContain('revisadas por: el test');
    expect(r).toContain('· p1');
    expect(r).toContain('· p2');
  });
});
