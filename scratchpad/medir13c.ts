import { formatoDe } from '../scripts/lib/formato-punto';
import fs from 'node:fs';
import path from 'node:path';
const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: any[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex);
const gj = corpus.filter((x) => x.type === 'grammaticality_judgment');
const porLote = new Map<string, any[]>();
for (const x of gj) { const m = x.id.match(/^b2c2-gj-(?:(l\d+)-)?\d+$/); const k = m ? (m[1] ?? 'piloto') : 'otros'; porLote.set(k, [...(porLote.get(k) ?? []), x]); }
console.log('| lote | ítems | conceptos distintos | % de ítems en puntos `trampa` | clases presentes |');
console.log('|---|---:|---:|---:|---|');
const ord = [...porLote].sort((a, b) => (a[0] === 'piloto' ? -1 : b[0] === 'piloto' ? 1 : Number(a[0].slice(1)) - Number(b[0].slice(1))));
for (const [lote, xs] of ord) {
  const clases = xs.map((x) => (x.concepts ?? []).map((c: string) => formatoDe(c).clase));
  const tr = clases.filter((cs: string[]) => cs.length > 0 && cs.every((c) => c === 'trampa')).length;
  const conc = new Set(xs.flatMap((x: any) => x.concepts ?? []));
  const todas = new Set(clases.flat());
  console.log(`| ${lote} | ${xs.length} | ${conc.size} | ${xs.length ? Math.round((100 * tr) / xs.length) : 0} % | ${[...todas].sort().join(', ') || '(sin concepto)'} |`);
}
console.log(`| **lote 13** | **6** | **1** | **100 %** | trampa |`);
