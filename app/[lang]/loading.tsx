// app/[lang]/loading.tsx
// Shared loading boundary for all lang-scoped routes. Activates while
// server components stream (Next.js App Router contract: loading.tsx
// is wrapped around the page in a <Suspense> boundary automatically).
//
// The fallback uses the Manual Lusitano chrome (paper + rule tokens)
// and animate-pulse for a skeleton that matches the most common page
// shapes: a thin eyebrow line, a tall h1, two text lines. Per-page
// loading components (e.g. stats/page.tsx PageFallback) handle
// client-side Dexie fetches; this boundary covers server-side async
// work across all routes.
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-[760px] px-6 py-12 animate-pulse"
      data-testid="lang-loading"
    >
      <div className="mb-3 h-2 w-20 rounded bg-rule" />
      <div className="mb-6 h-10 w-2/3 rounded bg-rule" />
      <div className="mb-2 h-4 w-full rounded bg-rule" />
      <div className="h-4 w-5/6 rounded bg-rule" />
    </div>
  );
}