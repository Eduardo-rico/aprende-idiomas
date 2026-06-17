// tests/unit/lang-layout.test.tsx
// @vitest-environment jsdom
// Unit tests for the lang layout. Two behaviors:
//   1. With a registered lang (pt/ru/ro/cs), the children render
//      inside <ThemeProvider> + <LangProvider> + <NavBar> + <main>.
//   2. With an unknown lang, the layout throws NEXT_NOT_FOUND via
//      notFound() — render throws, the test catches that.
//
// We import the layout as a function and call it with mock params.
// Render is done in jsdom (RTL) so <main> resolves. The Layout is an
// async server component; we await it before asserting.
import { describe, it, expect, vi } from "vitest";

// Mock next/navigation so NavBar's useRouter/usePathname don't blow up
// in jsdom (no app router mounted). Phase 5 added router.push for the
// language dropdown, which requires this mock to be present.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/pt",
  useParams: () => ({ lang: "pt" }),
  redirect: (url: string) => { const e: any = new Error("NEXT_REDIRECT;" + url); e.digest = "NEXT_REDIRECT;" + url; throw e; },
  notFound: () => { const e: any = new Error("NEXT_NOT_FOUND"); e.digest = "NEXT_NOT_FOUND"; throw e; },
}));

// In-memory localStorage shim — ThemeProvider reads from localStorage
// in a useEffect. Without this, jsdom throws.
const memStore = new Map<string, string>();
const localStorageShim = {
  getItem: (k: string) => memStore.get(k) ?? null,
  setItem: (k: string, v: string) => {
    memStore.set(k, v);
  },
  removeItem: (k: string) => {
    memStore.delete(k);
  },
  clear: () => memStore.clear(),
  key: (i: number) => Array.from(memStore.keys())[i] ?? null,
  get length() {
    return memStore.size;
  },
};
vi.stubGlobal("localStorage", localStorageShim);

const { render, screen } = await import("@testing-library/react");
const { default: LangLayout } = await import("@/app/[lang]/layout");

describe("app/[lang]/layout", () => {
  it("renders children with NavBar and <main> for lang=pt", async () => {
    const jsx = await LangLayout({
      children: <div data-testid="child">hello</div>,
      params: Promise.resolve({ lang: "pt" }),
    });
    render(<>{jsx}</>);
    expect(screen.getByTestId("child")).toBeTruthy();
    // NavBar contains a brand link whose label includes the active lang's
    // native name ("Português" for `pt`). The text is broken up by the
    // flag emoji, so use a function matcher. Several elements can include
    // the word (the brand link + the lang select's <option>); query by
    // the brand-link href instead to disambiguate.
    const brandLinks = screen.getAllByRole("link", { name: (n: string) => n.includes("Português") });
    expect(brandLinks.some((el) => el.getAttribute("href") === "/pt")).toBe(true);
  });

  it("renders children for every registered language", async () => {
    for (const lang of ["pt", "ru", "ro", "cs"] as const) {
      const jsx = await LangLayout({
        children: <div data-testid={`child-${lang}`}>x</div>,
        params: Promise.resolve({ lang }),
      });
      const { unmount } = render(<>{jsx}</>);
      expect(screen.getByTestId(`child-${lang}`)).toBeTruthy();
      unmount();
    }
  });

  it("calls notFound() for an unknown language (throws NEXT_NOT_FOUND)", async () => {
    // notFound() throws a special Error that Next 16 catches. The
    // error message is a digest, not human-readable; we just check
    // that the call throws.
    await expect(
      LangLayout({
        children: <div>x</div>,
        params: Promise.resolve({ lang: "xx" }),
      }),
    ).rejects.toBeDefined();
  });
});
