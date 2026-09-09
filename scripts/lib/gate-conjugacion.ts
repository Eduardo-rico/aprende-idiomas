// scripts/lib/gate-conjugacion.ts
//
// GATE DE «QUÉ CONJUGACIÓN ES». Punto: `l5-conjugacion-por-infinitivo`.
//
// «amāre (1.ª), monēre (2.ª), regere (3.ª), audīre (4.ª), capere (mixta). La
// cantidad de la vocal separa `monēre` de `regere`, y sin macrón no se
// distinguen.» `varia`: la conjugación, y hay que traer la mixta.
//
// ── EL MACRÓN AQUÍ SÍ, Y CONVIENE DECIR POR QUÉ ──────────────────────
//
// La política del 9 de septiembre dice que el marco va sin macrones porque
// el alumno leerá 227.301 tokens sin ninguno. Este punto parecía chocar con
// ella, y no choca: **su marco no es texto corrido, es una entrada de
// diccionario**, y los diccionarios sí marcan la cantidad. La regla es sobre
// el latín que se lee, no sobre la ficha del lexicón.
//
// ── LAS DOS RUTAS CIEGAS, Y LA SEGUNDA ES EL PUNTO ───────────────────
//
// **Mirar sólo el infinitivo SIN cantidad**: `-āre`→1.ª, `-īre`→4.ª, y
// `-ere` sin distinguir si la `e` es larga. Confunde la 2.ª con la 3.ª, que
// es lo que el punto nombra.
//
// **Mirar sólo el infinitivo CON cantidad**: acierta la 1.ª, la 2.ª, la 3.ª
// y la 4.ª… y falla SIEMPRE en la mixta, porque `capere` se escribe igual
// que `legere` con macrón y sin él. La mixta no está en el infinitivo: está
// en la primera parte principal, en el `-iō` de `capiō` frente al `-ō` de
// `legō`. Por eso el `varia` dice «hay que traer la mixta, que es la que
// nadie ve», y por eso el ítem tiene que dar las DOS partes.
import { esMixta, type EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

export type Conjugacion = '1ª' | '2ª' | '3ª' | '4ª' | 'mixta';
export const CONJUGACIONES: Conjugacion[] = ['1ª', '2ª', '3ª', '4ª', 'mixta'];

const sinCantidad = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC');

/** La conjugación de verdad, calculada. `esMixta` va PRIMERO porque la mixta
 *  tiene el mismo infinitivo que la 3.ª y sólo la delata el `-iō`. */
export function conjugacionDe(v: EntradaVerbal): Conjugacion {
  if (esMixta(v)) return 'mixta';
  const i = v.infinitivo.normalize('NFC');
  if (i.endsWith('āre')) return '1ª';
  if (i.endsWith('ēre')) return '2ª';
  if (i.endsWith('īre')) return '4ª';
  if (i.endsWith('ere')) return '3ª';
  throw new Error(`«${v.infinitivo}» no es de ninguna de las cinco clases`);
}

/** Ruta ciega 1: leer el infinitivo ignorando la cantidad. */
export function soloElInfinitivoSinCantidad(v: EntradaVerbal): Conjugacion {
  const i = sinCantidad(v.infinitivo);
  if (i.endsWith('are')) return '1ª';
  if (i.endsWith('ire')) return '4ª';
  return '3ª';   // todo `-ere` se lee como 3.ª: es la confusión que el punto nombra
}

/** Ruta ciega 2: leer el infinitivo CON cantidad y no mirar la otra parte. */
export function soloElInfinitivoConCantidad(v: EntradaVerbal): Conjugacion {
  const i = v.infinitivo.normalize('NFC');
  if (i.endsWith('āre')) return '1ª';
  if (i.endsWith('ēre')) return '2ª';
  if (i.endsWith('īre')) return '4ª';
  return '3ª';   // `capere` cae aquí, y es la mixta: por eso la ruta falla
}

export interface ItemConjugacion {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  /** La entrada tal como se le muestra: las DOS primeras partes. Sin ellas
   *  la mixta es indistinguible de la 3.ª. */
  entrada: string;
  respuesta: Conjugacion;
  pista: string;
}

export type ClaseFalloC =
  | 'respuesta-no-derivada' | 'entrada-incompleta' | 'clase-sin-cubrir'
  | 'ruta-ciega' | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloC { item: string; clase: ClaseFalloC; detalle: string }

/** El azar con cinco clases. */
export const TECHO_CINCO = 1 / 5;

// ── EL SUELO QUE PONE LA LENGUA, QUINTA VEZ ──────────────────────────
//
// La ruta «leer el infinitivo sin cantidad» sacó el 64 % y el gate la marcó
// contra un techo fijo del 20 %. El techo estaba mal, no el lote: un alumno
// que lee la desinencia e ignora la raya **debe** acertar `-āre` y `-īre`,
// porque ahí no hay ninguna cantidad que leer. Eso es saber, no adivinar.
//
// Lo que la lengua le regala:
//
//     los ítems de 1.ª y de 4.ª, enteros — su desinencia no depende de la raya
//   + un tercio de los demás — `-ere` puede ser 2.ª, 3.ª o mixta y elige al azar
//
// Con este lote: 6/14 + (1/3)(8/14) = 62 %. La tasa real es el 64 %, o sea
// que el lote no regala nada por encima de lo que la escritura ya daba.
//
// Comparar contra el 20 % del azar de cinco valores habría dado por fugado
// un lote correcto, y «arreglarlo» habría significado quitar la 1.ª y la 4.ª
// —o sea, dejar de cubrir dos de las cinco clases que el punto pide— para
// que un número quedara bonito. Es la quinta vez que aparece la figura y la
// primera en que el listón mal puesto empujaba a ROMPER la cobertura.

/** Lo que la ruta sin cantidad acierta sin ejercer la destreza que le falta. */
export function pisoSinCantidad(items: ItemConjugacion[]): number {
  const n = items.length || 1;
  const inequivocos = items.filter((it) => it.respuesta === '1ª' || it.respuesta === '4ª').length;
  return (inequivocos + (n - inequivocos) / 3) / n;
}

export function revisarItemConjugacion(it: ItemConjugacion): FalloC[] {
  const out: FalloC[] = [];
  const push = (clase: ClaseFalloC, detalle: string) => out.push({ item: it.id, clase, detalle });

  const real = conjugacionDe(it.verbo);
  if (real !== it.respuesta)
    push('respuesta-no-derivada', `la máquina dice ${real} y el ítem escribe ${it.respuesta}`);

  // La entrada tiene que traer las DOS partes: sin el `-iō` de la primera,
  // la mixta es literalmente indistinguible de la 3.ª.
  if (!it.entrada.includes(it.verbo.lema) || !it.entrada.includes(it.verbo.infinitivo))
    push('entrada-incompleta',
      `«${it.entrada}» no muestra las dos primeras partes («${it.verbo.lema}», «${it.verbo.infinitivo}»), y sin la primera la mixta no se puede distinguir de la 3.ª`);

  return out;
}

export function revisarLoteConjugacion(items: ItemConjugacion[]): {
  fallos: FalloC[]; rutas: { sinCantidad: number; conCantidad: number; constante: number };
  piso: number; cobertura: Cobertura[];
} {
  const fallos = items.flatMap(revisarItemConjugacion);
  const push = (clase: ClaseFalloC, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });
  const n = items.length || 1;

  for (const c of CONJUGACIONES)
    if (!items.some((it) => it.respuesta === c))
      push('clase-sin-cubrir', `el punto pide las cinco clases y falta «${c}»`);

  const rutas = {
    sinCantidad: items.filter((it) => soloElInfinitivoSinCantidad(it.verbo) === it.respuesta).length / n,
    conCantidad: items.filter((it) => soloElInfinitivoConCantidad(it.verbo) === it.respuesta).length / n,
    constante: Math.max(...CONJUGACIONES.map((c) => items.filter((it) => it.respuesta === c).length)) / n,
  };
  // La ruta CON cantidad no se compara contra el azar: leer bien el
  // infinitivo es media destreza del punto y acierta cuatro de cinco clases
  // por derecho. Lo que se le exige es que FALLE en la mixta, y eso lo
  // comprueba la cobertura, no un techo.
  const piso = pisoSinCantidad(items);
  if (rutas.sinCantidad > piso + 0.1)
    push('ruta-ciega',
      `leer el infinitivo ignorando la cantidad acierta el ${(100 * rutas.sinCantidad).toFixed(0)} %, y la escritura sólo le regalaba el ${(100 * piso).toFixed(0)} %: la diferencia la pone el diseño del lote`);
  if (rutas.constante > TECHO_CINCO + 0.15)
    push('ruta-ciega',
      `contestar siempre la misma clase acierta el ${(100 * rutas.constante).toFixed(0)} %, por encima del ${100 * TECHO_CINCO} % del azar de cinco valores`);

  const sep = separablePorPosicion(items.map((it) => (it.respuesta === '1ª' ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const mixtas = items.filter((it) => it.respuesta === 'mixta');
  const cobertura: Cobertura[] = [
    { comprobacion: 'la conjugación contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'ítems que la ruta del infinitivo NO puede', decididos:
        items.filter((it) => soloElInfinitivoConCantidad(it.verbo) !== it.respuesta).length,
      total: items.length,
      motivoDeLosQueQuedanFuera: 'los que se resuelven leyendo bien el infinitivo, que es media destreza del punto y vale. Los que quedan dentro son las mixtas: las únicas donde hay que mirar la PRIMERA parte principal, y por eso el varia las exige' },
  ];
  if (mixtas.length === 0) push('clase-sin-cubrir', 'sin mixtas, la ruta del infinitivo resuelve el lote entero');
  fallos.push(...revisarCobertura(cobertura));

  return { fallos, rutas, piso, cobertura };
}
