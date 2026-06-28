// components/session/SessionTopBar.tsx
// Sticky top bar for the SRS session: close button + progress bar +
// card count + elapsed timer. Matches design-mockups/sesion.html:80-87.
"use client";

export function SessionTopBar({
  progress,
  countLabel,
  timerLabel,
  onClose,
}: {
  progress: number;
  countLabel: string;
  timerLabel: string;
  onClose: () => void;
}) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <header
      className="sticky top-0 z-10 border-b border-rule bg-paper/80 backdrop-blur-md"
      data-testid="session-topbar"
    >
      <div className="mx-auto flex max-w-[720px] items-center gap-[18px] px-6 py-3.5">
        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rule-strong bg-paper-raised text-ink-muted hover:bg-paper-sunken"
        >
          ✕
        </button>
        <div
          className="relative h-2 flex-1 overflow-hidden rounded-full bg-rule"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-lesson transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-[13px] text-ink-faint" data-testid="session-count">
          {countLabel}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[13px] text-ink-muted" data-testid="session-timer">
          ⏱ {timerLabel}
        </span>
      </div>
    </header>
  );
}
