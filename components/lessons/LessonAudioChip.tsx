// components/lessons/LessonAudioChip.tsx
// Editorial audio chip matching mockup design-mockups/leccion.html's
// `.audio-inline` (rounded pill with a green play pin + label).
// Used on the lesson prose page for the PT-BR / PT-PT comparison
// playback — distinct from the round <AudioButton> used in SRS
// exercises (which has a playing-wave animation).
"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  /** Visible label, e.g. `"Tenho estudado" — PT-BR`. */
  label: string;
  /** Audio source URL. When omitted, the chip is disabled. */
  audioUrl?: string;
  /** Variant marker for `data-audio-variant`. Cosmetic + useful for
   *  selectors in tests. */
  variant?: "br" | "pt";
}

export function LessonAudioChip({ label, audioUrl, variant }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = () => setError(true);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [audioUrl]);

  const disabled = !audioUrl || error;
  return (
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      data-audio-variant={variant}
      onClick={() => {
        if (disabled) return;
        if (playing) {
          audioRef.current?.pause();
        } else {
          void audioRef.current?.play();
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          if (playing) {
            audioRef.current?.pause();
          } else {
            void audioRef.current?.play();
          }
        }
      }}
      className="inline-flex items-center gap-2 text-[15px] text-ink-muted bg-paper-sunken border border-rule rounded-full px-3.5 py-1.5 my-1 mr-2 cursor-pointer hover:bg-paper transition-colors duration-150 ease-[var(--ease)] disabled:opacity-50 disabled:cursor-not-allowed select-none"
    >
      <span
        aria-hidden="true"
        className="w-[22px] h-[22px] rounded-full bg-lesson text-white flex items-center justify-center text-[11px]"
      >
        {error ? "—" : playing ? "❚❚" : "▶"}
      </span>
      <span>{label}</span>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="none" />}
    </span>
  );
}
