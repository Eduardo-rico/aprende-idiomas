// tests/unit/transformacion-ro.test.ts — LA MÁQUINA NUEVA, VISTA EN ROJO.
//
// Regla del proyecto que este fichero ejerce: **un gate visto sólo en
// verde no está probado.** Tres gates nuevos dieron 4, 26 y 21 hallazgos
// FALSOS antes de los buenos, y un gate puede estar MUERTO en vez de
// invertido —el lote imprime «Limpio» exactamente igual— porque su
// condición es inalcanzable (§4.18). Así que cada gate va aquí con DOS
// casos: el ítem que lo suspende y el ítem que lo pasa. Sin el segundo no
// se sabe si el gate discrimina o si marca todo; sin el primero no se sabe
// si dispara alguna vez.
//
// Y el testigo de cada gate lleva **un solo defecto**: si llevara dos, no
// se sabría cuál de los dos lo suspendió (§0.8).
import { describe, it, expect } from 'vitest';
import {
  verificar, verificarLote, correr, edicion, piezasInvariantes, comprobarEnCorpus,
  COPIAR, COPIAR_LA_FRASE, EDICION_MODAL, distancia, contrasteMinimo,
  type ItemTransRo, type JuiciosLote, type Comprobacion, type Opciones,
} from '../../scripts/lib/transformacion-ro';

const JUICIOS: JuiciosLote = {
  copia: 'Uno de los ítems se contesta copiando el foco, y tiene que estar: sin él el lote deja la regularidad «la forma siempre cambia», que es otra estrategia gratis.',
  frontera: 'La frontera es el verbo cuyo imperativo COINCIDE con el presente, donde sobreaplicar «cambia la forma» da una forma inexistente.',
  varianza: 'La pieza `-tu` es invariante y es de la LENGUA: el imperativo rumano no lleva pronombre sujeto. Lo que varía es la forma del verbo.',
};

/** Las afirmaciones del lote de prueba, ejecutables contra el corpus. Sin
 *  al menos una, el lote no sale: un motivo escrito garantiza presencia,
 *  nunca verdad. */
const COMPROBACIONES: Comprobacion[] = [
  { afirmacion: 'el imperativo «vino» se usa', patron: 'vino', espera: 'presente' },
];
const OP: Opciones = { juicios: JUICIOS, comprobaciones: COMPROBACIONES };

/** Un lote base SANO, con estrategias mezcladas a propósito: dos ediciones
 *  distintas, un ítem que se contesta copiando y un espejo. */
const BASE: ItemTransRo[] = [
  { p: 'x', pasada: 1, s: 'Tu citești ziarul în fiecare zi.', instruccion: 'Dale esa orden a tu amigo, hablándole de tú.', r: 'Citește ziarul!', foco: 'citești', nucleo: 'citește', espejoEs: false, transparenteLatin: false },
  { p: 'x', pasada: 1, s: 'Tu vii mâine la mine.', instruccion: 'Dale esa orden a tu amigo, hablándole de tú.', r: 'Vino mâine la mine!', foco: 'vii', nucleo: 'vino', espejoEs: false, transparenteLatin: false },
  { p: 'x', pasada: 1, s: 'Tu faci temele seara.', instruccion: 'Dale esa orden a tu amigo, hablándole de tú.', r: 'Fă temele seara!', foco: 'faci', nucleo: 'fă', espejoEs: false, transparenteLatin: false },
  { p: 'x', pasada: 1, s: 'Tu mergi acasă acum.', instruccion: 'Dale esa orden a tu amigo, hablándole de tú.', r: 'Mergi acasă acum!', foco: 'mergi', nucleo: 'mergi', espejoEs: true, transparenteLatin: false, sobreaplicacion: true },
];

const con = (i: number, patch: Partial<ItemTransRo>): ItemTransRo[] =>
  BASE.map((x, k) => (k === i ? { ...x, ...patch } : x));

