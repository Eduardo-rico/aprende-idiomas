// tests/unit/ortografia-la.test.ts
//
// La norma ortográfica del latín, con los casos que el gate DEBE cazar y
// —lo que importa más— con la trampa de la comparación probada en la
// dirección que la destapa.
import { describe, it, expect } from 'vitest';
import {
  canonicalLa, sinCantidad, comparaLa, textoParaVoz, acentoDe,
  densidadMacronPorDecimo, estadoMacron, revisarOrtografiaLa,
} from '@/lib/lang/ortografia-la';

describe('canonicalLa: unifica codificaciones, NO borra información', () => {
  it('funde el mácrón precompuesto y el descompuesto', () => {
    expect(canonicalLa('Rōma')).toBe(canonicalLa('Rōma'));
  });

  it('funde `j` con `i`, que es la convención del proyecto', () => {
    expect(canonicalLa('Iesus')).toBe(canonicalLa('Jesus'));
  });

  it('NO borra el mácrón: `mālus` y `malus` son palabras distintas', () => {
    // Manzano contra malo. Si esto se fundiera, la lengua perdería una
    // oposición fonémica dentro del propio canonicalizador.
    expect(canonicalLa('mālus')).not.toBe(canonicalLa('malus'));
    expect(canonicalLa('vēnit')).not.toBe(canonicalLa('venit'));
  });

  it('NO toca `u`/`v`, que no es decidible por regla', () => {
    // `uolo`→`volo` pero `suus` se queda: no hay regla, así que se exige
    // que la fuente venga con `v` y lo comprueba el gate.
    expect(canonicalLa('volo')).not.toBe(canonicalLa('uolo'));
  });
});

describe('comparaLa: la trampa de «la normalización tapa el rasgo»', () => {
  it('por defecto es INSENSIBLE al mácrón, que es lo que el alumno teclea', () => {
    expect(comparaLa('rosam', 'rosam')).toBe(true);
    expect(comparaLa('puellā', 'puella')).toBe(true);
    expect(comparaLa('Rōmā', 'roma')).toBe(true);
  });

  it('y en modo SENSIBLE **rechaza** la respuesta sin cantidad', () => {
    // Ésta es la aserción que importa, y va en la dirección que destapa
    // el fallo: comprobar que ACEPTA `mālus` pasaría igual estando rota.
    // Lo que sólo pasa si la vía sensible funciona es que RECHACE.
    expect(comparaLa('malus', 'mālus', { sensibleACantidad: true })).toBe(false);
    expect(comparaLa('venit', 'vēnit', { sensibleACantidad: true })).toBe(false);
    // Y sigue aceptando lo idéntico, claro.
    expect(comparaLa('mālus', 'mālus', { sensibleACantidad: true })).toBe(true);
  });

  it('un punto de cantidad comparado en modo por defecto NO PUEDE FALLAR — y por eso el modo existe', () => {
    // La demostración explícita del defecto: el mismo par, aprobado.
    expect(comparaLa('malus', 'mālus')).toBe(true);
  });
});

describe('textoParaVoz: lo que se ENVÍA no es lo que se muestra', () => {
  it('quita el mácrón, porque `ā` no existe en la ortografía italiana', () => {
    expect(textoParaVoz('Rōma')).toBe('roma');
  });

  it('respeliza los dos agujeros del G2P italiano', () => {
    // `caelum` = «chélum» sólo sale si la voz ve `ce`; el italiano no
    // tiene `ae`. Y `grātia` = «grátsia» sólo si ve `tsi`.
    expect(textoParaVoz('caelum')).toBe('celum');
    expect(textoParaVoz('grātia')).toBe('gratsia');
    expect(textoParaVoz('poena')).toBe('pena');
  });

  it('deja intacto lo que el italiano ya hace bien', () => {
    // gn = /ɲ/, sc+e = /ʃ/, c+i = /tʃ/, v = /v/: gratis.
    expect(textoParaVoz('agnus')).toBe('agnus');
    expect(textoParaVoz('descendit')).toBe('descendit');
    expect(textoParaVoz('Cicerō')).toBe('cicero');
    expect(textoParaVoz('vēnit')).toBe('venit');
  });

  it('es IDEMPOTENTE: aplicarlo dos veces da lo mismo', () => {
    // Importa porque el hash del audio se calcula sobre su salida: si no
    // fuera idempotente, un recálculo daría otro hash y todos los clips
    // saldrían caducos.
    for (const w of ['caelum', 'grātia', 'philosophia', 'Rōma', 'poena']) {
      expect(textoParaVoz(textoParaVoz(w))).toBe(textoParaVoz(w));
    }
  });
});

