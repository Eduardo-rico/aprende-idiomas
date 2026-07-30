// Los tipos nuevos de la Ola B2C2-PT, fijados ANTES de generar contenido
// (orden del plan maestro: schema y runner primero). Tres piezas:
//   - grammaticality_judgment: {sentence, verdict, repair?, explanationEs}
//     — repair es OBLIGATORIO cuando verdict=false (si la frase está mal,
//     hay que poder mostrar la buena) y está PROHIBIDO cuando verdict=true.
//   - mediation: fuente + consigna + rúbrica; la corrección es
//     autoevaluación contra rúbrica (LLM-juez es decisión aparte).
//   - register/address como campos de primera clase del ítem.
import { describe, it, expect } from 'vitest';
import {
  ExerciseDataByTypeSchema,
  RegisterSchema,
  AddressSchema,
  ExerciseSchema,
} from '@/lib/data/zod-schemas';

const gj = ExerciseDataByTypeSchema.grammaticality_judgment;
const med = ExerciseDataByTypeSchema.mediation;

describe('grammaticality_judgment', () => {
  it('parsea el caso agramatical con reparación', () => {
    const r = gj.safeParse({
      sentence: 'Embora festejas com muitos amigos.',
      verdict: false,
      repair: 'Embora festejes com muitos amigos.',
      explanationEs: 'Embora exige conjuntivo en las dos normas.',
    });
    expect(r.success).toBe(true);
  });
  it('parsea el caso gramatical sin reparación', () => {
    const r = gj.safeParse({
      sentence: 'É preciso poupar dinheiro.',
      verdict: true,
      explanationEs: 'Impersonal europeo impecable.',
    });
    expect(r.success).toBe(true);
  });
  it('RECHAZA agramatical sin repair (¿cómo se muestra la buena?)', () => {
    expect(gj.safeParse({ sentence: 'x', verdict: false, explanationEs: 'y' }).success).toBe(false);
  });
  it('RECHAZA gramatical CON repair (¿reparar qué?)', () => {
    expect(gj.safeParse({ sentence: 'x', verdict: true, repair: 'z', explanationEs: 'y' }).success).toBe(false);
  });
});

describe('mediation', () => {
  const base = {
    sourceText: 'A raínha tinha um filho…',
    sourceLang: 'pt',
    targetLang: 'es',
    mediationType: 'summarise',
    audience: 'un amigo hispanohablante que no ha leído el cuento',
    wordRange: { min: 30, max: 60 },
    rubric: ['Menciona a la nodriza y el trueque', 'No inventa hechos', 'Registro neutro'],
    instructionsEs: 'Resume el fragmento para tu amigo.',
  };
  it('parsea una mediación completa', () => {
    expect(med.safeParse(base).success).toBe(true);
  });
  it('exige rúbrica no vacía (sin rúbrica no hay evaluación)', () => {
    expect(med.safeParse({ ...base, rubric: [] }).success).toBe(false);
  });
  it('exige wordRange coherente', () => {
    expect(med.safeParse({ ...base, wordRange: { min: 60, max: 30 } }).success).toBe(false);
  });
  it('mediationType es enum cerrado', () => {
    expect(med.safeParse({ ...base, mediationType: 'inventado' }).success).toBe(false);
  });
});

describe('register/address como campos del ítem', () => {
  it('acepta los enums del currículo', () => {
    expect(RegisterSchema.safeParse('formal').success).toBe(true);
    expect(AddressSchema.safeParse('terceira_sem_pronome').success).toBe(true);
    expect(RegisterSchema.safeParse('elegante').success).toBe(false);
  });
  it('un ejercicio existente parsea con register/address opcionales', () => {
    const r = ExerciseSchema.safeParse({
      id: 'x1', blockId: 6, lessonId: 'b6-l1-x', difficulty: 1, concepts: [], tags: [],
      type: 'error_correction',
      data: { sentence: 'a', correct: 'b', explanationEs: 'c' },
      register: 'formal', address: 'o_senhor', variantStatus: 'unchecked',
    });
    expect(r.success).toBe(true);
  });
});
