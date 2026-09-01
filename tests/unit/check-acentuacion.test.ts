// El gate tiene que DISCRIMINAR, no marcar.
//
// Su primera versión marcó 10 glosas y las 10 eran correctas: confundía
// «acento grave» (la crase) con la clase llana, leía una pregunta que
// enumera las tres clases como si afirmara una, y partía «ô-ni-bus» en
// «nibus» porque `\b` es ASCII. Un gate así se deja de leer en una semana.
import { describe, it, expect } from 'vitest';
import { claseDe, NOMBRES, esNombreDeSigno } from '@/scripts/lib/acentuacion';

describe('discriminación del gate', () => {
  it('«acento grave» es el signo, no la clase llana', () => {
    const t = 'preposición «a» + artículo femenino: contracción con acento grave';
    const i = t.indexOf('grave');
    expect(esNombreDeSigno(t, i)).toBe(true);
  });
  it('«palabra grave» sí es la clase', () => {
    const t = 'táxi es una palabra grave';
    expect(esNombreDeSigno(t, t.indexOf('grave'))).toBe(false);
  });
  it('«no lleva acento agudo» tampoco es la clase', () => {
    const t = 'no lleva acento agudo';
    expect(esNombreDeSigno(t, t.indexOf('agudo'))).toBe(true);
  });
  it('los nombres cubren las dos lenguas', () => {
    expect(NOMBRES['esdrújula']).toBe('proparoxitona');
    expect(NOMBRES['llana']).toBe('paroxitona');
    expect(NOMBRES['oxítona']).toBe('oxitona');
  });
  it('el caso real que sobrevive: ônibus', () => {
    // La glosa dice paroxítona; es proparoxítona Y lleva tilde.
    expect(claseDe('ônibus')).toBe('proparoxitona');
  });
});
