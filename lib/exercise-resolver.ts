// lib/exercise-resolver.ts
import {
  ExerciseDataByTypeSchema,
  PtOverrideByTypeSchema,
  type Exercise,
} from "@/lib/data/zod-schemas";
import type { Variant } from "@/lib/db/schema";

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

export function resolveExerciseData(ex: Exercise, variant: Variant): ResolvedData {
  // LLM emits ptOverrides: null when there is no override; treat as none.
  const overrides = ex.ptOverrides ?? undefined;
  if (variant !== "pt" || !overrides) return ex.data as ResolvedData;

  // Validate the override against the type's strict override schema first so
  // foreign-typed fields (e.g. a chunk override on a flashcard) throw instead
  // of being silently stripped by the non-strict data schema after merge.
  const validOverride = PtOverrideByTypeSchema[ex.type].parse(overrides);
  const merged = { ...ex.data, ...validOverride };
  return ExerciseDataByTypeSchema[ex.type].parse(merged) as ResolvedData;
}

// Audio in b1.json is flat: audio[variant] = { hash, voice }.
// The `voice` param returns in Plan #4 when AudioVariantSet lands.
export function resolveAudioHash(ex: Exercise, variant: Variant): string {
  const ref = ex.audio?.[variant];
  if (!ref) throw new Error(`Exercise ${ex.id} has no audio for variant ${variant}`);
  return ref.hash;
}
