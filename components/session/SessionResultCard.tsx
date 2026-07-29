// components/session/SessionResultCard.tsx
// Shared "session done / session error" terminal card. Was hand-rolled 5
// times across app/[lang]/review/page.tsx (×2), app/[lang]/practice/[lessonId]/
// PracticeClient.tsx (×2), and app/[lang]/practicar/srs/PracticarSrsInner.tsx
// (×1 — only the error variant). Now one component.
//
// Per the SessionFallback chrome (B.1.b), the outer wrapper uses Manual
// Lusitano tokens. The 3 caller sites previously used shadcn aliases
// (`text-muted`, `border-border`, `bg-primary`) which resolve to the same
// colors via app/globals.css --color-muted / --color-border / --color-primary
// aliases. Migrating to explicit names inside this component is purely a
// readability change, not a visual one.
import type { ReactNode } from "react";

export type SessionResultCardProps =
  | {
      variant: "error";
      message: string;
      action?: ReactNode;
    }
  | {
      variant: "done";
      headline: string;
      pct: number;
      correct: number;
      reviewed: number;
      subtitle?: ReactNode;
      actions: ReactNode;
    }
  | {
      // Cola vacía: no hay nada que repasar. No lleva porcentaje porque no
      // es una sesión terminada — enseñar "0 %" a quien va al día sería
      // castigarlo por estar al día. Antes este estado no existía y la
      // ruta hacía router.replace('/learn'), que redirige de vuelta aquí:
      // un bucle infinito, y era el estado por defecto de todo usuario
      // nuevo.
      variant: "empty";
      headline: string;
      message: string;
      actions: ReactNode;
    };

export function SessionResultCard(props: SessionResultCardProps) {
  return (
    <div
      className="mx-auto max-w-md px-4 py-16 text-center"
      data-testid="session-result-card"
    >
      <div className="space-y-4">
        {props.variant === "error" ? (
          <>
            <h1 className="font-display text-2xl">No se pudo iniciar la sesión</h1>
            <p className="text-sm text-ink-muted">{props.message}</p>
            {props.action && (
              <div className="flex justify-center">{props.action}</div>
            )}
          </>
        ) : props.variant === "empty" ? (
          <>
            <h1 className="font-display text-3xl">{props.headline}</h1>
            <p className="text-ink-muted">{props.message}</p>
            <div className="flex justify-center gap-2 pt-2">{props.actions}</div>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl">{props.headline}</h1>
            <div className="font-display text-6xl">{props.pct}%</div>
            <p className="text-ink-muted">
              {props.correct} de {props.reviewed} correctas
            </p>
            {props.subtitle && (
              <p className="text-sm text-ink-muted">{props.subtitle}</p>
            )}
            <div className="flex justify-center gap-2">{props.actions}</div>
          </>
        )}
      </div>
    </div>
  );
}