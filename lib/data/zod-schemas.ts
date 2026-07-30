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
  // Plan 5a: text-only types (no audio, except shadowing which reuses an
  // existing audio hash). Content for these arrives in Plan 5b.
  'error_correction',
  'conjugation',
  'matching',
  'multiple_choice',
  'shadowing',
  'grammaticality_judgment',
  'mediation',
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

// ─── Lesson audio-refs (sidecar) ────────────────────────────────
// Live in `lib/data/languages/{lang}/lessons/audio-refs.json` (one
// per-language sidecar). The key is the lessonId (e.g. "b1-regulares-ar"),
// the value bundles display metadata (blockId/title/exampleCount) and a
// per-variant map of audio refs for the lesson's examples.
//
// The audioRefs map uses the same free VariantKey convention as
// AudioRefSchema. Each value is an ARRAY of refs — one per example
// (lessons have N examples per variant, not a single audio per item).
//
// A missing audio-refs entry for a lesson is not an error: the loader
// returns `{}` and the route handler falls back to lesson.name + 0
// examples.
export const LessonAudioRefSchema = z.object({
  hash: z.string().min(1),
  voice: z.string().min(1),
});

export const LessonAudioRefsEntrySchema = z.object({
  blockId: z.number().int().positive(),
  title: z.string().min(1),
  exampleCount: z.number().int().nonnegative(),
  audioRefs: z.record(z.string(), z.array(LessonAudioRefSchema)),
});

export const LessonAudioRefsFileSchema = z.record(
  z.string().regex(/^b\d+-[\w-]+$/, 'lessonId must look like b1-regulares-ar'),
  LessonAudioRefsEntrySchema,
);
export type LessonAudioRefs = z.infer<typeof LessonAudioRefsFileSchema>;

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

// ─── Plan 5a: new text-only exercise types ─────────────────────
export const ErrorCorrectionData = z.object({
  sentence: z.string().min(1), correct: z.string().min(1), explanationEs: z.string().min(1),
});
export const ConjugationData = z.object({
  infinitive: z.string().min(1), person: z.string().min(1), tense: z.string().min(1),
  answer: z.string().min(1), hintEs: z.string().min(1),
});
export const MatchingData = z.object({
  pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })).min(3).max(6),
});
export const MultipleChoiceData = z.object({
  question: z.string().min(1), options: z.array(z.string().min(1)).min(2).max(4),
  correctIndex: z.number().int().nonnegative(), explanationEs: z.string().min(1),
});
export const ShadowingData = z.object({
  text: z.string().min(1), es: z.string().min(1), audioRef: z.string().optional(),
  // E11: feature-targeted self-eval prompts shown after recording, e.g.
  // ["¿Nasalizaste 'pão'?", "¿La 'r' inicial sonó como /h/ (BR)?"].
  selfChecks: z.array(z.string()).optional(),
});

// ─── Ola B2C2-PT: tipos nuevos (2026-07-29) ────────────────────
// El plan maestro manda: schema y runner PRIMERO, contenido después.

// Juicio de gramaticalidad — el instrumento del anti-calco (¿*vais a
// poupar*? ¿*embora festejas*?). Determinista: verdict es la respuesta.
// repair es obligatorio si la frase está mal (hay que mostrar la buena)
// y prohibido si está bien (no hay nada que reparar).
const GrammaticalityJudgmentBase = z.object({
  sentence: z.string().min(1),
  verdict: z.boolean(),
  repair: z.string().min(1).optional(),
  explanationEs: z.string().min(1),
});
export const GrammaticalityJudgmentData = GrammaticalityJudgmentBase
  .refine((d) => d.verdict ? d.repair === undefined : typeof d.repair === 'string',
    { message: 'repair es obligatorio con verdict=false y prohibido con verdict=true' });

// Mediación (Companion Volume 2020): fuente + consigna + rúbrica. La
// corrección v1 es AUTOEVALUACIÓN contra rúbrica (el alumno coteja su
// texto criterio a criterio) — un juez LLM es decisión aparte, no
// fingida. Los sourceText salen de la biblioteca de la Ola L: textos
// reales, no inventados.
export const MediationTypeSchema = z.enum([
  'summarise', 'relay', 'explain_concept', 'reformulate_register',
  'cross_variety', 'synthesise_sources',
]);
export const MediationData = z.object({
  sourceText: z.string().min(1),
  sourceRef: z.string().optional(), // id de lectura de la Ola L, si aplica
  sourceLang: z.string().min(2),
  targetLang: z.string().min(2),
  mediationType: MediationTypeSchema,
  audience: z.string().min(1),
  instructionsEs: z.string().min(1),
  wordRange: z.object({ min: z.number().int().positive(), max: z.number().int().positive() })
    .refine((r) => r.min < r.max, { message: 'wordRange.min debe ser < max' }),
  rubric: z.array(z.string().min(1)).min(1),
  modelAnswer: z.string().optional(),
});

