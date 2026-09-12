// scripts/voz/sonda-frase.ts
//
// LA VARIABILIDAD EN LA CONDICIÓN REALISTA, Y EL ACENTO DE PROPINA.
//
//   npx tsx scripts/voz/sonda-frase.ts [--n 12] [--solo-plan]
//
// ── POR QUÉ ESTA PREGUNTA VA ANTES QUE LA DEL IPA ────────────────────
//
// Midiendo palabras SUELTAS salió que `eleven_v3` varía un 19,4 % en
// duración para la misma entrada —entre 1,12 y 2,48 segundos— contra el
// 4,6 % de `multilingual_v2`. Eso es más grande que el problema del acento
// y no es del latín: **el karaoke de las cuatro lenguas alinea texto con
// audio**, y un modelo cuya duración baila un 19 % es mal cimiento.
//
// Pero una palabra aislada es el PEOR caso para cualquier TTS: sin contexto
// prosódico el modelo rellena con pausas, que es exactamente lo que
// estropeó el corte en cuartos. En frase la variación puede desplomarse.
//
// Si no se desploma, v3 está fuera para audio de curso con acento o sin él,
// y la pregunta del IPA se vuelve irrelevante. Por eso va primero.
//
// ── Y CON TIMESTAMPS, LAS DOS COSAS SALEN DE LA MISMA TANDA ──────────
//
// `/with-timestamps` da el inicio y el fin de CADA CARÁCTER —comprobado
// contra la API: v3 y v2 lo admiten los dos—, así que dentro de la frase se
// localizan las fronteras reales de `discipulum` y se mide su acento sin
// cuartos iguales y sin que la declinación de la frase estorbe.
//
// Se miden las DOS marcas del acento latino, no sólo una:
//
//   · la ENERGÍA de cada sílaba, que es lo único que el instrumento viejo
//     podía ver;
//   · y la DURACIÓN de cada sílaba, que en latín es la otra marca y que los
//     cuartos iguales no podían ver por construcción, porque asumían que
//     todas duraban lo mismo.
//
// ── DECLARADO ANTES DE GASTAR UN SOLO CARÁCTER ───────────────────────
//
// Umbral de la pregunta 1 (¿sirve v3?). El control negativo viaja en la
// MISMA tanda —`multilingual_v2`, que es el motor que el proyecto ya usa—,
// así que el umbral es relativo y no depende del ruido del día:
//
//     v3 SIRVE si cv(v3) ≤ 2 × cv(v2) en esta tanda.
//
// El 2× no es simetría: es que el karaoke tolera que un modelo sea algo
// más suelto, no que lo sea un orden de magnitud. En palabra suelta la
// razón medida fue 19,4 / 4,6 = 4,2×.
//
// PREDIGO QUE v3 FALLA: que la frase baje su variación —tendrá menos
// pausa proporcional que una palabra sola— pero que se quede por encima
// de 2× v2. Si acierto, la pregunta del IPA queda sin objeto y no se
// gasta más. Si me equivoco y v3 pasa, sigue el paso 3.
//
// Umbral de la pregunta 2 (¿dónde cae el acento?), que sale gratis de la
// misma tanda: `discipulum` es DIS-CI-pu-lum, esdrújula, porque la
// penúltima `pu` es breve. El motor italiano pone el pico en la
// PENÚLTIMA. Cuento el pico por voto mayoritario sobre las N repeticiones
// y por DOS marcas independientes, energía y duración:
//
//     pico en `ci` (índice 2 de 4) = el motor respeta el latín
//     pico en `pu` (índice 3 de 4) = regla italiana, el fallo ya conocido
//
// Y esto es lo que los cuartos iguales no podían ver: la duración por
// sílaba es una marca del acento y el instrumento viejo la daba constante
// POR CONSTRUCCIÓN, así que sólo podía leer la mitad del fenómeno.
import fs from 'node:fs';
import { fronterasSilabicas, energiaPorSilaba, duracionPorSilaba, type Alineacion } from './silabas-alineadas';

const arg = (n: string, d?: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1]! : d; };
const N = Number(arg('n', '12'));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const VOZ = arg('voz', 'jlhiuC3oLEP3JDAx1ECk')!;
const SALIDA = arg('salida', 'scripts/.cache/voz/frase')!;
const PALABRA = 'discipulum';
const OBJETIVO = 2;   // dis-CI-pu-lum

