// scripts/generate-audio.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';
import { blocksDir, dataDir, lessonsDir } from '@/lib/data/registry';
import { BLOCKS, getBlock, type Lesson } from '@/lib/data/languages/pt/curriculum';
import {
  TTS_CONCURRENCY, TTS_DELAY_MS, VOICES, DEFAULT_VOICE,
  TTS_MODEL, LLM_MODEL,
} from './config';
import { collectAudioJobs, lessonExampleTexts, textsFor } from './lib/audio-collector';
import { ttsHash, type TtsRequest } from './lib/minimax-tts';
import { generateElevenTts } from './lib/elevenlabs-tts';
import { hashKey, normalizeForHash } from './lib/cache';
import { TTS_OUTPUT } from './config';

/** Proveedor con memoria histórica (2026-08-11, Edu: «quiero elevenlabs»).
 *
 *  Las 1.288 grabaciones MiniMax existentes se CONSERVAN: si el clip
 *  MiniMax de este texto ya está en disco, se devuelve tal cual (mismo
 *  hash, misma voz en el ref — cero drift, cero llamadas). Sólo lo que
 *  no existe (texto nuevo o cambiado) se sintetiza, y eso va por
 *  ElevenLabs. Nunca cambiar VOICES a voces ElevenLabs "globalmente":
 *  el hash incluye la voz, y eso re-sintetizaría el corpus ENTERO
 *  (~2× 1.288 clips) contra la cuota del curso. */
async function ttsConFallback(
  req: TtsRequest,
): Promise<{ hash: string; cached: boolean; voice: string }> {
  // El corpus tiene DOS eras de archivos MiniMax: la variante del hash
  // estuvo invertida (pt-br→'pt') una temporada, así que el mismo texto
  // puede vivir bajo dos nombres. Ambas son grabaciones correctas del
  // texto (el hash incluye el texto): se acepta la que exista, en ese
  // orden, y sólo si ninguna existe se sintetiza con ElevenLabs.
  const candidatos = [
    ttsHash(req),
    ttsHash({ ...req, variant: req.variant === 'br' ? 'pt' : 'br' }), // era invertida
  ];
  for (const h of candidatos) {
    try {
      await fs.access(path.join(TTS_OUTPUT, `${h}.mp3`));
      return { hash: h, cached: true, voice: req.voiceId };
    } catch { /* siguiente candidato */ }
  }
  return generateElevenTts({ text: req.text, variant: req.variant });
}
import {
  ExerciseInputSchema,
  LessonAudioRefsFileSchema,
  type Exercise,
} from './lib/zod-schemas';
import { parseLangArgs, noopForLang } from './lib/cli';
import type { VariantKey } from '@/lib/data/variant';

// Type for a single lesson example audio ref (mirrors the Zod
// LessonAudioRefSchema — we re-state it here because the schema is
// not exported as a type).
type LessonAudioRef = { hash: string; voice: string };

const PROJECT_ROOT = process.cwd();
// Resolved at runtime inside main() from parseLangArgs().
let BLOCKS_DIR = '';
let DATA_DIR = '';

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
    // ExerciseInputSchema aplica el preprocessor (ptOverrides → variantOverrides,
    // translation_es_pt → translation, etc.).
    const r = ExerciseInputSchema.safeParse(e);
    if (!r.success) throw new Error(`b${blockId}.json[${i}]: ${r.error.issues[0]?.message}`);
    return r.data;
  });
}

/** Per-block lockfile via mkdir+rmdir (atomic on POSIX). Prevents concurrent runs corrupting b1.json.
 *
 *  Un lock huérfano (proceso muerto sin rmdir) bloqueaba esto PARA
 *  SIEMPRE y EN SILENCIO: se encontraron locks fósiles del 22-jun y
 *  30-jun que tuvieron el generador semanas sin correr, sin que nadie
 *  lo supiera (2026-08-11). Ahora: se avisa por consola al esperar, y
 *  un lock con más de 30 min se declara huérfano y se roba. */
const LOCK_STALE_MS = 30 * 60 * 1000;
async function withBlockLock<T>(blockId: number, fn: () => Promise<T>): Promise<T> {
  const lockDir = path.join(BLOCKS_DIR, `.b${blockId}.json.lock`);
  let avisado = false;
  while (true) {
    try {
      await fs.mkdir(lockDir);
      break;
    } catch (err: any) {
      if (err?.code !== 'EEXIST') throw err;
      try {
        const st = await fs.stat(lockDir);
        if (Date.now() - st.mtimeMs > LOCK_STALE_MS) {
          console.warn(`[generate-audio] lock huérfano en b${blockId} (${st.mtime.toISOString()}) — robado`);
          await fs.rmdir(lockDir).catch(() => {});
          continue;
        }
      } catch { /* desapareció entre el mkdir y el stat: reintenta */ }
      if (!avisado) {
        console.warn(`[generate-audio] esperando lock de b${blockId}…`);
        avisado = true;
      }
      await new Promise(r => setTimeout(r, 100));
    }
  }
  try {
    return await fn();
  } finally {
    await fs.rmdir(lockDir);
  }
}

