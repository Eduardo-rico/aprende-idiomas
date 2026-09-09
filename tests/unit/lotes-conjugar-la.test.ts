// tests/unit/lotes-conjugar-la.test.ts
//
// Presente e imperfecto. El control que importa es el de la ruta ciega:
// la primera versión comparaba colas de palabras distintas y devolvía
// números que parecían medidas y no lo eran.
import { describe, it, expect } from 'vitest';
import { LOTE_PRESENTE } from '@/lib/data/languages/la/lotes/l5-presente';
import { LOTE_IMPERFECTO } from '@/lib/data/languages/la/lotes/l5-imperfecto';
import {
  revisarItemConjugar, revisarLoteConjugar, claseDe, temaYDesinencia,
  imperfectoIngenuo, infijoDelImperfecto, type ItemConjugar,
} from '@/scripts/lib/gate-conjugar';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { conjugar } from '@/lib/data/languages/la/paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const copia = (l: ItemConjugar[]) => l.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('presente e imperfecto · en verde', () => {
  it('los dos lotes pasan su gate', () => {
    expect(revisarLoteConjugar(LOTE_PRESENTE, {}).fallos).toHaveLength(0);
    expect(revisarLoteConjugar(LOTE_IMPERFECTO, { exigeLosDosInfijos: true }).fallos).toHaveLength(0);
  });

  it('toda forma la deriva la máquina', () => {
    for (const it of [...LOTE_PRESENTE, ...LOTE_IMPERFECTO])
      expect(it.respuesta, it.id).toBe(conjugar(it.verbo, it.persona, it.tiempo));
  });

  it('las cinco clases y las seis personas, en los dos', () => {
    for (const lote of [LOTE_PRESENTE, LOTE_IMPERFECTO]) {
      expect(new Set(lote.map((it) => it.ejes.clase)).size).toBe(5);
      for (const p of ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'])
        expect(lote.some((it) => it.persona === p), p).toBe(true);
    }
  });

  it('ningún marco lleva macrón', () => {
    for (const it of [...LOTE_PRESENTE, ...LOTE_IMPERFECTO])
      expect(it.marco, it.id).not.toMatch(/[āēīōū]/);
  });
});

describe('el varia del imperfecto, verificado contra la máquina', () => {
  it('NO se puede leer de la forma: «monēbam» contiene «ēba» y es infijo corto', () => {
    // La `ē` de `monēbam` es la vocal del tema; la de `legēbam` es parte del
    // infijo. La superficie es la misma y la segmentación depende de la
    // clase. Buscar «ēba» en la cadena —que es lo que hacía la primera
    // versión— clasifica mal la 2.ª entera.
    expect(conjugar(V('moneō'), '1sg', 'imperfecto').includes('ēba')).toBe(true);
    expect(conjugar(V('legō'), '1sg', 'imperfecto').includes('ēba')).toBe(true);
    expect(infijoDelImperfecto(V('moneō'))).toBe('bā');
    expect(infijoDelImperfecto(V('legō'))).toBe('ēbā');
  });

  it('«-bā-» en la 1.ª y la 2.ª, «-ēbā-» en las otras tres', () => {
    expect(infijoDelImperfecto(V('amō'))).toBe('bā');
    expect(infijoDelImperfecto(V('moneō'))).toBe('bā');
    expect(infijoDelImperfecto(V('legō'))).toBe('ēbā');
    expect(infijoDelImperfecto(V('audiō'))).toBe('ēbā');
    expect(infijoDelImperfecto(V('capiō'))).toBe('ēbā');
  });

  it('y el lote trae los dos', () => {
    const infijos = new Set(LOTE_IMPERFECTO.map((it) => infijoDelImperfecto(it.verbo)));
    expect([...infijos].sort()).toEqual(['bā', 'ēbā']);
  });
});

describe('la ruta ciega, que la primera versión no medía', () => {
  it('EN EL IMPERFECTO la desinencia de persona es la MISMA en las cinco clases', () => {
    // Por eso `temaYDesinencia` se traga el infijo y la ruta «poner la
    // desinencia de otra clase» devolvía el 100 %: no había nada que cambiar.
    for (const l of ['amō', 'moneō', 'legō', 'audiō', 'capiō'])
      expect(temaYDesinencia(V(l), '1sg', 'imperfecto').desinencia, l).toBe('am');
  });

  it('así que la ruta buena es quitarle el «-re» al infinitivo', () => {
    // Acierta en la 1.ª y la 2.ª y falla en las otras tres, que es
    // exactamente el contenido del punto.
    for (const l of ['amō', 'moneō'])
      expect(imperfectoIngenuo(V(l), '1sg'), l).toBe(conjugar(V(l), '1sg', 'imperfecto'));
    for (const l of ['legō', 'audiō', 'capiō'])
      expect(imperfectoIngenuo(V(l), '1sg'), l).not.toBe(conjugar(V(l), '1sg', 'imperfecto'));
    // Y en `legō` la diferencia es SÓLO la cantidad: «legebam» / «legēbam».
    expect(imperfectoIngenuo(V('legō'), '1sg')).toBe('legebam');
    expect(conjugar(V('legō'), '1sg', 'imperfecto')).toBe('legēbam');
  });

  it('EN EL PRESENTE sí se ve en la desinencia, y ahí la otra ruta vale', () => {
    expect(temaYDesinencia(V('amō'), '2sg', 'presente')).toEqual({ tema: 'am', desinencia: 'ās' });
    expect(temaYDesinencia(V('legō'), '2sg', 'presente')).toEqual({ tema: 'leg', desinencia: 'is' });
  });
});

describe('presente e imperfecto · ROJO', () => {
  it('una clase mal declarada', () => {
    const it = copia(LOTE_PRESENTE)[0]!;
    it.ejes.clase = it.ejes.clase === '1ª' ? '3ª' : '1ª';
    expect(revisarItemConjugar(it).some((f) => f.clase === 'clase-mal-declarada')).toBe(true);
  });

  it('un lote de una sola clase no puede medir la ruta ciega', () => {
    const unaSola = copia(LOTE_PRESENTE).filter((it) => it.ejes.clase === '1ª');
    expect(revisarLoteConjugar(unaSola, {}).fallos.some((f) => f.clase === 'una-sola-clase')).toBe(true);
  });

  it('un imperfecto sólo de 1.ª y 2.ª lo resuelve la ruta ingenua entera', () => {
    const soloBajas = copia(LOTE_IMPERFECTO).filter((it) => infijoDelImperfecto(it.verbo) === 'bā');
    const r = revisarLoteConjugar(soloBajas, { exigeLosDosInfijos: true });
    expect(r.tasaClaseEquivocada).toBe(1);
    expect(r.fallos.some((f) => f.clase === 'clase-equivocada-resuelve')).toBe(true);
    expect(r.fallos.some((f) => f.clase === 'infijo-sin-cubrir')).toBe(true);
  });

  it('una respuesta que la máquina no deriva', () => {
    const it = copia(LOTE_IMPERFECTO)[0]!;
    it.respuesta = 'inventado';
    expect(revisarItemConjugar(it).some((f) => f.clase === 'respuesta-no-derivada')).toBe(true);
  });
});
