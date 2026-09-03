// lib/data/languages/la/curriculum.ts
// Fase G (latín y griego antiguo): scaffold vacío para el latín. El
// currículo no existe todavía —es el eslabón que RO sí tenía y estas dos
// no (ver docs/plans/2026-09-03-la-grc-paso0.md §2.1)—, así que aquí no
// hay nada que entregar y `getBlock`/`getLesson` lanzan.
// `app/[lang]/_empty-state.tsx` se renderiza con `BLOCKS.length === 0`.
//
// Y una diferencia con los scaffolds de la fase F que hay que recordar
// al poblarlo: los niveles de esta lengua NO son A1…C2. Son los peldaños
// de `NIVELES_DE` en `scripts/paso0-idioma.ts`, definidos por el sistema
// gramatical que hay que tener automatizado, porque el MCER no aplica a
// una lengua que nadie habla.
import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
export type { Block, Concept, Lesson, ConceptId, LessonId };

export const BLOCKS: Block[] = [];
export const ALL_CONCEPTS: Concept[] = [];

export function getBlock(_id: number): Block {
  throw new Error("No blocks for la yet (fase G: el currículo aún no está escrito).");
}

export function getLesson(_id: LessonId): Lesson {
  throw new Error("No lessons for la yet (fase G: el currículo aún no está escrito).");
}

export function getConceptsByIds(_ids: ConceptId[]): Concept[] {
  return [];
}
