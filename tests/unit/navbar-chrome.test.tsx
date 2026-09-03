// tests/unit/navbar-chrome.test.tsx
// @vitest-environment jsdom
// El chrome (título, wordmark, menú, selector) depende de `lang` igual
// que el contenido. Antes de este test, /ro servía 81 series rumanas
// bajo una cabecera «Aprende Português» con menú en portugués y el
// selector marcando 🇵🇹 — el loader resolvía por lengua, el layout no.
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/ro",
  useParams: () => ({ lang: "ro" }),
}));

const memStore = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => memStore.get(k) ?? null,
  setItem: (k: string, v: string) => { memStore.set(k, v); },
  removeItem: (k: string) => { memStore.delete(k); },
  clear: () => memStore.clear(),
  key: (i: number) => Array.from(memStore.keys())[i] ?? null,
  get length() { return memStore.size; },
});

const { render, screen, cleanup } = await import("@testing-library/react");
const { NavBar } = await import("@/components/NavBar");
const { LangProvider } = await import("@/lib/stores/lang-context");
const { generateMetadata } = await import("@/app/[lang]/layout");
const { LANGUAGES, LANG_CHROME } = await import("@/lib/locales");

afterEach(() => cleanup());

describe("NavBar: chrome por lengua", () => {
  it("en /ro el wordmark, el menú y el selector son rumanos", () => {
    render(<LangProvider lang="ro"><NavBar /></LangProvider>);
    expect(screen.getByRole("link", { name: "Învață Română" }).getAttribute("href")).toBe("/ro");
    expect(screen.queryByText("Aprende Português")).toBeNull();
    for (const label of ["Învață", "Carte", "Povești", "Citește"]) {
      expect(screen.getByRole("link", { name: label })).toBeTruthy();
    }
    expect(screen.queryByRole("link", { name: "Estudar" })).toBeNull();
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("ro");
    expect(select.selectedOptions[0]?.textContent).toContain("🇷🇴");
    expect(select.selectedOptions[0]?.textContent).toContain("Română");
  });

  it("en /pt sigue exactamente el chrome portugués de siempre", () => {
    render(<LangProvider lang="pt"><NavBar /></LangProvider>);
    expect(screen.getByRole("link", { name: "Aprende Português" }).getAttribute("href")).toBe("/pt");
    for (const label of ["Estudar", "Livro", "Histórias", "Ler", "Progresso", "Cuenta"]) {
      expect(screen.getByRole("link", { name: label })).toBeTruthy();
    }
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("pt");
  });

  it("el selector marca la lengua de la RUTA aunque el store diga otra cosa", async () => {
    const { useSettings } = await import("@/lib/stores/settings");
    useSettings.getState().setLanguage("pt");
    render(<LangProvider lang="cs"><NavBar /></LangProvider>);
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("cs");
  });
});

describe("<title> por lengua (generateMetadata del lang layout)", () => {
  it("cada lengua registrada tiene catálogo de chrome completo", () => {
    for (const l of LANGUAGES) {
      const c = LANG_CHROME[l];
      expect(c.title.length).toBeGreaterThan(0);
      for (const k of ["estudar", "livro", "historias", "ler", "progreso", "cuenta"] as const) {
        expect(c.nav[k].length, `${l}.nav.${k}`).toBeGreaterThan(0);
      }
    }
  });
  it("/ro → «Învață Română», /pt → «Aprende Português»", async () => {
    expect((await generateMetadata({ params: Promise.resolve({ lang: "ro" }) })).title).toBe("Învață Română");
    expect((await generateMetadata({ params: Promise.resolve({ lang: "pt" }) })).title).toBe("Aprende Português");
  });

  // Fase G: las dos lenguas antiguas. Van aquí y no en un fichero aparte
  // porque la pregunta es la misma. `grc` tiene TRES letras —es el primer
  // código de tres del proyecto— y esta línea es lo que comprueba que el
  // layout lo resuelve; por HTTP no se puede ver, porque toda ruta de
  // `/[lang]` redirige a login antes de renderizar.
  it("/la → «Disce Latine», /grc → «Μάνθανε Ἑλληνιστί» (código de 3 letras)", async () => {
    expect((await generateMetadata({ params: Promise.resolve({ lang: "la" }) })).title).toBe("Disce Latine");
    expect((await generateMetadata({ params: Promise.resolve({ lang: "grc" }) })).title).toBe("Μάνθανε Ἑλληνιστί");
  });
});
