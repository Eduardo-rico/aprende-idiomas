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
import { LANGUAGES, LANG_LABELS, LANG_FLAGS, LANG_CHROME, type LanguageId } from "@/lib/locales";
import { useSettings } from "@/lib/stores/settings";

export function NavBar() {
  const lang = useLang();
  const path = usePathname() ?? "";
  const router = useRouter();
  const { setLanguage } = useSettings();
  // Wordmark + menu labels come from the chrome catalogue keyed by the
  // ROUTE lang (lib/locales LANG_CHROME), so /ro reads «Învață Română ·
  // Învață · Carte …» while /pt keeps «Aprende Português · Estudar …».
  const chrome = LANG_CHROME[lang];
  const links = [
    { href: `/${lang}`, label: chrome.nav.estudar },
    { href: `/${lang}/blocks`, label: chrome.nav.livro },
    { href: `/${lang}/stories`, label: chrome.nav.historias },
    { href: `/${lang}/leer`, label: chrome.nav.ler },
    { href: `/${lang}/progreso`, label: chrome.nav.progreso },
    // A.6: nav item now points at the new /cuenta hub (Manual Lusitano
    // chrome) rather than the legacy /settings page. The /settings URL
    // still 308s to /cuenta via next.config redirects for backward
    // compatibility (bookmarks, in-flight links).
    { href: `/${lang}/cuenta`, label: chrome.nav.cuenta },
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
      {/* Móvil (medido 2026-09-03 en 375 px): esto era UNA sola fila sin
          envolver, 751 px de contenido en 320 px visibles y `overflow`
          visible, así que CUATRO de los seis enlaces —Histórias, Ler,
          Progresso, Cuenta— quedaban fuera de la pantalla y sin forma de
          alcanzarlos. Ahora los enlaces saltan a su propia línea por
          debajo del ancho `sm`; de `sm` en adelante el diseño es
          exactamente el de antes (una fila de 56 px). */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap sm:flex-nowrap items-center gap-x-7 gap-y-2 py-2 sm:py-0 sm:h-14">
        <Link href={`/${lang}`} className="font-display text-[19px] font-semibold flex items-center gap-2 no-underline text-ink">
          <span
            aria-hidden="true"
            className="inline-block w-2 h-2 rounded-full bg-lesson"
          />
          {chrome.title}
        </Link>
        <ul className="order-last w-full flex flex-nowrap overflow-x-auto gap-1 items-center list-none [-webkit-overflow-scrolling:touch] sm:order-none sm:w-auto sm:ml-auto sm:justify-end sm:overflow-visible">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    active
                      ? "px-3 py-3.5 sm:py-1.5 rounded-md text-sm font-medium whitespace-nowrap text-lesson bg-lesson-soft no-underline"
                      : "px-3 py-3.5 sm:py-1.5 rounded-md text-sm font-medium whitespace-nowrap text-ink-muted hover:text-ink hover:bg-paper-sunken no-underline transition-colors duration-150 ease-[var(--ease)]"
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* The selected option is the ROUTE lang, not the persisted
            settings value: landing on /ro by URL must show 🇷🇴 even if
            the store still remembers pt from a previous visit. */}
        <select
          value={lang}
          onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
          aria-label="Idioma objetivo"
          className="ml-auto sm:ml-0 border border-rule-strong rounded-md px-2 py-2 sm:py-1 text-xs bg-paper text-ink"
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