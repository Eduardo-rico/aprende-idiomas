// components/cuenta/CuentaNav.tsx
// Sub-view tab strip used at the top of every /cuenta/* sub-page.
// Renders a Hub link + 4 sub-view links; active state highlights with
// bg-ink text-paper. The strip itself is a flat nav (not role="tablist")
// because each link is a real navigation, not a panel switch.
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "preferencias", label: "Preferencias" },
  { key: "objetivo", label: "Objetivo" },
  { key: "display", label: "Display" },
  { key: "sesion", label: "Sesión" },
] as const;

export type CuentaTabKey = (typeof TABS)[number]["key"];

export function CuentaNav({
  lang,
  active,
}: {
  lang: string;
  active?: CuentaTabKey;
}) {
  return (
    <nav
      aria-label="Sub-vistas de cuenta"
      className="mb-8 inline-flex flex-wrap gap-1 rounded-lg border border-rule-strong bg-paper-sunken p-1"
      data-testid="cuenta-nav"
    >
      <Link
        href={`/${lang}/cuenta`}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm",
          active === undefined
            ? "bg-ink text-paper"
            : "text-ink-muted hover:text-ink",
        )}
        data-testid="cuenta-nav-hub"
      >
        Hub
      </Link>
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={`/${lang}/cuenta/${t.key}`}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm",
            active === t.key
              ? "bg-ink text-paper"
              : "text-ink-muted hover:text-ink",
          )}
          data-testid={`cuenta-nav-${t.key}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}