// tests/unit/portuguese-tokenize.test.ts
import { describe, it, expect } from "vitest";
import { tokenize } from "@/lib/text/portuguese-tokenize";

describe("portuguese-tokenize", () => {
  it("keeps the original spacing so the prose reflows faithfully", () => {
    const src = "Olá mundo!";
    const out = tokenize(src);
    const joined = out.map((t) => t.raw).join("");
    expect(joined).toBe(src);
  });

  it("emits one word token per word and one space between", () => {
    const out = tokenize("a b c");
    expect(out.filter((t) => t.kind === "word").map((t) => t.norm)).toEqual(["a", "b", "c"]);
    expect(out.filter((t) => t.kind === "space").length).toBe(2);
  });

  it("emits punctuation as its own token with empty norm", () => {
    const out = tokenize("sim? não!");
    const puncts = out.filter((t) => t.kind === "punct").map((t) => t.raw);
    expect(puncts).toEqual(["?", "!"]);
    const words = out.filter((t) => t.kind === "word").map((t) => t.norm);
    expect(words).toEqual(["sim", "não"]);
  });

  it("preserves diacritics and lowercases the norm", () => {
    const out = tokenize("Água é bom");
    const norms = out.filter((t) => t.kind === "word").map((t) => t.norm);
    expect(norms).toEqual(["água", "é", "bom"]);
  });

  it("strips leading and trailing apostrophes from the norm", () => {
    // "l'água" — the l' should not block catalog lookup of "água"
    const out = tokenize("l'água");
    const word = out.find((t) => t.kind === "word")!;
    // raw is preserved; norm drops apostrophes
    expect(word.raw).toBe("l'água");
    // norm will be the whole word lowercased with apostrophes stripped;
    // for a multi-letter apostrophe-delimited word the catalog entry
    // wouldn't match anyway, so we only assert the apostrophes are gone.
    expect(word.norm).not.toMatch(/'/);
  });

  it("handles paragraph breaks as whitespace runs", () => {
    const src = "Parágrafo um.\n\nParágrafo dois.";
    const out = tokenize(src);
    const spaces = out.filter((t) => t.kind === "space");
    // Should include the "\n\n" run as one space token.
    expect(spaces.some((s) => s.raw.includes("\n"))).toBe(true);
  });

  it("returns stable start/end indices that slice back to the source", () => {
    const src = "João foi à padaria.";
    const out = tokenize(src);
    for (const tok of out) {
      expect(src.slice(tok.start, tok.end)).toBe(tok.raw);
    }
  });

  it("emits em-dashes and curly quotes as their own punct tokens", () => {
    const out = tokenize("\"olá\" — ele disse");
    const puncts = out.filter((t) => t.kind === "punct").map((t) => t.raw);
    // " " " " "—" " " should each appear as a punct token
    expect(puncts).toContain("—");
    expect(puncts).toContain("“");
    expect(puncts).toContain("”");
  });

  it("treats digits as part of a word (so '5%' becomes one word + one punct)", () => {
    const out = tokenize("5% off");
    const words = out.filter((t) => t.kind === "word").map((t) => t.norm);
    const puncts = out.filter((t) => t.kind === "punct").map((t) => t.raw);
    expect(words).toEqual(["5", "off"]);
    expect(puncts).toEqual(["%"]);
  });
});
