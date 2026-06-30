"use client";
import { useState } from "react";
import { Button } from "@/components/ui";
import { enqueueProduction } from "@/lib/production/queue";

interface Props {
  topic: string;           // "Describe tu rutina matutina en portugués."
  blockId: number;
  variant: "pt-br" | "pt-pt";
  onDone: () => void;
}

const MIN_WORDS = 20;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function ProductionCard({ topic, blockId, variant, onDone }: Props) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const wordCount = countWords(text);

  async function handleSubmit() {
    if (wordCount < MIN_WORDS) {
      setError(`Escribe al menos ${MIN_WORDS} palabras (tienes ${wordCount}).`);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await enqueueProduction({ topic, text, wordCount, variant, blockId });
      setSubmitted(true);
    } catch {
      setError("No se pudo guardar la respuesta. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-paper-raised border border-rule rounded-xl p-8">
      <div className="text-xs uppercase tracking-[0.07em] text-lesson bg-lesson-soft px-3 py-1.5 rounded-full inline-block mb-6 font-semibold">
        Producción
      </div>

      {submitted ? (
        <div className="text-center space-y-4 py-4">
          <p className="font-display text-2xl text-lesson">¡Enviado!</p>
          <p className="text-ink-muted text-sm">Feedback diferido en 24h</p>
          <Button variant="primary" onClick={onDone}>Continuar</Button>
        </div>
      ) : (
        <>
          <p className="font-display text-[20px] mb-4 leading-snug">{topic}</p>
          <p className="text-sm text-ink-muted mb-4">
            Escribe al menos {MIN_WORDS} palabras en português.
          </p>
          <textarea
            className="w-full min-h-[140px] rounded-lg border border-rule bg-paper p-3 text-ink resize-y focus:outline-none focus:ring-2 focus:ring-lesson text-base"
            placeholder="Escreva aqui…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            disabled={saving}
          />
          <div className="flex items-center justify-between mt-2 mb-4">
            <span className={`text-xs ${wordCount >= MIN_WORDS ? "text-lesson" : "text-ink-faint"}`}>
              {wordCount} / {MIN_WORDS} palabras
            </span>
          </div>
          {error && (
            <p className="text-sm text-error mb-4">{error}</p>
          )}
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={saving || wordCount < MIN_WORDS}
            >
              {saving ? "Guardando…" : "Enviar"}
            </Button>
            <Button variant="ghost" onClick={onDone}>
              Saltar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
