// tests/unit/lote-ut-consecutiva-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_UT_CONSECUTIVA } from '@/lib/data/languages/la/lotes/l7-ut-consecutiva';
import { LOTE_UT_FINAL } from '@/lib/data/languages/la/lotes/l7-ut-final';
import {
  ANTICIPADORES_DEL_LOTE, LO_QUE_DICE_EL_CORPUS_CONSEC, coberturaUtConsec,
  giroQueToca, porElAnticipador, revisarItemUtConsec, revisarLoteUtConsec,
  tasasCiegasUtConsec, type ItemUtConsec,
} from '@/scripts/lib/gate-ut-consecutiva';
import { palabrasDesconocidas } from '@/scripts/lib/gate-vocabulario-del-marco';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const base = LOTE_UT_CONSECUTIVA.find((i) => i.id === 'la-uc-01')!;
const con = (p: Partial<ItemUtConsec>): ItemUtConsec => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemUtConsec) => revisarItemUtConsec(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteUtConsec(LOTE_UT_CONSECUTIVA).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
});

describe('EL MISMO `ut`, LOS DOS VALORES', () => {
  it('la consecutiva va en indicativo español y la final en subjuntivo', () => {
    expect(giroQueToca(con({ valor: 'consecutiva', negada: false })).test('que vence')).toBe(true);
    expect(giroQueToca(con({ valor: 'consecutiva', negada: false })).test('para que venza')).toBe(false);
    expect(giroQueToca(con({ valor: 'final', negada: false })).test('para que venza')).toBe(true);
  });
  it('y el lote trae los dos, casi mitad y mitad', () => {
    const t = tasasCiegasUtConsec(LOTE_UT_CONSECUTIVA);
    expect(t.siempreElMismoValor.tasa).toBeLessThanOrEqual(0.6);
  });
});

describe('EL REFLEJO DEL ANTICIPADOR se mide como RECALL y no como acierto', () => {
  it('contra una final acierta SIEMPRE, porque las finales no llevan anticipador', () => {
    for (const i of LOTE_UT_CONSECUTIVA.filter((x) => x.valor === 'final')) {
      expect(i.anticipador, i.id).toBeNull();
      expect(porElAnticipador(i), i.id).toBe('final');
    }
  });
  it('así que su denominador son las CONSECUTIVAS, que es donde puede fallar', () => {
    const t = tasasCiegasUtConsec(LOTE_UT_CONSECUTIVA);
    expect(t.reflejoDelAnticipador.decididos).toBe(LOTE_UT_CONSECUTIVA.filter((i) => i.valor === 'consecutiva').length);
    expect(t.reflejoDelAnticipador.decididos).toBeLessThan(t.reflejoDelAnticipador.total);
    expect(t.reflejoDelAnticipador.tasa).toBeLessThanOrEqual(0.6);
  });
  it('medido sobre el lote entero saldría inflado por las finales', () => {
    const sobreTodo = LOTE_UT_CONSECUTIVA.filter((i) => porElAnticipador(i) === i.valor).length / LOTE_UT_CONSECUTIVA.length;
    const t = tasasCiegasUtConsec(LOTE_UT_CONSECUTIVA);
    expect(sobreTodo).toBeGreaterThan(t.reflejoDelAnticipador.tasa);
  });
});

describe('la negativa va al revés en cada valor', () => {
  it('la consecutiva lleva `ut nōn` y la final `nē`', () => {
    const cn = LOTE_UT_CONSECUTIVA.find((i) => i.negada && i.valor === 'consecutiva')!;
    const fn = LOTE_UT_CONSECUTIVA.find((i) => i.negada && i.valor === 'final')!;
    expect(cn.latin).toContain('ut nōn');
    expect(fn.latin).toContain('nē');
    expect(fn.latin).not.toContain('ut nōn');
  });
  it('y el gate lo caza si se cruzan', () => {
    const cn = LOTE_UT_CONSECUTIVA.find((i) => i.negada && i.valor === 'consecutiva')!;
    expect(revisarItemUtConsec({ ...cn, latin: 'Puer tam parvus est nē labōret.' }).map((f) => f.clase))
      .toContain('conjuncion-mal');
  });
  it('pero el corpus dice que «siempre» es falso: hay 3 `nē` con anticipador', () => {
    const c = LO_QUE_DICE_EL_CORPUS_CONSEC;
    expect(c.utNonConAnticipador).toBeGreaterThan(c.neConAnticipador);
    expect(c.neConAnticipador).toBeGreaterThan(0);
  });
});

