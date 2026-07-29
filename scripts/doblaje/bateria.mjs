// Batería de aceptación fonética + audición de Aurora.
//
// El skill lo exige para toda voz nueva y aquí entran DIEZ de golpe. La
// frase mete los cuatro contrastes que un hispanohablante no oye y que
// una voz mal elegida destruye:
//
//   cedo : medo   — las dos /e/ cerradas, que el español abre
//   avó : avô     — /ɔ/ frente a /o/, el par mínimo que separa abuela de abuelo
//   os livros dos pastéis — la -s final /ʃ/, tres veces seguidas
//   vamos comer depressa  — reducción de átonas, que es LA marca del PT-PT
//
// Yo no puedo escuchar el resultado. Esto se genera para que lo juzgue
// una persona, y hasta entonces ninguna de las diez voces está aprobada.
import fs from 'node:fs';
import path from 'node:path';

const REPO = '/Users/lalo/idiomas/portugues-app';
const OUT = '/Users/lalo/Desktop/ao-balcao-doblaje/bateria';
const KEY = fs.readFileSync(path.join(REPO, '.env.local'), 'utf8')
  .split('\n').find((l) => l.startsWith('ELEVENLABS_API_KEY=')).split('=')[1].trim();
fs.mkdirSync(OUT, { recursive: true });

const FRASE = 'Cedo e medo. A avó e o avô. Os livros dos pastéis. Vamos comer depressa.';

const NUEVAS = [
  ['iLelOQ6m5mpSeNH8fRob', 'Maria',    'AURORA · VOZ'],
  ['WgE8iWzGVoJYLb5V7l2d', 'Hugo',     'MOTORISTA'],
  ['c0rzOw18hxEhaSybUod2', 'Tiago',    'NICO'],
  ['JGnWZj684pcXmK2SxYIv', 'Claudia',  'VITÓRIA · SÓNIA · FUNCIONÁRIA'],
  ['xwVJ1SoRe0v1T88zEwBN', 'Vicente',  'AUGUSTO'],
  ['bBNhdwrIjl4fcVYiRbT2', 'MartaWC',  'ILDA · MÃE · CIDÁLIA'],
  ['Fij0Q07RV232HQv4oaiV', 'Lourenco', 'LOURENÇO'],
  ['zKjRewuiqTkXNUVAMwat', 'Mariza',   'RITA · RAQUEL'],
  ['a2m6tcgyJTe32Q3VSi6f', 'Bruno',    'BRUNO'],
  ['aLFUti4k8YKvtQGXv0UO', 'Paulo',    'VÍTOR'],
];

// Audición de Aurora. NO hay ninguna voz femenina europea mayor en la
// biblioteca: las siete que existen son young o middle_aged, y Aurora
// tiene setenta y nueve años. Estas son las cuatro salidas reales, la
// última incluida — recastear el personaje como hombre es la única que
// da la edad de verdad, y cuesta dos palabras en el ep. 13.
const AURORA = 'Aurora. Chamo-me Aurora. E não me chames senhora, que ainda não morri.';
const CANDIDATAS = [
  ['iLelOQ6m5mpSeNH8fRob', 'Maria',   'mujer, middle_aged, seria y calma — la elegida por defecto'],
  ['zKjRewuiqTkXNUVAMwat', 'Mariza',  'mujer, young, fría y calma'],
  ['bBNhdwrIjl4fcVYiRbT2', 'MartaWC', 'mujer, middle_aged, cálida'],
  ['xwVJ1SoRe0v1T88zEwBN', 'Vicente', 'hombre, OLD, cálido y rasgado — exige recastear a Aurora como vecino'],
];

async function tts(texto, voz, archivo, speed = 0.95) {
  for (let i = 1; i <= 3; i++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}`, {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: texto, model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
      }),
    });
    if (r.ok) { fs.writeFileSync(path.join(OUT, archivo), Buffer.from(await r.arrayBuffer())); return true; }
    await new Promise((s) => setTimeout(s, 800 * i));
  }
  return false;
}

const meta = { frase: FRASE, lineaAurora: AURORA, bateria: [], aurora: [] };
let chars = 0;

for (const [id, nombre, papeles] of NUEVAS) {
  const f = `bat-${nombre}.mp3`;
  if (await tts(FRASE, id, f)) { meta.bateria.push({ id, nombre, papeles, archivo: f }); chars += FRASE.length; process.stdout.write('.'); }
}
for (const [id, nombre, nota] of CANDIDATAS) {
  const f = `aurora-${nombre}.mp3`;
  if (await tts(AURORA, id, f)) { meta.aurora.push({ id, nombre, nota, archivo: f }); chars += AURORA.length; process.stdout.write('.'); }
}

fs.writeFileSync(path.join(OUT, 'bateria.json'), JSON.stringify(meta, null, 2));
console.log(`\n${meta.bateria.length} baterías + ${meta.aurora.length} candidatas de Aurora · ${chars} caracteres`);
