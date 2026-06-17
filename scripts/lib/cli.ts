// scripts/lib/cli.ts
// Phase 5 (multi-idioma): parsea `--lang=<id>` de los argumentos del
// proceso y devuelve el `LanguageId` activo junto con el resto de los
// args (cada script filtra su propia banderología de ahí en adelante).
//
// Reglas:
//   - `--lang=pt`     → "pt"   (default)
//   - `--lang=ru`     → "ru"
//   - `--lang pt`     → "pt"   (forma con espacio, equivalente a `--lang=pt`)
//   - sin `--lang`    → "pt"   (back-compat con el flujo pre-Phase-5)
//   - valor desconocido → throw con mensaje claro (no fallback silencioso).
//
// Validar con `hasLocale` en lugar de `LANGUAGES.includes` para que
// añadir un idioma a `LANGUAGES` no rompa este parser.
import { hasLocale, DEFAULT_LANGUAGE, type LanguageId } from "@/lib/locales";

export interface LangArgs {
  lang: LanguageId;
  /** Resto de argv (sin la flag `--lang` y su valor) para que cada script
   *  siga parseando `--block`, `--force`, etc. sin pisar este helper. */
  rest: string[];
}

export function parseLangArgs(argv: string[] = process.argv.slice(2)): LangArgs {
  const rest: string[] = [];
  let raw: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === undefined) continue;
    if (a.startsWith("--lang=")) {
      raw = a.slice("--lang=".length);
    } else if (a === "--lang") {
      const next = argv[++i];
      if (next === undefined) {
        throw new Error("--lang requires a value (one of: pt, ru, ro, cs).");
      }
      raw = next;
    } else {
      rest.push(a);
    }
  }
  if (raw === undefined) return { lang: DEFAULT_LANGUAGE, rest };
  if (!hasLocale(raw)) {
    throw new Error(
      `Unknown --lang "${raw}". Expected one of: pt, ru, ro, cs.`,
    );
  }
  return { lang: raw, rest };
}

/** Mensaje estandarizado para scripts que son no-op en idiomas sin
 *  contenido. Mantiene el código de los scripts chico. */
export function noopForLang(lang: LanguageId, scriptName: string): string {
  return `${scriptName}: no content generation is configured for language "${lang}". ` +
    `Scaffolds are placeholders; pass --lang=pt to generate PT content.`;
}
