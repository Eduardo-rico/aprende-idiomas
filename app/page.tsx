// app/page.tsx
import Link from 'next/link';
import { loadAllStories } from '@/lib/data/loaders';
import { TodaySummary } from '@/components/home/TodaySummary';
import { StoryOfTheBlockCard } from '@/components/home/StoryOfTheBlockCard';
import { ContinueCard } from '@/components/home/ContinueCard';
import { VariantToggle } from '@/components/VariantToggle';

export default async function HomePage() {
  const stories = await loadAllStories();

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
            <Link href="/diagnostic" className="text-muted-foreground hover:text-foreground">
              Diagnóstico
            </Link>
            <Link href="/stats" className="text-muted-foreground hover:text-foreground">
              Stats
            </Link>
            <Link href="/achievements" className="text-muted-foreground hover:text-foreground">
              Logros
            </Link>
            <Link href="/blocks" className="text-muted-foreground hover:text-foreground">
              Bloques
            </Link>
            <Link href="/settings" className="text-muted-foreground hover:text-foreground">
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
