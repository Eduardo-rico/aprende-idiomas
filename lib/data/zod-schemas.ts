// lib/data/zod-schemas.ts
import { z } from 'zod';

// ─── ExerciseType ──────────────────────────────────────────────
// Tipos activos en MVP1. sentence_construction y chunk diferidos a Plan #2
// pero presentes en el enum para que el data model no requiera migración.
//
// Phase 1 (multi-idioma): los tipos legacy `translation_es_pt` y
// `translation_pt_es` colapsan a un único `translation`. El preprocessor
// `normalizeExerciseInput` (más abajo) acepta el input legacy y lo
// normaliza a la forma canónica con `sourceLang`/`targetLang` en `data`.
// La salida de `ExerciseSchema` es siempre la forma canónica.
export const ExerciseTypeEnum = z.enum([
  'flashcard',
  'fill_blank',
  'listening',
  'translation',
  'verb_preposition',
  'sentence_construction',
  'chunk',
  'lesson',
]);
export type ExerciseType = z.infer<typeof ExerciseTypeEnum>;

// ─── Per-type data shapes ──────────────────────────────────────
// AudioRefSchema: record libre de { hash, voice } por VariantKey.
// Contenido legacy usa "br" y "pt"; contenido nuevo puede usar cualquier
// clave (ej. "pt-br", "pt-pt", "ru"). La clave es libre a propósito:
// añadir un dialecto es un cambio de datos, no de schema.
const AudioRefEntry = z.object({
  hash: z.string().min(1),
  voice: z.string().min(1),
});
const AudioRefSchema = z.record(z.string(), AudioRefEntry);

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
// TranslationData: `source` y `target` son el texto (la frase origen
// a traducir y la traducción esperada). `sourceLang` y `targetLang`
// son los códigos de idioma (ej. "es", "pt-br"). El preprocessor
// rellena sourceLang/targetLang a partir del tipo legacy.
const TranslationData = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  sourceLang: z.string().min(2),
  targetLang: z.string().min(2),
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

// LessonData: 1 lesson step por lección. Renderiza MDX (conceptNotesPath).
// No tiene audio en data — los audio refs viven en un sidecar
// `lib/data/languages/pt/lessons/audio-refs.json` (L2).
export const LessonDataSchema = z.object({
  kind: z.literal('lesson'),
  lessonId: z.string().regex(/^b\d+-[\w-]+$/, 'lessonId must look like b1-regulares-ar'),
  blockId: z.number().int().positive(),
  mdxPath: z.string().regex(/^b\d+\/l[\w-]+\.mdx$/, 'mdxPath must look like b1/l-regulares-ar.mdx'),
  exampleCount: z.number().int().nonnegative(),
});

// Map para resolver el schema de data por tipo. Útil en audio-collector y
// generate-audio (re-validar tras spread de variantOverrides).
export const ExerciseDataByTypeSchema = {
  flashcard: FlashcardData,
  fill_blank: FillBlankData,
  listening: ListeningData,
  translation: TranslationData,
  verb_preposition: VerbPrepositionData,
  sentence_construction: SentenceConstructionData,
  chunk: ChunkData,
  lesson: LessonDataSchema,
} as const;

// ─── variantOverrides por tipo (todos los campos opcionales) ────
// Usamos strictObject + partial para que variantOverrides rechace campos
// de otro tipo (ej. { chunk, meaning, examples } en un flashcard). En
// Zod 4 un `.partial()` regular permite unknown keys y eso rompe la
// invariante.
//
// El valor de variantOverrides es un record por VariantKey. La
// validación per-tipo (que la variante coincida con el tipo de
// ejercicio) se hace en el resolver (lib/exercise-resolver.ts), no
// aquí — el schema no puede saber el tipo del padre desde un valor.
const FlashcardOverride = z.strictObject(FlashcardData.shape).partial();
const FillBlankOverride = z.strictObject(FillBlankData.shape).partial();
const ListeningOverride = z.strictObject(ListeningData.shape).partial();
const TranslationOverride = z.strictObject(TranslationData.shape).partial();
const VerbPrepositionOverride = z.strictObject(VerbPrepositionData.shape).partial();
const SentenceConstructionOverride = z.strictObject(SentenceConstructionData.shape).partial();
const ChunkOverride = z.strictObject(ChunkData.shape).partial();
const LessonOverride = z.strictObject(LessonDataSchema.shape).partial();

const VariantOverrideValue = z.union([
  FlashcardOverride,
  FillBlankOverride,
  ListeningOverride,
  TranslationOverride,
  VerbPrepositionOverride,
  SentenceConstructionOverride,
  ChunkOverride,
  LessonOverride,
]);

// Map para resolver el override schema (strict) por tipo. El resolver
// del cliente (lib/exercise-resolver.ts) lo usa para rechazar
// variantOverrides con campos de otro tipo antes de mergear.
export const VariantOverrideByTypeSchema = {
  flashcard: FlashcardOverride,
  fill_blank: FillBlankOverride,
  listening: ListeningOverride,
  translation: TranslationOverride,
  verb_preposition: VerbPrepositionOverride,
  sentence_construction: SentenceConstructionOverride,
  chunk: ChunkOverride,
  lesson: LessonOverride,
} as const;

