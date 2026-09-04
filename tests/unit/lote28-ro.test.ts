// tests/unit/lote28-ro.test.ts — EL LOTE 28 VISTO EN ROJO.
//
// Un gate visto sólo en verde no está probado: en este proyecto el gate
// anti-anglófono del lote 18 no marcaba NUNCA y el lote imprimía «Limpio»
// igual (§4.18), y el del `și` del lote 25 buscaba un diacrítico sobre
// texto ya normalizado, o sea que era inalcanzable (§4.37). Cada gate
// propio de este lote se corre contra un ítem que DEBE cazar, y cada
// testigo lleva UN SOLO defecto: con dos no se sabe cuál lo suspendió.
//
// ⚠ **Y EL §4.37 VOLVIÓ A MORDER AQUÍ, en este mismo lote, por tercera vez
// en el repositorio — pero NO en un gate, sino en una ESTRATEGIA.** El
// lector de la vista preguntaba `/îmi d[ăa]/` sobre texto pasado por
// `norm()`, que borra los diacríticos, así que devolvía `dosCliticos:
// false` para los cuatro ítems y **las dos estrategias del guion se
// apagaban en silencio**. No hubo ningún rojo: el lote salía «Limpio» con
// dos estrategias midiendo el vacío. Lo cazó que el número observado (0/4
// y 0/4) no fuera el PREDICHO (1/4 y 1/4), y por eso los dos números
// predichos están escritos abajo como test: una estrategia que da cero es
// indistinguible de una estrategia que no se aplica nunca.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, DECL, OPCIONES, CONSTRUIDOS, construir, revisar, CONSIGNA,
  GUION_SIEMPRE, GUION_NUNCA, SIEMPRE_DETRAS, SIEMPRE_DELANTE,
  GENERO_DECIDE_EL_LADO, TODO_PROCLITICO_PLENO, FUSION_PORTUGUESA,
  COMPUESTA_PEGA, COMPUESTA_SUELTA, FUGA_COMPUESTA, fugaAciertaLaForma, type Construido,
} from '@/scripts/lotes/trans-ro-l28';
import { verificar, correr, ordenDePublicacion } from '@/scripts/lib/transformacion-ro';
import { cliticAcuzativ, articulado } from '@/scripts/lib/paradigma-ro';
import { SUSTANTIVOS_A1 } from '@/lib/data/languages/ro/lexicon-a1';

const XS = () => JSON.parse(JSON.stringify(CONSTRUIDOS)) as Construido[];
const rehacer = (f: (xs: Construido[]) => void): Construido[] => { const xs = XS(); f(xs); return xs; };
/** Se busca POR CONTENIDO y nunca por índice: lo publicado va barajado con
 *  semilla, y un testigo que coja `XS()[1]` se apaga en silencio el día que
 *  alguien reordene la declaración. */
const por = (xs: Construido[], nucleo: string) => xs.find((x) => x.nucleo === nucleo)!;

