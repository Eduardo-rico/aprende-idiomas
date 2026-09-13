// tests/unit/lote-no-coincide-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_NO_COINCIDE } from '@/lib/data/languages/la/lotes/l7-no-coincide-espanol';
import {
  coberturaNoCoincide, copiarElModo, revisarItemNoCoincide, revisarLoteNoCoincide,
  tasasCiegasNoCoincide, type ItemNoCoincide,
} from '@/scripts/lib/gate-no-coincide';
import { todasLasFormasDeL1 } from '@/lib/data/languages/la/todas-las-formas';

const sin = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase();
const SUBJ = new Set(todasLasFormasDeL1().filter((f) => f.tabla === 'SUBJUNTIVOS').map((f) => sin(f.forma)));
const es = (w: string) => SUBJ.has(w);

const base = LOTE_NO_COINCIDE.find((i) => i.id === 'la-nc-01')!;
const con = (p: Partial<ItemNoCoincide>): ItemNoCoincide => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemNoCoincide) => revisarItemNoCoincide(i, es).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteNoCoincide(LOTE_NO_COINCIDE, es).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y el modo latino declarado es el que dice el enumerador del dominio', () => {
    for (const i of LOTE_NO_COINCIDE)
      expect(es(sin(i.formaSubordinada)), `${i.id} ${i.formaSubordinada}`).toBe(i.modoLatino === 'subjuntivo');
  });
});

describe('LA TRAMPA DE DISEÑO: un lote de sólo desajustes instala «al revés»', () => {
  it('copiar e invertir son complementarias: sus tasas suman uno', () => {
    const t = tasasCiegasNoCoincide(LOTE_NO_COINCIDE);
    expect(t.copiarElModo.tasa + t.invertirElModo.tasa).toBeCloseTo(1, 10);
  });
  it('así que la única salida es siete y siete, y ninguna pasa del listón', () => {
    const t = tasasCiegasNoCoincide(LOTE_NO_COINCIDE);
    expect(t.copiarElModo.tasa).toBeLessThanOrEqual(0.6);
    expect(t.invertirElModo.tasa).toBeLessThanOrEqual(0.6);
  });
  it('y un lote de sólo desajustes lo dice: «invertirlo» al 100 %', () => {
    const lote = LOTE_NO_COINCIDE.filter((i) => i.modoLatino !== i.modoEspanol);
    expect(tasasCiegasNoCoincide(lote).invertirElModo.tasa).toBe(1);
    expect(revisarLoteNoCoincide(lote, es).map((f) => f.detalle).join(' '))
      .toContain('el lote instala una regla en vez de quitarla');
  });
});

describe('LAS DOS DIRECCIONES, que es lo que el varia exige', () => {
  it('el latín lo pone y el español no', () => {
    const xs = LOTE_NO_COINCIDE.filter((i) => i.modoLatino === 'subjuntivo' && i.modoEspanol === 'indicativo');
    expect(xs.length).toBeGreaterThanOrEqual(3);
    expect(new Set(xs.map((i) => i.construccion))).toEqual(new Set(['cum-historico', 'interrogativa-indirecta', 'consecutiva']));
  });
  it('y el latín lo quita donde el español lo pone — el futuro', () => {
    const xs = LOTE_NO_COINCIDE.filter((i) => i.modoLatino === 'indicativo' && i.modoEspanol === 'subjuntivo');
    expect(xs.length).toBeGreaterThanOrEqual(2);
    // «cuando venga» = `cum veniet`, futuro de INDICATIVO.
    for (const i of xs) expect(es(sin(i.formaSubordinada)), i.id).toBe(false);
  });
  it('sin una de las dos, el gate lo dice', () => {
    const lote = LOTE_NO_COINCIDE.filter((i) => !(i.modoLatino === 'indicativo' && i.modoEspanol === 'subjuntivo'));
    expect(revisarLoteNoCoincide(lote, es).map((f) => f.detalle).join(' ')).toContain('la inversa');
  });
});

describe('EL ERROR DIANA SÓLO DONDE HAY TRAMPA', () => {
  it('los siete desajustes lo llevan', () => {
    for (const i of LOTE_NO_COINCIDE.filter((x) => x.modoLatino !== x.modoEspanol))
      expect(i.elErrorDiana, i.id).toBeDefined();
  });
  it('y los siete que coinciden NO, porque ahí copiar el modo ES la respuesta', () => {
    for (const i of LOTE_NO_COINCIDE.filter((x) => x.modoLatino === x.modoEspanol)) {
      expect(i.elErrorDiana, i.id).toBeUndefined();
      expect(copiarElModo(i)).toBe(i.modoEspanol);
    }
  });
  it('el gate caza el que sobra', () => {
    const coincide = LOTE_NO_COINCIDE.find((i) => i.modoLatino === i.modoEspanol)!;
    expect(revisarItemNoCoincide({ ...coincide, elErrorDiana: 'lo que sea' }, es).map((f) => f.clase))
      .toContain('error-diana-donde-coinciden');
  });
  it('y el que falta', () => {
    const { elErrorDiana: _, ...sinError } = base;
    expect(revisarItemNoCoincide(sinError as ItemNoCoincide, es).map((f) => f.clase)).toContain('error-diana-que-falta');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('el modo latino mal declarado', () => {
    expect(clases(con({ modoLatino: 'indicativo', ejes: { ...base.ejes, coinciden: true } }))).toContain('modo-latino-mal');
  });
  it('la forma que no está en la frase', () => {
    expect(clases(con({ formaSubordinada: 'vēnisset' }))).toContain('forma-no-esta-en-la-frase');
  });
  it('la glosa que regala la respuesta', () => {
    expect(clases(con({ glosa: 'Cuando el rey venía ___, el niño estaba de pie.' }))).toContain('glosa-regala-la-respuesta');
  });
  it('y el latín de fuera de L1', () => {
    expect(clases(con({ latin: 'Cum mīles venīret, puer stābat.' }))).toContain('latin-fuera-de-l1');
  });
});
