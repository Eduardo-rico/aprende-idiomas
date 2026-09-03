// tests/unit/fuga-sesion.test.ts
// La fuga ENTRE tarjetas y el reordenador que la desactiva.
// Ver docs/plans/2026-09-03-fuga-entre-tarjetas.md.
import { describe, it, expect } from 'vitest';
import { construirMapaDeFuga, textoVisible, respuestasDe, contieneForma } from '@/lib/srs/fuga-sesion';
import { interleave, interleaveDetallado } from '@/lib/srs/interleave';
import type { Card } from '@/lib/db/schema';

const hueco = (id: string, sentence: string, resp: string, concepto = 'p1') => ({
  id, type: 'fill_blank', concepts: [concepto],
  data: { sentence, blanks: [{ answer: resp }] },
});

describe('detección de la fuga entre tarjetas', () => {
  it('caza el caso real: la respuesta de un ítem impresa en la frase de otro', () => {
    const items = [
      hueco('A', 'Aceasta este cartea mea.', 'este', 'p-verbo'),   // imprime «aceasta»
      hueco('B', '___ carte e nouă.', 'aceasta', 'p-demostrativo'), // y «aceasta» es SU respuesta
    ];
    const mapa = construirMapaDeFuga(items);
    expect(mapa.get('A'), 'B debe examinarse antes que A').toEqual(['B']);
    expect(mapa.get('B')).toBeUndefined();
  });

  it('NO marca la forma frecuente: el poder de pista es inverso a la frecuencia', () => {
    // «o» impresa en cinco tarjetas no señala nada; con tope 3 no cuenta.
    const items = [
      hueco('X', '___ carte', 'o', 'p-articulo'),
      ...['B', 'C', 'D', 'E', 'F'].map((id) => hueco(id, `Am o masă ${id}.`, 'masă', 'p-otro')),
    ];
    expect(construirMapaDeFuga(items, { maxApariciones: 3 }).size).toBe(0);
  });

  it('exige palabra entera: «un» no casa dentro de «unde»', () => {
    expect(contieneForma('un', 'unde este')).toBe(false);
    expect(contieneForma('un', 'am un câine')).toBe(true);
  });

  it('el texto visible incluye lo que se ve AL REVELAR, no sólo el enunciado', () => {
    const vis = textoVisible({ id: 'e', data: { sentence: 'Greșit.', correct: 'Corect ACEASTA.' } });
    expect(vis).toContain('aceasta');
  });

  it('sólo formas de una palabra: una frase entera no se copia sin darse cuenta', () => {
    expect(respuestasDe({ id: 'x', data: { blanks: [{ answer: 'două cuvinte' }, { answer: 'unul' }] } }))
      .toEqual(['unul']);
  });

  it('con soloEntrePuntos, lo que se repite DENTRO de un punto no es fuga', () => {
    const items = [hueco('A', 'Trenul pleacă.', 'gara'), hueco('B', '___ pleacă.', 'trenul')];
    expect(construirMapaDeFuga(items, { soloEntrePuntos: true }).size).toBe(0);
    expect(construirMapaDeFuga(items, { soloEntrePuntos: false }).get('A')).toEqual(['B']);
  });
});

const card = (id: string): Card => ({
  id, blockId: 1, lessonId: 'l', contentHash: '', fsrs: {} as Card['fsrs'],
  nextReviewAt: new Date(0), state: 1, reps: 0, lapses: 0, introducedAt: new Date(0),
} as Card);

describe('el reordenador de la sesión', () => {
  const conceptOf = (id: string) => (id === 'A' ? 'c1' : 'c2');
  const typeOf = () => 't';

  it('EN ROJO: sin la restricción, la tarjeta que imprime la respuesta va PRIMERO', () => {
    const orden = interleave([card('A'), card('B')], conceptOf, typeOf);
    expect(orden.map((c) => c.id), 'éste es el defecto que el reordenador arregla').toEqual(['A', 'B']);
  });

  it('EN VERDE: con la restricción, la examinada va antes que la que la imprime', () => {
    const orden = interleave([card('A'), card('B')], conceptOf, typeOf, (id) => (id === 'A' ? ['B'] : []));
    expect(orden.map((c) => c.id)).toEqual(['B', 'A']);
  });

  it('no pierde ni duplica ninguna tarjeta', () => {
    const cards = ['A', 'B', 'C', 'D'].map(card);
    const orden = interleave(cards, conceptOf, typeOf, (id) => (id === 'A' ? ['B', 'C'] : []));
    expect([...orden.map((c) => c.id)].sort()).toEqual(['A', 'B', 'C', 'D']);
  });

  it('un CICLO no cuelga la sesión, y se cuenta en vez de silenciarse', () => {
    const r = interleaveDetallado([card('A'), card('B')], conceptOf, typeOf,
      (id) => (id === 'A' ? ['B'] : ['A'])); // A tras B y B tras A
    expect(r.orden).toHaveLength(2);
    expect(r.ciclosRotos, 'un ciclo silencioso convertiría la garantía en creencia').toBe(1);
  });

  it('una restricción que se apunta a sí misma no bloquea nada', () => {
    const r = interleaveDetallado([card('A')], conceptOf, typeOf, () => ['A']);
    expect(r.orden.map((c) => c.id)).toEqual(['A']);
    expect(r.ciclosRotos).toBe(0);
  });
});
