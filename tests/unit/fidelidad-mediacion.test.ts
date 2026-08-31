// tests/unit/fidelidad-mediacion.test.ts
//
// Los cinco gates de la familia MEDIACIÓN-ÍTEM v1 («fidelidad de relay»).
// TDD en rojo, con fixtures REALES del lote 1 — incluidos los casos que
// deben PASAR, porque un gate que sólo se prueba con lo que caza no sirve
// para producir: la familia tiene molde por diseño.
import { describe, it, expect } from 'vitest';
import {
  tramoCambiado, tiposDeEtiqueta, tiposDeclarados, coherenciaDatosFuente,
  validarItem, type ItemFidelidad,
} from '@/scripts/lib/fidelidad-mediacion';

// ── Fixtures reales del lote ─────────────────────────────────────────
const MFID_01: ItemFidelidad = {
  id: 'MFID-01',
  fuente: '«Corte de água na próxima terça-feira, dia 14, para substituição de canos no piso 2. A água volta até às 17h. Encham garrafas na véspera, se faz favor.»',
  datos: ['día (martes 14)', 'motivo (cambio de tuberías, piso 2)', 'plazo de regreso (hasta las 17h, incluidas)', 'recomendación (llenar botellas la víspera)'],
  fiel: 'El martes 14 cortan el agua para cambiar unas tuberías del segundo. Vuelve como muy tarde a las cinco. Dicen de llenar botellas la noche antes.',
  mostrado: 'El martes 14 cortan el agua para cambiar unas tuberías del segundo. Vuelve antes de las cinco. Dicen de llenar botellas la noche antes.',
  transformacion: 'PLAZO',
  opciones: ['Falta el motivo del corte', 'Se adelanta el plazo', 'Cambia el día', 'No falla nada'],
  correctIndex: 1,
};

const MFID_02_FIEL: ItemFidelidad = {
  id: 'MFID-02',
  fuente: '«Talho Silva — encerrado para férias de 1 a 15 de agosto. Reabrimos dia 16 às 8h.»',
  datos: ['cierre (1 al 15 de agosto)', 'reapertura (día 16 a las 8h)'],
  fiel: 'La carnicería cierra por vacaciones del 1 al 15 de agosto y abre otra vez el 16 a las ocho.',
  mostrado: 'La carnicería cierra por vacaciones del 1 al 15 de agosto y abre otra vez el 16 a las ocho.',
  transformacion: 'FIEL',
  opciones: ['Falta la hora de reapertura', 'Cambia las fechas del cierre', 'No falla nada', 'Añade algo que el cartel no dice'],
  correctIndex: 2,
};

const MFID_04_INVENCION: ItemFidelidad = {
  id: 'MFID-04',
  fuente: '«É o canalizador. Passo amanhã de manhã, entre as nove e o meio-dia, para ver a torneira da cozinha.»',
  datos: ['cuándo (mañana por la mañana, de nueve a doce)', 'qué (el grifo de la cocina)'],
  fiel: 'Ha llamado el fontanero. Viene mañana por la mañana, entre las nueve y las doce, a mirar el grifo de la cocina.',
  mostrado: 'Ha llamado el fontanero. Viene mañana por la mañana, entre las nueve y las doce, a mirar el grifo de la cocina y a darte el presupuesto.',
  transformacion: 'INVENCIÓN',
  opciones: ['Falta la condición de la llave', 'Cambia la franja horaria', 'Añade algo que el recado no dice', 'No falla nada'],
  correctIndex: 2,
};

describe('tramoCambiado — gate 1: una sola transformación', () => {
  it('aísla el tramo que cambió entre el recado fiel y el mostrado', () => {
    const t = tramoCambiado(MFID_01.fiel, MFID_01.mostrado);
    expect(t.quitado).toBe('como muy tarde a');
    expect(t.puesto).toBe('antes de');
  });

  it('devuelve un tramo vacío cuando los dos son idénticos (ítem FIEL)', () => {
    const t = tramoCambiado(MFID_02_FIEL.fiel, MFID_02_FIEL.mostrado);
    expect(t.quitado).toBe('');
    expect(t.puesto).toBe('');
    expect(t.identicos).toBe(true);
  });

  it('detecta una adición pura: nada quitado, algo puesto', () => {
    const t = tramoCambiado(MFID_04_INVENCION.fiel, MFID_04_INVENCION.mostrado);
    expect(t.quitado).toBe('');
    expect(t.puesto).toContain('presupuesto');
  });

  it('marca DOS cambios separados, que harían ambigua la clave', () => {
    const dos = tramoCambiado(
      'El martes 14 a las cinco en la sala 7.',
      'El jueves 14 a las cinco en la sala 9.',
    );
    expect(dos.saltos).toBeGreaterThan(1);
  });

  // Una transformación reescribe un sintagma y casi siempre comparte
  // alguna palabra corta con el original («ir», «el domingo 20»). Sin
  // fundir los bloques contiguos, el gate 1 acusaba de «dos cambios» a
  // ítems que aplican uno solo — falsos positivos medidos en MFID-06 y
  // MFID-08 del lote 1.
  it('funde en UNO los retoques separados por pocas palabras comunes', () => {
    const uno = tramoCambiado(
      'Lo puedes recoger hasta el domingo 20 incluido.',
      'Lo puedes recoger antes del domingo 20.',
    );
    expect(uno.saltos).toBe(1);
  });

  it('funde también cuando la reescritura conserva el verbo', () => {
    const uno = tramoCambiado(
      'Para renovarlo tienes que ir tú en persona con el carné viejo.',
      'Para renovarlo puede ir cualquiera de la familia con el carné viejo.',
    );
    expect(uno.saltos).toBe(1);
  });

  it('NO funde dos cambios de verdad, aunque estén en la misma frase corta', () => {
    const dos = tramoCambiado(
      'El martes a las cinco en la sala 7, con la ficha firmada.',
      'El jueves a las cinco en la sala 7, con la ficha sin firmar.',
    );
    expect(dos.saltos).toBe(2);
  });
});

