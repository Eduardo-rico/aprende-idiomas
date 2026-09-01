// scripts/publicar-cloze.ts
//
//   npx tsx scripts/publicar-cloze.ts --lote e2-17            # dry-run
//   npx tsx scripts/publicar-cloze.ts --lote e2-17 --write    # escribe
//
// Publica un lote de cloze en `blocks/bN.json`. Es genérico desde E2#17:
// la versión anterior estaba pegada al lote de E2#16 y copiarla para el
// siguiente habría sido la quinta duplicación de la sesión. El orden importa y es el
// del contrato: **valida TODO antes de escribir NADA**. Un publicador que
// escribe mientras valida deja el corpus a medias cuando el ítem 90 falla,
// y entonces la reparación es peor que el lote.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { respuestaDe, verificar, type Cloze } from './lotes/cloze-e2-15';

import { ITEMS as E2_16 } from './lotes/cloze-e2-16';
import { ITEMS as E2_17 } from './lotes/cloze-e2-17';
import { ITEMS as E2_19 } from './lotes/cloze-e2-19';
import { ITEMS as E2_22 } from './lotes/cloze-e2-22';

// Registro estático: `tsx` compila a CJS y un `await import()` de nivel
// superior no arranca. Un lote nuevo se añade con una línea aquí.
const LOTES: Record<string, Cloze[]> = { 'e2-16': E2_16, 'e2-17': E2_17, 'e2-19': E2_19, 'e2-22': E2_22 };

const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const ITEMS = LOTES[lote];
if (!ITEMS) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const prefijo = `cl${lote.replace('e2-', '')}`;

const write = process.argv.includes('--write');
const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas: string[] = [];
const porDefecto: string[] = [];   // ítems cuya lección no declara su punto: se dice, no se esconde

// 1 · los gates del propio lote, otra vez. No se confía en que ya se
// corrieran: se corren aquí, donde se decide escribir.
problemas.push(...verificar(ITEMS));

// 2 · cada punto tiene que existir y decir a qué bloque va.
const porBloque = new Map<number, unknown[]>();
const yaEnCorpus = new Map<string, string>();   // frase normalizada → id
for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
  for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]) {
    const s = ex?.data?.sentence;
    if (typeof s === 'string') yaEnCorpus.set(s.toLowerCase().replace(/\s+/g, ' ').trim(), ex.id);
  }

const usados = new Set<string>();
ITEMS.forEach((x, i) => {
  const id = `${prefijo}-${String(i + 1).padStart(3, '0')}`;
  const c = CONCEPTO.get(x.p);
  if (!c) { problemas.push(`${id}: el punto «${x.p}» no existe en ALL_CONCEPTS`); return; }
  const bloque = BLOCKS.find((b) => b.id === (c as any).blockId);
  if (!bloque) { problemas.push(`${id}: el bloque ${(c as any).blockId} de «${x.p}» no existe`); return; }
  // La lección se ELIGE, no se toma la primera: las lecciones declaran
  // sus `conceptIds`, y un sub-punto lleva a su padre en `prereqs`. Sin
  // esto los 30 ítems de b1 caían todos en «Alfabeto y acentos», que es
  // donde no se enseñan ni las nasales ni la crase.
  const padres = new Set<string>([x.p, ...(((c as any).prereqs ?? []) as string[])]);
  const leccion =
    bloque.lessons.find((l) => (l.conceptIds ?? []).some((k: string) => padres.has(k))) ??
    bloque.lessons[0];
  if (!leccion) { problemas.push(`${id}: el bloque ${bloque.id} no tiene lecciones`); return; }
  if (!(leccion.conceptIds ?? []).some((k: string) => padres.has(k))) porDefecto.push(`${id} (${x.p}) → ${leccion.id}`);

  const answer = respuestaDe(x)!;
  const clave = x.s.toLowerCase().replace(/\s+/g, ' ').trim();
  // 3 · VIRGINIDAD, la barata y la que importa: una frase idéntica a una
  // ya publicada no es un ítem nuevo, es un duplicado que cobra dos veces.
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la frase ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: frase repetida dentro del propio lote`);
  usados.add(clave);

  const ex = {
    id,
    blockId: bloque.id,
    lessonId: leccion.id,
    difficulty: 2,
    concepts: [x.p],
    tags: [lote, 'cloze-con-pista'],
    contentHash: crypto.createHash('sha256').update(`${x.s}|${answer}`).digest('hex'),
    // El sello se escribe AQUÍ, al publicar, y no en una sesión de
    // limpieza seis semanas después. Es la mitad durable de la
    // calibración de E2#22: sin esto, cada lote vuelve a nacer
    // `unchecked` y el montón se reconstruye solo.
    variantStatus: 'neutral',
    variantVerificacion: `Cloze con pista ${lote.toUpperCase()}: ${x.lema ? 'derivado del paradigma' : 'respuesta declarada'} + revisión completa del lote a mano`,
    register: 'neutro',
    type: 'fill_blank',
    data: {
      sentence: x.s,
      blanks: [{ position: 0, answer, alternatives: x.alt ?? [] }],
      hintEs: x.pista,
    },
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar cloze ${lote} — ${ITEMS.length} ítems en ${porBloque.size} bloques\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);

if (porDefecto.length) {
  console.log(`\n**${porDefecto.length} ítems caen en la lección por DEFECTO** — ninguna lección del bloque declara su punto:`);
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
