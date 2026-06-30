"use client";
import { Button } from "@/components/ui";
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error;
  unstable_retry: () => void;
}) {
  return (
    <main className="max-w-[640px] mx-auto px-6 py-12 text-center">
      <h1 className="font-display text-3xl mb-3">Algo falló</h1>
      <p className="text-ink-muted mb-6">{error.message}</p>
      <Button variant="primary" onClick={unstable_retry}>Reintentar</Button>
    </main>
  );
}
