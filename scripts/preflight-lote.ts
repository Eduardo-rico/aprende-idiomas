// scripts/preflight-lote.ts
//
//   npx tsx scripts/preflight-lote.ts <doc.md>
//
// EL PREFLIGHT OBLIGATORIO DE UN LOTE DE JUICIOS.
//
// El fallo de E2#11 no fue de juicio sino de PROCESO: se repitió una
// cicatriz que ya estaba escrita (recall→acierto), se calcularon a mano
// tres cifras anti-atajo y las tres salieron mal, y **no se corrió el
// gate de virginidad**, que es obligatorio por contrato — corrido
// después por un revisor, resultó que un ítem del lote era el *repair*
// textual de uno ya publicado.
//
// Un procedimiento que depende de recordar falla. Esto lo vuelve
// ejecutable: corre los gates, calcula la batería de atajos EN CÓDIGO, y
// sale con código 1 si algo bloquea. **Su salida se pega en el documento
// del lote antes de abrir el round.**
import fs from 'node:fs';
import path from 'node:path';
import { indexarCorpus, buscarDuplicados, UMBRAL, type ExIndexable } from './lib/virginidad';
import { bateria, pValor, SOSPECHOSO, RASGOS, type ItemJuicio } from './lib/atajos';
import crypto from 'node:crypto';

const DOC = process.argv[2];
if (!DOC) { console.error('uso: preflight-lote.ts <doc.md>'); process.exit(2); }
const txt = fs.readFileSync(DOC, 'utf8');

