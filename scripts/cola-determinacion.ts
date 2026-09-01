// scripts/cola-determinacion.ts — los cloze cuya determinación falta leer.
//
//   npx tsx scripts/cola-determinacion.ts              # la lista
//   npx tsx scripts/cola-determinacion.ts 12 --desde 0 # un tramo, con texto
//
// «Sin pista» NO es «indeterminado»: la auditoría de E2#15 midió 13 % de
// error duro entre los derivables frente al 45 % de los sospechosos. Pero
// el triaje por superficie tampoco filtra: la muestra de E2#29 dio **6
// defectuosos de 20 (30 %) justo en la clase que el clasificador daba por
// más segura**, y por eso estos se leen uno a uno en vez de sellarse por
// clase. El criterio se escribió antes de mirar, en
// `docs/plans/2026-09-01-muestra-60-cloze.md`.
//
// El volcado ENSAMBLA la frase —hueco relleno, molde fuera— porque leer la
// plantilla en vez de lo que el alumno ve es cómo dos barridos de esta ola
// dieron 0 hallazgos. Ver `lib/texto-cloze.ts`.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno, determinacionDictaminada } from './lib/estado-item';
import { textoAnalizable } from './lib/texto-cloze';

const N = Number(process.argv[2] ?? 0) || 0;
const DESDE = Number(process.argv[process.argv.indexOf('--desde') + 1] ?? 0) || 0;

const pend = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
  .filter(servibleAlAlumno)
  .filter((x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1)
  .filter((x) => !determinacionDictaminada(x));

console.log(`# Determinación sin dictaminar — ${pend.length} ítems\n`);
if (!N) {
  console.log('| # | id | bloque | puntos |');
  console.log('|---:|---|---:|---|');
  pend.forEach((x, i) => console.log(`| ${i + 1} | \`${x.id}\` | ${x.blockId} | ${(x.concepts ?? []).join(', ')} |`));
} else {
  for (const [i, x] of pend.slice(DESDE, DESDE + N).entries()) {
    const b = x.data.blanks[0];
    console.log(`\n## ${DESDE + i + 1}. \`${x.id}\` · b${x.blockId} · ${(x.concepts ?? []).join(', ')}`);
    console.log(`- molde:  ${x.data.sentence}`);
    console.log(`- leída:  ${textoAnalizable(x, { conRespuesta: true })}`);
    console.log(`- resp:   «${b.answer}»${(b.alternatives ?? []).length ? ` (alt: ${b.alternatives.join(' / ')})` : ''}`);
    if (x.data.translationEs) console.log(`- es:     ${x.data.translationEs}`);
    if (x.variantVerificacion) console.log(`- sello:  ${x.variantVerificacion}`);
  }
}
