// components/stories/WordPopover.tsx
// Popover for a single tapped word in the story reader. Renders four
// states:
//   - "loading": API in flight
//   - "found": catalog hit — meaning + audio + "add to vocab" button
//   - "fallback": static dictionary hit — meaning only, no audio,
//     no "add to vocab" (no TTS hash, no canonical conceptId)
//   - "missing": not in catalog or fallback
// Clicking outside or pressing Esc dismisses.
"use client";
import { useEffect, useRef, useState } from "react";
import { audioUrl } from "@/lib/audio/resolve";
import { getOrCreateVocabCard } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";

type CatalogItem = {
  word: string;
  ptWord?: string;
  meaning: string;
  audioHash: { br: string; pt: string };
};

type FallbackItem = {
  word: string;
  meaning: string;
};

type State =
  | { kind: "loading" }
  | { kind: "found"; item: CatalogItem }
  | { kind: "fallback"; item: FallbackItem }
  | { kind: "missing"; word: string }
  | { kind: "error"; message: string };

export function WordPopover({
  word,
  storyId,
  onClose,
}: {
  word: string;
  storyId: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { variant } = useSettings();
  const ref = useRef<HTMLDivElement | null>(null);

  // Fetch the catalog entry on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/vocab/lookup?w=${encodeURIComponent(word)}`);
        if (cancelled) return;
        if (!res.ok) {
          setState({ kind: "error", message: `Error ${res.status}` });
          return;
        }
        const json = (await res.json()) as
          | { source: "catalog"; word: string; ptWord?: string; meaning: string; audioHash: { br: string; pt: string } }
          | { source: "fallback"; word: string; meaning: string }
          | { word: string; item: null };
        if ("source" in json && json.source === "catalog") {
          setState({
            kind: "found",
            item: { word: json.word, ptWord: json.ptWord, meaning: json.meaning, audioHash: json.audioHash },
          });
        } else if ("source" in json && json.source === "fallback") {
          setState({ kind: "fallback", item: { word: json.word, meaning: json.meaning } });
        } else {
          setState({ kind: "missing", word: json.word });
        }
      } catch (err) {
        if (cancelled) return;
        setState({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [word]);

  // Close on Esc or click outside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (e.target instanceof Node && ref.current.contains(e.target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    // Capture so we beat the word-span onClick (which would re-open).
    document.addEventListener("mousedown", onClick, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick, true);
    };
  }, [onClose]);

  const playAudio = () => {
    if (state.kind !== "found") return;
    const hash = variant === "br" ? state.item.audioHash.br : state.item.audioHash.pt;
    new Audio(audioUrl(hash, variant)).play().catch(() => {
      // ignore — user gesture may be needed on iOS Safari
    });
  };

  const onAdd = async () => {
    if (state.kind !== "found" || adding || added) return;
    setAdding(true);
    try {
      const item = state.item;
      // Phase B 4-arg getOrCreateVocabCard: stamps ["vocab", "story:{storyId}"].
      await getOrCreateVocabCard(item.word, item.meaning, "story", { storyId });
      setAdded(true);
    } catch (err) {
      console.error("Failed to add vocab card", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`Significado de ${word}`}
      className="absolute z-10 mt-1 left-1/2 -translate-x-1/2 w-64 max-w-[80vw] p-3 border border-border rounded-lg bg-background shadow-lg"
    >
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-medium">{word}</span>
        {state.kind === "found" && state.item.ptWord && state.item.ptWord !== word && (
          <span className="text-xs text-muted">PT: {state.item.ptWord}</span>
        )}
      </div>
      {state.kind === "loading" && (
        <span className="text-sm text-muted">Buscando…</span>
      )}
      {state.kind === "missing" && (
        <span className="text-sm text-muted">No está en el diccionario.</span>
      )}
      {state.kind === "error" && (
        <span className="text-sm text-red-500">{state.message}</span>
      )}
      {state.kind === "fallback" && (
        <>
          <span className="text-sm block">{state.item.meaning}</span>
          <span className="block mt-1 text-xs text-muted">(sin audio)</span>
        </>
      )}
      {state.kind === "found" && (
        <>
          <span className="text-sm block">{state.item.meaning}</span>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={playAudio}
              aria-label={`Pronunciar ${word}`}
              className="w-7 h-7 text-xs rounded-full bg-muted/20 hover:bg-muted/40"
            >
              🔊
            </button>
            <button
              type="button"
              onClick={onAdd}
              disabled={adding || added}
              className="px-2 py-1 text-xs rounded bg-primary text-fg disabled:opacity-50"
            >
              {added ? "✓ Agregado" : adding ? "Agregando…" : "Agregar al vocabulario"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
