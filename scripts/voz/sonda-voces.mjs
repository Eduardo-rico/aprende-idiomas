// scripts/voz/sonda-voces.mjs
//
// ¿ES DE LA VOZ O DEL MODELO?
//
//   node scripts/voz/sonda-voces.mjs [--n 12] [--solo-plan]
//
// Con `Romans` quedó establecido que el motor acentúa la penúltima y que
// NINGUNA marca ortográfica lo vuelca —ocho candidatas, incluido un control
// negativo que falló como se predijo—.
//
// Queda una pregunta que decide todo lo demás y que es más barata que
// probar las cinco voces a fondo: **¿es una propiedad de esa voz o del
// modelo?** Basta con el par decisivo —`discipulum` contra `discìpulum`— en
// las otras cuatro italianas.
//
//   · si las cinco se comportan igual, el hallazgo es del MOTOR y ninguna
//     voz italiana servirá. La conversación pasa a ser con qué se sustituye.
//   · si alguna difiere, ya sabemos cuál probar a fondo.
//
// El nulo informa en los dos sentidos, que es la condición para que valga
// la pena correrlo.
//
// UMBRAL, declarado antes: una voz «respeta el latín» si con la tilde el
// pico cae en la sílaba 2 en más de la mitad de las repeticiones Y la
// ventaja supera el ruido medido EN ESA VOZ. El ruido se mide por voz,
// porque puede depender de la voz tanto como del texto.
import fs from 'node:fs';
import { porSilaba } from './pico-por-silaba.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('n', 12));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const MODELO = 'eleven_multilingual_v2';
const IDIOMA = 'it';
const SALIDA = arg('salida', 'scripts/.cache/voz/voces');
const SILABAS = 4, OBJETIVO = 2;

// Las cinco italianas de la cuenta. `Romans` ya está medida y va de
// referencia, con sus números de la tanda anterior.
const VOCES = [
  { id: 'tiziana', nombre: 'Tiziana italian Storyteller', voz: 'RXoaSpLaWTEckJgPUBG3' },
  { id: 'sara', nombre: 'Sara - E-learning and audiobook', voz: 'uV2Bhcm1HwmAqPqkbjfl' },
  { id: 'sami', nombre: 'Sami warm italian voice', voz: 'fQmr8dTaOQq116mo2X7F' },
  { id: 'marco', nombre: 'MarcoTrox (masculina)', voz: 'W71zT1VwIFFx3mMGH2uZ' },
];
const TEXTOS = [
  { id: 'base', texto: 'discipulum' },
  { id: 'grave', texto: 'discìpulum' },
];

const coste = VOCES.length * TEXTOS.reduce((a, t) => a + t.texto.length * N, 0);
console.log(`plan: ${VOCES.length} voces × ${TEXTOS.length} textos × ${N} repeticiones = ${coste} caracteres`);
for (const v of VOCES) console.log(`  ${v.id.padEnd(10)} ${v.nombre}`);
console.log('\nreferencia ya medida — Romans: base [0.65 0.66 1.00 0.35] · grave [0.70 0.87 0.88 0.39], ruido 0,0951');
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }

fs.mkdirSync(SALIDA, { recursive: true });
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('falta ELEVENLABS_API_KEY'); process.exit(1); }

async function generar(voz, texto, ruta) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}`, {
    method: 'POST',
    headers: { 'xi-api-key': clave, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: MODELO, language_code: IDIOMA }),
  });
  if (r.status === 429) { console.error('⚠ 429 — CUOTA. Paro y lo digo.'); process.exit(2); }
  if (!r.ok) { console.error(`⚠ http ${r.status} en ${voz}: ${(await r.text()).slice(0, 160)}`); process.exit(3); }
  fs.writeFileSync(ruta, Buffer.from(await r.arrayBuffer()));
}

const media = (g, i) => g.reduce((s, e) => s + e[i], 0) / g.length;
const resultados = { modelo: MODELO, n: N, generado: new Date().toISOString(), voces: {} };

for (const v of VOCES) {
  for (const t of TEXTOS)
    for (let i = 1; i <= N; i++) await generar(v.voz, t.texto, `${SALIDA}/${v.id}-${t.id}${i}.mp3`);

  const G = (t) => Array.from({ length: N }, (_, i) => porSilaba(`${SALIDA}/${v.id}-${t}${i + 1}.mp3`, SILABAS)).filter(Boolean);
  const base = G('base'), grave = G('grave');
  // El ruido, medido EN ESTA VOZ: el mismo texto contra sí mismo.
  const mitad = Math.floor(base.length / 2);
  const ruido = Math.max(...Array.from({ length: SILABAS }, (_, i) =>
    Math.abs(media(base.slice(0, mitad), i) - media(base.slice(mitad), i))));
  const perfil = (g) => Array.from({ length: SILABAS }, (_, i) => media(g, i));
  const votos = (g) => { const x = new Array(SILABAS).fill(0); for (const e of g) x[e.indexOf(Math.max(...e))]++; return x; };
  const pg = perfil(grave), vg = votos(grave);
  const orden = pg.map((val, i) => ({ val, i })).sort((a, b) => b.val - a.val);
  const ventaja = pg[OBJETIVO - 1] - (orden[0].i === OBJETIVO - 1 ? orden[1].val : orden[0].val);
  const respeta = vg[OBJETIVO - 1] > N / 2 && ventaja > ruido;
  resultados.voces[v.id] = { ...v, ruido, base: perfil(base), votosBase: votos(base), grave: pg, votosGrave: vg, ventaja, respeta };
  console.log(`\n  ${v.nombre}   (ruido ${ruido.toFixed(4)})`);
  console.log(`    base  [${perfil(base).map((x) => x.toFixed(2)).join(' ')}]  votos ${votos(base).join('/')}`);
  console.log(`    grave [${pg.map((x) => x.toFixed(2)).join(' ')}]  votos ${vg.join('/')}  ventaja ${ventaja >= 0 ? '+' : ''}${ventaja.toFixed(3)}  →  ${respeta ? 'RESPETA EL LATÍN' : 'no'}`);
}
fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(resultados, null, 1)}\n`);
console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
