// components/NavBar.tsx
// Top sticky nav. Links are lang-prefixed via the active `useLang()`.
// We use the active language for hrefs (not just path startsWith) so
// navigating from /pt/learn to /pt/blocks preserves the lang segment.
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/lib/stores/lang-context";
import { LANGUAGES, LANG_LABELS, LANG_FLAGS, type LanguageId } from "@/lib/locales";
import { useSettings } from "@/lib/stores/settings";

export function NavBar() {
  const lang = useLang();
  const path = usePathname() ?? "";
  const router = useRouter();
  const { language, setLanguage } = useSettings();
  const links = [
    { href: `/${lang}`, label: "Inicio" },
    { href: `/${lang}/learn`, label: "Estudiar" },
    { href: `/${lang}/blocks`, label: "Blocos" },
    { href: `/${lang}/stories`, label: "Histórias" },
    { href: `/${lang}/stats`, label: "Stats" },
    { href: `/${lang}/settings`, label: "⚙" },
  ];
  // Phase 5: los 4 idiomas están habilitados. Cambiar el dropdown hace
  // `setLanguage` (persiste en el settings store) y navega a la home
  // del idioma destino. Las pages con data muestran empty state en los
  // idiomas sin contenido.
  const handleLanguageChange = (next: LanguageId) => {
    setLanguage(next);
    router.push(`/${next}`);
  };
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link href={`/${lang}`} className="font-display text-xl">
          {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
        </Link>
        <ul className="flex gap-1 ml-auto">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  path === l.href ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
          aria-label="Idioma objetivo"
          className="border border-border rounded-md px-2 py-1 text-xs bg-background"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {LANG_FLAGS[l]} {LANG_LABELS[l]}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
