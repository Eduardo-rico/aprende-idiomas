// tests/unit/variant-resolution.test.ts
//
// Tras la inversión del 2026-07-28 (scripts/invert-variant-base.ts):
//   data                      → portugués EUROPEO, la base
//   variantOverrides['pt-br'] → portugués de Brasil, sólo lo que difiere
//
// Antes era al revés, y la clave "pt-br" guardaba texto europeo. Estos tests
// existían para verificar la capa de compensación que deshacía esa mentira;
// ahora verifican que la mentira ya no está.
import { describe, it, expect } from 'vitest';
import { resolveExerciseData } from '@/lib/exercise-resolver';

const ex = {
  id: 'x', type: 'flashcard', blockId: 7, lessonId: 'b7-l1', difficulty: 1, concepts: [], tags: [],
  data: { front: 'estoy hablando', back: 'estou a falar' },   // base EUROPEA
  variantOverrides: { 'pt-br': { back: 'estou falando' } },   // override brasileño
  variantStatus: 'divergent',
} as any;

describe('resolución de variante, con PT-PT como base', () => {
  it('el usuario pt-pt recibe la base europea', () => {
    expect((resolveExerciseData(ex, 'pt-pt') as any).back).toBe('estou a falar');
  });

  it('el usuario pt-br recibe el override brasileño', () => {
    expect((resolveExerciseData(ex, 'pt-br') as any).back).toBe('estou falando');
  });

  it('el alias legacy "pt" sigue siendo europeo', () => {
    expect((resolveExerciseData(ex, 'pt') as any).back).toBe('estou a falar');
  });

  it('el alias legacy "br" recibe el brasileño', () => {
    expect((resolveExerciseData(ex, 'br') as any).back).toBe('estou falando');
  });

  // REGRESIÓN. Éste es el bug que puso portugués brasileño delante de un
  // usuario que había elegido Portugal, en el 91 % del corpus, durante meses.
  // El gerundio (`falando`) es el marcador brasileño más visible; en portugués
  // europeo se dice `estar a + infinitivo`.
  it('un usuario de PT-PT NUNCA recibe el gerundio brasileño', () => {
    for (const v of ['pt-pt', 'pt']) {
      const r = resolveExerciseData(ex, v) as any;
      expect(r.back).not.toMatch(/\bfalando\b/);
      expect(r.back).toMatch(/\ba falar\b/);
    }
  });

  // Un ítem sin override es sólo base. Con la convención nueva eso significa
  // "europeo"; `variantStatus: 'unchecked'` es lo que avisa de que nadie lo
  // ha verificado todavía (1.844 ítems del corpus están así).
  it('sin override, las dos variantes reciben la base', () => {
    const sinOv = { ...ex, variantOverrides: undefined, variantStatus: 'unchecked' };
    expect((resolveExerciseData(sinOv, 'pt-pt') as any).back).toBe('estou a falar');
    expect((resolveExerciseData(sinOv, 'pt-br') as any).back).toBe('estou a falar');
  });
});
