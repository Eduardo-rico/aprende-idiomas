// scripts/voz/pico-por-nucleo.ts
//
// SEGUNDA LECTURA DEL MISMO AUDIO. NO GASTA NI UN CARÁCTER.
//
//   npx tsx scripts/voz/pico-por-nucleo.ts [--dir scripts/.cache/voz/frase]
//
// Lee los mp3 y las alineaciones que la sonda de frase ya dejó en disco y
// contesta dos preguntas que aquella tanda destapó sin querer.
//
// ── PREGUNTA A · ¿LA ALINEACIÓN DE v3 ES MEDIDA O INVENTADA? ─────────
//
// Mirando una alineación de `eleven_v3` a ojo, las duraciones por carácter
// van en escalones planos: ocho caracteres seguidos a 0,080 s y luego
// cuatro a 0,060 s. Las de `eleven_multilingual_v2`, en cambio, van
// irregulares —0,116 · 0,070 · 0,058 · 0,081…—, que es lo que se espera de
// algo medido sobre la señal.
//
// Si v3 reparte el tiempo a partes iguales dentro de cada tramo, su
// alineación no es una medida: es una interpolación con pinta de medida.
// Eso es un fallo que devuelve un número plausible —ni error ni cero— y
// tiene consecuencia directa: **el karaoke de las cuatro lenguas alinea
// texto con audio**, y sobre una alineación interpolada el resaltado cae
// donde no es sin que nada falle.
//
// La mido por la RACHA MÁS LARGA de caracteres con duración idéntica
// dentro de una palabra, en las 12 repeticiones de cada modelo. Umbral
// declarado antes de mirar: racha media ≥ 4 = repartida, no medida.
//
// ── PREGUNTA B · ¿DÓNDE ESTÁ LA MARCA DEL ACENTO? ────────────────────
//
// La tanda anterior midió por SÍLABA ENTERA y falló un control: en
// `multilingual_v2` el pico de `Magister` salió en `ma` y no en `gis`,
// donde coinciden el latín, la regla italiana del motor y el castellano.
//
// La sospecha es que la sílaba entera es la unidad equivocada: `dis` y
// `lum` son cerradas y arrastran consonantes que no llevan acento, así que
// el promedio de la sílaba mide sobre todo cuántas consonantes tiene. La
// marca del acento vive en el NÚCLEO VOCÁLICO. Y en los datos ya pagados
// hay un indicio: en `discipulum` la vocal más larga de toda la palabra es
// la `i` de `ci`, que es justo donde el latín pone el acento —y la sílaba
// entera lo tapaba.
//
// REGLA DECLARADA ANTES DE MIRAR NINGÚN NÚMERO, para no elegir el
// instrumento que da la respuesta que me gusta: el núcleo sustituye a la
// sílaba SÓLO si lee los DOS controles en los DOS modelos —`gis` en
// `Magister` y `vi` en `videt`, con el mismo voto mínimo de 9 de 12—. Si
// falla un solo control, se descarta y la sílaba entera se queda como
// estaba. Los controles no dicen nada sobre `discipulum`: por eso pueden
// arbitrar sin decidir.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { silabas } from './cuanto-duele';
import type { Alineacion } from './silabas-alineadas';

const arg = (n: string, d: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1]! : d; };
const DIR = arg('dir', 'scripts/.cache/voz/frase');
const MODELOS = ['eleven_multilingual_v2', 'eleven_v3'];
const DIANAS = [
  { palabra: 'Magister', espera: 'gis', control: true },
  { palabra: 'discipulum', espera: 'ci', control: false },
  { palabra: 'videt', espera: 'vi', control: true },
];
const VOTO = 9;

const VOCALES = 'aeiouyāēīōūăĕĭŏŭ';
/** El núcleo de la sílaba: el tramo de vocales, sin las consonantes que la
 *  cierran. Los diptongos cuentan enteros. */
function nucleo(silaba: string): [number, number] | null {
  const s = silaba.toLowerCase().normalize('NFC');
  let a = -1, b = -1;
  for (let i = 0; i < s.length; i++) {
    if (VOCALES.includes(s[i]!)) { if (a < 0) a = i; b = i + 1; } else if (a >= 0) break;
  }
  return a < 0 ? null : [a, b];
}

