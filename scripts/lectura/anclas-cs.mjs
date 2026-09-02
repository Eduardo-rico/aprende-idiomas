// Anclas de nivel del catálogo CHECO — de dónde salen los cortes de
// `medir-nivel.mjs` para `cs`.
//
// La métrica PT/RO (densidad polisilábica) no se hereda a ciegas: aquí
// se mide sobre obras cuyo nivel relativo está fijado POR CRITERIO
// ESCRITO antes de medir, y el corte sólo vale si la métrica reproduce
// ese orden.
//
// CRITERIO (fijado antes de mirar los números):
//   abajo   — pohádky de Němcová y Erben: oralidad, frase corta, léxico
//             concreto y fórmulas repetidas («byl jednou jeden král»);
//             la sátira popular de Havlíček (Král Lávra). Lo que un A2
//             alto / B1 lee con diccionario.
//   medio   — Neruda (Povídky malostranské: diálogo urbano, ironía),
//             Hálek (idilio rural), la Babička de Němcová (narración
//             larga pero llana), el humor de Svatopluk Čech; B1-B2.
//   arriba  — Zeyer (léxico arcaizante, período largo), Arbes (romaneto:
//             ciencia, filosofía), Klostermann y Mrštík (descripción
//             densa, período largo), Vrchlický en prosa: C1.
//   A MANO  — Švejk (Hašek): el léxico es coloquial y la densidad lo
//             pondrá abajo, pero es una novela de 200.000 palabras con
//             jerga militar austrohúngara y germanismos: se declara B2/C1
//             en la tanda, como RO hizo con Slavici. Mácha (Máj): poesía
//             romántica con sintaxis invertida: C1 declarado.
//
// uso: node scripts/lectura/anclas-cs.mjs      (lee de la caché de la ingesta;
//       lo que no esté en caché lo baja EN SERIE con pausa)
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { densidad } from './medir-nivel.mjs';
import { normalizarDiacriticos, gateDiacriticos, medirGrafia } from './texto-cs.mjs';

const ANCLAS = [
  ['abajo ', 'Němcová', 'Národní Báchorky a Powěsti/Sedmero krkawců'],
  ['abajo ', 'Němcová', 'Národní Báchorky a Powěsti/Princ Bajaja'],
  ['abajo ', 'Němcová', 'Národní Báchorky a Powěsti/O hloupém Honzowi'],
  ['abajo ', 'Erben', 'Zlatovláska (Erben)'],
  ['abajo ', 'Erben', 'Tři zlaté vlasy Děda-Vševěda'],
  ['abajo ', 'Erben', 'Máj (almanach 1858)/Pták Ohnivák a liška Ryška'],
  ['abajo ', 'Havlíček', 'Král Lávra'],
  ['medio ', 'Neruda', 'Povídky malostranské/Hastrman'],
  ['medio ', 'Neruda', 'Povídky malostranské/U tří lilií'],
  ['medio ', 'Neruda', 'Povídky malostranské/Přivedla žebráka na mizinu'],
  ['medio ', 'Němcová', 'Babička/I'],
  ['medio ', 'Hálek', 'Muzikantská Liduška/I'],
  ['medio ', 'Hálek', 'Na vejminku/I.'],
  ['medio ', 'Čech', 'Pravý výlet pana Broučka do měsíce/I'],
  ['arriba', 'Zeyer', 'Tři legendy o krucifixu/Inultus'],
  ['arriba', 'Arbes', 'Svatý Xaverius/2'],
  ['arriba', 'Arbes', 'Kamarád'],
  ['arriba', 'Klostermann', 'Ze světa lesních samot/III.'],
  ['arriba', 'Mrštík', 'Pohádka máje/I.'],
  ['arriba', 'Mácha', 'Pouť krkonošská'],
  ['a mano', 'Hašek', 'Osudy dobrého vojáka Švejka za světové války/Zasáhnutí dobrého vojáka Švejka do světové války'],
  ['a mano', 'Mácha', 'Máj (Mácha)/1'],
];

