// scripts/verify-content.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '@/lib/data/languages/pt/curriculum';
import { BLOCKS_DIR, DATA_DIR, TTS_OUTPUT, EXERCISES_PER_LESSON, TYPE_TO_TEMPLATE } from './config';
import {
  ExerciseInputSchema, GeneratedExerciseSchema,
  StorySchema, DiagnosticSchema,
  type Exercise, type ExerciseType,
} from './lib/zod-schemas';
import { isValidMp3 } from './lib/minimax-tts';
import { parseLangArgs, noopForLang } from './lib/cli';
import { findNonLatin, findNonLatinDeep } from './lib/latin-guard';
import { findEnglishWords, blankCountMismatch } from './lib/content-guard';
import { textsFor } from './lib/audio-collector';

// Deep-collect every string leaf in a value (for per-field bleed checks).
function collectStrings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) for (const x of v) collectStrings(x, out);
  else if (v && typeof v === 'object') for (const x of Object.values(v)) collectStrings(x, out);
  return out;
}

const VALID_CONCEPT_IDS = new Set(ALL_CONCEPTS.map(c => c.id));

// Phase 1: audioIndex es un record libre por VariantKey. El manifest
// existente usa "br" y "pt"; el nuevo manifest usará "pt-br" y "pt-pt".
interface ManifestShape {
  generatedAt: string;
  audioIndex: Record<string, Record<string, string>>;
  blocks: Record<string, { exerciseCount: number; audioCount: number }>;
}

const STRICT = process.env.STRICT === '1';

async function fileExists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; }
  catch { return false; }
}

const AUDIO_REQUIRED: Set<ExerciseType> = new Set([
  'flashcard', 'listening', 'translation', 'sentence_construction', 'chunk',
]);

