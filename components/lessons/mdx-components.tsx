// components/lessons/mdx-components.tsx
// Custom MDX components used inside lesson `.mdx` files. These are passed
// to the per-page `<MdxContent components={...} />` from the global
// `mdx-components.tsx` (see root of project). L6 wires the lesson
// audio: the factory accepts the audioRefs map (one per variant,
// aligned to the example indices) and the `<Example>` component
// renders a `<LessonAudioPlayer>` button instead of a placeholder.
import type { ReactNode } from "react";
import React from "react";
import { LessonAudioPlayer } from "./LessonAudioPlayer";
import type { VariantKey } from "@/lib/data/variant";

// Shape of a single audio ref — mirrors LessonAudioRefSchema in
// lib/data/zod-schemas.ts. Inlined because the schema is not
// exported as a type.
type LessonAudioRef = { hash: string; voice: string };

/**
 * <Example> renders a single resolved example pair.
 * `audioRef` is the integer index into the audioRefs array (per variant
 * key). When the parent (the factory) provides audioRefs, we render a
 * real `<LessonAudioPlayer>` button that plays the corresponding MP3.
 * When audioRefs is absent (older call sites, or test fixtures), we
 * fall back to the L3 placeholder span so the component stays usable
 * in isolation.
 */
export function Example({
  index,
  pt,
  es,
  audioRef,
  audioRefs,
}: {
  index: number;
  pt: string;
  es: string;
  audioRef?: number;
  audioRefs?: Record<VariantKey, LessonAudioRef[]>;
}) {
  return (
    <div className="my-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="text-xs font-mono text-muted-foreground mb-2">
        Example {index + 1}
        {audioRef !== undefined && audioRefs && (
          <LessonAudioPlayer audioRefs={audioRefs} index={audioRef} />
        )}
        {audioRef !== undefined && !audioRefs && (
          // L3 fallback (preserved for tests + standalone review pages
          // that don't have audioRefs plumbed through). The
          // `data-audio-ref` attribute is kept so any future DOM-scan
          // based enhancement (e.g. a global click-to-play overlay)
          // can still find the slot.
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

export interface LessonMdxComponentsOptions {
  /** Audio refs map from the L2 API route. When present, the
   *  `<Example>` component renders a real player; when absent, it
   *  falls back to the L3 placeholder. */
  audioRefs?: Record<VariantKey, LessonAudioRef[]>;
}

/**
 * Factory for the components map. Exported as a function (not a const)
 * so callers always get a fresh object — important for React rendering
 * identity when the same MDX content is rendered multiple times in the
 * same page (e.g. the lesson view + the standalone review page).
 *
 * Accepts an options bag (currently `{ audioRefs }`) so the lesson
 * audio state can be plumbed in without changing the call signature
 * in callers that don't have audio available (the standalone review
 * page, the lesson-renderer tests).
 *
 * The components are typed loosely (`any`) so they fit the
 * `Record<string, ComponentType<unknown>>` shape the MDX runtime
 * expects for the `components` prop. The actual prop shapes are
 * enforced at the MDX site (callers pass them by name).
 */
export function lessonMdxComponents(
  opts: LessonMdxComponentsOptions = {},
): Record<string, React.ComponentType<any>> {
  // We wrap the user's `Example` so the audioRefs prop is implicit
  // (the MDX body only writes `audioRef={N}`). The wrapper passes
  // `audioRefs` to the underlying component; MDX sets the rest from
  // the JSX attributes.
  const ExampleWithAudio: React.ComponentType<any> = (props) => (
    <Example {...props} audioRefs={opts.audioRefs} />
  );
  return { Example: ExampleWithAudio, Tip, Rule };
}
