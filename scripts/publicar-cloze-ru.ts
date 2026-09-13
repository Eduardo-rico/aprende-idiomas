// scripts/publicar-cloze-ru.ts
//
//   npx tsx scripts/publicar-cloze-ru.ts --lote a1            # dry-run
//   npx tsx scripts/publicar-cloze-ru.ts --lote a1 --write    # escribe
//
// El publicador de cloze del ruso. Mismo contrato que el rumano
// (`publicar-cloze-ro.ts`): **valida TODO antes de escribir NADA**, elige la
// lección por los `conceptIds` declarados, dice en voz alta cuántos ítems
// caen en la lección por defecto, y escribe el SELLO al publicar.
//
// ⚠ EL SELLO RESPONDE A UNA PREGUNTA Y NO A OTRA, y en ruso eso hay que
// decirlo más alto que en ninguna otra lengua porque el dueño del proyecto no
// lee cirílico con soltura. Lo que certifica: que la forma la deriva
// `paradigma-ru.ts` desde `lexicon-a1.ts`, que está atestada en 7,7 M de
// palabras, que la ortografía y los homóglifos pasan `revisarOrtografiaRu`, y
// que la revisó el `linguista-adversarial-ru` (agente, sin oído nativo). Lo
// que NO certifica: la VOZ. En ruso no hay una sola voz validada y el acento
// no se escribe, así que un sello que hablara de pronunciación estaría
// mintiendo sobre lo único que aquí nadie ha medido.
//
// ⚠ Y EL `contentHash` NO PLIEGA LA Ё, a diferencia del rumano, donde el hash
// canonicaliza `ș`/`ț`. `ş`/`ș` son dos CODIFICACIONES del mismo dato y
// plegarlas une dos ids que son uno; `все`/`всё` son dos PALABRAS y plegarlas
// fundiría dos ítems distintos y pagaría un MP3 que dice la palabra
// equivocada. Misma operación, signo contrario, y sólo se distinguen mirando
// qué es el dato.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/ru/curriculum';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import { leccionParaPunto } from './lib/leccion-ru';
import { ITEMS as A1, verificar as verificarA1, respuestaDe, alternativasDe, type ClozeRu } from './lotes/cloze-ru-a1';

const LOTES: Record<string, { items: ClozeRu[]; verificar: (xs: ClozeRu[]) => string[] }> = {
  a1: { items: A1, verificar: verificarA1 },
};

const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const LOTE = LOTES[lote];
if (!LOTE) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const ITEMS = LOTE.items;
const write = process.argv.includes('--write');
// La FECHA del sello se CALCULA. Escrita a mano se le pone igual a todo lote
// futuro, y un sello que miente sobre cuándo se certificó no responde a
// ninguna pregunta — la mentira no la ve nadie porque el sello no se relee.
const HOY = new Date().toISOString().slice(0, 10);
const BLOCKS_DIR = blocksDir('ru');
const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas: string[] = [];
const porDefecto: string[] = [];

problemas.push(...LOTE.verificar(ITEMS));

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
  // ⚠ DOS PASADAS, y la precedencia vive en `lib/leccion-ru.ts`: primero la
  // lección que declara EL PUNTO y sólo después la que declara un
  // prerrequisito. La expresión de una sola pasada que había aquí era correcta
  // mientras cada bloque tuviera una lección y se volvió incorrecta EN SILENCIO
  // al entrar b5 y b7 con dos cada uno — y el aviso de «lección por defecto»
  // usaba el mismo predicado, así que no podía delatarlo.
  const elegida = leccionParaPunto(bloque.lessons, x.p, c.prereqs);
  if (!elegida) { problemas.push(`ítem ${i + 1}: el bloque ${bloque.id} no tiene lecciones`); return; }
  const { leccion, via } = elegida;
  const answer = respuestaDe(x);
  if (!answer) { problemas.push(`ítem ${i + 1}: sin respuesta derivada`); return; }
  const data = { sentence: x.s, blanks: [{ position: 0, answer, alternatives: alternativasDe(x) }], hintEs: x.pista };
  const id = hashKey({ type: 'fill_blank', data, variantOverrides: undefined, esContrast: undefined }).slice(0, 8);
  if (via !== 'punto') porDefecto.push(`${id} (${x.p}) → ${leccion.id} [por ${via}]`);
  const clave = x.s.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la frase ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: frase repetida dentro del lote`);
  usados.add(clave);
  const ex = {
    id, blockId: bloque.id, lessonId: leccion.id, difficulty: 2, concepts: [x.p],
    tags: [`ru-${lote}`, 'cloze-con-pista', `caso-${x.caso}`, ...(x.frontera ? ['frontera-sobreaplicacion'] : [])],
    contentHash: hashKey({ type: 'fill_blank', data }),
    variantStatus: 'neutral',
    variantVerificacion: `Cloze derivado RU-${lote.toUpperCase()} (${HOY}): forma recalculada por paradigma-ru desde lexicon-a1; atestada en 7,7 M de palabras (scripts/corpus-ru.ts); ortografía y homóglifos por revisarOrtografiaRu; la ё comprobada sin fundir (candidatasConYo); revisado por linguista-adversarial-ru (agente, sin oído nativo). Responde a «¿la forma y la frase son ruso correcto?». NO certifica la VOZ: en ruso no hay ninguna voz validada y el acento no se escribe.`,
    register: 'neutro', type: 'fill_blank', data,
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar cloze RU-${lote} — ${ITEMS.length} ítems en ${porBloque.size} bloques\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
if (porDefecto.length) { console.log(`\n**${porDefecto.length} ítems NO caen en una lección que declare su punto:**`); for (const s of porDefecto) console.log(`- ${s}`); }
if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log('\nGates limpios.');
if (!write) { console.log('DRY-RUN: el corpus no se ha tocado. Repite con --write.'); process.exit(0); }
fs.mkdirSync(BLOCKS_DIR, { recursive: true });
for (const [b, xs] of porBloque) {
  const f = path.join(BLOCKS_DIR, `b${b}.json`);
  const arr = fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[]) : [];
  arr.push(...xs);
  fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
  console.log(`escrito ru/blocks/b${b}.json (+${xs.length})`);
}
