// Anclas de nivel del catálogo RUSO — de dónde salen los cortes de
// `medir-nivel.mjs` para `ru`.
//
// La métrica PT/RO/CS (densidad polisilábica) no se hereda a ciegas: el
// ruso es flexivo y polisilábico por morfología (terminaciones de caso,
// sufijos verbales), así que la densidad sube en TODO texto y el corte
// hay que derivarlo aquí. Se mide sobre obras cuyo nivel relativo está
// fijado POR CRITERIO ESCRITO antes de mirar los números, y el corte
// sólo vale si la métrica reproduce ese orden.
//
// CRITERIO (fijado antes de medir):
//   abajo   — lo escrito PARA NIÑOS que empiezan a leer: los cuentos y
//             fábulas de Ushinski, las «Русские книги для чтения» de
//             Tolstói (frase corta, léxico concreto, sin subordinación),
//             los cuentos populares de Afanásiev (fórmulas repetidas),
//             Mamin-Sibiriak (Алёнушкины сказки). A2 DECLARADO: la
//             regla de Edu es que A2 no quede vacío; si la densidad los
//             sube, manda el criterio y se dice.
//   medio-b — Chéjov de una página (Смерть чиновника, Хамелеон, Толстый
//             и тонкий, Ванька), Кавказский пленник, las Повести Белкина,
//             Аленький цветочек: narración llana con diálogo; B1.
//   medio   — Chéjov maduro (Дама с собачкой, Ионыч, Студент), Turguénev
//             (Муму, Бежин луг), Tolstói (Детство), Gógol (Вечера): B2.
//   arriba  — Gógol petersburgués (Шинель, Нос), Dostoyevski (Белые ночи,
//             Записки из подполья), Goncharov (Обломов), Leskov (Левша:
//             skaz, léxico deformado), Saltykov (сказки satíricas): C1.
//   A MANO  — las novelas grandes son C2 POR ESCALA y carga referencial
//             (Война и мир con su francés, Братья Карамазовы, Анна
//             Каренина, Идиот): se declara en la tanda, como Os Maias en
//             PT. La poesía (Пушкин, Лермонтов) se declara: el verso
//             engaña a la densidad (CS lo pagó).
//
// uso: node scripts/lectura/anclas-ru.mjs      (lee de la caché de la ingesta;
//       lo que no esté en caché lo baja EN SERIE con pausa)
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { densidad } from './medir-nivel.mjs';
import { normalizarDiacriticos, gateDiacriticos, medirGrafia, slug, redirigir, PERFIL } from './texto-ru.mjs';

const ANCLAS = [
  ['abajo ', 'Ушинский', 'Бишка (Ушинский)'],
  ['abajo ', 'Ушинский', 'Четыре желания (Ушинский)'],
  ['abajo ', 'Толстой', 'Первая русская книга для чтения (Лев Толстой)'],
  ['abajo ', 'Толстой', 'Вторая русская книга для чтения (Лев Толстой)'],
  ['abajo ', 'Толстой', 'Три медведя (Толстой)'],
  ['abajo ', 'Толстой', 'Филипок (Толстой)'],
  ['abajo ', 'Афанасьев', 'Народные русские сказки (Афанасьев)/Колобок'],
  ['abajo ', 'Афанасьев', 'Народные русские сказки (Афанасьев)/Лисичка-сестричка и волк'],
  ['abajo ', 'Мамин-Сиб.', 'Сказка про храброго Зайца — длинные уши, косые глаза, короткий хвост (Мамин-Сибиряк)'],
  ['medioB', 'Чехов', 'Смерть чиновника (Чехов)'],
  ['medioB', 'Чехов', 'Хамелеон (Чехов)'],
  ['medioB', 'Чехов', 'Толстый и тонкий (Чехов)'],
  ['medioB', 'Толстой', 'Кавказский пленник (Толстой)'],
  ['medioB', 'Пушкин', 'Повести покойного Ивана Петровича Белкина (Пушкин)/Станционный смотритель'],
  ['medioB', 'Пушкин', 'Повести покойного Ивана Петровича Белкина (Пушкин)/Метель'],
  ['medioB', 'Аксаков', 'Аленький цветочек (Аксаков)'],
  ['medio ', 'Чехов', 'Дама с собачкой (Чехов)'],
  ['medio ', 'Чехов', 'Ионыч (Чехов)'],
  ['medio ', 'Чехов', 'Студент (Чехов)'],
  ['medio ', 'Тургенев', 'Муму (Тургенев)'],
  ['medio ', 'Тургенев', 'Бежин луг (Тургенев)'],
  ['medio ', 'Толстой', 'Детство (Толстой)/Глава I'],
  ['medio ', 'Гоголь', 'Ночь перед Рождеством (Гоголь)'],
  ['arriba', 'Гоголь', 'Шинель (Гоголь)'],
  ['arriba', 'Гоголь', 'Нос (Гоголь)'],
  ['arriba', 'Достоевский', 'Белые ночи (Достоевский)'],
  ['arriba', 'Достоевский', 'Записки из подполья (Достоевский)'],
  ['arriba', 'Гончаров', 'Обломов (Гончаров)/Часть I/Глава I'],
  ['arriba', 'Лесков', 'Левша (Лесков)'],
  ['arriba', 'Салтыков', 'Премудрый пискарь (Салтыков-Щедрин)'],
  ['a mano', 'Толстой', 'Война и мир (Толстой)/Том 1'],
  ['a mano', 'Достоевский', 'Братья Карамазовы (Достоевский)/Книга первая'],
  ['a mano', 'Пушкин', 'Евгений Онегин (Пушкин)/Глава I'],
];

