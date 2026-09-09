// tests/unit/lote-genitivo-clave-la.test.ts
//
// El genitivo como clave. Lo que hay que no confundir: quitar una desinencia
// NO es lo mismo que no poder deducir el tema.
import { describe, it, expect } from 'vitest';
import { LOTE_GENITIVO_CLAVE, NECESITAN_EL_GENITIVO } from '@/lib/data/languages/la/lotes/l2-genitivo-clave';
import { revisarLoteDeclinacion, elTemaSaleDelNominativo, temaReal } from '@/scripts/lib/gate-declinacion';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { declinar, declinacionDe } from '@/lib/data/languages/la/paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

describe('el genitivo como clave · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteDeclinacion(LOTE_GENITIVO_CLAVE, { celdasExigidas: ['gen.sg'], lemasMinimos: 10 });
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('toda forma la deriva la máquina', () => {
    for (const it of LOTE_GENITIVO_CLAVE)
      expect(it.respuesta, it.id).toBe(declinar(it.entrada, it.caso, it.numero));
  });

  it('ocho de catorce necesitan el genitivo, y seis no', () => {
    expect(NECESITAN_EL_GENITIVO).toHaveLength(8);
    // Los seis que no están de contraste: sin ellos, el lote enseñaría
    // «desconfía siempre» y no «lee el genitivo».
    expect(LOTE_GENITIVO_CLAVE.length - NECESITAN_EL_GENITIVO.length).toBe(6);
  });
});

describe('quitar una desinencia no es no poder deducir', () => {
  it('`puella`→`puell-` pierde una letra Y ES PREDECIBLE', () => {
    expect(temaReal(N('puella'))).toBe('puell');
    expect(elTemaSaleDelNominativo(N('puella'))).toBe(true);
  });

  it('`rēx`→`rēg-` no lo es: la «g» no está en «rēx» por ninguna parte', () => {
    expect(temaReal(N('rēx'))).toBe('rēg');
    expect(elTemaSaleDelNominativo(N('rēx'))).toBe(false);
  });

  it('el acusativo queda fuera del cálculo del tema, y hace falta', () => {
    // En los neutros el acusativo es igual al nominativo y contaminaba el
    // prefijo común: `tempus` daba «temp» en vez de «tempor-».
    expect(temaReal(N('tempus'))).toBe('tempor');
    expect(temaReal(N('corpus'))).toBe('corpor');
    expect(temaReal(N('nōmen'))).toBe('nōmin');
  });
});

describe('los dos de 2.ª son el mejor ítem del lote', () => {
  it('`ager` y `magister` son de la declinación «fácil» y su tema no está en el nominativo', () => {
    for (const l of ['ager', 'magister']) {
      expect(declinacionDe(N(l)), l).toBe('2ª');
      expect(elTemaSaleDelNominativo(N(l)), l).toBe(false);
    }
    expect(temaReal(N('ager'))).toBe('agr');
    // Quien haya aprendido «la 2.ª es fácil» hará *«agerī» y *«agerum».
    expect(declinar(N('ager'), 'gen', 'sg')).toBe('agrī');
    expect(declinar(N('ager'), 'gen', 'pl')).toBe('agrōrum');
  });

  it('y están en el lote, que es lo que impide enseñar «desconfía de la 3.ª»', () => {
    const deSegunda = NECESITAN_EL_GENITIVO.filter((it) => declinacionDe(it.entrada) === '2ª');
    expect(deSegunda.length).toBe(2);
  });
});

describe('la proporción del lote contra la de la lengua', () => {
  it('en el lexicón el tema sale del nominativo el 77 % de las veces', () => {
    const todos = NOMBRES_L1.filter((n) => { try { declinacionDe(n); return true; } catch { return false; } });
    const salen = todos.filter(elTemaSaleDelNominativo).length;
    expect(salen / todos.length).toBeGreaterThan(0.7);
    expect(salen / todos.length).toBeLessThan(0.85);
    // Y en el lote es el 43 %: sobrerrepresentados a propósito los que no
    // salen, porque son lo único que el punto examina.
    const enLote = LOTE_GENITIVO_CLAVE.filter((it) => elTemaSaleDelNominativo(it.entrada)).length;
    expect(enLote / LOTE_GENITIVO_CLAVE.length).toBeLessThan(salen / todos.length);
  });
});
