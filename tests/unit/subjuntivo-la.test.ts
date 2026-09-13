// tests/unit/subjuntivo-la.test.ts
//
// EL SUBJUNTIVO — la pieza más grande del latín, y la que más puntos
// desbloquea: dieciocho lo nombran.
import { describe, it, expect } from 'vitest';
import {
  subjuntivo, subjuntivoPasivo, paradigmaSubjuntivo, homonimoDelIndicativo,
  SUBJUNTIVO_IRREGULAR, SIN_PASIVA_SUBJ, TIEMPOS_SUBJ, PERSONAS_SUBJ,
} from '@/lib/data/languages/la/subjuntivo';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { formasUnicasDeL1, TABLAS_QUE_PRODUCEN_FORMAS, todasLasFormasDeL1 } from '@/lib/data/languages/la/todas-las-formas';
import atestacion from '@/lib/data/languages/la/atestacion-acento.json';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const TABLA = (atestacion as { tabla: Record<string, { n: number }> }).tabla;

describe('las cuatro formaciones', () => {
  it('el PRESENTE es el único que cambia por conjugación', () => {
    expect(subjuntivo(V('amō'), 'presente', '1sg')).toBe('amem');       // 1.ª: ā → ē
    expect(subjuntivo(V('moneō'), 'presente', '1sg')).toBe('moneam');   // 2.ª: se inserta -ā-
    expect(subjuntivo(V('dūcō'), 'presente', '1sg')).toBe('dūcam');     // 3.ª
    expect(subjuntivo(V('audiō'), 'presente', '1sg')).toBe('audiam');   // 4.ª
    expect(subjuntivo(V('capiō'), 'presente', '1sg')).toBe('capiam');   // mixta: conserva la i
  });

  it('el IMPERFECTO es el infinitivo más la desinencia, en las cuatro', () => {
    expect(subjuntivo(V('amō'), 'imperfecto', '1sg')).toBe('amārem');
    expect(subjuntivo(V('moneō'), 'imperfecto', '1sg')).toBe('monērem');
    expect(subjuntivo(V('dūcō'), 'imperfecto', '1sg')).toBe('dūcerem');
    expect(subjuntivo(V('audiō'), 'imperfecto', '1sg')).toBe('audīrem');
  });

  it('y la `e` final del infinitivo se ALARGA, no se le añade otra', () => {
    // La primera versión daba *`amāreēs`: añadía una `ē` en vez de alargar
    // la que ya está. Salía una vocal de más en cuatro de las seis personas.
    expect(subjuntivo(V('amō'), 'imperfecto', '2sg')).toBe('amārēs');
    expect(subjuntivo(V('dūcō'), 'imperfecto', '1pl')).toBe('dūcerēmus');
  });

  it('el PERFECTO y el PLUSCUAMPERFECTO salen del tema de perfecto', () => {
    expect(subjuntivo(V('amō'), 'perfecto', '1sg')).toBe('amāverim');
    expect(subjuntivo(V('amō'), 'pluscuamperfecto', '1sg')).toBe('amāvissem');
    expect(subjuntivo(V('dīcō'), 'perfecto', '3sg')).toBe('dīxerit');
    expect(subjuntivo(V('dīcō'), 'pluscuamperfecto', '3sg')).toBe('dīxisset');
  });
});

describe('LA HOMONIMIA QUE OTRO PUNTO DECLARA, ahora comprobable', () => {
  it('«dūcam» y «audiam» son a la vez futuro de indicativo y presente de subjuntivo', () => {
    // `l5-futuro-dos-formas` lo dice en su excepción: «la 1.ª persona de la
    // 3.ª y 4.ª es idéntica al presente de subjuntivo: sólo el contexto
    // separa». Hasta hoy era una afirmación; ahora la máquina la produce y
    // se puede comprobar.
    expect(homonimoDelIndicativo(V('dūcō'), 'presente', '1sg')).toBe('futuro.1sg');
    expect(homonimoDelIndicativo(V('audiō'), 'presente', '1sg')).toBe('futuro.1sg');
  });

  it('y en la 1.ª y la 2.ª NO pasa, que es la otra mitad de la afirmación', () => {
    expect(homonimoDelIndicativo(V('amō'), 'presente', '1sg')).toBeNull();
    expect(homonimoDelIndicativo(V('moneō'), 'presente', '1sg')).toBeNull();
  });
});

