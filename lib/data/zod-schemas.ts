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

// Map para resolver el override schema (strict) por tipo. El resolver del
// cliente (lib/exercise-resolver.ts) lo usa para rechazar ptOverrides con
// campos de otro tipo (ej. { chunk } sobre un flashcard) antes de mergear.
export const PtOverrideByTypeSchema = {
  flashcard: FlashcardOverride,
  fill_blank: FillBlankOverride,
  listening: ListeningOverride,
  translation_es_pt: TranslationOverride,
  translation_pt_es: TranslationOverride,
  verb_preposition: VerbPrepositionOverride,
  sentence_construction: SentenceConstructionOverride,
  chunk: ChunkOverride,
} as const;

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

// ─── Story (mini-historias, Plan #3) ──────────────────────────
export const StoryVocabSchema = z.object({
  word: z.string().min(1),
  ptWord: z.string().min(1).optional(),
  meaning: z.string().min(1),
  audioHash: z.object({ br: z.string().min(1), pt: z.string().min(1) }),
});

export const StoryVariantSchema = z.object({
  text: z.string().min(20),
  audioHash: z.string().min(1),
});

export const StorySchema = z.object({
  id: z.string().regex(/^b\d+-s\d+-.+/, "story id must be b{N}-s{N}-{slug}"),
  blockId: z.number().int().min(1).max(10),
  lessonIds: z.array(z.string()),
  title: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  conceptIds: z.array(z.string()),
  variants: z.object({ br: StoryVariantSchema, pt: StoryVariantSchema }),
  vocab: z.array(StoryVocabSchema).min(3).max(12),
});

export type Story = z.infer<typeof StorySchema>;
export type StoryVocab = z.infer<typeof StoryVocabSchema>;

// ─── Diagnostic (Plan #3) ────────────────────────────────────────────────────
export const DiagnosticQuestionSchema = z.object({
  id: z.string().min(1),
  blockId: z.number().int().min(1).max(3),
  conceptId: z.string().min(1),
  prompt: z.string().min(10),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export const DiagnosticSchema = z.object({
  generatedAt: z.string().min(1),
  questions: z.array(DiagnosticQuestionSchema).length(20),
});

export type Diagnostic = z.infer<typeof DiagnosticSchema>;
export type DiagnosticQuestion = z.infer<typeof DiagnosticQuestionSchema>;

// ─── Lesson (proposed by scripts/propose-lessons.ts, written to lib/data/lessons/bN.json) ───
// Schema mirrors the Lesson interface in lib/data/curriculum.ts but is the
// strict wire format used at write time. Empty conceptIds or objectives are
// rejected; conceptNotesPath must be a future MDX route.
export const LessonSchema = z.object({
  id: z.string().regex(/^b\d+-l\d+-[\w-]+$/, "lesson id must be b{N}-l{N}-{slug}"),
  blockId: z.number().int().min(1).max(10),
  name: z.string().min(1).max(80),
  objectives: z.array(z.string().min(1)).min(1).max(6),
  conceptIds: z.array(z.string().min(1)).min(1).max(8),
  vocabKey: z.array(z.string().min(1)).min(1).max(7),
  conceptNotesPath: z.string().regex(/^b\d+\/l[\w-]+\.mdx$/, "conceptNotesPath must be b{N}/l{N}-{slug}.mdx"),
  exerciseRefs: z.array(z.string()).default([]),
});

export const LessonListSchema = z.array(LessonSchema);
export type Lesson = z.infer<typeof LessonSchema>;
