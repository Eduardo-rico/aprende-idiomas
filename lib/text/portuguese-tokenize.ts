// lib/text/portuguese-tokenize.ts
// Splits a Portuguese text into renderable units (whitespace runs + word
// tokens + single non-word, non-space chars). Each token carries a
// `norm` for catalog lookup and `start`/`end` indices into the original
// string, so the renderer can map back to a substring when needed.
//
// Why a hybrid tokenizer: regex-only approaches either miss the original
// spacing (so the prose reflows incorrectly) or match too greedily and
// produce tokens that don't line up with vocab catalog entries (which
// have diacritics, hyphenation, etc.). The two-pass approach — first
// walk the string and emit each non-letter sequence as its own token,
// then merge letter runs that should be a single word — keeps both
// rendering faithful AND catalog lookups reliable.
//
// We lowercase the normalized form and strip leading/trailing apostrophes
// (so "L'água" and "l'água" both resolve to "água" in the catalog).

export type TextToken = {
  /** The exact substring in the source — render this verbatim. */
  raw: string;
  /** Catalog lookup form: lowercase, apostrophes trimmed. Empty if
   *  this token can't be a vocab word (e.g. a punctuation mark). */
  norm: string;
  /** Start index in the source string. */
  start: number;
  /** End index (exclusive) in the source string. */
  end: number;
  /** "word" = sequence of letters/digits (potential vocab match);
   *  "space" = whitespace run; "punct" = everything else. */
  kind: "word" | "space" | "punct";
};

// Letter run: includes Portuguese diacritics. Numbers count as "word"
// because the catalog has things like "5%" conceptually, even if no
// current entry uses numbers.
const WORD_CHAR = /[\p{L}\p{N}]/u;

export function tokenize(source: string): TextToken[] {
  const out: TextToken[] = [];
  let i = 0;
  const n = source.length;
  while (i < n) {
    const ch = source[i]!;
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      // Whitespace run.
      let j = i + 1;
      while (j < n) {
        const c = source[j]!;
        if (c === " " || c === "\t" || c === "\n" || c === "\r") j++;
        else break;
      }
      out.push({ raw: source.slice(i, j), norm: "", start: i, end: j, kind: "space" });
      i = j;
      continue;
    }
    if (WORD_CHAR.test(ch)) {
      // Word run.
      let j = i + 1;
      while (j < n && WORD_CHAR.test(source[j]!)) j++;
      const raw = source.slice(i, j);
      const norm = raw.toLowerCase().replace(/^['"]+|['"]+$/g, "");
      out.push({ raw, norm, start: i, end: j, kind: "word" });
      i = j;
      continue;
    }
    // Single non-word, non-space character (punctuation, quotes, em-dash…).
    out.push({ raw: ch, norm: "", start: i, end: i + 1, kind: "punct" });
    i++;
  }
  return out;
}
