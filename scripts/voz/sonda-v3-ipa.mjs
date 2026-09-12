// scripts/voz/sonda-v3-ipa.mjs
//
// LA SONDA QUE CONVIERTE LAS CUATRO ANTERIORES EN HISTORIA — o no.
//
//   node scripts/voz/sonda-v3-ipa.mjs --voz <id> [--n 12] [--solo-plan]
//
// ── LO QUE DICE LA DOCUMENTACIÓN, Y POR QUÉ EXPLICA TODO LO ANTERIOR ─
//
// `eleven_multilingual_v2` —el modelo con el que se corrieron las cuatro
// tandas— **no admite etiquetas de fonema**. La documentación es explícita:
// «Phoneme tags are only compatible with the `eleven_flash_v2` model».
//
// Eso explica por qué ninguna de las ocho marcas ortográficas volcó el pico
// en ninguna de las seis voces: no había ningún canal por el que decirle al
// motor dónde va el acento. Estábamos negociando con la ortografía porque no
// sabíamos que existía una puerta.
//
// **`eleven_v3` sí la tiene**, y de la forma que hace falta: IPA nativo
// entre barras, con marcadores de acento estándar.
//
//     /disˈkipulum/        ˈ = acento primario
//
// 70+ lenguas, italiano y español incluidos, disponible por la API de
// text-to-speech. La documentación declara **80-90 % de consistencia**, no
// el 100 %: «the model may occasionally produce different outputs even with
// identical IPA transcriptions». Por eso esto se mide y no se supone.
//
// ── LO QUE PREGUNTA ──────────────────────────────────────────────────
//
// Tres textos, la misma palabra:
//
//     discipulum           ortografía desnuda — la referencia
//     /disˈkipulum/        IPA con el acento donde el latín lo pide
//     /diskiˈpulum/        IPA con el acento donde el italiano lo pondría
//
// El tercero es el control que faltaba en todas las tandas anteriores: si
// el motor obedece el IPA, los dos últimos tienen que salir DISTINTOS entre
// sí, y cada uno con el pico donde su transcripción lo marca. Si salen
// iguales, el motor ignora el IPA y da igual lo que diga la documentación.
//
// Es el primer control de esta serie que no depende de saber qué hace el
// motor por defecto: compara dos órdenes explícitas y contrarias.
//
// ── APUESTA, ESCRITA ANTES DE CORRER ─────────────────────────────────
//
// Apuesto a que el IPA funciona y a que los dos últimos se separan. He
// perdido la apuesta anterior —la de la voz española— así que esto vale lo
// que vale; queda escrito igual.
//
// VEINTE REPETICIONES Y NO DOCE. La documentación declara 80-90 % de
// consistencia, y con doce no se separa «obedece» de «obedece casi
// siempre»: si la tasa real es del 85 %, doce tiradas dan entre 8 y 12
// aciertos por puro azar y eso no distingue nada.
//
// ── Y LA COMPROBACIÓN QUE HIZO FALTA ANTES DE ESCRIBIR ESTO ──────────
//
// La cita «Phoneme tags are only compatible with the `eleven_flash_v2`
// model» habla de flash_v2, NO de v3: son dos afirmaciones distintas y yo
// las había fundido. Separadas y comprobadas contra la API:
//
//   · `eleven_flash_v2` tiene UNA sola lengua —inglés—, así que su canal de
//     etiquetas `<phoneme>` no sirve para latín con voz italiana;
//   · `eleven_v3` tiene 74 lenguas, italiano y español incluidos;
//   · NINGUNA de las 54 voces de la cuenta declara `eleven_v3` en su
//     `high_quality_base_model_ids` — pero ese campo NO es la puerta:
//     probado, `eleven_v3` + `Romans` devuelve HTTP 200 y 28 KB de audio.
//
// Sin esa comprobación, el hallazgo del IPA habría sido teórico.
//
// UMBRAL, también antes: el IPA funciona si `/disˈkipulum/` pone el pico en
// la sílaba 2 en más de la mitad de las repeticiones Y su ventaja supera el
// ruido medido en esta tanda. Y, además, si `/diskiˈpulum/` lo pone en la 3:
// las dos condiciones, porque acertar una sola podría ser el defecto del
// motor coincidiendo con la orden.
import fs from 'node:fs';
import { porSilaba } from './pico-por-silaba.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const VOZ = arg('voz', 'jlhiuC3oLEP3JDAx1ECk');   // Romans, la ya medida con v2
const N = Number(arg('n', 20));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const MODELO = 'eleven_v3';
const IDIOMA = 'it';
const SALIDA = arg('salida', 'scripts/.cache/voz/v3');
const SILABAS = 4;

