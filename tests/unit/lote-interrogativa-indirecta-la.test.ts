// tests/unit/lote-interrogativa-indirecta-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_INTERROGATIVA_INDIRECTA } from '@/lib/data/languages/la/lotes/l7-interrogativa-indirecta';
import {
  PARTICULAS, coberturaInterrogativa, interrogativoQueToca, revisarItemInterrogativa,
  revisarLoteInterrogativa, tasasCiegasInterrogativa, type ItemInterrogativa,
} from '@/scripts/lib/gate-interrogativa-indirecta';
import { todasLasFormasDeL1 } from '@/lib/data/languages/la/todas-las-formas';
import { palabrasDesconocidas } from '@/scripts/lib/gate-vocabulario-del-marco';

const sin = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase();
const SUBJ = new Set(todasLasFormasDeL1().filter((f) => f.tabla === 'SUBJUNTIVOS').map((f) => sin(f.forma)));
const esSubjuntivo = (w: string) => SUBJ.has(w);

const base = LOTE_INTERROGATIVA_INDIRECTA.find((i) => i.id === 'la-ii-01')!;
const con = (p: Partial<ItemInterrogativa>): ItemInterrogativa => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemInterrogativa) => revisarItemInterrogativa(i, esSubjuntivo).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteInterrogativa(LOTE_INTERROGATIVA_INDIRECTA, esSubjuntivo).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y las doce frases llevan un subjuntivo de verdad', () => {
    // El segundo camino es el enumerador del dominio, no una lista escrita
    // aquí: 1.272 formas de subjuntivo que produce la máquina.
    expect(SUBJ.size).toBeGreaterThan(1000);
    for (const i of LOTE_INTERROGATIVA_INDIRECTA)
      expect(sin(i.latin).replace(/[.,]/g, '').split(/\s+/).some(esSubjuntivo), i.id).toBe(true);
  });
});

describe('EL ERROR DIANA SE DECLARA PORQUE MEDIRLO SERÍA UN CERO VACÍO', () => {
  it('la respuesta va en indicativo y el error en subjuntivo, y difieren en los doce', () => {
    for (const i of LOTE_INTERROGATIVA_INDIRECTA)
      expect(sin(i.elErrorDiana), i.id).not.toBe(sin(i.respuesta));
  });
  it('y el gate caza el ítem donde coinciden, que no examinaría nada', () => {
    expect(clases(con({ elErrorDiana: base.respuesta }))).toContain('error-diana-igual-a-la-respuesta');
  });
  it('ni la glosa regala uno ni el otro', () => {
    expect(clases(con({ glosa: 'El rey pregunta si viene ___.' }))).toContain('glosa-regala-la-respuesta');
    expect(clases(con({ glosa: 'El rey pregunta si venga ___.' }))).toContain('glosa-regala-el-error');
  });
});

describe('LA PARTÍCULA, que es el varia y la única ciega viva', () => {
  it('seis partículas y cinco interrogativos: `num` y `an` piden lo mismo', () => {
    expect(PARTICULAS.num).toBe('si');
    expect(PARTICULAS.an).toBe('si');
    expect(new Set(Object.values(PARTICULAS)).size).toBe(5);
  });
  it('el lote trae las seis y la mayoría se queda en el azar', () => {
    expect(new Set(LOTE_INTERROGATIVA_INDIRECTA.map((i) => i.particula)).size).toBe(6);
    expect(tasasCiegasInterrogativa(LOTE_INTERROGATIVA_INDIRECTA).siempreElMismoInterrogativo.tasa).toBeLessThanOrEqual(0.4);
  });
  it('y el subjuntivo latino NO depende de la partícula: por eso hay que variarla', () => {
    // Las seis llevan subjuntivo. Con una sola, el alumno podría pensar que
    // es `num` lo que lo pide.
    for (const p of Object.keys(PARTICULAS)) {
      const i = LOTE_INTERROGATIVA_INDIRECTA.find((x) => x.particula === p);
      expect(i, p).toBeDefined();
      expect(sin(i!.latin).replace(/[.,]/g, '').split(/\s+/).some(esSubjuntivo), p).toBe(true);
    }
  });
});

describe('lo que falta, declarado en vez de forzado', () => {
  it('`quid` y `quis` no están en la máquina de L1', () => {
    expect(palabrasDesconocidas('Rēx rogat quid faciat.')).toContain('quid');
    expect(palabrasDesconocidas('Rēx rogat quis veniat.')).toContain('quis');
  });
  it('y la cobertura lo dice con su motivo en vez de callarse', () => {
    const c = coberturaInterrogativa(LOTE_INTERROGATIVA_INDIRECTA).find((x) => x.comprobacion.includes('quid'))!;
    expect(c.decididos).toBe(0);
    expect(c.elCeroEsUnResultado ?? '').toContain('declinan');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la partícula declarada que no está en la frase', () => {
    expect(clases(con({ particula: 'ubi' }))).toContain('particula-no-esta');
  });
  it('la glosa sin el interrogativo que pide la partícula', () => {
    expect(clases(con({ glosa: 'El rey pregunta dónde ___.' }))).toContain('glosa-sin-interrogativo');
  });
  it('la glosa sin hueco', () => {
    expect(clases(con({ glosa: 'El rey pregunta si viene.' }))).toContain('glosa-sin-hueco');
  });
  it('y —lo que de verdad vacía el punto— una frase SIN subjuntivo', () => {
    expect(clases(con({ latin: 'Rēx rogat num venit.' }))).toContain('latin-sin-subjuntivo');
  });
  it('y el latín de fuera de L1', () => {
    expect(clases(con({ latin: 'Mīles rogat num veniat.' }))).toContain('latin-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('con menos de cuatro partículas no se ve que el subjuntivo no depende de ellas', () => {
    const lote = LOTE_INTERROGATIVA_INDIRECTA.filter((i) => i.particula === 'num' || i.particula === 'an');
    const d = revisarLoteInterrogativa(lote, esSubjuntivo).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('el varia es la partícula interrogativa');
    expect(d).toContain('contestar siempre el mismo interrogativo');
  });
});