// ─── Exercise: discriminated union sobre `type` ────────────────
// CRÍTICO: el data es variante-específico. Cruzar tipos (ej. data con
// audioText en un flashcard) no parsea. variantOverrides se valida
// contra la unión de override schemas (no conoce el tipo del padre).
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
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const FillBlankEx = BaseExercise.extend({
  type: z.literal('fill_blank'),
  data: FillBlankData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const ListeningEx = BaseExercise.extend({
  type: z.literal('listening'),
  data: ListeningData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const TranslationEx = BaseExercise.extend({
  type: z.literal('translation'),
  data: TranslationData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const VerbPrepositionEx = BaseExercise.extend({
  type: z.literal('verb_preposition'),
  data: VerbPrepositionData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const SentenceConstructionEx = BaseExercise.extend({
  type: z.literal('sentence_construction'),
  data: SentenceConstructionData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const ChunkEx = BaseExercise.extend({
  type: z.literal('chunk'),
  data: ChunkData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const LessonEx = BaseExercise.extend({
  type: z.literal('lesson'),
  data: LessonDataSchema,
  variantOverrides: z.record(z.string(), LessonOverride).optional(),
});

export const ExerciseSchema = z.discriminatedUnion('type', [
  FlashcardEx, FillBlankEx, ListeningEx,
  TranslationEx,
  VerbPrepositionEx, SentenceConstructionEx, ChunkEx,
  LessonEx,
]);
export type Exercise = z.infer<typeof ExerciseSchema>;

// ─── Preprocessor para backward compat (Phase 1) ───────────────
// Acepta las formas legacy del input y las normaliza a la forma canónica.
// Se exporta para que scripts y otros callers puedan normalizar JSON
// crudo antes de validar.
//
//   1. `type: "translation_es_pt"` → `type: "translation"`,
//      `data.sourceLang = "es"`, `data.targetLang = "pt-br"`.
//   2. `type: "translation_pt_es"` → `type: "translation"`,
//      `data.sourceLang = "pt-br"`, `data.targetLang = "es"`.
//   3. `ptOverrides` (no null) → `variantOverrides["pt-br"]`.
//      Si `variantOverrides` ya está presente, `ptOverrides` se descarta
//      (la canónica gana).
//   4. `variantOverrides: null` → se elimina (tratado como undefined).
export function normalizeExerciseInput(v: unknown): unknown {
  if (!v || typeof v !== "object") return v;
  const obj = { ...(v as Record<string, unknown>) };

  // (1, 2) Normalizar tipos de traducción legacy
  if (obj.type === "translation_es_pt" || obj.type === "translation_pt_es") {
    const data = obj.data;
    if (data && typeof data === "object") {
      const direction = obj.type === "translation_es_pt"
        ? { sourceLang: "es", targetLang: "pt-br" }
        : { sourceLang: "pt-br", targetLang: "es" };
      obj.type = "translation";
      obj.data = { ...(data as Record<string, unknown>), ...direction };
    }
  }

  // (3) Promover ptOverrides a variantOverrides["pt-br"]
  if ("ptOverrides" in obj && obj.ptOverrides !== undefined && obj.ptOverrides !== null) {
    if (!("variantOverrides" in obj) || obj.variantOverrides === undefined || obj.variantOverrides === null) {
      obj.variantOverrides = { "pt-br": obj.ptOverrides };
    }
    delete obj.ptOverrides;
  }

  // (4) variantOverrides: null → eliminar
  if ("variantOverrides" in obj && obj.variantOverrides === null) {
    delete obj.variantOverrides;
  }

  return obj;
}

/** Schema de input con preprocessor. Usar cuando se parsea JSON crudo
 *  (output de LLM, archivos de contenido legacy) para aceptar ambas
 *  formas. Para contenido nuevo, `ExerciseSchema` parsea directo. */
export const ExerciseInputSchema = z.preprocess(normalizeExerciseInput, ExerciseSchema);

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
const TranslationGen = TranslationEx.extend(RequiredGeneratedFields);
const VerbPrepositionGen = VerbPrepositionEx.extend(RequiredGeneratedFields);
const SentenceConstructionGen = SentenceConstructionEx.extend(RequiredGeneratedFields);
const ChunkGen = ChunkEx.extend(RequiredGeneratedFields);
const LessonGen = LessonEx.extend(RequiredGeneratedFields);

export const GeneratedExerciseSchema = z.discriminatedUnion('type', [
  FlashcardGen, FillBlankGen, ListeningGen,
  TranslationGen,
  VerbPrepositionGen, SentenceConstructionGen, ChunkGen,
  LessonGen,
]);
export type GeneratedExercise = z.infer<typeof GeneratedExerciseSchema>;

// LLM batch output: el LLM produce N items, omitimos los campos que el
// orquestador adjunta (id, blockId, lessonId, contentHash, audio).
// El type discrimina el data shape. El preprocessor acepta tanto la
// forma canónica como la legacy (translation_es_pt, ptOverrides).
const LlmItemSchema = z.preprocess(normalizeExerciseInput, z.discriminatedUnion('type', [
  FlashcardEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  FillBlankEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ListeningEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  TranslationEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  VerbPrepositionEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  SentenceConstructionEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ChunkEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  LessonEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
]));
export const ExerciseBatchSchema = z.array(LlmItemSchema);
export type ExerciseBatchItem = z.infer<typeof ExerciseBatchSchema>[number];

// ─── Story (mini-historias, Plan #3) ──────────────────────────
export const StoryVocabSchema = z.object({
  word: z.string().min(1),
  ptWord: z.string().min(1).optional(),
  meaning: z.string().min(1),
  // Record libre por VariantKey. Contenido legacy usa "br" y "pt";
  // contenido nuevo puede usar "pt-br", "pt-pt", "ru", etc.
  audioHash: z.record(z.string(), z.string().min(1)),
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
  // Record libre de variantes por VariantKey.
  variants: z.record(z.string(), StoryVariantSchema),
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
