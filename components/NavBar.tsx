"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/", label: "Inicio" },
  { href: "/learn", label: "Estudiar" },
  { href: "/blocks", label: "Blocos" },
  { href: "/stories", label: "Histórias" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "⚙" },
];
export function NavBar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link href="/" className="font-display text-xl">🇧🇷🇵🇹 Português</Link>
        <ul className="flex gap-1 ml-auto">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`px-3 py-1.5 rounded-md text-sm ${path === l.href ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
