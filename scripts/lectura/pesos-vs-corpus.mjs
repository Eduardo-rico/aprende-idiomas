// scripts/lectura/pesos-vs-corpus.mjs
//
// ¿EL REPARTO DE ÍTEMS REFLEJA LO QUE EL ALUMNO LEE, O LO QUE EL MANUAL
// ASUME QUE LEERÁ?
//
// Sale de un hallazgo del léxico: los falsos regalos que los manuales
// catalogan son los del latín CLÁSICO, porque esos manuales están
// escritos para leer a César — y este curso entra por Jerónimo. `hostis`
// sale 194 veces en el corpus y CERO en la Vulgata.
//
// Si eso pasa con las palabras, pasa con la GRAMÁTICA: cuánto pesa el
// ablativo absoluto, cuánto la oratio obliqua, cuánto el subjuntivo. Todo
// eso es prosa ciceroniana, y el reparto de ítems puede estar heredando
// las prioridades de otro lector.
//
// ── LA PRECAUCIÓN, QUE VA ANTES QUE EL NÚMERO ─────────────────────────
//
// **La frecuencia manda sobre la sorpresa, no sobre la importancia.** Una
// construcción rara que el alumno NO PUEDE SALTARSE cuando aparece —un
// ablativo absoluto en mitad de una frase de la Vulgata— merece su punto
// aunque salga poco: lo que la frecuencia decide es CUÁNTOS ÍTEMS, no si
// el punto existe. Esto mide; decidir es aparte, punto por punto, y con
// el número escrito al lado del peso.
//
//   npx tsx scripts/lectura/pesos-vs-corpus.mjs
import fs from 'fs';

const D = 'scripts/.cache/treebanks';
if (!fs.existsSync(D)) { console.error(`no está la caché en ${D}`); process.exit(1); }

/** Cada rasgo con el punto del inventario al que toca. */
const RASGOS = [
  ['Case=Nom', 'nominativo', 'l3-nominativo'],
  ['Case=Acc', 'acusativo', 'l3-acusativo-od'],
  ['Case=Gen', 'genitivo', 'l3-genitivo-posesivo'],
  ['Case=Dat', 'dativo', 'l3-dativo-verbos'],
  ['Case=Abl', 'ablativo', 'l3-ablativo'],
  ['Case=Voc', 'vocativo', 'l2-segunda'],
  ['Mood=Sub', 'subjuntivo', 'bloque 7'],
  ['Mood=Imp', 'imperativo', 'l5-imperativo'],
  ['Tense=Fut', 'futuro', 'l5-futuro-dos-formas'],
  ['Tense=Pqp', 'pluscuamperfecto', 'l6-perfectum'],
  ['VerbForm=Part', 'participio', 'bloque 8'],
  ['VerbForm=Inf', 'infinitivo', 'bloque 8'],
  ['VerbForm=Gdv', 'gerundivo', 'bloque 8'],
  ['VerbForm=Ger', 'gerundio', 'bloque 8'],
  ['Voice=Pass', 'pasiva', 'l6-pasiva'],
  ['Degree=Cmp', 'comparativo', 'l4-grados'],
  ['Degree=Sup', 'superlativo', 'l4-grados'],
];

const corpusDe = (src) => /Vulgate/i.test(src) ? 'vulgata'
  : /belli Gallici|Caes/i.test(src) ? 'cesar'
  : /Cic|Epistulae/i.test(src) ? 'ciceron'
  : src ? 'otros' : 'perseus';

