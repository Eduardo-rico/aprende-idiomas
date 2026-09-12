// scripts/voz/sonda-ipa-frase.ts
//
// ¿OBEDECE `eleven_v3` UNA TRANSCRIPCIÓN FONÉMICA? — PRIMERO LO BARATO.
//
//   npx tsx scripts/voz/sonda-ipa-frase.ts [--n 10] [--solo-plan]
//
// ── POR QUÉ ESTA PREGUNTA SIGUE VIVA, Y POR QUÉ CAMBIA DE FORMA ──────
//
// La tanda anterior dejó dos cosas. Una: la variabilidad de v3 en frase es
// aceptable (1,2-1,6× la de v2, umbral declarado 2×). Otra: **la alineación
// por carácter de v3 está repartida, no medida** —racha de 7,7 caracteres
// idénticos contra 1,9 en v2—, así que con v3 no se puede cortar por
// sílaba. Las fronteras ENTRE palabras, en cambio, sí son medidas (la
// proporción de cada palabra varía 6,7 %, del mismo orden que el 8,8 % de
// v2), y eso es todo lo que hace falta aquí:
//
// **no hay que saber en qué sílaba cae el pico, sino si el pico SE MUEVE.**
//
// La medida es la posición del máximo de energía como FRACCIÓN de la
// palabra, en 40 tramos dentro del vano real de la palabra. Comprobado
// gratis sobre el audio ya pagado, el instrumento separa lo que tiene que
// separar: en v3, `videt` (VI-det) da 0,256 ± 0,116 y `Magister` da 0,633.
//
// ── LO BARATO PRIMERO: ¿OBEDECE, SIQUIERA? ───────────────────────────
//
// Antes de preguntar si el IPA arregla `discipulum` —donde el efecto
// esperado es pequeño y la desviación grande (± 0,27): poca potencia— se
// pregunta si el motor obedece EN ABSOLUTO, en el caso donde la
// obediencia produce un movimiento enorme e inconfundible:
//
//   A   ... videt ...          el motor lo dice VI-det, medido: 0,256
//   B   ... /viˈdet/ ...       si obedece, el pico se va al final: ~0,7
//
// Un bisílabo con el acento cambiado de sílaba mueve la fracción unas
// cuatro décimas. Con σ = 0,116 y n = 10 por condición, el error típico de
// la diferencia es 0,052.
//
// ── UMBRALES, ESCRITOS ANTES DE GASTAR ───────────────────────────────
//
//   OBEDECE      si la fracción de `videt` se mueve ≥ 0,20 hacia el final
//                (0,20 = 3,9 errores típicos; el efecto esperado es ~0,40)
//
//   CONTROL      `magister` y `discipulum` van IDÉNTICOS en las dos
//   NEGATIVO     condiciones y viajan en la misma tanda: si ELLOS se
//                mueven ≥ 0,20, lo que se está midiendo es ruido de tanda
//                y el veredicto sobre `videt` no vale.
//
//   COMETIDO     si la duración de la frase B se dispara, el motor está
//   LITERAL      leyendo las barras en voz alta en vez de interpretarlas.
//                Umbral: ≥ 1,5× la de A.
//
// Si NO obedece, aquí acaba la línea del IPA y no se gasta un carácter
// más. Si obedece, la pregunta de `discipulum` se hace aparte y con n
// mayor, porque ahí la potencia es la mitad.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const arg = (n: string, d: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1]! : d; };
const N = Number(arg('n', '10'));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const VOZ = arg('voz', 'jlhiuC3oLEP3JDAx1ECk');
const SALIDA = arg('salida', 'scripts/.cache/voz/ipa-frase');
const MODELO = 'eleven_v3';

// Las tres dianas van EN MEDIO. La tanda anterior enseñó por qué: puse un
// control al principio de la frase y otro al final, y la prominencia
// inicial y el alargamiento final se comieron los dos.
const CONDICIONES = {
  A: 'Nunc magister discipulum videt iterum.',
  B: 'Nunc magister discipulum /viˈdet/ iterum.',
};
// Se localizan por ÍNDICE DE PALABRA, no por deletreo: en B la palabra ya
// no se escribe «videt» y buscarla por texto no la encontraría.
const DIANAS = [
  { nombre: 'magister', i: 1, papel: 'control negativo (idéntico en A y B)' },
  { nombre: 'discipulum', i: 2, papel: 'control negativo (idéntico en A y B)' },
  { nombre: 'videt', i: 3, papel: 'LA PREGUNTA (lleva IPA sólo en B)' },
];
const UMBRAL = 0.20;

const coste = N * (CONDICIONES.A.length + CONDICIONES.B.length);
console.log(`plan: ${MODELO} · 2 condiciones × ${N} repeticiones = ${coste} caracteres`);
console.log(`  A  «${CONDICIONES.A}»`);
console.log(`  B  «${CONDICIONES.B}»`);
console.log(`  umbral declarado: desplazamiento ≥ ${UMBRAL} de la palabra`);
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }

fs.mkdirSync(SALIDA, { recursive: true });
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('falta ELEVENLABS_API_KEY'); process.exit(1); }

interface Al { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] }

