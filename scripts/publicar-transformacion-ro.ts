// scripts/publicar-transformacion-ro.ts — EL PUBLICADOR DE LA TERCERA MÁQUINA.
//
//   npx tsx scripts/publicar-transformacion-ro.ts --lote l23          # dry-run
//   npx tsx scripts/publicar-transformacion-ro.ts --lote l23 --write  # escribe
//
// Mismo contrato que los publicadores de cloze y corrección del rumano:
// **valida TODO antes de escribir NADA**, elige la lección por los
// `conceptIds` declarados y dice en voz alta cuántos ítems caen en la
// lección por defecto. El id es el hash del contenido con ș/ț
// canonicalizados, y el sello dice QUÉ certifica y qué no.
//
// Lo único propio: los gates de este formato son de LOTE, así que el
// informe de estrategias se imprime SIEMPRE —salga verde o rojo—, y cada
// lote trae sus JUICIOS escritos. Un lote sin juicios no se publica: el
// invariante no es un número, es «cero señales sin motivo escrito».
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/ro/curriculum';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import { verificar, informe, type ItemTransRo, type Opciones } from './lib/transformacion-ro';
import { camposSinDeclarar } from './lib/gates-por-formato';
import { ITEMS as L23, OPCIONES as OP_L23 } from './lotes/trans-ro-l23';
import { ITEMS as L24, OPCIONES as OP_L24 } from './lotes/trans-ro-l24';
import { ITEMS as L25, OPCIONES as OP_L25 } from './lotes/trans-ro-l25';

const LOTES: Record<string, { items: ItemTransRo[]; op: Opciones }> = {
  l23: { items: L23, op: OP_L23 },
  l24: { items: L24, op: OP_L24 },
  l25: { items: L25, op: OP_L25 },
};

const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const LOTE = LOTES[lote];
if (!LOTE) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const ITEMS = LOTE.items;
const write = process.argv.includes('--write');
const HOY = new Date().toISOString().slice(0, 10);
const BLOCKS_DIR = blocksDir('ro');
const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));

const problemas = [...verificar(ITEMS, LOTE.op)];
const porDefecto: string[] = [];

// Virginidad: una fuente idéntica a otra ya publicada no es un ítem nuevo.
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

  // El gate declarado tiene que EXISTIR: `transformacion` entra hoy en el
  // registro de campos exigidos porque hoy tiene máquina. Declararlos
  // antes habría sido prometer una cobertura que no existía.
  const faltan = camposSinDeclarar('transformacion', x as unknown as Record<string, unknown>);
  if (faltan.length) problemas.push(`ítem ${i + 1}: no declara ${faltan.join(', ')}`);

  const data = {
    source: x.s,
    instructionEs: x.instruccion,
    answer: x.r,
    alternatives: x.alt ?? [],
    ...(x.hint ? { hintEs: x.hint } : {}),
    espejoEs: x.espejoEs,
  };
  const id = hashKey({ type: 'transformation', data, variantOverrides: undefined, esContrast: undefined }).slice(0, 8);
  if (!(leccion.conceptIds ?? []).some((k) => padres.has(k))) porDefecto.push(`${id} (${x.p}) → ${leccion.id}`);
  const clave = x.s.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la fuente ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: fuente repetida en el lote`);
  usados.add(clave);

  const ex = {
    id, blockId: bloque.id, lessonId: leccion.id, difficulty: 2, concepts: [x.p],
    tags: [`ro-trans-${lote}`, 'transformacion'],
    contentHash: hashKey({ type: 'transformation', data }),
    variantStatus: 'neutral',
    // El sello responde a UNA pregunta, y dice cuál: usarlo como prueba de
    // otra fabrica trabajo ya hecho.
    variantVerificacion: `Transformación RO-${lote.toUpperCase()} (${HOY}): la respuesta es rumano correcto y está DETERMINADA por la consigna; las estrategias mecánicas del alumno (copiar el foco, repetir la edición modal del lote, traducir del español) se corrieron sobre el lote y ninguna pasa del 50 %; ortografía DOOM3; revisado por linguista-adversarial-ro (agente, sin oído nativo). NO certifica voz ni naturalidad de la fuente ante nativo.`,
    register: 'neutro', type: 'transformation', data,
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar transformación RO-${lote} — ${ITEMS.length} ítems\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
console.log('');
for (const l of informe(ITEMS, LOTE.op)) console.log(l);
console.log('\n## Los juicios escritos del lote\n');
console.log(`- **copia:** ${LOTE.op.juicios.copia}`);
console.log(`- **frontera:** ${LOTE.op.juicios.frontera}`);
console.log(`- **varianza:** ${LOTE.op.juicios.varianza}`);
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
