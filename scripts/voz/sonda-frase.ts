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
// misma tanda porque son las mismas frases.
//
// LA PRIMERA VERSIÓN DE ESTA SONDA MIDIÓ SÓLO `discipulum` Y NO VALÍA.
// Dio el pico en `lum`, la ÚLTIMA sílaba —que el latín no acentúa nunca y
// el italiano tampoco—, y con una sola palabra no había forma de saber si
// eso era un hallazgo o el instrumento. Error mío: la tanda llevaba
// control negativo para la pregunta de la variabilidad (v2 junto a v3) y
// NO llevaba control positivo para la del acento.
//
// Ahora se miden las TRES palabras de la frase, y dos de ellas son
// control positivo porque TODAS las teorías coinciden en dónde cae su
// pico —el latín, la regla italiana del motor y hasta el castellano—:
//
//     Magister     ma-GIS-ter    penúltima pesada → `gis`   CONTROL
//     videt        VI-det        bisílaba         → `vi`    CONTROL
//     discipulum   dis-?-?-lum   latín `ci` · italiano `pu` DISCRIMINA
//
// REGLA DE LECTURA, declarada antes de mirar: si un control no pone su
// pico donde todas las teorías coinciden, el instrumento NO está leyendo
// acento y la lectura de `discipulum` queda ANULADA, diga lo que diga.
// Así el nulo informa: «no detecto nada» puede significar «el aparato no
// mira», y sin controles no hay manera de distinguirlo.
//
// Las dos marcas van por separado, energía y duración. Si discrepan en
// los controles, la que discrepa es la rota. Y esto es justo lo que los
// cuartos iguales no podían ver: daban la duración constante POR
// CONSTRUCCIÓN, así que sólo leían la mitad del fenómeno.
import fs from 'node:fs';
import { fronterasSilabicas, energiaPorSilaba, duracionPorSilaba, type Alineacion } from './silabas-alineadas';
import { silabas } from './cuanto-duele';

const arg = (n: string, d?: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1]! : d; };
const N = Number(arg('n', '12'));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const VOZ = arg('voz', 'jlhiuC3oLEP3JDAx1ECk')!;
const SALIDA = arg('salida', 'scripts/.cache/voz/frase')!;

// La frase va en latín de verdad y el `discipulum` en medio, con contexto
// por los dos lados. Las otras dos palabras no están de relleno: son los
// controles, y por eso la frase es ésta y no otra.
const FRASE = 'Magister discipulum videt.';
const MODELOS = ['eleven_multilingual_v2', 'eleven_v3'];

interface Diana { palabra: string; espera: string; porQue: string; control: boolean }
const DIANAS: Diana[] = [
  { palabra: 'Magister', espera: 'gis', porQue: 'penúltima pesada: latín, italiano y castellano coinciden', control: true },
  { palabra: 'discipulum', espera: 'ci', porQue: 'penúltima BREVE: el latín la salta, el italiano no', control: false },
  { palabra: 'videt', espera: 'vi', porQue: 'bisílaba: nadie acentúa la última', control: true },
];
// Voto mínimo para dar por leído un control. 12 repeticiones, 3 o 4
// sílabas: el azar daría 3 o 4 de 12. Se pide 9, declarado antes de mirar.
const VOTO_MINIMO = Math.ceil(0.75 * N);

const coste = MODELOS.length * FRASE.length * N;
console.log(`plan: ${MODELOS.length} modelos × «${FRASE}» × ${N} repeticiones = ${coste} caracteres`);
console.log(`  variabilidad de la frase · y acento de ${DIANAS.length} palabras, ${DIANAS.filter((d) => d.control).length} de ellas control positivo`);
console.log(`  voto mínimo para dar un control por leído: ${VOTO_MINIMO} de ${N}`);
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
  // La alineación se guarda: es lo que hace falta para volver a medir sin
  // pagar otra vez, y no guardarla ya costó una tanda entera.
  fs.writeFileSync(ruta.replace(/\.mp3$/, '.json'), `${JSON.stringify(j.alignment)}\n`);
  return j.alignment;
}