async function generar(texto: string, ruta: string): Promise<Al> {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}/with-timestamps`, {
    method: 'POST', headers: { 'xi-api-key': clave!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: MODELO, language_code: 'it' }),
  });
  if (r.status === 429) { console.error('⚠ 429 — CUOTA. Paro y lo digo.'); process.exit(2); }
  if (!r.ok) { console.error(`⚠ http ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(3); }
  const j = await r.json() as { audio_base64: string; alignment: Al };
  fs.writeFileSync(ruta, Buffer.from(j.audio_base64, 'base64'));
  fs.writeFileSync(ruta.replace(/\.mp3$/, '.json'), `${JSON.stringify(j.alignment)}\n`);
  return j.alignment;
}

function pcm(f: string): Int16Array {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], { maxBuffer: 1 << 28 }).stdout;
  return new Int16Array(r.buffer, r.byteOffset, r.length >> 1);
}
function rms(x: Int16Array, a0: number, b0: number): number {
  const a = Math.max(0, Math.floor(a0 * 16000)), b = Math.min(x.length, Math.ceil(b0 * 16000));
  let s = 0, c = 0;
  for (let j = a; j < b; j++) { const v = x[j]!; s += v * v; c++; }
  return c > 0 ? Math.sqrt(s / c) : 0;
}
/** El vano de la palabra número `i` (contando desde 0), por los espacios. */
function vano(al: Al, i: number): [number, number] | null {
  const grupos: number[][] = []; let g: number[] = [];
  for (let k = 0; k < al.characters.length; k++) {
    if (/\s/.test(al.characters[k]!)) { if (g.length) { grupos.push(g); g = []; } continue; }
    g.push(k);
  }
  if (g.length) grupos.push(g);
  const gg = grupos[i]; if (!gg) return null;
  return [al.character_start_times_seconds[gg[0]!]!, al.character_end_times_seconds[gg[gg.length - 1]!]!];
}
/** La fracción de la palabra donde está el máximo de energía. */
function fraccionDelPico(x: Int16Array, t0: number, t1: number): number {
  const paso = (t1 - t0) / 40; let mejor = -1, arg = 0;
  for (let q = 0; q < 40; q++) { const e = rms(x, t0 + q * paso, t0 + (q + 1) * paso); if (e > mejor) { mejor = e; arg = q; } }
  return (arg + 0.5) / 40;
}

const media = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v: number[]) => { const m = media(v); return Math.sqrt(media(v.map((z) => (z - m) ** 2))); };

async function main() {
  const datos: Record<string, { dur: number[]; frac: Record<string, number[]> }> = {};
  for (const [cond, texto] of Object.entries(CONDICIONES)) {
    const d = { dur: [] as number[], frac: {} as Record<string, number[]> };
    for (const t of DIANAS) d.frac[t.nombre] = [];
    for (let i = 1; i <= N; i++) {
      const mp3 = `${SALIDA}/${cond}-${i}.mp3`;
      const al = await generar(texto, mp3);
      d.dur.push(al.character_end_times_seconds[al.character_end_times_seconds.length - 1]!);
      const x = pcm(mp3);
      for (const t of DIANAS) { const v = vano(al, t.i); if (v) d.frac[t.nombre]!.push(fraccionDelPico(x, v[0], v[1])); }
    }
    datos[cond] = d;
  }

  const durA = media(datos.A!.dur), durB = media(datos.B!.dur);
  console.log(`\n  duración de la frase   A ${durA.toFixed(2)}s   B ${durB.toFixed(2)}s   razón ${(durB / durA).toFixed(2)}×  → ${durB / durA >= 1.5 ? '⚠ LEE LAS BARRAS EN VOZ ALTA' : 'no las lee en voz alta'}`);
  const salida: Record<string, unknown> = { modelo: MODELO, voz: VOZ, n: N, condiciones: CONDICIONES, umbral: UMBRAL, duracion: { A: durA, B: durB } };
  let controlSucio = false, obedece = false;
  for (const t of DIANAS) {
    const a = datos.A!.frac[t.nombre]!, b = datos.B!.frac[t.nombre]!;
    const dif = media(b) - media(a);
    const ee = Math.sqrt((sd(a) ** 2 + sd(b) ** 2) / N);
    const mueve = Math.abs(dif) >= UMBRAL;
    if (t.nombre === 'videt') obedece = dif >= UMBRAL; else if (mueve) controlSucio = true;
    console.log(`  ${t.nombre.padEnd(11)} A ${media(a).toFixed(3)} ± ${sd(a).toFixed(3)}   B ${media(b).toFixed(3)} ± ${sd(b).toFixed(3)}   Δ ${dif >= 0 ? '+' : ''}${dif.toFixed(3)}  (${(Math.abs(dif) / ee).toFixed(1)} ee)  ${mueve ? 'SE MUEVE' : 'quieto'}   ${t.papel}`);
    salida[t.nombre] = { A: media(a), sdA: sd(a), B: media(b), sdB: sd(b), delta: dif, ee };
  }
  const veredicto = controlSucio ? 'ANULADO: un control negativo se movió, la tanda mide ruido'
    : obedece ? 'v3 OBEDECE el IPA: el pico de «videt» se fue al final' : 'v3 NO obedece el IPA: el pico de «videt» no se movió';
  console.log(`\n  ${veredicto}`);
  salida.veredicto = veredicto;
  fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(salida, null, 1)}\n`);
  console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
}
main();
