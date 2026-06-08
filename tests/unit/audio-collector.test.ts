// tests/unit/audio-collector.test.ts
import { describe, it, expect } from 'vitest';
import { collectAudioJobs, textsFor } from '@/scripts/lib/audio-collector';
import type { Exercise } from '@/scripts/lib/zod-schemas';

const ex = (over: any = {}): Exercise => ({
  id: 'x', blockId: 1, lessonId: 'l',
  type: 'flashcard', difficulty: 1, concepts: [], tags: [],
  data: { front: 'q', back: 'resposta' },
  ...over,
});

describe('collectAudioJobs', () => {
  it('emits br + pt jobs for flashcard.back', () => {
    const jobs = collectAudioJobs([ex()]);
    expect(jobs).toHaveLength(2);
    expect(jobs.map(j => j.variant).sort()).toEqual(['br', 'pt']);
    expect(jobs.every(j => j.text === 'resposta')).toBe(true);
  });

  it('uses ptOverrides.back when present for pt variant', () => {
    const jobs = collectAudioJobs([ex({
      data: { front: 'ônibus', back: 'ônibus' },
      ptOverrides: { back: 'autocarro' },
    })]);
    const pt = jobs.find(j => j.variant === 'pt')!;
    expect(pt.text).toBe('autocarro');
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
    expect(jobs.find(j => j.variant === 'br')!.text).toBe('eu gosto café');
  });

  it('deduplicates identical (text, variant) jobs across exercises', () => {
    const jobs = collectAudioJobs([
      ex({ id: 'a', data: { front: 'q', back: 'mesma palavra' } }),
      ex({ id: 'b', data: { front: 'q', back: 'mesma palavra' } }),
    ]);
    expect(jobs).toHaveLength(2); // not 4
  });

  it('exports textsFor for re-use in generate-audio Map building', () => {
    expect(textsFor(ex(), 'br')).toEqual(['resposta']);
  });
});
