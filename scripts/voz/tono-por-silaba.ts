// scripts/voz/tono-por-silaba.ts
//
// EL CORRELATO QUE NUNCA HABÍA MEDIDO: EL TONO.
//
//   npx tsx scripts/voz/tono-por-silaba.ts
//
// Toda la línea de voz —§5, las cinco sondas, la del IPA y la del acento
// escrito— ha medido ENERGÍA. Y hoy un control positivo gratuito la ha
// tumbado: en `capitano`, palabra italiana corriente dicha por una voz
// italiana, el pico de energía cae en `no` en las dos condiciones. Esa
// palabra no se acentúa en la última ni como sustantivo (ca-pi-TA-no) ni
// como verbo (CA-pi-ta-no). Sea cual sea la lectura que eligió el motor,
// **el pico de energía no está donde está el acento**.
//
// Eso no convierte los nulos anteriores en falsos: los vuelve ILEGIBLES,
// que es peor. Un nulo medido con un aparato que no mira la magnitud no
// dice nada en ningún sentido.
//
// El acento italiano —y el latino de escuela, que es el que imita la voz—
// se marca sobre todo con TONO y con duración, no con volumen. Así que se
// mide el tono, y gratis: todo el audio y todas las alineaciones ya están
// pagados y en disco.
//
// ── CÓMO ─────────────────────────────────────────────────────────────
//
// F0 por autocorrelación: ventana de 40 ms, salto de 10 ms, búsqueda entre
// 75 y 400 Hz, y una trama cuenta como sonora si su máximo de
// autocorrelación normalizada pasa de 0,30. De cada sílaba se toma la
// MEDIANA de sus tramas sonoras, que resiste los saltos de octava del
// método mucho mejor que la media.
//
// ── LA REGLA, ESCRITA ANTES DE MIRAR ─────────────────────────────────
//
// El instrumento se adopta sólo si lee los controles positivos, que son
// palabras donde el acento no admite discusión y que ya están pagadas, en
// `eleven_multilingual_v2`, el único modelo con alineación medida:
//
//   cose    CO-se    italiano corriente, en medio de la frase
//   strane  STRA-ne  italiano corriente, al final
//   videt   VI-det   bisílabo latino, y la energía ya lo acertaba
//
// Pide 75 % de las generaciones con el pico de F0 en la sílaba correcta.
// Si falla, la conclusión no es «el motor acentúa mal»: es que ni la
// energía ni el tono medidos así leen el acento, y la pregunta pasa a
// `needs-human` —escuchar— en vez de seguir gastando.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

interface Al { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] }

function pcm(f: string): Int16Array {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], { maxBuffer: 1 << 28 }).stdout;
  return new Int16Array(r.buffer, r.byteOffset, r.length >> 1);
}

const SR = 16000, VENTANA = 0.040, SALTO = 0.010, FMIN = 75, FMAX = 400, SONORA = 0.30;

/** F0 de una trama por autocorrelación normalizada. 0 si no es sonora. */
function f0(x: Int16Array, desde: number): number {
  const n = Math.round(VENTANA * SR);
  if (desde + n >= x.length) return 0;
  let media = 0;
  for (let i = 0; i < n; i++) media += x[desde + i]!;
  media /= n;
  let e0 = 0;
  for (let i = 0; i < n; i++) { const v = x[desde + i]! - media; e0 += v * v; }
  if (e0 <= 0) return 0;
  const lagMin = Math.floor(SR / FMAX), lagMax = Math.floor(SR / FMIN);
  let mejor = 0, mejorLag = 0;
  for (let lag = lagMin; lag <= lagMax; lag++) {
    let s = 0, e1 = 0;
    for (let i = 0; i + lag < n; i++) {
      const a = x[desde + i]! - media, b = x[desde + i + lag]! - media;
      s += a * b; e1 += b * b;
    }
    const r = e1 > 0 ? s / Math.sqrt(e0 * e1) : 0;
    if (r > mejor) { mejor = r; mejorLag = lag; }
  }
  return mejor >= SONORA && mejorLag > 0 ? SR / mejorLag : 0;
}

/** La mediana del tono dentro de un tramo. 0 si no hay trama sonora. */
export function tonoEn(x: Int16Array, t0: number, t1: number): number {
  const v: number[] = [];
  for (let t = t0; t + VENTANA <= t1; t += SALTO) { const f = f0(x, Math.round(t * SR)); if (f > 0) v.push(f); }
  if (v.length === 0) return 0;
  v.sort((a, b) => a - b);
  return v[v.length >> 1]!;
}

