// tests/unit/lote-dativo-la.test.ts
//
// El dativo, con el gate compartido de los cuatro puntos de función. El
// contenido está en el `varia`: «el sincretismo del dativo cambia con la
// declinación», que es contable y sale graduado de 3 a 0.
import { describe, it, expect } from 'vitest';
import { LOTE_DATIVO } from '@/lib/data/languages/la/lotes/l3-dativo-ci';
import {
  revisarItemFuncionCaso, revisarLoteFuncionCaso, colisionesDentro,
  CASO_DE_LA_FUNCION, type ItemFuncionCaso,
} from '@/scripts/lib/gate-funcion-caso';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { declinar, declinacionDe } from '@/lib/data/languages/la/paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
const OPC = { colisionesMinimas: 0, colisionesMaximas: 3 };
const copia = (): ItemFuncionCaso[] => LOTE_DATIVO.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('el dativo · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteFuncionCaso(LOTE_DATIVO, OPC);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('toda forma la deriva la máquina desde el caso de su función', () => {
    for (const it of LOTE_DATIVO)
      expect(it.forma, it.id).toBe(declinar(it.entrada, CASO_DE_LA_FUNCION[it.funcion], it.numero));
  });

  it('recorre el rango de ambigüedad de 3 a 0', () => {
    const cs = LOTE_DATIVO.map((it) => it.ejes.colisiones);
    expect(Math.min(...cs)).toBe(0);
    expect(Math.max(...cs)).toBe(3);
  });

  it('y las cinco declinaciones', () => {
    expect(new Set(LOTE_DATIVO.map((it) => declinacionDe(it.entrada))).size).toBe(5);
  });

  it('ningún marco lleva macrón', () => {
    for (const it of LOTE_DATIVO) expect(it.marco, it.id).not.toMatch(/[āēīōū]/);
  });
});

describe('lo que el varia dice, contado', () => {
  it('la 1.ª es el peor caso: el mismo «-ae» hace tres cosas más', () => {
    expect(colisionesDentro(N('puella'), 'dat', 'sg').sort())
      .toEqual(['gen.sg', 'nom.pl', 'voc.pl']);
  });

  it('la 2.ª choca con el ablativo, y la 5.ª con el genitivo', () => {
    expect(colisionesDentro(N('servus'), 'dat', 'sg')).toEqual(['abl.sg']);
    expect(colisionesDentro(N('rēs'), 'dat', 'sg')).toEqual(['gen.sg']);
  });

  it('la 4.ª es el único dativo limpio de la lengua', () => {
    expect(colisionesDentro(N('exercitus'), 'dat', 'sg')).toEqual([]);
    expect(declinar(N('exercitus'), 'dat', 'sg')).toBe('exercituī');
  });

  it('la 3.ª no colisiona dentro y AUN ASÍ es trampa: cruza de declinación', () => {
    // `rēgī` no comparte forma con ninguna celda de `rēx`… y un `-ī` se lee
    // como el genitivo de 2.ª. Ningún paradigma estudiado por separado
    // enseña esa confusión, y por eso los ítems que la traen la declaran.
    expect(colisionesDentro(N('rēx'), 'dat', 'sg')).toEqual([]);
    expect(declinar(N('rēx'), 'dat', 'sg')).toBe('rēgī');
    expect(declinar(N('servus'), 'gen', 'sg')).toBe('servī');
    const cruzan = LOTE_DATIVO.filter((it) => it.ejes.cruzaDeDeclinacion);
    expect(cruzan.length).toBeGreaterThan(2);
    for (const it of cruzan) expect(declinacionDe(it.entrada)).toBe('3ª');
  });
});

describe('el dativo · ROJO', () => {
  it('una cuenta de colisiones inventada', () => {
    const it = copia()[0]!;
    it.ejes.colisiones = it.ejes.colisiones + 1;
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'colisiones-mal-contadas')).toBe(true);
  });

  it('una forma que no es la del caso de su función', () => {
    const it = copia()[0]!;
    it.forma = declinar(it.entrada, 'ac', 'sg');
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'forma-no-derivada')).toBe(true);
  });

  it('un lote sin el extremo ambiguo mide un solo grado', () => {
    const limpios = copia().filter((it) => it.ejes.colisiones === 0);
    expect(revisarLoteFuncionCaso(limpios, OPC).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('y uno de una sola declinación, tampoco vale', () => {
    const unaSola = copia().filter((it) => declinacionDe(it.entrada) === '1ª');
    expect(revisarLoteFuncionCaso(unaSola, OPC).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('un macrón en el marco', () => {
    const it = copia()[0]!;
    it.marco = it.marco.replace('a', 'ā');
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'macron-en-el-marco')).toBe(true);
  });
});
