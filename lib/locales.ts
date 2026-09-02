// lib/locales.ts
// Single source of truth for the target languages the user is studying.
//
// The `LANGUAGES` tuple is the registry. Adding a new language = add to
// this tuple, add a label below, and create `lib/data/languages/{lang}/`
// (Phase 5). The `LanguageId` type is the discriminated string union;
// `hasLocale` narrows an arbitrary `string` (e.g. a route param) to it.
//
// These IDs are the *target* language the user is learning, NOT the UI
// language. The explanatory prose (cards, hints, settings) stays in
// Spanish; the *chrome* — <title>, wordmark, top-nav labels — is written
// in the target language and comes from `LANG_CHROME` below, keyed by
// the route's `lang`. A `ro` URL means "I'm learning Romanian" and the
// header reads «Învață Română», exactly like `/pt` reads «Aprende
// Português». Before LANG_CHROME the navbar was hard-coded Portuguese
// on every `/xx/*` route while the content already resolved by lang.
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

/** Chrome written in the target language: `<title>` + header wordmark
 *  (`title`), the `<meta name="description">`, and the top-nav labels.
 *  Single source: `app/[lang]/layout.tsx` (metadata) and
 *  `components/NavBar.tsx` (wordmark + menu) both read from here. The
 *  nav keys are the ROUTES, stable across languages; only the labels
 *  change. `pt` keeps the labels the app has always shown. */
export interface LangChrome {
  title: string;
  description: string;
  nav: {
    estudar: string;
    livro: string;
    historias: string;
    ler: string;
    progreso: string;
    cuenta: string;
  };
}

export const LANG_CHROME: Record<LanguageId, LangChrome> = {
  pt: {
    title: "Aprende Português",
    description: "Português brasileiro + europeu para hispanohablantes",
    nav: { estudar: "Estudar", livro: "Livro", historias: "Histórias", ler: "Ler", progreso: "Progresso", cuenta: "Cuenta" },
  },
  ro: {
    title: "Învață Română",
    description: "Română para hispanohablantes",
    nav: { estudar: "Învață", livro: "Carte", historias: "Povești", ler: "Citește", progreso: "Progres", cuenta: "Cont" },
  },
  cs: {
    title: "Nauč se česky",
    description: "Čeština para hispanohablantes",
    nav: { estudar: "Učit se", livro: "Kniha", historias: "Příběhy", ler: "Číst", progreso: "Pokrok", cuenta: "Účet" },
  },
  ru: {
    title: "Учи русский",
    description: "Русский para hispanohablantes",
    nav: { estudar: "Учиться", livro: "Книга", historias: "Истории", ler: "Читать", progreso: "Прогресс", cuenta: "Аккаунт" },
  },
};
