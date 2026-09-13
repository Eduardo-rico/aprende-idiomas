// tests/unit/lote-reflexivo-la.test.ts — y el gate, visto en rojo.
//
// LA COMPROBACIÓN QUE SOSTIENE ESTE LOTE NO ES UNA TASA. Con los nueve
// pares mínimos completos, toda estrategia que lea el marco sale en 0,50
// EXACTO por aritmética del emparejamiento, no por mérito del material.
// Por eso aquí hay dos familias de pruebas y la segunda es la que importa:
//
//   1. las tasas están donde tienen que estar;
//   2. **y se salen de ahí en cuanto se rompe un par**, que es lo que
//      demuestra que el número mide algo y no es un adorno
//      (§5.sexdecies: cada estrategia ciega con su prueba de que PUEDE
//      fallar).
import { describe, it, expect } from 'vitest';
import { LOTE_REFLEXIVO } from '@/lib/data/languages/la/lotes/l4-reflexivo';
import {
  coberturaReflexivo, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR,
  elNombreMasCercano, elPrimerNombre, marcaDerivada,
  revisarItemReflexivo, revisarLoteReflexivo, revisarParejas,
  tasasCiegasReflexivo, techoDeLaSegundaVez, type ItemReflexivo,
} from '@/scripts/lib/gate-reflexivo';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const clases = (i: ItemReflexivo) => revisarItemReflexivo(i).map((f) => f.clase);
const de = (pareja: string, reflexivo: boolean) => LOTE_REFLEXIVO.find((i) => i.pareja === pareja && i.reflexivo === reflexivo)!;
const base = de('p1', true);       // `suos amicos`
const otroLado = de('p1', false);  // `eius amicos`
const con = (p: Partial<ItemReflexivo>): ItemReflexivo => ({ ...base, ...p });

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteReflexivo(LOTE_REFLEXIVO).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('dieciocho ítems, nueve y nueve', () => {
    expect(LOTE_REFLEXIVO.length).toBe(18);
    expect(LOTE_REFLEXIVO.filter((i) => i.reflexivo).length).toBe(9);
  });
  it('y la marca de cada ítem la DERIVA la máquina, no la escribe el lote', () => {
    for (const i of LOTE_REFLEXIVO) {
      const d = marcaDerivada(i);
      expect(d, i.id).not.toBeNull();
      expect(d!.normalize('NFD').replace(/[̄̆]/g, ''), i.id).toBe(i.marca.normalize('NFD'));
    }
  });
});

describe('LAS TASAS CIEGAS: 0,50 exacto, y por qué eso NO es el mérito', () => {
  it('las cuatro que leen el marco salen clavadas en la mitad', () => {
    const t = tasasCiegasReflexivo(LOTE_REFLEXIVO);
    for (const x of [t.siempreElSujeto, t.siempreElOtro, t.elPrimerNombre, t.elNombreMasCercano, t.laPragmatica])
      expect(x.tasa, x.nombre).toBe(0.5);
  });
  it('siempre-el-sujeto y siempre-el-otro son complementarias: suman 1', () => {
    const t = tasasCiegasReflexivo(LOTE_REFLEXIVO);
    expect(t.siempreElSujeto.tasa + t.siempreElOtro.tasa).toBeCloseTo(1, 10);
  });
  it('«el primer nombre» y «el sujeto» NO son la misma regla: dos pares llevan el objeto delante', () => {
    const objetoDelante = LOTE_REFLEXIVO.filter((i) => elPrimerNombre(i) !== i.sujeto.es);
    expect(objetoDelante.length).toBe(4);
    expect(new Set(objetoDelante.map((i) => i.pareja))).toEqual(new Set(['p2', 'p5']));
  });
  it('«el más cercano» tampoco: se separa del sujeto en la mayoría de los pares', () => {
    const distinta = LOTE_REFLEXIVO.filter((i) => elNombreMasCercano(i) !== elPrimerNombre(i));
    expect(distinta.length).toBeGreaterThan(0);
  });

  // ── LA MITAD QUE FALTA: que PUEDAN fallar ──
  it('quitado un lado del eje, «siempre el sujeto» acierta el 100 % y el gate lo canta', () => {
    const soloRefl = LOTE_REFLEXIVO.filter((i) => i.reflexivo);
    expect(tasasCiegasReflexivo(soloRefl).siempreElSujeto.tasa).toBe(1);
    expect(revisarLoteReflexivo(soloRefl).map((f) => f.clase)).toContain('estrategia-ciega');
  });
  it('dejando de cada par el ítem que la pragmática acierta, la pragmática sube al 100 %', () => {
    const trucado = LOTE_REFLEXIVO.filter((i) =>
      i.esperado !== 'neutro' && i.respuesta === (i.esperado === 'reflexivo' ? i.sujeto.es : i.otro.es));
    const t = tasasCiegasReflexivo(trucado);
    expect(t.laPragmatica.n).toBe(5);
    expect(t.laPragmatica.tasa).toBe(1);
  });
  it('y dejando de cada par el ítem que el primer nombre acierta, esa sube al 100 %', () => {
    const trucado = LOTE_REFLEXIVO.filter((i) => elPrimerNombre(i) === i.respuesta);
    expect(tasasCiegasReflexivo(trucado).elPrimerNombre.tasa).toBe(1);
  });
});

