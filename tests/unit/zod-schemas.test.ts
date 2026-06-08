// tests/unit/zod-schemas.test.ts
import { describe, it, expect } from 'vitest';
import {
  ExerciseSchema,
  FlashcardDataSchema,
  GeneratedExerciseSchema,
} from '@/scripts/lib/zod-schemas';

const baseCommon = {
  id: 'a1b2c3d4',
  blockId: 1,
  lessonId: 'b1-l1',
  difficulty: 1 as const,
  concepts: ['b1-fonema-vogais'],
  tags: [],
  contentHash: 'x'.repeat(64),
  audio: { br: { hash: 'h1', voice: 'v1' }, pt: { hash: 'h2', voice: 'v2' } },
};

describe('zod schemas', () => {
  it('valid flashcard exercise parses', () => {
    const ok = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'a', back: 'a (vogal aberta)', example: 'casa' },
    });
    expect(ok.success).toBe(true);
  });

  it('rejects exercise with unknown type', () => {
    const bad = ExerciseSchema.safeParse({
      ...baseCommon, type: 'mystery', data: {},
    });
    expect(bad.success).toBe(false);
  });

  it('flashcard data requires front and back', () => {
    const bad = FlashcardDataSchema.safeParse({ front: 'a' });
    expect(bad.success).toBe(false);
  });

  it('type/data coupling: a listening with flashcard data is REJECTED', () => {
    const bad = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'listening',
      data: { front: 'a', back: 'b' }, // wrong shape
    });
    expect(bad.success).toBe(false);
  });

  it('type/data coupling: a flashcard with listening data is REJECTED', () => {
    const bad = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { audioText: 'x', question: 'q', answer: 'a' },
    });
    expect(bad.success).toBe(false);
  });

  it('ptOverrides must match parent type (cannot mix fields from another type)', () => {
    // flashcard parent with chunk-typed ptOverrides
    const bad = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'a', back: 'b' },
      ptOverrides: { chunk: 'x', meaning: 'y', examples: [{ sentence: 's' }] },
    });
    expect(bad.success).toBe(false);
  });

  it('ptOverrides with valid flashcard fields parses', () => {
    const ok = ExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'ônibus', back: 'ônibus' },
      ptOverrides: { back: 'autocarro' },
    });
    expect(ok.success).toBe(true);
  });

  it('parses one valid instance of EACH exercise type', () => {
    const samples = [
      { type: 'fill_blank' as const, data: { sentence: 'Eu ___ café.', blanks: [{ position: 0, answer: 'tomo' }] } },
      { type: 'listening' as const, data: { audioText: 'Bom dia.', question: 'q', options: ['a', 'b'], answer: 'a' } },
      { type: 'translation_es_pt' as const, data: { source: 'Hola', target: 'Olá' } },
      { type: 'translation_pt_es' as const, data: { source: 'Olá', target: 'Hola' } },
      { type: 'verb_preposition' as const, data: { verb: 'gostar', sentence: 'Gosto ___ café.', options: ['de', 'a'], answer: 'de' } },
      { type: 'sentence_construction' as const, data: { words: ['eu', 'gosto', 'café'], answer: ['eu', 'gosto', 'café'] } },
      { type: 'chunk' as const, data: { chunk: 'tomar uma decisão', meaning: 'decidir', examples: [{ sentence: 'Vou tomar uma decisão.' }] } },
    ];
    for (const s of samples) {
      const r = ExerciseSchema.safeParse({ ...baseCommon, ...s });
      expect(r.success, `failed for type ${s.type}: ${r.success ? '' : JSON.stringify(r.error.issues[0])}`).toBe(true);
    }
  });

  it('GeneratedExerciseSchema requires audio and contentHash', () => {
    const r = GeneratedExerciseSchema.safeParse({
      ...baseCommon,
      type: 'flashcard',
      data: { front: 'a', back: 'b' },
    });
    expect(r.success).toBe(true);
  });

  it('GeneratedExerciseSchema rejects when audio is missing', () => {
    const { audio, ...withoutAudio } = baseCommon;
    void audio;
    const r = GeneratedExerciseSchema.safeParse({
      ...withoutAudio,
      type: 'flashcard',
      data: { front: 'a', back: 'b' },
    });
    expect(r.success).toBe(false);
  });
});
