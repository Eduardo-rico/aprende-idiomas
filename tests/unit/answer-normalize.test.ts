import { describe, it, expect } from 'vitest';
import { normalizeAnswer } from '@/lib/exercises/normalize';

describe('normalizeAnswer', () => {
  it('trims and lowercases', () => { expect(normalizeAnswer('  Falo ')).toBe('falo'); });
  it('keeps accents significant', () => { expect(normalizeAnswer('estão')).not.toBe(normalizeAnswer('estao')); });
  it('NFC-normalizes composed vs decomposed', () => {
    expect(normalizeAnswer('ã')).toBe(normalizeAnswer('ã')); // combining vs precomposed ã
  });
});
