// tests/unit/virginidad-conceptos.test.ts
//
// El segundo eje del gate de virginidad: reuso de PUNTO, no de palabras.
//
// El eje por IDF detecta cuando dos ítems comparten vocabulario raro. No
// puede ver esto, y el revisor lo demostró con número:
//
//   «Vou a telefonar ao médico depois»  vs  b2c2-gj-01 «Vou a falar com
//   ela amanhã» — MISMO punto (calco de *ir a + infinitivo*), sólo cambia
//   el verbo. Score IDF: 0,237. Pasa con holgura.
//
// El corpus ya trae la respuesta: `concepts` está poblado en 2.030 de
// 2.151 ejercicios, con 45 conceptos. Los 121 que no lo declaran son casi
// exactamente los 112 de la Ola B2C2 — por eso el punto nunca se
// comparó. Un ítem de bloque 8 que declara `b2-artigos` está reenseñando
// el bloque 2, y eso se ve sin entender de gramática.
//
// El gate REPORTA, no mata: reenseñar un concepto anterior puede ser
// profundización legítima de C1 (el `haver` existencial de b3 refinado a
// «no pluraliza»). Lo que no puede pasar es que ocurra sin que nadie lo
// declare.
import { describe, it, expect } from 'vitest';
import { indexarCorpus, revisarConceptos } from '@/scripts/lib/virginidad';
import type { ExIndexable } from '@/scripts/lib/virginidad';

const CORPUS: ExIndexable[] = [
  { id: 'b2-a', type: 'error_correction', blockId: 2, concepts: ['b2-artigos'],
    data: { sentence: 'Todas as manhãs vou a a praia.', correct: 'Todas as manhãs vou à praia.' } },
  { id: 'b2-b', type: 'fill_blank', blockId: 2, concepts: ['b2-artigos'],
    data: { sentence: 'Vou ___ padaria comprar pão.' } },
  { id: 'b2-c', type: 'flashcard', blockId: 2, concepts: ['b2-numero'],
    data: { back: 'cidadãos', example: 'Os cidadãos têm direitos e deveres.' } },
  { id: 'b6-a', type: 'fill_blank', blockId: 6, concepts: ['b6-futuro-subj'],
    data: { sentence: 'Se ele ___ (ter) tempo, encontramo-nos amanhã.' } },
  { id: 'b8-a', type: 'error_correction', blockId: 8, concepts: ['b8-colocacao-pronominal'],
    data: { sentence: 'Ela me disse a verdade.', correct: 'Ela disse-me a verdade.' } },
];

const idx = indexarCorpus(CORPUS);

describe('reuso de PUNTO — lo que el eje por IDF no puede ver', () => {
  it('un ítem de b8 que declara un concepto de b2 queda marcado', () => {
    const h = revisarConceptos(idx, {
      id: 'gj-l5-16', type: 'grammaticality_judgment', blockId: 8, concepts: ['b2-artigos'],
      data: { sentence: 'Vamos a praia no sábado.', repair: 'Vamos à praia no sábado.' },
    });
    expect(h).toHaveLength(1);
    expect(h[0]!.concepto).toBe('b2-artigos');
    expect(h[0]!.publicados).toBe(2);
    expect(h[0]!.bloquesAnteriores).toEqual([2]);
  });

  it('caza el GJ-06 de la v1 contra la lección de futuro do conjuntivo de b6', () => {
    const h = revisarConceptos(idx, {
      id: 'gj-l5-06', type: 'grammaticality_judgment', blockId: 8, concepts: ['b6-futuro-subj'],
      data: { sentence: 'Se tenho tempo amanhã, passo por tua casa.', repair: 'Se tiver tempo amanhã, passo por tua casa.' },
    });
    expect(h.map((x) => x.concepto)).toContain('b6-futuro-subj');
  });

  it('caza el «cidadães» que el eje por IDF dejó en 0,49', () => {
    const h = revisarConceptos(idx, {
      id: 'gj-l5-04', type: 'grammaticality_judgment', blockId: 8, concepts: ['b2-numero'],
      data: { sentence: 'Os cidadães votaram em massa.', repair: 'Os cidadãos votaram em massa.' },
    });
    expect(h.map((x) => x.concepto)).toContain('b2-numero');
  });

  it('caza el caso que el IDF NO ve: mismo punto, palabras distintas', () => {
    // «Vou a telefonar ao médico» vs «Vou a falar com ela»: 0,237 por IDF.
    const corpus2 = [...CORPUS, {
      id: 'b2c2-gj-01', type: 'grammaticality_judgment', blockId: 8, concepts: ['b5-futuro-presente'],
      data: { sentence: 'Vou a falar com ela amanhã.', repair: 'Vou falar com ela amanhã.' },
    } as ExIndexable, {
      id: 'b5-x', type: 'fill_blank', blockId: 5, concepts: ['b5-futuro-presente'],
      data: { sentence: 'Amanhã eu ___ falar com o gerente.' },
    } as ExIndexable];
    const h = revisarConceptos(indexarCorpus(corpus2), {
      id: 'nuevo', type: 'grammaticality_judgment', blockId: 8, concepts: ['b5-futuro-presente'],
      data: { sentence: 'Vou a telefonar ao médico depois.', repair: 'Vou telefonar ao médico depois.' },
    });
    expect(h.map((x) => x.concepto)).toContain('b5-futuro-presente');
  });
});

describe('lo que NO debe marcar', () => {
  it('un concepto de su PROPIO bloque es donde el ítem debe vivir', () => {
    const h = revisarConceptos(idx, {
      id: 'gj-l5-11', type: 'grammaticality_judgment', blockId: 8, concepts: ['b8-colocacao-pronominal'],
      data: { sentence: 'Prometo fazer-o.', repair: 'Prometo fazê-lo.' },
    });
    expect(h).toEqual([]);
  });

  it('un concepto que nadie ha tocado no marca nada', () => {
    const h = revisarConceptos(idx, {
      id: 'virgen', type: 'grammaticality_judgment', blockId: 8, concepts: ['b11-anti-calco-lexico'],
      data: { sentence: 'Ontem tenho falado com o teu pai.', repair: 'Ontem falei com o teu pai.' },
    });
    expect(h).toEqual([]);
  });
});

describe('ningún descarte silencioso: no declarar es un hallazgo', () => {
  it('un ítem sin concepts se reporta como no comprobable', () => {
    const h = revisarConceptos(idx, {
      id: 'mudo', type: 'grammaticality_judgment', blockId: 8,
      data: { sentence: 'Qualquer coisa.', repair: 'Qualquer outra coisa.' },
    });
    expect(h).toHaveLength(1);
    expect(h[0]!.concepto).toBe('(sin declarar)');
    expect(h[0]!.publicados).toBe(0);
  });
});
