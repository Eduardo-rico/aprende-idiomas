// scripts/muestra-calibracion-b.ts — la muestra de la calibración.
//
//   npx tsx scripts/muestra-calibracion-b.ts [n]
//
// Determinista por hash SHA-256 del id: reproducible y ajena a cualquier
// criterio de contenido. El criterio de aceptación está en
// docs/plans/2026-09-01-calibracion-familia-b.md, commiteado ANTES.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BLOCKS_DIR } from './config';

const N = Number(process.argv[2] ?? 120);
// `--desde k` salta los k primeros del mismo orden determinista, para
// sacar una muestra DISJUNTA de la anterior. Releer la muestra ya
// arreglada no probaría nada: sería enseñar al examen.
const DESDE = Number(process.argv[process.argv.indexOf('--desde') + 1] ?? 0) || 0;
const esA = (t: string) => /revisión manual|corregido según revisión|lingu|adversaria/i.test(t);
const esB = (x: any) => {
  const t = String(x.variantVerificacion ?? '');
  return x.variantStatus === 'unchecked' && !esA(t) &&
    /Cloze con pista|Mediación|aviso-v|Línea B|Transformaci|Correcci|Ola B2C2/i.test(t);
};
const texto = (x: any) => {
  const d = x.data ?? {};
  return [d.sentence, d.correct, d.target, d.answer, d.prompt, d.front, d.back, d.question,
          d.hintEs, d.explanationEs, d.sourceText,
          ...(d.blanks ?? []).map((b: any) => `[${b.answer}]`), ...(d.options ?? [])]
    .filter((v: any) => typeof v === 'string' && v.trim()).join('  ⟡  ').replace(/\s+/g, ' ').slice(0, 300);
};

const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]).filter(esB);
const orden = items.map((x) => [crypto.createHash('sha256').update(x.id).digest('hex'), x] as const)
  .sort((a, b) => a[0].localeCompare(b[0]));
console.log(`familia B: ${items.length} ítems · muestra determinista de ${N}${DESDE ? ` desde el ${DESDE + 1}` : ''}\n`);
orden.slice(DESDE, DESDE + N).forEach(([, x], i) => console.log(`${String(i + 1).padStart(3)}. ${x.id} [${x.type}] ${texto(x)}`));
