// tests/unit/lote-morfologia-subj-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_MORFOLOGIA_SUBJ } from '@/lib/data/languages/la/lotes/l7-morfologia-subj';
import {
  coberturaSubj, revisarItemSubj, revisarLoteSubj, siempreConA, tasasCiegasSubj, type ItemSubj,
} from '@/scripts/lib/gate-morfologia-subj';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { subjuntivo, homonimoDelIndicativo } from '@/lib/data/languages/la/subjuntivo';
import porAnalisis from '@/lib/data/languages/la/atestacion-por-analisis.json';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_MORFOLOGIA_SUBJ.find((i) => i.respuesta === 'amēs')!;
const con = (p: Partial<ItemSubj>): ItemSubj => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemSubj) => revisarItemSubj(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteSubj(LOTE_MORFOLOGIA_SUBJ).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y cubre los cuatro tiempos y las cinco conjugaciones', () => {
    expect(coberturaSubj(LOTE_MORFOLOGIA_SUBJ).find((c) => c.comprobacion.includes('cuatro tiempos'))!.decididos).toBe(4);
    expect(coberturaSubj(LOTE_MORFOLOGIA_SUBJ).find((c) => c.comprobacion === 'las conjugaciones')!.decididos).toBe(5);
  });
});

describe('LA INVERSIÓN, que es lo caro del punto', () => {
  it('la 1.ª va en -e- y las otras en -a-, al revés que el indicativo', () => {
    expect(subjuntivo(V('amō'), 'presente', '1sg')).toBe('amem');
    expect(subjuntivo(V('moneō'), 'presente', '1sg')).toBe('moneam');
    expect(subjuntivo(V('dūcō'), 'presente', '1sg')).toBe('dūcam');
  });

  it('«poner -a- a todo» produce *amam, que es la forma que el alumno espera', () => {
    expect(siempreConA(V('amō'), 'presente', '1sg')).toBe('amam');
    expect(siempreConA(V('vocō'), 'presente', '1sg')).toBe('vocam');
    // y en las demás conjugaciones ESA estrategia es la correcta, que es
    // justo lo que la hace peligrosa
    expect(siempreConA(V('moneō'), 'presente', '1sg')).toBe('moneam');
  });

  it('y los dos van atestiguados COMO SUBJUNTIVO, no como cadena', () => {
    // El defecto que tuvo este lote: los dos ítems que llevaban el punto
    // eran `vocem` y `laudem`, elegidos por tener la cuenta de cadena más
    // alta — y la tenían alta por ser sustantivos corrientes.
    const T = (porAnalisis as { tabla: Record<string, Record<string, number>> }).tabla;
    for (const i of LOTE_MORFOLOGIA_SUBJ.filter((x) => x.tiempo === 'presente' && x.ejes.conjugacion === 1)) {
      expect(T[i.respuesta]?.sub ?? 0, `${i.respuesta} como subjuntivo`).toBeGreaterThan(0);
      expect(T[i.respuesta]?.nominal ?? 0, `${i.respuesta} como nombre`).toBe(0);
    }
  });

  it('el lote trae DOS presentes de 1.ª, no uno', () => {
    // Con uno solo el lote mediría un lema, que es el defecto de la 4.ª y
    // la 5.ª declinación.
    const primeras = LOTE_MORFOLOGIA_SUBJ.filter((i) => i.tiempo === 'presente' && i.ejes.conjugacion === 1);
    expect(primeras.length).toBeGreaterThanOrEqual(2);
  });

  it('y la tasa ciega se lee sobre los PRESENTES, no sobre el lote', () => {
    // Fuera del presente no hay vocal temática que elegir: contar ahí
    // inflaría la tasa sin que nada se decidiera.
    const t = tasasCiegasSubj(LOTE_MORFOLOGIA_SUBJ);
    expect(t.siempreConA.decididos).toBe(6);
    expect(t.siempreConA.total).toBe(16);
  });
});

describe('el imperfecto sobre el infinitivo, en las cuatro', () => {
  it('es el infinitivo entero más la desinencia', () => {
    const imp = LOTE_MORFOLOGIA_SUBJ.filter((i) => i.tiempo === 'imperfecto');
    expect(imp).toHaveLength(4);
    for (const i of imp) expect(i.respuesta.startsWith(i.verbo.infinitivo), `${i.id}: ${i.respuesta} / ${i.verbo.infinitivo}`).toBe(true);
    expect(new Set(imp.map((i) => i.ejes.conjugacion)).size).toBe(4);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'vocam' }))).toContain('respuesta-no-derivable');
  });
  it('la conjugación mal declarada', () => {
    expect(clases(con({ ejes: { conjugacion: 3 } }))).toContain('eje-mal-declarado');
  });
  it('el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: 'Ut nūntium ___.' }))).toContain('marco-fuera-de-l1');
  });
  it('una forma que NUNCA aparece como subjuntivo, aunque la cadena salga 15 veces', () => {
    // `laudem` estuvo en este lote. La cadena sale 15 veces y las 15 son el
    // acusativo de `laus`: contando por cadena, el gate lo aprobaba.
    expect(clases(con({ verbo: V('laudō'), respuesta: 'laudem', persona: '1sg', marco: 'Ut Deum ___.' })))
      .toContain('sin-atestiguar');
  });

  it('y una que el nombre homónimo tapa: `vocem` 80 veces `vōx`, 1 vez subjuntivo', () => {
    expect(clases(con({ verbo: V('vocō'), respuesta: 'vocem', persona: '1sg', marco: 'Ut puerum ___.' })))
      .toContain('homonimo-nominal');
  });

  it('pero NO el homónimo del propio futuro, que es la materia del punto', () => {
    // `dīcam` sale 28 veces: 14 subjuntivo y 14 futuro de indicativo, mismo
    // lema. Ese cruce lo declara el punto y lo nombra homonimoDelIndicativo().
    const d = LOTE_MORFOLOGIA_SUBJ.find((i) => i.respuesta === 'dīcam')!;
    expect(clases(d)).toEqual([]);
    expect(homonimoDelIndicativo(d.verbo, d.tiempo, d.persona)).toBe('futuro.1sg');
  });
});

describe('los venenos de LOTE', () => {
  it('sin presentes de 1.ª no se examina la inversión', () => {
    const lote = LOTE_MORFOLOGIA_SUBJ.filter((i) => !(i.tiempo === 'presente' && i.ejes.conjugacion === 1));
    expect(revisarLoteSubj(lote).map((f) => f.detalle).join(' ')).toContain('*amam');
  });
  it('y un lote de un solo tiempo no cubre el varia', () => {
    const lote = LOTE_MORFOLOGIA_SUBJ.filter((i) => i.tiempo === 'presente');
    expect(revisarLoteSubj(lote).map((f) => f.detalle).join(' ')).toContain('tiempo(s)');
  });
});
