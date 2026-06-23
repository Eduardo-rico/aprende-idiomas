// tests/unit/latin-guard.test.ts
import { describe, it, expect } from 'vitest';
import { findNonLatin, assertLatinScript } from '@/scripts/lib/latin-guard';

describe('findNonLatin', () => {
  it('accepts plain Portuguese/Spanish with accents and ç', () => {
    expect(findNonLatin('Eu não comprei pão; a irmã está à espera.')).toEqual([]);
    expect(findNonLatin('La canción del corazón habla de amor.')).toEqual([]);
  });

  it('accepts pedagogical punctuation: arrows, IPA, quotes, dashes', () => {
    expect(findNonLatin("'mañana' → 'manhã'")).toEqual([]);
    expect(findNonLatin('Portugal lo convierte en /ʃ/, parecido a "sh".')).toEqual([]);
    expect(findNonLatin('—un guion— y «comillas» y … puntos')).toEqual([]);
  });

  it('flags Chinese characters', () => {
    expect(findNonLatin('funcionar como桥梁 entre')).toEqual(['桥', '梁']);
    expect(findNonLatin('de砖om concreto')).toEqual(['砖']);
  });

  it('flags Cyrillic characters', () => {
    expect(findNonLatin('puede сказаться de forma')).toEqual(['с', 'к', 'а', 'з', 'а', 'т', 'ь', 'с', 'я']);
    expect(findNonLatin('romances интересantes')).toContain('и');
  });

  it('dedupes is not done — returns each offending occurrence in order', () => {
    expect(findNonLatin('a桥b桥c')).toEqual(['桥', '桥']);
  });
});

describe('assertLatinScript', () => {
  it('does not throw on clean text', () => {
    expect(() => assertLatinScript('Eu falo português.', 'ex')).not.toThrow();
  });

  it('throws on bleed, naming the label and the offending chars', () => {
    expect(() => assertLatinScript('região as регион', 'b5/front')).toThrow(/b5\/front/);
    expect(() => assertLatinScript('de砖', 'x')).toThrow(/砖/);
  });
});
