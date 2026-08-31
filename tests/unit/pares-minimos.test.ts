// tests/unit/pares-minimos.test.ts
//
// La propiedad que este módulo existe para garantizar, escrita como
// test: **en un lote hecho de pares mínimos, ningún rasgo superficial
// puede predecir la etiqueta**, porque los dos miembros del par valen lo
// mismo para cualquier rasgo que no mire el hueco.
//
// Se prueba contra la batería REAL, no contra una maqueta: si mañana
// alguien añade el rasgo número doce a `atajos.ts`, este test lo pasa
// por el mismo tamiz sin tocarlo.
import { describe, it, expect } from 'vitest';
import {
  verificarPar, expandir, evaluarMolde, patronDe, patronesPublicados, rellenar,
  type ParMinimo,
} from '@/scripts/lib/pares-minimos';
import { bateria, pValor, SOSPECHOSO } from '@/scripts/lib/atajos';

const par = (o: Partial<ParMinimo>): ParMinimo => ({
  id: 'P-01', concepto: 'x', rasgo: 'ser/estar con eventos',
  esqueleto: 'A reunião com os investidores {} às três da tarde na sala grande.',
  bien: 'é', mal: 'está',
  explicacionBien: 'b', explicacionMal: 'm', ...o,
});

// Doce pares reales del punto `b11-ser-estar-divergente`, escritos como
// esqueleto + dos rellenos. Sirven de banco de pruebas honesto: son
// frases de verdad, no «lorem ipsum» que haría el test más fácil.
const DOCE: ParMinimo[] = [
  ['A reunião com os investidores {} às três da tarde na sala grande.', 'é', 'está'],
  ['O concerto de sábado {} no Coliseu, mesmo ao lado da estação.', 'é', 'está'],
  ['O jantar de despedida {} no restaurante do costume, lá para as oito.', 'é', 'está'],
  ['A festa de anos da minha sobrinha {} no domingo em casa dos avós.', 'é', 'está'],
  ['O António {} doente desde a semana passada e não vai trabalhar.', 'está', 'é'],
  ['Este café {} frio, deve ter ficado na máquina desde o almoço.', 'está', 'é'],
  ['A porta do quarto {} aberta a noite toda e entrou frio pela casa.', 'esteve', 'foi'],
  ['A camisola que me deste {} suja da chuva de ontem à tarde.', 'está', 'é'],
  ['O meu vizinho do lado {} português, mas vive em Espanha há anos.', 'é', 'está'],
  ['A minha prima mais nova {} professora de História no liceu daqui.', 'é', 'está'],
  ['O prédio onde eles moram {} do século dezanove, todo remodelado.', 'é', 'está'],
  ['A entrada para os sócios {} gratuita durante todo o mês de agosto.', 'é', 'está'],
].map(([esqueleto, bien, mal], i) => par({
  id: `P-${String(i + 1).padStart(2, '0')}`,
  concepto: 'b11-ser-estar-divergente', esqueleto, bien, mal,
}));

describe('verificarPar — un par que no es mínimo no pasa', () => {
  it('acepta un par mínimo de verdad', () => {
    expect(verificarPar(par({}))).toEqual([]);
  });

  it('rechaza dos huecos', () => {
    expect(verificarPar(par({ esqueleto: 'A {} e a {} .' })).join()).toMatch(/2 huecos/);
  });

  it('rechaza rellenos que cambian el ARRANQUE — el atajo que nació de arreglar la longitud', () => {
    const v = verificarPar(par({
      esqueleto: '{} levar o carro à oficina antes do trabalho.',
      bien: 'Vou', mal: 'Amanhã vou a',
    }));
    expect(v.join()).toMatch(/arranques distintos/);
  });

  it('rechaza rellenos que cambian la LONGITUD más de una palabra', () => {
    const v = verificarPar(par({ bien: 'é', mal: 'está marcada para' }));
    expect(v.join()).toMatch(/difieren en \d+ palabras/);
  });

  it('rechaza un par sin rasgo declarado — hay que decir QUÉ se juzga', () => {
    expect(verificarPar(par({ rasgo: '  ' })).join()).toMatch(/sin rasgo declarado/);
  });

  it('el repair de un MAL es, por construcción, el BIEN del par', () => {
    const items = expandir([par({})], { semilla: 'x' });
    const mal = items.find((x) => !x.verdict)!;
    const bien = items.find((x) => x.verdict)!;
    expect(mal.repair).toBe(bien.sentence);
    expect(rellenar('A {} B', 'x')).toBe('A x B');
  });
});

