// lib/data/languages/ru/curriculum.ts
//
// Fase F (2026-09-11): el INVENTARIO DE PUNTOS (`inventario-puntos.ts`) ya
// da `ALL_CONCEPTS` — 93 puntos en 15 bloques. **`BLOCKS` sigue VACÍO a
// propósito**, y el motivo importa porque es lo contrario de lo que parece
// un descuido: un bloque sólo se declara cuando tiene lecciones en
// `lessons/bN.json`, y el ruso no tiene ninguna. Declarar los 15 bloques
// sin lecciones no adelantaría trabajo: rendería 15 pantallas rotas en vez
// del `_empty-state`, y el publicador rechazaría el lote igual. En rumano
// esto no estaba escrito en ninguna parte y se descubrió al empezar el
// lote 17, cuando B1, B2, C1 y C2 no podían recibir contenido y nadie
// sabía por qué.
//
// Que `ALL_CONCEPTS` esté poblado y `BLOCKS` vacío es el estado correcto
// de una lengua con inventario y sin lecciones: las herramientas que
// cuentan cobertura ya ven los 93 puntos, y la app sigue diciendo la
// verdad, que es que todavía no hay nada que practicar.
import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
import { CONCEPTOS_RU } from "./inventario-puntos";
export type { Block, Concept, Lesson, ConceptId, LessonId };

export const BLOCKS: Block[] = [];
export const ALL_CONCEPTS: Concept[] = CONCEPTOS_RU;

export function getBlock(_id: number): Block {
  throw new Error("No blocks for ru yet (Phase 5 scaffold).");
}

export function getLesson(_id: LessonId): Lesson {
  throw new Error("No lessons for ru yet (Phase 5 scaffold).");
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  const set = new Set(ids);
  return ALL_CONCEPTS.filter((c) => set.has(c.id));
}
