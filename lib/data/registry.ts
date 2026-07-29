// lib/data/registry.ts
// Phase 2 (multi-idioma): el plano de datos de un idioma vive bajo
// `lib/data/languages/{lang}/...`. Estos helpers resuelven la ruta de cada
// artefacto de manera uniforme para que loaders, scripts y pages no
// hardcodeen paths.
//
// Cualquier consumidor que antes importaba `lib/data/...` directamente
// (curriculum.ts, blocks/b1.json, etc.) ahora recibe una función de aquí
// con `lang: LanguageId` como argumento.
import path from 'node:path';
import { promises as fs } from 'node:fs';
import type { LanguageId } from '@/lib/locales';

const LANGUAGES_ROOT = path.join(process.cwd(), 'lib', 'data', 'languages');

/** Root del plano de datos para un idioma: `lib/data/languages/{lang}/`. */
export function dataDir(lang: LanguageId): string {
  return path.join(LANGUAGES_ROOT, lang);
}

/** `lib/data/languages/{lang}/blocks/` */
export function blocksDir(lang: LanguageId): string {
  return path.join(dataDir(lang), 'blocks');
}

/** `lib/data/languages/{lang}/stories/` */
export function storiesDir(lang: LanguageId): string {
  return path.join(dataDir(lang), 'stories');
}

/** `lib/data/languages/{lang}/lessons/` */
export function lessonsDir(lang: LanguageId): string {
  return path.join(dataDir(lang), 'lessons');
}

/** `lib/data/languages/{lang}/manifest.json` */
export function manifestFile(lang: LanguageId): string {
  return path.join(dataDir(lang), 'manifest.json');
}

/** `lib/data/languages/{lang}/vocab-catalog.json` */
export function vocabCatalogFile(lang: LanguageId): string {
  return path.join(dataDir(lang), 'vocab-catalog.json');
}

/** `lib/data/languages/{lang}/diagnostic.json` */
export function diagnosticFile(lang: LanguageId): string {
  return path.join(dataDir(lang), 'diagnostic.json');
}

/** `lib/data/languages/{lang}/concepts.json` */
export function conceptsFile(lang: LanguageId): string {
  return path.join(dataDir(lang), 'concepts.json');
}

/** `lib/data/languages/{lang}/curriculum.ts` */
export function curriculumFile(lang: LanguageId): string {
  return path.join(dataDir(lang), 'curriculum.ts');
}

/** `lib/data/languages/{lang}/fallback-dictionary.ts` */
export function fallbackDictFile(lang: LanguageId): string {
  return path.join(dataDir(lang), 'fallback-dictionary.ts');
}

/** True si el directorio del idioma existe (scaffolds vacíos son válidos). */
export async function langExists(lang: LanguageId): Promise<boolean> {
  try {
    const stat = await fs.stat(dataDir(lang));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/** `lib/data/languages/{lang}/cefr.json` — descriptores can-do y TaskSpecs. */
export function cefrFile(lang: LanguageId): string {
  return path.join(dataDir(lang), 'cefr.json');
}
