// app/[lang]/stats/page.tsx
// Progreso page (A.4). Last shadcn holdout converted to Manual Lusitano.
// Server shell awaits params (Next 16 contract), has dynamic = force-dynamic
// (Dexie is browser-only; the inner island touches it), and wraps the
// client island in <Suspense> so the prerendered HTML and the hydrated
// state look identical.
import { Suspense } from "react";
import { hasLocale, type LanguageId } from "@/lib/locales";

export const dynamic = "force-dynamic";

function PageFallback() {
  return (
    <div
      className="p-12 text-center text-ink-muted"
      data-testid="progreso-loading"
    >
      Cargando progreso…
    </div>
  );
}

export default async function ProgresoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) return <PageFallback />;
  const lang: LanguageId = rawLang;
  const { ProgresoShell } = await import("@/components/progreso/ProgresoShell");
  return (
    <Suspense fallback={<PageFallback />}>
      <ProgresoShell lang={lang} />
    </Suspense>
  );
}
