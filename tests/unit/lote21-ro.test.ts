// tests/unit/lote21-ro.test.ts — LOS GATES DEL LOTE 21, VISTOS EN ROJO.
//
// «Un gate que nunca ha dicho que no, no ha dicho nada» (§4.18): el gate
// anti-anglófono del lote 18 llevaba una condición inalcanzable y el lote
// imprimía «Limpio» exactamente igual. Por eso cada gate de este fichero
// aparece DOS veces: con el ítem que lo pasa con nota máxima y con el que
// lo suspende. Si sólo estuviera el verde, el test no distinguiría un gate
// que funciona de un gate muerto.
//
// Y los testigos rojos NO son inventados donde había un hallazgo: los de
// los gates 1, 2 y 3 son las tres construcciones que el corpus del propio
// proyecto atestó como correctas y que por eso NO se pueden examinar
// (§4.27 — el testigo tiene que ser el hallazgo, no una muestra de él).
import { describe, it, expect } from 'vitest';
import { ITEMS, CANDIDATOS, GENERO, esSinNombre, verificar } from '../../scripts/lotes/cloze-ro-l21';
import type { ClozeRo } from '../../scripts/lotes/cloze-ro-a1';

const CMP = 'r8-comparativo';
/** Sólo los avisos que introduce ESTE lote: `verificar` llama antes al
 *  gate base, y un testigo rojo inventado a mano dispara además sus
 *  avisos (ancla, ortografía, Hunspell). Sin este filtro el test pasaría
 *  por el motivo equivocado — que es la forma de falso verde más barata
 *  que hay. */
const soloDelLote = (xs: ClozeRo[], frag: string) => verificar(xs).filter((s) => s.includes(frag));

describe('lote 21 · el lote publicable', () => {
  it('sale limpio, y los 8 ítems son del mismo punto', () => {
    expect(verificar(ITEMS)).toEqual([]);
    expect(ITEMS.filter((x) => x.p === CMP)).toHaveLength(8);
    // `r8-discurso-indirecto` nació en este lote y salió con CERO: sus dos
    // ítems se escribieron, se atacaron y se retiraron. El motivo vive en
    // el inventario, y este test impide que vuelvan por descuido.
    expect(ITEMS.filter((x) => x.p === 'r8-discurso-indirecto')).toHaveLength(0);
  });

  it('los candidatos NO publicados están escritos, no pendientes', () => {
    // Existen para que el siguiente los ataque en bloque en vez de
    // re-descubrirlos. El motivo de cada uno vive en el código.
    expect(Object.keys(CANDIDATOS).sort()).toEqual(['decatVerboFinito', 'dinContenedor']);
  });
});

describe('gate 1 · el término de comparación tras «mai + ADJ» no está determinado', () => {
  // El corpus del proyecto: `mai ADJ decât/decît` = 514, `mai ADJ ca` = 100,
  // en prosa corriente. Las dos son correctas, así que el hueco no tiene
  // respuesta única.
  const rojo: ClozeRo = { p: CMP, r: 'decât', s: 'Fratele meu este mai înalt ___ mine.', pista: 'que', ancla: 'mai înalt', transparenteLatin: false };
  it('SUSPENDE al ítem que espera «decât» ahí', () => {
    expect(soloDelLote([rojo], 'no está determinado')).toHaveLength(1);
  });
  it('SUSPENDE igual al que espera «ca» — el gate mira la POSICIÓN, no la respuesta', () => {
    // Si preguntara «¿la respuesta es decât?» dejaría pasar el ítem
    // simétrico, que está roto por la misma razón. Es §4.1: la pregunta
    // que el gate contesta tiene que ser la que quiero contestar.
    expect(soloDelLote([{ ...rojo, r: 'ca' }], 'no está determinado')).toHaveLength(1);
  });
  it('APRUEBA el hueco que va ENTRE «mai» y «decât», que es otro punto', () => {
    // El ítem 5 del lote: `vorbește românește mai ___ decât mine`. El
    // hueco es el adverbio, no el término de comparación.
    expect(soloDelLote([ITEMS[6]!], 'no está determinado')).toHaveLength(0);
  });
});

