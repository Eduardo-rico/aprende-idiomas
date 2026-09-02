// lib/data/languages/ro/curriculum.ts
//
// Fase F (E2#30): el INVENTARIO DE PUNTOS del rumano existe en
// `inventario-puntos.ts` y de ahí sale `ALL_CONCEPTS`. Los BLOQUES siguen
// vacíos a propósito: `app/[lang]/_empty-state.tsx` se renderiza cuando
// `BLOCKS.length === 0`, y un bloque sin lecciones ni ejercicios no es un
// bloque, es una pantalla rota. Se llenan cuando haya lecciones.
// `getBlock` / `getLesson` siguen lanzando por la misma razón.
import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
import { CONCEPTOS_RO } from "./inventario-puntos";
export type { Block, Concept, Lesson, ConceptId, LessonId };

export const BLOCKS: Block[] = [];
export const ALL_CONCEPTS: Concept[] = CONCEPTOS_RO;

export function getBlock(_id: number): Block {
  throw new Error("No blocks for ro yet (fase F: inventario sin lecciones).");
}

export function getLesson(_id: LessonId): Lesson {
  throw new Error("No lessons for ro yet (fase F: inventario sin lecciones).");
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  const set = new Set(ids);
  return ALL_CONCEPTS.filter((c) => set.has(c.id));
}
