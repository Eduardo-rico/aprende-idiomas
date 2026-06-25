// scripts/lib/staged-validate.ts
// Pure validators + id assignment for the 5b mass-content merge. Reuses the
// EXISTING pipeline hashing (hashKey) so generated ids/contentHashes are
// byte-identical to scripts/generate-content.ts (no churn on re-runs).
import { hashKey, normalizeForHash } from './cache';

export interface StagedItem {
  type: string;
  data: unknown;
  variantOverrides?: unknown;
  esContrast?: string;
  [k: string]: unknown;
}

/** Same as scripts/generate-content.ts:contentId — hashKey of the canonical
 *  {type,data,variantOverrides,esContrast}, first 8 hex chars. */
export function contentId(type: string, data: unknown, variantOverrides: unknown, esContrast: unknown): string {
  return hashKey({ type, data, variantOverrides, esContrast }).slice(0, 8);
}

/** Full content hash (matches generate-content.ts: hashKey(normalizeForHash(...))). */
export function contentHash(type: string, data: unknown, variantOverrides: unknown, esContrast: unknown): string {
  return hashKey(normalizeForHash({ type, data, variantOverrides, esContrast }));
}

/** Structural integrity checks for the new 5a types (E10). Returns a list of
 *  problem strings; empty = clean. */
export function validateNewType(ex: { type: string; data: any }): string[] {
  const out: string[] = [];
  if (ex.type === 'multiple_choice') {
    const o: unknown[] = ex.data?.options ?? [];
    if (new Set(o).size !== o.length) out.push('duplicate options');
    if (typeof ex.data?.correctIndex !== 'number' || ex.data.correctIndex < 0 || ex.data.correctIndex >= o.length) {
      out.push('correctIndex out of range');
    }
  }
  if (ex.type === 'matching') {
    const rights = (ex.data?.pairs ?? []).map((p: any) => p.right);
    if (new Set(rights).size !== rights.length) out.push('ambiguous matching (duplicate right values)');
  }
  if (ex.type === 'error_correction') {
    if (ex.data?.sentence === ex.data?.correct) out.push('sentence equals correct');
  }
  return out;
}

/** Assigns content-addressed ids; any id already present (in existingIds or
 *  earlier in the batch) is a collision, reported — never silently dropped. */
export function assignIds(
  items: StagedItem[],
  existingIds: Set<string>,
): { withIds: (StagedItem & { id: string })[]; collisions: string[] } {
  const seen = new Set(existingIds);
  const withIds: (StagedItem & { id: string })[] = [];
  const collisions: string[] = [];
  for (const it of items) {
    const id = contentId(it.type, it.data, it.variantOverrides, it.esContrast);
    if (seen.has(id)) { collisions.push(id); continue; }
    seen.add(id);
    withIds.push({ ...it, id });
  }
  return { withIds, collisions };
}
