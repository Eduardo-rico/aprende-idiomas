// app/[lang]/not-found.tsx
// Lang-level 404 boundary. Activates when any descendant route calls
// notFound() — most commonly the hasLocale rejection in
// app/[lang]/layout.tsx when an unknown locale like /xx/* is requested.
// Per Next 16 docs, not-found.js renders between loading.js and page.js
// in the component hierarchy; it is wrapped by the closest <Suspense>
// + error.js boundary (node_modules/next/dist/docs/01-app/03-api-
// reference/03-file-conventions/not-found.md).
//
// Server component — no "use client" needed. not-found doesn't expose
// a retry prop (unlike error.js), so we don't need hooks here.
//
// not-found.js components do NOT receive params (per Next 16 docs).
// For an invalid locale like /xx/* the lang layout calls notFound()
// before <LangProvider> wraps anything, so useLang() would throw. The
// "Volver al inicio" link therefore targets the default language
// (lib/locales.ts DEFAULT_LANGUAGE = "pt") which always works.
import Link from "next/link";
import { DEFAULT_LANGUAGE } from "@/lib/locales";

export default function LangNotFound() {
  return (
    <main
      className="mx-auto max-w-[640px] px-6 py-12 text-center"
      data-testid="lang-not-found"
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
        data-testid="lang-not-found-home"
      >
        Volver al inicio
      </Link>
    </main>
  );
}