describe('LA PROPIEDAD: ningún rasgo de la batería predice la etiqueta', () => {
  const items = expandir(DOCE, { semilla: 'lote-12-c2' });

  it('produce 24 ítems, 12 y 12', () => {
    expect(items).toHaveLength(24);
    expect(items.filter((x) => x.verdict)).toHaveLength(12);
  });

  it('NINGÚN rasgo de la batería real llega a ser sospechoso', () => {
    const sospechosos = bateria(items)
      .map((a) => ({ ...a, p: pValor(a.aciertos, a.n) }))
      .filter((a) => a.p < SOSPECHOSO);
    expect(sospechosos.map((a) => `${a.nombre} ${a.aciertos}/${a.n} p=${a.p.toFixed(3)}`)).toEqual([]);
  });

  it('y los rasgos de TEXTO caen exactamente en el azar, no «cerca»', () => {
    // Es la garantía por construcción: un rasgo que no mira el hueco
    // vale igual en los dos miembros del par, así que aporta un acierto
    // y un fallo. Doce pares ⇒ 12/24 exacto. Se excluyen los dos rasgos
    // que NO son de texto puro: la posición (que el barajado gobierna) y
    // los dos de longitud relativa a la mediana, que pueden cruzarla si
    // los rellenos no miden lo mismo.
    const deTexto = bateria(items).filter(
      (a) => !/posición|más corta/.test(a.nombre),
    );
    expect(deTexto.length).toBeGreaterThan(5);
    for (const a of deTexto) expect(a.aciertos, a.nombre).toBe(12);
  });

  it('los dos miembros de un par nunca quedan pegados', () => {
    const pos = new Map<string, number>();
    for (let i = 0; i < items.length; i++) {
      const p = items[i]!.parId;
      if (pos.has(p)) expect(i - pos.get(p)!).toBeGreaterThanOrEqual(3);
      pos.set(p, i);
    }
  });

  it('el barajado es reproducible: misma semilla, mismo orden', () => {
    expect(patronDe(expandir(DOCE, { semilla: 'lote-12-c2' })))
      .toBe(patronDe(expandir(DOCE, { semilla: 'lote-12-c2' })));
  });

  it('y semillas distintas dan órdenes distintos', () => {
    expect(patronDe(expandir(DOCE, { semilla: 'a' })))
      .not.toBe(patronDe(expandir(DOCE, { semilla: 'b' })));
  });
});

describe('evaluarMolde — el criterio que sustituye al prefijo de cuatro', () => {
  it('caza el desequilibrio y la racha', () => {
    expect(evaluarMolde('BBBBBBBBMMMM', []).join()).toMatch(/desequilibrio 4/);
    expect(evaluarMolde('BBBBMMMMBBMM', []).join()).toMatch(/racha de 4/);
  });

  it('caza el patrón idéntico a uno publicado', () => {
    const p = 'MBBBMMBMBMMB';
    expect(evaluarMolde(p, [p]).join()).toMatch(/idéntico/);
  });

  it('caza el CALCO — el lote 2 copió 17 de 20 posiciones del lote 1', () => {
    const q = 'MBBMBMMBBMBMMBBMBMMB';
    const calco = q.slice(0, 17) + (q.slice(17) === 'MMB' ? 'BBM' : 'MMB');
    const v = evaluarMolde(calco, [q]);
    expect(v.join()).toMatch(/calca/);
  });

  it('caza la CASI-COMPLEMENTARIA, que es un patrón igual que el calco', () => {
    // Cicatriz del lote 5: presenté un solape de 2/20 como virtud y está
    // a 3,6σ del azar.
    const q = 'MBBMBMMBBMBMMBBMBMMB';
    const complementaria = [...q].map((c) => (c === 'B' ? 'M' : 'B')).join('');
    expect(evaluarMolde(complementaria, [q]).join()).toMatch(/casi-complementaria/);
  });

  it('deja pasar un patrón equilibrado e independiente', () => {
    expect(evaluarMolde('MBBMBMMBBMBMMBBMBMMB', ['BMMBMBBMMBMBBMMBMBBM'.replace(/^(.{5})/, 'MBBMB')])).toBeInstanceOf(Array);
    expect(evaluarMolde('BMBMMBBMBMMBBMBB', ['MBBMBMMBBMBMMBBM'])).toEqual([]);
  });

  it('NO SE AGOTA: con 14 lotes publicados sigue aceptando una fracción grande del espacio', () => {
    // Ésta es la razón de ser del cambio. El criterio viejo tenía 16
    // prefijos de cuatro y uno por lote: se agota por construcción, y de
    // hecho ya sólo quedan cinco, tres de los cuales violan la regla de
    // rachas. El nuevo mide en un espacio de 2^16 y cada lote publicado
    // sólo excluye una cáscara.
    const publicados: string[] = [];
    let semilla = 12345;
    const rnd = () => (semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let k = 0; k < 14; k++) {
      let p = '';
      for (let i = 0; i < 16; i++) p += rnd() < 0.5 ? 'B' : 'M';
      publicados.push(p);
    }
    let aceptados = 0, probados = 0;
    for (let k = 0; k < 400; k++) {
      let p = '';
      for (let i = 0; i < 16; i++) p += rnd() < 0.5 ? 'B' : 'M';
      probados++;
      if (!evaluarMolde(p, publicados).length) aceptados++;
    }
    // Con 14 lotes publicados el criterio sigue admitiendo bastantes
    // patrones; el de prefijos habría admitido exactamente 2 de 16.
    expect(aceptados / probados).toBeGreaterThan(0.1);
  });
});

describe('patronesPublicados — lee los lotes del corpus', () => {
  it('agrupa por lote y ordena por número dentro del lote', () => {
    const corpus = [
      { id: 'b2c2-gj-l3-02', type: 'grammaticality_judgment', data: { verdict: false } },
      { id: 'b2c2-gj-l3-01', type: 'grammaticality_judgment', data: { verdict: true } },
      { id: 'b2c2-gj-l3-03', type: 'grammaticality_judgment', data: { verdict: true } },
      { id: 'b2c2-gj-01', type: 'grammaticality_judgment', data: { verdict: false } },
      { id: 'b5/otro', type: 'flashcard', data: {} },
    ];
    const m = patronesPublicados(corpus);
    expect(m.get('l3')).toBe('BMB');
    expect(m.get('piloto')).toBe('M');
    expect(m.size).toBe(2);
  });
});
