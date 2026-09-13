// tests/unit/lote-ut-final-la.test.ts — y el gate, en rojo.
//
// Aquí el segundo camino de la SINTAXIS es el treebank, no una máquina del
// proyecto: `subjuntivo.ts` sabe si `videat` es un subjuntivo, no si esa
// oración es final. Lo que estos tests comprueban contra el corpus son las
// dos afirmaciones que el material hace sobre la lengua.
import { describe, it, expect } from 'vitest';
import { LOTE_UT_FINAL } from '@/lib/data/languages/la/lotes/l7-ut-final';
import {
  CONCORDANCIA, LO_QUE_DICE_EL_CORPUS, coberturaUtFinal, finalDeLaMaquina,
  regenteConjugado, revisarItemUtFinal, revisarLoteUtFinal, siemprePresente,
  siempreUt, tasasCiegasUtFinal, type ItemUtFinal,
} from '@/scripts/lib/gate-ut-final';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_UT_FINAL.find((i) => i.id === 'la-uf-01')!;
const con = (p: Partial<ItemUtFinal>): ItemUtFinal => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemUtFinal) => revisarItemUtFinal(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteUtFinal(LOTE_UT_FINAL).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y el regente conjugado está en cada marco', () => {
    for (const i of LOTE_UT_FINAL) expect(i.marco, i.id).toContain(regenteConjugado(i));
  });
});

describe('LO QUE EL CORPUS DICE DE LA DOCTRINA DEL MATERIAL', () => {
  it('la final negativa es `nē` y no `ut nōn` — pero no es una ley', () => {
    const c = LO_QUE_DICE_EL_CORPUS;
    expect(c.neEnFinales).toBeGreaterThan(c.utNonEnFinales);
    // 192 frente a 58: la regla se sostiene al 77 %, no al 100.
    expect(c.utNonEnFinales).toBeGreaterThan(0);
    expect(c.neEnFinales / (c.neEnFinales + c.utNonEnFinales)).toBeLessThan(1);
  });

  it('y en la consecutiva es al revés, que es lo que dice `l7-ut-consecutiva`', () => {
    const c = LO_QUE_DICE_EL_CORPUS;
    expect(c.utNonEnConsecutivas).toBeGreaterThan(c.neEnConsecutivas);
    // 26 frente a 3. El punto dice «se equivocará SIEMPRE»: medido es el
    // 90 %, y eso hay que saberlo antes de marcar nada como agramatical.
    expect(c.neEnConsecutivas).toBeGreaterThan(0);
  });

  it('la concordancia de tiempos que usa el lote es la que el corpus prefiere', () => {
    const c = LO_QUE_DICE_EL_CORPUS.concordancia;
    expect(c['Pres → Pres'] ?? 0).toBeGreaterThan(c['Pres → Past'] ?? 0);
    expect(c['Past → Past'] ?? 0).toBeGreaterThan(c['Past → Pres'] ?? 0);
    expect(c['Fut → Pres'] ?? 0).toBeGreaterThan(c['Fut → Past'] ?? 0);
  });

  it('y el PERFECTO no la determina, que es por lo que el lote no lo usa', () => {
    const c = LO_QUE_DICE_EL_CORPUS.concordancia;
    const aImperfecto = c['PastPerf → Past'] ?? 0;
    const aPresente = c['PastPerf → Pres'] ?? 0;
    expect(aPresente).toBeGreaterThan(0);
    // 264 frente a 71: el perfecto lleva las dos cosas, así que un ítem con
    // regente en perfecto no tiene respuesta determinada.
    expect(aPresente / (aImperfecto + aPresente)).toBeGreaterThan(0.15);
    expect(LOTE_UT_FINAL.map((i) => i.tiempoRegente)).not.toContain('perfecto');
  });
});

