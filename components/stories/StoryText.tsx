"use client";
import { useSettings } from "@/lib/stores/settings";
import type { Story } from "@/lib/data/zod-schemas";

export function StoryText({ story }: { story: Story }) {
  const { variant } = useSettings();
  const text =
    variant === "br" ? story.variants.br.text : story.variants.pt.text;
  return (
    <article className="max-w-none">
      {text.split("\n\n").map((para, i) => (
        <p key={i} className="mb-4 leading-relaxed">
          {para}
        </p>
      ))}
    </article>
  );
}
