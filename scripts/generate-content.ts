// scripts/generate-content.ts
// Orquestador principal: por cada lección del bloque (target), por cada tipo
// activo en EXERCISES_PER_LESSON, llama al LLM con prompt-runner, valida Zod,
// computa ID derivado del contenido, y escribe lib/data/blocks/bN.json atómico.
import fs from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';
import { BLOCKS, getBlock, getConceptsByIds, ALL_CONCEPTS, type Lesson } from '@/lib/data/curriculum';
import {
  BLOCKS_DIR, LLM_CACHE, LLM_CONCURRENCY, SCHEMA_VERSION,
  EXERCISES_PER_LESSON, TYPE_TO_TEMPLATE,
  COST_USD_PER_1K_INPUT, COST_USD_PER_1K_OUTPUT,
} from './config';
import { hashKey, normalizeForHash } from './lib/cache';
import { callLlm } from './lib/minimax-llm';
import { runPromptGeneration } from './lib/prompt-runner';
import { ExerciseSchema, type ExerciseType, type Exercise } from './lib/zod-schemas';

// Adapter: prompt-runner espera `(args) => Promise<string>` pero callLlm
// retorna `{ text, inputTokens, outputTokens }`. El orchestrator no necesita
// los tokens per-call (los agregamos en el futuro), así que extraemos `text`.
const callLlmString = async (args: { system: string; user: string; maxTokens?: number }): Promise<string> => {
  const r = await callLlm({ system: args.system, user: args.user, ...(args.maxTokens ? { maxTokens: args.maxTokens } : {}) });
  return r.text;
};

// Resolves to repo root reliably — see Task 7 for why.
const PROJECT_ROOT = process.cwd();
const PROMPTS_DIR = path.join(PROJECT_ROOT, 'scripts', 'prompts');

async function loadPrompt(name: string): Promise<string> {
  return fs.readFile(path.join(PROMPTS_DIR, `${name}.md`), 'utf8');
}

interface CliArgs { block?: number; force: boolean; dryRun: boolean; }
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let block: number | undefined;
  let force = false;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--block') { block = Number(args[++i]); }
    else if (args[i] === '--force') { force = true; }
    else if (args[i] === '--dry-run') { dryRun = true; }
  }
  return { block, force, dryRun };
}

function templateVars(lesson: Lesson, blockName: string, type: ExerciseType, n: number): Record<string, string | number> {
  const concepts = getConceptsByIds(lesson.conceptIds);
  const conceptsList = concepts.map(c => `- ${c.id}: ${c.name} — ${c.description}`).join('\n');
  const vocabKey = lesson.vocabKey.join(', ');
  const base = { N: n, lessonName: lesson.name, blockName, conceptsList, vocabKey };
  if (type === 'translation_es_pt') return { ...base, direction: 'es_pt', type };
  if (type === 'translation_pt_es') return { ...base, direction: 'pt_es', type };
  return base;
}

/** ID derivado del contenido. Estable a través de regeneraciones del LLM. */
function contentId(type: ExerciseType, data: unknown, ptOverrides: unknown, esContrast: string | undefined): string {
  return hashKey({ type, data, ptOverrides, esContrast }).slice(0, 8);
}

const VALID_CONCEPT_IDS = new Set(ALL_CONCEPTS.map(c => c.id));