interface Item extends ItemJuicio { repair?: string; explicacion: string }
const items: Item[] = [];
for (const sec of txt.split(/\n### /).slice(1)) {
  const cab = sec.split('\n')[0]!;
  const m = cab.match(/^GJ-(\d+)\s+·\s+\*\*(MAL|BIEN)\*\*/);
  if (!m) continue;
  const campo = (etq: string) => (sec.match(new RegExp(`\\*\\*${etq}:\\*\\*\\s*«([\\s\\S]*?)»`))?.[1] ?? '').replace(/\s+/g, ' ').trim();
  items.push({
    id: `GJ-${m[1]}`,
    verdict: m[2] === 'BIEN',
    sentence: campo('sentence'),
    repair: campo('repair') || undefined,
    explicacion: (sec.match(/\*\*explicación:\*\*\s*([\s\S]*?)(?=\n\n|\n### |$)/)?.[1] ?? '').replace(/\s+/g, ' ').trim(),
  });
}

const bloqueantes: string[] = [];
const avisos: string[] = [];
// La salida se pega en el documento, así que tiene que decir CONTRA QUÉ
// batería se corrió: en E2#12 se añadió un rasgo mientras un revisor
// auditaba, y la salida pegada caducó sin que nada lo indicara.
const revBateria = crypto.createHash('sha256')
  .update(fs.readFileSync(path.join(process.cwd(), 'scripts/lib/atajos.ts'), 'utf8'))
  .digest('hex').slice(0, 8);
console.log(`# Preflight — ${path.basename(DOC)}\n`);
console.log(`Batería de atajos: **${RASGOS.length} rasgos**, rev \`${revBateria}\`. Si esta rev no es la del repo, la salida está caducada.\n`);
console.log(`Ítems: **${items.length}** · BIEN ${items.filter((x) => x.verdict).length} · MAL ${items.filter((x) => !x.verdict).length}\n`);

// ── 1 · Higiene ──────────────────────────────────────────────────────
for (const x of items) {
  if (!x.sentence) bloqueantes.push(`${x.id}: sin sentence`);
  if (!x.verdict && !x.repair) bloqueantes.push(`${x.id}: un MAL sin repair`);
  if (x.verdict && x.repair) bloqueantes.push(`${x.id}: un BIEN con repair`);
  if (!x.explicacion) bloqueantes.push(`${x.id}: sin explicación`);
}

// ── 2 · El molde ─────────────────────────────────────────────────────
const patron = items.map((x) => (x.verdict ? 'B' : 'M')).join('');
const nB = items.filter((x) => x.verdict).length;
const desequilibrio = Math.abs(nB - (items.length - nB));
let rachaMax = 1, racha = 1;
for (let i = 1; i < patron.length; i++) { racha = patron[i] === patron[i - 1] ? racha + 1 : 1; rachaMax = Math.max(rachaMax, racha); }
console.log(`## Molde\n`);
console.log(`Patrón: \`${patron}\` · prefijo de 4: \`${patron.slice(0, 4)}\` · racha máxima: ${rachaMax} · desequilibrio: ${desequilibrio}\n`);
if (desequilibrio > 2) bloqueantes.push(`molde: ${nB} BIEN contra ${items.length - nB} MAL, desequilibrio ${desequilibrio}`);
if (rachaMax > 3) bloqueantes.push(`molde: racha de ${rachaMax} iguales seguidos`);

// ── 3 · LA BATERÍA DE ATAJOS, en código ──────────────────────────────
console.log(`## Atajos — acierto SOBRE N (${items.length}), nunca recall sobre los MAL\n`);
console.log('| rasgo | acierto | dirección | presente en | p |');
console.log('|---|---:|---|---:|---:|');
for (const a of bateria(items)) {
  const p = pValor(a.aciertos, a.n);
  const marca = p < SOSPECHOSO ? ' ⚠' : '';
  console.log(`| ${a.nombre}${marca} | **${a.aciertos}/${a.n}** (${Math.round(a.acierto * 100)} %) | ${a.direccion} | ${a.presentes} | ${p.toFixed(3)} |`);
  if (p < SOSPECHOSO) bloqueantes.push(`atajo «${a.nombre}»: acierta ${a.aciertos}/${a.n} (p=${p.toFixed(3)}) — se resuelve el lote sin saber portugués`);
}

// ── 4 · Virginidad, contra el corpus Y contra sí mismo ───────────────
const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: ExIndexable[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex as ExIndexable);

const candidatos: ExIndexable[] = items.map((x) => ({
  id: x.id, type: 'grammaticality_judgment', blockId: 11, concepts: [],
  data: { sentence: x.sentence, repair: x.repair ?? '' },
}) as ExIndexable);

/** El NÚCLEO de la frase: su oración más larga entre comas. Se sonda
 *  aparte porque envolver una frase publicada en una subordinada delante
 *  y una coleta detrás DILUYE el solape IDF y ciega el gate — medido en
 *  el lote 10 v2, donde un ítem era `b2c2-gj-l1-02` con adorno y pasaba
 *  desapercibido, mientras su núcleo puntúa 0,617. El arreglo de la v1
 *  había desactivado el gate que cazó el fallo de la v1. */
const nucleo = (s: string) => s.split(/[,;]/).map((t) => t.trim()).sort((a, b) => b.length - a.length)[0] ?? s;
const nucleos: ExIndexable[] = items
  .filter((x) => nucleo(x.sentence) !== x.sentence.trim().replace(/[.!?]$/, ''))
  .map((x) => ({
    id: `${x.id}·núcleo`, type: 'grammaticality_judgment', blockId: 11, concepts: [],
    data: { sentence: nucleo(x.sentence), repair: x.repair ? nucleo(x.repair) : '' },
  }) as ExIndexable);

// El lote se compara TAMBIÉN consigo mismo: la cicatriz de E2#7.
const idx = indexarCorpus([...corpus, ...candidatos, ...nucleos]);
console.log(`\n## Virginidad — ${candidatos.length} candidatos (+${nucleos.length} sondas de núcleo) contra ${corpus.length} publicados + entre sí (umbral ${UMBRAL})\n`);
let pares = 0, artefactos = 0;
const vistos = new Set<string>();
for (const c of [...candidatos, ...nucleos]) {
  for (const h of buscarDuplicados(idx, c)) {
    if (h.id === c.id) continue;
    // un candidato contra su propio núcleo no es un hallazgo
    if (h.id.replace('·núcleo', '') === c.id.replace('·núcleo', '')) continue;
    const clave = [c.id, h.id].sort().join('|');
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    if (h.pocosTokens) { artefactos++; continue; }
    pares++;
    console.log(`- \`${c.id}\` ↔ \`${h.id}\` — ${h.score} · comparten: ${h.compartidos.slice(0, 6).join(', ')}`);
    console.log(`  > ${h.texto.slice(0, 110)}`);
    if (h.score >= 0.5) bloqueantes.push(`virginidad: ${c.id} ↔ ${h.id} a ${h.score} — hay que mirarlo antes del round`);
    else avisos.push(`virginidad: ${c.id} ↔ ${h.id} a ${h.score}`);
  }
}
if (!pares) console.log('Sin pares fiables por encima del umbral.');
console.log(`\n**${pares} pares fiables** + ${artefactos} contra ítems de texto ínfimo (score no fiable).`);

// ── 5 · El repair no puede ser una frase ya publicada ────────────────
// Es lo que el revisor encontró a mano en E2#11: un ítem del lote era el
// *repair* textual de uno publicado. Aquí se comprueba por igualdad
// normalizada, que es barato y no admite discusión.
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
const publicadas = new Map<string, string>();
for (const ex of corpus) {
  const d = ex.data as { sentence?: string; repair?: string };
  for (const s of [d?.sentence, d?.repair]) if (typeof s === 'string' && s.length > 12) publicadas.set(norm(s), ex.id);
}
console.log(`\n## Frases idénticas a algo publicado\n`);
let idem = 0;
for (const x of items) {
  for (const [etq, s] of [['sentence', x.sentence], ['repair', x.repair]] as [string, string | undefined][]) {
    if (!s) continue;
    const donde = publicadas.get(norm(s));
    if (!donde) continue;
    idem++;
    console.log(`- \`${x.id}\` [${etq}] es literalmente \`${donde}\``);
    bloqueantes.push(`${x.id}: su ${etq} ya está publicado como ${donde}`);
  }
}
if (!idem) console.log('Ninguna.');

// ── Veredicto ────────────────────────────────────────────────────────
console.log(`\n## Veredicto\n`);
if (avisos.length) { console.log(`Avisos (${avisos.length}), no bloquean:`); for (const a of avisos) console.log(`- ${a}`); console.log(''); }
if (bloqueantes.length) {
  console.log(`**${bloqueantes.length} BLOQUEANTES — el round NO se abre:**`);
  for (const b of bloqueantes) console.log(`- ${b}`);
  process.exit(1);
}
console.log('**Preflight limpio.** El round puede abrirse con esta salida pegada en el documento.');
