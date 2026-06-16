// scripts/verify-content.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { BLOCKS } from '@/lib/data/curriculum';
import { BLOCKS_DIR, DATA_DIR, TTS_OUTPUT, EXERCISES_PER_LESSON, TYPE_TO_TEMPLATE } from './config';
import {
  ExerciseSchema, GeneratedExerciseSchema,
  StorySchema, DiagnosticSchema,
  type Exercise, type ExerciseType,
} from './lib/zod-schemas';
import { isValidMp3 } from './lib/minimax-tts';
import { textsFor } from './lib/audio-collector';

interface ManifestShape {
  generatedAt: string;
  audioIndex: { br: Record<string, string>; pt: Record<string, string> };
  blocks: Record<string, { exerciseCount: number; audioCount: number }>;
}

const STRICT = process.env.STRICT === '1';

async function fileExists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; }
  catch { return false; }
}

const AUDIO_REQUIRED: Set<ExerciseType> = new Set([
  'flashcard', 'listening', 'translation_es_pt', 'translation_pt_es', 'sentence_construction', 'chunk',
]);

async function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  const manifestPath = path.join(DATA_DIR, 'manifest.json');
  let manifest: ManifestShape;
  try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); }
  catch { errors.push(`Manifest missing or invalid: ${manifestPath}`); finish(); return; }

  // Per-lección expected count derivado de EXERCISES_PER_LESSON.
  const expectedPerLesson = (): number => {
    let total = 0;
    for (const [type, n] of Object.entries(EXERCISES_PER_LESSON)) {
      if (n !== null && TYPE_TO_TEMPLATE[type as ExerciseType] !== null) total += n;
    }
    return total;
  };
  const expected = expectedPerLesson();

  for (const b of BLOCKS) {
    if (b.lessons.length === 0) continue;
    const file = path.join(BLOCKS_DIR, `b${b.id}.json`);
    let exercises: Exercise[];
    try {
      const raw = JSON.parse(await fs.readFile(file, 'utf8')) as unknown[];
      const validated: Exercise[] = [];
      for (let i = 0; i < raw.length; i++) {
        const r = ExerciseSchema.safeParse(raw[i]);
        if (!r.success) {
          errors.push(`b${b.id}.json[${i}]: ${r.error.issues[0]?.message}`);
          continue;
        }
        validated.push(r.data);
      }
      exercises = validated;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        warnings.push(`Block ${b.id} has no generated exercises (b${b.id}.json missing).`);
        continue;
      }
      throw err;
    }

    for (const lesson of b.lessons) {
      const count = exercises.filter(e => e.lessonId === lesson.id).length;
      const msg = `Lesson ${lesson.id}: ${count} exercises generated (expected ~${expected}).`;
      if (count < expected) {
        (STRICT ? errors : warnings).push(msg);
      } else if (count === 0) {
        errors.push(`Lesson ${lesson.id}: ZERO exercises (silent failure).`);
      }
    }

    for (const ex of exercises) {
      // GeneratedExercise: contentHash y audio son invariantes.
      const g = GeneratedExerciseSchema.safeParse(ex);
      if (!g.success) {
        if (AUDIO_REQUIRED.has(ex.type) && !ex.audio) {
          errors.push(`${ex.id} (${ex.type}): audio required but missing.`);
        }
        if (!ex.contentHash) {
          errors.push(`${ex.id}: contentHash missing.`);
        }
      }
      // Si tiene audio, validar que el MP3 existe y es válido.
      if (ex.audio) {
        for (const variant of ['br', 'pt'] as const) {
          const hash = ex.audio[variant].hash;
          const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
          try {
            const stat = await fs.stat(mp3);
            if (stat.size < 1024) {
              errors.push(`${ex.id} (${variant}): audio file ${hash}.mp3 is ${stat.size} bytes (corrupt/truncated).`);
              continue;
            }
            const buf = await fs.readFile(mp3);
            if (!isValidMp3(buf)) {
              errors.push(`${ex.id} (${variant}): audio file ${hash}.mp3 has invalid MP3 magic bytes.`);
            }
          } catch (err) {
            const code = (err as NodeJS.ErrnoException).code;
            if (code === 'ENOENT') {
              errors.push(`${ex.id} (${variant}): missing audio file public/audio/${hash}.mp3`);
            } else {
              throw err;
            }
          }
        }
      }
    }
  }

  // Cross-check manifest audioIndex hashes have real files.
  for (const variant of ['br', 'pt'] as const) {
    for (const [text, hash] of Object.entries(manifest.audioIndex?.[variant] ?? {})) {
      const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
      try {
        const stat = await fs.stat(mp3);
        if (stat.size < 1024) {
          errors.push(`manifest.${variant}["${text.slice(0,30)}..."]: ${hash}.mp3 is ${stat.size} bytes.`);
        }
      } catch {
        errors.push(`manifest.${variant}["${text.slice(0,30)}..."]: missing ${hash}.mp3`);
      }
    }
  }

  // GC report: audios en public/audio/ no referenciados por el contenido actual.
  // No borra automáticamente — solo avisa para que el humano decida.
  const liveHashes = new Set<string>();
  for (const b of BLOCKS) {
    if (b.lessons.length === 0) continue;
    let exercises: Exercise[] = [];
    try {
      const raw = JSON.parse(await fs.readFile(path.join(BLOCKS_DIR, `b${b.id}.json`), 'utf8')) as unknown[];
      exercises = raw.flatMap(e => {
        const r = ExerciseSchema.safeParse(e);
        return r.success ? [r.data] : [];
      });
    } catch { continue; }
    for (const ex of exercises) {
      for (const t of textsFor(ex, 'br')) {
        const h = manifest.audioIndex?.br?.[t];
        if (h) liveHashes.add(h);
      }
      for (const t of textsFor(ex, 'pt')) {
        const h = manifest.audioIndex?.pt?.[t];
        if (h) liveHashes.add(h);
      }
    }
  }
  let orphanCount = 0;
  try {
    const files = await fs.readdir(TTS_OUTPUT);
    for (const f of files) {
      if (!f.endsWith('.mp3')) continue;
      const hash = f.replace(/\.mp3$/, '');
      if (!liveHashes.has(hash)) orphanCount++;
    }
  } catch {}
  if (orphanCount > 0) {
    warnings.push(`GC: ${orphanCount} MP3 file(s) in public/audio/ not referenced by any exercise. Manual cleanup recommended.`);
  }

  // ─── Stories (Plan #3) ────────────────────────────────────────────────
  const storiesDir = path.join(DATA_DIR, 'stories');
  let storyCount = 0;
  try {
    const storyFiles = (await fs.readdir(storiesDir)).filter((f) => /^b\d+-s\d+-.+\.json$/.test(f));
    for (const f of storyFiles) {
      const raw = JSON.parse(await fs.readFile(path.join(storiesDir, f), 'utf-8'));
      const story = StorySchema.parse(raw);
      for (const variant of ['br', 'pt'] as const) {
        const hash = story.variants[variant].audioHash;
        const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
        try {
          const stat = await fs.stat(mp3);
          if (stat.size < 1024) errors.push(`Story ${story.id} (${variant}): audio ${hash}.mp3 is ${stat.size} bytes.`);
        } catch {
          errors.push(`Story ${story.id} (${variant}): missing audio public/audio/${hash}.mp3`);
        }
      }
      for (const v of story.vocab) {
        const brMp3 = path.join(TTS_OUTPUT, `${v.audioHash.br}.mp3`);
        try {
          await fs.stat(brMp3);
        } catch {
          errors.push(`Story ${story.id} vocab ${v.word}: missing BR audio public/audio/${v.audioHash.br}.mp3`);
        }
      }
      storyCount++;
    }
    if (storyCount > 0) console.log(`✓ ${storyCount} stories verified`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }

  // ─── Vocab catalog (Plan #3) ───────────────────────────────────────────
  const catalogFile = path.join(DATA_DIR, 'vocab-catalog.json');
  if (await fileExists(catalogFile)) {
    try {
      const catalog = JSON.parse(await fs.readFile(catalogFile, 'utf-8')) as Array<{ audioHash: { br: string; pt: string } }>;
      console.log(`✓ vocab-catalog.json: ${catalog.length} entries`);
    } catch (err) {
      errors.push(`vocab-catalog.json: ${(err as Error).message}`);
    }
  }

  // ─── Diagnostic (Plan #3) ──────────────────────────────────────────────
  const diagFile = path.join(DATA_DIR, 'diagnostic.json');
  if (await fileExists(diagFile)) {
    try {
      const diag = DiagnosticSchema.parse(JSON.parse(await fs.readFile(diagFile, 'utf-8')));
      const dist: Record<number, number> = {};
      for (const q of diag.questions) dist[q.blockId] = (dist[q.blockId] ?? 0) + 1;
      console.log(`✓ diagnostic.json: ${diag.questions.length} questions (blockId dist: ${JSON.stringify(dist)})`);
    } catch (err) {
      errors.push(`diagnostic.json: ${(err as Error).message}`);
    }
  } else {
    errors.push('diagnostic.json missing (Plan #3 deliverable).');
  }

  finish();
  function finish() {
    if (warnings.length) {
      console.log('\nWARNINGS:');
      warnings.forEach(w => console.log('  ⚠', w));
    }
    if (errors.length) {
      console.log('\nERRORS:');
      errors.forEach(e => console.log('  ✗', e));
      process.exit(1);
    }
    console.log(`\n✓ Verification passed (${warnings.length} warnings, 0 errors, mode: ${STRICT ? 'STRICT' : 'default'}).`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
