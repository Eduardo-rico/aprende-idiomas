// scripts/voz/sonda-espanola.mjs
//
// ¿PESA MÁS LA TILDE EN UNA VOZ ESPAÑOLA?
//
//   node scripts/voz/sonda-espanola.mjs [--n 12] [--solo-plan]
//
// ── EL ARGUMENTO, QUE NO ES DE ACENTO SINO DE ORTOGRAFÍA ─────────────
//
// Cinco voces italianas medidas y ninguna respeta el acento latino. Pero el
// motivo puede no ser el motor: **en italiano la tilde escrita es rarísima**
// y casi sólo aparece en oxítonas (`città`, `perché`), así que un TTS
// italiano ha visto poquísimas tildes en posición interior y no tiene por
// qué haber aprendido a obedecerlas.
//
// En español la tilde es **obligatoria, frecuentísima y FONÉMICA**:
// `ánimo` / `animo` / `animó` son tres palabras distintas. Un TTS español
// que ignore una tilde interior es un TTS roto.
//
// Lo medido con `Romans` encaja con eso: el motor LEE la tilde —la sílaba
// marcada sube 0,267 con p = 0,0003— pero no la OBEDECE lo suficiente para
// volcar el pico. Es justo lo que se esperaría de una lengua donde la marca
// es marginal. Cambiar la lengua de la voz cambia cuánto pesa esa marca en
// su entrenamiento, y es la variable que la tanda de italianas NO movía.
//
// ── LO QUE COSTARÍA, DICHO ANTES DE MEDIR ────────────────────────────
//
// La voz española no da la fonología eclesiástica: `ce/ci` sale [θe]~[se] y
// no [tʃe], `gn` no palataliza, y la `v` se confunde con la `b`. Pero el
// proyecto YA respeliza, y la ortografía española sabe escribir casi todo
// eso —`ch` para [tʃ], `ñ` para [ɲ], `ts` para [ts]—. La que se pierde de
// verdad es la `v`, y es una pérdida acotada y declarable.
//
// El cambio es: una fonología que SÍ se puede respelizar a cambio de un
// acento que NO se puede forzar. Y el acento distingue palabras mientras
// que eclesiástico contra restituido es una convención.
//
// ── LAS APUESTAS, ESCRITAS ANTES DE CORRER ───────────────────────────
//
//   · el coordinador apuesta a que JOSE vuelca el pico;
//   · yo también, y por el mismo argumento — con un riesgo que declaro: en
//     dos de las cuatro italianas (`Sara`, `MarcoTrox`) el pico cayó en la
//     PRIMERA sílaba por declinación y no por acento, y si la voz española
//     tiene ese mismo perfil el instrumento no podrá leerla.
//   · y `disCIpulum` vuelve a correr AQUÍ: un control es de la tanda, no
//     del proyecto. Apuesto otra vez a que falla.
//
// TILDE AGUDA, no grave: es la que el español usa y la única que su
// ortografía reconoce.
//
// ── Y EL VEREDICTO SE LEE SÓLO DENTRO DE CADA VOZ ────────────────────
//
// El corte en cuartos no está alineado a las sílabas reales, y ese sesgo se
// AGRAVA al comparar voces distintas porque cada una tiene su ritmo.
// Comparando la misma palabra con y sin marca dentro de una voz, el sesgo
// se cancela; entre voces, no. Ninguna cifra de aquí es comparable con la
// de otra voz.
import fs from 'node:fs';
import { porSilaba } from './pico-por-silaba.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('n', 12));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const MODELO = 'eleven_multilingual_v2';
const SALIDA = arg('salida', 'scripts/.cache/voz/espanola');
const SILABAS = 4, OBJETIVO = 2;

const VOZ = { id: 'jose', nombre: 'JOSE — española de México', voz: 'lQFpy8cEH4bDaHre2DpA', idioma: 'es' };
const TEXTOS = [
  { id: 'base', texto: 'discipulum', espero: 'falla', que: 'sin marca' },
  { id: 'aguda', texto: 'discípulum', espero: 'GANA', que: 'tilde aguda, la que el español usa y reconoce' },
  { id: 'mayuscula', texto: 'disCIpulum', espero: 'falla', que: 'CONTROL NEGATIVO, repetido en esta tanda' },
];

const coste = TEXTOS.reduce((a, t) => a + t.texto.length * N, 0);
console.log(`plan: ${TEXTOS.length} textos × ${N} repeticiones en ${VOZ.nombre} = ${coste} caracteres`);
for (const t of TEXTOS) console.log(`  ${t.id.padEnd(11)} «${t.texto}»  espero: ${t.espero}  — ${t.que}`);
console.log('\numbral: gana si el pico cae en la sílaba 2 en más de la mitad de las repeticiones');
console.log('        Y la ventaja supera el ruido medido EN ESTA TANDA');
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }

fs.mkdirSync(SALIDA, { recursive: true });
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('falta ELEVENLABS_API_KEY'); process.exit(1); }

async function generar(texto, ruta) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ.voz}`, {
    method: 'POST',
    headers: { 'xi-api-key': clave, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: MODELO, language_code: VOZ.idioma }),
  });
  if (r.status === 429) { console.error('⚠ 429 — CUOTA. Paro y lo digo.'); process.exit(2); }
  if (!r.ok) { console.error(`⚠ http ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(3); }
  fs.writeFileSync(ruta, Buffer.from(await r.arrayBuffer()));
}

for (const t of TEXTOS) for (let i = 1; i <= N; i++) await generar(t.texto, `${SALIDA}/${t.id}${i}.mp3`);

const G = (id) => Array.from({ length: N }, (_, i) => porSilaba(`${SALIDA}/${id}${i + 1}.mp3`, SILABAS)).filter(Boolean);
const media = (g, i) => g.reduce((s, e) => s + e[i], 0) / g.length;
const base = G('base');
const mitad = Math.floor(base.length / 2);
const ruido = Math.max(...Array.from({ length: SILABAS }, (_, i) =>
  Math.abs(media(base.slice(0, mitad), i) - media(base.slice(mitad), i))));
console.log(`\nruido de ESTA tanda: ${ruido.toFixed(4)}\n`);

const resultados = { voz: VOZ, modelo: MODELO, n: N, ruido, generado: new Date().toISOString(), textos: {} };
for (const t of TEXTOS) {
  const g = G(t.id);
  const perfil = Array.from({ length: SILABAS }, (_, i) => media(g, i));
  const votos = new Array(SILABAS).fill(0);
  for (const e of g) votos[e.indexOf(Math.max(...e))]++;
  const orden = perfil.map((val, i) => ({ val, i })).sort((a, b) => b.val - a.val);
  const ventaja = perfil[OBJETIVO - 1] - (orden[0].i === OBJETIVO - 1 ? orden[1].val : orden[0].val);
  const gana = votos[OBJETIVO - 1] > N / 2 && ventaja > ruido;
  resultados.textos[t.id] = { ...t, perfil, votos, ventaja, gana };
  console.log(`  ${t.id.padEnd(11)} [${perfil.map((x) => x.toFixed(2)).join(' ')}]  votos ${votos.join('/')}  ventaja ${ventaja >= 0 ? '+' : ''}${ventaja.toFixed(3)}  →  ${gana ? 'GANA' : 'no'}   (esperaba: ${t.espero})`);
}
fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(resultados, null, 1)}\n`);
console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
