// scripts/propose-lessons.ts
// Genera la estructura de lecciones (Lesson[]) para un bloque usando el LLM.
// A diferencia de generate-content.ts (que produce ejercicios), este script
// propone el esqueleto pedagógico: qué lecciones componen el bloque, qué
// objetivos tiene cada una, qué conceptos cubre, y qué vocab pre-teaching
// se debe usar.
//
// Salida: lib/data/lessons/bN.json (atomic write). El script es idempotente:
// re-ejecutar sobreescribe (con --force) o se salta si ya hay lecciones.
//
// Reutiliza: readCache/writeCache de lib/cache, renderTemplate de
// lib/prompt-runner, LLM_CACHE de config, y LessonListSchema de zod-schemas.
//
// Uso:
//   bash scripts/with-env.sh tsx scripts/propose-lessons.ts --block=2
//   bash scripts/with-env.sh tsx scripts/propose-lessons.ts --block=2,3,4 --force
import fs from 'node:fs/promises';
import path from 'node:path';
import { dataDir } from '@/lib/data/registry';
import { ALL_CONCEPTS, getBlock } from '@/lib/data/languages/pt/curriculum';
import { LessonListSchema } from './lib/zod-schemas';
import { callLlm, extractJson } from './lib/minimax-llm';
import { readCache, writeCache } from './lib/cache';
import { LLM_CACHE, PROJECT_ROOT } from './config';
import { parseLangArgs, noopForLang } from './lib/cli';

// Bump cuando cambia el schema de LessonListSchema o el formato del prompt.
const PROPOSE_SCHEMA_VERSION = 1;

// Resolved at runtime inside main() from parseLangArgs().
let LESSONS_DIR  = '';
let STORIES_DIR  = '';
const PROMPTS_DIR  = path.join(PROJECT_ROOT, 'scripts', 'prompts');
const HANDBOOK_DIR = path.join(PROJECT_ROOT, 'scripts', 'data');

// ─── Per-block target lesson count (rango orientativo, no contrato estricto) ─
// El plan ajustó 31 lecciones para 9 bloques (B9 freeDrill no genera lecciones).
// El LLM puede proponer 2-6 lecciones por bloque; este número es el ideal.
const TARGET_LESSON_COUNT: Record<number, number> = {
  2: 4,
  3: 4,
  4: 5,
  5: 4,
  6: 5,
  7: 3,
  8: 4,
  10: 2,
};

// ─── CLI ─────────────────────────────────────────────────────────
interface CliArgs { blocks: number[]; force: boolean; }
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const blocks: number[] = [];
  let force = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--block' && args[i + 1] !== undefined) {
      const ns = args[++i]!.split(',').map(s => Number(s.trim()));
      for (const n of ns) {
        if (!Number.isNaN(n) && n >= 1 && n <= 10) blocks.push(n);
      }
    } else if (a === '--force') {
      force = true;
    } else if (a !== undefined && a.startsWith('--block=')) {
      const ns = a.slice('--block='.length).split(',').map(s => Number(s.trim()));
      for (const n of ns) {
        if (!Number.isNaN(n) && n >= 1 && n <= 10) blocks.push(n);
      }
    }
  }
  return { blocks, force };
}

// ─── Vocab anchor gathering ──────────────────────────────────────
interface VocabAnchors {
  words: string[];
  source: 'stories' | 'b8-handbook' | 'none';
}

