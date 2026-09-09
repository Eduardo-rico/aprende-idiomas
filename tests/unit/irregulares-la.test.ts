// tests/unit/irregulares-la.test.ts
//
// Los seis irregulares. El punto dice «hay que guardar y no derivar», y el
// módulo lo hace literalmente: son tablas, porque cualquier regla que los
// cubriera dejaría de ser la regla de los demás verbos.
import { describe, it, expect } from 'vitest';
import { IRREGULARES_L1, conjugarIrregular, esIrregular, HOMOGRAFO_VOLO } from '@/lib/data/languages/la/irregulares';

const I = (l: string) => IRREGULARES_L1.find((x) => x.lema === l)!;

describe('las formas están copiadas del corpus', () => {
  it('`volō` tiene su hueco: «vīs» y «vult» salen de otro tema', () => {
    expect(conjugarIrregular(I('volō'), '1sg')).toBe('volō');
    expect(conjugarIrregular(I('volō'), '2sg')).toBe('vīs');
    expect(conjugarIrregular(I('volō'), '3sg')).toBe('vult');
    expect(conjugarIrregular(I('volō'), '1pl')).toBe('volumus');
    expect(conjugarIrregular(I('volō'), '3pl')).toBe('volunt');
  });

  it('`eō` alterna `e-`/`ī-` y hace el futuro en -b-', () => {
    expect(conjugarIrregular(I('eō'), '1sg')).toBe('eō');
    expect(conjugarIrregular(I('eō'), '3sg')).toBe('it');
    expect(conjugarIrregular(I('eō'), '1pl')).toBe('īmus');
    expect(conjugarIrregular(I('eō'), '3pl')).toBe('eunt');
    expect(conjugarIrregular(I('eō'), '1sg', 'futuro')).toBe('ībō');
    expect(conjugarIrregular(I('eō'), '3pl', 'futuro')).toBe('ībunt');
  });

  it('`ferō` pierde la vocal temática ante consonante y la conserva ante vocal', () => {
    expect(conjugarIrregular(I('ferō'), '2sg')).toBe('fers');
    expect(conjugarIrregular(I('ferō'), '3sg')).toBe('fert');
    expect(conjugarIrregular(I('ferō'), '2pl')).toBe('fertis');
    expect(conjugarIrregular(I('ferō'), '1pl')).toBe('ferimus');
    expect(conjugarIrregular(I('ferō'), '3pl')).toBe('ferunt');
  });

  it('`nōlō` y `mālō` heredan el hueco de `volō`, cada uno a su manera', () => {
    // `nōlō` es «nōn» + «volō» y deja el «nōn» suelto donde asoma el otro
    // tema; `mālō` es «magis» + «volō» y ahí sale «māvīs».
    expect(conjugarIrregular(I('nōlō'), '2sg')).toBe('nōn vīs');
    expect(conjugarIrregular(I('nōlō'), '1pl')).toBe('nōlumus');
    expect(conjugarIrregular(I('mālō'), '2sg')).toBe('māvīs');
    expect(conjugarIrregular(I('mālō'), '3sg')).toBe('māvult');
  });

  it('`fīō` hace de pasivo de `faciō`', () => {
    expect(conjugarIrregular(I('fīō'), '3sg')).toBe('fit');
    expect(conjugarIrregular(I('fīō'), '3pl')).toBe('fīunt');
  });

  it('cada uno declara POR QUÉ es irregular, y no es lo mismo', () => {
    const porQues = IRREGULARES_L1.map((v) => v.porQue);
    expect(new Set(porQues).size).toBe(IRREGULARES_L1.length);
    for (const v of IRREGULARES_L1) expect(v.porQue.length, v.lema).toBeGreaterThan(40);
  });
});

describe('el homógrafo que el treebank no separa', () => {
  it('`volō` son DOS verbos con el mismo lema en la anotación', () => {
    // «volō, velle» (querer) y «volō, volāre» (volar). «volābant» ×2 es del
    // segundo, y toda cuenta por lema los suma. En este caso, un irregular
    // de altísima frecuencia con un regular de 1.ª.
    expect(HOMOGRAFO_VOLO).toContain('volāre');
    expect(I('volō').infinitivo).toBe('velle');
  });
});

describe('el registro', () => {
  it('los seis que el punto nombra están', () => {
    for (const l of ['eō', 'ferō', 'volō', 'nōlō', 'mālō', 'fīō']) expect(esIrregular(l), l).toBe(true);
    expect(esIrregular('amō')).toBe(false);
  });

  it('y los seis tienen los tres tiempos completos', () => {
    for (const v of IRREGULARES_L1)
      for (const t of ['presente', 'imperfecto', 'futuro'] as const)
        for (const p of ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'] as const)
          expect(conjugarIrregular(v, p, t), `${v.lema} ${p} ${t}`).toBeTruthy();
  });
});
