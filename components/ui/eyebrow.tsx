import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  /** Optional accent color for the rule (defaults to ink-faint). */
  accentClass?: string;
  className?: string;
}

/**
 * Editorial pattern: ALL-CAPS label + 28px rule. Opens every section
 * in the Manual Lusitano design system.
 */
export function Eyebrow({ children, accentClass = "bg-rule-strong", className }: Props) {
  return (
    <div className={cn("mb-1.5", className)}>
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-faint mb-1.5">
        {children}
      </div>
      <div className={cn("w-7 h-0.5", accentClass)} />
    </div>
  );
}