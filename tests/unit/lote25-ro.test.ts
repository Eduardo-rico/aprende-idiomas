// tests/unit/lote25-ro.test.ts — EL LOTE 25 VISTO EN ROJO.
//
// Un gate visto sólo en verde no está probado: los tres gates nuevos del
// rumano dieron 4, 26 y 21 hallazgos FALSOS antes de los buenos, y el
// gate anti-anglófono del lote 18 no marcaba NUNCA y el lote imprimía
// «Limpio» igual (§4.18). Así que cada gate propio de este lote se corre
// aquí contra un ítem que DEBE cazar, y —la otra mitad de la regla— cada
// testigo lleva UN SOLO defecto: con dos, no se sabe cuál lo suspendió.
import { describe, it, expect } from 'vitest';
import { contrastarComposiciones } from '@/scripts/lib/composiciones';
import {
  ITEMS, DECL, OPCIONES, BUSQUEDA, VEREDICTO, revisar, superficieDe, type Construido,
} from '@/scripts/lotes/trans-ro-l25';
import { verificar } from '@/scripts/lib/transformacion-ro';

/** Los ítems tal como el lote los construye, con su declaración pegada.
 *  `revisar` los recibe por argumento a propósito: la primera versión
 *  leía la constante de módulo y no miraba su parámetro, o sea que no se
 *  podía ver en rojo de ninguna manera. */
const XS = () => JSON.parse(JSON.stringify(ITEMS.map((x, i) => ({ ...x, d: DECL[i] })))) as Construido[];
const rehacer = (f: (xs: Construido[]) => void): Construido[] => { const xs = XS(); f(xs); return xs; };

describe('lote 25 · r4-articulo-posesivo', () => {
  it('en VERDE: el lote real pasa sus propios gates y los de la máquina', () => {
    expect(verificar(ITEMS, OPCIONES)).toEqual([]);
  });

  it('ROJO · una respuesta escrita a mano que el paradigma no deriva', () => {
    // Es el gate que impide que la clave y `articolPosesiv()` se separen
    // sin que nada falle. El testigo cambia SÓLO la forma del artículo.
    const xs = rehacer((x) => { x[1]!.r = x[1]!.r.replace(' al ', ' ale '); });
    expect(revisar(xs).filter((s) => s.includes('no es la que deriva el paradigma'))).toHaveLength(1);
  });

  it('ROJO · un estímulo con perfect compus de 3.ª sg — la homografía de `a`', () => {
    // `a` es el auxiliar además del artículo posesivo, así que el
    // estímulo llevaría dentro una copia de la cadena que hay que
    // producir. Hunspell aprueba las dos: el gate tiene que ser
    // estructural.
    const xs = rehacer((x) => { x[0]!.s = 'Cartea Mariei a stat pe masă.'; });
    expect(revisar(xs).filter((s) => s.includes('homografía'))).toHaveLength(1);
  });

  it('ROJO · coordinación de dos genitivos, que tiene DOS lecturas gramaticales', () => {
    const xs = rehacer((x) => { x[0]!.s = 'Cartea Mariei și profesorului stă pe masă.'; });
    expect(revisar(xs).filter((s) => s.includes('coordinación'))).toHaveLength(1);
  });

  it('ROJO · cuatro ítems de «indefinitivizar»: el lote mediría la operación, no la regla', () => {
    const xs = rehacer((x) => { x[3]!.d.familia = 'indef'; });
    expect(revisar(xs).some((s) => s.startsWith('FAMILIA: 4 ítems'))).toBe(true);
  });

  it('ROJO · una sola configuración no enseña una regla de ADYACENCIA', () => {
    const xs = rehacer((x) => { for (const y of x) y.d.familia = 'indef'; });
    expect(revisar(xs).some((s) => s.includes('sólo 1 configuraciones'))).toBe(true);
  });

  it('ROJO · plural indefinido con `niște`: dos salidas correctas para una clave exacta', () => {
    const xs = rehacer((x) => { x[4]!.r = x[4]!.r.replace('Două', 'Niște'); });
    expect(revisar(xs).some((s) => s.includes('«niște»'))).toBe(true);
  });

  it('ROJO · la BÚSQUEDA de composiciones caza un atajo PLANTADO', () => {
    // Sin esto, el «no hay atajo» del lote real no valdría nada: con
    // n = 9 la nula es ancha —su percentil 95 coincide con lo observado—
    // y un contraste que nunca dice que sí es indistinguible de uno que
    // no sabe decirlo. El atajo plantado es de los que la nula SÍ puede
    // ver: uno CONDICIONADO por una pista, porque las estrategias ciegas
    // no se barajan y por tanto puntúan igual en la nula.
    const plantada = (x: Construido) => (x.d.numero === 'pl' ? superficieDe(x.foco) : '∅');
    const v = contrastarComposiciones(XS(), plantada, BUSQUEDA.ciegas, BUSQUEDA.pistas);
    expect(v.mejor.acierta).toBe(9);
    expect(v.hayAtajo).toBe(true);
  });

  it('el lote real: ninguna composición pasa de la nula, y el número se imprime', () => {
    // El criterio NO es el 50 %: con k pistas binarias la mejor de k lo
    // pasa por azar, y exigirle 50 % a un MÁXIMO garantiza el hallazgo
    // falso. Aquí lo observado (6/9) cae justo en el percentil 95 de la
    // nula, que es la forma que tiene «no hay señal» a este tamaño.
    expect(VEREDICTO.hayAtajo).toBe(false);
    expect(VEREDICTO.mejor.de).toBe(9);
  });
});
