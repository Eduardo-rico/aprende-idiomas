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
//
// Fase G (2026-09-03): entran `la` (latín) y `grc` (griego antiguo). Tres
// cosas que las distinguen de las cuatro anteriores y que hay que tener
// presentes al tocar cualquier cosa keyed por idioma:
//
//   1. `grc` tiene TRES letras. Es el código ISO 639-3 del griego
//      antiguo, y es el correcto: `el` es el griego MODERNO, que el
//      coordinador declaró fase posterior. Confundirlos sería exactamente
//      «un sello responde a una pregunta».
//   2. Sus NIVELES no son A1…C2 — son los peldaños de `NIVELES_DE` en
//      `scripts/paso0-idioma.ts`. El MCER describe lo que alguien puede
//      HACER con una lengua viva; no hay transacción cotidiana en latín.
//   3. No tienen bandera, y eso es un dato, no una omisión: ver
//      `LANG_FLAGS`.
export const LANGUAGES = ["pt", "ru", "ro", "cs", "la", "grc"] as const;
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
  la: "Latina",
  grc: "Ἑλληνική",
};

/** Marca corta para badges y desplegables.
 *
 *  Para las cuatro lenguas vivas es la bandera de su estado. Para el
 *  latín y el griego antiguo NO hay bandera, y ponerle una sería afirmar
 *  algo falso: una bandera nombra un estado, y estas lenguas no tienen
 *  ninguno. 🇻🇦 por el latín reclamaría al Vaticano, y 🇬🇷 por el griego
 *  antiguo además CHOCARÍA con el griego moderno el día que entre —que
 *  el coordinador ya declaró fase posterior—, dejando dos idiomas
 *  indistinguibles en el desplegable. Objeto por lengua, entonces. */
export const LANG_FLAGS: Record<LanguageId, string> = {
  pt: "🇵🇹",
  ru: "🇷🇺",
  ro: "🇷🇴",
  cs: "🇨🇿",
  la: "🏛️",
  grc: "🏺",
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
  // Fase G. El chrome va en la lengua meta como en las demás, con dos
  // avisos escritos porque estas dos no tienen hablante que las apruebe:
  //
  //  · PENDIENTE DE REVISIÓN por `latinista-adversarial-la` y
  //    `helenista-adversarial-grc`, que aún no existen. Son las únicas
  //    cadenas en lengua meta que este proyecto muestra sin que un
  //    revisor las haya visto.
  //  · `cuenta` es el par que más me gusta y el que más conviene revisar:
  //    «ratio» y «λόγος» son la MISMA metáfora —cálculo, cuenta, razón—
  //    y son la palabra clásica para una cuenta. Si el revisor dice que
  //    en una interfaz suena a tratado de filosofía, se cambia.
  la: {
    title: "Disce Latine",
    description: "Latina para hispanohablantes",
    nav: { estudar: "Disce", livro: "Liber", historias: "Fabulae", ler: "Lege", progreso: "Progressus", cuenta: "Ratio" },
  },
  grc: {
    title: "Μάνθανε Ἑλληνιστί",
    description: "Ἑλληνική para hispanohablantes",
    nav: { estudar: "Μάνθανε", livro: "Βιβλίον", historias: "Μῦθοι", ler: "Ἀναγίγνωσκε", progreso: "Προκοπή", cuenta: "Λόγος" },
  },
};
