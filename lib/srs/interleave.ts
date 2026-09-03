// lib/srs/interleave.ts
// Plan 5d (E6): real interleaving for a review session. `buildDueQueue`
// returns reviews then new cards as two recency-sorted blocks, which means
// many same-concept / same-type cards run back-to-back. This greedy
// reorderer mixes them: at each step it picks the remaining card whose
// concept (weighted) and type differ most from the previous pick, so two
// consecutive cards rarely share a concept or type — better retention
// without losing or duplicating any card.
//
// E-fuga (2026-09-03): además intercala respetando una RESTRICCIÓN DE
// ORDEN. Si la tarjeta A imprime en su texto la respuesta de la tarjeta B,
// B va antes que A: así el alumno contesta B por lo que sabe y no por lo
// que acaba de leer. Se ORDENA, no se excluye — nadie se queda sin
// repasar, ningún calendario FSRS se desplaza y no hay inanición, que es
// lo que sí pasaría aplazando una de las dos.
import type { Card } from "../db/schema";

export interface ResultadoIntercalado {
  orden: Card[];
  /** Pares en ciclo (A exige ir tras B y B tras A). No se pueden satisfacer
   *  los dos; se rompe por el orden de la cola y se CUENTA, porque un
   *  ciclo silencioso convertiría la garantía en una creencia. */
  ciclosRotos: number;
}

export function interleave(
  cards: Card[],
  conceptOf: (id: string) => string | undefined,
  typeOf: (id: string) => string | undefined,
  /** Ids que deben examinarse ANTES que esta tarjeta (porque ésta imprime
   *  su respuesta). Ver `lib/srs/fuga-sesion.ts`. */
  debenIrAntes?: (id: string) => readonly string[] | undefined,
): Card[] {
  return interleaveDetallado(cards, conceptOf, typeOf, debenIrAntes).orden;
}

export function interleaveDetallado(
  cards: Card[],
  conceptOf: (id: string) => string | undefined,
  typeOf: (id: string) => string | undefined,
  debenIrAntes?: (id: string) => readonly string[] | undefined,
): ResultadoIntercalado {
  const remaining = [...cards];
  const out: Card[] = [];
  let prevConcept: string | undefined;
  let prevType: string | undefined;

  const score = (c: Card): number => {
    const concept = conceptOf(c.id);
    const type = typeOf(c.id);
    return (concept !== prevConcept ? 2 : 0) + (type !== prevType ? 1 : 0);
  };

  let ciclosRotos = 0;
  const pendientes = new Set(remaining.map((c) => c.id));
  // Bloqueada mientras siga en la cola alguna tarjeta que debe ir antes.
  const bloqueada = (c: Card) =>
    (debenIrAntes?.(c.id) ?? []).some((id) => id !== c.id && pendientes.has(id));

  while (remaining.length) {
    const libres = remaining.filter((c) => !bloqueada(c));
    // Si TODAS están bloqueadas hay un ciclo: se elige igualmente por
    // puntuación para no colgarse, y se cuenta.
    const candidatas = libres.length > 0 ? libres : remaining;
    if (libres.length === 0) ciclosRotos++;

    let mejor = candidatas[0]!;
    let pickScore = score(mejor);
    for (let i = 1; i < candidatas.length; i++) {
      const s = score(candidatas[i]!);
      if (s > pickScore) {
        mejor = candidatas[i]!;
        pickScore = s;
      }
    }
    const pickIdx = remaining.indexOf(mejor);
    const [chosen] = remaining.splice(pickIdx, 1);
    pendientes.delete(chosen!.id);
    out.push(chosen!);
    prevConcept = conceptOf(chosen!.id);
    prevType = typeOf(chosen!.id);
  }
  return { orden: out, ciclosRotos };
}
