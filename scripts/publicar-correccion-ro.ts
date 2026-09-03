// scripts/publicar-correccion-ro.ts
//
//   npx tsx scripts/publicar-correccion-ro.ts --lote a1            # dry-run
//   npx tsx scripts/publicar-correccion-ro.ts --lote a1 --write    # escribe
//
// El publicador de corrección del rumano: el de PT con el currículo y los
// lotes de `ro`. Valida TODO antes de escribir NADA; el id es el hash del
// contenido con ș/ț canonicalizados; el sello dice qué certifica.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/ro/curriculum';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import { preflight, type ItemCorreccion } from './lib/correccion';
import { ITEMS as A1, verificar as verificarA1 } from './lotes/corr-ro-a1';
import { ITEMS as A1B, verificar as verificarA1B } from './lotes/corr-ro-a1b';
import { ITEMS as A2, verificar as verificarA2 } from './lotes/corr-ro-a2';
import { ITEMS as A1C, verificar as verificarA1C } from './lotes/corr-ro-a1c';
import { ITEMS as A2B, verificar as verificarA2B } from './lotes/corr-ro-a2b';
import { ITEMS as B1, verificar as verificarB1 } from './lotes/corr-ro-b1';

// Cada lote trae SU verificar: los gates de punto viven con el lote.
const LOTES: Record<string, { items: ItemCorreccion[]; verificar: (xs: ItemCorreccion[]) => string[] }> = {
  a1: { items: A1, verificar: verificarA1 },
  a1b: { items: A1B, verificar: verificarA1B },
  a2: { items: A2, verificar: verificarA2 },
  a1c: { items: A1C, verificar: verificarA1C },
  a2b: { items: A2B, verificar: verificarA2B },
  b1: { items: B1, verificar: verificarB1 },
};
const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const LOTE = LOTES[lote];
const ITEMS = LOTE?.items;
if (!ITEMS) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const write = process.argv.includes('--write');
// La FECHA del sello se calcula: estaba escrita a mano como «2026-09-01» y
// se la habría puesto tal cual a todo lote futuro. Un sello que miente
// sobre CUÁNDO se certificó no responde a ninguna pregunta, y la mentira
// no la ve nadie porque el sello no se vuelve a leer.
const HOY = new Date().toISOString().slice(0, 10);
const BLOCKS_DIR = blocksDir('ro');
const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas = [...LOTE!.verificar(ITEMS)];
const porDefecto: string[] = [];
const yaEnCorpus = new Map<string, string>();
if (fs.existsSync(BLOCKS_DIR)) for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
  for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
    for (const k of ['sentence', 'source', 'sourceText']) { const t = ex?.data?.[k]; if (typeof t === 'string') yaEnCorpus.set(t.toLowerCase().replace(/\s+/g, ' ').trim(), ex.id); }

const porBloque = new Map<number, unknown[]>();
const usados = new Set<string>();
ITEMS.forEach((x, i) => {
  const c = CONCEPTO.get(x.p);
  if (!c) { problemas.push(`ítem ${i + 1}: el punto «${x.p}» no existe en el inventario`); return; }
  const bloque = BLOCKS.find((b) => b.id === c.blockId);
  if (!bloque) { problemas.push(`ítem ${i + 1}: el bloque ${c.blockId} de «${x.p}» no tiene lecciones`); return; }
  const padres = new Set<string>([x.p, ...c.prereqs]);
  const leccion = bloque.lessons.find((l) => (l.conceptIds ?? []).some((k) => padres.has(k))) ?? bloque.lessons[0];
  if (!leccion) { problemas.push(`ítem ${i + 1}: bloque sin lecciones`); return; }
  const data = { sentence: x.mala, correct: x.buena, alternatives: x.alt ?? [], calcoEs: x.calcoEs, explanationEs: x.explicacion };
  const id = hashKey({ type: 'error_correction', data, variantOverrides: undefined, esContrast: undefined }).slice(0, 8);
  if (!(leccion.conceptIds ?? []).some((k) => padres.has(k))) porDefecto.push(`${id} (${x.p}) → ${leccion.id}`);
  const clave = x.mala.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la frase ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: frase repetida en el lote`);
  usados.add(clave);
  const ex = {
    id, blockId: bloque.id, lessonId: leccion.id, difficulty: 2, concepts: [x.p], tags: [`ro-corr-${lote}`, 'correccion'],
    contentHash: hashKey({ type: 'error_correction', data }),
    variantStatus: 'neutral',
    variantVerificacion: `Corrección RO-${lote.toUpperCase()} (${HOY}): la frase mala es el calco de «${x.calcoEs}»; la buena entera por Hunspell ro_RO; ortografía DOOM3; revisado por linguista-adversarial-ro (agente, sin oído nativo). Responde a «¿la buena es rumano correcto y la mala es el calco que el hispanohablante produce?»; no certifica voz.`,
    register: 'neutro', type: 'error_correction', data,
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar corrección RO-${lote} — ${ITEMS.length} ítems\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
console.log(''); for (const l of preflight(ITEMS)) console.log(l);
if (porDefecto.length) { console.log(`\n**${porDefecto.length} en lección por DEFECTO:**`); for (const s of porDefecto) console.log(`- ${s}`); }
if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log('\nGates limpios.');
if (!write) { console.log('DRY-RUN. Repite con --write.'); process.exit(0); }
for (const [b, xs] of porBloque) {
  const f = path.join(BLOCKS_DIR, `b${b}.json`);
  const arr = fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[]) : [];
  arr.push(...xs);
  fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
  console.log(`escrito ro/blocks/b${b}.json (+${xs.length})`);
}
