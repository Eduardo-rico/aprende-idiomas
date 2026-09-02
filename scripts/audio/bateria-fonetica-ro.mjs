// scripts/audio/bateria-fonetica-ro.mjs — LA VOZ RUMANA, validada por un
// segundo camino que no oye: ASR.
//
//   export ELEVENLABS_API_KEY=$(grep ELEVENLABS_API_KEY .env.local | cut -d= -f2)
//   node scripts/audio/bateria-fonetica-ro.mjs --generar     # TTS de la batería (gasta créditos)
//   node scripts/audio/bateria-fonetica-ro.mjs --transcribir # whisper local sobre los clips
//   node scripts/audio/bateria-fonetica-ro.mjs --puntuar     # tabla por contraste y por voz
//
// Por qué así (decisión del coordinador, 2026-09-01): el agente NO oye. Lo
// que puede hacer es sintetizar una batería de contrastes y pasar cada
// clip por un ASR INDEPENDIENTE del TTS (faster-whisper, local, sin
// cuota): si la voz no realiza la palatalización final o la /ɨ/, el ASR
// devuelve otra palabra. Es evidencia más débil que un oído nativo y se
// sella como tal —`validatedBy: 'ASR whisper-<modelo> + linguista-
// adversarial-ro (agente), sin oído nativo'`— pero es MÁS de la que el
// portugués tuvo nunca.
//
// El gate se ve EN ROJO antes de creerle (--rojo): un clip de la voz
// portuguesa (Leonor) leyendo rumano, y un clip comparado contra el texto
// EQUIVOCADO. Si eso también «pasa», el ASR no mide nada.
//
// Se puntúa POR CONTRASTE, no en global: una voz puede clavar ș/ț y
// fallar la /ɨ/, y eso es lo que hay que saber.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OUT = path.join(process.cwd(), 'scratchpad', 'audio-ro');
const KEY = process.env.ELEVENLABS_API_KEY;
const MODEL = 'eleven_multilingual_v2';
const WHISPER_PY = '/Volumes/Edu/whisper-venv/bin/python';
const WHISPER_MODEL = process.env.WHISPER_MODEL ?? 'medium';

/** Voces candidatas: las dos que ya están en la cuenta (masculinas) y una
 *  femenina estándar de la biblioteca. Los ids se resuelven por nombre en
 *  /v1/voices, para no copiar prefijos. */
export const CANDIDATAS = [
  { clave: 'alex-max', nombre: /^Alex Max/ },
  { clave: 'razvan', nombre: /^Răzvan|^Razvan/ },
  { clave: 'eva', nombre: /^Eva - Calm/, biblioteca: 'EpCJUPBm' },
];
/** La voz portuguesa: el caso que DEBE fallar. */
const LEONOR = /^Leonor/;

/** La batería: cada entrada es un contraste con su texto exacto. */
export const BATERIA = [
  // /a/ ~ /ə/ ~ /ɨ/
  { contraste: 'vocales centrales', texto: 'masa' }, { contraste: 'vocales centrales', texto: 'masă' },
  { contraste: 'vocales centrales', texto: 'in' }, { contraste: 'vocales centrales', texto: 'în' },
  { contraste: 'vocales centrales', texto: 'rău' }, { contraste: 'vocales centrales', texto: 'râu' },
  { contraste: 'vocales centrales', texto: 'Casa și masa sunt în sat.' },
  // palatalización final (-i)
  { contraste: 'palatalización final', texto: 'pom' }, { contraste: 'palatalización final', texto: 'pomi' },
  { contraste: 'palatalización final', texto: 'lup' }, { contraste: 'palatalización final', texto: 'lupi' },
  { contraste: 'palatalización final', texto: 'vezi' }, { contraste: 'palatalización final', texto: 'vede' },
  { contraste: 'palatalización final', texto: 'Doi lupi și trei pomi.' },
  // ș ț ce ci ge gi che chi ghe ghi
  { contraste: 'consonantes', texto: 'țară' }, { contraste: 'consonantes', texto: 'șase' },
  { contraste: 'consonantes', texto: 'cer' }, { contraste: 'consonantes', texto: 'chem' },
  { contraste: 'consonantes', texto: 'ger' }, { contraste: 'consonantes', texto: 'ghem' },
  { contraste: 'consonantes', texto: 'Cinci cești și șapte chei.' },
  // acento léxico
  { contraste: 'acento', texto: 'copii' }, { contraste: 'acento', texto: 'veselă' },
  { contraste: 'acento', texto: 'Copiii sunt veseli.' },
];

const norm = (s) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const clip = (voz, i) => path.join(OUT, `${voz}-${String(i).padStart(2, '0')}.mp3`);

async function voces() {
  const r = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': KEY } });
  if (!r.ok) throw new Error(`voices: ${r.status}`);
  return (await r.json()).voices;
}

async function tts(voiceId, texto, destino) {
  if (fs.existsSync(destino)) return 'cache';
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text: texto, model_id: MODEL, language_code: 'ro', voice_settings: { stability: 0.6, similarity_boost: 0.75 } }),
  });
  if (!r.ok) throw new Error(`tts ${voiceId}: ${r.status} ${await r.text()}`);
  fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
  return 'nuevo';
}

