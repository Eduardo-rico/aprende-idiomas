// tests/unit/zod-schemas-variant.test.ts
// Phase 1 (multi-idioma): tests focalizados en la generalización de
// los schemas:
//   - `translation_es_pt` y `translation_pt_es` colapsan a `translation`
//     con `sourceLang`/`targetLang` rellenados por el preprocessor.
//   - `ptOverrides` (legacy) se promueve a `variantOverrides["pt-br"]`.
//   - `AudioRefSchema` y `StorySchema.variants` aceptan claves libres
//     por VariantKey (no solo "br" y "pt").
import { describe, it, expect } from 'vitest';
import {
  ExerciseInputSchema,
  ExerciseSchema,
  StorySchema,
  StoryVocabSchema,
  normalizeExerciseInput,
} from '@/scripts/lib/zod-schemas';

const baseCommon = {
  id: 'a1b2c3d4',
  blockId: 1,
  lessonId: 'b1-l1',
  difficulty: 1 as const,
  concepts: ['b1-fonema-vogais'],
  tags: [],
  contentHash: 'x'.repeat(64),
};

describe('zod schemas — multi-language variant keys', () => {
  describe('translation type collapse', () => {
    // E2#10: el lado portugués es pt-pt, no pt-br — la base es europea
    // desde la inversión del 2026-07-28 y este test clavaba el default viejo.
    it('translation_es_pt normalizes to translation with sourceLang=es, targetLang=pt-pt', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'translation_es_pt',
        data: { source: 'Hola', target: 'Olá' },
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.type).toBe('translation');
        const d = r.data.data as { source: string; target: string; sourceLang: string; targetLang: string };
        expect(d.sourceLang).toBe('es');
        expect(d.targetLang).toBe('pt-pt');
      }
    });

    it('translation_pt_es normalizes to translation with sourceLang=pt-pt, targetLang=es', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'translation_pt_es',
        data: { source: 'Olá', target: 'Hola' },
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.type).toBe('translation');
        const d = r.data.data as { sourceLang: string; targetLang: string };
        expect(d.sourceLang).toBe('pt-pt');
        expect(d.targetLang).toBe('es');
      }
    });

    it('new translation type parses with explicit sourceLang/targetLang', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'translation',
        data: { source: 'Hola', target: 'Olá', sourceLang: 'es', targetLang: 'pt-br' },
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.type).toBe('translation');
      }
    });

    it('translation rejects data without sourceLang/targetLang (min 2 chars)', () => {
      const r = ExerciseSchema.safeParse({
        ...baseCommon,
        type: 'translation',
        data: { source: 'Hola', target: 'Olá', sourceLang: 'a', targetLang: 'pt-br' },
      });
      expect(r.success).toBe(false);
    });
  });

  describe('ptOverrides → variantOverrides promotion', () => {
    it('promueve ptOverrides a variantOverrides["pt-pt"] — siempre fue texto europeo', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'ônibus', back: 'ônibus' },
        ptOverrides: { back: 'autocarro' },
      });
      expect(r.success).toBe(true);
      if (r.success) {
        const vo = r.data.variantOverrides as Record<string, { back: string }>;
        expect(vo).toEqual({ 'pt-pt': { back: 'autocarro' } });
        expect('ptOverrides' in r.data).toBe(false);
      }
    });

    it('preserves variantOverrides when both are present (canonical wins)', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'ônibus', back: 'ônibus' },
        ptOverrides: { back: 'autocarro' },
        variantOverrides: { 'pt-pt': { back: 'autocarro-pt' } },
      });
      expect(r.success).toBe(true);
      if (r.success) {
        const vo = r.data.variantOverrides as Record<string, { back: string }>;
        expect(vo).toEqual({ 'pt-pt': { back: 'autocarro-pt' } });
      }
    });

    it('null ptOverrides is removed (not promoted)', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'ônibus', back: 'ônibus' },
        ptOverrides: null,
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.variantOverrides).toBeUndefined();
      }
    });

    it('variantOverrides: null is removed by the preprocessor', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'a', back: 'b' },
        variantOverrides: null,
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.variantOverrides).toBeUndefined();
      }
    });
  });

  describe('free-key audio (AudioRefSchema)', () => {
    it('accepts legacy { br, pt } keys', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'a', back: 'b' },
        audio: { br: { hash: 'h1', voice: 'v1' }, pt: { hash: 'h2', voice: 'v2' } },
      });
      expect(r.success).toBe(true);
    });

    it('accepts new { "pt-br", "pt-pt" } keys', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'a', back: 'b' },
        audio: { 'pt-br': { hash: 'h1', voice: 'v1' }, 'pt-pt': { hash: 'h2', voice: 'v2' } },
      });
      expect(r.success).toBe(true);
    });

    it('accepts arbitrary keys like "ru" for future languages', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'a', back: 'b' },
        audio: { ru: { hash: 'h1', voice: 'v1' } },
      });
      expect(r.success).toBe(true);
    });

    it('rejects audio entry with empty hash', () => {
      const r = ExerciseInputSchema.safeParse({
        ...baseCommon,
        type: 'flashcard',
        data: { front: 'a', back: 'b' },
        audio: { 'pt-br': { hash: '', voice: 'v1' } },
      });
      expect(r.success).toBe(false);
    });
  });

  describe('free-key story variants and vocab audioHash', () => {
    const validStory = (variants: Record<string, { text: string; audioHash: string }>, audioHash: Record<string, string>) => ({
      id: 'b1-s1-teste',
      blockId: 1,
      lessonIds: ['b1-l1'],
      title: 'Test',
      level: 1 as const,
      conceptIds: ['c1'],
      variants,
      vocab: [
        { word: 'w1', meaning: 'm1', audioHash },
        { word: 'w2', meaning: 'm2', audioHash },
        { word: 'w3', meaning: 'm3', audioHash },
      ],
    });

    it('accepts legacy { br, pt } variants and audioHash', () => {
      const r = StorySchema.safeParse(validStory(
        {
          br: { text: 'Texto em PT-BR com mais de 20 chars.', audioHash: 'h1' },
          pt: { text: 'Texto em PT-PT com mais de 20 chars.', audioHash: 'h2' },
        },
        { br: 'h1', pt: 'h2' },
      ));
      expect(r.success).toBe(true);
    });

    it('accepts new { "pt-br", "pt-pt" } variants and audioHash', () => {
      const r = StorySchema.safeParse(validStory(
        {
          'pt-br': { text: 'Texto em PT-BR com mais de 20 chars.', audioHash: 'h1' },
          'pt-pt': { text: 'Texto em PT-PT com mais de 20 chars.', audioHash: 'h2' },
        },
        { 'pt-br': 'h1', 'pt-pt': 'h2' },
      ));
      expect(r.success).toBe(true);
    });

    it('accepts arbitrary variant keys for future languages', () => {
      const r = StorySchema.safeParse(validStory(
        {
          ru: { text: 'Текст на русском языке длиной более 20 символов.', audioHash: 'h1' },
        },
        { ru: 'h1' },
      ));
      expect(r.success).toBe(true);
    });

    it('rejects story variants with text shorter than 20 chars', () => {
      const r = StorySchema.safeParse(validStory(
        { br: { text: 'short', audioHash: 'h1' } },
        { br: 'h1' },
      ));
      expect(r.success).toBe(false);
    });

    it('rejects story vocab with audioHash empty value', () => {
      const r = StoryVocabSchema.safeParse({ word: 'w', meaning: 'm', audioHash: { br: '' } });
      expect(r.success).toBe(false);
    });
  });

  describe('normalizeExerciseInput (exposed preprocessor)', () => {
    it('returns the input unchanged when no normalization is needed', () => {
      const input = { type: 'flashcard', data: { front: 'a', back: 'b' } };
      const r = normalizeExerciseInput(input);
      expect(r).toEqual({ type: 'flashcard', data: { front: 'a', back: 'b' } });
    });

    it('normalizes translation_es_pt type', () => {
      const r = normalizeExerciseInput({ type: 'translation_es_pt', data: { source: 'Hola', target: 'Olá' } });
      expect(r).toEqual({
        type: 'translation',
        data: { source: 'Hola', target: 'Olá', sourceLang: 'es', targetLang: 'pt-pt' },
      });
    });

    it('normalizes translation_pt_es type', () => {
      const r = normalizeExerciseInput({ type: 'translation_pt_es', data: { source: 'Olá', target: 'Hola' } });
      expect(r).toEqual({
        type: 'translation',
        data: { source: 'Olá', target: 'Hola', sourceLang: 'pt-pt', targetLang: 'es' },
      });
    });

    it('promueve ptOverrides a variantOverrides["pt-pt"] — siempre fue texto europeo', () => {
      // Antes iba a "pt-br", que metía texto europeo en la clave brasileña:
      // exactamente la confusión que costó el 91 % del corpus.
      const r = normalizeExerciseInput({ type: 'flashcard', ptOverrides: { back: 'autocarro' } });
      expect(r).toEqual({ type: 'flashcard', variantOverrides: { 'pt-pt': { back: 'autocarro' } } });
    });

    it('does not mutate the input object', () => {
      const input = { type: 'translation_es_pt', data: { source: 'Hola', target: 'Olá' }, ptOverrides: { back: 'x' } };
      const snapshot = JSON.parse(JSON.stringify(input));
      normalizeExerciseInput(input);
      expect(input).toEqual(snapshot);
    });
  });
});

