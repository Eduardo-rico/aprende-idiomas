// scripts/lib/cobertura.ts
//
// UN GATE TIENE QUE DECIR SOBRE CUÁNTOS CASOS DECIDIÓ.
//
// Nace de la forma más silenciosa de gate falso que hemos encontrado: al
// añadir la 3.ª declinación, `revisarCoherenciaLexico` pasó de contrastar
// 34 lemas a contrastar 22 —el nominativo de la 3.ª es dato y compararlo
// con el lema es compararlo consigo mismo— **y siguió en verde todo el
// rato**. No es un gate que deja de disparar ni uno que nace muerto: es
// uno que **encoge su denominador cuando crece el dominio**. Crece el
// material, crece la confianza aparente, y la cobertura real baja.
//
// La cura es que el veredicto venga con su denominador. Y el caso límite
// —una comprobación que decide sobre CERO casos— deja de ser un verde y
// pasa a ser un hallazgo: un gate que no ha mirado nada no ha aprobado
// nada.
//
// Vive en un fichero compartido a propósito: los tres formatos lo
// necesitan, y una regla copiada tres veces falla en la copia N+1 que
// nadie añadió.

export interface Cobertura {
  /** Qué comprueba, en una línea. */
  comprobacion: string;
  /** Sobre cuántos ítems ha podido decidir de verdad. */
  decididos: number;
  /** Cuántos había. */
  total: number;
  /** Por qué los demás quedan fuera. Obligatorio cuando `decididos` es
   *  menor que `total`: un salto sin motivo escrito es el mismo agujero
   *  que la cuarentena sin razón. */
  motivoDeLosQueQuedanFuera?: string;
}

export interface FalloCobertura { item: string; clase: 'cobertura-cero' | 'cobertura-sin-motivo'; detalle: string }

/** Revisa la propia cobertura declarada. Se llama desde cada
 *  `revisarLote*` y sus hallazgos entran en la misma lista. */
export function revisarCobertura(cs: Cobertura[]): FalloCobertura[] {
  const out: FalloCobertura[] = [];
  for (const c of cs) {
    if (c.decididos === 0) {
      out.push({ item: '(lote)', clase: 'cobertura-cero',
        detalle: `«${c.comprobacion}» decidió sobre 0 de ${c.total} ítems: no ha aprobado nada, ha callado` });
    } else if (c.decididos < c.total && !c.motivoDeLosQueQuedanFuera) {
      out.push({ item: '(lote)', clase: 'cobertura-sin-motivo',
        detalle: `«${c.comprobacion}» decidió sobre ${c.decididos} de ${c.total} y no dice por qué quedan fuera los otros ${c.total - c.decididos}` });
    }
  }
  return out;
}

/** Para pegarlo en un informe o en un mensaje de commit. */
export function resumenCobertura(cs: Cobertura[]): string {
  return cs.map((c) => `  ${c.comprobacion.padEnd(38)} ${String(c.decididos).padStart(3)} / ${c.total}`).join('\n');
}
