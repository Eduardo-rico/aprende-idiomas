// tests/unit/cantidad-la.test.ts
//
// EL GATE DE LA CANTIDAD, VISTO EN ROJO.
//
// Nace de un test que salía verde con los mácrons correctos, con ninguno
// y con todos inventados. Así que lo primero de este fichero no es que
// apruebe lo bueno: es que SUSPENDA lo malo, en las dos direcciones.
import { describe, it, expect } from 'vitest';
import { revisarCantidad, auditarPorReflejos, revisarCoherenciaLexico, separarEnclitico, formasValidas, REFLEJOS, _invalidarCache } from '../../lib/data/languages/la/cantidad';
import { NOMBRES_L1 } from '../../lib/data/languages/la/lexicon-l1';

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

  it('y CAZA una cantidad falsa, envenenando el GENITIVO, que es de donde sale el tema', () => {
    // Control positivo, y con dos historias encima.
    //
    // (1) Cuando el auditor pasó a leer la salida de la máquina en vez de
    //     una tabla a mano, este control DEJÓ DE FALLAR, porque envenenaba
    //     algo que ya nadie leía. Un control positivo que deja de fallar
    //     es un control que dejó de controlar.
    // (2) Al reapuntarlo, envenenar el LEMA tampoco hizo nada: la máquina
    //     deriva del GENITIVO. El lema no entra en ninguna forma de la 2.ª
    //     declinación regular — que es justamente lo que destapó que hacía
    //     falta `revisarCoherenciaLexico`.
    const e = NOMBRES_L1.find((x) => x.lema === 'servus')!;
    const real = e.genitivo;
    try {
      e.genitivo = 'sērvī';
      _invalidarCache();
      const h = auditarPorReflejos();
      expect(h).toHaveLength(1);
      expect(h[0]).toContain('siervo');
    } finally {
      e.genitivo = real;
      _invalidarCache();
    }
    expect(auditarPorReflejos()).toEqual([]);
  });

  it('el lema declarado y la forma derivada COINCIDEN, y el gate lo caza si no', () => {
    expect(revisarCoherenciaLexico()).toEqual([]);
    const e = NOMBRES_L1.find((x) => x.lema === 'servus')!;
    const real = e.genitivo;
    try {
      e.genitivo = 'sērvī';
      _invalidarCache();
      const h = revisarCoherenciaLexico();
      expect(h).toHaveLength(1);
      expect(h[0]).toContain('sērvus');
    } finally {
      e.genitivo = real;
      _invalidarCache();
    }
    expect(revisarCoherenciaLexico()).toEqual([]);
  });

  it('los reflejos cubren los cuatro pares que discriminan', () => {
    // ă/ā no deja huella en español, así que no puede auditarse por aquí
    // y se declara en vez de fingir cobertura.
    expect(REFLEJOS.filter((r) => r[2] === 'breve').length).toBeGreaterThanOrEqual(3);
    expect(REFLEJOS.filter((r) => r[2] === 'larga').length).toBeGreaterThanOrEqual(3);
  });
});

describe('EL ENCLÍTICO, que no se separa por espacios', () => {
  // `-que` va PEGADO —`populusque`, `dominusque`— así que el troceo por
  // no-letras lo entrega entero. No basta con añadirlo al lexicón: hay que
  // partir, y hay que partir con cuidado.

  it('parte cuando lo que queda ES una forma conocida', () => {
    expect(revisarCantidad('dominusque')).toEqual([]);
    expect(separarEnclitico('dominusque', formasValidas())).toEqual(['dominus', 'que']);
    expect(revisarCantidad('servus dominusque agrōs custōdiunt')).toEqual([]);
  });

  it('y NO parte las que acaban igual sin llevar enclítico', () => {
    // `neque`, `quisque`, `usque`, `dēnique`, `atque` son palabras
    // enteras. Con sólo la primera condición —«la palabra completa no es
    // conocida»— se partirían en cuanto faltaran del lexicón; con sólo la
    // segunda, `sine` se partiría en `si`+`ne`.
    const v = formasValidas();
    for (const w of ['neque', 'quisque', 'usque', 'dēnique', 'itaque', 'atque', 'sine']) {
      expect(separarEnclitico(w, v), w).toEqual([w]);
    }
  });

  it('y una base DESCONOCIDA no se parte para salvarla', () => {
    // Partir una palabra para que su `que` final pasara sería fabricar una
    // aprobación: la misma familia que un generador que inventa cuando no
    // sabe. Aquí la base tiene que quedar entera y ser rechazada.
    //
    // LA BASE ES INVENTADA A PROPÓSITO. La versión anterior usaba
    // «populusque» porque `populus` no estaba en el lexicón — y al meterlo
    // (1.127 apariciones de `Deus` obligaron a repasar los frecuentes) el
    // test se puso rojo sin que nada se rompiera: el partidor había pasado
    // a acertar, porque «populusque» es latín de verdad, el del «Senātus
    // Populusque Rōmānus». Un fixture que depende de que algo NO exista
    // caduca en cuanto el material crece, así que ahora la base es una
    // secuencia que ninguna ampliación del lexicón va a contener.
    expect(separarEnclitico('xyrgotusque', formasValidas())).toEqual(['xyrgotusque']);
    expect(revisarCantidad('xyrgotusque').map((x) => x.clase)).toContain('forma-desconocida');

    // Y el control por el otro lado: con la base YA en el lexicón, sí se
    // parte. Si esto dejara de partir, el partidor estaría muerto y el test
    // de arriba seguiría verde por la razón equivocada.
    expect(separarEnclitico('populusque', formasValidas())).toEqual(['populus', 'que']);
  });

  it('las palabras de función que faltaban después de ocho lotes', () => {
    // `et` es la palabra más frecuente del latín (11.407) y `nōn` la
    // duodécima (2.931). Sin ellas no se puede escribir una frase
    // coordinada ni una negación, y se nota en los lotes ya escritos: casi
    // toda frase es N-V-N de tres palabras.
    for (const w of ['et', 'nōn', 'ut', 'sed', 'quia', 'ad', 'per', 'dē', 'sī', 'nē', 'autem', 'enim']) {
      expect(revisarCantidad(w), w).toEqual([]);
    }
  });

  it('y el gate NO se ha aflojado al ensancharse', () => {
    for (const mala of ['amāt', 'āmīcus', 'Filium', 'dūcēbit', 'populusqux']) {
      expect(revisarCantidad(mala).length, mala).toBeGreaterThan(0);
    }
  });
});
