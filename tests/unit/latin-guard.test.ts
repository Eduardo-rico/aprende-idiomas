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

// ── Griego (2026-09-03, Paso 0 de latín y griego) ────────────────────
//
// El guard era CIEGO al griego: U+0370-03FF y U+1F00-1FFF no estaban en
// `BLOCKED_RANGES`, así que el contenido griego pasaba por accidente y
// las otras cuatro lenguas no estaban protegidas de una fuga griega.
//
// Y la regla NO puede ser «cualquier letra griega», porque el IPA usa
// letras griegas: medido sobre el plano de datos de pt/ro/cs/ru, hay 5
// caracteres griegos en contenido generado y los 5 son IPA — χ en la
// /χ/ del manifest de PT y β en [bɨˈβidɐ] de b3.json. Un guard que los
// rechazara marcaría de más en la primera pasada y se apagaría solo.
//
// La regla que sí discrimina: el IPA aparece SUELTO entre latinas; la
// escritura griega aparece en RUNS. Medido: runs de ≥2 letras griegas en
// contenido generado de las cuatro lenguas = 0. (Los 99 runs del corpus
// están todos en `ro/lecturas/`, que es literatura del XIX citando a
// Jenofonte y al griego fanariota, y que `verify-content` no mira.)
describe('findNonLatin · griego', () => {
  it('flags a Greek WORD as bleed', () => {
    expect(findNonLatin('el término λόγος abre el evangelio')).toEqual(['λ', 'ό', 'γ', 'ο', 'ς']);
  });

  it('flags polytonic too, spirits and all', () => {
    expect(findNonLatin('μῆνιν ἄειδε').length).toBeGreaterThan(0);
  });

  it('does NOT flag isolated Greek letters used as IPA — the 5 real cases', () => {
    expect(findNonLatin('r final: /χ/')).toEqual([]);
    expect(findNonLatin('suena [bɨˈβidɐ], no [beˈbida].')).toEqual([]);
    expect(findNonLatin('la fricativa /β/ y la /χ/ del PT-PT')).toEqual([]);
  });

  it('lets Greek through when the content IS Greek', () => {
    expect(findNonLatin('λόγος', { permitirGriego: true })).toEqual([]);
    // …y sigue cazando lo demás aunque el griego esté permitido.
    expect(findNonLatin('λόγος 桥', { permitirGriego: true })).toEqual(['桥']);
  });
});