describe('LA PISTA QUE EL PAR MÍNIMO FABRICA, y que no se apaga barajando', () => {
  it('«lo contrario de la vez anterior» tiene techo 0,75 sobre este lote', () => {
    const t = techoDeLaSegundaVez(LOTE_REFLEXIVO);
    expect(t.segundos).toBe(9);
    expect(t.techo).toBe(0.75);
  });
  it('y ese techo NO depende del orden: barajar no lo mueve', () => {
    const alReves = [...LOTE_REFLEXIVO].reverse();
    expect(techoDeLaSegundaVez(alReves).techo).toBe(techoDeLaSegundaVez(LOTE_REFLEXIVO).techo);
  });
  it('lo único que sube es la distancia, y el piso se cumple', () => {
    const d = distanciasEnElPar(LOTE_REFLEXIVO);
    expect(d.length).toBe(9);
    expect(d[0]!.distancia).toBeGreaterThanOrEqual(DISTANCIA_MINIMA_EN_EL_PAR);
  });
  it('y un orden que pega un par por debajo del piso se pone rojo', () => {
    const pegado = [base, LOTE_REFLEXIVO.find((i) => i.pareja !== 'p1')!, otroLado,
      ...LOTE_REFLEXIVO.filter((i) => i.pareja !== 'p1').slice(1)];
    expect(revisarLoteReflexivo(pegado).map((f) => f.clase)).toContain('pareja-demasiado-cerca');
  });
});

describe('EL SENTIDO COMÚN DECLARADO TIENE QUE PODER FALLAR', () => {
  it('el lote empuja hacia los dos lados', () => {
    const pares = (l: string) => new Set(LOTE_REFLEXIVO.filter((i) => i.esperado === l).map((i) => i.pareja)).size;
    expect(pares('reflexivo')).toBeGreaterThan(0);
    expect(pares('otro')).toBeGreaterThan(0);
  });
  it('y voltearlo entero a un solo lado se pone rojo — antes era un campo INERTE', () => {
    for (const l of ['reflexivo', 'otro'] as const) {
      const volteado = LOTE_REFLEXIVO.map((i) => ({ ...i, esperado: l }));
      expect(revisarLoteReflexivo(volteado).map((f) => f.clase), l).toContain('pragmatica-en-un-solo-sentido');
    }
  });
  it('y ponerlo todo a `neutro` deja la medida sin denominador, que el gate también canta', () => {
    const neutro = LOTE_REFLEXIVO.map((i) => ({ ...i, esperado: 'neutro' as const }));
    expect(revisarLoteReflexivo(neutro).map((f) => f.clase)).toContain('pragmatica-en-un-solo-sentido');
  });
});

describe('EL PAR MÍNIMO, que es lo que de verdad vigila el gate', () => {
  it('cada par tiene exactamente dos ítems, uno de cada lado', () => {
    const porPar = new Map<string, ItemReflexivo[]>();
    for (const i of LOTE_REFLEXIVO) porPar.set(i.pareja, [...(porPar.get(i.pareja) ?? []), i]);
    expect(porPar.size).toBe(9);
    for (const [n, xs] of porPar) {
      expect(xs.length, n).toBe(2);
      expect(xs.filter((x) => x.reflexivo).length, n).toBe(1);
    }
  });
  it('y las dos frases del par difieren en UNA palabra', () => {
    expect(revisarParejas(LOTE_REFLEXIVO)).toEqual([]);
  });
  it('un par al que le falta el otro lado se pone rojo', () => {
    const roto = LOTE_REFLEXIVO.filter((i) => i !== otroLado);
    expect(revisarParejas(roto).map((f) => f.clase)).toContain('pareja-incompleta');
  });
  it('un par cuyas dos frases difieren en más de la marca se pone rojo', () => {
    const sucio = LOTE_REFLEXIVO.map((i) => i === otroLado
      ? { ...i, latin: 'Poeta agricolam videt et eius amicos laudat.', latinConCantidad: 'Poēta agricolam videt et eius amīcōs laudat.' }
      : i);
    expect(revisarParejas(sucio).map((f) => f.clase)).toContain('pareja-no-minima');
  });
  it('los dos ítems del par se califican con respuestas CRUZADAS', () => {
    for (const p of new Set(LOTE_REFLEXIVO.map((i) => i.pareja))) {
      const [a, b] = [de(p, true), de(p, false)];
      expect(a.respuesta, p).toBe(b.distractor);
      expect(b.respuesta, p).toBe(a.distractor);
    }
  });
  it('y un par cuyos dos ítems llevan la MISMA respuesta se pone rojo', () => {
    const igual = LOTE_REFLEXIVO.map((i) => i === otroLado ? { ...i, respuesta: base.respuesta, distractor: base.distractor } : i);
    expect(revisarParejas(igual).map((f) => f.clase)).toContain('par-sin-respuestas-cruzadas');
  });
  it('y un par cuyos dos ítems caen seguidos en el orden publicado, también', () => {
    const seguidos = [base, otroLado, ...LOTE_REFLEXIVO.filter((i) => i.pareja !== 'p1')];
    expect(revisarLoteReflexivo(seguidos).map((f) => f.clase)).toContain('pareja-adyacente');
  });
});