// E2#10: el normalizador de tipos legacy etiquetaba el lado portugués como
// `pt-br`, resto de cuando la base del corpus era brasileña. Tras la
// inversión del 2026-07-28 la base es EUROPEA por contrato, y la etiqueta
// se pinta en pantalla (`TranslationCard.tsx:28`), así que 567 de las 576
// traducciones le decían «PT-BR → ES» al alumno de un curso europeo.
describe('normalizeExerciseInput: el lado portugués de una traducción legacy es pt-pt', () => {
  it('translation_pt_es normaliza a sourceLang pt-pt', () => {
    const out = normalizeExerciseInput({
      id: 'x', type: 'translation_pt_es', blockId: 1, lessonId: 'b1-l1', difficulty: 1,
      concepts: [], tags: [], data: { source: 'Bom dia.', target: 'Buenos días.' },
    }) as any;
    expect(out.type).toBe('translation');
    expect(out.data.sourceLang).toBe('pt-pt');
    expect(out.data.targetLang).toBe('es');
  });

  it('translation_es_pt normaliza a targetLang pt-pt', () => {
    const out = normalizeExerciseInput({
      id: 'y', type: 'translation_es_pt', blockId: 1, lessonId: 'b1-l1', difficulty: 1,
      concepts: [], tags: [], data: { source: 'Buenos días.', target: 'Bom dia.' },
    }) as any;
    expect(out.data.sourceLang).toBe('es');
    expect(out.data.targetLang).toBe('pt-pt');
  });
})
