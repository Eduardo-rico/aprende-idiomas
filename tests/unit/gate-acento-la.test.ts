// tests/unit/gate-acento-la.test.ts
//
// EL GATE DE LA REGLA DE LA PENÚLTIMA, VISTO EN ROJO — y con los dos
// falsos positivos que él mismo produjo antes de dar el verde bueno.
import { describe, expect, it } from 'vitest';
import {
  coberturaAcento, POSICION_EN_LA_LENGUA, revisarItemAcento, revisarLoteAcento,
  SUELO_DE_LA_PENULTIMA, tasasCiegasAc, type ItemAcento,
} from '../../scripts/lib/gate-acento-la';
import { tipoDeAcento } from '../../scripts/lib/atestar-acento';

const item = (p: Partial<ItemAcento> & { palabra: string; respuesta: string }): ItemAcento => {
  const t = tipoDeAcento(p.palabra);
  return {
    id: 'x', punto: 'l1-acento-penultima', pista: `${t.silabas.length} sílabas`, glosa: '—',
    ejes: { tipo: t.tipo, silabas: t.silabas.length }, ...p,
  } as ItemAcento;
};
const clases = (i: ItemAcento) => revisarItemAcento(i).map((f) => f.clase);

describe('el suelo que pone la lengua, medido y no supuesto', () => {
  it('el latín ya da seis de cada diez llanas', () => {
    expect(SUELO_DE_LA_PENULTIMA).toBeGreaterThan(0.6);
    expect(SUELO_DE_LA_PENULTIMA).toBeLessThan(0.65);
  });

  it('y la categoría que examina la mitad difícil es rarísima', () => {
    // El `motivo` de `l1-larga-por-posicion` decía «se equivoca en la mitad
    // de las palabras»; el corpus del propio proyecto dice el 6,3 % de las
    // formas atestiguadas y el 0,7 % de los tokens. Corregido en el
    // inventario el 2026-09-12.
    //
    // La primera versión de este test ponía 0,06 como techo, porque la
    // cifra entonces era 3,8 % — y esa cifra salía de un enumerador que
    // miraba tres tablas de diez. El techo va ahora en 0,10, que deja sitio
    // a la medida y sigue estando lejísimos de «la mitad».
    expect(POSICION_EN_LA_LENGUA).toBeLessThan(0.10);
    expect(POSICION_EN_LA_LENGUA).toBeGreaterThan(0.04);
  });
});

describe('un ítem limpio no da ningún fallo', () => {
  it('«magister»', () => { expect(revisarItemAcento(item({ palabra: 'magister', respuesta: 'gis' }))).toEqual([]); });
  it('«Deus», que hasta hoy salía monosílabo', () => {
    expect(revisarItemAcento(item({ palabra: 'Deus', respuesta: 'de' }))).toEqual([]);
  });
});

describe('los dos falsos positivos que produjo el propio gate', () => {
  // No son hipótesis: el gate rechazó estos dos ítems del lote real y en
  // los dos tenía razón el ítem.
  it('«dónde» no regala la sílaba «de»', () => {
    expect(clases(item({ palabra: 'Deus', respuesta: 'de', pista: '2 sílabas · ¿dónde cae el acento?' })))
      .not.toContain('pista-regala-la-tonica');
  });

  it('pero nombrarla suelta sí la regala', () => {
    expect(clases(item({ palabra: 'Deus', respuesta: 'de', pista: 'la tónica es de' })))
      .toContain('pista-regala-la-tonica');
    expect(clases(item({ palabra: 'puella', respuesta: 'el', pista: 'empieza por el acento' })))
      .toContain('pista-regala-la-tonica');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la tónica escrita a mano que no es la que saca la máquina', () => {
    expect(clases(item({ palabra: 'dominus', respuesta: 'mi' }))).toContain('tonica-no-derivable');
  });

  it('el tipo mal declarado', () => {
    expect(clases(item({ palabra: 'magister', respuesta: 'gis', ejes: { tipo: 'macron', silabas: 3 } })))
      .toContain('eje-mal-declarado');
  });

  it('el número de sílabas mal declarado', () => {
    expect(clases(item({ palabra: 'magister', respuesta: 'gis', ejes: { tipo: 'posicion', silabas: 4 } })))
      .toContain('eje-mal-declarado');
  });

  it('una palabra que la máquina de L1 no produce', () => {
    expect(clases(item({ palabra: 'īnsula', respuesta: 'īn' }))).toContain('sin-atestiguar');
  });
});