describe('el mácrón por DISTRIBUCIÓN, no por media', () => {
  const macronizado = 'Gallia est omnis dīvīsa in partēs trēs, quārum ūnam incolunt Belgae. '.repeat(20);
  const pelado = 'Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae. '.repeat(20);

  it('reconoce una pieza íntegramente macronizada', () => {
    expect(estadoMacron(macronizado)).toBe('integros');
  });

  it('retira una pieza sin mácrons', () => {
    expect(estadoMacron(pelado)).toBe('retirados');
  });

  it('CAZA la pieza a parches, que es el caso real de César', () => {
    // La forma de «De bello Gallico I» en la.wikisource: macronizado el
    // primer décimo y pelado el resto. La MEDIA de esa página es 1,8 % y
    // no describe ningún trozo del texto.
    const parches = macronizado + pelado.repeat(9);
    const d = densidadMacronPorDecimo(parches);
    expect(Math.max(...d)).toBeGreaterThan(10);
    expect(Math.min(...d)).toBe(0);
    expect(estadoMacron(parches)).toBe('retirados');
    const h = revisarOrtografiaLa(parches, { esPieza: true });
    expect(h.map((x) => x.clase)).toContain('macron-parcial');
  });
});

describe('el gate de escritura', () => {
  it('rechaza la `j` en contenido nuevo', () => {
    expect(revisarOrtografiaLa('Jesus dixit').map((x) => x.clase)).toContain('j-latina');
    expect(revisarOrtografiaLa('Iesus dixit')).toEqual([]);
  });

  it('rechaza un ítem de CANTIDAD que no lleva un solo mácrón', () => {
    // Un ítem cuyo punto es la cantidad y cuyo texto no la marca no puede
    // medir su punto, por muy bien escrito que esté. Es la familia de
    // «un ítem puede no medir su punto».
    expect(revisarOrtografiaLa('malus arbor est', { puntoDeCantidad: true }).map((x) => x.clase))
      .toContain('cantidad-sin-macron');
    expect(revisarOrtografiaLa('mālus arbor est', { puntoDeCantidad: true })).toEqual([]);
  });

  it('no marca prosa latina corriente y bien escrita', () => {
    expect(revisarOrtografiaLa('Gallia est omnis dīvīsa in partēs trēs.')).toEqual([]);
    expect(revisarOrtografiaLa('arma virumque canō')).toEqual([]);
  });
});

describe('el acento derivado, y el ejemplo comprobado CONTRA su regla', () => {
  it('deriva el acento de palabras macronizadas', () => {
    expect(acentoDe('amīcus')).toBe('llana');      // penúltima larga por naturaleza
    expect(acentoDe('dominus')).toBe('esdrujula'); // penúltima breve
    expect(acentoDe('rosa')).toBe('llana');        // bisílabo
    expect(acentoDe('rēx')).toBeNull();            // monosílabo
  });

  it('la larga POR POSICIÓN cuenta, y muta cum liquida NO', () => {
    expect(acentoDe('magister')).toBe('llana');    // «gis» cerrada por s
    expect(acentoDe('tenebrae')).toBe('esdrujula');// «br» no alarga
  });

  it('CAZA el ejemplo que refutaba su propia regla', () => {
    // El inventario daba «magistrī» como esdrújula para ilustrar la larga
    // por posición, y es LLANA justamente por esa regla: «gis» está
    // cerrada por s. Es la cuarta vez en una noche que un ejemplo
    // canónico refuta la regla que ilustra, y es lo primero que copia
    // quien escribe el punto siguiente — así que la comprobación se
    // mecaniza donde se puede, que es aquí.
    expect(acentoDe('magistrī')).toBe('llana');
    expect(acentoDe('magistrī')).not.toBe('esdrujula');
  });

  it('sin mácrons la respuesta es CONFIADA Y FALSA — y eso es el argumento de los mácrons', () => {
    // No es un defecto de la función: es la razón por la que el material
    // los lleva siempre. Se enseña en vez de esconderse.
    expect(acentoDe('amīcus')).toBe('llana');
    expect(acentoDe('amicus')).toBe('esdrujula');  // la misma palabra, sin marcar
    expect(acentoDe('amicus')).not.toBe(acentoDe('amīcus'));
  });
});
