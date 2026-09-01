// scripts/proponer-concepts.ts
//
//   npx tsx scripts/proponer-concepts.ts            # propone y lista
//   npx tsx scripts/proponer-concepts.ts --escribir # aplica lo aceptado
//
// EL BARRIDO DE ETIQUETADO. Existe por el hallazgo de E2#13: siete
// juicios publicados enseñaban aspecto y tiempo sin declararlo, y al
// etiquetarlos `b11-aspecto-tempo` pasó de 6 a 13 y **cerró sin escribir
// un solo ítem**. La regla que salió de ahí: **antes de escribir, medir;
// antes de medir, ETIQUETAR.**
//
// Y el dato que hace urgente el barrido: el bucle de asignación de
// `split-conceptos.ts` itera `x.concepts`, así que **un ítem con el campo
// vacío no se cuenta en NINGÚN punto**. No es que esté mal contado: es
// invisible. 109 ejercicios publicados —el 4,5 % del corpus— no existían
// para la tabla que gobierna el calendario del proyecto.
//
// La causa, medida y limpia: los lotes 1-4 y el piloto son anteriores a
// la regla «declara `concepts` en cada ítem nuevo», que nació con el eje
// 2 del gate de virginidad. De ahí los 74 juicios. Del lote 5 en
// adelante, CERO sin etiquetar.
//
// El método es el de E2#13: se propone por CONTENIDO —las mismas
// regexes de sub-punto y las transversales que usa la partición— y luego
// se revisa a mano. La propuesta no es el veredicto: es el orden de
// lectura.
import fs from 'node:fs';
import path from 'node:path';
import { PARTICIONES, TRANSVERSALES } from './lib/conceptos-finos';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const ESCRIBIR = process.argv.includes('--escribir');

/** El texto que se mira para decidir qué ENSEÑA el ítem. Mismo criterio
 *  que `split-conceptos.ts`: entra todo lo didáctico, porque aquí no se
 *  busca si está en portugués sino qué punto ejercita. */
export function textoItem(x: any, conGlosa = false): string {
  const d = x.data ?? {};
  const partes: string[] = [];
  const push = (v: unknown) => {
    if (typeof v === 'string') partes.push(v);
    else if (Array.isArray(v)) v.forEach(push);
    else if (v && typeof v === 'object') Object.values(v as object).forEach(push);
  };
  // EN MEDIACIÓN, la fuente NO es el punto. El `sourceText` es un texto
  // literario de la Biblioteca y dispara todas las regexes del
  // inventario a la vez —medido: 16 a 20 propuestas por ítem, todas
  // ruido—. Lo que decide qué enseña una mediación es lo que le PIDE al
  // alumno: la consigna, la rúbrica y la dirección de la tarea.
  const campos = x.type === 'mediation'
    ? ['instructionsEs', 'audience', 'mediationType', 'rubric']
    : ['sentence', 'repair', 'correct', 'answer', 'front', 'back', 'example',
       'question', 'options', 'audioText', 'source', 'target', 'words', 'pairs', 'blanks',
       'chunk', 'examples', 'text', 'verb', 'modelAnswer'];
  for (const k of campos) push(d[k]);
  if (conGlosa) for (const k of ['explanationEs', 'hintEs', 'glossEs']) push(d[k]);
  return partes.join(' · ');
}

const items: { fichero: string; ex: any }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) items.push({ fichero: f, ex });

const sinEtiqueta = items.filter(({ ex }) => !ex.concepts || ex.concepts.length === 0);

// ── El proponedor ────────────────────────────────────────────────────
// Se prueban TODAS las regexes de sub-punto del inventario y todas las
// transversales. Un ítem puede casar con varias: se listan todas, porque
// elegir es el trabajo humano y esconder alternativas lo falsearía.
const SUBS = PARTICIONES.flatMap((p) => p.subs.map((s) => ({ ...s, padre: p.padre })));

/** EL TRAMO QUE CAMBIA entre `sentence` y `repair`. En un juicio de
 *  gramaticalidad **eso ES el punto**: lo que el ítem juzga es
 *  exactamente lo que el repair corrige, y todo lo demás de la frase es
 *  contexto. Es la misma idea que los pares mínimos, leída al revés.
 *
 *  Sin esto la propuesta por bolsa de palabras devuelve entre 2 y 11
 *  candidatos por ítem, casi todos gramática incidental del contexto:
 *  «Vou perguntar-lhe se pode ajudar» disparaba once, ninguno el suyo. */