describe('transformación RO · los gates por ítem, en rojo y en verde', () => {
  it('el lote base sale LIMPIO — sin esto, cualquier rojo de abajo puede ser ruido', () => {
    expect(verificar(BASE, OP)).toEqual([]);
  });

  it('el foco tiene que estar en la FUENTE', () => {
    expect(verificar(con(0, { foco: 'scrii' }), OP).join()).toMatch(/el foco «scrii» no está en la fuente/);
    expect(verificar(BASE, OP)).toEqual([]);
  });

  it('el núcleo tiene que estar en la RESPUESTA', () => {
    expect(verificar(con(0, { nucleo: 'scrie' }), OP).join()).toMatch(/el núcleo «scrie» no está en la respuesta/);
    expect(verificar(BASE, OP)).toEqual([]);
  });

  it('la respuesta no puede ser la fuente', () => {
    const roto = con(1, { r: 'Tu vii mâine la mine.', nucleo: 'vii' });
    expect(verificar(roto, OP).join()).toMatch(/idéntica a la fuente/);
  });

  // EL GATE DEL §4.13bis: si la frase ya contiene una copia del rasgo que
  // pides, el ítem se contesta copiando. Lo que NO puede hacer es marcar
  // el ítem cuya respuesta correcta ES no tocar nada: ése es legítimo y
  // lo juzga el lote, no el ítem.
  it('el núcleo escrito en la fuente FUERA del foco es una fuga…', () => {
    const roto = con(1, { s: 'Tu vii mâine, dar vino acum!', foco: 'vii', nucleo: 'vino' });
    expect(verificar(roto, OP).join()).toMatch(/ya está escrito en la fuente fuera del foco/);
  });

  it('…y el ítem que se contesta copiando NO se marca como fuga: lo juzga el lote', () => {
    // `Mergi acasă acum.` → `Mergi acasă acum!`: el núcleo está en la
    // fuente porque ES el foco. Si el gate lo marcara, el lote no podría
    // tener nunca el ítem de la frontera, y prohibirlo dejaría la
    // constante «la forma siempre cambia».
    expect(verificar(BASE, OP).filter((s) => /fuga|fuera del foco/.test(s))).toEqual([]);
  });

  // EL GATE PROPIO DEL FORMATO: la consigna va en ESPAÑOL, y nadie la lee
  // con ojos de rumano.
  it('la INSTRUCCIÓN no puede deletrear el núcleo', () => {
    expect(verificar(con(1, { instruccion: 'Dale la orden usando la forma «vino».' }), OP).join())
      .toMatch(/la instrucción deletrea el núcleo «vino»/);
    expect(verificar(BASE, OP)).toEqual([]);
  });

  it('la instrucción tampoco puede traer OTRA palabra de la respuesta que no esté en la fuente', () => {
    // El núcleo no es la única fuga posible: una consigna que adelante
    // cualquier palabra que el alumno tiene que producir hace el trabajo.
    const roto = con(1, { r: 'Vino mâine devreme!', nucleo: 'vino', instruccion: 'Dale la orden y añade «devreme» al final.' });
    expect(verificar(roto, OP).join()).toMatch(/contiene «devreme», que es de la respuesta/);
  });

  it('la PISTA se mide igual que la instrucción', () => {
    expect(verificar(con(1, { hint: 'la forma es vino' }), OP).join()).toMatch(/la pista deletrea el núcleo/);
    expect(verificar(con(1, { hint: 'es una forma irregular' }), OP)).toEqual([]);
  });

  it('una consigna demasiado corta no determina la salida', () => {
    expect(verificar(con(0, { instruccion: 'Ordénalo.' }), OP).join()).toMatch(/demasiado corta/);
  });

  it('la fuente no se repite dentro del lote', () => {
    expect(verificar(con(1, { s: 'Tu citești ziarul în fiecare zi.', foco: 'citești', nucleo: 'vino' }), OP).join())
      .toMatch(/fuente repetida/);
  });

  it('una alternativa igual a la respuesta es ruido que finge holgura', () => {
    expect(verificar(con(0, { alt: ['Citește ziarul!'] }), OP).join()).toMatch(/es la respuesta/);
    expect(verificar(con(0, { alt: ['Să citești ziarul!'] }), OP)).toEqual([]);
  });

  it('la ortografía DOOM3 se revisa sobre lo que se publica', () => {
    // «citeşti» con cedilla (U+015F), que es la clase que el proyecto
    // canonicaliza en la entrada y prohíbe en el contenido.
    expect(verificar(con(0, { s: 'Tu citeşti ziarul în fiecare zi.', foco: 'citeşti' }), OP).join())
      .toMatch(/ortografía \(cedilla\)/);
  });
});

