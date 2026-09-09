// tests/unit/inventario-vs-lexico.test.ts
//
// El gate que pregunta si el lexicón puede satisfacer lo que el punto exige.
// Nace de haberlo descubierto CINCO VECES a mano, siempre al ir a escribir
// el lote y ya con la tarde empezada.
import { describe, it, expect } from 'vitest';
import { PUNTOS_LA } from '@/lib/data/languages/la/inventario-puntos';
import { buscarInsatisfechos, esReduplicado, EXIGENCIAS } from '@/scripts/lib/gate-inventario-vs-lexico';

describe('el detector de reduplicación', () => {
  it('caza los canónicos, incluido el que la primera versión no veía', () => {
    // `stetī` es `ste-tī`: con un grupo s+consonante la copiada es la
    // SEGUNDA. La versión anterior comparaba los dos primeros caracteres con
    // el tercero y decía que había un reduplicado cuando había dos, justo
    // después de que yo añadiera los dos. Un gate que cuenta mal el material
    // dice que falta lo que sobra.
    for (const p of ['stetī', 'cecidī', 'dedī', 'tetigī', 'cucurrī', 'cecinī', 'pepercī'])
      expect(esReduplicado(p), p).toBe(true);
  });

  it('y no confunde con reduplicación el alargamiento ni el -v- ni el -s-', () => {
    for (const p of ['amāvī', 'dūxī', 'vīdī', 'fuī', 'fēcī', 'cēpī', 'docuī', 'mīsī'])
      expect(esReduplicado(p), p).toBe(false);
    expect(esReduplicado(undefined)).toBe(false);
  });
});

describe('qué exige el inventario y qué tiene el lexicón', () => {
  it('los cinco casos que se descubrieron a mano ya están satisfechos', () => {
    const hay = Object.fromEntries(EXIGENCIAS.map((e) => [e.nombre, e.cuantosHay()]));
    expect(hay['verbos de conjugación mixta']).toBeGreaterThanOrEqual(2);
    expect(hay['verbos de perfecto reduplicado']).toBeGreaterThanOrEqual(2);
    expect(hay['compuestos de `sum`']).toBeGreaterThanOrEqual(2);
    expect(hay['nombres de 5.ª']).toBeGreaterThanOrEqual(2);
    expect(hay['nombres de 4.ª']).toBeGreaterThanOrEqual(2);
  });

  it('y los que siguen sin poder satisfacerse salen nombrados', () => {
    const r = buscarInsatisfechos(PUNTOS_LA as never);
    const ids = r.map((x) => x.punto);
    // `l4-adjetivo-3a` pide adjetivos de 3.ª y hay cero: la máquina no los
    // tiene y es el siguiente hueco de fondo.
    expect(ids).toContain('l4-adjetivo-3a');
    // `l11-nucleo-800` pide 800 lemas y hay 95.
    expect(ids).toContain('l11-nucleo-800');
    // `l2-cuarta` pide «los pocos femeninos» de 4.ª y sólo hay `manus`:
    // `domus` es irregular y hay que guardarlo entero.
    expect(ids).toContain('l2-cuarta');
  });

  it('el gate declara ser una heurística sobre prosa, y su silencio no prueba nada', () => {
    // Busca palabras de categoría en el texto del punto. No entiende el
    // punto, así que puede pasar por alto exigencias dichas de otra manera.
    // Se comprueba que al menos mira el texto entero y no sólo el nombre.
    const conVaria = PUNTOS_LA.filter((p) => p.varia?.includes('mixta'));
    expect(conVaria.length).toBeGreaterThan(0);
    const r = buscarInsatisfechos(conVaria as never);
    // Con dos mixtas en el lexicón, ninguno sale insatisfecho por eso.
    expect(r.filter((x) => x.exigencia.includes('mixta'))).toHaveLength(0);
  });
});
