// components/lessons/mdx-components.tsx
// Custom MDX components used inside lesson `.mdx` files. These are passed
// to the per-page `<MdxContent components={...} />` from the global
// `mdx-components.tsx` (see root of project). Audio playback is NOT
// wired in L3 — `<Example>` shows a placeholder span with `data-audio-ref`
// so a future `<LessonAudioPlayer>` (L4+) can locate and replace it
// client-side via a DOM scan.
import type { ReactNode } from "react";
import React from "react";

/**
 * <Example> renders a single resolved example pair.
 * `audioRef` is the integer index into the audioRefs array (per variant
 * key) so the future audio player can resolve the right hash.
 */
export function Example({
  index,
  pt,
  es,
  audioRef,
}: {
  index: number;
  pt: string;
  es: string;
  audioRef?: number;
}) {
  return (
    <div className="my-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="text-xs font-mono text-muted-foreground mb-2">
        Example {index + 1}
        {audioRef !== undefined && (
          <span className="ml-2" data-audio-ref={audioRef}>
            🔊 audio #{audioRef}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-1">PT</div>
          <div className="text-base">{pt}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-1">ES</div>
          <div className="text-base text-muted-foreground">{es}</div>
        </div>
      </div>
    </div>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 p-4">
      <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
        💡 Tip
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function Rule({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 p-4">
      {title && (
        <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
          {title}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}

/**
 * Factory for the components map. Exported as a function (not a const)
 * so callers always get a fresh object — important for React rendering
 * identity when the same MDX content is rendered multiple times in the
 * same page (e.g. the lesson view + the standalone review page).
 *
 * The components are typed loosely (`any`) so they fit the
 * `Record<string, ComponentType<unknown>>` shape the MDX runtime
 * expects for the `components` prop. The actual prop shapes are
 * enforced at the MDX site (callers pass them by name).
 */
export function lessonMdxComponents(): Record<string, React.ComponentType<any>> {
  return { Example, Tip, Rule };
}
