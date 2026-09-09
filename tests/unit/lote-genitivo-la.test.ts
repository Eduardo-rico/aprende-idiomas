// tests/unit/lote-genitivo-la.test.ts
//
// El genitivo posesivo. El punto lo llama «el caso más transparente para un
// hispanohablante» y lo es en el SIGNIFICADO; lo que no es transparente es
// la forma, y ahí está todo el contenido.
import { describe, it, expect } from 'vitest';
import { LOTE_GENITIVO } from '@/lib/data/languages/la/lotes/l3-genitivo-posesivo';
import {
  revisarItemFuncionCaso, revisarLoteFuncionCaso, type ItemFuncionCaso,
} from '@/scripts/lib/gate-funcion-caso';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { paradigmaNominal } from '@/lib/data/languages/la/paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
const OPC = { colisionesMinimas: 0, colisionesMaximas: 2 };
const copia = (): ItemFuncionCaso[] => LOTE_GENITIVO.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('el genitivo · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteFuncionCaso(LOTE_GENITIVO, OPC);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('mitad antepuestos y mitad pospuestos', () => {
    expect(LOTE_GENITIVO.filter((it) => it.ejes.posicion === 'antes')).toHaveLength(6);
    expect(LOTE_GENITIVO.filter((it) => it.ejes.posicion === 'despues')).toHaveLength(6);
  });

  it('y ese 50 % es del LOTE, no de la lengua', () => {
    // Medido: en el corpus el genitivo se pospone el 75,9 % y se antepone el
    // 24,1 % (77,4 / 22,6 en la Vulgata). El español pospone siempre, así
    // que el instinto acierta tres de cada cuatro leyendo de verdad.
    const antes = LOTE_GENITIVO.filter((it) => it.ejes.posicion === 'antes').length;
    expect(antes / LOTE_GENITIVO.length).toBeCloseTo(0.5, 2);
  });
});

describe('dónde muerde, que no es la posición sola', () => {
  it('once lemas tienen el genitivo singular idéntico al nominativo plural', () => {
    const iguales = NOMBRES_L1.filter((n) => {
      try { const p = paradigmaNominal(n); return p['gen.sg'] === p['nom.pl']; } catch { return false; }
    });
    expect(iguales.length).toBeGreaterThanOrEqual(11);
    for (const l of ['puella', 'rēgīna', 'poēta', 'nauta']) expect(iguales.map((x) => x.lema)).toContain(l);
  });

  it('un genitivo antepuesto sólo es trampa si además parece nominativo', () => {
    // `mundī rēgnō` no ofrece lectura falsa: `mundī` no puede ser sujeto.
    // `puerī liber` sí: «los niños [son] libres». La condición del proyecto
    // para llamar trampa a algo es que la lectura falsa sea COHERENTE.
    const trampas = LOTE_GENITIVO.filter((it) => it.ejes.posicion === 'antes' && it.ejes.pareceNominativo);
    expect(trampas.length).toBeGreaterThan(2);
    for (const it of trampas) {
      const p = paradigmaNominal(it.entrada);
      expect(p['gen.sg'], it.id).toBe(p['nom.pl']);
    }
    // Y los antepuestos que NO lo son están ahí como contraste.
    const inocuos = LOTE_GENITIVO.filter((it) => it.ejes.posicion === 'antes' && !it.ejes.pareceNominativo);
    expect(inocuos.length).toBeGreaterThan(0);
  });
});

describe('el genitivo · ROJO', () => {
  it('EL QUE SE ESCAPÓ: comparar respetando la mayúscula', () => {
    // El marco capitaliza su primera palabra, y un genitivo antepuesto ES la
    // primera palabra. Con la comparación sensible al caso fallaban los seis
    // ítems antepuestos: justo la mitad que el punto examina.
    for (const it of LOTE_GENITIVO.filter((x) => x.ejes.posicion === 'antes')) {
      expect(it.marco.startsWith(it.forma), it.id).toBe(false);   // va capitalizado
      expect(revisarItemFuncionCaso(it), it.id).toHaveLength(0);  // y aun así pasa
    }
  });

  it('un lote todo pospuesto lo resuelve el instinto español', () => {
    const soloDespues = copia().filter((it) => it.ejes.posicion === 'despues');
    expect(revisarLoteFuncionCaso(soloDespues, OPC).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('y uno escorado, también', () => {
    const escorado = [...copia().filter((it) => it.ejes.posicion === 'despues'),
                      ...copia().filter((it) => it.ejes.posicion === 'antes').slice(0, 1)];
    expect(revisarLoteFuncionCaso(escorado, OPC).fallos.some((f) => f.clase === 'funcion-constante')).toBe(true);
  });

  it('una cuenta de colisiones inventada', () => {
    const it = copia()[0]!;
    it.ejes.colisiones += 2;
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'colisiones-mal-contadas')).toBe(true);
  });
});