// ─── Lesson audio-refs sidecar (L6) ───────────────────────────────
//
// Merges per-block lesson audio updates into the per-language sidecar
// `lib/data/languages/{lang}/lessons/audio-refs.json`. The schema is
// `Record<lessonId, { blockId, title, exampleCount, audioRefs: Record<VariantKey, LessonAudioRef[]> }>`.
//
// The merge is per-lesson-id and only overwrites entries for the
// lessons in `updates` — other lessons' entries (from other blocks,
// or from previous runs of this block before content changed) are
// preserved. The file is written atomically (.tmp + rename).
export async function mergeAndWriteLessonsAudioRefs(
  lang: import('@/lib/locales').LanguageId,
  updates: Array<{
    lesson: Lesson;
    audioRefs: Record<VariantKey, LessonAudioRef[]>;
  }>,
): Promise<void> {
  const file = path.join(lessonsDir(lang), 'audio-refs.json');
  let prev: Record<string, unknown> = {};
  try {
    const raw = await fs.readFile(file, 'utf8');
    prev = JSON.parse(raw);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
    // ENOENT → start from empty (first run for this language).
  }
  // Validate the previous payload against the schema; if it doesn't
  // parse, log and start fresh (so a malformed sidecar from a manual
  // edit doesn't kill the whole audio run).
  let merged: import('@/lib/data/zod-schemas').LessonAudioRefs;
  try {
    merged = LessonAudioRefsFileSchema.parse(prev);
  } catch (err) {
    console.warn(
      `[generate-audio] Existing audio-refs.json is malformed; rebuilding from updates only. Error: ${(err as Error).message}`,
    );
    merged = {};
  }
  for (const { lesson, audioRefs } of updates) {
    // Pick the first non-empty variant list for exampleCount. If both
    // are empty (TTS failed for every example), exampleCount = 0
    // (the route handler treats this as "no audio" gracefully).
    const exampleCount = Math.max(
      audioRefs['pt-br']?.length ?? 0,
      audioRefs['pt-pt']?.length ?? 0,
    );
    merged[lesson.id] = {
      blockId: lesson.blockId,
      title: lesson.name,
      exampleCount,
      audioRefs,
    };
  }
  // Re-validate after merge so a malformed `updates` entry fails loud.
  const validated = LessonAudioRefsFileSchema.parse(merged);
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(validated, null, 2) + '\n', 'utf8');
  await fs.rename(tmp, file);
  console.log(
    `[generate-audio] Wrote ${updates.length} lesson entries → ${path.relative(process.cwd(), file)}`,
  );
}

