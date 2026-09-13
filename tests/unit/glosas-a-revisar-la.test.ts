// tests/unit/glosas-a-revisar-la.test.ts
//
// La glosa es el campo más inerte del lexicón y yo había dicho que no se
// podía verificar desde dentro. Se puede a medias, y este test fija hasta
// dónde: qué cubre la fuente, qué NO consigue el triaje automático, y que
// el silencio nunca cuenta como error.
import { describe, it, expect } from 'vitest';
import { glosasParaRevisar, raices } from '@/scripts/lectura/glosas-a-revisar';

const todas = glosasParaRevisar();
const conDef = todas.filter((g) => !g.noVerificable);

describe('LA FUENTE SÍ TRAE LA DEFINICIÓN', () => {
  it('cubre el 83 % de las glosas, casi lo mismo que las cantidades', () => {
    expect(todas).toHaveLength(141);
    expect(conDef.length / todas.length).toBeGreaterThan(0.8);
  });

  it('y las que no, salen NO VERIFICABLES, que no es «mal»', () => {
    const sin = todas.filter((g) => g.noVerificable);
    expect(sin.length).toBeGreaterThan(0);
    for (const g of sin) {
      expect(g.definicion, g.lema).toBeNull();
      expect(g.solapa, g.lema).toBe(false);   // no se puede afirmar nada
    }
  });
});

describe('EL TRIAJE AUTOMÁTICO NO SIRVE, y queda medido', () => {
  it('marcaría el 88 % de las glosas, o sea ninguna', () => {
    // El español y el inglés no comparten raíz aunque la glosa sea
    // perfecta. Marcar 103 de 117 es el gotcha de «un gate ruidoso es un
    // gate apagado», y por eso esto NO es un gate: es un listado.
    const noSolapan = conDef.filter((g) => !g.solapa).length;
    expect(noSolapan / conDef.length).toBeGreaterThan(0.7);
  });

  it('los falsos positivos son glosas correctas y evidentes', () => {
    const porLema = new Map(todas.map((g) => [g.lema, g]));
    for (const l of ['aqua', 'fīlia', 'māter']) {
      const g = porLema.get(l)!;
      expect(g.solapa, `${l} no solapa y su glosa es correcta`).toBe(false);
    }
  });

  it('pero el instrumento MIRA: donde hay raíz común la encuentra', () => {
    // Si `solapa` fuera siempre falso el test de arriba pasaría igual.
    expect([...raices('causa, motivo')].some((r) => raices('cause, reason').has(r))).toBe(true);
    expect(conDef.some((g) => g.solapa)).toBe(true);
  });
});

describe('LO QUE EL LISTADO SÍ PONE DELANTE', () => {
  it('`nātiō` está glosado «nación, pueblo» y la fuente dice «birth»', () => {
    // No es un veredicto: es lo que hay que preguntarle al lingüista. El
    // sentido clásico primario es «nacimiento, origen» y «nación» es el
    // derivado, que es justo la proyección hacia atrás que
    // `l11-vulgata-lexico` declara como su error diana.
    const n = todas.find((g) => g.lema === 'nātiō')!;
    expect(n.glosa).toContain('nación');
    expect(n.definicion).toContain('birth');
    expect(n.solapa).toBe(false);
  });

  it('y cada glosa lleva su definición al lado, que es todo el valor', () => {
    for (const g of conDef) {
      expect(g.definicion, g.lema).toBeTruthy();
      expect(g.definicion!.length, g.lema).toBeGreaterThan(1);
    }
  });
});
