// scripts/resincronizar-correccion-ro.ts — CUANDO LA EXPLICACIÓN PUBLICADA
// ENSEÑA ALGO FALSO Y EL ÍTEM ESTÁ BIEN.
//
//   npx tsx scripts/resincronizar-correccion-ro.ts --lote b1 [--write]
//
// ── POR QUÉ EXISTE ───────────────────────────────────────────────────
// El publicador AÑADE; no hay forma de corregir lo publicado. Y el
// 2026-09-03 apareció el caso que lo pide: la regla escrita de
// `r8-completivas-ca-sa` era falsa —«ca» se licencia por constituyente
// ADELANTADO, no por sujeto expreso— mientras que **los ocho ítems eran
// correctos**. O sea que no había nada que retirar: había que reescribir
// ocho `explanationEs` y nada más.
//
// Es la cuarta vez que la prosa del material enseña algo falso con los
// ítems bien (§4.15 del relevo). Retirar y republicar habría sido mentir
// sobre lo ocurrido —los ítems no estaban mal— y además habría metido las
// frases por el gate de «ya publicada».
//
// ── LO QUE CUESTA, Y SE DICE EN VEZ DE DISIMULARLO ───────────────────
// `id` y `contentHash` son el hash de `data`, y `explanationEs` está
// DENTRO de `data`. Así que corregir la explicación **cambia el id**, y
// con él el historial FSRS de quien ya hubiera estudiado la tarjeta. No
// hay forma de evitarlo sin sacar la explicación del hash, que sería
// peor: dos ítems con distinta explicación dejarían de distinguirse.
// El cambio de id se imprime, ítem por ítem, para que quede en el commit.
import fs from 'node:fs';
import path from 'node:path';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import type { ItemCorreccion } from './lib/correccion';
import { ITEMS as B1 } from './lotes/corr-ro-b1';
import { ITEMS as B1C } from './lotes/corr-ro-b1c';

const LOTES: Record<string, ItemCorreccion[]> = { b1: B1, b1c: B1C };
const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const ITEMS = LOTES[lote];
if (!ITEMS) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const write = process.argv.includes('--write');

const DIR = blocksDir('ro');
const porMala = new Map(ITEMS.map((x) => [x.mala.toLowerCase().replace(/\s+/g, ' ').trim(), x]));
const cambios: string[] = [];
const problemas: string[] = [];
const ficheros = new Map<string, any[]>();

for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x))) {
  const p = path.join(DIR, f);
  const arr = JSON.parse(fs.readFileSync(p, 'utf8')) as any[];
  let tocado = false;
  for (const ex of arr) {
    if (ex?.type !== 'error_correction') continue;
    const x = porMala.get(String(ex.data?.sentence ?? '').toLowerCase().replace(/\s+/g, ' ').trim());
    if (!x) continue;
    // SÓLO la explicación. Si la buena o las alternativas hubieran
    // cambiado, esto no es una resincronización: es contenido nuevo, y va
    // por retirada + publicación con su motivo escrito.
    if (ex.data.correct !== x.buena || JSON.stringify(ex.data.alternatives ?? []) !== JSON.stringify(x.alt ?? [])) {
      problemas.push(`${ex.id}: la BUENA o las alternativas difieren del lote — eso no es resincronizar una explicación, es contenido nuevo`);
      continue;
    }
    if (ex.data.explanationEs === x.explicacion) continue;
    const data = { ...ex.data, explanationEs: x.explicacion };
    const idNuevo = hashKey({ type: 'error_correction', data, variantOverrides: undefined, esContrast: undefined }).slice(0, 8);
    cambios.push(`${ex.id} → ${idNuevo}  (${(ex.concepts ?? []).join(',')})  «${x.mala}»`);
    ex.data = data;
    ex.id = idNuevo;
    ex.contentHash = hashKey({ type: 'error_correction', data });
    tocado = true;
  }
  if (tocado) ficheros.set(p, arr);
}

console.log(`# Resincronizar explicaciones — lote ${lote}\n`);
if (problemas.length) { console.log(`**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log(`**${cambios.length} explicaciones a corregir**, y con ellas cambia el id (el hash cubre \`data\`):\n`);
for (const c of cambios) console.log(`- ${c}`);
if (!cambios.length) { console.log('\nNada que hacer.'); process.exit(0); }
if (!write) { console.log('\nDRY-RUN. Repite con --write.'); process.exit(0); }
for (const [p, arr] of ficheros) { fs.writeFileSync(p, JSON.stringify(arr, null, 2) + '\n'); console.log(`\nescrito ${path.relative(process.cwd(), p)}`); }
