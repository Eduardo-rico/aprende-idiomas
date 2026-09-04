// tests/unit/lote29-ro.test.ts — EL LOTE 29 VISTO EN ROJO.
//
// Un gate visto sólo en verde no está probado (§4.18). Y aquí volvió a
// morder el §4.37 por TERCERA vez en este repositorio: el gate que exige
// objeto masculino en el ítem del gerundio se escribió como `/u-l(,|$)/`
// contra `norm(x.r)`, y `norm()` convierte la coma en espacio, así que la
// condición era inalcanzable por un lado e imposible por el otro —marcó el
// ítem BUENO—. Se reescribió sobre el núcleo crudo. Cada testigo lleva un
// solo defecto (§0.8).
import { describe, it, expect } from 'vitest';
import {
  ITEMS, DECL, OPCIONES, CONSTRUIDOS, revisar, CONSIGNA_IMP, CONSIGNA_GER,
  FUSION_PORTUGUESA, SIN_LEGATURA, PORTUGUES_ENTERO, type Construido,
} from '@/scripts/lotes/trans-ro-l29';
import { verificar, correr } from '@/scripts/lib/transformacion-ro';
import { gerunziu, presente, CLITICOS_DATIV, CLITICOS_ACUZATIV } from '@/scripts/lib/paradigma-ro';
import { VERBOS_A1 } from '@/lib/data/languages/ro/lexicon-a1';

const XS = () => JSON.parse(JSON.stringify(CONSTRUIDOS)) as Construido[];
const rehacer = (f: (xs: Construido[]) => void): Construido[] => { const xs = XS(); f(xs); return xs; };
const por = (xs: Construido[], eje: string) => xs.find((x) => x.d.eje === eje)!;

describe('lote 29 · r6-cliticos-imperativo-gerunziu · en verde', () => {
  it('el lote real pasa sus propios gates y los de la máquina', () => {
    expect(verificar(ITEMS, OPCIONES)).toEqual([]);
  });

  it('son DOS ítems, uno por eje, y ése es el piso declarado del punto', () => {
    expect(ITEMS).toHaveLength(2);
    expect(DECL.map((d) => d.eje)).toEqual(['cluster', 'legatura']);
  });

  it('las dos claves las derivan el paradigma y el inventario de clíticos, no están escritas a mano', () => {
    const vedea = VERBOS_A1.find((v) => v.inf === 'a vedea')!;
    const da = VERBOS_A1.find((v) => v.inf === 'a da')!;
    expect(gerunziu(vedea)).toBe('văzând');
    expect(presente(da, 'el')).toBe('dă');
    expect(CLITICOS_DATIV['1sg']!.reducida).toBe('mi');
    expect(CLITICOS_ACUZATIV['3sgM']!.reducida).toBe('l');
    expect(CONSTRUIDOS.map((x) => x.r)).toEqual(['Dă-mi-o.', 'Văzându-l, am plecat.']);
  });

  it('las tres estrategias ciegas aciertan CERO, y las tres se APLICAN — un cero de una estrategia apagada es indistinguible', () => {
    for (const e of [FUSION_PORTUGUESA, SIN_LEGATURA, PORTUGUES_ENTERO])
      expect(correr(e, ITEMS).aciertos, e.nombre).toBe(0);
    // La composición se aplica a los DOS ítems; cada una suelta, a uno.
    const aplica = (e: typeof PORTUGUES_ENTERO) => ITEMS.filter((x) =>
      e.aplicar({ s: x.s, instruccion: x.instruccion, hint: x.hint, foco: x.foco }, []) !== null).length;
    expect(aplica(FUSION_PORTUGUESA)).toBe(1);
    expect(aplica(SIN_LEGATURA)).toBe(1);
    expect(aplica(PORTUGUES_ENTERO)).toBe(2);
  });
});

describe('lote 29 · los gates propios, EN ROJO', () => {
  // EL GATE QUE MÁS FALTA HACE Y EL MÁS INVISIBLE: con objeto femenino la
  // norma es SIN vocal de legătură (văzând-o 27 frente a văzându-o 4), así
  // que un ítem femenino publicaría la variante minoritaria como única
  // respuesta correcta.
  it('ROJO · el ítem del gerundio con objeto FEMENINO publica la variante minoritaria', () => {
    const xs = rehacer((x) => { const y = por(x, 'legatura'); y.nucleo = 'văzându-o'; y.r = 'Văzându-o, am plecat.'; });
    const h = revisar(xs);
    expect(h.some((s) => s.includes('objeto FEMENINO'))).toBe(true);
  });

  it('ROJO · y el gerundio SIN la vocal de legătură también se caza', () => {
    const xs = rehacer((x) => { const y = por(x, 'legatura'); y.nucleo = 'văzând-l'; y.r = 'Văzând-l, am plecat.'; });
    expect(revisar(xs).some((s) => s.includes('acabar el gerundio en «u-l»'))).toBe(true);
  });

  it('VERDE · el ítem real NO se marca — el gate discrimina y no marca todo', () => {
    expect(revisar(XS()).filter((s) => s.includes('legătură'))).toEqual([]);
  });

  it('ROJO · el clúster FUNDIDO como en portugués (*dă-mo)', () => {
    const xs = rehacer((x) => { const y = por(x, 'cluster'); y.nucleo = 'dă-mo'; y.r = 'Dă-mo.'; });
    expect(revisar(xs).some((s) => s.includes('UN guion por clítico'))).toBe(true);
  });

  it.each([
    ['tuteándolo', 'la orden de usted Dați-mi-o'],
    ['empieza la frase por él', 'la supletiva Să mi-o dai'],
  ])('ROJO · sin la cláusula «%s» el ítem del imperativo deja fuera una respuesta correcta', (clave) => {
    const xs = rehacer((x) => { por(x, 'cluster').instruccion = CONSIGNA_IMP.replace(clave, 'nada'); });
    expect(revisar(xs).some((s) => s.includes('falta la cláusula'))).toBe(true);
  });

  it('ROJO · sin «sin «când»» el ítem del gerundio se contesta copiando la fuente', () => {
    const xs = rehacer((x) => { por(x, 'legatura').instruccion = CONSIGNA_GER.replace('sin «când»', 'nada'); });
    expect(revisar(xs).some((s) => s.includes('falta la cláusula'))).toBe(true);
  });

  it('ROJO · una consigna que nombra el guion o la vocal regala la respuesta', () => {
    const xs = rehacer((x) => { por(x, 'legatura').instruccion = `${CONSIGNA_GER} Añade una vocal.`; });
    expect(revisar(xs).some((s) => s.includes('regala la respuesta'))).toBe(true);
  });

  it('ROJO · dos ítems del mismo eje: el segundo mediría la forma del clítico, que es r6-cliticos-acusativo', () => {
    const xs = rehacer((x) => { por(x, 'legatura').d.eje = 'cluster'; });
    expect(revisar(xs).some((s) => s.includes('tiene 0 ítems') || s.includes('tiene 2 ítems'))).toBe(true);
  });

  it('VERDE · el lote real no dispara ningún gate propio', () => {
    expect(revisar(XS())).toEqual([]);
  });
});
