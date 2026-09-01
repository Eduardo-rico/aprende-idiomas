// tests/unit/hint-es-supervivencia.test.ts
//
// UN CAMPO QUE EL ESQUEMA SE TRAGA Y TIRA EN SILENCIO.
//
// `FillBlankData` era un `z.object`, que por defecto **descarta las
// claves que no declara sin dar error**. Así que un autor podía escribir
// `hintEs`, el esquema decía «válido», y el campo desaparecía antes de
// llegar a la tarjeta. De los 417 `fill_blank` publicados, cero lo usan
// — y ahora se entiende por qué: no habría servido de nada.
//
// La trampa fina, y es la que casi me come: arreglar la TARJETA no
// arregla nada si el dato no llega. El primer test de la tarjeta pasaba
// porque mockeaba `resolveExerciseData` para devolver `ex.data` en
// crudo, es decir **mockeaba justo el paso que rompía**. Un test que
// esconde el bug que dice cubrir.
import { describe, it, expect } from 'vitest';
import { ExerciseDataByTypeSchema } from '@/lib/data/zod-schemas';
import { resolveExerciseData } from '@/lib/exercise-resolver';

const conPista = {
  sentence: 'Para os teus colegas ___ o comboio das seis, temos de sair já.',
  blanks: [{ position: 0, answer: 'apanharem', alternatives: [] }],
  hintEs: 'apanhar — para que tus compañeros cojan el tren',
};

describe('`hintEs` sobrevive al esquema y al resolver', () => {
  it('el esquema de fill_blank lo CONSERVA', () => {
    const r = (ExerciseDataByTypeSchema as any).fill_blank.safeParse(conPista);
    expect(r.success).toBe(true);
    expect(r.data.hintEs).toBe(conPista.hintEs);
  });

  it('sobrevive al resolver cuando NO hay overrides de variante', () => {
    const ex = { id: 'x', type: 'fill_blank', data: conPista } as any;
    expect(resolveExerciseData(ex, 'pt-pt').hintEs).toBe(conPista.hintEs);
  });

  it('sobrevive al resolver CUANDO SÍ hay overrides — que es la ruta que parsea', () => {
    // Ésta es la ruta que tiraba el campo: con overrides, el resolver
    // parsea el objeto fundido contra el esquema, y lo que el esquema no
    // declara se cae por el camino.
    const ex = {
      id: 'x', type: 'fill_blank', data: conPista,
      variantOverrides: { 'pt-br': { sentence: 'Para os seus colegas ___ o trem das seis, temos de sair já.' } },
    } as any;
    const r = resolveExerciseData(ex, 'pt-br');
    expect(r.sentence).toContain('trem');
    expect(r.hintEs).toBe(conPista.hintEs);
  });
});
