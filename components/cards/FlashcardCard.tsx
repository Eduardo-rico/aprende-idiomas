// components/cards/FlashcardCard.tsx
"use client";
import type { Exercise } from "@/lib/exercise-resolver";
import { AudioButton } from "@/components/AudioButton";
import { useSettings } from "@/lib/stores/settings";
import { resolveExerciseData, resolveAudioHash } from "@/lib/exercise-resolver";
import { audioUrl } from "@/lib/audio/resolve";

interface Props { ex: Exercise; revealed: boolean; onReveal: () => void; }
export function FlashcardCard({ ex, revealed, onReveal }: Props) {
  const { variant } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const hash = resolveAudioHash(ex, variant);
  return (
    <div className="p-8 border-2 border-border rounded-2xl text-center space-y-6">
      <div className="text-xs text-muted uppercase">{revealed ? "Respuesta" : "Traduce al portugués"}</div>
      <div className="text-4xl font-display">{revealed ? data.back : data.front}</div>
      <div className="flex justify-center"><AudioButton src={audioUrl(hash)} /></div>
      {ex.esContrast && revealed && (
        <div className="text-sm text-muted italic">⚠️ {ex.esContrast}</div>
      )}
      {!revealed && (
        <button onClick={onReveal} className="text-sm text-muted hover:text-foreground">
          [Espacio] para revelar
        </button>
      )}
    </div>
  );
}
