// tests/unit/pistas-revisadas.test.ts
//
// LOS CINCO LOTES CONTRA LAS LISTAS DEL ADVERSARIAL.
//
// Cierra una deuda declarada: los lotes llevaban «PENDIENTE de revisión
// adversarial» en su lista de pistas, y una lista escrita por el autor no
// vale — el algoritmo es exhaustivo sobre la lista y **la lista la escribe
// una persona**. La prueba está en este mismo proyecto: cuatro de los
// cinco lotes se resolvían contando ejercicios y esa pista no se le
// ocurrió a quien los escribió.
import { describe, it, expect } from 'vitest';
import { contrastarConPotencia, revisarComposiciones, revisarRevisionDePistas } from '../../scripts/lib/composiciones';
import { PISTAS_L3, PISTAS_L2, PISTAS_L4, PISTAS_L11, PISTAS_L5, REVISOR } from '../../lib/data/languages/la/pistas-revisadas';
import { LOTE_FUNCION_POR_DESINENCIA as L3 } from '../../lib/data/languages/la/lotes/l3-funcion-por-desinencia';
import { LOTE_SEGUNDA as L2 } from '../../lib/data/languages/la/lotes/l2-segunda';
import { LOTE_CONCORDANCIA as L4 } from '../../lib/data/languages/la/lotes/l4-concordancia';
import { LOTE_FALSOS_REGALOS as L11 } from '../../lib/data/languages/la/lotes/l11-falsos-regalos';
import { LOTE_FUTURO as L5 } from '../../lib/data/languages/la/lotes/l5-futuro';
import { respuestaPosicional, respuestaInvertida } from '../../scripts/lib/gate-cloze-glosa';
import { respuestaIngenua, respuestaSincopada } from '../../scripts/lib/gate-cloze-derivado';
import { respuestaRimada } from '../../scripts/lib/gate-concordancia';
import { rutaBi, rutaE } from '../../scripts/lib/gate-transformacion';

const j = (x: string[]) => x.join('|');

/* eslint-disable @typescript-eslint/no-explicit-any */
const CASOS: [string, any[], any, (i: any) => string, any[]][] = [
  ['l3 · cloze en la glosa', L3, PISTAS_L3, (i) => j(i.respuestas),
    [{ nombre: 'traducir en orden', responde: (i: any) => j(respuestaPosicional(i)) },
     { nombre: 'invertir', responde: (i: any) => j(respuestaInvertida(i)) }]],
  ['l2 · cloze derivado', L2, PISTAS_L2, (i) => i.respuesta.toLowerCase(),
    [{ nombre: 'tema del nominativo', responde: (i: any) => respuestaIngenua(i.entrada, i.celda) },
     { nombre: 'sincopar siempre', responde: (i: any) => respuestaSincopada(i.entrada, i.celda) }]],
  ['l4 · concordancia', L4, PISTAS_L4, (i) => i.respuesta.toLowerCase(),
    [{ nombre: 'rimar', responde: (i: any) => respuestaRimada(i) },
     { nombre: 'no rimar', responde: () => '' }]],
  ['l11 · flashcard', L11, PISTAS_L11, (i) => (i.esFalsoRegalo ? 'trampa' : 'fiel'),
    [{ nombre: 'desconfía', responde: () => 'trampa' }, { nombre: 'fíate', responde: () => 'fiel' }]],
  ['l5 · transformación', L5, PISTAS_L5, (i) => i.respuesta.toLowerCase(),
    [{ nombre: '-bi- siempre', responde: (i: any) => rutaBi(i) },
     { nombre: '-ē- siempre', responde: (i: any) => rutaE(i) }]],
];

describe('los cinco lotes, contra la lista del adversarial', () => {
  for (const [nombre, lote, pistas, correcta, ciegas] of CASOS) {
    it(nombre, () => {
      const v = contrastarConPotencia(lote, correcta, ciegas, pistas, 1000);
      // Las TRES preguntas, y las tres tienen que salir bien:
      expect(revisarComposiciones(v), `${nombre}: hay atajo`).toEqual([]);          // ¿hay atajo?
      expect(revisarRevisionDePistas(v), `${nombre}: lista o potencia`).toEqual([]); // ¿es fiable?
      expect(v.puedeDetectar, `${nombre}: sin potencia`).toBe(true);                 // ¿podría verlo?
      expect(v.revisadaPor).toBe(REVISOR);
    });
  }

  it('y la lista NO la firma el autor del lote', () => {
    // El punto entero: quien escribe los ítems es el peor situado para
    // enumerar lo que su lote regala. En rumano el autor puso 9 pistas y
    // el adversarial barrió 72.
    for (const [, , pistas] of CASOS) {
      expect(pistas.revisadaPor).not.toMatch(/autor/i);
      expect(pistas.revisadaPor).toBe(REVISOR);
      expect(pistas.pistas.length).toBeGreaterThanOrEqual(6);
    }
  });

  it('y las listas conservan las pistas que NO separan', () => {
    // Evidencia negativa medida: la longitud de la frase, el mácrón
    // inicial, «el verbo español acaba en -ar». Sin ellas, el siguiente
    // las vuelve a proponer creyendo que son nuevas.
    const nombres = CASOS.flatMap(([, , p]) => p.pistas.map((x: any) => x.nombre));
    expect(nombres).toContain('la frase es larga');
    expect(nombres).toContain('el verbo español acaba en -ar');
    expect(nombres).toContain('se escriben casi igual');
  });
});
