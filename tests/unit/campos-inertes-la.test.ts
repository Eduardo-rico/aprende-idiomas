// tests/unit/campos-inertes-la.test.ts
//
// Fija lo que el barrido de campos inertes encontró, y comprueba que el
// barrido MIRA. Un instrumento que dijera «nada es inerte» pasaría este
// test si sólo se comprobara el resultado.
import { describe, it, expect } from 'vitest';
import { todosLosCampos, huellaNombre, huellaVerbo, sinGlosas, barrer } from '@/scripts/lectura/campos-inertes';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';

const campos = todosLosCampos();
const de = (tabla: string, campo: string) => campos.find((c) => c.tabla === tabla && c.campo === campo)!;
const pct = (tabla: string, campo: string) => {
  const c = de(tabla, campo);
  return c.inertes.length / c.conDato;
};

describe('EL INSTRUMENTO MIRA: se ve por los dos lados', () => {
  it('un campo del que SÍ cuelgan formas sale en cero', () => {
    // Si el barrido devolviera siempre «inerte», esto lo cazaría.
    expect(pct('VERBOS_L1', 'infinitivo')).toBe(0);
    expect(pct('VERBOS_L1', 'perfecto')).toBe(0);
    expect(pct('ADJETIVOS_L1', 'tema')).toBe(0);
  });

  it('y uno del que no cuelga ninguna sale en uno', () => {
    expect(pct('NOMBRES_L1', 'glosa')).toBe(1);
  });

  it('cambiar el infinitivo cambia la huella; cambiar la glosa, no', () => {
    const v = { lema: 'amō', infinitivo: 'amāre', perfecto: 'amāvī', supino: 'amātum', glosa: 'amar' };
    expect(huellaVerbo({ ...v, infinitivo: 'amēre' })).not.toBe(huellaVerbo(v));
    expect(huellaVerbo({ ...v, glosa: 'querer' })).toBe(huellaVerbo(v));
  });

  it('y el barrido devuelve el lema que falló, no sólo una cuenta', () => {
    const c = de('ADJETIVOS_3A', 'terminaciones');
    expect(c.inertes).toEqual(['ācer']);
  });
});

describe('EL PUNTO CIEGO QUE TUVO EL INSTRUMENTO', () => {
  it('la glosa del verbo se arrastra a la del participio, y arrastrarse no es verificarse', () => {
    // Con la salida entera en la huella, `VERBOS_L1.glosa` salía consumida
    // al 0 % de inercia. Lo único que hacía era viajar.
    expect(sinGlosas({ lema: 'amāns', glosa: 'que amar' })).toEqual({ lema: 'amāns' });
    expect(sinGlosas([{ glosa: 'x', forma: 'y' }])).toEqual([{ forma: 'y' }]);
    expect(pct('VERBOS_L1', 'glosa')).toBe(1);
  });
});

describe('LO QUE EL BARRIDO ENCONTRÓ', () => {
  it('las CUATRO glosas del lexicón son inertes del todo: 141 sin ninguna consecuencia', () => {
    const conGlosa = campos.filter((c) => c.campo === 'glosa');
    expect(conGlosa).toHaveLength(4);
    for (const c of conGlosa) expect(c.inertes.length, c.tabla).toBe(c.conDato);
    expect(conGlosa.reduce((a, c) => a + c.conDato, 0)).toBe(141);
  });

  it('y NINGÚN gate comprueba que una glosa sea verdad, sólo su forma', () => {
    // `glosa-sin-hueco`, `glosa-regala-la-respuesta`, `glosa-sin-giro`
    // miran la FORMA. Una glosa falsa pasa todos los gates del proyecto, y
    // la glosa es lo que el alumno lee. No hay tercer camino dentro del
    // repositorio: el corpus es latín y la glosa es española.
    expect(pct('NOMBRES_L1', 'glosa')).toBe(1);
    expect(pct('VERBOS_L1', 'glosa')).toBe(1);
  });

  it('el género es inerte en la mayoría de los nombres, porque la 1.ª y la 2.ª no lo distinguen', () => {
    expect(pct('NOMBRES_L1', 'genero')).toBeGreaterThan(0.7);
    expect(pct('NOMBRES_L1', 'genero')).toBeLessThan(1);   // el neutro SÍ cambia las formas
    expect(huellaNombre({ lema: 'via', genitivo: 'viae', genero: 'f', glosa: 'x' }))
      .toBe(huellaNombre({ lema: 'via', genitivo: 'viae', genero: 'm', glosa: 'x' }));
    expect(huellaNombre({ lema: 'bellum', genitivo: 'bellī', genero: 'n', glosa: 'x' }))
      .not.toBe(huellaNombre({ lema: 'bellum', genitivo: 'bellī', genero: 'm', glosa: 'x' }));
  });

  it('pero inerte NO quiere decir mal: los 83 géneros están comprobados contra el corpus', () => {
    // 82 de 83 coinciden con el rasgo `Gender=` del treebank. El único que
    // choca, `diēs` (m=283 f=370), es de los dos géneros de verdad.
    expect(NOMBRES_L1.filter((n) => n.lema === 'diēs')).toHaveLength(1);
    expect(NOMBRES_L1.length).toBe(83);
  });
});

describe('el barrido es reutilizable, no un script de una vez', () => {
  it('acepta cualquier tabla y cualquier lista de campos', () => {
    const r = barrer('prueba', [{ lema: 'x', util: 'a', inutil: 'b' }], ['util', 'inutil'],
      (e) => String((e as { util: string }).util));
    expect(r.find((c) => c.campo === 'util')!.inertes).toEqual([]);
    expect(r.find((c) => c.campo === 'inutil')!.inertes).toEqual(['x']);
  });
});
