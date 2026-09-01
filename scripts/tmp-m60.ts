import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno } from './lib/estado-item';
import { textoAnalizable } from './lib/texto-cloze';
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
  .filter(servibleAlAlumno)
  .filter((x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1 && !String(x.data?.hintEs ?? '').trim())
  .filter((x) => !/sin pista y CORRECTO|alternativas declaradas/.test(String(x.variantVerificacion ?? '')));
const orden = items.map((x) => [crypto.createHash('sha256').update(x.id).digest('hex'), x] as const)
  .sort((a, b) => a[0].localeCompare(b[0]));
console.log(`población: ${items.length} · muestra determinista de 20\n`);
orden.slice(0, 20).forEach(([, x], i) =>
  console.log(`${String(i + 1).padStart(2)}. ${x.id} [${(x.concepts ?? []).join(',')}] «${textoAnalizable(x, { conMolde: true })}» → «${x.data.blanks[0].answer}»`));
