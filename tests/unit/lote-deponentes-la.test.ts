// tests/unit/lote-deponentes-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_DEPONENTES } from '@/lib/data/languages/la/lotes/l6-deponentes';
import {
  MARCA_PASIVA, coberturaDeponente, esDeponente, leerTodoComo, revisarItemDeponente,
  revisarLoteDeponente, tasasCiegasDeponente, type ItemDeponente,
} from '@/scripts/lib/gate-deponentes';
import {
  DEPONENTES_L1, FUTURO_IRREGULAR, imperativoDelDeponente, paradigmaDeponente,
  participioDelDeponente, participioFuturoDelDeponente, subjuntivoDelDeponente,
} from '@/lib/data/languages/la/deponentes';
import atPerf from '@/lib/data/languages/la/atestacion-perfectum.json';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const base = LOTE_DEPONENTES.find((i) => i.id === 'la-dp-01')!;
const con = (p: Partial<ItemDeponente>): ItemDeponente => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemDeponente) => revisarItemDeponente(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteDeponente(LOTE_DEPONENTES).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
});

describe('UN DEPONENTE ES EL PASIVO DE UNA ACTIVA QUE NO EXISTE', () => {
  it('y por eso el paradigma sale de la máquina que ya estaba', () => {
    const sequor = DEPONENTES_L1.find((d) => d.lema === 'sequor')!;
    const p = paradigmaDeponente(sequor);
    expect(p['presente.1sg']).toBe('sequor');
    expect(p['presente.3sg']).toBe('sequitur');
    expect(p['presente.3pl']).toBe('sequuntur');
    expect(p['imperfecto.3sg']).toBe('sequēbātur');
  });
  it('su subjuntivo también', () => {
    const loquor = DEPONENTES_L1.find((d) => d.lema === 'loquor')!;
    expect(subjuntivoDelDeponente(loquor, 'presente', '3sg')).toBe('loquātur');
    expect(subjuntivoDelDeponente(loquor, 'imperfecto', '3sg')).toBe('loquerētur');
  });
  it('y su imperativo tiene forma de infinitivo pasivo', () => {
    const sequor = DEPONENTES_L1.find((d) => d.lema === 'sequor')!;
    expect(imperativoDelDeponente(sequor).sg).toBe('sequere');
  });
  it('pero DOS participios de futuro no salen del supino, y la auditoría los cazó', () => {
    // La máquina daba `*mortuūrus` y `*nātūrus`; el corpus trae `moritūrus`.
    expect(FUTURO_IRREGULAR.morior).toBe('moritūrus');
    expect(participioFuturoDelDeponente(DEPONENTES_L1.find((d) => d.lema === 'morior')!)).toBe('moritūrus');
    expect(participioFuturoDelDeponente(DEPONENTES_L1.find((d) => d.lema === 'nāscor')!)).toBe('nāscitūrus');
  });
});

describe('EL PERFECTO ES EL MISMO QUE EL DE LA PASIVA PERIFRÁSTICA', () => {
  it('`locūtus est` está en el sello que se hizo para el otro punto', () => {
    const T = (atPerf as { tabla: Record<string, { n: number }> }).tabla;
    expect(T['locutus est']?.n ?? 0).toBeGreaterThan(20);
    expect(T['mortuus est']?.n ?? 0).toBeGreaterThan(20);
  });
  it('y el participio del deponente tiene sentido ACTIVO', () => {
    // `secūtus` = «habiendo seguido», no «habiendo sido seguido». Es la
    // excepción que `l8-tres-participios` declara y no pudo examinar.
    expect(participioDelDeponente(DEPONENTES_L1.find((d) => d.lema === 'sequor')!)).toBe('secūtus');
  });
});