const media = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const cv = (v: number[]) => { const m = media(v); return Math.sqrt(media(v.map((x) => (x - m) ** 2))) / m; };
const perfil = (g: number[][]) => g[0]!.map((_, i) => media(g.map((r) => r[i]!)));
const votos = (g: number[][]) => { const v: number[] = new Array(g[0]!.length).fill(0); for (const r of g) v[r.indexOf(Math.max(...r))]!++; return v; };

async function main() {
  const resultados: Record<string, unknown> = { frase: FRASE, voz: VOZ, n: N, votoMinimo: VOTO_MINIMO, generado: new Date().toISOString() };
  let algunControlFalla = false;

  for (const modelo of MODELOS) {
    const dur: number[] = [];
    const porPalabra = new Map<string, { e: number[][]; d: number[][]; sil: string[]; total: number[] }>();
    for (const d of DIANAS) porPalabra.set(d.palabra, { e: [], d: [], sil: silabas(d.palabra), total: [] });

    for (let i = 1; i <= N; i++) {
      const mp3 = `${SALIDA}/${modelo}-${i}.mp3`;
      const al = await generar(modelo, mp3);
      dur.push(al.character_end_times_seconds[al.character_end_times_seconds.length - 1]!);
      for (const diana of DIANAS) {
        const fr = fronterasSilabicas(diana.palabra, al);
        if (!fr) continue;
        const acc = porPalabra.get(diana.palabra)!;
        acc.total.push(fr[fr.length - 1]!.hasta - fr[0]!.desde);
        const e = energiaPorSilaba(mp3, fr); if (e) acc.e.push(e);
        const dd = duracionPorSilaba(fr); if (dd) acc.d.push(dd);
      }
    }

    console.log(`\n  ${modelo}`);
    console.log(`    duración de la FRASE   ${media(dur).toFixed(2)}s   rango ${Math.min(...dur).toFixed(2)}–${Math.max(...dur).toFixed(2)}   variación ${(100 * cv(dur)).toFixed(1)} %`);
    const porDiana: Record<string, unknown> = {};
    for (const diana of DIANAS) {
      const acc = porPalabra.get(diana.palabra)!;
      if (acc.e.length === 0) { console.log(`    ${diana.palabra}: no localizada`); algunControlFalla ||= diana.control; continue; }
      const pE = perfil(acc.e), pD = perfil(acc.d), vE = votos(acc.e), vD = votos(acc.d);
      const idx = acc.sil.indexOf(diana.espera);
      const leeE = vE[idx]! >= VOTO_MINIMO, leeD = vD[idx]! >= VOTO_MINIMO;
      const marca = diana.control ? (leeE || leeD ? '✓ control leído' : '✗ CONTROL FALLA') : '· discrimina';
      if (diana.control && !leeE && !leeD) algunControlFalla = true;
      console.log(`    ${diana.palabra.padEnd(11)} ${acc.sil.join('-').padEnd(14)} espera «${diana.espera}»   ${marca}`);
      console.log(`      energía   [${pE.map((v) => v.toFixed(2)).join(' ')}]  votos ${vE.join('/')}  pico «${acc.sil[vE.indexOf(Math.max(...vE))]}»`);
      console.log(`      duración  [${pD.map((v) => v.toFixed(2)).join(' ')}]  votos ${vD.join('/')}  pico «${acc.sil[vD.indexOf(Math.max(...vD))]}»`);
      porDiana[diana.palabra] = { silabas: acc.sil, espera: diana.espera, control: diana.control,
        duracionMedia: media(acc.total), cvDuracion: cv(acc.total), energia: pE, duracion: pD, votosEnergia: vE, votosDuracion: vD, leeE, leeD };
    }
    resultados[modelo] = { duracionFrase: { media: media(dur), cv: cv(dur), min: Math.min(...dur), max: Math.max(...dur) }, palabras: porDiana };
  }

  fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(resultados, null, 1)}\n`);
  console.log(algunControlFalla
    ? '\n  ⚠ ALGÚN CONTROL FALLA → el instrumento no lee acento y la lectura de «discipulum» queda ANULADA.'
    : '\n  los dos controles se leen → la lectura de «discipulum» cuenta.');
  console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
}

main();
