// scripts/publicar-transformacion.ts
//
//   npx tsx scripts/publicar-transformacion.ts --lote e2-19            # dry-run
//   npx tsx scripts/publicar-transformacion.ts --lote e2-19 --write    # escribe
//
// Publica un lote de transformación. Mismo contrato que los otros dos
// publicadores: **valida TODO antes de escribir NADA**, elige la lección
// por los `conceptIds` declarados y dice en voz alta cuántos ítems caen
// en la lección por defecto.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { verificar, respuestaDe, informeEspejo, type ItemTrans } from './lib/transformacion';
import { ITEMS as E2_19 } from './lotes/trans-e2-19';
import { ITEMS as E2_19B } from './lotes/trans-e2-19b';
import { ITEMS as E2_20 } from './lotes/trans-e2-20';

const LOTES: Record<string, ItemTrans[]> = { 'e2-19': E2_19, 'e2-19b': E2_19B, 'e2-20': E2_20 };

const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const ITEMS = LOTES[lote];
if (!ITEMS) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const write = process.argv.includes('--write');

const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas: string[] = [...verificar(ITEMS)];
const porDefecto: string[] = [];

// Virginidad: una fuente idéntica a otra ya publicada no es un ítem nuevo.
const yaEnCorpus = new Map<string, string>();
for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
  for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]) {
    for (const k of ['source', 'sentence', 'sourceText']) {
      const t = ex?.data?.[k];
      if (typeof t === 'string') yaEnCorpus.set(t.toLowerCase().replace(/\s+/g, ' ').trim(), ex.id);
    }
  }

const porBloque = new Map<number, unknown[]>();
const usados = new Set<string>();
ITEMS.forEach((x, i) => {
  const id = `tr${lote.replace('e2-', '')}-${String(i + 1).padStart(3, '0')}`;
  const c = CONCEPTO.get(x.p);
  if (!c) { problemas.push(`${id}: el punto «${x.p}» no existe en ALL_CONCEPTS`); return; }
  const bloque = BLOCKS.find((b) => b.id === (c as any).blockId);
  if (!bloque) { problemas.push(`${id}: el bloque ${(c as any).blockId} no existe`); return; }
  const padres = new Set<string>([x.p, ...(((c as any).prereqs ?? []) as string[])]);
  const leccion = bloque.lessons.find((l) => (l.conceptIds ?? []).some((k: string) => padres.has(k))) ?? bloque.lessons[0];
  if (!leccion) { problemas.push(`${id}: el bloque ${bloque.id} no tiene lecciones`); return; }
  if (!(leccion.conceptIds ?? []).some((k: string) => padres.has(k))) porDefecto.push(`${id} (${x.p}) → ${leccion.id}`);

  const answer = respuestaDe(x)!;
  const clave = x.s.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la fuente ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: fuente repetida dentro del lote`);
  usados.add(clave);

  const ex = {
    id,
    blockId: bloque.id,
    lessonId: leccion.id,
    difficulty: 2,
    concepts: [x.p],
    tags: [lote, 'transformacion'],
    contentHash: crypto.createHash('sha256').update(`${x.s}|${answer}`).digest('hex'),
    // El sello se escribe AQUÍ, al publicar, y no en una sesión de
    // limpieza seis semanas después. Es la mitad durable de la
    // calibración de E2#22: sin esto, cada lote vuelve a nacer
    // `unchecked` y el montón se reconstruye solo.
    variantStatus: 'neutral',
    variantVerificacion: `Transformación ${lote.toUpperCase()}: respuesta DERIVADA del paradigma y recalculada por el gate; atajo de traducción declarado por ítem y medido en el lote`,
    register: 'neutro',
    type: 'transformation',
    data: {
      source: x.s,
      instructionEs: x.instruccion,
      answer,
      alternatives: x.alt ?? [],
      ...(x.hint ? { hintEs: x.hint } : {}),
      espejoEs: x.espejoEs,
    },
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar transformación ${lote} — ${ITEMS.length} ítems\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
console.log('');
for (const l of informeEspejo(ITEMS)) console.log(l);
if (porDefecto.length) {
  console.log(`\n**${porDefecto.length} ítems caen en la lección por DEFECTO:**`);
  for (const s of porDefecto) console.log(`- ${s}`);
}
if (problemas.length) {
  console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`);
  for (const s of problemas) console.log(`- ${s}`);
  process.exit(1);
}
console.log('\nGates limpios.');
if (!write) { console.log('DRY-RUN: el corpus no se ha tocado. Repite con --write.'); process.exit(0); }
for (const [b, xs] of porBloque) {
  const f = path.join(BLOCKS_DIR, `b${b}.json`);
  const arr = JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[];
  arr.push(...xs);
  fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
  console.log(`escrito b${b}.json (+${xs.length})`);
}
