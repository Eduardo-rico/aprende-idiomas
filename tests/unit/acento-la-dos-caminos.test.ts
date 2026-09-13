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
//
// ── Y CRUZARLAS NO BASTA, QUE ES LA PARTE QUE COSTÓ ──────────────────
//
// Con las dos de acuerdo, `Deus` seguía saliendo MONOSÍLABO en las dos:
// las dos tenían `eu` en la lista de diptongos, porque una es copia de la
// otra. **Una copia y su original coinciden en el error**, así que el cruce
// da una confianza que no ha ganado.
//
// El camino que sí es independiente sale del LEXICÓN y no del silabeador:
// el tema de `Deus` se saca de su genitivo `Deī`, o sea `De-`, y entonces
// `Deus` es `De` + `us`. Una frontera de morfema no cae nunca dentro de un
// diptongo. Encontró 4 formas —`Deus`, `Deum` y el vocativo—, que son 432
// tokens del corpus y la palabra más frecuente de la mitad vulgata.
//
// Y de paso: la primera versión de ese cruce devolvió CERO porque llamaba a
// una función que no existe con ese nombre y el `try/catch` se tragó el
// error. Un cero que sólo significaba «no he mirado». Por eso aquí no hay
// `catch` que silencie nada.
import { describe, it, expect } from 'vitest';
import { acentoDe } from '@/lib/lang/ortografia-la';
import { acentoLatino, silabas } from '@/scripts/voz/cuanto-duele';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { paradigmaNominal, declinacionDe } from '@/lib/data/languages/la/paradigma-la';
import { formasUnicasDeL1 } from '@/lib/data/languages/la/todas-las-formas';

// El dominio NO se enumera aquí. Este mismo test tenía su propia copia y
// cruzaba las dos implementaciones sobre 1.437 formas cuando la máquina
// produce 2.194 — o sea que el guardián contra la desincronización estaba
// él mismo mirando el 65 % del material.
const todasLasFormas = formasUnicasDeL1;

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
    expect(comparadas).toBeGreaterThan(2000);
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

describe('el camino independiente: la frontera de morfema', () => {
  // El tema sale del GENITIVO, que es dato del lexicón, no derivación del
  // silabeador. Ahí está la independencia.
  const temaPorGenitivo = (gen: string, d: string) => {
    const g = gen.normalize('NFC');
    if (d === '1ª') return g.replace(/ae$/, '');
    if (d === '2ª') return g.replace(/ī$/, '');
    if (d === '3ª') return g.replace(/is$/, '');
    if (d === '4ª') return g.replace(/ūs$/, '');
    return g.replace(/eī$|ēī$/, '');
  };
  const sinM = (x: string) => x.normalize('NFD').replace(/[\u0304\u0306]/g, '').normalize('NFC').toLowerCase();
  const V = 'aeiouāēīōūyȳ';

  it('ninguna sílaba se traga una frontera de morfema', () => {
    const malas: string[] = [];
    let fronteras = 0;
    for (const n of NOMBRES_L1) {
      let d: string;
      try { d = String(declinacionDe(n)); } catch { continue; }   // sólo se salta lo que no es de las cinco
      const tema = temaPorGenitivo(n.genitivo, d);
      if (!tema || !V.includes(tema[tema.length - 1]!)) continue;
      // EXCEPCIÓN MEDIDA, no supuesta: un tema que acaba en `qu` —`aqu-`—
      // no acaba en vocal aunque lo parezca: la `u` es parte de la
      // consonante labiovelar y va con la sílaba siguiente. `aqua` es
      // `a-qua`, y la frontera de morfema cae DENTRO de esa consonante.
      // Lo destapó `aqua` al entrar en el lexicón: doce formas de golpe, y
      // el equivocado era este test, no el silabeador.
      if (/qu$/i.test(tema)) continue;
      for (const [celda, f] of Object.entries(paradigmaNominal(n))) {
        const fn = f.normalize('NFC');
        if (sinM(fn).indexOf(sinM(tema)) !== 0) continue;
        const resto = fn.slice(tema.length);
        if (!resto || !V.includes(resto[0]!)) continue;
        fronteras++;
        // La frontera cae entre dos vocales: tienen que quedar en sílabas
        // distintas, o sea el silabeo debe partir justo ahí.
        const antes = silabas(fn).reduce<string[]>((acc, s) => [...acc, (acc[acc.length - 1] ?? '') + s], []);
        const parteAhi = antes.some((pref) => sinM(pref) === sinM(tema));
        if (!parteAhi) malas.push(`${n.lema} ${celda}: ${fn} = «${tema}»+«${resto}» pero silabea ${silabas(fn).join('-')}`);
      }
    }
    expect(fronteras).toBeGreaterThan(50);   // que el test haya MIRADO de verdad
    expect(malas).toEqual([]);
  });

  it('«Deus» es bisílabo y llana, que es lo que este camino destapó', () => {
    expect(silabas('Deus')).toEqual(['de', 'us']);
    expect(silabas('Deum')).toEqual(['de', 'um']);
    expect(acentoDe('Deus')).toBe('llana');
    expect(acentoLatino('Deus').acento).toBe('bisilabo');
  });

  it('y «heu», «cui», «huic» siguen siendo monosílabos', () => {
    for (const w of ['heu', 'cui', 'huic']) expect(silabas(w), w).toEqual([w]);
  });
});

describe('la cifra que sostiene la decisión de la voz', () => {
  it('el motor italiano falla en la proporción medida, y el número se declara aquí', () => {
    const formas = todasLasFormas();
    const breves = formas.filter((f) => acentoLatino(f).acento === 'antepenultima').length;
    // LA CIFRA SE MUEVE CADA VEZ QUE CRECE LA MÁQUINA: 36,3 % (con `ui`
    // mal), 36,9 % (sobre 1.437 formas), 34,7 % (sobre 2.194), y sigue
    // bajando según entran lemas. Ninguna medía mal el acento: cambiaba el
    // denominador.
    //
    // Lo que este test fija es la FORMA del hecho, que es lo que sostiene
    // la decisión: el motor se equivoca en una fracción GRANDE pero
    // claramente menor que la mitad. Una banda estrecha alrededor de la
    // cifra del día convertiría el test en un recordatorio de actualizar el
    // test.
    expect(formas.length).toBeGreaterThanOrEqual(2100);
    expect(breves / formas.length).toBeGreaterThan(0.25);
    expect(breves / formas.length).toBeLessThan(0.45);
  });
});
