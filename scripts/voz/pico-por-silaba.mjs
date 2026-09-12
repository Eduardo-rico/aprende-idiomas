// scripts/voz/pico-por-silaba.mjs
//
// ¿DÓNDE CAE EL ACENTO? Instrumento por SÍLABA, no envolvente.
//
//   node scripts/voz/pico-por-silaba.mjs <directorio-de-clips>
//
// ── POR QUÉ HIZO FALTA OTRO INSTRUMENTO ──────────────────────────────
//
// La sonda de acento compara envolventes de 12 bins con un test de
// permutación, y con la voz `Romans` dio TODO indistinguible, incluidas las
// dos calibraciones —pares mínimos donde una voz italiana de verdad TIENE
// que diferir—.
//
// Antes de leer eso como «la voz no hace prosodia italiana», el control:
//
//     dos palabras distintas          p = 0,0000   las separa ✓
//     la misma cadena contra sí misma p = 0,19     no separa ruido ✓
//     las calibraciones ENTERAS       p = 0,0042   las separa ✓
//     ruido entre repeticiones                     0,1138
//
// El instrumento no estaba ciego: **la señal del acento es más pequeña que
// el ruido del motor entre dos generaciones**. Comparar envolventes enteras
// no la resuelve. Un nulo con esa causa no dice nada de la voz.
//
// Este instrumento mira otra cosa: parte el tramo con voz en tantos trozos
// como sílabas tenga la palabra y pregunta **en cuál está el pico**.
//
// ── EL SESGO QUE HAY QUE DESCONTAR, Y CÓMO ───────────────────────────
//
// La energía DECAE a lo largo del enunciado. En palabras cortas el pico cae
// en la primera sílaba por declinación y no por acento —`dominos` da
// [0,95 0,60 0,13]— así que el pico absoluto NO es interpretable por sí solo.
//
// Lo que sí lo es: comparar **la misma palabra con y sin tilde**. La
// declinación queda controlada por construcción —es la misma palabra, la
// misma voz, el mismo modelo— y lo único que cambia es la marca.
import { spawnSync } from 'node:child_process';

export function porSilaba(mp3, n) {
  const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'],
    { maxBuffer: 1 << 28 }).stdout;
  if (!raw || raw.length === 0) return null;
  const x = new Int16Array(raw.buffer, raw.byteOffset, raw.length >> 1);
  const abs = Array.from(x, Math.abs);
  const pico = Math.max(...abs), u = 0.03 * pico;
  const ini = abs.findIndex((v) => v > u);
  let fin = abs.length - 1;
  while (fin > ini && abs[fin] <= u) fin--;
  const paso = (fin - ini) / n, e = [];
  for (let i = 0; i < n; i++) {
    let s = 0, c = 0;
    for (let j = Math.floor(ini + i * paso); j < Math.floor(ini + (i + 1) * paso); j++) { s += x[j] * x[j]; c++; }
    e.push(Math.sqrt(s / Math.max(c, 1)));
  }
  const m = Math.max(...e);
  return e.map((v) => v / m);
}

let semilla = 20260911 >>> 0;
const rnd = () => { semilla ^= semilla << 13; semilla ^= semilla >>> 17; semilla ^= semilla << 5; return ((semilla >>> 0) % 100000) / 100000; };

/** Permutación sobre UNA sílaba: ¿difiere su energía entre los dos grupos? */
export function permutacionSilaba(A, B, idx, R = 10000) {
  const st = (x, y) => {
    const m = (g) => g.reduce((a, r) => a + r[idx], 0) / g.length;
    return m(x) - m(y);
  };
  const obs = st(A, B); const todo = [...A, ...B]; const k = A.length;
  let mayores = 0;
  for (let r = 0; r < R; r++) {
    const p = todo.slice();
    for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    if (Math.abs(st(p.slice(0, k), p.slice(k))) >= Math.abs(obs)) mayores++;
  }
  return { obs, p: mayores / R };
}

export function grupo(dir, prefijo, n, reps = 12) {
  return Array.from({ length: reps }, (_, i) => porSilaba(`${dir}/${prefijo}${i + 1}.mp3`, n)).filter(Boolean);
}
