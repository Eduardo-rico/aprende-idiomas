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

const OUT = path.join(process.cwd(), 'scratchpad', 'audio-ro-v2');
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

/** La batería v2: el contraste va DENTRO de una frase portadora, y se
 *  puntúa por recuperación exacta de la palabra objetivo. La v1 usaba
 *  palabras aisladas y Whisper small alucinaba en las tres voces («masă» →
 *  «M-a făcut păr», «ghem» → «Kim»): 5/24, 9/24, 7/24 no separaban nada.
 *  Un ASR transcribe frases, no listas de palabras. */
export const BATERIA = [
  // /a/ ~ /ə/ ~ /ɨ/
  { contraste: 'vocales centrales', palabra: 'masa', texto: 'Masa din bucătărie este mare.' },
  { contraste: 'vocales centrales', palabra: 'masă', texto: 'Pe masă este o carte veche.' },
  { contraste: 'vocales centrales', palabra: 'în', texto: 'Copiii sunt în casă acum.' },
  { contraste: 'vocales centrales', palabra: 'rău', texto: 'Nu este rău, este foarte bine.' },
  { contraste: 'vocales centrales', palabra: 'râu', texto: 'Lângă sat curge un râu mare.' },
  { contraste: 'vocales centrales', palabra: 'când', texto: 'Nu știu când vine trenul.' },
  { contraste: 'vocales centrales', palabra: 'pământ', texto: 'Cartoful crește în pământ.' },
  // palatalización final (-i)
  { contraste: 'palatalización final', palabra: 'pom', texto: 'În grădină este un pom bătrân.' },
  { contraste: 'palatalización final', palabra: 'pomi', texto: 'În grădină sunt trei pomi bătrâni.' },
  { contraste: 'palatalización final', palabra: 'lup', texto: 'Un lup singur trece prin pădure.' },
  { contraste: 'palatalización final', palabra: 'lupi', texto: 'Doi lupi trec prin pădure.' },
  { contraste: 'palatalización final', palabra: 'vezi', texto: 'Tu vezi marea de la balcon.' },
  { contraste: 'palatalización final', palabra: 'vede', texto: 'El vede marea de la balcon.' },
  { contraste: 'palatalización final', palabra: 'elevi', texto: 'Cinci elevi așteaptă la ușă.' },
  // ș ț ce ci ge gi che chi ghe ghi
  { contraste: 'consonantes', palabra: 'țară', texto: 'România este o țară frumoasă.' },
  { contraste: 'consonantes', palabra: 'șase', texto: 'Am cumpărat șase mere roșii.' },
  { contraste: 'consonantes', palabra: 'cer', texto: 'Pe cer nu este niciun nor.' },
  { contraste: 'consonantes', palabra: 'chem', texto: 'Te chem mâine la telefon.' },
  { contraste: 'consonantes', palabra: 'ger', texto: 'Afară este ger și zăpadă.' },
  { contraste: 'consonantes', palabra: 'ghem', texto: 'Pisica se joacă cu un ghem de lână.' },
  { contraste: 'consonantes', palabra: 'cheile', texto: 'Am uitat cheile pe masă.' },
  // acento léxico
  { contraste: 'acento', palabra: 'copii', texto: 'Copiii mici sunt veseli.' },
  { contraste: 'acento', palabra: 'veselă', texto: 'Bunica este veselă astăzi.' },
  { contraste: 'acento', palabra: 'copíi', texto: 'Am făcut două copii ale documentului.' },
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

const sinDiacriticos = (s) => norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ș|ş/g, 's').replace(/ț|ţ/g, 't');
const tiene = (tr, palabra, laxo) => {
  const t = laxo ? sinDiacriticos(tr) : norm(tr);
  const w = laxo ? sinDiacriticos(palabra) : norm(palabra);
  return new RegExp(`(?<![\\p{L}])${w.replace(/í/g, 'i')}(?![\\p{L}])`, 'u').test(t.replace(/í/g, 'i'));
};

function puntuar() {
  const tr = JSON.parse(fs.readFileSync(path.join(OUT, 'transcripciones.json'), 'utf8'));
  const ids = JSON.parse(fs.readFileSync(path.join(OUT, 'voces.json'), 'utf8'));
  const contrastes = [...new Set(BATERIA.map((b) => b.contraste))];
  console.log(`# Batería fonética rumana v2 — ASR faster-whisper small, ${BATERIA.length} frases portadoras\n`);
  console.log('Cada celda: palabra objetivo recuperada CON diacríticos / sin diacríticos, sobre N.\n');
  console.log('| voz | ' + contrastes.join(' | ') + ' | total | frase entera exacta |');
  console.log('|---|' + contrastes.map(() => '---:').join('|') + '|---:|---:|');
  const fallos = [];
  for (const clave of Object.keys(ids)) {
    const fila = []; let ok = 0, okLaxo = 0, n = 0, exactas = 0;
    for (const c of contrastes) {
      let a = 0, al = 0, t = 0;
      for (const [i, b] of BATERIA.entries()) {
        if (b.contraste !== c) continue;
        const f = path.basename(clip(clave, i));
        if (!(f in tr)) continue;
        t += 1;
        const estricto = tiene(tr[f], b.palabra, false), laxo = tiene(tr[f], b.palabra, true);
        if (estricto) a += 1; if (laxo) al += 1;
        if (norm(tr[f]) === norm(b.texto)) exactas += 1;
        if (!laxo) fallos.push(`${clave} · ${c}: «${b.palabra}» en «${b.texto}» → ASR «${tr[f]}»`);
      }
      fila.push(t ? `${a}/${al} de ${t}` : '—'); ok += a; okLaxo += al; n += t;
    }
    console.log(`| ${clave} | ${fila.join(' | ')} | **${ok}/${okLaxo} de ${n}** | ${exactas}/${n} |`);
  }
  console.log('\n## Palabra objetivo NO recuperada ni sin diacríticos\n');
  for (const f of fallos) console.log('- ' + f);
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
