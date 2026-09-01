// scripts/publicar-mediacion.ts
//
//   npx tsx scripts/publicar-mediacion.ts --lote 14            # dry-run
//   npx tsx scripts/publicar-mediacion.ts --lote 14 --write    # escribe
//
// Publica un lote de mediación en `blocks/bN.json`. El lote 12 se escribió
// a mano en el corpus y no dejó publicador; éste lo es para todos, porque
// quedan cinco pasadas más y copiar el procedimiento cinco veces es la
// forma conocida de que la sexta salga distinta.
//
// Orden del contrato: **valida TODO antes de escribir NADA**.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { rubricaDe, verificar, type ItemMed } from './lotes/lote12-mediacion';
import { ITEMS as L14 } from './lotes/lote14-mediacion';
import { ITEMS as L15 } from './lotes/lote15-mediacion';
import { ITEMS as L16 } from './lotes/lote16-mediacion';

const LOTES: Record<string, ItemMed[]> = { '14': L14, '15': L15, '16': L16 };

const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const ITEMS = LOTES[lote];
if (!ITEMS) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const write = process.argv.includes('--write');

// El `address` es un ENUM del esquema, no texto libre. Se valida aquí
// porque `verify:content` lo cazó DESPUÉS de escribir 24 ítems: escribí
// «o senhor» y «a senhora» donde el esquema pide «o_senhor». Quedan cinco
// pasadas y el publicador tiene que parar esto antes de tocar el corpus.
const ADDRESS_VALIDOS = new Set(['tu', 'terceira_sem_pronome', 'nome_cargo', 'o_senhor', 'V_Exa', 'voce_BR']);

const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas: string[] = [...verificar(ITEMS)];
const porDefecto: string[] = [];

// Virginidad barata y la que importa: una fuente idéntica a una ya
// publicada no es un ítem nuevo. Se compara el sourceText normalizado.
const yaEnCorpus = new Map<string, string>();
for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
  for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]) {
    const t = ex?.data?.sourceText;
    if (typeof t === 'string') yaEnCorpus.set(t.toLowerCase().replace(/\s+/g, ' ').trim(), ex.id);
  }

const porBloque = new Map<number, unknown[]>();
const usados = new Set<string>();
for (const x of ITEMS) {
  if (x.address && !ADDRESS_VALIDOS.has(x.address))
    problemas.push(`${x.id}: address «${x.address}» no está en el enum del esquema (${[...ADDRESS_VALIDOS].join(' | ')})`);
  const c = CONCEPTO.get(x.concepto);
  if (!c) { problemas.push(`${x.id}: el punto «${x.concepto}» no existe en ALL_CONCEPTS`); continue; }
  const bloque = BLOCKS.find((b) => b.id === (c as any).blockId);
  if (!bloque) { problemas.push(`${x.id}: el bloque ${(c as any).blockId} no existe`); continue; }
  const padres = new Set<string>([x.concepto, ...(((c as any).prereqs ?? []) as string[])]);
  const leccion = bloque.lessons.find((l) => (l.conceptIds ?? []).some((k: string) => padres.has(k))) ?? bloque.lessons[0];
  if (!leccion) { problemas.push(`${x.id}: el bloque ${bloque.id} no tiene lecciones`); continue; }
  if (!(leccion.conceptIds ?? []).some((k: string) => padres.has(k))) porDefecto.push(`${x.id} (${x.concepto}) → ${leccion.id}`);

  const clave = x.sourceText.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${x.id}: la fuente ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${x.id}: fuente repetida dentro del propio lote`);
  usados.add(clave);

  const ex = {
    id: `b2c2-med-l${lote}-${x.id.split('-').pop()}`,
    blockId: bloque.id,
    lessonId: leccion.id,
    difficulty: 3,
    concepts: [x.concepto],
    tags: [`lote${lote}`, 'mediacao', 'registro'],
    contentHash: crypto.createHash('sha256').update(`${x.sourceText}|${x.modelo}`).digest('hex'),
    variantStatus: 'unchecked',
    variantVerificacion: `Mediación lote ${lote} (E2#18): rúbrica DERIVADA de marcadores y datos declarados; gate de trasvase por script, casilla a casilla; lote revisado ENTERO a mano tras morder el freno`,
    register: x.register,
    ...(x.address ? { address: x.address } : {}),
    type: 'mediation',
    data: {
      sourceText: x.sourceText,
      // La fuente de estos ítems es portuguesa en los dos sentidos: se
      // reformula el registro, no la lengua.
      sourceLang: 'pt',
      targetLang: 'pt',
      mediationType: 'reformulate_register',
      audience: x.audience,
      instructionsEs: x.instruccion,
      wordRange: { min: x.wordRange[0], max: x.wordRange[1] },
      rubric: rubricaDe(x),
      modelAnswer: x.modelo,
    },
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
}

console.log(`# Publicar mediación lote ${lote} — ${ITEMS.length} ítems\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
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
