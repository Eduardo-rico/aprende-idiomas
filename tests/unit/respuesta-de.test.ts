// tests/unit/respuesta-de.test.ts — la respuesta de CADA tipo.
//
// Escrito EN ROJO antes de que `respuestaDe` existiera, y con un caso por
// cada uno de los trece tipos del corpus, porque el defecto que arregla es
// exactamente el de mirar un campo y dar por hecho el resto:
// `backFor()` devolvía `data.back` para flashcard y `data.answer` sólo si
// era string. Todo lo demás caía a cadena vacía, el render es
// `{back && …}`, y **1.640 de 2.131 ejercicios servibles —el 77 %— no
// enseñaban su respuesta al revelarla en la sesión de repaso**. Las
// respuestas estaban ahí, en `blanks[].answer`, `correct`, `target`,
// `modelAnswer`, `options[correctIndex]`, y nadie las miraba.
//
// El reparto de los mudos: fill_blank 682 · mediation 361 · translation
// 239 · error_correction 161 · grammaticality_judgment 144 ·
// multiple_choice 52 · matching 1.
//
// Un tipo nuevo sin entrada aquí es un tipo mudo, así que el último test
// recorre el corpus ENTERO y exige que ninguno se quede sin respuesta: es
// la única forma de que el catorceavo tipo no repita esto en silencio.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { respuestaDe, frenteDe } from '@/lib/exercises/respuesta';

const ex = (type: string, data: unknown) => ({ id: 't', type, blockId: 1, lessonId: 'l', data, concepts: [], tags: [], difficulty: 1 }) as never;

describe('respuestaDe, tipo por tipo', () => {
  it('flashcard: el reverso', () => {
    expect(respuestaDe(ex('flashcard', { front: 'poupar', back: 'ahorrar' }))).toBe('ahorrar');
  });
  it('fill_blank: la respuesta del hueco, y los DOS si hay dos', () => {
    expect(respuestaDe(ex('fill_blank', { sentence: 'A minha ___ cantou.', blanks: [{ answer: 'irmã' }] }))).toBe('irmã');
    expect(respuestaDe(ex('fill_blank', { sentence: '___ e ___', blanks: [{ answer: 'há' }, { answer: 'melhore' }] })))
      .toBe('há · melhore');
  });
  it('translation: el texto de destino, que es lo que el alumno tenía que producir', () => {
    expect(respuestaDe(ex('translation', { source: 'Tenho fome.', target: 'Tengo hambre.' }))).toBe('Tengo hambre.');
  });
  it('error_correction: la frase CORREGIDA, no la mala', () => {
    const e = ex('error_correction', { sentence: 'A gente vamos ao cinema.', correct: 'A gente vai ao cinema.' });
    expect(respuestaDe(e)).toBe('A gente vai ao cinema.');
    expect(respuestaDe(e)).not.toContain('vamos');
  });
  it('grammaticality_judgment: el veredicto, y la reparación cuando está mal', () => {
    expect(respuestaDe(ex('grammaticality_judgment', { sentence: 'Estou bem.', verdict: true, repair: '' })))
      .toBe('Está bien formada.');
    expect(respuestaDe(ex('grammaticality_judgment', { sentence: 'Não paro de estornudar.', verdict: false, repair: 'Não paro de espirrar.' })))
      .toBe('Está mal formada. → Não paro de espirrar.');
  });
  it('multiple_choice: la opción del índice correcto, no el índice', () => {
    expect(respuestaDe(ex('multiple_choice', { question: '¿?', options: ['o senhor', 'você', 'tu'], correctIndex: 0 })))
      .toBe('o senhor');
  });
  it('matching: los pares, que son la respuesta entera', () => {
    expect(respuestaDe(ex('matching', { pairs: [{ left: 'ônibus (BR)', right: 'autocarro' }, { left: 'trem (BR)', right: 'comboio' }] })))
      .toBe('ônibus (BR) → autocarro\ntrem (BR) → comboio');
  });
  it('mediation: la respuesta modelo', () => {
    expect(respuestaDe(ex('mediation', { sourceText: 'Era uma vez…', modelAnswer: 'O rei partiu para a guerra.' })))
      .toBe('O rei partiu para a guerra.');
  });
  it('los que ya funcionaban siguen funcionando', () => {
    expect(respuestaDe(ex('listening', { audioText: 'A rua…', question: '¿Qué?', answer: 'El carro' }))).toBe('El carro');
    expect(respuestaDe(ex('conjugation', { infinitive: 'falar', answer: 'falas' }))).toBe('falas');
    expect(respuestaDe(ex('verb_preposition', { sentence: 'Volta ___ hotel', answer: 'ao' }))).toBe('ao');
    expect(respuestaDe(ex('transformation', { source: 'Já li esse livro.', answer: 'Esse livro já li.' }))).toBe('Esse livro já li.');
  });
});

describe('frenteDe: lo que se ve ANTES de revelar', () => {
  it('un listening NO enseña su transcripción: entonces no se escucha, se lee', () => {
    const e = ex('listening', { audioText: 'A rua do meu carro fica perto da esquina.', question: '¿Qué hay cerca de la esquina?', answer: 'El carro' });
    expect(frenteDe(e)).toBe('¿Qué hay cerca de la esquina?');
    expect(frenteDe(e)).not.toContain('esquina.');
  });
  it('un error_correction enseña la frase MALA, que es la que hay que corregir', () => {
    expect(frenteDe(ex('error_correction', { sentence: 'A gente vamos.', correct: 'A gente vai.' }))).toBe('A gente vamos.');
  });
  it('nunca enseña la respuesta por delante', () => {
    for (const [t, d] of [
      ['fill_blank', { sentence: 'A minha ___ cantou.', blanks: [{ answer: 'irmã' }] }],
      ['translation', { source: 'Tenho fome.', target: 'Tengo hambre.' }],
      ['multiple_choice', { question: '¿Cuál?', options: ['a', 'b'], correctIndex: 1 }],
      ['flashcard', { front: 'poupar', back: 'ahorrar' }],
    ] as [string, unknown][]) {
      const e = ex(t, d);
      const r = respuestaDe(e);
      expect(frenteDe(e), `${t} filtra su respuesta por delante`).not.toContain(r);
    }
  });
  it('matching tiene frente propio en vez de quedarse en blanco', () => {
    expect(frenteDe(ex('matching', { pairs: [{ left: 'trem (BR)', right: 'comboio' }] }))).toContain('trem (BR)');
  });
});

describe('el corpus entero, que es donde se ve si falta un tipo', () => {
  const dir = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
  const items = fs.readdirSync(dir).filter((f) => /^b\d+\.json$/.test(f))
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as { type: string; id: string; variantStatus?: string; data: unknown }[])
    .filter((x) => x.variantStatus !== 'needs-human');

  it('ningún ejercicio servible se queda sin respuesta', () => {
    const mudos = items.filter((x) => !respuestaDe(x as never).trim());
    expect(mudos.slice(0, 5).map((x) => `${x.id} (${x.type})`)).toEqual([]);
    expect(mudos.length).toBe(0);
  });
  it('ningún ejercicio servible se queda sin frente', () => {
    const ciegos = items.filter((x) => !frenteDe(x as never).trim());
    expect(ciegos.slice(0, 5).map((x) => `${x.id} (${x.type})`)).toEqual([]);
  });
});
