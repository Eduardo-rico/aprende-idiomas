// components/session/SessionFallback.tsx
// Shared loading fallback for server shells that wrap a client island
// in <Suspense>. Currently used by app/[lang]/practicar/srs/page.tsx
// and app/[lang]/stats/page.tsx — both define an identical 4-line
// component locally. Hoisted here so the chrome + tokens stay
// consistent across any future session runner.
//
// Per the lang-level loading.tsx, this is the "client hydration" tier
// of loading UI: lang/loading.tsx shows while the server component is
// suspended on its `await` (e.g. dynamic import of a client island);
// this component shows once the client island has resolved but is
// still hydrating.
//
// Plain server-renderable component (no hooks). Accepts optional
// message + testId + className so each caller can customize copy and
// keep its existing test-ids (e.g. stats uses `progreso-loading`).
import { cn } from "@/lib/utils";

export function SessionFallback({
  message = "Cargando…",
  testId = "session-loading",
  className,
}: {
  message?: string;
  testId?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("p-12 text-center text-ink-muted", className)}
      data-testid={testId}
    >
      {message}
    </div>
  );
}