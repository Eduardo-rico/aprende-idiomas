// lib/locales.ts
// Single source of truth for the target languages the user is studying.
//
// The `LANGUAGES` tuple is the registry. Adding a new language = add to
// this tuple, add a label below, and create `lib/data/languages/{lang}/`
// (Phase 5). The `LanguageId` type is the discriminated string union;
// `hasLocale` narrows an arbitrary `string` (e.g. a route param) to it.
//
// UI chrome (Spanish) is language-agnostic; these IDs are the *target*
// language the user is learning, NOT the UI language. A `pt` URL means
// "I'm learning Portuguese"; the navbar is still in Spanish either way.
export const LANGUAGES = ["pt", "ru", "ro", "cs"] as const;
export type LanguageId = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: LanguageId = "pt";

/** Type guard: narrows `s` to `LanguageId` after a route-param check. */
export function hasLocale(s: string): s is LanguageId {
  return (LANGUAGES as readonly string[]).includes(s);
}

/** Display label for each language (rendered in its own script). */
export const LANG_LABELS: Record<LanguageId, string> = {
  pt: "Português",
  ru: "Русский",
  ro: "Română",
  cs: "Čeština",
};

/** Native-script short code, used in badges / dropdowns. */
export const LANG_FLAGS: Record<LanguageId, string> = {
  pt: "🇵🇹",
  ru: "🇷🇺",
  ro: "🇷🇴",
  cs: "🇨🇿",
};
