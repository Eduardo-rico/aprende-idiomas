// scripts/generate-lessons.ts
// L5 (lessons-before-exercises): generates MDX content for one lesson at a
// time. CLI surface:
//
//   bash scripts/with-env.sh npm run --silent generate:lessons -- --lang=pt --block=b1 --lesson=l1
//
// For each concept in the lesson's `conceptIds`, asks the LLM (same
// `minimax-llm` plumbing as `generate-content.ts`) for:
//
//   - 1 `<Rule title="...">...</Rule>` — the explanation, PT→ES-friendly.
//   - 3 `<Example index={n} audioRef={n}>pt text\n\nES translation</Example>`.
//   - 1 `<Tip>...</Tip>` — a mnemonic / common-mistake callout.
//
// Output files (mirrors `conceptNotesPath` from the lesson JSON):
//   - lib/data/languages/{lang}/mdx/{block}/{lessonId}.mdx
//   - lib/data/languages/{lang}/lessons/audio-refs.json (entry appended)
//
// L5 status: STUB. The script parses `--lang`, `--block`, `--lesson`,
// resolves the lesson in the curriculum, and prints what it WOULD do —
// it does NOT call the LLM and does NOT write files. This unblocks L5
// verification (the script must run without crashing) and gives us the
// shell to fill in next.
//
// We deliberately accept `--block=b1` (string id) rather than `--block=1`
// (numeric) so the CLI matches the plan's wording AND the user can copy
// it from `/blocks/[id]` URLs without a translation step.
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseLangArgs, noopForLang } from './lib/cli';
import { lessonMdxDir } from './config';
import { LANGUAGES } from '@/lib/locales';

// ─── CLI arg parsing ──────────────────────────────────────────────
//
// `--lang=<id>` is consumed by parseLangArgs() (shared with other
// scripts). The remaining flags are parsed here:
//
//   --block=<id>    block identifier (e.g. "b1" or just "1" — accepted)
//   --lesson=<id>   lesson id within the block (e.g. "l1", "l1-alfabeto-acentos")
//                   — accepted formats: "l1", "l1-alfabeto-acentos", or the
//                   fully-qualified "b1-l1-alfabeto-acentos" (block segment
//                   stripped automatically).
//   --dry-run       explicit no-op mode (the script is already a stub).
//
// Exit codes:
//   0 — success (stub: always, when args parse)
//   1 — arg parse error
//   1 — language has no curriculum (scaffold/no-op)
//   2 — lesson not found in the curriculum

export interface GenerateLessonsArgs {
  lang: import('@/lib/locales').LanguageId;
  /** Block identifier normalized to a positive integer (e.g. "b1" → 1). */
  blockId: number;
  /** Lesson id stripped of its `{block}-` prefix. */
  lessonShortId: string;
  /** The original, fully-qualified lessonId (e.g. "b1-l1-alfabeto-acentos").
   *  Resolved by combining blockId + lessonShortId. If the user passed
   *  the full id we still split it cleanly. */
  lessonId: string;
  dryRun: boolean;
}

export function parseGenerateLessonsArgs(argv: string[]): GenerateLessonsArgs {
  const { lang, rest } = parseLangArgs(argv);
  let blockRaw: string | undefined;
  let lessonRaw: string | undefined;
  let dryRun = false;
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === undefined) continue;
    if (a.startsWith('--block=')) blockRaw = a.slice('--block='.length);
    else if (a === '--block') blockRaw = rest[++i];
    else if (a.startsWith('--lesson=')) lessonRaw = a.slice('--lesson='.length);
    else if (a === '--lesson') lessonRaw = rest[++i];
    else if (a === '--dry-run') dryRun = true;
  }
  if (!blockRaw) throw new Error('--block=<id> is required (e.g. --block=b1).');
  if (!lessonRaw) throw new Error('--lesson=<id> is required (e.g. --lesson=l1).');

  // Accept "b1", "B1", or "1". Strip the "b" prefix for normalization.
  const blockNorm = blockRaw.toLowerCase().replace(/^b/, '');
  if (!/^\d+$/.test(blockNorm)) {
    throw new Error(`--block must look like "b1" or "1" — got "${blockRaw}".`);
  }
  const blockId = Number(blockNorm);

  // If the user passed a fully-qualified lessonId (e.g. "b1-l1-alfabeto-acentos"),
  // strip the "{blockId}-" prefix so we get the short form.
  const blockPrefix = `b${blockId}-`;
  let lessonShortId = lessonRaw;
  if (lessonRaw.startsWith(blockPrefix)) {
    lessonShortId = lessonRaw.slice(blockPrefix.length);
  }
  // The short id must look like "l1" or "l1-something"; reject garbage.
  if (!/^l\d+(-[\w-]+)?$/.test(lessonShortId)) {
    throw new Error(
      `--lesson must look like "l1", "l1-alfabeto-acentos", or "b1-l1-alfabeto-acentos" — got "${lessonRaw}".`,
    );
  }
  const lessonId = `${blockPrefix}${lessonShortId}`;

  return { lang, blockId, lessonShortId, lessonId, dryRun };
}

