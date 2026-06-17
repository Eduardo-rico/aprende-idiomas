// components/stories/WordSpan.tsx
// A single tappable word in the story reader. Word tokens render as
// <button>s (so they're keyboard- and screen-reader-accessible). Punctuation
// and whitespace render as inert text — no tap target, no nested buttons.
//
// The active target language is threaded in from StoryReader so the
// popover's vocab lookup can be language-scoped.
"use client";
import { useState } from "react";
import { WordPopover } from "./WordPopover";
import type { TextToken } from "@/lib/text/portuguese-tokenize";
import type { LanguageId } from "@/lib/locales";

export function WordSpan({
  token,
  storyId,
  lang,
}: {
  token: TextToken;
  storyId: string;
  lang: LanguageId;
}) {
  // Only word tokens are tappable. We deliberately skip norm === "" because
  // that means the token is purely punctuation/letters we don't want to
  // match against the catalog (e.g. "5%" would match only "5", not "5%").
  const isTappable = token.kind === "word" && token.norm.length > 0;
  const [open, setOpen] = useState(false);
  if (!isTappable) {
    return <>{token.raw}</>;
  }
  return (
    <span className="relative inline">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline cursor-pointer hover:underline decoration-dotted underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-sm"
      >
        {token.raw}
      </button>
      {open && (
        <WordPopover
          word={token.norm}
          storyId={storyId}
          lang={lang}
          onClose={() => setOpen(false)}
        />
      )}
    </span>
  );
}
