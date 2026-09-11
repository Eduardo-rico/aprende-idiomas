// tests/unit/lote30-ro.test.ts — EL LOTE 30 VISTO EN ROJO.
//
// Un gate visto sólo en verde no está probado (§4.18). Cada testigo lleva
// un solo defecto (§0.8), y esa segunda regla costó cara aquí: la primera
// versión de este fichero tenía UN testigo que cambiaba la persona Y el
// núcleo a la vez, así que al desactivar la comprobación que decía probar
// **seguía en verde**, salvado por la otra del mismo gate. Un testigo
// visto sólo en verde tampoco está probado. Se comprobó desactivando cada
// comprobación por separado y viendo caer al suyo y sólo al suyo.
//
// LOS DOS TESTIGOS QUE PUSO EL ATAQUE DEL LINGÜISTA, y que son la razón de
// que este lote no se publicara a la primera: la consigna anterior decía
// «sin «este» ni «a fost»» y «No añadas ningún complemento», y dejaba
// pasar DOS respuestas que son rumano correcto y que la clave suspendía —
// la pasiva perifrástica en plural («Copiilor le sunt date cărțile», que
// no usa «este» ni «a fost» sino «sunt») y el impersonal de 3.ª plural
// («Copiilor le dau cărțile», donde «cărțile» es objeto).
import { describe, it, expect } from 'vitest';
import {
  ITEMS, DECL, OPCIONES, CONSTRUIDOS, revisar,
  CALCO_ESPANOL, CALCO_PORTUGUES, SIN_REDUCIR, PERIFRASTICA, type Construido,
} from '@/scripts/lotes/trans-ro-l30';
import { verificar, correr } from '@/scripts/lib/transformacion-ro';
import { genitivoDativo, articulado, presente, CLITICOS_DATIV } from '@/scripts/lib/paradigma-ro';
import { VERBOS_A1, SUSTANTIVOS_A1 } from '@/lib/data/languages/ro/lexicon-a1';

const XS = () => JSON.parse(JSON.stringify(CONSTRUIDOS)) as Construido[];
const rehacer = (f: (xs: Construido[]) => void): Construido[] => { const xs = XS(); f(xs); return xs; };
const uno = (xs: Construido[]) => xs[0]!;

describe('lote 30 · r7-pasiva-impersonal · en verde', () => {
  it('el lote real pasa sus propios gates y los de la máquina', () => {
    expect(verificar(ITEMS, OPCIONES)).toEqual([]);
  });

  it('es UN ítem, de 3.ª plural, y ése es el piso declarado del punto', () => {
    expect(ITEMS).toHaveLength(1);
    expect(DECL.map((d) => d.persona)).toEqual(['3pl']);
  });

  it('la clave la derivan el paradigma y el inventario de clíticos, no está escrita a mano', () => {
    const da = VERBOS_A1.find((v) => v.inf === 'a da')!;
    const copil = SUSTANTIVOS_A1.find((s) => s.lema === 'copil')!;
    const carte = SUSTANTIVOS_A1.find((s) => s.lema === 'carte')!;
    expect(genitivoDativo(copil, 'pl', true)).toBe('copiilor');
    expect(articulado(carte, 'pl')).toBe('cărțile');
    expect(presente(da, 'ei')).toBe('dau');
    // LA PIEZA DEL PUNTO: la forma REDUCIDA, que es lo que ninguna de las
    // dos lenguas del alumno le da.
    expect(CLITICOS_DATIV['3pl']!.plena).toBe('le');
    expect(CLITICOS_DATIV['3pl']!.reducida).toBe('li');
    expect(CONSTRUIDOS.map((x) => x.r)).toEqual(['Copiilor li se dau cărțile.']);
  });

  it('las cuatro estrategias ciegas aciertan CERO, y las cuatro se APLICAN', () => {
    for (const e of [CALCO_ESPANOL, CALCO_PORTUGUES, SIN_REDUCIR, PERIFRASTICA])
      expect(correr(e, ITEMS).aciertos, e.nombre).toBe(0);
    const aplica = (e: typeof CALCO_ESPANOL) => ITEMS.filter((x) =>
      e.aplicar({ s: x.s, instruccion: x.instruccion, hint: x.hint, foco: x.foco }, []) !== null).length;
    for (const e of [CALCO_ESPANOL, CALCO_PORTUGUES, SIN_REDUCIR, PERIFRASTICA])
      expect(aplica(e), e.nombre).toBe(1);
  });

  it('la constante «+se» NO resuelve el ítem: quitar el sujeto y poner «se» acierta 0/1', () => {
    const soloSe = {
      nombre: 'quitar el sujeto y añadir «se», sin clítico de dativo',
      aplicar: (x: { s: string }) => x.s.replace(/^Profesorul /u, '').replace(/^d/u, 'se d'),
    };
    expect(correr(soloSe, ITEMS).aciertos).toBe(0);
  });

  it('la consigna cierra las DOS respuestas buenas que la versión anterior dejaba pasar', () => {
    const c = uno(XS()).instruccion;
    // La perifrástica en PLURAL no usa «este» ni «a fost»: usa «sunt».
    // Enumerar cadenas no basta; hay que prohibir el verbo.
    expect(c).toMatch(/sin usar «a fi»/);
    expect(c).toMatch(/ni participio/);
    expect(c).not.toMatch(/sin «este» ni «a fost»/);
    // «cineva» es SUJETO, así que «no añadas ningún complemento» no lo
    // tocaba; y en el impersonal de 3.ª pl «cărțile» es OBJETO.
    expect(c).toMatch(/sea el sujeto de la frase/);
    expect(c).not.toMatch(/No añadas ningún complemento/);
  });
});

