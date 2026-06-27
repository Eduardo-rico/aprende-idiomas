// scripts/enrich-lessons.ts
// Plan 5c — enrich lesson MDX with a vocabulary section and (for verb
// lessons b3–b7) a conjugation table, INSERTING blocks around the
// audio-bearing <Example> lines without touching them (no TTS regen).
//
// Dry-run by default; pass `--write` to apply. Each inserted block is
// validated with assertLatinScript + the English guard before writing,
// and the whole thing is idempotent (insertBlock no-ops if already there).
//
// 5c-Task3 deviation: the spec generated conjugation forms via the LLM
// (MiniMax). We hand-curate them instead — deterministic, no network/API
// dependency, and the exact forms are already known from the 5b content.
import path from 'node:path';
import fs from 'node:fs';
import { loadCurriculum } from '@/lib/data/loaders';
import vocabCatalog from '@/lib/data/languages/pt/vocab-catalog.json';
import { FALLBACK_DICTIONARY } from '@/lib/data/languages/pt/fallback-dictionary';
import { buildVocabMdx, buildVerbConjugationMdx, insertBlock } from './lib/enrich-mdx';
import { assertLatinScript } from './lib/latin-guard';
import { findEnglishWords } from './lib/content-guard';

const MDX_DIR = path.join(process.cwd(), 'lib/data/languages/pt/mdx');
const WRITE = process.argv.includes('--write');

// word (lowercased) → Spanish gloss, from the vocab catalog.
const gloss = new Map<string, string>();
for (const e of vocabCatalog as Array<{ word?: string; ptWord?: string; meaning: string }>) {
  for (const k of [e.ptWord, e.word]) if (k) gloss.set(k.toLowerCase(), e.meaning);
}
function glossOf(w: string): string | null {
  return gloss.get(w.toLowerCase()) ?? FALLBACK_DICTIONARY[w] ?? FALLBACK_DICTIONARY[w.toLowerCase()] ?? null;
}

// Hand-curated 6-person paradigms (BR default variant) for the verb
// lessons of blocks 3–7. Lessons without a single clean paradigm
// (pronouns, contrast, gerúndio, particípio, periphrastic) get only the
// vocabulary section.
const PERSONS = ['eu', 'tu', 'ele/ela', 'nós', 'vós', 'eles/elas'];
const CONJ: Record<string, { verb: string; tense: string; forms: string[] }> = {
  'b3-l1-presente-regular': { verb: 'falar', tense: 'presente do indicativo', forms: ['falo', 'falas', 'fala', 'falamos', 'falais', 'falam'] },
  'b3-l3-imperativo-presente-irregular': { verb: 'ser', tense: 'presente do indicativo', forms: ['sou', 'és', 'é', 'somos', 'sois', 'são'] },
  'b4-l1-perfeito-regular': { verb: 'falar', tense: 'pretérito perfeito', forms: ['falei', 'falaste', 'falou', 'falamos', 'falastes', 'falaram'] },
  'b4-l2-perfeito-irregular': { verb: 'ser', tense: 'pretérito perfeito', forms: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'] },
  'b4-l3-imperfeito': { verb: 'falar', tense: 'pretérito imperfeito', forms: ['falava', 'falavas', 'falava', 'falávamos', 'faláveis', 'falavam'] },
  'b5-l1-futuro-presente': { verb: 'falar', tense: 'futuro do presente', forms: ['falarei', 'falarás', 'falará', 'falaremos', 'falareis', 'falarão'] },
  'b5-l3-condicional': { verb: 'falar', tense: 'condicional', forms: ['falaria', 'falarias', 'falaria', 'falaríamos', 'falaríeis', 'falariam'] },
  'b6-l1-presente-conjuntivo': { verb: 'falar', tense: 'presente do conjuntivo', forms: ['fale', 'fales', 'fale', 'falemos', 'faleis', 'falem'] },
  'b6-l2-imperfeito-conjuntivo': { verb: 'falar', tense: 'imperfeito do conjuntivo', forms: ['falasse', 'falasses', 'falasse', 'falássemos', 'falásseis', 'falassem'] },
  'b6-l3-futuro-conjuntivo': { verb: 'falar', tense: 'futuro do conjuntivo', forms: ['falar', 'falares', 'falar', 'falarmos', 'falardes', 'falarem'] },
  'b7-l1-infinitivo-pessoal': { verb: 'falar', tense: 'infinitivo pessoal', forms: ['falar', 'falares', 'falar', 'falarmos', 'falardes', 'falarem'] },
};

function guard(block: string, label: string) {
  assertLatinScript(block, label);
  const eng = findEnglishWords(block);
  if (eng.length) throw new Error(`English in ${label}: ${eng.join(', ')}`);
}

async function main() {
  const { BLOCKS } = await loadCurriculum('pt');
  const lessons = BLOCKS.flatMap((b) => b.lessons);
  let changed = 0;
  let vocabCount = 0;
  let conjCount = 0;
  const skippedWords = new Set<string>();

  for (const lesson of lessons) {
    if (!lesson.conceptNotesPath) continue;
    const file = path.join(MDX_DIR, lesson.conceptNotesPath);
    if (!fs.existsSync(file)) continue;
    let mdx = fs.readFileSync(file, 'utf8');
    const before = mdx;

    // 1) Conjugation table (verb lessons only) — inserted first so it ends
    //    up after the Rule and before the Vocabulary section.
    const c = CONJ[lesson.id];
    if (c) {
      const forms = PERSONS.map((p, i) => ({ person: p, form: c.forms[i] ?? '' }));
      const block = buildVerbConjugationMdx(c.verb, c.tense, forms);
      guard(block, `${lesson.id} conjugation`);
      const next = insertBlock(mdx, block);
      if (next !== mdx) conjCount++;
      mdx = next;
    }

    // 2) Vocabulary section — glossed from the catalog; unglossed words skipped.
    const items: { pt: string; es: string }[] = [];
    for (const w of lesson.vocabKey ?? []) {
      const es = glossOf(w);
      if (es) items.push({ pt: w, es });
      else skippedWords.add(w);
    }
    if (items.length) {
      const block = buildVocabMdx(items);
      guard(block, `${lesson.id} vocab`);
      const next = insertBlock(mdx, block);
      if (next !== mdx) vocabCount++;
      mdx = next;
    }

    if (mdx !== before) {
      changed++;
      if (WRITE) fs.writeFileSync(file, mdx);
    }
  }

  console.log(`${WRITE ? 'Wrote' : 'Dry-run'}: ${changed} lessons changed (${vocabCount} vocab blocks, ${conjCount} conjugation tables).`);
  if (skippedWords.size) {
    console.log(`Skipped ${skippedWords.size} unglossed words: ${[...skippedWords].slice(0, 30).join(', ')}${skippedWords.size > 30 ? '…' : ''}`);
  }
  if (!WRITE) console.log('Re-run with --write to apply.');
}

main().catch((err) => { console.error(err); process.exit(1); });
