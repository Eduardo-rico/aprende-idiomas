// scripts/check-fidelidad-mediacion.ts
//
//   npx tsx scripts/check-fidelidad-mediacion.ts <doc.md>
//
// Corre los cinco gates de la familia MEDIACIÓN-ÍTEM v1 sobre el
// documento de un lote, más las auditorías que sólo tienen sentido sobre
// el lote entero (reparto de la clave, longitud, proporción de FIEL).
// Sale con código 1 si algo cae: es un gate, no un informe.
import fs from 'node:fs';
import path from 'node:path';
import { auditarLote, validarItem, type ItemFidelidad, type Transformacion } from './lib/fidelidad-mediacion';
import { indexarCorpus, buscarDuplicados, UMBRAL, type ExIndexable } from './lib/virginidad';

const DOC = process.argv[2];
if (!DOC) { console.error('uso: check-fidelidad-mediacion.ts <doc.md>'); process.exit(2); }
const txt = fs.readFileSync(DOC, 'utf8');

const cita = (sec: string, etq: string): string => {
  const m = sec.match(new RegExp(`\\*\\*${etq}[^\\n]*\\n((?:>[^\\n]*\\n?)+)`));
  if (!m) return '';
  return m[1]!.split('\n').filter((l) => l.startsWith('>')).map((l) => l.replace(/^>\s?/, '')).join(' ')
    .replace(/\s+/g, ' ').replace(/^«|»$/g, '').trim();
};

const items: ItemFidelidad[] = [];
for (const sec of txt.split(/\n### /).slice(1)) {
  const cab = sec.split('\n')[0]!;
  const m = cab.match(/^MFID-(\d+)\s+·\s+([\w-]+)\s+·\s+(pt→es|es→pt)\s+·\s+\*\*([A-ZÁÉÍÓÚÑ]+)\*\*/);
  if (!m) continue;
  const id = `MFID-${m[1]}`;

  const fiel = cita(sec, 'recado fiel');
  const mostradoRaw = cita(sec, 'recado mostrado');
  // «*(idéntico al fiel)*» es la forma corta de los ítems de control.
  const mostrado = /idéntico al fiel/i.test(sec.match(/\*\*recado mostrado:\*\*[^\n]*/)?.[0] ?? '') || !mostradoRaw
    ? fiel : mostradoRaw;

  const datos = (sec.match(/\*\*datos:\*\*\s*([^\n]+)/)?.[1] ?? '').split('·').map((x) => x.trim()).filter(Boolean);

  const lineaOpc = sec.match(/\*\*opciones:\*\*\s*([^\n]+)/)?.[1] ?? '';
  const opciones: string[] = []; let correctIndex = -1;
  for (const trozo of lineaOpc.split(' · ')) {
    const om = trozo.match(/\[(\d)\]\s*(.+)$/);
    if (!om) continue;
    const i = Number(om[1]);
    let etiqueta = om[2]!.trim();
    if (/✅/.test(etiqueta)) correctIndex = i;
    etiqueta = etiqueta.replace(/✅/g, '').replace(/\*\*/g, '').trim();
    opciones[i] = etiqueta;
  }

  items.push({
    id, fuente: cita(sec, 'fuente'), datos, fiel, mostrado,
    transformacion: m[4] as Transformacion, opciones, correctIndex,
  });
}

console.log(`ítems parseados: ${items.length}\n`);
let fallos = 0;
for (const x of items) {
  const r = validarItem(x);
  if (!r.fallos.length) {
    const t = x.transformacion === 'FIEL' ? '(sin cambio)' : `«${r.tramo.quitado || '∅'}» → «${r.tramo.puesto || '∅'}»`;
    console.log(`  ✔ ${x.id}  ${x.transformacion.padEnd(13)} clave [${x.correctIndex}]  ${t}`);
  } else {
    fallos += r.fallos.length;
    console.log(`  ✗ ${x.id}`);
    for (const f of r.fallos) console.log(`      ${f}`);
  }
}

// ── Gate 6 · VIRGINIDAD DE LAS FUENTES ───────────────────────────────
// El gate compartido (`check-virginidad`) indexa de un `multiple_choice`
// SÓLO `options`, y excluye `question` a propósito: en los 37 ítems
// anteriores ese campo es una glosa española y meterlo dispararía falsos
// positivos en cadena. Pero esta familia mete el AVISO PORTUGUÉS dentro
// de `question`, así que para ella aquel gate devuelve 0 pares sin haber
// mirado nada — un cero que no prueba nada, que es exactamente la
// cicatriz que costó dos mediaciones clonadas en E2#7.
//
// Por eso la familia comprueba sus propias fuentes aquí: cada `fuente`
// se envuelve como pseudo-mediación (los campos que el índice sí lee) y
// se compara contra el corpus entero Y contra las otras 23 del lote —
// intra-lote incluido, que es la segunda mitad de aquella cicatriz.
const comoMediacion = (id: string, fuente: string, fiel: string): ExIndexable =>
  ({ id, type: 'mediation', blockId: 10, concepts: ['b10-fidelidad-relay'], data: { sourceText: fuente, modelAnswer: fiel } }) as ExIndexable;

const DIRB = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: ExIndexable[] = [];
for (const f of fs.readdirSync(DIRB).filter((x) => /^b\d+\.json$/.test(x)).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(DIRB, f), 'utf8'));
  for (const ex of (Array.isArray(d) ? d : d.exercises)) corpus.push(ex as ExIndexable);
}
const pseudo = items.map((x) => comoMediacion(x.id, x.fuente, x.fiel));
const idx = indexarCorpus([...corpus, ...pseudo]);
console.log(`\n── gate 6 · virginidad de las ${items.length} fuentes (corpus ${corpus.length} + intra-lote, umbral ${UMBRAL}) ──`);
let hallazgos = 0;
for (const p of pseudo) {
  for (const h of buscarDuplicados(idx, p)) {
    if (h.id === p.id) continue;
    hallazgos++; fallos++;
    console.log(`  ✗ ${p.id} ↔ ${h.id} [${h.type}]  ${h.score.toFixed(3)}  comparten: ${h.compartidos.slice(0, 8).join(', ')}`);
    console.log(`        ${h.texto.slice(0, 130)}`);
  }
}
if (!hallazgos) console.log('  ✔ ninguna fuente repite un aviso ya publicado ni a otra del lote');

const res = auditarLote(items);
console.log(`\n── auditoría del lote ──`);
console.log(`reparto de la clave por posición: ${res.porPosicion.join(' / ')} (uniforme sería ${(items.length / 4).toFixed(1)} cada una)`);
console.log(`transformaciones: ${Object.entries(res.porTransformacion).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log(`longitud media — clave ${res.longitudClave.clave} car. · distractores ${res.longitudClave.distractores} car.`);
const soloLote = res.fallos.filter((f) => f.startsWith('LOTE:'));
if (soloLote.length) { for (const f of soloLote) console.log(`  ✗ ${f}`); fallos += soloLote.length; }
else console.log('  ✔ sin atajos de posición, longitud ni proporción de FIEL');

console.log(fallos ? `\n✗ ${fallos} fallos` : '\n✔ los cinco gates limpios');
process.exit(fallos ? 1 : 0);
