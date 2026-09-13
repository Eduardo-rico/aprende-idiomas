// tests/unit/nucleo-800-la.test.ts
//
// La selección del núcleo de 800 está hecha y congelada; lo que falta es la
// CANTIDAD. Este test fija las dos mitades para que nadie confunda «no está
// seleccionado» con «no se puede escribir».
import { describe, it, expect } from 'vitest';
import nucleo from '@/lib/data/languages/la/nucleo-800.json';
import { formasUnicasDeL1 } from '@/lib/data/languages/la/todas-las-formas';
import catalogo from '@/lib/data/languages/la/vocab-catalog.json';
import { FALLBACK_DICTIONARY } from '@/lib/data/languages/la/fallback-dictionary';

const N = nucleo as {
  cuantos: number; porcentajeDeTokensQueCubren: number;
  yaCubiertosPorLaMaquina: number; sinNingunaFormaProducida: number;
  loQueFalta: string;
  lemas: { lema: string; n: number; upos: string; cubierto: number; formas: string[] }[];
};

describe('la selección del núcleo de 800', () => {
  it('son 800 lemas por frecuencia y cubren cuatro quintos del corpus', () => {
    expect(N.lemas).toHaveLength(800);
    expect(N.cuantos).toBe(800);
    // El punto pide «seleccionados por frecuencia, no por lo que salga en
    // los textos». 81,6 % es lo que cubren.
    expect(N.porcentajeDeTokensQueCubren).toBeGreaterThan(75);
  });

  it('van ordenados por frecuencia, que es el criterio declarado', () => {
    for (let i = 1; i < N.lemas.length; i++)
      expect(N.lemas[i]!.n, `${N.lemas[i]!.lema} tras ${N.lemas[i - 1]!.lema}`).toBeLessThanOrEqual(N.lemas[i - 1]!.n);
  });

  it('y no llevan nombres propios, que no son vocabulario que enseñar', () => {
    // `Caesar` ×349 encabezaría la lista y no es una palabra que aprender.
    expect(N.lemas.some((l) => l.upos === 'PROPN')).toBe(false);
  });
});

describe('LO QUE FALTA NO ES SELECCIONAR', () => {
  it('el fichero dice que lo que falta es la cantidad, no la lista', () => {
    expect(N.loQueFalta).toContain('CANTIDAD');
    expect(N.loQueFalta).toContain('mácrones');
  });

  it('y el repositorio no tiene ninguna fuente de mácrones', () => {
    // Si algún día la hay, este test se pone rojo y el punto se desbloquea.
    // Es el control de que el bloqueo sigue siendo el que decimos, y no una
    // frase que envejece en un documento.
    expect(catalogo).toHaveLength(0);
    expect(Object.keys(FALLBACK_DICTIONARY)).toHaveLength(0);
  });

  it('«cubierto» significa que la MÁQUINA produce sus formas, no que el lema esté en una lista', () => {
    // Es lo que decide si un marco pasa el gate de vocabulario, que lee el
    // enumerador del dominio y no las listas de lemas.
    const formas = new Set(formasUnicasDeL1().map((f) => f.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i')));
    const rex = N.lemas.find((l) => l.lema === 'rex');
    if (rex) {
      expect(rex.cubierto).toBeGreaterThan(0.5);
      expect(rex.formas.some((f) => formas.has(f))).toBe(true);
    }
    const sinCubrir = N.lemas.filter((l) => l.cubierto === 0);
    expect(sinCubrir.length).toBe(N.sinNingunaFormaProducida);
    for (const l of sinCubrir.slice(0, 20))
      expect(l.formas.some((f) => formas.has(f)), l.lema).toBe(false);
  });
});