describe('transformación RO · los gates DE LOTE, que son la razón de esta máquina', () => {
  // La lección literal del latín de este repo: vetar un orden en CADA
  // ítem hizo que «invierte los dos nombres» acertara 12 de 12 con el
  // gate en cero hallazgos. Un gate por ítem vuelve la propiedad
  // CONSTANTE, y una constante es una estrategia gratis.
  it('ROJO: si todos los ítems aplican la MISMA edición, la moda del lote acierta sola', () => {
    const uniforme: ItemTransRo[] = [
      { ...BASE[0]!, s: 'Tu citești ziarul.', r: 'Citește ziarul!', foco: 'citești', nucleo: 'citește' },
      { ...BASE[1]!, s: 'Tu vorbești încet.', r: 'Vorbește încet!', foco: 'vorbești', nucleo: 'vorbește' },
      { ...BASE[2]!, s: 'Tu privești atent.', r: 'Privește atent!', foco: 'privești', nucleo: 'privește' },
      { ...BASE[3]!, s: 'Tu gândești greșit.', r: 'Gândește greșit!', foco: 'gândești', nucleo: 'gândește' },
    ];
    expect(correr(EDICION_MODAL, uniforme).aciertos).toBe(4);
    expect(verificarLote(uniforme, OP).join()).toMatch(/ESTRATEGIA GRATIS «edición-modal-del-lote»: acierta 4\/4/);
  });

  it('VERDE: el lote base mezcla ediciones y la moda no pasa del tope', () => {
    expect(correr(EDICION_MODAL, BASE).aciertos / BASE.length).toBeLessThanOrEqual(0.5);
    expect(verificarLote(BASE, OP).filter((s) => /edición-modal/.test(s))).toEqual([]);
  });

  it('ROJO: si copiar el foco acierta la mayoría, el lote no examina nada', () => {
    const copiones = BASE.map((x) => ({ ...x, nucleo: x.foco, r: x.s.replace('.', '!').replace(/^Tu /, '') }));
    expect(correr(COPIAR, copiones).aciertos).toBe(4);
    expect(verificarLote(copiones, OP).join()).toMatch(/ESTRATEGIA GRATIS «copiar-el-foco»/);
  });

  it('VERDE: un solo ítem de copia sobre cuatro pasa, y es el que hace falta', () => {
    expect(correr(COPIAR, BASE).aciertos).toBe(1);
    expect(verificarLote(BASE, OP).filter((s) => /copiar-el-foco/.test(s))).toEqual([]);
  });

  it('ROJO y VERDE: el atajo de traducción se declara y se mide en el lote', () => {
    const espejos = BASE.map((x) => ({ ...x, espejoEs: true }));
    expect(verificarLote(espejos, OP).join()).toMatch(/traducir del español.*4\/4/);
    expect(verificarLote(BASE, OP).filter((s) => /traducir del español/.test(s))).toEqual([]);
  });

  it('ROJO y VERDE: la raíz románica, igual', () => {
    const latinos = BASE.map((x) => ({ ...x, transparenteLatin: true }));
    expect(verificarLote(latinos, OP).join()).toMatch(/la raíz románica.*4\/4/);
    expect(verificarLote(BASE, OP).filter((s) => /raíz románica/.test(s))).toEqual([]);
  });

  // LA SEÑAL ES NECESARIA Y NO SUFICIENTE: no bloquea, exige juicio
  // escrito que NOMBRE la pieza. Es la forma del `pisoCero` y la de la
  // cuarentena: el invariante no es un número, es «cero señales sin
  // motivo escrito».
  it('la pieza invariante se detecta y exige que el juicio la nombre', () => {
    expect(piezasInvariantes(BASE).map(([p]) => p)).toContain('-tu');
    const mudo = { ...JUICIOS, varianza: 'Varía la forma del verbo, que es lo que el punto enseña, y por eso el lote está bien.' };
    expect(verificarLote(BASE, { ...OP, juicios: mudo }).join()).toMatch(/VARIANZA: la pieza «-tu»/);
    // Y con el juicio que la nombra, calla: el gate pide juicio, no
    // ausencia de invariancia — en `r3-negacion-antepuesta` la
    // invariancia era de la LENGUA y el punto salía legítimo.
    expect(verificarLote(BASE, OP).filter((s) => /VARIANZA/.test(s))).toEqual([]);
  });

  it('los tres juicios son obligatorios, y «vacío» no es «limpio»', () => {
    const sin = verificarLote(BASE, { ...OP, juicios: { copia: '', frontera: '', varianza: '' } }).join();
    expect(sin).toMatch(/JUICIO AUSENTE «copia»/);
    expect(sin).toMatch(/JUICIO AUSENTE «varianza»/);
    expect(sin).toMatch(/JUICIO AUSENTE «frontera»/);
  });

  it('sin ítem de sobreaplicación, el lote exige que se escriba por qué no lo hay', () => {
    const sinFrontera = BASE.map((x) => ({ ...x, sobreaplicacion: false }));
    expect(verificarLote(sinFrontera, OP).join()).toMatch(/ningún ítem declara `sobreaplicacion`/);
    // Y la salida honesta existe: declararlo por escrito, como hace
    // `r3-negacion-antepuesta`, donde la regla no tiene contexto negativo.
    const declarado = { ...JUICIOS, frontera: 'SIN FRONTERA: en rumano no hay imperativo afirmativo que admita el pronombre sujeto, así que la regla no tiene contexto donde no se aplique.' };
    expect(verificarLote(sinFrontera, { ...OP, juicios: declarado }).filter((s) => /FRONTERA/.test(s))).toEqual([]);
  });

  // LA ESTRATEGIA QUE EL GATE NO VEÍA. `copiar-el-foco` compara contra el
  // NÚCLEO, o sea una palabra; la que de verdad amenaza produce la FRASE
  // ENTERA. Sin el campo `objetivo` no se puede escribir, y sin poder
  // escribirla no se puede ejecutar.
  it('una estrategia con objetivo «respuesta» se compara contra la frase entera', () => {
    const copiones = BASE.map((x) => ({ ...x, r: x.s }));
    // Ojo: con `r === s` salta además el gate de «respuesta idéntica a la
    // fuente», así que aquí se mira SÓLO el conteo de la estrategia.
    expect(correr(COPIAR_LA_FRASE, copiones).aciertos).toBe(4);
    expect(correr(COPIAR_LA_FRASE, BASE).aciertos).toBe(0);
  });

  it('y usa la comparación DEL PRODUCTO: el punto final donde la clave lleva admiración', () => {
    // Si la máquina comparara con una regla propia más estricta que la
    // tarjeta, mediría una estrategia que el alumno no tiene — y al revés,
    // dejaría pasar la que sí tiene. `Tu mergi acasă acum.` produce
    // `Mergi acasă acum.`, que la tarjeta ACEPTA contra `Mergi acasă acum!`.
    const sinPronombre = { nombre: 'sin-pronombre', objetivo: 'respuesta' as const, aplicar: (x: { s: string }) => x.s.replace(/^Tu /, '') };
    expect(correr(sinPronombre, BASE).aciertos).toBe(1);
    expect(correr(sinPronombre, BASE).sobre).toEqual(['Tu mergi acasă acum.']);
  });

  it('una estrategia PROPIA del punto se corre igual que las de serie', () => {
    // «Al cerrar una estrategia, pregunta qué regularidad deja el cierre y
    // comprueba la nueva EJECUTÁNDOLA»: para eso el lote pasa las suyas.
    const siempreVino = { nombre: 'poner-siempre-vino', aplicar: () => 'vino' };
    expect(verificarLote(BASE, { ...OP, estrategias: [siempreVino] })).toEqual([]);
    const todosVino = BASE.map((x) => ({ ...x, nucleo: 'vino', r: 'Vino acum!' }));
    expect(verificarLote(todosVino, { ...OP, estrategias: [siempreVino] }).join())
      .toMatch(/ESTRATEGIA GRATIS «poner-siempre-vino»/);
  });
});

