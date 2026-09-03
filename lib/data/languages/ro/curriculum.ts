// lib/data/languages/ro/curriculum.ts
//
// Fase F: el INVENTARIO DE PUNTOS (`inventario-puntos.ts`) da ALL_CONCEPTS;
// los BLOQUES se construyen desde `BLOQUES_RO` SÓLO para los que tienen
// lecciones en `lessons/bN.json`. Un bloque sin lecciones no se declara:
// `app/[lang]/_empty-state.tsx` se renderiza cuando BLOCKS está vacío, y un
// bloque vacío sería una pantalla rota, no un bloque.
//
// Las lecciones llevan `conceptNotesPath` con la forma que exige el
// schema (`b2/l1-….mdx`), pero el MDX rumano no existe aún: la página de
// práctica sólo renderiza MDX para `pt` y para las demás lenguas pasa
// directo a los ejercicios. Cuando haya notas, se escriben en `mdx/`.
import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
import { CONCEPTOS_RO, BLOQUES_RO } from "./inventario-puntos";
import b1Lessons from "./lessons/b1.json";
import b2Lessons from "./lessons/b2.json";
import b3Lessons from "./lessons/b3.json";
import b4Lessons from "./lessons/b4.json";
import b5Lessons from "./lessons/b5.json";
import b6Lessons from "./lessons/b6.json";
import b7Lessons from "./lessons/b7.json";
import b8Lessons from "./lessons/b8.json";
import b9Lessons from "./lessons/b9.json";
import b10Lessons from "./lessons/b10.json";
import b11Lessons from "./lessons/b11.json";
import b12Lessons from "./lessons/b12.json";
export type { Block, Concept, Lesson, ConceptId, LessonId };

const LECCIONES: Record<number, Lesson[]> = {
  1: b1Lessons as Lesson[],
  2: b2Lessons as Lesson[],
  3: b3Lessons as Lesson[],
  4: b4Lessons as Lesson[],
  5: b5Lessons as Lesson[],
  6: b6Lessons as Lesson[],
  7: b7Lessons as Lesson[],
  8: b8Lessons as Lesson[],
  9: b9Lessons as Lesson[],
  10: b10Lessons as Lesson[],
  11: b11Lessons as Lesson[],
  12: b12Lessons as Lesson[],
};

export const BLOCKS: Block[] = BLOQUES_RO
  .filter((b) => (LECCIONES[b.id] ?? []).length > 0)
  .map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.nombre,
    description: b.nombre,
    durationWeeks: null,
    prereqs: [],
    freeDrill: false,
    lessons: LECCIONES[b.id] ?? [],
  }));

export const ALL_CONCEPTS: Concept[] = CONCEPTOS_RO;

export function getBlock(id: number): Block {
  const b = BLOCKS.find((x) => x.id === id);
  if (!b) throw new Error(`No block ${id} for ro (fase F: sólo los bloques con lecciones existen).`);
  return b;
}

export function getLesson(id: LessonId): Lesson {
  for (const b of BLOCKS) { const l = b.lessons.find((x) => x.id === id); if (l) return l; }
  throw new Error(`No lesson ${id} for ro.`);
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  const set = new Set(ids);
  return ALL_CONCEPTS.filter((c) => set.has(c.id));
}