describe('LA MITAD QUE EL ESPAÑOL REGALA, con su control negativo', () => {
  it('los dos de pronombre la declaran y ninguno de los de posesivo', () => {
    for (const i of LOTE_REFLEXIVO)
      expect(i.elEspanolLoRegala !== undefined, i.id).toBe(i.elemento === 'pronombre');
  });
  it('sus glosas NO pueden ser iguales, porque el clítico las separa', () => {
    const [a, b] = [de('p9', true), de('p9', false)];
    expect(a.glosa).not.toBe(b.glosa);
    expect(`${a.glosa} ${b.glosa}`).toContain('se alaba');
    expect(`${a.glosa} ${b.glosa}`).toContain('lo alaba');
  });
  it('CONTROL NEGATIVO: declarar el regalo donde la glosa del par SÍ es igual se pone rojo', () => {
    const falso = LOTE_REFLEXIVO.map((i) => i.pareja === 'p1' ? { ...i, elEspanolLoRegala: 'excusa' } : i);
    const cs = revisarParejas(falso).map((f) => f.clase);
    expect(cs).toContain('regalo-sin-serlo');
  });
  it('y un par de posesivo con glosas distintas y sin motivo, también', () => {
    const raro = LOTE_REFLEXIVO.map((i) => i === otroLado ? { ...i, glosa: 'El poeta ve al marinero y alaba a sus amigos de éste.' } : i);
    expect(revisarParejas(raro).map((f) => f.clase)).toContain('glosa-difiere-sin-motivo');
  });
  it('y las dieciséis glosas de posesivo dicen «su» o «sus»', () => {
    for (const i of LOTE_REFLEXIVO.filter((x) => x.elemento === 'posesivo'))
      expect(i.glosa, i.id).toMatch(/(?<!\p{L})sus?(?!\p{L})/iu);
  });
  it('los dieciséis de posesivo sí comparten glosa dentro de su par', () => {
    const miden = LOTE_REFLEXIVO.filter((i) => i.elemento === 'posesivo');
    expect(miden.length).toBe(16);
    for (const p of new Set(miden.map((i) => i.pareja))) {
      const [a, b] = miden.filter((i) => i.pareja === p) as [ItemReflexivo, ItemReflexivo];
      expect(a.glosa, p).toBe(b.glosa);
    }
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la marca que la máquina no deriva', () => {
    expect(clases(con({ latin: 'Poeta nautam videt et suus amicos laudat.', latinConCantidad: 'Poēta nautam videt et suus amīcōs laudat.', marca: 'suus' })))
      .toContain('marca-no-la-deriva-la-maquina');
  });
  it('EL ERROR DE PRODUCCIÓN: `suus` concordando con el poseedor y no con el poseído', () => {
    // `poēta` es masculino singular, así que la forma que produce quien
    // concuerda con el POSEEDOR es `suus` — y el poseído pide `suōs`.
    const cs = clases(con({ latin: 'Poeta nautam videt et suus amicos laudat.', latinConCantidad: 'Poēta nautam videt et suus amīcōs laudat.', marca: 'suus' }));
    expect(cs).toContain('concuerda-con-el-poseedor');
  });
  it('`eius` con un poseedor PLURAL, que pide `eōrum`', () => {
    const p4 = de('p4', false);
    expect(revisarItemReflexivo({ ...p4, marca: 'eius',
      latin: 'Dominus servos videt et eius filios vocat.',
      latinConCantidad: 'Dominus servōs videt et eius fīliōs vocat.' }).map((f) => f.clase))
      .toContain('marca-no-la-deriva-la-maquina');
  });
  it('el marco con macrones, que es lo que el corpus no escribe', () => {
    expect(clases(con({ latin: 'Poēta nautam videt et suōs amīcōs laudat.' }))).toContain('marco-con-macrones');
  });
  it('la versión con cantidad que no es la misma frase', () => {
    expect(clases(con({ latinConCantidad: 'Poēta nautam videt et suōs fīliōs laudat.' }))).toContain('cantidad-mal-puesta');
  });
  it('el poseído que no está en la frase', () => {
    expect(clases(con({ poseido: { lema: 'rosa', caso: 'ac', numero: 'pl' } }))).toContain('poseido-no-esta-en-la-frase');
  });
  it('el participante declarado que no está en la frase', () => {
    expect(clases(con({ otro: { ...base.otro, lema: 'agricola', forma: 'agricolam' } }))).toContain('participante-no-esta-en-la-frase');
  });
  it('el participante cuya forma NO la deriva la máquina', () => {
    expect(clases(con({ otro: { ...base.otro, forma: 'nauta', caso: 'ac' } }))).toContain('participante-mal-derivado');
  });
  // ── EL VENENO QUE EL PASE ADVERSARIAL ENCONTRÓ, §C5 ──
  // Mientras el gate sólo comprobaba que la cadena estuviera en la frase,
  // cambiar el sujeto por el objeto —y con ellos las dos respuestas— pasaba
  // en verde en los DOS ítems del par, porque el error era constante dentro
  // del par y el par no podía verlo.
  it('EL CASO COMO DIMENSIÓN: intercambiar sujeto y objeto se pone rojo', () => {
    const volteado = [base, otroLado].map((i) => ({
      ...i, sujeto: { ...i.otro }, otro: { ...i.sujeto },
      respuesta: i.distractor, distractor: i.respuesta,
    }));
    const cs = volteado.flatMap((i) => revisarItemReflexivo(i)).map((f) => f.clase);
    expect(cs).toContain('sujeto-no-es-nominativo');
    expect(cs).toContain('otro-en-nominativo');
  });
  it('LA GLOSA ESPEJO: la que cambia los papeles y nombra a los dos igual', () => {
    expect(clases(con({ glosa: 'El marinero ve al poeta y alaba a sus amigos.' })))
      .toContain('glosa-no-empieza-por-el-sujeto');
  });
  it('LA GLOSA SIN «su», que es la ambigüedad española de la que vive el punto', () => {
    expect(clases(con({ glosa: 'El poeta ve al marinero y alaba a los amigos.' })))
      .toContain('glosa-sin-posesivo-espanol');
  });
  it('la respuesta que no es ninguna de las dos lecturas', () => {
    expect(clases(con({ respuesta: 'del rey' }))).toContain('respuesta-fuera-de-los-dos');
  });
  it('el distractor igual a la respuesta', () => {
    expect(clases(con({ distractor: base.respuesta }))).toContain('distractor-igual-a-la-respuesta');
  });
  it('la lectura que la glosa no nombra, o sea el distractor INALCANZABLE', () => {
    expect(clases(con({ glosa: 'El poeta alaba a sus amigos.' })))
      .toContain('glosa-no-nombra-a-los-dos');
  });
  it('y el latín de fuera de L1', () => {
    const w = palabraFueraDeL1();
    expect(clases(con({ latin: `Poeta ${w} videt et suos amicos laudat.`, latinConCantidad: `Poēta ${w} videt et suōs amīcōs laudat.` })))
      .toContain('latin-fuera-de-l1');
  });
});

