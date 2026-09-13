// tests/unit/lote-tres-participios-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_TRES_PARTICIPIOS } from '@/lib/data/languages/la/lotes/l8-tres-participios';
import {
  atestiguadoComo, coberturaTresPart, desdeElInfinitivo, participioDeLaMaquina,
  revisarItemTresPart, revisarLoteTresPart, tasasCiegasTresPart, type ItemTresPart,
} from '@/scripts/lib/gate-tres-participios';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_TRES_PARTICIPIOS.find((i) => i.id === 'la-tp-01')!;
const con = (p: Partial<ItemTresPart>): ItemTresPart => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemTresPart) => revisarItemTresPart(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteTresPart(LOTE_TRES_PARTICIPIOS).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y las quince formas están atestiguadas COMO ese participio', () => {
    for (const i of LOTE_TRES_PARTICIPIOS)
      expect(atestiguadoComo(i.respuesta, i.cual), `${i.respuesta} como ${i.cual}`).toBeGreaterThan(0);
  });
});

describe('los tres participios son tres formas distintas', () => {
  it('presente del infinitivo, perfecto y futuro del supino', () => {
    expect(participioDeLaMaquina(V('amō'), 'presente')).toBe('amāns');
    expect(participioDeLaMaquina(V('amō'), 'perfecto')).toBe('amātus');
    expect(participioDeLaMaquina(V('amō'), 'futuro')).toBe('amātūrus');
  });
  it('y `sum` sólo tiene el de futuro', () => {
    expect(participioDeLaMaquina(V('sum'), 'futuro')).toBe('futūrus');
    expect(participioDeLaMaquina(V('sum'), 'perfecto')).toBeNull();
  });
});

describe('la ciega que acierta en la 1.ª conjugación y por eso engaña', () => {
  it('«quitarle -re al infinitivo y pegarle -tus» da la forma BUENA en la 1.ª', () => {
    expect(desdeElInfinitivo(V('vocō'), 'perfecto')).toBe('vocātus');
    expect(participioDeLaMaquina(V('vocō'), 'perfecto')).toBe('vocātus');
  });
  it('y falla en todas las demás', () => {
    for (const l of ['faciō', 'videō', 'mittō', 'dīcō'])
      expect(desdeElInfinitivo(V(l), 'perfecto'), l).not.toBe(participioDeLaMaquina(V(l), 'perfecto'));
  });
  it('el lote la deja por debajo de su listón, con su denominador', () => {
    const t = tasasCiegasTresPart(LOTE_TRES_PARTICIPIOS);
    expect(t.desdeElInfinitivo.decididos).toBe(LOTE_TRES_PARTICIPIOS.filter((i) => i.cual !== 'presente').length);
    expect(t.desdeElInfinitivo.tasa).toBeLessThanOrEqual(0.4);
  });
  it('y «siempre el mismo» se mide sobre el lote entero, no sobre un resto', () => {
    const t = tasasCiegasTresPart(LOTE_TRES_PARTICIPIOS);
    expect(t.siempreElMismo.decididos).toBe(LOTE_TRES_PARTICIPIOS.length);
    expect(t.siempreElMismo.tasa).toBeLessThanOrEqual(0.45);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'dictus' }))).toContain('respuesta-no-derivable');
  });
  it('el participio mal declarado en el eje', () => {
    expect(clases(con({ ejes: { ...base.ejes, cual: 'perfecto' } }))).toContain('eje-mal-declarado');
  });
  it('la forma que no aparece como ESE participio', () => {
    // `amāns` existe como palabra pero el corpus no la trae: el lote usa
    // `dīcēns` ×202, no el ejemplo de manual.
    expect(clases(con({ verbo: V('amō'), respuesta: 'amāns' }))).toContain('sin-atestiguar');
  });
  it('el marco sin hueco', () => {
    expect(clases(con({ marco: 'Puer verbum dīcit.' }))).toContain('marco-sin-hueco');
  });
  it('el marco que regala la forma', () => {
    expect(clases(con({ marco: 'Puer dīcēns verbum ___ ambulat.' }))).toContain('marco-regala-la-forma');
  });
  it('y el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: 'Mīles verbum ___ ambulat.' }))).toContain('marco-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('glosar los tres con una relativa es exactamente lo que el varia prohíbe', () => {
    const lote = LOTE_TRES_PARTICIPIOS.map((i) => ({ ...i, ejes: { ...i.ejes, giro: 'relativa' as const } }));
    const d = revisarLoteTresPart(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('el varia prohíbe exactamente eso');
  });
  it('un lote de un solo participio no cubre el varia', () => {
    const lote = LOTE_TRES_PARTICIPIOS.filter((i) => i.cual === 'perfecto');
    const d = revisarLoteTresPart(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('el varia son los tres participios');
    expect(d).toContain('contestar siempre el mismo participio');
  });
  it('y un lote de solo 1.ª conjugación regala la forma con la regla mala', () => {
    const lote = [
      ...LOTE_TRES_PARTICIPIOS.filter((i) => i.cual === 'presente'),
      con({ id: 'x1', verbo: V('vocō'), cual: 'perfecto', respuesta: 'vocātus', ejes: { cual: 'perfecto', giro: 'participio' } }),
      con({ id: 'x2', verbo: V('laudō'), cual: 'perfecto', respuesta: 'laudātus', ejes: { cual: 'perfecto', giro: 'participio' },
            porQueSinAtestiguar: 'veneno de prueba: aquí lo que se mira es la tasa ciega, no la atestación' }),
    ];
    expect(revisarLoteTresPart(lote).map((f) => f.detalle).join(' ')).toContain('sacarlo del infinitivo');
  });
});

describe('la excepción que el material no puede examinar', () => {
  it('L1 no tiene ni un deponente, y la cobertura lo dice en vez de callarse', () => {
    expect(VERBOS_L1.filter((v) => /or$/.test(v.lema))).toHaveLength(0);
    const c = coberturaTresPart(LOTE_TRES_PARTICIPIOS).find((x) => x.comprobacion.includes('DEPONENTE'))!;
    expect(c.decididos).toBe(0);
    expect(c.elCeroEsUnResultado ?? '').toContain('cero son deponentes');
  });
});
