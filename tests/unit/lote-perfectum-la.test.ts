// tests/unit/lote-perfectum-la.test.ts
import { describe, it, expect } from 'vitest';
import { LOTE_PERFECTUM } from '@/lib/data/languages/la/lotes/l6-perfectum';
import { revisarItemPf, revisarLotePf, FORMACIONES, type ItemPf } from '@/scripts/lib/gate-perfectum';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { variantesDelPerfecto } from '@/lib/data/languages/la/paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const copia = () => LOTE_PERFECTUM.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('el perfectum · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLotePf(LOTE_PERFECTUM as never);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('las cuatro formaciones del tema, incluida la reduplicada que faltaba', () => {
    for (const f of FORMACIONES)
      expect(LOTE_PERFECTUM.some((it) => it.ejes.formacion === f), f).toBe(true);
    expect(VERBOS_L1.some((v) => v.perfecto === 'stetī')).toBe(true);
    expect(VERBOS_L1.some((v) => v.perfecto === 'cecidī')).toBe(true);
  });

  it('los tres tiempos', () => {
    for (const t of ['perfecto', 'pluscuamperfecto', 'futuro-perfecto'])
      expect(LOTE_PERFECTUM.some((it) => it.tiempo === t), t).toBe(true);
  });
});

describe('la excepción del punto es peor de lo que dice', () => {
  it('«vīdēre» y «vidēre» se escriben IGUAL sin cantidad', () => {
    const sinM = (s: string) => s.normalize('NFD').replace(/[̄]/g, '').normalize('NFC');
    const ere = variantesDelPerfecto(V('videō'), '3pl', 'perfecto')[1]!;
    expect(ere).toBe('vīdēre');
    expect(sinM(ere)).toBe(sinM(V('videō').infinitivo));
    // Y lo mismo con `legō`.
    const ere2 = variantesDelPerfecto(V('legō'), '3pl', 'perfecto')[1]!;
    expect(sinM(ere2)).toBe(sinM(V('legō').infinitivo));
  });

  it('así que no es que «pueda» confundirlos: la forma no lleva la información', () => {
    const chocan = LOTE_PERFECTUM.filter((it) => it.ejes.chocaConElInfinitivo);
    expect(chocan.length).toBe(2);
    for (const it of chocan) expect(it.ejes.chocaConElInfinitivo).toContain('no contiene la información');
  });

  it('y la variante sale el 3,6 % de las veces: real y rara', () => {
    // 61 contra 1.614 en el corpus. Dos ítems, no más.
    expect(LOTE_PERFECTUM.filter((it) => it.respuesta.endsWith('ēre'))).toHaveLength(2);
  });
});

describe('el perfectum · ROJO', () => {
  it('un lote sin la variante enseña que la 3.ª pl tiene una sola forma', () => {
    const sinVariante = copia().filter((it) => !it.respuesta.endsWith('ēre'));
    expect(revisarLotePf(sinVariante as never).fallos.some((f) => f.clase === 'sin-la-variante')).toBe(true);
  });

  it('un lote sin reduplicados no cubre el varia', () => {
    const sinRedup = copia().filter((it) => it.ejes.formacion !== 'reduplicado');
    expect(revisarLotePf(sinRedup as never).fallos.some((f) => f.clase === 'formacion-sin-cubrir')).toBe(true);
  });

  it('callarse el choque con el infinitivo', () => {
    const it = copia().find((x) => x.ejes.chocaConElInfinitivo)!;
    delete it.ejes.chocaConElInfinitivo;
    expect(revisarItemPf(it as never).some((f) => f.clase === 'choque-no-declarado')).toBe(true);
  });

  it('y declararlo donde no lo hay', () => {
    const it = copia().find((x) => !x.ejes.chocaConElInfinitivo)!;
    it.ejes.chocaConElInfinitivo = 'me lo invento';
    expect(revisarItemPf(it as never).some((f) => f.clase === 'choque-declarado-de-mas')).toBe(true);
  });
});
