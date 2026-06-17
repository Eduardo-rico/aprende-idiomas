// lib/exercise-resolver.ts
import {
  ExerciseDataByTypeSchema,
  VariantOverrideByTypeSchema,
  type Exercise,
} from "@/lib/data/zod-schemas";
import { type VariantKey, DEFAULT_VARIANT } from "@/lib/data/variant";

export type { Exercise };

// The card components and tests access type-specific fields (data.back,
// data.sentence, data.blanks, ...) off the resolved data. The raw
// Exercise["data"] is a discriminated union that can't be indexed without
// narrowing. ResolvedData is the union flattened with every field optional so
// each card can read the fields it knows belong to its own exercise type.
export interface ResolvedData {
  // flashcard
  front?: string;
  back?: string;
  example?: string;
  // fill_blank
  sentence?: string;
  blanks?: { position: number; answer: string; alternatives?: string[] }[];
  // listening
  audioText?: string;
  question?: string;
  options?: string[];
  answer?: string;
  // translation
  source?: string;
  target?: string;
  sourceLang?: string;
  targetLang?: string;
  acceptedAlternatives?: string[];
  // verb_preposition
  verb?: string;
  // sentence_construction
  words?: string[];
  translation?: string;
  // chunk
  chunk?: string;
  meaning?: string;
  examples?: { sentence: string; gloss?: string }[];
}

/**
 * Phase 1 (multi-idioma): `variantOverrides` es un record por VariantKey.
 *
 * Reglas de fallback (mismas que `textsFor` en audio-collector):
 * - Variante canónica (`pt-br` / `pt-pt`): sin override propio → datos
 *   base. NO cae al DEFAULT_VARIANT (eso aplicaría semántica PT-BR a
 *   un usuario que explícitamente pidió PT-PT).
 * - Variante legacy `'pt'`: cae al override de `pt-br` (compat con el
 *   contenido pre-Phase-1, donde `ptOverrides` aplicaba a la "variante PT"
 *   europea y se promovía a `variantOverrides["pt-br"]`).
 * - Variante legacy `'br'` o cualquier otra desconocida: sin override.
 *   `ptOverrides` nunca aplicaba a BR; cualquier otra key es desconocida.
 */
function isLegacyPtAlias(variant: VariantKey): boolean {
  return variant === "pt";
}

export function resolveExerciseData(ex: Exercise, variant: VariantKey): ResolvedData {
  const overrides = ex.variantOverrides?.[variant]
    ?? (isLegacyPtAlias(variant) ? ex.variantOverrides?.[DEFAULT_VARIANT] : undefined);
  if (!overrides) return ex.data as ResolvedData;

  // Validate the override against the type's strict override schema first so
  // foreign-typed fields (e.g. a chunk override on a flashcard) throw instead
  // of being silently stripped by the non-strict data schema after merge.
  const validOverride = VariantOverrideByTypeSchema[ex.type].parse(overrides);
  const merged = { ...ex.data, ...validOverride };
  return ExerciseDataByTypeSchema[ex.type].parse(merged) as ResolvedData;
}

// Audio in b1.json is flat: audio[variant] = { hash, voice }.
// `variant` is a free VariantKey string now (Phase 1).
export function resolveAudioHash(ex: Exercise, variant: VariantKey): string {
  const ref = ex.audio?.[variant];
  if (!ref) throw new Error(`Exercise ${ex.id} has no audio for variant ${variant}`);
  return ref.hash;
}