// EL FALLO PROPIO QUE DESTAPÓ EL ESTRENO, y por qué el arreglo es de
// TIPO y no de norma. La primera estrategia escrita para el lote 23
// —«cambiar siempre la forma»— devolvía `x.nucleo`: acertaba 5 de 8 y no
// medía nada, porque leía la respuesta y se daba la razón a sí misma. Es
// el gate cómplice del §4.7 con el signo cambiado.
describe('transformación RO · una estrategia no puede leer la respuesta', () => {
  it('la vista del ítem actual NO trae ni `r` ni `nucleo`', () => {
    let visto: Record<string, unknown> = {};
    correr({ nombre: 'espía', aplicar: (x) => { visto = x as Record<string, unknown>; return null; } }, BASE);
    // El invariante estructural: lo que el alumno ve. Si mañana alguien
    // añade la respuesta a la `Vista`, este test cae.
    // La vista se CONSTRUYE en `correr`: no es el ítem con un tipo más
    // estrecho, porque un `as` lo saltaría. Lo que no está en el objeto
    // no se lee ni haciendo trampa.
    expect(Object.keys(visto).sort()).toEqual(['foco', 'hint', 'instruccion', 's']);
    expect(visto.r).toBeUndefined();
    expect(visto.nucleo).toBeUndefined();
  });

  it('la edición modal es LEAVE-ONE-OUT: un ítem no se cuenta a sí mismo', () => {
    // Sin dejar fuera el propio ítem, un lote de dos con ediciones
    // distintas se acertaría a sí mismo por empate. El alumno ha visto la
    // corrección de los OTROS, no la del que tiene delante.
    const dos: ItemTransRo[] = [
      { ...BASE[0]!, s: 'Citești ziarul.', r: 'Citește ziarul!', foco: 'citești', nucleo: 'citește' },
      { ...BASE[1]!, s: 'Vii mâine.', r: 'Vino mâine!', foco: 'vii', nucleo: 'vino' },
    ];
    // Cada uno ve SÓLO la edición del otro, y ninguna se le aplica bien.
    expect(correr(EDICION_MODAL, dos).aciertos).toBe(0);
  });
});