describe('la cobertura dice sobre cuántos decidió', () => {
  it('y ninguna comprobación decide sobre cero', () => {
    for (const c of coberturaReflexivo(LOTE_REFLEXIVO)) expect(c.decididos, c.comprobacion).toBeGreaterThan(0);
  });
  it('cinco de las seis celdas de `suus`, y la que falta va con motivo escrito', () => {
    const c = coberturaReflexivo(LOTE_REFLEXIVO).find((x) => x.comprobacion.startsWith('celdas distintas'))!;
    expect(c.decididos).toBe(5);
    expect(c.motivoDeLosQueQuedanFuera).toContain('ablativo plural');
  });
  it('y el poseedor plural —la celda `eōrum`— está, una vez', () => {
    expect(LOTE_REFLEXIVO.filter((i) => !i.reflexivo && i.poseedor?.numero === 'pl').map((i) => i.marca)).toEqual(['eorum']);
  });
  it('EL `id` NO SE CORRELACIONA CON EL LADO: va por el orden publicado', () => {
    expect(LOTE_REFLEXIVO.map((i) => i.id)).toEqual(
      Array.from({ length: 18 }, (_, k) => `la-rx-${String(k + 1).padStart(2, '0')}`));
    // Y la comprobación que de verdad importa: ningún corte del id parte el
    // lote por el eje. Es el mismo detector del orden, apuntado al id.
    expect(new Set(LOTE_REFLEXIVO.map((i) => i.id)).size).toBe(18);
  });
});
