"use client";
import { useState } from "react";

export function VocabItem({
  word,
  meaning,
  audioUrl,
}: {
  word: string;
  meaning: string;
  audioUrl: string;
}) {
  const [playing, setPlaying] = useState(false);
  const play = async () => {
    if (playing) return;
    setPlaying(true);
    const audio = new Audio(audioUrl);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };
  return (
    <li className="flex items-center gap-2 py-1.5">
      <button
        onClick={play}
        disabled={playing}
        aria-label={`play ${word}`}
        className="w-6 h-6 text-xs rounded bg-muted/20 hover:bg-muted/40 disabled:opacity-50"
      >
        {playing ? "🔊" : "▶"}
      </button>
      <span className="font-medium">{word}</span>
      <span className="text-muted text-sm">— {meaning}</span>
    </li>
  );
}
