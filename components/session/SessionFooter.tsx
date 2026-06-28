// components/session/SessionFooter.tsx
// Italic note line under the grade panel. Matches design-mockups/sesion.html:76.
"use client";

export function SessionFooter({ remaining }: { remaining: number }) {
  return (
    <p
      className="mx-auto mt-6 max-w-[720px] px-6 text-center font-display text-[13px] italic text-ink-faint"
      data-testid="session-footer"
    >
      — sesión de 20 min · interleaving activo · te quedan ~{remaining} tarjetas —
    </p>
  );
}