describe('lote 28 · r6-contracciones-cliticos · en verde', () => {
  it('el lote real pasa sus propios gates y los de la máquina', () => {
    expect(verificar(ITEMS, OPCIONES)).toEqual([]);
  });

  it('son CUATRO ítems en dos pares, y ése es el piso declarado del punto', () => {
    expect(ITEMS).toHaveLength(4);
    expect(DECL.filter((d) => d.par === 'silabicidad')).toHaveLength(2);
    expect(DECL.filter((d) => d.par === 'posicion')).toHaveLength(2);
  });

  it('las cuatro claves las derivan el paradigma y el clítico, no están escritas a mano', () => {
    const carte = SUSTANTIVOS_A1.find((x) => x.lema === 'carte')!;
    expect(articulado(carte, 'pl')).toBe('cărțile');
    expect(cliticAcuzativ('f', 'pl')).toBe('le');
    expect(cliticAcuzativ('f', 'sg')).toBe('o');
    expect(cliticAcuzativ('n', 'sg')).toBe('îl');
    expect(CONSTRUIDOS.map((x) => x.r)).toEqual([
      'Ion mi le dă.', 'Ion mi-o dă.', 'Ana a văzut-o ieri.', 'Ana l-a văzut ieri.',
    ]);
  });

  // LAS ESTRATEGIAS, CON SU NÚMERO PREDICHO ESCRITO. No basta con que
  // ninguna pase del tope: un cero puede ser una estrategia apagada, que es
  // el fallo que este lote cometió y que ningún rojo habría cazado.
  it('las cuatro sobregeneralizaciones de una cara aciertan 1 de 4 cada una', () => {
    for (const e of [GUION_SIEMPRE, GUION_NUNCA, SIEMPRE_DETRAS, SIEMPRE_DELANTE])
      expect(correr(e, ITEMS).aciertos, e.nombre).toBe(1);
  });

  it('las dos COMPOSICIONES cruzadas aciertan 2 de 4 — el suelo de dos pares binarios, no holgura', () => {
    expect(correr(COMPUESTA_PEGA, ITEMS).aciertos).toBe(2);
    expect(correr(COMPUESTA_SUELTA, ITEMS).aciertos).toBe(2);
  });

  it('el PROXY del género acierta el par 2 entero, y queda escrito como límite del lote', () => {
    expect(correr(GENERO_DECIDE_EL_LADO, ITEMS).aciertos).toBe(2);
    // A n = 2 eso es el techo y no hay umbral que valga (§4.41). Lo que
    // separa al que sabe del que usa el proxy es que el proxy se rompe en
    // PLURAL (`cărțile` → `le-a văzut`), y este lote no tiene ese ítem: va
    // dicho en el juicio de varianza en vez de disimulado.
    expect(OPCIONES.juicios.varianza).toContain('proxy');
  });

  it('la colocación española/portuguesa con formas plenas acierta CERO — si acertara, el lote mediría la colocación, que es gratis por dos vías', () => {
    expect(correr(TODO_PROCLITICO_PLENO, ITEMS).aciertos).toBe(0);
    // Y el cero NO es una estrategia apagada: se comprueba que produce algo
    // en los cuatro ítems, que es justo lo que le faltaba comprobar a las
    // dos del guion cuando `norm()` las dejó mudas.
    for (const x of ITEMS)
      expect(TODO_PROCLITICO_PLENO.aplicar({ s: x.s, instruccion: x.instruccion, hint: x.hint, foco: x.foco }, []), x.s).not.toBeNull();
  });

  // LA FUGA TIPOGRÁFICA DEL ATAQUE FINAL. El artículo enclítico y el
  // clítico de acusativo son los MISMOS segmentos, así que el objeto lleva
  // su respuesta pegada al final. Se mide contra la FORMA y no contra el
  // núcleo: medida contra el núcleo daría 0/4, que es un número verdadero
  // sobre otra pregunta (§4.14).
  it('la fuga de la terminación del artículo acierta la FORMA en los CUATRO', () => {
    expect(fugaAciertaLaForma(CONSTRUIDOS)).toBe(4);
  });

  it('y el espacio ENTERO de políticas montadas encima de la fuga topa en 2 de 4 — el suelo binario', () => {
    const cifras = FUGA_COMPUESTA.map((e) => correr(e, ITEMS).aciertos);
    expect(FUGA_COMPUESTA).toHaveLength(4); // guion sí/no × delante/detrás: el espacio completo
    expect(Math.max(...cifras)).toBe(2);
    expect(cifras.sort()).toEqual([0, 1, 1, 2]);
  });

  it('la fusión portuguesa (*mo, *mi-lo) acierta CERO y se aplica a los dos ítems que tienen clúster', () => {
    expect(correr(FUSION_PORTUGUESA, ITEMS).aciertos).toBe(0);
    const aplica = ITEMS.filter((x) => FUSION_PORTUGUESA.aplicar({ s: x.s, instruccion: x.instruccion, hint: x.hint, foco: x.foco }, []) !== null);
    expect(aplica).toHaveLength(2);
  });

  it('el orden PUBLICADO no separa los dos pares por posición, y el escrito SÍ lo haría', () => {
    const clase = (xs: readonly Construido[]) => xs.map((x) => (x.d.par === 'silabicidad' ? 'S' : 'P')).join('');
    expect(clase(CONSTRUIDOS)).toBe('SSPP');
    expect(clase(ordenDePublicacion(CONSTRUIDOS, 20))).toBe('SPPS');
  });

  // EL DEFECTO DEL PUBLICADOR QUE ESTE LOTE DESTAPÓ, fijado aquí para que
  // no pueda volver. `scripts/publicar-transformacion-ro.ts` barajaba los
  // ítems y le pasaba el RESULTADO a `verificar`, que vuelve a barajar
  // dentro de `ordenSeparable` con la misma semilla: el gate certificaba
  // `baraja(baraja(xs))`, o sea un orden que el alumno NO VE. No había
  // mordido nunca porque los lotes 23-26 declaran `orden-escrito` —donde
  // barajar dos veces es igual que barajar una— y el 27 tiene n = 2, tamaño
  // al que el detector no puede disparar. Se cazó porque este lote pasaba
  // sus gates corriendo el fichero suelto y los SUSPENDÍA al publicar, con
  // la misma semilla: dos instrumentos que cuentan distinto en silencio
  // (§4.38) dentro de un mismo script. La regla: el que valida recibe lo
  // DECLARADO y aplica la baraja él mismo; el que escribe recibe lo
  // BARAJADO.
  it('ROJO · barajar DOS veces suspende el lote — el gate mide el orden que el alumno ve', () => {
    expect(verificar(ITEMS, OPCIONES)).toEqual([]);
    const doble = verificar(ordenDePublicacion(ITEMS, 20), OPCIONES);
    expect(doble.length).toBe(2);
    expect(doble.every((s) => s.startsWith('ORDEN PUBLICADO'))).toBe(true);
  });
});

