// ¿El eje léxico mide la lengua o mide la LONGITUD del corpus?
//
//   node scripts/lectura/submuestreo-longitud.mjs --lang la
//
// POR QUÉ EXISTE. El coordinador cazó que el tamaño de corpus de los
// cuatro autores latinos medidos es perfectamente colineal con el
// resultado, y en orden inverso: Horacio 15.243 tokens → 468,5
// formas/1000; Virgilio 30.759 → 351,0; Tácito 52.249 → 289,9; Plauto
// 73.321 → 182,0. Pearson sobre log(tokens): r = −0,985.
//
// Y la crítica es correcta para la razón formas/tokens: DECRECE
// MECÁNICAMENTE con la longitud, porque cuanto más largo es un texto más
// se repiten las formas ya vistas. Esa columna no se puede comparar entre
// corpus de tamaños distintos, y punto.
//
// La pregunta abierta era si el defecto alcanza a la métrica que gobierna
// el veredicto, `% fuera del top-1000`. Esa lista se construye con los
// TREEBANKS, no con la obra medida, así que cada token aporta 0 o 1
// contra una referencia fija y externa: es una media por token, no una
// razón de tipos a tokens. Eso PREDICE que no se moverá al submuestrear.
//
// Predecirlo no basta. Esto lo mide: se recorta todo al tamaño del corpus
// más corto, con varias extracciones aleatorias por obra, y se comparan
// las dos métricas antes y después. Si el orden de `% fuera` sobrevive a
// igualdad de tamaño, el hallazgo queda sostenido; si se aplana o se
// invierte, el eje medía longitud y hay que revisar TODOS los saltos
// «confirmados», no sólo L5.
//
// Cero red y cero créditos: trabaja sobre lo ya descargado.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const valor = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const LANG = valor('--lang', 'la');
const REPS = Number(valor('--reps', '30'));
const CACHE = path.join(process.cwd(), 'scripts/.cache/treebanks');

/** PRNG con semilla, por la misma razón que en `dificultad-antigua.mjs`:
 *  una cifra que cambia entre corridas no se puede pegar en un commit. */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const canonicalLa = (s) => s.normalize('NFD').replace(/̄/g, '').normalize('NFC').toLowerCase();

/** El top-1000 de FORMAS de los treebanks: la lista de referencia FIJA y
 *  externa. No sale de las obras medidas — ése es justo el punto. */
function top1000Treebanks(lang) {
  const cuenta = new Map();
  for (const f of fs.readdirSync(CACHE).filter((x) => x.startsWith(`${lang}_`) && x.endsWith('.conllu'))) {
    for (const linea of fs.readFileSync(path.join(CACHE, f), 'utf8').split('\n')) {
      if (linea.startsWith('#') || !linea.trim()) continue;
      const c = linea.split('\t');
      if (c.length < 4 || !/^\d+$/.test(c[0]) || c[3] === 'PUNCT') continue;
      const w = canonicalLa(c[1]);
      cuenta.set(w, (cuenta.get(w) ?? 0) + 1);
    }
  }
  const orden = [...cuenta.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);
  return { top: new Set(orden.slice(0, 1000)), total: cuenta.size };
}

const media = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const ic = (a) => { const s = [...a].sort((x, y) => x - y); return [s[Math.floor(0.025 * s.length)], s[Math.floor(0.975 * s.length)]]; };

