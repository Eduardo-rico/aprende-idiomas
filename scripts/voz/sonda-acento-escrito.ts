// scripts/voz/sonda-acento-escrito.ts
//
// ¿OBEDECE EL MOTOR UN ACENTO ESCRITO? — CON UN PAR MÍNIMO REAL.
//
//   npx tsx scripts/voz/sonda-acento-escrito.ts [--n 8] [--solo-plan]
//
// Esta tanda contesta dos cosas a la vez, y por eso se paga.
//
// ── 1 · ES EL CONTROL POSITIVO QUE LE FALTA AL NULO DEL IPA ──────────
//
// La tanda del IPA, ya intercalada y con sus dos controles negativos
// quietos, dio que el pico de la palabra etiquetada **no se mueve**
// (+0,087, 1,4 ee, umbral 0,20). Pero ese nulo sólo vale si el aparato
// PUEDE ver un desplazamiento en esa posición, y hay motivo para dudarlo:
// `videt` da 0,256 al final de la frase y 0,557 en medio. La misma palabra,
// el mismo motor, la misma voz. O la prosodia de frase pesa más que el
// acento de palabra en esta medida, o el aparato no lee acento.
//
// Un nulo que sólo puede significar «no miro» no es un resultado.
//
// ── 2 · Y ES LA PREGUNTA QUE LE IMPORTA AL CURSO ─────────────────────
//
// Al proyecto no le interesa el IPA: le interesa que el audio diga
// dis-CI-pu-lum. Si el motor obedece un ACENTO ESCRITO, la mitigación es
// escribir `discípulum` en el texto que va a la voz, y eso ya está en el
// código (`textoParaVoz`, la respelización eclesiástica). Sin IPA, sin v3
// y sin decidir nada más.
//
// §5 dijo que ninguna marca ortográfica mueve el pico. Esa medición
// arrastra los DOS defectos que se han encontrado desde entonces: corte en
// cuartos iguales, y condiciones seguidas en vez de intercaladas —que es
// lo que acaba de anular una tanda entera—. Toca volver a preguntarlo.
//
// ── EL PAR MÍNIMO: NO ES LATÍN INVENTADO, ES ITALIANO REAL ───────────
//
//   capitano   ca-pi-TA-no   el capitán           pico esperado ~0,6
//   càpitano   CÀ-pi-ta-no   «suceden», de capitare   pico esperado ~0,2
//
// Las dos son palabras italianas corrientes, la voz es italiana y el
// acento escrito es la ortografía normal para distinguirlas. Si un motor
// obedece un acento escrito en algún sitio, es aquí. Si aquí no lo
// obedece, no lo obedece en ningún sitio, y la respuesta es definitiva en
// vez de otra sospecha.
//
// ── UMBRALES, ESCRITOS ANTES DE GASTAR ───────────────────────────────
//
//   OBEDECE   si la fracción del pico se mueve ≥ 0,20 hacia el principio
//             al añadir el acento. El efecto esperado es ~0,40; con
//             σ ≈ 0,15 y n = 8 por condición, 0,20 son 2,7 errores típicos.
//
//   Y SI NO SE MUEVE, se lee al revés: **el aparato no ve el acento de
//   palabra en posición medial**, y entonces el nulo del IPA queda ANULADO
//   también. Las dos lecturas están escritas antes de mirar, así que el
//   nulo informa en los dos sentidos.
//
// Condiciones INTERCALADAS, por lo aprendido a la mala. Los dos modelos,
// porque el que genera el audio del curso todavía no está decidido y v2 es
// el único cuya alineación está medida.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const arg = (n: string, d: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1]! : d; };
const N = Number(arg('n', '8'));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const VOZ = arg('voz', 'jlhiuC3oLEP3JDAx1ECk');
const SALIDA = arg('salida', 'scripts/.cache/voz/acento-escrito');
const MODELOS = ['eleven_multilingual_v2', 'eleven_v3'];
const CONDICIONES = { sin: 'Oggi capitano tre cose strane.', con: 'Oggi càpitano tre cose strane.' };
const DIANA = 1;      // «capitano», en medio de la frase
const UMBRAL = 0.20;

const coste = MODELOS.length * N * (CONDICIONES.sin.length + CONDICIONES.con.length);
console.log(`plan: ${MODELOS.length} modelos × 2 condiciones × ${N} repeticiones = ${coste} caracteres`);
console.log(`  sin  «${CONDICIONES.sin}»   ca-pi-TA-no, pico esperado ~0,6`);
console.log(`  con  «${CONDICIONES.con}»   CÀ-pi-ta-no, pico esperado ~0,2`);
console.log(`  umbral declarado: ≥ ${UMBRAL} hacia el principio`);
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }

fs.mkdirSync(SALIDA, { recursive: true });
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('falta ELEVENLABS_API_KEY'); process.exit(1); }

interface Al { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] }

async function generar(texto: string, modelo: string, ruta: string): Promise<Al> {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}/with-timestamps`, {
    method: 'POST', headers: { 'xi-api-key': clave!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: modelo, language_code: 'it' }),
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
function fraccionDelPico(x: Int16Array, t0: number, t1: number): number {
  const paso = (t1 - t0) / 40; let mejor = -1, arg = 0;
  for (let q = 0; q < 40; q++) { const e = rms(x, t0 + q * paso, t0 + (q + 1) * paso); if (e > mejor) { mejor = e; arg = q; } }
  return (arg + 0.5) / 40;
}
const media = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v: number[]) => { const m = media(v); return Math.sqrt(media(v.map((z) => (z - m) ** 2))); };

async function main() {
  const salida: Record<string, unknown> = { voz: VOZ, n: N, condiciones: CONDICIONES, umbral: UMBRAL };
  for (const modelo of MODELOS) {
    const f: Record<string, number[]> = { sin: [], con: [] };
    for (let i = 1; i <= N; i++) {
      for (const [cond, texto] of Object.entries(CONDICIONES)) {
        const mp3 = `${SALIDA}/${modelo}-${cond}-${i}.mp3`;
        const al = await generar(texto, modelo, mp3);
        const v = vano(al, DIANA);
        if (v) f[cond]!.push(fraccionDelPico(pcm(mp3), v[0], v[1]));
      }
    }
    const dif = media(f.con!) - media(f.sin!);
    const ee = Math.sqrt((sd(f.sin!) ** 2 + sd(f.con!) ** 2) / N);
    const obedece = dif <= -UMBRAL;
    console.log(`\n  ${modelo}`);
    console.log(`    sin acento  ${media(f.sin!).toFixed(3)} ± ${sd(f.sin!).toFixed(3)}`);
    console.log(`    con acento  ${media(f.con!).toFixed(3)} ± ${sd(f.con!).toFixed(3)}`);
    console.log(`    Δ ${dif >= 0 ? '+' : ''}${dif.toFixed(3)}  (${(Math.abs(dif) / ee).toFixed(1)} ee)  → ${obedece ? 'OBEDECE el acento escrito' : 'NO obedece'}`);
    salida[modelo] = { sin: media(f.sin!), sdSin: sd(f.sin!), con: media(f.con!), sdCon: sd(f.con!), delta: dif, ee, obedece };
  }
  fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(salida, null, 1)}\n`);
  console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
}
main();