describe('los irregulares van en tabla y no se derivan', () => {
  it('`sum`, `possum`, `volō` y compañía', () => {
    expect(SUBJUNTIVO_IRREGULAR['sum']!.presente!['1sg']).toBe('sim');
    expect(SUBJUNTIVO_IRREGULAR['sum']!.imperfecto!['1sg']).toBe('essem');
    expect(SUBJUNTIVO_IRREGULAR['volō']!.presente!['1sg']).toBe('velim');
    expect(SUBJUNTIVO_IRREGULAR['volō']!.imperfecto!['1sg']).toBe('vellem');
  });

  it('pero su perfectum SÍ sale del tema, que es lo que los hace mixtos', () => {
    expect(subjuntivo(V('sum'), 'perfecto', '1sg')).toBe('fuerim');
    expect(subjuntivo(V('sum'), 'pluscuamperfecto', '1sg')).toBe('fuissem');
  });
});

describe('la pasiva del subjuntivo', () => {
  it('se forma sobre el mismo tema con el otro juego de desinencias', () => {
    expect(subjuntivoPasivo(V('amō'), 'presente', '1sg')).toBe('amer');
    expect(subjuntivoPasivo(V('amō'), 'presente', '3sg')).toBe('amētur');
    expect(subjuntivoPasivo(V('videō'), 'imperfecto', '3sg')).toBe('vidērētur');
  });

  it('y la 2.ª del plural lleva vocal LARGA, como el indicativo', () => {
    // La primera versión la puso breve y salía *`ameminī`.
    expect(subjuntivoPasivo(V('amō'), 'presente', '2pl')).toBe('amēminī');
  });

  it('los que no tienen pasiva van declarados, no tragados por un catch', () => {
    expect(SIN_PASIVA_SUBJ.has('sum')).toBe(true);
    expect(subjuntivoPasivo(V('sum'), 'presente', '1sg')).toBeNull();
  });
});

describe('está ENCHUFADO, que es la mitad del trabajo', () => {
  it('el enumerador del dominio lo conoce como tabla propia', () => {
    expect(TABLAS_QUE_PRODUCEN_FORMAS).toContain('SUBJUNTIVOS');
    const n = todasLasFormasDeL1().filter((f) => f.tabla === 'SUBJUNTIVOS').length;
    expect(n).toBeGreaterThan(1000);
  });

  it('y sus formas están en el dominio y en la evidencia congelada', () => {
    const dominio = new Set(formasUnicasDeL1());
    for (const f of ['amem', 'amārem', 'amāverim', 'amāvissem', 'sim', 'essem', 'velim', 'vidērētur'])
      expect(dominio.has(f), f).toBe(true);
    // y la evidencia congelada las ve, que es lo que el congelador no hacía
    // con seis tablas hasta hoy
    expect(TABLA['amem']).toBeDefined();
    expect(TABLA['vidērētur']).toBeDefined();
  });

  it('una buena parte está atestiguada, que es la prueba de que es latín', () => {
    let tot = 0, at = 0;
    for (const v of VERBOS_L1)
      for (const f of Object.values(paradigmaSubjuntivo(v))) { tot++; if ((TABLA[f]?.n ?? 0) > 0) at++; }
    expect(tot).toBe(VERBOS_L1.length * TIEMPOS_SUBJ.length * PERSONAS_SUBJ.length);
    expect(at / tot).toBeGreaterThan(0.3);
  });
});
