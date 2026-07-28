// tests/unit/audio-collector.test.ts
import { describe, it, expect } from 'vitest';
import { collectAudioJobs, textsFor } from '@/scripts/lib/audio-collector';
import type { Exercise } from '@/scripts/lib/zod-schemas';
import { ExerciseInputSchema } from '@/scripts/lib/zod-schemas';

// Phase 1: los tests siguen construyendo exercises con la forma canónica
// (variantOverrides). Para los tests que parten de la forma legacy
// (ptOverrides), parseamos vía ExerciseInputSchema que aplica el
// preprocessor (ptOverrides → variantOverrides["pt-br"]).
const ex = (over: any = {}): Exercise => ({
  id: 'x', blockId: 1, lessonId: 'l',
  type: 'flashcard', difficulty: 1, concepts: [], tags: [],
  data: { front: 'q', back: 'resposta' },
  ...over,
});

describe('collectAudioJobs', () => {
  it('emits pt-br + pt-pt jobs for flashcard.back', () => {
    const jobs = collectAudioJobs([ex()]);
    expect(jobs).toHaveLength(2);
    expect(jobs.map(j => j.variant).sort()).toEqual(['pt-br', 'pt-pt']);
    expect(jobs.every(j => j.text === 'resposta')).toBe(true);
  });

  it('la base es europea; el override "pt-br" da el audio brasileño', () => {
    // Tras la inversión del 2026-07-28 el colector es espejo del resolver:
    // data = PT-PT, variantOverrides['pt-br'] = brasileño. Si esto se
    // desincroniza, el alumno oye una frase y lee otra.
    const jobs = collectAudioJobs([ex({
      data: { front: 'autobús', back: 'autocarro' },
      variantOverrides: { 'pt-br': { back: 'ônibus' } },
    })]);
    expect(jobs.find(j => j.variant === 'pt-pt')!.text).toBe('autocarro');
    expect(jobs.find(j => j.variant === 'pt-br')!.text).toBe('ônibus');
  });

  it('legacy ptOverrides is promoted to variantOverrides["pt-pt"] via preprocessor (E1 fix)', () => {
    // ptOverrides held European text; now emitted under "pt-pt" (E1 fix).
    // pt-br gets base; pt-pt gets the European audio.
    const raw = {
      id: 'x', blockId: 1, lessonId: 'l',
      type: 'flashcard' as const, difficulty: 1 as const, concepts: [], tags: [],
      data: { front: 'ônibus', back: 'ônibus' },
      ptOverrides: { back: 'autocarro' },
    };
    const parsed = ExerciseInputSchema.parse(raw);
    const jobs = collectAudioJobs([parsed]);
    const ptpt = jobs.find(j => j.variant === 'pt-pt')!;
    expect(ptpt.text).toBe('autocarro');
    const ptbr = jobs.find(j => j.variant === 'pt-br')!;
    expect(ptbr.text).toBe('ônibus'); // pt-br gets base
  });

  it('emits audioText for listening exercises', () => {
    const jobs = collectAudioJobs([ex({
      type: 'listening',
      data: { audioText: 'Bom dia.', question: 'q', answer: 'a' },
    })]);
    expect(jobs).toHaveLength(2);
    expect(jobs[0]?.text).toBe('Bom dia.');
  });

  it('emits NO jobs for fill_blank and verb_preposition (not audio-eligible)', () => {
    const fb: Exercise = { id: 'x', blockId: 1, lessonId: 'l', type: 'fill_blank', difficulty: 1, concepts: [], tags: [], data: { sentence: 'x', blanks: [{ position: 0, answer: 'y' }] } };
    const vp: Exercise = { id: 'x', blockId: 1, lessonId: 'l', type: 'verb_preposition', difficulty: 1, concepts: [], tags: [], data: { verb: 'g', sentence: 's', options: ['a', 'b'], answer: 'a' } };
    expect(collectAudioJobs([fb])).toHaveLength(0);
    expect(collectAudioJobs([vp])).toHaveLength(0);
  });

  it('sentence_construction: text is answer joined by space', () => {
    const jobs = collectAudioJobs([ex({
      type: 'sentence_construction',
      data: { words: ['eu', 'gosto'], answer: ['eu', 'gosto', 'café'] },
    })]);
    expect(jobs.find(j => j.variant === 'pt-br')!.text).toBe('eu gosto café');
  });

  it('translation_es_pt: target is emitted (with preprocessor normalization)', () => {
    const raw = {
      id: 'x', blockId: 1, lessonId: 'l',
      type: 'translation_es_pt' as const, difficulty: 1 as const, concepts: [], tags: [],
      data: { source: 'Hola', target: 'Olá' },
    };
    const parsed = ExerciseInputSchema.parse(raw);
    const jobs = collectAudioJobs([parsed]);
    const ptbr = jobs.find(j => j.variant === 'pt-br')!;
    expect(ptbr.text).toBe('Olá'); // target para es→pt
  });

  it('translation_pt_es: source is emitted (with preprocessor normalization)', () => {
    const raw = {
      id: 'x', blockId: 1, lessonId: 'l',
      type: 'translation_pt_es' as const, difficulty: 1 as const, concepts: [], tags: [],
      data: { source: 'Olá', target: 'Hola' },
    };
    const parsed = ExerciseInputSchema.parse(raw);
    const jobs = collectAudioJobs([parsed]);
    const ptbr = jobs.find(j => j.variant === 'pt-br')!;
    expect(ptbr.text).toBe('Olá'); // source para pt→es (PT es el audio a generar)
  });

  it('deduplicates identical (text, variant) jobs across exercises', () => {
    const jobs = collectAudioJobs([
      ex({ id: 'a', data: { front: 'q', back: 'mesma palavra' } }),
      ex({ id: 'b', data: { front: 'q', back: 'mesma palavra' } }),
    ]);
    expect(jobs).toHaveLength(2); // not 4
  });

  it('exports textsFor for re-use in generate-audio Map building', () => {
    expect(textsFor(ex(), 'pt-br')).toEqual(['resposta']);
    expect(textsFor(ex(), 'pt-pt')).toEqual(['resposta']);
    // Shim: legacy keys
    expect(textsFor(ex(), 'br')).toEqual(['resposta']);
    expect(textsFor(ex(), 'pt')).toEqual(['resposta']);
  });
});
