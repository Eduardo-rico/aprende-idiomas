// scripts/generate-lessons.ts
// L5 → L6: generates MDX content for one lesson at a time. CLI surface:
//
//   bash scripts/with-env.sh npm run --silent generate:lessons -- --lang=pt --block=b1 --lesson=l1 [--write]
//
// For the lesson's concept list (from `lib/data/languages/pt/lessons/{block}.json`
// or the TS-embedded B1 lessons), calls the LLM (same `minimax-llm` plumbing
// as `generate-content.ts`) for one batch with shape:
//
//   {
//     "rule":   { "title": "...", "body": "..." },
//     "examples": [ { "pt": "...", "es": "..." }, ...3 of them ],
//     "tip":    "..."
//   }
//
// Renders that into MDX using the project's custom components:
//
//   <Rule title="...">...</Rule>
//   <Example index={0} audioRef={0} pt="..." es="..." />
//   <Example index={1} audioRef={1} pt="..." es="..." />
//   <Example index={2} audioRef={2} pt="..." es="..." />
//   <Tip>...</Tip>
//
// Output files (mirrors `conceptNotesPath` from the lesson JSON):
//   - lib/data/languages/{lang}/mdx/{block}/{lessonId}.mdx
//
// Flags:
//   --write   persist the rendered MDX to disk. Without this flag the
//             script prints the MDX to stdout and exits 0 (dry-run by
//             default — same contract as `generate-content.ts --dry-run`).
//
// We deliberately accept `--block=b1` (string id) rather than `--block=1`
// (numeric) so the CLI matches the plan's wording AND the user can copy
// it from `/blocks/[id]` URLs without a translation step.
import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { parseLangArgs, noopForLang } from './lib/cli';
import { lessonMdxDir } from './config';
import { LANGUAGES } from '@/lib/locales';
import { callLlm, extractJson } from './lib/minimax-llm';
import { assertLatinScript } from './lib/latin-guard';
import { requireApiKey } from './config';
import { getConceptsByIds } from '@/lib/data/languages/pt/curriculum';

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
//   --write         persist the rendered MDX to disk (default: dry-run,
//                   print to stdout).
//
// Exit codes:
//   0 — success
//   1 — arg parse error / LLM call failed
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
  /** When true, write the MDX file. Otherwise print to stdout (dry-run). */
  write: boolean;
}

export function parseGenerateLessonsArgs(argv: string[]): GenerateLessonsArgs {
  const { lang, rest } = parseLangArgs(argv);
  let blockRaw: string | undefined;
  let lessonRaw: string | undefined;
  let write = false;
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === undefined) continue;
    if (a.startsWith('--block=')) blockRaw = a.slice('--block='.length);
    else if (a === '--block') blockRaw = rest[++i];
    else if (a.startsWith('--lesson=')) lessonRaw = a.slice('--lesson='.length);
    else if (a === '--lesson') lessonRaw = rest[++i];
    else if (a === '--write') write = true;
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

  return { lang, blockId, lessonShortId, lessonId, write };
}

// ─── Lesson lookup ────────────────────────────────────────────────

interface ResolvedLesson {
  blockId: number;
  lessonId: string;
  lessonName: string;
  conceptIds: string[];
  conceptNotesPath: string;
  mdxAbsPath: string;
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
  return {
    blockId: lesson.blockId,
    lessonId: lesson.id,
    lessonName: lesson.name,
    conceptIds: [...lesson.conceptIds],
    conceptNotesPath: lesson.conceptNotesPath,
    mdxAbsPath,
  };
}

// ─── LLM call + Zod validation ───────────────────────────────────

// Schema for the LLM's single-shot output. Three examples are required
// because that's the count the renderer + audio collector expect.
const ExamplePairSchema = z.object({
  pt: z.string().min(1),
  es: z.string().min(1),
});
export const LessonGenerationSchema = z.object({
  rule: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
  }),
  examples: z.array(ExamplePairSchema).length(3),
  tip: z.string().min(1),
});
export type LessonGeneration = z.infer<typeof LessonGenerationSchema>;

// Export the schema name for tests/importers that want to validate
// pre-existing data without re-creating the Zod object.
export const LESSON_GENERATION_SCHEMA_NAME = 'LessonGenerationSchema' as const;

const SYSTEM_PROMPT = `Eres un profesor de portugués para hispanohablantes. Tu tarea es generar el material MDX de UNA lección del bloque indicado.

Responde EXCLUSIVAMENTE con un objeto JSON válido (sin fences, sin prosa) con esta forma EXACTA:

{
  "rule": { "title": "Título corto de la regla", "body": "Explicación clara en español con referencia puntual al portugués, 1-3 párrafos cortos." },
  "examples": [
    { "pt": "Frase corta en portugués (1-10 palabras).", "es": "Traducción natural al español." },
    { "pt": "Segunda frase.", "es": "Segunda traducción." },
    { "pt": "Tercera frase.", "es": "Tercera traducción." }
  ],
  "tip": "Mnemonia, error frecuente, o truco para recordar (1-2 frases, tono cercano)."
}

Reglas:
- EXACTAMENTE 3 ejemplos.
- "pt" debe ser portugués natural (no español翻译) y el texto será sintetizado a audio (evita caracteres no-ASCII raros: tildes y ç sí; emoji no).
- "es" debe ser español natural (sin calcos).
- "title" y "body" hablan al lector en español; mencionan el término portugués entre comillas simples cuando aplique.
- No incluyas campos extra. No envuelvas en fences. JSON estricto.`;

