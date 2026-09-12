// scripts/lib/gate-vocabulario-del-marco.ts
//
// ¿EL MARCO USA PALABRAS QUE EL ALUMNO CONOCE?
//
// Sale del pase adversarial sobre el lote del infinitivo, ya verde: cuatro
// de sus doce marcos usaban palabras que no están en L1 —`scīmus`,
// `crēdunt`, `mundus`, `nūntius`, `vērum`—. Ninguna rompía nada: el gate
// miraba la respuesta, no el contexto, así que un marco escrito con
// vocabulario que el alumno no ha visto pasaba limpio. Y un ítem cuyo marco
// no se entiende no mide la forma: mide si adivinas de qué va la frase.
//
// ── POR QUÉ VIVE AQUÍ Y NO DENTRO DE UN GATE ─────────────────────────
//
// Porque le pasa a TODOS los formatos con marco latino, y hoy mismo llevo
// dos arreglos de reglas duplicadas. Se escribe una vez y la llaman todos.
//
// ── LO QUE NO COMPRUEBA, DICHO ───────────────────────────────────────
//
// Compara FORMAS, no lemas: una forma que la máquina no produzca sale como
// desconocida aunque su lema esté en el lexicón. Eso es deliberado —si la
// máquina no la produce, el alumno no la ha visto conjugada así— pero
// significa que la lista de excepciones hay que mirarla, no ampliarla a
// ciegas.
import { formasUnicasDeL1 } from '../../lib/data/languages/la/todas-las-formas';

const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase()
    .replace(/v/g, 'u').replace(/j/g, 'i');

let cache: Set<string> | null = null;
function conocidas(): Set<string> {
  if (cache) return cache;
  cache = new Set(formasUnicasDeL1().map(sinM));
  return cache;
}

/** Las palabras del marco que la máquina de L1 no produce. Vacío es limpio.
 *  El hueco `___` y la puntuación se ignoran. */
export function palabrasDesconocidas(marco: string, exentas: string[] = []): string[] {
  const exento = new Set(exentas.map(sinM));
  const c = conocidas();
  return marco
    .replace('___', ' ')
    .split(/[^\p{L}]+/u)
    .filter((w) => w.length > 0)
    .map((w) => w.normalize('NFC'))
    .filter((w) => !c.has(sinM(w)) && !exento.has(sinM(w)));
}
