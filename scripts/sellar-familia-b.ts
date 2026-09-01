// scripts/sellar-familia-b.ts — el sello POR CONSTRUCCIÓN de la producción
// de máquina, otorgado por calibración.
//
//   npx tsx scripts/sellar-familia-b.ts             # dry-run
//   npx tsx scripts/sellar-familia-b.ts --aplicar
//
// El sello NO se otorga porque la producción sea de máquina: se otorga
// porque se midió. Dos calibraciones de 120 con criterio precomprometido
// por escrito, en `docs/plans/2026-09-01-calibracion-familia-b.md`:
//
//   · la PRIMERA falló (3 errores, 3 avisos) y sus tres errores eran
//     CLASES, barridas después sobre el corpus entero;
//   · la SEGUNDA, sobre una muestra DISJUNTA —releer la muestra arreglada
//     habría sido enseñar al examen—, salió 0 errores y 3 avisos, que es
//     justo el listón.
//
// Pasa al límite, no con holgura, y eso se dice: los tres avisos son una
// sola clase («estar com fome/razão/pressa» donde el europeo prefiere
// «ter»), acotada por barrido a esos tres ítems exactos y corregida.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { selladoDeVariante } from './lib/estado-item';
import { revisarEjercicio, CAMPOS_DIDACTICOS } from './lib/variant-guard';
import { revisarRegistro } from './lib/check-registro';

const APLICAR = process.argv.includes('--aplicar');
const esA = (t: string) => /revisión manual|corregido según revisión|lingu|adversaria/i.test(t);
const esB = (x: any) => {
  const t = String(x.variantVerificacion ?? '');
  return x.variantStatus === 'unchecked' && !esA(t) &&
    /Cloze con pista|Mediación|aviso-v|Línea B|Transformaci|Correcci|Ola B2C2/i.test(t);
};

const ficheros = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort();
const porFichero = new Map(ficheros.map((f) => [f, JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]]));

const sellables: any[] = [], marcados: any[] = [];
for (const x of [...porFichero.values()].flat()) {
  if (!esB(x)) continue;
  const hay = [...revisarEjercicio(x), ...revisarRegistro(x)]
    .some((h) => h.severidad === 'error' && !(CAMPOS_DIDACTICOS[x.type]?.has(h.campo) ?? false));
  (hay ? marcados : sellables).push(x);
}
console.log(`# Sello por construcción de la familia B\n`);
console.log(`Se sellan: **${sellables.length}**`);
console.log(`Se quedan fuera por tener un hallazgo vivo del gate de variante: **${marcados.length}**`);
for (const x of marcados) console.log(`- \`${x.id}\` (${x.type})`);

if (!APLICAR) { console.log('\nDRY-RUN. Repite con --aplicar.'); process.exit(0); }
for (const x of sellables) {
  x.variantStatus = 'neutral';
  x.variantVerificacion = `${x.variantVerificacion} · sello por construcción (calibración de 120, E2#22)`;
}
for (const [f, d] of porFichero) fs.writeFileSync(path.join(BLOCKS_DIR, f), JSON.stringify(d, null, 2) + '\n');
console.log(`\nSellados ${sellables.length} ítems.`);
