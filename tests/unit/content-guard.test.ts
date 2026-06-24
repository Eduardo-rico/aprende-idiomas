import { describe, it, expect } from 'vitest';
import { findEnglishWords, blankCountMismatch } from '@/scripts/lib/content-guard';

describe('findEnglishWords', () => {
  it('flags stray English words', () => {
    expect(findEnglishWords('Eu the dei o livro')).toContain('the');
    expect(findEnglishWords('Ela gave os contactos')).toContain('gave');
  });
  it('does not flag Portuguese/Spanish', () => {
    expect(findEnglishWords('Eu tenho um livro e ela tem dois')).toEqual([]);
    expect(findEnglishWords('La canción es muy bonita')).toEqual([]);
  });
  it('does not flag Spanish "has" (tú has)', () => {
    expect(findEnglishWords('Tú has comido demasiado')).toEqual([]);
  });
});

describe('blankCountMismatch', () => {
  it('flags a fill_blank whose blanks length != number of ___ in sentence', () => {
    const ex = { type: 'fill_blank', data: { sentence: 'eu ___ lembrar ___ daquela', blanks: [{ answer: 'me' }] } } as any;
    expect(blankCountMismatch(ex)).toBe(true);
  });
  it('passes a well-formed fill_blank', () => {
    const ex = { type: 'fill_blank', data: { sentence: 'eu ___ daquela', blanks: [{ answer: 'gosto' }] } } as any;
    expect(blankCountMismatch(ex)).toBe(false);
  });
});
