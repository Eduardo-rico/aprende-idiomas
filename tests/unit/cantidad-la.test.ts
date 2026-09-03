// tests/unit/cantidad-la.test.ts
//
// EL GATE DE LA CANTIDAD, VISTO EN ROJO.
//
// Nace de un test que salía verde con los mácrons correctos, con ninguno
// y con todos inventados. Así que lo primero de este fichero no es que
// apruebe lo bueno: es que SUSPENDA lo malo, en las dos direcciones.
import { describe, it, expect } from 'vitest';
import { revisarCantidad, auditarPorReflejos, LEXICON, REFLEJOS } from '../../lib/data/languages/la/cantidad';

describe('el caso que el gate anterior aprobaba', () => {
  it('SUSPENDE el texto sin mácrons', () => {
    const h = revisarCantidad('Filium amicus vocat.');
    expect(h.map((x) => x.clase)).toContain('cantidad-erronea');
    expect(h.map((x) => x.forma)).toEqual(expect.arrayContaining(['Filium', 'amicus']));
  });

  it('SUSPENDE el texto con mácrons INVENTADOS', () => {
    // La dirección que el gate anterior no podía ver: marcar de más.
    const h = revisarCantidad('Fīlīum āmīcus vōcat.');
    expect(h.filter((x) => x.clase === 'cantidad-erronea')).toHaveLength(3);
  });

  it('APRUEBA el texto correcto', () => {
    expect(revisarCantidad('Fīlium amīcus vocat.')).toEqual([]);
  });

  it('no calla ante una forma que no conoce', () => {
    // Callar ante lo desconocido es exactamente como el gate anterior no
    // medía nada: aprobaba todo lo que no sabía juzgar.
    expect(revisarCantidad('Caesar venit.').map((x) => x.clase)).toContain('forma-desconocida');
  });

  it('la vocal temática se ABREVIA ante -t y -nt, y el lexicón lo dice', () => {
    // El error típico del material generado es escribir `amāt` o `audīt`
    // por analogía con el infinitivo. A&G §603.f.
    expect(revisarCantidad('amat vocat videt audit amant vident')).toEqual([]);
    expect(revisarCantidad('amāt').map((x) => x.clase)).toContain('cantidad-erronea');
    expect(revisarCantidad('audīt').map((x) => x.clase)).toContain('cantidad-erronea');
  });
});

describe('el SEGUNDO camino, que no consulta el mácrón', () => {
  it('el lexicón concuerda con los reflejos romances', () => {
    // Un validador que recomputa con las mismas reglas se da la razón a
    // sí mismo. Esto no: que `servum` diera «siervo» prueba que la e es
    // breve sin mirar el lexicón, porque sólo ĕ diptonga.
    expect(auditarPorReflejos()).toEqual([]);
  });

  it('y CAZA una cantidad falsa metida en el lexicón', () => {
    // Control positivo del auditor: sin esto sería un sello que responde
    // «sí» sin haber mirado.
    const real = LEXICON.servum;
    try {
      (LEXICON as Record<string, string>).servum = 'sērvum';
      const h = auditarPorReflejos();
      expect(h).toHaveLength(1);
      expect(h[0]).toContain('siervo');
    } finally {
      (LEXICON as Record<string, string>).servum = real!;
    }
    expect(auditarPorReflejos()).toEqual([]);
  });

  it('los reflejos cubren los cuatro pares que discriminan', () => {
    // ă/ā no deja huella en español, así que no puede auditarse por aquí
    // y se declara en vez de fingir cobertura.
    expect(REFLEJOS.filter((r) => r[2] === 'breve').length).toBeGreaterThanOrEqual(3);
    expect(REFLEJOS.filter((r) => r[2] === 'larga').length).toBeGreaterThanOrEqual(3);
  });
});
