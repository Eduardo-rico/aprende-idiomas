// scripts/reparar-cloze.ts
//
//   npx tsx scripts/reparar-cloze.ts [--write]
//
// Aplica el dictamen de `docs/plans/cloze-dictamen-e2-15.json` sobre los
// cloze sin pista. La reparación es la más barata que arregla el
// ejercicio —una pista que DETERMINE la respuesta, o las alternativas
// declaradas— y no toca la frase salvo en los que estaban ROTOS.
//
// Sin `--write` es dry-run. VALIDA ANTES DE ESCRIBIR y recomputa el
// `contentHash`, que entra en el `data`.
import fs from 'node:fs';
import path from 'node:path';
import { ExerciseSchema } from '../lib/data/zod-schemas';
import { contentHash } from './lib/staged-validate';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const WRITE = process.argv.includes('--write');
const DICT = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs/plans/cloze-dictamen-e2-15.json'), 'utf8')) as Record<string, any>;

const decisiones = Object.fromEntries(Object.entries(DICT).filter(([k]) => !k.startsWith('_')));
const problemas: string[] = [];
let rotos = 0, conPista = 0, conAlt = 0, pasan = 0, noVistos = new Set(Object.keys(decisiones));

for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()) {
  const p = path.join(DIR, f);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  let tocado = false;
  for (const ex of d) {
    const dec = decisiones[ex.id];
    if (!dec) continue;
    noVistos.delete(ex.id);
    if (dec.v === 'PASA') { pasan++; continue; }
    if (dec.sentence) { ex.data.sentence = dec.sentence; rotos++; }
    if (dec.answer) ex.data.blanks = [{ position: 0, answer: dec.answer, alternatives: ex.data.blanks?.[0]?.alternatives ?? [] }];
    if (dec.hint) { ex.data.hintEs = dec.hint; conPista++; }
    if (dec.alt) {
      const b = ex.data.blanks?.[0];
      if (b) { b.alternatives = [...new Set([...(b.alternatives ?? []), ...dec.alt])]; conAlt++; }
    }
    ex.contentHash = contentHash(ex.type, ex.data, ex.variantOverrides, ex.esContrast);
    const r = ExerciseSchema.safeParse(ex);
    if (!r.success) problemas.push(`${ex.id}: ${r.error.issues.map((i: any) => `${i.path.join('.')} ${i.message}`).join(' · ')}`);
    // La pista no puede contener la respuesta literal: la regalaría.
    if (dec.hint) for (const b of ex.data.blanks ?? [])
      if (new RegExp(`(?<![\\p{L}])${b.answer}(?![\\p{L}])`, 'iu').test(dec.hint))
        problemas.push(`${ex.id}: la pista «${dec.hint}» contiene la respuesta «${b.answer}» — la regala`);
    tocado = true;
  }
  if (tocado && WRITE) fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
}

console.log(`# Reparación de los cloze sin pista\n`);
console.log(`- ROTOS con frase reescrita: **${rotos}**`);
console.log(`- con PISTA nueva: **${conPista}**`);
console.log(`- con ALTERNATIVAS declaradas: **${conAlt}**`);
console.log(`- PASAN sin tocar: **${pasan}**`);
if (noVistos.size) problemas.push(`ids del dictamen que no existen en el corpus: ${[...noVistos].join(', ')}`);
if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log(`\nSin problemas.${WRITE ? ' Escrito.' : ' DRY-RUN: con --write se escribe.'}`);
