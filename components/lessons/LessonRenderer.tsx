// components/lessons/LessonRenderer.tsx
// Async server component. Dynamically imports the MDX file for the
// given lesson and renders it with the custom lesson components
// (Example, Tip, Rule). If the MDX is missing, renders a friendly
// fallback hint pointing at `npm run generate:lessons`.
//
// Audio playback is injected client-side by a future
// `<LessonAudioPlayer>` (L4+) that scans the rendered DOM for
// `[data-audio-ref]` markers. The renderer does NOT load audio
// itself — it only renders the placeholder span produced by
// `<Example audioRef={n} />`.
import { loadLessonMdx } from "@/lib/data/mdx";
import type { LanguageId } from "@/lib/locales";
import { lessonMdxComponents } from "./mdx-components";

export async function LessonRenderer({
  lessonId,
  mdxPath,
  lang,
}: {
  lessonId: string;
  mdxPath: string;
  lang: LanguageId;
}) {
  const MdxContent = await loadLessonMdx(lang, mdxPath);
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
