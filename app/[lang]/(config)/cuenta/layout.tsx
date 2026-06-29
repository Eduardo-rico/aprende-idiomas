// app/[lang]/(config)/cuenta/layout.tsx
// Route-group layout for all /cuenta/* sub-views. The (config) folder is
// a route group (parens are dropped from the URL) so /:lang/cuenta and
// /:lang/cuenta/preferencias still resolve as before.
//
// This layout owns the semantic <main> wrapper for the five cuenta pages
// so they don't each render their own <main> (which was invalid HTML).
// The lang-level layout (`app/[lang]/layout.tsx`) wraps everything in a
// neutral <div className="flex-1">; per-route groups are free to add
// their own semantic element.
//
// Width policy: the layout applies uniform horizontal padding; each
// sub-view owns its own inner max-width (640px for forms, 760px for
// the hub grid) via a wrapping <div> so the semantic stays neutral.
//
// Future route groups (B.1.b) can follow the same pattern — each group
// owns the chrome that makes its pages cohesive.
import type { ReactNode } from "react";

export default function CuentaLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className="px-6 py-12"
      data-testid="cuenta-layout"
    >
      {children}
    </main>
  );
}