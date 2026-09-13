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
// Fase H (2026-09-13): entra `el`, el griego MODERNO, por decisión de Edu
// —«griego es griego moderno»—. Es la lengua que él quiso desde el
// principio; `grc` lo añadió una sesión anterior junto al latín y **se
// queda aparcado a cero**, también por decisión suya («los dos, moderno
// primero»).
//
// ⚠ `el` y `grc` son DOS LENGUAS, no dos nombres de una. Tratarlas como
// una sería «un sello responde a una pregunta» en su forma más cara: el
// moderno es una lengua viva con niveles MCER y hablantes que aprueban el
// material; el antiguo no tiene ninguna de las dos cosas. Comparten
// alfabeto y poco más — el moderno es MONOTÓNICO desde 1982, así que su
// ortografía no lleva espíritus ni los tres acentos del politónico.
export const LANGUAGES = ["pt", "ru", "ro", "cs", "la", "el", "grc"] as const;
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
  el: "Ελληνικά",
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
  el: "🇬🇷",
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

/** Prosa de la PÁGINA DE LECCIÓN, por lengua.
 *
 *  Existe porque estaba escrita a mano EN PORTUGUÉS dentro de
 *  `loaders.ts` y de la propia página, y se servía a las seis lenguas:
 *  una lección de ruso le mostraba al alumno «Ouça as duas variantes e
 *  note a diferença de cadência e timbre», que además de estar en otro
 *  idioma **habla de un hecho del portugués** —sus dos variantes— que el
 *  ruso no tiene. No era sólo un fallo de traducción: era una afirmación
 *  falsa sobre la lengua que se estudia.
 *
 *  Sigue la convención declarada arriba: la prosa EXPLICATIVA va en
 *  español, porque el alumno es hispanohablante; el chrome va en la
 *  lengua meta y vive en `LANG_CHROME`. Estas cadenas son prosa.
 *
 *  `variantes` es `null` cuando la lengua no tiene dos variantes que
 *  contrastar, y entonces la página NO pinta la sección de audio
 *  comparado. Es un dato, no una omisión: el portugués es la única con
 *  dos normas cultas en el proyecto. */
export interface LangLeccion {
  /** Párrafo de cuerpo. Vacío cuando no hay nada cierto que decir. */
  cuerpo: string;
  /** Relleno de `firstParagraph` cuando la lección no trae objetivos. */
  sinContenido: (leccion: string) => string;
  ejemplo: (palabra: string) => string;
  capitulo: (n: number, bloque: string) => string;
  /** Etiquetas del audio comparado, o `null` si no hay dos variantes. */
  variantes: { intro: string; a: string; b: string } | null;
}

const SIN_VARIANTES = {
  sinContenido: (l: string) => `El contenido de la lección ${l} está en camino.`,
  ejemplo: (p: string) => `Ejemplo con «${p}»`,
  capitulo: (n: number, b: string) => `Capítulo ${n} — ${b}`,
  variantes: null,
};

export const LANG_LECCION: Record<LanguageId, LangLeccion> = {
  pt: {
    cuerpo: "Ouça as duas variantes e note a diferença de cadência e timbre.",
    sinContenido: (l) => `Conteúdo da lição ${l} em breve.`,
    ejemplo: (p) => `Exemplo com «${p}»`,
    capitulo: (n, b) => `Capítulo ${n} — ${b}`,
    variantes: {
      intro: "Ouça as duas variantes e note a diferença de cadência:",
      a: "PT-BR",
      b: "PT-PT",
    },
  },
  ro: { ...SIN_VARIANTES, cuerpo: "" },
  cs: { ...SIN_VARIANTES, cuerpo: "" },
  ru: { ...SIN_VARIANTES, cuerpo: "" },
  la: { ...SIN_VARIANTES, cuerpo: "" },
  el: { ...SIN_VARIANTES, cuerpo: "" },
  grc: { ...SIN_VARIANTES, cuerpo: "" },
};

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
  // El griego MODERNO, monotónico: una sola tilde y ningún espíritu. Es
  // lengua viva, así que su chrome SÍ tiene quien lo apruebe — al revés
  // que el latín y el griego antiguo de aquí abajo.
  el: {
    title: "Μάθε Ελληνικά",
    description: "Ελληνικά para hispanohablantes",
    nav: { estudar: "Μάθε", livro: "Βιβλίο", historias: "Ιστορίες", ler: "Διάβασε", progreso: "Πρόοδος", cuenta: "Λογαριασμός" },
  },
  grc: {
    title: "Μάνθανε Ἑλληνιστί",
    description: "Ἑλληνική para hispanohablantes",
    nav: { estudar: "Μάνθανε", livro: "Βιβλίον", historias: "Μῦθοι", ler: "Ἀναγίγνωσκε", progreso: "Προκοπή", cuenta: "Λόγος" },
  },
};
