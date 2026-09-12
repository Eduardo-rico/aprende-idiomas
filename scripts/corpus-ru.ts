// scripts/corpus-ru.ts — EL SEGUNDO CAMINO DE LA ATESTACIÓN, EN RUSO.
//
//   npx tsx scripts/corpus-ru.ts "не открывай" "не открой"
//   npx tsx scripts/corpus-ru.ts --ctx "он приходил"
//
// Las 2.180 lecturas de `lib/data/languages/ru/lecturas/` son ~7,7 millones
// de palabras de ruso atestado (medido: `paso0-idioma --lang=ru`). Es el
// segundo camino que NO comparte método ni fuente con el lingüista: los dos
// no se equivocan juntos. En rumano confirmó tres afirmaciones suyas y
// refutó dos que él había firmado como determinadas.
//
// ══ LAS TRES ASIMETRÍAS, y hay que repetirlas en voz alta ═════════════
// 1. **La PRESENCIA prueba.** Si la forma sale en prosa corriente, no se
//    puede marcar agramatical.
// 2. **La AUSENCIA NO PROHÍBE.** Cero apariciones no es cita normativa.
// 3. **El corpus TIENE FECHA.** Es prosa del XIX y principios del XX,
//    transcrita en ortografía post-1918. Atestigua ESA lengua. Para el
//    ruso esto muerde más que en rumano: `ея`, `оне`, el vocativo `отче`
//    y el aoristo eclesiástico salen, y no son ruso de hoy.
//
// ══ Y LA CUARTA, QUE ES LA QUE MUERDE EN CIRÍLICO ════════════════════
// **`\b` y `\w` de JavaScript no son unicode-aware.** `\w` es
// `[A-Za-z0-9_]` INCLUSO con el flag `u`, así que en cirílico cuenta
// **CERO y no da error**: es el peor fallo posible, el que devuelve un
// número plausible. `\b`, por lo mismo, dispara ENTRE dos letras
// cirílicas y cuenta de más. Los dos se RECHAZAN aquí, con su testigo en
// `tests/unit/corpus-ru.test.ts`.
//
// Y el script no te deja leer un cero a solas: cada tanda corre **dos**
// controles —un canario POSITIVO que tiene que salir y uno NEGATIVO que
// tiene que dar cero— porque el positivo demuestra que la consulta
// encuentra lo que debe y sólo el negativo demuestra que el límite de
// palabra funciona.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'lib/data/languages/ru/lecturas';

/** Cadena que SABEMOS que está. Si no sale, la consulta o la carga están
 *  rotas y cualquier cero de la tanda es basura. */
export const CANARIO = 'что он';

/** Tiene que dar CERO con límite de palabra. `сегодн` no es palabra rusa
 *  ninguna: sólo existe dentro de `сегодня`, `сегодняшний`. Con `\b` de
 *  JavaScript da positivo, porque la `я` que sigue NO es `\w`. Un cero
 *  aquí es la única prueba de que el límite funciona sobre cirílico. */
export const CANARIO_NEGATIVO = 'сегодн';

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

/** LÍMITE DE PALABRA DE VERDAD, escrito con clases unicode. */
export const FIN = '(?![\\p{L}\\p{N}])';
export const INI = '(?<![\\p{L}\\p{N}])';

/** Cuenta un patrón con límite de palabra a los dos lados y devuelve
 *  contexto. `patron` es regex en texto y se compila con `iu`.
 *
 *  **RECHAZA `\b`, `\w`, `\W` y `\B`** y no los traduce por su cuenta:
 *  traducirlos exigiría saber de qué lado del token está, acertaría casi
 *  siempre, y una regla que acierta casi siempre es justo el aspecto de
 *  una a la que le falta una mitad. */
export function buscar(patron: string, ctx = 0): Hallazgo {
  const desnudo = patron.replace(/\\\\/g, '');
  const malo = /\\[bwWB]/.exec(desnudo);
  if (malo) {
    throw new Error(
      `PATRÓN RECHAZADO: «${patron}» usa ${malo[0]}. En JavaScript \\w es ` +
      `[A-Za-z0-9_] incluso con el flag u, así que sobre cirílico cuenta CERO ` +
      `sin dar error, y \\b dispara entre dos letras rusas. Usa ${INI} y ${FIN} ` +
      `(o las constantes INI/FIN de este módulo) y clases \\p{L}.`,
    );
  }
  const re = new RegExp(INI + '(?:' + patron + ')' + FIN, 'giu');
  const texto = corpus();
  const ejemplos: string[] = [];
  let n = 0;
  for (const m of texto.matchAll(re)) {
    n++;
    if (ctx > 0 && ejemplos.length < 12) {
      const i = m.index ?? 0;
      ejemplos.push(texto.slice(Math.max(0, i - ctx), i + m[0].length + ctx));
    }
  }
  return { patron, n, ejemplos };
}

/** Los DOS controles. `ok` sólo es cierto si el positivo sale y el
 *  negativo da cero. */
export function controles(): { positivo: number; negativo: number; ok: boolean } {
  const positivo = buscar(CANARIO).n;
  const negativo = buscar(CANARIO_NEGATIVO).n;
  return { positivo, negativo, ok: positivo > 0 && negativo === 0 };
}

if (/[/\\]corpus-ru\.ts$/.test(process.argv[1] ?? '')) {
  const args = process.argv.slice(2);
  const conCtx = args[0] === '--ctx';
  const patrones = conCtx ? args.slice(1) : args;
  const c = controles();
  if (!c.ok) {
    console.error(`CONTROLES EN ROJO: positivo «${CANARIO}»=${c.positivo} (debe ser >0), ` +
      `negativo «${CANARIO_NEGATIVO}»=${c.negativo} (debe ser 0). No se informa de ningún número.`);
    process.exit(1);
  }
  console.log(`controles OK — «${CANARIO}» ${c.positivo} · «${CANARIO_NEGATIVO}» ${c.negativo}\n`);
  console.log('⚠ ESTA CLI busca con límite de palabra a los dos lados, igual que el gate.');
  for (const p of patrones) {
    const h = buscar(p, conCtx ? 60 : 0);
    console.log(`${h.n}\t${p}`);
    for (const e of h.ejemplos) console.log(`   … ${e.replace(/\s+/g, ' ')} …`);
  }
}
