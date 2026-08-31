// tests/unit/atajos.test.ts
//
// La batería se calibra contra el caso que la motivó: el lote 10 de
// E2#11, donde el atajo de la LONGITUD acertaba 13 de 16 y nadie lo
// midió. Las dieciséis frases son las reales.
import { describe, it, expect } from 'vitest';
import { bateria, medirRasgo, pValor, SOSPECHOSO, type ItemJuicio } from '@/scripts/lib/atajos';

// El lote 10 tal cual: M = verdict false, B = verdict true.
const LOTE10: ItemJuicio[] = [
  { id: 'GJ-01', verdict: false, sentence: 'Estou fazendo o jantar, já falta pouco.' },
  { id: 'GJ-02', verdict: false, sentence: 'Acabo de chegar agora mesmo do aeroporto.' },
  { id: 'GJ-03', verdict: true, sentence: 'Costumo levantar-me às sete, mesmo ao fim de semana.' },
  { id: 'GJ-04', verdict: false, sentence: 'Nestes últimos meses viajei imenso a trabalho.' },
  { id: 'GJ-05', verdict: true, sentence: 'Hei de te contar tudo quando nos virmos com calma.' },
  { id: 'GJ-06', verdict: true, sentence: 'Fiquei a pensar no que me disseste ontem à noite.' },
  { id: 'GJ-07', verdict: false, sentence: 'O comboio está para chegar, mas ainda vai demorar duas horas.' },
  { id: 'GJ-08', verdict: true, sentence: 'A avó vai melhorando aos poucos, já se levanta sozinha.' },
  { id: 'GJ-09', verdict: false, sentence: 'Veio-se a saber que ele já estava doente há meses.' },
  { id: 'GJ-10', verdict: true, sentence: 'Assistimos ao jogo todo de pé, não havia lugares.' },
  { id: 'GJ-11', verdict: false, sentence: 'Chegámos em Lisboa às seis da tarde.' },
  { id: 'GJ-12', verdict: false, sentence: 'Os miúdos obedecem os avós sem discutir.' },
  { id: 'GJ-13', verdict: true, sentence: 'Repara na camisola nova dele, deve ter custado uma fortuna.' },
  { id: 'GJ-14', verdict: true, sentence: 'Entrei na sala sem bater à porta e ele nem deu por mim.' },
  { id: 'GJ-15', verdict: false, sentence: 'Pedi para ele vir mais cedo no dia seguinte.' },
  { id: 'GJ-16', verdict: true, sentence: 'Casou-se com uma arquitecta que conheceu em Coimbra.' },
];

describe('la batería sobre el lote 10 — el caso que la motivó', () => {
  it('encuentra el atajo de la LONGITUD, que nadie midió', () => {
    const b = bateria(LOTE10);
    const largo = b.find((a) => a.nombre.includes('palabras'))!;
    expect(largo.acierto).toBeGreaterThanOrEqual(0.75);
    expect(largo.direccion).toBe('presente⇒MAL');   // las cortas son las MAL
  });

  it('el atajo de la longitud es estadísticamente sospechoso', () => {
    const largo = bateria(LOTE10).find((a) => a.nombre.includes('palabras'))!;
    expect(pValor(largo.aciertos, largo.n)).toBeLessThan(SOSPECHOSO);
  });

  it('la batería ordena por acierto y el peor atajo encabeza', () => {
    const b = bateria(LOTE10);
    expect(b[0]!.acierto).toBeGreaterThanOrEqual(b[b.length - 1]!.acierto);
  });
});

describe('la fórmula es ACIERTO SOBRE N, no recall sobre los MAL', () => {
  // La cicatriz literal: un lote presumió de «0 de 8» como si fuera
  // «0 de 16». Un rasgo que no aparece en ningún ítem NO tiene acierto
  // cero: acierta en todos los que predice bien por omisión.
  it('un rasgo ausente en todos acierta tanto como la clase mayoritaria', () => {
    const items: ItemJuicio[] = [
      { id: '1', verdict: true, sentence: 'a' }, { id: '2', verdict: true, sentence: 'b' },
      { id: '3', verdict: false, sentence: 'c' },
    ];
    const a = medirRasgo('nunca', () => false, items);
    expect(a.presentes).toBe(0);
    expect(a.aciertos).toBe(2);          // predice BIEN siempre y acierta 2 de 3
    expect(a.acierto).toBeCloseTo(2 / 3);
  });

  it('un rasgo perfecto da acierto 1', () => {
    const items: ItemJuicio[] = [
      { id: '1', verdict: true, sentence: 'largo largo largo' },
      { id: '2', verdict: false, sentence: 'x' },
    ];
    expect(medirRasgo('perfecto', (x) => x.sentence === 'x', items).acierto).toBe(1);
  });

  it('mide las DOS direcciones y se queda con la mejor', () => {
    const items: ItemJuicio[] = [
      { id: '1', verdict: false, sentence: 'con' }, { id: '2', verdict: false, sentence: 'con' },
      { id: '3', verdict: true, sentence: 'sin' },
    ];
    const a = medirRasgo('tiene con', (x) => x.sentence === 'con', items);
    expect(a.direccion).toBe('presente⇒MAL');
    expect(a.acierto).toBe(1);
  });
});

describe('pValor', () => {
  it('13 de 16 es sospechoso y 9 de 16 no', () => {
    expect(pValor(13, 16)).toBeLessThan(SOSPECHOSO);
    expect(pValor(9, 16)).toBeGreaterThan(SOSPECHOSO);
  });

  it('acertar todo es lo más improbable posible', () => {
    expect(pValor(16, 16)).toBeCloseTo(1 / 2 ** 16, 8);
  });
});

// La alternancia mecánica la prohíbe la skill desde el lote 2, pero
// nadie la medía: con MBMBMB… basta mirar si la posición es par. El
// lote 11 de E2#12 salió exactamente así y la batería no lo vio, porque
// sólo tenía rasgos del TEXTO.
describe('la posición también es un rasgo', () => {
  it('caza la alternancia mecánica perfecta', () => {
    const alterno: ItemJuicio[] = Array.from({ length: 12 }, (_, i) => ({
      id: `x${i}`, verdict: i % 2 === 1, sentence: `frase número ${i} con unas cuantas palabras`,
    }));
    const a = bateria(alterno).find((r) => r.nombre.includes('alternancia'))!;
    expect(a.acierto).toBe(1);
    expect(pValor(a.aciertos, a.n)).toBeLessThan(SOSPECHOSO);
  });

  it('no marca un patrón sin regularidad posicional', () => {
    const patron = [true, true, false, true, false, false, true, false, false, true, true, false];
    const items: ItemJuicio[] = patron.map((v, i) => ({ id: `y${i}`, verdict: v, sentence: `frase ${i} con palabras suficientes` }));
    const a = bateria(items).find((r) => r.nombre.includes('alternancia'))!;
    expect(pValor(a.aciertos, a.n)).toBeGreaterThan(SOSPECHOSO);
  });
});
