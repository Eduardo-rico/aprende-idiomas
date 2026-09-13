// tests/unit/lote-ablativo-agente-la.test.ts — y el gate, visto en rojo.
//
// EL GATE CAZÓ UN ERROR MÍO ANTES DE CAZAR NINGÚN VENENO, y ésa es la
// razón de que el sello exista. El tercer inanimado iba con `timor`,
// medido «0 con ā» en una sonda del scratchpad. El sello, con el filtro
// bien puesto, da 1 con y 10 sin, y el gate se puso rojo en dos clases a
// la vez:
//
//     la-ag-07  papel-sin-apoyo-en-el-corpus
//               declara instrumento y «timor» sale 1 con ā y 10 sin ella
//     la-ag-10  marca-agramatical-lo-atestiguado
//               el ítem da por mala «timore» CON preposición y el corpus
//               la trae 1 veces
import { describe, it, expect } from 'vitest';
import { LOTE_ABLATIVO_AGENTE } from '@/lib/data/languages/la/lotes/l3-ablativo-agente';
import {
  coberturaAgente, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, enElCorpus,
  revisarItemAgente, revisarLoteAgente, revisarParejasAgente, tasasCiegasAgente,
  techoDeLaSegundaVez, type ItemAgente,
} from '@/scripts/lib/gate-ablativo-agente';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const clases = (i: ItemAgente) => revisarItemAgente(i).map((f) => f.clase);
const de = (pareja: string, con: boolean) => LOTE_ABLATIVO_AGENTE.find((i) => i.pareja === pareja && i.conPreposicion === con)!;
const buena = de('a1', true);    // Servus a domino vocatur.   ✓
const mala = de('a1', false);    // Servus domino vocatur.     ✗
const con = (p: Partial<ItemAgente>): ItemAgente => ({ ...buena, ...p });

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteAgente(LOTE_ABLATIVO_AGENTE).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('catorce ítems: doce que miden y dos de la excepción', () => {
    expect(LOTE_ABLATIVO_AGENTE.length).toBe(14);
    expect(LOTE_ABLATIVO_AGENTE.filter((i) => i.esLaExcepcion !== undefined).length).toBe(2);
  });
  it('seis buenas y seis malas entre las que miden', () => {
    const mide = LOTE_ABLATIVO_AGENTE.filter((i) => i.esLaExcepcion === undefined);
    expect(mide.filter((i) => i.diceLoQueLaGlosa).length).toBe(6);
    expect(mide.filter((i) => !i.diceLoQueLaGlosa).length).toBe(6);
  });
});

describe('EL SEGUNDO CAMINO ES EL TREEBANK, y decide por lema', () => {
  it('los tres animados salen siempre con ā en el corpus', () => {
    for (const l of ['dominus', 'pater', 'Deus']) {
      const c = enElCorpus(l);
      expect(c.con, l).toBeGreaterThan(0);
      expect(c.sin, l).toBe(0);
    }
  });
  it('y los tres inanimados, siempre sin ella', () => {
    for (const l of ['gladius', 'manus', 'bellum']) {
      const c = enElCorpus(l);
      expect(c.sin, l).toBeGreaterThan(0);
      expect(c.con, l).toBe(0);
    }
  });
  it('`natura` sale de LAS DOS maneras, que es lo que la hace la excepción', () => {
    const c = enElCorpus('nātūra');
    expect(c.con).toBeGreaterThan(0);
    expect(c.sin).toBeGreaterThan(0);
  });
  it('EL ERROR QUE EL GATE CAZÓ: `timor` NO es un inanimado limpio', () => {
    // Queda fijado para que nadie lo reponga: la sonda decía 0 con.
    expect(enElCorpus('timor').con).toBe(1);
    const conTimor = { ...LOTE_ABLATIVO_AGENTE.find((i) => i.pareja === 'i3' && i.conPreposicion)!,
      ablativo: { lema: 'timor', forma: 'timore', numero: 'sg' as const },
      latin: 'Populus a timore ducitur.', latinConCantidad: 'Populus ā timōre dūcitur.',
      diceLoQueLaGlosa: false, correccion: 'Populus timore ducitur.' };
    const cs = revisarItemAgente(conTimor).map((f) => f.clase);
    expect(cs).toContain('papel-sin-apoyo-en-el-corpus');
    expect(cs).toContain('marca-agramatical-lo-atestiguado');
  });
  it('declarar agente un lema que el corpus da sin preposición se pone rojo', () => {
    expect(clases(con({ papel: 'instrumento' }))).toContain('papel-sin-apoyo-en-el-corpus');
  });
});

describe('LA EXCEPCIÓN, que no es una nota al pie', () => {
  it('los dos ítems llevan el MISMO lema y los dos son correctos', () => {
    const xs = LOTE_ABLATIVO_AGENTE.filter((i) => i.esLaExcepcion !== undefined);
    expect(new Set(xs.map((i) => i.ablativo.lema))).toEqual(new Set(['nātūra']));
    for (const i of xs) expect(i.diceLoQueLaGlosa, i.id).toBe(true);
    expect(new Set(xs.map((i) => i.conPreposicion))).toEqual(new Set([true, false]));
  });
  it('y sus glosas son distintas: el mismo lema dice dos cosas', () => {
    const [a, b] = LOTE_ABLATIVO_AGENTE.filter((i) => i.esLaExcepcion !== undefined) as [ItemAgente, ItemAgente];
    expect(a.glosa).not.toBe(b.glosa);
  });
  it('sin la excepción el lote enseña una regla absoluta, y el gate lo dice', () => {
    const sinExc = LOTE_ABLATIVO_AGENTE.filter((i) => i.esLaExcepcion === undefined);
    expect(revisarLoteAgente(sinExc).map((f) => f.detalle).join(' ')).toContain('regla absoluta');
  });
  it('CONTROL NEGATIVO: declarar excepción un lema que el corpus da de un solo modo se pone rojo', () => {
    expect(clases(con({ esLaExcepcion: 'excusa' }))).toContain('excepcion-sin-apoyo');
  });
});

