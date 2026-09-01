import fs from 'node:fs'; import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno } from './lib/estado-item';
import { textoAnalizable } from './lib/texto-cloze';
const CERRADA = new Set(['o','a','os','as','um','uma','no','na','do','da','ao','à','de','em','por','para','com','me','te','lhe','se','que','mais','muito','todo','tudo']);
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
  .filter(servibleAlAlumno)
  .filter((x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1 && !String(x.data?.hintEs ?? '').trim())
  .filter((x) => !/sin pista y CORRECTO|alternativas declaradas/.test(String(x.variantVerificacion ?? '')))
  .filter((x) => !/\([^)]*\)/.test(String(x.data.sentence)) && !CERRADA.has(String(x.data.blanks[0].answer ?? '').toLowerCase()));
console.log(`léxico abierto pendientes: ${items.length}\n`);
for (const x of items.slice(0, 22))
  console.log(`${x.id} [${(x.concepts ?? []).join(',')}] «${textoAnalizable(x)}» → «${x.data.blanks[0].answer}»`);
