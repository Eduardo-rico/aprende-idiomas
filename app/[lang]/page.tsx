// app/[lang]/page.tsx
// Lang-scoped home. The active `lang` flows in via `params: Promise<{ lang: string }>`;
// the lang layout has already validated it via `hasLocale`, but we still
// narrow defensively. In-page links are lang-prefixed so navigating from
// /pt to /pt/stats preserves the language segment.
import Link from 'next/link';
import { loadAllStories } from '@/lib/data/loaders';
import { hasLocale, DEFAULT_LANGUAGE, type LanguageId } from '@/lib/locales';
import { TodaySummary } from '@/components/home/TodaySummary';
import { StoryOfTheBlockCard } from '@/components/home/StoryOfTheBlockCard';
import { ContinueCard } from '@/components/home/ContinueCard';
import { VariantToggle } from '@/components/VariantToggle';
import { EmptyState } from './_empty-state';

export default async function LangHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : DEFAULT_LANGUAGE;
  const stories = await loadAllStories(lang);

  // Phase 5: idioma sin contenido → empty state en vez del chrome PT.
  if (stories.length === 0) {
    return <EmptyState lang={lang} page="la página de inicio" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Aprende Português</h1>
          <p className="text-sm text-muted-foreground">
            Português brasileiro + europeu para hispanohablantes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <VariantToggle />
          <nav className="flex gap-3 text-sm">
            <Link href={`/${lang}/diagnostic`} className="text-muted-foreground hover:text-foreground">
              Diagnóstico
            </Link>
            <Link href={`/${lang}/stats`} className="text-muted-foreground hover:text-foreground">
              Stats
            </Link>
            <Link href={`/${lang}/achievements`} className="text-muted-foreground hover:text-foreground">
              Logros
            </Link>
            <Link href={`/${lang}/blocks`} className="text-muted-foreground hover:text-foreground">
              Bloques
            </Link>
            <Link href={`/${lang}/settings`} className="text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <TodaySummary />
      <StoryOfTheBlockCard stories={stories} />
      <ContinueCard />
    </div>
  );
}
