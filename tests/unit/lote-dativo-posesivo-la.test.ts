// tests/unit/lote-dativo-posesivo-la.test.ts — y el gate, visto en rojo.
//
// EL GATE SALIÓ EN ROJO DOS VECES AL ESCRIBIRLO, y las dos por algo real:
//
//   1. `respuesta-sin-tener` en «Tengo alegría.» — el regex de «tener» era
//      sensible a mayúsculas y la primera persona empieza la frase. Un
//      gate que no caza la primera palabra de la frase habría dejado pasar
//      cualquier traducción que empezara por el verbo.
//   2. `pareja-adyacente` en tres pares — el orden publicado ponía los dos
//      miembros seguidos y «lo contrario del anterior» los acertaba sin
//      latín.
import { describe, it, expect } from 'vitest';
import { LOTE_DATIVO_POSESIVO } from '@/lib/data/languages/la/lotes/l3-dativo-posesivo';
import {
  coberturaDativo, dativoDerivado, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR,
  revisarItemDativo, revisarLoteDativo, revisarParejasDativo, tasasCiegasDativo,
  techoDeLaSegundaVez, type ItemDativoPosesivo,
} from '@/scripts/lib/gate-dativo-posesivo';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const clases = (i: ItemDativoPosesivo) => revisarItemDativo(i).map((f) => f.clase);
const de = (pareja: string, lectura: 'posesion' | 'ci') =>
  LOTE_DATIVO_POSESIVO.find((i) => i.pareja === pareja && i.lectura === lectura)!;
const pos = de('n1', 'posesion');  // Puero nomen est.
const ci = de('n1', 'ci');         // Puero nomen dicit.
const con = (p: Partial<ItemDativoPosesivo>): ItemDativoPosesivo => ({ ...pos, ...p });

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteDativo(LOTE_DATIVO_POSESIVO).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('dieciséis ítems, ocho y ocho', () => {
    expect(LOTE_DATIVO_POSESIVO.length).toBe(16);
    expect(LOTE_DATIVO_POSESIVO.filter((i) => i.lectura === 'posesion').length).toBe(8);
  });
  it('y el dativo de cada ítem lo deriva la máquina, del lexicón o de los personales', () => {
    for (const i of LOTE_DATIVO_POSESIVO) {
      const d = dativoDerivado(i.dativo);
      expect(d, i.id).not.toBeNull();
      expect(d!.normalize('NFD').replace(/[̄̆]/g, ''), i.id).toBe(i.dativo.forma.normalize('NFD'));
    }
  });
});

describe('LAS DOS LECTURAS: sin la de complemento indirecto se instala «dativo ⇒ tener»', () => {
  it('las dos ciegas son complementarias y ninguna pasa del listón', () => {
    const t = tasasCiegasDativo(LOTE_DATIVO_POSESIVO);
    expect(t.siempreConTener.tasa + t.siempreConAPara.tasa).toBeCloseTo(1, 10);
    expect(t.siempreConTener.tasa).toBe(0.5);
  });
  it('y un lote de sólo posesivos lo dice: «siempre con TENER» al 100 %', () => {
    const soloPos = LOTE_DATIVO_POSESIVO.filter((i) => i.lectura === 'posesion');
    expect(tasasCiegasDativo(soloPos).siempreConTener.tasa).toBe(1);
    const cs = revisarLoteDativo(soloPos).map((f) => f.clase);
    expect(cs).toContain('estrategia-ciega');
    expect(cs).toContain('varia-incompleto');
  });
});

