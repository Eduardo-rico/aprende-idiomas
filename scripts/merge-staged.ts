// scripts/merge-staged.ts
// Merge a per-block staged content file (bN.staged.json) into bN.json.
//
//   tsx scripts/merge-staged.ts --block N [--write]
//
// Staged items are exercise objects WITHOUT id/blockId/contentHash/audio, but
// WITH `type`, `data`, `concepts`, `tags`, `lessonId` (a valid lesson of block
// N), and optionally `esContrast`/`variantOverrides`. The script:
//   1. builds existingIds from the WHOLE corpus (all b*.json),
//   2. validates lessonId ∈ block N and every conceptId ∈ ALL_CONCEPTS,
//   3. content-addresses ids (collision-safe vs the whole corpus, R2),
//   4. runs validateNewType (E10) + the anti-bleed gate (non-Latin + English),
//   5. GeneratedExerciseSchema.safeParse (audio-optional per 5a R1),
//   6. with --write and zero problems, appends into bN.json.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '@/lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { ExerciseSchema } from './lib/zod-schemas';
import { findNonLatinDeep } from './lib/latin-guard';
import { findEnglishWords } from './lib/content-guard';
import { assignIds, validateNewType, contentHash, type StagedItem } from './lib/staged-validate';

const VALID_CONCEPT_IDS = new Set(ALL_CONCEPTS.map((c) => c.id));

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function main() {
  const blockArg = arg('--block');
  const write = process.argv.includes('--write');
  if (!blockArg) { console.error('Usage: merge-staged.ts --block N [--write]'); process.exit(2); }
  const blockId = Number(blockArg);
  const block = BLOCKS.find((b) => b.id === blockId);
  if (!block) { console.error(`Block ${blockId} not found in curriculum.`); process.exit(2); }
  const validLessonIds = new Set(block.lessons.map((l) => l.id));

  const stagedPath = path.join(BLOCKS_DIR, `b${blockId}.staged.json`);
  const targetPath = path.join(BLOCKS_DIR, `b${blockId}.json`);
  if (!fs.existsSync(stagedPath)) { console.error(`Missing ${stagedPath}`); process.exit(2); }

  const staged = JSON.parse(fs.readFileSync(stagedPath, 'utf8')) as StagedItem[];
  if (!Array.isArray(staged)) { console.error('Staged file must be a JSON array.'); process.exit(2); }

  // existingIds from the WHOLE corpus (global uniqueness, R2).
  const existingIds = new Set<string>();
  for (const b of BLOCKS) {
    const f = path.join(BLOCKS_DIR, `b${b.id}.json`);
    if (!fs.existsSync(f)) continue;
    for (const ex of JSON.parse(fs.readFileSync(f, 'utf8')) as { id?: string }[]) {
      if (ex.id) existingIds.add(ex.id);
    }
  }

  const problems: string[] = [];

  // Per-item structural/placement/bleed checks (pre-id).
  staged.forEach((it, i) => {
    const where = `staged[${i}] (${it.type})`;
    if (!it.lessonId || !validLessonIds.has(String(it.lessonId))) {
      problems.push(`${where}: lessonId "${it.lessonId}" not a lesson of block ${blockId}`);
    }
    for (const c of (it.concepts as string[] | undefined) ?? []) {
      if (!VALID_CONCEPT_IDS.has(c)) problems.push(`${where}: unknown conceptId "${c}"`);
    }
    if (!Array.isArray(it.concepts) || (it.concepts as unknown[]).length === 0) {
      problems.push(`${where}: missing concepts[]`);
    }
    if (!Array.isArray(it.tags)) problems.push(`${where}: missing tags[]`);
    for (const p of validateNewType(it as { type: string; data: any })) problems.push(`${where}: ${p}`);
    const nonLatin = findNonLatinDeep(it.data);
    if (nonLatin.length) problems.push(`${where}: non-Latin bleed ${[...new Set(nonLatin)].join(' ')}`);
    const en = findEnglishWords((JSON.stringify(it.data) + ' ' + (it.esContrast ?? '')).replace(/\([^)]*\)/g, ' ').replace(/'[^']*'/g, ' '));
    if (en.length) problems.push(`${where}: English bleed ${[...new Set(en)].join(' ')}`);
  });

  // Collision-safe id assignment vs the whole corpus.
  const { withIds, collisions } = assignIds(staged, existingIds);
  for (const c of collisions) problems.push(`collision: id ${c} already exists (duplicate content) — not appended`);

  // Final shape validation. We use ExerciseSchema (not GeneratedExerciseSchema)
  // because 5b content is text-only: fill_blank/verb_preposition and the 5a
  // types are stored WITHOUT audio (matching the existing corpus). We always
  // attach a contentHash, so the generated-state invariant is still satisfied.
  const finalized = withIds.map((it) => ({
    ...it,
    blockId,
    contentHash: contentHash(it.type, it.data, it.variantOverrides, it.esContrast),
  }));
  finalized.forEach((ex, i) => {
    if (!ex.contentHash) problems.push(`finalized[${i}] (${ex.type}/${ex.id}): missing contentHash`);
    const r = ExerciseSchema.safeParse(ex);
    if (!r.success) {
      const iss = r.error.issues[0];
      problems.push(`finalized[${i}] (${ex.type}/${ex.id}): ${iss?.path?.join('.') || '(root)'} — ${iss?.message ?? 'Zod fail'}`);
    }
  });

  console.log(`Block ${blockId}: ${staged.length} staged, ${finalized.length} unique, ${collisions.length} collisions, ${problems.length} problems.`);
  if (problems.length) {
    console.log('\nPROBLEMS:');
    problems.forEach((p) => console.log('  ✗', p));
    process.exit(1);
  }

  if (!write) {
    console.log('\n✓ Dry-run clean. Re-run with --write to append.');
    return;
  }

  const existing = JSON.parse(fs.readFileSync(targetPath, 'utf8')) as unknown[];
  const merged = [...existing, ...finalized];
  fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`\n✓ Appended ${finalized.length} exercises into b${blockId}.json (now ${merged.length}).`);
}

main();
