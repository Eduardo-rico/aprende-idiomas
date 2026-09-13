// scripts/lib/cobertura-de-puntos.ts — ¿QUÉ PUNTOS TIENEN LOTE?
//
//   npx tsx scripts/lib/cobertura-de-puntos.ts
//
// ── POR QUÉ NO VALE UN `grep` ────────────────────────────────────────
//
// La primera versión de esta cuenta buscaba `punto: '...'` en el texto de
// los ficheros, y se equivocó DOS veces por el mismo motivo: hay lotes que
// no escriben el literal.
//
//   · `l3-ablativo.ts` y `l5-futuro.ts` cubren puntos cuyo id no es el
//     nombre del fichero, así que contar por nombre de fichero daba 34 de
//     52 cuando eran 38;
//   · y los cinco lotes de lectura eclesiástica ponen el `punto` desde una
//     función —`PUNTO_DE_LA_REGLA[regla]`—, así que el literal no aparece y
//     contarlos por texto daba 43 cuando eran 48.
//
// Las dos veces la cuenta era de MENOS y las dos veces parecía razonable.
// Se importa el módulo y se leen los ítems, que es lo que de verdad se
// pregunta.
import fs from 'node:fs';
import path from 'node:path';
import { PUNTOS_LA } from '../../lib/data/languages/la/inventario-puntos';

const DIR = 'lib/data/languages/la/lotes';

export async function puntosConLote(): Promise<Set<string>> {
  const out = new Set<string>();
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.ts') && !x.startsWith('_'))) {
    const mod = await import(path.resolve(DIR, f)) as Record<string, unknown>;
    for (const v of Object.values(mod)) {
      if (!Array.isArray(v)) continue;
      for (const it of v) {
        const p = (it as { punto?: unknown }).punto;
        if (typeof p === 'string') out.add(p);
      }
    }
  }
  return out;
}

async function main() {
  const cub = await puntosConLote();
  console.log('\n  COBERTURA DE PUNTOS POR PELDAÑO\n');
  let hechos = 0, total = 0;
  for (const n of ['L1', 'L2', 'L3', 'L4'] as const) {
    const p = PUNTOS_LA.filter((x) => x.peldano === n);
    const con = p.filter((x) => cub.has(x.id)).length;
    hechos += con; total += p.length;
    console.log(`  ${n}  ${String(con).padStart(3)} de ${String(p.length).padStart(3)}`);
    const sin = p.filter((x) => !cub.has(x.id));
    if (sin.length > 0 && sin.length <= 12) console.log(`       faltan: ${sin.map((x) => x.id).join(' ')}`);
  }
  console.log(`\n  TOTAL ${hechos} de ${total}`);
}
main();
