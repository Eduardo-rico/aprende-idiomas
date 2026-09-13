// scripts/lib/asigna-ru.ts — EL CONTADOR CANÓNICO DE PUNTOS DEL RUSO, en un
// solo sitio, para que la foto del déficit y cualquier `--asigna` futuro no
// puedan discrepar.
//
// Es el hermano de `asigna-ro.ts` y existe por la misma razón: una regla
// copiada se desincroniza y falla en la copia N+1 que nadie añadió. Lo que
// NO se hace es importar el de rumano y parametrizarlo por idioma: cada
// inventario tiene su propio tipo de punto y su propio `pisoDePunto…`, y
// una abstracción que los una tendría que elegir cuál de los dos contratos
// gana. Se escribe dos veces a propósito y se dice.
//
// Qué certifica: a qué punto del inventario cuenta cada ítem DE VERDAD, que
// no tiene por qué ser el que declara — un `concepts` que no existe en el
// inventario cuenta CERO y nadie lo nota, porque el total del lote sigue
// siendo 11.
//
// Qué NO certifica: que el ítem MIDA su punto. Eso es del lingüista y de los
// testigos del propio lote.
import { PUNTOS_RU, pisoDePuntoRu, BLOQUES_RU } from '../../lib/data/languages/ru/inventario-puntos';
import { BLOCKS } from '../../lib/data/languages/ru/curriculum';
import { servibleAlAlumno } from './estado-item';

export interface CuentaRu {
  /** punto → ítems servibles que le cuentan. Los puntos a cero están
   *  presentes: el universo lo da el inventario, no el corpus. */
  cuenta: Map<string, number>;
  /** conceptos que NO están en el inventario: cuentan a nada. */
  desconocidos: Map<string, number>;
  servibles: number;
}

export function contarPuntosRu(items: any[]): CuentaRu {
  const servibles = items.filter(servibleAlAlumno);
  const cuenta = new Map<string, number>(PUNTOS_RU.map((p) => [p.id, 0]));
  const desconocidos = new Map<string, number>();
  for (const x of servibles) for (const c of ((x?.concepts ?? []) as string[])) {
    if (cuenta.has(c)) cuenta.set(c, cuenta.get(c)! + 1);
    else desconocidos.set(c, (desconocidos.get(c) ?? 0) + 1);
  }
  return { cuenta, desconocidos, servibles: servibles.length };
}

/** El piso REAL, que puede ser CERO o reducido cuando el punto lo declara
 *  con su motivo escrito. Mirar sólo el nivel haría que un punto declarado
 *  «0 ítems por diseño» siguiera cobrando 8 unidades: la declaración viviría
 *  en la prosa y el número no la conocería. */
export const pisoDePunto = (() => {
  const porId = new Map(PUNTOS_RU.map((p) => [p.id, p]));
  return (id: string) => { const p = porId.get(id); return p ? pisoDePuntoRu(p) : 8; };
})();

/** EL BLOQUEO ESTRUCTURAL, VISIBLE SIN INTENTAR PUBLICAR. `curriculum.ts`
 *  sólo declara los bloques con `lessons/bN.json`, y el publicador rechaza el
 *  lote ENTERO si el bloque de un ítem no está declarado. Un bloqueo que sólo
 *  se manifiesta al publicar se descubre siempre tarde: en rumano se descubrió
 *  con los 24 ítems del lote 17 ya escritos en la mano. */
export interface BloqueoSinLeccionRu { bloque: number; slug: string; nombre: string; puntos: string[] }

export function bloquesSinLeccionRu(
  bloquesConLeccion: ReadonlySet<number> = new Set(BLOCKS.map((b) => b.id)),
): BloqueoSinLeccionRu[] {
  const out: BloqueoSinLeccionRu[] = [];
  for (const b of BLOQUES_RU) {
    if (bloquesConLeccion.has(b.id)) continue;
    out.push({ bloque: b.id, slug: b.slug, nombre: b.nombre, puntos: PUNTOS_RU.filter((p) => p.bloque === b.id).map((p) => p.id) });
  }
  return out;
}