describe('lote 30 · los gates propios, EN ROJO', () => {
  // EL GATE QUE SOSTIENE EL PISO DE 1. Sin él, «completar el lote a ocho»
  // metería celdas cuya clave suspende rumano atestado.
  it('ROJO · cualquier persona que no sea la 3.ª plural suspendería lengua atestada', () => {
    const xs = rehacer((x) => { (uno(x).d as { persona: string }).persona = '3sg'; });
    expect(revisar(xs).join(' | ')).toMatch(/la única celda determinada es la 3\.ª PLURAL/);
  });

  it('ROJO · el clítico sin reducir ante «se» publica la variante que el ítem existe para castigar', () => {
    const xs = rehacer((x) => { uno(x).nucleo = 'le se dau'; });
    expect(revisar(xs).join(' | ')).toMatch(/SIN reducir/);
  });

  it('ROJO · el dativo DETRÁS de «se» —el calco español— no pasa el gate del núcleo', () => {
    const xs = rehacer((x) => { uno(x).nucleo = 'se le dau'; });
    expect(revisar(xs).join(' | ')).toMatch(/tiene que empezar por «li se»/);
  });

  // LA CLÁUSULA QUE DECIDE SI EL ÍTEM MIDE ALGO.
  it('ROJO · sin la cláusula de anteposición el ítem no está determinado', () => {
    const xs = rehacer((x) => {
      uno(x).instruccion = uno(x).instruccion.replace(/empieza la frase por «[^»]+» y /u, '');
    });
    expect(revisar(xs).join(' | ')).toMatch(/no mide nada/);
  });

  // ⚠ ESTE ES EL TESTIGO DEL DEFECTO QUE TUMBÓ LA PRIMERA VERSIÓN.
  it('ROJO · sin prohibir «a fi» entero, «Copiilor le sunt date cărțile» es otra respuesta correcta', () => {
    const xs = rehacer((x) => {
      uno(x).instruccion = uno(x).instruccion.replace(/sin usar «a fi» \(este, e, sunt, a fost…\) /u, '');
    });
    expect(revisar(xs).join(' | ')).toMatch(/en plural la perifrástica usa «sunt»/);
  });

  it('ROJO · sin prohibir el participio, la perifrástica entra por la otra mitad', () => {
    const xs = rehacer((x) => {
      uno(x).instruccion = uno(x).instruccion.replace(/ ni participio/u, '');
    });
    expect(revisar(xs).join(' | ')).toMatch(/la otra mitad/);
  });

  // ⚠ Y ÉSTE ES EL SEGUNDO: el impersonal de 3.ª plural y el sujeto
  //   indefinido, los dos rumano correcto.
  it('ROJO · sin exigir que el objeto sea SUJETO, el impersonal de 3.ª pl y «cineva» quedan abiertos', () => {
    const xs = rehacer((x) => {
      uno(x).instruccion = uno(x).instruccion.replace(/, y que «[^»]+» sea el sujeto de la frase/u, '');
    });
    expect(revisar(xs).join(' | ')).toMatch(/impersonal de 3\.ª plural|cineva/);
  });

  it('ROJO · una consigna que nombre el clítico regala la respuesta', () => {
    const xs = rehacer((x) => { uno(x).instruccion += ' Pon el pronombre delante.'; });
    expect(revisar(xs).join(' | ')).toMatch(/regala la respuesta/);
  });

  it('ROJO · un segundo ítem rompe el piso declarado', () => {
    const xs = rehacer((x) => { x.push(JSON.parse(JSON.stringify(uno(x))) as Construido); });
    expect(revisar(xs).join(' | ')).toMatch(/el piso declarado del punto es 1/);
  });
});