describe('LA MITAD DEL LOTE NO ES DEPONENTE, Y ÉSA ES LA CLAVE', () => {
  it('`sequitur` y `vocātur` son morfológicamente idénticos', () => {
    expect(MARCA_PASIVA.test('sequitur')).toBe(true);
    expect(MARCA_PASIVA.test('vocatur')).toBe(true);
    expect(esDeponente('sequor')).toBe(true);
    expect(esDeponente('vocō')).toBe(false);
  });
  it('las dos lecturas son complementarias: sus tasas suman uno', () => {
    const t = tasasCiegasDeponente(LOTE_DEPONENTES);
    expect(t.todoEnActivo.tasa + t.todoEnPasivo.tasa).toBeCloseTo(1, 10);
  });
  it('así que siete y siete es la única salida', () => {
    const t = tasasCiegasDeponente(LOTE_DEPONENTES);
    expect(t.todoEnActivo.tasa).toBeLessThanOrEqual(0.6);
    expect(t.todoEnPasivo.tasa).toBeLessThanOrEqual(0.6);
  });
  it('y un lote de sólo deponentes lo dice', () => {
    const lote = LOTE_DEPONENTES.filter((i) => i.ejes.esDeponente);
    expect(leerTodoComo(lote[0]!, 'activa')).toBe(true);
    expect(revisarLoteDeponente(lote).map((f) => f.detalle).join(' '))
      .toContain('el lote instala una regla en vez de quitarla');
  });
});

describe('el varia: `ūtor` rige ablativo', () => {
  it('y es el único de los ocho', () => {
    expect(DEPONENTES_L1.filter((d) => d.rige === 'ablativo').map((d) => d.lema)).toEqual(['ūtor']);
  });
  it('el lote lo trae, y sin él el gate protesta', () => {
    expect(LOTE_DEPONENTES.some((i) => i.ejes.esDeponente && i.rige === 'ablativo')).toBe(true);
    const lote = LOTE_DEPONENTES.filter((i) => i.rige !== 'ablativo');
    expect(revisarLoteDeponente(lote).map((f) => f.detalle).join(' ')).toContain('otra trampa dentro de la misma');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('el deponente mal declarado', () => {
    expect(clases(con({ ejes: { ...base.ejes, esDeponente: false } }))).toContain('deponente-mal-declarado');
  });
  it('la forma que no está en la frase', () => {
    expect(clases(con({ forma: 'loquitur' }))).toContain('forma-no-esta-en-la-frase');
  });
  it('—y el que de verdad vacía el punto— una forma que NO parece pasiva', () => {
    // `fīunt` estuvo en este lote: es la pasiva de `faciō` pero su
    // desinencia es activa de forma, así que no engaña a nadie.
    expect(MARCA_PASIVA.test('fiunt')).toBe(false);
    expect(clases(con({ lema: 'faciō', forma: 'fīunt', latin: 'Signa ā Deō fīunt.',
                        ejes: { esDeponente: false, rige: 'ninguno' } })))
      .toContain('forma-sin-marca-pasiva');
  });
  it('el error diana igual a la respuesta', () => {
    expect(clases(con({ elErrorDiana: base.respuesta }))).toContain('error-diana-igual-a-la-respuesta');
  });
  it('la glosa que regala la respuesta', () => {
    expect(clases(con({ glosa: 'El esclavo sigue ___ al señor.' }))).toContain('glosa-regala-la-respuesta');
  });
  it('y el latín de fuera de L1', () => {
    expect(clases(con({ latin: `${palabraFueraDeL1()} dominum sequitur.` }))).toContain('latin-fuera-de-l1');
  });
});

describe('la cobertura dice lo que no puede cubrir', () => {
  it('el ablativo es uno de siete y lleva su motivo', () => {
    const c = coberturaDeponente(LOTE_DEPONENTES).find((x) => x.comprobacion.includes('ABLATIVO'))!;
    expect(c.decididos).toBe(1);
    expect(c.motivoDeLosQueQuedanFuera ?? '').toContain('sólo `ūtor`');
  });
});