function pcm(mp3: string): Int16Array | null {
  const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], { maxBuffer: 1 << 28 }).stdout;
  if (!raw || raw.length === 0) return null;
  return new Int16Array(raw.buffer, raw.byteOffset, raw.length >> 1);
}
function rms(x: Int16Array, desde: number, hasta: number): number {
  const a = Math.max(0, Math.floor(desde * 16000)), b = Math.min(x.length, Math.ceil(hasta * 16000));
  let s = 0, c = 0;
  for (let j = a; j < b; j++) { const v = x[j]!; s += v * v; c++; }
  return c > 0 ? Math.sqrt(s / c) : 0;
}

/** Los índices de carácter de cada sílaba dentro del texto alineado. */
function tramos(palabra: string, al: Alineacion): { silaba: string; desde: number; hasta: number }[] | null {
  const texto = al.characters.join('').toLowerCase();
  const pos = texto.indexOf(palabra.toLowerCase());
  if (pos < 0) return null;
  const out: { silaba: string; desde: number; hasta: number }[] = [];
  let c = pos;
  for (const s of silabas(palabra)) { out.push({ silaba: s, desde: c, hasta: c + s.length }); c += s.length; }
  return out;
}

const media = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;

console.log(`segunda lectura de ${DIR} · 0 caracteres gastados\n`);
for (const modelo of MODELOS) {
  const rachas: number[] = [];
  const votosE = new Map<string, number[]>(), votosD = new Map<string, number[]>();
  for (const d of DIANAS) { votosE.set(d.palabra, new Array(silabas(d.palabra).length).fill(0)); votosD.set(d.palabra, new Array(silabas(d.palabra).length).fill(0)); }
  let n = 0;
  for (let i = 1; i <= 99; i++) {
    const mp3 = `${DIR}/${modelo}-${i}.mp3`, js = `${DIR}/${modelo}-${i}.json`;
    if (!fs.existsSync(js) || !fs.existsSync(mp3)) continue;
    n++;
    const al = JSON.parse(fs.readFileSync(js, 'utf8')) as Alineacion;
    const x = pcm(mp3); if (!x) continue;
    // A · racha más larga de duraciones idénticas dentro de palabra
    let mejor = 1, actual = 1;
    for (let k = 1; k < al.characters.length; k++) {
      if (/\s/.test(al.characters[k]!) || /\s/.test(al.characters[k - 1]!)) { actual = 1; continue; }
      const dk = +(al.character_end_times_seconds[k]! - al.character_start_times_seconds[k]!).toFixed(4);
      const dp = +(al.character_end_times_seconds[k - 1]! - al.character_start_times_seconds[k - 1]!).toFixed(4);
      actual = Math.abs(dk - dp) < 1e-4 ? actual + 1 : 1;
      if (actual > mejor) mejor = actual;
    }
    rachas.push(mejor);
    // B · pico por núcleo
    for (const d of DIANAS) {
      const tr = tramos(d.palabra, al); if (!tr) continue;
      const e: number[] = [], du: number[] = [];
      for (const t of tr) {
        const nu = nucleo(t.silaba);
        const a = nu ? t.desde + nu[0] : t.desde, b = nu ? t.desde + nu[1] : t.hasta;
        const t0 = al.character_start_times_seconds[a]!, t1 = al.character_end_times_seconds[b - 1]!;
        e.push(rms(x, t0, t1)); du.push(t1 - t0);
      }
      votosE.get(d.palabra)![e.indexOf(Math.max(...e))]!++;
      votosD.get(d.palabra)![du.indexOf(Math.max(...du))]!++;
    }
  }
  console.log(`  ${modelo}  (${n} generaciones)`);
  console.log(`    A · racha de duraciones idénticas: ${media(rachas).toFixed(1)} caracteres de media  → ${media(rachas) >= 4 ? 'REPARTIDA, no medida' : 'medida'}`);
  for (const d of DIANAS) {
    const sil = silabas(d.palabra), vE = votosE.get(d.palabra)!, vD = votosD.get(d.palabra)!;
    const idx = sil.indexOf(d.espera);
    const marca = d.control ? (vE[idx]! >= VOTO ? '✓ control leído' : '✗ CONTROL FALLA') : '· discrimina';
    console.log(`    B · ${d.palabra.padEnd(11)} ${sil.join('-').padEnd(14)} espera «${d.espera}»  ${marca}`);
    console.log(`        energía del núcleo   votos ${vE.join('/')}  pico «${sil[vE.indexOf(Math.max(...vE))]}»`);
    console.log(`        duración del núcleo  votos ${vD.join('/')}  pico «${sil[vD.indexOf(Math.max(...vD))]}»`);
  }
  console.log('');
}
