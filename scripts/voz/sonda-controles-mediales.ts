// scripts/voz/sonda-controles-mediales.ts
//
// LA MEDICIÓN DECISIVA: ¿EXISTE ALGÚN APARATO QUE LEA EL ACENTO?
//
//   npx tsx scripts/voz/sonda-controles-mediales.ts [--n 12] [--solo-plan]
//
// ── DÓNDE ESTAMOS ────────────────────────────────────────────────────
//
// Tres magnitudes probadas y ningún veredicto legible:
//
//   ENERGÍA   tumbada por un control positivo: en `capitano`, palabra
//             italiana corriente y voz italiana, el pico cae en `no` en
//             las dos condiciones, y ahí no se acentúa bajo ninguna
//             lectura.
//   TONO      falla 2 de 3 controles… pero los dos que falla son FINAL DE
//             FRASE (`strane.` 3/8, `videt.` 6/12) y el único MEDIAL los
//             pasa (`cose` 6/8). En final de frase hay tono de frontera, y
//             se come el acento de palabra.
//   DURACIÓN  ya se vio comida por el alargamiento final (12 de 12 en
//             `det`), que es el mismo fenómeno.
//
// La hipótesis que queda es concreta: **los aparatos podrían leer bien en
// posición medial y no en final**. No se puede aceptar quitando los
// controles que fallan —eso es mover el agujero hasta que la regla
// acierte—. Se comprueba con controles NUEVOS, todos mediales, y elegidos
// antes de mirar.
//
// ── LA FRASE, Y POR QUÉ ESTAS PALABRAS ───────────────────────────────
//
//   «Oggi la musica italiana diventa famosa.»
//
//   musica     MU-si-ca     acento en la 1.ª   ← y es esdrújula, que es
//                                                justo el patrón que el
//                                                latín necesita
//   italiana   i-ta-LIA-na  acento en la 3.ª
//   diventa    di-VEN-ta    acento en la 2.ª
//
// Tres palabras italianas corrientes, las tres EN MEDIO, con el acento en
// tres sílabas distintas. Si un aparato acierta las tres no está leyendo
// la posición en la frase: está leyendo el acento. `famosa.` va al final y
// se mide aparte, como testigo del fenómeno de frontera.
//
// Se miden las TRES magnitudes sobre el mismo audio, y sólo en
// `eleven_multilingual_v2`, que es el único con alineación medida y el que
// genera el audio del proyecto.
//
// ── LA REGLA, ESCRITA ANTES DE GASTAR ────────────────────────────────
//
//   Una magnitud se adopta si acierta ≥ 3 de los 3 controles mediales con
//   ≥ 75 % de los votos. Dos de tres no basta: con tres sílabas el azar ya
//   da un tercio, y una magnitud que falla una de tres no sirve para
//   certificar audio que nadie va a escuchar entero.
//
//   Si ninguna lo consigue, la conclusión es FIRME y se acabó la línea:
//   el acento de esta voz no se puede certificar por medición, hay que
//   escucharlo, y §5 se cierra en `needs-human` con las tres magnitudes
//   descartadas por control positivo en vez de por sospecha.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tonoEn } from './tono-por-silaba';

const arg = (n: string, d: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1]! : d; };
const N = Number(arg('n', '12'));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const VOZ = arg('voz', 'jlhiuC3oLEP3JDAx1ECk');
const SALIDA = arg('salida', 'scripts/.cache/voz/mediales');
const MODELO = 'eleven_multilingual_v2';
const FRASE = 'Oggi la musica italiana diventa famosa.';

interface Diana { nombre: string; i: number; corte: number[]; silabas: string[]; espera: number; medial: boolean }
const DIANAS: Diana[] = [
  { nombre: 'musica', i: 2, corte: [2, 2, 2], silabas: ['mu', 'si', 'ca'], espera: 0, medial: true },
  { nombre: 'italiana', i: 3, corte: [1, 2, 3, 2], silabas: ['i', 'ta', 'lia', 'na'], espera: 2, medial: true },
  { nombre: 'diventa', i: 4, corte: [2, 3, 2], silabas: ['di', 'ven', 'ta'], espera: 1, medial: true },
  { nombre: 'famosa', i: 5, corte: [2, 2, 3], silabas: ['fa', 'mo', 'sa.'], espera: 1, medial: false },
];

const coste = N * FRASE.length;
console.log(`plan: ${MODELO} × «${FRASE}» × ${N} = ${coste} caracteres`);
console.log(`  ${DIANAS.filter((d) => d.medial).length} controles mediales con el acento en 3 sílabas distintas · 3 magnitudes`);
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }

