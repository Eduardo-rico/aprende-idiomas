// scripts/publicar-correccion.ts
//
//   npx tsx scripts/publicar-correccion.ts --lote e2-21a            # dry-run
//   npx tsx scripts/publicar-correccion.ts --lote e2-21a --write    # escribe
//
// Publica un lote de corrección como ítems `error_correction`. Mismo
// contrato que los otros publicadores: valida TODO antes de escribir NADA.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { verificar, preflight, type ItemCorreccion } from './lib/correccion';
import { ITEMS as A } from './lotes/corr-e2-21a';
import { ITEMS as B } from './lotes/corr-e2-21b';

const LOTES: Record<string, ItemCorreccion[]> = { 'e2-21a': A, 'e2-21b': B };

const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const ITEMS = LOTES[lote];
if (!ITEMS) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const write = process.argv.includes('--write');

const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas = [...verificar(ITEMS)];
const porDefecto: string[] = [];
const yaEnCorpus = new Map<string, string>();
for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
  for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
    for (const k of ['sentence', 'source', 'sourceText']) {
      const t = ex?.data?.[k];
      if (typeof t === 'string') yaEnCorpus.set(t.toLowerCase().replace(/\s+/g, ' ').trim(), ex.id);
    }

const porBloque = new Map<number, unknown[]>();
const usados = new Set<string>();
ITEMS.forEach((x, i) => {
  const id = `co${lote.replace('e2-', '')}-${String(i + 1).padStart(3, '0')}`;
  const c = CONCEPTO.get(x.p);
  if (!c) { problemas.push(`${id}: el punto «${x.p}» no existe`); return; }
  const bloque = BLOCKS.find((b) => b.id === (c as any).blockId);
  if (!bloque) { problemas.push(`${id}: bloque inexistente`); return; }
  const padres = new Set<string>([x.p, ...(((c as any).prereqs ?? []) as string[])]);
  const leccion = bloque.lessons.find((l) => (l.conceptIds ?? []).some((k: string) => padres.has(k))) ?? bloque.lessons[0];
  if (!leccion) { problemas.push(`${id}: bloque sin lecciones`); return; }
  if (!(leccion.conceptIds ?? []).some((k: string) => padres.has(k))) porDefecto.push(`${id} (${x.p}) → ${leccion.id}`);

  const clave = x.mala.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la frase ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: frase repetida en el lote`);
  usados.add(clave);

  const ex = {
    id, blockId: bloque.id, lessonId: leccion.id, difficulty: 2,
    concepts: [x.p], tags: [lote, 'correccion'],
    contentHash: crypto.createHash('sha256').update(`${x.mala}|${x.buena}`).digest('hex'),
    variantStatus: 'unchecked',
    // El aviso de variante va en el ítem, no en un silenciador: el error
    // deliberado ES el material, y quien audite tiene que saberlo.
    variantVerificacion: `Corrección ${lote.toUpperCase()}: la frase mala es el calco de «${x.calcoEs}». ${x.varianteEsperada ? `El gate de variante MUERDE por diseño (${x.varianteEsperada}) — el error es el material del ejercicio, no un descuido.` : ''}`,
    register: 'neutro',
    type: 'error_correction',
    data: {
      sentence: x.mala,
      correct: x.buena,
      alternatives: x.alt ?? [],
      calcoEs: x.calcoEs,
      explanationEs: x.explicacion,
    },
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar corrección ${lote} — ${ITEMS.length} ítems\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
console.log('');
for (const l of preflight(ITEMS)) console.log(l);
if (porDefecto.length) { console.log(`\n**${porDefecto.length} en lección por DEFECTO:**`); for (const s of porDefecto) console.log(`- ${s}`); }
if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log('\nGates limpios.');
if (!write) { console.log('DRY-RUN. Repite con --write.'); process.exit(0); }
for (const [b, xs] of porBloque) {
  const f = path.join(BLOCKS_DIR, `b${b}.json`);
  const arr = JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[];
  arr.push(...xs);
  fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
  console.log(`escrito b${b}.json (+${xs.length})`);
}
