// scripts/publicar-mediacion-ro.ts
//
//   npx tsx scripts/publicar-mediacion-ro.ts --lote a1            # dry-run
//   npx tsx scripts/publicar-mediacion-ro.ts --lote a1 --write    # escribe
//
// El publicador de mediación del rumano: el de PT (`publicar-mediacion.ts`)
// con el currículo y los lotes de `ro`, y las DOS familias por la misma
// puerta (REGISTRO y EXPLICAR), porque el lote rumano las trae juntas.
// Orden del contrato, igual que en todos: **valida TODO antes de escribir
// NADA**.
//
// El sello responde a UNA pregunta y la escribe: que la fuente y el modelo
// son rumano del registro declarado y que la rúbrica está DERIVADA del
// modelo, no escrita aparte. NO certifica voz (no hay audio) ni variante
// (el rumano no tiene la europea/brasileña que sellar en portugués).
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/ro/curriculum';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import { rubricaDe, type ItemMed } from './lotes/lote12-mediacion';
import { rubricaDe as rubricaExplica, type ItemExplica } from './lib/explicar-mediacion';
import { REGISTRO, EXPLICAR, LENGUA, verificar } from './lotes/med-ro-a1';

const LOTES: Record<string, { registro: ItemMed[]; explicar: ItemExplica[]; verificar: () => string[] }> = {
  a1: { registro: REGISTRO, explicar: EXPLICAR, verificar },
};
const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const lote = arg('--lote') ?? '';
const LOTE = LOTES[lote];
if (!LOTE) { console.error(`Usa --lote con uno de: ${Object.keys(LOTES).join(', ')}`); process.exit(2); }
const write = process.argv.includes('--write');
const BLOCKS_DIR = blocksDir('ro');

// El `address` es un ENUM del esquema, no texto libre. En PT se cazó
// DESPUÉS de escribir 24 ítems; aquí para antes de tocar el corpus.
const ADDRESS_VALIDOS = new Set(['tu', 'terceira_sem_pronome', 'nome_cargo', 'o_senhor', 'V_Exa', 'voce_BR', 'dumneavoastră']);

const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const problemas: string[] = [...LOTE.verificar()];
const porDefecto: string[] = [];

const yaEnCorpus = new Map<string, string>();
if (fs.existsSync(BLOCKS_DIR)) for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
  for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
    for (const k of ['sentence', 'source', 'sourceText']) { const t = ex?.data?.[k]; if (typeof t === 'string') yaEnCorpus.set(t.toLowerCase().replace(/\s+/g, ' ').trim(), ex.id); }

const porBloque = new Map<number, unknown[]>();
const usados = new Set<string>();

const destino = (concepto: string, id: string) => {
  const c = CONCEPTO.get(concepto);
  if (!c) { problemas.push(`${id}: el punto «${concepto}» no existe en el inventario`); return null; }
  const bloque = BLOCKS.find((b) => b.id === c.blockId);
  if (!bloque) { problemas.push(`${id}: el bloque ${c.blockId} de «${concepto}» no tiene lecciones`); return null; }
  const padres = new Set<string>([concepto, ...c.prereqs]);
  const leccion = bloque.lessons.find((l) => (l.conceptIds ?? []).some((k) => padres.has(k))) ?? bloque.lessons[0];
  if (!leccion) { problemas.push(`${id}: el bloque ${bloque.id} no tiene lecciones`); return null; }
  if (!(leccion.conceptIds ?? []).some((k) => padres.has(k))) porDefecto.push(`${id} (${concepto}) → ${leccion.id}`);
  return { bloque, leccion };
};

const unico = (texto: string, id: string) => {
  const clave = texto.toLowerCase().replace(/\s+/g, ' ').trim();
  if (yaEnCorpus.has(clave)) problemas.push(`${id}: la fuente ya está publicada en ${yaEnCorpus.get(clave)}`);
  if (usados.has(clave)) problemas.push(`${id}: fuente repetida dentro del propio lote`);
  usados.add(clave);
};

