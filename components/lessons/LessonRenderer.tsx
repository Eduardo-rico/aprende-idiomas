// components/lessons/LessonRenderer.tsx
// Client component (L4 deviation from L3): the renderer used to be a
// server component (RSC), but L4 needs it from inside other client
// components (LessonStep, LessonGate). A server component can't be
// rendered inside a client tree without serialization, so the renderer
// is now `'use client'` and resolves the dynamic MDX import via
// React 19's `use()` hook. The dynamic import in `lib/data/mdx.ts`
// is unchanged — Webpack/Turbopack dynamic imports work on both
// server and client.
//
// Renders the MDX content with the custom lesson components
// (Example, Tip, Rule). If the MDX is missing, renders a friendly
// fallback hint pointing at `npm run generate:lessons`.
//
// Audio playback is injected client-side by a future
// `<LessonAudioPlayer>` (L5+) that scans the rendered DOM for
// `[data-audio-ref]` markers. The renderer does NOT load audio
// itself — it only renders the placeholder span produced by
// `<Example audioRef={n} />`.
"use client";
import { use } from "react";
import { loadLessonMdx } from "@/lib/data/mdx";
import type { LanguageId } from "@/lib/locales";
import { lessonMdxComponents } from "./mdx-components";

export function LessonRenderer({
  mdxPath,
  lang,
  audioRefs: _audioRefs,
}: {
  lessonId: string;
  mdxPath: string;
  lang: LanguageId;
  audioRefs?: Record<string, Array<{ hash: string; voice: string }>>;
}) {
  const MdxContent = use(loadLessonMdx(lang, mdxPath));
  if (!MdxContent) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
        <div className="text-sm">
          Lesson MDX not yet generated for <code>{mdxPath}</code>.
        </div>
        <div className="text-xs mt-1">
          Run <code>npm run generate:lessons</code> to create it.
        </div>
      </div>
    );
  }
  return <MdxContent components={lessonMdxComponents()} />;
}