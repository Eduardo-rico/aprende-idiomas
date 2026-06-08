// lib/data/curriculum.ts
// Curricular source of truth: blocks, lessons, concepts. Plan #2 will render
// conceptNotesPath MDX; Plan #1 just consumes the structure for content gen.

export type ConceptId = string;
export type LessonId = string;

export interface Concept {
  id: ConceptId;
  name: string;
  blockId: number;
  description: string;
  prereqs: ConceptId[];
}

export interface Lesson {
  id: LessonId;
  blockId: number;
  name: string;
  objectives: string[];
  conceptIds: ConceptId[];
  /** Pre-teaching vocab: strings que el LLM debe convertir en flashcards explícitamente. */
  vocabKey: readonly string[];
  /** Path al archivo MDX con las notas conceptuales. Plan #2 lo renderiza. */
  conceptNotesPath: string;
  /** IDs de ejercicios asociados a esta lección (se llenan al generar contenido). */
  exerciseRefs: string[];
}

export interface Block {
  id: number;
  slug: string;
  name: string;
  description: string;
  durationWeeks: number | null;
  prereqs: number[];
  freeDrill: boolean;
  lessons: Lesson[];
}

// --- Block 1: Fonética e ortografía ---
const B1_CONCEPTS: Concept[] = [
  { id: 'b1-alfabeto', name: 'Alfabeto portugués', blockId: 1, description: 'Letras y nombres en portugués', prereqs: [] },
  { id: 'b1-acentos', name: 'Acentos diacríticos', blockId: 1, description: 'Agudo, grave, circunflejo, tilde, cedilha', prereqs: [] },
  { id: 'b1-silaba-tonica', name: 'Sílaba tónica', blockId: 1, description: 'Reglas de acentuación tónica', prereqs: ['b1-acentos'] },
  { id: 'b1-corresp-on-ao', name: 'Correspondencia -ón → -ão', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-corresp-ll-lh', name: 'Correspondencia -ll- → -lh-', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-corresp-nh-ny', name: 'Correspondencia -ñ → -nh-', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-h-muda', name: 'H muda', blockId: 1, description: 'H inicial siempre muda', prereqs: [] },
  { id: 'b1-vogais-nasais', name: 'Vocales nasales', blockId: 1, description: 'ã, õ, am, em, im, om, um', prereqs: [] },
  { id: 'b1-pron-rr-r', name: 'Pronunciación rr/r inicial', blockId: 1, description: 'En BR como /h/; en PT vibrante', prereqs: [] },
  { id: 'b1-pron-s-final', name: 'Pronunciación de "s" final', blockId: 1, description: 'BR /s/; PT /ʃ/', prereqs: [] },
];

const B1_LESSONS: Lesson[] = [
  {
    id: 'b1-l1-alfabeto-acentos',
    blockId: 1,
    name: 'Alfabeto y acentos',
    objectives: [
      'Reconocer todas las letras del alfabeto portugués',
      'Identificar y nombrar los acentos (´ ` ^ ~ ¸)',
    ],
    conceptIds: ['b1-alfabeto', 'b1-acentos'],
    vocabKey: ['a', 'e', 'i', 'o', 'u', 'á', 'à', 'â', 'ã', 'ç'] as const,
    conceptNotesPath: 'b1/l1-alfabeto-acentos.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l2-silaba-tonica',
    blockId: 1,
    name: 'Sílaba tónica y reglas de acentuación',
    objectives: [
      'Identificar la sílaba tónica en cualquier palabra',
      'Aplicar reglas de acentuación gráfica',
    ],
    conceptIds: ['b1-silaba-tonica'],
    vocabKey: ['fácil', 'difícil', 'café', 'avó', 'avô', 'táxi', 'lápis'] as const,
    conceptNotesPath: 'b1/l2-silaba-tonica.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l3-correspondencias-es-pt',
    blockId: 1,
    name: 'Correspondencias sistemáticas español → portugués',
    objectives: [
      'Aplicar las reglas -ón→-ão, -ll-→-lh-, -ñ-→-nh-',
      'Reconocer h muda',
    ],
    conceptIds: ['b1-corresp-on-ao', 'b1-corresp-ll-lh', 'b1-corresp-nh-ny', 'b1-h-muda'],
    vocabKey: ['coração', 'canção', 'mulher', 'olho', 'manhã', 'banho', 'hotel', 'hora'] as const,
    conceptNotesPath: 'b1/l3-correspondencias.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l4-vogais-nasais',
    blockId: 1,
    name: 'Vocales nasales',
    objectives: [
      'Reconocer y producir vocales nasales',
      'Distinguir vocal nasal de vocal + n/m',
    ],
    conceptIds: ['b1-vogais-nasais'],
    vocabKey: ['mãe', 'pão', 'cão', 'irmão', 'bem', 'bom', 'ruim', 'um'] as const,
    conceptNotesPath: 'b1/l4-vogais-nasais.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l5-pron-rr-s',
    blockId: 1,
    name: 'Pronunciación de rr/r y s final (BR vs PT)',
    objectives: [
      'Reconocer pronunciación de rr/r inicial en BR vs PT',
      'Reconocer "s" final en BR vs PT',
    ],
    conceptIds: ['b1-pron-rr-r', 'b1-pron-s-final'],
    vocabKey: ['rato', 'carro', 'rua', 'dois', 'mais', 'meses', 'olhos'] as const,
    conceptNotesPath: 'b1/l5-pron-rr-s.mdx',
    exerciseRefs: [],
  },
];

const B1: Block = {
  id: 1,
  slug: 'fonetica',
  name: 'Sistema fonético y ortográfico',
  description: 'Alfabeto, acentos, sílaba tónica, correspondencias sistemáticas ES→PT, h muda, vocales nasales, diferencias clave de pronunciación BR vs PT.',
  durationWeeks: 2,
  prereqs: [],
  freeDrill: false,
  lessons: B1_LESSONS,
};

// --- Skeleton blocks 2-10 ---
function skeleton(id: number, slug: string, name: string, weeks: number | null, prereqs: number[], freeDrill = false): Block {
  return { id, slug, name, description: '', durationWeeks: weeks, prereqs, freeDrill, lessons: [] };
}

const B2  = skeleton(2,  'morfologia-nominal',     'Morfología nominal', 4, [1]);
const B3  = skeleton(3,  'presente-imperativo',    'Verbal: presente e imperativo', 4, [2]);
const B4  = skeleton(4,  'pasados',                'Verbal: pasados', 6, [3]);
const B5  = skeleton(5,  'futuros-condicional',    'Verbal: futuros y condicional', 3, [4]);
const B6  = skeleton(6,  'subjuntivo',             'Subjuntivo', 8, [5]);
const B7  = skeleton(7,  'formas-no-personales',   'Formas no personales', 3, [6]);
const B8  = skeleton(8,  'sintaxis-conectores',    'Sintaxis y conectores', 4, [7]);
const B9  = skeleton(9,  'lexico',                 'Léxico por campos', null, [], true);
const B10 = skeleton(10, 'registros-variacion',    'Registros y variación', 2, [8]);

export const BLOCKS: Block[] = [B1, B2, B3, B4, B5, B6, B7, B8, B9, B10];

export const ALL_CONCEPTS: Concept[] = [...B1_CONCEPTS];

export function getBlock(id: number): Block {
  const b = BLOCKS.find(b => b.id === id);
  if (!b) throw new Error(`Block ${id} not found`);
  return b;
}

export function getLesson(id: LessonId): Lesson {
  for (const b of BLOCKS) {
    const l = b.lessons.find(l => l.id === id);
    if (l) return l;
  }
  throw new Error(`Lesson ${id} not found`);
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  return ids.map(id => {
    const c = ALL_CONCEPTS.find(c => c.id === id);
    if (!c) throw new Error(`Concept ${id} not found`);
    return c;
  });
}
