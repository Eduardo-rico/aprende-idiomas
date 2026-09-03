// El contador canónico de puntos del rumano, visto EN ROJO antes de creerle.
//
// Lo que caza y por qué importa: un lote de 24 con un punto mal escrito
// sigue teniendo 24 ítems «escritos». El total no denuncia nada; el que
// denuncia es el punto que cuenta CERO. Es el mismo fallo que devuelve un
// número plausible que ya mordió en este proyecto.
import { describe, it, expect } from 'vitest';
import { contarPuntosRo, informeAsigna, pisoDePunto } from '../../scripts/lib/asigna-ro';
import { PUNTOS_RO } from '../../lib/data/languages/ro/inventario-puntos';

const draft = (p: string) => ({ p, sentence: 'Am trei prieteni în Cluj.', hintEs: 'amigo — plural', answer: 'prieteni' });

describe('contarPuntosRo', () => {
  it('el universo lo da el inventario: los puntos a cero están presentes', () => {
    const { cuenta } = contarPuntosRo([]);
    expect(cuenta.size).toBe(PUNTOS_RO.length);
    expect([...cuenta.values()].every((n) => n === 0)).toBe(true);
  });

  it('no cuenta lo que el alumno no puede ver (needs-human)', () => {
    const item = (st?: string) => ({ concepts: ['r2-plural-i-e-uri'], variantStatus: st });
    expect(contarPuntosRo([item(), item('needs-human')]).cuenta.get('r2-plural-i-e-uri')).toBe(1);
  });

  it('un concepto fuera del inventario NO se cuela en ningún punto', () => {
    const { cuenta, desconocidos } = contarPuntosRo([{ concepts: ['r2-articulo-enclitic-pl'] }]);
    expect(desconocidos.get('r2-articulo-enclitic-pl')).toBe(1);
    expect([...cuenta.values()].reduce((a, b) => a + b, 0)).toBe(0);
  });
});

describe('informeAsigna — EN ROJO', () => {
  it('ROJO: un punto mal escrito cuenta cero aunque el lote esté completo', () => {
    const r = informeAsigna([draft('r2-plural-i-e-uri'), draft('r2-articulo-enclitic-pl')]);
    expect(r.desvio).toBe(true);
    expect(r.lineas.join('\n')).toContain('r2-articulo-enclitic-pl ×1');
    expect(r.lineas.join('\n')).toContain('| 1 | 0 ⚠ |');
  });

  it('VERDE: con los puntos del inventario, cada ítem cuenta donde declara', () => {
    const r = informeAsigna([draft('r2-plural-i-e-uri'), draft('r2-articulo-enclitico-pl'), draft('r4-gd-definido-sg')]);
    expect(r.desvio).toBe(false);
    expect(r.lineas.join('\n')).toContain('Ningún ítem se desvía');
  });
});

describe('pisoDePunto', () => {
  it('el piso es 8, y 6 en C2', () => {
    const c2 = PUNTOS_RO.find((p) => p.nivel === 'C2')!;
    const a1 = PUNTOS_RO.find((p) => p.nivel === 'A1')!;
    expect(pisoDePunto(c2.id)).toBe(6);
    expect(pisoDePunto(a1.id)).toBe(8);
  });
});
