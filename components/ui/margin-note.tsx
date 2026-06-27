import { cn } from "@/lib/utils";

type Variant = "tip" | "warn" | "es" | "variant";

interface Props {
  variant: Variant;
  label: string;
  children: React.ReactNode;
  className?: string;
}

const accent: Record<Variant, { border: string; label: string }> = {
  tip: { border: "border-l-lesson", label: "text-lesson" },
  warn: { border: "border-l-review", label: "text-review" },
  es: { border: "border-l-info", label: "text-info" },
  variant: { border: "border-l-review", label: "text-review" },
};

/**
 * Editorial margin note (sidebar). Collapses to <aside> in mobile layouts.
 */
export function MarginNote({ variant, label, children, className }: Props) {
  const a = accent[variant];
  return (
    <aside className={cn("border-l-2 pl-3.5 py-0.5", a.border, className)}>
      <div className={cn("text-[11px] font-semibold uppercase tracking-[0.07em] mb-1", a.label)}>
        {label}
      </div>
      <p className="text-sm leading-snug text-ink-muted italic font-display">
        {children}
      </p>
    </aside>
  );
}