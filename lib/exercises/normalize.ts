// lib/exercises/normalize.ts
// Shared answer normalizer for text-input exercise cards. Accents are
// significant (PT minimal pairs like estão/estao differ); we only trim,
// lowercase, and NFC-normalize so composed vs decomposed accents match.
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().normalize('NFC');
}
export function answersMatch(a: string, b: string): boolean {
  return normalizeAnswer(a) === normalizeAnswer(b);
}
