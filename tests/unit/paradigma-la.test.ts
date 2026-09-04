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
import { paradigmaNominal, paradigmaVerbal, declinar, conjugar, todasLasFormas, declinacionDe, esMixta, infectum } from '../../lib/data/languages/la/paradigma-la';
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { revisarCantidad, auditarPorReflejos, revisarCoherenciaLexico, noContrastables } from '../../lib/data/languages/la/cantidad';
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

describe('la TERCERA, donde el nominativo es dato y no derivación', () => {
  const opus = { lema: 'opus', genitivo: 'operis', genero: 'n' as const, glosa: 'obra' };
  const rex = { lema: 'rēx', genitivo: 'rēgis', genero: 'm' as const, glosa: 'rey' };
  const urbs = { lema: 'urbs', genitivo: 'urbis', genero: 'f' as const, glosa: 'ciudad', iStem: true };
  const mare = { lema: 'mare', genitivo: 'maris', genero: 'n' as const, glosa: 'mar', iStem: true };

  it('el tema sale del genitivo y el nominativo del lema, porque no se deducen', () => {
    // `rēx` contra `rēg-`, `opus` contra `oper-`, `nōmen` contra `nōmin-`:
    // es `l2-genitivo-clave` en su forma más pura.
    expect(declinar(rex, 'ac', 'sg')).toBe('rēgem');
    expect(declinar(rex, 'nom', 'sg')).toBe('rēx');
    expect(declinar(opus, 'gen', 'sg')).toBe('operis');
    expect(declinar(opus, 'nom', 'pl')).toBe('opera');
  });

  it('el neutro iguala nominativo, acusativo y vocativo también aquí', () => {
    const p = paradigmaNominal(opus);
    expect([p['nom.sg'], p['ac.sg'], p['voc.sg']]).toEqual(['opus', 'opus', 'opus']);
    expect([p['nom.pl'], p['ac.pl']]).toEqual(['opera', 'opera']);
  });

  it('el tema en -i cambia tres celdas, y NO se deduce de la forma', () => {
    // `urbs/urbis` lo es y `rēx/rēgis` no, con el mismo aspecto: es dato.
    expect(declinar(urbs, 'gen', 'pl')).toBe('urbium');
    expect(declinar(rex, 'gen', 'pl')).toBe('rēgum');
    // y en los neutros toca además el ablativo singular y el plural
    expect(declinar(mare, 'abl', 'sg')).toBe('marī');
    expect(declinar(mare, 'nom', 'pl')).toBe('maria');
    expect(declinar(opus, 'abl', 'sg')).toBe('opere');
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

describe('los tres caminos sobre TODO lo que la máquina produce', () => {
  // `todasLasFormas` es la única fuente. El hueco se abrió TRES veces por
  // tener cada consumidor su propia lista: se añadieron los adjetivos y
  // luego el imperfecto y el futuro, y el comprobador de cantidad y el
  // congelador de atestación se quedaron atrás EN VERDE, porque nadie los
  // tocó. Este test es lo que impide la cuarta.
  const todas = todasLasFormas(NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1).map((x) => x.forma);

  it('ninguna forma que la máquina produce falla la cantidad', () => {
    expect(todas.length).toBeGreaterThan(700);
    for (const f of todas) expect(revisarCantidad(f), f).toEqual([]);
  });

  it('y el comprobador NO se ha aflojado hasta aceptarlo todo', () => {
    // La otra mitad, que hay que mirar siempre que un gate se ensancha. Y
    // con las dos clases separadas, que no son lo mismo: una forma con el
    // mácrón mal EXISTE y está mal marcada; una que la máquina no produce
    // sencillamente no existe. `dūcēbit` —lo que produce el alumno que
    // sobreaplica `-bi-`— es del segundo tipo, y mi primera aserción lo
    // pedía del primero.
    for (const mal_marcada of ['amāt', 'amicus', 'āmīcus', 'Filium']) {
      expect(revisarCantidad(mal_marcada).map((x) => x.clase), mal_marcada).toContain('cantidad-erronea');
    }
    for (const inexistente of ['dūcēbit', 'audiēbit', 'magisterum']) {
      expect(revisarCantidad(inexistente).map((x) => x.clase), inexistente).toContain('forma-desconocida');
    }
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

describe('dónde este gate NO puede medir, dicho en vez de pasado en verde', () => {
  it('nombra los lemas cuyo nominativo es dato y no derivación', () => {
    // Al añadir la 3.ª, `revisarCoherenciaLexico` pasó de contrastar todo a
    // contrastar la mitad SIN CAMBIAR DE COLOR: el nominativo de la 3.ª lo
    // pone el lema, así que compararlo con el lema es compararlo consigo
    // mismo. Un salto silencioso convierte un gate en decoración.
    expect(revisarCoherenciaLexico()).toEqual([]);
    // NO se fija el número: crece cada vez que entra un `-er` o un lema de
    // 3.ª, y reajustarlo a mano en cada lote convierte el test en un
    // trámite. Lo que importa es que los no contrastables sigan siendo la
    // minoría y que estén los que tienen que estar.
    expect(noContrastables).toContain('adulter');
    expect(noContrastables).toContain('rēx');
    expect(noContrastables).toContain('timor');
    expect(noContrastables.length / NOMBRES_L1.length).toBeLessThan(0.5);
    expect(noContrastables).toContain('rēx');
    expect(noContrastables).toContain('opus');
    expect(noContrastables).toContain('ager');
    // Y los que sí se contrastan siguen siendo la mayoría.
    expect(NOMBRES_L1.length - noContrastables.length).toBeGreaterThan(noContrastables.length);
  });
});

describe('TRES DEFECTOS QUE ESTABAN DORMIDOS', () => {
  // Los tres los encontró el latinista mirando la máquina AL REVÉS —qué le
  // falta para lo que el inventario declara— en vez de al derecho. Ninguno
  // había dado la cara porque ningún lote los había tocado todavía.

  it('D1 · la 5.ª declinación FABRICABA en silencio', () => {
    // `reī` acaba en `ī`, así que la clasificaba como 2.ª y derivaba
    // `*reus *reum *reō *reōs`. Y `reus` ES una palabra latina real —«el
    // acusado», 15 tokens— así que una comprobación por atestación habría
    // dicho que sí: el fallo que devuelve un número plausible.
    const res = { lema: 'rēs', genitivo: 'reī', genero: 'f' as const, glosa: 'cosa' };
    expect(declinacionDe(res)).toBe('5ª');
    expect(declinar(res, 'nom', 'sg')).toBe('rēs');
    expect(declinar(res, 'nom', 'sg')).not.toBe('reus');
    expect(declinar(res, 'ac', 'sg')).toBe('rem');
    expect(declinar(res, 'gen', 'pl')).toBe('rērum');
    // Y la 4.ª, que antes lanzaba, ahora declina.
    const manus = { lema: 'manus', genitivo: 'manūs', genero: 'f' as const, glosa: 'mano' };
    expect(declinacionDe(manus)).toBe('4ª');
    expect(declinar(manus, 'dat', 'sg')).toBe('manuī');
    expect(declinar(manus, 'gen', 'pl')).toBe('manuum');
  });

  it('D2 · la conjugación mixta no faltaba: SALÍA MAL', () => {
    // `capere` acaba en `-ere`, así que iba a la 3.ª pura y daba `*capō`,
    // `*capunt`. En el treebank: `capō` 0, `capunt` 0, `faciō` 35,
    // `faciunt` 34 — y `faciō` es el lema n.º 19 del corpus.
    const capio = { lema: 'capiō', infinitivo: 'capere', glosa: 'coger' };
    expect(esMixta(capio)).toBe(true);
    expect(conjugar(capio, '1sg')).toBe('capiō');
    expect(conjugar(capio, '3pl')).toBe('capiunt');
    expect(conjugar(capio, '3pl')).not.toBe('capunt');
    expect(conjugar(capio, '3sg', 'imperfecto')).toBe('capiēbat');
    // Y la 3.ª PURA no cambia: se reconoce por el lema en -iō, no por el
    // infinitivo, porque el infinitivo de las dos es el mismo.
    const duco = { lema: 'dūcō', infinitivo: 'dūcere', glosa: 'guiar' };
    expect(esMixta(duco)).toBe(false);
    expect(conjugar(duco, '3pl')).toBe('dūcunt');
  });

  it('D3 · el infinitivo existía en el tipo y NUNCA se emitía', () => {
    // `conjugacionDe` lo leía, pero `infectum` no lo sacaba, así que el
    // gate de cantidad —que se construye desde la máquina— rechazaba las
    // cuatro segundas partes. Y el punto `l5-conjugacion-por-infinitivo`
    // ES reconocer la conjugación por ellas.
    for (const f of ['amāre', 'vidēre', 'dūcere', 'audīre', 'esse']) {
      expect(revisarCantidad(f), f).toEqual([]);
    }
    expect(infectum({ lema: 'amō', infinitivo: 'amāre', glosa: 'amar' }).infinitivo).toBe('amāre');
  });

  it('y un genitivo que no es de ninguna de las cinco LANZA, no fabrica', () => {
    expect(() => declinacionDe({ lema: 'x', genitivo: 'xyz', genero: 'm', glosa: '' })).toThrow(/ninguna de las cinco/);
  });
});
