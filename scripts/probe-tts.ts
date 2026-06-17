// scripts/probe-tts.ts
// Diagnóstico de contratos MiniMax TTS. Se corre una vez al setup; queda como
// herramienta de diagnóstico para re-probar voces cuando cambien modelos.
// NO está en `generate:all`. Se invoca manualmente.
//
// Prerrequisito: `bash scripts/with-env.sh tsx scripts/probe-tts.ts`
//   (with-env.sh carga .env.local y exec tsx con la API key en el entorno).
import { generateTts, isValidMp3 } from './lib/minimax-tts';
import { VOICES, TTS_OUTPUT } from './config';
import { ttsHash } from './lib/minimax-tts';
import path from 'node:path';
import fs from 'node:fs';

const TORTURE = ['Olá, bom dia.', 'mãe', 'pão', 'coração', 'constituição', 'ônibus', 'autocarro'];

async function probeVariant(variant: 'br' | 'pt', which: 'f' | 'm'): Promise<boolean> {
  // Phase 1: VOICES usa keys nuevas; mapeamos a las legacy para probe.
  const voiceKey = variant === 'pt' ? 'pt-pt' : 'pt-br';
  const voiceId = VOICES[voiceKey]?.[which] ?? '';
  console.log(`\n--- ${variant}/${which} (${voiceId}) ---`);
  try {
    for (const text of TORTURE) {
      const r = await generateTts({ text, voiceId, variant });
      const fullPath = path.join(TTS_OUTPUT, `${r.hash}.mp3`);
      const stat = await fs.promises.stat(fullPath);
      console.log(`  "${text}" → ${r.cached ? 'cached' : 'new'} (${stat.size} bytes, hash=${r.hash.slice(0, 8)})`);
      if (stat.size < 1024) {
        console.error(`  ✗ File too small — TTS returned truncated audio`);
        return false;
      }
      if (!isValidMp3(await fs.promises.readFile(fullPath))) {
        console.error(`  ✗ File is not a valid MP3 (wrong magic bytes)`);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error(`  ✗ FAILED: ${(err as Error).message}`);
    return false;
  }
}

async function listAvailableVoices(): Promise<void> {
  console.log('\n--- Available Portuguese voices from /v1/get_voice ---');
  const res = await fetch('https://api.minimax.io/v1/get_voice', {
    headers: { Authorization: `Bearer ${process.env.MINIMAX_API_KEY!}` },
  });
  if (!res.ok) {
    console.error(`get_voice failed: ${res.status}`);
    return;
  }
  const json = await res.json() as any;
  const voices: any[] = json.system_voice ?? json.voices ?? [];
  const ptVoices = voices.filter((v: any) =>
    /portuguese|portugu[eê]s|brazil|brasil/i.test(`${v.voice_name ?? ''} ${v.voice_id ?? ''}`));
  console.log(`Total voices: ${voices.length}, Portuguese: ${ptVoices.length}`);
  for (const v of ptVoices.slice(0, 20)) {
    console.log(`  ${v.voice_id}  (${v.voice_name})`);
  }
}

async function main() {
  await listAvailableVoices();
  const results: Record<string, boolean> = {};
  for (const variant of ['br', 'pt'] as const) {
    for (const which of ['f', 'm'] as const) {
      results[`${variant}/${which}`] = await probeVariant(variant, which);
    }
  }
  console.log('\n=== Probe summary ===');
  for (const [k, v] of Object.entries(results)) {
    console.log(`  ${v ? '✓' : '✗'} ${k}`);
  }
  if (!results['br/f'] || !results['br/m']) {
    console.error('\nFATAL: BR voices missing. Edit scripts/config.ts VOICES.br.');
    process.exit(1);
  }
  if (!results['pt/f'] || !results['pt/m']) {
    console.warn('\nWARN: PT-PT voices missing. Edit scripts/config.ts VOICES.pt to use BR voices (acceptable fallback, will lose accent).');
    // NO exit — the orchestrator can fall back. Document this in VOICES comment.
  }
  void ttsHash; // silence unused
}

main().catch(err => { console.error(err); process.exit(1); });
