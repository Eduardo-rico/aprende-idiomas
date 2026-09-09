// tests/unit/lote-acusativo-la.test.ts
import { describe, it, expect } from 'vitest';
import { LOTE_ACUSATIVO } from '@/lib/data/languages/la/lotes/l3-acusativo-od';
import { revisarLoteFuncionCaso, revisarItemFuncionCaso, type ItemFuncionCaso } from '@/scripts/lib/gate-funcion-caso';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';

const OPC = { colisionesMinimas: 0, colisionesMaximas: 2 };
const copia = (): ItemFuncionCaso[] => LOTE_ACUSATIVO.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('el acusativo objeto · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteFuncionCaso(LOTE_ACUSATIVO, OPC);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('seis inanimados y seis animados: las dos mitades del eje', () => {
    expect(LOTE_ACUSATIVO.filter((it) => it.ejes.objetoAnimado === false)).toHaveLength(6);
    expect(LOTE_ACUSATIVO.filter((it) => it.ejes.objetoAnimado === true)).toHaveLength(6);
  });

  it('la glosa lleva «a» exactamente en los animados', () => {
    // El español marca el objeto con «a» sólo cuando es animado y
    // determinado. Es el eje del punto y se comprueba en el texto.
    for (const it of LOTE_ACUSATIVO) {
      const conA = /^(a la|a los|a las|al)\b/.test(it.respuesta);
      expect(conA, `${it.id}: «${it.respuesta}»`).toBe(it.ejes.objetoAnimado === true);
    }
  });

  it('los verbos de doble acusativo están en el lexicón, con su cuenta', () => {
    expect(VERBOS_L1.some((v) => v.lema === 'doceō')).toBe(true);
    expect(VERBOS_L1.some((v) => v.lema === 'rogō')).toBe(true);
  });

  it('y el doble acusativo va declarado como raro, no como corriente', () => {
    // Medido: 7 frases con dos acusativos del mismo verbo en 227.301 tokens.
    // Meter más habría inflado su peso en el repaso espaciado.
    const dobles = LOTE_ACUSATIVO.filter((it) => it.ejes.dobleAcusativo);
    expect(dobles).toHaveLength(2);
    for (const it of dobles) expect(it.ejes.dobleAcusativo).toContain('7 en todo el corpus');
  });
});

describe('el acusativo objeto · ROJO', () => {
  it('un lote todo animado no ve dónde deja de ayudar el español', () => {
    const soloAnimados = copia().filter((it) => it.ejes.objetoAnimado === true);
    expect(revisarLoteFuncionCaso(soloAnimados, OPC).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('y uno todo inanimado tampoco', () => {
    const soloCosas = copia().filter((it) => it.ejes.objetoAnimado === false);
    expect(revisarLoteFuncionCaso(soloCosas, OPC).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('una forma que no es el acusativo de su lema', () => {
    const it = copia()[0]!;
    it.forma = it.entrada.lema;
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'forma-no-derivada')).toBe(true);
  });

  it('un macrón en el marco', () => {
    const it = copia()[0]!;
    it.marco = it.marco.replace('a', 'ā');
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'macron-en-el-marco')).toBe(true);
  });
});
