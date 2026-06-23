// scripts/lib/latin-guard.ts
// Anti-bleed guard: PT/ES content must use only Latin script (+ the accents,
// IPA symbols, and punctuation our lessons legitimately use). The generation
// LLM occasionally injects characters from other writing systems (CJK,
// Cyrillic, Hangul…); this flags them so the pipeline can reject/repair.

// Code-point ranges of *other writing systems* — the actual "bleed" the
// highspeed model leaks. We block-list these (rather than allow-list Latin)
// so legitimate non-Latin symbols pass: math/linguistic signs (∅ ≠ ≈ ←),
// IPA (ʃ ˈ χ), arrows (→), combining diacritics, Latin Extended Additional
// (ẽ), and the BR/PT flag emojis (🇧🇷 🇵🇹) used as variant markers.
const BLOCKED_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0400, 0x052f], // Cyrillic + Supplement
  [0x0590, 0x05ff], // Hebrew
  [0x0600, 0x06ff], // Arabic
  [0x3000, 0x303f], // CJK Symbols & Punctuation
  [0x3040, 0x30ff], // Hiragana + Katakana
  [0x3400, 0x4dbf], // CJK Extension A
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0xf900, 0xfaff], // CJK Compatibility Ideographs
  [0x1100, 0x11ff], // Hangul Jamo
  [0xac00, 0xd7af], // Hangul Syllables
];

function isBlocked(cp: number): boolean {
  for (const [lo, hi] of BLOCKED_RANGES) if (cp >= lo && cp <= hi) return true;
  return false;
}

/** Returns every character (in order, not deduped) from a foreign writing system. */
export function findNonLatin(text: string): string[] {
  const out: string[] = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp !== undefined && isBlocked(cp)) out.push(ch);
  }
  return out;
}

/** Throws if `text` contains non-Latin script, naming the label and offenders. */
export function assertLatinScript(text: string, label: string): void {
  const bad = findNonLatin(text);
  if (bad.length > 0) {
    const uniq = [...new Set(bad)].join(' ');
    throw new Error(`Non-Latin script in ${label}: ${uniq} (in "${text.slice(0, 60)}")`);
  }
}

/** Recursively collect every non-Latin char found in any string value of `obj`. */
export function findNonLatinDeep(obj: unknown): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === 'string') out.push(...findNonLatin(v));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(obj);
  return out;
}
