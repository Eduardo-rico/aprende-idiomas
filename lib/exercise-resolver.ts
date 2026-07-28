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
 * Resolución de variante, tras la inversión del 2026-07-28.
 *
 * ANTES: `ex.data` era brasileño y `variantOverrides["pt-br"]` guardaba el
 * texto EUROPEO bajo una clave que decía lo contrario. Esta función llevaba
 * una capa de compensación (`LEGACY_EUROPEAN_KEY`) para deshacer esa mentira
 * en cada lectura: para un usuario pt-pt buscaba el override de "pt-br", y
 * para un usuario pt-br se negaba a aplicarlo.
 *
 * AHORA las claves dicen la verdad:
 *   ex.data                      → portugués europeo (PT-PT), la base
 *   variantOverrides["pt-br"]    → portugués de Brasil, sólo campos que difieren
 *
 * Así que la regla es la obvia y no hace falta compensar nada:
 * - `pt-pt` / `pt` → datos base, tal cual.
 * - `pt-br` / `br` → base + override brasileño si existe.
 * - Cualquier otra clave (`pt-ao`, …) → base + su propio override si existe.
 *
 * Ver `scripts/invert-variant-base.ts` para la migración que lo hizo posible,
 * y `variantStatus` en zod-schemas.ts para saber si `data` está verificado
 * como europeo o sólo heredado del corpus brasileño original.
 */
const BR_KEYS = new Set(["pt-br", "br"]);
const PT_KEYS = new Set(["pt-pt", "pt"]);

/** Normaliza el alias corto a la clave canónica. */
function claveDe(variant: VariantKey): string {
  if (BR_KEYS.has(variant)) return "pt-br";
  if (PT_KEYS.has(variant)) return "pt-pt";
  return variant;
}

export function resolveExerciseData(ex: Exercise, variant: VariantKey): ResolvedData {
  // La base ya es europea, así que pt-pt normalmente no necesita override —
  // pero si alguien declara uno explícito bajo "pt-pt", gana. Ignorarlo sería
  // el mismo tipo de sorpresa silenciosa que este cambio vino a quitar (y es
  // además lo que produce el shim legacy de `ptOverrides`).
  const overrides = ex.variantOverrides?.[claveDe(variant)];
  if (!overrides) return ex.data as ResolvedData;

  // Validate the override against the type's strict override schema first so
  // foreign-typed fields (e.g. a chunk override on a flashcard) throw instead
  // of being silently stripped by the non-strict data schema after merge.
  const validOverride = VariantOverrideByTypeSchema[ex.type].parse(overrides);
  const merged = { ...ex.data, ...validOverride };
  return ExerciseDataByTypeSchema[ex.type].parse(merged) as ResolvedData;
}

// Audio is stored flat under the SHORT variant keys: audio.br / audio.pt =
// { hash, voice }. Callers, however, pass the full VariantKey ("pt-br" /
// "pt-pt") from settings — a mismatch introduced when variants moved to the
// long form in Phase 1, which made resolveAudioHash throw for EVERY
// audio-bearing card. We map the long key to the short one, then fall back
// to any other available variant, and finally to `null` so the card renders
// without an audio button instead of crashing the whole runner.
const VARIANT_TO_AUDIO_KEY: Record<string, string> = { "pt-br": "br", "pt-pt": "pt" };

export function resolveAudioHash(ex: Exercise, variant: VariantKey): string | null {
  const audio = ex.audio;
  if (!audio) return null;
  const shortKey = VARIANT_TO_AUDIO_KEY[variant] ?? variant;
  const ref =
    audio[shortKey] ??        // mapped short key ("br" / "pt")
    audio[variant] ??         // already-full key (future-proof)
    Object.values(audio)[0];  // any other available variant
  return ref?.hash ?? null;
}
