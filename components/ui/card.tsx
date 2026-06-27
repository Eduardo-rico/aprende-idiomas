import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Defaults to "raised" (white card). "sunken" = sunken paper. */
  tone?: "raised" | "sunken";
}

export function Card({ className, tone = "raised", ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-rule shadow-[var(--shadow-xs)] transition-shadow duration-150 ease-[var(--ease)]",
        tone === "raised" ? "bg-paper-raised" : "bg-paper-sunken",
        "hover:shadow-[var(--shadow-sm)]",
        className,
      )}
      {...rest}
    />
  );
}