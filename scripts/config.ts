// scripts/config.ts
import path from 'node:path';
import type { ExerciseType } from './lib/zod-schemas';

// Resolves project root reliably under both ESM and tsx (which breaks __dirname).
// Always run scripts via `bash scripts/with-env.sh tsx ...` from project root.
export const PROJECT_ROOT = process.cwd();

export const CACHE_DIR  = path.join(PROJECT_ROOT, 'scripts', '.cache');
export const LLM_CACHE  = path.join(CACHE_DIR, 'llm');
export const TTS_OUTPUT = path.join(PROJECT_ROOT, 'public', 'audio');
export const DATA_DIR   = path.join(PROJECT_ROOT, 'lib', 'data');
export const BLOCKS_DIR = path.join(DATA_DIR, 'blocks');

export const LLM_MODEL = process.env.MINIMAX_LLM_MODEL ?? 'MiniMax-M2.5-highspeed';
export const TTS_MODEL = process.env.MINIMAX_TTS_MODEL ?? 'speech-2.8-hd';

export const LLM_BASE_URL = 'https://api.minimax.io/anthropic';
export const TTS_URL      = 'https://api.minimax.io/v1/t2a_v2';

// Concurrency
export const LLM_CONCURRENCY = 8;
export const TTS_CONCURRENCY = 4;

// Voices — placeholders, confirmed via /v1/get_voice in Task 19.
// Each variant has a female + male voice. Default to female unless overridden.
export const VOICES: Record<'br' | 'pt', Record<'f' | 'm', string>> = {
  br: { f: 'Portuguese_Brazil_FemaleA', m: 'Portuguese_Brazil_MaleA' },
  pt: { f: 'Portuguese_Portugal_FemaleA', m: 'Portuguese_Portugal_MaleA' },
};

export const DEFAULT_VOICE: 'f' | 'm' = 'f';

// Mapping de ExerciseType → cuántos pedir al LLM por lección.
// Tipeado contra ExerciseType para que TS atrape typos. `null` = tipo diferido a Plan #2.
// Iteración de ExerciseType tipada exhaustivamente; añadir un tipo nuevo sin entrada → error.
export const EXERCISES_PER_LESSON: Record<ExerciseType, number | null> = {
  flashcard: 15,
  fill_blank: 10,
  listening: 5,
  translation_es_pt: 8,
  translation_pt_es: 8,
  verb_preposition: 5,
  sentence_construction: null, // diferido a Plan #2
  chunk: null,                 // diferido a Plan #2
};

// Mapping de ExerciseType → nombre de archivo de prompt. `null` = no generar.
export const TYPE_TO_TEMPLATE: Record<ExerciseType, string | null> = {
  flashcard: 'flashcard',
  fill_blank: 'fill_blank',
  listening: 'listening',
  translation_es_pt: 'translation',
  translation_pt_es: 'translation',
  verb_preposition: 'verb_preposition',
  sentence_construction: null,
  chunk: null,
};

// Costo estimado (USD) por 1k tokens para el modelo LLM actual.
// Usado por --dry-run para imprimir "Will cost ~$X".
export const COST_USD_PER_1K_INPUT  = 0.0002; // placeholder; calibrar con billing real
export const COST_USD_PER_1K_OUTPUT = 0.0006;

// SCHEMA_VERSION por tipo de exercise. Bumpear un tipo invalida SOLO su cache.
// (Una bump global es unsafe: cambios reales son por-tipo.)
export const SCHEMA_VERSION: Record<ExerciseType, number> = {
  flashcard: 1,
  fill_blank: 1,
  listening: 1,
  translation_es_pt: 1,
  translation_pt_es: 1,
  verb_preposition: 1,
  sentence_construction: 1,
  chunk: 1,
};

export function requireApiKey(): string {
  const key = process.env.MINIMAX_API_KEY;
  if (!key) {
    throw new Error(
      'MINIMAX_API_KEY is not set. ' +
      'Add it to .env.local and run scripts via `bash scripts/with-env.sh tsx ...`'
    );
  }
  return key;
}
