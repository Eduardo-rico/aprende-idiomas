// components/AudioButton.tsx
"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  size?: "sm" | "md" | "lg";
  onPlay?: () => void;
}

export function AudioButton({ src, size = "md", onPlay }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlayEv = () => { setState("playing"); onPlay?.(); };
    const onPause = () => setState("idle");
    const onEnded = () => setState("idle");
    const onError = () => setState("error");
    el.addEventListener("play", onPlayEv);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("play", onPlayEv);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [onPlay]);

  const sizes = { sm: "h-8 w-8 text-sm", md: "h-12 w-12 text-base", lg: "h-16 w-16 text-lg" };

  return (
    <button
      onClick={() => {
        if (state === "error") return;
        audioRef.current?.play();
      }}
      className={`${sizes[size]} rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-30`}
      disabled={state === "error"}
      aria-label="Play audio"
    >
      {state === "playing" ? (
        <div className="flex gap-0.5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-0.5 bg-primary wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : state === "error" ? (
        "—"
      ) : (
        "▶"
      )}
      <audio ref={audioRef} src={src} preload="none" />
    </button>
  );
}
