// La des-flexión nominal del lookup: NO inventa traducciones — solo
// genera candidatos a singular para reintentar contra entradas que YA
// existen en el catálogo o el fallback. Conservadora a propósito.
import { describe, it, expect } from "vitest";
import { candidatosSingular } from "@/lib/text/deflexion";

describe("candidatosSingular", () => {
  it("plurales regulares en -s", () => {
    expect(candidatosSingular("gatos")).toContain("gato");
    expect(candidatosSingular("janelas")).toContain("janela");
  });
  it("plurales en -es", () => {
    expect(candidatosSingular("flores")).toContain("flor");
    expect(candidatosSingular("rapazes")).toContain("rapaz");
  });
  it("plurales en -ões/-ães/-ãos → -ão", () => {
    expect(candidatosSingular("corações")).toContain("coração");
    expect(candidatosSingular("cães")).toContain("cão");
    expect(candidatosSingular("mãos")).toContain("mão");
  });
  it("plurales en -ais/-éis/-óis/-is → -al/-el/-ol/-il", () => {
    expect(candidatosSingular("animais")).toContain("animal");
    expect(candidatosSingular("papéis")).toContain("papel");
    expect(candidatosSingular("lençóis")).toContain("lençol");
    expect(candidatosSingular("barris")).toContain("barril");
  });
  it("plurales en -ns → -m", () => {
    expect(candidatosSingular("jardins")).toContain("jardim");
    expect(candidatosSingular("bens")).toContain("bem");
  });
  it("no propone el propio término ni candidatos para singulares cortos", () => {
    expect(candidatosSingular("gato")).not.toContain("gato");
    expect(candidatosSingular("os")).toEqual([]);
  });
});
