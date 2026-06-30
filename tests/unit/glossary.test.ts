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
    for (const e of glossary) {
      if (e.tabu) expect(e.note).toBeDefined();
    }
  });
  it("todas las falseFriend tienen nota", () => {
    for (const e of glossary) {
      if (e.falseFriend) expect(e.note, `${e.word} needs a note`).toBeDefined();
    }
  });
});
