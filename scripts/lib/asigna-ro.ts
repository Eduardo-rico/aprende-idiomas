// scripts/lib/asigna-ro.ts — EL CONTADOR CANÓNICO DE PUNTOS DEL RUMANO,
// en un solo sitio, para que la foto del déficit y el `--asigna` de los
// borradores no puedan discrepar.
//
// Por qué existe: `deficit-ro.ts` contaba con su propio bucle y los lotes
// iban a llevar el suyo. Es exactamente [[gotcha: una regla copiada se
// desincroniza]] — falla en la copia N+1 que nadie añadió. Aquí la regla
// se escribe UNA vez y los dos la importan.
//
// Qué certifica: a qué punto del inventario va a contar cada ítem DE
// VERDAD, que no tiene por qué ser el que declara. En rumano no hay
// particiones ni sub-puntos (el inventario ya es fino), así que la cuenta
// es directa por `concepts`; lo que sí caza es lo que en PT se pagó caro:
// un punto declarado que NO existe en el inventario cuenta cero y nadie
// lo nota, porque el total del lote sigue siendo 24.
//
// Qué NO certifica: que el ítem MIDA su punto. Eso es del lingüista y de
// los testigos del propio lote ([[gotcha: un ítem puede no medir su
// punto]]).
import { PUNTOS_RO, pisoDePuntoRo } from '../../lib/data/languages/ro/inventario-puntos';
import { servibleAlAlumno } from './estado-item';

export interface CuentaRo {
  /** punto del inventario → ítems servibles que le cuentan (los puntos a
   *  cero están presentes: el universo lo da el inventario, no el corpus). */
  cuenta: Map<string, number>;
  /** conceptos que NO están en el inventario: cuentan a nada. */
  desconocidos: Map<string, number>;
  servibles: number;
}

export function contarPuntosRo(items: any[]): CuentaRo {
  const servibles = items.filter(servibleAlAlumno);
  const cuenta = new Map<string, number>(PUNTOS_RO.map((p) => [p.id, 0]));
  const desconocidos = new Map<string, number>();
  for (const x of servibles) for (const c of ((x?.concepts ?? []) as string[])) {
    if (cuenta.has(c)) cuenta.set(c, cuenta.get(c)! + 1);
    else desconocidos.set(c, (desconocidos.get(c) ?? 0) + 1);
  }
  return { cuenta, desconocidos, servibles: servibles.length };
}

export const pisoDePunto = (() => {
  // El piso REAL, que puede ser CERO cuando el punto lo declara con su
  // motivo (`pisoCero`). Antes esto miraba sólo el nivel y por eso un
  // punto declarado «0 ítems por diseño» seguía cobrando 8 unidades: la
  // declaración vivía en la prosa y el número no la conocía.
  const porId = new Map(PUNTOS_RO.map((p) => [p.id, p]));
  return (id: string) => { const p = porId.get(id); return p ? pisoDePuntoRo(p) : 8; };
})();

/** El `--asigna` de los lotes: mete los BORRADORES por el contador
 *  canónico —con la forma exacta que tendrán publicados— y contrasta lo
 *  declarado con lo que cuenta. Devuelve las líneas y si hay desvío. */
export function informeAsigna(
  borradores: { p: string; sentence: string; hintEs: string; answer: string }[],
): { lineas: string[]; desvio: boolean } {
  const falsos = borradores.map((b, i) => ({
    id: `draft-${i}`, type: 'fill_blank', concepts: [b.p],
    data: { sentence: b.sentence, hintEs: b.hintEs, blanks: [{ position: 0, answer: b.answer }] },
  }));
  const { cuenta, desconocidos } = contarPuntosRo(falsos);
  const decl = new Map<string, number>();
  for (const b of borradores) decl.set(b.p, (decl.get(b.p) ?? 0) + 1);
  const lineas = ['| punto declarado | escritos | cuentan ahí | piso |', '|---|---:|---:|---:|'];
  let desvio = false;
  for (const [p, n] of decl) {
    const real = cuenta.get(p) ?? 0;
    if (real !== n) desvio = true;
    lineas.push(`| \`${p}\` | ${n} | ${real}${real === n ? '' : ' ⚠'} | ${cuenta.has(p) ? pisoDePunto(p) : '—'} |`);
  }
  if (desconocidos.size) {
    desvio = true;
    lineas.push('', `**✗ puntos que NO están en el inventario (cuentan a nada):** ${[...desconocidos].map(([k, v]) => `${k} ×${v}`).join(', ')}`);
  } else lineas.push('', 'Ningún ítem se desvía: cada uno cuenta al punto que declara.');
  return { lineas, desvio };
}
