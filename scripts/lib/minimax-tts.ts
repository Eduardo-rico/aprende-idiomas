// scripts/lib/minimax-tts.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { TTS_MODEL, TTS_URL, TTS_OUTPUT, requireApiKey } from '@/scripts/config';
import { hashKey } from './cache';

export interface TtsRequest {
  text: string;
  voiceId: string;
  variant: 'br' | 'pt';
  speed?: number;
}

export interface TtsResult {
  hash: string;
  filePath: string;
  cached: boolean;
}

export function ttsHash(req: TtsRequest): string {
  return hashKey({
    text: req.text,
    voiceId: req.voiceId,
    variant: req.variant,
    speed: req.speed ?? 1,
    model: TTS_MODEL,
  });
}

// language_boost: 'Portuguese' para BR, 'Portuguese (Portugal)' para PT.
// Verificado en Task 19 probe — si MiniMax no acepta el string específico,
// caemos al genérico y lo documentamos.
function languageBoost(variant: 'br' | 'pt'): string {
  return variant === 'pt' ? 'Portuguese (Portugal)' : 'Portuguese';
}

// Valida que un buffer es un MP3 razonable: >= 1KB y empieza con magic
// ID3v2 ('ID3') o MPEG frame sync (0xFF 0xFB/0xFA/0xF3/0xF2).
export function isValidMp3(buf: Buffer): boolean {
  if (buf.length < 1024) return false;
  const b0 = buf[0];
  const b1 = buf[1];
  const b2 = buf[2];
  if (b0 === 0x49 && b1 === 0x44 && b2 === 0x33) return true; // 'ID3'
  if (b0 === 0xFF && b1 !== undefined && (b1 & 0xE0) === 0xE0) return true; // MPEG sync
  return false;
}

// Single-flight: si dos workers piden el mismo hash, solo uno hace fetch.
// Evita race en el `.tmp + rename` cuando dos workers ven el archivo ausente.
const inflight = new Map<string, Promise<TtsResult>>();
export function _resetInflight(): void { inflight.clear(); }

async function fetchAndStore(hash: string, filePath: string, body: object): Promise<TtsResult> {
  const res = await withBackoff(() => fetch(TTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  }));

  if (!res.ok) {
    throw new Error(`TTS failed (${res.status}): ${await res.text()}`);
  }
  const json = await res.json() as { data?: { audio?: string }; base_resp?: { status_msg?: string } };
  const hex = json.data?.audio;
  if (!hex) {
    throw new Error(`TTS missing audio in response: ${JSON.stringify(json.base_resp ?? json).slice(0, 300)}`);
  }

  const buf = Buffer.from(hex, 'hex');
  if (!isValidMp3(buf)) {
    throw new Error(
      `TTS returned invalid MP3 (length=${buf.length}, head=${buf.slice(0, 4).toString('hex')}). ` +
      `Refusing to write ${filePath}.`
    );
  }

  await fs.mkdir(TTS_OUTPUT, { recursive: true });
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, filePath);

  return { hash, filePath, cached: false };
}

export async function generateTts(req: TtsRequest): Promise<TtsResult> {
  const hash = ttsHash(req);
  const filePath = path.join(TTS_OUTPUT, `${hash}.mp3`);

  // Cache hit
  try {
    await fs.access(filePath);
    return { hash, filePath, cached: true };
  } catch {
    // not cached
  }

  // Single-flight
  const existing = inflight.get(hash);
  if (existing) return existing;

  const body = {
    model: TTS_MODEL,
    text: req.text,
    stream: false,
    voice_setting: {
      voice_id: req.voiceId,
      speed: req.speed ?? 1,
      vol: 1,
      pitch: 0,
    },
    audio_setting: {
      sample_rate: 32000,
      bitrate: 128000,
      format: 'mp3',
      channel: 1,
    },
    language_boost: languageBoost(req.variant),
    output_format: 'hex',
  };

  const promise = fetchAndStore(hash, filePath, body)
    .finally(() => inflight.delete(hash));
  inflight.set(hash, promise);
  return promise;
}

async function withBackoff<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const status = err?.status ?? (err?.message?.match(/TTS failed \((\d+)\)/)?.[1] | 0);
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err; // 4xx (except 429) → fail fast
      }
      if (i === attempts - 1) break;
      const retryAfter = err?.headers?.['retry-after'] ? Number(err.headers['retry-after']) * 1000 : 0;
      const base = 1000 * Math.pow(2, i);
      const jitter = Math.random() * 500;
      const delay = Math.max(retryAfter, base + jitter);
      await new Promise(r => setTimeout(r, Math.min(delay, 30_000)));
    }
  }
  throw lastErr;
}
