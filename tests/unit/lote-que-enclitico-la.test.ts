// tests/unit/lote-que-enclitico-la.test.ts
//
// El `-que` enclítico. Lo que el punto tiene que enseñar no es que exista
// sino CUÁNDO NO ESTÁ: el treebank separa el enclítico de verdad, así que
// todo lo que queda acabado en `-que` es palabra entera, y son muy
// frecuentes.
import { describe, it, expect } from 'vitest';
import { LOTE_QUE } from '@/lib/data/languages/la/lotes/l10-que-enclitico';
import { separarEnclitico, formasValidas } from '@/lib/data/languages/la/cantidad';
import { NO_LLEVAN_ENCLITICO } from '@/lib/data/languages/la/lexicon-l1';

describe('el -que enclítico · en verde', () => {
  it('el partidor y el lote coinciden en los doce', () => {
    const v = formasValidas();
    for (const it of LOTE_QUE)
      expect(separarEnclitico(it.palabra, v), it.id).toEqual(it.respuesta);
  });

  it('seis se parten y seis no', () => {
    expect(LOTE_QUE.filter((it) => it.ejes.lleva)).toHaveLength(6);
    expect(LOTE_QUE.filter((it) => !it.ejes.lleva)).toHaveLength(6);
  });

  it('las que no lo llevan dicen qué son y cuántas veces salen', () => {
    for (const it of LOTE_QUE.filter((x) => !x.ejes.lleva)) {
      expect(it.ejes.queEsEnRealidad, it.id).toBeTruthy();
      expect(it.ejes.frecuencia, it.id).toBeGreaterThan(20);
    }
  });

  it('y las que sí lo llevan NO lo dicen: sería inventarles una trampa', () => {
    for (const it of LOTE_QUE.filter((x) => x.ejes.lleva)) {
      expect(it.ejes.queEsEnRealidad, it.id).toBeUndefined();
      expect(it.respuesta[1], it.id).toBe('que');
    }
  });
});

describe('la trampa de verdad: la lectura falsa es coherente', () => {
  it('«quoque» partido da «quo», que existe y significa «adonde»', () => {
    const v = formasValidas();
    expect(separarEnclitico('quoque', v)).toEqual(['quoque']);
    const it = LOTE_QUE.find((x) => x.palabra === 'quoque')!;
    expect(it.ejes.queEsEnRealidad).toContain('coherente y falsa');
  });

  it('«atque» partido da «at», que es otra conjunción', () => {
    const it = LOTE_QUE.find((x) => x.palabra === 'atque')!;
    expect(it.ejes.queEsEnRealidad).toContain('«at» es otra conjunción');
    expect(it.ejes.frecuencia).toBe(462);
  });

  it('la lista de las que no lo llevan salió de contar el corpus', () => {
    // Con `quoque` 95, `quīnque` 80 y `ūsque` 151, un alumno que parta a
    // ciegas se estrella cientos de veces por página.
    //
    // La comparación va SIN cantidad, que es como la hace el partidor: la
    // lista se escribió a mano en dos tandas y tenía «usque» sin macrón
    // junto a «dēnique» con él. Funcionaba igual —el partidor normaliza—
    // pero el test que compara la cadena literal se puso rojo, y tenía
    // razón en que la lista era inconsistente.
    const sinM = (x: string) => x.normalize('NFD').replace(/[\u0304\u0306]/g, '').normalize('NFC');
    const lista = NO_LLEVAN_ENCLITICO.map(sinM);
    for (const p of ['atque', 'itaque', 'ūsque', 'quoque', 'quīnque', 'neque'])
      expect(lista, p).toContain(sinM(p));
  });
});
