// tests/unit/lote-irregulares-la.test.ts
//
// El lote de los seis irregulares, en verde y con los invariantes que el
// verde solo no garantiza.
import { describe, it, expect } from 'vitest';
import { LOTE_IRREGULARES } from '@/lib/data/languages/la/lotes/l5-irregulares';
import { celdaDe, coberturaIrregulares, revisarLoteIrregulares, tasasCiegasI } from '@/scripts/lib/gate-irregulares';
import { IRREGULARES_L1, HOMOGRAFO_VOLO } from '@/lib/data/languages/la/irregulares';

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteIrregulares(LOTE_IRREGULARES).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('llega al piso de L1', () => {
    expect(LOTE_IRREGULARES.length).toBeGreaterThanOrEqual(8);
  });
});

describe('el varia, que son dos ejes', () => {
  it('están los seis verbos que el PUNTO nombra', () => {
    // Contra los seis del punto, no contra la tabla: `dō` entró en
    // `IRREGULARES_L1` el 2026-09-12 porque tres lotes publicados usaban
    // `dat` y el lexicón no tenía el verbo, pero el punto no lo nombra. La
    // tabla puede tener más verbos que el punto; el lote cubre los del punto.
    expect(new Set(LOTE_IRREGULARES.map((i) => i.verbo.lema)))
      .toEqual(new Set(['eō', 'ferō', 'volō', 'nōlō', 'mālō', 'fīō']));
    for (const l of ['eō', 'ferō', 'volō', 'nōlō', 'mālō', 'fīō'])
      expect(IRREGULARES_L1.some((v) => v.lema === l), l).toBe(true);
  });

  it('y ninguna 1.ª del singular, porque es el lema y no refuta nada', () => {
    expect(LOTE_IRREGULARES.some((i) => i.persona === '1sg')).toBe(false);
    expect(tasasCiegasI(LOTE_IRREGULARES).copiarLema.tasa).toBe(0);
  });

  it('los doce refutan la regla general: el listón aquí es cero, no «poco»', () => {
    expect(coberturaIrregulares(LOTE_IRREGULARES).find((c) => c.comprobacion.startsWith('la celda refuta'))!.decididos)
      .toBe(LOTE_IRREGULARES.length);
    expect(tasasCiegasI(LOTE_IRREGULARES).conjugarComoRegular.tasa).toBe(0);
  });
});

describe('los registros que sólo un verbo puede enseñar', () => {
  it('la irregularidad fuera del presente sólo la trae «eō»', () => {
    const fuera = LOTE_IRREGULARES.filter((i) => i.tiempo !== 'presente');
    expect(fuera.length).toBeGreaterThan(0);
    for (const i of fuera) expect(i.verbo.lema, i.id).toBe('eō');
  });

  it('«nōlō» va por sus dos caras: una palabra en el plural y dos en el singular', () => {
    const ns = LOTE_IRREGULARES.filter((i) => i.verbo.lema === 'nōlō');
    expect(ns.some((i) => !i.respuesta.includes(' '))).toBe(true);
    expect(ns.some((i) => i.respuesta.includes(' '))).toBe(true);
  });

  it('«fīō» sólo aparece en la única celda que existe', () => {
    for (const i of LOTE_IRREGULARES.filter((x) => x.verbo.lema === 'fīō')) {
      expect(i.respuesta, i.id).toBe('fit');
      expect(i.persona, i.id).toBe('3sg');
    }
  });
});

describe('toda respuesta está atestiguada, y con qué cuenta', () => {
  it('ninguna sale de cero apariciones', () => {
    for (const i of LOTE_IRREGULARES) {
      const c = celdaDe(i.verbo.lema, i.tiempo, i.persona)!;
      expect(c.n, `${i.id} «${i.respuesta}»`).toBeGreaterThan(0);
    }
  });

  it('y la de «nōn vult» es la del bigrama: 3, no las 32 de «vult»', () => {
    const i = LOTE_IRREGULARES.find((x) => x.respuesta === 'nōn vult')!;
    expect(celdaDe(i.verbo.lema, i.tiempo, i.persona)!.n).toBe(3);
    expect(celdaDe('volō', 'presente', '3sg')!.n).toBe(32);
  });
});

describe('el homógrafo que el módulo declara', () => {
  it('los ítems de «volō» son del de «querer», y la glosa lo dice', () => {
    expect(HOMOGRAFO_VOLO).toContain('volāre');
    for (const i of LOTE_IRREGULARES.filter((x) => x.verbo.lema === 'volō')) {
      expect(i.glosa.toLowerCase(), i.id).toMatch(/quer|quier|queré/);
      expect(i.glosa.toLowerCase(), i.id).not.toContain('vuel');
    }
  });
});

describe('ningún marco lleva pronombre sujeto', () => {
  it('ni uno, y el motivo está escrito en el gate', () => {
    for (const i of LOTE_IRREGULARES)
      expect(i.marco.normalize('NFC'), i.id).not.toMatch(/(?<!\p{L})(ego|tū|nōs|vōs)(?!\p{L})/iu);
  });
});
