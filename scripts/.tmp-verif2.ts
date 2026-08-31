import fs from 'node:fs';
import path from 'node:path';
import { medirRasgo, pValor } from './lib/atajos';
import { evaluarMolde, patronesPublicados } from './lib/pares-minimos';
import { indexarCorpus, buscarDuplicados, type ExIndexable } from './lib/virginidad';

const txt = fs.readFileSync(process.argv[2]!, 'utf8');
interface It { id: string; verdict: boolean; sentence: string; repair?: string; explicacion: string; pos?: number }
const items: It[] = [];
for (const sec of txt.split(/\n### /).slice(1)) {
  const m = sec.split('\n')[0]!.match(/^GJ-(\d+)\s+·\s+\*\*(MAL|BIEN)\*\*/);
  if (!m) continue;
  const campo = (e: string) => (sec.match(new RegExp(`\\*\\*${e}:\\*\\*\\s*«([\\s\\S]*?)»`))?.[1] ?? '').replace(/\s+/g, ' ').trim();
  items.push({ id: `GJ-${m[1]}`, verdict: m[2] === 'BIEN', sentence: campo('sentence'), repair: campo('repair') || undefined, explicacion: (sec.match(/\*\*explicación:\*\*\s*([\s\S]*?)(?=\n\n|\n### |$)/)?.[1] ?? '').replace(/\s+/g, ' ').trim() });
}
items.forEach((x, i) => (x.pos = i));
const patron = items.map((x) => (x.verdict ? 'B' : 'M')).join('');

console.log('## 1 · evaluarMolde (el criterio del repo que el preflight NO usa)\n');
const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: ExIndexable[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex as ExIndexable);
const pubs = patronesPublicados(corpus as never);
console.log('patrones publicados:', [...pubs.entries()].map(([k, v]) => `${k}=${v}`).join(' · '));
console.log(`patrón del lote 11 (24): ${patron}`);
console.log('evaluarMolde(24) →', JSON.stringify(evaluarMolde(patron, [...pubs.values()])));
console.log(`sección A (12): ${patron.slice(0, 12)} → `, JSON.stringify(evaluarMolde(patron.slice(0, 12), [...pubs.values()])));
console.log(`sección B (12): ${patron.slice(12)} → `, JSON.stringify(evaluarMolde(patron.slice(12), [...pubs.values()])));
console.log(`solape A vs B: ${[...patron.slice(0, 12)].filter((c, i) => c === patron[12 + i]).length}/12`);

console.log('\n## 2 · Peso léxico (guion = frontera de palabra, sin artefactos)\n');
const pals = (s: string) => s.split(/[\s\-—]+/).map((w) => w.replace(/[^\p{L}]/gu, '')).filter(Boolean);
const maxPal = (x: It) => Math.max(...pals(x.sentence).map((w) => w.length));
const n8 = (x: It) => pals(x.sentence).filter((w) => w.length >= 8).length;
for (const [nom, f] of [['la palabra más larga tiene ≥10 letras', (x: It) => maxPal(x) >= 10], ['la palabra más larga tiene ≥9 letras', (x: It) => maxPal(x) >= 9], ['≥2 palabras de 8+ letras', (x: It) => n8(x) >= 2], ['≥3 palabras de 8+ letras', (x: It) => n8(x) >= 3]] as [string, (x: It) => boolean][]) {
  const a = medirRasgo(nom, f as never, items as never);
  console.log(`${nom.padEnd(40)} ${a.aciertos}/24 (${Math.round(100 * a.acierto)} %) ${a.direccion} · presente en ${a.presentes} · p=${pValor(a.aciertos, a.n).toFixed(4)}`);
}
console.log('\nDesglose de «palabra más larga ≥10» (presente ⇒ BIEN):');
for (const x of items) {
  const w = pals(x.sentence).sort((a, b) => b.length - a.length)[0]!;
  const pres = maxPal(x) >= 10;
  console.log(`  ${x.id} · más larga «${w}» (${w.length}) · rasgo=${pres ? 'SÍ ' : 'no '} ⇒ predice ${pres ? 'BIEN' : 'MAL '} · real ${x.verdict ? 'BIEN' : 'MAL '} · ${pres === x.verdict ? 'ACIERTA' : 'falla'}`);
}

console.log('\n## 3 · Virginidad contra los 6 publicados de `b7-infinitivo-pessoal`\n');
const b7 = corpus.filter((x) => ((x as { concepts?: string[] }).concepts ?? []).includes('b7-infinitivo-pessoal'));
console.log(`publicados con ese concepto: ${b7.length}`);
const cand: ExIndexable[] = items.map((x) => ({ id: x.id, type: 'grammaticality_judgment', blockId: 11, concepts: [], data: { sentence: x.sentence, repair: x.repair ?? '' } }) as ExIndexable);
const idx = indexarCorpus([...corpus, ...cand]);
const ids7 = new Set(b7.map((x) => x.id));
let hits = 0;
for (const c of cand) for (const h of buscarDuplicados(idx, c)) if (ids7.has(h.id)) { hits++; console.log(`  ${c.id} ↔ ${h.id} — ${h.score} · ${h.texto.slice(0, 80)}`); }
console.log(hits ? '' : '  CERO pares por encima del umbral: el gate no ve el solape de PUNTO (los candidatos van con concepts: []).');
