// tests/unit/lote-completivas-ut-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_COMPLETIVAS_UT } from '@/lib/data/languages/la/lotes/l7-completivas-ut';
import {
  SUELO_DE_EVIDENCIA, coberturaCompletiva, completivaDeLaMaquina, cuentasDe,
  regenteConjugado, regimenDe, revisarItemCompletiva, revisarLoteCompletiva,
  siemprePresente, siempreCompletiva, tasasCiegasCompletiva, type ItemCompletiva,
} from '@/scripts/lib/gate-completivas-ut';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_COMPLETIVAS_UT.find((i) => i.id === 'la-cu-01')!;
const con = (p: Partial<ItemCompletiva>): ItemCompletiva => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemCompletiva) => revisarItemCompletiva(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteCompletiva(LOTE_COMPLETIVAS_UT).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y el regente conjugado está en cada marco', () => {
    for (const i of LOTE_COMPLETIVAS_UT) expect(i.marco, i.id).toContain(regenteConjugado(i));
  });
});

describe('EL RÉGIMEN LO DICE EL CORPUS', () => {
  it('la excepción que el punto nombra se confirma sin margen', () => {
    expect(cuentasDe('iubeō')).toEqual({ conUt: 0, conInfinitivo: 133 });
    expect(regimenDe('iubeō')).toBe('infinitivo');
  });
  it('y `rogō` va al otro lado', () => {
    expect(regimenDe('rogō')).toBe('completiva');
    expect(cuentasDe('rogō').conUt).toBeGreaterThan(cuentasDe('rogō').conInfinitivo);
  });
  it('los mixtos no deciden, y por eso no están en el lote', () => {
    expect(regimenDe('faciō')).toBeNull();          // 34 / 27
    expect(LOTE_COMPLETIVAS_UT.map((i) => i.verboRegente.lema)).not.toContain('faciō');
  });
  it('ni los que no llegan al suelo de evidencia', () => {
    // `mittō` sale 2 veces con `ut` y 0 con infinitivo: dos apariciones en
    // la misma dirección no son una propiedad léxica.
    const m = cuentasDe('mittō');
    expect(m.conUt + m.conInfinitivo).toBeLessThan(SUELO_DE_EVIDENCIA);
    expect(regimenDe('mittō')).toBeNull();
    expect(LOTE_COMPLETIVAS_UT.map((i) => i.verboRegente.lema)).not.toContain('mittō');
  });
  it('y el gate rechaza un ítem que pida la construcción contraria', () => {
    expect(clases(con({ verboRegente: V('iubeō'), marco: 'Rēx iubet ___.' }))).toContain('regimen-no-atestiguado');
  });
  it('o una que el corpus no decide', () => {
    expect(clases(con({ verboRegente: V('faciō'), marco: 'Rēx facit ___.' }))).toContain('regimen-indeterminado');
  });
});

describe('LA CIEGA QUE ES EL ERROR DECLARADO', () => {
  it('«ut con todos» produce el *iubet ut veniat que el punto nombra', () => {
    const inf = LOTE_COMPLETIVAS_UT.find((i) => i.verboRegente.lema === 'iubeō')!;
    expect(siempreCompletiva(inf)).toMatch(/^ut /);
    expect(siempreCompletiva(inf)).not.toBe(inf.respuesta);
  });
  it('y acierta en las completivas, que es lo que la hace peligrosa', () => {
    const comp = LOTE_COMPLETIVAS_UT.find((i) => i.construccion === 'completiva')!;
    expect(siempreCompletiva(comp)).toBe(comp.respuesta);
  });
  it('el lote la deja en el azar', () => {
    expect(tasasCiegasCompletiva(LOTE_COMPLETIVAS_UT).siempreCompletiva.tasa).toBeLessThanOrEqual(0.6);
  });
});

describe('EL DENOMINADOR QUE INFLABA, que es el de §5.sexdecies por el otro lado', () => {
  it('el infinitivo no elige tiempo, así que «siempre el presente» acierta ahí por definición', () => {
    for (const i of LOTE_COMPLETIVAS_UT.filter((x) => x.construccion === 'infinitivo'))
      expect(siemprePresente(i), i.id).toBeNull();
  });
  it('y por eso su denominador son las completivas, no el lote', () => {
    const t = tasasCiegasCompletiva(LOTE_COMPLETIVAS_UT);
    expect(t.siemprePresente.decididos).toBe(LOTE_COMPLETIVAS_UT.filter((i) => i.construccion === 'completiva').length);
    expect(t.siemprePresente.decididos).toBeLessThan(t.siemprePresente.total);
    expect(t.siemprePresente.tasa).toBeLessThanOrEqual(0.6);
  });
  it('medida sobre los doce daría el 75 % sin que seis hubieran decidido nada', () => {
    const ingenua = LOTE_COMPLETIVAS_UT.filter((i) =>
      (i.construccion === 'infinitivo' ? i.verbo.infinitivo : siemprePresente(i)) === i.respuesta).length / LOTE_COMPLETIVAS_UT.length;
    expect(ingenua).toBeGreaterThan(tasasCiegasCompletiva(LOTE_COMPLETIVAS_UT).siemprePresente.tasa);
  });
});

describe('la concordancia de tiempos, la misma que en la final', () => {
  it('el imperfecto regente pide imperfecto de subjuntivo', () => {
    expect(completivaDeLaMaquina(con({ tiempoRegente: 'imperfecto', verbo: V('veniō'), persona: '3sg' }))).toBe('ut venīret');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'ut venīret' }))).toContain('respuesta-no-derivable');
  });
  it('el regente que no está en el marco', () => {
    expect(clases(con({ marco: 'Rēx monet ___.' }))).toContain('regente-no-esta-en-el-marco');
  });
  it('el marco que regala la forma', () => {
    expect(clases(con({ marco: 'Rēx rogat ut ___.' }))).toContain('marco-regala-la-forma');
  });
  it('y el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: 'Mīles rogat ___.' }))).toContain('marco-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('una sola construcción: el varia queda sin cubrir y la ciega sube', () => {
    const lote = LOTE_COMPLETIVAS_UT.filter((i) => i.construccion === 'completiva');
    const d = revisarLoteCompletiva(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('el varia es el verbo regente');
    expect(d).toContain('ése es el error que el punto declara obligatorio');
  });
  it('y la cobertura de `iubeō` explica por qué `vetō` no está', () => {
    const c = coberturaCompletiva(LOTE_COMPLETIVAS_UT).find((x) => x.comprobacion.includes('iubeō'))!;
    expect(c.decididos).toBeGreaterThan(0);
    expect(c.motivoDeLosQueQuedanFuera ?? '').toContain('vetō');
  });
});
