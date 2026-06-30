// components/NavBar.tsx
// Manual Lusitano top nav. Sticky, blurred paper background, brand mark
// with a green dot. Links are lang-prefixed via the active `useLang()`
// so navigating from /pt/learn to /pt/blocks preserves the lang segment.
// All colors use the new Manual Lusitano tokens (paper/ink/rule/lesson)
// instead of the legacy border/background aliases — see
// app/globals.css and components/ui/.
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
    { href: `/${lang}`, label: "Estudar" },
    { href: `/${lang}/blocks`, label: "Livro" },
    { href: `/${lang}/stories`, label: "Histórias" },
    { href: `/${lang}/progreso`, label: "Progresso" },
    // A.6: nav item now points at the new /cuenta hub (Manual Lusitano
    // chrome) rather than the legacy /settings page. The /settings URL
    // still 308s to /cuenta via next.config redirects for backward
    // compatibility (bookmarks, in-flight links).
    { href: `/${lang}/cuenta`, label: "Cuenta" },
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
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-paper/80 border-b border-rule">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-7 h-14">
        <Link href={`/${lang}`} className="font-display text-[19px] font-semibold flex items-center gap-2 no-underline text-ink">
          <span
            aria-hidden="true"
            className="inline-block w-2 h-2 rounded-full bg-lesson"
          />
          Aprende Português
        </Link>
        <ul className="flex gap-1 ml-auto items-center list-none">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    active
                      ? "px-3 py-1.5 rounded-md text-sm font-medium text-lesson bg-lesson-soft no-underline"
                      : "px-3 py-1.5 rounded-md text-sm font-medium text-ink-muted hover:text-ink hover:bg-paper-sunken no-underline transition-colors duration-150 ease-[var(--ease)]"
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
          aria-label="Idioma objetivo"
          className="border border-rule-strong rounded-md px-2 py-1 text-xs bg-paper text-ink"
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