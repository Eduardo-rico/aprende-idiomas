// tests/unit/lote-adjetivo-3a-la.test.ts
//
// El lote del adjetivo de la tercera, en verde — y con los invariantes que
// el verde solo no garantiza. El que más importa es el primero: el punto
// entero cuelga de UN ítem, porque hay una sola celda de las 36 donde el
// adjetivo de tres terminaciones se separa del de dos. Si ese ítem
// desaparece, el gate sigue verde y el lote deja de enseñar su punto.
import { describe, it, expect } from 'vitest';
import { LOTE_ADJETIVO_3A } from '@/lib/data/languages/la/lotes/l4-adjetivo-3a';
import { coberturaAdjetivo, reglaDeLosDeDos, revisarLoteAdjetivo, tasasCiegasA } from '@/scripts/lib/gate-adjetivo-3a';
import { declinarAdjetivo3a, ablativoEnE, ADJETIVOS_3A } from '@/lib/data/languages/la/adjetivos-3a';

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteAdjetivo(LOTE_ADJETIVO_3A).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });

  it('llega al piso de L1', () => {
    expect(LOTE_ADJETIVO_3A.length).toBeGreaterThanOrEqual(8);
  });
});

describe('el ítem que carga con el punto', () => {
  it('hay exactamente uno donde la regla de los de dos falla, y es el masculino de «ācer»', () => {
    const refutan = LOTE_ADJETIVO_3A.filter((i) => {
      const [g, c, n] = i.celda.split('.') as ['m' | 'f' | 'n', 'nom' | 'ac' | 'gen' | 'dat' | 'abl' | 'voc', 'sg' | 'pl'];
      return reglaDeLosDeDos(i.adjetivo, g, c, n) !== i.respuesta && i.ejes.examina === 'terminaciones';
    });
    expect(refutan.map((i) => i.respuesta).sort()).toEqual(['fēlīx', 'fēlīx', 'fēlīx', 'ācer']);
    // y el de TRES terminaciones es uno solo, porque no puede haber más
    expect(refutan.filter((i) => i.ejes.terminaciones === 3)).toHaveLength(1);
    expect(refutan.find((i) => i.ejes.terminaciones === 3)!.celda).toBe('m.nom.sg');
  });

  it('quien aplique la regla de los de dos escribe «ācris», que es lengua real y no un invento', () => {
    const acer = ADJETIVOS_3A.find((a) => a.lema === 'ācer')!;
    expect(reglaDeLosDeDos(acer, 'm', 'nom', 'sg')).toBe('ācris');
    expect(declinarAdjetivo3a(acer, 'f', 'nom', 'sg')).toBe('ācris');
  });
});

describe('el varia se examina en los tres valores, no siete veces en uno', () => {
  it('hay ítems de una, dos y tres terminaciones entre los que lo examinan', () => {
    const tipos = LOTE_ADJETIVO_3A.filter((i) => i.ejes.examina === 'terminaciones').map((i) => i.ejes.terminaciones);
    expect(new Set(tipos)).toEqual(new Set([1, 2, 3]));
  });

  it('y todos caen en nominativo singular, que es donde se puede', () => {
    for (const i of LOTE_ADJETIVO_3A.filter((x) => x.ejes.examina === 'terminaciones'))
      expect(i.celda, i.id).toMatch(/\.(nom|voc)\.sg$/);
  });
});

describe('la excepción declarada del participio, por los dos lados', () => {
  it('el mismo lema da dos ablativos según la función', () => {
    const ps = LOTE_ADJETIVO_3A.filter((i) => i.adjetivo.lema === 'praesēns');
    expect(ps).toHaveLength(2);
    const adjetiva = ps.find((i) => i.ejes.funcion === 'adjetiva')!;
    const verbal = ps.find((i) => i.ejes.funcion === 'verbal')!;
    expect(adjetiva.respuesta).toBe('praesentī');
    expect(verbal.respuesta).toBe('praesente');
    expect(verbal.respuesta).toBe(ablativoEnE(verbal.adjetivo));
    // Y el ablativo absoluto NO lleva un nombre de la tercera al lado: con
    // «patre» los dos acabarían en `-e` y se acertaría copiando.
    expect(verbal.desinenciaDelNombre).not.toBe('e');
  });
});

describe('las tasas ciegas, con su denominador', () => {
  it('ninguna decide el lote', () => {
    const t = tasasCiegasA(LOTE_ADJETIVO_3A);
    for (const [nombre, r] of Object.entries(t)) expect(r.tasa, nombre).toBeLessThanOrEqual(0.5);
  });

  it('y la del ablativo se lee sobre los cuatro ablativos, no sobre trece', () => {
    expect(tasasCiegasA(LOTE_ADJETIVO_3A).ablativoEnE.decididos).toBe(4);
    expect(coberturaAdjetivo(LOTE_ADJETIVO_3A).find((c) => c.comprobacion.startsWith('el ablativo'))!.decididos).toBe(4);
  });
});
