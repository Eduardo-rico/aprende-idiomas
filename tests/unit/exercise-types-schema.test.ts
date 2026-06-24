import { describe, it, expect } from 'vitest';
import { ExerciseSchema, GeneratedExerciseSchema } from '@/lib/data/zod-schemas';

const base = { id: 'abcd1234', blockId: 2, lessonId: 'b2-l1', difficulty: 1 as const, concepts: [], tags: [] };

describe('new exercise types parse in ExerciseSchema', () => {
  it('error_correction', () => {
    const ex = { ...base, type: 'error_correction', data: { sentence: 'Eu tengo um livro.', correct: 'Eu tenho um livro.', explanationEs: "'tengo' es español; en PT es 'tenho'." } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('conjugation', () => {
    const ex = { ...base, type: 'conjugation', data: { infinitive: 'falar', person: 'eu', tense: 'presente do indicativo', answer: 'falo', hintEs: 'yo hablo' } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('matching', () => {
    const ex = { ...base, type: 'matching', data: { pairs: [{ left: 'obrigado', right: 'gracias' }, { left: 'bom dia', right: 'buenos días' }, { left: 'água', right: 'agua' }] } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('multiple_choice', () => {
    const ex = { ...base, type: 'multiple_choice', data: { question: '¿Cuál es el plural de "pão"?', options: ['pães', 'pãos', 'panes'], correctIndex: 0, explanationEs: "'-ão' → '-ães' en muchos casos." } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
  it('shadowing', () => {
    const ex = { ...base, type: 'shadowing', data: { text: 'Bom dia, tudo bem?', es: 'Buenos días, ¿todo bien?' } };
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });
});

describe('GeneratedExerciseSchema accepts text-only types WITHOUT audio (R1)', () => {
  it('error_correction needs only contentHash, not audio', () => {
    const gen = { ...base, type: 'error_correction', contentHash: 'x', data: { sentence: 'a', correct: 'b', explanationEs: 'c' } };
    expect(GeneratedExerciseSchema.safeParse(gen).success).toBe(true);
  });
});