describe('los venenos de LOTE', () => {
  const l = (ws: [string, string][]) => ws.map(([p, r], k) => item({ id: `i${k}`, palabra: p, respuesta: r }));

  it('un lote que copia la proporción de la lengua se contesta adivinando', () => {
    const lote = l([['magister', 'gis'], ['puella', 'el'], ['habēre', 'bē'], ['virtūte', 'tū'],
                    ['vīdistī', 'dis'], ['fēcistis', 'cis'], ['dominī', 'do'], ['fīlius', 'fī']]);
    expect(revisarLoteAcento(lote).map((f) => f.clase)).toContain('suelo-de-la-lengua');
  });

  it('sin penúltima larga POR POSICIÓN no se examina la mitad difícil', () => {
    const lote = l([['habēre', 'bē'], ['virtūte', 'tū'], ['cīvitātem', 'tā'],
                    ['dominī', 'do'], ['fīlius', 'fī'], ['facere', 'fa']]);
    expect(revisarLoteAcento(lote).map((f) => f.detalle).join(' ')).toContain('por POSICIÓN');
  });

  it('y sin bisílabos no se examina la excepción declarada', () => {
    const lote = l([['magister', 'gis'], ['puella', 'el'], ['vīdistī', 'dis'],
                    ['dominī', 'do'], ['fīlius', 'fī'], ['facere', 'fa']]);
    expect(revisarLoteAcento(lote).map((f) => f.detalle).join(' ')).toContain('bisílabos');
  });

  it('la misma palabra dos veces', () => {
    const lote = l([['magister', 'gis'], ['magister', 'gis']]);
    expect(revisarLoteAcento(lote).map((f) => f.clase)).toContain('palabras-repetidas');
  });
});

describe('la regla que NO se puede pedir, y que el gate en rojo enseñó', () => {
  it('las dos estrategias son complementarias: el máximo nunca baja del 50 %', () => {
    // Entre palabras de 3+ sílabas, una acierta donde la otra falla. Exigir
    // que las dos bajen del 50 % es un gate imposible de pasar, y un gate
    // que no se puede pasar se acaba desactivando.
    const lote = [...Array(10)].map((_, k) => item({ id: `a${k}`, palabra: 'magister', respuesta: 'gis' }))
      .concat([...Array(10)].map((_, k) => item({ id: `b${k}`, palabra: 'dominī', respuesta: 'do' })));
    const t = tasasCiegasAc(lote);
    expect(Math.max(t.siempreLaPenultima, t.siempreLaAntepenultima)).toBeGreaterThanOrEqual(0.5);
    expect(t.siempreLaPenultima + t.siempreLaAntepenultima).toBeCloseTo(1, 5);
  });
});

describe('la categoría vacía se declara como resultado', () => {
  it('el diptongo en la penúltima no existe en L1, y la cobertura no lo llama hueco', () => {
    const lote = [item({ palabra: 'magister', respuesta: 'gis' })];
    const c = coberturaAcento(lote).find((x) => x.comprobacion.includes('DIPTONGO'))!;
    expect(c.decididos).toBe(0);
    expect(c.elCeroEsUnResultado).toBeTruthy();
    // Y por eso esa fila NO sale como `cobertura-cero`. Se comprueba
    // cruzando clase y texto: el lote de un solo ítem produce otros ceros
    // legítimos —bisílabos, palabras largas— y mirar sólo la clase haría
    // pasar o fallar el test por el motivo equivocado. Ya me pasó hoy en el
    // gate de los adjetivos.
    const ceros = revisarLoteAcento(lote).filter((f) => f.clase === 'cobertura-cero');
    expect(ceros.map((f) => f.detalle).join(' ')).not.toContain('DIPTONGO');
    expect(ceros.length).toBeGreaterThan(0);   // los otros ceros SÍ salen
  });
});
