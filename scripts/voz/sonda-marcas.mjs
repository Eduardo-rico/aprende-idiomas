// scripts/voz/sonda-marcas.mjs
//
// ¿QUÉ MARCA VUELCA EL PICO?
//
//   node scripts/voz/sonda-marcas.mjs --voz <id> [--n 12] [--solo-plan]
//
// La primera sonda estableció dos cosas con `Romans`:
//
//   (1) el motor aplica la REGLA ITALIANA: `discipulum` tiene el pico en la
//       sílaba 3 de 4 —dis-ci-PU-lum, 11 votos de 12— y el latín pide la 2;
//   (2) la tilde grave SÍ funciona y sólo donde debe: la sílaba marcada sube
//       de 0,601 a 0,868 (Δ 0,267, p = 0,0003) y ninguna otra se mueve.
//       Pero no gana: la 3 se queda en 0,894. Tres centésimas.
//
// Esta sonda pregunta qué marca sí lo vuelca.
//
// ── LAS CANDIDATAS, Y NO SON TODAS DEL MISMO TIPO ────────────────────
//
// Cinco piden al motor que DESOBEDEZCA su regla: tilde grave, tilde aguda,
// vocal doblada, guiones silábicos, mayúscula.
//
// Tres le DAN LA RAZÓN y mueven el problema: si la regla es «acentúa la
// penúltima de la palabra», basta con cambiarle dónde acaba la palabra.
// «discipu lum» hace que el motor vea «discipu», cuya penúltima es «ci» —
// exactamente la que el latín quiere. Es un mecanismo, no un tanteo, y si
// falla también informa: querría decir que la regla no opera sobre la
// palabra ortográfica sino sobre el grupo prosódico.
//
// ── EL CONTROL NEGATIVO, DECLARADO COMO TAL ANTES DE CORRER ──────────
//
// `disCIpulum` es mi apuesta a que NO hace nada: un TTS normaliza las
// mayúsculas antes de la fonología. Va porque tener siete candidatas que
// espero que funcionen y ninguna que no deja sin saber si una tanda en la
// que todas ganan significa que todas sirven o que la medida se volvió laxa.
// Si resulta que sí funciona, es un hallazgo; si falla, es el control.
//
// ── EL UMBRAL, DECLARADO ANTES DE MIRAR NINGÚN NÚMERO ────────────────
//
// «Volcar el pico» sobre una diferencia de tres centésimas es frágil por
// construcción, así que una candidata GANA si y sólo si se cumplen las dos:
//
//   A. el pico cae en la sílaba 2 en MÁS DE LA MITAD de sus repeticiones, y
//   B. la ventaja de la sílaba 2 sobre la siguiente supera el RUIDO medido
//      EN ESTA MISMA TANDA.
//
// Y el ruido se mide aquí, no se hereda: la tanda anterior dio 0,1138 y eso
// puede depender del texto. Se parten las repeticiones del texto base en dos
// mitades y se mide la diferencia aparente entre ellas, que es ruido puro.
import fs from 'node:fs';
import { porSilaba } from './pico-por-silaba.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const VOZ = arg('voz');
const N = Number(arg('n', 12));
const SOLO_PLAN = process.argv.includes('--solo-plan');
const MODELO = 'eleven_multilingual_v2';
const IDIOMA = 'it';
const SALIDA = arg('salida', 'scripts/.cache/voz/marcas');
const SILABAS = 4;          // dis-ci-pu-lum
const OBJETIVO = 2;         // la que el latín acentúa

const CANDIDATAS = [
  { id: 'base', texto: 'discipulum', tipo: 'referencia', espero: 'falla',
    que: 'sin marca: el motor debería poner el pico en la 3' },
  { id: 'grave', texto: 'discìpulum', tipo: 'desobedecer', espero: 'gana',
    que: 'tilde grave — ya medida: sube la 2 a 0,868 pero no gana' },
  { id: 'aguda', texto: 'discípulum', tipo: 'desobedecer', espero: 'gana',
    que: 'tilde aguda, por si el motor la lee distinto de la grave' },
  { id: 'doble', texto: 'disciipulum', tipo: 'desobedecer', espero: 'gana',
    que: 'vocal doblada: alarga la sílaba en vez de marcarla' },
  { id: 'guiones', texto: 'dis-cì-pu-lum', tipo: 'desobedecer', espero: 'gana',
    que: 'guiones silábicos más tilde' },
  { id: 'corte-espacio', texto: 'discipu lum', tipo: 'dar-la-razon', espero: 'gana',
    que: 'parte la palabra: el motor ve «discipu», cuya penúltima ES la que el latín quiere' },
  { id: 'corte-guion', texto: 'discipu-lum', tipo: 'dar-la-razon', espero: 'gana',
    que: 'lo mismo con guion, por si el espacio mete pausa' },
  { id: 'mayuscula', texto: 'disCIpulum', tipo: 'desobedecer', espero: 'FALLA',
    que: 'CONTROL NEGATIVO: apuesto a que el motor normaliza mayúsculas antes de la fonología' },
];