const HOST = 'https://ru.wikisource.org';
const CACHE = path.join(process.cwd(), 'scripts/.cache/lectura/ws-ru');
fs.mkdirSync(CACHE, { recursive: true });
function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.codePointAt(0)) >>> 0; return h.toString(36); }

async function html(titulo, salto = 0) {
  const f = path.join(CACHE, `${slug(titulo)}-${hash(titulo)}.html`);
  let t;
  if (fs.existsSync(f)) t = fs.readFileSync(f, 'utf8');
  else {
    const u = new URL(`${HOST}/w/api.php`);
    u.search = new URLSearchParams({ action: 'parse', page: titulo, prop: 'text', disableeditsection: '1', redirects: '1', format: 'json' });
    for (let i = 0; i < 8; i++) {
      const r = await fetch(u, { headers: { 'user-agent': 'aprende-idiomas-lectura/1.0 (emrs94@gmail.com)' } });
      if (r.ok) {
        const d = await r.json();
        if (d.error) throw new Error(`${titulo}: ${d.error.info}`);
        t = d.parse.text['*'];
        fs.writeFileSync(f, t);
        await new Promise((ok) => setTimeout(ok, PERFIL.espaciadoDescargas));
        break;
      }
      await new Promise((ok) => setTimeout(ok, Math.min(60_000, 3000 * 2 ** i)));
    }
    if (t === undefined) throw new Error(`${titulo}: 429/5xx ocho veces`);
  }
  if (salto < 3) {
    const doc = new JSDOM(`<body>${t}</body>`).window.document;
    const dest = redirigir(doc, titulo);
    if (dest === false) throw new Error('no es una obra (desambiguación)');
    if (typeof dest === 'string') { console.log(`    ${titulo} → …${dest.slice(titulo.length)}`); return html(dest, salto + 1); }
  }
  return t;
}

function textoDe(h) {
  const dom = new JSDOM(`<body>${h}</body>`);
  const doc = dom.window.document;
  for (const sel of ['.ws-header', '.ws-noexport', '#ws-data', 'style', 'sup.reference', 'ol.references', 'table', ...PERFIL.quitar]) for (const n of doc.querySelectorAll(sel)) n.remove();
  return normalizarDiacriticos(doc.body.textContent);
}

/** Longitud media de frase, el segundo eje (plano en PT, RO y CS). */
function fraseMedia(t) {
  const frases = t.split(/[.!?…]+[\s»”"]+/).filter((f) => /\p{L}{3}/u.test(f));
  const pal = t.split(/\s+/).filter((w) => /\p{Script=Cyrillic}/u.test(w)).length;
  return pal / Math.max(1, frases.length);
}

console.log('tramo   autor        obra                                      pal   dens   d4    letr  frase  cir   grafía');
const filas = [];
for (const [tramo, autor, obra] of ANCLAS) {
  let t;
  try { t = textoDe(await html(obra)); } catch (e) { console.log(`${tramo}  ${autor.padEnd(12)} ${obra.slice(0, 40).padEnd(40)} ✗ ${e.message}`); continue; }
  const { indice, palabras } = densidad(t, 'ru');
  const gd = gateDiacriticos(t);
  const g = medirGrafia(t);
  const pal4 = (t.toLowerCase().match(/[\p{Script=Cyrillic}]+/gu) ?? []).filter((p) => /[аеёиоуыэюяѣі]/.test(p));
  const d4 = 100 * pal4.filter((p) => (p.match(/[аеёиоуыэюяѣі]+/g) ?? []).length >= 4).length / Math.max(1, pal4.length);
  const letr = pal4.reduce((a, p) => a + p.length, 0) / Math.max(1, pal4.length);
  filas.push({ tramo, indice, d4, letr });
  console.log(`${tramo}  ${autor.padEnd(12)} ${obra.replace(/^[^/]+\//, '…/').slice(0, 40).padEnd(40)} ${String(palabras).padStart(6)}  ${indice.toFixed(1).padStart(5)}  ${d4.toFixed(1).padStart(4)}  ${letr.toFixed(2)}  ${fraseMedia(t).toFixed(1).padStart(5)}  ${(100 * gd.ratio).toFixed(0).padStart(3)}%  ${g.etiqueta}`);
}
const stats = (tr) => {
  const v = filas.filter((f) => f.tramo === tr).map((f) => f.indice).sort((a, b) => a - b);
  return v.length ? `${v[0].toFixed(1)}–${v.at(-1).toFixed(1)} (mediana ${v[Math.floor(v.length / 2)].toFixed(1)})` : '—';
};
console.log(`\nrangos de densidad: abajo ${stats('abajo ')} · medio-b ${stats('medioB')} · medio ${stats('medio ')} · arriba ${stats('arriba')} · a mano ${stats('a mano')}`);
