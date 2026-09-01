// Extrae el TEXTO de cada punto de C1/C2 que el currículo enumera —el
// script de recuento sólo los CUENTA— para poder cotejarlos uno a uno
// contra los conceptos declarados en vez de restar dos números.
import fs from 'node:fs'; import path from 'node:path';
const ROOT = process.cwd();
const SECCIONES = ['GRAMÁTICA', 'LÉXICO', 'FONOLOGÍA', 'PRAGMÁTICA', 'MEDIACIÓN'];
const todo = fs.readFileSync(path.join(ROOT, 'docs/plans/2026-07-28-curriculos-completos.md'), 'utf8').split('\n');
const iniPT = todo.findIndex((l) => l.startsWith('## Portugués'));
const finPT = todo.findIndex((l, i) => i > iniPT && l.startsWith('## ') && !l.startsWith('## Portugués'));
const curr = todo.slice(iniPT, finPT < 0 ? todo.length : finPT);
let nivel = ''; const out: { nivel: string; sec: string; texto: string }[] = [];
for (const l of curr) {
  const h = l.match(/^### Portugués · (A1|A2|B1|B2|C1|C2) /);
  if (h) { nivel = h[1] ?? ''; continue; }
  if (!nivel) continue;
  for (const s of SECCIONES) {
    const m = l.match(new RegExp(`${s}[^:]{0,140}:(.*)$`));
    if (!m) continue;
    const cuerpo = (m[1] ?? '').replace(/\([^)]*\)/g, '');
    const sep = (cuerpo.match(/;/g) ?? []).length >= 2 ? ';' : ',';
    for (const x of cuerpo.split(sep).map((y) => y.trim()))
      if (x.replace(/[^\p{L}]/gu, '').length >= 12) out.push({ nivel, sec: s, texto: x });
  }
}
for (const n of ['C1', 'C2']) {
  const xs = out.filter((x) => x.nivel === n);
  console.log(`\n## ${n} — ${xs.length} puntos enumerados`);
  xs.forEach((x, i) => console.log(`${String(i + 1).padStart(2)} [${x.sec}] ${x.texto}`));
}
console.log(`\nTotal por nivel: ${['A1','A2','B1','B2','C1','C2'].map((n)=>`${n} ${out.filter(x=>x.nivel===n).length}`).join(' · ')}`);
