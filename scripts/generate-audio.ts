// scripts/generate-audio.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';
import { BLOCKS, getBlock } from '@/lib/data/curriculum';
import {
  BLOCKS_DIR, DATA_DIR, TTS_CONCURRENCY, TTS_DELAY_MS, VOICES, DEFAULT_VOICE,
  TTS_MODEL, LLM_MODEL,
} from './config';
import { collectAudioJobs, textsFor } from './lib/audio-collector';
import { generateTts } from './lib/minimax-tts';
import { hashKey, normalizeForHash } from './lib/cache';
import { ExerciseSchema, type Exercise } from './lib/zod-schemas';

const PROJECT_ROOT = process.cwd();

interface CliArgs { block?: number; force: boolean; }
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let block: number | undefined;
  let force = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--block') { block = Number(args[++i]); }
    else if (args[i] === '--force') { force = true; }
  }
  return { block, force };
}

async function loadBlockExercises(blockId: number): Promise<Exercise[]> {
  const file = path.join(BLOCKS_DIR, `b${blockId}.json`);
  const raw = await fs.readFile(file, 'utf8');
  const parsed = JSON.parse(raw) as unknown[];
  return parsed.map((e, i) => {
    const r = ExerciseSchema.safeParse(e);
    if (!r.success) throw new Error(`b${blockId}.json[${i}]: ${r.error.issues[0]?.message}`);
    return r.data;
  });
}

/** Per-block lockfile via mkdir+rmdir (atomic on POSIX). Prevents concurrent runs corrupting b1.json. */
async function withBlockLock<T>(blockId: number, fn: () => Promise<T>): Promise<T> {
  const lockDir = path.join(BLOCKS_DIR, `.b${blockId}.json.lock`);
  while (true) {
    try {
      await fs.mkdir(lockDir);
      break;
    } catch (err: any) {
      if (err?.code !== 'EEXIST') throw err;
      await new Promise(r => setTimeout(r, 100));
    }
  }
  try {
    return await fn();
  } finally {
    await fs.rmdir(lockDir);
  }
}