// ─── Lesson lookup ────────────────────────────────────────────────

interface ResolvedLesson {
  blockId: number;
  lessonId: string;
  conceptIds: string[];
  conceptNotesPath: string;
  mdxAbsPath: string;
  audioRefsAbsPath: string;
}

async function resolveLesson(args: GenerateLessonsArgs): Promise<ResolvedLesson | null> {
  if (args.lang !== 'pt') return null; // scaffolds: noop
  const mod = await import('@/lib/data/languages/pt/curriculum');
  const block = mod.getBlock(args.blockId);
  // Two matching strategies:
  //   1. Exact id match (`b1-l1-alfabeto-acentos`).
  //   2. Prefix match against the short id (`l1` → first lesson whose
  //      short id starts with "l1"). This lets `--lesson=l1` resolve to
  //      the canonical first lesson of block 1 without forcing the user
  //      to type the full slug — handy for the L5 plan's canonical
  //      `--lesson=l1` invocation.
  const exact = block.lessons.find((l) => l.id === args.lessonId);
  const lesson = exact ?? block.lessons.find((l) => {
    const short = l.id.replace(/^b\d+-/, '');
    return short === args.lessonShortId || short.startsWith(`${args.lessonShortId}-`);
  });
  if (!lesson) return null;
  const mdxAbsPath = path.join(lessonMdxDir(args.lang), lesson.conceptNotesPath);
  const audioRefsAbsPath = path.join(
    process.cwd(),
    'lib',
    'data',
    'languages',
    args.lang,
    'lessons',
    'audio-refs.json',
  );
  return {
    blockId: lesson.blockId,
    lessonId: lesson.id,
    conceptIds: [...lesson.conceptIds],
    conceptNotesPath: lesson.conceptNotesPath,
    mdxAbsPath,
    audioRefsAbsPath,
  };
}

// ─── Stub output ─────────────────────────────────────────────────

function formatStubPlan(args: GenerateLessonsArgs, lesson: ResolvedLesson): string {
  const lines: string[] = [];
  lines.push(`[generate-lessons] ${args.lang}/${args.blockId}/${args.lessonId}`);
  lines.push(`  concepts (${lesson.conceptIds.length}): ${lesson.conceptIds.join(', ') || '(none)'}`);
  lines.push(`  would write ${path.relative(process.cwd(), lesson.mdxAbsPath)}`);
  lines.push(`  would update ${path.relative(process.cwd(), lesson.audioRefsAbsPath)}`);
  lines.push(`  skipping actual generation (stub)`);
  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseGenerateLessonsArgs(process.argv.slice(2));

  if (!LANGUAGES.includes(args.lang)) {
    console.error(`Unknown language: ${args.lang}`);
    process.exit(1);
  }
  if (args.lang !== 'pt') {
    console.log(noopForLang(args.lang, 'generate-lessons'));
    return;
  }

  const lesson = await resolveLesson(args);
  if (!lesson) {
    console.error(
      `[generate-lessons] Lesson "${args.lessonId}" not found in block ${args.blockId} for language "${args.lang}".`,
    );
    process.exit(2);
  }

  console.log(formatStubPlan(args, lesson));
  // Touch fs.readFile so the import stays in the bundle (and to surface
  // any path-resolution bug early — we don't want this stub silently
  // missing a typo in lessonMdxDir).
  try {
    await fs.readFile(lesson.mdxAbsPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
    // ENOENT is the expected case before the script is implemented.
  }
}

// `require.main === module` is the standard CommonJS guard that prevents
// `main()` from firing when the file is imported by a unit test (which
// only wants the arg-parser, not a real CLI run). Under `tsx` this still
// resolves correctly because tsx sets `require.main` for the entry script.
if (require.main === module) {
  main().catch((err) => {
    console.error('[generate-lessons] error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}