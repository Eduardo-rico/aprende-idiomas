// tests/unit/lote-ablativo-absoluto-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_ABLATIVO_ABSOLUTO } from '@/lib/data/languages/la/lotes/l8-ablativo-absoluto';
import {
  ablativoIngenuo, absoluto, coberturaAblAbs, participioAtestiguado,
  revisarItemAblAbs, revisarLoteAblAbs, tasasCiegasAblAbs, type ItemAblAbs,
} from '@/scripts/lib/gate-ablativo-absoluto';
import { NOMBRES_L1, VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_ABLATIVO_ABSOLUTO.find((i) => i.id === 'la-aa-01')!;
const con = (p: Partial<ItemAblAbs>): ItemAblAbs => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemAblAbs) => revisarItemAblAbs(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteAblAbs(LOTE_ABLATIVO_ABSOLUTO).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y los diez participios están atestiguados como participio de perfecto', () => {
    for (const i of LOTE_ABLATIVO_ABSOLUTO.filter((x) => x.verbo !== null))
      expect(participioAtestiguado(i), i.respuesta).toBeGreaterThan(0);
  });
});

describe('LO QUE DISTINGUE EL ABSOLUTO DEL CONCERTADO', () => {
  it('el sujeto del absoluto es propio: si vuelve a salir en la principal, es concertado', () => {
    // `Urbe captā, urbs manet` no es un absoluto: es la misma urbs.
    expect(clases(con({ marco: '___, urbs ambulat.' }))).toContain('sujeto-compartido');
  });
  it('y el lote no tiene ni uno con el sujeto compartido', () => {
    for (const i of LOTE_ABLATIVO_ABSOLUTO)
      expect(revisarItemAblAbs(i).map((f) => f.clase), i.id).not.toContain('sujeto-compartido');
  });
  it('la respuesta son DOS palabras, el nombre y su predicado', () => {
    expect(clases(con({ respuesta: 'urbe' }))).toContain('no-son-dos-palabras');
    for (const i of LOTE_ABLATIVO_ABSOLUTO) expect(i.respuesta.split(/\s+/), i.id).toHaveLength(2);
  });
});

describe('la excepción SIN participio, que es media mitad del punto', () => {
  it('el lote trae dos, uno con adjetivo y otro con nombre', () => {
    const sin = LOTE_ABLATIVO_ABSOLUTO.filter((i) => i.verbo === null);
    expect(sin).toHaveLength(2);
    expect(sin.map((i) => i.respuesta).sort()).toEqual(['exercitū integrō', 'fīliō rēge']);
  });
  it('y un lote donde todos llevan participio lo dice', () => {
    const lote = LOTE_ABLATIVO_ABSOLUTO.filter((i) => i.verbo !== null);
    expect(revisarLoteAblAbs(lote).map((f) => f.detalle).join(' ')).toContain('el que busque siempre un participio');
  });
  it('la máquina construye igual los dos casos', () => {
    expect(absoluto(LOTE_ABLATIVO_ABSOLUTO.find((i) => i.id === 'la-aa-11')!)).toBe('exercitū integrō');
    expect(absoluto(LOTE_ABLATIVO_ABSOLUTO.find((i) => i.id === 'la-aa-01')!)).toBe('urbe captā');
  });
});

describe('las dos ciegas, con sus denominadores', () => {
  it('«todo como la 1.ª» acierta en la 1.ª y falla en las demás', () => {
    const de = (lema: string, num: 'sg' | 'pl' = 'sg') => ablativoIngenuo(con({ nombre: N(lema), numero: num }));
    expect(de('via')).toBe('viā');
    expect(de('causa')).toBe('causā');
    expect(de('urbs')).toBe('urbā');
    expect(de('bellum')).toBe('bellā');
    expect(de('exercitus')).toBe('exercitā');
  });
  it('y en el PLURAL no decide: la 1.ª y la 2.ª comparten el -īs', () => {
    expect(ablativoIngenuo(con({ numero: 'pl' }))).toBeNull();
    const t = tasasCiegasAblAbs(LOTE_ABLATIVO_ABSOLUTO);
    expect(t.todoComoLaPrimera.decididos).toBe(LOTE_ABLATIVO_ABSOLUTO.filter((i) => i.numero === 'sg').length);
    expect(t.todoComoLaPrimera.decididos).toBeLessThan(t.todoComoLaPrimera.total);
    expect(t.todoComoLaPrimera.tasa).toBeLessThanOrEqual(0.5);
  });
  it('y el valor se mide sobre el lote entero, con el azar en un tercio', () => {
    const t = tasasCiegasAblAbs(LOTE_ABLATIVO_ABSOLUTO);
    expect(t.siempreElMismoValor.decididos).toBe(LOTE_ABLATIVO_ABSOLUTO.length);
    expect(t.siempreElMismoValor.tasa).toBeLessThanOrEqual(0.5);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la construcción que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'urbs capta' }))).toContain('respuesta-no-derivable');
  });
  it('el valor mal declarado', () => {
    expect(clases(con({ ejes: { ...base.ejes, valor: 'causal' } }))).toContain('eje-mal-declarado');
  });
  it('el participio sin atestiguar', () => {
    expect(clases(con({ nombre: N('rosa'), verbo: V('amō'), respuesta: 'rosā amātā', marco: '___, rēx ambulat.' })))
      .toContain('sin-atestiguar');
  });
  it('el marco sin hueco', () => {
    expect(clases(con({ marco: 'Rēx ambulat.' }))).toContain('marco-sin-hueco');
  });
  it('el marco que regala la construcción', () => {
    expect(clases(con({ marco: 'Urbe ___, rēx ambulat.' }))).toContain('marco-regala-la-forma');
  });
  it('y el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: '___, mīles ambulat.' }))).toContain('marco-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('un solo valor: el varia queda sin cubrir y la ciega sube al 100 %', () => {
    const lote = LOTE_ABLATIVO_ABSOLUTO.filter((i) => i.valor === 'temporal');
    const d = revisarLoteAblAbs(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('un ítem repetido ocho veces');
    expect(d).toContain('100 %');
  });
  it('y la cobertura de la excepción lleva su motivo', () => {
    const c = coberturaAblAbs(LOTE_ABLATIVO_ABSOLUTO).find((x) => x.comprobacion.includes('SIN participio'))!;
    expect(c.decididos).toBe(2);
    expect(c.motivoDeLosQueQuedanFuera ?? '').toContain('no la busque por el participio');
  });
});
