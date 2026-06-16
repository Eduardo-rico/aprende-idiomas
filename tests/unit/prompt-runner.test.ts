// tests/unit/prompt-runner.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { renderTemplate, runPromptGeneration } from '@/scripts/lib/prompt-runner';

const VALID = '[{"type":"flashcard","difficulty":1,"concepts":[],"tags":[],"data":{"front":"x","back":"y"}}]';

let tmp: string;
beforeEach(async () => { tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'pr-')); });
afterEach(async () => { await fs.rm(tmp, { recursive: true, force: true }); });

describe('renderTemplate', () => {
  it('replaces {{var}} placeholders', () => {
    const out = renderTemplate('Hello {{name}}, you have {{n}} items.', { name: 'Edu', n: 5 });
    expect(out).toBe('Hello Edu, you have 5 items.');
  });

  it('throws on missing var', () => {
    expect(() => renderTemplate('x {{missing}}', {})).toThrow(/missing/);
  });
});

describe('runPromptGeneration', () => {
  it('uses cache on second call (no LLM hit)', async () => {
    const callLlm = vi.fn().mockResolvedValue(VALID);
    const params = makeParams({ cacheDir: tmp, callLlm });
    const a = await runPromptGeneration(params);
    const b = await runPromptGeneration(params);
    expect(callLlm).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
  });

  it('returns rejected-batch result on partial Zod failure, not a throw', async () => {
    // 1 valid + 1 invalid (missing required field)
    const partial = JSON.stringify([
      { type: 'flashcard', difficulty: 1, concepts: [], tags: [], data: { front: 'a', back: 'b' } },
      { type: 'flashcard', difficulty: 1, concepts: [], tags: [], data: { front: 'c' } }, // invalid
    ]);
    const callLlm = vi.fn().mockResolvedValue(partial);
    const result = await runPromptGeneration(makeParams({ cacheDir: tmp, callLlm }));
    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]?.index).toBe(1);
  });

  it('retries on extractJson failure and succeeds on second attempt', async () => {
    const callLlm = vi.fn()
      .mockResolvedValueOnce('not json at all')
      .mockResolvedValueOnce(VALID);
    const result = await runPromptGeneration(makeParams({ cacheDir: tmp, callLlm }));
    expect(callLlm).toHaveBeenCalledTimes(2);
    expect(result.accepted).toHaveLength(1);
  });

  it('does NOT retry on RefusalError', async () => {
    const refusalErr = Object.assign(new Error('LLM refused: ...'), { name: 'RefusalError' });
    const callLlm = vi.fn().mockRejectedValue(refusalErr);
    await expect(runPromptGeneration(makeParams({ cacheDir: tmp, callLlm })))
      .rejects.toThrow(/refused/);
    expect(callLlm).toHaveBeenCalledTimes(1);
  });

  it('DOES retry on TruncationError (now retriable with maxTokens bump)', async () => {
    const truncErr = Object.assign(new Error('truncated'), { name: 'TruncationError' });
    const callLlm = vi.fn().mockRejectedValue(truncErr);
    await expect(runPromptGeneration(makeParams({ cacheDir: tmp, callLlm })))
      .rejects.toThrow(/truncated/);
    expect(callLlm).toHaveBeenCalledTimes(2);
  });
});

function makeParams(over: Partial<any> = {}) {
  return {
    cacheDir: over.cacheDir,
    systemPrompt: 'sys',
    template: 'gen {{N}}',
    vars: { N: 1 },
    schemaVersion: 1,
    lessonId: 'l1',
    type: 'flashcard' as const,
    conceptIds: [],
    expectedCount: 1,
    callLlm: over.callLlm,
  };
}
