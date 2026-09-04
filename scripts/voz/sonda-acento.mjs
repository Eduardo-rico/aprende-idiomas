// scripts/voz/sonda-acento.mjs
//
// LA SONDA DEL ACENTO LATINO, reproducible y parametrizada por voz.
//
//   npx tsx scripts/voz/sonda-acento.mjs --voz <voice_id> [--n 12] [--solo-plan]
//
// Existe porque la primera sonda NO se commiteó: se escribió en línea, en
// el scratchpad de una sesión. Sobre ella se apoyaron tres decisiones y
// nadie podía auditar con qué se hizo. **Una medición cuyo instrumento no
// está en el repositorio no es reproducible.**
//
// ── LO QUE MIDE, Y LO QUE LA PRIMERA VERSIÓN MIDIÓ MAL ────────────────
//
// (A) **¿La tilde escrita mueve algo?** `dominos` contra `dòminos`, n
//     repeticiones de cada una, envolvente de energía y test de
//     permutación. Es una comparación interna: misma voz, mismo modelo.
//
// (B) **¿El instrumento distingue ACENTO, o sólo palabras distintas?**
//     La primera versión calibró con `capitolo` contra `capitale` y dijo
//     que el instrumento «distingue un acento conocido». **No lo
//     demostraba**: esas dos palabras difieren en DOS SÍLABAS ENTERAS, así
//     que separarlas sólo prueba que son palabras distintas.
//
//     La calibración correcta usa pares que COMPARTEN EL PRINCIPIO y
//     tienen el acento en sílabas distintas —`medico` (MÈ-di-co) contra
//     `medicina` (me-di-CÌ-na), `principe` contra `principale`— y compara
//     **sólo el tramo compartido**. Ahí los segmentos son los mismos, así
//     que lo que quede sólo puede ser prosodia.
//
// Aviso declarado sobre esa comparación: el tramo se toma como una
// fracción fija del audio, no alineado fonema a fonema. Es una
// aproximación, y por eso el veredicto se contrasta contra su nula.
//
// ── Y LA LECCIÓN QUE MOTIVÓ LA REESCRITURA ───────────────────────────
//
// La primera sonda usó `Xb7hH8MSUJpSbSDYk0k2` = «Alice — Clear, Engaging
// Educator», acento **británico**, elegida por estar «verificada para
// italiano». Esa etiqueta dice que el modelo puede renderizar texto
// italiano con esa voz, **no que la voz suene italiana**. Edu escuchó los
// clips y dijo que sonaban a inglés, y tenía razón.
//
// Por eso `--voz` es obligatorio y sin valor por defecto: la voz es la
// decisión, no un detalle de configuración.
import fs from 'fs';
import { spawnSync } from 'child_process';

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const VOZ = arg('voz');
const N = Number(arg('n', 12));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const MODELO = 'eleven_multilingual_v2';
const IDIOMA = 'it';
const SALIDA = arg('salida', 'scripts/.cache/voz');

if (!VOZ && !SOLO_PLAN) {
  console.error('falta --voz <voice_id>. No hay valor por defecto a propósito: la voz es la decisión.');
  process.exit(1);
}

// ── EL PLAN, declarado antes de gastar ────────────────────────────────
const PARES = [
  { id: 'tilde', a: 'dominos', b: 'dòminos', compara: 'todo',
    pregunta: '¿la tilde escrita mueve algo? Misma palabra, una con marca y otra sin ella.' },
  { id: 'calib-medico', a: 'medico', b: 'medicina', compara: 'principio',
    pregunta: 'calibración: MÈ-di-co contra me-di-CÌ-na, comparando sólo «medic-», que es idéntico.' },
  { id: 'calib-principe', a: 'principe', b: 'principale', compara: 'principio',
    pregunta: 'calibración: PRÌN-ci-pe contra prin-ci-PÀ-le, comparando sólo «princip-».' },
];
const SUELTAS = ['dominus', 'discipulum', 'agricola', 'amicus', 'filium', 'celum', 'gratsia'];

const coste = PARES.reduce((a, p) => a + (p.a.length + p.b.length) * N, 0) + SUELTAS.reduce((a, s) => a + s.length, 0);
console.log(`plan: ${PARES.length} pares × ${N} repeticiones + ${SUELTAS.length} sueltas = ${coste} caracteres`);
for (const p of PARES) console.log(`  ${p.id.padEnd(16)} ${p.a} / ${p.b}   ${p.pregunta}`);
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }

