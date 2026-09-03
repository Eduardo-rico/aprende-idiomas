// tests/unit/paradigma-la.test.ts
//
// LA MÁQUINA DE FORMAS DE L1, con los casos que su gate CAZÓ.
//
// En rumano una regla enunciada con la alternancia equivocada se replicó
// en cientos de formas generadas. La defensa aquí son tres comprobaciones
// y dos de ellas no consultan la máquina: la cantidad (contra un lexicón
// auditado por reflejos romances) y la atestación (contra 227.301 tokens
// de treebank, congelados en un JSON porque el corpus está gitignorado).
import { describe, it, expect } from 'vitest';
import { paradigmaNominal, paradigmaVerbal, declinar, conjugar } from '../../lib/data/languages/la/paradigma-la';
import { NOMBRES_L1, VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { revisarCantidad, auditarPorReflejos } from '../../lib/data/languages/la/cantidad';
import atestacion from '../../lib/data/languages/la/atestacion-l1.json';

const FILIUS = { lema: 'fīlius', genitivo: 'fīliī', genero: 'm' as const, glosa: 'hijo' };

describe('LO QUE EL GATE CAZÓ', () => {
  it('el vocativo de los -ius es `fīlī`, por CONTRACCIÓN, no `fīliī`', () => {
    // La primera versión devolvía `tema + ī` = `fīliī`, que además
    // colisiona con el genitivo. Lo destapó el gate de cantidad al
    // rechazar `fīlī` como forma que la máquina no producía.
    // Allen & Greenough §49.c. En el treebank: `fili` 13, `filie` 0.
    expect(declinar(FILIUS, 'voc', 'sg')).toBe('fīlī');
    expect(declinar(FILIUS, 'voc', 'sg')).not.toBe('fīliī');
    expect(declinar(FILIUS, 'voc', 'sg')).not.toBe('fīlie');
    // Y el genitivo sigue siendo el suyo: la colisión era el defecto.
    expect(declinar(FILIUS, 'gen', 'sg')).toBe('fīliī');
  });

  it('pero la excepción NO se sobregeneraliza a los comunes en -ius', () => {
    // «enunciar la regla sin acotar haría marcar como agramaticales
    // vocativos correctos». Los propios y `fīlius`/`genius`, nadie más.
    const gladius = { lema: 'gladius', genitivo: 'gladiī', genero: 'm' as const, glosa: 'espada' };
    expect(declinar(gladius, 'voc', 'sg')).toBe('gladie');
    const pomponius = { lema: 'Pompōnius', genitivo: 'Pompōniī', genero: 'm' as const, glosa: 'Pomponio' };
    expect(declinar(pomponius, 'voc', 'sg')).toBe('Pompōnī');
  });

  it('`revisarCantidad(\'puellā\')` NO puede rechazar el ablativo correcto', () => {
    // Regresión de un falso positivo que salió al construir la máquina: el
    // lexicón indexaba por la forma SIN mácrons y colapsaba el par que el
    // mácrón distingue. Un gate que rechaza latín correcto es peor que no
    // tenerlo.
    expect(revisarCantidad('puellā')).toEqual([]);
    expect(revisarCantidad('puella')).toEqual([]);
    expect(revisarCantidad('rosā')).toEqual([]);
  });

  it('y al ampliar lo aceptado SIGUE rechazando lo malo', () => {
    // La comprobación que hay que hacer siempre que un gate se afloja.
    for (const mala of ['amicus', 'āmīcus', 'amāt', 'audīt', 'Fīlīum', 'Filium', 'vōcat', 'poeta']) {
      expect(revisarCantidad(mala).map((x) => x.clase), mala).toContain('cantidad-erronea');
    }
  });
});

describe('la síncopa vive en el DATO, no en el código', () => {
  it('`puer/puerī` conserva la vocal y `ager/agrī` la pierde', () => {
    // Por eso la entrada es lema + GENITIVO: de «puer» no se deduce cuál
    // de los dos es. Es el punto `l2-genitivo-clave` hecho máquina.
    const puer = { lema: 'puer', genitivo: 'puerī', genero: 'm' as const, glosa: 'niño' };
    const ager = { lema: 'ager', genitivo: 'agrī', genero: 'm' as const, glosa: 'campo' };
    expect(declinar(puer, 'ac', 'sg')).toBe('puerum');
    expect(declinar(ager, 'ac', 'sg')).toBe('agrum');
    // Y el nominativo y el vocativo son el lema, sin desinencia.
    expect(declinar(ager, 'nom', 'sg')).toBe('ager');
    expect(declinar(ager, 'voc', 'sg')).toBe('ager');
  });

  it('el neutro iguala nominativo, acusativo y vocativo, y hace -a en plural', () => {
    const bellum = { lema: 'bellum', genitivo: 'bellī', genero: 'n' as const, glosa: 'guerra' };
    const p = paradigmaNominal(bellum);
    expect(p['nom.sg']).toBe('bellum');
    expect(p['ac.sg']).toBe('bellum');
    expect(p['voc.sg']).toBe('bellum');
    expect(p['nom.pl']).toBe('bella');
    expect(p['ac.pl']).toBe('bella');
  });
});

describe('el verbo, y la trampa de la vocal temática', () => {
  it('la temática se ABREVIA ante -t y -nt: `amat`, no `amāt`', () => {
    // El error típico del material generado, por analogía con el
    // infinitivo. Allen & Greenough §603.f, *brevis brevians*.
    const amo = { lema: 'amō', infinitivo: 'amāre', glosa: 'amar' };
    expect(conjugar(amo, '3sg')).toBe('amat');
    expect(conjugar(amo, '3pl')).toBe('amant');
    // Y donde SÍ es larga, lo es.
    expect(conjugar(amo, '2sg')).toBe('amās');
    expect(conjugar(amo, '1pl')).toBe('amāmus');
  });

  it('distingue la 3.ª de la 4.ª, que comparten la 3.ª sg', () => {
    const duco = { lema: 'dūcō', infinitivo: 'dūcere', glosa: 'guiar' };
    const audio = { lema: 'audiō', infinitivo: 'audīre', glosa: 'oír' };
    expect(conjugar(duco, '3sg')).toBe('dūcit');
    expect(conjugar(audio, '3sg')).toBe('audit');
    // La diferencia sale en el plural: -unt contra -iunt.
    expect(conjugar(duco, '3pl')).toBe('dūcunt');
    expect(conjugar(audio, '3pl')).toBe('audiunt');
  });
});

describe('los tres caminos sobre las 384 formas', () => {
  const todas = [
    ...NOMBRES_L1.flatMap((e) => Object.values(paradigmaNominal(e))),
    ...VERBOS_L1.flatMap((e) => Object.values(paradigmaVerbal(e))),
  ];

  it('la máquina genera 384 formas y ninguna falla la cantidad', () => {
    expect(todas).toHaveLength(384);
    for (const f of todas) expect(revisarCantidad(f), f).toEqual([]);
  });

  it('el lexicón concuerda con los reflejos romances, que no lo consultan', () => {
    expect(auditarPorReflejos()).toEqual([]);
  });

  it('ningún lema queda sin UNA sola forma atestiguada', () => {
    // Por FORMA sería ruidoso —66 de 384 no aparecen, y son regulares de
    // lemas atestiguados: `rēgīnam` no está en César ni en la Vulgata y no
    // por eso es incorrecta—. Por LEMA sí discrimina.
    const huerfanos = Object.entries(atestacion.lemas)
      .filter(([, celdas]) => Object.values(celdas).every((c) => c.n === 0))
      .map(([l]) => l);
    expect(huerfanos).toEqual([]);
  });

  it('la evidencia congelada NO se ha desincronizado de la máquina', () => {
    // El JSON se genera con `scripts/lectura/atestacion-l1.mjs`. Si la
    // máquina cambia y nadie lo regenera, la evidencia envejece en
    // silencio: es «el mismo dato vive en varios campos».
    for (const e of NOMBRES_L1) {
      const celdas = (atestacion.lemas as Record<string, Record<string, { forma: string }>>)[e.lema];
      expect(celdas, `${e.lema} no está en atestacion-l1.json`).toBeDefined();
      for (const [k, f] of Object.entries(paradigmaNominal(e))) {
        expect(celdas![k]?.forma, `${e.lema}.${k}`).toBe(f);
      }
    }
    expect(atestacion.tokens).toBe(227301);
  });
});
