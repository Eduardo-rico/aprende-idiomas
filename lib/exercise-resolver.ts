// lib/exercise-resolver.ts
import {
  ExerciseDataByTypeSchema,
  VariantOverrideByTypeSchema,
  type Exercise,
} from "@/lib/data/zod-schemas";
import { type VariantKey } from "@/lib/data/variant";

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
 * - Variante canónica `pt-pt`: sin override propio → cae al override
 *   bajo `"pt-br"` (key legacy que almacenó el texto europeo PT). Si
 *   tampoco hay ese override, retorna datos base.
 * - Variante legacy `'pt'`: misma semántica europea; cae al override de
 *   `"pt-br"` (compat con contenido pre-Phase-1).
 * - Variante canónica `pt-br`: NO usa la key legacy `"pt-br"` como
 *   override (ese texto es europeo, mislabeled). Retorna datos base si
 *   no hay un override propio bajo otra key.
 * - Variante legacy `'br'` o cualquier otra desconocida: sin override.
 *
 * NOTE: La migración legacy (lib/data/variant.ts `ptOverridesToVariantOverrides`)
 * almacenó los overrides europeos bajo `"pt-br"`. Ese key ahora se trata
 * como EUROPEAN_LEGACY_KEY. La clave para texto BR real sería un override
 * distinto, pero el base data (ex.data) ya es BR, así que pt-br no necesita
 * override a menos que haya contenido nuevo.
 */
// The legacy migration (lib/data/variant.ts) stored European-PT overrides under
// the "pt-br" key. So the "pt-br"-keyed override is actually European (pt-pt),
// and BR is the base (ex.data). We must NOT apply it to pt-br/br users.
const LEGACY_EUROPEAN_KEY = "pt-br";
function europeanFallback(variant: VariantKey): boolean {
  return variant === "pt-pt" || variant === "pt";
}

export function resolveExerciseData(ex: Exercise, variant: VariantKey): ResolvedData {
  const direct = variant === LEGACY_EUROPEAN_KEY ? undefined : ex.variantOverrides?.[variant];
  const overrides = direct
    ?? (europeanFallback(variant) ? ex.variantOverrides?.[LEGACY_EUROPEAN_KEY] : undefined);
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
