// scripts/deficit-ru.ts — LA FOTO DEL DÉFICIT RUSO, por punto y con
// reconciliación.
//
//   npx tsx scripts/deficit-ru.ts                     # informe + reconcilia con la última foto
//   npx tsx scripts/deficit-ru.ts --registrar "nota"  # y guarda la foto
//
// Existe porque hasta el 2026-09-12 el ruso no tenía contador: el relevo
// citaba «602», luego «604», y las dos cifras salían de razonar sobre el
// inventario y no de leer un instrumento. **El fallo más repetido del
// proyecto es escribir un número que no es la salida pegada de un contador**
// —cuatro veces en un día, en tres agentes— y el ruso ya lo pagó una vez: el
// mensaje del commit del inventario dice «nueve puntos con piso reducido y
// tres con piso cero» y son 16 y 7.
//
// El criterio es el de Edu del 2026-09-01: **COBERTURA, ≥8 ítems por punto
// declarado y 6 en C2**, más cero puntos sin lote que no tengan piso cero con
// motivo escrito. La cifra de «23.100 ejercicios» que imprime
// `paso0-idioma.ts --lang=ru` está DEROGADA: sale de una extrapolación por
// horas, y medir contra una meta derogada es la peor clase de gate.
//
// Y la reconciliación se hereda entera: anterior + publicado − retirado =
// actual, **residuo 0**. Un cambio de PISO sale en su propia línea rotulada
// «no es producción», porque bajar un piso reduce el déficit sin producir
// nada y eso no puede hacerse de pasada.
import fs from 'node:fs';
import path from 'node:path';
import { PUNTOS_RU, pisoDePuntoRu } from '../lib/data/languages/ru/inventario-puntos';
import { blocksDir } from '../lib/data/registry';
import { contarPuntosRu, pisoDePunto, bloquesSinLeccionRu } from './lib/asigna-ru';
import { reconciliar, informe, type PorPunto } from './lib/reconciliar-deficit';

const HIST = path.join(process.cwd(), 'docs/plans/deficit-ru-historico.json');
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const items: any[] = [];
const dir = blocksDir('ru');
if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => /^b\d+\.json$/.test(x))) {
  const arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (Array.isArray(arr)) items.push(...arr);
}
const { cuenta, desconocidos, servibles: nServibles } = contarPuntosRu(items);

console.log(`# Déficit ruso — cobertura por punto (piso 8, C2 6)\n`);
console.log(`Corpus: ${items.length} ítems (${nServibles} servibles) · ${PUNTOS_RU.length} puntos del inventario.\n`);
console.log('| nivel | puntos | ítems | puntos <piso | faltan |');
console.log('|---|---:|---:|---:|---:|');
let faltaTotal = 0;
for (const n of NIVELES) {
  const ps = PUNTOS_RU.filter((p) => p.nivel === n);
  const its = ps.reduce((a, p) => a + cuenta.get(p.id)!, 0);
  const bajo = ps.filter((p) => cuenta.get(p.id)! < pisoDePuntoRu(p));
  const falta = bajo.reduce((a, p) => a + (pisoDePuntoRu(p) - cuenta.get(p.id)!), 0);
  faltaTotal += falta;
  console.log(`| ${n} | ${ps.length} | ${its} | ${bajo.length} | ${falta} |`);
}
console.log(`| **Σ** | **${PUNTOS_RU.length}** | **${nServibles}** | **${[...cuenta].filter(([id, n]) => n < pisoDePunto(id)).length}** | **${faltaTotal}** |`);

const cubiertos = [...cuenta].filter(([id, n]) => n >= pisoDePunto(id) && n > 0);
if (cubiertos.length) console.log(`\nPuntos con lote y CUBIERTOS (${cubiertos.length}): ${cubiertos.map(([id, n]) => `${id} (${n})`).join(', ')}.`);
else console.log(`\nPuntos con lote y cubiertos: **0**.`);

