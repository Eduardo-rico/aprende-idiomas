// scripts/check-concepts.ts
//
//   npx tsx scripts/check-concepts.ts            # audita el corpus
//   npx tsx scripts/check-concepts.ts --strict   # sale 1 si hay pendientes
//
// LA PUERTA QUE FALTABA. Un ítem publicado con `concepts: []` **no se
// cuenta en ningún punto**: el bucle de asignación de
// `split-conceptos.ts` itera `x.concepts`, así que el ítem no está mal
// contado, es INVISIBLE para la tabla que gobierna el calendario.
//
// Medido en E2#14: eran 109 ejercicios, el 4,5 % del corpus, y al
// etiquetarlos **cinco puntos cerraron sin escribir un solo ítem** y el
// déficit bajó 35. La causa era limpia: los lotes 1-4 y el piloto son
// anteriores a la regla «declara `concepts` en cada ítem nuevo»; del
// lote 5 en adelante, cero.
//
// Por eso este gate no prohíbe sin más: distingue el ítem SIN REVISAR
// del REVISADO Y DECLARADO sin punto (léxico temático, tareas de
// mediación que no cubren un punto de gramática). Lo segundo es una
// decisión y vive en `docs/plans/etiquetado-e2-14.json`; lo primero es
// deuda.
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { PARTICIONES, TRANSVERSALES } from './lib/conceptos-finos';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const STRICT = process.argv.includes('--strict');
const DECL = path.join(process.cwd(), 'docs/plans/etiquetado-e2-14.json');

const declarados = new Set<string>();
if (fs.existsSync(DECL))
  for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(DECL, 'utf8')) as Record<string, unknown>))
    if (!k.startsWith('_') && v === null) declarados.add(k);

const VALIDOS = new Set<string>([...ALL_CONCEPTS, ...CONCEPTOS_FINOS].map((c) => c.id));
for (const p of PARTICIONES) for (const s of p.subs) VALIDOS.add(s.id);
for (const t of TRANSVERSALES) VALIDOS.add(t.id);

const items: any[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) items.push(ex);

const sinRevisar = items.filter((e) => !(e.concepts ?? []).length && !declarados.has(e.id));
const declaradosVivos = items.filter((e) => !(e.concepts ?? []).length && declarados.has(e.id));
const inventados = items.flatMap((e) =>
  (e.concepts ?? []).filter((c: string) => !VALIDOS.has(c)).map((c: string) => `${e.id}: «${c}» no es un punto declarado`));

console.log(`# concepts — ${items.length} ejercicios\n`);
console.log(`- con punto declarado: **${items.length - sinRevisar.length - declaradosVivos.length}**`);
console.log(`- revisados y declarados SIN punto (decisión, no olvido): **${declaradosVivos.length}**`);
console.log(`- **sin revisar: ${sinRevisar.length}**`);
console.log(`- etiquetas inventadas (no existen en el inventario): **${inventados.length}**\n`);

if (declaradosVivos.length) {
  const porTipo = new Map<string, number>();
  for (const e of declaradosVivos) porTipo.set(e.type, (porTipo.get(e.type) ?? 0) + 1);
  console.log(`Los declarados sin punto, por tipo: ${[...porTipo].map(([t, n]) => `${t} ${n}`).join(' · ')}`);
  console.log(`Viven en \`docs/plans/etiquetado-e2-14.json\` con su motivo escrito.\n`);
}
for (const e of sinRevisar.slice(0, 40)) console.log(`  SIN REVISAR  ${e.id}  [${e.type}]  ${e.lessonId ?? ''}`);
for (const s of inventados) console.log(`  INVENTADA    ${s}`);

if (STRICT && (sinRevisar.length || inventados.length)) {
  console.log(`\n**FALLA**: ${sinRevisar.length} sin revisar, ${inventados.length} inventadas.`);
  console.log('Un ítem sin punto no existe para la tabla de cobertura. Etiquétalo,');
  console.log('o decláralo en el JSON con su motivo — pero que sea una decisión.');
  process.exit(1);
}
console.log('\nSin deuda de etiquetado.');
