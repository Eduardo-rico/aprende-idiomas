// lib/data/languages/ru/curriculum.ts
//
// Fase F: el INVENTARIO DE PUNTOS (`inventario-puntos.ts`) da `ALL_CONCEPTS`
// —93 puntos en 15 bloques— y los BLOQUES se construyen desde `BLOQUES_RU`
// **sólo para los que tienen lecciones en `lessons/bN.json`**.
//
// ⚠ ESTE FICHERO EMPEZÓ CON `BLOCKS` VACÍO A PROPÓSITO, y el motivo sigue
// vigente para los once bloques que siguen sin lección: un bloque
// declarado sin lecciones no adelanta trabajo, rinde una pantalla rota en vez
// del `_empty-state`, y el publicador rechaza el lote igual. En rumano esto no
// estaba escrito en ninguna parte y se descubrió al empezar el lote 17, cuando
// B1, B2, C1 y C2 no podían recibir contenido y nadie sabía por qué.
//
// El 2026-09-12 entró la PRIMERA lección del ruso, `lessons/b4.json`, porque
// entró el primer lote de ejercicios (`scripts/lotes/cloze-ru-a1.ts`, 12 ítems
// de `u4-declinacion-singular`).
//
// El 2026-09-13 entraron **b3, b5 y b7** (cuatro lecciones más), que son los
// bloques donde van los lotes siguientes: 18 puntos más pasan de
// «estructuralmente inalcanzables» a producibles. Los otros once bloques siguen
// sin declararse, y eso no es un descuido: un bloque declarado sin lecciones no
// adelanta trabajo y rinde una pantalla rota. Las herramientas que cuentan
// cobertura ven los 93 puntos; la app sigue diciendo la verdad.
//
// Las lecciones llevan `conceptNotesPath` con la forma que exige el schema
// (`b4/l1-….mdx`), pero el MDX ruso no existe aún: la página de práctica sólo
// renderiza MDX para `pt` y para las demás lenguas pasa directo a los
// ejercicios. Cuando haya notas, se escriben en `mdx/`.
import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
import { CONCEPTOS_RU, BLOQUES_RU } from "./inventario-puntos";
import b3Lessons from "./lessons/b3.json";
import b4Lessons from "./lessons/b4.json";
import b5Lessons from "./lessons/b5.json";
import b7Lessons from "./lessons/b7.json";
export type { Block, Concept, Lesson, ConceptId, LessonId };

const LECCIONES: Record<number, Lesson[]> = {
  3: b3Lessons as Lesson[],
  4: b4Lessons as Lesson[],
  5: b5Lessons as Lesson[],
  7: b7Lessons as Lesson[],
};

export const BLOCKS: Block[] = BLOQUES_RU
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

export const ALL_CONCEPTS: Concept[] = CONCEPTOS_RU;

export function getBlock(id: number): Block {
  const b = BLOCKS.find((x) => x.id === id);
  if (!b) throw new Error(`No block ${id} for ru (fase F: sólo los bloques con lecciones existen).`);
  return b;
}

export function getLesson(id: LessonId): Lesson {
  for (const b of BLOCKS) { const l = b.lessons.find((x) => x.id === id); if (l) return l; }
  throw new Error(`No lesson ${id} for ru.`);
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  const set = new Set(ids);
  return ALL_CONCEPTS.filter((c) => set.has(c.id));
}
