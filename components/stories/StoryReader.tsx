// components/stories/StoryReader.tsx
// The interactive reader. Replaces the legacy StoryText — paragraphs are
// preserved (split on \n\n), each word inside a paragraph becomes a
// tappable <WordSpan>, and tapping shows the popover. Pauses the audio
// player on tap so the user can hear the word, then can resume.
//
// The active `lang` is passed in as a prop from the server-rendered
// story page (it already has it from `params`). We thread it down to
// `WordSpan` → `WordPopover` so the `/api/vocab/lookup` fetch hits the
// correct language catalog and fallback dictionary.
"use client";
import { useEffect, useMemo, useRef } from "react";
import { tokenize } from "@/lib/text/portuguese-tokenize";
import { WordSpan } from "./WordSpan";
import { useSettings } from "@/lib/stores/settings";
import { shortVariantKey } from "@/lib/data/variant";
import type { Story } from "@/lib/data/zod-schemas";
import type { LanguageId } from "@/lib/locales";

export function StoryReader({ story, lang }: { story: Story; lang: LanguageId }) {
  const { variant } = useSettings();
  // Las historias guardan sus variantes bajo `br` / `pt`; los ajustes usan
  // `pt-br` / `pt-pt`. La cadena de fallback anterior empezaba por
  // `story.variants[variant]`, que para un usuario de PT-PT siempre era
  // undefined, y acababa cayendo en `story.variants.br`: le enseñaba la
  // historia BRASILEÑA a quien había elegido Portugal, en silencio.
  const clave = shortVariantKey(variant);
  const text = story.variants[clave]?.text ?? "";
  // Memoize the token list — the text is static for the lifetime of the page.
  const paragraphs = useMemo(() => text.split("\n\n"), [text]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // When a word is tapped, dispatch a CustomEvent that StoryPlayer listens
  // for. We do this via a DOM event (not Zustand) because this is the only
  // cross-component signal needed and the player is below us in the same
  // tree. Using a custom event keeps the data flow simple and avoids
  // adding a global store for a single boolean.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-word-button]")) {
        window.dispatchEvent(new CustomEvent("reader-pause-story-audio"));
      }
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={containerRef} data-story-reader>
      {paragraphs.map((para, i) => {
        const tokens = tokenize(para);
        // Using a <div> (not <p>) because tokens can host the popover, which
        // renders a <div role="dialog"> — nesting a div inside a <p> is
        // invalid HTML and triggers a React hydration error.
        return (
          <div key={i} className="mb-4 leading-relaxed">
            {tokens.map((t, j) =>
              t.kind === "word" && t.norm.length > 0 ? (
                <span data-word-button key={`${i}-${j}`}>
                  <WordSpan token={t} storyId={story.id} lang={lang} />
                </span>
              ) : (
                <span key={`${i}-${j}`}>{t.raw}</span>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}
