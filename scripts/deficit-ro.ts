// scripts/deficit-ro.ts — LA FOTO DEL DÉFICIT RUMANO, por punto y con
// reconciliación.
//
//   npx tsx scripts/deficit-ro.ts                       # informe + reconcilia con la última foto
//   npx tsx scripts/deficit-ro.ts --registrar "nota"    # y guarda la foto
//
// Es el `split-conceptos.ts` de PT reducido a lo que el rumano tiene hoy:
// no hay particiones ni transversales (los puntos del inventario YA son
// finos), así que la cuenta es directa: ítems SERVIBLES por `concepts`.
// Lo que sí se hereda entero es la reconciliación (`reconciliar-deficit`):
// anterior + publicado − retirado = actual, residuo 0. Sin ella, en tres
// lotes se cruzan dos cifras de dos momentos (cautela del coordinador,
// 2026-09-01; y la ficción del calendario de E2#11 en PT).
//
// Los puntos a CERO cuentan: el inventario da el universo, no el corpus.
// El piso es el del inventario (8; C2 6). `sinDescriptor` no baja el
// piso: es un hueco del currículo, no del punto.
import fs from 'node:fs';
import path from 'node:path';
import { PUNTOS_RO, PISO_RO } from '../lib/data/languages/ro/inventario-puntos';
import { blocksDir } from '../lib/data/registry';
import { contarPuntosRo, pisoDePunto } from './lib/asigna-ro';
import { reconciliar, informe, type PorPunto } from './lib/reconciliar-deficit';

const HIST = path.join(process.cwd(), 'docs/plans/deficit-ro-historico.json');
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const items: any[] = [];
const dir = blocksDir('ro');
if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => /^b\d+\.json$/.test(x))) {
  const arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (Array.isArray(arr)) items.push(...arr);
}
// El contador vive en `lib/asigna-ro.ts`, no aquí: el `--asigna` de los
// lotes usa EXACTAMENTE el mismo, y una regla copiada se desincroniza.
const { cuenta, desconocidos, servibles: nServibles } = contarPuntosRo(items);
const pisoId = pisoDePunto;

console.log(`# Déficit rumano — cobertura por punto (piso 8, C2 6)\n`);
console.log(`Corpus: ${items.length} ítems (${nServibles} servibles) · ${PUNTOS_RO.length} puntos del inventario.\n`);
console.log('| nivel | puntos | ítems | puntos <piso | faltan |');
console.log('|---|---:|---:|---:|---:|');
let faltaTotal = 0;
for (const n of NIVELES) {
  const ps = PUNTOS_RO.filter((p) => p.nivel === n);
  const its = ps.reduce((a, p) => a + cuenta.get(p.id)!, 0);
  const bajo = ps.filter((p) => cuenta.get(p.id)! < PISO_RO(n));
  const falta = bajo.reduce((a, p) => a + (PISO_RO(n) - cuenta.get(p.id)!), 0);
  faltaTotal += falta;
  console.log(`| ${n} | ${ps.length} | ${its} | ${bajo.length} | ${falta} |`);
}
console.log(`| **Σ** | **${PUNTOS_RO.length}** | **${nServibles}** | **${[...cuenta].filter(([id, n]) => n < pisoId(id)).length}** | **${faltaTotal}** |`);
const cubiertos = [...cuenta].filter(([id, n]) => n >= pisoId(id));
if (cubiertos.length) console.log(`\nPuntos cubiertos (${cubiertos.length}): ${cubiertos.map(([id, n]) => `${id} (${n})`).join(', ')}.`);
if (desconocidos.size) console.log(`\n⚠ ítems con puntos que NO están en el inventario: ${[...desconocidos].map(([k, v]) => `${k} ×${v}`).join(', ')}`);

// ── reconciliación ───────────────────────────────────────────────────
const porPuntoAhora: PorPunto = Object.fromEntries(cuenta);
const historico: { fecha: string; nota?: string; porPunto: PorPunto }[] = fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : [];
console.log('');
if (historico.length) {
  const ultima = historico[historico.length - 1]!;
  const r = reconciliar(ultima.porPunto, porPuntoAhora, pisoId);
  console.log(informe(r, '8, C2 6'));
  console.log(`\n(foto anterior: ${ultima.fecha}${ultima.nota ? ' — ' + ultima.nota : ''})`);
  if (r.residuo !== 0) { console.log(`\n✗ RESIDUO ${r.residuo}: hay déficit sin explicar.`); process.exitCode = 1; }
} else {
  console.log('## Reconciliación\n\nNo hay foto anterior: ésta es la primera. Se registra con `--registrar`.');
}
const i = process.argv.indexOf('--registrar');
if (i >= 0) {
  const nota = process.argv[i + 1];
  historico.push({ fecha: new Date().toISOString().slice(0, 10), nota: nota && !nota.startsWith('--') ? nota : undefined, porPunto: porPuntoAhora });
  fs.writeFileSync(HIST, JSON.stringify(historico, null, 1) + '\n');
  console.log(`\nFoto registrada en ${path.relative(process.cwd(), HIST)} (${historico.length} en el histórico).`);
}
