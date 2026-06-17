// lib/data/loaders.ts
// Phase 2 (multi-idioma): la familia completa de loaders toma `lang`
// como argumento. Cada uno resuelve la ruta vía `lib/data/registry.ts`.
//
// Todos son async. Webpack (Turbopack) los code-splittea por idioma —
// el bundle del cliente para `/ru/...` no incluye el curriculum de PT.
//
// Sidecar files (`.audio-failures.json`, `.rejected.json`, etc.) se
// excluyen explícitamente por patrón de filename: cualquier archivo que
// no matchee `b\d+\.json` o `b\d+-s\d+-.+\.json` no se considera ejercicio
// ni historia.
import path from 'node:path';
import { promises as fs } from 'node:fs';
import type { LanguageId } from '@/lib/locales';
import {
  blocksDir, storiesDir, manifestFile, vocabCatalogFile,
  diagnosticFile, conceptsFile, langExists,
} from '@/lib/data/registry';
import {
  type Block, type Concept, type Lesson,
} from '@/lib/data/curriculum-types';
import {
  type Story, type Diagnostic, StorySchema, DiagnosticSchema,
} from '@/lib/data/zod-schemas';

// ─── Curriculum (TS module) ──────────────────────────────────────

/**
 * Carga el curriculum del idioma: `BLOCKS`, `ALL_CONCEPTS`, `getBlock`,
 * `getLesson`, `getConceptsByIds`. Para PT carga `./languages/pt/curriculum.ts`
 * (con contenido completo); para idiomas sin contenido (RU/RO/CS) retorna
 * un stub con arrays vacíos y helpers que throw (la page debe checkear
 * `BLOCKS.length === 0` antes de invocar los helpers).
 */
export interface CurriculumModule {
  BLOCKS: Block[];
  ALL_CONCEPTS: Concept[];
  getBlock(id: number): Block;
  getLesson(id: string): Lesson;
  getConceptsByIds(ids: string[]): Concept[];
}

export async function loadCurriculum(lang: LanguageId): Promise<CurriculumModule> {
  // Phase 5: el curriculum se importa del módulo por idioma (PT tiene
  // contenido real; RU/RO/CS tienen stubs vacíos pero con la misma
  // forma). Turbopack code-split el módulo por idioma — el bundle del
  // cliente para `/ru/...` no incluye el curriculum de PT.
  if (!(await langExists(lang))) {
    return emptyCurriculum();
  }
  const mod = await import(`@/lib/data/languages/${lang}/curriculum`);
  return {
    BLOCKS: mod.BLOCKS,
    ALL_CONCEPTS: mod.ALL_CONCEPTS,
    getBlock: mod.getBlock,
    getLesson: mod.getLesson,
    getConceptsByIds: mod.getConceptsByIds,
  };
}

function emptyCurriculum(): CurriculumModule {
  return {
    BLOCKS: [],
    ALL_CONCEPTS: [],
    getBlock: () => { throw new Error('No blocks for this language yet'); },
    getLesson: () => { throw new Error('No lessons for this language yet'); },
    getConceptsByIds: () => [],
  };
}

// ─── Blocks (per-block JSON files) ───────────────────────────────

/**
 * Carga un bloque específico. Devuelve `null` si no existe. Solo acepta
 * `b{N}.json`; cualquier sidecar (`.audio-failures`, `.rejected`) se ignora.
 */
export async function loadBlock(lang: LanguageId, id: number): Promise<unknown[] | null> {
  if (!/^\d+$/.test(String(id))) return null;
  const file = path.join(blocksDir(lang), `b${id}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

/**
 * Carga todos los bloques del idioma (b1..bN). Devuelve `[]` si el dir
 * no existe o está vacío. Sidecars excluidos por pattern.
 */
export async function loadAllBlocks(lang: LanguageId): Promise<unknown[]> {
  const dir = blocksDir(lang);
  try {
    const files = (await fs.readdir(dir)).filter((f) => /^b\d+\.json$/.test(f));
    const all: unknown[] = [];
    for (const f of files.sort()) {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) all.push(...arr);
    }
    return all;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

// ─── Stories (per-story JSON files) ──────────────────────────────

/**
 * Carga todas las historias del idioma, ordenadas por id. Pattern
 * `b{N}-s{N}-{slug}.json` excluye `generation-failures.json`.
 */
export async function loadAllStories(lang: LanguageId): Promise<Story[]> {
  const dir = storiesDir(lang);
  try {
    const files = (await fs.readdir(dir)).filter((f) => /^b\d+-s\d+-.+\.json$/.test(f));
    const stories = await Promise.all(
      files.map(async (f) => {
        const raw = await fs.readFile(path.join(dir, f), 'utf-8');
        return StorySchema.parse(JSON.parse(raw));
      })
    );
    return stories.sort((a, b) => a.id.localeCompare(b.id));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

/**
 * Carga una historia por id. Devuelve `null` si no existe o el id no
 * matchea el pattern (defensa contra `?id=../etc/passwd`).
 */
export async function loadStory(lang: LanguageId, id: string): Promise<Story | null> {
  if (!/^b\d+-s\d+-.+$/.test(id)) return null;
  const file = path.join(storiesDir(lang), `${id}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return StorySchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

// ─── Diagnostic ──────────────────────────────────────────────────

/**
 * Devuelve el set de preguntas de diagnóstico, o `null` si el idioma
 * no tiene (los scaffolds RU/RO/CS retornan `null` → la page renderiza
 * "diagnóstico no disponible").
 */
export async function loadDiagnostic(lang: LanguageId): Promise<Diagnostic | null> {
  try {
    const raw = await fs.readFile(diagnosticFile(lang), 'utf-8');
    return DiagnosticSchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

// ─── Vocab catalog (catalog-server) ──────────────────────────────

export async function loadVocabCatalog(lang: LanguageId): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(vocabCatalogFile(lang), 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

// ─── Fallback dictionary (TS module) ─────────────────────────────

/**
 * Carga el fallback dictionary. Para PT carga el módulo real; para
 * scaffolds vacíos (RU/RO/CS) retorna `{}`. Esto permite que el
 * `/api/vocab/lookup` retorne `null` en vez de tirar error.
 */
export async function loadFallbackDict(lang: LanguageId): Promise<Record<string, string>> {
  // Phase 5: el fallback dict se importa del módulo por idioma. Los
  // scaffolds RU/RO/CS exportan `{}`; el import no se hace si el
  // directorio no existe (idiomas no scaffolded → fallback `{}`).
  if (!(await langExists(lang))) return {};
  const mod = await import(`@/lib/data/languages/${lang}/fallback-dictionary`);
  return (mod.FALLBACK_DICTIONARY ?? {}) as Record<string, string>;
}

// ─── Manifest (per-language) ─────────────────────────────────────

/**
 * Carga el manifest. Devuelve un manifest vacío si el idioma no tiene
 * (scaffolds RU/RO/CS). El shape es `Record<string, unknown>` — los
 * consumidores hacen narrow con `?.` o `?? {}` en cada campo.
 */
export async function loadManifest(lang: LanguageId): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(manifestFile(lang), 'utf-8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw err;
  }
}

// ─── Concepts (JSON) ─────────────────────────────────────────────

export async function loadConcepts(lang: LanguageId): Promise<Concept[]> {
  try {
    const raw = await fs.readFile(conceptsFile(lang), 'utf-8');
    return JSON.parse(raw) as Concept[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}
