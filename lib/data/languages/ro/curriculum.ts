// lib/data/languages/ro/curriculum.ts
// Phase 5 (multi-idioma): scaffold vacío para rumano. No se genera contenido
// para este idioma en esta fase; el curriculum es un stub con arrays
// vacíos. La `app/[lang]/_empty-state.tsx` se renderiza cuando
// `BLOCKS.length === 0`. `getBlock` / `getLesson` throw (no hay contenido
// que entregar) — las pages verifican `BLOCKS.length === 0` antes de
// invocarlos.
import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
export type { Block, Concept, Lesson, ConceptId, LessonId };

export const BLOCKS: Block[] = [];
export const ALL_CONCEPTS: Concept[] = [];

export function getBlock(_id: number): Block {
  throw new Error("No blocks for ro yet (Phase 5 scaffold).");
}

export function getLesson(_id: LessonId): Lesson {
  throw new Error("No lessons for ro yet (Phase 5 scaffold).");
}

export function getConceptsByIds(_ids: ConceptId[]): Concept[] {
  return [];
}