describe('EL PAR MÍNIMO SÓLO EXISTE CON UN NEUTRO, y el gate lo deriva del género', () => {
  it('los seis pares de neutro son mínimos y los dos de masculino/femenino no', () => {
    for (const i of LOTE_DATIVO_POSESIVO)
      expect(i.parMinimo, `${i.id} ${i.poseido.lema}`).toBe(['nōmen', 'gaudium', 'signum'].includes(i.poseido.lema));
  });
  it('y en los mínimos las dos frases difieren SÓLO en el verbo', () => {
    expect(revisarParejasDativo(LOTE_DATIVO_POSESIVO)).toEqual([]);
    const [a, b] = [de('n1', 'posesion'), de('n1', 'ci')];
    expect(a.latin.replace(a.verbo, '§')).toBe(b.latin.replace(b.verbo, '§'));
  });
  it('en los NO mínimos difieren también en el caso del poseído, y eso es lo que enseñan', () => {
    const [a, b] = [de('m1', 'posesion'), de('m1', 'ci')];
    expect(new Set([a.poseido.caso, b.poseido.caso])).toEqual(new Set(['nom', 'ac']));
    expect(`${a.latin} ${b.latin}`).toContain('filius');
    expect(`${a.latin} ${b.latin}`).toContain('filium');
  });
  it('CONTROL: declarar mínimo un par de masculino se pone rojo', () => {
    const falso = LOTE_DATIVO_POSESIVO.map((i) => i.pareja === 'm1' ? { ...i, parMinimo: true } : i);
    expect(revisarParejasDativo(falso).map((f) => f.clase)).toContain('par-minimo-mal-declarado');
  });
  it('y declarar NO mínimo un par de neutro, también', () => {
    const falso = LOTE_DATIVO_POSESIVO.map((i) => i.pareja === 'n1' ? { ...i, parMinimo: false } : i);
    expect(revisarParejasDativo(falso).map((f) => f.clase)).toContain('par-minimo-mal-declarado');
  });
  it('el error diana del lado de CI es literalmente la respuesta posesiva del par', () => {
    for (const p of new Set(LOTE_DATIVO_POSESIVO.map((i) => i.pareja))) {
      const xs = LOTE_DATIVO_POSESIVO.filter((i) => i.pareja === p);
      expect(xs.find((x) => x.lectura === 'ci')!.elErrorDiana, p)
        .toBe(xs.find((x) => x.lectura === 'posesion')!.respuesta);
    }
  });
  it('y si no lo es, el gate lo dice', () => {
    const roto = LOTE_DATIVO_POSESIVO.map((i) => i === ci ? { ...i, elErrorDiana: 'El rey tiene un hijo.' } : i);
    expect(revisarParejasDativo(roto).map((f) => f.clase)).toContain('error-diana-no-es-la-respuesta-del-par');
  });
});

describe('LA CONCORDANCIA CRUZADA: el latín concuerda con el poseído y el español con el poseedor', () => {
  it('las dos direcciones están en el lote', () => {
    const p = LOTE_DATIVO_POSESIVO.filter((i) => i.lectura === 'posesion');
    expect(p.some((i) => i.dativo.numero === 'sg' && i.poseido.numero === 'pl'), 'plural latino, singular español').toBe(true);
    expect(p.some((i) => i.dativo.numero === 'pl' && i.poseido.numero === 'sg'), 'singular latino, plural español').toBe(true);
  });
  it('«Regi signa sunt» lleva `sunt` en latín y «tiene» en español', () => {
    const i = de('n3', 'posesion');
    expect(i.verbo).toBe('sunt');
    expect(i.respuesta).toContain('tiene');
    expect(i.respuesta).not.toContain('tienen');
  });
  it('y «Pueris nomen est» al revés: `est` en latín y «tienen» en español', () => {
    const i = de('n4', 'posesion');
    expect(i.verbo).toBe('est');
    expect(i.respuesta).toContain('tienen');
  });
  it('el gate caza el número español copiado del latín', () => {
    const i = de('n3', 'posesion');
    expect(revisarItemDativo({ ...i, respuesta: 'El rey tienen señales.' }).map((f) => f.clase))
      .toContain('numero-del-verbo-espanol');
  });
  it('y el número latino copiado del poseedor', () => {
    const i = de('n3', 'posesion');
    expect(revisarItemDativo({ ...i, verbo: 'est', latin: 'Regi signa est.', latinConCantidad: 'Rēgī signa est.' }).map((f) => f.clase))
      .toContain('numero-del-verbo-latino');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la lectura declarada que el verbo no sostiene', () => {
    expect(clases({ ...ci, lectura: 'posesion' })).toContain('lectura-no-la-decide-el-verbo');
    expect(clases({ ...pos, lectura: 'ci' })).toContain('lectura-no-la-decide-el-verbo');
  });
  it('el poseído en acusativo con `sum`, que es donde el alumno se equivoca', () => {
    expect(clases(con({ poseido: { ...pos.poseido, caso: 'ac' } }))).toContain('caso-del-poseido');
  });
  it('la traducción posesiva SIN «tener» — y con mayúscula inicial, que es como se coló', () => {
    expect(clases(con({ respuesta: 'Al niño un nombre es.' }))).toContain('respuesta-sin-tener');
    expect(clases(con({ respuesta: 'Tengo un nombre.', dativo: { forma: 'mihi', lema: 'ego', numero: 'sg', persona: 1 } })))
      .not.toContain('respuesta-sin-tener');
  });
  it('la traducción de complemento indirecto CON «tener»', () => {
    expect(revisarItemDativo({ ...ci, respuesta: 'El niño tiene un nombre.' }).map((f) => f.clase)).toContain('respuesta-con-tener');
  });
  it('el error diana posesivo que no usa «tener», o sea que no es la trampa', () => {
    expect(revisarItemDativo({ ...ci, elErrorDiana: 'El nombre es para el niño.' }).map((f) => f.clase)).toContain('error-diana-sin-tener');
  });
  it('el dativo declarado que no es el que deriva la máquina', () => {
    expect(clases(con({ dativo: { ...pos.dativo, forma: 'pueris', numero: 'pl' } }))).toContain('dativo-no-esta-en-la-frase');
  });
  it('el marco con macrones', () => {
    expect(clases(con({ latin: 'Puerō nōmen est.' }))).toContain('marco-con-macrones');
  });
  it('la versión con cantidad que no es la misma frase', () => {
    expect(clases(con({ latinConCantidad: 'Puerō dōnum est.' }))).toContain('cantidad-mal-puesta');
  });
  it('y el latín de fuera de L1', () => {
    const w = palabraFueraDeL1();
    expect(clases(con({ latin: `Puero nomen est et ${w} venit.`, latinConCantidad: `Puerō nōmen est et ${w} venit.` })))
      .toContain('latin-fuera-de-l1');
  });
});