describe('tiposDeEtiqueta — de la etiqueta al tipo de dato', () => {
  it('mapea las etiquetas españolas y portuguesas al mismo tipo', () => {
    expect(tiposDeEtiqueta('Falta la hora de reapertura')).toContain('HORA');
    expect(tiposDeEtiqueta('Muda a hora de regresso')).toContain('HORA');
    expect(tiposDeEtiqueta('Se adelanta el plazo')).toContain('PLAZO');
    expect(tiposDeEtiqueta('Cambia quién tiene que hacerlo')).toContain('AGENTE');
    expect(tiposDeEtiqueta('Muda quem recebe a ficha')).toContain('AGENTE');
    expect(tiposDeEtiqueta('Cambia el sitio')).toContain('LUGAR');
  });

  it('trata como universales las etiquetas que valen para cualquier fuente', () => {
    expect(tiposDeEtiqueta('No falla nada')).toEqual(['*']);
    expect(tiposDeEtiqueta('Não falha nada')).toEqual(['*']);
    expect(tiposDeEtiqueta('Añade algo que el recado no dice')).toEqual(['*']);
  });
});

describe('coherenciaDatosFuente — gate 3: el dato declarado existe en la fuente', () => {
  it('acepta un PLAZO declarado cuando la fuente trae «até»', () => {
    expect(coherenciaDatosFuente(MFID_01.datos, MFID_01.fuente).ok).toBe(true);
  });

  it('rechaza un PRECIO declarado que la fuente no menciona', () => {
    const r = coherenciaDatosFuente(['precio (12 euros)'], 'Volta até às 17h, sem mais.');
    expect(r.ok).toBe(false);
    expect(r.faltan).toContain('PRECIO');
  });

  it('acepta una HORA declarada en la forma portuguesa «às 8h»', () => {
    expect(coherenciaDatosFuente(['reapertura (día 16 a las 8h)'], MFID_02_FIEL.fuente).ok).toBe(true);
  });
});

describe('validarItem — los cinco gates juntos', () => {
  it('da por bueno un ítem del lote con transformación declarada', () => {
    const r = validarItem(MFID_01);
    expect(r.fallos).toEqual([]);
  });

  it('da por bueno un ítem FIEL con los dos recados idénticos', () => {
    expect(validarItem(MFID_02_FIEL).fallos).toEqual([]);
  });

  it('gate 2: cae si correctIndex no apunta a la etiqueta de la transformación', () => {
    const r = validarItem({ ...MFID_01, correctIndex: 0 });
    expect(r.fallos.join(' ')).toMatch(/clave/i);
  });

  it('gate 5: cae si un ítem FIEL trae los recados distintos', () => {
    const r = validarItem({ ...MFID_02_FIEL, mostrado: MFID_02_FIEL.fiel.replace('las ocho', 'las nueve') });
    expect(r.fallos.join(' ')).toMatch(/FIEL/i);
  });

  it('gate 4: cae si un distractor nombra un dato que la fuente NO tiene', () => {
    const r = validarItem({
      ...MFID_01,
      opciones: ['Falta el precio', 'Se adelanta el plazo', 'Cambia el día', 'No falla nada'],
    });
    expect(r.fallos.join(' ')).toMatch(/precio|plausible/i);
  });

  it('gate 1: cae si el recado mostrado cambia dos cosas a la vez', () => {
    const r = validarItem({
      ...MFID_01,
      mostrado: 'El jueves 14 cortan el agua para cambiar unas tuberías del segundo. Vuelve antes de las cinco. Dicen de llenar botellas la noche antes.',
    });
    expect(r.fallos.join(' ')).toMatch(/dos|una sola/i);
  });

  it('el ítem de INVENCIÓN pasa: lo añadido NO está en la fuente', () => {
    expect(validarItem(MFID_04_INVENCION).fallos).toEqual([]);
  });

  it('una INVENCIÓN que copia algo que la fuente SÍ dice no es invención', () => {
    const r = validarItem({
      ...MFID_04_INVENCION,
      mostrado: MFID_04_INVENCION.fiel.replace('del grifo de la cocina', 'del grifo de la cocina y de la torneira'),
      transformacion: 'INVENCIÓN',
    });
    expect(r.fallos.join(' ')).toMatch(/invenci/i);
  });
});

describe('gates de lote — los atajos que se miden sobre los 24', () => {
  it('reparte la clave cerca del uniforme y no siempre en la misma posición', () => {
    const lote = [MFID_01, MFID_02_FIEL, MFID_04_INVENCION];
    const cuenta = [0, 0, 0, 0];
    for (const x of lote) cuenta[x.correctIndex]!++;
    expect(Math.max(...cuenta) - Math.min(...cuenta)).toBeLessThanOrEqual(2);
  });
});
