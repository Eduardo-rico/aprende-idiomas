// tests/unit/lote-la-2v.test.ts — el lote del vocativo.
import { describe, it, expect } from 'vitest';
import { revisarLoteD, tasasCiegasD, coberturaDerivado, copiarNominativo, vocativoSiempreE } from '../../scripts/lib/gate-cloze-derivado';
import { LOTE_VOCATIVO as LOTE } from '../../lib/data/languages/la/lotes/l2-vocativo';
import { PISTAS_L2V } from '../../lib/data/languages/la/pistas-revisadas';
import { contrastarConPotencia, revisarComposiciones, revisarRevisionDePistas } from '../../scripts/lib/composiciones';
import { revisarCantidad } from '../../lib/data/languages/la/cantidad';
import { declinar } from '../../lib/data/languages/la/paradigma-la';
import { PUNTOS_LA } from '../../lib/data/languages/la/inventario-puntos';

describe('el lote del vocativo', () => {
  it('pasa el gate entero', () => expect(revisarLoteD(LOTE)).toEqual([]));

  it('las dos rutas ciegas se quedan en el azar o por debajo', () => {
    const t = tasasCiegasD(LOTE);
    expect(t.copiarNominativo).toBe(0.5);
    expect(t.vocSiempreE).toBe(0.4);
  });

  it('trae los CINCO que coinciden con el nominativo, que son el punto', () => {
    // El 63 % del corpus. Sin ellos el alumno aprende el error simétrico
    // —que el vocativo siempre cambia— y lo aplicaría a dos tercios de los
    // casos, que es peor que el error que la tarjeta evita.
    const coinciden = LOTE.filter((i) => i.respuesta === i.entrada.lema);
    expect(coinciden).toHaveLength(5);
    // Y van EXIMIDOS de «celda gratis» con el motivo escrito, no en silencio.
    for (const i of coinciden) expect(i.porQueNoEsGratis, i.id).toBeTruthy();
  });

  it('y trae la excepción de los -ius, sin la cual se saca 9/9 sobregeneralizando', () => {
    const filius = LOTE.find((i) => i.entrada.lema === 'fīlius')!;
    expect(filius.respuesta).toBe('fīlī');
    expect(vocativoSiempreE(filius)).toBe('fīlie');   // lo que produce la ruta ciega
  });

  it('la rama griega queda DECLARADA FUERA, no olvidada', () => {
    // `Iēsū` no está: la entrada de este formato es «lema + genitivo», y
    // el genitivo de `Iēsus` ES `Iēsū`, o sea su propio vocativo. Como
    // tarea de producción el ítem no mide nada, y eximirlo habría sido
    // engañarme: la exención existe para cuando copiar ES el punto, no
    // para cuando el punto no se puede examinar en este formato.
    expect(LOTE.find((i) => i.entrada.lema === 'Iēsus')).toBeUndefined();
    // Pero la forma SÍ existe en la máquina, declarada como irregular.
    expect(declinar({ lema: 'Iēsus', genitivo: 'Iēsū', genero: 'm', glosa: 'Jesús', soloSingular: true }, 'voc', 'sg')).toBe('Iēsū');
  });

  it('cumple los ítems que pide su descriptor', () => {
    const punto = PUNTOS_LA.find((p) => p.id === 'l2-vocativo')!;
    expect(punto.itemsQuePide).toBe(10);
    expect(LOTE).toHaveLength(10);
  });

  it('la cantidad de marcos y respuestas', () => {
    for (const i of LOTE) {
      expect(revisarCantidad(i.marco.replace('___', '')), `${i.id} marco`).toEqual([]);
      expect(revisarCantidad(i.respuesta), `${i.id} respuesta`).toEqual([]);
    }
  });

  it('sin atajo compuesto, con potencia — y la lista SIN revisar sale marcada', () => {
    const E = [
      { nombre: 'copiar el nominativo', responde: copiarNominativo },
      { nombre: '-e siempre', responde: vocativoSiempreE },
    ];
    const v = contrastarConPotencia(LOTE, (i) => i.respuesta.toLowerCase(), E, PISTAS_L2V, 1000);
    expect(revisarComposiciones(v)).toEqual([]);
    expect(v.puedeDetectar).toBe(true);
    // Y la verdad sobre la lista: este lote es posterior al informe del
    // latinista, así que la escribió el autor y el gate lo dice.
    expect(revisarRevisionDePistas(v).map((x) => x.clase)).toContain('pistas-sin-revisar');
  });

  it('cada comprobación dice sobre cuántos ítems decidió', () => {
    for (const c of coberturaDerivado(LOTE)) {
      expect(c.decididos, c.comprobacion).toBeGreaterThan(0);
      if (c.decididos < c.total) expect(c.motivoDeLosQueQuedanFuera, c.comprobacion).toBeTruthy();
    }
  });
});
