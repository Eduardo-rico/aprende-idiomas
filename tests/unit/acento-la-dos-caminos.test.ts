// tests/unit/acento-la-dos-caminos.test.ts
//
// LA MISMA REGLA ESTÁ ESCRITA DOS VECES EN ESTE REPOSITORIO.
//
//   · `acentoDe` en `lib/lang/ortografia-la.ts` — producto, devuelve
//     `llana` o `esdrujula` y no expone las sílabas.
//   · `acentoLatino` en `scripts/voz/cuanto-duele.ts` — instrumento,
//     devuelve las sílabas y por eso lo usa la línea de voz.
//
// Una regla copiada se desincroniza, y en este proyecto ya había pasado dos
// veces (el mapa bloque→nivel y el acento de hiato). Ésta es la tercera:
// cruzadas sobre las 1.405 formas no monosílabas de L1, **discrepaban en 9**,
// y las nueve eran el mismo caso — `cuanto-duele` tenía `ui` en la lista de
// diptongos, así que partía `habuit` como `ha-buit` y lo hacía llano. La
// palabra es `ha-bu-it`, esdrújula, y en latín `ui` sólo es diptongo en
// `cui`, `huic` y `hui`.
//
// No se ha unificado el código —devuelven cosas distintas y la línea de voz
// depende de las sílabas—, así que lo que impide la cuarta vez es este
// test: cruzarlas sobre TODAS las formas, no sobre una muestra.
import { describe, it, expect } from 'vitest';
import { acentoDe } from '@/lib/lang/ortografia-la';
import { acentoLatino, silabas } from '@/scripts/voz/cuanto-duele';
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { paradigmaNominal, infectum, perfectum, declinacionDe } from '@/lib/data/languages/la/paradigma-la';

function todasLasFormas(): string[] {
  const out = new Set<string>();
  for (const n of NOMBRES_L1) {
    try { declinacionDe(n); } catch { continue; }
    for (const f of Object.values(paradigmaNominal(n))) out.add(f);
  }
  for (const v of VERBOS_L1) {
    for (const f of Object.values(infectum(v))) out.add(f);
    for (const f of Object.values(perfectum(v))) out.add(f);
  }
  for (const a of ADJETIVOS_L1) out.add(a.lema);
  return [...out];
}

describe('los dos caminos del acento dicen lo mismo', () => {
  it('sobre TODAS las formas de L1, no sobre una muestra', () => {
    const discrepan: string[] = [];
    let comparadas = 0;
    for (const f of todasLasFormas()) {
      const a = acentoDe(f);
      if (a === null) continue;                 // monosílabo: `acentoDe` no opina
      comparadas++;
      const b = acentoLatino(f);
      const bNorm = b.acento === 'antepenultima' ? 'esdrujula' : 'llana';
      if (a !== bNorm) discrepan.push(`${f}: lib/lang «${a}» · scripts/voz «${b.acento}» (${silabas(f).join('-')})`);
    }
    expect(comparadas).toBeGreaterThan(1000);
    expect(discrepan).toEqual([]);
  });
});

describe('el caso concreto que los separaba', () => {
  it('«ui» no es diptongo en «habuit» y compañía', () => {
    for (const [p, sil] of [['habuit', 'ha-bu-it'], ['monuit', 'mo-nu-it'], ['fuimus', 'fu-i-mus'],
                            ['docuimus', 'do-cu-i-mus'], ['timuit', 'ti-mu-it']] as const) {
      expect(silabas(p).join('-'), p).toBe(sil);
      expect(acentoLatino(p).acento, p).toBe('antepenultima');
      expect(acentoDe(p), p).toBe('esdrujula');
    }
  });

  it('y SÍ lo es en las tres palabras donde el latín lo tiene', () => {
    expect(silabas('cui')).toEqual(['cui']);
    expect(silabas('huic')).toEqual(['huic']);
  });
});

describe('la cifra que sostiene la decisión de la voz', () => {
  it('el motor italiano falla en la proporción medida, y el número se declara aquí', () => {
    const formas = todasLasFormas();
    const breves = formas.filter((f) => acentoLatino(f).acento === 'antepenultima').length;
    // 528 de 1.429 = 36,9 %. Antes del arreglo del diptongo salía 36,3 %,
    // y la diferencia son exactamente las nueve formas que discrepaban.
    expect(formas.length).toBeGreaterThanOrEqual(1400);
    expect(breves / formas.length).toBeGreaterThan(0.35);
    expect(breves / formas.length).toBeLessThan(0.39);
  });
});
