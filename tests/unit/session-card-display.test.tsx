// tests/unit/session-card-display.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { SessionCardDisplay } from "@/components/session/SessionCardDisplay";
import type { Exercise } from "@/lib/data/zod-schemas";

afterEach(() => cleanup());

const flashcardEx = {
  id: "x1",
  type: "flashcard",
  blockId: 1,
  lessonId: "b1-l1",
  data: { front: "poupar", back: "ahorrar", example: "Vou poupar dinheiro." },
  concepts: ["b1-vocab"],
  tags: ["vocab"],
  difficulty: 1,
  esContrast: "no es popar — es ahorrar",
} as unknown as Exercise;

describe("SessionCardDisplay", () => {
  it("renders the front word in display serif", () => {
    render(
      <SessionCardDisplay
        exercise={flashcardEx}
        reveal={false}
        onReveal={() => {}}
        onPlayAudio={() => {}}
        lang="pt"
      />,
    );
    expect(screen.getByText("poupar")).toBeTruthy();
    expect(screen.getByText("¿Qué significa en español?")).toBeTruthy();
  });

  it("renders the reveal block when reveal=true", () => {
    render(
      <SessionCardDisplay
        exercise={flashcardEx}
        reveal
        onReveal={() => {}}
        onPlayAudio={() => {}}
        lang="pt"
      />,
    );
    expect(screen.getByText("ahorrar")).toBeTruthy();
    expect(screen.getByText(/Vou poupar dinheiro/)).toBeTruthy();
    expect(screen.getByTestId("es-contrast").textContent).toMatch(/no es popar/);
  });

  it("calls onReveal when 'Mostrar respuesta' is clicked", () => {
    const onReveal = vi.fn();
    render(
      <SessionCardDisplay
        exercise={flashcardEx}
        reveal={false}
        onReveal={onReveal}
        onPlayAudio={() => {}}
        lang="pt"
      />,
    );
    fireEvent.click(screen.getByTestId("reveal-button"));
    expect(onReveal).toHaveBeenCalledTimes(1);
  });
});

// ── E2#29: la tarjeta enseña la respuesta de CADA tipo ────────────────
//
// El componente miraba dos campos y dejaba mudos a 1.640 de 2.131
// ejercicios servibles. Estos tests son el flujo completo —renderizar,
// revelar, leer— porque `respuesta.ts` puede estar perfecto y el
// componente seguir sin pintarlo: el render era `{back && …}` y el fallo
// vivía en la unión de los dos.
const conDatos = (type: string, data: unknown) =>
  ({ id: "x", type, blockId: 1, lessonId: "b1-l1", data, concepts: [], tags: [], difficulty: 1 }) as unknown as Exercise;

const revelado = (ex: Exercise) => {
  render(
    <SessionCardDisplay exercise={ex} reveal onReveal={() => {}} onPlayAudio={() => {}} lang="pt" />,
  );
  return screen.getByTestId("reveal-block").textContent ?? "";
};

describe("la tarjeta enseña la respuesta de cada tipo", () => {
  it("fill_blank: la respuesta del hueco", () => {
    expect(revelado(conDatos("fill_blank", { sentence: "A minha ___ cantou.", blanks: [{ answer: "irmã", alternatives: ["mãe"] }] })))
      .toContain("irmã");
  });
  it("fill_blank: y las alternativas, que también se aceptan", () => {
    expect(revelado(conDatos("fill_blank", { sentence: "A minha ___ cantou.", blanks: [{ answer: "irmã", alternatives: ["mãe"] }] })))
      .toContain("mãe");
  });
  it("translation: el texto de destino", () => {
    expect(revelado(conDatos("translation", { source: "Tenho fome.", target: "Tengo hambre." }))).toContain("Tengo hambre.");
  });
  it("error_correction: la frase corregida", () => {
    expect(revelado(conDatos("error_correction", { sentence: "A gente vamos.", correct: "A gente vai." }))).toContain("A gente vai.");
  });
  it("multiple_choice: la opción correcta, no su índice", () => {
    expect(revelado(conDatos("multiple_choice", { question: "¿?", options: ["o senhor", "você"], correctIndex: 0 }))).toContain("o senhor");
  });
  it("grammaticality_judgment: la reparación", () => {
    expect(revelado(conDatos("grammaticality_judgment", { sentence: "Não paro de estornudar.", verdict: false, repair: "Não paro de espirrar." })))
      .toContain("espirrar");
  });
  it("mediation: la respuesta modelo", () => {
    expect(revelado(conDatos("mediation", { sourceText: "Era uma vez…", modelAnswer: "O rei partiu." }))).toContain("O rei partiu.");
  });
  it("matching: los pares", () => {
    expect(revelado(conDatos("matching", { pairs: [{ left: "trem (BR)", right: "comboio" }] }))).toContain("comboio");
  });
});

describe("y NO enseña de más antes de revelar", () => {
  const sinRevelar = (ex: Exercise) => {
    render(
      <SessionCardDisplay exercise={ex} reveal={false} onReveal={() => {}} onPlayAudio={() => {}} lang="pt" />,
    );
    return screen.getByTestId("session-card").textContent ?? "";
  };
  it("un listening no imprime su transcripción: si no, se lee en vez de escucharse", () => {
    const t = sinRevelar(conDatos("listening", { audioText: "A rua fica perto da esquina.", question: "¿Qué hay cerca?", answer: "La calle" }));
    expect(t).toContain("¿Qué hay cerca?");
    expect(t).not.toContain("perto da esquina");
  });
  it("un error_correction enseña la frase MALA, que es la que hay que corregir", () => {
    const t = sinRevelar(conDatos("error_correction", { sentence: "A gente vamos.", correct: "A gente vai." }));
    expect(t).toContain("A gente vamos.");
    expect(t).not.toContain("A gente vai.");
  });
  it("no hay bloque de revelado mientras no se revela", () => {
    sinRevelar(conDatos("translation", { source: "Tenho fome.", target: "Tengo hambre." }));
    expect(screen.queryByTestId("reveal-block")).toBeNull();
  });
});
