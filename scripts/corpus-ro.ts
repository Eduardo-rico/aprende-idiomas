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

/** EL SEGUNDO CONTROL, Y ES EL QUE FALTABA (orden del coordinador,
 *  2026-09-03). El canario de arriba demuestra que la consulta ENCUENTRA
 *  lo que debe; no demuestra que **no encuentre lo que no debe**, y ése es
 *  justo el fallo que ya se pagó: `\b` disparaba DENTRO de las palabras
 *  con `ă â î ș ț` y el instrumento contaba de más sin que nada fallara.
 *
 *  `mașin` no es palabra rumana ninguna: sólo existe dentro de `mașină`,
 *  `mașini`, `mașinării`. Con el límite unicode tiene que dar CERO. Con
 *  `\b` da 300 y pico, porque la `ă` que sigue no es `\w`. Un cero aquí
 *  es la única prueba de que el límite de palabra funciona; si sale
 *  positivo, todos los números de la tanda están inflados. */
export const CANARIO_NEGATIVO = 'ma(ș|s)in';

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
 *  **RECHAZA `\b` Y `\w`**, y no los traduce por su cuenta: traducirlos
 *  exigiría saber de qué lado del token está y acertaría casi siempre, que
 *  es exactamente el aspecto de una regla a la que le falta una mitad
 *  (§4.13). Se rechazan y se dice con qué sustituirlos.
 *
 *  ══ POR QUÉ `\w` TAMBIÉN, Y ES LA MITAD QUE FALTABA ═════════════════
 *  La cabecera de `INI`/`FIN` YA decía que «`\w` es `[A-Za-z0-9_]` incluso
 *  con el flag `u`» — o sea que el proyecto conocía el hecho entero y sólo
 *  guardaba UNA de sus dos formas. `\b` estaba cerrado desde el lote 21;
 *  `\w` quedó abierto y **no falla, subcuenta en silencio**, que es peor:
 *  devuelve un número plausible.
 *
 *  Medido sobre este corpus el 2026-09-04, al comprobar una afirmación del
 *  lingüista sobre la marca doble del superlativo:
 *
 *    `[\p{L}]+ cel mai` → **821**      `\w+ cel mai` → **625**
 *
 *  Las 196 que faltan son EXACTAMENTE las palabras con `ă â î ș ț`, o sea
 *  justo el rumano: en `sfârșitul cel mai`, `\w+` sólo puede empezar
 *  después de la `ș` y ahí el `INI` unicode lo rechaza, así que la
 *  aparición se cae entera. Un patrón con `\w` no da error, da un número
 *  verdadero de otra cosa (§4.14), y por los cuatro patrones de aquel
 *  recuento la diferencia era 709 frente a 912.
 *
 *  ⚠ Y el gate de los lotes (`comprobarEnCorpus`) llama aquí, así que una
 *  `Comprobacion` con `\w` habría dado por atestada una afirmación con un
 *  tercio menos de apariciones — o habría declarado `ausente` algo
 *  presente. Hoy ningún lote usa `\w`; esto impide el primero. */
export function buscar(patron: string, ctx = 0): Hallazgo {
  if (/(?:^|[^\\])\\b/.test(patron))
    throw new Error(`el patrón «${patron}» usa \\b, que en JS no es unicode-aware y dispara dentro de las palabras rumanas (ă â î ș ț no son \\w). Usa ${INI} y ${FIN}.`);
  if (/(?:^|[^\\])\\[wW]/.test(patron))
    throw new Error(`el patrón «${patron}» usa \\w, que en JS es [A-Za-z0-9_] incluso con el flag u, así que NO casa ă â î ș ț y SUBCUENTA en silencio (medido: «[\\p{L}]+ cel mai» 821 frente a «\\w+ cel mai» 625). Usa [\\p{L}] o [\\p{L}\\p{N}].`);
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

/** El diagnóstico de los DOS controles, por separado, para poder decir
 *  CUÁL de los dos falló en vez de un «null» mudo. */
export function controles(): { positivo: number; negativo: number; ok: boolean; fallo: string | null } {
  const positivo = buscar(CANARIO).n;
  const negativo = buscar(INI + CANARIO_NEGATIVO + FIN).n;
  const fallo = positivo === 0
    ? `el canario POSITIVO «${CANARIO}» da cero: la consulta o el corpus están rotos, y entonces ningún cero significa nada`
    : negativo > 0
      ? `el canario NEGATIVO «${CANARIO_NEGATIVO}» da ${negativo} y tiene que dar cero: el límite de palabra está disparando DENTRO de las palabras, así que todos los números están inflados`
      : null;
  return { positivo, negativo, ok: fallo === null, fallo };
}

/** LA PUERTA HONESTA: corre una tanda CON LOS DOS CONTROLES delante. El
 *  positivo demuestra que la consulta encuentra lo que debe; el negativo,
 *  que no encuentra lo que no debe. Con uno solo el instrumento ya contó
 *  de más una vez. Devuelve null en vez de números en los que no se puede
 *  confiar. */
export function tanda(patrones: string[], ctx = 0): Hallazgo[] | null {
  if (!controles().ok) return null;
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
  if (!rs) { console.error(`CONTROL ROTO — ${controles().fallo}. No hay números que leer.`); process.exit(1); }
  console.log(`# Corpus rumano — ${T.split(' ').length.toLocaleString('es')} palabras · canario + «${CANARIO}» OK · canario − «${CANARIO_NEGATIVO}» 0 OK\n`);
  for (const r of rs) {
    console.log(`- \`${r.patron}\` → **${r.n}**`);
    for (const e of r.ejemplos) console.log(`    ${e}`);
  }
  console.log('\nLa PRESENCIA prueba; la AUSENCIA no prohíbe; el corpus tiene fecha (prosa XIX-XX).');
  // ⚠ LOS DOS INSTRUMENTOS NO CUENTAN LO MISMO, y callarlo ya costó una
  // atestación falsa. Esta CLI busca el patrón TAL CUAL, sin límite de
  // palabra; `comprobarEnCorpus()` —el gate de los lotes— lo envuelve en
  // INI/FIN. Con patrones que acaban en palabra corta la diferencia es
  // enorme y silenciosa: `cartea aceasta a` da 2 aquí y 0 con límites,
  // porque las dos son «acuma» y «Agata». Un número correcto sobre una
  // forma ambigua es un número verdadero que mide otra cosa.
  console.log('⚠ Esta CLI NO pone límite de palabra: envuelve tú el patrón en INI/FIN, o LEE los aciertos con --ctx. `comprobarEnCorpus()` sí lo pone, así que los dos números pueden no coincidir.');
}