describe('LA TRADUCCIÓN ESPEJO, que con «tener» sola pasaba en verde', () => {
  it('cada traducción nombra al poseedor y al poseído', () => {
    expect(revisarLoteDativo(LOTE_DATIVO_POSESIVO)).toEqual([]);
  });
  it('una traducción que cambia los papeles se pone roja', () => {
    expect(clases(con({ respuesta: 'El nombre tiene un niño.' }))).not.toContain('respuesta-sin-tener');
    expect(clases(con({ respuesta: 'El rey tiene un nombre.' }))).toContain('respuesta-no-nombra-al-poseedor');
  });
  it('y una que se deja el poseído, también', () => {
    expect(clases(con({ respuesta: 'El niño tiene algo.' }))).toContain('respuesta-no-nombra-al-poseido');
  });
  it('en primera y segunda persona no hay núcleo que buscar, y va declarado', () => {
    for (const i of LOTE_DATIVO_POSESIVO)
      expect(i.dativo.enEspanol === undefined, i.id).toBe(i.dativo.persona !== 3);
  });
  it('los dos ítems de un par no pueden llevar la misma traducción', () => {
    const igual = LOTE_DATIVO_POSESIVO.map((i) => i === ci ? { ...i, respuesta: pos.respuesta } : i);
    expect(revisarParejasDativo(igual).map((f) => f.clase)).toContain('par-sin-respuestas-distintas');
  });
});

describe('EL COSTE DEL PAR, que este lote paga igual que el del reflexivo', () => {
  it('«lo contrario de la vez anterior» tiene techo 0,75', () => {
    expect(techoDeLaSegundaVez(LOTE_DATIVO_POSESIVO).techo).toBe(0.75);
  });
  it('y el piso de distancia se cumple en los ocho pares', () => {
    const d = distanciasEnElPar(LOTE_DATIVO_POSESIVO);
    expect(d.length).toBe(8);
    expect(d[0]!.distancia).toBeGreaterThanOrEqual(DISTANCIA_MINIMA_EN_EL_PAR);
  });
  it('el piso es el MISMO número que el generador del portugués, importado y no copiado', async () => {
    const { SEPARACION_MINIMA } = await import('@/scripts/lib/pares-minimos');
    expect(DISTANCIA_MINIMA_EN_EL_PAR).toBe(SEPARACION_MINIMA);
  });
});

describe('la cobertura dice sobre cuántos decidió', () => {
  it('ninguna comprobación decide sobre cero', () => {
    for (const c of coberturaDativo(LOTE_DATIVO_POSESIVO)) expect(c.decididos, c.comprobacion).toBeGreaterThan(0);
  });
  it('cinco de las seis personas del dativo, y la que falta va con motivo escrito', () => {
    const c = coberturaDativo(LOTE_DATIVO_POSESIVO).find((x) => x.comprobacion.startsWith('personas distintas'))!;
    expect(c.decididos).toBe(5);
    expect(c.motivoDeLosQueQuedanFuera).toContain('mexicano');
  });
  it('y el cruce de número se ejerce en cuatro de los ocho posesivos', () => {
    const c = coberturaDativo(LOTE_DATIVO_POSESIVO).find((x) => x.comprobacion.includes('NO coinciden'))!;
    expect(`${c.decididos}/${c.total}`).toBe('4/8');
  });
});