// El TECHO y el AHORRO, leídos del inventario y no de memoria: es la cifra
// que el relevo escribió mal dos veces.
const techo = PUNTOS_RU.reduce((a, p) => a + (p.nivel === 'C2' ? 6 : 8), 0);
const piso = PUNTOS_RU.reduce((a, p) => a + pisoDePuntoRu(p), 0);
const nCero = PUNTOS_RU.filter((p) => p.pisoCero).length;
const nRed = PUNTOS_RU.filter((p) => p.pisoDeclarado).length;
console.log(`\nPresupuesto a piso: **${piso}** (techo ${techo}, ahorro ${techo - piso} declarado en ${nRed} pisos reducidos y ${nCero} pisos cero).`);

const cero = PUNTOS_RU.filter((p) => p.pisoCero);
if (cero.length) {
  console.log(`\n**Piso CERO declarado (${cero.length}) — no deben unidades:** ${cero.map((p) => '`' + p.id + '`').join(', ')}.`);
}
if (desconocidos.size) { console.log(`\n⚠ ítems con puntos que NO están en el inventario: ${[...desconocidos].map(([k, v]) => `${k} ×${v}`).join(', ')}`); process.exitCode = 1; }

// ── EL BLOQUEO ESTRUCTURAL, ANTES DE INTENTAR PUBLICAR ───────────────
const sinLeccion = bloquesSinLeccionRu();
const puntosBloqueados = sinLeccion.reduce((a, b) => a + b.puntos.length, 0);
if (sinLeccion.length) {
  console.log(`\n## ⚠ BLOQUEADOS POR FALTA DE LECCIÓN (${puntosBloqueados} puntos en ${sinLeccion.length} bloques)\n`);
  console.log('Estos puntos NO pueden recibir un ítem aunque el lote salga limpio: `curriculum.ts`');
  console.log('sólo declara los bloques con `lessons/bN.json`, y el publicador rechaza el lote entero.\n');
  console.log('| bloque | puntos |');
  console.log('|---|---:|');
  for (const b of sinLeccion) console.log(`| b${b.bloque} · ${b.nombre} | ${b.puntos.length} |`);
} else console.log(`\nBloqueados por falta de lección: **0**.`);

// ── reconciliación ───────────────────────────────────────────────────
const porPuntoAhora: PorPunto = Object.fromEntries(cuenta);
const historico: { fecha: string; nota?: string; porPunto: PorPunto; piso?: PorPunto }[] = fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : [];
console.log('');
if (historico.length) {
  const ultima = historico[historico.length - 1]!;
  const pisoAntes = ultima.piso ? (id: string) => ultima.piso![id] ?? pisoDePunto(id) : undefined;
  const r = reconciliar(ultima.porPunto, porPuntoAhora, pisoDePunto, pisoAntes);
  console.log(informe(r, '8, C2 6'));
  console.log(`\n(foto anterior: ${ultima.fecha}${ultima.nota ? ' — ' + ultima.nota : ''})`);
  if (r.residuo !== 0) { console.log(`\n✗ RESIDUO ${r.residuo}: hay déficit sin explicar.`); process.exitCode = 1; }
} else {
  console.log('## Reconciliación\n\nNo hay foto anterior: ésta es la primera. Se registra con `--registrar`.');
}
const i = process.argv.indexOf('--registrar');
if (i >= 0) {
  const nota = process.argv[i + 1];
  historico.push({
    fecha: new Date().toISOString().slice(0, 10),
    nota: nota && !nota.startsWith('--') ? nota : undefined,
    porPunto: porPuntoAhora,
    piso: Object.fromEntries(PUNTOS_RU.map((p) => [p.id, pisoDePuntoRu(p)])),
  });
  fs.writeFileSync(HIST, JSON.stringify(historico, null, 1) + '\n');
  console.log(`\nFoto registrada en ${path.relative(process.cwd(), HIST)} (${historico.length} en el histórico).`);
}
