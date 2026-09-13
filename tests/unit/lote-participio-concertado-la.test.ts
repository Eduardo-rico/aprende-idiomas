// tests/unit/lote-participio-concertado-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_PARTICIPIO_CONCERTADO } from '@/lib/data/languages/la/lotes/l8-participio-concertado';
import {
  CASO_DEL_DESTINO, atestiguadoComo, coberturaConcertado, comoSiFueraElSujeto, concertar,
  elGeneroSeDistingue, revisarItemConcertado, revisarLoteConcertado, tasasCiegasConcertado,
  type ItemConcertado,
} from '@/scripts/lib/gate-participio-concertado';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_PARTICIPIO_CONCERTADO.find((i) => i.id === 'la-pc-05')!;
const con = (p: Partial<ItemConcertado>): ItemConcertado => ({
  ...base, ...p,
  elemento: { ...base.elemento, ...(p.elemento ?? {}) },
  ejes: { ...base.ejes, ...(p.ejes ?? {}) },
});
const clases = (i: ItemConcertado) => revisarItemConcertado(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteConcertado(LOTE_PARTICIPIO_CONCERTADO).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y las doce formas están atestiguadas COMO ese participio', () => {
    for (const i of LOTE_PARTICIPIO_CONCERTADO)
      expect(atestiguadoComo(i.respuesta, i.cual), `${i.respuesta} como ${i.cual}`).toBeGreaterThan(0);
  });
});

describe('EL SINCRETISMO, que es lo que rompió la primera versión', () => {
  it('el neutro escribe igual el nominativo y el acusativo', () => {
    expect(concertar(V('dīcō'), 'perfecto', 'n', 'nom', 'sg')).toBe('dictum');
    expect(concertar(V('dīcō'), 'perfecto', 'n', 'ac', 'sg')).toBe('dictum');
  });
  it('y el plural de la 3.ª también', () => {
    expect(concertar(V('veniō'), 'presente', 'm', 'nom', 'pl')).toBe('venientēs');
    expect(concertar(V('veniō'), 'presente', 'm', 'ac', 'pl')).toBe('venientēs');
  });
  it('así que NINGÚN ítem de objeto o ablativo puede caer en una casilla así', () => {
    // Con seis de ellas —que es como estuvo escrito— «poner el nominativo»
    // sacaba el 75 % de un lote cuyo punto es precisamente no ponerlo.
    for (const i of LOTE_PARTICIPIO_CONCERTADO.filter((x) => x.concuerdaCon !== 'sujeto')) {
      const nom = concertar(i.verbo, i.cual, i.elemento.genero, 'nom', i.elemento.numero);
      expect(nom, `${i.id}: ${i.respuesta}`).not.toBe(i.respuesta);
    }
  });
  it('y el ablativo femenino de la 1.ª tampoco, que sólo se separa por el macrón', () => {
    expect(concertar(V('faciō'), 'perfecto', 'f', 'nom', 'sg')).toBe('facta');
    expect(concertar(V('faciō'), 'perfecto', 'f', 'abl', 'sg')).toBe('factā');
    expect(LOTE_PARTICIPIO_CONCERTADO.filter((i) => i.concuerdaCon === 'ablativo' && i.elemento.genero === 'f' && i.elemento.numero === 'sg')).toHaveLength(0);
  });
});

describe('la ciega y su listón', () => {
  it('«concordar siempre con el sujeto» se mide sobre el lote entero', () => {
    const t = tasasCiegasConcertado(LOTE_PARTICIPIO_CONCERTADO);
    expect(t.comoSiFueraElSujeto.decididos).toBe(LOTE_PARTICIPIO_CONCERTADO.length);
    expect(t.comoSiFueraElSujeto.tasa).toBeLessThanOrEqual(0.5);
  });
  it('y acierta exactamente en los ítems de sujeto, ni uno más', () => {
    const aciertos = LOTE_PARTICIPIO_CONCERTADO.filter((i) => comoSiFueraElSujeto(i) === i.respuesta);
    expect(aciertos.map((i) => i.concuerdaCon)).toEqual(aciertos.map(() => 'sujeto'));
  });
});

