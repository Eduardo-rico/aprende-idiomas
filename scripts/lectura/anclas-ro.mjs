// Anclas de nivel del catálogo RUMANO — de dónde salen los cortes de
// `medir-nivel.mjs` para `ro`.
//
// La métrica PT (densidad polisilábica) no se hereda a ciegas: aquí se
// mide sobre obras cuyo nivel relativo está fijado POR CRITERIO ESCRITO
// antes de medir, y el corte sólo vale si la métrica reproduce ese orden.
//
// CRITERIO (fijado antes de mirar los números):
//   abajo   — basme y povești de Ispirescu y Creangă: oralidad, frase
//             corta, léxico concreto y repetitivo (fórmulas de cuento);
//             son lo que un B1 lee con diccionario.
//   medio   — schițe de Caragiale: diálogo urbano, neologismos de
//             prensa, ironía; B2.
//   arriba  — nuvele de Slavici (frase larga, psicología) y sobre todo
//             Odobescu (Pseudo-Kynegetikos: erudición, latinismos) y la
//             prosa de Eminescu (filosofía): C1.
//
// uso: node scripts/lectura/anclas-ro.mjs      (lee de la caché de la ingesta;
//       corre antes una tanda en --dry para llenarla)
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { densidad } from './medir-nivel.mjs';
import { normalizarDiacriticos, gateDiacriticos } from './texto-ro.mjs';

const ANCLAS = [
  ['abajo ', 'Ispirescu', 'Prâslea cel voinic și merele de aur'],
  ['abajo ', 'Ispirescu', 'Greuceanu'],
  ['abajo ', 'Ispirescu', 'Sarea în bucate'],
  ['abajo ', 'Creangă', 'Capra cu trei iezi'],
  ['abajo ', 'Creangă', 'Punguța cu doi bani'],
  ['abajo ', 'Creangă', 'Povestea lui Harap-Alb'],
  ['abajo ', 'Creangă', 'Amintiri din copilărie'],
  ['medio ', 'Caragiale', 'Vizită...'],
  ['medio ', 'Caragiale', 'D-l Goe'],
  ['medio ', 'Caragiale', 'Două loturi'],
  ['medio ', 'Caragiale', 'În vreme de război'],
  ['medio ', 'Caragiale', 'O scrisoare pierdută'],
  ['arriba', 'Slavici', 'Moara cu noroc'],
  ['arriba', 'Slavici', 'Pădureanca'],
  ['arriba', 'Eminescu', 'Sărmanul Dionis'],
  ['arriba', 'Odobescu', 'Pseudo-Kynegetikos'],
  ['arriba', 'Odobescu', 'Doamna Chiajna'],
  ['arriba', 'Hogaș', 'În Munții Neamțului'],
];

const HOST = 'https://ro.wikisource.org';
const CACHE = path.join(process.cwd(), 'scripts/.cache/lectura/ws-ro');
fs.mkdirSync(CACHE, { recursive: true });
const slugify = (t) => t.toLowerCase().replace(/ș/g, 's').replace(/ț/g, 't').replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.codePointAt(0)) >>> 0; return h.toString(36); }

async function html(titulo) {
  const f = path.join(CACHE, `${slugify(titulo)}-${hash(titulo)}.html`);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const u = new URL(`${HOST}/w/api.php`);
  u.search = new URLSearchParams({ action: 'parse', page: titulo, prop: 'text', disableeditsection: '1', redirects: '1', format: 'json' });
  const d = await (await fetch(u, { headers: { 'user-agent': 'aprende-idiomas-lectura/1.0' } })).json();
  const t = d.parse.text['*'];
  fs.writeFileSync(f, t);
  return t;
}

function textoDe(h) {
  const dom = new JSDOM(`<body>${h}</body>`);
  const doc = dom.window.document;
  for (const sel of ['.ws-header', '.ws-noexport', '#ws-data', 'style', 'sup.reference', 'ol.references', 'table']) for (const n of doc.querySelectorAll(sel)) n.remove();
  return normalizarDiacriticos(doc.body.textContent);
}

/** Longitud media de frase, el segundo eje que en PT resultó plano. Se
 *  mide aquí para no suponerlo también en rumano. */
function fraseMedia(t) {
  const frases = t.split(/[.!?…]+[\s»”"]+/).filter((f) => /\p{L}{3}/u.test(f));
  const pal = t.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
  return pal / Math.max(1, frases.length);
}

console.log('tramo   autor      obra                                    pal   dens   frase  diacr');
const filas = [];
for (const [tramo, autor, obra] of ANCLAS) {
  const t = textoDe(await html(obra));
  const { indice, palabras } = densidad(t, 'ro');
  const gd = gateDiacriticos(t);
  filas.push({ tramo, indice });
  console.log(`${tramo}  ${autor.padEnd(10)} ${obra.slice(0, 38).padEnd(38)} ${String(palabras).padStart(6)}  ${indice.toFixed(1).padStart(5)}  ${fraseMedia(t).toFixed(1).padStart(5)}  ${(100 * gd.ratio).toFixed(0).padStart(3)}%`);
}
const rango = (tr) => { const v = filas.filter((f) => f.tramo === tr).map((f) => f.indice); return `${Math.min(...v).toFixed(1)}–${Math.max(...v).toFixed(1)}`; };
console.log(`\nrangos de densidad: abajo ${rango('abajo ')} · medio ${rango('medio ')} · arriba ${rango('arriba')}`);
