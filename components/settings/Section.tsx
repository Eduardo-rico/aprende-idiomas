// components/settings/Section.tsx
// Shared wrapper for a /settings page section. Extracted from
// app/settings/page.tsx:61-68 so the new FsrsSection file can use the
// same visual style without duplicating the markup.
import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border rounded-lg p-4 space-y-2">
      <h2 className="font-medium">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
