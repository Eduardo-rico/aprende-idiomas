// scripts/publicar-cloze-ro.ts
//
//   npx tsx scripts/publicar-cloze-ro.ts --lote a1            # dry-run
//   npx tsx scripts/publicar-cloze-ro.ts --lote a1 --write    # escribe
//
// El publicador de cloze del rumano: el de PT (`publicar-cloze.ts`) con el
// currículo y los lotes de `ro`. Mismo contrato: **valida TODO antes de
// escribir NADA**, elige la lección por los `conceptIds` declarados, dice
// en voz alta cuántos caen en la lección por defecto, y escribe el SELLO
// al publicar. El sello rumano responde a su pregunta y no a otra: la
// lengua la certifican el paradigma + Hunspell + el lingüista adversarial
// (agente, sin oído nativo); no hay variante europea/brasileña que sellar.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/ro/curriculum';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import { ITEMS as A1, verificar as verificarA1, respuestaDe, type ClozeRo } from './lotes/cloze-ro-a1';
import { ITEMS as A2, verificar as verificarA2 } from './lotes/cloze-ro-a2';
import { ITEMS as A2B, verificar as verificarA2B } from './lotes/cloze-ro-a2b';
import { ITEMS as A2C, verificar as verificarA2C } from './lotes/cloze-ro-a2c';
import { ITEMS as A2D, verificar as verificarA2D } from './lotes/cloze-ro-a2d';
import { ITEMS_CON_ALT as A2E, verificar as verificarA2E } from './lotes/cloze-ro-a2e';
import { ITEMS as A1C, verificar as verificarA1C } from './lotes/cloze-ro-a1c';
import { ITEMS as A1D, verificar as verificarA1D } from './lotes/cloze-ro-a1d';
import { ITEMS as A2F, verificar as verificarA2F } from './lotes/cloze-ro-a2f';
import { ITEMS as A1E, verificar as verificarA1E } from './lotes/cloze-ro-a1e';

const LOTES: Record<string, { items: ClozeRo[]; verificar: (xs: ClozeRo[]) => string[] }> = { a1: { items: A1, verificar: verificarA1 }, a2: { items: A2, verificar: verificarA2 }, a2b: { items: A2B, verificar: verificarA2B }, a2c: { items: A2C, verificar: verificarA2C }, a2d: { items: A2D, verificar: verificarA2D }, a2e: { items: A2E, verificar: verificarA2E }, a1c: { items: A1C, verificar: verificarA1C }, a1d: { items: A1D, verificar: verificarA1D }, a2f: { items: A2F, verificar: verificarA2F }, a1e: { items: A1E, verificar: verificarA1E } };
const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const LOTE = LOTES[lote];
const ITEMS = LOTE?.items;
if (!ITEMS) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const write = process.argv.includes('--write');
const BLOCKS_DIR = blocksDir('ro');
const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas: string[] = [];
const porDefecto: string[] = [];

problemas.push(...LOTE!.verificar(ITEMS));

const yaEnCorpus = new Map<string, string>();
if (fs.existsSync(BLOCKS_DIR)) for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
  for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]) {
    const s = ex?.data?.sentence;
    if (typeof s === 'string') yaEnCorpus.set(s.toLowerCase().replace(/\s+/g, ' ').trim(), ex.id);
  }

const porBloque = new Map<number, unknown[]>();
const usados = new Set<string>();
ITEMS.forEach((x, i) => {
  const c = CONCEPTO.get(x.p);
  if (!c) { problemas.push(`ítem ${i + 1}: el punto «${x.p}» no existe en el inventario`); return; }
  const bloque = BLOCKS.find((b) => b.id === c.blockId);
  if (!bloque) { problemas.push(`ítem ${i + 1}: el bloque ${c.blockId} de «${x.p}» no tiene lecciones declaradas`); return; }
  const padres = new Set<string>([x.p, ...c.prereqs]);
  const leccion = bloque.lessons.find((l) => (l.conceptIds ?? []).some((k) => padres.has(k))) ?? bloque.lessons[0];
  if (!leccion) { problemas.push(`ítem ${i + 1}: el bloque ${bloque.id} no tiene lecciones`); return; }
  const answer = respuestaDe(x)!;
  const data = { sentence: x.s, blanks: [{ position: 0, answer, alternatives: x.alt ?? [] }], hintEs: x.pista };
  // El id ES el hash del contenido (con ș/ț canonicalizados en el hash):
  // dos textos idénticos con distinta codificación no son dos ítems.
  const id = hashKey({ type: 'fill_blank', data, variantOverrides: undefined, esContrast: undefined }).slice(0, 8);
  if (!(leccion.conceptIds ?? []).some((k) => padres.has(k))) porDefecto.push(`${id} (${x.p}) → ${leccion.id}`);
  const clave = x.s.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la frase ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: frase repetida dentro del lote`);
  usados.add(clave);
  const ex = {
    id, blockId: bloque.id, lessonId: leccion.id, difficulty: 2, concepts: [x.p],
    tags: [`ro-${lote}`, 'cloze-con-pista', x.transparenteLatin ? 'transparente-latin' : 'opaco-latin'],
    contentHash: hashKey({ type: 'fill_blank', data }),
    variantStatus: 'neutral',
    variantVerificacion: `Cloze derivado RO-${lote.toUpperCase()} (2026-09-01): respuesta recalculada por paradigma-ro; frase entera por Hunspell ro_RO; ortografía DOOM3; revisado por linguista-adversarial-ro (agente, sin oído nativo). Responde a «¿la forma y la frase son rumano correcto?»; no certifica voz.`,
    register: 'neutro', type: 'fill_blank', data,
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar cloze RO-${lote} — ${ITEMS.length} ítems en ${porBloque.size} bloques\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
if (porDefecto.length) { console.log(`\n**${porDefecto.length} ítems caen en la lección por DEFECTO:**`); for (const s of porDefecto) console.log(`- ${s}`); }
if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log('\nGates limpios.');
if (!write) { console.log('DRY-RUN: el corpus no se ha tocado. Repite con --write.'); process.exit(0); }
fs.mkdirSync(BLOCKS_DIR, { recursive: true });
for (const [b, xs] of porBloque) {
  const f = path.join(BLOCKS_DIR, `b${b}.json`);
  const arr = fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[]) : [];
  arr.push(...xs);
  fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
  console.log(`escrito ro/blocks/b${b}.json (+${xs.length})`);
}