async function main() {
  const { lang } = parseLangArgs();
  // Phase 5: generate-audio solo corre para PT (los scaffolds vacíos
  // no tienen ejercicios para sintetizar).
  if (lang !== 'pt') {
    console.log(noopForLang(lang, 'generate-audio'));
    return;
  }
  BLOCKS_DIR = blocksDir(lang);
  DATA_DIR = dataDir(lang);
  const { block, force } = parseArgs();
  const targets = block ? [getBlock(block)] : BLOCKS;
  const limit = pLimit(TTS_CONCURRENCY);

  // Phase 1: audioIndex es un record libre por VariantKey. Por ahora
  // seguimos generando bajo las keys legacy (br/pt) para no romper el
  // manifest existente; la migración de keys es Phase 4.
  const audioIndex: Record<string, Record<string, string>> = { br: {}, pt: {} };
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

      // L6: process lesson audio. For each lesson in the block, look up
      // its MDX file (if generated) and extract example texts. Real TTS
      // runs against the per-variant voices; results land in
      // `audio-refs.json` (per-language sidecar consumed by the L2 API
      // route + LessonRenderer).
      //
      // We deliberately run the lesson TTS AFTER the per-block lock is
      // acquired so the sidecar write is atomic relative to other
      // audio work for the same block. We don't share the `limit`
      // concurrency gate with the exercise jobs because lesson TTS is
      // a per-block pass and we want to bound the whole block's
      // wall-clock time independently.
      const lessonMdxRoot = path.join(DATA_DIR, 'mdx');
      const lessonLimit = pLimit(TTS_CONCURRENCY);
      const lessonUpdates: Array<{ lesson: Lesson; audioRefs: Record<VariantKey, LessonAudioRef[]> }> = [];
      for (const lesson of b.lessons) {
        const mdxAbsPath = path.join(lessonMdxRoot, lesson.conceptNotesPath);
        let mdxBody = '';
        try {
          mdxBody = await fs.readFile(mdxAbsPath, 'utf8');
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw err;
          }
          // MDX not yet generated — skip silently. (Mirrors the
          // pre-L6 behavior; the next audio run after the lesson
          // content is generated will pick up the examples.)
          continue;
        }
        const texts = lessonExampleTexts(lesson.conceptNotesPath, mdxBody);
        if (texts.length === 0) continue;

        // For each example text, generate TTS under both `pt-br` and
        // `pt-pt` (matching the per-variant approach used for exercise
        // audio). The result list must align with the example index
        // (so the renderer can resolve audioRef={N} → Nth entry).
        const audioRefs: Record<VariantKey, LessonAudioRef[]> = { 'pt-br': [], 'pt-pt': [] };
        for (const text of texts) {
          // Run both variants in parallel (limited). We could
          // parallelize across texts too, but the per-text fan-out
          // (2 variants × N examples) is bounded by TTS_CONCURRENCY
          // and matches the exercise job pool.
          const settledVariants: PromiseSettledResult<{
            variant: 'pt-br' | 'pt-pt';
            hash: string;
            voice: string;
          }>[] = await Promise.allSettled(
            (['pt-br', 'pt-pt'] as const).map((variant) =>
              lessonLimit(async () => {
                // OJO: este mapeo estuvo INVERTIDO (pt-br→'pt') desde la
                // migración Phase 1. Como el hash lleva la variante, el
                // corpus acumuló DOS juegos de archivos (5.451 MP3 para
                // ~2.576 refs) y el attach del 2026-08-11 volteó todos
                // los refs a la era invertida, disparando 2.594 falsos
                // caducados en check-audio-stale (que usa el mapeo
                // correcto). Corregido: pt-br→br, pt-pt→pt.
                const ttsVariant: 'br' | 'pt' = variant === 'pt-br' ? 'br' : 'pt';
                const voice =
                  VOICES[variant]?.[DEFAULT_VOICE] ??
                  VOICES[ttsVariant]?.[DEFAULT_VOICE] ??
                  '';
                if (TTS_DELAY_MS > 0) {
                  await new Promise((r) => setTimeout(r, TTS_DELAY_MS));
                }
                const r = await ttsConFallback({ text, voiceId: voice, variant: ttsVariant });
                return { variant, hash: r.hash, voice: r.voice };
              }),
            ),
          );
          for (const r of settledVariants) {
            if (r.status === 'fulfilled') {
              audioRefs[r.value.variant]!.push({ hash: r.value.hash, voice: r.value.voice });
            } else {
              // 1 fallo por variante = array queda desalineado. Para
              // mantener la invariante "audioRef={N} → texts[N]" en
              // el renderer, hacemos push con un placeholder
              // distinguible (string vacío en hash) y logueamos. El
              // renderer detecta esto y omite el botón.
              console.warn(
                `lesson audio: TTS failed for ${lesson.id} (text "${text}"):`,
                String(r.reason?.message ?? r.reason),
              );
              // Push a placeholder into BOTH variant arrays to keep
              // them aligned. The renderer filters out empty hashes.
              audioRefs['pt-br']!.push({ hash: '', voice: '' });
              audioRefs['pt-pt']!.push({ hash: '', voice: '' });
            }
          }
        }
        lessonUpdates.push({ lesson, audioRefs });
      }

      // Persist the audio-refs sidecar. Read the existing file (if
      // any), merge in the updates for this block, write back. The
      // sidecar is per-language (not per-block), so we do this once
      // per block; merges are idempotent on lessonId.
      if (lessonUpdates.length > 0) {
        await mergeAndWriteLessonsAudioRefs(lang, lessonUpdates);
      }

      const jobs = collectAudioJobs(exercises);
      console.log(`\n=== Block ${b.id}: ${jobs.length} audio jobs ===`);

      // allSettled: 1 fallo no mata los otros 599 jobs.
      // TTS_DELAY_MS entre requests para evitar RPM rate limit (código 1002).
      let done = 0;
      const settled = await Promise.allSettled(jobs.map(j => limit(async () => {
        // Phase 1: AudioJob.variant es VariantKey (string), pero MiniMax
        // TTS espera 'br' | 'pt'. Los callers pasan esos dos valores
        // (collectAudioJobs usa 'pt-br' y 'pt-pt'); mapeamos aquí.
        // Mapeo corregido (ver nota en el sitio de lecciones): pt-br→br.
        const ttsVariant: 'br' | 'pt' = j.variant === 'pt-br' ? 'br' : 'pt';
        const voice = VOICES[j.variant]?.[DEFAULT_VOICE] ?? VOICES[ttsVariant]?.[DEFAULT_VOICE] ?? '';
        if (TTS_DELAY_MS > 0 && done > 0) await new Promise(r => setTimeout(r, TTS_DELAY_MS));
        const result = await ttsConFallback({ text: j.text, voiceId: voice, variant: ttsVariant });
        done++;
        if (done % 20 === 0) console.log(`  progress: ${done}/${jobs.length}`);
        return { ...j, ...result, voice: result.voice };
      })));

      const successes: Array<{ text: string; variant: string; hash: string; voice: string; cached: boolean }> = [];
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
      type AttachInfo = { hash: string; voice: string; variant: string };
      const audioMap = new Map<string, AttachInfo>();
      for (const s of successes) audioMap.set(`${s.variant}::${s.text}`, s);

      // Attach audio refs. Reuse textsFor directly (no second collectAudioJobs call).
      // Phase 1: shim de compat — los MP3s se siguen escribiendo bajo las
      // keys legacy "br" y "pt" en el JSON para no romper el formato del
      // manifest. La migración a "pt-br"/"pt-pt" es Phase 4.
      let audioAttachedCount = 0;
      for (const ex of exercises) {
        const brText = textsFor(ex, 'br')[0];
        const ptText = textsFor(ex, 'pt')[0];
        if (!brText || !ptText) continue;
        // Los jobs llevan VariantKey ('pt-br'/'pt-pt') desde la migración
        // Phase 1, pero este lookup se quedó con las claves legacy
        // ('br::'/'pt::') → SIEMPRE undefined → «audio attached: 0» en
        // todos los bloques. Los clips se generaban y los refs jamás se
        // actualizaban. Invisible desde junio porque el generador tampoco
        // corría (locks fósiles). Cazado 2026-08-11 en el primer run vivo.
        const brR = audioMap.get(`pt-br::${brText}`);
        const ptR = audioMap.get(`pt-pt::${ptText}`);
        if (brR && ptR) {
          ex.audio = {
            br: { hash: brR.hash, voice: brR.voice },
            pt: { hash: ptR.hash, voice: ptR.voice },
          };
          // Recompute contentHash post-audio-attach so SRS keys on post-generated state.
          // Phase 4: read `variantOverrides` directly. The Zod preprocessor
          // still accepts the legacy `ptOverrides` alias on input, so any
          // pre-Phase-1 data continues to parse on re-validation.
          const variantOverrides = (ex as unknown as { variantOverrides?: unknown }).variantOverrides;
          ex.contentHash = hashKey(normalizeForHash({
            type: ex.type, data: ex.data, variantOverrides, esContrast: ex.esContrast,
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
      // Phase 1: el manifest sigue usando keys legacy "br"/"pt" hasta
      // la migración de Phase 4. Mapeamos pt-br→br y pt-pt→pt.
      for (const s of successes) {
        const manifestKey = s.variant === 'pt-br' ? 'br' : s.variant === 'pt-pt' ? 'pt' : s.variant;
        if (!audioIndex[manifestKey]) audioIndex[manifestKey] = {};
        audioIndex[manifestKey][s.text] = s.hash;
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
  const cleanIndex: Record<string, Record<string, string>> = { br: {}, pt: {} };
  for (const v of ['br', 'pt'] as const) {
    const idx = audioIndex[v] ?? {};
    for (const [text, hash] of Object.entries(idx)) {
      if (liveTexts[v].has(text)) cleanIndex[v]![text] = hash;
    }
  }
  // Para bloques NO regenerados, conservar las entries vivas del manifest previo.
  const targetIds = new Set(targets.map(b => String(b.id)));
  for (const v of ['br', 'pt'] as const) {
    const prevIdx: Record<string, string> = prev.audioIndex?.[v] ?? {};
    for (const [text, hash] of Object.entries(prevIdx)) {
      // Conservar solo si NO estamos regenerando su bloque y el texto sigue vivo.
      if (liveTexts[v].has(text) && !Object.keys(audioIndex[v] ?? {}).includes(text)) {
        cleanIndex[v]![text] = hash;
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