// EL GATE QUE NACE DEL FALLO DEL ESTRENO. El de varianza exige motivo
// ESCRITO y aceptó uno FALSO igual que uno verdadero, porque comprueba
// que el texto nombre la pieza y no que sea cierto. El testigo rojo de
// aquí **es el hallazgo entero**, no una muestra de él: la afirmación
// literal que se publicó y la frase que la refuta.
// EL CONTRASTE DE UNA LETRA. Medido sobre el lexicón antes de escribir el
// gate: entre la 3.ª sg y el infinitivo corto, 18 de 43 verbos rumanos se
// separan por una letra o menos. Un ítem así puede estar impecable y medir
// la ortografía de la `ă` final en vez de la casilla.
describe('transformación RO · el contraste que es ortográfico y no morfológico', () => {
  it('ROJO: un lote entero de pares de una letra no mide la casilla', () => {
    const ortograficos: ItemTransRo[] = [
      { ...BASE[0]!, s: 'El cântă bine.', r: 'Nu cânta bine!', foco: 'cântă', nucleo: 'cânta' },
      { ...BASE[1]!, s: 'El intră acum.', r: 'Nu intra acum!', foco: 'intră', nucleo: 'intra' },
      { ...BASE[2]!, s: 'El termină azi.', r: 'Nu termina azi!', foco: 'termină', nucleo: 'termina' },
      { ...BASE[3]!, s: 'El dă bani.', r: 'Nu da bani!', foco: 'dă', nucleo: 'da' },
    ];
    expect(contrasteMinimo(ortograficos)).toHaveLength(4);
    expect(verificarLote(ortograficos, OP).join()).toMatch(/CONTRASTE MÍNIMO: 4\/4/);
  });

  it('VERDE: el lote base contrasta por algo más que una letra', () => {
    // `citești`→`citește` es una letra… y por eso el gate cuenta y sólo
    // tumba cuando es la MAYORÍA: un par mínimo a propósito es legítimo.
    expect(contrasteMinimo(BASE).length).toBeLessThanOrEqual(2);
    expect(verificarLote(BASE, OP).filter((x) => /CONTRASTE MÍNIMO/.test(x))).toEqual([]);
  });

  it('la distancia NO ignora los diacríticos: aquí el diacrítico es lo que se mide', () => {
    // Si se normalizaran, `cântă`/`cânta` daría 0 y el gate no vería nada.
    expect(distancia('cântă', 'cânta')).toBe(1);
    expect(distancia('citește', 'citi')).toBeGreaterThan(1);
    expect(distancia('mergi', 'mergi')).toBe(0);
  });
});

