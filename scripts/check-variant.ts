// scripts/check-variant.ts — corre el gate de variante sobre el corpus.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { revisarEjercicio, type Hallazgo } from './lib/variant-guard';
import { revisarRegistro } from './lib/check-registro';

async function main() {
  const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
  const all: Hallazgo[] = []; let tot = 0;
  for (const f of (await fs.readdir(DIR)).filter(x => x.endsWith('.json')).sort()) {
    const d = JSON.parse(await fs.readFile(path.join(DIR, f), 'utf8'));
    for (const ex of (Array.isArray(d) ? d : d.exercises)) { tot++; all.push(...revisarEjercicio(ex), ...revisarRegistro(ex)); }
  }
  const err = all.filter(h => h.severidad === 'error');
  const av = all.filter(h => h.severidad === 'aviso');
  console.log(`revisados: ${tot}`);
  console.log(`ERRORES: ${err.length} hallazgos en ${new Set(err.map(h => h.id)).size} ejercicios`);
  console.log(`avisos : ${av.length} en ${new Set(av.map(h => h.id)).size} ejercicios`);
  const cnt: Record<string, number> = {};
  for (const h of err) cnt[h.marcador] = (cnt[h.marcador] || 0) + 1;
  console.log('\npor marcador (errores):');
  for (const [k, v] of Object.entries(cnt).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
  console.log('\nmuestra:');
  for (const h of err.slice(0, 5)) console.log(`  ${h.id} [${h.campo}] ${h.marcador} → ${h.europeo}\n      "${h.texto.slice(0, 95)}"`);
  if (process.argv.includes('--strict') && err.length > 0) process.exit(1);
}
main().catch(e => { console.error(e); process.exit(1); });
