// tests/unit/orden-publicado.test.ts
//
// EL ORDEN EN QUE SE PUBLICA UN LOTE ES UNA PISTA.
//
// El hallazgo más caro del latín: **cuatro de los cinco lotes se resolvían
// al 100 % contando ejercicios.** Escritos agrupados por su eje —primero
// los seis con marca `-bi-`, luego los seis con `-ē-`— y servidos por
// `ExerciseRunner` con `exercises[idx]` incremental, o sea en ese orden.
// El alumno no necesitaba percibir nada de la frase: le bastaba con notar
// que a partir del séptimo cambia la respuesta.
//
// Y el detector que lo caza, `separablePorPosicion`, **estaba en el
// repositorio desde portugués** y ninguno de los cinco gates de latín lo
// llamaba. Un detector que existe y no se llama es peor que no tenerlo:
// da sensación de cobertura.
import { describe, it, expect } from 'vitest';
import { separablePorPosicion } from '../../scripts/lib/atajos';
import { ordenPublicado, patronDe, buscarSemilla } from '../../scripts/lib/orden-publicado';
import { LOTE_FUNCION_POR_DESINENCIA as L3 } from '../../lib/data/languages/la/lotes/l3-funcion-por-desinencia';
import { LOTE_SEGUNDA as L2 } from '../../lib/data/languages/la/lotes/l2-segunda';
import { LOTE_CONCORDANCIA as L4 } from '../../lib/data/languages/la/lotes/l4-concordancia';
import { LOTE_FALSOS_REGALOS as L11 } from '../../lib/data/languages/la/lotes/l11-falsos-regalos';
import { LOTE_FUTURO as L5 } from '../../lib/data/languages/la/lotes/l5-futuro';
import { revisarLoteT } from '../../scripts/lib/gate-transformacion';

const EJES = [
  ['l3 · ¿el sujeto va delante?', L3, (i: (typeof L3)[number]) => ['SOV', 'SVO', 'VSO'].includes(i.ejes.orden)],
  ['l2 · ¿el tema conserva la vocal?', L2, (i: (typeof L2)[number]) => i.ejes.clase === 'conserva' || i.ejes.clase === 'regular'],
  ['l4 · ¿riman las desinencias?', L4, (i: (typeof L4)[number]) => i.ejes.rima],
  ['l11 · ¿la palabra transfiere?', L11, (i: (typeof L11)[number]) => !i.esFalsoRegalo],
  ['l5 · ¿lleva la marca -bi-?', L5, (i: (typeof L5)[number]) => i.ejes.marca === 'bi'],
] as const;

describe('ningún lote se resuelve contando ejercicios', () => {
  for (const [nombre, lote, esB] of EJES) {
    it(nombre, () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const patron = patronDe(lote as any[], esB as any);
      expect(separablePorPosicion(patron), `${nombre}: ${patron}`).toBeNull();
    });
  }
});

describe('CONTROL POSITIVO: el orden agrupado, que es como estaban', () => {
  it('el detector lo caza, y el gate lo denuncia', () => {
    // Sin esto, los cinco verdes de arriba no dirían nada: un detector que
    // nunca ha dicho que sí es indistinguible de uno que no sabe decirlo.
    const agrupado = [...L5].sort((a, b) => (a.ejes.marca === 'bi' ? 0 : 1) - (b.ejes.marca === 'bi' ? 0 : 1));
    expect(separablePorPosicion(patronDe(agrupado, (i) => i.ejes.marca === 'bi'))).not.toBeNull();
    expect(revisarLoteT(agrupado).map((x) => x.clase)).toContain('orden-separable');
  });

  it('y la alternancia estricta TAMPOCO vale, que era la tentación', () => {
    // `BMBMBM…` se lee bien y el mismo detector la caza por paridad. Por
    // eso el orden va barajado con semilla y no alternado a mano.
    expect(separablePorPosicion('BMBMBMBMBMBM')).not.toBeNull();
    expect(separablePorPosicion('BMBMBMBMBMBM')).toMatch(/paridad/);
  });
});

describe('la baraja es determinista, o el orden no sería reproducible', () => {
  it('la misma semilla da el mismo orden', () => {
    const a = ordenPublicado([1, 2, 3, 4, 5, 6, 7, 8], 1);
    const b = ordenPublicado([1, 2, 3, 4, 5, 6, 7, 8], 1);
    expect(a).toEqual(b);
    expect(ordenPublicado([1, 2, 3, 4, 5, 6, 7, 8], 2)).not.toEqual(a);
  });

  it('y `buscarSemilla` encuentra una que pase, o dice que no hay', () => {
    const agrupado = [...L5].sort((a, b) => (a.ejes.marca === 'bi' ? 0 : 1) - (b.ejes.marca === 'bi' ? 0 : 1));
    const s = buscarSemilla(agrupado, (i) => i.ejes.marca === 'bi', separablePorPosicion);
    expect(s).not.toBeNull();
    expect(separablePorPosicion(patronDe(ordenPublicado(agrupado, s!), (i) => i.ejes.marca === 'bi'))).toBeNull();
  });
});
