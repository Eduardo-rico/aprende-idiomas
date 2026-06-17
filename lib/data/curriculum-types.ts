// lib/data/curriculum-types.ts
// Phase 2 (multi-idioma): tipos compartidos entre el curriculum de un idioma
// concreto y los scaffolds vacíos para RU/RO/CS (Phase 5). Las interfaces
// `Block`/`Concept`/`Lesson` viven aquí, no en `lib/data/languages/pt/curriculum.ts`,
// para que los scaffolds de idiomas sin contenido puedan tiparse contra el
// mismo contrato.

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
