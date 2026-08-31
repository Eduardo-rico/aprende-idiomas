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
import { evaluarMolde, patronDe, patronesPublicados } from './lib/pares-minimos';
import crypto from 'node:crypto';

const DOC = process.argv[2];
if (!DOC) { console.error('uso: preflight-lote.ts <doc.md>'); process.exit(2); }
const txt = fs.readFileSync(DOC, 'utf8');

interface Item extends ItemJuicio { repair?: string; explicacion: string; par?: string }
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
    // Los lotes hechos con `pares-minimos.ts` declaran a qué par mínimo
    // pertenece cada ítem. Los dos miembros de un par SON casi la misma
    // frase por diseño, así que no se comparan entre sí — pero sí, cada
    // uno por su cuenta, contra todo el corpus publicado.
    par: (sec.match(/\*\*par:\*\*\s*`?([\w-]+)`?/)?.[1] ?? undefined),
    // El rasgo 12 no se calcula: se DECLARA, con la glosa escrita al lado.
    glosaEsCorrecta: /\*\*glosa-es:\*\*[\s\S]*?·\s*español\s+CORRECTO/i.test(sec)
      ? true
      : /\*\*glosa-es:\*\*[\s\S]*?·\s*español\s+INCORRECTO/i.test(sec)
        ? false
        : undefined,
    explicacion: (sec.match(/\*\*explicación:\*\*\s*([\s\S]*?)(?=\n\n|\n### |$)/)?.[1] ?? '').replace(/\s+/g, ' ').trim(),
  });
}

// El corpus publicado se carga arriba porque lo necesitan DOS gates: el
// del molde (para los patrones de los lotes previos) y el de virginidad.
const DIR_BLOQUES = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: ExIndexable[] = [];
for (const f of fs.readdirSync(DIR_BLOQUES).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR_BLOQUES, f), 'utf8'))) corpus.push(ex as ExIndexable);

const bloqueantes: string[] = [];
const avisos: string[] = [];
// La salida se pega en el documento, así que tiene que decir CONTRA QUÉ
// batería se corrió: en E2#12 se añadió un rasgo mientras un revisor
// auditaba, y la salida pegada caducó sin que nada lo indicara.
// El sello cubre los TRES ficheros que deciden la salida, no sólo la
// batería: en E2#13 un revisor cazó que `preflight-lote.ts` había
// cambiado después de pegarse la salida y el sello seguía dando luz
// verde, con la sección de molde ya caducada.
const revBateria = crypto.createHash('sha256')
  .update([
    'scripts/lib/atajos.ts',
    'scripts/lib/pares-minimos.ts',
    'scripts/preflight-lote.ts',
  ].map((f) => fs.readFileSync(path.join(process.cwd(), f), 'utf8')).join('\u0000'))
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
  if (x.glosaEsCorrecta === undefined)
    bloqueantes.push(`${x.id}: sin **glosa-es:** — el rasgo de la glosa cognada no se puede medir, y sin medirlo la batería miente por omisión`);
}

// ── 2 · El molde ─────────────────────────────────────────────────────
//
// El criterio del «prefijo de CUATRO no visto» SE AGOTA: 16 prefijos, uno
// por lote, y de los cinco que quedaban tres violan la regla de rachas.
// Lo sustituye `evaluarMolde`, que no enumera sino que mide — equilibrio,
// rachas, y solape con CADA lote publicado cerca del azar, contra el
// patrón y contra su complementario. Espacio 2^N en vez de 16 casillas.
const patron = patronDe(items);
const nB = items.filter((x) => x.verdict).length;
let rachaMax = 1, racha = 1;
for (let i = 1; i < patron.length; i++) { racha = patron[i] === patron[i - 1] ? racha + 1 : 1; rachaMax = Math.max(rachaMax, racha); }
const previos = patronesPublicados(corpus as { id: string; type: string; data: unknown }[]);
console.log(`## Molde\n`);
console.log(`Patrón: \`${patron}\` · racha máxima: ${rachaMax} · desequilibrio: ${Math.abs(nB - (items.length - nB))}\n`);
console.log(`Solape con los ${previos.size} lotes publicados (el objetivo es el AZAR, no el mínimo — la casi-complementaria es un calco igual que la copia):\n`);
console.log('| lote | patrón | solape | azar | desvío | tope |');
console.log('|---|---|---:|---:|---:|---:|');
for (const [lote, q] of [...previos].sort((a, b) => a[0].localeCompare(b[0]))) {
  const L = Math.min(patron.length, q.length);
  if (L < 8) continue;
  let ig = 0;
  for (let i = 0; i < L; i++) if (patron[i] === q[i]) ig++;
  console.log(`| ${lote} | \`${q.slice(0, L)}\` | ${ig}/${L} | ${(L / 2).toFixed(1)} | ${Math.abs(ig - L / 2).toFixed(1)} | ${Math.floor(Math.sqrt(L))} |`);
}
console.log('');
bloqueantes.push(...evaluarMolde(patron, [...previos.values()]));

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

// Y TAMBIÉN contra los <Example> de las LECCIONES. El gate abría un solo
// directorio, `blocks/`, y nunca `mdx/`: en el lote 10 v3 cuatro de las
// ocho frases de una sección eran <Example> literales de la lección que
// ese mismo lote sirve, con una coleta pegada detrás, y las cuatro eran
// BIEN — 10/14 de acierto, por encima de los once rasgos medidos. Es el
// mismo mecanismo que la coleta que diluía el IDF, un piso más abajo:
// aquí no es que el solape se diluya, es que la fuente no estaba
// indexada.
const MDX = path.join(process.cwd(), 'lib/data/languages/pt/mdx');
const ejemplos: ExIndexable[] = [];
const recorrer = (d: string) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { recorrer(f); continue; }
    if (!e.name.endsWith('.mdx')) continue;
    const rel = path.relative(MDX, f).replace(/\.mdx$/, '');
    let i = 0;
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/<Example[^>]*\bpt="([^"]+)"/g))
      ejemplos.push({ id: `mdx:${rel}#${i++}`, type: 'grammaticality_judgment', blockId: 0, concepts: [], data: { sentence: m[1], repair: '' } } as ExIndexable);
  }
};
if (fs.existsSync(MDX)) recorrer(MDX);

// El lote se compara TAMBIÉN consigo mismo: la cicatriz de E2#7.
const idx = indexarCorpus([...corpus, ...ejemplos, ...candidatos, ...nucleos]);
console.log(`\n## Virginidad — ${candidatos.length} candidatos (+${nucleos.length} sondas de núcleo) contra ${corpus.length} publicados + ${ejemplos.length} <Example> de lecciones + entre sí (umbral ${UMBRAL})\n`);
let pares = 0, artefactos = 0;
const vistos = new Set<string>();
for (const c of [...candidatos, ...nucleos]) {
  for (const h of buscarDuplicados(idx, c)) {
    if (h.id === c.id) continue;
    // un candidato contra su propio núcleo no es un hallazgo
    if (h.id.replace('·núcleo', '') === c.id.replace('·núcleo', '')) continue;
    // los dos miembros de un PAR MÍNIMO declarado son la misma frase con
    // el rasgo juzgado volteado: comparar uno con otro no dice nada. La
    // exención es sólo entre ellos — cada uno se compara igual contra
    // todo el corpus publicado.
    const parDe = (id: string) => items.find((x) => x.id === id.replace('·núcleo', ''))?.par;
    const pa = parDe(c.id), pb = parDe(h.id);
    if (pa && pb && pa === pb) continue;
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