describe('gate 2 · el pronombre tras «decât» no se examina', () => {
  // `decât eu` sale 7 veces en el corpus (y `decât tu` 2): marcar el
  // nominativo como error sería el asterisco propio del §0.
  it('SUSPENDE al ítem que pide el pronombre en el hueco', () => {
    const rojo: ClozeRo = { p: CMP, r: 'mine', s: 'Fratele meu este mai înalt decât ___.', pista: 'yo', ancla: 'mai înalt', transparenteLatin: false };
    expect(soloDelLote([rojo], 'no hay mala')).toHaveLength(1);
  });
  it('APRUEBA la frase que lleva «decât mine» YA ESCRITO fuera del hueco', () => {
    expect(soloDelLote([ITEMS[6]!], 'no hay mala')).toHaveLength(0);
  });
});

describe('gate 3 · «dintre» no se puede exigir contra «din»', () => {
  // `din ei` ×319 en el corpus (`unul din ei` ×77, `fiecare din ele` ×31).
  it('SUSPENDE al ítem cuya respuesta es «dintre»', () => {
    const rojo: ClozeRo = { p: CMP, r: 'dintre', s: 'Ea este cea mai harnică ___ ei.', pista: 'de entre', ancla: 'cea mai harnică', transparenteLatin: false };
    expect(soloDelLote([rojo], 'atestado ×319')).toHaveLength(1);
  });
  it('APRUEBA la frase que lleva «dintre» fuera del hueco', () => {
    expect(soloDelLote([ITEMS[4]!], 'atestado ×319')).toHaveLength(0);
  });
});

describe('gate 4 · la concordancia de «cel» sólo mide si el género español apunta al revés', () => {
  it('SUSPENDE al ítem que se acierta traduciendo el género', () => {
    // «el tren» es masculino en español y `trenul` pide `cel`: traducir
    // el género da la respuesta. El ítem sería impecable y no mediría
    // nada — §4.8, la mitad que transfiere.
    const rojo: ClozeRo = { p: CMP, r: 'cel', s: 'Acesta este trenul ___ mai mare.', pista: 'el más grande', ancla: 'trenul', transparenteLatin: false, generoConvergeEs: false };
    expect(soloDelLote([rojo], 'no declara el género español')).toHaveLength(1);
  });

  it('SUSPENDE al ítem DECLARADO cuyo género español converge', async () => {
    const mod = await import('../../scripts/lotes/cloze-ro-l21');
    const frase = 'Acesta este trenul ___ mai mare.';
    (mod.GENERO as Record<string, { es: 'm' | 'f'; numero: 'sg' | 'pl'; glosa: string }>)[frase] = { es: 'm', numero: 'sg', glosa: 'el tren' };
    const rojo: ClozeRo = { p: CMP, r: 'cel', s: frase, pista: 'el más grande', ancla: 'trenul', transparenteLatin: false, generoConvergeEs: false };
    expect(soloDelLote([rojo], 'se acierta calcando')).toHaveLength(1);
    delete (mod.GENERO as Record<string, unknown>)[frase];
  });

  it('APRUEBA los cuatro ítems del lote, cuyo género español apunta al revés', () => {
    // Los CUATRO con nombre. Los otros dos ítems de la familia `cel` son
    // los de la casilla invariable, que no tienen nombre ni género que
    // declarar y los mira el gate 5b.
    const cuatro = ITEMS.filter((x) => ['cel', 'cea', 'cei', 'cele'].includes(String(x.r)) && !esSinNombre(x));
    expect(cuatro).toHaveLength(4);
    expect(soloDelLote(cuatro, 'se acierta calcando')).toHaveLength(0);
    expect(soloDelLote(cuatro, 'no declara el género español')).toHaveLength(0);
  });
});

describe('gate 5 · las cuatro casillas de «cel», o el punto enseña media declinación', () => {
  it('SUSPENDE si falta una casilla', () => {
    const tres = ITEMS.filter((x) => x.p === CMP && x.r !== 'cea');
    expect(soloDelLote(tres, 'falta la casilla «cea»')).toHaveLength(1);
  });
  it('APRUEBA el lote completo', () => {
    expect(soloDelLote(ITEMS, 'falta la casilla')).toHaveLength(0);
  });
});