const TEXTOS = [
  { id: 'orto', texto: 'discipulum', objetivo: null, espero: 'pico en la 3',
    que: 'ortografía desnuda: la referencia, y con v2 dio la sílaba 3' },
  { id: 'ipa-latin', texto: '/disˈkipulum/', objetivo: 2, espero: 'pico en la 2',
    que: 'IPA con el acento donde el latín lo pide' },
  { id: 'ipa-italiano', texto: '/diskiˈpulum/', objetivo: 3, espero: 'pico en la 3',
    que: 'IPA con el acento donde el italiano lo pondría — el control: dos órdenes contrarias' },
];

const coste = TEXTOS.reduce((a, t) => a + t.texto.length * N, 0);
console.log(`plan: ${TEXTOS.length} textos × ${N} repeticiones en ${MODELO} = ${coste} caracteres`);
for (const t of TEXTOS) console.log(`  ${t.id.padEnd(13)} «${t.texto}»${' '.repeat(Math.max(0, 16 - t.texto.length))} espero: ${t.espero}  — ${t.que}`);
console.log('\numbral: el IPA funciona si la versión latina pone el pico en la 2 con ventaja > ruido');
console.log('        Y la italiana lo pone en la 3. Las dos, porque acertar una sola podría ser');
console.log('        el defecto del motor coincidiendo con la orden.');
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
  if (!r.ok) {
    const cuerpo = (await r.text()).slice(0, 300);
    console.error(`⚠ http ${r.status}: ${cuerpo}`);
    if (r.status === 400 || r.status === 422) console.error('  (si el modelo o el language_code no valen, el hallazgo es ÉSE y hay que decirlo)');
    process.exit(3);
  }
  fs.writeFileSync(ruta, Buffer.from(await r.arrayBuffer()));
}

for (const t of TEXTOS) for (let i = 1; i <= N; i++) await generar(t.texto, `${SALIDA}/${t.id}${i}.mp3`);

const G = (id) => Array.from({ length: N }, (_, i) => porSilaba(`${SALIDA}/${id}${i + 1}.mp3`, SILABAS)).filter(Boolean);
const media = (g, i) => g.reduce((s, e) => s + e[i], 0) / g.length;
const orto = G('orto');
const mitad = Math.floor(orto.length / 2);
const ruido = Math.max(...Array.from({ length: SILABAS }, (_, i) =>
  Math.abs(media(orto.slice(0, mitad), i) - media(orto.slice(mitad), i))));
console.log(`\nruido de ESTA tanda: ${ruido.toFixed(4)}\n`);

const resultados = { voz: VOZ, modelo: MODELO, n: N, ruido, generado: new Date().toISOString(), textos: {} };
for (const t of TEXTOS) {
  const g = G(t.id);
  const perfil = Array.from({ length: SILABAS }, (_, i) => media(g, i));
  const votos = new Array(SILABAS).fill(0);
  for (const e of g) votos[e.indexOf(Math.max(...e))]++;
  let veredicto = '—';
  if (t.objetivo) {
    const otras = perfil.filter((_, i) => i !== t.objetivo - 1);
    const ventaja = perfil[t.objetivo - 1] - Math.max(...otras);
    const gana = votos[t.objetivo - 1] > N / 2 && ventaja > ruido;
    veredicto = `ventaja ${ventaja >= 0 ? '+' : ''}${ventaja.toFixed(3)} → ${gana ? 'OBEDECE' : 'no'}`;
    resultados.textos[t.id] = { ...t, perfil, votos, ventaja, gana };
  } else resultados.textos[t.id] = { ...t, perfil, votos };
  console.log(`  ${t.id.padEnd(13)} [${perfil.map((x) => x.toFixed(2)).join(' ')}]  votos ${votos.join('/')}  ${veredicto}   (esperaba: ${t.espero})`);
}
fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(resultados, null, 1)}\n`);
console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
