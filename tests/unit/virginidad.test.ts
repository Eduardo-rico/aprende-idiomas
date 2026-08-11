// tests/unit/virginidad.test.ts
//
// Gate de virginidad — el que faltaba.
//
// La skill /lote-b2c2 manda «puntos vírgenes verificados CONTRA LOS JSON
// publicados». Se estaba cumpliendo sólo sobre los ids `b2c2-`, y el
// resultado es que DOS lotes ya publicados llevan un duplicado dentro:
//
//   b2c2-gj-l3-01 «Talvez ele vem amanhã à reunião.»  (lote 3, EN PROD)
//     ↔ b6/31da58c8 «Talvez ele está em casa agora.»
//   b2c2-gj-l4-12 «A porta foi abrida pelo vento.»    (lote 4, EN PROD)
//     ↔ b7/cc7715be «A porta está abrido desde manhã.»
//
// `check-bleed-docs` no podía verlo: es un guard de ESCRITURAS (CJK,
// cirílico), no de duplicación de contenido. Este gate mide solape
// ponderado por IDF, para que compartir «talvez» pese y compartir «de»
// no pese nada.
//
// Los cuatro primeros casos son duplicados REALES del corpus, no
// inventados: si el gate no los caza, no sirve.
import { describe, it, expect } from 'vitest';
import { indexarCorpus, buscarDuplicados, enunciadosDe } from '@/scripts/lib/virginidad';
import type { ExIndexable } from '@/scripts/lib/virginidad';

const CORPUS: ExIndexable[] = [
  {
    id: '31da58c8', type: 'error_correction', blockId: 6,
    data: { sentence: 'Talvez ele está em casa agora.', correct: 'Talvez ele esteja em casa agora.' },
  },
  {
    id: 'cc7715be', type: 'error_correction', blockId: 7,
    data: { sentence: 'A porta está abrido desde manhã.', correct: 'A porta está aberta desde manhã.' },
  },
  {
    id: '5a092cc8', type: 'error_correction', blockId: 2,
    data: { sentence: 'Todas as manhãs vou a a praia.', correct: 'Todas as manhãs vou à praia.' },
  },
  {
    id: 'e9764a9c', type: 'fill_blank', blockId: 6,
    data: { sentence: 'Se ele ___ (ter) tempo, nos encontraremos amanhã.' },
  },
  // Ruido: ítems sin relación, para que el IDF tenga con qué comparar.
  {
    id: 'ruido-1', type: 'flashcard', blockId: 9,
    data: { back: 'o frigorífico', example: 'Põe o leite no frigorífico, se faz favor.' },
  },
  {
    id: 'ruido-2', type: 'fill_blank', blockId: 5,
    data: { sentence: 'Amanhã ___ (ir) ao mercado comprar peixe fresco.' },
  },
  {
    id: 'ruido-3', type: 'error_correction', blockId: 8,
    data: { sentence: 'Ele disse-me de que vinha.', correct: 'Ele disse-me que vinha.' },
  },
];

const idx = indexarCorpus(CORPUS);

describe('enunciadosDe — de qué campos sale el texto portugués', () => {
  it('de un grammaticality_judgment saca sentence Y repair', () => {
    const e = enunciadosDe({
      id: 'x', type: 'grammaticality_judgment', blockId: 8,
      data: { sentence: 'A porta foi abrida pelo vento.', repair: 'A porta foi aberta pelo vento.', explanationEs: 'esto es español y no cuenta' },
    });
    expect(e.join(' ')).toContain('abrida');
    expect(e.join(' ')).toContain('aberta');
    // La explicación va en español: no debe entrar al índice portugués.
    expect(e.join(' ')).not.toContain('esto es español');
  });

  it('no revienta con un tipo desconocido — devuelve vacío y lo declara', () => {
    expect(enunciadosDe({ id: 'y', type: 'tipo_inventado', blockId: 1, data: { foo: 'bar' } })).toEqual([]);
  });
});

describe('duplicados YA PUBLICADOS que nadie vio (los cuatro reales)', () => {
  it('caza b2c2-gj-l3-01 contra b6/31da58c8 — el «talvez» del lote 3', () => {
    const hits = buscarDuplicados(idx, {
      id: 'b2c2-gj-l3-01', type: 'grammaticality_judgment', blockId: 8,
      data: { sentence: 'Talvez ele vem amanhã à reunião.', repair: 'Talvez ele venha amanhã à reunião.' },
    });
    expect(hits.map((h) => h.id)).toContain('31da58c8');
  });

  it('caza b2c2-gj-l4-12 contra b7/cc7715be — «A porta» + participio del lote 4', () => {
    const hits = buscarDuplicados(idx, {
      id: 'b2c2-gj-l4-12', type: 'grammaticality_judgment', blockId: 8,
      data: { sentence: 'A porta foi abrida pelo vento.', repair: 'A porta foi aberta pelo vento.' },
    });
    expect(hits.map((h) => h.id)).toContain('cc7715be');
  });

  it('caza el GJ-16 del lote 5 contra b2/5a092cc8 — la crase «à praia» del bloque 2', () => {
    const hits = buscarDuplicados(idx, {
      id: 'b2c2-gj-l5-16', type: 'grammaticality_judgment', blockId: 8,
      data: { sentence: 'Vamos a praia no sábado de manhã.', repair: 'Vamos à praia no sábado de manhã.' },
    });
    expect(hits.map((h) => h.id)).toContain('5a092cc8');
  });

  it('caza el GJ-06 del lote 5 contra b6/e9764a9c — «se + ter + tempo + amanhã»', () => {
    const hits = buscarDuplicados(idx, {
      id: 'b2c2-gj-l5-06', type: 'grammaticality_judgment', blockId: 8,
      data: { sentence: 'Se tenho tempo amanhã, passo por tua casa.', repair: 'Se tiver tempo amanhã, passo por tua casa.' },
    });
    expect(hits.map((h) => h.id)).toContain('e9764a9c');
  });
});

describe('no dispara con lo que SÍ es virgen', () => {
  it('un punto nuevo de verdad no casa con nada del corpus', () => {
    const hits = buscarDuplicados(idx, {
      id: 'virgen', type: 'grammaticality_judgment', blockId: 8,
      data: {
        sentence: 'Ontem tenho falado com o teu pai.',
        repair: 'Ontem falei com o teu pai.',
      },
    });
    expect(hits).toEqual([]);
  });

  it('compartir sólo palabras vacías no cuenta como duplicado', () => {
    const hits = buscarDuplicados(idx, {
      id: 'vacias', type: 'grammaticality_judgment', blockId: 8,
      data: { sentence: 'Ele é o que é.', repair: 'Ele é o que é.' },
    });
    expect(hits).toEqual([]);
  });

  it('un ítem nunca se caza a sí mismo', () => {
    const propio = CORPUS[0]!;
    const hits = buscarDuplicados(indexarCorpus(CORPUS), propio);
    expect(hits.map((h) => h.id)).not.toContain(propio.id);
  });
});

describe('ningún descarte silencioso', () => {
  it('el índice declara cuántos ítems entraron y cuántos quedaron sin texto', () => {
    const conMudo = indexarCorpus([...CORPUS, { id: 'mudo', type: 'lesson', blockId: 1, data: {} }]);
    expect(conMudo.total).toBe(CORPUS.length + 1);
    expect(conMudo.sinTexto).toContain('mudo');
  });
});
