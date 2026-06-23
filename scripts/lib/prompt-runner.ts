// scripts/lib/prompt-runner.ts
import { ExerciseBatchSchema, type ExerciseBatchItem, type ExerciseType } from './zod-schemas';
import { readCache, writeCache } from './cache';
import { extractJson, TruncationError, RefusalError } from './minimax-llm';
import { findNonLatinDeep } from './latin-guard';

export function renderTemplate(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = vars[k];
    if (v === undefined) throw new Error(`Template var missing: ${k}`);
    return String(v);
  });
}

export interface PromptGenerationParams {
  cacheDir: string;
  systemPrompt: string;
  template: string;
  vars: Record<string, string | number>;
  schemaVersion: number;
  lessonId: string;
  type: ExerciseType;
  conceptIds: string[];
  /** Expected N from EXERCISES_PER_LESSON — usado para warn on partial batches. */
  expectedCount: number;
  /** When true, skip readCache but still write to cache on success. */
  force?: boolean;
  callLlm: (args: { system: string; user: string; maxTokens?: number }) => Promise<string>;
}

export interface RejectedItem {
  index: number;
  reason: string;
}

export interface BatchResult {
  accepted: ExerciseBatchItem[];
  rejected: RejectedItem[];
}

// Errores en los que NO tiene sentido reintentar (mismo prompt, misma respuesta).
// TruncationError IS retriable now: we bump maxTokens on each attempt so a
// max_tokens stop on attempt 1 has room to complete on attempt 2.
function isNonRetriable(err: unknown): boolean {
  if (err instanceof RefusalError) return true;
  if (err && typeof err === 'object' && (err as any).name === 'RefusalError') return true;
  return false;
}

// Valida cada item del batch individualmente. Items válidos van a `accepted`,
// los que fallen Zod van a `rejected` con su índice original. Esto convierte
// un batch parcialmente corrupto en progreso recuperable en lugar de un throw
// que perdería todo el lote.
function partitionByZod(raw: unknown): { accepted: ExerciseBatchItem[]; rejected: RejectedItem[] } {
  if (!Array.isArray(raw)) {
    return { accepted: [], rejected: [{ index: -1, reason: 'LLM response is not an array.' }] };
  }
  const accepted: ExerciseBatchItem[] = [];
  const rejected: RejectedItem[] = [];
  raw.forEach((item, index) => {
    const r = ExerciseBatchSchema.element.safeParse(item);
    if (!r.success) {
      const first = r.error.issues[0];
      rejected.push({
        index,
        reason: `${first?.path?.join('.') ?? ''}: ${first?.message ?? 'invalid'}`,
      });
      return;
    }
    // Anti-bleed gate: drop items with characters from other writing systems
    // (CJK/Cyrillic/…) so the highspeed model's multilingual leakage never
    // reaches disk. Treated like a Zod failure: rejected, not cached.
    const bleed = findNonLatinDeep(r.data);
    if (bleed.length > 0) {
      rejected.push({ index, reason: `non-latin bleed: ${[...new Set(bleed)].join(' ')}` });
      return;
    }
    accepted.push(r.data);
  });
  return { accepted, rejected };
}

export async function runPromptGeneration(p: PromptGenerationParams): Promise<BatchResult> {
  const user = renderTemplate(p.template, p.vars);
  const cacheKey = {
    schemaVersion: p.schemaVersion,
    lessonId: p.lessonId,
    type: p.type,
    conceptIds: [...p.conceptIds].sort(),
    user,
    system: p.systemPrompt,
  };

  if (!p.force) {
    const hit = await readCache<ExerciseBatchItem[]>(p.cacheDir, cacheKey);
    if (hit) return mergeShortage(partitionByZod(hit), p.expectedCount);
  }

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await p.callLlm({ system: p.systemPrompt, user, maxTokens: 4000 + 1000 * (attempt - 1) });
      const parsed = extractJson(raw);
      const partitioned = partitionByZod(parsed);
      // Cacheamos solo si TODO el batch parseó; si no, podríamos re-procesar
      // los rejected y ensuciar el cache con datos parciales.
      if (partitioned.rejected.length === 0) {
        await writeCache(p.cacheDir, cacheKey, partitioned.accepted);
      }
      return mergeShortage(partitioned, p.expectedCount);
    } catch (err) {
      lastErr = err;
      if (isNonRetriable(err)) throw err;
      console.warn(`[runPromptGeneration] attempt ${attempt} failed for ${p.lessonId}/${p.type}:`, (err as Error).message);
    }
  }
  throw lastErr;
}

function mergeShortage(p: { accepted: ExerciseBatchItem[]; rejected: RejectedItem[] }, expectedCount: number): BatchResult {
  const rejected = [...p.rejected];
  if (p.accepted.length < expectedCount) {
    rejected.push({
      index: -1,
      reason: `LLM returned ${p.accepted.length} items, expected ${expectedCount}.`,
    });
  }
  return { accepted: p.accepted, rejected };
}
