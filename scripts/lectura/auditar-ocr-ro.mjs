// Auditoría de OCR del catálogo rumano con hunspell (ro_RO vendorizado en
// tools/hunspell). Mide, no corrige.
//
//   node scripts/lectura/auditar-ocr-ro.mjs            # distribución + colas
//   node scripts/lectura/auditar-ocr-ro.mjs --pieza id # palabras desconocidas de una pieza
//
// Por qué se mide así (y no a ojo): el smoke en pantalla vio «Foccșni» y
// «'nând» en UN capítulo; a 818 lecturas lo sucio de OCR sólo se ve por
// TASA de palabras que el diccionario no conoce, comparando cada pieza
// con la mediana del catálogo. Las piezas en la mediana no se tocan.
//
// El diccionario es de la norma de 1993 («sunt», «când»): para que la
// grafía de época NO cuente como OCR, antes de consultar se normaliza
// SÓLO para la medición: î interior → â, sînt → sunt, apóstrofo de
// elisión → guion (într'o → într-o). Los textos anteriores a 1904
// (ĭ, ŭ, é) siguen dando tasa alta: son época, no OCR, y así se reportan.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DIR = path.join(process.cwd(), 'lib/data/languages/ro/lecturas');
const DIC = path.join(process.cwd(), 'tools/hunspell/ro_RO');
const CACHE = path.join(process.cwd(), 'scripts/.cache/lectura/ocr-ro.json');
const args = process.argv.slice(2);
const PIEZA = args.includes('--pieza') ? args[args.indexOf('--pieza') + 1] : null;

const RE_PAL = /[\p{L}]+(?:['’\-][\p{L}]+)*/gu;

/** Normalización SÓLO para consultar el diccionario de 1993. */
export function paraDiccionario(p) {
  return p
    .replace(/’/g, "'")
    .replace(/(\p{L})'(\p{L})/gu, '$1-$2')       // într'o → într-o
    .replace(/^s[îi]nt(em|eți)?$/i, (m) => m.replace(/[îi]/, 'u'))  // sînt → sunt
    .replace(/(\p{L})î(\p{L})/gu, '$1â$2');       // cînd → când (î interior de la norma 1953)
}

function desconocidas(palabras) {
  const r = spawnSync('hunspell', ['-d', DIC, '-l'], { input: palabras.join('\n'), encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.status !== 0 && r.stderr) throw new Error(r.stderr);
  return new Set(r.stdout.split('\n').filter(Boolean));
}

const archivos = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()
  .filter((f) => !PIEZA || f === `${PIEZA}.json`);
const filas = [];
for (const f of archivos) {
  const l = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const texto = l.parrafos.map((p) => p.texto).join('\n');
  const tokens = texto.match(RE_PAL) ?? [];
  // Sólo palabras con minúscula: los nombres propios (Humulești, Tipătescu)
  // no están en el diccionario y no son OCR; quitarlos baja el ruido común
  // a todas las piezas sin tocar la señal.
  const cand = tokens.filter((t) => /^\p{Ll}/u.test(t));
  const unicas = [...new Set(cand.map(paraDiccionario))];
  const desc = desconocidas(unicas);
  const cuenta = new Map();
  for (const t of cand) if (desc.has(paraDiccionario(t))) cuenta.set(t, (cuenta.get(t) ?? 0) + 1);
  const n = [...cuenta.values()].reduce((a, b) => a + b, 0);
  filas.push({ id: l.id, autor: l.autor, tokens: cand.length, desconocidas: n, tasa: cand.length ? n / cand.length : 0, top: [...cuenta.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40) });
}

if (PIEZA) {
  const r = filas[0];
  console.log(`${r.id}: ${r.tokens} palabras · ${r.desconocidas} desconocidas · ${(100 * r.tasa).toFixed(2)} %`);
  for (const [w, c] of r.top) console.log(`  ${String(c).padStart(4)}  ${w}`);
  process.exit(0);
}

const tasas = filas.map((r) => r.tasa).sort((a, b) => a - b);
const q = (p) => tasas[Math.min(tasas.length - 1, Math.floor(p * tasas.length))];
const mediana = q(0.5);
const mad = [...filas.map((r) => Math.abs(r.tasa - mediana))].sort((a, b) => a - b)[Math.floor(filas.length / 2)];
const corte = mediana + 3 * mad;
const pct = (x) => `${(100 * x).toFixed(2)} %`;
console.log(`OCR RO · ${filas.length} lecturas · tasa de palabras desconocidas (hunspell ro_RO, minúsculas, época normalizada)`);
console.log(`  mín ${pct(tasas[0])} · p10 ${pct(q(0.1))} · p25 ${pct(q(0.25))} · MEDIANA ${pct(mediana)} · p75 ${pct(q(0.75))} · p90 ${pct(q(0.9))} · p99 ${pct(q(0.99))} · máx ${pct(tasas.at(-1))}`);
console.log(`  MAD ${pct(mad)} · corte de anomalía = mediana + 3·MAD = ${pct(corte)}`);
const anomalas = filas.filter((r) => r.tasa > corte).sort((a, b) => b.tasa - a.tasa);
console.log(`\nANÓMALAS (${anomalas.length}):`);
for (const r of anomalas) console.log(`  ${pct(r.tasa).padStart(8)}  ${r.id.padEnd(60)} ${r.autor.padEnd(28)} ${r.top.slice(0, 6).map(([w, c]) => `${w}×${c}`).join(' ')}`);
fs.mkdirSync(path.dirname(CACHE), { recursive: true });
fs.writeFileSync(CACHE, JSON.stringify({ mediana, mad, corte, filas }, null, 1));
console.log(`\ndetalle por pieza en ${path.relative(process.cwd(), CACHE)}`);
