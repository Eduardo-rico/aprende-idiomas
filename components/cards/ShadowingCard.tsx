// components/cards/ShadowingCard.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { audioUrl } from "@/lib/audio/resolve";
import { pickRecorderMime } from "@/lib/exercises/recorder";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ShadowingCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings();
  const d = resolveExerciseData(ex, variant) as { text: string; es: string; audioRef?: string; selfChecks?: string[] };
  const modelUrl = d.audioRef ? audioUrl(d.audioRef) : null;
  const [phase, setPhase] = useState<"idle" | "recording" | "recorded">("idle");
  const [recUrl, setRecUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const modelAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (recUrl) URL.revokeObjectURL(recUrl);
  }, [recUrl]);

  const playModel = () => { if (modelUrl) { modelAudioRef.current = new Audio(modelUrl); modelAudioRef.current.play(); } };

  const record = async () => {
    setError(null);
    modelAudioRef.current?.pause(); // R5: free the audio session before recording
    if (!navigator.mediaDevices?.getUserMedia) { setError("Tu navegador no permite grabar audio."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickRecorderMime((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: mime ?? "audio/webm" });
        if (recUrl) URL.revokeObjectURL(recUrl);
        setRecUrl(URL.createObjectURL(blob));
        setPhase("recorded");
        stream.getTracks().forEach((t) => t.stop());
      };
      recorderRef.current = rec; rec.start(); setPhase("recording");
    } catch { setError("No se pudo acceder al micrófono."); }
  };

  const stop = () => recorderRef.current?.stop();
  const playRecording = () => { if (recUrl) new Audio(recUrl).play(); };

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-sm text-muted-foreground text-center">Escucha y repite (shadowing):</div>
      <div className="text-xl text-center">{d.text}</div>
      <div className="text-sm text-center text-muted-foreground">{d.es}</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {modelUrl && <button onClick={playModel} className="px-4 py-2 border-2 border-border rounded-md">▶ Modelo</button>}
        {phase !== "recording"
          ? <button onClick={record} className="px-4 py-2 bg-primary rounded-md font-medium">🎙 Grabar</button>
          : <button onClick={stop} className="px-4 py-2 bg-error text-white rounded-md font-medium">⏹ Detener</button>}
        {phase === "recorded" && <button onClick={playRecording} className="px-4 py-2 border-2 border-border rounded-md">▶ Mi voz</button>}
      </div>
      {error && <div className="text-center text-sm text-error">{error}</div>}
      {phase === "recorded" && (
        <div className="space-y-3">
          {(d.selfChecks ?? []).length > 0 && (
            <ul className="text-sm space-y-1">
              {d.selfChecks!.map((c, i) => <li key={i} className="text-muted-foreground">• {c}</li>)}
            </ul>
          )}
          <button onClick={() => onSubmit("", true)} className="w-full px-4 py-2 bg-primary rounded-md font-medium">Listo — calificar</button>
        </div>
      )}
      {/* Saltar NO puntúa como acierto: el alumno no ha producido nada, y
          darlo por bueno mete en el FSRS evidencia que no existe. Mismo
          defecto que FillBlankCard tenía con `blanks.some()`, encontrado
          en el mismo barrido (E2#11). */}
      {phase === "idle" && !modelUrl && (
        <button onClick={() => onSubmit("", false)} className="w-full text-sm text-muted-foreground underline">Saltar grabación</button>
      )}
    </div>
  );
}
