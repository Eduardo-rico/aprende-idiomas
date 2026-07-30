// scripts/config.ts
import path from 'node:path';
import { dataDir, blocksDir, storiesDir } from '@/lib/data/registry';
import { LANGUAGES, type LanguageId } from '@/lib/locales';
import type { ExerciseType } from './lib/zod-schemas';

// Resolves project root reliably under both ESM and tsx (which breaks __dirname).
// Always run scripts via `bash scripts/with-env.sh tsx ...` from project root.
export const PROJECT_ROOT = process.cwd();

export const CACHE_DIR  = path.join(PROJECT_ROOT, 'scripts', '.cache');
export const LLM_CACHE  = path.join(CACHE_DIR, 'llm');
export const TTS_OUTPUT = path.join(PROJECT_ROOT, 'public', 'audio');

// Phase 2 (multi-idioma): los scripts leen/escriben el plano de datos del
// idioma activo. Por compatibilidad con el flujo pre-Phase-2, el default es
// "pt". Phase 5: cada script toma `--lang=<id>` (ver `scripts/lib/cli.ts`)
// y los shorthands aquí siguen resolviendo a PT (default) para que el
// código PT-only (tests, `scripts-data-paths.test.ts`) compile sin
// necesidad de recibir un lang.
export const DEFAULT_LANG: LanguageId = 'pt';
export const DATA_DIR   = dataDir(DEFAULT_LANG);
export const BLOCKS_DIR = blocksDir(DEFAULT_LANG);
export const STORIES_DIR = storiesDir(DEFAULT_LANG);

/** L5: directory where lesson MDX files live. The path mirrors the
 *  `conceptNotesPath` convention — e.g. lesson `b1-l1-alfabeto-acentos`
 *  with `conceptNotesPath="b1/l1-alfabeto-acentos.mdx"` resolves to
 *  `lib/data/languages/pt/mdx/b1/l1-alfabeto-acentos.mdx`. The audio-refs
 *  sidecar lives next to the lesson JSON, not here. */
export function lessonMdxDir(lang: LanguageId = DEFAULT_LANG): string {
  return path.join(dataDir(lang), 'mdx');
}

export const LLM_MODEL = process.env.MINIMAX_LLM_MODEL ?? 'MiniMax-M3';
export const TTS_MODEL = process.env.MINIMAX_TTS_MODEL ?? 'speech-2.8-hd';

export const LLM_BASE_URL = 'https://api.minimax.io/anthropic';
export const TTS_URL      = 'https://api.minimax.io/v1/t2a_v2';

// Concurrency
export const LLM_CONCURRENCY = 8;
export const TTS_CONCURRENCY = 1; // MiniMax RPM rate-limit; secuencial evita 1002
export const TTS_DELAY_MS = 1500;   // 1.5s entre requests = 40 RPM, debajo del límite

// Voices — placeholders, confirmed via /v1/get_voice in Task 19.
// Each variant has a female + male voice. Default to female unless overridden.
// Phase 1 (multi-idioma): las claves son VariantKey (string libre). Por
// ahora solo PT-BR y PT-PT tienen voces dedicadas; los scaffolds RU/RO/CS
// usan string vacío (no se generan audios para esos idiomas todavía).
export const VOICES: Record<string, Record<'f' | 'm', string>> = {
  // BR: voces cálidas, ritmo brasileiro (Sentimental Lady, Jovial Man).
  // PT: voces más reservadas, ritmo peninsular (Wise Lady, Narrator).
  // El language_boost NO diferencia BR/PT en MiniMax; la diferencia se hace
  // eligiendo voces con cadencia más animada vs más formal.
  'pt-br': {
    f: 'Portuguese_SentimentalLady',
    m: 'Portuguese_JovialMan',
  },
  'pt-pt': {
    f: 'Portuguese_Wiselady',
    m: 'Portuguese_Narrator',
  },
} as const;

export const DEFAULT_VOICE: 'f' | 'm' = 'f';

// Phase 5 (multi-idioma): `language_boost` de MiniMax es un enum estricto.
// PT usa "Portuguese"; los scaffolds RU/RO/CS aún sin idioma declarado
// por MiniMax usan string vacío (el script no llama MiniMax para esos
// idiomas — es un no-op a nivel script). Mantener el record cerrado contra
// `LanguageId` para que un idioma nuevo falle en typecheck hasta que
// alguien le asigne un boost (o lo deje vacío a propósito).
export const LANGUAGE_BOOST: Record<LanguageId, string> = {
  pt: 'Portuguese',
  ru: '',
  ro: '',
  cs: '',
};

// Re-exponer LANGUAGES para que callers no tengan que importar de
// `lib/locales` solo para iterar idiomas.
export { LANGUAGES };

// Mapping de ExerciseType → cuántos pedir al LLM por lección.
// Tipeado contra ExerciseType para que TS atrape typos. `null` = tipo diferido a Plan #2.
// Iteración de ExerciseType tipada exhaustivamente; añadir un tipo nuevo sin entrada → error.
// Phase 1: `translation_es_pt` y `translation_pt_es` colapsan a un único
// `translation`. El prompt de generación se elige en `generate-content.ts`
// según `sourceLang`/`targetLang` del item; aquí solo decimos cuántos pedir.
export const EXERCISES_PER_LESSON: Record<ExerciseType, number | null> = {
  flashcard: 15,
  fill_blank: 10,
  listening: 5,
  translation: 8,
  verb_preposition: 5,
  sentence_construction: null, // diferido a Plan #2
  chunk: null,                 // diferido a Plan #2
  lesson: 1,                   // 1 lesson step por lección (L1)
  // Plan 5a: tipos nuevos sin template aún; Plan 5b define el target real.
  error_correction: null,
  conjugation: null,
  matching: null,
  multiple_choice: null,
  shadowing: null,
  // Ola B2C2-PT: se generan por su propio pipeline (con doble
  // adversarial), no por este generador — null a propósito.
  grammaticality_judgment: null,
  mediation: null,
};

// Mapping de ExerciseType → nombre de archivo de prompt. `null` = no generar.
export const TYPE_TO_TEMPLATE: Record<ExerciseType, string | null> = {
  flashcard: 'flashcard',
  fill_blank: 'fill_blank',
  listening: 'listening',
  translation: 'translation',
  verb_preposition: 'verb_preposition',
  sentence_construction: null,
  chunk: null,
  lesson: null,                // no se genera por LLM; el MDX es el contenido
  // Plan 5a: sin prompt templates aún (los añade Plan 5b).
  error_correction: null,
  conjugation: null,
  matching: null,
  multiple_choice: null,
  shadowing: null,
  grammaticality_judgment: null,
  mediation: null,
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
  translation: 1,
  verb_preposition: 1,
  sentence_construction: 1,
  chunk: 1,
  lesson: 1,
  error_correction: 1,
  conjugation: 1,
  matching: 1,
  multiple_choice: 1,
  shadowing: 1,
  grammaticality_judgment: 1,
  mediation: 1,
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
