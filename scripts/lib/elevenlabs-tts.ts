// scripts/lib/elevenlabs-tts.ts — TTS de ejercicios vía ElevenLabs.
//
// POR QUÉ EXISTE (2026-08-11): la cuenta MiniMax se secó (1008
// insufficient balance) y Edu decidió NO recargarla — el audio nuevo va
// por ElevenLabs, donde vive la cuota del curso (~60,5k créditos al
// decidirse). Las 1.288 grabaciones MiniMax existentes NO se tocan: el
// generador solo llama aquí cuando el clip MiniMax no existe en disco
// (texto nuevo o cambiado). Ver ttsConFallback en generate-audio.ts.
//
// VOCES: la pt es Leonor («Joana»), la narradora aprobada a oído por Edu
// para la serie y el karaoke. Para la variante br NO hay voz brasileña
// en la cuenta (el reparto es PT-PT + Tchize, que es angoleño): los
// clips br salen con Leonor COMO INTERINO, con el nombre de voz marcado
// para poder regenerarlos en cuanto Edu apruebe una voz BR a oído.
//
// El hash incluye provider y modelo: un clip ElevenLabs jamás colisiona
// con el archivo MiniMax del mismo texto.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { hashKey } from './cache';
import { isValidMp3 } from './minimax-tts';
import { TTS_OUTPUT } from '../config';
import { textoParaVoz } from '../../lib/lang/ortografia-la';

const MODEL = 'eleven_multilingual_v2';

export type ElVariant = 'br' | 'pt' | 'ro' | 'la';

// ── EL TEXTO QUE SE ENVÍA NO ES SIEMPRE EL QUE SE MUESTRA ─────────────
//
// En latín hay que transformarlo por DOS razones que se acumulan
// (Paso 0 §3.1 y §3.4):
//
//   · el mácrón: `ā` no existe en la ortografía italiana y el G2P hará
//     algo indefinido con él;
//   · la respelización eclesiástica: `caelum` sólo suena «chélum» si la
//     voz ve `ce`, y `grātia` sólo «grátsia» si ve `tsi`. El italiano no
//     tiene ni `ae` ni la regla de `ti`+vocal, así que **el ejemplo del
//     propio encargo es el que la voz NO produciría sola**.
//
// Y de ahí el requisito que evita las dos eras de ficheros del portugués
// (5.451 MP3 para 2.576 refs): **el hash se calcula sobre el texto
// ENVIADO**. Si se calculara sobre el mostrado, `Rōma` y `Roma` serían
// dos hashes del mismo audio y se pagarían dos clips; y si `generate-audio`
// transformara pero `check-audio-stale` no, todos los clips latinos
// saldrían caducos para siempre y el gate se volvería ilegible.
//
// Por eso la transformación vive AQUÍ, dentro de la función del hash, y
// no en el llamador: los dos caminos la heredan sin que nadie tenga que
// acordarse.
const TEXTO_DE_VOZ: Partial<Record<ElVariant, (s: string) => string>> = {
  la: textoParaVoz,
};

/** El texto que de verdad se manda a la voz. Exportado para que se pueda
 *  probar sin necesidad de tener una voz declarada. */
export function textoDeTts(variant: ElVariant, text: string): string {
  return (TEXTO_DE_VOZ[variant] ?? ((x: string) => x))(text);
}

