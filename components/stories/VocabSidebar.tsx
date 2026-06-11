"use client";
import { VocabItem } from "./VocabItem";
import type { Story } from "@/lib/data/zod-schemas";
import { useSettings } from "@/lib/stores/settings";

export function VocabSidebar({ story }: { story: Story }) {
  const { variant } = useSettings();
  return (
    <aside className="border border-border rounded-lg p-4 bg-background">
      <h3 className="font-medium mb-2">Vocab</h3>
      <ul>
        {story.vocab.map((v) => {
          const audioHash =
            variant === "br" ? v.audioHash.br : v.audioHash.pt;
          const displayWord =
            variant === "pt" && v.ptWord ? v.ptWord : v.word;
          return (
            <VocabItem
              key={v.word}
              word={displayWord}
              meaning={v.meaning}
              audioUrl={`/audio/${audioHash}.mp3`}
            />
          );
        })}
      </ul>
    </aside>
  );
}