const coste = CANDIDATAS.reduce((a, c) => a + c.texto.length * N, 0);
console.log(`plan: ${CANDIDATAS.length} candidatas × ${N} repeticiones = ${coste} caracteres`);
for (const c of CANDIDATAS)
  console.log(`  ${c.id.padEnd(14)} «${c.texto}»${' '.repeat(Math.max(0, 15 - c.texto.length))} [${c.tipo}] espero: ${c.espero}  — ${c.que}`);
console.log('\numbral declarado: gana si el pico cae en la sílaba 2 en más de la mitad de las repeticiones');
console.log('                  Y su ventaja sobre la siguiente supera el ruido medido en esta tanda');
if (SOLO_PLAN) { console.log('\n--solo-plan: no se ha gastado nada.'); process.exit(0); }
if (!VOZ) { console.error('falta --voz'); process.exit(1); }

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
  if (!r.ok) { console.error(`⚠ http ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(3); }
  fs.writeFileSync(ruta, Buffer.from(await r.arrayBuffer()));
}

for (const c of CANDIDATAS)
  for (let i = 1; i <= N; i++) await generar(c.texto, `${SALIDA}/${c.id}${i}.mp3`);

// ── EL RUIDO DE ESTA TANDA, antes de mirar ninguna candidata ─────────
const base = Array.from({ length: N }, (_, i) => porSilaba(`${SALIDA}/base${i + 1}.mp3`, SILABAS)).filter(Boolean);
const mitad = Math.floor(base.length / 2);
const media = (g, i) => g.reduce((s, e) => s + e[i], 0) / g.length;
const A = base.slice(0, mitad), B = base.slice(mitad);
const ruido = Math.max(...Array.from({ length: SILABAS }, (_, i) => Math.abs(media(A, i) - media(B, i))));
console.log(`\nruido de ESTA tanda (el mismo texto contra sí mismo, ${mitad} contra ${base.length - mitad}): ${ruido.toFixed(4)}`);
console.log('(la tanda anterior dio 0,1138; no se hereda porque puede depender del texto)\n');

const resultados = { voz: VOZ, modelo: MODELO, n: N, ruido, generado: new Date().toISOString(), candidatas: {} };
for (const c of CANDIDATAS) {
  const g = Array.from({ length: N }, (_, i) => porSilaba(`${SALIDA}/${c.id}${i + 1}.mp3`, SILABAS)).filter(Boolean);
  const perfil = Array.from({ length: SILABAS }, (_, i) => media(g, i));
  const votos = new Array(SILABAS).fill(0);
  for (const t of g) votos[t.indexOf(Math.max(...t))]++;
  const orden = perfil.map((v, i) => ({ v, i })).sort((x, y) => y.v - x.v);
  const ventaja = perfil[OBJETIVO - 1] - (orden[0].i === OBJETIVO - 1 ? orden[1].v : orden[0].v);
  const mayoria = votos[OBJETIVO - 1] > N / 2;
  const gana = mayoria && ventaja > ruido;
  resultados.candidatas[c.id] = { ...c, perfil, votos, ventaja, mayoria, gana };
  console.log(`  ${c.id.padEnd(14)} [${perfil.map((v) => v.toFixed(2)).join(' ')}]  votos ${votos.join('/')}  ventaja de la 2: ${ventaja >= 0 ? '+' : ''}${ventaja.toFixed(3)}  →  ${gana ? 'GANA' : 'no'}   (esperaba: ${c.espero})`);
}
fs.writeFileSync(`${SALIDA}/resultados.json`, `${JSON.stringify(resultados, null, 1)}\n`);
console.log(`\n${coste} caracteres gastados · ${SALIDA}/resultados.json`);
