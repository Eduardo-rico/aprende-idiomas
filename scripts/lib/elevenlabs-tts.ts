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

const MODEL = 'eleven_multilingual_v2';

export type ElVariant = 'br' | 'pt' | 'ro';

export const EL_VOICES: Record<ElVariant, { id: string; name: string; validatedBy?: string; validatedAt?: string }> = {
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
    text: req.text,
    voiceId: EL_VOICES[req.variant].id,
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
          text: req.text,
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
