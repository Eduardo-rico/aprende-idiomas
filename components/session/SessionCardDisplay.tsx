// components/session/SessionCardDisplay.tsx
// Manual Lusitano chrome for the active exercise card. Matches
// design-mockups/sesion.html:48-62. For A.3 only `flashcard` exercises
// get the full chrome (front word in serif + IPA + big audio button +
// reveal block with answer + example + Contraste ES chip). Other
// exercise types fall through to the same chrome with whatever fields
// they expose — the per-type affordances (fill_blank inline, etc.)
// land in a follow-up. See task-A.3-report.md concerns.
"use client";
import type { Exercise } from "@/lib/data/zod-schemas";
import type { LanguageId } from "@/lib/locales";
import { db } from "@/lib/db/schema";

type FlashcardData = { front: string; back: string; example?: string };
type ListeningData = { audioText: string; question: string };
type AnyEx = Exercise & { data: Record<string, unknown> };

function frontFor(ex: Exercise): string {
  const d = (ex as AnyEx).data;
  switch (ex.type) {
    case "flashcard":
      return (d as FlashcardData).front;
    case "listening":
      return (d as ListeningData).audioText;
    default:
      // Fall back to first string-looking field we find.
      const first = Object.values(d).find((v) => typeof v === "string");
      return typeof first === "string" ? first : "";
  }
}

function backFor(ex: Exercise): string {
  const d = (ex as AnyEx).data;
  if (ex.type === "flashcard") return (d as FlashcardData).back;
  const answer = (d as Record<string, unknown>).answer;
  return typeof answer === "string" ? answer : "";
}

function exampleFor(ex: Exercise): string | undefined {
  const d = (ex as AnyEx).data;
  if (ex.type === "flashcard") return (d as FlashcardData).example;
  return undefined;
}

const PROMPT: Record<string, string> = {
  flashcard: "¿Qué significa en español?",
  listening: "Escuchá",
  fill_blank: "Completá la frase",
  translation: "Traducí al portugués",
  conjugation: "Conjugá el verbo",
  error_correction: "Corregí el error",
  matching: "Emparejá",
  multiple_choice: "Elegí la opción correcta",
  shadowing: "Repetí en voz alta",
  verb_preposition: "Elegí la preposición correcta",
};

export function SessionCardDisplay({
  exercise,
  reveal,
  onReveal,
  onPlayAudio,
  lang: _lang,
  rule,
  contrastText,
}: {
  exercise: Exercise;
  reveal: boolean;
  onReveal: () => void;
  onPlayAudio: () => void;
  lang: LanguageId;
  rule?: string;
  contrastText?: string;
}) {
  const front = frontFor(exercise);
  const back = backFor(exercise);
  const example = exampleFor(exercise);
  const esContrast = exercise.esContrast;
  const prompt = PROMPT[exercise.type] ?? "¿Qué significa?";

  return (
    <article
      className="mb-7 rounded-[14px] border border-rule bg-paper-raised px-10 py-12 text-center shadow-md"
      data-testid="session-card"
    >
      <div className="mb-[18px] text-[13px] text-ink-muted">{prompt}</div>
      {front && (
        <div className="mb-2.5 font-display text-[44px] font-semibold tracking-[-.02em]">
          {front}
        </div>
      )}
      <button
        type="button"
        aria-label="Reproducir audio"
        onClick={onPlayAudio}
        className="mx-auto mb-2 mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-lesson text-[22px] text-white shadow-sm hover:opacity-90"
      >
        ▶
      </button>
      <div className="text-[12px] text-ink-faint">escuchar</div>

      {!reveal ? (
        <button
          type="button"
          onClick={onReveal}
          className="mt-7 rounded-md border border-rule-strong bg-paper-raised px-4 py-2 text-[13px] text-ink-muted hover:bg-paper-sunken"
          data-testid="reveal-button"
        >
          Mostrar respuesta
        </button>
      ) : (
        <div className="mt-7 border-t border-dashed border-rule pt-6" data-testid="reveal-block">
          {back && (
            <div className="mb-2 font-display text-[28px] font-medium">{back}</div>
          )}
          {example && (
            <div className="font-display text-[16px] italic text-ink-muted">
              &ldquo;{example}&rdquo;
            </div>
          )}
          {esContrast && (
            <div
              className="mx-auto mt-4 inline-block rounded-md bg-info-soft px-3.5 py-2 text-left text-[13px] text-info"
              data-testid="es-contrast"
            >
              <strong>Contraste ES:</strong> {esContrast}
            </div>
          )}
          {rule && (
            <div className="mt-4 p-3 bg-paper-sunken border border-rule rounded-md text-left">
              <div className="text-xs uppercase tracking-[0.07em] text-ink-muted font-semibold mb-1.5">
                Regla
              </div>
              <p className="text-sm text-ink-muted">{rule}</p>
              {contrastText && (
                <p className="text-sm text-ink-faint italic mt-1.5">{contrastText}</p>
              )}
            </div>
          )}
        </div>
      )}
      {reveal && (
        <button
          className="mt-3 text-xs text-ink-faint hover:text-ink-muted underline block mx-auto"
          onClick={() =>
            db.telemetry.add({
              ts: new Date(),
              level: "warn",
              source: "extra-review",
              message: String(exercise.id ?? "unknown"),
            })
          }
        >
          + Repaso extra
        </button>
      )}
    </article>
  );
}