const tokens = {}, cuenta = {}, sintaxis = {};
for (const f of fs.readdirSync(D).filter((x) => x.startsWith('la_') && x.endsWith('.conllu')))
  for (const bloque of fs.readFileSync(`${D}/${f}`, 'utf8').split('\n\n')) {
    const lineas = bloque.split('\n');
    const c = corpusDe(lineas.find((l) => l.startsWith('# source = '))?.slice(11) ?? '');
    const filas = lineas.filter((l) => l && l[0] !== '#').map((l) => l.split('\t'))
      .filter((t) => t.length > 7 && /^\d+$/.test(t[0]));
    tokens[c] = (tokens[c] ?? 0) + filas.length;
    for (const t of filas) {
      const feats = t[5] === '_' ? [] : t[5].split('|');
      for (const kv of feats) { (cuenta[c] ??= {})[kv] = ((cuenta[c] ?? {})[kv] ?? 0) + 1; }
    }
    // ── Dos construcciones que no son un rasgo sino una configuración ──
    const porId = new Map(filas.map((t) => [t[0], t]));
    for (const t of filas) {
      const feats = t[5];
      // Ablativo absoluto: participio en ablativo, colgado como `advcl`,
      // con un sujeto también en ablativo.
      if (/VerbForm=Part/.test(feats) && /Case=Abl/.test(feats) && t[7] === 'advcl') {
        const tieneSujAbl = filas.some((x) => x[6] === t[0] && x[7] === 'nsubj' && /Case=Abl/.test(x[5]));
        if (tieneSujAbl) (sintaxis[c] ??= {}).ablativoAbsoluto = ((sintaxis[c] ?? {}).ablativoAbsoluto ?? 0) + 1;
      }
      // Acusativo con infinitivo: un infinitivo con sujeto en acusativo.
      if (/VerbForm=Inf/.test(feats)) {
        const sujAcc = filas.some((x) => x[6] === t[0] && x[7] === 'nsubj' && /Case=Acc/.test(x[5]));
        if (sujAcc) (sintaxis[c] ??= {}).acusativoConInfinitivo = ((sintaxis[c] ?? {}).acusativoConInfinitivo ?? 0) + 1;
      }
    }
    void porId;
  }

const CORPUS = ['vulgata', 'cesar', 'ciceron'];
const por10k = (c, n) => (10000 * n / (tokens[c] || 1));
console.log('tokens por corpus: ' + CORPUS.map((c) => `${c} ${(tokens[c] ?? 0).toLocaleString('es')}`).join(' · '));
console.log('\nRASGO POR CADA 10.000 TOKENS · «×» = cuántas veces más frecuente en César+Cicerón que en la Vulgata\n');
console.log('  rasgo               punto                  Vulgata   César  Cicerón     ×');
const filas = [];
for (const [kv, nombre, punto] of RASGOS) {
  const v = por10k('vulgata', (cuenta.vulgata ?? {})[kv] ?? 0);
  const ce = por10k('cesar', (cuenta.cesar ?? {})[kv] ?? 0);
  const ci = por10k('ciceron', (cuenta.ciceron ?? {})[kv] ?? 0);
  const clasico = (ce + ci) / 2;
  filas.push([nombre, punto, v, ce, ci, v > 0 ? clasico / v : Infinity]);
}
for (const [nombre, punto, v, ce, ci, r] of filas.sort((a, b) => b[5] - a[5]))
  console.log(`  ${nombre.padEnd(20)}${punto.padEnd(22)}${v.toFixed(1).padStart(7)}${ce.toFixed(1).padStart(8)}${ci.toFixed(1).padStart(9)}${(r === Infinity ? '∞' : r.toFixed(1)).padStart(6)}`);

console.log('\nCONSTRUCCIONES (no son un rasgo, son una configuración):\n');
console.log('  construcción              Vulgata   César  Cicerón     ×');
for (const k of ['ablativoAbsoluto', 'acusativoConInfinitivo']) {
  const v = por10k('vulgata', (sintaxis.vulgata ?? {})[k] ?? 0);
  const ce = por10k('cesar', (sintaxis.cesar ?? {})[k] ?? 0);
  const ci = por10k('ciceron', (sintaxis.ciceron ?? {})[k] ?? 0);
  const r = v > 0 ? ((ce + ci) / 2) / v : Infinity;
  console.log(`  ${k.padEnd(26)}${v.toFixed(1).padStart(6)}${ce.toFixed(1).padStart(8)}${ci.toFixed(1).padStart(9)}${(r === Infinity ? '∞' : r.toFixed(1)).padStart(6)}`);
}
console.log('\nRecordatorio: esto mide SORPRESA, no importancia. Un rasgo raro que no se');
console.log('puede saltar cuando aparece merece su punto; lo que decide es cuántos ítems.');
