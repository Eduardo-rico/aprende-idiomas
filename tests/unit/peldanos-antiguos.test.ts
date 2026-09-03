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
import fs from 'node:fs';
import path from 'node:path';
import { PELDANOS, IDS_PELDANO, revisarPeldanos, revisarCohesion, nucleosCoordinados, type Peldano } from '@/scripts/lib/peldanos-antiguos';
import { NIVELES_DE } from '@/scripts/paso0-idioma';

const ids = (h: { peldano: string }[]) => [...new Set(h.map((x) => x.peldano))].sort();

// Los cuatro peldaños que el gate cazó el 2026-09-03 —L5, G5, G4, G2— ya
// están arreglados, así que el gate tiene que dar CERO. Y ahí empieza su
// valor de verdad, que no está en los cuatro de aquel día sino en el
// peldaño once. Los casos históricos se conservan abajo como fixtures,
// palabra por palabra, para que sigan probando que el gate ve.
const HISTORICOS: Peldano[] = [
  { id: 'L5(histórico)', sistemas: ['brevitas y variatio', 'metros líricos', 'morfología pre-clásica'],
    prosa: 'El idiolecto de autor y la lengua arcaica: brevitas y variatio; metros líricos; morfología pre-clásica',
    ejemplares: ['Tácito', 'Horacio', 'Plauto'] },
  { id: 'G5(histórico)', sistemas: ['la mezcla épica', 'el dorio de la lírica coral', 'el registro cómico'],
    prosa: 'Verso y dialecto: mezcla épica, dorio de la lírica coral, registro cómico y parodia',
    ejemplares: ['Homero', 'Píndaro', 'Aristófanes'] },
  { id: 'G4(histórico)', sistemas: ['la prosa ática densa', 'el trímetro yámbico del diálogo dramático'],
    prosa: 'Prosa densa y diálogo dramático: hipérbaton en prosa, elipsis, trímetro yámbico',
    ejemplares: ['Tucídides', 'Sófocles'] },
  { id: 'G2(histórico)', sistemas: ['el ASPECTO', 'la voz media', 'los verbos contractos'],
    prosa: 'El ASPECTO: los temas de presente / aoristo / perfecto. Voz media. Verbos contractos',
    ejemplares: ['Jenofonte'] },
];

