// scripts/lib/atestar-infinitivos.ts
//
// CONGELA LA ATESTACIÓN DE LOS CINCO INFINITIVOS. Genera
// `lib/data/languages/la/atestacion-infinitivos.json`.
//
//   npx tsx scripts/lib/atestar-infinitivos.ts
//
// Mismo motivo que los otros dos congeladores: los treebanks están en
// `.gitignore`. El contador del corpus se importa, no se copia.
//
// ── LOS PERIFRÁSTICOS SE CUENTAN POR SU PRIMERA PALABRA ──────────────
//
// `amātus esse` y `amātūrus esse` son dos palabras, y el `esse` es de todo
// el mundo: contar el bigrama sería lo correcto para la LOCUCIÓN, pero el
// participio suelto es lo que dice si la forma existe. Se cuentan las dos
// cosas y se guardan las dos, porque significan cosas distintas: el
// participio dice «esta forma del verbo existe» y el bigrama dice «esta
// construcción aparece».
import fs from 'node:fs';
import path from 'node:path';
import { contarCorpus, sinCantidad } from './atestar-irregulares';
import { VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { conjugacionDe } from '../../lib/data/languages/la/paradigma-la';
import { todosLosInfinitivos } from '../../lib/data/languages/la/infinitivos';

const SALIDA = 'lib/data/languages/la/atestacion-infinitivos.json';

if (process.argv[1] && path.resolve(process.argv[1]).endsWith('atestar-infinitivos.ts')) {
  const { unigramas, bigramas } = contarCorpus();
  const lemas: Record<string, Record<string, { forma: string; n: number; bigrama?: number }>> = {};
  const total: Record<string, number> = {};
  for (const v of VERBOS_L1) {
    try { conjugacionDe(v); } catch { continue; }
    lemas[v.lema] = {};
    // Los perifrásticos se congelan por GÉNERO Y CASO, porque son formas
    // distintas: `factus esse`, `factum esse`, `facta esse`. Comprobar la
    // atestación de `factum` contra la cuenta de `factus` es preguntar por
    // una forma y creerse la respuesta de otra.
    for (const g of ['m', 'f', 'n'] as const)
      for (const c of ['nom', 'ac'] as const)
        for (const i of todosLosInfinitivos(v, g, c)) {
          const clave = i.perifrastico ? `${i.tiempo}.${i.voz}.${g}.${c}` : `${i.tiempo}.${i.voz}`;
          if (lemas[v.lema]![clave]) continue;
          const primera = sinCantidad(i.forma.split(' ')[0]!);
          const n = unigramas.get(primera) ?? 0;
          const bi = i.perifrastico ? (bigramas.get(sinCantidad(i.forma)) ?? 0) : undefined;
          lemas[v.lema]![clave] = { forma: i.forma, n, ...(bi === undefined ? {} : { bigrama: bi }) };
          const tot = `${i.tiempo}.${i.voz}`;
          if (!i.perifrastico || (g === 'm' && c === 'nom')) total[tot] = (total[tot] ?? 0) + n;
        }
  }
  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'la_perseus + la_proiel (UD)',
    comoSeCuenta: 'los simples por unigrama; los perifrásticos por su PRIMERA palabra (el participio, que es lo que dice si la forma del verbo existe) y además por el bigrama con «esse», que dice si la construcción aparece',
    total, lemas,
  }, null, 1)}\n`);
  for (const [k, n] of Object.entries(total).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(20)} ${n}`);
  console.log(`escrito ${SALIDA}`);
}
