// Convierte una lectura YA PUBLICADA del catálogo (modo texto) en
// karaoke, in place: audio por párrafo + tiempos por palabra.
//
// Hermano de generar-karaoke.mjs (que parte de un TXT + meta.json).
// Este parte del JSON del catálogo, que ya pasó el gate de procedencia
// al publicarse — aun así se re-verifica aquí, porque el gate no
// negocia: sin autor, año de muerte, fuente y URL no se dobla nada.
//
//   node scripts/lectura/karaoke-desde-catalogo.mjs <lecturaId>
//   PILOTO=2 node ... <lecturaId>   → solo N párrafos, salida al
//                                     scratchpad, no toca el catálogo.
import fs from 'node:fs';
import path from 'node:path';

const REPO = '/Users/lalo/idiomas/portugues-app';
const KEY = fs.readFileSync(path.join(REPO, '.env.local'), 'utf8')
  .split('\n').find((l) => l.startsWith('ELEVENLABS_API_KEY=')).split('=')[1].trim();

const id = process.argv[2];
if (!id) { console.error('uso: karaoke-desde-catalogo.mjs <lecturaId>'); process.exit(1); }
const PILOTO = process.env.PILOTO ? Number(process.env.PILOTO) : 0;

const rutaJson = path.join(REPO, 'lib/data/languages/pt/lecturas', `${id}.json`);
const lectura = JSON.parse(fs.readFileSync(rutaJson, 'utf8'));

// Gate de procedencia, las DOS vías del plan maestro: dominio público
// (autor muerto + URL de la fuente) u original del curso (constancia de
// la doble revisión adversarial). Sin una de las dos, no se dobla.
const camposVia = lectura.original === true
  ? ['titulo', 'autor', 'revisadoPor', 'fechaRevision', 'fuente', 'nivel']
  : ['titulo', 'autor', 'muerteAutor', 'fuenteUrl', 'nivel'];
for (const campo of camposVia) {
  if (!lectura[campo]) { console.error(`«${id}» sin «${campo}» — el gate de procedencia no negocia.`); process.exit(1); }
}
if (lectura.parrafos.some((p) => typeof p === 'object' && p.mp3)) {
  console.error(`«${id}» ya es karaoke — no se regenera (sería tirar créditos).`); process.exit(1);
}

const parrafos = lectura.parrafos.map((p) => (typeof p === 'string' ? p : p.texto));
const salidaDir = PILOTO
  ? path.join(process.env.SCRATCH ?? '/tmp', `piloto-${id}`)
  : path.join(REPO, 'public/lecturas', id);
fs.mkdirSync(salidaDir, { recursive: true });

const VOZ = 'nJ5NFqyKb8kn9JBPmo6i'; // Joana — narradora aprobada, misma que a-aia

async function ttsConTiempos(texto) {
  for (let i = 1; i <= 4; i++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}/with-timestamps`, {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: texto,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.6, similarity_boost: 0.75, speed: 0.9 },
      }),
    });
    if (r.ok) return r.json();
    if (r.status !== 500 && r.status !== 429) throw new Error(`http ${r.status}: ${(await r.text()).slice(0, 160)}`);
    await new Promise((s) => setTimeout(s, 900 * i));
  }
  throw new Error('agotados los 4 intentos');
}

function palabrasDe(texto, al) {
  const chars = al.characters;
  const ini = al.character_start_times_seconds;
  const fin = al.character_end_times_seconds;
  const palabras = [];
  let w = null;
  for (let i = 0; i < chars.length; i++) {
    if (/\s/.test(chars[i])) { if (w) { palabras.push(w); w = null; } continue; }
    if (!w) w = { t: chars[i], s: ini[i], e: fin[i] };
    else { w.t += chars[i]; w.e = fin[i]; }
  }
  if (w) palabras.push(w);
  return palabras;
}

let totalChars = 0, totalPalabras = 0;
const hechos = [];
const aDoblar = PILOTO ? parrafos.slice(0, PILOTO) : parrafos;

for (const [i, p] of aDoblar.entries()) {
  const res = await ttsConTiempos(p);
  const mp3 = `p${String(i).padStart(3, '0')}.mp3`;
  fs.writeFileSync(path.join(salidaDir, mp3), Buffer.from(res.audio_base64, 'base64'));
  const palabras = palabrasDe(p, res.alignment);
  if (!palabras.length) throw new Error(`párrafo ${i} sin palabras alineadas — no se publica a ciegas`);
  hechos.push({ mp3, texto: p, palabras });
  totalChars += p.length; totalPalabras += palabras.length;
  process.stdout.write('.');
}

if (!PILOTO) {
  const { modo, ...resto } = lectura;
  fs.writeFileSync(rutaJson, JSON.stringify({
    ...resto,
    generadoCon: 'eleven_multilingual_v2 + with-timestamps, voz Joana, speed 0.9',
    parrafos: hechos,
  }, null, 1));
} else {
  fs.writeFileSync(path.join(salidaDir, 'piloto.json'), JSON.stringify(hechos, null, 1));
}

console.log(`\n${id}: ${hechos.length}/${parrafos.length} párrafos · ${totalPalabras} palabras · ${totalChars} caracteres${PILOTO ? ' (PILOTO, catálogo intacto)' : ''}`);
