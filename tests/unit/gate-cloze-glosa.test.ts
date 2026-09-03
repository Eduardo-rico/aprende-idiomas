// tests/unit/gate-cloze-glosa.test.ts
//
// EL GATE DEL FORMATO, CON SUS CONTROLES POSITIVOS.
//
// Cada comprobación va con un caso construido para SUSPENDER. Un gate
// visto sólo en verde no está probado — y este fichero lo demuestra en su
// propia historia: la v1 pasó 10 de 10 con controles positivos para las
// cuatro filtraciones que se le habían ocurrido a su autor, y el latinista
// adversarial destapó que el lote entero se resolvía con una regla que
// **el propio gate garantizaba**. Los controles nuevos son los de lote.
import { describe, it, expect } from 'vitest';
import {
  revisarClozeGlosa, revisarLote, respuestaPosicional, respuestaInvertida,
  ordenReal, tasasCiegas, TECHO_CIEGO, type ItemClozeGlosa, type EjesItem,
} from '../../scripts/lib/gate-cloze-glosa';

const REV = 'los dos son humanos y los dos pueden hacer y recibir la acción';
const EJES: EjesItem = { orden: 'OSV', conjugacion: 1, declinacion: 'mixta', numero: 'sg', esperado: 'falso' };

/** Un ítem sano de dos nombres masculinos singulares, con el orden pedido. */
function item(id: string, orden: EjesItem['orden'], esperado: EjesItem['esperado'] = 'falso'): ItemClozeGlosa {
  const S = { la: 'pater', es: 'padre', rol: 'sujeto' as const, gen: 'm' as const, num: 'sg' as const };
  const O = { la: 'fīlium', es: 'hijo', rol: 'objeto' as const, gen: 'm' as const, num: 'sg' as const };
  const V = { la: 'amat', es: 'ama', rol: 'verbo' as const };
  const mapa = { SOV: [S, O, V], SVO: [S, V, O], OSV: [O, S, V], OVS: [O, V, S], VSO: [V, S, O], VOS: [V, O, S] };
  const palabras = mapa[orden];
  return {
    id, punto: 'l3-funcion-por-desinencia',
    latin: palabras.map((p) => p.la).join(' ') + '.',
    palabras, glosa: 'El ___ ama al ___.', respuestas: ['padre', 'hijo'],
    reversible: REV, ejes: { ...EJES, orden, esperado },
  };
}

describe('LOTE · la estrategia que la v1 de este gate GARANTIZABA', () => {
  it('CAZA el lote entero de objeto-primero, que se resuelve invirtiendo', () => {
    // Éste es exactamente el primer lote de latín tal como se escribió:
    // doce ítems, todos con el objeto delante, cada uno impecable por
    // separado. «Escríbelos al revés» acertaba los doce.
    const v1 = (['OSV', 'OVS', 'VOS'] as const).flatMap((o) => [item(`a-${o}`, o), item(`b-${o}`, o)]);
    const t = tasasCiegas(v1);
    expect(t.inversion).toBe(1);
    expect(revisarLote(v1).map((x) => x.clase)).toContain('estrategia-ciega');
  });

  it('CAZA el lote de sujeto-primero, que se resuelve traduciendo en orden', () => {
    const malo = (['SOV', 'SVO', 'VSO'] as const).flatMap((o) => [item(`a-${o}`, o), item(`b-${o}`, o)]);
    expect(tasasCiegas(malo).posicional).toBe(1);
    expect(revisarLote(malo).map((x) => x.clase)).toContain('estrategia-ciega');
  });

  it('CAZA el lote que se resuelve preguntando «¿quién haría esto?»', () => {
    // La tercera, la que ni siquiera se me había ocurrido: los órdenes
    // están mezclados y las dos primeras estrategias fracasan, y aun así
    // el adivinador acierta porque la respuesta correcta es siempre el
    // agente esperado (el padre ama al hijo, el señor ve al siervo…).
    const malo = [item('1', 'SOV', 'correcto'), item('2', 'OSV', 'correcto'),
                  item('3', 'SVO', 'correcto'), item('4', 'OVS', 'correcto')];
    const t = tasasCiegas(malo);
    expect(t.posicional).toBe(0.5);
    expect(t.inversion).toBe(0.5);
    expect(t.pragmatica).toBe(1);
    const h = revisarLote(malo).filter((x) => x.clase === 'estrategia-ciega');
    expect(h).toHaveLength(1);
    expect(h[0]!.detalle).toContain('pragmática');
  });

  it('APRUEBA el lote mezclado, donde las tres se quedan en el azar', () => {
    const bueno = [
      item('1', 'SOV', 'falso'), item('2', 'OSV', 'correcto'),
      item('3', 'SVO', 'correcto'), item('4', 'OVS', 'falso'),
    ];
    const t = tasasCiegas(bueno);
    expect(t.posicional).toBe(0.5);
    expect(t.inversion).toBe(0.5);
    expect(t.pragmatica).toBe(0.5);
    expect(revisarLote(bueno).filter((x) => x.clase === 'estrategia-ciega')).toEqual([]);
    // El techo es el azar con dos candidatos: ni un punto por encima.
    expect(TECHO_CIEGO).toBe(0.5);
  });

  it('las dos estrategias de orden son COMPLEMENTARIAS, y por eso hay que mezclar', () => {
    // Cualquier ítem lo acierta exactamente una de las dos, así que un
    // lote de un solo tipo de orden regala el 100 % a una de ellas. No es
    // una elección de diseño: es aritmética, y es lo que la v1 ignoraba.
    for (const o of ['SOV', 'SVO', 'OSV', 'OVS', 'VSO', 'VOS'] as const) {
      const it_ = item('x', o);
      const p = respuestaPosicional(it_), i = respuestaInvertida(it_);
      expect(JSON.stringify(p) === JSON.stringify(it_.respuestas)).not.toBe(
        JSON.stringify(i) === JSON.stringify(it_.respuestas));
    }
  });
});

