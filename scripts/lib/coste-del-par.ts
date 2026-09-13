// scripts/lib/coste-del-par.ts — LO QUE CUESTA UN LOTE DE PARES MÍNIMOS.
//
// Vive aparte y no dentro de un gate porque le pasa a TODO lote construido
// por pares, y una regla copiada falla en la copia N+1 que nadie
// sincronizó (§A3). Hoy la usan `gate-reflexivo` y `gate-dativo-posesivo`.
//
// ── Y LA MITAD DE ESTO YA ESTABA ESCRITA, EN PORTUGUÉS ───────────────
//
// `scripts/lib/pares-minimos.ts` —el generador de juicios de
// gramaticalidad del portugués— tiene `SEPARACION_MINIMA = 3` y su
// `separacionOk` desde hace meses, con el mismo argumento y el mismo
// número. Los gates de latín no lo llamaban, y el piso de distancia se
// volvió a descubrir desde cero en el pase adversarial del reflexivo.
//
// **Es la segunda vez que pasa lo mismo con este fichero**: la nota de
// `orden-publicado.ts` cuenta que `separablePorPosicion` «YA ESTABA EN EL
// REPOSITORIO desde portugués» y que ninguno de los cinco gates de latín
// lo llamaba, y que cuatro de los cinco lotes se resolvían contando
// ejercicios. Por eso el número **se importa de allí** en vez de
// reescribirse: lo único que aporta este fichero es el TECHO, que allí no
// está.
//
// ── EL HALLAZGO QUE LO PAGÓ ──────────────────────────────────────────
//
// El par mínimo es la defensa fuerte contra las pistas del marco: dos
// ítems que comparten el marco entero y sólo difieren en el rasgo
// examinado, de modo que toda propiedad del marco es constante dentro del
// par y se cae sola, sin necesidad de detectarla.
//
// **Y al serlo, pone el MISMO marco dos veces en el lote.** Quien
// reconozca el reencuentro y conteste lo contrario de la primera vez
// acierta el segundo ítem de cada par sin leer una palabra:
//
//     techo = (segundos + ½·primeros) / n = 0,75 con todos los ítems
//             emparejados
//
// Lo salió a buscar el pase adversarial del lote del reflexivo, donde
// ninguna de las cinco estrategias medidas podía verlo: las cinco leen el
// marco y por eso salen clavadas en 0,50, que es exactamente lo que el
// emparejamiento garantiza.
//
// ── POR QUÉ NO ES UN UMBRAL ──────────────────────────────────────────
//
// Porque **no baja barajando**. Un rojo que no se puede apagar es un gate
// que se acaba desactivando (§B9). Lo único que el orden publicado puede
// mover es la DISTANCIA entre los dos miembros, o sea cuánta memoria
// cuesta reconocer el marco: a distancia 1 no cuesta nada, a distancia 3
// hay que acordarse de tres ejercicios atrás.
//
// Así que el techo se DECLARA con su número y lo que se exige es el piso
// de distancia. Es la misma forma que el suelo que pone la lengua
// (§1.undecies del relevo): una propiedad del diseño que no se tapa, se
// mide y se declara.

import { SEPARACION_MINIMA } from './pares-minimos';

/** El piso, absoluto y no contra la medida de hoy (§B7). Es el MISMO
 *  número que usa el generador del portugués, importado y no copiado. */
export const DISTANCIA_MINIMA_EN_EL_PAR = SEPARACION_MINIMA;

/** El techo de «contestar lo contrario de la vez anterior». No depende del
 *  orden: barajar no lo mueve. */
export function techoDeLaSegundaVez(items: { pareja: string }[]): { techo: number; segundos: number; n: number } {
  const vistos = new Set<string>();
  let segundos = 0;
  for (const i of items) {
    if (vistos.has(i.pareja)) segundos++;
    else vistos.add(i.pareja);
  }
  const n = items.length;
  return { techo: n === 0 ? 0 : (segundos + 0.5 * (n - segundos)) / n, segundos, n };
}

/** La distancia en el orden publicado entre los dos ítems de cada par,
 *  de menor a mayor. Los pares incompletos no salen: de eso se queja el
 *  gate por otro lado. */
export function distanciasEnElPar(items: { pareja: string }[]): { pareja: string; distancia: number }[] {
  const pos = new Map<string, number[]>();
  items.forEach((i, k) => pos.set(i.pareja, [...(pos.get(i.pareja) ?? []), k]));
  return [...pos].filter(([, ks]) => ks.length === 2)
    .map(([pareja, ks]) => ({ pareja, distancia: ks[1]! - ks[0]! }))
    .sort((a, b) => a.distancia - b.distancia);
}

/** El renglón de cobertura que declara el techo y el piso. Lo llaman los
 *  dos gates para que digan lo mismo. */
export function coberturaDeLosPares(items: { pareja: string }[]) {
  const d = distanciasEnElPar(items);
  const t = techoDeLaSegundaVez(items);
  return {
    comprobacion: 'la distancia mínima entre los dos ítems de un par',
    decididos: d[0]?.distancia ?? 0,
    total: items.length,
    motivoDeLosQueQuedanFuera:
      `no es una fracción: es la distancia del par más pegado, y el piso son ${DISTANCIA_MINIMA_EN_EL_PAR}. ` +
      `Va aquí porque el techo de «lo contrario de la vez anterior» (${t.techo.toFixed(2)}) no se arregla barajando ` +
      'y lo único que se puede subir es lo que cuesta reconocer el marco',
  };
}