function buildUserPrompt(lessonName: string, conceptList: string, vocabKey: string): string {
  return `Lección: ${lessonName}
Conceptos cubiertos:
${conceptList}
Vocabulario clave (úsalo en los ejemplos): ${vocabKey}

Genera el JSON con la regla, 3 ejemplos y el tip.`;
}

async function callLessonLlm(lesson: ResolvedLesson): Promise<LessonGeneration> {
  // We compute the concept list lazily so the call site (which is the
  // only one that touches the curriculum at runtime) doesn't crash when
  // a concept id is unknown — getConceptsByIds returns an empty list
  // for unknown ids, so we render a friendly user prompt instead.
  const concepts = getConceptsByIds(lesson.conceptIds);
  const conceptsList = concepts
    .filter((c) => lesson.conceptIds.includes(c.id))
    .map((c) => `- ${c.id}: ${c.name} — ${c.description}`)
    .join('\n') || `- (lesson conceptIds: ${lesson.conceptIds.join(', ')})`;
  // For the vocab, we don't have a direct accessor on ResolvedLesson
  // (we only carry conceptIds). Pass an empty string — the prompt
  // still works and the LLM uses the concepts list as the source.
  const user = buildUserPrompt(lesson.lessonName, conceptsList, '');

  const { text } = await callLlm({
    system: SYSTEM_PROMPT,
    user,
    // 4000 matches the minimax-llm + prompt-runner default. Dense
    // contrast-table lessons (es↔pt correspondences, BR↔PT variation)
    // truncate at 2000 with stop_reason=max_tokens.
    maxTokens: 4000,
  });
  const raw = extractJson(text);
  return LessonGenerationSchema.parse(raw);
}

// ─── MDX rendering ────────────────────────────────────────────────

// Escape characters that would break MDX string attributes: " and { }.
// We keep the scope intentionally small: the LLM is told to avoid
// special chars, and we only need to defend against `pt` strings that
// contain quotes or backticks.
function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Collapse internal newlines/whitespace runs to a single space. A blank
// line inside a JSX block element (e.g. a multi-paragraph <Rule> body)
// closes the MDX "paragraph" before the closing tag, which fails the
// build with "Expected a closing tag". Rule/Tip bodies are single-line.
function collapseWs(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function renderLessonMdx(gen: LessonGeneration): string {
  const lines: string[] = [];
  lines.push(`<Rule title="${escapeAttr(gen.rule.title)}">${collapseWs(gen.rule.body)}</Rule>`);
  lines.push('');
  gen.examples.forEach((ex, i) => {
    lines.push(
      `<Example index={${i}} audioRef={${i}} pt="${escapeAttr(ex.pt)}" es="${escapeAttr(ex.es)}" />`,
    );
    lines.push('');
  });
  lines.push(`<Tip>${collapseWs(gen.tip)}</Tip>`);
  lines.push('');
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

  let gen: LessonGeneration;
  try {
    gen = await callLessonLlm(lesson);
  } catch (err) {
    console.error('[generate-lessons] LLM call failed:', err instanceof Error ? err.message : String(err));
    if (err instanceof Error && /MINIMAX_API_KEY/.test(err.message)) {
      console.error(
        '  Hint: set MINIMAX_API_KEY in .env.local and re-run via `bash scripts/with-env.sh`.',
      );
    }
    process.exit(1);
  }

  const mdx = renderLessonMdx(gen);

  // Anti-bleed gate: never write a lesson whose MDX contains characters from
  // other writing systems (the highspeed model leaks CJK/Cyrillic).
  assertLatinScript(mdx, `lesson ${lesson.lessonId}`);

  if (!args.write) {
    // Dry-run: print the rendered MDX to stdout so the caller (or a
    // human running this in CI) can inspect what WOULD be written.
    process.stdout.write(mdx);
    return;
  }

  // Write: ensure parent dir exists, then atomic write.
  await fs.mkdir(path.dirname(lesson.mdxAbsPath), { recursive: true });
  const tmp = `${lesson.mdxAbsPath}.tmp`;
  await fs.writeFile(tmp, mdx, 'utf8');
  await fs.rename(tmp, lesson.mdxAbsPath);
  console.error(
    `[generate-lessons] wrote ${path.relative(process.cwd(), lesson.mdxAbsPath)} (${gen.examples.length} examples)`,
  );
}

// `require.main === module` is the standard CommonJS guard that prevents
// `main()` from firing when the file is imported by a unit test (which
// only wants the arg-parser, not a real CLI run). Under `tsx` this still
// resolves correctly because tsx sets `require.main` for the entry script.
if (require.main === module) {
  // requireApiKey() is invoked lazily by `callLlm`; we don't pre-check
  // here so the dry-run path can still validate args (the no-API-key
  // error comes from the actual LLM call). This matches the behavior
  // of `generate-content.ts`.
  void requireApiKey;
  main().catch((err) => {
    console.error('[generate-lessons] error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
