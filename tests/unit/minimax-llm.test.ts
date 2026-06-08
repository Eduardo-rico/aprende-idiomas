// tests/unit/minimax-llm.test.ts
import { describe, it, expect } from 'vitest';
import { extractJson } from '@/scripts/lib/minimax-llm';

describe('extractJson', () => {
  it('parses bare JSON', () => {
    expect(extractJson('[{"a":1}]')).toEqual([{ a: 1 }]);
  });

  it('strips leading and trailing markdown fences', () => {
    expect(extractJson('```json\n[{"a":1}]\n```')).toEqual([{ a: 1 }]);
  });

  it('finds the JSON array even with leading prose', () => {
    expect(extractJson('Sure, here are the items: [{"a":1}]')).toEqual([{ a: 1 }]);
  });

  it('finds the JSON object even with surrounding text', () => {
    expect(extractJson('Result: {"x":1} done.')).toEqual({ x: 1 });
  });

  it('repairs trailing commas in arrays', () => {
    expect(extractJson('[{"a":1},{"b":2},]')).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it('repairs trailing commas in objects', () => {
    expect(extractJson('{"a":1,"b":2,}')).toEqual({ a: 1, b: 2 });
  });

  it('throws on no JSON found', () => {
    expect(() => extractJson('No json here at all')).toThrow(/No JSON found/);
  });

  it('throws on truly unparseable JSON (after repair)', () => {
    expect(() => extractJson('[{"a": ')).toThrow();
  });
});
