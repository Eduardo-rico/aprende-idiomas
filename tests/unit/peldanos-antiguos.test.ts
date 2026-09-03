// tests/unit/peldanos-antiguos.test.ts
//
// El gate de «una caja, un sistema» para los peldaños del latín y del
// griego, con los casos que DEBE cazar y los que NO debe tocar.
//
// Nace de que L5 se declaró como «el idiolecto de autor y la lengua
// arcaica: brevitas y variatio; metros líricos; morfología pre-clásica»
// y resultó no ser un peldaño sino tres dificultades en una caja: sus
// tres representantes miden 72,4 · 64,1 · 51,3, veintiún puntos de
// abanico. La definición lo decía en voz alta desde el primer día y
// nadie se lo preguntó.
//
// Y la razón por la que hace falta un gate y no basta con haberlo visto
// una vez: los 5 de 7 saltos «confirmados» de §1.6 confirmaron el ORDEN
// de la escalera, **no que cada caja contuviera una sola cosa**. Son dos
// preguntas y la segunda no se había hecho nunca.
import { describe, it, expect } from 'vitest';
import { PELDANOS, revisarPeldanos, nucleosCoordinados, type Peldano } from '@/scripts/lib/peldanos-antiguos';

const ids = (h: { peldano: string }[]) => [...new Set(h.map((x) => x.peldano))].sort();

describe('el gate caza los peldaños que empaquetan varios sistemas', () => {
  it('LATÍN: caza L5 y sólo L5', () => {
    const h = revisarPeldanos('la');
    expect(ids(h)).toEqual(['L5']);
    expect(h[0]!.clase).toBe('varios-sistemas');
    expect(h[0]!.detalle).toContain('3 sistemas');
  });

  it('GRIEGO: caza G2, G4 y G5', () => {
    // G5 es el hermano de L5 y se esperaba. Los otros dos salieron de la
    // auditoría y son hallazgos:
    //  · G4 «prosa densa Y diálogo dramático» — la prosa de Tucídides y
    //    el trímetro trágico no se necesitan el uno al otro.
    //  · G2 tiene la MISMA enfermedad en OTRA FORMA: no coordina dos
    //    núcleos antes de los dos puntos, sino que cuelga dos sistemas
    //    más detrás, en frases sueltas («… Voz media. Verbos
    //    contractos»). La voz media no es parte del aspecto.
    expect(ids(revisarPeldanos('grc'))).toEqual(['G2', 'G4', 'G5']);
  });

  it('NO toca los peldaños que enumeran PIEZAS de un solo sistema', () => {
    // Todos enumeran cosas —«las cinco declinaciones y las cuatro
    // conjugaciones»— y eso NO es el defecto. Un gate que marcara aquí
    // marcaría los diez y se apagaría solo.
    const marcados = new Set(revisarPeldanos('la').map((h) => h.peldano));
    for (const id of ['L1', 'L2', 'L3', 'L4']) expect(marcados.has(id), `${id} no debería estar marcado`).toBe(false);
    const marcadosG = new Set(revisarPeldanos('grc').map((h) => h.peldano));
    for (const id of ['G1', 'G3']) expect(marcadosG.has(id), `${id} no debería estar marcado`).toBe(false);
  });
});

describe('el segundo camino: la prosa, que no mira el mismo campo', () => {
  it('cuenta los núcleos coordinados antes de los dos puntos', () => {
    expect(nucleosCoordinados('El período: cum histórico, oratio obliqua sostenida')).toBe(1);
    expect(nucleosCoordinados('Orden poético: hipérbaton, léxico poético')).toBe(1);
    expect(nucleosCoordinados('El idiolecto de autor y la lengua arcaica: brevitas')).toBe(2);
    expect(nucleosCoordinados('Verso y dialecto: mezcla épica, dorio')).toBe(2);
    expect(nucleosCoordinados('Prosa densa y diálogo dramático: hipérbaton en prosa')).toBe(2);
  });

  it('NO se cuenta la «y» que va DENTRO de una enumeración tras los dos puntos', () => {
    // «hexámetro y dístico» está después del núcleo: son dos piezas de
    // un sistema, no dos sistemas.
    expect(nucleosCoordinados('Orden poético: hipérbaton, léxico poético, hexámetro y dístico')).toBe(1);
  });

  it('avisa cuando la prosa delata más sistemas de los que el campo declara', () => {
    const falso: Peldano = {
      id: 'X', sistemas: ['uno solo'], ejemplares: ['A'],
      prosa: 'La métrica y el dialecto: hexámetro, dorio',
    };
    const guardado = PELDANOS.la;
    try {
      (PELDANOS as Record<string, Peldano[]>).la = [falso];
      const h = revisarPeldanos('la');
      expect(h).toHaveLength(1);
      expect(h[0]!.clase).toBe('prosa-delata-mas');
    } finally {
      (PELDANOS as Record<string, Peldano[]>).la = guardado;
    }
  });

  it('una exención sin motivo escrito es un hallazgo', () => {
    const flojo: Peldano = {
      id: 'Y', sistemas: ['a', 'b'], ejemplares: ['A'], prosa: 'Algo: cosas', exencion: 'porque sí',
    };
    const guardado = PELDANOS.la;
    try {
      (PELDANOS as Record<string, Peldano[]>).la = [flojo];
      expect(revisarPeldanos('la').map((h) => h.clase)).toContain('exencion-sin-motivo');
    } finally {
      (PELDANOS as Record<string, Peldano[]>).la = guardado;
    }
  });
});

describe('lo que el gate NO puede ver, dicho en vez de fingido', () => {
  it('la heurística de prosa es CIEGA a la forma de G2', () => {
    // G2 cuelga los sistemas de más DETRÁS del núcleo, en frases
    // sueltas, y ahí no hay núcleos coordinados que contar. Para esa
    // forma manda el campo declarado, no el texto — y por eso el gate es
    // un invariante y la prosa sólo un aviso.
    const g2 = PELDANOS.grc.find((p) => p.id === 'G2')!;
    expect(nucleosCoordinados(g2.prosa)).toBe(1);
    expect(g2.sistemas.length).toBeGreaterThan(1);
    // Lo caza igualmente, pero por el campo declarado.
    expect(revisarPeldanos('grc').some((h) => h.peldano === 'G2' && h.clase === 'varios-sistemas')).toBe(true);
  });

  it('cada peldaño declara ejemplares, y con UNO no se afirma orden', () => {
    // Cuatro «ramas» de un elemento no son cuatro escaleras: son la misma
    // afirmación no falsable en cuatro copias. Una especialización sólo
    // asciende a peldaño con DOS miembros ordenables en su propio eje.
    for (const lengua of ['la', 'grc'] as const) {
      for (const p of PELDANOS[lengua]) expect(p.ejemplares.length, `${p.id} sin ejemplares`).toBeGreaterThan(0);
    }
  });
});