const HOST = 'https://cs.wikisource.org';
const CACHE = path.join(process.cwd(), 'scripts/.cache/lectura/ws-cs');
fs.mkdirSync(CACHE, { recursive: true });
const slugify = (t) => t.toLowerCase().replace(/ș/g, 's').replace(/ț/g, 't').replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.codePointAt(0)) >>> 0; return h.toString(36); }

async function html(titulo) {
  const f = path.join(CACHE, `${slugify(titulo)}-${hash(titulo)}.html`);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const u = new URL(`${HOST}/w/api.php`);
  u.search = new URLSearchParams({ action: 'parse', page: titulo, prop: 'text', disableeditsection: '1', redirects: '1', format: 'json' });
  for (let i = 0; i < 8; i++) {
    const r = await fetch(u, { headers: { 'user-agent': 'aprende-idiomas-lectura/1.0 (emrs94@gmail.com)' } });
    if (r.ok) {
      const d = await r.json();
      if (d.error) throw new Error(`${titulo}: ${d.error.info}`);
      const t = d.parse.text['*'];
      fs.writeFileSync(f, t);
      await new Promise((ok) => setTimeout(ok, 400));
      return t;
    }
    await new Promise((ok) => setTimeout(ok, Math.min(60_000, 3000 * 2 ** i)));
  }
  throw new Error(`${titulo}: 429/5xx ocho veces`);
}

function textoDe(h) {
  const dom = new JSDOM(`<body>${h}</body>`);
  const doc = dom.window.document;
  for (const sel of ['.ws-header', '.ws-noexport', '#ws-data', 'style', 'sup.reference', 'ol.references', 'table']) for (const n of doc.querySelectorAll(sel)) n.remove();
  return normalizarDiacriticos(doc.body.textContent);
}

/** Longitud media de frase, el segundo eje (plano en PT y en RO). Se
 *  mide aquí para no suponerlo también en checo. */
function fraseMedia(t) {
  const frases = t.split(/[.!?…]+[\s»”"]+/).filter((f) => /\p{L}{3}/u.test(f));
  const pal = t.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
  return pal / Math.max(1, frases.length);
}

console.log('tramo   autor        obra                                      pal   dens   d4    letr  frase  diacr  grafía');
const filas = [];
for (const [tramo, autor, obra] of ANCLAS) {
  let t;
  try { t = textoDe(await html(obra)); } catch (e) { console.log(`${tramo}  ${autor.padEnd(12)} ${obra.slice(0, 40).padEnd(40)} ✗ ${e.message}`); continue; }
  const { indice, palabras } = densidad(t, 'cs');
  const gd = gateDiacriticos(t);
  const g = medirGrafia(t);
  // Ejes candidatos: % de palabras de 4+ sílabas y letras por palabra.
  const pal4 = (t.toLowerCase().match(/[\p{L}]+/gu) ?? []).filter((p) => /[aeiouyáéíóúýěů]/.test(p));
  const d4 = 100 * pal4.filter((p) => (p.match(/[aeiouyáéíóúýěů]+/g) ?? []).length >= 4).length / Math.max(1, pal4.length);
  const letr = pal4.reduce((a, p) => a + p.length, 0) / Math.max(1, pal4.length);
  filas.push({ tramo, indice, d4, letr });
  console.log(`${tramo}  ${autor.padEnd(12)} ${obra.replace(/^[^/]+\//, '…/').slice(0, 40).padEnd(40)} ${String(palabras).padStart(6)}  ${indice.toFixed(1).padStart(5)}  ${d4.toFixed(1).padStart(4)}  ${letr.toFixed(2)}  ${fraseMedia(t).toFixed(1).padStart(5)}  ${(100 * gd.ratio).toFixed(0).padStart(3)}%  ${g.etiqueta}`);
}
const rango = (tr) => { const v = filas.filter((f) => f.tramo === tr).map((f) => f.indice); return v.length ? `${Math.min(...v).toFixed(1)}–${Math.max(...v).toFixed(1)}` : '—'; };
console.log(`\nrangos de densidad: abajo ${rango('abajo ')} · medio ${rango('medio ')} · arriba ${rango('arriba')} · a mano ${rango('a mano')}`);