function main() {
  const extra = JSON.parse(fs.readFileSync(path.join(CACHE, `extra-${LANG}.json`), 'utf8'));
  const { top, total } = top1000Treebanks(LANG);
  const N = Math.min(...extra.map((e) => e.total));
  const rnd = mulberry32(20260903);

  console.log(`\nSUBMUESTREO A IGUAL TAMAÑO — ¿el eje mide lengua o longitud?`);
  console.log(`lista de referencia: top-1000 de ${total.toLocaleString('es')} formas distintas de los treebanks (FIJA, no sale de las obras)`);
  console.log(`recorte: ${N.toLocaleString('es')} tokens por obra (el corpus más corto) · ${REPS} extracciones aleatorias\n`);

  const filas = [];
  for (const e of extra) {
    // La bolsa de tokens de la obra, expandida desde los recuentos.
    const bolsa = [];
    for (const [w, n] of Object.entries(e.cuenta)) for (let i = 0; i < n; i++) bolsa.push(canonicalLa(w));

    const fueraCompleto = 100 * bolsa.filter((w) => !top.has(w)).length / bolsa.length;
    const ttrCompleto = 1000 * new Set(bolsa).size / bolsa.length;

    const fueraSub = [], ttrSub = [];
    for (let r = 0; r < REPS; r++) {
      // Muestra SIN reemplazo: Fisher-Yates parcial sobre una copia.
      const c = bolsa.slice();
      for (let i = 0; i < N; i++) {
        const j = i + Math.floor(rnd() * (c.length - i));
        const t = c[i]; c[i] = c[j]; c[j] = t;
      }
      const m = c.slice(0, N);
      fueraSub.push(100 * m.filter((w) => !top.has(w)).length / N);
      ttrSub.push(1000 * new Set(m).size / N);
    }
    filas.push({ obra: e.obra, autor: e.autor, tokens: e.total, fueraCompleto, ttrCompleto, fueraSub, ttrSub });
  }

  const cab = (t) => { console.log(`\n${t}`); console.log(`  ${'obra'.padEnd(22)} ${'tokens'.padStart(8)} ${'completo'.padStart(9)} ${'submuestreado (IC 95 %)'.padStart(26)} ${'Δ'.padStart(7)}`); };

  cab('① % FUERA DEL TOP-1000 — la métrica que gobierna el veredicto');
  for (const f of filas.slice().sort((a, b) => b.fueraCompleto - a.fueraCompleto)) {
    const m = media(f.fueraSub), [lo, hi] = ic(f.fueraSub);
    console.log(`  ${(f.obra + ' (' + f.autor + ')').padEnd(22)} ${f.tokens.toLocaleString('es').padStart(8)} ${f.fueraCompleto.toFixed(1).padStart(9)} ${`${m.toFixed(1)} [${lo.toFixed(1)}, ${hi.toFixed(1)}]`.padStart(26)} ${(m - f.fueraCompleto >= 0 ? '+' : '') + (m - f.fueraCompleto).toFixed(1).padStart(6)}`);
  }

  cab('② FORMAS DISTINTAS / 1000 TOKENS — la razón tipo/token');
  for (const f of filas.slice().sort((a, b) => b.ttrCompleto - a.ttrCompleto)) {
    const m = media(f.ttrSub), [lo, hi] = ic(f.ttrSub);
    console.log(`  ${(f.obra + ' (' + f.autor + ')').padEnd(22)} ${f.tokens.toLocaleString('es').padStart(8)} ${f.ttrCompleto.toFixed(1).padStart(9)} ${`${m.toFixed(1)} [${lo.toFixed(1)}, ${hi.toFixed(1)}]`.padStart(26)} ${(m - f.ttrCompleto >= 0 ? '+' : '') + (m - f.ttrCompleto).toFixed(1).padStart(6)}`);
  }

  // ── El veredicto, con el criterio dicho en el propio script ──
  const porFueraCompleto = filas.slice().sort((a, b) => b.fueraCompleto - a.fueraCompleto).map((f) => f.obra);
  const porFueraSub = filas.slice().sort((a, b) => media(b.fueraSub) - media(a.fueraSub)).map((f) => f.obra);
  const igual = porFueraCompleto.join('>') === porFueraSub.join('>');
  const desplaz = Math.max(...filas.map((f) => Math.abs(media(f.fueraSub) - f.fueraCompleto)));

  console.log(`\nVEREDICTO`);
  console.log(`  ① orden completo:        ${porFueraCompleto.join(' > ')}`);
  console.log(`  ① orden submuestreado:   ${porFueraSub.join(' > ')}`);
  console.log(`  ① desplazamiento máximo: ${desplaz.toFixed(2)} puntos`);
  console.log(`  ② el abanico tipo/token pasa de ${(Math.max(...filas.map((f) => f.ttrCompleto)) - Math.min(...filas.map((f) => f.ttrCompleto))).toFixed(0)} puntos a ${(Math.max(...filas.map((f) => media(f.ttrSub))) - Math.min(...filas.map((f) => media(f.ttrSub)))).toFixed(0)}`);
  if (igual && desplaz < 1) {
    console.log(`\n✔ El orden de ① SOBREVIVE a igualdad de tamaño y el valor no se mueve (< 1 punto).`);
    console.log(`  El eje NO estaba midiendo longitud: la lista de referencia es externa, así que`);
    console.log(`  cada token aporta 0 o 1 y la media no depende de n.`);
  } else if (igual) {
    console.log(`\n~ El orden de ① sobrevive, pero el valor se mueve ${desplaz.toFixed(2)} puntos: hay dependencia del tamaño y hay que acotarla antes de fiarse.`);
  } else {
    console.log(`\n✖ El orden de ① CAMBIA al igualar el tamaño. El eje medía longitud.`);
    console.log(`  Hay que revisar TODOS los saltos «confirmados», no sólo L5.`);
    process.exitCode = 1;
  }
}

main();
