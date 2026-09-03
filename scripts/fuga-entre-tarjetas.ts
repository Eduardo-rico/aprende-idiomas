// scripts/fuga-entre-tarjetas.ts — uso: npx tsx scripts/fuga-entre-tarjetas.ts <lang>
//
// MIDE la fuga entre tarjetas. La detección NO vive aquí: vive en
// `lib/srs/fuga-sesion.ts`, que es también la que usa la app para ordenar
// la sesión. Una regla duplicada se desincroniza en la copia que nadie
// recuerda haber hecho, así que aquí sólo se lee el corpus y se informa.
//
// Ojo con la diferencia de criterio, que es deliberada:
//   - MEDIR usa `soloEntrePuntos: true` — dentro de un punto las formas se
//     repiten por diseño y contarlas infla el número sin señalar nada.
//   - ORDENAR usa `false` — ordenar no tiene coste de falso positivo, así
//     que conviene desactivar también la fuga dentro de un punto.
import fs from 'node:fs';
import path from 'node:path';
import { construirMapaDeFuga, type ItemParaFuga } from '../lib/srs/fuga-sesion';

const LANG = process.argv[2] ?? 'ro';
const D = path.join('lib/data/languages', LANG, 'blocks');
if (!fs.existsSync(D)) {
  console.error(`no hay corpus en ${D}`);
  process.exit(1);
}

const items: ItemParaFuga[] = [];
for (const f of fs.readdirSync(D).filter((x) => x.endsWith('.json'))) {
  const j = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  const arr = Array.isArray(j) ? j : (j.items ?? Object.values(j).find(Array.isArray));
  if (arr) items.push(...(arr as ItemParaFuga[]));
}
if (items.length === 0) {
  console.error(`sin ítems en ${D}`);
  process.exit(1);
}

const mapa = construirMapaDeFuga(items, { maxApariciones: 3, soloEntrePuntos: true });
const pares = [...mapa.values()].reduce((n, v) => n + v.length, 0);
const porId = new Map(items.map((i) => [i.id, i]));

console.log(`# Fuga entre tarjetas — ${LANG}\n`);
console.log(`ítems en el corpus: ${items.length}`);
console.log(`ítems que imprimen la respuesta de otro punto: ${mapa.size}`);
console.log(`pares en fuga (forma rara, punto distinto): ${pares}\n`);
for (const [quien, examinados] of mapa) {
  const p = porId.get(quien)?.concepts?.[0] ?? '?';
  console.log(`  ${quien} [${p}] imprime la respuesta de: ${examinados.join(', ')}`);
}
console.log(`\nNo es un gate de publicación: marcaría demasiado y casi todo inofensivo.`);
console.log(`La app lo desactiva ORDENANDO la sesión (lib/srs/interleave.ts).`);
