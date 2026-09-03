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
  verificar, verificarLote, correr, edicion, piezasInvariantes,
  COPIAR, EDICION_MODAL, type ItemTransRo, type JuiciosLote,
} from '../../scripts/lib/transformacion-ro';

const JUICIOS: JuiciosLote = {
  copia: 'Uno de los ítems se contesta copiando el foco, y tiene que estar: sin él el lote deja la regularidad «la forma siempre cambia», que es otra estrategia gratis.',
  frontera: 'La frontera es el verbo cuyo imperativo COINCIDE con el presente, donde sobreaplicar «cambia la forma» da una forma inexistente.',
  varianza: 'La pieza `-tu` es invariante y es de la LENGUA: el imperativo rumano no lleva pronombre sujeto. Lo que varía es la forma del verbo.',
};

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
    expect(verificar(BASE, { juicios: JUICIOS })).toEqual([]);
  });

  it('el foco tiene que estar en la FUENTE', () => {
    expect(verificar(con(0, { foco: 'scrii' }), { juicios: JUICIOS }).join()).toMatch(/el foco «scrii» no está en la fuente/);
    expect(verificar(BASE, { juicios: JUICIOS })).toEqual([]);
  });

  it('el núcleo tiene que estar en la RESPUESTA', () => {
    expect(verificar(con(0, { nucleo: 'scrie' }), { juicios: JUICIOS }).join()).toMatch(/el núcleo «scrie» no está en la respuesta/);
    expect(verificar(BASE, { juicios: JUICIOS })).toEqual([]);
  });

  it('la respuesta no puede ser la fuente', () => {
    const roto = con(1, { r: 'Tu vii mâine la mine.', nucleo: 'vii' });
    expect(verificar(roto, { juicios: JUICIOS }).join()).toMatch(/idéntica a la fuente/);
  });

  // EL GATE DEL §4.13bis: si la frase ya contiene una copia del rasgo que
  // pides, el ítem se contesta copiando. Lo que NO puede hacer es marcar
  // el ítem cuya respuesta correcta ES no tocar nada: ése es legítimo y
  // lo juzga el lote, no el ítem.
  it('el núcleo escrito en la fuente FUERA del foco es una fuga…', () => {
    const roto = con(1, { s: 'Tu vii mâine, dar vino acum!', foco: 'vii', nucleo: 'vino' });
    expect(verificar(roto, { juicios: JUICIOS }).join()).toMatch(/ya está escrito en la fuente fuera del foco/);
  });

  it('…y el ítem que se contesta copiando NO se marca como fuga: lo juzga el lote', () => {
    // `Mergi acasă acum.` → `Mergi acasă acum!`: el núcleo está en la
    // fuente porque ES el foco. Si el gate lo marcara, el lote no podría
    // tener nunca el ítem de la frontera, y prohibirlo dejaría la
    // constante «la forma siempre cambia».
    expect(verificar(BASE, { juicios: JUICIOS }).filter((s) => /fuga|fuera del foco/.test(s))).toEqual([]);
  });

  // EL GATE PROPIO DEL FORMATO: la consigna va en ESPAÑOL, y nadie la lee
  // con ojos de rumano.
  it('la INSTRUCCIÓN no puede deletrear el núcleo', () => {
    expect(verificar(con(1, { instruccion: 'Dale la orden usando la forma «vino».' }), { juicios: JUICIOS }).join())
      .toMatch(/la instrucción deletrea el núcleo «vino»/);
    expect(verificar(BASE, { juicios: JUICIOS })).toEqual([]);
  });

  it('la instrucción tampoco puede traer OTRA palabra de la respuesta que no esté en la fuente', () => {
    // El núcleo no es la única fuga posible: una consigna que adelante
    // cualquier palabra que el alumno tiene que producir hace el trabajo.
    const roto = con(1, { r: 'Vino mâine devreme!', nucleo: 'vino', instruccion: 'Dale la orden y añade «devreme» al final.' });
    expect(verificar(roto, { juicios: JUICIOS }).join()).toMatch(/contiene «devreme», que es de la respuesta/);
  });

  it('la PISTA se mide igual que la instrucción', () => {
    expect(verificar(con(1, { hint: 'la forma es vino' }), { juicios: JUICIOS }).join()).toMatch(/la pista deletrea el núcleo/);
    expect(verificar(con(1, { hint: 'es una forma irregular' }), { juicios: JUICIOS })).toEqual([]);
  });

  it('una consigna demasiado corta no determina la salida', () => {
    expect(verificar(con(0, { instruccion: 'Ordénalo.' }), { juicios: JUICIOS }).join()).toMatch(/demasiado corta/);
  });

  it('la fuente no se repite dentro del lote', () => {
    expect(verificar(con(1, { s: 'Tu citești ziarul în fiecare zi.', foco: 'citești', nucleo: 'vino' }), { juicios: JUICIOS }).join())
      .toMatch(/fuente repetida/);
  });

  it('una alternativa igual a la respuesta es ruido que finge holgura', () => {
    expect(verificar(con(0, { alt: ['Citește ziarul!'] }), { juicios: JUICIOS }).join()).toMatch(/es la respuesta/);
    expect(verificar(con(0, { alt: ['Să citești ziarul!'] }), { juicios: JUICIOS })).toEqual([]);
  });

  it('la ortografía DOOM3 se revisa sobre lo que se publica', () => {
    // «citeşti» con cedilla (U+015F), que es la clase que el proyecto
    // canonicaliza en la entrada y prohíbe en el contenido.
    expect(verificar(con(0, { s: 'Tu citeşti ziarul în fiecare zi.', foco: 'citeşti' }), { juicios: JUICIOS }).join())
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
    expect(verificarLote(uniforme, { juicios: JUICIOS }).join()).toMatch(/ESTRATEGIA GRATIS «edición-modal-del-lote»: acierta 4\/4/);
  });

  it('VERDE: el lote base mezcla ediciones y la moda no pasa del tope', () => {
    expect(correr(EDICION_MODAL, BASE).aciertos / BASE.length).toBeLessThanOrEqual(0.5);
    expect(verificarLote(BASE, { juicios: JUICIOS }).filter((s) => /edición-modal/.test(s))).toEqual([]);
  });

  it('ROJO: si copiar el foco acierta la mayoría, el lote no examina nada', () => {
    const copiones = BASE.map((x) => ({ ...x, nucleo: x.foco, r: x.s.replace('.', '!').replace(/^Tu /, '') }));
    expect(correr(COPIAR, copiones).aciertos).toBe(4);
    expect(verificarLote(copiones, { juicios: JUICIOS }).join()).toMatch(/ESTRATEGIA GRATIS «copiar-el-foco»/);
  });

  it('VERDE: un solo ítem de copia sobre cuatro pasa, y es el que hace falta', () => {
    expect(correr(COPIAR, BASE).aciertos).toBe(1);
    expect(verificarLote(BASE, { juicios: JUICIOS }).filter((s) => /copiar-el-foco/.test(s))).toEqual([]);
  });

  it('ROJO y VERDE: el atajo de traducción se declara y se mide en el lote', () => {
    const espejos = BASE.map((x) => ({ ...x, espejoEs: true }));
    expect(verificarLote(espejos, { juicios: JUICIOS }).join()).toMatch(/traducir del español.*4\/4/);
    expect(verificarLote(BASE, { juicios: JUICIOS }).filter((s) => /traducir del español/.test(s))).toEqual([]);
  });

  it('ROJO y VERDE: la raíz románica, igual', () => {
    const latinos = BASE.map((x) => ({ ...x, transparenteLatin: true }));
    expect(verificarLote(latinos, { juicios: JUICIOS }).join()).toMatch(/la raíz románica.*4\/4/);
    expect(verificarLote(BASE, { juicios: JUICIOS }).filter((s) => /raíz románica/.test(s))).toEqual([]);
  });

  // LA SEÑAL ES NECESARIA Y NO SUFICIENTE: no bloquea, exige juicio
  // escrito que NOMBRE la pieza. Es la forma del `pisoCero` y la de la
  // cuarentena: el invariante no es un número, es «cero señales sin
  // motivo escrito».
  it('la pieza invariante se detecta y exige que el juicio la nombre', () => {
    expect(piezasInvariantes(BASE).map(([p]) => p)).toContain('-tu');
    const mudo = { ...JUICIOS, varianza: 'Varía la forma del verbo, que es lo que el punto enseña, y por eso el lote está bien.' };
    expect(verificarLote(BASE, { juicios: mudo }).join()).toMatch(/VARIANZA: la pieza «-tu»/);
    // Y con el juicio que la nombra, calla: el gate pide juicio, no
    // ausencia de invariancia — en `r3-negacion-antepuesta` la
    // invariancia era de la LENGUA y el punto salía legítimo.
    expect(verificarLote(BASE, { juicios: JUICIOS }).filter((s) => /VARIANZA/.test(s))).toEqual([]);
  });

  it('los tres juicios son obligatorios, y «vacío» no es «limpio»', () => {
    const sin = verificarLote(BASE, { juicios: { copia: '', frontera: '', varianza: '' } }).join();
    expect(sin).toMatch(/JUICIO AUSENTE «copia»/);
    expect(sin).toMatch(/JUICIO AUSENTE «varianza»/);
    expect(sin).toMatch(/JUICIO AUSENTE «frontera»/);
  });

  it('sin ítem de sobreaplicación, el lote exige que se escriba por qué no lo hay', () => {
    const sinFrontera = BASE.map((x) => ({ ...x, sobreaplicacion: false }));
    expect(verificarLote(sinFrontera, { juicios: JUICIOS }).join()).toMatch(/ningún ítem declara `sobreaplicacion`/);
    // Y la salida honesta existe: declararlo por escrito, como hace
    // `r3-negacion-antepuesta`, donde la regla no tiene contexto negativo.
    const declarado = { ...JUICIOS, frontera: 'SIN FRONTERA: en rumano no hay imperativo afirmativo que admita el pronombre sujeto, así que la regla no tiene contexto donde no se aplique.' };
    expect(verificarLote(sinFrontera, { juicios: declarado }).filter((s) => /FRONTERA/.test(s))).toEqual([]);
  });

  it('una estrategia PROPIA del punto se corre igual que las de serie', () => {
    // «Al cerrar una estrategia, pregunta qué regularidad deja el cierre y
    // comprueba la nueva EJECUTÁNDOLA»: para eso el lote pasa las suyas.
    const siempreVino = { nombre: 'poner-siempre-vino', aplicar: () => 'vino' };
    expect(verificarLote(BASE, { juicios: JUICIOS, estrategias: [siempreVino] })).toEqual([]);
    const todosVino = BASE.map((x) => ({ ...x, nucleo: 'vino', r: 'Vino acum!' }));
    expect(verificarLote(todosVino, { juicios: JUICIOS, estrategias: [siempreVino] }).join())
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
