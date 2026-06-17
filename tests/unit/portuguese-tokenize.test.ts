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
    // A trailing apostrophe like in "café'" is trimmed from the norm
    // so a catalog lookup of "café" still matches.
    const out = tokenize("um café'");
    const cafe = out.find((t) => t.kind === "word" && t.norm.startsWith("café"))!;
    expect(cafe.norm).toBe("café");
  });

  it("handles paragraph breaks as whitespace runs", () => {
    const src = "Parágrafo um.\n\nParágrafo dois.";
    const out = tokenize(src);
    const spaces = out.filter((t) => t.kind === "space");
    expect(spaces.some((s) => s.raw.includes("\n"))).toBe(true);
  });

  it("returns stable start/end indices that slice back to the source", () => {
    const src = "João foi à padaria.";
    const out = tokenize(src);
    for (const tok of out) {
      expect(src.slice(tok.start, tok.end)).toBe(tok.raw);
    }
  });

  it("emits em-dashes as their own punct tokens", () => {
    const out = tokenize('olá — ele disse');
    const puncts = out.filter((t) => t.kind === "punct").map((t) => t.raw);
    expect(puncts).toContain("—");
  });

  it("treats digits as part of a word (so '5%' becomes one word + one punct)", () => {
    const out = tokenize("5% off");
    const words = out.filter((t) => t.kind === "word").map((t) => t.norm);
    const puncts = out.filter((t) => t.kind === "punct").map((t) => t.raw);
    expect(words).toEqual(["5", "off"]);
    expect(puncts).toEqual(["%"]);
  });
});
