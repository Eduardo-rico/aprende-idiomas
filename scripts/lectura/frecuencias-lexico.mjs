// scripts/lectura/frecuencias-lexico.mjs
//
// Frecuencias de lema sobre los treebanks, CON SU AMBIGÜEDAD DECLARADA.
//
// Nace de un aviso del rumano —«las comprobaciones de corpus salieron
// verdes por homografía»— y de encontrar el caso el mismo día: conté
// `liber` 124 y son DOS palabras. Repartido por categoría:
//
//     liber · NOUN   82     (liber, «libro»)
//     liber · ADJ    42     (līber, «libre»)
//
// Y ni siquiera la categoría basta: `NOUN liber` (9 veces) es el
// nominativo de «libro», cuyos oblicuos hacen `libr-`, mientras que
// `ADJ liberi` (5) es «līberī», que como sustantivo significa «los
// hijos». Sin mácrons, tres palabras comparten grafía y ninguna columna
// del corpus las separa sola.
//
// Así que este script NO devuelve un número para esos casos: los marca
// `ambiguo` con su reparto, y quien quiera citarlos tiene que decir cómo
// los desambiguó. Un número plausible es peor que ninguno.
//
//   npx tsx scripts/lectura/frecuencias-lexico.mjs
import fs from 'fs';

const D = 'scripts/.cache/treebanks';
if (!fs.existsSync(D)) { console.error(`no está la caché en ${D}`); process.exit(1); }

const norm = (s) => s.toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
const porLemaUpos = new Map();
const formasDe = new Map();
const enVulgata = new Map();
let tokens = 0;
let tokensVulgata = 0;

// La cuenta se parte por corpus a propósito. Un falso regalo se gana su
// plaza por lo que el alumno SE VA A ENCONTRAR, no por lo que es verdad
// en el latín en abstracto — y la lectura declarada de L1 es la Vulgata.
// Medido: `hostis` sale 194 veces en el corpus entero y CERO en la
// Vulgata; `fortuna` 64 y cero; `sententia` 62 y dos.
for (const f of fs.readdirSync(D).filter((x) => x.startsWith('la_') && x.endsWith('.conllu')))
  for (const bloque of fs.readFileSync(`${D}/${f}`, 'utf8').split('\n\n')) {
    const lineas = bloque.split('\n');
    const src = lineas.find((l) => l.startsWith('# source = '))?.slice(11) ?? '';
    const esVulgata = /Vulgate/i.test(src);
    for (const l of lineas) {
    if (!l || l[0] === '#') continue;
    const t = l.split('\t');
    if (t.length < 6 || !/^\d+$/.test(t[0])) continue;
    tokens++;
    if (esVulgata) { tokensVulgata++; const k0 = norm(t[2]); enVulgata.set(k0, (enVulgata.get(k0) ?? 0) + 1); }
    const lema = norm(t[2]), upos = t[3];
    const k = `${lema}\t${upos}`;
    porLemaUpos.set(k, (porLemaUpos.get(k) ?? 0) + 1);
    if (!formasDe.has(lema)) formasDe.set(lema, new Map());
    const m = formasDe.get(lema);
    const fk = `${upos} ${norm(t[1])}`;
    m.set(fk, (m.get(fk) ?? 0) + 1);
    }
  }

const lemas = {};
for (const [k, n] of porLemaUpos) {
  const [lema, upos] = k.split('\t');
  (lemas[lema] ??= { total: 0, porCategoria: {} });
  lemas[lema].total += n;
  lemas[lema].porCategoria[upos] = n;
  lemas[lema].vulgata = enVulgata.get(lema) ?? 0;
}
// ── QUÉ CUENTA COMO HOMOGRAFÍA Y QUÉ NO ───────────────────────────────
//
// La primera versión marcaba cualquier lema con más de una categoría: 594
// de 9.898, y casi todos eran variación de ANOTACIÓN y no palabras
// distintas — `et` CCONJ/ADV, `sum` AUX/VERB, `qui` PRON/DET son la misma
// palabra etiquetada de dos maneras. Un gate que marca 594 casos de los
// que casi ninguno importa no lo lee nadie a la tercera semana.
//
// Lo que sí es homografía es que el lema cruce CLASES LÉXICAS: nombre
// contra adjetivo (`liber`/`līber`), nombre contra verbo. Dentro de una
// clase, la diferencia es del anotador.
const CLASE = (u) => (u === 'NOUN' || u === 'PROPN' ? 'nombre'
  : u === 'ADJ' ? 'adjetivo'
  : u === 'VERB' || u === 'AUX' ? 'verbo'
  : 'gramatical');

let ambiguos = 0;
for (const [lema, v] of Object.entries(lemas)) {
  const cats = Object.keys(v.porCategoria);
  // Y no basta con que aparezcan dos clases: hace falta que la segunda sea
  // SUSTANCIAL. A `et` lo marcaba UN token etiquetado ADJ entre 11.407, y
  // a `magnus` trece ADV entre 770. Un valor atípico no puede voltear un
  // veredicto, así que la clase minoritaria tiene que llegar al 5 % y a 3
  // tokens: `liber` es 42 de 124 (34 %) y se queda; el ruido se va.
  const porClase = {};
  for (const [u, n] of Object.entries(v.porCategoria)) porClase[CLASE(u)] = (porClase[CLASE(u)] ?? 0) + n;
  const clases = Object.entries(porClase)
    .filter(([, n]) => n >= 3 && n / v.total >= 0.05)
    .map(([c]) => c);
  if (clases.length > 1) {
    v.ambiguo = `el lema cruza ${clases.length} clases léxicas (${clases.join(', ')}; etiquetas: ${cats.join(', ')}): la cuenta NO es de una sola palabra`;
    v.formas = Object.fromEntries([...formasDe.get(lema)].sort((a, b) => b[1] - a[1]).slice(0, 8));
    ambiguos++;
  }
}

// Sólo los lemas citables: por debajo de 20 ocurrencias en 227.301 tokens
// no se puede afirmar nada sobre el nivel 1, y guardar 9.898 entradas para
// citar veinte es peso muerto en el repositorio.
const MIN = 20;
const citables = Object.fromEntries(Object.entries(lemas).filter(([, v]) => v.total >= MIN));
fs.writeFileSync('lib/data/languages/la/frecuencias-la.json',
  JSON.stringify({ tokens, tokensVulgata, minimo: MIN, generado: new Date().toISOString().slice(0, 10), lemas: citables }, null, 0) + '\n');
console.log(`${tokens.toLocaleString('es')} tokens · ${Object.keys(lemas).length.toLocaleString('es')} lemas · ${Object.keys(citables).length.toLocaleString('es')} con ≥${MIN} ocurrencias`);
console.log(`  de ellos, ${tokensVulgata.toLocaleString('es')} tokens son Vulgata (la lectura declarada de L1)`);
console.log(`  marcados HOMÓGRAFOS (cruzan clase léxica): ${ambiguos.toLocaleString('es')} (${(100 * ambiguos / Object.keys(lemas).length).toFixed(1)} %)`);
const cero = Object.entries(citables).filter(([, v]) => v.vulgata === 0).length;
console.log(`  citables que NO aparecen NI UNA VEZ en la Vulgata: ${cero} de ${Object.keys(citables).length}`);
const ej = Object.entries(lemas).filter(([, v]) => v.ambiguo).sort((a, b) => b[1].total - a[1].total).slice(0, 6);
for (const [l, v] of ej) console.log(`    ${l.padEnd(12)} ${String(v.total).padStart(4)}  ${Object.entries(v.porCategoria).map(([c, n]) => `${c} ${n}`).join(' · ')}`);
