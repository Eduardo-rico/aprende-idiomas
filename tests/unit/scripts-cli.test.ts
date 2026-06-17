// tests/unit/scripts-cli.test.ts
// Phase 5 (multi-idioma): `parseLangArgs` extrae `--lang=<id>` con
// default "pt", tolera `--lang <id>`, lanza con `--lang` inválido.
import { describe, it, expect } from "vitest";
import { parseLangArgs, noopForLang } from "@/scripts/lib/cli";

describe("parseLangArgs", () => {
  it("default es 'pt' cuando no se pasa --lang", () => {
    const out = parseLangArgs([]);
    expect(out.lang).toBe("pt");
    expect(out.rest).toEqual([]);
  });

  it("acepta --lang=ru", () => {
    const out = parseLangArgs(["--lang=ru", "--block", "3"]);
    expect(out.lang).toBe("ru");
    expect(out.rest).toEqual(["--block", "3"]);
  });

  it("acepta --lang pt (forma con espacio)", () => {
    const out = parseLangArgs(["--lang", "ro", "--force"]);
    expect(out.lang).toBe("ro");
    expect(out.rest).toEqual(["--force"]);
  });

  it("acepta cada uno de los 4 idiomas", () => {
    for (const lang of ["pt", "ru", "ro", "cs"] as const) {
      const out = parseLangArgs([`--lang=${lang}`]);
      expect(out.lang).toBe(lang);
    }
  });

  it("lanza con --lang=<desconocido>", () => {
    expect(() => parseLangArgs(["--lang=xx"])).toThrow(/Unknown --lang/);
  });

  it("lanza con --lang sin valor", () => {
    expect(() => parseLangArgs(["--lang"])).toThrow(/requires a value/);
  });

  it("preserva el resto de los args en orden", () => {
    const out = parseLangArgs(["--force", "--block=2", "--dry-run"]);
    expect(out.lang).toBe("pt");
    expect(out.rest).toEqual(["--force", "--block=2", "--dry-run"]);
  });
});

describe("noopForLang", () => {
  it("devuelve un mensaje que incluye el nombre del script y el lang", () => {
    const msg = noopForLang("ru", "verify-content");
    expect(msg).toContain("verify-content");
    expect(msg).toContain('"ru"');
  });
});
