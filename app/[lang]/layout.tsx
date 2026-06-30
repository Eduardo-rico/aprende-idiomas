// app/[lang]/layout.tsx
// Lang-scoped layout. Wraps the children in <LangProvider> + NavBar +
// a neutral <div className="flex-1">. The active `lang` becomes the
// route param read by server components via `params: Promise<{ lang:
// string }>`; client components get it from useLang() inside the
// provider.
//
// Per Next 16: `params` is a Promise; we await it. `hasLocale` rejects
// unknown langs with notFound() so /xx/* renders 404 instead of crashing
// at runtime.
//
// <html> + fonts live in the root layout (app/layout.tsx), not here.
// This layout is purely a passthrough wrapper that injects the provider
// + chrome. The lang attribute on <html> is set globally to "es" in
// the root (UI chrome is Spanish); the active target language is
// carried in <LangProvider> for components that need it.
//
// Note: as of B.1, this layout does NOT wrap children in <main>; each
// route group that needs a semantic <main> (e.g. (config)/cuenta/
// layout.tsx) provides its own. This avoids nested-<main> HTML invalid
// markup when sub-pages also want a semantic <main> wrapper.
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LangProvider } from "@/lib/stores/lang-context";
import { UiStateHydrator } from "@/components/UiStateHydrator";
import { hasLocale, type LanguageId } from "@/lib/locales";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // `lang` is now narrowed to LanguageId; pass to provider.
  const typedLang: LanguageId = lang;
  return (
    <ThemeProvider>
      <LangProvider lang={typedLang}>
        <UiStateHydrator>
          <div className="flex-1">{children}</div>
        </UiStateHydrator>
      </LangProvider>
    </ThemeProvider>
  );
}
