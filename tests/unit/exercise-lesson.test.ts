// tests/unit/exercise-lesson.test.ts
// L1 schema tests for the new "lesson" ExerciseType variant.
// Mirrors the pattern in tests/unit/zod-schemas.test.ts but scopes to LessonData.
import { describe, it, expect } from 'vitest';
import {
  ExerciseSchema,
  LessonDataSchema,
  type ExerciseType,
} from '@/scripts/lib/zod-schemas';
import { SCHEMA_VERSION, EXERCISES_PER_LESSON } from '@/scripts/config';

const baseLesson = {
  id: 'l1b2c3d4',
  blockId: 1,
  lessonId: 'b1-regulares-ar',
  difficulty: 1 as const,
  type: 'lesson' as const,
  data: {
    kind: 'lesson' as const,
    lessonId: 'b1-regulares-ar',
    blockId: 1,
    mdxPath: 'b1/l-regulares-ar.mdx',
    exampleCount: 3,
  },
  concepts: [],
  tags: [],
};

describe('LessonDataSchema', () => {
  it('parses a valid lesson data shape', () => {
    const r = LessonDataSchema.safeParse(baseLesson.data);
    expect(r.success).toBe(true);
  });

  it('rejects a lessonId that does not match the b{N}-{slug} pattern', () => {
    const r = LessonDataSchema.safeParse({
      ...baseLesson.data,
      lessonId: 'regulares-ar', // missing bN- prefix
    });
    expect(r.success).toBe(false);
  });

  it('rejects an mdxPath without block subdirectory', () => {
    const r = LessonDataSchema.safeParse({
      ...baseLesson.data,
      mdxPath: 'regulares-ar.mdx',
    });
    expect(r.success).toBe(false);
  });

  it('rejects a kind other than "lesson"', () => {
    const r = LessonDataSchema.safeParse({
      ...baseLesson.data,
      kind: 'flashcard',
    });
    expect(r.success).toBe(false);
  });

  it('rejects a negative exampleCount', () => {
    const r = LessonDataSchema.safeParse({
      ...baseLesson.data,
      exampleCount: -1,
    });
    expect(r.success).toBe(false);
  });
});

describe('ExerciseSchema with type=lesson', () => {
  it('parses a lesson exercise end-to-end', () => {
    const r = ExerciseSchema.safeParse(baseLesson);
    expect(r.success).toBe(true);
  });

  it('rejects a lesson whose data does not match LessonData', () => {
    const r = ExerciseSchema.safeParse({
      ...baseLesson,
      data: { ...baseLesson.data, lessonId: 'wrong' },
    });
    expect(r.success).toBe(false);
  });

  it('rejects a lesson when type is wrong (data would have to be ChunkData)', () => {
    const r = ExerciseSchema.safeParse({
      ...baseLesson,
      type: 'chunk',
      data: baseLesson.data, // ChunkData, not LessonData
    });
    expect(r.success).toBe(false);
  });
});

describe('SCHEMA_VERSION + EXERCISES_PER_LESSON for lesson', () => {
  it('SCHEMA_VERSION.lesson is a positive integer', () => {
    expect(SCHEMA_VERSION.lesson).toBeGreaterThan(0);
  });

  it('EXERCISES_PER_LESSON.lesson is 1', () => {
    expect(EXERCISES_PER_LESSON.lesson).toBe(1);
  });

  it('ExerciseType union now includes "lesson"', () => {
    const t: ExerciseType = 'lesson';
    expect(t).toBe('lesson');
  });
});
