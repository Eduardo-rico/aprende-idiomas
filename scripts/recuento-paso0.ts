// scripts/recuento-paso0.ts — el recuento del Paso 0 (E1), ahora repetible.
//
//   npx tsx scripts/recuento-paso0.ts
//
// Compara el corpus real contra lo que pide el currículo
// (docs/plans/2026-07-28-curriculos-completos.md §Portugués, ya
// reconciliado en E1) y saca el burn-down por nivel y por destreza.
// Se hizo a mano en E1 y por eso no se podía repetir; a partir de E2#8
// es un comando, para que la cifra con la que se decide el plan no
// dependa de que alguien rehaga el cálculo.
import fs from 'node:fs';
import path from 'node:path';

const BLOQUE_A_NIVEL: Record<number, string> = {
  1: 'A1', 2: 'A2', 3: 'A2', 4: 'B1', 5: 'B1', 6: 'B2',
  7: 'B2', 8: 'B2', 9: 'A2', 10: 'B1', 11: 'C1',
};
// Currículo (E1-P0) y motor de runtime que NO es corpus pre-producible.
const PIDE: Record<string, number> = { A1: 900, A2: 1100, B1: 1400, B2: 1600, C1: 1200, C2: 800 };
const MOTOR: Record<string, number> = { A1: 0, A2: 0, B1: 200, B2: 300, C1: 200, C2: 0 };

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const items: any[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  items.push(...(Array.isArray(j) ? j : j.exercises));
}

const porNivel: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
for (const ex of items) {
  const n = BLOQUE_A_NIVEL[ex.blockId];
  if (n) porNivel[n] = (porNivel[n] ?? 0) + 1;
}

const fila = (k: string, v: (number | string)[]) => `| ${k.padEnd(5)} | ${v.map((x) => String(x).padStart(6)).join(' | ')} |`;
console.log(`# Recuento Paso 0 — ${new Date === undefined ? '' : ''}corpus actual\n`);
console.log('| nivel |    hay |   pide | motor* |   meta |  falta |    %   |');
console.log('|-------|--------|--------|--------|--------|--------|--------|');
let tHay = 0, tPide = 0, tMotor = 0, tMeta = 0, tFalta = 0;
for (const n of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
  const hay = porNivel[n] ?? 0, pide = PIDE[n]!, motor = MOTOR[n]!;
  const meta = pide - motor, falta = Math.max(0, meta - hay);
  const pct = Math.round((hay / meta) * 100);
  console.log(fila(n, [hay, pide, motor, meta, falta, `${pct}%`]));
  tHay += hay; tPide += pide; tMotor += motor; tMeta += meta; tFalta += falta;
}
console.log('|-------|--------|--------|--------|--------|--------|--------|');
console.log(fila('Σ', [tHay, tPide, tMotor, tMeta, tFalta, `${Math.round((tHay / tMeta) * 100)}%`]));

// ── Mediación: el cuello declarado del plan ──
const med = items.filter((x) => x.type === 'mediation');
// CORREGIDO en E2#9: la v1 calculaba MED_ITEMS = 1580 − 230, y eso está
// mal. Son buckets SEPARADOS, de líneas distintas del currículo:
//   · EJERCICIOS de mediación   A2 200 · B1 280 · B2 400 · C1 400 · C2 300 = 1.580,
//     dentro de los 7.000 ejercicios;
//   · PRODUCCIÓN de mediación   A2  20 · B1  40 · B2  60 · C1  60 · C2  50 =   230,
//     dentro de las 830 tareas de producción.
// Restar una de la otra desaparecía 230 ítems del faltante.
const MED_ITEMS = 1580, MED_TAREAS = 230;
console.log(`\n## Mediación (el cuello del plan)\n`);
console.log(`| bucket | hay | pide | falta | % |`);
console.log(`|---|---:|---:|---:|---:|`);
console.log(`| mediación-TAREAS (dentro de las 830 de producción) | ${med.length} | ${MED_TAREAS} | ${Math.max(0, MED_TAREAS - med.length)} | ${Math.round(med.length / MED_TAREAS * 100)}% |`);
console.log(`| mediación-ÍTEMS (ejercicios del currículo) | 0 | ${MED_ITEMS} | ${MED_ITEMS} | 0% |`);
console.log(`| **total mediación** | **${med.length}** | **${MED_ITEMS + MED_TAREAS}** | **${MED_ITEMS + MED_TAREAS - med.length}** | **${Math.round(med.length / (MED_ITEMS + MED_TAREAS) * 100)}%** |`);

// ── Ritmo real medido, para la proyección ──
const b2c2 = items.filter((x) => String(x.id).startsWith('b2c2-'));
console.log(`\nítems del catálogo B2C2 publicados: ${b2c2.length} (de ellos mediación: ${med.filter((x) => String(x.id).startsWith('b2c2-')).length})`);
console.log(`corpus total: ${items.length} ejercicios`);
