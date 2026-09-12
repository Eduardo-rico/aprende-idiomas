// scripts/lib/dominio-antes-y-despues.ts
//
// QUÉ CIFRAS SE MOVIERON AL ARREGLAR EL ENUMERADOR DEL DOMINIO.
//
//   npx tsx scripts/lib/dominio-antes-y-despues.ts
//
// ── POR QUÉ HACE FALTA ───────────────────────────────────────────────
//
// Hasta `1db08055`, «todas las formas de L1» eran las de tres tablas:
// nombres, verbos y el LEMA de los adjetivos. Son 1.429. La máquina produce
// 2.194 desde diez tablas, así que **toda cifra calculada sobre «el
// dominio» antes de ese commit se calculó sobre el 65 % del dominio** — y
// varias están publicadas, citadas en el relevo y sosteniendo un lote.
//
// El fallo no avisa. Los porcentajes seguían siendo correctos **sobre el
// conjunto que el enumerador veía**, y el denominador encogió en silencio.
// Es la hermana de la regla duplicada y es peor: una regla mal copiada da
// resultados distintos y se puede cruzar; **un dominio incompleto da
// resultados perfectamente consistentes consigo mismos.**
//
// Este script recalcula las mismas cifras con los dos enumeradores, el
// viejo y el bueno, y saca la tabla. No arregla nada: dice qué hay que
// mirar.
import { acentoDe } from '../../lib/lang/ortografia-la';
import { acentoLatino, silabas } from '../voz/cuanto-duele';
import { formasUnicasDeL1 } from '../../lib/data/languages/la/todas-las-formas';
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { paradigmaNominal, infectum, perfectum, declinacionDe } from '../../lib/data/languages/la/paradigma-la';
import { tipoDeAcento } from './atestar-acento';

/** El enumerador VIEJO, conservado literalmente para poder comparar. No se
 *  usa para nada más y por eso vive aquí y no en `lib`. */
function dominioViejo(): string[] {
  const out = new Set<string>();
  for (const n of NOMBRES_L1) {
    try { declinacionDe(n); } catch { continue; }
    for (const f of Object.values(paradigmaNominal(n))) out.add(f);
  }
  for (const v of VERBOS_L1) {
    for (const f of Object.values(infectum(v))) out.add(f);
    for (const f of Object.values(perfectum(v))) out.add(f);
  }
  for (const a of ADJETIVOS_L1) out.add(a.lema);
  return [...out];
}

interface Fila { que: string; antes: string; despues: string; mueve: boolean }

function medir(formas: string[]) {
  const c: Record<string, number> = { macron: 0, diptongo: 0, posicion: 0, breve: 0, bisilabo: 0, monosilabo: 0 };
  for (const f of formas) c[tipoDeAcento(f).tipo]!++;
  const n = formas.length;
  const llanas = c['macron']! + c['diptongo']! + c['posicion']! + c['bisilabo']!;
  const conX = formas.filter((f) => /x/i.test(f));
  let discrepan = 0, comparadas = 0;
  for (const f of formas) {
    const a = acentoDe(f); if (a === null) continue;
    comparadas++;
    if (a !== (acentoLatino(f).acento === 'antepenultima' ? 'esdrujula' : 'llana')) discrepan++;
  }
  return { n, c, llanas, conX: conX.length, discrepan, comparadas };
}

const viejo = medir(dominioViejo());
const nuevo = medir(formasUnicasDeL1());
const pct = (a: number, b: number) => `${(100 * a / b).toFixed(1)} %`;

const filas: Fila[] = [
  { que: 'formas del dominio', antes: String(viejo.n), despues: String(nuevo.n), mueve: true },
  { que: 'suelo de «siempre la penúltima»', antes: pct(viejo.llanas, viejo.n), despues: pct(nuevo.llanas, nuevo.n), mueve: false },
  { que: 'daño del motor italiano (penúltima breve)', antes: pct(viejo.c['breve']!, viejo.n), despues: pct(nuevo.c['breve']!, nuevo.n), mueve: false },
  { que: 'penúltima larga por POSICIÓN', antes: pct(viejo.c['posicion']!, viejo.n), despues: pct(nuevo.c['posicion']!, nuevo.n), mueve: false },
  { que: 'penúltima larga por MÁCRON', antes: pct(viejo.c['macron']!, viejo.n), despues: pct(nuevo.c['macron']!, nuevo.n), mueve: false },
  { que: 'penúltima larga por DIPTONGO', antes: String(viejo.c['diptongo']!), despues: String(nuevo.c['diptongo']!), mueve: false },
  { que: 'bisílabos', antes: pct(viejo.c['bisilabo']!, viejo.n), despues: pct(nuevo.c['bisilabo']!, nuevo.n), mueve: false },
  { que: 'formas con «x»', antes: String(viejo.conX), despues: String(nuevo.conX), mueve: true },
  { que: 'discrepancias entre los dos caminos del acento', antes: `${viejo.discrepan} de ${viejo.comparadas}`, despues: `${nuevo.discrepan} de ${nuevo.comparadas}`, mueve: false },
];

console.log('\n  QUÉ SE MOVIÓ AL ARREGLAR EL ENUMERADOR\n');
console.log(`  ${'cifra'.padEnd(46)}${'antes (1.429)'.padEnd(16)}después`);
console.log(`  ${'-'.repeat(46)}${'-'.repeat(16)}${'-'.repeat(12)}`);
for (const f of filas) console.log(`  ${f.que.padEnd(46)}${f.antes.padEnd(16)}${f.despues}`);

// ── Y el invariante de la `x`, que sostuvo el cambio dīxit→dīcit ──
function tonicaDesdeFinal(w: string): number {
  const s = silabas(w);
  if (s.length <= 2) return s.length - 1;
  const t = tipoDeAcento(w);
  return s.length - 1 - s.indexOf(t.tonica);
}
let mueveX = 0;
for (const f of formasUnicasDeL1().filter((x) => /x/i.test(x)))
  if (tonicaDesdeFinal(f) !== tonicaDesdeFinal(f.normalize('NFC').replace(/x/gi, 'cs'))) mueveX++;
console.log(`\n  invariante de la «x»: el silabeo tradicional mueve el acento en ${mueveX} de ${nuevo.conX} formas`);
