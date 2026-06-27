// scripts/lib/enrich-mdx.ts
// Pure MDX-enrichment helpers for Plan 5c. They INSERT new blocks (a
// vocabulary section, a conjugation table) into an existing lesson MDX
// string *without ever touching the audio-bearing `<Example>` lines* —
// insertion happens before the first `<Example` (or at the end when there
// is none). Keeping `<Example>` byte-identical means no TTS regeneration.

/** A static `### Vocabulário` MDX list (one bullet per item). */
export function buildVocabMdx(items: { pt: string; es: string }[]): string {
  const lines = items.map((i) => `- **${i.pt}** — ${i.es}`).join('\n');
  return `### Vocabulário\n\n${lines}\n`;
}

/**
 * A `<VerbConjugation>` MDX literal. `forms` is serialized as a JS array
 * literal the MDX parser accepts as a `{...}` expression attribute.
 */
export function buildVerbConjugationMdx(
  verb: string,
  tense: string,
  forms: { person: string; form: string }[],
): string {
  return `<VerbConjugation verb="${verb}" tense="${tense}" forms={${JSON.stringify(forms)}} />`;
}

/**
 * Insert `block` immediately before the first `<Example` line (or append
 * it when the MDX has none), leaving every `<Example>` line unchanged.
 * Idempotent: if the block's first line (e.g. its heading/tag) is already
 * present, the MDX is returned untouched.
 */
export function insertBlock(mdx: string, block: string): string {
  const marker = block.trim().split('\n')[0] ?? '';
  if (mdx.includes(marker)) return mdx; // already inserted — idempotent
  const idx = mdx.indexOf('<Example');
  if (idx === -1) return `${mdx.trimEnd()}\n\n${block}\n`;
  return `${mdx.slice(0, idx)}${block}\n\n${mdx.slice(idx)}`;
}
