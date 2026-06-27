// components/lessons/LessonRenderer.tsx
// Server component. `@next/mdx` compiles each lesson's `.mdx` to an
// *async* component; React only allows async components on the server,
// so the MDX MUST be rendered server-side. (An earlier "L4 deviation"
// made this a Client Component with React 19's `use()` hook — that
// works when SSR'd from a server page, but Next 16 throws
// "async Client Component" the moment the MDX renders on the pure
// client, which is exactly what the /practice gate did.)
//
// Server pages (StandaloneLessonPage, the practice route shell) render
// this directly. Client components that need the lesson (LessonGate /
// LessonStep) receive its pre-rendered output as a `lessonSlot` prop —
// a server component passed as a prop is rendered on the server and is
// allowed inside a client tree (see Next "Interleaving Server and
// Client Components").
//
// Renders the MDX with the custom lesson components (Example, Tip,
// Rule). If the MDX is missing, renders a friendly fallback hint.
// `audioRefs` is plumbed into the `lessonMdxComponents` factory so the
// `<Example>` blocks render a real `<LessonAudioPlayer>` button.
import { loadLessonMdx } from "@/lib/data/mdx";
import type { LanguageId } from "@/lib/locales";
import { lessonMdxComponents } from "./mdx-components";
import type { VariantKey } from "@/lib/data/variant";

export async function LessonRenderer({
  mdxPath,
  lang,
  audioRefs,
}: {
  lessonId: string;
  mdxPath: string;
  lang: LanguageId;
  audioRefs?: Record<VariantKey, Array<{ hash: string; voice: string }>>;
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
  return <MdxContent components={lessonMdxComponents({ audioRefs })} />;
}