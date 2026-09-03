// tests/unit/gate-concordancia.test.ts — el gate, visto en rojo antes del lote.
import { describe, it, expect } from 'vitest';
import {
  revisarConcordancia, revisarLoteC, tasasCiegasC, TECHO_C, MIN_TRAMPA_GENERO,
  desinenciaDe, respuestaRimada, rimaDeVerdad, type ItemConcordancia, type Celda,
} from '../../scripts/lib/gate-concordancia';
import { concuerda, type EntradaNominal, type EntradaAdjetivo } from '../../lib/data/languages/la/paradigma-la';

const BONUS: EntradaAdjetivo = { lema: 'bonus', tema: 'bon', glosa: 'bueno' };
const MAGNUS: EntradaAdjetivo = { lema: 'magnus', tema: 'magn', glosa: 'grande' };
const N: Record<string, EntradaNominal> = {
  dominus: { lema: 'dominus', genitivo: 'dominī', genero: 'm', glosa: 'señor' },
  puella:  { lema: 'puella', genitivo: 'puellae', genero: 'f', glosa: 'niña' },
  bellum:  { lema: 'bellum', genitivo: 'bellī', genero: 'n', glosa: 'guerra' },
  nauta:   { lema: 'nauta', genitivo: 'nautae', genero: 'm', glosa: 'marinero' },
  puer:    { lema: 'puer', genitivo: 'puerī', genero: 'm', glosa: 'niño' },
};

function mk(id: string, n: string, a: EntradaAdjetivo, celda: Celda, generoEs: 'm' | 'f'): ItemConcordancia {
  const s = N[n]!; const [c, num] = celda.split('.') as ['nom', 'sg'];
  const resp = concuerda(a, s, c, num);
  const item = { id, punto: 'l4-concordancia', sustantivo: s, adjetivo: a, celda, respuesta: resp,
    generoEs, marco: 'Servus ___ videt.', pista: 'contexto',
    ejes: { rima: false, generoEnganya: generoEs !== s.genero, celda } } as ItemConcordancia;
  item.ejes.rima = rimaDeVerdad(item);
  return item;
}

describe('RIMAR es copiar la DESINENCIA, no los dos últimos caracteres', () => {
  it('`bona` y `puella` SÍ riman, aunque no compartan las dos últimas letras', () => {
    // El bug que tuve al escribir la primera prueba a mano: comparar
    // caracteres daba `bona puella` como no-rimante, y habría contado como
    // discriminante un ítem que no discrimina nada — inflando la potencia
    // del lote con ítems vacíos.
    const it_ = mk('a', 'puella', BONUS, 'nom.sg', 'f');
    expect(it_.respuesta).toBe('bona');
    expect(desinenciaDe(N.puella!, 'nom.sg')).toBe('a');
    expect(respuestaRimada(it_)).toBe('bona');
    expect(rimaDeVerdad(it_)).toBe(true);
  });

  it('`bonus` y `nauta` NO riman, y ése sí mide', () => {
    const it_ = mk('a', 'nauta', BONUS, 'nom.sg', 'm');
    expect(it_.respuesta).toBe('bonus');
    expect(respuestaRimada(it_)).toBe('bona');   // lo que responde quien rima
    expect(rimaDeVerdad(it_)).toBe(false);
  });

  it('ante un `-er` no hay desinencia que copiar y la estrategia no produce nada', () => {
    const it_ = mk('a', 'puer', BONUS, 'nom.sg', 'm');
    expect(desinenciaDe(N.puer!, 'nom.sg')).toBe('');
    expect(respuestaRimada(it_)).toBe('');
    expect(rimaDeVerdad(it_)).toBe(false);
  });
});

describe('CONTROLES DE LOTE', () => {
  it('CAZA el lote que se resuelve rimando', () => {
    const malo = [mk('1', 'dominus', BONUS, 'nom.sg', 'm'), mk('2', 'puella', BONUS, 'nom.sg', 'f'),
                  mk('3', 'bellum', BONUS, 'nom.sg', 'f'), mk('4', 'dominus', MAGNUS, 'ac.sg', 'm')];
    expect(tasasCiegasC(malo).rimar).toBe(1);
    expect(revisarLoteC(malo).map((x) => x.clase)).toContain('estrategia-ciega');
  });

  it('CAZA el lote sin la trampa del género español', () => {
    // Sin neutros no hay discrepancia posible —el español no tiene neutro—
    // y el error diana del hispanohablante no se examina.
    const malo = [mk('1', 'nauta', BONUS, 'nom.sg', 'm'), mk('2', 'puer', BONUS, 'nom.sg', 'm'),
                  mk('3', 'nauta', MAGNUS, 'ac.pl', 'm'), mk('4', 'puer', MAGNUS, 'nom.pl', 'm'),
                  mk('5', 'nauta', BONUS, 'dat.sg', 'm')];
    expect(tasasCiegasC(malo).conTrampaDeGenero).toBe(0);
    expect(revisarLoteC(malo).map((x) => x.clase)).toContain('sin-trampa-de-genero');
    expect(MIN_TRAMPA_GENERO).toBe(4);
  });

  it('CAZA el lote sin bastantes ítems que NO rimen', () => {
    const malo = [mk('1', 'bellum', BONUS, 'nom.sg', 'f'), mk('2', 'bellum', MAGNUS, 'nom.pl', 'f'),
                  mk('3', 'bellum', BONUS, 'ac.pl', 'f'), mk('4', 'bellum', MAGNUS, 'ac.sg', 'f'),
                  mk('5', 'nauta', BONUS, 'nom.sg', 'm')];
    expect(tasasCiegasC(malo).queNoRiman).toBe(1);
    expect(revisarLoteC(malo).map((x) => x.detalle).join(' ')).toContain('NO riman');
  });

  it('el techo es el azar del eje binario, como en los dos formatos anteriores', () => {
    expect(TECHO_C).toBe(0.5);
  });
});

describe('CONTROLES DE ÍTEM', () => {
  const base = mk('a', 'nauta', BONUS, 'nom.sg', 'm');

  it('CAZA la respuesta que la máquina no deriva', () => {
    // El error diana del punto, metido como respuesta: concordar por
    // terminación. `bona nauta` en vez de `bonus nauta`.
    expect(revisarConcordancia({ ...base, respuesta: 'bona' }).map((x) => x.clase)).toContain('respuesta-no-derivable');
  });

  it('CAZA la etiqueta `rima` que los datos desmienten', () => {
    expect(revisarConcordancia({ ...base, ejes: { ...base.ejes, rima: true } }).map((x) => x.clase)).toContain('eje-mal-declarado');
  });

  it('CAZA el género español mal declarado', () => {
    const malo = mk('a', 'bellum', BONUS, 'nom.sg', 'f');
    expect(malo.ejes.generoEnganya).toBe(true);
    expect(revisarConcordancia({ ...malo, ejes: { ...malo.ejes, generoEnganya: false } }).map((x) => x.clase)).toContain('eje-mal-declarado');
  });

  it('CAZA el marco que lleva otra forma del adjetivo', () => {
    expect(revisarConcordancia({ ...base, marco: 'Servus ___ bonam puellam videt.' }).map((x) => x.clase)).toContain('pista-regala-la-forma');
  });

  it('CAZA el marco sin hueco y el ítem repetido', () => {
    expect(revisarConcordancia({ ...base, marco: 'Servus videt.' }).map((x) => x.clase)).toContain('marco-mal');
    expect(revisarLoteC([base, { ...base, id: 'b' }]).map((x) => x.clase)).toContain('repetido');
  });
});
