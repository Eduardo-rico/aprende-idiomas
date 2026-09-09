// tests/unit/lote-imperativo-la.test.ts
//
// El imperativo. Lo que el lote tiene que enseñar es que la irregularidad
// NO es del verbo sino de UNA de sus dos formas: «dīc» es irregular y
// «dīcite» no.
import { describe, it, expect } from 'vitest';
import { LOTE_IMPERATIVO } from '@/lib/data/languages/la/lotes/l5-imperativo';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { imperativo, esImperativoIrregular } from '@/lib/data/languages/la/paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

describe('el imperativo · en verde', () => {
  it('toda forma la deriva la máquina', () => {
    for (const it of LOTE_IMPERATIVO)
      expect(it.respuesta, it.id).toBe(imperativo(it.verbo, it.numero));
  });

  it('el eje declarado coincide con la máquina', () => {
    for (const it of LOTE_IMPERATIVO)
      expect(it.ejes.irregular, it.id).toBe(esImperativoIrregular(it.verbo));
  });

  it('siete singulares y siete plurales', () => {
    expect(LOTE_IMPERATIVO.filter((it) => it.numero === 'sg')).toHaveLength(7);
    expect(LOTE_IMPERATIVO.filter((it) => it.numero === 'pl')).toHaveLength(7);
  });

  it('ningún marco lleva macrón', () => {
    for (const it of LOTE_IMPERATIVO) expect(it.marco, it.id).not.toMatch(/[āēīōū]/);
  });
});

describe('la irregularidad es de UNA forma, no del verbo', () => {
  it('cada irregular aparece en sus DOS formas', () => {
    // Un lote que sólo trajera los singulares enseñaría que «dīcō es
    // irregular», que es falso: lo irregular es su imperativo de singular.
    const sg = LOTE_IMPERATIVO.filter((it) => it.ejes.irregular && it.numero === 'sg');
    const pl = LOTE_IMPERATIVO.filter((it) => it.ejes.irregular && it.numero === 'pl');
    expect(sg.length).toBe(pl.length);
    expect(new Set(sg.map((it) => it.verbo.lema))).toEqual(new Set(pl.map((it) => it.verbo.lema)));
  });

  it('y el plural de los irregulares es completamente normal', () => {
    // «dīcite» se forma como «legite»: tema + `-ite`. Sólo el singular pierde.
    expect(imperativo(V('dīcō'), 'pl')).toBe('dīcite');
    expect(imperativo(V('legō'), 'pl')).toBe('legite');
    expect(imperativo(V('dīcō'), 'sg')).toBe('dīc');
    expect(imperativo(V('legō'), 'sg')).toBe('lege');
  });

  it('los tres irregulares declaran qué les pasa y dónde NO les pasa', () => {
    for (const it of LOTE_IMPERATIVO.filter((x) => x.ejes.irregular)) {
      expect(it.ejes.queLePasa, it.id).toBeTruthy();
      expect(it.ejes.queLePasa, it.id).toContain('SÓLO en el singular');
    }
  });
});

describe('el imperativo regular, las cinco clases', () => {
  it('la 3.ª y la mixta cambian la vocal temática ante «-te»', () => {
    expect(imperativo(V('legō'), 'sg')).toBe('lege');
    expect(imperativo(V('legō'), 'pl')).toBe('legite');   // e → i
    expect(imperativo(V('capiō'), 'sg')).toBe('cape');
    expect(imperativo(V('capiō'), 'pl')).toBe('capite');
  });

  it('y la 1.ª, la 2.ª y la 4.ª conservan la suya', () => {
    expect(imperativo(V('amō'), 'pl')).toBe('amāte');
    expect(imperativo(V('moneō'), 'pl')).toBe('monēte');
    expect(imperativo(V('audiō'), 'pl')).toBe('audīte');
  });
});
