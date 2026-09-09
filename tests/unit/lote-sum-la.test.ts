// tests/unit/lote-sum-la.test.ts
//
// `sum` y sus compuestos. La «única complicación» que el punto declara son
// en realidad DOS, y de naturaleza distinta.
import { describe, it, expect } from 'vitest';
import { LOTE_SUM } from '@/lib/data/languages/la/lotes/l5-sum-y-compuestos';
import { revisarItemSum, revisarLoteSum, concatenacionIngenua } from '@/scripts/lib/gate-sum';
import { COMPUESTOS_DE_SUM, conjugarCompuesto, paradigmaCompuesto } from '@/lib/data/languages/la/compuestos-de-sum';

const C = (l: string) => COMPUESTOS_DE_SUM.find((x) => x.lema === l)!;
const copia = () => LOTE_SUM.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('sum y compuestos · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteSum(LOTE_SUM as never);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('los dos contextos y los cinco compuestos', () => {
    expect(LOTE_SUM.filter((it) => it.ejes.anteVocal)).toHaveLength(7);
    expect(LOTE_SUM.filter((it) => !it.ejes.anteVocal)).toHaveLength(7);
    expect(new Set(LOTE_SUM.filter((it) => it.compuesto).map((it) => it.compuesto!.lema)).size).toBe(5);
  });

  it('y compuestos que cambian junto a otros que no', () => {
    expect(LOTE_SUM.some((it) => it.compuesto && it.ejes.cambia)).toBe(true);
    expect(LOTE_SUM.some((it) => it.compuesto && !it.ejes.cambia)).toBe(true);
  });
});

describe('la «única complicación» son DOS y no son lo mismo', () => {
  it('`possum` ASIMILA: pot+sum → possum, y ante vocal reaparece la t', () => {
    const p = paradigmaCompuesto(C('possum'));
    expect(p['1sg']).toBe('possum');
    expect(p['3sg']).toBe('potest');
    expect(p['1pl']).toBe('possumus');
    expect(p['2pl']).toBe('potestis');
  });

  it('`prōsum` INSERTA una -d- que no está en el prefijo suelto', () => {
    const p = paradigmaCompuesto(C('prōsum'));
    expect(p['1sg']).toBe('prōsum');
    expect(p['3sg']).toBe('prōdest');
    // No es una asimilación: nada se pierde ni se iguala, aparece algo.
    expect(C('prōsum').asimilacion).toContain('consonante de enlace');
  });

  it('y llamarlas igual haría esperar *«addest», que no existe', () => {
    // `adsum` no hace nada: el mismo alomorfo en los dos contextos.
    const p = paradigmaCompuesto(C('adsum'));
    expect(p['1sg']).toBe('adsum');
    expect(p['3sg']).toBe('adest');
    expect(C('adsum').asimilacion).toBeUndefined();
  });
});

describe('sum y compuestos · ROJO', () => {
  it('pegar el prefijo a ciegas da formas que no existen', () => {
    expect(concatenacionIngenua(C('possum'), '3sg', 'presente')).toBe('posest');
    expect(conjugarCompuesto(C('possum'), '3sg', 'presente')).toBe('potest');
    expect(concatenacionIngenua(C('prōsum'), '3sg', 'presente')).toBe('prōest');
    expect(conjugarCompuesto(C('prōsum'), '3sg', 'presente')).toBe('prōdest');
  });

  it('un lote de un solo contexto no enseña que exista un alomorfo', () => {
    const soloConsonante = copia().filter((it) => !it.ejes.anteVocal);
    expect(revisarLoteSum(soloConsonante as never).fallos
      .some((f) => f.clase === 'sin-los-dos-contextos')).toBe(true);
  });

  it('y uno sin compuestos «aburridos» enseña que los prefijos siempre cambian', () => {
    const soloLosQueCambian = copia().filter((it) => !it.compuesto || it.ejes.cambia);
    expect(revisarLoteSum(soloLosQueCambian as never).fallos
      .some((f) => f.clase === 'sin-compuesto-que-no-cambie')).toBe(true);
  });

  it('un contexto mal declarado', () => {
    const it = copia()[0]!;
    it.ejes.anteVocal = !it.ejes.anteVocal;
    expect(revisarItemSum(it as never).some((f) => f.clase === 'contexto-mal-declarado')).toBe(true);
  });
});
