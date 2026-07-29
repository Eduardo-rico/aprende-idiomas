// Detector de audio caducado.
//
// Nace de la revisión del 2026-07-29: al corregir «Meu avó» en 4db8fa08
// cambié el target y dejé intactos los audio.hash — o sea que la tarjeta
// EXIGE «O meu avô já morreu» y la grabación DICE el texto viejo. El gate
// de contenido no lo veía: sólo comprueba que el MP3 exista y pese.
//
// La detección es posible porque el nombre del fichero de audio es un
// hash determinista de lo que se grabó: ttsHash({text, voiceId, variant,
// speed, model}). Recalcular ese hash desde el TEXTO ACTUAL del ítem y
// compararlo con el guardado responde exactamente la pregunta que
// importa: ¿la grabación sigue diciendo lo que el ítem dice?
//
// Mismo principio que el resto de las reparaciones de hoy: no confiar en
// que una etiqueta («tiene audio») siga siendo verdad después de editar.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ttsHash } from './lib/minimax-tts';
import { textsFor } from './lib/audio-collector';
import { ExerciseInputSchema, type Exercise } from './lib/zod-schemas';

const BLOCKS = path.join(process.cwd(), 'lib/data/languages/pt/blocks');

// El texto grabado por variante corta. textsFor(ex, variantLarga) devuelve
// los textos audio-portadores del ítem YA RESUELTOS para esa variante —
// la misma función que usa la generación, así que no hay una segunda
// definición de «qué se graba» que pueda divergir.
const VARIANTES = [
  ['br', 'pt-br'],
  ['pt', 'pt-pt'],
] as const;

async function main() {
  const files = (await fs.readdir(BLOCKS)).filter((f) => /^b\d+\.json$/.test(f)).sort();
  let conAudio = 0;
  const caducos: string[] = [];
  const irresolubles: string[] = [];

  for (const f of files) {
    const arr = JSON.parse(await fs.readFile(path.join(BLOCKS, f), 'utf8')) as unknown[];
    for (const raw of arr) {
      const parsed = ExerciseInputSchema.safeParse(raw);
      if (!parsed.success) continue;
      const ex = parsed.data as Exercise & { audio?: Record<string, { hash: string; voice: string }> };
      if (!ex.audio) continue;
      conAudio++;

      for (const [corta, larga] of VARIANTES) {
        const ref = ex.audio[corta];
        if (!ref) continue;
        let textos: string[];
        try {
          textos = textsFor(ex, larga);
        } catch {
          irresolubles.push(`${f} ${ex.id} (${corta}): textsFor falló`);
          continue;
        }
        if (textos.length === 0) continue;
        // El hash guardado debe corresponder a ALGUNO de los textos
        // actuales del ítem con la voz guardada. speed y model son los
        // por defecto del pipeline (speed 1, TTS_MODEL constante).
        const esperados = textos.map((text) =>
          ttsHash({ text, voiceId: ref.voice, variant: corta }),
        );
        if (!esperados.includes(ref.hash)) {
          caducos.push(
            `${f} ${ex.id} (${ex.type}, ${corta}): la grabación no corresponde al texto actual — ` +
            `dice otra cosa que «${textos[0].slice(0, 60)}»`,
          );
        }
      }
    }
  }

  console.log(`ítems con audio: ${conAudio}`);
  if (irresolubles.length) {
    console.log(`\nIRRESOLUBLES (${irresolubles.length}):`);
    for (const s of irresolubles) console.log('  ⚠ ' + s);
  }
  if (caducos.length) {
    console.log(`\nAUDIO CADUCADO (${caducos.length}):`);
    for (const s of caducos) console.log('  ✗ ' + s);
    process.exitCode = 1;
  } else {
    console.log('\nTodo el audio corresponde a su texto actual.');
  }
}
main().catch((e) => { console.error(e); process.exit(2); });