fs.mkdirSync(SALIDA, { recursive: true });
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('falta ELEVENLABS_API_KEY'); process.exit(1); }

interface Al { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] }

async function generar(ruta: string): Promise<Al> {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}/with-timestamps`, {
    method: 'POST', headers: { 'xi-api-key': clave!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: FRASE, model_id: MODELO, language_code: 'it' }),
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
function grupos(al: Al): number[][] {
  const g: number[][] = []; let w: number[] = [];
  for (let k = 0; k < al.characters.length; k++) {
    if (/\s/.test(al.characters[k]!)) { if (w.length) { g.push(w); w = []; } continue; }
    w.push(k);
  }
  if (w.length) g.push(w);
  return g;
}

const MAGNITUDES = ['energía', 'tono', 'duración'] as const;

async function main() {
  const votos: Record<string, Record<string, number[]>> = {};
  const perfiles: Record<string, Record<string, number[]>> = {};
  const cuenta: Record<string, number> = {};
  for (const d of DIANAS) {
    votos[d.nombre] = {}; perfiles[d.nombre] = {}; cuenta[d.nombre] = 0;
    for (const m of MAGNITUDES) { votos[d.nombre]![m] = new Array(d.silabas.length).fill(0); perfiles[d.nombre]![m] = new Array(d.silabas.length).fill(0); }
  }
  for (let i = 1; i <= N; i++) {
    const mp3 = `${SALIDA}/${i}.mp3`;
    const al = await generar(mp3);
    const x = pcm(mp3);
    const g = grupos(al);
    for (const d of DIANAS) {
      const gg = g[d.i]; if (!gg) continue;
      const e: number[] = [], t: number[] = [], u: number[] = [];
      let k = 0;
      for (const largo of d.corte) {
        const a = gg[k], b = gg[k + largo - 1]; k += largo;
        if (a === undefined || b === undefined) { e.push(0); t.push(0); u.push(0); continue; }
        const t0 = al.character_start_times_seconds[a]!, t1 = al.character_end_times_seconds[b]!;
        e.push(rms(x, t0, t1)); t.push(tonoEn(x, t0, t1)); u.push(t1 - t0);
      }
      if ([e, t, u].some((v) => v.some((z) => z === 0))) continue;
      cuenta[d.nombre]!++;
      for (const [m, v] of [['energía', e], ['tono', t], ['duración', u]] as [string, number[]][]) {
        votos[d.nombre]![m]![v.indexOf(Math.max(...v))]!++;
        for (let j = 0; j < v.length; j++) perfiles[d.nombre]![m]![j]! += v[j]!;
      }
    }
  }

  const aciertos: Record<string, number> = { 'energía': 0, tono: 0, 'duración': 0 };
  for (const d of DIANAS) {
    const n = cuenta[d.nombre]!;
    console.log(`\n  ${d.nombre}  ${d.silabas.join('-')}  espera «${d.silabas[d.espera]}»  ${d.medial ? '(control medial)' : '(final de frase: testigo)'}  n=${n}`);
    for (const m of MAGNITUDES) {
      const v = votos[d.nombre]![m]!, p = perfiles[d.nombre]![m]!.map((s) => s / Math.max(1, n));
      const frac = n > 0 ? v[d.espera]! / n : 0;
      const bien = frac >= 0.75;
      if (d.medial && bien) aciertos[m]!++;
      console.log(`    ${m.padEnd(9)} [${p.map((z) => (m === 'tono' ? z.toFixed(0) : m === 'duración' ? z.toFixed(3) : z.toFixed(0))).join(' ')}]  votos ${v.join('/')}  ${(100 * frac).toFixed(0)} % ${d.medial ? (bien ? '✓' : '✗') : ''}`);
    }
  }
  const ganan = MAGNITUDES.filter((m) => aciertos[m] === DIANAS.filter((d) => d.medial).length);
  console.log(`\n  aciertos sobre los 3 controles mediales: ${MAGNITUDES.map((m) => `${m} ${aciertos[m]}/3`).join(' · ')}`);
  console.log(ganan.length > 0
    ? `  ✓ lee el acento en posición medial: ${ganan.join(', ')} — se puede certificar por medición`
    : '  ✗ ninguna magnitud lee el acento ni en posición medial → needs-human, firme y por control positivo');
  fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify({ frase: FRASE, modelo: MODELO, n: N, votos, perfiles, cuenta, aciertos }, null, 1)}\n`);
  console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
}
main();
