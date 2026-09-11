// tests/unit/gate-funcion-caso-determinante.test.ts
//
// DOS AÑADIDOS AL GATE DE FUNCIÓN, los dos del 2026-09-11, y los dos
// nacidos de un ataque adversarial sobre material YA ESCRITO.
//
// 1 · EL DETERMINANTE. El latín no tiene artículo —lo enseña el primer
//     objetivo del bloque 2— así que «rosam» es «la rosa», «una rosa» o
//     «rosa». Los cuatro lotes de función publicaban una clave única, y
//     por eso el latinista los aplazó: cada fallo falso entra en el FSRS.
//     El gate lo exige ahora por ítem, y se vio ROJO contra los tres lotes
//     reales antes de arreglarlos.
//
// 2 · EL EJE DE VARIANZA. El gate comprobaba «≥3 declinaciones», que es el
//     eje de los puntos de `l3`. `l2-primera` es UNA declinación con el
//     sincretismo CONSTANTE y la FUNCIÓN como eje: aplicarle el de `l3`
//     lo suspendería por sus dos rasgos definitorios. Un gate que marca lo
//     correcto no lo lee nadie.
import { describe, it, expect } from 'vitest';
import {
  determinanteSinPareja, conAlternativaDeDeterminante,
  revisarItemFuncionCaso, revisarLoteFuncionCaso, type ItemFuncionCaso,
} from '@/scripts/lib/gate-funcion-caso';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { LOTE_ACUSATIVO } from '@/lib/data/languages/la/lotes/l3-acusativo-od';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

describe('la pareja definido/indefinido', () => {
  it('reconoce las contracciones y las preposiciones, no sólo el artículo suelto', () => {
    expect(determinanteSinPareja('la rosa', [])).toBe('una rosa');
    expect(determinanteSinPareja('una rosa', [])).toBe('la rosa');
    expect(determinanteSinPareja('a la niña', [])).toBe('a una niña');
    expect(determinanteSinPareja('del marinero', [])).toBe('de un marinero');
    expect(determinanteSinPareja('al poeta', [])).toBe('a un poeta');
    expect(determinanteSinPareja('las niñas', [])).toBe('unas niñas');
    // «de la» tiene que ganar a «la»: si no, pediría «de una la niña».
    expect(determinanteSinPareja('de la reina', [])).toBe('de una reina');
  });

  it('calla cuando la pareja ya está aceptada, y cuando no hay determinante', () => {
    expect(determinanteSinPareja('la rosa', ['una rosa'])).toBeNull();
    expect(determinanteSinPareja('la rosa', ['UNA ROSA'])).toBeNull();
    expect(determinanteSinPareja('Roma', [])).toBeNull();
    expect(determinanteSinPareja('a Marco', [])).toBeNull();
  });

  it('el helper rellena sólo lo mecánico y no pisa lo escrito a mano', () => {
    const a = conAlternativaDeDeterminante({ respuesta: 'a la madre', alternativas: ['a su madre'] });
    expect(a.alternativas).toEqual(['a su madre', 'a una madre']);
    const b = conAlternativaDeDeterminante({ respuesta: 'Roma' } as { respuesta: string; alternativas?: string[] });
    expect(b.alternativas).toBeUndefined();
  });
});

const base = (extra: Partial<ItemFuncionCaso>): ItemFuncionCaso => ({
  id: 'x', punto: 'l2-primera', entrada: N('puella'), funcion: 'posesor', numero: 'sg',
  // ⚠ El marco NO puede llevar cópula: con «est», «puellae» admite la
  //   lectura de dativo posesivo (A&G §373) y el ítem deja de ser único.
  //   La primera versión de este fixture usaba «Rosa puellae pulchra est.»
  //   y el gate nuevo la marcó — sobre un fixture de test, que es donde
  //   menos se mira.
  marco: 'Rosam puellae poeta videt.', forma: 'puellae',
  glosa: 'El poeta ve la rosa ___.', respuesta: 'de la niña',
  alternativas: ['de una niña'], ejes: { colisiones: 3 }, ...extra,
});

describe('el gate, EN ROJO', () => {
  it('ROJO · una clave con determinante y sin su pareja no pasa', () => {
    const fallos = revisarItemFuncionCaso(base({ alternativas: [] }));
    expect(fallos.map((f) => f.clase)).toContain('determinante-sin-alternativa');
    expect(fallos.find((f) => f.clase === 'determinante-sin-alternativa')!.detalle).toMatch(/de una niña/);
  });

  it('VERDE · con la pareja aceptada, el mismo ítem pasa', () => {
    expect(revisarItemFuncionCaso(base({}))).toEqual([]);
  });

  it('ROJO · con eje FUNCIÓN, falta una de las tres lecturas de «-ae»', () => {
    const dos = [base({ id: 'a', funcion: 'posesor' }), base({ id: 'b', funcion: 'destinatario' })];
    const r = revisarLoteFuncionCaso(dos, { colisionesMinimas: 3, colisionesMaximas: 3, ejeDeVarianza: 'funcion' });
    expect(r.fallos.some((f) => f.clase === 'eje-sin-cubrir' && /sujeto/.test(f.detalle))).toBe(true);
  });

  it('ROJO · con eje FUNCIÓN, una forma que no colisiona no examina el sincretismo', () => {
    // `rosam` (ac.sg) es única en su paradigma: no hay sincretismo que leer.
    const malo = base({ id: 'c', funcion: 'objeto-directo', forma: 'rosam', entrada: N('rosa'),
      marco: 'Puella rosam portat.', glosa: 'La niña lleva ___.', respuesta: 'la rosa',
      alternativas: ['una rosa'], ejes: { colisiones: 0 } });
    const r = revisarLoteFuncionCaso([malo], { colisionesMinimas: 0, colisionesMaximas: 0, ejeDeVarianza: 'funcion' });
    expect(r.fallos.some((f) => f.clase === 'eje-sin-cubrir' && /no colisiona/.test(f.detalle))).toBe(true);
  });

  it('el eje por DEFECTO sigue siendo el de l3, y el lote publicado lo pasa', () => {
    const r = revisarLoteFuncionCaso([...LOTE_ACUSATIVO], { colisionesMinimas: 0, colisionesMaximas: 2 });
    expect(r.fallos).toEqual([]);
  });
});
