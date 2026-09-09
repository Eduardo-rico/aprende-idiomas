// tests/unit/plural-tantum-la.test.ts
//
// Los pluralia tantum. El eje del punto es si el singular SIGNIFICA OTRA
// COSA, no si es raro — y confundirlos es la forma más silenciosa de que un
// lote deje de examinar su punto.
import { describe, it, expect } from 'vitest';
import { PLURALIA_TANTUM, claseDe, loRaroQueEsElSingular } from '@/lib/data/languages/la/plural-tantum';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';

const P = (l: string) => PLURALIA_TANTUM.find((x) => x.lema === l)!;

describe('los pluralia tantum · en verde', () => {
  it('van en tabla aparte y NO en el lexicón', () => {
    // `declinar` produciría *«armum», *«tenebra» — formas que no existen.
    // Meterlos en NOMBRES_L1 sería fabricar el error que el punto enseña.
    for (const p of PLURALIA_TANTUM)
      expect(NOMBRES_L1.some((n) => n.lema === p.lema), p.lema).toBe(false);
  });

  it('los seis sin singular tienen CERO singulares contados', () => {
    for (const l of ['arma', 'tenebrae', 'īnsidiae', 'nūptiae', 'līberī', 'moenia']) {
      expect(P(l).enSingular, l).toBe(0);
      expect(P(l).singular, l).toBeNull();
      expect(claseDe(P(l)), l).toBe('sin-singular');
    }
  });

  it('los tres con singular declaran qué significa', () => {
    for (const l of ['castra', 'litterae', 'cōpiae']) {
      expect(P(l).singular, l).toBeTruthy();
      expect(P(l).glosaDelSingular, l).toBeTruthy();
      expect(claseDe(P(l)), l).toBe('singular-con-otro-sentido');
    }
  });
});

describe('el eje es el SENTIDO, no la frecuencia', () => {
  it('`litterae` y `castra` son igual de raros en singular y el punto los separa', () => {
    // 7 de 225 y 1 de 160: los dos por debajo del 5 %. Clasificar por
    // frecuencia —que es lo que hacía la primera versión— los metía en el
    // mismo saco, y el punto usa `littera` como su ejemplo de «otro
    // sentido» y `castra` como su ejemplo de «carece de él».
    expect(loRaroQueEsElSingular(P('litterae'))!).toBeLessThan(0.05);
    expect(loRaroQueEsElSingular(P('castra'))!).toBeLessThan(0.05);
    // Y aun así los dos tienen singular con otro sentido: la medición
    // MATIZA al punto sin contradecirlo.
    expect(claseDe(P('litterae'))).toBe(claseDe(P('castra')));
  });

  it('y la frecuencia se conserva aparte, como evidencia', () => {
    // Dice algo que el punto no dice: `cōpia` es corriente en singular
    // (22 %) y `castrum` es invisible (1 %). No es lo mismo.
    expect(loRaroQueEsElSingular(P('cōpiae'))!).toBeGreaterThan(0.2);
    expect(loRaroQueEsElSingular(P('castra'))!).toBeLessThan(0.02);
    expect(loRaroQueEsElSingular(P('arma'))).toBeNull();
  });

  it('la clase se calcula del dato y no se declara', () => {
    // Es lo que impide meter `arma` como «tiene singular raro» sin contarlo.
    for (const p of PLURALIA_TANTUM)
      expect(claseDe(p), p.lema).toBe(p.singular === null ? 'sin-singular' : 'singular-con-otro-sentido');
  });
});

describe('las cuentas salieron del corpus', () => {
  it('y son las que el punto necesita para no ser una lista de cuatro palabras', () => {
    const total = PLURALIA_TANTUM.reduce((a, p) => a + p.tokens, 0);
    expect(total).toBeGreaterThan(600);
    expect(PLURALIA_TANTUM.length).toBeGreaterThanOrEqual(9);
    // El punto nombra cuatro; hay nueve medidos, y seis de ellos sin
    // singular ninguno frente a los dos que el punto cita.
    expect(PLURALIA_TANTUM.filter((p) => p.singular === null)).toHaveLength(6);
  });
});

describe('el lote de los pluralia tantum', () => {
  it('trae los dos sentidos: nueve singulares y tres plurales', async () => {
    const { LOTE_PLURAL_TANTUM } = await import('@/lib/data/languages/la/lotes/l2-plural-tantum');
    // Sin los de sentido plural, el alumno aprendería «plural en latín =
    // singular en español», que es falso en un tercio de los casos.
    expect(LOTE_PLURAL_TANTUM.filter((it) => it.ejes.sentidoSingular)).toHaveLength(9);
    expect(LOTE_PLURAL_TANTUM.filter((it) => !it.ejes.sentidoSingular)).toHaveLength(3);
  });

  it('el sentido se LEE de la respuesta y no se declara', async () => {
    const { LOTE_PLURAL_TANTUM } = await import('@/lib/data/languages/la/lotes/l2-plural-tantum');
    for (const it of LOTE_PLURAL_TANTUM)
      expect(it.ejes.sentidoSingular, it.id).toBe(/^(el|la|un|una) /.test(it.respuesta));
  });

  it('ningún ítem dice usar un singular que su lema no tiene', async () => {
    const { incoherentes, USAN_EL_SINGULAR } = await import('@/lib/data/languages/la/lotes/l2-plural-tantum');
    expect(incoherentes()).toHaveLength(0);
    expect(USAN_EL_SINGULAR).toHaveLength(3);
  });

  it('POR QUÉ `usaElSingular` va declarado y no derivado', async () => {
    const { LOTE_PLURAL_TANTUM } = await import('@/lib/data/languages/la/lotes/l2-plural-tantum');
    // `litteram` es el acusativo del singular y `litterās` el del plural.
    // Comparar subcadenas fallaba por los dos lados a la vez: «litterās»
    // CONTIENE «littera», y «Copia» no casaba con «cōpia» por el macrón y la
    // mayúscula. Sin paradigma para estas palabras —que precisamente no lo
    // tienen— no hay forma de separarlos.
    const plural = LOTE_PLURAL_TANTUM.find((it) => it.marco.includes('litteras'))!;
    const singular = LOTE_PLURAL_TANTUM.find((it) => it.marco.includes('litteram'))!;
    expect(plural.marco.includes('littera')).toBe(true);      // la trampa
    expect(plural.ejes.usaElSingular).toBe(false);            // y la verdad
    expect(singular.ejes.usaElSingular).toBe(true);
  });
});
