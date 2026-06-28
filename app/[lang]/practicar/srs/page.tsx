// app/[lang]/practicar/srs/page.tsx
// Server shell. Awaits params (Next 16 contract), hasLocale guards,
// then defers to the client island. Next 16 also requires useSearchParams
// consumers to live inside a Suspense boundary, which we provide.
import { Suspense } from "react";
import { hasLocale, type LanguageId } from "@/lib/locales";

export const dynamic = "force-dynamic";

function PageFallback() {
  return (
    <div className="p-12 text-center text-ink-muted" data-testid="session-loading">
      Cargando sesión…
    </div>
  );
}

export default async function PracticarSrsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) return <PageFallback />;
  const lang: LanguageId = rawLang;
  const { PracticarSrsInner } = await import("./PracticarSrsInner");
  return (
    <Suspense fallback={<PageFallback />}>
      <PracticarSrsInner lang={lang} />
    </Suspense>
  );
}
