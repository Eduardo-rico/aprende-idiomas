// scripts/lectura/atestacion-l1.mjs
//
// Congela la EVIDENCIA, no el corpus. Los 61 MB de treebanks están
// gitignorados, así que un gate que los leyera sería un gate que no corre
// en un checkout limpio. Este script recorre el corpus y escribe, para
// cada forma que la máquina de paradigmas genera para L1, cuántas veces
// aparece atestiguada. El JSON sí va al repositorio y es lo que el test
// comprueba.
//
//   npx tsx scripts/lectura/atestacion-l1.mjs
import fs from 'fs';
import { paradigmaNominal, paradigmaVerbal } from '../../lib/data/languages/la/paradigma-la.ts';
import { NOMBRES_L1, VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1.ts';
import { sinMacron } from '../../lib/data/languages/la/cantidad.ts';

const D = 'scripts/.cache/treebanks';
if (!fs.existsSync(D)) { console.error(`no está la caché en ${D}`); process.exit(1); }

const cuenta = new Map();
let tokens = 0;
for (const f of fs.readdirSync(D).filter((x) => x.startsWith('la_') && x.endsWith('.conllu')))
  for (const l of fs.readFileSync(`${D}/${f}`, 'utf8').split('\n')) {
    if (!l || l[0] === '#') continue;
    const c = l.split('\t');
    if (c.length > 2 && /^\d+$/.test(c[0])) {
      tokens++;
      const k = c[1].toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
      cuenta.set(k, (cuenta.get(k) ?? 0) + 1);
    }
  }

const norm = (s) => sinMacron(s).replace(/j/g, 'i').replace(/v/g, 'u');
const out = { tokens, generado: new Date().toISOString().slice(0, 10), lemas: {} };
for (const [lema, formas] of [
  ...NOMBRES_L1.map((e) => [e.lema, paradigmaNominal(e)]),
  ...VERBOS_L1.map((e) => [e.lema, paradigmaVerbal(e)]),
]) {
  out.lemas[lema] = Object.fromEntries(
    Object.entries(formas).map(([celda, f]) => [celda, { forma: f, n: cuenta.get(norm(f)) ?? 0 }]));
}
fs.writeFileSync('lib/data/languages/la/atestacion-l1.json', JSON.stringify(out, null, 1) + '\n');

const todas = Object.values(out.lemas).flatMap((x) => Object.values(x));
const sinAt = todas.filter((x) => x.n === 0).length;
const lemasSin = Object.entries(out.lemas).filter(([, x]) => Object.values(x).every((y) => y.n === 0)).map(([l]) => l);
console.log(`${tokens.toLocaleString('es')} tokens · ${todas.length} formas generadas`);
console.log(`  sin atestiguar: ${sinAt} (${(100 * sinAt / todas.length).toFixed(1)} %) — regulares de lemas atestiguados, no errores`);
console.log(`  LEMAS sin ninguna forma atestiguada: ${lemasSin.length ? lemasSin.join(', ') : '(ninguno)'}`);