export function tramoJuzgado(ex: any): string {
  const d = ex.data ?? {};
  const a = String(d.sentence ?? ''), b = String(d.repair ?? '');
  if (!a || !b) return '';
  const pa = a.split(/\s+/), pb = b.split(/\s+/);
  let i = 0; while (i < pa.length && i < pb.length && pa[i] === pb[i]) i++;
  let j = 0; while (j < pa.length - i && j < pb.length - i && pa[pa.length - 1 - j] === pb[pb.length - 1 - j]) j++;
  return `${pa.slice(i, pa.length - j).join(' ')} → ${pb.slice(i, pb.length - j).join(' ')}`;
}

function proponer(ex: any): { id: string; via: string }[] {
  const out: { id: string; via: string }[] = [];
  const tr = TRANSVERSALES.find((r) => r.aplica(ex));
  if (tr) out.push({ id: tr.id, via: 'transversal' });
  const t = textoItem(ex);
  const g = textoItem(ex, true);
  for (const s of SUBS) {
    if (s.re.test(t)) out.push({ id: s.id, via: 'contenido' });
    else if (s.re.test(g)) out.push({ id: s.id, via: 'glosa (más débil)' });
  }
  return out;
}

// ── Decisiones tomadas a mano, tras leer la propuesta ────────────────
// Cada entrada es un ítem revisado: se escribe el punto que ENSEÑA, no
// el que sugiere su lección ni el que salga primero en la propuesta.
// Un `null` significa «revisado y no encaja en ningún punto declarado»:
// se queda sin etiqueta a propósito y se declara aquí, que es distinto
// de quedarse sin etiqueta por olvido.
const DECIDIDO: Record<string, string[] | null> = Object.fromEntries(
  Object.entries(JSON.parse(
  fs.existsSync(path.join(process.cwd(), 'docs/plans/etiquetado-e2-14.json'))
    ? fs.readFileSync(path.join(process.cwd(), 'docs/plans/etiquetado-e2-14.json'), 'utf8')
    : '{}',
  ) as Record<string, string[] | null>).filter(([k]) => !k.startsWith('_')),
);

const VALIDOS = new Set([...ALL_CONCEPTS, ...CONCEPTOS_FINOS].map((c) => c.id));
for (const s of SUBS) VALIDOS.add(s.id);
for (const t of TRANSVERSALES) VALIDOS.add(t.id);

if (!ESCRIBIR) {
  console.log(`# Ítems publicados sin \`concepts\` — ${sinEtiqueta.length}\n`);
  console.log('El bucle de asignación de `split-conceptos.ts` itera `x.concepts`:');
  console.log('un ítem con el campo vacío **no se cuenta en ningún punto**.\n');
  for (const { fichero, ex } of sinEtiqueta) {
    const p = proponer(ex);
    const dec = DECIDIDO[ex.id];
    const marca = dec === null ? 'DECLARADO SIN PUNTO' : dec ? `DECIDIDO → ${dec.join(', ')}` : 'pendiente';
    const solidas = p.filter((c) => c.via !== 'glosa (más débil)');
    console.log(`## ${ex.id}  [${ex.type}]  · ${ex.lessonId}`);
    console.log(`   ${textoItem(ex).slice(0, 130)}`);
    const tr = tramoJuzgado(ex);
    if (tr) console.log(`   JUZGA:  ${tr}`);
    console.log(`   propuesta (${solidas.length}): ${solidas.length ? solidas.map((c) => c.id).join(' · ') : '—ninguna—'}`);
    console.log(`   ${marca}\n`);
  }
  const pend = sinEtiqueta.filter(({ ex }) => DECIDIDO[ex.id] === undefined).length;
  console.log(`\n**Pendientes de decidir: ${pend} de ${sinEtiqueta.length}.**`);
  process.exit(0);
}

// ── Escritura ────────────────────────────────────────────────────────
const malos = Object.entries(DECIDIDO)
  .flatMap(([id, cs]) => (cs ?? []).filter((c) => !VALIDOS.has(c)).map((c) => `${id}: «${c}» no es un punto declarado`));
if (malos.length) { console.error(`NO se escribe nada:\n- ${malos.join('\n- ')}`); process.exit(1); }

let escritos = 0, declaradosSinPunto = 0;
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()) {
  const p = path.join(DIR, f);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  let tocado = false;
  for (const ex of d) {
    if (ex.concepts?.length) continue;
    const dec = DECIDIDO[ex.id];
    if (dec === undefined) continue;
    if (dec === null) { declaradosSinPunto++; continue; }
    ex.concepts = dec; tocado = true; escritos++;
  }
  if (tocado) fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
}
console.log(`etiquetados ${escritos} · declarados sin punto a propósito ${declaradosSinPunto}`);