describe('LAS TRES RUTAS CIEGAS, y el denominador que las hace medibles', () => {
  it('ninguna pasa de la mitad', () => {
    for (const t of Object.values(tasasCiegasAgente(LOTE_ABLATIVO_AGENTE)))
      expect(t.tasa, t.nombre).toBe(0.5);
  });
  it('el denominador excluye la excepción, donde «todo está bien» no puede fallar', () => {
    expect(tasasCiegasAgente(LOTE_ABLATIVO_AGENTE).todoEstaBien.n).toBe(12);
  });
  it('y un lote de sólo animados deja «animado ⇒ bien» donde no debe', () => {
    const soloUnLado = LOTE_ABLATIVO_AGENTE.filter((i) => i.esLaExcepcion === undefined && i.diceLoQueLaGlosa);
    expect(tasasCiegasAgente(soloUnLado).todoEstaBien.tasa).toBe(1);
    expect(revisarLoteAgente(soloUnLado).map((f) => f.clase)).toContain('estrategia-ciega');
  });
});

describe('EL PAR: las dos frases difieren SÓLO en la preposición', () => {
  it('los siete pares están completos y son mínimos', () => {
    expect(revisarParejasAgente(LOTE_ABLATIVO_AGENTE)).toEqual([]);
    expect(new Set(LOTE_ABLATIVO_AGENTE.map((i) => i.pareja)).size).toBe(7);
  });
  it('y una frase que cambia algo más se pone roja', () => {
    const sucio = LOTE_ABLATIVO_AGENTE.map((i) => i === mala
      ? { ...i, latin: 'Puer domino vocatur.', latinConCantidad: 'Puer dominō vocātur.', correccion: 'Puer a domino vocatur.' }
      : i);
    expect(revisarParejasAgente(sucio).map((f) => f.clase)).toContain('pareja-no-minima');
  });
  it('el coste del par se paga igual: techo 0,75 y piso de distancia cumplido', () => {
    expect(techoDeLaSegundaVez(LOTE_ABLATIVO_AGENTE).techo).toBe(0.75);
    expect(distanciasEnElPar(LOTE_ABLATIVO_AGENTE)[0]!.distancia).toBeGreaterThanOrEqual(DISTANCIA_MINIMA_EN_EL_PAR);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('el veredicto que no sigue la regla', () => {
    expect(clases(con({ diceLoQueLaGlosa: false, correccion: 'Servus domino vocatur.' })))
      .toContain('veredicto-no-sigue-la-regla');
  });
  it('la preposición mal declarada', () => {
    expect(clases(con({ conPreposicion: false }))).toContain('preposicion-mal-declarada');
  });
  it('el ablativo que la máquina no deriva', () => {
    expect(clases(con({ ablativo: { ...buena.ablativo, numero: 'pl' } }))).toContain('ablativo-mal-derivado');
  });
  it('la corrección que no corrige', () => {
    expect(revisarItemAgente({ ...mala, correccion: mala.latin }).map((f) => f.clase))
      .toContain('correccion-igual-a-la-frase-mala');
  });
  it('y la corrección de más sobre una frase que ya está bien', () => {
    expect(clases(con({ correccion: 'Servus domino vocatur.' }))).toContain('correccion-de-mas');
  });
  it('el marco con macrones', () => {
    expect(clases(con({ latin: 'Servus ā dominō vocātur.' }))).toContain('marco-con-macrones');
  });
  it('y el latín de fuera de L1', () => {
    const w = palabraFueraDeL1();
    expect(clases(con({ latin: `Servus a domino ${w}.`, latinConCantidad: `Servus ā dominō ${w}.` })))
      .toContain('latin-fuera-de-l1');
  });
});

describe('la cobertura y los dos errores que el varia exige', () => {
  it('los dos errores están, tres y tres', () => {
    const malas = LOTE_ABLATIVO_AGENTE.filter((i) => i.esLaExcepcion === undefined && !i.diceLoQueLaGlosa);
    expect(malas.filter((i) => i.conPreposicion).length).toBe(3);
    expect(malas.filter((i) => !i.conPreposicion).length).toBe(3);
  });
  it('y quitando uno de los dos el gate lo dice', () => {
    const sinUno = LOTE_ABLATIVO_AGENTE.filter((i) => i.diceLoQueLaGlosa || !i.conPreposicion);
    expect(revisarLoteAgente(sinUno).map((f) => f.detalle).join(' ')).toContain('los dos errores');
  });
  it('ninguna comprobación decide sobre cero', () => {
    for (const c of coberturaAgente(LOTE_ABLATIVO_AGENTE)) expect(c.decididos, c.comprobacion).toBeGreaterThan(0);
  });
});