// `Partial` a propósito, y no por comodidad: **una voz sólo existe cuando
// está validada**. El latín no tiene entrada aquí porque su batería aún
// no se ha corrido, y `generateElevenTts` lanza si se le pide una que no
// esté — que es mejor que una entrada provisional que alguien use sin
// mirar el sello.
export const EL_VOICES: Partial<Record<ElVariant, { id: string; name: string; validatedBy?: string; validatedAt?: string }>> = {
  pt: { id: 'nJ5NFqyKb8kn9JBPmo6i', name: 'ElevenLabs_Leonor', validatedBy: 'oído de Edu', validatedAt: '2026-07' },
  // INTERINO: misma voz que pt hasta que Edu apruebe una BR a oído.
  // El nombre distinto deja los clips localizables para regenerarlos.
  br: { id: 'nJ5NFqyKb8kn9JBPmo6i', name: 'ElevenLabs_Leonor_brInterino' },
  // RUMANO (fase F, 2026-09-01): Răzvan, elegido por la batería fonética
  // v2 (docs/plans/2026-09-01-ro-paso0.md §14): vocales centrales 5/7,
  // palatalización final 6/7, 16/18 de 24 objetivos. El sello dice QUIÉN
  // validó y cómo: un ASR y un agente, no un nativo. Reversible.
  ro: { id: 'jYTnaUiO0yq8mgBlAL89', name: 'ElevenLabs_Razvan', validatedBy: 'ASR faster-whisper small + linguista-adversarial-ro (agente), sin oído nativo', validatedAt: '2026-09-01' },
};

export interface ElTtsRequest {
  text: string;
  variant: ElVariant;
  speed?: number;
}
export interface ElTtsResult { hash: string; cached: boolean; voice: string; }

export function elevenTtsHash(req: ElTtsRequest): string {
  return hashKey({
    provider: 'elevenlabs',
    model: MODEL,
    text: textoDeTts(req.variant, req.text),
    // El id de la voz entra en el hash aunque la voz aún no exista: para
    // el latín es `undefined` hoy y será el id el día que se valide, así
    // que un clip generado con la voz definitiva jamás colisiona con uno
    // hecho antes de tenerla.
    voiceId: EL_VOICES[req.variant]?.id,
    speed: req.speed ?? 1,
  });
}

function requireApiKey(): string {
  const k = process.env.ELEVENLABS_API_KEY;
  if (!k) throw new Error('ELEVENLABS_API_KEY no está en el entorno (source .env.local)');
  return k;
}

export async function generateElevenTts(req: ElTtsRequest): Promise<ElTtsResult> {
  const voice = EL_VOICES[req.variant];
  if (!voice) throw new Error(`no hay voz declarada para «${req.variant}»: ninguna voz entra sin su batería y su sello (validatedBy/validatedAt)`);
  const hash = elevenTtsHash(req);
  const filePath = path.join(TTS_OUTPUT, `${hash}.mp3`);

  try {
    await fs.access(filePath);
    return { hash, cached: true, voice: voice.name };
  } catch { /* no existe: sintetizar */ }

  let lastErr: unknown;
  for (let i = 1; i <= 4; i++) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`, {
        method: 'POST',
        headers: { 'xi-api-key': requireApiKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // EL MISMO texto que el hash. Mandar `req.text` crudo aquí y
          // hashear el transformado hace que la identidad del clip y su
          // contenido discrepen: el fichero diría una cosa y su nombre
          // otra, sin que nada falle.
          text: textoDeTts(req.variant, req.text),
          model_id: MODEL,
          // Los mismos settings del karaoke aprobado (generar-karaoke.mjs),
          // a velocidad de ejercicio.
          voice_settings: { stability: 0.6, similarity_boost: 0.75, speed: req.speed ?? 1 },
        }),
        signal: AbortSignal.timeout(60_000),
      });
      if (res.status === 401 || res.status === 402 || res.status === 422) {
        throw Object.assign(new Error(`ElevenLabs ${res.status}: ${await res.text()}`), { fatal: true });
      }
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!isValidMp3(buf)) throw new Error('ElevenLabs devolvió algo que no es un MP3 válido');
      await fs.mkdir(TTS_OUTPUT, { recursive: true });
      const tmp = `${filePath}.tmp`;
      await fs.writeFile(tmp, buf);
      await fs.rename(tmp, filePath);
      return { hash, cached: false, voice: voice.name };
    } catch (err: any) {
      lastErr = err;
      if (err?.fatal) throw err;
      if (i < 4) await new Promise((r) => setTimeout(r, 900 * i));
    }
  }
  throw lastErr;
}