describe('el gate caza los peldaños que empaquetan varios sistemas', () => {
  it('los CUATRO casos históricos siguen cazándose, palabra por palabra', () => {
    const guardado = PELDANOS.la;
    try {
      (PELDANOS as Record<string, Peldano[]>).la = HISTORICOS;
      expect(ids(revisarPeldanos('la'))).toEqual(['G2(histórico)', 'G4(histórico)', 'G5(histórico)', 'L5(histórico)']);
    } finally {
      (PELDANOS as Record<string, Peldano[]>).la = guardado;
    }
  });

  it('y hoy el gate está en CERO en las dos lenguas', () => {
    // «Después de arreglarlos tiene que quedar en cero y quedarse ahí»:
    // marcar 4 de 10 estaba justificado sólo mientras los hallazgos
    // fueran reales. Su valor empieza aquí.
    expect(revisarPeldanos('la')).toEqual([]);
    expect(revisarPeldanos('grc')).toEqual([]);
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
    const g2 = HISTORICOS.find((p) => p.id === 'G2(histórico)')!;
    expect(nucleosCoordinados(g2.prosa)).toBe(1);   // la prosa NO lo delata
    expect(g2.sistemas.length).toBeGreaterThan(1);  // el campo declarado SÍ
    const guardado = PELDANOS.la;
    try {
      (PELDANOS as Record<string, Peldano[]>).la = [g2];
      expect(revisarPeldanos('la').some((h) => h.clase === 'varios-sistemas')).toBe(true);
    } finally {
      (PELDANOS as Record<string, Peldano[]>).la = guardado;
    }
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

describe('cohesión interna: «no evaluable» es un estado, no una omisión', () => {
  it('G2a sale NO EVALUABLE, y no se puede confundir con «cohesiona»', () => {
    // Un ejemplar no discrepa consigo mismo. Es la misma asimetría que
    // tuvo G5 —«no pasó la prueba, es que nunca se le hizo»— y saltarse
    // la fila la reproduciría en silencio.
    const c = revisarCohesion('grc');
    const g2a = c.find((x) => x.peldano === 'G2a')!;
    expect(g2a.estado).toBe('no-evaluable');
    expect(g2a.ejemplares).toBe(1);
    expect(g2a.motivo).toMatch(/no discrepa consigo mismo/);
    // Y aparece en la lista: no se omite.
    expect(c.map((x) => x.peldano)).toContain('G2a');
  });

  it('los demás peldaños tienen ≥2 ejemplares y son evaluables', () => {
    for (const lengua of ['la', 'grc'] as const) {
      for (const c of revisarCohesion(lengua)) {
        if (c.peldano === 'G2a') continue;
        expect(c.estado, `${c.peldano} debería ser evaluable`).toBe('cohesiona');
        expect(c.ejemplares).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('un peldaño sin ejemplares también es NO EVALUABLE, no «cohesiona»', () => {
    const vacio: Peldano = { id: 'Z', sistemas: ['uno'], ejemplares: [], prosa: 'Algo: cosas' };
    const guardado = PELDANOS.la;
    try {
      (PELDANOS as Record<string, Peldano[]>).la = [vacio];
      expect(revisarCohesion('la')[0]!.estado).toBe('no-evaluable');
    } finally {
      (PELDANOS as Record<string, Peldano[]>).la = guardado;
    }
  });
});

describe('UNA sola fuente de verdad para los peldaños', () => {
  it('la tabla de PELDANOS y la tupla IDS_PELDANO dicen lo mismo', () => {
    for (const lengua of ['la', 'grc'] as const) {
      expect(PELDANOS[lengua].map((p) => p.id)).toEqual([...IDS_PELDANO[lengua]]);
    }
  });

  it('`NIVELES_DE` DERIVA de IDS_PELDANO, no lo copia', () => {
    // Si alguien vuelve a escribirlos a mano en `paso0-idioma.ts`, esto
    // falla. En una noche el dato se desincronizó tres veces entre tres
    // sitios: el arreglo no es reconciliarlos, es que sólo haya uno.
    expect([...NIVELES_DE.la]).toEqual([...IDS_PELDANO.la]);
    expect([...NIVELES_DE.grc]).toEqual([...IDS_PELDANO.grc]);
  });

  it('y el DOCUMENTO dice lo mismo que el código', () => {
    // El tercer sitio donde vivía el dato. El test lee las tablas de
    // §1.3 y §1.4 y exige que sus filas de peldaño coincidan con la
    // estructura. Un documento que contradice al código es peor que uno
    // que falta: se lee y se cree.
    const doc = fs.readFileSync(path.join(process.cwd(), 'docs/plans/2026-09-03-la-grc-paso0.md'), 'utf8');
    for (const lengua of ['la', 'grc'] as const) {
      for (const id of IDS_PELDANO[lengua]) {
        expect(doc, `el documento no declara el peldaño ${id}`).toContain(`| **${id}** |`);
      }
    }
    // Y los disueltos NO pueden reaparecer como peldaño VIVO. Aparecen en
    // la tabla histórica de la auditoría, y ahí llevan su marca —«L5
    // (disuelto)», «G2 (partido en G2a)»— para que la cita del hallazgo
    // no se lea como una declaración. La primera versión de este test
    // marcó esas filas y tenía razón en sospechar: la forma era la misma.
    for (const muerto of ['L5', 'G5', 'G2']) {
      expect(doc.includes(`| **${muerto}** |`), `${muerto} está disuelto y el documento lo declara como peldaño vivo`).toBe(false);
    }
  });
});