async function generar() {
  if (!KEY) throw new Error('ELEVENLABS_API_KEY no está en el entorno');
  fs.mkdirSync(OUT, { recursive: true });
  const todas = await voces();
  const ids = {};
  for (const c of CANDIDATAS) {
    const v = todas.find((x) => c.nombre.test(x.name));
    if (v) ids[c.clave] = v.voice_id;
    else if (c.biblioteca) {
      // Una voz de la biblioteca hay que añadirla a la cuenta antes de usarla.
      const s = await fetch(`https://api.elevenlabs.io/v1/shared-voices?search=${encodeURIComponent('Eva')}&language=ro&page_size=5`, { headers: { 'xi-api-key': KEY } });
      const hit = (await s.json()).voices?.find((x) => x.voice_id.startsWith(c.biblioteca));
      if (!hit) { console.log(`⚠ ${c.clave}: no encontrada en la biblioteca`); continue; }
      const add = await fetch(`https://api.elevenlabs.io/v1/voices/add/${hit.public_owner_id}/${hit.voice_id}`, { method: 'POST', headers: { 'xi-api-key': KEY, 'content-type': 'application/json' }, body: JSON.stringify({ new_name: hit.name }) });
      if (!add.ok) { console.log(`⚠ ${c.clave}: no se pudo añadir (${add.status}) — se queda fuera`); continue; }
      ids[c.clave] = (await add.json()).voice_id;
    }
  }
  const leonor = todas.find((x) => LEONOR.test(x.name));
  if (leonor) ids['leonor-pt'] = leonor.voice_id;
  console.log('voces:', ids);
  let nuevos = 0, chars = 0;
  for (const [clave, id] of Object.entries(ids)) {
    const lista = clave === 'leonor-pt' ? BATERIA.filter((_, i) => i % 4 === 0) : BATERIA; // Leonor: sólo 6 clips, es el caso rojo
    for (const [i, b] of BATERIA.entries()) {
      if (!lista.includes(b)) continue;
      const r = await tts(id, b.texto, clip(clave, i));
      if (r === 'nuevo') { nuevos += 1; chars += b.texto.length; }
    }
  }
  fs.writeFileSync(path.join(OUT, 'voces.json'), JSON.stringify(ids, null, 2));
  console.log(`generados ${nuevos} clips nuevos · ${chars} caracteres`);
}

function transcribir() {
  const py = `
import sys, json, glob, os
from faster_whisper import WhisperModel
m = WhisperModel(${JSON.stringify(WHISPER_MODEL)}, device="cpu", compute_type="int8")
out = {}
for f in sorted(glob.glob(os.path.join(${JSON.stringify(OUT)}, "*.mp3"))):
    segs, info = m.transcribe(f, language="ro", beam_size=5, vad_filter=False)
    out[os.path.basename(f)] = " ".join(s.text for s in segs).strip()
    print(os.path.basename(f), "→", out[os.path.basename(f)], file=sys.stderr)
json.dump(out, open(os.path.join(${JSON.stringify(OUT)}, "transcripciones.json"), "w"), ensure_ascii=False, indent=2)
`;
  const r = spawnSync(WHISPER_PY, ['-c', py], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('whisper falló');
}

function puntuar() {
  const tr = JSON.parse(fs.readFileSync(path.join(OUT, 'transcripciones.json'), 'utf8'));
  const ids = JSON.parse(fs.readFileSync(path.join(OUT, 'voces.json'), 'utf8'));
  const contrastes = [...new Set(BATERIA.map((b) => b.contraste))];
  console.log(`# Batería fonética rumana — ASR faster-whisper ${WHISPER_MODEL}, ${BATERIA.length} cadenas\n`);
  console.log('| voz | ' + contrastes.join(' | ') + ' | total |');
  console.log('|---|' + contrastes.map(() => '---:').join('|') + '|---:|');
  const fallos = [];
  for (const clave of Object.keys(ids)) {
    const fila = [];
    let ok = 0, n = 0;
    for (const c of contrastes) {
      let a = 0, t = 0;
      for (const [i, b] of BATERIA.entries()) {
        if (b.contraste !== c) continue;
        const f = path.basename(clip(clave, i));
        if (!(f in tr)) continue;
        t += 1;
        if (norm(tr[f]) === norm(b.texto)) a += 1; else fallos.push(`${clave} · ${c}: «${b.texto}» → ASR «${tr[f]}»`);
      }
      fila.push(t ? `${a}/${t}` : '—'); ok += a; n += t;
    }
    console.log(`| ${clave} | ${fila.join(' | ')} | **${ok}/${n}** |`);
  }
  console.log('\n## Fallos, uno a uno\n');
  for (const f of fallos) console.log('- ' + f);
  // EL CASO ROJO: contra el texto equivocado, cualquier voz tiene que fallar.
  const cualquiera = Object.keys(tr)[0];
  if (cualquiera) {
    const equivocado = 'Bună ziua, ce mai faceți?';
    console.log(`\nRojo: «${tr[cualquiera]}» contra el texto equivocado «${equivocado}» → ${norm(tr[cualquiera]) === norm(equivocado) ? '¡PASA! el ASR no mide nada' : 'falla, como debe'}`);
  }
}

const modo = process.argv[2];
if (modo === '--generar') await generar();
else if (modo === '--transcribir') transcribir();
else if (modo === '--puntuar') puntuar();
else { console.log('uso: --generar | --transcribir | --puntuar'); process.exit(2); }