describe('transformación RO · las afirmaciones se EJECUTAN contra el corpus', () => {
  it('ROJO: la afirmación falsa del lote 23, tal cual, con el corpus delante', () => {
    const falsa: Comprobacion = {
      afirmacion: 'el imperativo rumano no admite pronombre sujeto antepuesto',
      patron: 'tu vino', espera: 'ausente',
    };
    const { problemas } = comprobarEnCorpus([falsa]);
    expect(problemas.join()).toMatch(/AFIRMACIÓN REFUTADA.*«tu vino» aparece 3 veces/);
  });

  it('VERDE: la misma afirmación, dicha bien, no la refuta el corpus', () => {
    // La verdad es que el imperativo NO MARCADO no lleva sujeto expreso, y
    // el expreso es contrastivo. Puesta como forma que de verdad no
    // existe, el corpus calla — y callar no es demostrar.
    const { problemas, lineas } = comprobarEnCorpus([
      { afirmacion: 'no existe *tu vino cu tine', patron: 'tu vino cu tine', espera: 'ausente' },
    ]);
    expect(problemas).toEqual([]);
    // Y lo dice en voz alta en vez de dar un visto bueno que nadie ganó.
    expect(lineas.join()).toMatch(/la ausencia no prohíbe/);
  });

  it('ROJO: una afirmación de atestación que el corpus no encuentra tampoco pasa', () => {
    const { problemas } = comprobarEnCorpus([
      { afirmacion: 'inventada', patron: 'zzqxk', espera: 'presente' },
    ]);
    expect(problemas.join()).toMatch(/AFIRMACIÓN REFUTADA.*no aparece ni una vez/);
  });

  it('un lote sin NINGUNA comprobación no se publica', () => {
    expect(verificarLote(BASE, { juicios: JUICIOS }).join()).toMatch(/COMPROBACIÓN AUSENTE/);
    expect(verificarLote(BASE, OP).filter((x) => /COMPROBACIÓN/.test(x))).toEqual([]);
  });
});

describe('transformación RO · la edición, que es de lo que cuelgan las estrategias', () => {
  it('extrae el sufijo que se quita y el que se pone, DESDE EL PREFIJO COMÚN', () => {
    // «citești»/«citește» comparten «citest» una vez normalizados, así que
    // la edición es `i → e` y no `ti → te`: la moda del lote se cuenta
    // sobre la edición MÍNIMA, que es la que el alumno generaliza.
    expect(edicion('citești', 'citește')).toEqual({ quita: 'i', pone: 'e' });
    expect(edicion('mergi', 'mergi')).toEqual({ quita: '', pone: '' });
  });
  it('normaliza los diacríticos: si no, «fă» y «fa» serían ediciones distintas y la moda se dispersaría', () => {
    expect(edicion('faci', 'fă')).toEqual({ quita: 'ci', pone: '' });
  });
});
