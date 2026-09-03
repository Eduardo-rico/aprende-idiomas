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
import { PUNTOS_RO, pisoDePuntoRo, BLOQUES_RO } from '../../lib/data/languages/ro/inventario-puntos';
import { BLOCKS } from '../../lib/data/languages/ro/curriculum';
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


/** EL BLOQUEO ESTRUCTURAL, VISIBLE SIN INTENTAR PUBLICAR.
 *
 *  `curriculum.ts` sólo declara los bloques que tienen `lessons/bN.json`, y
 *  el publicador rechaza el lote ENTERO si el bloque de un ítem no está
 *  declarado. Eso significa que un bloque sin lecciones no puede recibir
 *  contenido — y hasta el 2026-09-03 ése era el estado de **B1, B2, C1 y
 *  C2 completos, 42 puntos, la mitad del curso**, sin que estuviera escrito
 *  en ninguna parte. Se descubrió con los 24 ítems del lote 17 ya escritos
 *  en la mano, y se habría vuelto a descubrir en el 18, en el 19 y en el
 *  20, cada vez con un lote hecho.
 *
 *  La pregunta que contesta, y sólo ésa: **¿qué puntos del inventario no
 *  pueden recibir un ítem aunque el ítem esté escrito y limpio?** No dice
 *  nada sobre si el contenido es bueno; dice si tiene dónde caer.
 *
 *  Un bloqueo que sólo se manifiesta al publicar se descubre siempre tarde.
 */
export interface BloqueoSinLeccion {
  bloque: number;
  slug: string;
  nombre: string;
  puntos: string[];
}

export function bloquesSinLeccion(
  bloquesConLeccion: ReadonlySet<number> = new Set(BLOCKS.map((b) => b.id)),
): BloqueoSinLeccion[] {
  const out: BloqueoSinLeccion[] = [];
  for (const b of BLOQUES_RO) {
    if (bloquesConLeccion.has(b.id)) continue;
    const puntos = PUNTOS_RO.filter((p) => p.bloque === b.id).map((p) => p.id);
    if (puntos.length) out.push({ bloque: b.id, slug: b.slug, nombre: b.nombre, puntos });
  }
  return out;
}