describe('la concordancia como regla', () => {
  it('los primarios piden presente y el imperfecto pide imperfecto', () => {
    expect(CONCORDANCIA.presente).toBe('presente');
    expect(CONCORDANCIA.futuro).toBe('presente');
    expect(CONCORDANCIA.imperfecto).toBe('imperfecto');
  });
  it('y la máquina la aplica', () => {
    expect(finalDeLaMaquina(con({ tiempoRegente: 'imperfecto', verbo: V('videō'), persona: '3sg', conjuncion: 'ut' }))).toBe('ut vidēret');
    expect(finalDeLaMaquina(con({ tiempoRegente: 'futuro', verbo: V('videō'), persona: '3sg', conjuncion: 'ut' }))).toBe('ut videat');
  });
});

describe('las dos ciegas, que pueden fallar y se comprueba', () => {
  it('«siempre ut» acierta en las positivas y falla en las negativas', () => {
    const pos = LOTE_UT_FINAL.find((i) => i.conjuncion === 'ut')!;
    const neg = LOTE_UT_FINAL.find((i) => i.conjuncion === 'nē')!;
    expect(siempreUt(pos)).toBe(pos.respuesta);
    expect(siempreUt(neg)).not.toBe(neg.respuesta);
  });
  it('«siempre el presente» acierta con regente primario y falla con el imperfecto', () => {
    const pri = LOTE_UT_FINAL.find((i) => i.tiempoRegente !== 'imperfecto')!;
    const sec = LOTE_UT_FINAL.find((i) => i.tiempoRegente === 'imperfecto')!;
    expect(siemprePresente(pri)).toBe(pri.respuesta);
    expect(siemprePresente(sec)).not.toBe(sec.respuesta);
  });
  it('y las dos quedan en el azar, no por debajo', () => {
    const t = tasasCiegasUtFinal(LOTE_UT_FINAL);
    expect(t.siempreUt.tasa).toBeLessThanOrEqual(0.6);
    expect(t.siemprePresente.tasa).toBeLessThanOrEqual(0.6);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('el subjuntivo que no concuerda con el regente', () => {
    expect(clases(con({ tiempoRegente: 'imperfecto', marco: 'Rēx veniēbat ___.' }))).toContain('respuesta-no-derivable');
  });
  it('la conjunción que no es la declarada', () => {
    expect(clases(con({ conjuncion: 'nē' }))).toContain('respuesta-no-derivable');
  });
  it('el regente que no está en el marco', () => {
    expect(clases(con({ marco: 'Rēx stat ___.' }))).toContain('regente-no-esta-en-el-marco');
  });
  it('el marco que regala la respuesta', () => {
    expect(clases(con({ marco: 'Rēx venit ut ___.' }))).toContain('marco-regala-la-forma');
  });
  it('el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: `${palabraFueraDeL1()} venit ___.` }))).toContain('marco-fuera-de-l1');
  });
  it('y —lo más fácil de colar— una negativa cuya glosa no niega', () => {
    const neg = LOTE_UT_FINAL.find((i) => i.conjuncion === 'nē')!;
    expect(revisarItemUtFinal({ ...neg, glosa: 'El esclavo se detiene para que vea.' }).map((f) => f.clase))
      .toContain('glosa-no-niega');
  });
});

describe('los venenos de LOTE', () => {
  it('sólo positivas: el varia queda sin cubrir', () => {
    const lote = LOTE_UT_FINAL.filter((i) => i.conjuncion === 'ut');
    const d = revisarLoteUtFinal(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('el varia es si la final es positiva o negativa');
    expect(d).toContain('poner siempre ut');
  });
  it('sólo regente primario: no se puede ver la concordancia', () => {
    const lote = LOTE_UT_FINAL.filter((i) => i.tiempoRegente !== 'imperfecto');
    const d = revisarLoteUtFinal(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('no obliga a mirar el regente');
  });
  it('y la cobertura del tiempo secundario lleva su motivo', () => {
    const c = coberturaUtFinal(LOTE_UT_FINAL).find((x) => x.comprobacion.includes('SECUNDARIO'))!;
    expect(c.decididos).toBeLessThan(c.total);
    expect(c.motivoDeLosQueQuedanFuera ?? '').toContain('no distinguen');
  });
});
