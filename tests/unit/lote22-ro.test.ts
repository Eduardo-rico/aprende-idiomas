// tests/unit/lote22-ro.test.ts — LOS GATES DEL LOTE 22, VISTOS EN ROJO.
//
// Cada gate con el ítem que lo pasa y el que lo suspende (§4.18). Y los
// testigos rojos NO son inventados: los seis salen de las prohibiciones
// que el lingüista escribió sobre este punto, todas medidas en el corpus.
// Un gate escrito a raíz de un hallazgo cuyo testigo es inventado se
// aprueba a sí mismo (§4.27).
import { describe, it, expect } from 'vitest';
import { ITEMS, MARCOS_PROHIBIDOS, verificar } from '../../scripts/lotes/corr-ro-l22';
import type { ItemCorreccion } from '../../scripts/lib/correccion';

const SUP = 'r7-supin';
const base = { p: SUP, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false } as const;
/** Sólo los avisos de ESTE lote: `verificar` llama antes al gate base y
 *  un testigo a mano dispara además los suyos. Sin el filtro el test
 *  pasaría por el motivo equivocado. */
const solo = (xs: ItemCorreccion[], frag: string) => verificar(xs).filter((s) => s.includes(frag));

describe('lote 22 · el lote publicable', () => {
  it('sale limpio y son 5 ítems de r7-supin', () => {
    expect(verificar(ITEMS)).toEqual([]);
    expect(ITEMS).toHaveLength(5);
    expect(ITEMS.every((x) => x.p === SUP)).toBe(true);
  });
  it('dos ejes: el calco «de a» y la frontera, en sus dos direcciones', () => {
    expect(ITEMS.filter((x) => x.origenError === 'calco')).toHaveLength(2);
    expect(ITEMS.filter((x) => x.origenError === 'sobreaplicacion')).toHaveLength(3);
  });
});

describe('gate 1 · los marcos donde la mala NO es una mala', () => {
  it('SUSPENDE el marco «e greu de», que admite «de a» ATESTADO', () => {
    const rojo: ItemCorreccion = { ...base, origenError: 'calco',
      mala: 'Este greu de a crede povestea asta.', buena: 'Este greu de crezut povestea asta.',
      calcoEs: 'Es difícil de creer esta historia.', explicacion: 'x' };
    expect(solo([rojo], 'arcaica, no agramatical')).toHaveLength(1);
  });
  it('SUSPENDE el marco de «a avea» + ceva/multe/nimic', () => {
    const rojo: ItemCorreccion = { ...base, origenError: 'calco',
      mala: 'Am ceva de a spune aici.', buena: 'Am ceva de spus aici.',
      calcoEs: 'Tengo algo que decir aquí.', explicacion: 'x' };
    expect(solo([rojo], 'a avea» + supino admite')).toHaveLength(1);
  });
  it('SUSPENDE el idioma «a avea de-a face»', () => {
    const rojo: ItemCorreccion = { ...base, origenError: 'calco',
      mala: 'Nu am de-a face cu asta.', buena: 'Nu am de făcut cu asta.',
      calcoEs: 'No tengo nada que ver con esto.', explicacion: 'x' };
    expect(solo([rojo], 'idioma vivo')).toHaveLength(1);
  });
  it('SUSPENDE «trebuie», que en Moldavia rige supino de verdad', () => {
    const rojo: ItemCorreccion = { ...base, origenError: 'sobreaplicacion',
      mala: 'Trebuie de făcut curat în casă.', buena: 'Trebuie să facem curat în casă.',
      calcoEs: 'Hay que limpiar la casa.', explicacion: 'x' };
    expect(solo([rojo], 'REGIONALISMO MOLDAVO')).toHaveLength(1);
  });
  it('APRUEBA «a face» en marco de supino SIN «a avea» — es lengua corriente', () => {
    // La v0 del gate prohibía «a face» en cualquier marco y cazó un ítem
    // BUENO. El corpus fijó el alcance: «ce e de făcut» 32, «nimic de
    // făcut» 4, y 23 de las 29 «de-a face» van bajo «a avea».
    expect(solo(ITEMS, 'idioma vivo')).toHaveLength(0);
    expect(ITEMS.some((x) => /de f[ăa]cut/.test(x.buena))).toBe(true);
  });
});