// Registro y tratamiento como rasgos de PRIMERA CLASE del ítem
// (currículo §8: sin ellos no hay gate de coherencia ni ejercicios de
// tratamento situado, y la adecuación de registro es criterio CAPLE
// desde B1).
export const RegisterSchema = z.enum(['intimo', 'informal', 'neutro', 'formal', 'solene']);
export const AddressSchema = z.enum(['tu', 'terceira_sem_pronome', 'nome_cargo', 'o_senhor', 'V_Exa', 'voce_BR']);

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
  error_correction: ErrorCorrectionData,
  conjugation: ConjugationData,
  matching: MatchingData,
  multiple_choice: MultipleChoiceData,
  shadowing: ShadowingData,
  grammaticality_judgment: GrammaticalityJudgmentData,
  mediation: MediationData,
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
const ErrorCorrectionOverride = z.strictObject(ErrorCorrectionData.shape).partial();
const ConjugationOverride = z.strictObject(ConjugationData.shape).partial();
const MatchingOverride = z.strictObject(MatchingData.shape).partial();
const MultipleChoiceOverride = z.strictObject(MultipleChoiceData.shape).partial();
const ShadowingOverride = z.strictObject(ShadowingData.shape).partial();

const VariantOverrideValue = z.union([
  FlashcardOverride,
  FillBlankOverride,
  ListeningOverride,
  TranslationOverride,
  VerbPrepositionOverride,
  SentenceConstructionOverride,
  ChunkOverride,
  LessonOverride,
  ErrorCorrectionOverride,
  ConjugationOverride,
  MatchingOverride,
  MultipleChoiceOverride,
  ShadowingOverride,
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
  error_correction: ErrorCorrectionOverride,
  conjugation: ConjugationOverride,
  matching: MatchingOverride,
  multiple_choice: MultipleChoiceOverride,
  shadowing: ShadowingOverride,
  grammaticality_judgment: z.strictObject(GrammaticalityJudgmentBase.shape).partial(),
  mediation: z.strictObject(MediationData.shape).partial(),
} as const;

// ─── Exercise: discriminated union sobre `type` ────────────────
// CRÍTICO: el data es variante-específico. Cruzar tipos (ej. data con
// audioText en un flashcard) no parsea. variantOverrides se valida
// contra la unión de override schemas (no conoce el tipo del padre).
// Estado de variante. Existe para matar una ambigüedad que costó el 91 % del
// corpus: hasta la inversión de 2026-07-28, la AUSENCIA de `variantOverrides`
// significaba o «verificado idéntico en las dos variantes» o «nadie lo miró»,
// y no había forma de distinguirlas — así que el contenido brasileño se sirvió
// como europeo en silencio. Ahora el silencio es un estado explícito.
//
//   'divergent'   — las dos formas existen y difieren. `data` es PT-PT,
//                   `variantOverrides['pt-br']` lleva los campos brasileños.
//   'unchecked'   — nadie ha verificado que `data` sea válido en PT-PT.
//                   NO debe servirse como pt-pt sin revisión humana.
//   'needs-human' — el ítem está roto o el override no es una variante.
//   'neutral'     — sin divergencia entre variantes, por UNA de dos vías
//                   que `variantVerificacion` distingue para siempre:
//                   verificado por nativo, o sin material divergente
//                   según la regla determinista de la Ola V
//                   (`regla-inerte-v2`). Lo sellado por regla PERMANECE
//                   en la cola del nativo, detrás de los `unchecked`:
//                   el sello ordena el trabajo, no lo cancela.
export const VariantStatusSchema = z.enum([
  'neutral',
  'divergent',
  'unchecked',
  'needs-human',
]);
export type VariantStatus = z.infer<typeof VariantStatusSchema>;

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
  /** Ver VariantStatusSchema. Opcional para que el contenido anterior a la
   *  inversión siga parseando; el gate de verify-content lo exige. */
  variantStatus: VariantStatusSchema.optional(),
  /** Quién/qué respalda el variantStatus. La Ola V escribe aquí el sello
   *  de la regla (`regla-inerte-v1`) al consagrar un `neutral` o el motivo
   *  al cuarentenar: un `neutral` por regla queda PARA SIEMPRE
   *  distinguible de uno verificado por nativo (que llevará otro texto). */
  variantVerificacion: z.string().optional(),
  /** Registro y tratamiento (Ola B2C2-PT). Opcionales: el corpus viejo
   *  no los declara; el contenido B2+ nuevo DEBE declararlos y el gate
   *  de coherencia (check-registro) los cruza contra el texto. */
  register: RegisterSchema.optional(),
  address: AddressSchema.optional(),
  /** Exención declarada del requisito de audio.
   *
   *  `verify-content` exige audio para flashcard, listening, translation,
   *  sentence_construction y chunk. La regla es correcta para el contenido
   *  que el alumno debe OÍR, pero no para las tarjetas metalingüísticas,
   *  cuyo front y back están en español: doblarlas sería pagar una locución
   *  española dentro de un curso de portugués.
   *
   *  La exención se declara ítem a ítem y CON MOTIVO, nunca se infiere del
   *  tipo ni del idioma detectado. Un requisito con puerta trasera silenciosa
   *  deja de ser un requisito; uno con puerta trasera firmada sigue siéndolo. */
  audioExento: z.object({ motivo: z.string().min(10) }).optional(),
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
const ErrorCorrectionEx = BaseExercise.extend({
  type: z.literal('error_correction'),
  data: ErrorCorrectionData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const ConjugationEx = BaseExercise.extend({
  type: z.literal('conjugation'),
  data: ConjugationData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const MatchingEx = BaseExercise.extend({
  type: z.literal('matching'),
  data: MatchingData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const MultipleChoiceEx = BaseExercise.extend({
  type: z.literal('multiple_choice'),
  data: MultipleChoiceData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const ShadowingEx = BaseExercise.extend({
  type: z.literal('shadowing'),
  data: ShadowingData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const GrammaticalityJudgmentEx = BaseExercise.extend({
  type: z.literal('grammaticality_judgment'),
  data: GrammaticalityJudgmentData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});
const MediationEx = BaseExercise.extend({
  type: z.literal('mediation'),
  data: MediationData,
  variantOverrides: z.record(z.string(), VariantOverrideValue).optional(),
});

export const ExerciseSchema = z.discriminatedUnion('type', [
  FlashcardEx, FillBlankEx, ListeningEx,
  TranslationEx,
  VerbPrepositionEx, SentenceConstructionEx, ChunkEx,
  LessonEx,
  ErrorCorrectionEx, ConjugationEx, MatchingEx, MultipleChoiceEx, ShadowingEx,
  GrammaticalityJudgmentEx, MediationEx,
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
//   3. `ptOverrides` (no null) → `variantOverrides["pt-pt"]` (siempre fue texto europeo).
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

  // (3) Promover ptOverrides a variantOverrides["pt-pt"].
  //
  // `ptOverrides` es el campo legacy anterior a Phase 1 y SIEMPRE contenía
  // texto EUROPEO (era «el override para portugués de Portugal» sobre una base
  // brasileña). Promoverlo a la clave "pt-br" —como se hacía— metía texto
  // europeo en la clave brasileña, que es exactamente la confusión que costó
  // el 91 % del corpus. Va a "pt-pt", que es lo que además documenta
  // `ptOverridesToVariantOverrides` en lib/data/variant.ts.
  //
  // Ojo: esto normaliza la FORMA, no la semántica. Un fichero legacy sigue
  // teniendo `data` brasileño; invertirlo es trabajo de
  // `scripts/invert-variant-base.ts`. Hoy ya no queda contenido con este
  // campo (verificado: 0 ficheros bajo lib/data/languages/).
  if ("ptOverrides" in obj && obj.ptOverrides !== undefined && obj.ptOverrides !== null) {
    if (!("variantOverrides" in obj) || obj.variantOverrides === undefined || obj.variantOverrides === null) {
      obj.variantOverrides = { "pt-pt": obj.ptOverrides };
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

// Plan 5a (R1): text-only types are "generated" with only a contentHash —
// audio stays optional (they enqueue no TTS; shadowing reuses an existing hash).
const TextOnlyGeneratedFields = {
  contentHash: z.string().min(1),
  audio: AudioRefSchema.optional(),
};
const ErrorCorrectionGen = ErrorCorrectionEx.extend(TextOnlyGeneratedFields);
const ConjugationGen = ConjugationEx.extend(TextOnlyGeneratedFields);
const MatchingGen = MatchingEx.extend(TextOnlyGeneratedFields);
const MultipleChoiceGen = MultipleChoiceEx.extend(TextOnlyGeneratedFields);
const ShadowingGen = ShadowingEx.extend(TextOnlyGeneratedFields);

export const GeneratedExerciseSchema = z.discriminatedUnion('type', [
  FlashcardGen, FillBlankGen, ListeningGen,
  TranslationGen,
  VerbPrepositionGen, SentenceConstructionGen, ChunkGen,
  LessonGen,
  ErrorCorrectionGen, ConjugationGen, MatchingGen, MultipleChoiceGen, ShadowingGen,
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
  ErrorCorrectionEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ConjugationEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  MatchingEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  MultipleChoiceEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
  ShadowingEx.omit({ id: true, blockId: true, lessonId: true, contentHash: true, audio: true }),
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
  // Ceiling items (E13) place learners beyond B3, so blockId now spans the
  // full curriculum range (was max 3).
  blockId: z.number().int().min(1).max(10),
  conceptId: z.string().min(1),
  prompt: z.string().min(10),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export const DiagnosticSchema = z.object({
  generatedAt: z.string().min(1),
  // At least the 20 base items; ceiling items (E13) extend the set.
  questions: z.array(DiagnosticQuestionSchema).min(20),
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
