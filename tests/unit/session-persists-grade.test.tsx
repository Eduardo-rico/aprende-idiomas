// tests/unit/session-persists-grade.test.tsx
// @vitest-environment jsdom
//
// Regresión de la Ola 1. Durante meses el repaso diario no guardaba NADA:
// `SessionScreen` llevaba los totales de la sesión pero nunca llamaba a
// `submitAnswer`, y su propio comentario lo declaraba —«Per-card FSRS
// grading lands in a follow-up»—. El efecto era que ni los intervalos, ni
// los eventos, ni la maestría por concepto, ni /progreso se movían nunca.
//
// Estos tests fijan el contrato que lo impide: al calificar, SessionScreen
// avisa al padre con el ejercicio, la nota y el tiempo de respuesta.
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(() => cleanup());
import { SessionScreen } from "@/components/session/SessionScreen";

vi.mock("@/lib/stores/settings", () => ({
  useSettings: () => ({ variant: "pt-pt" }),
}));

const ejercicio = {
  id: "abc123",
  blockId: 6,
  lessonId: "b6-l1-conjuntivo",
  type: "flashcard" as const,
  difficulty: 1 as const,
  concepts: ["b6-conjuntivo-presente"],
  tags: [] as string[],
  data: { front: "que él venga", back: "que ele venha" },
};

function montar(props: Partial<Parameters<typeof SessionScreen>[0]> = {}) {
  const onGrade = vi.fn();
  const onFinish = vi.fn();
  render(
    <SessionScreen
      exercises={[ejercicio] as never}
      onFinish={onFinish}
      onClose={() => {}}
      lang="pt"
      onGrade={onGrade}
      {...props}
    />,
  );
  return { onGrade, onFinish };
}

/** Revela la tarjeta y pulsa uno de los cuatro botones de calificación.
 *  El panel se identifica por `data-testid="grade-panel"` y sus cuatro
 *  botones llevan las etiquetas Otra vez / Difícil / Bien / Fácil. */
function revelar() {
  const panel = screen.getByTestId("grade-panel");
  const antes = within(panel).getAllByRole("button");
  // Los botones del panel están deshabilitados hasta revelar; el botón de
  // revelar vive en la tarjeta.
  const card = screen.getByTestId("session-card");
  const botones = within(card).getAllByRole("button");
  fireEvent.click(botones[botones.length - 1]!);
  return antes;
}

function calificar(etiqueta: RegExp) {
  revelar();
  const panel = screen.getByTestId("grade-panel");
  const boton = within(panel)
    .getAllByRole("button")
    .find((b) => etiqueta.test(b.textContent ?? ""));
  expect(boton, `no encontré el botón ${etiqueta}`).toBeTruthy();
  fireEvent.click(boton!);
}

describe("la sesión avisa de cada calificación", () => {
  it("llama a onGrade con el ejercicio y la nota", () => {
    const { onGrade } = montar();
    calificar(/Bien/i);
    expect(onGrade).toHaveBeenCalledTimes(1);
    const [ex, rating] = onGrade.mock.calls[0]!;
    expect(ex.id).toBe("abc123");
    expect(rating).toBe(3);
  });

  it("distingue «Otra vez» (1) de «Bien» (3)", () => {
    const { onGrade } = montar();
    calificar(/Otra vez/i);
    expect(onGrade.mock.calls[0]![1]).toBe(1);
  });

  it("pasa un tiempo de respuesta medible", () => {
    const { onGrade } = montar();
    calificar(/Bien/i);
    const responseMs = onGrade.mock.calls[0]![2];
    expect(typeof responseMs).toBe("number");
    expect(responseMs).toBeGreaterThanOrEqual(0);
  });

  it("sigue avanzando aunque guardar falle", () => {
    // Si Dexie falla, perder la tarjeta siguiente sería peor que perder
    // el intervalo: la sesión continúa y el error se registra.
    const onGrade = vi.fn().mockRejectedValue(new Error("Dexie caído"));
    const onFinish = vi.fn();
    render(
      <SessionScreen
        exercises={[ejercicio] as never}
        onFinish={onFinish}
        onClose={() => {}}
        lang="pt"
        onGrade={onGrade}
      />,
    );
    calificar(/Bien/i);
    expect(onFinish).toHaveBeenCalledWith({ reviewed: 1, correct: 1 });
  });

  it("usa los intervalos reales cuando el padre los da", () => {
    montar({
      intervalsFor: () => ({ again: 60_000, hard: 3 * 86_400_000, good: 12 * 86_400_000, easy: 40 * 86_400_000 }),
    });
    revelar();
    // 12 días es un intervalo que los antiguos placeholders (siempre 4 d
    // para «Bien») nunca podían producir.
    expect(document.body.textContent).toMatch(/12\s*d/);
  });
});
