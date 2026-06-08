// tests/unit/minimax-tts.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

vi.mock('@/scripts/config', async (orig) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tts-test-'));
  return {
    ...(await orig<any>()),
    TTS_OUTPUT: tmp,
    requireApiKey: () => 'test-key',
  };
});

import { generateTts, isValidMp3, _resetInflight } from '@/scripts/lib/minimax-tts';

const REAL_FETCH = globalThis.fetch;

beforeEach(() => {
  _resetInflight();
  vi.restoreAllMocks();
});
afterEach(() => {
  globalThis.fetch = REAL_FETCH;
});

function mockFetchOnce(responder: (url: string, init: any) => Promise<Response> | Response) {
  globalThis.fetch = vi.fn(((url: any, init: any) => responder(url, init)) as any) as any;
}

function mp3Hex(): string {
  // 64KB of zeros, prefixed with ID3v2 magic (a valid MP3 can start with ID3).
  // We just need enough bytes that isValidMp3() considers it a real MP3.
  const id3 = Buffer.from('ID3', 'utf8');
  const body = Buffer.alloc(64 * 1024, 0xAB);
  return Buffer.concat([id3, body]).toString('hex');
}

describe('generateTts', () => {
  it('throws on non-200 response', async () => {
    mockFetchOnce(async () => new Response('rate limited', { status: 429 }));
    await expect(generateTts({ text: 'oi', voiceId: 'v', variant: 'br' }))
      .rejects.toThrow(/TTS failed \(429\)/);
  });

  it('throws when data.audio is missing', async () => {
    mockFetchOnce(async () => new Response(JSON.stringify({ data: {} }), { status: 200 }));
    await expect(generateTts({ text: 'oi', voiceId: 'v', variant: 'br' }))
      .rejects.toThrow(/TTS missing audio/);
  });

  it('throws when decoded bytes are too small or not a valid MP3', async () => {
    mockFetchOnce(async () => new Response(JSON.stringify({ data: { audio: '00' } }), { status: 200 }));
    await expect(generateTts({ text: 'oi', voiceId: 'v', variant: 'br' }))
      .rejects.toThrow(/invalid MP3/);
  });

  it('writes a valid MP3 to disk and reports cached: false', async () => {
    mockFetchOnce(async () => new Response(JSON.stringify({ data: { audio: mp3Hex() } }), { status: 200 }));
    const r = await generateTts({ text: 'oi', voiceId: 'v', variant: 'br' });
    expect(r.cached).toBe(false);
    expect(fs.existsSync(r.filePath)).toBe(true);
    expect(fs.statSync(r.filePath).size).toBeGreaterThan(1024);
  });

  it('second call with same request returns cached: true and does not call fetch', async () => {
    let calls = 0;
    mockFetchOnce(async () => {
      calls++;
      return new Response(JSON.stringify({ data: { audio: mp3Hex() } }), { status: 200 });
    });
    const a = await generateTts({ text: 'cached-text', voiceId: 'v', variant: 'pt' });
    const b = await generateTts({ text: 'cached-text', voiceId: 'v', variant: 'pt' });
    expect(a.cached).toBe(false);
    expect(b.cached).toBe(true);
    expect(calls).toBe(1);
  });

  it('single-flight: concurrent calls for the same hash make only one fetch', async () => {
    let calls = 0;
    mockFetchOnce(async () => {
      calls++;
      await new Promise(r => setTimeout(r, 50));
      return new Response(JSON.stringify({ data: { audio: mp3Hex() } }), { status: 200 });
    });
    const req = { text: 'inflight', voiceId: 'v', variant: 'br' as const };
    const [a, b] = await Promise.all([generateTts(req), generateTts(req)]);
    expect(calls).toBe(1);
    expect(a.hash).toBe(b.hash);
  });
});

describe('isValidMp3', () => {
  it('accepts ID3 header', () => {
    const buf = Buffer.concat([Buffer.from('ID3', 'utf8'), Buffer.alloc(2048, 0)]);
    expect(isValidMp3(buf)).toBe(true);
  });
  it('accepts MPEG frame sync (0xFF 0xFB)', () => {
    const buf = Buffer.concat([Buffer.from([0xFF, 0xFB, 0x90]), Buffer.alloc(2048, 0)]);
    expect(isValidMp3(buf)).toBe(true);
  });
  it('rejects too-small buffer', () => {
    expect(isValidMp3(Buffer.alloc(10))).toBe(false);
  });
  it('rejects wrong magic', () => {
    const buf = Buffer.alloc(2048, 0xAB);
    expect(isValidMp3(buf)).toBe(false);
  });
});