function grupos(al: Al): number[][] {
  const g: number[][] = []; let w: number[] = [];
  for (let k = 0; k < al.characters.length; k++) {
    if (/\s/.test(al.characters[k]!)) { if (w.length) { g.push(w); w = []; } continue; }
    w.push(k);
  }
  if (w.length) g.push(w);
  return g;
}

// ── los controles, todos sobre audio ya pagado ──
interface Caso { dir: string; patron: string; n: number; palabra: number; corte: number[]; silabas: string[]; espera: number }
const CASOS: Caso[] = [
  { dir: 'scripts/.cache/voz/acento-escrito', patron: 'eleven_multilingual_v2-sin-#', n: 8, palabra: 3, corte: [2, 2], silabas: ['co', 'se'], espera: 0 },
  { dir: 'scripts/.cache/voz/acento-escrito', patron: 'eleven_multilingual_v2-sin-#', n: 8, palabra: 4, corte: [4, 3], silabas: ['stra', 'ne.'], espera: 0 },
  { dir: 'scripts/.cache/voz/frase', patron: 'eleven_multilingual_v2-#', n: 12, palabra: 2, corte: [2, 4], silabas: ['vi', 'det.'], espera: 0 },
];
const PREGUNTAS: Caso[] = [
  { dir: 'scripts/.cache/voz/acento-escrito', patron: 'eleven_multilingual_v2-sin-#', n: 8, palabra: 1, corte: [2, 2, 2, 2], silabas: ['ca', 'pi', 'ta', 'no'], espera: 2 },
  { dir: 'scripts/.cache/voz/acento-escrito', patron: 'eleven_multilingual_v2-con-#', n: 8, palabra: 1, corte: [2, 2, 2, 2], silabas: ['cà', 'pi', 'ta', 'no'], espera: 0 },
  { dir: 'scripts/.cache/voz/frase', patron: 'eleven_multilingual_v2-#', n: 12, palabra: 1, corte: [3, 2, 2, 3], silabas: ['dis', 'ci', 'pu', 'lum'], espera: 1 },
];

function medir(c: Caso): { votos: number[]; perfil: number[]; n: number } | null {
  const votos = new Array(c.silabas.length).fill(0) as number[];
  const suma = new Array(c.silabas.length).fill(0) as number[];
  let n = 0;
  for (let i = 1; i <= c.n; i++) {
    const base = `${c.dir}/${c.patron.replace('#', String(i))}`;
    if (!fs.existsSync(`${base}.json`)) continue;
    const al = JSON.parse(fs.readFileSync(`${base}.json`, 'utf8')) as Al;
    const g = grupos(al)[c.palabra]; if (!g) continue;
    const x = pcm(`${base}.mp3`);
    const tonos: number[] = []; let k = 0;
    for (const largo of c.corte) {
      const a = g[k], b = g[k + largo - 1]; k += largo;
      if (a === undefined || b === undefined) { tonos.push(0); continue; }
      tonos.push(tonoEn(x, al.character_start_times_seconds[a]!, al.character_end_times_seconds[b]!));
    }
    if (tonos.some((t) => t === 0)) continue;
    n++;
    votos[tonos.indexOf(Math.max(...tonos))]!++;
    for (let j = 0; j < tonos.length; j++) suma[j]! += tonos[j]!;
  }
  return n === 0 ? null : { votos, perfil: suma.map((s) => s / n), n };
}

console.log('tono por sílaba sobre audio ya pagado · 0 caracteres gastados\n');
let controlesOk = true;
for (const [titulo, lista] of [['CONTROLES (el acento no se discute)', CASOS], ['LA PREGUNTA', PREGUNTAS]] as [string, Caso[]][]) {
  console.log(`  ${titulo}`);
  for (const c of lista) {
    const r = medir(c);
    if (!r) { console.log(`    ${c.silabas.join('-')}: sin tramas sonoras`); if (lista === CASOS) controlesOk = false; continue; }
    const frac = r.votos[c.espera]! / r.n;
    const bien = frac >= 0.75;
    if (lista === CASOS && !bien) controlesOk = false;
    console.log(`    ${c.silabas.join('-').padEnd(16)} espera «${c.silabas[c.espera]}»  F0 [${r.perfil.map((v) => v.toFixed(0)).join(' ')}] Hz  votos ${r.votos.join('/')} de ${r.n}  ${lista === CASOS ? (bien ? '✓' : '✗') : `${(100 * frac).toFixed(0)} %`}`);
  }
  console.log('');
}
console.log(controlesOk
  ? '  los controles se leen → el tono SÍ mide acento, y lo de arriba cuenta.'
  : '  ✗ los controles NO se leen → ni la energía ni el tono leen acento así. La pregunta es needs-human: hay que escuchar.');
