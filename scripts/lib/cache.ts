// scripts/lib/cache.ts
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

// Normalización para hashing estable.
// 1. JSON round-trip strips undefined y convierte NaN/Infinity → null.
// 2. Strings se normalizan a NFC (forma canónica compuesta) para que
//    ediciones con NFD (forma descomuesta) no invaliden el cache silenciosamente.
// 3. Recursión para cubrir estructuras anidadas.
export function normalizeForHash(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.normalize('NFC');
  if (typeof value === 'number') {
    if (Number.isNaN(value) || !Number.isFinite(value)) return null;
    return value;
  }
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(normalizeForHash);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj).sort()) {
      const v = obj[k];
      // Strip undefined keys entirely (so {a: undefined} hashes like {}).
      if (v === undefined) continue;
      out[k] = normalizeForHash(v);
    }
    return out;
  }
  // functions, symbols → exclude
  return null;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(normalizeForHash(value));
}

export function hashKey(key: unknown): string {
  return crypto.createHash('sha256').update(stableStringify(key)).digest('hex');
}

export async function readCache<T>(dir: string, key: unknown): Promise<T | null> {
  const file = path.join(dir, `${hashKey(key)}.json`);
  try {
    const txt = await fs.readFile(file, 'utf8');
    return JSON.parse(txt) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function writeCache(dir: string, key: unknown, value: unknown): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `${hashKey(key)}.json`);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(tmp, file); // atomic on same fs
}