describe('gate 2 · «de» + infinitivo corto no se usa como mala', () => {
  it('SUSPENDE la mala que el inventario declaraba', () => {
    // `*mașină de spăla` era la mala DECLARADA del punto: agramatical y
    // aun así improducible por un hispanohablante, y homógrafa de «de»
    // conjuncional + perfecto simple. El testigo es el hallazgo mismo.
    const rojo: ItemCorreccion = { ...base, origenError: 'calco',
      mala: 'Am cumpărat o mașină de spăla.', buena: 'Am cumpărat o mașină de spălat.',
      calcoEs: 'He comprado una máquina de lavar.', explicacion: 'x' };
    expect(solo([rojo], 'infinitivo CORTO')).toHaveLength(1);
  });
  it('APRUEBA la mala con partícula, que es la que se produce', () => {
    expect(solo(ITEMS, 'infinitivo CORTO')).toHaveLength(0);
  });
});

describe('gate 3 · el ítem de concordancia no usa lemas homógrafos', () => {
  it('SUSPENDE «de spuse», que es rumano correcto', () => {
    const rojo: ItemCorreccion = { ...base, origenError: 'sobreaplicacion', atajoEs: true,
      mala: 'Am multe de spuse.', buena: 'Am multe de spus.',
      calcoEs: 'Tengo muchas cosas que decir.', explicacion: 'x' };
    expect(solo([rojo], 'homógrafo del perfecto simple')).toHaveLength(1);
  });
  it('APRUEBA «de spălate» y «de făcute», sin homógrafo', () => {
    expect(solo(ITEMS, 'homógrafo del perfecto simple')).toHaveLength(0);
  });
});

describe('gate 4 · el supino de la BUENA es invariable', () => {
  it('SUSPENDE la buena que lleva el plural — enseñaría la mala', () => {
    const rojo: ItemCorreccion = { ...base, origenError: 'sobreaplicacion', atajoEs: true,
      mala: 'Am două cămăși de spălat.', buena: 'Am două cămăși de spălate.',
      calcoEs: 'Tengo dos camisas para lavar.', explicacion: 'x' };
    expect(solo([rojo], 'la BUENA lleva')).toHaveLength(1);
  });
  it('APRUEBA las cinco buenas del lote', () => {
    expect(solo(ITEMS, 'la BUENA lleva')).toHaveLength(0);
  });
});

describe('gate 5 · el punto necesita sus DOS caras (§0.6)', () => {
  it('SUSPENDE el lote sin ítems de sobreaplicación', () => {
    const soloCalcos = ITEMS.filter((x) => x.origenError === 'calco');
    const relleno = [...soloCalcos, ...soloCalcos];
    expect(solo(relleno, 'ningún ítem de SOBREAPLICACIÓN')).toHaveLength(1);
  });
  it('SUSPENDE el lote sin ítems de calco', () => {
    const soloFront = ITEMS.filter((x) => x.origenError === 'sobreaplicacion');
    expect(solo([...soloFront, soloFront[0]!], 'ningún ítem examina el calco')).toHaveLength(1);
  });
  it('APRUEBA el lote, que lleva las dos', () => {
    expect(solo(ITEMS, 'ningún ítem')).toHaveLength(0);
  });
});

describe('gate 6 · las DOS direcciones de la sobreaplicación', () => {
  it('SUSPENDE si falta la cara de la CONCORDANCIA', () => {
    const sinConc = ITEMS.filter((x) => !/de\s+[\p{L}]+e(?![\p{L}])/u.test(x.mala));
    expect(solo(sinConc, 'falta la cara de la CONCORDANCIA')).toHaveLength(1);
  });
  it('SUSPENDE si falta la cara del MARCO equivocado', () => {
    const sinMarco = ITEMS.filter((x) => !/vreau de/i.test(x.mala));
    expect(solo(sinMarco, 'falta la cara del MARCO')).toHaveLength(1);
  });
  it('APRUEBA el lote, que lleva las dos direcciones', () => {
    expect(solo(ITEMS, 'falta la cara')).toHaveLength(0);
  });
});

describe('los marcos prohibidos están declarados con su medición', () => {
  it('son cinco y cada uno dice POR QUÉ su mala no es una mala', () => {
    expect(MARCOS_PROHIBIDOS).toHaveLength(5);
    for (const m of MARCOS_PROHIBIDOS) expect(m.motivo.length).toBeGreaterThan(60);
  });
});
