// scripts/lib/content-guard.ts
// English words that are NOT also valid PT/ES words. Curated to avoid false
// positives (e.g. "a", "o", "e", "de", "no", "me", "se", "tem" are PT/ES;
// "has" is dropped because it is also Spanish "tú has").
const ENGLISH_STOPWORDS = new Set([
  'the', 'and', 'with', 'this', 'that', 'these', 'those', 'have', 'had',
  'will', 'would', 'should', 'gave', 'give', 'given', 'they', 'them', 'their',
  'because', 'about', 'into', 'from', 'which', 'what', 'when', 'where', 'while',
  'announcing', 'sweatshirt', 'however', 'therefore',
]);
export function findEnglishWords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-záàâãéêíóôõúç]+/gi) ?? [];
  return words.filter((w) => ENGLISH_STOPWORDS.has(w));
}
export function blankCountMismatch(ex: { type: string; data?: unknown }): boolean {
  if (ex.type !== 'fill_blank') return false;
  const data = (ex.data ?? {}) as { sentence?: string; blanks?: unknown[] };
  const sentence = data.sentence ?? '';
  const blanks = data.blanks ?? [];
  const n = (sentence.match(/___/g) ?? []).length;
  return n !== blanks.length;
}