describe('gate 6 · la frontera bine/bun, en las DOS caras (§0.6)', () => {
  it('SUSPENDE al lote que examina «bine» y no su frontera adjetiva', () => {
    // Es el defecto exacto que la regla del §0.6 existe para impedir: el
    // alumno aprende «mejor = bine siempre», saca pleno, y luego escribe
    // *mâncarea este mai bine.
    const sinFrontera = ITEMS.filter((x) => x.p === CMP && x.r !== 'bună');
    expect(soloDelLote(sinFrontera, 'no su frontera adjetiva')).toHaveLength(1);
  });
  it('SUSPENDE también al lote que examina el adjetivo y no el adverbio', () => {
    const sinAdverbio = ITEMS.filter((x) => x.p === CMP && x.r !== 'bine');
    expect(soloDelLote(sinAdverbio, 'la frontera necesita las DOS caras')).toHaveLength(1);
  });
  it('APRUEBA el lote, que lleva las dos', () => {
    expect(soloDelLote(ITEMS, 'frontera')).toHaveLength(0);
  });
});


describe('gate 4b · el adjetivo no puede regalar la desinencia', () => {
  // El hallazgo del segundo ataque sobre la v0 de este mismo lote: tres de
  // sus cuatro ítems de concordancia llevaban adjetivo marcado en género
  // (`ieftine`, `înalți`, `bună`) y se contestaban copiando esa desinencia,
  // sin mirar el nombre y sin tropezar jamás con el español. Eran
  // impecables y no medían el punto — y ninguno de mis ocho gates lo veía.
  it('SUSPENDE al ítem con adjetivo marcado en género', () => {
    const rojo: ClozeRo = { p: CMP, r: 'cele', s: 'Trenurile de noapte sunt ___ mai ieftine din gară.', pista: 'los más baratos', ancla: 'Trenurile', transparenteLatin: false, generoConvergeEs: false };
    (GENERO as Record<string, { es: 'm' | 'f'; numero: 'sg' | 'pl'; glosa: string }>)[rojo.s] = { es: 'm', numero: 'pl', glosa: 'los trenes' };
    expect(soloDelLote([rojo], 'marca género')).toHaveLength(1);
    delete (GENERO as Record<string, unknown>)[rojo.s];
  });
  it('APRUEBA los cuatro del lote, que usan «mari»/«mare»', () => {
    expect(soloDelLote(ITEMS, 'marca género')).toHaveLength(0);
  });
});

describe('gate 5b · la casilla SIN NOMBRE, donde «cel» es invariable (§0.6)', () => {
  // Es la frontera de la concordancia. La regla que el lingüista firmó en
  // la primera ronda —«`cel mai` es invariable ante adverbio»— la refutó
  // el corpus: «din lecția CEA MAI BINE preparată» es correcto y ahí `cel`
  // SÍ concuerda. La regla que aguanta los cuatro ejemplos es otra: `cel`
  // concuerda siempre que HAYA UN NOMBRE; sin nombre queda invariable.
  it('SUSPENDE al lote sin ningún ítem de la casilla invariable', () => {
    const sinFrontera = ITEMS.filter((x) => !/c[âa]nt[ăa]|munce[șs]te/u.test(x.s));
    expect(soloDelLote(sinFrontera, 'SIN NOMBRE')).toHaveLength(1);
  });
  it('SUSPENDE al ítem sin nombre cuya respuesta CONCUERDA', () => {
    // La sobreaplicación que el punto existe para impedir.
    const rojo: ClozeRo = { p: CMP, r: 'cea', s: 'Dintre toate fetele din cor, ea cântă ___ mai bine.', pista: 'la marca del superlativo', ancla: 'ea cântă', transparenteLatin: false };
    expect(soloDelLote([rojo], 'es invariable y la respuesta no puede ser')).toHaveLength(1);
  });
  it('SUSPENDE al ítem sin nombre que declara un género que no existe', () => {
    const rojo: ClozeRo = { ...ITEMS[4]! };
    (GENERO as Record<string, { es: 'm' | 'f'; numero: 'sg' | 'pl'; glosa: string }>)[rojo.s] = { es: 'f', numero: 'sg', glosa: 'inventado' };
    expect(soloDelLote([rojo], 'el dato sobra')).toHaveLength(1);
    delete (GENERO as Record<string, unknown>)[rojo.s];
  });
  it('APRUEBA el lote, que lleva dos ítems de esa casilla', () => {
    expect(soloDelLote(ITEMS, 'SIN NOMBRE')).toHaveLength(0);
    expect(soloDelLote(ITEMS, 'el dato sobra')).toHaveLength(0);
  });
});
