// scripts/corpus-ro.ts — EL SEGUNDO CAMINO DE LA ATESTACIÓN.
//
//   npx tsx scripts/corpus-ro.ts "de spălat" "de spăla" …
//   npx tsx scripts/corpus-ro.ts --ctx "mașină de spălat"     # con contexto
//
// Las 817 lecturas de `lib/data/languages/ro/lecturas/` son ~2,9 millones
// de palabras de rumano atestado, y hasta el lote 21 nadie las usaba para
// VALIDAR. Es un segundo camino que **no comparte método ni fuente con el
// lingüista adversarial**, así que los dos no se equivocan juntos: en el
// lote 21 confirmó tres de sus afirmaciones y refutó dos, las dos que él
// había firmado como determinadas y que ya estaban escritas como ítems.
//
// ══ LAS TRES REGLAS DE USO, Y NO SON OPCIONALES ══════════════════════
//
// 1. **La PRESENCIA prueba.** Si la forma aparece en prosa corriente, no
//    se puede marcar agramatical. Es lo único para lo que sirve solo.
// 2. **La AUSENCIA NO PROHÍBE.** Cero apariciones no es una cita
//    normativa (§0.4/2). Sirve para dudar, nunca para poner un asterisco.
// 3. **El corpus TIENE FECHA.** Prosa del XIX-XX: atestigua ESA lengua.
//    `decît` con «î» sale, y es grafía antigua, no norma de hoy.
//
// ══ Y LA CUARTA, QUE ES LA QUE MUERDE ════════════════════════════════
// **No te fíes de un cero sin haber visto la consulta cazar algo.** En el
// lote 21 un `\b` doble-escapado devolvió ceros plausibles —ni error ni
// excepción— en la consulta de la que colgaba el lote entero: dijo que
// `mai bun decât` no aparecía nunca, y aparece 16 veces. Una búsqueda que
// devuelve cero es indistinguible de una búsqueda rota.
//
// Por eso este script **no te deja leer un cero a solas**: con cada tanda
// corre un CANARIO —una cadena que sabemos que está— y si el canario no
// aparece, aborta en vez de informar de ceros. El canario no es
// decoración: es la única diferencia entre «no está» y «no busqué».
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'lib/data/languages/ro/lecturas';

/** Cadena que SABEMOS que está en el corpus. Si no sale, la consulta está
 *  rota o el corpus no se cargó, y cualquier cero de esa tanda es basura. */
export const CANARIO = 'mai mare decât';

let cache: string | null = null;
export function corpus(): string {
  if (cache) return cache;
  const trozos: string[] = [];
  const walk = (o: unknown): void => {
    if (typeof o === 'string') trozos.push(o);
    else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  };
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json')))
    walk(JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));
  cache = trozos.join(' ').replace(/\s+/g, ' ');
  return cache;
}

export interface Hallazgo { patron: string; n: number; ejemplos: string[] }

/** LÍMITE DE PALABRA DE VERDAD. `\b` de JavaScript **no es
 *  unicode-aware**: `\w` es `[A-Za-z0-9_]` incluso con el flag `u`, así
 *  que `ă â î ș ț` cuentan como NO-palabra y `\b` dispara DENTRO de la
 *  palabra. Medido aquí: `de face\b` daba 5 y una de las 5 era «unde
 *  faceți». En una lengua cuyo alfabeto son justo esos cinco caracteres,
 *  `\b` no es un límite: es ruido correlacionado con los diacríticos. */
export const FIN = '(?![\\p{L}\\p{N}])';
export const INI = '(?<![\\p{L}\\p{N}])';

/** Cuenta un patrón y devuelve contexto. `patron` es una regex en texto:
 *  se compila con `iu`, así que las clases unicode funcionan.
 *
 *  **RECHAZA `\b`**, y no lo traduce por su cuenta: traducirlo exigiría
 *  saber de qué lado del token está y acertaría casi siempre, que es
 *  exactamente el aspecto de una regla a la que le falta una mitad
 *  (§4.13). Se rechaza y se dice con qué sustituirlo. */
export function buscar(patron: string, ctx = 0): Hallazgo {
  if (/(?:^|[^\\])\\b/.test(patron))
    throw new Error(`el patrón «${patron}» usa \\b, que en JS no es unicode-aware y dispara dentro de las palabras rumanas (ă â î ș ț no son \\w). Usa ${INI} y ${FIN}.`);
  const T = corpus();
  const re = new RegExp(patron, 'giu');
  const ejemplos: string[] = [];
  let n = 0;
  for (const m of T.matchAll(re)) {
    n++;
    if (ctx && ejemplos.length < ctx)
      ejemplos.push('…' + T.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80) + '…');
  }
  return { patron, n, ejemplos };
}

/** LA PUERTA HONESTA: corre una tanda CON el canario delante. Si el
 *  canario da cero, tira — porque entonces los otros ceros no significan
 *  nada. Devuelve null en vez de números en los que no se puede confiar. */
export function tanda(patrones: string[], ctx = 0): Hallazgo[] | null {
  const canario = buscar(CANARIO);
  if (canario.n === 0) return null;
  return patrones.map((p) => buscar(p, ctx));
}

if (/[/\\]corpus-ro\.ts$/.test(process.argv[1] ?? '')) {
  const ctx = process.argv.includes('--ctx') ? 4 : 0;
  const patrones = process.argv.slice(2).filter((a) => a !== '--ctx');
  if (!patrones.length) { console.error('Usa: npx tsx scripts/corpus-ro.ts [--ctx] <patrón> …'); process.exit(2); }
  const T = corpus();
  let rs: Hallazgo[] | null;
  try { rs = tanda(patrones, ctx); }
  catch (e) { console.error(`PATRÓN RECHAZADO — ${(e as Error).message}`); process.exit(2); }
  if (!rs) { console.error(`CANARIO «${CANARIO}» a cero: la consulta o el corpus están rotos. No hay números que leer.`); process.exit(1); }
  console.log(`# Corpus rumano — ${T.split(' ').length.toLocaleString('es')} palabras · canario «${CANARIO}» OK\n`);
  for (const r of rs) {
    console.log(`- \`${r.patron}\` → **${r.n}**`);
    for (const e of r.ejemplos) console.log(`    ${e}`);
  }
  console.log('\nLa PRESENCIA prueba; la AUSENCIA no prohíbe; el corpus tiene fecha (prosa XIX-XX).');
}