async function main() {
  const { lang } = parseLangArgs();
  // Phase 5: verify-content solo valida PT. Para scaffolds vacíos
  // (RU/RO/CS) no hay nada que verificar.
  if (lang !== 'pt') {
    console.log(noopForLang(lang, 'verify-content'));
    return;
  }
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
        // ExerciseInputSchema aplica el preprocessor (ptOverrides →
        // variantOverrides["pt-br"], translation_es_pt → translation, etc.)
        const r = ExerciseInputSchema.safeParse(raw[i]);
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
      if (count < expected - 5) {
        (STRICT ? errors : warnings).push(msg);
      } else if (count < expected) {
        warnings.push(`${msg} [short tolerated]`);
      } else if (count === 0) {
        errors.push(`Lesson ${lesson.id}: ZERO exercises (silent failure).`);
      }
    }

    const validLessonIds = new Set(b.lessons.map(l => l.id));

    for (const ex of exercises) {
      for (const cid of ex.concepts ?? []) {
        if (!VALID_CONCEPT_IDS.has(cid)) {
          (STRICT ? errors : warnings).push(
            `${ex.id}: unknown conceptId "${cid}" (not in ALL_CONCEPTS)`
          );
        }
      }
      if (!validLessonIds.has(ex.lessonId)) {
        (STRICT ? errors : warnings).push(
          `${ex.id}: lessonId "${ex.lessonId}" not found in block ${b.id} lessons`
        );
      }

      // GeneratedExercise: contentHash y audio son invariantes.
      const g = GeneratedExerciseSchema.safeParse(ex);
      if (!g.success) {
        // La exención debe ser explícita y motivada (ver `audioExento` en
        // zod-schemas). No se infiere del tipo ni del idioma del texto:
        // una puerta trasera que se abre sola convierte el requisito en
        // decoración.
        if (AUDIO_REQUIRED.has(ex.type) && !ex.audio && !ex.audioExento) {
          errors.push(`${ex.id} (${ex.type}): audio required but missing.`);
        }
        if (ex.audio && ex.audioExento) {
          errors.push(`${ex.id}: declara audioExento y además tiene audio — decide cuál.`);
        }
        if (!ex.contentHash) {
          errors.push(`${ex.id}: contentHash missing.`);
        }
      }
      // Si tiene audio, validar que el MP3 existe y es válido.
      // Phase 1: audio es record libre; iteramos las keys presentes.
      if (ex.audio) {
        for (const variant of Object.keys(ex.audio)) {
          const ref = ex.audio[variant];
          if (!ref) continue;
          const hash = ref.hash;
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

      // ── English-bleed + structural gate (E2) ──────────────────────────
      // Hard error on English words in any string field, EXCEPT audio-bearing
      // fields of exercises that already have recorded audio: their text is
      // locked to the TTS file, so fixing requires regeneration — a warning,
      // deferred to the audio round. Content without audio yet (new 5b output)
      // is strict everywhere, which is the point: catch bleed before TTS.
      let audioStrings = new Set<string>();
      try {
        for (const v of ['pt-br', 'pt-pt'] as const) for (const t of textsFor(ex, v)) audioStrings.add(t);
      } catch { /* malformed override is reported by the schema check above */ }
      const strings = collectStrings(ex.data);
      if (ex.esContrast) strings.push(ex.esContrast);
      for (const s of strings) {
        // Intentional contrastive English glosses are quoted ('will', 'had
        // seen') or parenthetical ((esto/this), (eso/that)). Strip those spans
        // so the gate flags only unquoted running-text bleed ("Eu the dei",
        // "wants to give us a surprise"), not the deliberate trilingual glosses.
        const scanned = s.replace(/\([^)]*\)/g, ' ').replace(/'[^']*'/g, ' ');
        const hits = findEnglishWords(scanned);
        if (!hits.length) continue;
        const locked = !!ex.audio && audioStrings.has(s);
        const msg = `${ex.id}: English bleed: ${[...new Set(hits)].join(' ')}`;
        if (locked) warnings.push(`${msg} [audio-bearing — deferred to audio round]`);
        else errors.push(msg);
      }
      if (blankCountMismatch(ex)) errors.push(`${ex.id}: fill_blank blank/answer count mismatch.`);
    }
  }

  // Cross-check manifest audioIndex hashes have real files.
  for (const variant of Object.keys(manifest.audioIndex ?? {})) {
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
  // Phase 1: iteramos las variantes activas (pt-br/pt-pt) Y las legacy
  // (br/pt) para mantener compat con el manifest existente. El shim en
  // textsFor preserva el comportamiento original para las legacy keys.
  // A file is live if ANY content source references its hash: exercises,
  // stories (+ their vocab), the vocab catalog, lesson example audio
  // (audio-refs.json), or the manifest audioIndex (which the manifest
  // cross-check above requires to have files). Anything else is dead
  // weight left over from regenerated content and is a true orphan.
  const liveHashes = new Set<string>();
  const addHash = (h: unknown) => {
    if (typeof h === 'string' && /^[a-f0-9]{64}$/.test(h)) liveHashes.add(h);
  };
  // Exercises — read the inline audio hash directly (robust to manifest drift).
  for (const b of BLOCKS) {
    if (b.lessons.length === 0) continue;
    let exercises: Exercise[] = [];
    try {
      const raw = JSON.parse(await fs.readFile(path.join(BLOCKS_DIR, `b${b.id}.json`), 'utf8')) as unknown[];
      exercises = raw.flatMap(e => {
        const r = ExerciseInputSchema.safeParse(e);
        return r.success ? [r.data] : [];
      });
    } catch { continue; }
    for (const ex of exercises) {
      const audio = (ex as { audio?: Record<string, { hash?: string }> }).audio;
      for (const v of Object.values(audio ?? {})) addHash(v?.hash);
    }
  }
  // Manifest audioIndex (already validated to have files above).
  for (const idx of Object.values(manifest.audioIndex ?? {})) {
    for (const h of Object.values(idx ?? {})) addHash(h);
  }
  // Stories + story vocab.
  try {
    const sDir = path.join(DATA_DIR, 'stories');
    for (const f of (await fs.readdir(sDir)).filter(x => /^b\d+-s\d+-.+\.json$/.test(x))) {
      const s = JSON.parse(await fs.readFile(path.join(sDir, f), 'utf8'));
      for (const v of Object.values(s.variants ?? {})) addHash((v as { audioHash?: string })?.audioHash);
      for (const w of (s.vocab ?? [])) for (const h of Object.values(w.audioHash ?? {})) addHash(h);
    }
  } catch {}
  // Vocab catalog.
  try {
    const vc = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'vocab-catalog.json'), 'utf8'));
    for (const e of (Array.isArray(vc) ? vc : [])) for (const h of Object.values(e.audioHash ?? {})) addHash(h);
  } catch {}
  // Lesson example audio (audio-refs.json sidecar).
  try {
    const refs = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'lessons', 'audio-refs.json'), 'utf8'));
    for (const entry of Object.values(refs)) {
      for (const arr of Object.values((entry as { audioRefs?: Record<string, Array<{ hash?: string }>> }).audioRefs ?? {})) {
        for (const r of (arr ?? [])) addHash(r?.hash);
      }
    }
  } catch {}

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
    warnings.push(`GC: ${orphanCount} MP3 file(s) in public/audio/ not referenced by any content. Run scripts/gc-audio.mjs --delete to remove.`);
  }

  // ─── Stories (Plan #3) ────────────────────────────────────────────────
  const storiesDir = path.join(DATA_DIR, 'stories');
  let storyCount = 0;
  try {
    const storyFiles = (await fs.readdir(storiesDir)).filter((f) => /^b\d+-s\d+-.+\.json$/.test(f));
    for (const f of storyFiles) {
      const raw = JSON.parse(await fs.readFile(path.join(storiesDir, f), 'utf-8'));
      const story = StorySchema.parse(raw);
      // Phase 1: variants es record libre; iteramos las keys presentes.
      for (const variant of Object.keys(story.variants)) {
        const entry = story.variants[variant];
        if (!entry) continue;
        const hash = entry.audioHash;
        const mp3 = path.join(TTS_OUTPUT, `${hash}.mp3`);
        try {
          const stat = await fs.stat(mp3);
          if (stat.size < 1024) errors.push(`Story ${story.id} (${variant}): audio ${hash}.mp3 is ${stat.size} bytes.`);
        } catch {
          errors.push(`Story ${story.id} (${variant}): missing audio public/audio/${hash}.mp3`);
        }
      }
      for (const v of story.vocab) {
        for (const variant of Object.keys(v.audioHash)) {
          const mp3 = path.join(TTS_OUTPUT, `${v.audioHash[variant]}.mp3`);
          try {
            await fs.stat(mp3);
          } catch {
            errors.push(`Story ${story.id} vocab ${v.word} (${variant}): missing audio public/audio/${v.audioHash[variant]}.mp3`);
          }
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
      const catalog = JSON.parse(await fs.readFile(catalogFile, 'utf-8')) as Array<{ audioHash: Record<string, string> }>;
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

  // ─── Anti-bleed gate ───────────────────────────────────────────────────
  // No content field may contain characters from another writing system
  // (CJK/Cyrillic/…). This is a hard error: the highspeed model leaked these
  // and they must never ship again.
  let bleedHits = 0;
  for (const b of BLOCKS) {
    const f = path.join(BLOCKS_DIR, `b${b.id}.json`);
    if (!(await fileExists(f))) continue;
    try {
      const arr = JSON.parse(await fs.readFile(f, 'utf8'));
      const bad = findNonLatinDeep(arr);
      if (bad.length) { bleedHits++; errors.push(`b${b.id}.json: non-Latin bleed ${[...new Set(bad)].join(' ')}`); }
    } catch { /* parse errors reported elsewhere */ }
  }
  try {
    const sDir = path.join(DATA_DIR, 'stories');
    for (const f of (await fs.readdir(sDir)).filter(x => /^b\d+-s\d+-.+\.json$/.test(x))) {
      const bad = findNonLatinDeep(JSON.parse(await fs.readFile(path.join(sDir, f), 'utf8')));
      if (bad.length) { bleedHits++; errors.push(`story ${f}: non-Latin bleed ${[...new Set(bad)].join(' ')}`); }
    }
  } catch { /* no stories dir */ }
  try {
    const bad = findNonLatinDeep(JSON.parse(await fs.readFile(path.join(DATA_DIR, 'vocab-catalog.json'), 'utf8')));
    if (bad.length) { bleedHits++; errors.push(`vocab-catalog.json: non-Latin bleed ${[...new Set(bad)].join(' ')}`); }
  } catch { /* no catalog */ }
  try {
    const mdxRoot = path.join(DATA_DIR, 'mdx');
    for (const blockDir of await fs.readdir(mdxRoot)) {
      const dir = path.join(mdxRoot, blockDir);
      for (const f of (await fs.readdir(dir)).filter(x => x.endsWith('.mdx'))) {
        const bad = findNonLatin(await fs.readFile(path.join(dir, f), 'utf8'));
        if (bad.length) { bleedHits++; errors.push(`mdx ${blockDir}/${f}: non-Latin bleed ${[...new Set(bad)].join(' ')}`); }
      }
    }
  } catch { /* no mdx dir */ }
  if (bleedHits === 0) console.log('✓ no non-Latin bleed in any content');

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
