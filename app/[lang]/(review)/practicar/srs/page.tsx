// app/[lang]/practicar/srs/page.tsx
// Server shell. Awaits params (Next 16 contract), hasLocale guards,
// then defers to the client island. Next 16 also requires useSearchParams
// consumers to live inside a Suspense boundary, which we provide.
// The fallback uses the shared SessionFallback component (B.1.b) so
// the loading chrome stays consistent with stats and any future
// session runner.
import { Suspense } from "react";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { SessionFallback } from "@/components/session/SessionFallback";

export const dynamic = "force-dynamic";

export default async function PracticarSrsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) return <SessionFallback message="Cargando sesión…" />;
  const lang: LanguageId = rawLang;
  const { PracticarSrsInner } = await import("./PracticarSrsInner");
  return (
    <Suspense fallback={<SessionFallback message="Cargando sesión…" />}>
      <PracticarSrsInner lang={lang} />
    </Suspense>
  );
}
