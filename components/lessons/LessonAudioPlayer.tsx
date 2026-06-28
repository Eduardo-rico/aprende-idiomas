// components/lessons/LessonAudioPlayer.tsx
// L6 (Item 4 of the follow-up): real audio player that replaces the
// L3 `🔊 audio #N` placeholder in the rendered <Example> block.
//
// Wires up against the audio-refs sidecar produced by
// `scripts/generate-audio.ts` (the L2 API route returns the same
// shape). Renders one button per example index; clicking the button
// creates a native <audio> element with `autoPlay` and tears it down
// on `onEnded` (so we don't leak media elements across plays).
//
// The active variant comes from `useSettings` (the same store the
// rest of the app uses for the PT-BR / PT-PT toggle) — when the
// user switches variant the player re-resolves the source. If a
// particular example has no audio for the active variant (e.g. the
// TTS run only produced `pt-br` audio for it), the button is still
// rendered but clicking it surfaces no playback; the user can
// switch the variant to find the audio. We intentionally don't hide
// the button to keep the layout stable across variant changes.
"use client";
import { useCallback, useRef } from "react";
import { useSettings } from "@/lib/stores/settings";
import type { VariantKey } from "@/lib/data/variant";
import { audioUrl } from "@/lib/audio/resolve";

// Shape of a single audio ref entry — mirrors LessonAudioRefSchema
// in lib/data/zod-schemas.ts. Inlined here because the schema is not
// exported as a type (only as a Zod schema).
type LessonAudioRef = { hash: string; voice: string };

export interface LessonAudioPlayerProps {
  /** The audio-refs map for the lesson, keyed by variant. The L2 API
   *  route at `/api/lessons/:lessonId` returns this shape (the
   *  `:lang` segment was dropped in Task 0.7; the app is PT-only).
   *  Each value is the per-example list, aligned to the example
   *  index emitted by the renderer (so `index` here is the example
   *  number the player was placed against). */
  audioRefs: Record<VariantKey, LessonAudioRef[]>;
  /** Example index this player is rendering for. */
  index: number;
  /** Optional className passthrough for the host button (size tweaks,
   *  etc.). */
  className?: string;
}

/** Pull the active variant from the settings store. This indirection
 *  is mostly to keep the component test-friendly: tests can pass the
 *  variant directly as a prop and bypass the store. */
function useActiveVariant(): VariantKey {
  return useSettings((s) => s.variant);
}

export function LessonAudioPlayer({
  audioRefs,
  index,
  className,
}: LessonAudioPlayerProps) {
  const variant = useActiveVariant();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Resolve the ref for this index + variant. If the array is missing
  // (e.g. an old audio-refs entry that only has one variant) or the
  // hash is empty (TTS failed for this example), `ref` is `undefined`
  // and the button just doesn't play.
  const ref: LessonAudioRef | undefined = audioRefs[variant]?.[index];
  const hasAudio = !!ref && !!ref.hash;

  const play = useCallback(() => {
    if (!hasAudio) return;
    // Tear down the previous audio element (if any) so the user
    // doesn't end up with N stacked <audio> tags when they click
    // through examples in quick succession.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    const el = new Audio(audioUrl(ref.hash, variant, ref.voice));
    el.addEventListener("ended", () => {
      el.src = "";
      if (audioRef.current === el) audioRef.current = null;
    });
    audioRef.current = el;
    void el.play();
  }, [hasAudio, ref, variant]);

  return (
    <>
      <button
        type="button"
        data-audio-ref={index}
        data-audio-variant={variant}
        onClick={play}
        disabled={!hasAudio}
        aria-label={hasAudio ? "Reproducir audio" : "Audio no disponible"}
        className={
          className ??
          "ml-2 inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        }
      >
        🔊 audio #{index}
      </button>
    </>
  );
}
