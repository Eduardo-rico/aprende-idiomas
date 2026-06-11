import { loadStory, loadAllStories } from "@/lib/data/loaders";
import { notFound } from "next/navigation";
import { StoryPlayer } from "@/components/stories/StoryPlayer";
import { StoryText } from "@/components/stories/StoryText";
import { VocabSidebar } from "@/components/stories/VocabSidebar";
import { StoryActions } from "./StoryActions";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Guard against path traversal — id must be lowercase alphanumeric + hyphens only
  if (!/^[a-z0-9-]+$/.test(id)) notFound();

  const story = await loadStory(id);
  if (!story) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-sm text-muted">Bloque {story.blockId}</p>
        <h1 className="font-display text-4xl">{story.title}</h1>
      </header>
      <StoryPlayer
        audioBr={`/audio/${story.variants.br.audioHash}.mp3`}
        audioPt={`/audio/${story.variants.pt.audioHash}.mp3`}
        title={story.title}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <StoryText story={story} />
        </div>
        <VocabSidebar story={story} />
      </div>
      <StoryActions storyId={story.id} />
    </div>
  );
}
