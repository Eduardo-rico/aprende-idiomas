// lib/data/mdx.ts
// Loader for lesson MDX content. Mirrors the `loadCurriculum` /
// `loadFallbackDict` pattern in `lib/data/loaders.ts` — server-side,
// dynamic import by `lang` + a relative `conceptNotesPath`.
//
// The returned `default` export is a React component (the MDX
// runtime's output) that the caller passes custom components to:
//
//   const Mdx = await loadLessonMdx(lang, mdxPath);
//   return <Mdx components={lessonMdxComponents()} />;
//
// Returns `null` if the file does not exist (e.g. before
// `npm run generate:lessons` has been run for that lesson). The
// renderer is responsible for showing a friendly fallback.
//
// Path convention: `b1/l1-alfabeto-acentos.mdx` resolves to
// `@/lib/data/languages/pt/mdx/b1/l1-alfabeto-acentos.mdx`. The
// `.mdx` extension is required by the Next 16 + `@next/mdx` dynamic
// import (see `node_modules/next/dist/docs/01-app/02-guides/mdx.md`).
import { hasLocale, type LanguageId } from "@/lib/locales";

/**
 * Dynamically imports an MDX file by its `conceptNotesPath`-style
 * relative path. Returns the default export (the MDX component) or
 * `null` if the file is missing.
 *
 * Throws on invalid inputs (unknown lang, non-PT lang, bad mdxPath
 * shape) so callers don't silently render the wrong thing.
 */
export async function loadLessonMdx(
  lang: LanguageId,
  mdxPath: string,
): Promise<React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }> | null> {
  if (!hasLocale(lang)) throw new Error(`Unknown language: ${lang}`);
  // Only PT has MDX content (other languages scaffold-only).
  if (lang !== "pt") throw new Error(`No MDX content for language: ${lang}`);
  if (!/^b\d+\/l[\w-]+\.mdx$/.test(mdxPath)) {
    throw new Error(`Invalid mdxPath: ${mdxPath}`);
  }
  try {
    const mod = await import(
      `@/lib/data/languages/${lang}/mdx/${mdxPath}`
    );
    return mod.default;
  } catch (err) {
    // Dynamic import rejects with a `MODULE_NOT_FOUND` Error when the
    // file is absent. Any other error is a real failure (syntax in
    // the MDX, etc.) — re-throw so the route 500s and the issue is
    // visible during dev.
    if ((err as NodeJS.ErrnoException).code === "MODULE_NOT_FOUND") return null;
    throw err;
  }
}