describe('el género que no se puede examinar', () => {
  it('el participio de presente es de una terminación', () => {
    expect(concertar(V('dīcō'), 'presente', 'm', 'ac', 'sg')).toBe('dīcentem');
    expect(concertar(V('dīcō'), 'presente', 'f', 'ac', 'sg')).toBe('dīcentem');
    expect(elGeneroSeDistingue(LOTE_PARTICIPIO_CONCERTADO.find((i) => i.id === 'la-pc-05')!)).toBe(false);
  });
  it('y el de perfecto sí', () => {
    expect(elGeneroSeDistingue(LOTE_PARTICIPIO_CONCERTADO.find((i) => i.id === 'la-pc-06')!)).toBe(true);
  });
  it('la cobertura lo dice con su motivo, no lo cuenta como examinado', () => {
    const c = coberturaConcertado(LOTE_PARTICIPIO_CONCERTADO).find((x) => x.comprobacion.includes('DISTINGUIR'))!;
    expect(c.decididos).toBeLessThan(c.total);
    expect(c.motivoDeLosQueQuedanFuera ?? '').toContain('una terminación');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'dīcēns' }))).toContain('respuesta-no-derivable');
  });
  it('el destino mal declarado en el eje', () => {
    expect(clases(con({ ejes: { ...base.ejes, concuerdaCon: 'ablativo' } }))).toContain('eje-mal-declarado');
  });
  it('el elemento que no está en el marco', () => {
    expect(clases(con({ elemento: { ...base.elemento, forma: 'rēgīnam' } }))).toContain('elemento-no-esta-en-el-marco');
  });
  it('la forma sin atestiguar como ese participio', () => {
    expect(clases(con({ verbo: V('amō'), respuesta: 'amantem', elemento: { ...base.elemento, forma: 'puerum' } })))
      .toContain('sin-atestiguar');
  });
  it('el marco sin hueco', () => {
    expect(clases(con({ marco: 'Rēx puerum vocat.' }))).toContain('marco-sin-hueco');
  });
  it('el marco que regala la forma', () => {
    expect(clases(con({ marco: 'Rēx puerum dīcentem ___ vocat.' }))).toContain('marco-regala-la-forma');
  });
  it('y el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: `${palabraFueraDeL1()} puerum ___ vocat.` }))).toContain('marco-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('sólo sujetos: el varia queda sin cubrir y la ciega sube al 100 %', () => {
    const lote = LOTE_PARTICIPIO_CONCERTADO.filter((i) => i.concuerdaCon === 'sujeto');
    const d = revisarLoteConcertado(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('el varia es con qué elemento concuerda');
    expect(d).toContain('100 %');
  });
  it('y un lote que vuelve a los sincretismos la sube por encima del listón', () => {
    const lote = [
      ...LOTE_PARTICIPIO_CONCERTADO.filter((i) => i.concuerdaCon === 'sujeto'),
      con({ id: 'x1', verbo: V('dīcō'), cual: 'perfecto', concuerdaCon: 'objeto',
            elemento: { forma: 'verbum', genero: 'n', numero: 'sg' }, respuesta: 'dictum',
            marco: 'Puer verbum ___ audit.', ejes: { concuerdaCon: 'objeto', cual: 'perfecto' } }),
      con({ id: 'x2', verbo: V('veniō'), cual: 'presente', concuerdaCon: 'objeto',
            elemento: { forma: 'puerōs', genero: 'm', numero: 'pl' }, respuesta: 'venientēs',
            marco: 'Rēx puerōs ___ videt.', ejes: { concuerdaCon: 'objeto', cual: 'presente' } }),
    ];
    expect(tasasCiegasConcertado(lote).comoSiFueraElSujeto.tasa).toBeGreaterThan(0.5);
    expect(revisarLoteConcertado(lote).map((f) => f.detalle).join(' ')).toContain('concordar siempre con el sujeto');
  });
});
