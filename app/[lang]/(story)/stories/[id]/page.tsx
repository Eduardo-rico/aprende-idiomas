// app/[lang]/stories/[id]/page.tsx
import { loadStory } from "@/lib/data/loaders";
import { notFound } from "next/navigation";
import { StoryPlayer } from "@/components/stories/StoryPlayer";
import { StoryReader } from "@/components/stories/StoryReader";
import { VocabSidebar } from "@/components/stories/VocabSidebar";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { StoryActions } from "./StoryActions";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang: rawLang, id } = await params;
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : "pt";

  // Guard against path traversal — id must be lowercase alphanumeric + hyphens only
  if (!/^[a-z0-9-]+$/.test(id)) notFound();

  const story = await loadStory(lang, id);
  if (!story) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-sm text-muted">Bloque {story.blockId}</p>
        <h1 className="font-display text-4xl">{story.title}</h1>
      </header>
      <StoryPlayer
        audioBr={`/audio/${story.variants["pt-br"]!.audioHash}.mp3`}
        audioPt={`/audio/${story.variants["pt-pt"]!.audioHash}.mp3`}
        title={story.title}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <StoryReader story={story} lang={lang} />
        </div>
        <VocabSidebar story={story} />
      </div>
      <StoryActions storyId={story.id} />
    </div>
  );
}
