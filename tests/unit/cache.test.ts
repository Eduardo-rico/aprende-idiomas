import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { hashKey, readCache, writeCache, normalizeForHash } from '@/scripts/lib/cache';

describe('cache', () => {
  let tmpDir: string;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-test-'));
  });
  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('hashKey is deterministic and order-independent for objects', () => {
    const a = hashKey({ a: 1, b: 2 });
    const b = hashKey({ b: 2, a: 1 });
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it('hashKey differs when inputs differ', () => {
    expect(hashKey({ a: 1 })).not.toBe(hashKey({ a: 2 }));
  });

  it('writeCache then readCache returns same value', async () => {
    const key = { type: 'test', n: 5 };
    await writeCache(tmpDir, key, { value: 'hello' });
    const got = await readCache<{ value: string }>(tmpDir, key);
    expect(got).toEqual({ value: 'hello' });
  });

  it('readCache returns null when miss', async () => {
    const got = await readCache(tmpDir, { unseen: true });
    expect(got).toBeNull();
  });

  it('normalizeForHash strips undefined and NaN consistently', () => {
    // { a: undefined } normaliza a {} → mismo hash que {}
    expect(hashKey({ a: undefined })).toBe(hashKey({}));
    // NaN normaliza a null → mismo hash que { a: null }
    expect(hashKey({ a: NaN })).toBe(hashKey({ a: null }));
  });

  it('normalizeForHash applies NFC unicode normalization to strings', () => {
    // U+00E9 (composed) and U+0065 U+0301 (decomposed) must hash the same
    const composed = 'caf' + String.fromCharCode(0xE9);
    const decomposed = 'cafe' + String.fromCharCode(0x0301);
    expect(composed.length).not.toBe(decomposed.length);
    expect(hashKey({ word: composed })).toBe(hashKey({ word: decomposed }));
  });

  it('writeCache is atomic: no .tmp artifact left after success', async () => {
    await writeCache(tmpDir, { k: 1 }, { v: 'x' });
    const files = fs.readdirSync(tmpDir);
    expect(files.filter(f => f.endsWith('.tmp'))).toHaveLength(0);
  });
});
