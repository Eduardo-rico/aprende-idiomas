// tests/unit/atestacion-agente-la.test.ts — EL SELLO DEL AGENTE, y sobre
// todo lo que NO se puede sacar de él.
//
// El sello nació para un lote de `l3-ablativo-agente` que se RETIRÓ tras
// el pase adversarial. Se conserva porque la medida es buena y el punto
// sigue pendiente; lo que estos tests fijan es la frontera entre lo que
// mide y lo que un lector con prisa creería que mide.
import { describe, it, expect } from 'vitest';
import sello from '@/lib/data/languages/la/atestacion-agente.json';

const S = sello as { frases: number; totales: { con: number; sin: number }; lemas: Record<string, { con: number; sin: number }> };

describe('el sello mide lo que dice', () => {
  it('653 con `ā/ab` y 1.379 sin preposición sobre 20.406 frases', () => {
    expect(S.frases).toBe(20406);
    expect(S.totales).toEqual({ con: 653, sin: 1379 });
  });
  it('y las cuentas por lema suman los totales', () => {
    const c = Object.values(S.lemas).reduce((a, x) => a + x.con, 0);
    const s = Object.values(S.lemas).reduce((a, x) => a + x.sin, 0);
    expect({ con: c, sin: s }).toEqual(S.totales);
  });
});

describe('LA EXCEPCIÓN DEL PUNTO, que el corpus confirma', () => {
  it('`natura` sale de las DOS maneras, cinco y cinco', () => {
    expect(S.lemas['natura']).toEqual({ con: 5, sin: 5 });
  });
});

describe('★ DE AQUÍ NO SE DERIVA LA ANIMACIDAD, y estos casos lo demuestran', () => {
  // La regla que parecía razonable —«animado ⇔ con > 0 y sin === 0»— la
  // tuvo un gate y certificaba en verde justo el error que el punto existe
  // para enseñar. Los cuatro casos quedan fijados para que nadie la
  // reponga.
  const animadoSegunElRecuento = (l: string) => (S.lemas[l]?.con ?? 0) > 0 && (S.lemas[l]?.sin ?? 0) === 0;

  it('un REY saldría INANIMADO, por un solo token mal anotado', () => {
    expect(S.lemas['rex']).toEqual({ con: 0, sin: 1 });
    expect(animadoSegunElRecuento('rex')).toBe(false);
  });
  it('y un MONUMENTO saldría animado', () => {
    expect(animadoSegunElRecuento('monumentum')).toBe(true);
  });
  it('`homo` y `frater` saldrían «excepción», por un ablativo absoluto cada uno', () => {
    for (const l of ['homo', 'frater']) {
      expect(S.lemas[l]!.con, l).toBeGreaterThan(0);
      expect(S.lemas[l]!.sin, l).toBeGreaterThan(0);
    }
  });
  it('y el recuento daría por animados 196 de los 780 lemas', () => {
    const n = Object.keys(S.lemas).filter(animadoSegunElRecuento).length;
    expect(Object.keys(S.lemas).length).toBe(780);
    expect(n).toBe(196);
  });
});

describe('el episodio de `timor`, que sí fue un acierto del sello', () => {
  it('sale 1 con `ā` y 10 sin ella, y la sonda que no se commiteó decía 0', () => {
    expect(S.lemas['timor']).toEqual({ con: 1, sin: 10 });
  });
});
