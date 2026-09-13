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
  // Las formas PERIFRÁSTICAS son dos palabras —`missus esse`,
  // `vīsūrum esse`— y el marco se compara palabra a palabra. Sin partirlas,
  // `missus` salía como desconocida estando en el dominio: el barrido las
  // marcó en mi propio lote del infinitivo.
  cache = new Set(formasUnicasDeL1().flatMap((f) => [sinM(f), ...f.split(/\s+/).map(sinM)]));
  return cache;
}

/** Los enclíticos que el latín pega al final de la palabra anterior.
 *
 *  `venīsne` es `venīs` + `-ne`, y es latín normal. El corpus NO lo dice
 *  así: el treebank SEPARA el enclítico en dos tokens, así que `uenisne`
 *  sale ×0 y `ne` ×1.417. Buscar la palabra entera daría «esta forma no
 *  existe» cuando lo que pasa es que la fuente tokeniza distinto — y eso es
 *  un artefacto de la anotación disfrazado de hallazgo sobre la lengua. */
const ENCLITICOS = ['ne', 'que', 've'];

/** Las palabras del marco que la máquina de L1 no produce. Vacío es limpio.
 *  El hueco `___` y la puntuación se ignoran. */
export function palabrasDesconocidas(marco: string, exentas: string[] = []): string[] {
  const exento = new Set(exentas.map(sinM));
  const c = conocidas();
  const conocida = (w: string): boolean => {
    const k = sinM(w);
    if (c.has(k) || exento.has(k)) return true;
    // Con enclítico: se quita y se vuelve a preguntar por la palabra sola.
    for (const e of ENCLITICOS)
      if (k.length > e.length + 2 && k.endsWith(e) && c.has(k.slice(0, -e.length))) return true;
    return false;
  };
  return marco
    .replace('___', ' ')
    .split(/[^\p{L}]+/u)
    .filter((w) => w.length > 0)
    .map((w) => w.normalize('NFC'))
    .filter((w) => !conocida(w));
}
