// scripts/lib/zod-schemas.ts
import { z } from 'zod';

// ─── ExerciseType ──────────────────────────────────────────────
// Tipos activos en MVP1. sentence_construction y chunk diferidos a Plan #2
// pero presentes en el enum para que el data model no requiera migración.
export const ExerciseTypeEnum = z.enum([
  'flashcard',
  'fill_blank',
  'listening',
  'translation_es_pt',
  'translation_pt_es',
  'verb_preposition',
  'sentence_construction',
  'chunk',
]);
export type ExerciseType = z.infer<typeof ExerciseTypeEnum>;

// ─── Per-type data shapes ──────────────────────────────────────
const AudioRefSchema = z.object({
  br: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
  pt: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
});

const FlashcardData = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  example: z.string().optional(),
});
export const FlashcardDataSchema = FlashcardData;
const FillBlankData = z.object({
  sentence: z.string().min(1),
  blanks: z.array(z.object({
    position: z.number().int().nonnegative(),
    answer: z.string().min(1),
    alternatives: z.array(z.string()).optional(),
  })).min(1),
});
const ListeningData = z.object({
  audioText: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).min(2).optional(),
  answer: z.string().min(1),
});
const TranslationData = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  acceptedAlternatives: z.array(z.string()).optional(),
});
const VerbPrepositionData = z.object({
  verb: z.string().min(1),
  sentence: z.string().min(1),
  options: z.array(z.string()).min(2),
  answer: z.string().min(1),
});
const SentenceConstructionData = z.object({
  words: z.array(z.string()).min(2),
  answer: z.array(z.string()).min(2),
  translation: z.string().optional(),
});
const ChunkData = z.object({
  chunk: z.string().min(1),
  meaning: z.string().min(1),
  examples: z.array(z.object({ sentence: z.string().min(1), gloss: z.string().optional() })).min(1),
});

// Map para resolver el schema de data por tipo. Útil en audio-collector y
// generate-audio (re-validar tras spread de ptOverrides).
export const ExerciseDataByTypeSchema = {
  flashcard: FlashcardData,
  fill_blank: FillBlankData,
  listening: ListeningData,
  translation_es_pt: TranslationData,
  translation_pt_es: TranslationData,
  verb_preposition: VerbPrepositionData,
  sentence_construction: SentenceConstructionData,
  chunk: ChunkData,
} as const;

// ─── ptOverrides por tipo (todos los campos opcionales) ────────
// Usamos strictObject + partial para que ptOverrides rechace campos de otro
// tipo (ej. { chunk, meaning, examples } en un flashcard). En Zod 4 un
// `.partial()` regular permite unknown keys y eso rompe la invariante.
//
// nullTolerance: el LLM emite literalmente `"ptOverrides": null` (en vez de
// omitir el campo) en muchos items. Zod `.optional()` solo acepta undefined,
// por lo que `null` se rechaza. `nullTolerance(s)` envuelve un schema opcional
// para que también acepte `null` y lo transforme en undefined antes de validar.
const nullTolerance = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (v) => (v === null ? undefined : v),
    schema.optional(),
  ) as unknown as z.ZodOptional<T>;

const FlashcardOverride = z.strictObject(FlashcardData.shape).partial();
const FillBlankOverride = z.strictObject(FillBlankData.shape).partial();
const ListeningOverride = z.strictObject(ListeningData.shape).partial();
const TranslationOverride = z.strictObject(TranslationData.shape).partial();
const VerbPrepositionOverride = z.strictObject(VerbPrepositionData.shape).partial();
const SentenceConstructionOverride = z.strictObject(SentenceConstructionData.shape).partial();
const ChunkOverride = z.strictObject(ChunkData.shape).partial();

// ─── Exercise: discriminated union sobre `type` ────────────────
// CRÍTICO: el data y ptOverrides son variante-específicos. Cruzar tipos
// (ej. ptOverrides.audioText en un flashcard) no parsea.
const BaseExercise = z.object({
  id: z.string().min(1),
  blockId: z.number().int().positive(),
  lessonId: z.string().min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  concepts: z.array(z.string()),
  tags: z.array(z.string()),
  contentHash: z.string().optional(),
  esContrast: z.string().optional(),
  audio: AudioRefSchema.optional(),
});