// La frase va en latín de verdad, con el orden que el curso usa, y el
// `discipulum` en medio para que tenga contexto por los dos lados.
const FRASE = 'Magister discipulum videt.';
const MODELOS = ['eleven_multilingual_v2', 'eleven_v3'];

const coste = MODELOS.length * FRASE.length * N;
console.log(`plan: ${MODELOS.length} modelos × «${FRASE}» × ${N} repeticiones = ${coste} caracteres`);
console.log('  mide: variabilidad de duración de la frase, y acento de «discipulum» dentro de ella');
console.log('  con fronteras silábicas REALES de /with-timestamps, no cuartos iguales');
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }

fs.mkdirSync(SALIDA, { recursive: true });
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('falta ELEVENLABS_API_KEY'); process.exit(1); }

async function generar(modelo: string, ruta: string): Promise<Alineacion> {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}/with-timestamps`, {
    method: 'POST',
    headers: { 'xi-api-key': clave!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: FRASE, model_id: modelo, language_code: 'it' }),
  });
  if (r.status === 429) { console.error('⚠ 429 — CUOTA. Paro y lo digo.'); process.exit(2); }
  if (!r.ok) { console.error(`⚠ http ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(3); }
  const j = await r.json() as { audio_base64: string; alignment: Alineacion };
  fs.writeFileSync(ruta, Buffer.from(j.audio_base64, 'base64'));
  return j.alignment;
}

const media = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const cv = (v: number[]) => { const m = media(v); return Math.sqrt(media(v.map((x) => (x - m) ** 2))) / m; };

async function main() {
  const resultados: Record<string, unknown> = { frase: FRASE, voz: VOZ, n: N, generado: new Date().toISOString() };
  for (const modelo of MODELOS) {
    let etiquetasSilabicas: string[] | null = null;
  const dur: number[] = [], durPal: number[] = [];
    const energias: number[][] = [], duraciones: number[][] = [];
    for (let i = 1; i <= N; i++) {
      const mp3 = `${SALIDA}/${modelo}-${i}.mp3`;
      const al = await generar(modelo, mp3);
      dur.push(al.character_end_times_seconds[al.character_end_times_seconds.length - 1]!);
      const fr = fronterasSilabicas(PALABRA, al);
      if (!fr) continue;
      etiquetasSilabicas ??= fr.map((f) => f.silaba);
      durPal.push(fr[fr.length - 1]!.hasta - fr[0]!.desde);
      const e = energiaPorSilaba(mp3, fr); if (e) energias.push(e);
      const d = duracionPorSilaba(fr); if (d) duraciones.push(d);
    }
    const perfil = (g: number[][]) => g[0]!.map((_, i) => media(g.map((r) => r[i]!)));
    const votos = (g: number[][]) => { const v = new Array(g[0]!.length).fill(0); for (const r of g) v[r.indexOf(Math.max(...r))]++; return v; };
    const pE = perfil(energias), pD = perfil(duraciones);
    const etiquetas = etiquetasSilabicas ?? pE.map((_, i) => `s${i + 1}`);
    resultados[modelo] = { duracionFrase: { media: media(dur), cv: cv(dur), min: Math.min(...dur), max: Math.max(...dur) },
      duracionPalabra: { media: media(durPal), cv: cv(durPal) }, silabas: etiquetas, energia: pE, duracion: pD,
      votosEnergia: votos(energias), votosDuracion: votos(duraciones) };
    console.log(`\n  ${modelo}`);
    console.log(`    duración de la FRASE     ${media(dur).toFixed(2)}s   rango ${Math.min(...dur).toFixed(2)}–${Math.max(...dur).toFixed(2)}   variación ${(100 * cv(dur)).toFixed(1)} %`);
    console.log(`    duración de la PALABRA   ${media(durPal).toFixed(2)}s   variación ${(100 * cv(durPal)).toFixed(1)} %`);
    console.log(`    sílabas                  ${etiquetas.join(' · ')}   ← el latín pide «${etiquetas[OBJETIVO - 1]}»`);
    console.log(`    energía por sílaba       [${pE.map((v) => v.toFixed(2)).join(' ')}]  pico en «${etiquetas[pE.indexOf(Math.max(...pE))]}»  votos ${votos(energias).join('/')}`);
    console.log(`    duración por sílaba      [${pD.map((v) => v.toFixed(2)).join(' ')}]  pico en «${etiquetas[pD.indexOf(Math.max(...pD))]}»  votos ${votos(duraciones).join('/')}`);
  }
  fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(resultados, null, 1)}\n`);
  console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
}

main();
