// app/not-found.tsx
// Root-level 404 boundary. Two cases it covers:
//
// 1. Truly unmatched URLs — Next.js renders the closest app-level
//    not-found.js (this file) for any URL that doesn't match any route.
//    Per the Next 16 docs:
//    "In addition to catching expected notFound() errors, the root
//    app/not-found.js ... files handle any unmatched URLs for your
//    whole application."
//
// 2. The hasLocale rejection in app/[lang]/layout.tsx — when an invalid
//    locale like /xx/* is requested, the lang layout calls notFound()
//    before its LangProvider wraps the tree. Next.js doesn't surface
//    that not-found.tsx sibling (app/[lang]/not-found.tsx) for layout-
//    level notFound() calls; it propagates up to the root.
//
// Server component (not-found doesn't accept props or expose hooks).
// No useLang() — at this point the lang may be invalid, so we link to
// the default language which always exists.
import Link from "next/link";
import { DEFAULT_LANGUAGE } from "@/lib/locales";

export default function RootNotFound() {
  return (
    <main
      className="mx-auto max-w-[640px] px-6 py-12 text-center"
      data-testid="root-not-found"
    >
      <p className="mb-3 font-display text-[13px] uppercase tracking-[0.18em] text-ink-muted">
        404
      </p>
      <h1 className="mb-3 font-display text-[32px] font-medium tracking-[-.02em]">
        Página no encontrada
      </h1>
      <p className="mb-6 text-ink-muted">
        La ruta que pediste no existe o no está disponible en este idioma.
      </p>
      <Link
        href={`/${DEFAULT_LANGUAGE}`}
        className="inline-block rounded-md border border-rule-strong bg-paper-raised px-4 py-2 text-sm font-medium text-ink hover:bg-paper-sunken"
        data-testid="root-not-found-home"
      >
        Volver al inicio
      </Link>
    </main>
  );
}