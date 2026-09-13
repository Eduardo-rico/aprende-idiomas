// tests/unit/nucleo-800-la.test.ts
//
// La selección del núcleo de 800 está hecha y congelada; lo que falta es la
// CANTIDAD. Este test fija las dos mitades para que nadie confunda «no está
// seleccionado» con «no se puede escribir».
import { describe, it, expect } from 'vitest';
import nucleo from '@/lib/data/languages/la/nucleo-800.json';
import { formasUnicasDeL1 } from '@/lib/data/languages/la/todas-las-formas';
import catalogo from '@/lib/data/languages/la/vocab-catalog.json';
import macrones from '@/lib/data/languages/la/macrones.json';
import { FALLBACK_DICTIONARY } from '@/lib/data/languages/la/fallback-dictionary';

const M = macrones as {
  procedencia: { obra: string };
  porOrigen: Record<string, number>;
  filas: { clave: string; cantidad: string | null; origen: string }[];
};

const N = nucleo as {
  cuantos: number; porcentajeDeTokensQueCubren: number;
  yaCubiertosPorLaMaquina: number; sinNingunaFormaProducida: number;
  loQueFalta: string; historia?: string;
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

describe('EL BLOQUEO, QUE ERA LA CANTIDAD Y YA NO LO ES', () => {
  // Este bloque comprobaba lo contrario hasta el 2026-09-13: que NO había
  // fuente de mácrones, para que el bloqueo no fuera una frase que envejece
  // en un documento. Ahora la hay, y comprueba que se usa como es debido.

  it('el fichero YA NO dice que falte la cantidad, porque sería falso', () => {
    // Una afirmación que fue verdad y dejó de serlo es la misma clase que
    // el filtro que caduca (§5.quaterdecies): el fichero dice ahora que lo
    // que falta es el PARADIGMA, y guarda la historia aparte.
    expect(N.loQueFalta).toContain('PARADIGMA');
    expect(N.loQueFalta).not.toContain('no tiene fuente');
    expect(N.historia ?? '').toContain('hasta el 2026-09-12');
  });

  it('hay fuente, y el registro dice de dónde sale cada cantidad', () => {
    expect(M.procedencia.obra).toContain('Wiktionary');
    expect(M.porOrigen['fuente-externa']).toBeGreaterThan(400);
  });

  it('la cobertura de la fuente está medida, no supuesta', () => {
    // 471 de los 554 a cero. El listón que se puso antes de medir era que
    // una fuente al 60 % deja el problema igual de abierto.
    const deLaFuente = M.porOrigen['fuente-externa']!;
    expect(deLaFuente / (deLaFuente + M.porOrigen['sin-dato']!)).toBeGreaterThan(0.8);
  });

  it('y los que la fuente no cubre siguen SIN DATO, no rellenados', () => {
    expect(M.porOrigen['sin-dato']).toBeGreaterThan(0);
    for (const f of M.filas.filter((x) => x.origen === 'sin-dato')) expect(f.cantidad, f.clave).toBeNull();
  });

  it('los dos andamios vacíos siguen vacíos: la fuente NO es un diccionario del repo', () => {
    // La cantidad vive en `macrones.json` con su procedencia, no en un
    // catálogo sin origen. Si alguien rellena éstos, hay que preguntarle
    // de dónde salieron.
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
