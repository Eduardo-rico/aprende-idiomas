// app/[lang]/error.tsx
// Shared error boundary for all lang-scoped routes. Per Next.js 16 the
// retry prop is `unstable_retry` (NOT `reset` from older versions);
// see node_modules/next/dist/docs/01-app/03-api-reference/03-file-
// conventions/error.md. Error boundaries must be Client Components.
//
// On activation we record a telemetry event (warn level on a generic
// Error, error level on a digest-bearing server error) via the
// project's logTelemetry helper, then render a Manual Lusitano
// fallback with a single "Reintentar" button that triggers
// unstable_retry() to re-render the segment.
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logTelemetry } from "@/lib/db/repository";

export default function LangError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Server errors carry a digest but no message (Next.js scrubs the
    // original message to avoid leaking sensitive details). We use the
    // digest as the message so server logs can be correlated via the
    // same digest.
    const level = error.digest ? "error" : "warn";
    const message = error.digest ?? error.message;
    logTelemetry(level, "app-error", message, {
      stack: error.stack,
      digest: error.digest,
    }).catch(() => {
      // Swallow telemetry failures — logging an error handler error
      // would itself trigger a new render and a console storm.
    });
  }, [error]);

  return (
    <main
      className="mx-auto max-w-[640px] px-6 py-12 text-center"
      data-testid="lang-error"
    >
      <h1 className="mb-3 font-display text-[32px] font-medium tracking-[-.02em]">
        Algo falló
      </h1>
      <p className="mb-6 text-ink-muted">{error.message}</p>
      <Button
        variant="primary"
        onClick={() => unstable_retry()}
        data-testid="lang-error-retry"
      >
        Reintentar
      </Button>
    </main>
  );
}