describe('lote 28 · los gates propios, EN ROJO', () => {
  it('ROJO · un clítico de acusativo que el paradigma no deriva', () => {
    const xs = rehacer((x) => { por(x, 'mi-o').ac = 'le'; });
    expect(revisar(xs).some((s) => s.includes('no es el que deriva el paradigma'))).toBe(true);
  });

  it('ROJO · «le» con guion: el guion sólo va con la asilábica', () => {
    const xs = rehacer((x) => { const y = por(x, 'mi le'); y.nucleo = 'mi-le'; y.r = 'Ion mi-le dă.'; });
    expect(revisar(xs).some((s) => s.includes('el guion sólo va con «o»'))).toBe(true);
  });

  it('ROJO · el acusativo masculino puesto DETRÁS del participio (*a văzut-l)', () => {
    const xs = rehacer((x) => { const y = por(x, 'l-a'); y.nucleo = 'văzut-l'; y.r = 'Ana a văzut-l ieri.'; });
    expect(revisar(xs).some((s) => s.includes('sólo «o» va detrás del participio'))).toBe(true);
  });

  it('ROJO · y el femenino puesto DELANTE también se caza — el gate mira en las DOS direcciones', () => {
    const xs = rehacer((x) => { const y = por(x, 'văzut-o'); y.nucleo = 'o a'; y.r = 'Ana o a văzut ieri.'; });
    expect(revisar(xs).some((s) => s.includes('sólo «o» va detrás del participio'))).toBe(true);
  });

  it('ROJO · dos sustantivos distintos rompen el par mínimo de la silabicidad', () => {
    const xs = rehacer((x) => { const y = por(x, 'mi-o'); y.l = SUSTANTIVOS_A1.find((s) => s.lema === 'casă')!; y.foco = 'casa'; y.s = 'Ion îmi dă casa.'; });
    expect(revisar(xs).some((s) => s.includes('EL MISMO sustantivo'))).toBe(true);
  });

  it('ROJO · el par de la posición con los dos del mismo género pierde el contraste de lado', () => {
    const xs = rehacer((x) => { const y = por(x, 'l-a'); y.l = SUSTANTIVOS_A1.find((s) => s.lema === 'casă')!; });
    expect(revisar(xs).some((s) => s.includes('uno femenino y uno no femenino'))).toBe(true);
  });

  it('ROJO · sujetos distintos dentro de un par', () => {
    const xs = rehacer((x) => { por(x, 'mi-o').d.sujeto = 'Radu'; });
    expect(revisar(xs).some((s) => s.includes('no comparten sujeto'))).toBe(true);
  });

  it('ROJO · los tres del mismo par: el reparto deja de ser la mitad', () => {
    const xs = rehacer((x) => { por(x, 'l-a').d.par = 'silabicidad'; });
    expect(revisar(xs).some((s) => s.includes('tiene 3 ítems'))).toBe(true);
  });

  // EL GATE QUE RETIRÓ DOS ÍTEMS DEL PRIMER DICTAMEN. Sus fuentes eran
  // `Ți-l dau azi` y `Ni le spune`: el clúster entero ya escrito, así que
  // el alumno lo copiaba y sólo recolocaba el guion (§4.13bis). El testigo
  // es el hallazgo entero y no una muestra de él (§4.27): van los dos.
  it('ROJO · una fuente que ya contiene el clúster de clíticos', () => {
    const xs = rehacer((x) => { por(x, 'mi le').s = 'Profesorul ni le spune.'; });
    expect(revisar(xs).some((s) => s.includes('ya contiene el clúster'))).toBe(true);
  });

  it('ROJO · una fuente que ya lleva un clítico con guion', () => {
    const xs = rehacer((x) => { por(x, 'mi-o').s = 'Ți-l dau azi.'; });
    expect(revisar(xs).some((s) => s.includes('ya lleva un clítico con guion'))).toBe(true);
  });

  it('VERDE · las cuatro fuentes reales NO se marcan: el gate no es ruido', () => {
    expect(revisar(XS()).filter((s) => s.includes('clúster') || s.includes('con guion'))).toEqual([]);
  });

  it('ROJO · una consigna que nombra el guion regala los cuatro ítems', () => {
    const xs = rehacer((x) => { for (const y of x) y.instruccion = `${CONSIGNA} Júntalos con guion.`; });
    expect(revisar(xs).some((s) => s.includes('nombrar el guion'))).toBe(true);
  });

  it('ROJO · una consigna que dice «contracción» también se caza', () => {
    const xs = rehacer((x) => { for (const y of x) y.instruccion = `${CONSIGNA} Usa la contracción.`; });
    expect(revisar(xs).some((s) => s.includes('la consigna dice'))).toBe(true);
  });

  // LAS TRES CLÁUSULAS SON GATES, y cada una cierra una salida CORRECTA que
  // la clave suspendería. Sin ellas no es que el lote sea flojo: es que
  // suspende a un alumno impecable, que es lo que este proyecto ya hizo
  // tres lotes seguidos.
  it.each([
    ['complemento', 'el doblado con pronombre fuerte'],
    ['tiempo del verbo', 'el futuro, donde «o» vuelve a ser proclítica'],
    ['orden de las demás palabras', 'la dislocación, que es r12'],
  ])('ROJO · sin la cláusula «%s» el lote deja fuera una respuesta correcta', (clave) => {
    const xs = rehacer((x) => { for (const y of x) y.instruccion = CONSIGNA.replace(clave, 'nada'); });
    expect(revisar(xs).some((s) => s.includes('falta la cláusula'))).toBe(true);
  });

  it('VERDE · la consigna real no dispara ninguna de las cuatro comprobaciones del enunciado', () => {
    expect(revisar(XS()).filter((s) => s.includes('consigna'))).toEqual([]);
  });

  it('ROJO · un par sin su ítem de sobreaplicación deja publicada la sobregeneralización', () => {
    const xs = rehacer((x) => { por(x, 'mi le').sobreaplicacion = false; });
    expect(revisar(xs).some((s) => s.includes('declara 0 ítems de sobreaplicación'))).toBe(true);
  });

  it('ROJO · y dos sobreaplicaciones en el mismo par también', () => {
    const xs = rehacer((x) => { por(x, 'mi-o').sobreaplicacion = true; });
    expect(revisar(xs).some((s) => s.includes('declara 2 ítems de sobreaplicación'))).toBe(true);
  });

  it('VERDE · el lote real no dispara ningún gate propio', () => {
    expect(revisar(XS())).toEqual([]);
  });
});

describe('lote 28 · la construcción', () => {
  it('el lema tiene que estar en el lexicón: nada se escribe a mano', () => {
    expect(() => construir({ ...DECL[0]!, n: 'inexistente' })).toThrow(/lexicón/);
  });

  it('el plural femenino da «le» suelto y el singular «-o» pegado, con el MISMO lema', () => {
    const pl = construir({ ...DECL[0]!, n: 'carte', num: 'pl', par: 'silabicidad' });
    const sg = construir({ ...DECL[0]!, n: 'carte', num: 'sg', par: 'silabicidad' });
    expect(pl.nucleo).toBe('mi le');
    expect(sg.nucleo).toBe('mi-o');
    // El par mínimo llevado al límite: las dos fuentes sólo se diferencian
    // en la forma del sustantivo.
    expect(pl.s.replace('cărțile', 'X')).toBe(sg.s.replace('cartea', 'X'));
  });
});