const SELLO = (familia: string) =>
  `Mediación RO-${lote.toUpperCase()} · ${familia} (2026-09-02): rúbrica DERIVADA de lo declarado (marcadores y datos, o puntos clave con su ancla) y comprobada casilla a casilla contra el modelo; fuente y modelo rumanos por Hunspell ro_RO con exenciones atestadas; ortografía DOOM3; atacado por linguista-adversarial-ro (agente, sin oído nativo) con 4 ERROR aplicados. Responde a «¿el modelo cumple su propia rúbrica y es rumano del registro declarado?»; NO certifica voz.`;

for (const x of LOTE.registro) {
  if (x.address && !ADDRESS_VALIDOS.has(x.address))
    problemas.push(`${x.id}: address «${x.address}» no está en el enum del esquema`);
  const d = destino(x.concepto, x.id);
  if (!d) continue;
  unico(x.sourceText, x.id);
  const data = {
    sourceText: x.sourceText, sourceLang: LENGUA, targetLang: LENGUA,
    mediationType: 'reformulate_register', audience: x.audience, instructionsEs: x.instruccion,
    wordRange: { min: x.wordRange[0], max: x.wordRange[1] }, rubric: rubricaDe(x), modelAnswer: x.modelo,
  };
  const id = hashKey({ type: 'mediation', data }).slice(0, 8);
  porBloque.set(d.bloque.id, [...(porBloque.get(d.bloque.id) ?? []), {
    id, blockId: d.bloque.id, lessonId: d.leccion.id, difficulty: 3, concepts: [x.concepto],
    tags: [`ro-med-${lote}`, 'mediacao', 'registro'],
    contentHash: hashKey({ type: 'mediation', data }),
    variantStatus: 'neutral', variantVerificacion: SELLO('REGISTRO'),
    register: x.register, ...(x.address ? { address: x.address } : {}),
    type: 'mediation', data,
  }]);
}

for (const x of LOTE.explicar) {
  const d = destino(x.concepto, x.id);
  if (!d) continue;
  unico(x.sourceText, x.id);
  const data = {
    sourceText: x.sourceText, sourceLang: LENGUA, targetLang: x.lenguaExplicacion,
    mediationType: 'explain_concept', audience: x.audience, instructionsEs: x.instruccion,
    wordRange: { min: x.wordRange[0], max: x.wordRange[1] }, rubric: rubricaExplica(x), modelAnswer: x.modelo,
  };
  const id = hashKey({ type: 'mediation', data }).slice(0, 8);
  porBloque.set(d.bloque.id, [...(porBloque.get(d.bloque.id) ?? []), {
    id, blockId: d.bloque.id, lessonId: d.leccion.id, difficulty: 3, concepts: [x.concepto],
    tags: [`ro-med-${lote}`, 'mediacao', 'explicar'],
    contentHash: hashKey({ type: 'mediation', data }),
    variantStatus: 'neutral', variantVerificacion: SELLO('EXPLICAR'),
    register: x.register, type: 'mediation', data,
  }]);
}

console.log(`# Publicar mediación RO-${lote} — ${LOTE.registro.length} registro + ${LOTE.explicar.length} explicar\n`);
for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
if (porDefecto.length) { console.log(`\n**${porDefecto.length} en lección por DEFECTO:**`); for (const s of porDefecto) console.log(`- ${s}`); }
if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log('\nGates limpios.');
if (!write) { console.log('DRY-RUN: el corpus no se ha tocado. Repite con --write.'); process.exit(0); }
for (const [b, xs] of porBloque) {
  const f = path.join(BLOCKS_DIR, `b${b}.json`);
  const arr = fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[]) : [];
  arr.push(...xs);
  fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
  console.log(`escrito ro/blocks/b${b}.json (+${xs.length})`);
}
