// components/session/SessionCardDisplay.tsx
// El chrome de la tarjeta activa en la sesión de REPASO — el flujo que se
// usa a diario con el FSRS, distinto del de práctica por lección, que va
// por `ExerciseRunner` con una tarjeta por tipo.
//
// Hasta E2#29 este componente miraba dos campos —`data.back` de flashcard
// y `data.answer` si era string— y todo lo demás caía a cadena vacía. Como
// el render es `{back && …}`, **1.640 de 2.131 ejercicios servibles (77 %)
// no enseñaban su respuesta al revelarla**: fill_blank 682, mediation 361,
// translation 239, error_correction 161, grammaticality_judgment 144,
// multiple_choice 52, matching 1. Las respuestas estaban ahí todo el
// tiempo, en `blanks[].answer`, `correct`, `target`, `modelAnswer`,
// `options[correctIndex]`.
//
// Ahora el qué-se-enseña vive en `lib/exercises/respuesta.ts`, con un test
// por tipo y otro que recorre el corpus entero exigiendo que ninguno se
// quede mudo — porque la avería duró meses justamente por no dar error: un
// tipo que no encaja devuelve «» y no se pinta nada.
"use client";
import type { Exercise } from "@/lib/data/zod-schemas";
import type { LanguageId } from "@/lib/locales";
import { db } from "@/lib/db/schema";
import { respuestaDe, frenteDe, alternativasDe } from "@/lib/exercises/respuesta";

type AnyEx = Exercise & { data: Record<string, unknown> };

/** La transcripción de un listening, que AHORA va detrás del revelado: en
 *  el frente era la respuesta impresa, y el ejercicio dejaba de ser de
 *  escucha. */
function apoyoFor(ex: Exercise): string | undefined {
  const d = (ex as AnyEx).data;
  if (ex.type === "flashcard") return typeof d.example === "string" ? d.example : undefined;
  if (ex.type === "listening") return typeof d.audioText === "string" ? d.audioText : undefined;
  return undefined;
}

/** Un `modelAnswer` de mediación son 25-65 palabras: a 28 px de serif
 *  desplaza la tarjeta entera. La talla se elige por longitud, no por
 *  tipo, que es lo que de verdad decide si cabe. */
const talla = (t: string, grande: string, medio: string, pequeno: string) =>
  t.length <= 24 ? grande : t.length <= 90 ? medio : pequeno;

const PROMPT: Record<string, string> = {
  flashcard: "¿Qué significa en español?",
  listening: "Escucha",
  fill_blank: "Completa la frase",
  translation: "Traduce al portugués",
  conjugation: "Conjuga el verbo",
  error_correction: "Corrige el error",
  matching: "Empareja",
  multiple_choice: "Elige la opción correcta",
  shadowing: "Repite en voz alta",
  verb_preposition: "Elige la preposición correcta",
  grammaticality_judgment: "¿Está bien formada?",
  mediation: "Media el texto",
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
  const front = frenteDe(exercise);
  const back = respuestaDe(exercise);
  const example = apoyoFor(exercise);
  const alternativas = alternativasDe(exercise);
  const esContrast = exercise.esContrast;
  const prompt = PROMPT[exercise.type] ?? "¿Qué significa?";

  return (
    <article
      className="mb-7 rounded-[14px] border border-rule bg-paper-raised px-10 py-12 text-center shadow-md"
      data-testid="session-card"
    >
      <div className="mb-[18px] text-[13px] text-ink-muted">{prompt}</div>
      {front && (
        <div
          className={`mb-2.5 whitespace-pre-line font-display font-semibold tracking-[-.02em] ${talla(front, "text-[44px]", "text-[28px]", "text-[18px] leading-relaxed")}`}
          data-testid="card-front"
        >
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
            <div
              className={`mb-2 whitespace-pre-line font-display font-medium ${talla(back, "text-[28px]", "text-[22px]", "text-[16px] leading-relaxed text-left")}`}
              data-testid="card-back"
            >
              {back}
            </div>
          )}
          {alternativas.length > 0 && (
            <div className="mb-2 text-[13px] text-ink-muted" data-testid="card-alternativas">
              También vale: {alternativas.join(" · ")}
            </div>
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
