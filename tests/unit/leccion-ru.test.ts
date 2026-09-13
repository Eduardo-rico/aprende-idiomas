// tests/unit/leccion-ru.test.ts
//
// EL TESTIGO ROJO DE `leccionParaPunto`, Y ESTÁ ESCRITO CON LAS LECCIONES
// REALES, no con un caso fabricado.
//
// El publicador elegía la lección de un ítem con UNA pasada sobre «el punto o
// cualquiera de sus prerrequisitos». Con un bloque de una sola lección eso no
// puede fallar; con dos, falla y no avisa. El segundo test de aquí EJECUTA la
// expresión vieja sobre b7 real y comprueba que devuelve la lección
// equivocada: es la evidencia negativa guardada en un campo y no en un
// comentario, y es lo que impide que alguien «simplifique» el helper de vuelta
// a una pasada.
//
// Y el control negativo de los dos es el contenido REAL: si los casos buenos no
// siguen resolviéndose por la vía `punto`, el arreglo rompió lo que funcionaba.
import { describe, it, expect } from 'vitest';
import { leccionParaPunto } from '@/scripts/lib/leccion-ru';
import { BLOCKS, ALL_CONCEPTS } from '@/lib/data/languages/ru/curriculum';

const bloque = (id: number) => {
  const b = BLOCKS.find((x) => x.id === id);
  if (!b) throw new Error(`el bloque ${id} no está declarado en curriculum.ts`);
  return b;
};
const punto = (id: string) => {
  const c = ALL_CONCEPTS.find((x) => x.id === id);
  if (!c) throw new Error(`el punto ${id} no está en el inventario`);
  return c;
};
const elegir = (b: number, p: string) => {
  const c = punto(p);
  const r = leccionParaPunto(bloque(b).lessons, p, c.prereqs);
  if (!r) throw new Error('sin lecciones');
  return r;
};

/** La expresión que el publicador tenía antes del 2026-09-13, tal cual. */
const unaPasada = (b: number, p: string) => {
  const padres = new Set<string>([p, ...punto(p).prereqs]);
  const ls = bloque(b).lessons;
  return (ls.find((l) => (l.conceptIds ?? []).some((k) => padres.has(k))) ?? ls[0])?.id;
};

describe('leccionParaPunto', () => {
  it('un punto va a la lección que lo DECLARA, aunque otra declare su prerrequisito', () => {
    // Los dos casos reales que destapó abrir b5 y b7 con dos lecciones.
    expect(elegir(7, 'u7-irregulares-frecuentes')).toEqual({ leccion: expect.objectContaining({ id: 'b7-l2-irregulares-y-condicional-by' }), via: 'punto' });
    expect(elegir(7, 'u7-condicional-by').leccion.id).toBe('b7-l2-irregulares-y-condicional-by');
    expect(elegir(5, 'u5-genitivo-negacion').leccion.id).toBe('b5-l2-genitivo-negacion-instrumental-predicativo');
    expect(elegir(5, 'u5-instrumental-predicativo').leccion.id).toBe('b5-l2-genitivo-negacion-instrumental-predicativo');
  });

  it('LA EVIDENCIA NEGATIVA: la expresión de UNA pasada devuelve la lección equivocada en esos mismos cuatro', () => {
    // Si algún día esto deja de ser cierto, el defecto ya no existe y este
    // test hay que borrarlo con su motivo escrito — no «arreglarlo».
    expect(unaPasada(7, 'u7-irregulares-frecuentes')).toBe('b7-l1-conjugacion-copula-pasado-futuro-sya-imperativo');
    expect(unaPasada(7, 'u7-condicional-by')).toBe('b7-l1-conjugacion-copula-pasado-futuro-sya-imperativo');
    expect(unaPasada(5, 'u5-genitivo-negacion')).toBe('b5-l1-plural-genitivo-animacidad-numerales');
    expect(unaPasada(5, 'u5-instrumental-predicativo')).toBe('b5-l1-plural-genitivo-animacidad-numerales');
  });

  it('CONTROL NEGATIVO: los casos que ya funcionaban siguen resolviéndose por la vía «punto»', () => {
    for (const [b, p, l] of [
      [4, 'u4-declinacion-singular', 'b4-l1-los-cuatro-casos-productivos'],
      [3, 'u3-plural-nominativo', 'b3-l1-genero-plural-sin-articulo'],
      [7, 'u7-conjugacion-i-ii', 'b7-l1-conjugacion-copula-pasado-futuro-sya-imperativo'],
      [5, 'u5-declinacion-plural', 'b5-l1-plural-genitivo-animacidad-numerales'],
    ] as [number, string, string][]) {
      const r = elegir(b, p);
      expect(r.via, `${p}`).toBe('punto');
      expect(r.leccion.id).toBe(l);
    }
  });

  it('TODO punto de un bloque declarado cae en una lección que lo declara', () => {
    // El invariante que hace innecesario acordarse: si alguien añade un punto a
    // un bloque con lecciones y no lo mete en ninguna, sale aquí y no al
    // publicar un lote.
    const huerfanos: string[] = [];
    for (const b of BLOCKS)
      for (const c of ALL_CONCEPTS.filter((x) => x.blockId === b.id)) {
        const r = leccionParaPunto(b.lessons, c.id, c.prereqs);
        if (!r || r.via !== 'punto') huerfanos.push(`${c.id} → ${r?.leccion.id ?? 'ninguna'} (${r?.via})`);
      }
    expect(huerfanos).toEqual([]);
  });

  it('las dos vías de respaldo existen y se distinguen', () => {
    const ls = [{ id: 'x-l1', conceptIds: ['a'] }, { id: 'x-l2', conceptIds: ['b'] }];
    expect(leccionParaPunto(ls, 'c', ['b'])).toEqual({ leccion: ls[1], via: 'prereq' });
    expect(leccionParaPunto(ls, 'c', ['z'])).toEqual({ leccion: ls[0], via: 'defecto' });
    expect(leccionParaPunto([], 'c', [])).toBeNull();
  });
});