fs.mkdirSync(SALIDA, { recursive: true });
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('falta ELEVENLABS_API_KEY'); process.exit(1); }

async function generar(texto, ruta) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}`, {
    method: 'POST',
    headers: { 'xi-api-key': clave, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: MODELO, language_code: IDIOMA }),
  });
  if (r.status === 429) { console.error('⚠ 429 — CUOTA. Paro y lo digo.'); process.exit(2); }
  if (!r.ok) { console.error(`⚠ http ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(3); }
  fs.writeFileSync(ruta, Buffer.from(await r.arrayBuffer()));
}

// ── EL INSTRUMENTO ────────────────────────────────────────────────────
function envolvente(mp3, bins = 12, fraccion = 1) {
  const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'],
    { maxBuffer: 1 << 28 }).stdout;
  if (!raw || raw.length === 0) return null;
  let x = new Int16Array(raw.buffer, raw.byteOffset, raw.length >> 1);
  const abs = Array.from(x, Math.abs);
  const pico = Math.max(...abs), umbral = 0.02 * pico;
  let ini = abs.findIndex((v) => v > umbral);
  let fin = abs.length - 1; while (fin > ini && abs[fin] <= umbral) fin--;
  if (fin - ini < bins * 10) return null;
  fin = ini + Math.floor((fin - ini) * fraccion);      // sólo el tramo pedido
  const paso = (fin - ini) / bins;
  const e = [];
  for (let i = 0; i < bins; i++) {
    let s = 0, c = 0;
    for (let j = Math.floor(ini + i * paso); j < Math.floor(ini + (i + 1) * paso); j++) { s += x[j] * x[j]; c++; }
    e.push(Math.sqrt(s / Math.max(c, 1)));
  }
  const m = Math.max(...e);
  return e.map((v) => v / m);
}

let semilla = 20260904 >>> 0;
const rnd = () => { semilla ^= semilla << 13; semilla ^= semilla >>> 17; semilla ^= semilla << 5; return ((semilla >>> 0) % 100000) / 100000; };

function permutacion(A, B, R = 5000) {
  const st = (x, y) => {
    const m = (g) => g[0].map((_, i) => g.reduce((a, r) => a + r[i], 0) / g.length);
    const ma = m(x), mb = m(y);
    return ma.reduce((a, v, i) => a + Math.abs(v - mb[i]), 0) / ma.length;
  };
  const obs = st(A, B); const todo = [...A, ...B]; const k = A.length;
  let mayores = 0; const nul = [];
  for (let r = 0; r < R; r++) {
    const p = todo.slice();
    for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    const v = st(p.slice(0, k), p.slice(k)); nul.push(v); if (v >= obs) mayores++;
  }
  nul.sort((a, b) => a - b);
  return { obs, p: mayores / R, p95: nul[Math.floor(0.95 * R)] };
}

const resultados = { voz: VOZ, modelo: MODELO, idioma: IDIOMA, n: N, generado: new Date().toISOString(), pares: {} };

for (const par of PARES) {
  const fr = par.compara === 'principio' ? 0.45 : 1;
  for (const lado of ['a', 'b'])
    for (let i = 1; i <= N; i++) await generar(par[lado], `${SALIDA}/${par.id}-${lado}${i}.mp3`);
  const G = (lado) => Array.from({ length: N }, (_, i) => envolvente(`${SALIDA}/${par.id}-${lado}${i + 1}.mp3`, 12, fr)).filter(Boolean);
  const A = G('a'), B = G('b');
  const r = permutacion(A, B);
  resultados.pares[par.id] = { ...par, fraccionComparada: fr, ...r, hayDiferencia: r.p < 0.05 };
  console.log(`\n${par.id}: «${par.a}» contra «${par.b}»${fr < 1 ? ` (sólo el ${100 * fr}% inicial)` : ''}`);
  console.log(`  separación ${r.obs.toFixed(4)} · nula p95 ${r.p95.toFixed(4)} · p = ${r.p.toFixed(4)}  →  ${r.p < 0.05 ? 'DIFIEREN' : 'indistinguibles'}`);
}

for (const s of SUELTAS) await generar(s, `${SALIDA}/suelta-${s}.mp3`);
fs.writeFileSync(`${SALIDA}/resultados.json`, JSON.stringify(resultados, null, 1) + '\n');
console.log(`\n${coste} caracteres gastados · resultados en ${SALIDA}/resultados.json`);
