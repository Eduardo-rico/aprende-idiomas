// tests/unit/gate-cloze-glosa.test.ts
//
// EL GATE DEL FORMATO NUEVO, VISTO EN ROJO ANTES DEL PRIMER ÍTEM BUENO.
//
// Cada comprobación va con su CONTROL POSITIVO: un ítem construido para
// suspender. Un gate que sólo se ha visto en verde no está probado — este
// proyecto lleva tres gates nuevos que dieron 4, 26 y 21 hallazgos falsos
// antes de los buenos, y la única defensa fue correrlos contra un caso que
// DEBEN cazar.
import { describe, it, expect } from 'vitest';
import { revisarClozeGlosa, revisarLote, respuestaPosicional, ordenReal, type ItemClozeGlosa } from '../../scripts/lib/gate-cloze-glosa';

const REVERSIBLE_OK = 'padre e hijo son los dos humanos y los dos pueden amar y ser amados: el sentido común no decide';

describe('CONTROL POSITIVO 1 — la pista posicional', () => {
  // El peligro que mató al juicio binario en portugués, con la geometría
  // invertida: aquí la respuesta no está EN la glosa, está en el ORDEN.
  const libre: ItemClozeGlosa = {
    id: 'ctrl-posicional', punto: 'l3-funcion-por-desinencia',
    latin: 'Pater fīlium amat.',
    palabras: [
      { la: 'Pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
      { la: 'fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'amat', es: 'ama', rol: 'verbo' },
    ],
    glosa: 'El ___ ama al ___.',
    respuestas: ['padre', 'hijo'],
    reversible: REVERSIBLE_OK,
    ejes: { orden: 'SOV', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
  };

  it('CAZA el ítem en orden español, que se resuelve sin mirar una desinencia', () => {
    const h = revisarClozeGlosa(libre);
    expect(h.map((x) => x.clase)).toContain('pista-posicional');
  });

  it('y el mismo ítem con el orden INVERTIDO pasa', () => {
    // Las mismas palabras, la misma glosa, las mismas respuestas. Lo único
    // que cambia es el orden del latín — y es lo único que hace que el
    // ítem mida algo.
    const bueno: ItemClozeGlosa = {
      ...libre, id: 'ctrl-posicional-ok',
      latin: 'Fīlium pater amat.',
      palabras: [
        { la: 'Fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
        { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
        { la: 'amat', es: 'ama', rol: 'verbo' },
      ],
    };
    expect(revisarClozeGlosa(bueno)).toEqual([]);
    // Y la simulación del lector posicional entrega lo INCORRECTO, que es
    // exactamente lo que se le pide al ítem.
    expect(respuestaPosicional(bueno)).toEqual(['hijo', 'padre']);
    expect(respuestaPosicional(bueno)).not.toEqual(bueno.respuestas);
  });
});

describe('CONTROL POSITIVO 2 — el sentido común', () => {
  it('CAZA el ítem sin reversibilidad declarada', () => {
    // «Librum puella legit»: el orden contradice al español, así que la
    // comprobación (1) lo aprueba — y el ítem sigue sin medir nada, porque
    // un libro no lee. Es la razón de que hagan falta las DOS.
    const h = revisarClozeGlosa({
      id: 'ctrl-sentido-comun', punto: 'l3-funcion-por-desinencia',
      latin: 'Librum puella legit.',
      palabras: [
        { la: 'Librum', es: 'libro', rol: 'objeto', gen: 'm', num: 'sg' },
        { la: 'puella', es: 'niña', rol: 'sujeto', gen: 'f', num: 'sg' },
        { la: 'legit', es: 'lee', rol: 'verbo' },
      ],
      glosa: 'La ___ lee el ___.',
      respuestas: ['niña', 'libro'],
      reversible: '',
      ejes: { orden: 'OSV', conjugacion: 3, declinacion: 'mixta', numero: 'sg' },
    });
    expect(h.map((x) => x.clase)).toContain('no-reversible');
    // Y la prueba de que hacen falta las dos: la posicional NO lo caza.
    expect(h.map((x) => x.clase)).not.toContain('pista-posicional');
  });
});

describe('CONTROL POSITIVO 3 — el hueco fuera del rasgo', () => {
  it('CAZA el hueco puesto en el verbo', () => {
    // «Un ítem puede no medir su punto»: impecable, determinado e inútil,
    // porque el hueco cae en la palabra equivocada.
    const h = revisarClozeGlosa({
      id: 'ctrl-hueco', punto: 'l3-funcion-por-desinencia',
      latin: 'Fīlium pater amat.',
      palabras: [
        { la: 'Fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
        { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
        { la: 'amat', es: 'ama', rol: 'verbo' },
      ],
      glosa: 'El padre ___ al hijo.',
      respuestas: ['ama'],
      reversible: REVERSIBLE_OK,
      ejes: { orden: 'OSV', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
    });
    expect(h.map((x) => x.clase)).toContain('hueco-fuera-del-rol');
  });

  it('CAZA la frase sin dos papeles que confundir', () => {
    const h = revisarClozeGlosa({
      id: 'ctrl-un-rol', punto: 'l3-funcion-por-desinencia',
      latin: 'Pater dormit.',
      palabras: [{ la: 'Pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' }, { la: 'dormit', es: 'duerme', rol: 'verbo' }],
      glosa: 'El ___ duerme.',
      respuestas: ['padre'],
      reversible: REVERSIBLE_OK,
      ejes: { orden: 'SOV', conjugacion: 4, declinacion: 'mixta', numero: 'sg' },
    });
    expect(h.map((x) => x.clase)).toContain('hueco-fuera-del-rol');
  });
});

describe('CONTROL POSITIVO 4 — la fuga morfológica del español', () => {
  // ESTE CONTROL NO ESTABA. Salió atacando el gate después de verlo verde
  // con siete de siete, buscando el ítem malo que APRUEBA. Lo había.
  const fuga: ItemClozeGlosa = {
    id: 'ctrl-fuga', punto: 'l3-funcion-por-desinencia',
    latin: 'Puellam pater amat.',
    palabras: [
      { la: 'Puellam', es: 'niña', rol: 'objeto', gen: 'f', num: 'sg' },
      { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
      { la: 'amat', es: 'ama', rol: 'verbo' },
    ],
    glosa: 'El ___ ama a la ___.',
    respuestas: ['padre', 'niña'],
    reversible: 'padre y niña son los dos humanos y los dos pueden amar y ser amados',
    ejes: { orden: 'OSV', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
  };

  it('CAZA el ítem que las otras tres comprobaciones aprueban', () => {
    const h = revisarClozeGlosa(fuga);
    // El orden latino contradice al español, la reversibilidad está
    // declarada y los huecos caen sobre los papeles: las tres pasan.
    expect(h.map((x) => x.clase)).not.toContain('pista-posicional');
    expect(h.map((x) => x.clase)).not.toContain('no-reversible');
    expect(h.map((x) => x.clase)).not.toContain('hueco-fuera-del-rol');
    // Y el ítem está resuelto igual: «El» sólo admite al padre y «la»
    // sólo a la niña. La glosa contiene la respuesta, en el artículo.
    expect(h.map((x) => x.clase)).toContain('fuga-morfologica');
  });

  it('exige declarar género y número, porque sin ellos no se puede comprobar', () => {
    const sinRasgos = {
      ...fuga, id: 'ctrl-fuga-sin-rasgos',
      palabras: [
        { la: 'Puellam', es: 'niña', rol: 'objeto' as const },
        { la: 'pater', es: 'padre', rol: 'sujeto' as const },
        { la: 'amat', es: 'ama', rol: 'verbo' as const },
      ],
    };
    expect(revisarClozeGlosa(sinRasgos).map((x) => x.clase)).toContain('fuga-morfologica');
  });

  it('y el par del MISMO género pasa: es lo que hace usable el formato', () => {
    const bueno: ItemClozeGlosa = {
      ...fuga, id: 'ctrl-fuga-ok',
      latin: 'Fīliam māter amat.',
      palabras: [
        { la: 'Fīliam', es: 'hija', rol: 'objeto', gen: 'f', num: 'sg' },
        { la: 'māter', es: 'madre', rol: 'sujeto', gen: 'f', num: 'sg' },
        { la: 'amat', es: 'ama', rol: 'verbo' },
      ],
      glosa: 'La ___ ama a la ___.',
      respuestas: ['madre', 'hija'],
      reversible: 'madre e hija son las dos humanas y las dos pueden amar y ser amadas',
    };
    expect(revisarClozeGlosa(bueno)).toEqual([]);
  });
});

describe('CONTROL POSITIVO 5 — la contabilidad', () => {
  it('CAZA huecos y respuestas descuadrados', () => {
    const h = revisarClozeGlosa({
      id: 'ctrl-cuenta', punto: 'l3-funcion-por-desinencia',
      latin: 'Fīlium pater amat.',
      palabras: [
        { la: 'Fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
        { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
        { la: 'amat', es: 'ama', rol: 'verbo' },
      ],
      glosa: 'El ___ ama al hijo.',
      respuestas: ['padre', 'hijo'],
      reversible: REVERSIBLE_OK,
      ejes: { orden: 'OSV', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
    });
    expect(h.map((x) => x.clase)).toContain('huecos-y-respuestas');
  });

  it('CAZA la glosa palabra-a-palabra que no reconstruye la frase', () => {
    // Sin esto, `respuestaPosicional` simularía a un alumno leyendo una
    // frase que no es la que tiene delante: el gate se daría la razón a sí
    // mismo sobre un texto inventado.
    const h = revisarClozeGlosa({
      id: 'ctrl-cuadra', punto: 'l3-funcion-por-desinencia',
      latin: 'Fīlium pater amat.',
      palabras: [
        { la: 'Fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
        { la: 'māter', es: 'madre', rol: 'sujeto', gen: 'f', num: 'sg' },
        { la: 'amat', es: 'ama', rol: 'verbo' },
      ],
      glosa: 'La ___ ama al ___.',
      respuestas: ['madre', 'hijo'],
      reversible: REVERSIBLE_OK,
      ejes: { orden: 'OSV', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
    });
    expect(h.map((x) => x.clase)).toContain('glosa-no-cuadra');
  });
});

describe('CONTROL POSITIVO 6 — el eje declarado contra los datos', () => {
  // `ejes` es una etiqueta escrita a mano encima de una frase: exactamente
  // la clase de dato que se desincroniza sin que falle nada. Así que se
  // comprueba por un segundo camino, leyendo el orden de las palabras.
  const base: ItemClozeGlosa = {
    id: 'ctrl-eje', punto: 'l3-funcion-por-desinencia',
    latin: 'Fīlium pater amat.',
    palabras: [
      { la: 'Fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
      { la: 'amat', es: 'ama', rol: 'verbo' },
    ],
    glosa: 'El ___ ama al ___.',
    respuestas: ['padre', 'hijo'],
    reversible: REVERSIBLE_OK,
    ejes: { orden: 'OSV', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
  };

  it('lee el orden de los datos, no de la etiqueta', () => {
    expect(ordenReal(base)).toBe('OSV');
  });

  it('CAZA la etiqueta que miente', () => {
    const mentira = { ...base, id: 'ctrl-eje-mal', ejes: { ...base.ejes, orden: 'VOS' as const } };
    expect(revisarLote([mentira]).map((x) => x.clase)).toContain('eje-mal-declarado');
  });

  it('CAZA dos ítems con los cuatro ejes iguales', () => {
    const gemelo = { ...base, id: 'ctrl-eje-gemelo' };
    expect(revisarLote([base, gemelo]).map((x) => x.clase)).toContain('ejes-repetidos');
  });
});
