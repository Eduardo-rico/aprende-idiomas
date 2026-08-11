import { describe, it, expect } from "vitest";
import glossary from "@/lib/data/languages/pt/glossary.json";
import { glossarySchema } from "@/lib/data/languages/pt/glossary-schema";

describe("glossary.json", () => {
  it("valida contra schema", () => {
    expect(() => glossarySchema.parse(glossary)).not.toThrow();
  });
  it("tiene ≥40 entradas", () => {
    expect(glossary.length).toBeGreaterThanOrEqual(40);
  });
  it("ninguna entrada tabu sin nota", () => {
    // Se itera el resultado de `parse`, no el JSON crudo: hoy NINGUNA de las
    // 49 entradas trae `tabu`, así que el tipo inferido del import no conoce
    // el campo y `e.tabu` no compila. El schema sí lo declara (opcional), y
    // este test es el guardián para cuando la primera entrada tabú entre.
    for (const e of glossarySchema.parse(glossary)) {
      if (e.tabu) expect(e.note).toBeDefined();
    }
  });
  it("todas las falseFriend tienen nota", () => {
    for (const e of glossary) {
      if (e.falseFriend) expect(e.note, `${e.word} needs a note`).toBeDefined();
    }
  });
});