async function main() {
  const { block, force } = parseArgs();
  const targets = block ? [getBlock(block)] : BLOCKS;
  const limit = pLimit(TTS_CONCURRENCY);

  const audioIndex: Record<'br' | 'pt', Record<string, string>> = { br: {}, pt: {} };
  const manifestBlocks: Record<string, { exerciseCount: number; audioCount: number }> = {};

  for (const b of targets) {
    if (b.lessons.length === 0) continue;

    await withBlockLock(b.id, async () => {
      let exercises: Exercise[];
      try {
        exercises = await loadBlockExercises(b.id);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          console.log(`Block ${b.id} has no generated content yet — skipping.`);
          return;
        }
        throw err;
      }

      const jobs = collectAudioJobs(exercises);
      console.log(`\n=== Block ${b.id}: ${jobs.length} audio jobs ===`);

      // allSettled: 1 fallo no mata los otros 599 jobs.
      // TTS_DELAY_MS entre requests para evitar RPM rate limit (código 1002).
      let done = 0;
      const settled = await Promise.allSettled(jobs.map(j => limit(async () => {
        const voice = VOICES[j.variant][DEFAULT_VOICE];
        if (TTS_DELAY_MS > 0 && done > 0) await new Promise(r => setTimeout(r, TTS_DELAY_MS));
        const result = await generateTts({ text: j.text, voiceId: voice, variant: j.variant });
        done++;
        if (done % 20 === 0) console.log(`  progress: ${done}/${jobs.length}`);
        return { ...j, ...result, voice };
      })));

      const successes: Array<{ text: string; variant: 'br' | 'pt'; hash: string; voice: string; cached: boolean }> = [];
      const failures: Array<{ text: string; variant: string; reason: string }> = [];
      settled.forEach((r, i) => {
        const j = jobs[i]!;
        if (r.status === 'fulfilled') {
          successes.push(r.value);
        } else {
          failures.push({ text: j.text, variant: j.variant, reason: String(r.reason?.message ?? r.reason) });
        }
      });

      // Build a Map<string, TtsResult> for O(1) lookup in the attach loop.
      // Map value type: only fields we actually use (hash + voice + variant).
      // TtsResult includes filePath which is not needed here; the success
      // record from the allSettled block doesn't carry filePath either.
      type AttachInfo = { hash: string; voice: string; variant: 'br' | 'pt' };
      const audioMap = new Map<string, AttachInfo>();
      for (const s of successes) audioMap.set(`${s.variant}::${s.text}`, s);

      // Attach audio refs. Reuse textsFor directly (no second collectAudioJobs call).
      let audioAttachedCount = 0;
      for (const ex of exercises) {
        const brText = textsFor(ex, 'br')[0];
        const ptText = textsFor(ex, 'pt')[0];
        if (!brText || !ptText) continue;
        const brR = audioMap.get(`br::${brText}`);
        const ptR = audioMap.get(`pt::${ptText}`);
        if (brR && ptR) {
          ex.audio = {
            br: { hash: brR.hash, voice: brR.voice },
            pt: { hash: ptR.hash, voice: ptR.voice },
          };
          // Recompute contentHash post-audio-attach so SRS keys on post-generated state.
          ex.contentHash = hashKey(normalizeForHash({
            type: ex.type, data: ex.data, ptOverrides: ex.ptOverrides, esContrast: ex.esContrast,
          }));
          audioAttachedCount++;
        }
      }

      // Persist updated exercises with audio refs. ATOMIC.
      const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
      const tmp = `${file}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(exercises, null, 2) + '\n', 'utf8');
      await fs.rename(tmp, file);

      // Update in-memory audioIndex for the manifest.
      for (const s of successes) {
        audioIndex[s.variant][s.text] = s.hash;
      }
      manifestBlocks[String(b.id)] = { exerciseCount: exercises.length, audioCount: jobs.length };
      const cachedCount = successes.filter(s => s.cached).length;
      console.log(`Block ${b.id}: ${successes.length} ok, ${failures.length} failed, audio attached: ${audioAttachedCount}, cached: ${cachedCount}`);
      if (failures.length > 0) {
        const logFile = path.join(BLOCKS_DIR, `b${b.id}.audio-failures.json`);
        await fs.writeFile(logFile, JSON.stringify(failures, null, 2));
        console.log(`  Failures: ${path.relative(process.cwd(), logFile)}`);
      }
    });
  }

  // Manifest con GC: podar entries del audioIndex que no estén en el contenido actual.
  const manifestPath = path.join(DATA_DIR, 'manifest.json');
  let prev: any = {};
  try { prev = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}

  // Construir set de textos usados en el contenido actual (de los bloques que regeneramos).
  const liveTexts = { br: new Set<string>(), pt: new Set<string>() };
  for (const b of targets) {
    if (b.lessons.length === 0) continue;
    let exercises: Exercise[] = [];
    try { exercises = await loadBlockExercises(b.id); } catch { continue; }
    for (const ex of exercises) {
      for (const t of textsFor(ex, 'br')) liveTexts.br.add(t);
      for (const t of textsFor(ex, 'pt')) liveTexts.pt.add(t);
    }
  }

  // Reconstruir audioIndex de los bloques regenerados: solo entradas vivas.
  const cleanIndex = { br: {} as Record<string, string>, pt: {} as Record<string, string> };
  for (const v of ['br', 'pt'] as const) {
    for (const [text, hash] of Object.entries(audioIndex[v])) {
      if (liveTexts[v].has(text)) cleanIndex[v][text] = hash;
    }
  }
  // Para bloques NO regenerados, conservar las entries vivas del manifest previo.
  const targetIds = new Set(targets.map(b => String(b.id)));
  for (const v of ['br', 'pt'] as const) {
    const prevIdx: Record<string, string> = prev.audioIndex?.[v] ?? {};
    for (const [text, hash] of Object.entries(prevIdx)) {
      // Conservar solo si NO estamos regenerando su bloque y el texto sigue vivo.
      if (liveTexts[v].has(text) && !Object.keys(audioIndex[v]).includes(text)) {
        cleanIndex[v][text] = hash;
      }
    }
  }
  void targetIds; // suprimido: el check de "no regenerar" ya se aplica arriba

  // Determinar si el manifest cambia. Si no, preservar generatedAt.
  const newManifest = {
    modelText: LLM_MODEL,
    modelTts: TTS_MODEL,
    voices: VOICES,
    blocks: { ...(prev.blocks ?? {}), ...manifestBlocks },
    audioIndex: cleanIndex,
  };
  const prevComparable = { ...prev };
  delete prevComparable.generatedAt;
  const changed = JSON.stringify(prevComparable) !== JSON.stringify(newManifest);
  const finalManifest = {
    generatedAt: changed ? new Date().toISOString() : (prev.generatedAt ?? new Date().toISOString()),
    ...newManifest,
  };
  const tmp = `${manifestPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(finalManifest, null, 2) + '\n', 'utf8');
  await fs.rename(tmp, manifestPath);
  console.log(`\nManifest ${changed ? 'updated' : 'unchanged'}: ${path.relative(process.cwd(), manifestPath)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