describe('ÍTEM · la fuga morfológica del español', () => {
  const fuga: ItemClozeGlosa = {
    id: 'ctrl-fuga', punto: 'l3-funcion-por-desinencia',
    latin: 'Puellam pater amat.',
    palabras: [
      { la: 'Puellam', es: 'niña', rol: 'objeto', gen: 'f', num: 'sg' },
      { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
      { la: 'amat', es: 'ama', rol: 'verbo' },
    ],
    glosa: 'El ___ ama a la ___.', respuestas: ['padre', 'niña'],
    reversible: REV, ejes: EJES,
  };

  it('CAZA el ítem que las demás comprobaciones aprueban', () => {
    // Los artículos «El» y «la» reparten los dos huecos sin latín: la
    // glosa contiene la respuesta, que es como murió el juicio binario en
    // portugués. Salió atacando el gate DESPUÉS de verlo verde.
    const h = revisarClozeGlosa(fuga).map((x) => x.clase);
    expect(h).not.toContain('hueco-fuera-del-rol');
    expect(h).not.toContain('no-reversible');
    expect(h).toContain('fuga-morfologica');
  });

  it('exige declarar género y número', () => {
    const sin = { ...fuga, palabras: fuga.palabras.map(({ gen, num, ...r }) => r) };
    expect(revisarClozeGlosa(sin).map((x) => x.clase)).toContain('fuga-morfologica');
  });

  it('y el par del mismo género pasa: es lo que hace usable el formato', () => {
    expect(revisarClozeGlosa(item('ok', 'OSV'))).toEqual([]);
  });
});

describe('ÍTEM · el hueco, la cuenta y la etiqueta', () => {
  const base = item('base', 'OSV');

  it('CAZA el hueco puesto en el verbo', () => {
    const h = { ...base, glosa: 'El padre ___ al hijo.', respuestas: ['ama'] };
    expect(revisarClozeGlosa(h).map((x) => x.clase)).toContain('hueco-fuera-del-rol');
  });

  it('CAZA la frase sin dos papeles que confundir', () => {
    const h: ItemClozeGlosa = { ...base, latin: 'Pater dormit.', glosa: 'El ___ duerme.', respuestas: ['padre'],
      palabras: [{ la: 'Pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' }, { la: 'dormit', es: 'duerme', rol: 'verbo' }] };
    expect(revisarClozeGlosa(h).map((x) => x.clase)).toContain('hueco-fuera-del-rol');
  });

  it('CAZA huecos y respuestas descuadrados', () => {
    expect(revisarClozeGlosa({ ...base, glosa: 'El ___ ama al hijo.' }).map((x) => x.clase)).toContain('huecos-y-respuestas');
  });

  it('CAZA la glosa que no reconstruye la frase', () => {
    // Sin esto, la simulación del alumno correría sobre un texto que no es
    // el que tiene delante: el gate se daría la razón a sí mismo.
    expect(revisarClozeGlosa({ ...base, latin: 'Fīlium māter amat.' }).map((x) => x.clase)).toContain('glosa-no-cuadra');
  });

  it('lee el orden de los datos, no de la etiqueta, y CAZA la que miente', () => {
    expect(ordenReal(base)).toBe('OSV');
    const mentira = { ...base, ejes: { ...base.ejes, orden: 'VOS' as const } };
    expect(revisarLote([mentira]).map((x) => x.clase)).toContain('eje-mal-declarado');
  });

  it('CAZA dos ítems que son el mismo desde el alumno AUNQUE cambie el verbo', () => {
    // `la-fpd-03` y `la-fpd-10` pasaban la v1: mismos nombres, mismas
    // formas, mismo orden, mismas respuestas, y sólo cambiaba la
    // conjugación — un eje ajeno a lo que este punto examina.
    const a = item('a', 'OSV');
    const b = { ...item('b', 'OSV'), latin: 'Fīlium pater dūcit.',
      palabras: [a.palabras[0]!, a.palabras[1]!, { la: 'dūcit', es: 'guía', rol: 'verbo' as const }],
      glosa: 'El ___ guía al ___.', ejes: { ...a.ejes, conjugacion: 3 as const } };
    expect(revisarLote([a, b]).map((x) => x.clase)).toContain('ejes-repetidos');
  });
});