describe('el `\\b` de JavaScript no sirve con `nē`', () => {
  it('`\\bnē\\b` no casa NUNCA, y por eso el gate usa \\p{L} con la bandera u', () => {
    expect(/\bnē\b/i.test('Puer stat nē dominus videat.')).toBe(false);
    expect(/(?<!\p{L})(ut|nē)(?!\p{L})/iu.test('Puer stat nē dominus videat.')).toBe(true);
  });
  it('y una frase sin ninguna de las dos sí se caza', () => {
    expect(clases(con({ latin: 'Rēx tam magnus est et populus timet.' }))).toContain('latin-sin-ut');
  });
});

describe('los anticipadores entraron al léxico y por eso el punto se puede escribir', () => {
  it('los tres son L1 ahora', () => {
    for (const a of ANTICIPADORES_DEL_LOTE)
      expect(palabrasDesconocidas(`Rēx ${a} magnus est ut populus timeat.`), a).toEqual([]);
  });
  it('y los que no entraron siguen fuera, que es lo que dice la cobertura', () => {
    expect(palabrasDesconocidas('Rēx adeō magnus est ut populus timeat.')).toContain('adeō');
    const c = coberturaUtConsec(LOTE_UT_CONSECUTIVA).find((x) => x.comprobacion.includes('anticipadores distintos'))!;
    expect(c.motivoDeLosQueQuedanFuera ?? '').toContain('adeō');
  });
});

describe('este punto y `l7-ut-final` son espejos y no se contradicen', () => {
  it('la final negativa usa `nē` en los dos lotes', () => {
    const aqui = LOTE_UT_CONSECUTIVA.find((i) => i.negada && i.valor === 'final')!;
    const alla = LOTE_UT_FINAL.filter((i) => i.conjuncion === 'nē');
    expect(aqui.latin).toContain('nē');
    expect(alla.length).toBeGreaterThan(0);
    for (const i of alla) expect(i.respuesta.startsWith('nē'), i.id).toBe(true);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('el giro que no corresponde al valor', () => {
    expect(clases(con({ respuesta: 'para que tema' }))).toContain('giro-no-corresponde');
  });
  it('el anticipador declarado que no está en la frase', () => {
    expect(clases(con({ anticipador: 'sīc' }))).toContain('anticipador-no-esta');
  });
  it('y el que está sin declararse', () => {
    const sin = LOTE_UT_CONSECUTIVA.find((i) => i.valor === 'consecutiva' && i.anticipador === null)!;
    expect(revisarItemUtConsec({ ...sin, latin: `Rēx tam ${sin.latin}` }).map((f) => f.clase)).toContain('anticipador-no-esta');
  });
  it('la glosa sin hueco', () => {
    expect(clases(con({ glosa: 'El rey es tan grande que teme el pueblo.' }))).toContain('glosa-sin-hueco');
  });
  it('la glosa que regala la respuesta', () => {
    expect(clases(con({ glosa: 'El rey es tan grande que teme ___ el pueblo.' }))).toContain('glosa-regala-la-respuesta');
  });
  it('y el latín de fuera de L1', () => {
    expect(clases(con({ latin: `Rēx tam magnus est ut ${palabraFueraDeL1()} timeat.` }))).toContain('latin-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('todas las consecutivas con anticipador: el lote se resuelve por el reflejo', () => {
    const lote = LOTE_UT_CONSECUTIVA.filter((i) => i.valor === 'final' || i.anticipador !== null);
    const d = revisarLoteUtConsec(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('es justo lo que el varia prohíbe');
    expect(d).toContain('el reflejo del anticipador caza el 100 %');
  });
  it('y un solo valor deja el punto sin contraste', () => {
    const lote = LOTE_UT_CONSECUTIVA.filter((i) => i.valor === 'consecutiva');
    expect(revisarLoteUtConsec(lote).map((f) => f.detalle).join(' ')).toContain('el MISMO `ut` vale dos cosas');
  });
});
