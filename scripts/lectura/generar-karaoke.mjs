// Genera una lectura karaoke: audio + tiempos por palabra.
//
// Requisito de Edu (2026-07-29): «que haya la posibilidad de tener el
// texto y que se resalte mientras se escucha, como un karaoke». La vía
// es el endpoint /with-timestamps de ElevenLabs, que devuelve la
// alineación por carácter del audio generado — de ahí salen los tiempos
// por palabra sin alinear nada a mano.
//
// Se genera POR PÁRRAFO: los ficheros quedan pequeños, el lector puede
// empezar en cualquier párrafo, y una petición nunca se acerca al límite
// de la API. La voz es la narradora aprobada (Joana), a speed 0.9 — es
// lectura para aprendices, no audiolibro comercial.
//
// GATE DE PROCEDENCIA (plan maestro, Ola L): el manifiesto exige fuente,
// autor, año de muerte y URL. Sin los cuatro campos, el script no corre.
import fs from 'node:fs';
import path from 'node:path';

const REPO = '/Users/lalo/idiomas/portugues-app';
const KEY = fs.readFileSync(path.join(REPO, '.env.local'), 'utf8')
  .split('\n').find((l) => l.startsWith('ELEVENLABS_API_KEY=')).split('=')[1].trim();

const [, , entrada, salidaDir] = process.argv;
const META = JSON.parse(fs.readFileSync(path.join(path.dirname(entrada), 'meta.json'), 'utf8'));
for (const campo of ['titulo', 'autor', 'muerteAutor', 'fuenteUrl', 'nivel']) {
  if (!META[campo]) { console.error(`meta.json sin «${campo}» — el gate de procedencia no negocia.`); process.exit(1); }
}

fs.mkdirSync(salidaDir, { recursive: true });

// Párrafos: bloques separados por línea en blanco, con las líneas
// internas desenrolladas (el TXT de Gutenberg trae cortes duros a ~70
// columnas que no son puntuación y no deben producir pausas).
const parrafos = fs.readFileSync(entrada, 'utf8')
  .split(/\n\s*\n/)
  .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
  .filter((p) => p.length > 0);

const VOZ = 'nJ5NFqyKb8kn9JBPmo6i'; // Joana — narradora aprobada

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

// Alineación carácter → palabra. La API da un array de caracteres con su
// inicio y fin en segundos; una palabra es una racha de no-espacios, y
// hereda el inicio de su primer carácter y el fin del último.
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
const capitulo = [];

for (const [i, p] of parrafos.entries()) {
  const res = await ttsConTiempos(p);
  const mp3 = `p${String(i).padStart(3, '0')}.mp3`;
  fs.writeFileSync(path.join(salidaDir, mp3), Buffer.from(res.audio_base64, 'base64'));
  const palabras = palabrasDe(p, res.alignment);
  capitulo.push({ mp3, texto: p, palabras });
  totalChars += p.length; totalPalabras += palabras.length;
  process.stdout.write('.');
}

fs.writeFileSync(path.join(salidaDir, 'lectura.json'), JSON.stringify({
  ...META,
  generadoCon: 'eleven_multilingual_v2 + with-timestamps, voz Joana, speed 0.9',
  parrafos: capitulo,
}, null, 1));

console.log(`\n${parrafos.length} párrafos · ${totalPalabras} palabras · ${totalChars} caracteres`);
