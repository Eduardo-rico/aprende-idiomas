"use client";
import { useState, useRef, useEffect } from "react";
import { useSettings } from "@/lib/stores/settings";

export function StoryPlayer({
  audioBr,
  audioPt,
  title,
  initialVariant,
}: {
  audioBr: string;
  audioPt: string;
  title: string;
  initialVariant?: "br" | "pt";
}) {
  const { variant: settingsVariant } = useSettings();
  const [variant, setLocalVariant] = useState<"br" | "pt">(
    initialVariant ?? settingsVariant,
  );
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = variant === "br" ? audioBr : audioPt;

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onEnded = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    setPlaying(false);
    setProgress(0);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  // StoryReader dispatches this event when the user taps a word — pause
  // the player so the user can hear the tapped word's audio without
  // overlap. See components/stories/StoryReader.tsx.
  useEffect(() => {
    const onPause = () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      setPlaying(false);
    };
    window.addEventListener("reader-pause-story-audio", onPause);
    return () => window.removeEventListener("reader-pause-story-audio", onPause);
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const elapsed = Math.floor(progress);
  const total = Math.floor(duration);
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
      {/* Play / Pause button */}
      <button
        onClick={toggle}
        aria-label={playing ? "pause" : "play"}
        className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-colors flex-shrink-0"
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>

        {/* Progress bar */}
        <div className="mt-1 h-1 bg-muted/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Elapsed / total */}
        <p className="mt-0.5 text-xs text-muted">
          {elapsed}s / {total}s
        </p>
      </div>

      {/* BR / PT variant toggle */}
      <div className="inline-flex border border-border rounded-md overflow-hidden flex-shrink-0">
        {(["br", "pt"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setLocalVariant(v)}
            aria-pressed={variant === v}
            className={`px-2 py-1 text-xs font-medium ${
              variant === v
                ? "bg-primary text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {v === "br" ? "BR" : "PT"}
          </button>
        ))}
      </div>
    </div>
  );
}
