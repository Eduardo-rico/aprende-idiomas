// lib/srs/interleave.ts
// Plan 5d (E6): real interleaving for a review session. `buildDueQueue`
// returns reviews then new cards as two recency-sorted blocks, which means
// many same-concept / same-type cards run back-to-back. This greedy
// reorderer mixes them: at each step it picks the remaining card whose
// concept (weighted) and type differ most from the previous pick, so two
// consecutive cards rarely share a concept or type — better retention
// without losing or duplicating any card.
import type { Card } from "../db/schema";

export function interleave(
  cards: Card[],
  conceptOf: (id: string) => string | undefined,
  typeOf: (id: string) => string | undefined,
): Card[] {
  const remaining = [...cards];
  const out: Card[] = [];
  let prevConcept: string | undefined;
  let prevType: string | undefined;

  const score = (c: Card): number => {
    const concept = conceptOf(c.id);
    const type = typeOf(c.id);
    return (concept !== prevConcept ? 2 : 0) + (type !== prevType ? 1 : 0);
  };

  while (remaining.length) {
    let pickIdx = 0;
    let pickScore = score(remaining[0]!);
    for (let i = 1; i < remaining.length; i++) {
      const s = score(remaining[i]!);
      if (s > pickScore) {
        pickIdx = i;
        pickScore = s;
      }
    }
    const [chosen] = remaining.splice(pickIdx, 1);
    out.push(chosen!);
    prevConcept = conceptOf(chosen!.id);
    prevType = typeOf(chosen!.id);
  }
  return out;
}
