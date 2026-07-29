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
  diagnosticFile, conceptsFile, langExists, lessonsDir, cefrFile,
} from '@/lib/data/registry';
import type { DescriptorFile } from '@/lib/data/cefr';
import {
  type Block, type Concept, type Lesson,
} from '@/lib/data/curriculum-types';
import {
  type Story, type Diagnostic, StorySchema, DiagnosticSchema,
  LessonAudioRefsFileSchema,
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
 * Cuarentena de contenido, añadida el 2026-07-29.
 *
 * `variantStatus: 'needs-human'` marca un ítem que SABEMOS defectuoso:
 * la inversión de variante del 2026-07-28 le dio la vuelta al marco
 * metalingüístico (el ítem dice "no Brasil… o trem" pero ahora vive como
 * base europea), o la reparación del bloque 1 lo dejó a medias.
 *
 * Durante un día esa marca no hizo nada. Se escribía en el JSON, se
 * declaraba en el schema y se describía en los informes como "ítems
 * aparcados" — pero NINGÚN punto del runtime la leía, así que los 102
 * ítems se seguían sirviendo exactamente igual que antes. Escribir una
 * etiqueta no es filtrar; el filtro tiene que existir, y tiene que estar
 * en el embudo por el que pasa todo, que es este.
 *
 * Coste medido (pt, 2026-07-29): 102 de 2039 ítems, un 5% del corpus,
 * concentrado en b1 (35/258) y b10 (20/127).
 *
 * `divergent` y `unchecked` NO se filtran: el primero está verificado
 * como divergencia real, y el segundo sólo significa "nadie lo ha
 * mirado", que es el estado del 90% del corpus — filtrarlo dejaría la
 * app vacía.
 */
const EN_CUARENTENA = new Set(['needs-human']);

function esServible(item: unknown): boolean {
  if (typeof item !== 'object' || item === null) return true;
  const status = (item as { variantStatus?: unknown }).variantStatus;
  return typeof status !== 'string' || !EN_CUARENTENA.has(status);
}

export interface OpcionesDeCarga {
  /** Incluye los ítems en cuarentena. Sólo para scripts de auditoría y
   *  para las herramientas de revisión — nunca para servir al alumno. */
  incluirEnCuarentena?: boolean;
}

/**
 * Carga un bloque específico. Devuelve `null` si no existe. Solo acepta
 * `b{N}.json`; cualquier sidecar (`.audio-failures`, `.rejected`) se ignora.
 * Los ítems en cuarentena se excluyen salvo petición explícita.
 */
export async function loadBlock(
  lang: LanguageId,
  id: number,
  opts: OpcionesDeCarga = {},
): Promise<unknown[] | null> {
  if (!/^\d+$/.test(String(id))) return null;
  const file = path.join(blocksDir(lang), `b${id}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    const parsed = JSON.parse(raw);
    if (opts.incluirEnCuarentena || !Array.isArray(parsed)) return parsed;
    return parsed.filter(esServible);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

/**
 * Carga todos los bloques del idioma (b1..bN). Devuelve `[]` si el dir
 * no existe o está vacío. Sidecars excluidos por pattern, ítems en
 * cuarentena excluidos salvo petición explícita.
 */
export async function loadAllBlocks(
  lang: LanguageId,
  opts: OpcionesDeCarga = {},
): Promise<unknown[]> {
  const dir = blocksDir(lang);
  try {
    const files = (await fs.readdir(dir)).filter((f) => /^b\d+\.json$/.test(f));
    const all: unknown[] = [];
    for (const f of files.sort()) {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8');
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) continue;
      all.push(...(opts.incluirEnCuarentena ? arr : arr.filter(esServible)));
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

// ─── Lecturas (biblioteca karaoke, Ola L) ────────────────────────
//
// Cada lectura es un JSON con procedencia (título, autor, año de muerte,
// fuente — el gate del generador no deja entrar nada sin los cuatro) y
// los párrafos con tiempos por palabra de /with-timestamps. El audio
// vive en public/lecturas/{id}/pNNN.mp3. Fail-soft como todo lo demás:
// idioma sin lecturas → lista vacía.

export interface PalabraKaraoke { t: string; s: number; e: number }
export interface ParrafoLectura { mp3: string; texto: string; palabras: PalabraKaraoke[] }
export interface Lectura {
  id: string; titulo: string; autor: string; muerteAutor: number;
  fuente: string; fuenteUrl: string; licencia: string; nivel: string;
  notaOrtografia?: string; parrafos: ParrafoLectura[];
}

function lecturasDir(lang: LanguageId): string {
  return path.join(process.cwd(), 'lib/data/languages', lang, 'lecturas');
}

export async function loadLecturas(lang: LanguageId): Promise<Lectura[]> {
  try {
    const files = (await fs.readdir(lecturasDir(lang))).filter((f) => f.endsWith('.json'));
    const out: Lectura[] = [];
    for (const f of files.sort()) {
      out.push(JSON.parse(await fs.readFile(path.join(lecturasDir(lang), f), 'utf-8')));
    }
    return out;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

export async function loadLectura(lang: LanguageId, id: string): Promise<Lectura | null> {
  if (!/^[a-z0-9-]+$/.test(id)) return null; // defensa ?id=../../etc
  try {
    const raw = await fs.readFile(path.join(lecturasDir(lang), `${id}.json`), 'utf-8');
    return JSON.parse(raw) as Lectura;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

// ─── Eje MCER (JSON) ─────────────────────────────────────────────
//
// Descriptores can-do y TaskSpecs por idioma. Fail-soft como el resto:
// un idioma sin `cefr.json` devuelve listas vacías, no revienta — es el
// caso de checo, ruso y rumano hasta que se diseñen sus descriptores.

export async function loadCefr(lang: LanguageId): Promise<DescriptorFile> {
  const vacio: DescriptorFile = { language: lang, generatedAt: '', descriptors: [], taskSpecs: [] };
  try {
    const raw = await fs.readFile(cefrFile(lang), 'utf-8');
    return JSON.parse(raw) as DescriptorFile;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return vacio;
    throw err;
  }
}

// ─── Lesson audio-refs (per-language sidecar) ──────────────────
//
// L2 of the lessons-before-exercises plan: returns the parsed
// `lib/data/languages/{lang}/lessons/audio-refs.json` map of
// lessonId → LessonAudioRefsEntry. Missing file → `{}` (languages
// with no lesson content, or PT before audio generation, fall back
// to empty refs in the route handler).
export async function loadLessonsAudioRefs(
  lang: LanguageId,
): Promise<import('@/lib/data/zod-schemas').LessonAudioRefs> {
  const file = path.join(lessonsDir(lang), 'audio-refs.json');
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return LessonAudioRefsFileSchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw err;
  }
}

// ─── Lesson view-model (A.2 — Manual Lusitano lección page) ──
//
// Loads a lesson by chapter + section slug and assembles the flat
// "view model" the `/libro/[chapter]/[section]` page consumes.
//
// URL convention: `/[lang]/libro/{chapter}/{section}` where `chapter`
// is the blockId (1..10) and `section` is the lesson slug — the part
// after the `b{N}-l{N}-` prefix in the canonical lessonId (e.g.
// `presente-regular`). The loader matches by either:
//   1. The full canonical id `b{chapter}-l{N}-{section}` — fastest.
//   2. Any lesson in the block whose slug ends with `{section}` —
//      tolerant of an off-by-one number in the URL.
//
// Returns `null` if no lesson matches, the block id is not numeric,
// or the lang has no curriculum. The route calls notFound() on null.
export interface LessonViewModel {
  lessonId: string;
  blockId: number;
  blockName: string;
  lessonNumber: number;
  title: string;
  /** Paragraph shown first, wrapped in <DropCap>. Defaults to the
   *  lesson objectives joined; the LLM-generated prose (Plan #2)
   *  will replace this once lessons are authored. */
  firstParagraph: string;
  /** Conjugation rows for the optional paradigm table. Empty when
   *  the lesson has no paradigm. */
  conjugation: Array<{ pronoun: string; form: string }>;
  /** Second body paragraph. Defaults to a brief gloss + cue to play
   *  audio when no authored prose is available yet. */
  bodyParagraph: string;
  /** Pull-quote body + cite. */
  quoteText: string;
  quoteCite: string;
  /** Audio URLs split by canonical VariantKey (pt-br / pt-pt). The
   *  first example's audio for each variant is the surfaced URL;
   *  the audio preloader from Task 0.9 warms it. */
  audioRefs: {
    "pt-br": Array<{ url: string; hash: string; voice: string }>;
    "pt-pt": Array<{ url: string; hash: string; voice: string }>;
  };
  /** Margin notes rendered in the right column. */
  marginNotes: Array<{
    variant: "tip" | "warn" | "es" | "variant";
    label: string;
    body: string;
  }>;
  /** Editorial meta for the running head + title block. */
  conceptCount: number;
  estimatedMinutes: number;
  /** Fictional page number; pages are derived deterministically so the
   *  URL `Continua na p. N+1 →` cue stays stable across renders. */
  pageNumber: number;
  /** Path to the lesson's MDX concept notes. Used by the embedded
   *  <LessonRenderer> so the full lesson body is available below the
   *  fold even when the view model only summarizes. */
  mdxPath: string;
}

export async function loadLesson(
  lang: LanguageId,
  chapter: string,
  section: string,
): Promise<LessonViewModel | null> {
  if (!/^\d+$/.test(chapter)) return null;
  const chapterNum = Number(chapter);
  const curriculum = await loadCurriculum(lang);
  const block = curriculum.BLOCKS.find((b) => b.id === chapterNum);
  if (!block) return null;

  // Match: prefer exact canonical id, else any lesson whose slug tail
  // matches the section.
  const lessons = block.lessons;
  const exact = lessons.find((l) => l.id === `b${chapterNum}-${section}`);
  const lesson =
    exact ??
    lessons.find((l) => l.id === `b${chapterNum}-l${section}`) ??
    lessons.find((l) => {
      const tail = l.id.split('-').slice(2).join('-');
      return tail === section;
    }) ??
    lessons.find((l) => l.id.endsWith(`-${section}`));
  if (!lesson) return null;

  // Audio refs (per-variant example lists).
  const audioRefsMap = await loadLessonsAudioRefs(lang);
  const entry = audioRefsMap[lesson.id];
  const brRefs = entry?.audioRefs?.['pt-br'] ?? [];
  const ptRefs = entry?.audioRefs?.['pt-pt'] ?? [];

  // Static page number: chapters start at p.1, each lesson adds a
  // page. Stable across renders — used for the running head "p. N".
  const priorLessons = curriculum.BLOCKS
    .slice(0, chapterNum - 1)
    .reduce((acc, b) => acc + b.lessons.length, 0);
  const lessonIndexInBlock = lessons.findIndex((l) => l.id === lesson.id);
  const pageNumber = priorLessons + lessonIndexInBlock + 1;

  // Lesson number inside the block (1..N).
  const lessonNumberMatch = lesson.id.match(/-l(\d+)-/);
  const lessonNumber = lessonNumberMatch ? Number(lessonNumberMatch[1]) : lessonIndexInBlock + 1;

  return {
    lessonId: lesson.id,
    blockId: lesson.blockId,
    blockName: block.name,
    lessonNumber,
    title: entry?.title ?? lesson.name,
    firstParagraph:
      lesson.objectives[0] ??
      `Conteúdo da lição ${lesson.name} em breve — gerado pelo orquestrador.`,
    conjugation: [],
    bodyParagraph:
      "Ouça as duas variantes e note a diferença de cadência e timbre.",
    quoteText: lesson.vocabKey[0]
      ? `Exemplo com "${lesson.vocabKey[0]}"`
      : lesson.name,
    quoteCite: `Capítulo ${chapterNum} — ${block.name}`,
    audioRefs: {
      "pt-br": brRefs.map((r) => ({
        url: `/audio/${r.hash}.mp3`,
        hash: r.hash,
        voice: r.voice,
      })),
      "pt-pt": ptRefs.map((r) => ({
        url: `/audio/${r.hash}.mp3`,
        hash: r.hash,
        voice: r.voice,
      })),
    },
    marginNotes: buildMarginNotesForLesson(lesson, block),
    conceptCount: lesson.conceptIds.length,
    estimatedMinutes: Math.max(5, Math.round(lesson.vocabKey.length * 1.5)),
    pageNumber,
    mdxPath: lesson.conceptNotesPath,
  };
}

/**
 * Builds margin notes for a lesson from its curriculum metadata. The
 * notes are heuristic until Plan #2 authors explicit pedagogy: each
 * note surfaces a vocabulary contrast, an ES warning, or a BR/PT
 * variation cue — derived from the lesson's vocabKey + conceptIds.
 */
function buildMarginNotesForLesson(
  lesson: import('./curriculum-types').Lesson,
  block: import('./curriculum-types').Block,
): LessonViewModel['marginNotes'] {
  const notes: LessonViewModel['marginNotes'] = [];
  if (lesson.vocabKey.length > 0) {
    notes.push({
      variant: 'tip',
      label: 'Dica',
      body: `Foca primeiro em "${lesson.vocabKey[0]}" — é o item de maior payoff deste capítulo.`,
    });
  }
  if (lesson.conceptIds.length > 1) {
    notes.push({
      variant: 'warn',
      label: 'Cuidado',
      body: `Esta lição combina ${lesson.conceptIds.length} conceptos — repasa cada um antes de avançar.`,
    });
  }
  notes.push({
    variant: 'es',
    label: 'Contraste ES',
    body: `ES y PT comparten la raíz latina, pero la flexión y el orden pueden variar — não confies en la traducción literal.`,
  });
  if (lesson.vocabKey.length > 1) {
    notes.push({
      variant: 'variant',
      label: 'Variação BR ↔ PT',
      body: `Em "${lesson.vocabKey[0]}" pode haver diferença de cadência entre PT-BR e PT-PT — ouça as duas variantes.`,
    });
  }
  // Drop the trailing template-feeling note if the block has no
  // pedagogical content yet (lessons with empty conceptIds).
  if (lesson.conceptIds.length === 0) {
    return notes.slice(0, 1);
  }
  return notes;
}