const FlashcardEx = BaseExercise.extend({
  type: z.literal('flashcard'),
  data: FlashcardData,
  ptOverrides: nullTolerance(FlashcardOverride),
});
const FillBlankEx = BaseExercise.extend({
  type: z.literal('fill_blank'),
  data: FillBlankData,
  ptOverrides: nullTolerance(FillBlankOverride),
});
const ListeningEx = BaseExercise.extend({
  type: z.literal('listening'),
  data: ListeningData,
  ptOverrides: nullTolerance(ListeningOverride),
});
const TranslationEsPtEx = BaseExercise.extend({
  type: z.literal('translation_es_pt'),
  data: TranslationData,
  ptOverrides: nullTolerance(TranslationOverride),
});
const TranslationPtEsEx = BaseExercise.extend({
  type: z.literal('translation_pt_es'),
  data: TranslationData,
  ptOverrides: nullTolerance(TranslationOverride),
});
const VerbPrepositionEx = BaseExercise.extend({
  type: z.literal('verb_preposition'),
  data: VerbPrepositionData,
  ptOverrides: nullTolerance(VerbPrepositionOverride),
});
const SentenceConstructionEx = BaseExercise.extend({
  type: z.literal('sentence_construction'),
  data: SentenceConstructionData,
  ptOverrides: nullTolerance(SentenceConstructionOverride),
});
const ChunkEx = BaseExercise.extend({
  type: z.literal('chunk'),
  data: ChunkData,
  ptOverrides: nullTolerance(ChunkOverride),
});

export const ExerciseSchema = z.discriminatedUnion('type', [
  FlashcardEx, FillBlankEx, ListeningEx,
  TranslationEsPtEx, TranslationPtEsEx,
  VerbPrepositionEx, SentenceConstructionEx, ChunkEx,
]);
export type Exercise = z.infer<typeof ExerciseSchema>;

// Estado "generado y completo" — invariante al disco. Plan #1 debe commitear
// SOLO archivos que satisfagan esta invariante. validate-content la impone.
// En Zod 4 los discriminatedUnion no soportan .extend(); replicamos extendiendo
// cada miembro y volviendo a construir el union.
const RequiredGeneratedFields = {
  contentHash: z.string().min(1),
  audio: AudioRefSchema,
};

const FlashcardGen = FlashcardEx.extend(RequiredGeneratedFields);
const FillBlankGen = FillBlankEx.extend(RequiredGeneratedFields);
const ListeningGen = ListeningEx.extend(RequiredGeneratedFields);
const TranslationEsPtGen = TranslationEsPtEx.extend(RequiredGeneratedFields);
const TranslationPtEsGen = TranslationPtEsEx.extend(RequiredGeneratedFields);
const VerbPrepositionGen = VerbPrepositionEx.extend(RequiredGeneratedFields);
const SentenceConstructionGen = SentenceConstructionEx.extend(RequiredGeneratedFields);
const ChunkGen = ChunkEx.extend(RequiredGeneratedFields);

export const GeneratedExerciseSchema = z.discriminatedUnion('type', [
  FlashcardGen, FillBlankGen, ListeningGen,
  TranslationEsPtGen, TranslationPtEsGen,
  VerbPrepositionGen, SentenceConstructionGen, ChunkGen,
]);
export type GeneratedExercise = z.infer<typeof GeneratedExerciseSchema>;

// LLM batch output: el LLM produce N items, omitimos los campos que el
// orquestador adjunta (id, blockId, lessonId, contentHash, audio).
// El type discrimina el data shape.
const LlmItemSchema = z.discriminatedUnion('type', [
  FlashcardEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  FillBlankEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ListeningEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  TranslationEsPtEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  TranslationPtEsEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  VerbPrepositionEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  SentenceConstructionEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ChunkEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
]);
export const ExerciseBatchSchema = z.array(LlmItemSchema);
export type ExerciseBatchItem = z.infer<typeof ExerciseBatchSchema>[number];
