// scripts/check-paradigma-ro.ts — el gate del paradigma rumano.
//
//   npx tsx scripts/check-paradigma-ro.ts             # informa
//   npx tsx scripts/check-paradigma-ro.ts --strict    # sale 1 si algo falla
//   npx tsx scripts/check-paradigma-ro.ts --tabla om  # el paradigma de un lema
//
// TRES pasos, y el denominador va escrito en cada uno:
//   1. INVARIANTES de forma de cada entrada del lexicón (`invariantesLema`):
//      «*a lucrez» como infinitivo, «*draji» como plural, vocativo marcado
//      sin registro, neutro con vocativo, cedillas.
//   2. DERIVACIÓN: todo el paradigma de cada lema; una casilla que salga
//      null donde debía haber forma es un fallo del paradigma, no del lema.
//   3. HUNSPELL: cada forma —guardada o derivada— contra el diccionario
//      ro_RO vendorizado. Es el SEGUNDO camino, independiente del primero:
//      un derivador que sólo se compara consigo mismo se da la razón.
//      Hunspell es gate léxico: lo que rechaza se LEE, no se borra
//      (rechaza doctorule, atestado en dexonline), y lo que se decide
//      dejar va en EXENCIONES con su fuente.
import { SUSTANTIVOS_A1, VERBOS_A1 } from '../lib/data/languages/ro/lexicon-a1';
import { paradigmaNominal, paradigmaVerbal, invariantesLema } from './lib/paradigma-ro';
import { hunspellDisponible, desconocidas } from './lib/hunspell-ro';
import { EXENCIONES_RO } from './lib/exenciones-hunspell-ro';

const STRICT = process.argv.includes('--strict');
const tablaDe = process.argv.includes('--tabla') ? process.argv[process.argv.indexOf('--tabla') + 1] : undefined;

/** Formas que Hunspell no tiene y que están atestadas en otra fuente. */
// Las exenciones viven en `lib/exenciones-hunspell-ro.ts`: estaban
// escritas en tres sitios y una de las copias no las tenía.
const EXENCIONES = EXENCIONES_RO;

// ── 1 · invariantes ──────────────────────────────────────────────────
const errores: string[] = [];
for (const l of [...SUSTANTIVOS_A1, ...VERBOS_A1]) errores.push(...invariantesLema(l));

// ── 2 · derivación ───────────────────────────────────────────────────
const formas: { lema: string; casilla: string; forma: string }[] = [];
const nulos: string[] = [];
for (const l of SUSTANTIVOS_A1) {
  for (const [casilla, forma] of Object.entries(paradigmaNominal(l))) {
    const esperable = !(casilla.startsWith('V') && (l.genero === 'n' || l.vocSg === undefined));
    if (forma === null) { if (esperable) nulos.push(`${l.lema} · ${casilla}`); continue; }
    formas.push({ lema: l.lema, casilla, forma });
  }
  // El diminutivo y su plural NO están en `paradigmaNominal` —son formas
  // guardadas, no casillas derivadas— pero SÍ tienen que pasar por
  // Hunspell: es el segundo camino, y un diminutivo inventado no puede
  // entrar al lexicón sólo porque alguien escribió una fuente al lado.
  if (l.dim) formas.push({ lema: l.lema, casilla: 'DIM sg', forma: l.dim });
  if (l.dimPlural) formas.push({ lema: l.lema, casilla: 'DIM pl', forma: l.dimPlural });
}
for (const v of VERBOS_A1) {
  for (const [casilla, forma] of Object.entries(paradigmaVerbal(v))) {
    if (forma === null) { nulos.push(`${v.inf} · ${casilla}`); continue; }
    for (const w of forma.split(' ')) formas.push({ lema: v.inf, casilla, forma: w });
  }
}

if (tablaDe) {
  const l = SUSTANTIVOS_A1.find((x) => x.lema === tablaDe);
  const v = VERBOS_A1.find((x) => x.inf === tablaDe || x.inf === `a ${tablaDe}`);
  const tabla = l ? paradigmaNominal(l) : v ? paradigmaVerbal(v) : null;
  if (!tabla) { console.log(`«${tablaDe}» no está en el lexicón A1`); process.exit(1); }
  for (const [k, f] of Object.entries(tabla)) console.log(`${k.padEnd(14)} ${f ?? '—'}`);
  process.exit(0);
}

// ── 3 · hunspell ─────────────────────────────────────────────────────
let rechazadas: { lema: string; casilla: string; forma: string }[] = [];
let hunspell = hunspellDisponible();
if (hunspell) {
  const malas = new Set(desconocidas(formas.map((f) => f.forma)));
  rechazadas = formas.filter((f) => malas.has(f.forma) && !EXENCIONES[f.forma]);
}

console.log('# Paradigma rumano — lexicón A1\n');
console.log(`Lexicón: ${SUSTANTIVOS_A1.length} sustantivos · ${VERBOS_A1.length} verbos. Formas derivadas o guardadas: ${formas.length}.`);
console.log(`\n1 · Invariantes: ${errores.length} errores${errores.length ? ':\n' + errores.map((e) => '  - ' + e).join('\n') : '.'}`);
console.log(`2 · Derivación: ${nulos.length} casillas sin forma${nulos.length ? ':\n' + nulos.map((e) => '  - ' + e).join('\n') : '.'}`);
if (!hunspell) console.log('3 · Hunspell: NO DISPONIBLE — el segundo camino no corrió. Esto no es verde.');
else console.log(`3 · Hunspell: ${rechazadas.length} formas rechazadas de ${formas.length} (exentas con fuente: ${Object.keys(EXENCIONES).length})${rechazadas.length ? ':\n' + rechazadas.map((r) => `  - ${r.lema} · ${r.casilla}: «${r.forma}»`).join('\n') : '.'}`);

const falla = errores.length || nulos.length || rechazadas.length || !hunspell;
if (STRICT && falla) { console.log('\n✖ --strict: el paradigma no está limpio.'); process.exit(1); }