async function main() {
  const { block, force, dryRun } = parseArgs();
  const targets = block ? [getBlock(block)] : BLOCKS;
  const system = await loadPrompt('system');
  const limit = pLimit(LLM_CONCURRENCY);

  // Pre-cálculo para --dry-run
  let totalCalls = 0;
  for (const b of targets) {
    if (b.lessons.length === 0) continue;
    for (const lesson of b.lessons) {
      for (const [type, n] of Object.entries(EXERCISES_PER_LESSON) as [ExerciseType, number | null][]) {
        if (n === null) continue;
        totalCalls++;
      }
    }
  }
  if (dryRun) {
    // Asumimos ~2k input + ~2k output tokens por call (orden de magnitud).
    const estIn  = totalCalls * 2000;
    const estOut = totalCalls * 2000;
    const estCost = (estIn / 1000) * COST_USD_PER_1K_INPUT + (estOut / 1000) * COST_USD_PER_1K_OUTPUT;
    console.log(`[dry-run] Will make ${totalCalls} LLM calls.`);
    console.log(`[dry-run] Estimated tokens: ${estIn} in / ${estOut} out. Estimated cost: $${estCost.toFixed(2)} USD.`);
    console.log(`[dry-run] Force mode: ${force}. Exiting without changes.`);
    return;
  }

  for (const b of targets) {
    if (b.lessons.length === 0) {
      console.log(`Block ${b.id} (${b.slug}) has no lessons defined yet — skipping.`);
      continue;
    }

    const out: Exercise[] = [];
    const rejectedLog: string[] = [];
    console.log(`\n=== Block ${b.id}: ${b.name} ===`);

    const jobs: Array<() => Promise<void>> = [];

    for (const lesson of b.lessons) {
      for (const [type, n] of Object.entries(EXERCISES_PER_LESSON) as [ExerciseType, number | null][]) {
        if (n === null) continue;
        const templateName = TYPE_TO_TEMPLATE[type];
        if (!templateName) continue;

        jobs.push(() => limit(async () => {
          const template = await loadPrompt(templateName);
          const vars = templateVars(lesson, b.name, type, n);
          console.log(`  → ${lesson.id} / ${type} (n=${n})`);

          const result = await runPromptGeneration({
            cacheDir: LLM_CACHE,
            systemPrompt: system,
            template,
            vars,
            schemaVersion: SCHEMA_VERSION[type],
            lessonId: lesson.id,
            type,
            conceptIds: lesson.conceptIds,
            expectedCount: n,
            force,
            callLlm: callLlmString,
          });

          // Log rejected (low count, etc.)
          for (const r of result.rejected) {
            const msg = `${lesson.id}/${type}: ${r.reason}`;
            console.warn(`  ⚠ ${msg}`);
            rejectedLog.push(msg);
          }

          for (const item of result.accepted) {
            // Construir el Exercise. El discriminated union de Zod no permite
            // construir el objeto literal con data+ptOverrides condicionales
            // (TS no puede narrow 'type' a través de spreads). Construimos un
            // borrador tipado como ExerciseBatchItem (que SÍ tiene type+data
            // ya discriminados) y añadimos los campos comunes. La validación
            // con ExerciseSchema.safeParse inmediatamente después confirma la
            // forma final.
            const baseWithType = {
              ...item,
              id: contentId(item.type, item.data, item.ptOverrides, item.esContrast),
              blockId: b.id,
              lessonId: lesson.id,
            } as unknown as Exercise;
            baseWithType.contentHash = hashKey(normalizeForHash({
              type: baseWithType.type,
              data: baseWithType.data,
              ptOverrides: baseWithType.ptOverrides,
              esContrast: baseWithType.esContrast,
            }));
            const parsed = ExerciseSchema.safeParse(baseWithType);
            if (!parsed.success) {
              const msg = `${baseWithType.id} (${lesson.id}/${type}): ${parsed.error.issues[0]?.message ?? 'Zod fail'}`;
              console.warn(`  ⚠ ${msg}`);
              rejectedLog.push(msg);
              continue;
            }
            // Validar que concepts referenciados existan.
            for (const c of parsed.data.concepts) {
              if (!VALID_CONCEPT_IDS.has(c)) {
                const msg = `${parsed.data.id}: unknown concept id "${c}"`;
                console.warn(`  ⚠ ${msg}`);
                rejectedLog.push(msg);
                // No rechazamos el item — solo logueamos. (El set crecerá.)
              }
            }
            out.push(parsed.data);
          }
        }));
      }
    }

    await Promise.all(jobs.map(j => j()));

    // Dedup por id (content-derived).
    const seen = new Set<string>();
    const deduped = out.filter(e => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    deduped.sort((a, b) => a.id.localeCompare(b.id));

    await fs.mkdir(BLOCKS_DIR, { recursive: true });
    const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(deduped, null, 2) + '\n', 'utf8');
    await fs.rename(tmp, file); // atomic
    console.log(`Wrote ${deduped.length} exercises (rejected: ${rejectedLog.length}) → ${path.relative(process.cwd(), file)}`);
    if (rejectedLog.length > 0) {
      const logFile = path.join(BLOCKS_DIR, `b${b.id}.rejected.json`);
      await fs.writeFile(logFile, JSON.stringify(rejectedLog, null, 2));
      console.log(`  See ${path.relative(process.cwd(), logFile)} for details.`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