async function gatherVocabAnchors(blockId: number): Promise<VocabAnchors> {
  let files: string[] = [];
  try {
    files = await fs.readdir(STORIES_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }
  const blockFiles = files.filter(f => new RegExp(`^b${blockId}-s\\d+-.+\\.json$`).test(f));
  if (blockFiles.length === 0) {
    if (blockId === 8) {
      const handbook = JSON.parse(
        await fs.readFile(path.join(HANDBOOK_DIR, 'b8-vocab-anchors.json'), 'utf-8')
      ) as { words: string[] };
      return { words: handbook.words, source: 'b8-handbook' };
    }
    return { words: [], source: 'none' };
  }
  const words = new Set<string>();
  for (const f of blockFiles) {
    try {
      const raw = JSON.parse(await fs.readFile(path.join(STORIES_DIR, f), 'utf-8'));
      for (const v of (raw as { vocab?: Array<{ word: string }> }).vocab ?? []) {
        words.add(v.word);
      }
    } catch (err) {
      console.warn(`  ! could not read ${f}: ${(err as Error).message}`);
    }
  }
  return { words: [...words], source: 'stories' };
}

// ─── Prompt loading ─────────────────────────────────────────────
async function loadPrompt(name: string): Promise<string> {
  return fs.readFile(path.join(PROMPTS_DIR, `${name}.md`), 'utf-8');
}

// ─── Per-block runner ───────────────────────────────────────────
interface ProposeResult { written: boolean; reason: string; }

async function proposeLessonsForBlock(blockId: number, force: boolean): Promise<ProposeResult> {
  const block = getBlock(blockId);
  const concepts = ALL_CONCEPTS.filter(c => c.blockId === blockId);
  if (concepts.length === 0) {
    return { written: false, reason: `block ${blockId} has no Concept[] (B9 freeDrill is skipped)` };
  }

  const targetFile = path.join(LESSONS_DIR, `b${blockId}.json`);
  if (!force) {
    try {
      const existing = JSON.parse(await fs.readFile(targetFile, 'utf-8')) as unknown[];
      if (Array.isArray(existing) && existing.length > 0) {
        return { written: false, reason: `b${blockId}.json already has ${existing.length} lessons (pass --force to overwrite)` };
      }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
      // ENOENT → continue and write fresh
    }
  }

  const anchors = await gatherVocabAnchors(blockId);
  const targetCount = TARGET_LESSON_COUNT[blockId] ?? 4;
  const system = await loadPrompt('system');
  const template = await loadPrompt('propose-lessons');
  const user = renderTemplate(template, {
    blockId,
    blockName: block.name,
    blockDescription: block.description,
    conceptList: concepts.map(c => `- ${c.id}: ${c.name} — ${c.description}`).join('\n'),
    vocabAnchors: anchors.words.length > 0
      ? anchors.words.slice(0, 30).join(', ')
      : '(no anchor vocab available — propose high-frequency CEFR-B2 words that illustrate the lesson concepts)',
    anchorSource: anchors.source,
    targetLessonCount: targetCount,
  });

  // Cache key (different namespace from content generation).
  const cacheKey = { schemaVersion: PROPOSE_SCHEMA_VERSION, blockId, user, system };

  let llmText: string | null = null;
  if (!force) {
    llmText = await readCache<string>(LLM_CACHE, cacheKey);
    if (llmText) console.log(`  ↳ LLM cache hit`);
  }

  const MAX_ATTEMPTS = 3;
  let parsedLessons: unknown = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (!llmText) {
      const result = await callLlm({
        system,
        user,
        maxTokens: 4000,
        ...(attempt > 1 ? { temperature: 0.9 } : {}),
      });
      llmText = result.text;
    }
    try {
      const json = extractJson(llmText);
      const r = LessonListSchema.safeParse(json);
      if (!r.success) {
        throw new Error('Zod: ' + r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
      }
      parsedLessons = r.data;
      await writeCache(LLM_CACHE, cacheKey, llmText); // cache only after validation
      break;
    } catch (err) {
      console.warn(`  ⚠ attempt ${attempt}/${MAX_ATTEMPTS} for b${blockId}: ${err instanceof Error ? err.message : String(err)}`);
      llmText = null;
      if (attempt === MAX_ATTEMPTS) throw err;
    }
  }

  if (!parsedLessons) throw new Error(`BUG: parsedLessons is undefined after retry for b${blockId}`);
  const lessons = parsedLessons as Array<{ conceptIds: string[]; id: string; blockId: number }>;

  // ─── Post-LLM validations ─────────────────────────────────────
  const issues: string[] = [];
  if (lessons.length < 2 || lessons.length > 6) {
    issues.push(`lesson count ${lessons.length} out of range [2, 6] (target was ${targetCount})`);
  }
  const coveredIds = new Set(lessons.flatMap(l => l.conceptIds));
  for (const c of concepts) {
    if (!coveredIds.has(c.id)) {
      issues.push(`concept ${c.id} (${c.name}) is not covered by any lesson`);
    }
  }
  for (const cid of coveredIds) {
    if (!concepts.find(c => c.id === cid)) {
      issues.push(`lesson references unknown concept id "${cid}" (not in B${blockId} concepts)`);
    }
  }
  // IDs must be unique within a block
  const idSet = new Set(lessons.map(l => l.id));
  if (idSet.size !== lessons.length) {
    issues.push(`duplicate lesson ids in proposed batch`);
  }
  // blockId consistency
  for (const l of lessons) {
    if (l.blockId !== blockId) {
      issues.push(`lesson ${l.id} has blockId ${l.blockId} (expected ${blockId})`);
    }
  }
  if (issues.length > 0) {
    throw new Error(`Validation failed for b${blockId}:\n  - ${issues.join('\n  - ')}`);
  }

  // ─── Atomic write ──────────────────────────────────────────────
  await fs.mkdir(LESSONS_DIR, { recursive: true });
  const tmp = `${targetFile}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(lessons, null, 2) + '\n', 'utf-8');
  await fs.rename(tmp, targetFile);
  console.log(`✓ wrote ${lessons.length} lessons to ${path.relative(PROJECT_ROOT, targetFile)}`);
  return { written: true, reason: 'ok' };
}

// ─── Inline renderTemplate (mirrors lib/prompt-runner.renderTemplate) ────────
function renderTemplate(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = vars[k];
    if (v === undefined) throw new Error(`Template var missing: ${k}`);
    return String(v);
  });
}

// ─── Main ───────────────────────────────────────────────────────
async function main() {
  const { lang } = parseLangArgs();
  // Phase 5: solo PT tiene curriculum con Concept[]; scaffolds vacíos
  // no pueden proponer lecciones.
  if (lang !== 'pt') {
    console.log(noopForLang(lang, 'propose-lessons'));
    return;
  }
  LESSONS_DIR = path.join(dataDir(lang), 'lessons');
  STORIES_DIR = path.join(dataDir(lang), 'stories');

  const { blocks, force } = parseArgs();
  const targets = blocks.length > 0
    ? [...new Set(blocks)].sort((a, b) => a - b)
    : Object.keys(TARGET_LESSON_COUNT).map(Number).sort((a, b) => a - b);

  if (targets.length === 0) {
    console.error('No valid blocks in --block. Use --block=2,3 (range 1-10).');
    process.exit(1);
  }

  const failures: Array<{ blockId: number; error: string }> = [];
  for (const id of targets) {
    console.log(`\n=== Proposing lessons for block ${id} ===`);
    try {
      const r = await proposeLessonsForBlock(id, force);
      if (!r.written) console.log(`  → skipped: ${r.reason}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ failed b${id}: ${msg}`);
      failures.push({ blockId: id, error: msg });
    }
  }

  // Glossary coverage check
  try {
    const { glossarySchema } = await import("../lib/data/languages/pt/glossary-schema.js");
    const glossaryData = (await import("../lib/data/languages/pt/glossary.json", { assert: { type: "json" } })).default;
    glossarySchema.parse(glossaryData); // validate schema
    const glossaryWords = new Set(glossaryData.map((e: { word: string }) => e.word));

    // collect all vocab words from all proposed lessons
    const proposedWords = new Set<string>();
    for (const id of targets) {
      const lessonFile = path.join(LESSONS_DIR, `b${id}.json`);
      try {
        const lessons = JSON.parse(await fs.readFile(lessonFile, 'utf-8')) as Array<{ vocab?: Array<{ word: string }> }>;
        for (const lesson of lessons) {
          for (const vocab of lesson.vocab ?? []) {
            proposedWords.add(vocab.word);
          }
        }
      } catch {
        // file may not exist if block was skipped or failed
      }
    }

    const missing = [...proposedWords].filter((w: string) => !glossaryWords.has(w));
    if (missing.length > 0) {
      console.warn(`\n[propose-lessons] ⚠️  ${missing.length} vocab words sin glossary entry:`, missing.slice(0, 8));
    } else if (proposedWords.size > 0) {
      console.log(`\n[propose-lessons] ✓ all vocab words covered in glossary (${proposedWords.size} total)`);
    }
  } catch {
    // glossary not yet created — skip silently
  }

  if (failures.length > 0) {
    const failFile = path.join(LESSONS_DIR, 'generation-failures.json');
    await fs.mkdir(LESSONS_DIR, { recursive: true });
    await fs.writeFile(failFile, JSON.stringify(failures, null, 2) + '\n', 'utf-8');
    process.stderr.write(
      `\n${failures.length} block(s) failed to propose lessons:\n` +
      failures.map(f => `  - b${f.blockId}: ${f.error}`).join('\n') + '\n'
    );
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
